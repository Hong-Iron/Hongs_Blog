---
layout: "note"
title: "합성곱 연습"
display_title: "합성곱 연습"
kind: "practice"
kind_label: "연습"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: 1차원은 컨벌루션 적분 (f g)(t) = \\int f(\\tau)g(t - \\tau)\\,d\\tau와 컨벌루션 합, 2차원은 2차원 합성곱."
prev_url: "/studies/human-interface-media/lateral-inhibition-ladder/"
prev_title: "측면 억제 예제 사다리"
math: true
mermaid: false
code_count: 4
permalink: "/studies/human-interface-media/convolution-practice/"
---
{% raw %}
사용 개념: 1차원은 [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/) $$(f * g)(t) = \int f(\tau)g(t - \tau)\,d\tau$$와 [컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/), 2차원은 [2차원 합성곱](/Hongs_Blog/studies/human-interface-media/two-dimensional-convolution/).

강의 6의 예제와 문제를 모았다[^1]. 풀이 전략은 늘 같다. 한 함수를 뒤집어 $$t$$만큼 옮긴 뒤, $$t$$를 왼쪽 끝에서 오른쪽 끝으로 움직이며 겹치는 구간의 끝점이 바뀌는 순간마다 경우를 나눈다. 겹치는 구간을 찾으면 그 구간에서 두 함수의 곱을 적분(또는 합)한다. 임펄스가 끼면 이 과정 대신 "그 자리로 옮기기"를 쓴다.

## 문제 1 · 단위 사각형끼리 (p1)

$$f(x) = h(x) = 1$$ ($$0 \le x < 1$$), 그 밖은 0이다. $$f * h$$를 구하라[^2].

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *뒤집고 옮기기:* $$h(x - \alpha)$$는 $$\alpha \in (x - 1, x]$$에서 1이다.
2. *경우 나누기:* 겹치는 구간은 $$[0, 1)$$과 $$(x - 1, x]$$의 공통 부분이다. $$x < 0$$이면 겹침 없음. $$0 \le x < 1$$이면 $$[0, x]$$, 길이 $$x$$. $$1 \le x < 2$$이면 $$[x - 1, 1)$$, 길이 $$2 - x$$. $$x \ge 2$$면 없음.
3. *결과:* $$(f * h)(x) = x$$ ($$0 \le x < 1$$), $$2 - x$$ ($$1 \le x < 2$$), 그 밖은 0. 꼭대기 $$(1, 1)$$의 삼각형이다.

</details>


## 문제 2 · 높이가 다른 사각형 (p2)

$$x(\tau) = 2$$ ($$0 \le \tau < 2$$), $$h(\tau) = 1$$ ($$0 \le \tau < 1$$)일 때 $$y(t) = \int x(\tau)h(t - \tau)\,d\tau$$를 구하라[^3].

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *뒤집고 옮기기:* $$h(t - \tau)$$는 $$\tau \in (t - 1, t]$$에서 1인 폭 1의 사각형이다.
2. *경우 나누기:* 슬라이드처럼 $$t < 0$$, $$0 < t < 1$$, $$1 < t < 2$$, $$2 < t < 3$$, $$t > 3$$의 다섯 경우다.
3. *겹친 넓이 × 높이 2:* $$t < 0$$이면 0. $$0 < t < 1$$이면 겹친 길이 $$t$$라 $$2t$$. $$1 < t < 2$$이면 $$h$$가 통째로 $$x$$ 안이라 $$2 \times 1 = 2$$. $$2 < t < 3$$이면 겹친 길이 $$3 - t$$라 $$2(3 - t)$$. $$t > 3$$이면 0.
4. *결과:* 0에서 2까지 오르고, 1~2에서 2로 평평하고, 3에서 0으로 내려오는 사다리꼴이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 리만 합으로 계산한 $$f * h$$와 $$y(t)$$가 일곱 지점에서 식과 맞음 — [31_convolution-practice_p2.py](/Hongs_Blog/studies/human-interface-media/code/31_convolution-practice_p2/)</div>

</div>


## 문제 3 · 델타 함수와의 합성곱 (p3)

사각 함수 $$\mathrm{rect}(x)$$와 델타 함수 $$\delta(x)$$의 합성곱은? $$\delta(x - a)$$와의 합성곱은?[^4]

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *정의에 넣기:* $$(\mathrm{rect} * \delta)(x) = \int \mathrm{rect}(\tau)\delta(x - \tau)\,d\tau$$. 델타는 $$\tau = x$$에서만 넓이 1을 가지므로 적분값은 $$\mathrm{rect}(x)$$다.
2. *옮긴 델타:* $$\delta(x - a)$$면 $$\tau = x - a$$에서만 남아 $$\mathrm{rect}(x - a)$$다.
3. *결론:* 델타와의 합성곱은 함수를 그대로 두고, 옮긴 델타와의 합성곱은 함수를 그만큼 옮긴다.

</details>


## 문제 4 · 네 줄 (p4)

슬라이드 15쪽의 네 줄에서 $$(x * h)(t)$$를 그려라. 모든 줄에서 $$x$$는 $$0 \le t < 0.5$$에서 1인 펄스이고, 둘째 줄의 $$x$$에는 $$1 \le t < 1.5$$의 펄스가 하나 더 있다[^5].

| 줄 | $$h(t)$$ |
|---|---|
| 1 | $$x$$와 같은 펄스 |
| 2 | $$x$$와 같은 펄스 |
| 3 | $$\delta(t - 1)$$ |
| 4 | $$\delta(t - 0.5)$$와 높이가 더 낮은 $$\delta(t - 1.5)$$ |

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *줄 1:* 폭 0.5인 펄스끼리라 문제 1과 같은 모양을 반으로 줄인 삼각형이다. 0에서 시작해 $$(0.5, 0.5)$$에서 꼭대기, 1에서 0.
2. *줄 2:* 합성곱은 더하기를 나눠 계산할 수 있다(선형). 펄스마다 줄 1의 삼각형이 하나씩 생겨 0~1과 1~2에 같은 삼각형 둘이다.
3. *줄 3:* $$\delta(t - 1)$$과의 합성곱은 1만큼 옮기기라 $$1 \le t < 1.5$$의 펄스다.
4. *줄 4:* 두 임펄스가 각각 복사본을 만든다. $$0.5 \le t < 1$$에 높이 1의 펄스, $$1.5 \le t < 2$$에 둘째 임펄스의 높이만큼의 펄스다. 둘째 임펄스의 높이는 슬라이드 그림에서 [판독불확실: 약 1/2]로 읽힌다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 줄 1·2는 리만 합과 삼각형 식 비교, 줄 3·4는 옮긴 펄스 값 확인(둘째 높이 1/2로 가정) — [31_convolution-practice_p4.py](/Hongs_Blog/studies/human-interface-media/code/31_convolution-practice_p4/)</div>

</div>


## 문제 5 · 불연속 합성곱의 길이 (p5)

$$f[n]$$은 $$n = 0, \dots, 3$$에서만, $$h[n]$$은 $$n = 0, \dots, 5$$에서만 0이 아니다. $$(f * h)[n] = \sum_m f[m]h[n - m]$$이 0이 아닐 수 있는 $$n$$의 범위는?[^6]

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *뒤집고 옮기기:* $$h[n - m]$$은 $$m = n - 5, \dots, n$$에서만 0이 아니다.
2. *겹침 조건:* $$f$$의 칸 $$0 \sim 3$$과 $$n - 5 \sim n$$이 겹치려면 $$n \ge 0$$이고 $$n - 5 \le 3$$, 곧 $$0 \le n \le 8$$이다.
3. *결론:* $$n < 0$$이나 $$n > 8$$이면 0이다. 길이 4와 6의 합성곱은 길이 $$4 + 6 - 1 = 9$$다. 예: $$f = [1, 1, 1, 1]$$, $$h = [6, 5, 4, 3, 2, 1]$$이면 $$[6, 11, 15, 18, 14, 10, 6, 3, 1]$$[^s1].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예의 결과 9개와 모두 양수 — [31_convolution-practice_p5.py](/Hongs_Blog/studies/human-interface-media/code/31_convolution-practice_p5/)</div>

</div>


## 문제 6 · 2차원 단위 정사각형 (p6)

$$f$$와 $$h$$가 모두 $$0 \sim 1 \times 0 \sim 1$$에서 1이다. $$g(x, y) = \iint f(\alpha, \beta)h(x - \alpha, y - \beta)\,d\alpha\,d\beta$$를 구역별로 구하라[^7].

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *뒤집고 옮기기:* $$h(x - \alpha, y - \beta)$$는 $$\alpha \in (x - 1, x]$$, $$\beta \in (y - 1, y]$$의 정사각형이다.
2. *겹친 넓이:* 가로 겹침은 문제 1의 $$\mathrm{tri}(x)$$, 세로 겹침은 $$\mathrm{tri}(y)$$다. 겹친 사각형의 넓이는 둘의 곱이다.
3. *구역별:* (1) $$0 < x \le 1, 0 < y \le 1$$: $$xy$$. (2) $$0 < x \le 1, 1 < y \le 2$$: $$x(2 - y)$$. (3) $$1 < x \le 2, 0 < y \le 1$$: $$(2 - x)y$$. (4) $$1 < x \le 2, 1 < y \le 2$$: $$(2 - x)(2 - y)$$.
4. *결과:* $$g(x, y) = \mathrm{tri}(x)\,\mathrm{tri}(y)$$, $$(1, 1)$$에서 꼭대기 1인 피라미드 모양이다.

</details>


## 문제 7 · 2차원 불연속 (p7)

$$f(m, n)$$은 $$m, n \in \{-1, 0, 1\}$$에서 1, $$h(m, n)$$은 $$(1, 0), (0, -1), (0, 0)$$에서 1이다. $$g(m, n) = \sum_k\sum_l f(k, l)h(m - k, n - l)$$의 표를 만들라[^8].

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *임펄스로 나누기:* $$h$$의 세 점이 $$f$$를 $$(0, 0)$$, $$(1, 0)$$, $$(0, -1)$$만큼 옮긴 복사본 세 장을 만든다.
2. *겹침 세기:* 칸마다 복사본이 몇 장 겹치는지 센다.
3. *결과:* 위에서부터 $$m = 2, 1, 0, -1$$, 왼쪽부터 $$n = -2, -1, 0, 1$$:

</details>

	```
	0 1 1 1
	1 3 3 2
	1 3 3 2
	1 2 2 1
	```
    슬라이드의 $$g(-1, -2) = 1$$, $$g(2, 1) = 1$$과 맞는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 6의 다섯 지점(수치 적분), 문제 7의 표 — [31_convolution-practice_p7.py](/Hongs_Blog/studies/human-interface-media/code/31_convolution-practice_p7/)</div>

</div>


## 변형 문제

1. 문제 2에서 $$h$$의 폭을 2로 늘리면($$0 \le \tau < 2$$) $$y(t)$$는 어떤 모양인가?

    <details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

    1. *경우:* $$x$$와 $$h$$의 폭이 같아 평평한 구간이 사라진다.
    2. *결과:* 0~2에서 $$2t$$로 오르고 2~4에서 $$2(4 - t)$$로 내려오는 삼각형, 꼭대기 $$(2, 4)$$[^s1].

    </details>

{: start="2"}
2. 문제 7에서 $$h$$에 $$(0, 1)$$을 하나 더하면 값 4인 칸이 생기는가?

    <details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

    1. *복사본:* 네 번째 복사본은 $$m \in [-1, 1]$$, $$n \in [0, 2]$$를 차지한다.
    2. *겹침:* $$(0, 0)$$, $$(1, 0)$$ 같은 칸은 네 장이 모두 겹친다. 예를 들어 $$(1, 0)$$은 ①, ②, ③, ④ 모두에 들어가 4다[^s1].

    </details>


[^1]: 휴먼 인터페이스 미디어 6회 강의 자료 「HIM_강의06_모양맞추기」, p.12~16, p.21~22
[^2]: 같은 자료, p.12 (예: 1-D 합성곱, 연속. 경우 (1) $$0 \le x < 1$$, (2) $$1 \le x < 2$$, 결과 삼각형)
[^3]: 같은 자료, p.13 (예2: $$t < 0$$부터 $$t > 3$$까지 다섯 경우, 결과 사다리꼴)
[^4]: 같은 자료, p.14 (문제1: 델타 함수와의 합성곱, 그래프를 그리는 빈 모눈)
[^5]: 같은 자료, p.15 (문제2: $$x(t)$$, $$h(t)$$, 빈 $$(x * h)(t)$$ 네 줄)
[^6]: 같은 자료, p.16 (예3: 1-D 합성곱, 불연속. 경우 (a) $$n < 0$$, (b) $$0 \le n \le 8$$, (c) $$n > 8$$)
[^7]: 같은 자료, p.21 (예: 2차원 단위 정사각형, 네 구역)
[^8]: 같은 자료, p.22 (예2: 2차원 불연속)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 문제 3·4는 슬라이드가 그래프 칸만 비워 둔 문제라 풀이는 직접 썼다. 문제 5의 $$f$$, $$h$$ 값은 슬라이드에 숫자로 적혀 있지 않아 길이만 맞춘 예로 골랐다. 변형 문제는 원본에 없다. 모든 결과는 문제 코드로 확인했다.
{% endraw %}
