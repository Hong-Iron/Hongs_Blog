---
layout: "note"
title: "35_java-try-catch_impl.java"
display_title: "35_java-try-catch_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "35"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-try-catch/"
parent_title: "try-catch-finally"
description: "자바 · try-catch-finally 구현 코드"
permalink: "/studies/java/code/35_java-try-catch_impl/"
---
{% raw %}
[try-catch-finally](/Hongs_Blog/studies/java/java-try-catch/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 35_java-try-catch_impl.java
// (JDK 21. 이 파일이 있는 폴더에서 실행한다. 다른 파일을 불러오지 않는다.)
// 문서 「try-catch-finally」의 실행 순서 표, 슬라이드 예제 출력, 카드의 답을 확인한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class TryCatchImpl {

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

    // 실행 순서 표의 코드: A, B, C, D 가운데 무엇이 어떤 순서로 찍히는가
    static int parse(String[] arr, int i) {
        try {
            System.out.println("A");
            int v = Integer.parseInt(arr[i]);
            System.out.println("B");
            return v;
        } catch (NumberFormatException e) {
            System.out.println("C");
            return -1;
        } finally {
            System.out.println("D");
        }
    }

    // 슬라이드 p.8 WithExceptionHandling
    static void printLength(String data) {
        try {
            int result = data.length();
            System.out.println("length: " + result);
        } catch (NullPointerException e) {
            System.out.println(e.getMessage());
        } finally {
            System.out.println("continue..");
        }
    }
    static void withHandling() {
        System.out.println("[Program start]");
        printLength("Hello World");
        printLength(null);
        System.out.println("[Program end]");
    }

    // 슬라이드 p.11 MultipleCatchBlockExample1
    static void multi1() {
        String[] array = {"100", "1oo"};
        for (int i = 0; i <= array.length; i++) {
            try {
                int value = Integer.parseInt(array[i]);
                System.out.println("array[" + i + "] = " + value);
            } catch (ArrayIndexOutOfBoundsException e) {
                System.out.println("Array index out of bounds." + e.getMessage());
            } catch (NumberFormatException e) {
                System.out.println("Number format exception." + e.getMessage());
            }
        }
    }

    // 슬라이드 p.14 MultipleCatchBlockExample2
    static void multi2() {
        String[] array = {"100", "1oo"};
        for (int i = 0; i <= array.length; i++) {
            try {
                int value = Integer.parseInt(array[i]);
                System.out.println("array[" + i + "] = " + value);
            } catch (ArrayIndexOutOfBoundsException e) {
                System.out.println("Array index out of bounds." + e.getMessage());
            } catch (Exception e) {
                System.out.println("There is an exception.");
            }
        }
    }

    // 한 catch에 두 종류를 묶기 (보충)
    static void multi3() {
        String[] array = {"100", "1oo"};
        for (int i = 0; i <= array.length; i++) {
            try {
                int value = Integer.parseInt(array[i]);
                System.out.println("array[" + i + "] = " + value);
            } catch (ArrayIndexOutOfBoundsException | NumberFormatException e) {
                System.out.println("skip: " + e.getClass().getSimpleName());
            }
        }
    }

    // 카드 C2
    static void cardC2() {
        int[] nums = {4, 0};
        for (int i = 0; i < 3; i++) {
            try {
                System.out.println(8 / nums[i]);
            } catch (ArithmeticException e) {
                System.out.println("X");
            } catch (RuntimeException e) {
                System.out.println("Y");
            } finally {
                System.out.println("Z");
            }
        }
        System.out.println("end");
    }

    // 예외가 try 첫 줄에서 나면 try의 나머지 줄은 건너뛴다
    static void skipRest() {
        try {
            System.out.println("1");
            Object o = null;
            o.toString();
            System.out.println("2");
        } catch (NullPointerException e) {
            System.out.println("3");
        }
        System.out.println("4");
    }

    public static void main(String[] args) throws Throwable {
        String[] arr = {"7", "x"};

        // 1. 실행 순서 표
        final int[] r = new int[1];
        same(capture(() -> r[0] = parse(arr, 0)), "A\nB\nD\n", "예외 없음: A B D");
        check(r[0] == 7, "예외 없음: 7을 돌려준다");
        same(capture(() -> r[0] = parse(arr, 1)), "A\nC\nD\n", "잡는 예외: A C D");
        check(r[0] == -1, "잡는 예외: -1을 돌려준다");
        final Throwable[] t = new Throwable[1];
        same(capture(() -> { try { parse(arr, 2); } catch (ArrayIndexOutOfBoundsException e) { t[0] = e; } }),
                "A\nD\n", "못 잡는 예외: A D만 찍고 밖으로 나간다");
        check(t[0] instanceof ArrayIndexOutOfBoundsException, "못 잡는 예외는 부른 쪽으로 간다");

        // 2. p.8
        same(capture(TryCatchImpl::withHandling),
                "[Program start]\nlength: 11\ncontinue..\n"
              + "Cannot invoke \"String.length()\" because \"<parameter1>\" is null\ncontinue..\n[Program end]\n",
                "p.8 출력: 끝까지 간다");

        // 3. p.11
        same(capture(TryCatchImpl::multi1),
                "array[0] = 100\n"
              + "Number format exception.For input string: \"1oo\"\n"
              + "Array index out of bounds.Index 2 out of bounds for length 2\n", "p.11 출력");

        // 4. p.14
        same(capture(TryCatchImpl::multi2),
                "array[0] = 100\nThere is an exception.\n"
              + "Array index out of bounds.Index 2 out of bounds for length 2\n", "p.14 출력");

        // 5. 한 catch에 묶기
        same(capture(TryCatchImpl::multi3),
                "array[0] = 100\nskip: NumberFormatException\nskip: ArrayIndexOutOfBoundsException\n", "catch (A | B) 출력");

        // 6. 카드
        same(capture(TryCatchImpl::cardC2), "2\nZ\nX\nZ\nY\nZ\nend\n", "카드 C2 출력");
        same(capture(TryCatchImpl::skipRest), "1\n3\n4\n", "try의 나머지 줄은 건너뛴다");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
