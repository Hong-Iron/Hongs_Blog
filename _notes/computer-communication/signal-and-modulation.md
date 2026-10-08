---
layout: "note"
title: "신호와 변조"
display_title: "신호와 변조 (Signal and Modulation)"
kind: "concept"
kind_label: "정의"
num: "31"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Modulation", "변조", "모듈레이션", "복조", "demodulation", "모뎀", "modem", "신호", "signal", "신호화", "인코딩", "encoding", "전자기 스펙트럼", "electromagnetic spectrum", "아날로그 신호", "analog signal", "디지털 신호", "digital signal"]
description: "링크 위를 지나가는 것은 0과 1이 아니라 전기, 빛, 전파 같은 물리 신호다. 그래서 보내는 쪽은 데이터를 신호로 바꾸고(변조), 받는 쪽은 신호를 데이터로 되돌린다(복조). 이 둘을 하는 장치가 모뎀이다. 낮은 주파수는 장애물을 잘 지나가지만 빠른 전송에는 한계가 있어서, 통신…"
prev_url: "/studies/computer-communication/node-hardware/"
prev_title: "노드"
next_url: "/studies/computer-communication/wired-links/"
next_title: "유선 링크"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/signal-and-modulation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

링크 위를 지나가는 것은 0과 1이 아니라 전기, 빛, 전파 같은 물리 신호다. 그래서 보내는 쪽은 데이터를 신호로 바꾸고(변조), 받는 쪽은 신호를 데이터로 되돌린다(복조). 이 둘을 하는 장치가 모뎀이다. 낮은 주파수는 장애물을 잘 지나가지만 빠른 전송에는 한계가 있어서, 통신은 점점 높은 주파수로 옮겨 간다.

</div>


## 예시로 보기

데이터는 링크를 통해 논리적으로는 0과 1이지만, 물리적으로는 신호다[^1]. 라디오 방송국이 목소리를 전파의 흔들림에 실어 보내고, 라디오가 그 흔들림에서 목소리를 되살리는 것과 같다.

신호는 전자기파의 파동이다. 슬라이드 그림의 파동에서 위아래로 흔들리는 높이가 진폭이고, 한 번 흔들리는 거리가 파장이다. 1초에 몇 번 흔들리는지가 주파수(Hz)다[^2]. 주파수와 파장은 반비례해서, 공기 중에서 주파수 × 파장 $$= 3.0 \times 10^8$$ m/s다[^s1].

| 쓰임 (슬라이드 스펙트럼) | 주파수 | 파장 |
|---|---|---|
| AM 라디오 | 약 $$10^6$$ Hz (1 MHz) | 300 m |
| FM 라디오 | 약 $$10^8$$ Hz (100 MHz) | 3 m |
| 와이파이 (2.4 GHz) | $$2.4 \times 10^9$$ Hz | 12.5 cm |
| 광케이블 | $$10^{14} \sim 10^{15}$$ Hz | 약 1 μm 안팎 |

라디오 비유에서 목소리가 데이터, 전파가 신호다. 라디오와 달리 데이터 통신의 모뎀은 보내기와 받기를 모두 한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 파장, 카드 C3 — [31_signal-and-modulation_verify.py](/Hongs_Blog/studies/computer-communication/code/31_signal-and-modulation_verify/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

데이터를 링크, 즉 물리적 매체를 통해 전달하려면 신호로 바꿔야 한다[^2].
- **변조**(인코딩): 데이터 → 신호
- **복조**: 신호 → 데이터. 받는 쪽이 하는 반대 작업이다.
- **모뎀**: 변조(**mo**dulation)와 복조(**dem**odulation)를 하는 장치. 이름도 두 영어 낱말의 앞부분을 붙인 것이다.

</div>


신호의 종류는 전자기파 스펙트럼으로 나타낸다[^2][^3]. 신호의 모양으로는 매끄럽게 변하는 아날로그 신호와 두 값 사이를 오가는 디지털 신호가 있다[^2].

| 주파수 대역 (Hz) | 이름 | 쓰는 매체와 용도 |
|---|---|---|
| $$10^4 \sim 10^8$$ | 라디오파 (Radio) | 동축 케이블, AM, FM, TV |
| $$10^8 \sim 10^{11}$$ | 마이크로파 (Microwave) | TV, 위성, 지상 마이크로파 |
| $$10^{11} \sim 10^{15}$$ | 적외선 (Infrared) | 광케이블($$10^{14} \sim 10^{15}$$ 부근) |
| $$10^{15}$$ 이상 | 자외선, X선, 감마선 | 통신에 쓰지 않음 |

대역의 경계는 대략값이다[^3].

주파수에 따른 맞바꿈이 있다[^3].
- 저주파일수록 전송 특성이 좋다. 장애물을 잘 통과한다.
- 저주파는 고속의 데이터 전송에 한계가 있다. 통신 속도(대역폭)와 비트 폭의 관계 때문이고, 뒤에서 다시 다룬다.
- 그래서 통신은 저주파에서 고주파로 발전한다.

## 연결

- 선수: [데이터 링크 계층](/Hongs_Blog/studies/computer-communication/data-link-layer/)(비트 교환), [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)(비트 폭)
- 신호를 싣는 매체: [유선 링크](/Hongs_Blog/studies/computer-communication/wired-links/), [무선 링크](/Hongs_Blog/studies/computer-communication/wireless-links/)
- 신호를 서로 다른 주파수로 옮겨 나눠 쓰기: [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)
- 다른 과목: 진폭·주파수·파장은 대학수학의 [사인파](/Hongs_Blog/studies/college-math/sinusoid/), 휴먼 인터페이스 미디어의 [파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/)과 같은 양이다. 휴먼 인터페이스 미디어에서 눈이 읽는 가시광은 이 스펙트럼의 적외선과 자외선 사이 좁은 구간이다[^s1].

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 변조, 복조, 모뎀을 각각 정의하라. 노드에 모뎀이 들어 있어야 하는 이유는?</summary>


**답:** 변조: 데이터를 신호로 바꾼다. 복조: 신호를 데이터로 되돌린다. 모뎀: 둘을 하는 장치(modulation + demodulation). 링크는 물리적 매체라 신호만 실어 나르므로, 노드가 데이터를 보내고 받으려면 신호로 바꾸고 되돌려야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 저주파와 고주파의 장단점을 쓰고, 통신이 저주파에서 고주파로 발전하는 이유를 쓰라.</summary>


**답:** 저주파는 장애물을 잘 통과해 전송 특성이 좋지만, 고속 데이터 전송에 한계가 있다. 고주파는 빠르게 보낼 수 있지만 장애물에 약하다. 더 빠른 통신이 필요해지면서 고주파 쪽으로 옮겨 간다.<br>
**흔한 오답:** "고주파가 모든 면에서 낫다". 고주파는 멀리, 벽 너머로 가기 어렵다. 그래서 5G처럼 고주파를 쓰면 셀이 작아진다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 와이파이의 5 GHz 신호와 FM 라디오의 100 MHz 신호의 파장을 구하라(신호 속도 $$3.0 \times 10^8$$ m/s).</summary>


**답:** 5 GHz: $$3 \times 10^8 / (5 \times 10^9) = 0.06$$ m $$= 6$$ cm. 100 MHz: $$3 \times 10^8 / 10^8 = 3$$ m. 주파수가 50배이므로 파장은 50분의 1이다[^s1].

</details>

[^1]: 4-1학기/컴퓨터 통신/2.필기노트/04.4주차.md, 7~10행
[^2]: 4-1학기/pasted_images/Pasted image 20260926022823.png — 슬라이드 "모듈레이션: 데이터의 신호화". 원문의 빨간 글씨: Mo, Dem
[^3]: 4-1학기/pasted_images/Pasted image 20260926023315.png — 슬라이드 "전자기 스펙트럼과 용도/매체 특성"
[^s1]: 에이전트 보충. 주파수 × 파장 = 신호 속도의 관계, 표의 파장 값, 와이파이 주파수, 카드 C3, 가시광의 위치는 원본에 없다. 관계식은 파동의 기본 성질이고, 휴먼 인터페이스 미디어의 파동과 빛 문서에도 같은 식 $$c = f\lambda$$가 있다. 와이파이의 2.4 GHz와 5 GHz 대역은 IEEE 802.11 표준의 대역이다.
{% endraw %}
