---
layout: "note"
title: "34_winner-tree_impl.c"
display_title: "34_winner-tree_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "34"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/winner-tree/"
parent_title: "승자 트리"
description: "자료구조 · 승자 트리 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/34_winner-tree_impl/"
---
{% raw %}
[승자 트리](/Hongs_Blog/studies/data-structures/winner-tree/) 문서의 구현 코드다.

```c
/* 승자 트리(최소 승자 트리): 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/34.승자 트리.md
 * 출처: 자료구조 9주차 슬라이드 p.26~56. 슬라이드에는 그림과 복잡도만 있고 코드는 없다.
 *       아래 배열 구현은 그 그림을 옮긴 것이다(에이전트 보충).
 * 실행: cc -std=c11 -Wall -Wextra 34_winner-tree_impl.c -o winner && ./winner
 *
 * 칸 번호: 노드에 1, 2, ..., 2n - 1번을 붙인다. 1 ~ n - 1번이 경기 노드, n ~ 2n - 1번이 선수다.
 *          i번 노드의 자식은 2i, 2i + 1번이고 부모는 i / 2번이다. 선수 p(0부터)는 n + p번 노드다.
 *          tree[i]에는 그 경기에서 이긴 선수의 번호 p를 적는다. 작은 값이 이기고, 같으면 번호가 앞선 선수가 이긴다
 *          (슬라이드의 16명 그림에서는 왼쪽 선수다).
 *          n이 2의 거듭제곱이 아니어도 그대로 쓸 수 있다. 그때는 선수 칸이 맨 아래 두 층에 나뉘어 놓인다.
 *
 * 확인하는 것
 *   1. 슬라이드의 16명(4 3 6 8 1 5 7 3 2 6 9 4 5 2 5 8): 층별 승자 3 6 1 3 2 4 2 5 / 3 1 2 2 / 1 2 / 1.
 *   2. 만들 때 치르는 경기는 n - 1 = 15번.
 *   3. 우승자를 6으로 바꾸고 다시 겨루면 길 위의 네 칸이 5, 3, 3, 2가 되고 경기는 4번.
 *      우승자가 아닌 아홉째 선수(값 2)를 7로 바꾸면 12, 6, 3, 1번 노드가 6, 4, 2, 1이 된다.
 *   4. 정렬: 우승자를 꺼내고 큰 값으로 바꾸기를 되풀이. 슬라이드의 처음 네 값 1, 2, 2, 3과 꺼낼 때마다의 길.
 *   5. 무작위 2,000묶음(n = 1 ~ 40): 승자 트리 정렬 = qsort, 아무 선수나 바꾸고 다시 겨룬 우승자 = 직접 찾은 최솟값,
 *      다시 겨루는 경기 수 <= ceil(lg n).
 */
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

typedef struct {
    int n;        /* 선수 수 */
    int *player;  /* player[0 .. n-1]: 선수의 값 */
    int *tree;    /* tree[1 .. n-1]: 그 경기에서 이긴 선수의 번호 */
} winnerTree;

static long matches;   /* 치른 경기 수 */

/* i번 노드에 있는 선수 번호. 선수 칸이면 자기 자신, 경기 노드면 거기 적힌 승자 */
static int who(const winnerTree *t, int i)
{
    return (i >= t->n) ? i - t->n : t->tree[i];
}

/* 선수 a와 b가 겨뤄 이긴 쪽의 번호. 작은 값이 이기고, 같으면 번호가 앞선 선수가 이긴다 */
static int play(const winnerTree *t, int a, int b)
{
    matches++;
    if (t->player[a] != t->player[b]) return (t->player[a] < t->player[b]) ? a : b;
    return (a < b) ? a : b;
}

/* 값 n개로 승자 트리를 만든다: 경기 n - 1번 */
winnerTree *createWinnerTree(const int *value, int n)
{
    winnerTree *t = malloc(sizeof(*t));
    if (t == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    t->n = n;
    t->player = malloc((size_t)n * sizeof(int));
    t->tree = malloc((size_t)n * sizeof(int));     /* 0번 칸은 쓰지 않는다 */
    if (t->player == NULL || t->tree == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    for (int p = 0; p < n; p++) t->player[p] = value[p];
    for (int i = n - 1; i >= 1; i--)               /* 아래 층 경기부터 */
        t->tree[i] = play(t, who(t, 2 * i), who(t, 2 * i + 1));
    return t;
}

void destroyWinnerTree(winnerTree *t)
{
    free(t->player);
    free(t->tree);
    free(t);
}

/* 우승자의 선수 번호: O(1) */
int winner(const winnerTree *t)
{
    return (t->n == 1) ? 0 : t->tree[1];
}

/* 선수 p의 값을 바꾸고, p에서 뿌리까지 길 위의 경기만 다시 치른다 */
void changeAndReplay(winnerTree *t, int p, int value)
{
    t->player[p] = value;
    for (int i = (p + t->n) / 2; i >= 1; i /= 2)
        t->tree[i] = play(t, who(t, 2 * i), who(t, 2 * i + 1));
}

/* 승자 트리로 정렬: 우승자를 꺼내고 그 자리를 아주 큰 값으로 바꾼다 */
void winnerTreeSort(const int *in, int *out, int n)
{
    if (n == 0) return;
    winnerTree *t = createWinnerTree(in, n);
    for (int k = 0; k < n; k++) {
        int w = winner(t);
        out[k] = t->player[w];
        changeAndReplay(t, w, INT_MAX);
    }
    destroyWinnerTree(t);
}

/* ---- 테스트용 도구 ---- */

static int valueAt(const winnerTree *t, int i) { return t->player[who(t, i)]; }

static int levelIs(const winnerTree *t, int first, const int *want, int count)
{
    for (int k = 0; k < count; k++) if (valueAt(t, first + k) != want[k]) return 0;
    return 1;
}

static int cmpInt(const void *a, const void *b)
{
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);
}

static int ceilLg(int n) { int k = 0; while ((1 << k) < n) k++; return k; }

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

int main(void)
{
    const int players[16] = {4, 3, 6, 8, 1, 5, 7, 3, 2, 6, 9, 4, 5, 2, 5, 8};

    /* 1, 2. 슬라이드의 16명 */
    matches = 0;
    winnerTree *t = createWinnerTree(players, 16);
    CHECK(matches == 15, "만들 때 경기는 n - 1 = 15번");
    int l1[] = {3, 6, 1, 3, 2, 4, 2, 5}, l2[] = {3, 1, 2, 2}, l3[] = {1, 2}, l4[] = {1};
    CHECK(levelIs(t, 8, l1, 8), "8 ~ 15번 노드의 승자");
    CHECK(levelIs(t, 4, l2, 4), "4 ~ 7번 노드의 승자");
    CHECK(levelIs(t, 2, l3, 2), "2 ~ 3번 노드의 승자");
    CHECK(levelIs(t, 1, l4, 1), "1번 노드의 승자");
    CHECK(winner(t) == 4 && t->player[4] == 1, "우승자는 다섯째 선수(번호 4), 값 1");
    printf("[OK] 16명: 3 6 1 3 2 4 2 5 / 3 1 2 2 / 1 2 / 1, 경기 15번\n");

    /* 3. 우승자를 6으로 바꾸고 다시 겨루기 (p.53~56) */
    matches = 0;
    changeAndReplay(t, 4, 6);
    CHECK(matches == 4, "다시 겨루는 경기는 lg 16 = 4번");
    CHECK(valueAt(t, 10) == 5 && valueAt(t, 5) == 3 && valueAt(t, 2) == 3 && valueAt(t, 1) == 2,
          "길 위의 10, 5, 2, 1번 노드가 5, 3, 3, 2");
    int l1b[] = {3, 6, 5, 3, 2, 4, 2, 5}, l2b[] = {3, 3, 2, 2}, l3b[] = {3, 2};
    CHECK(levelIs(t, 8, l1b, 8) && levelIs(t, 4, l2b, 4) && levelIs(t, 2, l3b, 2), "길 밖의 칸은 그대로");
    CHECK(winner(t) == 8, "새 우승자는 아홉째 선수(번호 8), 값 2");
    destroyWinnerTree(t);
    printf("[OK] 우승자 1을 6으로 바꾸면 10, 5, 2, 1번 노드가 5, 3, 3, 2가 된다. 경기 4번\n");

    /* 3-2. 우승자가 아닌 선수를 바꿔도 된다: 아홉째 선수(번호 8, 값 2)를 7로 */
    t = createWinnerTree(players, 16);
    matches = 0;
    changeAndReplay(t, 8, 7);
    CHECK(matches == 4, "경기 4번");
    CHECK(8 + 16 == 24 && 24 / 2 == 12 && 12 / 2 == 6 && 6 / 2 == 3 && 3 / 2 == 1, "24번 칸에서 12, 6, 3, 1번 노드로");
    CHECK(valueAt(t, 12) == 6 && valueAt(t, 6) == 4 && valueAt(t, 3) == 2 && valueAt(t, 1) == 1,
          "길 위의 12, 6, 3, 1번 노드가 6, 4, 2, 1");
    CHECK(winner(t) == 4, "우승자는 그대로 번호 4(값 1)");
    destroyWinnerTree(t);
    printf("[OK] 아홉째 선수 2를 7로 바꾸면 12, 6, 3, 1번 노드가 6, 4, 2, 1. 우승자는 그대로 1\n");

    /* 4. 정렬의 처음 네 걸음 (p.33~50) */
    t = createWinnerTree(players, 16);
    int w;
    w = winner(t); CHECK(w == 4 && t->player[w] == 1, "첫째로 꺼내는 값 1(번호 4)");
    changeAndReplay(t, w, INT_MAX);
    CHECK(valueAt(t, 10) == 5 && valueAt(t, 5) == 3 && valueAt(t, 2) == 3 && valueAt(t, 1) == 2, "1을 꺼낸 뒤의 길: 5, 3, 3, 2");
    w = winner(t); CHECK(w == 8 && t->player[w] == 2, "둘째로 꺼내는 값 2(번호 8)");
    changeAndReplay(t, w, INT_MAX);
    CHECK(valueAt(t, 12) == 6 && valueAt(t, 6) == 4 && valueAt(t, 3) == 2 && valueAt(t, 1) == 2, "2를 꺼낸 뒤의 길: 6, 4, 2, 2");
    w = winner(t); CHECK(w == 13 && t->player[w] == 2, "셋째로 꺼내는 값 2(번호 13)");
    changeAndReplay(t, w, INT_MAX);
    CHECK(valueAt(t, 14) == 5 && valueAt(t, 7) == 5 && valueAt(t, 3) == 4 && valueAt(t, 1) == 3, "둘째 2를 꺼낸 뒤의 길: 5, 5, 4, 3");
    w = winner(t); CHECK(w == 1 && t->player[w] == 3, "넷째로 꺼내는 값 3(번호 1, 같은 값이면 앞 번호)");
    changeAndReplay(t, w, INT_MAX);
    CHECK(valueAt(t, 8) == 4 && valueAt(t, 4) == 4 && valueAt(t, 2) == 3 && valueAt(t, 1) == 3, "3을 꺼낸 뒤의 길: 4, 4, 3, 3");
    CHECK(winner(t) == 7, "다음 우승자는 여덟째 선수(번호 7)의 3");
    destroyWinnerTree(t);
    int sorted[16], want[16];
    matches = 0;
    winnerTreeSort(players, sorted, 16);
    CHECK(matches == 15 + 16 * 4, "정렬의 경기 수 = 15 + 16 x 4 = 79");
    for (int i = 0; i < 16; i++) want[i] = players[i];
    qsort(want, 16, sizeof(int), cmpInt);
    for (int i = 0; i < 16; i++) CHECK(sorted[i] == want[i], "16명 정렬 결과");
    printf("[OK] 정렬: 1, 2, 2, 3, ... 순으로 나오고 전체는 1 2 2 3 3 4 4 5 5 5 6 6 7 8 8 9, 경기 79번\n");

    /* 5. 무작위 */
    for (int batch = 0; batch < 2000; batch++) {
        int n = 1 + (int)(rnd() % 40);
        int a[40], b[40], c[40];
        for (int i = 0; i < n; i++) a[i] = c[i] = (int)(rnd() % 30);
        winnerTreeSort(a, b, n);
        qsort(c, (size_t)n, sizeof(int), cmpInt);
        for (int i = 0; i < n; i++) CHECK(b[i] == c[i], "승자 트리 정렬 = qsort");

        matches = 0;
        t = createWinnerTree(a, n);
        CHECK(matches == n - 1, "만들 때 경기는 n - 1번");
        for (int step = 0; step < 20; step++) {
            int p = (int)(rnd() % (unsigned)n), v = (int)(rnd() % 30);
            a[p] = v;
            matches = 0;
            changeAndReplay(t, p, v);
            CHECK(matches <= ceilLg(n), "다시 겨루는 경기 수 <= ceil(lg n)");
            int best = 0;
            for (int i = 1; i < n; i++) if (a[i] < a[best]) best = i;
            CHECK(winner(t) == best, "다시 겨룬 우승자 = 직접 찾은 최솟값(같으면 앞 번호)");
        }
        destroyWinnerTree(t);
    }
    printf("[OK] 무작위 2000묶음(n = 1 ~ 40): 정렬 = qsort, 다시 겨룬 우승자 = 최솟값, 경기 수 <= ceil(lg n)\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
