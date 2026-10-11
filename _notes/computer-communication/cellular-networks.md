---
layout: "note"
title: "이동통신"
display_title: "이동통신 (Cellular Networks)"
kind: "concept"
kind_label: "모델"
num: "35"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Cellular Networks", "셀룰러", "셀룰러 네트워크", "셀", "cell", "기지국", "base station", "핸드오프", "handoff", "hand-off", "주파수 재사용", "frequency reuse", "공간 분할 다중화", "space-division multiplexing", "AMPS", "PCS", "GSM", "CDMA", "W-CDMA", "4G", "5G", "마이크로셀", "microcell"]
description: "이동통신은 넓은 지역을 작은 구역(셀)으로 나누고, 구역마다 기지국을 두어 휴대 단말기와 잇는 방식이다. 서로 떨어진 셀은 같은 주파수를 다시 써서, 한정된 전파로 많은 사람을 받는다. 대신 사용자가 셀 경계를 넘을 때 끊기지 않게 담당 기지국을 바꿔 주어야 한다(핸드오프). 세대…"
prev_url: "/studies/computer-communication/wireless-links/"
prev_title: "무선 링크"
next_url: "/studies/computer-communication/satellite-systems/"
next_title: "위성통신"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/cellular-networks/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이동통신은 넓은 지역을 작은 구역(셀)으로 나누고, 구역마다 기지국을 두어 휴대 단말기와 잇는 방식이다. 서로 떨어진 셀은 같은 주파수를 다시 써서, 한정된 전파로 많은 사람을 받는다. 대신 사용자가 셀 경계를 넘을 때 끊기지 않게 담당 기지국을 바꿔 주어야 한다(핸드오프). 세대가 올라갈수록 셀은 작아지고 음성 회선에서 패킷 통신으로 바뀌었다.

</div>


## 예시로 보기

고속도로를 달리며 통화한다. 휴대폰은 처음에 셀 A의 기지국과 통신한다. 셀 B로 들어가면 두 셀이 겹치는 곳에서 셀 B의 기지국으로 넘어간다. 이 겹치는 구역이 있어야 끊기지 않고 넘길 수 있다[^1].

슬라이드의 세 그림은 셀을 그리는 방식이다[^2]. 실제 전파는 원 모양으로 퍼져 서로 겹친다(Overlapping circular cells). 계산하기 좋게 빈틈없는 육각형으로 그린다(Idealised hexagonal network). 사람이 많은 곳에는 큰 셀 안에 작은 셀을 더 둔다(Microcells within a network).

이 장면에서 휴대폰이 단말기, 기지국의 전파가 닿는 범위가 셀이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

기지국과 단말기가 무선으로 통신한다[^2].
- **셀**: 하나의 기지국이 관할하는 지역.
- **핸드오프**: 단말기가 셀 사이를 옮길 때 관할하는 기지국을 바꾸는 문제. 핸드오프를 위해 셀 사이에 겹치는 지역이 있다[^1].
- **공간 분할 다중화**: 공간(셀)을 나눠, 떨어진 셀끼리 같은 주파수를 다시 쓴다. 인접한 셀은 서로 다른 주파수를 써야 한다[^2][^1].

</div>


| 세대 | 기술[^2] | 특징[^1] |
|---|---|---|
| 1 | AMPS | 아날로그. 음성 전화 |
| 2 | PCS (GSM / CDMA) | 디지털 |
| 3 | W-CDMA | 코드 분할(Code Division) 다중화 |
| 4 | 4세대 이동통신 | 패킷 통신으로 전환 |
| 5 | 5G | 셀이 더 작아짐 |

4·5세대로 오면서 셀이 작아지는 경향이 있다. 망의 비용 대비 성능과 유지비를 위한 선택이다. 고속을 내는 높은 주파수를 쓰기에 작은 셀이 유리하고, 작을수록 같은 주파수를 더 자주 다시 쓸 수 있다[^1].

## 연결

- 선수: [무선 링크](/Hongs_Blog/studies/computer-communication/wireless-links/), [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/)
- 다중화의 축이 하나 더 는다. 시간([시분할](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)), 주파수([주파수 분할](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)), 코드(CDMA)에 이어 공간(셀)으로도 나눈다.
- 4세대의 패킷 통신: [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 셀과 핸드오프를 정의하고, 셀 사이에 겹치는 지역을 두는 이유를 쓰라.</summary>


**답:** 셀은 기지국 하나가 관할하는 지역이다. 핸드오프는 단말기가 셀을 옮길 때 관할 기지국을 바꾸는 문제다. 겹치는 지역에서는 두 기지국의 전파가 모두 닿아서, 연결을 끊지 않고 새 기지국으로 넘길 수 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 4·5세대 이동통신에서 셀이 작아지는 이유를 두 가지 쓰라.</summary>


**답:** ① 고속을 위해 높은 주파수를 쓰는데, 높은 주파수는 멀리 가지 못하고 장애물에 약해 작은 셀이 유리하다. ② 셀이 작을수록 같은 주파수를 더 여러 번 다시 쓸 수 있어, 같은 전파로 더 많은 사용자를 받는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음은 어떤 다중화인가? (a) 이웃 셀은 다른 주파수를 쓰고, 멀리 떨어진 셀은 같은 주파수를 다시 쓴다 (b) 1세대 AMPS에서 한 셀 안의 통화마다 서로 다른 주파수 대역을 준다 (c) 3세대에서 같은 주파수를 쓰는 여러 단말기를 서로 다른 코드로 구별한다</summary>


**답:** (a) 공간 분할 다중화. 공간(셀)이 키다. (b) 주파수 분할 다중화[^s1]. (c) 코드 분할 다중화(CDMA).

</details>

[^1]: 컴퓨터 통신 4회 필기 「4주차」, 69~82행
[^2]: 수업 슬라이드 캡처 — 슬라이드 "이동통신(Cellular Networks)". 초록 글씨: space-division multiplexing
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> AMPS가 통화마다 주파수 채널을 나눠 주는 방식(FDMA)이라는 것은 원본에 없다. 원본은 1세대를 "아날로그"로만 적는다. AMPS는 30 kHz 채널을 쓰는 아날로그 FDMA 방식이다(Kurose & Ross, *Computer Networking: A Top-Down Approach*, 7장).
{% endraw %}
