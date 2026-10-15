---
layout: "note"
title: "04_java-operators_impl.java"
display_title: "04_java-operators_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "04"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-operators/"
parent_title: "연산자와 오버플로"
description: "자바 프로그래밍 · 연산자와 오버플로 구현 코드"
sitemap: false
permalink: "/studies/java/code/04_java-operators_impl/"
---
{% raw %}
[연산자와 오버플로](/Hongs_Blog/studies/java/java-operators/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 04_java-operators_impl.java
// 연산자와 오버플로 문서의 출력과 값을 확인한다.

class OperatorsImpl {
    static int calls = 0;

    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    static boolean touch(boolean v) {
        calls++;
        return v;
    }

    public static void main(String[] args) {
        // 1. 부호, 증감
        int x = 10;
        check(-x == -10 && +x == 10, "부호");
        int y = x++;                    // 먼저 쓰고 나중에 올린다
        check(y == 10 && x == 11, "x++");
        int z = ++x;                    // 먼저 올리고 쓴다
        check(z == 12 && x == 12, "++x");
        int a = 10;
        int b = a++ + ++a;              // 10 + 12
        check(b == 22 && a == 12, "a++ + ++a = 22");
        int k = 5;
        int m = k-- - --k;              // 5 - 3
        check(m == 2 && k == 3, "k-- - --k = 2");

        // 2. 산술
        check(7 / 2 == 3 && 7 % 2 == 1, "7/2, 7%2");
        check(-7 / 2 == -3 && -7 % 2 == -1, "-7/2, -7%2");
        check(7 % -2 == 1, "7 % -2 = 1");
        check(7 / 2.0 == 3.5, "7/2.0");

        // 3. 오버플로와 언더플로: 끝을 넘으면 반대쪽 끝으로 돈다
        byte bb = 127;
        bb++;
        check(bb == -128, "byte 127 + 1 = -128");
        bb--;
        check(bb == 127, "byte -128 - 1 = 127");
        check(Integer.MAX_VALUE + 1 == Integer.MIN_VALUE, "int 최댓값 + 1");
        check(Integer.MIN_VALUE - 1 == Integer.MAX_VALUE, "int 최솟값 - 1");
        check(1000000 * 1000000 == -727379968, "int 곱셈 오버플로");
        check(1000000L * 1000000 == 1000000000000L, "long으로 계산하면 맞다");
        check(Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE, "abs(최솟값)은 음수 그대로");
        boolean threw = false;
        try {
            Math.addExact(Integer.MAX_VALUE, 1);
        } catch (ArithmeticException e) {
            threw = true;
        }
        check(threw, "addExact는 넘치면 예외를 낸다");

        // 4. 정확한 계산 (문서의 사과 예제)
        int apple = 1;
        double pieceUnit = 0.1;
        int number = 7;
        double result = apple - number * pieceUnit;
        check(String.valueOf(result).equals("0.29999999999999993"), "1 - 7*0.1 = " + result);
        int totalPieces = apple * 10;
        int remain = totalPieces - number;
        check(String.valueOf(remain / 10.0).equals("0.3"), "정수로 바꿔 계산하면 0.3");
        check(0.1 + 0.2 != 0.3, "0.1 + 0.2 는 0.3과 다르다");
        check(String.valueOf(0.1 + 0.2).equals("0.30000000000000004"), "0.1 + 0.2");

        // 5. 0으로 나누기
        threw = false;
        try {
            int q = 5 / (x - x);
        } catch (ArithmeticException e) {
            threw = e.getMessage().equals("/ by zero");
        }
        check(threw, "정수 / 0 은 ArithmeticException: / by zero");
        threw = false;
        try {
            int q = 5 % (x - x);
        } catch (ArithmeticException e) {
            threw = true;
        }
        check(threw, "정수 % 0 도 ArithmeticException");
        double inf = 5 / 0.0;
        double nan = 5 % 0.0;
        check(Double.isInfinite(inf) && String.valueOf(inf).equals("Infinity"), "5 / 0.0 = Infinity");
        check(Double.isNaN(nan) && String.valueOf(nan).equals("NaN"), "5 % 0.0 = NaN");
        check(String.valueOf(-5 / 0.0).equals("-Infinity"), "-5 / 0.0 = -Infinity");
        check(Double.isNaN(0.0 / 0.0), "0.0 / 0.0 = NaN");
        check(Double.isInfinite(5.0 / 0), "5.0 / 0 = Infinity (0이 0.0으로 바뀐다)");
        check(Double.isInfinite(inf + 2), "Infinity + 2 = Infinity");
        check(Double.isNaN(nan + 2), "NaN + 2 = NaN");
        check(Double.isNaN(inf - inf), "Infinity - Infinity = NaN");
        check(!(nan == nan), "NaN == NaN 은 false");
        check(nan != nan, "NaN != NaN 은 true");

        // 6. 비교
        check('A' < 'B', "'A' < 'B' (65 < 66)");
        check(10 == 10.0, "10 == 10.0 (int가 double로 바뀐다)");
        check(!(0.1 == 0.1f), "0.1 == 0.1f 는 false");
        check((float) 0.1 == 0.1f, "(float)0.1 == 0.1f 는 true");

        // 7. 논리
        check((true ^ true) == false && (true ^ false) == true, "XOR");
        check(!true == false, "NOT");
        calls = 0;
        boolean r1 = touch(false) && touch(true);   // 앞이 false면 뒤를 보지 않는다
        check(!r1 && calls == 1, "&&는 뒤를 건너뛴다");
        calls = 0;
        boolean r2 = touch(false) & touch(true);    // &는 둘 다 본다
        check(!r2 && calls == 2, "&는 둘 다 계산한다");
        calls = 0;
        boolean r3 = touch(true) || touch(false);
        check(r3 && calls == 1, "||는 앞이 true면 뒤를 건너뛴다");
        int n = 0;
        boolean safe = (n != 0) && (10 / n > 1);    // 뒤를 계산하지 않아 예외가 없다
        check(!safe, "&&로 0 나눗셈을 막는다");

        // 8. 대입
        int v = 10;
        v += 5;  check(v == 15, "+=");
        v -= 3;  check(v == 12, "-=");
        v *= 2;  check(v == 24, "*=");
        v /= 5;  check(v == 4, "/=");
        v %= 3;  check(v == 1, "%=");
        byte sb = 10;
        sb += 5;                         // sb = (byte)(sb + 5) 와 같다. sb = sb + 5 는 컴파일 오류
        check(sb == 15, "byte += 는 된다");
        sb += 120;
        check(sb == -121, "복합 대입은 넘쳐도 조용히 자른다");
        int p, q2;
        p = q2 = 5;                      // 오른쪽부터
        check(p == 5 && q2 == 5, "a = b = 5");

        // 9. 삼항
        int score = 85;
        char grade = (score > 90) ? 'A' : ((score > 80) ? 'B' : 'C');
        check(grade == 'B', "85점은 B");
        int max = (3 > 7) ? 3 : 7;
        check(max == 7, "큰 값 고르기");

        // 10. 우선순위와 방향
        check(1 + 2 * 3 == 7, "곱셈 먼저");
        check((1 + 2) * 3 == 9, "괄호 먼저");
        check(10 - 3 - 2 == 5, "왼쪽부터");
        check(100 / 10 * 2 == 20, "같은 순위는 왼쪽부터");
        int s = 3, t = -2;
        check((s > 0 && t < 0) == true, "비교가 && 보다 먼저");
        check((true || false && false) == true, "&&가 || 보다 먼저");
        check(((true || false) && false) == false, "괄호로 순서를 바꾸면 false");
        int w = 2;
        int e = -w * w + 10 % 3 << 1;    // ((-w)*w + (10%3)) << 1 = (-4 + 1) << 1 = -6
        check(e == -6, "카드: " + e);
        int c3 = 3;
        int r5 = c3++ * 2 + --c3;        // 3*2 + (4-1=3) = 9
        check(r5 == 9 && c3 == 3, "카드: " + r5);

        // 11. 삼항 연산자는 오른쪽부터 묶인다: a ? b : (c ? d : e)
        boolean ta = true, tb = false, tc = true, td = true, te = true;
        boolean right = ta ? tb : (tc ? td : te);      // false
        boolean left = (ta ? tb : tc) ? td : te;       // true
        boolean plain = ta ? tb : tc ? td : te;
        check(right == false && left == true && plain == right, "삼항은 오른쪽부터 묶인다");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
