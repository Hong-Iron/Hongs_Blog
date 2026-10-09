---
layout: "note"
title: "해상도와 공간 주파수"
display_title: "해상도와 공간 주파수 (Resolution and Spatial Frequency)"
kind: "concept"
kind_label: "정의"
num: "26"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Resolution", "해상도", "dpi", "dots per inch", "공간 주파수", "Spatial Frequency", "최대 공간 주파수", "저주파", "고주파", "윤곽선", "질감", "texture"]
description: "사진의 한 줄을 따라가며 밝기가 얼마나 자주 오르내리는지를 공간 주파수라 한다. 흐릿한 큰 모양은 천천히 바뀌고(낮은 주파수), 촘촘한 무늬와 결은 빠르게 바뀐다(높은 주파수). 해상도는 일정한 길이 안에 담을 수 있는 가장 빠른 변화로, 픽셀 N개로는 밝고 어두운 줄을 최대 N/…"
prev_url: "/studies/human-interface-media/digital-image/"
prev_title: "디지털 이미지"
next_url: "/studies/human-interface-media/two-dimensional-functions/"
next_title: "2차원 함수"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/resolution-spatial-frequency/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사진의 한 줄을 따라가며 밝기가 얼마나 자주 오르내리는지를 공간 주파수라 한다. 흐릿한 큰 모양은 천천히 바뀌고(낮은 주파수), 촘촘한 무늬와 결은 빠르게 바뀐다(높은 주파수). 해상도는 일정한 길이 안에 담을 수 있는 가장 빠른 변화로, 픽셀 N개로는 밝고 어두운 줄을 최대 N/2쌍까지만 그릴 수 있다. 다행히 사람은 낮은 주파수만 있어도 무엇인지 알아보므로, 데이터를 줄일 때는 높은 주파수부터 버린다.

</div>


## 예시로 보기

같은 장미 사진을 가로세로 1024픽셀에서 512, 256, …, 32로 반씩 줄이면 픽셀 수는 매번 1/4이 된다[^1]. 1024에서 32까지 가면 1/1024로 줄어든다. 그런 뒤 다시 같은 크기로 키워 보면, 픽셀이 적은 사진일수록 꽃잎의 결부터 사라지고 결국 덩어리진 네모만 남는다[^1].

그럼 데이터를 1/4로 줄여야 한다면 무엇을 버려야 할까? 슬라이드 p.10이 두 방법을 비교한다[^2].

| 남긴 것 | 결과 |
|---|---|
| 픽셀 25% (위쪽 부분만) | 아이 머리 윗부분만 보이고 나머지는 빈칸 |
| 픽셀 6.25% | 더 작은 조각만 남음 |
| 가장 낮은 주파수 25% | 조금 흐릿하지만 아이 얼굴 전체가 보임 |
| 가장 낮은 주파수 6.25% | 더 흐릿하지만 여전히 아이로 알아봄 |

같은 25%라도 낮은 주파수를 남기면 전체 모양이 살아남는다. 1차원으로 같은 실험을 하면 이렇다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/26_resolution-spatial-frequency_fig1.svg" alt="그림" loading="lazy">

회색 선이 원래 신호(표본 64개)다. 주황 선은 앞쪽 16개 표본만 남긴 것이라 나머지를 전혀 모른다. 파란 선은 가장 낮은 주파수 16개만 남겨 되살린 것인데 원래 신호와 거의 겹친다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **공간 주파수**: $$x$$축이나 $$y$$축 같은 한 줄(스캔 라인)을 따라 밝기가 바뀌는 빠르기다. 주기는 시간이 아니라 거리(길이)로 재고, 주파수는 단위 거리마다 밝기가 바뀌는 횟수다[^3].
- **해상도**: 단위 거리에 나타낼 수 있는 최대 공간 주파수다[^3].

</div>


디지털 이미지에서는 거리를 픽셀 개수로 잰다. 공간 주파수는 "픽셀 $$N$$개에 밝기가 몇 번 오르내리는가"이고, 가로·세로·대각선 어느 방향으로도 잴 수 있다[^4]. 밝은 줄 하나와 어두운 줄 하나, 곧 한 주기를 그리려면 픽셀이 적어도 2개 필요하다. 그래서

$$ \text{최대 공간 주파수} = \frac{N}{2}\ \text{주기 (픽셀 } N\text{개당)} $$


이다[^4]. 8픽셀이면 0, 255, 0, 255, …로 4주기가 한계다. 더 빠른 무늬를 픽셀마다 재면 느린 무늬로 둔갑한다. 예를 들어 픽셀당 0.6주기인 줄무늬를 재면 픽셀당 0.4주기 줄무늬와 똑같은 값이 나온다. 신호 쪽에서는 이것을 에일리어싱이라 부른다([표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/))[^s2].

**dpi(dot per inch).** 화면 크기가 정해져 있으면 단위 면적당 픽셀 수가 해상도를 정한다. 1인치에 몇 점을 찍는지를 dpi로 적는다. 슬라이드는 1250, 200, 150, 72 dpi를 예로 든다[^5]. 폭 4인치 그림이면 72 dpi로 288픽셀, 1250 dpi로 5000픽셀이다.

어? 카메라가 물체에 다가가면 해상도는 어떻게 될까? 센서의 픽셀 수는 그대로지만, 물체의 같은 길이에 더 많은 픽셀이 들어간다. 그래서 그 물체에 대해서는 더 높은 공간 주파수, 곧 더 작은 결까지 담는다. 대신 화면에 들어오는 범위가 좁아진다[^5][^s3].

**사람이 쓰는 정보.** 강의는 지각되는 정보를 공간 주파수의 분포(스펙트럼)로 정리한다[^6].

| 주파수 | 담긴 정보 |
|---|---|
| 낮은 쪽 | 물체의 대략적인 모양과 윤곽(무엇이 어디에 있는가) |
| 높은 쪽 | 물체 표면의 질감(결, 털, 잔무늬) |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: N픽셀의 최대 N/2주기, 0.6 → 0.4 cycle/pixel 둔갑, dpi 계산, 반씩 줄일 때 픽셀 수 1/4, 1차원 25% 실험(낮은 주파수 쪽 오차 < 0.01, 픽셀 쪽 > 0.3) (실험으로 확인됨) — [26_resolution-spatial-frequency_verify.py](/Hongs_Blog/studies/human-interface-media/code/26_resolution-spatial-frequency_verify/)</div>

</div>


## 활용

- JPEG 같은 압축은 영상을 공간 주파수로 나눈 뒤 높은 주파수를 거칠게 적거나 버린다. 사람이 대략의 모양을 낮은 주파수에서 읽기 때문에 크게 줄여도 알아본다[^s4].
- 흐리게 하기(평균 필터)는 높은 공간 주파수를 줄이는 일이다. 창이 클수록 더 낮은 주파수까지 지운다: [2차원 합성곱](/Hongs_Blog/studies/human-interface-media/two-dimensional-convolution/).
- 흔한 실수: dpi를 영상 자체의 성질로 아는 것. 픽셀 수가 같은 영상도 출력 크기에 따라 dpi가 달라진다.

## 연결

- 선수: [디지털 이미지](/Hongs_Blog/studies/human-interface-media/digital-image/), [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (공간 주파수의 단위 cycle/m)
- 같은 한계를 시간 신호에서: [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"윤곽선은 낮은 주파수에만 있다"</div>

반만 맞다. 강의 요약은 윤곽선 정보를 저주파 영역에 둔다[^6]. 이것은 "물체가 대략 어떤 모양으로 어디 있는가"를 낮은 주파수만으로 알 수 있다는 뜻이다. 그러나 날카롭게 딱 끊기는 경계를 그리려면 높은 주파수도 필요하다. 확인 방법: 낮은 주파수 6.25%만 남긴 사진(p.10의 d)은 아이를 알아볼 수 있지만 머리카락과 얼굴의 경계가 흐릿하다. 모양은 남고 선명함은 사라진다[^s5].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 공간 주파수와 해상도를 정의하고, 디지털 이미지에서 픽셀 N개의 최대 공간 주파수를 쓰라.</summary>


**답:** 공간 주파수는 한 줄을 따라 단위 거리마다 밝기가 바뀌는 횟수다. 해상도는 단위 거리에 나타낼 수 있는 최대 공간 주파수다. 픽셀 $$N$$개로는 최대 $$N/2$$주기다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 최대 공간 주파수가 왜 N이 아니라 N/2인지 이유를 대라.</summary>


**답:** 한 주기는 밝은 줄 하나와 어두운 줄 하나다. 한 픽셀은 값 하나만 가지므로 한 주기를 그리려면 픽셀이 적어도 2개 필요하다. 그래서 $$N$$개로는 $$N/2$$주기가 한계다. 더 빠른 무늬는 픽셀마다 재면 느린 무늬로 둔갑한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 데이터를 25%만 남겨야 한다. (가) 픽셀 25%를 남기기 (나) 가장 낮은 주파수 25%를 남기기 중 사람이 그림을 알아보기에 나은 것은? 다른 쪽이 왜 나쁜지도 쓰라.</summary>


**답:** (나). 낮은 주파수에 전체 모양이 담겨 있어 조금 흐려질 뿐 전체가 남는다. (가)는 남긴 부분은 선명하지만 버린 75%는 아무 정보가 없어 그림 대부분이 사라진다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/05.HIM_강의05_이미지의표현.pdf, p.5 (해상도: 1024, 512, 256, 128, 64, 32 크기의 장미와 같은 크기로 키운 여섯 장)
[^2]: 같은 자료, p.10 (시지각에 필요한 데이터 양: a) 25% of data in pixel format, b) 6.25%, c) 25% of lowest frequency data, d) 6.25%)
[^3]: 같은 자료, p.11 (공간 주파수: 스캔 라인을 따라 일어나는 밝기 변화, 주기는 거리, 주파수는 단위 거리당 밝기가 변하는 횟수, 해상도는 단위 거리당 나타낼 수 있는 최대 공간 주파수)
[^4]: 같은 자료, p.12 (디지털 이미지의 공간 주파수: 거리는 픽셀의 개수, 픽셀 N개당 밝기 변화, 최대 공간 주파수 N/2)
[^5]: 같은 자료, p.6 (해상도: 화면 크기가 일정하면 단위 면적당 화소 수, dpi 1250, 200, 150, 72, 줌인/아웃 시 해상도는?)
[^6]: 같은 자료, p.17 (요약: 지각되는 정보는 공간 주파수의 스펙트럼, 윤곽선은 저주파, 질감은 고주파)
[^s1]: 에이전트 보충. 그림 1장은 원본 p.10의 실험을 1차원 신호로 다시 한 것이다. [26_resolution-spatial-frequency_plot.py](/Hongs_Blog/studies/human-interface-media/code/26_resolution-spatial-frequency_plot/)로 그렸고, 두 방법의 복원 오차를 같은 코드로 확인했다.
[^s2]: 에이전트 보충. 0.6 → 0.4 cycle/pixel 예와 에일리어싱 연결은 원본에 없다. 표본화 정리의 표준 내용이다.
[^s3]: 에이전트 보충. 슬라이드는 줌인/아웃 때 해상도가 어떻게 되는지 질문만 던진다. 답은 위의 추론이다.
[^s4]: 에이전트 보충. JPEG의 원리는 이산 코사인 변환 계수를 양자화해 높은 주파수를 거칠게 적는 것이다(강의 계획표 14주차).
[^s5]: 에이전트 보충. "윤곽선은 저주파"라는 요약을 대략의 모양과 날카로운 경계로 나눠 해석했다. 날카로운 경계(계단)가 높은 주파수 성분을 가진다는 것은 푸리에 급수의 표준 결과다([푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/)).
{% endraw %}
