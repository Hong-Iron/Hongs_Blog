---
layout: "note"
title: "양자화 잡음과 SQNR"
display_title: "양자화 잡음과 SQNR (Quantization Noise and SQNR)"
kind: "concept"
kind_label: "정의"
num: "63"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Quantization Noise", "SQNR", "Signal to Quantization Noise Ratio", "신호 대 양자화 잡음비", "균일 양자화", "Uniform Quantization", "양자화 오차", "Quantization Error", "칸 폭", "Step Size", "구역", "Zone", "최하위 비트", "LSB", "6 dB 규칙"]
description: "자로 길이를 잴 때 눈금 사이 값을 가장 가까운 눈금으로 읽듯, 소리를 컴퓨터에 적을 때도 값의 범위를 같은 폭의 칸으로 나누고 값을 자기가 든 칸의 대표값으로 반올림한다. 반올림으로 생긴 차이는 원래 소리 위에 얹힌 작은 잡음처럼 들린다. 칸 번호를 적는 비트를 하나 늘리면 칸 …"
prev_url: "/studies/human-interface-media/aliasing/"
prev_title: "에일리어싱"
next_url: "/studies/human-interface-media/nonuniform-quantization/"
next_title: "비균일 양자화"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "63_quantization-noise-sqnr_plot.py", "u": "/studies/human-interface-media/code/63_quantization-noise-sqnr_plot/", "r": "그림 생성"}, {"t": "63_quantization-noise-sqnr_verify.py", "u": "/studies/human-interface-media/code/63_quantization-noise-sqnr_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/quantization-noise-sqnr/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자로 길이를 잴 때 눈금 사이 값을 가장 가까운 눈금으로 읽듯, 소리를 컴퓨터에 적을 때도 값의 범위를 같은 폭의 칸으로 나누고 값을 자기가 든 칸의 대표값으로 반올림한다. 반올림으로 생긴 차이는 원래 소리 위에 얹힌 작은 잡음처럼 들린다. 칸 번호를 적는 비트를 하나 늘리면 칸 폭이 반이 되고, 신호와 잡음의 세기 비가 로그 단위(데시벨)로 약 6씩 커진다. 단, 이 계산은 소리가 범위를 꽉 채울 때 맞다. 작은 소리는 칸을 몇 개만 써서 잡음 비율이 크게 나빠지고, 범위를 넘는 소리는 잘린다.

</div>


## 예시로 보기

[표본화](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)로 뽑은 값은 −6.1, 7.5, 16.2처럼 소수점 아래가 얼마든지 길어질 수 있다. 컴퓨터는 표본 하나에 정해진 개수의 비트만 쓰므로, 값을 미리 정한 몇 개 중 하나로 바꾼 뒤에야 비트열로 적을 수 있다.

값이 −20 ~ 20 사이에 있는 표본 9개를 3비트로 적어 본다[^s1].

1. *칸 폭 정하기.* 3비트로는 $$2^3 = 8$$가지 번호를 적을 수 있다. 그래서 범위를 8칸으로 나눈다. 칸 폭은 범위 길이를 칸 수로 나눈 값이다. $$\Delta = (20 - (-20))/8 = 5$$. 맨 아래 칸(−20 ~ −15)이 0번, 맨 위 칸(15 ~ 20)이 7번이다.
2. *칸 폭 단위로 바꾸기.* 값을 $$\Delta$$로 나누면 "0에서 몇 칸 떨어졌나"가 된다. $$-6.1 / 5 = -1.22$$.
3. *든 칸 찾기.* −1.22는 −2와 −1 사이에 있다. 0 아래 두 번째 칸이므로 칸 번호는 $$4 - 2 = 2$$다.
4. *칸 가운데 값으로 바꾸기.* 2번 칸은 −2 ~ −1이고 가운데는 −1.5다. 실제 값으로는 $$-1.5 \times 5 = -7.5$$다.
5. *오차 구하기.* 오차 = 양자화 값 − 원래 값 $$= -1.50 - (-1.22) = -0.28$$칸이다. 실제 단위로는 $$-7.5 - (-6.1) = -1.4$$다.
6. *2진 부호로 적기.* 칸 번호 2를 3비트로 쓰면 010이다.

9개를 모두 같은 순서로 처리하면 이렇다.

| 표본 | −6.1 | 7.5 | 16.2 | 19.7 | 11.0 | −5.5 | −11.3 | −9.4 | −6.0 |
|---|---|---|---|---|---|---|---|---|---|
| 칸 단위 값 (÷ Δ) | −1.22 | 1.50 | 3.24 | 3.94 | 2.20 | −1.10 | −2.26 | −1.88 | −1.20 |
| 양자화 값 (칸 가운데) | −1.50 | 1.50 | 3.50 | 3.50 | 2.50 | −1.50 | −2.50 | −1.50 | −1.50 |
| 오차 (양자화 값 − 원래 값) | −0.28 | 0 | +0.26 | −0.44 | +0.30 | −0.40 | −0.24 | +0.38 | −0.30 |
| 칸 번호 | 2 | 5 | 7 | 7 | 6 | 2 | 1 | 2 | 2 |
| 3비트 부호 | 010 | 101 | 111 | 111 | 110 | 010 | 001 | 010 | 010 |


표에서 세 가지를 읽을 수 있다. 오차는 모두 −0.5 ~ 0.5칸, 곧 반 칸을 넘지 않는다. 16.2와 19.7은 둘 다 7번 칸(111)이 되어 받는 쪽에서는 구별할 수 없다. 표본 9개를 3비트씩 적으니 모두 27비트다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/63_quantization-noise-sqnr_fig1.svg" alt="그림" width="651" height="460" loading="lazy">

위 그림에서 회색 곡선이 원래 신호, 파란 계단이 3비트로 양자화한 값이다. 오른쪽 끝의 000 ~ 111이 칸마다 붙인 부호다. 왼쪽 아래는 두 선의 차이(오차)로, 늘 점선 $$\pm\Delta/2$$ 사이에서 톱니처럼 오르내린다. 신호가 천천히 움직이는 꼭대기와 바닥에서는 오차도 둥근 곡선이 된다. 오른쪽 아래는 무작위 값 20만 개의 오차를 모은 막대그래프다. 막대가 $$-\Delta/2$$부터 $$\Delta/2$$까지 거의 같은 높이라서, 오차가 반 칸 안 어디에나 고르게 퍼진다는 것을 보여 준다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **균일 양자화**: 값의 범위 [min, max]를 폭이 같은 $$L$$개의 칸(구역, zone)으로 겹치지 않게 나누고, 칸마다 2진 부호 하나와 대표값 하나를 정한다. 값은 자기가 든 칸의 대표값으로 바꾼다.
- **양자화 잡음**: 원래 아날로그 값과 디지털로 적은 값의 차이다. 양자화에서 값을 반올림하면서 생긴다.
- **SQNR**(신호 대 양자화 잡음비, Signal to Quantization Noise Ratio): 신호의 크기가 양자화 잡음의 크기보다 몇 배 큰지를 데시벨로 적은 값이다.

</div>


기호로 쓰면 칸 폭과 필요한 비트 수는 이렇다.

$$
\Delta = \frac{\max - \min}{L}, \qquad n_b = \log_2 L
$$


- $$\max$$, $$\min$$: 범위의 위 끝과 아래 끝
- $$L$$: 칸 개수. 보통 2의 거듭제곱이다. 아니면 $$n_b = \lceil \log_2 L \rceil$$(올림)로 쓴다[^s7].
- $$\Delta$$("델타"): 칸 하나의 높이(칸 폭)
- $$n_b$$: 칸 번호를 2진수로 적는 데 드는 비트 수. $$n_b = 3$$이면 칸 8개에 부호 000, 001, 010, 011, 100, 101, 110, 111을 붙인다.

$$k$$번 칸($$k = 0, 1, \dots, L - 1$$)은 $$\min + k\Delta \le x < \min + (k+1)\Delta$$인 값들이다. 맨 위 끝 $$x = \max$$는 $$L-1$$번 칸에 넣는다. 대표값을 칸 가운데로 두면 양자화 값과 오차는 다음과 같다.

$$
Q(x) = \min + \left(k + \tfrac{1}{2}\right)\Delta, \qquad e = Q(x) - x, \qquad |e| \le \frac{\Delta}{2}
$$


$$Q(x)$$는 "$$x$$를 양자화한 값", $$e$$는 오차다. 칸 가운데에서 칸 끝까지가 반 칸이라 범위 안의 값은 오차가 $$\Delta/2$$를 넘지 않는다. 오차를 "원래 값 − 양자화 값"으로 적는 자료도 있다. 부호만 반대이고 크기는 같다[^s4].

대표값을 칸 가운데로 두는 데는 이유가 있다. 칸의 아래 끝을 대표값으로 쓰면 오차가 $$-\Delta$$부터 0까지라 최대 크기가 $$\Delta$$이고, 늘 한쪽(음수)으로 치우친다. 가운데로 두면 최대 크기가 $$\Delta/2$$로 줄고 평균이 0이 된다. 칸 수 $$L$$을 2의 거듭제곱으로 고르는 것은 $$n_b$$비트로 만들 수 있는 부호 $$2^{n_b}$$개를 하나도 남기지 않고 쓰기 위해서다[^s7].

균일 양자화의 예는 위의 3비트 예제, CD의 16비트 소리, 화소 밝기를 0 ~ 255로 적는 8비트 이미지([디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/))다. 균일 양자화가 아닌 예로는 작은 값에 좁은 칸을 주는 전화의 μ 법칙([비균일 양자화](/Hongs_Blog/studies/human-interface-media/nonuniform-quantization/))과, 큰 수일수록 이웃한 수 사이 간격이 넓어지는 [부동소수점](/Hongs_Blog/studies/data-and-information/floating-point/) 수가 있다[^s7].

칸 폭 $$\Delta$$는 2진 부호의 맨 끝 자리(최하위 비트, LSB) 하나가 바뀔 때 값이 바뀌는 크기다. 그래서 오차는 위아래를 합쳐 1 LSB 폭 안에서 톱니 모양으로 움직인다. 비트를 하나 늘리면 칸 수가 두 배가 되고 톱니 높이는 반이 된다.

| 비트 수 | 3 | 4 | 5 | 8 | 16 |
|---|---|---|---|---|---|
| 칸(레벨) 수 $$2^{n_b}$$ | 8 | 16 | 32 | 256 | 65,536 |

### 잡음 전력

오차가 $$-\Delta/2$$부터 $$\Delta/2$$까지 고르게 퍼져 있다고 보면, 오차를 제곱해 평균한 값(잡음 전력) $$P_e$$는 칸 폭의 제곱을 12로 나눈 값이다[^s3].

$$
P_e = \frac{\Delta^2}{12}
$$


$$\Delta = 5$$인 위 예제라면 $$P_e = 25/12 \approx 2.08$$이다. 오차의 평균적인 크기는 $$\sqrt{P_e} = \Delta/\sqrt{12} \approx 0.29\Delta \approx 1.44$$로, 최대 오차 $$\Delta/2 = 2.5$$보다 작다.

### SQNR의 두 가지 정의

**최대 진폭으로 잰 SQNR.** 신호가 낼 수 있는 가장 큰 진폭을 오차의 가장 큰 크기로 나누고 데시벨로 바꾼다. 진폭끼리의 비라서 $$20\log_{10}$$을 쓴다.

$$
\text{SQNR} = 20\log_{10}\frac{V_{\text{signal}}}{V_{\text{quan\_noise}}} = 20\log_{10}\frac{2^{N-1}}{\frac{1}{2}} = 20 \times N \times \log_{10} 2 \approx 6.02N \ \text{(dB)}
$$


- $$N$$: 표본 하나에 쓰는 비트 수($$n_b$$와 같다)
- $$V_{\text{signal}} = 2^{N-1}$$: 칸 폭 단위로 잰 가장 큰 진폭. 칸 $$2^N$$개가 0을 가운데 두고 위아래로 나뉘므로 한쪽은 $$2^{N-1}$$칸이다.
- $$V_{\text{quan\_noise}} = \frac12$$: 오차의 가장 큰 크기, 반 칸
- 두 값의 비는 $$2^{N-1} / \tfrac12 = 2^N$$이다. $$\log_{10} 2 \approx 0.301$$이라 $$20 \times 0.301 = 6.02$$가 된다.

8비트면 $$6.02 \times 8 \approx 48.2$$ dB, 16비트면 $$96.3$$ dB다.

**평균 전력으로 잰 SQNR.** 신호를 제곱해 평균한 값(신호 전력)을 잡음 전력으로 나누고 데시벨로 바꾼다. 전력끼리의 비라서 $$10\log_{10}$$을 쓴다. 범위를 꽉 채운 정현파(사인파)라면 결과는 $$6.02N + 1.76$$ dB다[^s3].

$$
\text{SQNR} = 10\log_{10}\frac{P_{\text{signal}}}{P_e} = 10\log_{10}\left(1.5 \times 4^{N}\right) \approx 6.02N + 1.76 \ \text{(dB)}
$$


16비트면 $$96.3 + 1.76 \approx 98.1$$ dB다. 진폭이 두 배면 전력은 네 배이므로, 진폭 비에 $$20\log$$, 전력 비에 $$10\log$$를 쓰면 같은 신호에서 같은 데시벨이 나온다([데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)).

| | 최대 진폭으로 잰 SQNR | 평균 전력으로 잰 SQNR (꽉 찬 정현파) |
|---|---|---|
| 무엇을 무엇으로 나누나 | 가장 큰 신호 진폭 ÷ 가장 큰 오차 | 신호 전력 ÷ 잡음 전력 $$\Delta^2/12$$ |
| 결과 | $$6.02N$$ dB | $$6.02N + 1.76$$ dB |
| 16비트 | 96.3 dB | 98.1 dB |
| 쓰는 곳 | 비트 수만으로 빠르게 어림할 때 | 실제 음악·소리처럼 출렁이는 신호를 잴 때 |

두 정의가 같은 값을 주는 경우도 있다. 신호가 범위 전체에 고르게 퍼져 있으면 신호 전력이 $$(2^N\Delta)^2/12$$이고, 이것을 $$\Delta^2/12$$로 나누면 정확히 $$4^N$$, 곧 $$6.02N$$ dB다[^s3].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/63_quantization-noise-sqnr_fig2.svg" alt="그림" width="626" height="320" loading="lazy">

왼쪽은 실제로 양자화해 잰 SQNR이다. 비트가 하나 늘 때마다 점들이 약 6 dB씩 올라간다. 오른쪽은 같은 값에서 $$6.02N$$을 뺀 나머지다. 범위를 고르게 채운 무작위 신호(네모)는 0에 붙어 있고, 꽉 찬 정현파(동그라미)는 1.76 dB 선 근처에 있다. 정현파는 비트가 적을 때(2~4비트) 오차가 덜 고르게 퍼져서 선에서 0.5 ~ 1 dB 벗어난다[^s6].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 9개 표본의 칸 번호·부호·오차(첫 오차 −0.28), 비트-레벨 표, $$20\log_{10}2 = 6.02$$와 $$10\log_{10}1.5 = 1.76$$, 무작위 신호 20만 개의 잡음 전력이 $$\Delta^2/12$$의 2% 안, 4~16비트 정현파의 측정 SQNR이 $$6.02N + 1.76$$의 0.5 dB 안 (증명은 아래, 수치는 실험으로 확인됨) — [63_quantization-noise-sqnr_verify.py](/Hongs_Blog/studies/human-interface-media/code/63_quantization-noise-sqnr_verify/)</div>

</div>


## 증명

$$P_e = \Delta^2/12$$와 $$6.02N + 1.76$$ dB는, 오차가 반 칸 안에 고르게 퍼진다고 놓고 제곱의 평균을 적분으로 구해서 얻는다[^s3].

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


1. 오차 $$e$$는 $$[-\Delta/2, \Delta/2]$$에서 고르게 나온다. 그 구간의 확률 밀도는 $$1/\Delta$$다. — 가정(아래 표의 세 번째 줄)
2. $$P_e = E[e^2] = \displaystyle\int_{-\Delta/2}^{\Delta/2} e^2 \cdot \frac{1}{\Delta}\, de$$ — 제곱의 평균은 제곱에 밀도를 곱해 적분한 값
3. $$= \dfrac{1}{\Delta}\left[\dfrac{e^3}{3}\right]_{-\Delta/2}^{\Delta/2} = \dfrac{1}{\Delta}\left(\dfrac{\Delta^3}{24} + \dfrac{\Delta^3}{24}\right) = \dfrac{\Delta^2}{12}$$ — 적분 계산
4. 꽉 찬 정현파의 진폭은 $$A = 2^{N-1}\Delta$$다. 정현파의 전력은 $$A^2/2$$이므로 $$P_{\text{signal}} = 4^{N-1}\Delta^2/2 = 4^N\Delta^2/8$$이다. — [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/)
5. $$P_{\text{signal}} / P_e = \dfrac{4^N\Delta^2/8}{\Delta^2/12} = 1.5 \times 4^N$$ — $$\Delta^2$$가 약분된다
6. $$10\log_{10}(1.5 \times 4^N) = 10\log_{10}1.5 + N \times 20\log_{10}2 \approx 1.76 + 6.02N$$ — 로그의 곱셈 규칙, $$10\log_{10}4 = 20\log_{10}2$$

최대 진폭 정의는 적분이 필요 없다. $$V_{\text{signal}}/V_{\text{quan\_noise}} = 2^{N-1}/(1/2) = 2^N$$이고 $$20\log_{10}2^N = 20N\log_{10}2$$다.

</details>

결론을 바꾸는 가정과, 가정이 깨질 때의 예다(8비트, 검증 코드로 계산)[^s5].

| 가정 | 깨지면 | 예 |
|---|---|---|
| 신호가 범위를 넘지 않는다 | 넘친 부분이 끝 칸으로 잘려(과부하) 오차가 반 칸보다 훨씬 커진다 | 범위의 1.5배인 정현파: 49.9 dB에서 12.0 dB로 떨어진다 |
| 신호가 범위를 꽉 채운다 | 잡음은 그대로인데 신호 전력만 줄어 SQNR이 떨어진다 | 진폭이 1/10(−20 dB)인 정현파: 약 30.3 dB, 20 dB쯤 낮다 |
| 오차가 반 칸 안에 고르게 퍼진다 | $$\Delta^2/12$$가 맞지 않는다 | 한 칸 안에서만 흔들리는 신호는 출력이 늘 같은 값이 되어 흔들림 전체가 오차가 된다. 늘 같은 값인 신호는 오차도 늘 같다 |

### 스스로 설명해 보기

1. "$$P_e = \frac{1}{\Delta}\int_{-\Delta/2}^{\Delta/2} e^2\, de$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   오차가 길이 $$\Delta$$인 구간에 고르게 퍼진다는 가정이다. 고른 분포의 확률 밀도는 구간 길이의 역수 $$1/\Delta$$이고, 제곱의 평균은 제곱에 밀도를 곱해 구간 전체로 적분한 값이다.
   </details>
2. "$$V_{\text{signal}} = 2^{N-1}$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   $$N$$비트면 칸이 $$2^N$$개다. 범위가 0을 가운데 두고 위아래로 나뉘므로 가장 큰 진폭은 범위의 절반, 곧 $$2^{N-1}$$칸이다.
   </details>
3. "비트를 하나 더하면 SQNR이 약 6 dB 오른다"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   범위는 그대로이고 칸 수가 두 배가 되어 $$\Delta$$가 반이 된다. 최대 오차도 반이 되어 진폭 비가 2배, $$20\log_{10}2 \approx 6.02$$ dB다. 전력으로 보면 $$P_e$$가 1/4이 되어 $$10\log_{10}4$$, 같은 6.02 dB다.
   </details>
- 이 유도의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  잡음의 크기는 칸 폭 $$\Delta$$ 하나로 정해지고, 신호의 크기는 범위가 정한다. 범위를 고정하고 비트를 늘리면 $$\Delta$$만 반씩 줄어든다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  이미지 밝기를 몇 비트로 적을지 고를 때([디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/)), 센서 값을 디지털로 바꾸는 변환기(ADC)의 비트 수를 고를 때, MPEG 부호기가 부분 대역마다 비트를 몇 개 줄지 정할 때([MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)).
  </details>

## 예제

CD처럼 16비트로, 전압 범위 −1 ~ 1 V를 양자화한다. 칸 폭, 최대 오차, 꽉 찬 정현파의 SQNR을 구한다[^s5].

1. *칸 수:* $$2^{16} = 65{,}536$$칸
2. *칸 폭:* $$\Delta = 2 / 65{,}536 \approx 30.5$$ μV(마이크로볼트, 백만분의 1볼트)
3. *최대 오차:* $$\Delta/2 \approx 15.3$$ μV. 오차의 평균적인 크기는 $$\Delta/\sqrt{12} \approx 8.8$$ μV
4. *SQNR:* 최대 진폭으로 재면 $$6.02 \times 16 = 96.3$$ dB, 꽉 찬 정현파의 전력으로 재면 $$96.3 + 1.76 = 98.1$$ dB

같은 16비트라도 소리가 범위의 1/100(−40 dB)밖에 안 되는 조용한 대목은 SQNR이 약 40 dB 낮아져 58 dB 근처가 된다.

## 활용

- 원하는 SQNR이 정해지면 비트 수를 거꾸로 구한다. 최대 진폭 정의로는 $$N \ge \text{SQNR}/6.02$$다. 80 dB가 필요하면 $$80/6.02 \approx 13.3$$이라 14비트다. 정현파 전력 정의로 따지면 13비트($$78.3 + 1.76 = 80.0$$)로 충분하다. 문제에서 어느 정의를 쓰는지 먼저 확인한다.
- 전화 음성은 8비트라 꽉 찬 신호에서도 SQNR이 48 ~ 50 dB이고, 작은 목소리에서는 크게 떨어진다. 그래서 전화는 작은 값에 칸을 촘촘히 주는 [비균일 양자화](/Hongs_Blog/studies/human-interface-media/nonuniform-quantization/)를 쓴다.
- [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)는 주파수 대역마다 "잡음이 이만큼 작으면 안 들린다"는 기준을 구하고, 그 기준을 맞출 만큼만 비트를 준다. 비트 하나가 6 dB라는 규칙이 그 계산의 바탕이다.
- 흔한 실수: 칸 폭을 $$(\max - \min)/(L - 1)$$로 나누는 것. 칸이 $$L$$개이므로 $$L$$로 나눈다. 대표값을 칸의 양 끝에 두는 다른 방식과 섞어서 생기는 실수다.
- 계산 연습: [디지털 오디오 계산 연습](/Hongs_Blog/studies/human-interface-media/digital-audio-practice/)

## 연결

- 선수: [디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/) ($$b$$비트면 $$2^b$$단계), [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) ($$10\log$$와 $$20\log$$)
- 바로 앞 단계: [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)와 [에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)은 시간을 끊는 일이고, 이 문서는 값을 끊는 일이다.
- 다른 과목에서의 모습: [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/) (오차 한계 $$\Delta_q/2$$), [PCM](/Hongs_Blog/studies/computer-communication/pcm/) (전화 음성을 8비트로 보내기)
- 다음: [비균일 양자화](/Hongs_Blog/studies/human-interface-media/nonuniform-quantization/), [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"16비트 오디오의 SQNR은 96 dB이니, 어떤 소리를 녹음해도 잡음이 신호보다 96 dB 작다"</div>

틀렸다. 96 dB(또는 98 dB)는 신호가 범위를 꽉 채운다는 가정에서 나온 값이다. 기기의 성능표에 적힌 숫자라 어떤 소리에나 맞는 것처럼 보인다. 실제로는 잡음 전력 $$\Delta^2/12$$는 소리 크기와 상관없이 그대로이고, 소리가 작아진 만큼 SQNR만 떨어진다. 꽉 찬 진폭의 1/10인 소리는 20 dB, 1/100인 소리는 40 dB 낮아진다. 확인 방법: 8비트에서 꽉 찬 정현파는 약 49.9 dB인데, 진폭 1/10인 정현파를 같은 방식으로 양자화해 재면 약 30.3 dB가 나온다(검증 코드).

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 범위 [min, max]를 L개 구역으로 나누는 균일 양자화에서 칸 폭 Δ와 필요한 비트 수 n_b의 식을 쓰고, 범위 안 값의 오차가 얼마를 넘지 않는지 쓰라.</summary>


**답:** $$\Delta = (\max - \min)/L$$, $$n_b = \log_2 L$$. 값을 칸 가운데로 바꾸면 오차는 $$\Delta/2$$(반 칸)를 넘지 않는다.<br>
**흔한 오답:** $$L - 1$$로 나누는 것. 칸이 $$L$$개이므로 $$L$$로 나눈다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 범위 −20 ~ 20 V를 3비트로 균일 양자화한다(맨 아래 칸이 0번). 표본 12.3 V의 칸 번호, 3비트 부호, 양자화 값, 오차(양자화 값 − 원래 값)를 구하라.</summary>


**답:** $$\Delta = 40/8 = 5$$ V. $$12.3/5 = 2.46$$이라 0 위로 세 번째 칸(2 ~ 3칸)에 든다. 칸 번호는 $$4 + 2 = 6$$, 부호는 110. 양자화 값은 칸 가운데 $$2.5 \times 5 = 12.5$$ V, 오차는 $$12.5 - 12.3 = +0.2$$ V다.<br>
**흔한 오답:** 칸 번호를 2로 쓰는 것. 0 아래 칸 4개(0~3번)를 먼저 세야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 16비트 오디오의 SQNR을 96 dB라고 쓴 자료와 98 dB라고 쓴 자료가 있다. 둘 중 하나가 틀렸는가? 각 값이 무엇을 무엇으로 나눈 비인지 쓰라.</summary>


**답:** 둘 다 맞다. 정의가 다르다. 96.3 dB는 가장 큰 신호 진폭 $$2^{15}$$칸을 가장 큰 오차 1/2칸으로 나눈 진폭 비를 $$20\log_{10}$$으로 바꾼 값($$6.02 \times 16$$)이다. 98.1 dB는 꽉 찬 정현파의 평균 전력을 잡음 전력 $$\Delta^2/12$$로 나눈 전력 비를 $$10\log_{10}$$으로 바꾼 값($$6.02 \times 16 + 1.76$$)이다.<br>
**이유:** 정현파는 대부분의 시간 동안 꼭대기보다 작아서 평균 전력이 $$A^2/2$$이고, 오차도 평균 크기 $$\Delta/\sqrt{12}$$가 최대 크기 $$\Delta/2$$보다 작다. 두 효과를 합치면 1.5배, 1.76 dB 차이가 난다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 양자화 잡음 전력이 $$\Delta^2/12$$인 이유를 쓰라. 어떤 가정이 필요한가?</summary>


**답:** 오차가 $$-\Delta/2 \sim \Delta/2$$에 고르게 퍼진다고 가정한다. 그러면 밀도가 $$1/\Delta$$이고 $$E[e^2] = \frac{1}{\Delta}\int_{-\Delta/2}^{\Delta/2} e^2\,de = \Delta^2/12$$다.<br>
**이유:** 이 가정은 신호가 범위 안에서 여러 칸을 오가며 움직일 때 잘 맞는다. 신호가 범위를 넘거나(잘림) 한 칸 안에만 머물면 맞지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 8비트 균일 양자화에서 "SQNR은 약 50 dB"가 크게 틀리는 신호를 두 가지 만들고, 각각 왜 틀리는지 쓰라.</summary>


**답:** (1) 칸 하나의 가운데 근처에서 반 칸보다 작게 흔들리는 신호. 출력이 늘 같은 대표값이라 흔들림 전체가 오차가 되고, 흔들림 기준 SQNR은 0 dB다. (2) 범위의 1.5배인 정현파. 넘친 부분이 끝 칸으로 잘려 오차가 반 칸보다 훨씬 커지고, SQNR이 약 12 dB로 떨어진다.<br>
**이유:** 50 dB는 신호가 범위를 꽉 채우되 넘치지 않고, 오차가 칸 안에 고르게 퍼진다는 가정에서 나온다. (1)은 꽉 채운다는 가정과 고르게 퍼진다는 가정을, (2)는 넘치지 않는다는 가정을 깬다.

</details>

[^s1]: 그림의 세로축 눈금이 −4Δ ~ 4Δ이고 7.5를 Δ로 나눈 값이 1.50으로 적혀 있어 Δ = 5, 범위 −20 ~ 20으로 읽었다.
[^s2]: [63_quantization-noise-sqnr_plot.py](/Hongs_Blog/studies/human-interface-media/code/63_quantization-noise-sqnr_plot/)로 그렸고, 오차가 ±Δ/2 안에 있는지, 막대 25개의 높이가 1/Δ에서 5% 안인지, 잡음 전력이 Δ²/12의 2% 안인지를 같은 코드로 확인했다.
[^s3]: 잡음 전력 Δ²/12의 유도, 평균 전력으로 정의한 SQNR 6.02N + 1.76 dB, 범위를 고르게 채운 신호에서 두 정의가 같아진다는 것은 디지털 신호 처리 교재의 표준 내용이다. 실제로 양자화해 잰 값과 맞는지 검증 코드로 확인했다.
[^s4]: 이 문서는 예제 표의 관례를 따른다.
[^s5]: 수치는 모두 검증 코드로 계산했다.
[^s6]: [63_quantization-noise-sqnr_plot.py](/Hongs_Blog/studies/human-interface-media/code/63_quantization-noise-sqnr_plot/)로 2~16비트를 실제로 양자화해 그렸고, 정현파는 $$6.02N + 1.76$$의 0.5 dB 안(2~4비트는 1 dB 안), 무작위 신호는 $$6.02N$$의 0.1 dB 안인지 같은 코드로 확인했다.
[^s7]: 예를 들어 칸이 200개면 $$\log_2 200 \approx 7.64$$라 8비트가 필요하다. 아래 끝을 대표값으로 쓸 때의 오차 범위는 검증 코드로 확인했다.
{% endraw %}
