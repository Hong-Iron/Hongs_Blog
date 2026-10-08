---
layout: "note"
title: "LU·QR·고윳값·SVD 비교"
display_title: "LU·QR·고윳값·SVD 비교"
kind: "concept"
kind_label: "비교"
num: "28"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-09-26"
status: "verified"
aliases: ["행렬 분해 비교", "matrix decompositions compared", "분해 고르기", "LU vs QR", "고윳값 분해 vs SVD"]
description: "네 분해는 모두 \"행렬을 쉬운 조각의 곱으로 쪼갠다\"는 점이 같아서, 무엇을 써야 할지 헷갈린다. 가르는 질문은 하나다. 무엇을 하려는가. 방정식을 풀려면 LU, 가장 가까운 근사를 구하려면 QR, 같은 변환을 되풀이하려면 고윳값, 행렬의 구조를 크기 순으로 보거나 압축하려면 SV…"
prev_url: "/studies/linear-algebra/dft/"
prev_title: "이산 푸리에 변환과 FFT"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/decompositions-compared/"
---
{% raw %}
네 분해는 모두 "행렬을 쉬운 조각의 곱으로 쪼갠다"는 점이 같아서, 무엇을 써야 할지 헷갈린다. 가르는 질문은 하나다. **무엇을 하려는가.** 방정식을 풀려면 LU, 가장 가까운 근사를 구하려면 QR, 같은 변환을 되풀이하려면 고윳값, 행렬의 구조를 크기 순으로 보거나 압축하려면 SVD다. 그다음 행렬의 모양(정사각인가, 대칭인가)이 쓸 수 있는 분해를 좁힌다[^1].

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 회로 시뮬레이션에서 같은 $$1000 \times 1000$$ 행렬 $$A$$로 우변 $$\mathbf{b}$$만 바꿔 가며 $$A\mathbf{x} = \mathbf{b}$$를 500번 푼다. 어느 분해가 맞고, SVD는 왜 아닌가?</summary>

**답:** LU(부분 피벗팅). 한 번 $$\frac23n^3$$로 분해하고 풀이마다 $$2n^2$$이라 가장 싸다. SVD도 풀 수는 있지만 분해 비용이 LU의 몇 배이고, 가역인 정사각 행렬에서는 얻는 것이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 측정점 1만 개에 10차 다항식을 맞춘다(최소제곱). 정규방정식을 LU로 푸는 것과 QR 중 무엇이 맞는가?</summary>

**답:** QR. 다항식 기저의 열은 거의 종속이라 $$A$$의 조건수가 크고, $$A^\top A$$를 만들면 조건수가 제곱되어 정밀도를 크게 잃는다. QR은 $$R\hat{\mathbf{x}} = Q^\top\mathbf{b}$$로 조건수를 제곱하지 않는다. 열이 사실상 종속이면(수치 랭크 부족) SVD를 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 웹 서핑의 마르코프 전이 행렬로 오랜 시간 뒤의 방문 확률(정상 분포)을 구한다. 고윳값 분해와 SVD 중 무엇인가?</summary>

**답:** 고윳값 분해(실제로는 $$\lambda = 1$$ 고유벡터를 거듭제곱법으로). 묻는 것이 $$A^k$$의 극한이고, $$A^k = X\Lambda^kX^{-1}$$가 그것을 준다. SVD는 대칭이 아닌 행렬에서 $$A^k$$의 특잇값이 $$\sigma_i^k$$가 아니라 거듭제곱 정보를 주지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 사용자 100만 명 × 영화 1만 편 평점 행렬을 몇 개의 "취향 축"으로 요약한다. 고윳값 분해와 SVD 중 무엇인가?</summary>

**답:** SVD(큰 특잇값 몇 개만 구하는 방법으로). 직사각 행렬이라 고윳값 분해가 정의되지 않고, 에카르트–영 정리로 랭크 $$k$$ 근사 중 가장 가깝다는 보장이 SVD에 있다.

</details>


## 결정적 차이

| 분해 | 꼴 | 쓸 수 있는 행렬 | 비용($$n \times n$$ 밀집) | 드러내는 것 | 대표 용도 |
|---|---|---|---|---|---|
| [LU](/Hongs_Blog/studies/linear-algebra/lu-decomposition/) | $$PA = LU$$ | 정사각, 가역 | $$\frac23n^3$$ | 소거 과정 | 연립방정식 반복 풀이, 행렬식 |
| [QR](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/) | $$A = QR$$ | $$m \ge n$$, 열 독립 | 약 $$\frac43n^3$$(하우스홀더) | 직교 기저 | 최소제곱, 고윳값 알고리즘의 부품 |
| [고윳값](/Hongs_Blog/studies/linear-algebra/diagonalization/) | $$A = X\Lambda X^{-1}$$ | 정사각, 대각화 가능 | 반복법, $$O(n^3)$$ | 방향이 안 바뀌는 축, 성장률 | $$A^k$$, 안정성, 마르코프 |
| [SVD](/Hongs_Blog/studies/linear-algebra/svd/) | $$A = U\Sigma V^\top$$ | 모든 행렬 | 반복법, 넷 중 가장 비쌈 | 랭크, 크기 순 방향, 조건수 | 저랭크 근사, 유사역행렬, PCA |

- **대칭행렬에서는 겹친다.** 대칭이면 고윳값 분해가 $$Q\Lambda Q^\top$$([스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/))이고, 양의 준정부호이면 SVD와 같다.
- **직교 행렬이 들어간 분해(QR, 대칭의 $$Q\Lambda Q^\top$$, SVD)는 수치적으로 안정하다.** 직교 행렬은 [조건수](/Hongs_Blog/studies/linear-algebra/conditioning/)가 1이라 오차를 키우지 않는다. LU는 피벗팅으로 안정성을 챙긴다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 우변 500개에서 LU 재사용과 매번 소거의 연산 수, 불량 조건 다항식 맞추기에서 QR 오차 < 정규방정식 오차, 마르코프 행렬의 $$A^k$$가 $$X\Lambda^kX^{-1}$$와 같고 $$\sigma(A^k) \ne \sigma(A)^k$$(비대칭), 직사각 행렬의 SVD, 대칭 양의 정부호에서 고윳값 = 특잇값, 숄레스키가 $$LL^\top$$를 재구성 — [28_decompositions-compared_verify.py](/Hongs_Blog/studies/linear-algebra/code/28_decompositions-compared_verify/)</div>

</div>


## 둘 다 아닐 때

- **대칭 양의 정부호:** [숄레스키](/Hongs_Blog/studies/linear-algebra/positive-definite/) $$S = LL^\top$$가 LU의 절반 비용이다. 공분산 행렬, 유한요소 강성 행렬이 이 경우다.
- **크고 희소한 행렬:** 0이 대부분인 $$10^6 \times 10^6$$ 행렬은 분해하면 0이 채워져 메모리가 터진다. 행렬-벡터 곱만 쓰는 반복법(대칭 양의 정부호에는 켤레 기울기법, 일반 행렬에는 GMRES)을 쓴다[^s1].
- **거대한 행렬의 상위 몇 개:** 특잇값·고윳값 몇 개만 필요하면 란초스 방법이나 무작위 SVD로 전체 분해 없이 구한다[^s1].

[^1]: Strang, *Introduction to Linear Algebra* 5판, 2.6절(LU), 4.4절(QR), 6.2절(대각화), 7.2절(SVD), 11.1절(실제 계산). Trefethen·Bau, *Numerical Linear Algebra*, 2부(QR과 최소제곱), 4부(연립방정식과 숄레스키), 5부(고윳값), 1부(SVD).
[^s1]: 에이전트 보충. 켤레 기울기법·GMRES·란초스는 Trefethen·Bau 6부 "Iterative Methods"에, 무작위 SVD는 Halko·Martinsson·Tropp, "Finding structure with randomness", *SIAM Review* 53 (2011)에 있다.
{% endraw %}
