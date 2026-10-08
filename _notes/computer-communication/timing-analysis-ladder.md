---
layout: "note"
title: "소요시간 분석 예제 사다리"
display_title: "소요시간 분석 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "26"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-09-29"
status: "verified"
description: "사용 개념: 소요시간 분석의 두 식. 회선은 d{\\text{setup}} + M/R + H\\,d{\\text{prop}}, 패킷은 (H + P - 1)L/R + H\\,d{\\text{prop}} + (H-1)\\,d{\\text{proc}}."
prev_url: "/studies/computer-communication/packet-switching-ladder/"
prev_title: "패킷 스위칭 예제 사다리"
next_url: "/studies/computer-communication/line-coding-ladder/"
next_title: "인코딩 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/timing-analysis-ladder/"
---
{% raw %}
사용 개념: [소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/)의 두 식. 회선은 $$d_{\text{setup}} + M/R + H\,d_{\text{prop}}$$, 패킷은 $$(H + P - 1)L/R + H\,d_{\text{prop}} + (H-1)\,d_{\text{proc}}$$.

이 기법을 떠올리는 신호는 "스위치를 거쳐", "회선으로/패킷으로 보낼 때", "처리 시간", "헤더"가 함께 나오는 문제다. 먼저 시간 흐름 그림을 그리고, 첫 비트나 첫 패킷이 경로를 다 건너는 시간과 나머지가 더하는 시간을 따로 구한다. 모든 문제에서 다른 트래픽은 없고(큐잉 지연 0), 스위치는 앞 패킷을 내보내는 동안 다음 패킷을 처리할 수 있다[^s1].

## 문제 1 · 완전한 풀이

링크 2개(A — S — B)로 이은 회선 스위칭. 링크마다 4 Mbps, 전파 지연 3 ms. 회선 설정에 10 ms가 걸린다. 2,000,000비트 파일의 마지막 비트가 B에 도착하는 시각은?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *설정:* 10 ms.
2. *싣기:* $$M/R = 2{,}000{,}000 / 4{,}000{,}000 = 0.5$$초 $$= 500$$ ms. 회선 위에서는 S가 멈추지 않으므로 싣기는 한 번만 센다.
3. *마지막 비트의 전파:* 링크 2개 × 3 ms $$= 6$$ ms.
4. *합치기:* $$10 + 500 + 6 = 516$$ ms.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

같은 경로(링크 2개, 4 Mbps, 전파 3 ms)로 8,000비트 패킷 하나를 패킷 스위칭으로 보낸다. S의 처리 시간은 0.5 ms다. 패킷이 B에 다 도착하는 시각은?

1. *한 링크의 싣기:* $$8{,}000 / 4{,}000{,}000 = 2$$ ms.
2. *링크마다 싣기와 전파:* $$2 \times (2 + 3) = 10$$ ms. 저장 후 전달이라 싣기가 링크마다 들어간다.
3. *노드마다 처리:* 중간 노드 1개 × 0.5 ms $$= 0.5$$ ms.
4. *합치기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$10 + 0.5 = 10.5$$ ms.

</details>


## 문제 3 · 하위목표 절반이 빈칸

링크 3개(스위치 2개), 링크마다 8 Mbps, 전파 1 ms, 스위치 처리 0.2 ms. 8,000비트 패킷 100개를 보낸다. 마지막 패킷이 도착하는 시각은?

1. *한 링크의 싣기:* $$L/R = 8{,}000 / 8{,}000{,}000 = 1$$ ms. 처리 0.2 ms가 이보다 짧아 처리에서 줄이 생기지 않는다.
2. *첫 패킷의 도착:* ______
3. *뒤 패킷이 더하는 시간:* 99개가 1 ms 간격으로 따라와 $$99 \times 1 = 99$$ ms.
4. *합치기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. $$3 \times (1 + 1) + 2 \times 0.2 = 6.4$$ ms. 4. $$6.4 + 99 = 105.4$$ ms. 공식 $$(3 + 100 - 1) \times 1 + 3 \times 1 + 2 \times 0.2 = 105.4$$ ms와 같다.

</details>


## 문제 4 · 독립 문제

링크 2개(링크마다 10 Mbps, 전파 5 ms)로 A와 B를 잇는다. 1,000,000비트 파일을 (a) 회선 스위칭으로 보낸다. 회선 설정에는 RTT 하나가 걸린다(처리 시간 무시). (b) 패킷 스위칭으로 보낸다. 패킷마다 데이터 10,000비트에 헤더 200비트가 붙고, S의 처리 시간은 0.1 ms다. 각각 파일이 다 도착하는 시각을 구하고, 어느 쪽이 빠른지와 그 이유를 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) RTT $$= 2 \times (2 \times 5) = 20$$ ms. $$20 + 1{,}000{,}000 / 10^7\text{ s} + 2 \times 5 = 20 + 100 + 10 = 130$$ ms.<br>
(b) 패킷 100개, $$L = 10{,}200$$비트, $$L/R = 1.02$$ ms. $$(2 + 100 - 1) \times 1.02 + 2 \times 5 + 1 \times 0.1 = 103.02 + 10.1 = 113.12$$ ms.<br>
패킷이 약 17 ms 빠르다. 회선은 설정에 20 ms를 쓴다. 패킷이 더 쓰는 것은 헤더 싣기(패킷마다 0.02 ms, 모두 2 ms)와 파이프라인 채우기(1.02 ms)와 처리(0.1 ms)뿐이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 516 ms, 10.5 ms, 105.4 ms, 130 ms와 113.12 ms, 변형의 1,030 ms와 1,031.12 ms — [26_timing-analysis_verify.py](/Hongs_Blog/studies/computer-communication/code/26_timing-analysis_verify/)</div>

</div>


## 변형 문제

- 문제 4에서 파일이 10,000,000비트라면 어느 쪽이 빠른가? 왜 그런가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

회선 $$20 + 1{,}000 + 10 = 1{,}030$$ ms. 패킷 1,000개: $$(2 + 1{,}000 - 1) \times 1.02 + 10.1 = 1{,}031.12$$ ms. 회선이 1.12 ms 빠르다. 헤더 비용은 패킷 수에 비례해 늘지만(모두 20 ms) 회선의 설정 비용은 한 번뿐이기 때문이다. 이 조건에서는 패킷 944개(데이터 9.44 Mbit)에서 두 방식이 같아지고, 그보다 크면 회선이 빠르다.

</details>


[^s1]: 에이전트 보충. 이 문서의 문제와 수치는 원본에 없다. 슬라이드의 시간 흐름 그림(회선 스위칭, 패킷 스위칭, 파이프라이닝)과 과제 2의 형식을 따른 연습용이다.
{% endraw %}
