---
layout: "note"
title: "큰 수의 법칙"
display_title: "큰 수의 법칙 (Law of Large Numbers)"
kind: "concept"
kind_label: "정리"
num: "21"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Law of Large Numbers", "큰 수의 법칙", "대수의 법칙", "LLN", "약한 큰 수의 법칙", "weak law of large numbers", "강한 큰 수의 법칙", "strong law of large numbers", "표본평균", "sample mean"]
description: "같은 실험을 서로 독립으로 많이 되풀이하면, 결과들의 평균이 기댓값에 점점 가까워진다. \"앞면이 나올 확률이 절반\"을 \"오래 던지면 절반쯤 앞면\"으로 읽어도 되는 근거이고, 무작위 표본의 평균으로 적분이나 확률을 어림하는 몬테카를로 방법의 근거다. 하지만 얼마나 빨리 가까워지는지는…"
prev_url: "/studies/probability-statistics/tail-bounds/"
prev_title: "확률 부등식"
next_url: "/studies/probability-statistics/clt/"
next_title: "중심극한정리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/probability-statistics/lln/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

같은 실험을 서로 독립으로 많이 되풀이하면, 결과들의 평균이 기댓값에 점점 가까워진다. "앞면이 나올 확률이 절반"을 "오래 던지면 절반쯤 앞면"으로 읽어도 되는 근거이고, 무작위 표본의 평균으로 적분이나 확률을 어림하는 몬테카를로 방법의 근거다. 하지만 얼마나 빨리 가까워지는지는 이 법칙만으로 알 수 없고, 평균이 존재하지 않는 분포에서는 아무리 많이 모아도 평균이 모이지 않는다.

</div>


## 예시로 보기

동전을 던져 앞면 비율을 기록한다. 100번이면 비율이 0.5에서 평균 0.04쯤 벗어나고, 1만 번이면 0.004쯤으로 줄어든다. 비율은 0.5로 모인다.

그런데 앞면 **수**와 "던진 횟수의 절반"의 차이는 오히려 커진다. 100번에서 평균 약 4개, 1,600번에서 약 16개 차이다(횟수를 16배로 늘리면 차이는 약 $$\sqrt{16} = 4$$배). 차이가 커져도 횟수가 더 빨리 커지니 비율은 모인다. 비율이 아래 정리의 표본평균 $$\bar X_n$$, 0.5가 $$\mu$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/probability-statistics/21_lln_fig1.svg" alt="그림" loading="lazy">

왼쪽은 동전 1만 번을 세 번 따로 던진 앞면 비율이다. 세 선 모두 회색 띠($$0.5 \pm \frac{0.5}{\sqrt n}$$) 안으로 모여 0.5에 붙는다. 오른쪽은 앞면 수와 $$\frac n2$$의 차이를 2,000번 평균 낸 것이다. 로그 눈금에서 기울기 $$\frac12$$인 직선이라, 차이가 $$\sqrt n$$에 비례해 커진다[^s1].

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">약한 큰 수의 법칙</div>

$$X_1, X_2, \dots$$가 서로 독립이고 분포가 같으며 평균 $$\mu$$, 분산 $$\sigma^2 < \infty$$이면, 표본평균 $$\bar X_n = \frac{X_1 + \cdots + X_n}{n}$$은 모든 $$\varepsilon > 0$$에 대해

$$P(\vert \bar X_n - \mu\vert  \ge \varepsilon) \le \frac{\sigma^2}{n\varepsilon^2} \to 0\quad(n \to \infty).$$

</div>


말로 하면 "허용 오차 $$\varepsilon$$을 아무리 작게 잡아도, 표본을 충분히 모으면 그보다 벗어날 확률을 원하는 만큼 작게 할 수 있다"다. 분산이 유한하다는 조건 없이 평균만 있어도 맞고, 거의 모든 실험 경로에서 $$\bar X_n \to \mu$$라는 더 강한 결론(강한 큰 수의 법칙)도 있다 [증명 생략: Blitzstein·Hwang 10.2절][^1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *평균과 분산:* [선형성](/Hongs_Blog/studies/probability-statistics/expectation/)으로 $$\mathbb{E}[\bar X_n] = \mu$$. 독립이라 [분산](/Hongs_Blog/studies/probability-statistics/variance/)이 더해져 $$\operatorname{Var}[\bar X_n] = \frac{n\sigma^2}{n^2} = \frac{\sigma^2}{n}$$.
2. *체비쇼프:* [체비쇼프 부등식](/Hongs_Blog/studies/probability-statistics/tail-bounds/)을 $$\bar X_n$$에 쓰면 $$P(\vert \bar X_n - \mu\vert  \ge \varepsilon) \le \frac{\operatorname{Var}[\bar X_n]}{\varepsilon^2} = \frac{\sigma^2}{n\varepsilon^2}$$.
3. *극한:* $$\varepsilon$$을 고정하면 우변이 $$n$$에 반비례해 0으로 간다. ∎

</details>


## 예제

**여론조사의 표본 크기.** 찬성 비율 $$p$$를 표본 비율로 어림한다. 오차가 0.01 이상일 확률을 5% 이하로 하려면 몇 명에게 물어야 하는가?

1. *분산의 상한:* 한 사람의 응답은 0/1이라 분산 $$p(1 - p) \le \frac14$$.
2. *체비쇼프:* $$\frac{1/4}{n \times 0.01^2} \le 0.05$$에서 $$n \ge 50{,}000$$.
3. *비교:* [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)의 정규 근사를 쓰면 $$n \approx \left(\frac{1.96}{0.01}\right)^2 \times \frac14 = 9{,}604$$명이면 된다.
4. *해석:* 큰 수의 법칙은 "모인다"는 보장과 안전한 표본 크기를 주지만, 체비쇼프가 헐거워 필요한 수를 5배쯤 크게 잡는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 비율은 모이고 개수 차이는 √n으로 커짐(모의실험), 주사위 평균에서 체비쇼프 한계가 실제 이탈 확률 이상, 표본 크기 50,000·9,604·1,000, 코시 분포의 표본평균이 퍼짐을 줄이지 않음 — [21_lln_verify.py](/Hongs_Blog/studies/probability-statistics/code/21_lln_verify/)</div>

</div>


## 활용

- **몬테카를로.** 적분이나 확률을 "무작위 표본의 평균"으로 어림하는 방법이 수렴한다는 보장이다([몬테카를로 적분](/Hongs_Blog/studies/calculus/multiple-integrals/)).
- **벤치마크.** 실행 시간을 여러 번 재 평균을 내면 참 평균에 가까워진다. 반복 횟수를 늘릴수록 흔들림이 준다.
- **가정이 깨질 때.** 평균이 없는 분포에서는 맞지 않는다. 코시 분포의 표본평균은 다시 같은 코시 분포라, 10개로 평균 내든 1,000개로 평균 내든 퍼짐(사분위 범위 약 2)이 그대로다. 아주 가끔 엄청나게 큰 값이 나오는 자료에서 평균이 안정되지 않으면 이것을 의심한다.

## 연결

- 선수: [확률 부등식](/Hongs_Blog/studies/probability-statistics/tail-bounds/)(체비쇼프), [수열의 극한](/Hongs_Blog/studies/calculus/sequence-limits/)(확률이 0으로 가는 수렴)
- 이어지는 개념: [중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)(얼마나 빨리, 어떤 모양으로 모이는가)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 0/1 응답의 비율을 어림할 때 오차 0.05 이상일 확률을 10% 이하로 하려면, 체비쇼프로 몇 명이면 충분한가?</summary>

**답:** $$\frac{1/4}{n \times 0.05^2} \le 0.1$$에서 $$n \ge 1{,}000$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 표본평균의 흔들림이 $$n$$이 커질수록 줄어드는 이유를 분산으로 설명하라.</summary>

**답:** 독립인 $$n$$개를 더하면 분산이 $$n\sigma^2$$로 $$n$$배지만, 평균은 합을 $$n$$으로 나눠 분산이 $$\frac{1}{n^2}$$배 된다. 합치면 $$\frac{\sigma^2}{n}$$이라 $$n$$에 반비례해 준다. 서로 독립인 오차들이 부분적으로 상쇄되기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "동전에서 앞면이 10번 연속 나왔으니, 큰 수의 법칙에 따라 앞으로는 뒷면이 더 많이 나와 균형을 맞출 것이다." 무엇이 틀렸는가?</summary>

**답:** 큰 수의 법칙은 앞으로의 결과가 지난 결과를 보상한다는 말이 아니다. 동전은 독립이라 다음 결과는 여전히 반반이다. 비율이 0.5로 가는 이유는 보상이 아니라 앞으로 올 수많은 시행이 처음 10번의 영향을 희석하기 때문이다. 앞면과 뒷면 개수의 차이는 줄지 않고 오히려 $$\sqrt n$$ 정도로 커진다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 10.2절 "Law of large numbers"(약한·강한 법칙, 체비쇼프를 이용한 증명, 도박사의 오류와의 구별).
[^s1]: 에이전트 보충. 그림 한 장은 원본에 없다. [21_lln_plot.py](/Hongs_Blog/studies/probability-statistics/code/21_lln_plot/)로 그렸고, 그림에 쓴 값(100번에서 차이 약 4개, 1만 번에서 약 40개, 기울기 0.5)을 같은 코드로 확인했다.
{% endraw %}
