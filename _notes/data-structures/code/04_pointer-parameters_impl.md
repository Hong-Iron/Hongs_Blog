---
layout: "note"
title: "04_pointer-parameters_impl.c"
display_title: "04_pointer-parameters_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "04"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/pointer-parameters/"
parent_title: "포인터 인자와 값 전달"
description: "자료구조 · 포인터 인자와 값 전달 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/04_pointer-parameters_impl/"
---
{% raw %}
[포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/) 문서의 구현 코드다.

```c
/* 포인터 인자와 값 전달: 값을 넘기는 swap은 못 바꾸고, 주소를 넘기는 swap은 바꾼다.
 *
 * 문서: 04.포인터 인자와 값 전달 (예시, 추적 표, 포인터를 바꾸는 함수, 카드)
 * 실행: cc -std=c11 -Wall -Wextra 04_pointer-parameters_impl.c -o ptr_params && ./ptr_params
 */
#include <stdio.h>

static int fails = 0;

#define CHECK(cond, msg)                                              \
    do {                                                              \
        if (!(cond)) {                                                \
            printf("[FAIL] %s (%d번째 줄)\n", (msg), __LINE__);        \
            fails++;                                                  \
        }                                                             \
    } while (0)

/* 값을 받는 판. x, y는 복사본이다 */
static void swap_by_value(int x, int y)
{
    int temp;
    temp = x;
    x = y;
    y = temp;
    (void)x;
    (void)y;                /* 복사본만 바뀌고 함수가 끝나면 사라진다 */
}

/* 주소를 받는 판. *px, *py는 부른 쪽의 칸이다 */
static void swap_by_pointer(int *px, int *py)
{
    int temp;
    temp = *px;
    *px = *py;
    *py = temp;
}

/* 추적 표용: 함수 안에서 본 값을 밖으로 내보내는 판 */
static void swap_by_value_traced(int x, int y, int seen[4])
{
    int temp;
    seen[0] = x; seen[1] = y;       /* 들어온 직후의 복사본 */
    temp = x;
    x = y;
    y = temp;
    seen[2] = x; seen[3] = y;       /* 바꾼 뒤의 복사본 */
}

/* 추적 표용: 주소를 받는 판을 한 줄 실행할 때마다 (temp, *px, *py)를 적는다 */
static void swap_by_pointer_traced(int *px, int *py, int rows[3][3])
{
    int temp;
    temp = *px;
    rows[0][0] = temp; rows[0][1] = *px; rows[0][2] = *py;
    *px = *py;
    rows[1][0] = temp; rows[1][1] = *px; rows[1][2] = *py;
    *py = temp;
    rows[2][0] = temp; rows[2][1] = *px; rows[2][2] = *py;
}

/* 돌려줄 값이 둘인 함수: 몫과 나머지 */
static void divide(int a, int b, int *quotient, int *remainder)
{
    *quotient = a / b;
    *remainder = a % b;
}

/* 포인터를 바꾸려는 함수 두 판 */
static void clear_wrong(int *p)
{
    p = NULL;               /* 주소의 복사본만 NULL이 된다 */
    (void)p;
}

static void clear_right(int **pp)
{
    *pp = NULL;             /* 부른 쪽 포인터 변수 자체를 고친다 */
}

static void point_to(int **pp, int *target)
{
    *pp = target;
}

/* 배열 인자: 첫 칸의 주소가 넘어온다 */
static void add_one_to_all(int a[], int n)
{
    int i;
    for (i = 0; i < n; i++)
        a[i] += 1;
}

/* 값으로 받는 판과 주소로 받는 판을 한 번 더 */
static void triple(int *p)
{
    *p = *p * 3;
}

static void triple_copy(int v)
{
    v = v * 3;
    (void)v;
}

static void rotate3(int *a, int *b, int *c)
{
    int t = *a;
    *a = *b;
    *b = *c;
    *c = t;
}

int main(void)
{
    /* 1. swap 두 판 */
    {
        int a = 3, b = 7;
        int seen[4];

        swap_by_value(a, b);
        CHECK(a == 3 && b == 7, "값을 넘긴 swap 뒤에도 a = 3, b = 7");

        swap_by_value_traced(a, b, seen);
        CHECK(seen[0] == 3 && seen[1] == 7 && seen[2] == 7 && seen[3] == 3, "함수 안의 복사본은 3, 7에서 7, 3으로 바뀐다");
        CHECK(a == 3 && b == 7, "그래도 부른 쪽은 그대로");

        swap_by_pointer(&a, &b);
        CHECK(a == 7 && b == 3, "주소를 넘긴 swap 뒤 a = 7, b = 3");

        swap_by_pointer(&a, &a);
        CHECK(a == 7, "같은 칸을 두 번 넘겨도 값은 그대로");

        {
            /* 문서의 추적 표: a = 3, b = 7에서 한 줄씩 */
            static const int want[3][3] = {{3, 3, 7}, {3, 7, 7}, {3, 7, 3}};
            int rows[3][3], c = 3, d = 7, i, j;
            swap_by_pointer_traced(&c, &d, rows);
            for (i = 0; i < 3; i++)
                for (j = 0; j < 3; j++)
                    CHECK(rows[i][j] == want[i][j], "추적 표: temp, a, b");
            CHECK(c == 7 && d == 3, "추적 표의 끝: a = 7, b = 3");
        }
        printf("[OK] swap: 값을 넘기면 3 7 그대로, 주소를 넘기면 7 3\n");
    }

    /* 2. 돌려줄 값이 둘 */
    {
        int q = 0, r = 0;
        divide(17, 5, &q, &r);
        CHECK(q == 3 && r == 2, "17 / 5 = 3, 17 % 5 = 2");
        printf("[OK] divide(17, 5, &q, &r): q = %d, r = %d\n", q, r);
    }

    /* 3. 포인터 자체를 바꾸려면 포인터의 주소를 넘긴다 */
    {
        int n = 5, m = 9;
        int *p = &n;

        clear_wrong(p);
        CHECK(p == &n, "카드 C3: clear_wrong(p) 뒤에도 p는 n을 가리킨다");

        point_to(&p, &m);
        CHECK(p == &m && *p == 9, "point_to(&p, &m) 뒤 p는 m을 가리킨다");

        clear_right(&p);
        CHECK(p == NULL, "카드 C3: clear_right(&p) 뒤 p는 NULL");
        CHECK(n == 5 && m == 9, "가리키던 값들은 그대로");
        printf("[OK] 포인터를 바꾸는 함수(카드 C3): int * 로 받으면 못 바꾸고, int ** 로 받으면 바꾼다\n");
    }

    /* 4. 배열 인자 */
    {
        int arr[4] = {10, 20, 30, 40};
        add_one_to_all(arr, 4);
        CHECK(arr[0] == 11 && arr[1] == 21 && arr[2] == 31 && arr[3] == 41, "배열을 넘기면 함수가 부른 쪽 배열을 고친다");
        add_one_to_all(&arr[2], 2);
        CHECK(arr[0] == 11 && arr[1] == 21 && arr[2] == 32 && arr[3] == 42, "가운데 칸의 주소를 넘기면 거기서부터 고친다");
        printf("[OK] 배열 인자: 첫 칸의 주소가 넘어가므로 원본이 바뀐다\n");
    }

    /* 5. 카드 */
    {
        int a = 1, b = 2;                 /* C1 */
        int x = 4, y = 4;
        int u = 1, v = 2, w = 3;

        swap_by_value(a, b);
        CHECK(a == 1 && b == 2, "C1: 첫 줄 출력 1 2");
        swap_by_pointer(&a, &b);
        CHECK(a == 2 && b == 1, "C1: 둘째 줄 출력 2 1");

        triple_copy(x);
        triple(&y);
        CHECK(x == 4 && y == 12, "triple_copy(x)는 x를 그대로 두고 triple(&y)는 y를 12로 만든다");

        rotate3(&u, &v, &w);
        CHECK(u == 2 && v == 3 && w == 1, "rotate3: 1 2 3 -> 2 3 1");
        printf("[OK] 카드 C1의 답 (1 2, 2 1)과 값·주소로 받는 함수의 차이\n");
    }

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
