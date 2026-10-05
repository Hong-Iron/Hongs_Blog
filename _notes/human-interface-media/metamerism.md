---
layout: "note"
title: "조건등색"
display_title: "조건등색 (Metamerism)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
updated: "2026-09-25"
status: "verified"
aliases: ["Metamerism", "메타머리즘", "메타머", "metamer", "조건등색쌍", "점묘법", "pointillism", "가법 혼색"]
description: "재료가 다른 두 요리가 혀에는 같은 맛으로 느껴지는 것과 같다. 스펙트럼이 전혀 다른 두 빛도 세 추상체에 같은 반응을 만들면 똑같은 색으로 보인다. 덕분에 모니터는 빛 세 가지로 수많은 색을 흉내 낸다. 반대로, 가게 조명에서 같아 보이던 두 옷감이 햇빛 아래서 달라 보이는 문제…"
prev_url: "/studies/human-interface-media/trichromatic-theory/"
prev_title: "삼색 이론"
next_url: "/studies/human-interface-media/lateral-inhibition/"
next_title: "측면 억제"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/metamerism/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

재료가 다른 두 요리가 혀에는 같은 맛으로 느껴지는 것과 같다. 스펙트럼이 전혀 다른 두 빛도 세 추상체에 같은 반응을 만들면 똑같은 색으로 보인다. 덕분에 모니터는 빛 세 가지로 수많은 색을 흉내 낸다. 반대로, 가게 조명에서 같아 보이던 두 옷감이 햇빛 아래서 달라 보이는 문제도 여기서 생긴다.

</div>


## 예시로 보기

슬라이드 p.10 오른쪽 그림에서, 530 nm와 620 nm 빛을 섞은 빛과 580 nm 단색광이 세 추상체에 같은 반응을 만든다. 두 경우 모두 S 1.0, M 5.0, L 8.0이고, 둘 다 노랑으로 보인다[^1].

| 빛 | 스펙트럼 | S | M | L | 보이는 색 |
|---|---|---|---|---|---|
| 섞은 빛 | 530 nm + 620 nm 두 봉우리 | 1.0 | 5.0 | 8.0 | 노랑 |
| 단색광 | 580 nm 한 봉우리 | 1.0 | 5.0 | 8.0 | 노랑 |

슬라이드 수치는 설명을 위해 딱 맞춘 값이다. 가우스 모형으로 계산하면 530 nm × 0.40 + 620 nm × 1.24로 M과 L은 정확히 맞고 S가 0.007 어긋난다. S가 이 파장대에서 거의 반응하지 않아 사실상 같다[^s1].

**점묘법.** 쇠라(Seurat)의 "그랑드 자트섬의 일요일 오후"(1884~1886)는 작은 색 점을 촘촘히 찍어 그렸다[^2]. 확대하면 서로 다른 색 점이 따로 보이지만, 멀리서 보면 점들이 섞여 중간색으로 보인다. 눈이 이웃한 점을 구별하지 못할 만큼 멀어지면, 망막의 한 자리에 여러 색 점의 빛이 함께 들어와 반응이 더해진다. 섞인 반응과 같은 반응을 내는 색이 보인다[^s2]. 모니터의 부화소도 같은 원리다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**조건등색**(metamerism): 물리적으로 다른 두 자극이 지각적으로 같은 현상[^1]. 두 빛 $$i_1 \neq i_2$$가 세 추상체 반응 $$r_S, r_M, r_L$$이 모두 같으면 서로 조건등색(메타머, metamer)이다.

</div>


스펙트럼을 400~700 nm에서 10 nm 간격 31칸의 세기 벡터 $$\mathbf{i} \in \mathbb{R}^{31}$$로 나누어 보자. 추상체 반응은 $$3 \times 31$$ 행렬 $$C$$를 곱한 $$\mathbf{r} = C\mathbf{i}$$다([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 적분식을 칸으로 나눈 것)[^s3].

$$
\mathbf{i}_1, \mathbf{i}_2 \text{가 조건등색} \iff C(\mathbf{i}_1 - \mathbf{i}_2) = \mathbf{0} \iff \mathbf{i}_1 - \mathbf{i}_2 \in \operatorname{null}(C)
$$


$$C$$의 계수(rank)가 3이면 영공간(null space)은 $$31 - 3 = 28$$차원이다. 스펙트럼의 31가지 방향 가운데 28가지는 눈에 보이지 않는다는 뜻이다. 어떤 빛에 영공간 방향의 변화를 더해도, 세기가 어디서도 음수가 되지 않는 한 같은 색으로 보인다. 칸을 더 잘게 나눌수록 영공간은 더 커진다. 조건등색은 드문 예외가 아니라 흔한 일이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 가우스 모형의 31칸 행렬에서 흰빛(모든 칸 1)과, 영공간 벡터를 더해 칸마다 최대 2.02까지 다른 스펙트럼이 세 반응이 같음(오차 $$10^{-9}$$ 이내), 530+620 혼합의 M·L 일치와 S 차이 0.007 (실험으로 확인됨) — [17_metamerism_verify.py](/Hongs_Blog/studies/human-interface-media/code/17_metamerism_verify/)</div>


계산 연습: [조건등색 예제 사다리](/Hongs_Blog/studies/human-interface-media/metamerism-ladder/)

</div>


## 활용

- 디스플레이: 화면은 R·G·B 세 스펙트럼만 내면서 사람이 보는 색 대부분을 흉내 낸다. 조건등색이 없다면 색마다 그 스펙트럼을 그대로 재현해야 한다[^s4].
- 인쇄와 섬유: 조명이 바뀌면 반사된 빛의 스펙트럼이 바뀐다. 한 조명에서 조건등색이던 두 물감이 다른 조명에서는 달라 보일 수 있다(조명 조건등색). 옷감이나 페인트 색을 맞출 때 "자연광에서 다시 확인하라"는 이유다[^s4].
- 카메라: 센서의 세 필터 곡선이 사람 추상체 곡선과 다르면, 사람에게 같은 두 색을 카메라는 다르게(또는 반대로) 찍는다[^s4].
- 색 공간: 조건등색인 빛들을 한 점으로 모은 것이 색 공간의 좌표다. 강의 계획표 5주차 CIE XYZ가 이 좌표를 표준으로 정한다[^3].

## 연결

- 선수: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)
- 수많은 입력이 적은 수의 출력으로 모이며 정보가 사라지는 구조는 [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)과 같다. 수렴에서는 위치가, 조건등색에서는 스펙트럼의 모양이 사라진다.
- 선형 사상 $$C\mathbf{i}$$의 영공간이라는 관점은 [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)의 $$A\mathbf{x}$$와 같은 선형대수다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"똑같은 색으로 보이면 똑같은 빛이다"</div>

틀렸다. 우리가 색으로 빛을 구별하므로 색이 같으면 빛도 같다고 느끼기 쉽다. 눈은 스펙트럼 전체가 아니라 세 추상체 반응만 받아서, 스펙트럼이 달라도 세 반응이 같으면 구별하지 못한다. 확인 방법: 580 nm 단색광과 530 nm + 620 nm 혼합광은 둘 다 노랑이지만, 분광기로 보면 봉우리가 하나와 둘로 다르다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 조건등색을 정의하고, 슬라이드의 예를 추상체 반응 수치와 함께 쓰라.</summary>


**답:** 물리적으로 다른(스펙트럼이 다른) 두 자극이 지각적으로 같은(같은 색으로 보이는) 현상. 530 nm + 620 nm 혼합광과 580 nm 단색광이 모두 S 1.0, M 5.0, L 8.0을 만들어 둘 다 노랑으로 보인다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 조건등색이 드문 예외가 아니라 흔한 이유를 스펙트럼의 칸 수와 추상체의 수로 설명하라.</summary>


**답:** 스펙트럼은 파장마다 값이 있어서 칸으로 나누면 수십 개 이상의 숫자인데, 눈은 이를 세 숫자(추상체 반응)로 줄인다. 31칸이면 $$3 \times 31$$ 행렬의 영공간이 28차원이다. 그 28가지 방향의 변화는 반응을 바꾸지 않으므로, 한 빛과 같은 색으로 보이는 다른 빛이 아주 많다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 모니터로 노란 꽃 사진을 볼 때 눈에 들어오는 빛에 580 nm 성분이 있는가? 쇠라의 점묘화를 멀리서 볼 때 점들의 색이 섞여 보이는 이유와 같은 원리로 설명하라.</summary>


**답:** 거의 없다. 모니터는 빨강·초록 부화소를 켜서 580 nm 빛과 같은 추상체 반응을 만든다. 점묘화도 마찬가지로, 멀리서는 눈이 이웃한 색 점을 구별하지 못해 여러 점의 빛이 한 자리에서 더해진다. 둘 다 스펙트럼이 달라도 세 추상체 반응이 같으면 같은 색으로 보인다는 조건등색이다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.10 ("Metamerism"이 굵은 글씨, 오른쪽 그림의 530+620과 580). 영어 정의를 우리말로 옮겼다.
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/03.HIM_강의03_사람의시각.pdf, p.9 (점묘법 이미지)
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Lecture Calendar 5주차
[^s1]: 에이전트 보충. 가우스 모형(봉우리 S 445, M 535, L 575 nm, 폭 30·45·45 nm 가정)의 계산값이다. [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 예제와 같은 모형이다.
[^s2]: 에이전트 보충. 점묘법을 공간적 혼색과 조건등색으로 설명한 것은 해석이다. 슬라이드는 그림과 확대 부분만 보여 준다.
[^s3]: 에이전트 보충. 행렬 $$C$$와 영공간으로 조건등색을 설명하는 것은 색채학의 표준 관점이며 슬라이드에는 없다.
[^s4]: 에이전트 보충. 디스플레이, 조명 조건등색, 카메라 사례는 색채 공학의 표준 사례다.
{% endraw %}
