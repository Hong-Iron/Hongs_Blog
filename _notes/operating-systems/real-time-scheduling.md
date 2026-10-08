---
layout: "note"
title: "실시간 스케줄링"
display_title: "실시간 스케줄링 (Real-Time Scheduling)"
kind: "concept"
kind_label: "알고리즘"
num: "49"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-08"
status: "verified"
aliases: ["Real-Time Scheduling", "마감 시간 스케줄링", "Deadline Scheduling", "가장 이른 마감 우선", "Earliest Deadline First", "EDF", "비율 단조 스케줄링", "Rate Monotonic Scheduling", "RMS", "정적 테이블 기반", "정적 우선순위 기반", "동적 계획 기반", "동적 최선 노력", "시작 마감", "Starting Deadline", "완료 마감", "Completion Deadline"]
description: "실시간 작업은 빨리 끝나는 것이 아니라 마감 전에 끝나는 것이 목표다. 그래서 \"중요한 작업 먼저\"라는 고정된 우선순위보다 \"마감이 가장 가까운 작업 먼저\"가 더 많은 마감을 지킨다. 숙제 여러 개를 과목 중요도가 아니라 제출 기한 순으로 하는 것과 같다. 대신 마감 정보를 미리 …"
prev_url: "/studies/operating-systems/real-time-systems/"
prev_title: "실시간 시스템"
next_url: "/studies/operating-systems/priority-inversion/"
next_title: "우선순위 역전"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/real-time-scheduling/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

실시간 작업은 빨리 끝나는 것이 아니라 마감 전에 끝나는 것이 목표다. 그래서 "중요한 작업 먼저"라는 고정된 우선순위보다 "마감이 가장 가까운 작업 먼저"가 더 많은 마감을 지킨다. 숙제 여러 개를 과목 중요도가 아니라 제출 기한 순으로 하는 것과 같다. 대신 마감 정보를 미리 알아야 하고, 일이 마감 안에 다 들어가지 않을 만큼 많으면 어떤 방식으로도 모두 지킬 수는 없다.

</div>


## 예시로 보기

주기 작업 둘이 있다. A는 20 ms마다 와서 10 ms를 실행하고, B는 50 ms마다 와서 25 ms를 실행한다. 마감은 다음 작업이 오는 시각이다(A1은 20, B1은 50)[^1].

| 정책 | 실행 순서 (0~100 ms) | 놓친 마감 |
|---|---|---|
| 고정 우선순위, A 우선 | A1 0~10, B1 10~20, A2 20~30, B1 30~40, A3 40~50 … | B1 (50까지 20만 실행) |
| 고정 우선순위, B 우선 | B1 0~25, A2 25~35, A3 40~50, B2 50~75, A5 80~90 … | A1, A4 |
| 가장 이른 마감 우선 (EDF) | A1 0~10, B1 10~20, A2 20~30, B1 30~45, A3 45~55, B2 55~60, A4 60~70, B2 70~90, A5 90~100 | 없음 |

EDF는 시각 30에 A3(마감 60)보다 B1(마감 50)을 먼저 해서 B1을 지킨다. 시각 80에는 A5와 B2의 마감이 둘 다 100이라, 먼저 와 있던 B2를 계속한다. 두 작업이 프로세서를 쓰는 비율은 $$10/20 + 25/50 = 1$$, 곧 100%인데도 EDF는 모든 마감을 지킨다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 정책의 실행 순서와 놓친 마감(그림 10.6), 비주기 예(그림 10.7), 비율 단조 한계값 — [49_real-time-scheduling_impl.py](/Hongs_Blog/studies/operating-systems/code/49_real-time-scheduling_impl/)</div>

</div>


## 정확히 말하면

### 네 가지 부류

| 부류 | 내용 |
|---|---|
| 정적 테이블 기반 | 실행 전에 가능한 일정을 정적으로 분석한다. 결과는 실행 중에 각 작업이 언제 시작해야 하는지 정한 일정표다 |
| 정적 우선순위 기반 선점 | 정적으로 분석하되 일정표 대신 우선순위를 정한다. 실행은 보통의 우선순위 기반 선점 스케줄러가 한다 |
| 동적 계획 기반 | 실행 중에 가능성을 판단한다. 새 작업은 그 마감을 지킬 수 있을 때만 받아들인다 |
| 동적 최선 노력 | 가능성 분석을 하지 않는다. 마감을 지키려 애쓰되, 못 지킨 작업은 중단한다 |

이 표는 슬라이드 45와 발표자 노트를 정리한 것이다[^2].

### 마감 시간 스케줄링

실시간 응용은 속도가 아니라 작업을 제때 끝내는 데 관심이 있다. 우선순위는 시간의 급함을 잡아내기에 거친 도구다[^3]. 마감 시간 스케줄링은 작업마다 다음 정보를 쓴다[^4].

| 정보 | 뜻 |
|---|---|
| 준비 시각 | 작업이 실행할 준비가 되는 시각 |
| 시작 마감 | 이 시각까지 반드시 시작해야 함 |
| 완료 마감 | 이 시각까지 반드시 끝나야 함 |
| 처리 시간 | 끝까지 실행하는 데 필요한 시간 |
| 자원 요구 | 실행 중에 필요한 (프로세서 외) 자원 |
| 우선순위 | 상대적 중요도 |
| 하위 작업 구조 | 반드시 해야 하는 부분과 선택적인 부분 |

**선점 여부.** 시작 마감이 주어지면 비선점이 맞다. 작업이 꼭 해야 할 부분을 마치고 스스로 비켜 주면 된다. 완료 마감이 주어지면 선점이 맞다. 예: X가 실행 중이고 Y가 준비되었을 때, X를 끊고 Y를 끝낸 뒤 X를 이어야만 둘 다 완료 마감을 지키는 경우가 있다[^5].

**가장 이른 마감 우선(EDF).** 준비된 작업 중 마감이 가장 이른 것을 고른다. 위의 주기 예가 완료 마감에서의 EDF다.

**시작 마감과 쉬는 시간.** 표 10.3의 비주기 작업 다섯은 모두 20 ms씩 걸린다[^6].

| 작업 | A | B | C | D | E |
|---|---|---|---|---|---|
| 도착 | 10 | 20 | 40 | 50 | 60 |
| 시작 마감 | 110 | 20 | 50 | 90 | 70 |

| 정책 | 실행 | 놓친 작업 |
|---|---|---|
| 가장 이른 마감 | A 10~30, C 40~60, E 60~80, D 80~100 | B (20에 와서 20까지 시작해야 하는데 A가 실행 중) |
| 가장 이른 마감 + 일부러 쉬기 | B 20~40, C 40~60, E 60~80, D 80~100, A 100~120 | 없음 |
| FCFS | A 10~30, C 40~60, D 60~80 | B, E |

"일부러 쉬기"는 준비된 작업(A)이 있어도, 곧 올 작업(B)의 마감이 더 이르면 프로세서를 비워 두고 기다리는 것이다. 앞으로 올 작업의 도착 시각과 마감을 미리 알아야 쓸 수 있다[^7].

### 비율 단조 스케줄링 (RMS)

주기가 짧은 작업일수록 높은 우선순위를 준다. 주기가 가장 짧은 작업이 가장 먼저다[^8]. 작업의 주기 $$T$$는 한 번 도착한 뒤 다음 번 도착까지의 시간이고, 비율(rate, Hz)은 그 역수다[^9]. 실행 시간을 $$C$$라 하면 작업 하나가 프로세서를 쓰는 비율은 $$C/T$$다.

작업 $$n$$개가 모두 마감을 지키려면, 어떤 스케줄링이든 프로세서 사용률의 합이 1을 넘으면 안 된다.

$$\frac{C_1}{T_1} + \frac{C_2}{T_2} + \cdots + \frac{C_n}{T_n} \le 1$$


EDF는 이 조건만 맞으면 모든 마감을 지킨다. RMS는 다음 조건이 맞으면 모든 마감을 지킨다고 보장된다[^s1].

$$\sum_{i=1}^{n} \frac{C_i}{T_i} \le n\left(2^{1/n} - 1\right)$$


오른쪽 한계는 $$n = 1$$이면 1, $$n = 2$$면 약 0.828, $$n = 3$$이면 약 0.780이고, $$n$$이 커지면 $$\ln 2 \approx 0.693$$으로 다가간다. 예: 작업 셋 ($$C$$, $$T$$) = (20, 100), (40, 150), (100, 350)이면 사용률 합은 $$0.2 + 0.267 + 0.286 = 0.752 \le 0.780$$이라 RMS로 모든 마감을 지킨다.

RMS의 한계는 EDF보다 낮지만, 우선순위가 고정이라 구현이 쉽고, 과부하 때 어느 작업이 마감을 놓칠지 예측하기 쉽다(우선순위가 낮은 긴 주기 작업부터)[^s1].

### 정확성의 핵심 (EDF)

EDF가 사용률 합 1 이하에서 최적이라는 것은 교환 논증으로 보인다. 어떤 일정이 마감을 모두 지키는데 어느 순간 마감이 더 늦은 작업을 먼저 실행했다면, 그 두 작업의 실행 구간을 맞바꿔도 둘 다 마감을 지킨다. 이 맞바꾸기를 되풀이하면 EDF 일정이 된다[증명 스케치][^s1].

## 스스로 설명해 보기

1. B 우선 고정 우선순위에서 A1이 마감을 놓친다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   B1이 0~25를 다 쓴다. A1은 20까지 끝나야 하는데 25에야 시작할 수 있다.
   </details>
2. EDF에서 시각 30에 B1이 A3보다 먼저다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   A3의 마감은 60, B1의 마감은 50이다. 더 이른 마감인 B1을 고른다. 고정 우선순위 A 우선이었다면 A3를 먼저 해서 B1을 놓친다.
   </details>
3. 비주기 예에서 EDF가 B를 놓친다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   시각 10에 A만 와 있어 A를 시작한다(비선점, 20 ms). B는 20에 와서 20까지 시작해야 하는데 A가 30까지 돈다. B가 올 줄 알았다면 A를 미루고 쉬어야 했다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  "얼마나 중요한가" 대신 "언제까지인가"로 줄을 세운다. 시간 제약을 직접 기준으로 쓰면 고정 우선순위보다 더 많은 마감을 지킨다.
  </details>
- 같은 생각을 쓰는 다른 곳은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  네트워크 패킷 스케줄링에서 지연 한도가 가까운 패킷을 먼저 보내는 방식, 일정 관리에서 마감 순서로 일하기.
  </details>

## 활용

- 리눅스는 3.14부터 SCHED_DEADLINE이라는 EDF 기반 클래스를 둔다[^s1].
- 계산 연습: [실시간 스케줄링 예제 사다리](/Hongs_Blog/studies/operating-systems/real-time-scheduling-ladder/)

## 연결

- 선수: [실시간 시스템](/Hongs_Blog/studies/operating-systems/real-time-systems/)
- 고정 우선순위에서 생기는 함정: [우선순위 역전](/Hongs_Blog/studies/operating-systems/priority-inversion/)
- 일반 스케줄링과 비교: [스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/) (SRT도 "남은 시간"이라는 시간 기준을 쓴다)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"실시간 = 빠른 시스템"</div>

틀렸다. 이름의 "실시간"이 "즉시"로 들린다. 실시간 시스템의 목표는 정해진 마감 안에 **반드시** 끝내는 것이다. 평균이 빨라도 가끔 크게 늦으면 실시간으로 쓸 수 없고, 느려도 마감을 늘 지키면 실시간이다. 그래서 실시간 운영체제는 평균 속도보다 최악의 지연을 줄이는 데 힘쓴다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"더 중요한 작업에 높은 고정 우선순위를 주면 마감을 가장 잘 지킨다"</div>

틀렸다. 예시의 B 우선 고정 우선순위는 A1, A4를 놓친다. 중요도와 급함은 다르다. 마감이 가까운 작업을 먼저 하는 EDF는 같은 작업에서 하나도 놓치지 않는다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 실시간 스케줄링의 네 부류를 쓰고, 실행 전에 분석하는 것과 실행 중에 판단하는 것으로 나눠라.</summary>


**답:** 실행 전: 정적 테이블 기반, 정적 우선순위 기반 선점. 실행 중: 동적 계획 기반(가능성 판단 후 받아들임), 동적 최선 노력(분석 없이 애씀).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 예시의 A(주기 20, 실행 10), B(주기 50, 실행 25)를 EDF로 실행한다. 시각 45~60에는 누가 실행되는가? 이유는?</summary>


**답:** 45~55에 A3, 55~60에 B2. 시각 45에 B1이 끝났고, 준비된 것은 A3(마감 60)와 B2(시각 50 도착, 마감 100)다. 45~50에는 A3뿐이고, 50에 B2가 와도 A3의 마감이 이르므로 A3를 끝낸다. 55에 A3가 끝나면 B2를 시작하고, 60에 A4(마감 80)가 와서 B2를 선점한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> "가장 이른 마감 + 일부러 쉬기" 정책이 하는 일을 쉬운 말 한 문장으로 쓰라.</summary>


**답:** 곧 도착할 작업의 시작 마감이 지금 할 수 있는 작업보다 이르면, 지금 작업을 시작하지 않고 프로세서를 비워 둔 채 그 작업을 기다린다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 주기 작업 둘: (C, T) = (2, 5), (3, 10). RMS로 모든 마감을 지킨다고 보장되는가? EDF는?</summary>


**답:** 사용률 합 $$2/5 + 3/10 = 0.7$$. RMS 한계 $$2(\sqrt{2} - 1) \approx 0.828$$ 이하이므로 RMS도 보장된다. EDF는 1 이하이므로 당연히 보장된다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 사용률 합이 1 이하인데 고정 우선순위로는 마감을 놓치는 예를 들라.</summary>


**답:** 예시의 A(10/20)와 B(25/50). 합이 정확히 1이다. A 우선이면 B1이 마감을 놓치고, B 우선이면 A1·A4가 놓친다. EDF는 모두 지킨다. 고정 우선순위(RMS 포함)는 사용률이 1보다 작아도 마감을 놓칠 수 있다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/10.Chapter10-new.pptx, 슬라이드 49~50 (표 10.2, 그림 10.6)
[^2]: 같은 자료, 슬라이드 45와 발표자 노트
[^3]: 같은 자료, 슬라이드 46
[^4]: 같은 자료, 슬라이드 47과 발표자 노트
[^5]: 같은 자료, 슬라이드 48
[^6]: 같은 자료, 슬라이드 51 (표 10.3)
[^7]: 같은 자료, 슬라이드 52 (그림 10.7)
[^8]: 같은 자료, 슬라이드 53과 발표자 노트
[^9]: 같은 자료, 슬라이드 55 (그림 10.9)의 발표자 노트
[^s1]: 에이전트 보충. 사용률 조건, RMS 한계 $$n(2^{1/n} - 1)$$과 교재의 세 작업 예, RMS의 장점, EDF 최적성의 증명 스케치는 Stallings 6판 10.2절(식 10.1~10.2, Liu & Layland 1973 인용)을 따랐다. 슬라이드는 RMS의 정의와 그림만 있다. 리눅스 SCHED_DEADLINE과 확인 문제 C2~C5는 슬라이드에 없다.
{% endraw %}
