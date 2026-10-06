---
layout: "note"
title: "시분할 다중화와 통계적 다중화 비교"
display_title: "시분할 다중화와 통계적 다중화 비교"
kind: "concept"
kind_label: "비교"
num: "16"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-10-06"
status: "verified"
aliases: ["TDM vs 통계적 다중화", "synchronous TDM vs statistical TDM", "동기식 vs 비동기식 시분할"]
description: "둘 다 시간을 나눠 링크를 쓴다. 슬라이드도 통계적 다중화를 \"시분할 방법의 일종\"이라 부른다. 그래서 헷갈린다. 가르는 기준은 \"칸을 미리 정해 두는가\"다."
prev_url: "/studies/computer-communication/statistical-multiplexing/"
prev_title: "통계적 다중화"
next_url: "/studies/computer-communication/contrast--packet-switching--statistical-multiplexing/"
next_title: "패킷 스위칭과 통계적 다중화 비교"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/contrast--tdm--statistical-multiplexing/"
---
{% raw %}
둘 다 시간을 나눠 링크를 쓴다. 슬라이드도 통계적 다중화를 "시분할 방법의 일종"이라 부른다[^1]. 그래서 헷갈린다. 가르는 기준은 "칸을 미리 정해 두는가"다.

## 어느 쪽일까

상황마다 [동기식 시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)와 [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/) 중 무엇이 맞는지 고르고, 다른 쪽이 왜 아닌지 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 통화 24개를 한 링크에 싣는다. 통화마다 64 kbps로 일정하다 (b) 사무실 PC 20대가 인터넷 회선 하나를 함께 쓴다</summary>


**답:** (a) 동기식 시분할. 모든 입력이 늘 보낼 것이 있어 빈 칸이 거의 없다. 통계적 다중화는 얻는 것 없이 조각마다 주소 오버헤드만 붙는다. (b) 통계적 다중화. PC 트래픽은 버스티해서 고정 칸은 대부분 빈다. 쉬는 PC의 몫을 다른 PC가 써야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 감시 카메라 8대가 하루 종일 각자 일정한 전송률로 영상을 보낸다 (d) 입력 수가 날마다 크게 바뀌고, 몇 명이 올지 미리 알 수 없다</summary>


**답:** (c) 동기식 시분할. 버스티하지 않으므로 통계적 이득이 없고, 칸 위치가 키라 주소가 필요 없다. (d) 통계적 다중화. 동기식 시분할은 칸 수 $$N$$이 미리 정해져 있어 입력이 늘면 받을 수 없다. 통계적 다중화는 입력을 주소로 구별하므로 칸 수에 묶이지 않는다[^s1].

</details>

## 결정적 차이

| 기준 | 동기식 시분할 다중화 | 통계적 다중화 |
|---|---|---|
| 칸 배정 | 고정: 칸 $$j$$는 입력 $$(j \bmod N) + 1$$($$j$$를 $$N$$으로 나눈 나머지 + 1)[^2] | 요구에 따라 그때그때(동적)[^1] |
| DEMUX 키 | 칸 위치 (따로 보내지 않음) | 조각마다 붙인 주소[^1] |
| 오버헤드 | 동기 맞추기 비트 정도[^s1] | 조각마다 주소[^1] |
| 쉬는 입력의 몫 | 빈 칸으로 낭비 (Wasted Bandwidth)[^1] | 다른 입력이 씀 (Extra Bandwidth)[^1] |
| 입력이 한꺼번에 몰리면 | 영향 없음. 각자 자기 칸만 씀 | 버퍼에서 기다림, 넘치면 손실[^s1] |
| 필요한 링크 용량 | 입력별 최대 전송률의 합 | 평균에 가까운 값에 여유를 더한 값[^s1] |
| 서비스 품질(QoS) | 좋다. 데이터가 스트림으로 일정하게 흐른다[^3] | 몰리면 대기와 손실이 생긴다 |
| 망 운영자의 손익 | 버스티한 컴퓨터 통신에서는 링크가 노는 시간이 많아 손해다[^3] | 쉬는 몫을 다른 입력이 써서 이득이다 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드 그림(A~D, 2주기)을 코드로 재현해 동기식 8칸 중 빈 칸 4개, 통계적 A1 B1 \| B2 C2 확인 — [15_statistical-multiplexing_verify.py](/Hongs_Blog/studies/computer-communication/code/15_statistical-multiplexing_verify/)</div>

</div>


## 둘 다 아닐 때

<details markdown="1"><summary markdown="span"><b>C3</b> 동기식 시분할 다중화도 통계적 다중화도 맞지 않는 상황 두 가지와 그때의 선택지를 쓰라.</summary>


**답:** ① 입력들이 아날로그 신호이고 각자 다른 주파수 대역을 쓰는 경우(예: 라디오 방송) → [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/). ② 입력 하나의 전송률이 링크 하나보다 큰 경우 → 시간을 나눌 것이 아니라 링크 여러 개를 합쳐야 한다. [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/) 문서의 다채널 분할이다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260924204837.png — 슬라이드 "통계적 다중화 (Statistical Multiplexing)"
[^2]: 4-1학기/pasted_images/Pasted image 20260924204450.png — 슬라이드 "시분할 다중화", 동기식 시분할 다중화
[^3]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 10행
[^s1]: 에이전트 보충. 입력 수 제한, 동기 비트, 몰릴 때의 동작, 필요한 링크 용량의 비교는 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절의 내용이다.
{% endraw %}
