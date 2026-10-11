---
layout: "note"
title: "23_binary-tree-representation_impl.c"
display_title: "23_binary-tree-representation_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "23"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/binary-tree-representation/"
parent_title: "이진 트리의 배열 표현과 연결 표현"
description: "자료구조 · 이진 트리의 배열 표현과 연결 표현 구현 코드"
permalink: "/studies/data-structures/code/23_binary-tree-representation_impl/"
---
{% raw %}
[이진 트리의 배열 표현과 연결 표현](/Hongs_Blog/studies/data-structures/binary-tree-representation/) 문서의 구현 코드다.

```c
/*
 * 이진 트리의 배열 표현과 연결 표현
 *
 * 실행: cc -std=c11 -Wall -Wextra 23_binary-tree-representation_impl.c -o out && ./out
 *
 * 배열 표현은 1번 칸부터 쓴다(0번 칸은 비워 둔다). 번호 i의 부모는 i / 2,
 * 자식은 2 * i와 2 * i + 1이다. 노드가 없는 칸은 '-'로 적는다.
 * 높이는 간선 수로 센다(노드 하나 = 0, 빈 트리 = -1). 강의의 높이(층 수)는 여기에 1을 더한 값이다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ---------- 연결 표현: 노드 하나 = 값 + 왼쪽 자식 주소 + 오른쪽 자식 주소 ---------- */

typedef struct node *treePointer;
typedef struct node {            /* 태그 node가 있어야 위 줄의 struct node와 같은 형이 된다 */
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

treePointer makeNode(char data, treePointer left, treePointer right)
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

/* 노드 수: 왼쪽 개수 + 오른쪽 개수 + 자기 하나 */
int countNodes(treePointer t)
{
    if (t == NULL) return 0;
    return countNodes(t->leftChild) + countNodes(t->rightChild) + 1;
}

/* 높이(간선 수): 더 높은 쪽 부분 트리의 높이 + 1. 빈 트리는 -1 */
int height(treePointer t)
{
    if (t == NULL) return -1;
    int hl = height(t->leftChild), hr = height(t->rightChild);
    return (hl > hr ? hl : hr) + 1;
}

/* 복사본: 뿌리를 새로 만들고 두 부분 트리를 각각 복사해 붙인다 */
treePointer clone(treePointer t)
{
    if (t == NULL) return NULL;
    return makeNode(t->data, clone(t->leftChild), clone(t->rightChild));
}

/* 두 트리가 모양도 값도 같은가 */
int equal(treePointer a, treePointer b)
{
    if (a == NULL || b == NULL) return a == b;
    return a->data == b->data
        && equal(a->leftChild, b->leftChild)
        && equal(a->rightChild, b->rightChild);
}

/* 자식을 먼저 풀고 자기를 푼다(후위 순서). 거꾸로 하면 푼 메모리를 읽게 된다 */
void freeTree(treePointer t)
{
    if (t == NULL) return;
    freeTree(t->leftChild);
    freeTree(t->rightChild);
    free(t);
}

/* NULL인 자식 칸의 수 */
int countNullLinks(treePointer t)
{
    if (t == NULL) return 1;
    return countNullLinks(t->leftChild) + countNullLinks(t->rightChild);
}

/* ---------- 배열 표현 ---------- */

/* 트리가 쓰는 가장 큰 번호. 뿌리의 번호 i를 받아 내려간다 */
int maxIndex(treePointer t, int i)
{
    if (t == NULL) return 0;
    int a = maxIndex(t->leftChild, 2 * i);
    int b = maxIndex(t->rightChild, 2 * i + 1);
    int m = a > b ? a : b;
    return m > i ? m : i;
}

static void fillArray(treePointer t, int i, char *tree)
{
    if (t == NULL) return;
    tree[i] = t->data;
    fillArray(t->leftChild, 2 * i, tree);
    fillArray(t->rightChild, 2 * i + 1, tree);
}

/* 연결 표현 -> 배열 표현. 배열 길이(가장 큰 번호 + 1)를 *length에 적는다. 쓴 뒤 free한다 */
char *toArray(treePointer t, int *length)
{
    int len = maxIndex(t, 1) + 1;
    char *tree = malloc((size_t)len + 1);
    if (tree == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(1);
    }
    memset(tree, '-', (size_t)len);
    tree[0] = ' ';                 /* 0번 칸은 쓰지 않는다 */
    tree[len] = '\0';
    fillArray(t, 1, tree);
    *length = len;
    return tree;
}

/* 배열 표현 -> 연결 표현. i번 칸을 뿌리로 하는 부분 트리를 만든다 */
treePointer fromArray(const char *tree, int length, int i)
{
    if (i >= length || tree[i] == '-') return NULL;
    return makeNode(tree[i],
                    fromArray(tree, length, 2 * i),
                    fromArray(tree, length, 2 * i + 1));
}

/* ---------- 시험용: 고정된 씨앗의 난수와 무작위 트리 ---------- */

static unsigned long long seed = 20241012ULL;
static unsigned nextRand(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

/* 노드 n개인 무작위 트리. 값은 전위 순서로 *label부터 한 글자씩 */
static treePointer randomTree(int n, char *label)
{
    if (n == 0) return NULL;
    char mine = (*label)++;
    int k = (int)(nextRand() % (unsigned)n);        /* 왼쪽 부분 트리의 노드 수 */
    treePointer left = randomTree(k, label);
    treePointer right = randomTree(n - 1 - k, label);
    return makeNode(mine, left, right);
}

int main(void)
{
    int len;
    char *arr;

    /* 1. 슬라이드 p.20: 노드 10개인 완전 이진 트리 a ~ j */
    treePointer t20 =
        makeNode('a',
            makeNode('b',
                makeNode('d', makeNode('h', NULL, NULL), makeNode('i', NULL, NULL)),
                makeNode('e', makeNode('j', NULL, NULL), NULL)),
            makeNode('c', makeNode('f', NULL, NULL), makeNode('g', NULL, NULL)));
    arr = toArray(t20, &len);
    check(len == 11, "p.20 배열 길이 11 (n + 1)");
    check(strcmp(arr + 1, "abcdefghij") == 0, "p.20 tree[1..10] = abcdefghij");
    check(arr[5 / 2] == 'b' && arr[2 * 5] == 'j', "e(5번)의 부모는 2번 b, 왼쪽 자식은 10번 j");
    check(2 * 5 + 1 >= len, "e의 오른쪽 자식 11번은 배열 밖이라 없다");
    check(countNodes(t20) == 10 && height(t20) == 3, "p.20 노드 10개, 높이 3(층 4개)");
    free(arr);

    /* 2. 슬라이드 p.22: 오른쪽으로만 내려가는 4개짜리 트리 */
    treePointer right4 =
        makeNode('a', NULL, makeNode('b', NULL, makeNode('c', NULL, makeNode('d', NULL, NULL))));
    arr = toArray(right4, &len);
    check(len == 16, "오른쪽으로 치우친 4개: 배열 길이 16 = 2^4");
    check(strcmp(arr + 1, "a-b---c-------d") == 0, "칸 1, 3, 7, 15에만 값이 있다");
    check(height(right4) == 3, "높이 3");
    free(arr);

    /* 3. 왼쪽으로만 내려가는 4개짜리 트리: 칸 1, 2, 4, 8 */
    treePointer left4 =
        makeNode('a', makeNode('b', makeNode('c', makeNode('d', NULL, NULL), NULL), NULL), NULL);
    arr = toArray(left4, &len);
    check(len == 9, "왼쪽으로 치우친 4개: 배열 길이 9 = 2^3 + 1");
    check(strcmp(arr + 1, "ab-c---d") == 0, "칸 1, 2, 4, 8에만 값이 있다");
    free(arr);

    /* 4. 슬라이드 p.25의 연결 표현 예 */
    treePointer t25 =
        makeNode('a',
            makeNode('b', makeNode('d', makeNode('f', NULL, NULL), NULL), NULL),
            makeNode('c', NULL,
                makeNode('e', makeNode('g', NULL, makeNode('h', NULL, NULL)), NULL)));
    check(countNodes(t25) == 8, "p.25 노드 8개");
    check(height(t25) == 4, "p.25 높이 4(a-c-e-g-h, 층 5개)");
    check(countNullLinks(t25) == 9, "p.25 NULL 칸 9개 = n + 1");
    arr = toArray(t25, &len);
    check(len == 30 && arr[29] == 'h', "p.25를 배열에 담으면 h가 29번 칸, 길이 30");
    check(arr[1] == 'a' && arr[3] == 'c' && arr[7] == 'e' && arr[14] == 'g', "a-c-e-g는 1, 3, 7, 14번");
    check(arr[2] == 'b' && arr[4] == 'd' && arr[8] == 'f', "b-d-f는 2, 4, 8번");
    free(arr);

    /* 카드: p.25의 트리에서 height가 노드마다 돌려주는 값 (아래에서부터) */
    {
        treePointer nb = t25->leftChild, nd = nb->leftChild, nf = nd->leftChild;
        treePointer nc = t25->rightChild, ne = nc->rightChild, ng = ne->leftChild, nh = ng->rightChild;
        check(height(nf) == 0 && height(nd) == 1 && height(nb) == 2, "f 0, d 1, b 2");
        check(height(nh) == 0 && height(ng) == 1 && height(ne) == 2 && height(nc) == 3, "h 0, g 1, e 2, c 3");
        check(countNodes(nb) == 3 && countNodes(nc) == 4, "b 아래 3개, c 아래 4개");
    }

    /* 카드: a의 왼쪽 자식 b, b의 오른쪽 자식 c, c의 왼쪽 자식 d -> 칸 1, 2, 5, 10 */
    {
        treePointer zig =
            makeNode('a', makeNode('b', NULL, makeNode('c', makeNode('d', NULL, NULL), NULL)), NULL);
        arr = toArray(zig, &len);
        check(len == 11 && strcmp(arr + 1, "ab--c----d") == 0, "지그재그 4개: 칸 1, 2, 5, 10, 길이 11");
        free(arr);
        freeTree(zig);
    }

    /* 오른쪽으로만 내려가는 20개짜리: 마지막 노드가 2^20 - 1번 칸이라 배열 길이가 2^20 */
    {
        treePointer deep = NULL;
        for (int i = 0; i < 20; i++) deep = makeNode('x', NULL, deep);
        check(maxIndex(deep, 1) + 1 == 1048576, "오른쪽으로 치우친 20개: 1,048,576칸");
        freeTree(deep);
    }

    /* 5. 복사본은 모양과 값이 같고, 원본과 메모리를 나눠 쓰지 않는다 */
    treePointer copy = clone(t25);
    check(equal(copy, t25) && copy != t25, "복사본은 같은 트리이고 주소는 다르다");
    copy->leftChild->data = 'X';
    check(t25->leftChild->data == 'b' && !equal(copy, t25), "복사본을 고쳐도 원본은 그대로다");
    freeTree(copy);

    /* 6. 빈 트리와 노드 하나 */
    check(countNodes(NULL) == 0 && height(NULL) == -1 && countNullLinks(NULL) == 1, "빈 트리");
    treePointer one = makeNode('a', NULL, NULL);
    arr = toArray(one, &len);
    check(len == 2 && countNodes(one) == 1 && height(one) == 0, "노드 하나: 길이 2, 높이 0");
    free(arr);
    freeTree(one);

    /* 7. 무작위 트리 3,000개(n = 1 ~ 12): 배열로 옮겼다 되돌리면 같은 트리 */
    for (int trial = 0; trial < 3000; trial++) {
        int n = 1 + (int)(nextRand() % 12u);
        char label = 'a';
        treePointer t = randomTree(n, &label);
        arr = toArray(t, &len);
        treePointer back = fromArray(arr, len, 1);
        check(equal(t, back), "연결 -> 배열 -> 연결이 같은 트리");
        check(len >= n + 1 && len <= (1 << n), "배열 길이는 n + 1 이상 2^n 이하");
        int used = 0, last = 0;
        for (int i = 1; i < len; i++)
            if (arr[i] != '-') { used++; last = i; }
        check(used == n && countNodes(t) == n, "값이 든 칸 수 = 노드 수");
        int levels = 0;                          /* 마지막 칸 번호의 2진 자릿수 = 층 수 */
        for (int v = last; v > 0; v /= 2) levels++;
        check(height(t) == levels - 1, "높이 = (가장 큰 번호의 2진 자릿수) - 1");
        check(countNullLinks(t) == n + 1, "NULL 칸은 n + 1개");
        free(arr);
        freeTree(back);
        freeTree(t);
    }

    /* 노드 하나의 크기는 컴퓨터마다 다르다. 값 1바이트와 포인터 둘보다 작을 수는 없다 */
    check(sizeof(node) >= sizeof(char) + 2 * sizeof(treePointer), "노드 크기");
    printf("sizeof(node) = %zu바이트, 포인터 하나 = %zu바이트\n", sizeof(node), sizeof(treePointer));

    freeTree(t20);
    freeTree(right4);
    freeTree(left4);
    freeTree(t25);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
