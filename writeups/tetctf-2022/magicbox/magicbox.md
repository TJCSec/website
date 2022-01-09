---
title: TetCTF 2022 - magicbox
date: 2022-01-07
slug: /writeups/tetctf-2022-magicbox
excerpt: Reversing a NOR machine
author: Darin Mao
---

magicbox was a simple VM reversing challenge from TetCTF 2022.

# Description
> My machine is running very simple, can you understand it?

Files:
- [magicbox.zip](https://drive.google.com/file/d/1zbTjPHPkO1RJAQIs2FbOqN56z1HWE0JT/view?usp=sharing) (extract password `TetCTF-7c71accd8175c365688a233a14fc4a1a`)

I'd like to take a moment to say Google Drive downloads suck! There's no easy way to download this from the terminal. If you're a CTF organizer, please take note!

# Reversing
We're given a Windows PE32 (yuck). The challenge description strongly suggests some kind of VM.

```
$ ./MagicBox.exe
Password:asdfasdfasdf
sdfa
sdf
asdf
Wrong
```

The startup code for Windows binaries is a lot more convoluted than the glibc call to `__libc_start_main` we're used to. I'm not that experienced in Windows reversing, but `entry` calls `FUN_004010ad` and later exits with its return value as the exit code, so that's probably `main`. With a bit of renaming and retyping, the decompilation is rather clean. Here it is, with some hand-rewriting.

```c
unsigned short *mem;

int main()
{
  unsigned short *buf;

  buf = VirtualAlloc((LPVOID) 0x0, 0x20000, 0x1000, 4);
  mem = buf;
  if (buf == NULL) {
    printf("Failed to init program\n");
  }
  else {
    memcpy(buf + 300, &prog, 0x3246);
    *buf = 300;
    if (!run_vm()) {
      printf("Failed to run program\n");
    }
    if (mem != NULL) {
      VirtualFree(mem, 0, 0x8000);
      mem = NULL;
    }
  }
  return 0;
}

char run_vm()
{
  unsigned int pc;
  unsigned short a;
  unsigned short b;
  unsigned short c;
  unsigned short nor;

  while (mem[0] != 0xffff) {
    // handle IO
    if (mem[4] == 1) {
      mem[4] = 0;
      printf("%c", (unsigned int) mem[3]);
    }
    if (mem[6] == 1) {
      mem[6] = 0;
      scanf("%c", (char *) &mem[5]);
    }

    // fetch instruction
    pc = (unsigned int) mem[0];
    a = mem[pc];
    b = mem[pc + 1];
    c = mem[pc + 2];
    mem[0] += 3;

    // execute instruction
    a = mem[a];
    b = mem[b];
    nor = ~(b | a);
    mem[c] = nor;

    // this is just `rol nor, 1`
    mem[1] = nor << 1 | (ushort)(-1 < (short)(b | a));
  }
  return 1;
```

This VM only has one instruction: `NOR`. An instruction is made up of three numbers `a`, `b`, and `c`, and the `NOR` instruction sets `mem[c] <- mem[a] NOR mem[b]`. Jumps are possible because `PC` is at `mem[0]`, which can be written to.

# Disassembly
My immediate thought was to just reimplement the VM and output some basic disassembly. First, I dumped the entire `prog` into a file. Since I already had most of the C code, I just added a bit of extra code to load the program into memory and run it. I chose not to just put `prog` in my code because I expected to do further analysis on it in the future (spoiler alert: I didn't!).

```c
int main() {
  FILE *f = fopen("prog", "rb");
  mem = calloc(0x10000, sizeof(unsigned short));
  fread(&mem[300], 1, 0x3246, f);
  fclose(f);

  mem[0] = 300;
  run_vm();
}
```

With a working VM, it's easy to add `fprintf`s to print every instruction. Here's the format I chose:

```
pc: [address A] [address B] = A B = A NOR B -> address C
```

From here on out, `[a]` denotes `mem[a]`, and `a` is just the number `a`. Here's the first bit of the code—the part that prints `Password:`

```
00300: [06720] [06720] = 00080 00080 = 65455 -> 00007
00303: [00007] [00007] = 65455 65455 = 00080 -> 00003
00306: [00312] [00312] = 00314 00314 = 65221 -> 00007
00309: [00007] [00007] = 65221 65221 = 00314 -> 00000
jump 00314
00314: [00313] [00313] = 00001 00001 = 65534 -> 00007
00317: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 'P'
00320: [06719] [06719] = 00097 00097 = 65438 -> 00007
00323: [00007] [00007] = 65438 65438 = 00097 -> 00003
00326: [00332] [00332] = 00334 00334 = 65201 -> 00007
00329: [00007] [00007] = 65201 65201 = 00334 -> 00000
jump 00334
00334: [00333] [00333] = 00001 00001 = 65534 -> 00007
00337: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 'a'
00340: [06721] [06721] = 00115 00115 = 65420 -> 00007
00343: [00007] [00007] = 65420 65420 = 00115 -> 00003
00346: [00352] [00352] = 00354 00354 = 65181 -> 00007
00349: [00007] [00007] = 65181 65181 = 00354 -> 00000
jump 00354
00354: [00353] [00353] = 00001 00001 = 65534 -> 00007
00357: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 's'
00360: [06721] [06721] = 00115 00115 = 65420 -> 00007
00363: [00007] [00007] = 65420 65420 = 00115 -> 00003
00366: [00372] [00372] = 00374 00374 = 65161 -> 00007
00369: [00007] [00007] = 65161 65161 = 00374 -> 00000
jump 00374
00374: [00373] [00373] = 00001 00001 = 65534 -> 00007
00377: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 's'
00380: [06722] [06722] = 00119 00119 = 65416 -> 00007
00383: [00007] [00007] = 65416 65416 = 00119 -> 00003
00386: [00392] [00392] = 00394 00394 = 65141 -> 00007
00389: [00007] [00007] = 65141 65141 = 00394 -> 00000
jump 00394
00394: [00393] [00393] = 00001 00001 = 65534 -> 00007
00397: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 'w'
00400: [06718] [06718] = 00111 00111 = 65424 -> 00007
00403: [00007] [00007] = 65424 65424 = 00111 -> 00003
00406: [00412] [00412] = 00414 00414 = 65121 -> 00007
00409: [00007] [00007] = 65121 65121 = 00414 -> 00000
jump 00414
00414: [00413] [00413] = 00001 00001 = 65534 -> 00007
00417: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 'o'
00420: [06717] [06717] = 00114 00114 = 65421 -> 00007
00423: [00007] [00007] = 65421 65421 = 00114 -> 00003
00426: [00432] [00432] = 00434 00434 = 65101 -> 00007
00429: [00007] [00007] = 65101 65101 = 00434 -> 00000
jump 00434
00434: [00433] [00433] = 00001 00001 = 65534 -> 00007
00437: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 'r'
00440: [06724] [06724] = 00100 00100 = 65435 -> 00007
00443: [00007] [00007] = 65435 65435 = 00100 -> 00003
00446: [00452] [00452] = 00454 00454 = 65081 -> 00007
00449: [00007] [00007] = 65081 65081 = 00454 -> 00000
jump 00454
00454: [00453] [00453] = 00001 00001 = 65534 -> 00007
00457: [00007] [00007] = 65534 65534 = 00001 -> 00004
print 'd'
00460: [06728] [06728] = 00058 00058 = 65477 -> 00007
00463: [00007] [00007] = 65477 65477 = 00058 -> 00003
00466: [00472] [00472] = 00474 00474 = 65061 -> 00007
00469: [00007] [00007] = 65061 65061 = 00474 -> 00000
jump 00474
00474: [00473] [00473] = 00001 00001 = 65534 -> 00007
00477: [00007] [00007] = 65534 65534 = 00001 -> 00004
print ':'
```

# Interpreting Disassembly
This is obviously quite different from regular assembly, so understanding it is difficult. However, we'll be able to identify some common patterns that will make our life easier.

## Input
We can figure out how long the flag is by just checking how many times `scanf` is called. It turns out the answer is 26. Let's input our favorite 26-character string, `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, and investigate how it stores the input.

```
00503: [00502] [00502] = 00001 00001 = 65534 -> 00007
00506: [00007] [00007] = 65534 65534 = 00001 -> 00006
read 'A'
00509: [00005] [00005] = 00065 00065 = 65470 -> 00007
00512: [00007] [00007] = 65470 65470 = 00065 -> 06691
00515: [00521] [00521] = 00523 00523 = 65012 -> 00007
00518: [00007] [00007] = 65012 65012 = 00523 -> 00000
jump 00523
00523: [00522] [00522] = 00001 00001 = 65534 -> 00007
00526: [00007] [00007] = 65534 65534 = 00001 -> 00006
read 'B'
00529: [00005] [00005] = 00066 00066 = 65469 -> 00007
00532: [00007] [00007] = 65469 65469 = 00066 -> 06692
```

This repeats many times. Immediately, we notice some patterns:
1. `mem[7]` is used as a temporary variable very often
2. `not` is accomplished with `x x y`, which is `mem[y] = ~(~x | ~x) = x`
3. `mov` is accomplished with `x x 7; 7 7 y`, which, when combined with #2, is `mem[y] = mem[x]`
4. `jmp` is accomplished by `mov`ing to `mem[0]`

The first character of the input is stored at `mem[6691]`, and the last is stored at `mem[6716]`.

## First Check
Right after the last character is read and stored, the program starts checking the input.

```
01015: [01021] [01021] = 01024 01024 = 64511 -> 00007
01018: [00007] [00007] = 64511 64511 = 01024 -> 00000
jump 01024
01024: [06691] [06691] = 00065 00065 = 65470 -> 01022
01027: [06670] [06670] = 00087 00087 = 65448 -> 01023
01030: [01036] [01036] = 01039 01039 = 64496 -> 00007
01033: [00007] [00007] = 64496 64496 = 01039 -> 00000
jump 01039
01039: [06691] [06691] = 00065 00065 = 65470 -> 01037
01042: [01023] [01023] = 65448 65448 = 00087 -> 01038
01045: [01037] [01038] = 65470 00087 = 00000 -> 00007
01048: [00007] [00007] = 00000 00000 = 65535 -> 00007
01051: [00007] [00007] = 65535 65535 = 00000 -> 01023
01054: [01060] [01060] = 01063 01063 = 64472 -> 00007
01057: [00007] [00007] = 64472 64472 = 01063 -> 00000
jump 01063
01063: [06670] [06670] = 00087 00087 = 65448 -> 01061
01066: [01022] [01022] = 65470 65470 = 00065 -> 01062
01069: [01061] [01062] = 65448 00065 = 00022 -> 00007
01072: [00007] [00007] = 00022 00022 = 65513 -> 00007
01075: [00007] [00007] = 65513 65513 = 00022 -> 01022
01078: [01022] [01023] = 00022 00000 = 65513 -> 00007
01081: [00007] [00007] = 65513 65513 = 00022 -> 06669
01084: [06669] [00494] = 00022 00000 = 65513 -> 00007
01087: [00007] [00007] = 65513 65513 = 00022 -> 00494
```

Notice how it accesses `mem[6691]`, which is the first character of our input. By carefully tracing the instructions, we can start to understand what is happening.

```
// 1024
~[6691] -> 1022
// 1027
~87 -> 1023
// 1039
~[6691] -> 1037
// 1042
~[1023] = ~(~87) = 87 -> 1038
// 1045 - 1051
~([1037] | [1038]) = ~(~[6691]) | 87) -> 1023
// 1063
~87 -> 1061
// 1066
~[1022] = [6691] -> 1062
// 1069 - 1075
~([1061] | [1062]) = ~(~87 | [6691]) -> 1022
// 1078 - 1081
~([1022] | [1023]) = ~(~(~87 | [6691]) | ~(~[6691]) | 87)) -> 6669
// 1084 - 1087
[6669] | [494] = ~(~(~87 | [6691]) | ~(~[6691]) | 87)) | [494] -> 494
```

We can make use of [DeMorgan's Laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws) to simplify this:

```
~(a & b) == ~a | ~b
~(a | b) == ~a & ~b

~(~(~87 | [6691]) | ~(~[6691]) | 87)) | [494]
= ~((87 & ~[6691]) | ([6691] & ~87)) | [494]
= (~(87 & ~[6691]) | ~([6691] & ~87)) | [494]
= ((~87 | [6691]) | (~[6691] & 87)) | [494]
```

Aha, this is simply `([6691] ^ 87) | [494]`! This section of code essentially boils down to:

```c
mem[494] |= input[0] ^ 87
```

We will see this method of computing XOR again.

## Second Check
Let's move on to the second character. Remember, it's stored at `6692`.

```
01090: [01096] [01096] = 01099 01099 = 64436 -> 00007
01093: [00007] [00007] = 64436 64436 = 01099 -> 00000
jump 01099
01099: [06692] [06692] = 00066 00066 = 65469 -> 01097
01102: [06691] [06691] = 00065 00065 = 65470 -> 01098
01105: [01111] [01111] = 01114 01114 = 64421 -> 00007
01108: [00007] [00007] = 64421 64421 = 01114 -> 00000
jump 01114
01114: [06692] [06692] = 00066 00066 = 65469 -> 01112
01117: [01098] [01098] = 65470 65470 = 00065 -> 01113
01120: [01112] [01113] = 65469 00065 = 00002 -> 00007
01123: [00007] [00007] = 00002 00002 = 65533 -> 00007
01126: [00007] [00007] = 65533 65533 = 00002 -> 01098
01129: [01135] [01135] = 01138 01138 = 64397 -> 00007
01132: [00007] [00007] = 64397 64397 = 01138 -> 00000
jump 01138
01138: [06691] [06691] = 00065 00065 = 65470 -> 01136
01141: [01097] [01097] = 65469 65469 = 00066 -> 01137
01144: [01136] [01137] = 65470 00066 = 00001 -> 00007
01147: [00007] [00007] = 00001 00001 = 65534 -> 00007
01150: [00007] [00007] = 65534 65534 = 00001 -> 01097
01153: [01097] [01098] = 00001 00002 = 65532 -> 00007
01156: [00007] [00007] = 65532 65532 = 00003 -> 06669
01159: [01165] [01165] = 01168 01168 = 64367 -> 00007
01162: [00007] [00007] = 64367 64367 = 01168 -> 00000
jump 01168
01168: [06669] [06669] = 00003 00003 = 65532 -> 01166
01171: [06671] [06671] = 00018 00018 = 65517 -> 01167
01174: [01180] [01180] = 01183 01183 = 64352 -> 00007
01177: [00007] [00007] = 64352 64352 = 01183 -> 00000
jump 01183
01183: [06669] [06669] = 00003 00003 = 65532 -> 01181
01186: [01167] [01167] = 65517 65517 = 00018 -> 01182
01189: [01181] [01182] = 65532 00018 = 00001 -> 00007
01192: [00007] [00007] = 00001 00001 = 65534 -> 00007
01195: [00007] [00007] = 65534 65534 = 00001 -> 01167
01198: [01204] [01204] = 01207 01207 = 64328 -> 00007
01201: [00007] [00007] = 64328 64328 = 01207 -> 00000
jump 01207
01207: [06671] [06671] = 00018 00018 = 65517 -> 01205
01210: [01166] [01166] = 65532 65532 = 00003 -> 01206
01213: [01205] [01206] = 65517 00003 = 00016 -> 00007
01216: [00007] [00007] = 00016 00016 = 65519 -> 00007
01219: [00007] [00007] = 65519 65519 = 00016 -> 01166
01222: [01166] [01167] = 00016 00001 = 65518 -> 00007
01225: [00007] [00007] = 65518 65518 = 00017 -> 06669
01228: [06669] [00494] = 00017 00022 = 65512 -> 00007
01231: [00007] [00007] = 65512 65512 = 00023 -> 00494
```

We've seen a lot of these patterns already, so I won't write everything out in full this time.

```
// 1099 - 1102
~[6692] -> 1097
~[6691] -> 1098
// 1114 - 1117
~[6692] -> 1112
~[1098] = [6691] -> 1113
// 1120 - 1126
~([1112] | [1113]) = [6692] & ~[6691] -> 1098
// 1138 - 1141
~[6691] -> 1136
~[1097] = [6692] -> 1137
// 1144 - 1150
~([1136] | [1137]) = [6691] & ~[6692] -> 1097
// 1153 - 1156
[1097] | [1098] = ([6691] & ~[6692]) | ([6692] & ~[6691]) = [6691] ^ [6692] -> 6669
// 1168 - 1171
~[6669] -> 1166
~18 -> 1167
// 1183 - 1186
~[6669] -> 1181
~[1167] = 18 -> 1182
// 1189 - 1195
~([1181] | [1182]) = [6669] & ~18 -> 1167
// 1207 - 1210
~18 -> 1205
~[1166] = [6669] -> 1206
// 1213 - 1219
~([1205] | [1206]) = 18 & ~[6669] -> 1166
// 1222 - 1225
[1166] | [1167] = (18 & ~[6669]) | ([6669] & ~18) = [6669] ^ 18 = [6691] ^ [6692] ^ 18 -> 6669
// 1228 - 1231
[6669] | [494] -> 494
```

This second check is just:

```c
mem[494] |= input[0] ^ input[1] ^ 18
```

## Correct State
With a VM this simple, there's not a whole lot you can do to check an entire flag. We can reasonably assume that every check will OR `mem[494]` with some combination of XORs, and then check if it's 0 at the end. We can verify this by skipping down to the end of the disassembly.

```
05504: [05503] [05503] = 00000 00000 = 65535 -> 00007
05507: [00007] [00007] = 65535 65535 = 00000 -> 00008
05510: [00008] [00494] = 00000 32895 = 32640 -> 00007
05513: [00007] [00007] = 32640 32640 = 32895 -> 00008
05516: [00008] [00008] = 32895 32895 = 32640 -> 00007
05519: [00007] [00007] = 32640 32640 = 32895 -> 00008
05522: [00001] [00001] = 00255 00255 = 65280 -> 00007
05525: [00007] [00007] = 65280 65280 = 00255 -> 00008
05528: [00008] [00494] = 00255 32895 = 32512 -> 00007
05531: [00007] [00007] = 32512 32512 = 33023 -> 00008
05534: [00008] [00008] = 33023 33023 = 32512 -> 00007
05537: [00007] [00007] = 32512 32512 = 33023 -> 00008
```

This repeats several times. Recall that `mem[1]` contains the result of the NOR, rotated left by one bit. This section essentially ORs `mem[494]` with all the rotations of itself. Thus, if any bit of this is 1, then the number will be `65535` by the end. This is then presumably used to jump to one of two places, but we don't really have to worry about that. In our VM, let's just set `mem[494]` at an appropriate location.

```c
if (ip == 5504) {
  mem[494] = 0;
}
```

Now, we run it with our favorite input.

```
$ ./vm
Password:ABCDEFGHIJKLMNOPQRSTUVWXYZ
TetCTF{ABCDEFGHIJKLMNOPQRSTUVWXYZ}
```

Cool! So now that we've identified the success condition, we know that all our XORs have to equal 0. We've already gathered the following:

```
flag[0] ^ 87 == 0
flag[0] ^ flag[1] ^ 18 == 0
```

From this, we can deduce the first two characters of the flag: `WE`.

# Pintools Cheese
We could continue to reverse all the checks. It is much of the same, but would probably take a long time. Instead, we'll employ another strategy that, from what I can tell, most other teams also used. We know `mem[494]` has to be 0 at the end, and it seems to check characters in order, so let's just print the number of times 0 is written to `mem[494]`. We'll also get rid of the other outputs while we're here.

```c
unsigned int run_vm() {
  unsigned int correct = 0;
  while (mem[0] != 0xffff) {
    if (mem[4] == 1) {
      mem[4] = 0;
      // fprintf(stderr, "print '%c'\n", mem[3]);
      // printf("%c", (unsigned int) mem[3]);
    }
    // blah blah
    if (c == 494 && nor == 0) correct++;
    // blah blah
  }
  return correct;
}
```

Let's try it out.

```
$ echo -n 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' | ./vm
0
$ echo -n 'WBCDEFGHIJKLMNOPQRSTUVWXYZ' | ./vm
1
$ echo -n 'WECDEFGHIJKLMNOPQRSTUVWXYZ' | ./vm
2
```

Success! Now, we can just brute force every character sequentially.

```python
import subprocess
from string import printable

flag = bytearray(26)
printable = printable.encode()

def check():
  p = subprocess.Popen('./vm', stdin=subprocess.PIPE, stdout=subprocess.PIPE)
  return int(p.communicate(input=flag)[0])

for i in range(26):
  for c in printable:
    flag[i] = c
    if check() > i:
      print(flag)
      break
  else:
    raise ValueError('wtmoo')

print(flag.decode())
```

```
$ python3 solve.py
bytearray(b'W\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7U\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7Ua\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M:\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
Traceback (most recent call last):
  File "solve.py", line 18, in <module>
    raise ValueError('wtmoo')
ValueError: wtmoo
```

![pintools cheese](./pintools.png)

Uh-oh. There's no flag. But wait, shouldn't that `:` be `a` for "virtual machine?"

```
$ echo -n 'WE1rd_v1R7UaL_M:QRSTUVWXYZ' | ./vm
16
$ echo -n 'WE1rd_v1R7UaL_MaQRSTUVWXYZ' | ./vm
15
$ echo -n 'WE1rd_v1R7UaL_MAQRSTUVWXYZ' | ./vm
15
$ echo -n 'WE1rd_v1R7UaL_M@QRSTUVWXYZ' | ./vm
16
```

Aha! Looks like more than one character works sometimes. This calls for a... tree search!

```python
import subprocess
from string import printable

flag = bytearray(26)
printable = printable.encode()

def check():
  p = subprocess.Popen('./vm', stdin=subprocess.PIPE, stdout=subprocess.PIPE)
  return int(p.communicate(input=flag)[0])

def sice(i=0):
  if i == 26:
    return True
  for c in printable:
    flag[i] = c
    if check() > i:
      print(flag)
      if sice(i+1):
        return True
  else:
    return False

if sice():
  print(flag.decode())
else:
  print('wtmoo')
```

```
$ python3 solve.py
bytearray(b'W\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7U\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7Ua\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M:\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M<\x0c\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M>\x0c\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@\x0c\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@c\x00\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@ch\x00\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chI\x00\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chIN\x00\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chINE\x00\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chINE_\x00\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chINE_E\x00\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chINE_Ev\x00\x00')
bytearray(b'WE1rd_v1R7UaL_M@chINE_Ev3\x00')
bytearray(b'WE1rd_v1R7UaL_M@chINE_Ev3R')
WE1rd_v1R7UaL_M@chINE_Ev3R
```

There's the flag!

```
$ echo -n 'WE1rd_v1R7UaL_M@chINE_Ev3R' | ./magicbox/MagicBox.exe
Password:TetCTF{WE1rd_v1R7UaL_M@chINE_Ev3R}
```
