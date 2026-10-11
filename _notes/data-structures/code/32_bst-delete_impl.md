---
layout: "note"
title: "32_bst-delete_impl.c"
display_title: "32_bst-delete_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "32"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/bst-delete/"
parent_title: "이진 탐색 트리의 삭제"
description: "자료구조 · 이진 탐색 트리의 삭제 구현 코드"
permalink: "/studies/data-structures/code/32_bst-delete_impl/"
---
{% raw %}
[이진 탐색 트리의 삭제](/Hongs_Blog/studies/data-structures/bst-delete/) 문서의 구현 코드다.

```c
/* 이진 탐색 트리의 삭제: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/32.이진 탐색 트리의 삭제.md
 * 출처: 자료구조 9주차 슬라이드 p.11~18. 슬라이드에는 그림만 있고 삭제 코드는 없다.
 *       아래 코드는 그 네 경우를 그대로 옮긴 것이다(에이전트 보충).
 * 실행: cc -std=c11 -Wall -Wextra 32_bst-delete_impl.c -o bstdel && ./bstdel
 *
 * 확인하는 것
 *   1. 슬라이드 트리(12개)에서 7, 35(잎), 40, 15(자식 하나), 10, 20(자식 둘), 99(없음)를 각각 지운 모양.
 *   2. 자식 둘인 노드를 지울 때 고른 "왼쪽에서 가장 큰 키"의 노드는 늘 오른쪽 자식이 없다.
 *   3. 오른쪽에서 가장 작은 키로 바꾸는 판도 이진 탐색 트리를 지킨다(10을 지우면 15가, 20을 지우면 25가 올라온다).
 *   4. 한 번 지울 때 들르는 노드 수 <= 높이 + 1.
 *   5. 무작위 넣기·지우기·찾기 3,000묶음: 중위 순회 = 정렬된 집합 모형, 규칙이 계속 맞다.
 *   6. 오해 반례: 자식 둘인 노드에 왼쪽 자식을 그대로 올리면 키를 잃거나 규칙이 깨진다.
 *   7. malloc 횟수와 free 횟수가 같다(지운 노드는 그 자리에서 free한다).
 */
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct node *treePointer;
typedef struct node {
    int key;
    treePointer leftChild, rightChild;
} node;

static long visited;    /* 지우기가 들른 노드 수 */
static long liveNodes;  /* malloc 횟수 - free 횟수 */
static long degree2Deletes, replacementHadRight;

int insertNode(treePointer *root, int x)
{
    treePointer *link = root;
    while (*link) {
        if (x == (*link)->key) return 0;
        link = (x < (*link)->key) ? &(*link)->leftChild : &(*link)->rightChild;
    }
    treePointer ptr = malloc(sizeof(*ptr));
    if (ptr == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    liveNodes++;
    ptr->key = x;
    ptr->leftChild = ptr->rightChild = NULL;
    *link = ptr;
    return 1;
}

/* 지웠으면 1, 그런 키가 없으면 0.
 * link는 "지울 노드를 가리키고 있는 칸"의 주소다.
 * 그 칸은 부모의 leftChild일 수도, rightChild일 수도, 뿌리 변수일 수도 있다. */
int deleteNode(treePointer *root, int x)
{
    treePointer *link = root;
    while (*link && (*link)->key != x) {            /* 찾으며 내려간다 */
        visited++;
        link = (x < (*link)->key) ? &(*link)->leftChild : &(*link)->rightChild;
    }
    if (*link == NULL) return 0;                    /* 경우 1: 그런 키가 없다 */
    visited++;

    treePointer p = *link;                          /* 지울 노드 */
    if (p->leftChild && p->rightChild) {            /* 경우 4: 자식이 둘 */
        treePointer *maxLink = &p->leftChild;       /* 왼쪽 부분 트리에서 */
        while ((*maxLink)->rightChild) {            /* 오른쪽으로 끝까지 = 가장 큰 키 */
            visited++;
            maxLink = &(*maxLink)->rightChild;
        }
        visited++;
        p->key = (*maxLink)->key;                   /* 그 키를 올려 적는다 */
        link = maxLink;                             /* 이제 그 노드를 지운다 */
        p = *link;
        degree2Deletes++;
        if (p->rightChild) replacementHadRight++;
    }
    /* 경우 2, 3: p의 자식은 없거나 하나다. 있는 자식(없으면 NULL)을 p 자리에 잇는다 */
    *link = p->leftChild ? p->leftChild : p->rightChild;
    free(p);
    liveNodes--;
    return 1;
}

/* 같은 일을 "오른쪽에서 가장 작은 키"로 하는 판 */
int deleteNodeRightMin(treePointer *root, int x)
{
    treePointer *link = root;
    while (*link && (*link)->key != x)
        link = (x < (*link)->key) ? &(*link)->leftChild : &(*link)->rightChild;
    if (*link == NULL) return 0;
    treePointer p = *link;
    if (p->leftChild && p->rightChild) {
        treePointer *minLink = &p->rightChild;
        while ((*minLink)->leftChild) minLink = &(*minLink)->leftChild;
        p->key = (*minLink)->key;
        link = minLink;
        p = *link;
    }
    *link = p->leftChild ? p->leftChild : p->rightChild;
    free(p);
    liveNodes--;
    return 1;
}

/* 틀린 방법: 자식이 둘이어도 왼쪽 자식을 그대로 올린다(오른쪽 부분 트리를 버린다) */
static int deleteNodeWrong(treePointer *root, int x)
{
    treePointer *link = root;
    while (*link && (*link)->key != x)
        link = (x < (*link)->key) ? &(*link)->leftChild : &(*link)->rightChild;
    if (*link == NULL) return 0;
    treePointer p = *link;
    *link = p->leftChild ? p->leftChild : p->rightChild;
    free(p);
    liveNodes--;
    return 1;
}

/* ---- 테스트용 도구 ---- */

static void inorder(treePointer t, int *out, int *n)
{
    if (t == NULL) return;
    inorder(t->leftChild, out, n);
    out[(*n)++] = t->key;
    inorder(t->rightChild, out, n);
}

static void preorder(treePointer t, int *out, int *n)
{
    if (t == NULL) return;
    out[(*n)++] = t->key;
    preorder(t->leftChild, out, n);
    preorder(t->rightChild, out, n);
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
    liveNodes--;
}

static int isBST(treePointer t, long lo, long hi)
{
    if (t == NULL) return 1;
    if (t->key <= lo || t->key >= hi) return 0;
    return isBST(t->leftChild, lo, t->key) && isBST(t->rightChild, t->key, hi);
}

static treePointer find(treePointer t, int x)
{
    while (t && t->key != x) t = (x < t->key) ? t->leftChild : t->rightChild;
    return t;
}

static int sameArray(const int *a, const int *b, int n)
{
    for (int i = 0; i < n; i++) if (a[i] != b[i]) return 0;
    return 1;
}

/* 슬라이드 p.12의 트리: 20(10(6(2, 8(7, -)), 15(-, 18)), 40(30(25, 35), -)) */
static treePointer slideTree(void)
{
    static const int order[] = {20, 10, 40, 6, 15, 30, 2, 8, 25, 18, 35, 7};
    treePointer root = NULL;
    for (int i = 0; i < 12; i++) insertNode(&root, order[i]);
    return root;
}

static int preorderIs(treePointer t, const int *want, int m)
{
    int buf[64], n = 0;
    preorder(t, buf, &n);
    return n == m && sameArray(buf, want, m);
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

int main(void)
{
    int buf[64], n;
    treePointer root;

    /* 0. 출발 트리 */
    root = slideTree();
    int pre0[] = {20, 10, 6, 2, 8, 7, 15, 18, 40, 30, 25, 35};
    CHECK(preorderIs(root, pre0, 12), "슬라이드 p.12 트리의 모양");
    CHECK(height(root) == 4, "높이 4");
    freeTree(root);

    /* 1-1. 잎 지우기: 7, 35 (하나씩 따로, 그리고 둘 다) */
    root = slideTree();
    int pre7only[] = {20, 10, 6, 2, 8, 15, 18, 40, 30, 25, 35};
    CHECK(deleteNode(&root, 7) == 1 && preorderIs(root, pre7only, 11), "7만 지운 모양");
    freeTree(root);
    root = slideTree();
    int pre35only[] = {20, 10, 6, 2, 8, 7, 15, 18, 40, 30, 25};
    CHECK(deleteNode(&root, 35) == 1 && preorderIs(root, pre35only, 11), "35만 지운 모양");
    freeTree(root);
    root = slideTree();
    visited = 0;
    CHECK(deleteNode(&root, 7) == 1 && visited == 5, "7 지우기: 20, 10, 6, 8, 7 다섯 노드");
    CHECK(find(root, 8)->leftChild == NULL, "8의 왼쪽이 비었다");
    CHECK(deleteNode(&root, 35) == 1 && find(root, 30)->rightChild == NULL, "35 지우기: 30의 오른쪽이 비었다");
    int pre1[] = {20, 10, 6, 2, 8, 15, 18, 40, 30, 25};
    CHECK(preorderIs(root, pre1, 10), "7과 35를 지운 모양");
    freeTree(root);

    /* 1-2. 자식 하나: 40 (왼쪽 자식 30이 올라온다) */
    root = slideTree();
    CHECK(deleteNode(&root, 40) == 1 && root->rightChild->key == 30, "40 지우기: 20의 오른쪽이 30");
    int pre2[] = {20, 10, 6, 2, 8, 7, 15, 18, 30, 25, 35};
    CHECK(preorderIs(root, pre2, 11), "40을 지운 모양");
    freeTree(root);

    /* 1-3. 자식 하나: 15 (오른쪽 자식 18이 올라온다) */
    root = slideTree();
    CHECK(deleteNode(&root, 15) == 1 && find(root, 10)->rightChild->key == 18, "15 지우기: 10의 오른쪽이 18");
    int pre3[] = {20, 10, 6, 2, 8, 7, 18, 40, 30, 25, 35};
    CHECK(preorderIs(root, pre3, 11), "15를 지운 모양");
    freeTree(root);

    /* 1-4. 자식 둘: 10 (왼쪽에서 가장 큰 8이 올라오고, 8의 자식 7이 6 아래로 붙는다) */
    root = slideTree();
    visited = 0;
    CHECK(deleteNode(&root, 10) == 1, "10 지우기");
    CHECK(visited == 4, "10 지우기: 20, 10을 찾고 6, 8로 내려가 네 노드");
    CHECK(root->leftChild->key == 8, "10 자리에 8");
    CHECK(find(root, 6)->rightChild->key == 7, "6의 오른쪽이 7");
    int pre4[] = {20, 8, 6, 2, 7, 15, 18, 40, 30, 25, 35};
    CHECK(preorderIs(root, pre4, 11), "10을 지운 모양");
    freeTree(root);

    /* 1-5. 자식 둘: 20 (왼쪽에서 가장 큰 18이 올라온다. 18은 잎이었다) */
    root = slideTree();
    CHECK(deleteNode(&root, 20) == 1 && root->key == 18, "20 지우기: 뿌리가 18");
    CHECK(find(root, 15)->rightChild == NULL, "15의 오른쪽이 비었다");
    int pre5[] = {18, 10, 6, 2, 8, 7, 15, 40, 30, 25, 35};
    CHECK(preorderIs(root, pre5, 11), "20을 지운 모양");
    freeTree(root);

    /* 1-6. 없는 키 */
    root = slideTree();
    visited = 0;
    CHECK(deleteNode(&root, 99) == 0 && preorderIs(root, pre0, 12), "99는 없다: 아무것도 바뀌지 않는다");
    CHECK(visited == 2, "99 찾기: 20, 40을 들르고 빈자리");
    freeTree(root);
    printf("[OK] 슬라이드의 삭제 7, 35, 40, 15, 10, 20과 없는 키 99: 모양이 그림과 같다\n");

    /* 3. 오른쪽에서 가장 작은 키로 바꾸는 판 */
    root = slideTree();
    CHECK(deleteNodeRightMin(&root, 10) == 1 && root->leftChild->key == 15, "10 자리에 15");
    CHECK(find(root, 15)->rightChild->key == 18, "15의 오른쪽은 18 그대로");
    int pre6[] = {20, 15, 6, 2, 8, 7, 18, 40, 30, 25, 35};
    CHECK(preorderIs(root, pre6, 11) && isBST(root, LONG_MIN, LONG_MAX), "오른쪽 최솟값 판의 모양");
    freeTree(root);
    root = slideTree();
    CHECK(deleteNodeRightMin(&root, 20) == 1 && root->key == 25, "20 자리에 오른쪽에서 가장 작은 25");
    CHECK(find(root, 30)->leftChild == NULL && find(root, 30)->rightChild->key == 35, "30의 왼쪽이 비고 오른쪽은 35 그대로");
    int pre7[] = {25, 10, 6, 2, 8, 7, 15, 18, 40, 30, 35};
    CHECK(preorderIs(root, pre7, 11) && isBST(root, LONG_MIN, LONG_MAX), "20을 오른쪽 최솟값으로 바꾼 모양");
    freeTree(root);
    printf("[OK] 오른쪽에서 가장 작은 키로 바꾸는 판: 10을 지우면 15가, 20을 지우면 25가 올라오고 규칙은 그대로다\n");

    /* 4. 들르는 노드 수 <= 높이 + 1 */
    for (int x = 0; x <= 45; x++) {
        root = slideTree();
        int h = height(root);
        visited = 0;
        deleteNode(&root, x);
        CHECK(visited <= h + 1, "지우기가 들르는 노드 수 <= 높이 + 1");
        CHECK(isBST(root, LONG_MIN, LONG_MAX), "지운 뒤에도 이진 탐색 트리");
        freeTree(root);
    }
    printf("[OK] 키 0~45를 하나씩 지워 보면 들르는 노드가 높이 + 1 = 5개 이하다\n");

    /* 5. 무작위 연산과 집합 모형 */
    degree2Deletes = replacementHadRight = 0;
    long caseCount[4] = {0, 0, 0, 0};   /* 없음, 잎, 자식 하나, 자식 둘 */
    root = NULL;
    for (int batch = 0; batch < 3000; batch++) {
        int present[40] = {0};
        for (int op = 0; op < 60; op++) {
            int x = (int)(rnd() % 40);
            unsigned r = rnd() % 6;
            if (r < 3) {
                CHECK(insertNode(&root, x) == !present[x], "넣기의 반환값이 모형과 같다");
                present[x] = 1;
            } else if (r < 5) {
                treePointer t = find(root, x);
                int kind = !t ? 0 : (t->leftChild && t->rightChild) ? 3 : (t->leftChild || t->rightChild) ? 2 : 1;
                caseCount[kind]++;
                int del = (batch % 2) ? deleteNode(&root, x) : deleteNodeRightMin(&root, x);
                CHECK(del == present[x], "지우기의 반환값이 모형과 같다");
                present[x] = 0;
            } else {
                CHECK((find(root, x) != NULL) == present[x], "찾기 결과가 모형과 같다");
            }
            CHECK(isBST(root, LONG_MIN, LONG_MAX), "연산마다 규칙이 맞다");
        }
        int want[40], m = 0;
        for (int x = 0; x < 40; x++) if (present[x]) want[m++] = x;
        n = 0; inorder(root, buf, &n);
        CHECK(n == m && sameArray(buf, want, m), "중위 순회 = 정렬된 집합");
        freeTree(root); root = NULL;
    }
    CHECK(caseCount[0] > 0 && caseCount[1] > 0 && caseCount[2] > 0 && caseCount[3] > 0, "네 경우가 모두 나왔다");
    CHECK(degree2Deletes > 0 && replacementHadRight == 0, "대신 올린 노드는 오른쪽 자식이 없었다");
    printf("[OK] 무작위 3000묶음: 없음 %ld, 잎 %ld, 자식 하나 %ld, 자식 둘 %ld번 지움. 늘 정렬된 집합과 같다\n",
           caseCount[0], caseCount[1], caseCount[2], caseCount[3]);
    printf("[OK] 자식 둘 삭제 %ld번(왼쪽 최댓값 판) 모두에서 대신 올린 노드는 오른쪽 자식이 없었다\n", degree2Deletes);

    /* 6. 오해 반례: 자식 둘인 10에 왼쪽 자식 6을 그대로 올린다 */
    root = slideTree();
    deleteNodeWrong(&root, 10);
    n = 0; inorder(root, buf, &n);
    CHECK(n == 9, "15와 18이 사라져 아홉 개만 남는다 (원래는 11개여야 한다)");
    CHECK(find(root, 15) == NULL && find(root, 18) == NULL, "15와 18을 잃었다");
    freeTree(root);
    liveNodes -= 2;   /* 버려진 15, 18 두 노드는 어디서도 닿을 수 없어 풀 수 없다: 누수 2개 */
    printf("[OK] 반례: 10 자리에 왼쪽 자식 6을 그대로 올리면 15, 18을 잃는다(노드 2개 누수)\n");

    /* 7. 누수 없음 (위 반례의 2개는 일부러 만든 것이라 뺐다) */
    CHECK(liveNodes == 0, "malloc 횟수 = free 횟수");
    printf("[OK] malloc 횟수와 free 횟수가 같다\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
