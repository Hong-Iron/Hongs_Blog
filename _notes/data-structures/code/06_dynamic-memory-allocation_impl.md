---
layout: "note"
title: "06_dynamic-memory-allocation_impl.c"
display_title: "06_dynamic-memory-allocation_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "06"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/dynamic-memory-allocation/"
parent_title: "동적 메모리 할당"
description: "자료구조 · 동적 메모리 할당 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/06_dynamic-memory-allocation_impl/"
---
{% raw %}
[동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/) 문서의 구현 코드다.

```c
/* 동적 메모리 할당: calloc, malloc, realloc, free와 누수.
 *
 * 문서: 06.동적 메모리 할당 (예시, 네 함수, 누수, 카드)
 * 출처: 자료구조 2주차 슬라이드 p.36~43
 * 실행: cc -std=c11 -Wall -Wextra 06_dynamic-memory-allocation_impl.c -o dyn_mem && ./dyn_mem
 *
 * 받은 덩어리와 돌려준 덩어리를 세는 감싸개(counted_...)를 쓴다.
 * 프로그램이 끝날 때 "받은 횟수 == 돌려준 횟수"이고 살아 있는 덩어리가 0개인지 확인한다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int fails = 0;

#define CHECK(cond, msg)                                              \
    do {                                                              \
        if (!(cond)) {                                                \
            printf("[FAIL] %s (%d번째 줄)\n", (msg), __LINE__);        \
            fails++;                                                  \
        }                                                             \
    } while (0)

/* ---------- 세는 감싸개 ---------- */
#define MAX_LIVE 64
static void *live[MAX_LIVE];        /* 아직 돌려주지 않은 덩어리의 시작 주소 */
static int live_count = 0;
static int total_allocs = 0;        /* 새 덩어리를 받은 횟수 */
static int total_frees = 0;         /* 덩어리를 돌려준 횟수 */

static void remember(void *p)
{
    if (live_count >= MAX_LIVE) {
        fprintf(stderr, "장부가 가득 찼다\n");
        exit(EXIT_FAILURE);
    }
    live[live_count++] = p;
    total_allocs++;
}

static void forget(void *p)
{
    int i;
    for (i = 0; i < live_count; i++) {
        if (live[i] == p) {
            live[i] = live[--live_count];
            total_frees++;
            return;
        }
    }
    fprintf(stderr, "받은 적 없는 주소를 돌려주려 했다\n");
    exit(EXIT_FAILURE);
}

static void *counted_malloc(size_t size)
{
    void *p = malloc(size);
    if (p == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(EXIT_FAILURE);
    }
    remember(p);
    return p;
}

static void *counted_calloc(size_t num, size_t esize)
{
    void *p = calloc(num, esize);
    if (p == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(EXIT_FAILURE);
    }
    remember(p);
    return p;
}

/* realloc은 옛 덩어리를 돌려주고 새 덩어리를 받는 것으로 센다 */
static void *counted_realloc(void *old, size_t size)
{
    void *p;
    if (old != NULL)
        forget(old);            /* 장부에서 먼저 지운다. 이 뒤로 old의 주소 값은 쓰지 않는다 */
    p = realloc(old, size);
    if (p == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(EXIT_FAILURE);
    }
    remember(p);
    return p;
}

static void counted_free(void *p)
{
    if (p == NULL)
        return;
    forget(p);
    free(p);
}

/* ---------- 1. 예시: 개수를 실행 중에 알게 되는 수들의 평균과 분산 ---------- */
static void mean_and_variance(const double *input, int n, double *mean, double *variance)
{
    double *nums = counted_calloc((size_t)n, sizeof *nums);   /* n은 실행 중에 정해진다 */
    double sum = 0.0, sq = 0.0;
    int i;

    for (i = 0; i < n; i++)
        nums[i] = input[i];             /* 수를 배열에 읽어 넣는다 */
    for (i = 0; i < n; i++)
        sum += nums[i];
    *mean = sum / n;                    /* 평균: 모든 수를 한 번 본다 */
    for (i = 0; i < n; i++)
        sq += (nums[i] - *mean) * (nums[i] - *mean);
    *variance = sq / n;                 /* 분산: 평균을 알아야 구한다 */

    counted_free(nums);                 /* 다 썼으면 돌려준다 */
}

/* ---------- 2. 누수: 슬라이드 p.41의 함수 problem ---------- */
static void problem(int n)
{
    float *nums = counted_calloc((size_t)n, sizeof *nums);
    nums[0] = 1.0f;
    /* free(nums)가 없다. 함수가 끝나면 변수 nums는 사라지고 덩어리만 남는다 */
}

static void no_problem(int n)
{
    float *nums = counted_calloc((size_t)n, sizeof *nums);
    nums[0] = 1.0f;
    counted_free(nums);
}

static int all_zero(const void *p, size_t bytes)
{
    const unsigned char *b = p;
    size_t i;
    for (i = 0; i < bytes; i++)
        if (b[i] != 0)
            return 0;
    return 1;
}

int main(void)
{
    /* 1. 평균과 분산 */
    {
        const double data[8] = {2, 4, 4, 4, 5, 5, 7, 9};
        double m = 0, v = 0;
        int before = live_count;

        mean_and_variance(data, 8, &m, &v);
        CHECK(m == 5.0 && v == 4.0, "2 4 4 4 5 5 7 9의 평균 5, 분산 4");
        mean_and_variance(data, 3, &m, &v);
        CHECK(m == 10.0 / 3.0, "앞의 세 개만 읽으면 평균 10/3");
        CHECK(live_count == before, "함수가 받은 덩어리를 모두 돌려줬다");
        printf("[OK] 예시: 개수 n을 실행 중에 받아 n칸만 잡는다 (평균 5, 분산 4)\n");
    }

    /* 2. calloc은 0으로 채운다 */
    {
        size_t n;
        int ok = 1;
        for (n = 1; n <= 200; n++) {
            float *c = counted_calloc(n, sizeof *c);
            size_t i;
            if (!all_zero(c, n * sizeof *c))
                ok = 0;
            for (i = 0; i < n; i++)
                if (c[i] != 0.0f)
                    ok = 0;
            memset(c, 0xAB, n * sizeof *c);     /* 더럽혀 놓고 돌려준다. 다음 calloc이 이 자리를 다시 받아도 0이어야 한다 */
            counted_free(c);
        }
        CHECK(ok, "calloc이 준 자리는 n = 1..200에서 모든 바이트가 0");
        printf("[OK] calloc(n, sizeof(float)): n = 1..200에서 모든 바이트가 0\n");
    }

    /* 3. malloc(N * sizeof(float))과 calloc(N, sizeof(float)): 크기는 같고 처음 내용이 다르다 */
    {
        size_t N = 64, i, nonzero = 0;
        float *m = counted_malloc(N * sizeof(float));
        float *c = counted_calloc(N, sizeof(float));
        const unsigned char *raw = (const unsigned char *)m;

        for (i = 0; i < N * sizeof(float); i++)
            if (raw[i] != 0)
                nonzero++;                      /* malloc이 준 자리의 처음 내용은 정해져 있지 않다. 세기만 하고 믿지 않는다 */
        CHECK(all_zero(c, N * sizeof(float)), "calloc 쪽은 0");
        for (i = 0; i < N; i++)
            m[i] = (float)i;                    /* malloc 쪽은 쓰기 전에 직접 채운다 */
        CHECK(m[63] == 63.0f && c[63] == 0.0f, "둘 다 N칸을 쓸 수 있다");
        printf("[OK] malloc과 calloc: 둘 다 %zu바이트. calloc은 모두 0, malloc은 이번 실행에서 0이 아닌 바이트 %zu개\n",
               N * sizeof(float), nonzero);
        counted_free(m);
        counted_free(c);
    }

    /* 4. realloc: 앞부분은 그대로 옮겨진다. 돌려받은 주소를 써야 한다 */
    {
        int *p = counted_malloc(4 * sizeof *p);
        int i, kept = 1;

        for (i = 0; i < 4; i++)
            p[i] = 10 * (i + 1);                /* 10 20 30 40 */

        p = counted_realloc(p, 8 * sizeof *p);  /* 4칸 -> 8칸 */
        for (i = 0; i < 4; i++)
            if (p[i] != 10 * (i + 1))
                kept = 0;
        CHECK(kept, "늘린 뒤에도 앞의 4칸은 10 20 30 40");
        for (i = 4; i < 8; i++)
            p[i] = 10 * (i + 1);                /* 새로 생긴 칸은 직접 채운다 */
        CHECK(p[7] == 80, "새 칸을 쓸 수 있다");

        p = counted_realloc(p, 2 * sizeof *p);  /* 8칸 -> 2칸 */
        CHECK(p[0] == 10 && p[1] == 20, "줄인 뒤에는 앞의 2칸만 남는다");
        counted_free(p);
        printf("[OK] realloc: 4칸 -> 8칸 -> 2칸, 남는 범위의 내용은 그대로\n");
    }

    /* 5. realloc(NULL, size)는 malloc(size)처럼 일한다 */
    {
        int *p = counted_realloc(NULL, 3 * sizeof *p);
        p[0] = 1; p[1] = 2; p[2] = 3;
        CHECK(p[0] + p[1] + p[2] == 6, "realloc(NULL, ...)으로 받은 자리");
        counted_free(p);
        counted_free(NULL);                     /* free(NULL)은 아무 일도 하지 않는다 */
    }

    /* 6. 누수 */
    {
        int live_before = live_count, allocs_before = total_allocs, frees_before = total_frees;

        no_problem(100);
        CHECK(live_count == live_before, "free가 있는 함수: 남은 덩어리 없음");

        problem(100);
        problem(100);
        problem(100);
        CHECK(live_count == live_before + 3, "free가 없는 함수를 세 번 부르면 덩어리 3개가 남는다");
        CHECK(total_allocs - allocs_before == 4 && total_frees - frees_before == 1, "받기 4번, 돌려주기 1번");
        printf("[OK] 누수: problem(100)을 세 번 부른 뒤 받기 %d번, 돌려주기 %d번, 남은 덩어리 %d개(%zu바이트)\n",
               total_allocs - allocs_before, total_frees - frees_before, live_count - live_before,
               3 * 100 * sizeof(float));

        /* 실제 프로그램에서는 이 주소를 아는 변수가 없어 돌려줄 방법이 없다.
           여기서는 감싸개가 장부에 적어 둔 주소로 찾아서 돌려준다. */
        while (live_count > live_before)
            counted_free(live[live_count - 1]);
    }

    /* 끝: 받은 것을 모두 돌려줬는가 */
    CHECK(live_count == 0 && total_allocs == total_frees, "받은 횟수와 돌려준 횟수가 같다");
    printf("[OK] 전체: 받기 %d번, 돌려주기 %d번, 남은 덩어리 %d개\n", total_allocs, total_frees, live_count);

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
