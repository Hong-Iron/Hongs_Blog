---
layout: "note"
title: "타입과 타입 시스템"
display_title: "타입과 타입 시스템 (Type System)"
kind: "concept"
kind_label: "정의"
num: "33"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Type", "Data Type", "Type System", "Type Checking", "타입", "자료형", "타입 시스템", "타입 검사", "타입 오류", "Type Error"]
description: "상자에 \"깨지는 물건\", \"냉장 보관\" 같은 꼬리표를 붙여 두면 택배 기사가 내용물을 열어 보지 않고도 어떻게 다룰지 안다. 프로그램의 값에 붙이는 이런 꼬리표가 타입이고, 어떤 식에 어떤 꼬리표가 붙는지 정해 둔 규칙 묶음이 타입 시스템이다. 컴파일러는 이 규칙으로 \"참·거짓 자…"
prev_url: "/studies/compilers/symbol-table-scope-checking/"
prev_title: "심벌 테이블과 스코프 검사"
next_url: "/studies/compilers/static-vs-dynamic-typing/"
next_title: "정적 타입과 동적 타입 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/type-system/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

상자에 "깨지는 물건", "냉장 보관" 같은 꼬리표를 붙여 두면 택배 기사가 내용물을 열어 보지 않고도 어떻게 다룰지 안다. 프로그램의 값에 붙이는 이런 꼬리표가 타입이고, 어떤 식에 어떤 꼬리표가 붙는지 정해 둔 규칙 묶음이 타입 시스템이다. 컴파일러는 이 규칙으로 "참·거짓 자리에 숫자를 넣었다" 같은 실수를 프로그램을 돌리기 전에 잡는다. 다만 기계어로 내려가면 꼬리표가 사라지므로 그 전 단계에서 검사해야 하고, 무엇을 실수로 볼지는 언어마다 다르다.

</div>


## 예시로 보기

타입을 보지 않으면 무엇이 곤란한지는 기계어 쪽에서 보면 드러난다. 어셈블리 명령 `add $r1, $r2, $r3`은 레지스터 두 개에 든 비트를 더해 세 번째 레지스터에 넣는다[^1].

- `int a = 0; int b = 1; int c = a + b;`에서 나온 덧셈이면 세 레지스터가 모두 정수라 맞는 연산이다.
- `int* a = malloc(…); float b = 3.5; int c = a + b;`에서 나온 덧셈이면 한쪽은 메모리 주소, 한쪽은 실수다. 이 덧셈은 허용되지 않는다.

그런데 두 경우의 어셈블리 명령은 똑같다. 레지스터에는 비트만 있고 "이 비트는 주소다", "이 비트는 실수다"라는 표시가 없다. 그래서 어셈블리 단계에서는 둘을 가릴 수 없고, 변수의 타입이 아직 남아 있는 [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/) 단계에서 검사한다[^1].

실수 3.5를 32비트로 적으면 `0x40600000`이다. 이 비트를 정수로 읽으면 1,080,033,280이다. 여기에 정수 덧셈으로 1을 더하면 `0x40600001`이 되고, 다시 실수로 읽으면 4.5가 아니라 3.5보다 아주 조금 큰 수다[^s1]. 덧셈 명령은 시킨 대로 비트를 더했을 뿐이다. 잘못은 그 덧셈을 시킨 쪽에 있고, 그것을 미리 막는 것이 타입 검사다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 3.5의 비트 `0x40600000`, 정수 덧셈 뒤 `0x40600001`이 4.5가 아님, `int a[32]`가 int 32칸 — [33_type-system_verify.py](/Hongs_Blog/studies/compilers/code/33_type-system_verify/)</div>

</div>


## 세 가지 말

**타입(type, data type).** 자료에 붙은 속성이다. 프로그래머가 그 자료를 어떻게 쓰려는지 컴파일러에 알려 준다[^2]. C의 선언으로 보면 이렇다.

| 선언 | 알려 주는 것 |
|---|---|
| `int a;` | a는 정수다 |
| `char a;` | a는 글자 하나다 |
| `int a[32];` | a는 정수 32칸짜리 배열이다 |
| `char* a;` | a는 글자가 있는 곳의 주소다 |
| `bool a;` | a는 참 또는 거짓이다 |

**타입 시스템(type system).** 프로그램의 여러 구성 요소에 타입을 붙여 주는 규칙의 모음이다[^3]. 슬라이드가 드는 규칙의 예는 셋이다.

- `a && b`: a와 b는 둘 다 참·거짓(불) 값이어야 하고, 결과도 불 값이다.
- `char a = b;`: b는 글자여야 한다.
- `a = 3.0f;`: a는 float이나 double이어야 한다.

**타입 검사(type checking).** 연산자가 바라는 타입과 실제 피연산자의 타입이 맞는지 확인하는 일이다[^4]. 피연산자는 연산자가 계산에 쓰는 값이다. `a + b`에서는 a와 b다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.7이 "(e.g., in C)"라고 하면서 `a && b`의 a, b가 불 값이어야 하고 결과도 불 타입이라고 적었다. / 문제점: 실제 C에서 `&&`의 피연산자는 정수·실수·포인터면 되고, 결과의 타입은 int(값은 0 또는 1)다. / 수정안: 이 규칙은 실제 C의 규칙이 아니라, 이 강의가 쓰는 단순한 언어의 규칙으로 읽는다. / 근거: C11 표준 6.5.13절(논리 AND 연산자: 피연산자는 스칼라 타입, 결과는 int). 시험에서는 슬라이드 규칙(둘 다 bool → bool)을 따른다.

</div>


## 타입 오류가 나는 코드

슬라이드는 타입 오류가 여러 군데 숨은 코드를 보여 준다[^5].

```c
while (foo(x + 5) <= 10) {
    if (1.0 + 2.0) {

    } else if (1 == null) {

    }
}
```

이 강의의 규칙([타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/))으로 읽으면 이렇다[^s2].

- `if (1.0 + 2.0)`: 조건 자리에는 bool이 와야 하는데 `1.0 + 2.0`은 double이다.
- `1 == null`: 비교하는 두 쪽의 타입이 같아야 하는데 한쪽은 int, 한쪽은 null이다.
- `foo(x + 5) <= 10`: foo가 int를 받아 int를 돌려주는 함수로 선언되어 있고 x가 int일 때만 맞다. 선언을 봐야 알 수 있다.

## 자동 타입 변환은 이 규칙들에 없다

1회 강의의 그림에서는 의미 분석기가 `A = B + C`의 C 위에 `inttofloat` 노드를 끼워 넣는다[^6]. 정수 C를 실수로 바꿔서 더하라는 뜻이다. 실제 컴파일러는 이렇게 타입이 다른 값을 알아서 맞춰 주기도 한다.

10회 강의의 규칙에는 이런 변환이 없다. 덧셈 규칙은 양쪽 타입이 같을 때만 쓸 수 있어서, `int + double`은 맞는 규칙이 없어 타입 오류다[^s3]. 시험 문제에서 타입이 섞인 식이 나오면, 문제가 변환 규칙을 따로 주지 않는 한 오류로 판정한다.

## 활용

- 타입 검사는 [의미 분석](/Hongs_Blog/studies/compilers/semantic-analysis/)이 확인하는 다섯 규칙 중 넷째(변수를 맞는 타입의 값과 함께 쓴다)와 다섯째(함수를 맞는 개수와 타입의 인자로 부른다)를 맡는다. 앞의 셋은 [스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/)가 맡는다[^7].
- 검사 방법: [타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/)으로 식의 타입을 정하고, [타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/)대로 트리를 돈다.
- 흔한 실수: "타입이 맞다"를 "값이 맞다"와 섞는다. 타입 검사는 `int c = a / b;`의 타입만 보고, b가 0인지는 보지 않는다[^s3].

## 연결

- 선수: [의미 분석](/Hongs_Blog/studies/compilers/semantic-analysis/), [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)
- 검사를 언제 하느냐: [정적 타입과 동적 타입 비교](/Hongs_Blog/studies/compilers/static-vs-dynamic-typing/)
- Java의 타입과 변환 규칙: [변수와 기본 타입](/Hongs_Blog/studies/java/java-primitive-types/), [타입 변환](/Hongs_Blog/studies/java/java-type-conversion/). Java는 int를 double로 알아서 넓혀 준다. 위의 `inttofloat`과 같은 일이다.
- 어셈블리에서는 타입 대신 크기만 정한다: [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 타입, 타입 시스템, 타입 검사를 각각 한 문장으로 쓰라.</summary>

**답:** 타입은 프로그래머가 자료를 어떻게 쓰려는지 컴파일러에 알려 주는 자료의 속성이다. 타입 시스템은 프로그램의 구성 요소에 타입을 붙여 주는 규칙의 모음이다. 타입 검사는 피연산자의 타입이 연산자가 바라는 타입과 맞는지 확인하는 일이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 타입 검사를 어셈블리 코드가 아니라 추상 구문 트리에서 하는 이유를 `add $r1, $r2, $r3`으로 설명하라.</summary>

**답:** 정수끼리 더하는 코드와 포인터에 실수를 더하는 코드가 똑같은 `add` 명령이 된다. 레지스터에는 비트만 있고 그 비트가 정수인지 주소인지 실수인지 적혀 있지 않다. 그래서 어셈블리 단계에서는 맞는 덧셈과 틀린 덧셈을 가릴 수 없다. 변수의 타입이 남아 있는 더 높은 단계의 표현에서 검사해야 한다.<br>
**이유:** 흔한 오답은 "어셈블리가 읽기 어려워서"다. 읽기 어려운 것이 아니라 가릴 정보가 사라진 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 이 강의의 규칙으로 볼 때 타입 오류인 것을 모두 고르라. (가) `if (1.0 + 2.0) { }` (나) `int c = a + b;` (a, b는 int) (다) `double s = d + n;` (d는 double, n은 int) (라) `int q = a / b;` (a는 int, b는 값이 0인 int)</summary>

**답:** (가)와 (다). (가)는 조건 자리에 double이 왔다. (다)는 덧셈의 양쪽 타입이 달라 맞는 규칙이 없다. 자동 변환은 이 강의의 규칙에 없다.<br>
**이유:** (라)는 타입으로는 맞다. 0으로 나누는 것은 값의 문제라 타입 검사가 잡지 못한다.

</details>


[^1]: 컴파일러 10회 강의 자료 「Lecture10 Semantic analysis part 2」, p.10 (add $$r1, $$r2, $r3의 타입, 어셈블리 단계에서는 가릴 수 없다)
[^2]: 같은 자료, p.6 (타입의 뜻과 C의 예 다섯 개)
[^3]: 같은 자료, p.7 (타입 시스템의 뜻과 규칙 예 세 개)
[^4]: 같은 자료, p.8 (타입 검사의 뜻)
[^5]: 같은 자료, p.9 (타입 오류가 숨은 코드)
[^6]: 컴파일러 1회 강의 자료 「Lecture01 Compilers overview」, p.13 (의미 분석기가 inttofloat 노드를 넣는 그림)
[^7]: 컴파일러 10회 강의 자료 「Lecture10 Semantic analysis part 2」, p.3~5 (다섯 규칙과 스코프 검사·타입 검사의 몫)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 3.5의 비트와 정수 덧셈 결과는 원본에 없다. 슬라이드 p.10의 "두 연산의 어셈블리 구현이 같다"를 수로 보이려고 넣었고, IEEE 754 단정밀도 표현을 검증 코드로 확인했다. 상자 꼬리표 비유도 원본에 없다. 실제 타입은 꼬리표와 달리 실행 파일 안에 따로 남지 않는다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드는 코드만 보여 주고 어디가 왜 틀렸는지 적지 않았다. 같은 강의 p.17~18, p.22, p.25의 규칙을 대어 읽었고, `if (1.0 + 2.0)`은 [36_type-checking-procedure_impl.py](/Hongs_Blog/studies/compilers/code/36_type-checking-procedure_impl/)로 확인했다. if의 조건이 bool이어야 한다는 규칙은 while 규칙(p.25)에 맞춰 보탠 것이다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 1회 그림과 10회 규칙의 차이, `int + double`이 오류라는 판정, 0으로 나누기 예는 원본에 없다. 10회 p.17의 덧셈 규칙이 양쪽에 같은 타입 T를 요구하는 것에서 끌어냈고, [36_type-checking-procedure_impl.py](/Hongs_Blog/studies/compilers/code/36_type-checking-procedure_impl/)로 확인했다.
{% endraw %}
