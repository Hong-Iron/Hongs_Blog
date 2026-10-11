---
layout: "note"
title: "39_java-bounded-wildcard_impl.java"
display_title: "39_java-bounded-wildcard_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "39"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/java/java-bounded-wildcard/"
parent_title: "제한된 타입 파라미터와 와일드카드"
description: "자바 프로그래밍 · 제한된 타입 파라미터와 와일드카드 구현 코드"
permalink: "/studies/java/code/39_java-bounded-wildcard_impl/"
---
{% raw %}
[제한된 타입 파라미터와 와일드카드](/Hongs_Blog/studies/java/java-bounded-wildcard/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 39_java-bounded-wildcard_impl.java
// (JDK 21. 이 파일이 있는 폴더에서 실행한다. 다른 파일을 불러오지 않는다.)
// 문서 「제한된 타입 파라미터와 와일드카드」의 예제 출력과 카드의 답을 확인한다.
// 컴파일 오류가 나는 줄은 주석으로 두었다. 오류 문구는 문서에 적은 대로 JDK 21 javac로 따로 확인했다.
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class BoundedWildcardImpl {

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

    // 슬라이드 p.10
    public static <T extends Number> boolean compare(T t1, T t2) {
        double v1 = t1.doubleValue();   // Number의 doubleValue()
        double v2 = t2.doubleValue();
        return (v1 == v2);
    }

    // 위쪽 끝을 인터페이스로: 가장 큰 것 고르기 (보충)
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    // 슬라이드 p.12
    static class Person {}
    static class Worker extends Person {}
    static class Student extends Person {}
    static class HighStudent extends Student {}
    static class MiddleStudent extends Student {}

    static class Applicant<T> {
        public T kind;
        public Applicant(T kind) {
            this.kind = kind;
        }
    }

    // 슬라이드 p.13 Course
    static class Course {
        // 누구나
        public static void registerCourse1(Applicant<?> applicant) {
            System.out.println(applicant.kind.getClass().getSimpleName() + " registered the Course1.");
        }
        // Student와 그 자식만
        public static void registerCourse2(Applicant<? extends Student> applicant) {
            System.out.println(applicant.kind.getClass().getSimpleName() + " registered the Course2.");
        }
        // Worker와 그 조상만
        public static void registerCourse3(Applicant<? super Worker> applicant) {
            System.out.println(applicant.kind.getClass().getSimpleName() + " registered the Course3.");
        }
    }

    // 슬라이드 p.14 Main
    static void slideMain() {
        Course.registerCourse1(new Applicant<Person>(new Person()));
        Course.registerCourse1(new Applicant<Worker>(new Worker()));
        Course.registerCourse1(new Applicant<Student>(new Student()));
        Course.registerCourse1(new Applicant<HighStudent>(new HighStudent()));
        Course.registerCourse1(new Applicant<MiddleStudent>(new MiddleStudent()));

        // Course.registerCourse2(new Applicant<Person>(new Person()));   // 컴파일 오류
        // Course.registerCourse2(new Applicant<Worker>(new Worker()));   // 컴파일 오류
        Course.registerCourse2(new Applicant<Student>(new Student()));
        Course.registerCourse2(new Applicant<HighStudent>(new HighStudent()));

        Course.registerCourse3(new Applicant<Person>(new Person()));
        Course.registerCourse3(new Applicant<Worker>(new Worker()));
        // Course.registerCourse3(new Applicant<Student>(new Student()));         // 컴파일 오류
        // Course.registerCourse3(new Applicant<HighStudent>(new HighStudent())); // 컴파일 오류
    }

    public static void main(String[] args) throws Throwable {
        // 1. compare
        check(!compare(10, 20), "compare(10, 20) = false");
        check(compare(10, 10.0), "compare(10, 10.0) = true (둘 다 double 10.0으로 바꿔 견준다)");
        check(compare(4.5, 4.5), "compare(4.5, 4.5) = true");
        check(max(3, 8) == 8 && max("apple", "banana").equals("banana"), "max: Comparable을 구현한 타입만");

        // 2. p.14
        same(capture(BoundedWildcardImpl::slideMain),
                "Person registered the Course1.\nWorker registered the Course1.\nStudent registered the Course1.\n"
              + "HighStudent registered the Course1.\nMiddleStudent registered the Course1.\n"
              + "Student registered the Course2.\nHighStudent registered the Course2.\n"
              + "Person registered the Course3.\nWorker registered the Course3.\n", "p.14 출력 9줄");

        // 3. 와일드카드 변수로 받기
        Applicant<? extends Student> a = new Applicant<HighStudent>(new HighStudent());
        Student s = a.kind;                     // 꺼내면 적어도 Student다
        // a.kind = new Student();              // 컴파일 오류: 실제로는 Applicant<HighStudent>일 수 있다
        check(s instanceof HighStudent, "? extends Student: Student로 꺼낸다");

        Applicant<? super Student> b = new Applicant<Person>(new Person());
        b.kind = new Student();                 // Student는 넣을 수 있다
        Object got = b.kind;                    // 꺼내면 Object로만 받는다
        // Student t = b.kind;                  // 컴파일 오류
        check(got instanceof Student, "? super Student: Student를 넣는다");

        Applicant<?> c = a;
        Object any = c.kind;
        check(any != null, "?: Object로만 꺼낸다");

        // 4. 클래스끼리는 부모·자식이어도 Applicant끼리는 아니다
        // Applicant<Person> p = new Applicant<Student>(new Student());   // 컴파일 오류
        Applicant<? extends Person> p = new Applicant<Student>(new Student());   // 이것은 된다
        check(p.kind instanceof Student, "Applicant<? extends Person>으로는 받을 수 있다");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
