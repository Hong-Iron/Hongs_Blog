---
layout: "note"
title: "리틀 엔디언"
display_title: "리틀 엔디언 (Little Endian)"
kind: "concept"
kind_label: "정의"
num: "13"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Little Endian", "Little Endian Order", "리틀 엔디언 순서", "바이트 순서", "Byte Order", "빅 엔디언", "Big Endian", "최하위 바이트", "Least Significant Byte"]
description: "여러 바이트짜리 수를 메모리에 적을 때 인텔 CPU는 가장 아랫자리 바이트를 가장 낮은 주소에 둔다. 1234를 칸마다 한 덩이씩 \"34, 12\" 순서로 적는 셈이다. 레지스터로 통째로 읽으면 CPU가 알아서 원래 순서로 돌려놓으므로 평소에는 신경 쓸 일이 없다. 하지만 메모리를 …"
prev_url: "/studies/assembly-language/asm-data-definition/"
prev_title: "데이터 정의"
next_url: "/studies/assembly-language/symbolic-constants/"
next_title: "기호 상수와 위치 카운터"
math: true
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/little-endian/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여러 바이트짜리 수를 메모리에 적을 때 인텔 CPU는 가장 아랫자리 바이트를 가장 낮은 주소에 둔다. 1234를 칸마다 한 덩이씩 "34, 12" 순서로 적는 셈이다. 레지스터로 통째로 읽으면 CPU가 알아서 원래 순서로 돌려놓으므로 평소에는 신경 쓸 일이 없다. 하지만 메모리를 한 바이트씩 들여다보거나 큰 값의 일부만 꺼낼 때는 뒤집힌 순서를 직접 따져야 한다.

</div>


## 예시로 보기

메모리 한 칸은 1바이트다. 4바이트짜리 수 12345678h는 네 칸에 나눠 담아야 한다. 어느 바이트를 첫 칸에 둘까? 정해 두지 않으면 쓴 쪽과 읽는 쪽이 서로 다른 수를 보게 된다.

```asm
val1 DWORD 12345678h
```

```
주소     0000   0001   0002   0003
바이트    78     56     34     12
        아랫자리 ───────────► 윗자리
```

가장 아랫자리 바이트 78h가 가장 낮은 주소 0000에 간다[^1]. 종이에 쓰는 순서(12 34 56 78)와 반대다. 뒤집히는 단위는 바이트다. 16진수 두 자리가 한 덩이로 움직이고, 78이 87이 되지는 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 12345678h의 배치, 읽으면 원래 값이 되는 것, 16비트 값 표본에서 쓰고 읽기 왕복, 배열과 문자열의 배치, 카드 C1~C3. 파이썬 흉내로 확인 — [13_little-endian_verify.py](/Hongs_Blog/studies/assembly-language/code/13_little-endian_verify/)</div>

</div>


## 정의

1바이트보다 큰 자료형은 바이트를 거꾸로 저장한다. 가장 아랫자리 바이트(least significant byte)가 첫 번째, 곧 가장 낮은 주소에 온다[^1]. 인텔이 정수를 메모리에 저장하는 방식이다[^2].

기호로 쓰면, $$n$$바이트 값 $$v$$를 주소 $$A$$에 저장할 때 주소 $$A + k$$에 들어가는 바이트 $$b_k$$는 다음과 같다. $$k$$는 0부터 $$n - 1$$까지의 칸 번호다[^s1].

$$b_k = \left\lfloor \frac{v}{256^k} \right\rfloor \bmod 256, \qquad v = \sum_{k=0}^{n-1} b_k \cdot 256^k$$


왼쪽 식은 "$$v$$를 256으로 $$k$$번 나눈 몫의 마지막 바이트"다. 오른쪽 식은 읽을 때 하는 일로, 주소가 $$k$$만큼 높은 바이트에 자릿값 $$256^k$$을 곱해 더한다. 12345678h라면 $$78\text{h} + 56\text{h} \cdot 256 + 34\text{h} \cdot 256^2 + 12\text{h} \cdot 256^3$$이다.

메모리에서 레지스터로 정수를 읽으면 바이트가 자동으로 다시 뒤집혀 제자리에 들어간다[^2]. `mov eax,val1` 뒤의 EAX는 12345678h다.

## 예제

**뒤집히는 것과 그대로인 것.**[^s1]

| 정의 | 메모리(낮은 주소부터) | 무엇이 뒤집혔나 |
|---|---|---|
| `w WORD 1234h` | `34 12` | 워드 안의 두 바이트 |
| `arr WORD 1,2` | `01 00 02 00` | 원소 안의 바이트만. 원소의 순서는 그대로다 |
| `s BYTE "ABCD"` | `41 42 43 44` | 없다. 1바이트짜리는 뒤집을 것이 없다 |
| `x DWORD 41424344h` | `44 43 42 41` | 더블워드 안의 네 바이트 |

마지막 두 줄은 종이에 쓴 모양이 같아 보여도 메모리 배치는 정반대다.

## 활용

- 디버거의 메모리 창은 낮은 주소부터 바이트를 보여 준다. `78 56 34 12`가 보이면 더블워드 12345678h다.
- 큰 값의 일부만 꺼낼 때 순서를 따진다. `val1`의 주소에서 2바이트를 읽으면 윗자리 1234h가 아니라 아랫자리 5678h가 나온다: [OFFSET과 PTR 연산자](/Hongs_Blog/studies/assembly-language/offset-ptr-operators/).
- 윗자리 바이트를 낮은 주소에 두는 방식도 있다(빅 엔디언). 순서가 다른 기계끼리 바이트를 주고받을 때는 한쪽이 뒤집어야 한다[^s1].

## 연결

- 선수: [데이터 정의](/Hongs_Blog/studies/assembly-language/asm-data-definition/)
- 자릿값을 곱해 더하면 수가 된다는 원리(여기서는 256진법): [진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)
- 배열 원소의 가운데 주소를 읽으면 생기는 일: [피연산자의 종류](/Hongs_Blog/studies/assembly-language/operand-types/)
- 연습: [PTR과 리틀 엔디언 예제 사다리](/Hongs_Blog/studies/assembly-language/ptr-little-endian-ladder/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `v DWORD 0A1B2C3Dh`가 주소 0000부터 놓인다. 주소 0000~0003의 바이트를 순서대로 쓰라.</summary>

**답:** `3D 2C 1B 0A`.<br>
**이유:** 가장 아랫자리 바이트 3Dh가 가장 낮은 주소에 간다. 16진수 한 자리씩 뒤집어 `D3 C2 B1 A0`으로 쓰면 틀린다. 바이트 안의 두 자리는 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `a WORD 1000h,2000h`의 메모리는 (가) `00 10 00 20` (나) `20 00 10 00` (다) `10 00 20 00` 가운데 무엇인가? 나머지는 왜 아닌가?</summary>

**답:** (가).<br>
**이유:** 원소는 적은 순서대로 놓이고, 각 원소 안에서만 아랫자리 바이트가 앞에 온다. (나)는 배열 전체를 뒤집었다. 원소의 순서는 바뀌지 않는다. (다)는 아무것도 뒤집지 않은 빅 엔디언 배치다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 메모리에 낮은 주소부터 `EF CD AB 89`가 있다. 이 네 바이트를 더블워드 하나로 읽은 값과, 워드 둘로 읽은 값을 쓰라.</summary>

**답:** 더블워드 89ABCDEFh. 워드로는 앞의 것이 CDEFh, 뒤의 것이 89ABh.<br>
**이유:** 높은 주소의 바이트가 윗자리가 된다. 같은 바이트라도 몇 바이트씩 묶어 읽느냐에 따라 값이 달라진다.

</details>


[^1]: 어셈블리어 4회 강의 자료 「wk04-chapt_03-4-3」, p.4 (Little Endian Order: 정의, `val1 DWORD 12345678h`의 메모리 그림)
[^2]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-2」, p.13 (Little Endian Order: 인텔의 정수 저장 방식, 읽을 때 자동으로 다시 뒤집힌다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 기호로 쓴 식, 예제 표, 빅 엔디언 언급, 활용 항목, 카드 C1~C3은 원본에 없다. 식은 슬라이드의 정의를 자릿값으로 옮긴 것이고, 표와 카드의 값은 파이썬 흉내로 확인했다. 실제 어셈블러로 돌린 결과가 아니다.
{% endraw %}
