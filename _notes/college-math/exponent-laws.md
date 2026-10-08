---
layout: "note"
title: "거듭제곱과 지수법칙"
display_title: "거듭제곱과 지수법칙 (Exponents)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Exponents", "Laws of Exponents", "지수법칙", "거듭제곱", "power", "밑", "base", "지수", "exponent", "유리수 지수", "거듭제곱근", "과학적 표기법", "scientific notation", "크기 어림", "order of magnitude"]
description: "거듭제곱은 같은 수를 몇 번 곱했는지 적는 방법이다. 곱셈의 횟수를 세는 것이라서, 곱하면 횟수끼리 더해지고 거듭제곱을 다시 거듭제곱하면 횟수끼리 곱해진다. 0번, 음수 번, 분수 번 곱하기는 이 규칙이 계속 맞도록 뜻을 정한 것이다. 단, 음수를 분수 번 곱하면 규칙이 깨지므로 …"
prev_url: "/studies/college-math/polynomial/"
prev_title: "다항식과 방정식"
next_url: "/studies/college-math/exponential-function/"
next_title: "지수함수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/exponent-laws/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

거듭제곱은 같은 수를 몇 번 곱했는지 적는 방법이다. 곱셈의 횟수를 세는 것이라서, 곱하면 횟수끼리 더해지고 거듭제곱을 다시 거듭제곱하면 횟수끼리 곱해진다. 0번, 음수 번, 분수 번 곱하기는 이 규칙이 계속 맞도록 뜻을 정한 것이다. 단, 음수를 분수 번 곱하면 규칙이 깨지므로 밑은 양수로 제한한다.

</div>


## 예시로 보기

$$2^3 \cdot 2^4$$는 $$2$$를 세 번 곱한 것과 네 번 곱한 것을 이어 곱했으니 $$2$$를 일곱 번 곱한 $$2^7$$이다. $$(2^3)^2$$는 $$2^3$$을 두 번 곱했으니 $$2$$를 $$3 \times 2 = 6$$번 곱한 $$2^6$$이다.

규칙을 지키려면 새 지수의 뜻이 저절로 정해진다.

| 지수 | 규칙에서 나오는 뜻 | 예 |
|---|---|---|
| $$0$$ | $$2^3 / 2^3 = 2^{3-3}$$이어야 하므로 $$1$$ | $$2^0 = 1$$ |
| 음수 | $$2^{-1} \cdot 2^1 = 2^0 = 1$$이어야 하므로 $$1/2$$ | $$2^{-3} = \tfrac18$$ |
| 분수 | $$(8^{1/3})^3 = 8^1$$이어야 하므로 세제곱근 | $$8^{1/3} = 2$$, $$8^{2/3} = 4$$ |

컴퓨터공학에서는 2의 거듭제곱을 자주 어림한다. $$2^{10} = 1024 \approx 10^3$$이므로 $$2^{10k} \approx 10^{3k}$$다.

| 값 | 정확한 값 | 어림 |
|---|---|---|
| $$2^{10}$$ | 1,024 | 천 |
| $$2^{20}$$ | 1,048,576 | 백만 |
| $$2^{30}$$ | 1,073,741,824 | 십억 |
| $$2^{32}$$ | 4,294,967,296 | 약 $$4.3 \times 10^9$$ (IPv4 주소 수) |
| $$2^{64}$$ | 18,446,744,073,709,551,616 | 약 $$1.8 \times 10^{19}$$ |

어림의 오차는 지수가 커질수록 쌓인다. $$2^{30}$$은 $$10^9$$보다 약 7% 크다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

밑 $$a > 0$$, $$b > 0$$, 정수 $$m$$, $$n$$, 양의 정수 $$q$$, 정수 $$p$$에 대해[^1]
- $$a^n = \underbrace{a \times \cdots \times a}_{n\text{번}}$$ ($$n \ge 1$$), $$a^0 = 1$$, $$a^{-n} = \dfrac{1}{a^n}$$
- $$a^{p/q} = \left(\sqrt[q]{a}\right)^p$$. 여기서 $$\sqrt[q]{a}$$는 $$q$$제곱해서 $$a$$가 되는 **양수**다.

이때 지수법칙이 맞는다.

$$a^m a^n = a^{m+n}, \qquad \frac{a^m}{a^n} = a^{m-n}, \qquad (a^m)^n = a^{mn}, \qquad (ab)^n = a^n b^n$$

유리수 지수에서도 같은 법칙이 맞는다.

</div>


0, 음수, 분수 지수의 정의는 임의로 고른 것이 아니다. 지수법칙을 지키는 정의가 이것 하나뿐이다. 예를 들어 $$a^0 a^n = a^{0+n} = a^n$$이 맞으려면 $$a^0 = 1$$일 수밖에 없다.

**밑을 양수로 두는 이유.** 음수 밑에서는 분수 지수가 법칙과 부딪힌다. 실수 세제곱근으로 $$(-8)^{1/3} = -2$$다. 그런데 $$\tfrac13 = \tfrac26$$이니 $$(-8)^{2/6} = \left((-8)^2\right)^{1/6} = 64^{1/6} = 2$$로도 계산된다. 같은 수가 $$-2$$와 $$2$$로 갈린다.

## 활용

- **저장 용량.** 1 KiB $$= 2^{10}$$ B, 1 GiB $$= 2^{30}$$ B이고, 1 kB $$= 10^3$$ B, 1 GB $$= 10^9$$ B다[^s1]. 제조사가 1 TB $$= 10^{12}$$ B라고 판 디스크를 운영체제가 GiB로 세면 $$10^{12} / 2^{30} \approx 931.3$$ GiB로 보인다.
- **부동소수점.** 배정밀도 수는 (가수) $$\times 2^{(\text{지수})}$$ 꼴이고 가수는 53비트다. 그래서 $$2^{53}$$까지의 정수는 모두 정확히 담지만 $$2^{53} + 1$$은 담지 못하고 $$2^{53}$$으로 반올림된다[^s1].
- **크기 어림.** "$$2^{64}$$가지 키를 초당 $$10^9$$개씩 시험하면?" 같은 질문을 $$1.8 \times 10^{19} / 10^9 = 1.8 \times 10^{10}$$초로 어림한다. 1년이 약 $$3.2 \times 10^7$$초이니 약 600년이다(정확히는 약 585년).
- 파이썬의 `(-8) ** (1/3)`은 $$-2$$가 아니라 복소수 `1.0000+1.7321j`를 낸다. 음수 밑의 분수 지수를 복소수로 해석하기 때문이다. 실수 세제곱근이 필요하면 부호를 따로 처리한다.
- 알고리즘에서: $$2^n$$가지를 모두 보는 방법은 $$2^{20}$$이 약 백만이라 $$n$$이 20쯤일 때까지만 시간 안에 끝난다([시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/)). 파이썬의 `/`는 늘 `float`를 내므로, $$2^{53}$$을 넘는 정수의 몫은 `//`로 구한다([파이썬 기본 문법](/Hongs_Blog/studies/algorithms/python-basics/)). 1과 $$1 + 2^{-52}$$ 사이에는 배정밀도 수가 없어서, [계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)는 큰 좌표의 기울기를 나눗셈 대신 정수 외적으로 비교한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 정수 지수 법칙(무작위 유리수 밑 3,000세트, 정확히), 유리수 지수 법칙(3,000세트, 상대오차 $$10^{-12}$$ 이내), 2의 거듭제곱 표, 931.3 GiB, $$2^{64}$$개 시험에 약 585년, $$2^{53} + 1$$의 반올림, 음수 밑의 반례, 파이썬의 복소수 결과 — [05_exponent-laws_verify.py](/Hongs_Blog/studies/college-math/code/05_exponent-laws_verify/)</div>

</div>


## 연결

- 이어지는 개념: [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)(지수를 변수로 둔 함수), [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)(자리마다 밑의 거듭제곱)
- 지수를 실수 전체로 넓히는 방법은 [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)에서 다룬다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"(a + b)² = a² + b²"</div>

틀렸다. $$(ab)^2 = a^2 b^2$$가 맞으니 덧셈에도 맞을 것처럼 보인다. 지수법칙은 **곱**에 대한 규칙이다. 합의 제곱은 $$(a + b)^2 = a^2 + 2ab + b^2$$이다. $$a = b = 1$$이면 $$(1 + 1)^2 = 4$$인데 $$1^2 + 1^2 = 2$$다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** a⁰ = 1, a⁻ⁿ = 1/aⁿ로 정하는 이유를 지수법칙으로 설명하라.</summary>

**답:** $$a^m a^n = a^{m+n}$$이 $$0$$과 음수 지수에서도 맞게 하려면 $$a^0 a^n = a^n$$이어야 하므로 $$a^0 = 1$$이다. 또 $$a^{-n} a^n = a^0 = 1$$이어야 하므로 $$a^{-n} = 1/a^n$$이다.

**흔한 오답:** "$$a^0 = 0$$". $$a$$를 한 번도 곱하지 않았으니 0이라고 생각하기 쉽지만, 곱셈에서 아무것도 안 한 상태는 $$1$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (a) 2³²는 대략 10의 몇 제곱인가? (b) 1 TB(10¹² 바이트) 디스크는 운영체제에서 대략 몇 GiB로 보이는가?</summary>

**답:** (a) $$2^{32} = 2^2 \cdot 2^{30} \approx 4 \times 10^9$$. 정확히는 $$4{,}294{,}967{,}296 \approx 4.3 \times 10^9$$다. (b) $$10^{12} / 2^{30} \approx 931.3$$ GiB.

**흔한 오답:** (b)에서 1000 GiB라고 하는 것. GiB는 $$10^9$$가 아니라 $$2^{30}$$ 바이트다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 밑이 음수일 때 (aᵐ)ⁿ = aᵐⁿ이 깨지는 예를 들라.</summary>

**답:** $$(-8)^{1/3} = -2$$(실수 세제곱근)인데, $$\tfrac13 = \tfrac26$$으로 보고 $$\left((-8)^2\right)^{1/6} = 64^{1/6} = 2$$로 계산하면 값이 다르다. 그래서 유리수 지수는 밑이 양수일 때만 쓴다.

</details>


[^1]: OpenStax, *College Algebra 2e*, 1.2절 "Exponents and Scientific Notation", 1.3절 "Radicals and Rational Exponents"
[^s1]: 에이전트 보충. KiB·GiB는 IEC의 2진 접두어이고 kB·GB는 10진 접두어다. 배정밀도의 가수 53비트(저장 52비트와 숨은 비트 1개)는 IEEE 754 표준의 형식이다. 두 사실 모두 검증 코드로 수치를 확인했다.
{% endraw %}
