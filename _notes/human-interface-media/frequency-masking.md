---
layout: "note"
title: "주파수 가림"
display_title: "주파수 가림 (Frequency Masking)"
kind: "concept"
kind_label: "정의"
num: "52"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Frequency Masking", "주파수 마스킹", "동시 가림", "simultaneous masking", "청각 가림", "auditory masking", "청각 마스킹", "가림 문턱", "masking threshold", "마스킹 곡선", "가리는 소리", "masker", "위쪽 퍼짐", "upward spread of masking", "퍼짐 함수", "spreading function"]
description: "시끄러운 식당에서는 옆 사람의 작은 말소리가 묻힌다. 이처럼 큰 소리가 울리는 동안에는 높이(주파수)가 비슷한 작은 소리가 들리지 않는다. 큰 소리일수록 더 넓은 범위를 가리고, 가리는 범위는 큰 소리보다 높은 쪽으로 훨씬 멀리 퍼진다. 안 들리는 소리는 저장하지 않아도 아무도 모…"
prev_url: "/studies/human-interface-media/equal-loudness-contours/"
prev_title: "등청감 곡선"
next_url: "/studies/human-interface-media/critical-band-bark/"
next_title: "임계 대역과 바크 스케일"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "52_frequency-masking_plot.py", "u": "/studies/human-interface-media/code/52_frequency-masking_plot/", "r": "그림 생성"}, {"t": "52_frequency-masking_verify.py", "u": "/studies/human-interface-media/code/52_frequency-masking_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/frequency-masking/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

시끄러운 식당에서는 옆 사람의 작은 말소리가 묻힌다. 이처럼 큰 소리가 울리는 동안에는 높이(주파수)가 비슷한 작은 소리가 들리지 않는다. 큰 소리일수록 더 넓은 범위를 가리고, 가리는 범위는 큰 소리보다 높은 쪽으로 훨씬 멀리 퍼진다. 안 들리는 소리는 저장하지 않아도 아무도 모르므로, 이 현상이 MP3 같은 소리 압축의 바탕이 된다.

</div>


## 예시로 보기

녹음된 소리를 그대로 다 저장하면 데이터가 크다. 그런데 그중에는 사람이 애초에 들을 수 없는 성분이 섞여 있다. 어떤 성분이 들리지 않는지 알면 그만큼 덜 저장해도 된다.

어떤 소리가 다른 소리를 얼마나 가리는지는 이렇게 잰다. 1 kHz 순음을 60 dB로 계속 틀어 둔다. 이 소리를 **가리는 소리**(masker)라 부른다. 그 옆 주파수, 예를 들어 1.1 kHz의 순음(시험 음)을 아주 작게 틀고 들릴 때까지 조금씩 키운다. 겨우 들리기 시작한 크기가 1.1 kHz에서의 문턱이다. 시험 음의 주파수를 바꿔 가며 이 일을 되풀이해 이은 선이 **가림 문턱**(masking threshold, 마스킹 곡선)이다.

크기가 같은 시험 음 셋이 서로 다른 까닭으로 들리거나 안 들린다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/52_frequency-masking_fig2.svg" alt="그림" width="592" height="350" loading="lazy">

왼쪽 1 kHz 세로선이 가리는 소리이고, 주황 곡선이 그것이 만든 가림 문턱이다. 2 kHz의 빈 점은 조용할 때의 문턱(파란 점선)보다는 위지만 주황 곡선 아래라서 가려진다. 3.1 kHz의 채운 점은 주황 곡선이 끝난 곳이라 문턱 위로 나와 들린다. 오른쪽 9 kHz의 빈 점은 아무것도 가리지 않는데도 안 들린다. 그 높이에서는 조용할 때의 문턱 자체가 2 dB보다 높기 때문이다[^s2].

가리는 범위는 위아래가 다르다. 400 Hz 근처의 좁은 잡음(약 365~455 Hz)을 가리는 소리로 틀고, 시험 음의 문턱이 얼마나 올라가는지 잰 결과가 있다.

| 시험 음 | 200 Hz | 300 Hz | 약 430 Hz (잡음 한가운데) | 1,000 Hz | 2,000 Hz | 약 4,000 Hz |
|---|---|---|---|---|---|---|
| 문턱이 올라간 양 | 약 11 dB | 약 33 dB | 약 61 dB (가장 큼) | 약 32 dB | 약 14 dB | 약 1 dB |

가장 많이 올라간 곳(약 430 Hz)에서 한 옥타브 아래(약 215 Hz)로 내려가면 거의 50 dB가 줄어든다. 한 옥타브 위(약 860 Hz)에서는 25 dB 정도만 줄고, 세 옥타브 넘게 올라가서야 사라진다. 가림은 높은 쪽으로 훨씬 멀리 퍼진다(위쪽 퍼짐).

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/52_frequency-masking_fig1.svg" alt="그림" width="606" height="380" loading="lazy">

1 kHz 가리는 소리를 40, 60, 80 dB로 키운 모형 계산이다. 왼쪽에서 오른쪽으로 보면, 세 곡선 모두 1 kHz 왼쪽에서는 가파르게 올라가고 오른쪽에서는 완만하게 내려온다. 아래 막대는 가려지는 범위다. 40 dB에서 730~1,780 Hz이던 범위가 80 dB에서는 530~3,780 Hz로 늘어나는데, 늘어난 몫은 대부분 오른쪽(높은 쪽)이다[^s3].

가리는 소리를 1, 4, 8 kHz에 두고 같은 실험을 하면, Hz로 그린 그래프에서는 높은 곳의 가리는 소리일수록 가림 문턱이 넓게 퍼진다. 귀가 높은 주파수를 더 굵은 칸으로 묶어 듣기 때문이다. 이 칸이 [임계 대역](/Hongs_Blog/studies/human-interface-media/critical-band-bark/)이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

한 소리(가리는 소리)가 울리는 동안 다른 소리(시험 음)가 들리기 시작하는 가장 작은 크기를, 시험 음의 주파수마다 이은 선을 **가림 문턱**이라 한다. 시험 음이 가림 문턱보다 작으면, 혼자서는 들릴 크기라도 들리지 않는다. 이것이 **주파수 가림**이다. 가리는 소리가 클수록 가리는 범위가 넓고, 범위는 가리는 소리보다 높은 쪽으로 더 넓다.

**기호로 쓰면.**
- $$T_q(f)$$: 조용할 때 주파수 $$f$$ Hz의 순음이 들리기 시작하는 레벨(dB SPL, [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)).
- $$T_m(f)$$: 주파수 $$f_m$$, 레벨 $$L_m$$인 가리는 소리가 있을 때 주파수 $$f$$의 시험 음이 들리기 시작하는 레벨(가림 문턱).
- 주파수 $$f$$, 레벨 $$L$$인 시험 음은 $$L > \max\{T_q(f),\ T_m(f)\}$$일 때만 들린다. 두 문턱 가운데 높은 쪽을 넘어야 한다는 뜻이다.
- 가림의 양(문턱이 올라간 양)은 $$T_m(f) - T_q(f)$$다.

</div>


<details markdown="1"><summary markdown="span">그림과 예제에 쓴 모형 식</summary>


가림 문턱의 모양을 계산하려면 주파수를 귀의 칸 단위로 잰 눈금 $$z(f)$$(바크, [임계 대역과 바크 스케일](/Hongs_Blog/studies/human-interface-media/critical-band-bark/))를 쓴다. 가리는 소리에서 몇 칸 떨어졌는지($$\Delta z = z(f) - z(f_m)$$)에 따라 문턱이 얼마나 내려가는지를 정한 함수가 퍼짐 함수다[^s3].

$$
SF(\Delta z) = 15.81 + 7.5(\Delta z + 0.474) - 17.5\sqrt{1 + (\Delta z + 0.474)^2}\ \text{dB}
$$


$$\Delta z = 0$$에서 0 dB로 가장 높고, 아래쪽으로 멀어지면 한 칸에 약 25 dB씩, 위쪽으로 멀어지면 한 칸에 약 10 dB씩 내려간다. 2칸 아래는 −27.6 dB, 2칸 위는 −12.3 dB다. 가림 문턱은 가리는 소리 레벨에서 일정한 간격만큼 내린 뒤 퍼짐을 더한다.

$$
T_m(f) = L_m - 10 + SF\big(z(f) - z(f_m)\big)\ \text{dB}
$$


10 dB 간격은 설명용으로 정한 값이다. 실제 간격은 가리는 소리가 순음인지 잡음인지에 따라 다르다[^s3].

</details>

### 왜 생기나

시험 음이 들리려면 그 주파수를 맡은 기저막 자리가 흔들려야 한다. 가리는 소리가 그 자리를 이미 세게 흔들고 있으면, 그 위에 얹힌 작은 흔들림은 구별되지 않는다[^s4].

기저막의 흔들림(진행파)은 입구 쪽(base)에서 출발해 안쪽(apex)으로 가며 점점 커지다가, 자기 주파수의 자리에서 가장 커지고 그 뒤에서 뚝 끊긴다. 입구 쪽 자리는 높은 소리를, 안쪽 자리는 낮은 소리를 맡는다([달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)). 그래서 낮은 가리는 소리의 파동은 자기 자리까지 가는 동안 높은 소리를 맡는 입구 쪽 자리들을 지나며 함께 흔든다. 높은 가리는 소리의 파동은 입구 근처에서 가장 커졌다가 곧 사라져서, 안쪽의 낮은 소리 자리는 거의 흔들지 못한다. 위쪽 퍼짐이 이렇게 생긴다. 그래서 가림 문턱은 낮은 주파수 쪽(기저막 안쪽, apex)으로는 가파르게, 높은 주파수 쪽(기저막 입구, base)으로는 완만하게 떨어진다[^s4].

가리는 소리가 크면 기저막이 흔들리는 구간 자체가 넓어진다. 그래서 가리는 범위도 넓어진다[^s4].

### 스스로 설명해 보기

1. "낮은 가리는 소리는 높은 시험 음의 자리도 흔든다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   진행파는 기저막 입구에서 출발해 자기 자리까지 점점 커지며 간다. 지나가는 입구 쪽 자리들이 높은 주파수를 맡는 자리다.
   </details>
2. "높은 가리는 소리는 낮은 시험 음을 거의 가리지 못한다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   진행파는 자기 자리를 지나면 뚝 끊겨서, 그보다 안쪽(낮은 주파수 자리)까지 가지 않는다.
   </details>
3. "시험 음이 $$T_q$$보다 커도 안 들릴 수 있다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   들리는 조건이 $$L > \max\{T_q, T_m\}$$이기 때문이다. 가리는 소리가 있으면 $$T_m$$이 $$T_q$$보다 높아져 넘어야 할 선이 올라간다.
   </details>
- 이 설명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  들린다는 것은 그 주파수의 기저막 자리가 "따로" 흔들린다는 뜻이다. 가림은 두 소리의 흔들림이 기저막 위에서 겹치는 정도로 정해진다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  소리가 끝난 뒤에도 잠깐 가림이 남는 [시간 가림](/Hongs_Blog/studies/human-interface-media/temporal-masking/), 여러 성분이 함께 만드는 문턱을 계산하는 [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/).
  </details>

### 같은 현상을 두 가지로 말하기

- **문턱으로 말하기:** 가리는 소리가 시험 음의 문턱을 $$T_q(f)$$에서 $$T_m(f)$$로 끌어올린다. 실험으로 직접 재는 양이다.
- **기저막으로 말하기:** 가리는 소리가 기저막에 만든 흔들림 모양(흥분 패턴)이 시험 음이 흔들 자리를 덮는다. 끌어올려진 문턱의 모양은 이 흔들림 모양을 주파수 축으로 옮겨 놓은 것이다[^s4].

### 가림인 것과 아닌 것

| 경우 | 주파수 가림인가 | 이유 |
|---|---|---|
| 1 kHz 60 dB가 울리는 동안 2 kHz 2 dB 순음이 안 들린다 | 그렇다 | 조용할 때라면 들릴 크기($$T_q \approx -0.3$$ dB)인데 가림 문턱 아래다 |
| 식당 소음 속에서 옆 사람 말이 안 들린다 | 그렇다 | 소음의 넓은 주파수 성분이 말소리 주파수의 문턱을 끌어올린다 |
| 부호기가 큰 성분 바로 위 주파수의 작은 성분을 버렸는데 차이를 못 느낀다 | 그렇다 | 버린 성분이 가림 문턱 아래였다 |
| 아무 소리도 없을 때 9 kHz 2 dB 순음이 안 들린다 | 아니다 | 가리는 소리가 없다. 조용할 때의 문턱(약 7 dB)보다 작을 뿐이다 |
| 큰 소리가 끝나고 0.05초 뒤에 울린 작은 소리가 안 들린다 | 아니다 | 두 소리가 동시에 울리지 않았다. [시간 가림](/Hongs_Blog/studies/human-interface-media/temporal-masking/)이다 |

## 예제

**문제.** 1 kHz 순음이 60 dB로 울린다. 시험 음 넷(800 Hz 30 dB, 1.2 kHz 50 dB, 1.5 kHz 25 dB, 2 kHz 20 dB) 가운데 들리는 것은? 위의 모형 식을 쓴다[^s5].

1. **바크 거리 구하기.** $$z(1000) = 8.51$$이다. 800 Hz는 $$7.14$$라서 $$\Delta z = -1.37$$, 1.2 kHz는 $$9.70$$이라 $$+1.19$$, 1.5 kHz는 $$11.20$$이라 $$+2.69$$, 2 kHz는 $$13.10$$이라 $$+4.59$$다. 가리는 소리에서 귀의 칸으로 몇 칸 떨어졌는지를 먼저 재야 퍼짐 함수를 쓸 수 있다.
2. **퍼짐 구하기.** $$SF(\Delta z)$$는 차례로 −14.4, −5.7, −18.5, −36.6 dB다. 800 Hz는 1.37칸 아래인데 −14.4 dB이고, 1.2 kHz는 1.19칸 위인데 −5.7 dB밖에 안 된다. 아래쪽이 더 빨리 줄어든다.
3. **가림 문턱 구하기.** $$T_m = 60 - 10 + SF$$이므로 35.6, 44.3, 31.5, 13.4 dB다.
4. **넘어야 할 선 정하기.** 조용할 때의 문턱은 4.2, 2.7, 1.7, −0.3 dB로 모두 가림 문턱보다 낮다. 그래서 넘어야 할 선은 가림 문턱이다.
5. **판정.** 800 Hz는 30 < 35.6이라 가려진다. 1.2 kHz는 50 > 44.3이라 들린다. 1.5 kHz는 25 < 31.5라 가려진다. 2 kHz는 20 > 13.4라 들린다.

**확인.** 800 Hz와 1.2 kHz는 1 kHz에서 똑같이 200 Hz 떨어져 있다. 그런데 문턱은 위쪽(1.2 kHz)이 약 9 dB 높다. 위쪽 퍼짐이 계산에서도 그대로 나온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 퍼짐 함수의 봉우리(Δz = 0에서 0 dB)와 양쪽 기울기(+25, −10 dB/Bark), 가리는 범위(40 dB 729~1,778 Hz, 60 dB 622~2,624 Hz, 80 dB 526~3,776 Hz), 그림 2의 세 판정, 예제의 문턱 값과 판정, 카드 C3·C4의 값 (모형 계산으로 확인됨) — [52_frequency-masking_verify.py](/Hongs_Blog/studies/human-interface-media/code/52_frequency-masking_verify/)</div>

</div>


## 활용

- **소리 압축.** 가림 문턱 아래 성분은 버리고, 위로 나온 성분도 문턱 위로 나온 만큼만 정밀하게 적는다. MP3(MPEG-1 오디오 레이어 3)와 AAC가 이렇게 데이터를 줄인다: [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/), [MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/)[^s6].
- **압축 잡음 숨기기.** 숫자를 덜 정밀하게 적으면 잡음이 생긴다([양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/)). 이 잡음을 가림 문턱 아래에 두면 들리지 않는다.
- **흔한 실수.** 판정할 때 가림 문턱만 보고 조용할 때의 문턱을 잊는 것. 가리는 소리에서 멀리 떨어진 성분은 조용할 때의 문턱이 기준이다.

## 연결

- 선수: [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/) (조용할 때의 문턱 $$T_q$$), [달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/) (주파수마다 다른 기저막 자리)
- 가리는 범위를 재는 귀의 칸: [임계 대역과 바크 스케일](/Hongs_Blog/studies/human-interface-media/critical-band-bark/)
- 시간 축에서의 짝: [시간 가림](/Hongs_Blog/studies/human-interface-media/temporal-masking/)
- 여러 성분을 합친 문턱: [심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"가려진 소리는 귀에 도착하지 않는다"</div>

틀렸다. 안 들리니 소리가 막히거나 사라진 것처럼 느껴진다. 실제로 가려진 소리의 압력 변화는 그대로 고막까지 와서 기저막도 흔든다. 다만 같은 자리를 더 크게 흔드는 가리는 소리에 묻혀 따로 알아챌 수 없을 뿐이다. 확인 방법: 가리는 소리를 끄면 같은 시험 음이 바로 들린다. 예시의 2 kHz 2 dB 순음은 조용할 때의 문턱(약 −0.3 dB)보다 크다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"큰 소리는 위아래로 똑같이 가린다"</div>

틀렸다. 그래프를 대충 보면 가리는 소리를 가운데 둔 산 모양이라 좌우 대칭처럼 보인다. 실제로는 낮은 쪽으로는 가파르게, 높은 쪽으로는 완만하게 떨어진다. 400 Hz 잡음 실험에서 한 옥타브 아래로 가면 문턱 상승이 약 50 dB 줄지만, 한 옥타브 위에서는 약 25 dB만 준다. 확인 방법: 예제처럼 같은 Hz만큼 위아래로 떨어진 두 시험 음의 문턱을 비교한다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 가림 문턱을 정의하고, 주파수 가림의 두 성질(가리는 소리의 크기에 따라, 위아래 방향에 따라)을 쓰라.</summary>


**답:** 가리는 소리가 울리는 동안, 시험 음이 들리기 시작하는 가장 작은 레벨을 시험 음의 주파수마다 이은 선이 가림 문턱이다. (1) 가리는 소리가 클수록 가리는 범위가 넓어진다. (2) 범위는 가리는 소리보다 높은 주파수 쪽으로 더 넓게 퍼진다.<br>
**흔한 오답:** 가림 문턱을 "가리는 소리의 크기"로 쓰는 것. 가림 문턱은 시험 음이 넘어야 하는 선이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 가림이 높은 주파수 쪽으로 더 멀리 퍼지는 이유를 기저막의 진행파로 설명하라.</summary>


**답:** 진행파는 기저막 입구(높은 소리를 맡는 쪽)에서 출발해 점점 커지며 안쪽으로 가다가, 자기 주파수의 자리에서 가장 커지고 곧 끊긴다. 낮은 가리는 소리의 파동은 자기 자리까지 가는 동안 입구 쪽의 높은 소리 자리들을 함께 흔들어 높은 시험 음을 가린다. 높은 가리는 소리의 파동은 안쪽의 낮은 소리 자리까지 가지 않아 낮은 시험 음을 거의 가리지 못한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 2 kHz 순음이 70 dB로 울린다. 1.5 kHz 40 dB와 2.5 kHz 40 dB 시험 음 가운데 가려질 가능성이 큰 쪽은? 둘 다 2 kHz에서 500 Hz씩 떨어져 있다.</summary>


**답:** 2.5 kHz다. 가림은 가리는 소리보다 높은 쪽으로 더 넓게 퍼지기 때문이다. 이 문서의 모형으로 계산하면 가림 문턱이 2.5 kHz에서 약 52.7 dB, 1.5 kHz에서 약 34.5 dB다. 2.5 kHz의 40 dB는 문턱 아래라 가려지고, 1.5 kHz의 40 dB는 문턱 위라 들린다.<br>
**흔한 오답:** "같은 거리, 같은 크기라서 둘 다 가려지거나 둘 다 들린다."

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 2 kHz 순음이 70 dB로 울린다. 시험 음마다 "들림", "가려서 안 들림", "작아서 안 들림" 가운데 하나로 판정하라. 괄호는 (조용할 때의 문턱, 가림 문턱)이다. 가. 1.7 kHz 20 dB (1.0 dB, 51.0 dB) / 나. 4 kHz 20 dB (−3.4 dB, 27.7 dB) / 다. 15 kHz 40 dB (51.0 dB, −37.9 dB) / 라. 500 Hz 30 dB (6.3 dB, 0 dB보다 훨씬 낮음)</summary>


**답:** 가. 가려서 안 들림 (20 < 51.0, 조용할 때라면 들림). 나. 가려서 안 들림 (20 < 27.7). 한 옥타브 위인데도 가려진다. 다. 작아서 안 들림 (40 < 51.0, 가림과 상관없음). 라. 들림 (30 > 6.3, 아래쪽이라 가림이 거의 없다).<br>
**이유:** 시험 음마다 두 문턱 가운데 높은 쪽과 비교한다. 안 들리는 까닭은 높은 쪽이 어느 문턱이냐로 가른다.

</details>

[^s2]: [52_frequency-masking_plot.py](/Hongs_Blog/studies/human-interface-media/code/52_frequency-masking_plot/)로 그렸고, 세 판정은 같은 코드에서 확인했다.
[^s3]: 퍼짐 함수는 M. R. Schroeder, B. S. Atal, J. L. Hall, "Optimizing digital speech coders by exploiting masking properties of the human ear," JASA 66(6), 1979의 식이고, 바크 식은 E. Zwicker & E. Terhardt, JASA 68(5), 1980의 식이다. 가리는 소리 레벨에서 문턱 봉우리까지의 간격은 J. D. Johnston(1988, IEEE JSAC 6(2))의 부호기에서 순음이 잡음을 가릴 때 약 $$14.5 + z$$ dB, 잡음이 순음을 가릴 때 약 5.5 dB로 다르게 둔다. 이 문서는 설명을 위해 10 dB로 고정했다. 이 퍼짐 함수는 가리는 소리의 크기와 상관없이 모양이 같아서, 그림 1에서 범위가 넓어지는 것은 곡선 전체가 위로 올라가기 때문이다. 실제 측정에서는 가리는 소리가 클수록 위쪽 기울기 자체도 완만해진다(Terhardt 1979: 위쪽 기울기 약 $$24 + 230/f - 0.2L$$ dB/Bark). 그림 1의 범위 값은 52_frequency-masking_plot.py로 계산하고 확인했다.
[^s4]: 가림을 기저막 흔들림의 겹침으로 설명하는 것, 위쪽 퍼짐을 진행파의 비대칭 포락선으로 설명하는 것, 가리는 소리가 클수록 흔들리는 구간이 넓어진다는 것은 청각 교재(예: B. C. J. Moore, *An Introduction to the Psychology of Hearing*; E. Zwicker & H. Fastl, *Psychoacoustics*)의 표준 설명이다.
[^s5]: 이 문서의 모형 식으로 계산했고 52_frequency-masking_verify.py로 확인했다. 실제 사람의 문턱은 사람과 측정 방법에 따라 몇 dB씩 다르다.
[^s6]: MP3와 AAC가 청각 가림을 이용해 비트를 줄인다는 것은 Painter & Spanias, "Perceptual coding of digital audio," Proc. IEEE 88(4), 2000 같은 지각 부호화 개관의 표준 내용이다.
{% endraw %}
