---
layout: "note"
title: "히스토그램 밀도 추정"
display_title: "히스토그램 밀도 추정 (Histogram Density Estimation)"
kind: "concept"
kind_label: "기법"
num: "14"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
updated: "2026-10-11"
status: "verified"
aliases: ["Histogram Density Estimation", "히스토그램", "Histogram", "도수 분포표", "Frequency Table", "확률 밀도 추정", "Density Estimation", "비모수 밀도 추정", "Nonparametric Density Estimation", "인스턴트 확률", "칸 폭", "Bin Width"]
description: "가진 것이 자료뿐일 때, 어떤 값이 얼마나 흔한지 알아내는 가장 손쉬운 방법이다. 값의 범위를 같은 폭의 칸으로 자르고 칸마다 자료가 몇 개 들었는지 세어, 많이 든 칸의 값일수록 흔하다고 본다. 자료가 어떤 모양으로 퍼져 있을 거라는 가정이 필요 없다. 그런데 칸을 넓게 잡으면 …"
prev_url: "/studies/data-and-information/bernoulli-process/"
prev_title: "베르누이 과정"
next_url: "/studies/data-and-information/parzen-window/"
next_title: "파젠 창"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-and-information/histogram-density/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가진 것이 자료뿐일 때, 어떤 값이 얼마나 흔한지 알아내는 가장 손쉬운 방법이다. 값의 범위를 같은 폭의 칸으로 자르고 칸마다 자료가 몇 개 들었는지 세어, 많이 든 칸의 값일수록 흔하다고 본다. 자료가 어떤 모양으로 퍼져 있을 거라는 가정이 필요 없다. 그런데 칸을 넓게 잡으면 모양이 뭉개지고, 좁게 잡으면 빈 칸투성이가 되며, 칸 경계 바로 옆의 두 값이 전혀 다른 답을 받는다.

</div>


## 예시로 보기

머리카락 길이로 남자인지 여자인지 맞히려 한다. 가진 것은 남자 200명, 여자 120명의 머리카락 길이를 잰 값뿐이다. 새로 잰 길이가 28일 때, 남자들 사이에서 28이 얼마나 흔한 값인지, 여자들 사이에서는 얼마나 흔한지 알아야 견줄 수 있다[^1].

길은 둘이다[^1].

- 길이가 종 모양(정규분포)으로 퍼져 있다고 믿고, 그 종의 가운데(평균)와 폭(분산)만 자료에서 구한다. 이 길은 [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/)으로 이어진다.
- 모양을 믿지 않고, 자료에서 흔한 정도를 바로 읽는다. 실제 자료에는 99나 4처럼 종 모양에서 한참 벗어난 값이 섞여 있다. 종 모양이 아니면 평균과 분산만으로는 모양을 적을 수 없다.

둘째 길의 첫걸음이 칸을 나눠 세는 것이다. 작은 자료로 직접 센다. 머리카락 길이 10개(cm)가 있다[^s1].

$$3,\ 4,\ 5,\ 5,\ 6,\ 7,\ 12,\ 13,\ 14,\ 20$$


0부터 폭 4인 칸으로 자른다. 칸은 왼쪽 끝을 넣고 오른쪽 끝을 뺀다.

| 칸 | 든 값 | 개수 | 높이 = 개수 ÷ (10 × 4) |
|---|---|---|---|
| 0 이상 4 미만 | 3 | 1 | 0.025 |
| 4 이상 8 미만 | 4, 5, 5, 6, 7 | 5 | 0.125 |
| 8 이상 12 미만 | 없음 | 0 | 0 |
| 12 이상 16 미만 | 12, 13, 14 | 3 | 0.075 |
| 16 이상 20 미만 | 없음 | 0 | 0 |
| 20 이상 24 미만 | 20 | 1 | 0.025 |

새 값 5.2는 둘째 칸에 드니 흔한 정도가 0.125다. 9.6은 셋째 칸에 드니 0이다.

높이를 개수 그대로 두지 않고 "전체 개수 × 칸 폭"으로 나누는 까닭이 있다. 개수를 전체 개수로 나누면 그 칸에 들 확률(둘째 칸은 $$\frac{5}{10} = 0.5$$)이 된다. 이것을 다시 칸 폭으로 나누면 "길이 1 cm당 확률"이 된다. 그래야 칸 폭을 다르게 잡은 그림끼리 높이를 견줄 수 있고, 막대 넓이를 모두 더하면 1이 된다. 이 "단위 길이당 확률"이 [확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/)다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 폭 1·4·10의 칸별 개수와 높이, 넓이의 합 1, 네 물음(5.2, 7.9, 8.1, 9.6)의 값, 칸 시작점을 옮겼을 때의 값, 카드 C2·C3 — [14_histogram-density_verify.py](/Hongs_Blog/studies/data-and-information/code/14_histogram-density_verify/)</div>

</div>


## 정의

값 $$\mathbf{x}$$를 품은 구역 $$R$$을 하나 잡는다. 표본 $$n$$개 가운데 $$R$$에 든 것이 $$k$$개이고 $$R$$의 크기가 $$V$$이면, $$\mathbf{x}$$에서의 확률밀도를 "$$R$$에 든 비율을 $$R$$의 크기로 나눈 값"으로 어림한다[^2].

$$p(\mathbf{x}) \approx \frac{k / n}{V}$$


$$\mathbf{x}$$(굵은 x)는 잰 값 여러 개를 묶은 목록(벡터)이고, 머리카락 길이처럼 값이 하나면 그냥 수 $$x$$다. $$V$$는 $$R$$의 부피(volume)인데, 값이 하나면 구간의 길이, 둘이면 넓이다. 슬라이드는 어림한 값과 참값을 모두 $$p(x)$$로 적는다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">이 식이 나오는 까닭</summary>

1. 표본 하나가 $$R$$에 들 확률을 $$P$$라 하자. 표본 $$n$$개 가운데 $$R$$에 든 비율 $$\frac{k}{n}$$은 $$n$$이 클수록 $$P$$에 가깝다([큰 수의 법칙](/Hongs_Blog/studies/probability-statistics/lln/)). 그래서 $$P \approx \frac{k}{n}$$.
2. $$P$$는 밀도 $$p$$를 $$R$$ 위에서 적분한 값이다. $$R$$이 작아서 그 안에서 $$p$$가 거의 그대로면 $$P \approx p(\mathbf{x}) \times V$$.
3. 둘을 이으면 $$p(\mathbf{x}) \times V \approx \frac{k}{n}$$, 곧 $$p(\mathbf{x}) \approx \frac{k/n}{V}$$다[^s2].

두 어림이 서로 반대쪽을 원한다. 1은 $$R$$에 표본이 많이 들어야(큰 $$R$$) 믿을 만하고, 2는 $$R$$이 작아야 맞는다. 칸 폭을 정하기 어려운 까닭이 여기 있다.

</details>


히스토그램은 구역 $$R$$을 미리 잘라 둔 칸으로 고정한 경우다. 도수 분포표의 말로는 칸이 구간, 칸의 가운데 값이 대표값, 칸에 든 개수가 도수다[^3].

### 칸 폭을 정하기 어렵다

같은 자료 10개를 폭만 바꿔 다시 센다[^3].

| 칸 폭 | 칸별 개수 (0부터 차례로) | 5.2의 값 | 9.6의 값 | 보이는 모양 |
|---|---|---|---|---|
| 1 | 24칸 가운데 15칸이 0 | 0.2 | 0 | 이빨 빠진 빗 |
| 4 | 1, 5, 0, 3, 0, 1 | 0.125 | 0 | 봉우리 둘과 그 사이 빈 곳 |
| 10 | 6, 3, 1 | 0.06 | 0.06 | 내리막 계단 하나 |

- **폭이 크면** 서로 다른 값들이 한 칸에 뭉쳐 모양이 실제와 달라진다. 폭 10에서는 3~7 무리와 12~14 무리 사이의 빈 곳이 사라지고, 자료가 하나도 없는 9.6이 5.2와 같은 값을 받는다.
- **폭이 작으면** 자료가 아주 많지 않은 한 개수가 0인 칸이 생긴다. 폭 1에서는 칸의 절반이 넘게 빈다.

어느 쪽이든 실제 확률과 달라진다[^4].

### 그 밖의 문제

- **모든 칸을 미리 구해 둔다.** 물어볼지 모르는 칸까지 다 세어 둔다[^4].
- **경계에 걸린다.** 폭 4에서 7.9는 0.125, 8.1은 0이다. 0.2 차이로 답이 뒤집힌다. 칸을 0이 아니라 −2부터 자르면(−2~2, 2~6, 6~10, …) 같은 자료, 같은 폭인데 5.2는 0.1, 7.9와 8.1은 둘 다 0.05가 된다[^s1].

그래서 칸을 미리 자르지 않고, 값 $$x_{in}$$이 들어오면 그때 그 자리에서 확률값을 구하는 쪽으로 간다(강의의 말로 인스턴트 확률). 방법은 둘이다[^4].

- $$x_{in}$$을 한가운데 두고 구간을 정한 뒤 개수를 센다 → [파젠 창](/Hongs_Blog/studies/data-and-information/parzen-window/)
- $$x_{in}$$과 가까운 표본이 정한 개수만큼 잡힐 때까지 구간을 넓힌다 → [k-이웃 밀도 추정](/Hongs_Blog/studies/data-and-information/knn-density/)

둘 다 위의 식 $$\frac{k/n}{V}$$를 그대로 쓴다. 구역을 누가 언제 정하느냐만 다르다.

## 활용

- 자료를 처음 받았을 때 분포가 종 모양인지, 봉우리가 여럿인지 눈으로 보는 첫 도구다. 평균과 분산 같은 요약값은 [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/)에 있다.
- 흔한 실수: 막대 높이를 개수 그대로 두고 확률밀도처럼 쓰는 것. 칸 폭이 다르면 견줄 수 없다. 전체 개수와 칸 폭으로 나눠야 한다.

## 연결

- 선수: [연속 확률변수와 확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/)
- 칸을 물음마다 새로 잡는 두 방법: [파젠 창](/Hongs_Blog/studies/data-and-information/parzen-window/), [k-이웃 밀도 추정](/Hongs_Blog/studies/data-and-information/knn-density/), 둘의 차이는 [파젠 창과 k-이웃 비교](/Hongs_Blog/studies/data-and-information/parzen-vs-knn/)
- 분포 모양을 믿고 숫자 몇 개만 구하는 길: [최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 히스토그램의 칸 폭을 크게 잡으면 무엇이 나빠지고, 작게 잡으면 무엇이 나빠지는가?</summary>

**답:** 크게 잡으면 서로 다른 값이 한 칸에 뭉쳐 봉우리와 빈 곳이 지워지고 모양이 실제와 달라진다. 작게 잡으면 자료가 충분히 많지 않을 때 개수가 0인 칸이 생겨, 실제로는 나올 수 있는 값에 0을 준다.<br>
**이유:** 칸에 든 비율이 확률에 가까우려면 칸에 표본이 많아야 하고(큰 칸), 칸 안에서 밀도가 거의 그대로이려면 칸이 작아야 한다. 둘을 한꺼번에 채울 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 자료 200개 가운데 30개가 폭 5인 칸에 들었다. 이 칸에서 확률밀도의 어림값은?</summary>

**답:** $$\frac{30/200}{5} = 0.03$$.<br>
**이유:** $$\frac{30}{200} = 0.15$$는 칸에 들 확률이지 밀도가 아니다. 칸 폭 5로 한 번 더 나눠야 단위 길이당 확률이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 자료 3, 4, 5, 5, 6, 7, 12, 13, 14, 20을 0부터 폭 2인 칸으로 자른다. 5.2에서의 어림값은?</summary>

**답:** 5.2는 4 이상 6 미만 칸에 든다. 그 칸에는 4, 5, 5 세 개가 있으므로 $$\frac{3/10}{2} = 0.15$$.<br>
**이유:** 6은 오른쪽 끝이라 다음 칸으로 간다. 폭 4일 때의 0.125, 폭 1일 때의 0.2와 또 다르다[^s1].

</details>


[^1]: 자료와 정보 10회 강의 자료 「D&I_강의10_확률값 찾기」, p.2 (가진 것은 데이터뿐, 분포 함수를 거치지 않고 확률값을 바로 찾기), p.4 (남녀 구분 문제, 남자 200개·여자 120개, 측정치 28, 매개변수 추정과 확률 직접 추정)
[^2]: 같은 자료, p.7 (구역 $$R$$, 부피 $$V$$, 든 표본 수 $$k$$, $$p(\mathbf{x}) = \frac{k/n}{V}$$)
[^3]: 같은 자료, p.5 (도수 분포표의 구간·대표값·도수, 정규분포가 아니라면, 구간이 커지면 모양은, 작아지면 도수는)
[^4]: 같은 자료, p.6 (히스토그램의 문제 네 가지, 인스턴트 확률과 두 접근법), p.3 (그때그때 확률값 구하기)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 자료 10개와 그것으로 한 계산(칸별 개수와 높이, 폭 1·4·10의 견줌, 경계와 시작점의 예), 카드 C2·C3은 원본에 없다. 원본은 물음만 던지고 숫자 예가 없다. 값은 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 식의 유도는 원본에 없다. Duda, Hart, Stork, *Pattern Classification* 2판, 4.2절 "Density Estimation"의 설명을 따랐다.
{% endraw %}
