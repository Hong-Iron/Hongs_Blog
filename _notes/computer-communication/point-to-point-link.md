---
layout: "note"
title: "점대점 링크"
display_title: "점대점 링크 (Point-to-Point Link)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Point-to-Point Link", "점대점 연결", "point-to-point", "완전 연결", "full mesh", "직접 링크", "direct link", "링크의 실체", "전송 모드", "transmission mode", "simplex", "단방향", "반이중", "half-duplex", "전이중", "full-duplex"]
description: "두 기기를 전용선 하나로 바로 잇는 연결이다. 두 사람만 쓰는 직통 전화와 같다. 단순하고 서로 간섭이 없다. 대신 모든 기기를 이렇게 이으면 기기가 늘어날 때 선이 감당할 수 없이 늘어난다."
next_url: "/studies/computer-communication/multiple-access-link/"
next_title: "다중 접근 링크"
math: true
mermaid: true
code_count: 1
permalink: "/studies/computer-communication/point-to-point-link/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 기기를 전용선 하나로 바로 잇는 연결이다. 두 사람만 쓰는 직통 전화와 같다. 단순하고 서로 간섭이 없다. 대신 모든 기기를 이렇게 이으면 기기가 늘어날 때 선이 감당할 수 없이 늘어난다.

</div>


## 예시로 보기

통신망은 두 가지로 이루어진다. 통신하는 기기가 **노드**(node, 단말)이고, 노드를 잇는 케이블이나 채널이 **링크**(link)다[^1]. 점대점 링크는 끝에 노드가 딱 둘뿐인 링크다. 그래서 보낸 데이터는 언제나 반대편 한 곳으로 간다.

방 4개를 인터폰으로 서로 모두 잇는다고 하자. 방 A에는 B·C·D로 가는 선 3개가 필요하다. 방마다 선 끝이 3개이니 모두 12개다. 선 하나에는 끝이 2개이므로 선은 6개다.

```mermaid
graph LR
  A --- B
  A --- C
  A --- D
  B --- C
  B --- D
  C --- D
```

방을 노드로, 인터폰 선을 링크로 추상화한다. 방 모음이 아래 정의의 $$V$$이고 $$n = 4$$다. 선의 수가 $$m = 6$$이다. 선의 길이나 재질은 버리고, 누가 누구와 직접 이어졌는지만 남긴다. 이렇게 모든 쌍을 이은 구성을 **완전 연결**(full mesh)이라 한다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

링크 $$e$$가 **점대점**이라는 것은 $$e$$에 붙은 노드가 정확히 2개라는 뜻이다.<br>
노드 집합 $$V$$($$n = \vert V\vert  \in \mathbb{N}$$)의 서로 다른 모든 쌍을 각각 점대점 링크로 이은 구성을 **완전 연결**이라 한다. 이는 완전 그래프 $$K_n$$이다. 이때
- 링크 수: $$m = \binom{n}{2} = \dfrac{n(n-1)}{2}$$
- 노드 하나에 필요한 포트(인터페이스) 수: $$n - 1$$
- $$n \ge 2$$이면 $$\dfrac{n^2}{4} \le m \le \dfrac{n^2}{2}$$. 즉 링크 수는 $$n^2$$에 비례해 늘어난다[^s1].

</div>


각 노드는 포트가 $$n-1$$개이므로 포트를 모두 세면 $$n(n-1)$$개다. 링크 하나는 양 끝에서 한 번씩, 모두 두 번 세어진다. 그래서 링크 수는 그 절반이다.

<details markdown="1"><summary markdown="span">n²/4 ≤ m ≤ n²/2 유도</summary>


1. $$n \ge 2$$이면 $$n - 1 \ge n/2$$이다. 양변에 $$n/2$$를 곱하면 $$m = n(n-1)/2 \ge n^2/4$$.
2. $$n - 1 < n$$이므로 $$m < n^2/2$$.

</details>

**링크의 실체.** 링크는 데이터(신호)를 전달하는 물리적 매체다. 예를 들어 케이블이나 공기이고, 유선(wired)과 무선(wireless)으로 나뉜다. 한편 링크는 논리적 통로이기도 하다. 케이블 하나에 링크가 여럿 있을 수 있다. 예를 들어 ADSL은 전화선 하나에 전화와 인터넷 링크를 함께 싣는다. 당분간은 링크 하나를 케이블 하나로 본다[^4].

**전송 모드.** 링크 위에서 데이터가 어느 방향으로 흐를 수 있는지에 따라 셋으로 나눈다[^4].

| 모드 | 방향 | 예[^s3] |
|---|---|---|
| 단방향 (Simplex) | 한쪽으로만 | TV 방송 |
| 반이중 (Half-duplex) | 양쪽 모두, 한 번에 한쪽만 | 무전기 (말할 때 버튼을 누름) |
| 전이중 (Full-duplex) | 양쪽 모두, 동시에 | 전화 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$n = 0, \dots, 20$$에서 노드 쌍을 직접 나열해 센 값이 $$n(n-1)/2$$와 일치하고, 노드별 포트 수 $$n-1$$과 $$n^2/4 \le m \le n^2/2$$도 성립한다 (실험으로 확인됨. 일반적 성립은 위의 두 번 세기 논증) — [01_point-to-point-link_verify.py](/Hongs_Blog/studies/computer-communication/code/01_point-to-point-link_verify/)</div>

</div>


## 예제

- 해당하는 예: 슬라이드 그림 (a)의 두 상자를 선 하나로 이은 point-to-point 네트워크[^2], 회선 스위칭으로 확보한 A–D 사이의 회선("기본적으로 point-to-point 연결")[^3], 두 라우터를 직접 잇는 광케이블 한 가닥[^s2]
- 해당하지 않는 예: 슬라이드 그림 (b)의 다중 접근 버스(링크 하나에 노드가 여럿)[^2], 스위치를 거쳐 이어진 두 호스트(사이에 중계 노드가 있음)
- 경계 사례: $$n = 0$$이나 $$n = 1$$이면 링크는 0개다. $$n = 2$$이면 링크 1개가 곧 완전 연결이다.

## 활용

- 링크가 $$n^2$$에 비례해 늘고 노드마다 포트가 $$n-1$$개 필요하다. 그래서 큰 네트워크는 완전 연결로 만들지 않는다[^1]. 대안은 선 하나를 함께 쓰는 [다중 접근 링크](/Hongs_Blog/studies/computer-communication/multiple-access-link/)와 중계 장치를 두는 [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/)다.
- 점대점 연결 네트워크는 가장 간단한 네트워크이고, 일반적인 네트워크를 이루는 기본 블록이다. 그 위에서 할 일(비트 교환, 프레이밍, 오류 검출)은 [데이터 링크 계층](/Hongs_Blog/studies/computer-communication/data-link-layer/)이 맡는다[^5].
- 매체의 종류는 [유선 링크](/Hongs_Blog/studies/computer-communication/wired-links/)와 [무선 링크](/Hongs_Blog/studies/computer-communication/wireless-links/)에 있다.
- 장거리 구간에서 두 장비를 직접 잇는 링크에 쓴다. 점대점 링크 전용 프로토콜로 PPP(RFC 1661)가 있다[^s2].

## 연결

- 이어지는 개념: [다중 접근 링크](/Hongs_Blog/studies/computer-communication/multiple-access-link/), [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/), [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/)
- 이산수학의 완전 그래프 $$K_n$$과 차수 합 공식 $$\sum_{v \in V} \deg(v) = 2\vert E\vert $$가 같은 두 번 세기다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"직접 링크는 곧 점대점 링크다"</div>

틀렸다. 슬라이드 "연결: 직접 링크"에서 점대점 연결이 먼저 나오고, 둘 다 중간 장치 없이 잇는다는 느낌을 줘서 같은 말처럼 보인다. 실제로 "직접"은 사이에 중계 노드가 없다는 뜻이고, "점대점"은 끝점이 둘뿐이라는 뜻이다. 다중 접근도 중계 노드가 없으므로 직접 링크다[^1]. 슬라이드에서 (a) 점대점과 (b) 다중 접근이 모두 "직접 링크" 제목 아래에 있는 것으로 확인할 수 있다[^2].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 통신망을 이루는 두 가지 요소를 쓰고, 점대점 링크를 정의하라.</summary>


**답:** 노드(단말)와 링크(케이블, 채널 등). 점대점 링크는 끝점이 정확히 두 개인 링크로, 두 기기를 중계 장치 없이 곧장 잇는다.<br>
**흔한 오답:** "중계 장치 없이 잇는 링크"만 쓰는 것. 다중 접근 링크에도 맞는 설명이라 둘을 가르지 못한다. "끝점이 둘"이 핵심이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 노드 8개를 모든 쌍끼리 점대점으로 이으려면 링크 몇 개, 노드당 포트 몇 개가 필요한가?</summary>


**답:** 링크 $$8 \cdot 7 / 2 = 28$$개, 노드당 포트 7개.<br>
**이유:** 포트를 모두 세면 $$8 \cdot 7 = 56$$이다. 링크마다 양 끝에서 두 번 세어졌으므로 2로 나눈다.<br>
**흔한 오답:** 56(2로 나누지 않음), 64(증가 속도 $$n^2$$과 정확한 값을 혼동).

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> "직접 링크 = 점대점 링크"가 틀린 이유를 슬라이드의 예로 설명하라.</summary>


**답:** 슬라이드의 다중 접근(multiple access) 버스도 "직접 링크"에 속한다. 사이에 중계 노드가 없기 때문이다. 하지만 끝점이 여럿이라 점대점은 아니다. 직접 링크는 점대점과 다중 접근을 모두 포함한다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> (a) 무전기 (b) 전화 통화 (c) TV 방송의 전송 모드는 각각 무엇인가? 반이중과 전이중을 가르는 기준은?</summary>


**답:** (a) 반이중. (b) 전이중. (c) 단방향(simplex). 반이중은 양쪽 모두 보낼 수 있지만 한 번에 한쪽만 보낸다. 전이중은 양쪽이 동시에 보낸다.<br>
**흔한 오답:** 무전기를 단방향으로 보는 것. 무전기도 양쪽 모두 말할 수 있다. 다만 동시에 말할 수 없다.

</details>

[^1]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 12~24행
[^2]: 4-1학기/pasted_images/Pasted image 20260924184222.png — 슬라이드 "연결: 직접 링크 (Direct Links)"
[^3]: 4-1학기/pasted_images/Pasted image 20260924200141.png — 슬라이드 "간접 연결 방법: 스위칭 정책"
[^4]: 4-1학기/pasted_images/Pasted image 20260926022517.png — 슬라이드 "링크 (Link)" (2장. 데이터 링크 네트워크: 점대점 링크)
[^5]: 4-1학기/pasted_images/Pasted image 20260926021332.png — 슬라이드 "데이터 링크 계층"
[^s1]: 에이전트 보충. 필기 21행은 증가 차수 "$$n^2$$"만 적는다. 정확한 개수 $$n(n-1)/2$$와 부등식의 근거는 두 번 세기 논증과 검증 코드다.
[^s2]: 에이전트 보충. 광케이블 예와 PPP는 원본에 없는 실제 사용처다. PPP는 RFC 1661(1994)에 정의되어 있다.
[^s3]: 에이전트 보충. 전송 모드의 예(TV 방송, 무전기, 전화)는 원본에 없다. 슬라이드는 세 모드의 이름과 화살표 그림만 준다.
{% endraw %}
