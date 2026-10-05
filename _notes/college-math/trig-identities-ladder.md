---
layout: "note"
title: "삼각함수 항등식 예제 사다리"
display_title: "삼각함수 항등식 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "14"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 삼각함수 항등식의 배각 공식과 피타고라스 항등식 \\sin^2\\theta + \\cos^2\\theta = 1."
prev_url: "/studies/college-math/logarithm-ladder/"
prev_title: "로그 계산 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/college-math/trig-identities-ladder/"
---
{% raw %}
사용 개념: [삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/)의 배각 공식과 피타고라스 항등식 $$\sin^2\theta + \cos^2\theta = 1$$.

이 방법을 떠올리는 신호는 **"다음 식이 항등식임을 보여라" 또는 "한 가지 함수로 나타내라"**는 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *복잡한 쪽 고르기:* 항이 많거나 각이 여러 개인 쪽에서 출발한다. 양쪽을 동시에 바꾸지 않는다.
2. *재료 통일하기:* 배각·덧셈정리로 각을 하나로, $$\tan$$ 등을 $$\sin$$과 $$\cos$$으로 바꾼다.
3. *대수로 정리하기:* 전개, 인수분해, 통분, 그리고 $$\sin^2 + \cos^2 = 1$$을 쓴다.
4. *확인하기:* 다른 쪽과 같아졌는지 보고, 한 각을 넣어 수치로 확인한다. 식이 정의되지 않는 각도 적는다.

## 문제 1 · 완전한 풀이

$$(\sin\theta + \cos\theta)^2 = 1 + \sin 2\theta$$임을 보여라.

1. *복잡한 쪽 고르기:* 왼쪽이 제곱이라 풀 것이 많다.
2. *재료 통일하기:* 모두 각 $$\theta$$의 $$\sin$$, $$\cos$$이라 그대로 둔다.
3. *대수로 정리하기:* 전개하면 $$\sin^2\theta + 2\sin\theta\cos\theta + \cos^2\theta = 1 + 2\sin\theta\cos\theta$$. 배각 공식으로 $$2\sin\theta\cos\theta = \sin 2\theta$$.
4. *확인하기:* 오른쪽과 같다. $$\theta = \pi/4$$를 넣으면 $$(\sqrt2)^2 = 2 = 1 + \sin\frac{\pi}{2}$$다.

## 문제 2 · 마지막 하위목표만 빈칸

$$\cos^4\theta - \sin^4\theta = \cos 2\theta$$임을 보여라.

1. *복잡한 쪽 고르기:* 네제곱이 있는 왼쪽.
2. *재료 통일하기:* 모두 각 $$\theta$$라 그대로 둔다.
3. *대수로 정리하기:* 제곱의 차로 인수분해하면 $$(\cos^2\theta - \sin^2\theta)(\cos^2\theta + \sin^2\theta) = \cos^2\theta - \sin^2\theta$$.
4. *확인하기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

배각 공식 $$\cos 2\theta = \cos^2\theta - \sin^2\theta$$이므로 오른쪽과 같다. $$\theta = 0$$을 넣으면 $$1 - 0 = 1 = \cos 0$$이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$\tan\theta + \dfrac{1}{\tan\theta} = \dfrac{2}{\sin 2\theta}$$임을 보여라.

1. *복잡한 쪽 고르기:* 두 항의 합인 왼쪽.
2. *재료 통일하기:* ______
3. *대수로 정리하기:* ______
4. *확인하기:* $$\theta = \pi/4$$이면 왼쪽 $$1 + 1 = 2$$, 오른쪽 $$2/\sin\frac{\pi}{2} = 2$$. $$\theta$$가 $$\pi/2$$의 정수배이면 양쪽 모두 정의되지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$\tan\theta = \dfrac{\sin\theta}{\cos\theta}$$로 바꾸면 $$\dfrac{\sin\theta}{\cos\theta} + \dfrac{\cos\theta}{\sin\theta}$$.
3. 통분하면 $$\dfrac{\sin^2\theta + \cos^2\theta}{\sin\theta\cos\theta} = \dfrac{1}{\sin\theta\cos\theta}$$. 분모와 분자에 2를 곱하고 $$2\sin\theta\cos\theta = \sin 2\theta$$를 쓰면 $$\dfrac{2}{\sin 2\theta}$$.

</details>


## 문제 4 · 독립 문제

$$\sin 3\theta$$를 $$\sin\theta$$만으로 나타내라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\sin 3\theta = \sin(2\theta + \theta) = \sin 2\theta\cos\theta + \cos 2\theta\sin\theta = 2\sin\theta\cos^2\theta + (1 - 2\sin^2\theta)\sin\theta$$. $$\cos^2\theta = 1 - \sin^2\theta$$를 넣으면 $$2\sin\theta - 2\sin^3\theta + \sin\theta - 2\sin^3\theta = 3\sin\theta - 4\sin^3\theta$$.

확인: $$\theta = \pi/6$$이면 $$\sin\frac{\pi}{2} = 1$$이고 $$3 \cdot \frac12 - 4 \cdot \frac18 = 1$$이다.

</details>


## 변형 문제

$$\cos 3\theta$$를 $$\cos\theta$$만으로 나타내라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

같은 방법으로 $$\cos 3\theta = \cos 2\theta\cos\theta - \sin 2\theta\sin\theta = (2\cos^2\theta - 1)\cos\theta - 2\sin^2\theta\cos\theta = 4\cos^3\theta - 3\cos\theta$$. [드무아브르 공식](/Hongs_Blog/studies/college-math/euler-formula/)으로도 한 줄에 나온다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 다섯 항등식 모두 무작위 각 2만 개에서 양변 일치(실험으로 확인됨), 확인용 값 — [14_trig-identities_verify.py](/Hongs_Blog/studies/college-math/code/14_trig-identities_verify/)</div>

</div>


[^1]: OpenStax, *Precalculus 2e*, 7.1절 "Simplifying and Verifying Trigonometric Identities"(한쪽에서 출발해 다른 쪽으로 가는 전략)
{% endraw %}
