---
layout: "note"
title: "k-평균 예제 사다리"
display_title: "k-평균 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "25"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: k-평균의 배정·갱신 단계와 목적 함수 J."
prev_url: "/studies/data-science/fp-growth-ladder/"
prev_title: "FP-Growth 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/k-means-ladder/"
---
{% raw %}
사용 개념: [k-평균](/Hongs_Blog/studies/data-science/k-means/)의 배정·갱신 단계와 목적 함수 $$J$$.

"처음 중심이 주어지고 k-평균을 끝까지 돌려라"는 문제는 같은 하위목표의 되풀이다. ① 배정: 점마다 가장 가까운 중심을 고른다(같으면 앞 번호) ② 갱신: 군집마다 평균을 낸다 ③ 멈춤 확인: 중심이 그대로면 멈춘다 ④ $$J$$ 계산: 점마다 자기 중심까지 거리 제곱을 더한다[^s1].

## 문제 1 · 완전한 풀이

1차원 점 1, 2, 3, 8, 9, 10, 25, $$k = 2$$, 처음 중심 1과 2.

1. *배정:* 1 → 중심 1, 나머지 → 중심 2(2에서 25까지 모두 1보다 2에 가깝거나 같다).
2. *갱신:* 중심 1, $$\frac{2 + 3 + 8 + 9 + 10 + 25}{6} = 9.5$$.
3. *배정:* 2, 3은 1에 더 가깝고(1, 2 대 7.5, 6.5), 8 이상은 9.5에 가깝다. → {1, 2, 3} / {8, 9, 10, 25}.
4. *갱신:* 2, 13.
5. *배정:* 그대로. *멈춤 확인:* 중심이 바뀌지 않아 멈춘다.
6. *$$J$$ 계산:* $$(1 + 0 + 1) + (25 + 16 + 9 + 144) = 196$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [25_k-means_impl.py](/Hongs_Blog/studies/data-science/code/25_k-means_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

2차원 점 (1, 1), (1, 2), (2, 1), (5, 4), (5, 5), (6, 5), $$k = 2$$, 처음 중심 (1, 1)과 (5, 4).

1. *배정:* 앞 세 점 → 중심 (1, 1), 뒤 세 점 → 중심 (5, 4).
2. *갱신:* $$(\frac43, \frac43)$$, $$(\frac{16}{3}, \frac{14}{3})$$.
3. *배정과 멈춤 확인:* 소속이 그대로라 중심도 그대로다. 멈춘다.
4. *$$J$$ 계산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

군집 1: $$(1,1)$$은 $$\frac19 + \frac19$$, $$(1,2)$$는 $$\frac19 + \frac49$$, $$(2,1)$$은 $$\frac49 + \frac19$$. 합 $$\frac{12}{9} = \frac43$$. 군집 2도 같은 모양이라 $$\frac43$$. $$J = \frac83 \approx 2.67$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

1차원 점 2, 3, 4, 10, 11, 12, 20, 25, 30, $$k = 3$$, 처음 중심 2, 4, 6.

1. *배정:* ______
2. *갱신:* 2.5, 4, 18.
3. *배정:* ______
4. *갱신:* 2.5, $$\frac{25}{3}$$, $$\frac{87}{4}$$.
5. *배정과 갱신:* ______
6. *$$J$$ 계산:* 54.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 2 → 2. 3은 2와 4에서 같은 거리라 앞 번호인 2로. 4 → 4. 10 이상은 모두 6이 가장 가깝다. → {2, 3} / {4} / {10, 11, 12, 20, 25, 30}.
3. 4는 중심 4. 10은 4까지 6, 18까지 8이라 4로. 11은 7과 7로 같아 앞 번호 4로. 12 이상은 18로. → {2, 3} / {4, 10, 11} / {12, 20, 25, 30}.
5. 4는 2.5까지 1.5, $$\frac{25}{3}$$까지 4.33이라 첫째로. 10, 11, 12는 $$\frac{25}{3}$$로, 20 이상은 $$\frac{87}{4}$$로. → {2, 3, 4} / {10, 11, 12} / {20, 25, 30}. 갱신하면 3, 11, 25. 다시 배정해도 그대로라 멈춘다. $$J = 2 + 2 + 50 = 54$$.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [25_k-means-ladder_p4.py](/Hongs_Blog/studies/data-science/code/25_k-means-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

직사각형의 네 꼭짓점 (0, 0), (0, 2), (6, 0), (6, 2)를 $$k = 2$$로 나눈다. (a) 처음 중심을 (0, 0), (0, 2)로 둘 때와 (b) (0, 0), (6, 0)으로 둘 때 각각 멈추는 답과 $$J$$를 구하고, 이 결과가 k-평균에 대해 말해 주는 것을 쓰라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 아래 두 점 / 위 두 점으로 나뉘어 중심 (3, 0), (3, 2). 다시 배정해도 그대로라 멈춘다. $$J = 4 \times 9 = 36$$.<br>
(b) 왼쪽 두 점 / 오른쪽 두 점으로 나뉘어 중심 (0, 1), (6, 1). $$J = 4 \times 1 = 4$$.<br>
k-평균은 반드시 멈추지만 처음 값에 따라 다른 답에 멈추고, (a)는 가장 좋은 답(b)이 아니다. 처음 값을 바꿔 여러 번 돌리고 $$J$$가 가장 작은 답을 고른다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [25_k-means-ladder_p4.py](/Hongs_Blog/studies/data-science/code/25_k-means-ladder_p4/)</div>

</div>


[^s1]: 에이전트 보충. 이 문서의 문제와 수치는 원본에 없다. 슬라이드 p.10~12의 배정·갱신 과정을 연습하도록 만들었고, 답은 분수로 정확히 계산하는 문제 코드로 확인했다.
{% endraw %}
