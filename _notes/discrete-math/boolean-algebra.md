---
layout: "note"
title: "불 대수와 논리 회로"
display_title: "불 대수와 논리 회로 (Boolean Algebra and Logic Circuits)"
kind: "concept"
kind_label: "모델"
num: "05"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Boolean Algebra", "Logic Gates", "불 대수", "불 함수", "Boolean function", "논리 게이트", "AND 게이트", "OR 게이트", "NOT 게이트", "NAND", "NOR", "XOR 게이트", "반가산기", "half adder", "전가산기", "full adder", "기능적 완전성", "functional completeness", "비트마스크", "bitmask"]
description: "참·거짓을 1·0으로 쓰면 논리식이 덧셈·곱셈 같은 계산이 되고, 그 식은 그대로 전자 회로(논리 게이트)로 만들 수 있다. 식을 간단히 하면 게이트 수가 줄어 회로가 작고 빨라진다. 놀랍게도 NAND 게이트 한 종류만으로 모든 회로를 만들 수 있다. 다만 불 대수에서는 1 + 1…"
prev_url: "/studies/discrete-math/proof-methods/"
prev_title: "추론 규칙과 증명 방법"
next_url: "/studies/discrete-math/sets/"
next_title: "집합"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/boolean-algebra/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

참·거짓을 1·0으로 쓰면 논리식이 덧셈·곱셈 같은 계산이 되고, 그 식은 그대로 전자 회로(논리 게이트)로 만들 수 있다. 식을 간단히 하면 게이트 수가 줄어 회로가 작고 빨라진다. 놀랍게도 NAND 게이트 한 종류만으로 모든 회로를 만들 수 있다. 다만 불 대수에서는 1 + 1 = 1이라 보통 산술과 규칙이 다르다.

</div>


## 예시로 보기

한 자리 2진수 두 개를 더하는 회로(반가산기)를 만든다. 가능한 입력은 네 가지뿐이다.

| $$a$$ | $$b$$ | 합 $$s$$ | 올림 $$c$$ |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

합의 열은 "둘 중 하나만 1"이므로 $$a \oplus b$$, 올림의 열은 "둘 다 1"이므로 $$a \cdot b$$다. XOR 게이트 하나와 AND 게이트 하나로 끝난다. 반가산기에 아래 자리의 올림까지 받는 전가산기를 만들어 4개 이으면 4비트 덧셈기가 된다. CPU의 덧셈 회로가 이렇게 시작한다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**불 대수**는 값 $$\{0, 1\}$$과 세 연산으로 이루어진다[^1].
- 불 합 $$a + b$$ (OR): 하나라도 1이면 1. 그래서 $$1 + 1 = 1$$이다.
- 불 곱 $$a \cdot b$$ (AND): 둘 다 1일 때만 1.
- 보수 $$\bar a$$ (NOT): $$\bar 0 = 1$$, $$\bar 1 = 0$$.

입력 $$n$$개, 출력 하나인 함수 $$f: \{0,1\}^n \to \{0,1\}$$을 **불 함수**라 한다. 진리표의 $$2^n$$행마다 0이나 1을 고르므로 불 함수는 모두 $$2^{2^n}$$개다.

</div>


[논리적 동치](/Hongs_Blog/studies/discrete-math/logical-equivalence/)의 법칙이 그대로 불 대수의 법칙이다. $$\vee$$를 $$+$$로, $$\wedge$$를 $$\cdot$$로, $$\neg$$를 $$\bar{\ }$$로 바꿔 읽는다. 예: 드모르간 $$\overline{a \cdot b} = \bar a + \bar b$$, 흡수 $$a + a b = a$$. 보통 산술과 다른 법칙도 있다: $$a + a = a$$, $$a + 1 = 1$$, $$a + b c = (a + b)(a + c)$$.

**논리 게이트.** 불 연산을 하는 전자 부품이다. AND, OR, NOT에 더해 NAND($$\overline{ab}$$), NOR($$\overline{a + b}$$), XOR($$a \oplus b$$)이 있다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">기능적 완전성</div>

모든 불 함수는 AND, OR, NOT만으로 만들 수 있다. 나아가 NAND 하나만으로도 만들 수 있다[^1].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. 진리표가 있는 모든 불 함수는 [DNF](/Hongs_Blog/studies/discrete-math/logical-equivalence/)(곱들의 합)로 쓸 수 있다. DNF는 AND, OR, NOT만 쓴다.
2. NAND로 셋을 만든다. $$\bar a = \text{NAND}(a, a)$$, $$\ ab = \overline{\text{NAND}(a, b)} = \text{NAND}(\text{NAND}(a,b), \text{NAND}(a,b))$$, $$\ a + b = \text{NAND}(\bar a, \bar b)$$(드모르간). ∎

</details>


**모형이 보장하는 것과 보장하지 않는 것.** 이 모형(조합 회로)의 출력은 지금의 입력만으로 정해진다. 하지만 신호가 게이트를 지나는 데 걸리는 시간(전파 지연)은 다루지 않아서, 입력이 바뀌는 순간 출력이 잠깐 틀린 값을 낼 수 있다(글리치). 또 값을 기억하지 못한다. 기억하려면 출력을 입력으로 되돌린 순차 회로(플립플롭)가 필요하다[^s1].

## 예제

**4비트 덧셈 추적.** $$0101_2 + 0011_2$$ (5 + 3)을 전가산기 네 개로 더한다. 전가산기는 합 $$s = a \oplus b \oplus c_{\text{in}}$$, 올림 $$c_{\text{out}} = ab + c_{\text{in}}(a \oplus b)$$를 낸다.

| 자리 | $$a$$ | $$b$$ | $$c_{\text{in}}$$ | $$s$$ | $$c_{\text{out}}$$ |
|---|---|---|---|---|---|
| 0 (1의 자리) | 1 | 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 0 | 1 |
| 2 | 1 | 0 | 1 | 0 | 1 |
| 3 | 0 | 0 | 1 | 1 | 0 |

결과는 $$1000_2 = 8$$이다. 올림이 아래에서 위로 물결처럼 전해져 리플 캐리 가산기라 부른다. 자리가 $$n$$개면 최악의 경우 올림이 $$n$$단계를 지나가야 해서 느리다. 실제 CPU는 올림을 미리 계산하는 회로를 쓴다.

**식 줄이기.** $$ab + a\bar b = a(b + \bar b) = a \cdot 1 = a$$. 게이트 네 개(AND 둘, NOT 하나, OR 하나)가 선 하나로 준다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 반가산기, 4비트 가산기로 0~15의 모든 쌍 256개 덧셈, 예제의 올림 비트, NAND로 NOT·AND·OR·XOR, 2입력 불 함수 16개, 불 대수 법칙, `x & (x-1)` — [05_boolean-algebra_verify.py](/Hongs_Blog/studies/discrete-math/code/05_boolean-algebra_verify/)</div>

</div>


## 활용

- **하드웨어.** CPU의 산술 논리 장치, 멀티플렉서, 주소 해독기가 모두 조합 회로다. 회로 설계 도구는 식을 줄여 게이트 수를 최소화한다.
- **비트마스크.** 정수 하나의 비트들을 불 값 여러 개로 쓴다. 플래그 켜기 <code>x &#124; FLAG</code>, 끄기 `x & ~FLAG`, 확인 `x & FLAG`. `x & (x - 1)`은 가장 낮은 1비트를 지워서, 0이 될 때까지 되풀이하면 1비트 개수를 센다.
- **XOR의 쓰임.** 패리티(1의 개수가 홀수인지) 검사, 두 값의 비교, 간단한 암호(같은 키로 두 번 XOR하면 원래대로)에 쓴다.
- 알고리즘에서: 원소 $$n$$개의 부분집합이나 방문한 방 같은 상태를 수 하나의 비트로 다루는 방법은 [비트 연산과 비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/)에 있다. [미로 탈출](/Hongs_Blog/studies/algorithms/pg81304/)은 함정에 들어갈 때마다 그 비트를 XOR로 뒤집어 들어간 횟수의 홀짝을 기억하고, 길이 뒤집혔는지는 양 끝 방의 켜짐을 XOR해서 정한다.

## 연결

- 선수: [논리적 동치와 정규형](/Hongs_Blog/studies/discrete-math/logical-equivalence/)
- 같은 구조: [집합](/Hongs_Blog/studies/discrete-math/sets/)의 합·교·여집합과 불 대수의 $$+$$, $$\cdot$$, 보수는 법칙이 같다. [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)의 2진수가 회로의 입력이다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 반가산기의 합과 올림을 불 식으로 쓰고, 각각 어떤 게이트로 만드는가?</summary>

**답:** 합 $$s = a \oplus b$$(XOR 게이트), 올림 $$c = a \cdot b$$(AND 게이트).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 4비트 리플 캐리 가산기로 0101 + 0011을 계산할 때, 아래 자리부터 각 자리의 올림 출력과 최종 결과를 쓰라.</summary>

**답:** 올림 출력은 1, 1, 1, 0이고 결과는 1000(8)이다.

**흔한 오답:** 두 번째 자리에서 올림을 빠뜨려 0 + 1 = 1로 계산하는 것. 아래에서 올라온 1까지 더하면 $$0 + 1 + 1 = 2$$라 합 0, 올림 1이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** NAND 게이트만으로 NOT, AND, OR를 만드는 방법을 쓰고, 이것이 왜 "NAND로 모든 회로를 만들 수 있다"를 보여 주는지 설명하라.</summary>

**답:** $$\bar a = \text{NAND}(a, a)$$, $$ab = \text{NAND}(\text{NAND}(a,b), \text{NAND}(a,b))$$, $$a + b = \text{NAND}(\text{NAND}(a,a), \text{NAND}(b,b))$$. 모든 불 함수는 AND·OR·NOT으로 된 DNF로 쓸 수 있으므로, 이 셋을 NAND로 바꿔 끼우면 NAND만으로 된다.

</details>


[^1]: Rosen, *Discrete Mathematics and Its Applications* 7판, 12장 "Boolean Algebra"(불 함수, 불 함수의 표현, 논리 게이트, 회로의 최소화). 불 함수의 개수와 기능적 완전성 포함.
[^s1]: 에이전트 보충. 전파 지연·글리치·순차 회로는 디지털 논리 설계 과목의 내용이다. 올림을 미리 계산하는 회로는 캐리 예측 가산기(carry-lookahead adder)다.
{% endraw %}
