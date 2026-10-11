---
layout: "note"
title: "32_bst-ladder_p4.c"
display_title: "32_bst-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "32"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/bst-ladder/"
parent_title: "이진 탐색 트리 삽입·삭제 예제 사다리"
description: "자료구조 · 이진 탐색 트리 삽입·삭제 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/data-structures/code/32_bst-ladder_p4/"
---
{% raw %}
[이진 탐색 트리 삽입·삭제 예제 사다리](/Hongs_Blog/studies/data-structures/bst-ladder/) 문서의 문제 4 풀이 코드다.

```c
/* 이진 탐색 트리 삽입·삭제 예제 사다리: 문제 1 ~ 4의 답 확인.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/32.이진 탐색 트리 삽입·삭제 예제 사다리.md
 * 출처: 문제 1은 자료구조 9주차 슬라이드 p.12~16의 트리와 삭제. 문제 2 ~ 4의 수치는 에이전트가 만든 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 32_bst-ladder_p4.c -o ladder && ./ladder
 * 넣기와 지우기는 3.개념집/32_bst-delete_impl.c의 함수를 그대로 옮겨 왔다(파일끼리 불러 쓰지 않는다).
 *
 * 확인하는 것
 *   문제 1: 20, 10, 40, 6, 15, 30, 2, 8, 25, 18, 35, 7을 넣고 10을 지우면 전위 20 8 6 2 7 15 18 40 30 25 35.
 *   문제 2: 50, 30, 70, 20, 40, 60, 80, 35, 45, 65를 넣고 50을 지우면 뿌리가 45, 전위 45 30 20 40 35 70 60 65 80.
 *   문제 3: 같은 트리에서 30, 60을 차례로 지우면 전위 50 20 40 35 45 70 65 80.
 *   문제 4: 8, 3, 10, 1, 6, 14, 4, 7, 13을 넣고 3, 8을 차례로 지우면 전위 7 1 6 4 10 14 13, 높이 3 -> 3.
 *           오른쪽에서 가장 작은 키로 바꾸는 판이면 전위 10 4 1 6 7 14 13.
 */
#include <stdio.h>
#include <stdlib.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct node *treePointer;
typedef struct node {
    int key;
    treePointer leftChild, rightChild;
} node;

static long visited;

static int insertNode(treePointer *root, int x)
{
    treePointer *link = root;
    while (*link) {
        if (x == (*link)->key) return 0;
        link = (x < (*link)->key) ? &(*link)->leftChild : &(*link)->rightChild;
    }
    treePointer ptr = malloc(sizeof(*ptr));
    if (ptr == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    ptr->key = x;
    ptr->leftChild = ptr->rightChild = NULL;
    *link = ptr;
    return 1;
}

/* fromRight가 0이면 왼쪽에서 가장 큰 키로, 1이면 오른쪽에서 가장 작은 키로 바꾼다 */
static int deleteNode(treePointer *root, int x, int fromRight)
{
    treePointer *link = root;
    while (*link && (*link)->key != x) {
        visited++;
        link = (x < (*link)->key) ? &(*link)->leftChild : &(*link)->rightChild;
    }
    if (*link == NULL) return 0;
    visited++;
    treePointer p = *link;
    if (p->leftChild && p->rightChild) {
        treePointer *sub = fromRight ? &p->rightChild : &p->leftChild;
        while (fromRight ? (*sub)->leftChild != NULL : (*sub)->rightChild != NULL) {
            visited++;
            sub = fromRight ? &(*sub)->leftChild : &(*sub)->rightChild;
        }
        visited++;
        p->key = (*sub)->key;
        link = sub;
        p = *link;
    }
    *link = p->leftChild ? p->leftChild : p->rightChild;
    free(p);
    return 1;
}

static void preorder(treePointer t, int *out, int *n)
{
    if (t == NULL) return;
    out[(*n)++] = t->key;
    preorder(t->leftChild, out, n);
    preorder(t->rightChild, out, n);
}

static void inorder(treePointer t, int *out, int *n)
{
    if (t == NULL) return;
    inorder(t->leftChild, out, n);
    out[(*n)++] = t->key;
    inorder(t->rightChild, out, n);
}

static int height(treePointer t)
{
    if (t == NULL) return -1;
    int l = height(t->leftChild), r = height(t->rightChild);
    return 1 + (l > r ? l : r);
}

static void freeTree(treePointer t)
{
    if (t == NULL) return;
    freeTree(t->leftChild);
    freeTree(t->rightChild);
    free(t);
}

static treePointer build(const int *keys, int count)
{
    treePointer root = NULL;
    for (int i = 0; i < count; i++) insertNode(&root, keys[i]);
    return root;
}

static int preorderIs(treePointer t, const int *want, int m)
{
    int buf[64], n = 0;
    preorder(t, buf, &n);
    if (n != m) return 0;
    for (int i = 0; i < m; i++) if (buf[i] != want[i]) return 0;
    return 1;
}

static int sortedInorder(treePointer t)
{
    int buf[64], n = 0;
    inorder(t, buf, &n);
    for (int i = 1; i < n; i++) if (buf[i - 1] >= buf[i]) return 0;
    return 1;
}

static treePointer find(treePointer t, int x)
{
    while (t && t->key != x) t = (x < t->key) ? t->leftChild : t->rightChild;
    return t;
}

int main(void)
{
    treePointer root;

    /* 문제 1 */
    int k1[] = {20, 10, 40, 6, 15, 30, 2, 8, 25, 18, 35, 7};
    root = build(k1, 12);
    int p1a[] = {20, 10, 6, 2, 8, 7, 15, 18, 40, 30, 25, 35};
    CHECK(preorderIs(root, p1a, 12), "문제 1: 넣은 뒤의 모양");
    CHECK(find(root, 8)->leftChild->key == 7 && find(root, 15)->rightChild->key == 18
          && find(root, 30)->rightChild->key == 35, "문제 1: 7, 18, 35가 붙는 자리");
    CHECK(deleteNode(&root, 10, 0) == 1, "문제 1: 10 지우기");
    int p1b[] = {20, 8, 6, 2, 7, 15, 18, 40, 30, 25, 35};
    CHECK(preorderIs(root, p1b, 11) && sortedInorder(root), "문제 1: 10을 지운 뒤 전위 20 8 6 2 7 15 18 40 30 25 35");
    CHECK(find(root, 6)->rightChild->key == 7, "문제 1: 6의 오른쪽이 7");
    freeTree(root);
    printf("[OK] 문제 1: 10을 지우면 8이 올라오고 7이 6의 오른쪽으로 간다\n");

    /* 문제 2 */
    int k2[] = {50, 30, 70, 20, 40, 60, 80, 35, 45, 65};
    root = build(k2, 10);
    int p2a[] = {50, 30, 20, 40, 35, 45, 70, 60, 65, 80};
    CHECK(preorderIs(root, p2a, 10) && height(root) == 3, "문제 2: 넣은 뒤의 모양, 높이 3");
    visited = 0;
    CHECK(deleteNode(&root, 50, 0) == 1 && visited == 4, "문제 2: 50, 30, 40, 45 네 노드를 들른다");
    int p2b[] = {45, 30, 20, 40, 35, 70, 60, 65, 80};
    CHECK(preorderIs(root, p2b, 9) && sortedInorder(root), "문제 2: 전위 45 30 20 40 35 70 60 65 80");
    CHECK(root->key == 45 && find(root, 40)->rightChild == NULL, "문제 2: 뿌리 45, 40의 오른쪽이 빈다");
    freeTree(root);
    printf("[OK] 문제 2: 50을 지우면 45가 뿌리가 되고 40의 오른쪽 칸이 NULL이 된다\n");

    /* 문제 3 */
    root = build(k2, 10);
    CHECK(deleteNode(&root, 30, 0) == 1, "문제 3: 30 지우기");
    int p3a[] = {50, 20, 40, 35, 45, 70, 60, 65, 80};
    CHECK(preorderIs(root, p3a, 9), "문제 3: 30 자리에 20");
    CHECK(root->leftChild->key == 20 && root->leftChild->leftChild == NULL
          && root->leftChild->rightChild->key == 40, "문제 3: 20의 왼쪽은 비고 오른쪽은 40");
    CHECK(deleteNode(&root, 60, 0) == 1, "문제 3: 60 지우기");
    int p3b[] = {50, 20, 40, 35, 45, 70, 65, 80};
    CHECK(preorderIs(root, p3b, 8) && sortedInorder(root), "문제 3: 전위 50 20 40 35 45 70 65 80");
    CHECK(find(root, 70)->leftChild->key == 65, "문제 3: 70의 왼쪽이 65");
    freeTree(root);
    printf("[OK] 문제 3: 30(자식 둘)과 60(자식 하나)을 지우면 전위 50 20 40 35 45 70 65 80\n");

    /* 문제 4 */
    int k4[] = {8, 3, 10, 1, 6, 14, 4, 7, 13};
    root = build(k4, 9);
    int p4a[] = {8, 3, 1, 6, 4, 7, 10, 14, 13};
    CHECK(preorderIs(root, p4a, 9) && height(root) == 3, "문제 4: 넣은 뒤의 모양, 높이 3");
    CHECK(deleteNode(&root, 3, 0) == 1, "문제 4: 3 지우기");
    int p4b[] = {8, 1, 6, 4, 7, 10, 14, 13};
    CHECK(preorderIs(root, p4b, 8), "문제 4: 3 자리에 1");
    visited = 0;
    CHECK(deleteNode(&root, 8, 0) == 1 && visited == 4, "문제 4: 8을 지우며 8, 1, 6, 7 네 노드를 들른다");
    int p4c[] = {7, 1, 6, 4, 10, 14, 13};
    CHECK(preorderIs(root, p4c, 7) && sortedInorder(root) && height(root) == 3, "문제 4: 전위 7 1 6 4 10 14 13, 높이 3");
    freeTree(root);
    root = build(k4, 9);
    CHECK(deleteNode(&root, 3, 1) == 1, "문제 4(오른쪽 판): 3 지우기");
    int p4d[] = {8, 4, 1, 6, 7, 10, 14, 13};
    CHECK(preorderIs(root, p4d, 8), "문제 4(오른쪽 판): 3 자리에 4");
    CHECK(deleteNode(&root, 8, 1) == 1, "문제 4(오른쪽 판): 8 지우기");
    int p4e[] = {10, 4, 1, 6, 7, 14, 13};
    CHECK(preorderIs(root, p4e, 7) && sortedInorder(root), "문제 4(오른쪽 판): 전위 10 4 1 6 7 14 13");
    freeTree(root);
    printf("[OK] 문제 4: 3, 8을 지우면 전위 7 1 6 4 10 14 13. 오른쪽에서 고르면 10 4 1 6 7 14 13\n");

    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
