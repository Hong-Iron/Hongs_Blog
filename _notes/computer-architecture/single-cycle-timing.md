---
layout: "note"
title: "단일 사이클의 클록 주기"
display_title: "단일 사이클의 클록 주기 (Single-Cycle Clock Period)"
kind: "concept"
kind_label: "기법"
num: "26"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Single-Cycle Clock Period", "클록 주기", "Clock Cycle Time", "임계 경로", "Critical Path", "가장 긴 경로", "Longest Path", "사이클 시간"]
description: "여럿이 함께 걷는 산행에서 걸음은 가장 느린 사람에게 맞춘다. 한 사이클에 명령어 하나를 끝내는 프로세서도 시계 한 번의 길이를 가장 오래 걸리는 명령어에 맞춰야 한다. 그래야 어떤 명령어든 시계가 울리기 전에 계산이 끝난다. 그 대가로 금방 끝나는 명령어도 똑같이 긴 시간을 쓰고…"
prev_url: "/studies/computer-architecture/control-unit/"
prev_title: "제어 장치와 제어 신호"
next_url: "/studies/computer-architecture/mips-pipeline/"
next_title: "5단계 파이프라인"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "26_single-cycle-timing_verify.py", "u": "/studies/computer-architecture/code/26_single-cycle-timing_verify/", "r": "검증"}]
permalink: "/studies/computer-architecture/single-cycle-timing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여럿이 함께 걷는 산행에서 걸음은 가장 느린 사람에게 맞춘다. 한 사이클에 명령어 하나를 끝내는 프로세서도 시계 한 번의 길이를 가장 오래 걸리는 명령어에 맞춰야 한다. 그래야 어떤 명령어든 시계가 울리기 전에 계산이 끝난다. 그 대가로 금방 끝나는 명령어도 똑같이 긴 시간을 쓰고, 느린 부품 하나가 전체를 느리게 만든다.

</div>


## 예시로 보기

클록이 너무 빠르면 어떻게 되나. 다음 클록이 올라가는 순간 레지스터에 값이 들어가는데, 그때 아직 계산이 덜 끝났으면 틀린 값이 저장된다. 그러니 클록 한 번의 길이(주기)는 "값이 가장 멀리 돌아가는 길"보다 길어야 한다.

부품마다 걸리는 시간을 아래처럼 놓는다. 이 값은 이 문서에서 계산을 보이려고 직접 정한 것이다[^s1].

| 부품 | 걸리는 시간 |
|---|---|
| 명령어 메모리 읽기 | 250 ps |
| 레지스터 읽기 | 150 ps |
| ALU | 200 ps |
| 데이터 메모리 읽기·쓰기 | 250 ps |
| 레지스터 쓰기 | 100 ps |

ps(피코초)는 1조분의 1초다. 멀티플렉서, 부호 확장, 제어 장치, 도선은 0으로 친다.

명령어마다 지나는 부품의 시간을 더한다.

| 명령어 | 명령어 메모리 | 레지스터 읽기 | ALU | 데이터 메모리 | 레지스터 쓰기 | 합 |
|---|---|---|---|---|---|---|
| `lw` | 250 | 150 | 200 | 250 | 100 | 950 ps |
| `sw` | 250 | 150 | 200 | 250 | | 850 ps |
| R형 | 250 | 150 | 200 | | 100 | 700 ps |
| `beq` | 250 | 150 | 200 | | | 600 ps |
| `j` | 250 | | | | | 250 ps |

가장 긴 것은 `lw`의 950 ps다. 클록 주기를 950 ps로 잡는다. 1초에 약 10억 5천만 번, 1.05 GHz다. `j`는 250 ps면 끝나는데도 950 ps를 다 쓴다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 합과 주기, 아래의 평균 740 ps와 비 1.28, 카드의 값 — [26_single-cycle-timing_verify.py](/Hongs_Blog/studies/computer-architecture/code/26_single-cycle-timing_verify/)</div>

</div>


## 구하는 법

값이 기억하는 부품에서 나와 계산하는 부품을 지나 다시 기억하는 부품에 들어가기까지의 길 가운데 가장 오래 걸리는 길을 임계 경로(critical path)라 부른다. 클록 주기는 이 길보다 짧을 수 없다[^1].

$$T_c \ge \max_{\text{명령어}} \Big(\sum_{\text{그 명령어가 차례로 지나는 부품}} t_{\text{부품}}\Big)$$


$$T_c$$는 클록 주기, $$t_{\text{부품}}$$은 부품 하나가 걸리는 시간이다. "명령어마다 지나는 부품의 시간을 더하고, 그중 가장 큰 값 이상"이라고 읽는다.

1. 명령어 종류마다 지나는 부품을 차례로 적는다([단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)의 표).
2. 부품의 시간을 더한다. 동시에 일하는 부품은 더하지 않고 긴 쪽만 센다. 예: `beq`에서 ALU의 뺄셈과 분기용 가산기는 나란히 돌아간다.
3. 가장 큰 합이 주기다.

더하는 것은 "차례로" 지나는 부품뿐이다. PC + 4를 구하는 가산기는 명령어 메모리와 나란히 돌아가므로 위 표에 넣지 않았다[^s1].

## 얼마나 손해인가

명령어마다 제 시간만 쓸 수 있다고 상상해 본다. 프로그램에 `lw`가 25%, `sw`가 10%, R형이 45%, `beq`가 15%, `j`가 5% 섞여 있다고 하자[^s1].

$$0.25 \times 950 + 0.10 \times 850 + 0.45 \times 700 + 0.15 \times 600 + 0.05 \times 250 = 740 \text{ ps}$$


명령어 하나에 평균 740 ps면 되는데 950 ps를 쓴다. $$950 \div 740 \approx 1.28$$, 약 28%를 버린다. 곱셈이나 부동소수점 계산처럼 훨씬 오래 걸리는 명령어가 하나라도 들어오면 손해는 더 커진다. ALU 자리에 900 ps짜리 부품이 들어오면 주기는 1,650 ps가 되고, 그 부품을 쓰지 않는 `add`도 1,650 ps를 쓴다.

그렇다고 명령어마다 주기를 바꾸는 시계를 만들기는 어렵다. 실제로 쓰는 길은 일을 여러 토막으로 잘라 토막마다 짧은 사이클을 쓰는 것이다. [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/)으로 이어진다[^2].

## 활용

- [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)에 넣으면: 단일 사이클은 명령어당 사이클 수(CPI)가 정확히 1이고, 대신 클록 주기가 길다. CPU 시간 = 명령어 수 × 1 × 950 ps.
- 부품 하나를 빠르게 해도 주기가 그만큼 줄지 않는다. ALU를 200 ps에서 100 ps로 줄이면 주기는 950 → 850 ps, 1.12배다. 가장 긴 길의 일부만 줄었기 때문이다([암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)과 같은 꼴).
- 흔한 실수: 모든 명령어의 시간을 평균 내어 주기로 삼는 것. 주기는 평균이 아니라 최댓값이다.
- 흔한 실수: `sw`에 레지스터 쓰기 시간을 넣는 것. `sw`는 레지스터에 쓰지 않는다.

## 연결

- 선수: [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/), [클록과 순차 회로](/Hongs_Blog/studies/computer-architecture/clocked-sequential-logic/)
- 주기와 실행 시간의 관계: [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)
- 같은 부품 시간으로 파이프라인과 견주기: [단일 사이클과 파이프라인 비교](/Hongs_Blog/studies/computer-architecture/single-cycle-vs-pipeline/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 명령어 메모리 300 ps, 레지스터 읽기 100 ps, ALU 250 ps, 데이터 메모리 300 ps, 레지스터 쓰기 100 ps인 단일 사이클 프로세서의 클록 주기는? R형과 `beq`는 각각 얼마면 끝나는가?</summary>

**답:** 주기 1,050 ps. R형 750 ps, `beq` 650 ps.<br>
**이유:** `lw`가 $$300 + 100 + 250 + 300 + 100 = 1050$$으로 가장 길다. R형은 데이터 메모리를 빼고 $$300 + 100 + 250 + 100$$, `beq`는 레지스터 쓰기까지 빼고 $$300 + 100 + 250$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 클록 주기를 명령어 시간의 평균이 아니라 최댓값으로 잡아야 하는 이유는?</summary>

**답:** 클록이 올라가는 순간 그때 도선에 있는 값이 그대로 저장되기 때문이다. 주기가 `lw`의 시간보다 짧으면 `lw`를 실행하는 사이클에서 메모리 값이 아직 레지스터 앞에 닿지 않았는데 저장이 일어나 틀린 값이 들어간다. 한 번이라도 틀리면 안 되므로 가장 느린 경우에 맞춘다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 본문의 부품 시간에서 (가) 데이터 메모리를 250 → 150 ps로 줄이기 (나) `j`가 지나는 길을 더 짧게 만들기 가운데 클록 주기를 줄이는 것은?</summary>

**답:** (가)만 줄인다. 950 → 850 ps.<br>
**이유:** 주기는 가장 긴 길(`lw`)이 정한다. 데이터 메모리는 그 길 위에 있다. `j`는 이미 250 ps로 가장 짧아서 더 줄여도 최댓값이 그대로다.

</details>


[^1]: Princeton COS/ELE 375 (Fall 2015, David August), Lecture 8 "Control", 슬라이드 22~24 (Single Cycle Implementation: 주기는 가장 긴 길의 길이가 정한다, load word가 가장 오래 걸린다), https://www.cs.princeton.edu/courses/archive/fall15/cos375/lectures/08-Control.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^2]: 같은 강의, 슬라이드 26~33 (What's Wrong with Single Cycle?: 모든 명령어가 가장 느린 것만큼 걸린다, 아주 긴 명령어의 문제, 여러 사이클로 나누는 방법)
[^s1]: 계산 방법(명령어마다 지나는 부품의 시간을 더하고 최댓값을 고른다)만 위 출처를 따랐다. "0으로 친다"는 가정과 PC + 4 가산기를 빼는 것도 같은 출처의 예제가 쓰는 단순화다.
{% endraw %}
