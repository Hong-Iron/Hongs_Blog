---
layout: "note"
title: "오류 검출 방식 비교"
display_title: "오류 검출 방식 비교 (Error Detection Methods Compared)"
kind: "concept"
kind_label: "비교"
num: "51"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Error Detection Methods Compared", "패리티 대 체크섬 대 CRC"]
description: "패리티, 체크섬, CRC는 모두 데이터로 계산한 값을 덧붙여 오류를 찾는다. 셋을 가르는 것은 계산에 무엇을 쓰느냐(1의 개수 세기, 더하기, XOR 나누기)와, 그에 따라 어떤 오류를 놓치느냐다. 계산이 단순할수록 놓치는 오류가 많고, CRC는 계산이 복잡하지만 하드웨어로 하면 …"
prev_url: "/studies/computer-communication/crc/"
prev_title: "CRC"
next_url: "/studies/computer-communication/error-recovery-fec/"
next_title: "오류 복구와 FEC"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/error-detection-compared/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

패리티, 체크섬, CRC는 모두 데이터로 계산한 값을 덧붙여 오류를 찾는다. 셋을 가르는 것은 계산에 무엇을 쓰느냐(1의 개수 세기, 더하기, XOR 나누기)와, 그에 따라 어떤 오류를 놓치느냐다. 계산이 단순할수록 놓치는 오류가 많고, CRC는 계산이 복잡하지만 하드웨어로 하면 오히려 비용이 거의 없다.

</div>


## 어느 쪽일까

<details markdown="1"><summary markdown="span">1. 이더넷 어댑터가 매 프레임을 전송하며 동시에 오류를 검사해야 한다.</summary>


**CRC.** 시프트 레지스터와 XOR로 전송과 동시에 계산되고 검출율이 가장 높다. 체크섬은 소프트웨어에 알맞고, 패리티는 놓치는 오류가 너무 많다.

</details>

<details markdown="1"><summary markdown="span">2. 라우터마다 소프트웨어로 IP 헤더를 빨리 다시 검사하고, 바뀐 칸(TTL)만큼만 고쳐 다시 계산하고 싶다.</summary>


**인터넷 체크섬.** 덧셈뿐이라 CPU에서 빠르고, 한 칸이 바뀌면 그 차이만 더하고 빼서 고칠 수 있다. CRC는 소프트웨어로 다시 계산하기 더 무겁다.

</details>

<details markdown="1"><summary markdown="span">3. 재전송이 어려워 받는 쪽이 1비트 오류를 스스로 고쳐야 한다.</summary>


**2차원 패리티.** 1비트 오류의 위치를 알아 고칠 수 있다. 체크섬과 CRC는 오류가 있다는 것만 알려 준다.

</details>

## 결정적 차이

무작위 데이터 32바이트에 2비트 또는 4비트 오류를 4,000번씩(모두 8,000번) 넣어 보았다[^s1].

| | 패리티(1비트) | 2차원 패리티 | 인터넷 체크섬 | CRC-16 |
|---|---|---|---|---|
| 계산 | 1의 개수 세기 | 줄·칸마다 세기 | 16비트 1의 보수 덧셈 | XOR 다항식 나눗셈 |
| 덧붙는 크기 | 1비트 | 줄 수 + 칸 수 + 1비트 | 16비트 | 16비트 |
| 놓친 오류(8,000번 중) | 8,000 (짝수 개는 늘 놓침) | 0 | 132 | 0 |
| 늘 잡는 오류 | 홀수 개 비트 | 1~3비트 | 1비트 | 1비트, 16비트 이내 버스트 |
| 놓치는 대표 오류 | 2비트 | 직사각형 4비트 | 워드 순서 바뀜, 같은 자리 상쇄 | $$C(x)$$의 배수인 오류 |
| 잘 맞는 곳 | 아주 짧은 데이터 | 오류를 고쳐야 할 때 | IP·TCP(소프트웨어) | 링크 계층(하드웨어) |

CRC의 검출율이 매우 높고 하드웨어로 만들 수 있다는 점은 슬라이드 p.53, p.57의 결론이다[^1][^2]. 필기도 체크섬은 IP/TCP에서, CRC는 NIC 안의 XOR 연산으로 쓴다고 정리했다[^3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 놓친 횟수, CRC-16의 16비트 이내 버스트 3,000개 모두 검출, 체크섬이 놓치는 상쇄 예 — [51_error-detection-compared_verify.py](/Hongs_Blog/studies/computer-communication/code/51_error-detection-compared_verify/)</div>

</div>


## 둘 다 아닐 때

- **오류를 고쳐야 하는데 1비트보다 많이:** 해밍 부호, 리드-솔로몬 부호처럼 더 강한 오류 수정 코드를 쓴다(CD, QR 코드, 위성 통신)[^s1]. 오류 복구 일반은 [오류 복구와 FEC](/Hongs_Blog/studies/computer-communication/error-recovery-fec/).
- **누군가 일부러 바꾸는 것까지 막아야 할 때:** CRC와 체크섬은 우연한 오류용이라 일부러 맞춰 바꿀 수 있다. 암호학적 해시(SHA-256)나 메시지 인증 코드를 쓴다[^s1].

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 체크섬과 CRC는 둘 다 16비트를 덧붙인다. 같은 크기인데 CRC가 오류를 더 잘 잡는 이유는?</summary>


**답:** 체크섬은 더하기라 순서가 바뀌거나 같은 자리의 변화가 서로 상쇄되면 합이 같다. CRC는 자리마다 다른 무게(다항식의 차수)로 나누어, 같은 자리의 오류도 위치에 따라 나머지가 달라진다. 실험에서 체크섬은 8,000번 중 132번, CRC-16은 0번 놓쳤다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 패리티 비트 하나가 짝수 개 비트 오류를 하나도 잡지 못하는 이유는?</summary>


**답:** 패리티는 1의 개수가 짝수인지만 본다. 비트 두 개가 바뀌면 1의 개수가 2만큼 늘거나, 줄거나, 그대로라 짝홀이 변하지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 왜 2계층은 CRC, 3·4계층은 체크섬을 주로 쓰나?</summary>


**답:** 2계층은 어댑터 하드웨어가 전송과 동시에 계산할 수 있어 강한 CRC를 거의 공짜로 쓴다. 3·4계층은 호스트와 라우터의 소프트웨어가 계산하므로 덧셈만 하는 체크섬이 빠르다. 2계층이 이미 강하게 검사했으니 위 계층은 가벼운 검사로 중복 확인만 한다.

</details>

[^1]: 4-1학기/컴퓨터 통신/1.수업자료/04.2장-1.pptx, 슬라이드 53 "CRC의 성능"
[^2]: 같은 자료, 슬라이드 57 "CRC에 대해 간단히 설명하시오"
[^3]: 4-1학기/컴퓨터 통신/2.필기노트/06.6주차.md, 89행, 106행
[^s1]: 에이전트 보충. 세 상황 문제, 놓친 횟수 실험, 표의 "늘 잡는 오류"와 "놓치는 대표 오류", 해밍·리드-솔로몬과 암호학적 해시, 카드는 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
