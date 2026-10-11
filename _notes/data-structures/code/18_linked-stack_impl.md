---
layout: "note"
title: "18_linked-stack_impl.c"
display_title: "18_linked-stack_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "18"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-stack/"
parent_title: "연결 리스트로 만든 스택"
description: "자료구조 · 연결 리스트로 만든 스택 구현 코드"
permalink: "/studies/data-structures/code/18_linked-stack_impl/"
---
{% raw %}
[연결 리스트로 만든 스택](/Hongs_Blog/studies/data-structures/linked-stack/) 문서의 구현 코드다.

```c
/* 연결 리스트로 만든 스택: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/18.연결 리스트로 만든 스택.md
 * 출처: 자료구조 5주차 슬라이드 p.27~31. 슬라이드 코드를 컴파일되게 고쳤다.
 *       (p.29의 typedef 이름이 StackeNode라 그 아래 줄의 StackNode를 못 알아본다. 문서의 warning 참고)
 *       init, is_empty, peek, destroy는 슬라이드에 본문이 없어 보탰다.
 * 실행: cc -std=c11 -Wall -Wextra 18_linked-stack_impl.c -o lstack && ./lstack
 *
 * 확인하는 것
 *   1. 슬라이드 p.28의 그림: 3, 7, 9를 차례로 넣으면 top -> 9 -> 7 -> 3 -> NULL.
 *   2. 문서의 추적 표와 카드 C1.
 *   3. 카드 C2: 맨 끝 노드를 맨 위로 삼으면, 노드가 n개일 때 그 앞 노드를 찾느라 링크를 n - 2번 따라간다.
 *   4. 무작위 연산 5,000번: 배열 스택(13번 문서의 두 배 늘리기 판을 옮겨 적은 것)과 꺼낸 값·맨 위·빔 판정이 같다.
 *      살아 있는 노드 수는 늘 스택에 든 원소 수와 같다.
 *   5. malloc 횟수와 free 횟수가 같다.
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

typedef struct StackNode {
    element item;
    struct StackNode *link;       /* 바로 아래 원소의 노드. 맨 아래면 NULL */
} StackNode;

typedef struct {
    StackNode *top;               /* 맨 위 원소의 노드. 비었으면 NULL */
} LinkedStackType;

void init(LinkedStackType *s)
{
    s->top = NULL;
}

int is_empty(LinkedStackType *s)
{
    return s->top == NULL;
}

void push(LinkedStackType *s, element item)
{
    StackNode *temp = (StackNode *)malloc(sizeof(StackNode));
    if (temp == NULL) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    liveNodes++;
    temp->item = item;
    temp->link = s->top;          /* 새 노드가 지금의 맨 위를 가리킨다 */
    s->top = temp;                /* 새 노드가 맨 위가 된다 */
}

element pop(LinkedStackType *s)
{
    if (is_empty(s)) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    StackNode *temp = s->top;     /* 떼어 낼 노드를 적어 둔다 */
    element item = temp->item;
    s->top = s->top->link;        /* 바로 아래 노드가 맨 위가 된다 */
    free(temp);
    liveNodes--;
    return item;
}

element peek(LinkedStackType *s)
{
    if (is_empty(s)) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    return s->top->item;
}

/* 남은 노드를 모두 돌려준다 */
void destroy(LinkedStackType *s)
{
    while (!is_empty(s)) pop(s);
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

/* 견줄 상대: 배열 스택 (가득 차면 두 배로 늘린다) */
static element *a_stack;
static int a_capacity, a_top = -1;
static void a_push(element item)
{
    if (a_top >= a_capacity - 1) {
        element *bigger = realloc(a_stack, 2 * (size_t)a_capacity * sizeof(*a_stack));
        if (bigger == NULL) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); }
        a_stack = bigger;
        a_capacity *= 2;
    }
    a_stack[++a_top] = item;
}
static element a_pop(void) { return a_stack[a_top--]; }

/* 체인을 맨 위부터 "9 7 3" 꼴로 적는다 */
static const char *chain(LinkedStackType *s)
{
    static char buf[256];
    int n = 0;
    buf[0] = '\0';
    for (StackNode *p = s->top; p != NULL && n < 200; p = p->link)
        n += snprintf(buf + n, sizeof(buf) - (size_t)n, "%s%d", n ? " " : "", p->item);
    return buf;
}

static int same_text(const char *x, const char *y)
{
    while (*x && *x == *y) { x++; y++; }
    return *x == *y;
}

static int size(LinkedStackType *s)
{
    int n = 0;
    for (StackNode *p = s->top; p != NULL; p = p->link) n++;
    return n;
}

/* 마지막 노드의 바로 앞 노드까지 가려면 링크를 몇 번 따라가야 하나 (노드 2개 이상) */
static int hops_to_before_last(LinkedStackType *s)
{
    int hops = 0;
    StackNode *p = s->top;
    while (p->link->link != NULL) { p = p->link; hops++; }
    return hops;
}

int main(void)
{
    LinkedStackType s;
    init(&s);
    check(is_empty(&s) && s.top == NULL, "처음: 비었다");

    /* 1. 슬라이드 p.28 */
    push(&s, 3); push(&s, 7); push(&s, 9);
    check(same_text(chain(&s), "9 7 3"), "p.28 top -> 9 -> 7 -> 3");
    check(s.top->item == 9 && s.top->link->item == 7 && s.top->link->link->item == 3
          && s.top->link->link->link == NULL, "p.28 맨 아래 노드의 link는 NULL");
    check(peek(&s) == 9 && size(&s) == 3, "맨 위는 9");

    /* 2. 문서의 추적 표 (p.28 뒤를 이어서) */
    printf("  push 3, 7, 9  체인: %s\n", chain(&s));
    element x = pop(&s);
    printf("  pop -> %d      체인: %s\n", x, chain(&s));
    check(x == 9 && same_text(chain(&s), "7 3"), "pop -> 9, 남은 것 7 3");
    push(&s, 5);
    printf("  push 5        체인: %s\n", chain(&s));
    check(same_text(chain(&s), "5 7 3"), "push 5 -> 5 7 3");
    x = pop(&s); check(x == 5, "pop -> 5");
    x = pop(&s); check(x == 7, "pop -> 7");
    printf("  pop, pop      체인: %s\n", chain(&s));
    check(same_text(chain(&s), "3") && s.top->link == NULL, "남은 것 3");
    x = pop(&s);
    printf("  pop -> %d      체인: (비었음)\n", x);
    check(x == 3 && is_empty(&s) && liveNodes == 0, "pop -> 3, 비었다");

    /* 2. 카드 C1 */
    push(&s, 1); push(&s, 2);
    element c1a = pop(&s);
    push(&s, 3); push(&s, 4);
    element c1b = pop(&s);
    check(c1a == 2 && c1b == 4 && same_text(chain(&s), "3 1") && liveNodes == 2, "C1: 2, 4를 꺼내고 top -> 3 -> 1");
    destroy(&s);
    check(is_empty(&s) && liveNodes == 0, "destroy 뒤 비었다");

    /* 3. 카드 C2 */
    for (int n = 2; n <= 50; n++) {
        for (int i = 0; i < n; i++) push(&s, i);
        check(hops_to_before_last(&s) == n - 2, "끝 노드의 앞 노드까지 링크 n - 2번");
        destroy(&s);
    }

    /* 4. 무작위 5,000번 */
    a_capacity = 1;
    a_stack = malloc(sizeof(*a_stack));
    if (a_stack == NULL) { fprintf(stderr, "Insufficient memory\n"); return 1; }
    int max_size = 0;
    for (int k = 0; k < 5000; k++) {
        if (rnd() % 5 < 3) {
            element v = (element)(rnd() % 1000);
            push(&s, v);
            a_push(v);
        } else if (!is_empty(&s)) {
            check(a_top >= 0 && pop(&s) == a_pop(), "무작위: 꺼낸 값이 배열 스택과 같다");
        }
        check(is_empty(&s) == (a_top == -1), "무작위: 빔 판정");
        if (!is_empty(&s)) check(peek(&s) == a_stack[a_top], "무작위: 맨 위");
        check(liveNodes == a_top + 1, "무작위: 노드 수 = 원소 수");
        if (a_top + 1 > max_size) max_size = a_top + 1;
    }
    printf("  무작위 5,000번: 가장 많을 때 %d개, 배열 스택의 용량은 %d칸\n", max_size, a_capacity);
    while (!is_empty(&s)) check(pop(&s) == a_pop(), "무작위: 남은 것 모두 꺼내기");
    check(a_top == -1, "배열 스택도 비었다");
    free(a_stack);

    /* 5. 누수 */
    check(liveNodes == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
