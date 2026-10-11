---
layout: "note"
title: "필드와 메서드"
display_title: "필드와 메서드 (Field and Method)"
kind: "concept"
kind_label: "정의"
num: "14"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-11"
status: "verified"
aliases: ["Field", "Method", "Class Members", "클래스 멤버", "라이브러리 클래스", "Library Class", "실행 클래스", "Executable Class", "지역 변수", "Local Variable", "메서드 오버로딩", "Method Overloading"]
description: "클래스라는 틀 안에는 세 가지를 적는다. 객체가 계속 들고 있을 값을 담는 칸, 객체를 처음 만들 때 그 칸을 채우는 코드, 객체가 할 수 있는 동작이다. 값을 담는 칸은 객체가 살아 있는 동안 내내 남는다. 반면 동작 안에서 잠깐 만든 변수는 그 동작이 끝나면 사라진다. 이 둘을…"
prev_url: "/studies/java/procedural-vs-oop/"
prev_title: "절차 지향과 객체 지향 비교"
next_url: "/studies/java/java-constructor/"
next_title: "생성자"
math: false
mermaid: false
code_count: 1
permalink: "/studies/java/java-fields-methods/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

클래스라는 틀 안에는 세 가지를 적는다. 객체가 계속 들고 있을 값을 담는 칸, 객체를 처음 만들 때 그 칸을 채우는 코드, 객체가 할 수 있는 동작이다. 값을 담는 칸은 객체가 살아 있는 동안 내내 남는다. 반면 동작 안에서 잠깐 만든 변수는 그 동작이 끝나면 사라진다. 이 둘을 헷갈려 같은 이름으로 쓰면, 객체의 값을 바꿨다고 생각했는데 잠깐 쓰는 변수만 바꾸고 끝나는 일이 생긴다.

</div>


## 예시로 보기

지금까지의 변수는 모두 `main` 안에 있었고, `main`이 끝나면 함께 사라졌다. 객체는 다르다. 학생 객체는 평균을 한 번 낸 뒤에도 이름과 점수를 계속 들고 있어야 한다. 그래서 변수를 둘 자리가 두 군데로 갈린다.

```java
class Wallet {
    int total;                    // 객체 안에 있는 칸

    void earn(int n) {
        int doubled = n * 2;      // 이 메서드가 도는 동안만 있는 변수
        total += doubled;
    }
}
```

```java
Wallet w = new Wallet();
w.earn(1);
w.earn(2);
System.out.println(w.total);     // 6
```

`earn(1)`이 끝나면 `doubled`(값 2)는 사라진다. `total`에 더한 2는 객체에 남는다. 그래서 두 번째 호출이 4를 더해 6이 된다. 객체에 남는 `total` 같은 칸을 필드, 메서드 안에서 잠깐 쓰는 `doubled` 같은 변수를 지역 변수라고 부른다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력 6, 필드의 기본값(null, null, 0, false), 오버로딩 출력(3, 4.0, 6), 카드 C3의 답 4를 JDK 21에서 실행해 비교. 초기화하지 않은 지역 변수와 반환 타입만 다른 메서드의 오류 문구는 따로 컴파일해 확인 — [14_java-fields-methods_impl.java](/Hongs_Blog/studies/java/code/14_java-fields-methods_impl/)</div>

</div>


## 클래스의 두 쓰임

클래스는 쓰임에 따라 둘로 나뉜다[^1].

- **라이브러리 클래스:** 혼자서는 실행할 수 없고 다른 클래스가 가져다 쓴다. 예: `Student`.
- **실행 클래스:** `main()` 메서드가 있어 실행할 수 있다. 예: `Student` 객체를 만들어 평균을 찍는 `GradeProcessor`.

프로그램 하나에 실행 클래스는 보통 하나이고, 나머지는 그 클래스가 가져다 쓰는 라이브러리 클래스다[^s1].

## 클래스의 멤버

클래스 안에 적는 것을 멤버라고 한다. 세 가지다[^2].

```java
public class ClassName {
    // 필드
    int fieldName;

    // 생성자
    ClassName() { ... }

    // 메서드
    int methodName() { ... }
}
```

| 멤버 | 하는 일 | 적는 모양 |
|---|---|---|
| 필드(field) | 객체의 자료를 담는다 | 변수 선언과 비슷하지만 쓰임이 다르다 |
| 생성자(constructor) | `new`로 객체를 만들 때 객체를 처음 상태로 채운다 | 메서드와 비슷하지만 돌려주는 타입이 없고, 이름이 클래스 이름과 같다 |
| 메서드(method) | 객체가 할 수 있는 동작이다. 함수라고도 부른다 | 돌려주는 타입, 이름, 매개변수, 본문 |

생성자는 [생성자](/Hongs_Blog/studies/java/java-constructor/)에서 따로 다룬다.

### 필드와 지역 변수

| | 필드 | 지역 변수 |
|---|---|---|
| 선언하는 곳 | 클래스 블록 안(메서드 밖) | 생성자·메서드 블록 안 |
| 있는 곳 | 객체 안 | 생성자·메서드가 불려 도는 동안만 있다 |
| 쓸 수 있는 곳 | 객체 안팎 어디서나 | 그 생성자·메서드 블록 안에서만 |

표는 슬라이드를 옮긴 것이다[^3]. "객체 밖 어디서나"는 필드를 감추지 않았을 때의 이야기이고, `private`를 붙이면 밖에서는 못 쓴다([접근 제한자](/Hongs_Blog/studies/java/java-access-modifier/)).

차이가 하나 더 있다. 필드는 값을 주지 않아도 기본값으로 채워진다. 지역 변수는 값을 주지 않고 읽으면 번역 단계에서 막힌다[^s1].

```java
class Student {
    String name;        // null
    int[] grades;       // null
    int year;           // 0
    boolean enrolled;   // false
}
```

```java
void m() {
    int local;
    System.out.println(local);
    // error: variable local might not have been initialized
}
```

### 메서드 오버로딩

한 클래스에 이름이 같은 메서드를 여러 개 둘 수 있다. 단, 매개변수의 타입이나 개수나 순서가 달라야 한다[^4].

```java
class Calculator {
    int add(int x, int y) { return x + y; }
    double add(double x, double y) { return x + y; }
    int add(int x, int y, int z) { return x + y + z; }
}
```

`add(1, 2)`는 `3`, `add(1.5, 2.5)`는 `4.0`, `add(1, 2, 3)`은 `6`이다. 번역기가 넘긴 값의 타입과 개수를 보고 맞는 것을 고른다.

돌려주는 타입만 다르게 해서는 안 된다. `int add(int x, int y)` 옆에 `double add(int a, int b)`를 두면 `method add(int,int) is already defined` 오류가 난다. 부르는 쪽 코드 `add(1, 2)`만 봐서는 둘 중 무엇을 뜻하는지 가릴 수 없기 때문이다. 매개변수 이름만 바꾼 것도 같은 이유로 안 된다[^s1].

## 활용

- 필드 이름과 같은 이름의 지역 변수나 매개변수를 만들면, 그 블록 안에서는 지역 변수가 필드를 가린다. 필드를 가리키려면 앞에 `this.`를 붙인다. 생성자에서 `this.name = name;`이라고 쓰는 까닭이다([생성자](/Hongs_Blog/studies/java/java-constructor/)).
- 흔한 실수: 메서드 안에서 `int total = 0;`처럼 타입을 다시 붙이는 것. 필드에 값을 넣는 것이 아니라 같은 이름의 지역 변수를 새로 만든다.
- `System.out.println`은 `int`, `double`, `String` 등을 받는 메서드가 따로 있는 오버로딩이다. 그래서 무엇을 넘겨도 같은 이름으로 부른다[^s1].

## 연결

- 선수: [클래스와 객체](/Hongs_Blog/studies/java/class-and-object/), [변수와 기본 타입](/Hongs_Blog/studies/java/java-primitive-types/)
- 객체가 아니라 클래스에 하나만 있는 필드와 메서드: [static 멤버](/Hongs_Blog/studies/java/java-static/)
- 오버로딩과 이름이 비슷한 다른 것: [객체 지향의 세 원칙](/Hongs_Blog/studies/java/oop-principles/)의 다형성 두 갈래

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 클래스의 멤버 세 가지와 각각이 하는 일을 쓰라. 라이브러리 클래스와 실행 클래스는 무엇으로 가르는가?</summary>

**답:** 필드는 객체의 자료를 담는다. 생성자는 `new`로 객체를 만들 때 객체를 처음 상태로 채운다. 메서드는 객체가 할 수 있는 동작이다. `main()` 메서드가 있어 실행할 수 있으면 실행 클래스, 없어서 다른 클래스가 가져다 쓰기만 하면 라이브러리 클래스다.<br>
**이유:** 생성자를 메서드의 한 종류로 묶어 "둘"이라고 답하기 쉽다. 생성자는 돌려주는 타입이 없고 `new`와 함께만 불린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 필드와 지역 변수를 선언하는 곳, 있는 곳, 값을 주지 않았을 때로 견주어라.</summary>

**답:** 필드는 클래스 블록 안(메서드 밖)에 선언하고 객체 안에 있으며, 값을 주지 않으면 기본값(숫자 0, `boolean`은 false, 참조 타입은 null)이 들어간다. 지역 변수는 생성자·메서드 블록 안에 선언하고 그 블록이 도는 동안만 있으며, 값을 주지 않고 읽으면 컴파일 오류다.<br>
**이유:** "지역 변수도 0으로 시작한다"가 흔한 오답이다. `variable local might not have been initialized` 오류가 난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `class Box { int count; void put() { int count = 0; count++; this.count += 2; } }`에서 `Box b = new Box(); b.put(); b.put();` 뒤 `b.count`는?</summary>

**답:** `4`<br>
**이유:** `put` 안의 `int count = 0;`은 필드와 이름이 같은 지역 변수다. `count++`는 이 지역 변수를 1로 만들 뿐이고, 메서드가 끝나면 사라진다. 필드에 닿는 것은 `this.count += 2`뿐이라 두 번 불러 4다. 흔한 오답 6은 `count++`도 필드에 더한 것으로 센 것이다[^s1].

</details>


[^1]: 소프트웨어 프로젝트 6회 강의 자료 「Software Project 06. Class」, p.2~3 (Two Main Purposes of Class, `Student.java`와 `GradeProcessor.java`)
[^2]: 같은 자료, p.4~5 (Members of a class)
[^3]: 같은 자료, p.6~7 (Differences between fields and local variables, `Student`의 필드 예)
[^4]: 소프트웨어 프로젝트 5회 강의 자료 「Software Project 05. Object-Oriented Programming」, p.29 (Method Overloading, `Calculator`의 `add` 두 개). 타입·개수·순서가 달라야 한다는 조건은 06.Software Project 06. Class.pdf, p.14가 생성자 오버로딩에 대해 적은 것과 같다.
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `Wallet` 예, 필드의 기본값과 지역 변수의 초기화 오류, 세 번째 `add`, 반환 타입만 다른 메서드가 안 되는 이유, 가리기(`this.`), `println`의 예, 실행 클래스가 보통 하나라는 설명, 카드 C3은 원본에 없다. 출력과 오류 문구는 JDK 21에서 직접 실행해 확인했다.
{% endraw %}
