---
layout: "note"
title: "색 공간"
display_title: "색 공간 (Color Space)"
kind: "concept"
kind_label: "정의"
num: "34"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Color Space", "색 공간", "색 모델", "Color Model", "색 좌표계", "재매개화", "Color Reparameterization", "먼셀 표색계", "Munsell Color System", "색상", "Hue", "채도", "Saturation", "Chroma", "명도", "Value", "색도", "Chromaticity", "색 재현 시스템", "Color Reproducing System"]
description: "색 공간은 색 하나하나에 숫자 세 개로 된 주소를 붙이는 규칙이다. 눈이 색을 세 추상체의 반응 세 값으로만 받기 때문에, 숫자 셋이면 보이는 색을 빠짐없이 적을 수 있다. 같은 장소를 \"동쪽으로 몇 km, 북쪽으로 몇 km\"로도, \"어느 방향으로 몇 km\"로도 적을 수 있듯이, …"
prev_url: "/studies/human-interface-media/luminous-efficiency/"
prev_title: "비시감 효율 곡선"
next_url: "/studies/human-interface-media/hsl-hsv/"
next_title: "HSL과 HSV"
math: true
mermaid: true
code_count: 2
code_files: [{"t": "34_color-space_plot.py", "u": "/studies/human-interface-media/code/34_color-space_plot/", "r": "그림 생성"}, {"t": "34_color-space_verify.py", "u": "/studies/human-interface-media/code/34_color-space_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/color-space/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

색 공간은 색 하나하나에 숫자 세 개로 된 주소를 붙이는 규칙이다. 눈이 색을 세 추상체의 반응 세 값으로만 받기 때문에, 숫자 셋이면 보이는 색을 빠짐없이 적을 수 있다. 같은 장소를 "동쪽으로 몇 km, 북쪽으로 몇 km"로도, "어느 방향으로 몇 km"로도 적을 수 있듯이, 같은 색에도 주소를 매기는 방법이 여럿 있다. 섞기 계산이 쉬운 주소, 사람이 느끼는 차이를 닮은 주소, 기계가 바로 쓰는 주소가 서로 달라서, 목적에 맞게 골라 쓰고 서로 바꿔 쓴다.

</div>


## 예시로 보기

"빨강"이라는 말로는 친구의 모니터나 인쇄소에 정확한 색을 전할 수 없다. 빨강에도 밝은 빨강, 칙칙한 빨강, 주황빛 빨강이 있기 때문이다. 색을 숫자로 적어야 하고, 몇 개의 숫자가 필요한지와 어떤 숫자를 쓸지를 정해야 한다.

몇 개인지는 눈이 정해 준다. 눈은 빛을 S, M, L 세 추상체의 반응 세 값으로 바꾸고, 뇌는 이 세 값만 받는다([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)). 그래서 색 지각은 3차원이고, 색 공간은 3차원 공간이다.

어떤 숫자를 쓸지는 고를 수 있다. 세 추상체 반응 (L, M, S)를 입력으로 받아 다른 세 숫자로 다시 적는다. 다시 적는 방식은 크게 두 가지다.

| 방식 | 세 축 |
|---|---|
| 직교 좌표 | 밝음-어두움, 파랑-노랑, 빨강-초록 |
| 극좌표 | 밝기(휘도), 색상(어떤 색 계열인가), 채도(얼마나 진한가) |

노랑 한 가지로 두 방식을 따라가 본다. [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/)의 노랑은 추상체 반응이 S 1, M 5, L 8이다. [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/)의 단순한 식으로 직교 좌표를 구한다[^s1].

- 빨강-초록 축: $$\text{RG} = L - M = 8 - 5 = 3$$. 양수라서 빨강 쪽으로 조금 기운다.
- 파랑-노랑 축: $$\text{BY} = S - (M + L)/2 = 1 - 6.5 = -5.5$$. 음수라서 노랑 쪽으로 크게 기운다.
- 밝음-어두움 축: $$M + L = 13$$.

같은 점을 극좌표로 옮긴다. 회색 축(RG = BY = 0)에서 얼마나 떨어졌는지가 진하기이고, 어느 방향으로 떨어졌는지가 색상이다.

- 거리: $$\sqrt{3^2 + (-5.5)^2} = \sqrt{39.25} \approx 6.26$$
- 각도: 오른쪽(빨강 쪽)에서 시계 방향으로 약 61.4°, 곧 $$-61.4°$$

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/34_color-space_fig1.svg" alt="그림" width="389" height="392" loading="lazy">

가로축은 빨강-초록, 세로축은 파랑-노랑이다. 노란 점까지 파란 점선을 따라가면 직교 좌표(오른쪽 3, 아래 5.5)이고, 주황 실선과 호를 따라가면 극좌표(거리 6.26, 각도 −61.4°)다. 두 길이 같은 점에 닿는다. 가운데 회색 점은 세 반응이 같은 빛(예: S 5, M 5, L 5)으로, 거리가 0이라 색상을 정할 수 없다[^s2].

지도 비유는 거리 재기에서 틀어진다. 지도는 어느 좌표로 적어도 두 장소 사이의 실제 거리가 같다. 색 공간은 좌표를 바꾸면 "두 색이 얼마나 달라 보이는가"를 재는 거리가 달라진다. 그래서 좌표 거리와 사람이 느끼는 차이를 맞추는 일 자체가 색 공간을 고르는 기준이 된다([맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/)).

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

색 공간은 보이는 색마다 숫자 세 개를 정해 주는 규칙이다. 세 추상체 반응이 같은 빛은 같은 세 숫자를 받고, 반응이 다른 빛은 다른 세 숫자를 받는다. 세 추상체 반응에서 출발해 세 숫자를 다시 고르는 일을 재매개화(reparameterization)라 부른다.

**기호로 쓰면.**
- 입력: $$(L, M, S)$$(세 추상체 반응, [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 $$r_k = \int i(\lambda)\sigma_k(\lambda)\,d\lambda$$).
- 색 공간: $$\mathbf{c} = f(L, M, S)$$. $$f$$는 반응이 다르면 결과도 다른 함수(일대일 함수)다. 그래서 $$\mathbf{c}$$에서 $$(L, M, S)$$로 되돌아갈 수 있다.
- 선형 색 공간: $$f(\mathbf{v}) = A\mathbf{v}$$. $$A$$는 $$3 \times 3$$ 행렬이고 $$\det A \ne 0$$(되돌릴 수 있음)이다. 이때 $$f(\mathbf{v}_1 + \mathbf{v}_2) = f(\mathbf{v}_1) + f(\mathbf{v}_2)$$라서 빛을 섞으면 좌표를 더하면 된다.
- 직교 → 극좌표: 평면 좌표 $$(a, b)$$에서 거리 $$C = \sqrt{a^2 + b^2}$$, 각도 $$h = \operatorname{atan2}(b, a)$$. 거꾸로는 $$a = C\cos h$$, $$b = C\sin h$$.

</div>


$$\operatorname{atan2}(b, a)$$는 점 $$(a, b)$$가 오른쪽 가로축에서 몇 도 돌아가 있는지를 $$-180°$$~$$180°$$ 범위로 주는 함수다. $$\tan^{-1}(b/a)$$와 달리 $$a < 0$$인 왼쪽 절반도 바르게 구분한다. 앞의 노랑은 $$\operatorname{atan2}(-5.5, 3) \approx -61.4°$$다.

색 공간을 만들 때 노리는 목표는 넷이다. 한 공간이 넷을 모두 갖추기는 어렵다[^s3].

| 목표 | 뜻 | 예 | 대신 잃는 것 |
|---|---|---|---|
| 선형으로 적기 | 빛을 섞으면 좌표를 더하면 된다 | CIE RGB, CIE XYZ | 좌표 거리와 달라 보이는 정도가 맞지 않는다 |
| 사람 지각 흉내 | 축이 밝기·색상·진하기처럼 사람이 느끼는 성질이고, 거리가 달라 보이는 정도와 맞는다 | 먼셀, CIE Lab | 섞은 색을 덧셈으로 구할 수 없다 |
| 기술에 가깝게 | 숫자가 곧 기기가 쓰는 값이다 | 모니터 RGB, 프린터 CMY, 영상 YCbCr | 같은 숫자도 기기마다 다른 색으로 나온다 |
| 표준 | 누가 계산해도 같은 정의로 같은 숫자가 나온다 | CIE XYZ, CIE Lab | 기기에 보내려면 한 번 더 바꿔야 한다 |

### 먼셀 표색계와 색 용어

과학자와 화가들은 오래전부터 모든 색을 하나의 틀에 담으려 했다. 뉴턴, 괴테, 맥스웰은 색을 원이나 삼각형 위에 늘어놓았다. 오늘날의 몇몇 색 모델은 먼셀(Albert H. Munsell)이 만든 먼셀 표색계(Munsell Color System)를 바탕으로 한다.

먼셀 표색계는 극좌표 방식이다.

- 색상(Hue): 둘레를 도는 각도. 빨강, 노랑-빨강, 노랑, 초록-노랑, 초록, 파랑-초록, 파랑, 보라-파랑, 보라, 빨강-보라의 열 계열이 원을 이룬다.
- 명도(Value): 가운데 기둥의 높이. 아래 0이 검정, 위 10이 흰색이다.
- 채도(Chroma): 가운데 기둥에서 바깥으로 떨어진 거리. 0이 회색이고 바깥으로 갈수록 진하다. 그림에서 보라-파랑은 12까지 뻗지만, 계열마다 낼 수 있는 가장 진한 값이 달라서 전체 모양은 고른 원기둥이 아니다[^s4].

색을 말할 때 쓰는 네 용어를 정리하면 이렇다[^s4].

| 용어 | 쉬운 뜻 | 극좌표에서 |
|---|---|---|
| 색상 (Hue) | 빨강·노랑·초록·파랑처럼 어떤 색 계열인가 | 각도 |
| 채도 (Saturation) | 같은 계열 안에서 얼마나 진한가. 0이면 회색 | 회색 축에서 떨어진 거리 |
| 명도 (Value) | 얼마나 밝은가 | 위아래 높이 |
| 색도 (Chromaticity) | 밝기를 뺀 나머지, 곧 색상과 채도를 함께 | 높이를 뺀 평면 위의 위치 |

색도는 [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)에서 $$(x, y)$$ 두 숫자로 적고, 그 평면을 그린 것이 [색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/)다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 노랑(S 1, M 5, L 8)의 직교 좌표 (3, −5.5, 13)과 극좌표(거리 6.265, 각도 −61.4°), 회색(5, 5, 5)의 거리 0, (3, 4) ↔ (5, 53.13°) 왕복, 극좌표 평균으로 섞으면 틀리는 예 (실험으로 확인됨) — [34_color-space_verify.py](/Hongs_Blog/studies/human-interface-media/code/34_color-space_verify/)</div>

</div>


## 활용

색이 눈에서 출발해 다른 화면에 다시 나타나기까지 거치는 좌표를 순서대로 적으면 이렇다[^s5].

```mermaid
flowchart LR
  A["LMS<br/>눈의 세 추상체 반응"] --> B["RGB<br/>입력 기기나 색 맞추기 실험의 세 원색"]
  B --> C["XYZ<br/>기기와 상관없는 표준 좌표"]
  C --> D["Lab<br/>사람이 느끼는 차이에 맞춘 좌표"]
  D --> E["RGB<br/>출력 기기의 세 원색"]
```

왼쪽에서 오른쪽으로 읽는다. 눈의 반응(LMS)을 세 원색으로 흉내 낸 것이 RGB다([CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/)). RGB는 기기마다 원색이 달라서, $$3 \times 3$$ 행렬 하나로 표준 좌표 XYZ로 옮긴다([CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)). 색을 고치거나 두 색이 얼마나 다른지 잴 때는 사람 눈에 맞춘 Lab으로 바꾼다([CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)). 마지막에 내보낼 기기의 RGB로 바꿔 화면에 띄운다.

- 저장하고 전송할 때는 다른 흐름 RGB → YUV → YCbCr을 쓴다. 밝기와 색을 나눠 색 쪽을 덜 보내는 방식이다([YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)).
- 그림 프로그램의 색 고르기 창은 극좌표 방식인 HSV, HSL을 쓴다. 사람이 "같은 색인데 조금 더 연하게"처럼 생각하기 때문이다([HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/)).

## 연결

- 선수: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/) (왜 3차원인가), [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/) (직교 좌표의 세 축), [가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/) (선형 = 빛의 덧셈)
- 구체적인 색 공간: [HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/), [CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/), [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/), [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/), [YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)
- 직교 좌표와 극좌표를 오가는 식은 복소수 $$a + bi$$를 크기와 각도로 쓰는 식과 같다: [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"두 색의 색상 각도와 채도를 각각 평균하면 두 색을 섞은 색이 된다"</div>

틀렸다. 색상·채도가 사람이 쓰는 말이라 숫자도 그대로 평균하면 될 것처럼 보인다. 극좌표는 선형이 아니어서 섞기와 맞지 않는다. 빨강 쪽 $$(a, b) = (1, 0)$$과 초록 쪽 $$(-1, 0)$$을 반씩 섞으면 직교 좌표 평균은 $$(0, 0)$$, 곧 회색이다. 극좌표로 평균하면 거리 1, 각도 $$(0° + 180°)/2 = 90°$$가 되어 파랑 쪽 $$(0, 1)$$이라는 전혀 다른 색이 나온다. 확인 방법: 섞기는 직교 좌표(선형 색 공간)에서 계산하고, 결과를 극좌표로 바꾼다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 색을 숫자 세 개로 적으면 충분한 이유를 쓰라. 세 추상체 반응을 다시 적는 두 방식(직교 좌표, 극좌표)의 세 축을 각각 쓰라.</summary>


**답:** 눈이 빛을 세 추상체(S, M, L)의 반응 세 값으로만 바꿔 뇌로 보내므로, 세 반응이 같으면 같은 색으로 보인다. 그래서 색 지각은 3차원이다. 직교 좌표: 밝음-어두움, 파랑-노랑, 빨강-초록. 극좌표: 밝기(휘도), 색상, 채도.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 반대색 평면의 점 $$(a, b) = (3, 4)$$를 극좌표(거리 $$C$$, 각도 $$h$$)로 바꾸라. 거꾸로 극좌표 $$(C, h) = (2, 90°)$$는 직교 좌표로 어디인가?</summary>


**답:** $$C = \sqrt{9 + 16} = 5$$, $$h = \operatorname{atan2}(4, 3) \approx 53.13°$$. $$(2, 90°)$$는 $$a = 2\cos 90° = 0$$, $$b = 2\sin 90° = 2$$이므로 $$(0, 2)$$다.<br>
**흔한 오답:** 각도를 $$\tan^{-1}(a/b)$$로 뒤집어 36.87°로 쓰는 것. 각도는 가로축 $$a$$에서 잰다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 일에는 색 공간의 네 목표(선형, 사람 지각 흉내, 기술에 가깝게, 표준) 중 무엇이 가장 중요한가? (a) 두 조명의 빛을 섞은 색을 계산한다 (b) 두 페인트 색이 사람 눈에 얼마나 달라 보이는지 숫자 하나로 잰다 (c) 모니터 부화소에 보낼 값을 정한다 (d) 다른 회사와 "이 색"을 약속한다</summary>


**답:** (a) 선형: 섞기가 좌표의 덧셈이어야 한다(CIE XYZ, RGB). (b) 사람 지각 흉내: 좌표 거리가 달라 보이는 정도와 맞아야 한다(CIE Lab). (c) 기술에 가깝게: 기기의 RGB 값이 필요하다. (d) 표준: 기기와 상관없이 같은 숫자가 나와야 한다(CIE XYZ, CIE Lab).<br>
**흔한 오답:** (d)에 모니터 RGB를 고르는 것. 같은 RGB 값도 모니터마다 다른 색으로 나온다.

</details>

[^s1]: 반대색 좌표의 단순화한 식과 노랑의 수치는 [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/)과 [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/)의 설명용 값이다. 실제 색 공간은 다른 가중치를 쓴다.
[^s2]: [34_color-space_plot.py](/Hongs_Blog/studies/human-interface-media/code/34_color-space_plot/)로 그렸고, 그림에 쓴 값(직교 (3, −5.5), 거리 6.265, 각도 −61.39°, 극좌표에서 되돌리면 같은 점)을 같은 코드로 확인했다.
[^s3]: 색 공간 교재(예: Wyszecki & Stiles, *Color Science*; Fairchild, *Color Appearance Models*)의 표준 설명을 정리했다.
[^s4]: 먼셀의 열 색상 계열 이름과, 계열마다 가장 진한 채도가 달라 모양이 고르지 않다는 것은 먼셀 표색계의 표준 내용이다. 네 용어의 쉬운 뜻은 표준 색채 용어를 풀어 쓴 것이고, 먼셀의 chroma와 일반적인 saturation은 엄밀히는 다른 양(밝기로 나누는지 여부)이다.
[^s5]: 요약 쪽의 흐름을 "색이 눈에서 다른 화면까지 가는 길"로 읽은 것은 해석이다.
{% endraw %}
