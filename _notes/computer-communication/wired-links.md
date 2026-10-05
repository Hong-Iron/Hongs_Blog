---
layout: "note"
title: "유선 링크"
display_title: "유선 링크 (Wired Links)"
kind: "concept"
kind_label: "모델"
num: "32"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Wired Links", "유선 링크의 종류", "트위스티드 페어", "twisted pair", "UTP", "Cat 5", "동축 케이블", "coax", "coaxial cable", "광케이블", "optical fiber", "멀티모드", "multimode", "싱글모드", "single-mode", "굴절률", "index of refraction", "코어", "core", "클래딩", "cladding", "전반사", "전용선", "leased line", "T1", "T3", "STS", "SONET", "ISDN"]
description: "선을 직접 깔 때는 거리와 속도를 보고 구리선이나 광케이블을 고른다. 꼬인 구리선은 싸고 흔하지만 100 m 정도가 한계이고, 광케이블은 빛을 유리 속에 가두어 수십 km를 빠르게 간다. 광케이블도 가운데 심이 굵은 멀티모드는 빛이 여러 길로 퍼져서 짧은 거리용이고, 심이 가는 싱…"
prev_url: "/studies/computer-communication/signal-and-modulation/"
prev_title: "신호와 변조"
next_url: "/studies/computer-communication/last-mile-links/"
next_title: "가입자 선로"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/wired-links/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

선을 직접 깔 때는 거리와 속도를 보고 구리선이나 광케이블을 고른다. 꼬인 구리선은 싸고 흔하지만 100 m 정도가 한계이고, 광케이블은 빛을 유리 속에 가두어 수십 km를 빠르게 간다. 광케이블도 가운데 심이 굵은 멀티모드는 빛이 여러 길로 퍼져서 짧은 거리용이고, 심이 가는 싱글모드가 더 멀리 더 빠르게 간다. 직접 깔 수 없으면 전화 회사에서 정해진 속도의 선을 빌린다.

</div>


## 예시로 보기

선을 직접 깔 때는 거리를 기준으로 매체를 고른다[^1].

| 매체 | 속도 | 최대 거리 |
|---|---|---|
| Category 5 twisted pair (UTP) | 10~100 Mbps | 100 m |
| (Cat 7) | 10 Gbps | 100(?) m |
| 50옴 동축 케이블 (ThinNet) | 10~100 Mbps | 200 m |
| 75옴 동축 케이블 (ThickNet) | 10~100 Mbps | 500 m |
| 멀티모드 광케이블 | 100 Mbps | 2 km |
| 싱글모드 광케이블 | 100~2,400 Mbps | 40 km |

같은 건물의 PC와 스위치(수십 m)는 UTP로 충분하다. 1.5 km 떨어진 두 건물은 멀티모드 광케이블, 30 km 떨어진 두 지사는 싱글모드 광케이블이 필요하다. UTP는 노드와 노드 사이의 짧은 거리(100 m 안쪽)에 쓴다. 동축 케이블은 구리가 많이 들어 두꺼워서, 요즘은 UTP를 더 많이 쓴다[^2].

## 정의

**광케이블.** 빛을 가두는 가운데 심을 코어(core), 그 둘레를 클래딩(cladding)이라 한다[^3]. 굴절률(index of refraction)은 진공에서의 속도를 매체에서의 속도로 나눈 값이다[^3]. 신호 속도가 $$2.0 \times 10^8$$ m/s인 광케이블의 굴절률은 $$3.0 / 2.0 = 1.5$$다. 코어의 굴절률이 클래딩보다 커서, 경계에 비스듬히 닿은 빛은 빠져나가지 못하고 모두 되돌아온다(전반사). 빛은 이렇게 코어 안에서 튕기며 나아간다[^s1].

| | 멀티모드 (Multimode) | 싱글모드 (Single Mode) |
|---|---|---|
| 코어 | 비교적 굵다[^3] | 비교적 가늘다[^3] |
| 빛의 길 | 여러 각도의 길(모드)로 튕기며 간다 | 거의 곧은 길 하나로 간다 |
| 결과 | 길마다 도착 시간이 달라 신호가 퍼진다. 느리고 짧은 거리용[^2] | 덜 퍼져서 빠르고 멀리 간다[^2] |


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "광케이블 내부에서 난반사를 통한 데이터 전달이다." (4주차 필기 32행)  
문제점: 난반사는 거친 면에 닿은 빛이 여러 방향으로 흩어지는 반사다. 흩어진 빛은 코어 밖으로 새어 나간다. 광케이블은 코어의 굴절률이 클래딩보다 커서, 경계에서 빛이 하나도 새지 않고 되돌아오는 전반사로 빛을 가둔다.  
수정안: "광케이블 내부에서 전반사를 통한 데이터 전달이다."  
근거: 굴절률이 $$n_{\text{core}} > n_{\text{clad}}$$이면 임계각 $$\theta_c = \arcsin(n_{\text{clad}} / n_{\text{core}})$$이 존재하고, 이보다 비스듬히 닿은 빛은 전부 반사된다. 예: $$n_{\text{core}} = 1.50$$, $$n_{\text{clad}} = 1.48$$이면 $$\theta_c \approx 80.6°$$. 검증 코드의 계산.

</div>


**빌리는 선.** 전화 회사로부터 선을 임대할 때는 정해진 속도를 고른다[^1].

| 서비스 | 대역폭 |
|---|---|
| ISDN | 64 Kbps |
| T1 | 1.544 Mbps |
| T3 | 44.736 Mbps |
| STS-1 | 51.840 Mbps |
| STS-3 | 155.520 Mbps (슬라이드: 155.250) |
| STS-12 | 622.080 Mbps |
| STS-24 | 1.244160 Gbps |
| STS-48 | 2.488320 Gbps |

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "STS-3 155.250 Mbps" (슬라이드 "사용 가능한 유선 링크의 종류")  
문제점: STS-$$n$$의 속도는 STS-1의 정확히 $$n$$배다. 표의 STS-12, 24, 48은 모두 $$51.840 \times n$$과 맞는데, STS-3만 $$51.840 \times 3 = 155.520$$과 다르다. 숫자 5와 2의 자리가 바뀐 오기로 보인다.  
수정안: STS-3 155.520 Mbps.  
근거: $$51.84 \times 3 = 155.52$$. 검증 코드가 표의 나머지 네 값을 같은 규칙으로 확인한다[^s2].

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: STS-$$n$$ 규칙, 굴절률 1.5, 임계각 80.6°, UTP 100 m의 전파 지연 0.43 μs — [32_wired-links_verify.py](/Hongs_Blog/studies/computer-communication/code/32_wired-links_verify/)</div>

</div>


## 활용

- 링크 길이가 짧으면 전파 지연도 작다. UTP 100 m는 약 0.43 μs다([소요시간](/Hongs_Blog/studies/computer-communication/latency/)).
- 흔한 실수는 광케이블이 "빛의 속도"라서 구리보다 전파 지연이 훨씬 작다고 보는 것이다. 슬라이드 수치로는 광케이블($$2.0 \times 10^8$$)이 구리 케이블($$2.3 \times 10^8$$)보다 오히려 조금 느리다. 광케이블의 장점은 속도와 거리(대역폭, 적은 손실)다.

## 연결

- 선수: [신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/)
- 집과 인터넷 회사 사이의 선: [가입자 선로](/Hongs_Blog/studies/computer-communication/last-mile-links/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 다음 연결에 슬라이드 표의 매체 중 무엇을 쓰겠는가? (a) 같은 사무실의 PC와 스위치 30 m, 100 Mbps (b) 1.5 km 떨어진 두 건물, 100 Mbps (c) 30 km 떨어진 두 지사, 1 Gbps</summary>


**답:** (a) Category 5 UTP (100 m, 10~100 Mbps). (b) 멀티모드 광케이블 (2 km, 100 Mbps). 동축은 500 m까지다. (c) 싱글모드 광케이블 (40 km, 100~2,400 Mbps). 멀티모드는 2 km까지다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 싱글모드 광케이블이 멀티모드보다 멀리, 빠르게 보낼 수 있는 이유를 코어의 굵기로 설명하라.</summary>


**답:** 코어가 굵으면 빛이 여러 각도의 길로 튕기며 가고, 길마다 길이가 달라 같은 순간에 보낸 빛이 서로 다른 때에 도착한다. 그래서 신호가 퍼지고, 비트 사이가 좁으면(고속이면) 앞뒤 비트가 섞인다. 코어가 가늘면 길이 거의 하나라 덜 퍼진다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> STS-1이 51.840 Mbps일 때 STS-12의 속도를 구하고, 슬라이드 표의 STS-3 값이 맞는지 검산하라.</summary>


**답:** STS-12 $$= 51.840 \times 12 = 622.080$$ Mbps로 표와 같다. STS-3은 $$51.840 \times 3 = 155.520$$ Mbps여야 한다. 표의 155.250은 숫자 자리가 바뀐 오기로 보인다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260926024425.png — 슬라이드 "사용 가능한 유선 링크의 종류" (2장. 데이터 링크 네트워크: 점대점 링크)
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/04.4주차.md, 20~34행
[^3]: 4-1학기/pasted_images/Pasted image 20260926025851.png — 슬라이드 "광케이블: Optical Fiber". "Index of reflection = Speed in Vacuum / Speed in medium"
[^s1]: 에이전트 보충. 굴절률 1.5의 계산, 전반사와 임계각, 모드마다 도착 시간이 다른 현상(모드 분산)은 원본에 없다. 표준적인 광학 내용이고, Peterson & Davie, *Computer Networks: A Systems Approach*, 2.1절의 광케이블 설명과 같다. 슬라이드의 "Index of reflection"은 굴절률(index of refraction)을 가리킨다.
[^s2]: 에이전트 보충. STS-$$n$$이 STS-1의 $$n$$배라는 규칙은 SONET 표준(ANSI T1.105)의 정의다.
{% endraw %}
