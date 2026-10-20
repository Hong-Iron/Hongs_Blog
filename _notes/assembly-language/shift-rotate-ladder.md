---
layout: "note"
title: "시프트와 회전 예제 사다리"
display_title: "시프트와 회전 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "40"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 시프트 명령, 회전 명령, 이중 시프트 SHLD·SHRD."
prev_url: "/studies/assembly-language/fsm-practice/"
prev_title: "유한 상태 기계 연습"
next_url: "/studies/assembly-language/stack-frame-ladder/"
next_title: "스택 프레임 그리기 예제 사다리"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "40_shift-rotate-ladder_p4.py", "u": "/studies/assembly-language/code/40_shift-rotate-ladder_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/assembly-language/shift-rotate-ladder/"
---
{% raw %}
사용 개념: [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/), [회전 명령](/Hongs_Blog/studies/assembly-language/rotate-instructions/), [이중 시프트 SHLD·SHRD](/Hongs_Blog/studies/assembly-language/double-shift/).

"이 명령들을 차례로 실행한 뒤의 값을 16진으로 쓰라"는 문제는 명령마다 같은 하위목표를 되풀이한다.

1. *펴기:* 지금 값을 2진수로 편다(16진 한 자리 = 4비트).
2. *옮기기:* 방향대로 칸 수만큼 옮긴다. 4칸·8칸이면 16진 자리째 옮긴다.
3. *채우기:* 빈칸을 그 명령의 규칙대로 채운다. `SHL`·`SHR`은 0, `SAR`은 원래 부호 비트, `ROL`·`ROR`은 방금 나간 비트, `RCL`·`RCR`은 전의 CF, `SHLD`·`SHRD`는 원천의 비트.
4. *CF 정하기:* 마지막으로 나간 비트가 CF다.
5. *접기:* 4비트씩 묶어 16진으로 되돌린다.

## 문제 1 · 완전한 풀이

```asm
mov al,0D4h
shl al,1
sar al,2
rol al,3
```

**`shl al,1`**
1. *펴기:* D4h = `1101 0100`.
2. *옮기기:* 왼쪽으로 한 칸. 맨 위의 `1`이 나간다.
3. *채우기:* 맨 아래에 0. → `1010 1000`.
4. *CF 정하기:* 나간 비트 1. CF = 1.
5. *접기:* A8h.

**`sar al,2`**
1. *펴기:* `1010 1000`. 부호 비트는 1이다.
2. *옮기기:* 오른쪽으로 두 칸. 아래의 `0`, `0`이 차례로 나간다.
3. *채우기:* 맨 위 두 칸에 부호 비트 1. → `1110 1010`.
4. *CF 정하기:* 마지막으로 나간 비트 0. CF = 0.
5. *접기:* EAh. (−88을 4로 나눈 −22다.)

**`rol al,3`**
1. *펴기:* `1110 1010`.
2. *옮기기:* 왼쪽으로 세 칸. 위의 `1`, `1`, `1`이 차례로 나간다.
3. *채우기:* 나간 비트가 그대로 아래로 들어온다. → `0101 0111`.
4. *CF 정하기:* 마지막으로 나간 비트 1. CF = 1.
5. *접기:* 57h.

답: AL = A8h → EAh → 57h, 마지막 CF = 1.

## 문제 2 · 마지막 하위목표만 빈칸

```asm
stc
mov bl,4Eh
rcl bl,2
rcr bl,1
```

`RCL`·`RCR`은 CF까지 넣은 9칸을 돌린다. 여러 칸이면 한 칸씩 나눠 한다.

**`rcl bl,2`의 첫째 칸**
1. *펴기:* CF = 1, BL = `0100 1110`.
2. *옮기기:* 왼쪽으로 한 칸. 맨 위의 `0`이 나간다.
3. *채우기:* 맨 아래에 전의 CF인 1. → `1001 1101`.
4. *CF 정하기:* 나간 비트 0. CF = 0.

**`rcl bl,2`의 둘째 칸**
1. *펴기:* CF = 0, BL = `1001 1101`.
2. *옮기기:* 왼쪽으로 한 칸. 맨 위의 `1`이 나간다.
3. *채우기:* 맨 아래에 전의 CF인 0. → `0011 1010`.
4. *CF 정하기:* 나간 비트 1. CF = 1.
5. *접기:* 3Ah.

**`rcr bl,1`**
1. *펴기:* CF = 1, BL = `0011 1010`.
2. *옮기기:* 오른쪽으로 한 칸. 맨 아래의 `0`이 나간다.
3. *채우기:* 맨 위에 전의 CF인 1. → `1001 1101`.
4. *CF 정하기와 접기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

나간 비트가 0이므로 CF = 0. `1001 1101` = 9Dh. `rcl` 둘째 칸을 되돌린 것이라 첫째 칸 뒤의 값(9Dh, CF = 0)과 같다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

```asm
mov  ax,0B3C5h
mov  dx,2D4Fh
shld dx,ax,4
shrd ax,dx,8
ror  ax,4
```

4칸과 8칸이므로 16진 자리째 옮긴다.

**`shld dx,ax,4`**
1. *펴기:* DX = `2 D 4 F`, AX = `B 3 C 5`.
2. *옮기기:* ______
3. *채우기:* ______
4. *CF 정하기:* 나간 `2` = `0010`의 마지막 비트는 0. CF = 0.
5. *접기:* DX = D4FBh. AX는 그대로 B3C5h.

**`shrd ax,dx,8`**
1. *펴기:* AX = `B 3 C 5`, DX = `D 4 F B`(앞 줄에서 바뀐 값).
2. *옮기기:* AX를 오른쪽으로 두 자리. 아래의 `C 5`가 나간다.
3. *채우기:* ______
4. *CF 정하기:* 마지막으로 나간 비트는 `C` = `1100`의 맨 위 비트 1. CF = 1.
5. *접기:* ______

**`ror ax,4`**
1. *펴기와 옮기기:* 앞 줄의 AX를 오른쪽으로 한 자리 돌린다.
2. *채우기와 접기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

**`shld`** 2. DX를 왼쪽으로 한 자리 옮긴다. 맨 위의 `2`가 나가 `D 4 F _`. 3. 빈 맨 아래 자리에 AX의 맨 위 자리 `B`. → `D 4 F B`.

**`shrd`** 3. 빈 위쪽 두 자리에 DX의 아래 두 자리 `F B`. → `F B B 3`. 5. AX = FBB3h. DX는 그대로 D4FBh.

**`ror`** 2. 맨 아래 자리 `3`이 나가 맨 위로 돌아온다. → `3 F B B` = 3FBBh. 마지막으로 나간 비트는 `3` = `0011`의 맨 위 비트 0이라 CF = 0.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [40_shift-rotate-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/40_shift-rotate-ladder_p4/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 문제 4 · 독립 문제

DX에 날짜가 한 덩어리로 들어 있다. 0~4번 비트(5비트)가 날, 5~8번 비트(4비트)가 달, 9~15번 비트(7비트)가 해다. DX = 266Ah일 때 (a) 달을 AL에 꺼내는 코드를 쓰고 그 값을 구하라. DX는 바꾸지 않는다. (b) 해를 꺼낼 때 `shr dx,9` 대신 `sar dx,9`를 쓰면 어떤 DX에서 틀린 값이 나오는가? 예를 하나 들라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 달이 맨 아래로 오도록 5칸 내리고, 아래 4비트만 남긴다.
```asm
mov ax,dx
shr ax,5              ; 달이 0~3번 비트로 내려온다
and al,00001111b      ; 해의 비트를 지운다
```
266Ah = `0010011 0011 01010`. 해 `0010011` = 19, 달 `0011` = 3, 날 `01010` = 10. `shr ax,5` 뒤 AX = 0133h, `and` 뒤 AL = 3.

(b) 맨 위 비트(15번)가 1인 값에서 틀린다. 해가 64 이상이면 그렇다. DX = A66Ah(해 83)에서 `shr dx,9`는 0053h = 83을 주지만 `sar dx,9`는 빈칸을 1로 채워 FFD3h를 준다. 비트 묶음을 꺼낼 때는 수의 부호와 상관없이 0으로 채우는 `SHR`을 쓴다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 해 128가지 × 달 12가지 조합 전부에서 (a)의 코드가 달을 꺼낸다 — [40_shift-rotate-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/40_shift-rotate-ladder_p4/)</div>

</div>
{% endraw %}
