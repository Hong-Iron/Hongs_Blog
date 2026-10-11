---
layout: "note"
title: "12_sparse-transpose-ladder_p4.c"
display_title: "12_sparse-transpose-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "12"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/sparse-transpose-ladder/"
parent_title: "희소 행렬 전치 예제 사다리"
description: "자료구조 · 희소 행렬 전치 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/12_sparse-transpose-ladder_p4/"
---
{% raw %}
[희소 행렬 전치 예제 사다리](/Hongs_Blog/studies/data-structures/sparse-transpose-ladder/) 문서의 문제 4 풀이 코드다.

```c
/* 희소 행렬 전치 예제 사다리: 문제 1 ~ 4의 답을 확인한다.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/12.희소 행렬 전치 예제 사다리.md
 * 세 단계 전치는 3.개념집/12_sparse-matrix-transpose_impl.c에서 필요한 부분을 옮겨 적었다.
 * 실행: cc -std=c11 -Wall -Wextra 12_sparse-transpose-ladder_p4.c -o ladder && ./ladder
 * 번호: 행·열 번호는 1부터, 목록의 칸 번호는 0부터 센다.
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

typedef struct { int row, col, value; } term;

#define MAX_T 16
#define MAX_COLS 8

/* a[0..t-1](열 수 cols)을 전치해 b에 적는다. size[c], start[c](c는 1부터)와
 * 원소마다 꽂힌 칸 slot[i]도 돌려준다. 고리가 돈 횟수를 돌려준다 */
static int transpose(const term *a, int t, int cols, term *b, int *size, int *start, int *slot)
{
    int steps = 0;
    int cur[MAX_COLS + 1];
    for (int c = 1; c <= cols; c++) { size[c] = 0; steps++; }
    for (int i = 0; i < t; i++) { size[a[i].col]++; steps++; }
    start[1] = 0;
    for (int c = 2; c <= cols; c++) { start[c] = start[c - 1] + size[c - 1]; steps++; }
    for (int c = 1; c <= cols; c++) cur[c] = start[c];
    for (int i = 0; i < t; i++) {
        int j = cur[a[i].col]++;
        slot[i] = j;
        b[j].row = a[i].col; b[j].col = a[i].row; b[j].value = a[i].value;
        steps++;
    }
    return steps;
}

static int same_terms(const term *x, const int (*want)[3], int n)
{
    for (int k = 0; k < n; k++)
        if (x[k].row != want[k][0] || x[k].col != want[k][1] || x[k].value != want[k][2]) return 0;
    return 1;
}

static int same_ints(const int *x, const int *want, int n)
{
    for (int i = 0; i < n; i++) if (x[i] != want[i]) return 0;
    return 1;
}

/* 2차원 배열(행 우선으로 편 것)에서 목록을 만든다 */
static int from_dense(int rows, int cols, const int *d, term *out)
{
    int t = 0;
    for (int i = 1; i <= rows; i++)
        for (int j = 1; j <= cols; j++)
            if (d[(i - 1) * cols + (j - 1)] != 0) {
                out[t].row = i; out[t].col = j; out[t].value = d[(i - 1) * cols + (j - 1)]; t++;
            }
    return t;
}

/* 결과 목록이 2차원 배열을 뒤집은 것과 같은가 */
static int matches_flipped(int rows, int cols, const int *d, const term *b, int t)
{
    int flipped[64];
    term want[MAX_T];
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++) flipped[j * rows + i] = d[i * cols + j];
    if (from_dense(cols, rows, flipped, want) != t) return 0;
    for (int k = 0; k < t; k++)
        if (want[k].row != b[k].row || want[k].col != b[k].col || want[k].value != b[k].value) return 0;
    return 1;
}

static void print_list(const char *name, const term *x, int t)
{
    printf("  %s:", name);
    for (int k = 0; k < t; k++) printf(" (%d,%d,%d)", x[k].row, x[k].col, x[k].value);
    printf("\n");
}

int main(void)
{
    term a[MAX_T], b[MAX_T];
    int size[MAX_COLS + 1], start[MAX_COLS + 1], slot[MAX_T], t, steps;

    /* 문제 1: 슬라이드의 4 x 5 행렬 */
    const int D1[4 * 5] = { 0,0,3,0,4,  0,0,5,7,0,  0,0,0,0,0,  0,2,6,0,0 };
    t = from_dense(4, 5, D1, a);
    steps = transpose(a, t, 5, b, size, start, slot);
    const int s1[5] = { 0, 1, 3, 1, 1 }, st1[5] = { 0, 0, 1, 4, 5 }, sl1[6] = { 1, 5, 2, 4, 0, 3 };
    const int w1[6][3] = { {2,4,2}, {3,1,3}, {3,2,5}, {3,4,6}, {4,2,7}, {5,1,4} };
    check(t == 6 && same_ints(size + 1, s1, 5) && same_ints(start + 1, st1, 5) && same_ints(slot, sl1, 6), "문제 1: 개수, 시작 칸, 꽂는 칸");
    check(same_terms(b, w1, 6) && matches_flipped(4, 5, D1, b, t) && steps == 21, "문제 1: 결과");
    print_list("문제 1", b, t);

    /* 문제 2: 4 x 4 */
    const int D2[4 * 4] = { 0,0,2,0,  1,0,4,0,  0,0,0,0,  0,7,9,3 };
    t = from_dense(4, 4, D2, a);
    const int a2[6][3] = { {1,3,2}, {2,1,1}, {2,3,4}, {4,2,7}, {4,3,9}, {4,4,3} };
    check(t == 6 && same_terms(a, a2, 6), "문제 2: 원래 목록");
    transpose(a, t, 4, b, size, start, slot);
    const int s2[4] = { 1, 1, 3, 1 }, st2[4] = { 0, 1, 2, 5 }, sl2[6] = { 2, 0, 3, 1, 4, 5 };
    const int w2[6][3] = { {1,2,1}, {2,4,7}, {3,1,2}, {3,2,4}, {3,4,9}, {4,4,3} };
    check(same_ints(size + 1, s2, 4) && same_ints(start + 1, st2, 4) && same_ints(slot, sl2, 6), "문제 2: 개수, 시작 칸, 꽂는 칸");
    check(same_terms(b, w2, 6) && matches_flipped(4, 4, D2, b, t), "문제 2: 결과");
    print_list("문제 2", b, t);

    /* 문제 3: 3 x 5 */
    const int D3[3 * 5] = { 6,0,0,0,1,  0,0,3,0,0,  2,0,8,0,5 };
    t = from_dense(3, 5, D3, a);
    const int a3[6][3] = { {1,1,6}, {1,5,1}, {2,3,3}, {3,1,2}, {3,3,8}, {3,5,5} };
    check(t == 6 && same_terms(a, a3, 6), "문제 3: 원래 목록");
    transpose(a, t, 5, b, size, start, slot);
    const int s3[5] = { 2, 0, 2, 0, 2 }, st3[5] = { 0, 2, 2, 4, 4 }, sl3[6] = { 0, 4, 2, 1, 3, 5 };
    const int w3[6][3] = { {1,1,6}, {1,3,2}, {3,2,3}, {3,3,8}, {5,1,1}, {5,3,5} };
    check(same_ints(size + 1, s3, 5) && same_ints(start + 1, st3, 5) && same_ints(slot, sl3, 6), "문제 3: 개수, 시작 칸, 꽂는 칸");
    check(same_terms(b, w3, 6) && matches_flipped(3, 5, D3, b, t), "문제 3: 결과");
    print_list("문제 3", b, t);

    /* 문제 4: 5 x 3 행렬의 목록만 주어진다 */
    const int a4[6][3] = { {1,2,4}, {2,1,7}, {3,2,1}, {3,3,9}, {5,1,6}, {5,3,2} };
    t = 6;
    for (int k = 0; k < t; k++) { a[k].row = a4[k][0]; a[k].col = a4[k][1]; a[k].value = a4[k][2]; }
    steps = transpose(a, t, 3, b, size, start, slot);
    const int s4[3] = { 2, 2, 2 }, st4[3] = { 0, 2, 4 }, sl4[6] = { 2, 0, 3, 4, 1, 5 };
    const int w4[6][3] = { {1,2,7}, {1,5,6}, {2,1,4}, {2,3,1}, {3,3,9}, {3,5,2} };
    check(same_ints(size + 1, s4, 3) && same_ints(start + 1, st4, 3) && same_ints(slot, sl4, 6), "문제 4: 개수, 시작 칸, 꽂는 칸");
    check(same_terms(b, w4, 6), "문제 4: 결과");
    const int D4[5 * 3] = { 0,4,0,  7,0,0,  0,1,9,  0,0,0,  6,0,2 };
    term fromD[MAX_T];
    check(from_dense(5, 3, D4, fromD) == 6 && same_terms(fromD, a4, 6) && matches_flipped(5, 3, D4, b, t), "문제 4: 2차원 배열로 되살려 뒤집은 것과 같다");
    check(steps == 2 * 6 + 2 * 3 - 1 && steps == 17, "문제 4: 고리가 도는 횟수 2t + 2n - 1 = 17");
    check(5 * 3 == 15 && 3 * 6 == 18, "문제 4: 2차원 배열 15번, 열마다 훑기 18번");
    print_list("문제 4", b, t);

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
