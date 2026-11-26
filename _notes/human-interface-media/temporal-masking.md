---
layout: "note"
title: "시간 가림"
display_title: "시간 가림 (Temporal Masking)"
kind: "concept"
kind_label: "정의"
num: "54"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Temporal Masking", "시간 마스킹", "앞 가림", "pre-masking", "backward masking", "뒤 가림", "post-masking", "forward masking", "동시 가림", "simultaneous masking", "프리에코", "pre-echo"]
description: "큰 북소리가 멎은 직후에는 작은 소리가 잠깐 들리지 않는다. 큰 소리는 울리는 동안뿐 아니라 끝난 뒤 약 0.15초, 그리고 시작하기 직전 약 0.02초 동안에도 작은 소리를 가린다. 끝난 뒤의 가림이 앞의 가림보다 훨씬 길다. 가려지는 작은 소리가 클수록 더 빨리 다시 들린다."
prev_url: "/studies/human-interface-media/critical-band-bark/"
prev_title: "임계 대역과 바크 스케일"
next_url: "/studies/human-interface-media/psychoacoustic-model/"
next_title: "심리음향 모델"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "54_temporal-masking_plot.py", "u": "/studies/human-interface-media/code/54_temporal-masking_plot/", "r": "그림 생성"}, {"t": "54_temporal-masking_verify.py", "u": "/studies/human-interface-media/code/54_temporal-masking_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/temporal-masking/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

큰 북소리가 멎은 직후에는 작은 소리가 잠깐 들리지 않는다. 큰 소리는 울리는 동안뿐 아니라 끝난 뒤 약 0.15초, 그리고 시작하기 직전 약 0.02초 동안에도 작은 소리를 가린다. 끝난 뒤의 가림이 앞의 가림보다 훨씬 길다. 가려지는 작은 소리가 클수록 더 빨리 다시 들린다.

</div>


## 예시로 보기

[주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/)은 두 소리가 같은 순간에 울릴 때의 이야기다. 그런데 음악과 말소리는 시간에 따라 계속 바뀐다. 북을 친 직후, 자음이 터진 직후처럼 큰 소리가 갑자기 생기고 사라지는 자리가 많다. 그 앞뒤의 작은 소리가 들리는지도 알아야 한다.

큰 소리(가리는 소리)를 일정 시간 켰다 끄면서, 짧은 시험 음을 여러 시각에 틀어 들리기 시작하는 크기를 재면 세 구간이 나온다.

| 구간 | 언제 | 길이 |
|---|---|---|
| 앞 가림 (pre-masking) | 가리는 소리가 켜지기 직전 | 약 20 ms |
| 동시 가림 (simultaneous masking) | 가리는 소리가 켜져 있는 동안 | 켜져 있는 내내 (그림의 실험에서는 약 200 ms) |
| 뒤 가림 (post-masking) | 가리는 소리가 꺼진 직후 | 약 150 ms |

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/54_temporal-masking_fig1.svg" alt="그림" width="605" height="350" loading="lazy">

1 kHz 60 dB 소리를 0~200 ms 동안 켠 모식도다. 왼쪽에서 오른쪽으로 보면, 주황 곡선은 켜지기 20 ms 전부터 가파르게 올라 켜져 있는 동안 50 dB로 평평하다. 꺼진 뒤에는 처음에 빨리, 나중에 천천히 내려와 150 ms 뒤 파란 점선(조용할 때의 문턱)으로 돌아온다. 초록 점선의 30 dB 시험 음은 주황 곡선 위로 나온 시각에만 들린다. 켜지기 약 5 ms 전까지, 그리고 꺼지고 약 17 ms 뒤부터다[^s1].

그림에서 시험 음을 40 dB로 올리면 꺼지고 약 5 ms 만에 들리고, 20 dB로 내리면 약 40 ms를 기다려야 한다[^s1]. 그래서 "시험 음이 클수록 가림에서 빨리 벗어난다".

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

가리는 소리와 시험 음이 **같은 순간에 울리지 않는데도** 시험 음이 들리지 않는 현상을 **시간 가림**이라 한다. 가리는 소리가 시작하기 직전의 소리가 가려지면 앞 가림, 끝난 직후의 소리가 가려지면 뒤 가림이다. 둘 다 가리는 소리에 가까운 시각일수록 문턱이 높다.

**기호로 쓰면.**
- 가리는 소리가 시각 $$t_{\text{on}}$$에 켜져 $$t_{\text{off}}$$에 꺼진다. $$T_q$$는 조용할 때의 문턱, $$T_s$$는 동시 가림의 문턱이다.
- 시각 $$t$$에 울린 시험 음이 들리기 시작하는 레벨을 $$T(t)$$라 하면, 레벨 $$L$$인 시험 음은 $$L > T(t)$$일 때만 들린다.
- 앞 가림: $$t_{\text{on}} - \tau_{\text{pre}} \le t < t_{\text{on}}$$에서 $$T_q < T(t)$$이고 $$t_{\text{on}}$$에 가까울수록 높다. 실험 그림에서 $$\tau_{\text{pre}} \approx 20$$ ms다.
- 뒤 가림: $$t_{\text{off}} < t \le t_{\text{off}} + \tau_{\text{post}}$$에서 $$T_q < T(t)$$이고 $$t_{\text{off}}$$에서 멀어질수록 낮아진다. 실험 그림에서 $$\tau_{\text{post}} \approx 150$$ ms다.

</div>


뒤 가림에서 $$T(t)$$는 시간이 지날수록 내려가기만 한다. 그래서 시험 음 레벨 $$L$$이 클수록 $$T(t)$$가 $$L$$ 아래로 내려오는 시각이 빠르다. "시험 음이 클수록 빨리 들린다"는 이것을 말한 것이다.

<details markdown="1"><summary markdown="span">그림에 쓴 모식도 식</summary>


동시 가림 문턱은 [주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/)의 모형으로 정했다. 1 kHz 60 dB 가리는 소리와 같은 주파수의 시험 음이면 $$T_s = 60 - 10 + SF(0) = 50$$ dB이고, $$T_q(1000) \approx 3.37$$ dB다. 뒤 가림은 꺼진 뒤 지난 시간 $$d$$(ms)의 로그에 거의 비례해 줄어든다고 두었다[^s2].

$$
T(t_{\text{off}} + d) = T_q + (T_s - T_q)\left(1 - \frac{\ln(1 + d/5)}{\ln 31}\right), \quad 0 \le d \le 150
$$


이 식은 $$d = 0$$에서 $$T_s$$, $$d = 150$$에서 $$T_q$$다. 처음 10 ms에 가림의 약 32%가, 30 ms에 약 57%가 풀린다. 레벨 $$L$$인 시험 음이 들리기 시작하는 시각은 $$d = 5\,(31^{\,1 - r} - 1)$$, $$r = (L - T_q)/(T_s - T_q)$$다. 30 dB를 넣으면 $$r = 0.571$$, $$d \approx 16.8$$ ms다.

</details>

### 왜 생기나

큰 소리는 속귀의 감각 세포들을 한꺼번에 세게 자극해 꽉 찬(포화된) 상태로 만들고, 세포들이 원래대로 돌아오려면 시간이 걸린다. 그동안은 작은 소리에 반응하기 어렵다. 이것이 뒤 가림이다. 기저막의 흔들림도 소리가 끊긴 순간 바로 멈추지 않고 잠깐 이어진다[^s3].

앞 가림은 나중에 온 소리가 먼저 온 소리를 가리는 것이라 이상해 보인다. 흔히 큰 소리가 작은 소리보다 신경에서 더 빨리 처리되어, 조금 먼저 들어온 작은 소리를 따라잡아 덮기 때문이라고 설명한다. 그래서 앞 가림은 몇 ms에서 길어야 20 ms 정도로 짧다[^s3].

## 활용

- **소리 압축의 시간 축.** 부호기는 큰 소리 바로 뒤 약 100 ms 안의 작은 성분을 덜 정밀하게 적어도 된다. 주파수 가림과 함께 [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)의 재료다[^s4].
- **프리에코(pre-echo) 막기.** 변환 부호기는 소리를 수십 ms 길이의 토막으로 잘라 처리한다. 토막 안에서 소리가 갑자기 커지면(예: 캐스터네츠 소리), 압축 잡음이 토막 전체에 퍼져 큰 소리가 시작하기 **전**에도 잡음이 생긴다. 앞 가림은 아주 짧아서 이 잡음을 숨기지 못하고, 소리 앞에 "쉬익" 하는 메아리처럼 들린다. 그래서 MP3와 AAC는 소리가 갑자기 커지는 자리에서 토막을 짧게 바꾼다(블록 전환): [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)[^s4].
- **흔한 실수.** 그림의 "약 200 ms"를 가림의 길이로 외우는 것. 그것은 실험에서 가리는 소리를 켜 둔 시간이다. 동시 가림은 가리는 소리가 켜져 있는 내내 이어진다.

## 연결

- 선수: [주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/) (동시 가림의 문턱)
- 둘을 함께 쓰는 곳: [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/), [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)
- 기저막과 감각 세포: [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"먼저 울린 소리는 뒤에 오는 소리에 가려질 수 없다"</div>

틀렸다. 소리는 시간 순서대로 귀에 들어오니, 아직 오지 않은 큰 소리가 앞의 작은 소리에 손을 쓸 수 없을 것 같다. 실제로는 큰 소리가 시작하기 약 20 ms 전까지의 작은 소리도 가려진다(앞 가림). 다만 뒤 가림(약 150 ms)보다 훨씬 짧다. 확인 방법: 위 그림에서 가리는 소리가 켜지는 순간(0 ms) 왼쪽에도 문턱이 올라간 구간이 있다. 소리 압축에서 생기는 프리에코가 들리는 것도 앞 가림이 이렇게 짧기 때문이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 시간 축에서 본 가림 세 가지의 이름과, 각각이 이어지는 대략의 길이를 쓰라.</summary>


**답:** 앞 가림(가리는 소리가 켜지기 직전, 약 20 ms), 동시 가림(켜져 있는 동안 내내), 뒤 가림(꺼진 직후, 약 150 ms).<br>
**흔한 오답:** 동시 가림을 "약 200 ms"로 쓰는 것. 200 ms는 그 실험에서 가리는 소리를 켜 둔 시간이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 큰 소리가 끝난 직후, 시험 음이 40 dB일 때와 20 dB일 때 중 어느 쪽이 먼저 들리기 시작하는가? 이유를 뒤 가림의 문턱 모양으로 쓰라.</summary>


**답:** 40 dB가 먼저 들린다. 뒤 가림의 문턱은 가리는 소리가 꺼진 뒤 시간이 지날수록 계속 내려간다. 시험 음은 문턱이 자기 레벨 아래로 내려온 순간부터 들리므로, 높은 레벨(40 dB)이 문턱과 먼저 만난다. 이 문서의 모식도로는 40 dB가 약 5 ms, 20 dB가 약 40 ms 뒤다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 상황은 각각 동시 가림(주파수 가림), 앞 가림, 뒤 가림, 가림이 아님 가운데 무엇인가? (가) 1 kHz 80 dB가 울리는 동안 1.1 kHz 50 dB가 안 들림 (나) 큰 박수 소리가 끝나고 30 ms 뒤의 속삭임이 안 들림 (다) 큰 박수 소리가 시작하기 10 ms 전의 작은 딸깍 소리가 안 들림 (라) 큰 소리가 끝나고 1초 뒤의 아주 작은 소리가 안 들림</summary>


**답:** (가) 동시 가림(주파수 가림). (나) 뒤 가림. (다) 앞 가림. (라) 가림이 아니다. 1초 뒤에는 뒤 가림이 이미 끝났으므로, 그 소리가 조용할 때의 문턱보다 작아서 안 들리는 것이다.<br>
**이유:** 두 소리가 같은 순간인지, 시험 음이 가리는 소리 앞인지 뒤인지, 그리고 그 시간 간격이 가림이 남아 있는 범위 안인지로 가른다.

</details>

[^s1]: 30 dB 시험 음의 시각(약 5 ms 전, 약 17 ms 뒤)과 40·20 dB의 시각(약 5.4, 40.5 ms)은 [54_temporal-masking_verify.py](/Hongs_Blog/studies/human-interface-media/code/54_temporal-masking_verify/)로 계산했다. 실제 사람에게서 잰 값이 아니라 모양을 보이기 위한 값이다.
[^s2]: 뒤 가림이 지연 시간의 로그에 거의 비례해 줄어든다는 것은 W. Jesteadt, S. P. Bacon, J. R. Lehman, "Forward masking as a function of frequency, masker level, and signal delay," JASA 71(4), 1982의 관찰이다. 식의 5 ms와 150 ms, 앞 가림의 제곱 모양은 그림을 위해 정한 값이다.
[^s3]: 기저막 흔들림이 잠깐 이어진다는 것과, 앞 가림을 큰 소리의 빠른 처리로 설명하는 것은 E. Zwicker & H. Fastl, *Psychoacoustics* 같은 청각 교재의 표준 설명이다. 앞 가림과 뒤 가림의 길이는 문헌마다 다르게 적는다. Painter & Spanias, "Perceptual coding of digital audio," Proc. IEEE 88(4), 2000은 앞 가림 1~2 ms, 뒤 가림 50~300 ms로 적고, 뒤 가림은 가리는 소리가 크고 길수록 길어진다고 적는다.
[^s4]: 부호기가 뒤 가림을 쓰는 것, 프리에코와 블록 전환(MP3의 긴 블록·짧은 블록, AAC의 창 전환)은 Painter & Spanias(2000)와 MPEG 오디오 부호화 개관의 표준 내용이다.
{% endraw %}
