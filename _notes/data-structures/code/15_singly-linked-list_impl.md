---
layout: "note"
title: "15_singly-linked-list_impl.c"
display_title: "15_singly-linked-list_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "15"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/singly-linked-list/"
parent_title: "단순 연결 리스트"
description: "자료구조 · 단순 연결 리스트 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/15_singly-linked-list_impl/"
---
{% raw %}
[단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/) 문서의 구현 코드다.

```c
/* 단순 연결 리스트(체인): 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/15.단순 연결 리스트.md
 * 문서는 "맨 앞", "1번 노드 뒤", "2번 노드 뒤"처럼 정해진 자리의 코드를 싣는다.
 * 아무 자리 k에서 되는 insertAt, deleteAt과 nodeAt, freeList는 같은 줄들을 묶은 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 15_singly-linked-list_impl.c -o chain && ./chain
 * 번호: 노드 자리 k는 0부터 센다(delete(0)이 맨 앞 노드를 지운다).
 *
 * 확인하는 것
 *   1. first에서 링크를 0 ~ 4번 따라가면 a ~ e, 다섯 번 따라가면 NULL.
 *   2. delete(0) -> bcde, 1번 노드 뒤(c) 지우기 -> abde.
 *   3. 맨 앞에 f -> fabcde, 2번 노드(c) 뒤에 f -> abcfde.
 *   4. 맨 앞 끼우기에서 새 노드의 link에 NULL을 넣으면 길이 5인 목록이 길이 1이 된다.
 *   5. 끼우기의 두 줄을 바꿔 쓰면 새 노드가 자기 자신을 가리킨다(카드 C2).
 *   6. 카드 C1: abcde -> 2번 지우기 -> 맨 앞에 f -> 2번 노드 뒤에 g -> fabgde.
 *   7. k번 노드를 찾는 데 링크를 정확히 k번 따라간다.
 *   8. 무작위 끼우기·지우기 3,000번: 순회한 결과가 배열 모형과 같고, 길이와 끝의 NULL이 맞다.
 *   9. 범위 밖 자리는 거절한다. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveNodes = 0;    /* malloc 횟수 - free 횟수. 끝에서 0이어야 누수가 없다 */
static long hops = 0;         /* 링크를 따라간 횟수 */

/* MALLOC: 메모리를 얻고, 못 얻으면 끝낸다. 여기서는 노드 수도 센다 */
#define MALLOC(p, s) \
    do { \
        if (!((p) = malloc(s))) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); } \
        liveNodes++; \
    } while (0)

/* ---------- 문서에 실은 코드 ---------- */

typedef struct listNode *listPointer;
typedef struct listNode {
    char data;                /* 원소 */
    listPointer link;         /* 다음 노드의 주소. 마지막 노드면 NULL */
} listNode;

/* k번 노드(맨 앞이 0번)의 주소. 그런 노드가 없으면 NULL */
listPointer nodeAt(listPointer first, int k)
{
    listPointer p = first;
    while (p != NULL && k > 0) {
        p = p->link;          /* 링크를 한 번 따라간다 */
        hops++;
        k--;
    }
    return p;
}

/* 맨 앞에 끼운다. first 자체가 바뀌므로 first의 주소를 받는다 */
void insertFront(listPointer *first, char data)
{
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = *first;           /* 새 노드가 지금의 첫 노드를 가리킨다 */
    *first = newNode;                 /* first가 새 노드를 가리킨다 */
}

/* beforeNode 바로 뒤에 끼운다 */
void insertAfter(listPointer beforeNode, char data)
{
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = beforeNode->link; /* 1: 새 노드가 뒤 노드를 가리킨다 */
    beforeNode->link = newNode;       /* 2: 앞 노드가 새 노드를 가리킨다 */
}

/* 맨 앞 노드를 지운다. 목록이 비어 있으면 안 된다 */
void deleteFront(listPointer *first)
{
    listPointer deleteNode = *first;  /* 지울 노드의 주소를 적어 둔다 */
    *first = (*first)->link;          /* first가 둘째 노드를 가리킨다 */
    free(deleteNode);
    liveNodes--;
}

/* beforeNode 바로 뒤 노드를 지운다. 뒤 노드가 있어야 한다 */
void deleteAfter(listPointer beforeNode)
{
    listPointer deleteNode = beforeNode->link;   /* 지울 노드의 주소를 적어 둔다 */
    beforeNode->link = deleteNode->link;         /* 앞 노드가 지울 노드의 다음을 가리킨다 */
    free(deleteNode);
    liveNodes--;
}

/* k번 자리에 끼운다(0이면 맨 앞, 길이와 같으면 맨 뒤). 자리가 없으면 0을 돌려준다 */
int insertAt(listPointer *first, int k, char data)
{
    if (k < 0) return 0;
    if (k == 0) { insertFront(first, data); return 1; }
    listPointer beforeNode = nodeAt(*first, k - 1);
    if (beforeNode == NULL) return 0;
    insertAfter(beforeNode, data);
    return 1;
}

/* k번 노드를 지운다. 그런 노드가 없으면 0을 돌려준다 */
int deleteAt(listPointer *first, int k)
{
    if (k < 0 || *first == NULL) return 0;
    if (k == 0) { deleteFront(first); return 1; }
    listPointer beforeNode = nodeAt(*first, k - 1);
    if (beforeNode == NULL || beforeNode->link == NULL) return 0;
    deleteAfter(beforeNode);
    return 1;
}

/* 모든 노드를 돌려준다 */
void freeList(listPointer *first)
{
    while (*first != NULL) deleteFront(first);
}

/* ---------- 틀린 판 두 개 (무엇이 깨지는지 보이려고 둔다) ---------- */

/* 틀린 맨 앞 끼우기: 새 노드의 link에 NULL을 넣는다 */
static void insertFront_nullLink(listPointer *first, char data)
{
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = NULL;
    *first = newNode;
}

/* insertAfter의 두 줄을 바꿔 쓴 것 */
static listPointer insertAfter_swapped(listPointer beforeNode, char data)
{
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    beforeNode->link = newNode;       /* 2를 먼저 */
    newNode->link = beforeNode->link; /* 1을 나중에: beforeNode->link는 이미 newNode다 */
    return newNode;
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

static int length(listPointer first)
{
    int n = 0;
    for (listPointer p = first; p != NULL; p = p->link) n++;
    return n;
}

static const char *text(listPointer first)
{
    static char buf[4096];
    int n = 0;
    for (listPointer p = first; p != NULL && n < 4095; p = p->link) buf[n++] = p->data;
    buf[n] = '\0';
    return buf;
}

static listPointer build(const char *s)
{
    listPointer first = NULL;
    for (int i = (int)strlen(s) - 1; i >= 0; i--) insertFront(&first, s[i]);
    return first;
}

int main(void)
{
    listPointer first, beforeNode;

    /* 1. 링크를 따라가며 노드 찾기 */
    first = build("abcde");
    check(strcmp(text(first), "abcde") == 0 && length(first) == 5, "L = (a, b, c, d, e)");
    check(first->data == 'a' && first->link->data == 'b' && first->link->link->data == 'c', "첫째, 둘째, 셋째 노드");
    check(first->link->link->link->link->link == NULL, "링크를 다섯 번 따라가면 NULL");
    for (int k = 0; k < 5; k++) {
        hops = 0;
        listPointer p = nodeAt(first, k);
        check(p != NULL && p->data == "abcde"[k] && hops == k, "nodeAt(k): 링크를 k번 따라간다");
    }
    check(nodeAt(first, 5) == NULL && nodeAt(first, 99) == NULL, "없는 자리는 NULL");

    /* 2. delete(0) */
    deleteFront(&first);
    check(strcmp(text(first), "bcde") == 0, "delete(0) -> bcde");
    freeList(&first);
    check(first == NULL, "freeList 뒤 first는 NULL");

    /* 2. 1번 노드(b) 뒤의 c를 지운다 */
    first = build("abcde");
    beforeNode = first->link;
    check(beforeNode->data == 'b', "지우기: beforeNode는 b");
    deleteAfter(beforeNode);
    check(strcmp(text(first), "abde") == 0 && beforeNode->link->data == 'd', "지우기 -> abde, b가 d를 가리킨다");
    freeList(&first);

    /* 3. 맨 앞에 f */
    first = build("abcde");
    insertFront(&first, 'f');
    check(strcmp(text(first), "fabcde") == 0 && length(first) == 6, "맨 앞 끼우기 -> fabcde");
    freeList(&first);

    /* 3. 2번 노드(c) 뒤에 f */
    first = build("abcde");
    beforeNode = first->link->link;
    check(beforeNode->data == 'c', "끼우기: beforeNode는 c");
    insertAfter(beforeNode, 'f');
    check(strcmp(text(first), "abcfde") == 0 && beforeNode->link->data == 'f'
          && beforeNode->link->link->data == 'd', "끼우기 -> abcfde, c -> f -> d");
    freeList(&first);

    /* 4. 틀린 맨 앞 끼우기 */
    first = build("abcde");
    listPointer old = first;                    /* 잃어버릴 목록을 따로 적어 둔다 */
    insertFront_nullLink(&first, 'f');
    check(length(first) == 1 && strcmp(text(first), "f") == 0, "link에 NULL을 넣으면: 길이 5가 길이 1이 된다");
    check(length(old) == 5 && strcmp(text(old), "abcde") == 0, "a ~ e는 남아 있지만 first에서는 갈 수 없다");
    freeList(&first);
    freeList(&old);

    /* 5. 두 줄을 바꿔 쓰면 (카드 C2) */
    first = build("abcde");
    beforeNode = first->link->link;             /* c */
    listPointer lost = beforeNode->link;        /* d: 잃어버릴 뒤쪽을 따로 적어 둔다 */
    listPointer made = insertAfter_swapped(beforeNode, 'f');
    check(made->link == made, "바꿔 쓰면 새 노드가 자기 자신을 가리킨다");
    check(beforeNode->link == made && strcmp(text(lost), "de") == 0, "d, e는 first에서 갈 수 없다");
    made->link = NULL;                          /* 끝없이 도는 고리를 끊고 정리한다 */
    freeList(&first);
    freeList(&lost);

    /* 6. 카드 C1 */
    first = build("abcde");
    check(deleteAt(&first, 2) == 1 && strcmp(text(first), "abde") == 0, "C1: 2번 지우기 -> abde");
    insertFront(&first, 'f');
    check(strcmp(text(first), "fabde") == 0, "C1: 맨 앞에 f -> fabde");
    beforeNode = nodeAt(first, 2);
    check(beforeNode->data == 'b', "C1: 2번 노드는 b");
    insertAfter(beforeNode, 'g');
    check(strcmp(text(first), "fabgde") == 0 && length(first) == 6, "C1: -> fabgde");
    freeList(&first);

    /* 9. 범위 밖 */
    first = NULL;
    check(deleteAt(&first, 0) == 0 && insertAt(&first, 1, 'x') == 0, "빈 목록: 지울 것이 없고 1번 자리도 없다");
    check(insertAt(&first, 0, 'a') == 1 && insertAt(&first, 1, 'b') == 1 && strcmp(text(first), "ab") == 0, "0번, 맨 뒤에 끼우기");
    check(insertAt(&first, 3, 'x') == 0 && deleteAt(&first, 2) == 0 && deleteAt(&first, -1) == 0, "길이를 넘는 자리는 거절");
    check(deleteAt(&first, 1) == 1 && strcmp(text(first), "a") == 0 && first->link == NULL, "마지막 노드 지우기");
    freeList(&first);

    /* 8. 무작위 3,000번 */
    char model[3100];
    int n = 0;
    first = NULL;
    long total_hops = 0;
    for (int op = 0; op < 3000; op++) {
        if (n == 0 || rnd() % 5 < 3) {                 /* 끼우기 */
            int k = (int)(rnd() % (unsigned)(n + 1));
            char c = (char)('a' + rnd() % 26);
            hops = 0;
            check(insertAt(&first, k, c) == 1, "무작위: 끼우기");
            check(hops == (k == 0 ? 0 : k - 1), "끼우기: 앞 노드를 찾는 데 k - 1걸음");
            total_hops += hops;
            memmove(model + k + 1, model + k, (size_t)(n - k));   /* 배열은 뒤를 모두 민다 */
            model[k] = c;
            n++;
        } else {                                        /* 지우기 */
            int k = (int)(rnd() % (unsigned)n);
            check(deleteAt(&first, k) == 1, "무작위: 지우기");
            memmove(model + k, model + k + 1, (size_t)(n - k - 1));
            n--;
        }
        model[n] = '\0';
        check(length(first) == n && strcmp(text(first), model) == 0, "무작위: 순회 결과 = 배열 모형");
        check(liveNodes == n, "무작위: 살아 있는 노드 수 = 길이");
    }
    printf("  무작위 3,000번 뒤 길이 %d, 끼울 자리를 찾느라 따라간 링크 %ld번\n", n, total_hops);
    freeList(&first);
    check(first == NULL && liveNodes == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
