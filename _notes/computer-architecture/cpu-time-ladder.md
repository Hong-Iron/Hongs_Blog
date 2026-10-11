---
layout: "note"
title: "CPU 시간 계산 예제 사다리"
display_title: "CPU 시간 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "03"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: CPU 시간 식 (CPU 시간 = 명령어 수 × CPI × 클록 주기)과 상대 성능."
next_url: "/studies/computer-architecture/mips-encoding-ladder/"
next_title: "명령어 인코딩 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/cpu-time-ladder/"
---
{% raw %}
사용 개념: [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/) (CPU 시간 = 명령어 수 × CPI × 클록 주기)과 [상대 성능](/Hongs_Blog/studies/computer-architecture/cpu-performance/).

CPU 시간을 묻는 문제는 같은 하위목표의 되풀이다. ① 주어진 것 정리: 명령어 수, 종류별 사이클 수, 주기인지 속도인지 ② 평균 CPI: 비율 × 사이클 수를 더한다 ③ 사이클 수: 명령어 수 × CPI ④ 시간: 사이클 수 × 주기, 또는 사이클 수 ÷ 속도 ⑤ 견주기: 느린 쪽 시간 ÷ 빠른 쪽 시간. 두 컴퓨터의 명령어 수가 같으면 ③을 건너뛰고 "CPI × 주기"끼리 견준다[^s1].

## 문제 1 · 완전한 풀이

명령 30억 개를 실행하는 프로그램이 3 GHz 프로세서에서 돈다. 명령의 40%는 산술(1사이클), 30%는 메모리에서 읽기(3사이클), 10%는 메모리에 쓰기(3사이클), 20%는 분기(2사이클)다. CPU 시간은?

1. *주어진 것 정리:* 명령어 수 $$3 \times 10^9$$. 3 GHz는 속도이므로 마지막에 나눈다.
2. *평균 CPI:* $$0.4 \times 1 + 0.3 \times 3 + 0.1 \times 3 + 0.2 \times 2 = 0.4 + 0.9 + 0.3 + 0.4 = 2.0$$.
3. *사이클 수:* $$3 \times 10^9 \times 2.0 = 6 \times 10^9$$.
4. *시간:* $$6 \times 10^9 \div (3 \times 10^9) = 2.0$$초.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [03_cpu-time-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/03_cpu-time-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

같은 명령어 집합을 쓰는 두 프로세서가 있다. P는 2.5 GHz에 CPI 1.8, Q는 4 GHz에 CPI 3.2다. 어느 쪽이 몇 배 빠른가?

1. *주어진 것 정리:* 명령어 집합이 같으므로 명령어 수가 같다. 속도를 주기로 바꾼다. P는 $$1 \div (2.5 \times 10^9) = 400$$피코초, Q는 $$1 \div (4 \times 10^9) = 250$$피코초.
2. *명령 하나에 드는 시간:* P는 $$1.8 \times 400 = 720$$피코초, Q는 $$3.2 \times 250 = 800$$피코초.
3. *견주기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

느린 쪽 ÷ 빠른 쪽 = $$800 \div 720 = \frac{10}{9} \approx 1.11$$. P가 약 1.11배 빠르다. 클록은 Q가 1.6배 빠르지만 명령 하나에 사이클을 더 많이 쓴다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

어떤 프로그램이 2 GHz 프로세서에서 명령 40억 개를 CPI 1.5로 실행한다. 컴파일러를 바꿨더니 명령어 수가 0.75배로 줄고 CPI는 1.7이 되었다. 프로그램은 몇 배 빨라졌는가?

1. *원래 사이클 수:* ______
2. *원래 시간:* 3.0초.
3. *새 사이클 수:* ______
4. *새 시간:* 2.55초.
5. *견주기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$4 \times 10^9 \times 1.5 = 6 \times 10^9$$.
3. 새 명령어 수는 $$4 \times 10^9 \times 0.75 = 3 \times 10^9$$. 사이클 수는 $$3 \times 10^9 \times 1.7 = 5.1 \times 10^9$$.
5. $$3.0 \div 2.55 = \frac{20}{17} \approx 1.18$$배. 명령어 수만 보고 $$1 \div 0.75 \approx 1.33$$배라고 하면 틀린다. CPI가 함께 올랐다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [03_cpu-time-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/03_cpu-time-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

문제 1의 프로그램을 돌리는 프로세서의 클록 주기는 400피코초다. 설계자가 두 가지 안 가운데 하나를 고른다.

- 안 가: 메모리에서 읽기를 3사이클에서 2사이클로 줄인다. 주기는 그대로다.
- 안 나: 주기를 320피코초로 줄인다. 대신 분기가 2사이클에서 3사이클로 는다.

두 안이 각각 지금보다 몇 배 빠른지 구하고, 어느 쪽을 고를지 정하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

명령어 수가 같으므로 명령 하나에 드는 시간(CPI × 주기)을 견준다.
- 지금: $$2.0 \times 400 = 800$$피코초.
- 안 가: CPI가 $$0.4 + 0.3 \times 2 + 0.3 + 0.4 = 1.7$$. $$1.7 \times 400 = 680$$피코초. $$800 \div 680 \approx 1.18$$배.
- 안 나: CPI가 $$0.4 + 0.9 + 0.3 + 0.2 \times 3 = 2.2$$. $$2.2 \times 320 = 704$$피코초. $$800 \div 704 \approx 1.14$$배.

안 가를 고른다. 안 나보다 $$704 \div 680 \approx 1.035$$배, 약 3.5% 빠르다. 안 나는 주기를 20% 줄였지만 CPI가 10% 올라 얻은 것을 일부 잃는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [03_cpu-time-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/03_cpu-time-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 직접 만들었다. 식과 하위목표는 Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 1장 "Computer Abstractions and Technology"의 CPU 시간 식을 따랐고(책을 직접 열지 못해 장까지만 적는다), 답은 분수로 정확히 계산하는 문제 코드로 확인했다.
{% endraw %}
