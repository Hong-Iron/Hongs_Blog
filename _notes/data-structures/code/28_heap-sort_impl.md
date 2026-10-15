---
layout: "note"
title: "28_heap-sort_impl.c"
display_title: "28_heap-sort_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "28"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/heap-sort/"
parent_title: "우선순위 큐 정렬과 힙 정렬"
description: "자료구조 · 우선순위 큐 정렬과 힙 정렬 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/28_heap-sort_impl/"
---
{% raw %}
[우선순위 큐 정렬과 힙 정렬](/Hongs_Blog/studies/data-structures/heap-sort/) 문서의 구현 코드다.

```c
/*
 * 우선순위 큐 정렬과 힙 정렬
 *
 * 실행: cc -std=c11 -Wall -Wextra 28_heap-sort_impl.c -o out && ./out
 *
 * pqSort  : 최대 힙을 따로 하나 만들어 모두 넣고, 꺼낸 값을 배열의 오른쪽 끝부터 채운다.
 *           힙은 1번 칸부터 쓴다(부모 i / 2, 자식 2i, 2i + 1).
 * heapSort: 정렬할 배열 a[0..n-1] 자체를 힙으로 쓴다(덤 배열 없음).
 *           0번 칸부터 쓰므로 부모는 (i - 1) / 2, 자식은 2i + 1, 2i + 2다.
 * 둘 다 오름차순으로 정렬한다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void check(int ok, const char *what)
{
    if (!ok) {
        fprintf(stderr, "CHECK FAILED: %s\n", what);
        exit(1);
    }
}

/* ---------- 1. 우선순위 큐 정렬: 넣고, 꺼내서 오른쪽부터 채운다 ---------- */

static void pushMax(int heap[], int *size, int item)
{
    int i = ++(*size);
    while (i != 1 && item > heap[i / 2]) {
        heap[i] = heap[i / 2];
        i /= 2;
    }
    heap[i] = item;
}

static int popMax(int heap[], int *size)
{
    int item = heap[1], tmp = heap[(*size)--];
    int parent = 1, child = 2;
    while (child <= *size) {
        if (child < *size && heap[child] < heap[child + 1]) child++;
        if (tmp >= heap[child]) break;
        heap[parent] = heap[child];
        parent = child;
        child *= 2;
    }
    heap[parent] = tmp;
    return item;
}

void pqSort(int a[], int n)
{
    int *heap = malloc(sizeof(int) * (size_t)(n + 1));       /* 1번 칸부터 쓰므로 n + 1칸 */
    int size = 0;
    if (heap == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(1);
    }
    for (int i = 0; i < n; i++) pushMax(heap, &size, a[i]);      /* n번 넣기 */
    for (int i = n - 1; i >= 0; i--) a[i] = popMax(heap, &size); /* 큰 것부터 나오니 오른쪽 끝부터 */
    free(heap);
}

/* ---------- 2. 힙 정렬: 배열 안에서 힙을 만들고, 뿌리를 맨 뒤와 맞바꾼다 ---------- */

/* a[0..n-1] 가운데 root 아래만 힙이 아닐 수 있을 때, a[root]를 제자리까지 내려 보낸다 */
static void siftDown(int a[], int n, int root)
{
    int tmp = a[root];                      /* 손에 든 값 */
    int parent = root, child = 2 * root + 1;
    while (child < n) {
        if (child + 1 < n && a[child] < a[child + 1]) child++;   /* 더 큰 자식 */
        if (tmp >= a[child]) break;
        a[parent] = a[child];
        parent = child;
        child = 2 * parent + 1;
    }
    a[parent] = tmp;
}

/* 추적용: 단계마다 배열을 한 줄씩 적는다 */
static char *traceBuf = NULL;
static void record(const int a[], int n)
{
    if (traceBuf == NULL) return;
    for (int i = 0; i < n; i++) {
        size_t len = strlen(traceBuf);
        snprintf(traceBuf + len, 16, "%d%c", a[i], i == n - 1 ? '\n' : ' ');
    }
}

void heapSort(int a[], int n)
{
    /* (가) 힙 만들기: 자식이 있는 마지막 칸 n/2 - 1부터 0번 칸까지 거꾸로 */
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, n, i);
    record(a, n);
    /* (나) 가장 큰 값(0번 칸)을 힙의 마지막 칸과 맞바꾸고, 힙을 한 칸 줄인 뒤 뿌리를 내려 보낸다 */
    for (int last = n - 1; last > 0; last--) {
        int tmp = a[0];
        a[0] = a[last];
        a[last] = tmp;
        siftDown(a, last, 0);
        record(a, n);
    }
}

/* ---------- 시험 ---------- */

static int cmpInt(const void *x, const void *y)
{
    int a = *(const int *)x, b = *(const int *)y;
    return (a > b) - (a < b);
}

static unsigned long long seed = 28ULL;
static unsigned nextRand(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

static void compareWithQsort(const int *src, int n, const char *what)
{
    int *x = malloc(sizeof(int) * (size_t)(n + 1));
    int *y = malloc(sizeof(int) * (size_t)(n + 1));
    int *z = malloc(sizeof(int) * (size_t)(n + 1));
    if (x == NULL || y == NULL || z == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(1);
    }
    if (n > 0) {
        memcpy(x, src, sizeof(int) * (size_t)n);
        memcpy(y, src, sizeof(int) * (size_t)n);
        memcpy(z, src, sizeof(int) * (size_t)n);
        qsort(z, (size_t)n, sizeof(int), cmpInt);
    }
    pqSort(x, n);
    heapSort(y, n);
    for (int i = 0; i < n; i++) check(x[i] == z[i] && y[i] == z[i], what);
    free(x);
    free(y);
    free(z);
}

int main(void)
{
    /* 1. 문서 예시: 6, 8, 2, 4, 1 */
    {
        int a[] = {6, 8, 2, 4, 1}, heap[6], size = 0;
        const int afterPush[] = {8, 6, 2, 4, 1};
        for (int i = 0; i < 5; i++) pushMax(heap, &size, a[i]);
        check(memcmp(heap + 1, afterPush, sizeof(afterPush)) == 0, "다 넣은 뒤의 힙 [8, 6, 2, 4, 1]");
        int sorted[5] = {0, 0, 0, 0, 0};
        sorted[4] = popMax(heap, &size);
        check(sorted[4] == 8 && size == 4, "첫 꺼내기: 맨 오른쪽 칸에 8");
        sorted[3] = popMax(heap, &size);
        check(sorted[3] == 6 && size == 3, "둘째 꺼내기: 그 왼쪽 칸에 6");
        for (int i = 2; i >= 0; i--) sorted[i] = popMax(heap, &size);
        const int want[] = {1, 2, 4, 6, 8};
        check(memcmp(sorted, want, sizeof(want)) == 0 && size == 0, "다섯 번 꺼낸 뒤 1 2 4 6 8");
        pqSort(a, 5);
        check(memcmp(a, want, sizeof(want)) == 0, "pqSort 결과");
    }

    /* 2. 같은 입력의 힙 정렬 추적 (문서의 표) */
    {
        int a[] = {6, 8, 2, 4, 1};
        char trace[256] = "";
        traceBuf = trace;
        heapSort(a, 5);
        traceBuf = NULL;
        check(strcmp(trace,
                     "8 6 2 4 1\n"      /* 힙 만들기 */
                     "6 4 2 1 8\n"      /* 8을 맨 뒤로 */
                     "4 1 2 6 8\n"      /* 6을 그 앞으로 */
                     "2 1 4 6 8\n"
                     "1 2 4 6 8\n") == 0, "힙 정렬 추적 표");
    }

    /* 3. 카드의 값: 5, 3, 9, 1, 7, 2 */
    {
        int a[] = {5, 3, 9, 1, 7, 2};
        char trace[256] = "";
        traceBuf = trace;
        heapSort(a, 6);
        traceBuf = NULL;
        check(strncmp(trace, "9 7 5 1 3 2\n7 3 5 1 2 9\n5 3 2 1 7 9\n", 36) == 0, "카드: 힙 만들기와 두 단계");
        const int want[] = {1, 2, 3, 5, 7, 9};
        check(memcmp(a, want, sizeof(want)) == 0, "카드: 정렬 결과");
    }

    /* 4. 경계: 빈 배열, 하나, 모두 같은 값, 이미 정렬됨, 거꾸로 정렬됨 */
    {
        int one[] = {7}, same[] = {3, 3, 3, 3, 3, 3, 3};
        int up[50], down[50];
        for (int i = 0; i < 50; i++) { up[i] = i; down[i] = 50 - i; }
        compareWithQsort(one, 0, "빈 배열");
        compareWithQsort(one, 1, "하나");
        compareWithQsort(same, 7, "모두 같은 값");
        compareWithQsort(up, 50, "이미 정렬됨");
        compareWithQsort(down, 50, "거꾸로 정렬됨");
    }

    /* 5. 무작위 배열 2,000개(길이 0 ~ 200, 겹치는 값과 음수 포함): qsort와 같은 결과 */
    for (int trial = 0; trial < 2000; trial++) {
        int n = (int)(nextRand() % 201u), a[200];
        int range = 1 + (int)(nextRand() % 300u);
        for (int i = 0; i < n; i++) a[i] = (int)(nextRand() % (unsigned)range) - range / 2;
        compareWithQsort(a, n, "무작위 배열");
    }

    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
