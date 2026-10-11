---
layout: "note"
title: "42_quick-partition-ladder_p4.c"
display_title: "42_quick-partition-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "42"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/quick-partition-ladder/"
parent_title: "퀵 정렬 분할 예제 사다리"
description: "자료구조 · 퀵 정렬 분할 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/42_quick-partition-ladder_p4/"
---
{% raw %}
[퀵 정렬 분할 예제 사다리](/Hongs_Blog/studies/data-structures/quick-partition-ladder/) 문서의 문제 4 풀이 코드다.

```c
/* 퀵 정렬 분할 예제 사다리: 문제 1~4의 답 확인.
 *
 * 실행: cc -std=c11 -Wall -Wextra 42_quick-partition-ladder_p4.c -o ladder42 && ./ladder42
 * 문서: 4.연습문제/42.퀵 정렬 분할 예제 사다리
 * 출처: 자료구조 14주차 슬라이드 p.7, p.11~14
 * 두 분할 함수는 3.개념집/42_quick-sort_impl.c의 것을 그대로 옮겨 적었다(파일끼리 불러오지 않는다).
 * 색인은 0부터 센다.
 */
#include <stdio.h>
#include <string.h>

static int g_swaps, g_pair[16][2];      /* 맞바꾼 (big, small) 쌍 */

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
    b[lo] = pivot;
    return lo;
}

static int partition(int a[], int left, int right)
{
    int pivot = a[left];
    int i = left, j = right + 1;
    g_swaps = 0;
    for (;;) {
        do {
            i++;
        } while (i <= right && a[i] < pivot);
        do {
            j--;
        } while (a[j] > pivot);
        if (i >= j)
            break;
        if (g_swaps < 16) {
            g_pair[g_swaps][0] = a[i];
            g_pair[g_swaps][1] = a[j];
        }
        g_swaps++;
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    a[left] = a[j];
    a[j] = pivot;
    return j;
}

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

static int same(const int x[], const int y[], int n)
{
    return memcmp(x, y, (size_t)n * sizeof(int)) == 0;
}

static int fail(const char *msg)
{
    printf("FAILED: %s\n", msg);
    return 1;
}

int main(void)
{
    /* 문제 1: 슬라이드의 예 */
    {
        int a[11] = {6, 2, 8, 5, 11, 10, 4, 1, 9, 7, 3};
        int b[11];
        const int want_b[11] = {2, 5, 4, 1, 3, 6, 7, 9, 10, 11, 8};
        const int want_a[11] = {4, 2, 3, 5, 1, 6, 10, 11, 9, 7, 8};
        if (partition_extra(a, b, 0, 10) != 5 || !same(b, want_b, 11))
            return fail("문제 1 덤 배열");
        if (partition(a, 0, 10) != 5 || !same(a, want_a, 11) || g_swaps != 3)
            return fail("문제 1 제자리");
        if (g_pair[0][0] != 8 || g_pair[0][1] != 3 || g_pair[1][0] != 11 || g_pair[1][1] != 1 ||
            g_pair[2][0] != 10 || g_pair[2][1] != 4)
            return fail("문제 1 맞바꾼 쌍");
    }

    /* 문제 2: [7, 3, 9, 1, 12, 5, 8] */
    {
        int a[7] = {7, 3, 9, 1, 12, 5, 8};
        const int want[7] = {1, 3, 5, 7, 12, 9, 8};
        if (partition(a, 0, 6) != 3 || !same(a, want, 7))
            return fail("문제 2");
        if (g_swaps != 1 || g_pair[0][0] != 9 || g_pair[0][1] != 5)
            return fail("문제 2 맞바꾼 쌍");
    }

    /* 문제 3: 같은 값이 있는 [5, 8, 5, 2, 9, 5, 1, 7] */
    {
        int a[8] = {5, 8, 5, 2, 9, 5, 1, 7};
        const int want[8] = {2, 1, 5, 5, 9, 5, 8, 7};
        if (partition(a, 0, 7) != 3 || !same(a, want, 8))
            return fail("문제 3");
        if (g_swaps != 2 || g_pair[0][0] != 8 || g_pair[0][1] != 1 || g_pair[1][0] != 5 || g_pair[1][1] != 5)
            return fail("문제 3 맞바꾼 쌍");
    }

    /* 문제 4: 가운데 값 규칙 + 두 가지 분할 */
    {
        int a[9] = {9, 4, 7, 2, 6, 1, 8, 3, 5};
        int b[9];
        const int after_swap[9] = {6, 4, 7, 2, 9, 1, 8, 3, 5};
        const int want_b[9] = {4, 2, 1, 3, 5, 6, 8, 9, 7};
        const int want_a[9] = {1, 4, 5, 2, 3, 6, 8, 9, 7};
        int m = median_of_three(a, 0, 8);
        if (m != 4)
            return fail("문제 4 가운데 값의 자리");
        int t = a[0];
        a[0] = a[m];
        a[m] = t;
        if (!same(a, after_swap, 9))
            return fail("문제 4 맞바꾼 뒤");
        if (partition_extra(a, b, 0, 8) != 5 || !same(b, want_b, 9))
            return fail("문제 4 덤 배열");
        if (partition(a, 0, 8) != 5 || !same(a, want_a, 9) || g_swaps != 2)
            return fail("문제 4 제자리");
        if (g_pair[0][0] != 7 || g_pair[0][1] != 5 || g_pair[1][0] != 9 || g_pair[1][1] != 3)
            return fail("문제 4 맞바꾼 쌍");
        /* 맨 왼쪽 값 9를 그대로 피벗으로 썼다면 조각이 8개와 0개로 갈린다 */
        int c[9] = {9, 4, 7, 2, 6, 1, 8, 3, 5};
        if (partition(c, 0, 8) != 8)
            return fail("문제 4 맨 왼쪽 피벗");
    }

    printf("문제 1~4의 분할 결과 확인\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
