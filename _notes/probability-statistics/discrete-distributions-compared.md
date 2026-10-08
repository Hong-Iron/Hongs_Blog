---
layout: "note"
title: "이항·기하·포아송 비교"
display_title: "이항·기하·포아송 비교"
kind: "concept"
kind_label: "비교"
num: "13"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-09-26"
status: "verified"
aliases: ["이항 vs 기하 vs 포아송", "이산분포 고르기", "choosing a discrete distribution"]
description: "셋 다 \"독립인 시도에서 성공을 센다\"는 이야기에서 나와 헷갈린다. 가르는 질문은 무엇을 세는가다. 정해진 횟수 안의 성공 수면 이항, 첫 성공까지 걸린 시도 수면 기하, 정해진 시간·공간 안에서 드물게 일어나는 사건 수(시도 횟수를 따로 정할 수 없음)면 포아송이다."
prev_url: "/studies/probability-statistics/poisson/"
prev_title: "포아송 분포"
next_url: "/studies/probability-statistics/continuous-rv/"
next_title: "연속 확률변수와 확률밀도"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/discrete-distributions-compared/"
---
{% raw %}
셋 다 "독립인 시도에서 성공을 센다"는 이야기에서 나와 헷갈린다. 가르는 질문은 **무엇을 세는가**다. 정해진 횟수 안의 성공 수면 이항, 첫 성공까지 걸린 시도 수면 기하, 정해진 시간·공간 안에서 드물게 일어나는 사건 수(시도 횟수를 따로 정할 수 없음)면 포아송이다[^1].

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 각각에 맞는 분포는? (가) 패킷 100개 중 손실된 개수 (나) 첫 손실이 날 때까지 보낸 패킷 수 (다) 1분 동안 도착한 요청 수</summary>

**답:** (가) 이항 $$\mathrm{Bin}(100, p)$$: 시도 수가 100으로 정해져 있고 성공 수를 센다. (나) 기하: 끝나는 시점이 첫 성공이고 시도 수를 센다. (다) 포아송: 시간 구간이 정해져 있고 "시도 횟수"라는 것이 따로 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 가능한 비밀번호 $$N$$개 중 하나가 정답이다. (가) 매번 무작위로 하나를 골라 추측하고 같은 것을 다시 고를 수도 있을 때 (나) 한 번 틀린 것은 다시 고르지 않을 때, 맞힐 때까지의 추측 수의 분포와 평균은?</summary>

**답:** (가) 매번 성공 확률 $$\frac1N$$인 독립 시도라 기하분포, 평균 $$N$$. (나) 시도들이 독립이 아니다. 정답이 $$N$$개 자리 중 어디에 올지가 똑같은 확률이라 $$1, \dots, N$$의 균등분포, 평균 $$\frac{N + 1}{2}$$. 기하분포라고 하면 틀린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 서비스에서 치명적 오류 로그가 하루 평균 2건 나온다. 오류가 하루 종일 없을 확률과 5건 이상일 확률을 어림하라.</summary>

**답:** 포아송 $$\lambda = 2$$. $$P(0) = e^{-2} \approx 0.135$$, $$P(X \ge 5) = 1 - \sum_{k=0}^{4}\frac{e^{-2}2^k}{k!} \approx 0.053$$. 오류들이 독립으로 드물게 일어난다는 가정 아래서다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 1000명 중 오늘이 생일인 사람 수는 이항인가, 포아송인가?</summary>

**답:** 정확히는 이항 $$\mathrm{Bin}(1000, \frac{1}{365})$$이다. $$n$$이 크고 $$p$$가 작아 포아송 $$\lambda = \frac{1000}{365} \approx 2.74$$로 잘 어림된다. 아무도 없을 확률은 이항으로 0.0643, 포아송으로 0.0646이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 결정적 차이 표의 평균·분산, 비밀번호 추측의 두 평균(모의실험), 하루 오류 확률, 생일 근사, 과대산포 실험 — [13_discrete-distributions-compared_verify.py](/Hongs_Blog/studies/probability-statistics/code/13_discrete-distributions-compared_verify/)</div>

</div>


## 결정적 차이

| | 이항 $$\mathrm{Bin}(n, p)$$ | 기하(시행 수) | 포아송 $$\mathrm{Pois}(\lambda)$$ |
|---|---|---|---|
| 세는 것 | 정해진 $$n$$번 중 성공 수 | 첫 성공까지의 시행 수 | 정해진 구간의 사건 수 |
| 끝나는 조건 | $$n$$번 다 하면 | 성공하면 | 구간이 끝나면 |
| 값의 범위 | $$0, \dots, n$$ (상한 있음) | $$1, 2, \dots$$ | $$0, 1, 2, \dots$$ |
| 평균 | $$np$$ | $$\frac1p$$ | $$\lambda$$ |
| 분산 | $$np(1 - p)$$ (평균보다 작음) | $$\frac{1 - p}{p^2}$$ | $$\lambda$$ (평균과 같음) |
| 모수가 뜻하는 것 | 시도 수와 성공 확률 | 성공 확률 | 구간당 평균 발생 수 |

판단을 돕는 질문은 이렇다.
- **시도 횟수가 미리 정해져 있는가?** 그렇다면 이항. 성공이 날 때 멈춘다면 기하.
- **시도라는 단위가 자연스러운가?** "1초 동안의 요청"처럼 시도를 셀 수 없고 평균 발생률만 알면 포아송.
- **분산과 평균의 관계:** 자료의 분산이 평균과 비슷하면 포아송, 확실히 작으면 이항 쪽을 의심한다.

## 둘 다 아닐 때

- **비복원 추출:** 정해진 모집단에서 되돌려 놓지 않고 뽑은 개수는 초기하분포다([이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)의 해당하지 않는 예).
- **$$r$$번째 성공까지:** 기하분포를 $$r$$개 더한 음이항분포다.
- **몰려서 일어나는 사건:** 평균이 시간마다 흔들리면 분산이 평균보다 커진다(과대산포). 평균이 0.5와 5.5 사이를 오가는 포아송을 섞으면 분산이 평균의 약 3배가 된다. 이런 자료에는 음이항분포 같은 더 넓은 모델을 쓴다.

[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 3.3절(이항), 3.4절(초기하), 4.3절(기하와 음이항), 4.7~4.8절(포아송과 이항의 관계).
{% endraw %}
