---
layout: "note"
title: "진폭·주파수·위상 변조"
display_title: "진폭·주파수·위상 변조 (Amplitude, Frequency, Phase Modulation)"
kind: "concept"
kind_label: "정의"
num: "39"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Amplitude Modulation", "Frequency Modulation", "Phase Modulation", "AM", "FM", "PM", "ASK", "FSK", "PSK", "진폭 변조", "주파수 변조", "위상 변조", "반송파", "Carrier", "심볼", "Symbol", "QAM", "Quadrature Amplitude Modulation"]
description: "0과 1을 전파에 실으려면, 일정하게 출렁이는 바탕 물결(반송파)을 하나 정해 두고 그 물결의 한 가지 성질을 비트에 따라 바꾼다. 물결의 높이를 바꾸면 진폭 변조, 출렁이는 빠르기를 바꾸면 주파수 변조, 출렁임의 시작 시점을 밀면 위상 변조다. 물결 모양을 여러 가지로 늘리면 한…"
prev_url: "/studies/computer-communication/pcm/"
prev_title: "PCM"
next_url: "/studies/computer-communication/nrz-clock-recovery/"
next_title: "NRZ와 클럭 복구"
math: true
mermaid: false
code_count: 2
permalink: "/studies/computer-communication/digital-modulation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

0과 1을 전파에 실으려면, 일정하게 출렁이는 바탕 물결(반송파)을 하나 정해 두고 그 물결의 한 가지 성질을 비트에 따라 바꾼다. 물결의 높이를 바꾸면 진폭 변조, 출렁이는 빠르기를 바꾸면 주파수 변조, 출렁임의 시작 시점을 밀면 위상 변조다. 물결 모양을 여러 가지로 늘리면 한 번에 여러 비트를 실을 수 있다. 대신 모양끼리 차이가 작아져 잡음에 더 쉽게 헷갈린다.

</div>


## 예시로 보기

라디오의 전파나 와이파이처럼 공기 중으로 보내는 신호는 물결 모양이어야 멀리 간다. 그런데 0과 1은 물결이 아니다. 그래서 보내는 쪽은 일정한 주파수로 출렁이는 물결을 만들어 두고, 이 물결을 비트에 맞춰 조금씩 바꾼다. 이 바탕 물결을 반송파(carrier)라 부른다. 비트를 실어 나르는 물결이라는 뜻이다[^1].

물결 $$A\sin(2\pi f t + \theta)$$에서 바꿀 수 있는 것은 셋이다. $$A$$(진폭, 물결의 높이), $$f$$(주파수, 1초에 출렁이는 횟수), $$\theta$$(위상, 출렁임이 시작되는 시점의 밀림)다.

| 방법 | 바꾸는 것 | 예 |
|---|---|---|
| 진폭 변조 | 높이 $$A$$ | 1이면 물결을 보내고 0이면 끈다(슬라이드 그림 2.6)[^1] |
| 주파수 변조 | 빠르기 $$f$$ | 900 MHz 대역에서 890 MHz는 0, 910 MHz는 1[^2] |
| 위상 변조 | 시작 시점 $$\theta$$ | 0이면 위로 볼록하게 시작, 1이면 아래로 볼록하게 시작(반 바퀴 밀림)[^3] |

같은 비트 1 0 1 1 0을 세 방법으로 실으면 다음과 같다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/39_digital-modulation_fig1.svg" alt="그림" width="569" height="390" loading="lazy">

진폭 변조는 0인 칸에서 물결이 꺼진다. 주파수 변조는 1인 칸에서 두 배 빠르게 출렁인다. 위상 변조는 높이와 빠르기가 늘 같고, 비트가 바뀌는 경계에서 물결이 뚝 끊겨 반대 방향으로 이어진다[^s4].

정해진 시간 동안 내보내는 물결 모양 하나를 심볼이라 부른다. 위의 예는 모두 심볼이 두 가지라 심볼 하나에 1비트를 싣는다.

높이를 네 단계(5, 3.5, 1.5, 0 V)로 나누고 각 단계에 00, 11, 01, 10을 붙이면, 심볼 하나에 2비트를 싣는다[^4]. 같은 시간에 두 배를 보낸다. 슬라이드 Figure 2.7도 진폭을 네 단계로 나눈 그림이다[^1][^s3]. 그렇다면 왜 100단계로 나누지 않을까? 단계 사이가 좁아지면 1.2 V와 1.5 V처럼 가까운 높이를 잡음 때문에 서로 헷갈리기 때문이다[^4].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/39_digital-modulation_fig2.svg" alt="그림" width="470" height="370" loading="lazy">

두 그림에 섞인 잡음의 크기는 같다. 높이가 2단계면 두 산이 멀리 떨어져 거의 틀리지 않는다. 4단계면 이웃 산의 꼬리가 점선(단계를 가르는 기준)을 넘어, 받은 값의 약 13%를 이웃 단계로 잘못 읽는다[^s4].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 심볼 수와 비트 수, 데이터 속도, 카드 C3 — [39_digital-modulation_verify.py](/Hongs_Blog/studies/computer-communication/code/39_digital-modulation_verify/)</div>

</div>


## 정의

변조는 디지털 데이터를 아날로그 신호로 바꾼다(D-data → A-Signal)[^1]. 반송파의 진폭, 주파수, 위상 중 하나를 데이터에 따라 바꾼다[^1][^2][^3].

심볼이 $$M$$가지면 심볼 하나에 $$\lg M$$비트를 싣는다($$\lg$$는 밑이 2인 로그, $$2^b = M$$인 $$b$$). 1초에 보내는 심볼 수를 $$S$$라 하면 데이터 속도는 그 둘의 곱이다[^s1].

$$R = S \times \lg M \ \text{(bps)}$$


예: 위상 변조에서 두 가지 위상(Binary)은 1비트, 네 가지 위상(Quadrature)은 2비트를 싣는다[^3]. 1초에 심볼 100만 개를 보내면 각각 1 Mbps, 2 Mbps다.

통신 속도를 올리는 방법은 셋이다[^5].

1. 변조 방법을 개선한다. 예: 위상 변조의 심볼 수를 2 → 4 → 8로 늘린다.
2. 더 높은 주파수 대역을 쓴다. 예: 100 MHz대 → 200 MHz대. 높은 대역일수록 넓은 대역폭을 얻기 쉬워 1초에 더 많은 심볼을 보낼 수 있다[^s2].
3. 여러 채널로 나눠 동시에 보낸다. [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/) 문서의 다채널 분할(splitting)이다.

아날로그 데이터를 그대로 실을 수도 있다. AM 라디오는 마이크가 만든 목소리 파형대로 반송파의 높이를 바꾼다[^6]. 이때는 0과 1이 없으므로 [디지털 전송](/Hongs_Blog/studies/computer-communication/digital-transmission/)을 쓸 수 없다.

## 연결

- 선수: [신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/), [디지털 전송](/Hongs_Blog/studies/computer-communication/digital-transmission/)
- 반송파의 주파수를 입력마다 다르게 잡으면 [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)가 된다.
- 진폭 변조가 신호를 다른 주파수 자리로 옮기는 원리는 신호 및 시스템의 [곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/)에서 푸리에 변환으로 보인다. $$A$$, $$f$$, $$\theta$$는 대학수학 [사인파](/Hongs_Blog/studies/college-math/sinusoid/)의 세 값과 같다.
- 디지털 데이터를 물결 대신 높고 낮은 두 값으로 보내는 방법(유선): [NRZ와 클럭 복구](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"심볼 수를 2 → 4 → 8로 늘리면 속도가 단계마다 두 배가 된다"</div>

아니다. 심볼 수가 두 배가 되면 심볼 하나에 싣는 비트는 1개만 는다. 2 → 4 → 8가지는 1 → 2 → 3비트라서 속도는 1 : 2 : 3배다. 단계마다 두 배가 되려면 심볼 수를 제곱해야 한다(4 → 16 → 256). 그럴듯해 보이는 이유는 2 → 4 첫 단계에서는 실제로 두 배가 되기 때문이다. 확인은 $$\lg M$$을 계산하면 된다[^s1].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 진폭 변조, 주파수 변조, 위상 변조가 반송파의 무엇을 바꾸는지 쓰고, 0과 1을 구별하는 예를 하나씩 들라.</summary>


**답:** 진폭 변조는 높이를 바꾼다(1이면 물결을 보내고 0이면 끈다). 주파수 변조는 출렁이는 빠르기를 바꾼다(890 MHz는 0, 910 MHz는 1). 위상 변조는 출렁임의 시작 시점을 민다(0이면 그대로, 1이면 반 바퀴 밀어 아래로 볼록하게 시작).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 진폭을 4단계로 나누면 같은 시간에 두 배를 보낼 수 있다. 그런데 왜 단계를 무한정 늘리지 않는가?</summary>


**답:** 단계가 많아지면 이웃 단계의 높이 차이가 작아진다. 잡음이 그 차이만큼만 신호를 흔들어도 받는 쪽이 다른 단계로 읽는다. 그래서 단계 수는 잡음의 크기가 정하는 한계가 있다[^4].<br>
**흔한 오답:** "장비가 비싸서". 비용도 있지만, 근본적인 한계는 잡음과 단계 간격이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> (a) 1초에 심볼 2,400개를 보내고 심볼이 16가지인 모뎀의 데이터 속도는? (b) 심볼을 4가지에서 몇 가지로 늘려야 속도가 정확히 두 배가 되는가?</summary>


**답:** (a) 16가지는 $$\lg 16 = 4$$비트이므로 $$2{,}400 \times 4 = 9{,}600$$ bps. (b) 4가지는 2비트다. 4비트가 되려면 $$2^4 = 16$$가지가 필요하다. 8가지(3비트)로는 1.5배뿐이다[^s1].

</details>

[^1]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 27 "변조: Amplitude Modulation", Figure 2.6과 2.7 (수업 슬라이드 캡처)
[^2]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 28 "주파수 변조: Freq. Modulation", Figure 2.8 (수업 슬라이드 캡처). 890·910 MHz 예는 컴퓨터 통신 5회 필기 「5주차」, 59~60행
[^3]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 29 "위상 변조: Phase Modulation", Figure 2.7 "Binary and Quad Phase modulation" (수업 슬라이드 캡처). 필기 66행
[^4]: 컴퓨터 통신 5회 필기 「5주차」, 51~53행
[^5]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 30 "이동통신의 속도가 2배 ↑". 필기 70~78행
[^6]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 31 "참고: 아날로그 데이터 → 아날로그 신호 예: Amplitude Modulation (AM)" (수업 슬라이드 캡처). 슬라이드 질문 "Digital Transmission 가능?"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> $$R = S \times \lg M$$, 심볼 수와 속도의 관계, 카드 C3은 원본에 없다. 심볼 하나가 $$M$$가지 중 하나를 고르므로 $$\lg M$$비트를 나른다는 정의에서 나온다. 검증 코드로 계산했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 높은 주파수 대역에서 넓은 대역폭을 얻기 쉽다는 이유는 원본에 없다. 같은 비율의 대역(예: 반송파의 10%)이 높은 주파수일수록 Hz로 넓다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 27의 Figure 2.7은 "Quadrature amplitude modulation (QAM)"이라 적혀 있지만, 그림은 진폭만 네 단계(Off, Low, Medium, High)로 바꾼다. 보통 QAM(직교 진폭 변조)은 진폭과 위상을 함께 바꾸는 방법을 가리킨다(예: 16-QAM). 필기 05.5주차.md 52행은 이 그림을 "진폭을 네 단계로 나눠 2비트씩 보내는 방법"으로 적는다. 그래서 이 문서는 그림을 진폭만 여러 단계로 바꾸는 방법(다단계 진폭 변조, 4-ASK)으로 읽는다. 그림의 QAM 이름표는 정확한 이름이 아니다.
[^s4]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 두 장은 원본에 없다. 그림 1은 반송파가 비트 한 칸에 3번 출렁이도록 줄여 그렸다. 890 MHz와 910 MHz처럼 가까운 두 주파수는 눈으로 구별되지 않아서, 주파수 변조의 1은 두 배 빠르게 그렸다. 그림 2의 잡음 크기(표준편차 0.6 V)는 설명용 가정이다. [39_digital-modulation_plot.py](/Hongs_Blog/studies/computer-communication/code/39_digital-modulation_plot/)로 그렸고, 각 칸에서 반송파의 정해진 성질만 바뀌는 것과, 받은 값 2만 개씩에서 잘못 읽은 비율이 2단계 0.1% 미만, 4단계 5~20%(그림에서 12.8%)인 것을 같은 코드로 확인했다.
{% endraw %}
