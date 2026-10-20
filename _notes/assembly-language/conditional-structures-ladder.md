---
layout: "note"
title: "조건 구조를 점프로 옮기기 예제 사다리"
display_title: "조건 구조를 점프로 옮기기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "34"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 조건 구조를 점프로 옮기기, 조건 점프."
prev_url: "/studies/assembly-language/stack-tracing-ladder/"
prev_title: "스택 추적 예제 사다리"
next_url: "/studies/assembly-language/fsm-practice/"
next_title: "유한 상태 기계 연습"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "34_conditional-structures-ladder_p4.py", "u": "/studies/assembly-language/code/34_conditional-structures-ladder_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/assembly-language/conditional-structures-ladder/"
---
{% raw %}
사용 개념: [조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/), [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/).

"이 의사코드를 어셈블리어로 구현하라"는 문제는 같은 하위목표의 되풀이다. ① 견주기: 조건식의 두 값을 `cmp`로 견준다 ② 점프 고르기: 부호 있는 수인지 보고, 조건을 뒤집어 "거짓이면 건너뛰는" 점프를 고른다(OR의 앞 조건만 뒤집지 않고 "참이면 몸통으로") ③ 몸통: 참일 때 할 일을 바로 아래에 쓴다 ④ 매듭짓기: else가 있으면 `jmp`로 else를 건너뛰고, `while`이면 `jmp`로 맨 위로 돌아가고, 레이블을 붙인다[^s1].

모든 답은 흉내기로 돌려 같은 뜻의 파이썬 코드와 맞는지 확인했다. 실제 MASM으로 돌린 것이 아니다. 이런 문제에는 맞는 풀이가 여럿이다.

## 문제 1 · 완전한 풀이

```
if( op1 == op2 )
    X = 1;
else
    X = 2;
```

`op1`, `op2`, `X`는 32비트 변수다.

```asm
    mov eax,op1     ; ① 견주기: 메모리끼리는 못 견주니 EAX를 거친다
    cmp eax,op2
    jne L1          ; ② 점프 고르기: ==의 반대는 "다르면". else로 간다
    mov X,1         ; ③ 몸통: 참일 때 할 일
    jmp L2          ; ④ 매듭짓기: else를 건너뛴다
L1: mov X,2         ;    else의 몸통
L2:
```

`op1` = `op2`면 `jne`가 뛰지 않아 X = 1이 되고 `jmp L2`로 끝난다. 다르면 `L1`으로 뛰어 X = 2가 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [34_conditional-structures-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/34_conditional-structures-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

값은 모두 부호 없는 수다.

```
if( ebx <= ecx && ecx > edx )
{
    eax = 5;
    edx = 6;
}
```

```asm
    cmp ebx,ecx     ; ① 첫째 조건을 견준다
    ja  next        ; ② ebx <= ecx가 거짓이면 끝
    cmp ecx,edx     ; ① 둘째 조건을 견준다
    ______          ; ② 둘째 조건이 거짓이면 끝
    mov eax,5       ; ③ 몸통
    mov edx,6
next:               ; ④ 매듭짓기
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`jbe next`.<br>
`ecx > edx`의 반대는 `ecx <= edx`이고, 부호 없는 수의 "이하면"은 `jbe`다. `jb`를 쓰면 ECX와 EDX가 같을 때 몸통을 실행해 버린다. 조건 그대로 `ja next`를 쓰면 참일 때 건너뛰는 정반대 코드가 된다. EBX = 1, ECX = 5, EDX = 2에서 EAX가 5가 되지 않는다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

값은 모두 32비트 부호 있는 정수다.

```
if( eax < ebx || ecx == 0 )
    edx = 1;
else
    edx = 2;
```

```asm
    cmp eax,ebx     ; ① 첫째 조건을 견준다
    ______          ; ② 첫째 조건이 참이면 몸통으로
    cmp ecx,0       ; ① 둘째 조건을 견준다
    ______          ; ② 둘째 조건이 거짓이면 else로
L1: mov edx,1       ; ③ 몸통
    ______          ; ④ else를 건너뛴다
L2: mov edx,2       ;    else의 몸통
L3:
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
    jl  L1          ; ② 부호 있는 "작으면". 뒤집지 않는다
    jne L2          ; ② ==의 반대
    jmp L3          ; ④
```
OR에서는 앞 조건이 참이면 뒤 조건을 볼 것 없이 몸통으로 간다. 그래서 첫 점프는 조건 그대로다. 마지막 조건만 뒤집는다.<br>
첫 점프에 `jb`를 쓰면 틀린다. EAX = FFFFFFFDh(−3), EBX = 2, ECX = 7에서 `jl`은 뛰어 EDX = 1이지만, `jb`는 부호 없이 읽어 뛰지 않고 EDX = 2가 된다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [34_conditional-structures-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/34_conditional-structures-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

값은 모두 32비트 부호 없는 정수다. 다음 루프를 어셈블리어로 구현하라. EAX = 1, EBX = 8, ECX = 10으로 시작하면 끝났을 때 EAX와 ECX는 얼마인가?

```
while( eax < ebx && ecx != 0 )
{
    eax = eax + 2;
    ecx = ecx - 1;
}
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```asm
top: cmp eax,ebx    ; 첫째 조건
     jae next       ; eax < ebx가 거짓이면 루프를 나간다
     cmp ecx,0      ; 둘째 조건
     je  next       ; ecx != 0이 거짓이면 루프를 나간다
     add eax,2      ; 몸통
     dec ecx
     jmp top        ; 맨 위로
next:
```
EAX는 1 → 3 → 5 → 7 → 9로 네 바퀴 돈다. 9 < 8이 거짓이라 멈춘다. EAX = 9, ECX = 6이다.<br>
`while`은 `if`에 "맨 위로 돌아가는 `jmp`"를 붙인 것이고, AND라서 두 조건 모두 뒤집어 같은 `next`로 뛴다. `cmp ecx,0` / `je next` 두 줄은 `jecxz next` 한 줄로 바꿔도 같다.<br>
몸통의 `dec ecx` 바로 뒤에서 조건을 보려 하면 안 된다. 맨 위로 돌아가 두 조건을 처음부터 다시 봐야 한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [34_conditional-structures-ladder_p4.py](/Hongs_Blog/studies/assembly-language/code/34_conditional-structures-ladder_p4/)</div>

</div>


[^s1]: 답은 문제 코드에서 경계값의 모든 조합을 흉내기로 돌려 파이썬 `if`·`while`과 대조했다.
{% endraw %}
