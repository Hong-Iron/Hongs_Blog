---
layout: "note"
title: "03_java-type-conversion_impl.java"
display_title: "03_java-type-conversion_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "03"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
parent_url: "/studies/software-project/java-type-conversion/"
parent_title: "타입 변환"
description: "소프트웨어 프로젝트 · 타입 변환 구현 코드"
permalink: "/studies/software-project/code/03_java-type-conversion_impl/"
---
{% raw %}
[타입 변환](/Hongs_Blog/studies/software-project/java-type-conversion/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 03_java-type-conversion_impl.java
// 타입 변환 문서의 출력과 값을 확인한다.

class TypeConversionImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    public static void main(String[] args) {
        // 1. 자동 변환 (슬라이드 ImplicitConversion)
        int i = 100;
        long l = i;
        float f = l;
        check(("Int value " + i).equals("Int value 100"), "int");
        check(("Long value " + l).equals("Long value 100"), "long");
        check(("Float value " + f).equals("Float value 100.0"), "float");

        // 2. 강제 변환 (슬라이드 ExplicitConversion)
        double d = 100.04;
        long l2 = (long) d;
        int i2 = (int) l2;
        check(("Double value " + d).equals("Double value 100.04"), "double");
        check(("Long value " + l2).equals("Long value 100"), "long으로 자르기");
        check(("Int value " + i2).equals("Int value 100"), "int로 자르기");

        // 3. int -> char는 강제 변환이 필요하다
        int num = 88;
        char ch = (char) num;
        check(ch == 'X', "88번 글자는 X");

        // 4. 강제 변환은 값을 바꿀 수 있다
        check((byte) 300 == 44, "(byte)300 = 44");
        check((byte) 128 == -128, "(byte)128 = -128");
        check((byte) 200 == -56, "(byte)200 = -56");
        check((int) 3.99 == 3, "(int)3.99 = 3");
        check((int) -3.99 == -3, "(int)-3.99 = -3");
        check((int) 1e20 == Integer.MAX_VALUE, "너무 큰 실수는 int 최댓값이 된다");
        check((int) Double.NaN == 0, "NaN은 0이 된다");

        // 5. 자동 변환도 정밀도를 잃을 수 있다 (long, int -> float)
        int big = 16777217;                 // 2^24 + 1
        float bf = big;
        check((int) bf == 16777216, "int 16777217 -> float -> int 16777216");
        long big2 = 123456789L;
        float bf2 = big2;
        check((long) bf2 == 123456792L, "long 123456789 -> float -> long 123456792: " + (long) bf2);

        // 6. 연산 중 변환: byte끼리 더해도 결과는 int
        byte x = 10;
        byte y = 20;
        int result = x + y;
        check(result == 30, "byte + byte = int 30");
        byte sum = (byte) (x + y);
        check(sum == 30, "강제 변환하면 byte에 담을 수 있다");
        char a = 'A';
        check(a + 1 == 66, "'A' + 1 = 66 (int)");
        check((char) (a + 1) == 'B', "(char)('A'+1) = 'B'");
        // 크기가 다른 타입끼리는 큰 쪽으로 맞춘다
        check(10 / 4 == 2, "int / int = 2");
        check(10 / 4.0 == 2.5, "int / double = 2.5");
        check((double) 10 / 4 == 2.5, "(double)10 / 4 = 2.5");
        check((double) (10 / 4) == 2.0, "(double)(10/4) = 2.0");
        Object o = 1 + 2L;
        check(o instanceof Long, "int + long = long");
        Object o2 = 1 + 2.0f;
        check(o2 instanceof Float, "int + float = float");
        Object o3 = 1L + 2.0f;
        check(o3 instanceof Float, "long + float = float");

        // 7. + 의 두 가지 일 (슬라이드)
        check(3 + 7 == 10, "3 + 7");
        check(("3" + 7).equals("37"), "\"3\" + 7");
        check((3 + "7").equals("37"), "3 + \"7\"");
        check(1 + 2 + 3 == 6, "1 + 2 + 3");
        check((1 + 2 + "3").equals("33"), "1 + 2 + \"3\"");
        check((1 + "2" + 3).equals("123"), "1 + \"2\" + 3");
        check(("1" + 2 + 3).equals("123"), "\"1\" + 2 + 3");
        check(("1" + (2 + 3)).equals("15"), "\"1\" + (2 + 3)");
        // 카드
        check(("" + 1 + 2).equals("12"), "\"\" + 1 + 2");
        check((1 + 2 + "" + 1 + 2).equals("312"), "1 + 2 + \"\" + 1 + 2");
        check(('A' + 1 + "B").equals("66B"), "'A' + 1 + \"B\"");
        check(("B" + 'A' + 1).equals("BA1"), "\"B\" + 'A' + 1");

        // 8. 문자열 <-> 기본 타입
        check(Byte.parseByte("10") == 10, "parseByte");
        check(Short.parseShort("200") == 200, "parseShort");
        check(Integer.parseInt("300000") == 300000, "parseInt");
        check(Long.parseLong("40000000000") == 40000000000L, "parseLong");
        check(Float.parseFloat("12.345") == 12.345f, "parseFloat");
        check(Double.parseDouble("12.345") == 12.345, "parseDouble");
        check(Boolean.parseBoolean("true") == true, "parseBoolean");
        check(String.valueOf(10).equals("10"), "valueOf(int)");
        check(String.valueOf(12.5).equals("12.5"), "valueOf(double)");
        check(String.valueOf(true).equals("true"), "valueOf(boolean)");
        check(("10" + "20").equals("1020"), "글자끼리는 붙는다");
        check(Integer.parseInt("10") + Integer.parseInt("20") == 30, "숫자로 바꾸면 더해진다");
        boolean threw = false;
        try {
            Integer.parseInt("12a");
        } catch (NumberFormatException e) {
            threw = true;
        }
        check(threw, "숫자가 아닌 글자는 NumberFormatException");
        threw = false;
        try {
            Byte.parseByte("200");
        } catch (NumberFormatException e) {
            threw = true;
        }
        check(threw, "범위를 넘는 글자도 NumberFormatException");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
