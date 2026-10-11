---
layout: "note"
title: "접근 제한자"
display_title: "접근 제한자 (Access Modifier)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
updated: "2026-10-11"
status: "verified"
aliases: ["Access Modifier", "public", "protected", "default", "private", "접근 제어자", "Getter", "Setter", "게터", "세터", "무결성", "Integrity"]
description: "건물의 문마다 누가 들어올 수 있는지가 다르다. 정문은 누구나, 사무실은 같은 회사 사람만, 금고는 주인만 연다. 클래스와 그 안의 값·동작에도 이런 문패를 붙여서, 중요한 것을 바깥 코드가 함부로 건드리지 못하게 한다. 값을 금고에 넣어 두고 창구를 통해서만 넣고 꺼내게 하면, …"
prev_url: "/studies/java/java-package/"
prev_title: "패키지"
next_url: "/studies/java/java-inheritance/"
next_title: "상속"
math: false
mermaid: false
code_count: 1
permalink: "/studies/java/java-access-modifier/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

건물의 문마다 누가 들어올 수 있는지가 다르다. 정문은 누구나, 사무실은 같은 회사 사람만, 금고는 주인만 연다. 클래스와 그 안의 값·동작에도 이런 문패를 붙여서, 중요한 것을 바깥 코드가 함부로 건드리지 못하게 한다. 값을 금고에 넣어 두고 창구를 통해서만 넣고 꺼내게 하면, 창구에서 이상한 값을 걸러 낼 수 있다. 문패를 아무것도 안 붙이면 "누구나"가 아니라 "같은 묶음 안에서만"이 되므로, 다른 묶음에서 쓰려던 코드가 막힌다.

</div>


## 예시로 보기

건설로봇의 체력은 0에서 45 사이여야 한다. 체력 필드를 그냥 두면 어느 코드나 `scv.health = -10;`이라고 쓸 수 있다. 필드를 `private`로 감추고, 값을 넣는 메서드에서 검사하게 한다.

```java
class Scv {
    private int health = 45;            // 클래스 밖에서는 못 건드린다
    private String name;

    public int getHealth() {            // 읽는 창구
        return health;
    }

    public void setHealth(int health) { // 넣는 창구: 값을 검사한다
        if (health < 0) {
            this.health = 0;
        } else if (health > 45) {
            this.health = 45;
        } else {
            this.health = health;
        }
    }

    public String getName() {           // 밖에서 쓰기 좋게 바꿔서 준다
        if (name == null) {
            return "(이름 없음)";
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
Scv s = new Scv();
s.setHealth(30);    System.out.println(s.getHealth());   // 30
s.setHealth(-10);   System.out.println(s.getHealth());   // 0
s.setHealth(100);   System.out.println(s.getHealth());   // 45
System.out.println(s.getName());                         // (이름 없음)
```

`s.health = -10;`이라고 쓰면 `health has private access in Scv` 오류로 번역이 멈춘다. 체력을 바꾸는 길은 `setHealth`뿐이고, 그 안에서 범위를 벗어난 값을 걸러 낸다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력과 private 생성자 예를 JDK 21에서 실행해 비교. 패키지를 넘는 접근 표는 `package1`·`package2` 폴더를 만들어 한 줄씩 컴파일해 확인 — [19_java-access-modifier_impl.java](/Hongs_Blog/studies/java/code/19_java-access-modifier_impl/)</div>

</div>


## 정의

**접근 제한자**는 중요한 필드와 메서드가 밖에 드러나지 않게 막아, 객체가 늘 올바른 상태로 있게(무결성) 하는 데 쓴다[^1]. [캡슐화](/Hongs_Blog/studies/java/oop-principles/)를 실제로 해 주는 문법이다.

단계는 넷이다. 아래로 갈수록 더 좁게 막는다[^2].

| 접근 제한자 | 붙일 수 있는 곳 | 쓸 수 있는 범위 |
|---|---|---|
| `public` | 클래스, 필드, 생성자, 메서드 | 제한 없음 |
| `protected` | 필드, 생성자, 메서드 | 같은 패키지이거나, 자식 객체 |
| (default) 아무것도 안 씀 | 클래스, 필드, 생성자, 메서드 | 같은 패키지 |
| `private` | 필드, 생성자, 메서드 | 객체(클래스) 안 |

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.13의 글머리표는 "There are three types of access modifiers: public, protected, and private"라고 적고, 같은 쪽의 그림과 표는 `default`까지 네 단계를 보인다. p.15와 p.16의 글머리표는 생성자·필드·메서드가 "public, default, and private"를 가질 수 있다고 적어 `protected`를 뺐는데, p.13의 표는 `protected`의 대상을 "필드, 생성자, 메소드"로 적었다. p.14의 아래 그림은 두 상자의 이름이 모두 `package1`이다. / 문제점: 키워드는 셋이 맞지만 접근 단계는 넷이다. 생성자·필드·메서드에는 `protected`도 붙는다. 그림의 오른쪽 상자는 다른 패키지여야 설명과 맞는다. / 수정안: "키워드 셋(`public`, `protected`, `private`)에 아무것도 안 쓰는 default를 더해 네 단계", "생성자·필드·메서드는 네 단계 모두 가능", 오른쪽 상자는 `package2`. / 근거: 아래 표를 JDK 21에서 컴파일해 `protected` 필드가 다른 패키지의 자식에서는 되고 남에게서는 `pro has protected access in B`로 막히는 것을 확인했다.

</div>


### 한눈에 보는 표

`package1`의 `public class B`에 네 가지 필드를 두고, 네 곳에서 써 보았다[^s1].

| `B`의 필드 | `B` 안 | 같은 패키지의 다른 클래스 | 다른 패키지의 자식 클래스 | 다른 패키지의 남 |
|---|---|---|---|---|
| `public int pub` | 된다 | 된다 | 된다 | 된다 |
| `protected int pro` | 된다 | 된다 | 된다 | 오류 |
| `int def` | 된다 | 된다 | 오류 | 오류 |
| `private int pri` | 된다 | 오류 | 오류 | 오류 |

오류 문구는 `pro has protected access in B`, `def is not public in B; cannot be accessed from outside package`, `pri has private access in B`다. 메서드도 필드와 똑같다. "자식 클래스"는 [상속](/Hongs_Blog/studies/java/java-inheritance/)에서 다룬다.

### 클래스

클래스에는 `public`을 붙이거나 안 붙이거나 둘 중 하나다[^3].

- `public`을 빼면 다른 패키지에서 그 클래스를 쓸 수 없다.
- `public`을 붙이면 같은 패키지뿐 아니라 다른 패키지에서도 쓸 수 있다.

```
package1                    package2
┌────────────────────┐      ┌─────────────┐
│ class A { }        │      │ class C { } │   C → A : 쓸 수 없다 (A에 public이 없다)
│ class B { }        │      │             │   B → A : 쓸 수 있다 (같은 패키지)
└────────────────────┘      └─────────────┘
┌────────────────────┐      ┌─────────────┐
│ public class A { } │      │ class C { } │   C → A : 쓸 수 있다
│ class B { }        │      │             │   B → A : 쓸 수 있다
└────────────────────┘      └─────────────┘
```

`package2`의 `C`에서 `public`이 없는 `A`를 쓰면 `A is not public in package1; cannot be accessed from outside package` 오류가 난다[^s1].

### 생성자

생성자의 접근 제한자는 "누가 `new`로 이 객체를 만들 수 있는가"를 정한다[^4].

| 접근 제한자 | 생성자 | 뜻 |
|---|---|---|
| `public` | `클래스(…)` | 모든 패키지에서 생성자를 부를 수 있다 = 모든 패키지에서 객체를 만들 수 있다 |
| (default) | `클래스(…)` | 같은 패키지에서만 객체를 만들 수 있다 |
| `private` | `클래스(…)` | 클래스 안에서만 객체를 만들 수 있다 |

생성자를 `private`로 두면 밖에서는 `new`를 못 한다. 클래스가 안에서 객체를 하나만 만들어 두고 메서드로 내주면, 프로그램 전체에 그 객체가 하나뿐이게 할 수 있다[^s1].

```java
class Map {
    private static Map only = new Map();
    private Map() {}
    static Map getInstance() { return only; }
}
// Map.getInstance() == Map.getInstance()  →  true
```

### 필드와 메서드

| 접근 제한자 | 뜻 |
|---|---|
| `public` | 모든 패키지에서 필드를 읽고 바꿀 수 있다. 메서드를 부를 수 있다 |
| (default) | 같은 패키지에서만 필드를 읽고 바꿀 수 있다. 메서드를 부를 수 있다 |
| `private` | 클래스 안에서만 필드를 읽고 바꿀 수 있다. 메서드를 부를 수 있다 |

표는 슬라이드를 옮긴 것이다[^5].

### getter와 setter

필드를 `private`로 감추고, 읽는 메서드와 넣는 메서드를 `public`으로 내놓는다[^6].

- **setter**는 값을 검사해서 맞는 값만 필드에 넣는 메서드다.
- **getter**는 필드 값이 객체 밖에서 쓰기에 알맞지 않으면 알맞게 바꿔서 돌려줄 수 있는 메서드다.

```java
private 타입 fieldName;                    // 필드는 private

public 타입 getFieldName() {               // getter: public, 돌려주는 타입은 필드 타입
    return fieldName;                      //   이름은 get + 필드 이름(첫 글자 대문자)
}

public void setFieldName(타입 fieldName) { // setter: public, void
    this.fieldName = fieldName;            //   이름은 set + 필드 이름(첫 글자 대문자), 매개변수는 필드 타입
}
```

예시의 `setHealth`가 검사하는 setter, `getName`이 바꿔서 돌려주는 getter다.

## 활용

- 기본값으로 삼을 것: 필드는 `private`, 밖에서 쓸 메서드만 `public`. 넓히기는 쉬워도 한 번 내놓은 것을 다시 감추면 그것을 쓰던 코드가 다 깨진다[^s1].
- 흔한 실수: 다른 패키지에서 쓸 클래스나 생성자에 `public`을 빠뜨리는 것. 아무것도 안 쓰면 `public`이 아니라 default(같은 패키지만)다.
- 흔한 실수: 검사 없이 값을 그대로 넣는 setter를 필드마다 달고 캡슐화했다고 여기는 것. 필드를 `public`으로 둔 것과 다르지 않다.
- `private`의 경계는 객체가 아니라 클래스다. 같은 클래스의 다른 객체가 가진 `private` 필드에는 닿을 수 있다[^s1].
- 메서드를 다시 쓸 때는 부모보다 더 좁게 막을 수 없다([메서드 오버라이딩](/Hongs_Blog/studies/java/java-overriding/)).

## 연결

- 선수: [패키지](/Hongs_Blog/studies/java/java-package/), [필드와 메서드](/Hongs_Blog/studies/java/java-fields-methods/), [생성자](/Hongs_Blog/studies/java/java-constructor/), [객체 지향의 세 원칙](/Hongs_Blog/studies/java/oop-principles/)
- `protected`가 쓰이는 자리: [상속](/Hongs_Blog/studies/java/java-inheritance/)
- 패키지보다 큰 단위에서 내놓을 것 고르기: [모듈](/Hongs_Blog/studies/java/java-module/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 접근 단계 넷을 넓은 것부터 쓰고, 각각 어디까지 쓸 수 있는지 적어라. 클래스에 붙일 수 있는 것은 무엇인가?</summary>

**답:** `public`(제한 없음) → `protected`(같은 패키지, 그리고 다른 패키지의 자식) → default(같은 패키지) → `private`(클래스 안). 클래스에는 `public`과 default만 붙는다.<br>
**이유:** default와 `protected`의 순서를 바꿔 쓰기 쉽다. `protected`는 default가 주는 것(같은 패키지)에 자식을 더한 것이라 더 넓다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `package1`에 `public class B { public int pub; protected int pro; int def; private int pri; }`가 있다. `package2`의 (자식이 아닌) 클래스 `C`에서 `B b = new B();` 뒤에 쓸 수 있는 줄을 모두 고르라. (가) `b.pub = 1;` (나) `b.pro = 2;` (다) `b.def = 3;` (라) `b.pri = 4;`</summary>

**답:** (가)만 된다.<br>
**이유:** `C`는 다른 패키지이고 자식도 아니다. `protected`는 자식이 아니라서, default는 패키지가 달라서, `private`는 클래스 밖이라서 막힌다. (나)를 되는 것으로 고르는 오답이 흔하다. `protected`는 "보호된 공개"가 아니라 "같은 패키지와 자식에게만"이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 필드를 `public`으로 내놓지 않고 `private` 필드에 getter와 setter를 두는 이유는? 예시의 체력으로 설명하라.</summary>

**답:** `public` 필드에는 아무 값이나 들어간다. `private`로 감추고 `setHealth`로만 넣게 하면, 그 안에서 0보다 작으면 0, 45보다 크면 45로 걸러 체력이 늘 0~45에 있게 할 수 있다. getter도 필드 값을 그대로 주지 않고 밖에서 쓰기 좋게 바꿔 줄 수 있다(`name`이 없으면 "(이름 없음)").<br>
**이유:** setter가 검사 없이 `this.health = health;` 한 줄뿐이면 이 이득이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `private double speed;` 필드에 슬라이드의 이름 규칙대로 getter와 setter의 머리(선언부)를 쓰라. setter는 음수를 0으로 바꿔 넣게 하라.</summary>

**답:** `public double getSpeed() { return speed; }` / `public void setSpeed(double speed) { if (speed < 0) { this.speed = 0; } else { this.speed = speed; } }`<br>
**이유:** getter는 `get` + 필드 이름(첫 글자 대문자), 돌려주는 타입은 필드 타입. setter는 `set` + 필드 이름, `void`, 매개변수는 필드 타입. setter 안에서 `this.`를 빼면 매개변수에 매개변수를 넣게 된다[^s1].

</details>


[^1]: 소프트웨어 프로젝트 7회 강의 자료 「Software Project 07. Class (2)」, p.12 (Access modifiers, 외부 객체가 노출 메서드·필드에는 닿고 숨긴 필드·메서드에는 닿지 못하는 그림)
[^2]: 같은 자료, p.13 (public ⊃ protected ⊃ default ⊃ private 그림, 접근 제한자·제한 대상·제한 범위 표)
[^3]: 같은 자료, p.14 (Access restriction for classes)
[^4]: 같은 자료, p.15 (Access restriction for constructors)
[^5]: 같은 자료, p.16 (Access restriction for fields and methods). 표의 둘째 칸 머리글이 "생성자"로 적혀 있으나 내용은 필드와 메서드다.
[^6]: 같은 자료, p.17 (Setter, Getter, 선언 형식과 이름 규칙)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `Scv` 예와 출력, 네 곳에서 써 본 표와 오류 문구, 클래스 그림의 `package2` 표기, `Map` 예, 활용의 항목, 카드 C2~C4는 원본에 없다. 슬라이드에는 getter·setter의 틀만 있고 검사하는 예가 없다. `package1`(`A`, `B`, 같은 패키지의 클래스)과 `package2`(남 `C`, 자식 `D`)를 만들어 JDK 21에서 직접 컴파일해 확인했다.
{% endraw %}
