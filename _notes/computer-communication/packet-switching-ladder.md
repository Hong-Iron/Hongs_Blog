---
layout: "note"
title: "패킷 스위칭 예제 사다리"
display_title: "패킷 스위칭 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "08"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-09-24"
status: "verified"
description: "사용 개념: 패킷 스위칭의 저장 후 전달 지연 (H + P - 1)\\,L/R, 전송 속도와 대역폭의 전송 지연 L/R."
next_url: "/studies/computer-communication/timing-analysis-ladder/"
next_title: "소요시간 분석 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/packet-switching-ladder/"
---
{% raw %}
사용 개념: [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)의 저장 후 전달 지연 $$(H + P - 1)\,L/R$$, [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)의 전송 지연 $$L/R$$.

이 공식을 떠올리는 신호는 "링크(홉) 몇 개", "패킷 몇 개", "저장 후 전달"이 함께 나오는 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다. 첫 패킷이 경로를 다 건너는 시간과, 뒤따르는 패킷이 한 칸씩 더하는 시간을 따로 구해 더한다. 문제는 모두 전파·처리·대기 지연을 무시한다[^s1].

## 문제 1 · 완전한 풀이

패킷 길이 12,000비트, 전송률 3 Mbps, 링크 4개(스위치 3개). 패킷 10개가 모두 도착하는 시각은?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *한 단위 시간 구하기:* $$L/R = 12{,}000 / 3{,}000{,}000 = 4$$ ms.
2. *첫 패킷의 도착:* 링크마다 한 단위씩 더해 $$H \cdot L/R = 4 \times 4 = 16$$ ms.
3. *뒤따르는 패킷이 더하는 시간:* 나머지 9개가 한 단위씩 늦게 도착해 $$(P - 1)\,L/R = 9 \times 4 = 36$$ ms.
4. *합치기:* $$16 + 36 = 52$$ ms. 공식 $$(4 + 10 - 1) \times 4 = 52$$ ms와 같다.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

패킷 길이 4,000비트, 전송률 1 Mbps, 링크 5개. 패킷 3개가 모두 도착하는 시각은?

1. *한 단위 시간 구하기:* $$L/R = 4{,}000 / 1{,}000{,}000 = 4$$ ms.
2. *첫 패킷의 도착:* $$5 \times 4 = 20$$ ms.
3. *뒤따르는 패킷이 더하는 시간:* $$2 \times 4 = 8$$ ms.
4. *합치기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$20 + 8 = 28$$ ms.

</details>



## 문제 3 · 하위목표 절반이 빈칸

패킷 길이 1,500바이트, 전송률 10 Mbps, 링크 2개. 패킷 5개가 모두 도착하는 시각은?

1. *단위 맞추기:* $$L = 1{,}500 \times 8 = 12{,}000$$비트.
2. *한 단위 시간 구하기:* $$L/R = 12{,}000 / 10^7 = 1.2$$ ms.
3. *첫 패킷의 도착:* ______
4. *뒤따르는 패킷이 더하는 시간:* ______
5. *합치기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

- $$2 \times 1.2 = 2.4$$ ms. 4. $$4 \times 1.2 = 4.8$$ ms. 5. $$2.4 + 4.8 = 7.2$$ ms.

</details>



## 문제 4 · 독립 문제

1 MB($$10^6$$바이트) 파일을 전송률 8 Mbps인 링크 3개를 거쳐 보낸다. (a) 파일 전체를 패킷 하나로 보낼 때와 (b) 8,000비트짜리 패킷 1,000개로 나눠 보낼 때, 파일이 모두 도착하는 시각을 각각 구하고 차이가 나는 이유를 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) $$L = 8 \times 10^6$$비트, $$L/R = 1$$초. $$3 \times 1 = 3$$초.<br>
(b) $$L/R = 8{,}000 / (8 \times 10^6) = 1$$ ms. $$(3 + 1{,}000 - 1) \times 1 = 1{,}002$$ ms, 약 1초.<br>
이유: 한 덩어리로 보내면 스위치마다 파일 전체를 다 받을 때까지 기다린다. 잘게 나누면 여러 링크가 동시에 서로 다른 패킷을 실어 파이프라인처럼 겹친다.

</details>



<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답 52 ms, 28 ms, 7.2 ms, 3초와 1,002 ms — [08_packet-switching_verify.py](/Hongs_Blog/studies/computer-communication/code/08_packet-switching_verify/)</div>

</div>


## 변형 문제

- 문제 4에서 링크가 1개라면 (a)와 (b)의 차이는 어떻게 되는가? 왜 그런가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 1초, (b) $$(1 + 1{,}000 - 1) \times 1$$ ms $$= 1$$초로 같다. 링크가 하나면 겹쳐 흐를 다음 링크가 없어서 나눠도 이득이 없다.

</details>



[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드의 저장 후 전달 동작에서 나오는 지연 공식의 연습용이다.
{% endraw %}
