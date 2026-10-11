---
layout: "note"
title: "19_java-access-modifier_impl.java"
display_title: "19_java-access-modifier_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "19"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-access-modifier/"
parent_title: "접근 제한자"
description: "자바 프로그래밍 · 접근 제한자 구현 코드"
permalink: "/studies/java/code/19_java-access-modifier_impl/"
---
{% raw %}
[접근 제한자](/Hongs_Blog/studies/java/java-access-modifier/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 19_java-access-modifier_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「접근 제한자」의 getter·setter 예제와 카드 답을 실제 실행 결과와 비교한다.
// 패키지를 넘는 접근 실험(public / protected / default / private)은 파일이 여럿 필요해
// 문서에 명령과 결과를 적었다.

class AccessModifierCheck {
    // setter가 값을 검사해서 맞는 값만 넣는다
    static void setter() {
        Scv s = new Scv();
        s.setHealth(30);
        System.out.println(s.getHealth());
        s.setHealth(-10);
        System.out.println(s.getHealth());
        s.setHealth(100);
        System.out.println(s.getHealth());
    }

    // getter가 밖에서 쓰기 좋은 값으로 바꿔서 돌려준다
    static void getter() {
        Scv s = new Scv();
        System.out.println(s.getName());
        s.setName("SCV-1");
        System.out.println(s.getName());
    }

    // private 생성자: 클래스 안에서만 new 할 수 있다
    static void privateConstructor() {
        Map a = Map.getInstance();
        Map b = Map.getInstance();
        System.out.println(a == b);
    }

    public static void main(String[] args) {
        check("setter", capture(AccessModifierCheck::setter), "30\n0\n45\n");
        check("getter", capture(AccessModifierCheck::getter), "(이름 없음)\nSCV-1\n");
        check("private constructor", capture(AccessModifierCheck::privateConstructor), "true\n");
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

class Scv {
    private int health = 45;
    private String name;

    public int getHealth() {
        return health;
    }

    public void setHealth(int health) {
        if (health < 0) {
            this.health = 0;
        } else if (health > 45) {
            this.health = 45;
        } else {
            this.health = health;
        }
    }

    public String getName() {
        if (name == null) {
            return "(이름 없음)";
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

class Map {
    private static Map only = new Map();

    private Map() {}

    static Map getInstance() {
        return only;
    }
}
```
{% endraw %}
