---
layout: "note"
title: "재귀적 정의와 구조적 귀납법"
display_title: "재귀적 정의와 구조적 귀납법 (Recursive Definitions and Structural Induction)"
kind: "concept"
kind_label: "기법"
num: "13"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Recursive Definition", "Structural Induction", "재귀적 정의", "귀납적 정의", "구조적 귀납법", "재귀 자료형", "recursive data type", "균형 괄호", "balanced parentheses", "정 이진 트리", "full binary tree", "카탈랑 수", "Catalan number"]
description: "끝없이 많은 대상을 \"기본 재료 몇 개\"와 \"이미 만든 것으로 새것을 만드는 규칙\"으로 정의하는 방법이다. 리스트, 트리, 수식, 프로그래밍 언어의 문법이 모두 이렇게 정의되고, 재귀 함수가 이 정의를 그대로 따라간다. 이렇게 정의한 대상의 성질은 같은 모양으로 증명한다. 기본 재…"
prev_url: "/studies/discrete-math/induction/"
prev_title: "수학적 귀납법"
next_url: "/studies/discrete-math/counting-rules/"
next_title: "셈의 기본 법칙"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/recursive-definitions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

끝없이 많은 대상을 "기본 재료 몇 개"와 "이미 만든 것으로 새것을 만드는 규칙"으로 정의하는 방법이다. 리스트, 트리, 수식, 프로그래밍 언어의 문법이 모두 이렇게 정의되고, 재귀 함수가 이 정의를 그대로 따라간다. 이렇게 정의한 대상의 성질은 같은 모양으로 증명한다. 기본 재료에서 맞고 규칙이 성질을 보존하면 모든 대상에서 맞는다(구조적 귀납법). 단, "이 규칙으로 만든 것만 해당한다"는 조건이 있어야 대상이 딱 정해진다.

</div>


## 예시로 보기

괄호가 제대로 짝지어진 문자열(균형 괄호)을 세 규칙으로 정의한다.

1. 빈 문자열 $$\varepsilon$$은 균형 괄호다.
2. $$s$$가 균형 괄호면 $$(s)$$도 균형 괄호다.
3. $$s$$, $$t$$가 균형 괄호면 이어 붙인 $$st$$도 균형 괄호다.
4. 이 규칙으로 만든 것만 균형 괄호다.

$$\varepsilon \to ()$$ (규칙 2) $$\to ()()$$ (규칙 3) $$\to (()())$$ (규칙 2)처럼 만든다. 길이 6인 균형 괄호는 `((()))`, `(()())`, `(())()`, `()(())`, `()()()` 다섯 개다. 규칙 1이 아래 정의의 기저, 규칙 2와 3이 생성 규칙, 규칙 4가 한정 조건이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

집합 $$S$$의 **재귀적 정의**는 세 부분으로 된다[^1].
- 기저: $$S$$에 속하는 기본 원소들
- 생성 규칙: $$S$$의 원소들로 $$S$$의 새 원소를 만드는 규칙
- 한정: 기저에서 규칙을 유한 번 적용해 얻은 것만 $$S$$의 원소다

**구조적 귀납법.** $$S$$의 모든 원소가 성질 $$P$$를 가짐을 보이려면 (1) 모든 기저 원소가 $$P$$를 가지고 (2) 각 생성 규칙이 $$P$$를 가진 원소들로부터 $$P$$를 가진 원소를 만든다는 것을 보이면 된다.

</div>


구조적 귀납법은 "만드는 데 쓴 규칙의 횟수"에 대한 강한 귀납법이라 [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)과 같은 근거로 옳다.

**재귀 함수.** 재귀적으로 정의된 대상 위의 함수는 경우를 나눠 정의한다. 정 이진 트리(full binary tree, 각 노드가 자식 0개 또는 2개)를 "잎 하나" 또는 "왼쪽·오른쪽 트리를 붙인 노드"로 정의하면, 잎의 수는 $$\text{leaves}(\text{잎}) = 1$$, $$\ \text{leaves}(T_L, T_R) = \text{leaves}(T_L) + \text{leaves}(T_R)$$이다. 코드도 같은 모양이다.

```python
def leaves(t):
    if t is None:               # 잎
        return 1
    left, right = t             # 노드 = (왼쪽, 오른쪽)
    return leaves(left) + leaves(right)
```

## 예제

**정 이진 트리의 잎은 내부 노드보다 하나 많다.**

1. *성질:* $$P(T)$$: $$\text{leaves}(T) = \text{internal}(T) + 1$$.
2. *기저:* 잎 하나짜리 트리는 잎 1, 내부 노드 0이라 맞는다.
3. *생성 규칙:* $$T_L$$, $$T_R$$이 $$P$$를 가진다고 하자. 둘을 새 노드로 붙인 $$T$$는 잎이 $$\text{leaves}(T_L) + \text{leaves}(T_R) = (\text{internal}(T_L) + 1) + (\text{internal}(T_R) + 1)$$개, 내부 노드가 $$\text{internal}(T_L) + \text{internal}(T_R) + 1$$개(새 노드 포함)다. 잎이 내부 노드보다 1 많다.
4. *결론:* 모든 정 이진 트리가 $$P$$를 가진다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 규칙으로 만든 문자열이 길이 12 이하의 모든 균형 문자열과 같음, 개수 1, 1, 2, 5, 14, 42, 132, 무작위 트리 3,000개에서 잎 = 내부 + 1, 순진한 피보나치 재귀의 호출 수 — [13_recursive-definitions_verify.py](/Hongs_Blog/studies/discrete-math/code/13_recursive-definitions_verify/)</div>

</div>


## 활용

- **자료구조.** 연결 리스트("빈 리스트, 또는 원소 하나와 리스트"), 트리, JSON 값이 재귀 자료형이다. 이런 자료를 다루는 함수는 기저 경우와 재귀 경우로 나뉘는 재귀 함수가 자연스럽다.
- **문법과 파서.** 프로그래밍 언어의 문법(BNF)은 식·문장을 재귀적으로 정의한다. 파서는 이 정의를 따라 재귀적으로 내려간다.
- **재귀의 비용.** 피보나치 수를 정의 그대로 `fib(n-1) + fib(n-2)`로 계산하면 같은 값을 반복 계산해 호출이 $$2F_{n+1} - 1$$번($$F$$는 피보나치 수)으로 지수적으로 늘어난다. 정의는 재귀여도 계산은 앞에서부터 쌓아 올리면(동적 계획법) $$n$$번으로 끝난다.
- 길이 $$2n$$인 균형 괄호의 수 $$1, 1, 2, 5, 14, 42, \dots$$는 카탈랑 수로, 이진 트리의 모양 수 등 여러 곳에 나온다[^s1].
- 알고리즘에서: 재귀 함수를 짜는 순서(기저 사례부터 보고, 더 작은 같은 문제로 줄이고, 작은 문제의 답은 맞다고 믿기)와 파이썬의 재귀 깊이 한도(약 1,000)는 [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/)에 있다. 균형 괄호는 [스택](/Hongs_Blog/studies/algorithms/stack/)으로 판정하고, [올바른 괄호의 갯수](/Hongs_Blog/studies/algorithms/pg12929/)에서는 맨 앞 `(`와 그 짝으로 나눈 점화식으로 센다. "뿌리 → 오른쪽 → 왼쪽" 순서로 적은 목록을 뒤집으면 후위 순회가 된다는 것도 이진 트리에 대한 구조적 귀납법으로 보인다([길 찾기 게임](/Hongs_Blog/studies/algorithms/pg42892/)). 그 밖에 [트리 순회와 이진 탐색 트리](/Hongs_Blog/studies/algorithms/tree-traversal-bst/), [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/), [4단 고음](/Hongs_Blog/studies/algorithms/pg1831/), [사칙연산](/Hongs_Blog/studies/algorithms/pg1843/)에서도 쓴다.

## 연결

- 선수: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/), [집합](/Hongs_Blog/studies/discrete-math/sets/)
- 이어지는 개념: [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)(재귀적으로 정의된 수열), [트리](/Hongs_Blog/studies/discrete-math/trees/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 균형 괄호의 재귀적 정의(기저 ε, 규칙 (s)와 st)를 쓰고, 길이 6인 균형 괄호를 모두 나열하라.</summary>

**답:** 기저 $$\varepsilon$$, 규칙 $$s \Rightarrow (s)$$, $$s, t \Rightarrow st$$, 그리고 이렇게 만든 것만. 길이 6: `((()))`, `(()())`, `(())()`, `()(())`, `()()()`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 정 이진 트리에서 잎 = 내부 노드 + 1을 구조적 귀납법으로 증명하라. 생성 규칙 단계에서 +1은 어디서 오는가?</summary>

**답:** 기저: 잎 하나(1 = 0 + 1). 규칙: $$T_L$$, $$T_R$$이 성질을 가지면 붙인 트리의 잎은 $$(i_L + 1) + (i_R + 1)$$, 내부 노드는 $$i_L + i_R + 1$$이다. 내부 노드의 $$+1$$은 둘을 잇는 새 노드이고, 잎 쪽에는 $$+1$$이 두 번 있어 차이가 1로 유지된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "리스트는 빈 리스트이거나, 원소 하나와 리스트의 쌍이다"라는 정의를 따라 리스트의 길이를 구하는 재귀 함수를 쓰라.</summary>

**답:** `def length(xs): return 0 if xs is None else 1 + length(xs[1])` (리스트를 `(머리, 꼬리)` 쌍으로 표현). 기저에서 0, 규칙마다 1을 더한다. 정의의 두 경우가 함수의 두 경우가 된다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 7장 "Recursive Data Types"(재귀적 정의, 구조적 귀납법, 균형 괄호). Rosen, *Discrete Mathematics and Its Applications* 7판, 5장.
[^s1]: 에이전트 보충. $$n$$번째 카탈랑 수는 $$\frac{1}{n+1}\binom{2n}{n}$$이다. 이 값은 검증 코드의 개수와 같다(1, 1, 2, 5, 14, 42, 132).
{% endraw %}
