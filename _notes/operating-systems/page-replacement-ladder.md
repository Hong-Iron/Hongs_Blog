---
layout: "note"
title: "페이지 교체 예제 사다리"
display_title: "페이지 교체 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "41"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
description: "사용 개념: 페이지 교체 알고리즘의 OPT·LRU·FIFO 규칙."
prev_url: "/studies/operating-systems/paging-ladder/"
prev_title: "페이징 주소 변환 예제 사다리"
next_url: "/studies/operating-systems/scheduling-ladder/"
next_title: "스케줄링 예제 사다리"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/page-replacement-ladder/"
---
{% raw %}
사용 개념: [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/)의 OPT·LRU·FIFO 규칙.

이 방법을 떠올리는 신호는 "프레임 k개", "페이지 참조열"이 주어지고 부재 수를 묻는 문제다. 풀이는 늘 같은 하위목표로 나뉜다. 프레임 채우기, 참조마다 적중인지 확인하기, 부재면 규칙대로 내보낼 페이지 고르기, 부재 세기다. 내보낼 페이지를 고를 때 OPT는 참조열의 **뒤**를, LRU는 **앞**을 본다. FIFO는 들어온 순서만 본다[^s1].

문제는 모두 처음 프레임을 채우는 부재는 세지 않는다(슬라이드 방식).

## 문제 1 · 완전한 풀이

프레임 3개, 참조열 7 0 1 2 0 3 0 4 2 3, LRU.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *프레임 채우기:* 7, 0, 1. 프레임 {7, 0, 1}.
2. *2 참조:* 부재. 마지막 사용 7(0), 0(1), 1(2) → 7을 내보낸다. {2, 0, 1}.
3. *0 참조:* 적중.
4. *3 참조:* 부재. 2(3), 0(4), 1(2) → 1을 내보낸다. {2, 0, 3}.
5. *0 참조:* 적중.
6. *4 참조:* 부재. 2(3), 0(6), 3(5) → 2를 내보낸다. {4, 0, 3}.
7. *2 참조:* 부재. 4(7), 0(6), 3(5) → 3을 내보낸다. {4, 0, 2}.
8. *3 참조:* 부재. 4(7), 0(6), 2(8) → 0을 내보낸다. {4, 3, 2}.
9. *부재 세기:* 5번.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

같은 참조열 7 0 1 2 0 3 0 4 2 3, 프레임 3개, FIFO.

1. *프레임 채우기:* 7, 0, 1 순서로 들어온다.
2. *참조마다:* 2 → 7 내보냄(F). 0 적중. 3 → 0 내보냄(F). 0 → 1 내보냄(F). 4 → 2 내보냄(F). 2 → 3 내보냄(F). 3 → 0 내보냄(F).
3. *부재 세기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

6번. LRU(5번)보다 많다. 시각 5에 계속 쓰이는 0을 내보냈다가 바로 다시 불러온 탓이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

같은 참조열 7 0 1 2 0 3 0 4 2 3, 프레임 3개, OPT.

1. *프레임 채우기:* {7, 0, 1}.
2. *2 참조:* 부재. 앞으로 7은 다시 안 쓰이고, 0은 시각 4, 1은 다시 안 쓰인다. ______
3. *3 참조:* ______
4. *4 참조:* 부재. 앞으로 2는 시각 8, 0은 다시 안 쓰임, 3은 시각 9 → 0을 내보낸다.
5. *부재 세기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. 다시 안 쓰이는 7(또는 1)을 내보낸다. 7을 내보내면 {2, 0, 1}.
3. 부재. 2는 시각 8, 0은 시각 6, 1은 다시 안 쓰임 → 1을 내보낸다. {2, 0, 3}.
5. 2, 3, 4에서 부재 3번. 나머지는 모두 적중이다.

</details>


## 문제 4 · 독립 문제

프레임 4개, 참조열 1 2 3 4 1 2 5 1 2 3 4 5. (1) FIFO와 LRU의 부재 수를 처음 채우는 부재까지 포함해 세라. (2) 프레임 3개일 때 FIFO는 9번이다. 무엇을 알 수 있는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(1) FIFO 10번, LRU 8번.<br>
(2) FIFO는 프레임을 3개에서 4개로 늘렸는데 부재가 9번에서 10번으로 늘었다. 벨레이디의 이상 현상이다. LRU는 프레임 3개일 때 10번, 4개일 때 8번으로 늘 줄어든다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 부재 수 — [41_page-replacement_impl.py](/Hongs_Blog/studies/operating-systems/code/41_page-replacement_impl/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 참조열 7 0 1 2 0 3 0 4 2 3과 1 2 3 4 1 2 5 1 2 3 4 5는 Silberschatz, *Operating System Concepts* 9장의 예제 참조열을 줄이거나 그대로 쓴 것이다. 문제는 모두 원본 범위 밖의 변형이다.
{% endraw %}
