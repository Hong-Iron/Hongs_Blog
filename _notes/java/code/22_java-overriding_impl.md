---
layout: "note"
title: "22_java-overriding_impl.java"
display_title: "22_java-overriding_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "22"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/java/java-overriding/"
parent_title: "메서드 오버라이딩"
description: "자바 프로그래밍 · 메서드 오버라이딩 구현 코드"
permalink: "/studies/java/code/22_java-overriding_impl/"
---
{% raw %}
[메서드 오버라이딩](/Hongs_Blog/studies/java/java-overriding/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 22_java-overriding_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「메서드 오버라이딩」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class OverridingCheck {
    // 슬라이드 p.7의 Parent / Child
    static void trace() {
        Child child = new Child();
        child.method1();
        child.method2();
        child.method3();
    }

    // 변수 타입이 부모여도 실제 객체의 메서드가 돈다
    static void dynamic() {
        Parent p = new Child();
        p.method2();
        Parent q = new Parent();
        q.method2();
    }

    // 슬라이드 p.9: super.method()로 가려진 부모 메서드를 부른다
    static void superCall() {
        new Worker().method();
    }

    // 매개변수를 다르게 쓰면 오버라이딩이 아니라 오버로딩이다
    static void notOverride() {
        Animal a = new LoudDog();
        a.makeSound();
        LoudDog d = new LoudDog();
        d.makeSound(2);
    }

    // 카드 C2
    static void card() {
        new Y().run();
    }

    public static void main(String[] args) {
        check("trace", capture(OverridingCheck::trace), "Parent.method1\nChild.method2\nChild.method3\n");
        check("dynamic", capture(OverridingCheck::dynamic), "Child.method2\nParent.method2\n");
        check("super call", capture(OverridingCheck::superCall), "작업 처리1\n작업 처리2\n");
        check("not override", capture(OverridingCheck::notOverride), "Some sound\nBark Bark \n");
        check("card C2", capture(OverridingCheck::card), "X\nY\n");
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

class Parent {
    void method1() { System.out.println("Parent.method1"); }
    void method2() { System.out.println("Parent.method2"); }
}

class Child extends Parent {
    @Override
    void method2() { System.out.println("Child.method2"); }
    void method3() { System.out.println("Child.method3"); }
}

class Base {
    public void method() {
        System.out.println("작업 처리1");
    }
}

class Worker extends Base {
    @Override
    public void method() {      // 슬라이드에는 public이 빠져 있어 컴파일되지 않는다
        super.method();
        System.out.println("작업 처리2");
    }
}

class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class LoudDog extends Animal {
    // @Override를 붙이면 컴파일 오류가 난다. 매개변수가 달라 다른 메서드다
    public void makeSound(int times) {
        for (int i = 0; i < times; i++) {
            System.out.print("Bark ");
        }
        System.out.println();
    }
}

class X {
    void hi() { System.out.println("X"); }
    void run() { hi(); }
}

class Y extends X {
    @Override
    void hi() {
        super.hi();
        System.out.println("Y");
    }
}
```
{% endraw %}
