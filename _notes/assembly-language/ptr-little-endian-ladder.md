---
layout: "note"
title: "PTR과 리틀 엔디언 예제 사다리"
display_title: "PTR과 리틀 엔디언 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "21"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: OFFSET과 PTR 연산자, 리틀 엔디언."
prev_url: "/studies/assembly-language/flag-tracing-ladder/"
prev_title: "플래그 추적 예제 사다리"
next_url: "/studies/assembly-language/array-loop-ladder/"
next_title: "LOOP로 배열 돌기 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/ptr-little-endian-ladder/"
---
{% raw %}
사용 개념: [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/), [리틀 엔디언](/Hongs_Blog/studies/assembly-language/little-endian/).

"`PTR`로 읽은 값을 쓰라"는 문제는 같은 하위목표의 되풀이다. ① 펼치기: 변수를 정의한 순서대로 메모리 바이트로 펼친다(2바이트 이상인 값은 아랫자리 바이트부터) ② 시작 자리: 이름의 자리에 더한 수만큼 뒤로 간다 ③ 집기: `PTR` 앞에 적은 크기만큼 바이트를 집는다 ④ 붙이기: 높은 주소의 바이트가 윗자리가 되게 붙인다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 메모리 바이트와 레지스터 값. 파이썬 흉내로 확인 — [21_ptr-little-endian-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/21_ptr-little-endian-ladder_p4/)</div>

</div>


## 문제 1 · 완전한 풀이

```asm
.data
varB BYTE 65h,31h,02h,05h
varW WORD 6543h,1202h
varD DWORD 12345678h
.code
mov ax,WORD PTR [varB+2]     ; a.
mov bl,BYTE PTR varD         ; b.
mov bl,BYTE PTR [varW+2]     ; c.
mov ax,WORD PTR [varD+2]     ; d.
mov eax,DWORD PTR varW       ; e.
```

1. *펼치기:* `varB`가 오프셋 0에서 시작한다고 하자.

```
오프셋   0   1   2   3   4   5   6   7   8   9   10  11
바이트   65  31  02  05  43  65  02  12  78  56  34  12
        └── varB ───┘  └── varW ───┘  └─── varD ────┘
```

{: start="2"}
2. *a.* 시작 자리 `varB+2` = 오프셋 2. 두 바이트 `02 05`를 집는다. 높은 주소의 05가 윗자리다. AX = 0502h.
3. *b.* 시작 자리 `varD` = 오프셋 8. 한 바이트 `78`. BL = 78h.
4. *c.* 시작 자리 `varW+2` = 오프셋 6. 한 바이트 `02`. BL = 02h.
5. *d.* 시작 자리 `varD+2` = 오프셋 10. 두 바이트 `34 12`. AX = 1234h.
6. *e.* 시작 자리 `varW` = 오프셋 4. 네 바이트 `43 65 02 12`를 집어 거꾸로 붙인다. EAX = 12026543h.

다섯 답은 슬라이드의 답과 같다[^1].

## 문제 2 · 마지막 하위목표만 빈칸

```asm
.data
myBytes BYTE 12h,34h,56h,78h
.code
mov ax,WORD PTR [myBytes+1]
```

1. *펼치기:* `12 34 56 78`. 바이트 배열이라 적은 순서 그대로다.
2. *시작 자리:* `myBytes+1` = 오프셋 1.
3. *집기:* 두 바이트 `34 56`.
4. *붙이기:* AX = ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

AX = 5634h. 높은 주소(오프셋 2)의 56이 윗자리, 낮은 주소(오프셋 1)의 34가 아랫자리다. 집은 순서대로 3456h라고 쓰면 틀린다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

```asm
.data
nums WORD 0A1B2h,0C3D4h
big  DWORD 0DEADBEEFh
.code
mov al,BYTE PTR [nums+1]     ; a.
mov eax,DWORD PTR nums       ; b.
mov ax,WORD PTR [big+1]      ; c.
```

1. *펼치기:* ______
2. *a.* 시작 자리 오프셋 1. 집기와 붙이기: ______
3. *b.* 시작 자리 오프셋 0. 네 바이트를 집는다. 붙이기: ______
4. *c.* 시작 자리: ______ 집기와 붙이기: ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. `B2 A1 D4 C3 EF BE AD DE`. `nums`가 오프셋 0~3, `big`이 오프셋 4~7이다.
2. 한 바이트 `A1`. AL = A1h. 첫 워드 A1B2h의 윗바이트다.
3. `B2 A1 D4 C3`을 거꾸로 붙여 EAX = C3D4A1B2h. 뒤의 원소가 윗자리로 간다.
4. `big`은 오프셋 4에서 시작하므로 `big+1` = 오프셋 5. 두 바이트 `BE AD`. AX = ADBEh.

</details>


## 문제 4 · 독립 문제

다음을 차례로 실행한다. (가)를 실행한 뒤의 메모리 8바이트와 (나), (다), (라)의 레지스터 값을 쓰라.

```asm
.data
val DWORD 11223344h
arr BYTE 0AAh,0BBh,0CCh,0DDh
.code
mov WORD PTR [val+1],0FFEEh   ; (가)
mov eax,val                   ; (나)
mov bx,WORD PTR [val+3]       ; (다)
mov ecx,DWORD PTR arr         ; (라)
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

처음 메모리: `44 33 22 11 AA BB CC DD`.<br>
(가) 오프셋 1과 2에 FFEEh를 아랫자리 바이트부터 적는다. 메모리: `44 EE FF 11 AA BB CC DD`.<br>
(나) EAX = 11FFEE44h. 가운데 두 바이트만 바뀌었다.<br>
(다) 오프셋 3부터 두 바이트 `11 AA`. BX = AA11h. `val`의 마지막 바이트와 `arr`의 첫 바이트가 붙었다. 변수의 끝을 넘어 읽어도 오류가 아니다.<br>
(라) `AA BB CC DD`를 거꾸로 붙여 ECX = DDCCBBAAh.

</details>


[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-2」, p.16 (Your turn: varB, varW, varD와 다섯 답)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 하위목표 네 단계, 문제 1의 풀이 과정과 메모리 그림, 문제 2의 `[myBytes+1]`, 문제 3과 문제 4는 원본에 없다. 문제 2의 데이터는 슬라이드 p.15의 `myBytes`다. 답은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
