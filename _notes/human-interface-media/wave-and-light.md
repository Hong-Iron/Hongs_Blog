---
layout: "note"
title: "파동과 빛"
display_title: "파동과 빛 (Waves and Light)"
kind: "concept"
kind_label: "정의"
num: "11"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Wave", "파동", "진폭", "amplitude", "주파수", "frequency", "위상", "phase", "파장", "wavelength", "가시광", "visible light", "공간 주파수", "spatial frequency"]
description: "빛과 소리는 모두 물결(파동)이다. 물결은 높이(진폭), 빠르기(주파수), 출발 시점(위상) 세 가지로 적는다. 같은 물결이지만 귀는 진폭을 소리 크기로, 주파수를 음높이로 읽고, 눈은 진폭을 밝기로, 주파수를 색으로 읽는다. 귀는 시간에 따른 1차원 변화를, 눈은 평면 위 2차원…"
prev_url: "/studies/human-interface-media/center-surround/"
prev_title: "중심-주변 길항"
next_url: "/studies/human-interface-media/image-function/"
next_title: "이미지 함수"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/wave-and-light/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

빛과 소리는 모두 물결(파동)이다. 물결은 높이(진폭), 빠르기(주파수), 출발 시점(위상) 세 가지로 적는다. 같은 물결이지만 귀는 진폭을 소리 크기로, 주파수를 음높이로 읽고, 눈은 진폭을 밝기로, 주파수를 색으로 읽는다. 귀는 시간에 따른 1차원 변화를, 눈은 평면 위 2차원 분포를 정보로 쓴다는 점이 다르다.

</div>


## 예시로 보기

시각과 청각은 일상에서 필요한 정보 대부분을 받아들이는 감각이다. 두 매체의 본질은 파동이지만 쓰임새가 다르다[^1].

| | 청각 | 시각 |
|---|---|---|
| 진폭 $$A$$ | 소리의 크기 | 밝기 |
| 주파수 $$f$$ | 음의 높낮이 | 색깔 |
| 정보의 표현 | 시간에 따른 톤의 변화 (1차원) | 평면 위 밝기와 색의 변화 (2차원) |

파장 500 nm인 청록빛은 1초에 약 $$6.0 \times 10^{14}$$번 진동한다. 가시광 끝의 400 nm는 약 $$7.5 \times 10^{14}$$ Hz, 700 nm는 약 $$4.3 \times 10^{14}$$ Hz다. 파장이 길수록 주파수는 낮다. 소리는 공기 중에서 초속 약 343 m로 가므로, 사람이 듣는 20 Hz~20 kHz는 파장 약 17 m~1.7 cm다[^s1].

가시광은 전자기파 가운데 아주 좁은 구간이다. 슬라이드의 스펙트럼 그림에서 짧은 쪽부터 감마선, X선, 자외선, 가시광(400~700 nm), 적외선, 레이더, FM, TV, AM, 교류 회로 순이다[^2].

시각에는 주파수가 두 종류 나온다[^3].

| | 빛 자체의 주파수 | 공간 주파수 |
|---|---|---|
| 단위 | cycle/second (Hz) | cycle/meter |
| 무엇이 반복되나 | 한 점에서 전자기파의 진동 | 평면 위에서 밝기·색의 변화 |
| 사람이 느끼는 것 | 색깔 | 무늬의 촘촘함 (이미지) |
| 예 | 500 nm 빛: $$6.0 \times 10^{14}$$ Hz | 밝고 어두운 줄 한 쌍이 2 mm: 500 cycle/m |

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

1초에 $$f$$번 오르내리는 물결 모양 신호를 식으로 쓴다. 물결의 높이가 진폭 $$A$$, 출발점이 얼마나 밀려 있는지가 위상 $$\phi$$(파이)다.

단일 주파수의 파동은

$$ s(t) = A \sin(2\pi f t + \phi) $$

로 쓴다. $$A \ge 0$$은 진폭, $$f > 0$$은 주파수(Hz), $$\phi$$는 위상(rad)이다[^1][^s2]. 한 주기는 $$T = 1/f$$다. 파장 $$\lambda$$와 주파수는 파동의 속도 $$c$$로 이어진다[^3].

$$ c = f\lambda, \qquad \lambda = \frac{c}{f} $$

말로 읽으면 "속도 = 1초에 오르내리는 횟수 × 물결 하나의 길이"다. 빛은 진공에서 $$c \approx 3.00 \times 10^8$$ m/s다. 예를 들어 2.4 GHz 와이파이 전파의 파장은 $$3 \times 10^8 / (2.4 \times 10^9) = 0.125$$ m, 즉 12.5 cm다[^s6].

</div>


색깔은 파장의 함수 $$i(\lambda)$$, 곧 파장마다 빛이 얼마나 센지의 분포로 표현한다[^3]. 한 파장만 있는 빛(단색광)은 드물고, 햇빛·전등 빛은 여러 파장이 섞인 분포다.

위상 $$\phi$$는 파동이 언제 시작하는지를 정한다. $$\phi = \pi/2$$만큼 밀린 사인은 코사인이다. 파동 하나만 볼 때는 눈에 띄지 않지만, 여러 파동을 더할 때 서로 보강하는지 상쇄하는지를 정한다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/11_wave-and-light_fig1.svg" alt="그림" loading="lazy">

회색 선이 기준 파동 $$\sin(2\pi t)$$다. 진폭을 바꾸면 높이만, 주파수를 바꾸면 촘촘함만, 위상을 바꾸면 옆으로 놓인 자리만 바뀐다. $$\phi = \pi/2$$인 초록 선은 코사인과 같다[^s7].

진폭과 세기(에너지)는 비례하지 않는다. 한 주기 동안 $$s(t)^2$$의 평균은 $$A^2/2$$이므로, 진폭이 2배면 세기는 4배다[^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 400/500/700 nm의 주파수, 소리 20 Hz·20 kHz의 파장, 평균 제곱 $$A^2/2$$(수치 적분), 위상 $$\pi/2$$ → 코사인, 2 mm 주기 → 500 cycle/m (실험으로 확인됨) — [11_wave-and-light_verify.py](/Hongs_Blog/studies/human-interface-media/code/11_wave-and-light_verify/)</div>

</div>


## 활용

- 강의 계획표에서 이 개념은 3주차 "Light, Electromagnetic Wave & Signal Representation", 6주차 "Image Representation & Spatial Frequency", 9~10주차 소리와 오디오 신호, 11~14주차 푸리에 급수·변환·이산 푸리에 변환·이산 코사인 변환으로 이어진다[^4].
- $$A$$, $$f$$, $$\phi$$ 세 값이 중요한 이유는 푸리에 분해에 있다. 복잡한 소리나 이미지도 여러 사인파의 합으로 쓸 수 있고, 각 사인파는 이 세 값으로 정해진다[^s4].

## 연결

- 선수: [휴먼 인터페이스 미디어](/Hongs_Blog/studies/human-interface-media/human-interface-media/) (자극의 실체는 무엇인가)
- 2차원 공간의 밝기 분포와 공간 주파수: [이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/)
- 밝기를 재는 물리량: [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)
- 색이 파장 하나로 정해지지 않는 이유: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/), [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"빛의 색은 주파수(파장) 하나로 정해진다"</div>

틀렸다. 슬라이드가 "주파수: 색깔"이라 요약해서 그렇게 읽기 쉽다. 단색광에는 맞는 말이지만, 실제 빛은 대부분 여러 파장이 섞인 분포 $$i(\lambda)$$다. 색은 그 분포가 세 종류의 추상체에 만드는 반응으로 정해진다. 확인 방법: 자홍색(마젠타)에 해당하는 단일 파장은 스펙트럼 어디에도 없다. 빨강과 파랑 빛을 섞어야만 보이는 색이다[^s5].

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"진폭이 2배면 밝기도 2배다"</div>

틀렸다. 슬라이드가 "진폭: 밝기"라고 짝지어서 비례로 오해하기 쉽다. 빛의 세기(에너지)는 진폭의 제곱에 비례해 4배가 되고, 사람이 느끼는 밝기는 세기에도 비례하지 않고 훨씬 천천히 는다. 확인 방법: 평균 제곱 $$A^2/2$$ 계산.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 파동을 나타내는 세 파라미터를 쓰고, 청각과 시각에서 각각 무엇에 쓰이는지와 정보 표현의 차원을 쓰라.</summary>


**답:** 진폭 $$A$$, 주파수 $$f$$, 위상 $$\phi$$. 청각: 진폭은 소리 크기, 주파수는 음높이, 시간에 따른 1차원 변화. 시각: 진폭은 밝기, 주파수는 색깔, 평면 위 2차원 변화.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 파장 500 nm인 빛의 주파수를 구하라($$c = 3 \times 10^8$$ m/s). 파장이 700 nm로 길어지면 주파수는 커지는가, 작아지는가?</summary>


**답:** $$f = c/\lambda = 3 \times 10^8 / (500 \times 10^{-9}) = 6.0 \times 10^{14}$$ Hz. 파장이 길어지면 주파수는 작아진다(700 nm는 약 $$4.3 \times 10^{14}$$ Hz).<br>
**흔한 오답:** nm를 $$10^{-9}$$ m로 바꾸지 않아 자릿수가 틀린다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음은 빛 자체의 주파수(cycle/s)와 공간 주파수(cycle/m) 중 어느 쪽 이야기인가? (a) 빨간빛이 파란빛보다 낮다 (b) 체크무늬 셔츠의 칸이 촘촘할수록 높다 (c) 사진을 흐리게 하면 줄어든다</summary>


**답:** (a) 빛 자체의 주파수. 색을 정한다. (b) 공간 주파수. 평면 위 밝기 변화의 촘촘함이다. (c) 공간 주파수. 흐리게 하면 촘촘한 변화(높은 공간 주파수)가 사라진다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.2 (들어가기)
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.4 (가시광)
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.3 (시각 정보), p.19 (요약)
[^4]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Lecture Calendar
[^s1]: 에이전트 보충. 주파수·파장 계산은 $$c = f\lambda$$에 슬라이드의 가시광 범위를 넣은 것이다. 소리의 속도(20 °C 공기에서 약 343 m/s)와 가청 범위 20 Hz~20 kHz는 표준 물리 값이며, 청각은 강의 계획표 9주차에서 다룬다.
[^s2]: 에이전트 보충. 슬라이드는 $$A$$, $$f$$, $$\phi$$의 이름만 적는다. 사인파 식은 표준 표기다.
[^s3]: 에이전트 보충. 세기가 진폭의 제곱에 비례한다는 것은 파동 에너지의 표준 결과다. 느끼는 밝기가 세기보다 천천히 는다는 것은 정신물리학의 표준 결과(예: Stevens의 거듭제곱 법칙)다.
[^s4]: 에이전트 보충. 푸리에 분해와의 연결은 강의 계획표 11~14주차 주제에 비춘 해석이다.
[^s5]: 에이전트 보충. 자홍색이 스펙트럼에 없는 색(비스펙트럼색)이라는 것은 색채학의 표준 사실이다.
[^s6]: 에이전트 보충. 와이파이 예는 원본에 없다. 컴퓨터 통신의 [신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/) 표와 같은 계산이다.
[^s7]: 에이전트 보충. 그림 1장은 원본에 없다. [11_wave-and-light_plot.py](/Hongs_Blog/studies/human-interface-media/code/11_wave-and-light_plot/)로 그렸고, 그림에 쓴 값(위상 $$\pi/2$$인 사인 = 코사인, 진폭 2인 파동의 평균 제곱 2)을 같은 코드로 확인했다.
{% endraw %}
