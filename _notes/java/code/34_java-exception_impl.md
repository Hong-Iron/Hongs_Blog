---
layout: "note"
title: "34_java-exception_impl.java"
display_title: "34_java-exception_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "34"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-exception/"
parent_title: "예외와 예외 클래스"
description: "자바 프로그래밍 · 예외와 예외 클래스 구현 코드"
permalink: "/studies/java/code/34_java-exception_impl/"
---
{% raw %}
[예외와 예외 클래스](/Hongs_Blog/studies/java/java-exception/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 34_java-exception_impl.java
// (JDK 21. 이 파일이 있는 폴더에서 실행한다. 다른 파일을 불러오지 않는다.)
// 문서 「예외와 예외 클래스」의 계층 그림과 예제 출력을 확인한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class ExceptionImpl {

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

    // 슬라이드 p.7 WithNoExceptionHandling
    static void printLength(String data) {
        int result = data.length();
        System.out.println("length: " + result);
    }
    static void noHandling() {
        System.out.println("[Program start]");
        printLength("Hello World");
        printLength(null);
        System.out.println("[Program end]");
    }

    // 슬라이드 p.9 CheckedException
    static void checkedExample() {
        try {
            Class.forName("java.lang.String");
            System.out.println("There is a String class.");
        } catch (ClassNotFoundException e) {
            System.out.println("There is no String class.");
        }
        System.out.println();
        try {
            Class.forName("java.lang.String2");
            System.out.println("There is a String2 class.");
        } catch (ClassNotFoundException e) {
            System.out.println("There is no String2 class.");
        }
    }

    static void forever(int n) { forever(n + 1); }

    public static void main(String[] args) throws Throwable {
        // 1. 클래스 계층 (슬라이드 p.4 그림)
        check(Exception.class.getSuperclass() == Throwable.class, "Exception의 부모는 Throwable");
        check(Error.class.getSuperclass() == Throwable.class, "Error의 부모는 Throwable");
        check(RuntimeException.class.getSuperclass() == Exception.class, "RuntimeException의 부모는 Exception");
        check(Throwable.class.getSuperclass() == Object.class, "Throwable의 부모는 Object");
        Class<?>[] runtime = { NullPointerException.class, ArrayIndexOutOfBoundsException.class,
                NumberFormatException.class, ArithmeticException.class, ClassCastException.class };
        for (Class<?> c : runtime)
            check(RuntimeException.class.isAssignableFrom(c), c.getSimpleName() + "은 실행 예외");
        Class<?>[] checked = { ClassNotFoundException.class, InterruptedException.class, java.io.IOException.class };
        for (Class<?> c : checked)
            check(Exception.class.isAssignableFrom(c) && !RuntimeException.class.isAssignableFrom(c),
                    c.getSimpleName() + "은 일반 예외");
        Class<?>[] errors = { OutOfMemoryError.class, StackOverflowError.class };
        for (Class<?> c : errors)
            check(Error.class.isAssignableFrom(c) && !Exception.class.isAssignableFrom(c),
                    c.getSimpleName() + "는 Error 쪽이고 Exception이 아니다");

        // 2. 처리하지 않은 실행 예외: 뒤 줄이 실행되지 않는다 (p.7)
        final Throwable[] escaped = new Throwable[1];
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf, true));
        try { noHandling(); } catch (NullPointerException e) { escaped[0] = e; } finally { System.setOut(old); }
        same(buf.toString(), "[Program start]\nlength: 11\n", "p.7: [Program end]가 찍히지 않는다");
        check(escaped[0] instanceof NullPointerException, "p.7: NullPointerException이 main 밖으로 나간다");
        check(escaped[0].getMessage().startsWith("Cannot invoke \"String.length()\" because"),
                "NPE 메시지: " + escaped[0].getMessage());

        // 3. 일반 예외 예제 (p.9)
        same(capture(ExceptionImpl::checkedExample),
                "There is a String class.\n\nThere is no String2 class.\n", "p.9 출력");

        // 4. Error는 catch (Exception e)에 걸리지 않는다
        boolean caughtAsError = false, caughtAsException = false;
        try { forever(0); } catch (Exception e) { caughtAsException = true; } catch (Error e) { caughtAsError = true; }
        check(caughtAsError && !caughtAsException, "StackOverflowError는 Exception 그물을 빠져나간다");

        // 5. 카드 C3
        Object o = new NumberFormatException("x");
        check(o instanceof IllegalArgumentException && o instanceof RuntimeException && o instanceof Exception
                && o instanceof Throwable && !(o instanceof Error), "NumberFormatException의 조상 줄");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
