---
layout: "note"
title: "21_java-super-constructor_impl.java"
display_title: "21_java-super-constructor_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "21"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-super-constructor/"
parent_title: "부모 생성자 호출"
description: "자바 프로그래밍 · 부모 생성자 호출 구현 코드"
permalink: "/studies/java/code/21_java-super-constructor_impl/"
---
{% raw %}
[부모 생성자 호출](/Hongs_Blog/studies/java/java-super-constructor/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 21_java-super-constructor_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「부모 생성자 호출」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class SuperConstructorCheck {
    // 자식 생성자 첫 줄에 숨은 super()가 있어 부모 생성자가 먼저 돈다
    static void order() {
        new Marine();
    }

    // 세 층이면 맨 위부터 차례로 돈다
    static void threeLevels() {
        new C();
    }

    // 부모에 매개변수 없는 생성자가 없으면 super(값)을 직접 쓴다
    static void withArgs() {
        Firebat f = new Firebat();
        System.out.println(f.name + " " + f.health + " " + f.damage);
    }

    // 힙에 생기는 객체는 하나다. 부모 생성자 안의 this가 바로 그 자식 객체다
    static void oneObject() {
        Tank t = new Tank();
        System.out.println(Vehicle.seen == t);
        System.out.println(Vehicle.seenClass);
    }

    // 카드 C3
    static void card() {
        new K();
        new K(7);
    }

    public static void main(String[] args) {
        check("order", capture(SuperConstructorCheck::order), "Unit()\nMarine()\n");
        check("three levels", capture(SuperConstructorCheck::threeLevels), "A()\nB()\nC()\n");
        check("with args", capture(SuperConstructorCheck::withArgs), "Firebat 50 8\n");
        check("one object", capture(SuperConstructorCheck::oneObject), "true\nTank\n");
        check("card C3", capture(SuperConstructorCheck::card), "P\nK\nP7\nK7\n");
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

class Unit {
    Unit() {
        System.out.println("Unit()");
    }
}

class Marine extends Unit {
    Marine() {
        // 여기에 컴파일러가 super(); 를 넣는다
        System.out.println("Marine()");
    }
}

class A { A() { System.out.println("A()"); } }
class B extends A { B() { System.out.println("B()"); } }
class C extends B { C() { System.out.println("C()"); } }

class Infantry {
    String name;
    int health;

    Infantry(String name, int health) {   // 매개변수 없는 생성자가 없다
        this.name = name;
        this.health = health;
    }
}

class Firebat extends Infantry {
    int damage;

    Firebat() {
        super("Firebat", 50);
        this.damage = 8;
    }
}

class Vehicle {
    static Object seen;
    static String seenClass;

    Vehicle() {
        seen = this;
        seenClass = getClass().getSimpleName();
    }
}

class Tank extends Vehicle {
}

class P {
    P() { System.out.println("P"); }
    P(int x) { System.out.println("P" + x); }
}

class K extends P {
    K() { System.out.println("K"); }
    K(int x) {
        super(x);
        System.out.println("K" + x);
    }
}
```
{% endraw %}
