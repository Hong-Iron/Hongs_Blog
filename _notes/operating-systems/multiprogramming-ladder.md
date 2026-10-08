---
layout: "note"
title: "다중 프로그래밍 예제 사다리"
display_title: "다중 프로그래밍 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "11"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
description: "사용 개념: 다중 프로그래밍의 프로세서 사용률 = 일한 시간 ÷ 전체 시간."
next_url: "/studies/operating-systems/bankers-ladder/"
next_title: "은행원 알고리즘 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/multiprogramming-ladder/"
---
{% raw %}
사용 개념: [다중 프로그래밍](/Hongs_Blog/studies/operating-systems/multiprogramming/)의 프로세서 사용률 = 일한 시간 ÷ 전체 시간.

이 계산을 떠올리는 신호는 "읽기 몇 µs, 계산 몇 µs, 쓰기 몇 µs"처럼 한 번 도는 동안의 시간이 나뉘어 나오는 문제다. 풀이는 늘 같은 세 하위목표로 나뉜다. 한 번 도는 전체 시간을 구하고, 그중 프로세서가 일한 시간을 고르고, 나눈다. 프로그램이 여럿이면 일한 시간이 몇 배로 늘어나는지를 따진다[^s1].

## 문제 1 · 완전한 풀이

레코드 하나를 읽는 데 15 µs, 명령어 100개를 실행하는 데 1 µs, 쓰는 데 15 µs가 걸린다. 단일 프로그래밍에서 프로세서 사용률은?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *한 번 도는 전체 시간:* $$15 + 1 + 15 = 31$$ µs.
2. *프로세서가 일한 시간:* 명령어 실행 1 µs. 읽기·쓰기 동안은 기다린다.
3. *나누기:* $$1 / 31 \approx 0.032$$, 즉 3.2%.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

읽기 10 µs, 계산 2 µs, 쓰기 10 µs. 단일 프로그래밍에서 프로세서 사용률은?

1. *한 번 도는 전체 시간:* $$10 + 2 + 10 = 22$$ µs.
2. *프로세서가 일한 시간:* 2 µs.
3. *나누기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$2 / 22 = 1/11 \approx 9.1\%$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

읽기 20 µs, 계산 4 µs, 쓰기 16 µs. 단일 프로그래밍에서 프로세서 사용률은?

1. *한 번 도는 전체 시간:* ______
2. *프로세서가 일한 시간:* 4 µs.
3. *나누기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. $$20 + 4 + 16 = 40$$ µs. 3. $$4 / 40 = 10\%$$.

</details>


## 문제 4 · 독립 문제

읽기 8 µs, 계산 1 µs, 쓰기 8 µs인 프로그램이 있다. (1) 단일 프로그래밍에서 프로세서 사용률은? (2) 같은 프로그램 3개를 메모리에 올리고, 한 프로그램이 입출력을 기다리는 동안 다른 프로그램이 계산한다. 세 프로그램의 계산이 서로 겹치지 않고 입출력 장치도 다투지 않는다면 사용률은? (3) 몇 개를 올려야 사용률이 100%가 되는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(1) $$1 / 17 \approx 5.9\%$$.<br>
(2) 17 µs 동안 프로세서가 세 프로그램의 계산 1 µs씩, 모두 3 µs 일한다. $$3/17 \approx 17.6\%$$.<br>
(3) 17 µs 동안 1 µs씩 계산하는 프로그램 17개를 겹치지 않게 놓으면 빈틈이 없다. 17개. 실제로는 입출력 장치를 두고 다투므로 이보다 많이 필요하거나 100%에 이르지 못한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답 — [11_multiprogramming_verify.py](/Hongs_Blog/studies/operating-systems/code/11_multiprogramming_verify/)</div>

</div>


[^s1]: 에이전트 보충. 문제 1은 원본 그림 2.4의 수치다. 문제 2~4는 원본 범위 밖의 변형 문제이고, 문제 4의 "겹치지 않는다" 가정은 원본 그림 2.5c를 단순화한 것이다.
{% endraw %}
