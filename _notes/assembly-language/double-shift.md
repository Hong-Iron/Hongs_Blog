---
layout: "note"
title: "이중 시프트 SHLD·SHRD"
display_title: "이중 시프트 SHLD·SHRD (Double Shift)"
kind: "concept"
kind_label: "정의"
num: "40"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Double Shift", "SHLD", "SHRD", "Shift Left Double", "Shift Right Double", "이중 정밀도 시프트", "Double-Precision Shift"]
description: "두 줄로 선 사람들 가운데 앞줄만 옆으로 밀고, 생긴 빈자리를 뒷줄 사람이 건너와 채우는 밀기다. 뒷줄은 사람을 빌려줄 뿐 자기 자리는 그대로다. 보통 시프트가 빈자리를 0으로 채워 정보를 잃는 것과 달리, 이웃한 값에서 비트를 끌어오므로 레지스터 둘에 나눠 담은 긴 수를 끊김 없…"
prev_url: "/studies/assembly-language/rotate-instructions/"
prev_title: "회전 명령"
next_url: "/studies/assembly-language/stack-frame/"
next_title: "스택 프레임"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/double-shift/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 줄로 선 사람들 가운데 앞줄만 옆으로 밀고, 생긴 빈자리를 뒷줄 사람이 건너와 채우는 밀기다. 뒷줄은 사람을 빌려줄 뿐 자기 자리는 그대로다. 보통 시프트가 빈자리를 0으로 채워 정보를 잃는 것과 달리, 이웃한 값에서 비트를 끌어오므로 레지스터 둘에 나눠 담은 긴 수를 끊김 없이 밀 수 있다. 다만 8비트 값에는 쓸 수 없고, 뒷줄은 스스로 움직이지 않으므로 긴 수 전체를 밀려면 뒷줄을 따로 한 번 더 밀어야 한다.

</div>


## 예시로 보기

64비트 수는 32비트 레지스터 하나에 안 들어가서 EDX(위쪽 절반)와 EAX(아래쪽 절반)에 나눠 담는다. 이 수를 왼쪽으로 4칸 밀려면 EAX의 맨 위 4비트가 EDX의 맨 아래로 넘어가야 한다. `shl edx,4`만 하면 EDX의 아래 4칸에 0이 들어와 그 4비트를 잃는다.

`SHLD`는 그 빈칸을 다른 레지스터의 위쪽 비트로 채운다. 슬라이드의 16비트 예다[^1].

```asm
.data
wval WORD 9BA6h
.code
mov  ax,0AC36h
shld wval,ax,4      ; wval = BA6Ah, AX는 AC36h 그대로
```

```
            wval            AX
밀기 전   [9][B][A][6]   [A][C][3][6]
              ↙  ↙  ↙  ↖────┘            AX의 맨 위 4비트(A)가 건너온다
밀고 난 뒤 [B][A][6][A]   [A][C][3][6]    맨 위의 9는 밀려 나갔다
```

16진 한 자리가 4비트이므로 4칸 밀기는 16진 한 자리 옮기기다. `wval`의 `9`가 밀려 나가고, 맨 아래 빈자리에 AX의 맨 위 자리 `A`가 들어왔다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 모든 값과 Your turn 답(FA67h, 36FAh), 무작위 16비트 2만 쌍에서 아래 두 식, 8비트 전수 검사, 64비트 수를 `shld`와 `shl`로 민 결과 — [40_double-shift_verify.py](/Hongs_Blog/studies/assembly-language/code/40_double-shift_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

`SHLD 대상, 원천, 칸수`는 대상을 왼쪽으로 민다. 아래쪽에 생긴 빈칸을 원천의 맨 위 비트들로 채운다. `SHRD 대상, 원천, 칸수`는 대상을 오른쪽으로 민다. 위쪽에 생긴 빈칸을 원천의 맨 아래 비트들로 채운다. 두 명령 모두 원천은 바뀌지 않는다[^2].

쓸 수 있는 피연산자는 다음뿐이다. 대상은 16비트나 32비트 레지스터 또는 메모리, 원천은 같은 크기의 레지스터, 칸 수는 8비트 즉시값이나 CL이다[^2].

```asm
SHLD reg16/32, reg16/32, imm8/CL
SHLD mem16/32, reg16/32, imm8/CL
SHRD reg16/32, reg16/32, imm8/CL
SHRD mem16/32, reg16/32, imm8/CL
```

기호로 쓰면, 대상 $$d$$와 원천 $$s$$가 $$w$$비트이고 $$n$$칸($$1 \le n < w$$)을 밀 때

$$\mathrm{SHLD}(d, s, n) = \left\lfloor \frac{(d \cdot 2^w + s) \cdot 2^n}{2^w} \right\rfloor \bmod 2^w, \qquad \mathrm{SHRD}(d, s, n) = \left\lfloor \frac{s \cdot 2^w + d}{2^n} \right\rfloor \bmod 2^w$$


이다. $$d \cdot 2^w + s$$는 대상을 위에, 원천을 아래에 이어 붙인 $$2w$$비트 수다. `SHLD`는 이 긴 수를 왼쪽으로 $$n$$칸 민 뒤 위쪽 절반을 읽은 것이다. `SHRD`는 반대로 원천을 위에, 대상을 아래에 이어 붙인 수를 오른쪽으로 $$n$$칸 민 뒤 아래쪽 절반을 읽은 것이다. $$\bmod 2^w$$는 $$w$$비트만 남긴다는 뜻이다. CF에는 대상에서 마지막으로 밀려난 비트가 들어간다[^s1].

## 예제

**SHRD.** AX를 오른쪽으로 4칸 밀고, 맨 위 빈자리를 DX의 맨 아래 4비트로 채운다[^3].

```asm
mov  ax,234Bh
mov  dx,7654h
shrd ax,dx,4        ; AX = 4234h, DX는 7654h 그대로
```

```
             DX             AX
밀기 전   [7][6][5][4]   [2][3][4][B]
                    └────↘  ↘  ↘  ↘      DX의 맨 아래 4비트(4)가 건너온다
밀고 난 뒤 [7][6][5][4]   [4][2][3][4]    맨 아래의 B는 밀려 나갔다
```

**한 칸짜리 그림.** 슬라이드는 한 칸 미는 모습을 8칸짜리 그림으로 보인다[^4].

| | 대상 (밀기 전) | 원천 | 대상 (민 뒤) | CF |
|---|---|---|---|---|
| `SHLD`, 1칸 | `11100000` | `10011101` | `11000001` | 1 |
| `SHRD`, 1칸 | `11000001` | `00011101` | `11100000` | 1 |

`SHLD`에서는 원천의 맨 위 비트 1이 대상의 맨 아래로 왔다. `SHRD`에서는 원천의 맨 아래 비트 1이 대상의 맨 위로 왔다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.9와 p.12의 코드는 `shld al,bl,1`, `shrd al,bl,1`이다. / 문제점: 같은 슬라이드 p.8과 p.11이 적은 피연산자 꼴은 16비트나 32비트뿐이다. AL과 BL은 8비트라 이 꼴에 들지 않는다. / 수정안: 그림은 동작을 보이는 용도로만 읽고, 실제 코드에서는 `shld ax,bx,1`처럼 16비트 이상을 쓴다. / 근거: 같은 자료 p.8, p.11의 피연산자 목록. 실제 어셈블러로 돌려 보지는 못했다[확인필요].

</div>


**이어서 실행하기.** 슬라이드의 Your turn이다. 둘째 줄은 첫째 줄이 바꿔 놓은 DX에서 시작한다[^5].

| 명령 | 민 뒤 DX | AX |
|---|---|---|
| `mov ax,7C36h` / `mov dx,9FA6h` | 9FA6h | 7C36h |
| `shld dx,ax,4` | FA67h | 7C36h |
| `shrd dx,ax,8` | 36FAh | 7C36h |

첫 줄: DX의 `9`가 나가고 AX의 맨 위 `7`이 아래로 들어와 FA67h. 둘째 줄: FA67h의 아래 두 자리 `67`이 나가고 AX의 아래 두 자리 `36`이 위로 들어와 36FAh. 둘째 줄을 처음 DX(9FA6h)에 바로 하면 369Fh로 다른 값이 나온다[^s1].

## 활용

- **레지스터 둘에 걸친 수 밀기.** EDX:EAX에 든 64비트 수를 왼쪽으로 4칸 미는 코드다. 순서가 중요하다. EAX를 먼저 밀면 넘겨줄 위쪽 4비트가 이미 사라진다[^s1].

```asm
shld edx,eax,4      ; EAX의 맨 위 4비트를 EDX 아래로 받는다
shl  eax,4          ; 그다음 EAX 자신을 민다
```

  EDX = 12345678h, EAX = 9ABCDEF0h이면 결과는 EDX = 23456789h, EAX = ABCDEF00h다.

- **한 칸씩이면 회전으로도 된다.** `shl eax,1` 다음 `rcl edx,1`은 한 칸을 같은 식으로 민다. `SHLD`는 여러 칸을 명령 하나로 넘겨준다는 점이 다르다. [회전 명령](/Hongs_Blog/studies/assembly-language/rotate-instructions/)
- 흔한 실수: 원천도 같이 밀린다고 생각하는 것, 원천 자리에 메모리나 즉시값을 쓰는 것(레지스터만 된다), `SHRD`의 빈칸이 원천의 맨 위 비트로 찬다고 생각하는 것(맨 아래 비트다).
- 연습: [시프트와 회전 예제 사다리](/Hongs_Blog/studies/assembly-language/shift-rotate-ladder/)

## 연결

- 선수: [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/). 원천 자리에 0이 든 레지스터를 주면 `SHLD`는 `SHL`과, `SHRD`는 `SHR`과 같은 결과를 낸다[^s1].
- 빈칸을 무엇으로 채우는가로 갈리는 명령들: [논리 시프트와 산술 시프트 비교](/Hongs_Blog/studies/assembly-language/logical-vs-arithmetic-shift/)
- 피연산자 꼴 적는 법(reg16/32, mem16/32, imm8): [피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `SHLD`와 `SHRD`가 각각 빈칸을 원천의 어느 쪽 비트로 채우는지, 실행 뒤 원천이 어떻게 되는지 쓰라.</summary>

**답:** `SHLD`는 대상을 왼쪽으로 밀고 아래쪽 빈칸을 원천의 맨 위 비트들로 채운다. `SHRD`는 대상을 오른쪽으로 밀고 위쪽 빈칸을 원천의 맨 아래 비트들로 채운다. 원천은 둘 다 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** AX = 1234h, BX = ABCDh다. `shld ax,bx,8`을 실행한 결과와, 같은 처음 값에서 `shrd ax,bx,8`을 실행한 결과를 각각 쓰라.</summary>

**답:** `shld ax,bx,8` → AX = 34ABh. `shrd ax,bx,8` → AX = CD12h. BX는 두 경우 모두 ABCDh.<br>
**이유:** 8칸은 16진 두 자리다. `SHLD`: AX의 `12`가 나가고 BX의 위 두 자리 `AB`가 아래로 들어온다. `SHRD`: AX의 `34`가 나가고 BX의 아래 두 자리 `CD`가 위로 들어온다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** EDX:EAX의 64비트 수를 왼쪽으로 4칸 밀 때 `shl eax,4`를 먼저 하고 `shld edx,eax,4`를 나중에 하면 왜 틀리는가?</summary>

**답:** `shl eax,4`가 EAX의 맨 위 4비트를 버리고 나면, `shld`가 EDX로 받아 오는 것은 원래 맨 위 4비트가 아니라 그 아래에 있던 4비트다. 넘겨줘야 할 비트를 넘기기 전에 잃는다.<br>
**이유:** `SHLD`는 원천의 "지금" 맨 위 비트를 읽는다. 원천을 바꾸지 않는 명령이므로 원천을 미는 일은 그 뒤에 따로 한다[^s1].

</details>


[^1]: 어셈블리어 10회 강의 자료 「wk10-chapt_07-3-2」, p.10 (wval = 9BA6h, AX = AC36h → BA6Ah)
[^2]: 같은 자료, p.8 (SHLD의 뜻과 피연산자 꼴), p.11 (SHRD)
[^3]: 같은 자료, p.13 (AX = 234Bh, DX = 7654h → 4234h)
[^4]: 같은 자료, p.9 (SHLD 한 칸 그림), p.12 (SHRD 한 칸 그림)
[^5]: 같은 자료, p.14 (Your turn: FA67h, 36FAh)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 기호 식, 16진 자리 그림, 표의 CF, 369Fh, 64비트 수를 미는 코드와 값, 0을 원천으로 주면 보통 시프트와 같다는 말, 카드의 답은 원본에 없다. 수치는 검증 줄의 파이썬 흉내로 확인했다.
{% endraw %}
