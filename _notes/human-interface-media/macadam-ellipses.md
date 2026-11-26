---
layout: "note"
title: "맥애덤 타원"
display_title: "맥애덤 타원 (MacAdam Ellipses)"
kind: "concept"
kind_label: "정의"
num: "39"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["MacAdam Ellipses", "MacAdam ellipse", "맥아담 타원", "지각적으로 균일한 색 공간", "perceptually uniform color space", "지각 균일", "perceptual uniformity", "색 차이", "color difference"]
description: "세계 지도에서 그린란드가 아프리카만큼 커 보이듯, 색도도는 자리마다 축척이 다른 지도다. 초록 근처에서는 점을 꽤 옮겨도 사람 눈에 같은 색이고, 파랑 근처에서는 조금만 옮겨도 다른 색으로 보인다. 그래서 색도도나 XYZ 위의 거리로는 두 색이 얼마나 달라 보이는지 잴 수 없다. …"
prev_url: "/studies/human-interface-media/chromaticity-diagram/"
prev_title: "색도도"
next_url: "/studies/human-interface-media/cie-lab/"
next_title: "CIE Lab"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "39_macadam-ellipses_plot.py", "u": "/studies/human-interface-media/code/39_macadam-ellipses_plot/", "r": "그림 생성"}, {"t": "39_macadam-ellipses_verify.py", "u": "/studies/human-interface-media/code/39_macadam-ellipses_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/macadam-ellipses/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

세계 지도에서 그린란드가 아프리카만큼 커 보이듯, 색도도는 자리마다 축척이 다른 지도다. 초록 근처에서는 점을 꽤 옮겨도 사람 눈에 같은 색이고, 파랑 근처에서는 조금만 옮겨도 다른 색으로 보인다. 그래서 색도도나 XYZ 위의 거리로는 두 색이 얼마나 달라 보이는지 잴 수 없다. 거리가 곧 느끼는 차이가 되도록 색 지도를 다시 그린 것을 지각적으로 균일한 색 공간이라 부른다.

</div>


## 예시로 보기

인쇄소에서 견본과 인쇄물의 색이 "충분히 같은가"를 숫자 하나로 판정하고 싶다. 가장 쉬운 방법은 두 색의 좌표 사이 거리를 재는 것이다. 이 방법이 통하려면 거리 0.01이 색도도 어디에서나 같은 정도의 차이로 보여야 한다.

맥애덤은 이것을 실험으로 확인했다. 관찰자가 중심 색 하나를 보고, 옆의 시험 색을 손잡이로 조절해 중심 색과 똑같아 보이게 맞춘다. 이 일을 여러 번 되풀이하면 맞춘 색들이 중심 둘레로 조금씩 흩어진다. 흩어진 범위를 색도도에 그리면 타원이 된다. 이 타원을 맥애덤 타원이라 부른다. 타원이 크면 그 근처에서는 색을 많이 바꿔도 눈이 잘 알아채지 못한다는 뜻이다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/39_macadam-ellipses_fig1.svg" alt="그림" width="501" height="542" loading="lazy">

모식도다. 위쪽 초록 근처의 타원은 크고 위아래로 길쭉하다. 아래로 내려와 파랑 근처로 갈수록 타원이 작아지고, 왼쪽 아래 파랑 끝의 타원은 점처럼 작다. 기울기도 자리마다 다르다. 실제 측정 그림에서도 초록 위쪽 타원의 긴 지름이 파랑 아래쪽 타원보다 열 배 가까이 크다[판독불확실: 그림에서 눈대중으로 읽은 비율][^s2].

지도 비유가 틀어지는 곳도 있다. 세계 지도의 부풀림은 위도에 따라 정해진 규칙을 따른다. 색도도의 부풀림은 규칙이 단순하지 않아서, 자리마다 실험으로 재야 알 수 있다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">맥애덤 타원</div>

색도도의 한 점(중심 색) 둘레에서, 사람이 중심 색과 똑같다고 맞춘 색들이 흩어지는 범위를 그린 타원이다. 맥애덤은 밝기를 고정하고 색도도의 25곳에서 쟀다[^s1].

**기호로 쓰면.** 중심이 $$(x_0, y_0)$$이고 $$\Delta x = x - x_0$$, $$\Delta y = y - y_0$$(중심에서 옮긴 양)일 때 타원은

$$g_{11}\,\Delta x^2 + 2g_{12}\,\Delta x\,\Delta y + g_{22}\,\Delta y^2 = 1$$

이다. $$g_{11}, g_{12}, g_{22}$$는 타원의 크기·모양·기울기를 정하는 계수이고 자리마다 다르다.

</div>


<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">지각적으로 균일한 색 공간</div>

두 색 좌표 사이의 직선거리가 사람이 느끼는 색 차이에 비례하는 색 공간이다. 이런 공간에서는 맥애덤 타원이 모든 곳에서 같은 크기의 원이 된다.

**기호로 쓰면.** 색 $$c$$를 좌표 $$\varphi(c) = (u_1, u_2, u_3)$$로 옮긴다. 작은 차이에서 느끼는 차이 $$\Delta V$$가 어디서나 같은 상수 $$k$$로

$$\Delta V(c_1, c_2) \approx k\,\lVert \varphi(c_1) - \varphi(c_2) \rVert, \qquad \lVert \Delta u \rVert = \sqrt{\Delta u_1^2 + \Delta u_2^2 + \Delta u_3^2}$$

이면 지각적으로 균일하다. $$\lVert \cdot \rVert$$는 자로 잰 직선거리(유클리드 거리)다.

</div>


타원식은 원의 식 $$\Delta x^2 + \Delta y^2 = r^2$$를 넓힌 것이다. $$g_{11} = g_{22} = 1/r^2$$, $$g_{12} = 0$$이면 반지름 $$r$$인 원이 된다. 숫자로 보면, 반지름이 0.002인 원은 $$g_{11} = g_{22} = 1/0.002^2 = 250{,}000$$이다. 계수가 클수록 타원이 작고, 그 자리에서 눈이 예민하다.

**늘이기 한 번으로는 고르게 만들 수 없다.** 색도도 전체에 같은 $$2 \times 2$$ 행렬 하나를 곱하는 변환은 모든 자리를 같은 방향, 같은 비율로 늘이고 줄인다. 위로 길쭉한 초록 타원을 원으로 만드는 행렬을 골라도, 기울기가 다른 타원에 같은 행렬을 쓰면 여전히 길쭉하다. 계산 예에서 반지름 비 4.5의 타원을 원으로 만든 행렬이 다른 타원을 반지름 비 5.9로 만든다. 모양이 같고 크기만 3배 다른 두 타원도 반지름 1과 1/3인 원이 되어 크기가 맞지 않는다. 그래서 자리마다 늘이는 정도가 다른 곡선형 변환(비선형 변환)이 필요하다. [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)이 그 시도다[^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 타원 매개변수식 위의 36점이 이차식 $$= 1$$을 만족, 한 타원을 원으로 만든 행렬이 다른 기울기의 타원을 반지름 비 5.90으로, 크기만 3배 다른 타원을 반지름 1/3인 원으로 보냄 (실험으로 확인됨). 코드: [39_macadam-ellipses_verify.py](/Hongs_Blog/studies/human-interface-media/code/39_macadam-ellipses_verify/)</div>

</div>


## 활용

- **색 차이의 허용 범위.** 인쇄·도료·화면 품질 검사는 "견본과 얼마나 달라 보이나"를 숫자로 정해야 한다. 색도도 거리는 자리마다 뜻이 달라서 쓸 수 없고, 지각적으로 균일한 공간의 거리(CIE Lab의 $$\Delta E^*_{ab}$$)를 쓴다.
- **LED 조명의 색 고르기.** 같은 제품의 흰색 LED끼리 색이 얼마나 비슷한지를 "맥애덤 타원 몇 단계 안"으로 적는다. 단계가 작을수록 나란히 켜도 색 차이가 덜 보인다[확인필요][^s4].

## 연결

- 선수: [색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/)
- 이 문제를 줄이려고 만든 색 공간: [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/), 둘의 쓰임 비교: [CIE XYZ와 CIE Lab 비교](/Hongs_Blog/studies/human-interface-media/xyz-vs-lab/)
- "똑같아 보이나"만 묻는 실험: [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/), [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"XYZ는 사람 눈 실험으로 만들었으니 XYZ 위의 거리도 사람이 느끼는 차이와 맞는다"</div>

틀렸다. XYZ의 바탕인 색 맞추기 실험은 두 색이 "똑같아 보이나"만 묻는다. 그래서 XYZ는 똑같아 보이는 빛에 같은 좌표를 주는 일은 정확히 한다. "얼마나 달라 보이나"는 실험에서 묻지 않았으므로 좌표 사이의 거리에는 아무 보장이 없다. 확인: 맥애덤 타원이 초록 근처에서는 크고 파랑 근처에서는 아주 작다. XYZ에서 같은 거리라도 파랑 근처에서는 뚜렷이 다르고, 초록 근처에서는 거의 같아 보인다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 맥애덤 타원은 어떤 실험으로 무엇을 그린 것인가? 타원 크기가 자리마다 다르다는 것은 무엇을 뜻하는가?</summary>


**답:** 관찰자가 시험 색을 중심 색과 똑같아 보이게 맞추는 일을 되풀이하고, 맞춘 색들이 흩어진 범위를 색도도에 그린 타원이다. 크기가 다르다는 것은 같은 거리를 옮겨도 자리마다 눈이 알아채는 정도가 다르다는 뜻이다. 곧 색도도(XYZ)는 지각적으로 균일하지 않다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 색도도에서 (가) 초록 근처 $$(0.18, 0.70)$$에서 0.005 옮긴 두 색, (나) 파랑 근처 $$(0.16, 0.05)$$에서 0.005 옮긴 두 색이 있다. 어느 쌍이 더 달라 보이는가? 지각적으로 균일한 공간으로 옮기면 두 쌍의 거리는 어떻게 되는가?</summary>


**답:** (나) 파랑 쪽 쌍. 파랑 근처는 맥애덤 타원이 아주 작아 조금만 옮겨도 알아챈다. 초록 근처는 타원이 커서 0.005 정도는 같은 색으로 보일 수 있다. 균일한 공간에서는 거리가 느끼는 차이에 비례하므로 (나)의 거리가 (가)보다 훨씬 커진다.<br>
**흔한 오답:** "거리가 같으니 똑같이 달라 보인다." 색도도의 거리는 자리마다 뜻이 다르다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 색도도 전체에 같은 $$2 \times 2$$ 행렬 하나를 곱해서는 모든 맥애덤 타원을 같은 크기의 원으로 만들 수 없는 이유를 쓰라. 이것이 CIE Lab의 식과 어떻게 이어지는가?</summary>


**답:** 같은 행렬은 모든 자리를 같은 방향, 같은 비율로 늘인다. 기울기가 다른 두 타원은 하나를 원으로 만들면 다른 하나가 길쭉하게 남고, 모양이 같아도 크기가 다른 두 타원은 크기 비가 그대로 남는다. 그래서 자리마다 늘이는 정도가 다른 비선형 변환이 필요하고, CIE Lab은 세제곱근 같은 비선형 함수를 쓴다.

</details>

[^s1]: 실험 방법(시험 색을 중심 색에 맞추는 일을 되풀이하고 그 흩어짐을 타원으로 그림, 밝기 고정, 25곳)은 MacAdam(1942), "Visual sensitivities to color differences in daylight", *J. Opt. Soc. Am.* 32(5)에서 온 표준 내용이다. 엄밀히는 타원이 맞춘 값의 표준편차를 나타내고, 눈이 겨우 알아채는 차이는 그보다 몇 배 크다고 본다.
[^s2]: [39_macadam-ellipses_plot.py](/Hongs_Blog/studies/human-interface-media/code/39_macadam-ellipses_plot/)로 그린 모식도다. 측정 그림의 관례대로 10배로 키웠다. 말굽은 Wyman, Sloan, Shirley(2013)의 해석적 등색 함수 근사로 그렸다.
[^s3]: $$2 \times 2$$ 행렬 논증과 수치(반지름 비 4.5 → 5.9, 크기 3배 → 반지름 1/3)는 설명용으로 보탰고 검증 코드로 계산했다. 다만 XYZ에 $$3 \times 3$$ 행렬을 곱하면 색도도 위에서는 자리마다 늘이는 정도가 조금씩 다른 변환(사영 변환)이 된다. CIE 1976 $$u'v'$$ 색도도가 그런 변환으로 타원 크기 차이를 줄였지만 같은 원으로 만들지는 못했다(색채학 표준 내용, Wyszecki & Stiles, *Color Science* 2판). 그래서 결론 "곡선형 변환이 필요하다"는 그대로다.
[^s4]: LED 색 균일성을 맥애덤 타원의 단계(step)로 적는 관행은 조명 업계의 표준 내용이다(예: ANSI C78.377의 색도 범위와 제조사 사양의 "3-step MacAdam").
{% endraw %}
