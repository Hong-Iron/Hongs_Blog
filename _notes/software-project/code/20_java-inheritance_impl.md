---
layout: "note"
title: "20_java-inheritance_impl.java"
display_title: "20_java-inheritance_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "20"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
parent_url: "/studies/software-project/java-inheritance/"
parent_title: "상속"
description: "소프트웨어 프로젝트 · 상속 구현 코드"
permalink: "/studies/software-project/code/20_java-inheritance_impl/"
---
{% raw %}
[상속](/Hongs_Blog/studies/software-project/java-inheritance/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 20_java-inheritance_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「상속」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class InheritanceCheck {
    // 자식은 부모의 필드·메서드를 물려받고, 자기 것을 보탠다
    static void inherit() {
        Scv s = new Scv();
        s.name = "SCV";
        s.health = 45;
        s.move();
        s.gather();
        System.out.println(s.minerals);

        Marine m = new Marine();
        m.name = "Marine";
        m.health = 40;
        m.move();
        m.attack();
    }

    // 자식 객체는 부모 타입이기도 하다. extends가 없는 클래스의 부모는 Object다
    static void isA() {
        Scv s = new Scv();
        System.out.println(s instanceof Unit);
        System.out.println(Scv.class.getSuperclass().getName());
        System.out.println(Unit.class.getSuperclass().getName());
    }

    // 카드 C3
    static void card() {
        Marine m = new Marine();
        m.health = 40;
        m.health -= 15;
        m.damage += 1;
        System.out.println(m.health + " " + m.damage);
    }

    public static void main(String[] args) {
        check("inherit", capture(InheritanceCheck::inherit),
              "SCV moves\nSCV gathers\n8\nMarine moves\nMarine attacks with 6\n");
        check("is-a", capture(InheritanceCheck::isA), "true\nUnit\njava.lang.Object\n");
        check("card C3", capture(InheritanceCheck::card), "25 7\n");
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
    String name;
    int health;

    void move() {
        System.out.println(name + " moves");
    }
}

class Scv extends Unit {
    int minerals;

    void gather() {
        minerals += 8;
        System.out.println(name + " gathers");
    }
}

class Marine extends Unit {
    int damage = 6;

    void attack() {
        System.out.println(name + " attacks with " + damage);
    }
}
```
{% endraw %}
