---
layout: "note"
title: "13_stack-applications-practice_p2.c"
display_title: "13_stack-applications-practice_p2.c"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "13"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/stack-applications-practice/"
parent_title: "스택 응용 연습"
description: "자료구조 · 스택 응용 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/13_stack-applications-practice_p2/"
---
{% raw %}
[스택 응용 연습](/Hongs_Blog/studies/data-structures/stack-applications-practice/) 문서의 문제 2 풀이 코드다.

```c
/* 스택 응용 연습 문제 2: 하노이 탑.
 *
 * 문서: 1-2학기/자료구조/4.연습문제/13.스택 응용 연습.md
 * 코드는 문서의 재귀 풀이를 그대로 짠 것이다.
 * 실행: cc -std=c11 -Wall -Wextra 13_stack-applications-practice_p2.c -o hanoi && ./hanoi
 * 번호: 원판 번호는 문서처럼 가장 큰 것이 1이다. 번호가 클수록 작은 원판이다.
 *       탑은 0 = A, 1 = B, 2 = C.
 *
 * 확인하는 것
 *   1. 원판 3개: 문서의 표와 같은 일곱 번의 이동.
 *   2. 원판 0 ~ 20개: 이동 횟수가 2^n - 1이고, 끝나면 모두 C에 큰 것부터 쌓여 있다.
 *      옮기는 동안 큰 원판을 작은 원판 위에 놓은 적이 없다.
 *   3. 재귀가 가장 깊을 때 n겹이다. 가장 큰 원판은 2^(n-1)번째 차례에 움직인다(4개면 8번째).
 *   4. 원판 64개의 수: 2^64 - 1은 약 1.8 * 10^19. 초당 10^9번이면 1.8 * 10^19으로 셈해 약 570년
 *      (2^64 - 1로 셈하면 약 585년), 1분에 한 번이면 약 3.4 * 10^13년(2^64 - 1로는 약 3.5 * 10^13년).
 */
#include <stdio.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

/* ---------- 문서에 실은 코드 ---------- */

#define MAX_DISKS 24

static int tower[3][MAX_DISKS];       /* 탑마다 스택 하나. tower[t][0]이 바닥 */
static int top[3] = { -1, -1, -1 };

static unsigned long long moves = 0;  /* 원판을 옮긴 횟수 */
static int rule_broken = 0;           /* 큰 원판을 작은 원판 위에 놓았으면 1 */
static int depth = 0, max_depth = 0;  /* 재귀가 몇 겹인가 */

static int first_moves[16][3];        /* 처음 몇 번의 이동을 적어 둔다: 원판, 떠난 탑, 닿은 탑 */
static unsigned long long largest_moved_at = 0;   /* 1번(가장 큰) 원판을 옮긴 차례 */

/* from 탑의 맨 위 원판을 to 탑의 맨 위로 옮긴다 */
void move(int from, int to)
{
    int disk = tower[from][top[from]--];                    /* pop */
    if (top[to] >= 0 && tower[to][top[to]] > disk)          /* 아래 원판의 번호가 더 크다 = 더 작은 원판이다 */
        rule_broken = 1;
    tower[to][++top[to]] = disk;                            /* push */
    if (moves < 16) {
        first_moves[moves][0] = disk; first_moves[moves][1] = from; first_moves[moves][2] = to;
    }
    moves++;
    if (disk == 1) largest_moved_at = moves;
}

/* from 탑의 위쪽 원판 n개를 via 탑을 거쳐 to 탑으로 옮긴다 */
void hanoi(int n, int from, int to, int via)
{
    if (n == 0) return;
    if (++depth > max_depth) max_depth = depth;
    hanoi(n - 1, from, via, to);      /* 위의 n - 1개를 남는 탑으로 치운다 */
    move(from, to);                   /* 맨 아래 원판을 옮긴다 */
    hanoi(n - 1, via, to, from);      /* 치워 둔 n - 1개를 그 위에 올린다 */
    depth--;
}

/* ---------- 여기부터 테스트 ---------- */

static void setup(int n)
{
    top[0] = top[1] = top[2] = -1;
    for (int d = 1; d <= n; d++) tower[0][++top[0]] = d;    /* 1번(가장 큰 것)이 바닥 */
    moves = 0; rule_broken = 0; depth = 0; max_depth = 0;
}

int main(void)
{
    /* 1. 원판 3개 */
    setup(3);
    hanoi(3, 0, 2, 1);
    const int want[7][3] = { {3,0,2}, {2,0,1}, {3,2,1}, {1,0,2}, {3,1,0}, {2,1,2}, {3,0,2} };
    int same = (moves == 7);
    printf("  원판 3개의 이동:");
    for (int k = 0; k < 7; k++) {
        if (first_moves[k][0] != want[k][0] || first_moves[k][1] != want[k][1] || first_moves[k][2] != want[k][2]) same = 0;
        printf(" %d번 %c->%c", first_moves[k][0], 'A' + first_moves[k][1], 'A' + first_moves[k][2]);
    }
    printf("\n");
    check(same, "원판 3개: 일곱 번의 이동이 문서의 표와 같다");
    check(top[0] == -1 && top[1] == -1 && top[2] == 2 && tower[2][0] == 1 && tower[2][1] == 2 && tower[2][2] == 3, "끝: C에 1, 2, 3");
    check(!rule_broken && max_depth == 3, "규칙을 어기지 않았고 재귀는 3겹");

    /* 2, 3. 원판 0 ~ 20개 */
    for (int n = 0; n <= 20; n++) {
        setup(n);
        hanoi(n, 0, 2, 1);
        check(moves == (1ULL << n) - 1, "이동 횟수 2^n - 1");
        int ok = (top[0] == -1 && top[1] == -1 && top[2] == n - 1);
        for (int i = 0; ok && i < n; i++) if (tower[2][i] != i + 1) ok = 0;
        check(ok, "끝나면 모두 C에 큰 것부터");
        check(!rule_broken, "큰 원판을 작은 원판 위에 놓지 않았다");
        check(max_depth == n, "재귀의 깊이 n");
        if (n >= 1) check(largest_moved_at == (1ULL << (n - 1)), "가장 큰 원판은 2^(n-1)번째 차례에 한 번 움직인다");
    }
    /* 점화식 moves(n) = 2 * moves(n - 1) + 1 */
    unsigned long long m = 0;
    for (int n = 1; n <= 63; n++) { m = 2 * m + 1; check(m == (1ULL << n) - 1, "점화식 = 2^n - 1"); }
    m = 2 * m + 1;                                            /* n = 64 */
    check(m == 18446744073709551615ULL, "moves(64) = 2^64 - 1 = 18,446,744,073,709,551,615");

    /* 4. 원판 64개를 옮기는 데 걸리는 시간 */
    const unsigned long long rounded = 18000000000000000000ULL;      /* 1.8 * 10^19 */
    const unsigned long long year_s = 365ULL * 24 * 3600, year_min = 365ULL * 24 * 60;
    check(m / 1000000000000000000ULL == 18, "약 1.8 * 10^19");
    check(rounded / 1000000000ULL / year_s == 570, "1.8 * 10^19번, 초당 10^9번: 약 570년");
    check(m / 1000000000ULL / year_s == 584, "2^64 - 1번으로 셈하면 584.9년");
    check(rounded / year_min / 1000000000000ULL == 34, "1.8 * 10^19번, 1분에 한 번: 약 3.4 * 10^13년");
    check(m / year_min / 1000000000000ULL == 35, "2^64 - 1번으로 셈하면 약 3.5 * 10^13년");
    printf("  moves(64) = %llu\n", m);
    printf("  초당 10^9번: %llu년(1.8e19로 셈), %llu년(정확한 수로 셈)\n", rounded / 1000000000ULL / year_s, m / 1000000000ULL / year_s);

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
