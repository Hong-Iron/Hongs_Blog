---
layout: "note"
title: "파젠 창과 k-이웃 비교"
display_title: "파젠 창과 k-이웃 비교"
kind: "concept"
kind_label: "비교"
num: "17"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
updated: "2026-10-11"
status: "verified"
aliases: ["Parzen Window vs k-Nearest Neighbor", "파젠 창 대 k-이웃", "비모수 밀도 추정 비교"]
description: "둘 다 물어보는 값을 가운데 둔 구역을 잡고 \"든 비율 ÷ 구역 크기\", 곧 \\frac{k/n}{V}로 밀도를 어림한다(n은 표본 수, k는 구역에 든 표본 수, V는 구역의 크기). 가르는 질문은 \"V와 k 가운데 무엇을 미리 정해 두는가\"다. 파젠 창은 크기를 정해 두고 개수를…"
prev_url: "/studies/data-and-information/knn-density/"
prev_title: "k-이웃 밀도 추정"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-and-information/parzen-vs-knn/"
---
{% raw %}
둘 다 물어보는 값을 가운데 둔 구역을 잡고 "든 비율 ÷ 구역 크기", 곧 $$\frac{k/n}{V}$$로 밀도를 어림한다($$n$$은 표본 수, $$k$$는 구역에 든 표본 수, $$V$$는 구역의 크기). 가르는 질문은 "$$V$$와 $$k$$ 가운데 무엇을 미리 정해 두는가"다. 파젠 창은 크기를 정해 두고 개수를 세고, k-이웃은 개수를 정해 두고 크기를 잰다[^1]. 이 선택이 자료가 없는 곳에서 받는 답, 곡선의 넓이, 사람이 골라야 하는 값을 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 자료가 한쪽에는 빽빽하고 다른 쪽에는 듬성듬성하다. 두 곳 모두에서 쓸 만한 값을 얻고 싶다. (b) 어림한 곡선을 적분해 "값이 10과 15 사이에 들 확률"을 구하려 한다. 어느 쪽인가?</summary>

**답:** (a) k-이웃. 구역이 빽빽한 곳에서는 좁아지고 드문 곳에서는 넓어진다. 파젠 창은 크기 하나로 두 곳을 다 맞추지 못해, 드문 곳에 맞추면 빽빽한 곳이 뭉개지고 빽빽한 곳에 맞추면 드문 곳이 0이 된다. (b) 파젠 창. 곡선 아래 넓이가 늘 1이라 적분한 값이 확률이 된다. k-이웃의 곡선은 넓이가 1을 넘어 한없이 커진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 자료에서 한참 벗어난 값이 들어오면 "이런 값은 본 적이 없다"는 답을 받고 싶다. (d) 어떤 값이 들어와도 남자인지 여자인지 반드시 하나를 답해야 한다. 어느 쪽인가?</summary>

**답:** (c) 파젠 창. 창 안에 표본이 없으면 0을 준다. k-이웃은 표본을 만날 때까지 넓히므로 어디서나 0보다 큰 값을 준다. (d) k-이웃. 늘 표본 $$k$$개를 잡으니 많은 쪽을 고를 수 있다. 파젠 창은 창이 비면 어느 클래스도 고르지 못한다.<br>
**이유:** 머리카락 길이 10개(남 3, 4, 5, 5, 6, 12, 여 7, 13, 14, 20)에서 9.6을 물으면, 폭 4인 창에는 아무도 없어 답이 없다. 가까운 3개로는 12(남), 7(여), 13(여)이라 여자다. 창을 폭 10으로 넓히면 남 4, 여 3이라 남자로 답이 바뀐다[^s1].

</details>


## 결정적 차이

| | 파젠 창 | k-이웃 |
|---|---|---|
| 미리 정하는 것 | 구역의 크기 $$V_n$$(한 변 $$h_n$$) | 구역에 들 개수 $$k_n$$ |
| 물음마다 달라지는 것 | 든 개수 $$k_n$$ | 구역의 크기 $$V_n$$ |
| 표본이 없는 곳 | 0 | 0보다 크다 |
| 곡선 아래 넓이 | 늘 1 | 1을 넘어 한없이 커진다 |
| 표본 바로 위 | 유한하다 | 개수가 1이면 한없이 커진다 |
| 정한 값이 너무 크면 | 봉우리와 골짜기가 뭉개진다 | 같다 |
| 정한 값이 너무 작으면 | 표본마다 기둥, 나머지는 0 | 표본마다 뾰족한 봉우리 |
| 분류 | 창 안에 많이 든 쪽. 창이 비면 답이 없다 | 가까운 $$k_n$$개 가운데 많은 쪽. 늘 답이 있다 |

위 두 줄은 슬라이드 p.8을 옮긴 것이고, 나머지는 두 개념 문서에서 계산으로 확인한 것이다[^1][^s1]. 선택을 가르는 줄은 "표본이 없는 곳"과 "곡선 아래 넓이"다.

같은 자료 10개에서 두 방법이 내는 값을 나란히 놓는다.

| 물어보는 값 | 파젠 창 폭 4 | 파젠 창 폭 10 | k-이웃 개수 3 | k-이웃 개수 5 |
|---|---|---|---|---|
| 5.2 (표본이 몰린 곳) | 0.125 | 0.06 | 0.1875 | 0.1389 |
| 9.6 (표본이 없는 곳) | 0 | 0.07 | 0.0441 | 0.0568 |

파젠 창은 폭에 따라 두 곳의 높낮이가 뒤집힌다. k-이웃은 개수를 바꿔도 5.2가 9.6보다 높다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 여덟 값, 넓이(파젠 창 1, k-이웃은 범위를 넓히면 2.32 → 3.00 → 3.67), 9.6의 분류 예 — [15_parzen-window_verify.py](/Hongs_Blog/studies/data-and-information/code/15_parzen-window_verify/), [16_knn-density_verify.py](/Hongs_Blog/studies/data-and-information/code/16_knn-density_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 방법 모두 맞지 않는 상황 두 가지와 그때의 선택지를 쓰라.</summary>

**답:** ① 자료가 종 모양으로 퍼진다는 것을 알고(또는 그렇게 믿을 만하고) 표본이 적을 때. 모양을 정규분포로 두고 평균과 분산만 [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/)으로 구한다. 숫자 두 개만 구하면 되어 표본이 적어도 되고, 표본을 모두 갖고 다닐 필요도 없다. ② 물어볼 값의 범위가 정해져 있고 답을 미리 표로 만들어 두어야 할 때. 칸을 미리 잘라 세어 두는 [히스토그램](/Hongs_Blog/studies/data-and-information/histogram-density/)이 물음마다 표본을 훑지 않아 빠르다.<br>
**이유:** 파젠 창과 k-이웃은 모양을 가정하지 않는 대신 표본을 모두 쥐고 있어야 하고 물음마다 계산한다[^2]. 잰 값의 가짓수가 많아지면 구역을 채울 표본이 급격히 많이 필요해진다([차원의 저주](/Hongs_Blog/studies/data-science/curse-of-dimensionality/))[^s2].

</details>


[^1]: 자료와 정보 10회 강의 자료 「D&I_강의10_확률값 찾기」, p.8 (두 가지 접근법), p.14 (요약: 영역을 정하고 샘플을 세는 법, $$k$$ 샘플이 찾아질 때까지 영역을 넓힘)
[^2]: 같은 자료, p.3 (그때그때 확률값 구하기), p.4 (매개변수 추정과 확률 직접 추정), p.6 (히스토그램은 모든 구간의 값을 미리 찾는다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 표의 셋째 줄부터와 숫자 표, 카드 C1~C3의 상황은 원본에 없다. 두 개념 문서의 자료 10개로 계산해 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 잰 값의 가짓수가 늘 때의 어려움은 원본에 없다. Duda, Hart, Stork, *Pattern Classification* 2판, 4.3절이 다룬다.
{% endraw %}
