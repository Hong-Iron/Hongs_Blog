---
layout: "note"
title: "03_c-pointer_impl.c"
display_title: "03_c-pointer_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "03"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/c-pointer/"
parent_title: "포인터"
description: "자료구조 · 포인터 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/03_c-pointer_impl/"
---
{% raw %}
[포인터](/Hongs_Blog/studies/data-structures/c-pointer/) 문서의 구현 코드다.

```c
/* 포인터: 주소 연산자 &, 따라가기 연산자 *, 포인터의 포인터, 포인터 형 변환을 값으로 확인한다.
 *
 * 문서: 03.포인터 (예시, 식과 타입 표, 추적 표, 스스로 설명해 보기, 오해, 카드)
 * 출처: 자료구조 2주차 슬라이드 p.21~28
 * 실행: cc -std=c11 -Wall -Wextra 03_c-pointer_impl.c -o c_pointer && ./c_pointer
 *
 * 주소 값 자체(예: 0x16b...)는 실행할 때마다 달라진다. 그래서 주소의 숫자가 아니라
 * "누가 누구를 가리키는가"와 "따라가면 무슨 값이 나오는가"만 비교한다.
 */
#include <math.h>
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

/* 1. 변수와 포인터: 슬라이드 p.22~23, p.25의 그림 */
static void basics(void)
{
    int a = 100;
    int *p = &a;            /* p에는 a의 주소가 들어 있다 */

    CHECK(p == &a, "p에 든 값은 a의 주소다");
    CHECK(*p == 100, "*p는 p가 가리키는 칸의 값이다");
    CHECK(*&a == a, "주소를 구했다가 따라가면 원래 값이다");
    CHECK(&*p == p, "따라갔다가 주소를 구하면 원래 포인터다");
    CHECK(p[0] == *p, "*p와 p[0]은 같은 칸이다");

    *p = 7;                 /* p가 가리키는 칸(= a)에 7을 넣는다 */
    CHECK(a == 7, "*p에 넣으면 a가 바뀐다");

    a = 8;
    CHECK(*p == 8, "a를 바꾸면 *p로 읽은 값도 바뀐다");
    printf("[OK] 변수와 포인터: p == &a, *p로 읽고 쓰면 a를 읽고 쓰는 것이다\n");
}

/* 2. 슬라이드 p.26: 101을 세 번 찍는 코드 */
static void slide_example(void)
{
    int V = 101;
    int *P = &V;            /* P는 int V를 가리킨다 */
    int **Q = &P;           /* Q는 int 포인터 P를 가리킨다 */
    char out[64];

    snprintf(out, sizeof out, "%d %d %d", V, *P, **Q);
    CHECK(strcmp(out, "101 101 101") == 0, "V, *P, **Q는 모두 101");
    CHECK(*Q == P && *Q == &V, "*Q는 P에 든 값, 곧 V의 주소다");
    printf("[OK] p.26: V, *P, **Q -> %s\n", out);
}

/* 3. 문서의 추적 표 */
static void trace_table(void)
{
    int V = 101, W = 55;
    int *P = &V;
    int **Q = &P;

    CHECK(V == 101 && W == 55 && P == &V && *Q == &V, "처음 상태");

    *P = 7;                 /* 1줄: P를 따라간 칸 V에 7 */
    CHECK(V == 7 && W == 55 && P == &V, "*P = 7 뒤: V만 7");

    **Q = 9;                /* 2줄: Q를 따라가면 P, P를 따라가면 V */
    CHECK(V == 9 && W == 55 && P == &V, "**Q = 9 뒤: V만 9");

    *Q = &W;                /* 3줄: Q를 한 번만 따라간 칸은 P. P가 W를 가리키게 된다 */
    CHECK(V == 9 && W == 55 && P == &W && *P == 55, "*Q = &W 뒤: P가 W를 가리킨다");

    **Q = 1;                /* 4줄: 이제 두 번 따라가면 W */
    CHECK(V == 9 && W == 1 && P == &W, "**Q = 1 뒤: W만 1");
    printf("[OK] 추적 표: V 101->7->9->9->9, W 55->55->55->55->1, P는 3번째 줄에서 W로 옮겨 간다\n");
}

/* 4. 오해: p = q 와 *p = *q 는 다르다 */
static void copy_pointer_or_value(void)
{
    int a = 1, b = 2;
    int *p = &a, *q = &b;

    *p = *q;                /* 내용물을 베낀다: a에 b의 값 */
    CHECK(a == 2 && b == 2 && p == &a && p != q, "*p = *q: a가 2가 되고 p는 여전히 a를 가리킨다");

    *p = 10;
    CHECK(a == 10 && b == 2, "그 뒤 *p = 10은 a만 바꾼다");

    p = q;                  /* 쪽지를 베낀다: p도 b를 가리킨다 */
    CHECK(p == &b && p == q && a == 10 && b == 2, "p = q: 값은 그대로이고 p가 b를 가리킨다");

    *p = 5;
    CHECK(a == 10 && b == 5 && *q == 5, "그 뒤 *p = 5는 b를 바꾼다. q로 봐도 5다");
    printf("[OK] p = q 는 가리키는 곳을 바꾸고, *p = *q 는 가리키는 칸의 값을 바꾼다\n");
}

/* 5. 선언: 별표는 변수 이름마다 붙는다. 포인터의 크기는 가리키는 타입과 상관없다 */
static void declarations(void)
{
    int* x, y;              /* x는 int *, y는 그냥 int */
    int *u, *v;             /* 둘 다 int * */
    int n = 3;
    int *np = NULL;         /* 아무것도 가리키지 않는다 */

    x = &n; y = n; u = &n; v = &n;
    CHECK(sizeof y == sizeof(int), "int* x, y; 에서 y는 int다");
    CHECK(sizeof x == sizeof(int *) && sizeof u == sizeof v, "x, u, v는 포인터다");
    CHECK(*x == 3 && y == 3 && *u == 3 && *v == 3, "값 확인");
    CHECK(np == NULL, "NULL은 어느 칸의 주소와도 다른 값이다");
    CHECK(sizeof(char *) == sizeof(int *) && sizeof(int *) == sizeof(double *) &&
          sizeof(double *) == sizeof(int **) && sizeof(int **) == sizeof(void *),
          "포인터는 무엇을 가리키든 크기가 같다");
    CHECK(sizeof(char) == 1 && sizeof(int) == 4 && sizeof(double) == 8, "이 기계의 char, int, double 크기");
    printf("[OK] 크기: int %zu바이트, double %zu바이트, 포인터 %zu바이트(가리키는 타입과 상관없다)\n",
           sizeof(int), sizeof(double), sizeof(void *));
}

/* 6. 포인터 형 변환: 슬라이드 p.27~28
 *    같은 칸을 다른 타입으로 읽으면 같은 비트가 다른 값으로 읽힌다.
 *    int의 자리를 float * 로 직접 읽는 것은 C 표준이 결과를 정해 두지 않았다.
 *    그래서 여기서는 표준이 허락하는 두 방법으로 같은 일을 한다:
 *    unsigned char * 로 바이트를 하나씩 보기, memcpy로 비트를 그대로 옮기기. */
static void casting(void)
{
    int V = 101;
    unsigned char *bytes = (unsigned char *)&V;   /* 어떤 칸이든 바이트로는 볼 수 있다 */
    unsigned int probe = 1;
    int little = *(unsigned char *)&probe == 1;   /* 낮은 자리 바이트가 앞에 오는 기계인가 */
    float as_bits, as_value;
    unsigned int rebuilt = 0;
    size_t i;

    for (i = 0; i < sizeof V; i++) {
        size_t k = little ? i : sizeof V - 1 - i;
        rebuilt |= (unsigned int)bytes[i] << (8 * k);
    }
    CHECK(rebuilt == 101u, "바이트 네 개를 다시 모으면 101");
    if (little)
        CHECK(bytes[0] == 101 && bytes[1] == 0 && bytes[2] == 0 && bytes[3] == 0, "101의 바이트는 65 00 00 00");

    memcpy(&as_bits, &V, sizeof as_bits);          /* 비트를 그대로 float 칸으로 */
    as_value = (float)V;                           /* 값을 float로 바꾼다 */

    CHECK(sizeof(float) == sizeof(int), "이 기계에서 float와 int는 둘 다 4바이트");
    CHECK(as_value == 101.0f, "(float)V 는 값을 바꾼다: 101.0");
    CHECK(as_bits != 101.0f, "같은 비트를 float로 읽으면 101이 아니다");
    CHECK(as_bits == ldexpf(101.0f, -149), "같은 비트를 float로 읽으면 101 x 2^-149");
    CHECK((double)as_bits > 1.41e-43 && (double)as_bits < 1.42e-43, "약 1.4 x 10^-43");
    printf("[OK] 형 변환: (float)V = %.1f, V의 비트를 float로 읽으면 %g\n", (double)as_value, (double)as_bits);
}

/* 7. 카드의 답 */
static void cards(void)
{
    /* C1 */
    int x = 3, y = 8;
    int *p = &x;
    int **pp = &p;
    *p = *p + 1;            /* x = 4 */
    *pp = &y;               /* p가 y를 가리킨다 */
    **pp = **pp * 2;        /* y = 16 */
    CHECK(x == 4 && y == 16 && *p == 16 && p == &y, "C1: x = 4, y = 16, *p = 16");

    /* C2 */
    {
        int a = 1, b = 2;
        int *s = &a, *t = &b;
        s = t;
        *s = 9;
        CHECK(a == 1 && b == 9, "C2 (가): s = t; *s = 9; -> a = 1, b = 9");
    }
    {
        int a = 1, b = 2;
        int *s = &a, *t = &b;
        *s = *t;
        *s = 9;
        CHECK(a == 9 && b == 2, "C2 (나): *s = *t; *s = 9; -> a = 9, b = 2");
    }

    /* C4: 그림을 코드로 */
    {
        int n = 5;
        int *r = &n;
        int **q = &r;
        CHECK(**q == 5 && *q == &n && q == &r, "C4: q -> r -> n(5)");
    }
    printf("[OK] 카드 C1, C2, C4의 답\n");
}

int main(void)
{
    basics();
    slide_example();
    trace_table();
    copy_pointer_or_value();
    declarations();
    casting();
    cards();

    if (fails) {
        printf("%d개 확인 실패\n", fails);
        return 1;
    }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
