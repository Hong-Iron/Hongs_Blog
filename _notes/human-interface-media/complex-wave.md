---
layout: "note"
title: "파동의 복소수 표현"
display_title: "파동의 복소수 표현 (Complex Representation of Waves)"
kind: "concept"
kind_label: "정의"
num: "24"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Complex Representation of Waves", "복소 지수 표현", "complex exponential", "오일러 공식", "Euler's formula", "페이저", "phasor", "주기의 정규화"]
description: "사인파는 원 위를 일정하게 도는 점의 그림자다. 그림자 하나만 보면 높이만 남지만, 도는 점 자체를 적으면 높이와 함께 어느 방향으로 얼마나 돌았는지도 남는다. 평면 위의 점을 숫자 하나로 적는 방법이 복소수라서, 파동을 복소수로 쓰면 크기·빠르기·출발 각도가 한 식에 깔끔하게 들…"
prev_url: "/studies/human-interface-media/longitudinal-transverse-wave/"
prev_title: "종파와 횡파"
next_url: "/studies/human-interface-media/digital-image/"
next_title: "디지털 이미지"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/complex-wave/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사인파는 원 위를 일정하게 도는 점의 그림자다. 그림자 하나만 보면 높이만 남지만, 도는 점 자체를 적으면 높이와 함께 어느 방향으로 얼마나 돌았는지도 남는다. 평면 위의 점을 숫자 하나로 적는 방법이 복소수라서, 파동을 복소수로 쓰면 크기·빠르기·출발 각도가 한 식에 깔끔하게 들어간다. 다만 실제로 재는 소리 압력은 실수이므로, 복소수 식에서 한쪽 성분만 꺼내 써야 한다.

</div>


## 예시로 보기

사인파를 식으로 쓰려면 "한 바퀴"를 시간에 맞춰야 한다. 원을 한 바퀴 돌면 각도가 $$2\pi$$만큼 늘고 그림자가 한 주기를 그린다[^1]. $$\sin t$$는 $$t = 2\pi$$에서야 한 주기가 끝난다. 시간 1에서 한 주기를 끝내려면 각도를 $$2\pi t$$로 늘리고, 시간 $$T$$에서 끝내려면 $$2\pi t / T$$로 늘린다. 출발점이 $$x$$축에서 $$\phi$$만큼 돌아간 곳이면 그만큼 더한다[^1].

$$ f(t) = A\sin\!\left(\frac{2\pi t}{T} + \phi\right) $$


$$A = 2$$, $$T = 0.5$$ s, $$\phi = \pi/3$$을 넣으면 $$f(0) = 2\sin(\pi/3) \approx 1.73$$이고, $$t = 0.5$$ s에서 같은 값으로 돌아온다.

그런데 높이 1.73만 보면 원 위의 점이 위로 올라가는 중인지 내려가는 중인지 모른다. 그림자를 하나 더 보면 안다. 가로 그림자 $$A\cos(\cdot)$$와 세로 그림자 $$A\sin(\cdot)$$를 함께 적으면 원 위의 점이 정해진다. 이 두 값을 복소수 하나로 묶는다[^2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/24_complex-wave_fig1.svg" alt="그림" loading="lazy">

왼쪽 원 위의 점이 시계 반대 방향으로 돈다. 점의 세로 위치를 시간에 따라 옮겨 적은 것이 오른쪽 사인 곡선이고, 가로 위치를 옮겨 적으면 코사인이 된다. 점 $$\bullet$$들은 같은 순간을 잇는다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

오일러 공식은 각도 $$\theta$$만큼 돈 단위원 위의 점을 지수 함수로 쓴다($$i$$는 $$i^2 = -1$$인 허수 단위).

$$ e^{i\theta} = \cos\theta + i\sin\theta $$

진폭 $$A > 0$$, 주기 $$T > 0$$, 위상 $$\phi$$인 파동의 **복소수 표현**은

$$ x(t) = A\cos\!\left(\frac{2\pi t}{T} + \phi\right) + iA\sin\!\left(\frac{2\pi t}{T} + \phi\right) = A\,e^{i\left(\frac{2\pi t}{T} + \phi\right)} $$

이다[^2]. 실제 사인파는 이 값의 허수부(세로 성분), 코사인파는 실수부(가로 성분)다.

</div>


강의는 이 식을 한 번 더 나눠 쓴다[^2].

$$ x(t) = e^{(\alpha + i\phi)}\, e^{i\,2\pi t/T} $$


여기서 $$\alpha = \ln A$$, 곧 $$A = e^{\alpha}$$다[^s2]. 앞의 $$e^{\alpha + i\phi} = A e^{i\phi}$$는 시간과 상관없는 상수로, 크기와 출발 각도를 담는다. 뒤의 $$e^{i2\pi t/T}$$는 크기 1로 한 주기 $$T$$마다 한 바퀴 도는 부분이다. 앞의 예 $$A = 2$$, $$\phi = \pi/3$$이면 $$\alpha = \ln 2 \approx 0.693$$이다.

복소수로 쓰면 두 가지가 편하다.

- **크기가 늘 일정하다.** $$\vert x(t)\vert  = A$$다. 실수 사인은 0과 $$A$$ 사이를 오가지만, 원 위의 점은 중심에서 늘 같은 거리에 있다.
- **회전 방향이 구별된다.** $$e^{+i2\pi t}$$와 $$e^{-i2\pi t}$$는 실수부(코사인)가 같아 실수 한 줄로는 구별되지 않는다. 복소수로는 하나는 시계 반대 방향, 하나는 시계 방향으로 도는 점이라 다르다. 강의가 "같은 에너지지만 회전 모양이 다른 파동"을 나타내려고 복소수를 들여오는 이유다[^3].

**파동의 에너지.** 구간 $$t_1 \le t \le t_2$$의 에너지는 $$\int_{t_1}^{t_2} \vert x(t)\vert ^2 dt$$, 평균 에너지(전력)는 $$P_\infty = \lim_{T \to \infty} \frac{1}{2T}\int_{-T}^{T} \vert x(t)\vert ^2 dt$$다[^4]. 복소수 표현은 $$\vert x(t)\vert ^2 = A^2$$이라 전력이 $$A^2$$이고, 실수 사인 $$A\sin(\cdot)$$의 전력은 그 절반인 $$A^2/2$$다. 정의와 성질은 [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/)에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 주기 $$T$$, 오일러 공식, 실수부·허수부와 $$\vert x\vert  = A$$, $$e^{\alpha + i\phi}e^{i2\pi t/T}$$ 분해, 평균 전력 $$A^2/2$$와 $$A^2$$, 회전 방향 구별 (실험으로 확인됨) — [24_complex-wave_verify.py](/Hongs_Blog/studies/human-interface-media/code/24_complex-wave_verify/)</div>

</div>


## 활용

- 강의는 파동을 시간 영역(시점 $$t$$를 변수로)과 주기 영역(주기 $$T$$를 변수로)으로 나눠 볼 수 있다고 소개한다. 공간에서도 1차원은 $$f(x)$$와 $$F(\lambda_x)$$, 2차원은 $$f(x, y)$$와 $$F(\lambda_x, \lambda_y)$$로 쓴다[^5]. 주기나 파장을 변수로 쓰는 쪽이 강의 계획표 11~14주차의 푸리에 급수·변환으로 이어진다.
- 신호 처리에서 사인파를 복소 지수로 다루는 이유도 같다. 크기와 위상을 곱셈 한 번으로 바꿀 수 있다: $$e^{i\theta_1}e^{i\theta_2} = e^{i(\theta_1 + \theta_2)}$$. 자세한 성질은 [연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/)에 있다.

## 연결

- 선수: [종파와 횡파](/Hongs_Blog/studies/human-interface-media/longitudinal-transverse-wave/) (빛의 흔들림이 2차원인 이유), [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)
- 다른 과목에서의 모습: [연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/), [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"복소수 표현은 실제로 허수만큼 흔들리는 파동이 있다는 뜻이다"</div>

틀렸다. 마이크가 재는 압력은 늘 실수다. 복소수 표현은 실제 값(허수부나 실수부 한쪽)과 "원 위 어디쯤인가"라는 정보를 함께 들고 다니려는 장부다. 실제 값이 필요할 때는 한쪽 성분을 꺼낸다. 확인 방법: $$x(t) = 2e^{i(4\pi t + \pi/3)}$$의 허수부는 $$2\sin(4\pi t + \pi/3)$$로, 우리가 처음 쓴 실수 사인파 그대로다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 진폭 $$A$$, 주기 $$T$$, 위상 $$\phi$$인 사인파를 실수 식과 복소수 식으로 쓰라.</summary>


**답:** 실수 식 $$A\sin(2\pi t/T + \phi)$$. 복소수 식 $$A e^{i(2\pi t/T + \phi)} = A\cos(2\pi t/T + \phi) + iA\sin(2\pi t/T + \phi)$$. 실수 사인은 복소수 식의 허수부다.<br>
**흔한 오답:** $$2\pi$$를 빼고 $$A\sin(t/T)$$로 쓰는 것. 그러면 $$t = T$$에서 한 바퀴가 끝나지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> $$e^{i2\pi t}$$와 $$e^{-i2\pi t}$$는 실수부가 같다. 그런데도 복소수로 적어야 둘을 구별할 수 있는 이유를 쓰라.</summary>


**답:** 실수부는 둘 다 $$\cos 2\pi t$$라 실수 한 줄만 보면 같다. 허수부는 $$+\sin 2\pi t$$와 $$-\sin 2\pi t$$로 부호가 반대다. 원 위의 점으로 보면 하나는 시계 반대 방향, 하나는 시계 방향으로 돈다. 회전 방향 같은 2차원 정보는 실수 하나에 담기지 않아 복소수가 필요하다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> $$x(t) = 3e^{i(2\pi t/0.01 + \pi/2)}$$의 진폭, 주기, 주파수, 위상, 그리고 $$\alpha$$를 구하라. 실수부는 어떤 함수인가?</summary>


**답:** 진폭 3, 주기 0.01 s, 주파수 100 Hz, 위상 $$\pi/2$$, $$\alpha = \ln 3 \approx 1.10$$. 실수부는 $$3\cos(200\pi t + \pi/2) = -3\sin(200\pi t)$$다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/04.HIM_강의04_파동의표현.pdf, p.5 (파동의 시간 함수: 1주기는 1회전, 주기의 정규화, 위상)
[^2]: 같은 자료, p.8 (오일러 공식, 1차원 진동을 복소 평면으로 확대, 파동의 기본 표현 $$x(t) = Ae^{i(2\pi t/T + \phi)} = e^{(\alpha + i\phi)}e^{i(2\pi t/T)}$$). 같은 식이 요약 p.10에 반복된다.
[^3]: 같은 자료, p.7 (동일한 에너지의 파동이지만 회전 모양이 다른 파동을 표현하는 방법, 2차원 수 복소수)
[^4]: 같은 자료, p.9 (파동의 에너지)
[^5]: 같은 자료, p.4 (파동의 표현: 시간 영역 $$F(t)$$, $$F(T)$$, 공간 영역 $$f(x)$$, $$F(\lambda_x)$$, $$f(x,y)$$, $$F(\lambda_x, \lambda_y)$$)
[^s1]: 에이전트 보충. 그림 1장은 원본 p.5의 회전-사인 그림을 같은 원리로 다시 계산해 그린 것이다. [24_complex-wave_plot.py](/Hongs_Blog/studies/human-interface-media/code/24_complex-wave_plot/)로 그렸고, 점의 세로 위치가 $$\sin$$, 가로 위치가 $$\cos$$와 같은지를 같은 코드로 확인했다.
[^s2]: 에이전트 보충. 슬라이드는 $$\alpha$$를 정의하지 않는다. $$Ae^{i\phi} = e^{\alpha + i\phi}$$가 되려면 $$A = e^\alpha$$, 곧 $$\alpha = \ln A$$여야 한다. 실수 사인을 복소수의 허수부로 읽는 해석, 회전 방향 예, 실수와 복소수 전력의 비교, 카드 C2·C3은 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
