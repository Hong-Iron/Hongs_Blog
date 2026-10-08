---
layout: "note"
title: "패킷 스위칭"
display_title: "패킷 스위칭 (Packet Switching)"
kind: "concept"
kind_label: "모델"
num: "08"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Packet Switching", "패킷 교환", "저장 후 전달", "store-and-forward", "패킷", "packet", "혼잡", "congestion", "버퍼링", "buffering", "FIFO", "버퍼 오버플로우", "buffer overflow"]
description: "편지마다 주소를 적어 우체국에 맡기면 우체국들이 받아서 분류한 뒤 다음 우체국으로 넘기는 것처럼, 데이터를 작은 묶음으로 나눠 길을 미리 잡지 않고 보내는 방식이다. 보낼 것이 있을 때만 링크를 쓰므로 쉬는 사용자 몫의 낭비가 없다. 대신 묶음이 한꺼번에 몰리면 줄을 서서 기다리거…"
prev_url: "/studies/computer-communication/bursty-traffic/"
prev_title: "버스티 트래픽"
next_url: "/studies/computer-communication/contrast--circuit-switching--packet-switching/"
next_title: "회선 스위칭과 패킷 스위칭 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/packet-switching/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

편지마다 주소를 적어 우체국에 맡기면 우체국들이 받아서 분류한 뒤 다음 우체국으로 넘기는 것처럼, 데이터를 작은 묶음으로 나눠 길을 미리 잡지 않고 보내는 방식이다. 보낼 것이 있을 때만 링크를 쓰므로 쉬는 사용자 몫의 낭비가 없다. 대신 묶음이 한꺼번에 몰리면 줄을 서서 기다리거나 버려질 수 있고, 속도와 지연을 약속하지 못한다.

</div>


## 예시로 보기

슬라이드는 패킷 스위칭을 우편에 빗댄다[^1]. 편지마다 받는 주소를 쓰고, 우체국마다 편지를 받아 분류한 뒤 다음 우체국으로 보낸다. 도로를 미리 비워 두지 않는다.

링크 2개(스위치 1개)로 패킷 3개를 보내는 과정을 시간 순서로 옮긴다. 시간 단위는 패킷 하나를 링크에 싣는 데 걸리는 시간 $$L/R$$이다.

| 시간 ($$L/R$$ 단위) | 링크 1 (출발지 → 스위치) | 링크 2 (스위치 → 목적지) |
|---|---|---|
| [0, 1) | 패킷 1 | — |
| [1, 2) | 패킷 2 | 패킷 1 |
| [2, 3) | 패킷 3 | 패킷 2 |
| [3, 4) | — | 패킷 3 |

패킷 1은 시각 1에 스위치에 **완전히** 도착한 뒤에야 링크 2로 나간다. 이것이 저장 후 전달(store-and-forward)이다. 세 패킷은 파이프라인처럼 겹쳐 흘러 모두 시각 4에 도착한다.

우체국이 스위치, 편지 한 통이 패킷이다. 편지 한 통을 트럭에 싣는 데 걸리는 시간이 $$L/R$$이다($$L$$은 패킷 크기(비트), $$R$$은 링크의 전송률). 우체국에서 분류하는 시간은 0으로 친다(처리 지연 0). 비유가 다른 곳도 있다. 우체국은 편지를 오래 쌓아 둘 수 있지만, 스위치의 저장 공간(버퍼)은 작아서 넘치면 패킷을 버린다[^3].

## 정의

패킷 스위칭은 링크를 미리 할당하지 않고, 데이터를 묶음(패킷) 단위로 보내며, 스위치가 패킷마다 저장 후 전달하는 스위칭 방식이다[^1][^2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">저장 후 전달 지연</div>

전송률 $$R$$(bps)인 링크 $$H \in \mathbb{Z}^+$$개($$\mathbb{Z}^+$$는 1 이상의 정수)를 지나는 경로로, 길이 $$L$$비트인 패킷 $$P \in \mathbb{Z}^+$$개를 연달아 보낸다. 그러면 패킷 $$k$$($$1 \le k \le P$$)는 시각 $$(H + k - 1)\,L/R$$에 목적지에 도착한다. 특히 패킷 하나의 지연은 $$H \cdot L/R$$이고, 모두 도착하는 시각은 $$(H + P - 1)\,L/R$$이다[^s2].
- 전파·처리 지연과 다른 트래픽으로 인한 대기 지연은 0이다.
- 패킷 $$P$$개는 시각 0에 출발지에 모두 있다.
- 링크는 한 번에 패킷 하나만, 먼저 온 순서대로 싣는다.
- 노드는 패킷을 끝까지 받은 뒤에만 다음 링크로 보낸다.

</div>


숫자로 보면, 링크 3개로 패킷 5개를 보낼 때 $$(3 + 5 - 1) = 7$$단위 시간이 걸린다. 패킷을 하나씩 끝까지 보낸 뒤 다음 것을 보내면 $$3 \times 5 = 15$$단위가 걸린다. 앞 패킷이 다음 링크로 넘어가는 동안 뒤 패킷이 바로 따라 들어와 겹쳐 흐르기 때문에 7로 줄어든다[^s2].

| 보장한다 | 보장하지 않는다[^s1] |
|---|---|
| 보낼 것이 있는 패킷만 링크를 차지한다. 쉬는 사용자의 몫이 묶여 있지 않다[^1] | 전송률, 지연의 상한, 손실 없음 |
| 연결 설정 없이 바로 보낼 수 있다 | 보낸 순서대로의 도착 (패킷마다 다른 경로로 갈 수 있다) |

여러 곳에서 온 패킷이 한 링크로 몰려 섞인다. 한꺼번에 나갈 수 없으니 스위치는 아직 못 나간 패킷을 잠깐 쌓아 둔다(버퍼링). 쌓인 패킷은 먼저 온 순서(FIFO)로, 또는 다른 규칙으로 내보낸다. 쌓아 둘 자리(버퍼)가 넘치는 상태를 혼잡이라 부른다[^3]. 넘친 패킷은 버린다. 버린 패킷을 다시 보내면 망에 트래픽이 더 늘어 혼잡이 쌓인다[^4].

## 증명

전략: 패킷 $$k$$가 링크 $$i$$를 다 건너는 시각을 $$F(k, i)$$라 하고, 이 값이 앞 값들로 어떻게 정해지는지(점화식)를 세운다. 그다음 $$k + i$$에 대한 강한 귀납법으로 바로 계산하는 식(닫힌 식)을 보인다. 시간 단위는 $$L/R = 1$$이다.

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


1. **점화식.** 패킷 $$k$$가 링크 $$i$$에 실리려면 (a) 패킷 $$k$$가 링크 $$i-1$$을 다 건너 앞 노드에 완전히 도착해야 하고(저장 후 전달), (b) 링크 $$i$$가 앞 패킷 $$k-1$$을 다 실어야 한다(한 번에 하나, 도착 순). 둘 중 늦은 쪽 뒤에 실리고 1만큼 걸린다.

   $$F(k, i) = \max\big(F(k, i-1),\ F(k-1, i)\big) + 1$$

   경계: $$F(k, 0) = 0$$ (시각 0에 출발지에 있음), $$F(0, i) = 0$$ (앞 패킷 없음).
2. **주장.** $$k, i \ge 1$$이면 $$F(k, i) = k + i - 1$$.
3. **경계 줄.** $$k = 1$$이면 $$F(1, i) = \max(F(1, i-1), 0) + 1 = F(1, i-1) + 1$$이고 $$F(1, 0) = 0$$이므로 $$F(1, i) = i$$다. $$i = 1$$이면 $$F(k, 1) = \max(0, F(k-1, 1)) + 1 = F(k-1, 1) + 1$$이고 $$F(0, 1) = 0$$이므로 $$F(k, 1) = k$$다. 둘 다 주장과 같다. — 점화식과 경계값
4. **귀납 단계 ($$k, i \ge 2$$).** 합이 $$k + i$$보다 작은 모든 경우에 주장이 맞는다고 하자. 그러면 $$F(k, i-1) = k + i - 2$$이고 $$F(k-1, i) = k + i - 2$$다. — 귀납 가정
5. 두 항이 같으므로 $$\max$$는 $$k + i - 2$$이고, $$F(k, i) = k + i - 1$$이다. — 점화식
6. 목적지 도착 시각은 $$F(k, H) = H + k - 1$$이다. 단위를 되돌리면 $$(H + k - 1)\,L/R$$이다. ∎

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 점화식을 쓰지 않는 틱 단위 시뮬레이션, 점화식, 닫힌 식이 $$H, P = 1, \dots, 10$$의 모든 경우에 같음 (실험으로 확인. 모든 경우에 맞는 이유는 위 증명) — [08_packet-switching_verify.py](/Hongs_Blog/studies/computer-communication/code/08_packet-switching_verify/)</div>

</div>


### 스스로 설명해 보기

1. 점화식의 첫 항 $$F(k, i-1)$$
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   저장 후 전달 가정. 패킷 $$k$$가 앞 노드에 완전히 도착해야 링크 $$i$$에 실을 수 있다.
   </details>
2. 점화식의 둘째 항 $$F(k-1, i)$$
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   링크는 한 번에 하나를 먼저 온 순서대로 싣는다는 가정. 앞 패킷이 링크 $$i$$를 비워야 한다.
   </details>
3. 4단계에서 두 항이 모두 $$k + i - 2$$인 이유
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   귀납 가정을 두 항에 각각 적용하면 $$k + (i-1) - 1$$과 $$(k-1) + i - 1$$이 되고, 둘은 같다.
   </details>
- 이 증명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  패킷은 앞 링크와 앞 패킷을 둘 다 기다린다. 파이프라인이 꽉 차면 두 기다림이 똑같이 끝나서 한 칸씩 밀려 흐른다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  CPU 명령어 파이프라인의 완료 시각, 공장 조립 라인(작업 $$H$$단계, 제품 $$P$$개 → $$H + P - 1$$ 단위 시간).
  </details>

## 예제

풀이 예제는 [패킷 스위칭 예제 사다리](/Hongs_Blog/studies/computer-communication/packet-switching-ladder/)에 단계별로 있다.

- $$H = 1$$(스위치 없음): $$P \cdot L/R$$. 직접 링크로 $$P$$개를 차례로 보내는 시간과 같다.
- $$P = 1$$: $$H \cdot L/R$$. 링크마다 전송 시간이 한 번씩 더해진다.
- "링크는 한 번에 하나" 가정을 빼면(링크가 여러 패킷을 동시에 실을 수 있다면) 둘째 항이 사라져 모든 패킷이 $$H \cdot L/R$$에 도착한다. 하지만 실제 링크는 한 번에 패킷 하나씩만 싣기 때문에 이런 일은 없다.
- "대기 지연 0" 가정을 빼면 다른 사용자의 패킷이 같은 출력 링크에 몰려 있을 때 정리의 값보다 늦어진다(혼잡).

## 활용

- 인터넷이 패킷 스위칭을 쓴다[^1].
- 흔한 실수는 전송 시간 $$L/R$$을 경로 전체에 한 번만 더하는 것이다. 저장 후 전달에서는 링크마다 더한다.
- 이더넷 스위치에는 저장 후 전달 외에, 패킷 앞부분(목적지 주소)만 받고 바로 내보내는 cut-through 방식도 있다. 저장 후 전달은 패킷 전체를 받은 뒤 오류를 검사하고 보낼 수 있다[^s1].

## 연결

- 선수: [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/), [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/), [버스티 트래픽](/Hongs_Blog/studies/computer-communication/bursty-traffic/)
- 짝이 되는 개념: [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/) → [회선 스위칭과 패킷 스위칭 비교](/Hongs_Blog/studies/computer-communication/contrast--circuit-switching--packet-switching/)
- 스위치의 출력 링크를 [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)로 나눠 쓰는 것과 같은 구조다. 패킷마다 붙는 목적지 정보가 통계적 다중화에서 조각마다 붙는 주소와 같은 역할을 한다. 둘이 어떻게 다른지는 [패킷 스위칭과 통계적 다중화 비교](/Hongs_Blog/studies/computer-communication/contrast--packet-switching--statistical-multiplexing/)에 있다.
- 버퍼에서 기다리는 시간(큐잉 지연)과 전파·처리 지연까지 넣은 계산: [소요시간](/Hongs_Blog/studies/computer-communication/latency/), [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"스위치는 패킷의 앞부분이 들어오자마자 다음 링크로 흘려보낸다"</div>

저장 후 전달 방식에서는 틀렸다. 회선 스위칭이 비트스트림을 멈춤 없이 흘려보내니 패킷 스위칭도 그럴 것처럼 느껴진다. 실제로 스위치는 패킷 전체를 다 받아 저장한 **다음에** 내보낸다. 그래서 링크마다 $$L/R$$이 더해진다. 위 표에서 패킷 1은 링크 1을 다 건넌 시각 1이 되어서야 링크 2에 실린다. 앞부분만 받고 보내는 cut-through는 따로 있는 방식이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 슬라이드에 나온 패킷 스위칭의 특징 세 가지를 쓰라.</summary>


**답:** ① 링크를 사전 할당하지 않는다. ② 데이터를 묶음(패킷)으로 전송한다. ③ 스위치는 패킷마다 store-and-forward로 동작한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 링크 3개(스위치 2개)로 패킷 2개를 저장 후 전달로 보낸다. 시간 구간 [1, 2)($$L/R$$ 단위)에 각 링크가 싣고 있는 패킷과, 두 패킷이 모두 도착하는 시각을 쓰라.</summary>


**답:** [1, 2): 링크 1 = 패킷 2, 링크 2 = 패킷 1, 링크 3 = 비어 있음. 모두 도착: $$3 + 2 - 1 = 4$$, 즉 $$4\,L/R$$.

| 시간 | 링크 1 | 링크 2 | 링크 3 |
|---|---|---|---|
| [0,1) | p1 | — | — |
| [1,2) | p2 | p1 | — |
| [2,3) | — | p2 | p1 |
| [3,4) | — | — | p2 |

**흔한 오답:** $$3 \times 2 = 6$$ (패킷마다 따로 보낸다고 계산). 두 패킷은 겹쳐서 흐른다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 패킷 길이 8,000비트, 링크 전송률 2 Mbps, 링크 3개일 때 패킷 1개와 패킷 5개가 도착하는 데 걸리는 시간은? (전파·처리·대기 지연 무시)</summary>


**답:** $$L/R = 4$$ ms. 패킷 1개: $$3 \times 4 = 12$$ ms. 패킷 5개: $$(3 + 5 - 1) \times 4 = 28$$ ms.<br>
**흔한 오답:** 패킷 1개를 4 ms라고 하는 것(링크마다 더하지 않음).

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 점화식 $$F(k, i) = \max(F(k, i-1), F(k-1, i)) + 1$$에서 max 안의 두 항은 각각 무엇을 기다리는 것이고, 어떤 가정에서 나오는가?</summary>


**답:** $$F(k, i-1)$$은 패킷 $$k$$가 앞 노드에 완전히 도착하기를 기다린다(저장 후 전달 가정). $$F(k-1, i)$$는 링크 $$i$$가 앞 패킷을 다 싣기를 기다린다(링크는 한 번에 하나를 도착 순으로 싣는다는 가정).

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 버퍼가 넘쳐 패킷이 버려지면, 혼잡이 저절로 풀리지 않고 오히려 쌓이기 쉬운 이유는 무엇인가?</summary>


**답:** 버려진 패킷은 보낸 쪽이 다시 보낸다. 다시 보낸 패킷이 원래 트래픽에 더해져 같은 버퍼로 몰리므로, 버퍼는 더 자주 넘치고 버려지는 패킷도 더 늘어난다.<br>
**흔한 오답:** "버린 만큼 부하가 줄어 곧 풀린다". 버린 패킷은 사라지지 않고 재전송으로 돌아온다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260924201830.png — 슬라이드 "패킷 스위칭(packet switching): 인터넷/우편"
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 33~38행
[^3]: 4-1학기/pasted_images/Pasted image 20260925012109.png — 슬라이드 "통계적 다중화와 패킷스위칭". 오른쪽: store-and-forward, store ; forward
[^4]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 12~16행
[^s1]: 에이전트 보충. 보장하지 않는 것의 목록과 cut-through 방식은 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절과 Kurose & Ross, *Computer Networking: A Top-Down Approach*, 1.3~1.4절의 내용이다.
[^s2]: 에이전트 보충. 원본은 저장 후 전달의 동작만 쓰고 지연 공식은 없다. 공식은 Kurose & Ross, 1.3절의 저장 후 전달 전송과 같다. 교재의 링크 수 기호 $$N$$은 다중화의 입력 수 $$N$$과 겹쳐서 여기서는 $$H$$로 쓴다. 본문의 7과 15는 이 공식과 패킷을 하나씩 보내는 경우($$H \cdot P$$)에 $$H = 3$$, $$P = 5$$를 넣은 값이다.
{% endraw %}
