---
layout: "note"
title: "CIE RGB 등색 함수"
display_title: "CIE RGB 등색 함수 (CIE RGB Color Matching Functions)"
kind: "concept"
kind_label: "정의"
num: "36"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["CIE RGB", "CIE 1931 RGB", "Color Matching Function", "등색 함수", "색 대응 함수", "색 맞춤 함수", "RGB-Color Matching", "색 맞추기 실험", "color matching experiment", "그라스만 법칙", "Grassmann's laws", "Tristimulus", "삼자극", "삼자극치", "tristimulus values", "국제조명위원회", "CIE", "Commission Internationale de l'Eclairage"]
description: "색 맞추기 실험은 \"빨강 빛 얼마, 초록 빛 얼마, 파랑 빛 얼마를 섞으면 이 색과 똑같아 보이나\"를 사람이 직접 손잡이를 돌려 맞추게 하는 실험이다. 국제조명위원회(CIE)는 1931년에 세 원색 빛(700, 546.1, 435.8 nm)을 정하고, 무지개의 파장마다 필요한 세 …"
prev_url: "/studies/human-interface-media/hsl-hsv/"
prev_title: "HSL과 HSV"
next_url: "/studies/human-interface-media/cie-xyz/"
next_title: "CIE XYZ"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "36_cie-rgb_plot.py", "u": "/studies/human-interface-media/code/36_cie-rgb_plot/", "r": "그림 생성"}, {"t": "36_cie-rgb_verify.py", "u": "/studies/human-interface-media/code/36_cie-rgb_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/cie-rgb/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

색 맞추기 실험은 "빨강 빛 얼마, 초록 빛 얼마, 파랑 빛 얼마를 섞으면 이 색과 똑같아 보이나"를 사람이 직접 손잡이를 돌려 맞추게 하는 실험이다. 국제조명위원회(CIE)는 1931년에 세 원색 빛(700, 546.1, 435.8 nm)을 정하고, 무지개의 파장마다 필요한 세 양을 곡선으로 정리했다. 빛 섞기는 덧셈이라 이 곡선만 있으면 어떤 빛이든 세 양을 계산으로 구한다. 다만 청록 근처의 파장에서는 빨강의 양이 음수로 나와 다루기 불편했고, 이것을 없애려고 XYZ를 새로 만들었다.

</div>


## 예시로 보기

어떤 색을 세 원색으로 만들려면 얼마씩 섞어야 할까. 이 답을 색마다 한 번씩 실험으로 정해 두면, 그다음부터는 계산만 하면 된다. 실험 장치는 이렇다.

- 흰 칸막이를 반으로 나눈 화면을 본다. 바깥은 일정한 배경 빛이 둘러싼다.
- 한쪽 반에는 맞출 빛(시험광)을 비춘다.
- 다른 쪽 반에는 빨강(R)·초록(G)·파랑(B) 원색 램프 세 개를 비추고, 사람이 세 램프의 세기를 돌려 두 반쪽이 똑같아 보이게 맞춘다.

맞췄을 때 세 램프의 세기(0~100)를 $$r, g, b$$라 하면, 그 색은 $$C = rR + gG + bB$$로 적는다. 예를 들어 청록은 $$7R + 33G + 39B$$다. 여기서 등호는 "똑같아 보이게 맞춰진다"는 뜻이다.

어떤 색은 이렇게 맞춰지지 않는다. 선명한 청록은 세 램프를 어떻게 돌려도 맞출 빛보다 덜 선명하다. 이때는 빨강 램프를 맞출 빛 쪽으로 옮겨 함께 비춘다.

$$ \text{선명한 청록} + 38R = 42G + 91B \quad\Rightarrow\quad \text{선명한 청록} = -38R + 42G + 91B $$


음수 $$-38R$$은 "빨강을 맞출 빛 쪽에 38만큼 더했다"는 뜻이다. 세 원색만 섞어서는 이 색을 만들 수 없다. 이런 일이 생기는 이유는 추상체의 민감도 곡선이 서로 겹치기 때문이다. 초록 원색은 M 추상체와 함께 L 추상체도 꽤 자극한다. 선명한 청록처럼 L에 비해 M을 훨씬 크게 자극하는 빛을 흉내 내려면, 초록 원색이 덤으로 만든 L 자극을 덜어 내야 한다. 빛을 덜어 낼 방법이 없으니 반대쪽에 빨강을 보태는 것이다. 자세한 원리는 [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)에 있다.

CIE의 세 원색으로 맞추면 세 양 가운데 음수는 많아야 하나다.

이 계산이 통하는 근거는 그라스만(Hermann Graßmann)이 1853년에 정리한 빛 섞기의 규칙이다[^s2].

1. 세 원색이면 (음수를 허락할 때) 어떤 색이든 맞출 수 있다.
2. 두 빛이 똑같아 보이면, 둘 다 같은 배수로 세게 해도 똑같아 보인다.
3. A와 B가 똑같아 보이고 C와 D가 똑같아 보이면, A + C와 B + D도 똑같아 보인다.

2와 3 덕분에 색을 벡터처럼 더하고 곱할 수 있다. 청록과 선명한 청록을 1단위씩 섞은 빛은 계수끼리 더해 $$(7 - 38)R + (33 + 42)G + (39 + 91)B = -31R + 75G + 130B$$다.

이렇게 세 자극(원색)으로 시험광을 맞추는 실험과 측정을 삼자극(tristimulus)이라 부르고, 그때의 세 양을 삼자극치라 부른다. CIE가 1931년에 정한 모델이 가장 널리 쓰이며, 오늘날 색 관리의 바탕이다.

## 정의

CIE 1931 RGB의 세 원색은 파장 하나뿐인 빛이다. 빨강 700 nm, 초록 546.1 nm, 파랑 435.8 nm. 세 원색을 1단위씩 비출 때의 밝기 비는 $$R : G : B = 1 : 4.5907 : 0.0601$$이다. 초록 1단위가 빨강보다 4.6배쯤 밝고, 파랑 1단위는 빨강 밝기의 6%뿐이다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

등색 함수 $$\bar r(\lambda), \bar g(\lambda), \bar b(\lambda)$$는 파장 $$\lambda$$의 단색광 1단위와 똑같아 보이게 하려면 세 원색이 각각 얼마나 필요한지를 파장마다 적은 것이다. 음수는 그 원색을 맞출 빛 쪽에 더했다는 뜻이다. 여러 파장이 섞인 빛은 그라스만의 덧셈 규칙 덕분에 파장마다의 필요량에 그 파장의 세기를 곱해 모두 더하면 된다. 이렇게 얻은 세 값 $$R, G, B$$가 그 빛의 삼자극치다. 세 곡선 아래 넓이는 같게 맞춘다.

**기호로 쓰면.**

$$ R = \int_0^\infty I(\lambda)\,\bar r(\lambda)\,d\lambda, \qquad G = \int_0^\infty I(\lambda)\,\bar g(\lambda)\,d\lambda, \qquad B = \int_0^\infty I(\lambda)\,\bar b(\lambda)\,d\lambda $$

$$ \int_0^\infty \bar r(\lambda)\,d\lambda = \int_0^\infty \bar g(\lambda)\,d\lambda = \int_0^\infty \bar b(\lambda)\,d\lambda $$

$$I(\lambda)$$(빛의 스펙트럼: 파장마다의 세기), $$\bar r, \bar g, \bar b$$(등색 함수, 단위는 원색의 양).

</div>


적분은 "파장마다 세기 × 필요량을 모두 더한다"로 읽는다. 500 nm 1단위와 600 nm 1단위가 섞인 빛이면 적분이 두 점의 합으로 줄어든다. $$(\bar r, \bar g, \bar b)(500) \approx (-0.073, 0.087, 0.048)$$와 $$(\bar r, \bar g, \bar b)(600) \approx (0.341, 0.064, -0.001)$$을 더해 $$(R, G, B) \approx (0.268, 0.151, 0.047)$$이다[^s3].

넓이를 같게 맞춘 이유는 흰빛 때문이다. 모든 파장의 세기가 같은 빛($$I(\lambda) = $$ 상수)을 넣으면 세 적분이 같은 넓이에 같은 상수를 곱한 값이 되어 $$R = G = B$$다. 이 흰빛이 세 원색을 똑같은 양으로 섞은 색이 된다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/36_cie-rgb_fig1.svg" alt="그림" width="596" height="351" loading="lazy">

왼쪽에서 오른쪽으로 보면, 짧은 파장(약 448 nm 근처)에서는 파랑 곡선 $$\bar b$$가 약 0.32로 가장 크고, 중간(약 542 nm)에서는 초록 곡선 $$\bar g$$가 약 0.22, 긴 파장(약 604 nm)에서는 빨강 곡선 $$\bar r$$가 약 0.35로 가장 크다. 점선은 세 원색의 파장이다. 546.1 nm 점선에서는 $$\bar r$$와 $$\bar b$$가 0이고, 435.8 nm 점선에서는 $$\bar r$$와 $$\bar g$$가 0이다. 맞출 빛이 원색 그 자체라 그 원색 하나로 맞기 때문이다. 주황 칠을 한 약 450~546 nm 구간에서는 $$\bar r$$가 음수이고, 가장 깊은 곳은 약 518 nm에서 약 −0.09다[^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 원색 파장에서 나머지 두 함수가 0(오차 0.002 안), $$\bar r$$의 음수 구간 약 450~545 nm와 최솟값 약 −0.090(518 nm), 세 봉우리, 세 넓이가 0.5% 안에서 같음, 어느 파장에서도 뚜렷한 음수는 하나 이하, 밝기 비 1 : 4.5906 : 0.0601, 그라스만 계산, 500 nm와 600 nm의 필요량과 합 (근사 곡선에서 실험으로 확인됨) — [36_cie-rgb_verify.py](/Hongs_Blog/studies/human-interface-media/code/36_cie-rgb_verify/)</div>

</div>


## 활용

- 눈의 추상체 민감도를 직접 재지 않고도, 사람이 손잡이를 돌린 결과만으로 색을 수로 적는 표준을 만들었다. 이 표가 [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)를 거쳐 오늘날 색 관리의 바탕이 된다.
- 음수가 생기는 문제를 없애려고 새 좌표계 XYZ를 도입했다. XYZ는 이 $$\bar r, \bar g, \bar b$$에 $$3 \times 3$$ 행렬을 곱해 얻는다.
- 원색으로 수은등의 두 선(546.1, 435.8 nm)을 고른 것은 그 파장을 정확하게 다시 만들기 쉬워서다. 700 nm 근처는 파장이 조금 달라져도 색이 거의 바뀌지 않아서 골랐다[^s4].

## 연결

- 선수: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/) (음수 원색이 생기는 이유, 행렬로 푸는 색 맞추기), [가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/) (빛 섞기는 덧셈), [색 공간](/Hongs_Blog/studies/human-interface-media/color-space/) (선형으로 적는 목표)
- 맞춰진 두 빛은 스펙트럼이 달라도 같은 $$(R, G, B)$$를 가진다: [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/)
- 음수를 없앤 다음 단계: [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)
- 세 원색의 밝기 비 $$1 : 4.5907 : 0.0601$$은 [비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/)으로 잰 밝기이고, XYZ의 $$Y$$ 줄이 된다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"CIE RGB의 R, G, B는 모니터의 R, G, B와 같은 원색이다"</div>

틀렸다. 이름이 같아서 같은 빛으로 생각하기 쉽다. CIE RGB의 원색은 파장이 하나뿐인 단색광(700, 546.1, 435.8 nm)이고, 모니터의 부화소는 여러 파장이 섞인 빛이다. 웹과 모니터의 표준인 sRGB는 원색을 색도 좌표 빨강 $$(0.64, 0.33)$$, 초록 $$(0.30, 0.60)$$, 파랑 $$(0.15, 0.06)$$으로 정하는데, 이 점들은 단색광이 놓이는 색도도의 테두리보다 안쪽에 있다. 그래서 같은 숫자 $$(1, 0, 0)$$도 두 체계에서 다른 색이다. 확인 방법: [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)에서 CIE RGB의 빨강은 색도 $$(0.7347, 0.2653)$$로 sRGB 빨강과 다른 점이다[^s5].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> CIE 1931 RGB 세 원색의 파장을 쓰라. 등색 함수 $$\bar r(\lambda)$$의 값이 무엇을 뜻하는지, 그 값이 음수이면 실험에서 무엇을 했다는 뜻인지 쓰라.</summary>


**답:** R 700 nm, G 546.1 nm, B 435.8 nm. $$\bar r(\lambda)$$는 파장 $$\lambda$$의 단색광 1단위와 똑같아 보이게 하는 데 필요한 빨강 원색의 양이다. 음수면 빨강 원색을 맞출 빛 쪽에 그만큼 더해서 맞췄다는 뜻이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 실험에서 "선명한 청록 + 38R = 42G + 91B"로 맞췄다. 선명한 청록을 $$rR + gG + bB$$ 꼴로 쓰라. 이 빛과 청록 $$7R + 33G + 39B$$를 1단위씩 섞은 빛은 어떻게 적는가? 어떤 규칙을 썼는가?</summary>


**답:** 선명한 청록 $$= -38R + 42G + 91B$$. 섞은 빛 $$= -31R + 75G + 130B$$. 양변에서 같은 빛을 빼도 맞춰진 상태가 그대로이고(그라스만의 덧셈 규칙), 섞은 빛의 계수는 두 빛의 계수를 더한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 등색 함수 곡선에서 546.1 nm의 $$\bar r$$와 $$\bar b$$는 0이다. 왜 그런지 이유를 대라. 또 세 곡선 아래 넓이를 같게 맞추면 어떤 빛이 $$R = G = B$$가 되는가?</summary>


**답:** 546.1 nm 단색광은 초록 원색 그 자체라서 초록 원색 1단위만으로 똑같아 보인다. 세 원색은 서로 다른 독립된 빛이라 맞추는 방법이 하나뿐이므로 빨강과 파랑은 0이다. 넓이가 같으면 모든 파장의 세기가 같은 빛(같은 에너지 흰빛)에서 세 적분이 같은 값이 되어 $$R = G = B$$다.<br>
**흔한 오답:** "546.1 nm에서는 빨강·파랑 추상체가 반응하지 않아서"라고 쓰는 것. 등색 함수는 원색의 필요량을 적은 것이고, 추상체 반응과는 다른 양이다. 546.1 nm 빛도 L 추상체를 꽤 자극한다.

</details>

[^s2]: 그라스만 법칙의 세 문장은 색채학 교재의 표준 정리를 쉬운 말로 옮긴 것이다(예: Wyszecki & Stiles, *Color Science*).
[^s3]: CIE 1931 $$\bar x, \bar y, \bar z$$의 해석적 근사(Wyman, Sloan, Shirley, 2013, "Simple Analytic Approximations to the CIE XYZ Color Matching Functions", JCGT 2(2))에 RGB → XYZ 행렬의 역행렬을 곱해 $$\bar r, \bar g, \bar b$$를 얻었다. 표준 표와 소수 셋째 자리쯤에서 다를 수 있다. [36_cie-rgb_plot.py](/Hongs_Blog/studies/human-interface-media/code/36_cie-rgb_plot/)로 그렸고, 그림에 쓴 값을 같은 코드와 검증 코드로 확인했다.
[^s4]: 원색 파장을 고른 이유(546.1과 435.8 nm는 수은 방전등의 선, 700 nm 근처는 색상이 거의 변하지 않음)는 색채학 교재의 표준 설명이다.
[^s5]: sRGB 원색의 색도는 IEC 61966-2-1 표준값이다.
{% endraw %}
