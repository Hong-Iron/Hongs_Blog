---
layout: "note"
title: "간접 피연산자와 인덱스 피연산자"
display_title: "간접 피연산자와 인덱스 피연산자 (Indirect and Indexed Operands)"
kind: "concept"
kind_label: "기법"
num: "23"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Indirect Addressing", "간접 주소 지정", "Indirect Operand", "간접 피연산자", "Indexed Operand", "인덱스 피연산자", "Index Scaling", "인덱스 스케일링", "역참조", "Dereference", "포인터 변수", "Pointer Variable"]
description: "주소를 코드에 못 박아 두지 않고 레지스터에 넣어 둔 뒤 \"이 레지스터가 가리키는 곳의 값\"을 읽고 쓴다. 손가락으로 책의 한 줄을 짚고, 손가락을 한 줄씩 내려 가며 읽는 것과 같다. 레지스터 값만 바꾸면 같은 명령이 배열의 다음 칸을 다루므로 배열을 훑는 기본 수단이 된다. 다…"
prev_url: "/studies/assembly-language/type-lengthof-sizeof/"
prev_title: "TYPE·LENGTHOF·SIZEOF 연산자"
next_url: "/studies/assembly-language/jmp-loop/"
next_title: "JMP와 LOOP"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/indirect-addressing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주소를 코드에 못 박아 두지 않고 레지스터에 넣어 둔 뒤 "이 레지스터가 가리키는 곳의 값"을 읽고 쓴다. 손가락으로 책의 한 줄을 짚고, 손가락을 한 줄씩 내려 가며 읽는 것과 같다. 레지스터 값만 바꾸면 같은 명령이 배열의 다음 칸을 다루므로 배열을 훑는 기본 수단이 된다. 다만 레지스터에는 주소만 있고 칸의 크기가 없어서, 한 걸음을 몇 바이트로 할지와 몇 바이트를 읽을지를 프로그래머가 맞춰 줘야 한다.

</div>


## 예시로 보기

`arrayB+1`, `arrayB+2`처럼 이름에 수를 더하는 방법은 몇 번째 칸인지가 코드에 박혀 있다. 칸이 100개면 명령도 100줄이다. 칸 번호를 실행 중에 바꿀 수 있어야 같은 명령을 되풀이해 쓸 수 있다.

```asm
.data
val1 BYTE 10h,20h,30h
.code
mov esi,OFFSET val1     ; ESI에 val1의 주소를 넣는다
mov al,[esi]            ; ESI가 가리키는 곳의 값. AL = 10h
inc esi
mov al,[esi]            ; AL = 20h
inc esi
mov al,[esi]            ; AL = 30h
```

`[esi]`는 "ESI의 값"이 아니라 "ESI에 든 주소로 가서 거기 있는 값"이다. 이렇게 주소를 따라가 값을 얻는 일을 역참조라 부른다. `mov al,[esi]`라는 같은 명령이 세 번 나오지만 읽는 칸은 매번 다르다[^1].

```
ESI ──┐          inc esi 한 번에 한 칸
      ▼
    ┌────┬────┬────┐
val1│ 10 │ 20 │ 30 │
    └────┴────┴────┘
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `[esi]` 세 번의 값, 크기를 모르는 `inc [esi]`의 오류, 배열 합 추적(워드와 더블워드), 인덱스 피연산자, TYPE을 곱한 인덱스, 포인터 변수, 카드 C1·C3. 파이썬 흉내로 확인 — [23_indirect-addressing_verify.py](/Hongs_Blog/studies/assembly-language/code/23_indirect-addressing_verify/)</div>

</div>


## 정의

**간접 피연산자.** 변수(보통 배열이나 문자열)의 주소를 담고 있는 레지스터를 대괄호로 싼 것이다. 포인터처럼 역참조할 수 있다[^1].

**인덱스 피연산자.** 상수와 레지스터를 더해 유효 주소를 만든다. 쓰는 법이 둘이고 뜻은 같다[^2].

```
[이름 + 레지스터]          이름[레지스터]
```

두 방법 모두 읽는 주소를 식으로 쓰면 다음과 같다[^s1].

$$\text{간접: 주소} = \text{레지스터}, \qquad \text{인덱스: 주소} = \text{이름의 주소} + \text{레지스터}$$


간접 피연산자에서는 레지스터가 주소 전체를 들고 있고, 인덱스 피연산자에서는 레지스터가 "배열 시작에서 몇 바이트 뒤"만 들고 있다.

**포인터 변수.** 다른 변수의 오프셋을 값으로 담은 변수다[^3].

```asm
.data
arrayW WORD 1000h,2000h,3000h
ptrW   DWORD arrayW             ; ptrW DWORD OFFSET arrayW 라고 써도 같다
.code
mov esi,ptrW
mov ax,[esi]                    ; AX = 1000h
```

### 적용 조건과 알아보는 신호

- 배열이나 문자열의 칸을 차례로 다룬다 → 레지스터를 옮겨 가며 간접 또는 인덱스 피연산자.
- 어느 칸인지가 실행 중에 정해진다(계산한 번호, 건네받은 주소) → 같다.
- 칸 번호를 0, 1, 2, …로 세고 싶다 → 인덱스 피연산자에 원소 크기를 곱한다.
- 몇 번째 칸인지가 코드를 쓸 때 정해져 있다 → 이름에 상수를 더하는 쪽이 간단하다: [피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/).

## 예제

**크기를 밝혀야 할 때.** `[esi]`만으로는 그 자리를 바이트로 다룰지 워드로 다룰지 알 수 없다. 상대 피연산자가 레지스터면 그 크기를 따르지만, 상대가 없거나 즉시값이면 `PTR`로 크기를 밝혀야 한다[^4][^s1].

```asm
.data
myCount WORD 0
.code
mov esi,OFFSET myCount
inc [esi]               ; 오류: 크기를 알 수 없다
inc WORD PTR [esi]      ; 된다
add [esi],20            ; 이것도 PTR이 필요하다. 바이트일 수도, 워드일 수도, 더블워드일 수도 있다
```

크기에 따라 결과가 실제로 달라진다. 메모리에 `FF 01`이 있을 때 `inc BYTE PTR [esi]`는 `00 01`을, `inc WORD PTR [esi]`는 `00 02`를 남긴다[^s1].

**배열의 합.** 대괄호 안의 레지스터는 배열의 원소 크기만큼씩 올려야 한다[^5].

```asm
.data
arrayW WORD 1000h,2000h,3000h
.code
mov esi,OFFSET arrayW
mov ax,[esi]
add esi,2               ; add esi,TYPE arrayW 라고 써도 된다
add ax,[esi]
add esi,2
add ax,[esi]            ; AX = 배열의 합
```

`arrayW`가 00404000h에 있다고 할 때의 추적이다[^s1].

| 명령 | ESI | 읽는 자리의 값 | AX |
|---|---|---|---|
| `mov esi,OFFSET arrayW` | 00404000h | | |
| `mov ax,[esi]` | 00404000h | 1000h | 1000h |
| `add esi,2` | 00404002h | | 1000h |
| `add ax,[esi]` | 00404002h | 2000h | 3000h |
| `add esi,2` | 00404004h | | 3000h |
| `add ax,[esi]` | 00404004h | 3000h | 6000h |

슬라이드는 이 예를 더블워드 배열로 바꿔 보라고 한다. 바뀌는 곳은 걸음(2 → 4)과 레지스터 크기(AX → EAX)다[^s2].

```asm
.data
arrayD DWORD 10000h,20000h,30000h
.code
mov esi,OFFSET arrayD
mov eax,[esi]
add esi,4               ; add esi,TYPE arrayD
add eax,[esi]
add esi,4
add eax,[esi]           ; EAX = 60000h
```

**인덱스 피연산자.**[^2]

```asm
mov esi,0
mov ax,[arrayW + esi]       ; AX = 1000h
mov ax,arrayW[esi]          ; 같은 뜻
add esi,2
add ax,[arrayW + esi]       ; AX = 3000h
```

**칸 번호에 원소 크기를 곱한다.** 레지스터에 칸 번호를 두고, 주소를 만들 때 배열의 `TYPE`을 곱한다[^6].

```asm
.data
arrayB BYTE  0,1,2,3,4,5
arrayW WORD  0,1,2,3,4,5
arrayD DWORD 0,1,2,3,4,5
.code
mov esi,4
mov al,arrayB[esi*TYPE arrayB]      ; 04
mov bx,arrayW[esi*TYPE arrayW]      ; 0004
mov edx,arrayD[esi*TYPE arrayD]     ; 00000004
```

세 배열 모두 4번 칸을 읽는다. 곱하지 않고 `arrayW[esi]`, `arrayD[esi]`라고 쓰면 4바이트 뒤를 읽어 각각 2번 칸(값 2)과 1번 칸(값 1)이 나온다[^s1].

## 활용

- 되풀이 명령과 묶으면 배열 전체를 몇 줄로 훑는다: [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/).
- 자바의 `arr[i]`가 하는 일이 "배열 시작 주소 + i × 원소 크기"의 자리를 읽는 것이다. 자바는 `i`가 범위 안인지 확인해 주지만 여기서는 아무도 확인하지 않는다: [배열](/Hongs_Blog/studies/java/java-array/)[^s1].
- 포인터 변수는 자바의 참조 변수가 실제로 담고 있는 것, 곧 다른 것이 놓인 자리다: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)[^s1].
- 흔한 실수: 워드 배열에서 `inc esi`로 한 걸음을 간다. 오류 없이 원소 가운데를 읽는다(카드 C3).
- 흔한 실수: `mov [esi],5`처럼 크기를 밝히지 않고 즉시값을 쓴다.

## 연결

- 선수: [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/)(주소 얻기와 크기 밝히기), [TYPE·LENGTHOF·SIZEOF 연산자](/Hongs_Blog/studies/assembly-language/type-lengthof-sizeof/)(걸음의 크기)
- 스택에 놓인 값을 `[ebp + 8]`처럼 읽는 것도 같은 방법이다: [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `arr DWORD 5,7,9`가 00404000h에 있다. 다음을 차례로 실행할 때 줄마다 ESI와 EAX를 쓰라. `mov esi,OFFSET arr` / `mov eax,[esi]` / `add esi,4` / `add eax,[esi]` / `add esi,4` / `sub eax,[esi]`</summary>

**답:** ESI: 00404000h, 00404000h, 00404004h, 00404004h, 00404008h, 00404008h. EAX: (정해지지 않음), 5, 5, 12, 12, 3.<br>
**이유:** 더블워드라 한 걸음이 4바이트다. 5 + 7 = 12, 12 − 9 = 3.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `mov al,[esi]`는 `PTR` 없이 어셈블되는데 `inc [esi]`는 오류인 이유를 쓰라.</summary>

**답:** `[esi]`에는 주소만 있고 크기가 없다. `mov al,[esi]`에서는 상대 피연산자 AL이 8비트라 크기가 정해진다. `inc [esi]`에는 크기를 알려 줄 다른 피연산자가 없어 1, 2, 4바이트 가운데 무엇을 올릴지 정할 수 없다.<br>
**이유:** 변수 이름에는 정의할 때의 크기가 딸려 오지만 레지스터에 든 주소에는 딸려 오지 않는다. `add [esi],20`도 즉시값 20에 크기가 없어 같은 오류다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `arrayW WORD 1234h,5678h`에서 "다음 원소로 가려면 `inc esi`면 된다"가 틀렸음을 보여라. `mov esi,OFFSET arrayW` / `inc esi` / `mov ax,[esi]` 뒤의 AX는?</summary>

**답:** AX = 7812h. 둘째 원소 5678h가 아니다.<br>
**이유:** 메모리는 `34 12 78 56`이다. ESI를 1만 올리면 +1 자리의 `12 78`을 읽어, 첫 원소의 윗바이트와 둘째 원소의 아랫바이트가 붙은 7812h가 된다. 워드 배열의 걸음은 2(`TYPE arrayW`)다.

</details>


[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-3」, p.8 (Indirect Operands 1: val1, `[esi]`의 역참조)
[^2]: 같은 자료, p.11 (Indexed Operands: 두 가지 쓰는 법)
[^3]: 같은 자료, p.13 (Pointers: ptrW)
[^4]: 같은 자료, p.9 (Indirect Operands 2: `inc [esi]`는 모호하다, `add [esi],20`에도 PTR이 필요하다)
[^5]: 같은 자료, p.10 (Array Sum Example)
[^6]: 같은 자료, p.12 (Index Scaling)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 손가락 그림, 주소 식, 알아보는 신호, 상대 피연산자가 레지스터면 그 크기를 따른다는 설명, `FF 01`에서 크기에 따라 결과가 갈리는 예, 배열 합 추적 표, TYPE을 곱하지 않았을 때의 값, 자바와의 비교, 흔한 실수, 카드 C1~C3은 원본에 없다. 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.10과 p.11의 "ToDo: Modify this example for an array of doublewords"에 대한 답으로, 원본에는 답이 없다. 파이썬 흉내에서 EAX = 60000h를 확인했다.
{% endraw %}
