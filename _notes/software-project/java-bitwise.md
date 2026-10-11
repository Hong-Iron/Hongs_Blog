---
layout: "note"
title: "비트 연산"
display_title: "비트 연산 (Bitwise Operations)"
kind: "concept"
kind_label: "기법"
num: "05"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Bitwise Operator", "비트 연산자", "비트 논리 연산자", "Bitwise Logical Operator", "비트 AND", "비트 OR", "비트 XOR", "비트 NOT", "시프트 연산자", "비트 이동 연산자", "Shift Operator", "산술 시프트", "Arithmetic Shift", "논리 시프트", "Logical Shift", "비트 마스크", "Bit Mask"]
description: "컴퓨터 속의 정수는 켜짐과 꺼짐을 나타내는 스위치가 한 줄로 늘어선 것이다. 비트 연산은 수를 크기로 보지 않고 이 스위치 줄로 보아, 같은 자리의 스위치끼리 짝지어 계산하거나 줄 전체를 옆으로 민다. 스위치 하나하나를 따로 켜고 끄고 확인할 수 있고, 2를 곱하거나 나누는 일을 …"
prev_url: "/studies/software-project/java-operators/"
prev_title: "연산자와 오버플로"
next_url: "/studies/software-project/java-control-flow/"
next_title: "제어문"
math: true
mermaid: false
code_count: 1
permalink: "/studies/software-project/java-bitwise/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컴퓨터 속의 정수는 켜짐과 꺼짐을 나타내는 스위치가 한 줄로 늘어선 것이다. 비트 연산은 수를 크기로 보지 않고 이 스위치 줄로 보아, 같은 자리의 스위치끼리 짝지어 계산하거나 줄 전체를 옆으로 민다. 스위치 하나하나를 따로 켜고 끄고 확인할 수 있고, 2를 곱하거나 나누는 일을 빠르게 한다. 정수에만 쓸 수 있고, 음수를 오른쪽으로 밀 때는 빈자리를 무엇으로 채우느냐에 따라 답이 전혀 달라진다.

</div>


## 예시로 보기

파일 하나에 "읽기 가능, 쓰기 가능, 실행 가능"을 적어 두려 한다. `boolean` 변수 셋을 둘 수도 있다. 하지만 예/아니오 하나는 스위치 하나, 곧 1비트면 충분하다. 정수 하나의 비트 셋에 나눠 담으면 변수 하나로 끝난다. 그러려면 정수의 특정 비트만 건드리는 연산이 필요하다.

슬라이드가 묻는 `45 & 25`부터 푼다[^1]. 두 수를 2진수로 적고 같은 자리끼리 본다. 둘 다 1인 자리만 1이다.

```
  45 = 0 0 1 0 1 1 0 1
  25 = 0 0 0 1 1 0 0 1
       ---------------  &  (둘 다 1일 때만 1)
       0 0 0 0 1 0 0 1  = 9
```

45는 $$32 + 8 + 4 + 1$$이고 25는 $$16 + 8 + 1$$이다. 둘에 모두 있는 것은 8과 1이라 답이 $$8 + 1 = 9$$다. 10진수를 2진수로 바꾸는 법은 [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 45와 25의 네 가지 연산과 비트 모양, $$\sim x = -x - 1$$(−1000 ~ 1000 전수), 시프트 표의 값, $$x \ll s = x \cdot 2^s$$와 $$x \gg s$$ = 내림 나눗셈(−200 ~ 200, $$s$$ = 0 ~ 7 전수), 플래그와 색 예제, 카드 C1~C4 — [05_java-bitwise_impl.java](/Hongs_Blog/studies/software-project/code/05_java-bitwise_impl/)</div>

</div>


## 비트 논리 연산

비트 하나하나에 논리 연산을 한다. 1을 참, 0을 거짓으로 보면 [논리 연산자](/Hongs_Blog/studies/software-project/java-operators/)와 규칙이 같다[^2].

| 연산 | 기호 | 결과 비트가 1인 때 | 45와 25로 하면 |
|---|---|---|---|
| AND | `&` | 두 비트가 모두 1 | `00001001` = 9 |
| OR | `\|` | 두 비트 중 하나라도 1 | `00111101` = 61 |
| XOR | `^` | 두 비트가 서로 다름 | `00110100` = 52 |
| NOT | `~` | 원래 비트가 0 (모든 비트를 뒤집는다) | `~45` = `11010010` = −46 |

`~45`가 왜 −46일까? 모든 비트를 뒤집으면 맨 앞의 부호 비트도 1이 되어 음수가 된다. 자바가 음수를 적는 방식에서는 "비트를 모두 뒤집고 1을 더한 것"이 부호를 바꾼 수다. 그래서 뒤집기만 한 것은 부호를 바꾼 수보다 1 작다. 식으로는 `~x`가 늘 $$-x - 1$$이다[^s1]. 45를 넣으면 $$-45 - 1 = -46$$이다. 자세한 것은 [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)에 있다.

피연산자는 정수 타입(`byte`, `short`, `int`, `long`)만 된다. `float`와 `double`은 안 된다[^2]. `1.5 & 1`은 `bad operand types for binary operator '&'`라는 컴파일 오류다[^s1]. `byte`와 `short`는 [타입 변환](/Hongs_Blog/studies/software-project/java-type-conversion/)에서 본 대로 `int`로 바뀐 뒤 계산되므로 결과는 `int`다.

## 시프트 연산

비트 줄 전체를 왼쪽이나 오른쪽으로 민다[^3].

| 식 | 하는 일 | 빈자리 |
|---|---|---|
| `a << b` | 비트를 왼쪽으로 `b`칸 민다 | 오른쪽 빈자리를 0으로 채운다 |
| `a >> b` | 비트를 오른쪽으로 `b`칸 민다 | 왼쪽 빈자리를 맨 앞 비트(부호 비트)와 같은 값으로 채운다 |
| `a >>> b` | 비트를 오른쪽으로 `b`칸 민다 | 왼쪽 빈자리를 0으로 채운다 |

`1 << 3`을 따라가 본다. `int`는 32비트지만 아래 8비트만 그린다[^3].

```
 1      = ... 0 0 0 0 0 0 0 1
 1 << 3 = ... 0 0 0 0 1 0 0 0  = 8
              (왼쪽 끝에서 밀려난 3비트는 버리고, 오른쪽 빈 3칸은 0)
```

10진수에서 숫자를 왼쪽으로 한 칸 밀고 0을 붙이면 10배가 된다. 2진수에서는 2배다. 그래서 왼쪽으로 `b`칸 밀면 $$2^b$$를 곱한 것과 같다. $$1 \times 2^3 = 8$$이다[^3].

오른쪽으로 미는 연산이 둘인 것은 음수 때문이다. −8을 오른쪽으로 한 칸 밀어 본다.

```
 -8       = 1 1 1 1 ... 1 1 1 1 1 0 0 0
 -8 >> 1  = 1 1 1 1 ... 1 1 1 1 1 1 0 0  = -4          (빈자리를 부호 비트 1로)
 -8 >>> 1 = 0 1 1 1 ... 1 1 1 1 1 1 0 0  = 2147483644  (빈자리를 0으로)
```

`>>`는 부호를 지켜 준다. `>>>`는 부호 비트 자리에 0이 들어와 아주 큰 양수가 된다. 양수에서는 둘의 답이 같다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.12 표의 `a >> b` 설명 "a / 2^b와 동일한 결과가 됨" / 문제점: `a`가 음수이고 $$2^b$$로 나누어떨어지지 않으면 다르다. 자바의 `/`는 0 쪽으로 버리고 `>>`는 작은 쪽으로 내린다. / 수정안: "a를 $$2^b$$로 나눈 뒤 내림한 값. a가 0 이상이면 a / 2^b와 같다" / 근거: `-7 >> 1`은 −4, `-7 / 2`는 −3이다. −200 ~ 200의 모든 정수에서 `x >> s`가 `Math.floorDiv(x, 1 << s)`와 같았다(구현 코드 2번).

</div>


## 예제

**비트 하나를 켜고, 끄고, 확인하고, 뒤집기.** 처음의 파일 권한을 만든다. 읽기를 0번 비트, 쓰기를 1번 비트, 실행을 2번 비트로 정한다[^s2].

```java
final int READ = 1 << 0;   // 001 = 1
final int WRITE = 1 << 1;  // 010 = 2
final int EXEC = 1 << 2;   // 100 = 4

int flags = 0;
flags |= READ;             // 켜기: 001
flags |= EXEC;             // 켜기: 101 = 5
boolean canWrite = (flags & WRITE) != 0;   // 확인: false
flags &= ~READ;            // 끄기: 100 = 4
flags ^= WRITE;            // 뒤집기: 110 = 6
```

| 하고 싶은 일 | 쓰는 식 | 까닭 |
|---|---|---|
| 켜기 | `flags \| 비트` | OR은 한쪽이 1이면 1이다. 다른 자리는 0과 OR이라 그대로다 |
| 끄기 | `flags & ~비트` | `~비트`는 그 자리만 0이다. AND라 그 자리만 0이 된다 |
| 확인 | `(flags & 비트) != 0` | 그 자리만 남기고 다 지운 뒤 0인지 본다 |
| 뒤집기 | `flags ^ 비트` | XOR은 1과 만나면 뒤집히고 0과 만나면 그대로다 |

**여러 비트를 묶어 꺼내기.** 색을 `0xRRGGBB`처럼 정수 하나에 담았을 때 초록 성분만 꺼낸다. 초록은 가운데 8비트다. 오른쪽으로 8칸 밀어 맨 아래로 내린 뒤, 아래 8비트만 남긴다[^s2].

```java
int color = 0x3B82C4;
int green = (color >> 8) & 0xFF;   // 0x82 = 130
```

**경계 사례.** 시프트도 넘친다. `1 << 31`은 부호 비트 자리에 1이 들어가 `int`의 최솟값이 된다. `int`를 32칸 이상 밀 때 자바는 칸 수를 32로 나눈 나머지만 쓴다. 그래서 `1 << 32`는 0이 아니라 1이다. `long`으로 밀려면 `1L << 32`로 쓴다[^s1].

## 활용

- 이 기법을 떠올릴 신호: 예/아니오 여러 개를 한 값에 담는다, 값 하나에서 몇 비트만 떼어 낸다, 2의 거듭제곱을 곱하거나 나눈다.
- 짝수와 홀수는 맨 아래 비트로 가른다. `(n & 1) == 1`이면 홀수다. `n % 2 == 1`은 음수 홀수에서 `false`가 되지만(`-7 % 2`는 −1) 이 식은 음수에서도 맞다[^s1].
- 흔한 실수: `flags & WRITE == 0`이라고 쓴다. `==`가 `&`보다 먼저라 `flags & (WRITE == 0)`이 되어 컴파일 오류다. `(flags & WRITE) == 0`처럼 괄호를 친다.
- 흔한 실수: `byte`에 `>>>`를 쓴다. `byte`가 `int`로 바뀔 때 앞이 부호 비트로 채워져 있어 기대와 다른 값이 나온다. `byte b = -16`일 때 `b >>> 4`는 268,435,455다. 먼저 `b & 0xFF`로 아래 8비트만 남기면 `(b & 0xFF) >>> 4`는 15다[^s1].

## 연결

- 선수: [연산자와 오버플로](/Hongs_Blog/studies/software-project/java-operators/), [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 음수의 비트 모양과 부호 비트: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- AND, OR, XOR, NOT을 회로로 만든 것: [불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/)

## 과목별 관점

**어셈블리어 (2-1학기).** Java의 비트 연산자 일곱 개는 x86 CPU의 명령 하나씩과 짝이 맞는다[^as1].

| Java | x86 명령 | 빈자리를 채우는 것 |
|---|---|---|
| `&`, `\|`, `^`, `~` | `AND`, `OR`, `XOR`, `NOT` | |
| `<<` | `SHL` (`SAL`도 같은 명령이다) | 오른쪽을 0으로 |
| `>>` | `SAR` | 왼쪽을 부호 비트로 |
| `>>>` | `SHR` | 왼쪽을 0으로 |

강의는 빈자리를 0으로 채우는 밀기를 논리 시프트, 부호 비트를 베껴 채우는 밀기를 산술 시프트라 부른다. 산술 시프트는 수의 부호를 지킨다[^a1]. 슬라이드의 예로 `mov dl,-80` 뒤에 `sar dl,1`을 하면 −40, 이어서 `sar dl,2`를 하면 −10이다. `mov dl,80` 뒤의 `shr dl,1`은 40이다[^a2]. 자세한 것은 [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/)과 [논리 시프트와 산술 시프트 비교](/Hongs_Blog/studies/assembly-language/logical-vs-arithmetic-shift/)에 있다.

어셈블리어 쪽에만 있는 것이 둘 있다.

- **밀려 나간 비트가 남는다.** Java에서는 밖으로 밀려난 비트가 그냥 사라진다. CPU에서는 마지막으로 밀려난 비트가 올림 플래그 CF에 들어간다[^a1].
- **결과가 0인지가 따로 남는다.** `AND`, `OR`, `XOR`은 결과가 0이면 ZF라는 표시를 켠다. 그래서 위의 `(flags & WRITE) != 0`을 어셈블리어로는 값을 바꾸지 않고 AND만 해 보는 `test` 한 줄과 "0이 아니면 가라"는 `jnz` 한 줄로 쓴다[^a3]. 명령마다의 쓰임은 [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/)과 [TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/)에 있다.

위 경계 사례의 "`int`를 32칸 이상 밀면 칸 수를 32로 나눈 나머지만 쓴다"도 CPU에서 온 것이다. x86의 시프트 명령은 32비트 값을 밀 때 칸 수의 아래 5비트만 본다[^as1].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `12 & 10`, <code>12 &#124; 10</code>, `12 ^ 10`, `~12`의 값을 2진수로 풀어 구하라.</summary>

**답:** 12 = `1100`, 10 = `1010`. `&`는 `1000` = 8, <code>&#124;</code>는 `1110` = 14, `^`는 `0110` = 6, `~12`는 −13.<br>
**이유:** `~x`는 $$-x - 1$$이다. `~12`를 `0011` = 3이라고 쓰는 오답이 많다. `int`는 32비트라 앞의 0 스물여덟 개도 모두 1로 뒤집힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 오른쪽 시프트는 왜 `>>`와 `>>>` 둘인가? `-16 >> 2`와 `-16 >>> 28`의 값으로 설명하라.</summary>

**답:** 밀고 난 왼쪽 빈자리를 채우는 방법이 둘이기 때문이다. `>>`는 부호 비트로 채워 부호를 지킨다. `-16 >> 2`는 −4다. `>>>`는 0으로 채워 비트 줄을 그대로 옮긴다. `-16 >>> 28`은 맨 위 4비트 `1111`만 남아 15다.<br>
**이유:** 수의 크기를 반으로 줄이려는 때는 `>>`, 비트 묶음을 꺼내려는 때는 `>>>`를 쓴다. 양수에서는 둘이 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "`a >> 1`은 `a / 2`와 같다"가 틀리는 `a`를 하나 들고 두 값을 쓰라. 어떤 `a`에서 틀리는가?</summary>

**답:** `a = -7`. `-7 >> 1`은 −4, `-7 / 2`는 −3.<br>
**이유:** `/`는 0 쪽으로 버리고(−3.5 → −3) `>>`는 작은 쪽으로 내린다(−3.5 → −4). 음수이면서 홀수일 때만 다르다. `a`가 0 이상이거나 짝수면 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `(1 << 4) - 1`의 값과 비트 모양을 쓰고, 정수 `n`의 아래 4비트만 꺼내는 식을 쓰라.</summary>

**답:** 15, `1111`. `n & ((1 << 4) - 1)` 또는 `n & 0xF`.<br>
**이유:** `1 << 4`는 `10000`이고 1을 빼면 아래 4자리가 모두 1이 된다. 이 값과 AND 하면 아래 4비트만 남고 나머지는 0이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** Java의 `x >> 2`와 `x >>> 2`를 x86 명령으로 옮기면 각각 무엇인가? 8비트 레지스터 AL에 F0h(부호 있게 읽으면 −16)가 있을 때 두 명령의 결과를 16진수로 쓰라.</summary>

**답:** `>>`는 `sar al,2`, `>>>`는 `shr al,2`. `SAR`의 결과는 FCh(−4), `SHR`의 결과는 3Ch(60).<br>
**이유:** F0h는 `1111 0000`이다. `SAR`은 왼쪽 빈자리 둘을 부호 비트 1로 채워 `1111 1100`, `SHR`은 0으로 채워 `0011 1100`이 된다. 부호를 지키려면 `SAR`, 비트 줄을 그대로 옮기려면 `SHR`이다[^as1].

</details>


[^1]: 소프트웨어 프로젝트 3회 강의 자료 「Software Project 03. Java Language Basics (2)」, p.11 (45 & 25 = ?)
[^2]: 같은 자료, p.10 (비트 논리 연산자 표, 피연산자 제한)
[^3]: 같은 자료, p.12 (시프트 연산자 표, 1 << 3 그림)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `45 & 25`의 풀이, 45와 25의 OR·XOR·NOT 값, `~x`가 $$-x - 1$$인 이유, −8을 미는 그림, 경계 사례, 활용 항목, 카드 C1~C4는 원본에 없다. 값은 구현 코드로, 컴파일 오류 메시지는 JDK 21에서 직접 컴파일해 확인했다. 원본은 피연산자를 `byte`, `short`, `int`, `long`으로 적는데 `char`도 된다. 규칙은 Java Language Specification §15.19(시프트), §15.22(비트 논리)에 있다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 파일 권한 예와 색 예는 원본에 없다. 구현 코드로 확인했다.
[^a1]: 어셈블리어 10회 강의 자료 「wk10-chapt_07-3-1」, p.4~5 (논리 시프트와 산술 시프트, 밀려난 비트가 CF로 가는 그림); p.6, p.8~9 (SHL, SHR, SAL·SAR)
[^a2]: 같은 자료, p.8~9 (80을 SHR, −80을 SAR 하는 예)
[^a3]: 어셈블리어 7회 강의 자료 「wk07-chapt_06-3-2」, p.5~8 (AND, OR, XOR, NOT 명령); p.14 (TEST 뒤 JNZ)
[^as1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> Java 연산자와 x86 명령을 짝지은 표, 칸 수의 아래 5비트만 본다는 점, 카드 C5는 원본에 없다. 표의 짝은 −16, −8, −7, −1, 0, 1, 7, 45, `int`의 최댓값·최솟값을 0~31칸 밀어 Java의 정의(Java Language Specification §15.19)와 x86 명령의 흉내가 같은 값을 내는지 [29_bitwise-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/29_bitwise-instructions_verify/)로 확인했다(파이썬 흉내. 실제 CPU 명령을 돌린 것이 아니다). 칸 수를 5비트로 자르는 것은 Intel 64 and IA-32 Architectures Software Developer's Manual 2권의 SAL/SAR/SHL/SHR 항목에 있다.
{% endraw %}
