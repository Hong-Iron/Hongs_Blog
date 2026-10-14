---
layout: "note"
title: "30_week9-inclass_p2.c"
display_title: "30_week9-inclass_p2.c"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "30"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/week9-inclass/"
parent_title: "9주차 수업 문제 풀이"
description: "자료구조 · 9주차 수업 문제 풀이 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/30_week9-inclass_p2/"
---
{% raw %}
[9주차 수업 문제 풀이](/Hongs_Blog/studies/data-structures/week9-inclass/) 문서의 문제 2 풀이 코드다.

```c
/* 9주차 수업 문제 2: 이진 탐색 트리인지 판별하기
 *
 * 문서: 1-2학기/자료구조/4.연습문제/30.9주차 수업 문제 풀이.md 의 p2
 * 출처: 자료구조 9주차 수업 문제 슬라이드 13~16. 슬라이드 15의 풀이를 고친 것이다.
 *       슬라이드는 범위의 양 끝을 -32768과 32767로 넘겨, 그 밖의 키가 든 올바른 트리를 틀렸다고 한다.
 *       여기서는 "끝이 없다"를 NULL 포인터로 나타내 int의 모든 값에서 맞게 했다.
 * 실행: cc -std=c11 -Wall -Wextra 30_week9-inclass_p2.c -o p2 && ./p2
 *
 * 확인하는 것
 *   1. 슬라이드 16의 트리 3(1, 4) -> 1, 슬라이드 13 그림의 트리(20, 10, 40, 6, 15, 30, 2, 8, 25) -> 1.
 *   2. 큰 키: 10 아래 오른쪽에 40000 -> 고친 판 1, 슬라이드 판 0(틀림). INT_MIN, INT_MAX가 든 트리도 고친 판은 맞다.
 *   3. 초안 (가) 자식하고만 비교: 10(5(-, 15), -)를 이진 탐색 트리라고 한다(틀림). 고친 판은 0.
 *   4. 초안 (나) "<= min && >= max": 5(9, 1)에도 1을 돌려준다(틀림). 범위가 멀쩡한 자리에서는 0을 낼 수 없고,
 *      조상이 이미 규칙을 깨 범위가 뒤집힌 자리에서만 0이 나온다. 예: 5(9(-, 7), -)는 0.
 *      무작위 트리에서 이진 탐색 트리가 아닌 것의 대부분을 통과시킨다.
 *   5. 무작위 트리 3,000개에서 느린 판정(중위 순회가 순증가)과 같은 답. 같은 키가 있으면 0.
 *   6. 문서의 변형 문제: 중위 순회로 판별하는 판이 무작위 3,000개에서 같은 답,
 *      같은 키를 오른쪽에 두는 정의로는 5(3, 5)가 1, 5(5, 7)이 0.
 */
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

/* min, max: 이 부분 트리의 키가 들어야 하는 범위의 양 끝(끝 값은 빼고). NULL이면 그쪽 끝이 없다 */
int isBSTNode(const TreeNode *root, const int *min, const int *max)
{
    if (root == NULL) return 1;
    if (min && root->val <= *min) return 0;
    if (max && root->val >= *max) return 0;
    return isBSTNode(root->left, min, &root->val)       /* 왼쪽은 나보다 작아야 한다 */
        && isBSTNode(root->right, &root->val, max);     /* 오른쪽은 나보다 커야 한다 */
}

int isBST(const TreeNode *root)
{
    return isBSTNode(root, NULL, NULL);
}

/* 변형 (나): 같은 키를 오른쪽에 둘 수 있는 정의(왼쪽 < 자기 <= 오른쪽)로 판별하기 */
int isBSTDupRight(const TreeNode *root, const int *min, const int *max)
{
    if (root == NULL) return 1;
    if (min && root->val < *min) return 0;      /* 아래 끝은 같아도 된다 */
    if (max && root->val >= *max) return 0;     /* 위 끝은 같으면 안 된다 */
    return isBSTDupRight(root->left, min, &root->val) && isBSTDupRight(root->right, &root->val, max);
}

/* 변형 (가): 중위 순회를 하며 바로 앞에 본 키보다 커졌는지만 본다 */
static int inorderCheck(const TreeNode *t, const TreeNode **prev)
{
    if (t == NULL) return 1;
    if (!inorderCheck(t->left, prev)) return 0;
    if (*prev && (*prev)->val >= t->val) return 0;
    *prev = t;
    return inorderCheck(t->right, prev);
}
int isBSTInorder(const TreeNode *root)
{
    const TreeNode *prev = NULL;
    return inorderCheck(root, &prev);
}

/* ---- 견줄 판들 ---- */

/* 슬라이드 15 그대로: 범위의 끝을 -32768, 32767로 넘긴다 */
static int slideIsBSTNode(const TreeNode *root, int min, int max)
{
    if (root == NULL) return 1;
    if (root->val <= min || root->val >= max) return 0;
    return slideIsBSTNode(root->left, min, root->val) && slideIsBSTNode(root->right, root->val, max);
}
static int slideIsBST(const TreeNode *root) { return slideIsBSTNode(root, -32768, 32767); }

/* 초안 (가)의 생각: 노드마다 자기 두 자식하고만 비교한다 */
static int draftChildrenOnly(const TreeNode *root)
{
    if (root == NULL) return 1;
    if (root->left && root->left->val >= root->val) return 0;
    if (root->right && root->right->val <= root->val) return 0;
    return draftChildrenOnly(root->left) && draftChildrenOnly(root->right);
}

/* 초안 (나): ||를 &&로 썼다. min < max인 동안에는 "min 이하이면서 max 이상"인 값이 없어 0을 낼 수 없다 */
static int draftAndNode(const TreeNode *root, int min, int max)
{
    if (root == NULL) return 1;
    if (root->val <= min && root->val >= max) return 0;
    return draftAndNode(root->left, min, root->val) && draftAndNode(root->right, root->val, max);
}

/* 느린 판정: 중위 순회가 순증가인가 */
static void inorder(const TreeNode *t, long *out, int *n)
{
    if (t == NULL) return;
    inorder(t->left, out, n);
    out[(*n)++] = t->val;
    inorder(t->right, out, n);
}
static int slowIsBST(const TreeNode *root)
{
    long buf[64];
    int n = 0;
    inorder(root, buf, &n);
    for (int i = 1; i < n; i++) if (buf[i - 1] >= buf[i]) return 0;
    return 1;
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

static TreeNode pool[64];
static int used;

/* lo..hi 범위에서 키를 골라 이진 탐색 트리가 되기 쉬운 트리를 만들고, 가끔 규칙을 깬다 */
static TreeNode *randomTree(int budget, int lo, int hi)
{
    if (budget <= 0 || used >= 64 || lo > hi || rnd() % 4 == 0) return NULL;
    TreeNode *t = &pool[used++];
    int key = lo + (int)(rnd() % (unsigned)(hi - lo + 1));
    t->val = key;
    if (rnd() % 12 == 0) t->val = (int)(rnd() % 41) - 20;      /* 가끔 아무 값이나 넣어 규칙을 깬다 */
    t->left = randomTree(budget - 1, lo, key - 1);
    t->right = randomTree(budget - 1, key + 1, hi);
    return t;
}

int main(void)
{
    /* 1. 슬라이드의 두 트리 */
    TreeNode n1 = {1, NULL, NULL}, n4 = {4, NULL, NULL}, n3 = {3, &n1, &n4};
    CHECK(isBST(&n3) == 1, "3(1, 4)는 이진 탐색 트리");
    TreeNode s2 = {2, NULL, NULL}, s8 = {8, NULL, NULL}, s6 = {6, &s2, &s8};
    TreeNode s15 = {15, NULL, NULL}, s10 = {10, &s6, &s15};
    TreeNode s25 = {25, NULL, NULL}, s30 = {30, &s25, NULL}, s40 = {40, &s30, NULL};
    TreeNode s20 = {20, &s10, &s40};
    CHECK(isBST(&s20) == 1, "슬라이드 13 그림의 트리는 이진 탐색 트리");
    CHECK(isBST(NULL) == 1, "빈 트리도 이진 탐색 트리");
    printf("[OK] 슬라이드의 트리 3(1, 4)와 20(10(6(2, 8), 15), 40(30(25, -), -)): 둘 다 1\n");

    /* 2. 큰 키 */
    TreeNode big = {40000, NULL, NULL}, b10 = {10, NULL, &big};
    CHECK(isBST(&b10) == 1 && slideIsBST(&b10) == 0, "10 -> 오른쪽 40000: 고친 판 1, 슬라이드 판 0");
    TreeNode small = {-40000, NULL, NULL}, c10 = {10, &small, NULL};
    CHECK(isBST(&c10) == 1 && slideIsBST(&c10) == 0, "10 -> 왼쪽 -40000: 고친 판 1, 슬라이드 판 0");
    TreeNode lo = {INT_MIN, NULL, NULL}, hi = {INT_MAX, NULL, NULL}, mid = {0, &lo, &hi};
    CHECK(isBST(&mid) == 1, "INT_MIN과 INT_MAX가 든 트리도 맞게 판정한다");
    TreeNode hi2 = {INT_MAX, NULL, NULL}, top = {INT_MAX, NULL, &hi2};
    CHECK(isBST(&top) == 0, "같은 키 INT_MAX가 둘이면 0");
    printf("[OK] 큰 키: 10 아래 40000 또는 -40000이 든 올바른 트리에 슬라이드 판은 0을 낸다. 고친 판은 1\n");

    /* 3. 초안 (가) */
    TreeNode x15 = {15, NULL, NULL}, x5 = {5, NULL, &x15}, x10 = {10, &x5, NULL};
    CHECK(draftChildrenOnly(&x10) == 1 && isBST(&x10) == 0, "10(5(-, 15), -): 자식만 보면 1, 실제로는 0");
    printf("[OK] 초안 (가): 10(5(-, 15), -)에 1을 낸다(틀림). 고친 판은 0\n");

    /* 4. 초안 (나) */
    TreeNode y9 = {9, NULL, NULL}, y1 = {1, NULL, NULL}, y5 = {5, &y9, &y1};
    CHECK(draftAndNode(&y5, -32768, 32767) == 1 && isBST(&y5) == 0, "5(9, 1): 초안 (나)는 1, 실제로는 0");
    TreeNode z7 = {7, NULL, NULL}, z9 = {9, NULL, &z7}, z5 = {5, &z9, NULL};
    CHECK(draftAndNode(&z5, -32768, 32767) == 0, "5(9(-, 7), -): 범위가 (9, 5)로 뒤집힌 자리의 7에서만 0");
    printf("[OK] 초안 (나): 5(9, 1)에도 1을 낸다(틀림). 범위가 뒤집힌 5(9(-, 7), -)에서만 0. 고친 판은 둘 다 0\n");

    /* 변형 (나): 같은 키를 오른쪽에 두는 정의 */
    TreeNode d5r = {5, NULL, NULL}, d3 = {3, NULL, NULL}, d5 = {5, &d3, &d5r};      /* 5(3, 5) */
    CHECK(isBST(&d5) == 0 && isBSTDupRight(&d5, NULL, NULL) == 1, "5(3, 5): 강의 정의로는 0, 같은 키를 오른쪽에 두는 정의로는 1");
    TreeNode e5l = {5, NULL, NULL}, e7 = {7, NULL, NULL}, e5 = {5, &e5l, &e7};      /* 5(5, 7) */
    CHECK(isBST(&e5) == 0 && isBSTDupRight(&e5, NULL, NULL) == 0, "5(5, 7): 같은 키가 왼쪽이면 두 정의 모두 0");
    printf("[OK] 변형: 5(3, 5)는 정의에 따라 0 또는 1, 5(5, 7)은 둘 다 0. 중위 순회 판도 같은 답\n");

    /* 5. 무작위 트리 */
    int yes = 0, no = 0, draftPassedWrong = 0;
    for (int trial = 0; trial < 3000; trial++) {
        used = 0;
        TreeNode *root = randomTree(5, -20, 20);
        int want = slowIsBST(root);
        CHECK(isBST(root) == want, "느린 판정과 같은 답");
        CHECK(isBSTInorder(root) == want, "변형 (가): 중위 순회 판도 같은 답");
        int draft = draftAndNode(root, -32768, 32767);
        if (want) { CHECK(draft == 1, "초안 (나)도 올바른 트리에는 1"); yes++; }
        else { no++; if (draft == 1) draftPassedWrong++; }
    }
    CHECK(yes > 300 && no > 300, "맞는 트리와 틀린 트리가 모두 충분히 나왔다");
    CHECK(draftPassedWrong * 10 > no * 8, "초안 (나)는 틀린 트리의 80% 넘게를 통과시킨다");
    printf("[OK] 무작위 트리 3000개(이진 탐색 트리 %d개, 아닌 것 %d개): 느린 판정과 같은 답\n", yes, no);
    printf("[OK] 초안 (나)는 아닌 것 %d개 가운데 %d개를 이진 탐색 트리라고 했다\n", no, draftPassedWrong);
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
