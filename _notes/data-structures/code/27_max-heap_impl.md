---
layout: "note"
title: "27_max-heap_impl.c"
display_title: "27_max-heap_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/max-heap/"
parent_title: "최대 힙과 최소 힙"
description: "자료구조 · 최대 힙과 최소 힙 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/27_max-heap_impl/"
---
{% raw %}
[최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/) 문서의 구현 코드다.

```c
/*
 * 최대 힙과 최소 힙: 배열 하나로 만든 우선순위 큐
 *
 * 실행: cc -std=c11 -Wall -Wextra 27_max-heap_impl.c -o out && ./out
 *
 * 배열은 1번 칸부터 쓴다(0번 칸은 비워 둔다). i번 칸의 부모는 i / 2, 자식은 2 * i와 2 * i + 1.
 * 그래서 값 MAX_ELEMENT개를 담으려면 배열은 MAX_ELEMENT + 1칸이어야 한다.
 * 넣기와 꺼내기는 두 값을 맞바꾸지 않고 "구멍"을 옮긴다: 구멍 자리에 부모(또는 자식)를
 * 옮겨 적고 구멍을 한 층 옮기다가, 자리가 정해지면 손에 든 값을 한 번만 적는다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ELEMENT 200

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

/* 추적용: 마지막 연산에서 구멍이 지나간 칸 번호들과, 값을 옮겨 적은 횟수 */
static int holePath[32], holeLen, moves;

/* 추적용: snapBuf가 NULL이 아니면 배열을 한 줄씩 적는다. 구멍 칸은 '_'로 적는다(hole = 0이면 구멍 없음) */
static char *snapBuf = NULL;
static void snap(const heapType *h, int hole)
{
    if (snapBuf == NULL) return;
    for (int i = 1; i <= h->heap_size; i++) {
        size_t len = strlen(snapBuf);
        if (i == hole) snprintf(snapBuf + len, 16, "_");
        else           snprintf(snapBuf + len, 16, "%d", h->heap[i]);
        strcat(snapBuf, i == h->heap_size ? "\n" : " ");
    }
}

heapType *createHeap(void)
{
    heapType *h = malloc(sizeof(heapType));
    if (h == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    h->heap_size = 0;
    return h;
}

/* ---------- 최대 힙: 부모 >= 자식 ---------- */

int topHeap(const heapType *h)
{
    if (h->heap_size == 0) {
        fprintf(stderr, "Heap is empty\n");
        return -1;
    }
    return h->heap[1];
}

void pushHeap(heapType *h, int item)
{
    int i;
    if (h->heap_size >= MAX_ELEMENT) {
        fprintf(stderr, "Heap is full\n");
        return;
    }
    i = ++h->heap_size;                           /* 새 칸의 번호. 여기가 처음 구멍이다 */
    holeLen = 0; moves = 0; holePath[holeLen++] = i;
    snap(h, i);
    while (i != 1 && item > h->heap[i / 2]) {     /* 부모가 item보다 작으면 */
        h->heap[i] = h->heap[i / 2];              /* 부모를 구멍으로 내려 적고 */
        i /= 2;                                   /* 구멍은 부모 자리로 올라간다 */
        holePath[holeLen++] = i; moves++;
        snap(h, i);
    }
    h->heap[i] = item;                            /* 자리가 정해진 뒤에 한 번만 적는다 */
    snap(h, 0);
}

int popHeap(heapType *h)
{
    int parent, child, item, tmp;
    if (h->heap_size == 0) {
        fprintf(stderr, "Heap is empty\n");
        return -1;
    }
    item = h->heap[1];                            /* 돌려줄 값: 가장 큰 값 */
    tmp = h->heap[h->heap_size--];                /* 마지막 칸의 값을 떼어 손에 든다 */
    parent = 1;                                   /* 구멍은 뿌리에서 시작한다 */
    child = 2;
    holeLen = 0; moves = 0; holePath[holeLen++] = parent;
    snap(h, parent);
    while (child <= h->heap_size) {
        if (child < h->heap_size && h->heap[child] < h->heap[child + 1])
            child++;                              /* 두 자식 가운데 더 큰 쪽 */
        if (tmp >= h->heap[child]) break;         /* 손에 든 값이 두 자식보다 작지 않으면 여기다 */
        h->heap[parent] = h->heap[child];         /* 큰 자식을 구멍으로 올려 적고 */
        parent = child;                           /* 구멍은 그 자식 자리로 내려간다 */
        child *= 2;
        holePath[holeLen++] = parent; moves++;
        snap(h, parent);
    }
    h->heap[parent] = tmp;
    if (h->heap_size > 0) snap(h, 0);
    return item;
}

/* ---------- 최소 힙: 부모 <= 자식. 최대 힙과 부등호 세 군데만 다르다 ---------- */

void pushMinHeap(heapType *h, int item)
{
    int i;
    if (h->heap_size >= MAX_ELEMENT) {
        fprintf(stderr, "Heap is full\n");
        return;
    }
    i = ++h->heap_size;
    while (i != 1 && item < h->heap[i / 2]) {     /* (1) 부모가 item보다 크면 */
        h->heap[i] = h->heap[i / 2];
        i /= 2;
    }
    h->heap[i] = item;
}

int popMinHeap(heapType *h)
{
    int parent, child, item, tmp;
    if (h->heap_size == 0) {
        fprintf(stderr, "Heap is empty\n");
        return -1;
    }
    item = h->heap[1];
    tmp = h->heap[h->heap_size--];
    parent = 1;
    child = 2;
    while (child <= h->heap_size) {
        if (child < h->heap_size && h->heap[child] > h->heap[child + 1])
            child++;                              /* (2) 더 작은 자식 */
        if (tmp <= h->heap[child]) break;         /* (3) 두 자식보다 크지 않으면 여기다 */
        h->heap[parent] = h->heap[child];
        parent = child;
        child *= 2;
    }
    h->heap[parent] = tmp;
    return item;
}

/* ---------- 검사 도구 ---------- */

/* 표현 불변식: 2번 칸부터 마지막 칸까지, 부모가 자식보다 작지 않다(최소 힙이면 크지 않다) */
static int isHeap(const heapType *h, int isMax)
{
    if (h->heap_size < 0 || h->heap_size > MAX_ELEMENT) return 0;
    for (int i = 2; i <= h->heap_size; i++) {
        if (isMax  && h->heap[i / 2] < h->heap[i]) return 0;
        if (!isMax && h->heap[i / 2] > h->heap[i]) return 0;
    }
    return 1;
}

static int sameArray(const heapType *h, const int *want, int n)
{
    if (h->heap_size != n) return 0;
    for (int i = 0; i < n; i++)
        if (h->heap[i + 1] != want[i]) return 0;
    return 1;
}

static int samePath(const int *want, int n)
{
    if (holeLen != n) return 0;
    for (int i = 0; i < n; i++)
        if (holePath[i] != want[i]) return 0;
    return 1;
}

/* floor(lg n): n >= 1. 노드 n개인 완전 이진 트리의 높이(간선 수) */
static int floorLg(int n)
{
    int k = 0;
    while (n > 1) { n /= 2; k++; }
    return k;
}

static unsigned long long seed = 27ULL;
static unsigned nextRand(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

int main(void)
{
    heapType *h = createHeap();

    /* 1. 문서 예시의 최대 힙. 이 차례로 넣으면 값마다 부모보다 크지 않아 그 자리에 그대로 놓인다 */
    const int example[] = {9, 8, 7, 6, 7, 2, 6, 5, 1};
    for (int i = 0; i < 9; i++) pushHeap(h, example[i]);
    check(sameArray(h, example, 9) && isHeap(h, 1), "예시 힙 배열 [9, 8, 7, 6, 7, 2, 6, 5, 1]");
    check(topHeap(h) == 9, "뿌리가 가장 큰 값 9");
    check(h->heap[4 / 2] == 8 && h->heap[2 * 4] == 5 && h->heap[2 * 4 + 1] == 1,
          "4번 칸(6)의 부모는 2번(8), 자식은 8번(5)과 9번(1)");
    /* 같은 값을 0번 칸부터 적으면 j = i - 1번 칸: 3번 칸(6)의 자식은 2j + 1 = 7번(5), 2j + 2 = 8번(1) */
    check(example[(3 - 1) / 2] == 8 && example[2 * 3 + 1] == 5 && example[2 * 3 + 2] == 1, "0번 칸부터 쓰는 규칙");
    check(floorLg(9) == 3, "노드 9개: 높이 3(간선), 층 4개. log2(10) = 3.32는 정수가 아니다");

    /* 2. 5를 넣으면 10번 칸에 그대로 놓인다 (부모 7보다 작다) */
    pushHeap(h, 5);
    {
        const int want[] = {9, 8, 7, 6, 7, 2, 6, 5, 1, 5};
        const int path[] = {10};
        check(sameArray(h, want, 10) && samePath(path, 1) && moves == 0, "5 넣기: 옮긴 값 없음");
    }
    h->heap_size = 0;                             /* 다음 시험을 위해 예시 힙을 새로 만든다 */
    for (int i = 0; i < 9; i++) pushHeap(h, example[i]);

    /* 3. 20을 넣으면 구멍이 10 -> 5 -> 2 -> 1로 올라간다 */
    char shot[512] = "";
    snapBuf = shot;
    pushHeap(h, 20);
    check(strcmp(shot,
                 "9 8 7 6 7 2 6 5 1 _\n"
                 "9 8 7 6 _ 2 6 5 1 7\n"
                 "9 _ 7 6 8 2 6 5 1 7\n"
                 "_ 9 7 6 8 2 6 5 1 7\n"
                 "20 9 7 6 8 2 6 5 1 7\n") == 0, "문서의 표: 20 넣기");
    {
        const int want[] = {20, 9, 7, 6, 8, 2, 6, 5, 1, 7};
        const int path[] = {10, 5, 2, 1};
        check(sameArray(h, want, 10) && samePath(path, 4) && moves == 3, "20 넣기");
    }
    /* 이어서 15를 넣으면 구멍이 11 -> 5 -> 2 */
    shot[0] = '\0';
    pushHeap(h, 15);
    check(strcmp(shot,
                 "20 9 7 6 8 2 6 5 1 7 _\n"
                 "20 9 7 6 _ 2 6 5 1 7 8\n"
                 "20 _ 7 6 9 2 6 5 1 7 8\n"
                 "20 15 7 6 9 2 6 5 1 7 8\n") == 0, "문서의 표: 15 넣기");
    {
        const int want[] = {20, 15, 7, 6, 9, 2, 6, 5, 1, 7, 8};
        const int path[] = {11, 5, 2};
        check(sameArray(h, want, 11) && samePath(path, 3) && moves == 2, "15 넣기");
    }
    check(isHeap(h, 1), "넣은 뒤에도 최대 힙");

    /* 4. 가장 큰 값 20을 꺼낸다. 마지막 값 8을 들고 구멍이 1 -> 2 -> 5 */
    shot[0] = '\0';
    check(popHeap(h) == 20, "첫 꺼내기는 20");
    check(strcmp(shot,
                 "_ 15 7 6 9 2 6 5 1 7\n"
                 "15 _ 7 6 9 2 6 5 1 7\n"
                 "15 9 7 6 _ 2 6 5 1 7\n"
                 "15 9 7 6 8 2 6 5 1 7\n") == 0, "문서의 표: 20 꺼내기");
    {
        const int want[] = {15, 9, 7, 6, 8, 2, 6, 5, 1, 7};
        const int path[] = {1, 2, 5};
        check(sameArray(h, want, 10) && samePath(path, 3) && moves == 2, "20을 꺼낸 뒤");
    }
    /* 15를 꺼낸다. 마지막 값 7을 들고 구멍이 1 -> 2 -> 5 */
    shot[0] = '\0';
    check(popHeap(h) == 15, "둘째 꺼내기는 15");
    check(strcmp(shot,
                 "_ 9 7 6 8 2 6 5 1\n"
                 "9 _ 7 6 8 2 6 5 1\n"
                 "9 8 7 6 _ 2 6 5 1\n"
                 "9 8 7 6 7 2 6 5 1\n") == 0, "문서의 표: 15 꺼내기");
    snapBuf = NULL;
    {
        const int path[] = {1, 2, 5};
        check(sameArray(h, example, 9) && samePath(path, 3) && moves == 2, "15를 꺼낸 뒤 처음의 예시 힙");
    }

    /* 5. 카드의 값 */
    h->heap_size = 0;
    {
        const int in[] = {3, 9, 5, 12, 7};
        const int afterPush[] = {12, 9, 5, 3, 7};
        const int afterPop[] = {9, 7, 5, 3};
        for (int i = 0; i < 5; i++) pushHeap(h, in[i]);
        check(sameArray(h, afterPush, 5), "카드: 3, 9, 5, 12, 7을 넣으면 [12, 9, 5, 3, 7]");
        check(popHeap(h) == 12 && sameArray(h, afterPop, 4), "카드: 한 번 꺼내면 [9, 7, 5, 3]");
    }
    /* 큰 자식이 아니라 왼쪽 자식을 늘 올리면 힙이 깨지는 예: [9, 5, 8]에 4를 들고 내려갈 때 */
    {
        int a[] = {0, 9, 5, 8, 4};                /* 1번 칸부터 [9, 5, 8, 4]. 9를 꺼내고 4를 든다 */
        int hole = 1, tmp = a[4];                 /* 남는 칸은 1 ~ 3번 */
        a[hole] = a[2]; hole = 2;                 /* 큰 쪽(8)이 아니라 왼쪽 자식 5를 올렸다 */
        a[hole] = tmp;                            /* 결과 [5, 4, 8] */
        check(a[1] == 5 && a[2] == 4 && a[3] == 8 && a[1] < a[3], "왼쪽만 올리면 뿌리 5 < 오른쪽 자식 8");
        h->heap_size = 0;                         /* 제대로 하면 [8, 5, 4] */
        pushHeap(h, 9); pushHeap(h, 5); pushHeap(h, 8); pushHeap(h, 4);
        const int want[] = {8, 5, 4};
        check(popHeap(h) == 9 && sameArray(h, want, 3), "큰 자식을 올리면 [8, 5, 4]");
    }

    /* 6. 경계: 빈 힙, 하나짜리, 꽉 찬 힙 (아래 두 줄의 오류 메시지는 일부러 낸 것이다) */
    h->heap_size = 0;
    printf("(다음 두 줄은 빈 힙에서 꺼내기와 꽉 찬 힙에 넣기를 일부러 시험한 것이다)\n");
    fflush(stdout);
    check(popHeap(h) == -1 && h->heap_size == 0, "빈 힙에서 꺼내면 -1");
    pushHeap(h, 42);
    check(topHeap(h) == 42 && popHeap(h) == 42 && h->heap_size == 0, "하나 넣고 꺼내기");
    for (int i = 0; i < MAX_ELEMENT; i++) pushHeap(h, i);
    check(h->heap_size == MAX_ELEMENT && isHeap(h, 1), "MAX_ELEMENT개까지 들어간다");
    pushHeap(h, 999);
    check(h->heap_size == MAX_ELEMENT && topHeap(h) == MAX_ELEMENT - 1, "꽉 차면 더 넣지 않는다");
    h->heap_size = 0;

    /* 7. 무작위 넣기·꺼내기 2,000묶음: 정렬해 둔 배열(단순한 모형)과 같은 값을 꺼낸다 */
    heapType *mn = createHeap();
    long ops = 0;
    for (int trial = 0; trial < 2000; trial++) {
        int model[MAX_ELEMENT], m = 0;            /* 오름차순으로 정렬해 둔다 */
        h->heap_size = 0;
        mn->heap_size = 0;
        int steps = 20 + (int)(nextRand() % 100u);
        for (int s = 0; s < steps; s++) {
            if (m == 0 || (m < MAX_ELEMENT && nextRand() % 5u < 3u)) {
                int x = (int)(nextRand() % 100u), j = m;
                pushHeap(h, x);
                check(moves <= floorLg(h->heap_size), "넣기: 옮긴 횟수 <= floor(lg n)");
                pushMinHeap(mn, x);
                while (j > 0 && model[j - 1] > x) { model[j] = model[j - 1]; j--; }
                model[j] = x;
                m++;
            } else if (nextRand() % 2u == 0) {
                int sizeBefore = h->heap_size;
                check(topHeap(h) == model[m - 1], "top = 가장 큰 값");
                check(popHeap(h) == model[m - 1], "최대 힙에서 꺼낸 값 = 가장 큰 값");
                check(moves <= floorLg(sizeBefore), "꺼내기: 옮긴 횟수 <= floor(lg n)");
                /* 모형에서 같은 값을 지우고, 최소 힙도 같은 내용이 되도록 다시 만든다 */
                m--;
                mn->heap_size = 0;
                for (int i = 0; i < m; i++) pushMinHeap(mn, model[i]);
            } else {
                check(popMinHeap(mn) == model[0], "최소 힙에서 꺼낸 값 = 가장 작은 값");
                for (int i = 1; i < m; i++) model[i - 1] = model[i];
                m--;
                h->heap_size = 0;
                for (int i = 0; i < m; i++) pushHeap(h, model[i]);
            }
            check(h->heap_size == m && mn->heap_size == m, "크기");
            check(isHeap(h, 1) && isHeap(mn, 0), "연산마다 불변식");
            ops++;
        }
        /* 남은 것을 모두 꺼내면 내림차순(최대 힙), 오름차순(최소 힙) */
        for (int i = m - 1; i >= 0; i--) check(popHeap(h) == model[i], "최대 힙: 큰 것부터");
        for (int i = 0; i < m; i++) check(popMinHeap(mn) == model[i], "최소 힙: 작은 것부터");
    }

    /* 8. 최대 힙에서 가장 작은 값은 늘 잎(칸 n/2 + 1 ~ n)에 있다 (값이 서로 다를 때) */
    for (int trial = 0; trial < 500; trial++) {
        int n = 2 + (int)(nextRand() % 60u), used[1000] = {0}, where = 0;
        h->heap_size = 0;
        for (int i = 0; i < n; i++) {
            int x;
            do { x = (int)(nextRand() % 1000u); } while (used[x]);
            used[x] = 1;
            pushHeap(h, x);
        }
        for (int i = 1; i <= n; i++)
            if (where == 0 || h->heap[i] < h->heap[where]) where = i;
        check(where > n / 2, "가장 작은 값은 잎에 있다");
    }

    /* 9. 방향을 잘못 고른 예: 가장 덜 매운 둘이 필요한데 최대 힙에 넣었다 */
    {
        const int scoville[] = {1, 2, 3, 9, 10, 12};
        h->heap_size = 0;
        mn->heap_size = 0;
        for (int i = 0; i < 6; i++) { pushHeap(h, scoville[i]); pushMinHeap(mn, scoville[i]); }
        check(topHeap(h) == 12, "최대 힙의 뿌리는 12: '모두 7 이상'이라고 잘못 읽게 된다");
        check(mn->heap[1] == 1, "최소 힙의 뿌리는 1: 7보다 작은 것이 있다");
        check(popHeap(h) == 12 && popHeap(h) == 10, "최대 힙에서 둘을 꺼내면 가장 큰 12, 10");
        check(popMinHeap(mn) == 1 && popMinHeap(mn) == 2, "최소 힙에서 둘을 꺼내면 가장 작은 1, 2");
    }

    free(h);
    free(mn);
    printf("무작위 연산 %ld번에서 모형과 일치, 불변식 유지\n", ops);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
