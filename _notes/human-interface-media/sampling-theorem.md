---
layout: "note"
title: "표본화 정리"
display_title: "표본화 정리 (Sampling Theorem)"
kind: "concept"
kind_label: "정리"
num: "61"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Sampling Theorem", "샘플링 정리", "나이퀴스트 표본화 정리", "Nyquist Sampling Theorem", "나이퀴스트 비율", "Nyquist Rate", "나이퀴스트 주파수", "Nyquist Frequency", "표본화율", "Sampling Rate", "임펄스열 표본화", "Impulse-Train Sampling", "대역 제한 신호", "Band-Limited Signal", "저역 통과 필터", "Low-Pass Filter", "sinc 보간", "Band-Limited Interpolation", "디지털 인지 시스템", "시간 불연속", "Time Discrete"]
description: "연속으로 흐르는 소리를 컴퓨터에 담으려면 일정한 간격으로 값을 재서 숫자 줄로 만든다(표본화). 소리에 든 가장 빠른 떨림(최고 주파수)보다 두 배 넘게 자주 재면, 잰 값만으로 사이사이의 값까지 원래 소리를 그대로 되살릴 수 있다. 재는 순간 \"어떤 빠르기의 떨림이 얼마나 들었나…"
prev_url: "/studies/human-interface-media/four-fourier-representations/"
prev_title: "푸리에 표현 네 가지 비교"
next_url: "/studies/human-interface-media/aliasing/"
next_title: "에일리어싱"
math: true
mermaid: true
code_count: 2
code_files: [{"t": "61_sampling-theorem_plot.py", "u": "/studies/human-interface-media/code/61_sampling-theorem_plot/", "r": "그림 생성"}, {"t": "61_sampling-theorem_verify.py", "u": "/studies/human-interface-media/code/61_sampling-theorem_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/sampling-theorem/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

연속으로 흐르는 소리를 컴퓨터에 담으려면 일정한 간격으로 값을 재서 숫자 줄로 만든다(표본화). 소리에 든 가장 빠른 떨림(최고 주파수)보다 두 배 넘게 자주 재면, 잰 값만으로 사이사이의 값까지 원래 소리를 그대로 되살릴 수 있다. 재는 순간 "어떤 빠르기의 떨림이 얼마나 들었나"를 그린 그림이 일정한 간격으로 여러 벌 복사되므로, 되살릴 때는 원래 한 벌만 남기고 나머지를 걸러 낸다. 단, 소리에 넘지 않는 최고 주파수가 있어야 하고, 두 배보다 드물게 재면 복사본끼리 겹쳐 다른 소리로 바뀐다.

</div>


## 예시로 보기

마이크가 내는 전압은 매 순간 값이 있다. 1초 안에도 순간은 끝없이 많아서 다 적을 수 없다. 그래서 컴퓨터는 일정한 간격으로 값을 한 번씩만 읽는다. 그러면 읽지 않은 사이의 값은 영영 잃어버린 걸까?

1000 Hz 사인파(1초에 1000번 떨림)를 1초에 8000번 재면, 한 번 떨리는 동안 점이 8개 찍힌다. 이 점들을 모두 지나는 사인파 가운데 4000 Hz보다 느린 것은 1000 Hz 하나뿐이다. 그래서 점만 보고도 원래 곡선을 다시 그릴 수 있다. 1초에 1500번만 재면 사정이 다르다. 같은 점들이 500 Hz 사인파 위에도 놓여서 둘 중 어느 쪽인지 가를 수 없다. 이 둔갑이 [에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)이다[^s3].

**사람과 컴퓨터.** 사람과 컴퓨터가 소리를 알아듣는 과정을 나란히 놓으면 표본화가 어디서 일어나는지 보인다.

| 단계 | 사람 | 컴퓨터 |
|---|---|---|
| 자극을 받아들인다 | 감각기관(귀, 눈) | 변환기(마이크처럼 소리를 전기 신호로 바꾸고 숫자로 바꾸는 장치) |
| 처리한다 | 뇌 | 프로세서 |
| 내놓는다 | 인식 결과 | 인식 결과 |

컴퓨터 쪽 변환기에서 신호가 디지털이 된다. 디지털로 바꾸는 일은 두 번 끊는 일이다. 시간을 띄엄띄엄 끊어 그 순간의 값만 남기는 일이 표본화이고, 그 결과 시간이 띄엄띄엄 떨어진 신호(시간 불연속 신호)가 된다. 남긴 값을 정해 둔 몇 단계 중 하나로 반올림하는 일이 양자화다. 프로세서는 이렇게 얻은 숫자에서 어떤 주파수가 얼마나 들었는지(스펙트럼)를 계산해 쓴다.

디지털 오디오의 기본 방식인 PCM(펄스 부호 변조)은 이 일을 세 단계로 한다.

```mermaid
flowchart LR
  A["아날로그 신호"] --> S["표본화: 간격 T마다 값 읽기"]
  S --> P["띄엄띄엄한 펄스 열 (PAM 신호)"]
  P --> Q["양자화: 정해 둔 단계로 반올림"]
  Q --> E["부호화: 단계 번호를 2진수로"]
  E --> D["디지털 데이터 11…1100"]
```

왼쪽에서 오른쪽으로 신호가 지나가며 시간이 끊기고, 값이 끊기고, 마지막에 0과 1의 줄이 된다. 첫 단계에서 아무것도 잃지 않으려면 얼마나 자주 재야 하는지가 표본화 정리의 내용이다. 값을 끊는 쪽은 [양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)에서, 통신에서 쓰는 모습은 [PCM](/Hongs_Blog/studies/computer-communication/pcm/)에서 이어진다[^s2].

**그 순간의 값만 남기는 곱셈.** 재는 일을 식으로 쓰려면 다른 순간은 모두 0으로 만들고 한 순간의 값만 남기는 곱셈이 필요하다. 폭 $$\Delta$$, 높이 $$1/\Delta$$인 좁은 네모 펄스 $$\delta_\Delta(t)$$(넓이 1)를 $$x(t)$$에 곱한다. 폭이 좁으면 그 안에서 $$x(t)$$는 거의 $$x(0)$$으로 일정하다. 그래서 $$x(t)\delta_\Delta(t) \approx x(0)\delta_\Delta(t)$$다. 폭 $$\Delta$$를 0으로 줄인 극한 $$\delta(t) = \lim_{\Delta \to 0}\delta_\Delta(t)$$가 단위 임펄스이고, 그때는 등호가 된다.

$$x(t)\delta(t) = x(0)\delta(t), \qquad x(t)\delta(t - t_0) = x(t_0)\delta(t - t_0)$$


임펄스를 $$t_0$$에 세우면 그 순간의 값 $$x(t_0)$$만 남는다. 이 성질은 [단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/)에 자세히 있다. 간격 $$T$$마다 높이 1인 임펄스를 세운 임펄스열 $$p(t)$$를 곱하면 $$x(0), x(T), x(2T), \dots$$만 남는다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/61_sampling-theorem_fig1.svg" alt="그림" width="547" height="453" loading="lazy">

위에서 아래로 보면 된다. 맨 위 $$x(t)$$에 가운데 임펄스열 $$p(t)$$를 곱하면, 맨 아래처럼 $$T$$마다 그 순간의 높이를 가진 화살표 $$x_p(t)$$만 남는다. 점선은 원래 곡선이고, 화살표 끝이 정확히 그 위에 놓인다[^s4].

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">표본화 정리</div>

신호에 든 주파수가 모두 어떤 최고 주파수 아래에 있고(대역 제한), 1초에 재는 횟수가 그 최고 주파수의 두 배보다 많으면, 간격마다 잰 값만으로 원래 신호를 정확히 되살릴 수 있다. 되살릴 때는 잰 값으로 만든 임펄스열을 낮은 주파수만 통과시키는 필터(저역 통과 필터)에 넣는다. 이 필터는 통과 구간에서 크기를 정확히 $$T$$배 하고 그 밖은 정확히 0으로 막는다. 통과 구간의 끝(차단 주파수)은 신호의 최고 주파수보다 높고, 표본화 주파수에서 최고 주파수를 뺀 값보다 낮아야 한다.

**기호로 쓰면.**
- $$x(t)$$(시간 $$t$$에서 신호의 값)의 푸리에 변환 $$X(j\omega)$$가 $$\vert \omega\vert  > \omega_M$$에서 0이다. $$\omega_M$$은 신호의 최고 각주파수다.
- $$T$$는 표본 간격, $$\omega_s = 2\pi/T$$는 표본화 각주파수, $$f_s = 1/T$$는 1초에 재는 횟수(표본화율, 단위 Hz)다.
- 조건: $$\omega_s > 2\omega_M$$. 주파수(Hz)로는 $$f_s > 2f_M$$이다.
- 그러면 표본 $$x(nT)$$ ($$n = 0, \pm1, \pm2, \dots$$)가 $$x(t)$$를 하나로 정한다.
- 되살리기: $$x_p(t) = \sum_{n=-\infty}^{\infty} x(nT)\,\delta(t - nT)$$를 $$H(j\omega) = T$$ ($$\vert \omega\vert  < \omega_c$$), $$H(j\omega) = 0$$ (그 밖)인 필터에 넣는다. $$\omega_M < \omega_c < \omega_s - \omega_M$$이면 출력 $$x_r(t)$$(되살린 신호)는 $$x(t)$$와 같다.

</div>


각주파수 $$\omega$$는 1초에 도는 각도(라디안)이고, 주파수 $$f$$는 1초에 떠는 횟수다. 한 번 떨면 한 바퀴, 곧 $$2\pi$$ 라디안이므로 $$\omega = 2\pi f$$다. 최고 주파수의 두 배 $$2\omega_M$$을 나이퀴스트 비율(Nyquist rate)이라 부르고, 표본화율은 이보다 커야 한다[^s5]. 거꾸로 표본화율이 정해져 있으면 담을 수 있는 주파수의 한계는 $$f_s/2$$이고, 이 값을 나이퀴스트 주파수라 부른다[^s5]. 예를 들어 음악의 최고 주파수가 20 kHz면 1초에 40,000번보다 많이 재야 한다.

**주파수에서 본 표본화.** 표본화한 신호의 스펙트럼은 원래 스펙트럼을 $$\omega_s$$씩 옮겨 $$1/T$$배 한 것들의 합이다.

$$X_p(j\omega) = \frac{1}{T}\sum_{k=-\infty}^{\infty} X\big(j(\omega - k\omega_s)\big)$$


$$k$$번째 항은 원래 스펙트럼을 오른쪽으로 $$k\omega_s$$만큼 옮긴 복사본이다. 원래 스펙트럼이 $$-\omega_M \sim \omega_M$$에 있으면, $$k = 1$$ 복사본은 $$\omega_s - \omega_M \sim \omega_s + \omega_M$$에 있다. 두 구간이 떨어져 있으려면 $$\omega_M < \omega_s - \omega_M$$, 곧 $$\omega_s > 2\omega_M$$이어야 한다. 정리의 조건이 바로 이 식이다. 작은 숫자로 보면, 최고 주파수 1 Hz인 신호를 1초에 3번 재면($$T = 1/3$$초) 높이 3인 복사본이 0, ±3, ±6 Hz, …에 선다. 가운데 복사본은 −1~1 Hz, 그다음 복사본은 2~4 Hz라 사이에 1 Hz의 빈틈이 있다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/61_sampling-theorem_fig2.svg" alt="그림" width="540" height="659" loading="lazy">

위에서 아래로 본다. 원래 스펙트럼 $$X(j\omega)$$는 $$\pm\omega_M$$ 안의 삼각형이다. 임펄스열의 스펙트럼 $$P(j\omega)$$도 $$\omega_s$$ 간격의 임펄스열이다. 둘을 곱한 신호의 스펙트럼 $$X_p(j\omega)$$는 높이 $$1/T$$인 삼각형이 $$\omega_s$$마다 늘어선 모양이고, 삼각형 사이에 빈틈이 있다. 보라색 구간만 높이 $$T$$로 통과시키는 필터 $$H(j\omega)$$를 거치면 맨 아래처럼 가운데 삼각형만 높이 1로 돌아온다[^s4].

**이산 신호의 주파수와 실제 주파수.** 시작 시각을 0으로 두고 간격 $$t_0$$로 잰 수열은 $$x[n] = x(nt_0)$$다[^s6]. 주파수 $$f$$인 코사인을 재면 $$\cos(2\pi f t_0 n)$$이 되므로, 이산 신호의 주파수(한 표본마다 도는 각도)는 $$\omega = 2\pi f t_0$$다. 이산 신호는 $$\omega = \pi$$일 때 가장 빨리 떤다. 매 표본마다 부호가 바뀌는 $$(-1)^n$$이다([이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/)). 그래서 이산 신호가 나타낼 수 있는 가장 높은 실제 주파수는 $$\pi = 2\pi f t_0$$를 풀어 얻는다.

$$\omega = 2\pi f t_0 = \frac{2\pi f}{f_s}, \qquad f_{\max} = \frac{1}{2t_0} = \frac{f_s}{2}$$


$$t_0 = 1/8000$$초면 $$f_{\max} = 4000$$ Hz, $$t_0 = 1/44100$$초면 22,050 Hz다. 1000 Hz를 8000 Hz로 재면 $$\omega = \pi/4$$이고, 8표본마다 한 바퀴($$2\pi$$)를 돈다. 표본화 정리의 조건 $$f_s > 2f_M$$은 신호의 모든 주파수가 이 한계 $$f_s/2$$보다 낮다는 말과 같다.

## 증명

시간에서 곱하면 주파수에서 컨벌루션(한쪽을 밀어 가며 겹친 넓이를 구하는 계산)이 된다는 성질로 복사본 식을 얻는다. 그다음 복사본이 떨어져 있으면 필터가 가운데 한 벌만 남긴다는 것을 보인다[^s7].

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


1. *임펄스열의 스펙트럼.* $$p(t) = \sum_n \delta(t - nT)$$는 주기 $$T$$인 주기 신호이고, 푸리에 급수 계수가 모두 $$1/T$$다. 그래서 $$P(j\omega) = \dfrac{2\pi}{T}\sum_k \delta(\omega - k\omega_s)$$다. (근거: [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/)의 임펄스열 예)
2. *곱셈 성질.* $$x_p(t) = x(t)p(t)$$이므로 $$X_p(j\omega) = \dfrac{1}{2\pi}X(j\omega) * P(j\omega)$$다. (근거: [곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/))
3. *임펄스와 컨벌루션하면 옮겨진다.* $$X(j\omega) * \delta(\omega - k\omega_s) = X\big(j(\omega - k\omega_s)\big)$$. (근거: 임펄스의 표본화 성질)
4. 1~3을 합치면 $$X_p(j\omega) = \dfrac{1}{2\pi}\cdot\dfrac{2\pi}{T}\sum_k X\big(j(\omega - k\omega_s)\big) = \dfrac{1}{T}\sum_k X\big(j(\omega - k\omega_s)\big)$$. (근거: 컨벌루션의 선형성)
5. *복사본이 떨어져 있을 조건.* $$k$$번째 복사본은 $$k\omega_s - \omega_M \le \omega \le k\omega_s + \omega_M$$에만 있다. 이웃한 $$k$$번째와 $$k+1$$번째가 떨어져 있으려면 $$k\omega_s + \omega_M < (k+1)\omega_s - \omega_M$$, 곧 $$\omega_s > 2\omega_M$$이다. (근거: 대역 제한 가정)
6. *필터가 가운데만 남긴다.* $$\omega_M < \omega_c < \omega_s - \omega_M$$이라 하자. $$k \ne 0$$인 복사본은 $$\vert \omega\vert  \ge \omega_s - \omega_M > \omega_c$$에만 있으므로, $$\vert \omega\vert  < \omega_c$$에는 $$k = 0$$ 복사본 $$\frac{1}{T}X(j\omega)$$만 있다. 그래서 거기서 $$H X_p = T \cdot \frac{1}{T}X = X$$다. $$\vert \omega\vert  \ge \omega_c$$에서는 $$H = 0$$이고, $$\omega_c > \omega_M$$이라 $$X$$도 0이다. 따라서 모든 $$\omega$$에서 $$X_r(j\omega) = X(j\omega)$$이고, 푸리에 변환이 같으므로 $$x_r(t) = x(t)$$다.

</details>

**가정을 하나씩 빼면.** 정리는 다음처럼 깨진다[^s7].

| 가정 | 빼면 생기는 일 | 반례 |
|---|---|---|
| 대역 제한 ($$\lvert\omega\rvert > \omega_M$$에서 $$X = 0$$) | 복사본의 꼬리가 어떤 $$\omega_s$$에서도 이웃과 겹친다 | 잠깐 켜졌다 꺼지는 네모 펄스. 스펙트럼이 끝없이 퍼져 있어 아무리 자주 재도 정확히는 못 되살린다 |
| $$\omega_s > 2\omega_M$$ (등호 없음) | 같은 표본을 내는 다른 신호가 생긴다 | 100 Hz 사인을 정확히 200 Hz로 재면 $$\sin(\pi n) = 0$$이라 표본이 모두 0이다 |
| 필터의 크기 $$T$$배 | 되살린 신호가 원래의 $$1/T$$배가 된다 | 1초에 8000번 재고 크기 1인 필터를 쓰면 8000배 큰 신호가 나온다 |
| $$\omega_M < \omega_c < \omega_s - \omega_M$$ | 원래 스펙트럼이 잘리거나 이웃 복사본이 섞인다 | 최고 1 Hz 신호를 1초에 3번 잴 때 차단 주파수를 0.8 Hz로 하면 0.8~1 Hz가 잘리고, 2.2 Hz로 하면 2~2.2 Hz의 이웃 복사본이 들어온다. 둘 다 최대 약 0.04 어긋난다 |

이 정리는 되살릴 수 있다는 충분조건이다. 스펙트럼이 0 근처는 비어 있고 높은 쪽 좁은 띠에만 있는 신호(대역 통과 신호)는 최고 주파수의 두 배보다 느리게 재고도 되살릴 수 있는 경우가 있다[^s7]. 대우로 읽으면, 같은 표본을 내는 서로 다른 신호가 있을 때는 대역 제한이 깨졌거나 $$\omega_s \le 2\omega_M$$이다.

### 스스로 설명해 보기

1. "$$X_p(j\omega) = \frac{1}{T}\sum_k X(j(\omega - k\omega_s))$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   시간에서 임펄스열을 곱했으므로 곱셈 성질로 주파수에서는 $$\frac{1}{2\pi}$$을 곱한 컨벌루션이 된다. 임펄스열의 스펙트럼은 넓이 $$2\pi/T$$인 임펄스가 $$\omega_s$$마다 선 것이고, 임펄스 하나와 컨벌루션하면 $$X$$가 그 자리로 옮겨진다. $$2\pi$$끼리 지워져 $$1/T$$가 남는다.
   </details>
2. "$$\omega_s > 2\omega_M$$이면 복사본이 겹치지 않는다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   가운데 복사본의 오른쪽 끝은 $$\omega_M$$, 다음 복사본의 왼쪽 끝은 $$\omega_s - \omega_M$$이다. $$\omega_M < \omega_s - \omega_M$$을 정리하면 $$\omega_s > 2\omega_M$$이다.
   </details>
3. "$$\vert \omega\vert  < \omega_c$$에서 $$H X_p = X$$."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   $$\omega_c < \omega_s - \omega_M$$이라 이 구간에는 가운데 복사본 $$\frac{1}{T}X$$만 있다. 필터가 $$T$$를 곱해 $$\frac{1}{T}$$을 지운다.
   </details>
- 이 증명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  시간에서 띄엄띄엄 재는 일이 주파수에서는 복사본을 늘어놓는 일이 된다. 복사본끼리 떨어져 있으면 한 벌만 골라낼 수 있다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  사진을 픽셀 격자로 찍는 2차원 표본화. 무늬의 공간 주파수가 픽셀 간격이 허락하는 절반을 넘으면 둔갑한다([해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/)). 라디오의 진폭 변조도 같은 틀이다. 곱해서 스펙트럼을 옮긴 뒤 저역 통과 필터로 원래 한 벌을 되찾는다([곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/)).
  </details>

## 예제

**되살리기를 시간에서 보기.** 주파수에서 가운데 한 벌만 통과시키는 필터는, 시간에서는 표본 자리마다 sinc 모양 파형을 하나씩 세워 더하는 일이다. 차단 주파수를 $$\omega_s/2$$로 고르면 식이 이렇게 된다[^s8].

$$x(t) = \sum_{n=-\infty}^{\infty} x(nT)\,\operatorname{sinc}\!\left(\frac{t - nT}{T}\right), \qquad \operatorname{sinc}(u) = \frac{\sin \pi u}{\pi u}$$


$$\operatorname{sinc}\big((t - nT)/T\big)$$는 $$t = nT$$에서 1이고, 다른 표본 자리 $$t = mT$$ ($$m \ne n$$)에서는 0이다. 그래서 표본 자리에서는 자기 값만 남고, 그 사이는 모든 sinc가 조금씩 보탠 값으로 채워진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/61_sampling-theorem_fig3.svg" alt="그림" width="576" height="320" loading="lazy">

$$x(t) = \operatorname{sinc}^2(0.8t)$$(최고 주파수 0.8 Hz)를 0.5초마다(1초에 2번) 잰 예다. 주황 점이 표본이고, 옅은 파란 선이 표본마다 세운 sinc다. 이것들을 모두 더한 주황 점선이 굵은 회색 원래 곡선과 겹친다[^s4].

**표준 표본화율.**[^s9]

| 용도 | 최고 주파수 $$f_{\max}$$ | 표본화율 $$f_s$$ | 두 배와 비교 |
|---|---|---|---|
| 하이파이 오디오(CD) | 20 kHz | 44.1 kHz | 40 kHz보다 4.1 kHz 많다 |
| 전화 음성 | 약 3.4 kHz | 8 kHz | 6.8 kHz보다 1.2 kHz 많다 |

하이파이의 20 kHz는 사람이 들을 수 있는 가장 높은 소리다([가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)). 전화는 말소리를 알아듣는 데 필요한 약 300~3400 Hz만 남긴다. 두 경우 모두 표본화율을 두 배보다 조금 넉넉하게 잡는다. 실제 필터는 한 점에서 딱 끊지 못하고 조금씩 줄어들기 때문이다. CD는 20 kHz까지 통과시키고 22.05 kHz($$f_s/2$$)에서는 막아야 하므로, 필터가 줄어드는 데 2.05 kHz의 여유를 쓴다.

**경계: 정확히 두 배.** 100 Hz 사인 $$\sin(2\pi \cdot 100t)$$를 정확히 200 Hz로 재면 $$x[n] = \sin(\pi n) = 0$$이다. 표본이 모두 0이라 신호가 없는 것과 구별되지 않는다. 코사인이면 $$\cos(\pi n + \phi) = (-1)^n\cos\phi$$라서 진폭 1·위상 $$\pi/3$$인 신호와 진폭 0.5·위상 0인 신호가 같은 표본을 낸다. 그래서 조건에는 등호가 들어가지 않는다[^s7].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 시험 신호 $$\operatorname{sinc}^2 t$$의 삼각형 스펙트럼(수치 적분), 표본 합 $$\sum x(nT)e^{-j\omega nT}$$와 복사본 식 $$\frac1T\sum_k X(j(\omega - k\omega_s))$$의 일치, 차단 주파수 1.2·1.5·1.8 Hz에서 복원 오차 $$< 10^{-4}$$와 0.8·2.2 Hz에서 약 0.04, 정확히 두 배일 때 표본이 0, 표준 표본화율, $$t_0$$와 $$f_{\max}$$, 1 kHz의 이산 주파수 $$\pi/4$$, 예시의 8000 Hz 표본을 지나는 4000 Hz 아래 사인파가 1000 Hz뿐임과 1500 Hz에서 500 Hz로 둔갑, 피아노 최고음 약 4186 Hz (실험으로 확인됨. 증명은 표준 교재로 점검) — [61_sampling-theorem_verify.py](/Hongs_Blog/studies/human-interface-media/code/61_sampling-theorem_verify/)</div>


단계별 연습: [표본화와 에일리어싱 예제 사다리](/Hongs_Blog/studies/human-interface-media/sampling-aliasing-ladder/)

</div>


## 활용

- 녹음 장치는 재기 전에 저역 통과 필터를 두어 $$f_s/2$$보다 높은 성분을 미리 없앤다(안티에일리어싱 필터). 정리의 대역 제한 가정을 실제로 만드는 장치다. 이 필터가 없으면 무슨 일이 생기는지는 [에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)에 있다.
- 소리를 다시 내는 쪽(D/A 변환기)도 저역 통과 필터로 복사본을 지운다. 정리의 필터는 sinc가 과거와 미래로 끝없이 뻗어 그대로는 만들 수 없다. 그래서 표본화율을 넉넉히 잡아 필터가 줄어들 여유를 준다[^s9].
- 흔한 실수: Hz와 각주파수를 섞는 것. $$\omega_s > 2\omega_M$$과 $$f_s > 2f_M$$은 같은 조건이지만, $$\omega_s = 2\pi f_s$$라서 $$\omega_s > 2f_M$$처럼 섞어 쓰면 틀린다.
- 흔한 실수: 소리에 든 주파수 가운데 가장 낮은 것이나 대표 음높이로 계산하는 것. 기준은 언제나 가장 높은 성분이다. 피아노의 가장 높은 음이 약 4.2 kHz여도 그 음의 고조파([고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/))는 훨씬 높이 올라간다[^s10].

## 연결

- 선수: [스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/), [실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/) (실수 신호의 스펙트럼은 $$\pm\omega$$에 대칭이라 $$-\omega_M \sim \omega_M$$을 차지한다), [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/), [곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/)
- 다른 과목에서의 모습: [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/), [PCM](/Hongs_Blog/studies/computer-communication/pcm/)
- 조건을 어기면: [에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)
- 값을 끊는 다음 단계: [양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)
- 같은 한계를 공간에서: [해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/) (픽셀 $$N$$개에 최대 $$N/2$$주기)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"표본 사이의 값은 버려진다. 그래서 디지털 소리는 계단처럼 거칠다"</div>

틀렸다. 디지털 신호를 막대나 계단으로 그린 그림을 자주 봐서 그렇게 생각하기 쉽다. 신호에 $$f_s/2$$보다 높은 주파수가 없으면, 표본 사이의 값은 표본들이 이미 정해 둔다. 되살리는 필터가 표본마다 sinc를 세워 더해 매끈한 원래 곡선을 다시 만든다. 확인 방법: 위 예제처럼 0.5초마다 잰 $$\operatorname{sinc}^2(0.8t)$$를 sinc 합으로 되살리면, 표본 사이 어디서도 원래 값과 0.001 넘게 차이 나지 않는다. 디지털 소리의 거칢은 값을 반올림하는 양자화에서 생긴다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 표본화 정리를 두 조건과 되살리는 필터(크기, 차단 주파수의 범위)까지 포함해 쓰라.</summary>


**답:** 신호가 대역 제한($$\vert \omega\vert  > \omega_M$$에서 $$X(j\omega) = 0$$)이고 $$\omega_s = 2\pi/T > 2\omega_M$$이면, 표본 $$x(nT)$$만으로 $$x(t)$$를 정확히 되살린다. $$x_p(t) = \sum_n x(nT)\delta(t - nT)$$를 통과 구간에서 크기 $$T$$, 차단 주파수 $$\omega_M < \omega_c < \omega_s - \omega_M$$인 저역 통과 필터에 넣으면 출력이 $$x(t)$$다.<br>
**흔한 오답:** 등호를 넣어 $$\omega_s \ge 2\omega_M$$으로 쓰는 것. 정확히 두 배면 사인파의 표본이 모두 0이 될 수 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 표본화한 신호의 스펙트럼이 $$X_p(j\omega) = \frac{1}{T}\sum_k X(j(\omega - k\omega_s))$$인 근거를 두 단계로 쓰라. 복사본의 높이가 왜 $$1/T$$인가?</summary>


**답:** (1) 임펄스열 $$p(t)$$의 스펙트럼은 넓이 $$2\pi/T$$인 임펄스가 $$\omega_s$$마다 선 것이다. (2) 곱셈 성질로 $$X_p = \frac{1}{2\pi}X * P$$이고, 임펄스 하나와 컨벌루션하면 $$X$$가 그 자리로 옮겨진다. 넓이 $$2\pi/T$$에 $$\frac{1}{2\pi}$$을 곱하면 $$1/T$$이라서 복사본의 높이가 $$1/T$$이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 최고 주파수가 15 kHz인 음악을 담으려면 표본화율이 얼마보다 커야 하는가? 32 kHz로 재면 담을 수 있는 가장 높은 주파수는 얼마이고, 이 음악을 담을 수 있는가?</summary>


**답:** 30 kHz보다 커야 한다. 32 kHz로 재면 $$f_s/2 = 16$$ kHz까지 담으므로 15 kHz 음악을 담을 수 있다.<br>
**흔한 오답:** "15 kHz의 두 배인 30 kHz면 충분하다." 정확히 두 배는 조건을 채우지 못한다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> "최고 주파수의 정확히 두 배로 재도 된다"가 틀렸음을 보이는 예를 들라.</summary>


**답:** 100 Hz 사인 $$\sin(2\pi \cdot 100t)$$를 200 Hz로 재면 $$\sin(\pi n) = 0$$이라 표본이 모두 0이다. 신호가 없는 것과 구별할 수 없다.<br>
**이유:** 이때 가운데 복사본과 이웃 복사본이 $$\pm\omega_M$$에서 맞닿아 그 자리의 성분이 서로 섞인다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 되살리는 필터의 차단 주파수 $$\omega_c$$가 $$\omega_M$$보다 낮을 때와 $$\omega_s - \omega_M$$보다 높을 때, 각각 무엇이 잘못되는지 복사본 그림으로 설명하라.</summary>


**답:** $$\omega_c < \omega_M$$이면 가운데 복사본(원래 스펙트럼)의 바깥쪽이 잘려 높은 성분을 잃는다. $$\omega_c > \omega_s - \omega_M$$이면 이웃 복사본의 가장자리가 통과 구간에 들어와 원래에 없던 성분이 섞인다. 두 경우 모두 되살린 신호가 원래와 달라진다.

</details>

<details markdown="1"><summary markdown="span"><b>C6</b> 간격 $$t_0 = 125\ \mu s$$로 잰 이산 신호에서 가장 빠른 떨림 $$\omega = \pi$$는 실제로 몇 Hz인가? 1 kHz 톤은 이산 주파수가 얼마가 되는가?</summary>


**답:** $$f_{\max} = 1/(2t_0) = 1/(250 \times 10^{-6}) = 4000$$ Hz다. 1 kHz는 $$\omega = 2\pi \cdot 1000 \cdot 125 \times 10^{-6} = \pi/4$$다. $$t_0 = 125\ \mu s$$는 1초에 8000번 재는 것과 같다.

</details>

[^s2]: PAM은 펄스의 높이에 값을 싣는 방식(Pulse Amplitude Modulation)이다.
[^s3]: 1000 Hz를 8000 Hz와 1500 Hz로 재는 예는 설명용으로 고른 값이다. 4000 Hz보다 느린 사인파 가운데 1000 Hz만 그 점들을 지난다는 것과 1500 Hz로 잴 때 500 Hz와 표본이 같다는 것은 [61_sampling-theorem_verify.py](/Hongs_Blog/studies/human-interface-media/code/61_sampling-theorem_verify/)로 확인했다.
[^s4]: 그림 세 장은 [61_sampling-theorem_plot.py](/Hongs_Blog/studies/human-interface-media/code/61_sampling-theorem_plot/)로 그렸다. 같은 코드로 다음을 확인했다: 그림 1의 표본화율 1.25 Hz가 최고 주파수 0.42 Hz의 두 배보다 큼, 그림 2의 복사본 높이 $$1/T$$와 차단 주파수가 허용 범위 안이며 되살린 스펙트럼이 원래와 같음, 그림 3의 sinc 합이 원래 곡선과 0.001 안에서 일치.
[^s5]: 표준 교재(Oppenheim·Willsky, *Signals and Systems* 2판 7.1절)는 $$2\omega_M$$ 자체를 나이퀴스트 비율이라 부르고, 표본화 주파수가 이보다 커야 한다고 쓴다. 나이퀴스트 주파수 $$f_s/2$$라는 이름도 표준 용어다.
[^s6]: 시작 시각을 0으로 두면 $$x(nt_0)$$이다.
[^s7]: 증명의 여섯 단계, 가정마다의 반례 표, 충분조건과 대역 통과 신호, 정확히 두 배인 경계 예는 Oppenheim·Willsky, *Signals and Systems* 2판 7.1절의 표준 내용을 따랐다. 반례 표의 수치(0.04)와 경계 예는 검증 코드로 확인했다.
[^s8]: sinc를 더해 되살리는 식(대역 제한 보간)은 Oppenheim·Willsky, *Signals and Systems* 2판 7.2절의 표준 내용이다.
[^s9]: 표의 값은 표준값이다: 사람의 가청 대역 위 끝 약 20 kHz, CD 규격(IEC 60908)의 44.1 kHz, 전화 음성 부호화 규격(ITU-T G.711)의 8 kHz 표본화와 약 300~3400 Hz 음성 대역. 실제 필터가 한 점에서 끊기지 않아 표본화율에 여유를 둔다는 설명도 표준 교재의 내용이다.
[^s10]: 피아노 최고음(C8)의 기본 주파수가 약 4186 Hz라는 값은 표준 음률(A4 = 440 Hz, 평균율)에서 계산한 것이다.
{% endraw %}
