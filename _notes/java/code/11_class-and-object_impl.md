---
layout: "note"
title: "11_class-and-object_impl.java"
display_title: "11_class-and-object_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "11"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/class-and-object/"
parent_title: "클래스와 객체"
description: "자바 프로그래밍 · 클래스와 객체 구현 코드"
permalink: "/studies/java/code/11_class-and-object_impl/"
---
{% raw %}
[클래스와 객체](/Hongs_Blog/studies/java/class-and-object/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 11_class-and-object_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「클래스와 객체」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class ClassAndObjectCheck {
    // 예시로 보기: 사령부가 건설로봇을 만들고, 로봇마다 값이 따로 논다
    static void demo() {
        CommandCenter cc = new CommandCenter();
        Scv a = cc.makeScv();
        Scv b = cc.makeScv();
        a.gather();
        a.gather();
        System.out.println(a.name + " " + a.minerals);
        System.out.println(b.name + " " + b.minerals);
        Scv c = a;          // 새 객체가 아니다. 같은 객체를 가리키는 변수가 하나 더 생긴다
        c.gather();
        System.out.println(a.minerals);
        System.out.println(a == c);
        System.out.println(a == b);
        System.out.println(cc.made);
    }

    // 카드 C3
    static void card() {
        Scv x = new Scv();
        Scv y = new Scv();
        Scv z = y;
        x.health = 10;
        z.health = 20;
        System.out.println(x.health + " " + y.health + " " + z.health);
    }

    public static void main(String[] args) {
        check("demo", capture(ClassAndObjectCheck::demo), "SCV1 16\nSCV2 0\n24\ntrue\nfalse\n2\n");
        check("card C3", capture(ClassAndObjectCheck::card), "10 20 20\n");
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

// 클래스: 건설로봇의 설계도. 속성은 필드, 동작은 메서드
class Scv {
    String name;
    int health = 45;
    int damage = 5;
    int minerals = 0;

    void gather() {
        minerals += 8;
    }
}

class CommandCenter {
    int made = 0;

    // 객체가 다른 객체를 만든다(객체끼리 주고받기)
    Scv makeScv() {
        made++;
        Scv s = new Scv();
        s.name = "SCV" + made;
        return s;
    }
}
```
{% endraw %}
