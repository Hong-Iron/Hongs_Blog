---
layout: "note"
title: "12_sparse-matrix-transpose_impl.c"
display_title: "12_sparse-matrix-transpose_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "12"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/sparse-matrix-transpose/"
parent_title: "희소 행렬의 전치"
description: "자료구조 · 희소 행렬의 전치 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/12_sparse-matrix-transpose_impl/"
---
{% raw %}
[희소 행렬의 전치](/Hongs_Blog/studies/data-structures/sparse-matrix-transpose/) 문서의 구현 코드다.

```c
/* 희소 행렬의 전치: 세 단계(열별 개수 -> 시작 위치 -> 옮기기) 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/12.희소 행렬의 전치.md
 * 출처: 자료구조 3주차 슬라이드 p.16~19. 슬라이드에는 세 단계의 설명과 예의 값만 있고
 *       코드는 "program 2.8을 보라"로 넘긴다. 아래 코드는 그 세 단계를 그대로 짠 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 12_sparse-matrix-transpose_impl.c -o transpose && ./transpose
 * 번호: 행·열 번호는 슬라이드처럼 1부터 센다. 목록(data 배열)의 칸 번호는 0부터다.
 *       그래서 rowSize와 rowStart는 cols + 1칸을 잡고 1번 칸부터 쓴다.
 *
 * 확인하는 것
 *   1. 슬라이드 p.17~18: 열별 개수 [0, 1, 3, 1, 1], 시작 위치 [0, 0, 1, 4, 5],
 *      결과 (2,4,2) (3,1,3) (3,2,5) (3,4,6) (4,2,7) (5,1,4).
 *   2. 문서의 추적 표: 원소마다 꽂히는 칸 1, 5, 2, 4, 0, 3.
 *   3. 행·열 번호만 바꿔 적으면 행 우선 순서가 깨진다.
 *   4. 카드 C1(p.3의 3 x 6 행렬): 개수 [1, 0, 1, 2, 0, 1], 시작 [0, 1, 1, 2, 4, 4].
 *   5. 카드 C3: 원래 목록이 행 순서가 아니면 결과의 한 행 안에서 열 순서가 어긋난다.
 *   6. 경계: 0이 아닌 칸이 없는 행렬, 1 x 1, 한 행짜리, 한 열짜리.
 *   7. 무작위 행렬 1,000개: 빠른 전치 = 2차원 배열을 뒤집어 만든 목록 = 열마다 목록을 훑는 느린 전치.
 *      두 번 전치하면 원래 목록.
 *   8. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveBlocks = 0;   /* malloc 횟수 - free 횟수 */

static void *get_memory(size_t bytes)
{
    void *p = malloc(bytes ? bytes : 1);
    if (p == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(EXIT_FAILURE); }
    liveBlocks++;
    return p;
}
static void give_back(void *p) { free(p); liveBlocks--; }

typedef struct {
    int row, col, value;
} term;

typedef struct {
    int rows, cols;           /* 행렬의 크기 */
    int count;                /* 0이 아닌 칸의 수 t */
    term *data;               /* 행 우선 순서로 늘어놓은 3원소 목록 */
} SparseMatrix;

/* ---------- 문서에 실은 코드 ---------- */

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

/* 느린 방법: 열 번호 1, 2, ..., cols마다 목록 전체를 훑어 그 열의 원소를 골라 붙인다 */
SparseMatrix slow_transpose(const SparseMatrix *a)
{
    SparseMatrix b = { a->cols, a->rows, 0, NULL };
    b.data = get_memory(a->count * sizeof(term));
    for (int c = 1; c <= a->cols; c++)
        for (int i = 0; i < a->count; i++)
            if (a->data[i].col == c) {
                b.data[b.count].row = a->data[i].col;
                b.data[b.count].col = a->data[i].row;
                b.data[b.count].value = a->data[i].value;
                b.count++;
            }
    return b;
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

static SparseMatrix from_dense(int rows, int cols, const int *a)
{
    SparseMatrix m = { rows, cols, 0, NULL };
    m.data = get_memory((size_t)(rows * cols) * sizeof(term));
    for (int i = 1; i <= rows; i++)
        for (int j = 1; j <= cols; j++)
            if (a[(i - 1) * cols + (j - 1)] != 0) {
                m.data[m.count].row = i;
                m.data[m.count].col = j;
                m.data[m.count].value = a[(i - 1) * cols + (j - 1)];
                m.count++;
            }
    return m;
}

static SparseMatrix from_list(int rows, int cols, const int (*list)[3], int n)
{
    SparseMatrix m = { rows, cols, n, NULL };
    m.data = get_memory((size_t)n * sizeof(term));
    for (int k = 0; k < n; k++) {
        m.data[k].row = list[k][0]; m.data[k].col = list[k][1]; m.data[k].value = list[k][2];
    }
    return m;
}

static void sm_free(SparseMatrix *m) { give_back(m->data); m->data = NULL; }

static int same_list(const SparseMatrix *m, const int (*want)[3], int n)
{
    if (m->count != n) return 0;
    for (int k = 0; k < n; k++)
        if (m->data[k].row != want[k][0] || m->data[k].col != want[k][1] || m->data[k].value != want[k][2])
            return 0;
    return 1;
}

static int same_matrix(const SparseMatrix *x, const SparseMatrix *y)
{
    if (x->rows != y->rows || x->cols != y->cols || x->count != y->count) return 0;
    for (int k = 0; k < x->count; k++)
        if (x->data[k].row != y->data[k].row || x->data[k].col != y->data[k].col
            || x->data[k].value != y->data[k].value) return 0;
    return 1;
}

static int row_major(const SparseMatrix *m)
{
    for (int k = 1; k < m->count; k++) {
        const term *p = &m->data[k - 1], *q = &m->data[k];
        if (!(p->row < q->row || (p->row == q->row && p->col < q->col))) return 0;
    }
    return 1;
}

/* 열별 개수와 시작 위치를 fast_transpose와 따로 다시 센다. size[c - 1], start[c - 1]에 적는다 */
static void sizes_and_starts(const SparseMatrix *a, int *size, int *start)
{
    for (int c = 1; c <= a->cols; c++) {
        size[c - 1] = 0;
        for (int i = 0; i < a->count; i++) if (a->data[i].col == c) size[c - 1]++;
    }
    for (int c = 1; c <= a->cols; c++) {
        start[c - 1] = 0;
        for (int d = 1; d < c; d++) start[c - 1] += size[d - 1];
    }
}

static int same_ints(const int *x, const int *y, int n)
{
    for (int i = 0; i < n; i++) if (x[i] != y[i]) return 0;
    return 1;
}

/* 원래 목록의 i번 원소가 결과의 몇 번 칸에 갔는가 */
static int landed_at(const SparseMatrix *a, const SparseMatrix *b, int i)
{
    for (int j = 0; j < b->count; j++)
        if (b->data[j].row == a->data[i].col && b->data[j].col == a->data[i].row) return j;
    return -1;
}

int main(void)
{
    /* 1. 슬라이드 p.16~18 */
    const int A[4 * 5] = {
        0, 0, 3, 0, 4,
        0, 0, 5, 7, 0,
        0, 0, 0, 0, 0,
        0, 2, 6, 0, 0 };
    SparseMatrix a = from_dense(4, 5, A);
    int size[8], start[8];
    sizes_and_starts(&a, size, start);
    const int wantSize[5] = { 0, 1, 3, 1, 1 }, wantStart[5] = { 0, 0, 1, 4, 5 };
    check(same_ints(size, wantSize, 5), "p.18 1단계 [0, 1, 3, 1, 1]");
    check(same_ints(start, wantStart, 5), "p.18 2단계 [0, 0, 1, 4, 5]");
    SparseMatrix b = fast_transpose(&a);
    const int wantB[6][3] = { {2,4,2}, {3,1,3}, {3,2,5}, {3,4,6}, {4,2,7}, {5,1,4} };
    check(b.rows == 5 && b.cols == 4 && same_list(&b, wantB, 6), "p.17 전치한 목록");

    /* 2. 문서의 추적 표: 꽂히는 칸과, 꽂은 뒤의 시작 위치 */
    const int wantSlot[6] = { 1, 5, 2, 4, 0, 3 };
    const int wantAfter[6][5] = {
        {0, 0, 2, 4, 5}, {0, 0, 2, 4, 6}, {0, 0, 3, 4, 6},
        {0, 0, 3, 5, 6}, {0, 1, 3, 5, 6}, {0, 1, 4, 5, 6} };
    int cur[5];
    for (int c = 0; c < 5; c++) cur[c] = start[c];
    printf("  읽은 원소 -> 꽂는 칸 -> 새 원소 | 그 뒤 시작 위치\n");
    for (int i = 0; i < a.count; i++) {
        int slot = landed_at(&a, &b, i);
        check(slot == wantSlot[i] && slot == cur[a.data[i].col - 1], "추적 표: 꽂는 칸");
        cur[a.data[i].col - 1]++;
        check(same_ints(cur, wantAfter[i], 5), "추적 표: 그 뒤 시작 위치");
        printf("  (%d,%d,%d) -> %d -> (%d,%d,%d) | [%d, %d, %d, %d, %d]\n",
               a.data[i].row, a.data[i].col, a.data[i].value, slot,
               b.data[slot].row, b.data[slot].col, b.data[slot].value,
               cur[0], cur[1], cur[2], cur[3], cur[4]);
    }

    /* 3. 번호만 바꿔 적으면 순서가 깨진다 */
    SparseMatrix swapped = { a.cols, a.rows, a.count, NULL };
    swapped.data = get_memory(a.count * sizeof(term));
    for (int i = 0; i < a.count; i++) {
        swapped.data[i].row = a.data[i].col; swapped.data[i].col = a.data[i].row;
        swapped.data[i].value = a.data[i].value;
    }
    const int wantSwapped[6][3] = { {3,1,3}, {5,1,4}, {3,2,5}, {4,2,7}, {2,4,2}, {3,4,6} };
    check(same_list(&swapped, wantSwapped, 6) && !row_major(&swapped), "번호만 바꾸면 행 우선 순서가 아니다");
    check(row_major(&b), "빠른 전치의 결과는 행 우선 순서다");
    sm_free(&swapped);

    SparseMatrix s = slow_transpose(&a);
    check(same_matrix(&s, &b), "느린 전치 = 빠른 전치 (슬라이드 예)");
    SparseMatrix bb = fast_transpose(&b);
    check(same_matrix(&bb, &a), "두 번 전치하면 원래 목록");
    sm_free(&s); sm_free(&bb); sm_free(&b); sm_free(&a);

    /* 4. 카드 C1: 슬라이드 p.3의 3 x 6 행렬 */
    const int P3[3 * 6] = {
        1, 0, 0, 1, 0, 0,
        0, 0, 2, 0, 0, 1,
        0, 0, 0, 2, 0, 0 };
    SparseMatrix p = from_dense(3, 6, P3);
    sizes_and_starts(&p, size, start);
    const int c1Size[6] = { 1, 0, 1, 2, 0, 1 }, c1Start[6] = { 0, 1, 1, 2, 4, 4 };
    check(same_ints(size, c1Size, 6) && same_ints(start, c1Start, 6), "C1 개수와 시작 위치");
    SparseMatrix pt = fast_transpose(&p);
    const int c1Want[5][3] = { {1,1,1}, {3,2,2}, {4,1,1}, {4,3,2}, {6,2,1} };
    check(pt.rows == 6 && pt.cols == 3 && same_list(&pt, c1Want, 5), "C1 결과");
    sm_free(&pt); sm_free(&p);

    /* 5. 카드 C3: 행 순서가 아닌 목록을 넣으면 한 행 안의 열 순서가 어긋난다 */
    const int unsorted[3][3] = { {2,1,5}, {1,1,3}, {1,2,4} };       /* 2행이 1행보다 먼저 */
    SparseMatrix u = from_list(2, 2, unsorted, 3);
    SparseMatrix ut = fast_transpose(&u);
    const int c3Want[3][3] = { {1,2,5}, {1,1,3}, {2,1,4} };
    check(same_list(&ut, c3Want, 3) && !row_major(&ut), "C3 행 순서가 아니면 결과가 어긋난다");
    sm_free(&ut); sm_free(&u);

    /* 6. 경계 */
    const int Z[2 * 3] = { 0, 0, 0, 0, 0, 0 };
    SparseMatrix z = from_dense(2, 3, Z), zt = fast_transpose(&z);
    check(zt.rows == 3 && zt.cols == 2 && zt.count == 0, "0이 아닌 칸이 없는 행렬");
    sm_free(&zt); sm_free(&z);
    const int One[1] = { 7 };
    SparseMatrix o = from_dense(1, 1, One), ot = fast_transpose(&o);
    const int oneWant[1][3] = { {1,1,7} };
    check(same_list(&ot, oneWant, 1), "1 x 1");
    sm_free(&ot); sm_free(&o);
    const int Row[1 * 4] = { 5, 0, 6, 7 };
    SparseMatrix r = from_dense(1, 4, Row), rt = fast_transpose(&r);
    const int rowWant[3][3] = { {1,1,5}, {3,1,6}, {4,1,7} };
    check(rt.rows == 4 && rt.cols == 1 && same_list(&rt, rowWant, 3), "한 행짜리 -> 한 열짜리");
    SparseMatrix rtt = fast_transpose(&rt);
    check(same_matrix(&rtt, &r), "한 열짜리 -> 한 행짜리");
    sm_free(&rtt); sm_free(&rt); sm_free(&r);

    /* 7. 무작위 행렬 1,000개 */
    for (int trial = 0; trial < 1000; trial++) {
        int rows = 1 + (int)(rnd() % 9), cols = 1 + (int)(rnd() % 9);
        int dense[81], flipped[81];
        int density = (int)(rnd() % 5);
        for (int k = 0; k < rows * cols; k++)
            dense[k] = ((int)(rnd() % 4) < density) ? 1 + (int)(rnd() % 9) : 0;
        for (int i = 0; i < rows; i++)
            for (int j = 0; j < cols; j++)
                flipped[j * rows + i] = dense[i * cols + j];     /* 2차원 배열에서 뒤집기 */
        SparseMatrix m = from_dense(rows, cols, dense);
        SparseMatrix want = from_dense(cols, rows, flipped);
        SparseMatrix fast = fast_transpose(&m), slow = slow_transpose(&m);
        check(same_matrix(&fast, &want), "빠른 전치 = 2차원 전치");
        check(same_matrix(&slow, &want), "느린 전치 = 2차원 전치");
        check(row_major(&fast), "결과가 행 우선 순서");
        SparseMatrix twice = fast_transpose(&fast);
        check(same_matrix(&twice, &m), "두 번 전치 = 원래");
        sm_free(&twice); sm_free(&slow); sm_free(&fast); sm_free(&want); sm_free(&m);
    }

    /* 8. 누수 */
    check(liveBlocks == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
