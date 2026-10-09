---
layout: "note"
title: "대역폭-지연 곱"
display_title: "대역폭-지연 곱 (Bandwidth-Delay Product, BDP)"
kind: "concept"
kind_label: "정의"
num: "28"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Bandwidth-Delay Product", "BDP", "대역폭 지연 곱", "링크의 부피", "파이프", "pipe"]
description: "링크를 파이프로 보면 대역폭은 파이프의 굵기, 지연은 길이이고, 둘을 곱하면 파이프에 한꺼번에 담기는 비트 수(부피)가 된다. 이 부피를 데이터로 채워야 링크를 놀리지 않는다. 대역폭이 커지면 부피도 커져서, 같은 크기의 데이터를 보내면 파이프는 오히려 더 비어 있다. 그래서 빠른…"
prev_url: "/studies/computer-communication/throughput/"
prev_title: "처리량"
next_url: "/studies/computer-communication/data-link-layer/"
next_title: "데이터 링크 계층"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/bandwidth-delay-product/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

링크를 파이프로 보면 대역폭은 파이프의 굵기, 지연은 길이이고, 둘을 곱하면 파이프에 한꺼번에 담기는 비트 수(부피)가 된다. 이 부피를 데이터로 채워야 링크를 놀리지 않는다. 대역폭이 커지면 부피도 커져서, 같은 크기의 데이터를 보내면 파이프는 오히려 더 비어 있다. 그래서 빠른 링크일수록 파이프를 채우는 방법이 복잡해진다.

</div>


## 예시로 보기

메시지의 첫 비트가 B에 도착한 순간, 두 링크의 모습을 비교한다[^1]. 두 링크 모두 전파 지연이 1 ms이고, 12,000비트 프레임 하나를 보낸다[^s1].

| | 링크 ① 10 Mbps | 링크 ② 100 Mbps |
|---|---|---|
| 1 ms 동안 실은 비트 | 10,000 (프레임의 일부) | 12,000 (프레임 전체, 0.12 ms 만에 다 실음) |
| 링크의 부피 (BDP) | 10,000비트 | 100,000비트 |
| 첫 비트 도착 순간 채운 비율 | 100% (A에 2,000비트가 남음) | 12% |

슬라이드 그림에서 ①의 노란 띠가 링크를 가득 채우고, ②의 노란 조각은 B 앞에 조그맣게 붙어 있다. 대역폭이 10배인 ②가 상대적으로 덜 쓰였다[^1][^2].

```
첫 비트가 B에 닿은 순간 (전파 지연 1 ms)

링크 ① 10 Mbps, 부피 10,000비트
A |██████████████████████████████████████████████████| B   100% 참 (A에 2,000비트 남음)

링크 ② 100 Mbps, 부피 100,000비트
A |············································██████| B   12%만 참
```

막대 한 칸이 그 링크 부피의 2%다. 같은 프레임인데도 ②에서는 링크의 대부분이 비어 있다[^s2].

파이프로 읽으면 지름이 대역폭 $$R$$, 길이가 전파 지연 $$d_{\text{prop}}$$다[^2]. 비유가 다른 곳도 있다. 물은 흘러가는 동안 파이프 속에서 섞이지만, 비트는 보낸 순서대로 줄지어 간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 값, 카드 C1의 6,250,000바이트, 카드 C3의 37.5%와 5.7% — [28_bandwidth-delay-product_verify.py](/Hongs_Blog/studies/computer-communication/code/28_bandwidth-delay-product_verify/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

대역폭 $$R$$(bps), 한쪽 전파 지연 $$d_{\text{prop}}$$(초)인 링크의 **대역폭-지연 곱**은

$$\text{BDP} = R \times d_{\text{prop}} \quad (\text{비트})$$

이다. 링크 위에 한꺼번에 떠 있을 수 있는 비트 수의 상한이다.

</div>


첫 비트가 도착한 순간 길이 $$L$$비트의 프레임이 링크를 채운 비율은 $$\min(1, L / \text{BDP})$$($$L / \text{BDP}$$와 1 중 작은 값)다. 위 표의 링크 ②라면 $$12{,}000 / 100{,}000 = 12\%$$다. 보내는 쪽이 답을 받기 전에 실을 수 있는 양을 따질 때는 지연 자리에 RTT를 넣은 $$R \times \text{RTT}$$를 쓴다[^s1].

망 운영자에게는 네트워크 자원을 효율적으로 나누는 것이 중요하고, 이때 BDP가 중요한 인자로 나온다. BDP는 링크에 담을 수 있는 양의 상한이어서 성능의 기준선 역할을 한다[^2].

## 활용

- 대역폭이 커지면 BDP도 커진다. 같은 크기의 통신을 가정하면 링크가 노는 비율이 늘어 효율이 낮아진다. 파이프가 노는 시간을 줄이려면 답을 기다리지 않고 여러 프레임을 연달아 보내는 방식이 필요해서 알고리즘이 복잡해진다[^2].
- 흔한 실수는 BDP를 RTT로 계산했는지 한쪽 지연으로 계산했는지 밝히지 않는 것이다. 둘은 2배 차이다.

## 연결

- 선수: [소요시간](/Hongs_Blog/studies/computer-communication/latency/), [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)
- 같은 원인(대역폭이 커지면 소요시간이 지배)을 시간으로 본 것: [처리량](/Hongs_Blog/studies/computer-communication/throughput/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 대역폭 1 Gbps, 한쪽 전파 지연 50 ms인 링크의 BDP를 비트와 바이트로 구하라.</summary>


**답:** $$10^9 \times 0.05 = 5 \times 10^7$$비트 $$= 6{,}250{,}000$$바이트.<br>
**흔한 오답:** 50을 그대로 곱해 $$5 \times 10^{10}$$으로 쓰는 것. ms를 초로 바꾸지 않았다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 슬라이드의 질문 "어느 링크가 상대적으로 덜 사용되었는가?"에 답하고, 대역폭이 커지면 같은 크기의 통신에서 효율이 낮아지는 이유를 BDP로 설명하라.</summary>


**답:** 대역폭이 큰 링크 ②가 덜 쓰였다. 대역폭이 커지면 BDP(파이프의 부피)가 커진다. 같은 크기의 프레임은 더 빨리 실려서 파이프의 작은 부분만 채우고, 나머지는 빈 채로 전파 지연 동안 기다린다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 프레임 하나(12,000비트)를 보낸 뒤 답이 와야 다음 프레임을 보낸다. RTT는 2 ms이고 답의 싣는 시간은 무시한다. 링크가 10 Mbps일 때와 100 Mbps일 때 링크가 실제로 데이터를 싣는 시간의 비율은?</summary>


**답:** 한 주기는 싣는 시간 + RTT다. 10 Mbps: $$1.2 / (1.2 + 2) = 37.5\%$$. 100 Mbps: $$0.12 / (0.12 + 2) \approx 5.7\%$$. 대역폭이 10배가 되자 효율은 약 6분의 1로 떨어졌다[^s1].

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260926020250.png — 슬라이드 "Frames 전송 상황의 시간적 이해", "메시지 첫 비트가 도착한 시점의 링크 상황", "어느 링크가 상대적으로 덜 사용되었는가?". 같은 화면을 한 번 더 캡처한 파일이 4-1학기/pasted_images/Pasted image 20260926020248.png다
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/03.3주차.md, 98~111행
[^s1]: 에이전트 보충. 표의 수치(12,000비트, 1 ms, 10·100 Mbps), $$R \times \text{RTT}$$ 형태, 한 프레임씩 보내고 기다리는 방식의 사용률 식은 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.5절(대역폭-지연 곱)과 2.5절(stop-and-wait)의 내용이다.
[^s2]: 에이전트 보충. 다이어그램 1개는 원본에 없다. 이 문서 '예시로 보기' 표의 값(①은 100%, ②는 12%)을 막대 길이로 옮겼다. 슬라이드 "Frames 전송 상황의 시간적 이해"의 노란 띠 그림과 같은 순간이다.
{% endraw %}
