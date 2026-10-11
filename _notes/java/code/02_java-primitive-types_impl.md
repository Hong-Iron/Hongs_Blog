---
layout: "note"
title: "02_java-primitive-types_impl.java"
display_title: "02_java-primitive-types_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "02"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-primitive-types/"
parent_title: "변수와 기본 타입"
description: "자바 프로그래밍 · 변수와 기본 타입 구현 코드"
permalink: "/studies/java/code/02_java-primitive-types_impl/"
---
{% raw %}
[변수와 기본 타입](/Hongs_Blog/studies/java/java-primitive-types/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 02_java-primitive-types_impl.java
// 변수와 기본 타입 문서의 표(크기·범위), printf 서식, Scanner 입력을 확인한다.

import java.util.Scanner;

class PrimitiveTypesImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    public static void main(String[] args) {
        // 1. 정수 타입의 크기(비트)와 범위
        check(Byte.SIZE == 8 && Byte.MIN_VALUE == -128 && Byte.MAX_VALUE == 127, "byte");
        check(Short.SIZE == 16 && Short.MIN_VALUE == -32768 && Short.MAX_VALUE == 32767, "short");
        check(Character.SIZE == 16 && (int) Character.MIN_VALUE == 0 && (int) Character.MAX_VALUE == 65535, "char");
        check(Integer.SIZE == 32 && Integer.MIN_VALUE == -2147483648 && Integer.MAX_VALUE == 2147483647, "int");
        check(Long.SIZE == 64 && Long.MIN_VALUE == -9223372036854775808L
                && Long.MAX_VALUE == 9223372036854775807L, "long");
        check(Float.SIZE == 32 && Double.SIZE == 64, "float 32비트, double 64비트");
        // 범위는 -2^(n-1) ~ 2^(n-1) - 1
        check(Byte.MIN_VALUE == -(1 << 7) && Byte.MAX_VALUE == (1 << 7) - 1, "byte 범위 공식");
        check(Integer.MAX_VALUE == (int) ((1L << 31) - 1), "int 범위 공식");

        // 2. char는 글자의 번호(유니코드)를 담는 정수다
        char c = 'A';
        check(c == 65, "'A'는 65");
        char han = '가';
        check((int) han == 44032, "'가'는 44032");

        // 3. boolean
        int x = 10;
        check((x == 20) == false, "x==20");
        check((x != 20) == true, "x!=20");
        check((x > 20) == false, "x>20");
        check((0 < x && x < 20) == true, "0<x && x<20");
        check((x < 0 || x > 200) == false, "x<0 || x>200");

        // 4. 리터럴: 정수는 int, 소수는 double로 본다
        long big = 3000000000L;          // L이 없으면 컴파일 오류
        float f = 170.5f;                // f가 없으면 컴파일 오류
        check(big == 3_000_000_000L, "long 리터럴");
        check(f == 170.5f, "float 리터럴");

        // 5. 변수의 범위: 블록 안에서 만든 변수는 블록 밖에서 쓸 수 없다(쓰면 컴파일 오류)
        int var1 = 1;
        int seen = 0;
        if (var1 == 1) {
            int var2 = 2;
            seen = var1 + var2;          // var1, var2 모두 쓸 수 있다
        }
        for (int i = 0; i < 1; i++) {
            int var3 = 3;
            seen += var1 + var3;         // var1, var3 쓸 수 있다. var2는 못 쓴다
        }
        check(seen == 7, "범위 예제의 합 7");

        // 6. printf 서식 (슬라이드 표). 빈칸을 _로 바꿔 비교한다
        check(String.format("%d", 123).equals("123"), "%d");
        check(String.format("%6d", 123).replace(' ', '_').equals("___123"), "%6d");
        check(String.format("%-6d", 123).replace(' ', '_').equals("123___"), "%-6d");
        check(String.format("%06d", 123).equals("000123"), "%06d");
        check(String.format("%10.2f", 123.45).replace(' ', '_').equals("____123.45"), "%10.2f");
        check(String.format("%-10.2f", 123.45).replace(' ', '_').equals("123.45____"), "%-10.2f");
        check(String.format("%010.2f", 123.45).equals("0000123.45"), "%010.2f");
        check(String.format("%s", "abc").equals("abc"), "%s");
        check(String.format("%6s", "abc").replace(' ', '_').equals("___abc"), "%6s");
        check(String.format("%-6s", "abc").replace(' ', '_').equals("abc___"), "%-6s");
        check(String.format("%%").equals("%"), "%%");
        check(String.format("나는 %s에 살고 있다.", "동작구").equals("나는 동작구에 살고 있다."), "%s 문장");
        check(String.format("나는 %d살이다.", 20).equals("나는 20살이다."), "%d 문장");
        // 카드 C2
        check(String.format("[%5d|%-5s|%.1f]", 42, "ab", 3.14159).equals("[   42|ab   |3.1]"), "카드 C2");

        // 7. Scanner: 키보드 대신 문자열을 입력으로 준다. nextLine은 엔터 앞까지 한 줄을 읽는다
        Scanner scanner = new Scanner("홍길동\n20\n");
        String name = scanner.nextLine();
        String ageText = scanner.nextLine();
        scanner.close();
        check(name.equals("홍길동"), "첫 줄");
        check(ageText.equals("20"), "둘째 줄은 글자 \"20\"이다");
        check(Integer.parseInt(ageText) + 1 == 21, "숫자로 바꿔야 계산할 수 있다");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
