---
layout: "note"
title: "이미지 함수"
display_title: "이미지 함수 (Image Function)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
updated: "2026-09-25"
status: "verified"
aliases: ["Image Function", "이미지", "image", "단색 이미지", "컬러 이미지", "RGB", "윤곽선", "edge", "기울기", "gradient"]
description: "흑백 사진은 종이 위 위치마다 밝기 숫자가 하나씩 적힌 지도다. 컬러 사진은 빨강·초록·파랑 세 장의 지도를 겹친 것이다. 이렇게 보면 사진은 위치를 넣으면 밝기를 돌려주는 함수가 되고, 윤곽선은 그 함수가 급하게 변하는 곳이다. 단, 세 장의 지도를 숫자로 더해 한 장으로 합치면…"
prev_url: "/studies/human-interface-media/wave-and-light/"
prev_title: "파동과 빛"
next_url: "/studies/human-interface-media/luminance-and-illuminance/"
next_title: "휘도와 조도"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/image-function/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

흑백 사진은 종이 위 위치마다 밝기 숫자가 하나씩 적힌 지도다. 컬러 사진은 빨강·초록·파랑 세 장의 지도를 겹친 것이다. 이렇게 보면 사진은 위치를 넣으면 밝기를 돌려주는 함수가 되고, 윤곽선은 그 함수가 급하게 변하는 곳이다. 단, 세 장의 지도를 숫자로 더해 한 장으로 합치면 색이 사라지므로 세 값을 따로(벡터로) 들고 있어야 한다.

</div>


## 예시로 보기

가로 6칸, 세로 4칸의 흑백 이미지에서 왼쪽 세 칸은 밝기 100, 오른쪽 세 칸은 20이다.

```
 x →  0    1    2    3    4    5
    100  100  100   20   20   20     y = 0
    100  100  100   20   20   20     y = 1
    100  100  100   20   20   20     y = 2
    100  100  100   20   20   20     y = 3
```

칸 하나하나가 $$i(x, y)$$의 값이다. 예를 들어 $$i(1, 2) = 100$$, $$i(4, 0) = 20$$이다. 옆 칸과의 차이를 가로 방향으로 재면 $$x = 2$$와 $$3$$ 사이에서만 $$20 - 100 = -80$$이고 나머지는 0이다. 세로 방향 차이는 어디서나 0이다. 윤곽선은 차이가 큰 곳, 곧 가운데의 세로 경계다.

컬러 사진은 슬라이드의 연꽃 사진처럼 빨강·초록·파랑 채널 사진 세 장으로 나뉜다[^1]. 채널마다 그 색 빛의 밝기 분포다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **단색 이미지**: 2차원 공간에 대한 밝기 변화 함수 $$i(x, y)$$[^1]. 위치 $$(x, y)$$에서의 밝기를 돌려준다.
- **컬러 이미지**: 빨강·초록·파랑에 대한 밝기 변화를 함께 가진 함수[^1]. 각 위치에서 세 값을 가지므로 벡터 값 함수로 쓴다.

$$ \mathbf{i}(x, y) = \bigl(i_R(x, y),\ i_G(x, y),\ i_B(x, y)\bigr) $$

- **윤곽선**: 평면에 대한 밝기(또는 색) 변화의 정도 $$\nabla i(x, y)$$[^2]. $$\nabla i = \left(\dfrac{\partial i}{\partial x}, \dfrac{\partial i}{\partial y}\right)$$이고, 크기 $$\lVert \nabla i \rVert$$가 윤곽의 세기, 방향이 밝기가 가장 빨리 느는 방향이다.

</div>


슬라이드는 컬러 이미지를 $$i(x,y) = i_R(x,y) + i_G(x,y) + i_B(x,y)$$로 적는다[^1]. 이 덧셈은 빨간 채널 사진, 초록 채널 사진, 파란 채널 사진을 겹친다는 뜻이다. 채널 사진을 각각 $$(i_R, 0, 0)$$, $$(0, i_G, 0)$$, $$(0, 0, i_B)$$라는 벡터로 보면 합이 위의 벡터와 같다[^s1].

**공간 주파수.** 평면 위에서 밝기가 얼마나 촘촘히 바뀌는지를 cycle/m로 잰다[^1]. 한 방향으로 사인 모양으로 바뀌는 줄무늬 $$i(x) = m + a\sin(2\pi u x)$$에서 $$u$$가 공간 주파수다. $$u = 500$$ cycle/m면 1 cm 안에 밝고 어두운 줄 한 쌍이 5번 들어 있다.

디지털 이미지는 $$i(x, y)$$를 격자점에서만 재고(표본화, sampling) 값을 정수로 반올림한(양자화, quantization) 것이다. 강의 계획표 6주차 "Image Representation & Spatial Frequency"가 다룬다[^3][^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 서로 다른 네 색의 스칼라 합이 모두 255, 채널 벡터 합 = 원래 픽셀, 계단 경계의 차분(−80은 경계에서만, 세로 차분 0), 500 cycle/m 줄무늬가 1 cm에 5주기 (실험으로 확인됨) — [12_image-function_verify.py](/Hongs_Blog/studies/human-interface-media/code/12_image-function_verify/)</div>

</div>


## 활용

- 영상 처리 알고리즘은 대부분 이 함수에 대한 연산이다. 윤곽 검출은 $$\nabla i$$의 크기를 재는 일이고, 흐리게 하기는 높은 공간 주파수를 줄이는 일이다[^s2].
- 컬러 이미지가 채널 셋인 이유는 사람 눈의 추상체가 세 종류이기 때문이다([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)). 채널 수는 물리가 아니라 사람의 눈이 정한다.
- 사람의 망막도 윤곽을 강조한다. 다만 $$\nabla i$$(1차 미분)와 달리 이웃과의 차이를 빼는 방식(2차 미분에 가까움)이다: [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)

## 연결

- 선수: [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (공간 주파수)
- 밝기 값의 물리적 뜻: [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$i = i_R + i_G + i_B$$는 세 채널 값을 더한 숫자 하나다"</div>

틀렸다. 식이 보통의 덧셈처럼 생겨서 그렇게 읽기 쉽다. 세 값을 숫자로 더하면 서로 다른 색이 같은 값이 된다. 확인 방법: 빨강 $$(255, 0, 0)$$, 초록 $$(0, 255, 0)$$, 파랑 $$(0, 0, 255)$$, 회색 $$(85, 85, 85)$$는 합이 모두 255다. 숫자 하나로는 네 색을 구별할 수 없다. 슬라이드의 덧셈은 색 채널 사진 세 장을 겹치는 벡터의 덧셈이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 단색 이미지, 컬러 이미지, 윤곽선을 각각 함수(또는 식)로 쓰라.</summary>


**답:** 단색 이미지 $$i(x, y)$$: 위치별 밝기. 컬러 이미지 $$\mathbf{i}(x, y) = (i_R, i_G, i_B)$$: 위치별 세 채널 밝기. 윤곽선: 밝기 변화의 정도 $$\nabla i(x, y) = (\partial i/\partial x, \partial i/\partial y)$$, 그 크기가 윤곽의 세기.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 슬라이드의 $$i = i_R + i_G + i_B$$를 세 값의 숫자 덧셈으로 읽으면 무엇이 문제인지 반례로 보이라.</summary>


**답:** 빨강 $$(255,0,0)$$과 초록 $$(0,255,0)$$은 합이 모두 255라 구별되지 않는다. 컬러 이미지는 세 값을 따로 가진 벡터이고, 슬라이드의 덧셈은 채널 사진을 겹치는 벡터 덧셈이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 위의 6×4 이미지(왼쪽 셋 100, 오른쪽 셋 20)에서 가로 방향 차분 $$i(x+1, y) - i(x, y)$$와 세로 방향 차분을 구하고, 윤곽선이 어디인지 쓰라.</summary>


**답:** 가로 차분은 $$x = 2$$와 $$3$$ 사이에서 $$-80$$, 나머지는 0. 세로 차분은 모두 0. 윤곽선은 $$x = 2$$와 $$3$$ 사이의 세로선이고 세기는 80이다. 가로 성분만 있으므로 윤곽선은 세로 방향으로 놓인다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.3 (시각 정보)
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.19 (요약: "윤곽선: 평면에 대한 밝기 변화 또는 색깔 변화 정도 ∇i(x,y)")
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Lecture Calendar 6주차
[^s1]: 에이전트 보충. 벡터 값 함수 표기와 "채널 사진의 벡터 덧셈"이라는 해석은 슬라이드 그림(원본 = 빨강 + 초록 + 파랑 채널 사진)에 맞춘 것이다.
[^s2]: 에이전트 보충. 표본화·양자화, 윤곽 검출과 흐리기의 주파수 해석은 영상 처리의 표준 내용이다.
{% endraw %}
