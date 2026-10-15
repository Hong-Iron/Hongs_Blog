---
layout: "note"
title: "28_java-casting_impl.java"
display_title: "28_java-casting_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "28"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-casting/"
parent_title: "참조 타입 변환과 instanceof"
description: "자바 프로그래밍 · 참조 타입 변환과 instanceof 구현 코드"
sitemap: false
permalink: "/studies/java/code/28_java-casting_impl/"
---
{% raw %}
[참조 타입 변환과 instanceof](/Hongs_Blog/studies/java/java-casting/) 문서의 구현 코드다.

```java
// 참조 타입 변환과 instanceof: 자동 변환, 강제 변환, ClassCastException
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 28_java-casting_impl.java
// 문서(28.참조 타입 변환과 instanceof.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class CastingCheck {
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

    static void ride(Vehicle vehicle) {
        vehicle.run();
        if (vehicle instanceof Bus) {
            Bus bus = (Bus) vehicle;
            bus.checkFare();
        }
    }

    static void rideNew(Vehicle vehicle) {      // Java 16부터: 검사와 변환을 한 번에
        vehicle.run();
        if (vehicle instanceof Bus bus) {
            bus.checkFare();
        }
    }

    public static void main(String[] args) {
        // 자동 변환: 문서의 A, B, C, D, E
        A a;
        B b = new B(); C c = new C(); D d = new D(); E e = new E();
        a = b; a = c; a = d; a = e;
        if (!(a instanceof E && a instanceof C && !(a instanceof B))) throw new AssertionError("a에는 E 객체가 들어 있다");
        System.out.println("ok: B, C, D, E 객체 모두 A 변수에 들어간다");

        // 자동 변환은 객체를 바꾸지 않는다
        Bus original = new Bus();
        Vehicle v = original;
        if (v != original) throw new AssertionError("같은 객체여야 한다");
        System.out.println("ok: 자동 변환 뒤에도 같은 객체");

        // 강제 변환: 문서의 Vehicle과 Bus
        check("강제 변환", capture(() -> {
            Vehicle vehicle = new Bus();
            vehicle.run();
            Bus bus = (Bus) vehicle;
            bus.run();
            bus.checkFare();
            System.out.println(bus == vehicle);
        }), "Bus is running\nBus is running\nCheck fare\ntrue\n");

        // 들어 있는 객체가 Bus가 아니면 실행 중에 ClassCastException
        String msg = null;
        try {
            Vehicle vehicle = new Taxi();
            Bus bus = (Bus) vehicle;
        } catch (ClassCastException ex) { msg = ex.getMessage(); }
        if (msg == null || !msg.contains("Taxi cannot be cast to class Bus")) throw new AssertionError("ClassCastException: " + msg);
        System.out.println("ok: Taxi를 Bus로 바꾸면 ClassCastException");

        // instanceof
        check("instanceof 표", capture(() -> {
            Vehicle v1 = new Bus();
            Vehicle v2 = new Taxi();
            Vehicle v3 = null;
            System.out.println(v1 instanceof Bus);
            System.out.println(v1 instanceof Vehicle);
            System.out.println(v2 instanceof Bus);
            System.out.println(v3 instanceof Bus);
        }), "true\ntrue\nfalse\nfalse\n");

        check("ride(Bus)", capture(() -> ride(new Bus())), "Bus is running\nCheck fare\n");
        check("ride(Taxi)", capture(() -> ride(new Taxi())), "Taxi is running\n");
        check("rideNew(Bus)", capture(() -> rideNew(new Bus())), "Bus is running\nCheck fare\n");
        check("rideNew(Taxi)", capture(() -> rideNew(new Taxi())), "Taxi is running\n");

        // 카드 C2
        check("카드 C2", capture(() -> {
            Vehicle[] list = { new Taxi(), new Bus(), new Taxi() };
            int count = 0;
            for (Vehicle x : list) {
                if (x instanceof Bus) {
                    ((Bus) x).checkFare();
                    count++;
                }
            }
            System.out.println(count);
        }), "Check fare\n1\n");

        // 카드 C3: (가)는 통과, (나)는 ClassCastException
        A x = new D();
        B ok = (B) x;                       // D는 B의 자식이라 통과
        boolean cce = false;
        try { C bad = (C) x; } catch (ClassCastException ex) { cce = true; }
        if (!cce) throw new AssertionError("D를 C로 바꾸면 ClassCastException이어야 한다");
        System.out.println("ok: 카드 C3");

        System.out.println("ALL CHECKS PASSED");
    }
}

interface A { }
class B implements A { }
class C implements A { }
class D extends B { }
class E extends C { }

interface Vehicle { void run(); }

class Bus implements Vehicle {
    @Override
    public void run() { System.out.println("Bus is running"); }
    public void checkFare() { System.out.println("Check fare"); }
}

class Taxi implements Vehicle {
    @Override
    public void run() { System.out.println("Taxi is running"); }
}
```
{% endraw %}
