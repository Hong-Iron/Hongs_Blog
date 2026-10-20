---
layout: "note"
title: "희소 행렬의 전치"
display_title: "희소 행렬의 전치 (Sparse Matrix Transpose)"
kind: "concept"
kind_label: "알고리즘"
num: "12"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Sparse Matrix Transpose", "Fast Transpose", "빠른 전치", "전치", "Transpose", "rowSize", "rowStart", "열별 개수", "시작 위치"]
description: "표의 줄과 칸을 맞바꾼 표를, 0이 아닌 칸만 적은 목록에서 바로 만든다. 줄 번호와 칸 번호를 서로 바꿔 적기만 하면 목록의 순서가 뒤죽박죽이 된다. 그래서 먼저 새 표의 줄마다 몇 개가 들어갈지 세고, 그 수로 줄마다 목록의 어디서 시작할지 정한 다음, 원래 목록을 앞에서부터 …"
prev_url: "/studies/data-structures/sparse-matrix-triples/"
prev_title: "희소 행렬의 3원소 표현"
next_url: "/studies/data-structures/array-stack/"
next_title: "배열로 만든 스택"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "12_sparse-matrix-transpose_impl.c", "u": "/studies/data-structures/code/12_sparse-matrix-transpose_impl/", "r": "구현"}, {"t": "12_sparse-matrix-transpose_verify.py", "u": "/studies/data-structures/code/12_sparse-matrix-transpose_verify/", "r": "검증"}]
permalink: "/studies/data-structures/sparse-matrix-transpose/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표의 줄과 칸을 맞바꾼 표를, 0이 아닌 칸만 적은 목록에서 바로 만든다. 줄 번호와 칸 번호를 서로 바꿔 적기만 하면 목록의 순서가 뒤죽박죽이 된다. 그래서 먼저 새 표의 줄마다 몇 개가 들어갈지 세고, 그 수로 줄마다 목록의 어디서 시작할지 정한 다음, 원래 목록을 앞에서부터 읽으며 제자리에 꽂는다. 목록을 두 번만 훑으면 끝나지만, 원래 목록이 줄 순서로 서 있어야 결과도 순서대로 선다.

</div>


## 예시로 보기

행과 열을 맞바꾸는 일(전치)은 2차원 배열에서는 쉽다. $$i$$행 $$j$$열의 값을 $$j$$행 $$i$$열로 옮기면 된다. 하지만 500 × 500 행렬이면 0이 아닌 칸이 2천 개뿐이어도 칸 25만 개를 모두 건드린다. [3원소 목록](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/)만 가지고 하면 훨씬 적게 건드린다.

[3원소 표현](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/)의 예시와 같은 4 × 5 행렬과 그 전치다.

```
0 0 3 0 4            0 0 0 0
0 0 5 7 0            0 0 0 2
0 0 0 0 0    -->     3 5 0 6
0 2 6 0 0            0 7 0 0
                     4 0 0 0
```

가장 먼저 떠오르는 방법은 묶음마다 행 번호와 열 번호를 바꿔 적는 것이다.

| | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 원래 목록 (행, 열, 값) | (1, 3, 3) | (1, 5, 4) | (2, 3, 5) | (2, 4, 7) | (4, 2, 2) | (4, 3, 6) |
| 번호만 바꿈 | (3, 1, 3) | (5, 1, 4) | (3, 2, 5) | (4, 2, 7) | (2, 4, 2) | (3, 4, 6) |

바꾼 목록의 행 번호가 3, 5, 3, 4, 2, 3이다. 행 번호가 작은 것부터 서야 한다는 목록의 규칙이 깨졌다. 다시 정렬하면 되지만, 정렬하지 않고도 묶음마다 갈 자리를 미리 알아낼 수 있다. 세 단계다.

**1단계: 새 행마다 몇 개가 들어가나.** 전치한 행렬의 $$c$$행은 원래 행렬의 $$c$$열이다. 그래서 원래 목록에서 열 번호별로 개수를 센다.

**2단계: 새 행마다 목록의 몇 번 칸에서 시작하나.** 앞 행들의 개수를 모두 더한다. 3행이라면 1행과 2행의 개수 0 + 1 = 1이므로 1번 칸에서 시작한다.

| 열 번호(= 새 행 번호) | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 1단계: 개수 | 0 | 1 | 3 | 1 | 1 |
| 2단계: 시작 칸 | 0 | 0 | 1 | 4 | 5 |

**3단계: 원래 목록을 앞에서부터 읽어 꽂는다.** 묶음의 열 번호를 보고 그 행의 시작 칸에 꽂는다. 꽂은 뒤에는 그 행의 시작 칸을 1 올려, 같은 행의 다음 묶음이 옆 칸으로 가게 한다.

| 읽은 묶음 | 열 번호 | 꽂는 칸 | 새 묶음 | 그 뒤 시작 칸 |
|---|---|---|---|---|
| (1, 3, 3) | 3 | 1 | (3, 1, 3) | 0, 0, **2**, 4, 5 |
| (1, 5, 4) | 5 | 5 | (5, 1, 4) | 0, 0, 2, 4, **6** |
| (2, 3, 5) | 3 | 2 | (3, 2, 5) | 0, 0, **3**, 4, 6 |
| (2, 4, 7) | 4 | 4 | (4, 2, 7) | 0, 0, 3, **5**, 6 |
| (4, 2, 2) | 2 | 0 | (2, 4, 2) | 0, **1**, 3, 5, 6 |
| (4, 3, 6) | 3 | 3 | (3, 4, 6) | 0, 1, **4**, 5, 6 |

칸 번호 순으로 읽으면 (2, 4, 2), (3, 1, 3), (3, 2, 5), (3, 4, 6), (4, 2, 7), (5, 1, 4)다. 오른쪽 행렬을 윗줄부터 읽어 적은 목록과 같고, 행 우선 순서로 서 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 위 개수·시작 칸·추적 표·결과, 번호만 바꾸면 순서가 깨지는 것, 카드 C1·C3, 경계(0이 아닌 칸이 없는 행렬, 1 × 1, 한 행, 한 열), 무작위 행렬 1,000개에서 세 단계의 결과 = 2차원 배열을 뒤집어 만든 목록, 두 번 전치하면 원래 목록 — [12_sparse-matrix-transpose_impl.c](/Hongs_Blog/studies/data-structures/code/12_sparse-matrix-transpose_impl/)</div>

</div>


## 알고리즘

받는 것은 $$m$$행 $$n$$열 행렬의 한 줄짜리 3원소 목록이다. 0이 아닌 칸이 $$t$$개이고 행 우선 순서로 서 있다. 내놓는 것은 전치한 $$n$$행 $$m$$열 행렬의 3원소 목록이고, 역시 행 우선 순서다.

```c
SparseMatrix fast_transpose(const SparseMatrix *a)
{
    SparseMatrix b = { a->cols, a->rows, a->count, NULL };      /* 행 수와 열 수가 바뀐다 */
    b.data = get_memory(a->count * sizeof(term));
    int *rowSize = get_memory((a->cols + 1) * sizeof(int));     /* 결과의 각 행에 들어갈 개수 */
    int *rowStart = get_memory((a->cols + 1) * sizeof(int));    /* 결과의 각 행이 시작하는 칸 */

    /* 1단계: 원래 행렬의 열마다 0이 아닌 칸을 센다 */
    for (int c = 1; c <= a->cols; c++) rowSize[c] = 0;
    for (int i = 0; i < a->count; i++) rowSize[a->data[i].col]++;

    /* 2단계: 앞 행들의 개수를 더해 시작 칸을 정한다 */
    rowStart[1] = 0;
    for (int c = 2; c <= a->cols; c++) rowStart[c] = rowStart[c - 1] + rowSize[c - 1];

    /* 3단계: 원래 목록을 앞에서부터 읽어 제자리에 꽂는다 */
    for (int i = 0; i < a->count; i++) {
        int j = rowStart[a->data[i].col]++;     /* 꽂을 칸. 꽂은 뒤 그 행의 다음 칸으로 */
        b.data[j].row = a->data[i].col;
        b.data[j].col = a->data[i].row;
        b.data[j].value = a->data[i].value;
    }

    give_back(rowSize);
    give_back(rowStart);
    return b;
}
```

`get_memory`는 `malloc`에 실패 검사를 붙인 것이고 `give_back`은 `free`다. 행·열 번호를 행렬 표기대로 1부터 세므로, 두 덤 배열은 `cols + 1`칸을 잡아 1번 칸부터 쓴다[^s1].

### 왜 맞는가

3단계에서 묶음 하나를 읽기 직전마다 이 말이 맞다. 모든 열 번호 $$c$$에 대해 `rowStart[c]`는 "열 번호가 $$c$$보다 작은 묶음의 수"에 "이미 읽은 묶음 가운데 열 번호가 $$c$$인 것의 수"를 더한 값이다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. **처음.** 2단계가 끝나면 `rowStart[c]`는 열 번호가 $$c$$보다 작은 묶음의 수다. 아직 읽은 묶음이 없어 둘째 수는 0이다. — 2단계가 앞 행들의 개수를 더했기 때문
2. **한 걸음 뒤에도.** 열 번호가 $$c$$인 묶음을 하나 읽으면 `rowStart[c]`만 1 오른다. "이미 읽은 것 가운데 열 번호가 $$c$$인 것의 수"도 딱 1 늘었다. 다른 열의 값은 둘 다 그대로다. — 3단계의 `++`
3. **칸이 겹치지 않는다.** 열 $$c$$의 묶음이 $$k$$개면, 이들은 2단계에서 정한 시작 칸 $$S_c$$부터 $$S_c, S_c + 1, \dots, S_c + k - 1$$에 차례로 꽂힌다. 다음 열의 시작 칸이 $$S_c + k$$라서 서로 겹치지 않고, $$t$$칸이 빈틈없이 찬다. — 1, 2에서
4. **순서가 맞다.** 새 목록은 새 행 번호(옛 열 번호)가 작은 덩어리부터 선다. 한 덩어리 안에서는 읽은 순서대로 꽂힌다. 원래 목록이 옛 행 번호가 작은 것부터 서 있으므로, 덩어리 안에서 새 열 번호(옛 행 번호)가 작은 것이 앞에 온다. 같은 (행, 열) 짝은 한 번만 나오니 순서가 애매한 묶음도 없다. ∎

</details>


4번이 원래 목록의 순서에 기대고 있다. 원래 목록이 행 순서가 아니면 3번까지는 맞지만 덩어리 안의 순서가 어긋난다(카드 C3).

### 걸음 수

단계마다 세면 이렇다. 1단계는 개수 칸 $$n$$개를 0으로 만들고 목록 $$t$$개를 한 번 훑으니 $$O(n + t)$$, 2단계는 $$O(n)$$, 3단계는 $$O(t)$$, 모두 더해 $$O(n + t)$$다. 여기서 $$n$$은 원래 행렬의 열 수, $$t$$는 0이 아닌 칸 수다. 행 수 $$m$$은 식에 나오지 않는다.

고리가 도는 횟수를 정확히 세면 $$n + t + (n - 1) + t = 2t + 2n - 1$$번이다. 다른 방법과 견주면 이렇다[^s1].

| 방법 | 고리가 도는 횟수 | 500 × 500, $$t = 1{,}994$$ | 예시의 4 × 5 행렬 |
|---|---|---|---|
| 2차원 배열에서 칸마다 옮기기 | $$mn$$ | 250,000 | 20 |
| 열 번호 1부터 $$n$$까지, 번호마다 목록 전체를 훑어 골라내기 | $$nt$$ | 997,000 | 30 |
| 세 단계 | $$2t + 2n - 1$$ | 4,987 | 21 |

0이 드문 큰 행렬에서는 세 단계가 50배쯤 적게 돈다. 4 × 5 예처럼 작고 0이 많지 않으면 차이가 없다. 덤으로 쓰는 메모리는 길이 $$n$$인 배열 둘이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 파이썬으로 다시 짜서 고리가 도는 횟수를 셌다. 무작위 행렬 1,000개에서 세 방법의 결과가 같고 횟수가 각각 $$2t + 2n - 1$$, $$nt$$, $$mn$$과 정확히 같다. 위 표의 수, $$n$$과 $$t$$를 함께 두 배로 하면 횟수도 두 배, 행 수만 키우면 그대로 — [12_sparse-matrix-transpose_verify.py](/Hongs_Blog/studies/data-structures/code/12_sparse-matrix-transpose_verify/)</div>

</div>


## 활용

- 구현: [12_sparse-matrix-transpose_impl.c](/Hongs_Blog/studies/data-structures/code/12_sparse-matrix-transpose_impl/). 연습: [희소 행렬 전치 예제 사다리](/Hongs_Blog/studies/data-structures/sparse-transpose-ladder/)
- "종류별로 세고 → 시작 칸을 정하고 → 한 번 훑으며 꽂는다"는 값의 종류가 적은 자료를 순서대로 세울 때 쓰는 방법(계수 정렬)과 같은 짜임이다. 여기서는 열 번호가 그 종류다[^s1].
- 희소 행렬의 곱셈은 이 문서에서 다루지 않는다.
- 흔한 실수 둘. 3단계에서 시작 칸을 올리지 않으면 같은 행의 묶음이 한 칸에 겹쳐 쓰인다. 2단계에서 자기 행의 개수까지 더하면 모든 묶음이 제자리보다 뒤로 밀려, 마지막 행의 묶음이 배열 끝을 넘는다.

## 연결

- 선수: [희소 행렬의 3원소 표현](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/)(목록의 꼴과 순서 규칙), [행렬 곱셈과 전치](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)(전치의 뜻. 두 번 전치하면 원래 행렬이다)
- 고리가 도는 횟수를 세는 법: [연산 횟수와 단계 수 세기](/Hongs_Blog/studies/data-structures/operation-step-count/). $$O$$로 적는 법: [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)
- "행 우선 순서"가 무엇인가: [행 우선 배치와 열 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 3행 6열 행렬의 목록 (1, 1, 1), (1, 4, 1), (2, 3, 2), (2, 6, 1), (3, 4, 2)를 세 단계로 전치하라. 1단계의 개수, 2단계의 시작 칸, 결과 목록을 적어라.</summary>

**답:** 열 번호 1 ~ 6의 개수는 1, 0, 1, 2, 0, 1이고 시작 칸은 0, 1, 1, 2, 4, 4다. 결과는 (1, 1, 1), (3, 2, 2), (4, 1, 1), (4, 3, 2), (6, 2, 1)이다.<br>
**이유:** 묶음을 차례로 읽으면 꽂는 칸이 0, 2, 1, 4, 3이다. 열 번호 4인 묶음 둘은 읽은 순서대로 2번, 3번 칸에 가서 (4, 1, 1)이 (4, 3, 2)보다 앞에 선다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 코드의 `int j = rowStart[a->data[i].col]++;` 한 줄이 하는 일을 쉬운 말 한 문장으로 써라.</summary>

**답:** 지금 읽은 묶음이 들어갈 새 행에서 아직 비어 있는 첫 칸의 번호를 꺼내 `j`에 적고, 같은 행의 다음 묶음이 바로 옆 칸으로 가도록 그 번호를 1 올린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 원래 목록이 행 순서로 서 있지 않으면 결과가 어떻게 틀어지는가? 2 × 2 행렬의 목록 (2, 1, 5), (1, 1, 3), (1, 2, 4)로 보여라.</summary>

**답:** 결과가 (1, 2, 5), (1, 1, 3), (2, 1, 4)가 된다. 새 1행 안에서 열 번호 2가 열 번호 1보다 앞에 서서 행 우선 순서가 아니다.<br>
**이유:** 묶음은 맞는 행의 덩어리에 들어가고 칸도 겹치지 않는다. 하지만 한 덩어리 안의 순서는 읽은 순서를 그대로 물려받는다. 원래 목록에서 2행이 1행보다 먼저 나왔으니 새 목록에서도 열 번호 2가 먼저다.

</details>


[^s1]: 계수 정렬은 Cormen 외, *Introduction to Algorithms* 3판, 8.2절 "Counting sort"를 따랐다. 구현 코드와 검증 코드로 확인했다.
{% endraw %}
