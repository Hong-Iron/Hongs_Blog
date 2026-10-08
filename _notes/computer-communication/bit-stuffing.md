---
layout: "note"
title: "비트 채우기"
display_title: "비트 채우기 (Bit Stuffing)"
kind: "concept"
kind_label: "알고리즘"
num: "45"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Bit Stuffing", "비트 삽입", "Bit-Oriented Protocol", "비트 중심 프로토콜", "HDLC", "High-Level Data Link Control", "SDLC", "깃발", "Flag", "01111110"]
description: "바이트가 아니라 비트 단위로 프레임의 처음과 끝을 표시한다. HDLC는 정해 둔 비트 모양 01111110(깃발)을 프레임 앞뒤에 붙인다. 본문에 같은 모양이 나오지 않도록, 보내는 쪽은 1이 다섯 개 이어지면 무조건 0을 하나 끼워 넣고, 받는 쪽은 그 0을 지운다. 데이터가 어…"
prev_url: "/studies/computer-communication/byte-framing/"
prev_title: "바이트 중심 프레이밍"
next_url: "/studies/computer-communication/framing-compared/"
next_title: "프레이밍 방식 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/bit-stuffing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

바이트가 아니라 비트 단위로 프레임의 처음과 끝을 표시한다. HDLC는 정해 둔 비트 모양 `01111110`(깃발)을 프레임 앞뒤에 붙인다. 본문에 같은 모양이 나오지 않도록, 보내는 쪽은 1이 다섯 개 이어지면 무조건 0을 하나 끼워 넣고, 받는 쪽은 그 0을 지운다. 데이터가 어떤 비트열이든 깃발로 오해되지 않는다. 대신 1이 많은 데이터일수록 보내는 비트가 늘어난다.

</div>


## 예시로 보기

[바이트 중심 방법](/Hongs_Blog/studies/computer-communication/byte-framing/)은 데이터를 글자(바이트)로 본다. 데이터가 바이트로 나뉘지 않는 임의의 비트열이면 쓸 수 없다. HDLC는 "데이터는 임의의 비트"라는 관점에서 시작했다[^1][^2].

본문 `0111111111110`(1이 11개 이어짐)을 보낸다[^s1].

| 단계 | 비트 |
|---|---|
| 본문 | `0 11111 11111 10` |
| 1이 5개 이어질 때마다 0 삽입 | `0 11111 0 11111 0 10` |
| 프레임 | `01111110` `011111011111010` `01111110` |

채운 본문 안에는 1이 여섯 개 이어지는 곳이 없으므로 깃발 모양이 생길 수 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시, 무작위 본문 2,000개에서 깃발이 생기지 않고 정확히 되돌림, 1이 7개면 오류, 최악의 오버헤드, 카드 C2 — [45_bit-stuffing_impl.py](/Hongs_Blog/studies/computer-communication/code/45_bit-stuffing_impl/)</div>

</div>


## 정의

```
| 01111110 | Header | Body | CRC | 01111110 |
     8        16             16       8      (비트)
```

**입력:** 본문 비트열. **출력:** 깃발 사이에 넣을 비트열.

- **보내는 쪽:** 본문 중간에 1이 연속 5개 나오면 0을 하나 끼운다[^1].
- **받는 쪽:** 1을 연속 5개 받으면 다음 비트를 본다[^1].
  - 다음이 `0`이면 끼워 넣은 비트라 지운다.
  - 다음이 `10`이면 깃발 `01111110`이라 프레임의 끝이다.
  - 다음이 `11`이면(1이 7개 이상) 오류다.

필기도 같은 규칙을 적었다[^3].

## 활용

- HDLC와 그 계열(SDLC, PPP의 일부 모드)이 쓴다[^1].
- 복잡도: 비트마다 한 번 보므로 $$O(n)$$이고, 카운터 하나로 하드웨어에서 바로 한다.
- 오버헤드: 1만 $$n$$개면 $$\frac n5$$비트가 늘어 최대 20%다. 무작위 데이터에서는 1이 다섯 번 이어질 확률이 낮아 평균은 훨씬 작다[^s1].
- 흔한 실수: 끼운 0 다음에 다시 1을 세기 시작해야 한다는 것을 잊는 것. 끼운 0이 연속을 끊으므로 카운터를 0으로 되돌린다.

## 연결

- 선수: [바이트 중심 프레이밍](/Hongs_Blog/studies/computer-communication/byte-framing/)(같은 문제를 바이트로 푼 방법)
- 비교: [프레이밍 방식 비교](/Hongs_Blog/studies/computer-communication/framing-compared/)
- 비슷한 발상(같은 값이 길게 이어지지 않게 바꾸기): [4B/5B](/Hongs_Blog/studies/computer-communication/4b5b/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> HDLC의 깃발과 보내는 쪽·받는 쪽의 비트 채우기 규칙을 쓰라.</summary>


**답:** 깃발 `01111110`. 보내는 쪽은 1이 연속 5개 나오면 0을 끼운다. 받는 쪽은 1을 5개 받으면 다음 비트가 0이면 지우고, 10이면 프레임 끝, 11이면 오류로 본다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 본문이 깃발과 같은 `01111110`이다. 채운 뒤의 비트열은?</summary>


**답:** `011111010`. 1이 다섯 개 나온 뒤 0을 끼우고, 남은 `10`을 이어 쓴다. 1이 여섯 개 이어지지 않으므로 깃발로 오해되지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> "1이 5개 이어지면 0 하나를 끼운다"는 규칙이 하는 일을 한 문장으로 쓰라.</summary>


**답:** 본문 안에 1이 여섯 개 이어지는 일이 없게 만들어, 1이 여섯 개 들어 있는 깃발 `01111110`이 본문에서는 절대 나오지 않게 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 받는 쪽이 1을 다섯 개 받은 뒤 다음 비트가 0이면 그 0을 지워도 안전한 이유는?</summary>


**답:** 보내는 쪽은 1 다섯 개 바로 뒤에 무조건 0을 끼우므로, 채운 비트열에서 1 다섯 개 바로 다음 자리는 언제나 끼운 0이다. 원래 데이터의 다음 비트(0이든 1이든)는 그 끼운 0 뒤에 온다. 그래서 그 자리를 지우면 정확히 원래 데이터가 남는다.

</details>

[^1]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 45 "비트 중심 프로토콜" (4-1학기/pasted_images/Pasted image 20261008204254.png)
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 51행
[^3]: 같은 필기, 52~58행
[^s1]: 에이전트 보충. 예시 비트열과 표, 오버헤드와 평균, 흔한 실수, 카드 C2·C3은 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
