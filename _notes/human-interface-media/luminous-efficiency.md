---
layout: "note"
title: "비시감 효율 곡선"
display_title: "비시감 효율 곡선 (Luminous Efficiency Curve)"
kind: "concept"
kind_label: "정의"
num: "33"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Luminous Efficiency Function", "Luminous Efficiency curve", "V(λ)", "비시감도", "분광 시감 효율", "spectral luminous efficiency", "명소시", "photopic vision", "암소시", "scotopic vision", "박명시", "mesopic vision", "푸르킨예 현상", "Purkinje effect", "광속", "luminous flux", "루멘", "lumen", "시감 효능", "luminous efficacy"]
description: "눈은 모든 색의 빛에 똑같이 예민하지 않다. 같은 1와트라도 연두색 빛은 아주 밝게 보이고, 짙은 파랑이나 짙은 빨강 빛은 어둡게 보인다. 파장마다 \"같은 에너지일 때 얼마나 밝아 보이나\"를, 가장 예민한 파장을 1로 놓고 적은 곡선이 비시감 효율 곡선이다. 밝은 곳(추상체)과 어…"
prev_url: "/studies/human-interface-media/additive-subtractive-mixing/"
prev_title: "가법 혼색과 감법 혼색"
next_url: "/studies/human-interface-media/color-space/"
next_title: "색 공간"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "33_luminous-efficiency_plot.py", "u": "/studies/human-interface-media/code/33_luminous-efficiency_plot/", "r": "그림 생성"}, {"t": "33_luminous-efficiency_verify.py", "u": "/studies/human-interface-media/code/33_luminous-efficiency_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/luminous-efficiency/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

눈은 모든 색의 빛에 똑같이 예민하지 않다. 같은 1와트라도 연두색 빛은 아주 밝게 보이고, 짙은 파랑이나 짙은 빨강 빛은 어둡게 보인다. 파장마다 "같은 에너지일 때 얼마나 밝아 보이나"를, 가장 예민한 파장을 1로 놓고 적은 곡선이 비시감 효율 곡선이다. 밝은 곳(추상체)과 어두운 곳(간상체)의 곡선이 서로 달라서, 해 질 녘에는 빨간 꽃이 파란 꽃보다 먼저 어두워 보인다.

</div>


## 예시로 보기

전구 상자에 적힌 와트(W)만 보고는 그 전구가 얼마나 밝은지 알 수 없다. 와트는 빛이 실어 나르는 에너지이고, 같은 에너지라도 파장에 따라 눈이 느끼는 밝기가 크게 다르기 때문이다. 그래서 사람 눈 기준으로 잰 빛의 양을 따로 쓴다. 이것을 광속이라 부르고 단위는 루멘(lm)이다.

파장 하나뿐인 빛 1 W가 몇 루멘인지 비교하면 이렇다[^s1].

| 빛 1 W | 눈의 상대 감도 $$V$$ | 광속 |
|---|---|---|
| 555 nm (연두) | 1.000 | 683 lm |
| 510 nm (초록) | 0.503 | 약 344 lm |
| 650 nm (빨강) | 0.107 | 약 73 lm |
| 450 nm (파랑) | 0.038 | 약 26 lm |

에너지가 같은데 555 nm 빛은 450 nm 빛보다 26배쯤 밝게 보인다. 400~700 nm에 에너지를 고르게 나눠 담은 흰빛 1 W는 약 243 lm이다. 흰빛에는 눈이 둔한 파장도 섞여 있어서, 555 nm 한 파장으로 낸 빛의 3분의 1쯤에 그친다[^s1].

이 감도를 파장마다 이어 그린 곡선이 비시감 효율 곡선 $$V(\lambda)$$다. 눈은 R(L 추상체)과 G(M 추상체)의 민감도 곡선이 겹치는 가운데 부분에서 가장 예민하고, B(S 추상체)만 반응하는 450 nm 근처에서는 둔하다. 밝기는 주로 L과 M 추상체 반응의 합으로 정해지고, S 추상체는 밝기에 거의 보태지 않는다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/33_luminous-efficiency_fig1.svg" alt="그림" width="577" height="335" loading="lazy">

주황 곡선이 밝은 곳의 감도 $$V(\lambda)$$로, 555 nm에서 1이다. 파랑 곡선은 어두운 곳에서 간상체만 일할 때의 감도 $$V'(\lambda)$$로, 봉우리가 507 nm로 약 50 nm 왼쪽(짧은 파장 쪽)에 있다. 화살표가 봉우리가 옮겨 가는 방향이다. 오른쪽 끝을 보면, 650 nm에서 주황 곡선은 아직 0.1쯤 남아 있지만 파랑 곡선은 거의 0이다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

파장 $$\lambda$$의 빛 1 W가 얼마나 밝아 보이는지를, 가장 밝아 보이는 파장을 1로 놓고 나타낸 값이 비시감 효율 $$V(\lambda)$$다. 밝은 곳에서 추상체가 일할 때의 곡선 $$V(\lambda)$$는 555 nm에서 1이고, 어두운 곳에서 간상체만 일할 때의 곡선 $$V'(\lambda)$$는 507 nm에서 1이다. 사람 눈 기준 빛의 양(광속)은 파장마다 빛의 에너지에 $$V$$를 곱해 모두 더하고, 683을 곱한 값이다[^s4].

**기호로 쓰면.**

$$ \Phi_v = K_m \int_{380}^{780} \Phi_{e,\lambda}(\lambda)\, V(\lambda)\, d\lambda, \qquad K_m = 683\ \text{lm/W} $$

$$\Phi_v$$(광속, lm), $$\Phi_{e,\lambda}(\lambda)$$(파장 1 nm마다 실린 빛의 에너지, W/nm), $$V(\lambda)$$(0~1, $$V(555\ \text{nm}) = 1$$), $$K_m$$(최대 시감 효능: 555 nm 빛 1 W의 광속).<br>
어두운 곳에서는 $$V'(\lambda)$$와 $$K_m' \approx 1700\ \text{lm/W}$$를 쓴다.

</div>


식은 "파장마다 와트에 눈의 감도를 곱해 더한다"로 읽는다. 650 nm 빛 1 W 하나뿐이면 적분이 한 점으로 줄어 $$\Phi_v = 683 \times 0.107 \approx 73$$ lm이다.

683이라는 숫자는 단위를 정할 때 나왔다. 광도의 단위 칸델라(cd)는 "540 THz(약 555 nm) 빛을 한 방향으로 단위 입체각당 1/683 W 내는 광원의 세기"로 정해져 있다. 그래서 555 nm 빛 1 W가 683 lm이다. [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)의 광도(cd), 조도(lx = lm/m²), 휘도(cd/m²)는 모두 이렇게 $$V(\lambda)$$로 무게를 매긴 빛의 양이다[^s4].

밝기에 따라 일하는 시세포가 바뀐다([간상체와 추상체](/Hongs_Blog/studies/human-interface-media/rods-and-cones/))[^s5].

| | 밝은 곳 (명소시) | 중간 (박명시) | 어두운 곳 (암소시) |
|---|---|---|---|
| 일하는 시세포 | 추상체 | 추상체와 간상체 | 간상체 |
| 감도 곡선 | $$V(\lambda)$$, 봉우리 555 nm | 둘 사이 | $$V'(\lambda)$$, 봉우리 507 nm |
| 최대 시감 효능 | 683 lm/W | 둘 사이 | 약 1700 lm/W |
| 색 | 잘 보인다 | 흐려진다 | 거의 안 보인다 |
| 대략의 휘도 | 약 5 cd/m² 위 | 약 0.005~5 cd/m² | 약 0.005 cd/m² 아래 |

해 질 녘처럼 밝은 곳에서 어두운 곳으로 넘어가면 감도의 봉우리가 짧은 파장 쪽으로 옮겨 간다. 그래서 빨간색은 어둡게, 파란색·초록색은 상대적으로 밝게 보인다. 이것을 푸르킨예 현상(Purkinje effect)이라 부른다[^s5]. 같은 에너지의 450 nm 파랑과 650 nm 빨강을 비교하면, 밝을 때는 $$0.107 / 0.038 \approx 2.8$$로 빨강이 2.8배 밝다. 어두울 때는 $$V'(450) / V'(650) = 0.455 / 0.000677 \approx 672$$로 파랑이 약 670배 밝다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 1 W의 광속(555 nm 683 lm, 650 nm 73.1 lm, 450 nm 26.0 lm), 고른 흰빛 1 W 약 243 lm, 밝을 때 2.82배와 어두울 때 672배, 100 lm에 드는 와트, 두 곡선의 반값 구간 (표 값으로 계산해 확인됨) — [33_luminous-efficiency_verify.py](/Hongs_Blog/studies/human-interface-media/code/33_luminous-efficiency_verify/)</div>

</div>


## 활용

- 전구와 LED의 밝기는 루멘으로 비교한다. 1와트로 몇 루멘을 내는지(lm/W)가 조명의 효율이다. 683 lm/W는 555 nm 한 파장일 때의 상한이고, 흰빛은 눈이 둔한 파장을 섞어야 하므로 이보다 훨씬 낮다.
- [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)는 등색 함수 하나($$\bar y$$)를 $$V(\lambda)$$와 똑같이 정했다. 그래서 $$Y$$ 값 하나가 곧 밝기다.
- 영상의 밝기 신호는 R, G, B에 같은 무게를 주지 않는다. 사람 눈이 초록 쪽에 가장 예민하므로 G에 가장 큰 무게를 준다(예: HDTV 표준의 $$0.2126R + 0.7152G + 0.0722B$$)[^s6]. [YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)의 $$Y$$가 이것이다.
- 천문 관측이나 야간 비행에서 빨간 조명을 쓴다. 간상체는 650 nm 근처 빨간빛에 거의 반응하지 않아서, 빨간 조명 아래서는 어둠에 적응한 간상체가 덜 흔들린다[^s6].

## 연결

- 선수: [간상체와 추상체](/Hongs_Blog/studies/human-interface-media/rods-and-cones/) (밝을 때와 어두울 때 일하는 시세포), [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/) (cd, lx, cd/m²)
- 밝기가 L과 M 추상체 반응에서 나온다는 것: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 민감도 곡선, [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/)의 밝기 신호 $$r_M + r_L$$
- $$V(\lambda)$$를 등색 함수로 쓰는 색 공간: [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)
- 밝기 축을 가진 색 공간에서 밝기를 어떻게 재는지 비교: [HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/)의 $$V$$는 $$V(\lambda)$$로 잰 밝기가 아니다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"와트가 같은 빛은 밝기도 같다"</div>

틀렸다. 와트가 "빛의 세기"를 나타내는 단위처럼 쓰여서 그렇게 생각하기 쉽다. 와트는 빛이 실어 나르는 에너지일 뿐이고, 눈은 파장마다 그 에너지를 다르게 받아들인다. 같은 1 W라도 555 nm 빛은 683 lm, 450 nm 빛은 약 26 lm으로 26배쯤 차이 난다. 확인 방법: 위 표에서 $$683 \times V(\lambda)$$를 파장마다 계산해 비교한다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 비시감 효율 $$V(\lambda)$$가 무엇인지 한 문장으로 쓰라. 밝은 곳과 어두운 곳의 봉우리 파장과 그때 일하는 시세포, 그리고 683 lm/W가 무슨 값인지 쓰라.</summary>


**답:** 파장마다 같은 에너지의 빛이 얼마나 밝아 보이는지를 가장 밝아 보이는 파장을 1로 놓고 나타낸 값이다. 밝은 곳(명소시)은 555 nm, 추상체. 어두운 곳(암소시)은 507 nm, 간상체. 683 lm/W는 555 nm 빛 1 W의 광속, 곧 명소시의 최대 시감 효능이다.<br>
**흔한 오답:** 어두운 곳의 봉우리를 555 nm보다 긴 파장으로 쓰는 것. 간상체 곡선은 짧은 파장 쪽(507 nm)으로 옮겨 간다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 밝은 곳에서 100 lm을 내려면 555 nm 단색광은 몇 W가 필요한가? 650 nm 단색광($$V(650) = 0.107$$)은 몇 W가 필요한가?</summary>


**답:** 555 nm: $$100 / 683 \approx 0.146$$ W. 650 nm: $$100 / (683 \times 0.107) = 100 / 73.1 \approx 1.37$$ W. 빨간빛은 같은 밝기를 내는 데 에너지가 9배 넘게 든다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 해 질 녘에 빨간 꽃은 파란 꽃보다 먼저 어둡게 보인다. 시세포와 감도 곡선으로 이유를 설명하라.</summary>


**답:** 어두워지면 추상체 대신 간상체가 일한다. 간상체의 감도 곡선 $$V'(\lambda)$$는 봉우리가 507 nm로 짧은 파장 쪽에 있고, 650 nm 근처 빨간빛에는 거의 반응하지 않는다. 같은 에너지일 때 밝은 곳에서는 650 nm 빨강이 450 nm 파랑보다 약 2.8배 밝지만, 어두운 곳에서는 파랑이 약 670배 밝다. 그래서 빨간 꽃이 먼저 어두워진다(푸르킨예 현상).<br>
**흔한 오답:** "빨간빛은 에너지가 작아서"라고 쓰는 것. 같은 에너지로 비교해도 생기는 현상이고, 원인은 일하는 시세포가 바뀌는 데 있다.

</details>

[^s1]: 표와 흰빛의 수치는 CIE 1924 명소시 $$V(\lambda)$$ 표(10 nm 간격과 555 nm)에 $$K_m = 683$$ lm/W를 곱해 계산했다. 흰빛 243 lm은 400~700 nm를 10 nm 간격 사다리꼴로 적분한 값이다.
[^s2]: $$V(\lambda)$$를 L과 M 추상체 민감도의 합으로 보는 것은 표준 시각 과학의 설명이다(예: Smith & Pokorny, 1975).
[^s3]: CIE 1924 명소시 $$V(\lambda)$$와 CIE 1951 암소시 $$V'(\lambda)$$의 10 nm 표 값을 점으로 찍고 직선으로 이었다. [33_luminous-efficiency_plot.py](/Hongs_Blog/studies/human-interface-media/code/33_luminous-efficiency_plot/)로 그렸고, 그림에 쓴 값(봉우리 555 nm와 표의 510 nm, 반값 구간 가운데가 50~62 nm 옮겨 감)을 같은 코드로 확인했다. 507 nm는 표준이 정한 $$V'$$의 봉우리다.
[^s4]: 광속의 적분식, $$K_m = 683$$ lm/W, 암소시 $$K_m' \approx 1700$$ lm/W(표준값 약 1699), 칸델라의 정의(국제단위계)는 측광의 표준 내용이다.
[^s5]: 명소시·박명시·암소시의 구분과 푸르킨예 현상은 표준 시각 과학 내용이다. 휘도 경계 약 0.005 cd/m²와 5 cd/m²는 CIE의 박명시 측광 권고(CIE 191:2010)의 범위로, 자료마다 조금씩 다르다.
[^s6]: HDTV(ITU-R BT.709) 밝기 계수와 야간에 빨간 조명을 쓰는 이유는 영상 공학과 시각 과학의 표준 내용이다.
{% endraw %}
