---
layout: "note"
title: "플래그 추적 예제 사다리"
display_title: "플래그 추적 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "19"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 산술 연산과 상태 플래그의 ZF, SF, CF, OF."
prev_url: "/studies/assembly-language/arithmetic-expression-practice/"
prev_title: "산술식을 어셈블리로 옮기기 연습"
next_url: "/studies/assembly-language/ptr-little-endian-ladder/"
next_title: "PTR과 리틀 엔디언 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/flag-tracing-ladder/"
---
{% raw %}
사용 개념: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)의 ZF, SF, CF, OF.

"명령 뒤의 결과와 플래그를 쓰라"는 문제는 같은 하위목표의 되풀이다. ① 결과: 16진수로 계산하고 칸의 크기에 맞게 자른다 ② ZF: 자른 결과가 0인가 ③ SF: 자른 결과의 맨 윗자리 비트 ④ CF: 두 피연산자를 부호 없는 수로 읽어 참값이 범위 밖인가(덧셈은 넘음, 뺄셈은 작은 수에서 큰 수를 뺌) ⑤ OF: 두 피연산자를 부호 있는 수로 읽어 참값이 범위 밖인가. `MOV`는 플래그를 바꾸지 않고, `INC`와 `DEC`는 CF만 그대로 둔다[^s1].

8비트의 범위는 부호 없이 0~255, 부호 있게 −128~127이다. 16비트는 0~65,535와 −32,768~32,767이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 모든 결과와 플래그. 파이썬 흉내로 확인 — [19_flag-tracing-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/19_flag-tracing-ladder_p4/)</div>

</div>


## 문제 1 · 완전한 풀이

```asm
mov al,7Fh
add al,1         ; (가)
sub al,1         ; (나)
```

**(가)**

1. *결과:* 7Fh + 01h = 80h. 8비트에 들어간다. AL = 80h.
2. *ZF:* 80h는 0이 아니다. ZF = 0.
3. *SF:* 80h = `10000000`. 맨 윗자리 비트가 1이다. SF = 1.
4. *CF:* 부호 없이 127 + 1 = 128. 0~255 안이다. CF = 0.
5. *OF:* 부호 있게 127 + 1 = 128. −128~127 밖이다. OF = 1.

**(나)**

1. *결과:* 80h − 01h = 7Fh. AL = 7Fh.
2. *ZF:* 0이 아니다. ZF = 0.
3. *SF:* 7Fh = `01111111`. SF = 0.
4. *CF:* 부호 없이 128 − 1 = 127. 큰 수에서 작은 수를 뺐다. CF = 0.
5. *OF:* 부호 있게 −128 − 1 = −129. 범위 밖이다. OF = 1.

AL은 처음 값 7Fh로 돌아왔지만 OF는 두 번 다 켜졌다. 부호 있는 수로 보면 127에서 −128로 건너뛰었다가 다시 건너온 것이다.

## 문제 2 · 마지막 하위목표만 빈칸

```asm
mov al,80h
add al,92h
```

1. *결과:* 80h + 92h = 112h. 8비트로 자르면 12h. AL = 12h.
2. *ZF:* 0.
3. *SF:* 12h = `00010010`. SF = 0.
4. *CF:* 부호 없이 128 + 146 = 274. 255를 넘었다. CF = 1.
5. *OF:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

OF = 1. 80h는 −128, 92h는 −110이다. −128 + (−110) = −238로 −128~127 밖이다. 음수 둘을 더했는데 결과 12h(18)가 양수로 나온 것으로도 알 수 있다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

```asm
mov bh,6Ch
add bh,95h       ; (가)
mov al,2
sub al,3         ; (나)
```

**(가)**

1. *결과:* 6Ch + 95h = 101h → BH = 01h.
2. *ZF:* ______
3. *SF:* 0.
4. *CF:* ______
5. *OF:* ______

**(나)**

1. *결과:* ______
2. *ZF:* 0.
3. *SF:* ______
4. *CF:* ______
5. *OF:* 0. 부호 있게 2 − 3 = −1로 범위 안이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) ZF = 0(결과 01h는 0이 아니다). CF = 1(부호 없이 108 + 149 = 257, 255를 넘었다). OF = 0(부호 있게 108 + (−107) = 1, 범위 안이다. 부호가 다른 두 수의 합은 넘치지 않는다).<br>
(나) 결과: 02h − 03h는 0 아래로 내려가 FFh다. SF = 1(FFh의 맨 윗자리 비트). CF = 1(부호 없이 2 − 3, 작은 수에서 큰 수를 뺐다).

</details>


## 문제 4 · 독립 문제

표시한 줄마다 결과와 ZF, SF, CF, OF를 쓰라.

```asm
mov ax,0FFFFh
add ax,1         ; (가)
inc ax           ; (나)
mov cl,80h
sub cl,1         ; (다)
sub cl,80h       ; (라)
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

| 줄 | 결과 | ZF | SF | CF | OF |
|---|---|---|---|---|---|
| (가) | AX = 0000h | 1 | 0 | 1 | 0 |
| (나) | AX = 0001h | 0 | 0 | 1 | 0 |
| (다) | CL = 7Fh | 0 | 0 | 0 | 1 |
| (라) | CL = FFh | 0 | 1 | 1 | 1 |

(가) 16비트에서 FFFFh + 1 = 10000h → 0000h. 부호 없이 65,535 + 1은 범위 밖, 부호 있게 −1 + 1 = 0은 범위 안.<br>
(나) `INC`는 CF를 바꾸지 않는다. (가)의 1이 남아 있다. 0 + 1에서 올림이 없으니 0이라고 답하기 쉽다.<br>
(다) 80h − 1 = 7Fh. 부호 없이 128 − 1은 범위 안, 부호 있게 −128 − 1 = −129는 범위 밖.<br>
(라) 7Fh − 80h. 부호 없이 127 − 128은 작은 수에서 큰 수를 빼므로 CF = 1, 결과 FFh. 부호 있게 127 − (−128) = 255는 범위 밖이라 OF = 1. 두 플래그가 함께 켜진다.

</details>


[^s1]: `INC`가 CF를 바꾸지 않는다는 것은 Intel 64 and IA-32 Architectures Software Developer's Manual, Volume 2의 INC 항목에 있다. 답은 파이썬 흉내로 확인했다. 실제 CPU로 돌린 결과가 아니다.
{% endraw %}
