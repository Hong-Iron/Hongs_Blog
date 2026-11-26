---
layout: "note"
title: "임계 대역과 바크 스케일"
display_title: "임계 대역과 바크 스케일 (Critical Band and Bark Scale)"
kind: "concept"
kind_label: "정의"
num: "53"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Critical Band", "Bark Scale", "임계 대역", "임계 대역폭", "critical bandwidth", "바크", "Bark", "바크 눈금", "임계 대역 번호", "critical band rate", "청각 필터", "auditory filter"]
description: "귀는 소리의 높이를 한 줄로 늘어선 칸에 나눠 담아 듣는다. 같은 칸에 들어온 두 소리는 따로 구별하기 어렵고 서로를 잘 가린다. 이 칸을 임계 대역이라 하고, 칸 하나를 1로 세는 눈금을 바크라 한다. 칸의 폭은 낮은 소리에서는 약 100 Hz로 좁고 일정하지만, 500 Hz 위…"
prev_url: "/studies/human-interface-media/frequency-masking/"
prev_title: "주파수 가림"
next_url: "/studies/human-interface-media/temporal-masking/"
next_title: "시간 가림"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "53_critical-band-bark_plot.py", "u": "/studies/human-interface-media/code/53_critical-band-bark_plot/", "r": "그림 생성"}, {"t": "53_critical-band-bark_verify.py", "u": "/studies/human-interface-media/code/53_critical-band-bark_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/critical-band-bark/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

귀는 소리의 높이를 한 줄로 늘어선 칸에 나눠 담아 듣는다. 같은 칸에 들어온 두 소리는 따로 구별하기 어렵고 서로를 잘 가린다. 이 칸을 임계 대역이라 하고, 칸 하나를 1로 세는 눈금을 바크라 한다. 칸의 폭은 낮은 소리에서는 약 100 Hz로 좁고 일정하지만, 500 Hz 위로는 높아질수록 넓어져서 높은 소리일수록 Hz 차이에 둔해진다.

</div>


## 예시로 보기

[주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/)의 그래프를 Hz 눈금으로 그리면, 높은 곳에 있는 가리는 소리일수록 가림 문턱이 옆으로 넓게 퍼진다. 주파수마다 모양이 다르면 가림을 계산할 때마다 다른 곡선을 써야 해서 번거롭다. 귀가 쓰는 눈금으로 주파수를 다시 재면 이 문제가 풀린다.

같은 100 Hz 차이라도 어디에서 생기느냐에 따라 귀에는 전혀 다르게 들린다.

- 100 Hz와 200 Hz: 아래 표에서 2번 칸 하나를 꽉 채운다. 바크로는 약 0.98 Bark 차이, 확실히 다른 높이다.
- 10,000 Hz와 10,100 Hz: 23번 칸(폭 2,500 Hz)의 25분의 1이다. 바크로는 0.05 Bark도 안 된다[^s2].

귀가 주파수를 나누는 칸을 실험으로 재어 표로 만든 것이 임계 대역 표다.

| 번호 | 아래 경계 (Hz) | 가운데 (Hz) | 위 경계 (Hz) | 폭 (Hz) |
|---|---|---|---|---|
| 1 | - | 50 | 100 | - |
| 2 | 100 | 150 | 200 | 100 |
| 3 | 200 | 250 | 300 | 100 |
| 4 | 300 | 350 | 400 | 100 |
| 5 | 400 | 450 | 510 | 110 |
| 6 | 510 | 570 | 630 | 120 |
| 7 | 630 | 700 | 770 | 140 |
| 8 | 770 | 840 | 920 | 150 |
| 9 | 920 | 1,000 | 1,080 | 160 |
| 10 | 1,080 | 1,170 | 1,270 | 190 |
| 11 | 1,270 | 1,370 | 1,480 | 210 |
| 12 | 1,480 | 1,600 | 1,720 | 240 |
| 13 | 1,720 | 1,850 | 2,000 | 280 |
| 14 | 2,000 | 2,150 | 2,320 | 320 |
| 15 | 2,320 | 2,500 | 2,700 | 380 |
| 16 | 2,700 | 2,900 | 3,150 | 450 |
| 17 | 3,150 | 3,400 | 3,700 | 550 |
| 18 | 3,700 | 4,000 | 4,400 | 700 |
| 19 | 4,400 | 4,800 | 5,300 | 900 |
| 20 | 5,300 | 5,800 | 6,400 | 1,100 |
| 21 | 6,400 | 7,000 | 7,700 | 1,300 |
| 22 | 7,700 | 8,500 | 9,500 | 1,800 |
| 23 | 9,500 | 10,500 | 12,000 | 2,500 |
| 24 | 12,000 | 13,500 | 15,500 | 3,500 |
| 25 | 15,500 | 18,775 | 22,050 | 6,550 |

표를 위에서 아래로 읽으면 두 구간이 보인다.

- 500 Hz 아래(2~5번): 폭이 100~110 Hz로 거의 같다.
- 500 Hz 위: 폭이 주파수에 거의 비례해 넓어진다. 700 Hz 위(7~24번)에서는 폭이 가운데 주파수의 약 15~26%다. 1 kHz 근처는 160 Hz, 4 kHz 근처는 700 Hz, 24번은 3,500 Hz이고 25번은 6,550 Hz로 4 kHz보다 넓다.

위 경계가 다음 칸의 아래 경계와 같아서 칸들은 빈틈없이 이어진다. 폭은 늘 위 경계에서 아래 경계를 뺀 값이다[^s2]. 마지막 25번의 위 경계 22,050 Hz는 CD 음질(1초에 44,100번 표본)로 담을 수 있는 가장 높은 주파수와 같다. 그래서 25번은 귀의 칸 하나를 다 채우지 못하고 중간에 잘린 칸이다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/53_critical-band-bark_fig1.svg" alt="그림" width="602" height="365" loading="lazy">

두 축이 모두 로그 눈금이다. 왼쪽(500 Hz 아래)에서는 점들이 100 Hz 높이에 가로로 누워 있고, 오른쪽으로 가면 점들이 비스듬한 점선(폭 = 가운데 주파수의 20%)을 따라 올라간다. 맨 오른쪽 25번 점은 선보다 조금 위로 튄다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**임계 대역**(critical band)은 동시에 울리는 여러 성분을 귀가 따로 가려 들을 수 있는 한계 폭이다. 이 폭 안에 함께 들어온 성분들은 따로 들리지 않고 서로를 강하게 가린다. **바크**(Bark)는 임계 대역 하나의 폭을 1로 하는 단위다. 가리는 소리가 어느 주파수에 있든 그 자리의 임계 대역 하나가 1 Bark다. 바크로 재면 모든 임계 대역의 폭이 거의 같다.

**기호로 쓰면.** 주파수 $$f$$(Hz)에서 0 Hz부터 쌓은 임계 대역의 수 $$z(f)$$(Bark)와, $$f$$ 자리 임계 대역의 폭 $$\Delta f_{\text{CB}}(f)$$(Hz)는 다음 근사식으로 잘 맞는다[^s1].

$$ z(f) = 13\arctan(0.00076\,f) + 3.5\arctan\!\left[\left(\frac{f}{7500}\right)^2\right] $$

$$ \Delta f_{\text{CB}}(f) = 25 + 75\left[1 + 1.4\left(\frac{f}{1000}\right)^2\right]^{0.69}\ \text{Hz} $$

</div>


첫째 식은 "0 Hz부터 $$f$$까지 귀의 칸이 몇 개 들어가는가"를 센다. 낮은 쪽에서는 $$\arctan$$ 안이 작아서 $$z \approx 13 \times 0.00076 f = 0.00988 f$$, 곧 약 100 Hz마다 1 Bark다. 높은 쪽에서는 $$\arctan$$이 천천히 커져서 같은 Hz가 늘어도 바크는 조금만 는다. 1 kHz를 넣으면 $$z = 13 \times 0.6499 + 3.5 \times 0.0178 = 8.51$$ Bark, 2 kHz는 13.10 Bark다. 둘째 식에 1 kHz를 넣으면 약 162 Hz로, 표의 9번 칸 폭 160 Hz와 맞는다[^s1].

두 식을 표와 맞대어 보면, 1~24번 칸의 위 경계에서 $$z(f)$$는 칸 번호와 0.2 Bark 안으로 같다. 폭 식은 2~24번에서 표와 10% 안으로 맞는다. 25번 칸(15,500~22,050 Hz)은 바크로 0.73 Bark뿐이다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/53_critical-band-bark_fig2.svg" alt="그림" width="644" height="355" loading="lazy">

똑같은 60 dB 가리는 소리 여섯 개(250 Hz~8 kHz)의 가림 문턱을 두 눈금으로 그렸다. 왼쪽 Hz 눈금에서는 왼쪽 끝의 250, 500 Hz 곡선이 바늘처럼 좁고, 오른쪽 8 kHz 곡선은 넓게 퍼진다. 오른쪽 바크 눈금에서는 여섯 곡선이 모두 같은 모양으로 나란히 선다. 가림은 귀의 칸으로 세면 어느 주파수에서나 비슷한 칸 수만큼 퍼지기 때문이다[^s3].

## 활용

- **심리음향 모델의 계산 눈금.** 바크 축에서는 가림 곡선 하나(퍼짐 함수)로 모든 주파수의 가림을 계산할 수 있다. 그래서 소리 압축의 [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)은 주파수를 바크로 바꿔 계산한다[^s4].
- **대역 나누기.** 부호기는 소리를 여러 주파수 대역으로 나눠, 대역마다 비트를 따로 나눠 준다([MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)). 귀의 칸과 비슷하게 나눌수록 가림을 잘 쓸 수 있다[^s4].

## 연결

- 선수: [주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/) (Hz 눈금에서 넓어 보이는 가림 곡선), [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/) (주파수마다 다른 기저막 자리)
- 이 눈금으로 계산하는 것: [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)
- 낮은 곳은 거의 균등, 높은 곳은 로그에 가까운 눈금이다: [로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"귀 안에는 25개의 칸이 정해진 자리에 고정되어 있다"</div>

틀렸다. 표가 경계를 딱 잘라 25칸으로 적어 놓아서 그렇게 보인다. 실제로는 가리는 소리가 어느 주파수에 있든 그 자리를 가운데로 하는 칸 하나가 생긴다. 바크의 정의도 "어느 가리는 주파수에서든 임계 대역 하나의 폭"이다. 표는 이어진 눈금을 편의상 25토막으로 끊은 것이다. 확인 방법: 1,000 Hz는 9번 칸(920~1,080 Hz)의 한가운데이고, 1,080 Hz도 그 자리를 가운데로 한 칸(폭 약 171 Hz)을 갖는다. 바크 식으로 1,000 Hz와 1,080 Hz는 약 0.5 Bark 떨어져 있어 칸 경계와 상관없이 서로 가린다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 바크(Bark)를 정의하고, 임계 대역의 폭이 500 Hz 아래와 위에서 각각 어떻게 되는지 쓰라.</summary>


**답:** 1 Bark는 임계 대역 하나의 폭이다(가리는 주파수가 어디든). 500 Hz 아래에서는 폭이 약 100 Hz로 거의 일정하고, 500 Hz 위에서는 주파수에 거의 비례해 넓어진다(1 kHz 근처 160 Hz, 4 kHz 근처 700 Hz).<br>
**흔한 오답:** "1 Bark = 100 Hz". 500 Hz 아래에서만 대략 맞는다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 1 kHz와 2 kHz 사이에 임계 대역이 몇 개 들어가는지 표로 세고, 바크 식 $$z(f)$$로도 구해 비교하라.</summary>


**답:** 1,000 Hz는 9번 칸(920~1,080 Hz)의 한가운데라 9번의 절반(80 Hz / 160 Hz = 0.5칸)이 남는다. 그 뒤 10, 11, 12, 13번 네 칸을 지나면 2,000 Hz(13번과 14번의 경계)다. 합쳐서 4.5칸이다. 식으로는 $$z(2000) - z(1000) = 13.10 - 8.51 = 4.59$$ Bark로 거의 같다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 가림 곡선을 Hz 눈금으로 그리면 높은 주파수일수록 넓어 보이는데, 바크 눈금으로 그리면 모양이 모두 같아지는 이유를 쓰라.</summary>


**답:** 가림은 가리는 소리에서 귀의 칸(임계 대역)으로 몇 칸 떨어졌는지에 따라 정해진다. 높은 주파수에서는 칸 하나가 Hz로 넓으므로, 같은 칸 수만큼 퍼진 가림이 Hz 눈금에서는 넓게 보인다. 바크는 칸 하나를 1로 세는 눈금이라 모든 주파수에서 칸의 폭이 같아지고, 가림 곡선도 같은 모양이 된다.

</details>

[^s1]: E. Zwicker & E. Terhardt, "Analytical expressions for critical-band rate and critical bandwidth as a function of frequency," JASA 68(5), 1980의 식이다. 표와의 차이(위 경계에서 최대 0.20 Bark, 폭은 21번에서 최대 약 9.7%), 1 kHz와 2 kHz의 값, 25번 칸 0.73 Bark는 [53_critical-band-bark_verify.py](/Hongs_Blog/studies/human-interface-media/code/53_critical-band-bark_verify/)로 계산했다.
[^s2]: 표의 칸이 빈틈없이 이어지고 폭이 위 경계에서 아래 경계를 뺀 값이라는 것은 25줄을 모두 계산해 확인했다. 표의 1~24번은 Zwicker의 임계 대역 표 값과 같고, 25번(위 경계 22,050 Hz, 가운데 18,775 Hz = 두 경계의 평균)은 44.1 kHz 표본화의 절반에서 끊은 칸으로 읽었다. 100 Hz 차이의 바크 거리(0.98, 0.05 Bark 미만)는 바크 식으로 계산했다.
[^s3]: [53_critical-band-bark_plot.py](/Hongs_Blog/studies/human-interface-media/code/53_critical-band-bark_plot/)로 그렸다.
[^s4]: 심리음향 모델이 바크 축에서 퍼짐 함수를 쓰는 것, 부호기가 대역마다 비트를 나누는 것은 Painter & Spanias, "Perceptual coding of digital audio," Proc. IEEE 88(4), 2000의 표준 내용이다. MPEG-1 레이어 I·II의 32개 대역은 폭이 모두 같아서 임계 대역과 정확히 일치하지는 않는다.
{% endraw %}
