---
layout: "note"
title: "29_java-polymorphism_impl.java"
display_title: "29_java-polymorphism_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "29"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-polymorphism/"
parent_title: "다형성"
description: "자바 프로그래밍 · 다형성 구현 코드"
sitemap: false
permalink: "/studies/java/code/29_java-polymorphism_impl/"
---
{% raw %}
[다형성](/Hongs_Blog/studies/java/java-polymorphism/) 문서의 구현 코드다.

```java
// 다형성: 필드 다형성(Car와 Tire), 매개변수 다형성(Driver와 Vehicle)
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 29_java-polymorphism_impl.java
// 문서(29.다형성.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class PolymorphismCheck {
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
        // 필드 다형성: 문서의 Car
        check("필드 다형성", capture(() -> {
            Car myCar = new Car();
            myCar.run();
            myCar.tire = new KumhoTire();
            myCar.run();
        }), "Hankook Tire\nKumho Tire\n");

        // 매개변수 다형성: 문서의 Driver
        check("매개변수 다형성", capture(() -> {
            Driver driver = new Driver();
            Bus bus = new Bus();
            Taxi taxi = new Taxi();
            driver.drive(bus);
            driver.drive(taxi);
        }), "Bus is running.\nTaxi is running.\n");

        // 새 구현 클래스를 더해도 Driver는 그대로다
        check("새 클래스 Subway", capture(() -> new Driver().drive(new Subway())), "Subway is running.\n");

        // 배열에 섞어 담고 같은 호출을 되풀이한다 (카드 C3)
        check("카드 C3", capture(() -> {
            Vehicle[] list = { new Taxi(), new Bus(), new Subway(), new Bus() };
            for (Vehicle v : list) v.run();
        }), "Taxi is running.\nBus is running.\nSubway is running.\nBus is running.\n");

        // 보장하지 않는 것 1: 필드는 변수의 타입을 따른다
        check("필드는 변수 타입을 따른다", capture(() -> {
            Parent p = new Child();
            System.out.println(p.name);
            System.out.println(p.getName());
            System.out.println(((Child) p).name);
        }), "parent\nchild\nchild\n");

        // 보장하지 않는 것 2: 정적 메서드는 변수의 타입을 따른다
        check("정적 메서드는 변수 타입을 따른다", capture(() -> {
            Parent p = new Child();
            System.out.println(p.kind());
        }), "Parent\n");

        // 카드 C5
        check("카드 C5", capture(() -> {
            Car car = new Car();
            Tire t = car.tire;
            car.tire = new KumhoTire();
            t.roll();
            car.run();
        }), "Hankook Tire\nKumho Tire\n");

        System.out.println("ALL CHECKS PASSED");
    }
}

interface Tire { void roll(); }

class HankookTire implements Tire {
    @Override
    public void roll() { System.out.println("Hankook Tire"); }
}

class KumhoTire implements Tire {
    @Override
    public void roll() { System.out.println("Kumho Tire"); }
}

class Car {
    Tire tire = new HankookTire();
    void run() { tire.roll(); }
}

interface Vehicle { void run(); }

class Driver {
    public void drive(Vehicle vehicle) { vehicle.run(); }
}

class Bus implements Vehicle {
    @Override
    public void run() { System.out.println("Bus is running."); }
}

class Taxi implements Vehicle {
    @Override
    public void run() { System.out.println("Taxi is running."); }
}

class Subway implements Vehicle {
    @Override
    public void run() { System.out.println("Subway is running."); }
}

class Parent {
    String name = "parent";
    String getName() { return name; }
    static String kind() { return "Parent"; }
}

class Child extends Parent {
    String name = "child";
    @Override
    String getName() { return name; }
    static String kind() { return "Child"; }
}
```
{% endraw %}
