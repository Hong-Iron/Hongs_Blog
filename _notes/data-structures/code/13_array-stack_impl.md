---
layout: "note"
title: "13_array-stack_impl.c"
display_title: "13_array-stack_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "13"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/array-stack/"
parent_title: "배열로 만든 스택"
description: "자료구조 · 배열로 만든 스택 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/13_array-stack_impl/"
---
{% raw %}
[배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/) 문서의 구현 코드다.

```c
/* 배열로 만든 스택: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/13.배열로 만든 스택.md
 * 출처: 자료구조 3주차 슬라이드 p.45~53. 슬라이드 코드를 컴파일되게 고쳤다.
 *       (p.50의 pop은 값을 돌려주는 return이 빠졌고, p.51과 p.53의 StackFull은 반환형이 없다.
 *        문서의 warning 참고)
 * 실행: cc -std=c11 -Wall -Wextra 13_array-stack_impl.c -o stack && ./stack
 *
 * 가득 찼을 때 할 일은 두 가지다. 슬라이드는 같은 이름 StackFull()을 두 번 적는다(p.51 끝내기, p.53 두 배 늘리기).
 * 한 파일에 둘을 다 두려고 이름을 StackFullExit, StackFullDouble로 나누고, 함수 포인터 StackFull로 갈아 끼운다.
 *
 * 확인하는 것
 *   1. 문서의 추적 표(용량 4): push 11, 22, 33 -> pop 33 -> pop 22 -> push 44, 55, 66 -> 가득 참.
 *   2. 카드 C1(용량 4): push 5, 8 / pop / push 3, 7, 1 / pop -> 꺼낸 값 8, 1, top = 2, 배열 [5, 3, 7, 1].
 *   3. 카드 C2: 빈 스택(top = -1)에서 stack[top++]로 쓰면 건드리는 칸 번호가 -1이다.
 *   4. 용량 1에서 시작해 두 배씩 늘리면 push 100번 뒤 용량이 128이고, 값이 하나도 안 바뀐다.
 *   5. 무작위 연산 5,000번 두 묶음(용량 8 고정 판, 두 배 늘리기 판)에서
 *      느린 모형(맨 위를 0번 칸에 두고 넣고 뺄 때마다 한 칸씩 미는 배열)과 꺼낸 값·맨 위·개수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

/* ---------- 문서에 실은 코드 ---------- */

typedef int element;

static element *stack;        /* 원소를 담는 배열. stack[0]이 바닥, stack[top]이 맨 위 */
static int capacity;          /* 배열의 칸 수 (슬라이드 p.49의 MAX_STACK_SIZE) */
static int top = -1;          /* 맨 위 원소의 칸 번호. 비었으면 -1 */

int IsEmpty(void) { return top == -1; }
int IsFull(void)  { return top == capacity - 1; }

/* 가득 찼을 때 1: 알리고 끝낸다 (슬라이드 p.51) */
void StackFullExit(void)
{
    fprintf(stderr, "Stack is full, cannot add element.\n");
    exit(EXIT_FAILURE);
}

/* 가득 찼을 때 2: 배열을 두 배로 늘린다 (슬라이드 p.53) */
void StackFullDouble(void)
{
    element *bigger = realloc(stack, 2 * capacity * sizeof(*stack));
    if (bigger == NULL) {
        fprintf(stderr, "Insufficient memory\n");
        exit(EXIT_FAILURE);
    }
    stack = bigger;
    capacity *= 2;
}

static void (*StackFull)(void) = StackFullExit;      /* 둘 중 지금 쓰는 쪽 */

element StackEmpty(void)
{
    fprintf(stderr, "Stack is empty, cannot delete element.\n");
    exit(EXIT_FAILURE);
}

void push(element item)
{
    if (top >= capacity - 1)
        StackFull();
    stack[++top] = item;          /* top을 먼저 1 올리고, 그 칸에 넣는다 */
}

element pop(void)
{
    if (top == -1)
        return StackEmpty();
    return stack[top--];          /* 맨 위 값을 돌려주고, top을 1 내린다 */
}

element Top(void)
{
    if (top == -1)
        return StackEmpty();
    return stack[top];
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

static void start_stack(int cap, void (*on_full)(void))
{
    free(stack);
    stack = malloc((size_t)cap * sizeof(*stack));
    if (stack == NULL) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); }
    for (int i = 0; i < cap; i++) stack[i] = 0;
    capacity = cap;
    top = -1;
    StackFull = on_full;
}

/* 느린 모형: 맨 위가 늘 0번 칸이다. 넣을 때 모두 한 칸 밀고, 꺼낼 때 모두 한 칸 당긴다 */
#define MODEL_MAX 6000
static element model[MODEL_MAX];
static int model_n = 0;
static void model_push(element x)
{
    for (int i = model_n; i > 0; i--) model[i] = model[i - 1];
    model[0] = x;
    model_n++;
}
static element model_pop(void)
{
    element x = model[0];
    for (int i = 1; i < model_n; i++) model[i - 1] = model[i];
    model_n--;
    return x;
}

static void show(const char *what)
{
    printf("  %-10s top = %2d  배열 [", what, top);
    for (int i = 0; i < capacity; i++) printf("%s%d", i ? ", " : "", stack[i]);
    printf("]\n");
}

static int same_array(const int *want, int n)
{
    for (int i = 0; i < n; i++) if (stack[i] != want[i]) return 0;
    return 1;
}

static void random_run(int cap, void (*on_full)(void), int ops, int may_grow)
{
    start_stack(cap, on_full);
    model_n = 0;
    int max_size = 0, skipped = 0;
    for (int k = 0; k < ops; k++) {
        int r = (int)(rnd() % 5);
        if (r < 3) {                                  /* 넣기 */
            if (!may_grow && IsFull()) { skipped++; continue; }   /* 고정 판은 가득 차면 넣지 않는다 */
            element x = (element)(rnd() % 1000);
            push(x);
            model_push(x);
        } else if (!IsEmpty()) {                      /* 꺼내기 */
            check(pop() == model_pop(), "무작위: 꺼낸 값");
        }
        check(top + 1 == model_n, "무작위: 개수 = top + 1");
        check(IsEmpty() == (model_n == 0), "무작위: IsEmpty");
        if (!IsEmpty()) check(Top() == model[0], "무작위: 맨 위");
        check(top >= -1 && top <= capacity - 1, "불변식: -1 <= top <= capacity - 1");
        if (model_n > max_size) max_size = model_n;
    }
    if (may_grow) {
        int want = cap;
        while (want < max_size) want *= 2;
        check(capacity == want, "두 배 늘리기: 용량은 최대 개수 이상인 가장 작은 2의 거듭제곱");
    } else {
        check(capacity == cap && max_size <= cap && skipped > 0, "고정 판: 용량이 그대로이고 가득 찬 적이 있다");
    }
    while (!IsEmpty()) check(pop() == model_pop(), "무작위: 남은 것 모두 꺼내기");
    check(model_n == 0, "무작위: 모형도 비었다");
}

int main(void)
{
    /* 1. 문서의 추적 표 (용량 4, 가득 차면 끝내는 판. 가득 찬 뒤로는 넣지 않는다) */
    start_stack(4, StackFullExit);
    check(IsEmpty() && !IsFull() && top == -1, "처음: 비었다");
    push(11); show("push(11)"); check(top == 0, "push(11)");
    push(22); show("push(22)"); check(top == 1, "push(22)");
    push(33); show("push(33)"); check(top == 2 && Top() == 33, "push(33)");
    element x = pop(); show("pop()"); check(x == 33 && top == 1, "pop() -> 33");
    x = pop(); show("pop()"); check(x == 22 && top == 0, "pop() -> 22");
    const int after_pops[4] = { 11, 22, 33, 0 };
    check(same_array(after_pops, 4), "꺼낸 값 22, 33은 배열에 그대로 남아 있다");
    push(44); show("push(44)"); check(top == 1, "push(44)");
    push(55); show("push(55)"); check(top == 2, "push(55)");
    push(66); show("push(66)"); check(top == 3 && IsFull(), "push(66) 뒤 가득 참");
    const int full[4] = { 11, 44, 55, 66 };
    check(same_array(full, 4), "추적 표 마지막 줄의 배열");

    /* 2. 카드 C1 */
    start_stack(4, StackFullExit);
    push(5); push(8);
    element c1a = pop();
    push(3); push(7); push(1);
    check(IsFull(), "C1: push 1 뒤 가득 참");
    element c1b = pop();
    const int c1[4] = { 5, 3, 7, 1 };
    check(c1a == 8 && c1b == 1 && top == 2 && same_array(c1, 4), "C1: 8, 1을 꺼내고 top = 2, 배열 [5, 3, 7, 1]");

    /* 3. 카드 C2: 빈 스택에서 stack[top++] = item이 건드릴 칸 번호 */
    int t = -1;
    int wrong_index = t++;         /* 값을 쓰는 칸은 올리기 전의 top */
    int t2 = -1;
    int right_index = ++t2;        /* 올린 뒤의 top */
    check(wrong_index == -1 && right_index == 0 && t == 0 && t2 == 0, "C2: top++는 -1번 칸, ++top은 0번 칸");

    /* 4. 용량 1에서 두 배씩 */
    start_stack(1, StackFullDouble);
    int doublings = 0, last_cap = capacity;
    for (int i = 1; i <= 100; i++) {
        push(i * i);
        if (capacity != last_cap) { check(capacity == 2 * last_cap, "한 번에 두 배"); doublings++; last_cap = capacity; }
    }
    check(capacity == 128 && doublings == 7 && top == 99, "push 100번: 용량 128, 늘린 횟수 7");
    int kept = 1;
    for (int i = 100; i >= 1; i--) if (pop() != i * i) kept = 0;
    check(kept && IsEmpty(), "늘린 뒤에도 값과 순서가 그대로");

    /* 5. 무작위 연산 5,000번씩 */
    random_run(8, StackFullExit, 5000, 0);
    random_run(1, StackFullDouble, 5000, 1);

    free(stack);
    stack = NULL;

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
