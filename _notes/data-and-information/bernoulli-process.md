---
layout: "note"
title: "베르누이 과정"
display_title: "베르누이 과정 (Bernoulli Process)"
kind: "concept"
kind_label: "모델"
num: "13"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "수학"
updated: "2026-10-11"
status: "verified"
aliases: ["Bernoulli Process", "베르누이 프로세스", "베르누이 시행", "Bernoulli Trial", "베르누이 확률변수", "Bernoulli Random Variable", "지시 확률변수", "Indicator Variable", "시간 칸", "Time Slot", "도착 과정", "Arrival Process", "이항 과정", "Binomial Process"]
description: "1분마다 동전을 하나씩 던져 앞면이면 1, 뒷면이면 0을 적어 나간 끝없는 줄이다. 칸마다 1이 나올 가능성이 똑같고 칸끼리 서로 영향을 주지 않아서, 시간에 따라 벌어지는 일을 적는 방법 가운데 가장 다루기 쉽다. 처음 몇 칸 안에 1이 몇 개 들었는지는 경우의 수와 곱셈만으로 …"
prev_url: "/studies/data-and-information/random-process/"
prev_title: "확률 과정"
next_url: "/studies/data-and-information/histogram-density/"
next_title: "히스토그램 밀도 추정"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-and-information/bernoulli-process/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

1분마다 동전을 하나씩 던져 앞면이면 1, 뒷면이면 0을 적어 나간 끝없는 줄이다. 칸마다 1이 나올 가능성이 똑같고 칸끼리 서로 영향을 주지 않아서, 시간에 따라 벌어지는 일을 적는 방법 가운데 가장 다루기 쉽다. 처음 몇 칸 안에 1이 몇 개 들었는지는 경우의 수와 곱셈만으로 구한다. 다만 일이 한꺼번에 몰려서 터지거나, 시간이 갈수록 가능성이 바뀌는 상황에는 맞지 않는다.

</div>


## 예시로 보기

"1초마다 은행에 손님이 왔는가", "시간 칸마다 서버에 클릭이 들어왔는가", "이번 복권이 당첨인가"는 모두 칸마다 "일어났다, 안 일어났다" 둘 중 하나를 적는 일이다[^1]. 한 칸은 동전 한 번으로 적을 수 있다. 궁금한 것은 칸 하나가 아니라 줄 전체다. 한 시간 동안 손님이 몇 명 오는가 같은 것이다.

슬라이드의 줄은 13칸이다[^1].

| 칸 번호 $$i$$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| $$X_i$$ | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 0 |
| 그때까지 1의 개수 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 3 | 4 | 4 | 4 |

1은 3, 8, 10, 11번째 칸에 있고 모두 4개다. 1을 "손님이 도착했다"로 읽으면 이 줄은 도착 기록이다.

칸마다 1이 나올 확률을 0.3이라 하자[^s1]. 칸끼리 영향이 없으므로 줄의 확률은 칸별 확률을 곱한 것이다.

- 바로 이 줄이 나올 확률: 1이 4칸, 0이 9칸이라 $$0.3^4 \times 0.7^9 \approx 0.000327$$.
- 13칸에 1이 정확히 4개일 확률: 1이 들어갈 네 자리를 고르는 방법이 $$\binom{13}{4} = 715$$가지이고, 그런 줄은 모두 확률이 같다. $$715 \times 0.000327 \approx 0.234$$.

1이 4개인 줄은 네 번에 한 번꼴로 나오지만, 딱 이 줄은 3,000번에 한 번꼴이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 줄의 1의 자리와 누적 개수, 0.000327과 0.234(모의실험 20만 회 포함), 처음 $$n$$칸의 개수가 이항분포인 것($$n \le 10$$ 전수, 분수로 정확히), 겹치지 않는 구간의 개수가 독립인 것, 카드의 값 — [13_bernoulli-process_verify.py](/Hongs_Blog/studies/data-and-information/code/13_bernoulli-process_verify/)</div>

</div>


## 정의

**칸 하나: 베르누이 시행.** 결과가 성공 아니면 실패인 실험이다. 성공이면 1, 실패면 0을 내는 확률변수 $$X$$를 베르누이 확률변수라 하고 $$X \sim \mathrm{Bern}(p)$$로 쓴다("$$X$$가 성공 확률 $$p$$인 베르누이 분포를 따른다"). 슬라이드 p.8은 같은 것을 $$\mathrm{Ber}(p)$$로 쓴다[^2].

$$P(X = 1) = p, \qquad P(X = 0) = 1 - p, \qquad \mathbb{E}[X] = p, \qquad \operatorname{Var}(X) = p(1 - p)$$


$$\mathbb{E}[X]$$는 평균(기댓값), $$\operatorname{Var}(X)$$는 분산이다. 1이 확률 $$p$$로 나오니 평균은 $$1 \times p + 0 \times (1 - p) = p$$다. 동전 던지기, 무작위로 고른 2진 숫자 하나, 디스크가 고장 났는가, 어떤 사람이 영화를 좋아하는가가 모두 이 꼴이다[^2].

**줄 전체: 베르누이 과정.** 서로 독립이고 성공 확률이 모두 같은 베르누이 시행을 끝없이 이어 붙인 줄 $$X_1, X_2, \dots$$다. 번호 $$1, 2, \dots$$를 시간 칸(time slot)이라 부른다[^1].

기호로 쓰면, $$0 < p < 1$$인 $$p$$ 하나가 있어 모든 $$i$$에서 $$X_i \sim \mathrm{Bern}(p)$$이고 $$X_1, X_2, \dots$$가 서로 독립이다.

[확률 과정](/Hongs_Blog/studies/data-and-information/random-process/)의 네 가지로는 이산 시간, 이산 값이다. 가장 단순한 확률 과정에 들고, 무엇인가가 도착하는 때를 적는 과정(도착 과정)의 하나다[^1].

**개수 세기: 이항분포.** 처음 $$n$$칸에 든 1의 개수 $$X = X_1 + \cdots + X_n$$은 이항분포를 따르고 $$X \sim \mathrm{Bin}(n, p)$$로 쓴다. $$n$$은 시행 횟수, $$p$$는 한 번의 성공 확률이다[^3]. 1이 정확히 $$k$$개일 확률은 "1이 들어갈 자리 $$k$$개를 고르는 방법의 수"에 "그런 줄 하나의 확률"을 곱한 것이다.

$$P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}, \qquad \mathbb{E}[X] = np, \qquad \operatorname{Var}(X) = np(1 - p)$$


$$k$$는 0부터 $$n$$까지의 정수다. 위 예시가 $$n = 13$$, $$k = 4$$, $$p = 0.3$$을 넣은 것이다. 식이 왜 이런 모양인지와 평균·분산을 구하는 과정은 [베르누이 시행과 이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)에 있고, 강의의 예제(동전 세 개, 해밍 부호, 광고 클릭)도 그 문서의 과목별 관점에 풀어 두었다.

### 보장하는 것과 보장하지 않는 것

독립이고 확률이 같다는 약속에서 두 가지가 따라 나온다[^s2].

- **겹치지 않는 구간은 서로 모른다.** 1~4번 칸의 1의 개수와 5~7번 칸의 1의 개수는 독립이다. 앞 구간에 손님이 몰렸다고 뒤 구간에 덜 오지 않는다.
- **어느 칸에서 다시 봐도 같은 과정이다.** 100번째 칸부터 새로 번호를 매겨도 똑같은 베르누이 과정이다. "한참 안 왔으니 이제 올 때가 됐다"는 말은 여기서 틀리다. 다음 1까지 기다리는 칸 수는 언제 세기 시작해도 같은 [기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/)다.

보장하지 않는 것도 분명하다. 실제 자료가 이 약속을 지킨다는 보장은 없다. 통신 잡음이 한 번 끼면 비트 여러 개가 연달아 깨지는 일처럼 앞 칸이 뒤 칸에 영향을 주면, 개수의 분포는 이항분포에서 벗어난다. 그런 줄은 [확률 과정](/Hongs_Blog/studies/data-and-information/random-process/)의 예시 B 같은 마르코프 연쇄로 적는다.

## 활용

- **비트 오류.** 비트마다 독립으로 같은 확률로 깨진다고 보면, 보낸 비트 줄에서 "깨졌다 = 1"로 적은 줄이 베르누이 과정이다. 7비트 가운데 깨진 개수가 $$\mathrm{Bin}(7, p)$$라는 데서 [해밍 부호](/Hongs_Blog/studies/data-and-information/hamming-code/)가 메시지를 지켜 낼 확률이 나온다[^4].
- **흔한 실수.** 줄 하나의 확률 $$p^k(1 - p)^{n - k}$$와 개수의 확률 $$\binom{n}{k}p^k(1 - p)^{n - k}$$를 섞는 것. 앞은 "바로 이 순서", 뒤는 "순서는 상관없이 개수만"이다.

## 연결

- 선수: [확률 과정](/Hongs_Blog/studies/data-and-information/random-process/), [독립](/Hongs_Blog/studies/probability-statistics/independence/), [분산과 표준편차](/Hongs_Blog/studies/probability-statistics/variance/)
- 개수의 분포와 강의 예제: [베르누이 시행과 이항분포](/Hongs_Blog/studies/probability-statistics/binomial/)
- 다음 1까지 기다리는 칸 수: [기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/)
- 칸을 한없이 잘게 쪼갠 연속 시간판에서 개수의 분포: [포아송 분포](/Hongs_Blog/studies/probability-statistics/poisson/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 베르누이 과정이 지키는 약속 세 가지를 쓰고, 시간과 값으로 나눈 네 가지 가운데 어디에 드는지 답하라.</summary>

**답:** ① 칸마다 결과는 1 아니면 0이다. ② 1이 나올 확률 $$p$$가 모든 칸에서 같다($$0 < p < 1$$). ③ 칸끼리 독립이다. 이산 시간, 이산 값 과정이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 시간 칸마다 0.1의 확률로 요청이 온다. 처음 10칸에 요청이 정확히 2번 올 확률은?</summary>

**답:** $$\binom{10}{2} \times 0.1^2 \times 0.9^8 = 45 \times 0.01 \times 0.4305 \approx 0.194$$.<br>
**이유:** 요청이 온 두 칸을 고르는 방법이 45가지이고, 그런 줄 하나의 확률이 $$0.1^2 \times 0.9^8$$이다. 45를 빼먹으면 "맨 앞 두 칸에만 왔을 확률"이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 줄 0 0 1 0 0 0 0 1 0 1 1 0 0에서 $$X_8$$, 10번째 칸까지 1의 개수, 1이 있는 칸 번호를 모두 구하라.</summary>

**답:** $$X_8 = 1$$, 10번째 칸까지 3개, 1이 있는 칸은 3, 8, 10, 11.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "칸끼리 독립"을 빼면 개수가 이항분포가 아니게 되는 예를 만들어라.</summary>

**답:** 첫 칸만 동전($$p = 0.3$$)으로 정하고 나머지 칸은 첫 칸을 그대로 베낀다. 칸 하나만 보면 여전히 1일 확률이 0.3이지만, 5칸의 1의 개수는 0 아니면 5뿐이다. 5개일 확률이 0.3으로, 이항분포의 $$0.3^5 \approx 0.0024$$와 전혀 다르다.<br>
**이유:** 이항분포 식은 칸별 확률을 곱해서 나왔고, 곱할 수 있는 까닭이 독립이다. 평균은 둘 다 $$5 \times 0.3 = 1.5$$로 같아서 평균만 봐서는 차이를 못 본다[^s1].

</details>


[^1]: 자료와 정보 9회 강의 자료 「D&I_강의09-랜덤프로세스」, p.7 (분마다 동전 던지기, 복권·은행 손님·서버 클릭, 독립인 베르누이 시행의 줄, 시간 칸, 0과 1이 적힌 13칸 그림, 이산 시간·이산 값, 도착 과정). 슬라이드 제목은 "베르누이 프로세서"로 적혀 있다.
[^2]: 같은 자료, p.6 (베르누이 시행, 지시 확률변수, 예 네 가지), p.8 (확률, 평균, 분산)
[^3]: 같은 자료, p.9 ("Binomial Process", $$X \sim \mathrm{Bin}(n, p)$$ 읽는 법), p.10 (이항분포의 확률 식, 평균 $$np$$, 분산 $$np(1 - p)$$)
[^4]: 같은 자료, p.12 (해밍 부호와 비트 오류 확률 0.1)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 13칸 줄에 $$p = 0.3$$을 넣은 계산과 카드 C2·C4는 원본에 없다. 원본 그림에는 0과 1만 있고 $$p$$ 값이 없어서 계산용으로 0.3을 골랐다. 값은 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 겹치지 않는 구간의 독립과 다시 시작해도 같은 과정이라는 성질, 연달아 깨지는 비트의 예는 원본에 없다. Bertsekas, Tsitsiklis, *Introduction to Probability* 2판, 6.1절 "The Bernoulli Process"가 다룬다. 구간 독립은 7칸을 전수로 세어 확인했다.
{% endraw %}
