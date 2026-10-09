---
layout: "note"
title: "디지털 이미지"
display_title: "디지털 이미지 (Digital Image)"
kind: "concept"
kind_label: "정의"
num: "25"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Digital Image", "디지털 이미지", "픽셀", "pixel", "화소", "양자화", "quantization", "부호화", "encoding", "비트 깊이", "bit depth", "트루컬러", "TrueColor", "컬러 코드", "color code"]
description: "사진을 모눈종이에 대고 칸마다 평균 밝기를 정수 하나로 적은 표가 디지털 이미지다. 칸 하나를 픽셀이라 부른다. 칸을 잘게 나눌수록, 그리고 밝기를 더 많은 단계로 적을수록 원래 사진에 가까워진다. 대신 데이터가 금방 커진다. 풀HD 동영상을 그대로 보내면 초당 약 3기가비트라 실…"
prev_url: "/studies/human-interface-media/complex-wave/"
prev_title: "파동의 복소수 표현"
next_url: "/studies/human-interface-media/resolution-spatial-frequency/"
next_title: "해상도와 공간 주파수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/digital-image/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사진을 모눈종이에 대고 칸마다 평균 밝기를 정수 하나로 적은 표가 디지털 이미지다. 칸 하나를 픽셀이라 부른다. 칸을 잘게 나눌수록, 그리고 밝기를 더 많은 단계로 적을수록 원래 사진에 가까워진다. 대신 데이터가 금방 커진다. 풀HD 동영상을 그대로 보내면 초당 약 3기가비트라 실제 방송 회선보다 백 배 넘게 크고, 그래서 사람이 못 알아채는 부분을 버리는 압축이 꼭 필요하다.

</div>


## 예시로 보기

카메라는 장면에서 오는 빛을 렌즈로 모아 센서 평면에 맺고, 그 평면을 격자로 나눠 칸마다 빛의 세기를 잰다[^1]. 이 과정이 네 단계로 이어진다[^2].

```
이미지 ──(디지털 표현, 이미지 캡처)──▶ 픽셀 배열 ──(픽셀 밝기 양자화)──▶ 이미지 데이터
매끈한 밝기 분포                         격자 칸마다 평균 밝기               칸마다 0~255 정수
```

슬라이드의 예에서 물체 바깥 칸은 255(흰색), 물체 안쪽은 칸마다 20, 75, 127, 175 같은 값이 적힌다[^2]. 밝기 0이 검정, 255가 흰색이다[^3].

이제 얼마나 큰지 계산한다. 풀HD(HDTV) 화면은 가로 1920, 세로 1080 픽셀이다. 빨강·초록·파랑마다 8비트(256단계)를 쓰면 픽셀 하나에 24비트, 곧 3바이트다[^4].

| 계산 | 값 |
|---|---|
| 한 장: $$3 \times 1920 \times 1080$$ | 6,220,800 바이트 ≈ 5.93 MiB (슬라이드: 6 Mbytes) |
| 한 장의 비트 | 49,766,400 비트 ≈ 47.46 Mibit (슬라이드: 47.5 Mbits) |
| 초당 60장 | 373,248,000 바이트/초 ≈ 356 MiB/s (슬라이드: 360 Mbyte/sec) |
| 초당 비트 | 약 2.99 Gbps ≈ 2.78 Gibit/s (슬라이드: 2.81 Gbps) |

실제 HDTV 방송의 전송률은 13~19 Mbps다[^4]. 그대로 보낼 때의 약 3 Gbps와 비교하면 157배에서 230배를 줄여 보내는 셈이다. 1분짜리 영상이 그대로면 약 22 GB인데, 압축하면 100~140 MB 정도가 된다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **픽셀(화소)**: 밝기를 나타내는 한 점(또는 작은 원·사각형)이다. 위치는 $$i(x, y)$$ 또는 열과 행으로 $$i(c, r)$$처럼 쓴다[^5].
- **디지털 이미지**: 2차원 공간에 픽셀을 늘어놓은 분포다. 세로 $$M$$칸, 가로 $$N$$칸이면 행렬로 쓴다[^5].

$$ I = \begin{bmatrix} i(0, 0) & \cdots & i(0, N - 1) \\ \vdots & \ddots & \vdots \\ i(M - 1, 0) & \cdots & i(M - 1, N - 1) \end{bmatrix} $$

- **양자화**: 각 픽셀의 밝기를 정해진 단계 중 하나의 디지털 수치(부호)로 바꾸는 일이다[^3]. 한 픽셀에 $$b$$비트를 쓰면 $$2^b$$단계를 나타낸다.
- **부호화**: 각 단계에 비트 패턴을 정해 주는 일이다[^6].

</div>


[이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/) $$i(x, y)$$는 위치가 연속인 함수였다. 디지털 이미지는 그 함수를 격자점에서만 재고(표본화), 잰 값을 단계에 맞춰 반올림한(양자화) 결과다. 행렬의 칸 번호가 곧 위치다.

비트 수에 따라 표현이 이렇게 바뀐다[^6].

| 비트 | 단계 수 | 부호의 예 |
|---|---|---|
| 1 | 2 | 1 = 켜짐, 0 = 꺼짐 |
| 2 | 4 | 00, 01, 10, 11이 서로 다른 회색 |
| 4 | 16 | 컬러 코드: 부호마다 색 하나를 정해 둔 표를 쓴다(예: 0000 = 검정) |
| 8 | 256 | 회색 256단계, 또는 256색 표 |
| 24 | $$2^{24} = 16{,}777{,}216$$ | 트루컬러: 빨강·초록·파랑 각 8비트. 약 1,670만 색으로 사람이 구별할 수 있는 수보다 많다 |

비트를 줄이면 8비트에서는 매끈하던 하늘이 4비트, 2비트로 갈수록 등고선처럼 띠가 진다. 1비트에서는 검정과 흰색만 남는다[^3].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 4비트 컬러 코드의 예 "0000: black, 0012: green"(p.8) / 문제점: 2진 부호에는 0과 1만 쓰므로 "0012"는 4비트 부호가 아니다 / 수정안: 2진 부호 하나(예: 0010)로 읽는다. 어느 부호가 초록인지는 색 표마다 다르다 / 근거: 4비트 부호는 0000~1111의 16가지뿐이다 — [25_digital-image_verify.py](/Hongs_Blog/studies/human-interface-media/code/25_digital-image_verify/)

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$2^b$$ 단계 수, $$2^{24}$$, HDTV 한 장과 초당 데이터량(10진·2진 단위), 슬라이드 2.81 Gbps의 계산 과정, 13~19 Mbps와의 비율 157~230배 (실험으로 확인됨) — [25_digital-image_verify.py](/Hongs_Blog/studies/human-interface-media/code/25_digital-image_verify/)</div>

</div>


## 활용

- 슬라이드의 질문 "이 정도의 데이터가 정말 필요할까?"[^4]의 답이 압축이다. 사람이 거의 못 보는 높은 공간 주파수를 덜 정밀하게 적는다: [해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/). 강의 계획표 14주차의 이산 코사인 변환이 그 도구다[^s2].
- 빨강·초록·파랑 세 값을 쓰는 이유는 사람 눈의 추상체가 세 종류이기 때문이다: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/).
- 흔한 실수: Mbyte와 Mbit, 10진 메가(10⁶)와 2진 메비(2²⁰)를 섞는 것. 슬라이드도 바이트는 2진 단위로, 전송률은 다시 1024로 나눠 적어서 2.99 Gbps가 2.81 Gbps로 적혔다.

## 연결

- 선수: [이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/)
- 같은 표본화·양자화를 신호 쪽에서: [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)
- 격자를 얼마나 촘촘히 하나: [해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"비트 수를 두 배로 늘리면 밝기 단계도 두 배가 된다"</div>

틀렸다. 비트가 하나 늘 때마다 단계 수가 두 배가 되므로, 비트를 두 배로 늘리면 단계 수는 제곱이 된다. 4비트는 16단계, 8비트는 $$16^2 = 256$$단계다. 데이터 양은 비트 수에 비례해 두 배로만 는다. 그래서 적은 비트를 더해도 표현력이 크게 좋아진다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 이미지가 디지털 이미지 데이터가 되기까지의 단계를 순서대로 쓰고, 양자화가 무엇을 바꾸는지 쓰라.</summary>


**답:** 이미지 → 디지털 표현(이미지 캡처) → 픽셀 배열 → 픽셀 밝기 양자화 → 이미지 데이터. 양자화는 픽셀마다 연속인 밝기를 정해진 단계 중 하나의 디지털 수치로 바꾼다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 가로 1280, 세로 720 픽셀, 픽셀당 24비트인 영상을 초당 30장 보내면 초당 몇 비트인가? 10 Mbps 회선으로 보내려면 몇 배를 줄여야 하는가?</summary>


**답:** $$1280 \times 720 \times 24 \times 30 = 663{,}552{,}000$$비트/초, 약 664 Mbps. $$663.6 / 10 \approx 66$$배를 줄여야 한다.<br>
**흔한 오답:** 바이트(3)와 비트(24)를 섞어 8배 작게 계산하는 것.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 슬라이드의 "0012: green"이 4비트 2진 부호로 맞지 않는 이유를 쓰고, 4비트로 나타낼 수 있는 색의 수를 쓰라.</summary>


**답:** 2진 부호의 자리에는 0과 1만 올 수 있어 "2"가 들어갈 수 없다. 4비트 부호는 0000~1111의 $$2^4 = 16$$가지라 색도 16가지다. 어떤 부호가 어떤 색인지는 따로 정한 색 표가 정한다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/05.HIM_강의05_이미지의표현.pdf, p.2 (조명, 장면, 영상 시스템, 내부 영상 평면, 디지털화된 출력 영상 그림)
[^2]: 같은 자료, p.4 (이미지 표현: 디지털 표현 → 픽셀 배열 → 픽셀 밝기 양자화 → 이미지 데이터, 숫자로 적힌 격자)
[^3]: 같은 자료, p.7 (양자화: 8, 4, 2, 1비트 영상, 회색 단계 0 검정 ~ 255 흰색)
[^4]: 같은 자료, p.9 (이미지 데이터: HDTV 1920 × 1080, 3바이트, 6 Mbytes = 47.5 Mbits, 초당 60장 360 Mbyte/sec = 2.81 Gbps, HDTV 전송률 13~19 Mbps)
[^5]: 같은 자료, p.3 (화소: 픽셀, 위치 $$i(x, y)$$ 또는 $$i(c, r)$$, 디지털 이미지는 2차원 공간의 픽셀 분포)
[^6]: 같은 자료, p.8 (부호화: 1, 2, 4, 8, 24비트, 컬러 코드, 24비트 트루컬러는 1,670만 색 이상)
[^s1]: 에이전트 보충. 10진·2진 단위를 나눈 표, 비율 157~230배, 1분짜리 영상 크기는 슬라이드의 수치로 직접 계산했다(검증 코드).
[^s2]: 에이전트 보충. 압축이 높은 공간 주파수를 덜 정밀하게 적는다는 설명은 JPEG 같은 변환 부호화의 표준 내용이다. 강의 계획표 14주차 "Discrete Cosine Transform"과 연결된다. 카드 C2의 수치는 원본에 없고 직접 계산했다.
{% endraw %}
