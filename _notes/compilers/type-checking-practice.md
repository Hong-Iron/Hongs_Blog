---
layout: "note"
title: "타입 검사 연습"
display_title: "타입 검사 연습"
kind: "practice"
kind_label: "연습"
num: "36"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 타입 추론 규칙(식의 타입), 타입 검사 절차(문장의 WF 규칙과 도는 순서)."
prev_url: "/studies/compilers/slr-parse-trace-practice/"
prev_title: "SLR 파서 추적 연습"
next_url: "/studies/compilers/tac-translation-practice/"
next_title: "3주소 코드 변환 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/type-checking-practice/"
---
{% raw %}
사용 개념: [타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/)(식의 타입), [타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/)(문장의 WF 규칙과 도는 순서).

네 문제 모두 같은 스코프 $$S$$를 쓴다. $$S$$에는 다음이 선언되어 있다[^s1].

```c
int[] arr;  int i;  int n;  bool flag;  double d;
double f(int, bool);
```

규칙은 강의의 것만 쓴다. 양쪽 타입이 다른 덧셈과 비교는 맞는 규칙이 없어 오류다(자동 변환 없음).

## 문제 1 · 식의 타입 구하기

`f(arr[i + 1], flag)`의 타입을 구하고, 규칙을 쓰는 순서를 쓰라.

**풀이 전략.** 식을 트리로 그리고 잎부터 올라간다. 노드 하나에 규칙 하나다. 맨 바깥이 함수 호출이니, 인자 두 개의 타입을 먼저 구해 f의 선언 `(int, bool) → double`과 맞춰 본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *잎.* `arr`은 변수 규칙으로 `int[]`. `i`는 변수 규칙으로 int. `1`은 상수 규칙으로 int.
2. *덧셈.* `i + 1`은 양쪽이 int라 int.
3. *배열.* `arr[i + 1]`은 $$e_1$$이 `int[]`, $$e_2$$가 int라 int.
4. *잎.* `flag`는 변수 규칙으로 bool.
5. *함수 호출.* 인자의 타입이 차례로 (int, bool)이고 f의 선언과 개수와 타입이 모두 맞는다. 결과는 double.

타입은 double이고 규칙은 7번 쓴다(`arr`, `i`, `1`, `+`, `[]`, `flag`, `f`).

</details>


**변형.** `f(arr[i + 1], flag) + d`의 타입은? `f(arr, flag)`는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

앞의 것은 양쪽이 double이라 덧셈 규칙으로 double. 뒤의 것은 첫 인자가 `int[]`인데 f는 int를 바라므로 함수 호출 규칙의 가정이 깨져 타입 오류다.

</details>


## 문제 2 · 타입 오류 찾기

다음 다섯 식 가운데 타입 오류인 것을 모두 고르고, 어느 규칙의 어느 가정이 깨지는지 쓰라.

(가) `i + 1 == n` (나) `d + i` (다) `flag && (i <= d)` (라) `arr[flag]` (마) `f(i, flag, n)`

**풀이 전략.** 식마다 맨 안쪽 부분식부터 타입을 붙여 올라가다가, 처음으로 규칙을 못 쓰는 노드에서 멈춘다. 오류는 그 노드의 것이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

- (가) 맞다. `i + 1`은 int, `n`은 int. 비교 규칙으로 bool.
- (나) 오류. 덧셈 규칙은 양쪽이 같은 $$T$$여야 하는데 double과 int다.
- (다) 오류. `i <= d`에서 비교 규칙의 $$T$$가 int와 double로 갈린다. `&&`까지 가기 전에 안쪽에서 깨진다.
- (라) 오류. 배열 규칙은 $$e_2$$가 int여야 하는데 `flag`는 bool이다.
- (마) 오류. f는 인자 둘을 받는데 셋을 넘겼다. 함수 호출 규칙의 "$$1 \le i \le n$$인 모든 $$e_i$$가 $$T_i$$"에서 개수 $$n$$이 맞지 않는다.

</details>


**변형.** (다)를 한 글자만 고쳐 맞는 식으로 만들라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`flag && (i <= n)`. `i <= n`이 bool이 되고, `&&`의 양쪽이 bool이라 전체가 bool이다.

</details>


## 문제 3 · 문장 검사의 순서

다음 문장을 검사할 때 트리의 노드에 타입이나 WF가 붙는 순서를 쓰고, 모두 몇 번 붙는지 세라.

```c
while (i <= n) {
    d = f(i, flag);
    i = i + 1;
}
```

**풀이 전략.** 문장마다 "부분식 → 자식 문장 → 전체" 순서다. while은 조건이 부분식이고 블록 안의 두 대입문이 자식 문장이다. 대입문 하나 안에서도 왼쪽 변수, 오른쪽 식, 그다음 대입 전체 순서다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *while의 부분식.* `i`(int) → `n`(int) → `<=`(bool) → 조건(bool).
2. *첫 자식 문장.* `d`(double) → `i`(int) → `flag`(bool) → `f(…)`(double) → `=`(WF: 왼쪽이 변수이고 양쪽이 double).
3. *둘째 자식 문장.* `i`(int) → `i`(int) → `1`(int) → `+`(int) → `=`(WF).
4. *블록.* 두 문장이 모두 WF라 블록이 WF.
5. *전체.* 조건이 bool이고 안쪽이 WF라 while이 WF.

모두 16번 붙는다. WF는 4번(`=` 둘, 블록, while)이다.

</details>


**변형.** 첫 문장을 `i = f(i, flag);`로 바꾸면 어디에서 무엇이 깨지는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

그 대입문에서 깨진다. 왼쪽 `i`는 int, 오른쪽 `f(…)`는 double이라 대입 규칙의 "양쪽이 같은 타입 $$T$$"가 채워지지 않는다. 자식 문장이 WF가 아니므로 블록도 while도 WF가 아니다.

</details>


## 문제 4 · return과 if-else

다음 함수가 의미에 맞게 짜였는지 판정하라. 쓰는 스코프를 모두 밝혀라.

```c
int abs(int x) {
    if (x >= 0) { return x; }
    else { return 0 - x; }
}
```

**풀이 전략.** return 규칙은 "지금 스코프가 어떤 타입을 돌려주는 함수 안인가"를 가정으로 쓴다. 블록이 겹쳐 있어도 그 함수의 반환 타입은 안쪽 스코프까지 따라간다. if-else 규칙은 조건과 두 블록을 따로 본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

스코프는 넷이다. 전역, 함수 안쪽(x : int가 있다), if 블록 안쪽, else 블록 안쪽. 뒤의 셋은 모두 "int를 돌려주는 함수 안"이다.

1. *조건.* `x`(int), `0`(int), `x >= 0`은 bool.
2. *if 블록.* `return x;`에서 x는 int이고 함수가 int를 돌려주므로 WF. 블록도 WF.
3. *else 블록.* `0`(int), `x`(int), `0 - x`는 int. `return 0 - x;`가 WF. 블록도 WF.
4. *if-else 전체.* 조건이 bool이고 두 블록이 각자 스코프에서 WF라 WF.
5. *함수.* 몸통이 WF다. 의미에 맞게 짜였다.

</details>


**변형.** (a) 반환 타입을 `bool`로 바꾸면? (b) else 쪽만 `return x >= 0;`으로 바꾸면? (c) 조건을 `if (x)`로 바꾸면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 두 return 모두 int를 돌려주는데 함수는 bool을 돌려주므로 return 규칙이 둘 다 깨진다. (b) else 쪽 return이 bool을 돌려줘 그 한 문장이 깨지고, 그래서 else 블록, if-else, 함수가 모두 WF가 아니다. (c) 조건이 int라 if-else 규칙의 첫 가정 "조건이 bool"이 깨진다. 두 블록은 멀쩡해도 전체는 WF가 아니다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제와 변형의 타입, 순서, 횟수, 오류 판정 — [36_type-checking-practice_p4.py](/Hongs_Blog/studies/compilers/code/36_type-checking-practice_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 답은 원본에 없다. 슬라이드 p.17~18, p.21~22(식의 규칙), p.24~25(WF 규칙), p.27(도는 순서)의 규칙만 써서 만들었다. `-`의 규칙은 `+`와 같은 꼴로, if-else의 WF 규칙은 while 규칙과 같은 꼴로 두었다(개념 문서의 보충 참고). 답은 문제 코드로 확인했다.
{% endraw %}
