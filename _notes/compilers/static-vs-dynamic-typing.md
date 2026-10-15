---
layout: "note"
title: "정적 타입과 동적 타입 비교"
display_title: "정적 타입과 동적 타입 비교"
kind: "concept"
kind_label: "비교"
num: "34"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Static vs Dynamic Typing", "Statically-typed Language", "Dynamically-typed Language", "정적 타입 언어", "동적 타입 언어", "정적 타이핑", "동적 타이핑"]
description: "둘 다 타입이 맞는지 검사한다. 가르는 질문은 \"타입이 어디에 붙어 있고, 언제 검사하는가\"다. 정적 타입 언어는 타입이 변수에 붙고 프로그램을 돌리기 전에 검사한다. 동적 타입 언어는 타입이 값에 붙고 돌리는 도중에 검사한다."
prev_url: "/studies/compilers/type-system/"
prev_title: "타입과 타입 시스템"
next_url: "/studies/compilers/type-inference-rules/"
next_title: "타입 추론 규칙"
math: false
mermaid: false
code_count: 1
permalink: "/studies/compilers/static-vs-dynamic-typing/"
---
{% raw %}
둘 다 타입이 맞는지 검사한다. 가르는 질문은 "타입이 어디에 붙어 있고, 언제 검사하는가"다. 정적 타입 언어는 타입이 변수에 붙고 프로그램을 돌리기 전에 검사한다. 동적 타입 언어는 타입이 값에 붙고 돌리는 도중에 검사한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `a = 3; a = "ok";` 두 줄을 (가) C·Java·Go 같은 언어에 `int a = 3; a = "ok";`로 적었을 때와 (나) 파이썬·자바스크립트에 그대로 적었을 때 각각 어떻게 되는가? 왜 다른가?</summary>

**답:** (가)는 컴파일할 때 둘째 줄에서 타입 오류가 난다. a는 int로 선언된 변수라 문자열을 넣을 수 없다. (나)는 그대로 돈다. 처음에는 a가 정수 3을 가리키고, 다음에는 문자열 "ok"를 가리킨다.<br>
**이유:** (가)에서는 타입이 변수 a에 붙어 있어 한 번 정하면 바뀌지 않는다. (나)에서는 타입이 값 3과 값 "ok"에 붙어 있고, 변수는 그때그때 값을 가리킬 뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (가) 수만 줄짜리 서버 프로그램에서 타입이 안 맞는 줄을 배포 전에 모두 찾고 싶다. (나) 자료 분석 아이디어를 한 시간 안에 짧은 코드로 시험해 보고 싶다. 두 방식의 장점으로 보면 각각 어느 쪽이 유리한가?</summary>

**답:** (가)는 정적 타입. 규칙이 엄격해서 타입과 얽힌 버그를 이해하고 찾기 쉽고, 실행 성능도 좋다. (나)는 동적 타입. 더 유연하고 시제품을 빨리 만들 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 함수 안에 `1 + "a"`처럼 타입이 안 맞는 줄이 있는데, 그 줄은 `flag`가 참일 때만 지나간다. 동적 타입 언어에서 `flag`를 거짓으로 주고 부르면 어떻게 되는가? 정적 타입 언어의 컴파일러는 어떻게 하는가?</summary>

**답:** 동적 타입 언어에서는 오류 없이 돈다. 검사는 그 연산에 닿았을 때 하므로, 지나가지 않은 줄은 검사하지 않는다. `flag`를 참으로 주는 날에야 오류가 난다. 정적 타입 언어의 컴파일러는 실행 경로와 상관없이 모든 줄을 보므로 컴파일할 때 그 줄을 잡는다.<br>
**이유:** 이것이 "타입과 얽힌 버그를 찾기 쉽다"는 장점의 실제 모습이다. 파이썬으로 돌려 확인했다.

</details>


## 결정적 차이

| | 정적 타입 언어 | 동적 타입 언어 |
|---|---|---|
| 타입이 붙는 곳 | 변수. 컴파일할 때 정해져 있다 | 실행 중의 값 |
| 검사하는 때 | 컴파일할 때(실행 전) | 실행하는 도중, 그때그때 |
| 예 | C, C++, Java, Go | 파이썬, 자바스크립트 |
| `a = 3; a = "ok";` | 타입 오류 | 그대로 돈다 |
| 장점 | 실행 성능이 더 좋다. 규칙이 엄격해 타입과 얽힌 버그를 이해하고 찾기 쉽다 | 더 유연하다. 시제품을 빨리 만든다 |

선택을 가르는 줄은 "검사하는 때"다. 미리 검사하면 실행 중에 타입을 볼 필요가 없어 빠르고, 오류를 일찍 안다. 나중에 검사하면 타입을 적지 않아도 되어 코드가 짧고 고치기 쉽다[^s2].

정적 타입 언어에서 타입이 쓰이는 흐름은 이렇다.

1. 프로그래머가 모든 이름의 타입을 `int`, `float`, `bool`, `char` 같은 키워드로 선언한다.
2. 컴파일러가 각 식의 타입을 그 식을 이루는 부분들의 타입에서 끌어낸다.
3. 컴파일러가 그 타입이 그 자리에서 바라는 타입과 맞는지 확인한다.

2번과 3번을 하는 도구가 [타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/)이다. 이 문서 모음의 타입 검사는 정적 타입 언어를 전제로 한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 파이썬에서 `a = 3; a = "ok"`가 도는 것, 지나가지 않는 줄의 타입 오류는 나지 않고 지나가면 `TypeError`가 나는 것, 선언을 미리 보는 작은 검사기가 둘째 줄을 잡는 것 — [34_static-vs-dynamic-typing_verify.py](/Hongs_Blog/studies/compilers/code/34_static-vs-dynamic-typing_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "타입을 모두 손으로 선언하고 컴파일할 때 검사한다"와 "선언 없이 실행 중에 검사한다" 사이에 있는 방식 두 가지를 들라.</summary>

**답:** ① 타입을 적지 않아도 컴파일러가 초깃값에서 타입을 알아내는 정적 타입 언어. Go의 `x := 3`, C++의 `auto x = 3;`, Java의 `var x = 3;`은 x를 int로 정하고, 그 뒤 `x = "ok"`는 컴파일 오류다. ② 동적 타입 언어에 타입 표시를 덧붙여 실행 전에 따로 검사하는 방식. 파이썬의 타입 힌트(`a: int = 3`)는 실행할 때는 검사하지 않고 mypy 같은 도구가 미리 본다. 타입스크립트는 자바스크립트에 정적 타입을 얹은 언어다[^s3].<br>
**이유:** 그래서 "선언을 손으로 적는가"와 "언제 검사하는가"는 서로 다른 질문이다. 정적·동적을 가르는 것은 뒤쪽이다.

</details>


[^s2]: Aho 외, *Compilers: Principles, Techniques, and Tools* 2판 1.6.1절(정적·동적 구분)과 6.5절(타입 검사)을 따랐다.
[^s3]: Go 언어 공식 규격 문서(The Go Programming Language Specification)의 짧은 변수 선언, C++11의 `auto`, Java 10의 `var`(JEP 286), 파이썬 PEP 484(타입 힌트는 실행 시 강제되지 않는다), 타입스크립트 공식 안내서를 근거로 했다.
{% endraw %}
