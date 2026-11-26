---
layout: "note"
title: "YUV와 YCbCr"
display_title: "YUV와 YCbCr"
kind: "concept"
kind_label: "정의"
num: "41"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["YUV", "YCbCr", "YCrCb", "Y'CbCr", "루마", "luma", "크로마", "chroma", "chrominance", "색차", "color difference", "크로마 서브샘플링", "chroma subsampling", "4:2:0", "4:2:2", "4:4:4", "BT.601", "Rec. 601", "장치 의존", "device dependent", "장치 의존 색 공간", "sRGB", "NTSC"]
description: "화면의 RGB 숫자는 \"빨강·초록·파랑 전구를 각각 얼마나 켤지\"를 적은 화면 사용법이라, 같은 숫자라도 화면마다 전구 색이 다르면 다른 색이 나온다(장치 의존). 영상을 보내고 저장할 때는 이 RGB를 밝기 하나와 색 차이 둘로 바꾼다. 사람 눈은 밝기의 잔무늬는 잘 보지만 색의…"
prev_url: "/studies/human-interface-media/cie-lab/"
prev_title: "CIE Lab"
next_url: "/studies/human-interface-media/xyz-vs-lab/"
next_title: "CIE XYZ와 CIE Lab 비교"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "41_yuv-ycbcr_plot.py", "u": "/studies/human-interface-media/code/41_yuv-ycbcr_plot/", "r": "그림 생성"}, {"t": "41_yuv-ycbcr_verify.py", "u": "/studies/human-interface-media/code/41_yuv-ycbcr_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/yuv-ycbcr/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

화면의 RGB 숫자는 "빨강·초록·파랑 전구를 각각 얼마나 켤지"를 적은 화면 사용법이라, 같은 숫자라도 화면마다 전구 색이 다르면 다른 색이 나온다(장치 의존). 영상을 보내고 저장할 때는 이 RGB를 밝기 하나와 색 차이 둘로 바꾼다. 사람 눈은 밝기의 잔무늬는 잘 보지만 색의 잔무늬는 잘 보지 못하므로, 색 차이 둘을 거칠게 저장해 데이터를 크게 줄여도 티가 잘 나지 않는다. 대신 빨간 글씨처럼 색 경계가 날카로운 곳은 번지고, 여기서 쓰는 밝기 값은 눈이 느끼는 휘도와 정확히 같지는 않다.

</div>


## 예시로 보기

[디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/)에서 계산했듯이 풀HD 한 장을 빨강·초록·파랑 8비트씩(픽셀당 24비트)으로 적으면 6,220,800바이트이고, 초당 60장이면 약 3 Gbps다. 어디를 줄여야 사람이 덜 알아챌까?

**같은 숫자, 다른 색.** 먼저 RGB 숫자의 뜻부터 본다. 화면은 빨강·초록·파랑 세 광원을 골라 섞는다. 어떤 광원을 고를지는 화면 규격이 정한다. 흔한 컴퓨터 화면 규격 sRGB의 원색은 색도도에서 빨강 $$(0.64, 0.33)$$, 초록 $$(0.30, 0.60)$$, 파랑 $$(0.15, 0.06)$$이고 흰색은 $$(0.3127, 0.3290)$$이다. 예전 컬러 TV 규격 NTSC(1953)의 원색은 빨강 $$(0.67, 0.33)$$, 초록 $$(0.21, 0.71)$$, 파랑 $$(0.14, 0.08)$$이다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/41_yuv-ycbcr_fig1.svg" alt="그림" width="488" height="527" loading="lazy">

파란 삼각형이 sRGB 화면, 주황 삼각형이 NTSC 화면이 낼 수 있는 색이다. 오른쪽 아래의 두 동그라미는 두 화면에 똑같이 RGB $$(1, 0, 0)$$을 보냈을 때 나오는 빨강이고, 가운데 위의 두 네모는 $$(1, 1, 0)$$ 노랑이다. 숫자는 같은데 색도도의 자리가 다르다. sRGB 삼각형의 넓이는 NTSC 삼각형의 약 71%다. 이렇게 RGB 숫자의 뜻이 화면에 따라 달라지는 것을 장치 의존(device dependent)이라 부른다[^s1][^s5].

**밝기와 색을 나누면.** 사진 한 장을 R, G, B 세 장으로 나누면 세 장 모두 산과 헛간의 윤곽이 또렷하다. 같은 사진을 밝기 Y 한 장과 색 차이 U, V 두 장으로 나누면 윤곽은 Y에 몰리고, U와 V에는 밋밋한 색 얼룩만 남는다. 사람 눈은 색보다 밝기에 훨씬 민감하므로, 색 차이 두 장은 해상도를 줄여 보내도 된다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/41_yuv-ycbcr_fig2.svg" alt="그림" width="585" height="218" loading="lazy">

왼쪽부터 오른쪽으로 색 차이를 점점 덜 적는다. 4:4:4는 모든 픽셀에 밝기와 색 차이를 다 적는다. 4:2:2는 가로로 두 픽셀마다 색 차이를 한 번 적는다. 4:2:0은 가로 둘·세로 둘, 네 픽셀마다 색 차이를 한 번 적는다. 밝기 동그라미는 셋 모두 모든 픽셀에 그대로 있다[^s3][^s5].

4:2:0으로 풀HD 한 장을 적으면 픽셀당 12비트라 3,110,400바이트로 절반이 된다. 초당 60장이면 약 2.99 Gbps가 1.49 Gbps가 된다. 그래도 HDTV 방송 전송률 13~19 Mbps보다 약 79~115배 크다. 나머지는 이미지의 잔무늬를 덜 정밀하게 적는 변환 압축([해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/))이 맡는다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">루마와 색차 (BT.601)</div>

밝기(루마)는 R, G, B에 눈이 느끼는 밝기 비중을 곱해 더한 값이다. 색 차이(색차)는 파랑에서 밝기를 뺀 값과 빨강에서 밝기를 뺀 값, 둘이다. 회색이면 $$R = G = B = Y$$라서 두 색차가 모두 0이다[^s2].

**기호로 쓰면.** $$R, G, B \in [0, 1]$$(0~1로 맞춘 화면 값)일 때

$$Y = 0.299R + 0.587G + 0.114B, \qquad \text{색차: } B - Y,\ \ R - Y$$

아날로그 영상의 YUV는 색차에 배율을 곱한 $$U = 0.492\,(B - Y)$$, $$V = 0.877\,(R - Y)$$다. $$U$$는 $$-0.436 \sim 0.436$$, $$V$$는 $$-0.615 \sim 0.615$$ 사이에 있다.

</div>


<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">YCbCr (BT.601, 8비트)</div>

디지털 영상은 루마와 두 색차를 0~255 정수로 적는다. 방송 규격은 위아래에 여유를 두어 밝기를 16~235, 색차를 16~240에 넣고, 색차 0을 가운데 128에 둔다[^s2].

**기호로 쓰면.** $$Y$$는 위의 루마다.

$$Y' = 16 + 219\,Y, \qquad C_b = 128 + 224\,\frac{B - Y}{1.772}, \qquad C_r = 128 + 224\,\frac{R - Y}{1.402}$$

펼쳐 쓰면

$$\begin{bmatrix} Y' \\ C_b \\ C_r \end{bmatrix} = \begin{bmatrix} 16 \\ 128 \\ 128 \end{bmatrix} + \begin{bmatrix} 65.481 & 128.553 & 24.966 \\ -37.797 & -74.203 & 112.000 \\ 112.000 & -93.786 & -18.214 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$

</div>


여기의 $$R, G, B$$는 빛의 세기를 그대로 적은 값이 아니다. 화면에 보내기 전에 어두운 쪽을 더 촘촘히 적도록 휘어 놓은 값이고, 이렇게 휘는 일을 감마 보정이라 부른다. 그래서 이 $$Y$$는 실제 휘도와 조금 다르다(아래 오해 상자).

나누는 수 $$1.772 = 2(1 - 0.114)$$와 $$1.402 = 2(1 - 0.299)$$는 색차를 $$-0.5 \sim 0.5$$로 맞추는 배율이다. 예를 들어 순수한 파랑 $$(0, 0, 1)$$은 $$Y = 0.114$$, $$B - Y = 0.886$$이라 $$0.886 / 1.772 = 0.5$$로 가장 크다. 여기에 224를 곱하면 ±112, 128을 더하면 16~240이다.

다섯 색을 넣어 보면 이렇다[^s2].

| 색 | $$(R, G, B)$$ | $$(Y', C_b, C_r)$$ | 읽는 법 |
|---|---|---|---|
| 흰색 | (1, 1, 1) | (235, 128, 128) | 가장 밝고 색차 0 |
| 검정 | (0, 0, 0) | (16, 128, 128) | 가장 어둡고 색차 0 |
| 빨강 | (1, 0, 0) | (81, 90, 240) | $$C_r$$이 가장 크다 |
| 초록 | (0, 1, 0) | (145, 54, 34) | 세 원색 중 가장 밝다 |
| 파랑 | (0, 0, 1) | (41, 240, 110) | $$C_b$$가 가장 크고 어둡다 |

초록이 가장 밝게 나오는 것은 가중치 0.587이 가장 커서다. 눈이 초록 빛에 가장 민감하기 때문이다([비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/)). 0.299, 0.587, 0.114는 NTSC(1953) 원색과 흰색으로 RGB → XYZ 행렬을 만들었을 때 $$Y$$ 행인 $$(0.2989, 0.5866, 0.1144)$$에서 왔다. 원색이 다른 HD 규격(BT.709, sRGB)에서는 같은 방법으로 $$(0.2126, 0.7152, 0.0722)$$를 쓴다[^s4].

RGB → YCbCr은 $$3 \times 3$$ 행렬을 곱하고 상수를 더하는 변환이라 거꾸로 풀 수 있다([기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/)). 변환 자체로는 반올림 말고 잃는 것이 없다. 데이터가 주는 것은 색차를 덜 적는 다음 단계에서다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">크로마 서브샘플링</div>

색차를 픽셀보다 성기게 적어 데이터를 줄이는 방법이다. $$J{:}a{:}b$$는 가로 $$J$$픽셀, 세로 2줄 묶음에서 첫 줄의 색차 표본 수가 $$a$$, 둘째 줄에서 새로 적는 색차 표본 수가 $$b$$라는 뜻이다[^s3].

**기호로 쓰면.** 한 값에 8비트를 쓸 때 픽셀당 비트 수는 "밝기 8비트 + 색차 두 개 × 8비트 × (색차 표본 수 ÷ 픽셀 수)"다.

$$\text{픽셀당 비트} = 8\left(1 + 2 \times \frac{a + b}{2J}\right)$$

4:4:4는 $$8(1 + 2 \times 1) = 24$$, 4:2:2는 $$8(1 + 2 \times \tfrac12) = 16$$, 4:2:0은 $$8(1 + 2 \times \tfrac14) = 12$$비트다.

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: NTSC·sRGB 원색에서 $$(1, 0, 0)$$, $$(1, 1, 0)$$의 색도와 넓이 비 0.708, 두 규격의 밝기 가중치(행렬의 $$Y$$ 행), BT.601 펼친 계수와 다섯 색의 값, 회색 1,000개의 $$C_b = C_r = 128$$, 범위 16~235·16~240, YUV 범위 ±0.436·±0.615, JPEG 방식 역변환 1,000회, 픽셀당 비트와 풀HD·1280×720 크기, sRGB 0.5 회색의 휘도 0.214 (실험으로 확인됨). 코드: [41_yuv-ycbcr_verify.py](/Hongs_Blog/studies/human-interface-media/code/41_yuv-ycbcr_verify/)</div>

</div>


## 활용

- **영상·사진 압축.** JPEG 사진과 대부분의 동영상 부호화는 RGB를 YCbCr로 바꾸고, 흔히 4:2:0으로 색차를 줄인 뒤 이산 코사인 변환으로 더 줄인다. 사진 파일(JPEG)은 0~255 전체 범위 공식 $$Y = 0.299R + 0.587G + 0.114B$$, $$C_b = 128 + (B - Y)/1.772$$, $$C_r = 128 + (R - Y)/1.402$$($$R, G, B$$는 0~255)를 쓴다[^s2].
- **흑백과 컬러의 호환.** 예전 컬러 TV 방송은 밝기 Y를 그대로 보내고 색차를 덧붙였다. 흑백 TV는 Y만 받아 그대로 보여 주면 됐다[^s2].
- **흔한 실수.** ① BT.601 가중치(0.299, 0.587, 0.114)와 BT.709 가중치(0.2126, 0.7152, 0.0722)를 섞어 쓰면 색이 조금 틀어진다. ② 방송 범위(16~235)와 전체 범위(0~255)를 헷갈리면 검정이 회색으로 뜨거나 어두운 부분이 뭉개진다. ③ 빨간 글씨·파란 배경처럼 색 경계가 날카로운 그림을 4:2:0으로 줄이면 경계가 번진다[^s3].

## 연결

- 선수: [색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/) (원색 삼각형, 흰색점), [디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/) (픽셀당 24비트, 데이터 크기)
- 밝기 가중치의 뿌리: [비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/)
- 밝기 하나와 색 차이 둘로 나누는 것은 눈의 [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/)과 같은 나눔이다
- 장치에 매이지 않는 색 좌표: [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/), [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)
- 다른 과목: RGB → YCbCr를 좌표계 바꾸기로 보면 [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"YCbCr의 Y는 CIE XYZ의 Y, 곧 휘도와 같다"</div>

틀렸다. 둘 다 Y라 부르고 둘 다 "밝기"라서 같아 보인다. YCbCr의 Y는 감마 보정된 화면 값 $$R, G, B$$에 특정 원색의 가중치를 곱해 더한 값이라, 따로 루마(luma)라 부르고 $$Y'$$로 적기도 한다. CIE의 Y는 빛의 세기에 비례하는 휘도다. 감마 보정 탓에 둘은 어긋난다. 확인: sRGB 값 $$(0.5, 0.5, 0.5)$$인 회색의 루마는 0.5지만, 감마를 풀어 계산한 실제 휘도는 흰색의 약 0.214다[^s4].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> BT.601의 밝기 $$Y$$ 식을 쓰라. 가중치가 가장 큰 것은 어느 색이고 왜인가? 8비트 YCbCr에서 회색의 $$C_b$$, $$C_r$$는 얼마인가?</summary>


**답:** $$Y = 0.299R + 0.587G + 0.114B$$. 초록(0.587)이 가장 크다. 눈이 초록 빛을 가장 밝게 느끼기 때문이다(비시감 효율 곡선의 봉우리가 초록 근처). 회색은 $$R = G = B = Y$$라 색차가 0이고, 0을 128에 두므로 $$C_b = C_r = 128$$이다.<br>
**흔한 오답:** 회색의 $$C_b$$, $$C_r$$를 0이라 쓴다. 8비트 YCbCr는 색차 0을 128에 둔다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 가로 1280, 세로 720 픽셀 이미지를 값 하나당 8비트로 적는다. 4:4:4, 4:2:2, 4:2:0으로 적을 때 한 장의 크기는 각각 몇 바이트인가?</summary>


**답:** 픽셀당 24, 16, 12비트라 $$1280 \times 720 = 921{,}600$$픽셀에 곱하면 각각 2,764,800바이트, 1,843,200바이트, 1,382,400바이트다. 4:2:0은 4:4:4의 절반이다.<br>
**흔한 오답:** 4:2:0을 "색차를 4분의 1로 줄였으니 전체도 4분의 1"로 계산한다. 밝기는 그대로라 전체는 절반이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 카메라가 찍은 RGB를 YCbCr로 바꿔 보내면, 받는 쪽 화면이 sRGB든 NTSC든 같은 색으로 보이는가? 장치마다 같은 색을 보장하려면 어떤 좌표가 필요한가?</summary>


**답:** 보이지 않는다. YCbCr는 같은 RGB 숫자를 밝기와 색차로 다시 적은 것뿐이라, 받는 쪽에서 RGB로 되돌리면 같은 숫자가 나오고, 그 숫자는 화면의 원색에 따라 다른 색이 된다. 장치마다 같은 색을 내려면 CIE XYZ나 CIE Lab처럼 장치에 매이지 않는 좌표를 거쳐, 화면마다 자기 원색에 맞는 RGB로 다시 계산해야 한다.

</details>

[^s1]: NTSC(1953) 원색 (0.67, 0.33), (0.21, 0.71), (0.14, 0.08)과 C 흰색 (0.3101, 0.3162)은 FCC 1953 규격(ITU-R BT.470)의 표준값이다. 두 화면의 $$(1, 0, 0)$$, $$(1, 1, 0)$$ 자리와 넓이 비 0.708은 검증 코드에서 계산했다.
[^s2]: 루마 식, YUV의 배율 0.492·0.877, 8비트 YCbCr의 16~235·16~240 범위와 펼친 계수는 ITU-R BT.601의 표준 내용이다. JPEG 전체 범위 공식은 JFIF 규격이다. 위아래 여유는 아날로그 신호와 필터가 범위를 조금 넘쳐도 잘리지 않게 두는 것이다. 흑백 TV 호환은 컬러 방송 규격의 표준 설명이다.
[^s3]: $$J{:}a{:}b$$ 표기와 픽셀당 비트 계산, 풀HD·HDTV 전송률과의 비교(13~19 Mbps는 [디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/)의 수치)는 계산으로 보탰다. JPEG·동영상 부호화가 흔히 4:2:0을 쓴다는 것과 색 경계 번짐은 영상 부호화의 표준 내용이다.
[^s4]: 가중치가 원색의 RGB → XYZ 행렬의 $$Y$$ 행이라는 것과 두 행 $$(0.2989, 0.5866, 0.1144)$$, $$(0.2126, 0.7152, 0.0722)$$는 검증 코드에서 계산했다. 루마와 휘도의 구별, sRGB 감마 식($$((V + 0.055)/1.055)^{2.4}$$)은 IEC 61966-2-1과 Poynton, *Digital Video and HD* 2판의 표준 내용이다.
[^s5]: [41_yuv-ycbcr_plot.py](/Hongs_Blog/studies/human-interface-media/code/41_yuv-ycbcr_plot/)로 그렸다. 말굽은 Wyman, Sloan, Shirley(2013)의 해석적 등색 함수 근사(420~645 nm)다. 그림의 값(밝기 가중치, 노랑의 자리, 픽셀당 비트)을 같은 코드에서 확인했다.
{% endraw %}
