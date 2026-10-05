---
layout: "note"
title: "비트 연산과 비트마스크"
display_title: "비트 연산과 비트마스크 (Bit Operations and Bitmasks)"
kind: "concept"
kind_label: "기법"
num: "09"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-02"
status: "verified"
aliases: ["Bit Operations", "Bitmask", "비트 연산", "비트마스크", "AND", "OR", "XOR", "시프트", "shift", "부분집합"]
description: "스위치가 한 줄로 달린 전등판을 생각하면 된다. 수 하나를 0(꺼짐)과 1(켜짐)의 줄, 즉 이진수로 보면, 모든 스위치를 한꺼번에 켜고 끄고 비교하는 일을 계산 한 번으로 할 수 있다. 여러 개 중 무엇을 골랐는지도 \"고른 것은 1, 안 고른 것은 0\"으로 수 하나에 담는다(비트…"
prev_url: "/studies/algorithms/simulation/"
prev_title: "구현과 시뮬레이션"
next_url: "/studies/algorithms/stack/"
next_title: "스택"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/bit-operations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

스위치가 한 줄로 달린 전등판을 생각하면 된다. 수 하나를 0(꺼짐)과 1(켜짐)의 줄, 즉 이진수로 보면, 모든 스위치를 한꺼번에 켜고 끄고 비교하는 일을 계산 한 번으로 할 수 있다. 여러 개 중 무엇을 골랐는지도 "고른 것은 1, 안 고른 것은 0"으로 수 하나에 담는다(비트마스크). 빠르고 짧지만, 이진수를 머릿속에 그리지 않으면 읽기 어렵다.

</div>


## 예시로 보기

9와 30을 5자리 이진수로 쓰고 자리끼리 비교한다. 이진수 쓰는 법은 [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)에 있다.

```
 9  = 0 1 0 0 1
30  = 1 1 1 1 0
----------------
 |  = 1 1 1 1 1  = 31   둘 중 하나라도 1이면 1 (OR)
 &  = 0 1 0 0 0  =  8   둘 다 1이어야 1 (AND)
 ^  = 1 0 1 1 1  = 23   서로 다르면 1 (XOR)
```

두 장의 지도를 겹쳐 "어느 한쪽이라도 벽이면 벽"을 구하는 일이 바로 <code>&#124;</code>다. 칸마다 따로 비교할 필요 없이 한 줄을 한 번에 계산한다.

## 연산

| 코드 | 뜻 | 예 (a = 12 = 1100, b = 10 = 1010) |
|---|---|---|
| `a & b` | 자리마다 둘 다 1이면 1 | `1000` = 8 |
| `a \| b` | 자리마다 하나라도 1이면 1 | `1110` = 14 |
| `a ^ b` | 자리마다 다르면 1 | `0110` = 6 |
| `a << k` | 왼쪽으로 k칸 밀기 = × 2ᵏ | `12 << 1` = 24 |
| `a >> k` | 오른쪽으로 k칸 밀기 = ÷ 2ᵏ의 몫 | `12 >> 2` = 3 |
| `~a` | 모든 자리 뒤집기 = −a − 1 | `~12` = −13 |

이진수 문자열과 수를 오갈 때는 이렇게 쓴다[^1].

```python
bin(9)             # '0b1001'
format(9, "05b")   # '01001'  5자리 이진수, 모자라면 앞에 0
int("1001", 2)     # 9
```

## 한 자리만 다루기

오른쪽 끝 자리를 0번이라 할 때, k번 자리를 이렇게 다룬다[^2].

| 하고 싶은 일 | 코드 |
|---|---|
| k번이 켜져 있나 | `(x >> k) & 1` 또는 `x & (1 << k) != 0` |
| k번 켜기 | `x \| (1 << k)` |
| k번 끄기 | `x & ~(1 << k)` |
| k번 뒤집기 | `x ^ (1 << k)` |
| 켜진 자리 수 | `bin(x).count("1")` |

## 비트마스크: 부분집합을 수 하나로

원소가 n개일 때, 부분집합 하나를 "i번 원소를 골랐으면 i번 자리가 1"인 수로 나타낸다. 부분집합은 모두 $$2^n$$개이고, 0부터 $$2^n - 1$$까지의 수와 하나씩 짝이 맞는다.

```python
items = ["a", "b", "c"]
for mask in range(1 << 3):                   # 0 ~ 7
    chosen = [items[i] for i in range(3) if (mask >> i) & 1]
    print(format(mask, "03b"), chosen)
# 000 [] / 001 ['a'] / 010 ['b'] / 011 ['a', 'b'] / … / 111 ['a', 'b', 'c']
```

`A & B == A`면 A는 B의 부분집합이다. A의 켜진 자리가 모두 B에서도 켜져 있다는 뜻이기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시와 두 표의 모든 값, 0~255의 모든 수와 0~7번 자리에서 한 자리 연산이 문자열로 따로 계산한 결과와 같다는 것, n ≤ 10에서 비트마스크가 부분집합 2ⁿ개를 겹치지 않고 모두 만든다는 것, `A & B == A`와 부분집합 관계가 같다는 것(n = 6의 모든 쌍)을 확인했다 — [09_bit-operations_verify.py](/Hongs_Blog/studies/algorithms/code/09_bit-operations_verify/)</div>

</div>


## 활용

- 두 이진 지도를 겹치기, 켜짐·꺼짐 상태를 여러 개 한 번에 기억하기(방문한 방들, 밟은 함정들), 부분집합 모두 돌기.
- 비트마스크는 "상태"를 수 하나로 만들어 딕셔너리 키나 리스트 번호로 쓸 수 있게 해 준다. 그래프 탐색과 DP에서 많이 쓴다.
- 자주 하는 실수:
  - 연산 순서: 파이썬에서는 `+`, `-`가 `<<`, `>>`보다 먼저 계산된다. 그래서 `1 << k - 1`은 `(1 << k) - 1`이 아니라 `1 << (k - 1)`이다. 비트 연산은 괄호로 감싸 두는 편이 안전하다. C·자바에서는 `x & 1 == 0`도 `x & (1 == 0)`으로 계산되어 틀린다(파이썬은 `(x & 1) == 0`으로 계산한다).
  - 앞자리 0: `bin(9)`는 `'0b1001'`이라 5자리가 아니다. 자리 수를 맞출 때는 `format(x, "0{n}b")` 꼴로 쓴다.

## 연결

- 선수: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 같은 구조: AND·OR·XOR은 [불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/)의 논리 연산을 자리마다 한 것이다.
- 비트마스크는 [집합](/Hongs_Blog/studies/discrete-math/sets/)을 수 하나에 담은 것이다. <code>&#124;</code>는 합집합, `&`는 교집합, `& ~`는 차집합이다.
- mask와 부분집합이 하나씩 짝지어진다는 것(전단사)을 단사와 전사로 나눠 증명한 글은 [함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/)의 예제에 있다.
- `x & ((1 << k) - 1)`은 x를 $$2^k$$로 나눈 나머지다. 그래서 `x >> k`(몫)와 이 값은 [나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)의 나눗셈 정리 $$x = 2^k q + r$$ ($$0 \le r < 2^k$$)에서 q와 r을 비트로 바로 읽은 것이다. 파이썬에서는 x가 음수여도 `x // 2**k`, `x % 2**k`와 값이 같다.
- 연습: [비밀지도](/Hongs_Blog/studies/algorithms/pg17681/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** <code>5 &#124; 3</code>, `5 & 3`, `5 ^ 3`, `5 << 2`의 값은?</summary>

**답:** 7, 1, 6, 20. 5 = 101, 3 = 011이다. OR은 111 = 7, AND는 001 = 1, XOR은 110 = 6이다. `5 << 2`는 10100 = 20(= 5 × 4)이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 원소 n개의 부분집합이 정확히 2ⁿ개이고, 0부터 2ⁿ − 1까지의 수와 하나씩 짝이 맞는 까닭은?</summary>

**답:** 원소마다 "고른다/안 고른다" 두 가지라서 2 × 2 × … × 2 = 2ⁿ가지다. 원소 i의 선택을 i번 자리의 1/0으로 적으면 부분집합 하나가 n자리 이진수 하나가 된다. n자리 이진수는 0부터 2ⁿ − 1까지 모두 한 번씩 나오고, 서로 다른 부분집합은 어느 한 자리가 달라 서로 다른 수가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 원소 [a, b, c, d]에서 mask = 0b1011은 어떤 부분집합인가? 반대로 {b, c}는 어떤 수인가?</summary>

**답:** 0b1011은 0, 1, 3번 자리가 켜져 있어 {a, b, d}다. {b, c}는 1, 2번 자리가 켜진 0b0110 = 6이다. 자리 번호는 오른쪽 끝이 0번이다.

</details>


[^1]: Python 3 표준 라이브러리 문서, "Bitwise Operations on Integer Types"(`&`, <code>&#124;</code>, `^`, `<<`, `>>`, `~x = -(x+1)`)와 Built-in Functions의 `bin`, `format`, `int(x, base)`.
[^2]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 10.1 "Bit representation", 10.2 "Bit operations", 10.3 "Representing sets".
{% endraw %}
