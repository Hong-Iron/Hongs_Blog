---
layout: "note"
title: "함수의 변환과 합성"
display_title: "함수의 변환과 합성 (Transformation and Composition)"
kind: "concept"
kind_label: "기법"
num: "02"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Transformation of Functions", "평행이동", "대칭이동", "확대", "축소", "합성함수", "Composition of Functions", "composite function"]
description: "그래프를 통째로 옮기고, 늘이고, 뒤집는 조작과, 한 함수의 출력을 다른 함수의 입력으로 넣는 합성이다. 출력 쪽을 바꾸면 그래프가 바꾼 대로 움직이지만, 입력 쪽을 바꾸면 거꾸로 움직이는 것처럼 보인다. 합성은 양말과 신발처럼 순서를 바꾸면 결과가 달라진다."
prev_url: "/studies/college-math/function/"
prev_title: "함수"
next_url: "/studies/college-math/inverse-function/"
next_title: "역함수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/function-transformation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

그래프를 통째로 옮기고, 늘이고, 뒤집는 조작과, 한 함수의 출력을 다른 함수의 입력으로 넣는 합성이다. 출력 쪽을 바꾸면 그래프가 바꾼 대로 움직이지만, 입력 쪽을 바꾸면 거꾸로 움직이는 것처럼 보인다. 합성은 양말과 신발처럼 순서를 바꾸면 결과가 달라진다.

</div>


## 예시로 보기

$$f(x) = x^2$$의 그래프 위의 점 $$(1, 1)$$이 각 조작에서 어디로 가는지 본다.

| 새 함수 | 그래프의 변화 | $$(1, 1)$$이 가는 곳 |
|---|---|---|
| $$f(x) + 2$$ | 위로 2 | $$(1, 3)$$ |
| $$f(x - 3)$$ | 오른쪽으로 3 | $$(4, 1)$$ |
| $$2f(x)$$ | 세로로 2배 | $$(1, 2)$$ |
| $$f(2x)$$ | 가로로 절반 | $$(\tfrac12, 1)$$ |
| $$-f(x)$$ | $$x$$축에 대칭 | $$(1, -1)$$ |
| $$f(-x)$$ | $$y$$축에 대칭 | $$(-1, 1)$$ |

입력 쪽이 거꾸로인 이유는 이렇다. $$g(x) = f(x - 3)$$이 원래의 $$f(0)$$을 내려면 $$x - 3 = 0$$, 즉 $$x = 3$$이어야 한다. 원래 $$x = 0$$에서 일어나던 일이 $$x = 3$$에서 일어나니 오른쪽 이동이다. 거꾸로 움직이는 것이 아니라, 같은 일이 일어나는 새 위치를 푼 결과다.

합성은 함수를 이어 붙이는 것이다. $$f(x) = x + 1$$(1 더하기)과 $$g(x) = 2x$$(2배 하기)로 두 순서를 비교한다.

- $$(g \circ f)(x) = g(f(x)) = 2(x + 1) = 2x + 2$$: 1을 더한 뒤 2배
- $$(f \circ g)(x) = f(g(x)) = 2x + 1$$: 2배 한 뒤 1을 더함

기호 $$g \circ f$$는 오른쪽의 $$f$$를 먼저 적용한다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**변환.** 함수 $$f$$와 실수 $$a, b \ne 0$$, $$h$$, $$k$$에 대해 $$g(x) = a\,f\big(b(x - h)\big) + k$$라 하자. $$f$$의 그래프 위의 점 $$(x_0, y_0)$$은 $$g$$의 그래프 위의 점

$$\left(\frac{x_0}{b} + h,\ \ a\,y_0 + k\right)$$

로 간다[^1]. 가로로는 $$1/\vert b\vert $$배 후 오른쪽으로 $$h$$, 세로로는 $$\vert a\vert $$배 후 위로 $$k$$다. $$b < 0$$이면 $$y$$축 대칭이, $$a < 0$$이면 $$x$$축 대칭이 더해진다.

**합성.** $$f: X \to Y$$, $$g: Y' \to Z$$일 때 $$(g \circ f)(x) = g(f(x))$$다. 정의역은 $$f(x)$$가 $$g$$의 정의역에 드는 $$x$$들, 즉 $$\{x \in X : f(x) \in Y'\}$$($$\in$$은 "~에 속한다")이다[^2].

</div>


점 대응은 대입 한 번으로 확인된다.

$$g\!\left(\frac{x_0}{b} + h\right) = a\,f\!\left(b \cdot \frac{x_0}{b}\right) + k = a\,f(x_0) + k = a\,y_0 + k$$


합성은 결합법칙 $$h \circ (g \circ f) = (h \circ g) \circ f$$가 늘 맞는다. 교환법칙 $$g \circ f = f \circ g$$는 위의 예처럼 일반적으로 맞지 않는다.

## 예제

$$y = -2(x - 1)^2 + 3$$의 그래프를 $$y = x^2$$에서 얻는다.

1. *틀에 맞추기:* $$a = -2$$, $$b = 1$$, $$h = 1$$, $$k = 3$$.
2. *기준점 옮기기:* 꼭짓점 $$(0, 0)$$은 $$(0/1 + 1,\ -2 \cdot 0 + 3) = (1, 3)$$으로 간다.
3. *모양 읽기:* $$a < 0$$이라 아래로 열리고, $$\vert a\vert  = 2$$라 원래보다 세로로 2배 가파르다.
4. *확인:* $$x = 0$$과 $$x = 2$$에서 모두 $$y = 1$$이다. 꼭짓점 $$x = 1$$에 대해 대칭이다.

합성의 정의역은 안쪽 함수의 출력이 바깥 함수의 정의역에 들어야 한다. $$u(x) = x - 1$$, $$v(x) = \sqrt{x}$$이면 $$v \circ u$$는 $$x - 1 \ge 0$$, 즉 $$x \ge 1$$에서만 정의된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 점 대응을 함수 3개 × 무작위 계수 2,000세트에 대해 유리수로 정확히 확인, 예제와 카드 C1·C3의 값 — [02_function-transformation_verify.py](/Hongs_Blog/studies/college-math/code/02_function-transformation_verify/)</div>

</div>


## 활용

- 신호 $$s(t)$$를 $$t_0$$초 늦추면 $$s(t - t_0)$$, 세기를 $$A$$배 키우면 $$A\,s(t)$$다. 사인파 $$A\sin(\omega(t - t_0))$$가 이 두 변환을 합친 것이다[^s1].
- 화면 좌표는 $$y$$가 아래로 커진다. 높이가 $$H$$인 화면에서 수학 좌표 $$y$$를 화면 좌표로 바꾸면 $$H - y$$다. $$a = -1$$(뒤집기)과 $$k = H$$(올리기)를 합친 변환이다.
- 셸의 <code>cmd1 &#124; cmd2</code>는 `cmd1`을 먼저 실행한다. 함수로 쓰면 $$\text{cmd2} \circ \text{cmd1}$$이다. 적는 순서와 합성 기호의 순서가 반대라서 헷갈리기 쉽다.
- 흔한 실수는 변환을 여러 번 할 때 순서를 바꾸는 것이다. 세로로 늘이기와 위아래로 옮기기는 순서에 따라 결과가 다르다(카드 C1).
- 알고리즘에서: 격자를 시계 방향으로 90도 돌리는 `zip(*a[::-1])`은 위아래 뒤집기를 먼저 하고 행과 열 바꾸기(전치)를 나중에 하는 합성이다. 순서를 바꿔 전치부터 하면 반시계 방향으로 돈다([구현과 시뮬레이션](/Hongs_Blog/studies/algorithms/simulation/)). [신규 아이디 추천](/Hongs_Blog/studies/algorithms/pg72410/)도 문자열 규칙 일곱 개를 차례로 합성하는 문제라서, `a.!.b`에서 "허용 문자만 남기기"를 먼저 하면 `a.b`, "연속 마침표 줄이기"를 먼저 하면 `a..b`가 나온다.

## 연결

- 선수: [함수](/Hongs_Blog/studies/college-math/function/)
- 이어지는 개념: [역함수](/Hongs_Blog/studies/college-math/inverse-function/)(합성해서 제자리로 돌아오는 함수), [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)의 $$a \cdot b^x$$, [사인파](/Hongs_Blog/studies/college-math/sinusoid/)의 진폭·주기·위상
- 미분적분학의 [연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/)은 합성함수의 변화율을 다룬다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"f(x − 3)은 그래프를 왼쪽으로 3 옮긴다"</div>

틀렸다. 빼기가 수직선에서 왼쪽을 떠올리게 해서 그럴듯하다. 실제로는 오른쪽으로 3 옮긴다. $$f(x - 3)$$은 $$x = 3$$에서 원래의 $$f(0)$$ 값을 낸다. $$f(x) = x^2$$이면 꼭짓점이 $$x = 0$$에서 $$x = 3$$으로 간다. $$x = 3$$을 대입해 $$0$$이 나오는지 보면 확인된다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** y = x²의 그래프를 (1) 왼쪽으로 2 (2) 세로로 3배 (3) 아래로 1 순서로 바꾼 함수식을 쓰라. (2)와 (3)의 순서를 바꾸면 어떻게 되는가?</summary>

**답:** $$y = 3(x + 2)^2 - 1$$. 순서를 바꾸면 먼저 내린 1까지 3배가 되어 $$y = 3\big((x + 2)^2 - 1\big) = 3(x + 2)^2 - 3$$이다.

**흔한 오답:** 왼쪽 이동을 $$(x - 2)^2$$로 쓰는 것. 입력 쪽은 반대 부호가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 왜 f(x − 3)의 그래프는 f(x)의 그래프를 오른쪽으로 3 옮긴 것인가? 점이 어디로 가는지로 설명하라.</summary>

**답:** $$f$$ 위의 점 $$(x_0, y_0)$$과 같은 출력 $$y_0$$을 새 함수에서 얻으려면 입력 $$x - 3$$이 $$x_0$$이어야 하므로 $$x = x_0 + 3$$이다. 모든 점이 $$(x_0 + 3, y_0)$$으로 가니 오른쪽으로 3 이동이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** f(x) = x + 1, g(x) = x²일 때 f∘g와 g∘f를 각각 식으로 쓰고 x = 2에서의 값을 구하라. 두 값이 다른 이유는?</summary>

**답:** $$(f \circ g)(x) = x^2 + 1$$이고 값은 $$5$$. $$(g \circ f)(x) = (x + 1)^2$$이고 값은 $$9$$. 먼저 제곱하느냐, 먼저 1을 더하느냐가 달라서다. 합성은 교환법칙이 맞지 않는다.

**흔한 오답:** $$f \circ g$$를 "$$f$$를 먼저"로 읽는 것. 오른쪽의 $$g$$가 먼저다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 1.5절 "Transformation of Functions". 교재는 이동·대칭·확대를 하나씩 다룬다. 한 식으로 묶은 점 대응은 그 결과를 합친 것이다.
[^2]: OpenStax, *Precalculus 2e*, 1.4절 "Composition of Functions"
[^s1]: 에이전트 보충. 신호 지연·화면 좌표·셸 파이프라인은 컴퓨터공학에서 변환과 합성이 쓰이는 곳을 보이려고 넣었다.
{% endraw %}
