---
layout: "note"
title: "39_floyd-path-output_impl.c"
display_title: "39_floyd-path-output_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "39"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/floyd-path-output/"
parent_title: "플로이드 알고리즘의 경로 출력"
description: "자료구조 · 플로이드 알고리즘의 경로 출력 구현 코드"
permalink: "/studies/data-structures/code/39_floyd-path-output_impl/"
---
{% raw %}
[플로이드 알고리즘의 경로 출력](/Hongs_Blog/studies/data-structures/floyd-path-output/) 문서의 구현 코드다.

```c
/* 플로이드 알고리즘의 경로 출력: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/39.플로이드 알고리즘의 경로 출력.md
 * 출처: 자료구조 12주차 슬라이드 p.61~70. 반복문(p.61)과 outputPath(p.70)를 한 파일로 돌아가게 옮겼다.
 * 실행: cc -std=c11 -Wall -Wextra 39_floyd-path-output_impl.c -o floyd && ./floyd
 * 정점 번호는 슬라이드처럼 1부터 n까지다. 배열의 0번 칸은 쓰지 않는다.
 *
 * 확인하는 것
 *   1. 슬라이드의 정점 8개 그래프: 끝난 뒤의 비용 표(p.63)와 kay 표(p.64) 64칸씩.
 *   2. outputPath(1, 7)이 4 2 5 8 6 7을 찍는다. 앞에 1을 붙이면 길 1 4 2 5 8 6 7, 길이 14.
 *   3. 모든 (i, j)에서 찍힌 길의 간선이 처음 그래프에 있고, 그 비용의 합이 c[i][j]와 같다.
 *   4. 길이 없는 쌍은 c가 INF이고 kay가 0이다. 이때 outputPath를 그냥 부르면 없는 간선을 찍는다.
 */
#include <stdio.h>
#include <stdlib.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

#define MAXN 8
#define INF 1000000            /* 간선이 없다는 표시. 두 개를 더해도 int를 넘지 않는 값 */

static int n;
static int c[MAXN + 1][MAXN + 1];      /* c[i][j]: 지금까지 찾은 i에서 j까지의 가장 짧은 길이 */
static int kay[MAXN + 1][MAXN + 1];    /* kay[i][j]: 그 길에서 번호가 가장 큰 중간 정점. 없으면 0 */

static int path[4 * MAXN], pathLen;    /* 테스트에서 견주려고 찍은 정점을 따로 적어 둔다 */

/* 슬라이드 p.61: 길이가 줄어들 때마다 그때의 k를 적는다 */
void floydWithKay(void)
{
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) kay[i][j] = 0;
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                if (c[i][j] > c[i][k] + c[k][j]) {
                    kay[i][j] = k;
                    c[i][j] = c[i][k] + c[k][j];
                }
}

/* 슬라이드 p.70: i에서 j로 가는 길을 찍는다. 첫 정점 i는 찍지 않는다 */
void outputPath(int i, int j)
{
    if (i == j) return;
    if (kay[i][j] == 0) {              /* 사이에 낀 정점이 없다: 간선 하나로 간다 */
        printf("%d ", j);
        path[pathLen++] = j;
    } else {                           /* kay[i][j]를 거쳐 간다 */
        outputPath(i, kay[i][j]);
        outputPath(kay[i][j], j);
    }
}

/* ---- 테스트 ---- */

static void loadSlideGraph(int cost0[MAXN + 1][MAXN + 1])
{
    /* 슬라이드 p.62의 처음 비용 표. 0은 간선 없음을 뜻하게 적었다 */
    static const int rows[8][8] = {
        {0, 7, 5, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 4, 0, 0, 0},
        {0, 7, 0, 0, 9, 9, 0, 0},
        {0, 5, 0, 0, 0, 0, 16, 0},
        {0, 0, 0, 4, 0, 0, 0, 1},
        {0, 0, 0, 0, 0, 0, 1, 0},
        {2, 0, 0, 0, 0, 0, 0, 4},
        {0, 0, 0, 0, 0, 2, 4, 0},
    };
    n = 8;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) {
            int w = rows[i - 1][j - 1];
            cost0[i][j] = c[i][j] = (i == j) ? 0 : (w ? w : INF);
        }
}

int main(void)
{
    static int cost0[MAXN + 1][MAXN + 1];
    loadSlideGraph(cost0);
    floydWithKay();

    /* 1. 끝난 뒤의 두 표 */
    static const int wantC[8][8] = {
        {0, 6, 5, 1, 10, 13, 14, 11},
        {10, 0, 15, 8, 4, 7, 8, 5},
        {12, 7, 0, 13, 9, 9, 10, 10},
        {15, 5, 20, 0, 9, 12, 13, 10},
        {6, 9, 11, 4, 0, 3, 4, 1},
        {3, 9, 8, 4, 13, 0, 1, 5},
        {2, 8, 7, 3, 12, 6, 0, 4},
        {5, 11, 10, 6, 15, 2, 3, 0},
    };
    static const int wantKay[8][8] = {
        {0, 4, 0, 0, 4, 8, 8, 5},
        {8, 0, 8, 5, 0, 8, 8, 5},
        {7, 0, 0, 5, 0, 0, 6, 5},
        {8, 0, 8, 0, 2, 8, 8, 5},
        {8, 4, 8, 0, 0, 8, 8, 0},
        {7, 7, 7, 7, 7, 0, 0, 7},
        {0, 4, 1, 1, 4, 8, 0, 0},
        {7, 7, 7, 7, 7, 0, 6, 0},
    };
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) {
            CHECK(c[i][j] == wantC[i - 1][j - 1], "비용 표가 슬라이드 p.63과 같다");
            CHECK(kay[i][j] == wantKay[i - 1][j - 1], "kay 표가 슬라이드 p.64와 같다");
        }
    printf("[OK] 정점 8개 그래프: 비용 표 64칸과 kay 표 64칸이 슬라이드와 같다\n");

    /* 2. 1에서 7로 가는 길 */
    pathLen = 0;
    printf("     outputPath(1, 7)이 찍는 것: ");
    outputPath(1, 7);
    printf("\n");
    static const int want17[] = {4, 2, 5, 8, 6, 7};
    CHECK(pathLen == 6, "정점 여섯 개를 찍는다");
    for (int k = 0; k < 6; k++) CHECK(path[k] == want17[k], "1에서 7: 4 2 5 8 6 7");
    CHECK(c[1][7] == 14 && 1 + 5 + 4 + 1 + 2 + 1 == 14, "길이 14");
    printf("[OK] 1에서 7로 가는 길: 1 4 2 5 8 6 7, 길이 1 + 5 + 4 + 1 + 2 + 1 = 14\n");

    /* 3. 모든 쌍 */
    printf("     (모든 쌍의 길을 찍어 확인한다) ");
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) {
            pathLen = 0;
            outputPath(i, j);
            int from = i, sum = 0;
            for (int k = 0; k < pathLen; k++) {
                CHECK(cost0[from][path[k]] < INF && from != path[k], "찍힌 간선이 처음 그래프에 있다");
                sum += cost0[from][path[k]];
                from = path[k];
            }
            CHECK(from == j && sum == c[i][j], "찍힌 길의 길이 = c[i][j]");
            if (kay[i][j] != 0) {
                int biggest = 0;
                for (int k = 0; k + 1 < pathLen; k++) if (path[k] > biggest) biggest = path[k];
                CHECK(biggest == kay[i][j], "kay[i][j] = 길 위의 가장 큰 중간 정점");
            } else {
                CHECK(i == j || pathLen == 1, "kay가 0이면 간선 하나");
            }
        }
    printf("\n[OK] 64쌍 모두: 찍힌 길의 간선이 그래프에 있고 길이가 c[i][j]와 같다\n");

    /* 4. 길이 없는 쌍 */
    n = 3;
    for (int i = 1; i <= 3; i++)
        for (int j = 1; j <= 3; j++) c[i][j] = (i == j) ? 0 : INF;
    c[1][2] = 4;                                       /* 간선은 1 -> 2 하나뿐 */
    floydWithKay();
    CHECK(c[1][3] >= INF && kay[1][3] == 0, "1에서 3으로 가는 길은 없다: c는 INF, kay는 0");
    pathLen = 0;
    printf("     길이 없는 (1, 3)에 그냥 부르면 찍는 것: ");
    outputPath(1, 3);
    printf("\n");
    CHECK(pathLen == 1 && path[0] == 3, "없는 간선 1 -> 3을 찍어 버린다");
    printf("[OK] 길이 없는 쌍은 c가 INF, kay가 0이다. 부르기 전에 c[i][j]가 INF인지 먼저 본다\n");

    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
