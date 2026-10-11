---
layout: "note"
title: "편집 거리 예제 사다리"
display_title: "편집 거리 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "11"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
updated: "2026-10-11"
status: "verified"
description: "사용 개념: 편집 거리의 점화식, 표 채우기, 되짚기, 편집 유사도."
prev_url: "/studies/data-and-information/hamming-code-ladder/"
prev_title: "해밍 부호 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-and-information/edit-distance-ladder/"
---
{% raw %}
사용 개념: [편집 거리](/Hongs_Blog/studies/data-and-information/edit-distance/)의 점화식, 표 채우기, 되짚기, 편집 유사도.

편집 거리 문제는 같은 하위목표의 되풀이다. ① 가장자리: 맨 윗줄과 맨 왼쪽 줄을 0, 1, 2, …로 채운다 ② 안쪽 채우기: 칸마다 위 + 지우기값, 왼쪽 + 넣기값, 대각 + (글자가 같으면 0, 다르면 바꾸기값) 중 가장 작은 값을 적는다 ③ 답 읽기: 오른쪽 아래 끝 칸 ④ 되짚기: 끝 칸에서 거꾸로 따라가 손질을 읽는다(대각은 그대로 또는 바꾸기, 위는 지우기, 왼쪽은 넣기) ⑤ 유사도: 긴 쪽 길이로 나눠 1에서 뺀다[^s1].

세로가 고칠 낱말, 가로가 목표 낱말이다. 따로 말이 없으면 세 손질의 값은 모두 1이다.

## 문제 1 · 완전한 풀이

`tea`를 `eat`으로 바꾸는 편집 거리와 손질을 구하라.

1. *가장자리:* 윗줄 0, 1, 2, 3. 왼쪽 줄 0, 1, 2, 3.
2. *안쪽 채우기:*

| | # | e | a | t |
|---|---|---|---|---|
| **#** | 0 | 1 | 2 | 3 |
| **t** | 1 | 1 | 2 | 2 |
| **e** | 2 | 1 | 2 | 3 |
| **a** | 3 | 2 | 1 | 2 |

`t` 줄의 마지막 칸: `t`와 `t`가 같아 대각 $$2 + 0 = 2$$. `e` 줄의 첫 칸: `e`와 `e`가 같아 대각 $$1 + 0 = 1$$. `a` 줄의 둘째 칸: `a`와 `a`가 같아 대각 $$1 + 0 = 1$$.

{: start="3"}
3. *답 읽기:* 오른쪽 아래 2.
4. *되짚기:* (a, t)의 2는 왼쪽 1에서 왔다(넣기 `t`). (a, a)의 1은 대각 1에서(그대로). (e, e)의 1은 대각 1에서(그대로). (t, #)의 1은 위 0에서(지우기 `t`). 앞에서부터 읽으면 `t` 지우기, `e` 그대로, `a` 그대로, `t` 넣기.
5. *유사도:* $$\mathrm{NED} = \frac23$$, $$\mathrm{EDS} = \frac13$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [11_edit-distance_impl.py](/Hongs_Blog/studies/data-and-information/code/11_edit-distance_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

`moon`을 `mono`로 바꾼다.

1. *가장자리와 안쪽 채우기:*

| | # | m | o | n | o |
|---|---|---|---|---|---|
| **#** | 0 | 1 | 2 | 3 | 4 |
| **m** | 1 | 0 | 1 | 2 | 3 |
| **o** | 2 | 1 | 0 | 1 | 2 |
| **o** | 3 | 2 | 1 | 1 | 1 |
| **n** | 4 | 3 | 2 | 1 | 2 |

{: start="2"}
2. *답 읽기:* 2.
3. *되짚기:* `m` 그대로, `o` 그대로, `o`를 `n`으로 바꾸기, `n`을 `o`로 바꾸기.
4. *유사도:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

긴 쪽 길이가 4라 $$\mathrm{NED} = \frac24 = 0.5$$, $$\mathrm{EDS} = 1 - 0.5 = 0.5$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

`abcd`를 `bcda`로 바꾼다. 이번에는 넣기·지우기가 1, 바꾸기가 2다.

1. *가장자리:* 윗줄 0, 1, 2, 3, 4. 왼쪽 줄 0, 1, 2, 3, 4.
2. *안쪽 채우기:* ______
3. *답 읽기:* 2.
4. *되짚기:* ______
5. *바꾸기가 1이었다면:* 답은 그대로 2다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

2.

| | # | b | c | d | a |
|---|---|---|---|---|---|
| **#** | 0 | 1 | 2 | 3 | 4 |
| **a** | 1 | 2 | 3 | 4 | 3 |
| **b** | 2 | 1 | 2 | 3 | 4 |
| **c** | 3 | 2 | 1 | 2 | 3 |
| **d** | 4 | 3 | 2 | 1 | 2 |

`a` 줄의 첫 칸: `a`와 `b`가 달라 대각 $$0 + 2 = 2$$, 위 $$1 + 1 = 2$$, 왼쪽 $$1 + 1 = 2$$. `a` 줄의 마지막 칸: `a`와 `a`가 같아 대각 $$3 + 0 = 3$$.

{: start="4"}
4. (d, a)의 2는 왼쪽 1에서(넣기 `a`). (d, d), (c, c), (b, b)는 대각(그대로). (a, #)의 1은 위에서(지우기 `a`). 앞에서부터: `a` 지우기, `b`·`c`·`d` 그대로, `a` 넣기.<br>
이 길은 바꾸기를 한 번도 쓰지 않아서 바꾸기 값이 1이든 2든 답이 같다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [11_edit-distance_impl.py](/Hongs_Blog/studies/data-and-information/code/11_edit-distance_impl/)</div>

</div>


## 문제 4 · 독립 문제

`stone`과 `notes`에 대해 (a) 세 손질이 모두 1일 때의 편집 거리와 편집 유사도 (b) 바꾸기만 2일 때의 편집 거리 (c) 같은 자리끼리 다른 글자 수(해밍 거리)를 구하고, (a)와 (c)가 다른 까닭을 말하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 표의 마지막 줄(`e` 줄)은 5, 4, 4, 4, 3, 4. 편집 거리 4. 한 가지 손질: `s` 지우기, `t`를 `n`으로, `o` 그대로, `n`을 `t`로, `e` 그대로, `s` 넣기. $$\mathrm{NED} = \frac45 = 0.8$$, $$\mathrm{EDS} = 0.2$$.<br>
(b) 6. 위 손질에서 바꾸기 2번이 각각 2가 되어 $$1 + 2 + 2 + 1 = 6$$이고, 이보다 싼 길이 없다.<br>
(c) `s`/`n`, `t`/`o`, `o`/`t`, `n`/`e`, `e`/`s`로 다섯 자리가 모두 달라 5.<br>
해밍 거리는 바꾸기만 쓰는 한 가지 방법의 횟수다. 편집 거리는 넣기와 지우기도 써서 그보다 적은 4번에 끝낸다. 길이가 같으면 늘 편집 거리 ≤ 해밍 거리다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [11_edit-distance_impl.py](/Hongs_Blog/studies/data-and-information/code/11_edit-distance_impl/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드(강의04-2) p.14~17의 표 채우기, 되짚기, 편집 유사도를 연습하도록 만들었고, 답은 구현 코드로 확인했다.
{% endraw %}
