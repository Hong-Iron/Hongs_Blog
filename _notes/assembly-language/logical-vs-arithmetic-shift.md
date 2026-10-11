---
layout: "note"
title: "논리 시프트와 산술 시프트 비교"
display_title: "논리 시프트와 산술 시프트 비교"
kind: "concept"
kind_label: "비교"
num: "38"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Logical Shift vs Arithmetic Shift", "논리 시프트", "Logical Shift", "산술 시프트", "Arithmetic Shift", "SHR vs SAR"]
description: "둘 다 비트를 한쪽으로 밀고 밀려난 비트를 CF에 넣는다. 가르는 질문은 하나다. \"오른쪽으로 밀 때 맨 위에 생긴 빈칸을 무엇으로 채우는가.\" 0으로 채우면 논리 시프트(SHR), 원래 맨 위 비트를 한 번 더 써서 채우면 산술 시프트(SAR)다. 그 답은 다시 \"이 비트들을 부…"
prev_url: "/studies/assembly-language/shift-instructions/"
prev_title: "시프트 명령"
next_url: "/studies/assembly-language/rotate-instructions/"
next_title: "회전 명령"
math: true
mermaid: false
code_count: 0
permalink: "/studies/assembly-language/logical-vs-arithmetic-shift/"
---
{% raw %}
둘 다 비트를 한쪽으로 밀고 밀려난 비트를 CF에 넣는다. 가르는 질문은 하나다. "오른쪽으로 밀 때 맨 위에 생긴 빈칸을 무엇으로 채우는가." 0으로 채우면 논리 시프트(`SHR`), 원래 맨 위 비트를 한 번 더 써서 채우면 산술 시프트(`SAR`)다[^1]. 그 답은 다시 "이 비트들을 부호 없는 수로 읽는가, 부호 있는 수로 읽는가"로 정해진다.

같은 비트 `11001111`을 오른쪽으로 한 칸 민 슬라이드의 그림이다[^1].

```
            7 6 5 4 3 2 1 0     CF
밀기 전     [1 1 0 0 1 1 1 1]
SHR 뒤      [0 1 1 0 0 1 1 1]    1      맨 위에 0이 들어왔다
SAR 뒤      [1 1 1 0 0 1 1 1]    1      맨 위에 원래 부호 비트 1이 들어왔다
```

부호 없는 수로 읽으면 207이 103이 됐다(`SHR`). 부호 있는 수로 읽으면 −49가 −25가 됐다(`SAR`). 둘 다 "2로 나눈 값"인데, 같은 비트를 어떻게 읽느냐에 따라 맞는 명령이 다르다[^s1].

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) AL에 든 픽셀 밝기(0~255)를 절반으로 줄인다. (b) AL에 든 온도 변화량(−128~127)을 절반으로 줄인다. 각각 `SHR`과 `SAR` 중 무엇을 쓰는가? 반대로 쓰면 어떻게 되는가?</summary>

**답:** (a) `SHR`. 밝기 200(`11001000`)에 `SAR`을 쓰면 맨 위에 1이 들어와 `11100100` = 228로 오히려 커진다. (b) `SAR`. −80(`10110000`)에 `SHR`을 쓰면 맨 위에 0이 들어와 `01011000` = 88, 부호가 뒤집힌다.<br>
**이유:** 빈칸을 채우는 값이 "이 수의 윗자리가 원래 무엇이었어야 하는가"와 맞아야 한다. 부호 없는 수의 윗자리는 0이고, 음수의 윗자리는 1이다[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) EAX의 위쪽 16비트를 아래쪽으로 내려 그 값만 꺼낸다. (d) 왼쪽으로 민다. 각각 논리와 산술 중 무엇인가?</summary>

**답:** (c) `shr eax,16`. 비트 묶음을 꺼낼 때는 수의 부호와 상관없이 빈칸이 0이어야 한다. `SAR`을 쓰면 맨 위 비트가 1일 때 윗자리가 전부 1로 찬다. (d) 고를 것이 없다. `SAL`과 `SHL`은 같은 명령이다. 왼쪽으로 밀 때는 아래쪽 빈칸에 늘 0이 들어온다[^2].

</details>


## 결정적 차이

| | 논리 오른쪽 시프트 `SHR` | 산술 오른쪽 시프트 `SAR` |
|---|---|---|
| 맨 위 빈칸 | 0 | 원래 부호 비트의 복사 |
| 맞는 읽기 | 부호 없는 수, 비트 묶음 | 부호 있는 수(2의 보수) |
| 계산하는 값 | $$\lfloor u / 2^n \rfloor$$ | $$\lfloor s / 2^n \rfloor$$ |
| 부호 | 결과는 늘 0 이상으로 읽힌다 | 그대로다 |
| 맨 위 비트가 0인 값 | 두 명령의 결과가 같다 | 같다 |
| 왼쪽 방향 | `SHL` | `SAL`(= `SHL`) |
| Java 연산자 | `>>>` | `>>` |

$$u$$는 비트를 부호 없는 수로 읽은 값, $$s$$는 부호 있는 수로 읽은 값, $$n$$은 민 칸 수다. $$\lfloor\ \rfloor$$는 작은 쪽 정수로 내린다는 뜻이다. 선택을 가르는 줄은 "맞는 읽기"다. 맨 위 비트가 0인 값(8비트에서 0~127)에서는 둘이 같은 결과를 내므로, 차이는 맨 위 비트가 1일 때만 드러난다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 그림의 두 결과, 8비트 256가지 값 × 0~8칸에서 `SHR`은 $$\lfloor u/2^n \rfloor$$, `SAR`은 $$\lfloor s/2^n \rfloor$$, −80에 `SHR`을 쓰면 88, −5를 `SAR`로 한 칸 밀면 −3 — [37_shift-instructions_verify.py](/Hongs_Blog/studies/assembly-language/code/37_shift-instructions_verify/) (파이썬 흉내로 확인)</div>

</div>


**산술 시프트는 아래쪽으로 내린다.** −5(`11111011`)를 `SAR`로 한 칸 밀면 `11111101` = −3이다. −5 ÷ 2 = −2.5를 0 쪽(−2)이 아니라 작은 쪽(−3)으로 내린다. −1은 몇 칸을 밀어도 −1이다. C나 Java의 정수 나눗셈 `-5 / 2`는 −2이므로, 음수에서는 "오른쪽으로 밀기"와 "나누기"의 결과가 다를 수 있다[^s1].

## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 논리 시프트도 산술 시프트도 맞지 않는 상황 두 가지와 그때 쓸 명령을 쓰라.</summary>

**답:** ① 밀려난 비트를 잃으면 안 될 때(비트 순서만 바꾸고 싶을 때)는 밀려난 비트가 반대쪽 끝으로 돌아오는 [회전 명령](/Hongs_Blog/studies/assembly-language/rotate-instructions/)을 쓴다. ② 빈칸을 0이나 부호가 아니라 이웃 레지스터의 비트로 채워야 할 때(두 레지스터에 걸친 큰 수를 밀 때)는 [이중 시프트 SHLD·SHRD](/Hongs_Blog/studies/assembly-language/double-shift/)나 CF를 끼워 돌리는 `RCL`·`RCR`을 쓴다.

</details>


## 연결

- 작은 값을 큰 칸으로 옮길 때도 같은 갈림이 있다. 윗자리를 0으로 채우는 `MOVZX`와 부호로 채우는 `MOVSX`: [제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)
- 비교한 뒤 점프를 고를 때도 같은 갈림이 있다: [부호 있는 비교 점프와 부호 없는 비교 점프](/Hongs_Blog/studies/assembly-language/signed-vs-unsigned-jumps/)

[^1]: 어셈블리어 10회 강의 자료 「wk10-chapt_07-3-1」, p.4~5 (논리 시프트와 산술 시프트의 뜻, `11001111`을 한 칸 민 그림)
[^2]: 같은 자료, p.9 ("SAL은 SHL과 같다", 산술 시프트는 부호를 지킨다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 207·103, −49·−25로 읽은 값, 카드의 상황과 수치, 표의 식과 Java 연산자 줄, 내림 방향 설명은 원본에 없다. 수치는 검증 줄의 파이썬 흉내로 확인했다.
{% endraw %}
