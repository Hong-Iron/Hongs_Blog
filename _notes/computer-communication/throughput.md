---
layout: "note"
title: "처리량"
display_title: "처리량 (Throughput)"
kind: "concept"
kind_label: "정의"
num: "27"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Throughput", "처리속도", "실효 처리량", "effective throughput", "전송 완료 시간", "transfer time", "TransferTime"]
description: "처리량은 실제로 1초에 몇 비트를 받아 냈는지다. 고속도로의 제한속도가 대역폭이라면, 처리량은 출발 전 준비 시간과 톨게이트 대기까지 합쳐 실제로 낸 평균 속도다. 그래서 대역폭이 아무리 커도 작은 메시지는 소요시간에 묶여 처리량이 낮다. 메시지가 클수록 처리량이 대역폭에 가까워진다."
prev_url: "/studies/computer-communication/timing-analysis/"
prev_title: "소요시간 분석"
next_url: "/studies/computer-communication/bandwidth-delay-product/"
next_title: "대역폭-지연 곱"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/throughput/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

처리량은 실제로 1초에 몇 비트를 받아 냈는지다. 고속도로의 제한속도가 대역폭이라면, 처리량은 출발 전 준비 시간과 톨게이트 대기까지 합쳐 실제로 낸 평균 속도다. 그래서 대역폭이 아무리 커도 작은 메시지는 소요시간에 묶여 처리량이 낮다. 메시지가 클수록 처리량이 대역폭에 가까워진다.

</div>


## 예시로 보기

대역폭과 소요시간 중 무엇이 더 중요한지는 메시지 크기에 달렸다[^1]. 총 시간은 소요시간에 싣는 시간(크기 ÷ 대역폭)을 더한 값이다.

| 메시지 | 소요시간 1 ms, 1 Mbps | 소요시간 1 ms, 100 Mbps | 소요시간 100 ms, 1 Mbps |
|---|---|---|---|
| 1바이트 | 1.008 ms | 1.00008 ms | 100.008 ms |
| 25 MB | 약 209.7초 | 약 2.1초 | 약 209.8초 |

1바이트에서는 소요시간 1 ms와 100 ms의 차이(99 ms)가 대역폭 1 Mbps와 100 Mbps의 차이(0.008 ms)를 압도한다. 25 MB에서는 반대로 대역폭이 100배 차이를 만들고, 소요시간 99 ms는 묻힌다. 게임은 소요시간이, 영상은 대역폭이 중요한 이유다[^2].

메시지 크기가 아래 식의 $$M$$, 소요시간이 RTT, 대역폭이 $$R$$이다. 도로 비유와 달리 통신에서는 대역폭을 늘려도 소요시간 중 전파 지연은 줄지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 값, 1 MB·1 Gbps와 1 KB·1 Mbps의 싣는 시간, 카드 C2의 77.4 Mbps — [27_throughput_verify.py](/Hongs_Blog/studies/computer-communication/code/27_throughput_verify/)</div>

</div>


## 정의

대역폭이 링크가 이론상 낼 수 있는 최대 속도라면, 처리량은 실제로 낸 속도다[^2][^3].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

크기 $$M$$비트를 보내기 시작해서 다 받기까지 걸린 전송 완료 시간을 $$T_{\text{xfer}}$$라 하면[^1]

$$\text{처리량} = \frac{M}{T_{\text{xfer}}}$$

회선 스위칭처럼 RTT 하나를 들인 뒤 대역폭 $$R$$로 흘려보내면 $$T_{\text{xfer}} = \text{RTT} + M/R$$이다. 패킷 스위칭의 $$T_{\text{xfer}}$$는 여러 요소에 영향을 받으며, [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)으로 구한다[^1].

</div>


RTT가 0보다 크면 처리량은 늘 $$R$$보다 작다. $$M$$이 커질수록 RTT의 몫이 줄어 처리량이 $$R$$에 다가간다.

대역폭이 무한대에 가까워지면 $$M/R$$이 사라지고 $$T_{\text{xfer}} \approx \text{RTT}$$만 남는다. 이때는 총 소요시간이 중요하다[^1]. 1 Gbps 링크에서 1 MB 파일을 싣는 시간(약 8.39 ms)은 1 Mbps 링크에서 1 KB 패킷을 싣는 시간(약 8.19 ms)과 비슷하다. 링크가 빨라지면 큰 파일도 "작은 메시지"처럼 소요시간에 묶인다. 다만 대역폭이 늘면 주고받는 데이터도 같이 커진다[^1].

## 활용

- 오늘날 대역폭은 계속 늘고 있어서 대체로 소요시간이 더 중요해지고 있다. 실시간 원격 제어 같은 응용도 늘고 있다[^1][^2].
- 응용마다 대역폭 요구를 따질 때는 평균이 아니라 몰릴 때의 최고 속도(peak rate)도 본다[^4]. [버스티 트래픽](/Hongs_Blog/studies/computer-communication/bursty-traffic/)의 최대 대 평균 비와 같은 이야기다.
- 메시지 길이가 1이면 대역폭은 의미가 없다. 싣는 시간이 거의 0이라 소요시간만 남는다[^4].
- 흔한 실수는 크기 단위를 섞는 것이다. 슬라이드 표기에서 KB는 $$2^{10}$$바이트이고, Mbps는 $$10^6$$ bps다[^3].

## 연결

- 선수: [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)(전송 완료 시간), [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)
- 대역폭과 소요시간을 곱한 양: [대역폭-지연 곱](/Hongs_Blog/studies/computer-communication/bandwidth-delay-product/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 처리량의 정의 식과 회선 스위칭의 전송 완료 시간 식을 쓰고, 처리량이 대역폭보다 작아지는 이유를 쓰라.</summary>


**답:** 처리량 = 전송 크기 ÷ 전송 완료 시간. 회선 스위칭: 전송 완료 시간 = RTT + 크기 ÷ 대역폭. 전송 완료 시간에 RTT가 더해지므로, 같은 크기를 보내는 데 대역폭만으로 계산한 시간보다 오래 걸린다. 그래서 처리량은 대역폭보다 작다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> RTT가 100 ms인 1 Gbps 링크로 1 MB($$2^{20}$$바이트) 파일을 보낸다. 전송 완료 시간과 처리량은? 대역폭의 몇 %인가?</summary>


**답:** $$M = 8{,}388{,}608$$비트. 싣는 시간 약 8.39 ms. $$T_{\text{xfer}} \approx 100 + 8.39 = 108.39$$ ms. 처리량 $$\approx 8{,}388{,}608 / 0.10839 \approx 77.4$$ Mbps. 대역폭의 약 7.7%다.<br>
**흔한 오답:** 처리량을 1 Gbps라고 하는 것. 이 크기에서는 RTT가 시간의 대부분이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 응용에서 대역폭과 소요시간 중 무엇이 더 중요한가? (a) 온라인 게임의 조작 신호 (b) 4K 영화 스트리밍 (c) 원격 수술 로봇의 제어 명령 (d) 밤새 하는 서버 백업</summary>


**답:** (a) 소요시간. 메시지가 작고 바로 반응해야 한다. (b) 대역폭. 큰 데이터를 끊김 없이 받아야 한다. 처음 재생이 조금 늦는 것은 버퍼로 감춘다. (c) 소요시간. 실시간 원격 제어다. (d) 대역폭. 데이터가 크고 조금 늦어도 된다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260926012124.png — 슬라이드 "성능 (Performance) (3)". 원문의 빨간 글씨: "(?)", "데이터도 같이 증가!"
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/03.3주차.md, 86~96행
[^3]: 4-1학기/pasted_images/Pasted image 20260925230348.png — 슬라이드 "성능 (Performance): 대역폭". 표기 방법 KB = 2¹⁰ bytes, Mbps = 10⁶ bits per second. 필기 03.3주차.md 36~40행도 대역폭을 "이론상 최상의 속도", "링크의 최대속도"로 적는다
[^4]: 4-1학기/pasted_images/Pasted image 20260926020456.png — 슬라이드 "성능: 기타 사항"
{% endraw %}
