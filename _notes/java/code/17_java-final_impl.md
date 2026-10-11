---
layout: "note"
title: "17_java-final_impl.java"
display_title: "17_java-final_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "17"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/java/java-final/"
parent_title: "final과 상수"
description: "자바 프로그래밍 · final과 상수 구현 코드"
permalink: "/studies/java/code/17_java-final_impl/"
---
{% raw %}
[final과 상수](/Hongs_Blog/studies/java/java-final/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 17_java-final_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「final과 상수」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

import java.util.Arrays;

class FinalCheck {
    // final 필드: 선언할 때 넣거나(school) 생성자에서 넣는다(id). 그 뒤로는 못 바꾼다
    static void finalField() {
        Student a = new Student("2024001", "Alice");
        Student b = new Student("2024002", "Bob");
        a.name = "Alicia";      // final이 아닌 필드는 바꿀 수 있다
        System.out.println(a.school + " " + a.id + " " + a.name);
        System.out.println(b.school + " " + b.id + " " + b.name);
    }

    // 상수: static final. 객체 없이 클래스 이름으로 쓴다
    static void constant() {
        System.out.println(Game.MAX_HEALTH);
        System.out.println(10 * 10 * Game.PI);
    }

    // final은 "변수가 가리키는 대상"을 못 바꾸게 할 뿐, 대상의 속은 막지 않는다
    static void finalReference() {
        Squad s = new Squad();
        s.healths[0] = 100;
        System.out.println(Arrays.toString(s.healths));
    }

    public static void main(String[] args) {
        check("final field", capture(FinalCheck::finalField),
              "CAU 2024001 Alicia\nCAU 2024002 Bob\n");
        check("constant", capture(FinalCheck::constant), "45\n314.159\n");
        check("final reference", capture(FinalCheck::finalReference), "[100, 45, 45]\n");
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
    final String school = "CAU";   // 선언할 때 값을 준다
    final String id;               // 생성자에서 값을 준다
    String name;

    Student(String id, String name) {
        this.id = id;
        this.name = name;
    }
}

class Game {
    static final int MAX_HEALTH = 45;
    static final double PI = 3.14159;
}

class Squad {
    final int[] healths = {45, 45, 45};
}
```
{% endraw %}
