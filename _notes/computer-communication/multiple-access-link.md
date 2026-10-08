---
layout: "note"
title: "다중 접근 링크"
display_title: "다중 접근 링크 (Multiple Access Link)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Multiple Access Link", "다중 접근", "multiple access", "공유 매체", "버스형 네트워크"]
description: "여러 기기가 선 하나를 함께 붙잡고 쓰는 연결이다. 한 강의실에서 한 사람이 말하면 모두가 듣는 것과 같다. 선은 하나면 된다. 대신 두 기기가 동시에 보내면 신호가 섞여 둘 다 못 쓰게 된다(동시성 문제)."
prev_url: "/studies/computer-communication/point-to-point-link/"
prev_title: "점대점 링크"
next_url: "/studies/computer-communication/switched-network/"
next_title: "스위칭 네트워크"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/multiple-access-link/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여러 기기가 선 하나를 함께 붙잡고 쓰는 연결이다. 한 강의실에서 한 사람이 말하면 모두가 듣는 것과 같다. 선은 하나면 된다. 대신 두 기기가 동시에 보내면 신호가 섞여 둘 다 못 쓰게 된다(동시성 문제).

</div>


## 예시로 보기

강의실에서 한 사람이 말하면 모두 듣는다. 특정인에게 말하려면 이름을 부른다. 두 사람이 동시에 말하면 둘 다 알아듣기 어렵다.

```
[A]   [B]   [C]   [D]
 |     |     |     |
─┴─────┴─────┴─────┴─   ← 공유 매체 (링크 1개)
```

네트워크로 옮기면 강의실 공기가 모두 함께 쓰는 선(공유 매체), 사람이 노드, 이름이 주소다. 두 사람이 동시에 말하는 것은 충돌이라 부른다. 비유가 맞지 않는 곳도 있다. 사람은 말이 겹쳐도 조금은 알아듣지만, 여기서는 신호가 겹치면 둘 다 못 쓴다고 본다.

노드 $$n$$개를 잇는 두 방법을 비교하면 다음과 같다.

| | 완전 연결 (점대점) | 다중 접근 버스 |
|---|---|---|
| 링크 수 | $$n(n-1)/2$$ | 1 |
| 노드당 연결 | 포트 $$n-1$$개 | 매체에 붙는 지점 1개 |
| 동시에 보낼 수 있는 쌍 | 여러 쌍 | 한 번에 하나 (단순 충돌 모델) |
| 받을 쪽 지정 | 필요 없음 (끝점이 둘뿐) | 필요함 (모두에게 닿으므로) |

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

아래 두 조건을 모두 갖춘 링크를 **다중 접근 링크**라 한다.
1. 노드가 2개 이상 붙어 있고, 붙는 노드 수가 처음부터 둘로 정해져 있지 않다.
2. 붙은 노드 하나가 보내면, 그 신호가 붙어 있는 모든 노드에 닿는다.

충돌은 가장 단순하게 이렇게 본다(단순 충돌 모델): 서로 다른 두 노드가 보내는 시간이 조금이라도 겹치면, 두 전송 모두 제대로 받지 못한다[^s1].

**기호로 쓰면.** 링크 $$e$$에 붙은 노드 집합을 $$V_e$$라 하자. $$e$$가 다중 접근 링크라는 것은 (1) $$\vert V_e\vert  \ge 2$$(붙은 노드가 2개 이상)이고 붙은 노드 수가 설계상 둘로 정해져 있지 않으며, (2) 어떤 $$v \in V_e$$(붙은 노드 하나)가 전송하면 그 신호가 $$V_e$$의 모든 노드에 닿는다는 뜻이다.

</div>


조건 2가 핵심이다. 모두에게 닿으니 선이 하나로 줄어든다. 그런데 바로 그 때문에 두 가지가 필요해진다. 누구에게 보내는지 가리키는 주소, 그리고 동시에 보내지 않게 하는 규칙이다.

그럼 받을 쪽이 아닌 기기에도 신호가 닿을 텐데, 그 기기는 어떻게 할까? 신호를 받아 주소를 보고, 자기 것이 아니면 버린다[^s3].

## 예제

- 다중 접근 링크인 것: 슬라이드 그림 (b)의 multiple access 네트워크[^2], 초기 이더넷의 동축 케이블 버스, 같은 무선 채널을 쓰는 와이파이 기기들[^s2]
- 아닌 것: [점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)(끝점이 둘로 정해짐), 오늘날의 스위치 이더넷(기기마다 스위치와 점대점으로 이어지고 스위치가 중계함)[^s2]

## 활용

- 점대점 완전 연결의 링크 폭증을 푼다. 대신 동시성 문제가 생긴다[^1].
- 누가 언제 보낼지 정하는 규칙을 매체 접근 제어(MAC)라 한다. 이더넷의 CSMA/CD, 와이파이의 CSMA/CA가 예다[^s2].

## 연결

- 선수: [점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)
- 이어지는 개념: [주소 지정](/Hongs_Blog/studies/computer-communication/addressing/)(받을 쪽 지정), [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/)(링크 하나를 나눠 쓰는 일반적인 방법)
- 같은 규모 문제를 [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/)는 중계로 푼다. 다중 접근은 매체를 공유해서 푼다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"기기 여럿이 한 줄에 연결되니 간접 연결이다"</div>

틀렸다. 여러 기기가 무언가 공통된 것을 거쳐 이어진 것처럼 보여서 그렇게 생각하기 쉽다. 실제로 기기들이 붙어 있는 것은 매체(선)일 뿐이다. 데이터를 받아 다시 보내 주는 중계 노드가 없으므로 직접 링크다[^1]. 슬라이드에서 (b)가 "연결: 직접 링크" 제목 아래에 있고, 간접 연결 슬라이드에만 스위치가 따로 그려져 있다[^2].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 다중 접근 링크를 정의하고, 이것이 해결하는 문제와 새로 만드는 문제를 하나씩 쓰라.</summary>


**답:** 여러 기기가 공유 매체 하나에 직접 붙어, 한 기기의 전송이 붙은 모두에게 닿는 링크다. 해결: 점대점 완전 연결의 링크 수 폭증($$n(n-1)/2$$ → 1). 새 문제: 동시에 보내면 신호가 섞이는 동시성(충돌) 문제.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 기기가 여럿 붙어 있는데도 다중 접근 링크를 "직접" 링크라고 부르는 이유는?</summary>


**답:** 기기들 사이에 데이터를 받아 다시 보내 주는 중계 노드(스위치)가 없고, 모두 매체에 직접 붙어 있기 때문이다.<br>
**흔한 오답:** "선 하나로 연결되어 있어서". 선의 개수가 아니라 중계 노드가 있는지가 기준이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 노드 10개를 (a) 완전 연결 (b) 다중 접근 버스로 이을 때 링크 수와, 서로 다른 두 쌍이 동시에 통신할 수 있는지를 비교하라.</summary>


**답:** (a) 링크 45개. 쌍마다 링크가 따로 있어 여러 쌍이 동시에 통신할 수 있다. (b) 링크 1개. 단순 충돌 모델에서는 한 번에 한 노드만 보낼 수 있다.

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: C3의 45 — [01_point-to-point-link_verify.py](/Hongs_Blog/studies/computer-communication/code/01_point-to-point-link_verify/)</div>

</div>


[^1]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 21~24행
[^2]: 4-1학기/pasted_images/Pasted image 20260924184222.png — 슬라이드 "연결: 직접 링크 (Direct Links)"의 (b) multiple access network
[^s1]: 에이전트 보충. 충돌 모델은 필기의 "동시성 문제"를 정식화한 것이다. 실제 매체에서는 신호 세기에 따라 한쪽이 수신되기도 하지만, 입문 모델은 둘 다 잃는다고 본다.
[^s2]: 에이전트 보충. 이더넷·와이파이 예와 MAC 규칙 이름은 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 2장(직접 연결 네트워크)의 내용이다.
[^s3]: 에이전트 보충. 공유 매체에서 각 기기가 받은 프레임의 목적지 주소를 보고 자기 것이 아니면 버리는 동작은 원본에 없다. 이더넷 같은 공유 매체 LAN의 일반 동작이다(Peterson & Davie, *Computer Networks: A Systems Approach*, 2장).
{% endraw %}
