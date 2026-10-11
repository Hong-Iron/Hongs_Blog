---
layout: "note"
title: "시프트 명령"
display_title: "시프트 명령 (Shift Instructions)"
kind: "concept"
kind_label: "정의"
num: "37"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Shift Instructions", "SHL", "SHR", "SAL", "SAR", "Shift Left", "Shift Right", "자리 이동", "비트 시프트", "빠른 곱셈", "Fast Multiplication"]
description: "0과 1이 줄지어 앉은 칸에서 모두를 한쪽으로 한 칸씩 옮겨 앉히는 명령이다. 끝에서 밀려난 하나는 따로 마련된 보관 칸 하나에 잠깐 남고, 반대쪽에 생긴 빈자리는 정해진 값으로 채운다. 십진수 끝에 0을 붙이면 열 배가 되듯, 2진수를 왼쪽으로 한 칸 밀면 두 배, 오른쪽으로 한…"
prev_url: "/studies/assembly-language/asm-finite-state-machine/"
prev_title: "유한 상태 기계"
next_url: "/studies/assembly-language/logical-vs-arithmetic-shift/"
next_title: "논리 시프트와 산술 시프트 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/shift-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

0과 1이 줄지어 앉은 칸에서 모두를 한쪽으로 한 칸씩 옮겨 앉히는 명령이다. 끝에서 밀려난 하나는 따로 마련된 보관 칸 하나에 잠깐 남고, 반대쪽에 생긴 빈자리는 정해진 값으로 채운다. 십진수 끝에 0을 붙이면 열 배가 되듯, 2진수를 왼쪽으로 한 칸 밀면 두 배, 오른쪽으로 한 칸 밀면 절반이 된다. 곱셈·나눗셈을 자리 옮기기 한 번으로 끝내지만, 밀려난 자리는 사라지므로 결과가 칸 수를 넘으면 틀린 값이 남는다.

</div>


## 예시로 보기

5에 4를 곱하고 싶다. 곱하는 수가 2, 4, 8처럼 2를 여러 번 곱한 수라면 곱셈을 하지 않고 자리만 옮겨도 된다. 슬라이드는 이것을 빠른 곱셈이라고 부른다[^1].

십진수 37의 끝에 0을 붙이면 370, 열 배다. 2진수도 같다. 5는 `00000101`이다. 전체를 왼쪽으로 한 칸 밀고 오른쪽 끝에 0을 채우면 `00001010`, 10이다[^1].

```asm
mov dl,5        ; DL = 00000101b = 5
shl dl,1        ; DL = 00001010b = 10
```

```
        CF     7 6 5 4 3 2 1 0
밀기 전  ?     [0 0 0 0 0 1 0 1]   = 5
              ↙ ↙ ↙ ↙ ↙ ↙ ↙ ↙ ← 0
밀고 난 뒤 0   [0 0 0 0 1 0 1 0]   = 10
```

맨 왼쪽(7번) 칸에서 밀려난 비트는 버려지지 않고 올림 플래그 CF에 들어간다. 오른쪽 끝 빈칸에는 0이 들어온다.

두 칸 밀면 네 배다. `mov dl,5` 다음 `shl dl,2`를 하면 DL = 20이다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 모든 값과 Your turn 답(35h, A8h, C6h, F8h), 8비트 256가지 값 × 0~8칸 전부에서 아래 세 식 — [37_shift-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/37_shift-instructions_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

시프트 명령은 넷이다[^2].

| 명령 | 이름 | 미는 쪽 | 빈칸에 채우는 값 | CF에 들어가는 것 |
|---|---|---|---|---|
| `SHL` | 왼쪽 시프트 | 왼쪽 | 맨 아래 칸에 0 | 맨 위 칸에서 나간 비트 |
| `SAL` | 왼쪽 산술 시프트 | 왼쪽 | `SHL`과 완전히 같다 | 같다 |
| `SHR` | 오른쪽 시프트 | 오른쪽 | 맨 위 칸에 0 | 맨 아래 칸에서 나간 비트 |
| `SAR` | 오른쪽 산술 시프트 | 오른쪽 | 맨 위 칸에 원래 부호 비트 | 맨 아래 칸에서 나간 비트 |

빈칸을 0으로 채우는 것을 논리 시프트, 부호 비트를 복사해 채우는 것을 산술 시프트라고 부른다[^3]. 둘의 차이는 [논리 시프트와 산술 시프트 비교](/Hongs_Blog/studies/assembly-language/logical-vs-arithmetic-shift/)에서 따로 다룬다.

**쓰는 꼴.** 첫 피연산자는 밀 대상(레지스터나 메모리), 둘째는 몇 칸 밀지다. 칸 수는 8비트 즉시값이나 CL 레지스터로만 준다. 회전 명령도 모두 같은 꼴이다[^4].

```asm
SHL reg,imm8
SHL mem,imm8
SHL reg,CL
SHL mem,CL
```

**곱셈·나눗셈과의 관계.** 8비트 값 $$x$$를 $$n$$칸 밀 때($$0 \le n \le 8$$) 다음이 맞다[^5].

- 왼쪽으로 $$n$$칸 밀면 $$2^n$$을 곱한 것이다. 단 8비트를 넘는 윗자리는 잘린다.
- 부호 없는 수를 `SHR`로 $$n$$칸 밀면 $$2^n$$으로 나눈 몫이다.
- 부호 있는 수를 `SAR`로 $$n$$칸 밀면 $$2^n$$으로 나누고 내린 값이다.

기호로 쓰면, $$x$$를 부호 없는 수로 읽은 값을 $$u$$, 부호 있는 수로 읽은 값을 $$s$$라 할 때

$$\mathrm{SHL}(x, n) = (u \cdot 2^n) \bmod 2^8, \qquad \mathrm{SHR}(x, n) = \left\lfloor \frac{u}{2^n} \right\rfloor, \qquad \mathrm{SAR}(x, n) = \left\lfloor \frac{s}{2^n} \right\rfloor$$


이다. $$\bmod 2^8$$은 256으로 나눈 나머지, 즉 아래 8비트만 남긴다는 뜻이다. $$\lfloor\ \rfloor$$는 소수점 아래를 버리고 작은 쪽 정수로 내린다는 뜻이다. 세 식은 256가지 값 전부에서 확인했다[^s1].

## 예제

**오른쪽으로 밀어 나누기.** 80을 한 칸 밀면 40, 거기서 두 칸 더 밀면 10이다[^6].

```asm
mov dl,80
shr dl,1        ; DL = 40
shr dl,2        ; DL = 10
```

**음수는 SAR로.** −80(`10110000`)을 `SAR`로 밀면 부호가 그대로다[^7].

```asm
mov dl,-80
sar dl,1        ; DL = -40
sar dl,2        ; DL = -10
```

**한 줄씩 따라가기.** 슬라이드의 Your turn 네 문제다. 답은 슬라이드에 적힌 값과 같다[^8].

| 명령 | 밀기 전 AL | 밀고 난 AL | 16진 | CF |
|---|---|---|---|---|
| `mov al,6Bh` | | `01101011` | 6Bh | |
| `shr al,1` | `01101011` | `00110101` | 35h | 1 |
| `shl al,3` | `00110101` | `10101000` | A8h | 1 |
| `mov al,8Ch` | | `10001100` | 8Ch | |
| `sar al,1` | `10001100` | `11000110` | C6h | 0 |
| `sar al,3` | `11000110` | `11111000` | F8h | 1 |

여러 칸을 밀면 CF에는 마지막으로 밀려난 비트 하나만 남는다. `shl al,3`에서는 `0`, `0`, `1`이 차례로 나갔고 마지막 `1`이 CF다[^s1].

**넘치면 틀린다.** 200(`11001000`)을 왼쪽으로 한 칸 밀면 400이 되어야 하는데 8비트에는 255까지만 들어간다. 맨 위의 1이 CF로 나가고 남는 값은 `10010000` = 144다. 400 − 256 = 144와 맞는다[^s1].

## 활용

- 2를 여러 번 곱한 수로 곱하거나 나눌 때 곱셈·나눗셈 명령 대신 쓴다. 다른 수도 쪼개면 된다. 36 = 32 + 4이므로 `x`에 36을 곱한 값은 `x`를 5칸 민 것과 2칸 민 것을 더한 값이다[^s1].
- 비트 묶음 꺼내기: 원하는 비트를 맨 아래로 밀어 놓고 [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/)의 AND로 나머지를 지운다.
- 흔한 실수 세 가지.
    - 음수에 `SHR`을 쓴다. −80에 `shr dl,1`을 하면 88이 나온다. 부호 있는 수는 `SAR`을 쓴다.
    - 왼쪽으로 밀어 넘친 것을 놓친다. 넘쳤는지는 CF(부호 없는 수)를 봐야 안다.
    - 칸 수를 EAX나 변수로 주려 한다. 칸 수는 즉시값이나 CL뿐이다.
- Java의 `<<`, `>>`, `>>>`가 각각 `SHL`, `SAR`, `SHR`과 같은 일을 한다[^s1]. [비트 연산](/Hongs_Blog/studies/software-project/java-bitwise/)
- 연습: [시프트와 회전 예제 사다리](/Hongs_Blog/studies/assembly-language/shift-rotate-ladder/)

## 연결

- 선수: [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/), [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)(CF), [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)(부호 비트)
- 한 칸 밀면 두 배가 되는 까닭: [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 밀려난 비트를 버리지 않고 반대쪽으로 돌려 넣는 명령: [회전 명령](/Hongs_Blog/studies/assembly-language/rotate-instructions/). 빈칸을 다른 레지스터의 비트로 채우는 명령: [이중 시프트 SHLD·SHRD](/Hongs_Blog/studies/assembly-language/double-shift/)
- 작은 값을 큰 칸으로 옮길 때 윗자리를 0으로 채울지 부호로 채울지 고르는 같은 문제: [제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `SHL`, `SHR`, `SAR`이 각각 빈칸을 무엇으로 채우고 CF에 무엇을 넣는지 쓰라. `SAL`은 무엇과 같은가?</summary>

**답:** `SHL`: 맨 아래 칸에 0, CF에는 맨 위에서 나간 비트. `SHR`: 맨 위 칸에 0, CF에는 맨 아래에서 나간 비트. `SAR`: 맨 위 칸에 원래 부호 비트, CF에는 맨 아래에서 나간 비트. `SAL`은 `SHL`과 같은 명령이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `mov al,3Ch` 다음에 `shl al,2`, 이어서 `shr al,3`을 실행한다. 각 명령 뒤의 AL(16진)과 CF는?</summary>

**답:** `shl al,2` 뒤 AL = F0h, CF = 0. `shr al,3` 뒤 AL = 1Eh, CF = 0.<br>
**이유:** 3Ch = `00111100`. 왼쪽 두 칸: `11110000`, 나간 비트는 0, 0. 오른쪽 세 칸: `00011110`, 나간 비트는 0, 0, 0. 처음 값 3Ch(60)로 돌아오지 않는다. 60 × 4 = 240, 240 ÷ 8 = 30이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `mov al,80h` 다음 `shl al,1`을 하면 AL은 0이 된다. 128 × 2 = 256인데 왜 0인가? 이 일이 일어났다는 것을 프로그램은 어떻게 아는가?</summary>

**답:** 256은 2진수로 `1 00000000`, 9비트다. AL은 8칸뿐이라 맨 위의 1이 밀려나고 아래 8비트 `00000000`만 남는다. 밀려난 1은 CF에 들어가므로 CF = 1을 보고 안다.<br>
**이유:** 왼쪽 시프트의 결과는 $$(u \cdot 2^n) \bmod 2^8$$이다. 곱이 255 이하일 때만 곱셈과 같은 값이 남는다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** EAX에 든 부호 없는 수에 18을 곱한 값을 곱셈 명령 없이 EAX에 넣는 코드를 쓰라(EBX를 써도 된다).</summary>

**답:** 18 = 16 + 2다.
```asm
mov ebx,eax
shl eax,4       ; EAX × 16
shl ebx,1       ; EBX × 2
add eax,ebx     ; EAX × 18
```
**이유:** $$x \cdot 18 = x \cdot 2^4 + x \cdot 2^1$$. $$x = 3$$이면 48 + 6 = 54다[^s1].

</details>


[^1]: 어셈블리어 10회 강의 자료 「wk10-chapt_07-3-1」, p.7 (빠른 곱셈: 5를 한 칸, 두 칸 밀기)
[^2]: 같은 자료, p.6 (SHL), p.8 (SHR), p.9 (SAL, SAR)
[^3]: 같은 자료, p.4~5 (논리 시프트와 산술 시프트의 그림)
[^4]: 같은 자료, p.6 (피연산자 꼴, "모든 시프트·회전 명령에 같다")
[^5]: 같은 자료, p.7~8 ("n비트 밀면 $$2^n$$을 곱한다·나눈다")
[^6]: 같은 자료, p.8 (80 → 40 → 10)
[^7]: 같은 자료, p.9 (−80 → −40 → −10)
[^8]: 같은 자료, p.10 (Your turn: 35h, A8h, C6h, F8h)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 세 식의 기호 표현과 전수 검사, 밀기 전후 그림, 추적 표의 2진 값과 CF, 200을 미는 예, 36·18을 쪼개 곱하는 예, Java 연산자와의 짝, 카드의 답은 원본에 없다. 모두 검증 줄의 파이썬 흉내로 확인했다.
{% endraw %}
