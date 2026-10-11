---
layout: "note"
title: "26_tree-traversal-ladder_p4.c"
display_title: "26_tree-traversal-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "26"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/tree-traversal-ladder/"
parent_title: "이진 트리 순회 예제 사다리"
description: "자료구조 · 이진 트리 순회 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/26_tree-traversal-ladder_p4/"
---
{% raw %}
[이진 트리 순회 예제 사다리](/Hongs_Blog/studies/data-structures/tree-traversal-ladder/) 문서의 문제 4 풀이 코드다.

```c
/*
 * 이진 트리 순회 예제 사다리: 문제 1 ~ 4의 답 확인
 *
 * 실행: cc -std=c11 -Wall -Wextra 26_tree-traversal-ladder_p4.c -o out && ./out
 *
 * 네 문제의 트리를 직접 만들고 네 가지 순회 결과를 구해 문서의 답과 비교한다.
 * 이어서 순회 결과 두 줄만으로 트리를 되살려 처음 트리와 같은지 본다.
 * 문제 4의 "전위와 후위가 같은 트리의 수"는 노드 8개인 모든 모양(1,430가지)을 만들어 센다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct node *treePointer;
typedef struct node {
    char data;
    treePointer leftChild, rightChild;
} node;

static void check(int ok, const char *what)
{
    if (!ok) {
        fprintf(stderr, "CHECK FAILED: %s\n", what);
        exit(1);
    }
}

static treePointer N(char data, treePointer left, treePointer right)
{
    treePointer p = malloc(sizeof(*p));
    if (p == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(1);
    }
    p->data = data;
    p->leftChild = left;
    p->rightChild = right;
    return p;
}

static void freeTree(treePointer t)
{
    if (t == NULL) return;
    freeTree(t->leftChild);
    freeTree(t->rightChild);
    free(t);
}

static int equal(treePointer a, treePointer b)
{
    if (a == NULL || b == NULL) return a == b;
    return a->data == b->data && equal(a->leftChild, b->leftChild) && equal(a->rightChild, b->rightChild);
}

static void append(char *out, char c)
{
    size_t len = strlen(out);
    out[len] = c;
    out[len + 1] = '\0';
}

static void preOrder(treePointer ptr, char *out)
{
    if (ptr != NULL) {
        append(out, ptr->data);              /* 방문 */
        preOrder(ptr->leftChild, out);
        preOrder(ptr->rightChild, out);
    }
}

static void inOrder(treePointer ptr, char *out)
{
    if (ptr != NULL) {
        inOrder(ptr->leftChild, out);
        append(out, ptr->data);
        inOrder(ptr->rightChild, out);
    }
}

static void postOrder(treePointer ptr, char *out)
{
    if (ptr != NULL) {
        postOrder(ptr->leftChild, out);
        postOrder(ptr->rightChild, out);
        append(out, ptr->data);
    }
}

static void levelOrder(treePointer root, char *out)
{
    treePointer queue[64];
    int front = 0, rear = 0;
    treePointer ptr = root;
    while (ptr != NULL) {
        append(out, ptr->data);
        if (ptr->leftChild != NULL)  queue[rear++] = ptr->leftChild;
        if (ptr->rightChild != NULL) queue[rear++] = ptr->rightChild;
        ptr = (front == rear) ? NULL : queue[front++];
    }
}

static int findIn(const char *in, int n, char x)
{
    for (int i = 0; i < n; i++)
        if (in[i] == x) return i;
    fprintf(stderr, "두 순회 결과가 같은 트리의 것이 아니다\n");
    exit(1);
}

static treePointer fromInPre(const char *in, const char *pre, int n)
{
    if (n == 0) return NULL;
    int k = findIn(in, n, pre[0]);
    treePointer left = fromInPre(in, pre + 1, k);
    treePointer right = fromInPre(in + k + 1, pre + 1 + k, n - 1 - k);
    return N(pre[0], left, right);
}

static treePointer fromInPost(const char *in, const char *post, int n)
{
    if (n == 0) return NULL;
    int k = findIn(in, n, post[n - 1]);
    treePointer left = fromInPost(in, post, k);
    treePointer right = fromInPost(in + k + 1, post + k, n - 1 - k);
    return N(post[n - 1], left, right);
}

static treePointer fromInLevel(const char *in, const char *level, int n)
{
    if (n == 0) return NULL;
    int k = findIn(in, n, level[0]);
    char leftLevel[64], rightLevel[64];
    int nl = 0, nr = 0;
    for (int i = 1; i < n; i++) {
        int isLeft = 0;
        for (int j = 0; j < k; j++)
            if (in[j] == level[i]) { isLeft = 1; break; }
        if (isLeft) leftLevel[nl++] = level[i];
        else        rightLevel[nr++] = level[i];
    }
    treePointer left = fromInLevel(in, leftLevel, k);
    treePointer right = fromInLevel(in + k + 1, rightLevel, n - 1 - k);
    return N(level[0], left, right);
}

/* 트리의 네 순회가 문서의 답과 같은지 본다 */
static void checkFour(treePointer t, const char *pre, const char *in, const char *post, const char *level,
                      const char *what)
{
    char a[64] = "", b[64] = "", c[64] = "", d[64] = "";
    preOrder(t, a); inOrder(t, b); postOrder(t, c); levelOrder(t, d);
    check(strcmp(a, pre) == 0 && strcmp(b, in) == 0 && strcmp(c, post) == 0 && strcmp(d, level) == 0, what);
}

static int oneChildNodes(treePointer t)
{
    if (t == NULL) return 0;
    int here = (t->leftChild == NULL) != (t->rightChild == NULL);
    return here + oneChildNodes(t->leftChild) + oneChildNodes(t->rightChild);
}

/* 노드 n개인 모양 가운데 idx번째. 글자는 전위 순서로 labels에서 꺼낸다 */
static long catalan[12];
static treePointer buildShape(int n, long idx, const char *labels, int *pos)
{
    if (n == 0) return NULL;
    char mine = labels[(*pos)++];
    for (int k = 0; k < n; k++) {
        long cnt = catalan[k] * catalan[n - 1 - k];
        if (idx < cnt) {
            treePointer left = buildShape(k, idx / catalan[n - 1 - k], labels, pos);
            treePointer right = buildShape(n - 1 - k, idx % catalan[n - 1 - k], labels, pos);
            return N(mine, left, right);
        }
        idx -= cnt;
    }
    check(0, "모양 번호가 범위를 벗어났다");
    return NULL;
}

int main(void)
{
    /* 문제 1: 슬라이드 p.33의 트리 a(b(d(g, h), e(-, i)), c(f(-, j), -)) */
    treePointer t1 =
        N('a', N('b', N('d', N('g', NULL, NULL), N('h', NULL, NULL)), N('e', NULL, N('i', NULL, NULL))),
               N('c', N('f', NULL, N('j', NULL, NULL)), NULL));
    checkFour(t1, "abdgheicfj", "gdhbeiafjc", "ghdiebjfca", "abcdefghij", "문제 1의 네 순회");
    treePointer r1 = fromInPost("gdhbeiafjc", "ghdiebjfca", 10);
    check(equal(r1, t1), "문제 1: 중위 + 후위로 되살린 트리");
    freeTree(r1);

    /* 문제 2: a(b(d, e(g, -)), c(-, f)) */
    treePointer t2 =
        N('a', N('b', N('d', NULL, NULL), N('e', N('g', NULL, NULL), NULL)),
               N('c', NULL, N('f', NULL, NULL)));
    checkFour(t2, "abdegcf", "dbgeacf", "dgebfca", "abcdefg", "문제 2의 네 순회");
    treePointer r2 = fromInPost("dbgeacf", "dgebfca", 7);
    check(equal(r2, t2), "문제 2: 중위 + 후위로 되살린 트리");
    freeTree(r2);

    /* 문제 3: p(q(-, s(u, v)), r(t(-, w), -)) */
    treePointer t3 =
        N('p', N('q', NULL, N('s', N('u', NULL, NULL), N('v', NULL, NULL))),
               N('r', N('t', NULL, N('w', NULL, NULL)), NULL));
    checkFour(t3, "pqsuvrtw", "qusvptwr", "uvsqwtrp", "pqrstuvw", "문제 3의 네 순회");
    treePointer r3 = fromInPre("qusvptwr", "pqsuvrtw", 8);
    check(equal(r3, t3), "문제 3: 중위 + 전위로 되살린 트리");
    freeTree(r3);

    /* 문제 4: 중위 d g b a h e c f, 레벨 순서 a b c d e f g h만 주어진다 */
    treePointer r4 = fromInLevel("dgbahecf", "abcdefgh", 8);
    treePointer t4 =
        N('a', N('b', N('d', NULL, N('g', NULL, NULL)), NULL),
               N('c', N('e', N('h', NULL, NULL), NULL), N('f', NULL, NULL)));
    check(equal(r4, t4), "문제 4: 되살린 트리의 모양");
    checkFour(r4, "abdgcehf", "dgbahecf", "gdbhefca", "abcdefgh", "문제 4의 전위와 후위");
    check(oneChildNodes(t4) == 3, "문제 4: 자식이 하나뿐인 노드는 b, d, e 셋");

    /* 문제 4 (나): 전위 a b d g c e h f, 후위 g d b h e f c a를 내는 이진 트리의 수 */
    catalan[0] = 1;
    for (int n = 1; n < 12; n++) {
        catalan[n] = 0;
        for (int k = 0; k < n; k++) catalan[n] += catalan[k] * catalan[n - 1 - k];
    }
    check(catalan[8] == 1430, "노드 8개인 모양은 1,430가지");
    int same = 0, sameWithIn = 0;
    for (long idx = 0; idx < catalan[8]; idx++) {
        int pos = 0;
        treePointer t = buildShape(8, idx, "abdgcehf", &pos);     /* 전위가 a b d g c e h f인 트리 */
        char post[16] = "", in[16] = "";
        postOrder(t, post);
        inOrder(t, in);
        if (strcmp(post, "gdbhefca") == 0) {
            same++;
            if (strcmp(in, "dgbahecf") == 0) sameWithIn++;
        }
        freeTree(t);
    }
    check(same == 8, "전위와 후위가 같은 트리는 2^3 = 8개");
    check(sameWithIn == 1, "그 가운데 중위까지 같은 것은 하나");

    freeTree(t1); freeTree(t2); freeTree(t3); freeTree(t4); freeTree(r4);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
