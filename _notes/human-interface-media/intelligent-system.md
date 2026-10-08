---
layout: "note"
title: "지능 시스템"
display_title: "지능 시스템 (Intelligent System)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-09-25"
status: "verified"
aliases: ["Intelligent System", "인공지능", "AI", "사람처럼", "이성적인"]
description: "어떤 기계를 \"똑똑하다\"고 부를지는 채점 기준에 따라 달라진다. 기준은 두 질문으로 나뉜다. 사람처럼 하느냐 올바르게(이성적으로) 하느냐, 그리고 속의 생각을 보느냐 겉의 행동을 보느냐. 기준을 먼저 정하지 않으면 \"이 기계에 지능이 있는가\"라는 논쟁은 끝나지 않는다."
prev_url: "/studies/human-interface-media/perception/"
prev_title: "지각"
next_url: "/studies/human-interface-media/neuron-signaling/"
next_title: "뉴런과 신호 전달"
math: false
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/intelligent-system/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

어떤 기계를 "똑똑하다"고 부를지는 채점 기준에 따라 달라진다. 기준은 두 질문으로 나뉜다. 사람처럼 하느냐 올바르게(이성적으로) 하느냐, 그리고 속의 생각을 보느냐 겉의 행동을 보느냐. 기준을 먼저 정하지 않으면 "이 기계에 지능이 있는가"라는 논쟁은 끝나지 않는다.

</div>


## 예시로 보기

슬라이드는 빈칸 문장을 던진다. "어떤 시스템이 ____을(를) 할 수 있다면 지능 시스템이라고 할 수 있다." 후보는 판단, 학습, 게임, 말, 실수다[^1].

마지막 후보 "실수"가 기준에 따라 답이 갈리는 예다. 사람처럼 하는 것이 기준이면 실수도 지능의 표시다. 사람은 실수하기 때문이다. 이성적으로 하는 것이 기준이면 실수는 지능이 모자란 표시다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

슬라이드는 지능을 두 축으로 나눈다[^1].
- 판단의 성질: **사람처럼** ↔ **이성적인**
- 상호 작용: **생각** ↔ **행동**

</div>


두 축을 겹치면 네 칸이 생긴다. 이 네 칸은 인공지능 교과서가 인공지능을 정의하는 네 접근과 같다[^s2].

| | 생각 | 행동 |
|---|---|---|
| **사람처럼** | 사람의 사고 과정을 흉내 낸다 (인지 모델링) | 사람과 구별되지 않게 행동한다 (튜링 테스트) |
| **이성적인** | 논리적으로 옳게 추론한다 (사고의 법칙) | 목표를 가장 잘 이루도록 행동한다 (합리적 에이전트) |

강의 2 p.3은 인공지능의 방향을 "궁극적으로 사람처럼"이라고 적는다[^2]. 교과서마다 강조점이 다르다. Russell & Norvig의 교과서는 네 칸 중 합리적 에이전트를 중심에 둔다[^s2].

## 뉴런 모형과 인공지능

이 과목의 뉴런 모형은 인공지능의 한 줄기와 곧바로 이어진다. 교수님은 뉴런의 연산 모형을 퍼셉트론 같은 모델과 함께 설명했다[^4]. 지능을 만드는 길은 크게 둘로 나뉜다[^s3].

| | 기호주의 (symbolic AI) | 연결주의 (connectionism) |
|---|---|---|
| 지식을 담는 곳 | 사람이 쓴 규칙과 기호 | 단순한 단위(뉴런) 사이 연결의 세기(가중치) |
| 배우는 방법 | 규칙을 사람이 넣는다 | 데이터로 가중치를 고친다 |
| 이 과목과의 연결 | — | [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/), [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/) |

연결주의는 뇌의 구조를 본떴다는 점에서 "사람처럼 생각" 칸에 뿌리가 있다. 하지만 학습은 "틀린 횟수(오차)를 줄인다"는 "이성적으로 행동"의 기준으로 한다. 한 시스템이 두 칸에 걸칠 수 있다는 예다. 연표는 [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/)에 있다.

## 연결

- 선수: [휴먼 인터페이스 미디어](/Hongs_Blog/studies/human-interface-media/human-interface-media/) (사람의 입력·출력)
- 사람의 처리 수준(지각 → 추론): [지각](/Hongs_Blog/studies/human-interface-media/perception/)
- 뉴런을 계산으로 흉내 내는 첫걸음: [뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)
- 이 주제의 본격적인 내용은 패턴 인식, 머신러닝, 인공지능 과목이 다룬다[^3].

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 슬라이드가 지능을 나누는 두 축을 쓰고, 두 축이 만드는 네 칸을 채우라.</summary>


**답:** 판단의 성질(사람처럼 ↔ 이성적인)과 상호 작용(생각 ↔ 행동). 네 칸은 사람처럼 생각, 사람처럼 행동, 이성적으로 생각, 이성적으로 행동이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음 시스템은 네 칸 중 어디에 가장 가까운가? (a) 사람과 채팅해 상대가 기계인지 모르게 만드는 챗봇 (b) 사람이 문제를 풀 때 머릿속 단계를 그대로 재현하는 모형 (c) 주어진 공리에서 정리를 증명하는 프로그램 (d) 도착 시간과 안전을 최대로 하도록 운전하는 자율주행차. 또 "실수"를 지능의 표시로 보는 칸은 어느 쪽인가?</summary>


**답:** (a) 사람처럼 행동 (b) 사람처럼 생각 (c) 이성적으로 생각 (d) 이성적으로 행동. 실수를 지능의 표시로 보는 것은 "사람처럼" 쪽이다.<br>
**이유:** (a)는 겉으로 드러난 행동이 사람과 같은지만 본다. (d)는 사람과 같은지가 아니라 목표에 비춰 가장 좋은 행동인지를 본다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.4
[^2]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.3
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_강의00-강의소개.pdf, p.7
[^4]: 사용자 전달(2026-09-25): 교수님이 강의에서 퍼셉트론 등의 모델을 함께 설명했다.
[^s1]: 에이전트 보충. "실수"에 대한 해석은 원본에 없다. 슬라이드의 후보 목록과 두 축을 이어 본 것이다.
[^s2]: 에이전트 보충. 네 칸의 이름(인지 모델링, 튜링 테스트, 사고의 법칙, 합리적 에이전트)과 교과서의 강조점은 Russell & Norvig, *Artificial Intelligence: A Modern Approach*, 1장의 분류다.
[^s3]: 에이전트 보충. 기호주의와 연결주의의 구분은 인공지능 교과서의 표준 구분이다. 두 칸에 걸친다는 해석은 원본에 없다.
{% endraw %}
