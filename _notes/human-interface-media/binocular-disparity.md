---
layout: "note"
title: "양안 시차"
display_title: "양안 시차 (Binocular Disparity)"
kind: "concept"
kind_label: "정의"
num: "21"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Binocular Disparity", "양안 인식", "양안 시각", "입체시", "stereopsis", "호롭터", "horopter", "대응점", "시야", "field of view", "두눈과 시야"]
description: "두 눈은 몇 센티미터 떨어진 두 대의 카메라다. 같은 장면을 조금 다른 각도에서 찍으므로 두 상이 어긋나고, 뇌는 이 어긋남(시차)의 크기로 거리를 가늠한다. 가까운 물체일수록 어긋남이 크고, 멀어지면 빠르게 작아져서 먼 거리에서는 다른 단서에 기대야 한다. 두 눈의 시야가 많이 …"
prev_url: "/studies/human-interface-media/contrast--trichromatic--opponent-process/"
prev_title: "삼색 이론과 반대색 과정 비교"
next_url: "/studies/human-interface-media/visual-pathway/"
next_title: "시각 경로"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/binocular-disparity/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 눈은 몇 센티미터 떨어진 두 대의 카메라다. 같은 장면을 조금 다른 각도에서 찍으므로 두 상이 어긋나고, 뇌는 이 어긋남(시차)의 크기로 거리를 가늠한다. 가까운 물체일수록 어긋남이 크고, 멀어지면 빠르게 작아져서 먼 거리에서는 다른 단서에 기대야 한다. 두 눈의 시야가 많이 겹칠수록 깊이는 잘 보지만 전체 시야는 좁아진다.

</div>


## 예시로 보기

손가락을 눈앞에 세우고 먼 물체를 본다. 왼눈과 오른눈을 번갈아 감으면 손가락이 먼 물체에 대해 좌우로 뛴다. 두 눈에 맺힌 상에서 손가락과 물체의 상대 위치가 다르기 때문이다[^1].

슬라이드의 수영장 그림은 구조원이 Frieda를 보고 있는 장면이다[^1]. 점선 원(호롭터, horopter) 위의 Susan과 Harry는 두 눈의 망막에서 서로 대응하는 자리에 상이 맺혀 시차가 0이다. 원 안쪽(더 가까운 곳)의 Carole은 두 눈의 상이 대응점에서 벗어나 시차가 생긴다[^s1].

거리에 따라 시차가 얼마나 달라지는지 계산하면 이렇다. 두 눈 사이를 6.5 cm로 두고, 거리 $$d$$의 점을 두 눈이 바라보는 방향의 각도 차 $$2\arctan(B/2d)$$를 비교한다[^s2].

| 비교 | 각도 차(시차) |
|---|---|
| 30 cm 손가락 대 3 m 물체 | 약 11.1° |
| 10 m 물체 대 11 m 물체 | 약 0.034° |

가까운 곳에서는 수십 cm 차이가 10° 넘게 벌어지고, 먼 곳에서는 1 m 차이가 0.03°로 거의 사라진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/21_binocular-disparity_fig2.svg" alt="그림" loading="lazy">

두 눈에서 한 점으로 그은 두 시선이 그 점에서 각을 이룬다. 점이 가까울수록 각이 벌어지고, 두 점의 각 차이가 시차다. 그림은 보기 쉽게 두 눈 사이를 거리에 비해 크게 그렸다[^s7].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**양안 시차**(binocular disparity): 왼눈과 오른눈에 맺힌 상의 차이[^1]. 호롭터 위의 점은 두 망막의 대응점에 맺혀 시차가 0이고, 호롭터에서 멀어질수록 시차가 커진다[^s1].

</div>


작은 각도에서 $$2\arctan(B/2d) \approx B/d$$이므로, 거리 $$d_1 < d_2$$인 두 점의 시차는

$$
\delta \approx B\left(\frac{1}{d_1} - \frac{1}{d_2}\right)
$$


이다. $$B$$는 두 눈 사이 거리(기선, baseline)다. 시차는 거리의 역수 차이에 비례하므로 멀어질수록 빠르게 줄어든다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/21_binocular-disparity_fig1.svg" alt="그림" loading="lazy">

곡선은 1 m 안쪽에서 가파르게 떨어지고, 몇 m만 넘어가도 바닥에 붙는다. 바닥에 붙은 구간에서는 거리가 1 m 달라져도 높이 차이가 눈에 보이지 않는다[^s6].

**두 눈과 시야.** 슬라이드 p.15는 동물마다 두 눈의 시야를 비교한다[^2]. 전체 시야 = 왼눈 시야 + 오른눈 시야 − 겹친 양안 시야, 사각(보이지 않는 각도) = 360° − 전체 시야다.

| 그림 | 한 눈 시야 | 양안 시야 | 전체 시야 | 그림의 사각 |
|---|---|---|---|---|
| 첫째 (눈이 얼굴 정면, 사람 모양) | 145° | 120° | 170° | 170° |
| 둘째 | 200° | 120° | 280° | 80° |
| 셋째 (눈이 얼굴 옆면, 토끼 모양) | 190° | 앞 10°, 뒤 9° | 약 360° | 없음 |
| 넷째 (두 눈이 떨어져 있음) | 210° | 65° | 355° | 3° |

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 첫째 그림(사람 모양) "사각(死角) 약 170°", "오른쪽 눈의 시야 약 145°", "왼쪽 눈의 시야 약 145°", "양안 시야 약 120°" (강의 3 p.15) / 문제점: 그림의 숫자대로면 전체 시야가 145 + 145 − 120 = 170°이고 사각은 360 − 170 = 190°다. 170°는 사각이 아니라 전체 시야로 보인다. 다른 그림은 숫자가 서로 맞는다(둘째 280 + 80 = 360, 넷째는 반올림 범위 안의 2° 차이). / 수정안: 한 눈 시야를 약 155°로 고친다(155 + 155 − 120 = 190°, 사각 170°). 사람의 실제 값에 맞는 쪽은 "사각 약 170°"이고, 틀린 숫자는 한 눈 시야 145°다. 사람의 한 눈 수평 시야는 귀 쪽 약 100°, 코 쪽 약 60°로 150~160°이고, 두 눈을 뜨면 전체 시야가 약 190~200°라 사각은 160~170°다[^s5] / 근거: [21_binocular-disparity_verify.py](/Hongs_Blog/studies/human-interface-media/code/21_binocular-disparity_verify/)

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 그림의 시야 산술(사람 그림만 불일치), 시차 11.12°와 0.034° (실험으로 확인됨) — [21_binocular-disparity_verify.py](/Hongs_Blog/studies/human-interface-media/code/21_binocular-disparity_verify/)</div>

</div>


## 활용

- 눈이 얼굴 정면에 있으면 양안 시야가 넓어 깊이를 잘 본다. 거리를 정확히 재야 하는 사냥꾼(육식 동물)과 영장류가 그렇다. 눈이 옆면에 있으면 거의 360°를 볼 수 있어 포식자를 일찍 알아챈다. 슬라이드 아래 사진의 닭, 소, 사슴처럼 쫓기는 쪽 동물이 그렇다[^s3].
- 입체 영화와 VR 헤드셋은 두 눈에 조금 다른 영상을 보여 주어 인공으로 시차를 만든다. 휴먼 인터페이스 미디어가 깊이라는 감각을 흉내 내는 방법이다. 강의 계획표의 "사람의 시각: 깊이"가 이 주제다[^3][^s3].

## 연결

- 선수: [눈의 구조](/Hongs_Blog/studies/human-interface-media/eye-anatomy/)
- 두 눈의 신호가 합쳐지는 곳: [시각 경로](/Hongs_Blog/studies/human-interface-media/visual-pathway/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"한 눈을 감으면 깊이를 전혀 알 수 없다"</div>

틀렸다. 양안 시차가 깊이의 대표 단서라서 그렇게 느끼기 쉽다. 실제로는 한 눈으로도 쓸 수 있는 단서가 많다: 가림(앞의 물체가 뒤를 가림), 익숙한 크기, 원근(멀수록 작고 선이 모임), 움직일 때 가까운 것이 더 빨리 지나가는 운동 시차[^s4]. 확인 방법: 한 눈을 감고 방 안을 둘러봐도 무엇이 앞에 있는지 안다. 다만 손끝으로 바늘귀에 실을 꿰는 것처럼 가까운 거리의 정밀한 일은 훨씬 어려워진다. 시차가 가까운 거리에서 가장 크게 기여하기 때문이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 양안 시차를 정의하고, 호롭터 위에 있는 물체의 시차는 얼마인지 쓰라.</summary>


**답:** 왼눈과 오른눈에 맺힌 상의 차이. 호롭터 위의 물체는 두 망막의 대응점에 맺혀 시차가 0이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 사람 모양 그림의 한 눈 시야 145°, 양안 시야 120°로 전체 시야와 사각을 계산하라. 그림의 "사각 약 170°"와 맞는가? 둘째 그림(한 눈 200°, 양안 120°, 사각 80°)은 어떤가?</summary>


**답:** 사람: 전체 $$145 + 145 - 120 = 170°$$, 사각 $$360 - 170 = 190°$$. 그림의 사각 170°와 맞지 않는다. 실제 사람의 사각은 약 160~170°라서, 틀린 숫자는 한 눈 시야 145°(실제 약 150~160°)다. 둘째: 전체 $$200 + 200 - 120 = 280°$$, 사각 $$80°$$로 그림과 맞는다.<br>
**흔한 오답:** 두 눈의 시야를 그냥 더해 290°라고 쓴다. 겹친 양안 시야는 두 번 세었으므로 한 번 빼야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 양안 시차가 가까운 거리의 깊이에는 강한 단서이고 먼 거리에서는 약한 단서인 이유를 식이나 수치로 설명하라.</summary>


**답:** 시차는 대략 $$B(1/d_1 - 1/d_2)$$로 거리의 역수 차이에 비례한다. 멀어지면 $$1/d$$가 모두 작아져 차이도 급격히 줄어든다. 30 cm와 3 m의 시차는 약 11°지만, 10 m와 11 m의 시차는 약 0.034°에 불과하다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.14 (양안 인식, "Binocular Disparity"가 굵은 글씨). 영어 정의를 우리말로 옮겼다.
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.15 (두눈과 시야). 그림의 숫자는 확대해 읽었다.
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/01.HIM_강의01-들어가기.pdf, p.7
[^s1]: 에이전트 보충. 대응점, 호롭터 위의 시차 0, 호롭터 안쪽의 교차 시차는 표준 지각 교재(예: Goldstein, *Sensation and Perception*)의 설명이다. 슬라이드는 그림만 보여 준다.
[^s2]: 에이전트 보충. 두 눈 사이 거리 6.5 cm는 성인의 대표값으로 둔 가정이다. 시차 식과 근사는 기하학에서 나온다.
[^s3]: 에이전트 보충. 눈의 위치와 포식·피식 관계, 입체 영상과 VR의 원리는 표준 설명이다. 시야 그림에는 동물 이름이 없어서 머리 모양과 그림 속 설명으로만 구별했다.
[^s4]: 에이전트 보충. 한 눈 깊이 단서(단안 단서)는 표준 지각 교재의 내용이며 슬라이드에는 없다.
[^s5]: 에이전트 보충. 사람 시야의 대표값: 한 눈 수평 시야는 귀 쪽 약 100°, 코 쪽 약 60°(안과 시야 검사의 표준값), 두 눈을 뜬 전체 수평 시야는 약 190°(IEC 국제전기기술용어 IEV의 field of view 정의), 겹치는 양안 시야는 약 120°. 그림 원래 출처는 찾지 못했다.
[^s6]: 에이전트 보충. 그림 1장은 원본에 없다. [21_binocular-disparity_plot.py](/Hongs_Blog/studies/human-interface-media/code/21_binocular-disparity_plot/)로 그렸고, 그림에 쓴 값($$B = 6.5$$ cm에서 30 cm 대 3 m 시차 11.12°, 10 m 대 11 m 시차 0.034°)을 같은 코드로 확인했다.
[^s7]: 에이전트 보충. 그림 1장은 원본에 없다. [21_binocular-disparity_plot.py](/Hongs_Blog/studies/human-interface-media/code/21_binocular-disparity_plot/)로 그렸고, 그림에 쓴 값(두 눈 사이 1, 거리 2와 6일 때 두 시선의 각 28.1°와 9.5°, 각이 $$2\arctan(B/2d)$$와 같음)을 같은 코드로 확인했다.
{% endraw %}
