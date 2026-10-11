---
layout: "note"
title: "16_java-static_impl.java"
display_title: "16_java-static_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "16"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-static/"
parent_title: "static 멤버"
description: "자바 · static 멤버 구현 코드"
permalink: "/studies/java/code/16_java-static_impl/"
---
{% raw %}
[static 멤버](/Hongs_Blog/studies/java/java-static/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 16_java-static_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「static 멤버」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class StaticCheck {
    // 슬라이드 p.4: 객체를 만들지 않고 클래스 이름으로 쓴다
    static void calculator() {
        double result1 = 10 * 10 * Calculator.pi;
        int result2 = Calculator.plus(10, 5);
        int result3 = Calculator.minus(10, 5);
        System.out.println(result1);
        System.out.println(result2);
        System.out.println(result3);
    }

    // 정적 필드는 클래스에 하나뿐이라 모든 객체가 같이 본다
    static void shared() {
        Scv a = new Scv();
        Scv b = new Scv();
        Scv c = new Scv();
        System.out.println(a.id + " " + b.id + " " + c.id);
        System.out.println(Scv.count);
        Scv none = null;
        System.out.println(none.count);   // 객체가 없어도 된다. 변수의 타입 Scv만 본다
    }

    // 정적 블록은 클래스를 처음 쓸 때 한 번, 적힌 순서대로 돈다
    static void staticBlock() {
        System.out.println("before");
        System.out.println(Table.squares[2]);
        System.out.println(Table.squares[3]);
    }

    // 슬라이드 p.6: 정적 메서드에서 인스턴스 멤버를 쓰려면 객체부터 만든다
    static void viaObject() {
        System.out.println(Robot.makeAndUse());
    }

    // 카드 C3
    static void card() {
        Counter a = new Counter();
        Counter b = new Counter();
        a.inc();
        a.inc();
        b.inc();
        System.out.println(a.own + " " + b.own + " " + Counter.shared);
    }

    public static void main(String[] args) {
        check("calculator", capture(StaticCheck::calculator), "314.159\n15\n5\n");
        check("shared", capture(StaticCheck::shared), "1 2 3\n3\n3\n");
        check("static block", capture(StaticCheck::staticBlock), "before\nblock 1\nblock 2\n4\n9\n");
        check("via object", capture(StaticCheck::viaObject), "10\n");
        check("card C3", capture(StaticCheck::card), "2 1 3\n");
        System.out.println("ALL CHECKS PASSED");
    }

    static String capture(Runnable r) {
        java.io.PrintStream old = System.out;
        java.io.ByteArrayOutputStream buf = new java.io.ByteArrayOutputStream();
        System.setOut(new java.io.PrintStream(buf));
        try { r.run(); } finally { System.setOut(old); }
        return buf.toString();
    }

    static void check(String name, String got, String want) {
        if (!got.equals(want)) throw new AssertionError(name + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.print("[" + name + "]\n" + got);
    }
}

class Calculator {
    static double pi = 3.14159;
    static int plus(int x, int y) { return x + y; }
    static int minus(int x, int y) { return x - y; }
}

class Scv {
    static int count = 0;   // 클래스에 하나
    int id;                 // 객체마다 하나

    Scv() {
        count++;
        id = count;
    }
}

class Table {
    static int[] squares;

    static {
        System.out.println("block 1");
        squares = new int[5];
        for (int i = 0; i < squares.length; i++) {
            squares[i] = i * i;
        }
    }

    static {
        System.out.println("block 2");
    }
}

class Robot {
    int field1;

    int method1() { return field1; }

    static int makeAndUse() {
        Robot obj = new Robot();
        obj.field1 = 10;
        return obj.method1();
    }
}

class Counter {
    static int shared;
    int own;

    void inc() {
        shared++;
        own++;
    }
}
```
{% endraw %}
