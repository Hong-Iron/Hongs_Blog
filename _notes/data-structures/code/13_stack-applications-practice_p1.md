---
layout: "note"
title: "13_stack-applications-practice_p1.c"
display_title: "13_stack-applications-practice_p1.c"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "13"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/stack-applications-practice/"
parent_title: "스택 응용 연습"
description: "자료구조 · 스택 응용 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/13_stack-applications-practice_p1/"
---
{% raw %}
[스택 응용 연습](/Hongs_Blog/studies/data-structures/stack-applications-practice/) 문서의 문제 1 풀이 코드다.

```c
/* 스택 응용 연습 문제 1: 괄호 짝의 위치 쌍 찾기.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/13.스택 응용 연습.md
 * 출처: 자료구조 3주차 슬라이드 p.56~62. 슬라이드에는 방법 세 줄과 스택 그림만 있다. 코드는 그대로 짠 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 13_stack-applications-practice_p1.c -o paren && ./paren
 * 번호: 글자의 위치는 슬라이드처럼 0부터 센다.
 *
 * 확인하는 것
 *   1. 슬라이드 p.56의 첫 식: (2,6) (1,13) (15,19) (21,25) (27,31) (0,32) (34,38).
 *   2. 슬라이드 p.58~62의 스택 그림: 2번 글자 뒤 [0 1 2], 15번 글자 뒤 [0 15], 21번 뒤 [0 21], 27번 뒤 [0 27].
 *   3. 슬라이드 p.56의 둘째 식 (a+b))*((c+d): (0,4), 5번 닫는 괄호는 짝이 없다, (8,12), 7번 여는 괄호는 짝이 없다.
 *   4. 변형: 스택 대신 큐를 쓰면 (a(b)c)에서 (0,4) (2,6)이라는 틀린 짝이 나온다.
 *   5. 길이 12 이하의 모든 괄호 문자열 8,191개에서, 닫는 괄호마다 왼쪽으로 훑어 가장 가까운 짝 없는 여는 괄호를 찾는
 *      느린 방법과 결과가 같다.
 */
#include <stdio.h>
#include <string.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

/* ---------- 문서에 실은 코드 ---------- */

#define MAX_STACK_SIZE 100

static int stack[MAX_STACK_SIZE];     /* 아직 짝을 못 찾은 여는 괄호의 위치 */
static int top = -1;

static void push(int position) { stack[++top] = position; }
static int pop(void) { return stack[top--]; }

static char out[4096];                /* 찍을 글을 모아 둔다 */

/* expr의 괄호 짝을 왼쪽부터 찾아 out에 적는다. 식의 길이는 MAX_STACK_SIZE 이하여야 한다 */
void match(const char *expr)
{
    int n = 0;
    out[0] = '\0';
    top = -1;
    for (int i = 0; expr[i] != '\0'; i++) {
        if (expr[i] == '(') {
            push(i);                                  /* 여는 괄호: 위치를 쌓는다 */
        } else if (expr[i] == ')') {
            if (top == -1)                            /* 꺼낼 것이 없다: 짝 없는 닫는 괄호 */
                n += snprintf(out + n, sizeof(out) - (size_t)n, "R%d ", i);
            else                                      /* 맨 위가 가장 최근에 열린 괄호다 */
                n += snprintf(out + n, sizeof(out) - (size_t)n, "(%d,%d) ", pop(), i);
        }
    }
    while (top != -1)                                 /* 끝까지 남은 것: 짝 없는 여는 괄호 */
        n += snprintf(out + n, sizeof(out) - (size_t)n, "L%d ", pop());
}

/* ---------- 여기부터 테스트 ---------- */

/* 변형: 스택 대신 큐(먼저 넣은 위치를 먼저 꺼낸다)를 쓴 틀린 판 */
static void match_with_queue(const char *expr, char *buf, size_t size)
{
    int queue[MAX_STACK_SIZE], front = 0, rear = 0, n = 0;
    buf[0] = '\0';
    for (int i = 0; expr[i] != '\0'; i++) {
        if (expr[i] == '(') queue[rear++] = i;
        else if (expr[i] == ')' && front < rear)
            n += snprintf(buf + n, size - (size_t)n, "(%d,%d) ", queue[front++], i);
    }
}

/* 느린 방법: 닫는 괄호마다 왼쪽으로 훑어 가장 가까운, 아직 짝 없는 여는 괄호를 찾는다 */
static void match_slow(const char *expr, char *buf, size_t size)
{
    int used[MAX_STACK_SIZE] = { 0 }, n = 0, len = (int)strlen(expr);
    buf[0] = '\0';
    for (int i = 0; i < len; i++) {
        if (expr[i] != ')') continue;
        int j = i - 1;
        while (j >= 0 && !(expr[j] == '(' && !used[j])) j--;
        if (j < 0) n += snprintf(buf + n, size - (size_t)n, "R%d ", i);
        else { used[j] = 1; n += snprintf(buf + n, size - (size_t)n, "(%d,%d) ", j, i); }
    }
    for (int j = len - 1; j >= 0; j--)
        if (expr[j] == '(' && !used[j]) n += snprintf(buf + n, size - (size_t)n, "L%d ", j);
}

/* expr의 앞 upto + 1글자를 읽은 뒤 스택에 남은 위치들을 "0 15" 꼴로 적는다 */
static const char *stack_after(const char *expr, int upto)
{
    static char buf[256];
    int st[MAX_STACK_SIZE], t = -1, n = 0;
    for (int i = 0; i <= upto; i++) {
        if (expr[i] == '(') st[++t] = i;
        else if (expr[i] == ')' && t >= 0) t--;
    }
    buf[0] = '\0';
    for (int i = 0; i <= t; i++) n += snprintf(buf + n, sizeof(buf) - (size_t)n, "%s%d", i ? " " : "", st[i]);
    return buf;
}

int main(void)
{
    /* 1. 슬라이드 p.56의 첫 식 */
    const char *e1 = "(((a+b)*c+d-e)/(f+g)-(h+j)*(k-l))/(m-n)";
    match(e1);
    printf("  %s\n  -> %s\n", e1, out);
    check(strcmp(out, "(2,6) (1,13) (15,19) (21,25) (27,31) (0,32) (34,38) ") == 0, "p.56 첫 식의 쌍");
    check(strlen(e1) == 39, "첫 식은 39글자(위치 0 ~ 38)");

    /* 2. 슬라이드 p.58~62의 스택 그림 */
    check(strcmp(stack_after(e1, 2), "0 1 2") == 0, "p.58 스택 0 1 2");
    check(strcmp(stack_after(e1, 15), "0 15") == 0, "p.59 스택 0 15");
    check(strcmp(stack_after(e1, 21), "0 21") == 0, "p.60 스택 0 21");
    check(strcmp(stack_after(e1, 27), "0 27") == 0, "p.61 스택 0 27");
    check(strcmp(stack_after(e1, 32), "") == 0, "p.62 (0,32) 뒤 스택이 빈다");
    int depth = 0, max_depth = 0;
    for (int i = 0; e1[i]; i++) {
        if (e1[i] == '(') { if (++depth > max_depth) max_depth = depth; }
        else if (e1[i] == ')') depth--;
    }
    check(max_depth == 3, "첫 식에서 스택이 가장 높을 때 3");

    /* 3. 슬라이드 p.56의 둘째 식 */
    const char *e2 = "(a+b))*((c+d)";
    match(e2);
    printf("  %s\n  -> %s\n", e2, out);
    check(strcmp(out, "(0,4) R5 (8,12) L7 ") == 0, "p.56 둘째 식: (0,4), 5번 닫는 괄호, (8,12), 7번 여는 괄호");
    /* 문서의 추적 표: 글자마다 스택 */
    printf("  위치 글자 스택\n");
    const char *want2[13] = { "0", "0", "0", "0", "", "", "", "7", "7 8", "7 8", "7 8", "7 8", "7" };
    for (int i = 0; e2[i]; i++) {
        const char *s = stack_after(e2, i);
        check(strcmp(s, want2[i]) == 0, "둘째 식의 추적 표");
        if (e2[i] == '(' || e2[i] == ')') printf("  %4d   %c   [%s]\n", i, e2[i], s);
    }

    /* 문서의 변형 문제 답 */
    match("((a+b)*(c-d)");
    check(strcmp(out, "(1,5) (7,11) L0 ") == 0, "변형 1: (1,5) (7,11), 0번 여는 괄호는 짝이 없다");
    match(")(");
    check(strcmp(out, "R0 L1 ") == 0, "변형 1: )( 는 둘 다 짝이 없다");

    /* 4. 스택 대신 큐를 쓰면 */
    char buf[4096];
    const char *e3 = "(a(b)c)";
    match(e3);
    check(strcmp(out, "(2,4) (0,6) ") == 0, "스택: (2,4) (0,6)");
    match_with_queue(e3, buf, sizeof(buf));
    check(strcmp(buf, "(0,4) (2,6) ") == 0, "큐: (0,4) (2,6) - 틀린 짝");

    /* 5. 길이 12 이하의 모든 괄호 문자열 */
    int strings = 0;
    for (int len = 0; len <= 12; len++)
        for (int bits = 0; bits < (1 << len); bits++) {
            char s[16];
            for (int i = 0; i < len; i++) s[i] = (bits >> i & 1) ? ')' : '(';
            s[len] = '\0';
            match(s);
            match_slow(s, buf, sizeof(buf));
            if (strcmp(out, buf) != 0) { check(0, "느린 방법과 다르다"); printf("    %s\n", s); }
            strings++;
        }
    check(strings == 8191, "문자열 8,191개");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
