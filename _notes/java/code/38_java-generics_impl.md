---
layout: "note"
title: "38_java-generics_impl.java"
display_title: "38_java-generics_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "38"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-generics/"
parent_title: "제네릭"
description: "자바 프로그래밍 · 제네릭 구현 코드"
sitemap: false
permalink: "/studies/java/code/38_java-generics_impl/"
---
{% raw %}
[제네릭](/Hongs_Blog/studies/java/java-generics/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 38_java-generics_impl.java
// (JDK 21. 이 파일이 있는 폴더에서 실행한다. 다른 파일을 불러오지 않는다.)
// 문서 「제네릭」의 예제 출력과 카드의 답을 확인한다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class GenericsImpl {

    // System.out에 찍히는 글자를 모아 문자열로 돌려준다.
    interface Body { void run() throws Throwable; }
    static String capture(Body body) throws Throwable {
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf, true));
        try {
            body.run();
        } finally {
            System.setOut(old);
        }
        return buf.toString().replace("\r\n", "\n");
    }
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError("FAILED: " + what);
        System.out.println("ok  " + what);
    }
    static void same(String got, String want, String what) {
        if (!got.equals(want)) throw new AssertionError("FAILED: " + what + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.println("ok  " + what);
    }

    // 제네릭이 없을 때: 무엇이든 담으려면 Object로 받는다
    static class ObjectBox {
        public Object content;
    }

    // 슬라이드 p.4 Box<T>
    static class Box<T> {
        public T content;
    }

    // 슬라이드 p.6 Product<K, M>
    static class Product<K, M> {
        private K kind;
        private M model;

        public K getKind() { return this.kind; }
        public M getModel() { return this.model; }
        public void setKind(K kind) { this.kind = kind; }
        public void setModel(M model) { this.model = model; }
    }
    static class Tv {}
    static class Car {}

    // 슬라이드 p.8 boxing
    public static <T> Box<T> boxing(T t) {
        Box<T> box = new Box<>();
        box.content = t;
        return box;
    }

    // 슬라이드 p.9 ClassName<E>
    static class ClassName<E> {
        private E element;

        void setElement(E element) {
            this.element = element;
        }

        E get() {
            return element;
        }

        // 메서드가 따로 정한 <E>가 클래스의 E를 가린다
        public <E> E genericMethod1(E o) {
            return o;
        }

        public <T> T genericMethod2(T o) {
            return o;
        }
    }
    static void slideP9() {
        ClassName<String> a = new ClassName<>();
        ClassName<Integer> b = new ClassName<>();

        a.setElement("10");
        b.setElement(10);

        System.out.println(a.get().getClass().getName());
        System.out.println(b.get().getClass().getName());

        System.out.println(a.genericMethod1(10).getClass().getName());
        System.out.println(b.genericMethod2("10").getClass().getName());
    }

    // 카드 C2
    static <T> T pick(T first, T second) {
        return second;
    }
    static void cardC2() {
        Box<String> b1 = boxing("7");
        Box<Integer> b2 = boxing(7);
        System.out.println(b1.content + b1.content);
        System.out.println(b2.content + b2.content);
        System.out.println(pick("x", "y"));
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public static void main(String[] args) throws Throwable {
        // 1. Object 상자: 꺼낼 때마다 강제 변환이 필요하고, 틀리면 실행 중에 터진다
        ObjectBox ob = new ObjectBox();
        ob.content = 100;
        boolean blewUp = false;
        try {
            String s = (String) ob.content;
        } catch (ClassCastException e) {
            blewUp = true;
        }
        check(blewUp, "Object 상자: 잘못 꺼내면 ClassCastException(실행 중)");

        // 2. p.4
        Box<String> box1 = new Box<>();
        box1.content = "hello world!";
        String str = box1.content;          // 강제 변환이 없다
        check(str.equals("hello world!"), "p.4: Box<String>에서 String을 그대로 꺼낸다");

        // 3. p.6
        Product<Tv, String> product1 = new Product<>();
        Tv tv1 = new Tv();
        product1.setKind(tv1);
        product1.setModel("Smart Tv");
        Tv tv2 = product1.getKind();
        String tvModel = product1.getModel();
        check(tv2 == tv1 && tvModel.equals("Smart Tv"), "p.6: Product<Tv, String>");
        Car car1 = new Car();
        Product<Car, String> product2 = new Product<>();
        product2.setKind(car1);
        product2.setModel("SUV");
        Car car2 = product2.getKind();
        String carModel = product2.getModel();
        check(car2 == car1 && carModel.equals("SUV"), "p.6: Product<Car, String>");

        // 4. p.8: 인자를 보고 T를 정한다
        Box<Integer> b1 = boxing(100);
        Box<String> b2 = boxing("안녕하세요");
        check(b1.content == 100 && b2.content.equals("안녕하세요"), "p.8: boxing(100), boxing(\"안녕하세요\")");
        check(((Object) b1.content).getClass() == Integer.class, "boxing(100)의 내용물은 Integer(int가 아니다)");

        // 5. p.9
        same(capture(GenericsImpl::slideP9),
                "java.lang.String\njava.lang.Integer\njava.lang.Integer\njava.lang.String\n", "p.9 출력");

        // 6. 타입을 안 적으면 Object로 다룬다 (p.5)
        Box raw = new Box();
        raw.content = "x";
        Object o = raw.content;             // String이 아니라 Object로만 꺼낼 수 있다
        check(o.equals("x"), "타입을 안 적은 Box의 content는 Object");

        // 7. Box<String>과 Box<Integer>는 실행 중에는 같은 클래스 하나다
        check(new Box<String>().getClass() == new Box<Integer>().getClass(), "실행 중 클래스는 Box 하나");

        // 8. 카드
        same(capture(GenericsImpl::cardC2), "77\n14\ny\n", "카드 C2 출력");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
