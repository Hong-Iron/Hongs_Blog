---
layout: "note"
title: "14_circular-queue_impl.c"
display_title: "14_circular-queue_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "14"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/circular-queue/"
parent_title: "원형 큐"
description: "자료구조 · 원형 큐 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/14_circular-queue_impl/"
---
{% raw %}
[원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/) 문서의 구현 코드다.

```c
/* 원형 큐: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/14.원형 큐.md
 * 실행: cc -std=c11 -Wall -Wextra 14_circular-queue_impl.c -o cqueue && ./cqueue
 *
 * front는 첫 원소의 한 칸 앞, rear는 마지막 원소의 칸이다. 둘 다 0 ~ MAX_QUEUE_SIZE - 1을 돈다.
 *
 * 확인하는 것
 *   1. 문서 예시의 일자 배열 큐: J1 ~ J5를 넣고 셋을 빼면 앞 세 칸이 비었는데도 가득 찼다고 한다.
 *   2. 문서의 추적 표(6칸): 표의 각 줄과 같은 front, rear, 칸 내용.
 *      끝 칸 [5] 다음에 [0]으로 넘어가고, 다섯 개가 들면 여섯째는 못 넣는다.
 *   3. 고리를 넘어간 큐: front = 4, rear = 1이면 A, B, C가 [5], [0], [1]에 있다.
 *   4. 원소 수 = (rear - front + 6) % 6. 빔은 front == rear, 가득 참은 (rear + 1) % 6 == front.
 *      나머지 없이 rear + 1 == front로만 보면 rear = 5, front = 0인 가득 찬 큐를 놓친다.
 *   5. 카드 C1(6칸), C4(front = 4, rear = 1이면 3개).
 *   6. rear를 먼저 옮기는 틀린 AddQ를 쓰면: 다섯 개가 든 큐에 하나를 더 넣으려다 front == rear가 되어
 *      빈 큐로 보인다(카드 C3).
 *   7. 무작위 연산 10,000번: 느린 모형(맨 앞을 0번 칸에 두고 뺄 때마다 한 칸씩 당기는 배열)과
 *      꺼낸 값, 원소 수, 빔·가득 참 판정이 같다. 6칸 배열에 5개까지만 든다.
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

/* ---------- 문서에 실은 코드 ---------- */

#define MAX_QUEUE_SIZE 6

typedef int element;

static element queue[MAX_QUEUE_SIZE];
static int full_calls = 0;            /* QueueFull이 불린 횟수 */

/* 가득 찼다고 알리고 돌아온다. 넣으려던 원소는 들어가지 않는다 */
void QueueFull(void)
{
    full_calls++;
}

element QueueEmpty(void)
{
    fprintf(stderr, "Queue is empty, cannot delete element.\n");
    exit(EXIT_FAILURE);
}

int IsEmptyQ(int front, int rear) { return front == rear; }
int IsFullQ(int front, int rear)  { return (rear + 1) % MAX_QUEUE_SIZE == front; }

void AddQ(int front, int *rear, element item)
{
    int next = (*rear + 1) % MAX_QUEUE_SIZE;     /* rear가 갈 칸. 끝 칸 다음은 0번 칸 */
    if (next == front) {                         /* 그 칸이 front면 가득 찼다 */
        QueueFull();
        return;                                  /* rear는 그대로 둔다 */
    }
    *rear = next;
    queue[*rear] = item;
}

element DeleteQ(int *front, int rear)
{
    if (*front == rear)
        return QueueEmpty();
    *front = (*front + 1) % MAX_QUEUE_SIZE;      /* front를 한 칸 옮기면 첫 원소의 칸이다 */
    return queue[*front];
}

/* 큐에 든 원소 수 */
int SizeQ(int front, int rear)
{
    return (rear - front + MAX_QUEUE_SIZE) % MAX_QUEUE_SIZE;
}

/* 고리로 잇기 전의 일자 배열 큐. front와 rear가 오른쪽으로만 간다 */
#define LINE_SIZE 5
static element line[LINE_SIZE];

void AddQ_line(int *rear, element item)
{
    if (*rear == LINE_SIZE - 1) {
        QueueFull();
        return;
    }
    *rear = *rear + 1;
    line[*rear] = item;
}

element DeleteQ_line(int *front, int rear)
{
    if (*front == rear)
        return QueueEmpty();
    *front = *front + 1;
    return line[*front];
}

/* 틀린 판의 AddQ: 가득 찼는지 보기 전에 rear를 옮긴다 (카드 C3) */
void AddQ_rear_first(int front, int *rear, element item)
{
    *rear = (*rear + 1) % MAX_QUEUE_SIZE;
    if (front == *rear) {
        QueueFull();
        return;
    }
    queue[*rear] = item;
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

/* 느린 모형: 맨 앞 원소가 늘 0번 칸이다. 뺄 때마다 나머지를 한 칸씩 당긴다 */
#define MODEL_MAX 16
static element model[MODEL_MAX];
static int model_n = 0;
static void model_add(element x) { model[model_n++] = x; }
static element model_delete(void)
{
    element x = model[0];
    for (int i = 1; i < model_n; i++) model[i - 1] = model[i];
    model_n--;
    return x;
}

static void clear_queue(void)
{
    for (int i = 0; i < MAX_QUEUE_SIZE; i++) queue[i] = 0;
}

static void show(const char *what, int front, int rear, int letters)
{
    printf("  %-12s front = %d  rear = %d  칸 [", what, front, rear);
    for (int i = 0; i < MAX_QUEUE_SIZE; i++) {
        if (queue[i] == 0) printf("%s-", i ? " " : "");
        else if (letters) printf("%s%c", i ? " " : "", queue[i]);
        else printf("%s%d", i ? " " : "", queue[i]);
    }
    printf("]  원소 수 %d\n", SizeQ(front, rear));
}

static int slots_are(const int *want)
{
    for (int i = 0; i < MAX_QUEUE_SIZE; i++) if (queue[i] != want[i]) return 0;
    return 1;
}

int main(void)
{
    int front, rear;
    element x;

    /* 1. 문서 예시: 일자 배열 큐가 오른쪽으로 밀려 간다 */
    front = rear = -1;                               /* 비었다. front는 첫 원소의 한 칸 앞 */
    AddQ_line(&rear, 1);                             /* Insert J1 */
    AddQ_line(&rear, 2); AddQ_line(&rear, 3);        /* Insert J2, J3 */
    x = DeleteQ_line(&front, rear);                  /* Delete */
    check(x == 1, "일자 큐: 첫 Delete는 J1");
    AddQ_line(&rear, 4); AddQ_line(&rear, 5);        /* Insert J4, J5 */
    x = DeleteQ_line(&front, rear); check(x == 2, "일자 큐: 둘째 Delete는 J2");
    x = DeleteQ_line(&front, rear); check(x == 3, "일자 큐: 셋째 Delete는 J3");
    check(front == 2 && rear == 4 && line[3] == 4 && line[4] == 5, "일자 큐 마지막 줄: J4, J5가 넷째·다섯째 칸");
    full_calls = 0;
    AddQ_line(&rear, 6);
    check(full_calls == 1 && rear == 4, "일자 큐: 앞 세 칸이 비었는데도 가득 찼다고 한다");

    /* 2. 문서의 추적 표 (6칸) */
    clear_queue();
    full_calls = 0;
    front = rear = 1;
    check(IsEmptyQ(front, rear) && SizeQ(front, rear) == 0, "처음: front == rear, 비었다");
    show("처음", front, rear, 1);
    AddQ(front, &rear, 'A'); AddQ(front, &rear, 'B'); AddQ(front, &rear, 'C');
    show("AddQ A, B, C", front, rear, 1);
    const int sStart[6] = { 0, 0, 'A', 'B', 'C', 0 };
    check(front == 1 && rear == 4 && slots_are(sStart) && SizeQ(front, rear) == 3, "처음 그림: A, B, C가 [2] ~ [4]");
    AddQ(front, &rear, 'D');
    show("AddQ D", front, rear, 1);
    const int sAfterD[6] = { 0, 0, 'A', 'B', 'C', 'D' };
    check(front == 1 && rear == 5 && slots_are(sAfterD), "AddQ D: rear = 5, D는 [5]");
    x = DeleteQ(&front, rear);
    show("DeleteQ", front, rear, 1);
    check(x == 'A' && front == 2 && rear == 5 && slots_are(sAfterD), "DeleteQ: front = 2, A가 나오고 칸에는 남아 있다");
    AddQ(front, &rear, 'E');
    show("AddQ E", front, rear, 1);
    check(rear == 0 && queue[0] == 'E', "끝 칸 [5] 다음은 [0]");
    AddQ(front, &rear, 'F');
    show("AddQ F", front, rear, 1);
    check(rear == 1 && queue[1] == 'F' && SizeQ(front, rear) == 5 && IsFullQ(front, rear), "다섯 개: 가득 참");
    AddQ(front, &rear, 'G');
    show("AddQ G", front, rear, 1);
    const int sFull[6] = { 'E', 'F', 'A', 'B', 'C', 'D' };
    check(full_calls == 1 && front == 2 && rear == 1 && slots_are(sFull), "여섯째는 못 넣는다. front, rear 그대로");
    x = DeleteQ(&front, rear);
    show("DeleteQ", front, rear, 1);
    check(x == 'B' && front == 3 && SizeQ(front, rear) == 4, "DeleteQ -> B");
    AddQ(front, &rear, 'G');
    show("AddQ G", front, rear, 1);
    const int sEnd[6] = { 'E', 'F', 'G', 'B', 'C', 'D' };
    check(full_calls == 1 && rear == 2 && slots_are(sEnd) && IsFullQ(front, rear), "자리가 났으니 G가 [2]에 든다");
    const int order[5] = { 'C', 'D', 'E', 'F', 'G' };
    for (int i = 0; i < 5; i++) check(DeleteQ(&front, rear) == order[i], "넣은 순서대로 나온다");
    check(IsEmptyQ(front, rear) && front == 2 && rear == 2, "다 빼면 front == rear");

    /* 3. 고리를 넘어간 큐 (카드 C4) */
    clear_queue();
    front = rear = 4;
    AddQ(front, &rear, 'A'); AddQ(front, &rear, 'B'); AddQ(front, &rear, 'C');
    const int sWrap[6] = { 'B', 'C', 0, 0, 0, 'A' };
    check(front == 4 && rear == 1 && slots_are(sWrap) && SizeQ(front, rear) == 3, "고리를 넘어간 큐(카드 C4: 3개)");

    /* 4. 원소 수 식과 두 판정. 가능한 (front, rear) 36쌍을 모두 본다 */
    int empties = 0, fulls = 0, missed = 0;
    for (int f = 0; f < MAX_QUEUE_SIZE; f++)
        for (int r = 0; r < MAX_QUEUE_SIZE; r++) {
            int n = 0;
            for (int p = f; p != r; p = (p + 1) % MAX_QUEUE_SIZE) n++;   /* front에서 rear까지 걸음 수 */
            check(SizeQ(f, r) == n && n <= MAX_QUEUE_SIZE - 1, "원소 수 = (rear - front + 6) % 6");
            check(IsEmptyQ(f, r) == (n == 0), "빔 <=> 원소 수 0");
            check(IsFullQ(f, r) == (n == MAX_QUEUE_SIZE - 1), "가득 참 <=> 원소 수 5");
            if (n == 0) empties++;
            if (n == MAX_QUEUE_SIZE - 1) { fulls++; if (r + 1 != f) missed++; }
        }
    check(empties == 6 && fulls == 6, "36쌍 가운데 빈 것 6쌍, 가득 찬 것 6쌍");
    check(missed == 1 && !(5 + 1 == 0) && IsFullQ(0, 5), "rear + 1 == front만 보면 (front 0, rear 5)를 놓친다");

    /* 5. 카드 C1 */
    clear_queue();
    full_calls = 0;
    front = rear = 0;
    AddQ(front, &rear, 10); AddQ(front, &rear, 20); AddQ(front, &rear, 30); AddQ(front, &rear, 40);
    check(DeleteQ(&front, rear) == 10 && DeleteQ(&front, rear) == 20 && DeleteQ(&front, rear) == 30, "C1: 10, 20, 30이 나온다");
    AddQ(front, &rear, 50); AddQ(front, &rear, 60); AddQ(front, &rear, 70); AddQ(front, &rear, 80);
    const int c1[6] = { 60, 70, 80, 30, 40, 50 };
    check(front == 3 && rear == 2 && slots_are(c1) && SizeQ(front, rear) == 5 && full_calls == 0, "C1: front 3, rear 2");
    AddQ(front, &rear, 90);
    check(full_calls == 1 && rear == 2 && slots_are(c1), "C1: 90은 못 들어간다");
    show("C1 끝", front, rear, 0);

    /* 6. rear를 먼저 옮기는 틀린 AddQ (카드 C3) */
    clear_queue();
    full_calls = 0;
    front = rear = 0;
    for (int v = 10; v <= 50; v += 10) AddQ_rear_first(front, &rear, v);
    check(front == 0 && rear == 5 && SizeQ(front, rear) == 5 && full_calls == 0, "틀린 AddQ: 다섯 개까지는 맞다");
    AddQ_rear_first(front, &rear, 60);
    check(full_calls == 1 && rear == 0, "틀린 AddQ: 가득 찼다고 알렸지만 rear는 이미 0으로 갔다");
    check(IsEmptyQ(front, rear) && SizeQ(front, rear) == 0, "틀린 AddQ: front == rear라 빈 큐로 보인다. 다섯 개를 잃었다");
    const int kept[6] = { 0, 10, 20, 30, 40, 50 };
    check(slots_are(kept), "틀린 AddQ: 값은 칸에 남아 있지만 꺼낼 길이 없다");
    /* 고친 AddQ는 같은 상황에서 rear를 건드리지 않는다 */
    clear_queue();
    full_calls = 0;
    front = rear = 0;
    for (int v = 10; v <= 60; v += 10) AddQ(front, &rear, v);
    check(full_calls == 1 && rear == 5 && SizeQ(front, rear) == 5 && DeleteQ(&front, rear) == 10, "고친 AddQ: 다섯 개가 그대로");

    /* 7. 무작위 연산 10,000번 */
    clear_queue();
    full_calls = 0;
    front = rear = 3;
    model_n = 0;
    int rejected = 0, wraps = 0, max_size = 0;
    for (int k = 0; k < 10000; k++) {
        if (rnd() % 2 == 0) {                         /* 넣기 */
            element v = 1 + (element)(rnd() % 1000);
            int before = full_calls, old_rear = rear;
            AddQ(front, &rear, v);
            if (model_n == MAX_QUEUE_SIZE - 1) {      /* 모형에 5개가 들어 있으면 못 넣어야 한다 */
                check(full_calls == before + 1 && rear == old_rear, "무작위: 가득 찬 큐에는 안 들어간다");
                rejected++;
            } else {
                check(full_calls == before, "무작위: 자리가 있으면 들어간다");
                model_add(v);
                if (rear < old_rear) wraps++;
            }
        } else if (!IsEmptyQ(front, rear)) {          /* 빼기 */
            check(model_n > 0 && DeleteQ(&front, rear) == model_delete(), "무작위: 꺼낸 값");
        } else {
            check(model_n == 0, "무작위: 원형 큐가 비면 모형도 비었다");
        }
        check(SizeQ(front, rear) == model_n, "무작위: 원소 수");
        check(IsEmptyQ(front, rear) == (model_n == 0), "무작위: 빔 판정");
        check(IsFullQ(front, rear) == (model_n == MAX_QUEUE_SIZE - 1), "무작위: 가득 참 판정");
        check(front >= 0 && front < MAX_QUEUE_SIZE && rear >= 0 && rear < MAX_QUEUE_SIZE, "불변식: 0 <= front, rear < 6");
        for (int i = 0; i < model_n; i++)
            check(queue[(front + 1 + i) % MAX_QUEUE_SIZE] == model[i], "불변식: front 다음 칸부터 순서대로");
        if (model_n > max_size) max_size = model_n;
    }
    check(max_size == MAX_QUEUE_SIZE - 1 && rejected > 0 && wraps > 100, "무작위: 5개까지만 들고, 여러 바퀴를 돌았다");
    printf("  무작위 10,000번: 가장 많을 때 %d개, 못 넣은 횟수 %d, [5] -> [0]으로 넘어간 횟수 %d\n", max_size, rejected, wraps);

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
