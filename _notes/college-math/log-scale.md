---
layout: "note"
title: "로그함수와 로그 스케일"
display_title: "로그함수와 로그 스케일 (Logarithmic Functions and Log Scale)"
kind: "concept"
kind_label: "기법"
num: "08"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Logarithmic Function", "Log Scale", "로그 눈금", "로그-로그 그래프", "log-log plot", "반로그 그래프", "semi-log plot", "데시벨", "decibel", "dB", "거듭제곱 법칙", "power law"]
description: "로그함수의 그래프는 끝없이 올라가지만 아주 느리게 올라간다. 로그 눈금은 같은 간격이 같은 \"배율\"을 뜻하는 자라서, 1, 10, 100, 1000이 같은 간격에 놓인다. 그래서 수천 배 차이 나는 값을 한 그림에 담고, 측정값이 입력의 몇 제곱으로 느는지를 기울기로 읽는다. 단,…"
prev_url: "/studies/college-math/logarithm/"
prev_title: "로그"
next_url: "/studies/college-math/power-vs-exponential/"
next_title: "거듭제곱함수와 지수함수 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/log-scale/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

로그함수의 그래프는 끝없이 올라가지만 아주 느리게 올라간다. 로그 눈금은 같은 간격이 같은 "배율"을 뜻하는 자라서, 1, 10, 100, 1000이 같은 간격에 놓인다. 그래서 수천 배 차이 나는 값을 한 그림에 담고, 측정값이 입력의 몇 제곱으로 느는지를 기울기로 읽는다. 단, 0과 음수는 로그 눈금에 올릴 수 없다.

</div>


## 예시로 보기

두 정렬 방법의 비교 횟수를 입력 크기 $$n$$을 두 배씩 늘리며 셌다. 삽입 정렬은 역순 입력, 병합 정렬은 무작위 입력이다.

| $$n$$ | 1,000 | 2,000 | 4,000 | 8,000 |
|---|---|---|---|---|
| 삽입 정렬 | 499,500 | 1,999,000 | 7,998,000 | 31,996,000 |
| 병합 정렬 | 8,690 | 19,412 | 42,761 | 93,643 |

보통 눈금에 그리면 삽입 정렬이 병합 정렬을 화면 밖으로 밀어낸다. 두 축을 모두 로그 눈금으로 바꾸면(로그-로그 그래프) 둘 다 직선에 가깝게 누워서 한 그림에 들어온다. 이때 직선의 기울기가 증가의 차수다.

- 삽입 정렬: $$n$$이 8배가 될 때 비교가 약 64배. 기울기 $$\dfrac{\lg 64.06}{\lg 8} \approx 2.00$$이다. 비교 횟수가 $$n^2$$에 비례한다.
- 병합 정렬: $$n$$이 8배가 될 때 약 10.8배. 기울기 약 $$1.14$$다. $$n$$보다 조금 빠르고 $$n^2$$보다 훨씬 느리다. 실제로는 $$n \lg n$$에 비례한다.

로그-로그 그래프의 가로 위치가 $$\log_{10} n$$, 세로 위치가 $$\log_{10}(\text{비교 횟수})$$이고, 기울기가 아래 정리의 $$k$$다. 곱셈 관계가 로그 눈금에서 덧셈 관계, 즉 직선이 된다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/08_log-scale_fig1.svg" alt="그림" loading="lazy">

보통 눈금(왼쪽)에서는 병합 정렬이 바닥에 깔려 보이지 않는다. 로그-로그 눈금(오른쪽)에서는 둘 다 직선이 되고, 삽입 정렬의 선이 더 가파르다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$b > 1$$일 때 로그함수 $$y = \log_b x$$는 정의역 $$(0, \infty)$$, 치역 $$\mathbb{R}$$($$\mathbb{R}$$은 실수 전체)에서 순증가하고 점 $$(1, 0)$$을 지난다. $$x$$가 $$0$$에 다가가면 값이 한없이 작아지므로 $$y$$축(직선 $$x = 0$$)이 세로 점근선이다[^1]. $$0 < b < 1$$이면 순감소다.

**로그 눈금**(log scale)은 값 $$v > 0$$을 $$\log_{10} v$$에 비례하는 위치에 놓는 눈금이다. 다른 밑을 써도 눈금 간격이 일정한 비율로 늘거나 줄 뿐이다. 두 축이 모두 로그 눈금이면 로그-로그 그래프, 세로축만 로그 눈금이면 반로그 그래프라 한다.

</div>


<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/08_log-scale_fig2.svg" alt="그림" loading="lazy">

네 곡선이 모두 $$(1, 0)$$을 지난다. 밑이 1보다 큰 세 곡선은 오른쪽으로 갈수록 느리게 오르고, 밑이 클수록 더 느리다. $$x$$가 0에 다가가면 이 세 곡선은 $$y$$축을 따라 한없이 내려간다. $$\log_{1/2} x$$는 위아래를 뒤집은 모양이다[^s2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

$$c, a, x > 0$$일 때
1. $$y = c\,x^k$$이면 $$\log_{10} y = \log_{10} c + k \log_{10} x$$다. 로그-로그 그래프에서 기울기 $$k$$인 직선이다.
2. $$y = a\,b^x$$이면 $$\log_{10} y = \log_{10} a + (\log_{10} b)\,x$$다. 반로그 그래프에서 기울기 $$\log_{10} b$$인 직선이다.
3. 두 점 $$(x_1, y_1)$$, $$(x_2, y_2)$$의 로그-로그 기울기 $$\dfrac{\log_{10} y_2 - \log_{10} y_1}{\log_{10} x_2 - \log_{10} x_1}$$는 $$\log_{10}$$ 대신 다른 밑의 로그로 계산해도 같다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1·2. 양변에 로그를 취하고 로그 법칙 $$\log_{10}(uv) = \log_{10} u + \log_{10} v$$와 $$\log_{10}(u^r) = r \log_{10} u$$를 쓴다.

{: start="3"}
3. 밑변환 공식 $$\log_c t = \dfrac{\ln t}{\ln c}$$로 분자와 분모를 모두 바꾸면 공통 인수 $$\dfrac{1}{\ln c}$$가 약분된다. ∎

</details>


로그함수는 어떤 양의 거듭제곱 $$x^{\varepsilon}$$보다도 느리게 자란다. $$\varepsilon = 0.01$$이어도 결국 $$x^{0.01}$$이 $$\ln x$$를 앞선다. [증명 생략: [로피탈 정리와 증가 속도](/Hongs_Blog/studies/calculus/lhopital-growth/)]

## 예제

**데시벨.** 두 세기의 비 $$P / P_0$$를 $$10 \log_{10}(P / P_0)$$ dB로 나타낸다.

1. *두 배:* $$10 \log_{10} 2 \approx 3.01$$ dB. 절반은 $$-3.01$$ dB다.
2. *열 배:* $$10$$ dB. 천분의 일은 $$-30$$ dB다.
3. *거듭된 감쇠 더하기:* 신호가 1 km마다 절반이 되는 선로라면 10 km 뒤 감쇠는 $$10 \times 3.01 = 30.1$$ dB다. 곱해지는 비율이 로그에서는 더해지니, 구간별 dB를 더하기만 하면 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 삽입 정렬 비교 횟수가 정확히 $$n(n-1)/2$$, 로그-로그 기울기 2.000(삽입)과 1.143(병합), 정리 1~3을 밑 2·$$e$$·10에서 확인, dB 값, 카드 C1 — [08_log-scale_verify.py](/Hongs_Blog/studies/college-math/code/08_log-scale_verify/)</div>

</div>


## 활용

- **복잡도 실험.** 입력을 두 배로 늘렸을 때 시간이 $$r$$배가 되면 차수는 약 $$\lg r$$다. 4배면 $$n^2$$, 8배면 $$n^3$$이다. 이 볼트의 복잡도 검증도 이 방법을 쓴다. 파이썬 matplotlib의 `loglog`, `semilogy`가 로그-로그와 반로그 그래프를 그린다.
- **통신.** 신호 대 잡음비와 선로 감쇠를 dB로 적는다. 여러 구간의 이득과 손실을 곱하지 않고 더해서 계산하기 위해서다[^s1].
- **감각.** 사람의 밝기·소리 감각은 자극의 차이보다 비율에 반응한다(웨버의 법칙). 그래서 음량은 dB로, 음정은 주파수의 비(한 옥타브가 2배)로 잰다. [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)의 웨버 대비가 차이를 배경 밝기로 나눈 비율인 것도 같은 까닭이다[^s1].
- 알고리즘에서: [시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/)는 이중 반복의 시간을 재어 로그-로그 기울기 2.16을 얻는다. 시간이 $$n^2$$에 가깝게 는다는 뜻이다. 예시의 병합 정렬이 반으로 나눠 합치는 과정은 [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)에 있다.

## 연결

- 선수: [로그](/Hongs_Blog/studies/college-math/logarithm/)
- 대조: [거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/). 로그-로그에서 직선이면 거듭제곱, 반로그에서 직선이면 지수다.
- 다른 과목: [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)의 섀넌 용량 $$C = B \log_2(1 + S/N)$$에 로그가 들어 있다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"로그 눈금 그래프에서 직선이면 선형 관계다"</div>

틀렸다. 보통 눈금에서 직선이 선형 관계라서 눈금이 바뀌어도 같은 뜻일 것 같다. 로그-로그 그래프의 직선은 거듭제곱 관계 $$y = c x^k$$이고, 반로그 그래프의 직선은 지수 관계 $$y = a b^x$$다. $$y = x^2$$은 로그-로그 그래프에서 기울기 2인 직선이지만 입력을 2배 하면 출력이 4배가 되는 비선형 관계다. 로그-로그 기울기가 정확히 1일 때만 비례 관계다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 어떤 알고리즘의 실행 시간을 쟀더니 n = 1000에서 0.02초, n = 8000에서 1.28초였다. 시간이 n의 몇 제곱에 비례한다고 볼 수 있는가?</summary>

**답:** 로그-로그 기울기 $$\dfrac{\lg(1.28/0.02)}{\lg(8000/1000)} = \dfrac{\lg 64}{\lg 8} = \dfrac{6}{3} = 2$$. 시간이 $$n^2$$에 비례한다.

**흔한 오답:** 시간 비 64를 입력 비 8로 나눠 "8제곱"이라고 하는 것. 차수는 비의 **로그**끼리 나눈 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 두 데이터가 있다. (가)는 반로그 그래프(세로축만 로그)에서 직선이고, (나)는 로그-로그 그래프에서 직선이다. 각각 어떤 꼴의 함수인가? 입력을 1 늘릴 때와 2배로 할 때 출력은 각각 어떻게 변하는가?</summary>

**답:** (가)는 지수함수 $$y = a b^x$$다. 입력을 1 늘리면 출력이 늘 $$b$$배가 된다. (나)는 거듭제곱함수 $$y = c x^k$$다. 입력을 2배로 하면 출력이 늘 $$2^k$$배가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 신호 세기가 원래의 1/1000로 줄면 몇 dB인가? 3 dB 증가는 세기가 대략 몇 배가 된 것인가?</summary>

**답:** $$10 \log_{10}(1/1000) = -30$$ dB. 3 dB는 $$10^{0.3} \approx 2$$배다($$10 \log_{10} 2 \approx 3.01$$).

**흔한 오답:** $$\log_{10}(1/1000) = -3$$에서 멈추는 것. 데시벨은 로그에 10을 곱한다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 4.4절 "Graphs of Logarithmic Functions". 로그 눈금을 쓰는 모형은 4.7절 "Exponential and Logarithmic Models".
[^s1]: 에이전트 보충. 데시벨로 이득과 손실을 더하는 방식은 통신 공학의 표준 관례다. 웨버의 법칙(자극의 변별 문턱이 자극 세기에 비례)과, 이로부터 감각이 자극의 로그에 비례한다는 페히너의 법칙은 정신물리학의 고전적 결과다. 페히너의 법칙은 근사이며 모든 감각과 범위에서 성립하지는 않는다.
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [08_log-scale_plot.py](/Hongs_Blog/studies/college-math/code/08_log-scale_plot/)로 그렸고, 그림에 쓴 값(삽입 정렬 비교 횟수가 정확히 $$n(n-1)/2$$, 로그-로그 기울기 2.00과 1.14, 네 로그가 모두 $$(1, 0)$$을 지남)을 같은 코드로 확인했다.
{% endraw %}
