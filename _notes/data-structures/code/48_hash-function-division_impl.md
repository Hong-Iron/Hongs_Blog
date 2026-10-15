---
layout: "note"
title: "48_hash-function-division_impl.c"
display_title: "48_hash-function-division_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "48"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/hash-function-division/"
parent_title: "나눗셈 해시 함수"
description: "자료구조 · 나눗셈 해시 함수 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/48_hash-function-division_impl/"
---
{% raw %}
[나눗셈 해시 함수](/Hongs_Blog/studies/data-structures/hash-function-division/) 문서의 구현 코드다.

```c
/* 나눗셈 해시 함수: 문자열을 정수로 바꾸기, 나머지로 홈 버킷 정하기. 구현과 자체 테스트.
 *
 * 실행: cc -std=c11 -Wall -Wextra 48_hash-function-division_impl.c -o hashdiv && ./hashdiv
 * 문서: 48.나눗셈 해시 함수 (예시, unsigned char로 읽는 까닭, 카드 C1~C3)
 *
 * 흔히 보는 stringToInt 코드에서 고친 것
 *   - 반환형을 붙였다(빼면 C99부터 표준에 어긋난다). unsigned int를 돌려준다.
 *   - 글자를 char 그대로 더하면, char가 부호 있는 형인 기계에서는 0x80 이상인 바이트가 음수가 되어
 *     결과가 음수가 될 수 있다. unsigned char로 읽게 했다.
 *
 * 확인하는 것
 *   1. 두 글자 문자열은 서로 다른 수가 된다: 출력 가능한 글자 95 × 95쌍 전수.
 *   2. 세 글자부터는 겹친다: "abc"와 "cba"가 둘 다 25284.
 *   3. char 판(글자를 char 그대로 더하는 것)은 0x80 이상인 바이트에서 음수를 내고, 음수 % 17은 음수다.
 *   4. 나누는 수 14와 15의 예, 나머지는 늘 0 이상 b 미만.
 *   5. 카드 C1, C3의 답.
 */
#include <limits.h>
#include <stdio.h>
#include <string.h>

/* 고친 판. 글자를 두 개씩 묶어 16비트 수로 만들고 모두 더한다. */
static unsigned int string_to_int(const char *key)
{
    const unsigned char *p = (const unsigned char *)key;
    unsigned int number = 0;
    while (*p) {
        number += *p++;                           /* 묶음의 첫 글자: 아래 8비트 */
        if (*p)
            number += ((unsigned int)*p++) << 8;  /* 묶음의 둘째 글자: 그 위 8비트 */
    }
    return number;
}

/* 글자를 char 그대로 더하는 판(반환형은 int). 문제를 보이려고 남겨 둔다.
 * 첫 글자만 더하는 길만 시험한다(음수를 왼쪽으로 미는 것은 C에서 정의되지 않은 동작이다). */
static int string_to_int_slide(const char *key)
{
    int number = 0;
    while (*key) {
        number += *key++;
        if (*key)
            number += ((int)*key++) << 8;
    }
    return number;
}

/* 나눗셈 방법: 홈 버킷 = 수 % 버킷 수. 결과는 0 이상 b 미만이다. */
static unsigned int home_bucket(unsigned int number, unsigned int b)
{
    return number % b;
}

static int fail(const char *msg)
{
    printf("FAILED: %s\n", msg);
    return 1;
}

int main(void)
{
    /* 두 글자 문자열의 두 줄: number = key[0]; number += ((int) key[1]) << 8; */
    if (string_to_int("ab") != 97u + (98u << 8) || string_to_int("ab") != 25185u)
        return fail("\"ab\" = 97 + 98 * 256 = 25185");
    if (string_to_int("") != 0u || string_to_int("a") != 97u)
        return fail("빈 문자열과 한 글자");

    /* 1. 두 글자 문자열 전수: 서로 다르면 수도 다르다 */
    {
        static unsigned char seen[65536];
        memset(seen, 0, sizeof seen);
        for (int c0 = 32; c0 < 127; c0++) {
            for (int c1 = 32; c1 < 127; c1++) {
                char s[3] = {(char)c0, (char)c1, '\0'};
                unsigned int v = string_to_int(s);
                if (v >= 65536u || seen[v])
                    return fail("두 글자 문자열이 겹쳤다");
                seen[v] = 1;
            }
        }
    }

    /* 2. 세 글자부터 겹친다 */
    if (string_to_int("abc") != 25284u || string_to_int("cba") != 25284u)
        return fail("\"abc\"와 \"cba\"가 25284");
    if (string_to_int("abcd") != string_to_int("cdab"))
        return fail("\"abcd\"와 \"cdab\"");
    if (string_to_int("abcd") != 50884u)
        return fail("\"abcd\" = 50884");

    /* 고친 판과 char 판은 영문자·숫자에서 같은 값을 낸다 */
    {
        const char *words[] = {"a", "ab", "abc", "cba", "hash", "table", "Data2024"};
        for (size_t i = 0; i < sizeof words / sizeof words[0]; i++)
            if ((unsigned int)string_to_int_slide(words[i]) != string_to_int(words[i]))
                return fail("영문자에서 두 판의 값이 다르다");
    }

    /* 3. char 판: char가 부호 있는 기계에서는 0x80 이상인 바이트가 음수가 된다 */
#if CHAR_MIN < 0
    {
        int v = string_to_int_slide("\xEA");      /* 한 글자라 왼쪽으로 미는 줄은 돌지 않는다 */
        if (v != -22)
            return fail("char 판의 \"\\xEA\" = -22");
        if (v % 17 != -5)
            return fail("-22 % 17 = -5 (버킷 번호로 쓸 수 없다)");
        printf("char 판: \"\\xEA\" -> %d, %d %% 17 = %d\n", v, v, v % 17);
    }
#endif
    if (string_to_int("\xEA") != 234u || home_bucket(string_to_int("\xEA"), 17u) != 13u)
        return fail("고친 판의 \"\\xEA\" = 234, 234 % 17 = 13");

    /* 4. 나누는 수 14와 15 (문서의 예시) */
    {
        const unsigned int keys[6] = {20, 30, 8, 15, 3, 23};
        const unsigned int by14[6] = {6, 2, 8, 1, 3, 9};
        const unsigned int by15[6] = {5, 0, 8, 0, 3, 8};
        for (int i = 0; i < 6; i++) {
            if (home_bucket(keys[i], 14u) != by14[i] || home_bucket(keys[i], 15u) != by15[i])
                return fail("문서 예시의 나머지");
            if (home_bucket(keys[i], 14u) % 2u != keys[i] % 2u)
                return fail("짝수로 나누면 홀짝이 그대로 남는다");
        }
        for (unsigned int b = 1; b <= 50; b++)
            for (unsigned int k = 0; k < 2000; k++)
                if (home_bucket(k, b) >= b)
                    return fail("0 <= 홈 버킷 < b");
    }

    /* 5. 카드 C1: "hi", b = 17 / 카드 C3: "ad"와 "da"는 다르고, "adb"와 "bda"는 같다 */
    if (string_to_int("hi") != 26984u || home_bucket(26984u, 17u) != 5u)
        return fail("카드 C1");
    if (string_to_int("ad") == string_to_int("da") || string_to_int("adb") != string_to_int("bda"))
        return fail("카드 C3");

    printf("\"ab\" = %u, \"abc\" = \"cba\" = %u, \"hi\" %% 17 = %u\n", string_to_int("ab"),
           string_to_int("abc"), home_bucket(string_to_int("hi"), 17u));
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
