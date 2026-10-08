---
layout: "note"
title: "불면증 인지행동치료"
display_title: "불면증 인지행동치료 (CBT-I)"
kind: "concept"
kind_label: "기법"
num: "100"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "심리학"
updated: "2026-09-27"
status: "verified"
aliases: ["Cognitive Behavioral Therapy for Insomnia", "CBT-I", "수면제한", "sleep restriction", "자극통제", "stimulus control", "수면 위생 교육", "sleep hygiene education", "이완훈련", "relaxation training", "수면일지", "sleep diary", "수면 효율", "sleep efficiency", "조건화된 각성", "conditioned arousal"]
description: "침대와 잠 사이의 끊어진 연결을 다시 잇는 치료다. 오래 불면을 겪으면 침대가 \"뒤척이고 걱정하는 곳\"으로 학습되어, 눕기만 해도 정신이 또렷해진다. CBT-I는 침대에 있는 시간을 실제로 자는 시간만큼 줄이고, 침대에서는 잠만 자게 하고, 잠에 대한 걱정스러운 생각을 고친다. 처…"
prev_url: "/studies/abnormal-psychology/insomnia-disorder/"
prev_title: "불면장애"
next_url: "/studies/abnormal-psychology/hypersomnolence-disorder/"
next_title: "과다수면장애"
math: true
mermaid: false
code_count: 1
permalink: "/studies/abnormal-psychology/cbt-i/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

침대와 잠 사이의 끊어진 연결을 다시 잇는 치료다. 오래 불면을 겪으면 침대가 "뒤척이고 걱정하는 곳"으로 학습되어, 눕기만 해도 정신이 또렷해진다. CBT-I는 침대에 있는 시간을 실제로 자는 시간만큼 줄이고, 침대에서는 잠만 자게 하고, 잠에 대한 걱정스러운 생각을 고친다. 처음 1~2주는 오히려 더 졸리고 힘들지만, 수면제와 달리 효과가 끝난 뒤에도 남는다. 그래서 수면 학회들이 약보다 먼저 권한다.

</div>


## 예시로 보기

GW는 밤 11시부터 아침 7시까지 여덟 시간을 침대에 있지만, 잠들기까지 90분이 걸리고 중간에 30분을 깨어 있다[^s1].

1. *수면일지로 효율 구하기:* 실제 수면 360분 ÷ 침대 480분 = 75%.
2. *수면제한:* 침대 시간을 실제 수면 시간인 360분으로 줄인다. 기상 시각 7시는 고정하고 취침을 새벽 1시로 미룬다.
3. *자극통제:* 20분쯤 지나도 잠이 안 오면 침대에서 나와 거실에서 조용히 있다가 졸릴 때 돌아온다. 침대에서 휴대폰을 보지 않는다.
4. *한 주 뒤 조정:* 침대 360분 가운데 330분을 잤다. 효율 91.7%로 85% 이상이므로 침대 시간을 15분 늘려 0시 45분에 눕는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시와 연습 문제의 수면 효율, 제한 뒤 취침 시각, 경계 조건 3개 일치 — [100_cbt-i_verify.py](/Hongs_Blog/studies/abnormal-psychology/code/100_cbt-i_verify/)</div>

</div>


## 구성 요소[^1]

| 요소 | 하는 일 |
|---|---|
| 수면일지 작성 | 잠들기까지 걸린 시간, 실제 수면 시간, 수면의 질을 기록하고 점검한다 |
| 수면제한(sleep restriction) | 수면 효율이 85% 이상이 되도록 침대에 있는 시간을 줄인다 |
| 자극통제(stimulus control) | 침대와 침실이 잠을 부르는 자극이 되도록 수면의 조건화를 다시 세운다 |
| 수면 위생 교육(sleep hygiene education) | 숙면을 취할 수 있는 환경과 습관을 가르친다 |
| 이완훈련(relaxation training) | 신체적·정신적 각성 수준을 낮춘다 |
| 인지적 재구성(cognitive restructuring) | 역기능적 수면 신념과 잠을 방해하는 생각을 고친다 |

수면 효율은 침대에 있는 시간 가운데 실제로 잔 시간의 비율이다.

$$\text{수면 효율(\%)} = \frac{\text{실제 수면 시간}}{\text{침대에 누워 있는 시간}} \times 100$$


수면제한은 보통 침대 시간을 평균 실제 수면 시간까지 줄이되 5시간 밑으로는 줄이지 않는다. 기상 시각을 고정하고, 한 주 평균 효율이 85% 이상이면 침대 시간을 15분씩 늘린다[^s2].

## 자극통제의 원리[^1]

오래 불면을 겪은 사람의 침대는 불안, 두려움, 뒤척임, 좌절, 독서, TV, SNS, 이메일, 숙제, 걱정, 문제 해결, 먹기, 잠, 성관계와 모두 연결된다. p.62 그림에서 이런 침대가 잠을 부를 확률은 15번에 1번(7%)이다. 침대를 잠과 성관계에만 쓰게 하면 이 확률이 2번에 1번(50%)으로 오른다. 이렇게 조건화된 각성(conditioned arousal)을 끊는 것이 자극통제다.

고전적 조건형성으로 옮기면, 침대(조건 자극)가 걱정과 뒤척임에 반복해서 짝지어져 각성(조건 반응)을 일으키게 된 것이다. 자극통제는 침대를 잠에만 짝지어 새 연합을 만든다([행동주의적 입장](/Hongs_Blog/studies/abnormal-psychology/behavioral-perspective/))[^s3].

흔히 쓰는 자극통제 지침은 다음과 같다[^s3].

1. 졸릴 때만 눕는다.
2. 침대는 잠과 성관계에만 쓴다.
3. 20분쯤 지나도 잠이 안 오면 침대에서 나와 다른 방에 있다가 졸릴 때 돌아온다.
4. 얼마나 잤든 기상 시각을 매일 같게 한다.
5. 낮잠을 자지 않는다.

## 적용 조건과 주의

- 미국수면의학회와 유럽수면의학회는 만성 불면에 CBT-I를 강하게 권하고, 약은 효과가 없거나 CBT-I를 할 수 없을 때만 단기간 쓴다[^2].
- 수면제한 초기에는 낮 졸림이 늘어난다. 운전이나 위험한 기계 작업에 주의해야 한다[^s4].
- 불면의 지속요인(잘못된 습관, 걱정, 과다각성)을 겨냥하므로, 촉발 스트레스가 이미 지나간 만성 불면에 특히 맞다.

## 연결

- 치료 대상: [불면장애](/Hongs_Blog/studies/abnormal-psychology/insomnia-disorder/)의 지속요인
- 바탕 치료: [인지행동치료](/Hongs_Blog/studies/abnormal-psychology/cbt/)
- 반대 문제에 맞춘 변형: [과다수면장애](/Hongs_Blog/studies/abnormal-psychology/hypersomnolence-disorder/)의 CBT-H

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> CBT-I의 여섯 구성 요소를 쓰고, 수면제한의 목표 수치를 쓰라.</summary>


**답:** 수면일지, 수면제한, 자극통제, 수면 위생 교육, 이완훈련, 인지적 재구성. 수면제한은 수면 효율 85% 이상을 목표로 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> GV는 밤 10시 30분부터 아침 7시까지 침대에 있는데, 잠들기까지 60분, 중간에 깬 시간이 모두 45분이다. 수면 효율을 구하고, 기상 7시를 고정한 수면제한의 첫 취침 시각을 정하라.</summary>


**답:** 침대 510분, 실제 수면 510 − 60 − 45 = 405분. 효율 405 ÷ 510 ≈ 79.4%로 85% 미만이다. 침대 시간을 405분(6시간 45분)으로 줄이면 취침은 0시 15분이다. 흔한 실수는 잠들기까지의 시간만 빼고 중간에 깬 시간을 빼지 않는 것이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 잠이 안 오는데 침대에 누워 버티는 것이 왜 불면을 오래 가게 하는가? 자극통제의 원리로 설명하라.</summary>


**답:** 누워서 뒤척이고 걱정하는 경험이 반복되면 침대(조건 자극)가 잠 대신 각성과 불안(조건 반응)을 일으키도록 조건형성된다. 그러면 눕기만 해도 정신이 또렷해진다. 그래서 잠이 안 오면 침대에서 나와, 침대를 잠에만 짝지어 조건화를 다시 세운다.

</details>

[^1]: 4-1학기/이상 심리학/1.수업자료/08.급식 및 섭식장애, 수면-각성장애.pdf, p.62. 조건화된 각성 그림의 두 칸 사이 "자극 통제" 화살표는 손글씨 필기다.
[^2]: 4-1학기/이상 심리학/1.수업자료/08.급식 및 섭식장애, 수면-각성장애.pdf, p.61
[^s1]: 에이전트 보충. GW의 사례와 계산은 수면제한의 절차를 보이려고 만든 가상 예다.
[^s2]: 에이전트 보충. 최소 침대 시간(5시간), 기상 시각 고정, 주 단위 15분 조정은 스필만(Spielman)의 수면제한 요법을 바탕으로 한 일반적인 CBT-I 절차다. 기관마다 기준(85% 또는 90%, 15분 또는 30분)이 조금씩 다르다.
[^s3]: 에이전트 보충. 조건형성으로의 번역과 다섯 지침은 부트진(Bootzin)의 자극통제 요법을 요약했다.
[^s4]: 에이전트 보충. 수면제한 초기의 낮 졸림 증가와 안전 주의는 CBT-I 지침의 일반적인 주의 사항이다.
{% endraw %}
