---
layout: "note"
title: "소리"
display_title: "소리 (Sound)"
kind: "concept"
kind_label: "정의"
num: "43"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Sound", "물리적 정의", "physical definition", "지각적 정의", "perceptual definition", "음압", "sound pressure", "단일음", "순음", "pure tone", "쓰러지는 나무 질문"]
description: "소리라는 말은 공기 같은 물질 속에서 압력이 오르내리며 퍼지는 현상을 가리키기도 하고, 그것을 귀로 들을 때 생기는 경험을 가리키기도 한다. 앞의 뜻은 마이크로 잴 수 있고 듣는 사람이 없어도 있지만, 사람에게 어떻게 들리는지는 알려 주지 않는다. 뒤의 뜻은 듣는 사람이 있어야 생…"
prev_url: "/studies/human-interface-media/xyz-vs-lab/"
prev_title: "CIE XYZ와 CIE Lab 비교"
next_url: "/studies/human-interface-media/decibel/"
next_title: "데시벨"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "43_sound_plot.py", "u": "/studies/human-interface-media/code/43_sound_plot/", "r": "그림 생성"}, {"t": "43_sound_verify.py", "u": "/studies/human-interface-media/code/43_sound_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/sound/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소리라는 말은 공기 같은 물질 속에서 압력이 오르내리며 퍼지는 현상을 가리키기도 하고, 그것을 귀로 들을 때 생기는 경험을 가리키기도 한다. 앞의 뜻은 마이크로 잴 수 있고 듣는 사람이 없어도 있지만, 사람에게 어떻게 들리는지는 알려 주지 않는다. 뒤의 뜻은 듣는 사람이 있어야 생긴다. 그래서 두 뜻은 어긋날 수 있다. 너무 높은 소리는 압력 변화가 있어도 들리지 않는다.

</div>


## 예시로 보기

숲에서 나무가 쓰러졌는데 근처에 아무도 없었다. 그 숲에 소리가 있었을까? 이 질문은 "소리"를 무엇으로 정하느냐에 따라 답이 갈린다.

- **물리적 정의**로 보면 "있었다". 소리는 공기나 다른 물질(매질)의 압력 변화다. 나무가 땅을 치는 순간 공기가 눌리고 풀리기를 되풀이하고, 숲에 마이크를 두었다면 그 압력 변화가 기록된다.
- **지각적 정의**로 보면 "없었다". 소리는 우리가 들을 때 하는 경험이다. 듣는 사람이 없으니 경험도 없다.

두 답이 부딪치는 것처럼 보이지만, 사실은 같은 낱말을 서로 다른 뜻으로 쓴 것이다. 소리를 다룰 때는 두 뜻을 모두 쓴다. 귀에 들어오는 자극을 적을 때는 물리적 정의를, 그 자극이 어떻게 들리는지 따질 때는 지각적 정의를 쓴다. 자극과 경험을 나누어 보는 방식은 [지각](/Hongs_Blog/studies/human-interface-media/perception/)에서 본 감각과 지각의 구분과 같다.

물리적인 소리는 공기나 물 같은 매질의 압력 변화를 타고 퍼지는 파동이고, 공기가 나아가는 방향으로 앞뒤로 밀리는 종파다. 종파가 무엇인지는 [종파와 횡파](/Hongs_Blog/studies/human-interface-media/longitudinal-transverse-wave/)에 있다. 매질이 없으면 밀 것도 없으므로, 진공에서는 물리적인 소리도 없다[^s1].

### 단일음의 압력 그래프

한 주파수로만 흔들리는 가장 단순한 소리를 단일음(pure tone)이라 한다. 한 자리에 압력계를 두고 시간에 따른 압력을 그리면 사인 곡선이 나온다. 가로 중심선은 소리가 없을 때의 대기압이다. 곡선이 위로 가면 공기가 눌려 압력이 높아진 순간이고, 아래로 가면 공기가 성겨져 압력이 낮아진 순간이다.

단일음은 두 값으로 정해진다.

- **진폭**: 압력이 얼마나 크게 흔들리는가.
- **주파수**: 1초에 몇 번 되풀이되는가(Hz). 한 번 되풀이되는 시간이 주기이고, 주파수는 주기의 역수다.

진폭·주파수·위상의 일반적인 뜻과 식 $$A\sin(2\pi f t + \phi)$$는 [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)에 있다. 여기서는 소리의 압력에 실제 숫자를 넣어 본다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/43_sound_fig1.svg" alt="그림" width="679" height="431" loading="lazy">

위 그림은 진폭만 다른 두 소리다. 파란 소리는 보통 대화 크기(60 dB SPL)이고 봉우리가 28.3 mPa다. 주황 소리는 봉우리가 두 배다. 두 곡선은 같은 자리에서 0을 지나므로 주파수가 같다. 아래 그림은 진폭이 같고 주파수만 다른 두 소리다. 초록 880 Hz는 파란 440 Hz보다 같은 시간에 두 배 많이 오르내리고, 한 주기가 1.14 ms로 절반이다[^s2].

세로축 단위는 mPa(1000분의 1 파스칼)다. 대기압은 약 101,325 Pa이다. 보통 대화 소리의 압력 흔들림(실효값 0.02 Pa)은 그 500만분의 1쯤이다. 대기압을 1억 원으로 치면 소리는 20원어치만 흔들린다. 귀는 이렇게 작은 압력 변화를 잡아낸다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **물리적 정의**: 소리는 공기나 그 밖의 매질에서 일어나는 압력 변화다. 매질 속을 종파로 퍼진다.
- **지각적 정의**: 소리는 우리가 들을 때 하는 경험이다.

**기호로 쓰면.** 한 자리의 압력을 $$p(t)$$(시간 $$t$$에서의 압력, Pa)라 하면 단일음은

$$ p(t) = P_0 + A\sin(2\pi f t + \phi) $$

다. $$P_0$$은 소리가 없을 때의 대기압, $$A > 0$$은 진폭(대기압에서 봉우리까지의 압력 차), $$f > 0$$은 주파수(Hz), $$\phi$$는 위상이다. 소리 자체는 대기압을 뺀 흔들림 $$p(t) - P_0$$이다.

</div>


진폭을 재는 방법은 두 가지가 섞여 쓰인다. 높은 봉우리와 낮은 봉우리 사이의 압력 차를 진폭이라 부르기도 하고, 대기압에서 봉우리까지의 압력 차를 진폭이라 부르기도 한다.

| 재는 방법 | 위 식에서 | 쓰는 곳 |
|---|---|---|
| 대기압에서 봉우리까지 | $$A$$ | 물리 교재, [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)과 [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)의 식 |
| 봉우리에서 골까지 | $$2A$$ | 청각을 다루는 일부 지각 교재의 정의 |

앞으로는 대기압에서 봉우리까지($$A$$)를 진폭이라 부른다. 어느 쪽을 쓰든 두 소리의 진폭 비는 같다. 그래서 [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)처럼 비로 재는 값은 달라지지 않는다. 진폭의 숫자 자체를 물으면 어느 쪽인지 밝혀야 한다.

두 정의는 서로 겹치지 않는 경우가 있다[^s4].

| | 귀에 들린다 | 들리지 않는다 |
|---|---|---|
| **압력 변화가 있다** | 대화, 음악 | 30 kHz 초음파(사람이 듣는 범위 밖), 아무도 없는 숲의 나무 |
| **압력 변화가 없다** | 귀울림(이명), 꿈속의 소리 | 진공 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 60 dB SPL의 실효 음압 0.02 Pa와 봉우리 0.0283 Pa, 대기압 대비 $$1.97 \times 10^{-7}$$(1억 원 중 19.7원), 사인파의 실효값 $$A/\sqrt{2}$$, 카드 C2의 진폭·주기 (실험으로 확인됨) — [43_sound_verify.py](/Hongs_Blog/studies/human-interface-media/code/43_sound_verify/)</div>

</div>


## 활용

- 마이크와 녹음 장치는 물리적 정의의 소리를 잰다. 마이크의 막이 압력 변화를 따라 떨리고, 그 떨림이 전압이 된다[^s5]. 그래서 녹음 파일에는 사람이 못 듣는 소리도 담길 수 있다.
- 사람에게 어떻게 들리는지는 지각적 정의 쪽의 질문이다. 소리를 듣는 경험은 크기, 높이, 들리는 범위, 음색으로 나누어 다룬다. 각각 [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/), [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/), [음색](/Hongs_Blog/studies/human-interface-media/timbre/)에 있다.
- 디지털 오디오 압축은 두 정의의 차이를 이용한다. 물리적으로는 있지만 들리지 않는 성분을 버려 파일을 줄인다([심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)).

## 연결

- 선수: [종파와 횡파](/Hongs_Blog/studies/human-interface-media/longitudinal-transverse-wave/) (소리가 종파인 이유), [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (진폭·주파수·위상), [지각](/Hongs_Blog/studies/human-interface-media/perception/) (자극과 경험의 구분)
- 압력의 크기를 재는 눈금: [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)
- 주파수가 여럿 섞인 소리: [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/)
- 압력 변화가 귀에서 신호가 되는 길: [귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"아무도 없는 숲의 나무 질문에는 정답이 하나다"</div>

틀렸다. 질문이 "있었다/없었다" 둘 중 하나를 고르라는 꼴이라 정답이 하나일 것 같다. 실제로는 "소리"를 압력 변화로 정하면 있었고, 듣는 경험으로 정하면 없었다. 답을 쓸 때는 어느 정의를 쓰는지부터 밝혀야 한다. 확인 방법: 숲에 녹음기를 두면 압력 변화는 파일에 남는다. 그러나 그 파일을 아무도 재생하지 않으면 듣는 경험은 끝내 생기지 않는다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> "숲에서 나무가 쓰러졌는데 아무도 듣지 않았다면 소리가 있었는가?"에 "있었다"와 "없었다"가 모두 맞는 답이 될 수 있는 이유를 두 정의로 설명하라.</summary>


**답:** 물리적 정의(소리는 공기 같은 매질의 압력 변화)로는 나무가 쓰러질 때 공기 압력이 오르내렸으므로 "있었다". 지각적 정의(소리는 들을 때의 경험)로는 듣는 사람이 없어 경험이 생기지 않았으므로 "없었다". 같은 낱말을 다른 뜻으로 써서 답이 갈린다.<br>
**흔한 오답:** 한쪽 답만 쓰고 근거를 "마이크로 잴 수 있으니까"처럼 대는 것. 지각적 정의의 답이 왜 "없었다"인지까지 써야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 어떤 자리의 압력이 $$p(t) = 101325 + 0.05\sin(2\pi \cdot 250\,t)$$ Pa이다. 소리의 주파수와 주기를 구하고, 진폭을 "대기압에서 봉우리까지"와 "봉우리에서 골까지" 두 방법으로 각각 쓰라.</summary>


**답:** 주파수 250 Hz, 주기 $$1/250$$ s = 4 ms. 진폭은 대기압에서 봉우리까지 0.05 Pa, 봉우리에서 골까지 0.1 Pa다.<br>
**흔한 오답:** 101325를 진폭으로 읽는 것. 101325 Pa는 소리가 없을 때의 대기압이고, 소리는 그 위의 흔들림 $$0.05\sin(\cdot)$$이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 물리적 정의로는 소리인데 지각적 정의로는 소리가 아닌 예와, 그 반대인 예를 하나씩 들라.</summary>


**답:** 물리적으로만 소리: 30 kHz 초음파(압력 변화는 있지만 사람이 듣는 범위 밖), 아무도 없는 숲에서 쓰러진 나무. 지각적으로만 소리: 귀울림(이명)이나 꿈속의 소리(바깥 압력 변화 없이 들리는 경험).<br>
**이유:** 두 정의는 서로 다른 것을 센다. 하나는 매질의 상태, 다른 하나는 듣는 사람의 경험이다.

</details>

[^s1]: 진공에서 소리가 퍼지지 못한다는 것은 표준 물리 교재의 내용이다.
[^s2]: 60 dB SPL의 실효 음압 $$20\,\mu\text{Pa} \times 10^{60/20} = 0.02$$ Pa, 사인파의 봉우리 $$0.02\sqrt{2} = 0.0283$$ Pa, 대기압 101,325 Pa 대비 비율은 [데시벨](/Hongs_Blog/studies/human-interface-media/decibel/)의 정의로 계산했다. 그림은 [43_sound_plot.py](/Hongs_Blog/studies/human-interface-media/code/43_sound_plot/)로 그렸고, 그림에 쓴 값(봉우리 28.3과 56.6 mPa, 440 Hz 주기 2.27 ms, 880 Hz 주기 1.14 ms)을 같은 코드로 확인했다.
[^s4]: 사람이 듣는 주파수 범위(약 20 Hz~20 kHz)는 [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)에 있다.
[^s5]: 마이크의 작동 원리(막의 떨림을 전기 신호로 바꿈)는 음향 교재의 표준 내용이다.
{% endraw %}
