---
layout: "note"
title: "중복을 허용하는 셈"
display_title: "중복을 허용하는 셈 (Counting with Repetition)"
kind: "concept"
kind_label: "기법"
num: "16"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Counting with Repetition", "중복조합", "combinations with repetition", "중복순열", "별과 막대", "stars and bars", "같은 것이 있는 순열", "permutations of a multiset", "다항계수", "multinomial coefficient", "부정방정식의 해"]
description: "같은 종류를 여러 번 고를 수 있거나, 같은 글자가 여러 번 나오는 경우의 셈이다. 여러 종류에서 중복을 허용해 몇 개를 고르는 수는 \"별과 칸막이를 한 줄로 늘어놓는 수\"로 바꿔 센다. 같은 것이 섞인 줄 세우기는 전체 줄 세우기를 같은 것끼리 자리 바꾸는 수로 나눈다. 고르는 …"
prev_url: "/studies/discrete-math/permutations-combinations/"
prev_title: "순열과 조합"
next_url: "/studies/discrete-math/counting-formula-choice/"
next_title: "순열·조합·중복조합 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/multiset-counting/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

같은 종류를 여러 번 고를 수 있거나, 같은 글자가 여러 번 나오는 경우의 셈이다. 여러 종류에서 중복을 허용해 몇 개를 고르는 수는 "별과 칸막이를 한 줄로 늘어놓는 수"로 바꿔 센다. 같은 것이 섞인 줄 세우기는 전체 줄 세우기를 같은 것끼리 자리 바꾸는 수로 나눈다. 고르는 대상이 서로 구별되는지(다른 사람) 구별되지 않는지(같은 사탕)를 먼저 정해야 공식을 고를 수 있다.

</div>


## 예시로 보기

아이스크림 가게에 바닐라·초코·딸기 3가지 맛이 있고, 컵에 5스쿱을 담는다. 같은 맛을 여러 번 담아도 되고 담는 순서는 상관없다. 이것은 "각 맛을 몇 스쿱?"을 정하는 문제라, 스쿱 5개를 별 ★로, 맛 사이의 칸막이 2개를 \|로 쓰면 한 줄로 적힌다.

```
★★ | ★ | ★★     → 바닐라 2, 초코 1, 딸기 2
★★★★★ | |        → 바닐라 5
| ★★★ | ★★       → 초코 3, 딸기 2
```

기호 7개 중 칸막이 2개의 자리만 고르면 컵이 정해지므로 $$\binom{7}{2} = 21$$($$\binom{\ }{\ }$$은 위의 수만큼 있는 것에서 아래의 수만큼 고르는 경우의 수)가지다. 맛의 종류 수 3이 아래 정의의 $$n$$, 스쿱 수 5가 $$k$$, 칸막이 수가 $$n - 1$$이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. **중복순열:** $$n$$종류에서 중복을 허용해 $$k$$개를 순서대로 늘어놓는 수는 $$n^k$$.
2. **중복조합:** $$n$$종류에서 중복을 허용해 $$k$$개를 순서 없이 고르는 수는 $$\dbinom{n + k - 1}{k}$$. 이는 방정식 $$x_1 + \cdots + x_n = k$$의 음이 아닌 정수해의 수와 같다[^1].
3. **같은 것이 있는 순열:** 종류 $$i$$가 $$k_i$$개씩, 모두 $$k = k_1 + \cdots + k_r$$개인 물건을 한 줄로 세우는 수는 $$\dfrac{k!}{k_1!\,k_2!\cdots k_r!}$$(다항계수).

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

{: start="2"}
2. *별과 막대:* 고른 결과(종류마다의 개수 $$x_1, \dots, x_n$$)를 별 $$x_1$$개, 막대, 별 $$x_2$$개, 막대, …, 별 $$x_n$$개로 적는다. 별 $$k$$개와 막대 $$n - 1$$개로 된 길이 $$n + k - 1$$인 줄이다. 거꾸로 어떤 줄이든 막대로 끊어 읽으면 고른 결과 하나가 된다. 이 대응이 전단사라서, 줄의 수 = 막대 자리를 고르는 수 $$\binom{n+k-1}{n-1} = \binom{n+k-1}{k}$$.
3. *나눗셈 법칙:* 물건에 모두 이름표를 붙이면 $$k!$$가지다. 이름표를 떼면, 종류 $$i$$ 안에서 자리를 바꾼 $$k_i!$$가지가 같아지므로 $$k_1! \cdots k_r!$$ 대 1이다. ∎

</details>


양의 정수해(각 $$x_i \ge 1$$)를 세려면 먼저 각 칸에 하나씩 넣고 남은 $$k - n$$개를 중복조합으로 나눈다: $$\binom{k-1}{n-1}$$.

## 예제

**MISSISSIPPI의 서로 다른 배열 수.**

1. *종류별 개수:* M 1, I 4, S 4, P 2, 합 11.
2. *공식:* $$\dfrac{11!}{1!\,4!\,4!\,2!} = \dfrac{39{,}916{,}800}{1152} = 34{,}650$$.
3. *검산 방법:* 작은 단어 BANANA는 $$\frac{6!}{1!\,3!\,2!} = 60$$이고, 직접 모든 배열을 만들어 중복을 없애도 60개다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 중복조합 공식을 $$n, k \le 6$$에서 전수 확인, 아이스크림 21, 방정식 해 66과 36, 작은 단어들의 배열 수를 전수로 공식과 비교, MISSISSIPPI 34,650, 단항식 개수 — [16_multiset-counting_verify.py](/Hongs_Blog/studies/discrete-math/code/16_multiset-counting_verify/)</div>

</div>


## 활용

- **자원 분배.** 같은 작업 $$k$$개를 서버 $$n$$대에 나누는 방법(작업이 구별되지 않을 때)은 $$\binom{n+k-1}{k}$$가지다. 작업이 서로 다르면 $$n^k$$가지다. 이 구별이 셈의 첫 질문이다.
- **다항식.** 변수 $$n$$개로 된 $$d$$차 단항식 $$x_1^{a_1}\cdots x_n^{a_n}$$($$a_1 + \cdots + a_n = d$$)은 $$\binom{n+d-1}{d}$$개다. 특징 $$n$$개로 2차 다항 특징을 만들면 항이 $$n^2$$에 비례해 늘어나는 이유다.
- **문자열.** 글자 구성이 같은 문자열(애너그램)의 수가 다항계수다.
- 알고리즘에서: 완전탐색이 될지 어림할 때 쓴다. 같은 화살 10발을 과녁 11칸에 나누는 방법은 $$\binom{20}{10} = 184{,}756$$가지라 모두 만들어 봐도 된다([양궁대회](/Hongs_Blog/studies/algorithms/pg92342/)).

## 연결

- 선수: [순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/)
- 대조: [순열·조합·중복조합 비교](/Hongs_Blog/studies/discrete-math/counting-formula-choice/)
- 이어지는 개념: [생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/)는 이 셈을 다항식의 곱으로 자동화한다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 맛 3가지에서 5스쿱을 담는 방법(순서 무관, 중복 허용)은 몇 가지인가?</summary>

**답:** $$\binom{3 + 5 - 1}{5} = \binom{7}{5} = 21$$.

**흔한 오답:** $$3^5 = 243$$. 이것은 스쿱에 순서가 있을 때(첫째 스쿱, 둘째 스쿱…)의 수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** x₁ + x₂ + x₃ = 10의 음이 아닌 정수해가 C(12, 2)개인 이유를 별과 막대로 설명하라. 양의 정수해는 몇 개인가?</summary>

**답:** 해 하나는 별 10개와 막대 2개로 된 길이 12인 줄 하나와 짝지어진다(막대 사이의 별 수가 $$x_i$$). 막대 자리 2개를 고르면 되므로 $$\binom{12}{2} = 66$$. 양의 정수해는 각 $$x_i$$에 1씩 먼저 넣고 남은 7을 나누어 $$\binom{9}{2} = 36$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** MISSISSIPPI의 글자를 모두 써서 만들 수 있는 서로 다른 문자열은 몇 개인가?</summary>

**답:** $$\frac{11!}{1!\,4!\,4!\,2!} = 34{,}650$$.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 15장 "Cardinality Rules"(반복이 있는 수열 세기, 별과 막대). Rosen, *Discrete Mathematics and Its Applications* 7판, 6장 "Counting".
{% endraw %}
