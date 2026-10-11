---
layout: "note"
title: "x86 동작 모드"
display_title: "x86 동작 모드 (Modes of Operation)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Modes of Operation", "동작 모드", "실주소 모드", "Real-Address Mode", "Real Mode", "보호 모드", "Protected Mode", "가상 8086 모드", "Virtual-8086 Mode", "주소 지정 가능 메모리", "Addressable Memory"]
description: "같은 x86 프로세서가 서로 다른 규칙으로 일할 수 있다. 한 규칙에서는 프로그램 하나가 집 전체를 혼자 쓰는 것처럼 메모리 어디든 손댈 수 있다. 다른 규칙에서는 프로그램마다 방을 하나씩 받고 남의 방에는 못 들어간다. 앞의 것은 단순하지만 메모리가 작고 프로그램 하나가 잘못하면…"
prev_url: "/studies/assembly-language/x86-registers/"
prev_title: "x86 레지스터"
next_url: "/studies/assembly-language/real-mode-segment-address/"
next_title: "실주소 모드의 세그먼트 주소"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/x86-operating-modes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

같은 x86 프로세서가 서로 다른 규칙으로 일할 수 있다. 한 규칙에서는 프로그램 하나가 집 전체를 혼자 쓰는 것처럼 메모리 어디든 손댈 수 있다. 다른 규칙에서는 프로그램마다 방을 하나씩 받고 남의 방에는 못 들어간다. 앞의 것은 단순하지만 메모리가 작고 프로그램 하나가 잘못하면 전체가 무너진다. 뒤의 것은 여러 프로그램을 함께 안전하게 돌리지만, 프로그램이 하드웨어를 마음대로 만질 수 없다.

</div>


## 예시로 보기

요즘 컴퓨터에서는 웹 브라우저가 멈춰도 음악 프로그램은 계속 돈다. 옛 MS-DOS에서는 프로그램 하나가 잘못된 주소에 값을 쓰면 컴퓨터를 껐다 켜야 했다. 프로세서는 같은 계열인데 왜 다를까? 프로세서가 일하는 규칙, 곧 모드가 다르기 때문이다.

| | 실주소 모드 | 보호 모드 |
|---|---|---|
| 이 모드를 쓰는 운영체제 | MS-DOS | 윈도우, 리눅스 |
| 주소의 길이 | 20비트 | 32비트 |
| 쓸 수 있는 메모리 | 1MB | 4GB |
| 함께 도는 프로그램 | 하나 | 여럿 |
| 남의 메모리에 손대기 | 막지 않는다 | 막는다 |

1MB와 4GB는 주소의 길이에서 나온다. 주소가 20비트면 주소가 $$2^{20} = 1{,}048{,}576$$가지라서 1MB다. 32비트면 $$2^{32}$$가지, 곧 약 43억 바이트라서 4GB다. 4GB는 1MB의 4,096배다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$2^{20}$$바이트 = 1MB(끝 주소 `FFFFFh`), $$2^{32}$$바이트 = 4GB(끝 주소 `FFFFFFFFh`), 4,096배, 4GB를 4,096바이트로 나눈 쪽 수, 카드의 값 — [05_x86-operating-modes_verify.py](/Hongs_Blog/studies/assembly-language/code/05_x86-operating-modes_verify/)</div>

</div>


## 세 가지 모드

**실주소 모드 (real-address mode).** MS-DOS가 원래 쓰던 모드다. 16비트 모드라고도 부른다[^1].

- 쓸 수 있는 메모리는 많아야 1MB다.
- 응용 프로그램이 메모리의 어느 곳이든 읽고 쓸 수 있다. 프로그램 사이에 메모리를 지키는 경계가 없다.
- 한 번에 프로그램 하나만 돈다(single tasking).
- 주소의 한 부분인 오프셋이 16비트다: [실주소 모드의 세그먼트 주소](/Hongs_Blog/studies/assembly-language/real-mode-segment-address/).

**보호 모드 (protected mode).** 윈도우와 리눅스가 원래 쓰는 모드다[^2].

- 쓸 수 있는 메모리는 4GB다. 주소로는 `00000000h`부터 `FFFFFFFFh`까지다.
- 프로그램마다 메모리 구역을 하나씩 받고, 그 구역은 다른 프로그램이 손대지 못하게 지켜진다. 그래서 이름이 보호 모드다.
- 여러 프로그램을 함께 돌리도록(multitasking) 만들어졌다.

보호 모드에서는 프로세서가 메모리를 4,096바이트짜리 토막으로 나눠 다루는 일을 직접 돕는다. 이 토막을 페이지라 부른다. 그 덕에 프로그램들이 쓰는 메모리의 합이 실제 메모리보다 커도 된다. 돌고 있는 프로그램의 일부는 메모리에, 나머지는 디스크에 둔다. 필요한 페이지가 메모리에 없으면 프로세서가 페이지 부재(page fault)를 알리고, 운영체제의 가상 메모리 관리자가 그 페이지를 디스크에서 올린다[^3]. 자세한 것은 [페이징](/Hongs_Blog/studies/operating-systems/paging/)과 [가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/)에 있다.

**가상 8086 모드 (virtual-8086 mode).** 보호 모드에 섞어 넣은 모드다. 프로그램마다 자기만의 8086 컴퓨터를 가진 것처럼 돈다. 메모리는 실주소 모드처럼 1MB, 주소는 20비트다[^4]. 8086은 실주소 모드만 있던 옛 16비트 프로세서다. 보호 모드 운영체제 위에서 옛 MS-DOS 프로그램을 돌리려고 쓴다[^s1].

## 활용

- 이 과목 앞부분의 프로그램은 보호 모드의 32비트 프로그램이다. 레지스터도 주소도 32비트다: [프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/). 13~14주차는 실주소 모드의 16비트 MS-DOS 프로그램을 다룬다[^1].
- 최초의 실주소 모드 운영체제는 IBM PC용 IBM PC-DOS였다. 디지털 리서치의 CP/M에 뿌리를 두었고, 나중에 MS-DOS라는 이름으로 마이크로소프트가 가졌다[^5].
- 보호 모드에서는 운영체제가 막기 때문에 응용 프로그램이 하드웨어를 직접 만지는 코드를 쓸 수 없는 경우가 많다: [입출력 접근 수준](/Hongs_Blog/studies/assembly-language/io-access-levels/).

## 연결

- 선수: [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)
- 실주소 모드의 1MB가 어떻게 나뉘어 쓰이는가: [MS-DOS 메모리 배치](/Hongs_Blog/studies/assembly-language/msdos-memory-map/)
- 보호 모드 안에서 운영체제와 응용 프로그램을 또 가르는 것: [사용자 모드와 커널 모드](/Hongs_Blog/studies/operating-systems/user-kernel-mode/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음은 각각 어느 모드의 이야기인가? (가) 프로그램 하나가 다른 프로그램의 메모리에 값을 쓰려 하면 막힌다. (나) 주소가 20비트이고 한 번에 프로그램 하나만 돈다. (다) 윈도우 위에서 옛 MS-DOS 프로그램이 자기 혼자 1MB짜리 컴퓨터를 쓰는 것처럼 돈다.</summary>

**답:** (가) 보호 모드. (나) 실주소 모드. (다) 가상 8086 모드.<br>
**이유:** (나)와 (다)는 둘 다 1MB, 20비트다. 가르는 것은 "혼자 진짜 컴퓨터 전체를 쓰는가(실주소), 보호 모드 운영체제가 그렇게 보이게 해 주는가(가상 8086)"다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 실주소 모드에서는 프로그램 하나의 잘못이 왜 컴퓨터 전체를 멈추게 할 수 있는가? 보호 모드는 이것을 어떻게 막는가?</summary>

**답:** 실주소 모드의 응용 프로그램은 메모리 어디든 쓸 수 있고 경계를 지키는 장치가 없다. 그래서 잘못된 주소에 값을 쓰면 운영체제가 쓰는 자리까지 덮어쓸 수 있다. 보호 모드는 프로그램마다 구역을 따로 주고, 남의 구역에 손대는 것을 프로세서가 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 주소가 20비트, 24비트, 32비트일 때 가리킬 수 있는 메모리는 각각 얼마인가?</summary>

**답:** $$2^{20}$$바이트 = 1MB, $$2^{24}$$바이트 = 16MB, $$2^{32}$$바이트 = 4GB.<br>
**이유:** 주소가 $$b$$비트면 서로 다른 주소가 $$2^b$$가지다. $$2^{10} = 1{,}024$$가 1K이므로 $$2^{20}$$은 1M, $$2^{30}$$은 1G다. 24비트는 슬라이드에 없는 연습용 값이다[^s1].

</details>


[^1]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.8 (Real-Address mode: 1 MB RAM maximum addressable, any area of memory, Single tasking, MS-DOS). 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.4 (Real-address mode (16-bit mode): No memory boundary protection, Offsets are 16 bits)
[^2]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.11 (Protected Mode: 4 GB addressable RAM, 00000000 to FFFFFFFFh, memory partition, multitasking, Linux & MS-Windows). 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-2」, p.5 (Modes of Operation)
[^3]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-3」, p.12 (Paging: 4096-byte blocks called pages, Virtual memory manager, Page fault)
[^4]: 어셈블리어 3회 강의 자료 「wk03-chapt_02-3-2」, p.5 (Virtual-8086 mode: hybrid of Protected, each program has its own 8086 computer), p.7 (Addressable Memory: Protected mode 4 GB 32-bit address, Real-address and Virtual-8086 modes 1 MB space 20-bit address)
[^5]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.4 (IBM PC-DOS: first Real-address OS for IBM-PC, Gary Kildall's Digital Research CP/M, Later renamed to MS-DOS, owned by Microsoft)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 브라우저와 음악 프로그램의 예, 견주는 표, $$2^{20}$$·$$2^{32}$$ 계산과 4,096배, 8086이 무엇인지와 가상 8086 모드를 쓰는 까닭, 카드 C3의 24비트는 슬라이드에 없다. 표의 각 칸은 슬라이드 3-2 p.5·7과 3-3 p.8·11의 내용이다. 계산은 검증 코드로 확인했다. 8086과 가상 8086 모드의 풀이는 교재 Irvine, *Assembly Language for x86 Processors* 7판, 2.2.1절을 따랐다.
{% endraw %}
