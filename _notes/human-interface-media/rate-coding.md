---
layout: "note"
title: "발화율 부호화"
display_title: "발화율 부호화 (Representation of Strength)"
kind: "concept"
kind_label: "모델"
num: "05"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
updated: "2026-10-06"
status: "verified"
aliases: ["Rate Coding", "Representation of Strength", "자극 세기의 표현", "발화율", "firing rate", "불응기", "refractory period", "전부 아니면 전무", "all-or-none", "자발 발화"]
description: "공연장의 박수와 같다. 더 열광할수록 박수 한 번의 소리가 커지는 게 아니라 박수가 더 빨라진다. 뉴런도 스파이크 하나의 크기는 늘 같고, 자극이 셀수록 스파이크를 더 자주 낸다. 다만 한 번 발화하면 잠깐 쉬어야 해서(불응기) 빨라지는 데 한계가 있고, 아주 센 자극끼리는 구별하…"
prev_url: "/studies/human-interface-media/neuron-signaling/"
prev_title: "뉴런과 신호 전달"
next_url: "/studies/human-interface-media/excitatory-inhibitory/"
next_title: "흥분성과 억제성 시냅스"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/rate-coding/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

공연장의 박수와 같다. 더 열광할수록 박수 한 번의 소리가 커지는 게 아니라 박수가 더 빨라진다. 뉴런도 스파이크 하나의 크기는 늘 같고, 자극이 셀수록 스파이크를 더 자주 낸다. 다만 한 번 발화하면 잠깐 쉬어야 해서(불응기) 빨라지는 데 한계가 있고, 아주 센 자극끼리는 구별하기 어려워진다.

</div>


## 예시로 보기

피부의 압력 수용기에 세기가 다른 압력 세 가지를 준다. (a)가 가장 약하고 (c)가 가장 세다[^1].

```
       압력 켬                              압력 끔
         ↓                                   ↓
(a) |  |  | |  |  |  | | | | | |  |  | |  |  |    |  |
(b) |  |  ||| | | | |||| | | ||| ||| |  |       |
(c) |  |  |||||||||||||||||||||||||||||||||    |   |
```

세 경우 모두 스파이크의 높이는 같다. 달라지는 것은 간격이다. 압력을 주기 전과 뗀 뒤에도 드문드문 스파이크가 있다. 자극이 없어도 나오는 이 발화를 자발 발화(spontaneous activity)라 한다[^s1].

스파이크가 얼마나 촘촘한지를 "1초에 몇 번"으로 센 값이 발화율 $$r$$이다. 스파이크의 모양은 따지지 않는다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**발화율** $$r$$은 1초에 스파이크가 몇 번 나오는지(회/초)다. 뉴런은 자극이 센지 약한지를 스파이크의 크기가 아니라 발화율로 나타낸다. 스파이크는 나오거나 안 나오거나 둘 중 하나이고, 크기는 늘 같기 때문이다(전부 아니면 전무)[^s2].<br>
**불응기** $$t_{\text{ref}}$$는 한 번 발화한 뒤 다시 발화하지 못하는 시간이다. 슬라이드 값은 1 ms, 최대 발화율은 초당 500~800회다[^1]. 불응기가 1 ms면 이론상 1초에 $$1 / t_{\text{ref}} = 1{,}000$$번이 한계이고, 실제 최대는 그보다 조금 낮다[^s6].

</div>


스파이크 사이 간격은 불응기보다 짧을 수 없다. 그래서 발화율의 상한이 생긴다.

$$
r \le \frac{1}{t_{\text{ref}}} = \frac{1}{1\ \text{ms}} = 1{,}000\ \text{회/초}
$$


슬라이드의 최대 500~800회/초는 이 상한 안에 있다. 간격으로 바꾸면 2 ms와 1.25 ms다. 실제 최대가 1,000회/초보다 낮은 이유는 불응기 뒤에도 한동안 더 센 자극이 있어야 발화하는 시기(상대 불응기)가 있기 때문이다[^s3].

<details markdown="1"><summary markdown="span">세기에 따른 발화율 곡선 (모형)</summary>


막전위가 자극 세기 $$s$$에 비례해 쌓이다가 문턱 $$\theta$$에 닿으면 발화하고, 0으로 돌아가 $$t_{\text{ref}}$$ 동안 멈춘다고 하자(불응기가 있는 적분-발화 모형)[^s4]. 문턱까지 쌓는 데 $$\theta / s$$가 걸리므로 간격은 $$t_{\text{ref}} + \theta/s$$다.

$$
r(s) = \frac{1}{t_{\text{ref}} + \theta / s}
$$


$$s$$가 커지면 $$r$$도 커진다. 하지만 $$\theta/s \to 0$$이므로 $$r$$은 $$1/t_{\text{ref}}$$에 다가갈 뿐 넘지 못한다. $$t_{\text{ref}} = 1$$ ms, $$\theta = 1$$일 때 $$s = 0.25, 0.5, 1, 2, 4$$이면 $$r = 200, 333, 500, 667, 800$$회/초다.

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 상한 1,000회/초와 간격 2 ms, 1.25 ms는 산술로 확인됨. 발화율 곡선은 0.001 ms 단위 시뮬레이션과 공식이 1% 안에서 일치 (실험으로 확인됨) — [05_rate-coding_verify.py](/Hongs_Blog/studies/human-interface-media/code/05_rate-coding_verify/)</div>

</div>


## 신호·머신러닝 관점

**신호.** 크기가 같은 펄스를 늘어놓고 그 빈도에 세기를 싣는 방식이다. 전자공학의 펄스 주파수 변조(pulse frequency modulation)와 같은 구조다. 펄스 크기에 정보가 없으므로 가는 도중 작은 잡음이 섞여도 펄스를 다시 만들면 원래대로 돌아온다. 디지털 신호가 잡음에 강한 이유와 같다. 불응기는 최소 펄스 간격이고, 발화율 곡선이 위에서 눌리는 것은 입력 범위를 좁은 출력 범위에 담는 압축이다[^s5].

**머신러닝.** 인공 신경망의 한 뉴런이 내는 실수 값은 이 발화율로 읽을 수 있다. 출력이 0보다 작을 수 없고 위에서 포화한다는 성질이 [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)의 활성 함수로 들어간다. 스파이크 하나하나의 시간까지 흉내 내는 모델은 따로 스파이킹 신경망(spiking neural network)이라 부른다[^s5].

## 연결

- 선수: [뉴런과 신호 전달](/Hongs_Blog/studies/human-interface-media/neuron-signaling/)
- 발화율을 늘리고 줄이는 두 입력: [흥분성과 억제성 시냅스](/Hongs_Blog/studies/human-interface-media/excitatory-inhibitory/)
- 출력의 상한·하한이 활성 함수가 된다: [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"센 자극은 더 큰 스파이크를 만든다"</div>

틀렸다. 소리가 클수록 스피커 진폭이 커지듯 신경도 그럴 것 같아 보인다. 실제로 스파이크의 크기는 자극 세기와 상관없이 같다(−70 mV → +40 mV). 세기는 스파이크가 얼마나 촘촘한지로 전해진다. 확인 방법: 슬라이드 p.9의 (a)(b)(c)에서 막대의 높이는 모두 같고 간격만 다르다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 뉴런이 자극의 세기를 나타내는 방법을 쓰고, 스파이크 하나의 크기는 세기에 따라 어떻게 되는지 쓰라.</summary>


**답:** 발화율(초당 스파이크 수)로 나타낸다. 센 자극일수록 스파이크가 촘촘해진다. 스파이크 하나의 크기는 세기와 상관없이 같다(전부 아니면 전무).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 불응기가 1 ms일 때 이론상 최대 발화율은? 슬라이드의 최대 발화율 800회/초일 때 스파이크 간격은?</summary>


**답:** $$1/1\text{ ms} = 1{,}000$$회/초. 800회/초의 간격은 $$1{,}000/800 = 1.25$$ ms로, 불응기 1 ms보다 길다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 자극이 아주 셀 때, 세기가 조금 다른 두 자극을 발화율만으로 구별하기 어려워지는 이유는?</summary>


**답:** 불응기 때문에 발화율에 상한(1,000회/초)이 있어서, 세기가 커질수록 발화율이 상한 근처에서 포화한다. 곡선이 평평한 곳에서는 세기가 달라도 발화율 차이가 거의 없다.<br>
**흔한 오답:** "뉴런이 지쳐서"라고만 쓴다. 핵심은 간격이 불응기보다 짧아질 수 없다는 구조적 한계다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.9 (Representation of Strength)
[^s1]: 에이전트 보충. 스파이크 그림은 슬라이드 p.9 그림을 글자로 옮긴 개략도다. "자발 발화"라는 이름은 강의 3 p.13의 표(Spontaneous)에서 가져왔다.
[^s2]: 에이전트 보충. "전부 아니면 전무"라는 이름은 원본에 없다. 슬라이드 p.8에서 활동 전위가 늘 +40 mV까지 오르고, p.9에서 막대 높이가 같다는 점을 표준 용어로 적었다.
[^s3]: 에이전트 보충. 절대 불응기와 상대 불응기의 구분은 표준 생리학 교재의 설명이다.
[^s4]: 에이전트 보충. 적분-발화 모형과 그 식은 원본에 없다. 슬라이드의 불응기와 최대 발화율이 어떻게 이어지는지 보이려는 설명용 모형이다. 실제 뉴런의 막전위는 새어 나가기도 하므로(누설) 이 모형보다 복잡하다.
[^s5]: 에이전트 보충. 펄스 주파수 변조와의 대응, 인공 신경망 활성값을 발화율로 읽는 해석, 스파이킹 신경망은 원본 밖의 연결이다.
[^s6]: 에이전트 보충. 상한 $$1/t_{\text{ref}}$$는 "불응기마다 많아야 한 번 발화한다"에서 나온 계산이다. 슬라이드의 500~800회가 이 상한보다 낮다는 비교는 원본에 없다.
{% endraw %}
