---
layout: "note"
title: "CIE Lab"
display_title: "CIE Lab"
kind: "concept"
kind_label: "정의"
num: "40"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["CIE Lab", "CIELAB", "CIE L*a*b*", "L*a*b*", "Lab 색 공간", "명도", "lightness", "색차", "color difference", "Delta E", "ΔE", "CIE76", "기준 백색", "reference white", "CIE LCh", "CIELUV"]
description: "CIE Lab은 색을 세 개의 눈금으로 다시 적는다. 하나는 검정 0에서 흰색 100까지의 밝기이고, 나머지 둘은 초록과 빨강 사이, 파랑과 노랑 사이에서 어디쯤인지다. 눈금을 사람 눈의 느낌에 맞춰 휘어 놓아서, 두 색 사이의 거리가 \"얼마나 달라 보이나\"와 대체로 맞는다. 대신…"
prev_url: "/studies/human-interface-media/macadam-ellipses/"
prev_title: "맥애덤 타원"
next_url: "/studies/human-interface-media/yuv-ycbcr/"
next_title: "YUV와 YCbCr"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "40_cie-lab_plot.py", "u": "/studies/human-interface-media/code/40_cie-lab_plot/", "r": "그림 생성"}, {"t": "40_cie-lab_verify.py", "u": "/studies/human-interface-media/code/40_cie-lab_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/cie-lab/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

CIE Lab은 색을 세 개의 눈금으로 다시 적는다. 하나는 검정 0에서 흰색 100까지의 밝기이고, 나머지 둘은 초록과 빨강 사이, 파랑과 노랑 사이에서 어디쯤인지다. 눈금을 사람 눈의 느낌에 맞춰 휘어 놓아서, 두 색 사이의 거리가 "얼마나 달라 보이나"와 대체로 맞는다. 대신 휘어 놓은 탓에 빛을 섞는 계산은 이 좌표로 할 수 없고, 기준으로 삼을 흰색을 먼저 정해야 하며, 고른 정도도 완전하지는 않다.

</div>


## 예시로 보기

[맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/)에서 본 것처럼 XYZ 위의 거리는 눈의 느낌과 맞지 않는다. 밝기부터 보면 문제가 바로 보인다. 휘도 $$Y$$를 흰색의 0.1, 0.2, …, 1.0으로 똑같이 0.1씩 올린 회색 10단계를 만든다. 눈에는 어두운 쪽의 첫 계단이 크게, 밝은 쪽 끝 계단은 거의 티 나지 않게 보인다.

이 회색들을 Lab의 밝기 $$L^*$$로 적으면 37.8, 51.8, 61.7, 69.5, 76.1, 81.8, 87.0, 91.7, 96.0, 100이다. 첫 계단은 14, 마지막 계단은 4다. 눈이 느낀 대로 어두운 쪽 계단이 세 배 넘게 크게 나온다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/40_cie-lab_fig1.svg" alt="그림" width="717" height="333" loading="lazy">

왼쪽 그림은 가로로 같은 간격(휘도 0.1씩)을 세로 $$L^*$$로 옮긴 것이다. 세로축의 주황 눈금이 아래쪽에서는 성기고 위로 갈수록 촘촘해진다. 초록 점은 빛의 18%만 되쏘는 회색으로, $$L^* \approx 49.5$$, 곧 검정과 흰색의 한가운데로 보인다. 오른쪽 그림은 0 근처를 확대했다. 이 부분은 정의 아래에서 다시 본다[^s2].

색 쪽은 두 축이 맡는다. $$a^*$$는 +로 가면 빨강, −로 가면 초록이고, $$b^*$$는 +로 가면 노랑, −로 가면 파랑이다. 회색은 $$a^* = b^* = 0$$이다. 눈의 [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/)에서 빨강-초록, 파랑-노랑이 짝을 이루는 것과 같은 축이다.

| 색 | $$L^*$$ | $$a^*$$ | $$b^*$$ | 읽는 법 |
|---|---|---|---|---|
| 기준 흰색(D65) | 100 | 0 | 0 | 가장 밝은 회색 |
| 검정 | 0 | 0 | 0 | 가장 어두운 회색 |
| 18% 회색 | 49.5 | 0 | 0 | 한가운데 밝기 |
| sRGB 빨강 | 53.24 | 80.09 | 67.20 | 빨강 쪽으로 많이, 노랑 쪽으로도 꽤 |
| sRGB 초록 | 87.73 | −86.18 | 83.18 | 초록이면서 노랑 쪽. 셋 중 가장 밝다 |
| sRGB 파랑 | 32.30 | 79.19 | −107.86 | 파랑 쪽으로 많이, 빨강 쪽도 섞여 보라 기운. 가장 어둡다 |

빨강·초록·파랑을 화면에서 가장 세게 켰을 때의 $$L^*$$가 87.7, 53.2, 32.3으로 크게 다르다. 눈이 초록 빛을 가장 밝게 느끼기 때문이다([비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/))[^s1].

거리도 맞는지 본다. 휘도를 그대로 두고 색도도에서 $$y$$만 0.01 올린 두 쌍을 비교한다. 초록 근처 $$(0.25, 0.60)$$에서는 Lab 거리가 1.9이고, 파랑 근처 $$(0.17, 0.08)$$에서는 14.2다. 색도도에서는 같은 거리였는데 Lab에서는 7배 넘게 차이 난다. 파랑 근처의 맥애덤 타원이 아주 작았던 것과 같은 방향이다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">CIE Lab</div>

먼저 기준으로 삼을 흰색을 정하고, 색의 $$X, Y, Z$$를 그 흰색의 $$X, Y, Z$$로 나눈 비를 구한다. 세 비를 함수 $$f$$로 눌러 펴는데, $$f$$는 대부분 세제곱근이고 아주 작은 값에서만 직선이다. 밝기 $$L^*$$는 $$Y$$쪽 값만으로 정한다. $$a^*$$는 $$X$$쪽과 $$Y$$쪽의 차이, $$b^*$$는 $$Y$$쪽과 $$Z$$쪽의 차이다.

**기호로 쓰면.** $$X_n, Y_n, Z_n$$은 기준 흰색의 세 자극값이다(흔히 D65, $$Y_n = 1$$로 맞추면 $$X_n = 0.95047$$, $$Z_n = 1.08883$$).

$$L^* = 116\,f\!\left(\frac{Y}{Y_n}\right) - 16, \qquad a^* = 500\left[f\!\left(\frac{X}{X_n}\right) - f\!\left(\frac{Y}{Y_n}\right)\right], \qquad b^* = 200\left[f\!\left(\frac{Y}{Y_n}\right) - f\!\left(\frac{Z}{Z_n}\right)\right]$$

$$f(t) = \begin{cases} t^{1/3} & t > \left(\tfrac{6}{29}\right)^3 \\[4pt] \tfrac{1}{3}\left(\tfrac{29}{6}\right)^2 t + \tfrac{4}{29} & \text{그 밖} \end{cases}$$

$$L^*$$는 0(검정)~100(흰색), $$a^*$$, $$b^*$$는 0이 회색이고 부호가 방향을 뜻한다.

</div>


$$L^*$$의 식은 "흰색에 대한 휘도 비의 세제곱근을 116배 하고 16을 뺀다"로 읽는다. 숫자를 하나 넣어 본다. 휘도가 흰색의 0.125배인 회색은 $$0.125^{1/3} = 0.5$$라서 $$L^* = 116 \times 0.5 - 16 = 42$$다.

116과 16은 양 끝을 맞추는 숫자다. 흰색은 비가 1이라 $$f(1) = 1$$, $$L^* = 116 - 16 = 100$$이다. 검정은 비가 0이라 직선 조각에서 $$f(0) = 4/29$$, $$L^* = 116 \times 4/29 - 16 = 16 - 16 = 0$$이다. 500과 200은 $$a^*$$, $$b^*$$의 크기를 $$L^*$$와 비슷한 눈금으로 맞추는 배율이다[^s4].

**0 근처를 직선으로 바꾼 이유.** 위 그림의 오른쪽을 보면 세제곱근만 쓴 주황 점선은 0에 다가갈수록 거의 수직으로 떨어져, 검정에서 −16이 된다. 세제곱근의 기울기는 $$\tfrac{1}{3}t^{-2/3}$$이라 $$t = 10^{-6}$$에서 이미 3,333이다. 아주 어두운 곳의 작은 잡음이 $$L^*$$를 크게 흔든다는 뜻이다. 그래서 $$t_0 = (6/29)^3 \approx 0.008856$$ 아래는 직선으로 바꿨다. 두 조각은 $$t_0$$에서 값($$6/29$$)과 기울기($$\tfrac13(29/6)^2 \approx 7.787$$)가 모두 같아 매끄럽게 이어진다. 직선 구간에서는 $$L^* \approx 903.3\,Y/Y_n$$이다[^s4].

**왜 비선형인가.** 이유가 셋이다. ① 눈은 밝기를 눌러서 느낀다. 휘도가 8배가 되어도 밝기는 2배쯤으로 느끼는 것을 세제곱근이 흉내 낸다. ② [맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/)에서 본 것처럼, 모든 자리를 같은 비율로 늘이는 선형 변환으로는 타원을 고르게 만들 수 없다. ③ 두 색 축이 차이(빼기)로 정해져 반대색 짝을 흉내 낸다[^s4].

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">색차 $$\Delta E^*_{ab}$$</div>

두 색이 얼마나 달라 보이는지를 Lab 좌표 사이의 직선거리로 잰다.

**기호로 쓰면.** 두 색의 차이가 $$\Delta L^*, \Delta a^*, \Delta b^*$$일 때

$$\Delta E^*_{ab} = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$$

예: $$(60, 20, 30)$$과 $$(63, 16, 30)$$이면 $$\sqrt{9 + 16 + 0} = 5$$다. 흔히 2.3 안팎을 겨우 알아채는 차이로 든다[^s5].

</div>


Lab은 거꾸로 풀 수 있다. $$f$$가 늘 증가하는 함수라 되돌리는 함수가 있으므로, 기준 흰색을 알면 $$L^*a^*b^*$$에서 $$X, Y, Z$$를 하나로 되살린다.

Lab을 극좌표로 바꿔, 회색에서 떨어진 거리 $$C^*_{ab} = \sqrt{a^{*2} + b^{*2}}$$(맑기)와 각도 $$h_{ab}$$(색상)로 적은 것이 CIE LCh다. 같은 해에 CIE가 함께 정한 다른 균일 색 공간이 CIELUV다. 둘 다 이름만 알아 둔다[^s6].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$f$$의 두 조각이 $$t_0$$에서 값·기울기 일치, 흰색 → (100, 0, 0), 검정 → (0, 0, 0), sRGB 빨강·초록·파랑의 Lab 값(알려진 값과 0.02 안), 회색 10단계 $$L^*$$와 계단 14·4, 18% 회색 49.5, 초록·파랑 근처 $$\Delta E$$ 1.87과 14.24, 역변환 1,000회 (실험으로 확인됨). 코드: [40_cie-lab_verify.py](/Hongs_Blog/studies/human-interface-media/code/40_cie-lab_verify/)</div>

</div>


## 활용

- **색 차이 검사.** 인쇄물·도료·화면을 견본과 비교해 $$\Delta E^*_{ab}$$가 정한 값 이하면 합격으로 한다. 더 정밀한 검사에는 $$\Delta E$$ 식을 고친 CIEDE2000 같은 식을 쓴다[^s5].
- **색 옮기기의 중간 단계.** 색을 다른 장치로 옮길 때 "장치 RGB → XYZ → Lab → 다른 장치 RGB" 순서로 간다. XYZ와 Lab은 특정 장치에 매이지 않는 좌표라, 서로 다른 장치를 잇는 공통 기준이 된다. 색 관리 표준(ICC 프로파일)이 XYZ나 Lab을 연결 좌표로 쓴다[^s6].
- **밝기만 고치기.** 사진 편집에서 $$L^*$$만 바꾸면 색($$a^*, b^*$$)은 그대로 두고 밝기만 고칠 수 있다[^s6].
- **흔한 실수.** 기준 흰색을 빼먹고 $$X, Y, Z$$를 그대로 $$f$$에 넣기. $$X_n, Y_n, Z_n$$의 눈금(1 기준인지 100 기준인지)을 $$X, Y, Z$$와 다르게 쓰기. 두 Lab 값을 평균 내 "두 빛을 섞은 색"이라 하기([CIE XYZ와 CIE Lab 비교](/Hongs_Blog/studies/human-interface-media/xyz-vs-lab/)).

## 연결

- 선수: [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/) (입력), [맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/) (풀려는 문제)
- 두 색 축의 뿌리: [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/)
- 휘도와 느끼는 밝기의 차이: [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)
- 색상·맑기·밝기로 적는 다른 방식: [HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/)
- 언제 XYZ를, 언제 Lab을 쓰나: [CIE XYZ와 CIE Lab 비교](/Hongs_Blog/studies/human-interface-media/xyz-vs-lab/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$L^* = 50$$이면 흰색 휘도의 절반이다"</div>

틀렸다. $$L^*$$가 0~100이고 흰색이 100이라 "백분율 휘도"처럼 보여서 그렇게 읽기 쉽다. $$L^*$$는 느끼는 밝기를 흉내 낸 눈금이고, 휘도 비를 세제곱근으로 눌러 만든다. 확인: $$L^* = 50$$을 거꾸로 풀면 $$f = 66/116 \approx 0.569$$, $$Y/Y_n = 0.569^3 \approx 0.184$$다. 흰색 휘도의 18% 남짓만 되쏘는 회색이 한가운데로 보인다. 휘도가 정확히 절반인 회색은 $$L^* \approx 76.1$$이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> $$L^*$$, $$a^*$$, $$b^*$$의 식을 $$f$$와 기준 흰색 $$X_n, Y_n, Z_n$$으로 쓰고, $$a^*$$와 $$b^*$$의 부호가 각각 어느 색 쪽을 뜻하는지 쓰라.</summary>


**답:** $$L^* = 116 f(Y/Y_n) - 16$$, $$a^* = 500[f(X/X_n) - f(Y/Y_n)]$$, $$b^* = 200[f(Y/Y_n) - f(Z/Z_n)]$$. $$f(t) = t^{1/3}$$ ($$t > (6/29)^3$$), 그 밖에는 $$\tfrac13(29/6)^2 t + 4/29$$. $$a^*$$는 + 빨강, − 초록. $$b^*$$는 + 노랑, − 파랑.<br>
**흔한 오답:** $$b^*$$를 $$f(Z) - f(Y)$$로 뒤집어 쓴다. 그러면 노랑과 파랑의 부호가 바뀐다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> $$f(t)$$가 0 근처에서 세제곱근 대신 직선을 쓰는 이유와, $$L^*$$ 식의 116과 −16이 하는 일을 쓰라.</summary>


**답:** 세제곱근은 0 근처에서 기울기가 끝없이 커져, 아주 어두운 값의 작은 잡음이 $$L^*$$를 크게 흔든다. 세제곱근만 쓰면 검정이 $$-16$$이 되기도 한다. 그래서 $$t_0 = (6/29)^3$$ 아래는 값과 기울기가 이어지는 직선으로 바꿨다. 116과 −16은 흰색($$f = 1$$)을 100, 검정($$f = 4/29$$)을 0에 맞춘다: $$116 \times 4/29 - 16 = 0$$.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 기준 흰색에 대해 $$X/X_n = Y/Y_n = Z/Z_n = 0.064$$인 회색의 Lab 값을 구하라. 이 회색과 Lab $$(32.4, 3, -6)$$인 색의 $$\Delta E^*_{ab}$$는?</summary>


**답:** $$0.064 > 0.008856$$이라 세제곱근을 쓴다. $$0.064^{1/3} = 0.4$$. $$L^* = 116 \times 0.4 - 16 = 30.4$$. 세 비가 같으니 $$a^* = b^* = 0$$. 회색은 $$(30.4, 0, 0)$$이다. $$\Delta E^*_{ab} = \sqrt{2^2 + 3^2 + 6^2} = \sqrt{49} = 7$$.<br>
**흔한 오답:** $$L^* = 6.4$$처럼 비에 100을 곱해 쓴다. $$L^*$$는 휘도 비의 백분율이 아니다.

</details>

[^s1]: 회색 10단계, 18% 회색, 표의 Lab 값은 D65 기준 백색 (0.95047, 1, 1.08883)과 IEC 61966-2-1의 sRGB → XYZ 행렬로 계산했고 알려진 값과 맞는다(검증 코드). "어두운 쪽 계단이 크게 보인다"는 밝기 지각의 표준 설명이다.
[^s2]: [40_cie-lab_plot.py](/Hongs_Blog/studies/human-interface-media/code/40_cie-lab_plot/)로 그렸고, 그림의 값(계단 14와 4, 18% 회색 49.5, $$t_0 \approx 0.008856$$)을 같은 코드에서 확인했다.
[^s3]: 두 쌍의 $$\Delta E$$(휘도 $$Y = 0.1$$ 고정, $$y$$를 0.01 올림: 1.87과 14.24)는 설명용으로 계산한 값이다. Lab도 완전히 고르지는 않으므로 이 비가 맥애덤 측정값의 비와 같다는 뜻은 아니다.
[^s4]: 직선 조각의 이유(0 근처 기울기, 검정을 0에 맞춤), 이음매에서 값·기울기가 같다는 계산, 116·16·500·200의 역할, 비선형인 세 가지 이유는 CIE 15:2004와 색채학 교재(Wyszecki & Stiles, *Color Science* 2판)의 표준 내용이다. "휘도 8배 → 밝기 약 2배"는 세제곱근($$8^{1/3} = 2$$)으로 계산한 값이다.
[^s5]: $$\Delta E^*_{ab}$$(CIE76) 식과 CIEDE2000은 CIE 표준이다. "2.3 안팎을 겨우 알아채는 차이로 든다"는 Sharma(2003), *Digital Color Imaging Handbook*에서 흔히 인용하는 값이고, 조건에 따라 달라진다.
[^s6]: LCh의 식, CIELUV가 1976년에 CIELAB과 함께 정해진 것, ICC 프로파일의 연결 좌표(PCS)가 XYZ나 Lab이라는 것, 사진 편집 프로그램의 Lab 모드는 색채·색 관리의 표준 내용이다.
{% endraw %}
