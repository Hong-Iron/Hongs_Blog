---
layout: "note"
title: "인터네트워크"
display_title: "인터네트워크 (Internetwork)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-24"
status: "verified"
aliases: ["Internetwork", "인터네트워킹", "internetworking", "네트워크들의 네트워크", "network of networks", "라우터", "router", "게이트웨이", "gateway"]
description: "따로 만들어진 네트워크 여러 개를 다시 이어서 만든 더 큰 네트워크, 즉 \"네트워크들의 네트워크\"다. 학과 네트워크들을 잇고, 그것을 다시 통신사 네트워크에 잇는 식이다. 이미 있는 네트워크를 그대로 두고 규모를 얼마든지 키울 수 있다. 대신 네트워크마다 기술이 다를 수 있어서, …"
prev_url: "/studies/computer-communication/switched-network/"
prev_title: "스위칭 네트워크"
next_url: "/studies/computer-communication/rate-and-bandwidth/"
next_title: "전송 속도와 대역폭"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/internetwork/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

따로 만들어진 네트워크 여러 개를 다시 이어서 만든 더 큰 네트워크, 즉 "네트워크들의 네트워크"다. 학과 네트워크들을 잇고, 그것을 다시 통신사 네트워크에 잇는 식이다. 이미 있는 네트워크를 그대로 두고 규모를 얼마든지 키울 수 있다. 대신 네트워크마다 기술이 다를 수 있어서, 두 네트워크에 모두 붙은 장치가 그 사이를 이어 줘야 한다.

</div>


## 예시로 보기

슬라이드 그림에서 구름 하나가 네트워크 하나다. 구름 사이에 놓인 작은 상자는 두 구름에 동시에 붙어 있으므로 **라우터**(router, 예전 이름은 게이트웨이 gateway)다. 구름 하나에만 붙은 상자는 호스트다[^1][^s1].

구름 하나가 아래 정의의 $$G_i$$ 하나다. "두 구름에 동시에 붙은 상자"가 "둘 이상의 $$V_i$$에 속한 노드"가 된다. 각 구름 내부가 어떤 기술로 만들어졌는지는 버린다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

네트워크 $$G_1, \dots, G_k$$($$k \ge 2$$)가 있고, 각 $$G_i$$의 노드 집합을 $$V_i$$라 하자. 두 개 이상의 $$V_i$$에 속하는 노드를 **라우터**라 한다. 네트워크들과 라우터들이 이루는 전체를 **인터네트워크**라 한다. 서로 다른 네트워크에 있는 두 호스트는 라우터를 거쳐 통신한다.

</div>


[스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/)에서처럼 네트워크 하나를 링크 하나로 볼 수 있다. 그러면 인터네트워크는 구름들을 링크로 삼아 다시 만든 네트워크이고, 같은 방법을 되풀이해 계속 크게 만들 수 있다[^s1].

## 예제

- 해당하는 예: 인터넷, 학과 네트워크들을 라우터로 이은 캠퍼스 네트워크, 집 안 네트워크와 통신사 네트워크를 잇는 가정용 공유기[^s2]
- 해당하지 않는 예: 스위치 하나에 PC들이 붙은 사무실 네트워크 한 개(네트워크가 하나뿐), 두 PC를 직접 이은 [점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)

## 연결

- 선수: [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/)
- 이어지는 개념: 네트워크를 넘나드는 목적지를 가리키는 [주소 지정](/Hongs_Blog/studies/computer-communication/addressing/), 여러 네트워크를 건너는 경로를 정하는 [라우팅](/Hongs_Blog/studies/computer-communication/routing/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 인터네트워크를 정의하고, 네트워크끼리 잇는 노드의 이름을 쓰라.</summary>


**답:** 독립된 네트워크 여러 개를 이어 만든 "네트워크들의 네트워크"다. 둘 이상의 네트워크에 동시에 붙어 데이터를 넘겨 주는 노드를 라우터(예전 이름 게이트웨이)라 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 슬라이드의 구름 그림에서 라우터에 해당하는 상자를 어떻게 찾는가? 기준을 쓰라.</summary>


**답:** 두 구름(네트워크)에 동시에 선이 이어진 상자가 라우터다. 구름 하나에만 이어진 상자는 호스트다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 스위칭 네트워크와 인터네트워크는 각각 무엇과 무엇을 잇는가?</summary>


**답:** 스위칭 네트워크는 스위치로 호스트들을 잇는다. 인터네트워크는 라우터로 네트워크들을 잇는다.<br>
**흔한 오답:** "인터네트워크는 더 큰 스위칭 네트워크다". 크기가 아니라 잇는 대상이 네트워크라는 점이 다르다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260924190905.png — 슬라이드 "인터네트워킹(internetworks) ⇒ Network of Networks" (필기 29행에 삽입)
[^s1]: 에이전트 보충. 라우터·게이트웨이라는 이름과 재귀적 구성은 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절(연결성)의 설명이다.
[^s2]: 에이전트 보충. 예는 원본에 없다.
{% endraw %}
