---
layout: "note"
title: "30_week9-inclass_p3.c"
display_title: "30_week9-inclass_p3.c"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "30"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/week9-inclass/"
parent_title: "트리와 힙 문제 풀이"
description: "자료구조 · 트리와 힙 문제 풀이 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/30_week9-inclass_p3/"
---
{% raw %}
[트리와 힙 문제 풀이](/Hongs_Blog/studies/data-structures/week9-inclass/) 문서의 문제 3 풀이 코드다.

```c
/* 트리와 힙 문제 3: 더 맵게 (프로그래머스 42626)
 *
 * 문서: 트리와 힙 문제 풀이(연습 30)의 p3
 * 최소 힙 풀이에서 챙긴 곳
 *   - 반복 조건에 처음 개수 n을 쓰면 n이 줄지 않아, 답이 -1인 입력에서 끝나지 않는다 -> 힙에 남은 개수로 판단한다.
 *   - 오류 문구는 fprintf(stderr, ...)로 찍는다(printf(stderr, ...)는 잘못이다).
 *   - 만든 힙은 destroyHeap으로 푼다.
 *   - 힙 크기를 100칸으로 굳히지 않고 음식 수만큼 잡는다.
 *   - 섞은 값 a + 2b가 int를 넘을 수 있다 -> long long으로 담는다.
 * 실행: cc -std=c11 -Wall -Wextra 30_week9-inclass_p3.c -o p3 && ./p3
 *
 * 문제: 가장 안 매운 두 음식을 꺼내 "가장 안 매운 것 + 둘째로 안 매운 것 x 2"인 새 음식으로 바꾼다.
 *       모든 음식이 K 이상이 될 때까지 섞는 횟수의 최솟값을 구한다. 그렇게 만들 수 없으면 -1.
 * 힙은 1번 칸부터 쓰는 최소 힙이다: i번 칸의 부모는 i / 2, 자식은 2i와 2i + 1.
 *
 * 확인하는 것
 *   1. 문서의 예 [1, 2, 3, 9, 10, 12], K = 7 -> 2. 변형 (가)의 K = 15 -> 4.
 *   2. 만들 수 없는 입력 [1, 2], K = 100 -> -1, [1, 1, 1], K = 10 -> -1 (처음 개수 n으로 검사하는 판은 여기서 끝나지 않는다).
 *   3. 처음부터 모두 K 이상이면 0. 음식이 하나뿐인 경우.
 *   4. 큰 값: [900000000, 900000000], K = 1000000000 -> 1 (섞은 값 2,700,000,000은 int를 넘는다).
 *   5. 무작위 2,000개에서 느린 풀이(매번 배열에서 가장 작은 둘을 찾는다)와 같은 답.
 *   6. 넣고 꺼낼 때마다 최소 힙 규칙(부모 <= 자식)이 맞다. malloc 횟수 = free 횟수.
 */
#include <stdio.h>
#include <stdlib.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct {
    long long *heap;   /* heap[1 .. heap_size]. 0번 칸은 쓰지 않는다 */
    int heap_size;
    int capacity;
} heapType;

static long liveBlocks;   /* malloc 횟수 - free 횟수 */

heapType *createHeap(int capacity)
{
    heapType *h = malloc(sizeof(heapType));
    if (h == NULL) { fprintf(stderr, "Memory allocation failed\n"); exit(1); }
    h->heap = malloc((size_t)(capacity + 1) * sizeof(long long));
    if (h->heap == NULL) { fprintf(stderr, "Memory allocation failed\n"); exit(1); }
    liveBlocks += 2;
    h->heap_size = 0;
    h->capacity = capacity;
    return h;
}

void destroyHeap(heapType *h)
{
    free(h->heap);
    free(h);
    liveBlocks -= 2;
}

/* 가장 작은 값. 비어 있으면 부르지 않는다 */
long long topHeap(const heapType *h)
{
    return h->heap[1];
}

void pushHeap(heapType *h, long long item)
{
    if (h->heap_size >= h->capacity) { fprintf(stderr, "Heap is full\n"); exit(1); }
    int i = ++h->heap_size;                        /* 맨 끝에 구멍을 하나 만든다 */
    while (i != 1 && item < h->heap[i / 2]) {      /* 부모가 더 크면 부모를 구멍으로 내린다 */
        h->heap[i] = h->heap[i / 2];
        i /= 2;
    }
    h->heap[i] = item;
}

long long popHeap(heapType *h)
{
    if (h->heap_size == 0) { fprintf(stderr, "Heap is empty\n"); exit(1); }
    long long item = h->heap[1];                   /* 돌려줄 가장 작은 값 */
    long long tmp = h->heap[h->heap_size--];       /* 맨 끝 값을 들고 */
    int parent = 1, child = 2;                     /* 뿌리의 구멍을 아래로 내린다 */
    while (child <= h->heap_size) {
        if (child < h->heap_size && h->heap[child] > h->heap[child + 1]) child++;   /* 더 작은 자식 */
        if (tmp <= h->heap[child]) break;
        h->heap[parent] = h->heap[child];
        parent = child;
        child *= 2;
    }
    h->heap[parent] = tmp;
    return item;
}

int solution(const int scoville[], int n, int k)
{
    heapType *h = createHeap(n);
    for (int i = 0; i < n; i++) pushHeap(h, scoville[i]);
    int cnt = 0;
    while (topHeap(h) < k) {               /* 가장 안 매운 것이 아직 K보다 작다 */
        if (h->heap_size < 2) {            /* 섞을 짝이 없다: 만들 수 없다 */
            cnt = -1;
            break;
        }
        long long a = popHeap(h);          /* 가장 안 매운 것 */
        long long b = popHeap(h);          /* 둘째로 안 매운 것 */
        pushHeap(h, a + b * 2);
        cnt++;
    }
    destroyHeap(h);
    return cnt;
}

/* ---- 테스트 ---- */

static int heapOK(const heapType *h)
{
    for (int i = 2; i <= h->heap_size; i++) if (h->heap[i / 2] > h->heap[i]) return 0;
    return 1;
}

/* 느린 풀이: 매번 배열을 훑어 가장 작은 둘을 찾는다 */
static int slowSolution(const int scoville[], int n, int k)
{
    long long a[64];
    for (int i = 0; i < n; i++) a[i] = scoville[i];
    int cnt = 0;
    for (;;) {
        int lo = 0;
        for (int i = 1; i < n; i++) if (a[i] < a[lo]) lo = i;
        if (a[lo] >= k) return cnt;
        if (n < 2) return -1;
        long long first = a[lo];
        a[lo] = a[--n];                              /* 가장 작은 것을 뺀다 */
        int lo2 = 0;
        for (int i = 1; i < n; i++) if (a[i] < a[lo2]) lo2 = i;
        a[lo2] = first + 2 * a[lo2];                 /* 둘째로 작은 것 자리에 섞은 값을 둔다 */
        cnt++;
    }
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

int main(void)
{
    /* 1. 문서의 예 */
    int s[] = {1, 2, 3, 9, 10, 12};
    CHECK(solution(s, 6, 7) == 2, "[1, 2, 3, 9, 10, 12], K = 7 -> 2");
    CHECK(solution(s, 6, 15) == 4, "[1, 2, 3, 9, 10, 12], K = 15 -> 4");
    printf("[OK] 문서의 예 K = 7 -> %d, 변형 (가)의 K = 15 -> %d\n", solution(s, 6, 7), solution(s, 6, 15));

    /* 2. 만들 수 없는 입력 */
    int t1[] = {1, 2}, t2[] = {1, 1, 1};
    CHECK(solution(t1, 2, 100) == -1, "[1, 2], K = 100 -> -1");
    CHECK(solution(t2, 3, 10) == -1, "[1, 1, 1], K = 10 -> -1");
    printf("[OK] 만들 수 없는 입력 [1, 2] (K = 100), [1, 1, 1] (K = 10): -1을 돌려주고 끝난다\n");

    /* 3. 경계 */
    int t3[] = {7, 8, 9}, t4[] = {5}, t5[] = {2};
    CHECK(solution(t3, 3, 7) == 0, "처음부터 모두 K 이상이면 0");
    CHECK(solution(t4, 1, 3) == 0 && solution(t5, 1, 3) == -1, "하나뿐일 때: 이미 넘으면 0, 아니면 -1");
    CHECK(solution(s, 6, 0) == 0, "K = 0이면 0");
    printf("[OK] 경계: 처음부터 모두 K 이상이면 0, 음식이 하나뿐이고 모자라면 -1\n");

    /* 4. int를 넘는 섞은 값 */
    int t6[] = {900000000, 900000000};
    CHECK(solution(t6, 2, 1000000000) == 1, "9억 + 2 x 9억 = 27억을 long long으로 담는다");
    printf("[OK] 큰 값: [9억, 9억], K = 10억 -> 1 (섞은 값 27억은 int에 안 들어간다)\n");

    /* 6. 힙 규칙 */
    heapType *h = createHeap(40);
    long long last = -1;
    for (int i = 0; i < 40; i++) { pushHeap(h, rnd() % 50); CHECK(heapOK(h), "넣은 뒤 부모 <= 자식"); }
    for (int i = 0; i < 40; i++) {
        long long x = popHeap(h);
        CHECK(heapOK(h) && x >= last, "꺼낸 뒤에도 규칙이 맞고, 작은 값부터 나온다");
        last = x;
    }
    destroyHeap(h);

    /* 5. 무작위 */
    int minusOne = 0;
    for (int trial = 0; trial < 2000; trial++) {
        int n = 1 + (int)(rnd() % 12), a[12];
        for (int i = 0; i < n; i++) a[i] = (int)(rnd() % 20);
        int k = (int)(rnd() % 400);
        int got = solution(a, n, k);
        CHECK(got == slowSolution(a, n, k), "느린 풀이와 같은 답");
        if (got == -1) minusOne++;
    }
    CHECK(minusOne > 50, "-1인 경우도 충분히 나왔다");
    printf("[OK] 무작위 2000개: 느린 풀이와 같은 답(-1인 경우 %d개 포함)\n", minusOne);

    CHECK(liveBlocks == 0, "malloc 횟수 = free 횟수");
    printf("[OK] 힙 규칙이 넣고 꺼낼 때마다 맞고, malloc 횟수와 free 횟수가 같다\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
