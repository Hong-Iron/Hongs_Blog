---
layout: "note"
title: "final과 상수"
display_title: "final과 상수 (Final Field and Constant)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-11"
status: "verified"
aliases: ["final", "Final Field", "final 필드", "상수", "Constant", "static final", "불변", "Immutable"]
description: "볼펜으로 한 번 적으면 못 고치는 칸이라고 생각하면 된다. 학번처럼 처음 한 번만 정하고 끝까지 그대로여야 하는 값을 이런 칸에 둔다. 실수로 다른 값을 넣으려 하면 프로그램을 번역할 때 걸러진다. 다만 막는 것은 \"그 칸에 다른 것을 적기\"뿐이다. 칸에 적힌 것이 어떤 물건이 있…"
prev_url: "/studies/java/java-static/"
prev_title: "static 멤버"
next_url: "/studies/java/java-package/"
next_title: "패키지"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "17_java-final_impl.java", "u": "/studies/java/code/17_java-final_impl/", "r": "구현"}]
permalink: "/studies/java/java-final/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

볼펜으로 한 번 적으면 못 고치는 칸이라고 생각하면 된다. 학번처럼 처음 한 번만 정하고 끝까지 그대로여야 하는 값을 이런 칸에 둔다. 실수로 다른 값을 넣으려 하면 프로그램을 번역할 때 걸러진다. 다만 막는 것은 "그 칸에 다른 것을 적기"뿐이다. 칸에 적힌 것이 어떤 물건이 있는 곳이라면, 그 물건의 속을 바꾸는 것까지는 막지 못한다.

</div>


## 예시로 보기

학생의 이름은 바뀔 수 있지만 학번은 입학 때 정해지면 그대로다. 학번을 보통 필드로 두면 어느 코드나 `s.id = "0";`이라고 쓸 수 있고, 그런 실수는 실행해서 결과가 이상해질 때까지 드러나지 않는다. 필드 앞에 `final`을 붙이면 번역기가 막아 준다.

```java
class Student {
    final String school = "CAU";   // 선언할 때 값을 준다
    final String id;               // 생성자에서 값을 준다
    String name;

    Student(String id, String name) {
        this.id = id;
        this.name = name;
    }
}
```

```java
Student a = new Student("2024001", "Alice");
Student b = new Student("2024002", "Bob");
a.name = "Alicia";
System.out.println(a.school + " " + a.id + " " + a.name);   // CAU 2024001 Alicia
System.out.println(b.school + " " + b.id + " " + b.name);   // CAU 2024002 Bob
```

`name`은 바꿀 수 있다. `id`는 학생마다 다른 값을 가지되, 한 번 들어가면 못 바꾼다. `a.id = "0";`이나 `a.school = "SNU";`를 쓰면 이런 오류가 난다[^s1].

```
error: cannot assign a value to final variable id
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력, 상수 예(45, 314.159), final 배열의 칸 바꾸기([100, 45, 45])를 JDK 21에서 실행해 비교. 오류 문구 넷은 따로 컴파일해 확인 — [17_java-final_impl.java](/Hongs_Blog/studies/java/code/17_java-final_impl/)</div>

</div>


## 정의

**final 필드**는 값을 한 번 넣으면 프로그램이 도는 동안 바꿀 수 없는 필드다.

```java
final 타입 필드 [= 초기값];
```

처음 값을 주는 방법은 둘 중 하나다.

1. 필드를 선언하면서 준다(`school`). 모든 객체가 같은 값을 가진다.
2. 생성자에서 준다(`id`). 객체마다 다른 값을 가질 수 있다.

둘 다 하지 않으면 번역되지 않는다. `final String id;`만 두고 생성자에서 넣지 않으면 `variable id might not have been initialized` 오류가 난다. 값을 줄 기회가 다시는 없기 때문이다[^s1].

**상수**는 바뀌지 않는 값을 담는 필드다. 상수는 객체마다 따로 둘 까닭이 없고(`static`), 값이 여럿이어서도 안 되므로(`final`), `static`과 `final`을 함께 붙인다.

```java
static final 타입 상수 [= 초기값];
```

```java
class Game {
    static final int MAX_HEALTH = 45;
    static final double PI = 3.14159;
}
```

`Game.MAX_HEALTH`는 `45`, `10 * 10 * Game.PI`는 `314.159`다. 객체 없이 클래스 이름으로 쓴다([static 멤버](/Hongs_Blog/studies/java/java-static/)). `Game.MAX_HEALTH = 999;`는 `cannot assign a value to static final variable MAX_HEALTH` 오류다. 상수 이름은 `MAX_HEALTH`처럼 모두 대문자로 쓰고 낱말 사이를 밑줄로 잇는 것이 자바의 관례다[^s1].

| | final 필드 | 상수(static final) |
|---|---|---|
| 있는 곳 | 객체마다 하나 | 클래스에 하나 |
| 값을 주는 곳 | 선언할 때 또는 생성자 | 선언할 때(또는 정적 블록) |
| 객체마다 값이 | 다를 수 있다(학번) | 모두 같다(최대 체력) |

### final은 칸을 잠그지, 물건을 잠그지 않는다

배열이나 객체를 가리키는 필드에 `final`을 붙이면, 못 바꾸는 것은 "무엇을 가리키는가"다. 가리키는 대상의 속은 그대로 바꿀 수 있다[^s1].

```java
class Squad {
    final int[] healths = {45, 45, 45};
}
```

```java
Squad s = new Squad();
s.healths[0] = 100;                              // 된다
System.out.println(Arrays.toString(s.healths));  // [100, 45, 45]
s.healths = new int[3];                          // error: cannot assign a value to final variable healths
```

```
s.healths ──(final: 이 화살표를 못 바꾼다)──▶ [ 100 | 45 | 45 ]  ← 칸의 값은 바꿀 수 있다
```

변수에 들어 있는 것이 배열 자체가 아니라 배열이 있는 곳의 주소이기 때문이다([참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)).

## 활용

- 한 번 정하면 그대로여야 하는 값(학번, 만든 날짜)은 `final` 필드로, 프로그램 전체에서 같은 값(원주율, 최대 체력)은 상수로 둔다.
- 코드 곳곳에 `45`를 직접 쓰는 대신 `Game.MAX_HEALTH`를 쓰면, 값을 바꿀 때 한 곳만 고치면 되고 숫자가 무슨 뜻인지도 이름에 남는다[^s1].
- 흔한 실수: `static final`로 배열을 만들어 놓고 내용도 못 바꾼다고 믿는 것. 칸의 값은 바뀐다.
- `final`은 필드 말고 메서드와 클래스에도 붙는다. 메서드에 붙이면 자식이 다시 쓸 수 없다([메서드 오버라이딩](/Hongs_Blog/studies/java/java-overriding/))[^s1].

## 연결

- 선수: [필드와 메서드](/Hongs_Blog/studies/java/java-fields-methods/), [생성자](/Hongs_Blog/studies/java/java-constructor/), [static 멤버](/Hongs_Blog/studies/java/java-static/)
- 인터페이스에 적는 필드는 모두 상수다: [인터페이스](/Hongs_Blog/studies/java/java-interface/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** final 필드에 처음 값을 주는 두 가지 방법과, 상수를 선언하는 방법을 쓰라.</summary>

**답:** 필드를 선언하면서 주거나, 생성자에서 준다. 상수는 `static final 타입 이름 = 값;`으로 선언한다.<br>
**이유:** "아무 메서드에서나 한 번은 줄 수 있다"가 흔한 오답이다. 생성자가 끝날 때까지 값이 들어가 있어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 상수에 `final`만 붙이지 않고 `static`도 함께 붙이는 이유는?</summary>

**답:** `final`만 붙이면 바뀌지는 않지만 객체마다 한 칸씩 생긴다. 상수는 모든 객체에서 같은 값이라 객체마다 둘 까닭이 없다. `static`을 붙여 클래스에 하나만 두고, `final`로 그 하나가 바뀌지 않게 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `class Squad { final int[] healths = {45, 45, 45}; static final int MAX = 45; }`와 `Squad s = new Squad();`가 있다. 번역 단계에서 오류가 나는 줄을 모두 고르라. (가) `s.healths[0] = 100;` (나) `s.healths = new int[3];` (다) `Squad.MAX = 50;` (라) `int x = Squad.MAX + 1;`</summary>

**답:** (나)와 (다).<br>
**이유:** (나)는 `final` 변수가 가리키는 대상을 바꾸려 해서, (다)는 상수에 값을 다시 넣으려 해서 막힌다. (가)는 가리키는 배열은 그대로 두고 칸의 값만 바꾸므로 된다. (가)를 오류로 고르는 것이 가장 흔한 오답이다[^s1].

</details>


[^s1]: 모두 JDK 21에서 직접 실행·컴파일해 확인했다. 상수 이름 관례는 Oracle의 Java Code Conventions 9절에 있다.
{% endraw %}
