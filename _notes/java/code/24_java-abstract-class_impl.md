---
layout: "note"
title: "24_java-abstract-class_impl.java"
display_title: "24_java-abstract-class_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "24"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-abstract-class/"
parent_title: "추상 클래스"
description: "자바 · 추상 클래스 구현 코드"
permalink: "/studies/java/code/24_java-abstract-class_impl/"
---
{% raw %}
[추상 클래스](/Hongs_Blog/studies/java/java-abstract-class/) 문서의 구현 코드다.

```java
// 추상 클래스: 공통 필드·생성자·메서드는 부모에, 자식마다 다른 몸통은 추상 메서드로
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 24_java-abstract-class_impl.java
// 문서(24.추상 클래스.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Modifier;

class AbstractClassCheck {
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
        check("예시: Dog와 Cat", capture(() -> {
            Animal a = new Dog("바둑이");
            a.breathe();
            a.sound();
            a = new Cat("나비");
            a.breathe();
            a.sound();
        }), "바둑이: 숨을 쉰다\n멍멍\n나비: 숨을 쉰다\n야옹\n");

        // 추상 클래스에도 생성자가 있고, 자식 객체를 만들 때 먼저 실행된다
        check("카드 C3: 생성자 순서", capture(() -> {
            Shape s = new Circle();
            s.describe();
        }), "Shape 생성자\nCircle 생성자\n넓이를 잴 수 있는 도형: 원\n");

        if (!Modifier.isAbstract(Animal.class.getModifiers())) throw new AssertionError("Animal은 abstract여야 한다");
        System.out.println("ok: Animal은 abstract 클래스");

        System.out.println("ALL CHECKS PASSED");
    }
}

abstract class Animal {
    String name;                       // 공통 필드

    Animal(String name) {              // 생성자도 둘 수 있다
        this.name = name;
    }

    void breathe() {                   // 몸통이 있는 보통 메서드
        System.out.println(name + ": 숨을 쉰다");
    }

    abstract void sound();             // 추상 메서드: 선언만 있고 몸통이 없다
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override
    void sound() { System.out.println("멍멍"); }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    @Override
    void sound() { System.out.println("야옹"); }
}

abstract class Shape {
    Shape() { System.out.println("Shape 생성자"); }
    abstract String name();
    void describe() { System.out.println("넓이를 잴 수 있는 도형: " + name()); }
}

class Circle extends Shape {
    Circle() { System.out.println("Circle 생성자"); }
    @Override
    String name() { return "원"; }
}
```
{% endraw %}
