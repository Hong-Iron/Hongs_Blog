---
layout: "note"
title: "12_oop-principles_impl.java"
display_title: "12_oop-principles_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "12"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/oop-principles/"
parent_title: "객체 지향의 세 원칙"
description: "자바 프로그래밍 · 객체 지향의 세 원칙 구현 코드"
permalink: "/studies/java/code/12_oop-principles_impl/"
---
{% raw %}
[객체 지향의 세 원칙](/Hongs_Blog/studies/java/oop-principles/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 12_oop-principles_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「객체 지향의 세 원칙」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class OopPrinciplesCheck {
    // 캡슐화: 밖에서는 허락된 메서드로만 체력을 바꾼다
    static void encapsulation() {
        Marine m = new Marine();
        m.hit(30);
        System.out.println(m.getHealth());
        m.hit(30);
        System.out.println(m.getHealth());
        System.out.println(m.isAlive());
    }

    // 상속: Marine에는 move를 쓰지 않았지만 Unit에서 물려받아 쓴다
    static void inheritance() {
        Marine m = new Marine();
        m.move();
        m.attack();
    }

    // 다형성 1: 오버로딩(슬라이드의 Calculator)
    static void overloading() {
        Calculator c = new Calculator();
        System.out.println(c.add(1, 2));
        System.out.println(c.add(1.5, 2.0));
        System.out.println(c.add(1, 2.0));
    }

    // 다형성 2: 오버라이딩(슬라이드의 Animal)
    static void overriding() {
        Animal[] zoo = { new Animal(), new Dog(), new Cat() };
        for (Animal a : zoo) {
            a.makeSound();
        }
    }

    // 오버로딩은 변수 타입으로, 오버라이딩은 실제 객체로 고른다
    static String who(Animal a) { return "who(Animal)"; }
    static String who(Dog d) { return "who(Dog)"; }

    static void staticVsDynamic() {
        Animal x = new Dog();
        System.out.println(who(x));
        x.makeSound();
        Dog y = new Dog();
        System.out.println(who(y));
    }

    public static void main(String[] args) {
        check("encapsulation", capture(OopPrinciplesCheck::encapsulation), "10\n0\nfalse\n");
        check("inheritance", capture(OopPrinciplesCheck::inheritance), "Marine moves\nMarine attacks with 6\n");
        check("overloading", capture(OopPrinciplesCheck::overloading), "3\n3.5\n3.0\n");
        check("overriding", capture(OopPrinciplesCheck::overriding), "Some sound\nBark\nMeow\n");
        check("static vs dynamic", capture(OopPrinciplesCheck::staticVsDynamic), "who(Animal)\nBark\nwho(Dog)\n");
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
    private int health;
    private String name;

    Unit(String name, int health) {
        this.name = name;
        this.health = health;
    }

    int getHealth() { return health; }
    boolean isAlive() { return health > 0; }

    // 체력은 0 아래로 내려가지 않는다. 이 규칙을 지키는 길은 이 메서드뿐이다
    void hit(int damage) {
        health = Math.max(0, health - damage);
    }

    void move() {
        System.out.println(name + " moves");
    }
}

class Marine extends Unit {
    int damage = 6;

    Marine() {
        super("Marine", 40);
    }

    void attack() {
        System.out.println("Marine attacks with " + damage);
    }
}

class Calculator {
    public int add(int x, int y) {
        return x + y;
    }

    public double add(double x, double y) {
        return x + y;
    }
}

class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Bark");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}
```
{% endraw %}
