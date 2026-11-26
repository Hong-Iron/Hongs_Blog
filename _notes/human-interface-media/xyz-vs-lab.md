---
layout: "note"
title: "CIE XYZ와 CIE Lab 비교"
display_title: "CIE XYZ와 CIE Lab 비교"
kind: "concept"
kind_label: "비교"
num: "42"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["CIE XYZ vs CIE Lab", "XYZ와 Lab", "XYZ vs Lab", "CIEXYZ vs CIELAB"]
description: "둘은 색을 옮기는 과정에서 앞뒤로 이어지는 두 단계다(장치 RGB → XYZ → Lab → 다른 장치 RGB). 고를 때 묻는 질문은 하나다. 지금 하는 일이 빛의 양을 더하고 나누는 계산인가, 아니면 사람이 느끼는 차이를 재는 일인가."
prev_url: "/studies/human-interface-media/yuv-ycbcr/"
prev_title: "YUV와 YCbCr"
next_url: "/studies/human-interface-media/sound/"
next_title: "소리"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "42_xyz-vs-lab_verify.py", "u": "/studies/human-interface-media/code/42_xyz-vs-lab_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/xyz-vs-lab/"
---
{% raw %}
둘은 색을 옮기는 과정에서 앞뒤로 이어지는 두 단계다(장치 RGB → XYZ → Lab → 다른 장치 RGB). 고를 때 묻는 질문은 하나다. 지금 하는 일이 빛의 양을 더하고 나누는 계산인가, 아니면 사람이 느끼는 차이를 재는 일인가.

## 어느 쪽일까

상황마다 [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)와 [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/) 중 어느 쪽을 쓰는지 고르고, 다른 쪽이 왜 맞지 않는지도 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 무대에서 빨강 조명과 초록 조명을 함께 켰을 때 무대 색의 좌표를 계산한다 (b) 인쇄물의 색이 견본과 얼마나 다른지 숫자 하나로 합격·불합격을 가른다</summary>


**답:** (a) XYZ. 빛을 섞으면 $$X, Y, Z$$가 각각 그대로 더해진다. Lab은 세제곱근을 거친 값이라 더해지지 않는다. sRGB 빨강과 초록을 반씩 섞은 색을 Lab 평균으로 구하면 (70.5, −3.0, 75.2)인데, 실제 섞은 빛의 Lab은 (73.8, −17.1, 75.0)으로 $$\Delta E$$가 14 넘게 틀린다. (b) Lab. 두 색 사이의 거리 $$\Delta E^*_{ab}$$가 느끼는 차이와 대체로 맞는다. XYZ 거리는 맥애덤 타원에서 보듯 자리마다 뜻이 달라 같은 기준을 쓸 수 없다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 어두운 데서 밝은 데까지 눈에 고른 간격으로 보이는 회색 10단계를 만든다 (d) 새 프로젝터의 세 원색으로 낼 수 있는 색의 범위를 그린다</summary>


**답:** (c) Lab. $$L^*$$를 10, 20, …, 100으로 같은 간격으로 잡으면 눈에 고르게 보인다. 이때 휘도 $$Y/Y_n$$는 0.011, 0.030, 0.062, …, 0.763, 1로, 간격이 0.019에서 0.237까지 벌어진다. $$Y$$를 같은 간격으로 잡으면 밝은 쪽 계단이 거의 안 보인다. (d) XYZ의 색도도. 세 원색을 섞은 색은 색도도에서 세 점이 만드는 곧은 삼각형 안이다. Lab에서는 섞는 길이 휘어서(초록과 파랑을 섞는 길이 직선에서 최대 26만큼 벗어남) 범위가 단순한 도형이 되지 않는다.

</details>

## 결정적 차이

| 기준 | CIE XYZ | CIE Lab |
|---|---|---|
| 바탕이 된 질문 | 두 색이 똑같아 보이나(색 맞추기) | 두 색이 얼마나 달라 보이나 |
| 빛을 섞으면 | 세 값이 그대로 더해진다(선형) | 더해지지 않는다(비선형) |
| 좌표 사이 거리 | 느끼는 차이와 맞지 않는다 | 느끼는 차이와 대체로 맞는다($$\Delta E^*_{ab}$$) |
| 밝기 축 | $$Y$$: 빛의 세기에 비례하는 휘도 | $$L^*$$: 느끼는 밝기, 0~100 |
| 색 축 | $$X, Z$$: 가상 원색의 양, 늘 0 이상 | $$a^*, b^*$$: 반대색 짝의 차이, 음수도 있다 |
| 기준 흰색 | 없어도 정해진다 | 있어야 정해진다. 흰색을 바꾸면 $$a^*, b^*$$가 바뀐다 |
| 원색 셋이 낼 수 있는 범위 | 색도도에서 곧은 삼각형 | 휘어진 입체 |

첫 줄이 나머지 줄을 거의 다 정한다. 색 맞추기는 "같다·다르다"만 답하므로, 그 실험으로 만든 XYZ는 빛의 덧셈을 정확히 따르고 거리에 대해서는 아무것도 정하지 않았다. Lab은 거리를 맞추려고 눈금을 세제곱근으로 휘었고, 그 탓에 빛을 더하는 계산은 할 수 없게 됐다[^s1].

## 둘 다 아닐 때

- **영상을 저장하고 보낼 때.** 픽셀마다 계산이 가볍고 정수로 적기 쉬운 [YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)을 쓴다. 장치 RGB를 밝기와 색차로 다시 적은 것이라 장치에 매여 있다.
- **사람이 화면에서 색을 고를 때.** 색상환을 돌리고 진하기와 밝기를 끌어 고르는 [HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/)가 쓰기 편하다. 거리도 고르지 않고 장치에도 매여 있지만, 손으로 다루기 쉽다.
- **실제로 화면을 켤 때.** 마지막에는 그 화면의 원색에 맞춘 장치 RGB가 필요하다. XYZ나 Lab에서 화면 RGB로 바꾸는 행렬이 화면마다 다르다.
- **아주 정밀한 색 차이 판정.** Lab의 $$\Delta E^*_{ab}$$도 완전히 고르지 않아, 파랑 근처나 아주 진한 색에서 어긋난다. 이를 고친 CIEDE2000 같은 식을 쓴다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 빨강·초록 반씩 섞은 색의 두 계산(ΔE 14.4), Lab 값을 더하면 $$L^*$$ 141, 초록~파랑 섞는 길의 휨(색도도 0, Lab 26.0), $$L^*$$ 10단계의 휘도와 간격 0.019~0.237, 기준 흰색에 따라 $$a^*, b^*$$가 바뀜 (실험으로 확인됨). 코드: [42_xyz-vs-lab_verify.py](/Hongs_Blog/studies/human-interface-media/code/42_xyz-vs-lab_verify/)</div>

</div>


[^s1]: 상황 (a)~(d)와 수치(ΔE 14.4, $$L^*$$ 141, 휨 26.0, 회색 10단계의 휘도)는 설명용으로 보탰고 D65 기준 백색과 sRGB 원색으로 계산했다. "바탕이 된 질문"으로 표를 묶은 설명은 색채학의 표준 설명을 따랐다.
[^s2]: YCbCr, HSL/HSV, 장치 RGB의 쓰임과 CIEDE2000은 색 관리·영상 공학의 표준 내용이다.
{% endraw %}
