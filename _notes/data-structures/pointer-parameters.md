---
layout: "note"
title: "포인터 인자와 값 전달"
display_title: "포인터 인자와 값 전달 (Pointers and Function Arguments)"
kind: "concept"
kind_label: "기법"
num: "04"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Pointer Arguments", "Pointers and Function Arguments", "값 전달", "Call by Value", "Pass by Value", "주소 전달", "포인터 매개변수", "swap", "참조 변수", "Reference Variable", "참조 전달", "Call by Reference"]
description: "함수를 부를 때 넘기는 값은 복사본으로 간다. 그래서 함수가 받은 값을 아무리 고쳐도 부른 쪽의 원본은 그대로다. 원본을 고치게 하려면 값 대신 원본이 있는 자리의 번호를 넘기고, 함수는 그 번호를 따라가서 고친다. 대신 부르는 쪽과 받는 쪽이 기호를 하나씩 더 써야 하고, 하나라…"
prev_url: "/studies/data-structures/c-pointer/"
prev_title: "포인터"
next_url: "/studies/data-structures/array-pointer/"
next_title: "배열과 포인터"
math: false
mermaid: false
code_count: 1
permalink: "/studies/data-structures/pointer-parameters/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

함수를 부를 때 넘기는 값은 복사본으로 간다. 그래서 함수가 받은 값을 아무리 고쳐도 부른 쪽의 원본은 그대로다. 원본을 고치게 하려면 값 대신 원본이 있는 자리의 번호를 넘기고, 함수는 그 번호를 따라가서 고친다. 대신 부르는 쪽과 받는 쪽이 기호를 하나씩 더 써야 하고, 하나라도 빠뜨리면 원본은 그대로이거나 엉뚱한 자리가 고쳐진다.

</div>


## 예시로 보기

두 변수의 값을 맞바꾸는 일은 정렬에서 수없이 한다. 이것을 함수로 빼 두고 싶다. 처음 떠오르는 대로 쓰면 이렇다.

```c
void swap_by_value(int x, int y)
{
    int temp;
    temp = x;
    x = y;
    y = temp;
}
```

`int a = 3, b = 7;` 뒤에 `swap_by_value(a, b);`를 불러도 `a`는 3, `b`는 7 그대로다. 함수가 받은 `x`와 `y`는 `a`와 `b`의 값을 베껴 받은 다른 칸이기 때문이다. 함수 안에서 `x`와 `y`는 분명히 7과 3으로 바뀐다. 그러나 함수가 끝나면 그 두 칸은 사라진다.

```
swap_by_value(a, b)               swap_by_pointer(&a, &b)

main   a [ 3 ]    b [ 7 ]         main   a [ 3 ]    b [ 7 ]
                                           ^          ^
함수   x [ 3 ]    y [ 7 ]         함수  px [ a의 주소 ]  py [ b의 주소 ]
       값을 베낀 다른 칸                  주소를 베껴 받았다. 따라가면 a와 b다
```

부른 쪽의 변수를 고치려면 바꿀 값이 있는 칸의 주소를 넘긴다. `&a`가 `a`를 가리키는 포인터다.

```c
void swap_by_pointer(int *px, int *py)
{
    int temp;
    temp = *px;
    *px = *py;
    *py = temp;
}
```

`swap_by_pointer(&a, &b);`를 부르면 `a`는 7, `b`는 3이 된다. 한 줄씩 보면 이렇다[^s1].

| 실행한 줄 | `temp` | `a` (`*px`) | `b` (`*py`) |
|---|---|---|---|
| 함수에 들어옴 | 정해지지 않음 | 3 | 7 |
| `temp = *px;` | 3 | 3 | 7 |
| `*px = *py;` | 3 | 7 | 7 |
| `*py = temp;` | 3 | 7 | 3 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 swap의 결과와 추적 표, 몫과 나머지를 돌려주는 함수, 포인터를 바꾸는 함수 두 판, 배열 인자, 카드 C1·C3을 C로 컴파일해 실행(ASan·UBSan)해 확인했다 — [04_pointer-parameters_impl.c](/Hongs_Blog/studies/data-structures/code/04_pointer-parameters_impl/)</div>

</div>


## 규칙

C에서 불린 함수가 부른 함수의 변수를 직접 고치는 길은 없다. 인자는 늘 값을 베껴서 넘긴다. 이것을 값 전달(call by value)이라 부른다[^s1].

포인터를 넘길 때도 규칙은 같다. 주소라는 값을 베껴서 넘긴다. 다만 베낀 주소도 같은 칸을 가리키므로, 따라가서 쓰면 부른 쪽의 칸이 바뀐다. 포인터 인자 덕분에 함수가 자기를 부른 함수 안의 것을 읽고 고칠 수 있다.

쓰는 쪽과 받는 쪽이 짝을 맞춰야 한다.

| 자리 | 값을 넘길 때 | 주소를 넘길 때 |
|---|---|---|
| 함수 머리 | `int x` | `int *px` |
| 함수 안 | `x` | `*px` |
| 부르는 곳 | `f(a)` | `f(&a)` |

### 포인터 자체를 바꾸고 싶을 때

같은 규칙을 한 번 더 쓴다. 부른 쪽의 `int` 변수를 고치려면 `int *`를 받았다. 부른 쪽의 `int *` 변수를 고치려면 `int **`를 받는다[^s2].

```c
void clear_wrong(int *p)
{
    p = NULL;          /* 베껴 받은 주소만 NULL이 된다 */
}

void clear_right(int **pp)
{
    *pp = NULL;        /* 부른 쪽의 포인터 변수를 고친다 */
}
```

`int n = 5; int *p = &n;` 뒤에 `clear_wrong(p);`를 불러도 `p`는 여전히 `n`을 가리킨다. `clear_right(&p);`를 불러야 `p`가 `NULL`이 된다. 연결 리스트에서 맨 앞 노드를 가리키는 변수를 함수가 바꿔야 할 때 이 꼴을 쓴다: [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/).

### 참조 변수

참조(reference)는 이미 있는 메모리 자리에 붙인 또 하나의 이름이다. 한 번 붙이면 늘 같은 대상을 가리킨다. 참조에 새 값을 넣으면 가리키는 대상의 값이 바뀐다. 함수에 인자를 넘길 때 흔히 쓴다. 다만 참조는 C++에 있는 기능이고 C에는 없다. C에서 부른 쪽의 변수를 고치려면 위의 포인터 인자를 쓴다[^s3].

```cpp
/* C++ 코드다. C 컴파일러는 받아들이지 않는다 */
void swap(int &x, int &y)
{
    int temp = x;
    x = y;
    y = temp;
}
```

부를 때는 `swap(a, b);`라고만 쓴다. `&`와 `*`를 쓰지 않아도 `x`와 `y`가 `a`와 `b`의 다른 이름이 되어 원본이 바뀐다[^s3].


## 활용

이 기법이 필요한 신호는 셋이다[^s2].

- 함수가 부른 쪽의 변수를 바꿔야 한다. 맞바꾸기가 그 예다.
- 함수가 값을 둘 이상 돌려줘야 한다. `return`은 하나만 돌려준다. 몫과 나머지를 함께 돌려주려면 받을 칸 두 개의 주소를 넘긴다: `divide(17, 5, &q, &r);` 뒤에 `q`는 3, `r`은 2다.
- 배열을 넘긴다. 배열을 인자로 쓰면 첫 칸의 주소가 넘어가므로 함수가 배열의 내용을 고칠 수 있다: [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)

**흔한 실수.**

- 부를 때 `&`를 빼먹고 `swap_by_pointer(a, b);`라고 쓴다. 정수를 주소 자리에 넘긴 것이라 컴파일러가 막는다.
- 함수 안의 변수 주소를 돌려준다. 함수가 끝나면 그 칸은 사라지므로 돌려받은 주소는 쓸 수 없는 곳을 가리킨다. 함수가 끝난 뒤에도 남아야 하는 자리는 [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)으로 받는다.

## 연결

- 선수: [포인터](/Hongs_Blog/studies/data-structures/c-pointer/)
- 자바는 참조 타입 변수를 넘길 때 자리 번호를 베껴 넘긴다. 받은 쪽이 그 번호로 객체를 고치면 부른 쪽에도 보인다는 점이 포인터 인자와 같다: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)
- 인자가 실제로 스택에 베껴지는 모습: [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `int a = 1, b = 2;` 뒤에 `swap_by_value(a, b);`를 부르고 `a`와 `b`를 찍는다. 이어서 `swap_by_pointer(&a, &b);`를 부르고 다시 찍는다. 두 번 찍힌 값은?</summary>

**답:** 첫 번째는 `1 2`, 두 번째는 `2 1`.<br>
**이유:** 첫 호출은 복사본 `x`, `y`만 바꾸고 끝난다. 둘째 호출은 `a`와 `b`의 주소를 따라가 원본을 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `swap_by_value` 안에서 `x`와 `y`는 분명히 맞바뀐다. 그런데 왜 부른 쪽의 `a`와 `b`는 그대로인가?</summary>

**답:** `x`와 `y`는 `a`와 `b`의 값을 베껴 받은 다른 칸이다. 함수는 그 두 칸만 고치고, 함수가 끝나면 두 칸은 사라진다. `a`와 `b`가 있는 칸에는 아무것도 쓰지 않았다.<br>
**흔한 오답:** "함수 안에서 바꾸는 코드가 틀렸다." 코드는 맞게 바꾼다. 바꾼 대상이 복사본일 뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `int n = 5; int *p = &n;`이 있다. 함수를 불러 `p`를 `NULL`로 만들고 싶다. (가) `void f(int *q) { q = NULL; }`을 `f(p);`로 부른다. (나) `void g(int **q) { *q = NULL; }`을 `g(&p);`로 부른다. 어느 쪽이 되는가? 다른 쪽은 왜 안 되는가?</summary>

**답:** (나)만 된다.<br>
**이유:** (가)의 `q`는 `p`에 든 주소를 베껴 받은 다른 칸이다. `q`를 `NULL`로 바꿔도 `p`는 그대로 `n`을 가리킨다. (나)는 `p`가 있는 칸의 주소를 받아서 그 칸에 `NULL`을 쓴다. 고치려는 변수의 타입에 별표를 하나 더 붙인 타입으로 받아야 한다.

</details>


[^s1]: Kernighan·Ritchie, *The C Programming Language* 2판, 5.2절이 같은 두 함수로 설명한다. 값은 구현 코드로 확인했다.
[^s2]: 구현 코드로 확인했다. `&`를 빼먹은 호출이 컴파일 오류인 것과 지역 변수의 주소를 돌려주면 경고가 나는 것은 따로 컴파일해 봤다(Apple clang 21).
[^s3]: C++ 컴파일러로 돌려 3과 7이 맞바뀌는 것을 확인했다. 같은 코드를 `cc -std=c11`로 컴파일하면 `int &x`에서 문법 오류가 난다.
{% endraw %}
