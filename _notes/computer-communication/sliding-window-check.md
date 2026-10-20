---
layout: "note"
title: "슬라이딩 윈도우 동작 점검 연습"
display_title: "슬라이딩 윈도우 동작 점검 연습"
kind: "practice"
kind_label: "연습"
num: "60"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-20"
status: "verified"
description: "사용 개념: 슬라이딩 윈도우 세부 알고리즘, Go-Back-N, Selective Repeat, 정지 대기 사용률"
prev_url: "/studies/computer-communication/utilization-ladder/"
prev_title: "링크 사용률 예제 사다리"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "60_sliding-window-check_plot.py", "u": "/studies/computer-communication/code/60_sliding-window-check_plot/", "r": "그림 생성"}]
permalink: "/studies/computer-communication/sliding-window-check/"
---
{% raw %}
사용 개념: [슬라이딩 윈도우 세부 알고리즘](/Hongs_Blog/studies/computer-communication/sliding-window-algorithm/), [Go-Back-N](/Hongs_Blog/studies/computer-communication/go-back-n/), [Selective Repeat](/Hongs_Blog/studies/computer-communication/selective-repeat/), [정지 대기 사용률](/Hongs_Blog/studies/computer-communication/stop-and-wait-utilization/)

하나의 상황을 세 단계로 점검한다.

1. 버퍼링은 따지지 않고, 동작 과정(사건과 동작)을 그려 본다.
2. 버퍼링 알고리즘에 따라 동작을 실행해 본다.
3. 걸리는 시간까지 넣어 그림으로 성능을 분석한다. 링크(대역폭, 지연시간), 프레임 길이, 재전송 타임아웃 시간 등이 주어진다.

**상황.** SWS = RWS = 3이다. 보낼 프레임은 F0~F5의 6개이고, 두 번째 프레임 F1이 처음 보낼 때 오류가 난다. 받는 쪽은 ACK를 즉시 보내되, 순서가 어긋난 프레임에는 ACK를 보내지 않는다(중복 ACK는 안 보냄). 이미 받은 번호(SeqNum < NFE)가 오면 버리고 ACK를 다시 보낸다[^s1]. ACK는 여기서 쓰는 약속대로 데이터 $$n$$까지 받으면 ACK $$n+1$$이다.

## 답안 쓰는 법

시간 진행 그림을 답으로 낼 때 다음을 밝힌다.

- **버퍼링의 대상.** 보내는 쪽 재전송 버퍼에 무엇이 있는지, 받는 쪽이 무엇을 저장했는지.
- **타임아웃.** 프레임마다 타이머를 언제 걸고, 언제 풀고, 언제 끝나는지. 타이머가 끝나는 것은 예외 사건이라 따로 표시한다.
- **송신과 수신의 입장.** 두 쪽은 서로를 볼 수 없다. 사건마다 어느 쪽에서 무엇을 보고 무엇을 하는지 나눠 쓴다.
- **번호(인덱스)의 뜻.** ACK 4가 "4를 받았다"인지 "3까지 받았고 다음은 4"인지, LAR·LFS·NFE·LFA가 가리키는 번호가 무엇인지 적는다.

## 문제 1 · 사건과 동작 그리기

받는 쪽이 순서가 어긋난 프레임을 어떻게 처리하는지는 아직 따지지 않는다. F1을 다시 받을 때까지, 보내는 쪽과 받는 쪽에서 일어나는 사건과 그때의 동작을 순서대로 적으라. 시간 값은 무시하고, 타이머는 먼저 건 것이 먼저 끝난다고 하자.

**풀이 전략.** 사건은 네 종류뿐이다. 보내는 쪽에는 위층 요청, ACK 도착, 타임아웃이 있고, 받는 쪽에는 프레임 도착이 있다. 사건마다 "누가, 무엇을 보고, 무엇을 하나"를 한 줄씩 쓴다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *송신:* F0을 보내고 타이머 T0을 건다. F1을 보내고 T1, F2를 보내고 T2를 건다. 확인을 기다리는 프레임이 3개라 창이 다 찼다. F3은 기다린다.
2. *수신:* F0을 받는다. 기다리던 번호라 위층으로 올리고 ACK 1을 보낸다.
3. *수신:* F1을 받았지만 오류 검출에서 걸려 버린다. 아무것도 보내지 않는다.
4. *수신:* F2를 받는다. 기다리는 것은 F1이라 순서가 어긋났다. ACK는 보내지 않는다.
5. *송신:* ACK 1을 받는다. F0이 확인되어 T0을 풀고 F0의 사본을 지운다. 창이 하나 열려 F3을 보내고 T3을 건다.
6. *수신:* F3을 받는다. 역시 순서가 어긋났다. ACK는 보내지 않는다.
7. *송신:* T1이 끝난다(예외 사건). F1을 다시 보내고 T1을 다시 건다.
8. *송신:* T2가 끝난다. F2를 다시 보내고 T2를 다시 건다. 송신 쪽은 받는 쪽이 F2를 어떻게 했는지 모른다.
9. *수신:* 다시 온 F1을 받는다. 기다리던 번호다. 여기서 무엇을 올리고 ACK 몇을 보낼지는 4·6에서 F2, F3을 저장했는지에 달려 있다. 저장했다면 F1~F3을 올리고 ACK 4, 버렸다면 F1만 올리고 ACK 2다(문제 2, 문제 5).

</details>


## 문제 2 · 버퍼링 알고리즘대로 실행하기

받는 쪽은 창 안에서 순서가 어긋난 프레임을 저장하고, 빈틈이 메워지면 이어진 만큼 올린다(수신 쪽 세부 알고리즘). 보내는 쪽은 프레임마다 타이머를 두고, 끝난 프레임만 다시 보낸다. 끝날 때까지 주요 순간마다 LAR, LFS, NFE, LFA와 양쪽 버퍼의 내용을 적으라.

**풀이 전략.** 변수의 처음 값(LAR = 0, LFS = −1, NFE = 0, LFA = NFE + RWS − 1 = 2)에서 출발한다. 보내는 쪽은 "LFS − LAR + 1 ≤ 3"을 지키며 보낸다. 받는 쪽은 프레임마다 "NFE ≤ SeqNum ≤ LFA인가, SeqNum = NFE인가"를 묻는다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/60_sliding-window-check_fig1.svg" alt="그림" width="778" height="832" loading="lazy"><br>
그림의 각 줄이 한 순간이다. 왼쪽이 보내는 쪽(파랑 = 재전송 버퍼에 있는 사본), 오른쪽이 받는 쪽(초록 = 저장해 둔 프레임)이고, 노란 테두리가 창이다. 시각은 문제 3의 링크로 계산한 값이다.
1. *F0~F2를 보낸 뒤.* LAR = 0, LFS = 2라 $$2 - 0 + 1 = 3$$, 창이 다 찼다. 버퍼에 F0, F1, F2의 사본이 있다. 받는 쪽은 아직 아무것도 받지 않아 NFE = 0, LFA = 2다.
2. *ACK 1을 받고 F3을 보낸 뒤.* 받는 쪽은 F0을 올려 NFE = 1, LFA = 3이 되었고 F1은 오류로 버렸다. 보내는 쪽은 ACK 1로 LAR = 1이 되어 F0의 사본을 지우고, F3을 보내 LFS = 3이다. 버퍼에는 F1, F2, F3이다.
3. *F2, F3이 도착한 뒤.* 둘 다 NFE(1)보다 크고 LFA(3) 이하라 받아들이되, 순서가 어긋나 저장만 한다. NFE는 1 그대로이고, 받는 쪽 버퍼에 F2, F3이 있다. ACK는 보내지 않았다.
4. *F1, F2의 타이머가 끝난 뒤.* 보내는 쪽은 F1과 F2를 다시 보낸다. 다시 보내도 LAR과 LFS는 그대로다(LFS는 새 프레임을 보낼 때만 는다).
5. *다시 온 F1이 도착한 뒤.* SeqNum = NFE라 저장하고, F1·F2·F3이 빈틈없이 이어지니 셋을 올리고 NFE를 4로 옮긴다. LFA = 6이다. 누적 ACK 4를 보낸다. 받는 쪽 버퍼는 비었다.
6. *ACK 4를 받은 뒤.* 그 사이 보내는 쪽은 F3의 타이머도 끝나 F3을 다시 보냈다. 받는 쪽은 다시 온 F2, F3을 이미 받은 번호(SeqNum < NFE)로 보고 버리되, ACK 4를 다시 보낸다. 보내는 쪽은 첫 ACK 4로 LAR = 4가 되어 F1~F3의 사본을 지우고, 창이 열려 F4, F5를 보낸다(LFS = 5). 뒤이어 오는 ACK 4는 이미 받은 번호라 무시한다.
7. *ACK 6을 받은 뒤.* F4, F5가 차례로 도착해 올라가고 ACK 5, ACK 6이 돌아온다. LAR = 6, LFS = 5라 확인을 기다리는 프레임이 0개다. 모두 끝났다.

</details>


## 문제 3 · 시간을 넣은 성능 분석

링크는 1 Mbps, 프레임 길이는 2,000비트, 광케이블 600 km(신호 속도 $$2 \times 10^8$$ m/s), 재전송 타임아웃은 12 ms다. 문제 2의 동작을 시간 진행 그림으로 그리고, (가) 모든 프레임이 확인되는 시각 (나) 오류가 없을 때보다 얼마나 늦어졌는지 (다) 링크가 일한 시간 중 헛일의 몫을 구하라[^s2].

**풀이 전략.** 먼저 싣는 시간과 전파 시간을 구하고, 프레임마다 "싣기 시작 → 마지막 비트 도착 → ACK 도착"의 시각을 적는다. 타이머는 프레임을 싣기 시작한 순간에 건다. 같은 시각에 두 쪽에서 일어나는 사건은 따로 적는다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

*하위목표 ① 시간 재료.* 싣는 시간 $$t_\text{frame} = 2{,}000 \div 10^6 = 2$$ ms, 전파 시간 $$t_\text{prop} = 600{,}000 \div (2 \times 10^8) = 3$$ ms다. 프레임은 싣기 시작하고 $$2 + 3 = 5$$ ms 뒤에 다 도착하고, ACK는 3 ms 뒤에 돌아온다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/60_sliding-window-check_fig2.svg" alt="그림" width="600" height="869" loading="lazy"><br>
*하위목표 ② 사건 시각.* 그림의 왼쪽 글이 보내는 쪽, 오른쪽 글이 받는 쪽 사건이다. 송신 줄 왼쪽의 세로선은 프레임별 타이머이고, 보라 실선(T1, T2, T3)이 끝까지 가서 끝난 타이머다.
1. 0, 2, 4 ms에 F0, F1, F2를 싣기 시작한다. 4 ms에 창이 다 찬다.
2. 5 ms: F0이 도착해 올라가고 ACK 1이 나간다. 7 ms: F1이 도착하지만 오류라 버린다(주황 빗금).
3. 8 ms: ACK 1이 도착해 F3을 싣는다. 9 ms: F2가 도착해 저장된다. 13 ms: F3이 도착해 저장된다.
4. 14 ms: F1의 타이머(2 + 12)가 끝나 F1을 다시 싣는다. 16 ms: F2의 타이머(4 + 12)가 끝나 F2를 다시 싣는다.
5. 19 ms: 다시 온 F1이 도착한다. 저장된 F2, F3과 이어져 F1~F3이 올라가고 ACK 4가 나간다.
6. 20 ms: F3의 타이머(8 + 12)가 끝나 F3을 다시 싣는다. ACK 4가 아직 오는 중이라 보내는 쪽은 F3이 이미 저장되었다는 것을 모른다.
7. 21 ms: 다시 온 F2가 이미 받은 번호라 버리고 ACK 4를 다시 보낸다. 22 ms: 첫 ACK 4가 도착해 F1~F3이 확인되고 F4를, 24 ms에 F5를 싣는다.
8. 25 ms: 다시 온 F3도 버리고 ACK 4를 다시 보낸다. 24 ms와 28 ms에 오는 ACK 4는 보내는 쪽이 무시한다.
9. 27 ms, 29 ms: F4, F5가 올라가고 ACK 5, ACK 6이 나간다. 30 ms, 32 ms에 보내는 쪽에 닿는다.<br>
*하위목표 ③ 답.* (가) 32 ms. (나) 오류가 없으면 F0~F5를 0~4 ms, 8~12 ms에 실어 20 ms에 끝나므로 12 ms 늦어졌다. (다) 링크는 프레임을 9번, $$9 \times 2 = 18$$ ms 실었다. 그중 오류 난 F1의 첫 전송, 이미 저장되어 있던 F2·F3의 재전송이 헛일이라 $$3 \times 2 = 6$$ ms, 일한 시간의 1/3이다. 32 ms 동안 쓸모 있게 실은 시간은 12 ms로 37.5%다.<br>
*검증.* 사건 시각, 끝나는 시각 32 ms와 20 ms, 18 ms와 12 ms는 [60_sliding-window-check_plot.py](/Hongs_Blog/studies/computer-communication/code/60_sliding-window-check_plot/)의 사건 시뮬레이터로 확인했다.

</details>


**변형.** 타임아웃을 20 ms로 늘리면 F2, F3을 쓸데없이 다시 보내는 일이 사라질까? 모든 프레임이 확인되는 시각은?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

사라지지 않는다. 끝나는 시각은 40 ms로 늦어진다.<br>
F1의 타이머가 $$2 + 20 = 22$$ ms에 끝나 F1을 다시 싣는다. F1은 $$22 + 5 = 27$$ ms에 도착해 F1~F3이 올라가고, ACK 4는 $$27 + 3 = 30$$ ms에 보내는 쪽에 닿는다. 그런데 F2의 타이머는 $$4 + 20 = 24$$ ms, F3의 타이머는 $$8 + 20 = 28$$ ms에 끝난다. 둘 다 ACK 4보다 먼저라 F2, F3을 또 다시 보낸다. F4, F5는 30 ms, 32 ms에 싣고 40 ms에 모두 확인된다.<br>
타임아웃을 $$T$$라 하면 다시 보낸 F1의 ACK는 $$(2 + T) + 2 + 2 	imes 3 = 10 + T$$에 오고, F2·F3의 타이머는 $$4 + T$$, $$8 + T$$에 끝난다. $$T$$를 얼마로 잡든 F2·F3의 타이머가 먼저 끝난다. F2, F3의 타이머가 F1보다 겨우 2 ms, 6 ms 늦게 걸렸는데, 다시 보낸 F1이 확인되기까지는 싣는 시간과 왕복 8 ms가 걸리기 때문이다. 타임아웃을 늘리면 오류를 늦게 알아챌 뿐이라 끝나는 시각이 $$20 + T$$로 밀린다(12 ms면 32 ms, 20 ms면 40 ms). 이 낭비는 타임아웃이 아니라 누적 ACK 때문이다. 줄이려면 [Selective Repeat](/Hongs_Blog/studies/computer-communication/selective-repeat/)처럼 F2, F3을 받았다는 소식이 따로 가야 한다(문제 4)[^s3].

</details>


## 문제 4 · Selective Repeat으로 바꾸면

같은 링크, 같은 오류에서 받는 쪽이 프레임마다 "n번을 받았다"는 개별 ACK를 보내고, 보내는 쪽은 개별 ACK를 받은 프레임의 타이머를 푼다고 하자. 다시 보내는 프레임과 끝나는 시각은?

**풀이 전략.** 개별 ACK가 무엇을 알려 주는지에 주목한다. ACK 2, ACK 3이 F2, F3의 타이머를 풀어 준다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/60_sliding-window-check_fig3.svg" alt="그림" width="600" height="832" loading="lazy"><br>
F1만 다시 보낸다. 받는 쪽은 9 ms에 F2, 13 ms에 F3을 저장하며 ACK 2, ACK 3을 보내고, 보내는 쪽은 12 ms, 16 ms에 그것을 받아 F2, F3의 타이머를 푼다. 14 ms에 F1의 타이머가 끝나 F1만 다시 싣는다. 19 ms에 F1이 도착해 F1~F3이 올라가고 ACK 1이 나가며, 22 ms에 F4, F5를 싣는다.<br>
끝나는 시각은 Go-Back-N과 같은 32 ms다. 창이 3이라, F1이 확인되기 전(22 ms)에는 F4를 실을 수 없기 때문이다. 대신 링크는 프레임을 7번(14 ms)만 실어, 헛일이 F1의 첫 전송 2 ms뿐이다. 이 상황에서 Selective Repeat이 아낀 것은 시간이 아니라 선이다[^s2].

</details>


## 문제 5 · 변형: 받는 쪽이 순서가 어긋난 프레임을 버리면

문제 3과 같은 링크에서, 받는 쪽이 순서가 어긋난 프레임을 저장하지 않고 버린다(ACK도 안 보냄). 받는 쪽이 보내는 ACK의 순서와 끝나는 시각은? 문제 3과 무엇이 같고 무엇이 다른가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

ACK는 ACK 1(5 ms), ACK 2(19 ms), ACK 3(21 ms), ACK 4(25 ms), ACK 5(27 ms), ACK 6(29 ms) 순서다. 받는 쪽은 9 ms의 F2와 13 ms의 F3을 버렸으므로, 다시 온 F1(19 ms), F2(21 ms), F3(25 ms)을 하나씩 받아 올린다.<br>
보내는 쪽은 문제 3과 똑같이 F1(14 ms), F2(16 ms), F3(20 ms)을 다시 보내고 F4, F5를 22 ms, 24 ms에 싣는다. 끝나는 시각도 32 ms로 같다. 다른 것은 받는 쪽 안의 일과 ACK뿐이다. 이 상황에서는 F2, F3의 타이머가 F1의 ACK보다 먼저 끝나므로, 저장해도 다시 보내는 양이 줄지 않았다. 저장의 이득은 타이머가 끝나기 전에 빈틈이 메워질 때 나온다([Go-Back-N](/Hongs_Blog/studies/computer-communication/go-back-n/)의 예에서는 18 ms 대 21~24 ms)[^s2].

</details>


[^s1]: 이 규칙이 없으면 마지막 ACK가 사라졌을 때 끝나지 않는다([60_sliding-window-algorithm_impl.py](/Hongs_Blog/studies/computer-communication/code/60_sliding-window-algorithm_impl/)).
[^s2]: 문제 3의 링크(1 Mbps, 2,000비트, 600 km, 타임아웃 12 ms)와 프레임 수 6개, 문제 1의 단계 정리, 문제 2·4·5와 변형, 그림 3장과 모든 답은 덧붙인 것이다. [60_sliding-window-check_plot.py](/Hongs_Blog/studies/computer-communication/code/60_sliding-window-check_plot/)의 사건 시뮬레이터가 그림을 그리고, 답의 시각과 횟수를 검사한다(ALL CHECKS PASSED).
[^s3]: 타임아웃 20 ms 변형의 답은 같은 시뮬레이터로 확인했다.
{% endraw %}
