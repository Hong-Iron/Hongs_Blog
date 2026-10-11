---
layout: "note"
title: "회선 스위칭과 패킷 스위칭 비교"
display_title: "회선 스위칭과 패킷 스위칭 비교"
kind: "concept"
kind_label: "비교"
num: "09"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["회선 스위칭 vs 패킷 스위칭", "circuit vs packet switching"]
description: "둘은 스위칭 네트워크에서 데이터를 넘기는 두 방식이다. 가르는 질문은 \"자원을 미리 잡아 두는가\"다. 어느 쪽이 나은지는 사용자의 입장과 네트워크의 입장에 따라 다르다."
prev_url: "/studies/computer-communication/packet-switching/"
prev_title: "패킷 스위칭"
next_url: "/studies/computer-communication/addressing/"
next_title: "주소 지정"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/contrast--circuit-switching--packet-switching/"
---
{% raw %}
둘은 스위칭 네트워크에서 데이터를 넘기는 두 방식이다. 가르는 질문은 "자원을 미리 잡아 두는가"다. 어느 쪽이 나은지는 사용자의 입장과 네트워크의 입장에 따라 다르다[^1].

## 어느 쪽일까

상황마다 [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/)과 [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/) 중 무엇이 맞는지 고르고, 다른 쪽이 왜 아닌지도 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 통화 내내 64 kbps로 일정하게 흐르는 음성 통화 (b) 링크를 클릭할 때만 데이터가 몰리는 웹 브라우징</summary>


**답:** (a) 회선 스위칭. 전송률이 일정하고 오래 이어지므로 잡아 둔 용량이 거의 낭비되지 않는다. 설정 시간도 긴 통화 시간에 묻힌다. 패킷 스위칭도 가능하지만 통화 중 지연이 흔들릴 수 있다. (b) 패킷 스위칭. 버스티해서 회선을 잡아 두면 대부분의 시간 동안 비어 낭비된다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 1 Mbps 링크에 활동 시 100 kbps, 시간의 10%만 활동하는 사용자 35명을 붙이려 한다 (d) 전송률이 늘 일정해야 하고, 지연이 조금이라도 들쭉날쭉하면 안 되는 제어 신호를 보낸다</summary>


**답:** (c) 패킷 스위칭. 회선 스위칭은 10명까지만 받는다. 패킷 스위칭은 35명을 받아도 11명 이상이 동시에 몰릴 확률이 약 0.0004다. (d) 회선 스위칭. 전송률과 지연을 보장하는 것은 회선 스위칭이다. 패킷 스위칭은 혼잡할 때 대기 지연과 손실이 생기고 이를 보장하지 않는다[^s1].

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: (c)의 0.0004는 이항분포 계산 0.000424 — [15_statistical-multiplexing_verify.py](/Hongs_Blog/studies/computer-communication/code/15_statistical-multiplexing_verify/)</div>

</div>


## 결정적 차이

| 기준 | 회선 스위칭 | 패킷 스위칭 |
|---|---|---|
| 자원을 언제 잡나 | 통신 전에 미리, 전용으로[^2] | 잡지 않음. 보낼 때 그때그때[^3] |
| 쉬는 동안의 용량 | 묶여 있어 낭비된다[^1] | 다른 사용자가 쓴다 |
| 스위치 동작 | 비트스트림을 멈춤 없이 흘려보냄[^2] | 패킷마다 저장 후 전달[^3] |
| 보장 | 전송률과 지연이 일정 | 보장 없음. 몰리면 대기·손실[^s1] |
| 자원이 모자랄 때 | 연결 설정을 거절한다(통화 중)[^s1] | 받되 느려지거나 버린다[^s1] |
| 맞는 트래픽 | 일정하고 오래 이어짐 (전화)[^2] | 버스티 (컴퓨터 통신)[^1] |
| 소요시간의 모양 | 설정에 시간을 들이고, 그 뒤로는 멈춤 없이 흐름[^4] | 설정 없이 바로 보내지만, 노드마다 저장 후 전달과 처리가 더해지고 패킷마다 헤더가 붙음[^4] |

두 방식의 소요시간을 그림과 식으로 비교하는 방법은 [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)에 있다.

## 둘 다 아닐 때

경로는 미리 정하되 용량은 예약하지 않는 가상 회선이 있다. 패킷 스위칭처럼 링크를 나눠 쓰면서, 회선 스위칭처럼 연결 설정 때 경로를 정한다. 그래서 순서가 지켜지고 패킷마다 경로를 찾지 않아도 된다[^s1].

[^1]: 컴퓨터 통신 1회 필기 「1주차」, 30~40행
[^2]: 수업 슬라이드 캡처 — 슬라이드 "간접 연결 방법: 스위칭 정책", 회선 스위칭
[^3]: 수업 슬라이드 캡처 — 슬라이드 "패킷 스위칭"
[^4]: 수업 슬라이드 캡처, 수업 슬라이드 캡처 — 슬라이드 "Timing in Circuit Switching", "Timing of Packet Switching"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 보장·거절·혼잡의 비교와 가상 회선은 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절과 3장(가상 회선 스위칭)의 내용이다.
{% endraw %}
