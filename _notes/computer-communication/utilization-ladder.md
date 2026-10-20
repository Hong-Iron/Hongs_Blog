---
layout: "note"
title: "링크 사용률 예제 사다리"
display_title: "링크 사용률 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "56"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-20"
status: "verified"
description: "사용 개념: 정지 대기 사용률, 슬라이딩 윈도우 사용률"
prev_url: "/studies/computer-communication/crc-ladder/"
prev_title: "CRC 예제 사다리"
next_url: "/studies/computer-communication/sliding-window-check/"
next_title: "슬라이딩 윈도우 동작 점검 연습"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "56_utilization-ladder_p4.py", "u": "/studies/computer-communication/code/56_utilization-ladder_p4/", "r": "문제 4 풀이"}, {"t": "56_utilization-ladder_plot.py", "u": "/studies/computer-communication/code/56_utilization-ladder_plot/", "r": "그림 생성"}]
permalink: "/studies/computer-communication/utilization-ladder/"
---
{% raw %}
사용 개념: [정지 대기 사용률](/Hongs_Blog/studies/computer-communication/stop-and-wait-utilization/), [슬라이딩 윈도우 사용률](/Hongs_Blog/studies/computer-communication/sliding-window-utilization/)

"링크 사용률(효율)을 구하라"는 문제는 같은 하위목표의 되풀이다. ① 싣는 시간 $$t_\text{frame} = L / R$$ ② 전파 시간 $$t_\text{prop} = d / v$$ ③ 반복 구간 $$t_\text{frame} + 2\,t_\text{prop}$$ ④ 사용률 = 일한 시간 ÷ 반복 구간. 창 크기가 $$N$$이면 ④에서 일한 시간이 $$N\,t_\text{frame}$$이 되고 1을 넘으면 1로 자른다. 쉬지 않게 하는 창 크기는 반복 구간 ÷ 싣는 시간을 올림한 값이다[^s1].

하위목표마다 무엇을 보고 판단하는지는 다음과 같다[^s1].

- **① 싣는 시간.** 프레임 크기를 비트로 바꾼 뒤 전송률로 나눈다. 1,500바이트는 $$1{,}500 \times 8 = 12{,}000$$비트다. 바이트를 그대로 나누면 8배 작게 나온다.
- **② 전파 시간.** 거리를 신호 속도로 나눈다. 광케이블과 구리선은 약 $$2 \times 10^8$$ m/s, 전파(무선)는 $$3 \times 10^8$$ m/s로 잡는다. 문제에 "왕복(RTT)"이 주어지면 편도는 그 절반이다.
- **③ 반복 구간.** ACK는 프레임의 마지막 비트가 닿을 때 출발한다. 그래서 구간은 싣는 시간 한 번과 전파 시간 두 번이다. 시간 진행 그림을 그려 확인한다.
- **④ 사용률.** 오류 없음, 데이터가 늘 있음, 타임아웃 적당의 세 가정을 적고 나눈다. 창 크기 $$N$$이면 $$\min(1, N\,t_\text{frame} / \text{구간})$$이다.

## 문제 1 · 완전한 풀이

10 Mbps 링크, 광케이블 2,000 km(신호 속도 $$2 \times 10^8$$ m/s), 1,500바이트 프레임을 정지 대기로 보낸다. 링크 사용률을 구하라.

1. *싣는 시간:* $$12{,}000 \div 10^7 = 0.0012$$초, 1.2 ms.
2. *전파 시간:* $$2{,}000{,}000 \div (2 \times 10^8) = 0.01$$초, 10 ms.
3. *반복 구간:* 0 ms에 싣기 시작해 1.2 ms에 마지막 비트를 내보낸다. 그 비트는 $$1.2 + 10 = 11.2$$ ms에 닿고, 수신 쪽은 그때 ACK를 보낸다. ACK는 $$11.2 + 10 = 21.2$$ ms에 돌아와, 송신 쪽은 그때 다음 프레임을 싣는다. 구간은 $$1.2 + 2 \times 10 = 21.2$$ ms다.
4. *사용률:* 오류가 없고 데이터가 늘 있고 타임아웃이 적당하다고 하면 $$U = 1.2 / 21.2 \approx 5.66\%$$다. 100초 중 6초도 일하지 않는다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/56_utilization-ladder_fig1.svg" alt="그림" width="570" height="468" loading="lazy">

그림은 위 풀이를 시간표로 그린 것이다. 파란 띠의 두께가 하위목표 ①의 1.2 ms, 기울기가 ②의 10 ms다. 초록 글씨의 11.2 ms가 ③에서 ACK가 출발하는 순간이다. 송신 줄 왼쪽 막대에서 파란 부분 1.2 ms가 일한 시간, 점 무늬 20 ms가 노는 시간이고, 보라 괄호 21.2 ms가 되풀이되는 구간이다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [56_utilization-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/56_utilization-ladder_p4/), [56_utilization-ladder_plot.py](/Hongs_Blog/studies/computer-communication/code/56_utilization-ladder_plot/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

문제 1의 링크에서 창 크기 8인 슬라이딩 윈도우로 보낸다. 사용률은?

1. *싣는 시간:* 1.2 ms.
2. *전파 시간:* 10 ms.
3. *반복 구간:* 첫 프레임을 싣기 시작해 첫 ACK가 돌아오기까지 21.2 ms. 그 사이에 창이 허락하는 8개까지 실을 수 있다.
4. *사용률:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$U = \min(1,\ 8 \times 1.2 / 21.2) = \min(1,\ 9.6 / 21.2) \approx 45.3\%$$.<br>
8개를 싣는 데 9.6 ms가 걸리고, 첫 ACK가 오는 21.2 ms까지 11.6 ms를 논다. 그 뒤로도 21.2 ms마다 같은 모양이 되풀이된다. 정지 대기(5.66%)의 정확히 8배다. 아직 1보다 작아서 자를 필요가 없다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

100 Mbps 링크, 광케이블 50 km, 1,250바이트 프레임이다. 정지 대기의 사용률과, 송신 쪽이 쉬지 않게 하는 최소 창 크기를 구하라.

1. *싣는 시간:* ______
2. *전파 시간:* $$50{,}000 \div (2 \times 10^8) = 0.25$$ ms.
3. *반복 구간:* ______
4. *사용률과 창 크기:* 정지 대기 사용률은 싣는 시간 ÷ 반복 구간이고, 창 크기는 반복 구간 ÷ 싣는 시간을 올림한다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

① 1,250바이트는 10,000비트라 $$10{,}000 \div 10^8 = 0.1$$ ms.<br>
③ $$0.1 + 2 \times 0.25 = 0.6$$ ms.<br>
④ 정지 대기 사용률은 $$0.1 / 0.6 \approx 16.7\%$$다. 쉬지 않으려면 0.6 ms를 0.1 ms짜리 프레임으로 채워야 하니 $$0.6 / 0.1 = 6$$, 창 크기 6 이상이다. 식으로는 $$N \ge 1 + 2 \times 0.25 / 0.1 = 6$$이다. 정확히 6이면 첫 ACK가 오는 순간 여섯 번째 프레임을 다 실어, 쉬는 틈 없이 다음 프레임으로 이어진다.

</details>


## 문제 4 · 독립 문제

정지궤도 위성을 거치는 1 Mbps 링크가 있다. 지상국에서 위성을 거쳐 다른 지상국까지 편도 전파 시간은 약 240 ms다([위성통신](/Hongs_Blog/studies/computer-communication/satellite-systems/)).

(가) 1,000바이트 프레임을 정지 대기로 보낼 때 사용률은?
(나) 송신 쪽이 쉬지 않게 하는 최소 창 크기는?
(다) 프레임을 4,000바이트로 키우면 (가)와 (나)는?
(라) 1,000바이트 프레임 그대로 전송률을 10 Mbps로 올리면 (가)와 (나)는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(가) 싣는 시간 $$8{,}000 \div 10^6 = 8$$ ms, 반복 구간 $$8 + 2 \times 240 = 488$$ ms, 사용률 $$8 / 488 \approx 1.64\%$$다.<br>
(나) $$N \ge 1 + 480 / 8 = 61$$, 창 크기 61이다.<br>
(다) 싣는 시간 32 ms, 사용률 $$32 / 512 = 6.25\%$$, 창 크기 $$1 + 480 / 32 = 16$$이다. 프레임을 4배로 키워도 사용률은 4배(6.56%)가 아니라 그보다 조금 작다. 기다리는 480 ms가 그대로이기 때문이다.<br>
(라) 싣는 시간 0.8 ms, 사용률 $$0.8 / 480.8 \approx 0.166\%$$, 창 크기 $$1 + 480 / 0.8 = 601$$이다. 선을 빠르게 할수록 한 구간에 채워야 할 프레임이 늘어 정지 대기는 더 쓸모없어진다. 그래서 왕복이 긴 링크일수록 큰 창과, 오류 난 것만 다시 보내는 [Selective Repeat](/Hongs_Blog/studies/computer-communication/selective-repeat/)이 필요하다.

</details>


[^s1]: 모든 답의 수치는 [56_utilization-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/56_utilization-ladder_p4/)로 확인했다. 위성 링크의 편도 240 ms는 [위성통신](/Hongs_Blog/studies/computer-communication/satellite-systems/)의 약 239 ms를 반올림한 값이다.
[^s2]: [56_utilization-ladder_plot.py](/Hongs_Blog/studies/computer-communication/code/56_utilization-ladder_plot/)의 사건 시뮬레이터가 그렸고, 1.2 ms, 11.2 ms, 21.2 ms를 같은 코드로 확인했다.
{% endraw %}
