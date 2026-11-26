---
layout: "note"
title: "CIE XYZ"
display_title: "CIE XYZ (CIE 1931 XYZ Color Space)"
kind: "concept"
kind_label: "정의"
num: "37"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["CIE XYZ", "CIE 1931 XYZ", "CIE 1931 color space", "XYZ 색 공간", "XYZ 등색 함수", "XYZ Color Matching Functions", "표준 관찰자", "standard observer", "색도 좌표", "chromaticity coordinates", "Chromaticity Value", "xyY", "가상 원색", "imaginary primaries", "등에너지 백색", "equal-energy white", "illuminant E"]
description: "CIE XYZ는 CIE RGB의 세 원색 빛을, 실제로는 만들 수 없는 가상의 세 원색 X, Y, Z로 바꿔 쓴 색 주소다. 가상 원색을 잘 골라서 사람이 볼 수 있는 모든 색이 음수 없이 적히고, 세 값 중 Y 하나가 곧 눈이 느끼는 밝기가 되게 했다. RGB 세 값을 정해진 비…"
prev_url: "/studies/human-interface-media/cie-rgb/"
prev_title: "CIE RGB 등색 함수"
next_url: "/studies/human-interface-media/chromaticity-diagram/"
next_title: "색도도"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "37_cie-xyz_plot.py", "u": "/studies/human-interface-media/code/37_cie-xyz_plot/", "r": "그림 생성"}, {"t": "37_cie-xyz_verify.py", "u": "/studies/human-interface-media/code/37_cie-xyz_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/cie-xyz/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

CIE XYZ는 CIE RGB의 세 원색 빛을, 실제로는 만들 수 없는 가상의 세 원색 X, Y, Z로 바꿔 쓴 색 주소다. 가상 원색을 잘 골라서 사람이 볼 수 있는 모든 색이 음수 없이 적히고, 세 값 중 Y 하나가 곧 눈이 느끼는 밝기가 되게 했다. RGB 세 값을 정해진 비율로 다시 섞어 계산한 것이라, 빛을 섞으면 값을 더하면 된다는 성질도 그대로다. 대신 X, Y, Z 원색은 존재하지 않는 빛이라 이것으로 화면을 만들 수는 없고, XYZ에서 잰 거리는 사람이 느끼는 색 차이와 맞지 않는다.

</div>


## 예시로 보기

[CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/)에서 선명한 청록은 $$-38R + 42G + 91B$$였다. 빨강이 음수다. 1931년에는 색 계산을 손과 기계식 계산기로 했고, 측정 기계도 음수를 내기 어려웠다. 표의 숫자마다 부호를 따지는 일은 실수의 원인이었다[^s1]. 그래서 CIE는 원색을 바꿔 모든 값이 양수가 되는 좌표를 만들었다.

바꾸는 방법은 행렬 하나를 곱하는 것이다.

$$ \begin{bmatrix} X \\ Y \\ Z \end{bmatrix} = \frac{1}{0.17697} \begin{bmatrix} 0.49 & 0.31 & 0.20 \\ 0.17697 & 0.81240 & 0.01063 \\ 0.00 & 0.01 & 0.99 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix} $$


선명한 청록 $$(R, G, B) = (-38, 42, 91)$$을 넣어 한 줄씩 계산한다.

1. **X.** 첫째 줄을 곱해 더한다. $$0.49 \times (-38) + 0.31 \times 42 + 0.20 \times 91 = -18.62 + 13.02 + 18.20 = 12.60$$. 앞의 $$1/0.17697$$을 곱하면 $$X \approx 71.20$$이다.
2. **Y.** 둘째 줄. $$0.17697 \times (-38) + 0.81240 \times 42 + 0.01063 \times 91 = -6.725 + 34.121 + 0.967 = 28.363$$. 나누면 $$Y \approx 160.27$$이다.
3. **Z.** 셋째 줄. $$0 \times (-38) + 0.01 \times 42 + 0.99 \times 91 = 0.42 + 90.09 = 90.51$$. 나누면 $$Z \approx 511.44$$이다.

$$(X, Y, Z) \approx (71.20, 160.27, 511.44)$$로 세 값이 모두 양수다. 빨강의 음수가 X 줄의 다른 양수 항에 흡수됐다.

파장마다 같은 계산을 하면 XYZ의 등색 함수 $$\bar x(\lambda), \bar y(\lambda), \bar z(\lambda)$$가 나온다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/37_cie-xyz_fig1.svg" alt="그림" width="603" height="350" loading="lazy">

왼쪽부터 보면, 파랑 곡선 $$\bar z$$는 약 445 nm에서 1.78쯤으로 가장 높다. 주황 곡선 $$\bar x$$는 약 442 nm에 작은 봉우리, 약 600 nm에 큰 봉우리가 있는 두 봉우리 모양이다. 초록 곡선 $$\bar y$$는 555 nm 근처에서 1이고, 빈 점으로 찍은 비시감 효율 $$V(\lambda)$$ 표를 그대로 지난다. 세 곡선 모두 0 아래로 내려가지 않는다. 오른쪽 회색 띠(650 nm 위)에서는 $$\bar z$$가 0이다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

CIE XYZ는 CIE RGB 삼자극치에 정해진 $$3 \times 3$$ 행렬을 곱해 얻는 세 값 $$X, Y, Z$$다. 같은 행렬을 RGB 등색 함수에 곱하면 XYZ 등색 함수 $$\bar x, \bar y, \bar z$$가 되고, 어떤 빛의 $$X, Y, Z$$는 그 빛의 스펙트럼에 이 함수를 곱해 380~780 nm에서 적분한 값이다. 밝기를 뺀 색만 볼 때는 $$X, Y, Z$$를 셋의 합으로 나눈 색도 좌표 $$x, y, z$$를 쓴다.

**기호로 쓰면.**
- 행렬: 위의 $$[X\ Y\ Z]^\top = \frac{1}{0.17697} M [R\ G\ B]^\top$$. $$M$$(위 $$3 \times 3$$ 행렬), $$R, G, B$$(CIE RGB 삼자극치).
- 스펙트럼에서: $$X = \displaystyle\int_{380}^{780} I(\lambda)\,\bar x(\lambda)\,d\lambda$$, $$Y = \displaystyle\int_{380}^{780} I(\lambda)\,\bar y(\lambda)\,d\lambda$$, $$Z = \displaystyle\int_{380}^{780} I(\lambda)\,\bar z(\lambda)\,d\lambda$$. $$I(\lambda)$$(스펙트럼), $$\bar x, \bar y, \bar z$$(XYZ 등색 함수).
- 색도 좌표: $$x = \dfrac{X}{X + Y + Z}$$, $$y = \dfrac{Y}{X + Y + Z}$$, $$z = \dfrac{Z}{X + Y + Z} = 1 - x - y$$.
- 섞기: 가상 원색 빛을 $$\mathbf{X}, \mathbf{Y}, \mathbf{Z}$$라 하면 색은 $$C = X\mathbf{X} + Y\mathbf{Y} + Z\mathbf{Z}$$이고, 두 빛을 섞으면 $$X, Y, Z$$ 값끼리 더한다.

</div>


색도 좌표 식은 "세 값 가운데 X가 차지하는 몫"으로 읽는다. 선명한 청록이면 $$X + Y + Z \approx 742.91$$이고 $$x \approx 71.20 / 742.91 \approx 0.0958$$, $$y \approx 0.2157$$이다.

섞기 식을 셋의 합 $$X + Y + Z$$로 나누면 $$x\mathbf{X} + y\mathbf{Y} + z\mathbf{Z}$$가 된다. $$C = xX + yY + zZ$$가 바로 이 식이다. 밝기를 $$X + Y + Z = 1$$로 맞춘 색을 색도 좌표로 적는다[^s3]. 색도 좌표 두 개 $$(x, y)$$에 밝기 $$Y$$를 붙이면 원래 값으로 되돌아간다. $$X = \dfrac{x}{y}Y$$, $$Z = \dfrac{1 - x - y}{y}Y$$다. 이렇게 적는 방식을 xyY라 부른다.

두 정의(행렬과 적분)는 같은 값을 준다. 적분은 덧셈이라 행렬 곱과 순서를 바꿀 수 있다. $$\bar x, \bar y, \bar z$$가 $$\bar r, \bar g, \bar b$$에 행렬을 곱한 것이므로, $$X = \int I\bar x\,d\lambda$$는 $$\int I\bar r\,d\lambda = R$$ 등에 같은 행렬을 곱한 것과 같다.

### 설계 이유: 다섯 조건

CIE는 행렬을 고를 때 다섯 조건을 걸었다.

| 조건 | 쉬운 뜻 | 행렬이 맞추는 방법 |
|---|---|---|
| 1. RGB에서 선형 변환으로 얻고, 모든 값이 양수 | 섞기는 여전히 덧셈이고, 실제 색은 음수 없이 적힌다 | $$3 \times 3$$ 행렬. $$\bar x, \bar y, \bar z \ge 0$$이 되게 고른다 |
| 2. $$\bar y(\lambda)$$ = CIE 표준 관찰자의 $$V(\lambda)$$ | $$Y$$ 하나가 눈이 느끼는 밝기다 | 둘째 줄이 세 원색의 밝기 비 $$0.17697 : 0.81240 : 0.01063 = 1 : 4.5907 : 0.0601$$ |
| 3. 흰색은 $$x = y = z = 1/3$$ | 모든 파장의 세기가 같은 흰빛(등에너지 백색)이 색도의 한가운데 | 세 줄의 합이 모두 1 |
| 4. 볼 수 있는 모든 색은 $$(1, 0)$$, $$(0, 0)$$, $$(0, 1)$$ 삼각형 안 | 색도 $$(x, y)$$가 0 이상이고 $$x + y \le 1$$ | 조건 1에서 따라 나온다 |
| 5. 650 nm 위에서 $$\bar z = 0$$으로 두어도 실험 오차 안 | 긴 파장 빛은 $$Z$$에 보태지 않는다 | 셋째 줄이 R에 0, G에 0.01만 준다 |

조건 3의 "흰색"은 모든 파장의 세기가 같은 가상의 흰빛(등에너지 백색, 표준 광원 E)이다. 햇빛을 흉내 낸 표준 광원 D65(색온도 약 6500 K)의 색도는 $$(0.3127, 0.3290)$$으로 이 점과 조금 다르다[^s4].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 각 줄의 합 1과 $$x = y = z = 1/3$$, $$Y = R + 4.5907G + 0.0601B$$, 원색의 색도와 표준 스펙트럼 궤적, 선명한 청록과 청록의 XYZ와 색도, 섞은 색의 색도가 무게 중심, xyY 되돌리기, 행렬식 0.3401 (계산으로 증명됨). 근사 곡선 $$\bar x, \bar y, \bar z \ge 0$$, $$\bar y$$와 $$V$$ 표 차이 0.007, 650 nm 위 $$\bar z < 10^{-6}$$, 세 넓이 0.2% 안 (실험으로 확인됨) — [37_cie-xyz_verify.py](/Hongs_Blog/studies/human-interface-media/code/37_cie-xyz_verify/)</div>

</div>


## 증명

행렬의 줄마다 계산하면 다섯 조건 가운데 셋(2, 3, 4)과 원색의 위치가 바로 나온다.

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


**(1) 같은 양의 RGB는 $$x = y = z = 1/3$$이다.**

1. $$R = G = B = k$$라 하자.
2. $$X = (0.49 + 0.31 + 0.20)k / 0.17697 = k / 0.17697$$. (근거: 첫째 줄의 합이 1)
3. $$Y = (0.17697 + 0.81240 + 0.01063)k / 0.17697 = k / 0.17697$$. (근거: 둘째 줄의 합이 1)
4. $$Z = (0.00 + 0.01 + 0.99)k / 0.17697 = k / 0.17697$$. (근거: 셋째 줄의 합이 1)
5. $$X = Y = Z$$이므로 $$x = y = z = 1/3$$이다. (근거: 색도 좌표의 정의)
6. 모든 파장의 세기가 같은 빛은 $$R = G = B$$라서 $$(1/3, 1/3)$$에 온다. (근거: CIE RGB 등색 함수 세 곡선의 넓이가 같다)

**(2) $$Y$$는 밝기이고 $$\bar y = V$$다.**

1. 둘째 줄을 0.17697로 나누면 $$Y = R + 4.5907G + 0.0601B$$다. (근거: 대수 변형)
2. 계수 $$1 : 4.5907 : 0.0601$$은 CIE RGB 세 원색 1단위의 밝기 비다. 그래서 $$Y$$는 섞은 빛의 밝기를 빨강 원색 밝기 단위로 잰 값이다. (근거: 밝기는 섞으면 더해진다는 가정, 아브니 법칙)
3. 파장 $$\lambda$$의 단색광 1단위와 똑같아 보이는 혼합은 $$\bar r(\lambda)R + \bar g(\lambda)G + \bar b(\lambda)B$$이고, 똑같아 보이는 두 빛은 밝기도 같다. (근거: 등색 함수의 정의)
4. 따라서 $$\bar y(\lambda) = \bar r(\lambda) + 4.5907\,\bar g(\lambda) + 0.0601\,\bar b(\lambda)$$는 단색광 1단위의 밝기, 곧 $$V(\lambda)$$에 비례한다. 크기를 맞추면 $$\bar y = V$$다.

**(3) 실제 빛의 색도는 삼각형 $$(1, 0)$$, $$(0, 0)$$, $$(0, 1)$$ 안에 있다.**

1. $$I(\lambda) \ge 0$$이고 $$\bar x, \bar y, \bar z \ge 0$$이므로 $$X, Y, Z \ge 0$$이다. (근거: 조건 1, 음이 아닌 함수의 적분)
2. 따라서 $$x \ge 0$$, $$y \ge 0$$이고 $$x + y = 1 - z \le 1$$이다. (근거: 색도 좌표의 정의)

**(4) CIE RGB 원색은 단색광이 놓이는 테두리 위에 있다.**

빨강 원색 $$(1, 0, 0)$$은 $$(X, Y, Z) = (2.7688, 1, 0)$$이고 색도 $$(0.7347, 0.2653)$$이다. 초록 $$(0, 1, 0)$$은 $$(0.2738, 0.7174)$$, 파랑 $$(0, 0, 1)$$은 $$(0.1666, 0.0089)$$다. 세 원색은 700, 546.1, 435.8 nm의 단색광이므로, 단색광의 색도를 이은 곡선(스펙트럼 궤적)의 그 파장 자리에 놓여야 한다. CIE 1931 표준 표의 값과 소수 넷째 자리까지 같다[^s5].

**(5) 섞은 색의 색도는 두 색도의 무게 중심이다.**

1. 두 빛의 합을 $$S_1 = X_1 + Y_1 + Z_1$$, $$S_2 = X_2 + Y_2 + Z_2$$라 하자.
2. 섞은 빛은 $$X = X_1 + X_2 = S_1x_1 + S_2x_2$$이고 합은 $$S_1 + S_2$$다. (근거: 섞기 = 더하기, $$X_k = S_k x_k$$)
3. 따라서 $$x = \dfrac{S_1x_1 + S_2x_2}{S_1 + S_2}$$이고, $$y$$도 같다. 두 색도를 $$S_1 : S_2$$로 무게를 매긴 평균이다. 이것을 쓰는 계산은 [색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/)에서 한다.

</details>

### 스스로 설명해 보기

1. "$$R = G = B$$이면 $$X = Y = Z$$다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   행렬 $$M$$의 세 줄의 합이 모두 1이다. 같은 값 $$k$$에 각 줄을 곱해 더하면 줄의 합 × $$k$$ = $$k$$가 되고, 같은 수 0.17697로 나누므로 셋이 같다.
   </details>
2. "$$\bar y(\lambda)$$는 $$V(\lambda)$$와 같다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   둘째 줄이 세 원색의 밝기 비라서 $$Y$$는 섞은 빛의 밝기다. 단색광과 똑같아 보이게 섞은 빛은 밝기도 같으므로, $$\bar y(\lambda)$$는 그 단색광의 밝기 $$V(\lambda)$$다. 밝기가 섞을 때 더해진다는 가정이 필요하다.
   </details>
3. "실제 빛은 $$x + y \le 1$$이다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   세 등색 함수가 0 이상이고 스펙트럼도 0 이상이라 $$X, Y, Z \ge 0$$이다. $$z = 1 - x - y \ge 0$$이므로 $$x + y \le 1$$이다.
   </details>
- 이 증명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  원색을 바꾸는 일은 행렬 곱 하나다. 행렬의 각 줄을 원하는 성질(줄의 합 1 → 흰색이 가운데, 둘째 줄 = 밝기 비 → $$Y$$가 밝기, 등색 함수가 양수 → 음수 없음)에 맞춰 고른다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  모니터 sRGB와 XYZ 사이의 변환, 카메라 센서의 RGB를 표준 색으로 바꾸는 색 보정 행렬, 영상의 RGB를 밝기 줄과 색차 줄로 바꾸는 YCbCr([YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)). 모두 "줄마다 목적을 정한 $$3 \times 3$$ 행렬"이다.
  </details>

## 예제

XYZ로 적은 실제 색과, XYZ 숫자처럼 보이지만 실제 빛의 색이 아닌 것을 나란히 둔다.

| | RGB | XYZ | 색도 $$(x, y)$$ | 실제 빛인가 |
|---|---|---|---|---|
| 같은 에너지 흰빛 | $$(1, 1, 1)$$ | $$(5.6507, 5.6507, 5.6507)$$ | $$(1/3, 1/3)$$ | 그렇다 |
| CIE RGB 빨강 원색 (700 nm) | $$(1, 0, 0)$$ | $$(2.7688, 1, 0)$$ | $$(0.7347, 0.2653)$$ | 그렇다 |
| 청록 | $$(7, 33, 39)$$ | $$(121.26, 160.83, 220.04)$$ | $$(0.2415, 0.3203)$$ | 그렇다 |
| X 원색 자체 | $$(0.4185, -0.0912, 0.0009)$$ | $$(1, 0, 0)$$ | $$(1, 0)$$ | 아니다 |
| 음수가 섞인 값 | $$(-0.8186, 0.6117, 0.1726)$$ | $$(-1, 2, 1)$$ | $$(-0.5, 1)$$ | 아니다 |

빨강 원색의 $$Z = 0$$은 조건 5와 맞는다. 700 nm는 650 nm보다 길어서 $$\bar z = 0$$이다.

$$(1, 0, 0)$$이 실제 빛이 아닌 이유는 이렇다. $$Y = 0$$이면 밝기가 전혀 없는 빛인데 $$X$$만 1이라는 뜻이다. 380~780 nm에서 $$\bar y > 0$$이므로 어느 파장에든 에너지가 있으면 $$Y > 0$$이 된다. 그래서 $$Y = 0$$이면서 $$X > 0$$인 실제 빛은 없다. 색도 $$(1, 0)$$은 빨간 단색광이 닿는 가장 바깥 점 $$(0.7347, 0.2653)$$보다도 바깥이다. X, Y, Z를 가상 원색이라 부르는 이유다.

음수가 섞인 값은 조건 1 때문에 나올 수 없다. 스펙트럼과 세 등색 함수가 모두 0 이상이라 적분도 0 이상이다. 색도도 $$x = -0.5$$로 삼각형 밖이다. RGB 열을 보면 X 원색도 G가 음수인 "섞을 수 없는 혼합"이다. 다만 RGB에 음수가 있다는 것만으로 가짜 색이 되지는 않는다. 선명한 청록도 R이 음수지만 실제 빛이다.

## 활용

- 색을 재는 기계(색채계, 분광 측색계)는 보통 $$XYZ$$나 $$xyY$$로 결과를 낸다. 기기와 상관없이 같은 숫자가 나오는 표준 좌표이기 때문이다. 오늘날 색 관리의 바탕이다[^s6].
- 모니터 표준 sRGB는 원색과 흰색을 XYZ의 색도로 정하고, sRGB와 XYZ를 $$3 \times 3$$ 행렬로 오간다. 서로 다른 기기 사이에서 색을 옮길 때 XYZ(또는 XYZ에서 계산한 Lab)를 가운데 다리로 쓴다[^s6].
- 사람 눈에 맞춘 색 공간 [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)은 XYZ에서 계산한다. 두 공간의 차이는 [CIE XYZ와 CIE Lab 비교](/Hongs_Blog/studies/human-interface-media/xyz-vs-lab/)에 있다.
- 색도 좌표로 광원을 섞는 계산은 [색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/)에서 연습한다.

## 연결

- 선수: [CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/) (행렬을 곱할 대상), [비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/) ($$\bar y = V$$)
- 색도 좌표를 평면에 그린 것: [색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/)
- XYZ의 거리가 사람의 느낌과 맞지 않는다는 것: [맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/)
- 원색을 바꾸는 행렬은 선형대수의 기저 바꾸기다: [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/), 되돌리기는 [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"XYZ의 X, Y, Z는 빨강·초록·파랑 빛이다"</div>

틀렸다. RGB 다음에 나오는 세 글자라 같은 역할로 보이기 쉽다. X, Y, Z는 모든 색을 양수로 적기 위해 수학적으로 고른 가상의 원색이고, 실제로 내는 빛이 없다. $$Y$$는 밝기를 나타낸다. 예를 들어 CIE RGB 빨강 원색도 $$Y = 1$$을 가진다. 확인 방법: 예제 표에서 $$(1, 0, 0)$$의 색도 $$(1, 0)$$은 가장 바깥의 단색광 $$(0.7347, 0.2653)$$보다 더 바깥이다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"색도 좌표 $$(x, y)$$만 알면 색을 다 안다"</div>

틀렸다. 색도도 한 장에 모든 색이 그려져 있어서 그렇게 보인다. $$(x, y)$$는 $$X, Y, Z$$를 합으로 나눠 밝기를 지운 값이다. 같은 에너지 흰빛을 반으로 어둡게 한 회색도 $$(1/3, 1/3)$$이다. 원래 색을 되살리려면 밝기 $$Y$$가 더 필요하다($$xyY$$). 확인 방법: $$(X, Y, Z) = (5.65, 5.65, 5.65)$$와 $$(2.83, 2.83, 2.83)$$은 색도가 같다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> CIE가 XYZ를 만들 때 건 다섯 조건을 쓰라.</summary>


**답:** (1) RGB에서 선형 변환으로 얻고 모든 값이 양수다. (2) $$\bar y(\lambda)$$는 CIE 표준 관찰자의 $$V(\lambda)$$와 같다. (3) 흰색(등에너지 백색)은 $$x = y = z = 1/3$$이다. (4) 볼 수 있는 모든 색은 $$(1, 0)$$, $$(0, 0)$$, $$(0, 1)$$ 삼각형 안에 있다. (5) 650 nm 위에서 $$\bar z = 0$$으로 두어도 실험 오차 안이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> CIE RGB 초록 원색 $$(R, G, B) = (0, 1, 0)$$을 XYZ로 바꾸고 색도 $$(x, y)$$를 구하라.</summary>


**답:** 둘째 열만 남는다. $$X = 0.31/0.17697 \approx 1.7517$$, $$Y = 0.81240/0.17697 \approx 4.5907$$, $$Z = 0.01/0.17697 \approx 0.0565$$. 합 $$\approx 6.3989$$이고 $$x \approx 0.2738$$, $$y \approx 0.7174$$다. 546.1 nm 단색광의 자리다.<br>
**흔한 오답:** $$1/0.17697$$을 빠뜨려 $$(0.31, 0.8124, 0.01)$$로 쓰는 것. 색도는 비율이라 그래도 같지만, $$Y$$ 값(밝기)이 틀린다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> $$R = G = B$$인 빛이 색도 $$x = y = z = 1/3$$에 오는 이유를 행렬에서 찾아 이유를 대라.</summary>


**답:** 행렬 $$M$$의 세 줄의 합이 모두 1이다($$0.49 + 0.31 + 0.20$$, $$0.17697 + 0.81240 + 0.01063$$, $$0 + 0.01 + 0.99$$). 같은 값 $$k$$를 넣으면 세 줄 모두 $$k$$가 나오고 같은 수로 나누므로 $$X = Y = Z$$, 따라서 $$x = y = z = 1/3$$이다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> CIE가 $$\bar y(\lambda)$$를 비시감 효율 $$V(\lambda)$$와 똑같게 만든 이유는 무엇인가? 행렬의 어느 부분이 이것을 맞추는가?</summary>


**답:** 그러면 $$Y$$ 하나가 눈이 느끼는 밝기가 되어, 밝기($$Y$$)와 밝기를 뺀 색(색도 $$x, y$$)을 깔끔하게 나눠 적을 수 있다. 조명·화면의 밝기는 $$Y$$만 보면 되고, CIE Lab의 밝기 $$L^*$$도 $$Y$$에서 계산한다. 행렬의 둘째 줄 $$0.17697 : 0.81240 : 0.01063$$이 세 원색의 밝기 비 $$1 : 4.5907 : 0.0601$$과 같아서 $$Y = R + 4.5907G + 0.0601B$$가 섞은 빛의 밝기가 된다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> $$(X, Y, Z) = (1, 0, 0)$$은 실제 빛의 색이 될 수 있는가? 이유를 대고, 이 점의 색도도 쓰라.</summary>


**답:** 될 수 없다. 380~780 nm에서 $$\bar y > 0$$이므로 에너지가 있는 빛은 $$Y > 0$$이다. $$Y = 0$$이면서 $$X = 1$$인 빛은 없다. 색도는 $$(x, y) = (1, 0)$$으로, 빨간 단색광이 닿는 가장 바깥 점 $$(0.7347, 0.2653)$$보다 바깥이다. X 원색은 계산을 위해 고른 가상 원색이다.

</details>

<details markdown="1"><summary markdown="span"><b>C6</b> "흰색은 $$x = y = 1/3$$"과 "색온도 6500 K의 흰색은 $$(0.3127, 0.3290)$$"은 서로 모순인가? 어느 흰색이 무엇인지 쓰라.</summary>


**답:** 모순이 아니다. 두 흰색이 다르다. $$(1/3, 1/3)$$은 모든 파장의 세기가 같은 가상의 흰빛(등에너지 백색, 광원 E)으로, XYZ를 정의할 때 기준으로 쓴 점이다. $$(0.3127, 0.3290)$$은 햇빛을 흉내 낸 표준 광원 D65(약 6500 K)다. 문제에 "색온도 6500 K"가 나오면 D65의 색도를 쓴다.

</details>

[^s1]: 음수를 피한 이유로 당시의 손 계산과 측정 기기의 사정을 든 것은 색채학사의 표준 설명이다(예: Fairman, Brill & Hemmendinger, 1997, "How the CIE 1931 color-matching functions were derived from Wright-Guild data").
[^s2]: 곡선은 표준 표가 아니라 Wyman, Sloan, Shirley(2013, JCGT 2(2))의 다중 가우스 근사이고, 빈 점은 CIE 1924 $$V(\lambda)$$ 표 값이다. [37_cie-xyz_plot.py](/Hongs_Blog/studies/human-interface-media/code/37_cie-xyz_plot/)로 그렸고, 그림에 쓴 값($$\bar z$$ 봉우리 1.75~1.80, $$\bar x$$ 큰 봉우리 1.04~1.08, 650 nm 위 $$\bar z < 10^{-6}$$, $$\bar y$$와 표의 차이 0.008 미만)을 같은 코드로 확인했다.
[^s3]: 이 문서는 헷갈리지 않게 원색을 굵은 글씨 $$\mathbf{X}, \mathbf{Y}, \mathbf{Z}$$로 적었다. xyY에서 되돌리는 식은 표준 내용이다.
[^s4]: 등에너지 백색(표준 광원 E)과 D65의 색도 $$(0.3127, 0.3290)$$은 CIE 1931 2° 표준 관찰자 기준의 표준값이다.
[^s5]: (2)의 넷째 단계에는 "밝기는 섞으면 더해진다"는 가정(아브니 법칙)이 필요하며, 실제 지각에서는 근사로만 맞는다. (4)의 비교에 쓴 스펙트럼 궤적 값(700 nm $$(0.7347, 0.2653)$$, 546.1 nm 약 $$(0.2737, 0.7174)$$, 435.8 nm 약 $$(0.1666, 0.0089)$$)은 CIE 1931 2° 표준 표의 값과 그 사이를 이은 값이다.
[^s6]: 색채계의 출력 형식, sRGB가 XYZ로 정의된다는 것(IEC 61966-2-1), 기기 사이의 색 변환에서 XYZ나 Lab을 가운데 좌표로 쓴다는 것(ICC 프로파일의 연결 좌표)은 색 관리 표준의 내용이다.
{% endraw %}
