---
layout: "note"
title: "35_loser-tree_impl.c"
display_title: "35_loser-tree_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "35"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/loser-tree/"
parent_title: "패자 트리"
description: "자료구조 · 패자 트리 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/35_loser-tree_impl/"
---
{% raw %}
[패자 트리](/Hongs_Blog/studies/data-structures/loser-tree/) 문서의 구현 코드다.

```c
/* 패자 트리(최소 패자 트리): 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/35.패자 트리.md
 * 출처: 자료구조 9주차 슬라이드 p.57~69, 14주차 p.52. 슬라이드에는 그림과 복잡도만 있고 코드는 없다.
 *       아래 배열 구현은 그 그림을 옮긴 것이다(에이전트 보충).
 * 실행: cc -std=c11 -Wall -Wextra 35_loser-tree_impl.c -o loser && ./loser
 *
 * 칸 번호는 승자 트리와 같다: 1 ~ n - 1번이 경기 노드, n ~ 2n - 1번이 선수, 선수 p는 n + p번.
 * tree[i]에는 그 경기에서 진 선수의 번호를, tree[0]에는 전체 우승자의 번호를 적는다.
 * 작은 값이 이기고, 같으면 번호가 앞선(왼쪽) 선수가 이긴다.
 *
 * 확인하는 것
 *   1. 슬라이드의 16명: 층별 패자 4 8 5 7 6 9 5 8 / 6 3 4 5 / 3 2 / 2, 우승자 1. 경기 15번.
 *   2. 우승자를 9로 바꾸고 다시 겨루면 길 위의 네 칸이 9, 5, 3, 3이 되고 새 우승자는 2. 경기 4번.
 *      처음 트리에서 우승자를 4로 바꾸면 네 칸이 5, 4, 3, 3, 새 우승자 2.
 *   3. 14주차 p.52의 8개 런: 패자 10 20 9 90 / 9 17 / 8, 우승자 6.
 *   4. 다시 겨룰 때 패자 트리는 길 위의 칸 lg n개만 읽고, 승자 트리는 층마다 두 자식 칸을 읽는다(16명: 4칸 대 8칸).
 *   5. 반례: 우승자가 아닌 선수를 바꾸고 같은 방법으로 올라가면 우승자를 틀린다(1 2 3 4에서 3을 10으로).
 *   6. 무작위 2,000묶음(n = 1 ~ 40): 패자 트리 정렬 = qsort, 우승자를 바꾸고 다시 겨룬 결과 = 직접 찾은 최솟값.
 */
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct {
    int n;        /* 선수 수 */
    int *player;  /* player[0 .. n-1]: 선수의 값 */
    int *tree;    /* tree[1 .. n-1]: 그 경기에서 진 선수의 번호, tree[0]: 전체 우승자 */
} loserTree;

static long matches;     /* 치른 경기 수 */
static long nodeReads;   /* 다시 겨룰 때 읽은 트리 칸 수 */

/* 선수 a가 선수 b를 이기는가. 값이 같으면 번호가 앞선 쪽이 이긴다 */
static int beats(const loserTree *t, int a, int b)
{
    matches++;
    if (t->player[a] != t->player[b]) return t->player[a] < t->player[b];
    return a < b;
}

/* 값 n개로 패자 트리를 만든다: 경기 n - 1번.
 * 올려 보낼 승자는 잠깐 쓰는 배열 win에 적고, 트리에는 패자만 남긴다 */
loserTree *createLoserTree(const int *value, int n)
{
    loserTree *t = malloc(sizeof(*t));
    int *win = malloc((size_t)(2 * n) * sizeof(int));   /* win[i]: i번 노드에서 올라가는 선수 */
    if (t == NULL || win == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    t->n = n;
    t->player = malloc((size_t)n * sizeof(int));
    t->tree = malloc((size_t)n * sizeof(int));
    if (t->player == NULL || t->tree == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    for (int p = 0; p < n; p++) { t->player[p] = value[p]; win[n + p] = p; }
    for (int i = n - 1; i >= 1; i--) {
        int a = win[2 * i], b = win[2 * i + 1];
        if (beats(t, a, b)) { win[i] = a; t->tree[i] = b; }
        else                { win[i] = b; t->tree[i] = a; }
    }
    t->tree[0] = (n == 1) ? 0 : win[1];
    free(win);
    return t;
}

void destroyLoserTree(loserTree *t)
{
    free(t->player);
    free(t->tree);
    free(t);
}

/* 우승자의 값을 바꾸고 다시 겨룬다.
 * 올라가는 선수(challenger)를 길 위의 칸에 적힌 패자와만 겨루게 한다. 형제 칸은 보지 않는다 */
void replaceWinnerAndReplay(loserTree *t, int value)
{
    int challenger = t->tree[0];
    t->player[challenger] = value;
    for (int i = (challenger + t->n) / 2; i >= 1; i /= 2) {
        nodeReads++;                                 /* tree[i] 한 칸만 읽는다 */
        if (beats(t, t->tree[i], challenger)) {      /* 적혀 있던 패자가 이기면 */
            int tmp = t->tree[i];                    /* 둘이 자리를 바꾼다 */
            t->tree[i] = challenger;
            challenger = tmp;
        }
    }
    t->tree[0] = challenger;
}

/* 패자 트리로 정렬 */
void loserTreeSort(const int *in, int *out, int n)
{
    if (n == 0) return;
    loserTree *t = createLoserTree(in, n);
    for (int k = 0; k < n; k++) {
        out[k] = t->player[t->tree[0]];
        replaceWinnerAndReplay(t, INT_MAX);
    }
    destroyLoserTree(t);
}

/* ---- 테스트용 도구 ---- */

/* 틀린 사용법: 우승자가 아닌 선수 p를 바꾸고 같은 방식으로 올라간다 */
static void naiveReplayFrom(loserTree *t, int p, int value)
{
    int challenger = p;
    t->player[p] = value;
    for (int i = (p + t->n) / 2; i >= 1; i /= 2) {
        if (t->tree[i] != challenger && beats(t, t->tree[i], challenger)) {
            int tmp = t->tree[i];
            t->tree[i] = challenger;
            challenger = tmp;
        }
    }
    t->tree[0] = challenger;
}

/* 비교용: 승자 트리에서 다시 겨룰 때 읽는 트리 칸 수(층마다 두 자식) */
static long winnerTreeReplayReads(int n, int p)
{
    long reads = 0;
    for (int i = (p + n) / 2; i >= 1; i /= 2) reads += 2;
    return reads;
}

static int levelIs(const loserTree *t, int first, const int *want, int count)
{
    for (int k = 0; k < count; k++) if (t->player[t->tree[first + k]] != want[k]) return 0;
    return 1;
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
    const int players[16] = {4, 3, 6, 8, 1, 5, 7, 3, 2, 6, 9, 4, 5, 2, 5, 8};

    /* 1. 슬라이드의 16명 (p.59~66) */
    matches = 0;
    loserTree *t = createLoserTree(players, 16);
    CHECK(matches == 15, "만들 때 경기는 n - 1 = 15번");
    int l1[] = {4, 8, 5, 7, 6, 9, 5, 8}, l2[] = {6, 3, 4, 5}, l3[] = {3, 2}, l4[] = {2};
    CHECK(levelIs(t, 8, l1, 8), "8 ~ 15번 노드의 패자");
    CHECK(levelIs(t, 4, l2, 4), "4 ~ 7번 노드의 패자");
    CHECK(levelIs(t, 2, l3, 2), "2 ~ 3번 노드의 패자");
    CHECK(levelIs(t, 1, l4, 1), "1번 노드의 패자");
    CHECK(t->tree[0] == 4 && t->player[4] == 1, "우승자는 다섯째 선수(번호 4), 값 1");
    printf("[OK] 16명: 패자 4 8 5 7 6 9 5 8 / 6 3 4 5 / 3 2 / 2, 우승자 1, 경기 15번\n");

    /* 2. 우승자를 9로 바꾸고 다시 겨루기 (p.68) */
    matches = 0; nodeReads = 0;
    replaceWinnerAndReplay(t, 9);
    CHECK(matches == 4 && nodeReads == 4, "경기 4번, 읽은 칸 4개");
    CHECK(t->player[t->tree[10]] == 9 && t->player[t->tree[5]] == 5
          && t->player[t->tree[2]] == 3 && t->player[t->tree[1]] == 3, "길 위의 10, 5, 2, 1번 노드가 9, 5, 3, 3");
    int l1b[] = {4, 8, 9, 7, 6, 9, 5, 8}, l2b[] = {6, 5, 4, 5}, l3b[] = {3, 2};
    CHECK(levelIs(t, 8, l1b, 8) && levelIs(t, 4, l2b, 4) && levelIs(t, 2, l3b, 2), "길 밖의 칸은 그대로");
    CHECK(t->player[t->tree[0]] == 2 && t->tree[0] == 8, "새 우승자는 아홉째 선수(번호 8), 값 2");
    CHECK(winnerTreeReplayReads(16, 4) == 8, "승자 트리라면 층마다 두 칸, 모두 8칸");
    destroyLoserTree(t);
    printf("[OK] 우승자 1을 9로 바꾸면 10, 5, 2, 1번 노드가 9, 5, 3, 3, 새 우승자 2. 읽은 칸 4개(승자 트리는 8개)\n");

    /* 2-2. 처음 트리에서 우승자를 4로 바꾸는 경우 (카드 C1) */
    t = createLoserTree(players, 16);
    replaceWinnerAndReplay(t, 4);
    CHECK(t->player[t->tree[10]] == 5 && t->player[t->tree[5]] == 4
          && t->player[t->tree[2]] == 3 && t->player[t->tree[1]] == 3, "길 위의 10, 5, 2, 1번 노드가 5, 4, 3, 3");
    CHECK(t->tree[2] == 7 && t->tree[1] == 1, "2번 노드에는 여덟째 선수(번호 7), 1번 노드에는 둘째 선수(번호 1)의 3");
    CHECK(t->player[t->tree[0]] == 2 && t->tree[0] == 8, "새 우승자 2(번호 8)");
    destroyLoserTree(t);
    printf("[OK] 우승자 1을 4로 바꾸면 10, 5, 2, 1번 노드가 5, 4, 3, 3, 새 우승자 2\n");

    /* 5-2. 같은 바꾸기를 승자 트리 방식(두 자식의 승자끼리 겨루기)으로 하면 옳은 답 1이 나온다 */
    {
        int v[4] = {1, 2, 10, 4};                 /* 1 2 3 4에서 셋째를 10으로 바꾼 뒤 */
        int n3 = (v[2] < v[3]) ? v[2] : v[3];     /* 3번 노드: 10 대 4 */
        int n2 = (v[0] < v[1]) ? v[0] : v[1];     /* 2번 노드: 1 대 2 (그대로) */
        int n1 = (n2 < n3) ? n2 : n3;             /* 1번 노드 */
        CHECK(n3 == 4 && n1 == 1, "승자 트리라면 3번 노드 4, 1번 노드 1");
    }

    /* 3. 14주차 p.52: 런 8개의 맨 앞 값 */
    const int runs[8] = {10, 9, 20, 6, 8, 9, 90, 17};
    t = createLoserTree(runs, 8);
    int r1[] = {10, 20, 9, 90}, r2[] = {9, 17}, r3[] = {8};
    CHECK(levelIs(t, 4, r1, 4) && levelIs(t, 2, r2, 2) && levelIs(t, 1, r3, 1), "패자 10 20 9 90 / 9 17 / 8");
    CHECK(t->player[t->tree[0]] == 6, "우승자 6");
    destroyLoserTree(t);
    printf("[OK] 14주차 p.52의 런 8개: 패자 10 20 9 90 / 9 17 / 8, 우승자 6\n");

    /* 5. 반례: 우승자가 아닌 선수를 바꾼다 */
    const int four[4] = {1, 2, 3, 4};
    t = createLoserTree(four, 4);
    naiveReplayFrom(t, 2, 10);                       /* 셋째 선수 3을 10으로 */
    CHECK(t->player[t->tree[0]] == 4, "같은 방식으로 올라가면 4가 우승자라고 한다");
    int trueMin = INT_MAX;
    for (int p = 0; p < 4; p++) if (t->player[p] < trueMin) trueMin = t->player[p];
    CHECK(trueMin == 1, "실제 최솟값은 1");
    destroyLoserTree(t);
    printf("[OK] 반례: 1 2 3 4에서 우승자가 아닌 3을 10으로 바꾸고 같은 식으로 올라가면 4를 우승자로 낸다(참은 1)\n");

    /* 6. 무작위 */
    for (int batch = 0; batch < 2000; batch++) {
        int n = 1 + (int)(rnd() % 40);
        int a[40], b[40], c[40];
        for (int i = 0; i < n; i++) a[i] = c[i] = (int)(rnd() % 30);
        loserTreeSort(a, b, n);
        qsort(c, (size_t)n, sizeof(int), cmpInt);
        for (int i = 0; i < n; i++) CHECK(b[i] == c[i], "패자 트리 정렬 = qsort");

        matches = 0;
        t = createLoserTree(a, n);
        CHECK(matches == n - 1, "만들 때 경기는 n - 1번");
        for (int step = 0; step < 20; step++) {
            int w = t->tree[0], v = (int)(rnd() % 30);
            int best = 0;
            for (int i = 1; i < n; i++) if (a[i] < a[best]) best = i;
            CHECK(w == best, "우승자 = 직접 찾은 최솟값(같으면 앞 번호)");
            a[w] = v;
            replaceWinnerAndReplay(t, v);
        }
        destroyLoserTree(t);
    }
    printf("[OK] 무작위 2000묶음(n = 1 ~ 40): 정렬 = qsort, 우승자를 바꾸고 다시 겨룬 결과 = 최솟값\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
