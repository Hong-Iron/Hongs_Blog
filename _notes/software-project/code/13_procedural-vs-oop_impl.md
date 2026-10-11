---
layout: "note"
title: "13_procedural-vs-oop_impl.java"
display_title: "13_procedural-vs-oop_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "13"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
parent_url: "/studies/software-project/procedural-vs-oop/"
parent_title: "절차 지향과 객체 지향 비교"
description: "소프트웨어 프로젝트 · 절차 지향과 객체 지향 비교 구현 코드"
permalink: "/studies/software-project/code/13_procedural-vs-oop_impl/"
---
{% raw %}
[절차 지향과 객체 지향 비교](/Hongs_Blog/studies/software-project/procedural-vs-oop/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 13_procedural-vs-oop_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「절차 지향과 객체 지향 비교」의 두 코드(슬라이드 p.34, p.35)를 실행해 출력을 비교한다.
// 슬라이드의 Student에는 getName()이 없어 그대로는 컴파일되지 않는다. 여기서는 getName()을 보탰다.

class ProceduralVsOopCheck {
    // 절차 지향: 자료(배열)와 그 자료를 다루는 순서가 main 한곳에 놓인다
    static void procedural() {
        int[] grades = {90, 85, 88, 75, 80, 82};

        double sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        double average = sum / grades.length;
        System.out.println("Average grade: " + average);
    }

    // 객체 지향: 학생 객체가 자기 점수와 평균 내는 법을 함께 갖는다
    static void oop() {
        int[] student1Grades = {90, 85, 88};
        int[] student2Grades = {75, 80, 82};

        Student student1 = new Student("Alice", student1Grades);
        Student student2 = new Student("Bob", student2Grades);

        System.out.println("Average grade for " + student1.getName() + ": " + student1.calculateAverageGrade());
        System.out.println("Average grade for " + student2.getName() + ": " + student2.calculateAverageGrade());
    }

    // 절차 지향으로 학생 둘을 다루면 같은 반복문을 두 번 쓴다(문서의 "학생이 늘면" 대목)
    static void proceduralTwoStudents() {
        int[] aliceGrades = {90, 85, 88};
        int[] bobGrades = {75, 80, 82};
        double sumA = 0;
        for (int g : aliceGrades) sumA += g;
        double sumB = 0;
        for (int g : bobGrades) sumB += g;
        System.out.println("Alice: " + sumA / aliceGrades.length);
        System.out.println("Bob: " + sumB / bobGrades.length);
    }

    public static void main(String[] args) {
        check("procedural", capture(ProceduralVsOopCheck::procedural), "Average grade: 83.33333333333333\n");
        check("oop", capture(ProceduralVsOopCheck::oop),
              "Average grade for Alice: 87.66666666666667\nAverage grade for Bob: 79.0\n");
        check("procedural, two students", capture(ProceduralVsOopCheck::proceduralTwoStudents),
              "Alice: 87.66666666666667\nBob: 79.0\n");
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
    private String name;
    private int[] grades;

    public Student(String name, int[] grades) {
        this.name = name;
        this.grades = grades;
    }

    public String getName() {   // 슬라이드에는 없다
        return name;
    }

    public double calculateAverageGrade() {
        double sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        return sum / grades.length;
    }
}
```
{% endraw %}
