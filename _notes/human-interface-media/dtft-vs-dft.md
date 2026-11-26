---
layout: "note"
title: "이산 시간 푸리에 변환과 이산 푸리에 변환 비교"
display_title: "이산 시간 푸리에 변환과 이산 푸리에 변환 비교"
kind: "concept"
kind_label: "비교"
num: "66"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["DTFT vs DFT", "DTFT와 DFT 비교", "이산 시간 푸리에 변환과 DFT", "영 채우기", "Zero Padding", "순환 합성곱", "Circular Convolution", "시간 영역 에일리어싱", "Time-Domain Aliasing", "주파수 해상도", "Frequency Resolution", "괴르첼 알고리즘", "Goertzel Algorithm"]
description: "두 변환은 같은 수열의 스펙트럼을 두 가지 방식으로 적는다. 이산 시간 푸리에 변환(DTFT)은 주파수 축 전체에 이어진 곡선을 준다. 이산 푸리에 변환(DFT)은 그 곡선 위의 점 N개를 준다. 식을 세우고 성질을 따질 때는 DTFT를 쓰고, 컴퓨터로 실제 숫자를 얻을 때는 DF…"
prev_url: "/studies/human-interface-media/mpeg-audio/"
prev_title: "MPEG 오디오 부호화"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "66_dtft-vs-dft_plot.py", "u": "/studies/human-interface-media/code/66_dtft-vs-dft_plot/", "r": "그림 생성"}, {"t": "66_dtft-vs-dft_verify.py", "u": "/studies/human-interface-media/code/66_dtft-vs-dft_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/dtft-vs-dft/"
---
{% raw %}
두 변환은 같은 수열의 스펙트럼을 두 가지 방식으로 적는다. [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/)(DTFT)은 주파수 축 전체에 이어진 곡선을 준다. [이산 푸리에 변환](/Hongs_Blog/studies/linear-algebra/dft/)(DFT)은 그 곡선 위의 점 $$N$$개를 준다. 식을 세우고 성질을 따질 때는 DTFT를 쓰고, 컴퓨터로 실제 숫자를 얻을 때는 DFT를 쓴다. 헷갈리기 쉬운 곳은 점 $$N$$개만 볼 때 생기는 일이다. 점 사이를 보지 못하고, 잘라 낸 조각이 계속 되풀이된다고 여기고, 두 스펙트럼을 곱한 결과의 뜻이 달라진다[^s1].

## 어느 쪽일까

상황마다 DTFT와 DFT 가운데 무엇을 쓰는지 고르고, 다른 쪽은 왜 안 되는지 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) $$x[n] = 0.5^n u[n]$$의 스펙트럼을 식으로 쓰라 (b) 1초 동안 녹음한 44,100개 샘플에 어떤 주파수가 들어 있는지 파이썬으로 구하라</summary>


**답:** (a) DTFT. 수열이 끝없이 이어져서 DFT가 요구하는 "길이 $$N$$"이 없다. DTFT는 등비급수를 더해 $$X(e^{j\omega}) = \frac{1}{1 - 0.5e^{-j\omega}}$$라는 닫힌 식이 된다. (b) DFT. 데이터가 숫자 44,100개라 유한하고, FFT로 금방 계산된다. 결과 $$X[k]$$는 그 1초 조각의 DTFT 곡선을 $$\omega = \frac{2\pi k}{44100}$$에서 찍은 값이고, 소리의 주파수로는 1 Hz 간격이다.<br>
**흔한 오답:** (a)에 DFT를 쓰려고 앞의 8개만 잘라 계산하는 것. 잘라 낸 뒷부분이 빠져서 다른 수열의 스펙트럼이 된다. $$\omega = 1$$에서 닫힌 식과 약 0.005 차이 난다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 5점 이동 평균 필터 $$h[n] = \frac15$$ ($$0 \le n \le 4$$)가 완전히 지워 버리는 주파수를 찾으라 (d) 길이 8인 두 수열의 합성곱을 FFT로 빨리 구하라</summary>


**답:** (c) DTFT. 크기는 $$\left\lvert\frac{\sin(5\omega/2)}{5\sin(\omega/2)}\right\rvert$$이고 $$\omega = \frac{2\pi}{5}, \frac{4\pi}{5}$$에서 정확히 0이다. 8점 DFT로 찍으면 점이 $$\frac{\pi}{4}$$ 간격이라 이 자리를 지나친다. 가장 작은 값도 약 0.083이어서 "완전히 지워지는 주파수는 없다"고 잘못 읽게 된다. (d) DFT. 단, 두 수열 끝에 0을 채워 길이를 $$8 + 8 - 1 = 15$$ 이상(FFT라면 16)으로 늘린 뒤 곱한다. 길이 8 그대로 곱하면 뒤로 넘친 값이 앞으로 접혀 더해진 결과(순환 합성곱)가 나온다.<br>
**이유:** DTFT끼리 곱하면 보통의 합성곱이다([컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/)). DFT는 조각이 주기 $$N$$으로 되풀이된다고 보기 때문에, DFT끼리 곱하면 둘레가 $$N$$인 원 위에서 돌린 합성곱이 된다. 예: $$(1, 2, 3)$$과 $$(1, 1, 1)$$의 합성곱은 $$(1, 3, 6, 5, 3)$$인데, $$N = 3$$으로 곱하면 $$(6, 6, 6)$$이 나온다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> "0을 충분히 많이 채우면 DFT로 1000 Hz와 1010 Hz를 갈라 볼 수 있다." 1초에 8000번 재서 0.01초(80샘플)만 모은 소리라면 이 말이 맞는가? 틀리면 무엇을 바꿔야 하는가?</summary>


**답:** 틀린다. 0을 채우면 같은 DTFT 곡선 위의 점이 촘촘해질 뿐이다. 곡선 모양은 실제로 잰 80샘플이 정한다. 80샘플이면 봉우리 폭이 대략 $$f_s/L = 8000/80 = 100$$ Hz라서, 10 Hz 떨어진 두 성분은 봉우리 하나로 합쳐진다. 가르려면 더 오래 재야 한다. 필요한 길이는 대략 $$f_s/\Delta f = 8000/10 = 800$$샘플(0.1초)이고, 이보다 넉넉히 1600샘플(0.2초)을 모으면 1000 Hz와 1010 Hz 자리에 봉우리가 따로 선다.<br>
**흔한 오답:** "점이 많아졌으니 해상도가 좋아졌다." 점이 많아져도 곡선 자체는 그대로다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> $$x = (1, 2, 3)$$의 DTFT를 $$\omega = 0, \pi$$ 두 점에서만 찍어 길이 2 DFT로 보고 역DFT를 하면 무엇이 나오는가? 원래 수열을 되살리려면 점이 최소 몇 개 있어야 하는가?</summary>


**답:** 찍은 값은 $$X(e^{j0}) = 1 + 2 + 3 = 6$$, $$X(e^{j\pi}) = 1 - 2 + 3 = 2$$이다. 역DFT는 $$\frac{6 + 2}{2} = 4$$, $$\frac{6 - 2}{2} = 2$$라서 $$(4, 2)$$다. 맨 뒤의 3이 둘레 2인 원을 돌아 맨 앞의 1에 더해졌다. 점이 수열 길이와 같은 3개 이상이어야 원래 수열이 돌아온다.<br>
**이유:** 주파수 쪽에서 점 $$N$$개만 찍으면, 시간 쪽에서는 수열을 주기 $$N$$으로 되풀이해 겹친 것을 보게 된다. 수열이 $$N$$보다 길면 복사본끼리 겹쳐 더해진다(시간 영역 에일리어싱).

</details>

## 결정적 차이

| 묻는 것 | 이산 시간 푸리에 변환 (DTFT) | 이산 푸리에 변환 (DFT) |
|---|---|---|
| 수열의 길이 | 끝없이 길어도 된다. 값이 충분히 빨리 0으로 줄면 변환이 있다 | 유한한 $$N$$개. 더 긴 수열은 잘라야 하고, 잘라 낸 부분은 결과에 없다 |
| 주파수를 보는 곳 | 모든 $$\omega$$ | $$\omega = \frac{2\pi k}{N}$$의 점 $$N$$개. 점 사이의 0이나 봉우리를 놓칠 수 있다 |
| 수열 바깥 | 0으로 본다 | 조각이 주기 $$N$$으로 되풀이된다고 본다. 처음과 끝이 이어지지 않으면 한 성분이 여러 칸으로 퍼진다 |
| 두 스펙트럼을 곱하면 | 보통의 합성곱 | 순환 합성곱. 길이를 $$L_1 + L_2 - 1$$ 이상으로 0을 채워야 보통의 합성곱과 같다 |
| 가까운 두 주파수 가르기 | 실제로 잰 샘플 수 $$L$$이 정한다 | 0을 채워도 나아지지 않는다. 더 오래 재야 한다 |
| 얻는 것 | 식. 성질을 따지고 필터를 설계한다 | 숫자. FFT로 $$N\log N$$ 정도의 계산 |

두 변환을 잇는 식은 하나다. 수열이 $$0 \le n \le L - 1$$ 밖에서 0이고 $$N \ge L$$이면 DFT 값은 DTFT를 $$\frac{2\pi k}{N}$$에서 찍은 값과 같다.

$$X[k] = X(e^{j2\pi k/N}), \qquad k = 0, 1, \dots, N - 1$$


여기서 $$X[k]$$는 DFT의 $$k$$번째 값, $$X(e^{j\omega})$$는 DTFT 곡선이다. 0을 채워 $$N$$을 키우면 같은 곡선을 더 촘촘히 찍는다. $$N < L$$이면 시간 쪽에서 수열이 겹쳐 더해져서 이 식이 깨진다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/66_dtft-vs-dft_fig1.svg" alt="그림" width="602" height="335" loading="lazy">

회색 곡선이 $$x = (1, 2, 3, 4)$$의 DTFT 크기다. 주황 네모 4개는 길이 4 DFT로, $$0, \frac\pi2, \pi, \frac{3\pi}{2}$$에서 곡선을 찍었다. 파랑 동그라미 16개는 끝에 0을 12개 채워 16점으로 찍은 것이다. 점만 늘었고 곡선은 그대로다. 네모 4개만 보면 $$\frac{3\pi}{4}$$ 근처의 작은 언덕을 알 수 없다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/66_dtft-vs-dft_fig2.svg" alt="그림" width="618" height="445" loading="lazy">

0.20과 0.22 사이클/샘플인 두 코사인을 더한 신호다. 위아래 모두 0을 충분히 채워 곡선 전체를 그렸다. 위(24샘플)는 봉우리가 하나뿐이고 두 점선 사이에 선다. 아래(128샘플)는 두 점선 자리에 봉우리가 따로 선다. 두 주파수의 간격 0.02의 역수인 50샘플보다 확실히 길어야 갈라진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: DFT가 DTFT의 표본(4·8·16점), 0을 채우기 전후의 DTFT 일치, 선형 합성곱 $$(1, 3, 6, 5, 3)$$과 순환 합성곱($$N = 3, 4, 5$$), 시간 쪽 겹침 $$(4, 2)$$, 5점 이동 평균의 0과 8점 DFT의 최솟값 0.083, 24·128샘플의 봉우리 개수, 1000·1010 Hz의 80·1600샘플 봉우리, $$0.5^n u[n]$$을 8개로 자른 오차 0.0046 (실험으로 확인됨) — [66_dtft-vs-dft_verify.py](/Hongs_Blog/studies/human-interface-media/code/66_dtft-vs-dft_verify/), [66_dtft-vs-dft_plot.py](/Hongs_Blog/studies/human-interface-media/code/66_dtft-vs-dft_plot/)</div>

</div>


## 둘 다 아닐 때

- **되풀이되는 수열의 계수가 목표일 때.** [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/)를 쓴다. 한 주기 $$N$$개를 정확히 DFT하면 계수의 $$N$$배 $$Na_k$$가 나온다. 한 주기가 아닌 길이를 넣으면 이음매 때문에 엉뚱한 칸에도 값이 생긴다([푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/)).
- **시간에 따라 바뀌는 소리.** 전체를 한 번에 변환하면 언제 어떤 소리가 났는지 사라진다. 짧게 잘라 조각마다 DFT를 하고, 그 결과를 시간 순으로 늘어놓은 [스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/)을 쓴다.
- **표본화하기 전 연속 신호의 스펙트럼.** 그것은 [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/) $$X_c(j\Omega)$$다. 간격 $$T$$로 잰 수열의 DTFT는 이 스펙트럼을 $$2\pi$$마다 복사해 더한 것이다: $$X(e^{j\omega}) = \frac1T\sum_{k}X_c\!\left(j\frac{\omega - 2\pi k}{T}\right)$$. 복사본이 겹치지 않을 조건이 [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)다[^s3].
- **주파수 몇 개만 필요할 때.** 전화 버튼 소리처럼 정해진 주파수 몇 개만 확인하면 되는 경우, DFT 칸 하나를 따로 계산하는 괴르첼(Goertzel) 알고리즘을 쓴다. 칸 하나에 곱셈이 $$N$$번 정도라서, 칸이 몇 개뿐이면 FFT 전체보다 싸다[^s3].

[^s1]: 두 변환을 잇는 식, 순환 합성곱, 0 채우기와 해상도, 시간 쪽 겹침은 Oppenheim·Schafer, *Discrete-Time Signal Processing* 3판 8장의 표준 내용이다. 문서와 카드의 수치는 검증 코드로 확인했다.
[^s2]: [66_dtft-vs-dft_plot.py](/Hongs_Blog/studies/human-interface-media/code/66_dtft-vs-dft_plot/)로 그렸고, 같은 코드로 DFT 점이 곡선 위에 놓이는 것, 24샘플의 봉우리 1개(0.21 근처), 128샘플의 봉우리 2개(0.20, 0.22)를 확인했다.
[^s3]: 표본화한 수열의 DTFT가 연속 스펙트럼의 복사본 합이라는 식과 괴르첼 알고리즘은 Oppenheim·Schafer, *Discrete-Time Signal Processing* 3판 4장과 9장의 표준 내용이다.
{% endraw %}
