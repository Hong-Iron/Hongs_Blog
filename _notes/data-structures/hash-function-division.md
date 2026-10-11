---
layout: "note"
title: "나눗셈 해시 함수"
display_title: "나눗셈 해시 함수 (Hashing By Division)"
kind: "concept"
kind_label: "기법"
num: "48"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Hashing By Division", "Division Method", "나눗셈 방법", "제산법", "해시 함수", "Hash Function", "균등 해시 함수", "Uniform Hash Function", "나누는 수", "Divisor", "stringToInt"]
description: "키를 칸 번호로 바꾸는 가장 흔한 방법은, 키를 수로 바꾼 뒤 칸의 개수로 나눈 나머지를 쓰는 것이다. 계산이 빠르고 나머지는 늘 칸 번호 범위 안에 든다. 다만 실제 자료의 키는 짝수가 많다거나 5씩 건너뛴다거나 하는 버릇이 있어서, 칸의 개수가 2나 5 같은 작은 수로 나누어떨…"
prev_url: "/studies/data-structures/hash-table-terms/"
prev_title: "해시 테이블의 홈 버킷과 충돌"
next_url: "/studies/data-structures/linear-probing/"
next_title: "선형 탐사"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/hash-function-division/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

키를 칸 번호로 바꾸는 가장 흔한 방법은, 키를 수로 바꾼 뒤 칸의 개수로 나눈 나머지를 쓰는 것이다. 계산이 빠르고 나머지는 늘 칸 번호 범위 안에 든다. 다만 실제 자료의 키는 짝수가 많다거나 5씩 건너뛴다거나 하는 버릇이 있어서, 칸의 개수가 2나 5 같은 작은 수로 나누어떨어지면 그 버릇이 칸 번호에 그대로 남아 일부 칸에만 몰린다. 그래서 칸의 개수는 홀수, 되도록 소수로 잡는다.

</div>


## 예시로 보기

[해시 테이블](/Hongs_Blog/studies/data-structures/hash-table-terms/)은 키들이 버킷에 고르게 흩어져야 빠르다. 같은 버킷에 몰리면 넘침이 잦아진다. 어떤 수로 나누느냐에 따라 흩어지는 모양이 달라진다.

키 20, 30, 8, 15, 3, 23을 14로 나눈 나머지와 15로 나눈 나머지다[^1].

| 키 | 20 | 30 | 8 | 15 | 3 | 23 |
|---|---|---|---|---|---|---|
| 키의 홀짝 | 짝 | 짝 | 짝 | 홀 | 홀 | 홀 |
| 14로 나눈 나머지 | 6 | 2 | 8 | 1 | 3 | 9 |
| 15로 나눈 나머지 | 5 | 0 | 8 | 0 | 3 | 8 |

14로 나누면 짝수 키는 짝수 버킷으로만, 홀수 키는 홀수 버킷으로만 간다. 키가 모두 짝수라면 버킷의 절반은 영영 비어 있다. 15로 나누면 홀짝이 섞인다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문자열을 수로 바꾸는 고친 코드와 슬라이드 코드의 값, 두 글자 문자열 9,025쌍이 모두 다른 수가 되는 것, 위 나머지 12개를 컴파일해 실행(ASan·UBSan) — [48_hash-function-division_impl.c](/Hongs_Blog/studies/data-structures/code/48_hash-function-division_impl/). 나누는 수에 따른 버킷 치우침 세기(짝수 키, 5의 배수 키, 홀수가 90%인 키) — [48_hash-function-division_verify.py](/Hongs_Blog/studies/data-structures/code/48_hash-function-division_verify/)</div>

</div>


## 정의

해시 함수는 두 부분으로 이루어진다[^2].

1. 키가 정수가 아니면 0 이상인 정수로 바꾼다. 슬라이드는 이 일을 하는 함수를 `hash()`라 부른다.
2. 그 정수를 홈 버킷 번호로 바꾼다. 결과 $$f(k)$$는 0 이상 $$b - 1$$ 이하의 정수이고, $$b$$는 버킷의 수다.

### 문자열을 정수로

글자 하나는 1바이트, `int`는 4바이트다. 두 글자짜리 문자열은 첫 글자를 아래 8비트에, 둘째 글자를 그 위 8비트에 놓으면 서로 다른 문자열이 서로 다른 수가 된다[^3].

```c
number = key[0];
number += ((int) key[1]) << 8;      /* << 8은 256을 곱하는 것과 같다 */
```

`"ab"`는 $$97 + 98 \times 256 = 25{,}185$$다('a'의 글자 번호가 97, 'b'가 98).

더 긴 문자열은 글자를 두 개씩 묶어 이런 수를 만들고 모두 더한다[^4].

```c
unsigned int string_to_int(const char *key)
{
    const unsigned char *p = (const unsigned char *)key;
    unsigned int number = 0;
    while (*p) {
        number += *p++;                           /* 묶음의 첫 글자 */
        if (*p)
            number += ((unsigned int)*p++) << 8;  /* 묶음의 둘째 글자 */
    }
    return number;
}
```

`*p++`는 `p`가 가리키는 글자를 읽고 나서 `p`를 다음 글자로 옮긴다. 문자열 끝의 `'\0'`을 만나면 `*p`가 0이라 반복이 끝난다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: `stringToInt(char *key) { int number = 0; while(*key) { number += *key++; if (*key) number += ((int) *key++) <<8; } return number; }` (p.12) / 문제점: ① 함수의 반환형이 없다. C99부터는 컴파일 오류다. ② 글자를 `char` 그대로 더한다. `char`에 부호가 있는 컴퓨터에서는 한글처럼 바이트 값이 128 이상인 글자가 음수로 읽혀 결과가 음수가 될 수 있고, C에서 음수를 나눈 나머지는 음수라 버킷 번호로 쓸 수 없다 / 수정안: 반환형을 붙이고 글자를 `unsigned char`로 읽는다(위 코드) / 근거: 슬라이드 그대로는 `cc -std=c11`에서 "type specifier missing" 오류로 컴파일되지 않는다. 반환형 `int`만 붙여 돌리면 `"\xEA"` 한 글자가 −22가 되고 $$-22 \bmod 17$$이 C에서 −5로 나온다.

</div>


두 글자까지는 서로 다른 문자열이 서로 다른 수가 되지만, 세 글자부터는 겹친다. 묶음끼리 더하기 때문에 묶음의 순서가 바뀌어도 합이 같다. `"abc"`와 `"cba"`는 둘 다 25,284다[^s1]. 슬라이드는 "네 글자보다 긴 문자열은 겹치지 않는 정수로 바꿀 수 없다"고 적는데[^3], 그것은 4바이트에 글자 네 개까지만 들어간다는 뜻이고, 위 코드는 그보다 일찍 겹친다. 겹쳐도 틀린 것은 아니다. 겹친 키들이 동의어가 될 뿐이다.

### 나머지로 홈 버킷 정하기

가장 흔한 방법이 나눗셈이다[^5].

```c
homeBucket = hash(theKey) % divisor;
```

나누는 수 `divisor`는 버킷의 수 $$b$$와 같게 둔다. 0 이상인 수를 $$b$$로 나눈 나머지는 0 이상 $$b$$ 미만이므로 $$0 \le \text{homeBucket} < b$$다. 기호로 쓰면 $$f(k) = k \bmod b$$다.

### 고르게 흩는 해시 함수

있을 수 있는 모든 키의 모음을 키 공간(keySpace)이라 하자. 버킷마다 거의 같은 수의 키가 가도록 흩는 해시 함수를 **균등 해시 함수**(uniform hash function)라 부른다. 같은 말로, 아무 키나 하나 뽑았을 때 그 키의 홈 버킷이 $$i$$번일 확률이 모든 $$i$$에서 $$\frac1b$$다. 키가 무작위로 들어온다면 이런 함수가 넘침이 일어날 가능성을 가장 작게 한다[^6].

키 공간이 `int` 전체라면 나눗셈 방법은 어떤 $$b$$에서든 균등하다. 버킷마다 약 $$\frac{2^{32}}{b}$$개의 정수가 간다[^7]. 그런데 실제로 들어오는 키는 그 가운데 일부이고, 서로 닮은 데가 있다. 그래서 $$b$$를 무엇으로 잡느냐가 흩어지는 모양을 바꾼다[^7].

### 나누는 수 고르기

- **짝수는 쓰지 않는다.** 실제 키는 홀수 쪽이나 짝수 쪽으로 치우치기 쉽다. $$b$$가 짝수면 홀수 키는 홀수 버킷으로, 짝수 키는 짝수 버킷으로만 가서 그 치우침이 버킷에 그대로 옮겨진다. $$b$$가 홀수면 홀수 키든 짝수 키든 아무 버킷에나 갈 수 있다[^8].
- **3, 5, 7 같은 작은 소수의 배수도 피한다.** 비슷한 치우침이 생긴다. $$b$$를 나누는 소수 $$p$$가 클수록 그 영향은 작아진다[^9].
- **가장 좋은 것은 소수다.** 아니면 20보다 작은 소인수가 없는 수를 고른다[^9].

까닭은 나머지의 성질 하나다. $$b$$가 $$p$$의 배수이면, 키를 $$b$$로 나눈 나머지를 다시 $$p$$로 나눈 나머지는 키를 $$p$$로 나눈 나머지와 같다[^s1].

$$b = p \cdot m \text{이면} \quad (k \bmod b) \bmod p = k \bmod p$$


<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">이 식이 맞는 까닭</summary>

$$k$$를 $$b$$로 나눈 몫을 $$q$$, 나머지를 $$r$$이라 하면 $$k = qb + r$$이다. $$b = pm$$을 넣으면 $$k = (qm)p + r$$이다. $$k$$와 $$r$$의 차이가 $$p$$의 배수이므로 둘을 $$p$$로 나눈 나머지가 같다([나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)).<br>
작은 수로 보면 $$k = 23$$, $$b = 14$$, $$p = 2$$일 때 $$23 \bmod 14 = 9$$이고 $$9 \bmod 2 = 1 = 23 \bmod 2$$다.

</details>


그래서 키들이 "$$p$$로 나눈 나머지가 같다"는 버릇을 가지면, 버킷 번호도 $$p$$로 나눈 나머지가 같은 것만 나온다. 버킷 $$b$$개 가운데 $$\frac bp$$개만 쓰인다.

| 키 1,000개 | $$b = 14$$ | $$b = 15$$ | $$b = 17$$ |
|---|---|---|---|
| 모두 짝수 | 짝수 버킷 7개만 | 15개 모두 | 17개 모두 |
| 모두 5의 배수 | 14개 모두 | 버킷 0, 5, 10의 3개만 | 17개 모두 |

위 표의 $$b = 15$$ 줄에서도 5의 배수인 20, 30, 15가 5, 0, 0으로 갔다. 17은 소수라 어느 쪽 버릇도 남지 않는다[^s1].

## 활용

- 적용 조건: 키를 0 이상인 정수로 바꿀 수 있을 때. 버킷 수 $$b$$를 고를 수 있어야 한다.
- 구현: [48_hash-function-division_impl.c](/Hongs_Blog/studies/data-structures/code/48_hash-function-division_impl/)
- 버킷 수를 정하는 계산에서 마지막 한 걸음이 이 규칙이다. 필요한 크기 이상에서 소수를 고른다: [적재율로 해시 테이블 크기 정하기](/Hongs_Blog/studies/data-structures/load-factor-design/).
- 흔한 실수: 버킷 수를 100이나 1,000처럼 "딱 떨어지는 수"로 잡는 것. 둘 다 2와 5의 배수라서 끝자리가 같은 키들이 같은 버킷에 몰린다. C에서 음수에 `%`를 쓰는 것도 조심한다. 결과가 음수일 수 있다.

## 연결

- 선수: [해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/), [나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/), [포인터](/Hongs_Blog/studies/data-structures/c-pointer/)(`*p++`로 문자열 훑기)
- 소수와 소인수: [소수와 산술의 기본정리](/Hongs_Blog/studies/discrete-math/primes/)
- 파이썬 딕셔너리가 칸 번호를 정하는 법: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 위 `string_to_int`로 `"hi"`를 수로 바꾸고, 버킷이 17개일 때의 홈 버킷을 구하라('h'의 글자 번호는 104, 'i'는 105).</summary>

**답:** $$104 + 105 \times 256 = 26{,}984$$, 홈 버킷은 $$26{,}984 \bmod 17 = 5$$.<br>
**이유:** 첫 글자는 그대로, 둘째 글자는 256을 곱해 더한다. $$17 \times 1{,}587 = 26{,}979$$이고 $$26{,}984 - 26{,}979 = 5$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 키가 모두 10의 배수(10, 20, …, 1000)다. 버킷 수를 20, 25, 23으로 잡을 때 쓰이는 버킷은 각각 몇 개인가? 왜 그런가?</summary>

**답:** 20이면 2개(0번과 10번), 25면 5개(0, 5, 10, 15, 20번), 23이면 23개 모두.<br>
**이유:** 버킷 수가 $$p$$의 배수이면 키를 $$p$$로 나눈 나머지가 버킷 번호에 그대로 남는다. 키가 모두 10의 배수라 2로도 5로도 나누어떨어진다. 20은 10의 배수라 버킷 번호도 10의 배수만 나온다. 25는 5의 배수라 버킷 번호가 5의 배수만 나온다. 23은 소수이고 10과 공통인 소인수가 없어 치우침이 남지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위 `string_to_int`가 같은 수로 바꾸는 서로 다른 세 글자 문자열 한 쌍을 만들어라. 두 글자 문자열 `"ad"`와 `"da"`는 왜 겹치지 않는가?</summary>

**답:** `"adb"`와 `"bda"`. 둘 다 $$97 + 100 \times 256 + 98$$이다. `"ad"`는 $$97 + 100 \times 256$$, `"da"`는 $$100 + 97 \times 256$$으로 다르다.<br>
**이유:** 두 글자는 한 묶음 안에서 자리(1의 자리와 256의 자리)가 달라 순서가 수에 남는다. 세 글자부터는 묶음끼리 더하므로, 첫 묶음의 첫 글자와 둘째 묶음의 첫 글자를 맞바꿔도 합이 같다.

</details>


[^1]: 자료구조 15회 강의 자료 「DS_Week15_Lecture_2024」, p.17~18 (Selecting The Divisor: 14와 15로 나눈 나머지 열두 개)
[^2]: 같은 자료, p.10 (Hash Functions: Two parts)
[^3]: 같은 자료, p.11 (String To Integer: 두 글자 문자열의 코드, "Strings that are longer than 4 characters do not have a unique non-negative int representation.")
[^4]: 같은 자료, p.12 (stringToInt 코드)
[^5]: 같은 자료, p.13 (Map Into A Home Bucket: by division)
[^6]: 같은 자료, p.14~15 (Uniform Hash Function)
[^7]: 같은 자료, p.16 (Hashing By Division)
[^8]: 같은 자료, p.17~18 ("So do not use an even divisor.")
[^9]: 같은 자료, p.19 (작은 소수의 배수, 소수 또는 20보다 작은 소인수가 없는 수)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `"ab"`의 값, 세 글자부터 겹친다는 것과 `"abc"`·`"cba"`의 예, 나머지의 성질과 그 증명, 짝수 키와 5의 배수 키의 버킷 표, 카드 C1~C3은 슬라이드에 없다. 슬라이드는 치우침이 생긴다는 사실과 14·15의 예만 든다. 나머지의 성질은 나눗셈 정리에서 바로 나오고, $$k < 5{,}000$$, $$b \le 60$$에서 모두 확인했다. 수치는 위 두 코드로 확인했다.
{% endraw %}
