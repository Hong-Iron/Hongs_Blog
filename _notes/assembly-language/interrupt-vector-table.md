---
layout: "note"
title: "INT 명령과 인터럽트 벡터 표"
display_title: "INT 명령과 인터럽트 벡터 표 (INT Instruction, Interrupt Vector Table)"
kind: "concept"
kind_label: "모델"
num: "50"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["INT Instruction", "Interrupt Vector Table", "IVT", "소프트웨어 인터럽트", "Software Interrupt", "인터럽트 핸들러", "Interrupt Handler", "인터럽트 서비스 루틴", "ISR", "IRET", "인터럽트 벡터"]
description: "화면에 글자 찍기, 키보드 읽기 같은 일은 컴퓨터에 이미 만들어져 있는 코드가 하는데, 프로그램은 그 코드가 메모리 어디에 있는지 몰라도 된다. 단축 번호만 누르면 전화가 걸리는 것처럼, 번호를 말하면 프로세서가 메모리 맨 앞의 주소록에서 그 번호의 주소를 찾아 그리로 갔다가 일이…"
prev_url: "/studies/assembly-language/msdos-memory-map/"
prev_title: "MS-DOS 메모리 배치"
next_url: "/studies/assembly-language/int21h-io-functions/"
next_title: "INT 21h 입출력 함수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/interrupt-vector-table/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

화면에 글자 찍기, 키보드 읽기 같은 일은 컴퓨터에 이미 만들어져 있는 코드가 하는데, 프로그램은 그 코드가 메모리 어디에 있는지 몰라도 된다. 단축 번호만 누르면 전화가 걸리는 것처럼, 번호를 말하면 프로세서가 메모리 맨 앞의 주소록에서 그 번호의 주소를 찾아 그리로 갔다가 일이 끝나면 부른 자리로 돌아온다. 다만 주소록이 누구나 고칠 수 있는 자리에 놓여 있다 보니, 한 칸이 잘못 바뀌면 그 번호를 부르는 모든 프로그램이 엉뚱한 곳으로 간다.

</div>


## 예시로 보기

프로시저는 `call 이름`으로 부른다. 어셈블러가 이름을 주소로 바꿔 주기 때문이다: [프로시저와 CALL·RET](/Hongs_Blog/studies/assembly-language/call-ret/). 그런데 BIOS와 MS-DOS의 코드는 내 프로그램과 따로 만들어졌고, 컴퓨터마다 놓인 주소가 다르다. 주소를 프로그램에 박아 넣을 수 없다.

그래서 주소 대신 번호를 쓴다. 화면 서비스는 10h번이다. 프로그램은 이렇게만 쓴다.

```asm
mov ...
int 10h        ; 10h번 서비스를 부른다
add ...
```

프로세서가 `int 10h`를 만나면 다음 순서로 움직인다[^1].

```
 부르는 프로그램                                  인터럽트 처리 코드
+-------------+                               F000:F065  sti    (3)
| mov...      |                                    F066  cld
| int 10h  ---+--(1)--+        +-----(2)----->     F067  push es
| add...   <--+--+    |        |                   F068  ...
+-------------+  |    v        |                         IRET --+
                 |  +------+-----------+-----------+            |
                 |  | 3069 | F000:F065 | F000:AB62 |            |
                 |  +------+-----------+-----------+            |
                 |      인터럽트 벡터 표 (가운데가 INT 10h의 칸)|
                 +---------------------(4)----------------------+
```

1. 번호 10h로 인터럽트 벡터 표에서 칸을 찾는다.
2. 그 칸에 적힌 주소 F000:F065로 건너간다.
3. 거기 있는 코드가 일을 한다.
4. 코드 끝의 `IRET`가 `int 10h` 바로 다음 명령(`add`)으로 돌려보낸다.

주소 F000:F065는 예일 뿐이다. 같은 강의의 다른 표에서는 INT 10h의 칸에 C000:0CD7이 적혀 있다[^2]. 컴퓨터마다 다르기 때문에 번호로 부르는 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 오프셋 = 번호 × 4(슬라이드 표의 다섯 줄, INT 9h → 0024h, INT 10h → 0040h, INT 21h → 0084h), 슬라이드 표의 주소를 리틀 엔디언으로 넣었을 때의 바이트, INT와 IRET 뒤에 CS·IP·플래그·SP가 원래대로 돌아오는지, 카드 C2 — [50_interrupt-vector-table_verify.py](/Hongs_Blog/studies/assembly-language/code/50_interrupt-vector-table_verify/). 16비트 실주소 모드를 실제로 돌린 것이 아니라 파이썬 흉내로 확인했다.</div>

</div>


## 정의

`INT` 명령은 소프트웨어 인터럽트를 일으킨다. 프로그램이 스스로 "지금 이 번호의 처리 코드를 불러 달라"고 하는 것이다. 번호는 0부터 FFh까지 256가지다[^3].

```asm
INT number      ; number = 0..FFh
```

인터럽트를 처리하는 코드를 인터럽트 핸들러(interrupt handler)라 부른다. 인터럽트 서비스 루틴(ISR)도 같은 것의 다른 이름이다[^3].

인터럽트 벡터 표(IVT)는 번호마다 핸들러의 주소를 하나씩 적어 둔 표다. 메모리 맨 앞 00000h에서 시작한다. 한 칸은 32비트(4바이트)이고 세그먼트와 오프셋이 들어 있다[^3][^4].

**기호로 쓰면.** 인터럽트 번호를 $$n$$($$0 \le n \le 255$$)이라 하면, 그 칸이 시작하는 주소는 번호에 4를 곱한 값이다[^4].

$$\text{칸의 시작 주소} = n \times 4$$


INT 10h라면 $$10\text{h} \times 4 = 40\text{h}$$다. 16진수 10h는 십진수 16이라 $$16 \times 4 = 64 = 40\text{h}$$다. 칸 4바이트 가운데 낮은 주소 2바이트가 오프셋, 높은 주소 2바이트가 세그먼트다[^s1].

슬라이드의 표는 한 줄에 네 칸씩 보여 준다[^4]. 한 줄이 16바이트(10h)라서 줄마다 주소가 10h씩 커진다.

| 인터럽트 번호 | 줄의 시작 주소 | 네 칸에 적힌 주소 |
|---|---|---|
| 00~03 | 0000 | 02C1:5186  0070:0C67  0DAD:2C1B  0070:0C67 |
| 04~07 | 0010 | 0070:0C67  F000:FF54  F000:837B  F000:837B |
| 08~0B | 0020 | 0D70:022C  0DAD:2BAD  0070:0325  0070:039F |
| 0C~0F | 0030 | 0070:0419  0070:0493  0070:050D  0070:0C67 |
| 10~13 | 0040 | C000:0CD7  F000:F84D  F000:F841  0070:237D |

INT 9h의 칸은 08~0B 줄의 두 번째라 0DAD:2BAD다. 주소로는 $$9 \times 4 = 24\text{h}$$에서 시작한다.

자주 쓰는 번호는 다음과 같다[^5].

| 번호 | 하는 일 |
|---|---|
| INT 10h | 화면: [BIOS 비디오 INT 10h와 속성 바이트](/Hongs_Blog/studies/assembly-language/bios-video-int10h/) |
| INT 16h | 키보드: [BIOS 키보드 입력 INT 16h](/Hongs_Blog/studies/assembly-language/bios-keyboard-int16h/) |
| INT 17h | 프린터 |
| INT 1Ah | 시각 |
| INT 1Ch | 사용자가 쓰라고 비워 둔 타이머 인터럽트 |
| INT 21h | MS-DOS 서비스: [INT 21h 입출력 함수](/Hongs_Blog/studies/assembly-language/int21h-io-functions/) |

## CALL·RET와 다른 점

`INT`와 `IRET`는 `CALL`과 `RET`의 짝과 닮았다. 다른 점은 둘이다[^s1].

- 갈 곳을 명령에 적지 않고 표에서 찾는다.
- 돌아올 주소뿐 아니라 플래그 레지스터도 스택에 넣는다. `INT`는 플래그, CS, IP 세 워드를 차례로 넣고, `IRET`는 거꾸로 IP, CS, 플래그를 꺼낸다. 그래서 핸들러가 플래그를 바꿔도 부른 쪽으로 돌아오면 플래그가 원래대로다.

핸들러는 프로그램이 `INT`로 부를 수도 있고, 키보드 같은 장치가 신호를 보내서 불릴 수도 있다[^6]. 뒤쪽이 [하드웨어 인터럽트](/Hongs_Blog/studies/assembly-language/hardware-interrupt-irq/)다. 두 경우 모두 같은 표를 쓴다.

## 활용

- 12~14주차의 모든 서비스 호출이 이 틀이다: 레지스터에 원하는 일의 번호와 값을 넣고 `int 번호`를 부른다.
- 표의 칸을 내 코드의 주소로 바꾸면 그 번호가 불릴 때마다 내 코드가 먼저 돈다: [인터럽트 핸들러 바꿔 끼우기](/Hongs_Blog/studies/assembly-language/custom-interrupt-handler/).
- 여기서 다룬 표와 주소 계산은 16비트 실주소 모드의 것이다.

## 연결

- 표가 놓인 자리: [MS-DOS 메모리 배치](/Hongs_Blog/studies/assembly-language/msdos-memory-map/)
- 2바이트 값이 메모리에 놓이는 순서: [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/)
- 인터럽트의 일반 원리(상태 저장, 처리, 복원): [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 인터럽트 벡터 표는 메모리 어디에 있고, 한 칸에 무엇이 몇 바이트로 들어 있는가?</summary>

**답:** 메모리 맨 앞 00000h에서 시작한다. 한 칸은 4바이트이고, 그 번호의 핸들러 주소(세그먼트와 오프셋)가 들어 있다. 칸이 256개라 전체가 1,024바이트다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** INT 16h와 INT 1Ch의 칸은 각각 몇 번지에서 시작하는가?</summary>

**답:** 0058h, 0070h.<br>
**이유:** 번호 × 4다. $$16\text{h} = 22$$라 $$22 \times 4 = 88 = 58\text{h}$$, $$1\text{Ch} = 28$$이라 $$28 \times 4 = 112 = 70\text{h}$$.<br>
**흔한 오답:** 16h × 4를 십진수 16 × 4 = 64로 계산하는 것. 16h는 십진수 22다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** BIOS의 화면 코드를 `call F000:F065`처럼 주소로 부르지 않고 `int 10h`로 부르는 이유는?</summary>

**답:** 그 코드가 놓인 주소는 컴퓨터마다 다르다. 번호로 부르면 프로세서가 그 컴퓨터의 표에서 주소를 찾으므로, 같은 프로그램이 어느 컴퓨터에서나 돈다.<br>
**이유:** 슬라이드의 두 그림에서도 INT 10h의 주소가 F000:F065와 C000:0CD7로 다르다.

</details>


[^1]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.11 (Interrupt Vectoring Process 그림: 부르는 프로그램, 벡터 표의 INT 10 칸 F000:F065, 핸들러의 sti·cld·push es·IRET, 번호 1~4)
[^2]: 어셈블리어 14회 강의 자료 「wk14-chapt_17-2-2」, p.5 (Interrupt Vector Table 표, "The following are only examples")
[^3]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.10 (INT Instruction: software interrupt, interrupt handler, INT number, IVT는 32비트 세그먼트-오프셋 주소, ISR)
[^4]: 어셈블리어 14회 강의 자료 「wk14-chapt_17-2-2」, p.5 (각 칸은 32비트 세그먼트/오프셋 주소, Offset = interruptNumber * 4, 표)
[^5]: 어셈블리어 13회 강의 자료 「wk13-chapt_14-2-1」, p.12 (Common Interrupts)
[^6]: 어셈블리어 14회 강의 자료 「wk14-chapt_17-2-2」, p.3 (Overview: 함수처럼 부를 수 있고 하드웨어 사건으로도 불린다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림의 번호 1~4에 붙인 설명, 칸 안에서 오프셋이 낮은 주소에 놓인다는 것, `INT`가 플래그·CS·IP를 스택에 넣고 `IRET`가 꺼낸다는 것, CALL·RET와의 비교, 카드 C2·C3은 슬라이드에 없다. Intel 64 and IA-32 Architectures Software Developer's Manual의 INT n과 IRET 설명(실주소 모드)을 따랐다. 오프셋이 먼저 놓인다는 점은 14.wk14-chapt_17-2-2.pdf p.20의 코드(int9Save에 BX, int9Save+2에 ES)와 맞는다.
{% endraw %}
