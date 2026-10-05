---
layout: "note"
title: "휴먼 인터페이스 미디어"
display_title: "휴먼 인터페이스 미디어 (Human Interface Media)"
kind: "concept"
kind_label: "모델"
num: "01"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "4-1학기"
updated: "2026-09-25"
status: "verified"
aliases: ["Human Interface Media", "HIM", "인터페이스", "interface", "인터페이스 미디어", "사람의 정보 처리"]
description: "사람과 컴퓨터 사이의 통역사다. 사람은 빛·소리 같은 자극을 감각으로 받고 근육의 움직임으로 표현하지만, 컴퓨터는 수치와 코드만 다룬다. 그래서 자극을 데이터로, 데이터를 다시 자극으로 바꾸는 매체가 가운데에 있어야 한다. 이 과목은 그중 시각과 청각을 다루며, 사람 감각의 한계가…"
next_url: "/studies/human-interface-media/perception/"
next_title: "지각"
math: false
mermaid: true
code_count: 0
permalink: "/studies/human-interface-media/human-interface-media/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사람과 컴퓨터 사이의 통역사다. 사람은 빛·소리 같은 자극을 감각으로 받고 근육의 움직임으로 표현하지만, 컴퓨터는 수치와 코드만 다룬다. 그래서 자극을 데이터로, 데이터를 다시 자극으로 바꾸는 매체가 가운데에 있어야 한다. 이 과목은 그중 시각과 청각을 다루며, 사람 감각의 한계가 곧 매체를 설계하는 기준이 된다.

</div>


## 예시로 보기

영상 통화를 떠올리면 된다. 상대 얼굴에서 반사된 빛을 카메라가 받아 위치별 밝기 숫자로 바꾼다. 컴퓨터는 그 숫자를 보내고 저장한다. 내 쪽 모니터가 숫자를 다시 빛으로 바꿔 내 눈에 보낸다. 목소리도 마이크와 스피커를 거쳐 같은 길을 오간다[^s1].

```mermaid
graph LR
  H["사람<br/>시각·청각·후각·미각·촉각"] <--> M["인터페이스 미디어"]
  M <--> C["컴퓨터 장치<br/>수치와 코드"]
```

그림의 화살표는 양방향이다[^1]. 카메라·마이크는 사람에서 컴퓨터로, 모니터·스피커는 컴퓨터에서 사람으로 가는 쪽이다. 추상화하면서 장치의 종류는 버리고 "자극 ↔ 데이터 변환"이라는 역할만 남긴다.

인터페이스(interface)는 inter-face, 곧 "얼굴과 얼굴 사이"다[^2]. 사람과 사람 사이에서는 같은 감각을 쓰므로 공기와 빛만 있으면 된다. 사람과 컴퓨터 사이에서는 한쪽이 파동을, 다른 쪽이 숫자를 쓰므로 변환이 따로 필요하다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**휴먼 인터페이스 미디어**는 사람과 컴퓨터가 의사를 주고받는 수단이다[^1]. 사람 쪽의 감각 자극(시각·청각·후각·미각·촉각)과 컴퓨터 쪽의 수치·코드를 서로 바꿔 준다.

</div>


사람이 정보를 주고받는 방식은 다음과 같다[^3].

| 방향 | 수단 | 내용 |
|---|---|---|
| 받아들이기 | 5감 | 시각, 청각, 후각, 미각, 촉각 |
| | "6감" | 뇌가 감각 정보를 재구성하고 확대한다 |
| 내보내기 | 근육의 움직임 | 환경에는 활동으로 작용한다 |
| | 언어 | 머릿속 생각과 의지를 드러낸다. 말·문자는 이성적 활동의 결과, 음악·회화·조각은 감성적 활동의 결과다 |

슬라이드는 사람 사이의 인터페이스를 세 질문으로 묻는다: 어떤 감각을 쓰는가, 감각하는 자극의 실체는 무엇인가, 자극의 범위는 어디까지인가[^2]. 시각에 대한 답이 3회의 내용이다. 감각은 눈, 자극의 실체는 빛(파동), 범위는 가시광 400~700 nm다[^s2].

## 활용

과목이 다루는 범위는 두 갈래다[^4].

| 갈래 | 시각 | 청각 |
|---|---|---|
| 사람 감각의 특성 | 눈, 밝기, 색채, 깊이 | 귀, 주파수 대역, 음량, 음색 |
| 자극을 데이터로 바꾸기 | 색채, 이미지, 물체 지각 | 소리, 샘플링, 소리 지각 |

두 갈래를 잇는 공통 도구가 파동과 그 수학적 표현이다. 강의 계획표의 11~14주차(푸리에 급수·변환, 이산 푸리에 변환, 이산 코사인 변환)가 여기에 해당한다[^5].

시각 쪽 "사람 감각의 특성" 네 항목은 이 과목의 개념 문서와 이렇게 대응한다[^s3].

| 항목 | 개념 문서 |
|---|---|
| 눈 | [눈의 구조](/Hongs_Blog/studies/human-interface-media/eye-anatomy/), [간상체와 추상체](/Hongs_Blog/studies/human-interface-media/rods-and-cones/) |
| 밝기 | [휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/), [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/) |
| 색채 | [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/), [조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/), [반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/) |
| 깊이 | [양안 시차](/Hongs_Blog/studies/human-interface-media/binocular-disparity/) |

사람 감각이 느끼지 못하는 부분은 데이터에서 버려도 된다. 강의 계획서는 이 원리를 쓰는 압축 알고리즘을 과목 내용에 넣었다[^5]. JPEG 이미지 압축과 MP3 음성 압축이 대표적인 예다[^s4].

사람이 정보를 처리하는 방법 자체(지각, 인식, 재인, 추론)는 이 과목에서 깊이 다루지 않는다. 패턴 인식, 머신러닝, 인공지능 과목의 몫이다[^6].

## 연결

- 다음 개념: [지각](/Hongs_Blog/studies/human-interface-media/perception/) (사람 쪽 처리), [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (자극의 실체)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"휴먼 인터페이스는 버튼과 메뉴를 배치하는 화면 설계(UI)다"</div>

이 과목에서는 틀린 이해다. 이름에 "인터페이스"가 들어가서 화면 설계 과목처럼 들린다. 실제로 이 과목은 그보다 아래층을 다룬다. 빛·소리라는 자극이 숫자로, 숫자가 다시 자극으로 바뀌는 과정과, 그 변환의 기준이 되는 사람 감각의 특성이다. 강의 계획표를 보면 확인된다. 15주 중 화면 설계를 다루는 주는 없고, 시각·청각·색 공간·푸리에 변환이 채운다[^5].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 휴먼 인터페이스 미디어의 그림을 세 요소와 화살표 방향까지 그리고, 가운데 매체가 하는 일을 한 문장으로 쓰라.</summary>


**답:** 사람(시각·청각·후각·미각·촉각) ↔ 인터페이스 미디어 ↔ 컴퓨터 장치(수치와 코드). 화살표는 양방향이다. 매체는 사람의 감각 자극과 컴퓨터의 수치·코드를 서로 바꿔 준다.  
**흔한 오답:** 화살표를 한 방향(사람 → 컴퓨터)으로만 그린다. 모니터·스피커처럼 컴퓨터가 사람에게 자극을 만들어 주는 방향도 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 사람과 사람 사이에는 따로 변환 장치가 없어도 되는데, 사람과 컴퓨터 사이에는 인터페이스 미디어가 꼭 필요한 이유는?</summary>


**답:** 사람끼리는 같은 감각과 표현 수단(빛, 소리, 근육)을 쓰므로 자극을 그대로 주고받으면 된다. 컴퓨터는 수치와 코드만 다루고 사람은 파동 같은 물리 자극만 감각한다. 두 쪽의 "언어"가 달라서 자극 ↔ 데이터 변환이 필요하다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 장치를 방향(사람 → 컴퓨터 / 컴퓨터 → 사람)과 관련 감각으로 분류하라: 마이크, 모니터, 스피커, 카메라, 휴대폰 진동 모터.</summary>


**답:** 사람 → 컴퓨터: 마이크(청각 자극을 데이터로), 카메라(시각 자극을 데이터로). 컴퓨터 → 사람: 모니터(시각), 스피커(청각), 진동 모터(촉각).  
**이유:** 방향은 "자극을 받아 숫자로 바꾸는가, 숫자를 받아 자극을 만드는가"로 가른다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/01.HIM_강의01-들어가기.pdf, p.6. 같은 그림이 00. HIM_강의00-강의소개.pdf, p.4에도 있다.
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/01.HIM_강의01-들어가기.pdf, p.5 (00. HIM_강의00-강의소개.pdf, p.3과 같음)
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/01.HIM_강의01-들어가기.pdf, p.2~4. 02.HIM_강의02_사람의지각.pdf, p.3, p.16에서 다시 나온다.
[^4]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/01.HIM_강의01-들어가기.pdf, p.7 (00. HIM_강의00-강의소개.pdf, p.5와 같음)
[^5]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Course Description, Lecture Calendar
[^6]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_강의00-강의소개.pdf, p.7
[^s1]: 에이전트 보충. 영상 통화 예시는 원본에 없다. 그림의 양방향 화살표를 구체 사례로 보이려고 넣었다.
[^s2]: 에이전트 보충. 세 질문과 3회 내용의 대응은 해석이다. 가시광 범위는 03.HIM_강의03_사람의시각.pdf, p.4의 그림에서 읽었다.
[^s3]: 에이전트 보충. 항목과 개념 문서의 대응표는 이 지식베이스의 정리 방식이다.
[^s4]: 에이전트 보충. JPEG은 사람 눈이 둔한 고주파 성분을 거칠게 양자화하고, MP3는 들리지 않는(가려지는) 소리 성분을 줄인다. 두 방식의 수학 도구(이산 코사인 변환, 주파수 분해)는 강의 계획표 11~14주차 주제와 겹친다.
{% endraw %}
