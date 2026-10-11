---
layout: "note"
title: "08_array-doubling_impl.c"
display_title: "08_array-doubling_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "08"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/array-doubling/"
parent_title: "배열 두 배 늘리기"
description: "자료구조 · 배열 두 배 늘리기 구현 코드"
permalink: "/studies/data-structures/code/08_array-doubling_impl/"
---
{% raw %}
[배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/) 문서의 구현 코드다.

```c
/* 배열 두 배 늘리기: 꽉 차면 realloc으로 용량을 두 배로 늘리는 스택.
 *
 * 문서: 08.배열 두 배 늘리기 (예시 표, 코드, 복잡도, 카드)
 * 출처: 자료구조 3주차 슬라이드 p.14, p.52~54
 * 실행: cc -std=c11 -Wall -Wextra 08_array-doubling_impl.c -o array_doubling && ./array_doubling
 *
 * "옮겨 담은 수"는 용량을 늘리는 순간 이미 들어 있던 원소의 수다.
 * realloc이 새 자리를 잡으면 그만큼을 새 자리로 베껴야 하기 때문이다.
 */
#include <stdio.h>
#include <stdlib.h>

static int fails = 0;

#define CHECK(cond, msg)                                              \
    do {                                                              \
        if (!(cond)) {                                                \
            printf("[FAIL] %s (%d번째 줄)\n", (msg), __LINE__);        \
            fails++;                                                  \
        }                                                             \
    } while (0)

static long blocks_taken = 0;       /* 처음 malloc으로 받은 횟수 */
static long blocks_returned = 0;    /* free로 돌려준 횟수 */

typedef struct {
    int *data;          /* 원소가 든 배열 */
    int capacity;       /* 지금 배열의 칸 수 */
    int top;            /* 맨 위 원소의 칸 번호. 비었으면 -1 */
    long moved;         /* 지금까지 옮겨 담은 원소 수 */
    int grows;          /* 용량을 늘린 횟수 */
    int step;           /* 0이면 두 배로, 양수면 그만큼씩 늘린다 */
} Stack;

static void stack_init(Stack *s, int capacity, int step)
{
    s->data = malloc((size_t)capacity * sizeof *s->data);
    if (s->data == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(EXIT_FAILURE);
    }
    blocks_taken++;
    s->capacity = capacity;
    s->top = -1;
    s->moved = 0;
    s->grows = 0;
    s->step = step;
}

static void stack_free(Stack *s)
{
    free(s->data);
    blocks_returned++;
    s->data = NULL;
    s->capacity = 0;
    s->top = -1;
}

/* 슬라이드 p.53의 StackFull(): 가득 찼을 때 부른다 */
static void stack_full(Stack *s)
{
    int new_capacity = s->step == 0 ? 2 * s->capacity : s->capacity + s->step;
    int *bigger = realloc(s->data, (size_t)new_capacity * sizeof *s->data);

    if (bigger == NULL) {               /* 실패하면 옛 배열은 그대로 남아 있다 */
        fprintf(stderr, "메모리가 모자란다\n");
        free(s->data);
        exit(EXIT_FAILURE);
    }
    s->moved += s->top + 1;             /* 들어 있던 원소를 모두 새 자리로 옮긴 것으로 센다 */
    s->grows++;
    s->data = bigger;                   /* 주소가 바뀌었을 수 있으니 돌려받은 주소를 쓴다 */
    s->capacity = new_capacity;
}

static void push(Stack *s, int item)
{
    if (s->top >= s->capacity - 1)
        stack_full(s);
    s->data[++s->top] = item;
}

static int pop(Stack *s)
{
    if (s->top == -1) {
        fprintf(stderr, "빈 스택에서 꺼내려 했다\n");
        exit(EXIT_FAILURE);
    }
    return s->data[s->top--];
}

static int smallest_power_of_two_at_least(int n)
{
    int c = 1;
    while (c < n)
        c *= 2;
    return c;
}

int main(void)
{
    /* 1. 문서의 예시 표: 용량 1에서 시작해 9번 넣는다 */
    {
        static const int want_capacity[9] = {1, 2, 4, 4, 8, 8, 8, 8, 16};
        static const int want_moved_now[9] = {0, 1, 2, 0, 4, 0, 0, 0, 8};
        static const long want_moved_total[9] = {0, 1, 3, 3, 7, 7, 7, 7, 15};
        Stack s;
        int i;

        stack_init(&s, 1, 0);
        for (i = 0; i < 9; i++) {
            long before = s.moved;
            push(&s, 100 + i);
            CHECK(s.capacity == want_capacity[i], "예시 표: 용량");
            CHECK(s.moved - before == want_moved_now[i], "예시 표: 이번에 옮긴 수");
            CHECK(s.moved == want_moved_total[i], "예시 표: 옮긴 수의 합");
        }
        CHECK(s.grows == 4 && s.moved == 15 && s.moved < 2 * 9, "9번 넣는 동안 4번 늘리고 15개를 옮긴다. 15 < 18");
        for (i = 8; i >= 0; i--)
            CHECK(pop(&s) == 100 + i, "늘린 뒤에도 넣은 순서의 거꾸로 나온다");
        CHECK(s.top == -1, "다 꺼내면 빈다");
        stack_free(&s);
        printf("[OK] 예시: 9번 넣으면 용량 1 -> 2 -> 4 -> 8 -> 16, 옮긴 수 1 + 2 + 4 + 8 = 15\n");
    }

    /* 2. 한 번에 길게: 100,000번 넣는 동안 매번 확인한다 */
    {
        Stack s;
        int n, ok_capacity = 1, ok_moved = 1, ok_bound = 1, ok_slide = 1;
        long worst_times_1000 = 0;

        stack_init(&s, 1, 0);
        for (n = 1; n <= 100000; n++) {
            int cap;
            push(&s, n);
            cap = smallest_power_of_two_at_least(n);
            if (s.capacity != cap) ok_capacity = 0;         /* 용량은 n 이상인 가장 작은 2의 거듭제곱 */
            if (s.moved != cap - 1) ok_moved = 0;           /* 옮긴 수 = 1 + 2 + ... + 용량/2 = 용량 - 1 */
            if (!(s.moved < 2L * n)) ok_bound = 0;          /* 옮긴 수 < 2n */
            if (n >= 2 && !(n >= cap / 2 + 1)) ok_slide = 0; /* p.54: 넣은 횟수 >= 2^(k-1) + 1 */
            if (s.moved * 1000 / n > worst_times_1000) worst_times_1000 = s.moved * 1000 / n;
        }
        CHECK(ok_capacity, "용량 = n 이상인 가장 작은 2의 거듭제곱");
        CHECK(ok_moved, "옮긴 수 = 용량 - 1");
        CHECK(ok_bound, "옮긴 수 < 2n");
        CHECK(ok_slide, "용량이 2^k이면 넣은 횟수는 2^(k-1) + 1 이상");
        CHECK(s.capacity == 131072 && s.moved == 131071 && s.grows == 17, "100,000번: 용량 131,072, 옮긴 수 131,071, 늘린 횟수 17");
        for (n = 100000; n >= 1; n--)
            if (pop(&s) != n) { CHECK(0, "100,000개가 거꾸로 나온다"); break; }
        stack_free(&s);
        printf("[OK] 두 배씩: n = 1..100,000 내내 옮긴 수 < 2n (가장 나쁠 때 n의 %.3f배), 끝에는 131,071개\n",
               (double)worst_times_1000 / 1000.0);
    }

    /* 3. 한 칸씩 늘리면: 옮긴 수 = 0 + 1 + ... + (n-1) = n(n-1)/2 */
    {
        Stack s;
        int n, ok = 1;

        stack_init(&s, 1, 1);
        for (n = 1; n <= 2000; n++) {
            push(&s, n);
            if (s.capacity != n || s.moved != (long)n * (n - 1) / 2) ok = 0;
        }
        CHECK(ok, "한 칸씩: 옮긴 수 = n(n-1)/2");
        CHECK(s.moved == 1999000 && s.grows == 1999, "2,000번: 옮긴 수 1,999,000, 늘린 횟수 1,999");
        stack_free(&s);
        printf("[OK] 한 칸씩: n = 2,000이면 옮긴 수 1,999,000 (두 배씩이면 2,047)\n");
    }

    /* 4. 열 칸씩 늘려도 제곱으로 는다 */
    {
        Stack s;
        int n;

        stack_init(&s, 10, 10);
        for (n = 1; n <= 2000; n++)
            push(&s, n);
        /* 10, 20, ..., 1990개가 든 순간에 늘린다: 10 x (1 + 2 + ... + 199) = 199,000 */
        CHECK(s.capacity == 2000 && s.grows == 199 && s.moved == 199000, "열 칸씩 2,000번: 옮긴 수 199,000");
        stack_free(&s);
        printf("[OK] 열 칸씩: n = 2,000이면 옮긴 수 199,000\n");
    }

    /* 5. 슬라이드 p.14: 기본 용량 10에서 시작해 두 배씩 */
    {
        Stack s;
        int n;

        stack_init(&s, 10, 0);
        for (n = 1; n <= 100; n++)
            push(&s, n);
        CHECK(s.capacity == 160 && s.grows == 4 && s.moved == 10 + 20 + 40 + 80, "용량 10에서 100번: 10 -> 20 -> 40 -> 80 -> 160");
        stack_free(&s);
        printf("[OK] 용량 10에서 시작: 100번 넣으면 용량 160, 옮긴 수 150\n");
    }

    /* 6. 카드 C1: 용량 1에서 6번 */
    {
        Stack s;
        int n;

        stack_init(&s, 1, 0);
        for (n = 1; n <= 6; n++)
            push(&s, n);
        CHECK(s.capacity == 8 && s.moved == 7 && s.grows == 3, "C1: 용량 8, 옮긴 수 7, 늘린 횟수 3");
        stack_free(&s);
        printf("[OK] 카드 C1: 6번 넣으면 용량 8, 옮긴 수 1 + 2 + 4 = 7\n");
    }

    CHECK(blocks_taken == blocks_returned, "받은 배열을 모두 돌려줬다");
    printf("[OK] 받은 배열 %ld개, 돌려준 배열 %ld개\n", blocks_taken, blocks_returned);

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
