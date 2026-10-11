---
layout: "note"
title: "23_java-interface_impl.java"
display_title: "23_java-interface_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "23"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-interface/"
parent_title: "인터페이스"
description: "자바 프로그래밍 · 인터페이스 구현 코드"
permalink: "/studies/java/code/23_java-interface_impl/"
---
{% raw %}
[인터페이스](/Hongs_Blog/studies/java/java-interface/) 문서의 구현 코드다.

```java
// 인터페이스: 선언, 구현 클래스, 상수 필드, 추상 메서드, 인터페이스 타입 변수
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 23_java-interface_impl.java
// 문서(23.인터페이스.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Modifier;

class InterfaceCheck {
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

    // 리모컨을 쓰는 쪽. RemoteControl만 안다.
    static void pressAll(RemoteControl rc) {
        rc.turnOn();
        rc.turnOff();
    }

    public static void main(String[] args) throws Exception {
        // 예시로 보기: 같은 변수에 다른 객체를 넣으면 같은 호출이 다른 일을 한다
        check("예시: 리모컨 바꿔 끼우기", capture(() -> {
            RemoteControl rc;
            rc = new Television();
            rc.turnOn();
            rc = new Lights();
            rc.turnOn();
        }), "Turn on TV\nTurn on lights\n");

        // 상수 필드
        check("상수 필드", capture(() -> {
            System.out.println("Max:" + RemoteControl.MAX_VOLUME);
            System.out.println("Min:" + RemoteControl.MIN_VOLUME);
        }), "Max:10\nMin:0\n");

        // 상수 필드에는 public static final이 자동으로 붙는다
        int m = RemoteControl.class.getField("MAX_VOLUME").getModifiers();
        if (!(Modifier.isPublic(m) && Modifier.isStatic(m) && Modifier.isFinal(m)))
            throw new AssertionError("MAX_VOLUME은 public static final이어야 한다");
        System.out.println("ok: MAX_VOLUME은 public static final");

        // 추상 메서드에는 public abstract가 자동으로 붙는다
        int mm = RemoteControl.class.getMethod("turnOn").getModifiers();
        if (!(Modifier.isPublic(mm) && Modifier.isAbstract(mm)))
            throw new AssertionError("turnOn은 public abstract여야 한다");
        System.out.println("ok: turnOn은 public abstract");

        // 쓰는 쪽 코드는 그대로 두고 객체만 바꾼다
        check("pressAll(TV)", capture(() -> pressAll(new Television())), "Turn on TV\nTurn off TV\n");
        check("pressAll(Lights)", capture(() -> pressAll(new Lights())), "Turn on lights\nTurn off lights\n");

        // null이 든 인터페이스 변수로 메서드를 부르면 NullPointerException
        boolean npe = false;
        try {
            RemoteControl rc = null;
            rc.turnOn();
        } catch (NullPointerException e) { npe = true; }
        if (!npe) throw new AssertionError("null 변수 호출은 NullPointerException이어야 한다");
        System.out.println("ok: null 변수로 호출하면 NullPointerException");

        // 카드 C4
        check("카드 C4", capture(() -> {
            RemoteControl[] rcs = { new Lights(), new Television(), new Lights() };
            for (RemoteControl rc : rcs) rc.turnOn();
            System.out.println(RemoteControl.MAX_VOLUME - RemoteControl.MIN_VOLUME);
        }), "Turn on lights\nTurn on TV\nTurn on lights\n10\n");

        System.out.println("ALL CHECKS PASSED");
    }
}

interface RemoteControl {
    int MAX_VOLUME = 10;   // public static final이 자동으로 붙는다
    int MIN_VOLUME = 0;

    void turnOn();         // public abstract가 자동으로 붙는다
    void turnOff();
}

class Television implements RemoteControl {
    @Override
    public void turnOn() { System.out.println("Turn on TV"); }
    @Override
    public void turnOff() { System.out.println("Turn off TV"); }
}

class Lights implements RemoteControl {
    @Override
    public void turnOn() { System.out.println("Turn on lights"); }
    @Override
    public void turnOff() { System.out.println("Turn off lights"); }
}
```
{% endraw %}
