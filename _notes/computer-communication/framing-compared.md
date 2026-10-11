---
layout: "note"
title: "프레이밍 방식 비교"
display_title: "프레이밍 방식 비교 (Framing Methods Compared)"
kind: "concept"
kind_label: "비교"
num: "46"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Framing Methods Compared", "보초 대 바이트 수 대 비트 채우기"]
description: "프레임의 끝을 알리는 방법은 세 가지다. 끝에 정해 둔 글자를 두는 보초 방법, 앞에 길이를 적는 바이트 수 방법, 비트 모양 깃발을 쓰는 비트 채우기다. 셋의 차이는 \"데이터를 무엇으로 보느냐\"(글자인가, 임의의 비트인가)와 \"끝 표시가 깨졌을 때 무슨 일이 생기느냐\"다."
prev_url: "/studies/computer-communication/bit-stuffing/"
prev_title: "비트 채우기"
next_url: "/studies/computer-communication/error-detecting-code/"
next_title: "오류 검출 코드"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/framing-compared/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프레임의 끝을 알리는 방법은 세 가지다. 끝에 정해 둔 글자를 두는 보초 방법, 앞에 길이를 적는 바이트 수 방법, 비트 모양 깃발을 쓰는 비트 채우기다. 셋의 차이는 "데이터를 무엇으로 보느냐"(글자인가, 임의의 비트인가)와 "끝 표시가 깨졌을 때 무슨 일이 생기느냐"다.

</div>


## 어느 쪽일까

<details markdown="1"><summary markdown="span">1. 보낼 데이터가 바이트로 딱 나뉘지 않는 임의의 비트열이다.</summary>


**비트 채우기(HDLC).** 깃발과 채우기가 비트 단위라 데이터 길이가 8의 배수일 필요가 없다. 보초 방법과 바이트 수 방법은 바이트(글자) 단위다.

</details>

<details markdown="1"><summary markdown="span">2. 받는 쪽이 본문을 다 받기 전에 프레임 길이를 알아 버퍼를 미리 잡고 싶다.</summary>


**바이트 수 방법(DDCMP).** 헤더의 Count로 길이를 먼저 안다. 보초 방법과 비트 채우기는 끝 표시를 만날 때까지 길이를 모른다.

</details>

<details markdown="1"><summary markdown="span">3. 본문이 거의 모두 ETX·DLE 글자로 된 이상한 데이터다. 오버헤드가 가장 걱정이다.</summary>


**바이트 수 방법.** 보초 방법은 그런 글자마다 DLE를 붙여 본문이 두 배까지 는다. 바이트 수 방법은 데이터와 상관없이 Count 칸 하나만 더한다.

</details>

## 결정적 차이

| | 보초 방법 (BISYNC) | 바이트 수 방법 (DDCMP) | 비트 채우기 (HDLC) |
|---|---|---|---|
| 데이터를 보는 단위 | 글자(바이트) | 글자(바이트) | 비트 |
| 끝을 아는 방법 | ETX 글자 | 앞의 Count | 깃발 `01111110` |
| 본문과 끝 표시가 겹치는 문제 | DLE를 붙여 피함 | 없음 | 1 다섯 개 뒤 0을 끼워 피함 |
| 최악의 오버헤드 | 본문 2배 | Count 칸 하나 | 본문의 20% |
| 끝 표시가 깨지면 | 다음 ETX까지 이어 읽음 | 엉뚱한 곳에서 자름(CRC로 검출) | 다음 깃발까지 이어 읽음 |

표의 앞 세 줄은 슬라이드 p.44~45에서, 오버헤드와 깨질 때의 행동은 검증 코드에서 나왔다[^1][^2][^s1].

## 둘 다 아닐 때

- **물리 신호로 표시:** 4B/5B처럼 데이터에 쓰지 않는 부호가 남으면, 그 부호로 프레임의 처음과 끝을 표시할 수 있다. 데이터와 겹칠 일이 없다[^s1].
- **두 방법을 함께:** 길이를 적으면서 깃발도 두면, 길이가 깨져도 다음 깃발에서 다시 동기를 맞춘다.

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 보초 방법과 바이트 수 방법 중, Count나 ETX가 전송 중 깨졌을 때 다음 프레임까지 잃을 위험이 큰 쪽은? 다른 쪽은 왜 덜한가?</summary>


**답:** 바이트 수 방법. Count가 깨지면 엉뚱한 곳에서 잘라 다음 프레임의 시작도 잃는다. 보초 방법은 ETX가 깨져도 다음 ETX에서 다시 끝을 찾고, 그 다음 프레임의 SYN·SOH로 새로 시작한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 보초 방법과 비트 채우기가 모두 "채우기"를 하는 이유를 하나의 문장으로 설명하라.</summary>


**답:** 둘 다 끝 표시를 데이터 안에서 찾기 때문에, 데이터가 우연히 끝 표시와 같은 모양일 때를 막으려고 데이터 쪽을 살짝 바꿔(DLE 붙이기, 0 끼우기) 그 모양이 생기지 않게 한다.

</details>

[^1]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 44
[^2]: 같은 자료, 슬라이드 45
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 세 상황 문제, 오버헤드와 깨질 때의 행동 비교, "둘 다 아닐 때"는 원본에 없다. 44·45 구현 코드로 확인했다. 쓰지 않는 부호로 프레임을 표시하는 방법은 Peterson & Davie 2.3절(FDDI의 4B/5B 제어 부호)에 있다.
{% endraw %}
