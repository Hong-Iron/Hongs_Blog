---
layout: "note"
title: "40_insertion-sort_impl.c"
display_title: "40_insertion-sort_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "40"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/insertion-sort/"
parent_title: "삽입 정렬"
description: "자료구조 · 삽입 정렬 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/40_insertion-sort_impl/"
---
{% raw %}
[삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/) 문서의 구현 코드다.

```c
/* 삽입 정렬: 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 40_insertion-sort_impl.c -o insertion && ./insertion
 * 문서: 40.삽입 정렬 (예시 추적 표, 재귀로 보는 눈, 카드 C1~C3)
 * 색인은 0부터 센다. 문서의 a[0:n-1]은 a[0]부터 a[n-1]까지라는 뜻이다.
 *
 * 확인하는 것
 *   1. 문서의 추적 표: [7, 3, 6, 2, 1]을 끼울 때마다의 배열과 비교 횟수 1, 2, 3, 4.
 *   2. 반복 판과 재귀 판이 같은 결과를 낸다.
 *   3. 표준 qsort와 무작위 2,000개 비교, 경계(빈 배열, 1개, 모두 같은 값, 정렬됨, 역순).
 *   4. 역순 입력의 비교 횟수 n(n-1)/2, 정렬된 입력의 비교 횟수 n-1 (n = 1..60).
 *   5. 카드 C1의 답.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 문서의 코드. a[0..i-1]이 정렬된 채로 a[i]를 제자리에 끼운다. */
static void insertion_sort(int a[], int n)
{
    for (int i = 1; i < n; i++) {
        int t = a[i];                 /* 이번에 끼울 값 */
        int j;
        for (j = i - 1; j >= 0 && t < a[j]; j--)
            a[j + 1] = a[j];          /* t보다 큰 값을 한 칸 뒤로 민다 */
        a[j + 1] = t;                 /* 빈 자리에 t를 놓는다 */
    }
}

/* 재귀로 보는 눈: 앞의 n-1개를 먼저 정렬하고, 마지막 값을 끼운다. */
static void insertion_sort_rec(int a[], int n)
{
    if (n <= 1)
        return;                       /* 한 개 이하는 이미 정렬되어 있다 */
    insertion_sort_rec(a, n - 1);     /* a[0..n-2]를 정렬한다 */
    int t = a[n - 1];
    int j;
    for (j = n - 2; j >= 0 && t < a[j]; j--)
        a[j + 1] = a[j];
    a[j + 1] = t;
}

/* 같은 일을 하면서 "t < a[j]" 비교와 한 칸 밀기를 센다. 한 번 끼울 때마다 배열을 적어 둔다. */
static void insertion_sort_traced(int a[], int n, long *cmp, long *moves,
                                  int pass_cmp[], int snap[][8])
{
    *cmp = 0;
    *moves = 0;
    for (int i = 1; i < n; i++) {
        int t = a[i];
        int j;
        long before = *cmp;
        for (j = i - 1; j >= 0; j--) {
            (*cmp)++;
            if (!(t < a[j]))
                break;
            a[j + 1] = a[j];
            (*moves)++;
        }
        a[j + 1] = t;
        if (pass_cmp)
            pass_cmp[i] = (int)(*cmp - before);
        if (snap && n <= 8)
            memcpy(snap[i], a, (size_t)n * sizeof(int));
    }
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

int main(void)
{
    /* 1. 문서의 추적 표 */
    {
        int a[5] = {7, 3, 6, 2, 1};
        int snap[5][8];
        int pc[5] = {0};
        long cmp, moves;
        insertion_sort_traced(a, 5, &cmp, &moves, pc, snap);
        const int want[5][5] = {
            {0, 0, 0, 0, 0},
            {3, 7, 6, 2, 1},
            {3, 6, 7, 2, 1},
            {2, 3, 6, 7, 1},
            {1, 2, 3, 6, 7},
        };
        for (int i = 1; i < 5; i++)
            if (!same(snap[i], want[i], 5) || pc[i] != i)
                return fail("추적 표 [7, 3, 6, 2, 1]");
        if (cmp != 10 || moves != 9)
            return fail("비교 10번, 밀기 9번");
    }

    /* 5. 카드 C1: [4, 1, 3, 2]에서 i = 2까지 끝낸 뒤 배열과 그때까지의 비교 횟수 */
    {
        int a[4] = {4, 1, 3, 2};
        int snap[4][8];
        int pc[4] = {0};
        long cmp, moves;
        insertion_sort_traced(a, 4, &cmp, &moves, pc, snap);
        const int after2[4] = {1, 3, 4, 2};
        const int done[4] = {1, 2, 3, 4};
        if (!same(snap[2], after2, 4) || pc[1] != 1 || pc[2] != 2 || pc[3] != 3)
            return fail("카드 C1");
        if (!same(a, done, 4) || cmp != 6 || moves != 4)
            return fail("카드 C1 끝 상태");
    }

    /* 3. 경계 */
    {
        int e[1] = {0};
        insertion_sort(e, 0);                    /* 빈 배열: 아무 일도 하지 않는다 */
        int one[1] = {42};
        insertion_sort(one, 1);
        if (one[0] != 42)
            return fail("원소 1개");
        int eq[6] = {5, 5, 5, 5, 5, 5};
        insertion_sort(eq, 6);
        for (int i = 0; i < 6; i++)
            if (eq[i] != 5)
                return fail("모두 같은 값");
    }

    /* 2, 3. 반복 판 = 재귀 판 = qsort (무작위 2,000개) */
    for (int trial = 0; trial < 2000; trial++) {
        int n = (int)(next_rand() % 41);         /* 0..40 */
        int a[40], b[40], c[40];
        for (int i = 0; i < n; i++)
            a[i] = b[i] = c[i] = (int)(next_rand() % 21) - 10;   /* 겹치는 값이 많게 */
        insertion_sort(a, n);
        insertion_sort_rec(b, n);
        qsort(c, (size_t)n, sizeof(int), cmp_int);
        if (!same(a, c, n) || !same(b, c, n))
            return fail("qsort와 다른 결과");
    }

    /* 4. 최악과 최선의 비교 횟수 */
    for (int n = 1; n <= 60; n++) {
        int a[60];
        long cmp, moves;
        for (int i = 0; i < n; i++)
            a[i] = n - i;                        /* 역순 */
        insertion_sort_traced(a, n, &cmp, &moves, NULL, NULL);
        if (cmp != (long)n * (n - 1) / 2 || moves != (long)n * (n - 1) / 2)
            return fail("역순 입력의 비교 횟수 n(n-1)/2");
        for (int i = 0; i < n; i++)
            a[i] = i;                            /* 이미 정렬됨 */
        insertion_sort_traced(a, n, &cmp, &moves, NULL, NULL);
        if (cmp != n - 1 || moves != 0)
            return fail("정렬된 입력의 비교 횟수 n-1");
    }

    printf("추적 [7, 3, 6, 2, 1]: 비교 1, 2, 3, 4번 (합 10), 밀기 9번\n");
    printf("역순 n = 60: 비교 %d번, 정렬됨 n = 60: 비교 %d번\n", 60 * 59 / 2, 59);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
