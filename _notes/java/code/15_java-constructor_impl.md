---
layout: "note"
title: "15_java-constructor_impl.java"
display_title: "15_java-constructor_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "15"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-constructor/"
parent_title: "생성자"
description: "자바 프로그래밍 · 생성자 구현 코드"
sitemap: false
permalink: "/studies/java/code/15_java-constructor_impl/"
---
{% raw %}
[생성자](/Hongs_Blog/studies/java/java-constructor/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 15_java-constructor_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「생성자」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

import java.util.Arrays;

class ConstructorCheck {
    // 슬라이드 p.15의 생성자 세 개. 넘긴 값의 개수와 타입으로 생성자가 골라진다
    static void overloading() {
        int[] grades = {90, 85, 88};
        Student s1 = new Student();
        Student s2 = new Student("Alice");
        Student s3 = new Student("Bob", grades);
        System.out.println(s1.name + " " + Arrays.toString(s1.grades));
        System.out.println(s2.name + " " + Arrays.toString(s2.grades));
        System.out.println(s3.name + " " + Arrays.toString(s3.grades));
    }

    // this를 빼먹으면 매개변수에 매개변수를 넣는 꼴이 된다
    static void missingThis() {
        Wrong w = new Wrong("Alice");
        Right r = new Right("Alice");
        System.out.println(w.name);
        System.out.println(r.name);
    }

    // this(...)로 다른 생성자에게 일을 넘긴다
    static void thisCall() {
        Scv a = new Scv();
        Scv b = new Scv("SCV-7");
        System.out.println(a.name + " " + a.health);
        System.out.println(b.name + " " + b.health);
    }

    // new를 할 때마다 다른 객체가 생긴다
    static void twoObjects() {
        Scv a = new Scv();
        Scv b = new Scv();
        System.out.println(a == b);
    }

    // 카드 C3: 필드 초기값 → 생성자 본문 순서
    static void card() {
        Tank t = new Tank(3);
        System.out.println(t.fuel);
    }

    public static void main(String[] args) {
        check("overloading", capture(ConstructorCheck::overloading),
              "null null\nAlice null\nBob [90, 85, 88]\n");
        check("missing this", capture(ConstructorCheck::missingThis), "null\nAlice\n");
        check("this(...)", capture(ConstructorCheck::thisCall), "SCV 45\nSCV-7 45\n");
        check("two objects", capture(ConstructorCheck::twoObjects), "false\n");
        check("card C3", capture(ConstructorCheck::card), "10\n13\n");
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

class Student {
    public String name;
    public int[] grades;

    // Constructor 1
    public Student() {}

    // Constructor 2
    public Student(String name) {
        this.name = name;
    }

    // Constructor 3
    public Student(String name, int[] grades) {
        this.name = name;
        this.grades = grades;
    }
}

class Wrong {
    String name;

    Wrong(String name) {
        name = name;        // 양쪽 다 매개변수 name이다. 필드는 그대로 null
    }
}

class Right {
    String name;

    Right(String name) {
        this.name = name;   // 왼쪽은 이 객체의 필드, 오른쪽은 매개변수
    }
}

class Scv {
    String name;
    int health;

    Scv() {
        this("SCV");
    }

    Scv(String name) {
        this(name, 45);
    }

    Scv(String name, int health) {
        this.name = name;
        this.health = health;
    }
}

class Tank {
    int fuel = 10;

    Tank(int extra) {
        System.out.println(fuel);
        fuel = fuel + extra;
    }
}
```
{% endraw %}
