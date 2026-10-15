---
layout: "note"
title: "05_pointer-address-practice_p4.c"
display_title: "05_pointer-address-practice_p4.c"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "05"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/pointer-address-practice/"
parent_title: "포인터와 주소 계산 연습"
description: "자료구조 · 포인터와 주소 계산 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/05_pointer-address-practice_p4/"
---
{% raw %}
[포인터와 주소 계산 연습](/Hongs_Blog/studies/data-structures/pointer-address-practice/) 문서의 문제 4 풀이 코드다.

```c
/* 포인터와 주소 계산 연습: 문제 p1~p4의 답을 실제로 돌려 확인한다.
 *
 * 문서: 4.연습문제/05.포인터와 주소 계산 연습
 * 실행: cc -std=c11 -Wall -Wextra 05_pointer-address-practice_p4.c -o ptr_practice && ./ptr_practice
 */
#include <stdint.h>
#include <stdio.h>
#include <string.h>

static int fails = 0;

#define CHECK(cond, msg)                                              \
    do {                                                              \
        if (!(cond)) {                                                \
            printf("[FAIL] %s (%d번째 줄)\n", (msg), __LINE__);        \
            fails++;                                                  \
        }                                                             \
    } while (0)

/* p3 */
static void f(int x, int *y)
{
    x = x + 1;
    *y = *y + x;
}

/* p3 변형 */
static void g(int *x, int *y)
{
    *x = *x + 1;
    *y = *y + *x;
}

/* p4: 포인터로 쓴 길이 세기 */
static int length(const char *s)
{
    const char *p = s;
    while (*p != '\0')
        p++;
    return (int)(p - s);
}

/* p2 변형: 원소 하나가 12바이트인 구조체 */
struct triple {
    int x, y, z;
};

/* p4 변형: 끝 표시를 베끼지 않는 잘못된 복사 */
static void copy_without_end(char *s, const char *t)
{
    while (*t != '\0') {
        *s = *t;
        s++;
        t++;
    }
}

/* 색인으로 쓴 길이 세기 */
static int length_indexed(const char *s)
{
    int i = 0;
    while (s[i] != '\0')
        i++;
    return i;
}

/* 문서 p4의 포인터 판 비교 */
static int compare(const char *s, const char *t)
{
    for (; *s == *t; s++, t++)
        if (*s == '\0')
            return 0;
    return *s - *t;
}

/* 문서 p4의 포인터 판 복사에 세는 줄을 넣은 것 */
static void copy_counted(char *s, const char *t, int *assigns, int *moves)
{
    *assigns = 0;
    *moves = 0;
    for (;;) {
        *s = *t;
        (*assigns)++;
        if (*s == '\0')
            break;
        s++;
        t++;
        (*moves)++;
    }
}

int main(void)
{
    /* p1: 포인터 추적 */
    {
        int a = 10, b = 20;
        int *p = &a;
        int **q = &p;
        char out[32];

        *p = *p + b;                    /* 1줄: a = 30 */
        CHECK(a == 30 && b == 20 && p == &a, "p1 1줄 뒤: a = 30");
        p = &b;                         /* 2줄: p가 b를 가리킨다 */
        CHECK(a == 30 && b == 20 && p == &b && *q == &b, "p1 2줄 뒤: p -> b");
        **q = **q + 1;                  /* 3줄: b = 21 */
        CHECK(a == 30 && b == 21, "p1 3줄 뒤: b = 21");
        *q = &a;                        /* 4줄: p가 다시 a를 가리킨다 */
        CHECK(p == &a, "p1 4줄 뒤: p -> a");
        *p = *p - b;                    /* 5줄: a = 30 - 21 = 9 */
        CHECK(a == 9 && b == 21, "p1 5줄 뒤: a = 9");
        snprintf(out, sizeof out, "%d %d %d", a, b, **q);
        CHECK(strcmp(out, "9 21 9") == 0, "p1 출력: 9 21 9");
        printf("[OK] p1: 출력 %s\n", out);
    }

    /* p1 변형: 4줄을 빼면 */
    {
        int a = 10, b = 20;
        int *p = &a;
        int **q = &p;

        *p = *p + b;
        p = &b;
        **q = **q + 1;
        *p = *p - b;                    /* p가 b를 가리키므로 b = 21 - 21 = 0 */
        CHECK(a == 30 && b == 0 && **q == 0, "p1 변형 출력: 30 0 0");
        printf("[OK] p1 변형: 출력 %d %d %d\n", a, b, **q);
    }

    /* p2: 주소 계산 */
    {
        char c[10];
        short s[10];
        int arr[10];
        double d[10];
        int *p = arr + 2;

        CHECK(sizeof(char) == 1 && sizeof(short) == 2 && sizeof(int) == 4 && sizeof(double) == 8, "칸 크기 1, 2, 4, 8");
        CHECK(100 + 3 * sizeof(int) == 112, "(가) int: 100 + 3 x 4 = 112");
        CHECK(400 + 2 * sizeof(double) == 416, "(나) double: 400 + 2 x 8 = 416");
        CHECK(2000 + 7 * sizeof(short) == 2014, "(다) short: 2000 + 7 x 2 = 2014");
        CHECK(50 + 9 * sizeof(char) == 59, "(라) char: 50 + 9 x 1 = 59");
        /* 실제 배열에서 같은 식 */
        CHECK((uintptr_t)&arr[3] - (uintptr_t)arr == 12 && (uintptr_t)&d[2] - (uintptr_t)d == 16, "실제 주소 차 12, 16");
        CHECK((uintptr_t)&s[7] - (uintptr_t)s == 14 && (uintptr_t)&c[9] - (uintptr_t)c == 9, "실제 주소 차 14, 9");
        CHECK(&arr[4] - &arr[1] == 3, "(마) 포인터끼리 빼면 칸 수 3");
        CHECK((uintptr_t)&arr[4] - (uintptr_t)&arr[1] == 12, "(마) 바이트로는 12");
        CHECK(&p[1] == &arr[3] && p - arr == 2, "(바) p = arr + 2 이면 p[1]은 arr[3]");
        CHECK(&p[-2] == &arr[0], "p[-2]는 arr[0]");
        {
            struct triple t[10];
            CHECK(sizeof(struct triple) == 12 && 100 + 3 * sizeof(struct triple) == 136, "변형: 12바이트 칸이면 136");
            CHECK((uintptr_t)&t[3] - (uintptr_t)t == 36, "변형: 실제 주소 차 36");
        }
        printf("[OK] p2: 112, 416, 2014, 59, 칸 수 3(12바이트), arr[3]. 변형 136\n");
    }

    /* p3: 값으로 받는 인자와 주소로 받는 인자 */
    {
        int a = 1, b = 2;

        f(a, &b);                       /* x = 2, b = 2 + 2 = 4. a는 그대로 1 */
        CHECK(a == 1 && b == 4, "p3 첫 호출 뒤: a = 1, b = 4");
        f(b, &a);                       /* x = 5, a = 1 + 5 = 6. b는 그대로 4 */
        CHECK(a == 6 && b == 4, "p3 출력: 6 4");
        printf("[OK] p3: 출력 %d %d\n", a, b);

        a = 1; b = 2;
        g(&a, &b);                      /* a = 2, b = 2 + 2 = 4 */
        g(&b, &a);                      /* b = 5, a = 2 + 5 = 7 */
        CHECK(a == 7 && b == 5, "p3 변형 출력: 7 5");
        printf("[OK] p3 변형: 출력 %d %d\n", a, b);
    }

    /* p4: 문자열 함수 */
    {
        static const char *words[] = {"", "a", "tree", "now is the time", "data structure"};
        char buf[16];
        int assigns, moves;
        size_t i;

        for (i = 0; i < sizeof words / sizeof words[0]; i++) {
            CHECK(length(words[i]) == (int)strlen(words[i]), "length == strlen");
            CHECK(length_indexed(words[i]) == length(words[i]), "색인 판과 포인터 판의 길이가 같다");
        }
        CHECK(length("tree") == 4 && length("") == 0 && length("now is the time") == 15, "길이 4, 0, 15");

        CHECK(compare("data", "date") == 'a' - 'e' && compare("data", "date") == -4, "(나) data, date: -4");
        CHECK(compare("list", "lis") == 't' && compare("list", "lis") == 116, "(나) list, lis: 116");
        CHECK(compare("heap", "heap") == 0, "(나) heap, heap: 0");
        CHECK((compare("data", "date") < 0) == (strcmp("data", "date") < 0), "부호가 strcmp와 같다");
        CHECK((compare("list", "lis") > 0) == (strcmp("list", "lis") > 0), "부호가 strcmp와 같다");

        copy_counted(buf, "tree", &assigns, &moves);
        CHECK(strcmp(buf, "tree") == 0 && assigns == 5 && moves == 4, "(다) tree: 대입 5번, 옮기기 4번");
        copy_counted(buf, "", &assigns, &moves);
        CHECK(buf[0] == '\0' && assigns == 1 && moves == 0, "빈 문자열: 대입 1번, 옮기기 0번");
        memset(buf, '#', sizeof buf);
        copy_without_end(buf, "tree");
        CHECK(memcmp(buf, "tree#", 5) == 0, "변형: 끝 표시를 베끼지 않아 다섯째 칸이 그대로 '#'이다");
        buf[4] = '\0';                  /* 반복 뒤에 한 줄을 더 써야 문자열이 된다 */
        CHECK(strcmp(buf, "tree") == 0, "변형: 끝 표시를 붙이면 tree");
        printf("[OK] p4: 길이 4, 비교 -4 · 116 · 0, 복사는 대입 5번과 옮기기 4번. 변형은 끝 표시가 빠진다\n");
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
