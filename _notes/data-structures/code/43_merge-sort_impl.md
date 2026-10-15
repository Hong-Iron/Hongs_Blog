---
layout: "note"
title: "43_merge-sort_impl.c"
display_title: "43_merge-sort_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "43"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/merge-sort/"
parent_title: "병합 정렬"
description: "자료구조 · 병합 정렬 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/43_merge-sort_impl/"
---
{% raw %}
[병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/) 문서의 구현 코드다.

```c
/* 병합 정렬: 두 줄 합치기, 재귀 판, 재귀 없는 판. 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 43_merge-sort_impl.c -o merge && ./merge
 * 문서: 43.병합 정렬 (합치기 추적 표, 나누고 합치는 나무, 카드 C1~C3)
 * 코드는 문서의 설명대로 짠 것이다.
 * 색인은 0부터 센다. 구간 [lo, hi)는 lo를 포함하고 hi를 포함하지 않는다.
 *
 * 확인하는 것
 *   1. 두 줄 합치기: A = (2, 5, 6), B = (1, 3, 8, 9, 10)을 한 개씩 옮길 때의 C (문서의 추적 표)
 *   2. 13개짜리 예: 나누는 조각과 합친 결과가 문서의 나무 그림과 같다
 *   3. 재귀 판, 재귀 없는 판, qsort가 무작위 2,000개에서 같은 결과. 경계.
 *   4. 카드 C1의 답.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* 정렬된 a[0..na-1]과 b[0..nb-1]을 c에 합친다. 두 줄의 맨 앞끼리 견주어 작은 쪽을 옮긴다. */
static void merge(const int a[], int na, const int b[], int nb, int c[])
{
    int i = 0, j = 0, k = 0;
    while (i < na && j < nb) {
        if (b[j] < a[i])              /* 같으면 a 쪽을 먼저 옮긴다: 같은 값의 순서가 지켜진다 */
            c[k++] = b[j++];
        else
            c[k++] = a[i++];
    }
    while (i < na)                    /* 한 줄이 비면 남은 줄을 그대로 붙인다 */
        c[k++] = a[i++];
    while (j < nb)
        c[k++] = b[j++];
}

/* 합친 결과를 차례로 적어 두는 칸. 문서의 나무 그림과 맞춰 볼 때만 쓴다. */
static int g_log_on, g_log_n, g_log_len[32], g_log[32][16];

/* a[lo..hi-1]을 정렬한다. tmp는 a와 같은 크기의 덤 배열. */
static void msort(int a[], int tmp[], int lo, int hi)
{
    int n = hi - lo;
    if (n <= 1)
        return;                       /* 한 개 이하는 이미 정렬되어 있다 */
    int mid = lo + (n + 1) / 2;       /* 앞 조각이 ceil(n/2)개, 뒤 조각이 floor(n/2)개 */
    msort(a, tmp, lo, mid);
    msort(a, tmp, mid, hi);
    merge(a + lo, mid - lo, a + mid, hi - mid, tmp + lo);
    memcpy(a + lo, tmp + lo, (size_t)n * sizeof(int));
    if (g_log_on && g_log_n < 32 && n <= 16) {
        g_log_len[g_log_n] = n;
        memcpy(g_log[g_log_n], a + lo, (size_t)n * sizeof(int));
        g_log_n++;
    }
}

/* 재귀 판. 덤 배열을 잡지 못하면 0을 돌려준다. */
static int merge_sort(int a[], int n)
{
    if (n <= 1)
        return 1;
    int *tmp = malloc((size_t)n * sizeof(int));
    if (tmp == NULL)
        return 0;
    msort(a, tmp, 0, n);
    free(tmp);
    return 1;
}

/* 재귀 없는 판: 길이 1짜리 조각에서 시작해, 이웃한 두 조각을 합치는 일을
 * 한 바퀴(병합 패스)씩 되풀이한다. 조각 길이는 바퀴마다 두 배가 된다. */
static int merge_sort_bottom_up(int a[], int n)
{
    if (n <= 1)
        return 1;
    int *tmp = malloc((size_t)n * sizeof(int));
    if (tmp == NULL)
        return 0;
    int *src = a, *dst = tmp;
    for (int len = 1; len < n; len *= 2) {
        for (int lo = 0; lo < n; lo += 2 * len) {
            int mid = lo + len < n ? lo + len : n;
            int hi = lo + 2 * len < n ? lo + 2 * len : n;
            merge(src + lo, mid - lo, src + mid, hi - mid, dst + lo);
        }
        int *t = src;
        src = dst;
        dst = t;
    }
    if (src != a)
        memcpy(a, src, (size_t)n * sizeof(int));
    free(tmp);
    return 1;
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
    /* 1. 두 줄 합치기 (문서의 추적 표) */
    {
        const int A[3] = {2, 5, 6};
        const int B[5] = {1, 3, 8, 9, 10};
        int C[8];
        const int want[8] = {1, 2, 3, 5, 6, 8, 9, 10};
        merge(A, 3, B, 5, C);
        if (!same(C, want, 8))
            return fail("A = (2, 5, 6), B = (1, 3, 8, 9, 10)");
    }

    /* 2. 13개짜리 예 (문서의 나무 그림): 합친 결과가 나오는 차례대로 */
    {
        int a[13] = {8, 3, 13, 6, 2, 14, 5, 9, 10, 1, 7, 12, 4};
        const int want_len[12] = {2, 2, 4, 2, 3, 7, 2, 3, 2, 3, 6, 13};
        const int want[12][13] = {
            {3, 8},
            {6, 13},
            {3, 6, 8, 13},
            {2, 14},
            {2, 5, 14},
            {2, 3, 5, 6, 8, 13, 14},
            {9, 10},
            {1, 9, 10},
            {7, 12},
            {4, 7, 12},
            {1, 4, 7, 9, 10, 12},
            {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14},
        };
        g_log_on = 1;
        g_log_n = 0;
        if (!merge_sort(a, 13))
            return fail("malloc");
        g_log_on = 0;
        if (g_log_n != 12)
            return fail("합치기 횟수 12번 (n - 1)");
        for (int k = 0; k < 12; k++)
            if (g_log_len[k] != want_len[k] || !same(g_log[k], want[k], want_len[k]))
                return fail("문서 나무 그림의 합친 결과");
    }

    /* 4. 카드 C1: A = (1, 4, 7), B = (2, 3, 9, 10)에서 네 개를 옮긴 뒤 */
    {
        const int A[3] = {1, 4, 7};
        const int B[4] = {2, 3, 9, 10};
        int C[7];
        const int want[7] = {1, 2, 3, 4, 7, 9, 10};
        merge(A, 3, B, 4, C);
        if (!same(C, want, 7))
            return fail("카드 C1");
    }

    /* 3. 경계 */
    {
        int e[1] = {0};
        if (!merge_sort(e, 0) || !merge_sort_bottom_up(e, 0))
            return fail("빈 배열");
        int one[1] = {42};
        merge_sort(one, 1);
        merge_sort_bottom_up(one, 1);
        if (one[0] != 42)
            return fail("원소 1개");
        int eq[9], srt[9], rev[9];
        for (int i = 0; i < 9; i++) {
            eq[i] = 5;
            srt[i] = i;
            rev[i] = 9 - i;
        }
        merge_sort(eq, 9);
        merge_sort(srt, 9);
        merge_sort_bottom_up(rev, 9);
        for (int i = 0; i < 9; i++)
            if (eq[i] != 5 || srt[i] != i || rev[i] != i + 1)
                return fail("모두 같은 값 / 정렬됨 / 역순");
    }

    /* 3. 재귀 판 = 재귀 없는 판 = qsort (무작위 2,000개) */
    for (int trial = 0; trial < 2000; trial++) {
        int n = (int)(next_rand() % 201);
        int a[200], b[200], w[200];
        int range = (trial % 3 == 0) ? 5 : 1000;
        for (int i = 0; i < n; i++)
            a[i] = b[i] = w[i] = (int)(next_rand() % (unsigned)range);
        if (!merge_sort(a, n) || !merge_sort_bottom_up(b, n))
            return fail("malloc");
        qsort(w, (size_t)n, sizeof(int), cmp_int);
        if (!same(a, w, n) || !same(b, w, n))
            return fail("qsort와 다른 결과");
    }

    printf("합치기 예와 13개짜리 예(합치기 12번)가 문서와 같음\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
