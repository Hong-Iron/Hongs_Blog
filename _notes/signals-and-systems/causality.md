---
layout: "note"
title: "인과성"
display_title: "인과성 (Causality)"
kind: "concept"
kind_label: "정의"
num: "14"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Causality", "Causal System", "인과 시스템", "비인과 시스템", "Noncausal System", "이동 평균", "Moving Average"]
description: "인과 시스템은 미래를 내다보지 않는다. 어느 순간의 출력이 그때까지(지금과 과거)의 입력만으로 정해진다. 자동차는 운전자가 나중에 밟을 페달을 미리 알 수 없으니 인과적이다. 실시간으로 돌아가는 물리 시스템은 모두 인과적이어야 한다. 하지만 녹음을 다 끝낸 뒤 편집하거나, 시간이 …"
prev_url: "/studies/signals-and-systems/memory-invertibility/"
prev_title: "기억과 가역성"
next_url: "/studies/signals-and-systems/stability/"
next_title: "안정성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/causality/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

인과 시스템은 미래를 내다보지 않는다. 어느 순간의 출력이 그때까지(지금과 과거)의 입력만으로 정해진다. 자동차는 운전자가 나중에 밟을 페달을 미리 알 수 없으니 인과적이다. 실시간으로 돌아가는 물리 시스템은 모두 인과적이어야 한다. 하지만 녹음을 다 끝낸 뒤 편집하거나, 시간이 아니라 위치가 독립 변수인 사진을 처리할 때는 "앞쪽" 값도 쓸 수 있어서 인과성이 꼭 필요하지 않다.

</div>


## 예시로 보기

주식 가격처럼 오르내림이 심한 데이터의 흐름을 보려고 앞뒤 $$M$$개씩의 평균을 낸다[^1].

$$y[n] = \frac{1}{2M+1}\sum_{k=-M}^{M}x[n-k]$$


$$k = -M$$일 때 $$x[n + M]$$, 즉 $$M$$칸 뒤의 미래 입력이 들어간다. 그래서 이 시스템은 비인과적이다. 장 마감 후에 그날 그래프를 다듬는 것은 괜찮지만, 실시간 주문에는 쓸 수 없다. 과거 $$M$$개만 평균하면 인과적이 된다[^s1].

## 정의

어느 시각의 출력이 그 시각과 과거의 입력에만 의존하면 인과 시스템이다[^2]. 다르게 말하면, 두 입력이 어느 시각 $$t_0$$(또는 $$n_0$$)까지 같으면 출력도 그 시각까지 같다.

| 인과 | 비인과 |
|---|---|
| $$y[n] = \sum_{k=-\infty}^{n}x[k]$$, $$y[n] = x[n-1]$$, 모든 기억 없는 시스템 | $$y[n] = x[n] - x[n+1]$$, $$y(t) = x(t + 1)$$ |

기억 없는 시스템은 지금 입력만 쓰니 언제나 인과적이다. 반대로 인과 시스템이 기억 없는 것은 아니다(누산기).

## 예제

**예제 1.12-1** $$y[n] = x[-n]$$[^3]

- $$n_0 > 0$$인 시각만 보면, 출력 $$y[n_0]$$은 과거의 입력 $$x[-n_0]$$으로 정해진다. 여기까지는 인과적으로 보인다.
- 그런데 $$n < 0$$이면 다르다. $$n = -4$$에서 $$y[-4] = x[4]$$이므로 미래의 입력이 지금의 출력을 정한다.
- 하나라도 그런 시각이 있으면 비인과 시스템이다.

**예제 1.12-2** $$y(t) = x(t)\cos(t + 1)$$[^3]

- $$\cos(t+1)$$은 입력과 상관없이 시간만으로 정해지는 함수 $$g(t)$$다. 그래서 $$y(t) = x(t)g(t)$$.
- 시각 $$t$$의 출력은 같은 시각의 입력 $$x(t)$$에만 의존하므로 인과적이다. $$\cos$$ 안의 $$+1$$은 입력이 아니라 함수의 일부라서 미래를 보는 것이 아니다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 미래 입력만 다른 두 입력을 넣어 출력을 비교하는 방식으로 누산기·지연기·기억 없는 시스템·$$x(t)\cos(t+1)$$은 인과, $$x[n] - x[n+1]$$·$$x[-n]$$·이동 평균은 비인과로 판정 — [14_causality_verify.py](/Hongs_Blog/studies/signals-and-systems/code/14_causality_verify/)</div>

</div>


## 활용

- 실시간 오디오 필터, 제어기, 통신 수신기는 인과 시스템만 만들 수 있다. 4장의 "이상적 필터"는 비인과적이라 그대로는 만들 수 없다.
- 영상 처리는 독립 변수가 위치라 좌우·위아래 화소를 함께 써도 된다. 사진의 흐림 필터는 비인과적이다[^2].

## 연결

- 선수: [기억과 가역성](/Hongs_Blog/studies/signals-and-systems/memory-invertibility/)
- 다음: [안정성](/Hongs_Blog/studies/signals-and-systems/stability/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"식에 $$t + 1$$이 보이면 비인과적이다."</div>

틀렸다. 미래를 보는지는 입력 $$x$$의 괄호 안만 보고 판단한다. $$x(t)\cos(t+1)$$의 $$t+1$$은 입력이 아니라 정해진 함수 안에 있다. 확인: 미래 입력만 바꿔도 출력이 그대로이다(검증 코드). 반대로 $$x(-n)$$처럼 $$+$$가 없어도 비인과일 수 있다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 인과적인가? ① $$y[n] = x[n] + 2x[n-3]$$ ② $$y(t) = x(2t)$$ ③ $$y[n] = n\,x[n]$$</summary>

**답:** ① 인과 ② 비인과 ($$t = 1$$에서 $$x(2)$$, 미래) ③ 인과 (같은 시각의 입력만 씀)<br>
**흔한 오답:** ②를 인과로 고르는 것. $$t < 0$$이면 과거를 보지만 $$t > 0$$이면 미래를 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 기억 없는 시스템은 왜 언제나 인과적인가?</summary>

**답:** 출력이 같은 시각의 입력에만 의존하므로 미래 입력을 쓸 일이 없다. 인과성은 "지금과 과거만 쓴다"이고 기억 없음은 "지금만 쓴다"라서, 앞의 조건이 뒤를 포함한다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.10
[^2]: 같은 자료, p.10 ("독립변수가 시간이 아닌 경우(영상처리), 인과성은 필수 조건이 아님")
[^3]: 같은 자료, p.11 (예제 1.12)
[^s1]: 에이전트 보충. 장 마감 후 그래프 비유, 과거만 평균하면 인과적이 된다는 설명, 오해 항목, 확인 문제는 원본에 없다. 판정은 검증 코드로 확인했다.
{% endraw %}
