---
layout: "note"
title: "17_linked-list-variants_impl.c"
display_title: "17_linked-list-variants_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "17"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-list-variants/"
parent_title: "연결 리스트의 변형"
description: "자료구조 · 연결 리스트의 변형 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/17_linked-list-variants_impl/"
---
{% raw %}
[연결 리스트의 변형](/Hongs_Blog/studies/data-structures/linked-list-variants/) 문서의 구현 코드다.

```c
/* 연결 리스트의 변형: 헤더 노드가 있는 체인, 원형 리스트, 헤더 노드가 있는 이중 원형 리스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/17.연결 리스트의 변형.md
 * 출처: 자료구조 5주차 슬라이드 p.19~25. 슬라이드에는 그림만 있다. 코드는 그 그림대로 짠 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 17_linked-list-variants_impl.c -o variants && ./variants
 * 번호: 원소 자리 k는 0부터 센다. 헤더 노드는 원소가 아니라서 자리 번호가 없다.
 *
 * 확인하는 것
 *   1. 헤더 노드가 있는 체인: 빈 목록은 headerNode->link == NULL(슬라이드 p.20).
 *      0번 자리에 끼우고 지워도 headerNode의 주소가 그대로다.
 *   2. 원형 리스트(p.21): 어느 노드에서 출발해도 다섯 노드를 한 번씩 만나고 NULL은 나오지 않는다.
 *   3. 헤더 노드가 있는 이중 원형 리스트: 빈 목록은 두 링크가 모두 헤더 자신(p.25).
 *      오른쪽으로 돌면 abcde, 왼쪽으로 돌면 edcba(p.24). 마지막 노드는 headerNode->llink 한 번에 닿는다.
 *   4. 카드 C1: (a, b, c)에서 b를 지우면 링크 2개, 헤더 뒤에 d를 끼우면 링크 4개가 바뀌어 (d, a, c).
 *   5. 모든 노드 p에서 p->rlink->llink == p == p->llink->rlink.
 *   6. 무작위 끼우기·지우기 3,000번씩(헤더 체인, 이중 원형): 순회 결과가 배열 모형과 같다.
 *   7. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

static long liveNodes = 0;    /* malloc 횟수 - free 횟수 */
static long link_writes = 0;  /* 링크 칸에 값을 쓴 횟수 */

#define MALLOC(p, s) \
    do { \
        if (!((p) = malloc(s))) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); } \
        liveNodes++; \
    } while (0)

/* ---------- 1. 헤더 노드가 있는 체인 ---------- */

typedef struct listNode *listPointer;
typedef struct listNode {
    char data;
    listPointer link;
} listNode;

/* 값을 담지 않는 노드 하나를 만든다. 빈 목록이다 */
listPointer makeHeader(void)
{
    listPointer headerNode;
    MALLOC(headerNode, sizeof(*headerNode));
    headerNode->data = '\0';
    headerNode->link = NULL;
    return headerNode;
}

/* k번 자리에 끼운다. k가 0이어도 다른 자리와 같은 코드다 */
int insertAt(listPointer headerNode, int k, char data)
{
    listPointer beforeNode = headerNode;              /* 0번 원소의 앞 노드는 헤더 노드다 */
    for (int i = 0; i < k && beforeNode != NULL; i++) beforeNode = beforeNode->link;
    if (k < 0 || beforeNode == NULL) return 0;
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = beforeNode->link;  link_writes++;
    beforeNode->link = newNode;        link_writes++;
    return 1;
}

/* k번 원소를 지운다 */
int deleteAt(listPointer headerNode, int k)
{
    listPointer beforeNode = headerNode;
    for (int i = 0; i < k && beforeNode != NULL; i++) beforeNode = beforeNode->link;
    if (k < 0 || beforeNode == NULL || beforeNode->link == NULL) return 0;
    listPointer deleteNode = beforeNode->link;
    beforeNode->link = deleteNode->link;  link_writes++;
    free(deleteNode);
    liveNodes--;
    return 1;
}

/* ---------- 2. 원형 리스트 ---------- */

/* start에서 출발해 한 바퀴 돌며 노드를 센다. NULL이 없으니 "출발한 곳에 돌아왔나"로 멈춘다 */
int countCircular(listPointer start)
{
    if (start == NULL) return 0;
    int n = 0;
    listPointer p = start;
    do {
        n++;
        p = p->link;
    } while (p != start);
    return n;
}

/* ---------- 3. 헤더 노드가 있는 이중 원형 리스트 ---------- */

typedef struct dnode *dPointer;
typedef struct dnode {
    dPointer llink;           /* 왼쪽(앞) 노드 */
    char data;
    dPointer rlink;           /* 오른쪽(뒤) 노드 */
} dnode;

/* 빈 목록: 헤더 노드의 두 링크가 모두 자기 자신이다 */
dPointer makeDoubleHeader(void)
{
    dPointer headerNode;
    MALLOC(headerNode, sizeof(*headerNode));
    headerNode->data = '\0';
    headerNode->llink = headerNode;
    headerNode->rlink = headerNode;
    return headerNode;
}

/* node 바로 오른쪽에 끼운다. 링크 네 개를 쓴다 */
void dinsert(dPointer node, char data)
{
    dPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->llink = node;             link_writes++;   /* 새 노드의 왼쪽은 node */
    newNode->rlink = node->rlink;      link_writes++;   /* 새 노드의 오른쪽은 node의 옛 오른쪽 */
    node->rlink->llink = newNode;      link_writes++;   /* 옛 오른쪽 노드의 왼쪽은 새 노드 */
    node->rlink = newNode;             link_writes++;   /* node의 오른쪽은 새 노드 */
}

/* deleted를 뺀다. 앞 노드를 찾을 필요가 없다. 헤더 노드는 지우지 않는다 */
int ddelete(dPointer headerNode, dPointer deleted)
{
    if (deleted == headerNode) return 0;
    deleted->llink->rlink = deleted->rlink;  link_writes++;   /* 왼쪽 노드가 오른쪽 노드를 가리킨다 */
    deleted->rlink->llink = deleted->llink;  link_writes++;   /* 오른쪽 노드가 왼쪽 노드를 가리킨다 */
    free(deleted);
    liveNodes--;
    return 1;
}

/* ---------- 여기부터 테스트 ---------- */

static unsigned long long lcg_state = 20261012ULL;
static unsigned rnd(void)
{
    lcg_state = lcg_state * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(lcg_state >> 33);
}

static const char *chain_text(listPointer headerNode)
{
    static char buf[4096];
    int n = 0;
    for (listPointer p = headerNode->link; p != NULL && n < 4095; p = p->link) buf[n++] = p->data;
    buf[n] = '\0';
    return buf;
}

static const char *right_text(dPointer headerNode)
{
    static char buf[4096];
    int n = 0;
    for (dPointer p = headerNode->rlink; p != headerNode && n < 4095; p = p->rlink) buf[n++] = p->data;
    buf[n] = '\0';
    return buf;
}

static const char *left_text(dPointer headerNode)
{
    static char buf[4096];
    int n = 0;
    for (dPointer p = headerNode->llink; p != headerNode && n < 4095; p = p->llink) buf[n++] = p->data;
    buf[n] = '\0';
    return buf;
}

static int links_agree(dPointer headerNode)
{
    dPointer p = headerNode;
    do {
        if (p->rlink->llink != p || p->llink->rlink != p) return 0;
        p = p->rlink;
    } while (p != headerNode);
    return 1;
}

static dPointer dnode_at(dPointer headerNode, int k)      /* k번 원소. k = -1이면 헤더 노드 */
{
    dPointer p = headerNode;
    for (int i = 0; i <= k; i++) p = p->rlink;
    return p;
}

static void dfree_all(dPointer headerNode)
{
    while (headerNode->rlink != headerNode) ddelete(headerNode, headerNode->rlink);
    free(headerNode);
    liveNodes--;
}

int main(void)
{
    /* 1. 헤더 노드가 있는 체인 */
    listPointer headerNode = makeHeader();
    listPointer same_header = headerNode;
    check(headerNode->link == NULL && strcmp(chain_text(headerNode), "") == 0, "p.20 빈 체인: headerNode->link == NULL");
    const char *abcde = "abcde";
    for (int i = 0; i < 5; i++) check(insertAt(headerNode, i, abcde[i]) == 1, "맨 뒤에 끼우기");
    check(strcmp(chain_text(headerNode), "abcde") == 0, "p.19 헤더 노드 뒤에 a ~ e");
    link_writes = 0;
    check(insertAt(headerNode, 0, 'f') == 1 && strcmp(chain_text(headerNode), "fabcde") == 0, "0번 자리에 끼우기");
    check(link_writes == 2 && headerNode == same_header, "0번 자리도 링크 2개, headerNode는 그대로");
    link_writes = 0;
    check(deleteAt(headerNode, 0) == 1 && strcmp(chain_text(headerNode), "abcde") == 0, "0번 지우기");
    check(link_writes == 1 && headerNode == same_header, "0번 지우기도 링크 1개, headerNode는 그대로");
    check(deleteAt(headerNode, 5) == 0 && insertAt(headerNode, 7, 'x') == 0, "없는 자리는 거절");

    /* 2. 원형 리스트: 체인의 마지막 노드를 첫 노드에 잇는다 */
    listPointer firstNode = headerNode->link;
    listPointer last = firstNode;
    while (last->link != NULL) last = last->link;
    last->link = firstNode;                              /* e -> a */
    listPointer start = firstNode;
    for (int s = 0; s < 5; s++) {
        check(countCircular(start) == 5, "p.21 어디서 출발해도 다섯 노드");
        char seen[6];
        listPointer p = start;
        for (int i = 0; i < 5; i++) { seen[i] = p->data; check(p->link != NULL, "원형: NULL이 없다"); p = p->link; }
        seen[5] = '\0';
        char want[6];
        for (int i = 0; i < 5; i++) want[i] = abcde[(s + i) % 5];
        want[5] = '\0';
        check(strcmp(seen, want) == 0 && p == start, "원형: 한 바퀴 돌면 출발한 노드");
        start = start->link;
    }
    check(countCircular(NULL) == 0, "빈 원형 리스트");
    last->link = NULL;                                   /* 다시 체인으로 풀어 정리한다 */
    while (deleteAt(headerNode, 0)) { }
    check(headerNode->link == NULL, "모두 지우면 다시 빈 체인");

    /* 6. 헤더 체인 무작위 3,000번 */
    char model[3100];
    int n = 0;
    for (int op = 0; op < 3000; op++) {
        if (n == 0 || rnd() % 5 < 3) {
            int k = (int)(rnd() % (unsigned)(n + 1));
            char c = (char)('a' + rnd() % 26);
            check(insertAt(headerNode, k, c) == 1, "헤더 체인 무작위: 끼우기");
            memmove(model + k + 1, model + k, (size_t)(n - k));
            model[k] = c;
            n++;
        } else {
            int k = (int)(rnd() % (unsigned)n);
            check(deleteAt(headerNode, k) == 1, "헤더 체인 무작위: 지우기");
            memmove(model + k, model + k + 1, (size_t)(n - k - 1));
            n--;
        }
        model[n] = '\0';
        check(strcmp(chain_text(headerNode), model) == 0 && headerNode == same_header, "헤더 체인 무작위: 배열 모형과 같다");
        check(liveNodes == n + 1, "헤더 체인 무작위: 노드 수 = 원소 수 + 헤더 1");
    }
    while (deleteAt(headerNode, 0)) { }
    free(headerNode);
    liveNodes--;
    check(liveNodes == 0, "헤더 체인 정리");

    /* 3. 헤더 노드가 있는 이중 원형 리스트 */
    dPointer h = makeDoubleHeader();
    check(h->llink == h && h->rlink == h && links_agree(h), "p.25 빈 목록: 두 링크가 헤더 자신");
    for (int i = 0; i < 5; i++) dinsert(h->llink, abcde[i]);        /* 마지막 노드 뒤에 붙인다 */
    check(strcmp(right_text(h), "abcde") == 0 && strcmp(left_text(h), "edcba") == 0, "p.24 오른쪽 abcde, 왼쪽 edcba");
    check(h->rlink->data == 'a' && h->llink->data == 'e' && h->llink->rlink == h && links_agree(h), "첫 노드와 마지막 노드가 헤더와 이어진다");
    dfree_all(h);

    /* 4. 카드 C1 */
    h = makeDoubleHeader();
    dinsert(h->llink, 'a'); dinsert(h->llink, 'b'); dinsert(h->llink, 'c');
    dPointer a = h->rlink, b = a->rlink, c = b->rlink;
    link_writes = 0;
    check(ddelete(h, b) == 1 && link_writes == 2, "C1: b를 지울 때 링크 2개");
    check(a->rlink == c && c->llink == a && strcmp(right_text(h), "ac") == 0, "C1: a->rlink = c, c->llink = a");
    link_writes = 0;
    dinsert(h, 'd');
    dPointer d = h->rlink;
    check(link_writes == 4 && d->data == 'd' && d->llink == h && d->rlink == a && a->llink == d, "C1: d를 끼울 때 링크 4개");
    check(strcmp(right_text(h), "dac") == 0 && strcmp(left_text(h), "cad") == 0 && links_agree(h), "C1: (d, a, c)");
    check(ddelete(h, h) == 0, "헤더 노드는 지우지 않는다");
    dfree_all(h);

    /* 6. 이중 원형 무작위 3,000번 */
    h = makeDoubleHeader();
    n = 0;
    for (int op = 0; op < 3000; op++) {
        if (n == 0 || rnd() % 5 < 3) {
            int k = (int)(rnd() % (unsigned)(n + 1));
            char ch = (char)('a' + rnd() % 26);
            dinsert(dnode_at(h, k - 1), ch);                        /* k - 1번 원소(또는 헤더) 뒤에 */
            memmove(model + k + 1, model + k, (size_t)(n - k));
            model[k] = ch;
            n++;
        } else {
            int k = (int)(rnd() % (unsigned)n);
            check(ddelete(h, dnode_at(h, k)) == 1, "이중 원형 무작위: 지우기");
            memmove(model + k, model + k + 1, (size_t)(n - k - 1));
            n--;
        }
        model[n] = '\0';
        check(strcmp(right_text(h), model) == 0, "이중 원형 무작위: 오른쪽으로 돈 결과 = 배열 모형");
        const char *lt = left_text(h);
        int reversed = ((int)strlen(lt) == n);
        for (int i = 0; reversed && i < n; i++) if (lt[i] != model[n - 1 - i]) reversed = 0;
        check(reversed, "이중 원형 무작위: 왼쪽으로 돈 결과 = 거꾸로");
        check(links_agree(h), "이중 원형 무작위: p->rlink->llink == p == p->llink->rlink");
    }
    printf("  무작위 3,000번 뒤 이중 원형 리스트의 길이 %d\n", n);
    dfree_all(h);

    /* 7. 누수 */
    check(liveNodes == 0, "malloc 횟수 = free 횟수");

    /* 노드 크기 */
    printf("  노드 크기: 링크 하나 %zu바이트, 링크 둘 %zu바이트 (포인터 %zu바이트)\n", sizeof(listNode), sizeof(dnode), sizeof(void *));
    check(sizeof(dnode) > sizeof(listNode), "이중 연결 노드가 더 크다");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
