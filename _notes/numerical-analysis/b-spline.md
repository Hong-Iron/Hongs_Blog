---
layout: "note"
title: "B-스플라인"
display_title: "B-스플라인 (B-Spline)"
kind: "concept"
kind_label: "기법"
num: "16"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["B-Spline", "균등 3차 B-스플라인", "Uniform Cubic B-Spline", "스플라인", "Spline", "스플라인 기하 행렬", "Spline Geometry Matrix", "국소 조절", "Local Control"]
description: "조절점들을 늘어놓으면 곡선이 그 점들 근처를 부드럽게 지나가되, 점을 꼭 지나지는 않는다. 각 조각은 이웃한 조절점 네 개만 보고, 이웃 조각과 조절점 셋을 함께 써서 이음점에서 위치·속도·가속도가 모두 맞는다(C^2). 점 하나를 옮기면 근처 조각 네 개만 바뀌어 고치기 쉽다. …"
prev_url: "/studies/numerical-analysis/curve-continuity/"
prev_title: "곡선의 연속성"
next_url: "/studies/numerical-analysis/surface-patches/"
next_title: "매개변수 곡면 패치"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/b-spline/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

조절점들을 늘어놓으면 곡선이 그 점들 근처를 부드럽게 지나가되, 점을 꼭 지나지는 않는다. 각 조각은 이웃한 조절점 네 개만 보고, 이웃 조각과 조절점 셋을 함께 써서 이음점에서 위치·속도·가속도가 모두 맞는다($$C^2$$). 점 하나를 옮기면 근처 조각 네 개만 바뀌어 고치기 쉽다. 대신 조절점을 정확히 지나는 곡선을 원할 때는 맞지 않고, 같은 길이의 곡선에 베지어보다 조각이 많아 계산이 더 든다.

</div>


## 예시로 보기

조절점이 $$(0, 0)$$, $$(1, 3)$$, $$(3, 3)$$, $$(4, 0)$$, $$(6, 1)$$, $$(7, 4)$$로 6개다. 네 개씩 겹쳐 묶어 조각 세 개를 만든다.

| 조각 | 쓰는 조절점 | 출발점 $$\mathbf p(0)$$ |
|---|---|---|
| 1 | $$\mathbf p_0..\mathbf p_3$$ | $$\frac16(\mathbf p_0 + 4\mathbf p_1 + \mathbf p_2) = (\frac76, \frac52)$$ |
| 2 | $$\mathbf p_1..\mathbf p_4$$ | $$\frac16(\mathbf p_1 + 4\mathbf p_2 + \mathbf p_3)$$ |
| 3 | $$\mathbf p_2..\mathbf p_5$$ | $$\frac16(\mathbf p_2 + 4\mathbf p_3 + \mathbf p_4)$$ |

첫 조각은 $$\mathbf p_1 = (1, 3)$$에서 시작하지 않는다. $$\mathbf p_1$$ 쪽으로 끌려간 $$(\frac76, \frac52)$$에서 시작한다. $$\mathbf p_5$$를 $$(100, 100)$$으로 옮겨도 조각 1, 2는 그대로이고 조각 3만 바뀐다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/16_b-spline_fig1.svg" alt="그림" width="583" height="312" loading="lazy">

회색 점선이 조절점이고, 색 선이 세 조각이다. 곡선은 조절점을 지나지 않고 안쪽으로 끌려 들어간다. 조각이 바뀌는 점(동그라미)에서도 꺾임 없이 이어진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 블렌딩 함수와 $$M_S$$, 합 1·0 이상, 예시와 카드 C2, 무작위 200개 곡선의 이음점에서 0·1·2계 도함수 일치, 3계는 다름, 국소 조절 — [16_b-spline_verify.py](/Hongs_Blog/studies/numerical-analysis/code/16_b-spline_verify/)</div>

</div>


## 정의

스플라인은 조절점들로 곡선을 만들되, 가운데 두 점 사이를 지나는 조각을 만든다. 조절점을 꼭 지날 필요는 없고 가까이 가기만 한다. 점 $$\mathbf p_{i-1}, \mathbf p_i, \mathbf p_{i+1}, \mathbf p_{i+2}$$로 $$\mathbf p_i$$와 $$\mathbf p_{i+1}$$ 사이의 조각을 만든다[^1]. 점 하나를 더하면 다음 조각($$\mathbf p_i..\mathbf p_{i+3}$$)이 생긴다[^2].

```
조절점        p0    p1    p2    p3    p4    p5
조각 1       [p0 -------------- p3]
조각 2             [p1 -------------- p4]
조각 3                   [p2 -------------- p5]
그리는 칸           p1~p2 p2~p3 p3~p4
```

조각마다 조절점 네 개의 창을 한 칸씩 밀며 쓴다. 이웃한 두 창은 조절점 셋을 함께 쓰고, 각 조각은 창 가운데 두 점 사이의 한 칸만 그린다[^s3].

이음점 조건을 다음처럼 정한다. 앞 조각 $$\mathbf q$$와 뒤 조각 $$\mathbf p$$가 이음점에서 같은 값을 갖도록, 이음점을 조절점의 무게 평균으로 둔다[^3].

- 위치: $$\mathbf q(1) = \mathbf p(0) = \frac16(\mathbf p_{i-1} + 4\mathbf p_i + \mathbf p_{i+1})$$
- 속도: $$\mathbf q'(1) = \mathbf p'(0) = \frac12(\mathbf p_{i+1} - \mathbf p_{i-1})$$
- 대칭으로 끝점도: $$\mathbf p(1) = \frac16(\mathbf p_i + 4\mathbf p_{i+1} + \mathbf p_{i+2})$$, $$\mathbf p'(1) = \frac12(\mathbf p_{i+2} - \mathbf p_i)$$

이 선택이 유일하지는 않지만 잘 동작한다[^3]. 조절점 $$\mathbf p_0..\mathbf p_3$$에 대해 네 조건을 $$\mathbf c$$로 풀면 다음과 같다[^4].

$$\mathbf p(u) = \mathbf u^\top M_S\mathbf p, \qquad M_S = \frac16\begin{pmatrix}1 & 4 & 1 & 0\\ -3 & 0 & 3 & 0\\ 3 & -6 & 3 & 0\\ -1 & 3 & -3 & 1\end{pmatrix}$$


블렌딩 함수는 다음과 같다[^5].

$$\mathbf b(u) = \frac16\begin{pmatrix}(1 - u)^3\\ 4 - 6u^2 + 3u^3\\ 1 + 3u + 3u^2 - 3u^3\\ u^3\end{pmatrix}$$


네 함수는 $$[0, 1]$$에서 모두 0 이상이고 합이 1이다. 그래서 조각은 네 조절점의 볼록 껍질 안에 있다[^s1]. 스플라인은 조각 하나가 조절점 사이 한 칸만 덮어 베지어(조각 하나가 네 점을 다 씀)보다 계산이 많다[^5].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 위치 조건만 정했는데 왜 2계 도함수까지 맞는가?</summary>

$$M_S$$로 2계 도함수를 계산하면 $$\mathbf p''(0) = \mathbf p_{i-1} - 2\mathbf p_i + \mathbf p_{i+1}$$, $$\mathbf q''(1)$$도 같은 세 점의 같은 식이 된다. 이웃 조각이 조절점 셋을 같은 무게로 공유하기 때문이다(검증 코드에서 무작위 200개 모두 일치).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 조절점 하나가 조각 네 개에만 영향을 주는 이유</summary>

조각 하나는 조절점 네 개만 쓴다. 거꾸로 조절점 $$\mathbf p_k$$를 쓰는 조각은 $$\mathbf p_{k-3}..\mathbf p_k$$부터 $$\mathbf p_k..\mathbf p_{k+3}$$까지 넷뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 곡선이 조절점을 지나지 않는 이유</summary>

이음점이 $$\frac16(\mathbf p_{i-1} + 4\mathbf p_i + \mathbf p_{i+1})$$로 세 점의 평균이다. $$\mathbf p_i$$에 가장 큰 무게(4/6)를 주지만 이웃도 섞이므로, 세 점이 한 직선 위에 같은 간격으로 있지 않으면 $$\mathbf p_i$$와 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법의 핵심 아이디어는?</summary>

이음점의 위치와 기울기를 "이웃 조절점의 고정된 무게 평균"으로 정하면, 이웃 조각이 같은 공식을 써서 자동으로 매끄럽게 맞물린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

이웃끼리 같은 무게 평균을 쓰는 다른 곳. 예: 이미지 확대의 쌍3차 보간, 신호의 이동 평균 필터.

</details>


## 활용

- 연습: [예제 사다리](/Hongs_Blog/studies/numerical-analysis/b-spline-ladder/)(완전한 풀이 → 빈칸 → 독립 문제)
- CAD와 3D 모델링(NURBS는 B-스플라인에 무게와 불균등 간격을 더한 것), 폰트 설계, 로봇 경로처럼 $$C^2$$ 매끄러움과 국소 수정이 필요한 곳에 쓴다[^s1].
- 흔한 실수: 끝 조절점에서 곡선이 시작한다고 생각하는 것. 균등 B-스플라인은 $$\mathbf p_0$$에서 시작하지 않는다. 끝을 맞추려면 끝 조절점을 세 번 겹쳐 놓는다.

## 연결

- 선수: [곡선의 연속성](/Hongs_Blog/studies/numerical-analysis/curve-continuity/)($$C^2$$의 뜻)
- 곡면으로 넓히면: [매개변수 곡면 패치](/Hongs_Blog/studies/numerical-analysis/surface-patches/)
- 베지어로 바꿔 그리기: [베지어 곡선의 세분화](/Hongs_Blog/studies/numerical-analysis/bezier-subdivision/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"더 매끄러운 곡선이 조절점에 더 정확히 맞는다"</div>

틀렸다. B-스플라인은 보간 곡선보다 매끄럽지만($$C^2$$ 대 $$C^0$$) 조절점을 지나지 않는다. 매끄러움과 정확한 통과는 서로 맞바꾸는 성질이다. 정확히 지나게 하면(3차 보간) 블렌딩 값이 음수가 되어 출렁이고, 무게를 모두 0 이상으로 두면(B-스플라인) 점들 안쪽으로 끌려 들어간다. 예시에서 첫 조각은 $$(1, 3)$$이 아니라 $$(\frac76, \frac52)$$에서 시작한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 균등 3차 B-스플라인의 이음점 위치와 속도 조건을 쓰라.</summary>

**답:** $$\mathbf p(0) = \frac16(\mathbf p_{i-1} + 4\mathbf p_i + \mathbf p_{i+1})$$, $$\mathbf p'(0) = \frac12(\mathbf p_{i+1} - \mathbf p_{i-1})$$. 끝 $$u = 1$$도 한 칸 옮긴 같은 식.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 조절점 $$(0, 0)$$, $$(1, 3)$$, $$(3, 3)$$, $$(4, 0)$$으로 만든 조각의 출발점 $$\mathbf p(0)$$은?</summary>

**답:** $$\frac16((0, 0) + 4(1, 3) + (3, 3)) = \frac16(7, 15) = (\frac76, \frac52)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** B-스플라인 조각이 조절점 네 개의 볼록 껍질 안에 머무는 이유는?</summary>

**답:** 블렌딩 함수 네 개가 $$[0, 1]$$에서 모두 0 이상이고 합이 1이다. 그래서 곡선의 점은 조절점의 가중 평균이고, 가중 평균은 볼록 껍질 밖으로 나갈 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 여섯 점을 모두 정확히 지나는 곡선이 필요하다. 3차 보간, 에르미트, B-스플라인 중 무엇을 쓰고, B-스플라인은 왜 아닌가?</summary>

**답:** 점을 지나야 하므로 3차 보간이나 에르미트(이음점 매끄러움이 필요하면 에르미트, 접선은 이웃 점 차이로)를 쓴다. B-스플라인은 조절점을 지나지 않는다.

</details>


[^1]: 수치해석 7회 강의 자료 「na07_curves」, p.27
[^2]: 같은 자료, p.28
[^3]: 같은 자료, p.29
[^4]: 같은 자료, p.30
[^5]: 같은 자료, p.31
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예시 표와 국소 조절 실험, 볼록 껍질, 스스로 설명해 보기, NURBS·활용, 끝점 겹치기, 오해, 카드 C2~C4는 원본에 없다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [16_b-spline_plot.py](/Hongs_Blog/studies/numerical-analysis/code/16_b-spline_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 첫 조각의 출발점 $$(\frac76, \frac52)$$, 두 이음점에서 0·1·2계 도함수 일치.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 다이어그램 1개는 원본에 없다. 이 문서 '예시로 보기'의 조각 표와 '정의'의 조각 구성(원본 07.na07_curves.pdf p.27~28)으로 그렸다.
{% endraw %}
