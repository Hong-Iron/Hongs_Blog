---
layout: "note"
title: "42_quick-sort_impl.c"
display_title: "42_quick-sort_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "42"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/quick-sort/"
parent_title: "퀵 정렬"
description: "자료구조 · 퀵 정렬 구현 코드"
permalink: "/studies/data-structures/code/42_quick-sort_impl/"
---
{% raw %}
[퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/) 문서의 구현 코드다.

```c
/* 퀵 정렬: 분할 두 가지, 피벗 고르기, 정렬. 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 42_quick-sort_impl.c -o quick && ./quick
 * 문서: 42.퀵 정렬 (분할 추적 표, 불변식, 피벗 세 가지, 카드 C1~C6)
 * 출처: 자료구조 14주차 슬라이드 p.6~18. 슬라이드에는 그림과 설명만 있어 코드는 그 설명대로 짠 것이다.
 * 색인은 0부터 센다. 구간 a[left..right]는 양 끝을 포함한다(슬라이드의 a[6:20]과 같은 뜻).
 *
 * 확인하는 것
 *   1. 덤 배열 분할: [6, 2, 8, 5, 11, 10, 4, 1, 9, 7, 3] -> [2, 5, 4, 1, 3, 6, 7, 9, 10, 11, 8] (p.7, p.13)
 *   2. 제자리 분할: 맞바꾸는 쌍 (8, 3), (11, 1), (10, 4), 끝 상태 [4, 2, 3, 5, 1, 6, 10, 11, 9, 7, 8] (p.14)
 *   3. 제자리 분할의 불변식을 바퀴마다 검사(무작위 20,000개).
 *   4. 가운데 값 고르기(median-of-three)의 슬라이드 예 세 개 (p.11~12)
 *   5. 정렬 네 판(맨 왼쪽 피벗, 덤 배열 분할, 가운데 값 피벗, 손본 판)을 qsort와 무작위 2,000개 비교, 경계.
 *   6. 카드 C1, C6의 답.
 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void swap_int(int *x, int *y)
{
    int t = *x;
    *x = *y;
    *y = t;
}

/* 덤 배열 분할 (p.13). 피벗 a[left]보다 크지 않은 값은 b의 왼쪽 끝부터,
 * 큰 값은 b의 오른쪽 끝부터 채우고, 남은 한 칸에 피벗을 놓는다. 피벗 자리를 돌려준다. */
static int partition_extra(const int a[], int b[], int left, int right)
{
    int pivot = a[left];
    int lo = left, hi = right;
    for (int i = left + 1; i <= right; i++) {
        if (a[i] <= pivot)
            b[lo++] = a[i];
        else
            b[hi--] = a[i];
    }
    b[lo] = pivot;                    /* 이때 lo == hi다 */
    return lo;
}

/* 맞바꾼 쌍을 적어 두는 칸. 추적 표를 확인할 때만 쓴다. */
static int g_log_on, g_log_n, g_log[64][2];

/* 불변식 검사: a[left+1..i]는 모두 피벗 이하, a[j..right]는 모두 피벗 이상. */
static void check_invariant(const int a[], int left, int right, int i, int j, int pivot)
{
    for (int k = left + 1; k <= i && k <= right; k++)
        assert(a[k] <= pivot);
    for (int k = j; k <= right; k++)
        assert(a[k] >= pivot);
}

/* 제자리 분할 (p.14, p.17의 규칙). 피벗은 a[left].
 * i는 왼쪽에서 "피벗 이상인 첫 값"(bigElement)을, j는 오른쪽에서 "피벗 이하인 첫 값"(smallElement)을 찾는다.
 * i가 j보다 왼쪽이면 둘을 맞바꾸고 계속한다. 아니면 피벗과 a[j]를 맞바꾸고 끝낸다. */
static int partition(int a[], int left, int right)
{
    int pivot = a[left];
    int i = left, j = right + 1;
    for (;;) {
        check_invariant(a, left, right, i, j, pivot);
        do {
            i++;
        } while (i <= right && a[i] < pivot);
        do {
            j--;
        } while (a[j] > pivot);       /* a[left]가 피벗이라 left에서는 반드시 멈춘다 */
        if (i >= j)
            break;
        if (g_log_on && g_log_n < 64) {
            g_log[g_log_n][0] = a[i];
            g_log[g_log_n][1] = a[j];
            g_log_n++;
        }
        swap_int(&a[i], &a[j]);
    }
    a[left] = a[j];
    a[j] = pivot;
    return j;
}

/* 맨 왼쪽 값을 피벗으로 쓰는 퀵 정렬 (p.6, p.9). */
static void quick_sort(int a[], int left, int right)
{
    if (left >= right)
        return;                       /* 원소가 한 개 이하면 이미 정렬되어 있다 */
    int p = partition(a, left, right);
    quick_sort(a, left, p - 1);       /* 왼쪽 조각 */
    quick_sort(a, p + 1, right);      /* 오른쪽 조각 */
}

/* 덤 배열 분할로 하는 퀵 정렬. b는 a와 같은 크기의 빈 배열. */
static void quick_sort_extra(int a[], int b[], int left, int right)
{
    if (left >= right)
        return;
    int p = partition_extra(a, b, left, right);
    memcpy(a + left, b + left, (size_t)(right - left + 1) * sizeof(int));
    quick_sort_extra(a, b, left, p - 1);
    quick_sort_extra(a, b, p + 1, right);
}

/* 맨 왼쪽, 가운데, 맨 오른쪽 세 값 가운데 크기가 중간인 값의 자리 (p.11). */
static int median_of_three(const int a[], int left, int right)
{
    int mid = (left + right) / 2;
    int x = a[left], y = a[mid], z = a[right];
    if ((x <= y && y <= z) || (z <= y && y <= x))
        return mid;
    if ((y <= x && x <= z) || (z <= x && x <= y))
        return left;
    return right;
}

/* 가운데 값을 피벗으로 쓰는 퀵 정렬: 고른 피벗을 맨 왼쪽과 맞바꾼 뒤 같은 분할을 쓴다 (p.12). */
static void quick_sort_m3(int a[], int left, int right)
{
    if (left >= right)
        return;
    swap_int(&a[left], &a[median_of_three(a, left, right)]);
    int p = partition(a, left, right);
    quick_sort_m3(a, left, p - 1);
    quick_sort_m3(a, p + 1, right);
}

static void insertion_sort_range(int a[], int left, int right)
{
    for (int i = left + 1; i <= right; i++) {
        int t = a[i];
        int j;
        for (j = i - 1; j >= left && t < a[j]; j--)
            a[j + 1] = a[j];
        a[j + 1] = t;
    }
}

/* 손본 판: 조각이 15개 이하면 삽입 정렬로 넘기고(p.18), 가운데 값 피벗을 쓰고,
 * 작은 조각만 재귀로 부르고 큰 조각은 같은 함수 안에서 돌아 재귀 깊이를 log n 안으로 묶는다(p.17). */
static int g_depth, g_max_depth;
static void quick_sort_tuned(int a[], int left, int right)
{
    g_depth++;
    if (g_depth > g_max_depth)
        g_max_depth = g_depth;
    while (right - left + 1 > 15) {
        swap_int(&a[left], &a[median_of_three(a, left, right)]);
        int p = partition(a, left, right);
        if (p - left < right - p) {
            quick_sort_tuned(a, left, p - 1);
            left = p + 1;
        } else {
            quick_sort_tuned(a, p + 1, right);
            right = p - 1;
        }
    }
    insertion_sort_range(a, left, right);
    g_depth--;
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
    const int slide[11] = {6, 2, 8, 5, 11, 10, 4, 1, 9, 7, 3};

    /* 1. 덤 배열 분할 */
    {
        int b[11];
        const int want[11] = {2, 5, 4, 1, 3, 6, 7, 9, 10, 11, 8};
        int p = partition_extra(slide, b, 0, 10);
        if (p != 5 || !same(b, want, 11))
            return fail("덤 배열 분할 (p.13)");
    }

    /* 2. 제자리 분할 */
    {
        int a[11];
        memcpy(a, slide, sizeof a);
        const int want[11] = {4, 2, 3, 5, 1, 6, 10, 11, 9, 7, 8};
        g_log_on = 1;
        g_log_n = 0;
        int p = partition(a, 0, 10);
        g_log_on = 0;
        if (p != 5 || !same(a, want, 11))
            return fail("제자리 분할 끝 상태 (p.14)");
        if (g_log_n != 3 || g_log[0][0] != 8 || g_log[0][1] != 3 || g_log[1][0] != 11 ||
            g_log[1][1] != 1 || g_log[2][0] != 10 || g_log[2][1] != 4)
            return fail("제자리 분할에서 맞바꾼 쌍 (p.14)");
    }

    /* 6. 카드 C1: [5, 9, 1, 7, 3, 8, 2] */
    {
        int a[7] = {5, 9, 1, 7, 3, 8, 2};
        const int want[7] = {3, 2, 1, 5, 7, 8, 9};
        g_log_on = 1;
        g_log_n = 0;
        int p = partition(a, 0, 6);
        g_log_on = 0;
        if (p != 3 || !same(a, want, 7))
            return fail("카드 C1 끝 상태");
        if (g_log_n != 2 || g_log[0][0] != 9 || g_log[0][1] != 2 || g_log[1][0] != 7 || g_log[1][1] != 3)
            return fail("카드 C1에서 맞바꾼 쌍");
    }

    /* 카드 C6: 이미 정렬된 [1, 2, 3, 4, 5]를 맨 왼쪽 피벗으로 나누면 피벗 자리는 늘 0 */
    {
        int a[5] = {1, 2, 3, 4, 5};
        for (int left = 0; left < 4; left++)
            if (partition(a, left, 4) != left)
                return fail("카드 C6");
    }

    /* 3. 무작위 분할 20,000번: 불변식(assert)과 끝 조건 */
    for (int trial = 0; trial < 20000; trial++) {
        int n = 1 + (int)(next_rand() % 30);
        int a[30];
        for (int i = 0; i < n; i++)
            a[i] = (int)(next_rand() % 12);
        int pivot = a[0];
        int p = partition(a, 0, n - 1);
        if (a[p] != pivot)
            return fail("피벗이 돌려준 자리에 없다");
        for (int k = 0; k < p; k++)
            if (a[k] > pivot)
                return fail("왼쪽 조각에 피벗보다 큰 값");
        for (int k = p + 1; k < n; k++)
            if (a[k] < pivot)
                return fail("오른쪽 조각에 피벗보다 작은 값");
    }

    /* 4. 가운데 값 고르기: a[6..20]에서 a[6], a[13], a[20]을 본다 */
    {
        int a[21] = {0};
        a[6] = 30; a[13] = 2; a[20] = 10;
        if (median_of_three(a, 6, 20) != 20)
            return fail("30, 2, 10 -> a[20]");
        a[6] = 3; a[13] = 2; a[20] = 10;
        if (median_of_three(a, 6, 20) != 6)
            return fail("3, 2, 10 -> a[6]");
        a[6] = 30; a[13] = 25; a[20] = 10;
        if (median_of_three(a, 6, 20) != 13)
            return fail("30, 25, 10 -> a[13]");
    }

    /* 5. 경계 */
    {
        int e[1] = {0};
        quick_sort(e, 0, -1);                    /* 빈 구간 */
        int one[1] = {42};
        quick_sort(one, 0, 0);
        if (one[0] != 42)
            return fail("원소 1개");
        int eq[40], srt[40], rev[40];
        for (int i = 0; i < 40; i++) {
            eq[i] = 5;
            srt[i] = i;
            rev[i] = 40 - i;
        }
        quick_sort(eq, 0, 39);
        quick_sort(srt, 0, 39);
        quick_sort(rev, 0, 39);
        for (int i = 0; i < 40; i++)
            if (eq[i] != 5 || srt[i] != i || rev[i] != i + 1)
                return fail("모두 같은 값 / 정렬됨 / 역순");
    }

    /* 5. 네 판 = qsort (무작위 2,000개) */
    for (int trial = 0; trial < 2000; trial++) {
        int n = (int)(next_rand() % 201);        /* 0..200 */
        int a[200], b[200], c[200], d[200], w[200], tmp[200];
        int range = (trial % 3 == 0) ? 5 : 1000; /* 셋에 한 번은 겹치는 값이 아주 많게 */
        for (int i = 0; i < n; i++)
            a[i] = b[i] = c[i] = d[i] = w[i] = (int)(next_rand() % (unsigned)range);
        quick_sort(a, 0, n - 1);
        quick_sort_extra(b, tmp, 0, n - 1);
        quick_sort_m3(c, 0, n - 1);
        g_depth = g_max_depth = 0;
        quick_sort_tuned(d, 0, n - 1);
        qsort(w, (size_t)n, sizeof(int), cmp_int);
        if (!same(a, w, n) || !same(b, w, n) || !same(c, w, n) || !same(d, w, n))
            return fail("qsort와 다른 결과");
    }

    /* 손본 판의 재귀 깊이: 정렬된 4,096개에서도 얕다 */
    {
        static int big[4096];
        for (int i = 0; i < 4096; i++)
            big[i] = i;
        g_depth = g_max_depth = 0;
        quick_sort_tuned(big, 0, 4095);
        for (int i = 0; i < 4096; i++)
            if (big[i] != i)
                return fail("손본 판, 정렬된 입력");
        if (g_max_depth > 13)                    /* lg 4096 + 1 */
            return fail("손본 판의 재귀 깊이");
        printf("손본 판: 정렬된 4,096개에서 재귀 깊이 %d\n", g_max_depth);
    }

    printf("덤 배열 분할, 제자리 분할(맞바꾼 쌍 (8, 3), (11, 1), (10, 4)) 슬라이드와 같음\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
