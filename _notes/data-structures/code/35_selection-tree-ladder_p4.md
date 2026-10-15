---
layout: "note"
title: "35_selection-tree-ladder_p4.c"
display_title: "35_selection-tree-ladder_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "35"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/selection-tree-ladder/"
parent_title: "승자 트리와 패자 트리 재경기 예제 사다리"
description: "자료구조 · 승자 트리와 패자 트리 재경기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/35_selection-tree-ladder_p4/"
---
{% raw %}
[승자 트리와 패자 트리 재경기 예제 사다리](/Hongs_Blog/studies/data-structures/selection-tree-ladder/) 문서의 문제 4 풀이 코드다.

```c
/* 승자 트리와 패자 트리 재경기 예제 사다리: 문제 1 ~ 4의 답 확인.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/35.승자 트리와 패자 트리 재경기 예제 사다리.md
 * 문제 1은 3.개념집/34.승자 트리의 예시 16명이다.
 * 실행: cc -std=c11 -Wall -Wextra 35_selection-tree-ladder_p4.c -o ladder && ./ladder
 * 두 트리의 코드는 3.개념집/34_winner-tree_impl.c와 35_loser-tree_impl.c에서 필요한 만큼 옮겨 왔다.
 * 칸 번호: 1 ~ n - 1번이 경기 노드, 선수 p(0부터)는 n + p번. 작은 값이 이기고, 같으면 번호가 앞선 선수가 이긴다.
 *
 * 확인하는 것
 *   문제 1: 16명 승자 트리에서 우승자 1을 6으로 바꾸면 10, 5, 2, 1번 노드가 5, 3, 3, 2.
 *   문제 2: 8명(7 2 9 4 6 1 8 3) 승자 트리 2 4 1 3 / 2 1 / 1. 우승자 1을 10으로 바꾸면 6, 3, 1번 노드가 6, 3, 2.
 *   문제 3: 같은 8명의 패자 트리 7 9 6 8 / 4 3 / 2, 우승자 1. 우승자를 5로 바꾸면 6, 3, 1번 노드가 6, 5, 3, 새 우승자 2.
 *   문제 4: 8명(5 8 2 9 7 3 6 4) 패자 트리 8 9 7 6 / 5 4 / 3, 우승자 2.
 *           우승자를 꺼내고 큰 값으로 바꾸기를 세 번 하면 2, 3, 4가 나오고 그다음 우승자는 5.
 *           세 번 뒤의 트리: 8 INF INF INF / 9 7 / 6. 겨룬 횟수는 만들 때 7번 + 세 번 x 3번 = 16번.
 */
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

#define MAXP 16
#define BIG INT_MAX

static int n;                 /* 선수 수 */
static int player[MAXP];      /* 선수의 값 */
static int tree[MAXP];        /* 승자 트리: 이긴 선수 번호 / 패자 트리: 진 선수 번호, tree[0]은 우승자 */
static long matches;

static int beats(int a, int b)
{
    matches++;
    if (player[a] != player[b]) return player[a] < player[b];
    return a < b;
}

/* ---- 승자 트리 ---- */

static int who(int i) { return (i >= n) ? i - n : tree[i]; }

static void buildWinner(const int *value, int count)
{
    n = count;
    for (int p = 0; p < n; p++) player[p] = value[p];
    for (int i = n - 1; i >= 1; i--) {
        int a = who(2 * i), b = who(2 * i + 1);
        tree[i] = beats(a, b) ? a : b;
    }
}

static void winnerChangeAndReplay(int p, int value)
{
    player[p] = value;
    for (int i = (p + n) / 2; i >= 1; i /= 2) {
        int a = who(2 * i), b = who(2 * i + 1);
        tree[i] = beats(a, b) ? a : b;
    }
}

/* ---- 패자 트리 ---- */

static void buildLoser(const int *value, int count)
{
    int win[2 * MAXP];
    n = count;
    for (int p = 0; p < n; p++) { player[p] = value[p]; win[n + p] = p; }
    for (int i = n - 1; i >= 1; i--) {
        int a = win[2 * i], b = win[2 * i + 1];
        if (beats(a, b)) { win[i] = a; tree[i] = b; }
        else             { win[i] = b; tree[i] = a; }
    }
    tree[0] = win[1];
}

static void loserReplaceWinnerAndReplay(int value)
{
    int challenger = tree[0];
    player[challenger] = value;
    for (int i = (challenger + n) / 2; i >= 1; i /= 2) {
        if (beats(tree[i], challenger)) {
            int tmp = tree[i];
            tree[i] = challenger;
            challenger = tmp;
        }
    }
    tree[0] = challenger;
}

/* first번 노드부터 count개의 노드에 적힌 선수의 값이 want와 같은가 */
static int levelIs(int first, const int *want, int count)
{
    for (int k = 0; k < count; k++) if (player[tree[first + k]] != want[k]) return 0;
    return 1;
}

int main(void)
{
    /* 문제 1 */
    const int p16[16] = {4, 3, 6, 8, 1, 5, 7, 3, 2, 6, 9, 4, 5, 2, 5, 8};
    buildWinner(p16, 16);
    CHECK(tree[1] == 4 && player[4] == 1, "문제 1: 우승자는 번호 4(값 1), 20번 칸");
    matches = 0;
    winnerChangeAndReplay(4, 6);
    CHECK(matches == 4, "문제 1: 경기 4번");
    CHECK(player[tree[10]] == 5 && player[tree[5]] == 3 && player[tree[2]] == 3 && player[tree[1]] == 2,
          "문제 1: 10, 5, 2, 1번 노드가 5, 3, 3, 2");
    printf("[OK] 문제 1: 20번 칸 -> 10, 5, 2, 1번 노드가 5, 3, 3, 2. 새 우승자 2\n");

    /* 문제 2 */
    const int p8[8] = {7, 2, 9, 4, 6, 1, 8, 3};
    matches = 0;
    buildWinner(p8, 8);
    CHECK(matches == 7, "문제 2: 만들 때 경기 7번");
    int w1[] = {2, 4, 1, 3}, w2[] = {2, 1}, w3[] = {1};
    CHECK(levelIs(4, w1, 4) && levelIs(2, w2, 2) && levelIs(1, w3, 1), "문제 2: 승자 2 4 1 3 / 2 1 / 1");
    CHECK(tree[1] == 5, "문제 2: 우승자는 번호 5(여섯째 선수), 13번 칸");
    matches = 0;
    winnerChangeAndReplay(5, 10);
    CHECK(matches == 3, "문제 2: 경기 3번");
    CHECK(player[tree[6]] == 6 && player[tree[3]] == 3 && player[tree[1]] == 2, "문제 2: 6, 3, 1번 노드가 6, 3, 2");
    int w1b[] = {2, 4, 6, 3}, w2b[] = {2, 3};
    CHECK(levelIs(4, w1b, 4) && levelIs(2, w2b, 2) && tree[1] == 1, "문제 2: 바꾼 뒤 2 4 6 3 / 2 3 / 2, 우승자는 번호 1");
    printf("[OK] 문제 2: 승자 2 4 1 3 / 2 1 / 1. 1을 10으로 바꾸면 6, 3, 1번 노드가 6, 3, 2\n");

    /* 문제 3 */
    matches = 0;
    buildLoser(p8, 8);
    CHECK(matches == 7, "문제 3: 만들 때 경기 7번");
    int l1[] = {7, 9, 6, 8}, l2[] = {4, 3}, l3[] = {2};
    CHECK(levelIs(4, l1, 4) && levelIs(2, l2, 2) && levelIs(1, l3, 1), "문제 3: 패자 7 9 6 8 / 4 3 / 2");
    CHECK(player[tree[0]] == 1 && tree[0] == 5, "문제 3: 우승자 1(번호 5)");
    matches = 0;
    loserReplaceWinnerAndReplay(5);
    CHECK(matches == 3, "문제 3: 경기 3번");
    CHECK(player[tree[6]] == 6 && player[tree[3]] == 5 && player[tree[1]] == 3, "문제 3: 6, 3, 1번 노드가 6, 5, 3");
    CHECK(player[tree[0]] == 2 && tree[0] == 1, "문제 3: 새 우승자 2(번호 1)");
    int l1b[] = {7, 9, 6, 8}, l2b[] = {4, 5};
    CHECK(levelIs(4, l1b, 4) && levelIs(2, l2b, 2), "문제 3: 바꾼 뒤 7 9 6 8 / 4 5 / 3");
    printf("[OK] 문제 3: 패자 7 9 6 8 / 4 3 / 2, 우승자 1. 1을 5로 바꾸면 6, 3, 1번 노드가 6, 5, 3, 새 우승자 2\n");

    /* 문제 4 */
    const int q8[8] = {5, 8, 2, 9, 7, 3, 6, 4};
    matches = 0;
    buildLoser(q8, 8);
    int m1[] = {8, 9, 7, 6}, m2[] = {5, 4}, m3[] = {3};
    CHECK(levelIs(4, m1, 4) && levelIs(2, m2, 2) && levelIs(1, m3, 1), "문제 4: 패자 8 9 7 6 / 5 4 / 3");
    CHECK(player[tree[0]] == 2, "문제 4: 우승자 2");
    int out[3];
    out[0] = player[tree[0]]; loserReplaceWinnerAndReplay(BIG);
    int a1[] = {8, BIG, 7, 6}, a2[] = {9, 4}, a3[] = {5};
    CHECK(levelIs(4, a1, 4) && levelIs(2, a2, 2) && levelIs(1, a3, 1) && player[tree[0]] == 3,
          "문제 4: 한 번 뒤 8 INF 7 6 / 9 4 / 5, 우승자 3");
    out[1] = player[tree[0]]; loserReplaceWinnerAndReplay(BIG);
    int b1[] = {8, BIG, BIG, 6}, b2[] = {9, 7}, b3[] = {5};
    CHECK(levelIs(4, b1, 4) && levelIs(2, b2, 2) && levelIs(1, b3, 1) && player[tree[0]] == 4,
          "문제 4: 두 번 뒤 8 INF INF 6 / 9 7 / 5, 우승자 4");
    out[2] = player[tree[0]]; loserReplaceWinnerAndReplay(BIG);
    int c1[] = {8, BIG, BIG, BIG}, c2[] = {9, 7}, c3[] = {6};
    CHECK(levelIs(4, c1, 4) && levelIs(2, c2, 2) && levelIs(1, c3, 1) && player[tree[0]] == 5,
          "문제 4: 세 번 뒤 8 INF INF INF / 9 7 / 6, 우승자 5");
    CHECK(out[0] == 2 && out[1] == 3 && out[2] == 4, "문제 4: 나온 값 2, 3, 4");
    CHECK(matches == 7 + 3 * 3, "문제 4: 경기 7 + 9 = 16번");
    printf("[OK] 문제 4: 패자 8 9 7 6 / 5 4 / 3, 우승자 2. 세 번 꺼내면 2, 3, 4, 그다음 우승자 5. 경기 16번\n");

    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
