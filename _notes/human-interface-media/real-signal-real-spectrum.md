---
layout: "note"
title: "실수 신호와 실수 스펙트럼"
display_title: "실수 신호와 실수 스펙트럼 (Real Signals and Real Spectra)"
kind: "concept"
kind_label: "정리"
num: "57"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Real Signals and Real Spectra", "실수 신호", "Real Signal", "실수 스펙트럼", "Real Spectrum", "켤레 대칭", "Conjugate Symmetry", "에르미트 대칭", "Hermitian Symmetry", "켤레 복소 함수", "Complex Conjugate", "영위상 신호", "Zero-Phase Signal", "옴의 음향 법칙", "Ohm's Acoustic Law"]
description: "마이크가 재는 소리는 매 순간 실수 하나다. 이런 실수 신호에서 어떤 주파수가 얼마나 들어 있는지 적은 함수(스펙트럼)는, 음의 주파수 쪽 값이 양의 주파수 쪽 값과 크기는 같고 출발 각도(위상)만 부호가 반대다. 그래서 양의 주파수 절반만 알면 나머지가 저절로 정해진다. 스펙트럼…"
prev_url: "/studies/human-interface-media/spectrum-spectrogram/"
prev_title: "스펙트럼과 스펙트로그램"
next_url: "/studies/human-interface-media/dt-fourier-transform/"
next_title: "이산 시간 푸리에 변환"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "57_real-signal-real-spectrum_plot.py", "u": "/studies/human-interface-media/code/57_real-signal-real-spectrum_plot/", "r": "그림 생성"}, {"t": "57_real-signal-real-spectrum_verify.py", "u": "/studies/human-interface-media/code/57_real-signal-real-spectrum_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/real-signal-real-spectrum/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

마이크가 재는 소리는 매 순간 실수 하나다. 이런 실수 신호에서 어떤 주파수가 얼마나 들어 있는지 적은 함수(스펙트럼)는, 음의 주파수 쪽 값이 양의 주파수 쪽 값과 크기는 같고 출발 각도(위상)만 부호가 반대다. 그래서 양의 주파수 절반만 알면 나머지가 저절로 정해진다. 스펙트럼까지 각도 없는 실수가 되려면 신호가 시간 0을 중심으로 좌우 대칭이어야 하고, 실제 소리는 대부분 그렇지 않다.

</div>


## 예시로 보기

컴퓨터로 소리의 스펙트럼을 구할 때 음의 주파수까지 모두 계산해야 할까? 음의 주파수는 복소수 표현에서 시계 방향으로 도는 성분이다([파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)). 실수 신호 하나로 직접 계산해 보면 답이 보인다.

$$x(t) = e^{-t}u(t)$$는 $$t = 0$$에 1로 켜졌다가 점점 줄어드는 신호다. $$u(t)$$(단위 계단)는 $$t < 0$$에서 0, $$t \ge 0$$에서 1인 함수다. 이 신호의 푸리에 변환은 $$X(j\omega) = \frac{1}{1 + j\omega}$$이다. 몇 주파수에서 값을 구하면 이렇다.

| $$\omega$$ | $$X(j\omega)$$ | 크기 $$\lvert X\rvert$$ | 위상 $$\angle X$$ |
|---|---|---|---|
| $$-2$$ | $$0.2 + 0.4j$$ | 0.447 | $$+63.4°$$ |
| $$-1$$ | $$0.5 + 0.5j$$ | 0.707 | $$+45°$$ |
| $$-0.5$$ | $$0.8 + 0.4j$$ | 0.894 | $$+26.6°$$ |
| $$0$$ | $$1$$ | 1 | $$0°$$ |
| $$0.5$$ | $$0.8 - 0.4j$$ | 0.894 | $$-26.6°$$ |
| $$1$$ | $$0.5 - 0.5j$$ | 0.707 | $$-45°$$ |
| $$2$$ | $$0.2 - 0.4j$$ | 0.447 | $$-63.4°$$ |

$$\omega$$와 $$-\omega$$의 값은 허수부 부호만 다르다. 크기는 같고 위상은 부호만 뒤집힌다. 그래서 $$\omega \ge 0$$ 쪽 네 줄만 있으면 위쪽 세 줄은 계산하지 않아도 된다. 그래도 스펙트럼 자체는 복소수다.

이번에는 $$x(t) = e^{-\vert t\vert }$$처럼 $$t = 0$$을 중심으로 좌우가 똑같은 신호를 보자. 변환은 $$X(j\omega) = \frac{2}{1 + \omega^2}$$이고 허수부가 아예 없다. $$\omega = 0, \pm1, \pm2$$에서 2, 1, 0.4다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/57_real-signal-real-spectrum_fig1.svg" alt="그림" width="698" height="448" loading="lazy">

위 줄은 $$e^{-t}u(t)$$다. 왼쪽 신호는 $$t = 0$$에서 갑자기 켜져 좌우가 다르다. 오른쪽 스펙트럼에서 파란 실수부는 좌우가 같고, 주황 허수부는 좌우가 부호만 반대다. 회색 점이 표의 $$\omega = \pm1$$ 값이다. 아래 줄은 좌우가 같은 $$e^{-\vert t\vert }$$다. 스펙트럼의 허수부가 0이라 실수만 남는다[^s1].

## 정의

켤레 복소수는 허수부의 부호만 바꾼 수다. $$z = a + jb$$이면 $$z^* = a - jb$$이다. 실수는 켤레를 취해도 자기 자신이다. 이 문서는 신호 처리의 관례대로 허수 단위를 $$j$$로 쓴다($$j^2 = -1$$). [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)의 $$i$$와 같은 수다.

다음 세 가지가 맞는다.

1. 신호가 실수이면, 스펙트럼의 음의 주파수 값은 양의 주파수 값의 켤레다. 그래서 실수부와 크기는 좌우가 같고(짝), 허수부와 위상은 좌우가 부호만 반대다(홀). 거꾸로 스펙트럼이 이렇게 대칭이면 신호는 실수다.
2. 스펙트럼이 실수이면, 신호의 $$-t$$ 값은 $$t$$ 값의 켤레다. 그래서 신호의 실수부는 짝, 허수부는 홀이다. 거꾸로도 맞다.
3. 신호와 스펙트럼이 둘 다 실수인 것은, 신호가 실수이면서 짝함수인 것과 같다. 이때 스펙트럼도 짝함수다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">기호로 쓰면</div>

푸리에 변환이 존재하는 신호 $$x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(j\omega)$$에서
1. $$x(t) = x^*(t)\ (\forall t) \iff X(-j\omega) = X^*(j\omega)\ (\forall\omega)$$. 같은 말로 $$\mathrm{Re}\{X(j\omega)\} = \mathrm{Re}\{X(-j\omega)\}$$, $$\mathrm{Im}\{X(j\omega)\} = -\mathrm{Im}\{X(-j\omega)\}$$, $$\lvert X(-j\omega)\rvert = \lvert X(j\omega)\rvert$$, $$\angle X(-j\omega) = -\angle X(j\omega)$$.
2. $$X(j\omega) = X^*(j\omega)\ (\forall\omega) \iff x(-t) = x^*(t)\ (\forall t)$$. 같은 말로 $$\mathrm{Re}\{x(t)\} = \mathrm{Re}\{x(-t)\}$$, $$\mathrm{Im}\{x(t)\} = -\mathrm{Im}\{x(-t)\}$$.
3. $$x$$와 $$X$$가 모두 실수 $$\iff$$ $$x$$가 실수이고 $$x(-t) = x(t)$$. 이때 $$X(-j\omega) = X(j\omega)$$.

</div>


기호의 뜻: $$x^*(t)$$는 $$x(t)$$의 켤레, $$\mathrm{Re}\{\cdot\}$$와 $$\mathrm{Im}\{\cdot\}$$는 실수부와 허수부, $$\angle$$는 복소수의 각도(위상)다. $$\forall t$$는 "모든 $$t$$에서"라는 뜻이다.

## 증명

켤레를 취하면 변환식의 $$e^{-j\omega t}$$가 $$e^{j\omega t}$$로 바뀌고, $$\omega$$를 $$-\omega$$로 바꾸면 다시 변환식 모양으로 돌아온다. 이 두 번의 뒤집기가 핵심이다.

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


**1번.**

1. $$X^*(j\omega) = \left[\int_{-\infty}^{\infty}x(t)e^{-j\omega t}dt\right]^* = \int_{-\infty}^{\infty}x^*(t)e^{j\omega t}dt$$. 적분(합)의 켤레는 켤레의 적분이고, $$(e^{-j\omega t})^* = e^{j\omega t}$$이기 때문이다.
2. $$\omega$$ 자리에 $$-\omega$$를 넣으면 $$X^*(-j\omega) = \int x^*(t)e^{-j\omega t}dt$$. 오른쪽은 $$x^*(t)$$의 푸리에 변환이다. 그래서 $$x^*(t) \overset{\mathcal{F}}{\longleftrightarrow} X^*(-j\omega)$$다. 이 단계까지는 $$x$$가 실수라는 가정을 쓰지 않았다.
3. $$x$$가 실수면 $$x^* = x$$라서 두 신호의 변환이 같다: $$X(j\omega) = X^*(-j\omega)$$. 다시 $$\omega$$를 $$-\omega$$로 바꾸면 $$X(-j\omega) = X^*(j\omega)$$.
4. 실수부와 허수부로 나눈다. $$X^*(j\omega) = \mathrm{Re}\{X(j\omega)\} - j\,\mathrm{Im}\{X(j\omega)\}$$이고 $$X(-j\omega) = \mathrm{Re}\{X(-j\omega)\} + j\,\mathrm{Im}\{X(-j\omega)\}$$다. 두 식이 같으려면 실수부끼리, 허수부끼리 같아야 한다. 그래서 실수부는 짝, 허수부는 홀이다. 크기는 $$\lvert X(-j\omega)\rvert = \lvert X^*(j\omega)\rvert = \lvert X(j\omega)\rvert$$, 위상은 켤레가 각도의 부호를 바꾸므로 $$\angle X(-j\omega) = -\angle X(j\omega)$$다.
5. 거꾸로 $$X(-j\omega) = X^*(j\omega)$$이면, 2단계에서 $$x^*$$의 변환 $$X^*(-j\omega)$$가 $$X(j\omega)$$와 같다. 역변환은 스펙트럼 하나에 신호 하나를 정하므로 $$x^* = x$$, 곧 $$x$$는 실수다.

**2번.**

1. 역변환식의 켤레를 취한다: $$x^*(t) = \frac{1}{2\pi}\int X^*(j\omega)e^{-j\omega t}d\omega$$.
2. $$X$$가 실수면 $$X^* = X$$라서 $$x^*(t) = \frac{1}{2\pi}\int X(j\omega)e^{-j\omega t}d\omega$$.
3. $$t$$ 자리에 $$-t$$를 넣으면 $$x^*(-t) = \frac{1}{2\pi}\int X(j\omega)e^{j\omega t}d\omega = x(t)$$. 오른쪽이 역변환식 그대로이기 때문이다.
4. $$x^*(-t) = \mathrm{Re}\{x(-t)\} - j\,\mathrm{Im}\{x(-t)\}$$가 $$x(t) = \mathrm{Re}\{x(t)\} + j\,\mathrm{Im}\{x(t)\}$$와 같으므로 실수부는 짝, 허수부는 홀이다.
5. 거꾸로 $$x(-t) = x^*(t)$$이면, 1번 2단계의 $$x^* \leftrightarrow X^*(-j\omega)$$에 시간 반전 $$g(-t) \leftrightarrow G(-j\omega)$$를 한 번 더 쓰면 $$x^*(-t) \leftrightarrow X^*(j\omega)$$다. 왼쪽이 $$x(t)$$이므로 $$X(j\omega) = X^*(j\omega)$$, 곧 $$X$$는 실수다.

같은 결론을 [쌍대성](/Hongs_Blog/studies/signals-and-systems/fourier-duality/)으로도 얻는다. $$X(j\omega)$$가 실수면 시간 함수 $$g(t) = X(jt)$$도 실수다. 쌍대성으로 $$g(t) \leftrightarrow 2\pi x(-\omega)$$이고, $$g$$가 실수이므로 1번에 따라 $$2\pi x(\omega) = 2\pi x^*(-\omega)$$다. 변수 이름을 $$t$$로 바꾸면 $$x(t) = x^*(-t)$$다.

**3번.**

- ($$\Rightarrow$$) $$x$$가 실수면 허수부가 0이다. $$X$$가 실수면 2번에 따라 $$x$$의 실수부가 짝이므로 $$x(-t) = x(t)$$다. 또 1번에서 $$X(-j\omega) = X^*(j\omega)$$이고 $$X$$가 실수라 $$X^* = X$$이므로 $$X(-j\omega) = X(j\omega)$$, 곧 $$X$$도 짝이다.
- ($$\Leftarrow$$) $$x$$가 실수면 1번으로 $$X(-j\omega) = X^*(j\omega)$$. $$x$$가 짝이면 시간 반전 성질 $$x(-t) \leftrightarrow X(-j\omega)$$와 $$x(-t) = x(t)$$에서 $$X(-j\omega) = X(j\omega)$$. 두 식을 합치면 $$X(j\omega) = X^*(j\omega)$$, 곧 $$X$$는 실수다.

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$e^{-t}u(t)$$의 변환을 수치 적분해 표의 값과 켤레 대칭(크기 짝, 위상 홀) 확인, $$e^{-\vert t\vert }$$의 변환이 실수·짝, 복소 신호에서 $$x^* \leftrightarrow X^*(-j\omega)$$, 한쪽만 있는 실수 스펙트럼의 역변환이 $$x(-t) = x^*(t)$$, 길이 2~16 무작위 수열 300개로 이산판 세 성질 확인 (실험으로 확인됨, 증명은 위의 단계별 증명) — [57_real-signal-real-spectrum_verify.py](/Hongs_Blog/studies/human-interface-media/code/57_real-signal-real-spectrum_verify/)</div>

</div>


### 스스로 설명해 보기

1. "$$X^*(j\omega) = \int x^*(t)e^{j\omega t}dt$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   적분은 아주 많은 수의 합이고, 합의 켤레는 각 항의 켤레를 더한 것과 같다. 곱의 켤레는 켤레의 곱이고, $$e^{-j\omega t}$$의 켤레는 지수의 부호만 바뀐 $$e^{j\omega t}$$다.
   </details>
2. "$$x$$가 실수면 $$X(j\omega) = X^*(-j\omega)$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   1번 2단계에서 $$x^*$$의 변환이 $$X^*(-j\omega)$$임을 보였다. 실수 신호는 $$x^* = x$$이므로 같은 신호의 변환 두 개가 같아야 한다.
   </details>
3. "3번에서 $$X$$도 짝이 된다"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   1번의 켤레 대칭 $$X(-j\omega) = X^*(j\omega)$$에, $$X$$가 실수라는 사실 $$X^* = X$$를 넣으면 $$X(-j\omega) = X(j\omega)$$가 된다.
   </details>
- 이 증명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  켤레를 취하면 회전 방향(지수의 부호)이 바뀌고, 주파수의 부호를 바꾸면 다시 돌아온다. 실수 신호는 켤레를 취해도 그대로라서, 두 번의 뒤집기가 스펙트럼의 좌우 대칭으로 남는다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  푸리에 급수의 $$a_{-k} = a_k^*$$, [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/)의 $$X(e^{-j\omega}) = X^*(e^{j\omega})$$, 컴퓨터가 계산하는 길이 $$N$$짜리 이산 푸리에 변환의 $$X[N-k] = X^*[k]$$. 모두 같은 두 번의 뒤집기로 증명한다.
  </details>

## 예제

**예 1. 크기는 같고 위상만 다른 두 소리.** 기본 주파수 1(주기 1)에 2배, 3배 고조파를 섞은 두 신호를 비교한다[^s3].

$$x_s(t) = \sin 2\pi t + \tfrac12\sin 4\pi t + \tfrac13\sin 6\pi t, \qquad x_c(t) = \cos 2\pi t + \tfrac12\cos 4\pi t + \tfrac13\cos 6\pi t$$


- *계수 구하기:* 오일러 공식으로 $$\sin\theta = \frac{1}{2j}(e^{j\theta} - e^{-j\theta})$$, $$\cos\theta = \frac12(e^{j\theta} + e^{-j\theta})$$이다. 그래서 $$x_s$$의 푸리에 급수 계수는 $$a_{\pm k} = \pm\frac{A_k}{2j}$$(순허수), $$x_c$$는 $$a_{\pm k} = \frac{A_k}{2}$$(실수)다. $$A_k$$는 $$1, \frac12, \frac13$$이다.
- *크기 비교:* 두 신호 모두 $$\lvert a_{\pm1}\rvert = 0.5$$, $$\lvert a_{\pm2}\rvert = 0.25$$, $$\lvert a_{\pm3}\rvert \approx 0.167$$로 같다. 위상만 $$90°$$씩 다르다.
- *대칭 확인:* 둘 다 실수 신호라 $$a_{-k} = a_k^*$$가 맞는다. $$x_c$$는 짝함수라 계수가 실수이고(3번), $$x_s$$는 홀함수라 계수가 순허수다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/57_real-signal-real-spectrum_fig2.svg" alt="그림" width="698" height="429" loading="lazy">

왼쪽 위 사인 위상 합은 톱니 모양이고 $$t = 0$$에서 0을 지나는 홀함수다. 왼쪽 아래 코사인 위상 합은 $$t = 0$$에 뾰족한 봉우리가 있는 짝함수다. 파형은 이렇게 다르지만 오른쪽의 크기 막대는 위아래가 똑같다[^s1].

한쪽 귀로 듣는 지속음에서는 이런 위상 차이가 대체로 잘 느껴지지 않는다(옴의 음향 법칙)[^s4]. 그렇다면 소리를 처리할 때 위상을 모두 0으로 바꿔도 비슷하게 들린다. 위상을 0으로 바꾸면 스펙트럼에는 크기 $$\lvert X(j\omega)\rvert$$만 남는다. 실수 소리의 크기 스펙트럼은 1번에 따라 실수이고 짝이다. 그래서 3번에 따라, 이 크기 스펙트럼을 가진 신호(영위상 신호)는 실수이고 짝함수다. 그림 아래 줄의 $$x_c$$가 위 줄 $$x_s$$의 영위상 신호다. 원래 소리 $$x_s$$는 짝함수가 아니다.


**예 2. 스펙트럼은 실수인데 신호는 복소수.** $$X(j\omega) = 1$$ ($$0 < \omega < W$$), 그 밖 0인 스펙트럼을 생각한다. 실수지만 양의 주파수에만 있어 짝이 아니다[^s3].

- *역변환:* $$x(t) = \frac{1}{2\pi}\int_0^W e^{j\omega t}d\omega = \frac{e^{jWt} - 1}{2\pi jt}$$.
- *실수부와 허수부로:* 분자와 분모에 $$-j$$를 곱해 정리하면 $$x(t) = \dfrac{\sin Wt + j(1 - \cos Wt)}{2\pi t}$$.
- *숫자로 확인:* $$W = 2$$, $$t = 1$$이면 $$x(1) \approx 0.1447 + 0.2254j$$, $$x(-1) \approx 0.1447 - 0.2254j$$. 실수부는 같고 허수부는 부호만 반대라 2번의 $$x(-t) = x^*(t)$$가 맞는다.
- *결론:* 스펙트럼이 실수라는 것만으로는 신호가 실수가 되지 않는다. 짝이라는 조건이 더 있어야 한다(3번).

**가정을 하나씩 빼면 무엇이 깨지나**[^s3]

| 신호 | 실수? | 짝? | 스펙트럼 |
|---|---|---|---|
| $$e^{-\lvert t\rvert}$$ | 예 | 예 | $$\frac{2}{1+\omega^2}$$: 실수·짝 |
| $$e^{-t}u(t)$$ | 예 | 아니오 | $$\frac{1}{1+j\omega}$$: 켤레 대칭, 복소수 |
| $$\sin\omega_0 t$$ | 예 | 아니오(홀) | $$\frac{\pi}{j}\delta(\omega - \omega_0) - \frac{\pi}{j}\delta(\omega + \omega_0)$$: 순허수·홀 |
| $$e^{j\omega_0 t}$$ | 아니오 | 해당 없음 | $$2\pi\delta(\omega - \omega_0)$$: 한쪽에만 있어 켤레 대칭이 아님 |

마지막 줄이 "실수"라는 가정이 왜 필요한지 보여 준다. 복소 신호는 음의 주파수 쪽이 비어 있어도 된다.

## 활용

- 실수 신호용 FFT(예: NumPy의 `numpy.fft.rfft`)는 길이 $$N$$인 신호에서 0 이상의 주파수 $$\lfloor N/2\rfloor + 1$$개만 계산하고 저장한다. 나머지 절반은 1번의 켤레 대칭으로 정해지기 때문이다. 계산량과 저장 공간이 거의 절반이 된다[^s5].
- 소리의 스펙트럼 그림과 [스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/)은 보통 0 이상의 주파수만 그린다. 크기가 좌우 대칭이라 반쪽에 정보가 다 있다.
- 음성 인식에서 쓰는 멜 스펙트로그램처럼, 소리의 특징을 뽑을 때 크기(또는 그 제곱인 세기)만 남기고 위상을 버리는 경우가 많다[^s5].
- 흔한 실수: 크기 스펙트럼이 짝이니 $$X(j\omega)$$ 자체도 짝이라고 생각하는 것(위상은 홀이다). 한쪽 스펙트럼으로 에너지를 셀 때, 0과 가장 높은 주파수를 뺀 나머지 성분을 두 배로 세지 않는 것[^s5].

## 연결

- 선수: [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/) (회전 방향과 켤레), [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/), [짝 신호와 홀 신호](/Hongs_Blog/studies/signals-and-systems/even-odd-signals/)
- 같은 성질의 다른 모습: [푸리에 변환의 성질](/Hongs_Blog/studies/signals-and-systems/fourier-transform-properties/) (성질표의 실수 신호 줄), [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/) ($$a_{-k} = a_k^*$$), [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/)
- 2번을 얻는 다른 길: [푸리에 변환의 쌍대성](/Hongs_Blog/studies/signals-and-systems/fourier-duality/)
- 귀가 주파수별로 나눠 듣는 구조: [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/), 배음의 크기 비율이 만드는 [음색](/Hongs_Blog/studies/human-interface-media/timbre/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"실수 신호의 스펙트럼은 실수다"</div>

틀렸다. 신호가 실수이니 그 변환도 실수일 것 같아 그럴듯하다. 실제로 실수라는 조건이 주는 것은 좌우 켤레 대칭뿐이다. 스펙트럼이 실수가 되려면 신호가 짝함수이기도 해야 한다. 확인: $$e^{-t}u(t)$$는 실수지만 $$\omega = 1$$에서 변환값이 $$0.5 - 0.5j$$다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"사람의 청각은 소리의 위상을 전혀 처리하지 못한다"</div>

틀렸다. 한쪽 귀로 듣는 지속음에서는 성분의 위상을 바꿔도 대체로 비슷하게 들려서 그럴듯하다(옴의 음향 법칙). 그러나 사람은 두 귀에 소리가 도착하는 시간 차이와 위상 차이로 소리의 방향을 찾고, 위상 차이는 약 1.5 kHz 아래의 낮은 소리에서 주로 쓰인다. 또 서로 가까운 고조파가 여럿 겹친 소리는 위상에 따라 파형의 굴곡이 달라져 음색이 다르게 들릴 수 있다. 확인: 같은 소리를 이어폰 왼쪽과 오른쪽에 아주 조금 다른 시각에 보내면 소리가 한쪽으로 치우쳐 들린다[^s4].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 실수 신호 $$x(t)$$의 스펙트럼이 만족하는 대칭을 식으로 쓰고, 실수부·허수부·크기·위상이 각각 짝인지 홀인지 쓰라.</summary>


**답:** $$X(-j\omega) = X^*(j\omega)$$. 실수부 짝, 허수부 홀, 크기 짝, 위상 홀.<br>
**흔한 오답:** $$X(-j\omega) = X(j\omega)$$로 쓰는 것. 이것은 신호가 짝함수이기도 할 때만 맞다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 증명에서 $$X^*(-j\omega) = \int x^*(t)e^{-j\omega t}dt$$가 나오는 근거를 두 단계로 쓰라.</summary>


**답:** (1) 변환식 전체에 켤레를 취하면 적분 안의 각 항에 켤레가 붙어 $$X^*(j\omega) = \int x^*(t)e^{j\omega t}dt$$가 된다. (2) $$\omega$$ 자리에 $$-\omega$$를 넣으면 지수가 다시 $$e^{-j\omega t}$$가 된다.<br>
**이유:** 이 식은 "$$x^*(t)$$의 변환은 $$X^*(-j\omega)$$"라는 뜻이고, $$x$$가 실수라는 가정 없이 맞는다. 실수 가정은 그다음 단계에서 $$x^* = x$$로 들어간다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 스펙트럼 $$X(j\omega)$$가 실수인데 신호 $$x(t)$$는 실수가 아닌 예를 들고, 3번의 어떤 조건이 빠졌는지 말하라.</summary>


**답:** $$X(j\omega) = 1$$ ($$0 < \omega < W$$), 그 밖 0. 역변환은 $$x(t) = \frac{\sin Wt + j(1 - \cos Wt)}{2\pi t}$$로 복소수다. 스펙트럼이 실수지만 짝이 아니다. 신호와 스펙트럼이 모두 실수이려면 둘 다 짝이어야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 실수 신호 $$x(t)$$의 변환이 $$X(j2) = 3 - 4j$$다. $$X(-j2)$$, $$\lvert X(-j2)\rvert$$, $$\angle X(-j2)$$를 구하라.</summary>


**답:** $$X(-j2) = X^*(j2) = 3 + 4j$$. 크기 $$\sqrt{9 + 16} = 5$$. 위상 $$\tan^{-1}\frac43 \approx 0.927$$ rad $$\approx 53.13°$$.<br>
**흔한 오답:** 위상을 $$-53.13°$$로 쓰는 것. 그것은 $$X(j2)$$의 위상이다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 다음 신호 가운데 스펙트럼이 실수인 것을 모두 고르고, 나머지는 스펙트럼이 어떤 수인지 쓰라. (a) $$e^{-\lvert t\rvert}$$ (b) $$e^{-t}u(t)$$ (c) $$\sin\omega_0 t$$ (d) $$\cos\omega_0 t$$</summary>


**답:** (a)와 (d). 둘 다 실수이고 짝함수다. (b)는 실수지만 짝함수가 아니어서 스펙트럼이 복소수 $$\frac{1}{1+j\omega}$$다. (c)는 실수이고 홀함수라 순허수 $$\frac{\pi}{j}[\delta(\omega - \omega_0) - \delta(\omega + \omega_0)]$$다.

</details>

[^s1]: [57_real-signal-real-spectrum_plot.py](/Hongs_Blog/studies/human-interface-media/code/57_real-signal-real-spectrum_plot/)로 그렸고, 같은 코드로 $$\omega = \pm1$$의 값 $$0.5 \mp 0.5j$$, $$e^{-\vert t\vert }$$ 스펙트럼의 허수부 0, 두 소리의 크기 $$0.5, 0.25, \frac16$$이 같음을 확인했다.
[^s3]: $$\sin\omega_0 t$$와 $$e^{j\omega_0 t}$$의 변환은 [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/)의 결과다. 수치는 검증 코드로 확인했다.
[^s4]: 옴의 음향 법칙(한쪽 귀는 지속음 성분의 위상 차이에 대체로 둔하다), 두 귀의 시간·위상 차이로 방향을 찾는 것과 위상 단서가 약 1.5 kHz 아래에서 주로 쓰인다는 것, 서로 가까운 고조파가 겹친 소리에서 위상이 음색에 영향을 줄 수 있다는 것은 표준 청각 교재(예: B. C. J. Moore, *An Introduction to the Psychology of Hearing*)의 내용이다.
[^s5]: `numpy.fft.rfft`가 $$\lfloor N/2\rfloor + 1$$개 값을 돌려주는 것은 NumPy 문서의 내용이다. 멜 스펙트로그램이 세기 스펙트럼을 쓰는 것, 한쪽 스펙트럼의 에너지를 두 배로 세는 것은 신호 처리의 표준 내용이다.
{% endraw %}
