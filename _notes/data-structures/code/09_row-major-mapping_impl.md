---
layout: "note"
title: "09_row-major-mapping_impl.c"
display_title: "09_row-major-mapping_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "09"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/row-major-mapping/"
parent_title: "행 우선 배치와 열 우선 배치"
description: "자료구조 · 행 우선 배치와 열 우선 배치 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/09_row-major-mapping_impl/"
---
{% raw %}
[행 우선 배치와 열 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/) 문서의 구현 코드다.

```c
/* 행 우선 배치와 열 우선 배치: 2차원 배열을 메모리에 놓는 세 가지 모양과 위치 식.
 *
 * 문서: 09.행 우선 배치와 열 우선 배치 (예시, 위치 식, 배열의 배열, 카드)
 * 출처: 자료구조 3주차 슬라이드 p.24~34
 * 실행: cc -std=c11 -Wall -Wextra 09_row-major-mapping_impl.c -o row_major && ./row_major
 *
 * 줄 수 r, 칸 수 c, 줄 번호 i, 칸 번호 j는 모두 0부터 센다.
 *   행 우선 위치 = i * c + j        열 우선 위치 = j * r + i
 */
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int fails = 0;

#define CHECK(cond, msg)                                              \
    do {                                                              \
        if (!(cond)) {                                                \
            printf("[FAIL] %s (%d번째 줄)\n", (msg), __LINE__);        \
            fails++;                                                  \
        }                                                             \
    } while (0)

#define MAXD 6

static long blocks_taken = 0, blocks_returned = 0;

static void *take(size_t bytes)
{
    void *p = malloc(bytes);
    if (p == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(EXIT_FAILURE);
    }
    blocks_taken++;
    return p;
}

static void give_back(void *p)
{
    free(p);
    blocks_returned++;
}

static int row_major(int i, int j, int c)
{
    return i * c + j;
}

static int column_major(int i, int j, int r)
{
    return j * r + i;
}

/* 배열의 배열: 줄마다 따로 받은 배열과, 그 주소를 모은 배열 하나 */
static int **make_array_of_arrays(int r, int c)
{
    int **x = take((size_t)r * sizeof *x);          /* 줄 주소 r개 */
    int i;
    for (i = 0; i < r; i++)
        x[i] = take((size_t)c * sizeof **x);        /* i번 줄의 칸 c개 */
    return x;
}

static void free_array_of_arrays(int **x, int r)
{
    int i;
    for (i = 0; i < r; i++)
        give_back(x[i]);
    give_back(x);
}

/* 1. 슬라이드의 3 x 4 예 */
static void slide_example(void)
{
    char a[3][4] = {
        {'a', 'b', 'c', 'd'},
        {'e', 'f', 'g', 'h'},
        {'i', 'j', 'k', 'l'},
    };
    char by_rows[13], by_columns[13], flat[13];
    int i, j, k;

    /* 줄 단위로 모으기: 줄 안에서는 왼쪽에서 오른쪽, 줄은 위에서 아래 */
    k = 0;
    for (i = 0; i < 3; i++)
        for (j = 0; j < 4; j++)
            by_rows[k++] = a[i][j];
    by_rows[12] = '\0';

    /* 칸 단위로 모으기: 칸 안에서는 위에서 아래, 칸은 왼쪽에서 오른쪽 */
    k = 0;
    for (j = 0; j < 4; j++)
        for (i = 0; i < 3; i++)
            by_columns[k++] = a[i][j];
    by_columns[12] = '\0';

    CHECK(strcmp(by_rows, "abcdefghijkl") == 0, "p.29: 행 우선으로 모으면 abcdefghijkl");
    CHECK(strcmp(by_columns, "aeibfjcgkdhl") == 0, "p.33: 열 우선으로 모으면 aeibfjcgkdhl");

    /* C의 char a[3][4]는 메모리에 행 우선 한 덩어리로 놓인다 */
    memcpy(flat, a, sizeof a);
    flat[12] = '\0';
    CHECK(sizeof a == 12, "a[3][4]는 12칸짜리 한 덩어리");
    CHECK(strcmp(flat, by_rows) == 0, "a의 메모리를 그대로 읽으면 행 우선 순서");

    for (i = 0; i < 3; i++)
        for (j = 0; j < 4; j++) {
            CHECK(by_rows[row_major(i, j, 4)] == a[i][j], "y[i*c + j] == x[i][j]");
            CHECK(by_columns[column_major(i, j, 3)] == a[i][j], "y[j*r + i] == x[i][j]");
        }
    CHECK(row_major(2, 1, 4) == 9 && by_rows[9] == 'j', "x[2][1] = j 는 행 우선 9번 칸");
    CHECK(column_major(2, 1, 3) == 5 && by_columns[5] == 'j', "x[2][1] = j 는 열 우선 5번 칸");
    CHECK(row_major(1, 0, 4) == 4 && row_major(2, 0, 4) == 8, "p.30: 줄의 첫 칸은 0, c, 2c");
    printf("[OK] 3 x 4 예: 행 우선 %s, 열 우선 %s\n", by_rows, by_columns);
}

/* 2. r, c <= 6 모두: 위치 식을 실제 2차원 배열의 주소와 값에 견준다 */
static void exhaustive(void)
{
    static int a[MAXD][MAXD];       /* 줄마다 MAXD칸을 잡아 두고 왼쪽 위 r x c만 쓴다 */
    int r, c, i, j, cases = 0;

    for (r = 1; r <= MAXD; r++) {
        for (c = 1; c <= MAXD; c++) {
            int rows[MAXD * MAXD], cols[MAXD * MAXD], seen_r[MAXD * MAXD], seen_c[MAXD * MAXD];
            int *dense = take((size_t)(r * c) * sizeof *dense);    /* r x c를 한 덩어리로 */
            int **aoa = make_array_of_arrays(r, c);                /* r x c를 배열의 배열로 */
            int k;

            for (i = 0; i < r; i++)
                for (j = 0; j < c; j++) {
                    a[i][j] = 100 * i + j;
                    dense[row_major(i, j, c)] = 100 * i + j;
                    aoa[i][j] = 100 * i + j;
                }
            k = 0;
            for (i = 0; i < r; i++)
                for (j = 0; j < c; j++)
                    rows[k++] = a[i][j];
            k = 0;
            for (j = 0; j < c; j++)
                for (i = 0; i < r; i++)
                    cols[k++] = a[i][j];
            memset(seen_r, 0, sizeof seen_r);
            memset(seen_c, 0, sizeof seen_c);

            for (i = 0; i < r; i++) {
                for (j = 0; j < c; j++) {
                    int pr = row_major(i, j, c), pc = column_major(i, j, r);
                    CHECK(pr >= 0 && pr < r * c && pc >= 0 && pc < r * c, "위치가 0..rc-1 안이다");
                    CHECK(rows[pr] == a[i][j] && cols[pc] == a[i][j], "두 위치 식이 맞는 값을 찾는다");
                    CHECK(dense[pr] == aoa[i][j], "한 덩어리와 배열의 배열이 같은 값을 준다");
                    CHECK(pr / c == i && pr % c == j, "행 우선 위치 p에서 i = p / c, j = p % c");
                    CHECK(pc / r == j && pc % r == i, "열 우선 위치 p에서 j = p / r, i = p % r");
                    /* 한 덩어리 안에서 칸의 주소 = 시작 주소 + (i*c + j) x 칸 크기 */
                    CHECK((uintptr_t)&dense[pr] - (uintptr_t)dense == (uintptr_t)pr * sizeof(int), "한 덩어리의 주소 식");
                    seen_r[pr]++;
                    seen_c[pc]++;
                    cases++;
                }
            }
            for (k = 0; k < r * c; k++)
                CHECK(seen_r[k] == 1 && seen_c[k] == 1, "서로 다른 칸은 서로 다른 위치로 가고 빈 위치가 없다");

            free_array_of_arrays(aoa, r);
            give_back(dense);
        }
    }

    /* C의 int a[R][C]: 칸의 주소 = 배열의 시작 + (i*C + j) x sizeof(int) */
    for (i = 0; i < MAXD; i++)
        for (j = 0; j < MAXD; j++)
            CHECK((uintptr_t)&a[i][j] - (uintptr_t)a == (uintptr_t)(i * MAXD + j) * sizeof(int), "int a[6][6]의 주소 식");

    printf("[OK] r, c = 1..6의 모든 칸 %d개: 행 우선 i*c + j, 열 우선 j*r + i, 거꾸로 구하기\n", cases);
}

/* 3. 덩어리 수와 덤으로 드는 자리 */
static void overhead(void)
{
    int r = 3, c = 4;
    long before = blocks_taken;
    int **aoa = make_array_of_arrays(r, c);
    long aoa_blocks = blocks_taken - before;
    int *dense;
    long dense_blocks;

    before = blocks_taken;
    dense = take((size_t)(r * c) * sizeof *dense);
    dense_blocks = blocks_taken - before;

    CHECK(aoa_blocks == r + 1, "배열의 배열: 덩어리 r + 1 = 4개 (크기 3, 4, 4, 4)");
    CHECK(dense_blocks == 1, "한 덩어리: 1개");
    CHECK(r * 4 == 12, "p.27: 주소 하나가 4바이트면 덤은 줄 수 x 4 = 12바이트");
    CHECK(4 + 4 == 8, "p.31: 한 덩어리의 덤은 시작 주소 4 + 칸 수 4 = 8바이트");
    CHECK((size_t)r * sizeof(int *) == 24, "이 기계는 주소 하나가 8바이트라 배열의 배열의 덤은 24바이트");

    /* p.24의 둘째 선언은 3 x 4 배열이 아니다 */
    CHECK(sizeof(int) * 4 == 16 && sizeof(int[3][4]) == 48, "malloc(sizeof(int) * 4)는 16바이트, int arr[3][4]는 48바이트");

    free_array_of_arrays(aoa, r);
    give_back(dense);
    printf("[OK] 3 x 4: 배열의 배열은 덩어리 %ld개, 한 덩어리는 %ld개. 이 기계의 주소 크기 %zu바이트\n",
           aoa_blocks, dense_blocks, sizeof(int *));
}

/* 4. 줄마다 길이가 다른 배열은 배열의 배열로만 만든다 */
static void ragged(void)
{
    int n = 4, i, j, v = 1;
    int **x = take((size_t)n * sizeof *x);

    for (i = 0; i < n; i++) {
        x[i] = take((size_t)(i + 1) * sizeof **x);      /* i번 줄은 i + 1칸 */
        for (j = 0; j <= i; j++)
            x[i][j] = v++;
    }
    CHECK(x[0][0] == 1 && x[1][1] == 3 && x[2][2] == 6 && x[3][0] == 7 && x[3][3] == 10, "줄 길이 1, 2, 3, 4에 1..10");
    for (i = 0; i < n; i++)
        give_back(x[i]);
    give_back(x);
    printf("[OK] 줄 길이가 1, 2, 3, 4인 배열의 배열\n");
}

static void cards(void)
{
    CHECK(row_major(3, 4, 7) == 25, "C1: 5 x 7에서 x[3][4]의 행 우선 위치 25");
    CHECK(column_major(3, 4, 5) == 23, "C1: 열 우선 위치 23");
    CHECK(19 / 7 == 2 && 19 % 7 == 5 && row_major(2, 5, 7) == 19, "C3: 5 x 7 행 우선 19번 칸은 x[2][5]");
    CHECK(19 / 5 == 3 && 19 % 5 == 4 && column_major(4, 3, 5) == 19, "C3: 5 x 7 열 우선 19번 칸은 x[4][3]");
    CHECK(1000 + (2 * 4 + 1) * 4 == 1036, "예제: 시작 1000번지, int 4바이트, 3 x 4에서 x[2][1]은 1036번지");
    printf("[OK] 카드: 5 x 7의 x[3][4]는 행 우선 25, 열 우선 23. 19번 칸은 행 우선이면 x[2][5], 열 우선이면 x[4][3]\n");
}

int main(void)
{
    slide_example();
    exhaustive();
    overhead();
    ragged();
    cards();

    CHECK(blocks_taken == blocks_returned, "받은 덩어리를 모두 돌려줬다");
    printf("[OK] 받은 덩어리 %ld개, 돌려준 덩어리 %ld개\n", blocks_taken, blocks_returned);

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
