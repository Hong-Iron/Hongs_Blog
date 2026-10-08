---
layout: "note"
title: "프로세서 레지스터"
display_title: "프로세서 레지스터 (Processor Registers)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Processor Registers", "레지스터", "프로그램 카운터", "명령어 레지스터", "PSW", "조건 코드", "Program Counter", "Instruction Register", "Program Status Word", "Condition Codes", "Flags"]
description: "레지스터는 프로세서 안에 있는 아주 작고 아주 빠른 저장 칸이다. 일꾼이 손에 쥐고 있는 메모지와 같아서, 책상(주기억장치)까지 손을 뻗지 않고 바로 쓸 수 있다. 두 무리로 나뉜다. 하나는 프로그램이 직접 쓰는 칸이고, 다른 하나는 프로세서와 운영체제가 실행을 지휘하려고 쓰는 칸…"
prev_url: "/studies/operating-systems/computer-basic-elements/"
prev_title: "컴퓨터의 기본 구성 요소"
next_url: "/studies/operating-systems/instruction-cycle/"
next_title: "명령어 사이클"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/processor-registers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

레지스터는 프로세서 안에 있는 아주 작고 아주 빠른 저장 칸이다. 일꾼이 손에 쥐고 있는 메모지와 같아서, 책상(주기억장치)까지 손을 뻗지 않고 바로 쓸 수 있다. 두 무리로 나뉜다. 하나는 프로그램이 직접 쓰는 칸이고, 다른 하나는 프로세서와 운영체제가 실행을 지휘하려고 쓰는 칸이다. 칸 수가 적어서 무엇을 레지스터에 둘지 잘 골라야 한다.

</div>


## 예시로 보기

`a = b + c`를 실행한다고 하자. 주기억장치에서 `b`와 `c`를 가져와 더한 뒤 결과를 `a` 자리에 쓴다. 주기억장치를 오가는 일은 레지스터를 쓰는 것보다 훨씬 느리다. 그래서 컴파일러는 자주 쓰는 변수를 레지스터에 두려고 한다. C 언어에는 "이 변수는 레지스터에 두면 좋겠다"고 컴파일러에 알려 주는 방법(`register`)도 있다[^1].

계산이 끝나면 프로세서는 결과가 양수인지, 음수인지, 0인지, 넘쳤는지를 몇 개의 비트에 표시해 둔다. `if (a == 0)` 같은 분기는 이 비트를 보고 갈 길을 정한다[^2].

## 두 무리의 레지스터

**프로그램이 직접 쓰는 칸 (사용자 가시 레지스터).** 기계어로 이름을 불러 쓸 수 있고, 응용 프로그램과 시스템 프로그램 모두 쓴다[^3].

| 종류 | 하는 일 |
|---|---|
| 데이터 레지스터 | 계산할 값을 담는다. 대개 어떤 명령어에든 쓸 수 있지만, 실수 전용·정수 전용처럼 제한이 붙기도 한다 |
| 주소 레지스터 | 주소나 주소 계산에 쓸 값을 담는다. 기준값에 더할 번호(인덱스 레지스터), 메모리 구역의 시작 주소(세그먼트 포인터), 스택 맨 위의 주소(스택 포인터)가 여기에 들어간다 |
| 조건 코드 | 아래 설명 |

**실행을 지휘하는 칸 (제어·상태 레지스터).** 프로세서가 자기 동작을 조절할 때, 그리고 특권을 가진 운영체제 코드가 프로그램 실행을 조절할 때 쓴다[^4]. 대부분은 일반 프로그램에 보이지 않는다.

| 이름 | 담는 것 |
|---|---|
| 프로그램 카운터 (PC) | 다음에 가져올 명령어의 주소 |
| 명령어 레지스터 (IR) | 가장 최근에 가져온 명령어 |
| 프로그램 상태 워드 (PSW) | 상태 정보. 조건 코드, 인터럽트를 받을지 말지 정하는 비트, 지금이 커널 모드인지 사용자 모드인지 나타내는 비트 등[^5] |

**조건 코드.** 연산 결과에 따라 하드웨어가 켜고 끄는 비트들이다. 플래그(flags)라고도 부른다. 보통 제어 레지스터의 일부다. 프로그램은 이 비트를 읽을 수만 있고 직접 바꿀 수는 없다. 명령어 실행 결과를 알려 주는 용도이기 때문이다[^2].

두 무리의 경계는 깔끔하지 않다. 어떤 프로세서에서는 PC가 프로그램에 보이고, 많은 프로세서에서는 보이지 않는다[^1].

## 활용

- PC와 PSW는 [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)가 생기면 가장 먼저 저장되는 값이다. 이 둘만 있으면 끊긴 프로그램을 같은 자리, 같은 상태에서 다시 시작할 수 있다.
- PSW의 모드 비트가 [사용자 모드와 커널 모드](/Hongs_Blog/studies/operating-systems/user-kernel-mode/)를 가른다.
- 레지스터가 주기억장치보다 빠르고 작다는 점은 [메모리 계층](/Hongs_Blog/studies/operating-systems/memory-hierarchy/)의 맨 위 칸이다.

## 연결

- 선수: [컴퓨터의 기본 구성 요소](/Hongs_Blog/studies/operating-systems/computer-basic-elements/)
- PC와 IR이 실제로 움직이는 모습: [명령어 사이클](/Hongs_Blog/studies/operating-systems/instruction-cycle/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> PC, IR, PSW에는 각각 무엇이 들어 있는가?</summary>


**답:** PC: 다음에 가져올 명령어의 주소. IR: 가장 최근에 가져온 명령어 자체. PSW: 조건 코드, 인터럽트 허용 비트, 커널·사용자 모드 비트 같은 상태 정보.<br>
**흔한 오답:** "PC는 지금 실행 중인 명령어의 주소". 인출 직후 PC를 1 늘리므로 실행 중에는 이미 다음 명령어를 가리킨다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 조건 코드는 왜 프로그램이 읽을 수만 있고 직접 바꿀 수는 없게 되어 있는가?</summary>


**답:** 조건 코드는 방금 실행한 연산의 결과(양수·음수·0·넘침)를 알려 주는 표시다. 프로그램이 마음대로 바꿀 수 있으면 표시가 실제 결과와 어긋나서, 그 표시를 보고 분기하는 명령어가 틀린 길로 간다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/01.Chapter01-new.pptx, 슬라이드 11 발표자 노트
[^2]: 같은 자료, 슬라이드 15와 발표자 노트
[^3]: 같은 자료, 슬라이드 12~13과 발표자 노트
[^4]: 같은 자료, 슬라이드 11
[^5]: 같은 자료, 슬라이드 14 발표자 노트
{% endraw %}
