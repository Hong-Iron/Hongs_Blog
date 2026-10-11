---
layout: "note"
title: "14_java-fields-methods_impl.java"
display_title: "14_java-fields-methods_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "14"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-fields-methods/"
parent_title: "필드와 메서드"
description: "자바 · 필드와 메서드 구현 코드"
permalink: "/studies/java/code/14_java-fields-methods_impl/"
---
{% raw %}
[필드와 메서드](/Hongs_Blog/studies/java/java-fields-methods/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 14_java-fields-methods_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「필드와 메서드」의 예제 출력과 카드 답을 실제 실행 결과와 비교한다.

class FieldsMethodsCheck {
    // 필드는 값을 주지 않아도 기본값으로 채워진다
    static void defaults() {
        Student s = new Student();
        System.out.println(s.name);
        System.out.println(s.grades);
        System.out.println(s.year);
        System.out.println(s.enrolled);
    }

    // 필드는 객체에 남고, 지역 변수는 메서드가 끝나면 사라진다
    static void fieldVsLocal() {
        Wallet w = new Wallet();
        w.earn(1);
        w.earn(2);
        System.out.println(w.total);
    }

    // 메서드 오버로딩(슬라이드의 Calculator에 세 번째 add를 보탰다)
    static void overloading() {
        Calculator c = new Calculator();
        System.out.println(c.add(1, 2));
        System.out.println(c.add(1.5, 2.5));
        System.out.println(c.add(1, 2, 3));
    }

    // 카드 C3: 지역 변수가 같은 이름의 필드를 가린다
    static void card() {
        Box b = new Box();
        b.put();
        b.put();
        System.out.println(b.count);
    }

    public static void main(String[] args) {
        check("defaults", capture(FieldsMethodsCheck::defaults), "null\nnull\n0\nfalse\n");
        check("field vs local", capture(FieldsMethodsCheck::fieldVsLocal), "6\n");
        check("overloading", capture(FieldsMethodsCheck::overloading), "3\n4.0\n6\n");
        check("card C3", capture(FieldsMethodsCheck::card), "4\n");
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
    String name;
    int[] grades;
    int year;
    boolean enrolled;
}

class Wallet {
    int total;                    // 필드: 객체 안에 있다

    void earn(int n) {
        int doubled = n * 2;      // 지역 변수: 이 메서드가 도는 동안만 있다
        total += doubled;
    }
}

class Calculator {
    int add(int x, int y) { return x + y; }
    double add(double x, double y) { return x + y; }
    int add(int x, int y, int z) { return x + y + z; }
}

class Box {
    int count;

    void put() {
        int count = 0;
        count++;
        this.count += 2;
    }
}
```
{% endraw %}
