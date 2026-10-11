---
layout: "note"
title: "특수 행렬을 1차원 배열에 담기"
display_title: "특수 행렬을 1차원 배열에 담기 (Mapping Structured Matrices into a 1D Array)"
kind: "concept"
kind_label: "기법"
num: "10"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Structured Sparse Matrix", "구조적 희소 행렬", "대각 행렬", "Diagonal Matrix", "삼중대각 행렬", "Tridiagonal Matrix", "아래삼각 행렬", "하삼각 행렬", "Lower Triangular Matrix", "매핑 함수", "Mapping Function", "삼각 행렬 저장"]
description: "0이 어디에 있는지가 모양으로 미리 정해진 표는 0을 저장할 필요가 없다. 0이 아닐 수 있는 칸만 한 줄로 이어 담고, 몇째 줄 몇째 칸이 그 줄의 어디에 있는지는 식 하나로 계산한다. 메모리가 줄고, 찾는 데 드는 시간은 계산 한 번 그대로다. 다만 식은 모양마다 따로 구해야 …"
prev_url: "/studies/data-structures/row-major-mapping/"
prev_title: "행 우선 배치와 열 우선 배치"
next_url: "/studies/data-structures/sparse-matrix-triples/"
next_title: "희소 행렬의 3원소 표현"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/triangular-matrix-mapping/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

0이 어디에 있는지가 모양으로 미리 정해진 표는 0을 저장할 필요가 없다. 0이 아닐 수 있는 칸만 한 줄로 이어 담고, 몇째 줄 몇째 칸이 그 줄의 어디에 있는지는 식 하나로 계산한다. 메모리가 줄고, 찾는 데 드는 시간은 계산 한 번 그대로다. 다만 식은 모양마다 따로 구해야 하고, 0으로 정해진 자리에는 다른 값을 넣을 수 없다.

</div>


## 예시로 보기

줄과 칸이 $$n$$개씩인 표를 2차원 배열에 담으면 $$n^2$$칸이 든다[^1]. 그런데 어떤 표는 절반이 늘 0이다. 0인 줄 뻔히 아는 칸까지 메모리를 쓰는 것은 아깝다.

대각선과 그 아래쪽에만 0 아닌 값이 올 수 있는 표를 본다[^2].

```
  1   0   0   0
  2   3   0   0
  4   5   6   0
  7   8   9  10
```

16칸 가운데 값이 올 수 있는 칸은 10칸이다. 위에서부터 한 줄씩 읽되 대각선 위쪽의 칸은 건너뛰면 1차원 배열 하나가 된다[^3].

```
 위치    0    1    2    3    4    5    6    7    8    9
       [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 10]
        1행 |- 2행 -| |--- 3행 ---| |------ 4행 ------|
```

이제 "3행 2열의 값은?"이라는 물음에 답하려면 그 칸이 이 배열의 몇 번 위치인지 알아야 한다. 3행 앞에는 1행의 1칸과 2행의 2칸, 모두 3칸이 있다. 3행 안에서 2열은 두 번째다. 그래서 위치는 $$3 + (2 - 1) = 4$$이고 거기에 5가 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$n$$ = 1~12인 대각·삼중대각·아래삼각 행렬의 모든 칸 652개에서 아래 칸 수와 위치 식을 2차원 배열과 비교했고, 위치가 겹치거나 비지 않는 것도 확인했다. 슬라이드의 4 × 4 예, 비율, 카드의 답과 함께 C로 컴파일해 실행(ASan·UBSan)했다 — [10_triangular-matrix-mapping_impl.c](/Hongs_Blog/studies/data-structures/code/10_triangular-matrix-mapping_impl/)</div>

</div>


## 행렬의 번호

행렬(matrix)은 값을 줄과 칸으로 늘어놓은 표다. 2차원 배열과 닮았지만 적는 법이 조금 다르다[^4].

- 줄과 칸의 번호를 0이 아니라 1부터 센다.
- `x[i][j]` 대신 $$x(i, j)$$로 적는다. $$i$$가 행(가로줄) 번호, $$j$$가 열(세로줄) 번호다.

행렬을 2차원 배열에 그대로 담을 수도 있다. 그러면 번호가 하나씩 어긋난다. 또 C의 배열에는 행렬끼리 더하고 곱하는 연산이 없어서 `x + y`처럼 쓸 수 없다[^5]. 이 문서의 식에서 $$i$$와 $$j$$는 1부터 세고, 1차원 배열의 위치는 C처럼 0부터 센다.

## 세 가지 모양

0 아닌 원소의 수를 전체 원소의 수로 나눈 값이 작은 행렬을 희소 행렬(sparse matrix)이라 부른다. 그 가운데 0 아닌 원소가 정해진 자리에만 오는 것을 구조가 정해진 희소 행렬이라 한다[^6]. $$n$$행 $$n$$열일 때 세 모양은 이렇다.

| 모양 | 값이 올 수 있는 칸 | 칸 수 | 전체 $$n^2$$칸에 대한 비율 |
|---|---|---|---|
| 대각 행렬 | $$i = j$$ | $$n$$ | $$\frac{n}{n^2} = \frac1n$$ |
| 삼중대각 행렬 | $$\lvert i - j \rvert \le 1$$ | $$3n - 2$$ | $$\frac{3n - 2}{n^2} = \frac3n - \frac{2}{n^2}$$ |
| 아래삼각 행렬 | $$i \ge j$$ | $$\frac{n(n+1)}{2}$$ | $$\frac{n(n+1)}{2n^2} \approx 0.5$$ |

- **대각 행렬(diagonal matrix).** 왼쪽 위에서 오른쪽 아래로 가는 대각선에만 값이 온다[^7].
- **삼중대각 행렬(tridiagonal matrix).** 가운데 대각선과 그 바로 위아래 대각선, 세 줄에만 값이 온다[^6]. 첫 행과 끝 행에 2칸씩, 나머지 행에 3칸씩이라 $$3n - 2$$칸이다.
- **아래삼각 행렬(lower triangular matrix).** 대각선과 그 아래쪽에만 값이 온다. 행마다 1칸, 2칸, …, $$n$$칸이라 $$1 + 2 + \dots + n = \frac{n(n+1)}{2}$$칸이다[^2].

$$n = 100$$이면 대각은 100칸(1%), 삼중대각은 298칸(2.98%), 아래삼각은 5,050칸(50.5%)이다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.6 "Lower triangular (?) … Ratio is n(n+1)(2n2) ~ 0.5" / 문제점: 나눗셈 기호가 빠졌다. 적힌 대로면 세 수를 곱한 값이라 0.5가 될 수 없다. 또 아래삼각 행렬은 절반이 차 있어서 "0 아닌 원소의 비율이 작다"는 희소 행렬의 예로 맞지 않는다. 슬라이드도 이름 옆에 물음표를 달았다. / 수정안: 비율은 $$\frac{n(n+1)}{2n^2}$$이다. 아래삼각 행렬은 희소해서가 아니라 0의 자리가 정해져 있어서 줄여 담을 수 있는 예로 읽는다. / 근거: $$n = 100$$이면 $$\frac{100 \times 101}{2 \times 100^2} = 0.505$$다. 같은 강의 p.38이 칸 수를 $$\frac{n(n+1)}{2}$$로 적는다.

</div>


이 모양들은 1차원 배열에 옮겨 담고, 위치를 알려 주는 식으로 원소를 바로 찾을 수 있다. 1차원 배열이 차지하는 자리는 $$n \times n$$ 배열보다 작다[^1].

## 위치 식

### 아래삼각 행렬

행 우선 순서로 담되 아래 삼각 밖의 칸은 뺀다[^3]. $$x(i, j)$$의 위치는 이렇게 구한다[^8].

- 담는 순서는 1행, 2행, 3행, …이다.
- $$i$$행 앞에는 1행부터 $$i - 1$$행까지 있다.
- $$k$$행에는 원소가 $$k$$개 있다.
- 그래서 $$i$$행 앞에 있는 원소는 $$1 + 2 + \dots + (i - 1) = \frac{i(i-1)}{2}$$개다.
- $$i$$행 안에서 $$j$$열은 $$j$$번째이고, 위치는 0부터 세니 $$j - 1$$을 더한다.

$$\text{위치}(i, j) = \frac{i(i-1)}{2} + j - 1 \qquad (i \ge j)$$


$$x(4, 3)$$이면 $$\frac{4 \times 3}{2} + 3 - 1 = 8$$이다. 위 그림의 8번 위치에 9가 있다. 각 행의 첫 칸은 위치 0, 1, 3, 6에서 시작한다[^8].

[행 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/)의 $$ic + j$$와 견주면 달라진 곳은 하나다. 행마다 길이가 같으면 앞 행들의 원소 수가 곱셈 $$ic$$로 나오고, 길이가 1씩 늘면 합 $$\frac{i(i-1)}{2}$$로 나온다.

### 대각 행렬과 삼중대각 행렬

대각 행렬은 $$x(i, i)$$를 위치 $$i - 1$$에 담는다. 삼중대각 행렬을 행 우선으로 담으면 $$x(i, j)$$의 위치는 $$2i + j - 3$$이다[^s1].

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">삼중대각 위치 식의 유도</summary>

1행에는 2칸, 2행부터 $$n - 1$$행까지는 3칸씩 있다. $$i \ge 2$$일 때 $$i$$행 앞의 원소는 $$2 + 3(i - 2) = 3i - 4$$개다. $$i$$행에서 값이 오는 첫 칸은 $$i - 1$$열이므로 $$j$$열은 그 행에서 $$j - (i - 1)$$칸 뒤다. 더하면 $$3i - 4 + j - i + 1 = 2i + j - 3$$이다. $$i = 1$$을 넣어도 $$j - 1$$이 되어 1행에서도 맞는다. $$n = 5$$의 $$x(3, 4)$$는 $$6 + 4 - 3 = 7$$번 위치다.

</details>


### 코드

아래삼각 행렬을 1차원 배열 하나로 가진 구조와, $$x(i, j)$$를 읽는 함수다[^s2].

```c
typedef struct {
    int n;              /* 행렬의 크기 */
    int *element;       /* 값이 든 1차원 배열. n(n+1)/2칸 */
} LowerTriangular;

/* x(i, j)를 읽는다. i와 j는 1부터 센다 */
int lower_get(const LowerTriangular *m, int i, int j)
{
    if (i >= j)
        return m->element[i * (i - 1) / 2 + j - 1];
    return 0;                       /* 대각선 위쪽은 저장하지 않는다. 늘 0이다 */
}
```

값을 넣는 함수는 $$i \ge j$$일 때만 배열에 쓴다. 대각선 위쪽에 0이 아닌 값을 넣으라는 요청은 거절해야 한다. 그 값을 둘 칸이 없기 때문이다.

### 배열의 배열로 담기

위치 식 없이 담는 길도 있다. 행마다 길이가 1, 2, 3, 4인 배열을 따로 만들고 그 주소들을 배열 하나에 모은다. 행의 길이가 서로 달라도 되는 [배열의 배열](/Hongs_Blog/studies/data-structures/row-major-mapping/)이다[^9]. 대신 행 주소를 담는 자리가 행 수만큼 더 든다.

## 활용

- **이 기법을 쓸 자리.** 0의 자리가 모양으로 정해져 있을 때다. 대칭 행렬처럼 $$x(i, j) = x(j, i)$$라서 절반만 알면 되는 표도 아래 삼각만 담으면 된다[^s2]. 방향 없는 그래프의 인접 행렬이 그런 표다: [연결 인접 리스트와 배열 인접 리스트](/Hongs_Blog/studies/data-structures/linked-adjacency-list/)
- 연립방정식을 풀 때 나오는 아래삼각 행렬 $$L$$도 이렇게 담을 수 있다: [LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/)
- 삼중대각 행렬은 미분방정식을 격자 위에서 풀 때 나온다. 줄마다 세 칸만 쓰므로 $$3n - 2$$칸이면 된다: [유한 차분법](/Hongs_Blog/studies/numerical-analysis/finite-difference-bvp/)
- **0의 자리가 정해져 있지 않으면.** 0 아닌 원소가 어디 있는지를 함께 적어 두어야 한다: [희소 행렬의 3원소 표현](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/)
- **흔한 실수.** 행렬 번호(1부터)와 배열 번호(0부터)를 섞는다. 식 끝의 $$-1$$은 열 번호를 0부터 세는 위치로 바꾸는 것이다. $$i$$와 $$j$$를 0부터 세기로 했다면 식은 $$\frac{i(i+1)}{2} + j$$가 된다[^s1].
- 연습: [배열 위치 공식 예제 사다리](/Hongs_Blog/studies/data-structures/array-mapping-ladder/)

## 연결

- 선수: [행 우선 배치와 열 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/), [수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/)
- 행렬이 무엇을 하는 표인가: [행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 5행 5열인 아래삼각 행렬을 행 우선으로 1차원 배열에 담는다. 배열은 몇 칸이 필요한가? $$x(4, 2)$$는 몇 번 위치에 있는가? 행과 열은 1부터, 위치는 0부터 센다.</summary>

**답:** $$\frac{5 \times 6}{2} = 15$$칸. $$x(4, 2)$$는 $$\frac{4 \times 3}{2} + 2 - 1 = 7$$번 위치.<br>
**이유:** 4행 앞에는 1, 2, 3행의 $$1 + 2 + 3 = 6$$칸이 있고, 4행 안에서 2열은 두 번째라 한 칸 더 간다. 2차원 배열로 담으면 25칸이 든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아래삼각 행렬의 위치 식 $$\frac{i(i-1)}{2} + j - 1$$에서 $$\frac{i(i-1)}{2}$$는 무엇을 센 것이고 왜 그 값인가? 끝의 $$-1$$은 왜 붙는가?</summary>

**답:** $$\frac{i(i-1)}{2}$$는 $$i$$행 앞에 있는 원소의 수다. $$k$$행에 원소가 $$k$$개 있으므로 1행부터 $$i - 1$$행까지 $$1 + 2 + \dots + (i - 1)$$개이고, 이 합이 $$\frac{i(i-1)}{2}$$다. $$-1$$은 열 번호 $$j$$가 1부터 세는데 배열의 위치는 0부터 세기 때문에 붙는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$n = 100$$일 때 대각 행렬, 삼중대각 행렬, 아래삼각 행렬에서 값이 올 수 있는 칸은 전체의 몇 퍼센트인가? 셋 가운데 "0 아닌 원소의 비율이 작다"는 희소 행렬의 뜻에 맞지 않는 것은 무엇이고, 그런데도 줄여 담을 수 있는 까닭은?</summary>

**답:** 대각 1%, 삼중대각 2.98%, 아래삼각 50.5%. 아래삼각 행렬은 절반 넘게 차 있어 희소하다고 하기 어렵다. 그래도 0인 칸이 "대각선 위쪽"으로 정해져 있어서, 그 칸을 빼고 담은 뒤 식으로 위치를 계산할 수 있다.<br>
**이유:** 줄여 담을 수 있는지를 가르는 것은 0이 얼마나 많은가가 아니라 0의 자리를 미리 아는가다.

</details>


[^1]: 자료구조 3회 강의 자료 「DS_Week3_Lecture_2024」, p.7 (n × n 배열은 O(n²) 공간, 1차원 배열로 옮기고 mapping function으로 원소를 찾는다)
[^2]: 같은 자료, p.38 (Lower Triangular Matrix: 4 × 4 예, i >= j, 원소 수 n(n+1)/2)
[^3]: 같은 자료, p.40 (Map Lower Triangular Array Into A 1D Array: 행 우선 순서로 하되 아래 삼각 밖은 뺀다, 1, 2, …, 10)
[^4]: 같은 자료, p.35 (Matrix: 번호는 1부터, x(i,j) 표기, 2차원 배열로 나타낼 수 있다)
[^5]: 같은 자료, p.36 (Shortcomings Of Using A 2D Array: 번호가 1 어긋난다, C 배열은 행렬 연산을 지원하지 않는다)
[^6]: 같은 자료, p.6 (Sparse Matrices: 뜻, Diagonal·Tridiagonal·Lower triangular의 비율, structured sparse matrices)
[^7]: 같은 자료, p.37 (Diagonal Matrix: i = j, 원소 n개, 대각선만 저장)
[^8]: 같은 자료, p.41 (Index Of Element [i][j]: i행 앞의 원소 수 i(i−1)/2, 위치 i(i−1)/2 + j − 1, 행의 시작 위치 0, 1, 3, 6)
[^9]: 같은 자료, p.39 (Array Of Arrays Representation: 행의 길이가 같지 않아도 되는 2차원 배열)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 대각 행렬과 삼중대각 행렬의 위치 식과 유도, $$n = 100$$의 칸 수, 0부터 세는 식 $$\frac{i(i+1)}{2} + j$$, 카드 C1~C3은 원본에 없다. 슬라이드는 이 두 모양의 비율만 적는다. 구현 코드에서 $$n$$ = 1~12의 모든 칸으로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 구조체와 `lower_get` 코드, 값을 넣을 때의 규칙, 대칭 행렬과 인접 행렬, $$L$$ 행렬과 유한 차분법으로의 쓰임은 원본에 없다. 구현 코드에는 번호가 범위 밖인지 보는 줄과 값을 넣는 함수가 더 있다.
{% endraw %}
