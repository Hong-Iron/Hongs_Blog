---
layout: "note"
title: "String"
display_title: "String"
kind: "concept"
kind_label: "정의"
num: "09"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["String", "문자열", "문자열 리터럴", "String Literal", "문자열 풀", "String Pool", "String Constant Pool", "equals", "불변", "Immutable", "charAt", "length", "replace", "substring", "indexOf", "split", "intern"]
description: "글자를 줄줄이 이은 것을 문자열이라 한다. 자바는 코드에 똑같은 글귀를 여러 번 적어도 그것을 한 번만 만들어 두고 같이 쓴다. 메모리를 아끼는 장치다. 그런데 이 때문에 두 문자열이 같은지 주소로 견주면 어떤 때는 맞고 어떤 때는 틀린다. 직접 새로 만든 문자열이나 실행 중에 생…"
prev_url: "/studies/java/java-reference-equality/"
prev_title: "참조 비교와 null"
next_url: "/studies/java/java-array/"
next_title: "배열"
math: true
mermaid: false
code_count: 1
permalink: "/studies/java/java-string/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

글자를 줄줄이 이은 것을 문자열이라 한다. 자바는 코드에 똑같은 글귀를 여러 번 적어도 그것을 한 번만 만들어 두고 같이 쓴다. 메모리를 아끼는 장치다. 그런데 이 때문에 두 문자열이 같은지 주소로 견주면 어떤 때는 맞고 어떤 때는 틀린다. 직접 새로 만든 문자열이나 실행 중에 생긴 문자열은 글자가 같아도 다른 곳에 있기 때문이다. 글자가 같은지는 반드시 글자를 견주는 방법으로 물어야 한다.

</div>


## 예시로 보기

비밀번호를 입력받아 저장된 것과 같은지 본다고 하자. 눈으로는 둘 다 `KIA`인데 프로그램이 "다르다"고 답하면 곤란하다. 문자열 비교에서 실제로 이런 일이 생긴다.

```java
String car1 = "Hyundai";
String car2 = "KIA";
String car3 = "KIA";
System.out.println(car2 == car3);        // true

String n2 = new String("KIA");
String n3 = new String("KIA");
System.out.println(n2 == n3);            // false
System.out.println(n2.equals(n3));       // true
```

두 코드의 변수는 모두 `"KIA"`를 담고 있다. 그런데 `==`의 답이 다르다. 문자열은 `String` 객체로 만들어지는 [참조 타입](/Hongs_Blog/studies/java/java-reference-types/)이고, `==`는 [주소를 비교](/Hongs_Blog/studies/java/java-reference-equality/)하기 때문이다. 만드는 방법에 따라 객체가 놓이는 곳이 다르다.

```
 큰따옴표로 적었을 때                     new로 만들었을 때

 car1 [ 주소 ] ----> "Hyundai"            n1 [ 주소 ] ----> "Hyundai"
 car2 [ 주소 ] --+                        n2 [ 주소 ] ----> "KIA"
                 +-> "KIA"                n3 [ 주소 ] ----> "KIA"
 car3 [ 주소 ] --+
 (객체 둘)                                (객체 셋)
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력 셋, 리터럴·`new`·이어 붙인 문자열·입력받은 문자열의 `==`와 `equals`, "자바 프로그래밍"의 메서드 결과 전부, `replace` 뒤 원래 문자열이 그대로인 것, `split`의 네 조각, 카드 C1·C3 — [09_java-string_impl.java](/Hongs_Blog/studies/java/code/09_java-string_impl/)</div>

</div>


## 정의

### 만드는 두 방법

자바에서 문자열은 `String` 객체로 만들어진다. 만드는 방법은 둘이다.

| 방법 | 코드 | 객체 |
|---|---|---|
| 큰따옴표로 직접 적는다(리터럴) | `String s = "KIA";` | 글자가 같은 리터럴은 `String` 객체 하나를 같이 쓴다 |
| `new`로 만든다 | `String s = new String("KIA");` | 부를 때마다 새 객체가 생긴다 |

JVM은 리터럴로 만든 문자열을 한곳에 모아 둔다. 이 모음을 문자열 풀이라 부른다. 같은 글귀의 리터럴이 또 나오면 새로 만들지 않고 모아 둔 것의 주소를 준다[^s1]. `new`는 객체를 만드는 연산자라 풀에 같은 글귀가 있든 없든 힙에 새 객체를 만든다.

### 비교

| 묻는 것 | 쓰는 것 | `n2`와 `n3`(둘 다 `new String("KIA")`) |
|---|---|---|
| 같은 객체인가 | `a == b` | `false` |
| 글자가 같은가 | `a.equals(b)` | `true` |

문자열을 비교할 때는 `==`와 `!=` 대신 `equals()`를 쓴다. 다른지 볼 때는 앞에 `!`를 붙여 `!a.equals(b)`로 쓴다.

리터럴끼리는 `==`로도 `true`가 나온다. 그래서 `==`로 비교하는 코드가 연습할 때는 잘 돌다가, 실행 중에 만들어진 문자열을 만나면 틀린다. 실행 중에 만들어지는 문자열은 풀의 것이 아니다[^s1].

| 문자열이 온 곳 | `"KIA"` 리터럴과 `==` | `equals` |
|---|---|---|
| 다른 자리의 리터럴 `"KIA"` | `true` | `true` |
| `new String("KIA")` | `false` | `true` |
| 변수를 이어 붙인 것 (`k + "IA"`, `k`는 `"K"`) | `false` | `true` |
| 키보드로 입력받은 `KIA` | `false` | `true` |

`equals`는 네 경우 모두에서 맞다.

### 바뀌지 않는 객체

`String` 객체는 한 번 만들어지면 글자가 바뀌지 않는다. 글자를 바꾸는 것처럼 보이는 메서드는 모두 새 문자열을 만들어 돌려주고 원래 것은 그대로 둔다[^s2].

```java
String subject = "자바 프로그래밍";
String replaced = subject.replace("자바", "Java");
System.out.println(replaced);   // Java 프로그래밍
System.out.println(subject);    // 자바 프로그래밍
```

**왜 이렇게 만들었나.** 같은 리터럴을 여럿이 같이 쓰려면 누구도 그것을 고칠 수 없어야 한다. `car2`와 `car3`이 한 객체를 가리키는데 `car2`로 글자를 바꿀 수 있다면 `car3`도 저절로 바뀌어 버린다. 바뀌지 않으니 마음 놓고 같이 쓸 수 있다[^s2].

### 주요 메서드

`"자바 프로그래밍"`으로 본다. 글자마다 0부터 번호가 붙는다. 빈칸도 한 글자다.

```
 글자   자   바  (빈칸)  프   로   그   래   밍
 번호   0    1     2     3    4    5    6    7        모두 8글자
```

자주 쓰는 메서드는 다음과 같다.

| 하는 일 | 메서드 | 예 (`s`는 `"자바 프로그래밍"`) | 결과 |
|---|---|---|---|
| 한 글자 꺼내기 | `charAt(번호)` | `s.charAt(3)` | `'프'` |
| 길이 | `length()` | `s.length()` | 8 |
| 바꾸기 | `replace(옛것, 새것)` | `s.replace("자바", "Java")` | `"Java 프로그래밍"` (새 문자열) |
| 잘라내기 | `substring(시작)` | `s.substring(3)` | `"프로그래밍"` (시작 번호부터 끝까지) |
| | `substring(시작, 끝)` | `s.substring(0, 2)` | `"자바"` (끝 번호 앞까지) |
| 찾기 | `indexOf(찾을 것)` | `s.indexOf("프로그래밍")` | 3 (처음 나오는 자리의 번호) |
| 쪼개기 | `split(구분자)` | `"번호,제목,내용,글쓴이".split(",")` | 문자열 배열 |

- `substring(시작, 끝)`은 끝 번호의 글자를 넣지 않는다. `s.substring(3, 5)`는 3번과 4번 글자인 `"프로"`다. 글자 수는 끝에서 시작을 뺀 $$5 - 3 = 2$$다[^s2].
- `indexOf`는 찾는 것이 없으면 −1을 준다. `s.indexOf("파이썬")`은 −1이다[^s2].
- `split`은 구분자를 기준으로 문자열을 나눠 [배열](/Hongs_Blog/studies/java/java-array/)에 담아 준다.

```java
String board = "번호,제목,내용,글쓴이";
String[] arr = board.split(",");
// arr[0] = "번호", arr[1] = "제목", arr[2] = "내용", arr[3] = "글쓴이"
```


### 스스로 설명해 보기

각 줄의 결과가 어디서 나오는지 답한다[^s3].

```java
String a = "java";               // 1
String b = "java";               // 2
String c = new String("java");   // 3
String d = c;                    // 4
String e = a.toUpperCase();      // 5
```

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `a == b`는 왜 `true`인가</summary>

1번 줄과 2번 줄은 글자가 같은 리터럴이다. "글자가 같은 리터럴은 `String` 객체 하나를 같이 쓴다"에 따라 `b`는 `a`와 같은 주소를 받는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. `a == c`는 왜 `false`이고 `a.equals(c)`는 왜 `true`인가</summary>

3번 줄의 `new`는 풀과 상관없이 새 객체를 만든다. 주소가 달라 `==`는 `false`다. `equals`는 주소가 아니라 글자를 하나씩 견주므로 `true`다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `c == d`는 왜 `true`인가</summary>

4번 줄은 `c`의 칸에 든 주소를 `d`에 베낀다. 새 객체는 생기지 않는다. 이것은 문자열만의 규칙이 아니라 모든 참조 타입의 대입 규칙이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 5번 줄 뒤에 `a`는 `"JAVA"`인가</summary>

아니다. `"java"` 그대로다. `String` 객체는 바뀌지 않는다. `toUpperCase()`는 새 문자열 `"JAVA"`를 만들어 돌려주고 그것이 `e`에 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 추적의 핵심 생각은?</summary>

문자열 변수마다 "이 주소는 어디서 왔는가"를 묻는다. 리터럴에서 왔으면 풀의 것, `new`나 메서드 결과에서 왔으면 새 객체, 다른 변수에서 왔으면 그 변수와 같은 객체다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓸 수 있는 다른 상황은?</summary>

배열 `{"Java", "Java", new String("Java")}`의 칸끼리 `==`로 비교할 때. 0번과 1번 칸은 같은 객체, 2번 칸은 다른 객체다([배열](/Hongs_Blog/studies/java/java-array/)).

</details>


## 예제

**문장에서 단어 잘라내기.** `"hello world"`에서 `"world"`만 꺼낸다[^s3].

1. 자를 자리를 찾는다: `s.indexOf("w")`는 6이다.
2. 그 자리부터 끝까지 자른다: `s.substring(6)`은 `"world"`다.

한 줄로 쓰면 `s.substring(s.indexOf("w"))`다. 앞 단어는 빈칸 앞까지이므로 `s.substring(0, s.indexOf(" "))`가 `"hello"`다. 끝 번호를 넣지 않는 규칙 덕분에 빈칸의 번호를 그대로 끝 번호로 쓸 수 있다.

**경계 사례.** 번호는 0부터 `length() - 1`까지다. 8글자 문자열에 `charAt(8)`을 부르면 `StringIndexOutOfBoundsException`으로 멈춘다. `substring(8)`은 예외 없이 빈 문자열 `""`을 준다[^s2].

## 활용

- 문자열 비교는 늘 `equals()`로 한다. `null`일 수 있는 변수와 견줄 때는 `"KIA".equals(s)`처럼 리터럴을 앞에 둔다([참조 비교와 null](/Hongs_Blog/studies/java/java-reference-equality/)).
- 대소문자를 가리지 않으려면 `equalsIgnoreCase()`를 쓴다[^s2].
- 흔한 실수: `s.replace("a", "b");`만 쓰고 결과를 받지 않는다. `s`는 그대로다. `s = s.replace("a", "b");`로 다시 넣는다.
- 흔한 실수: `substring(3, 5)`가 세 글자(3, 4, 5번)를 준다고 믿는다. 끝 번호는 빠진다.
- `"2026-10-11".split("-")`처럼 날짜나 쉼표로 나뉜 줄을 조각낼 때 `split`을 쓴다. 조각은 문자열이므로 수로 쓰려면 [타입 변환](/Hongs_Blog/studies/java/java-type-conversion/)의 `Integer.parseInt`를 거친다.

## 연결

- 선수: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/), [참조 비교와 null](/Hongs_Blog/studies/java/java-reference-equality/)
- `split`이 돌려주는 것, 문자열 배열의 메모리 그림: [배열](/Hongs_Blog/studies/java/java-array/)
- 문자열에 수를 이어 붙일 때의 `+`: [타입 변환](/Hongs_Blog/studies/java/java-type-conversion/)
- `equals`는 같다와 다르다만 답한다. 두 문자열이 얼마나 비슷한지 재는 방법: [문자열 유사도](/Hongs_Blog/studies/data-and-information/string-similarity/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"문자열은 == 로 비교해도 된다. 해 보니 true가 나왔다"</div>

틀렸다. `==`는 두 변수가 같은 `String` 객체를 가리키는지 볼 뿐이다. 그럴듯해 보이는 것은 리터럴끼리 비교하면 정말로 `true`가 나오기 때문이다. 같은 리터럴은 객체 하나를 같이 쓰니까 주소도 같다. 하지만 키보드 입력, 파일에서 읽은 줄, 변수를 이어 붙인 결과처럼 실행 중에 생긴 문자열은 글자가 같아도 다른 객체다. 확인하는 법: `String k = "K"; String j = k + "IA"; System.out.println(j == "KIA");`는 `false`를 찍고 `j.equals("KIA")`는 `true`다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"replace나 toUpperCase를 부르면 그 문자열이 바뀐다"</div>

틀렸다. `String` 객체는 만들어진 뒤로 바뀌지 않는다. 메서드 이름이 "바꾼다"라서 원래 것이 바뀔 것 같지만, 이 메서드들은 바뀐 모습의 새 문자열을 만들어 돌려준다. 돌려받은 것을 변수에 넣지 않으면 아무 일도 일어나지 않는다. 확인하는 법: `String up = "java"; up.toUpperCase(); System.out.println(up);`은 `java`를 찍는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `String a = "java"; String b = "java"; String c = new String("java"); String d = c;`일 때 `a == b`, `a == c`, `a.equals(c)`, `c == d`의 값을 쓰라.</summary>

**답:** `true`, `false`, `true`, `true`.<br>
**이유:** `a`와 `b`는 같은 리터럴이라 객체 하나를 같이 쓴다. `c`는 `new`로 만든 새 객체다. `equals`는 글자를 본다. `d`는 `c`의 주소를 베꼈다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 문자열을 `==`로 비교하는 코드가 어떤 때는 맞고 어떤 때는 틀리는 까닭을 설명하라.</summary>

**답:** `==`는 주소를 비교한다. 글자가 같은 리터럴은 풀에서 객체 하나를 같이 쓰므로 주소가 같아 `true`다. `new`로 만들었거나 실행 중에 만들어진(입력, 이어 붙이기) 문자열은 글자가 같아도 다른 객체라 `false`다.<br>
**이유:** 그래서 글자가 같은지는 `equals()`로 묻는다. 어디서 온 문자열이든 `equals`는 글자를 견준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `String s = "hello world";`에서 ① `s.substring(s.indexOf("w"))` ② `s.substring(0, s.indexOf(" "))` ③ `s.replace("l", "L")` ④ 3번을 실행한 뒤 `s.length()`의 값을 쓰라.</summary>

**답:** ① `"world"` ② `"hello"` ③ `"heLLo worLd"` ④ 11.<br>
**이유:** `indexOf("w")`는 6, `indexOf(" ")`는 5다. `substring(0, 5)`는 0 ~ 4번 글자다. `replace`는 나오는 `l`을 모두 바꾼 새 문자열을 준다. `s`는 그대로라 길이도 11 그대로다(빈칸 포함).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 다음 가운데 `String s`의 내용이 실제로 달라지는 줄은? ① `s.trim();` ② `s = s.trim();` ③ `s.replace("a", "b");` ④ `s += "!";`</summary>

**답:** ②와 ④.<br>
**이유:** 정확히는 어느 줄도 `String` 객체를 고치지 않는다. ②와 ④는 새 문자열을 만들어 `s`가 그것을 가리키게 한다. ①과 ③은 새 문자열을 만들고도 받지 않아 버려진다. `s += "!"`는 `s = s + "!"`다.

</details>


[^s1]: 출력은 구현 코드로 확인했다. Java Language Specification §3.10.5와 `String.intern()` 문서에 있다.
[^s2]: 값은 구현 코드로 확인했다.
[^s3]: 값은 구현 코드로 확인했다.
{% endraw %}
