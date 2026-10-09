---
layout: "note"
title: "민코프스키 거리"
display_title: "민코프스키 거리 (Minkowski Distance)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Minkowski Distance", "Lp 거리", "Lp Norm", "유클리드 거리", "Euclidean Distance", "맨해튼 거리", "Manhattan Distance", "시가지 거리", "City Block Distance", "최대 거리", "Supremum Distance", "체비셰프 거리", "거리 공리", "삼각부등식"]
description: "숫자로 된 두 점이 얼마나 떨어져 있는지 재는 방법을 하나로 묶은 공식이다. 지도에서 곧장 날아가는 거리(유클리드)와 바둑판 같은 도로를 따라 걷는 거리(맨해튼)가 모두 이 공식의 특별한 경우다. 공식 속 지수 하나만 바꾸면 어느 쪽인지 정해진다. 다만 지수가 1보다 작으면 \"돌아…"
prev_url: "/studies/data-science/categorical-dissimilarity/"
prev_title: "범주형 속성의 비유사도"
next_url: "/studies/data-science/data-cleaning/"
next_title: "데이터 정제"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-science/minkowski-distance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

숫자로 된 두 점이 얼마나 떨어져 있는지 재는 방법을 하나로 묶은 공식이다. 지도에서 곧장 날아가는 거리(유클리드)와 바둑판 같은 도로를 따라 걷는 거리(맨해튼)가 모두 이 공식의 특별한 경우다. 공식 속 지수 하나만 바꾸면 어느 쪽인지 정해진다. 다만 지수가 1보다 작으면 "돌아가는 길이 더 짧아지는" 이상한 값이 나와 거리라고 부를 수 없고, 속성마다 단위가 다르면 큰 단위의 속성이 거리를 독차지한다.

</div>


## 예시로 보기

점 $$x_1 = (1, 2)$$에서 $$x_2 = (3, 5)$$까지 가로로 2, 세로로 3 떨어져 있다[^1].

- 대각선으로 곧장 가면 피타고라스 정리로 $$\sqrt{2^2 + 3^2} = \sqrt{13} \approx 3.61$$이다. 유클리드 거리다.
- 바둑판 도로처럼 가로세로로만 갈 수 있으면 $$2 + 3 = 5$$다. 맨해튼 거리(시가지 거리)다. 뉴욕 맨해튼의 격자 도로에서 택시가 가는 거리라는 뜻이다.

두 식은 "각 좌표의 차이를 몇 제곱 해서 더하고, 다시 그만큼 제곱근을 씌운다"는 같은 모양이다. 유클리드는 2제곱, 맨해튼은 1제곱이다. 이 지수를 $$h$$로 두면 하나의 식이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$(1, 2)$$–$$(3, 5)$$의 3.61과 5, 무작위 점 2,000쌍에서 세 성질, $$h$$가 커지면 3으로 줄어듦, $$h = \frac12$$의 반례, 카드 C3 — [04_minkowski-distance_verify.py](/Hongs_Blog/studies/data-science/code/04_minkowski-distance_verify/)</div>

</div>


## 정의

수치 속성 $$p$$개로 적은 두 대상 $$i = (x_{i1}, \dots, x_{ip})$$와 $$j = (x_{j1}, \dots, x_{jp})$$의 민코프스키 거리는, 좌표 차이의 $$h$$제곱을 모두 더해 $$h$$제곱근을 씌운 것이다[^1]. 여기서 $$h \ge 1$$인 실수다.

$$d(i, j) = \sqrt[h]{\vert x_{i1} - x_{j1}\vert ^h + \vert x_{i2} - x_{j2}\vert ^h + \cdots + \vert x_{ip} - x_{jp}\vert ^h}$$


| $$h$$ | 이름 | 식 |
|---|---|---|
| 1 | 맨해튼 거리 | $$\sum_f \lvert x_{if} - x_{jf}\rvert$$ |
| 2 | 유클리드 거리 | $$\sqrt{\sum_f (x_{if} - x_{jf})^2}$$ |
| $$\infty$$ | 최대 거리 | $$\max_f \lvert x_{if} - x_{jf}\rvert$$[^s1] |

$$h$$가 커질수록 가장 큰 좌표 차이가 합을 좌우한다. 예시 두 점은 $$h = 1, 2, 4, 10$$에서 5, 3.61, 3.14, 3.005로 줄어 가장 큰 차이인 3에 다가간다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/data-science/04_minkowski-distance_fig1.svg" alt="그림" width="440" height="357" loading="lazy">

원점에서 거리가 정확히 1인 점들을 $$h$$마다 이었다. $$h = 1$$은 마름모, $$h = 2$$는 원이고, $$h$$가 커질수록 정사각형($$h = \infty$$)에 다가간다. 점선 $$h = \frac12$$는 안쪽으로 오목하다. 그래서 곧장 가는 길이 꺾어 가는 길보다 길어진다[^s2].

거리는 다음 세 성질을 지킨다[^1].

- **0 이상:** $$d(i, j) \ge 0$$.
- **대칭:** $$d(i, j) = d(j, i)$$.
- **삼각부등식:** $$d(i, j) \le d(i, k) + d(k, j)$$. 다른 점 $$k$$를 들렀다 가는 길이 곧장 가는 길보다 짧을 수 없다.

## 예제

**$$h < 1$$이면 거리가 아니다.** $$h = \frac12$$로 $$(0, 0)$$, $$(1, 0)$$, $$(1, 1)$$을 잰다[^s1].

- 곧장: $$d((0,0), (1,1)) = (\sqrt1 + \sqrt1)^2 = 4$$.
- $$(1, 0)$$을 들러서: $$d((0,0), (1,0)) + d((1,0), (1,1)) = 1 + 1 = 2$$.

들러 가는 길(2)이 곧장 가는 길(4)보다 짧아 삼각부등식이 깨진다. 그래서 정의에서 $$h \ge 1$$로 제한한다.

## 활용

- 군집화(k-평균 등)와 최근접 이웃 찾기의 기본 거리다.
- 맨해튼 거리는 한 좌표의 큰 차이를 제곱으로 키우지 않아, 튀는 값 하나에 유클리드보다 덜 흔들린다[^s1].
- 흔한 실수: 단위가 다른 속성을 그대로 넣는 것. 키를 cm로 적으면 몸무게 차이가 묻히고, m로 적으면 키 차이가 묻힌다. 먼저 [정규화](/Hongs_Blog/studies/data-science/normalization/)한다.

## 연결

- 수치가 아닌 속성의 비유사도: [범주형 속성의 비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/)
- 같은 식을 벡터의 길이로 보면 $$L_h$$ 노름이다: [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/), [노름과 조건수](/Hongs_Blog/studies/linear-algebra/conditioning/)
- 거리의 세 성질 중 대칭이 깨지는 척도: [KL 발산](/Hongs_Blog/studies/probability-statistics/cross-entropy-kl/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$(0, 0)$$과 $$(4, 3)$$ 사이의 맨해튼, 유클리드, 최대 거리를 구하라.</summary>

**답:** 맨해튼 $$4 + 3 = 7$$, 유클리드 $$\sqrt{16 + 9} = 5$$, 최대 $$\max(4, 3) = 4$$. 늘 맨해튼 ≥ 유클리드 ≥ 최대다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 민코프스키 공식에서 $$h$$를 1보다 작게 잡으면 안 되는 이유를 반례로 보여라.</summary>

**답:** $$h = \frac12$$에서 $$(0,0)$$–$$(1,1)$$은 4인데, $$(1, 0)$$을 들러 가면 $$1 + 1 = 2$$로 더 짧다. 삼각부등식이 깨져 거리가 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 세 사람 A(170 cm, 60 kg), B(180 cm, 61 kg), C(171 cm, 62 kg)에서 A와 가장 가까운 사람을 유클리드 거리로 찾으라. 키를 m로 바꿔 적으면 어떻게 되는가? 무엇을 해야 하는가?</summary>

**답:** cm로 적으면 $$d(A, B) \approx 10.05$$, $$d(A, C) \approx 2.24$$라 C가 가깝다. m로 적으면 $$d(A, B) \approx 1.005$$, $$d(A, C) \approx 2.0$$이라 B가 가깝다. 단위만 바꿨는데 답이 뒤집힌다. 속성마다 크기를 맞추는 [정규화](/Hongs_Blog/studies/data-science/normalization/)를 먼저 해야 한다[^s1].

</details>


[^1]: 데이터 과학 2회 강의 자료 「2-1_data-measure-preprocess」, p.25
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 최대 거리($$h \to \infty$$), $$h$$에 따른 감소, $$h < 1$$의 반례, 맨해튼 거리의 견고성, 카드 C1~C3은 원본에 없다. Han, Kamber, Pei, *Data Mining: Concepts and Techniques* 3판, 2.4.4절이 최대 거리를 다룬다. 수치는 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 1장은 원본에 없다. [04_minkowski-distance_plot.py](/Hongs_Blog/studies/data-science/code/04_minkowski-distance_plot/)로 그렸고, 곡선 위 점들의 거리가 1인지, 예시 두 점의 5, 3.61, 3.14, 3.005, $$h = \frac12$$의 반례를 같은 코드로 확인했다.
{% endraw %}
