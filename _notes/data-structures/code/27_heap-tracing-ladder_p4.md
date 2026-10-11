---
layout: "note"
title: "27_heap-tracing-ladder_p4.c"
display_title: "27_heap-tracing-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "27"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/heap-tracing-ladder/"
parent_title: "힙 삽입·삭제 추적 예제 사다리"
description: "자료구조 · 힙 삽입·삭제 추적 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/27_heap-tracing-ladder_p4/"
---
{% raw %}
[힙 삽입·삭제 추적 예제 사다리](/Hongs_Blog/studies/data-structures/heap-tracing-ladder/) 문서의 문제 4 풀이 코드다.

```c
/*
 * 힙 삽입·삭제 추적 예제 사다리: 문제 1 ~ 4의 답 확인
 *
 * 실행: cc -std=c11 -Wall -Wextra 27_heap-tracing-ladder_p4.c -o out && ./out
 *
 * 배열은 1번 칸부터 쓴다(부모 i / 2, 자식 2i, 2i + 1).
 * 연산마다 "구멍이 한 칸 움직일 때의 배열"을 한 줄씩 적어(구멍은 '_') 문서의 풀이와 비교한다.
 * isMax가 1이면 최대 힙, 0이면 최소 힙이다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ELEMENT 32

typedef struct {
    int heap[MAX_ELEMENT + 1];
    int heap_size;
} heapType;

static void check(int ok, const char *what)
{
    if (!ok) {
        fprintf(stderr, "CHECK FAILED: %s\n", what);
        exit(1);
    }
}

static char shot[1024];

static void snap(const heapType *h, int hole)
{
    for (int i = 1; i <= h->heap_size; i++) {
        size_t len = strlen(shot);
        if (i == hole) snprintf(shot + len, 16, "_");
        else           snprintf(shot + len, 16, "%d", h->heap[i]);
        strcat(shot, i == h->heap_size ? "\n" : " ");
    }
}

/* a가 b보다 "위에 있어야 하는가": 최대 힙이면 더 큰가, 최소 힙이면 더 작은가 */
static int above(int a, int b, int isMax)
{
    return isMax ? a > b : a < b;
}

static void pushHeap(heapType *h, int item, int isMax)
{
    int i = ++h->heap_size;
    shot[0] = '\0';
    snap(h, i);
    while (i != 1 && above(item, h->heap[i / 2], isMax)) {
        h->heap[i] = h->heap[i / 2];
        i /= 2;
        snap(h, i);
    }
    h->heap[i] = item;
    snap(h, 0);
}

static int popHeap(heapType *h, int isMax)
{
    int item = h->heap[1], tmp = h->heap[h->heap_size--];
    int parent = 1, child = 2;
    shot[0] = '\0';
    snap(h, parent);
    while (child <= h->heap_size) {
        if (child < h->heap_size && above(h->heap[child + 1], h->heap[child], isMax)) child++;
        if (!above(h->heap[child], tmp, isMax)) break;
        h->heap[parent] = h->heap[child];
        parent = child;
        child *= 2;
        snap(h, parent);
    }
    h->heap[parent] = tmp;
    if (h->heap_size > 0) snap(h, 0);
    return item;
}

static void load(heapType *h, const int *a, int n)
{
    h->heap_size = n;
    for (int i = 0; i < n; i++) h->heap[i + 1] = a[i];
}

static int isHeap(const heapType *h, int isMax)
{
    for (int i = 2; i <= h->heap_size; i++)
        if (above(h->heap[i], h->heap[i / 2], isMax)) return 0;
    return 1;
}

int main(void)
{
    heapType h;

    /* 문제 1: 슬라이드 p.79~82. 9 8 7 6 7 2 6 5 1에 20, 15를 넣고 두 번 꺼낸다 */
    {
        const int a[] = {9, 8, 7, 6, 7, 2, 6, 5, 1};
        load(&h, a, 9);
        check(isHeap(&h, 1), "문제 1: 처음 배열이 최대 힙");
        pushHeap(&h, 20, 1);
        check(strcmp(shot, "9 8 7 6 7 2 6 5 1 _\n9 8 7 6 _ 2 6 5 1 7\n9 _ 7 6 8 2 6 5 1 7\n"
                           "_ 9 7 6 8 2 6 5 1 7\n20 9 7 6 8 2 6 5 1 7\n") == 0, "문제 1: 20 넣기");
        pushHeap(&h, 15, 1);
        check(strcmp(shot, "20 9 7 6 8 2 6 5 1 7 _\n20 9 7 6 _ 2 6 5 1 7 8\n20 _ 7 6 9 2 6 5 1 7 8\n"
                           "20 15 7 6 9 2 6 5 1 7 8\n") == 0, "문제 1: 15 넣기");
        check(popHeap(&h, 1) == 20, "문제 1: 첫 꺼내기 20");
        check(strcmp(shot, "_ 15 7 6 9 2 6 5 1 7\n15 _ 7 6 9 2 6 5 1 7\n15 9 7 6 _ 2 6 5 1 7\n"
                           "15 9 7 6 8 2 6 5 1 7\n") == 0, "문제 1: 20을 꺼낸 뒤");
        check(popHeap(&h, 1) == 15, "문제 1: 둘째 꺼내기 15");
        check(strcmp(shot, "_ 9 7 6 8 2 6 5 1\n9 _ 7 6 8 2 6 5 1\n9 8 7 6 _ 2 6 5 1\n"
                           "9 8 7 6 7 2 6 5 1\n") == 0, "문제 1: 15를 꺼낸 뒤");
    }

    /* 문제 2: 50 30 40 10 20 35에 45를 넣고 한 번 꺼낸다 */
    {
        const int a[] = {50, 30, 40, 10, 20, 35};
        load(&h, a, 6);
        check(isHeap(&h, 1), "문제 2: 처음 배열이 최대 힙");
        pushHeap(&h, 45, 1);
        check(strcmp(shot, "50 30 40 10 20 35 _\n50 30 _ 10 20 35 40\n50 30 45 10 20 35 40\n") == 0,
              "문제 2: 45 넣기");
        check(popHeap(&h, 1) == 50, "문제 2: 꺼낸 값 50");
        check(strcmp(shot, "_ 30 45 10 20 35\n45 30 _ 10 20 35\n45 30 40 10 20 35\n") == 0,
              "문제 2: 50을 꺼낸 뒤");
    }

    /* 문제 3: 90 70 80 30 60 50 20 10에 85를 넣고 두 번 꺼낸다 */
    {
        const int a[] = {90, 70, 80, 30, 60, 50, 20, 10};
        load(&h, a, 8);
        check(isHeap(&h, 1), "문제 3: 처음 배열이 최대 힙");
        pushHeap(&h, 85, 1);
        check(strcmp(shot, "90 70 80 30 60 50 20 10 _\n90 70 80 _ 60 50 20 10 30\n"
                           "90 _ 80 70 60 50 20 10 30\n90 85 80 70 60 50 20 10 30\n") == 0, "문제 3: 85 넣기");
        check(popHeap(&h, 1) == 90, "문제 3: 첫 꺼내기 90");
        check(strcmp(shot, "_ 85 80 70 60 50 20 10\n85 _ 80 70 60 50 20 10\n85 70 80 _ 60 50 20 10\n"
                           "85 70 80 30 60 50 20 10\n") == 0, "문제 3: 90을 꺼낸 뒤");
        check(popHeap(&h, 1) == 85, "문제 3: 둘째 꺼내기 85");
        check(strcmp(shot, "_ 70 80 30 60 50 20\n80 70 _ 30 60 50 20\n80 70 50 30 60 _ 20\n"
                           "80 70 50 30 60 10 20\n") == 0, "문제 3: 85를 꺼낸 뒤");
    }

    /* 문제 4: 빈 최소 힙에 8, 3, 6, 1, 5, 2를 넣고 두 번 꺼낸다 */
    {
        const int in[] = {8, 3, 6, 1, 5, 2};
        const char *afterEach[] = {
            "8\n", "3 8\n", "3 8 6\n", "1 3 6 8\n", "1 3 6 8 5\n", "1 3 2 8 5 6\n",
        };
        h.heap_size = 0;
        for (int i = 0; i < 6; i++) {
            pushHeap(&h, in[i], 0);
            const char *last = strrchr(shot, '\n');           /* 마지막 줄 = 넣은 뒤의 배열 */
            const char *p = last;
            while (p > shot && p[-1] != '\n') p--;
            check(strcmp(p, afterEach[i]) == 0, "문제 4: 넣을 때마다의 배열");
            check(isHeap(&h, 0), "문제 4: 최소 힙");
        }
        check(popHeap(&h, 0) == 1, "문제 4: 첫 꺼내기 1");
        check(strcmp(shot, "_ 3 2 8 5\n2 3 _ 8 5\n2 3 6 8 5\n") == 0, "문제 4: 1을 꺼낸 뒤");
        check(popHeap(&h, 0) == 2, "문제 4: 둘째 꺼내기 2");
        check(strcmp(shot, "_ 3 6 8\n3 _ 6 8\n3 5 6 8\n") == 0, "문제 4: 2를 꺼낸 뒤");
        /* 같은 값들을 최대 힙에 넣으면 배열이 다르다 */
        h.heap_size = 0;
        for (int i = 0; i < 6; i++) pushHeap(&h, in[i], 1);
        const int want[] = {8, 5, 6, 1, 3, 2};
        for (int i = 0; i < 6; i++) check(h.heap[i + 1] == want[i], "문제 4: 최대 힙이면 8 5 6 1 3 2");
    }

    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
