---
layout: "note"
title: "실시간 스케줄링 예제 사다리"
display_title: "실시간 스케줄링 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "49"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 실시간 스케줄링의 EDF(마감이 가장 이른 작업 먼저)와 RMS 이용률 한계 n(2^{1/n} - 1)."
prev_url: "/studies/operating-systems/scheduling-ladder/"
prev_title: "스케줄링 예제 사다리"
next_url: "/studies/operating-systems/disk-scheduling-ladder/"
next_title: "디스크 스케줄링 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/real-time-scheduling-ladder/"
---
{% raw %}
사용 개념: [실시간 스케줄링](/Hongs_Blog/studies/operating-systems/real-time-scheduling/)의 EDF(마감이 가장 이른 작업 먼저)와 RMS 이용률 한계 $$n(2^{1/n} - 1)$$.

이 방법을 떠올리는 신호는 작업마다 주기(또는 도착 시각)·실행 시간·마감이 주어지고 "마감을 지키는가"를 묻는 문제다. 풀이는 같은 하위목표로 나뉜다. 사용률 합 구하기, 도착할 때마다 준비된 작업의 마감 비교하기, 시간 막대 그리기, 마감과 끝난 시각 비교하기다[^s1].

## 문제 1 · 완전한 풀이

A(주기 20, 실행 10), B(주기 50, 실행 25). 마감은 다음 도착 시각이다. EDF로 0~50 ms를 그리고 B1이 마감을 지키는지 보라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *사용률:* $$10/20 + 25/50 = 1$$. EDF로 지킬 수 있는 한계 안이다.
2. *0:* A1(마감 20), B1(마감 50) → A1. 10에 끝남.
3. *10:* B1만 → B1.
4. *20:* A2(마감 40) 도착, B1(마감 50) → A2가 B1을 선점. 30에 끝남.
5. *30:* B1 남은 15 → B1. 40에 A3(마감 60) 도착하지만 B1(50)이 더 이르므로 계속. 45에 끝남.
6. *판단:* B1은 45에 끝나 마감 50을 지킨다.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

같은 작업을 고정 우선순위(A가 높음)로 0~50 ms 실행한다.

1. *0~10:* A1. *10~20:* B1(10만큼). *20~30:* A2. *30~40:* B1(10만큼, 누적 20). *40~50:* A3.
2. *판단:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

B1은 50까지 25 중 20만 실행해 마감을 놓친다. A가 늘 B를 선점하기 때문이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

주기 작업 셋 (C, T) = (1, 4), (2, 6), (3, 12). RMS로 모든 마감이 보장되는가?

1. *사용률:* ______
2. *한계:* $$n = 3$$이면 $$3(2^{1/3} - 1) \approx 0.780$$.
3. *판단:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. $$1/4 + 2/6 + 3/12 = 0.25 + 0.333 + 0.25 = 0.833$$.
3. 0.833 > 0.780이라 이 조건으로는 보장되지 않는다. 조건은 충분조건일 뿐이라 실제로 놓치는지는 시간 막대로 확인해야 한다. EDF는 0.833 ≤ 1이므로 보장된다.

</details>


## 문제 4 · 독립 문제

시작 마감이 있는 비주기 작업 셋, 각 실행 10 ms, 비선점이다. P(도착 0, 시작 마감 40), Q(도착 5, 시작 마감 8), R(도착 12, 시작 마감 25). (1) 준비된 것 중 마감이 가장 이른 것을 고르는 EDF로 실행하면 누가 마감을 놓치는가? (2) 미래 도착을 알고 일부러 쉬면 모두 지킬 수 있는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(1) 0에는 P만 있어 P를 0~10 실행한다. Q는 5에 와서 8까지 시작해야 하는데 P가 10까지 돌아 놓친다. 10에는 준비된 작업이 없어 12까지 쉬고, R을 12~22 실행한다. Q 하나를 놓친다.<br>
(2) Q가 5에 올 것을 알면 0~5 쉬고 Q 5~15, 그다음 R(마감 25)을 15~25, P(마감 40)를 25~35. 모두 지킨다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1·2는 그림 10.6과 같은 시뮬레이터로, 문제 3의 사용률과 한계값은 계산으로 확인 — [49_real-time-scheduling_impl.py](/Hongs_Blog/studies/operating-systems/code/49_real-time-scheduling_impl/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 문제 1·2는 원본 그림 10.6의 예다. 문제 3·4는 원본 범위 밖의 변형 문제다.
{% endraw %}
