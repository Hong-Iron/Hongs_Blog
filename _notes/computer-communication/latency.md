---
layout: "note"
title: "소요시간"
display_title: "소요시간 (Latency)"
kind: "concept"
kind_label: "정의"
num: "25"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Latency", "Delay", "지연시간", "지연", "왕복지연시간", "RTT", "round-trip time", "큐잉 지연", "대기 지연", "queuing delay", "처리 지연", "processing delay", "스위칭 시간", "지터", "jitter", "광속", "speed of light"]
description: "소요시간은 메시지가 A에서 B까지 가는 데 걸리는 시간이다. 택배로 치면 트럭에 짐을 싣는 시간, 길을 달리는 시간, 물류센터에서 차례를 기다리는 시간을 모두 더한 값이다. 전송률을 올리면 싣는 시간만 줄고, 달리는 시간은 거리와 빛의 속도가 정한다. 기다리는 시간은 그때그때의 교…"
prev_url: "/studies/computer-communication/internet-architecture/"
prev_title: "인터넷 구조"
next_url: "/studies/computer-communication/timing-analysis/"
next_title: "소요시간 분석"
math: true
mermaid: false
code_count: 2
permalink: "/studies/computer-communication/latency/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소요시간은 메시지가 A에서 B까지 가는 데 걸리는 시간이다. 택배로 치면 트럭에 짐을 싣는 시간, 길을 달리는 시간, 물류센터에서 차례를 기다리는 시간을 모두 더한 값이다. 전송률을 올리면 싣는 시간만 줄고, 달리는 시간은 거리와 빛의 속도가 정한다. 기다리는 시간은 그때그때의 교통량에 따라 들쭉날쭉하다.

</div>


## 예시로 보기

A와 B가 1,000 km 떨어져 있다. 신호가 이 거리를 건너는 시간은 매체마다 다르다[^1].

| 매체 | 신호 속도 | 1,000 km 전파 지연 |
|---|---|---|
| 진공 | $$3.0 \times 10^8$$ m/s | 약 3.33 ms |
| 구리 케이블 | $$2.3 \times 10^8$$ m/s | 약 4.35 ms |
| 광케이블 | $$2.0 \times 10^8$$ m/s | 5 ms |

광케이블로 직접 이은 10 Mbps 링크에 8,000비트 패킷을 보내면, 전파 5 ms에 싣는 시간 0.8 ms가 더해져 5.8 ms다. 직접 링크라 기다리는 시간은 없다. B가 같은 크기로 바로 답하면 왕복은 11.6 ms다.

아래 정의의 기호를 택배로 읽으면 짐의 크기가 $$M$$, 트럭에 싣는 빠르기가 전송률 $$R$$, 길의 길이가 거리 $$x$$, 달리는 속도가 신호 속도 $$v$$다.

수강신청 서버 가까이에서 신청하면 유리한 이유도 여기에 있다. 대역폭이 같아도 거리가 짧으면 전파 지연이 준다. 처리량이 높다고 소요시간이 무조건 짧아지는 것은 아니다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 3.33·4.35·5 ms, 5.8 ms와 11.6 ms, 카드 C2·C3 — [25_latency_verify.py](/Hongs_Blog/studies/computer-communication/code/25_latency_verify/)</div>

</div>


## 정의

소요시간 또는 지연시간은 A 지점에서 B 지점으로 메시지를 보내는 데 걸리는 시간이다. 보통 ms 단위로 잰다. 때로는 왕복 지연시간(RTT), 즉 A에서 B로 갔다가 A로 돌아오는 시간이 중요하다[^1].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

링크 하나를 건너는 소요시간은 "달리는 시간 + 싣는 시간 + 기다리는 시간(+ 살펴보는 시간)"이다[^1].

$$T = d_{\text{prop}} + d_{\text{trans}} + d_{\text{queue}} \ [+\ d_{\text{proc}}]$$

- 전파 지연 $$d_{\text{prop}} = x / v$$: 거리 $$x$$를 신호 속도 $$v$$로 나눈 값.
- 전송 시간 $$d_{\text{trans}} = M / R$$: 크기 $$M$$비트를 대역폭 $$R$$로 나눈 값.
- 큐잉 지연 $$d_{\text{queue}}$$: 노드의 버퍼에서 차례를 기다리는 시간. 직접 링크에는 없다.
- 스위칭(처리) 시간 $$d_{\text{proc}}$$: 노드가 패킷을 살펴 내보낼 곳을 정하는 시간.

</div>


앞의 두 항은 [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)에서 정의한 것과 같다. 여러 링크를 거치면 링크마다 이 항들이 더해진다. 그 계산은 [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)에서 한다.

큐잉 지연만 성격이 다르다. 나머지는 거리와 크기로 정해지지만, 큐잉 지연은 그 순간 같은 링크를 쓰려는 트래픽의 양(수요)에 따라 바뀐다. 그래서 패킷 스위칭에서는 패킷마다 소요시간이 다르다. 이 변동을 확률 모형(마르코프 연쇄를 쓰는 대기 행렬 모형)으로 분석한다[^2]. 패킷마다 소요시간이 들쭉날쭉한 정도를 **지터**라 한다[^3].

가장 단순한 대기 행렬 모형에서는 링크가 바쁠수록 평균 큐잉 지연이 아래처럼 늘어난다. 가로축은 들어오는 비트의 양을 링크 전송률로 나눈 값이다. 이 값을 트래픽 강도라 하고 $$\rho$$(로)로 쓴다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/25_latency_fig1.svg" alt="그림" loading="lazy">

링크가 절반쯤 바쁠 때($$\rho = 0.5$$)는 평균 대기가 패킷 하나를 싣는 시간 정도다. $$\rho = 0.9$$가 되면 그 9배이고, 1에 가까워질수록 끝없이 커진다. 링크가 아직 꽉 차지 않았는데도 대기가 폭발하는 것은, 패킷이 고르게 오지 않고 몰려서 오기 때문이다[^s1].

응용이나 프로세스 사이의 소요시간에는 소프트웨어의 처리 부하도 들어간다. 거리가 짧고 전송이 빠르면 앞의 항들이 작아져서, 소프트웨어 부하가 중요한 몫이 된다[^3].

## 활용

- 게임이나 원격 제어처럼 작은 메시지를 자주 주고받는 응용은 소요시간이 중요하다[^4]. 크기와 소요시간의 관계는 [처리량](/Hongs_Blog/studies/computer-communication/throughput/)에서 다룬다.
- 흔한 실수는 전송률을 올리면 소요시간이 같은 비율로 준다고 보는 것이다. 멀리 가는 작은 메시지에서는 전파 지연이 대부분이라 거의 줄지 않는다(카드 C3).

## 연결

- 선수: [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)(전파·전송 지연), [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)(버퍼와 대기)
- 경로 전체의 계산: [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)
- 대역폭과 곱한 값: [대역폭-지연 곱](/Hongs_Blog/studies/computer-communication/bandwidth-delay-product/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 소요시간의 구성 요소를 모두 쓰고, 전파 지연과 전송 시간의 식을 쓰라. 직접 링크에서 빠지는 항은 무엇인가?</summary>


**답:** 전파 지연 + 전송 시간 + 큐잉 지연 (+ 스위칭 시간). 전파 지연 = 거리 ÷ 신호 속도. 전송 시간 = 크기 ÷ 대역폭. 직접 링크에는 큐잉 지연이 없다.<br>
**흔한 오답:** 전파 지연을 "크기 ÷ 신호 속도"로 쓰는 것. 전파 지연은 크기와 무관하다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 구리 케이블($$2.3 \times 10^8$$ m/s)로 4,600 km 떨어진 두 노드를 2 Mbps 직접 링크로 잇는다. 1,250바이트 패킷의 소요시간은? B가 같은 크기로 바로 답하면 RTT는?</summary>


**답:** 전송 $$10{,}000 / (2 \times 10^6) = 5$$ ms. 전파 $$4.6 \times 10^6 / (2.3 \times 10^8) = 20$$ ms. 소요시간 25 ms. RTT 50 ms.<br>
**흔한 오답:** 1,250을 비트로 바꾸지 않아 전송 시간을 0.625 ms로 계산하는 것.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 광케이블 4,000 km 링크에서 100바이트 메시지를 보낸다. 전송률을 10 Mbps에서 100 Mbps로 10배 올리면 소요시간은 얼마에서 얼마로 바뀌는가? 거의 줄지 않는 이유는?</summary>


**답:** 20.08 ms → 20.008 ms. 0.4%도 줄지 않는다. 전파 지연 20 ms가 대부분이고, 전송률은 전송 시간(0.08 ms → 0.008 ms)만 바꾸기 때문이다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260925231047.png — 슬라이드 "성능: 소요시간/지연시간". 신호 속도 3.0·2.3·2.0 × 10⁸ m/s, "직접 링크에서는 큐잉 지연(queuing delay)은 없음"
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/03.3주차.md, 45~58행
[^3]: 4-1학기/pasted_images/Pasted image 20260926020456.png — 슬라이드 "성능: 기타 사항". 지터, 소프트웨어 처리 부하
[^4]: 4-1학기/컴퓨터 통신/2.필기노트/03.3주차.md, 89~90행
[^s1]: 에이전트 보충. 그림 한 장과 식 $$\rho/(1-\rho)$$는 원본에 없다. 패킷이 서로 독립으로 무작위하게(포아송 과정) 오고 크기도 무작위(지수 분포)인 가장 단순한 대기 행렬(M/M/1)의 평균 대기 시간이다(Kleinrock, *Queueing Systems*, Vol. 1, 3장). Kurose & Ross, *Computer Networking: A Top-Down Approach*, 1.4절도 트래픽 강도가 1에 가까워지면 큐잉 지연이 급격히 커진다고 설명한다. [25_latency_plot.py](/Hongs_Blog/studies/computer-communication/code/25_latency_plot/)로 그렸고, 식의 값($$\rho = 0.5, 0.8, 0.9$$에서 1, 4, 9)과 패킷 20만 개 시뮬레이션이 식과 15% 안에서 맞는 것을 같은 코드로 확인했다. 실제 인터넷 트래픽은 이 가정과 다르므로 정확한 값보다 곡선의 모양을 본다.
{% endraw %}
