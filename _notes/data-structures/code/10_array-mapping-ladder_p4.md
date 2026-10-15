---
layout: "note"
title: "10_array-mapping-ladder_p4.c"
display_title: "10_array-mapping-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "10"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/array-mapping-ladder/"
parent_title: "배열 위치 공식 예제 사다리"
description: "자료구조 · 배열 위치 공식 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/10_array-mapping-ladder_p4/"
---
{% raw %}
[배열 위치 공식 예제 사다리](/Hongs_Blog/studies/data-structures/array-mapping-ladder/) 문서의 문제 4 풀이 코드다.

```c
/* 배열 위치 공식 예제 사다리: 문제 1~4의 답을 실제 배열에 견주어 확인한다.
 *
 * 문서: 4.연습문제/10.배열 위치 공식 예제 사다리
 * 실행: cc -std=c11 -Wall -Wextra 10_array-mapping-ladder_p4.c -o map_ladder && ./map_ladder
 *
 * 문제 1, 2의 2차원 배열은 줄과 칸을 0부터 센다. 문제 3, 4의 행렬은 1부터 센다.
 * 1차원 배열의 위치는 늘 0부터 센다.
 */
#include <stdio.h>
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

static int row_major(int i, int j, int c) { return i * c + j; }
static int column_major(int i, int j, int r) { return j * r + i; }
static int lower_index(int i, int j) { return i * (i - 1) / 2 + j - 1; }

/* 문제 4의 답: 위삼각 행렬(i <= j)을 행 우선으로 담았을 때 x(i, j)의 위치 */
static int upper_index(int i, int j, int n) { return (i - 1) * (2 * n - i + 2) / 2 + (j - i); }

int main(void)
{
    /* 문제 1: 4줄 6칸, 행 우선, x[3][2] */
    {
        int x[4][6], y[24], i, j, k = 0;

        for (i = 0; i < 4; i++)
            for (j = 0; j < 6; j++)
                x[i][j] = 10 * i + j;
        for (i = 0; i < 4; i++)
            for (j = 0; j < 6; j++)
                y[k++] = x[i][j];
        CHECK(3 * 6 == 18, "앞에 있는 줄 3개의 칸 수 18");
        CHECK(row_major(3, 2, 6) == 20 && y[20] == x[3][2], "x[3][2]는 20번 칸");
        CHECK(2000 + 20 * 4 == 2080, "시작이 2000번지, 칸이 4바이트면 2080번지");
        CHECK(20 / 6 == 3 && 20 % 6 == 2, "거꾸로: 20번 칸은 x[3][2]");
        printf("[OK] 문제 1: 행 우선 위치 20, 주소 2080\n");
    }

    /* 문제 2: 같은 배열, 열 우선, x[3][2] */
    {
        int x[4][6], y[24], i, j, k = 0;

        for (i = 0; i < 4; i++)
            for (j = 0; j < 6; j++)
                x[i][j] = 10 * i + j;
        for (j = 0; j < 6; j++)
            for (i = 0; i < 4; i++)
                y[k++] = x[i][j];
        CHECK(2 * 4 == 8, "앞에 있는 칸(세로줄) 2개의 원소 수 8");
        CHECK(column_major(3, 2, 4) == 11 && y[11] == x[3][2], "x[3][2]는 11번 칸");
        CHECK(2000 + 11 * 4 == 2044, "주소는 2044번지");
        printf("[OK] 문제 2: 열 우선 위치 11, 주소 2044\n");
    }

    /* 문제 3: 6 x 6 아래삼각, x(5, 3) */
    {
        int full[7][7], packed[21], i, j, k = 0;

        memset(full, 0, sizeof full);
        for (i = 1; i <= 6; i++)
            for (j = 1; j <= i; j++)
                full[i][j] = 10 * i + j;
        for (i = 1; i <= 6; i++)
            for (j = 1; j <= 6; j++)
                if (i >= j)
                    packed[k++] = full[i][j];
        CHECK(k == 21 && 6 * 7 / 2 == 21, "칸 수 21");
        CHECK(1 + 2 + 3 + 4 == 10 && 5 * 4 / 2 == 10, "5번 줄 앞의 칸 수 10");
        CHECK(lower_index(5, 3) == 12 && packed[12] == full[5][3], "x(5, 3)은 12번 칸");
        CHECK(36 - 21 == 15, "2차원 배열보다 15칸 적다");
        printf("[OK] 문제 3: 아래삼각 위치 12, 칸 수 21\n");
    }

    /* 문제 4: 위삼각 행렬의 위치 식 */
    {
        int n, cells = 0;

        for (n = 1; n <= MAXN; n++) {
            int full[MAXN + 1][MAXN + 1], packed[MAXN * (MAXN + 1) / 2], seen[MAXN * (MAXN + 1) / 2];
            int i, j, k = 0, count = n * (n + 1) / 2;

            memset(full, 0, sizeof full);
            memset(seen, 0, sizeof seen);
            for (i = 1; i <= n; i++)
                for (j = i; j <= n; j++)
                    full[i][j] = 100 * i + j;
            for (i = 1; i <= n; i++)
                for (j = 1; j <= n; j++)
                    if (i <= j)
                        packed[k++] = full[i][j];
            CHECK(k == count, "위삼각의 칸 수도 n(n+1)/2");
            for (i = 1; i <= n; i++) {
                int before = 0, t;
                for (t = 1; t < i; t++)
                    before += n - t + 1;                    /* t번 줄에는 n - t + 1칸이 있다 */
                CHECK(before == (i - 1) * (2 * n - i + 2) / 2, "i번 줄 앞의 칸 수 = (i-1)(2n-i+2)/2");
                for (j = i; j <= n; j++) {
                    int p = upper_index(i, j, n);
                    CHECK(p >= 0 && p < count && packed[p] == full[i][j], "위삼각 위치 식");
                    seen[p]++;
                    cells++;
                }
            }
            for (k = 0; k < count; k++)
                CHECK(seen[k] == 1, "위치가 겹치지도 비지도 않는다");
        }
        CHECK(upper_index(3, 4, 4) == 8, "n = 4에서 x(3, 4)는 8번 칸");
        CHECK(upper_index(1, 1, 4) == 0 && upper_index(2, 2, 4) == 4 && upper_index(3, 3, 4) == 7 && upper_index(4, 4, 4) == 9,
              "n = 4에서 줄의 첫 칸 위치는 0, 4, 7, 9");
        printf("[OK] 문제 4: 위삼각 위치 (i-1)(2n-i+2)/2 + (j-i). n = 1..12의 %d칸에서 확인, n = 4의 x(3, 4)는 8\n", cells);
    }

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
