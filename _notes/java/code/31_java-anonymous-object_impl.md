---
layout: "note"
title: "31_java-anonymous-object_impl.java"
display_title: "31_java-anonymous-object_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "31"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-anonymous-object/"
parent_title: "익명 객체"
description: "자바 프로그래밍 · 익명 객체 구현 코드"
permalink: "/studies/java/code/31_java-anonymous-object_impl/"
---
{% raw %}
[익명 객체](/Hongs_Blog/studies/java/java-anonymous-object/) 문서의 구현 코드다.

```java
// 익명 객체: 익명 자식 객체, 익명 구현 객체
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 31_java-anonymous-object_impl.java
// 문서(31.익명 객체.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class AnonymousCheck {
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
        // 익명 구현 객체: 클래스를 따로 선언하지 않고 버튼에 할 일을 넘긴다
        check("익명 구현 객체", capture(() -> {
            Button btnOk = new Button();
            btnOk.setClickListener(new Button.ClickListener() {
                @Override
                public void onClick() {
                    System.out.println("OK 버튼을 눌렀다");
                }
            });
            btnOk.click();
        }), "OK 버튼을 눌렀다\n");

        // 익명 자식 객체: 필드, 지역 변수, 매개변수 세 자리
        check("익명 자식 객체 세 자리", capture(() -> {
            Car car = new Car();
            car.run1();
            car.run2();
            car.run3(new Tire() {
                @Override
                void roll() { System.out.println("익명 자식 객체 3이 굴러간다"); }
            });
        }), "익명 자식 객체 1이 굴러간다\n익명 자식 객체 2가 굴러간다\n익명 자식 객체 3이 굴러간다\n");

        // 이름 없는 클래스에도 컴파일러가 붙인 이름이 있다
        Tire plain = new Tire();
        Tire anon = new Tire() {
            @Override
            void roll() { System.out.println("anon"); }
        };
        if (anon.getClass() == Tire.class) throw new AssertionError("익명 객체의 클래스는 Tire가 아니다");
        if (anon.getClass().getSuperclass() != Tire.class) throw new AssertionError("부모는 Tire");
        if (!(anon instanceof Tire)) throw new AssertionError("Tire 타입에 들어간다");
        if (!anon.getClass().getName().equals("AnonymousCheck$3")) throw new AssertionError(anon.getClass().getName());
        if (!anon.getClass().isAnonymousClass() || plain.getClass().isAnonymousClass()) throw new AssertionError("isAnonymousClass");
        System.out.println("ok: 익명 객체의 클래스는 Tire의 자식이고 이름은 " + anon.getClass().getName());

        Button.ClickListener l = new Button.ClickListener() {
            @Override
            public void onClick() { }
        };
        if (l.getClass().getInterfaces()[0] != Button.ClickListener.class) throw new AssertionError("ClickListener를 구현");
        if (l.getClass().getSuperclass() != Object.class) throw new AssertionError("부모는 Object");
        System.out.println("ok: 익명 구현 객체는 ClickListener를 구현한다");

        // 익명 객체는 만들어진 곳의 지역 변수 값을 읽을 수 있다
        check("지역 변수 읽기", capture(() -> {
            String who = "철수";
            Button btn = new Button();
            btn.setClickListener(new Button.ClickListener() {
                @Override
                public void onClick() { System.out.println(who + "가 눌렀다"); }
            });
            btn.click();
        }), "철수가 눌렀다\n");

        // 카드 C3
        check("카드 C3", capture(() -> {
            Tire t1 = new Tire();
            Tire t2 = new Tire() {
                @Override
                void roll() {
                    System.out.println("특수 타이어");
                    super.roll();
                }
            };
            t1.roll();
            t2.roll();
            System.out.println(t1.getClass() == t2.getClass());
        }), "일반 타이어가 굴러간다\n특수 타이어\n일반 타이어가 굴러간다\nfalse\n");

        System.out.println("ALL CHECKS PASSED");
    }
}

class Tire {
    void roll() { System.out.println("일반 타이어가 굴러간다"); }
}

class Car {
    // 필드에 익명 자식 객체를 넣는다
    private Tire tire1 = new Tire() {
        @Override
        void roll() { System.out.println("익명 자식 객체 1이 굴러간다"); }
    };

    void run1() { tire1.roll(); }

    void run2() {
        // 지역 변수에 익명 자식 객체를 넣는다
        Tire tire2 = new Tire() {
            @Override
            void roll() { System.out.println("익명 자식 객체 2가 굴러간다"); }
        };
        tire2.roll();
    }

    // 매개변수로 익명 자식 객체를 받는다
    void run3(Tire tire) { tire.roll(); }
}

class Button {
    static interface ClickListener {
        void onClick();
    }

    private ClickListener clickListener;

    void setClickListener(ClickListener clickListener) {
        this.clickListener = clickListener;
    }

    void click() {
        this.clickListener.onClick();
    }
}
```
{% endraw %}
