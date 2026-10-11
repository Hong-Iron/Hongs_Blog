---
layout: "note"
title: "부호 있는 비교 점프와 부호 없는 비교 점프"
display_title: "부호 있는 비교 점프와 부호 없는 비교 점프"
kind: "concept"
kind_label: "비교"
num: "32"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Signed vs Unsigned Jumps", "JA와 JG", "JB와 JL", "above below", "greater less", "부호 없는 비교", "부호 있는 비교"]
description: "둘 다 CMP 뒤에 붙어 \"크면\", \"작으면\"으로 갈라 간다. 가르는 질문은 \"견주는 비트를 음수가 있는 수로 읽는가\"다. 레지스터에는 비트만 있고 부호가 있다는 표시는 없다. FFh를 255로 읽을지 −1로 읽을지는 점프 명령의 이름이 정한다. 255로 읽으면 1보다 크고, −1…"
prev_url: "/studies/assembly-language/conditional-jumps/"
prev_title: "조건 점프"
next_url: "/studies/assembly-language/conditional-loop-instructions/"
next_title: "조건부 반복 명령"
math: false
mermaid: false
code_count: 1
permalink: "/studies/assembly-language/signed-vs-unsigned-jumps/"
---
{% raw %}
둘 다 `CMP` 뒤에 붙어 "크면", "작으면"으로 갈라 간다. 가르는 질문은 "견주는 비트를 음수가 있는 수로 읽는가"다. 레지스터에는 비트만 있고 부호가 있다는 표시는 없다. FFh를 255로 읽을지 −1로 읽을지는 점프 명령의 이름이 정한다. 255로 읽으면 1보다 크고, −1로 읽으면 1보다 작다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 두 메모리 주소 가운데 어느 것이 뒤쪽인지 견준다. (b) 섭씨 온도 −5도와 3도 가운데 어느 것이 낮은지 견준다. 각각 `JA`·`JB` 쪽인가, `JG`·`JL` 쪽인가?</summary>

**답:** (a) `JA`·`JB`. 주소에는 음수가 없다. 80000000h는 7FFFFFFFh의 바로 다음 주소인데, `JG`로 견주면 음수로 읽혀 더 앞이라고 나온다. (b) `JG`·`JL`. −5는 FBh다. `JB`로 견주면 251로 읽혀 3보다 크다고 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 글자의 ASCII 코드가 `'a'` 이상 `'z'` 이하인지 본다. (d) 은행 잔액의 변화량(입금은 양수, 출금은 음수)이 0보다 작은지 본다. (e) 배열의 원소 수가 0인지 본다. 어느 쪽인가?</summary>

**답:** (c) 부호 없는 쪽(`JB`, `JA`). 코드 값에는 음수가 없다. (d) 부호 있는 쪽(`JL`). (e) 어느 쪽도 아니다. 같은지만 보면 되므로 `JE`나 `JZ`다. 같다와 다르다는 부호와 상관없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 인덱스가 EAX에 부호 있는 수로 들어 있고 배열 길이는 10이다. "0 이상 10 미만이 아니면 `Bad`로"를 `cmp eax,10` / `jae Bad` 두 줄로 쓴 사람이 있다. 부호 있는 값에 부호 없는 점프를 썼는데 왜 맞는가? `jge Bad`로 쓰면 어떤 값에서 틀리는가?</summary>

**답:** 음수는 부호 없는 수로 읽으면 맨 위 비트가 1인 아주 큰 수다. −1은 FFFFFFFFh, 곧 4,294,967,295다. 그래서 `jae`는 10 이상인 값과 음수를 한꺼번에 걸러 낸다. `jge Bad`는 10 이상만 거르고 −1을 통과시킨다.<br>
**이유:** "부호 있는 값에는 늘 부호 있는 점프"가 규칙이지만, 범위 검사에서는 일부러 부호 없이 읽어 검사 두 번을 한 번으로 줄인다[^s1].

</details>


## 결정적 차이

| | 부호 없는 비교 점프 | 부호 있는 비교 점프 |
|---|---|---|
| 이름 | `JA`, `JAE`, `JB`, `JBE` (above, below) | `JG`, `JGE`, `JL`, `JLE` (greater, less) |
| 비트를 읽는 법 | 0 이상의 수. 8비트면 0~255 | 2의 보수. 8비트면 −128~127 |
| 보는 플래그 | CF와 ZF | SF, OF와 ZF |
| 맨 위 비트가 1인 값 | 가장 큰 쪽 절반 | 음수, 곧 가장 작은 쪽 절반 |
| 쓰는 자료 | 주소, 개수, 크기, 글자 코드 | 음수가 될 수 있는 양(차이, 좌표, 온도) |
| 짝이 되는 다른 명령 | `MOVZX`, `SHR` | `MOVSX`, `SAR` |

표의 이름과 뜻은 슬라이드의 두 표를 옮긴 것이다[^1]. 선택을 가르는 줄은 "맨 위 비트가 1인 값"이다. 두 값의 맨 위 비트가 같으면 어느 쪽 점프를 써도 답이 같다. 서로 다르면 답이 정반대다. 8비트 두 수의 65,536쌍 가운데 정확히 절반인 32,768쌍에서 `JA`와 `JG`의 답이 갈린다[^s1].

같은 `CMP` 한 줄 뒤에 두 점프가 다르게 움직이는 것을 본다[^s1].

| `cmp al,bl` | 부호 없이 읽으면 | 부호 있게 읽으면 | ZF | CF | SF | OF | 점프하는 것 |
|---|---|---|---|---|---|---|---|
| AL = FFh, BL = 01h | 255 > 1 | −1 < 1 | 0 | 0 | 1 | 0 | `ja`, `jl` |
| AL = 80h, BL = 7Fh | 128 > 127 | −128 < 127 | 0 | 0 | 0 | 1 | `ja`, `jl` |
| AL = 05h, BL = 03h | 5 > 3 | 5 > 3 | 0 | 0 | 0 | 0 | `ja`, `jg` |

슬라이드의 응용도 같은 짝을 나란히 보인다. `cmp eax,ebx` 뒤에 부호 없는 수로 크면 `ja`, 부호 있는 수로 크면 `jg`를 쓴다[^2]. `cmp eax,Val1` 뒤에 부호 없는 수로 이하면 `jbe`, 부호 있는 수로 이하면 `jle`를 쓴다[^3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 플래그와 점프, 네 짝(`JA`/`JG`, `JAE`/`JGE`, `JB`/`JL`, `JBE`/`JLE`) 모두 8비트 전수에서 답이 갈리는 쌍이 32,768쌍이고 그때마다 두 값의 맨 위 비트가 다른 것, 범위 검사 카드 C3 — [32_signed-vs-unsigned-jumps_verify.py](/Hongs_Blog/studies/assembly-language/code/32_signed-vs-unsigned-jumps_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 둘 다 아닐 때

- **같은지, 다른지.** `JE`, `JNE`를 쓴다. 비트가 모두 같으면 어떻게 읽어도 같은 수다.
- **플래그 하나만 볼 때.** 넘쳤는지는 `JO`, 올림이 났는지는 `JC`, 부호 비트는 `JS`를 쓴다. 덧셈 뒤에 "부호 있는 계산이 틀렸나"를 묻는 것은 크고 작음이 아니라 플래그 하나다([올림 플래그와 넘침 플래그 비교](/Hongs_Blog/studies/assembly-language/carry-vs-overflow-flag/)).
- **특정 비트만 볼 때.** `TEST` 뒤에 `JZ`, `JNZ`를 쓴다([TEST와 CMP](/Hongs_Blog/studies/assembly-language/test-cmp/)).
- **ECX가 0인지.** `JECXZ`는 플래그를 보지 않고 레지스터를 직접 본다([조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)).

같은 갈림이 다른 명령에도 있다. 작은 값을 큰 칸으로 넓힐 때의 `MOVZX`와 `MOVSX`([제로 확장과 부호 확장](/Hongs_Blog/studies/assembly-language/zero-sign-extension/)), 오른쪽으로 밀 때의 `SHR`과 `SAR`([논리 시프트와 산술 시프트 비교](/Hongs_Blog/studies/assembly-language/logical-vs-arithmetic-shift/))도 "이 비트를 부호 있는 수로 읽는가"로 갈린다. 덧셈과 뺄셈은 명령이 하나뿐이고 플래그만 두 벌 남긴다.

[^1]: 어셈블리어 7회 강의 자료 「wk07-chapt_06-3-3」, p.6~7 (부호 없는 비교 점프 표, 부호 있는 비교 점프 표. 그림)
[^2]: 같은 자료, p.8 (CMP 뒤 JA와 JG)
[^3]: 같은 자료, p.9 (CMP 뒤 JBE와 JLE)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 카드 C1~C3의 상황, 표의 "비트를 읽는 법"부터 아래 줄들, 32,768쌍이라는 수, 세 줄짜리 플래그 표, 범위 검사를 `jae` 한 번으로 하는 수법, `MOVZX`·`SHR`과의 견줌은 원본에 없다. 보는 플래그는 Intel 64 and IA-32 Architectures Software Developer's Manual 2권의 Jcc 항목을 따랐고, 수와 플래그 값은 검증 코드의 8비트 전수 검사로 확인했다.
{% endraw %}
