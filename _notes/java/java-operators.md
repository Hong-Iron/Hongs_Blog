---
layout: "note"
title: "연산자와 오버플로"
display_title: "연산자와 오버플로 (Operators and Overflow)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Operator", "연산자", "부호 연산자", "증감 연산자", "Increment", "Decrement", "산술 연산자", "Arithmetic Operator", "오버플로", "Overflow", "언더플로", "Underflow", "NaN", "Infinity", "ArithmeticException", "비교 연산자", "Comparison Operator", "논리 연산자", "Logical Operator", "대입 연산자", "Assignment Operator", "삼항 연산자", "Ternary Operator", "연산자 우선순위", "Operator Precedence"]
description: "자동차 주행 거리계가 999999에서 1킬로미터를 더 가면 000000으로 돌아간다. 자바의 정수도 칸이 정해져 있어서, 가장 큰 값에 1을 더하면 오류 없이 가장 작은 값으로 돌아간다. 더하기·비교·대입 같은 연산 기호는 수학과 거의 같게 읽히지만, 이렇게 수학과 어긋나는 곳이 …"
prev_url: "/studies/java/java-type-conversion/"
prev_title: "타입 변환"
next_url: "/studies/java/java-bitwise/"
next_title: "비트 연산"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "04_java-operators_impl.java", "u": "/studies/java/code/04_java-operators_impl/", "r": "구현"}]
permalink: "/studies/java/java-operators/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자동차 주행 거리계가 999999에서 1킬로미터를 더 가면 000000으로 돌아간다. 자바의 정수도 칸이 정해져 있어서, 가장 큰 값에 1을 더하면 오류 없이 가장 작은 값으로 돌아간다. 더하기·비교·대입 같은 연산 기호는 수학과 거의 같게 읽히지만, 이렇게 수학과 어긋나는 곳이 몇 군데 있다. 정수끼리 나누면 소수점이 사라지고, 소수 계산은 끝자리가 조금 틀리며, 0으로 나누면 정수는 프로그램이 멈추고 실수는 멈추지 않은 채 이상한 값이 된다.

</div>


## 예시로 보기

수학에서는 127 + 1 = 128이다. 자바의 `byte`는 −128부터 127까지만 담는다. 그러면 127에 1을 더할 때 어떻게 될까?

```java
byte b = 127;
b++;
System.out.println(b);   // -128
```

오류도 경고도 없이 −128이 된다. `byte`의 값들은 양 끝이 이어진 고리처럼 돈다.

```
        +1로 넘으면(오버플로) 맨 왼쪽으로
   +---------------------------------------------+
   v                                             |
 -128 <-> -127 <-> ... <-> 0 <-> ... <-> 126 <-> 127
   |                                             ^
   +---------------------------------------------+
        -1로 넘으면(언더플로) 맨 오른쪽으로
```

타입이 담을 수 있는 가장 큰 값을 넘는 것을 오버플로, 가장 작은 값 아래로 내려가는 것을 언더플로라 부른다. `int`도 같다. `2147483647 + 1`은 `-2147483648`이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 이 문서의 모든 식의 값(증감, 나눗셈과 나머지, 오버플로, `0.29999999999999993`, 0으로 나누기 표, 건너뛰는 `&&`, 복합 대입, 삼항, 우선순위), 카드 C1~C4 — [04_java-operators_impl.java](/Hongs_Blog/studies/java/code/04_java-operators_impl/)</div>

</div>


## 연산자 한눈에

연산 기호를 연산자, 연산에 쓰이는 값을 피연산자라 부른다. `x + 1`에서 `+`가 연산자, `x`와 `1`이 피연산자다.

### 부호와 증감

| 식 | 뜻 |
|---|---|
| `+x` | 부호를 그대로 둔다 |
| `-x` | 부호를 바꾼다 |
| `++x` | `x`를 1 올리고, 올린 값을 쓴다 |
| `--x` | `x`를 1 내리고, 내린 값을 쓴다 |
| `x++` | 지금 값을 먼저 쓰고, 그 뒤에 1 올린다 |
| `x--` | 지금 값을 먼저 쓰고, 그 뒤에 1 내린다 |

`++`가 앞에 붙느냐 뒤에 붙느냐는 다른 계산과 섞일 때만 차이가 난다.

```java
int a = 10;
int b = a++ + ++a;   // b = 22, a = 12
```

| 순서 | 한 일 | 식에 들어간 값 | `a` |
|---|---|---|---|
| 1 | `a++`: 10을 쓰고 올린다 | 10 | 11 |
| 2 | `++a`: 올리고 쓴다 | 12 | 12 |
| 3 | 10 + 12 | 22 | 12 |

### 산술

더하기 `+`, 빼기 `-`, 곱하기 `*`, 나누기 `/`, 나머지 `%`의 다섯이다. 수학과 다른 곳은 나눗셈이다[^s1].

| 식 | 값 | 까닭 |
|---|---|---|
| `7 / 2` | 3 | 정수끼리 나누면 몫만 남는다 |
| `7 % 2` | 1 | 나머지 |
| `7 / 2.0` | 3.5 | 한쪽이 실수면 실수로 계산한다 |
| `-7 / 2` | −3 | 0 쪽으로 버린다 |
| `-7 % 2` | −1 | 나머지의 부호는 나뉘는 수를 따른다 |

### 정확한 계산

사과 1개를 0.1개짜리 조각 7개만큼 덜어 내면 0.3개가 남아야 한다.

```java
int apple = 1;
double pieceUnit = 0.1;
int number = 7;
double result = apple - number * pieceUnit;
System.out.println("사과 1개에서 남은 양: " + result);   // 0.29999999999999993
```

0.1은 2진수로 딱 떨어지지 않는다. 10진수에서 1/3이 0.333…으로 끝나지 않는 것과 같다. `double`은 가장 가까운 값을 대신 적고, 그 작은 차이가 계산에 묻어 나온다([부동소수점](/Hongs_Blog/studies/data-and-information/floating-point/)). 정확해야 하는 계산은 정수로 바꿔서 한다. 사과를 조각 10개로 세면 `10 - 7 = 3`조각이고, 마지막에 한 번만 10으로 나누면 0.3이다[^s1].

### 0으로 나누기

왼쪽이 정수이고 오른쪽이 정수 0이면 프로그램이 `ArithmeticException`을 내며 멈춘다. 한쪽이라도 실수면 멈추지 않고 결과가 무한대(`Infinity`)나 수가 아님(`NaN`, Not a Number)이 된다.

| 식 | 결과 |
|---|---|
| `5 / 0` | `ArithmeticException: / by zero` |
| `5 % 0` | `ArithmeticException` |
| `5 / 0.0` | `Infinity` |
| `-5 / 0.0` | `-Infinity` |
| `5 % 0.0` | `NaN` |
| `0.0 / 0.0` | `NaN` |

멈추지 않는 쪽이 더 위험하다. 이 값은 뒤의 계산을 모두 물들인다. `Infinity + 2`는 `Infinity`, `NaN + 2`는 `NaN`이다. 그래서 `/`나 `%`를 한 뒤 결과를 확인하고 다음 계산으로 간다.

```java
double z = x / y;
if (Double.isInfinite(z) || Double.isNaN(z)) {
    System.out.println("값을 계산할 수 없다");
} else {
    System.out.println(z + 2);
}
```

`z == Double.NaN`으로 확인하면 안 된다. `NaN`은 자기 자신과 비교해도 같지 않다. `NaN == NaN`은 `false`다[^s1].

### 비교

같은지(`==`, `!=`)와 크기(`<`, `<=`, `>`, `>=`)를 따져 `boolean` 값 `true`나 `false`를 낸다. 조건문과 반복문의 조건에 주로 쓴다.

| 식 | 뜻 |
|---|---|
| `a == b` | 두 값이 같은가 |
| `a != b` | 두 값이 다른가 |
| `a > b`, `a >= b` | 크다, 크거나 같다 |
| `a < b`, `a <= b` | 작다, 작거나 같다 |

문자열을 비교할 때는 `==` 대신 `equals()`를 쓴다. 이유는 [String](/Hongs_Blog/studies/java/java-string/)에 있다. 실수도 `==`로 비교하면 어긋난다. `0.1 == 0.1f`는 `false`다. `float`의 0.1과 `double`의 0.1은 서로 다른 근삿값이다[^s1].

### 논리

`boolean` 값끼리 계산한다.

| 연산 | 기호 | `true`가 되는 때 |
|---|---|---|
| 그리고(AND) | `&&` 또는 `&` | 둘 다 `true` |
| 또는(OR) | `\|\|` 또는 `\|` | 하나라도 `true` |
| 둘 중 하나만(XOR) | `^` | 하나는 `true`, 하나는 `false` |
| 아니다(NOT) | `!` | 원래 값이 `false` |

`&&`와 `&`는 답이 같다. 다른 점은 뒤쪽을 계산하느냐다. `&&`는 앞이 `false`면 답이 이미 `false`로 정해졌으므로 뒤를 아예 계산하지 않는다. `&`는 늘 둘 다 계산한다. <code>&#124;&#124;</code>와 <code>&#124;</code>도 같다[^s1].

```java
int n = 0;
boolean ok = (n != 0) && (10 / n > 1);   // false. 10 / n은 계산하지 않는다
boolean ng = (n != 0) &  (10 / n > 1);   // ArithmeticException
```

### 대입

`=`는 오른쪽 값을 왼쪽 변수에 넣는다. "같다"가 아니다. 오른쪽에는 리터럴, 변수, 다른 식이 올 수 있다.

| 종류 | 식 | 같은 뜻 |
|---|---|---|
| 단순 대입 | `x = 5` | |
| 복합 대입 | `x += 5` | `x = x + 5` |
| | `x -= 5`, `x *= 5`, `x /= 5`, `x %= 5` | `x = x - 5` 등 |
| | `x &= 5`, `x \|= 5`, `x ^= 5` | `x = x & 5` 등 |
| | `x <<= 2`, `x >>= 2`, `x >>>= 2` | `x = x << 2` 등 |

복합 대입에는 강제 변환이 숨어 있다. `byte b = 10;`일 때 `b = b + 5;`는 컴파일 오류지만 `b += 5;`는 된다. `b = (byte) (b + 5);`와 같기 때문이다[^s1]. 편하지만 넘쳐도 알려 주지 않는다. `b`가 15일 때 `b += 120;`을 하면 −121이 된다.

### 삼항

피연산자가 셋이다. `?` 앞의 조건이 `true`면 `:` 앞의 값을, `false`면 `:` 뒤의 값을 고른다.

```
조건식 ? 참일 때의 값 : 거짓일 때의 값
```

```java
int score = 85;
char grade = (score > 90) ? 'A' : ((score > 80) ? 'B' : 'C');   // 'B'
```

## 계산 순서

한 식에 연산자가 여럿이면 순위가 높은 것부터 한다. 곱셈과 나눗셈이 덧셈과 뺄셈보다 먼저이고, `>`와 `<` 같은 비교가 `&&`보다 먼저다. 순위가 같으면 대부분 왼쪽부터 한다.

| 순위 | 연산자 | 순위가 같을 때 |
|---|---|---|
| 높음 | 증감 `++` `--`, 부호 `+` `-`, 비트 `~`, 논리 `!` | 오른쪽부터 |
| | 산술 `*` `/` `%` | 왼쪽부터 |
| | 산술 `+` `-` | 왼쪽부터 |
| | 시프트 `<<` `>>` `>>>` | 왼쪽부터 |
| | 비교 `<` `>` `<=` `>=` `instanceof` | 왼쪽부터 |
| | 비교 `==` `!=` | 왼쪽부터 |
| | 논리 `&` | 왼쪽부터 |
| | 논리 `^` | 왼쪽부터 |
| | 논리 `\|` | 왼쪽부터 |
| | 논리 `&&` | 왼쪽부터 |
| | 논리 `\|\|` | 왼쪽부터 |
| | 조건 `? :` | 오른쪽부터 |
| 낮음 | 대입 `=` `+=` `-=` 등 | 오른쪽부터 |

```java
1 + 2 * 3           // 7   곱셈 먼저
10 - 3 - 2          // 5   같은 순위는 왼쪽부터: (10 - 3) - 2
a = b = 5           // 대입은 오른쪽부터: a = (b = 5)
x > 0 && y < 0      // (x > 0) && (y < 0)
true || false && false   // true   &&가 먼저: true || (false && false)
a ? b : c ? d : e   // 삼항은 오른쪽부터: a ? b : (c ? d : e)
```

삼항을 왼쪽부터 묶는다고 보면 답이 달라질 수 있다. `a`, `c`, `d`, `e`가 `true`이고 `b`가 `false`일 때 오른쪽부터 묶으면 `false`이고, 왼쪽부터 묶은 `(a ? b : c) ? d : e`는 `true`다. 자바는 `false`를 낸다[^s1].

순서가 헷갈리면 괄호를 친다. 괄호 안이 늘 먼저다.


## 활용

- 넘치면 안 되는 계산은 처음부터 `long`으로 한다. `1000000 * 1000000`은 `int`끼리라 −727,379,968이 되고, `1000000L * 1000000`은 1,000,000,000,000이다[^s1].
- 넘칠 때 멈추게 하고 싶으면 `Math.addExact(a, b)`를 쓴다. 넘치면 `ArithmeticException`을 낸다[^s1].
- 돈 계산처럼 틀리면 안 되는 소수 계산은 가장 작은 단위(원, 센트)의 정수로 한다.
- 흔한 실수: 조건에 `==` 대신 `=`를 쓴다. `if (x = 5)`는 `int`를 조건 자리에 둔 것이라 자바에서는 컴파일 오류다[^s1].
- 흔한 실수: 평균을 `sum / count`로 내어 소수점을 잃는다.

## 연결

- 선수: [변수와 기본 타입](/Hongs_Blog/studies/java/java-primitive-types/), [타입 변환](/Hongs_Blog/studies/java/java-type-conversion/)
- 비트 단위 연산자(`&`, <code>&#124;</code>, `^`, `~`, 시프트): [비트 연산](/Hongs_Blog/studies/java/java-bitwise/)
- 비교와 논리 연산자가 쓰이는 곳: [제어문](/Hongs_Blog/studies/java/java-control-flow/)
- 127 다음이 −128인 이유: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- 0.1이 딱 떨어지지 않는 이유, `NaN`과 `Infinity`의 비트 모양: [부동소수점](/Hongs_Blog/studies/data-and-information/floating-point/)
- AND, OR, XOR, NOT의 진리표: [명제와 논리 연산](/Hongs_Blog/studies/discrete-math/propositional-logic/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"정수가 범위를 넘으면 오류가 나서 알 수 있다"</div>

아니다. 자바의 정수 계산은 범위를 넘어도 멈추지 않고 반대쪽 끝에서 이어진 값을 낸다. 0으로 나누면 프로그램이 멈추니까 넘칠 때도 멈출 것 같지만, 정수에서 멈추는 경우는 0으로 나눌 때뿐이다. `Integer.MAX_VALUE + 1`은 −2,147,483,648이고 프로그램은 그대로 계속 돈다. 확인하는 법: `System.out.println(Integer.MAX_VALUE + 1);`을 돌려 본다. 넘칠 때 멈추게 하려면 `Math.addExact`처럼 확인해 주는 메서드를 따로 불러야 한다[^s1].

</div>


## 과목별 관점

**어셈블리어 (2-1학기).** 자바에서 `byte` 127에 1을 더하면 아무 표시 없이 −128이 된다. 같은 덧셈을 CPU 명령으로 쓰면 `mov al,7Fh` 다음에 `add al,1`이고, 8비트 레지스터 AL은 80h(−128)가 된다. 결과는 자바와 같다. 다른 점은 CPU가 덧셈을 할 때마다 1비트짜리 표시(플래그) 둘을 함께 남긴다는 것이다.

- **올림 플래그(CF).** 같은 비트를 부호 없는 수로 볼 때 결과가 범위를 벗어났으면 1이 된다.
- **넘침 플래그(OF).** 부호 있는 수로 볼 때 결과가 범위를 벗어났으면 1이 된다. 127 + 1에서는 OF가 1이다.

CPU는 그 비트를 프로그래머가 부호 있는 수로 쓰는지 없는 수로 쓰는지 구별하지 못해 두 표시를 늘 다 남긴다. 그러니 "넘쳤다"는 사실은 기계에 남아 있다. 자바 언어가 그 표시를 프로그램에 보여 주지 않을 뿐이다. 위의 `Math.addExact`는 넘쳤는지를 대신 확인해 예외로 알려 준다[^as1]. 두 플래그가 정해지는 규칙은 [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)에, 어느 쪽을 읽어야 하는지는 [올림 플래그와 넘침 플래그 비교](/Hongs_Blog/studies/assembly-language/carry-vs-overflow-flag/)에 있다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `int c = 3; int r = c++ * 2 + --c;`를 실행한 뒤 `r`과 `c`의 값은?</summary>

**답:** `r = 9`, `c = 3`.<br>
**이유:** `c++`는 3을 쓰고 `c`를 4로 올린다. `3 * 2 = 6`. `--c`는 `c`를 3으로 내리고 3을 쓴다. `6 + 3 = 9`. `c++`에서 4를 쓴다고 보면 11이라는 오답이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 넷 가운데 프로그램이 멈추는 것은? 멈추지 않는 것은 결과를 쓰라. ① `5 / 0` ② `5 / 0.0` ③ `5 % 0.0` ④ `0 / 5`</summary>

**답:** ①만 멈춘다(`ArithmeticException`). ② `Infinity` ③ `NaN` ④ 0.<br>
**이유:** 정수를 정수 0으로 나눌 때만 예외다. 한쪽이 실수면 `Infinity`나 `NaN`이 된다. ④는 0을 나누는 것이라 문제없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `1 - 7 * 0.1`이 0.3이 아니라 `0.29999999999999993`인 이유를 쓰고, 0.3을 정확히 얻는 방법을 쓰라.</summary>

**답:** 0.1은 2진수로 끝없이 이어져 `double`에 근삿값으로 들어간다. 그 오차가 곱셈과 뺄셈을 거쳐 드러난다. 정수로 바꿔 계산한다. 사과 1개를 10조각으로 세어 `(10 - 7) / 10.0`을 하면 0.3이다.<br>
**이유:** 정수 계산에는 오차가 없다. 나눗셈을 마지막에 한 번만 하면 오차가 쌓일 틈이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `int w = 2;`일 때 `-w * w + 10 % 3 << 1`의 값을 구하라. 괄호를 쳐서 계산 순서를 보여라.</summary>

**답:** −6. `(((-w) * w) + (10 % 3)) << 1`.<br>
**이유:** 부호 `-`가 가장 먼저라 `-2`. 다음 `*`와 `%`: `-2 * 2 = -4`, `10 % 3 = 1`. 다음 `+`: −3. 시프트가 가장 늦다. `-3 << 1 = -6`. 시프트를 덧셈보다 먼저 하면 −2라는 오답이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** `byte b = 127; b++;`와 같은 계산을 CPU 명령 `mov al,7Fh` / `add al,1`로 했다. 올림 플래그(CF)와 넘침 플래그(OF)는 각각 얼마인가? AL에 FFh를 넣고 1을 더하면 두 플래그는 어떻게 되는가? 자바의 `byte` 계산이 넘쳤는지를 말해 주는 쪽은 어느 플래그인가?</summary>

**답:** 7Fh + 1: CF = 0, OF = 1. FFh + 1: CF = 1, OF = 0. `byte`의 넘침을 말해 주는 쪽은 OF다.<br>
**이유:** `byte`는 부호 있는 수다. 127 + 1 = 128은 −128~127 밖이라 OF가 켜진다. FFh는 `byte`로 −1이고 −1 + 1 = 0은 범위 안이라 OF가 꺼져 있다. 이때 켜지는 CF는 FFh를 255로 읽었을 때의 판정이라 `byte` 계산과는 상관없다[^as1].

</details>


[^s1]: 값은 모두 구현 코드로 확인했다. 규칙은 Java Language Specification §15.17(나눗셈과 나머지), §15.23(`&&`), §15.26.2(복합 대입), §15.25(삼항은 오른쪽부터 묶임)에 있다. 실수에서는 같은 말이 0에 너무 가까워 적지 못하는 경우를 가리키기도 한다.
[^as1]: 플래그 값은 [19_x86-status-flags_verify.py](/Hongs_Blog/studies/assembly-language/code/19_x86-status-flags_verify/)의 파이썬 흉내로 확인했다. 실제 CPU로 돌린 결과가 아니다.
{% endraw %}
