---
layout: "note"
title: "스케줄링 예제 사다리"
display_title: "스케줄링 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "44"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-07"
status: "verified"
description: "사용 개념: 스케줄링 알고리즘의 선택 함수와 선점 규칙, 반환 시간 = 끝난 시각 − 도착 시각."
prev_url: "/studies/operating-systems/page-replacement-ladder/"
prev_title: "페이지 교체 예제 사다리"
next_url: "/studies/operating-systems/real-time-scheduling-ladder/"
next_title: "실시간 스케줄링 예제 사다리"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/scheduling-ladder/"
---
{% raw %}
사용 개념: [스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/)의 선택 함수와 선점 규칙, 반환 시간 = 끝난 시각 − 도착 시각.

이 방법을 떠올리는 신호는 프로세스마다 도착 시각과 서비스 시간이 표로 주어지고 "끝나는 시각", "평균 반환 시간"을 묻는 문제다. 풀이는 늘 같은 하위목표로 나뉜다. 시각마다 준비 큐에 누가 있는지 적기, 정책의 규칙으로 다음 프로세스 고르기(선점형이면 도착 때마다 다시 확인), 시간 막대(간트 차트) 그리기, 반환 시간 계산하기다[^s1].

네 문제 모두 같은 프로세스를 쓴다.

| 프로세스 | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| 도착 | 0 | 1 | 2 | 3 |
| 서비스 시간 | 5 | 3 | 1 | 2 |

## 문제 1 · 완전한 풀이

FCFS로 끝나는 시각과 평균 반환 시간을 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *준비 큐 순서:* 도착 순서 P1, P2, P3, P4.
2. *고르기:* FCFS는 먼저 온 순서대로, 끝날 때까지 실행한다.
3. *시간 막대:* P1 0~5, P2 5~8, P3 8~9, P4 9~11.
4. *반환 시간:* P1 5 − 0 = 5, P2 8 − 1 = 7, P3 9 − 2 = 7, P4 11 − 3 = 8. 평균 27 / 4 = 6.75.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

SPN(비선점)으로 구하라.

1. *시각 0:* P1만 있으므로 P1을 끝까지 실행한다(0~5).
2. *시각 5:* P2(3), P3(1), P4(2)가 기다린다. 가장 짧은 P3.
3. *시간 막대:* P1 0~5, P3 5~6, P4 6~8, P2 8~11.
4. *반환 시간:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

P1 5, P2 11 − 1 = 10, P3 6 − 2 = 4, P4 8 − 3 = 5. 평균 24 / 4 = 6.0. FCFS(6.75)보다 짧다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

SRT(선점)로 구하라.

1. *시각 0:* P1 시작.
2. *시각 1:* P2 도착. 남은 시간 P1 4, P2 3 → ______
3. *시각 2:* P3 도착. 남은 시간 P2 2, P3 1 → P3로 바꾼다. P3는 시각 3에 끝난다.
4. *시각 3:* P4 도착. 남은 시간 P1 4, P2 2, P4 2 → ______
5. *시간 막대와 반환 시간:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. P2로 바꾼다(3 < 4).
4. P2와 P4가 2로 같다. 먼저 온 P2를 고른다.
5. P1 0~1, P2 1~2, P3 2~3, P2 3~5, P4 5~7, P1 7~11. 반환 시간 P1 11, P2 4, P3 1, P4 4. 평균 20 / 4 = 5.0.

</details>


## 문제 4 · 독립 문제

라운드 로빈, 할당량 2로 구하라. 같은 시각에 새로 도착한 프로세스와 할당량을 다 쓴 프로세스가 있으면 새 프로세스가 먼저 큐에 선다. 평균 반환 시간을 FCFS, SPN, SRT와 비교하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

시간 막대: P1 0~2, P2 2~4, P3 4~5, P1 5~7, P4 7~9, P2 9~10, P1 10~11.<br>
(시각 2에 큐는 P2, P3, P1 순. 시각 4에 P2가 할당량을 다 써서 P3, P1, P4, P2 순.)<br>
끝나는 시각 P1 11, P2 10, P3 5, P4 9. 반환 시간 11, 9, 3, 6, 평균 29 / 4 = 7.25.<br>
비교: SRT 5.0 < SPN 6.0 < FCFS 6.75 < RR 7.25. RR은 반환 시간보다 응답 시간(처음 실행까지)을 줄이는 정책이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 시간 막대와 끝나는 시각 — [44_scheduling_impl.py](/Hongs_Blog/studies/operating-systems/code/44_scheduling_impl/)</div>

</div>


[^s1]: 에이전트 보충. 네 문제의 프로세스 표는 원본 범위 밖의 변형이다. 풀이 규칙은 슬라이드 표 9.3·9.4의 예와 같다.
{% endraw %}
