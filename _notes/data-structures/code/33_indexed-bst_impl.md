---
layout: "note"
title: "33_indexed-bst_impl.c"
display_title: "33_indexed-bst_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "33"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/indexed-bst/"
parent_title: "색인 이진 탐색 트리"
description: "자료구조 · 색인 이진 탐색 트리 구현 코드"
permalink: "/studies/data-structures/code/33_indexed-bst_impl/"
---
{% raw %}
[색인 이진 탐색 트리](/Hongs_Blog/studies/data-structures/indexed-bst/) 문서의 구현 코드다.

```c
/* 색인 이진 탐색 트리: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/33.색인 이진 탐색 트리.md
 * 출처: 자료구조 9주차 슬라이드 p.19~25. 슬라이드에는 그림과 규칙 세 줄(p.21)만 있고 코드는 없다.
 *       아래 코드는 그 규칙을 옮긴 것이고, 색인으로 지우기는 규칙에서 이어 만든 것이다(에이전트 보충).
 * 실행: cc -std=c11 -Wall -Wextra 33_indexed-bst_impl.c -o ibst && ./ibst
 * 색인과 순위는 모두 0부터 센다(슬라이드와 같다).
 *
 * 확인하는 것
 *   1. 슬라이드 트리(12개)의 leftSize 12개와 rank(2) = 0, rank(15) = 5, rank(20) = 7.
 *   2. 문서의 추적: 색인 5 찾기는 20, 10, 15를 들르고, 18의 순위는 6이다.
 *      오른쪽으로 갈 때 1을 빼지 않는 틀린 판은 색인 5에서 빈자리에 닿아 NULL을 낸다.
 *   3. 줄 [a..l]을 담은 트리에 Insert(5, 'm'): 중위 순회 a b c d e m f g h i j k l,
 *      m은 f의 왼쪽 자식, leftSize는 h가 7 -> 8, f가 0 -> 1로만 바뀐다.
 *      슬라이드의 다른 방법(m을 e의 오른쪽 자식으로 달기)으로도 같은 줄이 되고, 그때는 h만 8로 바뀐다.
 *   4. 색인으로 찾기가 들르는 노드 수 <= 높이 + 1.
 *   5. 무작위 키 넣기 2,000묶음: 색인 i의 키 = 정렬 배열의 i번째, 그 키의 순위 = i.
 *   6. 무작위 줄 연산(색인에 끼우기·색인으로 지우기·색인으로 읽기) 2,000묶음이 배열 모형과 같고,
 *      연산마다 모든 노드의 leftSize가 실제 왼쪽 노드 수와 같다.
 *   7. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct node *treePointer;
typedef struct node {
    int key;         /* 키. 줄을 담을 때는 원소 */
    int leftSize;    /* 왼쪽 부분 트리의 노드 수 */
    treePointer leftChild, rightChild;
} node;

static long visited;    /* 색인으로 찾기가 들른 노드 수 */
static long liveNodes;  /* malloc 횟수 - free 횟수 */

static treePointer newNode(int key)
{
    treePointer ptr = malloc(sizeof(*ptr));
    if (ptr == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    liveNodes++;
    ptr->key = key;
    ptr->leftSize = 0;
    ptr->leftChild = ptr->rightChild = NULL;
    return ptr;
}

/* 색인 index(0부터)의 노드. 범위 밖이면 NULL (슬라이드 p.21의 세 줄) */
treePointer findByIndex(treePointer x, int index)
{
    while (x) {
        visited++;
        if (index == x->leftSize) return x;              /* 바로 이 노드 */
        if (index < x->leftSize) x = x->leftChild;       /* 왼쪽에서 같은 색인 */
        else {                                           /* 오른쪽에서 줄어든 색인 */
            index -= x->leftSize + 1;
            x = x->rightChild;
        }
    }
    return NULL;
}

/* 키 x의 순위(중위 순회에서 몇 번째인가, 0부터). 없으면 -1 */
int rankOf(treePointer x, int key)
{
    int rank = 0;
    while (x) {
        if (key == x->key) return rank + x->leftSize;
        if (key < x->key) x = x->leftChild;
        else {
            rank += x->leftSize + 1;    /* 이 노드와 그 왼쪽은 모두 key보다 앞이다 */
            x = x->rightChild;
        }
    }
    return -1;
}

/* 키로 넣기. 넣었으면 1, 이미 있으면 0 */
int insertKey(treePointer *root, int key)
{
    if (rankOf(*root, key) >= 0) return 0;      /* 이미 있으면 leftSize를 건드리지 않는다 */
    treePointer *link = root;
    while (*link) {
        treePointer x = *link;
        if (key < x->key) { x->leftSize++; link = &x->leftChild; }   /* 왼쪽에 하나 늘어난다 */
        else link = &x->rightChild;
    }
    *link = newNode(key);
    return 1;
}

/* 줄의 index번째 자리에 끼우기 (0 <= index <= 원소 수). 슬라이드의 Insert(5, 'm') */
void listInsert(treePointer *root, int index, int element)
{
    treePointer *link = root;
    while (*link) {
        treePointer x = *link;
        if (index <= x->leftSize) { x->leftSize++; link = &x->leftChild; }
        else { index -= x->leftSize + 1; link = &x->rightChild; }
    }
    *link = newNode(element);
}

/* 줄의 index번째 원소를 지우고 *element에 담는다. 범위 밖이면 0 */
int listDelete(treePointer *root, int index, int *element)
{
    if (findByIndex(*root, index) == NULL) return 0;
    treePointer *link = root;
    for (;;) {
        treePointer x = *link;
        if (index < x->leftSize) { x->leftSize--; link = &x->leftChild; }   /* 왼쪽에서 하나 빠진다 */
        else if (index > x->leftSize) { index -= x->leftSize + 1; link = &x->rightChild; }
        else break;
    }
    treePointer p = *link;
    *element = p->key;
    if (p->leftChild && p->rightChild) {        /* 자식 둘: 왼쪽의 마지막 원소를 올린다 */
        p->leftSize--;
        treePointer *maxLink = &p->leftChild;
        while ((*maxLink)->rightChild) maxLink = &(*maxLink)->rightChild;  /* 오른쪽으로만 가니 leftSize는 그대로 */
        p->key = (*maxLink)->key;
        link = maxLink;
        p = *link;
    }
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

/* 모든 leftSize가 실제 왼쪽 노드 수와 같으면 노드 수를, 아니면 -1을 돌려준다 */
static int checkedSize(treePointer t)
{
    if (t == NULL) return 0;
    int l = checkedSize(t->leftChild), r = checkedSize(t->rightChild);
    if (l < 0 || r < 0 || t->leftSize != l) return -1;
    return l + r + 1;
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

/* 틀린 판: 오른쪽으로 갈 때 자기 자신 몫의 1을 빼지 않는다 */
static treePointer findByIndexNoMinusOne(treePointer x, int index)
{
    while (x) {
        if (index == x->leftSize) return x;
        if (index < x->leftSize) x = x->leftChild;
        else { index -= x->leftSize; x = x->rightChild; }
    }
    return NULL;
}

static treePointer findKey(treePointer t, int key)
{
    while (t && t->key != key) t = (key < t->key) ? t->leftChild : t->rightChild;
    return t;
}

static int cmpInt(const void *a, const void *b)
{
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

int main(void)
{
    int buf[256], n;

    /* 1. 슬라이드 트리의 leftSize와 순위 */
    treePointer root = NULL;
    int order[] = {20, 10, 40, 6, 15, 30, 2, 8, 25, 18, 35, 7};
    for (int i = 0; i < 12; i++) CHECK(insertKey(&root, order[i]) == 1, "슬라이드 키 넣기");
    int keys[]     = {20, 10, 40, 6, 15, 30, 2, 8, 18, 25, 35, 7};
    int wantLeft[] = { 7,  4,  3, 1,  0,  1, 0, 1,  0,  0,  0, 0};
    for (int i = 0; i < 12; i++)
        CHECK(findKey(root, keys[i])->leftSize == wantLeft[i], "슬라이드 p.19의 leftSize");
    CHECK(checkedSize(root) == 12, "leftSize가 모두 실제 왼쪽 노드 수와 같다");
    CHECK(rankOf(root, 2) == 0 && rankOf(root, 15) == 5 && rankOf(root, 20) == 7, "rank(2) = 0, rank(15) = 5, rank(20) = 7");
    CHECK(rankOf(root, 99) == -1, "없는 키의 순위는 -1");
    int sorted[] = {2, 6, 7, 8, 10, 15, 18, 20, 25, 30, 35, 40};
    for (int i = 0; i < 12; i++) {
        CHECK(findByIndex(root, i)->key == sorted[i], "색인 i의 키 = 오름차순 i번째");
        CHECK(rankOf(root, sorted[i]) == i, "그 키의 순위 = i");
    }
    CHECK(findByIndex(root, 12) == NULL && findByIndex(root, -1) == NULL, "범위 밖 색인은 NULL");
    printf("[OK] 슬라이드 트리: leftSize 12개, rank(2) = 0, rank(15) = 5, rank(20) = 7, 색인 0~11\n");

    /* 2. 추적 */
    visited = 0;
    CHECK(findByIndex(root, 5)->key == 15 && visited == 3, "색인 5: 20, 10, 15 세 노드를 들러 15");
    CHECK(rankOf(root, 18) == 6, "18의 순위는 0 + (4 + 1) + (0 + 1) + 0 = 6");
    visited = 0;
    CHECK(findByIndex(root, 9)->key == 30 && visited == 3, "색인 9: 20, 40, 30을 들러 30");
    CHECK(findByIndexNoMinusOne(root, 5) == NULL, "1을 빼지 않으면 10, 15, 18을 지나 빈자리에 닿는다");
    printf("[OK] 추적: 색인 5 -> 15 (20, 10, 15), 색인 9 -> 30 (20, 40, 30), 18의 순위 6\n");
    printf("[OK] 오른쪽으로 갈 때 1을 빼지 않는 틀린 판은 색인 5에서 NULL을 낸다\n");

    /* 4. 들르는 노드 수 <= 높이 + 1 */
    int h = height(root);
    for (int i = 0; i < 12; i++) {
        visited = 0; findByIndex(root, i);
        CHECK(visited <= h + 1, "색인으로 찾기가 들르는 노드 수 <= 높이 + 1");
    }
    freeTree(root); root = NULL;
    printf("[OK] 색인으로 찾기는 높이 + 1 = %d개 이하만 들른다\n", h + 1);

    /* 3. 줄 [a..l]과 Insert(5, 'm') */
    const char *letterOrder = "helbfjadigkc";   /* 같은 모양이 되게 넣는 순서 */
    for (int i = 0; i < 12; i++) insertKey(&root, letterOrder[i]);
    n = 0; inorder(root, buf, &n);
    char text[64];
    for (int i = 0; i < n; i++) text[i] = (char)buf[i];
    text[n] = '\0';
    CHECK(strcmp(text, "abcdefghijkl") == 0, "줄 = [a, b, ..., l]");
    CHECK(root->key == 'h' && root->leftSize == 7 && root->leftChild->key == 'e'
          && root->leftChild->leftSize == 4 && root->rightChild->key == 'l', "슬라이드 p.22의 모양");
    CHECK(findByIndex(root, 4)->key == 'e', "색인 4의 원소는 e");
    listInsert(&root, 5, 'm');
    n = 0; inorder(root, buf, &n);
    for (int i = 0; i < n; i++) text[i] = (char)buf[i];
    text[n] = '\0';
    CHECK(strcmp(text, "abcdemfghijkl") == 0, "Insert(5, 'm') 뒤의 줄");
    treePointer f = root->leftChild->rightChild;
    CHECK(f->key == 'f' && f->leftChild && f->leftChild->key == 'm', "m은 f의 왼쪽 자식");
    CHECK(root->leftSize == 8 && f->leftSize == 1 && root->leftChild->leftSize == 4, "h는 8, f는 1, e는 4 그대로");
    CHECK(checkedSize(root) == 13, "leftSize가 모두 맞다");
    int gone;
    CHECK(listDelete(&root, 5, &gone) == 1 && gone == 'm' && checkedSize(root) == 12, "색인 5를 지우면 m이 나온다");
    CHECK(listDelete(&root, 12, &gone) == 0, "범위 밖 색인은 지우지 않는다");
    freeTree(root); root = NULL;
    printf("[OK] Insert(5, 'm'): a b c d e m f g h i j k l, m은 f의 왼쪽 자식, leftSize는 h 8, f 1\n");

    /* 3-2. 슬라이드 p.24의 다른 방법: m을 e의 오른쪽 자식으로 달고, e의 옛 오른쪽 부분 트리를 m의 오른쪽에 단다 */
    for (int i = 0; i < 12; i++) insertKey(&root, letterOrder[i]);
    treePointer e = root->leftChild;
    treePointer m = newNode('m');
    m->rightChild = e->rightChild;      /* f로 시작하는 부분 트리 */
    e->rightChild = m;
    root->leftSize++;                   /* 뿌리 h에서 왼쪽으로 내려왔으니 h만 1 늘린다 */
    n = 0; inorder(root, buf, &n);
    for (int i = 0; i < n; i++) text[i] = (char)buf[i];
    text[n] = '\0';
    CHECK(strcmp(text, "abcdemfghijkl") == 0, "다른 방법으로 끼워도 줄은 같다");
    CHECK(checkedSize(root) == 13 && root->leftSize == 8 && m->leftSize == 0
          && e->leftSize == 4 && m->rightChild->leftSize == 0, "이때는 h만 8로 바뀌고 m, e, f는 0, 4, 0");
    freeTree(root); root = NULL;
    printf("[OK] 다른 방법(m을 e의 오른쪽 자식으로): 줄은 같고 leftSize는 h만 8로 바뀐다\n");

    /* 5. 무작위 키와 정렬 배열 */
    for (int batch = 0; batch < 2000; batch++) {
        int model[64], m = 0;
        int count = 1 + (int)(rnd() % 40);
        for (int i = 0; i < count; i++) {
            int x = (int)(rnd() % 100);
            int dup = 0;
            for (int j = 0; j < m; j++) if (model[j] == x) dup = 1;
            CHECK(insertKey(&root, x) == !dup, "넣기의 반환값");
            if (!dup) model[m++] = x;
        }
        qsort(model, (size_t)m, sizeof(int), cmpInt);
        CHECK(checkedSize(root) == m, "leftSize가 모두 맞다");
        for (int i = 0; i < m; i++) {
            CHECK(findByIndex(root, i)->key == model[i], "색인 i의 키 = 정렬 배열의 i번째");
            CHECK(rankOf(root, model[i]) == i, "순위 = 정렬 배열에서의 위치");
        }
        freeTree(root); root = NULL;
    }
    printf("[OK] 무작위 키 2000묶음: 색인으로 찾기와 순위가 정렬 배열과 같다\n");

    /* 6. 무작위 줄 연산과 배열 모형 */
    for (int batch = 0; batch < 2000; batch++) {
        int model[64], m = 0;
        for (int op = 0; op < 50; op++) {
            unsigned r = rnd() % 5;
            if (r < 3 && m < 60) {                       /* 끼우기 */
                int idx = (int)(rnd() % (unsigned)(m + 1)), e = (int)(rnd() % 1000);
                listInsert(&root, idx, e);
                memmove(&model[idx + 1], &model[idx], (size_t)(m - idx) * sizeof(int));
                model[idx] = e; m++;
            } else if (r == 3 && m > 0) {                /* 지우기 */
                int idx = (int)(rnd() % (unsigned)m), e = -1;
                CHECK(listDelete(&root, idx, &e) == 1 && e == model[idx], "지운 원소가 모형과 같다");
                memmove(&model[idx], &model[idx + 1], (size_t)(m - idx - 1) * sizeof(int));
                m--;
            } else if (m > 0) {                          /* 읽기 */
                int idx = (int)(rnd() % (unsigned)m);
                CHECK(findByIndex(root, idx)->key == model[idx], "읽은 원소가 모형과 같다");
            }
            CHECK(checkedSize(root) == m, "연산마다 leftSize가 모두 맞다");
        }
        n = 0; inorder(root, buf, &n);
        CHECK(n == m, "원소 수");
        for (int i = 0; i < m; i++) CHECK(buf[i] == model[i], "중위 순회 = 배열 모형");
        freeTree(root); root = NULL;
    }
    printf("[OK] 무작위 줄 연산 2000묶음: 끼우기·지우기·읽기가 배열 모형과 같고 leftSize가 늘 맞다\n");

    /* 7. 누수 없음 */
    CHECK(liveNodes == 0, "malloc 횟수 = free 횟수");
    printf("[OK] malloc 횟수와 free 횟수가 같다\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
