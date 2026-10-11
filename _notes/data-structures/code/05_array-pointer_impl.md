---
layout: "note"
title: "05_array-pointer_impl.c"
display_title: "05_array-pointer_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "05"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/array-pointer/"
parent_title: "배열과 포인터"
description: "자료구조 · 배열과 포인터 구현 코드"
permalink: "/studies/data-structures/code/05_array-pointer_impl/"
---
{% raw %}
[배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/) 문서의 구현 코드다.

```c
/* 배열과 포인터: 칸의 주소 = 시작 주소 + i x 칸 크기, 문자 배열과 문자 포인터, strcpy·strcmp 두 판.
 *
 * 문서: 05.배열과 포인터 (예시, 주소 식, 문자 배열과 문자 포인터, 문자열 함수 두 판, 카드)
 * 출처: 자료구조 2주차 슬라이드 p.30~34, 3주차 슬라이드 p.22~23
 * 실행: cc -std=c11 -Wall -Wextra 05_array-pointer_impl.c -o array_pointer && ./array_pointer
 *
 * 슬라이드의 함수 이름 strcpy, strcmp는 표준 라이브러리에 이미 있어 그대로 쓰면 겹친다.
 * 여기서는 copy_a, copy_b, compare_a, compare_b로 이름을 바꿨다.
 * 무작위 문자열은 정해 둔 씨앗에서 뽑으므로 돌릴 때마다 같은 문자열이 나온다.
 */
#include <stddef.h>
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

struct pair {
    int key;
    double value;
};

/* 레코드(구조체): 칸마다 시작에서 떨어진 거리가 정해져 있다 */
struct date {
    int year;
    int month;
    int day;
};

/* 슬라이드 p.33 A: 색인으로 쓴 복사. 원문의 "while ({s[i]" 는 "while ((s[i]" 로 고쳤다 */
static void copy_a(char *s, const char *t)
{
    int i;
    i = 0;
    while ((s[i] = t[i]) != '\0')
        i++;
}

/* 슬라이드 p.33 B: 포인터로 쓴 복사 */
static void copy_b(char *s, const char *t)
{
    while ((*s = *t) != '\0') {
        s++;
        t++;
    }
}

/* 슬라이드 p.34 strcmp 1: 색인으로 쓴 비교 */
static int compare_a(const char *s, const char *t)
{
    int i;
    for (i = 0; s[i] == t[i]; i++)
        if (s[i] == '\0')
            return 0;
    return s[i] - t[i];
}

/* 슬라이드 p.34 strcmp 2: 포인터로 쓴 비교 */
static int compare_b(const char *s, const char *t)
{
    for (; *s == *t; s++, t++)
        if (*s == '\0')
            return 0;
    return *s - *t;
}

/* 복사 B가 일을 몇 번 하는지 세는 판 (카드용) */
static void copy_b_counted(char *s, const char *t, int *assigns, int *moves)
{
    *assigns = 0;
    *moves = 0;
    while (((*assigns)++, (*s = *t)) != '\0') {
        s++;
        t++;
        (*moves)++;
    }
}

static int sign(int v)
{
    return (v > 0) - (v < 0);
}

/* 정해 둔 씨앗에서 수를 차례로 뽑는다 */
static uint32_t seed = 20261012u;

static uint32_t next_random(void)
{
    seed = seed * 1664525u + 1013904223u;
    return seed >> 8;
}

static void random_string(char *buf, int max_len)
{
    int len = (int)(next_random() % (uint32_t)(max_len + 1));
    int i;
    for (i = 0; i < len; i++)
        buf[i] = (char)('a' + next_random() % 3u);      /* 글자 종류를 줄여 앞부분이 같은 쌍이 자주 나오게 */
    buf[len] = '\0';
}

static void address_formula(void)
{
    char c[8];
    int a[8];
    double d[8];
    struct pair s[8];
    int i;

    for (i = 0; i < 8; i++) {
        c[i] = (char)('a' + i);
        a[i] = 10 * i;
        d[i] = 0.5 * i;
        s[i].key = i;
        s[i].value = i;
    }

    for (i = 0; i < 8; i++) {
        /* 칸의 주소 = 시작 주소 + i x 칸 크기 */
        CHECK((uintptr_t)&c[i] - (uintptr_t)&c[0] == (uintptr_t)i * sizeof c[0], "char 배열의 주소 차");
        CHECK((uintptr_t)&a[i] - (uintptr_t)&a[0] == (uintptr_t)i * sizeof a[0], "int 배열의 주소 차");
        CHECK((uintptr_t)&d[i] - (uintptr_t)&d[0] == (uintptr_t)i * sizeof d[0], "double 배열의 주소 차");
        CHECK((uintptr_t)&s[i] - (uintptr_t)&s[0] == (uintptr_t)i * sizeof s[0], "구조체 배열의 주소 차");
        /* A + x 는 &A[x], *(A + x) 는 A[x] */
        CHECK(a + i == &a[i] && *(a + i) == a[i], "a + i == &a[i], *(a + i) == a[i]");
        CHECK(d + i == &d[i] && *(d + i) == d[i], "d + i == &d[i], *(d + i) == d[i]");
        CHECK(c + i == &c[i] && *(c + i) == c[i], "c + i == &c[i], *(c + i) == c[i]");
    }
    CHECK(a == &a[0], "배열 이름은 첫 칸의 주소로 쓰인다");
    {
        struct date today = {2026, 10, 12};
        CHECK(offsetof(struct date, year) == 0 && offsetof(struct date, month) == 4 && offsetof(struct date, day) == 8,
              "레코드의 칸은 시작에서 0, 4, 8바이트 떨어져 있다");
        CHECK((uintptr_t)&today.day - (uintptr_t)&today == 8 && today.day == 12, "day의 주소 = 시작 + 8");
        CHECK(100 + 2 * 4 == 108 && 200 + 8 == 208, "01번 문서의 예: 100번지 배열의 2번 칸은 108번지, 200번지 레코드의 day는 208번지");
    }
    CHECK(sizeof(int) == 4 && 100 + 3 * sizeof(int) == 112, "p.31: arr[0]이 100번지면 arr[3]은 112번지");
    CHECK(sizeof(double) == 8 && 100 + 3 * sizeof(double) == 124, "double 배열이면 124번지");
    CHECK(&a[5] - &a[2] == 3, "포인터끼리 빼면 칸 수가 나온다");
    CHECK((uintptr_t)&a[5] - (uintptr_t)&a[2] == 12, "바이트로는 12");
    printf("[OK] 주소 식: char %zu, int %zu, double %zu, 구조체 %zu바이트 칸에서 &x[i] - &x[0] = i x 칸 크기\n",
           sizeof c[0], sizeof a[0], sizeof d[0], sizeof s[0]);
}

static void array_name_and_pointer(void)
{
    int arr[8] = {0, 10, 20, 30, 40, 50, 60, 70};
    int *pa = arr;                      /* int *pa = &arr[0]; 과 같다 */

    CHECK(pa == &arr[0] && *pa == 0, "pa는 0번 칸을 가리킨다");
    CHECK(arr[7] == 70, "마지막 칸은 arr[7]이다. arr[8]은 배열 밖이다");
    CHECK(sizeof arr == 8 * sizeof(int), "sizeof arr 는 배열 전체의 크기");
    CHECK(sizeof pa == sizeof(int *), "sizeof pa 는 포인터 하나의 크기");
    CHECK(sizeof arr / sizeof arr[0] == 8, "칸 수 = 전체 크기 / 한 칸 크기");

    pa++;                               /* 포인터는 변수라서 옮길 수 있다 */
    CHECK(pa == &arr[1] && *pa == 10, "pa++ 뒤에는 1번 칸");
    pa += 3;
    CHECK(pa == &arr[4] && *pa == 40 && pa[-1] == 30 && pa[2] == 60, "pa += 3 뒤에는 4번 칸. pa[-1], pa[2]도 쓸 수 있다");
    pa = &arr[7];
    CHECK(*pa == 70 && pa - arr == 7, "pa - arr 은 칸 번호");
    printf("[OK] 배열 이름과 포인터: sizeof arr = %zu, sizeof pa = %zu\n", sizeof arr, sizeof pa);
}

static void char_array_and_char_pointer(void)
{
    char amessage[] = "now is the time";        /* 배열: 글자 15개와 '\0'을 담는 16칸 */
    const char *pmessage = "now is the time";   /* 포인터: 문자열 상수의 첫 글자를 가리킨다 */

    CHECK(sizeof amessage == 16 && strlen(amessage) == 15, "amessage는 16바이트, 글자는 15개");
    CHECK(sizeof pmessage == sizeof(char *), "pmessage는 포인터 하나 크기");
    CHECK(strlen(pmessage) == 15 && strcmp(amessage, pmessage) == 0, "둘 다 같은 글자를 읽는다");
    CHECK(amessage[15] == '\0' && pmessage[15] == '\0', "둘 다 끝에 '\\0'이 있다");
    CHECK((const char *)amessage != pmessage, "글자가 놓인 자리는 서로 다르다");

    amessage[0] = 'N';                           /* 배열의 칸은 고칠 수 있다 */
    CHECK(strcmp(amessage, "Now is the time") == 0, "amessage[0] = 'N'");
    CHECK(pmessage[0] == 'n', "문자열 상수는 그대로다");

    pmessage = "later";                          /* 포인터는 다른 곳을 가리키게 바꿀 수 있다 */
    CHECK(strcmp(pmessage, "later") == 0, "pmessage = \"later\"");
    pmessage = amessage;
    CHECK(pmessage[0] == 'N', "pmessage가 amessage를 가리키게 할 수도 있다");
    printf("[OK] 문자 배열 %zu바이트(고칠 수 있다), 문자 포인터 %zu바이트(다른 곳을 가리키게 할 수 있다)\n",
           sizeof amessage, sizeof pmessage);
}

static void string_functions(void)
{
    char src[16], other[16], out_a[16], out_b[16], out_std[16];
    int trial, same = 0, less = 0, greater = 0;
    int assigns, moves;

    /* 손으로 확인하는 값 */
    copy_a(out_a, "hi");
    copy_b(out_b, "hi");
    CHECK(strcmp(out_a, "hi") == 0 && strcmp(out_b, "hi") == 0, "두 복사 모두 \"hi\"");
    copy_a(out_a, "");
    copy_b(out_b, "");
    CHECK(out_a[0] == '\0' && out_b[0] == '\0', "빈 문자열을 복사하면 '\\0' 하나");

    CHECK(compare_a("abc", "abc") == 0 && compare_b("abc", "abc") == 0, "같으면 0");
    CHECK(compare_a("abc", "abd") == -1 && compare_b("abc", "abd") == -1, "\"abc\"와 \"abd\": 'c' - 'd' = -1");
    CHECK(compare_a("abd", "abc") == 1 && compare_b("abd", "abc") == 1, "\"abd\"와 \"abc\": 1");
    CHECK(compare_a("ab", "abc") == -'c' && compare_b("ab", "abc") == -'c', "\"ab\"와 \"abc\": '\\0' - 'c' = -99");
    CHECK(compare_a("b", "abc") == 1 && compare_b("b", "abc") == 1, "\"b\"와 \"abc\": 'b' - 'a' = 1");
    CHECK(compare_a("", "") == 0 && compare_b("", "") == 0, "빈 문자열끼리는 0");

    /* 무작위 1,000쌍: 두 판과 표준 함수 */
    for (trial = 0; trial < 1000; trial++) {
        int ra, rb, rs;
        random_string(src, 12);
        random_string(other, 12);

        memset(out_a, '#', sizeof out_a);
        memset(out_b, '#', sizeof out_b);
        memset(out_std, '#', sizeof out_std);
        copy_a(out_a, src);
        copy_b(out_b, src);
        strcpy(out_std, src);
        /* 끝의 '\0'까지만 쓰고 그 뒤는 건드리지 않아야 한다: 16바이트를 통째로 비교한다 */
        CHECK(memcmp(out_a, out_std, sizeof out_std) == 0, "copy_a == strcpy");
        CHECK(memcmp(out_b, out_std, sizeof out_std) == 0, "copy_b == strcpy");

        ra = compare_a(src, other);
        rb = compare_b(src, other);
        rs = strcmp(src, other);
        CHECK(ra == rb, "두 비교 판의 값이 같다");
        CHECK(sign(ra) == sign(rs), "표준 strcmp와 부호가 같다");
        if (rs == 0) same++;
        else if (rs < 0) less++;
        else greater++;
    }
    CHECK(same > 0 && less > 0 && greater > 0, "같다·앞이다·뒤다 세 경우가 모두 나왔다");
    printf("[OK] 무작위 1,000쌍: 복사 두 판 = strcpy, 비교 두 판의 부호 = strcmp (같음 %d, 앞 %d, 뒤 %d)\n",
           same, less, greater);

    /* 카드: 복사 B가 "hi"를 옮길 때 */
    copy_b_counted(out_b, "hi", &assigns, &moves);
    CHECK(strcmp(out_b, "hi") == 0 && assigns == 3 && moves == 2, "\"hi\" 복사: 대입 3번, 포인터 옮기기 2번");
    printf("[OK] 카드: 복사 B는 \"hi\"에서 대입 %d번, 옮기기 %d번\n", assigns, moves);
}

static void cards(void)
{
    int a[6] = {5, 6, 7, 8, 9, 10};
    int *p = a + 1;

    CHECK(*(p + 2) == a[3] && *(p + 2) == 8, "*(p + 2)는 a[3] = 8");
    CHECK(p[-1] == 5 && &p[3] == &a[4], "p[-1]은 a[0], &p[3]은 &a[4]");
    CHECK(100 + 3 * 4 == 112 && 100 + 3 * 8 == 124 && 100 + 3 * 1 == 103, "100번지에서 3번 칸: int 112, double 124, char 103");
    printf("[OK] 카드: 주소 계산과 포인터 식\n");
}

int main(void)
{
    address_formula();
    array_name_and_pointer();
    char_array_and_char_pointer();
    string_functions();
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
