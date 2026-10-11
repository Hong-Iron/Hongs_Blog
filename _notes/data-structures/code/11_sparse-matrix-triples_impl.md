---
layout: "note"
title: "11_sparse-matrix-triples_impl.c"
display_title: "11_sparse-matrix-triples_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "11"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/sparse-matrix-triples/"
parent_title: "희소 행렬의 3원소 표현"
description: "자료구조 · 희소 행렬의 3원소 표현 구현 코드"
permalink: "/studies/data-structures/code/11_sparse-matrix-triples_impl/"
---
{% raw %}
[희소 행렬의 3원소 표현](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/) 문서의 구현 코드다.

```c
/* 희소 행렬의 3원소 표현: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/11.희소 행렬의 3원소 표현.md
 * 출처: 자료구조 3주차 슬라이드 p.3~15. 슬라이드에는 term의 세 칸(row, col, value)과
 *       "기본 용량 10에서 시작해 REALLOC으로 늘린다"만 있다. 함수들은 그 설명대로 짠 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 11_sparse-matrix-triples_impl.c -o sparse && ./sparse
 * 번호: 행·열 번호는 슬라이드처럼 1부터 센다. 목록(data 배열)의 칸 번호는 0부터다.
 *
 * 확인하는 것
 *   1. 슬라이드 p.12의 4 x 5 행렬 -> 3원소 목록 (1,3,3) (1,5,4) (2,3,5) (2,4,7) (4,2,2) (4,3,6),
 *      다시 2차원 배열로 되돌리면 원래 행렬.
 *   2. 슬라이드 p.13의 행별 목록 row1 = [(3,3),(5,4)], row2 = [(3,5),(4,7)], row3 = [], row4 = [(2,2),(3,6)].
 *   3. 슬라이드의 수: p.3 0인 칸 13/18 = 0.722, p.8 4,000,000바이트와 80,000바이트,
 *      p.10 16 * 10^18바이트와 80 * 10^9바이트, p.15 1,000,000바이트와 23,928바이트.
 *   4. 3원소 목록이 이득인 조건 3t < mn (500 x 500이면 t <= 83,333).
 *   5. 문서의 카드: C1(p.3 행렬의 목록), C3((3,1)에 9를 넣으면 4번 칸에 끼우고 두 묶음을 민다).
 *   6. 용량이 10 -> 20 -> 40으로 두 배씩 는다.
 *   7. 무작위 행렬 500개: 2차원 배열 -> 목록 -> 2차원 배열이 원래와 같다. 목록은 행 우선 순서이고,
 *      묶음 수는 0이 아닌 칸 수와 같고, 이분 탐색으로 읽은 값이 모든 칸에서 2차원 배열과 같다.
 *   8. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveBlocks = 0;   /* malloc 횟수 - free 횟수. 끝에서 0이어야 한다 */

/* ---------- 문서에 실은 코드 ---------- */

typedef struct {
    int row, col, value;      /* 몇째 행, 몇째 열, 그 칸의 값 */
} term;

typedef struct {
    int rows, cols;           /* 행렬의 크기 */
    int count;                /* 0이 아닌 칸의 수 t */
    int capacity;             /* data 배열의 칸 수 */
    term *data;               /* 행 우선 순서로 늘어놓은 3원소 목록 */
} SparseMatrix;

SparseMatrix sm_create(int rows, int cols)
{
    SparseMatrix m = { rows, cols, 0, 10, NULL };      /* 기본 용량 10 */
    m.data = malloc(m.capacity * sizeof(term));
    if (m.data == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(EXIT_FAILURE); }
    liveBlocks++;
    return m;
}

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

/* 목록을 2차원 배열로 되돌린다. 목록에 없는 칸은 0이다 */
void sm_to_dense(const SparseMatrix *m, int *a)
{
    for (int k = 0; k < m->rows * m->cols; k++) a[k] = 0;
    for (int k = 0; k < m->count; k++)
        a[(m->data[k].row - 1) * m->cols + (m->data[k].col - 1)] = m->data[k].value;
}

/* (row, col)이 목록의 몇 번 칸에 있는지 이분 탐색으로 찾는다.
 * 있으면 그 칸 번호, 없으면 -(끼울 자리) - 1 */
static int sm_find(const SparseMatrix *m, int row, int col)
{
    int lo = 0, hi = m->count - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        const term *t = &m->data[mid];
        if (t->row == row && t->col == col) return mid;
        if (t->row < row || (t->row == row && t->col < col)) lo = mid + 1;
        else hi = mid - 1;
    }
    return -lo - 1;
}

/* (row, col) 칸의 값. 목록에 없으면 0 */
int sm_get(const SparseMatrix *m, int row, int col)
{
    int k = sm_find(m, row, col);
    return k >= 0 ? m->data[k].value : 0;
}

/* 0이던 칸에 0이 아닌 값을 넣는다(이미 있으면 값만 바꾼다).
 * 행 우선 순서를 지키려고 뒤 묶음을 한 칸씩 민다. 민 묶음 수를 돌려준다 */
int sm_set(SparseMatrix *m, int row, int col, int value)
{
    int k = sm_find(m, row, col);
    if (k >= 0) { m->data[k].value = value; return 0; }
    int pos = -k - 1;
    sm_append(m, 0, 0, 0);                       /* 자리 하나를 늘린다 */
    int moved = 0;
    for (int i = m->count - 1; i > pos; i--) { m->data[i] = m->data[i - 1]; moved++; }
    m->data[pos].row = row;
    m->data[pos].col = col;
    m->data[pos].value = value;
    return moved;
}

void sm_free(SparseMatrix *m)
{
    free(m->data);
    liveBlocks--;
    m->data = NULL;
    m->count = m->capacity = 0;
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

static int same_list(const SparseMatrix *m, const int (*want)[3], int n)
{
    if (m->count != n) return 0;
    for (int k = 0; k < n; k++)
        if (m->data[k].row != want[k][0] || m->data[k].col != want[k][1] || m->data[k].value != want[k][2])
            return 0;
    return 1;
}

/* row행의 묶음이 목록의 [lo, hi) 칸에 있다 */
static void row_range(const SparseMatrix *m, int row, int *lo, int *hi)
{
    int a = 0;
    while (a < m->count && m->data[a].row < row) a++;
    int b = a;
    while (b < m->count && m->data[b].row == row) b++;
    *lo = a; *hi = b;
}

int main(void)
{
    /* 1. 슬라이드 p.12 */
    const int A[4 * 5] = {
        0, 0, 3, 0, 4,
        0, 0, 5, 7, 0,
        0, 0, 0, 0, 0,
        0, 2, 6, 0, 0 };
    const int wantA[6][3] = { {1,3,3}, {1,5,4}, {2,3,5}, {2,4,7}, {4,2,2}, {4,3,6} };
    SparseMatrix a = sm_from_dense(4, 5, A);
    check(same_list(&a, wantA, 6), "p.12 3원소 목록");
    int back[20];
    sm_to_dense(&a, back);
    check(memcmp(back, A, sizeof(A)) == 0, "p.12 목록 -> 2차원 배열");
    check(sm_get(&a, 2, 4) == 7 && sm_get(&a, 3, 3) == 0 && sm_get(&a, 4, 2) == 2, "sm_get");
    printf("  p.12 목록:");
    for (int k = 0; k < a.count; k++) printf(" (%d,%d,%d)", a.data[k].row, a.data[k].col, a.data[k].value);
    printf("\n");

    /* 2. 슬라이드 p.13: 행별 목록 (열, 값) */
    int lo, hi;
    row_range(&a, 1, &lo, &hi);
    check(hi - lo == 2 && a.data[lo].col == 3 && a.data[lo].value == 3
          && a.data[lo + 1].col == 5 && a.data[lo + 1].value == 4, "p.13 row1");
    row_range(&a, 2, &lo, &hi);
    check(hi - lo == 2 && a.data[lo].col == 3 && a.data[lo].value == 5
          && a.data[lo + 1].col == 4 && a.data[lo + 1].value == 7, "p.13 row2");
    row_range(&a, 3, &lo, &hi);
    check(hi - lo == 0, "p.13 row3은 비었다");
    row_range(&a, 4, &lo, &hi);
    check(hi - lo == 2 && a.data[lo].col == 2 && a.data[lo].value == 2
          && a.data[lo + 1].col == 3 && a.data[lo + 1].value == 6, "p.13 row4");

    /* 5. 카드 C3: (3,1)에 9를 넣는다 */
    int moved = sm_set(&a, 3, 1, 9);
    const int wantA2[7][3] = { {1,3,3}, {1,5,4}, {2,3,5}, {2,4,7}, {3,1,9}, {4,2,2}, {4,3,6} };
    check(moved == 2 && same_list(&a, wantA2, 7) && a.data[4].row == 3, "C3 끼우기: 4번 칸, 두 묶음을 민다");
    check(sm_set(&a, 3, 1, 8) == 0 && sm_get(&a, 3, 1) == 8 && a.count == 7, "있는 칸은 값만 바꾼다");
    sm_free(&a);

    /* 3. 슬라이드 p.3 (카드 C1) */
    const int P3[3 * 6] = {
        1, 0, 0, 1, 0, 0,
        0, 0, 2, 0, 0, 1,
        0, 0, 0, 2, 0, 0 };
    const int wantP3[5][3] = { {1,1,1}, {1,4,1}, {2,3,2}, {2,6,1}, {3,4,2} };
    SparseMatrix p3 = sm_from_dense(3, 6, P3);
    check(same_list(&p3, wantP3, 5), "C1: p.3 행렬의 목록");
    int zeros = 3 * 6 - p3.count;
    check(zeros == 13 && zeros * 1000 / 18 == 722, "p.3 0인 칸 13/18 = 0.722");
    check(p3.count * 1000 / 18 == 277, "p.3 0이 아닌 칸 5/18 = 0.277...");
    check(3 * p3.count < 3 * 6, "p.3 행렬은 목록이 이득(15 < 18)");
    sm_free(&p3);

    /* 3. 슬라이드의 메모리 계산 */
    check(1000LL * 1000 * 4 == 4000000LL && 20000LL * 4 == 80000LL, "p.8 4,000,000바이트와 80,000바이트");
    unsigned long long n10 = 2000000000ULL;
    check(n10 * n10 * 4ULL == 16000000000000000000ULL, "p.10 n x n칸 = 16 * 10^18바이트");
    check(n10 * 10ULL * 4ULL == 80000000000ULL, "p.10 0이 아닌 칸의 값만 = 80 * 10^9바이트");
    check(n10 * 10ULL * 3ULL * 4ULL == 240000000000ULL, "p.10을 3원소로 적으면 240 * 10^9바이트");
    check(500 * 500 * 4 == 1000000 && 3 * 1994 * 4 == 23928, "p.15 1,000,000바이트와 23,928바이트");
    check(sizeof(term) == 3 * sizeof(int), "term은 int 세 칸");
    check(1000000 / 23928 == 41, "p.15 약 41배 차이");

    /* 4. 이득인 조건 3t < mn */
    int best = 0;
    for (int t = 0; t <= 500 * 500; t++)
        if (3 * t < 500 * 500) best = t;
    check(best == 83333, "500 x 500이면 t <= 83,333일 때 이득");

    /* 6. 용량 두 배 늘리기 */
    SparseMatrix g = sm_create(30, 1);
    int caps[3] = { 0, 0, 0 };
    for (int i = 1; i <= 25; i++) {
        sm_append(&g, i, 1, i);
        if (i == 10) caps[0] = g.capacity;
        if (i == 11) caps[1] = g.capacity;
        if (i == 21) caps[2] = g.capacity;
    }
    check(caps[0] == 10 && caps[1] == 20 && caps[2] == 40, "용량 10 -> 20 -> 40");
    check(g.count == 25 && sm_get(&g, 25, 1) == 25 && sm_get(&g, 1, 1) == 1, "늘린 뒤에도 값이 그대로");
    sm_free(&g);

    /* 7. 무작위 행렬 500개 */
    for (int trial = 0; trial < 500; trial++) {
        int rows = 1 + (int)(rnd() % 8), cols = 1 + (int)(rnd() % 8);
        int dense[64], again[64], nonzero = 0;
        int density = (int)(rnd() % 5);              /* 0이면 모두 0, 클수록 촘촘하다 */
        for (int k = 0; k < rows * cols; k++) {
            dense[k] = ((int)(rnd() % 4) < density) ? 1 + (int)(rnd() % 9) : 0;
            if (dense[k] != 0) nonzero++;
        }
        SparseMatrix m = sm_from_dense(rows, cols, dense);
        check(m.count == nonzero, "묶음 수 = 0이 아닌 칸 수");
        for (int k = 1; k < m.count; k++) {
            const term *p = &m.data[k - 1], *q = &m.data[k];
            check(p->row < q->row || (p->row == q->row && p->col < q->col), "행 우선 순서");
        }
        sm_to_dense(&m, again);
        check(memcmp(dense, again, (size_t)(rows * cols) * sizeof(int)) == 0, "왕복");
        for (int i = 1; i <= rows; i++)
            for (int j = 1; j <= cols; j++)
                check(sm_get(&m, i, j) == dense[(i - 1) * cols + (j - 1)], "sm_get = 2차원 배열");
        sm_free(&m);
    }

    /* 8. 누수 */
    check(liveBlocks == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
