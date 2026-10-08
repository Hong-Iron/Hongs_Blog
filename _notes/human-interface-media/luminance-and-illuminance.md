---
layout: "note"
title: "휘도와 조도"
display_title: "휘도와 조도 (Luminance and Illuminance)"
kind: "concept"
kind_label: "정의"
num: "13"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
updated: "2026-10-06"
status: "verified"
aliases: ["Luminance", "Illuminance", "휘도", "조도", "광도", "luminous intensity", "밝기", "brightness", "intensity", "대비", "contrast"]
description: "조도는 무대에 쏟아지는 조명의 양이고, 휘도는 그 무대에서 관객 눈으로 되돌아오는 빛의 양이다. 같은 조명 아래서도 흰 종이와 검은 종이는 휘도가 다르다. 눈이 직접 받는 것은 휘도다. 그런데 조명이 바뀌어도 흰 종이는 계속 희게 보인다. 눈이 절대적인 밝기보다 주변과의 비(대비)…"
prev_url: "/studies/human-interface-media/image-function/"
prev_title: "이미지 함수"
next_url: "/studies/human-interface-media/eye-anatomy/"
next_title: "눈의 구조"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/luminance-and-illuminance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

조도는 무대에 쏟아지는 조명의 양이고, 휘도는 그 무대에서 관객 눈으로 되돌아오는 빛의 양이다. 같은 조명 아래서도 흰 종이와 검은 종이는 휘도가 다르다. 눈이 직접 받는 것은 휘도다. 그런데 조명이 바뀌어도 흰 종이는 계속 희게 보인다. 눈이 절대적인 밝기보다 주변과의 비(대비)를 크게 참고하기 때문이다.

</div>


## 예시로 보기

광도 100 cd인 전구가 있다. 빛에 수직인 책상 면의 조도는 1 m 거리에서 100 lx, 2 m에서 25 lx다. 거리가 2배면 조도는 1/4이다[^s1].

조도 500 lx인 책상에 흰 종이(빛의 80%를 되쏨)와 검은 종이(5%)를 놓는다. 두 종이가 받는 조도는 같다. 눈으로 오는 휘도는 흰 종이가 약 127 cd/m², 검은 종이가 약 8 cd/m²로 16배 차이 난다[^s1].

조명을 50 lx로 어둡게 하든 50,000 lx(한낮 햇빛)로 밝게 하든 두 종이의 휘도 비는 16배 그대로다. 대비도 그대로다. 대비는 반사율로만 정해지기 때문이다.

## 정의

슬라이드는 빛을 나타내는 파라미터로 파장, 밝기(intensity, brightness), 광도와 조도(luminance vs illuminance), 대비(contrast)를 든다[^1]. 측광에서 쓰는 양을 구별하면 이렇다[^s2].

| 양 | 기호·단위 | 뜻 |
|---|---|---|
| 광도 (luminous intensity) | $$I$$, cd (칸델라) | 광원이 한 방향으로 내는 빛의 세기 |
| 조도 (illuminance) | $$E$$, lx (럭스) $$=$$ lm/m² | 면에 떨어지는 빛의 양 |
| 휘도 (luminance) | $$L$$, cd/m² | 면이 한 방향으로, 단위 넓이당 내보내는 빛의 세기. 눈이 받는 양 |
| 밝기 (brightness) | 단위 없음 | 사람이 느끼는 밝음. 주관적 |

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

전등에서 멀어질수록 면에 닿는 빛(조도)은 거리의 제곱에 반비례해 줄어든다. 2배 멀어지면 4분의 1이다. 면이 되쏘아 눈에 보이는 밝기(휘도)는 닿은 빛이 많을수록, 면이 빛을 잘 되쏠수록(반사율이 클수록) 커진다. 대비는 두 밝기의 차이를 기준이 되는 밝기로 나눈 값이다. 기준은 웨버 대비에서는 배경 밝기, 마이컬슨 대비에서는 가장 밝은 곳과 가장 어두운 곳의 합이다.

**기호로 쓰면.**
- 점광원(광도 $$I$$)에서 거리 $$d$$만큼 떨어진, 빛에 수직인 면의 조도: $$E = I / d^2$$ (역제곱 법칙).
- 빛을 모든 방향으로 고르게 되쏘는 면(완전 확산면)의 휘도: $$L = \rho E / \pi$$. $$\rho$$는 반사율($$0 \le \rho \le 1$$).
- 대비: 과녁과 배경의 휘도 $$L_t$$, $$L_b$$로 웨버 대비 $$C_W = (L_t - L_b)/L_b$$, 가장 밝은 곳과 어두운 곳의 휘도로 마이컬슨 대비 $$C_M = (L_{\max} - L_{\min})/(L_{\max} + L_{\min})$$.

</div>


두 식을 합치면 대비가 조도와 무관한 이유가 바로 보인다. 흰 종이와 검은 종이의 휘도는 $$\rho_w E/\pi$$와 $$\rho_b E/\pi$$이므로 $$C_M = (\rho_w - \rho_b)/(\rho_w + \rho_b)$$다. $$E$$가 약분되어 사라진다. 예시의 종이는 $$C_M = 0.75/0.85 \approx 0.882$$다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "광도와 조도: luminance vs illuminance" (강의 3 p.4, p.19) / 문제점: 측광 용어에서 광도는 luminous intensity(단위 cd)이고, luminance는 휘도(단위 cd/m²)다. 광도는 광원이 한 방향으로 내는 세기, 휘도는 면이 단위 넓이당 내는 세기로 다른 양이다. / 수정안: "휘도와 조도: luminance vs illuminance" / 근거: 국내 교과서와 표준 측광 용어의 번역(광도 cd, 휘도 cd/m², 조도 lx). 영어 쌍 luminance vs illuminance(면에서 나오는 빛 대 면에 떨어지는 빛)는 맞다.

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 역제곱 법칙(100 cd에서 1 m 100 lx, 2 m 25 lx), 흰·검은 종이의 휘도 127.3과 7.96 cd/m², 조도 50~50,000 lx에서 마이컬슨 대비 0.882 일정, 웨버 대비 15 (실험으로 확인됨) — [13_luminance-and-illuminance_verify.py](/Hongs_Blog/studies/human-interface-media/code/13_luminance-and-illuminance_verify/)</div>

</div>


## 활용

- 모니터 밝기 사양은 휘도(cd/m², "nit")로 적는다. 조명 설계 기준(책상 위 몇 lx)은 조도로 적는다[^s2].
- 조명이 바뀌어도 물체의 밝기가 같게 보이는 현상(밝기 항등성)은 대비를 쓰는 시각계 덕분이다. 대비를 만드는 신경 배선이 [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)다[^s3].
- [이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/) $$i(x, y)$$의 값은 카메라 센서에 들어온 휘도에 비례하는 값이다. 사진의 대비가 조명과 무관하게 물체의 반사율을 담는 이유다[^s2].

## 연결

- 선수: [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (진폭과 세기)
- 대비를 강조하는 시각계의 배선: [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"조도가 같으면 눈에 보이는 밝기도 같다"</div>

틀렸다. 조도계로 잰 값이 "그곳이 얼마나 밝은가"로 들려서 그렇게 생각하기 쉽다. 조도는 면에 떨어지는 빛이고, 눈이 받는 것은 면에서 되돌아오는 휘도다. 휘도는 반사율에 따라 달라진다. 확인 방법: 같은 500 lx 아래 흰 종이 127 cd/m², 검은 종이 8 cd/m².

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 다음은 광도, 조도, 휘도 중 무엇인가? (a) 책상 위에 놓고 재는 조명 기준 500 lx (b) 모니터 사양의 최대 밝기 400 cd/m² (c) 전구 포장에 적힌 한 방향의 세기 100 cd</summary>


**답:** (a) 조도: 면에 떨어지는 빛. (b) 휘도: 화면(면)이 내보내는 단위 넓이당 세기. (c) 광도: 광원이 한 방향으로 내는 세기.<br>
**흔한 오답:** (b)를 광도라 쓴다. 단위에 m²가 있으면 면의 양인 휘도다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 광도 100 cd인 전구에서 2 m 떨어진 수직 면의 조도는? 그 면에 반사율 0.8인 흰 종이가 있으면 휘도는($$L = \rho E/\pi$$)?</summary>


**답:** $$E = 100/2^2 = 25$$ lx. $$L = 0.8 \times 25/\pi \approx 6.4$$ cd/m².

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 흰 종이와 검은 종이의 대비가 조명의 세기와 상관없이 일정한 이유를 식으로 보이고, 시각계가 절대 밝기보다 대비를 쓰는 것이 왜 유리한지 쓰라.</summary>


**답:** 두 휘도는 $$\rho_w E/\pi$$, $$\rho_b E/\pi$$라서 $$C_M = (\rho_w - \rho_b)/(\rho_w + \rho_b)$$로 $$E$$가 사라진다. 대비는 물체의 성질(반사율)만 담는다. 그래서 대비를 쓰면 아침이든 한낮이든 같은 물체를 같게 알아볼 수 있다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.4 (가시광: 빛의 표현), p.19 (요약)
[^s1]: 에이전트 보충. 전구와 종이의 수치(100 cd, 반사율 0.8·0.05, 500 lx)는 설명용 가상 수치다.
[^s2]: 에이전트 보충. 측광량의 표와 식(역제곱 법칙, 완전 확산면의 $$L = \rho E/\pi$$, 웨버·마이컬슨 대비)은 측광·영상 공학 교재의 표준 내용이다. 슬라이드는 이름만 든다. 이미지 값이 휘도에 비례한다는 것은 감마 보정 전의 선형 센서 값에 대한 설명이다.
[^s3]: 에이전트 보충. 밝기 항등성을 주변과의 비로 설명하는 것은 지각 교재의 표준 설명(비율 원리)이지만, 그것만으로 모든 경우를 설명하지는 못한다.
{% endraw %}
