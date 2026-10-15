---
layout: "note"
title: "사용 가능한 식과 생존 변수 비교"
display_title: "사용 가능한 식과 생존 변수 비교"
kind: "concept"
kind_label: "비교"
num: "46"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Available Expressions vs Live Variables", "전방 분석과 후방 분석", "Forward Analysis", "Backward Analysis", "데이터 흐름 분석", "Data-flow Analysis"]
description: "둘 다 코드의 지점마다 집합 하나를 붙이고, 그 집합으로 코드를 고친다. 가르는 질문은 \"지나온 일을 묻는가, 앞으로 올 일을 묻는가\"다. 사용 가능한 식은 여기까지 오는 동안 무엇이 계산되어 아직 맞는지를 묻고, 생존 변수는 여기서부터 무엇이 읽힐지를 묻는다. 이 답이 훑는 방향…"
prev_url: "/studies/compilers/global-available-expressions/"
prev_title: "전역 사용 가능한 식 분석"
next_url: "/studies/compilers/data-alignment/"
next_title: "데이터 정렬과 패딩"
math: false
mermaid: false
code_count: 0
permalink: "/studies/compilers/available-vs-live/"
---
{% raw %}
둘 다 코드의 지점마다 집합 하나를 붙이고, 그 집합으로 코드를 고친다. 가르는 질문은 "지나온 일을 묻는가, 앞으로 올 일을 묻는가"다. 사용 가능한 식은 여기까지 오는 동안 무엇이 계산되어 아직 맞는지를 묻고, 생존 변수는 여기서부터 무엇이 읽힐지를 묻는다. 이 답이 훑는 방향, 길이 만날 때 합치는 법, 고칠 수 있는 최적화를 한꺼번에 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) `t1 = a * a` 바로 앞에서 `t0 = a * a`가 이미 계산되어 있는지 알고 싶다. (나) `t1 = a * a`가 넣은 값을 뒤에서 아무도 안 읽는지 알고 싶다. 어느 분석인가?</summary>

**답:** (가) 사용 가능한 식 분석. 이미 있으면 `t1 = t0`로 바꾼다(공통 부분식 제거). (나) 생존 변수 분석. t1이 그 줄 뒤에서 살아 있지 않으면 줄을 지운다(죽은 코드 제거).<br>
**이유:** (가)는 그 줄보다 앞의 코드가 정하고, (나)는 그 줄보다 뒤의 코드가 정한다. 생존 변수 분석으로는 `a * a`가 이미 계산되었는지 알 수 없다. 그 집합에는 변수 이름만 있고 식이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 갈림길이 다시 만나는 블록이 있다. (다) 왼쪽 길 끝의 집합이 {a = 1, b = 1 + c}, 오른쪽 길 끝의 집합이 {a = 1, c = 1 + b}일 때 만나는 블록의 시작 집합. (라) 갈라지기 전 블록이 있고, 왼쪽 블록의 시작 집합이 {b, c}, 오른쪽 블록의 시작 집합이 {b}일 때 갈라지기 전 블록의 끝 집합. 각각 어떻게 합치는가?</summary>

**답:** (다) 사용 가능한 식이다. 교집합 {a = 1}. (라) 생존 변수다. 합집합 {b, c}.<br>
**이유:** 사용 가능한 식은 "어느 길로 왔든 맞아야" 믿을 수 있어서 공통인 것만 남긴다. 생존 변수는 "한 길에서라도 읽히면" 살려야 해서 모두 모은다. 집합에 든 것이 식(`x = …`)이면 앞에서 넘겨받는 분석이고, 변수 이름이면 뒤에서 넘겨받는 분석이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 고리가 있는 그래프에서 되풀이할 때, (마) 고리 첫 블록의 시작 집합을 고치는 분석과 (바) 고리 끝 블록의 끝 집합을 고치는 분석은 각각 어느 쪽인가? 고치면서 집합은 커지는가, 작아지는가?</summary>

**답:** (마) 사용 가능한 식. 고리 끝 블록의 끝 집합과 교집합을 하므로 작아지거나 그대로다. (바) 생존 변수. 고리 첫 블록의 시작 집합과 합집합을 하므로 커지거나 그대로다.<br>
**이유:** 되돌아가는 간선은 고리 끝에서 고리 처음으로 간다. 앞으로 넘기는 분석에서는 이 간선이 고리 첫 블록에 새 재료를 주고, 뒤로 넘기는 분석에서는 고리 끝 블록에 새 재료를 준다.

</details>


## 결정적 차이

| | 사용 가능한 식 | 생존 변수 |
|---|---|---|
| 지점마다 묻는 것 | 여기까지 오는 동안 계산되어 아직 맞는 식은? | 여기서부터 값이 읽힐 변수는? |
| 집합에 든 것 | 식 `x = …` | 변수 이름 |
| 훑는 방향 | 위에서 아래로(실행 순서대로) | 아래에서 위로(실행 순서의 반대로) |
| 처음 값 | 프로그램 처음에서 빈 집합 | 프로그램 끝에서 빈 집합(또는 뒤에서 쓰일 변수) |
| `x = y + z`를 지날 때 | x가 든 식을 빼고 `x = y + z`를 넣는다 | x를 빼고 y, z를 넣는다 |
| 길이 만나거나 갈라질 때 | 앞 블록들 끝 집합의 교집합 | 다음 블록들 시작 집합의 합집합 |
| 고리에서 되풀이하며 고치는 곳 | 고리 첫 블록의 시작 집합(줄어든다) | 고리 끝 블록의 끝 집합(늘어난다) |
| 이 집합으로 하는 최적화 | 복사 전파, 공통 부분식 제거 | 죽은 코드 제거 |
| 덜 정확해도 괜찮은 쪽 | 맞는 식을 빠뜨려도 된다(집합이 작은 쪽) | 죽은 변수를 살았다고 봐도 된다(집합이 큰 쪽) |

마지막 줄을 뺀 나머지는 두 분석의 규칙을 나란히 놓은 것이다. 마지막 줄은 그 규칙들에서 따라 나온다[^s1]. 선택을 가르는 줄은 "방향"과 "합치는 법"이다. 두 분석을 헷갈릴 때 뒤바꾸기 쉬운 것도 이 두 줄이다.

두 분석은 같은 코드에 차례로 쓴다. [사용 가능한 식 분석](/Hongs_Blog/studies/compilers/available-expressions/)의 다섯 줄 예에서 사용 가능한 식으로 `t1 = t0`, `t0 = t2`처럼 고쳐 쓰고 나면 읽히지 않는 변수가 생기고, 생존 변수 분석이 그 줄을 지운다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 교집합과 합집합을 바꿔 쓰면 틀리는 예(왼쪽 길로 왔는데 `c = 1 + b`가 거짓, 한쪽 길에서만 읽히는 변수의 대입을 지움), 고리에서 집합이 한쪽은 줄고 한쪽은 느는 것 — [45_global-available-expressions_impl.py](/Hongs_Blog/studies/compilers/code/45_global-available-expressions_impl/), [44_global-live-variable-analysis_impl.py](/Hongs_Blog/studies/compilers/code/44_global-live-variable-analysis_impl/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 두 분석 어느 것도 필요 없는 최적화 둘과, 두 분석만으로는 못 하는 최적화 하나를 쓰라.</summary>

**답:** 필요 없는 것: ① 산술 단순화(`x * 2`를 `x + x`로 바꾸는 식의 고쳐 쓰기) ② 상수 접기(`3 + 4`를 컴파일할 때 7로 계산해 두기). 둘은 그 줄 하나만 보고 고친다. 앞뒤의 집합이 필요 없다. 못 하는 것: 코드 이동. 문장을 한 블록에서 다른 블록으로 옮기는 일은 한 블록만 봐서는 할 수 없고 전역으로 봐야 한다.<br>
**이유:** 사용 가능한 식과 생존 변수는 "다른 줄과의 관계"를 알려 준다. 한 줄 안에서 끝나는 고쳐 쓰기에는 관계가 필요 없다.

</details>


[^s1]: 교집합·합집합을 바꾸면 틀리는 것을 두 구현 코드의 반례로 확인했다. 산술 단순화와 상수 접기의 예(`x * 2`, `3 + 4`)도 보충이다.
{% endraw %}
