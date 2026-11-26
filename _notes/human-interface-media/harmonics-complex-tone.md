---
layout: "note"
title: "고조파와 복합음"
display_title: "고조파와 복합음 (Harmonics and Complex Tones)"
kind: "concept"
kind_label: "정의"
num: "45"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Harmonics", "Harmonic Wave", "고조파", "하모닉", "배음", "Complex Tone", "복합음", "기본 주파수", "Fundamental Frequency", "기본파", "k차 고조파", "kth harmonic", "화음", "harmonic tone", "잡음", "noise", "고조파의 합", "합성파"]
description: "기타 줄을 튕기면 줄 전체가 한 번에 출렁이는 느린 떨림과 함께, 줄이 두 토막·세 토막으로 나뉘어 2배·3배 빠르게 떠는 떨림이 함께 생긴다. 가장 느린 떨림의 주파수를 기본 주파수, 그 정수배로 떠는 성분들을 고조파라 한다. 고조파만 더한 소리는 모양이 아무리 복잡해도 기본 주…"
prev_url: "/studies/human-interface-media/decibel/"
prev_title: "데시벨"
next_url: "/studies/human-interface-media/loudness-pitch/"
next_title: "소리의 크기와 높이"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "45_harmonics-complex-tone_plot.py", "u": "/studies/human-interface-media/code/45_harmonics-complex-tone_plot/", "r": "그림 생성"}, {"t": "45_harmonics-complex-tone_verify.py", "u": "/studies/human-interface-media/code/45_harmonics-complex-tone_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/harmonics-complex-tone/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

기타 줄을 튕기면 줄 전체가 한 번에 출렁이는 느린 떨림과 함께, 줄이 두 토막·세 토막으로 나뉘어 2배·3배 빠르게 떠는 떨림이 함께 생긴다. 가장 느린 떨림의 주파수를 기본 주파수, 그 정수배로 떠는 성분들을 고조파라 한다. 고조파만 더한 소리는 모양이 아무리 복잡해도 기본 주파수의 한 주기마다 똑같이 되풀이된다. 정수배 관계가 없는 주파수들이 섞이면 모양이 되풀이되지 않아 잡음이 된다.

</div>


## 예시로 보기

실제 소리는 단일음 하나인 경우가 드물다. 목소리나 악기 소리의 압력 그래프는 사인 곡선보다 훨씬 울퉁불퉁하다. 이런 모양을 적으려면 "어떤 사인파를 얼마씩 더했나"로 적는 방법이 필요하다.

양 끝이 묶인 줄은 전체가 한 덩어리로 출렁일 수도 있고, 가운데 한 점이 멈춘 채 두 토막으로 출렁일 수도 있고, 세 토막, 네 토막으로 출렁일 수도 있다. 줄을 따라 물결이 가는 빠르기는 같으므로, 토막이 짧을수록 한 번 오르내리는 데 걸리는 시간이 짧다. 토막이 $$k$$개면 한 토막의 길이가 $$1/k$$이고 $$k$$배 빠르게 떤다[^s1]. 그래서 줄 하나가 내는 소리에는 기본 떨림의 1배, 2배, 3배, … 주파수가 함께 들어 있다.

기본 주파수가 200 Hz이면 고조파는 400, 600, 800 Hz, … 다. 이 성분들을 하나씩 더해 본다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/45_harmonics-complex-tone_fig1.svg" alt="그림" width="699" height="469" loading="lazy">

왼쪽은 합친 압력 파형, 오른쪽은 들어 있는 성분과 그 크기(스펙트럼)다. 위에서 아래로 2차(400 Hz), 3차(600 Hz)를 더할수록 파형 모양이 복잡해진다. 그래도 점선(5 ms 간격)마다 똑같은 모양이 되풀이된다. 5 ms는 기본 주파수 200 Hz의 주기다[^s2].

정수배 관계가 없는 주파수를 섞으면 어떻게 될까.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/45_harmonics-complex-tone_fig2.svg" alt="그림" width="699" height="363" loading="lazy">

위는 200, 400, 600 Hz(200 Hz의 1, 2, 3배)의 합이고 5 ms마다 같은 모양이다. 아래는 200, 283, 447 Hz($$200$$, $$200\sqrt{2}$$, $$200\sqrt{5}$$)의 합이다. 점선 사이의 모양이 매번 다르고, 30 ms 동안 한 번도 같은 모양으로 돌아오지 않는다. 주파수끼리의 비가 정수비가 아니라서 셋이 함께 처음 상태로 돌아오는 때가 없다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **기본 주파수** $$f_0$$: 기본파, 곧 가장 느린 기준 떨림의 주파수. 모든 고조파의 주파수가 이것의 정수배다. 그 주기는 $$T_0 = 1/f_0$$이다.
- **고조파**: 주파수가 기본 주파수의 정수배인 파동. 주파수가 $$k$$배이면 $$k$$차 고조파라 한다.
- **복합음**: 주파수가 서로 다른 음이 둘 이상 합쳐진 소리. 기본 주파수의 정수배 음들만 합친 것을 화음(harmonic tone), 여러 주파수가 정수배 관계 없이 섞인 것을 잡음이라 한다.

**기호로 쓰면.** $$k$$차 고조파의 주파수와 식은

$$ f_k = k \times f_0 = \frac{k}{T_0}, \qquad x_k(t) = A e^{i(2\pi f_k t + \phi)} = A e^{i(2\pi k f_0 t + \phi)} = A e^{i(2\pi k t/T_0 + \phi)} $$

이다($$k = 1, 2, 3, \dots$$, $$A > 0$$은 진폭, $$\phi$$는 위상, $$i$$는 $$i^2 = -1$$인 허수 단위). 1차 고조파($$k = 1$$)가 기본파 자신이다. $$N$$개 고조파의 합성파는

$$ x(t) = \sum_{k=1}^{N} A_k e^{i(2\pi k f_0 t)} = \sum_{k=1}^{N} A_k e^{i\frac{2\pi k t}{T_0}} $$

이다. $$A_k$$는 $$k$$차 고조파의 진폭이고, $$\sum_{k=1}^{N}$$은 $$k = 1$$부터 $$N$$까지 차례로 모두 더한다는 기호다.

</div>


식의 각 부분을 말로 읽으면 이렇다. $$e^{i(2\pi k f_0 t)}$$는 1초에 $$kf_0$$바퀴 도는 크기 1의 회전이고, 앞에 붙은 $$A_k$$가 그 성분의 크기다. 실제 압력은 [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)에서처럼 이 값의 허수부(사인)로 읽는다. 합성파의 식에는 위상 $$\phi$$가 빠져 있지만, $$A_k$$를 복소수 $$A_k = \vert A_k\vert e^{i\phi_k}$$로 두면 성분마다 다른 위상도 같은 식에 들어간다[^s3].

두 고조파만 더한 작은 예는 이렇다. $$x_1(t) = A_1 e^{i(2\pi f_1 t)}$$에 주파수가 3배인 $$x_2(t) = A_2 e^{i(2\pi \cdot 3f_1 t)}$$를 더하면 $$x_{sum}(t) = A_1 e^{i(2\pi f_1 t)} + A_2 e^{i(6\pi f_1 t)}$$다. $$2\pi \cdot 3 = 6\pi$$라서 두 번째 지수가 $$6\pi f_1 t$$가 된다.

**합성파는 $$T_0$$마다 되풀이된다.** $$t$$를 $$T_0$$만큼 밀면 $$k$$차 고조파는

$$ e^{i 2\pi k f_0 (t + T_0)} = e^{i 2\pi k f_0 t} \cdot e^{i 2\pi k f_0 T_0} = e^{i 2\pi k f_0 t} \cdot e^{i 2\pi k} = e^{i 2\pi k f_0 t} $$

가 된다. 둘째 등호는 $$f_0 T_0 = 1$$, 셋째 등호는 $$k$$가 정수라서 $$e^{i2\pi k} = \cos 2\pi k + i\sin 2\pi k = 1$$이기 때문이다. 모든 성분이 $$T_0$$ 뒤에 제자리로 돌아오므로 합도 제자리로 돌아온다. 곧 $$x(t + T_0) = x(t)$$다[^s4].

<details markdown="1"><summary markdown="span">가장 짧은 되풀이 간격은 언제 정확히 $$T_0$$인가</summary>


$$T_0$$는 언제나 되풀이 간격이지만 가장 짧은 간격(기본 주기)은 아닐 수도 있다. 진폭이 0이 아닌 차수 $$k$$들의 최대공약수를 $$g$$라 하면 기본 주기는 $$T_0/g$$다. 그래서 기본파의 진폭 $$A_1$$이 0이 아니면($$g = 1$$) 기본 주기가 정확히 $$T_0$$다.

1. $$x(t + \tau) = x(t)$$가 모든 $$t$$에서 맞으려면 $$\sum_k A_k e^{i2\pi kf_0 t}(e^{i2\pi kf_0\tau} - 1) = 0$$이어야 한다. — 두 식을 빼서 묶음
2. 주파수가 서로 다른 복소 지수들은 일차독립이라, 이 합이 모든 $$t$$에서 0이려면 $$A_k \ne 0$$인 모든 $$k$$에서 $$e^{i2\pi kf_0\tau} = 1$$, 곧 $$kf_0\tau$$가 정수여야 한다. — 복소 지수의 일차독립
3. 이런 $$k$$들이 모두 $$kf_0\tau$$를 정수로 만들면, 최대공약수 $$g$$를 그 $$k$$들의 정수 결합으로 쓸 수 있으므로(베주 항등식) $$gf_0\tau$$도 정수다. 거꾸로 $$gf_0\tau$$가 정수이면 $$g$$가 각 $$k$$를 나누므로 $$kf_0\tau$$도 정수다. — 최대공약수의 성질
4. 따라서 가장 작은 양수 $$\tau$$는 $$1/(gf_0) = T_0/g$$다.

예: $$f_0 = 200$$ Hz에서 차수 $$\{2, 3, 4\}$$만 있으면 $$g = 1$$이라 기본 주기는 그대로 5 ms다. 차수 $$\{2, 4\}$$만 있으면 $$g = 2$$라 2.5 ms다. 이때 소리는 사실상 기본 주파수 400 Hz의 1, 2차 고조파다[^s4].

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 고조파의 세 가지 꼴이 같음, 차수 6가지 조합에서 기본 주기 $$= T_0/\gcd$$(위상을 섞은 경우 포함, $$T_0/m$$ 후보 전수 검사), 440 Hz 복합음 2.27 ms, 200·283·447 Hz 합은 0.5~100 ms의 어떤 밀기에서도 제자리로 오지 않음, 네모파 계수 $$4/(k\pi)$$ (실험으로 확인됨). 되풀이 증명과 기본 주기 증명은 단계별로 점검함 — [45_harmonics-complex-tone_verify.py](/Hongs_Blog/studies/human-interface-media/code/45_harmonics-complex-tone_verify/)</div>

</div>


## 예제

**예제 1. 440 Hz 복합음.** 440 Hz(라 음)와 그 고조파 880, 1320 Hz를 더한 소리를 보자.
1. *기본 주파수 찾기:* 880 $$= 2 \times 440$$, 1320 $$= 3 \times 440$$이라 세 성분 모두 440 Hz의 정수배다. $$f_0 = 440$$ Hz.
2. *되풀이 간격:* $$T_0 = 1/440$$ s $$\approx 2.27$$ ms. 세 성분이 모두 이 간격마다 제자리로 온다.
3. *결론:* 파형은 2.27 ms마다 되풀이되는 화음이다.

**예제 2. 사인파를 더해 네모파에 다가가기.** 기본파(50 Hz, 주기 20 ms)를 진폭 약 1.27로, 3차 고조파를 약 0.42로 두고 더한 뒤, 5차 고조파를 약 0.25로 더 더해 본다. 이 진폭들은 높이 1인 네모파(위아래로 각진 파형)를 사인파로 나눈 계수 $$4/(k\pi)$$($$k = 1, 3, 5$$)와 맞는다. $$4/\pi \approx 1.27$$, $$4/(3\pi) \approx 0.42$$, $$4/(5\pi) \approx 0.25$$다. 홀수 고조파를 더할수록 봉우리가 평평해지고 반 주기 평균이 0.81, 0.90, 0.93으로 1에 다가간다[^s5]. 각진 모양도 고조파를 많이 쌓으면 만들 수 있다.

**예제 3. 기본파가 빠진 합.** 200 Hz의 2, 3, 4차(400, 600, 800 Hz)만 더하면, 200 Hz 성분이 없는데도 최대공약수가 1이라 5 ms마다 되풀이된다. 이 소리가 어떤 높이로 들리는지는 [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/)에서 다룬다.

## 활용

- **음색.** 기본 주파수가 같아도 고조파의 진폭 $$A_k$$를 섞는 비율이 다르면 다른 악기처럼 들린다. 이 차이가 [음색](/Hongs_Blog/studies/human-interface-media/timbre/)이다.
- **귀의 분해.** 달팽이관은 복합음을 고조파 성분별로 나누어 서로 다른 자리에서 받는다([달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/)). 귀가 하는 일을 컴퓨터로 하려면 파형에서 $$A_k$$를 거꾸로 찾아야 하고, 그 방법이 푸리에 급수다.
- **푸리에 급수로 가는 다리.** $$k$$를 1부터 $$N$$까지가 아니라 음수와 0을 포함한 모든 정수로 넓히면, 주기 $$T_0$$인 신호를 고조파의 합으로 쓰는 푸리에 급수가 된다. [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/)는 같은 식을 $$x(t) = \sum_{k=-\infty}^{\infty} a_k e^{jk\omega_0 t}$$로 쓴다. $$j$$는 $$i$$와 같은 허수 단위이고(전기공학에서는 $$i$$를 전류에 쓰기 때문에 $$j$$를 쓴다), $$\omega_0 = 2\pi f_0$$다. $$k = 0$$은 시간에 따라 변하지 않는 상수 성분(평균값)이고, $$k$$와 $$-k$$ 짝이 있어야 합이 실수가 된다[^s6].
- **소리 합성.** 고조파를 골라 더해 소리를 만드는 방식(가산 합성)은 전자 악기와 음성 합성에서 쓴다[^s6].

## 연결

- 선수: [소리](/Hongs_Blog/studies/human-interface-media/sound/) (단일음), [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/) ($$Ae^{i(2\pi t/T + \phi)}$$)
- 되풀이와 기본 주기의 엄밀한 정의: [주기 신호](/Hongs_Blog/studies/signals-and-systems/periodic-signals/)
- 일반화: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), 성분을 그림으로 보기: [스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/)
- 고조파가 만드는 지각: [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/), [음색](/Hongs_Blog/studies/human-interface-media/timbre/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"고조파를 더한 소리는 가장 빠른 성분의 주기로 되풀이된다"</div>

틀렸다. 합친 파형에서 작은 봉우리가 촘촘히 보이니, 그 촘촘한 간격이 주기 같아 보인다. 실제로는 모든 성분이 함께 제자리로 돌아와야 모양이 되풀이된다. 가장 느린 기본파가 돌아오는 $$T_0$$가 그때다. 확인 방법: 200, 400, 600 Hz의 합을 600 Hz의 주기 1.67 ms만큼 밀면 200 Hz 성분이 1/3바퀴만 돌아 모양이 달라진다. 5 ms를 밀어야 셋이 함께 돌아온다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 기본 주파수가 250 Hz이다. 3차 고조파의 주파수를 구하고 $$x_3(t)$$를 $$T_0$$로 쓰라. 1~4차 고조파의 합은 몇 ms마다 되풀이되는가?</summary>


**답:** $$f_3 = 3 \times 250 = 750$$ Hz. $$T_0 = 1/250$$ s $$= 4$$ ms이므로 $$x_3(t) = A e^{i(2\pi \cdot 3t/T_0 + \phi)}$$. 1~4차의 합은 4 ms마다 되풀이된다.<br>
**흔한 오답:** 4차 고조파(1000 Hz)의 주기 1 ms로 답하는 것.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 고조파를 몇 개 더하든 합성파가 $$T_0 = 1/f_0$$마다 되풀이되는 이유를 식으로 설명하라.</summary>


**답:** $$k$$차 고조파를 $$T_0$$만큼 밀면 $$e^{i2\pi kf_0(t+T_0)} = e^{i2\pi kf_0 t}\,e^{i2\pi k}$$이다. $$k$$가 정수라 $$e^{i2\pi k} = 1$$이므로 모든 성분이 제자리로 온다. 성분이 모두 같으니 그 합도 같다.<br>
**이유:** 정수배라는 조건이 핵심이다. $$k$$가 정수가 아니면 $$e^{i2\pi k} \ne 1$$이라 그 성분은 $$T_0$$ 뒤에 제자리에 오지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 기본 주파수 100 Hz의 고조파 가운데 (가) 2차와 4차만 더한 소리, (나) 2차와 3차만 더한 소리의 기본 주기를 각각 구하라. "고조파 합의 기본 주기는 언제나 $$T_0$$다"는 맞는가?</summary>


**답:** (가) 200 Hz와 400 Hz의 합이라 5 ms마다 되풀이된다($$T_0 = 10$$ ms의 절반). (나) 200 Hz와 300 Hz의 합이라 10 ms마다 되풀이된다($$= T_0$$). 그러므로 그 말은 틀렸다. $$T_0$$는 언제나 되풀이 간격이지만, 가장 짧은 간격은 남은 차수들의 최대공약수 $$g$$로 나눈 $$T_0/g$$다.<br>
**흔한 오답:** (나)를 가장 낮은 성분 200 Hz의 주기 5 ms로 답하는 것. 300 Hz 성분은 5 ms 뒤에 1.5바퀴만 돌아 제자리에 없다.

</details>

[^s1]: 줄의 떨림에서 토막이 $$k$$개면 주파수가 $$k$$배라는 설명(줄의 파속이 일정하고 파장이 $$2L/k$$)은 표준 물리 교재의 내용이다.
[^s2]: [45_harmonics-complex-tone_plot.py](/Hongs_Blog/studies/human-interface-media/code/45_harmonics-complex-tone_plot/)로 그렸다. 진폭 1, 0.6, 0.4와 정수배가 아닌 주파수 $$200\sqrt{2}$$, $$200\sqrt{5}$$ Hz는 설명용으로 고른 값이다. 그림 1의 합이 5 ms 밀어도 같고, 그림 2 아래 합은 5 ms 밀면 달라지는지를 같은 코드로 확인했다.
[^s3]: 앞의 것은 [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)의 관례를 따랐고, 뒤의 것은 신호 처리의 표준 표기다.
[^s4]: 복소 지수의 일차독립은 신호 처리·선형대수의 표준 결과다. 검증 코드로 여섯 가지 차수 조합을 전수 검사했다.
[^s5]: 네모파 계수는 표준 내용이다([푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/)).
[^s6]: $$i$$와 $$j$$ 표기의 차이, $$k = 0$$과 음수 $$k$$의 뜻, 가산 합성은 신호 처리·음향 교재의 표준 내용이다.
{% endraw %}
