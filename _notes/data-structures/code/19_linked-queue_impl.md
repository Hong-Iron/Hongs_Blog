---
layout: "note"
title: "19_linked-queue_impl.c"
display_title: "19_linked-queue_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-queue/"
parent_title: "연결 리스트로 만든 큐"
description: "자료구조 · 연결 리스트로 만든 큐 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/19_linked-queue_impl/"
---
{% raw %}
[연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/) 문서의 구현 코드다.

```c
/* 연결 리스트로 만든 큐: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/19.연결 리스트로 만든 큐.md
 * 출처: 자료구조 5주차 슬라이드 p.32~36. 슬라이드 코드를 컴파일되게 고쳤다.
 *       (p.34의 typedef 이름이 StackeNode이고, p.35~36의 함수는 p.34와 다른 이름 queue, node, data, next를 쓴다.
 *        p.36의 dequeue는 빈 큐인지 보지 않고, 마지막 노드를 뺀 뒤 rear를 그대로 둔다. 문서의 warning 참고)
 *       이름은 p.34의 것(QueueNode, item, link, LinkedQueueType)으로 맞췄다. init, is_empty, destroy는 보탰다.
 * 실행: cc -std=c11 -Wall -Wextra 19_linked-queue_impl.c -o lqueue && ./lqueue
 *
 * 확인하는 것
 *   1. 슬라이드 p.33의 그림: A, B, C, D를 넣으면 front -> A -> B -> C -> D <- rear, D의 link는 NULL.
 *   2. 문서의 추적 표: 빈 큐에 처음 넣을 때와 마지막 하나를 뺄 때 front와 rear가 함께 바뀐다.
 *   3. 카드 C1.
 *   4. 카드 C2: 맨 뒤 노드를 빼려면 그 앞 노드를 찾느라 링크를 count - 2번 따라가야 한다.
 *   5. 연산마다 불변식: count = 노드 수, 비었으면 front와 rear가 모두 NULL,
 *      아니면 front에서 링크를 count - 1번 따라간 곳이 rear이고 rear->link는 NULL.
 *   6. 무작위 연산 10,000번: 원형 큐(14번 문서의 코드를 옮겨 적은 것)와
 *      느린 일자 큐(뺄 때마다 한 칸씩 당기는 배열)가 같은 값을 같은 순서로 낸다.
 *   7. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveNodes = 0;    /* malloc 횟수 - free 횟수 */

/* ---------- 문서에 실은 코드 ---------- */

typedef int element;

typedef struct QueueNode {
    element item;
    struct QueueNode *link;       /* 바로 뒤 원소의 노드. 맨 뒤면 NULL */
} QueueNode;

typedef struct {
    int count;                    /* 큐에 든 원소 수 */
    QueueNode *front;             /* 맨 앞 노드. 비었으면 NULL */
    QueueNode *rear;              /* 맨 뒤 노드. 비었으면 NULL */
} LinkedQueueType;

void init(LinkedQueueType *q)
{
    q->count = 0;
    q->front = q->rear = NULL;
}

int is_empty(LinkedQueueType *q)
{
    return q->count == 0;
}

void enqueue(LinkedQueueType *q, element item)
{
    QueueNode *tmp = malloc(sizeof(QueueNode));
    if (tmp == NULL) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    liveNodes++;
    tmp->item = item;
    tmp->link = NULL;                 /* 새 노드는 맨 뒤라서 뒤가 없다 */
    if (!is_empty(q)) {
        q->rear->link = tmp;          /* 지금의 맨 뒤 노드 뒤에 단다 */
        q->rear = tmp;                /* 새 노드가 맨 뒤가 된다 */
    }
    else {
        q->front = q->rear = tmp;     /* 빈 큐: 새 노드가 맨 앞이자 맨 뒤다 */
    }
    q->count++;
}

element dequeue(LinkedQueueType *q)
{
    if (is_empty(q)) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    QueueNode *tmp = q->front;        /* 떼어 낼 노드를 적어 둔다 */
    element item = tmp->item;
    q->front = q->front->link;        /* 둘째 노드가 맨 앞이 된다 */
    if (q->front == NULL)             /* 마지막 하나를 뺐다 */
        q->rear = NULL;               /* rear가 돌려준 노드를 가리키지 않게 한다 */
    q->count--;
    free(tmp);
    liveNodes--;
    return item;
}

/* 남은 노드를 모두 돌려준다 */
void destroy(LinkedQueueType *q)
{
    while (!is_empty(q)) dequeue(q);
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

/* 견줄 상대 1: 원형 큐. front는 첫 원소의 한 칸 앞, rear는 마지막 원소의 칸 */
#define RING_SIZE 10001
static element ring[RING_SIZE];
static int r_front = 0, r_rear = 0;
static int ring_add(element item)
{
    int next = (r_rear + 1) % RING_SIZE;
    if (next == r_front) return 0;
    r_rear = next;
    ring[r_rear] = item;
    return 1;
}
static element ring_delete(void)
{
    r_front = (r_front + 1) % RING_SIZE;
    return ring[r_front];
}
static int ring_size(void) { return (r_rear - r_front + RING_SIZE) % RING_SIZE; }

/* 견줄 상대 2: 느린 일자 큐. 맨 앞이 늘 0번 칸이고, 뺄 때마다 한 칸씩 당긴다 */
static element flat[RING_SIZE];
static int flat_n = 0;
static void flat_add(element item) { flat[flat_n++] = item; }
static element flat_delete(void)
{
    element x = flat[0];
    for (int i = 1; i < flat_n; i++) flat[i - 1] = flat[i];
    flat_n--;
    return x;
}

static const char *chain(LinkedQueueType *q)
{
    static char buf[256];
    int n = 0;
    buf[0] = '\0';
    for (QueueNode *p = q->front; p != NULL && n < 200; p = p->link)
        n += snprintf(buf + n, sizeof(buf) - (size_t)n, "%s%d", n ? " " : "", p->item);
    return buf;
}

static int same_text(const char *x, const char *y)
{
    while (*x && *x == *y) { x++; y++; }
    return *x == *y;
}

static int invariant(LinkedQueueType *q)
{
    int n = 0;
    QueueNode *last = NULL;
    for (QueueNode *p = q->front; p != NULL; p = p->link) { n++; last = p; }
    if (n != q->count) return 0;
    if (n == 0) return q->front == NULL && q->rear == NULL;
    return last == q->rear && q->rear->link == NULL;
}

/* 맨 뒤 노드의 바로 앞 노드까지 가려면 front에서 링크를 몇 번 따라가야 하나 (노드 2개 이상) */
static int hops_to_before_rear(LinkedQueueType *q)
{
    int hops = 0;
    QueueNode *p = q->front;
    while (p->link != q->rear) { p = p->link; hops++; }
    return hops;
}

static void show(const char *what, LinkedQueueType *q)
{
    printf("  %-12s count = %d  체인: %-10s", what, q->count, q->count ? chain(q) : "(비었음)");
    if (q->count) printf("  front는 %d, rear는 %d\n", q->front->item, q->rear->item);
    else printf("  front, rear 모두 NULL\n");
}

int main(void)
{
    LinkedQueueType q;
    init(&q);
    check(is_empty(&q) && q.front == NULL && q.rear == NULL && invariant(&q), "처음: 비었다");

    /* 1. 슬라이드 p.33 (A, B, C, D를 글자 코드로 넣는다) */
    enqueue(&q, 'A'); enqueue(&q, 'B'); enqueue(&q, 'C'); enqueue(&q, 'D');
    check(q.count == 4 && q.front->item == 'A' && q.rear->item == 'D' && q.rear->link == NULL, "p.33 front는 A, rear는 D");
    check(q.front->link->item == 'B' && q.front->link->link->item == 'C'
          && q.front->link->link->link == q.rear && invariant(&q), "p.33 A -> B -> C -> D");
    check(hops_to_before_rear(&q) == 2, "C2: 노드 4개면 맨 뒤의 앞 노드까지 링크 2번");
    check(dequeue(&q) == 'A' && dequeue(&q) == 'B' && dequeue(&q) == 'C' && dequeue(&q) == 'D', "넣은 순서대로 나온다");
    check(is_empty(&q) && invariant(&q) && liveNodes == 0, "다 빼면 비었다");

    /* 2. 문서의 추적 표 */
    show("처음", &q);
    enqueue(&q, 10); show("enqueue 10", &q);
    check(q.count == 1 && q.front == q.rear && q.front->item == 10 && invariant(&q), "빈 큐에 처음 넣기: front == rear");
    enqueue(&q, 20); show("enqueue 20", &q);
    check(q.count == 2 && q.front->item == 10 && q.rear->item == 20 && q.front->link == q.rear, "둘째: rear만 바뀐다");
    enqueue(&q, 30); show("enqueue 30", &q);
    check(same_text(chain(&q), "10 20 30") && q.rear->item == 30, "셋째");
    element x = dequeue(&q); show("dequeue", &q);
    check(x == 10 && q.count == 2 && q.front->item == 20 && q.rear->item == 30, "dequeue -> 10: front만 바뀐다");
    x = dequeue(&q); show("dequeue", &q);
    check(x == 20 && q.count == 1 && q.front == q.rear && q.front->item == 30, "dequeue -> 20: 하나 남으면 front == rear");
    x = dequeue(&q); show("dequeue", &q);
    check(x == 30 && q.count == 0 && q.front == NULL && q.rear == NULL && invariant(&q), "마지막 하나를 빼면 둘 다 NULL");
    enqueue(&q, 40); show("enqueue 40", &q);
    check(q.count == 1 && q.front == q.rear && q.rear->item == 40 && invariant(&q), "비운 뒤 다시 넣기");
    destroy(&q);

    /* 3. 카드 C1 */
    enqueue(&q, 1); enqueue(&q, 2);
    element c1a = dequeue(&q);
    enqueue(&q, 3);
    element c1b = dequeue(&q);
    element c1c = dequeue(&q);
    check(c1a == 1 && c1b == 2 && c1c == 3 && q.count == 0 && q.front == NULL && q.rear == NULL, "C1: 1, 2, 3 순서로 나오고 비었다");
    enqueue(&q, 4);
    check(q.count == 1 && q.front == q.rear && q.front->item == 4, "C1: 4를 넣으면 front == rear");
    destroy(&q);

    /* 4. 카드 C2 */
    for (int n = 2; n <= 50; n++) {
        for (int i = 0; i < n; i++) enqueue(&q, i);
        check(hops_to_before_rear(&q) == n - 2, "맨 뒤의 앞 노드까지 링크 count - 2번");
        destroy(&q);
    }

    /* 6. 무작위 10,000번: 세 큐가 같은 값을 낸다 */
    int max_size = 0, emptied = 0;
    for (int k = 0; k < 10000; k++) {
        if (rnd() % 100 < 52) {
            element v = (element)(rnd() % 100000);
            enqueue(&q, v);
            check(ring_add(v) == 1, "원형 큐에 자리가 있다");
            flat_add(v);
        } else if (!is_empty(&q)) {
            element a = dequeue(&q), b = ring_delete(), c = flat_delete();
            check(a == b && b == c, "무작위: 세 큐가 꺼낸 값이 같다");
            if (is_empty(&q)) emptied++;
        }
        check(q.count == ring_size() && q.count == flat_n, "무작위: 원소 수가 같다");
        check(liveNodes == q.count, "무작위: 노드 수 = 원소 수");
        if (k % 50 == 0 || q.count < 4) check(invariant(&q), "무작위: 불변식");
        if (q.count > max_size) max_size = q.count;
    }
    printf("  무작위 10,000번: 가장 많을 때 %d개, 큐가 빈 횟수 %d\n", max_size, emptied);
    check(emptied > 0, "무작위: 큐가 비었다가 다시 찬 적이 있다");
    while (!is_empty(&q)) {
        element a = dequeue(&q), b = ring_delete(), c = flat_delete();
        check(a == b && b == c, "무작위: 남은 것 모두 꺼내기");
    }
    check(ring_size() == 0 && flat_n == 0 && invariant(&q), "세 큐가 모두 비었다");

    /* 7. 누수 */
    check(liveNodes == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
