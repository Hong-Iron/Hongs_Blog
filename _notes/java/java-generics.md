---
layout: "note"
title: "제네릭"
display_title: "제네릭 (Generics)"
kind: "concept"
kind_label: "정의"
num: "38"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
updated: "2026-10-11"
status: "verified"
aliases: ["Generics", "Generic", "제네릭 타입", "Generic Type", "제네릭 메서드", "Generic Method", "타입 파라미터", "Type Parameter", "타입 매개변수"]
description: "무엇을 담을지 비워 둔 상자 설계도다. 설계도에는 \"여기에 들어갈 것의 종류\"를 빈칸으로 두고, 상자를 실제로 쓸 때 \"이 상자는 글자용\"처럼 빈칸을 채운다. 설계도 하나로 글자 상자도 숫자 상자도 만들 수 있고, 글자 상자에 숫자를 넣으려 하면 프로그램을 돌려 보기도 전에 번역 …"
prev_url: "/studies/java/java-custom-exception/"
prev_title: "사용자 정의 예외"
next_url: "/studies/java/java-bounded-wildcard/"
next_title: "제한된 타입 파라미터와 와일드카드"
math: false
mermaid: false
code_count: 1
permalink: "/studies/java/java-generics/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

무엇을 담을지 비워 둔 상자 설계도다. 설계도에는 "여기에 들어갈 것의 종류"를 빈칸으로 두고, 상자를 실제로 쓸 때 "이 상자는 글자용"처럼 빈칸을 채운다. 설계도 하나로 글자 상자도 숫자 상자도 만들 수 있고, 글자 상자에 숫자를 넣으려 하면 프로그램을 돌려 보기도 전에 번역 단계에서 걸러 준다. 단, 빈칸에는 정수나 실수 같은 기본 값의 종류를 바로 쓸 수 없고 객체의 종류만 쓸 수 있다.

</div>


## 예시로 보기

내용물 하나를 담는 상자 클래스를 만든다. 문자열도 담고 정수도 담고 싶다. 빈칸 없이 만들려면 무엇이든 받는 `Object`로 선언하는 수밖에 없다[^s1].

```java
class ObjectBox {
    public Object content;
}

ObjectBox box = new ObjectBox();
box.content = 100;                      // 정수를 넣었다
String str = (String) box.content;      // 문자열인 줄 알고 꺼냈다
```

이 코드는 번역된다. 그리고 실행하면 마지막 줄에서 `ClassCastException`으로 끝난다. 꺼낼 때마다 [강제 변환](/Hongs_Blog/studies/java/java-casting/)을 써야 하고, 잘못 꺼내도 번역기는 모른다.

내용물의 타입 자리를 빈칸 `T`로 둔다[^1].

```java
public static class Box<T> {
    public T content;
}

Box<String> box1 = new Box<>();
box1.content = "hello world!";
String str = box1.content;
System.out.println(str);                // hello world!
```

`Box<String>`이라고 쓰는 순간 이 상자의 `T`는 `String`이 된다. 꺼낼 때 강제 변환이 없다. 여기에 `box1.content = 100;`을 쓰면 번역 단계에서 막힌다[^s1].

```text
error: incompatible types: int cannot be converted to String
```

실행해야 드러나던 실수가 번역 때 드러난다.

## 정의

**제네릭**은 아직 정하지 않은 타입을 파라미터로 두고, 실제로 쓸 때 그 파라미터를 구체적인 타입으로 바꿔 넣는 기능이다. `<T>`는 `T`가 타입 파라미터라는 표시다. 타입이 필요한 자리에 `T`를 쓸 수 있다는 뜻이다[^2].

메서드의 매개변수와 견주면 이해가 쉽다. 매개변수는 값이 들어올 빈칸이고, 타입 파라미터는 타입이 들어올 빈칸이다[^s2].

| | 메서드의 매개변수 | 타입 파라미터 |
|---|---|---|
| 빈칸을 두는 곳 | `void set(int x)`의 `x` | `class Box<T>`의 `T` |
| 채우는 것 | 값 (`set(3)`) | 타입 (`Box<String>`) |
| 채우는 때 | 실행 중, 부를 때마다 | 번역 때, 쓰는 코드를 적을 때 |

### 제네릭 타입

**제네릭 타입**은 정하지 않은 타입을 파라미터로 가진 클래스와 인터페이스다. 선언할 때 이름 뒤에 `< >`를 쓰고 그 사이에 타입 파라미터를 둔다. 타입 파라미터는 보통 대문자 한 글자로 쓴다. 밖에서 제네릭 타입을 쓸 때는 타입 파라미터 자리에 구체적인 타입을 적어야 한다. 적지 않으면 `Object` 타입이 쓰인다[^3].

타입 파라미터는 쉼표로 나눠 여러 개 둘 수 있다[^4].

```java
public static class Product<K, M> {
    private K kind;
    private M model;

    public K getKind() { return this.kind; }
    public M getModel() { return this.model; }
    public void setKind(K kind) { this.kind = kind; }
    public void setModel(M model) { this.model = model; }
}

public static class Tv {}
public static class Car {}
```

```java
Product<Tv, String> product1 = new Product<>();    // K는 Tv, M은 String
product1.setKind(new Tv());
product1.setModel("Smart Tv");
Tv tv = product1.getKind();
String tvModel = product1.getModel();

Product<Car, String> product2 = new Product<>();   // K는 Car, M은 String
product2.setKind(new Car());
product2.setModel("SUV");
Car car = product2.getKind();
String carModel = product2.getModel();
```

`Product` 클래스는 하나인데 `product1`의 `getKind()`는 `Tv`를, `product2`의 `getKind()`는 `Car`를 돌려준다. 변수를 선언할 때 적은 타입이 클래스 안의 `K`, `M` 자리에 그대로 들어간 것처럼 번역기가 다룬다.

`new Product<>()`의 빈 `<>`는 왼쪽에 적은 타입을 그대로 쓴다는 뜻이다. 두 번 적지 않아도 된다[^s2].

### 제네릭 메서드

**제네릭 메서드**는 타입 파라미터를 가진 메서드다. 타입 파라미터를 메서드 선언에서 정한다. 돌려주는 타입 앞에 `< >`를 써서 타입 파라미터를 정하고, 그것을 돌려주는 타입과 매개변수 타입에 쓴다[^5].

```java
public <A, B, …> 리턴타입 메서드이름(매개변수, …) { … }
```

```java
public static <T> Box<T> boxing(T t) {
    Box<T> box = new Box<>();
    box.content = t;
    return box;
}

Box<Integer> box1 = boxing(100);          // T는 Integer
Box<String>  box2 = boxing("안녕하세요");   // T는 String
```

부를 때 타입을 따로 적지 않는다. 번역기가 넘긴 인자의 타입을 보고 `T`를 구체적인 타입으로 바꾼다[^6]. `100`은 `int`인데 `T`가 `Integer`가 됐다. 타입 파라미터 자리에는 객체의 타입만 올 수 있어서, 번역기가 `int` 값을 `Integer` 객체로 감싸 넘긴다[^s3].

메서드의 타입 파라미터는 클래스의 타입 파라미터와 따로 논다. 아래 클래스에서 `genericMethod1`의 `<E>`는 클래스의 `E`와 글자만 같고 다른 빈칸이다[^7].

```java
class ClassName<E> {
    private E element;

    void setElement(E element) { this.element = element; }
    E get() { return element; }

    public <E> E genericMethod1(E o) { return o; }   // 메서드가 따로 정한 E
    public <T> T genericMethod2(T o) { return o; }
}
```

```java
ClassName<String> a = new ClassName<>();
ClassName<Integer> b = new ClassName<>();

a.setElement("10");
b.setElement(10);

System.out.println(a.get().getClass().getName());
System.out.println(b.get().getClass().getName());

System.out.println(a.genericMethod1(10).getClass().getName());
System.out.println(b.genericMethod2("10").getClass().getName());
```

```text
java.lang.String
java.lang.Integer
java.lang.Integer
java.lang.String
```

| 줄 | 부른 것 | 빈칸이 채워진 값 | 출력 |
|---|---|---|---|
| 1 | `a.get()` | 클래스의 `E` = `String` (`a`를 선언할 때 정했다) | `java.lang.String` |
| 2 | `b.get()` | 클래스의 `E` = `Integer` | `java.lang.Integer` |
| 3 | `a.genericMethod1(10)` | 메서드의 `E` = `Integer` (인자 `10`을 보고 정했다) | `java.lang.Integer` |
| 4 | `b.genericMethod2("10")` | 메서드의 `T` = `String` | `java.lang.String` |

셋째 줄이 핵심이다. `a`는 `ClassName<String>`인데 `genericMethod1`에 정수를 넘겨도 번역되고 `Integer`가 나온다. 메서드의 `<E>`가 클래스의 `E`를 가렸기 때문이다. 반대로 `a.setElement(10)`은 번역되지 않는다. `setElement`는 클래스의 `E`(여기서는 `String`)를 쓴다[^7][^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `ObjectBox`의 `ClassCastException`, `Box`와 `Product` 예, `boxing`의 타입, 위 네 줄 출력, 타입을 안 적은 `Box`의 내용물이 `Object`로 나오는 것, 카드 C2의 답 — [38_java-generics_impl.java](/Hongs_Blog/studies/java/code/38_java-generics_impl/)</div>

</div>


## 활용

- 타입 파라미터 자리에 기본 타입은 못 쓴다. `Box<int>`는 `unexpected type … required: reference, found: int` 오류가 난다. `Box<Integer>`, `Box<Double>`처럼 감싸는 클래스를 쓴다[^s3].
- 타입을 안 적고 `Box box = new Box();`처럼 쓰면 번역은 되지만 `content`가 `Object`로 다뤄져서 `ObjectBox`와 같은 처지가 된다. 번역기가 경고(`found raw type`)를 낸다. 새 코드에서는 늘 타입을 적는다[^s3].
- 타입 파라미터 이름은 관례로 `T`(타입), `E`(원소), `K`(키), `V`(값)를 많이 쓴다. 슬라이드의 `Product<K, M>`은 kind와 model의 첫 글자다[^s2].
- 메서드의 타입 파라미터에 클래스와 같은 글자를 쓰면 위 `genericMethod1`처럼 헷갈린다. 다른 글자를 쓴다.
- `Box<String>`과 `Box<Integer>`는 번역 때만 다르고, 실행 중에는 같은 `Box` 클래스 하나다(`getClass()`가 같다). 타입 검사는 번역기가 끝내 놓는다[^s3].

## 연결

- 선수: [참조 타입 변환과 instanceof](/Hongs_Blog/studies/java/java-casting/). 제네릭이 없으면 꺼낼 때마다 강제 변환이 필요하다.
- [다형성](/Hongs_Blog/studies/java/java-polymorphism/)도 "코드 하나로 여러 타입을 다룬다". 다형성은 부모 타입 하나로 받아 실행 중에 실제 객체가 정해지고, 제네릭은 빈칸을 두고 번역 때 타입이 정해진다.
- 빈칸에 들어올 타입을 좁히려면: [제한된 타입 파라미터와 와일드카드](/Hongs_Blog/studies/java/java-bounded-wildcard/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 제네릭 타입과 제네릭 메서드에서 타입 파라미터 `<T>`를 적는 자리를 각각 쓰라. 제네릭 타입을 쓸 때 타입을 안 적으면 어떻게 되는가?</summary>

**답:** 제네릭 타입은 클래스(인터페이스) 이름 바로 뒤에 적는다: `class Box<T>`. 제네릭 메서드는 돌려주는 타입 바로 앞에 적는다: `public <T> Box<T> boxing(T t)`. 타입을 안 적으면 `Object` 타입이 쓰인다.<br>
**이유:** 제네릭 메서드에서 `<T>`를 메서드 이름 뒤에 적는 것이 흔한 실수다. `Box<T>`의 `<T>`는 돌려주는 타입의 일부이고, 그 앞의 `<T>`가 빈칸을 새로 만드는 표시다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 본문의 `Box<T>`와 `boxing`에 더해 `static <T> T pick(T first, T second) { return second; }`가 있다. 출력 세 줄을 쓰라. `Box<String> b1 = boxing("7");` `Box<Integer> b2 = boxing(7);` `System.out.println(b1.content + b1.content);` `System.out.println(b2.content + b2.content);` `System.out.println(pick("x", "y"));`</summary>

**답:** `77`, `14`, `y`.<br>
**이유:** `b1`의 `T`는 `String`이라 `+`가 문자열을 잇는다. `b2`의 `T`는 `Integer`라 `+`가 덧셈이다. 같은 `Box` 클래스, 같은 `content` 필드인데 선언한 타입에 따라 번역기가 다르게 다룬다. `pick`은 둘째 인자를 돌려준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 번역되지 않는 줄을 모두 고르라. 앞에 `Box<String> a = new Box<>();`가 있다. ① `a.content = "hi";` ② `a.content = 100;` ③ `Box<Integer> b = boxing(5);` ④ `Box<Integer> c = boxing("5");` ⑤ `Box<double> d = new Box<>();`</summary>

**답:** ②, ④, ⑤다.<br>
**이유:** ②는 `String` 자리에 `int`를 넣었다. ④는 인자가 `String`이라 `Box<String>`이 나오는데 `Box<Integer>` 변수에 받으려 했다. ⑤는 타입 파라미터 자리에 기본 타입을 썼다. ③은 `5`가 `Integer`로 감싸져 `Box<Integer>`가 나오므로 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 본문의 `a`는 `ClassName<String>`이다. `a.setElement(10)`은 번역되지 않는데 `a.genericMethod1(10)`은 번역되는 이유는?</summary>

**답:** `setElement(E element)`의 `E`는 클래스의 타입 파라미터이고 `a`에서는 `String`으로 정해져 있다. `genericMethod1`은 선언 앞에 `<E>`를 따로 적어 자기만의 빈칸을 새로 만들었다. 이 `E`는 부를 때 넘긴 인자(`10`)를 보고 `Integer`로 정해진다.<br>
**이유:** 메서드 선언의 돌려주는 타입 앞에 `< >`가 있으면 제네릭 메서드이고, 그 안의 글자는 클래스의 것과 같아도 다른 빈칸이다.

</details>


[^1]: 소프트웨어 프로젝트 17회 강의 자료 「Software Project 17. Generics」, p.4 (`Box<T>` 예제)
[^2]: 같은 자료, p.3 (제네릭의 뜻, `<T>`의 뜻)
[^3]: 같은 자료, p.5 (제네릭 타입, 타입을 안 적으면 Object)
[^4]: 같은 자료, p.6 (`Product<K, M>`, Tv, Car 예제)
[^5]: 같은 자료, p.7 (제네릭 메서드, 타입 파라미터를 적는 자리)
[^6]: 같은 자료, p.8 (boxing 메서드, 인자의 타입을 보고 T를 바꾼다)
[^7]: 같은 자료, p.9 (`ClassName<E>`와 genericMethod1·genericMethod2. `a.setElement(10)`과 `b.setElement("10")`은 주석으로 막혀 있다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `ObjectBox`와의 비교, `box1.content = 100`의 번역 오류는 원본에 없다. `ClassCastException`은 검증 코드로, 번역 오류 문구는 JDK 21 javac로 확인했다. 원본 p.4의 `Box`는 `Main` 안의 `static` 클래스다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 매개변수와 견준 표, 빈 `<>`의 뜻, 글자 관례는 원본에 없다. 원본 p.6의 `main`은 `Tv tv1 = new Tv();`로 객체를 먼저 만들어 넘긴다. 여기서는 줄였다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 실행 결과 네 줄과 표, `int`가 `Integer`로 감싸진다는 설명, `boxing`의 몸통(원본은 `{ … }`), `Box<int>` 오류, 타입을 안 적었을 때의 경고, 실행 중에는 같은 클래스라는 것, 카드 C2·C3·C4는 원본에 없다. 출력은 검증 코드로, 번역 오류와 경고는 JDK 21 javac로 확인했다.
{% endraw %}
