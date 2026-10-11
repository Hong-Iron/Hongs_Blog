---
layout: "note"
title: "스코프"
display_title: "스코프 (Scope)"
kind: "concept"
kind_label: "정의"
num: "31"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Scope", "유효 범위", "식별자의 스코프", "정적 스코프", "Static Scope", "Lexical Scope", "동적 스코프", "Dynamic Scope", "가장 가까운 안쪽 스코프 규칙", "Most-Closely Nested Scope Rule"]
description: "학교에 \"민수\"가 여럿 있어도 교실 안에서 \"민수야\" 하면 그 반 민수가 돌아본다. 프로그램의 이름도 그렇다. 이름마다 통하는 구역이 있고, 같은 이름이 여러 구역에 있으면 쓰는 자리에서 가장 가까이 감싼 구역의 것이 뽑힌다. 덕분에 서로 다른 함수가 같은 이름을 마음 놓고 쓴다.…"
prev_url: "/studies/compilers/semantic-analysis/"
prev_title: "의미 분석"
next_url: "/studies/compilers/symbol-table-scope-checking/"
next_title: "심벌 테이블과 스코프 검사"
math: false
mermaid: false
code_count: 1
permalink: "/studies/compilers/identifier-scope/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

학교에 "민수"가 여럿 있어도 교실 안에서 "민수야" 하면 그 반 민수가 돌아본다. 프로그램의 이름도 그렇다. 이름마다 통하는 구역이 있고, 같은 이름이 여러 구역에 있으면 쓰는 자리에서 가장 가까이 감싼 구역의 것이 뽑힌다. 덕분에 서로 다른 함수가 같은 이름을 마음 놓고 쓴다. 대신 안쪽에서 같은 이름을 다시 지으면 바깥 것이 가려져 안 보인다. 대부분의 언어는 구역을 코드에 적힌 모양(중괄호)으로 정하고, 변수는 선언한 줄보다 뒤에서만 쓸 수 있다.

</div>


## 예시로 보기

이름이 프로그램 전체에서 하나뿐이어야 한다면 큰 프로그램을 짤 수 없다. 함수마다 `i`나 `tmp`를 쓰려면 서로 겹치지 않게 이름을 짓느라 일이 안 된다. 이름이 통하는 구역을 나누면 이 문제가 없어진다.

슬라이드의 코드다[^1].

```c
int a = 2;                 // 전역 선언

int foo() {
    printf("%d\n", a);     // 2
    int a = 3;             // 지역 선언
    printf("%d\n", a);     // 3
    return 0;
}
```

첫 `printf`가 있는 줄에서는 함수 안에 `a`가 아직 선언되지 않았다. 바깥(전역)의 `a`가 뽑혀 2가 찍힌다. `int a = 3;` 뒤로는 함수 안에 `a`가 있으니 그것이 뽑혀 3이 찍힌다. 같은 이름 `a`가 줄에 따라 다른 것을 가리킨다.

안쪽 블록에서도 같다[^2].

```c
int foo() {
    int a = 2;        // 바깥 a: 함수 끝까지 통한다
    {
        int a = 3;    // 안쪽 a: 이 블록 끝까지만 통한다
    }
    ...               // 여기서 a는 다시 바깥 a (2)
}
```

안쪽 블록의 `a`는 그 블록 안에서 바깥 `a`를 가린다. 블록을 나오면 바깥 `a`가 다시 보인다.

## 정의

이름(식별자)의 스코프는 프로그램 가운데 그 이름을 쓸 수 있는 부분이다[^2].

- 스코프는 이름의 선언과 쓰임을 짝지어 준다.
- 같은 이름이 스코프가 다르면 다른 것을 가리킬 수 있다.

**이름을 새로 만드는 선언.** 대부분의 언어에서 스코프는 다음 선언으로 정해진다[^3].

| 선언 | 예 | 생기는 이름 |
|---|---|---|
| 함수 선언 | `int funcName(…)` | `funcName` |
| 클래스 선언 | `class className {…}` | `className` |
| 변수 선언 | `int varName` | `varName` |
| 매개변수 | `int func(int formal1, int formal2)` | `formal1`, `formal2` |

**스코프를 정하는 두 방식**[^4].

| | 정적 스코프 | 동적 스코프 |
|---|---|---|
| 무엇이 정하나 | 프로그램 글의 모양(`{}`, `()` 등) | 프로그램이 실행되는 흐름 |
| 쓰는 언어 | 대부분의 언어 | Lisp, SNOBOL |
| 이름을 찾는 곳 | 그 줄을 감싼 블록들 | 그 함수를 부른 쪽, 또 그 부른 쪽 |

동적 스코프에서는 가장 최근에 선언된 이름이 쓰인다[^4]. 두 방식이 갈리는 예는 이렇다[^s1].

```c
int a = 2;
void show() { print(a); }
void foo()  { int a = 3; show(); }
foo();
```

정적 스코프에서는 `show` 안의 `a`를 `show`를 감싼 글에서 찾는다. `show` 안에 없으니 전역의 `a`, 2다. 동적 스코프에서는 `show`를 부른 `foo`에서 찾는다. `foo`가 방금 선언한 `a`, 3이다. 정적 스코프는 코드만 읽어도 어느 선언인지 알 수 있어서 컴파일러가 실행 전에 검사할 수 있다.

### 가장 가까운 안쪽 스코프 규칙

이름은 그 이름을 선언한 스코프 가운데, 쓰는 자리를 가장 가까이 감싼 것의 선언과 짝지어진다. 그리고 이름은 쓰기 전에 선언되어 있어야 한다[^1].

찾는 순서로 말하면 이렇다. 쓰는 자리가 든 블록에서 그 줄보다 앞선 선언을 찾는다. 없으면 한 겹 바깥 블록에서 찾는다. 맨 바깥(전역)까지 가도 없으면 오류다.

**"쓰기 전에 선언"의 예외 둘.**

- 함수: 클래스 안에서 `bar()`가 아래쪽에 정의된 `foo()`를 불러도 된다. 부르는 줄이 선언보다 앞에 있는데도 통한다[^5].
- 객체 지향 언어: 자식 클래스의 함수가 부모 클래스에 선언된 `foo()`를 부를 수 있다. 자기 클래스 안에 선언이 없어도 물려받은 이름을 쓴다[^6].

두 예외를 검사하는 방법은 [심벌 테이블과 스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/)에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 첫 코드의 출력 2, 3, 안쪽 블록 예에서 블록 안은 3이고 블록 밖은 2, 정적 스코프와 동적 스코프가 갈리는 예의 답 2와 3, 슬라이드 p.14의 예(`foo() { int a = 3; }`, `int a = 2; foo(); print(a);`)는 두 방식 모두 2 — [31_identifier-scope_verify.py](/Hongs_Blog/studies/compilers/code/31_identifier-scope_verify/)</div>

</div>


## 연결

- 선수: [의미 분석](/Hongs_Blog/studies/compilers/semantic-analysis/)
- 컴파일러가 이 규칙을 검사하는 법: [심벌 테이블과 스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/)
- 스코프는 "이름이 어디서 보이는가"이고, 그 변수가 실행 중 메모리 어디에 얼마 동안 있는가는 다른 물음이다: [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/), [지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/)
- 물려받은 이름: [상속](/Hongs_Blog/studies/java/java-inheritance/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 스코프의 뜻과 가장 가까운 안쪽 스코프 규칙을 말하라.</summary>

**답:** 스코프는 프로그램에서 그 이름을 쓸 수 있는 부분이다. 이름을 쓰면 그 자리를 가장 가까이 감싼 스코프의 선언과 짝지어지고, 그 선언은 쓰는 자리보다 앞에 있어야 한다.<br>
**이유:** "가장 가까이"만 말하고 "쓰기 전에 선언"을 빼면 반쪽이다. 같은 블록에 선언이 있어도 그 줄보다 뒤에 있으면 바깥 것이 뽑힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드가 찍는 값을 차례로 쓰라. `int a = 1; void f() { print(a); { int a = 2; print(a); { print(a); int a = 3; print(a); } print(a); } print(a); }`</summary>

**답:** 1, 2, 2, 3, 2, 1.<br>
**이유:** 셋째 `print`는 가장 안쪽 블록에 있지만 그 블록의 `a`가 아직 선언되지 않아 한 겹 바깥의 2가 뽑힌다. 블록을 하나 나올 때마다 가려졌던 바깥 `a`가 다시 보인다. 흔한 오답은 셋째를 3으로 쓰는 것이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `int a = 2; void show() { print(a); } void foo() { int a = 3; show(); }`에서 `foo()`를 부르면 정적 스코프와 동적 스코프에서 각각 무엇이 찍히는가?</summary>

**답:** 정적 스코프 2, 동적 스코프 3.<br>
**이유:** 정적 스코프는 `show`가 적힌 자리를 감싼 글에서 `a`를 찾으니 전역의 2다. 동적 스코프는 `show`를 부른 `foo`에서 찾으니 3이다.

</details>


[^1]: 컴파일러 9회 강의 자료 「Lecture09 Semantic analysis part 1」, p.16 (가장 가까운 안쪽 스코프 규칙, 전역 선언과 지역 선언의 예, 출력 2와 3)
[^2]: 같은 자료, p.13 (스코프의 정의, 블록 안에서 다시 선언한 `a`의 그림)
[^3]: 같은 자료, p.15 (스코프를 정하는 네 가지 선언)
[^4]: 같은 자료, p.14 (정적 스코프와 동적 스코프)
[^5]: 같은 자료, p.17 (예외: 선언보다 먼저 부르는 함수. `class Test` 안의 `bar()`와 `foo()`)
[^6]: 같은 자료, p.18 (예외: 물려받은 함수 부르기. `class Test : public Parent`)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 두 방식이 갈리는 `show`/`foo` 예와 카드 C2·C3은 원본에 없다. 슬라이드 p.14의 예(`void foo() { int a = 3; }` … `int a = 2; foo(); print(a);`)는 출력을 적지 않았고, 작은 해석기로 돌리면 두 방식 모두 2가 나와 차이를 보여 주지 못한다. 그래서 `foo`가 다른 함수를 부르는 예로 바꿨다. C2의 답도 같은 해석기 방식으로 확인했다. 근거: Aho·Lam·Sethi·Ullman, *Compilers* 2판, 1.6.3 "Static Scope and Block Structure", 1.6.5 "Dynamic Scope".
{% endraw %}
