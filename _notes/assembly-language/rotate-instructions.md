---
layout: "note"
title: "회전 명령"
display_title: "회전 명령 (Rotate Instructions)"
kind: "concept"
kind_label: "정의"
num: "39"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Rotate Instructions", "ROL", "ROR", "RCL", "RCR", "Rotate Left", "Rotate Right", "Rotate Carry Left", "Rotate Carry Right", "비트 회전", "순환 시프트"]
description: "회전초밥집의 벨트처럼, 한쪽 끝에서 밀려난 비트가 사라지지 않고 반대쪽 끝으로 다시 들어오는 밀기다. 그래서 몇 번을 돌려도 잃는 비트가 없고, 칸 수만큼 돌리면 처음 값으로 돌아온다. 벨트에 보관 칸 하나를 끼워 한 칸 더 긴 고리로 돌리는 종류도 있는데, 이쪽은 여러 레지스터에…"
prev_url: "/studies/assembly-language/logical-vs-arithmetic-shift/"
prev_title: "논리 시프트와 산술 시프트 비교"
next_url: "/studies/assembly-language/double-shift/"
next_title: "이중 시프트 SHLD·SHRD"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/rotate-instructions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

회전초밥집의 벨트처럼, 한쪽 끝에서 밀려난 비트가 사라지지 않고 반대쪽 끝으로 다시 들어오는 밀기다. 그래서 몇 번을 돌려도 잃는 비트가 없고, 칸 수만큼 돌리면 처음 값으로 돌아온다. 벨트에 보관 칸 하나를 끼워 한 칸 더 긴 고리로 돌리는 종류도 있는데, 이쪽은 여러 레지스터에 걸친 긴 수를 한 칸씩 밀 때 쓴다. 곱하기·나누기 효과는 없고 비트의 자리만 바뀐다.

</div>


## 예시로 보기

`3Fh`의 16진 두 자리를 서로 바꿔 `F3h`를 만들고 싶다. 시프트로 왼쪽 4칸을 밀면 `F0h`가 되고 위쪽 `3`은 사라진다. 밀려난 비트를 버리지 않고 반대쪽으로 넣어 주는 명령이 필요하다.

```asm
mov dl,3Fh      ; DL = 0011 1111b
rol dl,4        ; DL = 1111 0011b = F3h
```

`ROL`은 왼쪽으로 민다. 맨 위 칸에서 나간 비트는 맨 아래 빈칸으로 들어가고, 같은 비트가 CF에도 복사된다.

```
ROL:   CF ←──┬── [7 6 5 4 3 2 1 0] ←──┐
             └────────────────────────┘      맨 위 비트가 CF와 맨 아래 두 곳으로

mov al,11110000b
rol al,1          ; AL = 11100001b, CF = 1
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 본문의 모든 값과 추적 표의 답(B5h, ADh, B5h, AEh), 256가지 값 전부에서 8칸 돌리면 제자리, 1의 개수가 그대로, `RCL`·`RCR`은 9칸이 한 바퀴 — [39_rotate-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/39_rotate-instructions_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 정의

회전 명령은 넷이다. 피연산자 꼴은 [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/)과 같다(대상, 칸 수. 칸 수는 즉시값이나 CL).

| 명령 | 도는 고리 | 빈칸에 들어오는 것 | CF에 들어가는 것 |
|---|---|---|---|
| `ROL` 왼쪽 회전 | 대상의 비트끼리 | 맨 위에서 나간 비트 | 맨 위에서 나간 비트(복사) |
| `ROR` 오른쪽 회전 | 대상의 비트끼리 | 맨 아래에서 나간 비트 | 맨 아래에서 나간 비트(복사) |
| `RCL` 올림 낀 왼쪽 회전 | CF + 대상 | 전에 있던 CF | 맨 위에서 나간 비트 |
| `RCR` 올림 낀 오른쪽 회전 | CF + 대상 | 전에 있던 CF | 맨 아래에서 나간 비트 |

`ROL`과 `ROR`에서 CF는 구경꾼이다. 나가는 비트를 복사해 받을 뿐 고리에 끼지 않는다. `RCL`과 `RCR`에서는 CF가 고리의 한 칸이다. 8비트 대상이면 9칸짜리 고리가 돈다.

```
ROR:   ┌──→ [7 6 5 4 3 2 1 0] ──┬──→ CF
       └────────────────────────┘             맨 아래 비트가 맨 위와 CF 두 곳으로

RCL:   ┌── CF ←── [7 6 5 4 3 2 1 0] ←──┐
       └───────────────────────────────┘      CF가 맨 아래로, 맨 위 비트가 CF로

RCR:   ┌──→ CF ──→ [7 6 5 4 3 2 1 0] ──┐
       └───────────────────────────────┘      CF가 맨 위로, 맨 아래 비트가 CF로
```

기호로 쓰면, $$w$$비트 값 $$x$$의 $$i$$번 비트를 $$x_i$$라 할 때($$x_{w-1}$$이 맨 위) 한 칸 회전은

$$\mathrm{ROL}: \; x_{w-2}\cdots x_0\,x_{w-1}, \quad \mathrm{CF} = x_{w-1} \qquad\qquad \mathrm{RCL}: \; x_{w-2}\cdots x_0\,\mathrm{CF}_{\text{전}}, \quad \mathrm{CF} = x_{w-1}$$


이다. 왼쪽 식은 새 값의 비트를 위에서부터 늘어놓은 것이다. `ROL`은 맨 아래에 방금 나간 $$x_{w-1}$$이 오고, `RCL`은 그 자리에 전의 CF가 온다[^s1].

## 예제

**ROR.** 오른쪽으로 돌린다. 4칸 돌리면 `ROL` 4칸과 같은 결과다(8칸 고리에서 왼쪽 4칸과 오른쪽 4칸은 같은 자리다).

```asm
mov al,11110000b
ror al,1          ; AL = 01111000b, CF = 0
mov dl,3Fh
ror dl,4          ; DL = F3h
```

**RCL.** `clc`는 CF를 0으로 만드는 명령이다.

```asm
clc               ; CF = 0
mov bl,88h        ; CF,BL = 0 10001000b
rcl bl,1          ; CF,BL = 1 00010000b
rcl bl,1          ; CF,BL = 0 00100001b
```

첫 `rcl`에서 맨 위의 1이 CF로 나가고, 전의 CF(0)가 맨 아래로 들어왔다. 둘째 `rcl`에서 CF에 있던 그 1이 맨 아래로 들어왔다. 나간 비트가 한 박자 늦게 돌아온다.

**RCR.** `stc`는 CF를 1로 만드는 명령이다.

```asm
stc               ; CF = 1
mov ah,10h        ; CF,AH = 1 00010000b
rcr ah,1          ; CF,AH = 0 10001000b
```

**한 줄씩 따라가기.** AL = 6Bh에서 두 묶음을 실행한다. 앞 묶음은 `ROR`·`ROL`, 뒤 묶음은 `stc`로 CF를 1로 만든 뒤 `RCR`·`RCL`이다.

| 명령 | 돌리기 전 (CF, AL) | 돌린 뒤 AL | 16진 | CF |
|---|---|---|---|---|
| `mov al,6Bh` | | `01101011` | 6Bh | |
| `ror al,1` | `01101011` | `10110101` | B5h | 1 |
| `rol al,3` | `10110101` | `10101101` | ADh | 1 |
| `stc` 뒤 `mov al,6Bh` | | `01101011` | 6Bh | 1 |
| `rcr al,1` | 1, `01101011` | `10110101` | B5h | 1 |
| `rcl al,3` 첫째 칸 | 1, `10110101` | `01101011` | 6Bh | 1 |
| `rcl al,3` 둘째 칸 | 1, `01101011` | `11010111` | D7h | 0 |
| `rcl al,3` 셋째 칸 | 0, `11010111` | `10101110` | AEh | 1 |

`ror al,1`과 `rcr al,1`의 결과가 둘 다 B5h인 것은 우연이다. 나가는 맨 아래 비트가 1이고 들어오는 CF도 1이었기 때문이다. `stc` 대신 `clc`였다면 `rcr`의 결과는 `00110101` = 35h다[^s1].

## 활용

- **자리 바꾸기.** 8비트 값을 4칸 돌리면 16진 두 자리가 서로 바뀐다. 잃는 비트가 없으므로 반대로 돌리면 되돌아온다[^s1].
- **긴 수 밀기.** 레지스터 둘에 걸친 수를 오른쪽으로 한 칸 밀 때, 위쪽을 `SHR`로 밀고 아래쪽을 `RCR`로 민다. 위쪽에서 밀려난 비트가 CF에 있다가 아래쪽의 맨 위로 들어온다. 8103h를 위 바이트 81h와 아래 바이트 03h로 나눠 `shr` 한 번, `rcr` 한 번을 하면 40h와 81h, 즉 4081h(8103h의 절반)가 된다[^s1].
- **비트 하나씩 꺼내 보기.** `ROL`을 한 칸 할 때마다 맨 위 비트가 CF에 들어오므로, 돌리고 CF를 보는 일을 8번 하면 값을 망가뜨리지 않고 모든 비트를 위에서부터 읽는다[^s1].
- 흔한 실수: `RCL`·`RCR` 앞에서 CF가 무엇인지 확인하지 않는다. 앞선 `ADD`나 `CMP`가 남긴 CF가 그대로 섞여 들어온다.
- 연습: [시프트와 회전 예제 사다리](/Hongs_Blog/studies/assembly-language/shift-rotate-ladder/)

## 연결

- 선수: [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/)(밀려난 비트를 버리는 쪽), [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)(CF)
- 긴 수를 한 번에 여러 칸 미는 전용 명령: [이중 시프트 SHLD·SHRD](/Hongs_Blog/studies/assembly-language/double-shift/)
- 시프트 두 종류와 견주어 언제 회전을 쓰는가: [논리 시프트와 산술 시프트 비교](/Hongs_Blog/studies/assembly-language/logical-vs-arithmetic-shift/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `ROL`과 `RCL`의 차이를 "고리에 몇 칸이 도는가"로 설명하라.</summary>

**답:** `ROL`은 대상의 비트끼리만 돈다(8비트면 8칸). 나간 비트가 곧바로 반대쪽 끝에 들어오고 CF는 그 비트의 복사만 받는다. `RCL`은 CF까지 넣어 돈다(8비트면 9칸). 나간 비트는 CF로 가고, 빈칸에는 전에 있던 CF가 들어온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** AL = 81h, CF = 0에서 시작한다. `rol al,1`, `ror al,1`, `rcl al,1`, `rcr al,1`을 각각 따로(늘 같은 처음 상태에서) 실행하면 AL과 CF는?</summary>

**답:** `rol`: AL = 03h, CF = 1. `ror`: AL = C0h, CF = 1. `rcl`: AL = 02h, CF = 1. `rcr`: AL = 40h, CF = 1.<br>
**이유:** 81h = `10000001`. `rol`은 나간 1이 맨 아래로 돌아와 `00000011`. `rcl`은 맨 아래에 전의 CF(0)가 들어와 `00000010`. `ror`은 나간 1이 맨 위로 돌아와 `11000000`. `rcr`은 맨 위에 전의 CF(0)가 들어와 `01000000`[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 8비트 값을 `ROL`로 8칸 돌리면 처음 값이 되는데, `RCL`로 8칸 돌리면 왜 처음 값이 안 될 수 있는가? 몇 칸을 돌려야 반드시 돌아오는가?</summary>

**답:** `RCL`의 고리는 CF까지 9칸이다. 8칸만 돌리면 한 칸이 모자라 비트들이 한 자리씩 어긋난 채로 남는다. 9칸을 돌려야 값과 CF가 모두 처음으로 돌아온다.<br>
**이유:** 고리를 그 길이만큼 돌리면 모든 비트가 제자리로 온다. 256가지 값과 CF 두 가지 전부에서 확인했다[^s1].

</details>


[^s1]: 수치는 검증 줄의 파이썬 흉내로 확인했다.
{% endraw %}
