---
layout: "note"
title: "푸리에 표현 네 가지 비교"
display_title: "푸리에 표현 네 가지 비교"
kind: "concept"
kind_label: "비교"
num: "60"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Four Fourier Representations", "푸리에 급수와 변환 비교", "Fourier Series vs Fourier Transform", "CTFS CTFT DTFS DTFT", "시간-주파수 쌍대 관계", "스펙트럼 누설", "Spectral Leakage", "단시간 푸리에 변환", "STFT"]
description: "네 표현은 모두 신호를 주파수 성분으로 나눈다. 어느 것을 쓸지는 시간 신호에 대한 두 질문으로 정해진다. 시간이 이어져 있는가 띄엄띄엄한가, 신호가 되풀이되는가 한 번뿐인가. 두 답은 주파수 쪽에 이렇게 옮겨진다. 시간에서 띄엄띄엄하면 스펙트럼이 되풀이되고, 시간에서 되풀이되면 …"
prev_url: "/studies/human-interface-media/dt-periodic-fourier-transform/"
prev_title: "이산 주기 신호의 푸리에 변환"
next_url: "/studies/human-interface-media/sampling-theorem/"
next_title: "표본화 정리"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "60_four-fourier-representations_plot.py", "u": "/studies/human-interface-media/code/60_four-fourier-representations_plot/", "r": "그림 생성"}, {"t": "60_four-fourier-representations_verify.py", "u": "/studies/human-interface-media/code/60_four-fourier-representations_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/four-fourier-representations/"
---
{% raw %}
네 표현은 모두 신호를 주파수 성분으로 나눈다. 어느 것을 쓸지는 시간 신호에 대한 두 질문으로 정해진다. 시간이 이어져 있는가 띄엄띄엄한가, 신호가 되풀이되는가 한 번뿐인가. 두 답은 주파수 쪽에 이렇게 옮겨진다. 시간에서 띄엄띄엄하면 스펙트럼이 되풀이되고, 시간에서 되풀이되면 스펙트럼이 띄엄띄엄해진다.

## 어느 쪽일까

상황마다 [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/), [이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/), [이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/) 가운데 어느 것이 맞는지 고르고, 나머지가 왜 아닌지도 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 바이올린이 한 음을 길게 켤 때 마이크가 내는 전압(같은 모양이 계속 되풀이된다고 본다) (b) 손뼉 한 번을 칠 때 마이크가 내는 전압</summary>


**답:** (a) 연속 시간 푸리에 급수. 전압은 모든 순간에 값이 있고(연속) 되풀이된다(주기). 스펙트럼은 기본 주파수의 정수배에만 있는 계수 $$a_k$$들이다. 이산 쪽 표현은 아니다. 아직 일정 간격으로 재지 않은 신호다. (b) 연속 시간 푸리에 변환. 한 번 나타났다 사라져서 급수를 쓸 수 없고, 스펙트럼은 모든 주파수에 걸친 이어진 곡선이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 손뼉 소리를 1초에 44,100번 재서 저장한 수열 (d) 디지털 신호 발생기가 100샘플마다 똑같은 모양을 되풀이해 내보내는 수열</summary>


**답:** (c) 이산 시간 푸리에 변환. 띄엄띄엄 잰 값이고 한 번뿐이다. 스펙트럼은 이어진 곡선이고 $$2\pi$$마다 되풀이된다. 컴퓨터는 이 곡선 전체를 구하지 못하고 DFT로 곡선 위의 점을 구한다. (d) 이산 시간 푸리에 급수. 띄엄띄엄하고 주기 100으로 되풀이되므로 계수가 100개이고, 계수도 100칸마다 되풀이된다. 한 주기 100개 값의 DFT가 정확히 $$100a_k$$다.<br>
**흔한 오답:** (c)를 "디지털이니 DFT"라고 고르는 것. DFT는 스펙트럼 곡선 위의 점을 구하는 계산 방법이다. 이 수열이 가진 스펙트럼 자체는 이산 시간 푸리에 변환이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 디지털 컴퓨터가 처음부터 끝까지 정확히 계산할 수 있는 것은 넷 가운데 무엇인가? 나머지 셋은 왜 안 되는가?</summary>


**답:** 이산 시간 푸리에 급수(곧 DFT)다. 시간 쪽도 숫자 $$N$$개, 주파수 쪽도 숫자 $$N$$개라 유한한 합으로 정확히 바꾸고 되돌린다. 연속 시간 푸리에 급수는 시간 쪽이 이어져 있어(값이 무한히 많아) 적분이 필요하고 계수도 무한히 많다. 연속 시간 푸리에 변환은 양쪽 모두 이어져 있다. 이산 시간 푸리에 변환은 주파수 쪽이 이어진 곡선이고, 수열이 무한히 길 수도 있다.<br>
**이유:** 컴퓨터가 다루는 데이터는 유한한 개수의 숫자다. 그래서 실제로는 유한한 조각을 한 주기로 보고 DFT를 계산한다.

</details>

## 결정적 차이

| 표현 | 시간 신호 | 스펙트럼 | 분석식 | 컴퓨터로 |
|---|---|---|---|---|
| 연속 시간 푸리에 급수 | 이어짐, 주기 $$T$$ | 띄엄띄엄($$k\omega_0$$), 되풀이 없음 | $$a_k = \frac1T\int_T x(t)e^{-jk\omega_0 t}dt$$ | 근사만 |
| 연속 시간 푸리에 변환 | 이어짐, 한 번뿐 | 이어짐, 되풀이 없음 | $$X(j\omega) = \int x(t)e^{-j\omega t}dt$$ | 근사만 |
| 이산 시간 푸리에 급수 | 띄엄띄엄, 주기 $$N$$ | 띄엄띄엄($$\frac{2\pi k}{N}$$), $$N$$칸마다 되풀이 | $$a_k = \frac1N\sum_{n=\langle N\rangle}x[n]e^{-jk(2\pi/N)n}$$ | 정확히(DFT $$= Na_k$$) |
| 이산 시간 푸리에 변환 | 띄엄띄엄, 한 번뿐 | 이어짐, $$2\pi$$마다 되풀이 | $$X(e^{j\omega}) = \sum_n x[n]e^{-j\omega n}$$ | 곡선 위의 점만(DFT) |

선택을 가르는 규칙은 두 줄이다.

1. **시간이 띄엄띄엄하면 스펙트럼은 $$2\pi$$마다 되풀이된다.** 시각 $$n$$이 정수뿐이라 $$e^{j(\omega + 2\pi)n} = e^{j\omega n}$$이기 때문이다.
2. **시간이 되풀이되면 스펙트럼은 띄엄띄엄하다.** 주기 $$T$$인 신호에 들어갈 수 있는 진동은 한 주기에 정수 바퀴를 도는 것, 곧 기본 주파수의 정수배뿐이기 때문이다.

두 규칙은 거꾸로도 맞는다. 스펙트럼이 되풀이되면 시간이 띄엄띄엄하고, 스펙트럼이 띄엄띄엄하면 시간이 되풀이된다. 되풀이되는 신호를 푸리에 변환의 틀로 쓰면 띄엄띄엄한 계수 자리마다 넓이 $$2\pi a_k$$인 임펄스가 선다([주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/), [이산 주기 신호의 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-periodic-fourier-transform/)).

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/60_four-fourier-representations_fig1.svg" alt="그림" width="698" height="852" loading="lazy">

위에서 아래로 네 경우이고, 왼쪽이 시간 신호, 오른쪽이 스펙트럼이다. 첫째 줄의 막대는 둘째 줄 곡선을 $$T$$로 나눈 점선 위에 있다. 셋째 줄의 막대도 넷째 줄 곡선을 $$N$$으로 나눈 점선 위에 있다. 위 두 줄의 스펙트럼은 되풀이되지 않고, 아래 두 줄은 회색 칸(길이 $$2\pi$$) 바깥에서 같은 모양을 되풀이한다[^s1].

그림의 위아래 짝은 "되풀이시키면 띄엄띄엄 찍힌다"는 관계다. 펄스 하나를 주기 $$T$$로 되풀이시킨 사각파의 계수는 $$a_k = \frac1T X(jk\omega_0)$$이고, 다섯 칸짜리 수열을 주기 $$N$$으로 되풀이시킨 수열의 계수는 $$a_k = \frac1N X(e^{j2\pi k/N})$$이다. 컴퓨터의 DFT가 바로 아래쪽 관계다. 유한한 조각의 DFT는 그 조각을 한 주기로 되풀이시킨 수열의 $$Na_k$$이고, 동시에 그 조각의 이산 시간 푸리에 변환을 $$\frac{2\pi}{N}$$ 간격으로 찍은 값이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 사각파($$T = 4$$, $$T_1 = 1$$)의 $$Ta_k$$가 펄스 변환을 $$k\omega_0$$에서 찍은 값, 주기 10 수열의 $$Na_k$$가 이산 시간 푸리에 변환의 표본, 계수가 $$N$$칸마다 되풀이됨, 길이 6 수열의 DFT $$= Na_k =$$ 표본과 정확한 역변환, 누설 예(아래) — [60_four-fourier-representations_verify.py](/Hongs_Blog/studies/human-interface-media/code/60_four-fourier-representations_verify/)</div>

</div>


## 넷 다 아닐 때

- **시간에 따라 바뀌는 소리.** 말소리와 음악은 되풀이되지도 않고, 전체를 한 번에 변환하면 "언제 어떤 소리가 났는지"가 사라진다. 그래서 짧은 구간으로 잘라 구간마다 DFT를 하는 단시간 푸리에 변환(STFT)을 쓰고, 그 결과를 시간 순서로 늘어놓은 그림이 [스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/)이다. 구간을 짧게 자를수록 시간은 정확해지고 주파수는 흐려진다[^s3].
- **잘라 낸 조각의 끝이 맞지 않을 때.** DFT는 조각을 한 주기로 되풀이된다고 본다. 조각의 처음과 끝이 이어지지 않으면 이음매에서 끊긴 모양이 생기고, 한 주파수의 성분이 여러 칸으로 퍼진다(스펙트럼 누설). 예: 32개 값에 코사인이 정확히 4번 들어가면 DFT는 4번과 28번 두 칸에만 값이 있지만, 4.5번 들어가면 32칸 모두에 값이 퍼진다. 끝을 부드럽게 0으로 줄이는 창 함수(예: 해닝 창)를 곱하면 먼 칸으로 새는 양이 약 1.35에서 0.016으로 줄어든다[^s3].
- **줄어들지도 되풀이되지도 않는 신호.** 계단 $$u[n]$$이나 끝없이 이어지는 잡음은 보통 함수로는 넷 어디에도 맞지 않는다. 계단은 임펄스를 허용해 다루고, 잡음은 주파수별 평균 전력(전력 스펙트럼 밀도)으로 다룬다. 수렴 범위를 넓힌 라플라스 변환과 z 변환도 이런 신호를 위한 도구다[^s3].

[^s1]: [60_four-fourier-representations_plot.py](/Hongs_Blog/studies/human-interface-media/code/60_four-fourier-representations_plot/)로 그렸고, 같은 코드로 첫째 줄 막대가 $$\frac1T X(jk\omega_0)$$, 셋째 줄 막대가 $$\frac1N X(e^{j2\pi k/N})$$, 넷째 줄 곡선의 주기 $$2\pi$$를 확인했다.
[^s3]: 단시간 푸리에 변환과 시간·주파수 해상도의 맞바꿈, 스펙트럼 누설과 해닝 창, 전력 스펙트럼 밀도, 라플라스·z 변환은 신호 처리 교재(Oppenheim·Schafer, *Discrete-Time Signal Processing*)의 표준 내용이다. 누설 예의 수치는 검증 코드의 계산값이다.
{% endraw %}
