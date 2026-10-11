---
layout: "note"
title: "포인터"
display_title: "포인터 (Pointer)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Pointer", "C 포인터", "주소 연산자", "Address-of Operator", "역참조", "Dereference", "간접 참조", "이중 포인터", "포인터의 포인터", "Pointer to Pointer", "포인터 형 변환", "Pointer Cast", "NULL 포인터"]
description: "메모리는 번호가 붙은 사물함이 길게 늘어선 것이고, 변수는 그 가운데 한 칸이다. 포인터는 값 대신 다른 칸의 번호를 넣어 두는 칸이다. 번호만 알면 멀리 있는 칸을 읽고 고칠 수 있어서, 큰 덩어리를 통째로 옮기지 않고 번호만 주고받으면 된다. 다만 번호가 틀리면 엉뚱한 칸을 읽…"
prev_url: "/studies/data-structures/operation-step-count/"
prev_title: "연산 횟수와 단계 수 세기"
next_url: "/studies/data-structures/pointer-parameters/"
next_title: "포인터 인자와 값 전달"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/c-pointer/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메모리는 번호가 붙은 사물함이 길게 늘어선 것이고, 변수는 그 가운데 한 칸이다. 포인터는 값 대신 다른 칸의 번호를 넣어 두는 칸이다. 번호만 알면 멀리 있는 칸을 읽고 고칠 수 있어서, 큰 덩어리를 통째로 옮기지 않고 번호만 주고받으면 된다. 다만 번호가 틀리면 엉뚱한 칸을 읽거나 망가뜨리고, 칸의 번호와 칸에 든 값을 헷갈리기 쉽다.

</div>


## 예시로 보기

[자료구조란](/Hongs_Blog/studies/data-structures/data-structure-definition/)에서 값을 흩어 놓고 "다음 값은 몇 번지에 있다"를 적어 두는 구조를 봤다. 그 번지를 적어 둘 칸이 있어야 한다. 값이 아니라 주소를 담는 변수가 필요하다.

`int a = 100;`이라고 쓰면 메모리의 한 칸에 100이 들어간다. 슬라이드의 그림에서는 그 칸이 1024번지다[^1].

```
주소      1020      1024      1028      1032      1036
        [  ...  ] [  100  ] [  ...  ] [ 1024  ] [  ...  ]
                      a                   p
                      ^                   |
                      +-------------------+
```

1032번지의 칸에는 1024가 들어 있다. 이 수는 값이 아니라 `a`가 있는 칸의 번호다. 이런 칸이 포인터이고, 이때 "`p`가 `a`를 가리킨다"고 말한다[^2].

그림의 번호는 예로 든 것이다. 실제 메모리는 종류마다 크기와 속도가 다르고, 운영체제가 실행 중에 자료를 다른 자리로 옮기기도 한다[^1]. 그래서 프로그램을 돌릴 때마다 주소의 숫자가 달라진다. 봐야 할 것은 숫자가 아니라 누가 누구를 가리키느냐다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 아래 식과 타입 표, 추적 표, 오해 항목, 형 변환의 값, 카드 C1·C2·C4를 C로 컴파일해 실행(ASan·UBSan)해 확인했다 — [03_c-pointer_impl.c](/Hongs_Blog/studies/data-structures/code/03_c-pointer_impl/)</div>

</div>


## 정의

포인터는 변수의 주소를 담는 변수다[^2].

**선언.** 가리킬 값의 타입 뒤에 별표를 붙여 선언한다. 별표는 타입 쪽에 붙여도, 이름 쪽에 붙여도 된다[^3].

```c
int *n;          /* int가 든 칸을 가리키는 포인터 */
int **p;         /* int 포인터가 든 칸을 가리키는 포인터 */
```

`int`, `char`, `double`뿐 아니라 직접 만든 타입에도 쓴다[^3].

**주소 연산자 `&`.** 변수 이름 앞에 `&`를 붙이면 그 변수의 주소가 나온다. `p = &c;`는 `c`의 주소를 `p`에 넣는다. 이제 `p`는 `c`를 가리킨다[^4].

`&`는 메모리에 자리가 있는 것에만 쓴다[^4]. 변수와 배열의 칸에는 자리가 있다. `&3`이나 `&(a + 1)`처럼 상수나 계산 결과에는 쓸 수 없다[^s1].

**따라가기 연산자 `*`.** 포인터 앞에 `*`를 붙이면 "거기 적힌 주소로 가서 그 칸을 읽거나 쓴다"는 뜻이다. 이것을 역참조(dereference)라 부른다[^s1].

슬라이드의 예로 세 가지를 한꺼번에 본다[^5].

```c
int V = 101;
int *P = &V;     /* P는 int V를 가리킨다 */
int **Q = &P;    /* Q는 int 포인터 P를 가리킨다 */

printf("%d %d %d\n", V, *P, **Q);    /* 101을 세 번 찍는다 */
```

```
주소      1024        1032        1040
        [  101  ]   [ 1024  ]   [ 1032  ]
            V           P           Q
            ^           |^          |
            +-----------+ +---------+
```

`Q`처럼 포인터를 가리키는 포인터를 이중 포인터라 부른다. 식마다 뜻과 타입을 적으면 이렇다. 값 칸의 번호는 위 그림의 것이다[^s1].

| 식 | 뜻 | 타입 | 값 |
|---|---|---|---|
| `V` | V에 든 값 | `int` | 101 |
| `&V` | V의 주소 | `int *` | 1024 |
| `P` | P에 든 값 | `int *` | 1024 |
| `*P` | P가 가리키는 칸에 든 값 | `int` | 101 |
| `&P` | P의 주소 | `int **` | 1032 |
| `Q` | Q에 든 값 | `int **` | 1032 |
| `*Q` | Q가 가리키는 칸(P)에 든 값 | `int *` | 1024 |
| `**Q` | 두 번 따라간 칸(V)에 든 값 | `int` | 101 |

표에서 두 가지가 보인다. `&`를 붙이면 타입에 별표가 하나 늘고, `*`를 붙이면 하나 준다. 그리고 두 연산은 서로 되돌린다. `*&V`는 `V`이고 `&*P`는 `P`다. `*P`는 `P[0]`이라고 써도 같은 칸이다. 이 표기는 [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)에서 쓴다.

**별표가 두 군데서 다른 뜻으로 쓰인다.** `int *P = &V;`의 별표는 "P는 포인터다"라는 표시다. 여기서 `&V`가 들어가는 곳은 `P`다. `*P = 7;`의 별표는 "따라가라"는 연산이다. 여기서 7이 들어가는 곳은 `P`가 가리키는 칸이다[^s1].

**아무것도 가리키지 않는 값.** 포인터에 `NULL`을 넣으면 "지금은 어느 칸도 가리키지 않는다"는 표시가 된다. `NULL`인 포인터는 따라가면 안 된다. 연결 리스트의 맨 끝을 이 값으로 적는다[^s1].

### 한 줄씩 따라가기

```c
int V = 101, W = 55;
int *P = &V;
int **Q = &P;

*P = 7;       /* 1 */
**Q = 9;      /* 2 */
*Q = &W;      /* 3 */
**Q = 1;      /* 4 */
```

| 줄 | V | W | P가 가리키는 곳 | 한 일 |
|---|---|---|---|---|
| 처음 | 101 | 55 | V | |
| 1 | 7 | 55 | V | P를 따라간 칸은 V다. V에 7을 넣는다 |
| 2 | 9 | 55 | V | Q를 따라가면 P, P를 따라가면 V다. V에 9를 넣는다 |
| 3 | 9 | 55 | W | Q를 한 번만 따라간 칸은 P다. P에 W의 주소를 넣는다 |
| 4 | 9 | 1 | W | 이제 두 번 따라가면 W다. W에 1을 넣는다 |

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `int **Q = &P;`에서 `&P`의 타입이 `int **`인 까닭은?</summary>

`P`의 타입이 `int *`이다. `&`는 "그 타입이 든 칸을 가리키는 포인터"를 만드므로 별표가 하나 더 붙어 `int **`가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3번 줄 `*Q = &W;`가 V의 값을 바꾸지 않는 까닭은?</summary>

`*Q`는 Q가 가리키는 칸, 곧 P다. 이 줄은 P에 든 주소를 바꿀 뿐이다. V가 있는 칸에는 아무것도 쓰지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 2번 줄과 4번 줄은 둘 다 `**Q = …`인데 왜 서로 다른 변수를 바꾸는가?</summary>

어디로 가는지는 글자가 아니라 실행하는 순간 칸에 든 주소가 정한다. 2번 줄에서는 P에 V의 주소가 들어 있었고, 3번 줄이 그것을 W의 주소로 바꿨다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 예의 핵심 아이디어는?</summary>

칸의 번호(주소)와 칸에 든 것(값)을 가른다. 별표를 하나 붙일 때마다 "칸에 든 것을 주소로 보고 한 번 더 간다".

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

연결 리스트에서 노드 안의 주소를 따라 다음 노드로 가는 것([단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)), 자바의 변수가 객체의 자리 번호를 들고 있는 것([참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)), 어셈블리어에서 레지스터에 든 주소가 가리키는 곳을 읽는 것([간접 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/))이 모두 같은 일이다.

</details>


### 포인터에 타입이 붙는 까닭

주소는 그냥 수인데 왜 `int *`와 `double *`를 가를까. 포인터의 타입이 두 가지를 정하기 때문이다[^s2].

- `*p`로 따라갔을 때 몇 바이트를 어떤 규칙으로 읽을지. `int *`면 4바이트를 정수로, `double *`면 8바이트를 실수로 읽는다.
- `p + 1`이 몇 바이트를 건너뛸지. 이것은 [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)에서 쓴다.

포인터 자체의 크기는 가리키는 타입과 상관없이 같다. 이 문서를 확인한 기계에서는 무엇을 가리키든 8바이트다. 슬라이드의 그림은 4바이트로 그렸다[^s2].

### 포인터 형 변환

한 타입의 변수 주소를 다른 타입을 가리키는 포인터에 넣을 때는, 일부러 그런 것임을 형 변환 연산자로 밝힌다[^6].

```c
int V = 101;
float *P = (float *)&V;    /* int의 주소를 float * 로 바꾼다 */
```

이렇게 쓰면 컴파일러의 경고는 사라진다. 그래도 위험한 일인 것은 그대로다[^6]. 어떤 포인터 타입이든 다른 포인터 타입으로 바꿀 수 있고, 바꾼 포인터를 따라가면 그 칸에 실제로 무엇이 들었든 새 타입으로 읽는다[^7].

같은 칸을 다른 규칙으로 읽으면 다른 값이 나온다. 101이 든 4바이트를 `float` 규칙으로 읽으면 101.0이 아니라 약 $$1.4 \times 10^{-43}$$이다. 값을 바꾸는 형 변환 `(float)V`는 101.0을 준다. 포인터 형 변환은 값을 바꾸지 않고 읽는 규칙만 바꾼다[^s3].

`double *`로 바꿔 따라가면 8바이트를 읽으므로 `V`의 4바이트를 넘어 옆 칸까지 읽는다. C 표준은 이런 식으로 읽은 결과가 무엇인지 정해 두지 않았다[^s3].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.28 "`ppi = (double *)pn;  // *pn originally of type (int*)`" / 문제점: `int *` 타입인 것은 `pn`이다. `*pn`은 따라간 값이라 타입이 `int`다. / 수정안: "`pn` originally of type `(int *)`" / 근거: 위 식과 타입 표. 별표를 하나 붙이면 타입에서 별표가 하나 준다.

</div>


### 포인터에 넣을 수 있는 것과 없는 것

넣을 수 있는 것[^s1].

- `int *p = &a;` 변수의 주소.
- `int **q = &p;` 포인터 변수의 주소.
- `int *r = NULL;` 아무것도 가리키지 않는다는 표시.

넣을 수 없거나 넣으면 안 되는 것.

- `int *p = 100;` 정수 100은 주소가 아니다. 컴파일러가 막는다.
- `int *p; *p = 5;` 주소를 넣지 않은 포인터에는 쓰레기 값이 들어 있다. 따라가면 어느 칸을 고칠지 알 수 없다.

## 활용

- 함수가 부른 쪽의 변수를 고치게 하기: [포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)
- 배열의 칸을 주소로 다루기: [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)
- 실행 중에 받은 메모리를 가리키기: [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)
- 값을 주소로 이어 붙이기: [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)
- **흔한 실수.** 주소를 넣지 않은 포인터를 따라간다. `NULL`인 포인터를 따라간다. `int* x, y;`라고 쓰고 둘 다 포인터라고 믿는다. 별표는 이름마다 붙으므로 `y`는 그냥 `int`다[^s1].

## 연결

- 선수: [자료구조란](/Hongs_Blog/studies/data-structures/data-structure-definition/)
- 자바에서는 주소를 직접 계산하거나 `&`로 얻을 수 없다. 변수가 자리 번호를 들고 있다는 점만 같다: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)
- 기계어 수준에서 주소를 따라가는 명령: [간접 피연산자와 인덱스 피연산자](/Hongs_Blog/studies/assembly-language/indirect-addressing/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`p = q;`와 `*p = *q;`는 같은 일을 한다"</div>

틀렸다. 둘 다 "p를 q와 같게 만든다"로 읽혀서 같아 보인다. `p = q;`는 쪽지를 베낀다. p에 든 주소가 q에 든 주소로 바뀌어 둘이 같은 칸을 가리키게 된다. `*p = *q;`는 내용물을 베낀다. p가 가리키는 칸에 q가 가리키는 칸의 값이 들어가고, p는 여전히 원래 칸을 가리킨다. `int a = 1, b = 2; int *p = &a, *q = &b;`에서 `*p = *q;`를 하면 `a`가 2가 되고, 이어서 `*p = 10;`을 하면 `a`만 10이 된다. 여기서 `p = q;`를 하고 `*p = 5;`를 하면 이번에는 `b`가 5가 되고 `a`는 10 그대로다. 확인하려면 두 줄 뒤에 `a`와 `b`를 찍어 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `int x = 3, y = 8; int *p = &x; int **pp = &p;`로 시작해 `*p = *p + 1;` `*pp = &y;` `**pp = **pp * 2;`를 차례로 실행한다. 끝난 뒤 `x`, `y`, `*p`의 값은?</summary>

**답:** `x`는 4, `y`는 16, `*p`는 16.<br>
**이유:** 첫 줄은 p가 가리키는 x를 4로 만든다. 둘째 줄의 `*pp`는 p다. p가 y를 가리키게 된다. 셋째 줄은 두 번 따라간 y를 16으로 만든다. p가 y를 가리키므로 `*p`도 16이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `int a = 1, b = 2; int *s = &a, *t = &b;`에서 시작한다. (가) `s = t; *s = 9;` (나) `*s = *t; *s = 9;` 를 각각 실행한 뒤 `a`와 `b`는?</summary>

**답:** (가) `a`는 1, `b`는 9. (나) `a`는 9, `b`는 2.<br>
**이유:** (가)의 `s = t;`는 s가 b를 가리키게 한다. 그래서 9는 b에 들어간다. (나)의 `*s = *t;`는 a에 2를 넣을 뿐 s는 여전히 a를 가리킨다. 그래서 9는 a에 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `int V = 101;`일 때 `(float)V`는 101.0인데, `(float *)&V`로 바꾼 포인터를 따라가 읽으면 왜 101.0이 나오지 않는가?</summary>

**답:** `(float)V`는 값 101을 실수 101.0으로 바꾼다. `(float *)&V`는 값은 그대로 두고 "이 칸을 `float`로 읽어라"라고 읽는 규칙만 바꾼다. 정수 101을 적어 둔 0과 1의 줄을 실수 규칙으로 읽으면 약 $$1.4 \times 10^{-43}$$이 된다.<br>
**흔한 오답:** "형 변환이니 값이 알아서 바뀐다." 포인터 형 변환은 가리키는 칸의 내용을 건드리지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** q가 r을 가리키고, r이 n을 가리키고, n에는 5가 들어 있다(`q → r → n`). 이렇게 되도록 변수 셋을 선언하는 C 코드를 쓰라.</summary>

**답:** `int n = 5; int *r = &n; int **q = &r;`<br>
**이유:** r은 `int`가 든 칸을 가리키니 `int *`이고, q는 `int *`가 든 칸을 가리키니 `int **`다. 선언 순서도 화살표의 끝부터다. 가리킬 대상이 먼저 있어야 그 주소를 구할 수 있다.

</details>


[^1]: 자료구조 2회 강의 자료 「DS_Week2_2024」, p.22 (Pointers and Arrays: 물리 메모리, `int a = 100;`이 1024번지에 놓인 그림)
[^2]: 같은 자료, p.23 (포인터는 변수의 주소를 담는 변수, 1032번지의 칸이 1024번지를 가리키는 그림)
[^3]: 같은 자료, p.24 (포인터 변수의 선언: `type* pointer_name;`, `int *n;`, `CProgramming *c;`, `int **p;`)
[^4]: 같은 자료, p.25 (Pointers and address: `&` 연산자, `p = &c;`, 메모리에 있는 것에만 쓴다)
[^5]: 같은 자료, p.26 (예: `V`, `*P`, `**Q`가 101을 세 번 찍는다)
[^6]: 같은 자료, p.27 (Casting pointers: `float *P = (float *) &V;`, 경고는 없어지지만 여전히 안전하지 않다)
[^7]: 같은 자료, p.28 (어떤 포인터 타입이든 다른 포인터 타입으로 바꿀 수 있다, 따라가면 새 타입으로 읽는다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 사물함 비유, 따라가기 연산자의 풀이와 이름, 식과 타입 표, 주소 1040, 별표의 두 뜻, `NULL`, 추적 표, 스스로 설명해 보기, 넣을 수 있는 것과 없는 것, `int* x, y;`, 오해 항목, 카드 C1~C4는 원본에 없다. 슬라이드는 `*`를 예제 코드로만 보인다. Kernighan·Ritchie, *The C Programming Language* 2판, 5.1절의 설명을 따랐고 값은 구현 코드로 확인했다. `&3`, `&(a + 1)`, `int *p = 100;`은 따로 컴파일해 오류가 나는 것을 봤다(Apple clang 21).
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 포인터에 타입이 붙는 까닭과 포인터의 크기는 원본에 없다. 구현 코드에서 `sizeof`로 `char *`, `int *`, `double *`, `int **`가 모두 8바이트인 것을 확인했다. 슬라이드 그림의 주소 간격(1020, 1024)은 4바이트다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 101을 `float`로 읽은 값과 `(float)V`의 비교, `double *`로 읽을 때의 설명은 원본에 없다. 구현 코드는 비트를 `memcpy`로 옮겨 같은 값($$101 \times 2^{-149}$$)을 얻었다. 다른 타입의 포인터로 직접 읽는 것은 C11 표준 6.5절 7항이 허락하지 않는다.
{% endraw %}
