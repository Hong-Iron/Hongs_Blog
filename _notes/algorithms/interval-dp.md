---
layout: "note"
title: "구간 DP"
display_title: "구간 DP (Interval DP)"
kind: "concept"
kind_label: "기법"
num: "31"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-06"
status: "verified"
aliases: ["Interval DP", "구간 동적 계획법", "행렬 곱셈 순서", "Matrix Chain Multiplication", "괄호 치기"]
description: "줄지어 선 것들을 두 덩어리씩 합쳐 하나로 만들 때, \"마지막에 어디서 나뉘었나\"를 모두 따져 가장 좋은 방법을 찾는다. 긴 구간의 답을 그 안의 더 짧은 두 구간의 답으로 만들기 때문에, 짧은 구간부터 표를 채운다. 괄호 치는 순서, 행렬 곱셈 순서, 문자열을 나누는 방법 같은 …"
prev_url: "/studies/algorithms/dynamic-programming/"
prev_title: "동적 계획법"
next_url: "/studies/algorithms/tree-dp/"
next_title: "트리 DP"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/interval-dp/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

줄지어 선 것들을 두 덩어리씩 합쳐 하나로 만들 때, "마지막에 어디서 나뉘었나"를 모두 따져 가장 좋은 방법을 찾는다. 긴 구간의 답을 그 안의 더 짧은 두 구간의 답으로 만들기 때문에, 짧은 구간부터 표를 채운다. 괄호 치는 순서, 행렬 곱셈 순서, 문자열을 나누는 방법 같은 문제에 맞는다. 대신 구간이 n²개이고 구간마다 나누는 자리가 n개라 보통 n³에 비례해, n이 수백일 때까지만 쓴다.

</div>


## 예시로 보기

행렬 A(10×30), B(30×5), C(5×60)을 곱한다. p×q 행렬과 q×r 행렬을 곱하는 데 곱셈이 p·q·r번 든다. 곱하는 순서에 따라 비용이 크게 다르다.

- (AB)C: AB에 10·30·5 = 1,500, 그 결과(10×5)와 C에 10·5·60 = 3,000. 합 4,500
- A(BC): BC에 30·5·60 = 9,000, A와 그 결과(30×60)에 10·30·60 = 18,000. 합 27,000

dp[i][j]를 "i번째부터 j번째 행렬까지 곱하는 최소 비용"으로 두고 짧은 구간부터 채운다.

| 구간 | 마지막 곱셈의 자리 | 비용 |
|---|---|---|
| [A] [B] [C] | 곱할 것이 없다 | 0 |
| [A, B] | A · B | 1,500 |
| [B, C] | B · C | 9,000 |
| [A, B, C] | (AB) · C: 1,500 + 0 + 3,000 / A · (BC): 0 + 9,000 + 18,000 | 4,500 |

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">점화식</div>

행렬 $$A_1, \dots, A_k$$에서 $$A_i$$의 크기를 $$d_{i-1} \times d_i$$라 하자. $$1 \le i \le j \le k$$에 대해

$$dp[i][i] = 0, \qquad dp[i][j] = \min_{i \le m < j} \big(dp[i][m] + dp[m+1][j] + d_{i-1} \, d_m \, d_j\big).$$

답은 $$dp[1][k]$$다.

말로 읽으면, $$i$$번부터 $$j$$번까지 곱하는 가장 싼 비용은 "어느 자리 $$m$$에서 둘로 나눠 왼쪽 묶음과 오른쪽 묶음을 각각 가장 싸게 곱한 비용 + 마지막에 두 결과를 곱하는 비용 $$d_{i-1} d_m d_j$$" 가운데 가장 작은 값이다. 행렬이 하나뿐이면($$i = j$$) 곱할 것이 없어 0이다.

</div>


$$A_i \cdots A_j$$를 곱하는 어떤 순서든 마지막 곱셈은 "앞 덩어리 $$A_i \cdots A_m$$"과 "뒤 덩어리 $$A_{m+1} \cdots A_j$$"를 곱한다. 두 덩어리는 서로 따로 가장 싸게 곱하면 된다(잘라 붙이기, [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)의 최적 부분 구조)[^1].

```python
for length in range(2, k + 1):                 # 짧은 구간부터
    for i in range(1, k - length + 2):
        j = i + length - 1
        dp[i][j] = min(dp[i][m] + dp[m + 1][j] + d[i - 1] * d[m] * d[j]
                       for m in range(i, j))    # 마지막 곱셈의 자리
```

**계산 순서:** dp[i][j]는 더 짧은 구간 dp[i][m], dp[m+1][j]만 읽는다. 그래서 구간 길이 순서로 채운다. i를 0부터 k까지 차례로 도는 순서로는 dp[m+1][j]가 아직 비어 있을 수 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 두 순서의 비용과 표, 확인 문제 C1의 표, C3의 그리디 반례를 코드로 확인했다. 무작위 입력 1,500개(행렬 6개 이하)에서 표의 답이 "괄호 치는 방법을 모두 만든" 최솟값과 같았고, 앞에서부터 차례로 곱한 비용보다 크지 않았다 — [31_interval-dp_verify.py](/Hongs_Blog/studies/algorithms/code/31_interval-dp_verify/)</div>

</div>


## 활용

- **비용:** 구간 $$O(n^2)$$개 × 나누는 자리 $$O(n)$$ = $$O(n^3)$$, 표에 $$O(n^2)$$ 공간. n = 100이면 약 17만 번(구간마다 나누는 자리 수를 모두 더한 값)이다. 길이 $$\ell$$인 구간은 $$n - \ell + 1$$개이고 구간마다 나누는 자리가 $$\ell - 1$$개라, 이 곱을 $$\ell = 2, \dots, n$$으로 더하면 $$\frac{n^3 - n}{6}$$이다. [수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/)의 $$1 + \cdots + n$$ 공식과 제곱의 합 공식으로 계산한다.
- **알아보는 신호:** "두 개씩 합쳐 하나로", "괄호를 어떻게 치느냐에 따라", "양 끝에서만 뗄 수 있다" 같은 말. 구간 [i, j]만 알면 나머지와 상관없이 답이 정해진다.
- **쓰는 곳:** 행렬 곱셈 순서, 수식의 최대·최소값(뺄셈이 있으면 최대와 최소를 함께 들고 다닌다), 가장 긴 팰린드롬 부분 수열, 파일 합치기.
- **흔한 실수:** 표를 i, j 순서로 채워 아직 계산하지 않은 칸을 읽는다. 나누는 자리 m의 범위를 한 칸 넘기거나 모자라게 잡는다.

## 연결

- 선수: [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)
- 비교: "가장 싼 곱셈부터 먼저"라는 [그리디](/Hongs_Blog/studies/algorithms/greedy/)는 틀린다(확인 문제 C3). 구간 DP는 마지막 나눔을 모두 따진다.
- [플로이드–워셜](/Hongs_Blog/studies/algorithms/floyd-warshall/)도 "가운데 점 k"를 모두 따지는 3중 반복이다. 구간 DP의 "나누는 자리 m"과 같은 역할이다.
- 괄호를 어떻게 쳐도 곱한 결과가 같은 것은 [행렬 곱셈](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)의 결합법칙 덕분이다. 그래서 결과는 두고 비용만 비교한다. 예시의 p·q·r은 결과의 p·r칸마다 곱셈이 q번씩 드는 데서 나온다.
- 신경망의 기울기를 구할 때도 같은 문제가 나온다. 출력이 하나인 함수의 기울기는 층마다의 미분 행렬(야코비 행렬)을 이어 곱한 것이고, 맨 왼쪽은 1 × d 행벡터다. 행렬이 모두 d × d이면 왼쪽부터 곱하는 순서가 가장 싸다. 층이 L개면 곱셈이 약 $$Ld^2$$번이고, 오른쪽부터 곱하면 약 $$Ld^3$$번이다. 이 순서가 [역전파](/Hongs_Blog/studies/calculus/backprop-bridge/)다.
- 괄호를 치는 방법 하나는 행렬을 잎으로 하는 정 이진 트리(자식이 0개나 2개인 트리) 하나와 같다([재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/)). 잎은 행렬 하나이고, 안쪽 노드는 "앞 덩어리 × 뒤 덩어리" 곱셈 한 번이다. 행렬 k개를 괄호 치는 방법 수는 카탈란 수다(k = 1 ~ 6이면 1, 1, 2, 5, 14, 42). 행렬 20개면 17억 가지가 넘어서, 모두 해 보는 대신 표를 채운다.
- 연습: [사칙연산](/Hongs_Blog/studies/algorithms/pg1843/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 행렬 크기가 5×10, 10×3, 3×12, 12×5인 네 행렬을 곱하는 최소 곱셈 수를 구하라. 길이 2와 3인 구간의 값도 쓰라.</summary>

**답:** 길이 2: dp[1][2] = 150, dp[2][3] = 360, dp[3][4] = 180. 길이 3: dp[1][3] = min(0 + 360 + 5·10·12, 150 + 0 + 5·3·12) = 330, dp[2][4] = min(0 + 180 + 10·3·5, 360 + 0 + 10·12·5) = 330. 전체: min(0 + 330 + 250, 150 + 180 + 75, 330 + 0 + 300) = 405. (A₁A₂)(A₃A₄)가 가장 싸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 표를 구간 길이가 짧은 것부터 채워야 하는 까닭은?</summary>

**답:** dp[i][j]는 나누는 자리마다 dp[i][m]과 dp[m+1][j]를 읽는다. 두 구간 모두 [i, j]보다 짧다. 짧은 구간을 먼저 채워 두면 읽을 칸이 늘 준비되어 있다. i를 작은 것부터 도는 순서로는 dp[m+1][j](i보다 큰 시작점)가 아직 비어 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "지금 할 수 있는 곱셈 중 가장 싼 것부터 한다"는 그리디가 틀리는 예를 들어라.</summary>

**답:** A(1×1), B(1×3), C(3×2). 처음에 할 수 있는 곱셈은 AB(1·1·3 = 3)와 BC(1·3·2 = 6)다. 그리디는 AB를 먼저 해 3 + (AB)C의 1·3·2 = 6으로 합 9다. A(BC)는 6 + 1·1·2 = 2로 합 8이라 더 싸다. 처음에 싼 곱셈이 나중에 큰 행렬을 남길 수 있다.

</details>


[^1]: Cormen 외, *Introduction to Algorithms* 3판, 15.2절 "Matrix-chain multiplication": 마지막 나눔 자리 k를 모두 따지는 점화식, 구간 길이 순서로 채우는 표, O(n³) 시간.
{% endraw %}
