---
layout: "note"
title: "생성자"
display_title: "생성자 (Constructor)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
updated: "2026-10-11"
status: "verified"
aliases: ["Constructor", "기본 생성자", "Default Constructor", "생성자 오버로딩", "Constructor Overloading", "this", "new 연산자"]
description: "새 공책을 사면 첫 장에 이름부터 적는다. 객체를 새로 만들 때 이렇게 처음 값을 채워 넣는 코드가 따로 있다. 이 코드 덕분에 이름이 비어 있는 학생 같은 덜 만들어진 객체가 돌아다니지 않는다. 이 코드를 하나도 쓰지 않으면 아무 일도 하지 않는 빈 것이 저절로 하나 붙는다. 단…"
prev_url: "/studies/java/java-fields-methods/"
prev_title: "필드와 메서드"
next_url: "/studies/java/java-static/"
next_title: "static 멤버"
math: false
mermaid: false
code_count: 1
permalink: "/studies/java/java-constructor/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

새 공책을 사면 첫 장에 이름부터 적는다. 객체를 새로 만들 때 이렇게 처음 값을 채워 넣는 코드가 따로 있다. 이 코드 덕분에 이름이 비어 있는 학생 같은 덜 만들어진 객체가 돌아다니지 않는다. 이 코드를 하나도 쓰지 않으면 아무 일도 하지 않는 빈 것이 저절로 하나 붙는다. 단, 하나라도 직접 쓰면 그 빈 것은 더는 붙지 않아서, 값을 넘기지 않고 만드는 코드가 갑자기 막힌다.

</div>


## 예시로 보기

필드만 있는 클래스로 학생을 만들면 이렇게 된다.

```java
Student s = new Student();
s.name = "Bob";
s.grades = new int[] {90, 85, 88};
```

객체를 만드는 줄과 값을 채우는 줄이 떨어져 있다. 둘째 줄을 잊으면 이름이 `null`인 학생이 프로그램 안을 돌아다닌다. 만들 때 값을 함께 받도록 하면 잊을 수가 없다. 슬라이드의 예다[^1].

```java
public class Student {
    public String name;
    public int[] grades;

    public Student(String name, int[] grades) {   // 생성자
        this.name = name;
        this.grades = grades;
    }
}
```

```java
int[] studentGrades = {90, 85, 88};
Student student = new Student("Bob", studentGrades);
System.out.println(student.name);                      // Bob
System.out.println(Arrays.toString(student.grades));   // [90, 85, 88]
```

`new Student("Bob", studentGrades)`에서 `new` 뒤의 `Student(...)`가 생성자를 부르는 자리다. 괄호 안의 값이 생성자의 매개변수로 들어간다[^2].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.13의 `GradeProcessor`가 `Arrays.toString(...)`을 쓰는데 `import java.util.Arrays;`가 없다. p.15의 `Student`는 세 번째 생성자의 닫는 중괄호 `}`가 하나 빠져 있다. / 문제점: 둘 다 그대로는 컴파일되지 않는다. / 수정안: 파일 맨 위에 `import java.util.Arrays;`를 넣고, 세 번째 생성자 끝에 `}`를 넣는다. / 근거: JDK 21로 컴파일하면 앞의 것은 `error: cannot find symbol ... symbol: variable Arrays`, 뒤의 것은 `error: reached end of file while parsing`이 난다.

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 생성자 세 개의 출력, `this`를 빼먹은 예(null과 Alice), `this(...)` 예(SCV 45, SCV-7 45), 카드 C3의 답(10, 13)을 JDK 21에서 실행해 비교. 기본 생성자는 빈 클래스를 컴파일한 뒤 `javap`로 확인. 오류 문구는 따로 컴파일해 확인 — [15_java-constructor_impl.java](/Hongs_Blog/studies/java/code/15_java-constructor_impl/)</div>

</div>


## 정의

**객체 만들기.** 클래스에서 객체를 만들 때는 `new` 연산자를 쓴다. `new`는 객체를 만들고 그 객체의 주소를 돌려준다[^2]. 그 주소를 변수에 담아 두고 객체를 쓴다([참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)).

**생성자**는 `new`로 객체를 만들 때 객체를 처음 상태로 채우는 멤버다. 메서드처럼 생겼지만 두 가지가 다르다[^3].

- 돌려주는 타입을 적지 않는다(`void`도 적지 않는다).
- 이름이 클래스 이름과 같다.

매개변수의 타입은 `new`에서 넘길 값의 타입에 맞춰 적는다.

### 기본 생성자

클래스에 생성자를 하나도 쓰지 않으면, 번역기가 아무 일도 하지 않는 생성자를 하나 넣어 준다. 이것을 기본 생성자라고 한다[^4].

```java
public class Student {
}
```

이 파일을 번역해 만든 `Student.class`를 `javap Student`로 열어 보면 쓴 적 없는 생성자가 들어 있다[^s1].

```
public class Student {
  public Student();
}
```

그래서 생성자가 없는 클래스도 `new Student()`로 만들 수 있다.

생성자를 하나라도 직접 쓰면 기본 생성자는 들어가지 않는다. `Student(String name)`만 있는 클래스에서 `new Student()`를 쓰면 이런 오류가 난다[^s1].

```
error: constructor Student in class Student cannot be applied to given types;
  required: String
  found:    no arguments
```

### 생성자 오버로딩

매개변수가 다른 생성자를 여러 개 둘 수 있다. 객체를 여러 방법으로 만들 수 있게 하려는 것이다[^5].

```java
public class Student {
    public String name;
    public int[] grades;

    public Student() {}                             // 생성자 1

    public Student(String name) {                   // 생성자 2
        this.name = name;
    }

    public Student(String name, int[] grades) {     // 생성자 3
        this.name = name;
        this.grades = grades;
    }
}
```

| `new` 식 | 불리는 생성자 | `name` | `grades` |
|---|---|---|---|
| `new Student()` | 1 | null | null |
| `new Student("Alice")` | 2 | Alice | null |
| `new Student("Bob", grades)` | 3 | Bob | [90, 85, 88] |

`new`에 넘긴 값의 타입과 개수를 보고 어느 생성자를 돌릴지가 정해진다. 매개변수의 타입·개수·순서는 그대로 두고 이름만 바꾼 것은 오버로딩이 아니다[^5]. `Student(String name)` 옆에 `Student(String nickname)`을 두면 `constructor Student(String) is already defined` 오류가 난다[^s1].

### this

생성자의 매개변수 이름을 필드 이름과 같게 쓰면, 생성자 안에서 `name`은 매개변수를 가리킨다. 가까이서 선언한 쪽이 이기기 때문이다. 필드를 가리키려면 `this.name`이라고 쓴다. `this`는 "지금 만들어지고 있는 바로 이 객체"다[^s1].

```java
class Wrong {
    String name;
    Wrong(String name) {
        name = name;        // 매개변수에 매개변수를 넣는다. 필드는 그대로 null
    }
}

class Right {
    String name;
    Right(String name) {
        this.name = name;   // 왼쪽은 이 객체의 필드, 오른쪽은 매개변수
    }
}
```

`new Wrong("Alice").name`은 `null`, `new Right("Alice").name`은 `Alice`다. `Wrong`은 오류 없이 번역되므로 실행해 보기 전에는 눈에 띄지 않는다.

`this(...)`라고 쓰면 같은 클래스의 다른 생성자를 부른다. 값을 채우는 코드를 생성자마다 다시 쓰지 않아도 된다. 생성자의 첫 줄에만 쓸 수 있다[^s1].

```java
class Scv {
    String name;
    int health;

    Scv() { this("SCV"); }
    Scv(String name) { this(name, 45); }
    Scv(String name, int health) {
        this.name = name;
        this.health = health;
    }
}
```

`new Scv()`는 이름 `SCV`, 체력 45로, `new Scv("SCV-7")`은 이름 `SCV-7`, 체력 45로 만들어진다.

## 활용

- 객체가 꼭 가져야 하는 값은 생성자의 매개변수로 받는다. 값 없이 만드는 길을 막고 싶으면 매개변수 없는 생성자를 쓰지 않으면 된다.
- 생성자가 도는 순서: 필드에 적어 둔 초기값이 먼저 들어가고, 그다음 생성자 본문이 돈다(카드 C3)[^s1].
- 흔한 실수: 생성자에 `void`를 붙이는 것. `void Student() { }`는 생성자가 아니라 이름이 `Student`인 보통 메서드가 되고, `new`할 때 불리지 않는다[^s1].
- 부모 클래스가 있을 때 생성자가 도는 순서는 [부모 생성자 호출](/Hongs_Blog/studies/java/java-super-constructor/)에 있다.

## 연결

- 선수: [필드와 메서드](/Hongs_Blog/studies/java/java-fields-methods/), [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)
- 한 번 넣으면 못 바꾸는 필드는 생성자에서 값을 준다: [final과 상수](/Hongs_Blog/studies/java/java-final/)
- 생성자를 감춰 밖에서 `new`를 못 하게 하기: [접근 제한자](/Hongs_Blog/studies/java/java-access-modifier/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 생성자가 메서드와 다른 점 두 가지와, 기본 생성자가 언제 생기는지 쓰라.</summary>

**답:** 돌려주는 타입이 없고, 이름이 클래스 이름과 같다. 기본 생성자는 클래스에 생성자를 하나도 쓰지 않았을 때 번역기가 바이트코드 파일에 넣어 준다. 하나라도 쓰면 넣어 주지 않는다.<br>
**이유:** "기본 생성자는 늘 있다"가 흔한 오답이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `class Student { String name; Student(String name) { this.name = name; } }`가 있다. 번역 단계에서 오류가 나는 줄은? (가) `Student a = new Student("Alice");` (나) `Student b = new Student();` (다) `Student c = a;`</summary>

**답:** (나). `constructor Student in class Student cannot be applied to given types`.<br>
**이유:** 생성자를 하나 직접 썼으므로 기본 생성자가 들어가지 않는다. 매개변수 없는 생성자가 없다. (다)는 생성자를 부르지 않고 주소만 옮겨 담는 줄이라 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `class Tank { int fuel = 10; Tank(int extra) { System.out.println(fuel); fuel = fuel + extra; } }`에서 `Tank t = new Tank(3); System.out.println(t.fuel);`의 출력은?</summary>

**답:** `10`과 `13`이 차례로 나온다.<br>
**이유:** 필드에 적은 초기값 10이 먼저 들어간 뒤 생성자 본문이 돈다. 본문 첫 줄이 10을 찍고, 3을 더해 13이 된다. 첫 줄이 `0`이라고 답하는 것은 초기값이 생성자 뒤에 들어간다고 본 것이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 생성자 `Student(String name) { name = name; }`로 만든 객체의 `name`이 `null`인 이유는?</summary>

**답:** 생성자 안에서 `name`은 매개변수를 가리킨다. 그래서 `name = name;`은 매개변수의 값을 매개변수에 다시 넣는다. 필드에는 아무것도 넣지 않았으니 기본값 `null` 그대로다. `this.name = name;`이라고 써야 필드에 들어간다.

</details>


[^1]: 소프트웨어 프로젝트 6회 강의 자료 「Software Project 06. Class」, p.12~13 (Constructor declaration과 예: `Student`, `GradeProcessor`)
[^2]: 같은 자료, p.8~9 (`new` 연산자, `new` 뒤의 `Student()`와 `Student("Alice", grades)`에 "What does this mean?")
[^3]: 같은 자료, p.5, p.12
[^4]: 같은 자료, p.10~11 (Default constructor, 컴파일 전후 그림)
[^5]: 같은 자료, p.14~15 (Constructor Overloading과 예)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 생성자 없이 만든 코드, `javap` 출력, 오류 문구, 표의 값, `this`의 설명과 `Wrong`·`Right` 예, `this(...)`와 `Scv` 예, 초기값과 본문의 순서, `void`를 붙인 실수, 카드 C2~C4는 원본에 없다. 슬라이드는 `this.name = name;`을 코드로만 쓰고 `this`를 설명하지 않았다. 모두 JDK 21에서 직접 실행·컴파일해 확인했다.
{% endraw %}
