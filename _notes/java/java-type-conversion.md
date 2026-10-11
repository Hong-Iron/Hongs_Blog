---
layout: "note"
title: "타입 변환"
display_title: "타입 변환 (Type Conversion)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-11"
status: "verified"
aliases: ["Type Conversion", "Type Casting", "형 변환", "자동 타입 변환", "Implicit Casting", "Promotion", "Widening Conversion", "강제 타입 변환", "Explicit Casting", "Narrowing Conversion", "캐스팅", "문자열 결합", "String Concatenation", "parseInt", "valueOf"]
description: "작은 컵의 물을 큰 컵에 옮기면 넘치지 않는다. 큰 컵의 물을 작은 컵에 옮기면 넘칠 수 있다. 자바도 같다. 작은 타입의 값을 큰 타입에 넣는 것은 알아서 해 주고, 큰 타입의 값을 작은 타입에 넣는 것은 \"잘려도 괜찮다\"고 직접 적어야만 해 준다. 직접 적었다고 값이 지켜지는 …"
prev_url: "/studies/java/java-primitive-types/"
prev_title: "변수와 기본 타입"
next_url: "/studies/java/java-operators/"
next_title: "연산자와 오버플로"
math: true
mermaid: false
code_count: 1
permalink: "/studies/java/java-type-conversion/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

작은 컵의 물을 큰 컵에 옮기면 넘치지 않는다. 큰 컵의 물을 작은 컵에 옮기면 넘칠 수 있다. 자바도 같다. 작은 타입의 값을 큰 타입에 넣는 것은 알아서 해 주고, 큰 타입의 값을 작은 타입에 넣는 것은 "잘려도 괜찮다"고 직접 적어야만 해 준다. 직접 적었다고 값이 지켜지는 것은 아니다. 들어가지 않는 부분은 말없이 잘려 엉뚱한 값이 된다.

</div>


## 예시로 보기

타입마다 칸 크기가 다르다. 그래서 한 타입의 값을 다른 타입 변수에 넣을 때마다 "들어가는가"를 따져야 한다. `int`는 32비트, `long`은 64비트다[^1].

```java
int i = 100;
long l = i;        // 32비트 값을 64비트 칸에: 그냥 된다

long big = 100;
int j = big;       // 64비트 값을 32비트 칸에: 컴파일 오류
int k = (int) big; // 괄호로 타입을 적으면 된다
```

`big`에 든 값은 100이라 `int`에 충분히 들어간다. 그래도 `javac`는 막는다. `javac`는 변수에 든 값을 보지 않고 타입만 본다. `long`에는 `int`에 안 들어가는 값이 올 수 있으니, 그래도 좋다는 표시를 요구한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드 두 예제의 출력, `(byte)300` = 44 등 잘린 값, `int` → `float`에서 잃는 값, `byte + byte`의 타입, `+` 예제 여덟 줄, 문자열 변환 표, 카드 C1·C3 — [03_java-type-conversion_impl.java](/Hongs_Blog/studies/java/code/03_java-type-conversion_impl/)</div>

</div>


## 자동 변환

값이 들어가는 범위가 좁은 타입에서 넓은 타입으로 가는 변환은 자바가 알아서 한다(자동 타입 변환). 두 타입이 서로 바꿀 수 있는 사이이고, 작은 타입의 값을 큰 타입에 넣을 때 일어난다[^2].

```
byte -> short -> int -> long -> float -> double
                 ^
char ------------+
```

화살표 방향으로는 몇 칸을 건너뛰어도 된다[^s1].

```java
int i = 100;
long l = i;      // int -> long
float f = l;     // long -> float
System.out.println("Int value " + i);     // Int value 100
System.out.println("Long value " + l);    // Long value 100
System.out.println("Float value " + f);   // Float value 100.0
```

출력은 슬라이드와 같다[^3]. `float`가 되자 `100`이 `100.0`으로 찍힌다. 소수점이 있는 타입이 되었기 때문이다.

어? `long`은 64비트이고 `float`는 32비트인데 왜 `long`에서 `float`가 자동일까? 화살표의 기준은 칸 크기가 아니라 담을 수 있는 수의 범위다. `float`는 자릿수를 줄이는 대신 아주 큰 수까지 적는다. 그래서 범위는 `float`가 넓다. 대신 큰 정수는 끝자리가 뭉개진다. `int` 16,777,217을 `float`에 넣었다가 다시 꺼내면 16,777,216이다[^s2]. 이유는 [부동소수점](/Hongs_Blog/studies/data-and-information/floating-point/)에 있다.

## 강제 변환

넓은 타입의 값을 좁은 타입에 넣거나, 자동으로는 안 바뀌는 사이일 때는 바꿀 타입을 괄호 `( )`에 적어 값 앞에 붙인다(강제 타입 변환)[^4].

```
byte <- short <- int <- long <- float <- double    (모두 괄호가 필요하다)
```

```java
double d = 100.04;
long l = (long) d;     // 소수점 아래를 버린다
int i = (int) l;
System.out.println("Double value " + d);   // Double value 100.04
System.out.println("Long value " + l);     // Long value 100
System.out.println("Int value " + i);      // Int value 100
```

출력은 슬라이드와 같다[^5].

`int`와 `char`는 크기만 보면 `char`(16비트)가 작다. 그래서 `int` 값을 `char`에 넣을 때도 괄호가 필요하다[^6].

```java
char ch = 'c';
int num = 88;
ch = num;          // 컴파일 오류: possible lossy conversion from int to char
ch = (char) num;   // 된다. 88번 글자 'X'
```

**잘리면 어떤 값이 되나.** 괄호는 "잘려도 좋다"는 허락일 뿐이다. 값은 다음과 같이 바뀐다[^s2].

| 식 | 결과 | 까닭 |
|---|---|---|
| `(int) 3.99` | 3 | 소수점 아래를 버린다. 반올림이 아니다 |
| `(int) -3.99` | −3 | 0 쪽으로 버린다 |
| `(byte) 300` | 44 | 아래 8비트만 남긴다 |
| `(byte) 128` | −128 | 아래 8비트 `10000000`은 `byte`에서 −128이다 |

`(byte) 300`을 따라가 보면, 300은 2진수로 `1 0010 1100`이다. `byte`는 8비트라 맨 앞의 `1`이 떨어져 나가고 `0010 1100`이 남는다. 이것은 $$32 + 8 + 4 = 44$$다. 정수끼리는 늘 이렇게 아래쪽 비트만 남긴다.

## 계산하는 중에 일어나는 변환

**작은 정수는 `int`가 되어 계산된다.** `byte`, `short`, `char` 변수는 계산에 들어가는 순간 `int`로 바뀐다. 그래서 `byte` 둘을 더한 결과는 `int`다[^7].

```java
byte x = 10;
byte y = 20;
byte result = x + y;   // 컴파일 오류: possible lossy conversion from int to byte
int result = x + y;    // 된다. 30
```

10 + 20 = 30은 `byte`에 들어가는데도 오류다. 앞에서 본 대로 `javac`는 값이 아니라 타입을 본다. `byte`에 꼭 담아야 하면 `(byte) (x + y)`로 쓴다.

**크기가 다른 둘은 큰 쪽으로 맞춘다.** `int`와 `long`을 계산하면 `long`, `int`와 `double`을 계산하면 `double`이 된다[^s2].

```java
10 / 4              // 2    (int끼리라 몫만 남는다)
10 / 4.0            // 2.5  (10이 10.0으로 바뀐다)
(double) 10 / 4     // 2.5  (10을 먼저 바꾼 뒤 나눈다)
(double) (10 / 4)   // 2.0  (2를 구한 뒤 바꾼다)
```

**`+`는 두 가지 일을 한다.** 양쪽이 모두 수면 더한다. 한쪽이라도 문자열이면 다른 쪽을 문자열로 바꿔 이어 붙인다. `+`가 여럿이면 앞에서부터 차례로 한다[^8].

```java
int value = 3 + 7;            // 10
String str = "3" + 7;         // "37"
String str = 3 + "7";         // "37"

int value = 1 + 2 + 3;        // 6
String str = 1 + 2 + "3";     // "33"
String str = 1 + "2" + 3;     // "123"
String str = "1" + 2 + 3;     // "123"

String str = "1" + (2 + 3);   // "15"
```

`1 + 2 + "3"`은 앞에서부터 한다. 먼저 `1 + 2`는 둘 다 수라 3이다. 다음 `3 + "3"`은 한쪽이 문자열이라 `"33"`이다. `"1" + 2 + 3`은 `"1" + 2`가 먼저 `"12"`가 되고, 여기에 3이 붙어 `"123"`이다. 수끼리 먼저 더하려면 괄호로 묶는다.

## 문자열과 기본 타입 사이

문자열 `"10"`과 수 10은 다른 값이다. 괄호 변환 `(int) "10"`은 쓸 수 없고, 바꿔 주는 메서드를 부른다[^9].

| 바꾸는 방향 | 쓰는 법 |
|---|---|
| `String` → `byte` | `Byte.parseByte("10")` |
| `String` → `short` | `Short.parseShort("200")` |
| `String` → `int` | `Integer.parseInt("300000")` |
| `String` → `long` | `Long.parseLong("40000000000")` |
| `String` → `float` | `Float.parseFloat("12.345")` |
| `String` → `double` | `Double.parseDouble("12.345")` |
| `String` → `boolean` | `Boolean.parseBoolean("true")` |
| 기본 타입 → `String` | `String.valueOf(값)` |

수로 읽을 수 없는 글자를 주면 실행 중에 멈춘다. `Integer.parseInt("12a")`는 `NumberFormatException`을 낸다. `Byte.parseByte("200")`도 같다. 200이 `byte` 범위를 넘기 때문이다[^s2].

## 활용

- 키보드 입력은 늘 문자열이다. 나이를 받아 계산하려면 `Integer.parseInt(scanner.nextLine())`으로 바꾼다.
- 평균을 낼 때 `sum / count`가 `int`끼리면 소수점이 사라진다. `(double) sum / count`로 쓴다.
- 흔한 실수: `System.out.println("합: " + 1 + 2);`가 `합: 12`를 찍는다. `"합: " + (1 + 2)`로 쓴다.
- 흔한 실수: `(int)`가 반올림한다고 믿는다. 3.99도 3이 된다. 반올림은 `Math.round()`를 쓴다[^s2].

## 연결

- 선수: [변수와 기본 타입](/Hongs_Blog/studies/java/java-primitive-types/)
- 변환 없이 범위를 넘을 때: [연산자와 오버플로](/Hongs_Blog/studies/java/java-operators/)
- 아래 비트만 남기면 왜 음수가 되기도 하나: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- 클래스끼리의 변환: [참조 타입 변환과 instanceof](/Hongs_Blog/studies/java/java-casting/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 네 식의 결과를 쓰라. ① `"" + 1 + 2` ② `1 + 2 + "" + 1 + 2` ③ `'A' + 1 + "B"` ④ `"B" + 'A' + 1`</summary>

**답:** ① `"12"` ② `"312"` ③ `"66B"` ④ `"BA1"`<br>
**이유:** 앞에서부터 한다. ②는 `1 + 2 = 3`, 그 뒤로는 문자열이 끼어 계속 붙인다. ③은 `'A' + 1`이 수끼리의 덧셈이라 `char`가 `int` 65로 바뀌어 66이 된다. ④는 문자열에 `'A'`가 글자 그대로 붙는다. ③을 `"AB"`나 `"A1B"`로 쓰는 오답이 많다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `byte x = 10; byte y = 20; byte r = x + y;`는 왜 컴파일 오류인가? 30은 `byte`에 들어가는데도 그런 이유까지 쓰라.</summary>

**답:** `byte`는 계산에 들어갈 때 `int`로 바뀌므로 `x + y`의 타입이 `int`다. `int`를 `byte`에 넣는 것은 좁히는 변환이라 괄호가 필요하다. `javac`는 실제 값 30을 보지 않고 타입만 본다.<br>
**이유:** `x`와 `y`에는 실행 중 다른 값이 올 수 있다. 100 + 100이면 `byte`를 넘는다. 고치려면 `int r = x + y;` 또는 `byte r = (byte) (x + y);`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `(byte) 200`의 값을 구하라.</summary>

**답:** −56.<br>
**이유:** 200은 2진수 `1100 1000`으로 8비트에 그대로 들어간다. 그런데 `byte`에서 맨 앞 비트가 1이면 음수다. 8비트를 넘으면 256을 빼면 되므로 $$200 - 256 = -56$$이다. 같은 방법으로 `(byte) 128`은 −128, `(byte) 300`은 $$300 - 256 = 44$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 괄호 변환 없이 되는 것과 안 되는 것을 가르라. ① `long a = 5;` ② `int b = 5L;` ③ `double c = 5;` ④ `float d = 5.0;` ⑤ `int e = 'A';` ⑥ `char f = e;` (`e`는 `int` 변수)</summary>

**답:** 되는 것 ①, ③, ⑤. 안 되는 것 ②, ④, ⑥.<br>
**이유:** ① `int` → `long`, ③ `int` → `double`, ⑤ `char` → `int`는 넓히는 방향이다. ② `long` → `int`, ④ `double` → `float`(5.0은 `double`이다), ⑥ `int` → `char`는 좁히는 방향이다.

</details>


[^1]: 소프트웨어 프로젝트 2회 강의 자료 「Software Project 02. Java Language Basics (1)」, p.23 (두 가지 변환, 타입별 비트 수)
[^2]: 같은 자료, p.24 (자동 변환과 넓히는 방향 그림)
[^3]: 같은 자료, p.25~26 (ImplicitConversion 예제와 출력)
[^4]: 같은 자료, p.27 (강제 변환과 좁히는 방향 그림)
[^5]: 같은 자료, p.30~31 (ExplicitConversion 예제와 출력)
[^6]: 같은 자료, p.28~29 (int를 char에 넣는 예제, "Compile error!")
[^7]: 같은 자료, p.32 (연산 중 int로 바뀜)
[^8]: 같은 자료, p.33 (+의 두 가지 일)
[^9]: 같은 자료, p.34 (문자열 변환 표)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 원본 p.24와 p.27의 화살표 그림에는 `char`가 없다. `char` → `int`가 자동이라는 것은 Java Language Specification §5.1.2에 있고, 구현 코드에서 `'A' + 1 == 66`으로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 첫 예시, `long` → `float`가 자동인 이유와 16,777,217의 예, 잘린 값의 표와 `(byte) 300` 따라가기, 큰 쪽으로 맞추는 규칙과 나눗셈 네 줄, `NumberFormatException`, 활용 항목, 카드 C1~C4는 원본에 없다. 값은 모두 구현 코드로, 컴파일 오류 메시지는 JDK 21에서 직접 컴파일해 확인했다. 규칙은 Java Language Specification §5.1.3(좁히는 변환), §5.6(연산 중 변환)에 있다.
{% endraw %}
