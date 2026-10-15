---
layout: "note"
title: "static 멤버"
display_title: "static 멤버 (Static Member)"
kind: "concept"
kind_label: "정의"
num: "16"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Static Member", "정적 멤버", "정적 필드", "Static Field", "정적 메서드", "Static Method", "정적 블록", "Static Block", "인스턴스 멤버", "Instance Member", "메서드 영역", "Method Area"]
description: "교실 앞 칠판과 학생마다 가진 공책을 떠올리면 된다. 공책은 학생 수만큼 있고 내용이 저마다 다르다. 칠판은 교실에 하나뿐이라 누가 고쳐 쓰든 모두가 같은 내용을 본다. 클래스에도 객체마다 따로 있는 값과, 클래스에 하나만 있어 모든 객체가 같이 보는 값이 있다. 하나만 있는 쪽은…"
prev_url: "/studies/java/java-constructor/"
prev_title: "생성자"
next_url: "/studies/java/java-final/"
next_title: "final과 상수"
math: false
mermaid: true
code_count: 1
permalink: "/studies/java/java-static/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

교실 앞 칠판과 학생마다 가진 공책을 떠올리면 된다. 공책은 학생 수만큼 있고 내용이 저마다 다르다. 칠판은 교실에 하나뿐이라 누가 고쳐 쓰든 모두가 같은 내용을 본다. 클래스에도 객체마다 따로 있는 값과, 클래스에 하나만 있어 모든 객체가 같이 보는 값이 있다. 하나만 있는 쪽은 객체를 만들지 않아도 쓸 수 있어 편하다. 대신 그쪽 코드에서는 "누구의 공책인지"를 알 수 없으므로, 객체마다 따로 있는 값을 그냥은 쓸 수 없다.

</div>


## 예시로 보기

건설로봇을 만들 때마다 "지금까지 몇 대 만들었나"를 세고 싶다. 이 숫자를 보통의 필드에 두면 로봇마다 자기 숫자를 따로 가져서 셀 수가 없다. 로봇 전체에 하나만 있는 칸이 필요하다.

```java
class Scv {
    static int count = 0;   // 클래스에 하나
    int id;                 // 객체마다 하나

    Scv() {
        count++;
        id = count;
    }
}
```

```java
Scv a = new Scv();
Scv b = new Scv();
Scv c = new Scv();
System.out.println(a.id + " " + b.id + " " + c.id);   // 1 2 3
System.out.println(Scv.count);                        // 3
```

`id`는 로봇마다 다르고(1, 2, 3), `count`는 하나뿐이라 세 번 늘어 3이다. `count`처럼 앞에 `static`을 붙인 멤버를 정적 멤버, `id`처럼 붙이지 않은 멤버를 인스턴스 멤버라고 부른다.

```
메서드 영역 (클래스마다 하나)        힙 (객체마다 하나)
┌ Scv 클래스 ──────────┐
│ static int count = 3 │         a ──▶ ┌ Scv ───┐
│ 생성자·메서드의 코드 │               │ id = 1 │
└──────────────────────┘               └────────┘
                                 b ──▶ ┌ Scv ───┐
                                       │ id = 2 │
                                       └────────┘
                                 c ──▶ ┌ Scv ───┐
                                       │ id = 3 │
                                       └────────┘
```

객체 안에는 `count` 칸이 없다. `count`는 클래스 쪽에 한 칸만 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력, `Calculator`의 314.159·15·5, null인 변수로 정적 필드를 읽어도 3이 나오는 것, 정적 블록의 실행 순서, 카드 C3의 답을 JDK 21에서 실행해 비교. 정적 메서드에서 인스턴스 멤버를 쓸 때의 오류 문구는 따로 컴파일해 확인 — [16_java-static_impl.java](/Hongs_Blog/studies/java/code/16_java-static_impl/)</div>

</div>


## 정의

**정적 멤버**는 객체가 아니라 클래스에 붙어, 메서드 영역에 자리 잡는 멤버다. 필드나 메서드 앞에 `static`을 붙여 정적 필드, 정적 메서드로 선언한다. 메서드 영역은 번역된 클래스 파일을 읽어 들여 클래스의 정보를 두는 곳이다([참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)).

```mermaid
flowchart LR
    F["클래스 파일(.class)"] -->|"바이트코드 읽기(로딩)"| L["클래스 로더"]
    L -->|"바이트코드 저장"| M["메서드 영역: 클래스, 정적 필드, 정적 메서드"]
```

클래스를 처음 쓸 때 클래스 로더가 파일을 읽어 메서드 영역에 올린다. 정적 멤버는 이때 함께 자리 잡는다.

### 쓰는 법

클래스가 메모리에 올라오면 객체를 만들지 않고도 정적 멤버를 바로 쓸 수 있다. 클래스 이름 뒤에 점을 찍어 쓴다.

```java
public class Calculator {
    static double pi = 3.14159;
    static int plus(int x, int y) { return x + y; }
    static int minus(int x, int y) { return x - y; }
}
```

```java
double result1 = 10 * 10 * Calculator.pi;    // 314.159
int result2 = Calculator.plus(10, 5);        // 15
int result3 = Calculator.minus(10, 5);       // 5
```

`new Calculator()`가 어디에도 없다. 객체를 가리키는 변수로도 정적 멤버에 닿을 수 있지만(`a.count`), 권하지 않는다. 객체의 값처럼 보여서 읽는 사람이 헷갈리기 때문이다.

### 정적 블록

정적 필드의 초기값을 한 줄로 못 적을 만큼 준비가 복잡하면 정적 블록을 쓴다.

```java
class Table {
    static int[] squares;

    static {
        System.out.println("block 1");
        squares = new int[5];
        for (int i = 0; i < squares.length; i++) {
            squares[i] = i * i;
        }
    }

    static {
        System.out.println("block 2");
    }
}
```

```java
System.out.println("before");
System.out.println(Table.squares[2]);
System.out.println(Table.squares[3]);
```

| 줄 | 일어나는 일 | 출력 |
|---|---|---|
| `println("before")` | `Table`을 아직 쓰지 않았다 | `before` |
| `Table.squares[2]` | `Table`을 처음 쓴다. 클래스가 올라오며 정적 블록이 적힌 순서대로 돈다 | `block 1`, `block 2`, 그다음 `4` |
| `Table.squares[3]` | 이미 올라와 있다. 블록은 다시 돌지 않는다 | `9` |

정적 블록은 클래스가 메모리에 올라올 때 저절로 돈다. 여러 개면 적힌 순서대로 돈다. 정적 필드는 객체 없이도 쓰이므로 생성자에서 채울 일이 아니다. 생성자는 객체를 만들 때만 돌기 때문이다.

### 인스턴스 멤버를 쓸 수 없다

정적 메서드와 정적 블록 안에서는 인스턴스 필드, 인스턴스 메서드, `this`를 쓸 수 없다. 정적 메서드는 `Calculator.plus(10, 5)`처럼 객체 없이 불린다. 그 안에서 `field1`이라고 쓰면 어느 객체의 `field1`인지 정할 길이 없다.

```java
class E5 {
    int field1;
    void method1() {}

    static void method3() {
        field1 = 10;        // error: non-static variable field1 cannot be referenced from a static context
        method1();          // error: non-static method method1() cannot be referenced from a static context
        this.field1 = 10;   // error: non-static variable this cannot be referenced from a static context
    }
}
```

정적 메서드에서 인스턴스 멤버를 쓰려면 객체를 먼저 만들고, 그 객체를 가리키는 변수로 닿는다.

```java
static void method3() {
    ClassName obj = new ClassName();   // 객체 만들기
    obj.field1 = 10;                   // 인스턴스 멤버 쓰기
    obj.method1();
}
```

반대 방향은 막히지 않는다. 인스턴스 메서드나 생성자 안에서는 정적 멤버를 그냥 쓴다(`Scv()` 안의 `count++`). 클래스는 하나뿐이라 헷갈릴 것이 없다[^s1].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `main` 메서드에 `static`이 붙어 있는 이유는?</summary>

프로그램을 시작할 때는 아직 객체가 하나도 없다. 객체 없이 부를 수 있는 메서드여야 첫 줄을 시작할 수 있다. 그래서 `main`은 정적 메서드다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 그래서 `main` 안에서 같은 클래스의 인스턴스 메서드를 `method1();`처럼 바로 부르면 어떻게 되는가?</summary>

`non-static method method1() cannot be referenced from a static context` 오류가 난다. `main`은 객체 없이 불리므로 `method1`을 돌릴 객체가 없다. `new`로 객체를 만든 뒤 `obj.method1()`로 불러야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `Scv none = null; System.out.println(none.count);`가 오류 없이 3을 찍는 이유는?</summary>

`count`는 정적 필드다. 번역기는 `none.count`를 변수의 타입 `Scv`만 보고 `Scv.count`로 바꿔 둔다. 실행할 때 `none`이 가리키는 객체를 들여다보지 않으므로 `null`이어도 문제가 없다. 인스턴스 필드 `none.id`였다면 `NullPointerException`이 난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 내용의 핵심 생각은?</summary>

정적 멤버는 "객체 없이도 뜻이 통하는가"로 가른다. 객체 없이 불리므로 그 안에는 `this`가 없고, `this`가 없으니 인스턴스 멤버에 닿을 길이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓸 수 있는 다른 상황은?</summary>

`Math.max(3, 5)`나 `Arrays.toString(배열)`은 어떤 객체의 값도 쓰지 않고 넘겨받은 값만으로 일한다. 그래서 정적 메서드이고 클래스 이름으로 부른다.

</details>


## 활용

- 정적 필드로 두는 것: 모든 객체가 같이 보는 값(만든 수, 공통 설정)과 바뀌지 않는 값([상수](/Hongs_Blog/studies/java/java-final/)).
- 정적 메서드로 두는 것: 객체의 필드를 쓰지 않고 넘겨받은 값만으로 일하는 메서드. 위의 `Calculator.plus`가 그렇다.
- 흔한 실수: `main`에서 같은 클래스의 인스턴스 필드를 바로 쓰는 것. 위의 `non-static ... static context` 오류가 가장 자주 나는 자리다[^s1].
- 흔한 실수: 객체마다 달라야 할 값에 `static`을 붙이는 것. 한 객체가 바꾸면 모든 객체의 값이 바뀐 것처럼 보인다.

## 연결

- 선수: [필드와 메서드](/Hongs_Blog/studies/java/java-fields-methods/), [생성자](/Hongs_Blog/studies/java/java-constructor/), [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)
- `static`에 `final`을 더하면: [final과 상수](/Hongs_Blog/studies/java/java-final/)
- 인터페이스에 두는 정적 메서드: [디폴트·정적·private 메서드](/Hongs_Blog/studies/java/java-interface-methods/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`a.count`라고 썼으니 객체 `a`가 가진 값이다"</div>

틀렸다. 정적 필드는 객체 안에 없다. 그럴듯해 보이는 이유는 `a.id`와 모양이 똑같기 때문이다. 실제로는 번역기가 `a.count`를 `Scv.count`로 바꿔 놓으며, `a`가 어떤 객체를 가리키는지는 쓰이지 않는다. 확인하는 법: `Scv none = null; none.count;`가 오류 없이 3을 찍는다. 객체가 아예 없어도 값이 나온다. 그래서 정적 멤버는 늘 `Scv.count`처럼 클래스 이름으로 쓴다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"static 메서드에서는 인스턴스 멤버를 절대 쓸 수 없다"</div>

틀렸다. 못 하는 것은 "객체를 대지 않고 그냥 쓰기"다. 정적 메서드 안에서 객체를 만들거나 매개변수로 받아 `obj.field1`처럼 누구의 것인지 밝히면 쓸 수 있다. `main`에서 `new`로 객체를 만들어 메서드를 부르는 코드가 모두 이 경우다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 정적 멤버가 어디에 있고, 어떻게 쓰며, 정적 블록이 언제 도는지 쓰라.</summary>

**답:** 클래스와 함께 메서드 영역에 있다. 객체를 만들지 않고 `클래스이름.멤버`로 쓴다(객체 변수로도 되지만 권하지 않는다). 정적 블록은 클래스가 메모리에 올라올 때 한 번, 여러 개면 적힌 순서대로 돈다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `class Robot { int power; static int total; void a() { total++; } static void b() { power++; } static void c() { Robot r = new Robot(); r.power++; } }`에서 번역 단계에 오류가 나는 메서드는?</summary>

**답:** `b`. `non-static variable power cannot be referenced from a static context`.<br>
**이유:** `b`는 객체 없이 불리므로 어느 로봇의 `power`인지 정할 수 없다. `a`는 인스턴스 메서드가 정적 필드를 쓰는 것이라 된다. `c`는 정적 메서드지만 객체를 만들어 `r.power`로 누구의 것인지 밝혔으므로 된다. `c`까지 오류라고 답하는 것이 흔한 오답이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `class Counter { static int shared; int own; void inc() { shared++; own++; } }`에서 `Counter a = new Counter(); Counter b = new Counter(); a.inc(); a.inc(); b.inc();` 뒤 `a.own + " " + b.own + " " + Counter.shared`의 출력은?</summary>

**답:** `2 1 3`<br>
**이유:** `own`은 객체마다 따로라 `a`는 2, `b`는 1이다. `shared`는 클래스에 하나라 `inc`가 불린 세 번이 모두 같은 칸을 늘린다. `2 1 2`나 `2 1 1`은 `shared`를 객체마다 따로 센 답이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 정적 메서드 안에서 `this`를 쓸 수 없는 이유는?</summary>

**답:** `this`는 "이 메서드를 부를 때 쓴 그 객체"다. 정적 메서드는 `Calculator.plus(10, 5)`처럼 객체 없이 클래스 이름으로 불리므로 가리킬 객체가 없다.

</details>


[^s1]: 모두 JDK 21에서 직접 실행·컴파일해 확인했다.
{% endraw %}
