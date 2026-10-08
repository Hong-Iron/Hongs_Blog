---
layout: "note"
title: "뉴런과 신호 전달"
display_title: "뉴런과 신호 전달 (Neurons and Signal Transfer)"
kind: "concept"
kind_label: "모델"
num: "04"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Neuron", "뉴런", "신경 세포", "수용기", "receptor", "활동 전위", "action potential", "휴지 전위", "resting potential", "시냅스", "synapse", "신경 전달 물질", "Transfer of Signal"]
description: "신경계는 전선망과 비슷하다. 감각 수용기가 빛·압력 같은 자극을 전기 신호로 바꾸고, 뉴런이 그 신호를 긴 줄기(축삭)를 따라 보낸 뒤, 접점(시냅스)에서 화학 물질로 다음 뉴런에 넘긴다. 전선과 달리 신호가 가는 도중 약해지지 않고 같은 크기로 다시 만들어지며 퍼진다. 대신 전선…"
prev_url: "/studies/human-interface-media/intelligent-system/"
prev_title: "지능 시스템"
next_url: "/studies/human-interface-media/rate-coding/"
next_title: "발화율 부호화"
math: false
mermaid: true
code_count: 0
permalink: "/studies/human-interface-media/neuron-signaling/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신경계는 전선망과 비슷하다. 감각 수용기가 빛·압력 같은 자극을 전기 신호로 바꾸고, 뉴런이 그 신호를 긴 줄기(축삭)를 따라 보낸 뒤, 접점(시냅스)에서 화학 물질로 다음 뉴런에 넘긴다. 전선과 달리 신호가 가는 도중 약해지지 않고 같은 크기로 다시 만들어지며 퍼진다. 대신 전선보다 훨씬 느리다.

</div>


## 예시로 보기

손등을 누르는 장면을 따라가 보자[^1].

```mermaid
graph LR
  S["자극<br/>(누르는 힘)"] --> R["촉각 수용기<br/>힘 → 전기"] --> F["신경 섬유<br/>전기 신호"] --> Y["시냅스<br/>전기 → 화학 → 전기"] --> N["다음 뉴런<br/>세포체·수상돌기"] --> A["축삭<br/>다시 전기 신호"]
```

신호의 형태는 물리 자극 → 전기 → 화학 → 전기로 바뀐다. 수용기는 환경의 자극을 받는 뉴런으로, 세포체 자리에 수용기가 있다[^1].

다섯 감각은 모두 이런 수용기를 쓴다. 슬라이드 p.7 아래 그림은 시각, 청각, 촉각, 후각, 미각의 수용기다[^1]. 모양은 제각각이지만 하는 일은 같다. 자기 감각의 자극을 전기 신호로 바꾼다.

축삭 안에 전극을 꽂고 밖의 기준 전극과 비교하면, 신호가 지나갈 때 전압이 이렇게 변한다[^2].

| 순간 | 전극 위치의 막전위 |
|---|---|
| 신호가 오기 전 | −70 mV (휴지 전위) |
| 신호(신경 충격)가 전극 위를 지날 때 | +40 mV까지 치솟는다 |
| 신호가 지나간 뒤 | 다시 −70 mV |

치솟았다 돌아오는 이 펄스가 활동 전위(action potential)다. 크기는 약 110 mV(−70 → +40)다. 펄스가 축삭을 따라 옆으로 옮겨 가며 전달된다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **수용기**: 환경의 자극(빛, 압력, 소리, 화학 물질)을 전기 신호로 바꾸는 세포.
- **뉴런**: 세포체, 수상돌기, 축삭(신경 섬유)으로 이루어진 신경 세포[^1]. 수상돌기로 신호를 받고 축삭으로 내보낸다.
- **시냅스**: 뉴런과 뉴런이 맞닿는 곳. 보내는 뉴런의 축삭 끝에 있는 작은 주머니(시냅스 소포)가 신경 전달 물질을 내보낸다. 이 분자가 받는 뉴런의 수용 부위에 붙으면서 신호가 넘어간다[^2].
- **휴지 전위**: 신호가 없을 때 섬유 안쪽이 바깥보다 약 70 mV 낮은 상태[^2].

</div>


수용기가 없으면 뉴런은 빛이나 소리를 직접 다루지 못한다. 뉴런이 다루는 신호는 전기와 화학 신호뿐이기 때문이다. 수용기는 공학의 센서(변환기, transducer)와 같은 역할을 한다[^s1].

## 활용

- 휴먼 인터페이스의 입력 장치도 같은 구조다. 카메라의 이미지 센서는 빛을, 마이크는 공기 압력을 전기 신호로 바꾼다. 사람의 수용기와 장치의 센서는 "자극 → 전기" 변환이라는 같은 자리를 차지한다[^s1].
- 신호가 몇 ms 단위로 전달되므로, 보고 반응하기까지 약 0.2초가 걸린다. [지각](/Hongs_Blog/studies/human-interface-media/perception/)의 시간표가 그 누적이다.

## 연결

- 선수: [지각](/Hongs_Blog/studies/human-interface-media/perception/) (감각 단계)
- 다음: 신호의 세기를 어떻게 싣는가 → [발화율 부호화](/Hongs_Blog/studies/human-interface-media/rate-coding/)
- 시각의 수용기: [간상체와 추상체](/Hongs_Blog/studies/human-interface-media/rods-and-cones/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"신경 신호는 전선 속 전기처럼 순식간에 전달된다"</div>

틀렸다. 둘 다 "전기 신호"라서 같은 속도로 착각하기 쉽다. 전선 속 신호는 빛의 속도에 가깝게 퍼지지만, 신경 신호는 활동 전위를 한 칸씩 다시 만들며 나아가므로 초속 약 1~120 m 정도다[^s2]. 확인 방법: [지각](/Hongs_Blog/studies/human-interface-media/perception/)의 시간표에서 눈에서 손가락 근육까지 180~260 ms가 걸린다. 이 거리를 빛의 속도로 가면 1 μs도 걸리지 않는다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 피부를 누른 자극이 다음 뉴런에 전달되기까지 거치는 곳을 순서대로 쓰고, 단계마다 신호의 형태(물리·전기·화학)를 쓰라.</summary>


**답:** 자극(물리: 압력) → 수용기(물리를 전기로 바꿈) → 신경 섬유(전기) → 시냅스(신경 전달 물질: 화학) → 다음 뉴런의 수상돌기·세포체(다시 전기) → 축삭(전기).<br>
**흔한 오답:** 시냅스에서도 전기가 그대로 건너간다고 쓴다. 슬라이드의 시냅스는 신경 전달 물질이라는 화학 신호로 건넌다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 축삭 안쪽 전극과 바깥 기준 전극 사이의 전압계가 있다. 신경 충격이 전극에 다가와 지나갈 때까지 전압계 값이 어떻게 바뀌는지 수치로 쓰라.</summary>


**답:** 처음 −70 mV(휴지 전위) → 충격이 전극 위에 오면 +40 mV까지 오름 → 지나간 뒤 −70 mV로 돌아옴.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 수용기가 따로 있어야 하는 이유는 무엇이고, 컴퓨터 쪽 인터페이스 장치 중 무엇과 같은 역할인가?</summary>


**답:** 뉴런은 전기·화학 신호만 다룬다. 빛·압력·소리 같은 물리 자극을 전기 신호로 바꿔 주는 단계가 있어야 신경계에 들어올 수 있다. 카메라 이미지 센서나 마이크 같은 센서(변환기)와 같은 역할이다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.7 (Senses & Neurons, 그림 설명 Figure 2.4 포함)
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.8 (Transfer of Signal)
[^s1]: 에이전트 보충. 수용기를 센서·변환기에 빗댄 것과 입력 장치와의 대응은 원본에 없다. 비유의 한계: 센서는 입력을 그대로 옮기려 하지만, 사람의 수용기는 곧바로 신호 가공(수렴, 억제)에 들어간다.
[^s2]: 에이전트 보충. 신경 전도 속도는 표준 생리학 교재의 범위다. 가늘고 수초가 없는 섬유는 초속 1 m 안팎, 굵고 수초가 있는 섬유는 초속 100 m 이상이다.
{% endraw %}
