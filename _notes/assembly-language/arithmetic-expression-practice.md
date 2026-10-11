---
layout: "note"
title: "산술식을 어셈블리로 옮기기 연습"
display_title: "산술식을 어셈블리로 옮기기 연습"
kind: "practice"
kind_label: "연습"
num: "18"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 덧셈·뺄셈 명령의 ADD, SUB, NEG와 데이터 전송 명령의 MOV."
prev_url: "/studies/assembly-language/asm-hex-practice/"
prev_title: "16진 계산과 2의 보수 연습"
next_url: "/studies/assembly-language/flag-tracing-ladder/"
next_title: "플래그 추적 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/arithmetic-expression-practice/"
---
{% raw %}
사용 개념: [덧셈·뺄셈 명령](/Hongs_Blog/studies/assembly-language/add-sub-instructions/)의 `ADD`, `SUB`, `NEG`와 [데이터 전송 명령](/Hongs_Blog/studies/assembly-language/data-transfer-instructions/)의 `MOV`.

세 문제 모두 같은 데이터를 쓴다. 값은 모두 부호 있는 더블워드다.

```asm
.data
Rval SDWORD ?
Xval SDWORD 26
Yval SDWORD 30
Zval SDWORD 40
```

**풀이 전략.** 식을 손으로 계산할 때의 순서를 그대로 적는다. ① 괄호와 부호로 식을 덩어리로 나눈다 ② 덩어리마다 레지스터 하나를 정해 변수 값을 가져온다(변수 자체는 건드리지 않는다) ③ 그 레지스터에서 계산한다 ④ 덩어리끼리 합친다 ⑤ 결과를 `Rval`에 적는다. 명령의 받는 쪽이 계산 결과로 덮이므로, 변수를 받는 쪽에 두는 순간 그 변수는 바뀐다. 이것이 ②에서 레지스터로 가져오는 까닭이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 문제와 변형의 결과 값(−36, 16, −34), 변수 세 개가 그대로인 것, 무작위 값 2,000벌에서 식의 값과 같은 것. 파이썬 흉내로 확인 — [18_arithmetic-expression-practice_p3.py](/Hongs_Blog/studies/assembly-language/code/18_arithmetic-expression-practice_p3/)</div>

</div>


## 문제 p1

`Rval = -Xval + (Yval - Zval)`을 어셈블리로 옮기라[^1].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *덩어리 나누기:* `-Xval`과 `(Yval - Zval)` 두 덩어리를 더한다.
2. *첫 덩어리(EAX):* `Xval`을 가져와 부호를 바꾼다.
3. *둘째 덩어리(EBX):* `Yval`을 가져와 `Zval`을 뺀다.
4. *합치기:* EAX에 EBX를 더한다.
5. *저장:* EAX를 `Rval`에 적는다.

```asm
mov eax,Xval
neg eax              ; EAX = -26
mov ebx,Yval
sub ebx,Zval         ; EBX = -10
add eax,ebx
mov Rval,eax         ; -36
```

*검증:* −26 + (30 − 40) = −36. `Rval`에 들어가는 비트는 FFFFFFDCh다.

</details>


**변형.** 같은 식을 레지스터 하나(EAX)만 써서 옮기라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

식을 먼저 바꾼다. −Xval + (Yval − Zval) = Yval − Zval − Xval이다. 왼쪽부터 차례로 빼면 덩어리가 하나라 레지스터도 하나면 된다.

```asm
mov eax,Yval
sub eax,Zval         ; EAX = -10
sub eax,Xval         ; EAX = -36
mov Rval,eax
```

</details>


## 문제 p2

`Rval = Xval - (-Yval + Zval)`을 어셈블리로 옮기라. `Xval`, `Yval`, `Zval`이 바뀌면 안 된다[^2].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *덩어리 나누기:* `Xval`에서 괄호 덩어리 `(-Yval + Zval)`을 뺀다. 빼는 쪽을 먼저 만들어 둔다.
2. *괄호 덩어리(EBX):* `Yval`을 가져와 부호를 바꾸고 `Zval`을 더한다.
3. *앞 덩어리(EAX):* `Xval`을 가져온다.
4. *합치기:* EAX에서 EBX를 뺀다.
5. *저장.*

```asm
mov ebx,Yval
neg ebx              ; EBX = -30
add ebx,Zval         ; EBX = 10
mov eax,Xval
sub eax,ebx          ; EAX = 16
mov Rval,eax
```

*검증:* 26 − (−30 + 40) = 16.<br>
*흔한 오답:* 첫 줄을 `neg Yval`로 시작한다. `Rval`은 똑같이 16이 되지만 `Yval`이 −30으로 바뀌어 문제의 조건을 어긴다.

</details>


## 문제 p3

`Rval = (Xval - Yval) + (-Zval + 10)`을 어셈블리로 옮기라. 변수는 바뀌면 안 된다[^s1].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *덩어리 나누기:* `(Xval - Yval)`과 `(-Zval + 10)`.
2. *첫 덩어리(EAX):* `Xval`에서 `Yval`을 뺀다.
3. *둘째 덩어리(EBX):* `Zval`의 부호를 바꾸고 10을 더한다.
4. *합치기와 저장.*

```asm
mov eax,Xval
sub eax,Yval         ; EAX = -4
mov ebx,Zval
neg ebx              ; EBX = -40
add ebx,10           ; EBX = -30
add eax,ebx          ; EAX = -34
mov Rval,eax
```

*검증:* (26 − 30) + (−40 + 10) = −34.

</details>


**변형.** `NEG`를 쓰지 않고 EAX 하나로 옮기라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

괄호를 풀면 Xval − Yval − Zval + 10이다.

```asm
mov eax,Xval
sub eax,Yval
sub eax,Zval
add eax,10           ; EAX = -34
mov Rval,eax
```

부호를 바꿔 더하는 것은 그냥 빼는 것과 같다. 식을 먼저 정리하면 명령 수가 준다.

</details>


[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-1」, p.9 (Implementing Arithmetic Expressions: 식과 코드)
[^2]: 같은 자료, p.10 (Your turn: 식과 답 코드)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 풀이 전략, 풀이의 단계 이름, 흔한 오답, 문제 p1의 변형, 문제 p3과 그 변형은 원본에 없다. 슬라이드는 변수를 `DWORD`로 정의하고 "부호 있는 더블워드로 본다"고 적는다. 여기서는 `SDWORD`로 적었다. 메모리에 들어가는 바이트는 같다. 결과는 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
