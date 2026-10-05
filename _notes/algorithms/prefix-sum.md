---
layout: "note"
title: "누적 합과 차분 배열"
display_title: "누적 합과 차분 배열 (Prefix Sum and Difference Array)"
kind: "concept"
kind_label: "기법"
num: "19"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-02"
status: "verified"
aliases: ["Prefix Sum", "Difference Array", "누적 합", "구간 합", "부분 합", "차분 배열", "imos", "accumulate", "2차원 누적 합"]
description: "통장에 매일 잔고를 적어 두면 \"3일부터 7일까지 들어온 돈\"은 두 날의 잔고를 빼기만 하면 나온다. 이처럼 앞에서부터 더한 합을 한 번 만들어 두면, 어떤 구간의 합도 뺄셈 한 번으로 구한다. 거꾸로 \"이 구간에 모두 x를 더하라\"는 일이 많으면, 구간의 양 끝에만 표시해 두었다…"
prev_url: "/studies/algorithms/two-pointers/"
prev_title: "투 포인터와 슬라이딩 윈도"
next_url: "/studies/algorithms/binary-search/"
next_title: "이분 탐색"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/prefix-sum/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

통장에 매일 잔고를 적어 두면 "3일부터 7일까지 들어온 돈"은 두 날의 잔고를 빼기만 하면 나온다. 이처럼 앞에서부터 더한 합을 한 번 만들어 두면, 어떤 구간의 합도 뺄셈 한 번으로 구한다. 거꾸로 "이 구간에 모두 x를 더하라"는 일이 많으면, 구간의 양 끝에만 표시해 두었다가 마지막에 한 번 더해 나간다(차분 배열). 둘 다 값이 중간에 자꾸 바뀌면서 질문도 계속 들어오는 상황에는 맞지 않는다.

</div>


## 예시로 보기

### 구간 합

a = [3, 1, 4, 1, 5, 9]에서 앞에서부터 더한 합 P를 만든다. P[0] = 0으로 두고, P[i + 1] = P[i] + a[i]다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| a[i] | 3 | 1 | 4 | 1 | 5 | 9 | |
| P[i] | 0 | 3 | 4 | 8 | 9 | 14 | 23 |

P[i]는 "a의 앞 i개의 합"이다. a[2] + a[3] + a[4]를 구하려면 앞 5개의 합에서 앞 2개의 합을 뺀다. P[5] − P[2] = 14 − 4 = 10이다. 직접 더해도 4 + 1 + 5 = 10이다.

### 구간 더하기

길이 6인 0 배열에서 1 ~ 3번에 2를, 2 ~ 5번에 5를 더한다. 칸마다 하나씩 더하지 않고, 길이 7인 표시판 D의 **시작 칸에 +x, 끝 다음 칸에 −x**만 적는다.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| D[i] | 0 | 2 | 5 | 0 | −2 | 0 | −5 |
| 앞에서부터 더하면 | 0 | 2 | 7 | 7 | 5 | 5 | |

앞에서부터 더해 나가면 +2는 1번부터 계속 따라오다가 4번의 −2에서 사라진다. 그래서 1 ~ 3번에만 2가 더해진다. 표시는 구간 하나당 두 칸이라, 구간이 아무리 길어도 적는 일은 두 번이다.

```python
from itertools import accumulate
P = list(accumulate(a, initial=0))      # [0, 3, 4, 8, 9, 14, 23]

D = [0] * (n + 1)
for l, r, x in updates:                 # a[l..r]에 x 더하기
    D[l] += x
    D[r + 1] -= x
a = list(accumulate(D[:n]))             # 마지막에 한 번 누적
```

`accumulate(a, initial=0)`은 0부터 시작해 앞에서부터 더한 값을 차례로 준다.

## 정의

기호로 쓰면 다음과 같다. 합의 기호 $$\sum$$은 [수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/)를 따른다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">누적 합과 차분</div>

길이 $$n$$인 수열 $$a[0..n-1]$$에 대해
- 누적 합: $$P[k] = \sum_{i=0}^{k-1} a[i]$$ ($$0 \le k \le n$$, 빈 합 $$P[0] = 0$$)
- 구간 합: $$0 \le l \le r < n$$이면 $$\sum_{i=l}^{r} a[i] = P[r+1] - P[l]$$
- 차분 배열 $$D[0..n]$$에서 $$a[i] = \sum_{j=0}^{i} D[j]$$로 값을 되찾는다. $$D[l]$$에 $$x$$를, $$D[r+1]$$에 $$-x$$를 더하면 $$l \le i \le r$$인 $$a[i]$$에만 정확히 $$x$$가 더해진다.

</div>


구간 합 공식은 $$P[r+1] = \sum_{i=0}^{r} a[i]$$에서 $$P[l] = \sum_{i=0}^{l-1} a[i]$$를 빼면 앞쪽 $$a[0..l-1]$$이 지워지기 때문에 성립한다. 차분 쪽은 $$a[i]$$가 $$D[0..i]$$의 합이라, $$i < l$$이면 두 표시를 모두 안 더하고, $$l \le i \le r$$이면 $$+x$$만 더하고, $$i > r$$이면 $$+x$$와 $$-x$$를 모두 더해 0이 되기 때문이다[^1].

## 2차원으로 넓히기

격자에서도 같은 생각을 쓴다. S[i][j]를 "왼쪽 위 모서리부터 (i − 1, j − 1)까지 직사각형의 합"으로 둔다.

- **만들기:** S[i + 1][j + 1] = a[i][j] + S[i][j + 1] + S[i + 1][j] − S[i][j]. 위쪽 직사각형과 왼쪽 직사각형을 더하면 둘이 겹치는 왼쪽 위를 두 번 더하니 한 번 뺀다.
- **직사각형 합:** (r1, c1) ~ (r2, c2)의 합 = S[r2 + 1][c2 + 1] − S[r1][c2 + 1] − S[r2 + 1][c1] + S[r1][c1].
- **직사각형 더하기(2차원 차분):** 네 모서리에 표시한다. D[r1][c1] += x, D[r1][c2 + 1] −= x, D[r2 + 1][c1] −= x, D[r2 + 1][c2 + 1] += x. 마지막에 가로로 한 번, 세로로 한 번 누적한다.

<details markdown="1"><summary markdown="span">3 × 3에서 (0, 0) ~ (1, 1)에 1을 더하는 과정</summary>


| 단계 | 0행 | 1행 | 2행 |
|---|---|---|---|
| 표시 | 1, 0, −1 | 0, 0, 0 | −1, 0, 1 |
| 가로 누적 | 1, 1, 0 | 0, 0, 0 | −1, −1, 0 |
| 세로 누적 | 1, 1, 0 | 1, 1, 0 | 0, 0, 0 |

표시판은 가로·세로로 한 칸씩 더 크게(4 × 4) 만들고, 표에는 앞 3 × 3만 보였다. 세로 누적에서 2행의 −1이 위에서 내려온 1을 지워 2행은 0이 된다.

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표 두 개, 2차원 예시의 단계별 표, 확인 문제 C1의 값을 계산해 맞췄다. 무작위 2,000번에서 구간 합, 구간 더하기, 2차원 직사각형 합, 2차원 직사각형 더하기, 음수가 섞인 "합이 S인 구간 수"가 모두 직접 계산한 값과 같았다 — [19_prefix-sum_verify.py](/Hongs_Blog/studies/algorithms/code/19_prefix-sum_verify/)</div>

</div>


## 활용

- **비용:** 누적 합을 만드는 데 $$O(n)$$, 구간 합 질문마다 $$O(1)$$이다. 차분 배열은 구간 더하기마다 $$O(1)$$, 마지막 누적에 $$O(n)$$이다. 2차원은 $$N \times M$$ 격자에서 만들기 $$O(NM)$$, 질문·표시마다 $$O(1)$$이다.
- **알아보는 신호:** "구간의 합을 여러 번 묻는다", "구간(직사각형)에 값을 여러 번 더한 뒤 최종 상태를 본다". 질문이나 더하기가 수십만 번이라 한 번에 $$O(n)$$씩 쓸 수 없을 때.
- 음수가 섞인 수열에서 "합이 S인 연속 구간 수"는 [창 밀기](/Hongs_Blog/studies/algorithms/two-pointers/)로 못 센다. 누적 합 P를 만들고 "P[j] − P[i] = S인 쌍"을 딕셔너리로 센다.
- **맞지 않을 때:** 값 바꾸기와 구간 합 질문이 번갈아 수십만 번 들어오면, 누적 합은 바꿀 때마다 다시 만들어야 해서 느리다. 이때는 [세그먼트 트리와 스위핑](/Hongs_Blog/studies/algorithms/segment-tree-sweep/)을 쓴다.
- **흔한 실수:** P를 길이 n으로 만들어 한 칸씩 어긋난다. 차분 배열을 길이 n으로 만들어 D[r + 1]에서 범위를 넘는다. 2차원 차분에서 네 모서리 중 하나를 빠뜨린다.

## 연결

- 선수: [리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/), [수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/)
- 누적 합과 차분은 서로 거꾸로 가는 계산이다. 적분과 미분의 관계와 같은 모양이다. 무엇이 무엇에 대응하는지는 [합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/)의 대응표에 줄마다 있다. 구간 합 P[r + 1] − P[l]은 [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/)의 '구간의 적분은 원시함수의 양 끝 값 차'를 칸 단위로 쓴 것이다. 배열은 칸으로 나뉘어 있어서 연속 같은 조건 없이 늘 맞는다.
- 2차원 만들기에서 겹치는 왼쪽 위를 한 번 빼는 것과, 직사각형 합·직사각형 더하기의 부호 +, −, −, +는 [포함-배제 원리](/Hongs_Blog/studies/discrete-math/inclusion-exclusion/)의 두 집합 꼴 $$\vert A \cup B\vert  = \vert A\vert  + \vert B\vert  - \vert A \cap B\vert $$이다. 개수 대신 칸 값의 합으로 바꿔도 같은 식이 맞는다.
- 확률에서도 같은 계산을 한다. 값마다의 확률을 작은 값부터 더한 것이 [누적분포함수(CDF)](/Hongs_Blog/studies/probability-statistics/random-variables/) $$F$$다. 'a보다 크고 b 이하일 확률'은 $$F(b) - F(a)$$로, 뺄셈 한 번이면 나온다. 다만 P[k]는 'k 미만'의 합이고 $$F(k)$$는 'k 이하'의 합이라 한 칸 어긋난다.
- 2차원 누적 합에는 연속판이 있다. 함수 $$f$$를 원점부터 $$(x, y)$$까지의 직사각형 위에서 적분한 값을 $$S(x, y)$$라 하면, 직사각형 $$[a, b] \times [c, d]$$ 위의 적분은 $$S(b, d) - S(a, d) - S(b, c) + S(a, c)$$다. 2차원 차분을 가로로 한 번, 세로로 한 번 누적하는 것은 [중적분](/Hongs_Blog/studies/calculus/multiple-integrals/)을 한 방향씩 차례로 적분하는 반복적분과 같다.
- 함께 보면 좋은 수학: [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)(누적은 대각선과 그 아래가 모두 1인 행렬을 곱하는 일이고, 차분은 그 역행렬을 곱하는 일이다), [선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/)(표를 합친 뒤 누적한 값이 따로 누적해 더한 값과 같아서, 구간 더하기 표시를 한 표에 모두 모아 두고 마지막에 한 번만 누적해도 된다)
- 브리지: [누적 합 ↔ 아래삼각행렬](/Hongs_Blog/studies/algorithms/prefix-sum-triangular/)
- 연습: [파괴되지 않은 건물](/Hongs_Blog/studies/algorithms/pg92344/), [광고 삽입](/Hongs_Blog/studies/algorithms/pg72414/), [지형 편집](/Hongs_Blog/studies/algorithms/pg12984/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** a = [2, 7, 1, 8, 2, 8]의 누적 합 P를 쓰고, a[1] + a[2] + a[3]을 P로 구하라.</summary>

**답:** P = [0, 2, 9, 10, 18, 20, 28]. a[1..3]의 합은 P[4] − P[1] = 18 − 2 = 16이다(7 + 1 + 8 = 16). 흔한 실수는 P[3] − P[1] = 8로, 끝 칸 a[3]을 빠뜨리는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 누적 합을 길이 n + 1로 만들고 맨 앞을 P[0] = 0으로 두는 까닭은?</summary>

**답:** 구간이 0번에서 시작할 때도 같은 공식을 쓰기 위해서다. a[0..r]의 합은 P[r + 1] − P[0] = P[r + 1] − 0이다. P를 길이 n으로 두면 "l = 0이면 따로 처리"라는 예외가 생기고, 한 칸 어긋나는 실수가 잦다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 두 상황에 누적 합과 차분 배열 중 무엇을 쓰는가? (가) 배열은 그대로이고, "l ~ r번 합"을 20만 번 묻는다. (나) "l ~ r번에 x 더하기"를 20만 번 한 뒤, 마지막 배열만 본다.</summary>

**답:** (가)는 누적 합이다. 한 번 만들고 질문마다 뺄셈 한 번이다. (나)는 차분 배열이다. 더하기마다 두 칸만 적고 마지막에 한 번 누적한다. 더하기와 질문이 번갈아 섞이면 둘 다 느려서 다른 구조가 필요하다.

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 9.1 "Static array queries"의 Sum queries(누적 합과 2차원 누적 합), 9.4 "Additional techniques"의 Range updates(차분 배열: 원래 배열은 차분 배열의 누적 합이고, 구간 [a, b]에 x를 더하려면 a에 x, b + 1에 −x를 더한다).
{% endraw %}
