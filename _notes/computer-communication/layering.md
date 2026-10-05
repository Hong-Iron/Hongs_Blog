---
layout: "note"
title: "계층화"
display_title: "계층화 (Layering)"
kind: "concept"
kind_label: "기법"
num: "19"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Layering", "계층", "layer", "추상화", "abstraction", "논리적 통신", "logical communication", "물리적 통신", "physical communication", "계층 구조"]
description: "복잡한 통신 문제를 한 번에 풀지 않고, 아래층이 해 주는 일을 믿고 그 위에서 조금 더 쉬운 문제만 푸는 식으로 층을 쌓는 방법이다. 사장은 \"이 서류를 부산 지사에 보내\"라고만 하고, 비서는 택배사에, 택배사는 트럭 기사에게 맡기는 것과 같다. 각 층은 자기 일만 알면 되고, …"
prev_url: "/studies/computer-communication/process-to-process-channel/"
prev_title: "프로세스 간 채널"
next_url: "/studies/computer-communication/protocol/"
next_title: "프로토콜"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/layering/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

복잡한 통신 문제를 한 번에 풀지 않고, 아래층이 해 주는 일을 믿고 그 위에서 조금 더 쉬운 문제만 푸는 식으로 층을 쌓는 방법이다. 사장은 "이 서류를 부산 지사에 보내"라고만 하고, 비서는 택배사에, 택배사는 트럭 기사에게 맡기는 것과 같다. 각 층은 자기 일만 알면 되고, 한 층을 바꿔 끼워도 나머지는 그대로다. 대신 층마다 처리와 머리말이 더해져 성능이 조금씩 깎인다.

</div>


## 예시로 보기

슬라이드의 4층 그림에서 각 층은 바로 아래층이 주는 것을 재료로 쓴다[^1].

```
┌──────────────────────────────┐
│ Application programs         │  응용: "상대 프로그램에게 보낸다"만 안다
├──────────────────────────────┤
│ Process-to-process channels  │  호스트 연결 위에 프로세스 사이 통로를 만든다
├──────────────────────────────┤
│ Host-to-host connectivity    │  하드웨어 위에 호스트 사이 연결을 만든다
├──────────────────────────────┤
│ Hardware                     │  선과 장치
└──────────────────────────────┘
```

택배 비유의 사장이 응용, 비서가 프로세스 사이 채널, 택배사가 호스트 사이 연결, 트럭이 하드웨어다. 비유와 달리 통신에서는 받는 쪽에도 같은 층들이 거울처럼 서 있다.

같은 층끼리의 대화는 **논리적**이다. 슬라이드의 그림에서 보내는 호스트의 transport 층과 받는 호스트의 transport 층이 data와 ack를 곧장 주고받는 것처럼 그려진다[^2]. 실제 데이터는 **물리적**으로 이렇게 흐른다[^3].

```
보내는 호스트        라우터            받는 호스트
application                            application
transport                              transport
network      ──→    network     ──→    network
link                link                link
physical  ─────→    physical  ─────→    physical
   (아래로 내려가서 선을 건너고, 라우터에서 network까지 올라갔다 다시 내려간 뒤, 받는 쪽에서 위로 올라간다)
```

"동료에게 보낸다"는 실제로는 "아래층에 내려보낸다"로 이루어진다(send to peer → send down)[^4].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

층에 아래부터 $$1, 2, 3, \dots$$으로 번호를 붙인다. 층 $$\ell$$은 층 $$\ell - 1$$이 주는 서비스만 써서 층 $$\ell + 1$$에게 서비스를 준다. 서로 다른 호스트의 같은 층을 **동료**(peer)라 한다. 동료끼리의 통신은 대개 간접적이다. 실제 전달은 아래층에 맡겨서(위임) 이루어지고, 동료끼리 직접 닿는 것은 하드웨어 층뿐이다[^5].

</div>


계층화는 추상화에서 자연히 나온다. 복잡한 내용을 숨겨 문제를 단순화하는 것이 추상화이고, 그렇게 추상화된 문제를 풀 때 추상화를 다시 적용하면(재귀적으로) 층이 쌓인다[^1].

- **장점:** 문제가 작게 쪼개진다. 각 층은 하나의 부품이라 다른 프로토콜에서 다시 쓸 수 있다. 응용 쪽은 제각각이어도 아래로 갈수록 여러 위층이 같은 층을 함께 쓴다[^4].
- **단점:** 층마다 처리와 헤더가 붙어 오버헤드가 생긴다. 아래층의 사정(예: 링크가 무선이라 자주 끊김)을 위층이 몰라서 최적의 선택을 못 할 수 있다[^s1].

## 예제

- 경계 사례: 층이 하나뿐이면 응용이 선의 전압까지 직접 다뤄야 한다. 응용마다 같은 일을 다시 짜게 된다.
- 교체 사례: 집 안 링크를 유선에서 와이파이로 바꿔도 웹 브라우저는 고칠 필요가 없다. 바뀐 것은 아래 두 층뿐이고, 그 위의 서비스 약속이 그대로이기 때문이다[^s1].

## 연결

- 선수: [프로세스 간 채널](/Hongs_Blog/studies/computer-communication/process-to-process-channel/)(계층화가 만들어 내는 층 중 하나)
- 한 층을 맡는 부품: [프로토콜](/Hongs_Blog/studies/computer-communication/protocol/)
- 층을 내려가며 머리말이 붙는 방식: [캡슐화](/Hongs_Blog/studies/computer-communication/encapsulation/)
- 계층화에 기초한 표준: [OSI 참조 모델](/Hongs_Blog/studies/computer-communication/osi-reference-model/), [인터넷 구조](/Hongs_Blog/studies/computer-communication/internet-architecture/). 슬라이드는 네트워크를 만드는 체계적 접근으로 "계층화에 기초한 표준"을 든다[^6].

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 추상화와 계층화의 관계를 슬라이드의 흐름대로 쓰라.</summary>


**답:** 복잡한 문제는 한 번에 풀 수 없다 → 복잡한 내용을 숨겨 문제를 단순화한다(추상화) → 추상화된 문제를 풀 때 추상화를 재귀적으로 다시 적용한다 → 그 결과 층이 쌓인다. 즉 추상화가 자연히 계층화를 유도한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 호스트 A — 라우터 R — 호스트 B로 이어진 망에서 A의 transport 층이 B의 transport 층에 데이터를 보낸다. (a) 논리적 통신과 (b) 물리적 통신의 경로를 층 이름으로 쓰라.</summary>


**답:** (a) A의 transport ↔ B의 transport. 둘이 곧장 주고받는 것처럼 본다. (b) A: transport → network → link → physical → (선) → R: physical → link → network → link → physical → (선) → B: physical → link → network → transport.  
**흔한 오답:** 라우터에서 transport까지 올라간다고 쓰는 것. 라우터는 network 층까지만 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 필기의 "로우 레벨로 내려갈수록 재사용성이 생긴다"는 왜 성립하는가?</summary>


**답:** 위층일수록 응용마다 필요한 기능이 달라 제각각이다. 아래층의 일(호스트 사이 연결, 선 위의 비트 전달)은 어떤 응용이든 똑같이 필요하다. 그래서 여러 위층이 같은 아래층 하나를 함께 쓴다. 인터넷 구조의 모래시계 모양이 그 예다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260925022004.png — 슬라이드 "계층화 (Layering)". 4층 그림은 4-1학기/pasted_images/Pasted image 20260925022815.png
[^2]: 4-1학기/pasted_images/Pasted image 20260925031304.png — 슬라이드 "Layering: logical communication"
[^3]: 4-1학기/pasted_images/Pasted image 20260925031353.png — 슬라이드 "Layering: physical communication"
[^4]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 46~53행, 63~66행
[^5]: 4-1학기/pasted_images/Pasted image 20260925024434.png — 슬라이드 "(전체) 프로토콜 정의: 프로토콜 그래프", "동료 간의 통신은 대개 간접적으로 이루어진다"
[^6]: 4-1학기/pasted_images/Pasted image 20260925015219.png — 슬라이드 "1장. 기본 개념", 네트워크 구조: "체계적인 접근이 필수: 계층화에 기초한 표준"
[^s1]: 에이전트 보충. 계층화의 단점(오버헤드, 아래층 정보를 숨겨 생기는 비효율)과 유선→와이파이 교체 예는 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.3절의 내용이다. 원본 슬라이드는 "계층이 많은 것은 장점인가, 단점인가?"를 질문으로 남긴다.
{% endraw %}
