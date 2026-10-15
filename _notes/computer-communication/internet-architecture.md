---
layout: "note"
title: "인터넷 구조"
display_title: "인터넷 구조 (Internet Architecture)"
kind: "concept"
kind_label: "모델"
num: "24"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Internet Architecture", "TCP/IP 구조", "TCP/IP model", "모래시계", "hourglass", "IP", "Internet Protocol", "TCP", "UDP", "IETF"]
description: "인터넷 구조는 실제로 인터넷을 운영하며 다듬어진 계층 구조다. 모래시계처럼 가운데가 IP 하나로 좁고, 위로는 여러 응용이, 아래로는 여러 종류의 네트워크가 넓게 퍼진다. 가운데가 하나뿐이라 어떤 응용이든 어떤 네트워크 위에서든 돌 수 있다. 대신 OSI처럼 층을 엄격하게 지키지는…"
prev_url: "/studies/computer-communication/osi-reference-model/"
prev_title: "OSI 참조 모델"
next_url: "/studies/computer-communication/latency/"
next_title: "소요시간"
math: true
mermaid: true
code_count: 0
permalink: "/studies/computer-communication/internet-architecture/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

인터넷 구조는 실제로 인터넷을 운영하며 다듬어진 계층 구조다. 모래시계처럼 가운데가 IP 하나로 좁고, 위로는 여러 응용이, 아래로는 여러 종류의 네트워크가 넓게 퍼진다. 가운데가 하나뿐이라 어떤 응용이든 어떤 네트워크 위에서든 돌 수 있다. 대신 OSI처럼 층을 엄격하게 지키지는 않는다.

</div>


## 예시로 보기

인터넷의 프로토콜 그래프는 다음과 같다.

```mermaid
graph TD
  FTP --> TCP
  HTTP --> TCP
  NV --> UDP
  TFTP --> UDP
  TCP --> IP
  UDP --> IP
  IP --> N1["NET 1"]
  IP --> N2["NET 2"]
  IP --> Nn["NET n"]
```

위쪽 응용 프로토콜이 넷, 가운데 트랜스포트가 둘, 그 아래 IP가 하나, 맨 아래 네트워크가 $$n$$개다. 폭이 넓다가 IP에서 하나로 좁아진 뒤 다시 넓어진다. 이것이 모래시계 모양이다. 웹(HTTP)이 이더넷 위에서든 와이파이 위에서든 도는 것은 둘 다 IP 아래에 있기 때문이다[^s1].

## 정의

인터넷 구조는 IETF(Internet Engineering Task Force)가 관리하는 표준 구조다. OSI와 비교하면 다음과 같다.

| 인터넷 구조 | 예 | OSI에서는 |
|---|---|---|
| 응용 (Application) | FTP, HTTP, NV, TFTP | 7층. 5·6층의 일은 필요하면 응용 안에서 한다 |
| TCP / UDP | TCP, UDP | 4층 트랜스포트 |
| IP | IP | 3층 네트워크. 서로 다른 네트워크들을 하나로 묶는 층 |
| Network (NET) | 각 망 사업자의 네트워크 | 1~2층 (각 네트워크 내부의 방식은 망마다 다르다) |

IP는 어느 한 네트워크 기술(NET)에 딸린 층이 아니다. 그 위에서 모든 네트워크를 하나로 묶는 층이고, OSI로 옮기면 3층의 일, 즉 여러 링크를 건너 호스트 사이에 패킷을 보내는 일을 한다.

인터넷 구조의 특징은 셋이다.

1. 계층화를 그대로 따르지는 않는다. 응용이 TCP·UDP를 건너뛰고 IP를 바로 쓸 수도 있다[^s1].
2. 모래시계 모양이다.
3. 설계와 구현을 함께 한다. 표준을 먼저 다 정하고 만드는 OSI와 반대로, 돌아가는 구현을 보며 표준을 다듬는다[^s1].


## 활용

- 새 네트워크 기술(예: 5G)은 IP만 실어 나를 수 있으면 곧바로 모든 인터넷 응용을 쓸 수 있다. 새 응용은 TCP나 UDP만 쓰면 모든 네트워크 위에서 돈다[^s1].
- 흔한 실수는 인터넷 구조를 "OSI 7층 중 몇 층을 뺀 것"으로 외우는 것이다. 인터넷 구조는 OSI를 줄여 만든 것이 아니라, 운영 경험에서 따로 자라났다.

## 연결

- 선수: [OSI 참조 모델](/Hongs_Blog/studies/computer-communication/osi-reference-model/), [프로토콜 그래프](/Hongs_Blog/studies/computer-communication/protocol-graph/)
- IP가 묶는 "네트워크들의 네트워크": [인터네트워크](/Hongs_Blog/studies/computer-communication/internetwork/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 인터넷 구조의 특징 세 가지를 쓰라.</summary>


**답:** ① 계층화를 그대로 따르지 않는다. ② 모래시계 모양이다. ③ 설계와 구현을 병행한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> FTP, HTTP, NV, TFTP, TCP, UDP, IP, NET을 인터넷 구조의 층에 배치하고, OSI의 몇 층에 대응하는지 쓰라. 그림으로 그렸을 때 모래시계의 가장 좁은 곳은 어디인가?</summary>


**답:** 응용: FTP, HTTP, NV, TFTP (OSI 5~7). 트랜스포트: TCP, UDP (OSI 4). IP (OSI 3). NET (OSI 1~2). 가장 좁은 곳은 IP다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 가운데를 IP 하나로 좁힌 설계가 왜 유리한가? 위쪽(응용)과 아래쪽(네트워크) 각각의 입장에서 쓰라.</summary>


**답:** 위쪽: 응용은 IP 하나만 믿으면 아래가 어떤 네트워크든 신경 쓰지 않아도 된다. 아래쪽: 새 네트워크는 IP 하나만 실어 나르면 기존 응용이 모두 그 위에서 돈다. 가운데가 여럿이면 응용 수 × 네트워크 수만큼 맞춰야 하지만, 하나면 각자 IP에만 맞추면 된다[^s1].

</details>

[^s1]: Peterson & Davie, *Computer Networks: A Systems Approach*, 1.3절의 내용이다.
{% endraw %}
