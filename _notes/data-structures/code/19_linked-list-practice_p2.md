---
layout: "note"
title: "19_linked-list-practice_p2.c"
display_title: "19_linked-list-practice_p2.c"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-list-practice/"
parent_title: "연결 리스트 연습"
description: "자료구조 · 연결 리스트 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/19_linked-list-practice_p2/"
---
{% raw %}
[연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/) 문서의 문제 2 풀이 코드다.

```c
/* 연결 리스트 연습 문제 2: 지우고 끼우기, 그리고 체인 뒤집기.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/19.연결 리스트 연습.md
 * 지우기와 끼우기는 단순 연결 리스트의 기본 줄을 쓴다. reverse는 변형 문제다.
 * 실행: cc -std=c11 -Wall -Wextra 19_linked-list-practice_p2.c -o p2 && ./p2
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

#define MALLOC(p, s) \
    do { \
        if (!((p) = malloc(s))) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); } \
        liveNodes++; \
    } while (0)

/* ---------- 문서에 실은 코드 ---------- */

/* 체인의 방향을 뒤집는다. 노드를 새로 만들지 않고 링크만 고친다 */
void reverse(listPointer *first)
{
    listPointer before = NULL;            /* 이미 뒤집은 부분의 맨 앞 */
    listPointer current = *first;         /* 지금 고칠 노드 */
    while (current != NULL) {
        listPointer next = current->link; /* 덮어쓰기 전에 다음 노드를 적어 둔다 */
        current->link = before;           /* 링크를 거꾸로 돌린다 */
        before = current;
        current = next;
    }
    *first = before;                      /* 옛 마지막 노드가 첫 노드다 */
}

/* ---------- 여기부터 테스트 ---------- */

static const char *text(listPointer first)
{
    static char buf[64];
    int n = 0;
    for (listPointer p = first; p != NULL && n < 63; p = p->link) buf[n++] = p->data;
    buf[n] = '\0';
    return buf;
}

static listPointer build(const char *s)
{
    listPointer first = NULL;
    for (int i = (int)strlen(s) - 1; i >= 0; i--) {
        listPointer node;
        MALLOC(node, sizeof(*node));
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
    listPointer first = build("abcde"), deleteNode, beforeNode, newNode;

    /* 1단계: delete(0) */
    deleteNode = first;
    first = first->link;
    free(deleteNode); liveNodes--;
    check(strcmp(text(first), "bcde") == 0 && first->data == 'b', "1단계: bcde, first는 b");

    /* 2단계: 1번 노드 뒤에 f (끼우기의 기본 줄, 자리만 다르다) */
    beforeNode = first->link;
    check(beforeNode->data == 'c', "2단계: 1번 노드는 c");
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = 'f';
    newNode->link = beforeNode->link;
    beforeNode->link = newNode;
    check(strcmp(text(first), "bcfde") == 0 && beforeNode->link->data == 'f' && newNode->link->data == 'd', "2단계: bcfde, c -> f -> d");

    /* 3단계: 3번 노드 지우기 (지우기의 기본 줄, 자리만 다르다) */
    beforeNode = first->link->link;
    check(beforeNode->data == 'f', "3단계: 2번 노드는 f");
    deleteNode = beforeNode->link;
    check(deleteNode->data == 'd', "3단계: 지울 3번 노드는 d");
    beforeNode->link = beforeNode->link->link;
    free(deleteNode); liveNodes--;
    check(strcmp(text(first), "bcfe") == 0 && beforeNode->link->data == 'e' && liveNodes == 4, "3단계: bcfe, f -> e");

    /* 변형: 뒤집기 */
    reverse(&first);
    check(strcmp(text(first), "efcb") == 0, "변형: bcfe를 뒤집으면 efcb");
    listPointer last = first;
    while (last->link != NULL) last = last->link;
    check(last->data == 'b' && liveNodes == 4, "변형: 마지막 노드는 b, 노드 수는 그대로");
    reverse(&first);
    check(strcmp(text(first), "bcfe") == 0, "변형: 두 번 뒤집으면 원래대로");
    freeList(first);

    listPointer empty = NULL, one = build("x");
    reverse(&empty);
    reverse(&one);
    check(empty == NULL && strcmp(text(one), "x") == 0, "변형: 빈 목록과 노드 하나");
    freeList(one);

    const char *words[4] = { "ab", "abc", "hello", "abcdefghij" };
    for (int w = 0; w < 4; w++) {
        listPointer l = build(words[w]);
        reverse(&l);
        int n = (int)strlen(words[w]), ok = 1;
        const char *t = text(l);
        for (int i = 0; i < n; i++) if (t[i] != words[w][n - 1 - i]) ok = 0;
        check(ok && (int)strlen(t) == n, "변형: 여러 길이");
        freeList(l);
    }
    check(liveNodes == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
