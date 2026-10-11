---
layout: "note"
title: "36_java-throw_impl.java"
display_title: "36_java-throw_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/java/java-throw/"
parent_title: "예외 던지기"
description: "자바 프로그래밍 · 예외 던지기 구현 코드"
permalink: "/studies/java/code/36_java-throw_impl/"
---
{% raw %}
[예외 던지기](/Hongs_Blog/studies/java/java-throw/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 36_java-throw_impl.java
// (JDK 21. 이 파일이 있는 폴더에서 실행한다. 다른 파일을 불러오지 않는다.)
// 문서 「예외 던지기」의 예제 출력과 카드의 답을 확인한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class ThrowImpl {

    // System.out에 찍히는 글자를 모아 문자열로 돌려준다. 예외가 빠져나오면 그 예외를 그대로 다시 던진다.
    interface Body { void run() throws Throwable; }
    static String capture(Body body) throws Throwable {
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf, true));
        try {
            body.run();
        } finally {
            System.setOut(old);
        }
        return buf.toString().replace("\r\n", "\n");
    }
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError("FAILED: " + what);
        System.out.println("ok  " + what);
    }
    static void same(String got, String want, String what) {
        if (!got.equals(want)) throw new AssertionError("FAILED: " + what + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.println("ok  " + what);
    }

    // 슬라이드 p.16 ThrowingException
    static void findClass() throws ClassNotFoundException {
        Class.forName("java.lang.String2");
    }
    static void slideMain() {
        try {
            findClass();
        } catch (ClassNotFoundException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }

    // 떠넘기기가 여러 층을 거치는 흐름 (실행 순서 표)
    static void c() throws Exception {
        System.out.println("c1");
        throw new Exception("boom");
    }
    static void b() throws Exception {
        System.out.println("b1");
        c();
        System.out.println("b2");
    }
    static void a() {
        try {
            System.out.println("a1");
            b();
            System.out.println("a2");
        } catch (Exception e) {
            System.out.println("caught " + e.getMessage());
        }
        System.out.println("a3");
    }

    // throw로 직접 던지기
    static int divide(int x, int y) {
        if (y == 0) {
            throw new IllegalArgumentException("y must not be 0");
        }
        return x / y;
    }

    // 여러 종류를 쉼표로 적기, 그리고 throws Exception 하나로 뭉치기
    static void two(String name, String number) throws ClassNotFoundException, NumberFormatException {
        Class.forName(name);
        Integer.parseInt(number);
    }
    static void all(String name, String number) throws Exception {
        Class.forName(name);
        Integer.parseInt(number);
    }

    // 카드 C2
    static void inner() throws Exception {
        try {
            System.out.println("1");
            throw new Exception("E");
        } finally {
            System.out.println("2");
        }
    }
    static void cardC2() {
        try {
            inner();
            System.out.println("3");
        } catch (Exception e) {
            System.out.println("4 " + e.getMessage());
        }
        System.out.println("5");
    }

    public static void main(String[] args) throws Throwable {
        same(capture(ThrowImpl::slideMain), "Exception: java.lang.String2\n", "p.16 출력");
        same(capture(ThrowImpl::a), "a1\nb1\nc1\ncaught boom\na3\n", "세 층 떠넘기기: b2, a2는 건너뛴다");

        check(divide(6, 3) == 2, "divide(6, 3) = 2");
        String msg = null;
        try { divide(6, 0); } catch (IllegalArgumentException e) { msg = e.getMessage(); }
        check("y must not be 0".equals(msg), "throw에 넣은 메시지를 getMessage()로 꺼낸다");

        String kind = "";
        try { two("java.lang.String2", "1"); } catch (ClassNotFoundException e) { kind = "CNF"; }
        check(kind.equals("CNF"), "two: ClassNotFoundException");
        try { two("java.lang.String", "1oo"); } catch (NumberFormatException e) { kind = "NF"; }
        check(kind.equals("NF"), "two: NumberFormatException");
        try { all("java.lang.String", "1oo"); } catch (Exception e) { kind = e.getClass().getSimpleName(); }
        check(kind.equals("NumberFormatException"), "all: Exception 하나로 받아도 실제 객체의 종류는 그대로");

        same(capture(ThrowImpl::cardC2), "1\n2\n4 E\n5\n", "카드 C2 출력");

        // 생성자 인자 없이 만들면 메시지는 null
        check(new Exception().getMessage() == null, "new Exception().getMessage()는 null");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
