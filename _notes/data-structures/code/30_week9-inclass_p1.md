---
layout: "note"
title: "30_week9-inclass_p1.c"
display_title: "30_week9-inclass_p1.c"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "30"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/week9-inclass/"
parent_title: "9주차 수업 문제 풀이"
description: "자료구조 · 9주차 수업 문제 풀이 문제 1 풀이 코드"
permalink: "/studies/data-structures/code/30_week9-inclass_p1/"
---
{% raw %}
[9주차 수업 문제 풀이](/Hongs_Blog/studies/data-structures/week9-inclass/) 문서의 문제 1 풀이 코드다.

```c
/* 9주차 수업 문제 1: 좋은 노드 세기 (LeetCode 1448. Count Good Nodes in Binary Tree)
 *
 * 문서: 1-2학기/자료구조/4.연습문제/30.9주차 수업 문제 풀이.md 의 p1
 * 출처: 자료구조 9주차 수업 문제 슬라이드 7~10. 슬라이드 9의 풀이를 컴파일되게 고친 것이다.
 *       (슬라이드는 goodNodes가 아직 선언되지 않은 traversal을 불러 컴파일 오류가 난다.)
 * 실행: cc -std=c11 -Wall -Wextra 30_week9-inclass_p1.c -o p1 && ./p1
 *
 * 문제: 뿌리에서 노드 X까지 가는 길에 X보다 큰 값이 없으면 X는 좋은 노드다. 좋은 노드의 수를 구한다.
 *
 * 확인하는 것
 *   1. 슬라이드 10의 트리 3(1, 4) -> 2.
 *   2. 문제 원문의 예: [3,1,4,3,null,1,5] -> 4, [3,3,null,4,2] -> 3, [1] -> 1. 빈 트리 -> 0.
 *   3. 무작위 트리 3,000개에서 느린 풀이(노드마다 뿌리부터의 길을 다시 걸어 최댓값을 구한다)와 같은 답.
 *   4. 문서의 변형 문제: "길 위에 나보다 작은 값이 없는 노드"는 두 예에서 2개와 3개, 좋은 노드의 합은 15.
 */
#include <stdio.h>
#include <stdlib.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

/* prevMax: 뿌리에서 이 노드의 부모까지 오는 길에서 본 가장 큰 값 */
int traversal(TreeNode *root, int prevMax)
{
    if (root == NULL) return 0;
    int good = (root->val >= prevMax) ? 1 : 0;          /* 길 위에 나보다 큰 값이 없었다 */
    int maxVal = good ? root->val : prevMax;            /* 아래로 넘길 최댓값 */
    return good + traversal(root->left, maxVal) + traversal(root->right, maxVal);
}

int goodNodes(TreeNode *root)
{
    if (root == NULL) return 0;
    return traversal(root, root->val);                  /* 뿌리는 늘 좋은 노드다 */
}

/* 변형 (가): 길 위에 나보다 작은 값이 없는 노드 세기. 부등호와 넘기는 값만 바뀐다 */
int countNoSmaller(TreeNode *root, int prevMin)
{
    if (root == NULL) return 0;
    int good = (root->val <= prevMin) ? 1 : 0;
    int minVal = good ? root->val : prevMin;
    return good + countNoSmaller(root->left, minVal) + countNoSmaller(root->right, minVal);
}

/* 변형 (나): 좋은 노드의 값을 모두 더하기 */
long sumGood(TreeNode *root, int prevMax)
{
    if (root == NULL) return 0;
    int good = (root->val >= prevMax);
    int maxVal = good ? root->val : prevMax;
    return (good ? root->val : 0) + sumGood(root->left, maxVal) + sumGood(root->right, maxVal);
}

/* ---- 테스트 ---- */

/* 느린 풀이: 노드마다 뿌리에서 그 노드까지의 길을 따로 구해 최댓값과 견준다 */
static int pathMaxTo(TreeNode *root, TreeNode *target, int best, int *found)
{
    if (root == NULL || *found) return best;
    int here = (root->val > best) ? root->val : best;
    if (root == target) { *found = 1; return here; }
    int l = pathMaxTo(root->left, target, here, found);
    if (*found) return l;
    return pathMaxTo(root->right, target, here, found);
}

static int slowCount(TreeNode *root, TreeNode *t)
{
    if (t == NULL) return 0;
    int found = 0;
    int m = pathMaxTo(root, t, t->val, &found);         /* 길 위의 최댓값(자기 포함) */
    return (m == t->val) + slowCount(root, t->left) + slowCount(root, t->right);
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

static TreeNode pool[64];
static int used;

static TreeNode *randomTree(int budget)
{
    if (budget <= 0 || used >= 64 || rnd() % 4 == 0) return NULL;
    TreeNode *t = &pool[used++];
    t->val = (int)(rnd() % 21) - 10;                    /* -10 ~ 10: 같은 값과 음수도 나온다 */
    t->left = randomTree(budget - 1);
    t->right = randomTree(budget - 1);
    return t;
}

int main(void)
{
    /* 1. 슬라이드 10의 트리 */
    TreeNode n1 = {1, NULL, NULL};
    TreeNode n4 = {4, NULL, NULL};
    TreeNode n3 = {3, &n1, &n4};
    CHECK(goodNodes(&n3) == 2, "3(1, 4): 좋은 노드는 3과 4, 둘");
    printf("[OK] 슬라이드의 트리 3(1, 4): %d\n", goodNodes(&n3));

    /* 2. 문제 원문의 예 */
    TreeNode a3 = {3, NULL, NULL}, a1 = {1, &a3, NULL};
    TreeNode b1 = {1, NULL, NULL}, b5 = {5, NULL, NULL}, a4 = {4, &b1, &b5};
    TreeNode ra = {3, &a1, &a4};                        /* [3,1,4,3,null,1,5] */
    CHECK(goodNodes(&ra) == 4, "[3,1,4,3,null,1,5] -> 4");
    TreeNode c4 = {4, NULL, NULL}, c2 = {2, NULL, NULL}, c3 = {3, &c4, &c2};
    TreeNode rb = {3, &c3, NULL};                       /* [3,3,null,4,2] */
    CHECK(goodNodes(&rb) == 3, "[3,3,null,4,2] -> 3");
    TreeNode rc = {1, NULL, NULL};
    CHECK(goodNodes(&rc) == 1, "[1] -> 1");
    CHECK(goodNodes(NULL) == 0, "빈 트리 -> 0");
    printf("[OK] 원문의 예 세 개: 4, 3, 1. 빈 트리는 0\n");

    /* 변형 문제의 답 */
    CHECK(countNoSmaller(&n3, n3.val) == 2, "변형 (가): 3(1, 4)에서 3과 1, 둘");
    CHECK(countNoSmaller(&ra, ra.val) == 3, "변형 (가): [3,1,4,3,null,1,5]에서 뿌리 3, 왼쪽 1, 4 아래의 1, 셋");
    CHECK(sumGood(&ra, ra.val) == 3 + 3 + 4 + 5, "변형 (나): 좋은 노드 3, 3, 4, 5의 합 15");
    printf("[OK] 변형: 작은 값 판 2와 3, 좋은 노드의 합 15\n");

    /* 3. 무작위 트리 */
    for (int trial = 0; trial < 3000; trial++) {
        used = 0;
        TreeNode *root = randomTree(6);
        CHECK(goodNodes(root) == slowCount(root, root), "느린 풀이와 같은 답");
    }
    printf("[OK] 무작위 트리 3000개: 느린 풀이와 같은 답\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
