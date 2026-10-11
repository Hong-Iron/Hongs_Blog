---
layout: "note"
title: "OFFSET과 LEA 비교"
display_title: "OFFSET과 LEA 비교"
kind: "concept"
kind_label: "비교"
num: "45"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["OFFSET vs LEA", "LEA", "Load Effective Address", "유효 주소", "Effective Address", "ADDR"]
description: "둘 다 \"이 변수가 메모리의 어디에 있는가\"를 레지스터에 넣을 때 쓴다. 가르는 질문은 \"그 주소를 프로그램을 돌리기 전에 알 수 있는가\"다. 알 수 있으면 OFFSET, 돌려 봐야 알면 LEA다."
prev_url: "/studies/assembly-language/local-variables/"
prev_title: "지역 변수"
next_url: "/studies/assembly-language/invoke-proc-proto/"
next_title: "INVOKE·PROC·PROTO 지시어"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/offset-vs-lea/"
---
{% raw %}
둘 다 "이 변수가 메모리의 어디에 있는가"를 레지스터에 넣을 때 쓴다. 가르는 질문은 "그 주소를 프로그램을 돌리기 전에 알 수 있는가"다. 알 수 있으면 `OFFSET`, 돌려 봐야 알면 `LEA`다[^1].

- `OFFSET`은 어셈블러가 번역할 때 주소를 계산해 상수로 박아 넣는 연산자다. 실행될 때는 이미 숫자다. 그래서 번역할 때 자리가 정해진 것(`.data`의 변수)에만 쓸 수 있다.
- `LEA`는 실행될 때 CPU가 주소를 계산하는 명령이다. `[ebp-8]`처럼 레지스터 값에 따라 달라지는 주소도 구한다.

스택 매개변수와 지역 변수는 EBP에서의 거리로만 정해진다. EBP는 프로시저가 불릴 때마다 다를 수 있다. 슬라이드는 이 둘의 주소를 얻으려면 `LEA`가 필요하다고 적는다[^1].

```asm
CopyString PROC,
    count:DWORD
    LOCAL temp[20]:BYTE

    mov edi,OFFSET count      ; 오류: 스택 매개변수
    mov esi,OFFSET temp       ; 오류: 지역 변수
    lea edi,count             ; 된다
    lea esi,temp              ; 된다
```

이름을 붙이지 않고 `[ebp-8]`에 있는 지역 변수라면 이렇게 쓴다[^2].

```asm
mov esi,OFFSET [ebp-8]        ; 오류
lea esi,[ebp-8]               ; ESI = EBP - 8
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 식 `[ebp-8]`의 주소가 바깥 호출에서는 00000FF0h, 그 안에서 불린 호출에서는 00000FE0h로 다르다. 스택이 다른 곳에서 시작하면 또 달라진다. 전역 변수의 `OFFSET`은 그대로다. `lea`는 주소를, `mov`는 그 자리의 값을 넣는다 — [45_offset-vs-lea_verify.py](/Hongs_Blog/studies/assembly-language/code/45_offset-vs-lea_verify/) (실제 어셈블러가 아니라 파이썬 흉내로 확인)</div>

</div>


## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) `.data`에 `msg BYTE "Hello",0`이 있다. 이 문자열의 주소를 EDX에 넣는다. (b) 프로시저 안에서 `LOCAL buf[20]:BYTE`로 만든 배열의 주소를 ESI에 넣는다. 각각 어떻게 쓰는가?</summary>

**답:** (a) `mov edx,OFFSET msg`. (b) `lea esi,buf`.<br>
**이유:** `msg`의 자리는 번역할 때 정해진다. `buf`의 자리는 이 프로시저가 불린 순간의 EBP에서 20바이트 아래이고, EBP는 실행해 봐야 안다. (a)를 `lea edx,msg`로 써도 같은 주소가 들어간다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 스택 매개변수 `count:DWORD`의 값을 ECX에 넣는다. (d) 같은 매개변수의 주소를 EDI에 넣는다. 어느 쪽에 `LEA`가 필요한가?</summary>

**답:** (c)는 주소가 아니라 값이 필요하므로 `mov ecx,count`(곧 `mov ecx,[ebp+8]`)다. (d)는 `lea edi,count`다. `mov edi,OFFSET count`는 오류다.<br>
**이유:** `MOV`는 그 자리에 든 값을 읽고, `LEA`는 그 자리가 어디인지만 계산한다. `[ebp-8]`에 55h가 들어 있고 그 주소가 0FF4h일 때 `mov`는 55h를, `lea`는 0FF4h를 넣는다[^s1].

</details>


## 결정적 차이

| | `OFFSET` | `LEA` |
|---|---|---|
| 정체 | 연산자 (어셈블러가 번역할 때 계산) | 명령 (CPU가 실행할 때 계산) |
| 결과 | 상수 | 그 순간의 레지스터 값으로 계산한 주소 |
| 전역 변수(`.data`) | 된다 | 된다 |
| 스택 매개변수, 지역 변수 | 안 된다 | 된다 |
| `[ebp-8]`, `[esi+4]` 같은 식 | 안 된다 | 된다 |
| 쓰는 꼴 | `mov esi,OFFSET 이름` | `lea esi,피연산자` |

선택을 가르는 줄은 "결과"다. 지역 변수의 주소가 상수일 수 없다는 것은 프로시저를 두 깊이에서 불러 보면 드러난다. 바깥 프로시저와 그 안에서 불린 프로시저가 똑같이 `sub esp,8` 뒤 `lea reg,[ebp-8]`을 하면, 바깥은 00000FF0h를, 안쪽은 00000FE0h를 얻는다. 식은 같은데 값이 다르다. 번역할 때 하나의 숫자로 정해 둘 수가 없다[^s1].

## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 주소를 구하는 것처럼 보이지만 `OFFSET`도 `LEA`도 직접 쓰지 않는 경우 둘을 쓰라.</summary>

**답:** ① `INVOKE`로 프로시저를 부르면서 변수의 주소를 인수로 넘길 때는 `ADDR`을 쓴다(`INVOKE Sub2,ADDR byteVal`)[^3]. ② 주소가 아니라 그 자리의 값이 필요하면 `MOV`를 쓴다. 이미 주소가 레지스터에 들어 있으면 `[esi]`로 따라가 읽는다.

</details>


## 연결

- `OFFSET`의 뜻과 전역 변수에서의 쓰임: [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/)
- 번역할 때 처리되는 것과 실행할 때 처리되는 것의 구분: [지시어와 명령어 비교](/Hongs_Blog/studies/assembly-language/directive-vs-instruction/)
- `LEA`가 필요한 대상: [지역 변수](/Hongs_Blog/studies/assembly-language/local-variables/), [스택 매개변수](/Hongs_Blog/studies/assembly-language/stack-parameters/)
- `ADDR`: [INVOKE·PROC·PROTO 지시어](/Hongs_Blog/studies/assembly-language/invoke-proc-proto/)

[^1]: 어셈블리어 11회 강의 자료 「wk11-chapt_08-2-1」, p.8 (LEA는 직접·간접 피연산자의 주소를 돌려준다, OFFSET은 상수 주소만, 스택 매개변수와 지역 변수에는 LEA, CopyString 예)
[^2]: 같은 자료, p.9 (`mov esi, OFFSET [ebp-8]`은 오류, `lea esi,[ebp-8]`)
[^3]: 같은 자료, p.18 (INVOKE의 인수로 쓰는 ADDR)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 번역할 때와 실행할 때로 가른 설명, 두 깊이에서 주소가 다른 예와 수치, 전역 변수에 LEA를 써도 된다는 말, 카드의 상황과 답은 원본에 없다. 수치는 실제 어셈블러가 아니라 파이썬 흉내로 확인했다(검증 줄의 코드).
{% endraw %}
