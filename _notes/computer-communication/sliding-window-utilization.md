---
layout: "note"
title: "슬라이딩 윈도우 사용률"
display_title: "슬라이딩 윈도우 사용률 (Sliding Window Utilization)"
kind: "concept"
kind_label: "기법"
num: "56"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-20"
status: "verified"
aliases: ["Sliding Window Utilization", "Sliding Window Protocol의 성능", "창 크기와 사용률", "필요한 창 크기"]
description: "한 번에 확인을 기다릴 수 있는 프레임이 N개면, 정지 대기가 하나를 싣고 놀던 구간에 N개를 실을 수 있다. 그래서 사용률은 정지 대기의 N배가 되지만, 100%를 넘을 수는 없다. 첫 답장이 돌아올 때까지 보낼 몫이 바닥나지 않으면 송신 쪽은 한 번도 쉬지 않는다. 그 몫을 정…"
prev_url: "/studies/computer-communication/sliding-window/"
prev_title: "슬라이딩 윈도우"
next_url: "/studies/computer-communication/go-back-n/"
next_title: "Go-Back-N"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "56_sliding-window-utilization_plot.py", "u": "/studies/computer-communication/code/56_sliding-window-utilization_plot/", "r": "그림 생성"}]
permalink: "/studies/computer-communication/sliding-window-utilization/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 번에 확인을 기다릴 수 있는 프레임이 N개면, 정지 대기가 하나를 싣고 놀던 구간에 N개를 실을 수 있다. 그래서 사용률은 정지 대기의 N배가 되지만, 100%를 넘을 수는 없다. 첫 답장이 돌아올 때까지 보낼 몫이 바닥나지 않으면 송신 쪽은 한 번도 쉬지 않는다. 그 몫을 정하는 것이 창 크기다.

</div>


## 예시로 보기

[정지 대기](/Hongs_Blog/studies/computer-communication/stop-and-wait-utilization/)로는 1.5 Mbps, 왕복 45 ms 링크에서 1 KB 프레임이 10.8%밖에 안 됐다. 창을 몇 개로 잡아야 선을 쉬지 않게 할 수 있을까? 어림으로는 파이프에 1 KB 프레임이 8개 들어가니 8개면 된다고 본다. 정확히는 시간을 따라가 본다.

먼저 작은 숫자로 원리를 본다. 싣는 시간 1 ms, 전파 시간 2 ms인 링크다. 프레임을 싣기 시작하고 그 ACK가 돌아오기까지 $$1 + 2 \times 2 = 5$$ ms가 걸린다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/56_sliding-window-utilization_fig1.svg" alt="그림" width="659" height="510" loading="lazy">

왼쪽 그림은 창 크기 3이다. 송신 쪽은 0~3 ms에 F0, F1, F2를 이어 싣고 나면 창이 다 찬다. 첫 ACK(ACK 1)는 F0의 마지막 비트가 닿은 3 ms에 출발해 5 ms에 돌아온다. 그동안 3~5 ms의 2 ms를 논다. 송신 줄 왼쪽 막대의 점 무늬가 노는 시간이다. 5 ms에 ACK 1이 오면 F3을 싣고, 6 ms에 ACK 2가 오면 F4를 싣는다. 이렇게 5 ms마다 3 ms 일하고 2 ms 노는 일이 되풀이되어 사용률은 $$3/5 = 60\%$$다[^s1].

오른쪽 그림은 창 크기 5다. 0~5 ms에 F0~F4를 이어 싣는 동안 첫 ACK가 정확히 5 ms에 돌아온다. 창이 바닥나는 순간 하나가 다시 열리니 F5를 곧바로 싣는다. 그 뒤로도 1 ms마다 ACK가 하나씩 와서 송신 쪽은 쉬지 않는다. 사용률은 100%다. 창을 늘리면 어느 순간 송신 쪽이 멈추는 일이 사라진다.

이제 처음 질문으로 돌아간다. 싣는 시간 5.46 ms, 한 구간 50.46 ms다. 한 구간을 프레임으로 채우려면 $$50.46 / 5.46 \approx 9.24$$개가 필요하다. 창은 정수이니 10개다. 8개면 $$8 \times 5.46 / 50.46 \approx 86.6\%$$다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/56_sliding-window-utilization_fig2.svg" alt="그림" width="618" height="347" loading="lazy">

그림은 같은 링크에서 창 크기에 따른 사용률이다. 창이 1에서 9까지는 10.8%씩 계단처럼 오른다. 9개면 97%다. 10개부터 100%(초록)이고, 그 뒤로는 창을 늘려도 그대로다. 어림 계산의 8개는 87%에 머문다. 어림은 프레임을 싣는 시간 자체를 빼먹었기 때문이다[^s2].

## 정의

창 크기 $$N$$인 슬라이딩 윈도우의 사용률도 반복 구간에서 일한 시간의 비율이다. 효율(사용률) = 전송한 시간 ÷ 전체 시간이다. 정지 대기와 같은 세 가정(오류 없음, 데이터가 늘 있음, 타임아웃 적당)을 둔다.

첫 프레임을 싣기 시작해서 첫 ACK가 돌아오기까지는 정지 대기의 한 구간과 같은 $$t_\text{frame} + 2\,t_\text{prop}$$이 걸린다. 그 사이에 송신 쪽은 창이 허락하는 $$N$$개까지만 실을 수 있다. $$N$$개를 다 싣는 데 $$N\,t_\text{frame}$$이 걸린다. 이것이 한 구간보다 짧으면 남는 시간은 논다. 길거나 같으면 쉬지 않는다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">창 크기 $$N$$일 때의 사용률</div>

기호로 쓰면

$$U = \min\!\left(1,\ \frac{N\,t_\text{frame}}{t_\text{frame} + 2\,t_\text{prop}}\right) = \min\!\left(1,\ \frac{N}{1 + 2a}\right), \qquad a = \frac{t_\text{prop}}{t_\text{frame}}$$

송신 쪽이 쉬지 않는(효율 = 1) 조건은

$$N \times t_\text{frame} \ge t_\text{frame} + 2\,t_\text{prop}, \quad \text{곧} \quad N \ge 1 + 2 \times \frac{t_\text{prop}}{t_\text{frame}}$$

- $$N$$: 창 크기(ACK를 받기 전에 보낼 수 있는 프레임 수)
- $$t_\text{frame}$$, $$t_\text{prop}$$, $$a$$: [정지 대기 사용률](/Hongs_Blog/studies/computer-communication/stop-and-wait-utilization/)과 같다
- $$\min(1, x)$$: 1과 $$x$$ 중 작은 값. 사용률은 100%를 넘지 못한다.

</div>


식은 "한 구간에 실을 수 있는 $$N$$개의 시간을 한 구간 전체로 나누되, 1을 넘으면 1로 자른다"고 읽는다. 사용률은 창 크기 $$N$$과 싣는 시간 $$t_\text{frame}$$이 클수록, 전파 시간 $$t_\text{prop}$$이 짧을수록 높다. 정지 대기는 $$N = 1$$을 넣은 경우다.

창이 작을 때 왜 구간마다 똑같이 $$N$$개씩일까? 첫 ACK가 $$t_\text{frame} + 2\,t_\text{prop}$$에 오면 하나를 보내고, 그 뒤 ACK들은 프레임들이 실린 간격 그대로 $$t_\text{frame}$$마다 하나씩 온다. 그래서 다음 구간에도 첫 구간과 똑같은 간격으로 $$N$$개를 싣고 같은 길이만큼 논다. 그림 1 왼쪽에서 5 ms 구간마다 3개씩 실리는 것이 그 모습이다[^s1].

조건 $$N\,t_\text{frame} \ge t_\text{frame} + 2\,t_\text{prop}$$의 양변에 전송률 $$R$$을 곱하면 비트로 쓴 조건이 된다. $$N \cdot L \ge L + R \cdot (2\,t_\text{prop})$$이다. 창에 담긴 비트가 "프레임 하나 + 왕복 동안 선에 떠 있을 수 있는 비트([대역폭-지연 곱](/Hongs_Blog/studies/computer-communication/bandwidth-delay-product/)의 왕복 값)"보다 많아야 한다는 뜻이다. 1.5 Mbps 예에서는 $$8{,}192N \ge 8{,}192 + 67{,}500$$이라 $$N \ge 9.24$$, 곧 10이다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 그림 1의 사건 시각(창 3은 0, 1, 2 ms에 싣고 5 ms까지 쉼, 창 5는 쉬지 않음)과 시뮬레이션으로 잰 사용률(첫 10 ms에서 60%, 100%), 1.5 Mbps 예의 9.24와 10, 창 8의 86.6%, 시간으로 쓴 조건과 비트로 쓴 조건이 같은 답을 냄 — [56_sliding-window-utilization_plot.py](/Hongs_Blog/studies/computer-communication/code/56_sliding-window-utilization_plot/). 반복의 모양은 위 문단의 논증이고, 수치는 실험으로 확인했다.</div>

</div>


## 활용

- 링크가 길거나 빠를수록 $$a$$가 커져 필요한 창도 커진다. 정지궤도 위성 링크처럼 왕복이 0.5초쯤 되면 창이 수십~수백 개 필요하다([링크 사용률 예제 사다리](/Hongs_Blog/studies/computer-communication/utilization-ladder/) 문제 4)[^s3].
- 문제에서 "링크를 쉬지 않게 하는 창 크기", "창이 N일 때 효율"을 물으면 이 식을 쓰되, 시간 진행 그림으로 첫 ACK가 오는 시각을 확인한다. 답이 소수로 나오면 올림한다(9.24 → 10).
- 흔한 실수: 조건의 "+1"(첫 프레임을 싣는 시간)을 빼서 $$N \ge 2a$$로 쓰는 것. 사용률을 1로 자르지 않아 100%를 넘는 값을 쓰는 것[^s3].

## 연결

- 선수: [슬라이딩 윈도우](/Hongs_Blog/studies/computer-communication/sliding-window/), [정지 대기 사용률](/Hongs_Blog/studies/computer-communication/stop-and-wait-utilization/)($$N = 1$$인 경우)
- 관련: [대역폭-지연 곱](/Hongs_Blog/studies/computer-communication/bandwidth-delay-product/)(창을 비트로 쓴 조건)
- 연습: [링크 사용률 예제 사다리](/Hongs_Blog/studies/computer-communication/utilization-ladder/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 10 Mbps, 광케이블 2,000 km(신호 속도 $$2 \times 10^8$$ m/s), 1,500바이트 프레임. 송신 쪽이 쉬지 않으려면 창 크기는 최소 얼마인가?</summary>


**답:** 18.<br>
**풀이:** 싣는 시간은 $$12{,}000 \div 10^7 = 1.2$$ ms, 전파 시간은 $$2 \times 10^6 \div (2 \times 10^8) = 10$$ ms다. $$N \ge 1 + 2 \times 10 / 1.2 \approx 17.67$$이라 올림해서 18이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 조건 $$N \ge 1 + 2a$$의 "+1"은 무엇을 뜻하나? 빼면 어떻게 틀리나?</summary>


**답:** 첫 프레임 자신을 싣는 시간이다. 첫 ACK는 첫 프레임의 마지막 비트가 닿아야 출발하므로, 첫 ACK가 오는 시각은 왕복 $$2\,t_\text{prop}$$에 싣는 시간 $$t_\text{frame}$$을 더한 값이다.<br>
**흔한 오답:** $$N \ge 2a$$로 쓰면 창을 하나 적게 잡는다. 위 C1이면 17이 나오는데, 17개로는 $$17 \times 1.2 / 21.2 \approx 96.2\%$$라 마지막에 조금 논다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> "창 크기를 두 배로 하면 사용률도 늘 두 배가 된다"가 틀렸음을 보이는 예를 들라.</summary>


**답:** 1.5 Mbps, 왕복 45 ms, 1 KB 프레임에서 창 8은 86.6%인데, 창 16은 173%가 아니라 100%다.<br>
**이유:** 송신 쪽이 쉬지 않게 되면 더 보낼 시간이 없다. 창을 늘려 얻는 것은 노는 시간을 메우는 데까지다.

</details>

[^s1]: [56_sliding-window-utilization_plot.py](/Hongs_Blog/studies/computer-communication/code/56_sliding-window-utilization_plot/)의 사건 시뮬레이터가 그림 1을 그렸고, 사용률 60%와 100%는 같은 코드가 시뮬레이션에서 직접 잰 값과 맞다.
[^s2]: 1 KB를 8,192비트로 계산했다. 사용률 $$\min(1, N/(1+2a))$$ 꼴은 Stallings, *Data and Computer Communications*의 슬라이딩 윈도우 흐름 제어 성능 분석에 나오는 식이다.
[^s3]: 수치는 [56_utilization-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/56_utilization-ladder_p4/)로 확인했다.
{% endraw %}
