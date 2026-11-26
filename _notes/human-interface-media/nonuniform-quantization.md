---
layout: "note"
title: "비균일 양자화"
display_title: "비균일 양자화 (Non-uniform Quantization)"
kind: "concept"
kind_label: "기법"
num: "64"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Non-uniform Quantization", "Nonuniform Quantization", "비선형 양자화", "압신", "Companding", "압축기", "Compressor", "신장기", "Expander", "μ 법칙", "mu-law", "μ-law", "A 법칙", "A-law", "G.711"]
description: "자의 눈금을 0 근처에는 촘촘하게, 끝으로 갈수록 성기게 새긴 것과 같다. 작은 소리는 좁은 칸으로 꼼꼼히 적고 큰 소리는 넓은 칸으로 대충 적어서, 같은 비트로도 작은 소리부터 큰 소리까지 잡음의 비율이 거의 일정하다. 대신 큰 소리만 계속 나는 신호라면 같은 비트의 고른 눈금보…"
prev_url: "/studies/human-interface-media/quantization-noise-sqnr/"
prev_title: "양자화 잡음과 SQNR"
next_url: "/studies/human-interface-media/mpeg-audio/"
next_title: "MPEG 오디오 부호화"
math: true
mermaid: true
code_count: 2
code_files: [{"t": "64_nonuniform-quantization_plot.py", "u": "/studies/human-interface-media/code/64_nonuniform-quantization_plot/", "r": "그림 생성"}, {"t": "64_nonuniform-quantization_verify.py", "u": "/studies/human-interface-media/code/64_nonuniform-quantization_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/nonuniform-quantization/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자의 눈금을 0 근처에는 촘촘하게, 끝으로 갈수록 성기게 새긴 것과 같다. 작은 소리는 좁은 칸으로 꼼꼼히 적고 큰 소리는 넓은 칸으로 대충 적어서, 같은 비트로도 작은 소리부터 큰 소리까지 잡음의 비율이 거의 일정하다. 대신 큰 소리만 계속 나는 신호라면 같은 비트의 고른 눈금보다 잡음이 크다.

</div>


## 예시로 보기

[균일 양자화](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)는 값이 크든 작든 칸 폭 $$\Delta$$가 같다. 그래서 잡음 크기도 늘 같다. 8비트로 −1 ~ 1을 나누면 칸 폭이 $$2/256 \approx 0.0078$$이다. 범위를 꽉 채운 소리는 잡음보다 약 50 dB 크다. 그런데 꽉 찬 크기의 1/100(−40 dB)인 소리, 예를 들어 0.01 크기의 소리는 0 근처 칸 한두 개 안에서만 움직인다. 잡음 크기는 그대로라서 SQNR이 약 9 dB까지 떨어진다[^s1].

칸 폭을 값에 따라 바꾸면 이 문제가 풀린다. 두 방식의 차이는 이렇다.

| | 균일 양자화 | 비균일 양자화 |
|---|---|---|
| 칸 경계 $$x_k$$ | 같은 간격 | 0 근처에 몰려 있고 끝으로 갈수록 벌어진다 |
| 대표값 $$y_k$$ | 같은 간격 | 0 근처에 촘촘, 끝에서 성김 |
| 오차 $$q(x)$$의 톱니 | 어디서나 높이가 같다 | 0 근처에서 낮고 끝에서 높다 |

$$x_k$$는 칸과 칸 사이 경계, $$y_k$$는 칸의 대표값(양자화 값), $$q(x)$$는 입력 $$x$$에서 생기는 오차다.

왜 작은 값을 더 아끼는가? 이유는 두 가지다[^s2].

- 말소리와 음악은 대부분의 시간을 작은 진폭에서 보낸다. 큰 진폭은 가끔만 나온다. 자주 나오는 값을 정밀하게 적는 편이 평균 잡음을 줄인다.
- 사람은 소리 크기를 비율로 느낀다. 0.1이 0.2가 되는 변화와 0.4가 0.8이 되는 변화를 비슷하게 듣는다. 그래서 크기를 [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)처럼 로그로 잰다([소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/)). 작은 소리 위의 잡음 0.005는 크게 들리고, 큰 소리 위의 같은 0.005는 거의 안 들린다. 오차를 값에 비례하게 두면 어느 크기에서나 비슷하게 들린다.

0.01 크기의 소리를 8비트로 적는다고 하자. 양수 쪽 칸은 128개다. 균일 양자화에서는 $$0.01 / (1/128) = 1.28$$이라 0에서 두 번째 칸에 든다. 아래에 나올 μ 법칙으로 먼저 눌러 담으면 0.01이 0.2285가 되고, $$0.2285 \times 128 \approx 29.2$$라 30번째 칸에 든다. 작은 소리가 칸 30개를 넘나들며 적힌다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**비균일 양자화**는 값에 따라 칸 폭을 다르게 정하는 양자화다. 소리에서는 작은 진폭에 좁은 칸, 큰 진폭에 넓은 칸을 준다.<br>
**압신**(companding)은 이를 만드는 흔한 방법이다. 값을 곡선 $$F$$로 눌러 담고(압축, compress), 눌러 담은 값을 균일하게 양자화한 뒤, 받는 쪽에서 $$F$$의 역함수로 펴서(신장, expand) 원래 눈금으로 되돌린다[^s3].

</div>


```mermaid
graph LR
  X["입력 x"] --> F["압축기 F(x)<br/>작은 값을 늘리고 큰 값을 누른다"] --> Q["균일 양자화<br/>N비트"] --> T["부호를 저장·전송"] --> G["신장기 F의 역함수<br/>원래 눈금으로"] --> Y["출력"]
```

가로축 $$x$$에서 칸 경계가 고르지 않은 이유는 이렇다. 세로축 $$y = F(x)$$에서는 칸 폭이 같다. 곡선이 가파른 곳(0 근처)에서는 $$y$$의 한 칸이 $$x$$의 좁은 구간에 걸치고, 곡선이 완만한 곳(끝 쪽)에서는 넓은 구간에 걸친다.

**μ 법칙**(뮤 법칙, μ-law)은 로그 곡선으로 눌러 담는다. 북미와 일본의 전화에서 $$\mu = 255$$를 쓴다[^s3].

$$
F(x) = \operatorname{sgn}(x)\,\frac{\ln(1 + \mu|x|)}{\ln(1 + \mu)}, \qquad -1 \le x \le 1
$$


- $$x$$: 꽉 찬 진폭을 1로 맞춘 입력
- $$\operatorname{sgn}(x)$$: $$x$$의 부호(양수면 +1, 음수면 −1). 양수 쪽 곡선을 음수 쪽에 뒤집어 쓴다는 뜻이다.
- $$\ln$$: 자연로그
- $$\mu$$: 곡선을 얼마나 휘게 할지 정하는 수. 0에 가까우면 거의 직선(균일)이다.

대입해 보면 $$F(0) = 0$$, $$F(1) = 1$$이고, $$F(0.01) = \ln 3.55 / \ln 256 \approx 0.2285$$다. 신장기는 $$F$$를 거꾸로 푼다.

$$
F^{-1}(y) = \operatorname{sgn}(y)\,\frac{(1 + \mu)^{|y|} - 1}{\mu}
$$


**A 법칙**(A-law)은 유럽 등의 전화에서 $$A = 87.6$$으로 쓴다. 아주 작은 입력($$\vert x\vert  < 1/A$$)은 직선으로, 그보다 큰 입력은 로그로 눌러 담는다[^s3].

$$
F(x) = \operatorname{sgn}(x) \begin{cases} \dfrac{A|x|}{1 + \ln A}, & 0 \le |x| < \dfrac{1}{A} \\[2ex] \dfrac{1 + \ln(A|x|)}{1 + \ln A}, & \dfrac{1}{A} \le |x| \le 1 \end{cases}
$$


두 식은 $$\vert x\vert  = 1/A$$에서 둘 다 $$1/(1 + \ln A) \approx 0.183$$이 되어 끊기지 않고 이어진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/64_nonuniform-quantization_fig1.svg" alt="그림" width="628" height="348" loading="lazy">

왼쪽 그림의 파란 곡선이 μ 법칙 압축기이고, 회색 점선은 아무것도 하지 않는 곧은 선(균일)이다. 세로축을 같은 간격 8칸으로 나눈 경계(주황 점선)를 곡선에 대고 아래로 내리면, 가로축의 경계(주황 눈금)가 0 근처에 몰리고 오른쪽으로 갈수록 벌어진다. 오른쪽 그림은 4비트 양자화의 오차다. 회색(균일)은 어디서나 같은 높이의 톱니이고, 파랑(μ 법칙)은 0 근처에서 아주 작고 ±1 쪽으로 갈수록 커진다. ±1 밖에서는 두 방식 모두 끝 칸으로 잘려 오차가 계속 커진다[^s4].

8비트 μ 법칙의 칸 폭을 실제로 세면, 0 바로 옆 칸은 균일 칸의 약 1/45(0.00017)이고 맨 끝 칸은 균일 칸의 약 5.4배(0.043)다. 가장 큰 칸이 가장 작은 칸의 약 245배다. 곡선의 기울기로 따지면 0에서 $$\mu/\ln(1 + \mu) \approx 46$$, 1에서 약 0.18이라 그 비가 $$1 + \mu = 256$$이다[^s1].

## 예제

8비트에서 정현파의 크기를 꽉 찬 진폭부터 줄여 가며 SQNR을 쟀다[^s1].

| 입력 크기 (꽉 찬 진폭 기준) | 0 dB | −10 dB | −20 dB | −30 dB | −40 dB | −50 dB |
|---|---|---|---|---|---|---|
| 균일 8비트 | 49.8 | 40.1 | 30.3 | 19.1 | 9.3 | 0.4 |
| μ 법칙 8비트 | 37.4 | 38.5 | 38.2 | 36.9 | 34.1 | 30.2 |
| A 법칙 8비트 | 37.5 | 37.2 | 37.4 | 37.5 | 34.2 | 24.4 |

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/64_nonuniform-quantization_fig2.svg" alt="그림" width="592" height="335" loading="lazy">

왼쪽(작은 소리)부터 보면, 회색 균일 선은 입력이 10 dB 작아질 때마다 SQNR도 약 10 dB씩 떨어진다. 파란 μ 법칙 선은 −30 dB까지 37 ~ 38 dB 근처에서 거의 평평하다. 오른쪽 끝(큰 소리)으로 가면 균일이 μ 법칙을 따라잡고, 약 −12 dB에서 두 선이 엇갈린다. 그보다 큰 소리는 균일 쪽이 낫다. A 법칙(주황 점선)은 0 근처를 직선으로 처리해 아주 작은 소리(−40 dB 아래)에서 μ 법칙보다 낮다[^s4].

μ 법칙의 평평한 높이는 근사식 $$6.02N + 4.77 - 20\log_{10}\ln(1 + \mu)$$로도 어림할 수 있다. $$N = 8$$, $$\mu = 255$$면 $$48.2 + 4.77 - 14.9 \approx 38.1$$ dB로, 잰 값 37 ~ 38.5 dB와 맞는다[^s5].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 압축기와 신장기가 서로 역함수(μ, A 법칙, 2001개 점), A 법칙의 연결점 0.183, $$F(0.01) = 0.2285$$와 칸 번호(균일 2번째, μ 법칙 30번째), 8비트 칸 폭의 최소 0.000174·최대 0.0426·비 245, 위 SQNR 표, 엇갈리는 점 약 −11.5 dB, 근사식 38.06 dB (실험으로 확인됨) — [64_nonuniform-quantization_verify.py](/Hongs_Blog/studies/human-interface-media/code/64_nonuniform-quantization_verify/)</div>

</div>


## 활용

- 디지털 전화(ITU-T G.711)는 표본을 초당 8,000번 뽑아 μ 법칙이나 A 법칙 8비트로 적는다. $$8{,}000 \times 8 = 64$$ kb/s다[^s3]. μ 법칙 8비트의 가장 작은 칸(0.00017)은 균일 13비트의 칸(0.00024)과 14비트의 칸(0.00012) 사이 크기다. 작은 소리를 균일 13 ~ 14비트만큼 꼼꼼히 적으면서 비트는 8개만 쓴다[^s1]. 전송 쪽 이야기는 [PCM](/Hongs_Blog/studies/computer-communication/pcm/)에 있다.
- MPEG 오디오도 비균일 양자화를 쓴다. 큰 값일수록 칸을 넓게 두어, 사람이 크기를 로그로 느끼는 성질에 맞춘다: [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)[^s7].
- 같은 생각이 이미지에도 있다. 사람 눈도 밝기를 비율로 느껴서, 8비트 밝기 단계를 어두운 쪽에 더 촘촘히 배분하는 감마 부호화를 쓴다([디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/))[^s6].
- 흔한 실수: 신장기를 빼먹는 것. 받는 쪽이 압축된 값을 그대로 소리로 내면 작은 소리가 크게 부풀려진 일그러진 소리가 나온다.

## 연결

- 선수: [양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/) (균일 양자화의 잡음), [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/), [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/)
- 로그 곡선 자체: [로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/)
- 다음: [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"비균일 양자화는 균일 양자화보다 늘 잡음이 작다"</div>

틀렸다. 작은 소리에서 SQNR이 크게 좋아지는 것을 보면 모든 경우에 나은 것처럼 보인다. 실제로는 칸 수가 같으므로, 0 근처에 칸을 몰아준 만큼 큰 값 쪽 칸이 넓어진다. 범위를 꽉 채운 정현파는 8비트 균일이 약 49.8 dB, μ 법칙이 약 37.4 dB로 균일이 12 dB 넘게 낫다. 비균일 양자화는 큰 소리의 정밀도를 조금 내주고 작은 소리의 정밀도를 크게 얻는 거래다. 확인 방법: 위 표의 0 dB 열과 −40 dB 열을 비교한다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 균일 양자화에서 작은 소리의 SQNR이 나빠지는 이유를 쓰고, 소리를 적을 때 작은 값에 칸을 촘촘히 주는 것이 좋은 이유 두 가지를 쓰라.</summary>


**답:** 균일 양자화는 값과 상관없이 칸 폭이 같아 잡음 크기가 늘 같다. 소리가 작아지면 신호만 줄어 SQNR이 소리가 줄어든 만큼 떨어진다. 좋은 이유는 (1) 말소리·음악은 작은 진폭이 훨씬 자주 나와서, 자주 나오는 값을 정밀하게 적으면 평균 잡음이 준다. (2) 사람은 크기를 비율(로그)로 느껴서, 오차를 값에 비례하게 두면 어느 크기에서나 비슷하게 들린다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> $$\mu = 255$$인 μ 법칙 압축기에 $$x = 0.01$$을 넣으면 출력은 얼마인가? 8비트(양수 쪽 128칸)라면 균일 양자화와 μ 법칙에서 각각 0에서 몇 번째 칸에 드는가?</summary>


**답:** $$F(0.01) = \ln(1 + 2.55)/\ln 256 = \ln 3.55 / \ln 256 \approx 1.267/5.545 \approx 0.2285$$. 균일: $$0.01 \times 128 = 1.28$$이라 두 번째 칸. μ 법칙: $$0.2285 \times 128 \approx 29.2$$라 30번째 칸.<br>
**흔한 오답:** $$\ln$$ 대신 $$\log_{10}$$을 쓰는 것. 분자와 분모에 같은 밑을 쓰면 비는 같지만, 한쪽만 바꾸면 틀린다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 늘 범위를 꽉 채우는 큰 정현파만 8비트로 보내는 장치가 있다. μ 법칙과 균일 양자화 중 무엇이 나은가? 이유를 쓰라.</summary>


**답:** 균일 양자화가 낫다. 꽉 찬 정현파에서 균일 8비트는 약 49.8 dB, μ 법칙 8비트는 약 37.4 dB다.<br>
**이유:** μ 법칙은 0 근처에 칸을 몰아준 대신 큰 값 쪽 칸이 균일보다 최대 5배 넘게 넓다. 신호가 늘 크면 촘촘한 칸을 쓸 일이 없고 넓은 칸의 손해만 본다.

</details>

[^s1]: 정현파는 초당 표본 수와 맞아떨어지지 않는 주파수로 10만 개를 뽑아 썼다.
[^s2]: 작은 진폭이 자주 나온다는 것과 크기를 비율로 느낀다는 두 이유는 음성 부호화 교재의 표준 설명이다. 0.005 예는 설명용 수치다.
[^s3]: 식이 서로 역함수인지와 연결점은 검증 코드로 확인했다.
[^s4]: [64_nonuniform-quantization_plot.py](/Hongs_Blog/studies/human-interface-media/code/64_nonuniform-quantization_plot/)로 그렸고, 경계가 0 쪽에서 좁고 끝에서 넓은지, 0 dB와 −40 dB의 SQNR, 엇갈리는 점이 −14 ~ −10 dB 안인지 같은 코드로 확인했다.
[^s5]: 근사식은 통신 교재에 흔히 나오는 μ 법칙 SQNR 어림식이다.
[^s6]: sRGB 같은 영상 표준이 밝기를 비선형으로 부호화한다는 것은 영상 처리 교재의 표준 내용이다.
[^s7]: MPEG-1 Layer III(MP3)는 값을 3/4제곱한 뒤 균일 양자화해서 큰 값의 칸을 넓힌다(ISO/IEC 11172-3).
{% endraw %}
