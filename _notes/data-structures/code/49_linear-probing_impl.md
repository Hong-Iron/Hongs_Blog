---
layout: "note"
title: "49_linear-probing_impl.c"
display_title: "49_linear-probing_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "49"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linear-probing/"
parent_title: "선형 탐사"
description: "자료구조 · 선형 탐사 구현 코드"
permalink: "/studies/data-structures/code/49_linear-probing_impl/"
---
{% raw %}
[선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/) 문서의 구현 코드다.

```c
/* 선형 탐사 해시 테이블: 찾기, 넣기, 지우기(뭉치 당기기). 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 49_linear-probing_impl.c -o probing && ./probing
 * 문서: 49.선형 탐사 (넣기 표, 지우기 추적 세 개, 불변식, 오해, 카드 C1~C5)
 * 출처: 자료구조 15주차 슬라이드 p.20~25. 슬라이드에는 그림만 있어 코드는 그림대로 짠 것이다.
 * 키는 0 이상인 정수, 홈 버킷은 key % b. 버킷 번호는 0부터 b-1까지.
 *
 * 확인하는 것
 *   1. 넣기: 6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45를 b = 17에 넣은 표 (p.21)
 *   2. 지우기: 처음 표에서 0, 34, 29를 각각 지운 표 (p.22~24)와 옮겨진 키의 차례
 *   3. "그 칸만 비우는" 틀린 지우기로 34를 지우면 0과 45를 못 찾는다 (오해 항목)
 *   4. 무작위 연산 60,000번(넣기·찾기·지우기)을 단순한 모형과 비교, 연산마다 불변식 검사
 *   5. 가득 찬 표에서 넣기 실패, 없는 키 찾기가 끝난다
 *   6. 카드 C1, C4의 답
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int b;          /* 버킷 수 */
    int n;          /* 들어 있는 키 수 */
    int *key;       /* key[i]: i번 버킷의 키 */
    char *used;     /* used[i]: i번 버킷이 차 있으면 1 */
} Table;

static int table_init(Table *t, int b)
{
    t->b = b;
    t->n = 0;
    t->key = malloc((size_t)b * sizeof(int));
    t->used = calloc((size_t)b, 1);
    if (t->key == NULL || t->used == NULL) {
        free(t->key);
        free(t->used);
        return 0;
    }
    return 1;
}

static void table_free(Table *t)
{
    free(t->key);
    free(t->used);
    t->key = NULL;
    t->used = NULL;
}

/* 키가 든 버킷 번호를 돌려준다. 없으면 -1.
 * 홈 버킷에서 시작해 오른쪽으로 한 칸씩 가고, 끝에 닿으면 0번으로 돌아온다.
 * 빈 버킷을 만나거나 한 바퀴를 다 돌면 없는 것이다. */
static int lp_find(const Table *t, int key)
{
    int home = key % t->b;
    int i = home;
    do {
        if (!t->used[i])
            return -1;
        if (t->key[i] == key)
            return i;
        i = (i + 1) % t->b;
    } while (i != home);
    return -1;
}

/* 넣는다. 넣었으면 1, 이미 있으면 0, 표가 가득 찼으면 -1. */
static int lp_insert(Table *t, int key)
{
    int home = key % t->b;
    int i = home;
    do {
        if (!t->used[i]) {
            t->key[i] = key;
            t->used[i] = 1;
            t->n++;
            return 1;
        }
        if (t->key[i] == key)
            return 0;
        i = (i + 1) % t->b;
    } while (i != home);
    return -1;
}

/* 옮겨진 키를 차례로 적어 두는 칸. 추적을 확인할 때만 쓴다. */
static int g_moved_n, g_moved[64];

/* 지운다. 지웠으면 1, 없으면 0.
 * 빈 자리(hole) 오른쪽의 뭉치를 훑으면서, 빈 자리로 옮겨도 되는 키를 당겨 온다.
 * j번 버킷의 키는 홈 버킷이 (hole, j] 구간(원형) 안에 있으면 옮기면 안 된다.
 * 옮기면 그 키가 자기 홈 버킷보다 앞에 놓여, 찾기가 닿지 못한다. */
static int lp_delete(Table *t, int key)
{
    int hole = lp_find(t, key);
    if (hole < 0)
        return 0;
    t->used[hole] = 0;
    t->n--;
    int j = hole;
    for (;;) {
        j = (j + 1) % t->b;
        if (!t->used[j])
            break;                    /* 뭉치가 끝났다. hole 자신으로 돌아온 경우도 여기서 끝난다 */
        int home = t->key[j] % t->b;
        int between = (hole < j) ? (hole < home && home <= j)
                                 : (home > hole || home <= j);
        if (!between) {
            t->key[hole] = t->key[j];
            t->used[hole] = 1;
            t->used[j] = 0;
            if (g_moved_n < 64)
                g_moved[g_moved_n++] = t->key[j];
            hole = j;
        }
    }
    return 1;
}

/* 틀린 지우기: 그 칸만 비운다. 오해 항목의 반례를 만들 때만 쓴다. */
static int lp_delete_wrong(Table *t, int key)
{
    int i = lp_find(t, key);
    if (i < 0)
        return 0;
    t->used[i] = 0;
    t->n--;
    return 1;
}

/* 불변식: 모든 키에 대해, 홈 버킷부터 지금 자리까지(원형) 빈 버킷이 없다. */
static int invariant_ok(const Table *t)
{
    int count = 0;
    for (int p = 0; p < t->b; p++) {
        if (!t->used[p])
            continue;
        count++;
        for (int i = t->key[p] % t->b; i != p; i = (i + 1) % t->b)
            if (!t->used[i])
                return 0;
    }
    return count == t->n;
}

static unsigned long long seed = 20261012ULL;
static unsigned int next_rand(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned int)(seed >> 33);
}

static int fail(const char *msg)
{
    printf("FAILED: %s\n", msg);
    return 1;
}

#define E (-1)   /* 기대하는 표에서 빈 버킷을 적는 표시 */

static int table_is(const Table *t, const int want[])
{
    for (int i = 0; i < t->b; i++) {
        if (want[i] == E) {
            if (t->used[i])
                return 0;
        } else if (!t->used[i] || t->key[i] != want[i]) {
            return 0;
        }
    }
    return 1;
}

static const int SLIDE_KEYS[12] = {6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45};

static int build_slide_table(Table *t)
{
    if (!table_init(t, 17))
        return 0;
    for (int i = 0; i < 12; i++)
        if (lp_insert(t, SLIDE_KEYS[i]) != 1)
            return 0;
    return 1;
}

int main(void)
{
    Table t;

    /* 1. 넣기 (p.21) */
    {
        const int want[17] = {34, 0, 45, E, E, E, 6, 23, 7, E, E, 28, 12, 29, 11, 30, 33};
        if (!build_slide_table(&t))
            return fail("표 만들기");
        if (!table_is(&t, want) || t.n != 12 || !invariant_ok(&t))
            return fail("넣기 표 (p.21)");
        /* 카드 C4: 45를 찾을 때 보는 버킷 수 = 11, 12, ..., 16, 0, 1, 2 -> 9개 */
        if (lp_find(&t, 45) != 2 || (2 - 45 % 17 + 17) % 17 + 1 != 9)
            return fail("카드 C4");
        if (lp_find(&t, 40) != -1 || lp_find(&t, 17) != -1)
            return fail("없는 키");
        if (lp_insert(&t, 29) != 0)
            return fail("같은 키를 두 번 넣기");
        table_free(&t);
    }

    /* 2. 지우기 세 개: 모두 처음 표에서 시작한다 (p.22~24) */
    {
        const int after0[17] = {34, 45, E, E, E, E, 6, 23, 7, E, E, 28, 12, 29, 11, 30, 33};
        const int after34[17] = {0, 45, E, E, E, E, 6, 23, 7, E, E, 28, 12, 29, 11, 30, 33};
        const int after29[17] = {34, 0, E, E, E, E, 6, 23, 7, E, E, 28, 12, 11, 30, 45, 33};

        if (!build_slide_table(&t))
            return fail("표 만들기");
        g_moved_n = 0;
        if (lp_delete(&t, 0) != 1 || !table_is(&t, after0) || !invariant_ok(&t))
            return fail("Delete(0) (p.22)");
        if (g_moved_n != 1 || g_moved[0] != 45)
            return fail("Delete(0)에서 옮긴 키: 45");
        table_free(&t);

        if (!build_slide_table(&t))
            return fail("표 만들기");
        g_moved_n = 0;
        if (lp_delete(&t, 34) != 1 || !table_is(&t, after34) || !invariant_ok(&t))
            return fail("Delete(34) (p.23)");
        if (g_moved_n != 2 || g_moved[0] != 0 || g_moved[1] != 45)
            return fail("Delete(34)에서 옮긴 키: 0, 45");
        table_free(&t);

        if (!build_slide_table(&t))
            return fail("표 만들기");
        g_moved_n = 0;
        if (lp_delete(&t, 29) != 1 || !table_is(&t, after29) || !invariant_ok(&t))
            return fail("Delete(29) (p.24)");
        if (g_moved_n != 3 || g_moved[0] != 11 || g_moved[1] != 30 || g_moved[2] != 45)
            return fail("Delete(29)에서 옮긴 키: 11, 30, 45");
        for (int i = 0; i < 12; i++)
            if (SLIDE_KEYS[i] != 29 && lp_find(&t, SLIDE_KEYS[i]) < 0)
                return fail("지운 뒤 남은 키를 못 찾는다");
        table_free(&t);
    }

    /* 카드 C1: 처음 표에서 12를 지운다 */
    {
        const int after12[17] = {34, 0, E, E, E, E, 6, 23, 7, E, E, 28, 29, 11, 30, 45, 33};
        if (!build_slide_table(&t))
            return fail("표 만들기");
        g_moved_n = 0;
        if (lp_delete(&t, 12) != 1 || !table_is(&t, after12) || !invariant_ok(&t))
            return fail("카드 C1");
        if (g_moved_n != 4 || g_moved[0] != 29 || g_moved[1] != 11 || g_moved[2] != 30 || g_moved[3] != 45)
            return fail("카드 C1에서 옮긴 키: 29, 11, 30, 45");
        table_free(&t);
    }

    /* 3. 틀린 지우기: 34의 칸만 비우면 0과 45를 못 찾는다 */
    {
        if (!build_slide_table(&t))
            return fail("표 만들기");
        lp_delete_wrong(&t, 34);
        if (lp_find(&t, 0) != -1 || lp_find(&t, 45) != -1)
            return fail("틀린 지우기의 반례");
        if (invariant_ok(&t))
            return fail("틀린 지우기 뒤에는 불변식이 깨져야 한다");
        if (!t.used[1] || t.key[1] != 0 || !t.used[2] || t.key[2] != 45)
            return fail("0과 45는 표 안에 그대로 있다");
        table_free(&t);
    }

    /* 4. 무작위 연산 60,000번을 모형(있다/없다 배열)과 비교 */
    {
        enum { KEYS = 200 };
        const int sizes[4] = {1, 7, 17, 64};
        for (int s = 0; s < 4; s++) {
            char present[KEYS];
            int model_n = 0;
            memset(present, 0, sizeof present);
            if (!table_init(&t, sizes[s]))
                return fail("표 만들기");
            for (int step = 0; step < 15000; step++) {
                int k = (int)(next_rand() % KEYS);
                int op = (int)(next_rand() % 3);
                if (op == 0) {
                    int r = lp_insert(&t, k);
                    int want = present[k] ? 0 : (model_n == t.b ? -1 : 1);
                    if (r != want)
                        return fail("넣기 결과가 모형과 다르다");
                    if (r == 1) {
                        present[k] = 1;
                        model_n++;
                    }
                } else if (op == 1) {
                    int r = lp_delete(&t, k);
                    if (r != present[k])
                        return fail("지우기 결과가 모형과 다르다");
                    if (r) {
                        present[k] = 0;
                        model_n--;
                    }
                } else if ((lp_find(&t, k) >= 0) != present[k]) {
                    return fail("찾기 결과가 모형과 다르다");
                }
                if (t.n != model_n || !invariant_ok(&t))
                    return fail("불변식이 깨졌다");
                if (step % 97 == 0)
                    for (int q = 0; q < KEYS; q++)
                        if ((lp_find(&t, q) >= 0) != present[q])
                            return fail("남은 키를 모두 찾지 못한다");
            }
            table_free(&t);
        }
    }

    /* 5. 가득 찬 표 */
    {
        if (!table_init(&t, 5))
            return fail("표 만들기");
        for (int k = 0; k < 5; k++)
            if (lp_insert(&t, 10 * k + 3) != 1)       /* 3, 13, 23, 33, 43: 홈 버킷이 모두 3 */
                return fail("가득 채우기");
        if (lp_insert(&t, 99) != -1 || lp_find(&t, 99) != -1)
            return fail("가득 찬 표에서 넣기와 찾기");
        if (lp_delete(&t, 3) != 1 || !invariant_ok(&t) || lp_find(&t, 43) < 0)
            return fail("가득 찬 표에서 지우기");
        table_free(&t);
    }

    printf("넣기 표와 Delete(0), Delete(34), Delete(29)가 슬라이드와 같음\n");
    printf("틀린 지우기: 34의 칸만 비우면 0과 45를 못 찾음\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
