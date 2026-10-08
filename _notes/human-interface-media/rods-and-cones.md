---
layout: "note"
title: "간상체와 추상체"
display_title: "간상체와 추상체 (Rods and Cones)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Rods", "Cones", "간상세포", "추상세포", "간상체", "추상체", "시세포", "photoreceptor", "야간 시각", "색 시각", "L 추상체", "M 추상체", "S 추상체", "시세포의 분포"]
description: "망막의 시세포는 두 팀이다. 간상체는 어두운 곳에서 일하는 고감도 흑백 카메라, 추상체는 밝은 곳에서 일하는 컬러 카메라다. 간상체가 훨씬 많고 약한 빛에 민감하지만 색을 구별하지 못한다. 추상체는 색을 보지만 빛이 충분해야 일한다. 추상체는 시선의 중심(중심와)에 몰려 있고 간상…"
prev_url: "/studies/human-interface-media/eye-anatomy/"
prev_title: "눈의 구조"
next_url: "/studies/human-interface-media/trichromatic-theory/"
next_title: "삼색 이론"
math: false
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/rods-and-cones/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

망막의 시세포는 두 팀이다. 간상체는 어두운 곳에서 일하는 고감도 흑백 카메라, 추상체는 밝은 곳에서 일하는 컬러 카메라다. 간상체가 훨씬 많고 약한 빛에 민감하지만 색을 구별하지 못한다. 추상체는 색을 보지만 빛이 충분해야 일한다. 추상체는 시선의 중심(중심와)에 몰려 있고 간상체는 그 둘레에 많아서, 어두운 곳에서는 정면보다 곁눈으로 더 잘 보인다.

</div>


## 예시로 보기

밤하늘의 희미한 별은 똑바로 보면 사라지고 살짝 옆을 보면 나타난다[^s1]. 분포 그래프가 이유를 보여 준다[^1].

| 시선에서의 각도 | 추상체 (mm²당) | 간상체 (mm²당) |
|---|---|---|
| 0° (중심와) | 약 150,000으로 가장 많음 | 0 |
| 약 15~20° | 적음 (거의 일정) | 약 160,000으로 가장 많음 |
| 망막의 코 쪽 약 15~18° (맹점) | 0 | 0 |
| 더 바깥 | 적음 | 점점 줄어듦 |

똑바로 보면 별빛이 중심와에 떨어지는데, 거기에는 어두운 빛에 둔한 추상체뿐이다. 조금 옆을 보면 별빛이 간상체가 많은 곳에 떨어진다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **간상체**(rods): 망막에 약 1억 2천만 개. 약한 빛에 추상체보다 약 1,000배 민감하다. 어두울 때 보는 일(야간 시각)을 맡는다[^2].
- **추상체**(cones): 망막에 약 600만~700만 개. 빛의 파장에 따라 다르게 반응한다. 색을 구별하는 일(색 시각)을 맡는다[^2].

</div>


간상체가 추상체보다 약 17~20배 많다. 시세포 가운데 추상체는 약 5%뿐이다.

추상체는 가장 잘 반응하는 파장에 따라 세 종류다[^3].

| 종류 | 별명 | 가장 잘 반응하는 파장 | 추상체 중 비율 |
|---|---|---|---|
| L (long) | Red | 575 nm | 64% |
| M (middle) | Green | 535 nm | 32% |
| S (short) | Blue | 445 nm | 2% |

세 비율의 합은 98%다. 같은 숫자를 실은 HyperPhysics(조지아 주립대)도 "약 64%, 약 32%, 약 2%"라고 적어, 어림값끼리 더해 100%가 안 된 것이다[^s5]. 봉우리 파장은 자료마다 다르다. 예를 들어 미세분광 측정으로 널리 인용되는 값은 S 419 nm, M 531 nm, L 558 nm다[^s2]. 결론(L과 M은 가깝고 크게 겹치며, S는 멀리 떨어져 있다)은 어느 값을 써도 같다.

**중심와가 선명한 이유는 둘이다.** 첫째, 추상체가 가장 촘촘하다. 둘째, 수렴이 적다. 간상체는 여러 개가 신경절 세포 하나로 많이 모이고, 중심와의 추상체는 적게 모인다[^s3]. [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)에서 본 거래 그대로다. 간상체 쪽은 약한 빛을 모아 문턱을 넘지만 어디서 왔는지 흐려지고, 중심와 추상체는 위치를 지키지만 약한 빛에 약하다.

시세포 약 1억 2,600만 개의 신호가 시신경 섬유 약 100만 개로 나간다. 평균으로 섬유 하나에 시세포 약 126개가 모이는 셈이다[^s3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 간상체/추상체 비 17.1~20, 추상체 비율 4.8~5.5%, L+M+S = 98%, 섬유 하나당 약 126개 (산술로 확인됨) — [15_rods-and-cones_verify.py](/Hongs_Blog/studies/human-interface-media/code/15_rods-and-cones_verify/)</div>

</div>


## 활용

- 추상체가 세 종류라서 컬러 이미지가 R, G, B 세 채널이다. 자세한 이유는 [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)에 있다.
- 어두운 곳에서 색이 잘 안 보이는 이유: 추상체가 일하기에 빛이 모자라 간상체만 일하고, 간상체는 한 종류라 색을 구별하지 못한다[^s4].

## 연결

- 선수: [눈의 구조](/Hongs_Blog/studies/human-interface-media/eye-anatomy/) (중심와, 맹점), [뉴런과 신호 전달](/Hongs_Blog/studies/human-interface-media/neuron-signaling/) (수용기), [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)
- 추상체 세 종류로 색을 보는 원리: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"L 추상체는 빨간빛만, M 추상체는 초록빛만 감지한다"</div>

틀렸다. "Red cone", "Green cone"이라는 별명 때문에 색마다 전용 감지기가 있는 것처럼 들린다. 실제로 L과 M의 민감도 곡선은 크게 겹친다. 초록빛에도 L이 꽤 반응하고, L이 가장 잘 반응하는 파장(약 560~575 nm)은 빨강이 아니라 노랑-연두 쪽이다. 색은 어느 한 추상체가 켜지는 것이 아니라 세 추상체 반응의 비율로 정해진다. 확인 방법: 슬라이드 p.8의 민감도 그래프에서 Green과 Red 곡선이 대부분 겹친다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 간상체와 추상체를 수, 잘하는 일, 망막에서 많은 곳으로 비교하라.</summary>


**답:** 간상체: 약 1억 2천만 개, 약한 빛에 약 1,000배 민감(야간 시각), 색 구별 못 함, 중심와에는 없고 약 15~20° 둘레에 가장 많음. 추상체: 약 600만~700만 개, 파장 구별(색 시각), 밝은 빛 필요, 중심와에 가장 많음.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 밤하늘의 희미한 별이 똑바로 볼 때보다 살짝 옆을 볼 때 더 잘 보이는 이유는?</summary>


**답:** 똑바로 보면 별빛이 중심와에 맺히는데, 중심와에는 약한 빛에 둔한 추상체만 있고 간상체가 없다. 살짝 옆을 보면 별빛이 약한 빛에 민감한 간상체가 많은 곳(시선에서 약 15~20°)에 맺힌다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 중심와가 망막의 다른 곳보다 선명한 이유를 두 가지 쓰라. 둘째 이유는 뉴런 수렴의 어떤 성질과 이어지는가?</summary>


**답:** (1) 추상체가 가장 촘촘하다. (2) 수렴이 적어서 시세포 하나하나의 위치 정보가 보존된다. 수렴이 많으면 여러 신호가 합쳐져 어디서 왔는지 구별하지 못한다(해상도 손실).

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.7 (시세포의 분포). 표의 수치는 그래프에서 읽은 값이다.
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.6 (Anatomy of Retina)
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.8 (추상체). 슬라이드 제목의 "Cons"는 Cones의 오타로 보인다.
[^s1]: 에이전트 보충. 곁눈질로 희미한 별을 보는 예는 원본에 없다. 분포 그래프의 결과를 일상 사례로 보인 것이다.
[^s5]: 에이전트 보충. HyperPhysics의 Color Vision·Rods and Cones 페이지가 64/32/2%와 S 봉우리 약 445 nm를 적는다. 실제 비율은 사람마다 크게 다르고, S 추상체는 연구에 따라 전체의 5~10%로 보고된다 [확인필요].
[^s2]: 에이전트 보충. 419/531/558 nm는 Dartnall, Bowmaker & Mollon(1983)의 사람 추상체 측정값으로 지각 교재에 널리 실린다. 슬라이드의 값(445/535/575 nm)과 다르며, 이 지식베이스의 설명용 계산에서는 슬라이드 값을 쓴다.
[^s3]: 에이전트 보충. 간상체가 추상체보다 많이 수렴한다는 것은 표준 지각 교재(예: Goldstein, *Sensation and Perception*)의 설명이다. 시신경 섬유 약 100만 개는 표준 해부학 값이다.
[^s4]: 에이전트 보충. 어두운 곳의 색 소실(간상체 시각)은 표준 설명이다.
{% endraw %}
