---
layout: "note"
title: "19_linked-list-practice_p4.c"
display_title: "19_linked-list-practice_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-list-practice/"
parent_title: "연결 리스트 연습"
description: "자료구조 · 연결 리스트 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/19_linked-list-practice_p4/"
---
{% raw %}
[연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/) 문서의 문제 4 풀이 코드다.

```c
/* 연결 리스트 연습 문제 4: 연결 큐 따라가기와, 큐 하나를 차례를 지키며 둘로 나누기.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/19.연결 리스트 연습.md
 * enqueue, dequeue는 3.개념집/19_linked-queue_impl.c에서 옮겨 적었다. 둘로 나누는 문제는 변형 문제다.
 * 실행: cc -std=c11 -Wall -Wextra 19_linked-list-practice_p4.c -o p4 && ./p4
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveNodes = 0;

typedef int element;

typedef struct QueueNode {
    element item;
    struct QueueNode *link;
} QueueNode;

typedef struct {
    int count;
    QueueNode *front;
    QueueNode *rear;
} LinkedQueueType;

static void init(LinkedQueueType *q) { q->count = 0; q->front = q->rear = NULL; }
static int is_empty(LinkedQueueType *q) { return q->count == 0; }

static void enqueue(LinkedQueueType *q, element item)
{
    QueueNode *tmp = malloc(sizeof(QueueNode));
    if (tmp == NULL) { fprintf(stderr, "error\n"); exit(1); }
    liveNodes++;
    tmp->item = item;
    tmp->link = NULL;
    if (!is_empty(q)) { q->rear->link = tmp; q->rear = tmp; }
    else { q->front = q->rear = tmp; }
    q->count++;
}

static element dequeue(LinkedQueueType *q)
{
    if (is_empty(q)) { fprintf(stderr, "error\n"); exit(1); }
    QueueNode *tmp = q->front;
    element item = tmp->item;
    q->front = q->front->link;
    if (q->front == NULL) q->rear = NULL;
    q->count--;
    free(tmp);
    liveNodes--;
    return item;
}

/* ---------- 문서에 실은 코드 ---------- */

/* q의 원소를 모두 꺼내, 짝수는 even에 홀수는 odd에 넣는다. 들어온 차례는 그대로다 */
void split(LinkedQueueType *q, LinkedQueueType *even, LinkedQueueType *odd)
{
    while (!is_empty(q)) {
        element x = dequeue(q);
        if (x % 2 == 0) enqueue(even, x);
        else enqueue(odd, x);
    }
}

/* ---------- 여기부터 테스트 ---------- */

static int holds(LinkedQueueType *q, const int *want, int n)
{
    if (q->count != n) return 0;
    QueueNode *p = q->front;
    for (int i = 0; i < n; i++, p = p->link) if (p == NULL || p->item != want[i]) return 0;
    if (p != NULL) return 0;
    if (n == 0) return q->front == NULL && q->rear == NULL;
    return q->rear->item == want[n - 1] && q->rear->link == NULL;
}

int main(void)
{
    LinkedQueueType q;
    init(&q);

    /* (가) 따라가기 */
    enqueue(&q, 5);
    check(q.count == 1 && q.front == q.rear && q.front->item == 5, "enqueue 5: front == rear");
    enqueue(&q, 8);
    check(q.count == 2 && q.front->item == 5 && q.rear->item == 8 && q.front->link == q.rear, "enqueue 8");
    check(dequeue(&q) == 5 && q.count == 1 && q.front == q.rear && q.front->item == 8, "dequeue -> 5, front == rear");
    enqueue(&q, 2);
    check(q.count == 2 && q.front->item == 8 && q.rear->item == 2, "enqueue 2");
    check(dequeue(&q) == 8 && q.count == 1 && q.front->item == 2, "dequeue -> 8");
    check(dequeue(&q) == 2 && q.count == 0 && q.front == NULL && q.rear == NULL, "dequeue -> 2, 둘 다 NULL");
    check(liveNodes == 0, "(가) 뒤 노드가 남지 않는다");

    /* (나) 넣은 횟수 - 뺀 횟수 = count */
    for (int i = 1; i <= 7; i++) enqueue(&q, i * 10);
    for (int i = 1; i <= 3; i++) check(dequeue(&q) == i * 10, "먼저 넣은 것부터");
    check(q.count == 4 && liveNodes == 4 && q.front->item == 40 && q.rear->item == 70, "(나) 7번 넣고 3번 빼면 4개: 40 ~ 70");
    while (!is_empty(&q)) dequeue(&q);

    /* 변형: 둘로 나누기 */
    LinkedQueueType even, odd;
    init(&even); init(&odd);
    const int in[7] = { 3, 8, 6, 1, 4, 9, 2 };
    for (int i = 0; i < 7; i++) enqueue(&q, in[i]);
    split(&q, &even, &odd);
    const int wantEven[4] = { 8, 6, 4, 2 }, wantOdd[3] = { 3, 1, 9 };
    check(holds(&q, NULL, 0) && holds(&even, wantEven, 4) && holds(&odd, wantOdd, 3), "변형: 짝수 8 6 4 2, 홀수 3 1 9");
    check(liveNodes == 7, "변형: 노드 수는 그대로 7");
    split(&q, &even, &odd);
    check(holds(&even, wantEven, 4) && holds(&odd, wantOdd, 3), "변형: 빈 큐를 나눠도 그대로");
    while (!is_empty(&even)) dequeue(&even);
    while (!is_empty(&odd)) dequeue(&odd);

    check(liveNodes == 0, "malloc 횟수 = free 횟수");
    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
