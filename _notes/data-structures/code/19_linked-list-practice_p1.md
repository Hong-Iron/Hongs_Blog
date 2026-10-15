---
layout: "note"
title: "19_linked-list-practice_p1.c"
display_title: "19_linked-list-practice_p1.c"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-list-practice/"
parent_title: "연결 리스트 연습"
description: "자료구조 · 연결 리스트 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/19_linked-list-practice_p1/"
---
{% raw %}
[연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/) 문서의 문제 1 풀이 코드다.

```c
/* 연결 리스트 연습 문제 1: 체인 따라가기.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/19.연결 리스트 연습.md
 * printList, length, indexOf는 "링크를 따라간다"를 반복문으로 묶은 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 19_linked-list-practice_p1.c -o p1 && ./p1
 * 번호: 노드 번호는 0부터 센다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

typedef struct listNode *listPointer;
typedef struct listNode {
    char data;
    listPointer link;
} listNode;

static long liveNodes = 0;

/* ---------- 문서에 실은 코드 ---------- */

/* 원소를 맨 앞부터 차례로 out에 적는다 */
void printList(listPointer first, char *out)
{
    int n = 0;
    for (listPointer p = first; p != NULL; p = p->link)   /* NULL에 닿을 때까지 링크를 따라간다 */
        out[n++] = p->data;
    out[n] = '\0';
}

/* 노드 수 */
int length(listPointer first)
{
    int n = 0;
    for (listPointer p = first; p != NULL; p = p->link) n++;
    return n;
}

/* x가 든 첫 노드의 번호. 없으면 -1 */
int indexOf(listPointer first, char x)
{
    int k = 0;
    for (listPointer p = first; p != NULL; p = p->link, k++)
        if (p->data == x) return k;
    return -1;
}

/* ---------- 여기부터 테스트 ---------- */

static listPointer build(const char *s)
{
    listPointer first = NULL;
    for (int i = (int)strlen(s) - 1; i >= 0; i--) {
        listPointer node = malloc(sizeof(*node));
        if (node == NULL) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); }
        liveNodes++;
        node->data = s[i];
        node->link = first;
        first = node;
    }
    return first;
}

static void freeList(listPointer first)
{
    while (first != NULL) { listPointer d = first; first = first->link; free(d); liveNodes--; }
}

int main(void)
{
    char out[64];
    listPointer first = build("abcde");

    /* (가) ~ (다) */
    check(first->link->link->data == 'c', "(가) first->link->link->data는 c");
    check(first->link->link->link->link->data == 'e', "(나) 링크 네 번이면 e");
    check(first->link->link->link->link->link == NULL, "(다) 링크 다섯 번이면 NULL");

    /* (라) */
    printList(first, out);
    check(strcmp(out, "abcde") == 0 && length(first) == 5, "(라) printList는 abcde, length는 5");
    check(indexOf(first, 'a') == 0 && indexOf(first, 'd') == 3 && indexOf(first, 'z') == -1, "변형: indexOf");

    /* 빈 목록과 노드 하나 */
    printList(NULL, out);
    check(strcmp(out, "") == 0 && length(NULL) == 0 && indexOf(NULL, 'a') == -1, "빈 목록");
    listPointer one = build("q");
    printList(one, out);
    check(strcmp(out, "q") == 0 && length(one) == 1 && one->link == NULL, "노드 하나");

    freeList(one);
    freeList(first);
    check(liveNodes == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
