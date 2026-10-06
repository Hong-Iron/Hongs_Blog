---
layout: "note"
title: "전송 속도와 대역폭"
display_title: "전송 속도와 대역폭 (Transmission Rate and Bandwidth)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-10-06"
status: "verified"
aliases: ["Transmission Rate", "Bandwidth", "전송률", "데이터 전송률", "bit rate", "bps", "대역폭", "전송 지연", "전송 시간", "transmission delay", "전파 지연", "전파지연시간", "propagation delay", "비트 폭", "bit width"]
description: "링크의 전송 속도(대역폭)는 1초에 선에 밀어 넣을 수 있는 데이터 양의 최댓값이다. 기차에 비유하면 객차를 선로에 올리는 빠르기가 전송 속도이고, 다 올린 기차가 다음 역까지 달리는 시간은 따로 있다. 속도를 올리면 올리는 시간만 줄고 달리는 시간은 그대로다. \"대역폭\"이라는 말…"
prev_url: "/studies/computer-communication/internetwork/"
prev_title: "인터네트워크"
next_url: "/studies/computer-communication/circuit-switching/"
next_title: "회선 스위칭"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/rate-and-bandwidth/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

링크의 전송 속도(대역폭)는 1초에 선에 밀어 넣을 수 있는 데이터 양의 최댓값이다. 기차에 비유하면 객차를 선로에 올리는 빠르기가 전송 속도이고, 다 올린 기차가 다음 역까지 달리는 시간은 따로 있다. 속도를 올리면 올리는 시간만 줄고 달리는 시간은 그대로다. "대역폭"이라는 말은 주파수의 폭과 전송 속도라는 두 뜻으로 쓰여서 문맥으로 가려야 한다.

</div>


## 예시로 보기

인터넷 속도를 "100메가", "1기가"라고 말한다. 속도를 10배로 올리면 데이터가 10배 빨리 도착할까? 꼭 그렇지 않다. 직접 계산해 본다.

1,500바이트짜리 패킷을 보낸다. 1바이트는 8비트이므로 12,000비트다.

| 링크 | 선에 다 올리는 시간 | 400 km를 건너는 시간 |
|---|---|---|
| 100 Mbps | $$12{,}000 / 10^8 = 120\ \mu\text{s}$$ | $$4 \times 10^5 / (2 \times 10^8) = 2$$ ms |
| 1 Gbps | $$12{,}000 / 10^9 = 12\ \mu\text{s}$$ | 2 ms (그대로) |

기차로 치면 객차 수가 패킷의 비트 수 $$L$$이고, 객차를 올리는 빠르기가 전송률 $$R$$이다. 다 올리는 데 걸리는 시간을 전송 지연 $$d_{\text{trans}}$$, 다음 역까지 달리는 시간을 전파 지연 $$d_{\text{prop}}$$이라 부른다. 표에서 속도를 10배로 올리자 전송 지연(120 μs → 12 μs)만 줄고, 전파 지연(2 ms)은 그대로였다. 기차와 달리 실제 신호는 첫 비트가 올라가자마자 나아간다. 그래도 마지막 비트가 도착하는 시각은 두 시간의 합으로 같다[^s1].

속도를 올리면 비트 하나가 선 위에서 차지하는 시간(비트 폭)이 줄어든다. 1 Mbps에서는 비트 하나가 1 μs, 2 Mbps에서는 0.5 μs다. 비트 사이가 좁아지는 것이다[^3]. 비트 폭이 좁아지면 간섭이나 잡음에 약해진다[^5].

"대역폭"은 두 뜻으로 쓰인다. 주파수 분할 다중화 슬라이드의 채널 폭 4 kHz는 신호가 차지하는 **주파수 범위의 폭**이다[^1]. 통계적 다중화 슬라이드의 "Wasted Bandwidth", "Extra Bandwidth Available"은 링크가 실어 나르는 **전송 속도**의 몫이다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 120 μs, 12 μs, 2 ms, 비트 폭 1 μs와 0.5 μs, 카드 C2·C4의 값 — [05_rate-and-bandwidth_verify.py](/Hongs_Blog/studies/computer-communication/code/05_rate-and-bandwidth_verify/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **대역폭**(전송률) $$R$$: 1초에 보낼 수 있는 데이터의 양. 단위는 bps(초당 비트 수). 예: 10 Mbps[^3]. 링크 하나의 대역폭과, 출발지에서 목적지까지 경로 전체의 대역폭(종단 간 대역폭)을 구별한다[^3].
- **전송 시간**(전송 지연): $$L$$비트를 링크에 모두 싣는 시간. 크기 ÷ 대역폭, 즉 $$d_{\text{trans}} = L / R$$ (초)[^4].
- **전파 지연**: 신호가 링크의 한쪽 끝에서 다른 끝까지 가는 시간. 거리 ÷ 신호 속도, 즉 링크 길이를 $$x$$, 신호 속도를 $$v$$라 하면 $$d_{\text{prop}} = x / v$$ (초)[^4].
- **비트 폭**: 비트 하나가 선 위에서 차지하는 시간 $$1/R$$[^3].
- 처리·대기 지연이 없으면, 링크 하나를 건너 패킷이 끝까지 도착하는 시간은 $$d_{\text{trans}} + d_{\text{prop}}$$이다.
- **주파수 대역폭** $$B$$: 신호가 차지하는 주파수 범위의 폭. 단위 Hz.

표기[^3]: 전송률의 접두어는 10진이다(1 Mbps $$= 10^6$$ bps). 데이터 크기의 KB는 2진이다(1 KB $$= 2^{10}$$바이트). 1바이트 $$= 8$$비트.

</div>


대역폭은 이론상 낼 수 있는 최상의 속도, 보통 링크의 최대 속도에 가깝다[^5]. 실제로 낸 속도는 [처리량](/Hongs_Blog/studies/computer-communication/throughput/)이다.

두 대역폭은 관련이 있다. 주파수 폭이 넓을수록 실을 수 있는 최대 전송률도 커진다. 정확한 관계(섀넌 용량 공식)는 이 문서의 범위 밖이다[^s2].

## 예제

- 짧은 링크: 건물 안 100 m 광케이블에서 $$d_{\text{prop}} = 100 / (2 \times 10^8) = 0.5\ \mu\text{s}$$다. 위 표의 전송 지연보다 훨씬 작아서 무시하기 쉽다.
- 긴 링크: 약 36,000 km 위의 정지 궤도 위성까지는 진공에서 신호 속도 $$3 \times 10^8$$ m/s로도 약 0.12초가 걸린다. 전송률을 아무리 올려도 이 시간은 줄지 않는다[^6].

## 활용

- [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)의 저장 후 전달 지연은 링크마다 $$L/R$$을 더해 계산한다.
- [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/)과 [시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)는 링크의 전송률 $$R$$을 나눠 준다. [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)는 주파수 대역폭 $$B$$를 나눠 준다.
- 흔한 실수는 바이트와 비트를 섞는 것이다. 전송률은 비트로 세므로 바이트 수에 8을 곱한 뒤 나눈다.
- 또 하나의 흔한 실수는 크기의 KB와 속도의 kbps를 같은 접두어로 보는 것이다(카드 C4).
- 소요시간 전체(전파 + 전송 + 큐잉)는 [소요시간](/Hongs_Blog/studies/computer-communication/latency/)에서 다룬다.

## 연결

- 선수: [점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)(링크의 성질)
- 이어지는 개념: [버스티 트래픽](/Hongs_Blog/studies/computer-communication/bursty-traffic/)(시간에 따라 바뀌는 전송률), [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"전송률이 높은 링크에서는 신호가 더 빨리 달린다"</div>

틀렸다. "빠른 인터넷"이라는 말 때문에 신호 자체가 빨리 가는 것처럼 느껴진다. 실제로 전송률이 바꾸는 것은 데이터를 선에 싣는 빠르기다. 신호가 선을 따라 가는 속도는 매체가 정하고, 전파 지연은 링크 길이로 정해진다. 위 표에서 1 Gbps로 올려도 400 km를 건너는 2 ms는 그대로다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 전송 지연과 전파 지연을 각각 정의하고, 무엇으로 정해지는지 식으로 쓰라.</summary>


**답:** 전송 지연은 패킷의 모든 비트를 링크에 싣는 시간으로 $$L/R$$(패킷 길이 ÷ 전송률)이다. 전파 지연은 신호가 링크 끝까지 가는 시간으로 링크 길이 ÷ 매체에서의 신호 속도다.<br>
**흔한 오답:** 두 지연을 모두 전송률로 정해진다고 쓰는 것. 전파 지연은 전송률과 무관하다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 1,250바이트 패킷을 10 Mbps, 길이 3,000 km 링크로 보낸다. 신호 속도는 $$2 \times 10^8$$ m/s다. 전송 지연과 전파 지연은? 전송률을 100 Mbps로 올리면 각각 어떻게 되는가?</summary>


**답:** $$L = 10{,}000$$비트. 전송 지연 $$10{,}000 / 10^7 = 1$$ ms. 전파 지연 $$3 \times 10^6 / (2 \times 10^8) = 15$$ ms. 100 Mbps에서는 전송 지연 0.1 ms, 전파 지연은 15 ms 그대로다.<br>
**흔한 오답:** 1,250을 그대로 나눠 전송 지연을 0.125 ms라고 하는 것. 바이트를 비트로 바꾸지 않았다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> (a) 주파수 분할 다중화 슬라이드의 "채널 폭 4 kHz" (b) 통계적 다중화 슬라이드의 "Extra Bandwidth Available"에서 대역폭은 각각 무엇을 뜻하고, 단위는 무엇인가?</summary>


**답:** (a) 신호가 차지하는 주파수 범위의 폭. 단위 Hz. (b) 링크가 실어 나르는 전송 속도 중 남는 몫. 단위 bps.<br>
**흔한 오답:** 둘 다 같은 양으로 보고 단위를 섞는 것. 둘은 관련이 있지만 서로 다른 양이다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 1 KB 파일을 1 kbps 링크로 싣는 데 걸리는 시간은? 흔한 오답 8초와 왜 다른가?</summary>


**답:** 1 KB $$= 2^{10} = 1{,}024$$바이트 $$= 8{,}192$$비트. 1 kbps $$= 1{,}000$$ bps. $$8{,}192 / 1{,}000 = 8.192$$초.<br>
**이유:** 크기의 K는 $$2^{10}$$, 속도의 k는 $$10^3$$이다. 둘을 같은 1,000으로 보면 8초가 나온다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260924204202.png — 슬라이드 "주파수분할 다중화", 반송파 64·68·72 kHz 스펙트럼
[^2]: 4-1학기/pasted_images/Pasted image 20260924204837.png — 슬라이드 "통계적 다중화", Wasted Bandwidth / Extra Bandwidth Available
[^3]: 4-1학기/pasted_images/Pasted image 20260925230348.png — 슬라이드 "성능 (Performance): 대역폭". 비트 폭 그림: 1 Mbps는 비트당 1 μs, 2 Mbps는 0.5 μs
[^4]: 4-1학기/pasted_images/Pasted image 20260925231047.png — 슬라이드 "성능: 소요시간/지연시간". 신호 속도: 진공 3.0 × 10⁸, 케이블 2.3 × 10⁸, 광케이블 2.0 × 10⁸ m/s
[^5]: 4-1학기/컴퓨터 통신/2.필기노트/03.3주차.md, 36~43행
[^6]: 4-1학기/pasted_images/Pasted image 20260927203919.png — 슬라이드 "위성통신", 정지궤도 약 36,000 km
[^s1]: 에이전트 보충. 기차 비유와 그 한계(실제 신호는 첫 비트가 실리자마자 나아가지만 마지막 비트의 도착 시각은 같음)는 원본에 없다. Kurose & Ross, *Computer Networking: A Top-Down Approach*, 1.4절의 비유와 같다.
[^s2]: 에이전트 보충. 주파수 대역폭과 최대 전송률의 관계는 섀넌 용량 공식 $$C = B \log_2(1 + S/N)$$이 준다. 1주차 자료에는 나오지 않는다.
{% endraw %}
