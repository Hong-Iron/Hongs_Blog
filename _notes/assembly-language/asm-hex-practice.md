---
layout: "note"
title: "16진 계산과 2의 보수 연습"
display_title: "16진 계산과 2의 보수 연습"
kind: "practice"
kind_label: "연습"
num: "01"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
description: "프로그래머는 변수와 명령어의 주소를 자주 더하고 뺀다. 그래서 16진 계산은 어셈블리어에서 꼭 익혀야 할 기술이다. 여기에 2의 보수와 글자 코드를 읽는 연습을 더해 모았다. 답을 펼치기 전에 종이에 먼저 써 본다."
next_url: "/studies/assembly-language/arithmetic-expression-practice/"
next_title: "산술식을 어셈블리로 옮기기 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/asm-hex-practice/"
---
{% raw %}
프로그래머는 변수와 명령어의 주소를 자주 더하고 뺀다. 그래서 16진 계산은 어셈블리어에서 꼭 익혀야 할 기술이다. 여기에 2의 보수와 글자 코드를 읽는 연습을 더해 모았다. 답을 펼치기 전에 종이에 먼저 써 본다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 여섯 문제와 변형의 답 전부, 8비트 65,536쌍에서 뺄셈 = 2의 보수 덧셈 — [01_asm-hex-practice_p1.py](/Hongs_Blog/studies/assembly-language/code/01_asm-hex-practice_p1/)</div>

</div>


## p1 · 16진 덧셈

`6A + 4B`를 16진수로 계산하라.

사용 개념: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)

풀이 전략: 10진 덧셈과 똑같이 오른쪽 자리부터 더한다. 다른 점은 올림이 생기는 기준이 10이 아니라 16이라는 것뿐이다. 한 자리의 합을 16으로 나눠, 몫은 왼쪽으로 올리고 나머지를 그 자리에 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *아래 자리 더하기:* A + B = 10 + 11 = 21.
2. *16으로 나누기:* 21 ÷ 16 = 1, 나머지 5. 5를 쓰고 1을 올린다.
3. *윗자리 더하기:* 6 + 4 + 올림 1 = 11 = B. 16보다 작으니 올림이 없다.
4. *답:* `B5`.
5. *확인:* 10진수로 106 + 75 = 181 = 11 × 16 + 5.

</details>


변형 문제

- (가) `28 + 58` (나) `7C + 39` (다) `1A2B + 0F9E` (라) 변수 `var1`의 주소가 `00400020`이고 `var1`이 `4Ah`바이트를 차지한다. 바로 다음 변수의 주소는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) `80`. 8 + 8 = 16이라 0을 쓰고 1을 올린다. 2 + 5 + 1 = 8. (나) `B5`. C + 9 = 21 → 5, 올림 1. 7 + 3 + 1 = B. (다) `29C9`. B + E = 25 → 9, 올림 1. 2 + 9 + 1 = 12 → C. A + F = 25 → 9, 올림 1. 1 + 0 + 1 = 2. (라) `0040006A`.

</details>


## p2 · 16진 뺄셈과 변수의 크기

`var1`의 주소는 `00400020`이다. `var1` 바로 다음 변수의 주소는 `0040006A`다. `var1`은 몇 바이트를 차지하는가?

사용 개념: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)

풀이 전략: 변수가 차지하는 바이트 수는 다음 변수의 주소에서 자기 주소를 뺀 값이다. 앞쪽 글자가 같으면 다른 부분만 빼면 된다. 한 자리에서 모자라면 왼쪽 자리에서 1을 빌려 오고, 빌려 온 1은 16으로 친다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *식 세우기:* `0040006A − 00400020`. 앞의 `004000`이 같으므로 `6A − 20`만 계산한다.
2. *아래 자리 빼기:* A − 0 = A.
3. *윗자리 빼기:* 6 − 2 = 4. 빌려 올 일이 없다.
4. *답:* `4Ah`바이트. 10진수로 4 × 16 + 10 = 74바이트.

</details>


변형 문제

- (가) `75 − 47` (나) `C6 − A2` (다) `0100 − 001C` (라) 32비트 정수 배열의 시작 주소가 `00402000`, 배열 바로 다음 변수의 주소가 `00402030`이다. 배열에 정수가 몇 개 들어 있는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) `2E`. 5에서 7을 못 빼므로 16을 빌려 16 + 5 = 21, 21 − 7 = 14 = E. 윗자리는 7 − 1 − 4 = 2. (나) `24`. 빌려 올 일이 없다. (다) `00E4`. 0 − C는 모자라므로 빌려 16 − 12 = 4. 다음 자리는 0 − 1(빌려준 것) − 1이 모자라므로 또 빌려 16 − 2 = 14 = E. 그 윗자리는 1 − 1 = 0. (라) `30h` = 48바이트. 정수 하나가 4바이트이므로 12개.

</details>


## p3 · 정해진 비트 수에 담기는 가장 큰 수

(가) 20비트에 담을 수 있는 가장 큰 부호 없는 정수는? (나) 20비트에 담을 수 있는 가장 큰 양수는(맨 윗비트를 부호로 쓸 때)?

사용 개념: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/), [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)

풀이 전략: $$N$$비트로 만들 수 있는 줄은 $$2^N$$가지다. 부호 없이 쓰면 0부터 $$2^N - 1$$까지다. 맨 윗비트를 부호에 쓰면 양수 쪽에 남는 비트가 $$N - 1$$개라서 $$2^{N-1} - 1$$까지다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 가짓수 세기:* $$2^{20} = 1{,}048{,}576$$가지.
2. *(가) 0을 빼기:* 0부터 세므로 가장 큰 수는 $$2^{20} - 1 = 1{,}048{,}575$$. 16진수로 `FFFFF`(1이 20개).
3. *(나) 부호 비트 떼기:* 남은 비트는 19개. 가장 큰 양수는 $$2^{19} - 1 = 524{,}287$$. 16진수로 `7FFFF`.

</details>


변형 문제

- (가) 12비트의 가장 큰 부호 없는 정수와 가장 큰 양수는? (나) 부호 있는 16비트(word)의 가장 작은 수와 가장 큰 수는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) $$2^{12} - 1 = 4{,}095$$와 $$2^{11} - 1 = 2{,}047$$. (나) −32,768과 +32,767.

</details>


## p4 · 2진 뺄셈을 덧셈으로

2진수 `1001`에서 `0101`을 빼라. 4비트로 계산한다.

사용 개념: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)

풀이 전략: $$A - B$$는 $$A + (-B)$$다. $$-B$$는 $$B$$의 2의 보수, 곧 비트를 모두 뒤집고 1을 더한 것이다. 그러면 뺄셈이 덧셈이 된다. 맨 윗자리 밖으로 나가는 올림은 버린다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *빼는 수 뒤집기:* `0101` → `1010`.
2. *1 더하기:* `1010 + 1 = 1011`. 이것이 −5다.
3. *더하기:* `1001 + 1011 = 1 0100`.
4. *넘친 올림 버리기:* 4비트만 남기면 `0100`.
5. *확인:* 부호 없는 수로 읽으면 9 − 5 = 4 = `0100`.

</details>


`1001`을 부호 있는 4비트 수로 읽으면 −7이고, −7 − 5 = −12는 4비트의 범위(−8~7) 밖이다. 비트 계산은 같지만 결과 `0100`을 4라고 읽으면 틀린다. 어느 약속으로 읽는지에 따라 답이 맞는지가 달라진다[^s1].

변형 문제

- (가) 8비트로 `00001100 − 00000011` (나) 4비트로 `1100 − 0110`

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) `00000011`의 2의 보수는 `11111101`. `00001100 + 11111101 = 1 00001001` → `00001001`(12 − 3 = 9). (나) `0110`의 2의 보수는 `1010`. `1100 + 1010 = 1 0110` → `0110`(부호 없이 12 − 6 = 6).

</details>


## p5 · 부호 있는 수 다섯 가지 바꾸기

부호 있는 수를 다룰 때 할 줄 알아야 하는 다섯 가지다.

(가) 16진수 `6A3D`의 2의 보수를 구하라(16비트). (나) 부호 있는 2진수 `11110000`을 10진수로. (다) 10진수 −43을 8비트 2진수로. (라) −43을 16진수로. (마) 부호 있는 8비트 16진수 `8A`, `C5`, `A2`, `9D`를 10진수로.

사용 개념: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)

풀이 전략: 음수를 읽을 때는 "2의 보수를 구해 크기를 알아낸 뒤 − 부호를 붙인다". 음수를 적을 때는 "양수를 적고 2의 보수를 구한다". 16진수에서 비트를 뒤집는 것은 글자마다 15(F)에서 빼는 것과 같다. 맨 윗글자가 8 이상이면 맨 윗비트가 1이라 음수다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 글자마다 F에서 빼기:* F − 6 = 9, F − A = 5, F − 3 = C, F − D = 2 → `95C2`. *1 더하기:* `95C3`.
2. *(나) 맨 윗비트 보기:* 1이므로 음수. *2의 보수:* `00001111 + 1 = 00010000` = 16. *부호 붙이기:* −16.
3. *(다) 양수 적기:* 43 = `00101011`. *뒤집기:* `11010100`. *1 더하기:* `11010101`.
4. *(라) 네 비트씩 끊기:* `1101 0101` → `D5`.
5. *(마) 맨 윗글자 보기:* 8, C, A, 9는 모두 7보다 크므로 음수. *2의 보수:* `8A` → `75 + 1 = 76h` = 118 → −118. `C5` → `3B` = 59 → −59. `A2` → `5E` = 94 → −94. `9D` → `63` = 99 → −99.

</details>


변형 문제

- (가) 16비트 `00FF`의 2의 보수와 그 값 (나) −100을 8비트 16진수로 (다) 부호 있는 16비트 `FFFF`와 `8000`의 값

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) `FF00 + 1 = FF01`, 값은 −255. (나) 100 = `64h`, 뒤집으면 `9B`, 1을 더해 `9C`. (다) −1과 −32,768.

</details>


## p6 · 16진수로 적힌 글자 읽기

`54 68 65 20 45 6E 64`는 무엇을 나타내는가?

사용 개념: [부호와 부호화](/Hongs_Blog/studies/data-and-information/code-encoding/)

풀이 전략: 두 글자씩 끊긴 16진수가 `20`~`7E` 범위에 몰려 있으면 ASCII 글자일 가능성이 크다. 외워 둘 기준은 셋이다. `41h`가 대문자 A, `61h`가 소문자 a, `20h`가 빈칸이다. 나머지는 거기서부터 센다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *기준 잡기:* `41h` = A, `61h` = a, `20h` = 빈칸.
2. *한 바이트씩 세기:* `54` = `41 + 13h` → A에서 19번째 뒤 = T. `68` = `61 + 7` → h. `65` → e. `20` → 빈칸. `45` → E. `6E` = `61 + Dh` → n. `64` → d.
3. *답:* "The End".

</details>


변형 문제

- (가) `42 69 6E 61 72 79`는 무슨 낱말인가? (나) "Hi!"를 16진수 바이트로 적어라(`!`는 `21h`).

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) "Binary". (나) `48 69 21`.

</details>


[^s1]: p5 (가)의 `6A3D`는 교재 Irvine, *Assembly Language for x86 Processors* 7판, 1.3절의 예다. 답은 모두 문제 코드로 확인했다.
{% endraw %}
