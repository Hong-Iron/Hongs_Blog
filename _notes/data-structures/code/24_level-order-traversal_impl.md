---
layout: "note"
title: "24_level-order-traversal_impl.c"
display_title: "24_level-order-traversal_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "24"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/level-order-traversal/"
parent_title: "레벨 순서 순회"
description: "자료구조 · 레벨 순서 순회 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/24_level-order-traversal_impl/"
---
{% raw %}
[레벨 순서 순회](/Hongs_Blog/studies/data-structures/level-order-traversal/) 문서의 구현 코드다.

```c
/*
 * 레벨 순서 순회: 큐로 이진 트리를 층별로 방문한다
 *
 * 실행: cc -std=c11 -Wall -Wextra 24_level-order-traversal_impl.c -o out && ./out
 *
 * 큐는 배열 하나와 번호 둘(front, rear)로 만든다. 뿌리를 뺀 모든 노드가 정확히 한 번씩
 * 큐에 들어가므로 칸은 노드 수만큼이면 넉넉하고, 앞으로 되돌아가 쓸 일이 없다.
 * 방문 = 그 노드의 글자를 out 문자열 끝에 붙이기.
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

int countNodes(treePointer t)
{
    if (t == NULL) return 0;
    return countNodes(t->leftChild) + countNodes(t->rightChild) + 1;
}

void freeTree(treePointer t)
{
    if (t == NULL) return;
    freeTree(t->leftChild);
    freeTree(t->rightChild);
    free(t);
}

/*
 * 레벨 순서 순회. out에는 노드 수 + 1칸이 있어야 한다.
 * trace가 NULL이 아니면, 방문할 때마다 "자식을 넣은 직후의 큐"를 한 줄씩 적는다(줄 끝 '\n').
 * 돌려주는 값: 큐에 가장 많이 들어 있던 노드 수.
 */
int levelOrder(treePointer root, char *out, char *trace)
{
    int n = countNodes(root), k = 0, longest = 0;
    treePointer *queue = mustAlloc(sizeof(*queue) * (size_t)n);
    int front = 0, rear = 0;        /* front: 다음에 꺼낼 칸, rear: 다음에 넣을 칸 */
    treePointer ptr = root;

    if (trace != NULL) trace[0] = '\0';
    while (ptr != NULL) {
        out[k++] = ptr->data;                                   /* 방문 */
        if (ptr->leftChild != NULL)  queue[rear++] = ptr->leftChild;
        if (ptr->rightChild != NULL) queue[rear++] = ptr->rightChild;
        if (rear - front > longest) longest = rear - front;
        if (trace != NULL) {
            size_t len = strlen(trace);
            for (int i = front; i < rear; i++) trace[len++] = queue[i]->data;
            trace[len++] = '\n';
            trace[len] = '\0';
        }
        ptr = (front == rear) ? NULL : queue[front++];           /* 비었으면 끝, 아니면 맨 앞을 꺼낸다 */
    }
    out[k] = '\0';
    check(rear == (n > 0 ? n - 1 : 0), "큐에 들어간 노드는 뿌리를 뺀 n - 1개");
    free(queue);
    return longest;
}

/* 큐 대신 스택(나중에 넣은 것을 먼저 꺼낸다)을 쓰면 층별 순서가 나오지 않는다 */
void withStack(treePointer root, char *out)
{
    int n = countNodes(root), k = 0, top = 0;
    treePointer *stack = mustAlloc(sizeof(*stack) * (size_t)n);
    treePointer ptr = root;
    while (ptr != NULL) {
        out[k++] = ptr->data;
        if (ptr->leftChild != NULL)  stack[top++] = ptr->leftChild;
        if (ptr->rightChild != NULL) stack[top++] = ptr->rightChild;
        ptr = (top == 0) ? NULL : stack[--top];
    }
    out[k] = '\0';
    free(stack);
}

/* 비교용의 단순한 방법: 깊이마다 줄을 따로 두고, 왼쪽을 먼저 내려가며 자기 깊이의 줄에 적는다 */
static void collectByDepth(treePointer t, int depth, char rows[][32])
{
    if (t == NULL) return;
    size_t len = strlen(rows[depth]);
    rows[depth][len] = t->data;
    rows[depth][len + 1] = '\0';
    collectByDepth(t->leftChild, depth + 1, rows);
    collectByDepth(t->rightChild, depth + 1, rows);
}

static unsigned long long seed = 24ULL;
static unsigned nextRand(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

static treePointer randomTree(int n, char *label)
{
    if (n == 0) return NULL;
    char mine = (*label)++;
    int k = (int)(nextRand() % (unsigned)n);
    treePointer left = randomTree(k, label);
    treePointer right = randomTree(n - 1 - k, label);
    return makeNode(mine, left, right);
}

int main(void)
{
    char out[64], trace[512];

    /* 1. 슬라이드 p.33, p.46의 트리: a(b(d(g, h), e(-, i)), c(f(-, j), -)) */
    treePointer t =
        makeNode('a',
            makeNode('b',
                makeNode('d', makeNode('g', NULL, NULL), makeNode('h', NULL, NULL)),
                makeNode('e', NULL, makeNode('i', NULL, NULL))),
            makeNode('c',
                makeNode('f', NULL, makeNode('j', NULL, NULL)),
                NULL));
    int longest = levelOrder(t, out, trace);
    check(strcmp(out, "abcdefghij") == 0, "p.46 레벨 순서 = a b c d e f g h i j");
    /* 추적 표: 방문한 노드마다, 자식을 넣은 직후의 큐 */
    check(strcmp(trace, "bc\ncde\ndef\nefgh\nfghi\nghij\nhij\nij\nj\n\n") == 0, "문서의 추적 표");
    check(longest == 4, "큐가 가장 길 때 4개");

    withStack(t, out);
    check(strcmp(out, "acfjbeidhg") == 0, "스택으로 바꾸면 a c f j b e i d h g");

    /* 2. 카드 C1의 트리: 1(2(4, 5(7, -)), 3(-, 6)) */
    treePointer c1 =
        makeNode('1',
            makeNode('2', makeNode('4', NULL, NULL), makeNode('5', makeNode('7', NULL, NULL), NULL)),
            makeNode('3', NULL, makeNode('6', NULL, NULL)));
    levelOrder(c1, out, trace);
    check(strcmp(out, "1234567") == 0, "카드 C1 레벨 순서");
    check(strcmp(trace, "23\n345\n456\n56\n67\n7\n\n") == 0, "카드 C1 큐의 변화");
    freeTree(c1);

    /* 3. 완전 이진 트리(슬라이드 p.20)는 레벨 순서가 배열 표현의 칸 순서와 같다 */
    treePointer t20 =
        makeNode('a',
            makeNode('b',
                makeNode('d', makeNode('h', NULL, NULL), makeNode('i', NULL, NULL)),
                makeNode('e', makeNode('j', NULL, NULL), NULL)),
            makeNode('c', makeNode('f', NULL, NULL), makeNode('g', NULL, NULL)));
    levelOrder(t20, out, NULL);
    check(strcmp(out, "abcdefghij") == 0, "완전 이진 트리의 레벨 순서 = tree[1..n]");
    freeTree(t20);

    /* 4. 경계: 빈 트리, 노드 하나, 한 줄로 늘어선 트리 */
    check(levelOrder(NULL, out, NULL) == 0 && out[0] == '\0', "빈 트리");
    treePointer one = makeNode('a', NULL, NULL);
    check(levelOrder(one, out, NULL) == 0 && strcmp(out, "a") == 0, "노드 하나");
    freeTree(one);
    treePointer chain = makeNode('a', NULL, makeNode('b', makeNode('c', NULL, NULL), NULL));
    check(levelOrder(chain, out, NULL) == 1 && strcmp(out, "abc") == 0, "한 줄 트리: 큐에 늘 하나");
    freeTree(chain);

    /* 5. 무작위 트리 2,000개(n = 1 ~ 20): 깊이별로 모은 결과와 같다 */
    for (int trial = 0; trial < 2000; trial++) {
        int n = 1 + (int)(nextRand() % 20u);
        char label = 'a';
        treePointer r = randomTree(n, &label);
        char rows[20][32];
        char expect[64] = "";
        for (int d = 0; d < 20; d++) rows[d][0] = '\0';
        collectByDepth(r, 0, rows);
        int widest = 0;
        for (int d = 0; d < 20; d++) {
            strcat(expect, rows[d]);
            if ((int)strlen(rows[d]) > widest) widest = (int)strlen(rows[d]);
        }
        int got = levelOrder(r, out, NULL);
        check(strcmp(out, expect) == 0, "무작위 트리의 레벨 순서");
        check((int)strlen(out) == n, "모든 노드를 한 번씩 방문");
        check(got <= n - 1 && got >= widest - 1, "큐 길이는 n - 1을 넘지 않는다");
        freeTree(r);
    }

    freeTree(t);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
