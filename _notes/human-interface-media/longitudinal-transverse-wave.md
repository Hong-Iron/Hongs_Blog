---
layout: "note"
title: "종파와 횡파"
display_title: "종파와 횡파 (Longitudinal and Transverse Waves)"
kind: "concept"
kind_label: "정의"
num: "23"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Longitudinal Wave", "Transverse Wave", "종파", "횡파", "편광", "Polarization", "진동면", "파속", "wave speed"]
description: "물결이 나아가는 방향과 물결이 흔들리는 방향이 같으면 종파, 서로 수직이면 횡파다. 소리는 공기가 앞뒤로 밀렸다 당겨지는 종파라서, 한 지점에서 시간에 따른 값 하나만 알면 된다. 빛은 횡파라서 나아가는 방향에 수직인 평면 안에서 어느 쪽으로든 흔들릴 수 있다. 그래서 빛을 적으려…"
prev_url: "/studies/human-interface-media/visual-pathway/"
prev_title: "시각 경로"
next_url: "/studies/human-interface-media/complex-wave/"
next_title: "파동의 복소수 표현"
math: true
mermaid: false
code_count: 0
permalink: "/studies/human-interface-media/longitudinal-transverse-wave/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

물결이 나아가는 방향과 물결이 흔들리는 방향이 같으면 종파, 서로 수직이면 횡파다. 소리는 공기가 앞뒤로 밀렸다 당겨지는 종파라서, 한 지점에서 시간에 따른 값 하나만 알면 된다. 빛은 횡파라서 나아가는 방향에 수직인 평면 안에서 어느 쪽으로든 흔들릴 수 있다. 그래서 빛을 적으려면 흔들리는 방향까지 담는 2차원 값이 필요하다.

</div>


## 예시로 보기

스피커 앞의 공기 입자는 소리가 나아가는 쪽으로 밀렸다가 되돌아온다. 입자가 빽빽한 곳과 성긴 곳이 번갈아 생기고, 그 무늬가 앞으로 나아간다[^1]. 흔들리는 방향이 나아가는 방향 하나로 정해져 있으니, 소리는 "이 순간 이 지점의 압력이 얼마인가"라는 숫자 하나로 적힌다. 시간에 따라 바뀌는 값이 하나라서 1차원 신호다.

빛은 전기장과 자기장이 나아가는 방향에 수직으로 흔들리며 나아간다[^1]. 빛이 $$z$$ 방향으로 나아가면 흔들림은 $$x$$ 방향일 수도, $$y$$ 방향일 수도, 둘이 섞인 방향일 수도 있다. 흔들리는 면이 2차원이다.

이 차이는 편광 선글라스에서 보인다. 편광 필터는 한 방향으로 흔들리는 빛만 통과시킨다. 필터 두 장을 겹쳐 하나를 90° 돌리면 빛이 거의 막힌다. 소리에는 이런 현상이 없다. 흔들리는 방향이 하나뿐이라 고를 것이 없기 때문이다[^s1].

| | 소리 | 빛 |
|---|---|---|
| 흔들리는 방향 | 나아가는 방향과 같음 (종파) | 나아가는 방향에 수직 (횡파) |
| 흔들림의 자유도 | 1차원 | 2차원 ($$x$$, $$y$$) |
| 나아가는 축 | 시간·공간 1차원 | 시간·공간 1차원 |
| 처음 상태를 정하는 것 | 위상 | 위상과 흔들리는 방향(회전) |
| 편광 | 없음 | 있음 |

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **종파**: 매질이 흔들리는 방향과 파동이 나아가는 방향이 같은 파동. 예: 소리[^1].
- **횡파**: 흔들리는 방향이 나아가는 방향에 수직인 파동. 예: 빛. 흔들리는 면이 2차원이라 같은 진폭이어도 흔들리는 방향이 다를 수 있다. 이 차이가 **편광**이다[^1].

</div>


강의는 파동을 세 축으로 나눠 본다[^2]. 진폭은 에너지를, 시간축의 반복 길이는 주기 $$T$$를, 공간축의 반복 길이는 파장 $$\lambda$$를 정한다. 시간과 공간을 함께 보면 파동이 나아가는 빠르기(파속)가 나온다. 한 주기 동안 한 파장만큼 나아가므로

$$ V = \frac{\lambda}{T} $$


이다. $$T = 1/f$$를 넣으면 [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)의 $$c = f\lambda$$와 같은 식이다. 예를 들어 440 Hz 소리(주기 약 2.27 ms)가 공기에서 초속 343 m로 가면 파장은 약 78 cm다[^s2].

빛은 흔들림이 2차원이고 그 흔들림이 다시 평면 위에 펼쳐지므로, 강의는 빛의 에너지를 $$f(x, y, t)$$처럼 2차원 공간 위의 파동으로 적어야 한다고 정리한다[^1]. 흔들림 자체의 2차원 성질을 숫자 하나에 담는 방법이 [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)이다[^3].

## 연결

- 선수: [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) (진폭·주파수·위상, $$c = f\lambda$$)
- 2차원 흔들림을 복소수로 적기: [파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/)
- 평면 위에 펼친 빛의 세기: [이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"소리도 물결 그림처럼 위아래로 흔들린다"</div>

틀렸다. 교과서의 사인 곡선 그림은 압력이나 밀도의 크기를 세로축에 그린 그래프일 뿐, 공기 입자가 위아래로 움직인다는 뜻이 아니다. 실제 공기 입자는 나아가는 방향으로 앞뒤로 움직인다. 확인 방법: 소리에는 편광이 없다. 위아래·좌우 흔들림을 고를 수 있다면 편광 필터 같은 것으로 한쪽을 걸러 낼 수 있어야 한다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 종파와 횡파를 흔들리는 방향과 나아가는 방향의 관계로 정의하고, 소리와 빛이 각각 어느 쪽인지 쓰라.</summary>


**답:** 종파는 두 방향이 같고, 횡파는 서로 수직이다. 소리는 종파, 빛은 횡파다.<br>
**흔한 오답:** 소리를 사인 곡선 그림 때문에 횡파로 고르는 것. 그림의 세로축은 압력이지 입자의 위치가 아니다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 빛에는 편광이 있고 소리에는 없는 이유를 흔들림의 차원으로 설명하라.</summary>


**답:** 빛은 나아가는 방향에 수직인 평면(2차원) 어느 방향으로든 흔들릴 수 있어서, 같은 진폭이어도 흔들리는 방향이 다른 빛이 생긴다. 편광은 그 방향의 차이다. 소리는 흔들리는 방향이 나아가는 방향 하나로 정해져 있어 고를 방향이 없다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 주기 $$T = 2$$ ms, 파장 $$\lambda = 0.686$$ m인 소리의 파속은? 이 소리의 주파수는?</summary>


**답:** $$V = \lambda / T = 0.686 / 0.002 = 343$$ m/s. 주파수는 $$1/T = 500$$ Hz.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/04.HIM_강의04_파동의표현.pdf, p.6 (파동의 공간 전파: 소리는 종파, 빛은 횡파와 편광 현상, $$f(x,y,t)$$)
[^2]: 같은 자료, p.3 (에너지: 진폭, 시간축: 주기, 공간축: 파장, 시공간: 파속 $$V = \lambda/T$$)
[^3]: 같은 자료, p.7 (2차원 진동의 표현: 변인은 시간, 초기값은 위상과 회전. 2차원 수인 복소수 체계의 도입)
[^s1]: 에이전트 보충. 편광 필터와 선글라스 예는 원본에 없다. 슬라이드는 "편광 현상"이라는 이름만 든다. 표준 물리 교재의 내용이다.
[^s2]: 에이전트 보충. 440 Hz 예와 카드 C3의 수치는 원본에 없다. 343 m/s는 [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)에서 쓴 공기 중 음속이다. 440 Hz의 파장 343/440 = 0.78 m, C3의 0.686/0.002 = 343은 직접 계산했다.
{% endraw %}
