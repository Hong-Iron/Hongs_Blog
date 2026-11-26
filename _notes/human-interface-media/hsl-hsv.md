---
layout: "note"
title: "HSL과 HSV"
display_title: "HSL과 HSV (HSL and HSV)"
kind: "concept"
kind_label: "정의"
num: "35"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["HSL", "HSV", "HSB", "HLS", "Hue Saturation Lightness", "Hue Saturation Value", "Hue Saturation Brightness", "육각뿔 색 모델", "hexcone", "크로마", "chroma", "colorsys"]
description: "HSV와 HSL은 모니터의 R, G, B 세 값을 사람이 다루기 쉬운 손잡이 세 개로 바꾼다. 어떤 색 계열인가(색상, 색 원 위의 각도), 얼마나 진한가(채도), 얼마나 밝은가(HSV는 밝기, HSL은 명도)다. 두 모델은 흰색을 두는 자리가 달라서 HSV는 원뿔 하나, HSL은…"
prev_url: "/studies/human-interface-media/color-space/"
prev_title: "색 공간"
next_url: "/studies/human-interface-media/cie-rgb/"
next_title: "CIE RGB 등색 함수"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "35_hsl-hsv_impl.py", "u": "/studies/human-interface-media/code/35_hsl-hsv_impl/", "r": "구현"}, {"t": "35_hsl-hsv_plot.py", "u": "/studies/human-interface-media/code/35_hsl-hsv_plot/", "r": "그림 생성"}]
permalink: "/studies/human-interface-media/hsl-hsv/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

HSV와 HSL은 모니터의 R, G, B 세 값을 사람이 다루기 쉬운 손잡이 세 개로 바꾼다. 어떤 색 계열인가(색상, 색 원 위의 각도), 얼마나 진한가(채도), 얼마나 밝은가(HSV는 밝기, HSL은 명도)다. 두 모델은 흰색을 두는 자리가 달라서 HSV는 원뿔 하나, HSL은 원뿔 두 개 모양이 된다. 계산이 간단해 색 고르기 창에 널리 쓰이지만, RGB를 기하학적으로 다시 적은 것일 뿐이라 밝기 값이 같아도 노랑과 파랑은 눈에 밝기가 전혀 다르게 보인다.

</div>


## 예시로 보기

주황 $$(R, G, B) = (0.8, 0.4, 0.2)$$를 "같은 주황인데 조금 더 연하게" 바꾸고 싶다고 하자. RGB 세 숫자를 각각 얼마나 움직여야 할지는 바로 떠오르지 않는다. 사람은 색을 "무슨 색, 얼마나 진하게, 얼마나 밝게"로 생각하기 때문이다. 이 세 가지를 따로 적는 것이 HSV와 HSL이다.

주황을 단계별로 바꿔 본다.

1. **회색에서 얼마나 떨어졌나.** 가장 큰 값 $$M = 0.8$$(R), 가장 작은 값 $$m = 0.2$$(B)이고, 차이 $$C = 0.6$$이다. 세 값이 같으면 회색이므로, 가장 큰 값과 가장 작은 값의 차이가 "색이 묻은 양"이다. 이 차이를 크로마(chroma)라 부른다.
2. **색상.** 가장 큰 채널이 R이라 빨강(0°) 근처다. 남은 둘 중 G가 B보다 크므로 노랑(60°) 쪽으로 기운다. 기운 정도는 $$(G - B)/C = (0.4 - 0.2)/0.6 = 1/3$$이고, $$60° \times 1/3 = 20°$$다. 빨강에서 노랑 쪽으로 3분의 1 간 주황이다.
3. **HSV의 밝기와 채도.** 밝기 $$V = M = 0.8$$, 채도 $$S = C/V = 0.6/0.8 = 0.75$$.
4. **HSL의 명도와 채도.** 명도 $$L = (M + m)/2 = 0.5$$, 채도 $$S = C/(1 - \vert 2L - 1\vert ) = 0.6/1 = 0.6$$.

같은 주황이 HSV로는 $$(20°, 0.75, 0.8)$$, HSL로는 $$(20°, 0.6, 0.5)$$다. 색상은 같고 나머지 두 값은 정의가 달라 다르다.

이제 연하게 만들기는 쉽다. HSV에서 채도만 반으로 줄여 $$(20°, 0.375, 0.8)$$을 RGB로 되돌리면 $$(0.8, 0.6, 0.5)$$다. 세 값이 동시에 서로 가까워졌다. RGB에서 직접 하려면 이 움직임을 계산해야 했다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/35_hsl-hsv_fig1.svg" alt="그림" width="698" height="362" loading="lazy">

두 그림은 색 원뿔을 색상 0°(빨강, 오른쪽)와 180°(청록, 왼쪽)를 지나게 세로로 자른 단면이다. 가로는 회색 축에서 떨어진 거리(크로마), 세로는 밝기다. 왼쪽 HSV 단면은 아래 꼭짓점이 검정이고, 맨 위 한 줄에 흰색·빨강·청록이 같은 높이로 놓인 삼각형이다. 돌리면 원뿔 하나가 된다. 오른쪽 HSL 단면은 흰색이 위 꼭짓점, 검정이 아래 꼭짓점이고, 빨강과 청록은 가운데 높이(0.5)에 있는 마름모다. 돌리면 원뿔 두 개를 밑면끼리 붙인 모양이 된다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

R, G, B 가운데 가장 큰 값과 가장 작은 값의 차이(크로마)가 회색에서 떨어진 정도다. 색상은 가장 큰 채널이 무엇이고 남은 둘이 어느 쪽으로 기울었는지로 정하는 0°~360°의 각도로, 빨강 0°, 초록 120°, 파랑 240°다. HSV의 밝기는 가장 큰 값이고, 채도는 크로마를 밝기로 나눈 값이다. HSL의 명도는 가장 큰 값과 가장 작은 값의 평균이고, 채도는 크로마를 그 명도에서 낼 수 있는 가장 큰 크로마로 나눈 값이다. 세 값이 모두 같은 회색은 색상이 정해지지 않는다[^s2].

**기호로 쓰면.** $$R, G, B \in [0, 1]$$, $$M = \max(R, G, B)$$, $$m = \min(R, G, B)$$, $$C = M - m$$(크로마).

$$ H = 60° \times \begin{cases} \dfrac{G - B}{C} \bmod 6 & M = R \\[4pt] \dfrac{B - R}{C} + 2 & M = G \\[4pt] \dfrac{R - G}{C} + 4 & M = B \end{cases} \qquad (C = 0\text{이면 정하지 않음}) $$

- HSV(HSB): $$V = M$$, $$S_V = C / V$$ ($$V = 0$$이면 $$S_V = 0$$).
- HSL(HLS): $$L = (M + m)/2$$, $$S_L = C / (1 - \vert 2L - 1\vert )$$ ($$L = 0$$ 또는 $$1$$이면 $$S_L = 0$$).

</div>


색상 식은 "가장 큰 채널의 기준 각도(빨강 0°, 초록 120°, 파랑 240°)에서, 남은 두 채널의 차이만큼 이웃 쪽으로 최대 60° 움직인다"로 읽는다. 앞의 주황은 기준 0°에서 노랑 쪽으로 20° 움직였다.

**원뿔이 하나인 이유.** 가장 작은 값은 0보다 작을 수 없으므로 $$C = M - m \le M = V$$다. 밝기 $$V$$인 높이에서 낼 수 있는 크로마는 $$V$$까지라서, 아래로 갈수록 좁아지는 원뿔 하나가 된다. 맨 위 $$V = 1$$에서는 흰색($$C = 0$$)부터 순수한 빨강($$C = 1$$)까지가 모두 같은 높이다.

**원뿔이 둘인 이유.** $$M = L + C/2 \le 1$$이고 $$m = L - C/2 \ge 0$$이다. 둘을 합치면 $$C \le 2L$$이고 $$C \le 2(1 - L)$$, 곧 $$C \le 1 - \vert 2L - 1\vert $$이다. 가운데 $$L = 0.5$$에서 가장 넓고 위아래로 좁아져 원뿔 두 개가 된다. 흰색은 위 꼭짓점 하나뿐이고, 순수한 색은 가운데 둘레에 있다[^s2].

채도를 크로마 대신 "그 높이에서 낼 수 있는 가장 큰 크로마"로 나눠 0~1로 맞추면, 두 모델 모두 원기둥 모양의 좌표가 된다. 원뿔은 반지름 자리에 크로마를 놓았을 때의 모양이다[^s2].

두 모델은 먼셀 표색계처럼 색상·채도·밝기 세 가지로 색을 나눈다. 다만 먼셀처럼 사람 눈으로 하나하나 맞춘 눈금은 없다. RGB 정육면체를 회색 대각선이 세로가 되게 세워 다시 적은 계산이다[^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 0~1을 10등분한 격자 1331색에서 파이썬 표준 라이브러리 `colorsys`(`rgb_to_hsv`, `rgb_to_hls`)와 일치, HSV → RGB 왕복, 원뿔 조건 $$C \le V$$와 $$C \le 1 - \vert 2L - 1\vert $$, 주황·연한 주황·카드 C2·C3의 값, 노랑과 파랑의 휘도 비 (실험으로 확인됨) — [35_hsl-hsv_impl.py](/Hongs_Blog/studies/human-interface-media/code/35_hsl-hsv_impl/)</div>

</div>


## 활용

- 그림 프로그램의 색 고르기 창, 웹 CSS의 `hsl()` 함수가 이 모델을 쓴다. "색상은 그대로 두고 더 연하게"가 손잡이 하나로 된다[^s4].
- 영상 처리에서 빨간 물체처럼 특정 색 계열을 찾을 때 RGB 대신 색상 $$H$$의 범위로 고른다. 그늘이 져서 밝기가 바뀌어도 색상은 덜 바뀌기 때문이다. 파이썬은 표준 라이브러리 `colorsys`로 바꿀 수 있다[^s4].
- 두 색이 사람 눈에 얼마나 달라 보이는지 재거나, 밝기를 정확히 다뤄야 할 때는 맞지 않는다. 그때는 [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)이나 밝기 신호를 따로 둔 [YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)를 쓴다.

## 연결

- 선수: [색 공간](/Hongs_Blog/studies/human-interface-media/color-space/) (극좌표 방식, 먼셀 표색계), [가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/) (RGB는 빛을 더하는 값)
- 사람 눈 기준의 밝기: [비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/)
- 사람 눈에 맞춘 극좌표 색 공간: [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"HSV의 V(또는 HSL의 L)가 같으면 사람 눈에도 같은 밝기로 보인다"</div>

틀렸다. 이름이 "밝기", "명도"라서 눈이 느끼는 밝기처럼 들린다. $$V$$는 세 채널 중 가장 큰 값일 뿐이고, 어느 채널인지는 따지지 않는다. 노랑 $$(1, 1, 0)$$과 파랑 $$(0, 0, 1)$$은 둘 다 $$V = 1$$, $$L = 0.5$$다. 눈은 초록 쪽 빛에 가장 예민해서, HDTV 표준의 밝기 계수 $$0.2126R + 0.7152G + 0.0722B$$로 재면 노랑은 0.928, 파랑은 0.072로 약 13배 차이 난다. 확인 방법: 화면에 두 색을 띄우고 흑백으로 바꿔 보면 노랑은 거의 흰색, 파랑은 거의 검정이 된다[^s5].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> RGB의 가장 큰 값 $$M$$, 가장 작은 값 $$m$$으로 HSV의 $$V$$와 $$S_V$$, HSL의 $$L$$과 $$S_L$$을 쓰라. 빨강·초록·파랑의 색상 각도도 쓰라.</summary>


**답:** $$C = M - m$$. HSV: $$V = M$$, $$S_V = C/V$$. HSL: $$L = (M + m)/2$$, $$S_L = C/(1 - \vert 2L - 1\vert )$$. 빨강 0°, 초록 120°, 파랑 240°.<br>
**흔한 오답:** HSL의 채도를 HSV처럼 $$C/L$$로 쓰는 것. HSL은 그 명도에서 낼 수 있는 가장 큰 크로마 $$1 - \vert 2L - 1\vert $$로 나눈다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> $$(R, G, B) = (0.2, 0.6, 1.0)$$을 HSV와 HSL로 바꾸라. 단계마다 무엇을 구하는지 쓰라.</summary>


**답:** (1) $$M = 1.0$$(B), $$m = 0.2$$, $$C = 0.8$$. (2) 가장 큰 채널이 B라 기준 240°. $$(R - G)/C + 4 = (0.2 - 0.6)/0.8 + 4 = 3.5$$, $$H = 60° \times 3.5 = 210°$$. 파랑에서 청록(180°) 쪽으로 30° 기울었다. (3) HSV: $$V = 1.0$$, $$S_V = 0.8/1.0 = 0.8$$. (4) HSL: $$L = (1.0 + 0.2)/2 = 0.6$$, $$S_L = 0.8/(1 - \vert 1.2 - 1\vert ) = 0.8/0.8 = 1.0$$.<br>
HSV $$(210°, 0.8, 1.0)$$, HSL $$(210°, 1.0, 0.6)$$.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 연분홍 $$(1.0, 0.8, 0.8)$$은 HSV 채도가 0.2인데 HSL 채도는 1.0이다. 눈에는 흐린 색인데 HSL이 "가장 진하다"고 하는 이유를 설명하라.</summary>


**답:** 크로마는 $$C = 1.0 - 0.8 = 0.2$$로 작다. HSV는 이것을 밝기 $$V = 1$$로 나눠 0.2다. HSL은 명도 $$L = 0.9$$에서 낼 수 있는 가장 큰 크로마 $$1 - \vert 2 \times 0.9 - 1\vert  = 0.2$$로 나눠 1.0이 된다. 명도 0.9는 위 원뿔의 꼭짓점 근처라 원뿔이 좁고, 연분홍은 그 좁은 단면의 가장자리에 있다. HSL 채도 1은 "이 명도에서 낼 수 있는 만큼 진하다"는 뜻이다. 눈에 진해 보이는지와는 다른 이야기다.

</details>

[^s1]: [35_hsl-hsv_plot.py](/Hongs_Blog/studies/human-interface-media/code/35_hsl-hsv_plot/)로 그렸고, 그림에 쓴 값(빨강이 HSV 맨 위 모서리와 HSL 가운데 높이에 있음, HSL 맨 위는 회색 축만 남음)을 같은 코드로 확인했다.
[^s2]: 변환식은 컴퓨터 그래픽스의 표준식이다(HSV는 Smith, 1978, "Color Gamut Transform Pairs", HSL은 Joblove & Greenberg, 1978, "Color Spaces for Computer Graphics"). 원뿔 모양의 유도와 원기둥 설명은 이 식에서 나온다.
[^s3]: HSV와 HSL이 RGB 정육면체의 기하학적 변환이라 먼셀 표색계의 눈금과 같지 않다는 것은 위 두 논문의 설명이다.
[^s4]: CSS의 `hsl()` 함수와 파이썬 `colorsys` 모듈은 각 표준·공식 문서에 있다. 색상 범위로 물체를 고르는 방법은 영상 처리 교재의 흔한 예다.
[^s5]: 밝기 계수는 ITU-R BT.709(HDTV)의 값이고, 감마 보정 전의 선형 RGB 값에 쓴다. 계산은 [35_hsl-hsv_impl.py](/Hongs_Blog/studies/human-interface-media/code/35_hsl-hsv_impl/)로 확인했다.
{% endraw %}
