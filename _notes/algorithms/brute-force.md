---
layout: "note"
title: "완전탐색"
display_title: "완전탐색 (Brute Force)"
kind: "concept"
kind_label: "기법"
num: "16"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Brute Force", "Complete Search", "완전탐색", "브루트포스", "전수 조사", "itertools", "순열", "조합", "product", "permutations", "combinations"]
description: "비밀번호를 잊은 세 자리 자물쇠를 000부터 999까지 모두 돌려 보는 것과 같다. 가능한 경우를 빠짐없이 만들어 하나씩 확인하므로, 생각할 것이 가장 적고 틀릴 일도 적다. 그래서 경우의 수가 작으면 가장 먼저 고른다. 대신 경우의 수는 조금만 커져도 폭발하므로, 짜기 전에 몇 …"
prev_url: "/studies/algorithms/union-find/"
prev_title: "유니온 파인드"
next_url: "/studies/algorithms/recursion-backtracking/"
next_title: "재귀와 백트래킹"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/brute-force/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

비밀번호를 잊은 세 자리 자물쇠를 000부터 999까지 모두 돌려 보는 것과 같다. 가능한 경우를 빠짐없이 만들어 하나씩 확인하므로, 생각할 것이 가장 적고 틀릴 일도 적다. 그래서 경우의 수가 작으면 가장 먼저 고른다. 대신 경우의 수는 조금만 커져도 폭발하므로, 짜기 전에 몇 가지인지 반드시 먼저 센다.

</div>


## 예시로 보기

카드 [1, 2, 3, 4] 중 두 장을 골라 합이 5가 되는 경우를 모두 찾는다.

| 고른 두 장 | 합 | 5인가 |
|---|---|---|
| 1, 2 | 3 | |
| 1, 3 | 4 | |
| 1, 4 | 5 | 예 |
| 2, 3 | 5 | 예 |
| 2, 4 | 6 | |
| 3, 4 | 7 | |

두 장을 고르는 경우는 $$\binom{4}{2} = 6$$($$\binom{\ }{\ }$$은 위의 수만큼 있는 것에서 아래의 수만큼 고르는 경우의 수)가지다. 6가지를 모두 확인했으니 빠진 답이 없다. 카드가 1,000장이어도 두 장 고르기는 약 50만 가지라 다 해 볼 수 있다. 하지만 "몇 장이든 골라서"라면 $$2^{1000}$$가지라 불가능하다.

## 경우의 수 세기

무엇을 나열하는지에 따라 개수가 크게 다르다. 자세한 셈법은 [순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/)에 있다.

| 나열하는 것 | 개수 | n = 10일 때 | 파이썬 도구[^1] |
|---|---|---|---|
| 자리마다 k가지 중 하나를 n자리 | $$k^n$$ | $$2^{10} = 1024$$ | `product(값들, repeat=n)` |
| n개를 한 줄로 세우는 순서 | $$n!$$ | 3,628,800 | `permutations(a)` |
| n개 중 r개를 순서 있게 | $$n!/(n-r)!$$ | r = 3이면 720 | `permutations(a, r)` |
| n개 중 r개를 순서 없이 | $$\binom{n}{r}$$ | r = 3이면 120 | `combinations(a, r)` |
| n개의 모든 부분집합 | $$2^n$$ | 1024 | 비트마스크나 `combinations`를 r마다 |

```python
from itertools import product, permutations, combinations

list(product([0, 1], repeat=2))   # [(0,0), (0,1), (1,0), (1,1)]
list(permutations("abc", 2))      # [('a','b'), ('a','c'), ('b','a'), ('b','c'), ('c','a'), ('c','b')]
list(combinations("abc", 2))      # [('a','b'), ('a','c'), ('b','c')]
```

순서가 결과를 바꾸면(누가 먼저 가는가, 어떤 순서로 계산하는가) 순열, 바꾸지 않으면(누구를 뽑는가) 조합이다.

## 짜기 전 네 가지 질문

1. **무엇을 나열하나?** 한 경우가 무엇인지 정확히 적는다. 예: "연산자 세 개의 우선순위 순서 하나".
2. **몇 가지인가?** 위 표로 센다.
3. **한 경우를 확인하는 비용은?** 예: 식을 한 번 계산하는 데 길이만큼.
4. **곱이 천만 이하인가?** (경우의 수) × (확인 비용)을 [시간 복잡도](/Hongs_Blog/studies/algorithms/complexity-budget/)의 기준에 맞춘다.

넘치면 경우를 줄일 관찰을 찾는다. 대표적인 두 가지가 있다.
- **반복되는 것은 한 바퀴만 본다.** 상태가 일정한 주기로 되풀이되면, 여러 주기가 함께 도는 경우 전체가 되풀이되는 길이는 주기들의 최소공배수다([최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)). 그 안에서 못 찾으면 영원히 없다.
- **답이 될 수 없는 경우는 일찍 버린다.** 선택을 하나씩 쌓다가 이미 틀린 것이 보이면 더 쌓지 않는다. 이것이 백트래킹이다. [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/) 문서에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시(합이 5인 쌍 2개), 표의 개수 공식(n ≤ 8, r ≤ n의 모든 경우에서 itertools가 만든 개수와 일치), 코드 예의 출력, "주기 p와 q로 도는 두 상태를 합친 것은 lcm(p, q)마다 되풀이된다"(p, q ≤ 20의 모든 쌍)를 확인했다 — [16_brute-force_verify.py](/Hongs_Blog/studies/algorithms/code/16_brute-force_verify/)</div>

</div>


## 활용

- 제한이 아주 작은 문제(n ≤ 8~10의 순서, n ≤ 20의 부분집합, 격자 5 × 5 등)는 먼저 완전탐색을 의심한다.
- 빠른 풀이를 짠 뒤, 작은 입력에서 완전탐색과 결과를 비교하면 빠른 풀이의 틀린 곳을 찾을 수 있다. 이 볼트의 모든 풀이 코드가 그렇게 검증한다.
- 자주 하는 실수: 경우의 수를 세지 않고 짜서 시간 초과가 난다. 순열과 조합을 헷갈려 같은 경우를 여러 번 세거나 빠뜨린다.

## 연결

- 선수: [시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/), [순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/)
- 다음 개념: [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/)(나열을 직접 짜고, 일찍 버리기), 부분집합은 [비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/)로도 돈다.
- 연습: [노란불 신호등](/Hongs_Blog/studies/algorithms/pg468371/), [자물쇠와 열쇠](/Hongs_Blog/studies/algorithms/pg60059/), [외벽 점검](/Hongs_Blog/studies/algorithms/pg60062/)
- 표의 $$k^n$$과 $$2^n$$은 n이 곱하는 횟수라 [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)이고, 두 장 고르기 $$n(n-1)/2$$는 n이 곱해지는 값이라 거듭제곱이다. $$2^n$$은 n이 10 늘 때마다 약 1000배($$2^{10} = 1024$$)가 된다. 둘이 언제 역전하고 얼마나 벌어지는지는 [거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/)에 있다.
- "순서가 결과를 바꾸나"에 "같은 것을 다시 뽑을 수 있나"를 더하면 공식이 넷으로 갈린다. 표 첫 줄의 `product`가 중복순열이고, 표에 없는 넷째 칸 중복조합 $$\binom{n+r-1}{r}$$은 `combinations_with_replacement`가 만든다([순열·조합·중복조합 비교](/Hongs_Blog/studies/discrete-math/counting-formula-choice/)).
- 표 마지막 줄의 $$2^n$$은 원소마다 넣을지 뺄지 두 가지씩 고른 수로, n개짜리 집합의 부분집합을 모두 모은 것([멱집합](/Hongs_Blog/studies/discrete-math/sets/))의 크기다. 크기 r마다 `combinations`로 만들어 더해도 같은 수가 나온다. [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)에 x = y = 1을 넣으면 $$\sum_r \binom{n}{r} = 2^n$$($$\sum$$은 차례로 모두 더한다는 기호)이기 때문이다.
- 완전탐색과 답을 비교하는 검증은 "모든 입력에서 두 풀이의 답이 같다"의 반례를 찾는 일이다([술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/)). 다른 답이 하나라도 나오면 틀렸다는 증거지만, 시험한 입력에서 모두 같아도 증명은 아니다. 입력을 무작위로 만들어 비교하면 [몬테카를로 방법](/Hongs_Blog/studies/probability-statistics/monte-carlo/)이 된다. 틀리는 입력이 드물면 무작위로는 잘 걸리지 않으니, 빈 입력, 길이 1, 값이 모두 같은 입력 같은 경계는 따로 넣는다.
- 함께 보면 좋은 수학: [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)(표의 $$k^n$$과 4번 질문의 곱셈), [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)(`product(range(k), repeat=n)`의 순서가 k진법으로 0부터 세는 순서다), [중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/)(주기가 서로소이면 두 상태의 모든 짝이 한 바퀴 안에 나온다)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 서로 다른 원소 5개로 길이 3인 순서 있는 나열을 만들면 몇 개인가? 이를 만드는 itertools 함수는?</summary>

**답:** 5 × 4 × 3 = 60개. `permutations(a, 3)`이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (가) 학생 6명 중 대표 2명 뽑기, (나) 6명을 발표 순서대로 세우기, (다) 비밀번호 네 자리를 0~9로 만들기. 각각 어떤 도구와 개수인가?</summary>

**답:** (가) `combinations`, $$\binom{6}{2} = 15$$. 누가 뽑히는지만 중요하다. (나) `permutations`, 6! = 720. 순서가 결과를 바꾼다. (다) `product(range(10), repeat=4)`, 10⁴ = 10,000. 같은 숫자를 다시 써도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 초록·노랑·빨강 주기가 각각 5초와 6초인 신호등 두 개가 있다. "둘이 동시에 노란불인 순간"을 찾을 때 30초까지만 확인하면 되는 까닭은?</summary>

**답:** 두 신호등을 합친 상태는 30초(5와 6의 최소공배수)마다 처음과 똑같이 되풀이된다. 30초 안에 동시에 노란불인 순간이 없으면 그 뒤에도 같은 모습이 되풀이될 뿐이라 영원히 없다.

</details>


[^1]: Python 3 표준 라이브러리 문서, "itertools — Functions creating iterators for efficient looping"(`product`, `permutations`, `combinations`와 각각이 만드는 개수). 완전탐색의 부분집합·순열 만들기는 Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 5.1 "Generating subsets", 5.2 "Generating permutations".
{% endraw %}
