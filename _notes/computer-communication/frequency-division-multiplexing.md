---
layout: "note"
title: "주파수 분할 다중화"
display_title: "주파수 분할 다중화 (Frequency-Division Multiplexing, FDM)"
kind: "concept"
kind_label: "모델"
num: "14"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Frequency-Division Multiplexing", "FDM", "주파수분할 다중화", "보호 대역", "guard band", "반송파", "subcarrier"]
description: "라디오 방송국들이 서로 다른 주파수로 동시에 방송하듯, 링크가 실어 나를 수 있는 주파수 범위를 여러 좁은 구간으로 나눠 사용자마다 한 구간을 계속 쓰게 하는 방법이다. 모두가 동시에, 쉬지 않고 보낼 수 있다. 대신 이웃 구간끼리 새지 않도록 사이를 띄워야 해서 그만큼 낭비되고,…"
prev_url: "/studies/computer-communication/time-division-multiplexing/"
prev_title: "시분할 다중화"
next_url: "/studies/computer-communication/statistical-multiplexing/"
next_title: "통계적 다중화"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/frequency-division-multiplexing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

라디오 방송국들이 서로 다른 주파수로 동시에 방송하듯, 링크가 실어 나를 수 있는 주파수 범위를 여러 좁은 구간으로 나눠 사용자마다 한 구간을 계속 쓰게 하는 방법이다. 모두가 동시에, 쉬지 않고 보낼 수 있다. 대신 이웃 구간끼리 새지 않도록 사이를 띄워야 해서 그만큼 낭비되고, 보낼 것이 없는 사용자의 구간도 비어 있다.

</div>


## 예시로 보기

FM 라디오에서 방송국마다 다른 주파수를 쓴다. 모든 방송국이 동시에 방송하지만, 다이얼로 주파수를 고르면 한 방송만 들린다.

슬라이드 그림에서 사용자 4명의 색 띠가 가로로 쌓여 있다. 띠마다 시간 축 전체를 덮고, 주파수 축은 4분의 1씩 차지한다[^2]. 슬라이드의 스펙트럼 그림은 실제 수치를 보여 준다. 반송파(subcarrier) 64, 68, 72 kHz에 실린 채널 3개가 60~64, 64~68, 68~72 kHz를 하나씩 차지하고, 채널 하나의 폭은 4 kHz다[^1].

```
68~72 kHz │██████████  채널 3 (반송파 72 kHz)
64~68 kHz │▓▓▓▓▓▓▓▓▓▓  채널 2 (반송파 68 kHz)
60~64 kHz │░░░░░░░░░░  채널 1 (반송파 64 kHz)
          └──────────→ 시간
```

방송국이 입력 $$i$$, 방송국의 주파수 구간이 아래 정의의 $$[f_i, f_i + W_i)$$가 된다. 방송 내용은 버리고 어느 구간을 차지하는지만 남긴다. 라디오 수신기는 방송 하나만 고르지만, DEMUX는 모든 채널을 동시에 각 출력으로 나눈다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

링크가 쓸 수 있는 주파수 범위를 $$[f_0, f_0 + B)$$(폭 $$B$$ Hz)라 하자. 입력 $$i = 1, \dots, N$$에 서로 겹치지 않는 구간 $$[f_i, f_i + W_i) \subseteq [f_0, f_0 + B)$$를 배정한다. 그러면 $$\sum_{i=1}^{N} W_i \le B$$다. 입력 $$i$$의 신호는 자기 구간 안으로 옮겨 싣는다(변조, modulation)[^s1]. DEMUX 키는 주파수 구간이다.

</div>


| 보장한다                       | 보장하지 않는다                                   |
| -------------------------- | ------------------------------------------ |
| 모든 입력이 동시에, 쉬지 않고 전송할 수 있다 | 쉬는 채널의 재사용. 입력이 보낼 것이 없어도 그 대역은 비어 있다[^s1] |
| 보호 대역이 충분하면 입력끼리 간섭하지 않는다  | 대역의 완전한 활용. 채널 사이 보호 대역만큼은 늘 낭비된다[^3]      |

필터가 불완전하거나 반송파 주파수가 흔들리면 이웃 채널의 신호가 섞여 들어온다(누화, crosstalk). 보호 대역(guard band)을 두는 이유다[^s1].

## 예제

슬라이드 스펙트럼처럼 채널 하나에 4 kHz를 배정한다. 전화 음성은 약 300~3,400 Hz만 쓴다. 채널 대역 중 음성이 실제로 쓰는 비율은?[^s2]

1. *음성 폭:* $$3{,}400 - 300 = 3{,}100$$ Hz.
2. *비율:* $$3{,}100 / 4{,}000 = 77.5\%$$.
3. *해석:* 나머지 22.5%는 이웃 채널과의 간격, 즉 보호 대역 역할을 한다.

- 경계 사례: 모든 입력이 늘 보낼 것이 있으면 쉬는 채널 낭비는 0이다. 그래도 보호 대역 낭비는 남는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 채널 배치 60~64·64~68·68~72 kHz, 60~108 kHz의 12채널, 77.5% — [14_frequency-division-multiplexing_verify.py](/Hongs_Blog/studies/computer-communication/code/14_frequency-division-multiplexing_verify/)</div>

</div>


## 활용

- 가입자 선로의 xDSL은 전화선 하나에 음성과 데이터를 주파수 분할 방식으로 동시에 싣는다. 음성은 저주파, 데이터는 고주파를 쓴다[^4]. 자세한 구조는 [가입자 선로](/Hongs_Blog/studies/computer-communication/last-mile-links/)에 있다.
- 라디오·TV 방송, 와이파이 채널 나누기가 이 방식이다. 옛 장거리 전화 반송 시스템은 음성 채널 12개를 60~108 kHz에 실었다. 슬라이드 스펙트럼 60~72 kHz는 이 배치의 일부와 같은 수치다[^s2].

## 연결

- 선수: [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/), [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)(주파수 대역폭)
- 나란히 볼 개념: [시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)(주파수 대신 시간을 나눔)
- 이어지는 개념: 고정 할당의 낭비를 줄이는 [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)
- 신호를 자기 구간으로 옮겨 싣는 변조: [신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 주파수 분할 다중화에서 받는 쪽이 입력을 구별하는 방법과, 대역을 낭비하는 이유를 쓰라.</summary>


**답:** 입력마다 다른 주파수 구간(채널)을 쓰므로 주파수로 걸러 내어 구별한다. 이웃 채널이 새지 않도록 채널 사이에 보호 대역을 두어야 해서 그만큼 대역이 낭비된다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 사용자 4명의 주파수 분할 다중화와 시분할 다중화를 가로축 시간, 세로축 주파수인 평면에 그리고, 한 사용자가 차지하는 영역을 표시하라.</summary>


**답:** 주파수 분할: 가로로 긴 띠 4개. 사용자 하나가 시간 전체 × 주파수 1/4을 차지한다. 시분할: 세로로 좁은 막대가 반복된다. 사용자 하나가 주파수 전체 × 시간 1/4(4칸마다 1칸)을 차지한다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 주파수 분할 다중화의 보호 대역 낭비와, 쉬는 사용자 때문에 생기는 낭비는 원인이 어떻게 다른가? 시분할 다중화에는 어느 쪽이 있는가?</summary>


**답:** 보호 대역은 채널을 나누는 구조 때문에 트래픽과 상관없이 늘 생긴다. 쉬는 사용자 낭비는 고정 할당 때문에 사용자가 보낼 것이 없을 때 생긴다. 주파수 분할에는 둘 다 있다. 시분할에는 보호 대역이 없지만 쉬는 사용자 낭비는 있다(동기 비트 같은 작은 오버헤드는 있다).

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260924204202.png — 슬라이드 "주파수분할 다중화", (c) Spectrum of composite signal using subcarriers at 64 kHz, 68 kHz, and 72 kHz
[^2]: 4-1학기/pasted_images/Pasted image 20260924204740.png — FDM 그림 (4 users, frequency–time)
[^3]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 65~67행
[^4]: 4-1학기/pasted_images/Pasted image 20260926030111.png — 슬라이드 "가입자 선로 (Last-Mile Links)", "xDSL: 음성과 data를 FDM 방식으로 동시에"
[^s1]: 에이전트 보충. 쉬는 채널의 낭비와 누화는 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절의 내용이다. 변조는 4회 슬라이드 "모듈레이션: 데이터의 신호화"(4-1학기/pasted_images/Pasted image 20260926022823.png)가 다룬다.
[^s2]: 에이전트 보충. 음성 대역 300~3,400 Hz와 12채널 그룹(60~108 kHz), 와이파이 예는 원본에 없는 표준적인 수치와 사례다.
{% endraw %}
