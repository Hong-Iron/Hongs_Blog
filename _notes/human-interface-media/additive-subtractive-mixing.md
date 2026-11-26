---
layout: "note"
title: "가법 혼색과 감법 혼색"
display_title: "가법 혼색과 감법 혼색 (Additive and Subtractive Color Mixing)"
kind: "concept"
kind_label: "정의"
num: "32"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Additive Color Mixing", "Subtractive Color Mixing", "가법 혼색", "감법 혼색", "가산 혼합", "감산 혼합", "빛의 혼합", "물감의 혼합", "CMY", "CMYK", "반사율", "reflectance", "색 재현", "Reproducing Colors"]
description: "빛을 겹쳐 비추면 색이 밝아지고, 물감을 섞으면 어두워진다. 빛은 서로의 파장을 보태 주고, 물감은 저마다 일부 파장을 먹어 치우기 때문이다. 그래서 모니터는 빨강·초록·파랑 빛을 더해 흰색까지 만들고, 프린터는 청록·자홍·노랑 잉크로 빛을 덜어 내 검정까지 만든다. 빛 섞기는 덧…"
prev_url: "/studies/human-interface-media/two-dimensional-convolution/"
prev_title: "2차원 합성곱"
next_url: "/studies/human-interface-media/luminous-efficiency/"
next_title: "비시감 효율 곡선"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "32_additive-subtractive-mixing_plot.py", "u": "/studies/human-interface-media/code/32_additive-subtractive-mixing_plot/", "r": "그림 생성"}, {"t": "32_additive-subtractive-mixing_verify.py", "u": "/studies/human-interface-media/code/32_additive-subtractive-mixing_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/additive-subtractive-mixing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

빛을 겹쳐 비추면 색이 밝아지고, 물감을 섞으면 어두워진다. 빛은 서로의 파장을 보태 주고, 물감은 저마다 일부 파장을 먹어 치우기 때문이다. 그래서 모니터는 빨강·초록·파랑 빛을 더해 흰색까지 만들고, 프린터는 청록·자홍·노랑 잉크로 빛을 덜어 내 검정까지 만든다. 빛 섞기는 덧셈만으로 결과를 정확히 맞힐 수 있지만, 물감 섞기는 두 물감이 파장마다 얼마나 되쏘는지를 알아야 맞힐 수 있다.

</div>


## 예시로 보기

색은 물체를 찾고 알아보는 데 쓰인다. 잎 사이의 빨간 열매는 컬러 사진에서는 바로 보이지만, 같은 사진을 흑백으로 바꾸면 잎에 묻혀 거의 안 보인다. 파란 상추나 보라색 바나나 그림은 금방 이상해 보인다. 그래서 화면과 인쇄물은 색을 제대로 다시 만들어야 하고, 다시 만드는 방법은 빛을 섞는 쪽과 물감을 섞는 쪽 두 가지다.

먼저 물체에 색이 있는 이유부터 본다. 물체는 받은 빛 가운데 일부 파장만 되쏜다. 흰 종이는 모든 파장을 약 80~85% 되쏘고, 검은 종이는 약 5%만 되쏜다. 토마토는 580 nm 아래의 빛은 10% 남짓만 되쏘고, 620 nm 위의 빛은 40% 넘게 되쏜다. 그래서 빨갛게 보인다[^s1]. 파장마다 되쏘는 비율을 적은 곡선을 반사율(reflectance)이라 부른다.

이제 "파랑과 노랑을 섞는다"를 빛과 물감으로 각각 해 본다.

| | 파란 쪽 | 노란 쪽 | 섞은 결과 | 보이는 색 |
|---|---|---|---|---|
| 빛 섞기 | 짧은 파장을 낸다 | 중간·긴 파장을 낸다 | 짧은 + 중간 + 긴 파장이 모두 있다 | 흰색에 가깝다 |
| 물감 섞기 | 짧은 파장과 중간 파장 일부를 되쏜다 | 중간·긴 파장을 되쏜다 | 둘 다 되쏘는 중간 파장만 남는다 | 초록 |

빛 섞기에서는 파란 손전등과 노란 손전등을 흰 벽에 겹쳐 비춘다. 겹친 곳에는 두 빛의 파장이 모두 있어서 S, M, L 세 추상체가 모두 크게 반응한다. 세 반응의 비율은 S 0.26, M 0.34, L 0.40으로, 모든 파장이 고른 흰빛의 비율 0.24, 0.38, 0.38과 가깝다[^s2].

물감 섞기에서는 파란 물감 입자와 노란 물감 입자가 함께 빛을 받는다. 짧은 파장은 노란 물감이 먹고, 긴 파장은 파란 물감이 먹는다. 둘 다 살려 두는 중간 파장(약 505 nm 근처)만 눈으로 돌아와 M 추상체가 가장 크게 반응한다. 그래서 초록으로 보인다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/32_additive-subtractive-mixing_fig1.svg" alt="그림" width="717" height="314" loading="lazy">

왼쪽 그림은 빛 섞기다. 파란 빛(450 nm 근처)과 노란 빛(580 nm 근처)의 곡선을 위로 쌓으면 회색 넓이가 되고, 그 넓이가 섞은 빛이다. 오른쪽 그림은 물감 섞기다. 파란 물감은 왼쪽(짧은 파장)에서 높고, 노란 물감은 오른쪽(긴 파장)에서 높다. 두 곡선을 파장마다 곱하면 둘 다 높은 가운데만 남는 초록 봉우리가 된다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

빛을 섞으면 파장마다 세기가 더해진다. 이것을 가법 혼색이라 부른다. 물체는 비추는 빛에 파장마다 정해진 비율(반사율)을 곱한 만큼 되쏜다. 물감·잉크·색 필터를 겹치면 이 비율이 파장마다 곱해진다. 이것을 감법 혼색이라 부른다. 원색 하나의 파장 띠를 통째로 먹는 이상적인 잉크에서는 잉크의 양이 "1에서 그 빛의 양을 뺀 값"이다.

**기호로 쓰면.**
- 가법 혼색: $$I_{\text{mix}}(\lambda) = I_1(\lambda) + I_2(\lambda)$$. $$I_k(\lambda)$$(빛 $$k$$가 파장 $$\lambda$$에서 내는 세기).
- 물체가 되쏘는 빛: $$I_{\text{out}}(\lambda) = E(\lambda)\,\rho(\lambda)$$. $$E(\lambda)$$(비추는 조명의 스펙트럼), $$\rho(\lambda)$$(반사율, $$0 \le \rho \le 1$$).
- 감법 혼색: $$\rho_{\text{mix}}(\lambda) = \rho_1(\lambda)\,\rho_2(\lambda)$$ (필터를 겹칠 때 정확하고, 물감에서는 근사).
- 이상적인 잉크: $$\begin{pmatrix} C \\ M \\ Y \end{pmatrix} = \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix} - \begin{pmatrix} R \\ G \\ B \end{pmatrix}$$. $$C, M, Y$$(청록·자홍·노랑 잉크의 양, 0~1), $$R, G, B$$(되쏘는 빨강·초록·파랑 빛의 양, 0~1).

</div>


마지막 식은 "청록 잉크의 양 = 1 − 빨간빛의 양"으로 읽는다. 청록 잉크는 빨간빛만 먹는 잉크라서, 빨강을 덜 되쏘고 싶을수록 청록을 많이 칠한다. 예를 들어 빨강 $$(R, G, B) = (1, 0, 0)$$은 $$(C, M, Y) = (0, 1, 1)$$, 곧 자홍과 노랑 잉크를 겹쳐 찍는다.

빛 섞기에서 추상체 반응도 그대로 더해진다. 반응은 스펙트럼과 민감도 곡선을 곱해 더한 값이라([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 $$r_k = \int i(\lambda)\sigma_k(\lambda)\,d\lambda$$), 스펙트럼이 더해지면 적분도 더해진다. 물감 섞기에서는 곱이 적분 안에 들어가므로 이런 덧셈 규칙이 없다.

| | 가법 혼색 | 감법 혼색 |
|---|---|---|
| 섞는 것 | 빛 | 물감, 잉크, 색 필터 |
| 계산 | 세기를 더한다 | 되쏘는 비율을 곱한다 |
| 원색 | 빨강, 초록, 파랑 (R, G, B) | 청록, 자홍, 노랑 (C, M, Y) |
| 둘씩 섞으면 | R + G = 노랑, G + B = 청록, B + R = 자홍 | C + Y = 초록, Y + M = 빨강, M + C = 파랑 |
| 셋 다 섞으면 | 흰색 | 검정 |
| 아무것도 없으면 | 검정 (꺼진 화면) | 흰색 (빈 종이) |
| 쓰는 곳 | 모니터, 프로젝터 | 프린터, 그림물감 |

한쪽의 원색은 다른 쪽에서 둘을 섞은 색이다. 빛의 노랑(R + G)이 잉크의 원색이고, 잉크의 빨강(Y + M)이 빛의 원색이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 이상적인 잉크의 $$CMY = 1 - RGB$$와 겹친 색(C + Y = 초록, 셋 = 검정), 빛의 덧셈이 추상체 반응의 덧셈과 같음, 섞은 물감의 봉우리 505 nm와 M 우세, 반응 비율끼리의 곱(M 0.278)과 스펙트럼 곱(M 0.210)의 차이, 파랑 빛 + 노랑 빛의 반응 비율 (가우스 모형에서 실험으로 확인됨) — [32_additive-subtractive-mixing_verify.py](/Hongs_Blog/studies/human-interface-media/code/32_additive-subtractive-mixing_verify/)</div>

</div>


## 활용

- 모니터와 휴대폰 화면은 빨강·초록·파랑 부화소의 밝기를 조절해 더하는 가법 혼색이다. 왜 세 개로 충분한지는 [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)에 있다.
- 프린터는 C, M, Y에 검정 잉크 K를 더한 CMYK를 쓴다. 실제 잉크는 자기 띠를 완벽하게 먹지 못해서, 세 잉크를 겹쳐도 탁한 갈색에 가까운 어두운 색이 나오기 때문이다[^s4].
- 화면에서 고른 색이 인쇄하면 달라 보일 때가 많다. 빛 세 개를 더해 만들 수 있는 색의 범위(색역)와 잉크로 빛을 덜어 내 만들 수 있는 색의 범위가 서로 다르기 때문이다[^s4]. 두 기기 사이에서 색을 옮길 때 쓰는 공통 좌표가 [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)다.

## 연결

- 선수: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/) (반응의 덧셈), [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (스펙트럼 $$i(\lambda)$$)
- 반사율을 숫자 하나로 다룬 경우: [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)의 $$L = \rho E/\pi$$. 여기서는 $$\rho$$가 파장마다 다르다.
- 작은 색 점을 촘촘히 찍어 눈 안에서 빛을 더하는 점묘법: [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/)
- 빛 섞기를 식으로 적은 법칙(그라스만 법칙): [CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/)
- 필터를 겹치면 파장마다 통과 비율이 곱해진다. 신호 및 시스템에서 시스템 두 개를 이어 붙이면 주파수마다 응답이 곱해지는 것과 같은 모양이다([컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/))[^s5].

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"파랑과 노랑을 섞으면 언제나 초록이 된다"</div>

틀렸다. 미술 시간에 물감으로 해 본 결과라서 색의 규칙처럼 외우기 쉽다. 이것은 물감처럼 빛을 먹는 재료에서만 맞는다. 물감은 파장마다 되쏘는 비율이 곱해져서 두 물감이 모두 살려 두는 중간 파장만 남는다. 빛은 파장이 더해지므로 파란 빛과 노란 빛을 겹치면 세 추상체가 고르게 반응해 흰색에 가깝게 보인다. 확인 방법: 위 표와 그림에서 같은 "파랑 + 노랑"이 빛에서는 S 0.26, M 0.34, L 0.40으로 흰빛 비율과 비슷하고, 물감에서는 M이 가장 크게 남는다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 가법 혼색과 감법 혼색에서 각각 무엇을 섞고, 파장마다 어떤 계산(더하기 또는 곱하기)이 일어나는지 쓰라. 각 방식의 원색 셋과, 원색 셋을 모두 섞은 결과도 쓰라.</summary>


**답:** 가법 혼색은 빛을 섞고 파장마다 세기를 더한다. 원색 빨강·초록·파랑, 셋을 섞으면 흰색. 감법 혼색은 물감·잉크·필터를 섞고 파장마다 되쏘는(통과시키는) 비율을 곱한다. 원색 청록·자홍·노랑, 셋을 섞으면 검정.<br>
**흔한 오답:** 감법 혼색의 원색을 "빨강·노랑·파랑"으로 쓰는 것. 미술 시간의 관습이고, 인쇄에서 쓰는 원색은 청록·자홍·노랑이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 화면의 주황 $$(R, G, B) = (1, 0.5, 0)$$을 이상적인 잉크로 찍으려면 $$C, M, Y$$는 각각 얼마인가? 이 주황 위에 청록 잉크($$C = 1$$)를 한 번 더 겹치면 어떤 빛이 남는가?</summary>


**답:** $$(C, M, Y) = (1 - 1,\ 1 - 0.5,\ 1 - 0) = (0, 0.5, 1)$$. 청록 잉크는 빨강만 먹고 초록·파랑은 그대로 되쏜다(되쏘는 비율 $$(0, 1, 1)$$). 주황의 되쏘는 비율 $$(1, 0.5, 0)$$과 곱하면 $$(0, 0.5, 0)$$이다. 어두운 초록만 남는다.<br>
**흔한 오답:** 잉크를 겹칠 때 RGB를 더해서 $$(1, 1.5, 1)$$처럼 밝아진다고 계산하는 것. 잉크는 빛을 덜어 내므로 곱한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 두 빛을 섞은 색은 각 빛의 세 추상체 반응만 알아도 정확히 맞힐 수 있다. 두 물감을 섞은 색은 각 물감의 세 반응만으로는 정확히 맞힐 수 없다. 이유를 식으로 설명하라.</summary>


**답:** 반응은 $$r_k = \int i(\lambda)\sigma_k(\lambda)\,d\lambda$$다. 빛을 섞으면 $$i = i_1 + i_2$$라서 $$r_k = r_{k,1} + r_{k,2}$$로 반응끼리 더하면 된다. 물감을 섞으면 되쏘는 빛이 $$E\rho_1\rho_2$$로 파장마다 곱이 된다. 적분 안의 곱은 적분끼리의 곱으로 나눌 수 없어서, 세 반응값만으로는 결과가 정해지지 않고 두 반사율 곡선 전체가 필요하다.<br>
**이유:** 가우스 모형의 파란 물감과 노란 물감에서, 흰 종이 대비 M 반응의 비율끼리 곱하면 0.28이지만 반사율 곡선을 곱해 계산하면 0.21이다.

</details>

[^s1]: 반사율이라는 이름과 "되쏘는 파장이 물체의 색을 정한다"는 설명은 표준 색채학 내용이다.
[^s2]: 반응 비율 수치는 [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 가우스 추상체 모형(봉우리 445·535·575 nm)에 설명용 빛 스펙트럼과 물감 반사율을 넣어 계산한 값이다. 실제 물감과 빛의 값이 아니다.
[^s3]: [32_additive-subtractive-mixing_plot.py](/Hongs_Blog/studies/human-interface-media/code/32_additive-subtractive-mixing_plot/)로 그렸고, 그림에 쓴 값(섞은 물감의 봉우리 495~515 nm, 450 nm 아래와 560 nm 위에서 0.2 미만)을 같은 코드로 확인했다.
[^s4]: CMYK의 검정 잉크와 기기마다 색역이 다르다는 것은 인쇄·영상 공학의 표준 내용이다. 실제 물감 섞기는 입자가 빛을 흩뜨려서 반사율의 곱보다 복잡하며(쿠벨카-뭉크 이론), 곱은 근사다.
[^s5]: 감법 혼색과 시스템 직렬 연결의 비교는 구조가 같다는 해석이다.
{% endraw %}
