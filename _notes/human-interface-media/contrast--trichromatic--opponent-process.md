---
layout: "note"
title: "삼색 이론과 반대색 과정 비교"
display_title: "삼색 이론과 반대색 과정 비교"
kind: "concept"
kind_label: "비교"
num: "20"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-09-25"
status: "verified"
aliases: ["삼색 이론 vs 반대색 과정", "trichromatic vs opponent-process", "삼원색설과 반대색설"]
description: "둘은 경쟁하는 이론이 아니라 색 신호가 거치는 앞뒤 두 단계다. 가르는 질문은 \"그 현상이 세 추상체 반응의 크기만으로 정해지는가, 아니면 짝끼리의 차이(+와 −)가 필요한가\"다."
prev_url: "/studies/human-interface-media/opponent-process/"
prev_title: "반대색 과정"
next_url: "/studies/human-interface-media/binocular-disparity/"
next_title: "양안 시차"
math: true
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/contrast--trichromatic--opponent-process/"
---
{% raw %}
둘은 경쟁하는 이론이 아니라 색 신호가 거치는 앞뒤 두 단계다. 가르는 질문은 "그 현상이 세 추상체 반응의 크기만으로 정해지는가, 아니면 짝끼리의 차이(+와 −)가 필요한가"다[^1].

## 어느 쪽일까

상황마다 [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)과 [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/) 중 어느 쪽이 설명하는지 고르고, 다른 쪽이 왜 아닌지도 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 임의의 색을 맞추는 실험에서 원색이 셋 필요하다 (b) 빨간 사각형을 오래 본 뒤 흰 벽을 보면 초록 사각형이 보인다</summary>


**답:** (a) 삼색 이론. 추상체가 셋이라 반응이 세 숫자이고, 세 숫자를 맞추려면 원색이 셋 필요하다. 반대색 과정은 원색의 개수를 말하지 않는다. (b) 반대색 과정. 빨강-초록 세포가 한쪽으로 적응했다가 반대쪽으로 기우는 현상이다. 삼색 이론의 추상체는 모두 0 이상의 반응만 내므로 "빨강의 반대"라는 개념이 없다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) "붉은 초록"이나 "노란 파랑" 같은 색을 떠올릴 수 없다 (d) M 추상체가 없는 사람은 빛 두 개만 섞어도 모든 색을 맞춘다</summary>


**답:** (c) 반대색 과정. 한 세포가 빨강이면 발화를 늘리고 초록이면 줄여서 둘을 동시에 "많이"로 나타낼 수 없다. 삼색 이론에서는 M과 L이 함께 커질 수 있어 이런 제약이 나오지 않는다. (d) 삼색 이론. 추상체가 둘이면 반응이 두 숫자라 원색 둘로 맞춘다. 원색의 개수는 추상체 수가 정한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> (e) 모니터가 R, G, B 세 빛만 쓴다 (f) 영상 압축이 색을 밝기 하나와 색차 둘(초록-빨강, 파랑-노랑 쪽)로 나누어 저장한다</summary>


**답:** (e) 삼색 이론. 세 추상체 반응을 맞추면 되므로 원색 셋이면 충분하다. (f) 반대색 과정. 뇌로 가는 신호가 밝기와 두 반대색 차이로 나뉘어 있어서, 같은 방식으로 나누면 사람이 둔한 색차를 거칠게 저장해도 티가 덜 난다.

</details>

## 결정적 차이

| 기준 | 삼색 이론 | 반대색 과정 |
|---|---|---|
| 어디서 | 망막의 추상체(수용기) | 추상체 뒤의 신경 세포 |
| 신호의 모양 | 세 반응의 크기. 모두 0 이상 | 짝끼리의 차이. + 또는 − |
| 기본 단위 | S, M, L | 빨강-초록, 파랑-노랑, 흰색-검정 |
| 설명하는 현상 | 색 맞추기, 조건등색, 색각 이상의 원색 수 | 잔상, 동시 대비, 떠올릴 수 없는 색 조합 |
| 공학의 좌표계 | RGB, CIE XYZ | CIE Lab ($$a^*$$, $$b^*$$), YCbCr |

슬라이드 p.13 가운데 그림이 이 표의 첫 줄과 넷째 줄을 한 줄로 요약한다: 빛 → 수용기(삼색, 색 맞추기) → 반대색 세포(잔상, 동시 대비) → 뇌[^1]. 공학의 좌표계 줄은 강의 계획표 5주차의 색 공간과 이어진다[^2][^s1].

## 둘 다 아닐 때

- **색 항등성.** 조명이 누르스름한 전등에서 한낮의 햇빛으로 바뀌어도 사과는 계속 빨갛게 보인다. 눈에 들어오는 스펙트럼은 크게 바뀌므로 추상체 반응도 바뀐다. 장면 전체의 조명을 추정해 보정하는 일은 두 단계보다 뒤의 대뇌 피질이 한다[^s2].
- **밝기 항등성.** 흰 종이가 어두운 방에서도 희게 보이는 것은 색이 아니라 밝기의 문제이고, 주변과의 비를 쓰는 [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/)의 대비와 [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)가 관여한다.

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.10 (Trichromatic Theory, Metamerism), p.13 (보색: Trichromatic → Opponent-process)
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Lecture Calendar 5주차
[^s1]: 에이전트 보충. 공학 좌표계 줄과 (f) 문항은 원본 밖이다. CIELAB, YCbCr와 반대색 과정의 대응은 색채·영상 공학의 표준 설명이다.
[^s2]: 에이전트 보충. 색 항등성과 피질의 역할은 표준 지각 교재의 설명이다.
{% endraw %}
