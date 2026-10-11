---
layout: "note"
title: "05_java-bitwise_impl.java"
display_title: "05_java-bitwise_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "05"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-bitwise/"
parent_title: "비트 연산"
description: "자바 프로그래밍 · 비트 연산 구현 코드"
permalink: "/studies/java/code/05_java-bitwise_impl/"
---
{% raw %}
[비트 연산](/Hongs_Blog/studies/java/java-bitwise/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 05_java-bitwise_impl.java
// 비트 연산 문서의 값을 확인한다.

class BitwiseImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    static String bits8(int v) {
        String s = Integer.toBinaryString(v & 0xFF);
        return "0".repeat(8 - s.length()) + s;
    }

    public static void main(String[] args) {
        // 1. 45와 25의 비트
        check(bits8(45).equals("00101101"), "45 = 00101101");
        check(bits8(25).equals("00011001"), "25 = 00011001");
        check((45 & 25) == 9 && bits8(45 & 25).equals("00001001"), "45 & 25 = 9");
        check((45 | 25) == 61 && bits8(45 | 25).equals("00111101"), "45 | 25 = 61");
        check((45 ^ 25) == 52 && bits8(45 ^ 25).equals("00110100"), "45 ^ 25 = 52");
        check(~45 == -46 && bits8(~45).equals("11010010"), "~45 = -46");
        // ~x = -x - 1
        for (int x = -1000; x <= 1000; x++) {
            check(~x == -x - 1, "~x = -x - 1");
            check((x ^ x) == 0 && (x ^ 0) == x, "x ^ x = 0, x ^ 0 = x");
            check(((x ^ 77) ^ 77) == x, "같은 값으로 두 번 XOR하면 돌아온다");
        }

        // 2. 시프트
        check(1 << 3 == 8, "1 << 3 = 8");
        check(5 << 2 == 20, "5 << 2 = 20");
        check(20 >> 2 == 5, "20 >> 2 = 5");
        check(-8 >> 1 == -4, "-8 >> 1 = -4");
        check(-8 >>> 1 == 2147483644, "-8 >>> 1 = 2147483644");
        check(-1 >> 31 == -1 && -1 >>> 31 == 1, "-1 >> 31, -1 >>> 31");
        check(8 >>> 1 == 4, "양수는 >>와 >>>가 같다");
        // 음수 홀수에서 >> 는 나눗셈과 다르다
        check(-7 >> 1 == -4, "-7 >> 1 = -4");
        check(-7 / 2 == -3, "-7 / 2 = -3");
        check(Math.floorDiv(-7, 2) == -4, "floorDiv(-7, 2) = -4");
        for (int x = -200; x <= 200; x++) {
            for (int s = 0; s < 8; s++) {
                check(x << s == x * (1 << s), "x << s = x * 2^s");
                check(x >> s == Math.floorDiv(x, 1 << s), "x >> s = 내림 나눗셈");
            }
        }
        // 왼쪽 시프트도 넘친다
        check(1 << 31 == Integer.MIN_VALUE, "1 << 31 = 최솟값");
        check(1 << 32 == 1, "int는 시프트 수의 아래 5비트만 쓴다: 1 << 32 = 1");
        check(1L << 32 == 4294967296L, "long이면 1L << 32 = 2^32");
        check(1 << 33 == 2, "1 << 33 = 2");

        // 3. byte, short는 int로 바뀐 뒤 계산한다
        byte b = (byte) 0b11110000;      // -16
        check(b == -16, "byte 11110000 = -16");
        check(b >>> 4 == 268435455, "-16 >>> 4 (int로 계산) = 268435455");
        check((b & 0xFF) >>> 4 == 15, "(b & 0xFF) >>> 4 = 15");
        check((b & 0xFF) == 240, "b & 0xFF = 240");

        // 4. 쓰임: 짝홀, 특정 비트 켜기·끄기·확인
        check((45 & 1) == 1 && (24 & 1) == 0, "마지막 비트로 짝홀 판별");
        check((-7 & 1) == 1, "음수도 된다");
        int flags = 0;
        final int READ = 1 << 0, WRITE = 1 << 1, EXEC = 1 << 2;
        flags |= READ;
        flags |= EXEC;
        check(flags == 5, "READ | EXEC = 5");
        check((flags & WRITE) == 0 && (flags & EXEC) != 0, "비트 확인");
        flags &= ~READ;
        check(flags == 4, "READ 끄기");
        flags ^= WRITE;
        check(flags == 6, "WRITE 뒤집기");
        // 색 0xRRGGBB에서 초록 꺼내기
        int color = 0x3B82C4;
        check(((color >> 8) & 0xFF) == 0x82, "초록 성분 0x82 = 130");
        check(((color >> 16) & 0xFF) == 59 && (color & 0xFF) == 196, "빨강 59, 파랑 196");

        // 5. 카드
        check((12 & 10) == 8 && (12 | 10) == 14 && (12 ^ 10) == 6 && ~12 == -13, "12와 10");
        check((6 << 2 | 3) == 27, "6 << 2 | 3 = 27");
        check((1 << 4) - 1 == 15, "(1 << 4) - 1 = 15");
        check(-16 >> 2 == -4 && -16 >>> 28 == 15, "-16 >> 2 = -4, -16 >>> 28 = 15");

        // 6. boolean에 쓰는 &, |, ^ 는 논리 연산이다
        check((true & false) == false && (true | false) == true && (true ^ true) == false, "boolean &, |, ^");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
