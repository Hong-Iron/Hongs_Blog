---
layout: "note"
title: "시분할 다중화"
display_title: "시분할 다중화 (Time-Division Multiplexing, TDM)"
kind: "concept"
kind_label: "모델"
num: "13"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-24"
status: "verified"
aliases: ["Time-Division Multiplexing", "TDM", "동기식 시분할 다중화", "synchronous TDM", "타임 슬롯", "time slot", "칸", "프레임", "frame"]
description: "놀이기구를 정해진 순서대로 한 명씩 돌아가며 타듯, 링크를 쓰는 시간을 짧은 칸으로 잘라 사용자들이 순서대로 돌아가며 쓰게 하는 방법이다. 자기 차례에는 링크 전체를 쓰고, 받는 쪽은 차례만 보고 누구 것인지 안다. 대신 차례가 미리 정해져 있어서, 보낼 것이 없는 사용자의 칸은 …"
prev_url: "/studies/computer-communication/multiplexing/"
prev_title: "다중화"
next_url: "/studies/computer-communication/frequency-division-multiplexing/"
next_title: "주파수 분할 다중화"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/time-division-multiplexing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

놀이기구를 정해진 순서대로 한 명씩 돌아가며 타듯, 링크를 쓰는 시간을 짧은 칸으로 잘라 사용자들이 순서대로 돌아가며 쓰게 하는 방법이다. 자기 차례에는 링크 전체를 쓰고, 받는 쪽은 차례만 보고 누구 것인지 안다. 대신 차례가 미리 정해져 있어서, 보낼 것이 없는 사용자의 칸은 빈 채로 지나간다.

</div>


## 예시로 보기

슬라이드 그림에서 사용자 4명(파랑·초록·노랑·분홍)이 파랑→초록→노랑→분홍 순서로 돌아가며 링크를 쓴다. 칸마다 세로 막대가 주파수 축 전체를 덮는다. 자기 차례에는 링크 전체를 쓴다는 뜻이다[^2]. 같은 사례를 칸 번호로 옮기면 다음과 같다.

| 칸 번호 $$j$$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | … |
|---|---|---|---|---|---|---|---|---|---|
| 주인 | 1 | 2 | 3 | 4 | 1 | 2 | 3 | 4 | … |
| 프레임 | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | … |

색이 입력 번호, 막대의 위치가 칸 번호 $$j$$가 된다. 칸 $$N$$개가 한 바퀴(프레임, frame)를 이룬다. 슬라이드의 동기식 시분할 그림(입력 6개)도 같은 구조다: 1 2 3 4 5 6 1 2 3 4 5 6[^1]. 색이나 막대 폭 같은 그림의 성질은 버린다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

링크 전송률 $$R$$(bps), 입력 $$N \in \mathbb{Z}^+$$개, 칸 길이 $$\tau$$(초). 칸 $$j = 0, 1, 2, \dots$$는 입력 $$(j \bmod N) + 1$$에 배정된다. 이 함수가 DEMUX 키다.
- 입력 하나가 받는 평균 전송률은 $$R/N$$이다. 입력의 실제 트래픽과 무관하다.
- 한 입력의 연속한 두 칸 사이에는 다른 입력의 칸 $$N-1$$개, 즉 시간 $$(N-1)\tau$$가 있다.

</div>


| 보장한다 | 보장하지 않는다 |
|---|---|
| 입력마다 전송률 $$R/N$$이 늘 확보된다. 입력끼리 충돌하지 않는다 | 빈 칸의 재사용. 쉬는 입력의 칸은 비어서 지나간다[^3][^4] |
| 각 입력의 차례가 프레임마다 반드시 한 번 돌아와 지연이 일정하다[^s1] | 입력 수 변경. 칸 수가 미리 정해져 있어 $$N$$개를 넘는 입력은 받을 수 없다[^s1] |

양쪽의 시간이 어긋나면(동기 상실) DEMUX가 모든 칸의 주인을 잘못 읽어 데이터가 엉뚱한 출력으로 간다. 그래서 실제 시스템은 프레임마다 동기를 맞추는 비트를 넣는다[^s1].

## 예제

입력 6개인 시분할 다중화에서 칸 17의 주인과, 입력 3이 쓰는 처음 세 칸은?

1. *키 함수 쓰기:* 주인 $$= (j \bmod 6) + 1$$.
2. *대입:* $$17 \bmod 6 = 5$$이므로 입력 6.
3. *거꾸로 풀기:* 입력 3은 $$j \bmod 6 = 2$$인 칸이다. 2, 8, 14.

- 경계 사례: $$N = 1$$이면 모든 칸이 한 입력의 것이다. 다중화하지 않은 링크와 같다.
- 모든 입력이 늘 보낼 것이 있으면 빈 칸이 없어 낭비가 0이다. 시분할 다중화가 가장 잘 맞는 경우다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드 순서(1~6 반복), 예제의 입력 6과 칸 2·8·14, 카드 C2, T1·E1 전송률 — [13_time-division-multiplexing_verify.py](/Hongs_Blog/studies/computer-communication/code/13_time-division-multiplexing_verify/)</div>

</div>


## 활용

- 칸 단위로 비트를 끊어 넣고 빼야 해서 디지털 장비가 필요하다[^3].
- 디지털 전화망의 T1(칸 24개 × 64 kbps에 프레이밍 비트를 더해 1.544 Mbps)과 E1(칸 32개, 2.048 Mbps), GSM 휴대전화(주파수 하나를 시간 칸 8개로 나눔)가 이 방식이다[^s1].
- 회선 하나가 칸 하나를 차지하는 식으로 [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/)을 구현한다[^s1].

## 연결

- 선수: [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/), [전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/)
- 나란히 볼 개념: [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/). 시분할은 채널 사이 보호 대역이 필요 없어 주파수 분할보다 링크를 촘촘히 나눌 수 있다. 하지만 둘 다 고정 할당이라 쉬는 입력의 몫이 낭비되는 점은 같다[^s2].
- 이어지는 개념: 칸을 고정하지 않는 [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/) → [시분할 다중화와 통계적 다중화 비교](/Hongs_Blog/studies/computer-communication/contrast--tdm--statistical-multiplexing/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"시분할 다중화에서도 칸마다 누구 데이터인지 주소를 붙여 보낸다"</div>

틀렸다. 섞인 데이터를 나누려면 이름표가 필요할 것 같아서 그럴듯하다. 실제로는 칸의 순서가 고정되어 있어서 칸 번호만으로 주인이 정해진다. 시간이 곧 DEMUX 키다[^3]. 주소를 붙이는 것은 칸을 고정하지 않는 통계적 다중화다. 슬라이드의 동기식 시분할 그림에는 칸 번호(1~6)만 있고 주소 칸이 없다[^1].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 동기식 시분할 다중화의 동작을 "칸(슬롯)"과 "프레임"이라는 말을 써서 설명하고, 받는 쪽이 각 칸의 주인을 아는 방법을 쓰라.</summary>


**답:** 시간을 같은 길이의 칸으로 나누고, 입력 $$N$$개가 정해진 순서로 한 칸씩 링크 전체를 쓴다. 칸 $$N$$개가 한 프레임이다. 받는 쪽은 칸의 위치(몇 번째 칸인가)로 주인을 안다. 그래서 양쪽 시간이 맞아야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 입력 5개인 시분할 다중화에서 칸 번호를 0부터 센다. 칸 23의 주인은? 입력 2가 쓰는 처음 세 칸의 번호는?</summary>


**답:** $$23 \bmod 5 = 3$$이므로 입력 4. 입력 2는 $$j \bmod 5 = 1$$인 칸이다. 1, 6, 11.  
**흔한 오답:** 입력 3(나머지 3을 그대로 입력 번호로 씀). 칸 번호를 0부터 세면 주인은 나머지 + 1이다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 시분할 다중화가 버스티한 컴퓨터 통신에서 비효율적인 이유를 쓰라.</summary>


**답:** 칸이 미리 고정 배정되어 있다. 버스티한 사용자는 대부분의 시간에 보낼 것이 없어서, 그 사용자의 칸은 비어 지나가고 다른 사용자도 쓸 수 없다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260924204450.png — 슬라이드 "시분할 다중화 (Time Division Multiplexing)", 동기식 시분할 다중화
[^2]: 4-1학기/pasted_images/Pasted image 20260924204751.png — TDM 그림 (4 users, frequency–time)
[^3]: 4-1학기/컴퓨터 통신/2.필기노트/01.1주차.md, 62~64행, 72행
[^4]: 4-1학기/pasted_images/Pasted image 20260924204837.png — 슬라이드 "통계적 다중화"의 Synchronous TDM 그림 (Wasted Bandwidth)
[^s1]: 에이전트 보충. 지연이 일정하다는 보장, 입력 수 제한, 동기 상실, T1·E1·GSM 사례, 회선 스위칭 구현은 원본에 없다. Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절과 Kurose & Ross, *Computer Networking: A Top-Down Approach*, 1.3절의 내용이다.
[^s2]: 에이전트 보충. 필기 63행은 "FDM보다는 효율적으로 나눌 수 있다"고 쓴다. 보호 대역 기준으로는 맞고, 쉬는 입력의 낭비 기준으로는 둘이 같다.
{% endraw %}
