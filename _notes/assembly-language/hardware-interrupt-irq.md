---
layout: "note"
title: "하드웨어 인터럽트와 IRQ"
display_title: "하드웨어 인터럽트와 IRQ (Hardware Interrupts, IRQ)"
kind: "concept"
kind_label: "모델"
num: "55"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Hardware Interrupt", "IRQ", "Interrupt Request Level", "인터럽트 요청 수준", "8259", "Programmable Interrupt Controller", "PIC", "STI", "CLI", "인터럽트 플래그", "Interrupt Flag"]
description: "키보드, 타이머, 디스크 같은 장치는 할 말이 생기면 프로세서를 부른다. 여러 장치가 한꺼번에 부르면 누구 말부터 들을지 정해야 하므로, 응급실 접수대처럼 중간에 선 칩 하나가 급한 순서대로 한 명씩 들여보낸다. 덜 급한 장치는 더 급한 장치의 일을 끊지 못하고 기다린다. 프로세서…"
prev_url: "/studies/assembly-language/bios-video-int10h/"
prev_title: "BIOS 비디오 INT 10h와 속성 바이트"
next_url: "/studies/assembly-language/custom-interrupt-handler/"
next_title: "인터럽트 핸들러 바꿔 끼우기"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "55_hardware-interrupt-irq_verify.py", "u": "/studies/assembly-language/code/55_hardware-interrupt-irq_verify/", "r": "검증"}]
permalink: "/studies/assembly-language/hardware-interrupt-irq/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

키보드, 타이머, 디스크 같은 장치는 할 말이 생기면 프로세서를 부른다. 여러 장치가 한꺼번에 부르면 누구 말부터 들을지 정해야 하므로, 응급실 접수대처럼 중간에 선 칩 하나가 급한 순서대로 한 명씩 들여보낸다. 덜 급한 장치는 더 급한 장치의 일을 끊지 못하고 기다린다. 프로세서는 "지금은 방해하지 마"라고 문을 잠글 수도 있지만, 잠근 동안에는 시계를 세는 타이머 신호도 못 받으므로 오래 잠그면 안 된다.

</div>


## 예시로 보기

[INT 명령](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)은 프로그램이 스스로 처리 코드를 부르는 것이었다. 키보드는 사정이 다르다. 사용자가 언제 키를 누를지 프로그램은 모른다. 프로그램이 계속 "눌렸나?" 하고 물어보는 대신, 키가 눌리면 키보드 쪽에서 프로세서에 신호를 보낸다. 이것이 하드웨어 인터럽트다.

장치가 보낸 신호는 프로세서로 곧장 가지 않는다. 인텔 8259라는 칩이 먼저 받는다. 이 칩을 프로그램 가능한 인터럽트 제어기(PIC)라 부른다.

```
 타이머 ---- IRQ 0 --+
 키보드 ---- IRQ 1 --+     +--------+              +----------+
 COM2  ---- IRQ 3 --+---->|  8259  |--인터럽트-->|  프로세서 |
 COM1  ---- IRQ 4 --+     |  (PIC) |   번호       +----------+
 ...                 |     +--------+                   |
 프린터 ---- IRQ 7 --+                                   v
                                           인터럽트 벡터 표에서 주소를 찾는다
```

장치마다 8259로 들어가는 선이 정해져 있고, 그 선의 번호가 IRQ(인터럽트 요청 수준)다. 8259는 세 가지 일을 한다.

- 우선순위에 따라 어느 요청을 먼저 보낼지 정한다.
- 여러 요청이 한꺼번에 오면 하나씩 차례로 보낸다.
- 우선순위가 낮은 요청이 높은 요청의 처리를 끊지 못하게 막는다.

키보드의 경우, 8259가 프로세서에 인터럽트 번호 9를 넘기고, 프로세서는 벡터 표의 9번 칸에 적힌 주소로 간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: IRQ 0~7 → INT 8~0Fh(번호 = 8 + IRQ)와 벡터 칸의 주소, 타이머 18.2회/초 ≈ 55ms, 낮은 우선순위가 기다리는 순서와 CLI·STI의 효과를 흉내 낸 결과 — [55_hardware-interrupt-irq_verify.py](/Hongs_Blog/studies/assembly-language/code/55_hardware-interrupt-irq_verify/). 8259를 실제로 다룬 것이 아니라 본문의 규칙을 파이썬으로 흉내 낸 것이다.</div>

</div>


## IRQ 배정

흔한 배정은 다음과 같다.

| IRQ | 장치 | | IRQ | 장치 |
|---|---|---|---|---|
| 0 | 시스템 타이머 | | 8 | CMOS 실시간 시계 |
| 1 | 키보드 | | 9 | 모뎀, 비디오, 네트워크, 소리, USB 제어기 |
| 2 | 프로그램 가능한 인터럽트 제어기 | | 10 | (비어 있음) |
| 3 | COM2 (직렬) | | 11 | (비어 있음) |
| 4 | COM1 (직렬) | | 12 | 마우스 |
| 5 | LPT2 (프린터) | | 13 | 수치 연산 보조 프로세서 |
| 6 | 플로피 디스크 제어기 | | 14 | 하드 디스크 제어기 |
| 7 | LPT1 (프린터) | | 15 | (비어 있음) |

IRQ 0~7은 인터럽트 번호 8~0Fh로 이어진다. IRQ 번호에 8을 더하면 된다.

| 인터럽트 번호 | IRQ | 설명 |
|---|---|---|
| 8 | IRQ0 | 시스템 타이머. BIOS 시계를 1초에 18.2번 고친다 |
| 9 | IRQ1 | 키보드. 키가 눌리면 걸린다. 키보드 포트에서 키를 읽어 미리 입력 버퍼에 넣는다 |
| 0A | IRQ2 | 프로그램 가능한 인터럽트 제어기 |
| 0B | IRQ3 | 직렬 통신 COM2 |
| 0C | IRQ4 | 직렬 통신 COM1 |
| 0D | IRQ5 | 고정 디스크 |
| 0E | IRQ6 | 디스켓. 디스크 탐색이 진행 중일 때 걸린다 |
| 0F | IRQ7 | 병렬 프린터 |

IRQ5가 위 표에서는 LPT2, 아래 표에서는 고정 디스크다. IRQ 배정은 "흔한" 것일 뿐 컴퓨터마다 다를 수 있다[^s1].

같은 표의 앞쪽 번호 0~7은 장치가 아니라 프로세서가 스스로 일으킨다.

| 번호 | 언제 |
|---|---|
| 0 | 0으로 나누려 할 때 |
| 1 | 한 명령씩 실행하는 플래그가 켜져 있을 때 |
| 2 | 막을 수 없는 인터럽트. 메모리 오류 같은 하드웨어 문제 |
| 3 | 중단점 명령(INT 3)을 실행할 때 |
| 4 | INTO 명령을 실행했는데 넘침 플래그가 켜져 있을 때 |
| 5 | 화면 인쇄 |

## 인터럽트를 막고 여는 명령

플래그 레지스터에는 인터럽트 플래그(IF)라는 비트가 있다. 이 비트가 1일 때만 프로세서가 장치의 인터럽트를 받는다.

| 명령 | 하는 일 | 언제 쓰나 |
|---|---|---|
| `STI` | IF를 1로 한다. 바깥에서 오는 인터럽트를 받는다 | 인터럽트 처리 코드의 맨 앞에서 늘 한다 |
| `CLI` | IF를 0으로 한다. 바깥에서 오는 인터럽트를 받지 않는다 | 중간에 끊기면 안 되는 코드 앞에서 한다 |

`CLI`를 한 동안에는 시스템 타이머도 멈춘다. 타이머도 IRQ 0으로 들어오는 인터럽트이기 때문이다. 그래서 `CLI`와 `STI` 사이는 짧아야 한다.

처리 코드 맨 앞에 `STI`가 필요한 까닭은, 프로세서가 처리 코드로 건너갈 때 IF를 0으로 바꿔 두기 때문이다. `STI`로 다시 열어야 더 급한 장치가 끼어들 수 있다[^s1].

## 보장하는 것과 보장하지 않는 것

| 보장한다 | 보장하지 않는다 |
|---|---|
| 우선순위가 낮은 요청은 높은 요청의 처리를 끊지 못한다 | 요청이 곧바로 처리된다는 것. 더 급한 처리가 끝나거나 IF가 1이 될 때까지 기다린다 |
| 한꺼번에 온 요청은 하나씩 차례로 프로세서에 간다 | 기다리는 동안 같은 장치의 신호가 또 오면 둘 다 살아남는다는 것[^s1] |

## 활용

- 키보드 입력의 첫 단계가 IRQ 1(INT 9h)이다: [BIOS 키보드 입력 INT 16h](/Hongs_Blog/studies/assembly-language/bios-keyboard-int16h/).
- 벡터 표의 칸을 바꿔 내 처리 코드를 끼우는 동안에는 `CLI`로 막아 둔다. 칸의 4바이트 가운데 절반만 바뀐 순간에 인터럽트가 오면 엉뚱한 주소로 가기 때문이다[^s1]: [인터럽트 핸들러 바꿔 끼우기](/Hongs_Blog/studies/assembly-language/custom-interrupt-handler/).
- 운영체제 과목의 "입출력 인터럽트", "타이머 인터럽트", "우선순위에 따른 중첩 처리"가 PC에서는 이 구조다: [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/).

## 연결

- 번호에서 처리 코드 주소를 찾는 법: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/)
- 장치가 끝났다고 알려 주는 방식과 계속 물어보는 방식: [입출력 기법](/Hongs_Blog/studies/operating-systems/io-techniques/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 8259 칩이 하는 일 세 가지와, `STI`와 `CLI`가 하는 일을 쓰라.</summary>

**답:** 8259는 ① 우선순위에 따라 요청의 순서를 정하고 ② 한꺼번에 온 요청을 하나씩 보내고 ③ 낮은 우선순위가 높은 우선순위의 처리를 끊지 못하게 한다. `STI`는 인터럽트 플래그를 1로 해서 장치의 인터럽트를 받고, `CLI`는 0으로 해서 받지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 키보드는 IRQ 몇 번이고, 인터럽트 번호는 몇 번이며, 벡터 표의 몇 번지에서 처리 코드 주소를 찾는가?</summary>

**답:** IRQ 1, 인터럽트 9, 0024h.<br>
**이유:** IRQ 0~7은 8을 더한 번호를 쓴다. 칸의 주소는 번호 × 4라 $$9 \times 4 = 36 = 24\text{h}$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `int 16h`로 키보드 처리 코드가 불리는 것과, 키를 눌러 INT 9h 처리 코드가 불리는 것은 무엇이 다른가? 같은 점은?</summary>

**답:** `int 16h`는 프로그램이 정한 자리에서 스스로 부르는 소프트웨어 인터럽트다. INT 9h는 키보드가 8259를 거쳐 보낸 신호 때문에, 프로그램의 아무 명령 사이에서나 불리는 하드웨어 인터럽트다. 둘 다 번호로 벡터 표에서 주소를 찾고 `IRET`로 돌아온다.<br>
**이유:** 하드웨어 인터럽트는 `CLI`로 막을 수 있다. `INT` 명령은 프로그램이 직접 실행하는 것이라 IF와 상관없이 불린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `CLI`로 인터럽트를 막은 채 오래 걸리는 계산을 하면 무엇이 잘못되는가?</summary>

**답:** 시스템 타이머의 신호를 받지 못해 BIOS 시계가 늦어진다. 그동안 누른 키도 버퍼에 들어가지 못한다.<br>
**이유:** 타이머는 IRQ 0, 키보드는 IRQ 1로 들어오는 하드웨어 인터럽트다. IF가 0이면 프로세서가 받지 않는다.

</details>


[^s1]: IF의 동작은 Intel 64 and IA-32 Architectures Software Developer's Manual의 INT n 설명(실주소 모드)을 따랐다. [확인필요]
{% endraw %}
