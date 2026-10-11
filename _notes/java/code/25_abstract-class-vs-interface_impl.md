---
layout: "note"
title: "25_abstract-class-vs-interface_impl.java"
display_title: "25_abstract-class-vs-interface_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "25"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/abstract-class-vs-interface/"
parent_title: "추상 클래스와 인터페이스 비교"
description: "자바 프로그래밍 · 추상 클래스와 인터페이스 비교 구현 코드"
permalink: "/studies/java/code/25_abstract-class-vs-interface_impl/"
---
{% raw %}
[추상 클래스와 인터페이스 비교](/Hongs_Blog/studies/java/abstract-class-vs-interface/) 문서의 구현 코드다.

```java
// 추상 클래스와 인터페이스 비교: 상태를 물려주는 부모 하나 + 할 수 있는 일을 적은 인터페이스 여럿
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 25_abstract-class-vs-interface_impl.java
// 문서(25.추상 클래스와 인터페이스 비교.md)의 표와 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Modifier;

class ContrastCheck {
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

    public static void main(String[] args) throws Exception {
        // 오리는 Bird 하나를 물려받고, 인터페이스 둘을 구현한다
        check("Duck: 부모 하나 + 인터페이스 둘", capture(() -> {
            Duck d = new Duck("도널드");
            Bird b = d;        // 부모 타입
            Flyable f = d;     // 인터페이스 타입 1
            Swimmable s = d;   // 인터페이스 타입 2
            b.eat();
            f.fly();
            s.swim();
        }), "도널드: 먹는다 (1번째)\n도널드: 난다\n도널드: 헤엄친다\n");

        // 추상 클래스는 객체마다 다른 값을 담는 필드를 둔다
        Duck a = new Duck("A"), b = new Duck("B");
        String out = capture(() -> { a.eat(); a.eat(); b.eat(); });
        check("인스턴스 필드는 객체마다 따로", out, "A: 먹는다 (1번째)\nA: 먹는다 (2번째)\nB: 먹는다 (1번째)\n");

        // 인터페이스의 필드는 모두 public static final
        int m = Flyable.class.getField("MAX_HEIGHT").getModifiers();
        if (!(Modifier.isPublic(m) && Modifier.isStatic(m) && Modifier.isFinal(m)))
            throw new AssertionError("인터페이스 필드는 public static final이어야 한다");
        System.out.println("ok: 인터페이스 필드는 public static final");

        // 추상 클래스에는 생성자가 있고 인터페이스에는 없다
        if (Bird.class.getDeclaredConstructors().length != 1) throw new AssertionError("Bird 생성자 1개");
        if (Flyable.class.getDeclaredConstructors().length != 0) throw new AssertionError("Flyable 생성자 0개");
        System.out.println("ok: 추상 클래스 생성자 1개, 인터페이스 생성자 0개");

        // 부모 클래스는 하나, 구현한 인터페이스는 둘
        if (Duck.class.getSuperclass() != Bird.class) throw new AssertionError("부모는 Bird");
        if (Duck.class.getInterfaces().length != 2) throw new AssertionError("인터페이스 2개");
        System.out.println("ok: Duck의 부모 클래스 1개, 인터페이스 2개");

        System.out.println("ALL CHECKS PASSED");
    }
}

abstract class Bird {
    String name;          // 객체마다 다른 값
    int meals = 0;        // 객체마다 다른 값

    Bird(String name) { this.name = name; }

    void eat() {
        meals++;
        System.out.println(name + ": 먹는다 (" + meals + "번째)");
    }
}

interface Flyable {
    int MAX_HEIGHT = 100;
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck extends Bird implements Flyable, Swimmable {
    Duck(String name) { super(name); }
    @Override
    public void fly() { System.out.println(name + ": 난다"); }
    @Override
    public void swim() { System.out.println(name + ": 헤엄친다"); }
}
```
{% endraw %}
