---
layout: "note"
title: "외부 정렬 시간 계산 예제 사다리"
display_title: "외부 정렬 시간 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "46"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 외부 병합 정렬의 두 단계와 시간 단위 t{IO}(블록 하나 읽기나 쓰기), t{IS}(메모리 한가득 정렬), t{IM}(한 블록 분량 병합), 그리고 k-way 병합의 패스 수."
prev_url: "/studies/data-structures/sort-tracing-practice/"
prev_title: "정렬 추적 연습"
next_url: "/studies/data-structures/linear-probing-ladder/"
next_title: "선형 탐사 삽입·삭제 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/external-sort-ladder/"
---
{% raw %}
사용 개념: [외부 병합 정렬](/Hongs_Blog/studies/data-structures/external-merge-sort/)의 두 단계와 시간 단위 $$t_{IO}$$(블록 하나 읽기나 쓰기), $$t_{IS}$$(메모리 한가득 정렬), $$t_{IM}$$(한 블록 분량 병합), 그리고 [k-way 병합](/Hongs_Blog/studies/data-structures/k-way-merge/)의 패스 수.

"레코드 수, 메모리 크기, 블록 크기가 주어지고 전체 시간을 구하라"는 문제는 같은 하위목표의 되풀이다. ① 블록 수와 런 수: 자료의 블록 수 = 레코드 수 ÷ 블록 크기, 런 수 = 레코드 수 ÷ 메모리 크기 ② 런 만들기 시간: 모든 블록을 한 번 읽고 한 번 쓰고, 런마다 한 번 정렬한다 ③ 한 패스의 시간: 모든 블록을 한 번 읽고, 한 번 쓰고, 한 번 병합한다 ④ 패스 수: $$\lceil \log_k (\text{런 수}) \rceil$$ ⑤ 합: ② + ③ × ④. 짝이 없는 런도 읽어서 다시 쓴다고 본다([외부 병합 정렬](/Hongs_Blog/studies/data-structures/external-merge-sort/) 본문의 식)[^s1].

## 문제 1 · 완전한 풀이

레코드 10,000개, 메모리 500개, 블록 100개다. 런을 둘씩 합칠 때 전체 시간을 구하라.

1. *블록 수와 런 수:* $$10{,}000 \div 100 = 100$$블록. 메모리는 5블록. 런은 $$10{,}000 \div 500 = 20$$개이고 하나가 5블록이다.
2. *런 만들기 시간:* 100블록 읽기 + 100블록 쓰기 + 정렬 20번 = $$200t_{IO} + 20t_{IS}$$.
3. *한 패스의 시간:* 100블록 읽기 + 100블록 쓰기 + 100블록 병합 = $$200t_{IO} + 100t_{IM}$$.
4. *패스 수:* $$\lceil \log_2 20 \rceil = 5$$. $$2^4 = 16 < 20 \le 32 = 2^5$$이기 때문이다.
5. *합:* $$200t_{IO} + 20t_{IS} + 5 \times (200t_{IO} + 100t_{IM}) = 1{,}200t_{IO} + 20t_{IS} + 500t_{IM}$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 답을 식으로 계산하고, 무작위 레코드로 블록 읽기·쓰기를 흉내 내어 다시 세었다 — [46_external-sort-ladder_p4.py](/Hongs_Blog/studies/data-structures/code/46_external-sort-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

레코드 40,000개, 메모리 1,000개, 블록 100개다. 런을 둘씩 합친다.

1. *블록 수와 런 수:* 400블록. 런은 40개이고 하나가 10블록이다.
2. *런 만들기 시간:* $$800t_{IO} + 40t_{IS}$$.
3. *한 패스의 시간:* $$800t_{IO} + 400t_{IM}$$.
4. *패스 수:* $$\lceil \log_2 40 \rceil = 6$$. 런의 수는 40 → 20 → 10 → 5 → 3 → 2 → 1로 준다.
5. *합:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$800t_{IO} + 40t_{IS} + 6 \times (800t_{IO} + 400t_{IM}) = 5{,}600t_{IO} + 40t_{IS} + 2{,}400t_{IM}$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

문제 2의 자료를 이번에는 넷씩 합친다(4-way 병합). 입력 버퍼 4개와 출력 버퍼 1개가 필요하다.

1. *블록 수와 런 수:* 문제 2와 같다. 400블록, 런 40개.
2. *런 만들기 시간:* $$800t_{IO} + 40t_{IS}$$.
3. *한 패스의 시간:* ______ (먼저 버퍼 5개가 메모리에 들어가는지 확인한다)
4. *패스 수:* ______
5. *합:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. 버퍼 5개 × 100개 = 500개로 메모리 1,000개에 들어간다. 블록 크기를 줄일 필요가 없으니 한 패스는 그대로 $$800t_{IO} + 400t_{IM}$$이다.
4. $$\lceil \log_4 40 \rceil = 3$$. $$4^2 = 16 < 40 \le 64 = 4^3$$. 런의 수는 40 → 10 → 3 → 1로 준다.
5. $$800t_{IO} + 40t_{IS} + 3 \times (800t_{IO} + 400t_{IM}) = 3{,}200t_{IO} + 40t_{IS} + 1{,}200t_{IM}$$.

둘씩 합칠 때보다 입출력이 5,600에서 3,200으로 준다. 다만 맨 앞 네 개를 한 줄로 견주면 레코드 하나에 비교가 3번이라, 메모리 안의 비교는 $$3 \times 3$$패스 = 9번으로 둘씩 합칠 때의 $$1 \times 6$$패스 = 6번보다 많다. $$t_{IM}$$ 하나의 크기가 그만큼 커진다는 뜻이다. 선택 트리를 쓰면 이 차이가 없어진다.

</details>


## 문제 4 · 독립 문제

레코드 90,000개, 메모리 3,000개, 블록 300개다. (a) 둘씩 합칠 때의 전체 시간을 구하라. (b) 패스를 2번 이하로 줄이려면 한 번에 적어도 몇 개씩 합쳐야 하는가? 그때 버퍼가 메모리에 들어가는지 확인하고 전체 시간을 구하라. (c) 맨 앞끼리 한 줄로 견준다면 레코드 하나당 메모리 안의 비교는 (a)와 (b)에서 각각 몇 번인가? 이 결과가 말해 주는 것을 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 자료는 300블록, 메모리는 10블록, 런은 30개(10블록씩)다. 런 만들기 $$600t_{IO} + 30t_{IS}$$. 한 패스 $$600t_{IO} + 300t_{IM}$$. 패스는 $$\lceil \log_2 30 \rceil = 5$$번(30 → 15 → 8 → 4 → 2 → 1). 전체 $$3{,}600t_{IO} + 30t_{IS} + 1{,}500t_{IM}$$.<br>
(b) $$k^2 \ge 30$$인 가장 작은 $$k$$는 6이다($$5^2 = 25 < 30 \le 36 = 6^2$$). 버퍼는 입력 6개와 출력 1개로 7블록이고 메모리 10블록에 들어간다. 런의 수는 30 → 5 → 1. 전체 $$600t_{IO} + 30t_{IS} + 2 \times (600t_{IO} + 300t_{IM}) = 1{,}800t_{IO} + 30t_{IS} + 600t_{IM}$$.<br>
(c) (a)는 $$1 \times 5$$패스 = 5번, (b)는 $$5 \times 2$$패스 = 10번이다. 한 번에 많이 합치면 디스크를 오가는 일은 절반으로 줄지만(3,600 → 1,800), 메모리 안에서 고르는 일은 두 배가 된다. 디스크가 훨씬 느리므로 대개 이득이고, 선택 트리를 쓰면 고르는 일도 $$\lceil \log_2 6 \rceil = 3$$번씩으로 줄어 손해가 거의 없어진다.

</details>


[^s1]: 답은 문제 코드의 계산과 모의실험으로 확인했다.
{% endraw %}
