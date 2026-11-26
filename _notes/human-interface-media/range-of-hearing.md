---
layout: "note"
title: "가청 대역"
display_title: "가청 대역 (Range of Hearing)"
kind: "concept"
kind_label: "정의"
num: "47"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Range of Hearing", "가청 범위", "가청 주파수", "가청 진폭", "audible range", "들리기 시작하는 문턱", "threshold of hearing", "최소 가청 한계", "audibility curve", "아프게 느끼는 문턱", "threshold of feeling", "노인성 난청", "presbycusis"]
description: "사람 귀가 듣는 소리에는 위아래 끝이 있다. 높이로는 공기가 1초에 약 20번 떨리는 낮은 소리부터 약 2만 번 떨리는 높은 소리까지 듣는다. 크기로는 겨우 들리는 소리부터, 공기 압력이 그보다 100만 배쯤 크게 흔들려 귀가 아파지는 소리까지 듣는다. 단, 겨우 들리는 크기는 높…"
prev_url: "/studies/human-interface-media/loudness-pitch/"
prev_title: "소리의 크기와 높이"
next_url: "/studies/human-interface-media/timbre/"
next_title: "음색"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "47_range-of-hearing_plot.py", "u": "/studies/human-interface-media/code/47_range-of-hearing_plot/", "r": "그림 생성"}, {"t": "47_range-of-hearing_verify.py", "u": "/studies/human-interface-media/code/47_range-of-hearing_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/range-of-hearing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사람 귀가 듣는 소리에는 위아래 끝이 있다. 높이로는 공기가 1초에 약 20번 떨리는 낮은 소리부터 약 2만 번 떨리는 높은 소리까지 듣는다. 크기로는 겨우 들리는 소리부터, 공기 압력이 그보다 100만 배쯤 크게 흔들려 귀가 아파지는 소리까지 듣는다. 단, 겨우 들리는 크기는 높이마다 달라서, 같은 세기라도 아주 낮은 소리는 안 들리고 1초에 3천~4천 번 떨리는 소리는 가장 작은 크기로도 들린다.

</div>


## 예시로 보기

녹음기나 스피커를 만들 때는 어디까지 담을지 먼저 정해야 한다. 사람이 못 듣는 떨림까지 담으면 저장 공간과 전력만 버린다. 그래서 귀가 듣는 범위를 먼저 잰다.

크기가 똑같이 40 dB SPL([데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)로 잰 음압)인 순음 세 개를 조용한 방에서 들려준다. 주파수는 30 Hz, 100 Hz, 1 kHz다. 결과는 아래 그림의 세 점이 보여 준다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/47_range-of-hearing_fig1.svg" alt="그림" width="616" height="365" loading="lazy">

가로축은 주파수, 세로축은 음압 레벨이다. 가로축은 10배마다 같은 간격인 로그 눈금이다. 파란 곡선이 들리기 시작하는 크기다. 왼쪽 끝 20 Hz에서는 약 80 dB로 높다. 오른쪽으로 갈수록 내려가 3~4 kHz에서 0 dB보다 조금 아래(약 −5 dB)까지 떨어진다. 10 kHz를 넘으면 다시 가파르게 오른다. 맨 위 주황 점선은 귀가 아파지는 크기(약 120 dB)다. 두 선 사이의 색칠한 곳이 들리는 영역이다. 같은 40 dB라도 30 Hz 점은 파란 곡선 아래라서 들리지 않는다. 100 Hz와 1 kHz 점은 곡선 위라서 들린다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

사람이 소리로 느끼는 범위(가청 대역)는 두 가지 경계로 정한다.
- **주파수 범위**: 약 20 Hz부터 20 kHz까지.
- **크기 범위**: 아래 끝은 소리가 겨우 들리기 시작하는 크기(threshold of hearing), 위 끝은 소리가 아픔으로 느껴지기 시작하는 크기(threshold of feeling)다. 대략 0 dB부터 120 dB까지다.

아래 끝은 주파수마다 다르다. 위 끝은 주파수에 따라 조금만 오르내린다.

**기호로 쓰면.** 주파수 $$f$$(1초에 떨리는 횟수, Hz)와 음압 레벨 $$L$$(dB SPL)인 순음이 들리려면

$$ 20\ \text{Hz} \lesssim f \lesssim 20\ \text{kHz}, \qquad T_q(f) \le L \lesssim 120\ \text{dB SPL} $$

이어야 한다. $$\lesssim$$는 "대략 그 아래"라고 읽는다. 경계가 사람마다 조금씩 다르기 때문이다.
- $$L = 20\log_{10}(p/p_0)$$: 소리의 음압 $$p$$가 기준 음압 $$p_0 = 20\ \mu\text{Pa}$$의 몇 배인지를 dB로 쓴 값.
- $$T_q(f)$$: 주파수 $$f$$에서 들리기 시작하는 크기(dB SPL). 위 그림의 파란 곡선이다.

</div>


0 dB와 120 dB 사이가 얼마나 넓은지 숫자로 바꿔 보면 이렇다[^s2]. 음압 레벨은 음압 비에 로그를 씌워 20을 곱한 값이다. 그래서 120 dB는 음압으로 $$10^{120/20} = 10^6$$배, 100만 배다. 세기는 음압의 제곱에 비례하므로 $$10^{12}$$배, 1조 배다. 1 mm를 1 km로 늘린 비율이 100만 배다. 그래도 120 dB 소리의 음압은 $$20\ \mu\text{Pa} \times 10^6 = 20$$ Pa이라, 대기압 101,325 Pa의 약 0.02%만 흔든다.

들리기 시작하는 크기는 아래 식으로 어림한다(Terhardt 근사)[^s1].

$$ T_q(f) \approx 3.64\left(\frac{f}{1000}\right)^{-0.8} - 6.5\,e^{-0.6\left(\frac{f}{1000} - 3.3\right)^2} + 10^{-3}\left(\frac{f}{1000}\right)^4 \ \text{dB SPL} $$


세 항을 하나씩 읽으면 이렇다. 첫 항은 주파수가 낮을수록 커져서 낮은 쪽 문턱을 끌어올린다. 둘째 항은 3.3 kHz 근처에서만 크게 빼서 그곳에 움푹한 골을 판다. 셋째 항은 주파수의 네제곱으로 커져서 높은 쪽 문턱을 가파르게 올린다. 숫자를 넣으면 30 Hz에서 약 60 dB, 100 Hz에서 약 23 dB, 1 kHz에서 약 3.4 dB, 3.3 kHz에서 약 −5 dB다.

3~4 kHz에서 가장 예민한 데에는 바깥귀의 관(외이도)이 그 주파수에서 울려 소리를 키우는 몫이 크다([귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/))[^s3]. 주파수마다 같은 크기로 느끼는 선은 [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)이 다룬다. 파란 곡선은 그 가운데 가장 아래 선이다.

범위 밖의 떨림도 있다. 20 Hz보다 느린 떨림(초저주파)과 20 kHz보다 빠른 떨림(초음파)도 공기의 압력 변화이므로 물리 현상으로는 소리다([소리](/Hongs_Blog/studies/human-interface-media/sound/)). 귀가 그 떨림을 소리 감각으로 바꾸지 못할 뿐이다[^s4].

높은 쪽 끝은 나이가 들수록 내려온다(노인성 난청). 20 kHz는 어리고 귀가 건강한 사람 기준이다[^s4]. 높은 소리를 맡는 감각 세포는 달팽이관의 입구 쪽에 있다([달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 120 dB = 음압 $$10^6$$배·세기 $$10^{12}$$배, 120 dB SPL = 20 Pa(대기압의 0.0197%), 문턱 근사식 30 Hz 60.2·100 Hz 23.0·1 kHz 3.37 dB와 최저점 약 3.3 kHz −4.98 dB, 40 dB의 세 점이 문턱 위아래 어디인지, CD·전화의 표본화율 계산 (계산으로 확인됨) — [47_range-of-hearing_verify.py](/Hongs_Blog/studies/human-interface-media/code/47_range-of-hearing_verify/)</div>

</div>


## 활용

- **디지털 오디오의 표본화율.** 소리를 숫자로 담으려면 1초에 몇 번 잴지 정해야 한다. [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)에 따르면 담을 가장 높은 주파수의 2배보다 많이 재야 한다. 20 kHz까지 담으려면 1초에 40,000번보다 많이 재야 한다. 음악 CD는 44,100번을 재서 22,050 Hz까지 담는다. 20 kHz와 22.05 kHz 사이의 2,050 Hz는 더 높은 성분을 걸러 내는 필터가 서서히 꺼지는 여유다. 이 여유가 없으면 걸러지지 않은 높은 성분이 낮은 소리로 둔갑한다([에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/))[^s5].
- **전화 음성.** 전화는 1초에 8,000번 재서 4,000 Hz까지만 담는다. 말을 알아듣는 데 필요한 300~3,400 Hz는 들어가지만 그 위는 잘린다. 전화 목소리가 실제 목소리와 다르게 들리는 이유다([PCM](/Hongs_Blog/studies/computer-communication/pcm/))[^s5].
- **청력 검사.** 청력 검사는 주파수마다 들리기 시작하는 크기를 재서, 귀가 건강한 사람의 문턱보다 몇 dB 높은지 적는다. 이 단위가 dB HL이다([데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)).
- **소리 압축.** 문턱 아래에 있는 성분은 지워도 아무도 못 알아챈다. MP3 같은 압축 방식이 이 문턱을 이용한다([심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/), [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)).

## 연결

- 선수: [소리](/Hongs_Blog/studies/human-interface-media/sound/) (주파수, 압력 변화), [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) (dB SPL)
- 경계 안의 모양: [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)
- 경계가 생기는 몸의 구조: [귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/), [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)
- 디지털로 담기: [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/), [에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)
- 눈과 비교: 눈이 보는 빛은 400~700 nm다([파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)). 주파수로 바꾸면 가장 높은 것이 가장 낮은 것의 1.75배라 한 옥타브(2배)가 안 된다. 귀는 20 Hz에서 20 kHz까지 1,000배, 약 10옥타브를 듣는다[^s2].

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"0 dB는 소리가 전혀 없다는 뜻이다"</div>

틀렸다. 숫자 0이라서 "없음"으로 읽기 쉽다. 실제로 0 dB SPL은 음압이 기준값 $$20\ \mu\text{Pa}$$와 같다는 뜻이다. dB는 기준과의 비를 로그로 쓴 값이라, 비가 1이면 $$20\log_{10}1 = 0$$이 될 뿐이다. 기준값은 1 kHz 근처에서 겨우 들리는 크기에 맞춰 정했다. 그래서 3~4 kHz처럼 귀가 더 예민한 곳에서는 0 dB보다 작은 −5 dB 소리도 들린다. 확인 방법: −5 dB는 음압이 기준의 $$10^{-5/20} \approx 0.56$$배라는 뜻이다. 음압이 0이면 dB는 $$-\infty$$가 된다[^s6].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 가청 대역을 정하는 두 경계를 이름과 대략의 값까지 쓰라.</summary>


**답:** 주파수 범위는 약 20 Hz~20 kHz다. 크기 범위는 아래 끝이 들리기 시작하는 크기(threshold of hearing), 위 끝이 아프게 느끼기 시작하는 크기(threshold of feeling)이고, 대략 0~120 dB다.<br>
**흔한 오답:** 크기 범위를 주파수와 상관없이 고정된 값으로 쓰는 것. 아래 끝은 주파수마다 크게 달라서, 30 Hz에서는 약 60 dB가 되어야 들린다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 음악 CD는 소리를 1초에 44,100번 잰다. 40,000번보다 조금 많게 정한 이유를 가청 대역과 표본화 정리로 설명하라.</summary>


**답:** 사람은 약 20 kHz까지 듣는다. 표본화 정리에 따르면 가장 높은 주파수의 2배보다 많이 재야 원래 소리를 되살릴 수 있으므로 1초에 40,000번보다 많이 재야 한다. 44,100번이면 22,050 Hz까지 담는다. 20 kHz와 22.05 kHz 사이의 2,050 Hz는 더 높은 성분을 걸러 내는 필터가 서서히 꺼질 여유다.<br>
**흔한 오답:** "40,000번이면 딱 맞다." 정확히 2배에서는 경계라 부족하고, 실제 필터는 20 kHz에서 칼같이 자르지 못해 여유 구간이 필요하다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 0 dB SPL 소리와 120 dB SPL 소리는 음압으로 몇 배, 세기로 몇 배 차이 나는가? 60 dB SPL 소리의 음압은 0 dB SPL의 몇 배인가?</summary>


**답:** 음압 $$10^{120/20} = 10^6$$배(100만 배), 세기 $$10^{120/10} = 10^{12}$$배(1조 배). 60 dB SPL은 음압이 $$10^{60/20} = 1{,}000$$배다(세기로는 $$10^6$$배).<br>
**흔한 오답:** 음압에도 10으로 나눠 $$10^{12}$$배라고 쓰는 것. 음압 레벨은 $$20\log_{10}$$, 세기 레벨은 $$10\log_{10}$$이다.

</details>

[^s1]: 들리기 시작하는 크기의 곡선은 Terhardt(1979)의 근사식으로 그렸다. 이 식은 소리 압축의 청각 모델에서 널리 쓰는 어림식이다. 15 kHz 위(점선)는 근사식이 실제보다 가파를 수 있고, 그 구간의 문턱은 사람마다 차이가 크다. 아프게 느끼는 크기를 120 dB 수평선으로 그린 것도 어림이다. 그림은 [47_range-of-hearing_plot.py](/Hongs_Blog/studies/human-interface-media/code/47_range-of-hearing_plot/)로 그렸고, 세 점의 위아래 관계와 최저점 위치를 같은 코드에서 확인했다.
[^s2]: 120 dB의 비율, 기준 음압 20 μPa, 대기압과의 비교, 가시광과의 옥타브 비교는 표준 음향 정의로 계산한 값이다.
[^s3]: 외이도의 울림이 3~4 kHz 근처를 키운다는 것은 청각 교재의 표준 내용이다(예: Goldstein, *Sensation and Perception*의 청각 장).
[^s4]: 초저주파와 초음파라는 이름, 나이가 들수록 높은 주파수의 문턱이 먼저 오른다는 것(노인성 난청)은 청각학의 표준 내용이다. 나이별 청력 문턱의 통계는 국제 표준 ISO 7029가 정리한다.
[^s5]: CD의 1초 44,100번(IEC 60908), 전화의 1초 8,000번(ITU-T G.711), 전화 음성 대역 300~3,400 Hz는 표준 규격의 값이다.
[^s6]: 0 dB SPL의 뜻과 음수 dB는 데시벨의 정의에서 바로 나온다.
{% endraw %}
