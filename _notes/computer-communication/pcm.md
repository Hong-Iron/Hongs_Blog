---
layout: "note"
title: "PCM"
display_title: "PCM (Pulse Code Modulation)"
kind: "concept"
kind_label: "기법"
num: "38"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Pulse Code Modulation", "펄스 부호 변조", "펄스 코드 변조", "PAM", "Pulse Amplitude Modulation", "표본화 정리", "Sampling Theorem", "나이퀴스트 표본화 정리", "샘플링", "양자화", "Quantization"]
description: "목소리처럼 매끄럽게 변하는 값을 0과 1로 바꾸는 방법이다. 일정한 간격으로 값을 재고, 잰 값을 정해 둔 몇 단계 중 가장 가까운 것으로 반올림한 뒤, 그 단계 번호를 2진수로 적는다. 자주 재고 단계를 잘게 나눌수록 원래 소리에 가까워지지만, 보내야 할 비트도 그만큼 는다. 너…"
prev_url: "/studies/computer-communication/digital-transmission/"
prev_title: "디지털 전송"
next_url: "/studies/computer-communication/digital-modulation/"
next_title: "진폭·주파수·위상 변조"
math: true
mermaid: true
code_count: 2
permalink: "/studies/computer-communication/pcm/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

목소리처럼 매끄럽게 변하는 값을 0과 1로 바꾸는 방법이다. 일정한 간격으로 값을 재고, 잰 값을 정해 둔 몇 단계 중 가장 가까운 것으로 반올림한 뒤, 그 단계 번호를 2진수로 적는다. 자주 재고 단계를 잘게 나눌수록 원래 소리에 가까워지지만, 보내야 할 비트도 그만큼 는다. 너무 드물게 재면 빠르게 떨리는 소리를 놓치므로, 소리에 든 가장 빠른 떨림보다 두 배 넘게 자주 재야 한다.

</div>


## 예시로 보기

[디지털 전송](/Hongs_Blog/studies/computer-communication/digital-transmission/)은 0과 1만 다시 만들 수 있다. 그래서 목소리를 디지털로 보내려면 먼저 목소리를 숫자열로 바꿔야 한다.

슬라이드 그림의 파형을 일정한 간격 $$T_s$$마다 잰다[^1].

| 단계 | 하는 일 | 결과 |
|---|---|---|
| 1. 재기 (표본화) | 간격마다 파형의 높이를 읽는다 | 3.0, 1.4, 6.2, 1.3, 2.8, 5.9, 4.1 |
| 2. 반올림 (양자화) | 0~7의 8단계 중 가장 가까운 정수로 | 3, 1, 6, 1, 3, 6, 4 |
| 3. 2진수로 적기 | 단계 8개는 3비트로 적을 수 있다($$2^3 = 8$$) | 011 001 110 001 011 110 100 |

마지막 줄을 이어 붙인 `011001110001011110100`이 보낼 비트열이다. 1단계에서 잰 높이를 막대(펄스)로 그린 것을 PAM 펄스, 3단계까지 거친 것을 PCM 펄스라 부른다[^1].

2단계에서 1.4가 1이 되면서 0.4만큼 틀어진다. 이 차이(양자화 오차)는 받는 쪽이 되돌릴 수 없다. 단계를 반올림하므로 오차는 한 단계 폭의 절반을 넘지 않는다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/38_pcm_fig1.svg" alt="그림" loading="lazy">

주황 점과 파란 막대 끝 사이가 반올림 오차다. 점이 막대 끝에서 반 칸 넘게 벗어난 곳은 없다. 점과 점 사이에서 파형이 어떻게 움직였는지는 막대에 남지 않는다. 그 정보는 재는 순간에 이미 사라진다[^s4].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드 표본 7개 → 3비트 21개, 4 kHz × 2 × 8비트 = 64 kbps, 카드 C2·C3 — [38_pcm_verify.py](/Hongs_Blog/studies/computer-communication/code/38_pcm_verify/)</div>

</div>


## 정의

PCM은 아날로그 데이터를 디지털 데이터로 바꾼다. 재는 장치(PAM sampler)가 파형을 일정한 간격으로 재서 PAM 펄스를 만들고, 반올림 장치(Quantizer)가 각 펄스를 정해진 단계로 바꿔 PCM 펄스를 만든다[^1].

```mermaid
flowchart LR
  A["목소리 파형"] --> S["PAM sampler - 간격 Ts마다 잼"]
  S --> P["PAM 펄스"]
  P --> Q["Quantizer - 가장 가까운 단계로"]
  Q --> C["PCM 펄스"]
  C --> B["단계 번호를 2진수로 적은 비트열"]
```

장치 두 개를 지나며 파형이 높이 막대(PAM 펄스)로, 막대가 정해진 단계(PCM 펄스)로 바뀐다. 마지막 비트열이 보낼 데이터다[^s5].

손실을 줄이는 방법은 둘이다[^2].

- 더 자주 잰다. 1초에 재는 횟수(표본화율)를 늘린다.
- 단계를 잘게 나눈다. 표본 하나에 쓰는 비트 수를 늘린다. $$n$$비트면 $$2^n$$단계다.

얼마나 자주 재야 하는지는 표본화 정리가 정한다. 소리에 든 가장 높은 주파수(1초에 떨리는 가장 많은 횟수)의 두 배보다 자주 재야 원래 파형을 되살릴 수 있다[^3][^s2].

기호로 쓰면, $$f_{\max}$$(신호에 든 가장 높은 주파수, Hz)와 $$f_s$$(1초에 재는 횟수)에 대해

$$f_s > 2 f_{\max}$$


이다. 데이터 속도는 1초에 재는 횟수에 표본 하나의 비트 수 $$n$$을 곱한 것이다.

$$R = f_s \times n \ \text{(bps)}$$


전화 음성에 대입하면, 음성의 가장 높은 주파수를 4 kHz로 잡아 1초에 8,000번 재고, 표본마다 8비트(256단계)를 쓴다[^3].

$$8{,}000 \ \text{표본/초} \times 8 \ \text{비트/표본} = 64{,}000 \ \text{bps} = 64 \ \text{kbps}$$


슬라이드는 "약 2배"라고 쓰고, 4 kHz 음성에 8 kHz라는 정확히 2배의 예를 든다. 실제 전화망은 음성을 미리 약 3.4 kHz 아래로 걸러 두므로, 8 kHz는 $$2f_{\max}$$보다 크다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/38_pcm_fig2.svg" alt="그림" loading="lazy">

4 kHz로 떨리는 소리를 1초에 정확히 8,000번 재면, 재는 순간이 매번 파형이 0을 지나는 자리에 걸릴 수 있다(위). 잰 값만 보면 소리가 없는 것과 같다. 1초에 10,000번 재면(아래) 오르내림이 점에 남는다. "2배"가 아니라 "2배보다 많이"여야 하는 이유다[^s4].

## 활용

- 전화망의 음성 채널 하나가 64 kbps인 이유가 이 계산이다. 이 64 kbps 채널을 여러 개 묶어 [시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)로 한 선에 싣는다(T1은 24채널)[^s3].
- 음악 CD도 같은 방식이다. 1초에 44,100번 재고 표본마다 16비트를 쓴다. 사람이 듣는 가장 높은 소리(약 20 kHz)의 두 배를 조금 넘게 잡은 값이다[^s3].
- 흔한 실수: 단계 수와 비트 수를 섞는 것. 8비트는 8단계가 아니라 $$2^8 = 256$$단계다.

## 연결

- 같은 두 단계(표본화, 양자화)를 신호 및 시스템에서는 [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)로 배운다. 거기서는 사진의 화소와 밝기 단계로 보인다.
- PCM이 만든 비트열을 실제 신호로 바꾸는 방법: [진폭·주파수·위상 변조](/Hongs_Blog/studies/computer-communication/digital-modulation/)(무선), [NRZ](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/) 같은 인코딩(유선)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> PCM의 두 단계(재기, 반올림)가 각각 무엇을 잃을 수 있는지 쓰고, 그 손실을 줄이는 방법을 하나씩 쓰라.</summary>


**답:** 재기(표본화)는 잰 순간 사이에 일어난 변화를 잃는다. 더 자주 재면 줄어든다. 반올림(양자화)은 잰 값과 가장 가까운 단계 사이의 차이를 잃는다. 표본 하나의 비트 수를 늘려 단계를 잘게 하면 줄어든다.<br>
**흔한 오답:** "자주 재면 반올림 오차도 줄어든다". 반올림 오차는 단계 폭이 정한다. 자주 재도 단계가 그대로면 오차의 최댓값은 그대로다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 표본 2.2, 5.7, 0.4, 7.0을 0~7의 8단계로 PCM 하면 보낼 비트열은?</summary>


**답:** 반올림하면 2, 6, 0, 7이다. 3비트로 적으면 010 110 000 111, 이어 붙여 `010110000111`이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 전화 음성이 64 kbps인 이유를 계산으로 보여라. 같은 방식으로 가장 높은 주파수 20 kHz인 음악을 표본마다 16비트로 PCM 하면 한 채널에 몇 kbps가 드는가?</summary>


**답:** 음성의 가장 높은 주파수 4 kHz의 두 배인 8,000번을 1초에 재고, 표본마다 8비트를 쓰면 $$8{,}000 \times 8 = 64{,}000$$ bps다. 음악은 $$2 \times 20{,}000 = 40{,}000$$번 × 16비트 $$= 640{,}000$$ bps $$= 640$$ kbps다[^s1].<br>
**이유:** 두 배로 재야 하는 것은 표본화 정리 때문이다. 4 kHz로 떨리는 소리를 1초에 4,000번만 재면 매번 같은 위상에서 재게 되어, 떨림이 아예 없는 것처럼 보일 수 있다.

</details>

[^1]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 25 "PCM (Pulse Code Modulation)" (4-1학기/pasted_images/Pasted image 20261006010228.png). 그림 FIGURE 3.11의 PCM output에 빨간 동그라미
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/05.5주차.md, 33~37행
[^3]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 26 "PCM을 이용한 음성 데이터의 D-data화". 필기 39~43행
[^s1]: 에이전트 보충. 양자화 오차가 단계 폭의 절반 이하라는 것과 카드 C2·C3의 수치는 원본에 없다. 검증 코드로 계산했다.
[^s2]: 에이전트 보충. 슬라이드 26은 "Sampling rate ≈ 2 × Highest signal frequency"다(pptx 원본의 Symbol 글꼴 문자 0xBB가 ≈, 0xB4가 ×). 필기 40행도 "≈ 2×"로 적는다. 표본화 정리의 정확한 조건은 $$f_s > 2f_{\max}$$다(Oppenheim & Willsky, *Signals and Systems*, 7.1절). 정확히 2배에서는 $$f_{\max}$$인 사인파를 매번 0인 지점에서 잴 수 있어 되살릴 수 없다. 전화 음성 대역 300~3,400 Hz는 ITU-T G.711(PCM 64 kbps)의 대역이다.
[^s3]: 에이전트 보충. T1의 24채널(1.544 Mbps = 24 × 64 kbps + 8 kbps 동기), CD의 44.1 kHz·16비트는 원본에 없다. 표준 값이다(ANSI T1.403, IEC 60908).
[^s4]: 에이전트 보충. 그림 두 장은 원본에 없다. 그림 1의 곡선은 슬라이드의 표본 일곱 개를 지나도록 그린 매끄러운 곡선(3차 스플라인)이라, 표본 사이의 모양은 슬라이드의 원래 파형과 다를 수 있다. [38_pcm_plot.py](/Hongs_Blog/studies/computer-communication/code/38_pcm_plot/)로 그렸고, 반올림 결과 3, 1, 6, 1, 3, 6, 4와 비트열 `011001110001011110100`, 반올림 오차가 0.5 이하인 것, 8 kHz로 잰 4 kHz 사인파의 값이 모두 0인 것을 같은 코드로 확인했다.
[^s5]: 에이전트 보충. 다이어그램 1개는 원본에 없다. 슬라이드 25 "PCM (Pulse Code Modulation)"의 그림(PAM sampler, Quantizer, PCM output)과 이 문서 '예시로 보기' 표의 세 단계를 바탕으로 그렸다.
{% endraw %}
