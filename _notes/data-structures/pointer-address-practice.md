---
layout: "note"
title: "포인터와 주소 계산 연습"
display_title: "포인터와 주소 계산 연습"
kind: "practice"
kind_label: "연습"
num: "05"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "2주차의 포인터 복습을 손으로 따라가는 네 문제다. 모두 \"코드를 읽고 결과를 예측한다\"는 같은 일을 한다. 답을 펴기 전에 종이에 칸을 그리고 화살표를 그어 본다."
prev_url: "/studies/data-structures/step-count-ladder/"
prev_title: "단계 수 세기 예제 사다리"
next_url: "/studies/data-structures/array-mapping-ladder/"
next_title: "배열 위치 공식 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/pointer-address-practice/"
---
{% raw %}
2주차의 포인터 복습을 손으로 따라가는 네 문제다. 모두 "코드를 읽고 결과를 예측한다"는 같은 일을 한다. 답을 펴기 전에 종이에 칸을 그리고 화살표를 그어 본다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제와 변형 문제의 답을 C로 컴파일해 실행(ASan·UBSan)해 확인했다 — [05_pointer-address-practice_p4.c](/Hongs_Blog/studies/data-structures/code/05_pointer-address-practice_p4/)</div>

</div>


## p1 · 포인터를 따라가며 값 추적하기

다음 코드가 찍는 값은?

```c
int a = 10, b = 20;
int *p = &a;
int **q = &p;

*p = *p + b;       /* 1 */
p = &b;            /* 2 */
**q = **q + 1;     /* 3 */
*q = &a;           /* 4 */
*p = *p - b;       /* 5 */
printf("%d %d %d\n", a, b, **q);
```

사용 개념: [포인터](/Hongs_Blog/studies/data-structures/c-pointer/)의 `&`, `*`, 이중 포인터.

풀이 전략: 변수마다 칸을 하나씩 그린다. 포인터 칸에서는 가리키는 칸으로 화살표를 긋는다. 줄마다 "왼쪽은 어느 칸인가"를 먼저 정한 뒤 값을 넣는다. 별표가 하나면 한 번, 둘이면 두 번 따라간다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *칸 그리기:* `a` 10, `b` 20. `p`는 `a`를 가리키고 `q`는 `p`를 가리킨다.
2. *한 줄씩 따라가기:*

| 줄 | 왼쪽이 가리키는 칸 | `a` | `b` | `p`가 가리키는 곳 |
|---|---|---|---|---|
| 처음 | | 10 | 20 | `a` |
| 1 | `p`를 따라간 `a` | 30 | 20 | `a` |
| 2 | `p` 자신 | 30 | 20 | `b` |
| 3 | `q` → `p` → `b` | 30 | 21 | `b` |
| 4 | `q`를 한 번 따라간 `p` | 30 | 21 | `a` |
| 5 | `p`를 따라간 `a` | 9 | 21 | `a` |

{: start="3"}
3. *찍는 값 정하기:* `**q`는 `q` → `p` → `a`라서 9다. 출력은 `9 21 9`다.

</details>


**변형.** 4번 줄을 지우면 무엇이 찍히는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`30 0 0`. 5번 줄에서 `p`가 여전히 `b`를 가리키므로 `b`가 $$21 - 21 = 0$$이 된다. `a`는 30 그대로이고 `**q`는 `b`의 값 0이다.

</details>


## p2 · 칸의 주소 계산하기

칸의 크기는 `char` 1바이트, `short` 2바이트, `int` 4바이트, `double` 8바이트로 한다.

- (가) `int arr[10]`의 `arr[0]`이 100번지에 있다. `arr[3]`의 주소는?
- (나) `double d[10]`의 `d[0]`이 400번지에 있다. `d[2]`의 주소는?
- (다) `short s[10]`의 `s[0]`이 2000번지에 있다. `s[7]`의 주소는?
- (라) `char c[10]`의 `c[0]`이 50번지에 있다. `c[9]`의 주소는?
- (마) (가)의 배열에서 `&arr[4] - &arr[1]`의 값은? 두 주소는 몇 바이트 떨어져 있는가?
- (바) `int *p = arr + 2;`라고 하면 `p[1]`은 `arr`의 몇 번 칸인가?

사용 개념: [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)의 주소 식 "시작 + 번호 × 칸 크기".

풀이 전략: 번호에 칸 크기를 곱해 시작 주소에 더한다. 포인터끼리의 덧셈과 뺄셈은 바이트가 아니라 칸을 센다는 것만 따로 챙긴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *식에 넣기:* (가) $$100 + 3 \times 4 = 112$$. 슬라이드의 "arr[0]이 100이면 arr[3]은 112. 왜?"의 답이다[^1]. (나) $$400 + 2 \times 8 = 416$$. (다) $$2000 + 7 \times 2 = 2014$$. (라) $$50 + 9 \times 1 = 59$$.
2. *포인터끼리 빼기:* (마) 3이다. 포인터의 뺄셈은 사이에 있는 칸 수를 준다. 바이트로는 $$3 \times 4 = 12$$바이트 떨어져 있다.
3. *포인터에서 번호 붙이기:* (바) `p`는 `arr[2]`를 가리킨다. `p[1]`은 거기서 한 칸 뒤인 `arr[3]`이다.

</details>


**변형.** (가)에서 `int` 대신 원소 하나가 12바이트인 구조체 배열이라면 3번 칸의 주소는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$100 + 3 \times 12 = 136$$. 식은 같고 칸 크기만 바뀐다.

</details>


## p3 · 값으로 받는 인자와 주소로 받는 인자

다음 코드가 찍는 값은?

```c
void f(int x, int *y)
{
    x = x + 1;
    *y = *y + x;
}

int main(void)
{
    int a = 1, b = 2;
    f(a, &b);
    f(b, &a);
    printf("%d %d\n", a, b);
    return 0;
}
```

사용 개념: [포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/).

풀이 전략: 함수를 부를 때마다 인자 칸을 새로 그린다. `x`에는 값을 베껴 넣고, `y`에는 화살표를 긋는다. `x`를 고치는 줄은 부른 쪽에 아무 일도 하지 않는다는 것을 놓치지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *첫 호출 `f(a, &b)`:* `x`는 1을 베껴 받고 `y`는 `b`를 가리킨다. `x`가 2가 되고, `b`는 $$2 + 2 = 4$$가 된다. `a`는 1 그대로다.
2. *둘째 호출 `f(b, &a)`:* `x`는 4를 베껴 받고 `y`는 `a`를 가리킨다. `x`가 5가 되고, `a`는 $$1 + 5 = 6$$이 된다. `b`는 4 그대로다.
3. *찍는 값 정하기:* `6 4`.

</details>


**변형.** 첫 인자도 주소로 받게 고친다. `void g(int *x, int *y) { *x = *x + 1; *y = *y + *x; }`로 바꾸고 `g(&a, &b); g(&b, &a);`를 부르면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`7 5`. 첫 호출에서 `a`가 2, `b`가 $$2 + 2 = 4$$가 된다. 둘째 호출에서 `b`가 5, `a`가 $$2 + 5 = 7$$이 된다. 이번에는 1을 더한 것이 부른 쪽에 남는다.

</details>


## p4 · 문자열 함수

- (가) 문자열의 길이를 돌려주는 함수 `length`를 포인터로 써라. 번호 `i`를 쓰지 않는다.
- (나) 슬라이드의 포인터 판 비교 함수[^2]에 `("data", "date")`, `("list", "lis")`, `("heap", "heap")`을 넣으면 각각 무엇을 돌려주는가? 글자의 번호는 `'a'`가 97, `'e'`가 101, `'t'`가 116이다.
- (다) 슬라이드의 포인터 판 복사 함수[^3]로 `"tree"`를 베끼면 글자를 몇 번 베끼고 포인터를 몇 번 옮기는가?

```c
int compare(const char *s, const char *t)
{
    for (; *s == *t; s++, t++)
        if (*s == '\0')
            return 0;
    return *s - *t;
}

void copy(char *s, const char *t)
{
    while ((*s = *t) != '\0') {
        s++;
        t++;
    }
}
```

사용 개념: [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)의 문자 포인터와 `'\0'`.

풀이 전략: 문자열은 `'\0'`에서 끝난다는 것 하나로 푼다. 포인터를 한 칸씩 옮기다가 `'\0'`을 만나는 순간에 무엇을 하는지만 따져 본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 끝까지 옮기고 거리 재기:* 포인터 하나를 `'\0'`까지 옮긴 뒤, 처음 주소와의 차를 돌려준다. 포인터끼리 빼면 칸 수가 나오고 `char`는 한 칸이 글자 하나다.

```c
int length(const char *s)
{
    const char *p = s;
    while (*p != '\0')
        p++;
    return (int)(p - s);
}
```

`length("tree")`는 4, `length("")`는 0이다.

{: start="2"}
2. *(나) 처음 갈리는 글자 찾기:* `"data"`와 `"date"`는 넷째 글자에서 갈린다. `'a' - 'e'`는 $$97 - 101 = -4$$다. `"list"`와 `"lis"`는 넷째 자리에서 `'t'`와 `'\0'`이 만난다. $$116 - 0 = 116$$이다. `"heap"`과 `"heap"`은 같은 채로 `'\0'`에 닿아 0이다.
3. *(다) 바퀴 세기:* `'t'`, `'r'`, `'e'`, `'e'`를 베낄 때마다 계속하고, 다섯 번째로 `'\0'`을 베낀 뒤 멈춘다. 글자를 5번 베끼고 포인터를 4번 옮긴다. 글자가 $$k$$개면 $$k + 1$$번 베끼고 $$k$$번 옮긴다.

</details>


**변형.** `copy`의 조건을 `while (*t != '\0') { *s = *t; s++; t++; }`로 바꾸면 무엇이 잘못되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

끝 표시 `'\0'`을 베끼지 않는다. `'\0'`을 보는 순간 반복을 빠져나가기 때문이다. 받은 쪽 배열에 끝 표시가 없으면 그 문자열을 읽는 함수가 어디서 멈출지 모른다. 반복 뒤에 `*s = '\0';`을 한 줄 더 써야 한다.

</details>


[^1]: 자료구조 2회 강의 자료 「DS_Week2_2024」, p.31 (arr[0]의 주소가 100이면 arr[3]은 112. Why?)
[^2]: 같은 자료, p.34 (strcmp 2: 포인터로 쓴 판)
[^3]: 같은 자료, p.33 (strcpy B: 포인터로 쓴 판)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 문제와 변형 문제의 코드와 수치는 원본에 없다. 슬라이드 p.26(포인터의 포인터), p.29(swap), p.31(주소 식), p.33~34(문자열 함수)를 연습하도록 만들었다. p4의 `compare`와 `copy`는 슬라이드의 함수에서 이름만 바꾸고 `const`를 붙인 것이다. 답은 변형 문제까지 문제 코드로 확인했다.
{% endraw %}
