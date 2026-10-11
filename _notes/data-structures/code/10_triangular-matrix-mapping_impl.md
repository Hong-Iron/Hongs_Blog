---
layout: "note"
title: "10_triangular-matrix-mapping_impl.c"
display_title: "10_triangular-matrix-mapping_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "10"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/triangular-matrix-mapping/"
parent_title: "특수 행렬을 1차원 배열에 담기"
description: "자료구조 · 특수 행렬을 1차원 배열에 담기 구현 코드"
permalink: "/studies/data-structures/code/10_triangular-matrix-mapping_impl/"
---
{% raw %}
[특수 행렬을 1차원 배열에 담기](/Hongs_Blog/studies/data-structures/triangular-matrix-mapping/) 문서의 구현 코드다.

```c
/* 특수 행렬을 1차원 배열에 담기: 대각 행렬, 삼중대각 행렬, 아래삼각 행렬의 위치 식.
 *
 * 문서: 10.특수 행렬을 1차원 배열에 담기 (예시, 세 모양의 칸 수와 위치 식, 카드)
 * 출처: 자료구조 3주차 슬라이드 p.6~7, p.35~41
 * 실행: cc -std=c11 -Wall -Wextra 10_triangular-matrix-mapping_impl.c -o tri_map && ./tri_map
 *
 * 행렬의 줄 번호 i와 칸 번호 j는 슬라이드처럼 1부터 센다: x(i, j), 1 <= i, j <= n.
 * 1차원 배열의 위치는 C 배열처럼 0부터 센다.
 *   대각:      i == j 인 칸만.          위치 = i - 1
 *   삼중대각:  |i - j| <= 1 인 칸만.    위치 = 2i + j - 3
 *   아래삼각:  i >= j 인 칸만.          위치 = i(i - 1)/2 + j - 1
 * 확인용 2차원 배열 full[i][j]는 0번 줄과 0번 칸을 비워 두고 1번부터 쓴다.
 */
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

#define MAXN 12

static int diagonal_index(int i)
{
    return i - 1;
}

static int tridiagonal_index(int i, int j)
{
    return 2 * i + j - 3;
}

static int lower_index(int i, int j)
{
    return i * (i - 1) / 2 + j - 1;
}

/* 아래삼각 행렬을 1차원 배열 하나로 가진 구조 */
typedef struct {
    int n;
    int *element;       /* n(n+1)/2칸 */
} LowerTriangular;

static long blocks_taken = 0, blocks_returned = 0;

static void lower_create(LowerTriangular *m, int n)
{
    m->n = n;
    m->element = calloc((size_t)(n * (n + 1) / 2), sizeof *m->element);
    if (m->element == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(EXIT_FAILURE);
    }
    blocks_taken++;
}

static void lower_destroy(LowerTriangular *m)
{
    free(m->element);
    blocks_returned++;
    m->element = NULL;
}

/* x(i, j)를 읽는다. 대각선 위쪽은 저장하지 않고 0을 돌려준다 */
static int lower_get(const LowerTriangular *m, int i, int j)
{
    if (i < 1 || j < 1 || i > m->n || j > m->n) {
        fprintf(stderr, "줄이나 칸 번호가 범위 밖이다\n");
        exit(EXIT_FAILURE);
    }
    if (i >= j)
        return m->element[lower_index(i, j)];
    return 0;
}

/* x(i, j)에 값을 넣는다. 대각선 위쪽에는 0만 넣을 수 있다. 넣었으면 1, 못 넣었으면 0 */
static int lower_set(LowerTriangular *m, int i, int j, int value)
{
    if (i < 1 || j < 1 || i > m->n || j > m->n)
        return 0;
    if (i >= j) {
        m->element[lower_index(i, j)] = value;
        return 1;
    }
    return value == 0;
}

/* 1. 슬라이드 p.38~41의 4 x 4 예 */
static void slide_example(void)
{
    static const int full[5][5] = {
        {0, 0, 0, 0, 0},
        {0, 1, 0, 0, 0},
        {0, 2, 3, 0, 0},
        {0, 4, 5, 6, 0},
        {0, 7, 8, 9, 10},
    };
    int packed[10], i, j, k = 0;

    /* 행 우선으로 훑되 아래 삼각 밖은 건너뛴다 */
    for (i = 1; i <= 4; i++)
        for (j = 1; j <= 4; j++)
            if (i >= j)
                packed[k++] = full[i][j];

    CHECK(k == 10 && 4 * (4 + 1) / 2 == 10, "4 x 4 아래삼각의 칸 수는 10");
    for (k = 0; k < 10; k++)
        CHECK(packed[k] == k + 1, "p.40: 1, 2, ..., 10 순서로 담긴다");
    CHECK(lower_index(1, 1) == 0 && lower_index(2, 1) == 1 && lower_index(3, 1) == 3 && lower_index(4, 1) == 6,
          "p.41: 줄의 첫 칸 위치는 0, 1, 3, 6");
    for (i = 1; i <= 4; i++)
        for (j = 1; j <= i; j++)
            CHECK(packed[lower_index(i, j)] == full[i][j], "위치 식이 맞는 값을 찾는다");
    CHECK(lower_index(3, 2) == 4 && packed[4] == 5, "x(3, 2) = 5는 4번 칸");
    CHECK(lower_index(4, 3) == 8 && packed[8] == 9, "x(4, 3) = 9는 8번 칸");
    printf("[OK] 4 x 4 아래삼각: 1..10 순서, 줄의 첫 칸 위치 0 1 3 6\n");
}

/* 2. n = 1..12 모두: 세 모양의 칸 수와 위치 식을 2차원 배열과 견준다 */
static void exhaustive(void)
{
    int n, cells = 0;

    for (n = 1; n <= MAXN; n++) {
        int full[MAXN + 1][MAXN + 1];
        int packed[MAXN * (MAXN + 1) / 2], seen[MAXN * (MAXN + 1) / 2];
        int i, j, k, count;

        /* --- 아래삼각 --- */
        memset(full, 0, sizeof full);
        for (i = 1; i <= n; i++)
            for (j = 1; j <= i; j++)
                full[i][j] = 100 * i + j;
        k = 0;
        for (i = 1; i <= n; i++)
            for (j = 1; j <= n; j++)
                if (i >= j)
                    packed[k++] = full[i][j];
        count = n * (n + 1) / 2;
        CHECK(k == count, "아래삼각의 칸 수 = n(n+1)/2");
        memset(seen, 0, sizeof seen);
        for (i = 1; i <= n; i++) {
            CHECK(lower_index(i, 1) == i * (i - 1) / 2, "i번 줄 앞에는 1 + 2 + ... + (i-1) = i(i-1)/2칸이 있다");
            for (j = 1; j <= i; j++) {
                int p = lower_index(i, j);
                CHECK(p >= 0 && p < count && packed[p] == full[i][j], "아래삼각 위치 식");
                CHECK(p == (i - 1) * i / 2 + (j - 1), "0부터 세는 번호 (i-1, j-1)로 쓰면 i'(i'+1)/2 + j'");
                seen[p]++;
                cells++;
            }
        }
        for (k = 0; k < count; k++)
            CHECK(seen[k] == 1, "아래삼각: 위치가 겹치지도 비지도 않는다");

        /* --- 대각 --- */
        memset(full, 0, sizeof full);
        for (i = 1; i <= n; i++)
            full[i][i] = 7 * i;
        k = 0;
        for (i = 1; i <= n; i++)
            for (j = 1; j <= n; j++)
                if (i == j)
                    packed[k++] = full[i][j];
        CHECK(k == n, "대각의 칸 수 = n");
        for (i = 1; i <= n; i++) {
            CHECK(packed[diagonal_index(i)] == full[i][i], "대각 위치 식");
            cells++;
        }

        /* --- 삼중대각 --- */
        memset(full, 0, sizeof full);
        for (i = 1; i <= n; i++)
            for (j = 1; j <= n; j++)
                if (abs(i - j) <= 1)
                    full[i][j] = 100 * i + j;
        k = 0;
        for (i = 1; i <= n; i++)
            for (j = 1; j <= n; j++)
                if (abs(i - j) <= 1)
                    packed[k++] = full[i][j];
        count = 3 * n - 2;
        CHECK(k == count, "삼중대각의 칸 수 = 3n - 2");
        memset(seen, 0, sizeof seen);
        for (i = 1; i <= n; i++)
            for (j = 1; j <= n; j++)
                if (abs(i - j) <= 1) {
                    int p = tridiagonal_index(i, j);
                    CHECK(p >= 0 && p < count && packed[p] == full[i][j], "삼중대각 위치 식");
                    seen[p]++;
                    cells++;
                }
        for (k = 0; k < count; k++)
            CHECK(seen[k] == 1, "삼중대각: 위치가 겹치지도 비지도 않는다");
    }
    printf("[OK] n = 1..12: 대각 n칸, 삼중대각 3n - 2칸, 아래삼각 n(n+1)/2칸. 위치 식을 %d칸에서 확인\n", cells);
}

/* 3. 0이 아닐 수 있는 칸의 비율: 슬라이드 p.6 */
static void ratios(void)
{
    int n = 100;
    int diag = n, tri = 3 * n - 2, lower = n * (n + 1) / 2, all = n * n;

    CHECK(diag == 100 && tri == 298 && lower == 5050 && all == 10000, "n = 100: 100, 298, 5050, 10000칸");
    /* 비율을 정수 비교로: 100/10000 = 1%, 298/10000 = 2.98%, 5050/10000 = 50.5% */
    CHECK(diag * 100 == all, "대각 1/n = 1%");
    CHECK(tri * 10000 == 298 * all, "삼중대각 3/n - 2/n^2 = 2.98%");
    CHECK(lower * 1000 == 505 * all, "아래삼각 (n+1)/(2n) = 50.5%");
    CHECK(2 * lower > all, "아래삼각은 늘 절반을 넘는다");
    CHECK(4 * 500 * 500 == 1000000 && 4 * (500 * 501 / 2) == 501000, "500 x 500, 칸마다 4바이트: 2차원 1,000,000바이트, 아래삼각 501,000바이트");
    printf("[OK] n = 100일 때 채워진 비율: 대각 1%%, 삼중대각 2.98%%, 아래삼각 50.5%%\n");
}

/* 4. 읽기와 쓰기 함수 */
static void get_and_set(void)
{
    LowerTriangular m;
    int i, j, v = 1, ok = 1;

    lower_create(&m, 4);
    for (i = 1; i <= 4; i++)
        for (j = 1; j <= i; j++)
            if (!lower_set(&m, i, j, v++))
                ok = 0;
    CHECK(ok, "아래 삼각의 칸에는 넣을 수 있다");
    CHECK(lower_get(&m, 3, 2) == 5 && lower_get(&m, 4, 4) == 10 && lower_get(&m, 1, 1) == 1, "x(3,2) = 5, x(4,4) = 10");
    CHECK(lower_get(&m, 2, 3) == 0 && lower_get(&m, 1, 4) == 0, "대각선 위쪽을 읽으면 0");
    CHECK(lower_set(&m, 1, 4, 0) == 1, "대각선 위쪽에 0을 넣는 것은 된다");
    CHECK(lower_set(&m, 1, 4, 9) == 0, "대각선 위쪽에 0이 아닌 값은 넣지 못한다");
    CHECK(lower_get(&m, 1, 4) == 0, "넣지 못했으니 여전히 0");
    for (i = 0; i < 10; i++)
        CHECK(m.element[i] == i + 1, "속의 1차원 배열은 1..10");
    lower_destroy(&m);
    printf("[OK] 아래삼각 구조: 10칸만 잡고 x(i, j)를 읽고 쓴다\n");
}

static void cards(void)
{
    CHECK(lower_index(4, 2) == 7, "C1: n = 5에서 x(4, 2)의 위치 7");
    CHECK(5 * 6 / 2 == 15 && 5 * 5 == 25, "C1: 15칸 대 25칸");
    CHECK(lower_index(5, 1) == 10 && lower_index(5, 5) == 14, "5번 줄은 10번 칸부터 14번 칸까지");
    CHECK(tridiagonal_index(3, 4) == 7 && tridiagonal_index(1, 1) == 0 && tridiagonal_index(2, 1) == 2, "삼중대각 x(3, 4)의 위치 7");
    CHECK(3 * 5 - 2 == 13 && tridiagonal_index(5, 5) == 12, "n = 5 삼중대각은 13칸, 마지막 칸은 12번");
    printf("[OK] 카드: 아래삼각 x(4, 2)는 7번 칸, 삼중대각 x(3, 4)는 7번 칸\n");
}

int main(void)
{
    slide_example();
    exhaustive();
    ratios();
    get_and_set();
    cards();

    CHECK(blocks_taken == blocks_returned, "받은 배열을 모두 돌려줬다");

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
