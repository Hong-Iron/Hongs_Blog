---
layout: "note"
title: "19_linked-list-practice_p3.c"
display_title: "19_linked-list-practice_p3.c"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-list-practice/"
parent_title: "연결 리스트 연습"
description: "자료구조 · 연결 리스트 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/19_linked-list-practice_p3/"
---
{% raw %}
[연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/) 문서의 문제 3 풀이 코드다.

```c
/* 연결 리스트 연습 문제 3: 연결 스택으로 글자 순서 뒤집기.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/19.연결 리스트 연습.md
 * push, pop은 3.개념집/18_linked-stack_impl.c에서 옮겨 적었다.
 * 실행: cc -std=c11 -Wall -Wextra 19_linked-list-practice_p3.c -o p3 && ./p3
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveNodes = 0, max_live = 0;

typedef int element;

typedef struct StackNode {
    element item;
    struct StackNode *link;
} StackNode;

typedef struct {
    StackNode *top;
} LinkedStackType;

static void init(LinkedStackType *s) { s->top = NULL; }
static int is_empty(LinkedStackType *s) { return s->top == NULL; }

static void push(LinkedStackType *s, element item)
{
    StackNode *temp = (StackNode *)malloc(sizeof(StackNode));
    if (temp == NULL) { fprintf(stderr, "error\n"); exit(1); }
    liveNodes++;
    if (liveNodes > max_live) max_live = liveNodes;
    temp->item = item;
    temp->link = s->top;
    s->top = temp;
}

static element pop(LinkedStackType *s)
{
    if (is_empty(s)) { fprintf(stderr, "error\n"); exit(1); }
    StackNode *temp = s->top;
    element item = temp->item;
    s->top = s->top->link;
    free(temp);
    liveNodes--;
    return item;
}

/* ---------- 문서에 실은 코드 ---------- */

/* word의 글자를 거꾸로 out에 적는다 */
void reverseWord(const char *word, char *out)
{
    LinkedStackType s;
    init(&s);
    for (int i = 0; word[i] != '\0'; i++)
        push(&s, word[i]);            /* 앞 글자부터 차례로 쌓는다 */
    int n = 0;
    while (!is_empty(&s))
        out[n++] = (char)pop(&s);     /* 맨 위, 곧 마지막 글자부터 나온다 */
    out[n] = '\0';
}

/* ---------- 여기부터 테스트 ---------- */

static const char *chain(LinkedStackType *s)
{
    static char buf[64];
    int n = 0;
    for (StackNode *p = s->top; p != NULL && n < 63; p = p->link) buf[n++] = (char)p->item;
    buf[n] = '\0';
    return buf;
}

int main(void)
{
    char out[64];

    /* (가) DATA를 쌓는 동안의 체인 */
    LinkedStackType s;
    init(&s);
    const char *want[4] = { "D", "AD", "TAD", "ATAD" };
    for (int i = 0; i < 4; i++) {
        push(&s, "DATA"[i]);
        check(strcmp(chain(&s), want[i]) == 0, "(가) 체인: D, AD, TAD, ATAD");
    }
    check(s.top->item == 'A' && s.top->link->link->link->item == 'D' && s.top->link->link->link->link == NULL, "(가) top은 마지막 A, 맨 아래는 D");

    /* (나) 꺼내는 순서 */
    char popped[5];
    for (int i = 0; i < 4; i++) popped[i] = (char)pop(&s);
    popped[4] = '\0';
    check(strcmp(popped, "ATAD") == 0 && is_empty(&s) && liveNodes == 0, "(나) A, T, A, D 순서로 나온다");

    /* (다) reverseWord */
    max_live = 0;
    reverseWord("DATA", out);
    check(strcmp(out, "ATAD") == 0 && max_live == 4 && liveNodes == 0, "(다) DATA -> ATAD, 노드는 많을 때 4개");
    reverseWord("", out);
    check(strcmp(out, "") == 0, "빈 글");
    reverseWord("a", out);
    check(strcmp(out, "a") == 0, "한 글자");
    reverseWord("stack", out);
    check(strcmp(out, "kcats") == 0, "stack -> kcats");

    /* 변형: 스택 대신 큐에 넣었다 빼면 순서가 그대로다 (배열로 흉내 낸다) */
    char q[8]; int front = 0, rear = 0;
    for (int i = 0; i < 4; i++) q[rear++] = "DATA"[i];
    char same[5]; int n = 0;
    while (front < rear) same[n++] = q[front++];
    same[n] = '\0';
    check(strcmp(same, "DATA") == 0, "변형: 큐면 DATA 그대로");

    check(liveNodes == 0, "malloc 횟수 = free 횟수");
    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
