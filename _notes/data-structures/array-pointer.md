---
layout: "note"
title: "배열과 포인터"
display_title: "배열과 포인터 (Arrays and Pointers)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Arrays and Pointers", "배열", "Array", "1차원 배열", "포인터 산술", "Pointer Arithmetic", "주소 계산", "임의 접근", "Random Access", "문자 배열", "문자 포인터", "Character Pointer", "문자열 상수", "strcpy", "strcmp", "널 문자"]
description: "배열은 같은 크기의 칸이 빈틈없이 줄지어 선 것이다. 그래서 첫 칸의 주소와 칸 하나의 크기만 알면 몇 번째 칸이든 곱셈과 덧셈 한 번으로 주소가 나오고, 어느 칸이든 곧바로 읽는다. C에서는 배열의 이름이 첫 칸의 주소처럼 쓰여서 배열과 포인터를 거의 같은 식으로 다룬다. 다만 …"
prev_url: "/studies/data-structures/pointer-parameters/"
prev_title: "포인터 인자와 값 전달"
next_url: "/studies/data-structures/dynamic-memory-allocation/"
next_title: "동적 메모리 할당"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "05_array-pointer_impl.c", "u": "/studies/data-structures/code/05_array-pointer_impl/", "r": "구현"}]
permalink: "/studies/data-structures/array-pointer/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

배열은 같은 크기의 칸이 빈틈없이 줄지어 선 것이다. 그래서 첫 칸의 주소와 칸 하나의 크기만 알면 몇 번째 칸이든 곱셈과 덧셈 한 번으로 주소가 나오고, 어느 칸이든 곧바로 읽는다. C에서는 배열의 이름이 첫 칸의 주소처럼 쓰여서 배열과 포인터를 거의 같은 식으로 다룬다. 다만 C는 배열이 몇 칸인지 지켜 주지 않아 범위 밖을 읽고 써도 막지 않고, 배열 이름은 포인터와 달리 다른 곳을 가리키게 바꿀 수 없다.

</div>


## 예시로 보기

점수 30개를 변수 30개에 담을 수는 없다. 이름 하나에 번호를 붙여 `x[0]`, `x[1]`, …로 부르고 싶다. 그러려면 컴퓨터가 `x[2]`가 어디 있는지 바로 알아야 한다.

1차원 배열 `x = [a, b, c, d]`는 메모리의 이어진 칸에 차례로 놓인다.

```
                start
                  |
                  v
 ... [    ][    ][ a ][ b ][ c ][ d ][    ][    ] ...
                 x[0] x[1] x[2] x[3]
```

첫 칸의 자리를 `start`라 하면, 칸 단위로 셀 때 `x[i]`의 자리는 `start + i`다.

바이트로 세면 칸의 크기를 곱한다. `arr[0]`의 주소가 100이면 `arr[3]`의 주소는 112다. `int` 하나가 4바이트이고 앞에 세 칸이 있으니 $$100 + 3 \times 4 = 112$$다.

배열을 쓰려면 원소 자리 말고 `start`를 적어 둘 자리가 하나 더 든다. 주소 하나가 4바이트인 기계에서는 4바이트다. 이 문서를 확인한 기계처럼 주소가 8바이트면 8바이트다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `char`·`int`·`double`·구조체 배열에서 칸의 주소 차가 번호 × 칸 크기인 것, 포인터 식과 배열 식이 같은 칸인 것, 문자 배열과 문자 포인터의 크기, 복사와 비교 두 판을 표준 `strcpy`·`strcmp`와 무작위 1,000쌍으로 견준 것, 카드의 답을 C로 컴파일해 실행(ASan·UBSan)해 확인했다 — [05_array-pointer_impl.c](/Hongs_Blog/studies/data-structures/code/05_array-pointer_impl/)</div>

</div>


## 정의

C의 배열은 이어진 메모리 한 덩어리이고, 그 덩어리를 포인터로 다룬다.

`int A[5]`라고 쓰면 `A`는 배열이 시작하는 곳, 곧 첫 원소의 주소다. `&A[0]`과 같다. 그래서 `A`는 어떤 뜻에서 `int`를 가리키는 포인터다.

**칸의 주소.** `A[x]`의 주소는 배열의 주소에 "칸 번호 × 칸 하나의 바이트 수"를 더한 것이다.

$$\text{addr}(A[x]) = \text{addr}(A[0]) + x \times s$$


$$\text{addr}(\cdot)$$은 그 칸의 주소, $$x$$는 0부터 세는 칸 번호, $$s$$는 원소 하나의 크기(바이트)다. `int`면 $$s = 4$$, `double`이면 $$s = 8$$, `char`면 $$s = 1$$이다[^s1].

**포인터에 더하기.** 포인터에 `+`를 쓰면 위 식대로 계산한다. `A + 1`은 주소를 1바이트가 아니라 한 칸만큼 올린다.

| 포인터로 쓴 식 | 배열로 쓴 식 | 뜻 |
|---|---|---|
| `A` | `&A[0]` | 첫 칸의 주소 |
| `A + x` | `&A[x]` | x번 칸의 주소 |
| `*(A + x)` | `A[x]` | x번 칸의 값 |

배열을 포인터 변수에 받아 쓸 수도 있다. `int *pa = arr;`와 `int *pa = &arr[0];`은 같은 뜻이다.

**배열 이름과 포인터의 차이.** 포인터 `pa`는 변수라서 `pa = arr + 2;`나 `pa++`처럼 다른 칸을 가리키게 바꿀 수 있다. 배열 이름 `arr`는 변수가 아니다. `arr = pa;`나 `arr++`는 컴파일 오류다[^s2]. 크기를 물어도 답이 다르다. `int arr[8]`에서 `sizeof arr`는 배열 전체인 32이고, `sizeof pa`는 포인터 하나의 크기다[^s1].

**쓸 수 있는 번호.** `int arr[8]`의 칸은 `arr[0]`부터 `arr[7]`까지다. C는 번호가 범위 안인지 검사하지 않는다. 범위 밖 번호를 쓰면 위 식이 그대로 계산되어 배열 옆의 남의 칸을 읽거나 고친다[^s2].


## 문자 배열과 문자 포인터

문자열은 글자를 차례로 놓고 맨 끝에 끝 표시 `'\0'`을 붙인 `char` 배열이다. 같은 문자열로 시작해도 두 선언은 다른 것을 만든다.

```c
char amessage[] = "now is the time";    /* 배열 */
char *pmessage = "now is the time";     /* 포인터 */
```

```
amessage  [n][o][w][ ][i][s][ ][t][h][e][ ][t][i][m][e][\0]      16칸. 글자가 이 배열 안에 들어 있다

pmessage  [ 주소 ] ----> [n][o][w][ ][i][s] ... [m][e][\0]        글자는 다른 곳(문자열 상수)에 있다
```

- `amessage`는 배열이다. 글자들과 `'\0'`을 담을 만큼만 크다. 글자 15개에 `'\0'` 하나라서 16바이트다.
- `pmessage`는 포인터다. 문자열 상수를 가리키도록 처음 값을 넣었고, 나중에 다른 곳을 가리키게 바꿀 수 있다.

| 줄 | 되는가 | 까닭 |
|---|---|---|
| `amessage[0] = 'N';` | 된다 | 배열의 칸은 내 것이다 |
| `amessage = "later";` | 컴파일 오류 | 배열 이름은 다른 곳을 가리키게 바꿀 수 없다 |
| `pmessage = "later";` | 된다 | 포인터는 변수다 |
| `pmessage[0] = 'N';` | 컴파일은 되지만 쓰면 안 된다 | 문자열 상수의 글자를 고친 결과는 정해져 있지 않다 |

마지막 줄은 이 문서를 확인한 기계에서 프로그램이 죽었다[^s2]. 고칠 일이 없는 문자열을 가리킬 때는 `const char *`로 선언해 두면 컴파일러가 이런 줄을 막아 준다.

### 문자열 함수 두 판

문자열 `t`를 `s`로 베끼는 함수를 두 가지로 쓴다. 표준 라이브러리의 `strcpy`와 이름이 겹치지 않게 `copy_a`, `copy_b`라 부른다.

```c
/* A: 번호로 쓴 판 */
void copy_a(char *s, const char *t)
{
    int i;
    i = 0;
    while ((s[i] = t[i]) != '\0')
        i++;
}

/* B: 포인터로 쓴 판 */
void copy_b(char *s, const char *t)
{
    while ((*s = *t) != '\0') {
        s++;
        t++;
    }
}
```

둘이 하는 일은 같다. 다른 것은 다음 글자로 가는 방법이다. A는 `s`와 `t`를 그대로 두고 번호 `i`를 올린다. B는 `s`와 `t` 자체를 한 칸씩 옮긴다. `s`와 `t`는 주소를 베껴 받은 것이라([포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)) 옮겨도 부른 쪽의 포인터는 그대로다[^s3].

`(*s = *t) != '\0'`은 두 가지를 한다. 글자 하나를 베끼고, 방금 베낀 글자가 끝 표시인지 본다. 그래서 `'\0'`까지 베낀 다음에 멈춘다. B가 `"hi"`를 베끼는 과정이다[^s3].

| 바퀴 | 베낀 글자 | 계속하는가 |
|---|---|---|
| 1 | `'h'` | 계속. `s`와 `t`를 한 칸 옮긴다 |
| 2 | `'i'` | 계속. `s`와 `t`를 한 칸 옮긴다 |
| 3 | `'\0'` | 멈춘다 |

글자를 세 번 베끼고 포인터를 두 번 옮긴다.


두 문자열을 견주는 함수도 두 가지로 쓴다.

```c
/* 번호로 쓴 판 */
int compare_a(const char *s, const char *t)
{
    int i;
    for (i = 0; s[i] == t[i]; i++)
        if (s[i] == '\0')
            return 0;
    return s[i] - t[i];
}

/* 포인터로 쓴 판 */
int compare_b(const char *s, const char *t)
{
    for (; *s == *t; s++, t++)
        if (*s == '\0')
            return 0;
    return *s - *t;
}
```

글자가 같은 동안 앞으로 간다. 같은 채로 `'\0'`에 닿으면 두 문자열이 같으니 0을 돌려준다. 다른 글자를 만나면 그 두 글자의 차를 돌려준다. `"abc"`와 `"abd"`는 셋째 글자에서 갈리고 `'c' - 'd'`는 $$-1$$이다. 음수면 `s`가 사전에서 앞이고, 양수면 뒤다[^s3].

## 활용

- **어느 칸이든 같은 시간에 읽는다.** 칸의 주소가 계산 한 번으로 나오기 때문이다. 대신 가운데에 끼우거나 빼려면 뒤의 칸을 모두 옮겨야 한다: [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)
- **흔한 실수.** `n`칸 배열에서 `a[n]`을 쓴다. 받을 배열이 원본보다 작은데 복사한다. 복사 함수는 받을 쪽이 몇 칸인지 모른다. 함수가 인자로 받은 배열에 `sizeof`를 써서 칸 수를 구하려 한다. 함수가 받은 것은 주소 하나라서 포인터의 크기가 나온다[^s2].
- 표를 배열에 담는 법: [행 우선 배치와 열 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/)
- 칸이 모자랄 때 늘리는 법: [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)
- 연습: [포인터와 주소 계산 연습](/Hongs_Blog/studies/data-structures/pointer-address-practice/)

## 연결

- 선수: [포인터](/Hongs_Blog/studies/data-structures/c-pointer/)
- "시작 주소 + 번호 × 4"를 기계어 명령으로 쓰는 모습: [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/)
- 칸이 붙어 있어서 차례로 읽으면 빠른 까닭: [지역성의 원리](/Hongs_Blog/studies/computer-architecture/locality-principle/)
- 자바의 배열은 길이를 함께 적어 두고 범위 밖 번호를 실행 중에 잡아낸다: [배열](/Hongs_Blog/studies/java/java-array/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `int arr[10]`의 `arr[0]`이 100번지에 있다. `arr[3]`의 주소는? 같은 100번지에서 시작하는 `double` 배열과 `char` 배열이라면 3번 칸의 주소는 각각 얼마인가?</summary>

**답:** `int`는 112, `double`은 124, `char`는 103.<br>
**이유:** 주소 = 시작 + 번호 × 칸 크기다. 칸 크기가 4, 8, 1바이트라서 $$100 + 3 \times 4$$, $$100 + 3 \times 8$$, $$100 + 3 \times 1$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `int a[6] = {5, 6, 7, 8, 9, 10}; int *p = a + 1;`일 때 `*(p + 2)`를 `a`의 배열 식으로 바꿔 쓰고 값을 구하라. `p[-1]`은 어느 칸인가?</summary>

**답:** `*(p + 2)`는 `a[3]`이고 값은 8이다. `p[-1]`은 `a[0]`이고 값은 5다.<br>
**이유:** `p`는 `a[1]`을 가리킨다. 거기서 두 칸 뒤는 `a[3]`, 한 칸 앞은 `a[0]`이다. `p[k]`는 `*(p + k)`와 같아서 음수 번호도 같은 식으로 계산된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `char amessage[] = "now is the time";`과 `char *pmessage = "now is the time";`이 있다. (가) `amessage[0] = 'N';` (나) `amessage = "later";` (다) `pmessage = "later";` (라) `pmessage[0] = 'N';` 가운데 써도 되는 줄은? 나머지는 왜 안 되는가?</summary>

**답:** (가)와 (다).<br>
**이유:** `amessage`는 글자를 담은 배열이라 칸을 고칠 수 있지만(가), 배열 이름을 다른 문자열로 바꿀 수는 없다(나, 컴파일 오류). `pmessage`는 포인터라 다른 곳을 가리키게 할 수 있지만(다), 가리키는 문자열 상수의 글자를 고친 결과는 정해져 있지 않다(라).

</details>


[^s1]: 구현 코드에서 확인했다. 이 기계에서 포인터 하나는 8바이트다.
[^s2]: `arr = pa;`, `arr++`, `amessage = "later";`가 컴파일 오류인 것과 `pmessage[0] = 'N';`이 컴파일은 되고 실행 중에 죽는 것은 따로 돌려 확인했다(Apple clang 21, macOS).
[^s3]: 함수 이름을 `copy_a`, `copy_b`, `compare_a`, `compare_b`로 바꾸고 읽기만 하는 인자에 `const`를 붙였다. 구현 코드로 확인했다. 표준 `strcmp`는 결과의 부호만 약속하므로 부호를 견줬다.
{% endraw %}
