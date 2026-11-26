---
layout: "note"
title: "등청감 곡선"
display_title: "등청감 곡선 (Equal Loudness Contours)"
kind: "concept"
kind_label: "정의"
num: "51"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Equal Loudness Contours", "Equal Loudness Curve", "등가청 곡선", "등청감곡선", "Fletcher-Munson curves", "플레처-먼슨 곡선", "폰", "phon", "크기 레벨", "loudness level", "조용할 때의 문턱", "threshold in quiet", "최소 가청 문턱", "absolute threshold of hearing", "느낌의 문턱", "threshold of feeling", "A 가중치", "A-weighting", "손", "sone"]
description: "귀는 모든 높이의 소리를 똑같이 크게 듣지 않는다. 같은 크기로 들리는 소리를 높이(주파수)마다 찾아 이은 선이 등청감 곡선이다. 사람은 3~4 kHz 근처에서 가장 예민해서 작은 소리도 잘 듣고, 아주 낮은 소리와 아주 높은 소리는 훨씬 세게 틀어야 같은 크기로 들린다. 전체 소…"
prev_url: "/studies/human-interface-media/cochlea-place-theory/"
prev_title: "달팽이관과 장소설"
next_url: "/studies/human-interface-media/frequency-masking/"
next_title: "주파수 가림"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "51_equal-loudness-contours_plot.py", "u": "/studies/human-interface-media/code/51_equal-loudness-contours_plot/", "r": "그림 생성"}, {"t": "51_equal-loudness-contours_verify.py", "u": "/studies/human-interface-media/code/51_equal-loudness-contours_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/equal-loudness-contours/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

귀는 모든 높이의 소리를 똑같이 크게 듣지 않는다. 같은 크기로 들리는 소리를 높이(주파수)마다 찾아 이은 선이 등청감 곡선이다. 사람은 3~4 kHz 근처에서 가장 예민해서 작은 소리도 잘 듣고, 아주 낮은 소리와 아주 높은 소리는 훨씬 세게 틀어야 같은 크기로 들린다. 전체 소리가 클수록 이 차이가 줄어서, 음량을 줄이면 저음이 먼저 약하게 들린다.

</div>


## 예시로 보기

소리의 세기는 음압 레벨(dB SPL)로 잰다. 그런데 소리 크기를 dB 숫자 하나로만 말하면 곤란한 일이 생긴다. 숫자가 같아도 사람에게는 전혀 다르게 들리기 때문이다.

세 순음이 모두 40 dB SPL이다.

| 점 | 주파수 | 40 dB SPL이 어떻게 들리나 |
|---|---|---|
| A | 약 30 Hz | 들리지 않는다. 이 높이에서 들리기 시작하는 크기가 40 dB보다 훨씬 높다 |
| B | 100 Hz | 겨우 들린다. 들리기 시작하는 선 바로 위다 |
| C | 1,000 Hz | 또렷하게 들린다. 이 크기를 "40 phon"이라 부른다 |

그럼 100 Hz 소리를 C와 같은 크기로 들리게 하려면 얼마나 키워야 할까. 40 phon 곡선을 따라가면 100 Hz에서 약 60 dB SPL이다. 20 dB 더, 압력으로는 10배 더 세게 틀어야 한다[^s1].

전체를 크게 하면 사정이 달라진다. 1 kHz에서 80 dB와 같은 크기(80 phon)가 되려면 100 Hz는 약 82 dB면 된다. 차이가 20 dB에서 2 dB로 줄었다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/51_equal-loudness-contours_fig1.svg" alt="그림" width="649" height="386" loading="lazy">

왼쪽 끝(20 Hz)에서는 점선들이 서로 가깝게 몰려 있고, 실선(조용할 때의 문턱)도 80 dB 넘게 올라가 있다. 가운데 1 kHz 세로 점선에서는 곡선마다 높이가 이름의 숫자와 같다. 오른쪽으로 가면 3~4 kHz의 초록 띠에서 모든 선이 가장 낮게 내려갔다가, 10 kHz를 넘으면 다시 가파르게 오른다. 위로 갈수록(큰 phon일수록) 선이 평평해진다[^s6].

## 정의

어떤 소리와 똑같은 크기로 들리는 1 kHz 순음을 찾았을 때, 그 순음의 음압 레벨 숫자를 그 소리의 **크기 레벨**이라 하고 단위를 **폰(phon)** 이라 부른다. 같은 phon 값을 갖는 (주파수, 음압 레벨) 점들을 이은 선이 그 phon의 **등청감 곡선**이다. 플레처와 먼슨이 처음 재서 Fletcher-Munson 곡선이라고도 부르고, 뒤에 로빈슨과 대드슨이 다시 쟀다.

등청감 곡선 묶음의 아래 끝은 조용한 곳에서 겨우 들리기 시작하는 크기를 이은 선이다(조용할 때의 문턱, 가청 곡선). 위 끝은 소리가 귀에 아프게 느껴지기 시작하는 크기로, 약 120 dB SPL 근처다(느낌의 문턱). 사람이 들을 수 있는 크기의 범위를 "0~120 dB"로 적는 것은 이 두 선 사이를 대략 말한 것이다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**기호로 쓰면.**
- $$f$$: 순음의 주파수(Hz). $$L_p$$: 그 순음의 음압 레벨(dB SPL, [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) 참고).
- 크기 레벨 $$L_N(f, L_p)$$(phon): 이 순음과 같은 크기로 들리는 1 kHz 순음의 음압 레벨. 정의에 따라 1 kHz에서는 $$L_N(1000, L_p) = L_p$$다.
- $$P$$ phon 등청감 곡선: $$\{(f, L_p) : L_N(f, L_p) = P\}$$. 곡선 위의 점들은 높이는 달라도 모두 같은 크기로 들린다.

</div>


조용할 때의 문턱은 주파수만 넣으면 값이 나오는 근사식으로 자주 쓴다(Terhardt 근사식)[^s2]. 세 항을 더한 꼴이고, 첫째 항은 낮은 소리에서 문턱이 치솟는 부분, 둘째 항은 3.3 kHz 근처의 움푹한 부분, 셋째 항은 높은 소리에서 다시 치솟는 부분이다.

$$
T_q(f) = 3.64\left(\frac{f}{1000}\right)^{-0.8} - 6.5\,e^{-0.6\left(\frac{f}{1000} - 3.3\right)^2} + 10^{-3}\left(\frac{f}{1000}\right)^4 \quad \text{dB SPL}
$$


$$T_q(f)$$(주파수 $$f$$에서 조용할 때 들리기 시작하는 레벨)에 몇 값을 넣어 보면 100 Hz 약 23.0 dB, 1 kHz 약 3.4 dB, 3.3 kHz 약 −5.0 dB, 15 kHz 약 51.0 dB다. 1.9~4.8 kHz에서는 0 dB보다 낮다. 0 dB SPL은 압력이 기준 압력과 같다는 뜻이고, 소리가 없다는 뜻은 아니다. 그래서 귀가 예민한 곳에서는 그보다 작은 소리도 들린다[^s2].

phon은 "같은 크기"만 말하고 "몇 배 크기"는 말하지 않는다. 몇 배인지는 손(sone)으로 센다. 40 phon을 1 sone으로 두고, 40 phon 위에서는 10 phon 오를 때마다 두 배 크게 들린다($$N = 2^{(P - 40)/10}$$ sone). 50 phon은 2 sone, 60 phon은 4 sone이다[^s4].

곡선이 이런 모양인 데에는 귀의 구조가 한몫한다. 바깥귀 길(외이도)은 길이 약 2.5 cm인 한쪽 막힌 관이다. 이런 관은 파장이 관 길이의 4배인 소리를 키운다(공명). 소리 속도 343 m/s를 넣으면 $$343 / (4 \times 0.025) \approx 3{,}430$$ Hz로, 귀가 가장 예민한 3~4 kHz와 맞는다. 낮은 소리 쪽은 가운데귀가 진동을 잘 전하지 못해서 문턱이 올라간다[^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Terhardt 문턱의 값(100 Hz 22.95, 1 kHz 3.37, 3.3 kHz −4.98 dB, 0 dB 아래 구간 1.94~4.84 kHz), A 가중치 값(100 Hz −19.14, 2.5 kHz +1.27 dB), 외이도 공명 3,430 Hz, sone 두 배 규칙 (계산으로 확인됨) — [51_equal-loudness-contours_verify.py](/Hongs_Blog/studies/human-interface-media/code/51_equal-loudness-contours_verify/)</div>

</div>


## 활용

- **음량을 줄일 때 저음 보정.** 작은 음량에서는 낮은 소리가 문턱 가까이로 내려가 먼저 약해진다. 그래서 오디오 기기에는 작은 음량에서 저음과 고음을 조금 올려 주는 보정(라우드니스 보정)이 있다[^s5].
- **소음계의 dB(A).** 사람 귀의 감도를 흉내 내려고, 잰 음압에 주파수마다 다른 무게(A 가중치)를 곱한다. 1 kHz에서 0 dB, 100 Hz에서 약 −19.1 dB, 2.5 kHz에서 약 +1.3 dB다. 100 Hz에서 약 −19 dB라는 것은 40 phon 곡선이 100 Hz에서 1 kHz보다 약 20 dB 높다는 것과 거의 거꾸로 맞는다[^s5].
- **소리 압축의 바닥.** MP3 같은 부호기는 조용할 때의 문턱 아래 소리를 저장하지 않는다. 그 위에 큰 소리가 만드는 가림이 쌓인다: [주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/), [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/).

## 연결

- 선수: [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) (dB SPL), [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/) (물리적 세기와 느끼는 크기), [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/) (20 Hz~20 kHz)
- 주파수마다 귀 안에서 반응하는 자리: [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)
- 다음: [주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/) (큰 소리가 있으면 이 문턱이 끌어올려진다)
- 그림의 가로축이 로그 눈금인 이유: [로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"dB SPL 숫자가 같으면 같은 크기로 들린다"</div>

틀렸다. dB SPL은 마이크가 재는 압력의 크기라서, 숫자가 같으면 귀에도 같게 들릴 것 같다. 실제로 느끼는 크기는 주파수에 따라 크게 달라진다. 40 dB SPL은 1 kHz에서 40 phon으로 또렷이 들리지만, 100 Hz에서는 겨우 들리고 30 Hz에서는 아예 들리지 않는다. 확인 방법: 같은 dB를 놓고 그 주파수의 조용할 때 문턱과 비교한다. Terhardt 근사식으로 1 kHz는 약 3 dB, 100 Hz는 약 23 dB가 문턱이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 폰(phon)의 정의를 쓰고, 1 kHz에서 60 phon 곡선의 높이가 몇 dB SPL인지 이유와 함께 쓰라.</summary>


**답:** 어떤 소리와 같은 크기로 들리는 1 kHz 순음의 음압 레벨(dB SPL) 숫자가 그 소리의 크기 레벨(phon)이다. 1 kHz 순음은 자기 자신과 비교하므로 60 phon 곡선은 1 kHz에서 정확히 60 dB SPL이다.<br>
**흔한 오답:** "phon은 dB와 같은 단위"라고 쓰는 것. 두 숫자가 같은 곳은 1 kHz뿐이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 50 Hz, 1 kHz, 3.5 kHz 순음이 모두 50 dB SPL이다. 크게 들리는 순서대로 놓고 이유를 쓰라.</summary>


**답:** 3.5 kHz > 1 kHz > 50 Hz. 등청감 곡선은 3~4 kHz에서 가장 낮고 낮은 주파수로 갈수록 높아진다. 같은 50 dB라도 곡선이 낮은 곳일수록 더 높은 phon 곡선 위에 놓인다. 조용할 때의 문턱(Terhardt 근사)과 견주면 3.5 kHz는 문턱 −4.9 dB보다 약 55 dB, 1 kHz는 3.4 dB보다 약 47 dB, 50 Hz는 40.0 dB보다 겨우 10 dB 위다.<br>
**흔한 오답:** "셋 다 50 dB라 크기가 같다."

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 음악을 크게 듣다가 음량을 줄이면 저음(베이스)이 유난히 작아진다. 등청감 곡선의 모양으로 이유를 쓰라.</summary>


**답:** 낮은 주파수 쪽에서는 등청감 곡선들이 서로 가깝게 몰려 있다. 1 kHz에서 40 dB 차이 나는 두 곡선(40 phon과 80 phon)이 100 Hz에서는 약 22 dB(60 dB와 82 dB)만 차이 난다. 그래서 모든 소리를 똑같이 40 dB 줄이면, 100 Hz 소리는 40 phon 곡선보다 18 dB나 아래로 떨어져 1 kHz 소리보다 크기가 훨씬 많이 줄어든다. 문턱에 가까워져 들리지 않게 되기도 한다.<br>
**이유:** 큰 소리에서는 곡선이 평평해 높낮이에 상관없이 비슷하게 들리지만, 작은 소리에서는 낮은 소리의 곡선이 가파르게 솟아 있다.

</details>

[^s1]: "20 dB = 압력 10배"는 dB SPL의 정의($$20\log_{10}$$)에서 나온다.
[^s2]: E. Terhardt(1979, Hearing Research 1)의 식으로, T. Painter & A. Spanias, "Perceptual coding of digital audio," Proc. IEEE 88(4), 2000의 심리음향 모델 설명에 실린 꼴을 썼다. 수치는 51_equal-loudness-contours_verify.py로 계산했다.
[^s3]: 외이도 공명과 가운데귀 전달로 문턱 모양을 설명하는 것은 청각 교재(예: B. C. J. Moore, *An Introduction to the Psychology of Hearing*)의 표준 내용이다. 외이도 길이 2.5 cm는 어른의 대표값이고, 공명 주파수는 한쪽 막힌 관의 1/4 파장 식으로 계산했다.
[^s4]: S. S. Stevens의 크기 척도로, 청각 교재의 표준 내용이며 대략 40 phon 이상에서 맞는다.
[^s5]: A 가중치 값은 IEC 61672-1의 해석식 $$R_A(f) = \frac{12194^2 f^4}{(f^2+20.6^2)\sqrt{(f^2+107.7^2)(f^2+737.9^2)}(f^2+12194^2)}$$, $$A(f) = 20\log_{10}R_A(f) + 2.00$$ dB로 계산했다. A 가중치는 옛 40 phon 곡선을 본떠 만들었다고 알려져 있다. 등청감 곡선의 현재 국제 표준은 ISO 226(2003년 개정)이다.
[^s6]: [51_equal-loudness-contours_plot.py](/Hongs_Blog/studies/human-interface-media/code/51_equal-loudness-contours_plot/)로 그렸다. 실선은 Terhardt 근사식이고, 점선 등청감 곡선은 측정값이 아니라 모양만 보이는 모식도다($$P$$ phon 곡선 $$= P + w(P)\,[T_q(f) - T_q(1000)]$$, $$w(P) = 1/(1 + P/80)$$). 1 kHz에서 높이가 phon 값과 같다는 것, 곡선이 모두 문턱 위에 있다는 것은 같은 코드로 확인했다.
{% endraw %}
