---
layout: "note"
title: "곱셈 성질과 진폭 변조"
display_title: "곱셈 성질과 진폭 변조 (Multiplication Property and Amplitude Modulation)"
kind: "concept"
kind_label: "정리"
num: "43"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Multiplication Property", "곱셈 성질", "Product Property", "진폭 변조", "Amplitude Modulation", "AM", "변조", "Modulation", "복조", "Demodulation", "반송파", "Carrier", "반송 주파수", "Carrier Frequency", "가변 중심 주파수 대역 통과 필터"]
description: "컨벌루션 성질의 쌍대로, 시간 영역에서 두 신호를 곱하면 주파수 영역에서는 두 스펙트럼을 컨벌루션한 것(\\frac{1}{2\\pi}배)이 된다. 특히 신호에 정현파 \\cos\\omega0t를 곱하면 스펙트럼이 통째로 \\pm\\omega0로 옮겨진다. 라디오는 이렇게 목소리를 높은 주파수…"
prev_url: "/studies/signals-and-systems/convolution-property/"
prev_title: "컨벌루션 성질과 주파수 응답"
next_url: "/studies/signals-and-systems/lccde-frequency-response/"
next_title: "미분방정식 시스템의 주파수 응답"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/multiplication-modulation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컨벌루션 성질의 쌍대로, 시간 영역에서 두 신호를 곱하면 주파수 영역에서는 두 스펙트럼을 컨벌루션한 것($$\frac{1}{2\pi}$$배)이 된다. 특히 신호에 정현파 $$\cos\omega_0t$$를 곱하면 스펙트럼이 통째로 $$\pm\omega_0$$로 옮겨진다. 라디오는 이렇게 목소리를 높은 주파수(반송파)에 실어 보내고(진폭 변조), 받는 쪽에서 다시 곱하고 저역 통과 필터로 걸러 되살린다(복조). 옮긴 두 스펙트럼이 겹치지 않으려면 반송 주파수가 신호의 최고 주파수보다 커야 한다.

</div>


## 예시로 보기

메시지 $$s(t)$$(예: 음성)의 스펙트럼 $$S(j\omega)$$는 $$\vert \omega\vert  < \omega_1$$에만 있다. 반송파 $$p(t) = \cos\omega_0t$$를 곱한다(예제 4.21)[^1].

- 반송파의 변환: $$P(j\omega) = \pi\delta(\omega - \omega_0) + \pi\delta(\omega + \omega_0)$$(예제 4.7).
- 곱셈 성질과 $$X * \delta(\omega - \omega_0) = X(\omega - \omega_0)$$로 $$R(j\omega) = \frac12S(j(\omega - \omega_0)) + \frac12S(j(\omega + \omega_0))$$.
- $$\omega_0 > \omega_1$$이면 옮겨진 두 덩어리가 겹치지 않는다(그림 4.23). 메시지의 정보가 그대로 높은 주파수로 옮겨졌다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">곱셈 성질</div>

$$r(t) = s(t)p(t) \overset{\mathcal{F}}{\longleftrightarrow} R(j\omega) = \frac{1}{2\pi}\int_{-\infty}^{\infty}S(j\theta)P(j(\omega - \theta))d\theta = \frac{1}{2\pi}S(j\omega) * P(j\omega)$$

[^2]

</div>


시간 영역 컨벌루션이 주파수 영역 곱이었으므로, 쌍대성으로 시간 영역 곱은 주파수 영역 컨벌루션이다. 한 신호에 다른 신호를 곱해 크기를 조절하는 것을 변조라 하고, 정현파를 곱하는 것을 진폭 변조라 한다[^2]. 진폭 변조를 쓰면 반송 주파수를 달리해 한 공간에서 여러 채널을 보낼 수 있고, 높은 주파수가 전송에 유리하다[^s1].

## 예제

**예제 4.22 복조**[^3]. 받은 $$r(t)$$에 다시 $$\cos\omega_0t$$를 곱한다: $$g(t) = r(t)\cos\omega_0t$$.

- $$G(j\omega) = \frac12[R(j(\omega - \omega_0)) + R(j(\omega + \omega_0))] = \frac14S(j(\omega - 2\omega_0)) + \frac12S(j\omega) + \frac14S(j(\omega + 2\omega_0))$$(그림 4.24).
- 가운데 $$\frac12S(j\omega)$$가 원래 메시지이고, $$\pm2\omega_0$$ 근처에 고주파 성분이 붙었다.
- $$\vert \omega\vert  < \omega_1$$을 통과시키는 저역 통과 필터로 거르면 $$\frac12s(t)$$, 곧 크기만 바뀐 메시지가 복원된다.

**예제 4.23 sinc 두 개의 곱**[^4]. $$x(t) = \frac{\sin t\sin(t/2)}{\pi t^2} = \pi\left(\frac{\sin t}{\pi t}\right)\left(\frac{\sin(t/2)}{\pi t}\right)$$.

- 각 sinc의 변환은 폭 1, 폭 $$\frac12$$인 사각형(높이 1).
- 곱셈 성질: $$X = \frac{1}{2\pi}\cdot\pi\cdot(\text{두 사각형의 컨벌루션}) = \frac12(\text{사각형} * \text{사각형})$$.
- 결과는 사다리꼴: $$\vert \omega\vert  \le \frac12$$에서 $$\frac12$$, $$\frac12 \le \vert \omega\vert  \le \frac32$$에서 0까지 곧게 줄어듦(그림 4.25).

**가변 중심 주파수 대역 통과 필터**[^5]. 저항·축전기로 만든 대역 통과 필터는 중심 주파수를 정확히 바꾸기 어렵다. 대신 필터는 고정하고 신호의 스펙트럼을 옮긴다(그림 4.26).

1. 입력에 $$e^{j\omega_ct}$$를 곱한다: $$Y(j\omega) = X(j(\omega - \omega_c))$$, 스펙트럼이 $$\omega_c$$만큼 오른쪽으로.
2. 고정된 이상적 저역 통과 필터($$\vert \omega\vert  < \omega_0$$)를 지난다: 원래 $$-\omega_c$$ 근처 성분만 남는다.
3. $$e^{-j\omega_ct}$$를 곱한다: $$F(j\omega) = W(j(\omega + \omega_c))$$, 왼쪽으로 되돌린다.
4. 전체는 중심 $$-\omega_c$$, 대역폭 $$2\omega_0$$인 이상적 대역 통과 필터와 같다(그림 4.28). 실수 부분을 취하면 $$\pm\omega_c$$ 대칭 필터가 된다(그림 4.29~4.30). 발진기 주파수 $$\omega_c$$를 다이얼로 바꾸면 중심 주파수가 바뀐다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 가우스 꼴 메시지로 예제 4.21의 $$R$$, 예제 4.22의 $$G$$와 복원값, 예제 4.23의 사다리꼴, $$e^{j\omega_ct}$$ 곱셈의 스펙트럼 이동을 수치 적분으로 확인 — [43_multiplication-modulation_verify.py](/Hongs_Blog/studies/signals-and-systems/code/43_multiplication-modulation_verify/)</div>

</div>


## 활용

- AM 라디오, 무선 통신의 주파수 분할 다중화가 이 원리다 → [신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/)
- 4장의 요약대로, 곱셈 성질(임펄스 열과의 곱)은 표본화 시스템의 주파수 해석의 기반이다. 신호에 임펄스 열을 곱하면 스펙트럼이 $$\frac{2\pi}{T}$$ 간격으로 복사된다 → [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)[^6]

## 연결

- 선수: [푸리에 변환의 쌍대성](/Hongs_Blog/studies/signals-and-systems/fourier-duality/), [주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/) ($$\cos\omega_0t$$의 변환)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$s(t)$$의 스펙트럼이 $$\vert \omega\vert  < 100$$에만 있다. $$s(t)\cos(1000t)$$의 스펙트럼은 어디에 있는가?</summary>

**답:** $$900 < \vert \omega\vert  < 1100$$, 곧 $$\pm1000$$을 중심으로 폭 200인 두 덩어리(각 높이 $$\frac12$$배).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 진폭 변조에서 반송 주파수 $$\omega_0$$가 메시지의 최고 주파수 $$\omega_1$$보다 커야 하는 이유는?</summary>

**답:** 스펙트럼이 $$\pm\omega_0$$로 옮겨질 때 각 덩어리의 폭이 $$\pm\omega_1$$이다. $$\omega_0 < \omega_1$$이면 두 덩어리가 $$\omega = 0$$ 근처에서 겹쳐 섞이고, 복조로 원래 메시지를 되살릴 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 시간 영역에서 ① 곱하기 ② 컨벌루션은 주파수 영역에서 각각 무엇이 되는가?</summary>

**답:** ① $$\frac{1}{2\pi}$$배 컨벌루션 ② 곱하기.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/15.Week15_CH04_3_handout.pdf, p.16~17 (예제 4.21, 그림 4.23)
[^2]: 같은 자료, p.15
[^3]: 같은 자료, p.18~19 (예제 4.22, 그림 4.24)
[^4]: 같은 자료, p.20 (예제 4.23, 그림 4.25)
[^5]: 같은 자료, p.21~22 (그림 4.26~4.30)
[^6]: 같은 자료, p.32, p.33
[^s1]: 에이전트 보충. 반송 주파수 조건의 설명과 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
