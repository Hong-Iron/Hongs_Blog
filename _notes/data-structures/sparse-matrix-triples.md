---
layout: "note"
title: "희소 행렬의 3원소 표현"
display_title: "희소 행렬의 3원소 표현 (Sparse Matrix as Triples)"
kind: "concept"
kind_label: "자료구조"
num: "11"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Sparse Matrix", "희소 행렬", "희소 배열", "Sparse Array", "Triple", "3원소", "삼원소 표현", "term", "Sparsity", "희소도", "Structured Sparse Matrix", "Unstructured Sparse Matrix", "행 우선 목록"]
description: "표의 칸이 거의 다 0이면, 0을 하나하나 적지 않고 0이 아닌 칸만 \"몇째 줄, 몇째 칸, 값\" 세 가지로 적어 둔다. 공항 1,000곳 사이의 직항 편을 적은 표처럼 대부분이 빈 표에서는 메모리가 수십 분의 일로 준다. 대신 \"3행 4열의 값\"을 한 번에 꺼낼 수 없어 목록에서…"
prev_url: "/studies/data-structures/triangular-matrix-mapping/"
prev_title: "특수 행렬을 1차원 배열에 담기"
next_url: "/studies/data-structures/sparse-matrix-transpose/"
next_title: "희소 행렬의 전치"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "11_sparse-matrix-triples_impl.c", "u": "/studies/data-structures/code/11_sparse-matrix-triples_impl/", "r": "구현"}]
permalink: "/studies/data-structures/sparse-matrix-triples/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표의 칸이 거의 다 0이면, 0을 하나하나 적지 않고 0이 아닌 칸만 "몇째 줄, 몇째 칸, 값" 세 가지로 적어 둔다. 공항 1,000곳 사이의 직항 편을 적은 표처럼 대부분이 빈 표에서는 메모리가 수십 분의 일로 준다. 대신 "3행 4열의 값"을 한 번에 꺼낼 수 없어 목록에서 찾아야 하고, 0이던 칸에 값을 넣으려면 목록의 뒤쪽을 밀어야 한다. 칸 하나를 수 셋으로 적으니, 0이 아닌 칸이 전체의 3분의 1을 넘으면 오히려 손해다.

</div>


## 예시로 보기

웹 페이지 20억 개가 서로 거는 링크 수를 표 하나에 적는다고 하자. $$i$$행 $$j$$열에 "페이지 $$i$$에서 페이지 $$j$$로 가는 링크 수"를 적는다. 칸이 20억 × 20억 개이고 칸마다 4바이트면 $$16 \times 10^{18}$$바이트, 16엑사바이트다. 1테라바이트 디스크 1,600만 개 분량이라 어디에도 담을 수 없다[^s2]. 그런데 한 페이지가 거는 링크는 평균 10개쯤이라, 0이 아닌 칸은 200억 개뿐이다. 그 값만 적으면 200억 × 4바이트 = 80기가바이트다.

작은 표로 같은 일을 해 본다. 4행 5열, 칸 20개 가운데 0이 아닌 칸은 6개다.

```
       1열 2열 3열 4열 5열
1행     0   0   3   0   4
2행     0   0   5   7   0
3행     0   0   0   0   0
4행     0   2   6   0   0
```

윗줄부터, 한 줄 안에서는 왼쪽부터 읽으면서 0이 아닌 칸을 만날 때마다 (행 번호, 열 번호, 값)을 적는다.

| 목록의 칸 | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 행 | 1 | 1 | 2 | 2 | 4 | 4 |
| 열 | 3 | 5 | 3 | 4 | 2 | 3 |
| 값 | 3 | 4 | 5 | 7 | 2 | 6 |

이렇게 세 수를 한 묶음으로 적은 것을 3원소(triple)라 부르고, 0이 대부분인 행렬을 희소 행렬이라 부른다. 이 작은 예는 수 20개 대신 18개를 적었으니 이득이 거의 없다. 이득은 0이 훨씬 많을 때 난다. 500 × 500 행렬에 0이 아닌 칸이 1,994개면 2차원 배열은 500 × 500 × 4 = 1,000,000바이트이고, 3원소 목록은 3 × 1,994 × 4 = 23,928바이트다. 41분의 1쯤이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 위 목록과 아래 행별 목록, 본문의 수(0.722, 4,000,000과 80,000바이트, $$16 \times 10^{18}$$과 $$80 \times 10^9$$바이트, 1,000,000과 23,928바이트), 이득 경계 83,333, 카드 C1·C3, 무작위 행렬 500개에서 2차원 배열 → 목록 → 2차원 배열 왕복과 이분 탐색 읽기 — [11_sparse-matrix-triples_impl.c](/Hongs_Blog/studies/data-structures/code/11_sparse-matrix-triples_impl/)</div>

</div>


## 정의

**희소 행렬.** 0이 아닌 칸의 수를 전체 칸 수로 나눈 값이 작은 행렬이다. 얼마부터 작다고 할지 정해진 선은 없다. 흔히 쓰는 기준은 "0이 아닌 칸의 수가 행 수나 열 수와 비슷한 정도"다.

기호로 쓰면, $$m$$행 $$n$$열 행렬에 0이 아닌 칸이 $$t$$개 있을 때 $$\dfrac{t}{mn}$$이 작다. 거꾸로 0인 칸의 비율 $$1 - \dfrac{t}{mn}$$을 희소도(sparsity)라 부르기도 한다. 3행 6열에 0이 13개인 행렬은 희소도가 $$13/18 \approx 0.722$$다.

**두 갈래.** 0이 아닌 칸이 어디에 있는지 미리 아는가로 갈린다.

| | 0이 아닌 칸의 자리 | 예 | 저장하는 법 |
|---|---|---|---|
| 구조가 정해진 희소 행렬 | 정해진 띠나 삼각형 안 | 대각 행렬, 삼중대각 행렬 | 자리를 식으로 계산해 1차원 배열에 담는다: [특수 행렬을 1차원 배열에 담기](/Hongs_Blog/studies/data-structures/triangular-matrix-mapping/) |
| 구조가 없는 희소 행렬 | 아무 데나 | 공항 사이 직항 편 표, 웹 페이지 링크 표 | 0이 아닌 칸마다 자리를 함께 적는다: 이 문서 |

**3원소 표현.** 희소 행렬을 3원소 〈행, 열, 값〉의 모임으로 본다. 행과 열은 정수이고, 같은 (행, 열) 짝은 한 번만 나온다. 이 모임에 하는 일은 만들기(Create), 전치(Transpose), 더하기(Add), 곱하기(Multiply)다. 이렇게 "무엇을 담고 무슨 일을 하나"만 정해 둔 것이 [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/)이다.

3원소를 메모리에 늘어놓는 방법은 둘이다.

1. **한 줄짜리 목록.** 위 예처럼 모든 3원소를 윗줄부터, 줄 안에서는 왼쪽부터 읽은 순서(행 우선 순서)로 1차원 배열 하나에 늘어놓는다.
2. **행마다 목록 하나.** 행 번호는 "몇 번째 목록인가"로 알 수 있으니 (열, 값)만 적는다.

```
row1 = [(3, 3), (5, 4)]
row2 = [(3, 5), (4, 7)]
row3 = []
row4 = [(2, 2), (3, 6)]
```

이 문서와 [희소 행렬의 전치](/Hongs_Blog/studies/data-structures/sparse-matrix-transpose/)는 첫째 방법을 쓴다. 한 줄짜리 목록이 늘 지켜야 할 규칙(표현 불변식)은 둘이다. 묶음은 행 번호가 작은 것부터, 행이 같으면 열 번호가 작은 것부터 선다. 값이 0인 묶음은 없다[^s1].

### C로 적기

묶음 하나는 `int` 세 칸(`row`, `col`, `value`)짜리 `term`이고, 목록은 `term`의 1차원 배열이다. 0이 아닌 칸이 몇 개일지 처음에는 모르므로 용량 10쯤에서 시작해 모자라면 `realloc`으로 늘린다. 늘리는 방법은 [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)와 같다.

```c
typedef struct {
    int row, col, value;      /* 몇째 행, 몇째 열, 그 칸의 값 */
} term;

typedef struct {
    int rows, cols;           /* 행렬의 크기 */
    int count;                /* 0이 아닌 칸의 수 t */
    int capacity;             /* data 배열의 칸 수 */
    term *data;               /* 행 우선 순서로 늘어놓은 3원소 목록 */
} SparseMatrix;

/* 목록 끝에 한 묶음을 붙인다. 가득 찼으면 용량을 두 배로 늘린다 */
void sm_append(SparseMatrix *m, int row, int col, int value)
{
    if (m->count == m->capacity) {
        term *bigger = realloc(m->data, 2 * m->capacity * sizeof(term));
        if (bigger == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(EXIT_FAILURE); }
        m->data = bigger;
        m->capacity *= 2;
    }
    m->data[m->count].row = row;
    m->data[m->count].col = col;
    m->data[m->count].value = value;
    m->count++;
}

/* 2차원 배열(행 우선으로 편 1차원 배열 a)을 윗줄부터, 줄 안에서는 왼쪽부터 훑는다 */
SparseMatrix sm_from_dense(int rows, int cols, const int *a)
{
    SparseMatrix m = sm_create(rows, cols);
    for (int i = 1; i <= rows; i++)
        for (int j = 1; j <= cols; j++)
            if (a[(i - 1) * cols + (j - 1)] != 0)
                sm_append(&m, i, j, a[(i - 1) * cols + (j - 1)]);
    return m;
}
```

행·열 번호는 행렬 표기대로 1부터 세고, 목록의 칸 번호는 C 배열이라 0부터 센다. `a[(i - 1) * cols + (j - 1)]`은 2차원 배열을 한 줄로 폈을 때 $$i$$행 $$j$$열이 놓이는 자리다([행 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/)). 바깥 고리가 행, 안쪽 고리가 열이라 목록이 저절로 행 우선 순서로 선다[^s1].

### 일마다 드는 비용

$$m \times n$$ 행렬에 0이 아닌 칸이 $$t$$개일 때다[^s1].

| 일 | 2차원 배열 | 한 줄짜리 3원소 목록 |
|---|---|---|
| 메모리(수의 개수) | $$mn$$ | $$3t$$ |
| $$(i, j)$$ 칸 읽기 | $$O(1)$$ | $$O(\log t)$$. 순서대로 서 있어 반씩 좁혀 찾는다 |
| 0이 아닌 칸 모두 훑기 | $$O(mn)$$ | $$O(t)$$ |
| 0이던 칸에 값 넣기 | $$O(1)$$ | $$O(t)$$. 순서를 지키려고 뒤 묶음을 한 칸씩 민다 |

3원소 목록이 메모리를 덜 쓰는 것은 $$3t < mn$$, 곧 $$t < \dfrac{mn}{3}$$일 때뿐이다. 500 × 500이면 $$t$$가 83,333 이하일 때다[^s1].

## 활용

- 구현: [11_sparse-matrix-triples_impl.c](/Hongs_Blog/studies/data-structures/code/11_sparse-matrix-triples_impl/). 읽기 `sm_get`(이분 탐색)과 값 넣기 `sm_set`도 이 파일에 있다.
- 공항 1,000곳의 직항 편 표는 칸이 100만 개다. 칸마다 "그 구간의 항공편 목록"을 가리키는 4바이트 포인터를 두면 400만 바이트다. 항공편이 있는 구간이 2만 개뿐이면 포인터도 2만 개, 8만 바이트면 된다. 포인터가 8바이트인 컴퓨터에서는 두 수가 모두 두 배가 된다[^s2].
- 웹 페이지 링크 표로 하는 분석이 있다. 다른 페이지에서 링크를 많이 받는 페이지를 authority page, 그런 페이지로 가는 링크를 많이 가진 페이지를 hub page라 부른다.
- "행마다 목록 하나" 방식은 그래프에서 정점마다 이웃 목록을 두는 방식과 같은 생각이다: [연결 인접 리스트와 배열 인접 리스트](/Hongs_Blog/studies/data-structures/linked-adjacency-list/)[^s1].
- 흔한 실수: 새 묶음을 순서와 상관없이 목록 끝에 붙이는 것. 순서가 깨지면 이분 탐색이 틀린 답을 내고, [전치](/Hongs_Blog/studies/data-structures/sparse-matrix-transpose/)의 결과도 순서가 어긋난다.

## 연결

- 선수: [행 우선 배치와 열 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/)(목록을 세우는 순서), [행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)(행렬이 무엇인가)
- 0이 아닌 칸의 자리가 정해져 있을 때: [특수 행렬을 1차원 배열에 담기](/Hongs_Blog/studies/data-structures/triangular-matrix-mapping/)
- 이 목록으로 하는 일: [희소 행렬의 전치](/Hongs_Blog/studies/data-structures/sparse-matrix-transpose/)
- 목록이 가득 찼을 때: [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 3행 6열 행렬이 있다. 1행은 1, 0, 0, 1, 0, 0이고 2행은 0, 0, 2, 0, 0, 1, 3행은 0, 0, 0, 2, 0, 0이다. 한 줄짜리 3원소 목록과 행마다 목록 두 가지로 적어라. 수를 몇 개 적었는가?</summary>

**답:** 한 줄짜리 목록은 (1, 1, 1), (1, 4, 1), (2, 3, 2), (2, 6, 1), (3, 4, 2)다. 행마다 목록은 row1 = [(1, 1), (4, 1)], row2 = [(3, 2), (6, 1)], row3 = [(4, 2)]다. 한 줄짜리 목록은 수 15개를 적는다. 2차원 배열은 18개다.<br>
**이유:** 윗줄부터, 줄 안에서는 왼쪽부터 읽는다. 행마다 목록에서는 행 번호를 적지 않고 (열, 값)만 적는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 500 × 500 행렬에 0이 아닌 칸이 10만 개 있다. 3원소 목록으로 바꾸면 메모리가 주는가? 0이 아닌 칸이 전체의 3분의 1을 넘으면 왜 손해인가?</summary>

**답:** 아니다. 오히려 는다. 2차원 배열은 수 250,000개, 3원소 목록은 3 × 100,000 = 300,000개다. 3원소 목록은 칸 하나를 수 셋(행, 열, 값)으로 적으므로 $$3t < mn$$일 때만 이득이고, 이 크기에서는 $$t \le 83{,}333$$이어야 한다.<br>
**이유:** 0을 안 적어서 아낀 칸 수가 $$mn - t$$이고, 자리 번호를 적느라 더 쓴 칸 수가 $$2t$$다. $$mn - t > 2t$$여야 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예시의 목록 (1, 3, 3), (1, 5, 4), (2, 3, 5), (2, 4, 7), (4, 2, 2), (4, 3, 6)에서 3행 1열에 9를 넣는다. 새 묶음은 목록의 몇 번 칸(0부터)에 들어가고, 묶음 몇 개가 밀리는가?</summary>

**답:** 4번 칸에 (3, 1, 9)가 들어간다. (4, 2, 2)와 (4, 3, 6) 두 묶음이 한 칸씩 뒤로 밀린다.<br>
**이유:** 2행의 묶음 뒤, 4행의 묶음 앞이 3행의 자리다. 2차원 배열이라면 칸 하나만 고치면 끝나는 일이다.

</details>


[^s1]: 행 수·열 수·개수를 함께 묶은 구조체, 표현 불변식, 함수들, 이분 탐색 읽기와 끼워 넣기의 비용, 이득 조건 $$3t < mn$$, 인접 리스트와의 연결, 카드 C2·C3은 보탠 것이다. 모두 구현 코드로 확인했다.
[^s2]: 행·열 번호까지 3원소로 적으면 세 배인 240GB다(구현 코드에서 계산).
{% endraw %}
