---
layout: "note"
title: "사인파"
display_title: "사인파 (Sinusoid)"
kind: "concept"
kind_label: "모델"
num: "13"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Sinusoid", "Sine Wave", "정현파", "진폭", "amplitude", "주파수", "frequency", "주기", "period", "위상", "phase", "각주파수", "angular frequency", "에일리어싱", "aliasing", "표본화", "sampling"]
description: "사인파는 \"얼마나 크게, 1초에 몇 번, 언제부터\" 흔들리는지 세 수로 정해지는 가장 순수한 진동이다. 소리의 크기와 음정, 전파의 반송파, 교류 전기가 모두 이 모양이다. 같은 빠르기의 사인파끼리 더하면 여전히 같은 빠르기의 사인파가 되어 다루기 쉽다. 다만 실제 소리와 신호는 …"
prev_url: "/studies/college-math/trig-functions/"
prev_title: "삼각함수"
next_url: "/studies/college-math/trig-identities/"
next_title: "삼각함수 항등식"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/sinusoid/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사인파는 "얼마나 크게, 1초에 몇 번, 언제부터" 흔들리는지 세 수로 정해지는 가장 순수한 진동이다. 소리의 크기와 음정, 전파의 반송파, 교류 전기가 모두 이 모양이다. 같은 빠르기의 사인파끼리 더하면 여전히 같은 빠르기의 사인파가 되어 다루기 쉽다. 다만 실제 소리와 신호는 여러 빠르기가 섞여 있어 사인파 하나로는 부족하고, 그것을 사인파들로 나누는 일은 푸리에 급수가 맡는다.

</div>


## 예시로 보기

라(A4) 음은 공기가 1초에 440번 떨리는 소리다. 소리 크기가 1인 이 음을 식으로 쓰면 $$s(t) = \sin(2\pi \cdot 440\, t)$$이다. 한 번 떨리는 데 $$1/440$$초, 약 2.27 ms가 걸린다.

| 바꾼 것 | 식 | 들리는 변화 |
|---|---|---|
| 진폭 2배 | $$2\sin(2\pi \cdot 440 t)$$ | 더 큰 소리 |
| 주파수 2배 | $$\sin(2\pi \cdot 880 t)$$ | 한 옥타브 높은 라 |
| 위상 $$\pi/2$$ | $$\sin(2\pi \cdot 440 t + \pi/2)$$ | 같은 소리, $$1/1760$$초 먼저 시작 |

표의 세 조작은 [함수의 변환](/Hongs_Blog/studies/college-math/function-transformation/)과 짝을 이룬다. 진폭은 세로 배율, 주파수는 가로 배율, 위상은 가로 이동이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/13_sinusoid_fig1.svg" alt="그림" width="610" height="237" loading="lazy">

회색이 원래의 440 Hz 사인파다. 진폭을 키우면 위아래로 늘어나고, 주파수를 키우면 가로로 줄어들고, 위상을 바꾸면 모양은 그대로 왼쪽으로 옮겨 간다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

실수 $$A > 0$$, $$f > 0$$, $$\varphi$$, $$C$$에 대해

$$s(t) = A \sin(2\pi f t + \varphi) + C = A\sin(\omega t + \varphi) + C$$

를 사인파라 한다[^1].
- 진폭 $$A$$: 가운데 값 $$C$$에서 가장 멀리 가는 거리
- 주파수 $$f$$ (Hz): 1초 동안의 반복 횟수. 주기는 $$T = 1/f$$초
- 각주파수 $$\omega = 2\pi f$$ (rad/s): 1초 동안 도는 각
- 위상 $$\varphi$$ (rad): $$t = 0$$에서의 출발 각. 그래프는 왼쪽으로 $$\varphi / \omega$$초 옮겨진다
- $$C$$: 가운데 값(직류 성분)

</div>


변환의 틀 $$a\,f(b(x - h)) + k$$에 넣으면 $$a = A$$, $$b = \omega$$, $$h = -\varphi/\omega$$, $$k = C$$다. 코사인파 $$A\cos(\omega t)$$도 위상이 $$\pi/2$$인 사인파 $$A\sin(\omega t + \pi/2)$$다.

같은 주파수의 사인파와 코사인파를 더하면 같은 주파수의 사인파 하나가 된다: $$a\sin\omega t + b\cos\omega t = \sqrt{a^2 + b^2}\,\sin(\omega t + \varphi)$$. 증명은 [삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/)의 덧셈정리로 한다. 예를 들어 $$3\sin\omega t + 4\cos\omega t = 5\sin(\omega t + 0.927)$$이다.

## 예제

**표본화와 에일리어싱.** 소리를 1초에 8,000번 재어(8 kHz 표본화) 저장한다. 7 kHz 사인파를 재면 무엇이 저장되는가?

1. *표본 쓰기:* $$n$$번째 표본은 $$t = n / 8000$$에서 잰 값 $$\sin\!\left(2\pi \cdot 7000 \cdot \frac{n}{8000}\right) = \sin\!\left(2\pi n \cdot \frac78\right)$$.
2. *한 바퀴 빼기:* $$\frac78 = 1 - \frac18$$이고 $$\sin(\theta - 2\pi n) = \sin\theta$$이므로 $$\sin\!\left(-2\pi n \cdot \frac18\right)$$.
3. *홀함수 쓰기:* $$\sin(-x) = -\sin x$$이므로 $$-\sin\!\left(2\pi \cdot 1000 \cdot \frac{n}{8000}\right)$$.
4. *해석:* 저장된 값은 1 kHz 사인파(부호만 반대)와 똑같다. 7 kHz는 1 kHz로 둔갑한다.

표본화 주파수의 절반보다 높은 주파수는 이렇게 낮은 주파수로 보인다(에일리어싱). 그래서 음성 전화처럼 8 kHz로 표본화하는 장치는 먼저 4 kHz보다 높은 성분을 걸러 낸다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/13_sinusoid_fig2.svg" alt="그림" width="707" height="291" loading="lazy">

회색 점이 8 kHz로 잰 값이다. 빠르게 떨리는 7 kHz 파형(파랑)과 느린 1 kHz 파형(주황)이 모든 점을 똑같이 지나서, 점만 보고는 둘을 가릴 수 없다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 440 Hz의 주기, 변환 계수 대응, 카드 C2의 값, 7 kHz와 1 kHz 표본 2,000개 일치, 합성 $$3\sin + 4\cos = 5\sin(\cdot + 0.927)$$ — [13_sinusoid_verify.py](/Hongs_Blog/studies/college-math/code/13_sinusoid_verify/)</div>

</div>


## 활용

- **소리와 음악.** 디지털 오디오는 사인파의 합으로 소리를 만들고 분석한다. 한 옥타브는 주파수 2배다.
- **통신.** [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)는 채널마다 다른 주파수의 사인파(반송파)에 신호를 싣는다.
- **빛과 파동.** [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)의 $$s(t) = A\sin(2\pi f t + \phi)$$가 이 문서의 사인파다.
- **애니메이션.** 버튼이 부드럽게 흔들리거나 숨 쉬듯 커졌다 작아지는 효과는 크기나 위치를 사인파로 바꿔서 만든다.

## 연결

- 선수: [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/), [함수의 변환과 합성](/Hongs_Blog/studies/college-math/function-transformation/)
- 이어지는 개념: [삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/)(사인파의 합과 곱), 미분적분학의 [푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/)·[푸리에 변환](/Hongs_Blog/studies/calculus/fourier-transform/)
- 복소수로 쓰면 $$A e^{i(\omega t + \varphi)}$$의 허수부다. [오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)에서 이어진다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 사인파 A sin(2πft + φ) + C의 네 수 A, f, φ, C가 각각 무엇을 정하는지 쓰고, 주기와 각주파수를 f로 나타내라.</summary>

**답:** $$A$$는 진폭(흔들림의 크기), $$f$$는 주파수(1초당 반복 횟수), $$\varphi$$는 위상(출발 각), $$C$$는 가운데 값이다. 주기 $$T = 1/f$$, 각주파수 $$\omega = 2\pi f$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** s(t) = 3 sin(100πt − π/2)의 진폭, 주파수, 주기를 구하고, t = 0에서 그래프가 어디서 출발하는지 쓰라.</summary>

**답:** 진폭 3, $$\omega = 100\pi$$이므로 $$f = 50$$ Hz, 주기 $$20$$ ms. $$s(0) = 3\sin(-\pi/2) = -3$$이라 가장 낮은 곳에서 출발한다.

**흔한 오답:** 주파수를 $$100\pi$$나 $$100$$으로 쓰는 것. $$\omega = 2\pi f$$에서 $$2\pi$$로 나눠야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 8 kHz로 표본화하면 7 kHz 사인파가 1 kHz 사인파처럼 보이는 이유를 삼각함수의 성질로 설명하라.</summary>

**답:** 표본은 $$\sin(2\pi n \cdot 7/8)$$이다. 주기성으로 $$2\pi n$$을 빼면 $$\sin(-2\pi n/8)$$이고, 사인이 홀함수라 $$-\sin(2\pi n / 8)$$이다. 이것은 1 kHz 사인파의 표본에 $$-1$$을 곱한 것이라 표본만으로는 두 신호를 구별할 수 없다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 6.1절 "Graphs of the Sine and Cosine Functions"(진폭, 주기, 위상 이동), 7.6절 "Modeling with Trigonometric Functions"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 표본화 주파수의 절반보다 높은 성분이 낮은 주파수로 겹친다는 것은 표본화 정리(나이퀴스트-섀넌)의 내용이다. 전화 음성의 8 kHz 표본화는 PCM 음성 부호화의 표준 값이다. 이 문서의 예제는 삼각함수의 주기성과 홀함수 성질만으로 한 경우를 보였다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 두 장은 원본에 없다. [13_sinusoid_plot.py](/Hongs_Blog/studies/college-math/code/13_sinusoid_plot/)로 그렸고, 그림에 쓴 값(주기 $$1/440$$초 ≈ 2.27 ms, 위상 $$\pi/2$$가 $$1/1760$$초 앞섬, 7 kHz와 −1 kHz 사인파의 표본 2,000개 일치)을 같은 코드로 확인했다.
{% endraw %}
