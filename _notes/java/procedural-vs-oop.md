---
layout: "note"
title: "절차 지향과 객체 지향 비교"
display_title: "절차 지향과 객체 지향 비교"
kind: "concept"
kind_label: "비교"
num: "13"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Procedural Programming vs Object-Oriented Programming", "절차 지향 프로그래밍", "Procedural Programming"]
description: "둘 다 \"학생들의 시험 점수 평균을 낸다\"는 같은 일을 할 수 있다. 가르는 질문은 \"자료와 그 자료를 다루는 코드를 한곳에 묶어 두는가\"다. 절차 지향은 할 일을 위에서 아래로 순서대로 적고 자료는 따로 둔다. 객체 지향은 자료와 그 자료를 다루는 메서드를 객체 하나에 묶는다."
prev_url: "/studies/java/oop-principles/"
prev_title: "객체 지향의 세 원칙"
next_url: "/studies/java/java-fields-methods/"
next_title: "필드와 메서드"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "13_procedural-vs-oop_impl.java", "u": "/studies/java/code/13_procedural-vs-oop_impl/", "r": "구현"}]
permalink: "/studies/java/procedural-vs-oop/"
---
{% raw %}
둘 다 "학생들의 시험 점수 평균을 낸다"는 같은 일을 할 수 있다. 가르는 질문은 "자료와 그 자료를 다루는 코드를 한곳에 묶어 두는가"다. 절차 지향은 할 일을 위에서 아래로 순서대로 적고 자료는 따로 둔다. 객체 지향은 자료와 그 자료를 다루는 메서드를 객체 하나에 묶는다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 점수 여섯 개가 적힌 배열 하나의 평균을 한 번 출력하고 끝나는 프로그램. (b) 학생이 수백 명이고, 학생마다 이름·점수가 있으며, 평균 말고도 최고점·등급을 계속 물어야 하는 프로그램. 어느 쪽이 맞는가?</summary>

**답:** (a) 절차 지향. 자료가 하나이고 할 일이 한 번이라, 순서대로 적은 열 줄이 가장 읽기 쉽다. 클래스를 만들면 코드만 길어진다. (b) 객체 지향. "이 점수는 누구 것인가"를 학생 객체가 들고 있어야 이름과 점수가 어긋나지 않고, 평균 내는 코드를 학생 수만큼 되풀이하지 않는다.<br>
**이유:** 흔한 오답은 "객체 지향이 늘 낫다"이다. 묶을 자료가 하나뿐이면 묶어서 얻는 것이 없다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 점수 배열을 다른 코드가 실수로 음수로 바꾸는 일을 막고 싶다. (d) 파일 이름 열 개를 차례로 바꾸는 한 번 쓰고 버릴 코드. 어느 쪽이 맞는가?</summary>

**답:** (c) 객체 지향. 점수를 `private` 필드로 감추고 메서드로만 다루게 하면 막을 수 있다. 절차 지향에서는 배열이 그냥 변수라 닿는 코드는 누구나 바꾼다. (d) 절차 지향. 지킬 상태가 없고 순서만 있다.<br>
**이유:** (c)를 가르는 것은 [캡슐화](/Hongs_Blog/studies/java/oop-principles/)다. 감출 수 있는 것은 객체 안에 넣은 자료뿐이다[^s1].

</details>


## 결정적 차이

같은 문제를 두 방식으로 짜 본다.

```java
// 절차 지향: 자료(배열)와 계산 순서가 main 한곳에 놓인다
int[] grades = {90, 85, 88, 75, 80, 82};

double sum = 0;
for (int grade : grades) {
    sum += grade;
}
double average = sum / grades.length;
System.out.println("Average grade: " + average);
// Average grade: 83.33333333333333
```

```java
// 객체 지향: 학생 객체가 자기 점수와 평균 내는 법을 함께 가진다
class Student {
    private String name;
    private int[] grades;

    public Student(String name, int[] grades) {
        this.name = name;
        this.grades = grades;
    }

    public String getName() { return name; }

    public double calculateAverageGrade() {
        double sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        return sum / grades.length;
    }
}
```

```java
Student student1 = new Student("Alice", new int[] {90, 85, 88});
Student student2 = new Student("Bob", new int[] {75, 80, 82});
System.out.println("Average grade for " + student1.getName() + ": " + student1.calculateAverageGrade());
System.out.println("Average grade for " + student2.getName() + ": " + student2.calculateAverageGrade());
// Average grade for Alice: 87.66666666666667
// Average grade for Bob: 79.0
```

절차 지향 코드는 여섯 점수가 누구 것인지 모른다. 학생별로 내려면 배열을 학생마다 따로 두고 같은 반복문을 학생 수만큼 다시 써야 한다. 객체 지향 코드는 반복문을 `Student` 안에 한 번만 쓰고, 학생이 늘면 `new Student(...)`만 늘린다.


| | 절차 지향 | 객체 지향 |
|---|---|---|
| 코드를 나누는 단위 | 할 일의 순서(먼저 더하고, 나누고, 찍는다) | 객체(학생) |
| 자료가 있는 곳 | 계산 코드 밖의 변수·배열 | 객체 안의 필드 |
| 자료와 코드의 사이 | 따로 논다. 어느 코드나 자료에 닿는다 | 한 객체에 묶인다. `private`로 감출 수 있다 |
| 대상이 늘 때 | 변수와 같은 코드를 대상 수만큼 늘린다 | 객체만 더 만든다 |
| 작은 일 한 번 | 짧고 바로 읽힌다 | 틀을 만드는 만큼 길다 |

"코드를 나누는 단위"와 "자료가 있는 곳" 두 줄이 선택을 가른다. 나머지는 거기서 따라 나온다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 절차 지향 코드의 83.33333333333333, 객체 지향 코드의 87.66666666666667과 79.0, 절차 지향으로 두 학생을 다룰 때 같은 값이 나오는 것을 JDK 21에서 실행해 비교 — [13_procedural-vs-oop_impl.java](/Hongs_Blog/studies/java/code/13_procedural-vs-oop_impl/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 자바에서 절차 지향 코드를 써도 `class`와 `main`은 꼭 써야 한다. 위의 절차 지향 코드를 `class GradeProcessor`의 `main` 안에 넣으면 `GradeProcessor`는 객체 지향 코드인가? 또 두 방식 어느 쪽에도 딱 들어맞지 않는 경우를 하나 들어라.</summary>

**답:** 아니다. `GradeProcessor`는 클래스 안에 들어 있을 뿐, 객체를 하나도 만들지 않고 `main` 안에서 순서대로 계산한다. 자바는 모든 코드를 클래스 안에 쓰게 하므로 `class`가 있다는 것만으로는 객체 지향이 아니다. 둘 다 아닌 경우: 점수 목록에 "거르고, 바꾸고, 더한다"를 줄줄이 이어 붙이는 식으로, 상태를 가진 객체도 단계별 변수도 없이 값의 변환만 잇는 코드(함수형 방식)가 있다.<br>
**이유:** 객체 지향인지는 문법이 아니라 자료와 동작을 객체로 묶었는지로 가른다. 실제 프로그램은 한 방식만 쓰지 않는다. 객체 지향으로 짠 프로그램도 메서드 하나의 속은 위에서 아래로 가는 절차다[^s1].

</details>


[^s1]: 비교 표, 카드 C1~C3, "학생이 늘 때"의 설명은 두 코드를 견주어 쓴 것이다. 출력은 JDK 21에서 직접 실행해 확인했다.
{% endraw %}
