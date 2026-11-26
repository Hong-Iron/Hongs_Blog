---
layout: "note"
title: "소리의 크기와 높이"
display_title: "소리의 크기와 높이 (Loudness and Pitch)"
kind: "concept"
kind_label: "정의"
num: "46"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Loudness", "Pitch", "소리의 크기", "음량", "소리의 높이", "음높이", "음고", "크기 추정", "magnitude estimation", "기본 주파수 누락", "missing fundamental", "옥타브", "octave", "손", "sone"]
description: "소리가 얼마나 크게 느껴지는지는 압력이 얼마나 크게 흔들리는지와, 얼마나 높게 느껴지는지는 파형이 1초에 몇 번 되풀이되는지와 가장 가깝다. 그러나 같지는 않다. 세기를 10배로 올려도 크기는 2배쯤으로만 느껴지고, 같은 압력이라도 주파수에 따라 또렷이 들리기도 하고 아예 안 들리…"
prev_url: "/studies/human-interface-media/harmonics-complex-tone/"
prev_title: "고조파와 복합음"
next_url: "/studies/human-interface-media/range-of-hearing/"
next_title: "가청 대역"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "46_loudness-pitch_plot.py", "u": "/studies/human-interface-media/code/46_loudness-pitch_plot/", "r": "그림 생성"}, {"t": "46_loudness-pitch_verify.py", "u": "/studies/human-interface-media/code/46_loudness-pitch_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/loudness-pitch/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소리가 얼마나 크게 느껴지는지는 압력이 얼마나 크게 흔들리는지와, 얼마나 높게 느껴지는지는 파형이 1초에 몇 번 되풀이되는지와 가장 가깝다. 그러나 같지는 않다. 세기를 10배로 올려도 크기는 2배쯤으로만 느껴지고, 같은 압력이라도 주파수에 따라 또렷이 들리기도 하고 아예 안 들리기도 한다. 높이도 가장 낮은 성분을 빼 버린 소리가 여전히 같은 높이로 들릴 만큼, 성분 하나가 아니라 파형 전체가 되풀이되는 빠르기를 따른다.

</div>


## 예시로 보기

음량 손잡이를 dB 눈금에 맞춰 고르게 돌린다고 소리가 "2배, 3배"로 고르게 커지지는 않는다. 사람이 느끼는 양과 물리량이 어떻게 이어지는지 알아야 음량 조절, 소리 압축, 경고음 설계를 제대로 할 수 있다.

**크기.** 소리를 여러 세기로 들려주고 "40 dB 소리를 1이라 하면 이 소리는 얼마인가"를 숫자로 답하게 하면, 40 dB에서 1, 50 dB에서 2가 나온다[^s1]. 그 위로는 10 dB 오를 때마다 느끼는 크기가 2배가 되는 곧은 선이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/46_loudness-pitch_fig1.svg" alt="그림" width="661" height="335" loading="lazy">

두 선 모두 40 dB를 1로 놓고 출발한다. 세로축은 로그 눈금이라 한 칸이 10배다. 주황 선(세기 비)은 10 dB마다 10배씩 올라 110 dB에서 천만 배가 된다. 파란 선(느끼는 크기)은 10 dB마다 2배씩만 올라 110 dB에서 128배다. 세기를 아무리 크게 바꿔도 느끼는 크기는 훨씬 완만하게 늘어난다[^s2]. 40 dB보다 작은 쪽에서는 그래프가 이 곧은 선보다 더 빨리 떨어진다.

크기는 주파수에도 달라진다. 같은 40 dB SPL이라도 약 30 Hz 소리는 들리는 문턱보다 아래라 들리지 않고, 100 Hz 소리는 문턱을 겨우 넘어 희미하게 들리며, 1,000 Hz 소리는 또렷하게 들린다[^s3]. 주파수마다 같은 크기로 들리는 압력을 이은 선이 [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)이다.

**높이.** 200, 400, 600, 800 Hz를 함께 울리면 네 음이 따로 들리지 않는다. 하나의 소리로 들리고, 그 높이는 200 Hz 단일음과 같다[^s4]. 높이는 성분 가운데 하나가 아니라 기본 주파수를 따른다. 그런데 200 Hz 성분을 빼고 400, 600, 800 Hz만 울려도 높이는 여전히 200 Hz로 들린다[^s4].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/46_loudness-pitch_fig2.svg" alt="그림" width="699" height="354" loading="lazy">

위는 200~800 Hz 네 성분의 합, 아래는 200 Hz를 뺀 세 성분의 합이다. 오른쪽 스펙트럼에서 아래쪽에는 200 Hz 막대가 없다. 그런데 왼쪽 파형은 둘 다 점선(5 ms)마다 같은 모양이 되풀이된다. 400, 600, 800 Hz는 모두 200 Hz의 정수배라서, 셋이 함께 제자리로 돌아오는 간격이 여전히 5 ms다[^s5]. 귀는 이 되풀이 빠르기를 높이로 듣는다. 이것을 기본 주파수 누락(missing fundamental) 현상이라 한다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **소리의 크기**(loudness): 소리가 얼마나 크게 느껴지는가. 물리량 가운데 진폭, 곧 음압과 가장 가깝다. 진폭이나 음압을 청각 자극의 수준(level)이라고도 부른다.
- **소리의 높이**(pitch): 소리를 "높다", "낮다"로 말하게 하는 지각이다. 물리량 가운데 주파수와 가장 가깝다. 기본 주파수가 낮으면 낮게, 높으면 높게 들린다.

**기호로 쓰면.** 40 dB를 1로 놓은 느끼는 크기를 $$N$$, 소리 수준을 $$L$$(dB)이라 하면 그래프의 곧은 구간은

$$ N = 2^{(L - 40)/10} = \left(\frac{I}{I_{40}}\right)^{0.3} $$

다. $$I$$는 세기, $$I_{40}$$은 40 dB일 때의 세기다. 둘째 식은 $$L - 40 = 10\log_{10}(I/I_{40})$$를 넣으면 나온다. $$2^{\log_{10}x} = x^{\log_{10}2}$$이고 $$\log_{10}2 \approx 0.301$$이기 때문이다[^s2]. 고조파로 된 소리의 성분 주파수가 $$f_1, \dots, f_m$$이면, 높이는 모든 성분을 정수배로 갖는 가장 큰 주파수, 곧 기본 주파수 $$f_0$$를 따른다. 성분이 정수 Hz이면 $$f_0 = \gcd(f_1, \dots, f_m)$$이다[^s5].

</div>


이 식을 말로 읽으면 "세기를 10배로 하면 느끼는 크기는 $$10^{0.3} \approx 2$$배"다. 작은 예로 세기를 2배($$+3$$ dB)로 하면 크기는 $$2^{0.3} \approx 1.23$$배다. 음압으로 쓰면 세기가 음압의 제곱이므로 $$N \propto P^{0.6}$$이다.

높이 쪽에도 비율 규칙이 있다. 주파수가 2배가 되면 "같은 음이 한 단계 높아진" 것으로 들린다. 이 간격을 옥타브라 한다. 220 → 440 → 880 Hz는 고르게 한 옥타브씩 올라가는 것으로 들린다. 차이(220 Hz, 440 Hz)가 아니라 비(2배)가 같은 걸음으로 느껴진다[^s6].

| | 가장 가까운 물리량 | 같지 않은 점 |
|---|---|---|
| 크기 | 진폭(음압), dB | 10 dB마다 2배로 느낌. 주파수에 따라 달라짐 |
| 높이 | 기본 주파수 | 기본 성분이 없어도 같은 높이. 비(옥타브)로 느낌 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$N = 2^{(L-40)/10} = (I/I_{40})^{0.301} = (P/P_{40})^{0.602}$$, 110 dB에서 $$N = 128$$과 세기 비 $$10^7$$, 세기 2배 → 크기 1.23배, 1+2+3+4차와 2+3+4차가 모두 5 ms마다 되풀이되고 2.5 ms로는 아님, 카드 C3의 150 Hz (실험으로 확인됨) — [46_loudness-pitch_verify.py](/Hongs_Blog/studies/human-interface-media/code/46_loudness-pitch_verify/)</div>

</div>


## 활용

- **음량 조절.** 음량 손잡이와 소프트웨어 음량 막대는 dB(로그) 눈금으로 움직이게 만든다. 세기를 고르게 늘리면 처음에만 확 커지고 나중에는 거의 차이를 못 느끼기 때문이다[^s7].
- **전화.** 일반 전화선은 약 300~3,400 Hz만 보낸다. 남자 목소리의 기본 주파수(약 100~150 Hz)는 잘려 나가는데도 목소리 높이가 그대로 들린다. 기본 주파수 누락 덕분이다[^s4].
- **음높이 찾기.** 노래방 채점이나 음성 분석은 파형이 몇 ms마다 되풀이되는지 찾아 높이를 잰다. 신호를 자기 자신과 밀어 가며 비교하는 [교차 상관](/Hongs_Blog/studies/human-interface-media/cross-correlation/)(자기 상관)이 흔히 쓰는 방법이다[^s7].
- **오디오 압축.** 들리지 않거나 다른 소리에 묻히는 성분을 버리는 [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)은 크기가 주파수마다 다르다는 사실에서 출발한다.

## 연결

- 선수: [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) (소리 수준의 눈금), [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/) (기본 주파수와 되풀이 간격)
- 물리량과 지각의 짝을 처음 본 곳: [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (진폭 → 소리의 크기, 주파수 → 음의 높낮이)
- 소리 지각의 나머지 두 요소: [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/), [음색](/Hongs_Blog/studies/human-interface-media/timbre/)
- 주파수에 따라 달라지는 크기: [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"소리의 세기를 2배로 하면 2배 크게 들린다"</div>

틀렸다. 세기가 소리의 "양"이니 양을 두 배로 하면 두 배로 들릴 것 같다. 실제로 세기 2배는 $$+3$$ dB이고, 느끼는 크기는 $$2^{0.3} \approx 1.23$$배밖에 늘지 않는다. 2배 크게 들리려면 세기를 10배($$+10$$ dB)로 올려야 한다. 확인 방법: 40 dB에서 크기 1, 50 dB에서 크기 2인 그래프. 50 dB는 40 dB보다 세기가 10배다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 소리의 크기와 높이는 각각 어떤 물리량과 가장 가까운가? 각각 그 물리량과 같지 않다는 예를 하나씩 들라.</summary>


**답:** 크기는 진폭(음압)과, 높이는 기본 주파수와 가장 가깝다. 크기의 예: 같은 40 dB SPL이라도 30 Hz는 안 들리고 1,000 Hz는 또렷하다(주파수에 따라 다름). 또는 세기 10배가 크기 2배로만 느껴진다. 높이의 예: 200 Hz 성분을 뺀 400, 600, 800 Hz의 합이 여전히 200 Hz 높이로 들린다.<br>
**흔한 오답:** "크기 = dB, 높이 = 주파수"로 같다고 쓰는 것. 정의도 "가장 가깝다(most closely related)"고만 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 같은 소리를 내는 스피커 한 대(서로 상관없는 소리)를 두 대로 늘리면 느끼는 크기는 몇 배가 되는가? 열 대로 늘리면? (40 dB 이상에서 10 dB마다 크기 2배로 계산하라.)</summary>


**답:** 두 대: 세기 2배 → $$+3.01$$ dB → 크기 $$2^{3.01/10} \approx 1.23$$배. 열 대: 세기 10배 → $$+10$$ dB → 크기 2배.<br>
**이유:** 크기는 dB에 대해 $$2^{\Delta L/10}$$배로 늘고, 서로 상관없는 소리 $$n$$개는 $$+10\log_{10}n$$ dB다. 두 배로 크게 들리려면 스피커가 열 대 필요하다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 300, 450, 600 Hz를 함께 울린 소리의 높이는 몇 Hz 단일음과 같게 들리겠는가? 이 소리의 파형은 몇 ms마다 되풀이되는가?</summary>


**답:** 150 Hz. 세 성분은 모두 150 Hz의 2, 3, 4배다($$\gcd(300, 450, 600) = 150$$). 파형은 $$1/150$$ s $$\approx 6.67$$ ms마다 되풀이된다. 150 Hz 성분 자체는 없지만 귀는 되풀이 빠르기를 높이로 듣는다.<br>
**흔한 오답:** 가장 낮은 성분인 300 Hz라고 답하는 것. 300 Hz의 주기 3.33 ms만큼 밀면 450 Hz 성분이 1.5바퀴만 돌아 모양이 달라진다.

</details>

[^s1]: 그래프가 소리의 크기를 숫자로 답하게 하는 실험(크기 추정, magnitude estimation)의 결과라는 설명은 지각 교재(Goldstein, *Sensation and Perception*의 청각 장)의 설명이다. 40 dB를 1로 놓고 10 dB마다 2배가 되는 눈금은 손(sone) 눈금으로 알려져 있다. 손 눈금은 1,000 Hz 순음을 기준으로 정의한다.
[^s2]: 지수 0.3은 스티븐스의 거듭제곱 법칙에서 소리 크기에 흔히 쓰는 값과 같다. [46_loudness-pitch_plot.py](/Hongs_Blog/studies/human-interface-media/code/46_loudness-pitch_plot/)로 그렸고, 그림에 쓴 값(50 dB에서 2, 110 dB에서 128과 $$10^7$$)을 같은 코드로 확인했다. 40 dB 아래의 굽은 부분은 식으로 나타내지 않았다.
[^s3]: A의 주파수는 어림값이다.
[^s4]: 고조파 합이 하나의 소리로 기본 주파수 높이에 들린다는 것, 기본 주파수 누락 현상, 전화 대역(약 300~3,400 Hz)과 남자 목소리 기본 주파수(약 100~150 Hz)의 예는 지각·음성 교재의 표준 내용이다.
[^s5]: 진폭은 모두 1로 두었다. [46_loudness-pitch_plot.py](/Hongs_Blog/studies/human-interface-media/code/46_loudness-pitch_plot/)로 그렸고, 두 합이 5 ms 밀면 같고 2+3+4차는 2.5 ms 밀면 달라지는지를 같은 코드로 확인했다. 최대공약수로 기본 주파수를 찾는 식은 [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/)의 기본 주기 정리에서 나온다.
[^s6]: 옥타브(주파수 2배)와 음높이가 주파수의 비로 느껴진다는 것은 음향·음악 교재의 표준 내용이다.
[^s7]: 음량 조절이 로그 눈금을 쓰는 이유와 자기 상관으로 음높이를 찾는 방법은 오디오·음성 처리의 표준 내용이다.
{% endraw %}
