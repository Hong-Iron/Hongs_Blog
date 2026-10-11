---
layout: "note"
title: "14_circular-queue-ladder_p4.c"
display_title: "14_circular-queue-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "14"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/circular-queue-ladder/"
parent_title: "원형 큐 추적 예제 사다리"
description: "자료구조 · 원형 큐 추적 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/14_circular-queue-ladder_p4/"
---
{% raw %}
[원형 큐 추적 예제 사다리](/Hongs_Blog/studies/data-structures/circular-queue-ladder/) 문서의 문제 4 풀이 코드다.

```c
/* 원형 큐 추적 예제 사다리: 문제 1 ~ 4의 답을 확인한다.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/14.원형 큐 추적 예제 사다리.md
 * 원형 큐는 3.개념집/14_circular-queue_impl.c의 AddQ, DeleteQ를 칸 수 n을 바꿀 수 있게 옮겨 적었다.
 * 실행: cc -std=c11 -Wall -Wextra 14_circular-queue-ladder_p4.c -o ladder && ./ladder
 * front는 첫 원소의 한 칸 앞, rear는 마지막 원소의 칸이다. 빈칸은 0으로 둔다.
 */
#include <stdio.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

#define MAX_N 16

typedef struct {
    int n;                /* 칸 수 */
    int front, rear;
    int slot[MAX_N];
    int full_calls;       /* 가득 차서 못 넣은 횟수 */
} Ring;

static void start(Ring *q, int n, int where)
{
    q->n = n; q->front = q->rear = where; q->full_calls = 0;
    for (int i = 0; i < MAX_N; i++) q->slot[i] = 0;
}

static void AddQ(Ring *q, int item)
{
    int next = (q->rear + 1) % q->n;
    if (next == q->front) { q->full_calls++; return; }
    q->rear = next;
    q->slot[q->rear] = item;
}

/* 비었으면 -1 */
static int DeleteQ(Ring *q)
{
    if (q->front == q->rear) return -1;
    q->front = (q->front + 1) % q->n;
    return q->slot[q->front];
}

static int SizeQ(const Ring *q) { return (q->rear - q->front + q->n) % q->n; }
static int IsFullQ(const Ring *q) { return (q->rear + 1) % q->n == q->front; }

/* 슬라이드 p.93의 AddQ: rear를 먼저 옮긴다 */
static void AddQ_p93(Ring *q, int item)
{
    q->rear = (q->rear + 1) % q->n;
    if (q->front == q->rear) { q->full_calls++; return; }
    q->slot[q->rear] = item;
}

static int state(const Ring *q, int front, int rear, int size)
{
    return q->front == front && q->rear == rear && SizeQ(q) == size;
}

static int slots(const Ring *q, const int *want)
{
    for (int i = 0; i < q->n; i++) if (q->slot[i] != want[i]) return 0;
    return 1;
}

int main(void)
{
    Ring q;

    /* 문제 1: 6칸, 슬라이드 p.84 ~ 87의 그림 */
    start(&q, 6, 1);
    AddQ(&q, 'A'); AddQ(&q, 'B'); AddQ(&q, 'C');
    check(state(&q, 1, 4, 3) && q.slot[2] == 'A' && q.slot[3] == 'B' && q.slot[4] == 'C', "문제 1: 처음");
    AddQ(&q, 'D');
    check(state(&q, 1, 5, 4) && q.slot[5] == 'D', "문제 1: AddQ(D) -> rear 5");
    check(DeleteQ(&q) == 'A' && state(&q, 2, 5, 3), "문제 1: DeleteQ -> A, front 2");
    AddQ(&q, 'E');
    check(state(&q, 2, 0, 4) && q.slot[0] == 'E' && !IsFullQ(&q), "문제 1: AddQ(E) -> rear 0");

    /* 문제 2: 4칸 */
    start(&q, 4, 0);
    AddQ(&q, 1); check(state(&q, 0, 1, 1), "문제 2: AddQ(1)");
    AddQ(&q, 2); check(state(&q, 0, 2, 2), "문제 2: AddQ(2)");
    check(DeleteQ(&q) == 1 && state(&q, 1, 2, 1), "문제 2: DeleteQ -> 1");
    AddQ(&q, 3); check(state(&q, 1, 3, 2), "문제 2: AddQ(3)");
    AddQ(&q, 4); check(state(&q, 1, 0, 3), "문제 2: AddQ(4) -> rear 0");
    const int p2[4] = { 4, 1, 2, 3 };
    check(slots(&q, p2) && IsFullQ(&q) && q.full_calls == 0, "문제 2: 칸 4, 1, 2, 3. 세 개로 가득 참");
    AddQ(&q, 5);
    check(q.full_calls == 1 && state(&q, 1, 0, 3), "문제 2: 다섯째 원소는 못 넣는다");

    /* 문제 3: 5칸, front = rear = 3에서 시작 */
    start(&q, 5, 3);
    AddQ(&q, 'a'); check(state(&q, 3, 4, 1), "문제 3: AddQ(a)");
    AddQ(&q, 'b'); check(state(&q, 3, 0, 2), "문제 3: AddQ(b) -> rear 0");
    AddQ(&q, 'c'); check(state(&q, 3, 1, 3), "문제 3: AddQ(c)");
    check(DeleteQ(&q) == 'a' && state(&q, 4, 1, 2), "문제 3: DeleteQ -> a");
    AddQ(&q, 'd'); check(state(&q, 4, 2, 3), "문제 3: AddQ(d)");
    AddQ(&q, 'e'); check(state(&q, 4, 3, 4) && IsFullQ(&q), "문제 3: AddQ(e) -> 가득 참");
    AddQ(&q, 'f'); check(q.full_calls == 1 && state(&q, 4, 3, 4), "문제 3: AddQ(f)는 못 넣는다");
    check(DeleteQ(&q) == 'b' && state(&q, 0, 3, 3), "문제 3: DeleteQ -> b, front 0");
    check(DeleteQ(&q) == 'c' && state(&q, 1, 3, 2), "문제 3: DeleteQ -> c, front 1");
    check(q.slot[2] == 'd' && q.slot[3] == 'e', "문제 3: 남은 것은 [2]의 d, [3]의 e");

    /* 문제 4: 8칸, front = 6, rear = 2 */
    start(&q, 8, 6);
    AddQ(&q, 'w'); AddQ(&q, 'x'); AddQ(&q, 'y'); AddQ(&q, 'z');
    check(state(&q, 6, 2, 4), "문제 4 (가): 4개");
    check(q.slot[7] == 'w' && q.slot[0] == 'x' && q.slot[1] == 'y' && q.slot[2] == 'z', "문제 4 (가): [7], [0], [1], [2]");
    int more = 0;
    while (!IsFullQ(&q)) { AddQ(&q, '1' + more); more++; }
    check(more == 3 && state(&q, 6, 5, 7) && q.full_calls == 0, "문제 4 (나): 3개 더 넣으면 rear 5, 가득 참");
    Ring copy = q;                                        /* (라)에 쓸 가득 찬 상태 */
    check(DeleteQ(&q) == 'w' && DeleteQ(&q) == 'x' && state(&q, 0, 5, 5), "문제 4 (다): 두 번 빼면 front 0, 5개");
    AddQ_p93(&copy, '!');
    check(copy.full_calls == 1 && copy.front == 6 && copy.rear == 6 && SizeQ(&copy) == 0, "문제 4 (라): p.93의 AddQ면 빈 큐로 보인다");
    check(DeleteQ(&copy) == -1, "문제 4 (라): 일곱 개를 꺼낼 수 없다");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
