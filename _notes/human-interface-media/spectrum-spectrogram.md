---
layout: "note"
title: "스펙트럼과 스펙트로그램"
display_title: "스펙트럼과 스펙트로그램 (Spectrum and Spectrogram)"
kind: "concept"
kind_label: "정의"
num: "56"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Spectrum", "Spectrogram", "스펙트럼", "스펙트로그램", "선 스펙트럼", "line spectrum", "불연속 스펙트럼", "discrete spectrum", "이어진 스펙트럼", "continuous spectrum", "연속 스펙트럼", "단시간 푸리에 변환", "short-time Fourier transform", "STFT", "창", "window", "시간-주파수 해상도"]
description: "소리를 \"어떤 높이의 소리가 얼마나 세게 섞였나\"라는 목록으로 적은 것이 스펙트럼이다. 같은 모양이 되풀이되는 소리는 띄엄띄엄 몇 개의 높이만 갖고, 한 번 지나가고 마는 소리는 높이가 끊김 없이 이어진다. 소리는 시간에 따라 바뀌므로, 짧은 토막마다 스펙트럼을 구해 시간 순서로 …"
prev_url: "/studies/human-interface-media/psychoacoustic-model/"
prev_title: "심리음향 모델"
next_url: "/studies/human-interface-media/real-signal-real-spectrum/"
next_title: "실수 신호와 실수 스펙트럼"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "56_spectrum-spectrogram_plot.py", "u": "/studies/human-interface-media/code/56_spectrum-spectrogram_plot/", "r": "그림 생성"}, {"t": "56_spectrum-spectrogram_verify.py", "u": "/studies/human-interface-media/code/56_spectrum-spectrogram_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/spectrum-spectrogram/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소리를 "어떤 높이의 소리가 얼마나 세게 섞였나"라는 목록으로 적은 것이 스펙트럼이다. 같은 모양이 되풀이되는 소리는 띄엄띄엄 몇 개의 높이만 갖고, 한 번 지나가고 마는 소리는 높이가 끊김 없이 이어진다. 소리는 시간에 따라 바뀌므로, 짧은 토막마다 스펙트럼을 구해 시간 순서로 늘어놓은 그림(스펙트로그램)으로 본다. 토막을 짧게 자르면 언제인지는 정확하지만 높이가 흐려지고, 길게 자르면 그 반대다.

</div>


## 예시로 보기

마이크가 잡는 것은 시간에 따라 오르내리는 압력 한 줄이다. 이 한 줄만 보고는 그 안에 어떤 높이의 소리들이 섞였는지 알기 어렵다. 그런데 귀는 이것을 저절로 해낸다. 달팽이관의 기저막은 주파수마다 가장 크게 흔들리는 자리가 달라서, 압력의 흔들림을 "어느 자리가 얼마나 흔들리나", 곧 주파수별 세기로 바꾼다. 뇌는 이 주파수별 세기가 시간에 따라 어떻게 바뀌는지로 소리를 구별한다. 그래서 컴퓨터가 청각을 흉내 내려면 소리를 먼저 스펙트럼으로 바꿔야 한다.

440, 880, 1,320 Hz 순음 셋을 더한 소리(복합음)를 보자. 세 순음의 진폭을 1, 0.5, 0.3으로 두면, 더한 파형은 뾰족한 봉우리가 1/440초(약 2.27 ms)마다 되풀이되는 복잡한 모양이다. 기저막에서는 이 소리가 세 자리를 따로 흔든다. 스펙트럼으로 적으면 이렇게 짧다[^s1].

| 주파수 | 440 Hz | 880 Hz | 1,320 Hz | 그 밖 |
|---|---|---|---|---|
| 진폭 | 1 | 0.5 | 0.3 | 0 |

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/56_spectrum-spectrogram_fig1.svg" alt="그림" width="698" height="487" loading="lazy">

위 줄 왼쪽은 이 복합음의 파형이고, 칠한 칸이 한 주기다. 위 줄 오른쪽은 그 스펙트럼으로, 막대가 ±440, ±880, ±1,320 Hz에만 서고 나머지는 모두 0이다. 아래 줄 왼쪽은 2 ms 동안만 "딸깍" 하고 마는 소리이고, 오른쪽은 그 스펙트럼이다. 막대 대신 0 Hz에서 가장 높은 곡선이 끊김 없이 이어지고, 500 Hz의 배수마다 0으로 내려앉는다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**스펙트럼**은 신호를 여러 주파수의 사인파(복소 지수)로 나눴을 때, 주파수마다 그 성분의 크기와 위상을 적은 함수다. 주기가 $$T$$인 소리는 기본 주파수 $$f_0 = 1/T$$의 정수배 성분만 가지므로 스펙트럼이 그 주파수들에만 띄엄띄엄 선다(**선 스펙트럼**, 불연속 스펙트럼). 주기가 없는 소리는 모든 주파수에 성분이 있을 수 있어 스펙트럼이 이어진 곡선이 된다(**이어진 스펙트럼**, 연속 스펙트럼).

**기호로 쓰면.** 주기 $$T$$, 기본 각주파수 $$\omega_0 = 2\pi/T$$인 주기 신호 $$x(t)$$는 푸리에 급수로 나뉜다($$j$$는 허수 단위로, [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)의 $$i$$와 같다).

$$ x(t) = \sum_{k=-\infty}^{+\infty} a_k\, e^{jk\omega_0 t}, \qquad a_k = \frac{1}{T}\int_T x(t)\, e^{-jk\omega_0 t}\, dt $$

- $$a_k$$: 주파수 $$k f_0$$ 성분의 복소 계수. 크기 $$\vert a_k\vert $$가 그 성분의 진폭, 각도가 위상이다.
- $$\vert a_k\vert ^2$$: 그 성분이 가진 평균 전력. 모두 더하면 신호의 평균 전력이다: $$\frac{1}{T}\int_T \vert x(t)\vert ^2 dt = \sum_k \vert a_k\vert ^2$$.
- 주기가 없는 신호는 푸리에 변환 $$X(f) = \int_{-\infty}^{\infty} x(t)\, e^{-j2\pi f t}\, dt$$로 이어진 스펙트럼을 얻는다([연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/))[^s2].

</div>


예시의 복합음에 넣어 보면, $$\cos\theta = (e^{j\theta} + e^{-j\theta})/2$$라서 진폭 1인 440 Hz 코사인은 $$a_{\pm1} = 0.5$$ 두 개로 나뉜다. 마찬가지로 $$a_{\pm2} = 0.25$$, $$a_{\pm3} = 0.15$$이고 나머지 $$a_k$$는 0이다. 그림 1의 막대가 양쪽에 대칭으로 서고 높이가 진폭의 절반인 이유다. 평균 전력은 $$2(0.5^2 + 0.25^2 + 0.15^2) = 0.67$$로, 파형을 직접 제곱해 평균 낸 $$(1^2 + 0.5^2 + 0.3^2)/2 = 0.67$$과 같다[^s2]. 실수 신호에서 양쪽 막대가 늘 짝을 이루는 이유는 [실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/)에서 다룬다.

딸깍 소리처럼 높이 1, 길이 $$\tau$$인 펄스는 $$\vert X(f)\vert  = \tau\,\left\vert \frac{\sin(\pi f \tau)}{\pi f \tau}\right\vert $$다. $$\tau = 2$$ ms면 0 Hz에서 0.002이고, $$f\tau$$가 정수인 500, 1,000, 1,500 Hz에서 0이 된다[^s2].


### 스펙트로그램

소리는 시간에 따라 바뀐다. 말소리의 모음은 수십 ms마다 바뀌고, 새소리는 높이가 미끄러지듯 오르내린다. 소리 전체를 한 번에 스펙트럼으로 바꾸면 "언제" 어떤 높이가 있었는지가 사라진다. 그래서 소리를 짧은 토막(창, window)으로 잘라 토막마다 스펙트럼을 구하고, 가로축 시간·세로축 주파수·밝기 세기로 늘어놓는다. 이 그림이 **스펙트로그램**이고, 토막마다 하는 푸리에 변환을 단시간 푸리에 변환이라 부른다[^s3].

$$
S(t, f) = \left| \int x(\tau)\, w(\tau - t)\, e^{-j2\pi f \tau}\, d\tau \right|^2
$$


$$w$$는 길이 $$T_w$$인 창 함수(시각 $$t$$ 근처만 남기고 나머지를 0으로 만드는 함수)다. 창 길이 $$T_w$$ 동안만 보면 주파수는 대략 $$1/T_w$$ 간격으로만 가를 수 있다. 25 ms 창이면 40 Hz, 4 ms 창이면 250 Hz다. 창을 길게 하면 주파수는 촘촘해지지만, 그 긴 시간 안에서 언제 일이 일어났는지는 흐려진다. 둘을 한꺼번에 좋게 할 수는 없다[^s3].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/56_spectrum-spectrogram_fig2.svg" alt="그림" width="725" height="333" loading="lazy">

같은 소리(0~0.5초 복합음, 0.56초 딸깍, 0.65초부터 300 Hz에서 3,000 Hz로 오르는 처프)를 두 창으로 그렸다. 왼쪽 4 ms 창에서는 딸깍이 가는 세로선으로 정확히 찍히지만, 복합음의 세 높이는 0~1,800 Hz의 굵은 띠로 뭉개진다. 오른쪽 64 ms 창에서는 복합음이 440, 880, 1,320 Hz 가로선 셋으로 또렷이 갈리지만, 딸깍은 폭이 수십 ms인 세로 띠로 번진다. 처프는 두 그림 모두 오른쪽 위로 오르는 비스듬한 선이다[^s4].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 복합음의 푸리에 계수(0.5, 0.25, 0.15, 나머지 0)와 평균 전력 0.67, 2 ms 펄스의 $$\vert X(0)\vert  = 0.002$$와 500 Hz 배수의 0, 창 25 ms의 주파수 간격 40 Hz, 440·460 Hz 두 음이 25 ms 창에서는 한 봉우리·50 ms 창부터 두 봉우리, 거꾸로 튼 소리의 스펙트럼 크기가 같음 (수치 계산으로 확인됨) — [56_spectrum-spectrogram_verify.py](/Hongs_Blog/studies/human-interface-media/code/56_spectrum-spectrogram_verify/)</div>

</div>


## 활용

- **소리 압축.** [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)은 짧은 토막마다 스펙트럼을 구해 들리는 성분을 고른다. 토막 길이를 고르는 것이 곧 창 길이의 맞바꿈 문제다. 소리가 갑자기 커지는 곳에서 짧은 토막으로 바꾸는 것도 이 때문이다([시간 가림](/Hongs_Blog/studies/human-interface-media/temporal-masking/)).
- **컴퓨터로 계산하기.** 실제로는 표본으로 바꾼 소리에 이산 푸리에 변환(DFT)을 빠른 방법(FFT)으로 계산한다: [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/), [푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/). 표본화율 $$f_s$$에서 $$N$$개 표본을 한 토막으로 쓰면 주파수 간격은 $$f_s/N = 1/T_w$$다. 16 kHz에서 400개면 25 ms, 40 Hz 간격이다[^s3].
- **음색 보기.** 같은 높이의 음이라도 악기마다 고조파의 세기와, 그 세기가 시작부터 끝까지 바뀌는 모양이 다르다. 스펙트로그램에는 둘이 한꺼번에 보인다: [음색](/Hongs_Blog/studies/human-interface-media/timbre/).
- 음성 인식, 새소리·기계 소리 분석, 오디오 편집 프로그램의 주파수 보기 화면이 모두 스펙트로그램을 쓴다[^s3].

## 연결

- 선수: [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/) (기본 주파수의 정수배 성분), [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/) (귀가 하는 스펙트럼 분석), [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/) ($$e^{j\theta}$$)
- 수학적 바탕(다른 과목): [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/) (선 스펙트럼), [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/) (이어진 스펙트럼)
- 다음: [실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/), [푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"스펙트럼의 크기가 같으면 같은 소리로 들린다"</div>

틀렸다. 스펙트럼이 소리 속의 높이를 모두 담으니 소리 전체를 담은 것처럼 보인다. 그러나 크기만 적은 스펙트럼에는 위상과 "언제"가 빠져 있다. 피아노 한 음을 거꾸로 틀면 세게 쳤다가 사라지는 소리가 서서히 커지다 뚝 끊기는 소리로 바뀌어 전혀 다르게 들리는데, 소리 전체의 스펙트럼 크기는 똑같다. 확인 방법: 뚝 쳤다가 사라지는 440 Hz 소리와 그것을 거꾸로 한 소리의 DFT 크기를 계산하면 모든 주파수에서 같다(verify 코드). 둘을 가르려면 스펙트로그램처럼 시간에 따른 변화를 봐야 한다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 주기가 5 ms인 소리를 푸리에 급수로 나누면 스펙트럼 선이 어느 주파수들에 서는가? 1.1 kHz에 선이 설 수 있는가?</summary>


**답:** 기본 주파수 $$f_0 = 1/0.005 = 200$$ Hz의 정수배(0, ±200, ±400, ±600, … Hz)에만 선다. 1.1 kHz는 200 Hz의 정수배가 아니므로(5.5배) 선이 설 수 없다. 1.2 kHz(6배)에는 설 수 있다.<br>
**흔한 오답:** "주기 5 ms니까 5 Hz 간격"으로 쓰는 것. 간격은 주기의 역수다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 16 kHz로 표본화한 소리를 25 ms 창으로 잘라 스펙트로그램을 만든다. 한 창의 표본 수와 주파수 간격은? 440 Hz와 460 Hz 두 음을 따로 볼 수 있는가?</summary>


**답:** 표본 수 $$16{,}000 \times 0.025 = 400$$개, 주파수 간격 $$1/0.025 = 40$$ Hz다. 두 음은 20 Hz 차이라 40 Hz 간격으로는 가를 수 없고 한 봉우리로 보인다. 간격이 20 Hz보다 촘촘해지려면 창이 적어도 $$1/20 = 50$$ ms는 되어야 한다.<br>
**이유:** 창 길이 $$T_w$$ 동안만 보면 $$1/T_w$$보다 가까운 두 주파수는 구별되지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 바이올린이 한 음을 길게 켜는 소리(가운데 부분)와 문이 "쾅" 닫히는 소리 가운데 어느 쪽이 선 스펙트럼에 가까운가? 이유를 쓰라.</summary>


**답:** 바이올린 소리다. 길게 켜는 동안 파형이 거의 같은 모양으로 되풀이되므로(주기 소리), 기본 주파수와 그 정수배에만 성분이 있는 선 스펙트럼이 된다. "쾅"은 한 번 짧게 생겼다 사라지는 소리라 되풀이되는 주기가 없어, 넓은 주파수에 걸쳐 이어진 스펙트럼이 된다.<br>
**흔한 오답:** "쾅 소리는 크니까 선이 크게 선다." 선이냐 이어졌느냐는 소리가 되풀이되느냐로 정해지고, 크기와는 상관없다.

</details>

[^s1]: 세 고조파의 진폭 1, 0.5, 0.3과 2 ms 딸깍 소리는 설명을 위해 정한 값이다. 그림 1장은 [56_spectrum-spectrogram_plot.py](/Hongs_Blog/studies/human-interface-media/code/56_spectrum-spectrogram_plot/)로 그렸고, 계수 값을 같은 코드에서 FFT로 확인했다.
[^s2]: 계수의 크기·위상 해석, 파스발 관계, 주기 없는 신호의 푸리에 변환과 사각 펄스의 스펙트럼은 신호 처리 교재(예: Oppenheim & Willsky, *Signals and Systems*)의 표준 내용이다. 예시의 계수와 전력 0.67, 펄스 스펙트럼의 값은 56_spectrum-spectrogram_verify.py로 수치 적분해 확인했다.
[^s3]: 디지털 신호 처리 교재의 표준 내용이다. "$$1/T_w$$보다 가까운 두 주파수는 가를 수 없다"는 어림 규칙이고, 실제 경계는 창의 모양에 따라 조금 다르다(verify 코드에서 사각 창 50 ms일 때 440·460 Hz가 약 436·464 Hz의 두 봉우리로 갈리기 시작한다).
[^s4]: 16 kHz로 합성한 소리를 해닝 창 4 ms와 64 ms, 2 ms 간격으로 계산해 56_spectrum-spectrogram_plot.py로 그렸다. 64 ms 창에서 세 가로선이 20 dB 넘게 갈리는 것과 4 ms 창에서 440과 660 Hz의 차이가 6 dB도 안 되는 것을 같은 코드에서 확인했다. 복합음과 처프의 앞뒤 10 ms는 부드럽게 키우고 줄였다.
{% endraw %}
