---
layout: "note"
title: "나눗셈과 합동"
display_title: "나눗셈과 합동 (Division and Congruence)"
kind: "concept"
kind_label: "정의"
num: "26"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Modular Arithmetic", "모듈러 산술", "합동", "congruence", "나머지 연산", "modulo", "mod", "나눗셈 정리", "division theorem", "약수", "divisor", "배수", "시계 산술", "clock arithmetic"]
description: "시계는 12시 다음에 다시 1시로 돌아온다. 이처럼 어떤 수로 나눈 나머지만 보고 계산하는 것이 모듈러 산술이다. 더하기·빼기·곱하기는 중간에 몇 번이든 나머지를 취해도 결과가 같아서, 큰 수의 계산을 작은 수로 끝낼 수 있다. 하지만 나눗셈(양변을 같은 수로 나누기)은 늘 되지는…"
prev_url: "/studies/discrete-math/master-theorem/"
prev_title: "분할 정복 점화식과 마스터 정리"
next_url: "/studies/discrete-math/gcd-euclid/"
next_title: "최대공약수와 유클리드 호제법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/modular-arithmetic/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

시계는 12시 다음에 다시 1시로 돌아온다. 이처럼 어떤 수로 나눈 나머지만 보고 계산하는 것이 모듈러 산술이다. 더하기·빼기·곱하기는 중간에 몇 번이든 나머지를 취해도 결과가 같아서, 큰 수의 계산을 작은 수로 끝낼 수 있다. 하지만 나눗셈(양변을 같은 수로 나누기)은 늘 되지는 않는다. 또 음수의 나머지는 프로그래밍 언어마다 다르게 계산한다.

</div>


## 예시로 보기

오늘(2026년 9월 25일)은 금요일이다. 1000일 뒤는 무슨 요일인가? 요일은 7일마다 되풀이되므로 $$1000 = 7 \times 142 + 6$$에서 나머지 6만 보면 된다. 금요일에서 6일 뒤인 목요일이다.

같은 방법으로 큰 곱의 나머지도 작은 수로 계산한다. $$123456789 \times 987654321$$을 9로 나눈 나머지는, 각 수의 자릿수 합이 45로 9의 배수라 각각 나머지가 0이고, 곱의 나머지도 0이다. 요일 계산의 7, 9로 나누기의 9가 아래 정의의 $$m$$이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">나눗셈 정리</div>

정수 $$a$$와 양의 정수 $$d$$에 대해 $$a = dq + r$$, $$0 \le r < d$$인 정수 $$q$$(몫)와 $$r$$(나머지)가 **정확히 한 쌍** 있다. $$r$$을 $$a \bmod d$$로 쓴다[^1].

</div>


<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- $$a = dk$$인 정수 $$k$$가 있으면 "$$d$$가 $$a$$를 나눈다"고 하고 $$d \mid a$$로 쓴다.
- $$m \in \mathbb{Z}^{+}$$($$\in$$은 "~에 속한다")에 대해 $$m \mid (a - b)$$이면 "$$a$$와 $$b$$는 법 $$m$$에 대해 **합동**"이라 하고 $$a \equiv b \pmod m$$로 쓴다.

</div>


**동치인 다른 정의.** $$a \equiv b \pmod m$$ $$\iff$$ $$a \bmod m = b \bmod m$$(나머지가 같다). ($$\Leftarrow$$) $$a = mq_1 + r$$, $$b = mq_2 + r$$이면 $$a - b = m(q_1 - q_2)$$. ($$\Rightarrow$$) $$a - b = mk$$이고 $$b = mq + r$$이면 $$a = m(q + k) + r$$이며, 나눗셈 정리의 유일성으로 $$a$$의 나머지도 $$r$$이다.

**설계 이유.** 합동을 "나머지가 같다"가 아니라 "차이가 $$m$$의 배수"로 정의하면 음수에도 그대로 쓸 수 있고, 성질의 증명이 한 줄로 끝난다. 합동은 [동치관계](/Hongs_Blog/studies/discrete-math/equivalence-relations/)라서 정수를 나머지 $$0, 1, \dots, m - 1$$로 가르는 $$m$$개의 동치류로 나눈다. 이 동치류들의 집합을 $$\mathbb{Z}_m$$으로 쓴다.

**해당하는 예:** $$38 \equiv 14 \pmod{12}$$(차이 24), $$-7 \equiv 2 \pmod 3$$(차이 $$-9$$), $$10 \equiv 0 \pmod 5$$. **해당하지 않는 예:** $$7 \not\equiv 2 \pmod 3$$(차이 5), $$a \equiv b \pmod 0$$은 정의하지 않는다($$m$$은 양수).

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">계산과 맞물린다</div>

$$a \equiv b$$, $$c \equiv d \pmod m$$이면 $$a + c \equiv b + d$$, $$a - c \equiv b - d$$, $$ac \equiv bd$$, $$a^k \equiv b^k \pmod m$$($$k \in \mathbb{N}$$).

</div>


그래서 덧셈·곱셈 중간에 언제든 $$\bmod m$$을 취해도 된다. 나눗셈은 다르다. $$2 \cdot 3 \equiv 2 \cdot 0 \pmod 6$$이지만 $$3 \not\equiv 0 \pmod 6$$이다. 양변에서 $$c$$를 지울 수 있는 것은 $$c$$와 $$m$$의 공약수가 1뿐일 때다([모듈러 역원](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)).

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**나눗셈 정리.**
1. *존재:* $$S = \{a - dq : q \in \mathbb{Z},\ a - dq \ge 0\}$$은 비어 있지 않다($$q = -\vert a\vert $$이면 $$a + d\vert a\vert  \ge 0$$). 정렬 원리로 가장 작은 원소 $$r = a - dq$$가 있다. $$r \ge d$$라면 $$r - d = a - d(q + 1) \in S$$가 더 작아 모순이다. 그래서 $$0 \le r < d$$.
2. *유일성:* $$dq + r = dq' + r'$$이고 $$0 \le r, r' < d$$라 하자. $$d(q - q') = r' - r$$이고 $$\vert r' - r\vert  < d$$이다. $$d$$의 배수 중 절댓값이 $$d$$보다 작은 것은 0뿐이라 $$r = r'$$, $$q = q'$$.

**곱셈과 맞물림.** $$m \mid (a - b)$$, $$m \mid (c - d)$$라 하자.

{: start="3"}
3. *항 나누기:* $$ac - bd = a(c - d) + d(a - b)$$.
4. *결론:* 두 항이 모두 $$m$$의 배수라 합도 $$m$$의 배수다. 거듭제곱은 곱셈을 $$k$$번 쓴 것이라 [귀납법](/Hongs_Blog/studies/discrete-math/induction/)으로 나온다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 "r ≥ d라면 모순"인 이유는?</summary>

$$r - d$$도 $$a - d(\text{정수})$$ 꼴이고 0 이상이라 $$S$$에 들어간다. 그런데 $$r$$보다 작으므로 $$r$$이 가장 작다는 선택과 어긋난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3단계의 식 ac − bd = a(c − d) + d(a − b)는 어디서 나오는가?</summary>

우변을 전개하면 $$ac - ad + ad - bd$$이다. $$ad$$를 한 번 빼고 한 번 더해 두 차이 $$c - d$$, $$a - b$$가 드러나게 만든 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명들의 핵심 아이디어는?</summary>

존재는 "가장 작은 것"을 잡고(정렬 원리), 유일성은 "두 개라면 차이가 너무 작다"로, 맞물림은 "차이를 이미 아는 차이들의 조합으로 쓰기"로 보인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

[유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)의 정확성(공약수는 차이도 나눈다)과 베주 항등식의 증명(가장 작은 양의 일차결합)이다.

</details>


## 예제

**ISBN-10 검사.** 책 번호 0-306-40615-2의 열 자리 $$d_1, \dots, d_{10}$$은 $$\sum_{i=1}^{10}(11 - i)d_i \equiv 0 \pmod{11}$$을 만족하도록 마지막 자리를 정한다.

1. *가중합:* $$10 \cdot 0 + 9 \cdot 3 + 8 \cdot 0 + 7 \cdot 6 + 6 \cdot 4 + 5 \cdot 0 + 4 \cdot 6 + 3 \cdot 1 + 2 \cdot 5 + 1 \cdot 2 = 132$$.
2. *판정:* $$132 = 11 \times 12$$라 $$\equiv 0$$. 올바른 번호다.
3. *오류 검출:* 한 자리를 잘못 쓰면 합이 $$w \cdot \delta$$($$1 \le w, \vert \delta\vert  \le 10$$)만큼 바뀐다. 11은 소수라 $$w\delta$$가 11의 배수일 수 없어 반드시 걸린다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 나눗셈 정리의 존재와 유일성(범위 전수), 동치 정의, 맞물림 성질(무작위 1만 쌍), 소거가 안 되는 예, 요일·자릿수 합 예시, ISBN 예제와 한 자리 오류·이웃 자리 바꿈 전수 검출, 언어별 음수 나머지 — [26_modular-arithmetic_verify.py](/Hongs_Blog/studies/discrete-math/code/26_modular-arithmetic_verify/)</div>

</div>


## 활용

- **해시 테이블.** 키 $$k$$를 칸 번호 $$k \bmod m$$에 넣는다. 순환 버퍼는 다음 칸을 $$(i + 1) \bmod n$$으로 정한다.
- **정수 오버플로.** 32비트 부호 없는 정수의 덧셈·곱셈은 $$\bmod 2^{32}$$ 산술이다. 그래서 오버플로가 나도 결과는 참값과 $$2^{32}$$을 법으로 합동이다. $$a \bmod 2^k$$는 비트 연산 `a & (2**k - 1)`과 같다.
- **검사 숫자.** ISBN(법 11), 신용카드 번호의 룬 알고리즘(법 10)처럼 한 자리 입력 실수를 잡는다.
- **흔한 실수.** 음수의 나머지. 아래 오해를 본다.
- 알고리즘에서: 답을 $$10^9 + 7$$로 나눈 나머지로 내는 경우의 수 문제는 더하고 빼고 곱할 때마다 나머지를 취해 수를 작게 유지한다([네오의 귀걸이](/Hongs_Blog/studies/algorithms/pg1842/)). 시각을 0시부터 몇 분째로 바꾸면 하루보다 짧은 시간 차는 자정을 넘어도 (끝 − 시작) mod 1440이고, '시:분'은 60으로 나눈 몫과 나머지다([시간·날짜 계산](/Hongs_Blog/studies/algorithms/time-conversion/)). 정수 $$a$$를 양의 정수 $$d$$로 나눈 값의 올림 $$\lceil a/d \rceil$$($$\lceil\ \rceil$$는 소수점 아래를 올린 정수)은, 나머지가 1 이상일 때만 몫이 하나 넘어가므로 정수만으로 `(a + d - 1) // d`다([주차 요금 계산](/Hongs_Blog/studies/algorithms/pg92341/)). 그 밖에 [파이썬 기본 문법](/Hongs_Blog/studies/algorithms/python-basics/), [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/), [비트 연산과 비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/), [두 큐 합 같게 만들기](/Hongs_Blog/studies/algorithms/pg118667/), [키패드 누르기](/Hongs_Blog/studies/algorithms/pg67256/), [무지의 먹방 라이브](/Hongs_Blog/studies/algorithms/pg42891/)에서도 쓴다.

## 연결

- 선수: [동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/), [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)(정렬 원리)
- 이어지는 개념: [최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/), [모듈러 역원](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)(나눗셈이 되는 조건)
- 같은 구조: [각](/Hongs_Blog/studies/college-math/radian/)은 $$2\pi$$를 법으로 같은 방향이다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"−7 mod 3은 −1이다"</div>

수학의 정의로는 틀렸다. C, Java, JavaScript에서 `-7 % 3`이 `-1`이라 그렇게 알기 쉽다. 이 언어들은 몫을 0 쪽으로 버려($$-7 / 3 = -2$$) 나머지가 피제수의 부호를 따른다. 나눗셈 정리는 나머지를 $$0 \le r < 3$$으로 정하므로 $$-7 = 3 \times (-3) + 2$$, 즉 2다. Python의 `-7 % 3`은 몫을 아래로 내려($$-7 // 3 = -3$$) 2를 준다. 배열 인덱스로 쓸 때 C 계열에서는 `((a % m) + m) % m`으로 고친다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 나눗셈 정리와 a ≡ b (mod m)의 정의를 쓰라.</summary>

**답:** 정수 $$a$$와 양의 정수 $$d$$에 대해 $$a = dq + r$$, $$0 \le r < d$$인 정수 $$q, r$$이 유일하게 있다. $$a \equiv b \pmod m$$은 $$m \mid (a - b)$$, 즉 $$a - b$$가 $$m$$의 배수라는 뜻이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 오늘이 금요일이면 100일 뒤와 1000일 뒤는 각각 무슨 요일인가?</summary>

**답:** $$100 \bmod 7 = 2$$라 일요일, $$1000 \bmod 7 = 6$$이라 목요일.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** ac ≡ bc (mod m)인데 a ≢ b (mod m)인 예를 들고, 무엇이 문제인지 쓰라.</summary>

**답:** $$2 \cdot 3 \equiv 2 \cdot 0 \pmod 6$$(둘 다 0)인데 $$3 \not\equiv 0$$. $$c = 2$$와 $$m = 6$$이 공약수 2를 가져 양변을 2로 "나눌" 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** a ≡ b, c ≡ d (mod m)이면 ac ≡ bd (mod m)인 이유를 한 줄 식으로 보여라.</summary>

**답:** $$ac - bd = a(c - d) + d(a - b)$$이고, 두 괄호가 모두 $$m$$의 배수라 전체도 $$m$$의 배수다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장 "Number Theory"(나눗셈 정리, 합동). Rosen, *Discrete Mathematics and Its Applications* 7판, 4장.
[^s1]: 에이전트 보충. ISBN-10의 검사식과 오류 검출은 국제 ISBN 규약에 따른 것이다. 한 자리 오류와 이웃한 두 자리 바꿈을 모두 잡는다는 것은 26_modular-arithmetic_verify.py에서 예제 번호의 모든 경우를 전수로 확인했다.
{% endraw %}
