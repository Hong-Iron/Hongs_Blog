---
layout: "note"
title: "41_selection-sort_impl.c"
display_title: "41_selection-sort_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "41"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/selection-sort/"
parent_title: "선택 정렬"
description: "자료구조 · 선택 정렬 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/41_selection-sort_impl/"
---
{% raw %}
[선택 정렬](/Hongs_Blog/studies/data-structures/selection-sort/) 문서의 구현 코드다.

```c
/* 선택 정렬: 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 41_selection-sort_impl.c -o selection && ./selection
 * 문서: 41.선택 정렬 (예시 추적 표, 재귀로 보는 눈, 카드 C1~C3)
 * 코드는 문서의 재귀 설명 세 줄대로 짠 것이다.
 * 색인은 0부터 센다.
 *
 * 확인하는 것
 *   1. 문서의 추적 표: [7, 3, 6, 2, 1]에서 한 바퀴 돌 때마다의 배열.
 *   2. 반복 판과 재귀 판이 같은 결과를 낸다.
 *   3. 표준 qsort와 무작위 2,000개 비교, 경계(빈 배열, 1개, 모두 같은 값, 정렬됨, 역순).
 *   4. 비교 횟수는 입력과 상관없이 n(n-1)/2, 맞바꾸기는 많아야 n-1번 (n = 1..60, 입력 세 가지).
 *   5. 카드 C1의 답.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static long g_cmp, g_swap;            /* 테스트에서 세어 보려고 둔 계수기 */

/* a[0..size-1]에서 가장 큰 값의 자리를 돌려준다. 같은 값이 여럿이면 가장 앞의 것. */
static int index_of_max(const int a[], int size)
{
    int big = 0;
    for (int i = 1; i < size; i++) {
        g_cmp++;
        if (a[i] > a[big])
            big = i;
    }
    return big;
}

/* 가장 큰 값을 맨 오른쪽 칸과 맞바꾸고, 정렬할 구간을 한 칸 줄인다. */
static void selection_sort(int a[], int n)
{
    for (int size = n; size > 1; size--) {
        int big = index_of_max(a, size);
        if (big != size - 1) {
            int t = a[big];
            a[big] = a[size - 1];
            a[size - 1] = t;
            g_swap++;
        }
    }
}

/* 재귀로 보는 눈: 가장 큰 값을 오른쪽 끝으로 보내고, 남은 n-1개를 같은 방법으로 정렬한다. */
static void selection_sort_rec(int a[], int n)
{
    if (n <= 1)
        return;
    int big = index_of_max(a, n);
    int t = a[big];
    a[big] = a[n - 1];
    a[n - 1] = t;
    selection_sort_rec(a, n - 1);
}

static int cmp_int(const void *x, const void *y)
{
    int p = *(const int *)x, q = *(const int *)y;
    return (p > q) - (p < q);
}

static unsigned long long seed = 20261012ULL;
static unsigned int next_rand(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned int)(seed >> 33);
}

static int fail(const char *msg)
{
    printf("FAILED: %s\n", msg);
    return 1;
}

static int same(const int x[], const int y[], int n)
{
    return n == 0 || memcmp(x, y, (size_t)n * sizeof(int)) == 0;
}

/* 한 바퀴만 돈다: a[0..size-1]의 가장 큰 값을 a[size-1]로 보낸다. 추적 표를 만들 때 쓴다. */
static void one_round(int a[], int size)
{
    int big = index_of_max(a, size);
    int t = a[big];
    a[big] = a[size - 1];
    a[size - 1] = t;
}

int main(void)
{
    /* 1. 문서의 추적 표 */
    {
        int a[5] = {7, 3, 6, 2, 1};
        const int want[4][5] = {
            {1, 3, 6, 2, 7},      /* 7을 맨 끝으로 */
            {1, 3, 2, 6, 7},      /* 6을 넷째 칸으로 */
            {1, 2, 3, 6, 7},      /* 3을 셋째 칸으로 */
            {1, 2, 3, 6, 7},      /* 2는 이미 제자리 */
        };
        for (int r = 0; r < 4; r++) {
            one_round(a, 5 - r);
            if (!same(a, want[r], 5))
                return fail("추적 표 [7, 3, 6, 2, 1]");
        }
        int b[5] = {7, 3, 6, 2, 1};
        g_cmp = g_swap = 0;
        selection_sort(b, 5);
        if (g_cmp != 10 || g_swap != 3 || !same(b, want[3], 5))
            return fail("비교 10번, 맞바꾸기 3번");
    }

    /* 5. 카드 C1: [5, 2, 9, 4]에서 두 바퀴 돈 뒤 */
    {
        int a[4] = {5, 2, 9, 4};
        const int r1[4] = {5, 2, 4, 9};
        const int r2[4] = {4, 2, 5, 9};
        one_round(a, 4);
        if (!same(a, r1, 4))
            return fail("카드 C1 첫 바퀴");
        one_round(a, 3);
        if (!same(a, r2, 4))
            return fail("카드 C1 둘째 바퀴");
    }

    /* 3. 경계 */
    {
        int e[1] = {0};
        selection_sort(e, 0);
        int one[1] = {42};
        selection_sort(one, 1);
        if (one[0] != 42)
            return fail("원소 1개");
        int eq[6] = {5, 5, 5, 5, 5, 5};
        selection_sort(eq, 6);
        for (int i = 0; i < 6; i++)
            if (eq[i] != 5)
                return fail("모두 같은 값");
    }

    /* 2, 3. 반복 판 = 재귀 판 = qsort (무작위 2,000개) */
    for (int trial = 0; trial < 2000; trial++) {
        int n = (int)(next_rand() % 41);
        int a[40], b[40], c[40];
        for (int i = 0; i < n; i++)
            a[i] = b[i] = c[i] = (int)(next_rand() % 21) - 10;
        selection_sort(a, n);
        selection_sort_rec(b, n);
        qsort(c, (size_t)n, sizeof(int), cmp_int);
        if (!same(a, c, n) || !same(b, c, n))
            return fail("qsort와 다른 결과");
    }

    /* 4. 비교 횟수는 입력과 상관없이 n(n-1)/2 */
    for (int n = 1; n <= 60; n++) {
        for (int kind = 0; kind < 3; kind++) {
            int a[60];
            for (int i = 0; i < n; i++)
                a[i] = kind == 0 ? i : kind == 1 ? n - i : (int)(next_rand() % 100);
            g_cmp = g_swap = 0;
            selection_sort(a, n);
            if (g_cmp != (long)n * (n - 1) / 2)
                return fail("비교 횟수 n(n-1)/2");
            if (g_swap > n - 1 || (kind == 0 && g_swap != 0))
                return fail("맞바꾸기 횟수");
        }
    }

    printf("추적 [7, 3, 6, 2, 1]: 비교 10번, 맞바꾸기 3번\n");
    printf("n = 60: 정렬됨·역순·무작위 모두 비교 %d번\n", 60 * 59 / 2);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
