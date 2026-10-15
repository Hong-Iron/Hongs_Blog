---
layout: "note"
title: "26_tree-from-traversals_impl.c"
display_title: "26_tree-from-traversals_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "26"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/tree-from-traversals/"
parent_title: "순회 결과로 이진 트리 되살리기"
description: "자료구조 · 순회 결과로 이진 트리 되살리기 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/26_tree-from-traversals_impl/"
---
{% raw %}
[순회 결과로 이진 트리 되살리기](/Hongs_Blog/studies/data-structures/tree-from-traversals/) 문서의 구현 코드다.

```c
/*
 * 순회 결과 두 개로 이진 트리 되살리기
 *   중위 + 전위,  중위 + 후위,  중위 + 레벨 순서
 *
 * 실행: cc -std=c11 -Wall -Wextra 26_tree-from-traversals_impl.c -o out && ./out
 *
 * 순회 결과는 글자 배열이다(노드 하나 = 글자 하나). 글자는 서로 달라야 한다.
 * 배열 번호는 0부터 센다. in[0..n-1]처럼 "시작 주소와 길이"로 부분 배열을 넘긴다.
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

static void *mustAlloc(size_t bytes)
{
    void *p = malloc(bytes > 0 ? bytes : 1);
    if (p == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(1);
    }
    return p;
}

treePointer makeNode(char data, treePointer left, treePointer right)
{
    treePointer p = mustAlloc(sizeof(*p));
    p->data = data;
    p->leftChild = left;
    p->rightChild = right;
    return p;
}

void freeTree(treePointer t)
{
    if (t == NULL) return;
    freeTree(t->leftChild);
    freeTree(t->rightChild);
    free(t);
}

int equal(treePointer a, treePointer b)
{
    if (a == NULL || b == NULL) return a == b;
    return a->data == b->data
        && equal(a->leftChild, b->leftChild)
        && equal(a->rightChild, b->rightChild);
}

/* 중위 순회 결과 in[0..n-1]에서 글자 x의 자리. 없으면 입력이 잘못된 것이다 */
static int findIn(const char *in, int n, char x)
{
    for (int i = 0; i < n; i++)
        if (in[i] == x) return i;
    fprintf(stderr, "두 순회 결과가 같은 트리의 것이 아니다\n");
    exit(1);
}

/* 추적 기록: 뿌리를 정할 때마다 "뿌리|왼쪽 글자들|오른쪽 글자들\n"을 적는다 */
static char *traceBuf = NULL;
static void record(char root, const char *in, int k, int n)
{
    if (traceBuf == NULL) return;
    size_t len = strlen(traceBuf);
    traceBuf[len++] = root;
    traceBuf[len++] = '|';
    for (int i = 0; i < k; i++) traceBuf[len++] = in[i];
    traceBuf[len++] = '|';
    for (int i = k + 1; i < n; i++) traceBuf[len++] = in[i];
    traceBuf[len++] = '\n';
    traceBuf[len] = '\0';
}

/* 중위 + 전위. 전위의 맨 앞이 뿌리다 */
treePointer fromInPre(const char *in, const char *pre, int n)
{
    if (n == 0) return NULL;
    char root = pre[0];
    int k = findIn(in, n, root);            /* 왼쪽 부분 트리의 노드 수 */
    record(root, in, k, n);
    treePointer left  = fromInPre(in,         pre + 1,     k);
    treePointer right = fromInPre(in + k + 1, pre + 1 + k, n - 1 - k);
    return makeNode(root, left, right);
}

/* 중위 + 후위. 후위의 맨 뒤가 뿌리다 */
treePointer fromInPost(const char *in, const char *post, int n)
{
    if (n == 0) return NULL;
    char root = post[n - 1];
    int k = findIn(in, n, root);
    record(root, in, k, n);
    treePointer left  = fromInPost(in,         post,     k);
    treePointer right = fromInPost(in + k + 1, post + k, n - 1 - k);
    return makeNode(root, left, right);
}

/* 중위 + 레벨 순서. 레벨 순서의 맨 앞이 뿌리다.
   나머지 글자를 차례는 그대로 둔 채 왼쪽 것과 오른쪽 것으로 가른다 */
treePointer fromInLevel(const char *in, const char *level, int n)
{
    if (n == 0) return NULL;
    char root = level[0];
    int k = findIn(in, n, root);
    record(root, in, k, n);
    char *leftLevel = mustAlloc((size_t)n), *rightLevel = mustAlloc((size_t)n);
    int nl = 0, nr = 0;
    for (int i = 1; i < n; i++) {
        int isLeft = 0;
        for (int j = 0; j < k; j++)
            if (in[j] == level[i]) { isLeft = 1; break; }
        if (isLeft) leftLevel[nl++] = level[i];
        else        rightLevel[nr++] = level[i];
    }
    check(nl == k && nr == n - 1 - k, "레벨 순서를 왼쪽과 오른쪽으로 갈랐다");
    treePointer left  = fromInLevel(in,         leftLevel,  k);
    treePointer right = fromInLevel(in + k + 1, rightLevel, n - 1 - k);
    free(leftLevel);
    free(rightLevel);
    return makeNode(root, left, right);
}

/* ---------- 순회 네 가지 (결과를 out 끝에 붙인다) ---------- */

static void append(char *out, char c)
{
    size_t len = strlen(out);
    out[len] = c;
    out[len + 1] = '\0';
}

void preOrder(treePointer ptr, char *out)
{
    if (ptr != NULL) {
        append(out, ptr->data);
        preOrder(ptr->leftChild, out);
        preOrder(ptr->rightChild, out);
    }
}

void inOrder(treePointer ptr, char *out)
{
    if (ptr != NULL) {
        inOrder(ptr->leftChild, out);
        append(out, ptr->data);
        inOrder(ptr->rightChild, out);
    }
}

void postOrder(treePointer ptr, char *out)
{
    if (ptr != NULL) {
        postOrder(ptr->leftChild, out);
        postOrder(ptr->rightChild, out);
        append(out, ptr->data);
    }
}

void levelOrder(treePointer root, char *out)
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

/* ---------- 전수 검사용: 노드 n개인 모든 모양 ---------- */

static long catalan[8];        /* catalan[n] = 노드 n개인 이진 트리 모양의 수 */

/* 노드 n개인 모양 가운데 idx번째를 만든다. 글자는 전위 순서로 labels에서 꺼낸다 */
static treePointer buildShape(int n, long idx, const char *labels, int *pos)
{
    if (n == 0) return NULL;
    char mine = labels[(*pos)++];
    for (int k = 0; k < n; k++) {                       /* k = 왼쪽 부분 트리의 노드 수 */
        long cnt = catalan[k] * catalan[n - 1 - k];
        if (idx < cnt) {
            treePointer left  = buildShape(k, idx / catalan[n - 1 - k], labels, pos);
            treePointer right = buildShape(n - 1 - k, idx % catalan[n - 1 - k], labels, pos);
            return makeNode(mine, left, right);
        }
        idx -= cnt;
    }
    check(0, "모양 번호가 범위를 벗어났다");
    return NULL;
}

/* 글자 배열을 사전 순으로 다음 순열로 바꾼다. 마지막 순열이었으면 0 */
static int nextPermutation(char *a, int n)
{
    int i = n - 2;
    while (i >= 0 && a[i] >= a[i + 1]) i--;
    if (i < 0) return 0;
    int j = n - 1;
    while (a[j] <= a[i]) j--;
    char tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    for (int l = i + 1, r = n - 1; l < r; l++, r--) {
        tmp = a[l]; a[l] = a[r]; a[r] = tmp;
    }
    return 1;
}

int main(void)
{
    char buf[64], trace[512];

    /* 1. 문서의 예: inorder = g d h b e i a f j c */
    const char *in = "gdhbeiafjc", *pre = "abdgheicfj", *post = "ghdiebjfca", *level = "abcdefghij";
    treePointer want =
        makeNode('a',
            makeNode('b',
                makeNode('d', makeNode('g', NULL, NULL), makeNode('h', NULL, NULL)),
                makeNode('e', NULL, makeNode('i', NULL, NULL))),
            makeNode('c',
                makeNode('f', NULL, makeNode('j', NULL, NULL)),
                NULL));

    trace[0] = '\0';
    traceBuf = trace;
    treePointer a = fromInPre(in, pre, 10);
    traceBuf = NULL;
    check(equal(a, want), "중위 + 전위로 문서 예의 트리가 나온다");
    /* 문서의 추적 표: 뿌리 | 왼쪽 부분 트리의 글자 | 오른쪽 부분 트리의 글자 */
    check(strcmp(trace,
                 "a|gdhbei|fjc\n" "b|gdh|ei\n" "d|g|h\n" "g||\n" "h||\n"
                 "e||i\n" "i||\n" "c|fj|\n" "f||j\n" "j||\n") == 0, "중위 + 전위 추적 표");
    buf[0] = '\0'; postOrder(a, buf);
    check(strcmp(buf, post) == 0, "되살린 트리의 후위 순회 = g h d i e b j f c a");
    buf[0] = '\0'; levelOrder(a, buf);
    check(strcmp(buf, level) == 0, "되살린 트리의 레벨 순서 = a b c d e f g h i j");

    trace[0] = '\0';
    traceBuf = trace;
    treePointer b = fromInPost(in, post, 10);
    traceBuf = NULL;
    check(equal(b, want), "중위 + 후위로 같은 트리가 나온다");
    check(strncmp(trace, "a|gdhbei|fjc\nb|gdh|ei\n", 22) == 0, "중위 + 후위: 첫 뿌리는 a, 왼쪽의 뿌리는 b");

    treePointer c = fromInLevel(in, level, 10);
    check(equal(c, want), "중위 + 레벨 순서로 같은 트리가 나온다");
    freeTree(a); freeTree(b); freeTree(c); freeTree(want);

    /* 2. 문서 예시: 노드 둘짜리 두 트리 */
    treePointer leftB  = makeNode('a', makeNode('b', NULL, NULL), NULL);    /* b가 왼쪽 자식 */
    treePointer rightB = makeNode('a', NULL, makeNode('b', NULL, NULL));    /* b가 오른쪽 자식 */
    char p1[8] = "", p2[8] = "", q1[8] = "", q2[8] = "", l1[8] = "", l2[8] = "", i1[8] = "", i2[8] = "";
    preOrder(leftB, p1);  preOrder(rightB, p2);
    postOrder(leftB, q1); postOrder(rightB, q2);
    levelOrder(leftB, l1); levelOrder(rightB, l2);
    inOrder(leftB, i1);   inOrder(rightB, i2);
    check(!equal(leftB, rightB), "두 트리는 다르다");
    check(strcmp(p1, "ab") == 0 && strcmp(p2, "ab") == 0, "전위는 둘 다 ab");
    check(strcmp(q1, "ba") == 0 && strcmp(q2, "ba") == 0, "후위는 둘 다 ba");
    check(strcmp(l1, "ab") == 0 && strcmp(l2, "ab") == 0, "레벨 순서는 둘 다 ab");
    check(strcmp(i1, "ba") == 0 && strcmp(i2, "ab") == 0, "중위는 ba와 ab로 다르다");
    freeTree(leftB); freeTree(rightB);

    /* 3. 글자가 겹치면 중위 + 전위로도 정해지지 않는다: 둘 다 중위 aa, 전위 aa */
    treePointer d1 = makeNode('a', makeNode('a', NULL, NULL), NULL);
    treePointer d2 = makeNode('a', NULL, makeNode('a', NULL, NULL));
    char di1[8] = "", di2[8] = "", dp1[8] = "", dp2[8] = "";
    inOrder(d1, di1); inOrder(d2, di2); preOrder(d1, dp1); preOrder(d2, dp2);
    check(!equal(d1, d2) && strcmp(di1, di2) == 0 && strcmp(dp1, dp2) == 0, "같은 글자 둘: 다른 트리, 같은 순회");
    freeTree(d1); freeTree(d2);

    /* 4. 카드와 예제의 값 */
    treePointer e1 = fromInPre("dbeac", "abdec", 5);          /* 카드: 중위 d b e a c, 전위 a b d e c */
    buf[0] = '\0'; postOrder(e1, buf);
    check(strcmp(buf, "debca") == 0, "카드: 후위 d e b c a");
    buf[0] = '\0'; levelOrder(e1, buf);
    check(strcmp(buf, "abcde") == 0, "카드: 레벨 순서 a b c d e");
    freeTree(e1);
    check(fromInPre("", "", 0) == NULL, "빈 트리");
    treePointer one = fromInPost("x", "x", 1);
    check(one != NULL && one->data == 'x' && one->leftChild == NULL && one->rightChild == NULL, "노드 하나");
    freeTree(one);

    /* 5. 전수 검사: 글자가 서로 다른 노드 1 ~ 6개짜리 이진 트리 전부.
          순회 결과를 구한 뒤 세 방법으로 되살리면 모두 처음 트리와 같다.
          (다른 두 트리가 같은 (중위, 전위) 쌍을 냈다면 둘 중 하나는 되살아나지 못한다) */
    catalan[0] = 1;
    for (int n = 1; n < 8; n++) {
        catalan[n] = 0;
        for (int k = 0; k < n; k++) catalan[n] += catalan[k] * catalan[n - 1 - k];
    }
    check(catalan[3] == 5 && catalan[5] == 42 && catalan[6] == 132, "모양의 수 5, 42, 132");
    long total = 0;
    for (int n = 1; n <= 6; n++) {
        for (long idx = 0; idx < catalan[n]; idx++) {
            char labels[8] = "abcdef";
            labels[n] = '\0';
            do {
                int pos = 0;
                treePointer t = buildShape(n, idx, labels, &pos);
                char si[16] = "", sp[16] = "", sq[16] = "", sl[16] = "";
                inOrder(t, si); preOrder(t, sp); postOrder(t, sq); levelOrder(t, sl);
                treePointer r1 = fromInPre(si, sp, n);
                treePointer r2 = fromInPost(si, sq, n);
                treePointer r3 = fromInLevel(si, sl, n);
                check(equal(r1, t) && equal(r2, t) && equal(r3, t), "세 방법 모두 처음 트리를 되살린다");
                freeTree(r1); freeTree(r2); freeTree(r3); freeTree(t);
                total++;
            } while (nextPermutation(labels, n));
        }
    }
    check(total == 1 + 4 + 30 + 336 + 5040 + 95040, "트리 100,451개를 모두 보았다");
    printf("이름 붙은 이진 트리 %ld개(n = 1 ~ 6)를 세 방법으로 되살렸다\n", total);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
