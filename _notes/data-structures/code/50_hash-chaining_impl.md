---
layout: "note"
title: "50_hash-chaining_impl.c"
display_title: "50_hash-chaining_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "50"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/hash-chaining/"
parent_title: "체이닝"
description: "자료구조 · 체이닝 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/50_hash-chaining_impl/"
---
{% raw %}
[체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/) 문서의 구현 코드다.

```c
/* 체이닝 해시 테이블(정렬된 체인): 찾기, 넣기, 지우기. 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 50_hash-chaining_impl.c -o chaining && ./chaining
 * 문서: 50.체이닝 (정렬된 체인 그림, 카드 C1~C3)
 * 출처: 자료구조 15주차 슬라이드 p.30~31. 슬라이드에는 그림만 있어 코드는 그림대로 짠 것이다.
 * 키는 0 이상인 정수, 홈 버킷은 key % b. 버킷마다 키가 작은 것부터 늘어선 체인을 단다.
 *
 * 확인하는 것
 *   1. 6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45를 b = 17에 넣은 체인 (p.31)
 *   2. 넣는 차례를 거꾸로 해도 체인이 같다(정렬된 체인이라서).
 *   3. 찾을 때 본 노드 수: 있는 키 12개의 평균 1.5. 없는 키는 자기보다 큰 노드를 만나면 멈춘다.
 *   4. 무작위 연산 60,000번을 단순한 모형과 비교, 체인마다 오름차순인지 검사.
 *   5. 잡은 노드를 모두 풀어 준다(ASan이 누수를 잡는다).
 *   6. 카드 C1의 답.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct node {
    int key;
    struct node *link;      /* 같은 버킷의 다음 노드. 없으면 NULL */
} Node;

typedef struct {
    int b;                  /* 버킷 수 */
    int n;                  /* 들어 있는 키 수 */
    Node **bucket;          /* bucket[i]: i번 버킷에 달린 체인의 첫 노드 */
} ChainTable;

static int g_examined;      /* 마지막 찾기에서 본 노드 수 (테스트에서 읽는다) */

static int chain_init(ChainTable *t, int b)
{
    t->b = b;
    t->n = 0;
    t->bucket = calloc((size_t)b, sizeof(Node *));    /* 모든 체인이 NULL(빈 체인)로 시작한다 */
    return t->bucket != NULL;
}

/* 있으면 1, 없으면 0. 체인이 오름차순이라 찾는 키보다 큰 노드를 만나면 바로 멈춘다. */
static int chain_find(const ChainTable *t, int key)
{
    g_examined = 0;
    for (const Node *p = t->bucket[key % t->b]; p != NULL; p = p->link) {
        g_examined++;
        if (p->key == key)
            return 1;
        if (p->key > key)
            return 0;
    }
    return 0;
}

/* 넣었으면 1, 이미 있으면 0, 메모리를 못 잡았으면 -1.
 * pp는 "고칠 link 칸"을 가리킨다. 처음에는 버킷 칸 자체를 가리킨다. */
static int chain_insert(ChainTable *t, int key)
{
    Node **pp = &t->bucket[key % t->b];
    while (*pp != NULL && (*pp)->key < key)
        pp = &(*pp)->link;
    if (*pp != NULL && (*pp)->key == key)
        return 0;
    Node *fresh = malloc(sizeof(Node));
    if (fresh == NULL)
        return -1;
    fresh->key = key;
    fresh->link = *pp;      /* 새 노드가 뒤 노드를 먼저 가리키고 */
    *pp = fresh;            /* 앞 칸이 새 노드를 가리킨다 */
    t->n++;
    return 1;
}

/* 지웠으면 1, 없으면 0. */
static int chain_delete(ChainTable *t, int key)
{
    Node **pp = &t->bucket[key % t->b];
    while (*pp != NULL && (*pp)->key < key)
        pp = &(*pp)->link;
    if (*pp == NULL || (*pp)->key != key)
        return 0;
    Node *gone = *pp;
    *pp = gone->link;       /* 앞 칸이 지울 노드를 건너뛰게 한 뒤 */
    free(gone);             /* 풀어 준다 */
    t->n--;
    return 1;
}

static void chain_free(ChainTable *t)
{
    for (int i = 0; i < t->b; i++) {
        Node *p = t->bucket[i];
        while (p != NULL) {
            Node *next = p->link;
            free(p);
            p = next;
        }
    }
    free(t->bucket);
    t->bucket = NULL;
    t->n = 0;
}

/* i번 버킷의 체인을 out에 옮겨 적고 길이를 돌려준다. */
static int chain_to_array(const ChainTable *t, int i, int out[], int cap)
{
    int len = 0;
    for (const Node *p = t->bucket[i]; p != NULL && len < cap; p = p->link)
        out[len++] = p->key;
    return len;
}

/* 불변식: 체인의 키는 모두 그 버킷이 홈 버킷이고, 작은 것부터 늘어서 있고, 겹치지 않는다. */
static int invariant_ok(const ChainTable *t)
{
    int count = 0;
    for (int i = 0; i < t->b; i++) {
        for (const Node *p = t->bucket[i]; p != NULL; p = p->link) {
            count++;
            if (p->key % t->b != i)
                return 0;
            if (p->link != NULL && p->link->key <= p->key)
                return 0;
        }
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

static const int SLIDE_KEYS[12] = {6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45};

/* 슬라이드 p.31의 체인. 길이 0은 빈 체인. */
static const int WANT_LEN[17] = {2, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 3, 2, 1, 0, 0, 1};
static const int WANT[17][3] = {
    {0, 34}, {0}, {0}, {0}, {0}, {0}, {6, 23}, {7}, {0}, {0}, {0}, {11, 28, 45}, {12, 29}, {30}, {0}, {0}, {33},
};

static int is_slide_table(const ChainTable *t)
{
    for (int i = 0; i < 17; i++) {
        int got[8];
        int len = chain_to_array(t, i, got, 8);
        if (len != WANT_LEN[i])
            return 0;
        for (int k = 0; k < len; k++)
            if (got[k] != WANT[i][k])
                return 0;
    }
    return 1;
}

int main(void)
{
    ChainTable t;

    /* 1. 슬라이드의 체인 (p.31) */
    if (!chain_init(&t, 17))
        return fail("표 만들기");
    for (int i = 0; i < 12; i++)
        if (chain_insert(&t, SLIDE_KEYS[i]) != 1)
            return fail("넣기");
    if (!is_slide_table(&t) || !invariant_ok(&t) || t.n != 12)
        return fail("정렬된 체인 (p.31)");
    if (chain_insert(&t, 28) != 0)
        return fail("같은 키를 두 번 넣기");

    /* 3. 찾을 때 본 노드 수 */
    {
        int total = 0;
        for (int i = 0; i < 12; i++) {
            if (!chain_find(&t, SLIDE_KEYS[i]))
                return fail("있는 키를 못 찾는다");
            total += g_examined;
        }
        if (total != 18)                          /* 평균 18 / 12 = 1.5 */
            return fail("있는 키 12개를 찾을 때 본 노드 수의 합 18");
        /* 40 % 17 = 6. 체인 6 -> 23을 끝까지 본다(둘 다 40보다 작다): 2개 */
        if (chain_find(&t, 40) || g_examined != 2)
            return fail("없는 키 40: 2개를 보고 끝");
        /* 17 % 17 = 0. 체인 0 -> 34에서 34가 17보다 커서 멈춘다: 2개 */
        if (chain_find(&t, 17) || g_examined != 2)
            return fail("없는 키 17: 0, 34를 보고 멈춤");
        /* 62 % 17 = 11. 체인 11 -> 28 -> 45를 끝까지 본다: 3개 */
        if (chain_find(&t, 62) || g_examined != 3)
            return fail("없는 키 62: 3개");
        /* 카드 C1의 (b): 22 % 17 = 5. 빈 체인이라 0개 */
        if (chain_find(&t, 22) || g_examined != 0)
            return fail("없는 키 22: 빈 체인");
    }

    /* 6. 카드 C1: 28을 지우고 62를 넣은 뒤 11번 버킷의 체인은 11 -> 45 -> 62 */
    {
        int got[8];
        if (chain_delete(&t, 28) != 1 || chain_insert(&t, 62) != 1)
            return fail("카드 C1 연산");
        int len = chain_to_array(&t, 11, got, 8);
        if (len != 3 || got[0] != 11 || got[1] != 45 || got[2] != 62 || !invariant_ok(&t))
            return fail("카드 C1");
        if (chain_delete(&t, 28) != 0)
            return fail("없는 키 지우기");
        /* 이제 없는 28을 찾으면 11, 45 두 개만 보고 멈춘다(62는 보지 않는다) */
        if (chain_find(&t, 28) || g_examined != 2)
            return fail("없는 키 28: 45에서 멈춤");
    }
    chain_free(&t);

    /* 2. 거꾸로 넣어도 같은 체인 */
    if (!chain_init(&t, 17))
        return fail("표 만들기");
    for (int i = 11; i >= 0; i--)
        if (chain_insert(&t, SLIDE_KEYS[i]) != 1)
            return fail("넣기");
    if (!is_slide_table(&t))
        return fail("거꾸로 넣은 체인");
    chain_free(&t);

    /* 4. 무작위 연산 60,000번을 모형(있다/없다 배열)과 비교 */
    {
        enum { KEYS = 300 };
        const int sizes[4] = {1, 7, 17, 64};
        for (int s = 0; s < 4; s++) {
            char present[KEYS];
            int model_n = 0;
            memset(present, 0, sizeof present);
            if (!chain_init(&t, sizes[s]))
                return fail("표 만들기");
            for (int step = 0; step < 15000; step++) {
                int k = (int)(next_rand() % KEYS);
                int op = (int)(next_rand() % 3);
                if (op == 0) {
                    int r = chain_insert(&t, k);
                    if (r < 0)
                        return fail("malloc");
                    if (r != !present[k])
                        return fail("넣기 결과가 모형과 다르다");
                    model_n += r;
                    present[k] = 1;
                } else if (op == 1) {
                    int r = chain_delete(&t, k);
                    if (r != present[k])
                        return fail("지우기 결과가 모형과 다르다");
                    model_n -= r;
                    present[k] = 0;
                } else if (chain_find(&t, k) != present[k]) {
                    return fail("찾기 결과가 모형과 다르다");
                }
                if (t.n != model_n)
                    return fail("키 수가 모형과 다르다");
                if (step % 50 == 0 && !invariant_ok(&t))
                    return fail("불변식이 깨졌다");
            }
            chain_free(&t);
        }
    }

    printf("정렬된 체인이 슬라이드 p.31과 같음 (있는 키 12개를 찾을 때 본 노드 수 평균 1.5)\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
