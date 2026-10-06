---
layout: "note"
title: "OSI 참조 모델"
display_title: "OSI 참조 모델 (OSI Reference Model)"
kind: "concept"
kind_label: "모델"
num: "23"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-10-06"
status: "verified"
aliases: ["OSI Reference Model", "OSI 7계층", "OSI 7 layers", "Open Systems Interconnection", "참조 모델", "reference model", "표준 구조", "standard architecture", "물리 계층", "physical layer", "네트워크 계층", "network layer", "트랜스포트 계층", "transport layer", "세션 계층", "session layer", "프레젠테이션 계층", "presentation layer", "응용 계층", "application layer", "ISO", "ITU"]
description: "OSI 참조 모델은 통신에 필요한 일을 7개 층으로 나눠 \"이 일은 몇 층 담당\"이라고 부를 수 있게 한 공용 지도다. 국제 표준 기구가 만든 개방형 표준이라, 어느 회사 장비든 이 틀로 설명할 수 있다. 중간 노드는 아래 3층만 가지고, 위 4층은 양 끝 호스트끼리만 주고받는다.…"
prev_url: "/studies/computer-communication/encapsulation/"
prev_title: "캡슐화"
next_url: "/studies/computer-communication/internet-architecture/"
next_title: "인터넷 구조"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/osi-reference-model/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

OSI 참조 모델은 통신에 필요한 일을 7개 층으로 나눠 "이 일은 몇 층 담당"이라고 부를 수 있게 한 공용 지도다. 국제 표준 기구가 만든 개방형 표준이라, 어느 회사 장비든 이 틀로 설명할 수 있다. 중간 노드는 아래 3층만 가지고, 위 4층은 양 끝 호스트끼리만 주고받는다. 실제 인터넷은 7층을 그대로 구현하지 않지만, 문제를 나눠 생각하는 틀로는 지금도 쓴다.

</div>


## 예시로 보기

슬라이드 그림에서 양 끝 호스트(End host)는 7층을 모두 갖고, 가운데의 망 속 노드는 Network, Data link, Physical 세 층만 갖는다[^1].

```
End host A           망 속 노드           End host B
7 Application  ─────────────────────────  7 Application
6 Presentation ─────────────────────────  6 Presentation
5 Session      ─────────────────────────  5 Session
4 Transport    ─────────────────────────  4 Transport     ← 여기까지 끝과 끝(end-to-end)
3 Network      ──── 3 Network ──────────  3 Network
2 Data link    ──── 2 Data link ────────  2 Data link     ← 아래 3층은 이웃 노드끼리(hop-by-hop)
1 Physical     ════ 1 Physical ═════════  1 Physical      (═ 는 실제 선)
```

망 속 노드는 하나 이상일 수 있다. 아래 세 층의 동료는 바로 옆 노드의 같은 층이다[^2]. 트랜스포트 층부터는 동료가 반대편 끝 호스트다. 슬라이드의 손글씨도 A와 B의 응용을 곧장 잇고, 아래층은 노드마다 오르내리는 경로로 그린다[^3].

## 정의

OSI(Open Systems Interconnection) 구조는 국제 표준화 기구(ISO)와 국제 전기통신 연합(ITU, 옛 CCITT)이 만든 표준 구조다. X.25, X.400, X.500 같은 "X 시리즈" 표준이 여기에 속한다. OSI는 통신 문제를 나눠 생각하는 틀인 **참조 모델**이다. 실제 제품의 설계도가 아니라, "이 일은 몇 층 담당"이라고 말할 때 기준으로 삼는 지도라는 뜻이다[^1][^s2].

| 층 | 이름 | 담당하는 일 | 주고받는 단위 |
|---|---|---|---|
| 7 | 응용 (Application) | 응용 자체와 관련된 사항 | |
| 6 | 프레젠테이션 (Presentation) | 데이터 표현 방법 | |
| 5 | 세션 (Session) | 대화 패턴 | |
| 4 | 트랜스포트 (Transport) | 통신 응용 사이의 신뢰성 있는 메시지 교환 (끝과 끝, 프로세스 사이 채널 제공) | 메시지 |
| 3 | 네트워크 (Network) | 스위치로 간접 연결된 호스트 사이의 패킷 교환 (저장 후 전달) | 패킷 |
| 2 | 데이터 링크 (Data link) | 하나의 링크로 연결된 노드 사이의 비트 묶음 교환 | 프레임 |
| 1 | 물리 (Physical) | 직접 연결된 노드 사이의 비트 전송 | 비트 |

표의 내용은 필기의 계층 기능 정의를 따른다[^2][^4]. 5층과 6층은 필요할 때만 구현한다[^4].

## 활용

- 장비와 기능을 층 번호로 부른다. 예: 스위치는 2층까지, 라우터는 3층까지 본다[^s1].
- 실제 인터넷은 5·6층을 따로 두지 않고 응용에 합친 [인터넷 구조](/Hongs_Blog/studies/computer-communication/internet-architecture/)를 쓴다.
- 흔한 실수는 네트워크 층과 데이터 링크 층의 범위를 섞는 것이다. 데이터 링크는 선 하나, 네트워크는 여러 링크를 건너는 경로를 맡는다.

## 연결

- 선수: [계층화](/Hongs_Blog/studies/computer-communication/layering/), [프로토콜](/Hongs_Blog/studies/computer-communication/protocol/)
- 1·2층을 자세히: [데이터 링크 계층](/Hongs_Blog/studies/computer-communication/data-link-layer/)
- 4층이 제공하는 것: [프로세스 간 채널](/Hongs_Blog/studies/computer-communication/process-to-process-channel/)
- 3층의 동작 방식: [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)(저장 후 전달)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> OSI 7층을 아래부터 순서대로 쓰고, 1~4층이 각각 무엇을 누구 사이에서 주고받는지 쓰라.</summary>


**답:** 물리, 데이터 링크, 네트워크, 트랜스포트, 세션, 프레젠테이션, 응용. 1층: 직접 연결된 노드 사이의 비트. 2층: 하나의 링크로 연결된 노드 사이의 프레임(비트 묶음). 3층: 스위치로 간접 연결된 호스트 사이의 패킷. 4층: 응용(프로세스) 사이의 신뢰성 있는 메시지, 끝과 끝.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음 일은 몇 층의 일인가? (a) 광케이블에서 빛의 켜짐·꺼짐으로 0과 1을 나타낸다 (b) 이웃 노드로 보낼 비트 묶음의 시작과 끝을 표시한다 (c) 라우터가 목적지 주소를 보고 내보낼 링크를 고른다 (d) 받은 쪽 호스트가 빠진 데이터를 다시 보내 달라고 한다 (e) 문자를 어떤 인코딩으로 나타낼지 맞춘다</summary>


**답:** (a) 1층 물리. (b) 2층 데이터 링크(프레임). (c) 3층 네트워크. (d) 4층 트랜스포트. 끝과 끝의 신뢰성이다. (e) 6층 프레젠테이션. 데이터 표현 방법이다.<br>
**흔한 오답:** (d)를 2층으로 보는 것. 2층의 오류 복구는 링크 하나 구간만 책임진다. 끝에서 끝까지 빠짐없음을 확인하는 것은 4층이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 슬라이드의 질문 "계층이 많은 것은 장점인가, 단점인가?"에 장점과 단점을 하나 이상씩 들어 답하라.</summary>


**답:** 장점: 층마다 맡는 일이 작아져 설계와 이해가 쉽고, 한 층을 바꿔도 다른 층에 영향이 적다. 단점: 층마다 헤더와 처리가 더해져 오버헤드가 커지고, 여러 층이 비슷한 일(예: 오류 검사)을 되풀이할 수 있다. 실제로 세션·프레젠테이션 층은 따로 쓸 일이 적어, 인터넷 구조는 이를 응용에 합쳤다[^s1].

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260925032023.png — 슬라이드 "표준 구조 (Standard Architectures) (1)". 원문의 빨간 글씨: 표준, Open, Standard, 참조 모델. 초록 글씨: "계층이 많은 것은 장점인가, 단점인가?"
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 80~95행
[^3]: 4-1학기/pasted_images/Pasted image 20260925033034.png — 같은 슬라이드의 손글씨 판. 같은 화면을 한 번 더 캡처한 파일이 4-1학기/pasted_images/Pasted image 20260925033028.png다
[^4]: 4-1학기/컴퓨터 통신/2.필기노트/03.3주차.md, 5~6행, 17~24행
[^s1]: 에이전트 보충. 스위치·라우터를 층 번호로 부르는 관례와 계층 수의 장단점은 원본에 없다. 원본은 질문만 던진다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.3절의 내용이다.
[^s2]: 에이전트 보충. '참조 모델'의 뜻풀이(설계도가 아니라 기준이 되는 틀)는 원본에 없다. 슬라이드가 OSI를 "참조 모델"이라 부르고 실제 인터넷은 다른 구조를 쓴다는 점에 근거한 설명이다.
{% endraw %}
