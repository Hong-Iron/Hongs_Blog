---
layout: "note"
title: "30_bst-search-insert_impl.c"
display_title: "30_bst-search-insert_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "30"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/bst-search-insert/"
parent_title: "이진 탐색 트리의 탐색과 삽입"
description: "자료구조 · 이진 탐색 트리의 탐색과 삽입 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/30_bst-search-insert_impl/"
---
{% raw %}
[이진 탐색 트리의 탐색과 삽입](/Hongs_Blog/studies/data-structures/bst-search-insert/) 문서의 구현 코드다.

```c
/* 이진 탐색 트리의 탐색과 삽입: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/30.이진 탐색 트리의 탐색과 삽입.md
 * 출처: 자료구조 9주차 슬라이드 p.5~10. 코드는 p.7~9를 컴파일되고 메모리 오류가 없게 고친 것이다.
 *       (p.8은 매개변수 이름과 본문 이름이 달랐고, p.9는 malloc 크기가 틀렸다. 문서의 warning 참고)
 * 실행: cc -std=c11 -Wall -Wextra 30_bst-search-insert_impl.c -o bst && ./bst
 *
 * 확인하는 것
 *   1. 슬라이드 트리(20, 10, 40, 6, 15, 30, 2, 8, 25 순서로 넣음)의 모양과 중위 순회.
 *   2. 문서의 추적 표: 8 찾기, 28 찾기, 35·7·18 넣기에서 들르는 노드와 붙는 자리.
 *   3. 한 번의 찾기·넣기가 들르는 노드 수 <= 높이 + 1 (높이는 간선 수, 빈 트리는 -1).
 *   4. 1, 2, ..., n 순서로 넣으면 한 줄이 되어 높이 n - 1, 넣는 동안 들른 노드 합 n(n - 1)/2.
 *      가운데 값부터 넣으면 1,023개가 높이 9에 들어간다.
 *   5. 무작위 연산 3,000묶음: 중위 순회 = 정렬된 집합 모형, 재귀 판과 반복 판의 답이 같다.
 *   6. 오해 반례 10(5(-, 15), -): 자식하고만 비교하면 통과하지만 이진 탐색 트리가 아니고, 15를 못 찾는다.
 *   7. malloc 횟수와 free 횟수가 같다.
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

static long visited;    /* 찾기와 넣기가 들른 노드 수 */
static long liveNodes;  /* malloc 횟수 - free 횟수 */

/* 재귀 판 (슬라이드 p.7) */
treePointer search(treePointer t, int x)
{
    if (t == NULL) return NULL;            /* 빈자리에 닿았다: 없다 */
    visited++;
    if (x == t->key) return t;             /* 찾았다 */
    if (x < t->key) return search(t->leftChild, x);
    return search(t->rightChild, x);
}

/* 반복 판 (슬라이드 p.8) */
treePointer iterSearch(treePointer t, int x)
{
    while (t) {
        visited++;
        if (x == t->key) return t;
        if (x < t->key) t = t->leftChild;
        else t = t->rightChild;
    }
    return NULL;
}

/* x가 이미 있거나 트리가 비었으면 NULL, 아니면 내려가다 마지막으로 들른 노드 */
treePointer modifiedSearch(treePointer t, int x)
{
    treePointer last = NULL;
    while (t) {
        visited++;
        if (x == t->key) return NULL;
        last = t;
        t = (x < t->key) ? t->leftChild : t->rightChild;
    }
    return last;
}

/* 넣었으면 1, 이미 있는 키라 넣지 않았으면 0 (슬라이드 p.9) */
int insertNode(treePointer *root, int x)
{
    treePointer temp = modifiedSearch(*root, x);
    if (temp == NULL && *root != NULL) return 0;   /* 이미 있다 */
    treePointer ptr = malloc(sizeof(*ptr));        /* 노드 하나 크기 */
    if (ptr == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    liveNodes++;
    ptr->key = x;
    ptr->leftChild = ptr->rightChild = NULL;
    if (*root == NULL) *root = ptr;                /* 빈 트리: 새 노드가 뿌리 */
    else if (x < temp->key) temp->leftChild = ptr;
    else temp->rightChild = ptr;
    return 1;
}

/* ---- 아래는 테스트용 도구 ---- */

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

static int height(treePointer t)   /* 간선 수. 빈 트리 -1, 노드 하나 0 */
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

/* 옳은 판정: 위에서 내려온 범위 (lo, hi) 안에 있어야 한다 */
static int isBST(treePointer t, long lo, long hi)
{
    if (t == NULL) return 1;
    if (t->key <= lo || t->key >= hi) return 0;
    return isBST(t->leftChild, lo, t->key) && isBST(t->rightChild, t->key, hi);
}

/* 틀린 판정: 노드마다 자기 두 자식하고만 비교한다 */
static int childrenOnlyCheck(treePointer t)
{
    if (t == NULL) return 1;
    if (t->leftChild && t->leftChild->key >= t->key) return 0;
    if (t->rightChild && t->rightChild->key <= t->key) return 0;
    return childrenOnlyCheck(t->leftChild) && childrenOnlyCheck(t->rightChild);
}

static int sameArray(const int *a, const int *b, int n)
{
    for (int i = 0; i < n; i++) if (a[i] != b[i]) return 0;
    return 1;
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

/* 가운데 값부터 넣기: lo..hi의 가운데를 넣고 양쪽을 같은 방식으로 */
static void insertBalanced(treePointer *root, int lo, int hi)
{
    if (lo > hi) return;
    int mid = lo + (hi - lo) / 2;
    insertNode(root, mid);
    insertBalanced(root, lo, mid - 1);
    insertBalanced(root, mid + 1, hi);
}

int main(void)
{
    int buf[2048], n;

    /* 1. 슬라이드 트리 */
    treePointer root = NULL;
    int order[] = {20, 10, 40, 6, 15, 30, 2, 8, 25};
    for (int i = 0; i < 9; i++) CHECK(insertNode(&root, order[i]) == 1, "슬라이드 키 넣기");
    int wantPre[] = {20, 10, 6, 2, 8, 15, 40, 30, 25};
    int wantIn[] = {2, 6, 8, 10, 15, 20, 25, 30, 40};
    n = 0; preorder(root, buf, &n);
    CHECK(n == 9 && sameArray(buf, wantPre, 9), "슬라이드 트리의 모양(전위 순회)");
    n = 0; inorder(root, buf, &n);
    CHECK(n == 9 && sameArray(buf, wantIn, 9), "중위 순회가 오름차순");
    CHECK(height(root) == 3, "슬라이드 트리의 높이는 3(간선 수)");
    printf("[OK] 슬라이드 트리: 전위 20 10 6 2 8 15 40 30 25, 중위는 오름차순, 높이 3\n");

    /* 2. 추적 표 */
    visited = 0;
    treePointer hit = search(root, 8);
    CHECK(hit && hit->key == 8 && visited == 4, "8 찾기: 20, 10, 6, 8 네 노드");
    visited = 0;
    CHECK(iterSearch(root, 8) == hit && visited == 4, "반복 판도 같은 노드, 같은 횟수");
    visited = 0;
    CHECK(search(root, 28) == NULL && visited == 4, "28 찾기: 20, 40, 30, 25를 들르고 없음");
    CHECK(modifiedSearch(root, 28)->key == 25, "28이 붙을 자리의 부모는 25");
    CHECK(modifiedSearch(root, 35)->key == 30, "35가 붙을 자리의 부모는 30");
    CHECK(modifiedSearch(root, 7)->key == 8, "7이 붙을 자리의 부모는 8");
    CHECK(modifiedSearch(root, 18)->key == 15, "18이 붙을 자리의 부모는 15");
    CHECK(modifiedSearch(root, 15) == NULL, "이미 있는 키면 NULL");
    visited = 0;
    CHECK(insertNode(&root, 35) == 1 && visited == 3, "35 넣기: 20, 40, 30 세 노드를 들른다");
    CHECK(search(root, 30)->rightChild->key == 35, "35는 30의 오른쪽 자식");
    CHECK(insertNode(&root, 7) == 1 && search(root, 8)->leftChild->key == 7, "7은 8의 왼쪽 자식");
    CHECK(insertNode(&root, 18) == 1 && search(root, 15)->rightChild->key == 18, "18은 15의 오른쪽 자식");
    CHECK(insertNode(&root, 18) == 0, "같은 키는 다시 넣지 않는다");
    int wantIn12[] = {2, 6, 7, 8, 10, 15, 18, 20, 25, 30, 35, 40};
    n = 0; inorder(root, buf, &n);
    CHECK(n == 12 && sameArray(buf, wantIn12, 12), "12개가 된 뒤의 중위 순회");
    CHECK(height(root) == 4, "7이 들어가 높이 4");
    printf("[OK] 추적: 8 찾기 4노드, 28은 4노드 뒤 없음, 35·7·18은 30·8·15 아래에 붙는다\n");

    /* 3. 들르는 노드 수 <= 높이 + 1 */
    int h = height(root);
    for (int x = 0; x <= 45; x++) {
        visited = 0; search(root, x);
        CHECK(visited <= h + 1, "찾기가 들르는 노드 수 <= 높이 + 1");
        visited = 0; modifiedSearch(root, x);
        CHECK(visited <= h + 1, "넣을 자리 찾기가 들르는 노드 수 <= 높이 + 1");
    }
    freeTree(root); root = NULL;
    printf("[OK] 키 0~45: 찾기와 넣을 자리 찾기 모두 높이 + 1 = %d개 이하만 들른다\n", h + 1);

    /* 4. 한 줄이 되는 순서와 고른 순서 */
    int N = 1000;
    visited = 0;
    for (int i = 1; i <= N; i++) insertNode(&root, i);
    CHECK(height(root) == N - 1, "오름차순으로 넣으면 높이 n - 1");
    CHECK(visited == (long)N * (N - 1) / 2, "넣는 동안 들른 노드 합 n(n - 1)/2");
    visited = 0; search(root, N);
    CHECK(visited == N, "가장 큰 키 찾기는 n개를 모두 들른다");
    freeTree(root); root = NULL;
    visited = 0;
    insertBalanced(&root, 1, 1023);
    long balancedVisits = visited;
    CHECK(height(root) == 9, "가운데 값부터 넣으면 1,023개가 높이 9");
    visited = 0; search(root, 1023);
    CHECK(visited == 10, "높이 9인 트리에서는 많아야 10개");
    freeTree(root); root = NULL;
    printf("[OK] 1..1000 오름차순: 높이 999, 들른 노드 합 499500 / 1..1023 가운데부터: 높이 9, 합 %ld\n",
           balancedVisits);

    /* 5. 무작위 연산과 집합 모형 */
    for (int batch = 0; batch < 3000; batch++) {
        int present[50] = {0};
        for (int op = 0; op < 30; op++) {
            int x = (int)(rnd() % 50);
            if (rnd() % 3) {
                int added = insertNode(&root, x);
                CHECK(added == !present[x], "넣기의 반환값이 모형과 같다");
                present[x] = 1;
            } else {
                treePointer a = search(root, x), b = iterSearch(root, x);
                CHECK(a == b, "재귀 판과 반복 판이 같은 노드를 돌려준다");
                CHECK((a != NULL) == present[x], "찾기 결과가 모형과 같다");
            }
        }
        int want[50], m = 0;
        for (int x = 0; x < 50; x++) if (present[x]) want[m++] = x;
        n = 0; inorder(root, buf, &n);
        CHECK(n == m && sameArray(buf, want, m), "중위 순회 = 정렬된 집합");
        CHECK(isBST(root, LONG_MIN, LONG_MAX), "이진 탐색 트리의 규칙이 그대로다");
        freeTree(root); root = NULL;
    }
    printf("[OK] 무작위 연산 3000묶음: 중위 순회 = 정렬된 집합, 두 찾기 판의 답이 같다\n");

    /* 6. 오해 반례: 10(5(-, 15), -) */
    node n15 = {15, NULL, NULL}, n5 = {5, NULL, &n15}, n10 = {10, &n5, NULL};
    CHECK(childrenOnlyCheck(&n10) == 1, "자식하고만 비교하면 통과한다");
    CHECK(isBST(&n10, LONG_MIN, LONG_MAX) == 0, "실제로는 이진 탐색 트리가 아니다");
    CHECK(iterSearch(&n10, 15) == NULL, "15가 들어 있는데도 찾기는 없다고 답한다");
    printf("[OK] 반례 10(5(-, 15), -): 자식만 보면 통과, 범위로 보면 탈락, 15 찾기 실패\n");

    /* 7. 누수 없음 */
    CHECK(liveNodes == 0, "malloc 횟수 = free 횟수");
    printf("[OK] malloc 횟수와 free 횟수가 같다\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
