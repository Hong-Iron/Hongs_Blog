---
layout: "note"
title: "배열"
display_title: "배열 (Array)"
kind: "concept"
kind_label: "정의"
num: "10"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
updated: "2026-10-11"
status: "verified"
aliases: ["Array", "배열", "인덱스", "Index", "배열 길이", "length", "다차원 배열", "Multidimensional Array", "2차원 배열", "배열 복사", "System.arraycopy", "Arrays.copyOf", "얕은 복사", "Shallow Copy", "향상된 for", "Enhanced for", "for-each", "ArrayIndexOutOfBoundsException", "String[] args"]
description: "배열은 같은 종류의 값을 번호 붙은 칸에 줄지어 넣어 둔 것이다. 아파트 한 동의 우편함처럼, 이름 하나와 번호만 있으면 어느 칸이든 바로 열 수 있다. 값이 백 개든 만 개든 변수 하나와 반복문으로 다룰 수 있다. 대신 칸 수는 만들 때 정해져 나중에 늘릴 수 없고, 번호는 0부…"
prev_url: "/studies/software-project/java-string/"
prev_title: "String"
next_url: "/studies/software-project/class-and-object/"
next_title: "클래스와 객체"
math: false
mermaid: false
code_count: 1
permalink: "/studies/software-project/java-array/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

배열은 같은 종류의 값을 번호 붙은 칸에 줄지어 넣어 둔 것이다. 아파트 한 동의 우편함처럼, 이름 하나와 번호만 있으면 어느 칸이든 바로 열 수 있다. 값이 백 개든 만 개든 변수 하나와 반복문으로 다룰 수 있다. 대신 칸 수는 만들 때 정해져 나중에 늘릴 수 없고, 번호는 0부터라 마지막 칸의 번호가 칸 수보다 1 작다. 없는 번호를 열면 프로그램이 멈춘다.

</div>


## 예시로 보기

학생 30명의 점수를 `score0`, `score1`, … 하고 변수 30개에 담으면 합을 낼 때 변수 이름을 30번 적어야 한다. 학생이 한 명 늘면 코드를 고쳐야 한다. 배열에 담으면 이름은 `score` 하나이고 번호만 바뀐다.

```
          score 배열
        +----+----+----+----+----+-----+----+
        | 83 | 90 | 87 | 93 | 78 | ... | 75 |
        +----+----+----+----+----+-----+----+
 인덱스    0    1    2    3    4   ...   29
```

배열은 값들을 메모리의 이어진 자리에 나란히 두고 값마다 번호를 붙인 것이다. 이 번호를 인덱스라 부른다. 대괄호 `[ ]` 안에 인덱스를 적어 그 칸의 값을 읽거나 넣는다[^1]. `score[0]`은 83이고, `score[1] = 95;`는 둘째 칸에 95를 넣는다. 30칸이면 번호는 0부터 29까지다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 값 목록과 `new`로 만들기, 타입별 기본값 표, 범위 밖 인덱스의 예외 메시지, 2차원 배열의 길이와 합 432, `new String[3]`의 `null`, 복사 방법 셋과 얕은 복사, 향상된 `for`의 합 436과 칸을 못 고치는 것, `java Sum 10 20`의 합 30, 카드 C1·C3 — [10_java-array_impl.java](/Hongs_Blog/studies/software-project/code/10_java-array_impl/)</div>

</div>


## 선언과 생성

### 변수 선언

배열 변수를 선언하는 모양은 둘이다[^2].

```java
int[] numbers1;    // 타입 뒤에 대괄호 (보통 이쪽을 쓴다)
int numbers2[];    // 변수 이름 뒤에 대괄호
```

배열은 [참조 타입](/Hongs_Blog/studies/software-project/java-reference-types/)이다. 배열 자체는 힙 영역에 만들어지고, 배열 변수에는 힙에 있는 배열의 주소가 들어간다. 가리킬 배열이 없으면 `null`로 둘 수 있다[^2]. 변수를 선언하는 것만으로는 배열이 생기지 않는다.

### 값 목록으로 만들기

넣을 값을 이미 알면 중괄호 안에 늘어놓는다[^3].

```java
int[] score = {83, 90, 87, 93, 78};
```

```
  스택               힙
  score [ 5번지 ] --> 5번지: [83][90][87][93][78]
                             [0] [1] [2] [3] [4]
```

선언과 값 넣기를 따로 할 때는 중괄호 앞에 `new 타입[]`을 붙인다. 타입은 배열 변수의 타입과 같아야 한다[^3].

```java
int[] score;
score = new int[] {83, 90, 87, 93, 78};   // 된다
score = {83, 90, 87, 93, 78};             // 컴파일 오류
```

### new로 만들기

값은 나중에 넣고 자리만 먼저 잡을 때는 `new 타입[길이]`를 쓴다. 이렇게 만든 배열의 칸은 기본값으로 저절로 채워진다[^4].

```java
int[] score = new int[30];   // 30칸, 모두 0
```

| 배열 타입 | 칸의 기본값 |
|---|---|
| `byte[]`, `short[]`, `int[]` | 0 |
| `long[]` | 0L |
| `char[]` | `'\u0000'` (0번 글자) |
| `float[]`, `double[]` | 0.0F, 0.0 |
| `boolean[]` | `false` |
| 클래스·인터페이스 타입 배열 (`String[]` 등) | `null` |

### 길이

배열의 칸 수는 `배열.length`로 읽는다. 괄호가 없다[^s1]. 길이가 `n`이면 인덱스는 0부터 `n - 1`까지다. 5칸 배열에서 `score[5]`를 읽으면 `ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`로 멈춘다. 한번 만든 배열의 길이는 바꿀 수 없다[^s1].

```java
for (int i = 0; i < score.length; i++) {   // i <= 가 아니라 i <
    sum += score[i];
}
```

## 다차원 배열

배열의 칸에 다시 배열이 들어 있는 것이 다차원 배열이다[^5]. 두 반의 점수를 담아 본다. 대괄호를 차원 수만큼 붙이고, 중괄호를 차원 수만큼 겹친다[^6].

```java
int[][] scores = {
    {80, 92, 96},    // 0번 반
    {76, 88}         // 1번 반
};
```

```
  스택                 힙
  scores [ 5번지 ] --> 5번지: [ 10번지 ][ 30번지 ]        <- 1차원: 반의 배열
                                  |         |
                                  v         v
                       10번지: [80][92][96]   30번지: [76][88]   <- 2차원: 점수 배열
```

표처럼 생겼지만 메모리에서는 표가 아니다. 바깥 배열의 칸마다 안쪽 배열의 주소가 들어 있다. 그래서 안쪽 배열끼리 길이가 달라도 된다[^6].

| 식 | 값 | 뜻 |
|---|---|---|
| `scores.length` | 2 | 반의 수 |
| `scores[0].length` | 3 | 0번 반의 학생 수 |
| `scores[1].length` | 2 | 1번 반의 학생 수 |
| `scores[0][2]` | 96 | 0번 반 2번 학생 |

`new`로 만들 때도 대괄호를 차원 수만큼 쓴다. `new int[2][3]`은 길이 3인 배열 둘을 만들고 모든 칸을 0으로 채운다[^7].

## 참조 타입 배열

기본 타입 배열은 칸에 값이 그대로 들어간다. 참조 타입 배열은 칸마다 객체의 주소가 들어간다[^8].

```java
String[] strArray = new String[3];   // 칸 셋, 모두 null
strArray[0] = "Java";
strArray[1] = "C++";
strArray[2] = "C#";
```

```
  스택 영역              힙 영역
  strArray [ 5번지 ] --> 5번지: [ 10번지 ][ 20번지 ][ 30번지 ]     <- String[] 배열
                                    |         |         |
                                    v         v         v
                                 "Java"     "C++"     "C#"         <- String 객체들
```

`new String[3]`은 문자열 셋을 만들지 않는다. 주소를 넣을 칸 셋만 만든다. 값을 넣기 전에 `strArray[0].length()`를 부르면 [NullPointerException](/Hongs_Blog/studies/software-project/java-reference-equality/)이다.

**main의 `String[] args`.** `main()` 메서드의 괄호 안에는 늘 `String[] args`가 있어야 한다. 프로그램을 실행할 때 클래스 이름 뒤에 적은 글자들이 문자열 배열로 묶여 이 변수에 들어온다[^9].

```
java Sum 10 20      ->   args = { "10", "20" }
```

`args[0]`은 수 10이 아니라 문자열 `"10"`이다. 더하려면 `Integer.parseInt(args[0])`으로 바꾼다([타입 변환](/Hongs_Blog/studies/software-project/java-type-conversion/)). 뒤에 아무것도 적지 않고 실행하면 `args`는 `null`이 아니라 길이 0인 배열이다[^s1].

## 복사와 향상된 for

**복사.** 배열 변수를 다른 변수에 넣으면 주소만 베껴진다. 배열은 여전히 하나다([참조 타입과 메모리 영역](/Hongs_Blog/studies/software-project/java-reference-types/)). 칸까지 따로 가진 배열이 필요하면 새 배열을 만들어 값을 옮긴다. 길이를 못 바꾸므로 더 큰 배열이 필요할 때도 이렇게 한다[^s2].

| 방법 | 코드 (`src`는 `{1, 2, 3}`) | 결과 |
|---|---|---|
| `for`로 한 칸씩 | `for (int i = 0; i < src.length; i++) c[i] = src[i];` (`c`는 `new int[5]`) | `[1, 2, 3, 0, 0]` |
| `System.arraycopy(원본, 원본 시작, 대상, 대상 시작, 개수)` | `System.arraycopy(src, 0, c, 1, 3);` | `[0, 1, 2, 3, 0]` |
| `Arrays.copyOf(원본, 새 길이)` | `int[] c = Arrays.copyOf(src, 5);` | `[1, 2, 3, 0, 0]` |

세 방법 모두 칸에 든 것을 베낀다. 참조 타입 배열이나 2차원 배열은 칸에 주소가 들어 있으므로 주소가 베껴진다. 바깥 배열은 둘이 되지만 안쪽 배열과 객체는 같이 쓴다(얕은 복사). `int[][] m2 = Arrays.copyOf(m, 2); m2[0][0] = 99;`를 하면 `m[0][0]`도 99다[^s2].

**향상된 for.** 인덱스 없이 배열의 칸을 처음부터 끝까지 하나씩 꺼낸다[^s2].

```java
int sum = 0;
for (int s : score) {    // score의 칸을 차례로 s에 베껴 넣는다
    sum += s;
}
```

`s`는 칸의 사본이다. 그래서 `s`를 고쳐도 배열은 바뀌지 않는다. 칸을 고치려면 인덱스로 도는 보통의 `for`를 쓴다.

```java
int[] twice = {1, 2, 3};
for (int v : twice) { v = v * 2; }                               // 그대로 [1, 2, 3]
for (int i = 0; i < twice.length; i++) { twice[i] *= 2; }        // [2, 4, 6]
```

## 활용

- 읽기만 하고 인덱스가 필요 없으면 향상된 `for`, 칸을 고치거나 인덱스를 써야 하면 보통의 `for`를 쓴다.
- 흔한 실수: `i <= arr.length`로 돈다. 마지막에 없는 칸을 열어 `ArrayIndexOutOfBoundsException`이다.
- 흔한 실수: 문자열의 길이는 `s.length()`(괄호 있음), 배열의 길이는 `arr.length`(괄호 없음)다. 섞어 쓰면 컴파일 오류다.
- 흔한 실수: 2차원 배열을 `Arrays.copyOf`로 복사하고 완전히 따로라고 믿는다. 안쪽 배열도 하나씩 복사해야 한다.
- 길이를 실행 중에 늘려야 하는 자료에는 배열 대신 `ArrayList` 같은 컬렉션을 쓴다[^s1].

## 연결

- 선수: [제어문](/Hongs_Blog/studies/software-project/java-control-flow/), [참조 타입과 메모리 영역](/Hongs_Blog/studies/software-project/java-reference-types/), [참조 비교와 null](/Hongs_Blog/studies/software-project/java-reference-equality/)
- 문자열 배열의 칸에 든 것, `split`이 돌려주는 배열: [String](/Hongs_Blog/studies/software-project/java-string/)
- 클래스로 만든 객체를 배열에 담기: [클래스와 객체](/Hongs_Blog/studies/software-project/class-and-object/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `int[][] t = new int[3][]; t[0] = new int[] {1}; t[1] = new int[] {1, 2};`를 실행한 뒤 `t.length`, `t[1].length`, `t[2]`의 값은? `t[2].length`를 읽으면 어떻게 되는가?</summary>

**답:** 3, 2, `null`. `t[2].length`는 `NullPointerException`.<br>
**이유:** `new int[3][]`은 주소 칸 셋짜리 바깥 배열만 만든다. 참조 타입 칸의 기본값은 `null`이다. 0번과 1번에만 안쪽 배열을 넣었으므로 2번은 `null`로 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `new String[3]`을 만든 직후 `strArray[0].length()`를 부르면 왜 예외가 나는가? `new int[3]`을 만든 직후 `arr[0] + 1`은 왜 괜찮은가?</summary>

**답:** `String[]`의 칸에는 주소가 들어가고 기본값이 `null`이다. 가리키는 문자열이 없는데 `.length()`를 물어 `NullPointerException`이다. `int[]`의 칸에는 값이 그대로 들어가고 기본값이 0이라 `0 + 1 = 1`이다.<br>
**이유:** 참조 타입 배열을 만드는 것은 칸을 만드는 것이지 객체를 만드는 것이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "향상된 `for`로 배열의 모든 칸을 두 배로 만들 수 있다"가 틀림을 코드로 보여라. 맞게 고친 코드도 쓰라.</summary>

**답:** `int[] a = {1, 2, 3}; for (int v : a) { v = v * 2; }` 뒤에 `a`는 `[1, 2, 3]` 그대로다. 고치면 `for (int i = 0; i < a.length; i++) { a[i] = a[i] * 2; }`이고 `a`는 `[2, 4, 6]`이 된다.<br>
**이유:** 향상된 `for`의 변수는 칸의 값을 베껴 받은 사본이다. 사본을 고쳐도 칸은 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `int[] src = {1, 2, 3};`의 내용을 따로 가진 배열을 만들려 한다. ① `int[] a = src;` ② `int[] b = Arrays.copyOf(src, 3);` ③ `int[] c = new int[3]; System.arraycopy(src, 0, c, 0, 3);` 가운데 맞는 것은? 틀린 것은 왜 틀렸는가?</summary>

**답:** ②와 ③.<br>
**이유:** ①은 주소만 베껴 `a`와 `src`가 같은 배열을 가리킨다. `a[0] = 100;`을 하면 `src[0]`도 100이다. ②와 ③은 새 배열을 만들고 값을 옮긴다.

</details>


[^1]: 소프트웨어 프로젝트 4회 강의 자료 「Software Project 04. Reference Types」, p.13 (배열의 뜻, score 배열 그림)
[^2]: 같은 자료, p.14 (배열 변수 선언 두 모양, 힙과 null)
[^3]: 같은 자료, p.15 (값 목록으로 만들기, new 타입[])
[^4]: 같은 자료, p.16 (new로 만들기, 기본값 표)
[^5]: 같은 자료, p.17 (다차원 배열 그림)
[^6]: 같은 자료, p.18 (값 목록으로 만든 2차원 배열, scores 그림)
[^7]: 같은 자료, p.19 (new로 만든 2차원 배열)
[^8]: 같은 자료, p.20 (배열 속 객체, strArray 그림)
[^9]: 같은 자료, p.21 (String[] args, java Sum 10 20)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `length`로 길이 읽기, 범위 밖 인덱스의 예외와 메시지, 길이를 못 바꾼다는 것, `score = {…}`의 컴파일 오류, 인자 없이 실행한 `args`, `ArrayList` 언급은 원본에 없다(원본은 p.19 그림에 "배열 길이: 3"이라고만 적는다). 예외 메시지와 값은 구현 코드로, 컴파일 오류는 JDK 21에서 직접 컴파일해 확인했다. Java Language Specification §10.3, §10.7에 있다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 배열 복사 세 방법, 얕은 복사, 향상된 `for`, 카드 C1~C4는 원본 4회 슬라이드에 없다. 값은 구현 코드로 확인했다. Java Language Specification §14.14.2(향상된 for), `System.arraycopy`와 `Arrays.copyOf`의 API 문서에 있다.
{% endraw %}
