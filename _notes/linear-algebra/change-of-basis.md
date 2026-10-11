---
layout: "note"
title: "기저 변환"
display_title: "기저 변환 (Change of Basis)"
kind: "concept"
kind_label: "기법"
num: "14"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Change of Basis", "기저 변환", "좌표 변환", "coordinate change", "닮음", "similar matrices", "닮은 행렬", "similarity transformation", "대각합", "trace"]
description: "같은 점도 어떤 눈금(기저)으로 재느냐에 따라 좌표가 다르고, 같은 변환도 기저에 따라 행렬이 달라진다. 변환이 유난히 단순하게 작용하는 방향들(그대로 두는 방향, 뒤집는 방향, 늘이는 방향)을 기저로 고르면 복잡해 보이던 행렬이 대각행렬처럼 단순해진다. 새 기저의 행렬은 \"새 좌…"
prev_url: "/studies/linear-algebra/rotation-bridge/"
prev_title: "덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬"
next_url: "/studies/linear-algebra/determinant/"
next_title: "행렬식"
math: true
mermaid: true
code_count: 2
permalink: "/studies/linear-algebra/change-of-basis/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

같은 점도 어떤 눈금(기저)으로 재느냐에 따라 좌표가 다르고, 같은 변환도 기저에 따라 행렬이 달라진다. 변환이 유난히 단순하게 작용하는 방향들(그대로 두는 방향, 뒤집는 방향, 늘이는 방향)을 기저로 고르면 복잡해 보이던 행렬이 대각행렬처럼 단순해진다. 새 기저의 행렬은 "새 좌표를 표준 좌표로 바꾸고, 변환하고, 다시 새 좌표로 되돌리는" 세 단계를 곱한 것이다. 다만 기저 벡터들이 독립이어야 좌표를 오갈 수 있다.

</div>


## 예시로 보기

직선 $$y = x$$에 대한 반사는 표준 기저에서 $$A = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$$이다. 그런데 이 반사가 하는 일은 단순하다. 직선 위의 방향 $$\mathbf{b}_1 = (1, 1)$$은 그대로 두고, 직선에 수직인 방향 $$\mathbf{b}_2 = (1, -1)$$은 뒤집는다.

$$\mathbf{b}_1, \mathbf{b}_2$$를 기저로 쓰면 좌표 $$(c_1, c_2)$$인 점은 $$(c_1, -c_2)$$로 간다. 이 기저에서 반사의 행렬은 $$\begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix}$$이다. 예를 들어 표준 좌표 $$(3, 1) = 2\mathbf{b}_1 + 1\mathbf{b}_2$$는 새 좌표 $$(2, 1)$$이고, 반사하면 새 좌표 $$(2, -1)$$, 곧 $$2\mathbf{b}_1 - \mathbf{b}_2 = (1, 3)$$이다. $$\mathbf{b}_1, \mathbf{b}_2$$를 열로 세운 행렬이 아래의 $$P$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/linear-algebra/14_change-of-basis_fig1.svg" alt="그림" width="332" height="357" loading="lazy">

기울어진 격자가 새 기저의 눈금이다. $$(3, 1)$$은 $$\mathbf{b}_1$$ 방향으로 2칸, $$\mathbf{b}_2$$ 방향으로 1칸 간 점이고, 반사는 $$\mathbf{b}_2$$ 방향 1칸만 반대로 돌려 $$(1, 3)$$으로 보낸다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

기저 $$\mathbf{b}_1, \dots, \mathbf{b}_n$$을 열로 세운 가역 행렬을 $$P$$라 하자.
- **좌표 변환:** 표준 좌표 $$\mathbf{x}$$와 새 좌표 $$\mathbf{c}$$는 $$\mathbf{x} = P\mathbf{c}$$, $$\mathbf{c} = P^{-1}\mathbf{x}$$로 오간다.
- **행렬 변환:** 표준 기저에서 행렬이 $$A$$인 선형변환은 새 기저에서 행렬이 $$B = P^{-1}AP$$다. $$B = P^{-1}AP$$인 두 행렬을 **닮았다**고 한다[^1].

</div>


$$B$$를 오른쪽부터 읽으면 과정이 보인다. 새 좌표 $$\mathbf{c}$$를 $$P$$로 표준 좌표로 바꾸고, $$A$$로 변환하고, $$P^{-1}$$로 다시 새 좌표로 돌아온다.

```mermaid
flowchart LR
    c["새 좌표 c"] -->|"P"| x["표준 좌표 Pc"]
    x -->|"A"| y["표준 좌표 APc"]
    y -->|"P⁻¹"| d["새 좌표 Bc"]
    c -->|"B = P⁻¹AP"| d
```

새 좌표 c에서 Bc로 가는 길이 두 가지다. B로 곧장 가는 길과, 표준 좌표로 돌아가는 세 단계가 늘 같은 곳에 닿는다[^s3].

**떠올리는 신호.** 변환이 어떤 방향들을 **그 방향 그대로** 두거나 늘이거나 뒤집는다는 것이 보이면, 그 방향들을 기저로 잡는다. 반사(고정 방향과 뒤집힌 방향), 사영(남는 방향과 사라지는 방향), 한 축을 따라 늘이기가 대표적이다. 이런 방향을 체계적으로 찾는 것이 [고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/)다.

**바뀌지 않는 것.** 닮은 행렬은 같은 변환을 다른 눈금으로 적은 것이라, 좌표와 무관한 양이 같다. 행렬식 $$\det B = \det P^{-1}\det A\det P = \det A$$([행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)), 대각합(대각 성분의 합) $$\operatorname{tr}B = \operatorname{tr}A$$, 랭크가 같다.

## 예제

위 반사를 $$P^{-1}AP$$로 계산한다.

1. *$$P$$와 역:* $$P = \begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$$, $$P^{-1} = \frac{1}{-2}\begin{pmatrix}-1 & -1\\ -1 & 1\end{pmatrix} = \frac12\begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$$.
2. *$$AP$$:* 열을 바꾸는 것과 같아 $$AP = \begin{pmatrix}1 & -1\\ 1 & 1\end{pmatrix}$$.
3. *$$P^{-1}AP$$:* $$\frac12\begin{pmatrix}2 & 0\\ 0 & -2\end{pmatrix} = \begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix}$$.
4. *확인:* 행렬식 $$-1$$과 대각합 0이 $$A$$와 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 좌표 $$(2, 1)$$과 반사 결과 $$(1, 3)$$, 예제의 $$P^{-1}AP = \operatorname{diag}(1, -1)$$, 무작위 $$A$$, $$P$$에서 "$$B$$로 새 좌표를 변환한 것 = $$A$$로 변환한 뒤 새 좌표로 바꾼 것", 닮은 행렬의 행렬식·대각합·랭크가 같음, 사영의 대각화 — [14_change-of-basis_verify.py](/Hongs_Blog/studies/linear-algebra/code/14_change-of-basis_verify/)</div>

</div>


## 활용

- **그래픽스의 좌표계.** 물체 좌표계 → 월드 좌표계 → 카메라 좌표계는 모두 기저 변환이다. "카메라에서 본 위치"는 카메라 축을 기저로 한 좌표다.
- **색 공간.** RGB를 밝기(Y)와 색차(Cb, Cr)로 바꾸는 것은 $$3 \times 3$$ 행렬을 곱하는 선형 좌표 변환(상수 이동 제외)이다. JPEG는 밝기를 더 정밀하게 남긴다[^s1].
- **주파수 기저.** 신호를 사인파 기저로 바꾸는 [이산 푸리에 변환](/Hongs_Blog/studies/linear-algebra/dft/)도 기저 변환이다. 그 기저에서는 필터링이 성분별 곱셈이 된다.

## 연결

- 선수: [선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/), [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)
- 좌표의 뜻: [부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/)
- 이어지는 개념: [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/), [고윳값](/Hongs_Blog/studies/linear-algebra/eigenvalues/)과 [대각화](/Hongs_Blog/studies/linear-algebra/diagonalization/)(가장 좋은 기저를 찾는 방법)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 기저 $$(1, 1)$$, $$(1, -1)$$에서 점 $$(3, 1)$$의 좌표를 구하라.</summary>

**답:** $$c_1(1, 1) + c_2(1, -1) = (3, 1)$$에서 $$c_1 + c_2 = 3$$, $$c_1 - c_2 = 1$$. $$c_1 = 2$$, $$c_2 = 1$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$x$$축으로의 사영 $$A = \begin{pmatrix}1 & 0\\ 0 & 0\end{pmatrix}$$을 기저 $$(1, 1)$$, $$(0, 1)$$에서 나타내라.</summary>

**답:** $$P = \begin{pmatrix}1 & 0\\ 1 & 1\end{pmatrix}$$, $$P^{-1} = \begin{pmatrix}1 & 0\\ -1 & 1\end{pmatrix}$$. $$AP = \begin{pmatrix}1 & 0\\ 0 & 0\end{pmatrix}$$, $$P^{-1}AP = \begin{pmatrix}1 & 0\\ -1 & 0\end{pmatrix}$$. $$(1, 1)$$은 $$(1, 0) = 1\cdot(1, 1) - 1\cdot(0, 1)$$로 가고 $$(0, 1)$$은 $$\mathbf{0}$$으로 간다. 이 기저는 사영에 맞지 않아 대각이 되지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 새 기저에서의 행렬이 $$AP$$나 $$PAP^{-1}$$이 아니라 $$P^{-1}AP$$인 이유를 설명하라.</summary>

**답:** 입력은 새 좌표 $$\mathbf{c}$$다. 먼저 $$P\mathbf{c}$$로 표준 좌표로 바꿔야 $$A$$를 쓸 수 있고, 결과 $$AP\mathbf{c}$$는 표준 좌표라 $$P^{-1}$$을 곱해 새 좌표로 되돌려야 한다. 오른쪽부터 $$P$$, $$A$$, $$P^{-1}$$ 순서다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 8.2절 "The Matrix of a Linear Transformation"(기저를 바꾸면 행렬이 바뀜), 8.3절 "The Search for a Good Basis"($$B = M^{-1}AM$$, 닮은 행렬).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> RGB와 YCbCr의 변환 행렬은 ITU-R BT.601 규격에 정의되어 있고, JPEG(JFIF)이 이것을 쓴다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [14_change-of-basis_plot.py](/Hongs_Blog/studies/linear-algebra/code/14_change-of-basis_plot/)로 그렸고, 새 좌표 $$(2, 1)$$, 반사 결과 $$(1, 3)$$, $$P^{-1}AP = \operatorname{diag}(1, -1)$$을 같은 코드로 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 다이어그램 1개는 원본에 없다. 이 문서 `정의`의 $$B = P^{-1}AP$$와 그것을 오른쪽부터 읽는 문단을 옮겼다(Strang 5판 8.2~8.3절).
{% endraw %}
