---
layout: "note"
title: "올림 플래그와 넘침 플래그 비교"
display_title: "올림 플래그와 넘침 플래그 비교"
kind: "concept"
kind_label: "비교"
num: "20"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Carry Flag vs Overflow Flag", "CF vs OF", "CF와 OF 비교", "캐리와 오버플로 비교"]
description: "둘 다 \"결과가 칸에 안 들어갔다\"를 알린다. 가르는 질문은 \"지금 이 비트들을 음수가 없는 수로 쓰고 있는가, 음수가 있는 수로 쓰고 있는가\"다. CPU는 이 답을 모르므로 덧셈과 뺄셈마다 두 플래그를 다 정해 둔다. 프로그래머가 자기 답에 맞는 쪽 하나만 읽는다."
prev_url: "/studies/assembly-language/x86-status-flags/"
prev_title: "산술 연산과 상태 플래그"
next_url: "/studies/assembly-language/offset-ptr-operators/"
next_title: "OFFSET과 PTR 연산자"
math: false
mermaid: false
code_count: 0
permalink: "/studies/assembly-language/carry-vs-overflow-flag/"
---
{% raw %}
둘 다 "결과가 칸에 안 들어갔다"를 알린다. 가르는 질문은 "지금 이 비트들을 음수가 없는 수로 쓰고 있는가, 음수가 있는 수로 쓰고 있는가"다. CPU는 이 답을 모르므로 덧셈과 뺄셈마다 두 플래그를 다 정해 둔다[^1]. 프로그래머가 자기 답에 맞는 쪽 하나만 읽는다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 바이트에 담은 두 파일 크기 200과 100을 `add al,bl`로 더했다. (b) 바이트에 담은 두 기온 변화량 +100과 +50을 `add al,bl`로 더했다. 각각 어느 플래그로 결과를 믿을 수 있는지 확인하는가? 그 플래그의 값과 AL은?</summary>

**답:** (a) 올림 플래그. 크기는 음수가 없는 수다. 200 + 100 = 300은 0~255 밖이라 CF = 1, AL = 44(300 − 256). (b) 넘침 플래그. 변화량은 음수가 있는 수다. 100 + 50 = 150은 −128~127 밖이라 OF = 1, AL = 96h(부호 있게 읽으면 −106).<br>
**이유:** (a)에서 OF는 0이고 (b)에서 CF는 0이다. 반대쪽 플래그를 보면 "문제없다"로 잘못 읽는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `mov al,0FFh` 다음에 `add al,1`을 했더니 AL = 00h, CF = 1, OF = 0이다. 이 결과는 맞는 계산인가, 틀린 계산인가?</summary>

**답:** 어느 쪽으로 쓰고 있었느냐에 달렸다. FFh를 255로 쓰고 있었다면 틀렸다(256이 0이 됐다, CF = 1이 그것을 알린다). −1로 쓰고 있었다면 맞았다(−1 + 1 = 0, OF = 0이 그것을 알린다).<br>
**이유:** 두 플래그는 같은 계산에 대한 서로 다른 질문의 답이다. 한 계산에서 둘의 값이 달라도 모순이 아니다.

</details>


## 결정적 차이

| | 올림 플래그 CF | 넘침 플래그 OF |
|---|---|---|
| 보는 해석 | 부호 없는 수[^2] | 부호 있는 수(2의 보수)[^3] |
| 8비트의 범위 | 0 ~ 255 | −128 ~ 127 |
| 덧셈에서 켜지는 때 | 참값이 범위보다 크다 | 양수 둘의 합이 음수로, 또는 음수 둘의 합이 양수로 나왔다[^4] |
| 뺄셈에서 켜지는 때 | 작은 수에서 큰 수를 뺐다(0 아래로 내려갔다) | 부호가 다른 두 수를 뺐는데 결과의 부호가 앞의 수와 다르다[^s1] |
| 회로가 정하는 법 | 맨 윗자리 비트에서 나간 올림(뺄셈은 뒤집는다) | 맨 윗자리 비트로 들어온 올림 XOR 나간 올림 |
| `INC`, `DEC` | 바꾸지 않는다[^s1] | 바꾼다 |

선택을 가르는 줄은 첫 줄 하나다. 나머지는 그 해석을 따라온다.

두 플래그는 서로 묶여 있지 않다. 8비트 덧셈 65,536쌍을 모두 해 보면 네 조합이 다 나온다[^s1].

| CF | OF | 쌍의 수 | 예 | 부호 없이 읽으면 | 부호 있게 읽으면 |
|---|---|---|---|---|---|
| 0 | 0 | 24,768 | 50h + 20h = 70h | 80 + 32 = 112, 맞다 | 80 + 32 = 112, 맞다 |
| 1 | 0 | 24,384 | FFh + 01h = 00h | 255 + 1 ≠ 0, 틀렸다 | −1 + 1 = 0, 맞다 |
| 0 | 1 | 8,128 | 7Fh + 01h = 80h | 127 + 1 = 128, 맞다 | 127 + 1 ≠ −128, 틀렸다 |
| 1 | 1 | 8,256 | 80h + 80h = 00h | 128 + 128 ≠ 0, 틀렸다 | −128 + (−128) ≠ 0, 틀렸다 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 조합의 쌍 수와 예, 카드 C1~C3의 값. 파이썬 흉내로 8비트 덧셈 65,536쌍을 전수 검사 — [19_x86-status-flags_verify.py](/Hongs_Blog/studies/assembly-language/code/19_x86-status-flags_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** (a) 바이트 카운터 AL이 255일 때 `inc al`로 1을 올렸다. 넘쳤는지 CF로 알 수 있는가? (b) −100과 −100을 `add al,bl`로 더했더니 CF와 OF가 모두 1이다. 부호 있는 계산을 하던 프로그래머는 CF를 어떻게 다뤄야 하는가?</summary>

**답:** (a) 알 수 없다. `INC`는 CF를 바꾸지 않아 앞 계산의 값이 남아 있다. AL이 00h로 돌아갔는지는 ZF(= 1)로 보거나, `inc al` 대신 `add al,1`을 써서 CF를 얻는다. (b) 무시한다. 부호 있는 계산의 판정은 OF 하나다. OF = 1이라 결과 38h(56)는 믿을 수 없다. 참값 −200은 8비트에 들어가지 않으므로 더 넓은 칸으로 [부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)한 뒤 더해야 한다.<br>
**이유:** CF와 OF는 `ADD`, `SUB` 같은 명령이 남긴 것일 때만 "넘쳤다"의 뜻을 가진다. 플래그를 바꾸지 않는 명령 뒤에는 옛 값이 남아 있을 뿐이다.

</details>


크기를 비교해 갈라질 때도 같은 갈림이 되풀이된다. 부호 없는 비교는 CF를, 부호 있는 비교는 OF와 SF를 읽는다: [부호 있는 비교 점프와 부호 없는 비교 점프](/Hongs_Blog/studies/assembly-language/signed-vs-unsigned-jumps/).

[^1]: 어셈블리어 5회 강의 자료 「wk05-chapt_04-3-2」, p.1 (CPU는 부호 있는 수와 없는 수를 구별하지 못한다)
[^2]: 같은 자료, p.3 (Carry Flag: unsigned value that is out of range)
[^3]: 같은 자료, p.5 (Overflow Flag: signed result is invalid or out of range)
[^4]: 같은 자료, p.6 (A Rule of Thumb)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 뺄셈에서 OF가 켜지는 조건, `INC`·`DEC` 줄, 네 조합 표와 쌍의 수, 카드 C1~C3은 원본에 없다. 뺄셈 조건과 쌍의 수는 파이썬 흉내의 전수 검사로 확인했다. `INC`·`DEC`가 CF를 바꾸지 않는다는 것은 Intel 64 and IA-32 Architectures Software Developer's Manual, Volume 2의 INC, DEC 항목에 있다. 실제 CPU로 돌린 결과가 아니다.
{% endraw %}
