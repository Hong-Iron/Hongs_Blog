---
layout: "note"
title: "27_java-interface-inheritance_impl.java"
display_title: "27_java-interface-inheritance_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-interface-inheritance/"
parent_title: "다중 구현과 인터페이스 상속"
description: "자바 프로그래밍 · 다중 구현과 인터페이스 상속 구현 코드"
sitemap: false
permalink: "/studies/java/code/27_java-interface-inheritance_impl/"
---
{% raw %}
[다중 구현과 인터페이스 상속](/Hongs_Blog/studies/java/java-interface-inheritance/) 문서의 구현 코드다.

```java
// 다중 구현과 인터페이스 상속
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 27_java-interface-inheritance_impl.java
// 문서(27.다중 구현과 인터페이스 상속.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class InterfaceInheritanceCheck {
    static String capture(Runnable r) {
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));
        try { r.run(); } finally { System.setOut(old); }
        return buf.toString();
    }

    static void check(String name, String got, String want) {
        if (!got.equals(want)) throw new AssertionError(name + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.println("ok: " + name);
    }

    public static void main(String[] args) {
        // 다중 구현: 한 객체를 두 인터페이스 변수에 넣는다
        check("다중 구현", capture(() -> {
            SmartTelevision tv = new SmartTelevision();
            RemoteControl rc = tv;
            Searchable sc = tv;
            rc.turnOn();
            sc.search("java");
            System.out.println(rc == sc);
        }), "Turn on TV\nSearch: java\ntrue\n");

        // 인터페이스 상속: 문서의 InterfaceA, B, C
        check("인터페이스 상속", capture(() -> {
            InterfaceCImpl impl = new InterfaceCImpl();
            InterfaceA ia = impl;
            ia.methodA();
            InterfaceB ib = impl;
            ib.methodB();
            InterfaceC ic = impl;
            ic.methodA();
            ic.methodB();
            ic.methodC();
        }), "methodA\nmethodB\nmethodA\nmethodB\nmethodC\n");

        // 두 인터페이스가 같은 디폴트 메서드를 가지면 구현 클래스가 다시 정의해야 한다
        check("디폴트 메서드 충돌을 푼다", capture(() -> new Robot().hello()), "Walker hello\nTalker hello\nRobot hello\n");

        // 카드 C3
        check("카드 C3", capture(() -> {
            InterfaceC ic = new InterfaceCImpl();
            InterfaceA ia = ic;
            ia.methodA();
            ic.methodC();
            System.out.println(ia instanceof InterfaceB);
        }), "methodA\nmethodC\ntrue\n");

        System.out.println("ALL CHECKS PASSED");
    }
}

interface RemoteControl { void turnOn(); }
interface Searchable { void search(String url); }

class SmartTelevision implements RemoteControl, Searchable {
    @Override
    public void turnOn() { System.out.println("Turn on TV"); }
    @Override
    public void search(String url) { System.out.println("Search: " + url); }
}

interface InterfaceA { void methodA(); }
interface InterfaceB { void methodB(); }
interface InterfaceC extends InterfaceA, InterfaceB { void methodC(); }

class InterfaceCImpl implements InterfaceC {
    public void methodA() { System.out.println("methodA"); }
    public void methodB() { System.out.println("methodB"); }
    public void methodC() { System.out.println("methodC"); }
}

interface Walker { default void hello() { System.out.println("Walker hello"); } }
interface Talker { default void hello() { System.out.println("Talker hello"); } }

class Robot implements Walker, Talker {
    @Override
    public void hello() {
        Walker.super.hello();
        Talker.super.hello();
        System.out.println("Robot hello");
    }
}
```
{% endraw %}
