---
layout: "note"
title: "디지털 오디오 계산 연습"
display_title: "디지털 오디오 계산 연습"
kind: "practice"
kind_label: "연습"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
description: "소리를 숫자로 적고, 그 숫자를 줄이는 계산 여덟 가지다. 비트율·저장 용량은 곱셈, 칸 폭·비트 수·SQNR은 로그, 부분 대역과 비트 배분은 나눗셈과 올림이 중심이다. 답은 먼저 풀어 본 뒤 펼친다. 단위는 1 kb/s = 1,000 b/s, 1 MB = 1,000,000바이트…"
prev_url: "/studies/human-interface-media/sampling-aliasing-ladder/"
prev_title: "표본화와 에일리어싱 예제 사다리"
math: true
mermaid: false
code_count: 8
code_files: [{"t": "65_digital-audio-practice_p1.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p1/", "r": "문제 1 풀이"}, {"t": "65_digital-audio-practice_p2.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p2/", "r": "문제 2 풀이"}, {"t": "65_digital-audio-practice_p3.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p3/", "r": "문제 3 풀이"}, {"t": "65_digital-audio-practice_p4.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p4/", "r": "문제 4 풀이"}, {"t": "65_digital-audio-practice_p5.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p5/", "r": "문제 5 풀이"}, {"t": "65_digital-audio-practice_p6.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p6/", "r": "문제 6 풀이"}, {"t": "65_digital-audio-practice_p7.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p7/", "r": "문제 7 풀이"}, {"t": "65_digital-audio-practice_p8.py", "u": "/studies/human-interface-media/code/65_digital-audio-practice_p8/", "r": "문제 8 풀이"}]
permalink: "/studies/human-interface-media/digital-audio-practice/"
---
{% raw %}
소리를 숫자로 적고, 그 숫자를 줄이는 계산 여덟 가지다. 비트율·저장 용량은 곱셈, 칸 폭·비트 수·SQNR은 로그, 부분 대역과 비트 배분은 나눗셈과 올림이 중심이다. 답은 먼저 풀어 본 뒤 펼친다. 단위는 1 kb/s = 1,000 b/s, 1 MB = 1,000,000바이트로 센다[^s1].

## p1 · 비트율

(가) 전화 음성은 1채널, 초당 8,000번 표본, 표본당 8비트다. (나) 스튜디오 녹음은 2채널, 48 kHz, 24비트다. 각각 초당 몇 비트인가? (나)는 CD(1.4112 Mb/s)의 몇 배인가?

사용 개념: [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)의 CD 비트율 계산(채널 × 표본화율 × 비트)

풀이 전략: 1초 동안 몇 개의 숫자를 적는지(채널 × 표본화율) 먼저 세고, 숫자 하나에 드는 비트를 곱한다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *1초에 적는 표본 수:* (가) $$1 \times 8{,}000 = 8{,}000$$개. (나) $$2 \times 48{,}000 = 96{,}000$$개.
2. *표본당 비트를 곱하기:* (가) $$8{,}000 \times 8 = 64{,}000$$ b/s = 64 kb/s. (나) $$96{,}000 \times 24 = 2{,}304{,}000$$ b/s ≈ 2.30 Mb/s.
3. *CD와 비교:* $$2{,}304{,}000 / 1{,}411{,}200 \approx 1.63$$배.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 64,000 b/s, 2,304,000 b/s, 1.633배 — [65_digital-audio-practice_p1.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p1/)</div>

</div>


변형 문제: 영화관 소리처럼 6채널(5.1채널), 48 kHz, 16비트면 초당 몇 비트인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$6 \times 48{,}000 \times 16 = 4{,}608{,}000$$ b/s ≈ 4.61 Mb/s.

</details>


## p2 · 저장 용량

CD 오디오(1,411,200 b/s) 1분은 몇 MB인가? 74분이면? 700 MB에는 CD 오디오가 몇 분 들어가는가?

사용 개념: p1의 비트율, 바이트 = 비트 ÷ 8

풀이 전략: "초당 비트 × 초"로 총 비트를 구하고 8로 나눠 바이트로 바꾼다. 거꾸로 묻는 문제는 1분 크기로 나눈다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *1분의 비트:* $$1{,}411{,}200 \times 60 = 84{,}672{,}000$$비트
2. *바이트로:* $$84{,}672{,}000 / 8 = 10{,}584{,}000$$바이트 ≈ 10.58 MB
3. *74분:* $$10.584 \times 74 \approx 783.2$$ MB
4. *700 MB에 드는 시간:* $$700 / 10.584 \approx 66.1$$분

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 10.584 MB, 783.216 MB, 66.14분 — [65_digital-audio-practice_p2.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p2/)</div>

</div>


변형 문제: 128 kb/s MP3 1분은 몇 MB인가? 1 GB(1,000 MB)에는 몇 시간 분량이 들어가는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1분은 $$128{,}000 \times 60 / 8 = 960{,}000$$바이트 = 0.96 MB다. $$1{,}000 / 0.96 \approx 1{,}041.7$$분, 약 17.4시간이다.

</details>


## p3 · 칸 폭과 비트 수

전압 범위 −2 V ~ +2 V를 균일 양자화한다. 칸 폭 $$\Delta$$가 0.02 V 이하가 되게 하려면 비트가 몇 개 필요한가? 그때 실제 칸 폭과 최대 오차는?

사용 개념: [양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)의 $$\Delta = (\max - \min)/L$$, $$n_b = \log_2 L$$

풀이 전략: 칸 폭 조건을 칸 개수 조건으로 바꾼다. 칸 개수는 $$2^{n_b}$$로만 고를 수 있으니 조건을 넘는 가장 작은 2의 거듭제곱을 찾는다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *필요한 칸 수:* $$\Delta = 4/L \le 0.02$$이려면 $$L \ge 4/0.02 = 200$$.
2. *비트 수:* $$2^7 = 128 < 200 \le 256 = 2^8$$이라 $$n_b = 8$$. 식으로는 $$\lceil \log_2 200 \rceil = \lceil 7.64 \rceil = 8$$.
3. *실제 칸 폭:* $$\Delta = 4/256 = 0.015625$$ V ≈ 15.6 mV.
4. *최대 오차:* $$\Delta/2 \approx 7.8$$ mV.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 200칸, 8비트, 0.015625 V, 0.0078125 V — [65_digital-audio-practice_p3.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p3/)</div>

</div>


변형 문제: 같은 범위를 10비트로 양자화하면 칸 폭과 최대 오차는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$\Delta = 4/1{,}024 \approx 3.9$$ mV, 최대 오차 약 1.95 mV.

</details>


## p4 · SQNR과 필요한 비트 수

녹음 장치의 SQNR이 80 dB 이상이어야 한다. (가) 최대 진폭 정의 $$6.02N$$으로 따지면 몇 비트가 필요한가? (나) 꽉 찬 정현파의 전력 정의 $$6.02N + 1.76$$으로 따지면? 12비트 장치의 SQNR은 각 정의로 얼마인가?

사용 개념: [양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)의 두 정의[^s2]

풀이 전략: 부등식 $$\text{SQNR}(N) \ge 80$$을 $$N$$에 대해 풀고 올림한다. 두 정의의 1.76 dB 차이가 경계를 넘는지 본다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *(가) 부등식 풀기:* $$6.02N \ge 80$$ → $$N \ge 13.29$$ → 14비트.
2. *(나) 부등식 풀기:* $$6.02N + 1.76 \ge 80$$ → $$N \ge 12.997$$ → 13비트. 확인: $$6.02 \times 13 + 1.76 = 80.03$$ dB.
3. *12비트의 SQNR:* (가) $$6.02 \times 12 \approx 72.2$$ dB, (나) $$72.2 + 1.76 \approx 74.0$$ dB.
4. *해석:* 같은 80 dB 조건이라도 정의에 따라 답이 13과 14로 갈린다. 문제에 어느 정의인지 적혀 있는지 먼저 본다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 14비트와 13비트, 80.03 dB, 72.2·74.0 dB — [65_digital-audio-practice_p4.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p4/)</div>

</div>


변형 문제: 16비트 장치에서 꽉 찬 진폭의 1/10 크기인 정현파를 녹음하면 SQNR은 대략 얼마인가(전력 정의)?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

잡음은 그대로이고 신호 진폭이 1/10이면 $$20\log_{10}10 = 20$$ dB 떨어진다. $$98.1 - 20 \approx 78.1$$ dB.

</details>


## p5 · 나이퀴스트 표본화율

(가) 사람이 듣는 가장 높은 소리를 20 kHz로 잡으면 표본화율은 얼마보다 커야 하는가? CD의 44.1 kHz는 그보다 얼마나 여유가 있는가? (나) 전화 음성의 위 끝을 4 kHz로 잡으면 표본화율은?

사용 개념: [표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/)의 나이퀴스트 조건 $$W_s > 2W_{m\_max}$$

풀이 전략: 신호에 든 가장 높은 주파수의 두 배를 구한다. 표본화율의 절반이 담을 수 있는 가장 높은 주파수다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *(가) 두 배:* $$2 \times 20 = 40$$ kHz보다 커야 한다.
2. *(가) 여유:* 44.1 kHz는 $$44.1/2 = 22.05$$ kHz까지 담는다. 20 kHz보다 2.05 kHz 높다. 이 여유 구간에서 표본화 전 저역 통과 필터가 20 kHz 위를 서서히 줄여 없앤다[^s3].
3. *(나):* $$2 \times 4 = 8$$ kHz. 전화가 초당 8,000번 표본을 뽑는 이유다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 40 kHz, 2.05 kHz, 8 kHz, 변형의 6 kHz — [65_digital-audio-practice_p5.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p5/)</div>

</div>


변형 문제: 16 kHz로 표본화한 소리는 몇 kHz까지 담을 수 있는가? 표본화 전에 걸러 내지 않은 10 kHz 성분은 어떻게 들리는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

8 kHz까지 담는다. 10 kHz는 8 kHz를 넘어 $$16 - 10 = 6$$ kHz 소리로 접혀 들린다([에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/)).

</details>


## p6 · 압축비

CD 오디오(1,411.2 kb/s)를 128 kb/s MP3로 줄이면 압축비는? 320 kb/s면? 압축비 10 : 1이 되려면 비트율은 얼마여야 하는가?

사용 개념: [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)[^s2]

풀이 전략: 압축비 = 원래 비트율 ÷ 압축 후 비트율. 단위를 kb/s로 맞춘 뒤 나눈다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *128 kb/s:* $$1{,}411.2 / 128 \approx 11.0$$, 약 11 : 1. 원래의 약 9.1%만 남는다.
2. *320 kb/s:* $$1{,}411.2 / 320 = 4.41$$, 4.41 : 1.
3. *10 : 1의 비트율:* $$1{,}411.2 / 10 = 141.12$$ kb/s.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 11.025, 4.41, 141.12 kb/s, 9.07% — [65_digital-audio-practice_p6.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p6/)</div>

</div>


변형 문제: 64 kb/s 전화 음성을 8 kb/s로 줄이는 음성 부호기의 압축비는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$64 / 8 = 8$$, 8 : 1.

</details>


## p7 · 부분 대역 폭

44.1 kHz로 표본화한 소리를 같은 폭의 부분 대역 32개로 나눈다. (가) 부분 대역 하나의 폭은? 48 kHz면? (나) 1 kHz 소리는 몇 번 부분 대역에 드는가(1번부터 센다)? 1 kHz가 든 임계 대역(920 ~ 1,080 Hz)과 폭을 비교하라.

사용 개념: [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)의 부분 대역 32개, [임계 대역과 바크 스케일](/Hongs_Blog/studies/human-interface-media/critical-band-bark/)의 임계 대역 표

풀이 전략: 담을 수 있는 주파수 범위(표본화율의 절반)를 32로 나눈다. 몇 번째 대역인지는 주파수를 폭으로 나눠 버림한 뒤 1을 더한다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *(가) 폭:* $$22{,}050 / 32 \approx 689$$ Hz. 48 kHz면 $$24{,}000/32 = 750$$ Hz.
2. *(나) 대역 번호:* $$1{,}000 / 689.06 \approx 1.45$$ → 버림 1, 더하기 1 → 2번(689 ~ 1,378 Hz).
3. *(나) 임계 대역과 비교:* 1 kHz가 든 임계 대역(9번)은 폭이 $$1{,}080 - 920 = 160$$ Hz다. 부분 대역(689 Hz)이 임계 대역의 약 4.3배라서, 부분 대역 하나 안에 귀가 따로 듣는 단위가 여러 개 섞인다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 689.0625·750 Hz, 2번 부분 대역, 9번 임계 대역(160 Hz), 4.31배, 변형의 15번·23번·3.63배 — [65_digital-audio-practice_p7.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p7/)</div>

</div>


변형 문제: 10 kHz 소리는 몇 번 부분 대역에 드는가? 10 kHz가 든 임계 대역(9,500 ~ 12,000 Hz)과 폭을 비교하면 이번에는 어느 쪽이 넓은가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

$$10{,}000 / 689.06 \approx 14.5$$ → 15번(약 9,647 ~ 10,336 Hz). 임계 대역(23번)은 폭이 2,500 Hz로 부분 대역의 약 3.6배다. 높은 주파수에서는 반대로 임계 대역 하나가 부분 대역 여러 개에 걸친다.

</details>


## p8 · 신호 대 가림 비로 비트 배분

부분 대역 네 개의 신호 크기와 가림 문턱(dB)이 아래와 같다. 양자화 잡음이 문턱 아래에 있도록, 대역마다 표본당 비트를 몇 개 주어야 하는가? 대역마다 16비트를 줄 때와 합을 비교하라. (비트 하나 = 6.02 dB)

| 부분 대역 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| 신호 (dB) | 70 | 58 | 40 | 66 |
| 가림 문턱 (dB) | 42 | 50 | 44 | 47 |

사용 개념: [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)의 비트 배분[^s4], [양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)의 비트당 6 dB

풀이 전략: 잡음이 문턱 아래이려면 SQNR이 신호와 문턱의 차이(SMR)보다 커야 한다. SMR을 6.02로 나누고 올림한다. SMR이 0 이하면 들리지 않으니 0비트다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *SMR 구하기:* $$70 - 42 = 28$$, $$58 - 50 = 8$$, $$40 - 44 = -4$$, $$66 - 47 = 19$$ dB.
2. *비트 수:* 1번 $$28/6.02 \approx 4.65$$ → 5비트. 2번 $$8/6.02 \approx 1.33$$ → 2비트. 3번은 신호가 문턱 아래라 0비트. 4번 $$19/6.02 \approx 3.16$$ → 4비트.
3. *하나 적으면 안 되는지 확인:* 1번에 4비트면 24.1 dB < 28, 2번에 1비트면 6.0 dB < 8, 4번에 3비트면 18.1 dB < 19. 모두 잡음이 문턱 위로 나온다.
4. *합 비교:* $$5 + 2 + 0 + 4 = 11$$비트. 대역마다 16비트면 64비트다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: SMR 28·8·−4·19, 비트 5·2·0·4, 합 11, 변형의 합 10 — [65_digital-audio-practice_p8.py](/Hongs_Blog/studies/human-interface-media/code/65_digital-audio-practice_p8/)</div>

</div>


변형 문제: 옆 대역에 큰 소리가 새로 나서 2번 대역의 가림 문턱이 55 dB로 올랐다. 2번 대역의 비트와 전체 합은 어떻게 바뀌는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

SMR이 $$58 - 55 = 3$$ dB로 줄어 $$3/6.02 \approx 0.5$$ → 1비트다. 합은 $$5 + 1 + 0 + 4 = 10$$비트로 하나 준다. 가리는 소리가 커질수록 그 주변에 줄 비트가 준다.

</details>


[^s1]: 모든 답은 문제 코드로 확인했다.
[^s2]: 개념 문서의 보충 설명을 따른다.
[^s3]: 20 kHz·44.1 kHz와 4 kHz·8 kHz는 오디오와 전화의 표준 값이고, 여유 구간에서 필터가 줄여 없앤다는 설명은 신호 처리 교재의 표준 내용이다.
[^s4]: 실제 부호화기는 전체 비트 예산과 함께 반복해서 배분한다.
{% endraw %}
