---
layout: "note"
title: "음색"
display_title: "음색 (Timbre)"
kind: "concept"
kind_label: "정의"
num: "48"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Timbre", "음색", "tone color", "고조파 구조", "harmonic structure", "정상 상태", "steady state", "어택", "attack", "디케이", "decay", "포락선", "envelope", "ADSR", "옴의 음향 법칙", "Ohm's acoustic law"]
description: "기타와 색소폰이 같은 음을 같은 크기, 같은 길이로 내도 우리는 둘을 바로 구별한다. 이 차이를 음색이라 한다. 음색을 정하는 것은 기본 높이의 2배, 3배, … 로 떨리는 성분들의 세기 비율과, 소리가 처음에 솟고 끝에 사라지는 시간 모양이다. 그래서 음색은 높이나 크기처럼 숫자…"
prev_url: "/studies/human-interface-media/range-of-hearing/"
prev_title: "가청 대역"
next_url: "/studies/human-interface-media/ear-anatomy/"
next_title: "귀의 구조"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "48_timbre_plot.py", "u": "/studies/human-interface-media/code/48_timbre_plot/", "r": "그림 생성"}, {"t": "48_timbre_verify.py", "u": "/studies/human-interface-media/code/48_timbre_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/timbre/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

기타와 색소폰이 같은 음을 같은 크기, 같은 길이로 내도 우리는 둘을 바로 구별한다. 이 차이를 음색이라 한다. 음색을 정하는 것은 기본 높이의 2배, 3배, … 로 떨리는 성분들의 세기 비율과, 소리가 처음에 솟고 끝에 사라지는 시간 모양이다. 그래서 음색은 높이나 크기처럼 숫자 하나로 적을 수 없다.

</div>


## 예시로 보기

소리를 높이(주파수)와 크기(진폭)로만 적으면, 기타와 색소폰이 같은 음을 같은 크기로 낸 소리는 같은 소리가 된다. 귀는 둘을 분명히 구별하므로 세 번째 성질이 필요하다.

기타, 바순, 알토 색소폰이 같은 음을 낼 때의 스펙트럼(주파수마다 성분의 세기를 막대로 세운 그림, [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/))을 보면 이렇다.

| 악기 | 막대가 서는 자리 | 가장 높은 막대 | 눈에 띄는 점 |
|---|---|---|---|
| 기타 | 약 200, 400, 600, 800 Hz, … | 세 번째(약 600 Hz) | 높은 쪽까지 작은 막대가 많이 이어진다 |
| 바순 | 약 200, 400, 600, 800 Hz, … | 두 번째(약 400 Hz) | 첫 막대(약 200 Hz)가 아주 낮다 |
| 알토 색소폰 | 약 200, 400, 600, 800 Hz, … | 처음 세 막대가 비슷하다 | 1 kHz 위는 빠르게 작아진다 |

세 악기 모두 막대가 서는 자리가 같다. 기본 주파수가 같으니 높이가 같게 들린다. 막대의 높이 비율이 다르다. 그래서 음색이 다르게 들린다. 바순은 200 Hz 막대가 아주 낮은데도 200 Hz 높이로 들린다. 높이는 막대가 서는 간격(기본 주파수)이 정하기 때문이다([소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/)).

같은 일을 직접 만든 두 소리로 보면 아래 그림과 같다. 두 소리 모두 기본 주파수가 200 Hz이고, 평균 전력(세기)을 같게 맞췄다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/48_timbre_fig1.svg" alt="그림" width="717" height="429" loading="lazy">

왼쪽은 시간에 따른 압력 변화(파형), 오른쪽은 스펙트럼이다. 왼쪽 두 파형은 모두 5 ms마다 같은 모양을 되풀이한다. 그래서 높이는 같다. 소리 A는 고조파가 열 개라 파형에 잔물결이 많고 톱니처럼 꺾인다. 소리 B는 기본음이 대부분이라 사인파에 가깝게 둥글다. 오른쪽 스펙트럼에서 A의 막대는 200 Hz부터 2,000 Hz까지 열 개가 $$1/k$$ 비율로 줄어든다. B의 막대는 200, 400, 600 Hz 세 개뿐이고 첫 막대가 거의 전부다. 높은 고조파가 많은 A는 밝고 날카롭게, B는 둥글고 부드럽게 들린다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**음색**(timbre)은 크기, 높이, 길이가 같은 두 소리를 서로 다르게 들리게 하는 성질이다.

음색은 두 가지에 달려 있다.
- 소리가 고르게 이어지는 동안(정상 상태)의 고조파 구조: 고조파마다 진폭이 얼마인지.
- 고조파들이 처음에 솟는 부분(attack)과 끝에 사라지는 부분(decay)의 시간 모양.

**기호로 쓰면.** 높이가 일정한 악기 소리를

$$ x(t) = \sum_{k=1}^{K} a_k(t)\,\sin(2\pi k f_0 t + \phi_k) $$

로 쓴다. $$f_0$$은 기본 주파수(Hz), $$k$$는 고조파 번호($$k = 1$$이 기본음), $$a_k(t)$$는 $$k$$번째 고조파의 진폭으로 시간에 따라 천천히 바뀐다. $$\phi_k$$는 $$k$$번째 고조파의 출발 위치(위상)다.

</div>


물리량과 들리는 성질을 짝지으면 이렇다.

| 소리의 물리량 | 들리는 성질 |
|---|---|
| 되풀이 간격 $$T_0 = 1/f_0$$ | 높이 |
| 전체 세기 (진폭의 제곱의 합) | 크기 |
| 소리가 이어지는 시간 | 길이 |
| 정상 상태의 진폭 비율 $$a_1 : a_2 : a_3 : \cdots$$ | 음색 (스펙트럼 모양) |
| 시간에 따른 $$a_k(t)$$의 모양 | 음색 (솟고 사라지는 모양) |
| 위상 $$\phi_k$$ | 고르게 이어지는 소리에서는 거의 느끼지 못한다 |

음색만 "무엇이 아닌가"로 정의한 데에는 이유가 있다. 높이와 크기는 각각 물리량 하나($$f_0$$, 세기)와 짝이 맞는다. 음색은 남은 진폭 비율 전체와 시간 모양에 걸쳐 있어서, 숫자 하나로 적을 수 없다. 그래서 크기, 높이, 길이를 같게 맞춘 뒤 남는 차이로 정의한다.

### 시간에 따른 모양

같은 고조파 비율이라도 소리가 솟고 사라지는 모양이 다르면 다른 악기처럼 들린다. 아래 그림은 이 차이를 모형으로 그린 것이다[^s5].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/48_timbre_fig2.svg" alt="그림" width="717" height="314" loading="lazy">

왼쪽 그림의 색칠한 띠는 진폭이 흔들리는 테두리(포락선)다. 파란 띠(튕긴 소리)는 0.005초 만에 가장 크게 솟은 뒤 곧바로 줄어든다. 주황 띠(천천히 커지는 소리)는 0.12초에 걸쳐 솟고, 0.6초까지 같은 크기로 이어지다가 사라진다. 오른쪽 그림은 튕긴 소리의 고조파마다 크기가 처음보다 몇 dB 줄었는지를 보여 준다. 선이 가파를수록 빨리 사라진다. 0.3초가 지나면 기본음(1번째)은 처음의 약 61%(−4.3 dB)로 남지만, 8번째 고조파는 약 1.8%(−34.7 dB)로 거의 사라진다[^s5].

그래서 튕긴 소리는 처음에는 높은 고조파가 많아 밝다가, 시간이 지나면 기본음만 남아 둥글어진다. 고조파 비율 자체가 시간에 따라 바뀐다. 이 바뀜을 한 장에 담는 그림이 [스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/)의 스펙트로그램이다.

솟는 부분은 특히 중요하다. 악기 소리에서 솟는 부분을 잘라 내고 들려주면, 어떤 악기인지 맞히기가 훨씬 어려워진다[^s6].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위상만 바꾼 두 소리의 진폭 스펙트럼이 같음(DFT), 봉우리 높이 1.71과 2.93, 그림 1의 평균 전력 맞춤 배율 0.803과 0.953, 튕긴 소리 모형의 0.3초 뒤 −4.3 dB와 −34.7 dB, 카드 C2의 되풀이 간격 (계산으로 확인됨) — [48_timbre_verify.py](/Hongs_Blog/studies/human-interface-media/code/48_timbre_verify/)</div>

</div>


## 활용

- **악기 소리 만들기.** 신시사이저는 사인파 여러 개를 진폭 비율을 정해 더하거나(가산 합성), 고조파가 많은 파형에서 일부를 걸러 내 스펙트럼 모양을 만든다. 시간 모양은 솟는 시간(attack), 줄어드는 시간(decay), 이어지는 크기(sustain), 손을 뗀 뒤 사라지는 시간(release) 네 값으로 정한다. 이 네 값을 머리글자로 ADSR이라 부른다[^s7].
- **말소리.** 같은 높이로 "아"와 "이"를 말해도 다르게 들린다. 입안의 모양이 바뀌면서 고조파 가운데 세게 남는 주파수 구간이 달라지기 때문이다. 모음을 가르는 것도 음색이다[^s7].
- **푸리에 급수의 계수와 음색.** 악기 소리를 푸리에 급수 $$\sum_k c_k e^{j2\pi k f_0 t}$$로 나누면, 계수의 크기 $$\vert c_k\vert $$가 $$k$$번째 고조파의 세기를 알려 준다. 실수 신호에서 $$k$$번째 고조파의 진폭은 $$2\vert c_k\vert $$이고, 위 식의 $$a_k$$와 같다. 이 진폭들의 비율이 음색이다.

## 연결

- 선수: [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/) (기본음과 고조파), [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/) (나머지 두 성질)
- 시간에 따라 바뀌는 스펙트럼: [스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/)
- 계수를 구하는 수학: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/)
- 귀가 고조파를 나눠 받는 장치: [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)
- 색과 비교: 눈은 빛의 스펙트럼을 추상체 세 종류의 반응, 곧 숫자 셋으로 줄인다([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)). 그래서 스펙트럼이 달라도 같은 색으로 보이는 일이 흔하다. 귀는 달팽이관의 수많은 자리로 스펙트럼을 나눠 받으므로, 고조파 비율이 다르면 대개 음색도 다르게 들린다[^s8].

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"파형 모양이 다르면 음색도 다르다"</div>

틀렸다. 음색이 소리의 "모양"이라는 말 때문에 파형을 떠올리기 쉽다. 하지만 고조파의 진폭은 그대로 두고 위상만 바꿔도 파형은 크게 달라진다. 예를 들어 진폭이 $$1, \tfrac12, \tfrac13, \dots, \tfrac{1}{10}$$인 고조파 열 개를 모두 사인으로 더하면 봉우리 높이가 약 1.71이고, 모두 코사인으로 더하면 약 2.93이다. 두 파형은 눈으로 보기에 전혀 다르지만, 고조파마다의 진폭(진폭 스펙트럼)은 똑같다. 고르게 이어지는 소리에서 귀는 주로 진폭 비율을 듣고 위상 차이는 거의 느끼지 못한다. 그래서 두 소리는 거의 같은 음색으로 들린다. 위상의 영향이 완전히 0은 아니지만, 진폭 비율을 바꿀 때보다 훨씬 작다[^s9]. 확인 방법: 두 파형의 DFT를 구해 크기를 비교한다(검증 코드).

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 음색의 정의를 쓰고, 음색을 정하는 소리의 두 가지 특징을 쓰라.</summary>


**답:** 음색은 크기, 높이, 길이가 같은 두 소리를 다르게 들리게 하는 성질이다. (1) 고르게 이어지는 동안의 고조파 구조, 곧 고조파마다의 진폭 비율. (2) 고조파들이 솟고(attack) 사라지는(decay) 시간 모양.<br>
**흔한 오답:** 요소를 "주파수"라고만 쓰는 것. 주파수(기본 주파수)는 높이를 정한다. 음색은 같은 주파수 자리에 선 막대들의 높이 비율과 시간 모양이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 소리 P는 300, 600, 900 Hz 성분을 진폭 1, 0.5, 0.2로, 소리 Q는 같은 세 주파수를 진폭 0.4, 1, 0.6으로 섞었다. 두 소리의 평균 전력은 같게 맞췄다. 높이, 크기, 음색 가운데 무엇이 같고 무엇이 다르게 들리는가? Q에서 가장 센 성분이 600 Hz이니 Q가 한 옥타브 높게 들린다는 주장은 맞는가?</summary>


**답:** 높이는 같다. 두 소리 모두 300 Hz의 1, 2, 3배 성분이라 1/300 s(약 3.33 ms)마다 되풀이되고, 기본 주파수가 300 Hz다. 크기는 세기를 맞췄으므로 비슷하다. 음색은 다르다. 막대의 자리는 같고 높이 비율이 다르기 때문이다. "Q가 한 옥타브 높다"는 틀렸다. 높이는 가장 센 성분이 아니라 막대가 서는 간격(기본 주파수)이 정한다. 바순 소리에서 기본음 막대가 아주 낮아도 기본 주파수의 높이로 들리는 것과 같다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 기타 소리 녹음에서 처음 0.05초를 잘라 내고 나머지만 들려주면 어떤 악기인지 맞히기가 어려워진다. 음색을 정하는 두 요소로 그 이유를 설명하라.</summary>


**답:** 음색은 정상 상태의 고조파 비율만이 아니라 소리가 솟는 시간 모양에도 달려 있다. 튕긴 줄은 아주 짧은 시간에 솟고 그 순간 높은 고조파가 가장 많다. 앞부분을 자르면 이 솟는 모양과 처음의 밝은 스펙트럼이 사라진다. 남은 부분은 고조파 비율만으로 판단해야 하고, 그 비율은 다른 악기와 비슷할 수 있어서 구별 단서가 줄어든다.

</details>

[^s2]: 소리 A는 진폭 $$1/k$$($$k = 1, \dots, 10$$), 소리 B는 진폭 1, 0.3, 0.1이고, 둘 다 평균 전력을 단위 사인파와 같은 1/2로 맞췄다. 평균 전력이 같아도 사람이 느끼는 크기는 주파수 구성에 따라 조금 다를 수 있다([등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)). 그림은 [48_timbre_plot.py](/Hongs_Blog/studies/human-interface-media/code/48_timbre_plot/)로 그렸다.
[^s3]: 높은 고조파의 에너지가 많을수록 밝게 들린다는 것은 음색 연구의 표준 결과다(스펙트럼 무게중심과 밝기의 관계, 예: Grey 1977, *Journal of the Acoustical Society of America* 61, 1270–1277).
[^s5]: 튕긴 소리는 0.005초에 솟고 시간 상수 0.25초로 줄어들며, $$k$$번째 고조파는 시간 상수 $$0.6/k$$초로 줄어든다고 가정했다. 천천히 커지는 소리는 0.12초에 걸쳐 솟는다고 가정했다. 튕긴 줄에서 높은 고조파가 먼저 사라진다는 경향은 악기 음향학의 표준 내용이다(예: Fletcher & Rossing, *The Physics of Musical Instruments*). 실제 시간 상수는 악기마다 다르다.
[^s6]: 솟는 부분을 잘라 내면 악기 식별이 어려워진다는 결과는 Saldanha & Corso (1964, *Journal of the Acoustical Society of America* 36, 2021–2026)의 실험에서 온 것이다.
[^s7]: 가산 합성과 ADSR 포락선은 전자 악기의 표준 용어다. 모음이 고조파 가운데 세게 남는 구간(포먼트)의 차이로 갈린다는 것은 음성학의 표준 내용이다.
[^s8]: 색과 음색의 비교는 이 문서가 덧붙인 해석이다. 근거는 [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 "반응 세 값으로 줄인다"와 [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)의 "주파수마다 다른 자리가 흔들린다"다.
[^s9]: 고르게 이어지는 소리에서 귀가 위상에 둔하다는 것은 옴의 음향 법칙(Ohm's acoustic law)과 헬름홀츠의 관찰로 알려진 내용이다. 위상이 음색에 주는 영향이 진폭 비율의 영향보다 작다는 측정은 Plomp & Steeneken (1969, *Journal of the Acoustical Society of America* 46, 409–421)에 있다. 봉우리 높이 1.71과 2.93은 [48_timbre_verify.py](/Hongs_Blog/studies/human-interface-media/code/48_timbre_verify/)로 계산했다.
{% endraw %}
