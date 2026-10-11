---
layout: "note"
title: "30_java-nested-class_impl.java"
display_title: "30_java-nested-class_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "30"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-nested-class/"
parent_title: "중첩 클래스"
description: "자바 · 중첩 클래스 구현 코드"
permalink: "/studies/java/code/30_java-nested-class_impl/"
---
{% raw %}
[중첩 클래스](/Hongs_Blog/studies/java/java-nested-class/) 문서의 구현 코드다.

```java
// 중첩 클래스: 인스턴스 멤버 클래스, 정적 멤버 클래스, 로컬 클래스, 바깥 멤버 접근, 중첩 인터페이스
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 30_java-nested-class_impl.java
// 문서(30.중첩 클래스.md)에 실은 출력과 카드의 답을 직접 비교한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class NestedClassCheck {
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
        // 세 종류를 만드는 법
        check("세 종류 만들기", capture(() -> {
            A a = new A();
            A.B b = a.new B();      // 인스턴스 멤버 클래스: A 객체가 먼저 있어야 한다
            b.show();
            A.C c = new A.C();      // 정적 멤버 클래스: A 객체 없이 만든다
            c.show();
            a.method();             // 로컬 클래스: 메서드가 실행되는 동안에만 만든다
        }), "B: 10, 20\nC: 20\nD: 10, 30\n");

        // 인스턴스 멤버 클래스의 객체는 자기를 만든 바깥 객체에 묶인다
        check("바깥 객체에 묶인다", capture(() -> {
            A a1 = new A();
            A a2 = new A();
            a2.field = 99;
            A.B b1 = a1.new B();
            A.B b2 = a2.new B();
            b1.show();
            b2.show();
        }), "B: 10, 20\nB: 99, 20\n");

        // 바깥클래스이름.this
        check("Outer.this", capture(() -> {
            Outer outer = new Outer();
            Outer.Inner inner = outer.new Inner();
            inner.print();
        }), "local\ninner\nouter\n");

        // 컴파일하면 클래스 파일 이름은 바깥$안
        if (!A.B.class.getName().equals("A$B")) throw new AssertionError(A.B.class.getName());
        if (!A.C.class.getName().equals("A$C")) throw new AssertionError(A.C.class.getName());
        System.out.println("ok: 클래스 이름 A$B, A$C");

        // 중첩 인터페이스: Button.ClickListener
        check("중첩 인터페이스", capture(() -> {
            Button btnOk = new Button();
            btnOk.setClickListener(new OkListener());
            btnOk.click();
            btnOk.setClickListener(new CancelListener());
            btnOk.click();
        }), "OK 버튼을 눌렀다\nCancel 버튼을 눌렀다\n");

        // 카드 C3
        check("카드 C3", capture(() -> {
            Outer o1 = new Outer();
            Outer o2 = new Outer();
            o2.name = "second";
            Outer.Inner in = o2.new Inner();
            o1.name = "first";
            in.print();
        }), "local\ninner\nsecond\n");

        System.out.println("ALL CHECKS PASSED");
    }
}

class A {
    int field = 10;            // 인스턴스 필드
    static int sfield = 20;    // 정적 필드

    class B {                  // 인스턴스 멤버 클래스
        void show() { System.out.println("B: " + field + ", " + sfield); }
    }

    static class C {           // 정적 멤버 클래스
        void show() { System.out.println("C: " + sfield); }   // field는 쓸 수 없다
    }

    void method() {
        int local = 30;
        class D {              // 로컬 클래스
            void show() { System.out.println("D: " + field + ", " + local); }
        }
        D d = new D();
        d.show();
    }
}

class Outer {
    String name = "outer";

    class Inner {
        String name = "inner";

        void print() {
            String name = "local";
            System.out.println(name);             // 지역 변수
            System.out.println(this.name);        // Inner 객체의 필드
            System.out.println(Outer.this.name);  // 바깥 Outer 객체의 필드
        }
    }
}

class Button {
    static interface ClickListener {   // 정적 중첩 인터페이스
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

class OkListener implements Button.ClickListener {
    @Override
    public void onClick() { System.out.println("OK 버튼을 눌렀다"); }
}

class CancelListener implements Button.ClickListener {
    @Override
    public void onClick() { System.out.println("Cancel 버튼을 눌렀다"); }
}
```
{% endraw %}
