---
layout: "note"
title: "프로세스 간 채널"
display_title: "프로세스 간 채널 (Process-to-Process Channel)"
kind: "concept"
kind_label: "모델"
num: "18"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Process-to-Process Channel", "프로세스 간 통신", "통신 서비스", "communication service", "네트워크 투명성", "network transparency", "통신 장애", "장애 극복", "채널", "channel"]
description: "네트워크가 컴퓨터끼리 선을 이어 주는 것만으로는 부족하다. 실제로 대화하는 것은 컴퓨터 안의 응용 프로그램이라서, 두 프로그램 사이에 전용 통로(채널)가 있는 것처럼 보이게 해 줘야 한다. 목표는 멀리 있는 상대와 주고받아도 같은 컴퓨터 안에서 주고받는 것처럼 느끼게 하는 것이다.…"
prev_url: "/studies/computer-communication/contrast--packet-switching--statistical-multiplexing/"
prev_title: "패킷 스위칭과 통계적 다중화 비교"
next_url: "/studies/computer-communication/layering/"
next_title: "계층화"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/process-to-process-channel/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

네트워크가 컴퓨터끼리 선을 이어 주는 것만으로는 부족하다. 실제로 대화하는 것은 컴퓨터 안의 응용 프로그램이라서, 두 프로그램 사이에 전용 통로(채널)가 있는 것처럼 보이게 해 줘야 한다. 목표는 멀리 있는 상대와 주고받아도 같은 컴퓨터 안에서 주고받는 것처럼 느끼게 하는 것이다. 그런데 실제 망에서는 비트가 깨지고 패킷이 버려지고 순서가 뒤바뀌므로, 누군가 그 차이를 메워야 한다.

</div>


## 예시로 보기

노트북의 웹 브라우저가 서버의 웹 서버 프로그램과 대화한다. 노트북에는 메신저와 음악 앱도 돌고 있다. 인터네트워크가 해 주는 일은 노트북과 서버라는 **호스트 사이**를 잇는 것까지다. 브라우저가 원하는 것은 **자기와 웹 서버 사이**의 통로다. 슬라이드 그림에서 구름을 가로지르는 파란 선이 이 통로다[^1].

실행 중인 프로그램(프로세스)을 끝점으로, 파란 선을 채널로 추상화한다. 망 안의 경로와 링크 수, 다른 앱의 존재는 버린다. 응용은 "상대 프로세스에게 보낸다"만 알면 된다.

실제 망에서 생기는 일과 응용의 기대를 나란히 놓으면 메워야 할 차이가 보인다[^2].

| 응용이 기대하는 것 | 망에서 실제로 생기는 일 |
|---|---|
| 보낸 비트 그대로 | 비트 수준 오류 (전자기 간섭·방해) |
| 빠짐없이 | 패킷 수준 오류 (혼잡으로 버려짐), 링크·노드 고장 |
| 곧바로 | 메시지 지연 |
| 보낸 순서대로 | 순서가 바뀐 전달 (out-of-order) |
| 둘만 알게 | 제삼자의 도청 |

## 정의

네트워크의 통신 서비스는 호스트 사이의 연결을 프로세스 사이의 통신 형태로 바꿔 주는 것이다. 즉 네트워크는 프로세스와 프로세스 사이의 채널을 지원한다[^1]. 원격 통신이 로컬 통신과 구별되지 않을 만큼 되면 충분한 서비스로 본다. 이를 네트워크 투명성(network transparency)이라 한다[^1][^3].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

서로 다른 호스트에서 도는 프로세스 $$\pi_1$$과 $$\pi_2$$ 사이의 **채널**은, $$\pi_1$$이 보낸 메시지를 $$\pi_2$$에게 전달하는 추상적 통로다. 채널이 어떤 성질(오류 없음, 빠짐없음, 순서 유지, 비밀 유지 등)을 약속하는지는 서비스마다 다르다[^s1].

</div>


아래의 망이 주는 것과 채널이 약속하는 것 사이의 거리를 메우는 일이 통신 기술의 핵심이다. 이 일은 통신망의 협조와 호스트 소프트웨어가 함께 해서 완성한다[^2].

| 채널이 약속할 수 있다 (위에서 메워서) | 아래 망만으로는 보장하지 않는다 |
|---|---|
| 오류 없는 전달, 빠짐없는 전달, 순서대로 전달 | 비트·패킷 오류, 손실, 순서 |
| 상대만 읽을 수 있는 전달 | 도청 방지 |
| | 지연의 상한[^s1] |

## 연결

- 선수: [인터네트워크](/Hongs_Blog/studies/computer-communication/internetwork/)(호스트 사이의 연결)
- 이 차이를 층으로 나눠 메우는 방법: [계층화](/Hongs_Blog/studies/computer-communication/layering/). 슬라이드의 4층 그림에서 "Process-to-process channels"가 한 층이다.
- OSI에서 프로세스 사이의 신뢰성 있는 전달은 트랜스포트 계층이 맡는다: [OSI 참조 모델](/Hongs_Blog/studies/computer-communication/osi-reference-model/)
- 패킷 수준 오류의 원인인 혼잡: [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 네트워크가 응용에게 제공해야 하는 통신 서비스를 한 문장으로 쓰고, 네트워크 투명성이 무엇인지 쓰라.</summary>


**답:** 호스트 사이의 연결을 프로세스 사이의 통신(채널) 형태로 바꿔 준다. 네트워크 투명성은 원격 통신이 로컬 통신과 구별되지 않아서 응용이 네트워크의 존재를 느끼지 않는 상태다.<br>
**흔한 오답:** "호스트끼리 연결해 준다"에서 멈추는 것. 통신의 주체는 호스트가 아니라 응용 프로그램(프로세스)이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음은 슬라이드의 통신 장애 중 무엇인가? (a) 번개로 케이블의 비트가 뒤집혔다 (b) 라우터 버퍼가 넘쳐 패킷이 버려졌다 (c) 두 패킷이 서로 다른 경로로 가서 뒤 패킷이 먼저 도착했다 (d) 카페 와이파이에서 옆 사람이 오가는 데이터를 엿봤다</summary>


**답:** (a) 비트 수준 오류 (전자기 간섭). (b) 패킷 수준 오류 (혼잡). (c) 순서가 바뀐 전달. (d) 제삼자의 도청.<br>
**흔한 오답:** (b)를 링크 고장으로 보는 것. 링크는 멀쩡하고 노드의 저장 공간이 모자란 것이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 장애 극복을 통신망 안에서만 끝내지 않고 호스트 소프트웨어가 함께 맡는 이유는 무엇인가?</summary>


**답:** 응용이 무엇을 기대하는지(예: 빠짐없음이 중요한지, 빠름이 중요한지)는 양 끝의 호스트만 안다. 망 안의 노드가 링크마다 완벽하게 전달해도, 노드 자체가 고장 나거나 버퍼가 넘치면 데이터는 잃는다. 그래서 끝까지 제대로 갔는지는 결국 끝의 호스트가 확인해야 한다[^s2].

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260925013630.png — 슬라이드 "통신 서비스 제공" (1장 기본 개념: 요구 사항 3), 오른쪽 "Network Transparency 제공"
[^2]: 4-1학기/pasted_images/Pasted image 20260925014952.png — 슬라이드 "통신 서비스: 통신 장애 극복"
[^3]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 20~24행, 34~36행
[^s1]: 에이전트 보충. 채널의 형식적 정의와 "채널마다 약속하는 성질이 다르다", "지연의 상한은 보장하지 않는다"는 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절(공통 서비스 지원)의 내용이다.
[^s2]: 에이전트 보충. 끝의 호스트가 최종 확인을 맡아야 한다는 논리는 종단 간 논증(end-to-end argument, Saltzer, Reed & Clark 1984)이다. 슬라이드는 "통신망의 협조 + 호스트 소프트웨어로 완성"까지만 쓴다.
{% endraw %}
