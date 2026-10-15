---
layout: "note"
title: "핸들"
display_title: "핸들 (Handle)"
kind: "concept"
kind_label: "정의"
num: "23"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Handle", "핸들", "환원할 자리"]
description: "쌓아 둔 조각 가운데 \"지금 묶어야 끝까지 갈 수 있는\" 바로 그 묶음을 핸들이라 부른다. 규칙의 오른쪽과 모양이 같다고 다 핸들은 아니다. 묶은 뒤에도 문장 전체로 이어지는 길이 남아 있어야 한다. 핸들만 골라 묶으면 묶을지 더 읽을지 헷갈릴 일이 없다. 핸들은 늘 읽은 부분의 …"
prev_url: "/studies/compilers/shift-reduce-parsing/"
prev_title: "이동-환원 파싱"
next_url: "/studies/compilers/viable-prefix/"
next_title: "유효 접두사"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/parse-handle/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

쌓아 둔 조각 가운데 "지금 묶어야 끝까지 갈 수 있는" 바로 그 묶음을 핸들이라 부른다. 규칙의 오른쪽과 모양이 같다고 다 핸들은 아니다. 묶은 뒤에도 문장 전체로 이어지는 길이 남아 있어야 한다. 핸들만 골라 묶으면 묶을지 더 읽을지 헷갈릴 일이 없다. 핸들은 늘 읽은 부분의 맨 끝에 나타나서 끝만 보면 된다. 다만 정의만으로는 지금 끝자락이 핸들인지 알아낼 방법이 없다.

</div>


## 예시로 보기

[이동-환원 파싱](/Hongs_Blog/studies/compilers/shift-reduce-parsing/)은 "지금 환원할까, 이동할까"를 스스로 정하지 못한다. 문법 $$E \to T + E \mid T$$, $$T \to F * T \mid F$$, $$F \to (E) \mid id$$에서 <code>F&#124;* id</code>를 보자. 왼쪽 끝의 `F`는 규칙 $$T \to F$$의 오른쪽과 같다. 그런데 여기서 `T`로 바꾸면 `T * id`가 되고, 이 문법에서 `T` 뒤에 `*`가 오는 문자열은 만들 수 없다. 이 `F`는 모양만 맞고 묶으면 안 되는 자리다.

반대로 <code>F * F&#124;</code>의 끝에 있는 `F`는 묶어야 한다. `F * T`가 되고, 이어서 $$T \to F * T$$로 묶인다. 같은 `F`인데 하나는 묶고 하나는 안 묶는다. 묶어야 하는 쪽을 핸들이라 부른다.

`id * id`를 파싱하는 동안의 핸들은 이렇다.

| 상태 | 핸들 | 한 일 |
|---|---|---|
| `\|id * id` | | 이동 |
| `id\|* id` | `id` | $$F \to id$$로 환원 |
| `F\|* id` | | 이동 |
| `F *\|id` | | 이동 |
| `F * id\|` | `id` | $$F \to id$$로 환원 |
| `F * F\|` | `F` | $$T \to F$$로 환원 |
| `F * T\|` | `F * T` | $$T \to F * T$$로 환원 |
| `T\|` | `T` | $$E \to T$$로 환원 |
| `E\|` | | 받아들임 |

핸들 칸이 빈 줄에서는 이동하고, 채워진 줄에서는 환원한다. 일곱째 줄 <code>F * T&#124;</code>에서 끝자락 `T`는 $$E \to T$$와도 같지만 핸들은 `F * T`다. 핸들을 알면 어느 규칙으로 환원할지도 함께 정해진다.

## 정의

핸들은 규칙의 오른쪽 전체와 같은 부분 문자열 가운데, 환원에 실제로 쓰이는 것이다.

시작 기호에서 오른쪽 끝 유도로 어떤 문자열까지 온 뒤, 마지막 한 걸음에서 논터미널 $$X$$를 규칙 $$X \to \beta$$로 펼쳤다고 하자. 그 걸음을 되돌리는 자리의 $$\beta$$가 핸들이다.

기호로 쓰면 이렇다. $$S$$가 시작 기호이고

$$S \Rightarrow_{rm}^{*} \alpha X \omega \Rightarrow_{rm} \alpha\beta\omega$$


이면, $$\beta$$는 $$\alpha\beta\omega$$의 핸들이다. $$\Rightarrow_{rm}$$은 가장 오른쪽 논터미널을 바꾸는 유도 한 걸음, $$\Rightarrow_{rm}^{*}$$은 그런 걸음을 0번 이상 한 것이다. $$\alpha$$(알파)는 핸들 앞의 기호들, $$\omega$$(오메가)는 핸들 뒤의 토큰들이다. 파서는 $$\alpha\beta \mid \omega$$에서 $$X \to \beta$$로 환원해 $$\alpha X \mid \omega$$로 간다.

핸들이라고 하려면 두 가지가 다 맞아야 한다. 규칙의 오른쪽 전체와 같을 것, 그리고 그 자리에서 환원한 결과 $$\alpha X \omega$$가 시작 기호에서 오른쪽 끝 유도로 나오는 문자열일 것. 예시의 <code>F&#124;* id</code>에서 `F`는 첫째만 맞고 둘째가 틀렸다.

### 핸들은 늘 왼쪽 부분의 끝자락이다

이동-환원 파싱을 하는 동안 핸들은 막대 바로 왼쪽에서만 나타난다. 막대보다 왼쪽 깊숙한 곳을 뒤질 일이 없다.

기호로 보면 이렇다. $$S \Rightarrow_{rm}^{*} X\omega \Rightarrow_{rm} \alpha Y\omega \Rightarrow_{rm} \alpha\beta\omega$$이면, $$\alpha\beta \mid \omega$$에서 핸들은 끝자락 $$\beta$$다. $$Y$$로 환원해 $$\alpha Y \mid \omega$$가 되면 다음 핸들은 $$\alpha Y$$이고, 이것도 끝자락이다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">왜 늘 끝자락인가</summary>

$$\alpha\beta \mid \omega$$에서 $$X \to \beta$$로 환원해 $$\alpha X \mid \omega$$가 되었다고 하자. 다음 핸들 $$\eta$$(에타)는 오른쪽 끝 유도에서 한 걸음 앞선 걸음 $$\delta Y \omega' \Rightarrow_{rm} \delta\eta\omega' = \alpha X\omega$$가 만든 것이다.

1. $$Y$$는 가장 오른쪽 논터미널이었으므로 $$\omega'$$은 터미널뿐이다. $$X$$는 논터미널이라 $$\omega'$$ 안에 없다. — 오른쪽 끝 유도의 정의
2. 그러면 $$X$$는 $$\eta$$ 안에 있거나 $$\delta$$ 안에 있다.
3. $$X$$가 $$\eta$$ 안에 있으면 $$\eta$$의 오른쪽 끝은 $$X$$의 자리이거나 그보다 오른쪽이다.
4. $$X$$가 $$\delta$$ 안에 있으면 $$\eta$$ 전체가 $$X$$보다 오른쪽에 있다.
5. 어느 쪽이든 $$\eta$$의 오른쪽 끝은 막대(지금 $$X$$ 바로 뒤)보다 왼쪽에 있지 않다. 막대에 딱 붙어 있으면 바로 환원하고, 더 오른쪽이면 그만큼 이동한 뒤 환원한다. ∎

4의 예: `id * id`에서 첫 `id`를 `F`로 바꾼 뒤(<code>F&#124;* id</code>) 다음 핸들은 둘째 `id`로, `F`보다 오른쪽에 있다[^s1].

</details>


그래서 충돌을 푸는 규칙은 한 줄이다. 핸들이 있으면 환원하고, 없으면 이동한다. 남는 물음은 "지금 끝자락이 핸들인지 어떻게 아는가"다. 답은 [유효 접두사](/Hongs_Blog/studies/compilers/viable-prefix/)에서 시작한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 핸들 표, 무작위 오른쪽 끝 유도 2,000개에서 "파서의 환원 순서 = 유도의 역순"과 "환원할 때 남은 토큰 수가 늘지 않음(핸들의 끝이 왼쪽으로 돌아가지 않음)", `T *`로 시작하는 문자열이 이 문법에서 나오지 않음 — [23_parse-handle_verify.py](/Hongs_Blog/studies/compilers/code/23_parse-handle_verify/)</div>

</div>


## 연결

- 선수: [이동-환원 파싱](/Hongs_Blog/studies/compilers/shift-reduce-parsing/), [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)
- 핸들이 있는지 알아내는 길: [유효 접두사](/Hongs_Blog/studies/compilers/viable-prefix/) → [LR(0) 항목과 항목 오토마타](/Hongs_Blog/studies/compilers/lr0-item-automaton/) → [SLR 파싱](/Hongs_Blog/studies/compilers/slr-parsing/)
- 모호한 문법에서는 한 문자열에 오른쪽 끝 유도가 둘 이상이라 핸들도 둘 이상일 수 있다([모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/))[^s1].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 핸들의 정의를 오른쪽 끝 유도를 써서 말하라.</summary>

**답:** $$S \Rightarrow_{rm}^{*} \alpha X\omega \Rightarrow_{rm} \alpha\beta\omega$$일 때 $$\beta$$가 $$\alpha\beta\omega$$의 핸들이다. 규칙 $$X \to \beta$$의 오른쪽 전체와 같고, 그 자리에서 $$X$$로 환원하면 오른쪽 끝 유도의 한 걸음을 되돌린 것이 된다.<br>
**이유:** "규칙의 오른쪽과 같다"만 말하면 반쪽이다. 환원한 결과가 시작 기호에서 나오는 문자열이어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 문법 $$E \to T + E \mid T$$, $$T \to F * T \mid F$$, $$F \to (E) \mid id$$에서 (가) <code>F&#124;* id</code>의 `F`, (나) <code>F * F&#124;</code>의 끝 `F`, (다) <code>F * T&#124;</code>의 끝 `T`. 셋 가운데 핸들인 것은?</summary>

**답:** (나)만 핸들이다. (가)는 $$T \to F$$와 모양이 같지만 환원하면 `T * id`가 되고 `T *`로 시작하는 문자열은 이 문법에서 나오지 않는다. (다)는 $$E \to T$$와 모양이 같지만 환원하면 `F * E`가 되어 막힌다. (다)의 핸들은 `F * T` 전체다.<br>
**이유:** 흔한 오답은 "모양이 맞으니 셋 다 핸들"이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 핸들이 막대보다 왼쪽 깊숙한 곳에 숨어 있는 일이 왜 없는가?</summary>

**답:** 환원은 오른쪽 끝 유도의 걸음을 거꾸로 되돌린다. 방금 환원해 만든 논터미널 $$X$$는 그 순간 가장 오른쪽 논터미널이고, 한 걸음 앞선 유도가 펼친 규칙의 오른쪽은 $$X$$를 담고 있거나 $$X$$보다 오른쪽에 있다. 그래서 다음 핸들의 끝은 막대 자리이거나 그 오른쪽이다.

</details>


[^s1]: 무작위 유도 2,000개로 확인했다. 근거: Aho·Lam·Sethi·Ullman, *Compilers* 2판, 4.5.2 "Handle Pruning", 4.5.3.
{% endraw %}
