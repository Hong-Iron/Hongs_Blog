---
layout: "note"
title: "데시벨"
display_title: "데시벨 (Decibel)"
kind: "concept"
kind_label: "정의"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Decibel", "dB", "벨", "bel", "dB SPL", "Sound Pressure Level", "음압 수준", "dB IL", "Intensity Level", "세기 수준", "dB HL", "Hearing Level", "청력 수준", "기준 음압", "reference pressure", "소리 세기", "sound intensity", "역제곱 법칙", "inverse square law"]
description: "데시벨은 소리가 기준 소리보다 몇 배 센지를, 세기가 10배 될 때마다 10씩 오르는 눈금으로 적은 값이다. 겨우 들리는 소리와 귀가 아픈 소리는 압력이 천만 배나 차이 나지만, 이 눈금에서는 0과 140 사이에 들어온다. 대신 dB 숫자는 그냥 더할 수 없어서, 따로 울리는 같은…"
prev_url: "/studies/human-interface-media/sound/"
prev_title: "소리"
next_url: "/studies/human-interface-media/harmonics-complex-tone/"
next_title: "고조파와 복합음"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "44_decibel_plot.py", "u": "/studies/human-interface-media/code/44_decibel_plot/", "r": "그림 생성"}, {"t": "44_decibel_verify.py", "u": "/studies/human-interface-media/code/44_decibel_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/decibel/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데시벨은 소리가 기준 소리보다 몇 배 센지를, 세기가 10배 될 때마다 10씩 오르는 눈금으로 적은 값이다. 겨우 들리는 소리와 귀가 아픈 소리는 압력이 천만 배나 차이 나지만, 이 눈금에서는 0과 140 사이에 들어온다. 대신 dB 숫자는 그냥 더할 수 없어서, 따로 울리는 같은 크기의 소리 둘을 합쳐도 3 dB만 오른다. 또 기준을 무엇으로 잡았는지 밝혀야 숫자가 뜻을 갖는다.

</div>


## 예시로 보기

겨우 들리는 소리의 압력을 1로 놓고 다른 소리의 압력을 재면 이렇다.

| 소리 | 압력이 몇 배인가 | dB |
|---|---|---|
| 겨우 들림 (문턱) | 1 | 0 |
| 나뭇잎이 바스락거림 | 10 | 20 |
| 조용한 주택가 | 100 | 40 |
| 보통 대화 | 1,000 | 60 |
| 급행 지하철 | 100,000 | 100 |
| 프로펠러 비행기 이륙 | 1,000,000 | 120 |
| 제트 엔진 이륙 (귀가 아픔) | 10,000,000 | 140 |

배수를 그대로 쓰면 "지하철은 대화의 100배"처럼 0의 개수를 세는 일이 된다. 게다가 귀는 압력이 얼마나 늘었는지보다 몇 배로 늘었는지에 반응한다. 그래서 배수를 로그로 바꾼다. 상용로그 $$\log_{10}$$은 "10을 몇 번 곱했나"를 센다. $$\log_{10} 1000 = 3$$이다. 보통 대화는 기준의 1,000배이므로 3이고, 여기에 20을 곱해 60 dB로 적는다. 20을 곱하는 이유는 정의 아래의 설계 이유와 증명 1에 있다. 로그 눈금 자체는 [로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/)에 있다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/44_decibel_fig1.svg" alt="그림" width="693" height="344" loading="lazy">

세 눈금자는 같은 소리를 세 가지로 적는다. 맨 위 dB 눈금에서 한 칸(20 dB) 오른쪽으로 가면, 가운데 음압 비는 10배, 맨 아래 세기 비는 100배가 된다. dB는 0에서 140까지 고르게 늘지만, 세기 비는 1에서 $$10^{14}$$(100조)까지 늘어난다[^s1].

**음압과 세기.** 소리의 크기를 재는 물리량은 둘이다. 음압은 공기 압력이 대기압에서 얼마나 벗어났는가(Pa)이고, 세기(intensity)는 1초 동안 넓이 1 m²를 지나가는 소리 에너지(W/m²)다. 음압이 2배가 되면 공기를 미는 힘도, 공기가 밀려 움직이는 빠르기도 2배가 된다. 그래서 실어 나르는 에너지는 $$2 \times 2 = 4$$배다. 세기는 음압의 제곱에 비례한다[^s2]. 위 표의 압력 비 10은 세기 비 100이고, 둘 다 20 dB다.

**거리와 합치기.** 어떤 사람의 목소리가 30 dB로 들리는 자리에서 거리를 절반으로 줄이면 36 dB, 두 배로 늘리면 24 dB로 들린다. 작은 점에서 퍼지는 소리는 공 모양으로 퍼지고, 공의 겉넓이는 반지름의 제곱에 비례한다. 거리가 2배면 같은 에너지가 4배 넓이에 퍼져 세기가 4분의 1이 되고, $$10\log_{10}(1/4) \approx -6$$ dB다. 도로처럼 긴 줄에서 나는 소리는 원통 모양으로 퍼져 거리가 2배면 넓이가 2배, 곧 $$-3$$ dB다. 60 dB 확성기 두 개를 함께 켜면 120 dB가 아니라 63 dB다. 따로 울리는 두 소리는 세기가 더해지고, 세기 2배는 $$+3$$ dB이기 때문이다.

**문턱을 0으로 잡는 눈금.** 사람이 겨우 듣는 크기는 주파수마다 크게 다르다. 가청 곡선을 읽으면 1 kHz 근처에서는 약 0 dB SPL이면 들리지만, 100 Hz에서는 약 35 dB SPL은 되어야 들린다[^s3]. 그래서 같은 40 dB SPL이 1 kHz에서는 문턱보다 40 dB 위이고, 100 Hz에서는 5 dB 위일 뿐이다. 청력 검사는 주파수마다 정상 청력의 문턱을 0으로 놓고 그보다 몇 dB 위인지를 센다. 이것이 dB HL이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

데시벨은 어떤 양이 기준값의 몇 배인지를 상용로그로 센 값이다. 소리에서는 기준을 무엇으로 잡느냐에 따라 세 가지를 쓴다.
- **dB IL**(세기 수준): 세기가 기준 세기의 몇 배인지 로그를 구해 10을 곱한다. 기준 세기는 1 kHz 근처에서 사람이 겨우 듣는 세기다.
- **dB SPL**(음압 수준): 음압이 기준 음압의 몇 배인지 로그를 구해 20을 곱한다. 기준 음압은 같은 문턱 소리의 음압이다.
- **dB HL**(청력 수준): 주파수마다 정상 청력의 문턱을 0 dB로 놓고, 그보다 몇 dB 위인지 센다.

**기호로 쓰면.**

$$ L_{IL} = 10\log_{10}\frac{I_o}{I_r}, \qquad I_r = 10^{-16}\ \text{W/cm}^2 = 10^{-12}\ \text{W/m}^2 $$

$$ L_{SPL} = 20\log_{10}\frac{P_o}{P_r}, \qquad P_r = 20\ \mu\text{Pa} = 2 \times 10^{-5}\ \text{Pa} = 2 \times 10^{-4}\ \text{dyn/cm}^2 $$

$$ L_{HL}(f) = L_{SPL} - H_r(f) $$

$$I_o$$는 잰 소리의 세기, $$I_r$$은 기준 세기다. $$P_o$$는 잰 소리의 음압, $$P_r$$은 기준 음압이다. $$H_r(f)$$는 주파수 $$f$$에서 정상 청력의 문턱을 dB SPL로 적은 값이다. 문턱 크기의 소리는 $$L_{HL} = 0$$ dB다[^s4].

</div>


$$P_o$$에는 흔들리는 압력의 실효값(제곱해 평균 낸 뒤 제곱근)을 넣는다. 사인파라면 봉우리 값을 $$\sqrt{2}$$로 나눈 값이다. 모양이 같은 두 소리를 비교할 때는 봉우리끼리 나누든 실효값끼리 나누든 비가 같다[^s4]. 단위 dyn/cm²(다인 매 제곱센티미터)는 옛 단위로, 1 Pa $$=$$ 10 dyn/cm²다.


**IL과 SPL은 같은 숫자를 낸다.** 세기와 음압은 $$I = P^2/(\rho c)$$로 이어진다. $$\rho$$(로)는 공기의 밀도, $$c$$는 소리의 빠르기이고, 20 °C 공기에서 $$\rho c \approx 413$$ Pa·s/m다. 기준값 둘이 이 식으로 짝지어져 있으면 dB IL과 dB SPL은 같은 소리에 같은 숫자를 준다(증명 1). 20 μPa를 이 식에 넣으면 $$0.97 \times 10^{-12}$$ W/m²로 $$I_r$$과 거의 같다. 공기 속 소리에서는 두 값의 차이가 0.14 dB뿐이라 그냥 "dB"라고 섞어 쓰는 경우가 많다[^s2].

**설계 이유.**
- *비를 쓰는 이유.* 귀는 압력이 얼마나 늘었는지보다 몇 배 늘었는지에 반응한다. 그래서 기준 소리와의 비를 잰다.
- *로그를 쓰는 이유.* 들리는 범위가 압력으로 천만 배, 세기로 100조 배다. 로그를 쓰면 곱하기가 더하기로 바뀌어 이 범위가 0~140의 숫자가 된다.
- *10을 곱하는 이유.* 세기 비의 상용로그 자체를 벨(B)이라 한다. 벨로는 들리는 범위가 0~14 B라 너무 거칠다. 10분의 1 벨, 곧 데시벨로 쪼개면 0~140의 정수로 적을 수 있다[^s5].
- *음압에 20을 곱하는 이유.* 같은 소리를 음압으로 재든 세기로 재든 같은 숫자가 나오게 하기 위해서다. 세기가 음압의 제곱이므로 로그 앞의 10이 20이 된다(증명 1).

| 데시벨인 것 | 데시벨이 아닌 것 |
|---|---|
| 60 dB SPL: 기준 20 μPa의 1,000배인 음압 | 세기 차이 $$I_o - I_r$$에 10을 곱한 값: 차이를 잰 것이지 배수를 잰 것이 아니다 |
| 20 dB HL: 그 주파수의 정상 문턱보다 음압이 10배 큰 소리 | "느끼는 크기 2배": 사람이 느끼는 크기는 dB와 따로 논다. 2배로 느끼려면 약 10 dB를 올려야 한다([소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/)) |
| "+3 dB": 두 소리의 세기 비가 2라는 뜻. 기준 없이 두 소리를 비교하는 상대값 | |

## 증명

네 가지 계산 규칙은 모두 "로그는 곱을 합으로 바꾼다($$\log_{10} ab = \log_{10} a + \log_{10} b$$)"와 "세기는 음압의 제곱에 비례한다"에서 나온다.

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


**1. 음압에는 20, 세기에는 10.** 기준 세기를 $$I_r = P_r^2/(\rho c)$$로 짝지으면,

$$ 10\log_{10}\frac{I_o}{I_r} = 10\log_{10}\frac{P_o^2/(\rho c)}{P_r^2/(\rho c)} = 10\log_{10}\left(\frac{P_o}{P_r}\right)^2 = 20\log_{10}\frac{P_o}{P_r}. $$

첫 등호는 $$I = P^2/(\rho c)$$를 넣은 것, 둘째는 $$\rho c$$가 약분된 것, 셋째는 $$\log_{10} x^2 = 2\log_{10} x$$다.

**2. 두 배 규칙.** 세기만 $$k$$배가 되면 $$10\log_{10}(kI_o/I_r) = 10\log_{10}(I_o/I_r) + 10\log_{10}k$$다. $$k = 2$$이면 $$+10\log_{10}2 \approx +3.01$$ dB, $$k = 10$$이면 $$+10$$ dB다. 음압이 2배가 되면 세기는 4배이므로 $$+20\log_{10}2 \approx +6.02$$ dB다.

**3. 소리 합치기.** 두 소리의 음압을 $$p_1(t)$$, $$p_2(t)$$라 하면 합친 소리의 평균 제곱은

$$ \overline{(p_1 + p_2)^2} = \overline{p_1^2} + \overline{p_2^2} + 2\,\overline{p_1 p_2} $$

다(윗줄은 긴 시간 평균). 두 소리가 서로 상관없으면(다른 확성기, 다른 주파수) 곱 $$p_1p_2$$는 양수와 음수를 고루 오가 평균이 0이다. 그러면 평균 제곱, 곧 세기가 그냥 더해진다.

$$ L = 10\log_{10}\left(10^{L_1/10} + 10^{L_2/10}\right) $$

$$L_1 = L_2 = 60$$이면 $$10\log_{10}(2 \times 10^6) = 60 + 3.01$$ dB다. 두 소리가 같은 신호이고 같은 위상이면 $$p_1 = p_2$$라 $$\overline{p_1p_2} = \overline{p_1^2}$$이다. 평균 제곱이 4배가 되어 $$+6.02$$ dB다. 반대 위상이면 $$p_2 = -p_1$$이라 합이 0이다.

**4. 거리.** 점에서 나온 소리의 힘(1초당 에너지) $$W$$가 반지름 $$r$$인 공의 겉면 $$4\pi r^2$$에 고루 퍼지면 세기는 $$I = W/(4\pi r^2)$$다. 거리 $$r_1$$에서 $$r_2$$로 가면

$$ \Delta L = 10\log_{10}\frac{I_2}{I_1} = 10\log_{10}\frac{r_1^2}{r_2^2} = -20\log_{10}\frac{r_2}{r_1} $$

이다. $$r_2 = 2r_1$$이면 $$-6.02$$ dB다. 길이 $$\ell$$인 줄에서 나온 소리는 원통 옆면 $$2\pi r\ell$$에 퍼지므로 $$I \propto 1/r$$이고, 거리 2배마다 $$-3.01$$ dB다.

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 단위 환산(20 μPa $$= 2\times10^{-4}$$ dyn/cm²), $$I = P^2/(\rho c)$$로 본 두 기준의 짝(0.14 dB 차이), 음압 8개에서 IL $$=$$ SPL, 표의 상대 진폭 1~$$10^7$$ → 0~140 dB, 60+60 $$=$$ 63.01 dB와 같은 위상 66.02 dB·반대 위상 0(평균 제곱 수치 적분), 거리 2배 $$-6.02$$ dB와 $$-3.01$$ dB (실험으로 확인됨). 증명 1~4의 대수는 단계별로 점검함 — [44_decibel_verify.py](/Hongs_Blog/studies/human-interface-media/code/44_decibel_verify/)</div>

</div>


### 스스로 설명해 보기

1. "$$10\log_{10}(P_o^2/P_r^2) = 20\log_{10}(P_o/P_r)$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   로그의 거듭제곱 규칙 $$\log_{10} x^2 = 2\log_{10} x$$. 앞의 10에 2가 곱해져 20이 된다. 이 단계가 가능하려면 먼저 $$I_r = P_r^2/(\rho c)$$로 기준이 짝지어져 $$\rho c$$가 약분되어야 한다.
   </details>
2. "서로 상관없는 두 소리는 세기가 더해진다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   합친 소리의 평균 제곱에는 두 소리 각각의 평균 제곱과 곱 $$2\overline{p_1p_2}$$가 있다. 서로 상관없으면 곱이 양수와 음수를 고루 오가 평균이 0이 된다. 남는 것은 두 평균 제곱의 합이고, 세기는 평균 제곱에 비례한다.
   </details>
3. "점음원은 거리 2배마다 $$-6$$ dB"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   에너지가 공의 겉면 $$4\pi r^2$$에 퍼지므로 세기가 $$1/r^2$$에 비례한다. 거리 2배면 세기 1/4, $$10\log_{10}(1/4) = -6.02$$ dB.
   </details>
- 네 규칙에 공통인 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  dB를 다룰 때는 먼저 세기(또는 음압의 제곱)로 돌아가 물리 법칙대로 계산하고, 마지막에 다시 로그를 취한다. 로그가 곱을 합으로 바꾸므로 "몇 배"는 "몇 dB 더하기"가 된다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  통신의 신호 대 잡음비와 선로 감쇠, 증폭기의 이득을 dB로 더하고 빼는 계산. 전압처럼 제곱해야 전력이 되는 양에는 20 log, 전력에는 10 log를 쓴다.
  </details>

## 예제

손으로 풀 때는 늘 같은 순서를 따른다. 조건 확인(세기가 더해지는가, 음압이 더해지는가, 어떤 모양으로 퍼지는가) → dB를 세기 비로 풀기 → 세기로 계산 → 다시 dB로.

**예제 1. 크기가 다른 두 소리.** 60 dB와 50 dB(서로 상관없음)를 합친다.
1. *조건 확인:* 서로 다른 소리이므로 세기가 더해진다.
2. *세기 비로 풀기:* $$10^{6}$$과 $$10^{5}$$.
3. *세기로 계산:* $$10^6 + 10^5 = 1.1 \times 10^6$$.
4. *다시 dB로:* $$10\log_{10}(1.1 \times 10^6) = 60.41$$ dB. 큰 소리에 비해 작은 쪽이 10 dB 이상 작으면 합쳐도 0.5 dB도 오르지 않는다.

**예제 2. 경계 사례.** 0 dB는 소리가 없다는 뜻이 아니다. 기준과 같은 크기라는 뜻이다. 기준보다 작은 소리는 음수 dB다. 음압이 기준의 절반이면 $$20\log_{10}(1/2) = -6.02$$ dB다.

**예제 3. 가정을 빼면 깨지는 예.** "같은 소리 둘이면 +3 dB"는 두 소리가 서로 상관없을 때만 맞다. 한 앰프에서 같은 신호를 받는 스피커 둘이 같은 위상으로 만나면 +6 dB가 되고, 반대 위상으로 만나면 거의 사라진다. 소음 제거 헤드폰은 반대 위상 소리를 내서 이 상쇄를 일부러 일으킨다[^s7].

연습: [데시벨 예제 사다리](/Hongs_Blog/studies/human-interface-media/decibel-ladder/)

## 활용

- **청력 검사.** 청력도(audiogram)는 주파수마다 겨우 들리는 크기를 dB HL로 적는다. 정상인 사람은 모든 주파수에서 0 근처의 가로줄이 되고, 듣기 어려운 주파수가 있으면 그 자리가 아래로 처진다[^s4].
- **소음 규제와 청력 보호.** 소음 노출 기준은 dB로 정한다. 예를 들어 미국 국립산업안전보건연구원(NIOSH)은 하루 8시간에 85 dB(A)를 권고하고, 3 dB 오를 때마다 허용 시간을 절반으로 줄인다[^s8]. 3 dB가 세기 2배이므로, 에너지를 같게 맞추는 규칙이다. (A)는 사람 귀가 덜 예민한 주파수를 깎아 잰다는 표시로, [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)과 이어진다.
- **음향 계산.** 공연장, 도로 방음벽, 스피커 배치에서 거리와 소리 합치기 계산(증명 3·4)을 그대로 쓴다.
- **다른 분야.** 통신의 신호 대 잡음비, 증폭기 이득, 선로 감쇠도 dB로 적는다. 구간마다의 배수가 곱해지는 대신 dB가 더해져 계산이 쉽다([로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/)).

## 연결

- 선수: [소리](/Hongs_Blog/studies/human-interface-media/sound/) (음압과 진폭), [로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/) (로그 눈금과 3 dB)
- dB 숫자와 느끼는 크기의 차이: [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/)
- 들리는 dB 범위(문턱과 아픈 문턱): [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)
- 주파수마다 다른 문턱과 같은 크기로 들리는 선: [등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"60 dB 소리 둘을 합치면 120 dB다"</div>

틀렸다. dB도 숫자이니 더하면 될 것 같다. 그러나 dB는 배수의 로그라서, 숫자를 더하면 세기를 곱한 셈이 된다. 60 dB 둘을 더해 120 dB라고 하면 세기를 $$10^6 \times 10^6 = 10^{12}$$배로 만든 것이다. 실제로는 세기가 $$10^6 + 10^6 = 2 \times 10^6$$배가 될 뿐이라 63 dB다. 확인 방법: $$10\log_{10}(2 \times 10^6) = 63.01$$.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"0 dB는 소리가 없다는 뜻이다"</div>

틀렸다. 숫자 0이 "없음"으로 읽혀서 그렇게 생각하기 쉽다. 0 dB는 기준값과 같은 크기, 곧 1 kHz 근처에서 겨우 들리는 소리다. 기준보다 작은 소리는 음수 dB가 된다. 사람 귀가 가장 예민한 3~4 kHz 근처에서는 문턱이 0 dB SPL보다 조금 아래라서 0 dB 소리도 들린다([가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)). 확인 방법: 음압이 기준의 절반이면 $$20\log_{10}0.5 = -6.02$$ dB.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> dB IL과 dB SPL의 식을 쓰고, 각각의 기준값을 단위와 함께 쓰라. dB HL은 무엇을 0으로 잡는가?</summary>


**답:** $$L_{IL} = 10\log_{10}(I_o/I_r)$$, $$I_r = 10^{-16}$$ W/cm² $$= 10^{-12}$$ W/m². $$L_{SPL} = 20\log_{10}(P_o/P_r)$$, $$P_r = 20$$ μPa $$= 2\times10^{-4}$$ dyn/cm². dB HL은 주파수마다 정상 청력의 문턱을 0 dB로 잡는다.<br>
**흔한 오답:** $$P_r$$을 0.002 dyn/cm²로 쓰는 것. 이는 200 μPa로 표준값의 10배다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 세기는 $$10\log$$, 음압은 $$20\log$$를 쓰는 이유를 식의 단계로 보여라. 어떤 조건이 있어야 두 값이 같아지는가?</summary>


**답:** $$I = P^2/(\rho c)$$를 넣으면 $$10\log_{10}(I_o/I_r) = 10\log_{10}(P_o^2/P_r^2) = 20\log_{10}(P_o/P_r)$$이다. 마지막 단계는 $$\log_{10}x^2 = 2\log_{10}x$$다. 두 값이 같으려면 기준값이 $$I_r = P_r^2/(\rho c)$$로 짝지어져 있어야 한다(공기에서는 20 μPa와 $$10^{-12}$$ W/m²가 0.14 dB 안에서 맞는다).

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> (가) 70 dB인 기계 두 대(서로 상관없는 소리)를 함께 켜면? (나) 70 dB와 60 dB를 함께 켜면? (다) 작은 점에서 나는 소리를 3 m에서 70 dB로 들었다. 12 m에서는?</summary>


**답:** (가) $$10\log_{10}(2 \times 10^7) = 73.01$$ dB. (나) $$10\log_{10}(10^7 + 10^6) = 70.41$$ dB. (다) 거리 4배라 세기 1/16, $$10\log_{10}(1/16) = -12.04$$ dB, 곧 57.96 dB.<br>
**흔한 오답:** (다)를 거리 4배이니 $$4 \times 6 = 24$$ dB 줄인다고 하는 것. 거리 2배마다 6 dB이므로 4배는 두 번, 12 dB다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> "같은 크기의 소리 둘을 합치면 3 dB 오른다"가 틀리는 경우를 두 가지 들고, 각각 몇 dB가 되는지 쓰라. 한 스피커가 70 dB일 때로 계산하라.</summary>


**답:** 두 스피커가 같은 신호를 같은 위상으로 내면 음압이 2배가 되어 $$70 + 20\log_{10}2 = 76.02$$ dB다. 반대 위상이면 음압이 서로 지워져 거의 0(이론상 $$-\infty$$ dB)이 된다.<br>
**이유:** "+3 dB"는 두 소리의 곱 $$p_1p_2$$의 평균이 0이라는 가정, 곧 서로 상관없는 소리라는 가정에서 나온다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 1 kHz 30 dB SPL 소리와 100 Hz 50 dB SPL 소리가 있다. 정상 청력의 문턱이 1 kHz에서 5 dB SPL, 100 Hz에서 35 dB SPL이라 하자. dB SPL로는 어느 쪽이 크고, dB HL로는 어느 쪽이 큰가?</summary>


**답:** dB SPL로는 100 Hz 소리(50 대 30)가 크다. dB HL로는 1 kHz가 $$30 - 5 = 25$$ dB HL, 100 Hz가 $$50 - 35 = 15$$ dB HL로 1 kHz 소리가 크다.<br>
**이유:** dB SPL은 모든 주파수에 같은 기준 20 μPa를 쓰고, dB HL은 그 주파수의 문턱을 기준으로 쓴다. 문턱이 높은 낮은 주파수에서는 SPL 숫자가 커도 문턱 위로 얼마 솟지 않는다.

</details>

[^s1]: [44_decibel_plot.py](/Hongs_Blog/studies/human-interface-media/code/44_decibel_plot/)로 그렸고, 표의 일곱 소리에서 $$20\log_{10}(\text{음압 비}) = 10\log_{10}(\text{세기 비})$$가 표의 dB와 같은지를 같은 코드로 확인했다.
[^s2]: 세기의 뜻, 세기가 음압의 제곱에 비례한다는 관계 $$I = P^2/(\rho c)$$, 20 °C 공기의 $$\rho = 1.204$$ kg/m³와 $$c = 343.2$$ m/s(곱 약 413 Pa·s/m)는 음향 교재의 표준 내용이다. 수치는 검증 코드로 계산했다.
[^s3]: 실제 청력 검사의 문턱 기준값 $$H_r(f)$$는 국제 표준(ISO 389 계열)이 이어폰 종류별로 정하므로 이 그림의 값과 다르다. 여기서는 원리를 보이려고 그림의 값을 썼다. [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)에서 쓰는 근사식(Terhardt)은 100 Hz 문턱을 약 23 dB로 더 낮게 준다. 문턱 곡선은 측정 방법과 대상에 따라 몇~십여 dB 달라진다.
[^s4]: $$L_{HL} = L_{SPL} - H_r(f)$$라는 식, 실효값 설명, 청력도의 모양은 청각학·음향 교재의 표준 내용이다.
[^s5]: 벨(bel)이 세기 비의 상용로그이고 데시벨이 그 10분의 1이라는 것, 벨이라는 이름이 전화 발명자 알렉산더 그레이엄 벨에서 왔다는 것은 표준 내용이다.
[^s7]: 소음 제거(능동 소음 제어) 헤드폰의 원리는 음향 교재의 표준 내용이다. 실제로는 낮은 주파수에서 잘 통하고 모든 소리를 지우지는 못한다.
[^s8]: NIOSH의 권고 노출 한계(1998, 85 dB(A) 8시간, 교환율 3 dB)는 공개 기준이다. 나라와 기관마다 기준이 다르다(예: 미국 OSHA는 90 dB(A)와 교환율 5 dB).
{% endraw %}
