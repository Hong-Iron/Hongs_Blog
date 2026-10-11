---
layout: "note"
title: "오류 복구와 FEC"
display_title: "오류 복구와 FEC (Error Recovery and FEC)"
kind: "concept"
kind_label: "정의"
num: "52"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Error Recovery", "오류 복구", "Forward Error Correction", "FEC", "순방향 오류 수정", "오류 수정 코드", "Error Correcting Code", "ECC", "역방향 수정", "Backward Error Correction", "프레이밍 오류", "Framing Error", "프레임 분실", "Frame Loss"]
description: "오류를 찾은 뒤 망가진 프레임을 되살리는 방법은 둘이다. 받는 쪽이 덧붙은 정보로 스스로 고치는 방법(순방향 오류 수정, FEC)과, 보낸 쪽에 다시 보내 달라고 하는 방법(재전송, ARQ)이다. FEC는 기다리지 않아 실시간 통신에 맞지만, 검출보다 덧붙일 정보가 많고 모든 오류…"
prev_url: "/studies/computer-communication/error-detection-compared/"
prev_title: "오류 검출 방식 비교"
next_url: "/studies/computer-communication/arq-sequence-number/"
next_title: "ARQ와 순서 번호"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/error-recovery-fec/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

오류를 찾은 뒤 망가진 프레임을 되살리는 방법은 둘이다. 받는 쪽이 덧붙은 정보로 스스로 고치는 방법(순방향 오류 수정, FEC)과, 보낸 쪽에 다시 보내 달라고 하는 방법(재전송, ARQ)이다. FEC는 기다리지 않아 실시간 통신에 맞지만, 검출보다 덧붙일 정보가 많고 모든 오류를 고치지는 못한다. 재전송은 정확하지만 시간이 걸리고, 타임아웃과 재전송용 버퍼가 필요해 어댑터 혼자 하기 어렵다.

</div>


## 예시로 보기

전화 통화에서 0.5초 전의 소리가 깨졌다고 다시 보내 달라고 하면, 다시 온 소리는 이미 때를 놓쳐 쓸모가 없다. 이런 실시간 통신에서는 받는 쪽이 스스로 고쳐야 한다[^1].

[2차원 패리티](/Hongs_Blog/studies/computer-communication/two-dimensional-parity/)가 가장 단순한 예다. 비트 하나가 뒤집히면 틀린 줄과 칸의 교차점을 다시 뒤집어 고친다. 재전송 없이 앞으로(받는 쪽에서) 고치므로 "순방향" 수정이다[^1][^2].

## 정의

오류에 의해 변질된 프레임을 되살리는 방법은 둘로 나뉜다[^3].

- **오류 수정 코드(ECC)를 쓰는 순방향 수정(FEC):** 받는 쪽이 덧붙은 정보로 직접 고친다. 재전송이 쉽지 않은 경우(전화 같은 실시간 통신)에 쓸모 있다[^1].
- **자동 반복 요청(ARQ), 곧 재전송:** ACK와 타임아웃으로 망가진 프레임을 다시 받는다. 역방향 수정이라고도 한다[^3]. 자세한 동작은 [ARQ와 순서 번호](/Hongs_Blog/studies/computer-communication/arq-sequence-number/).

필기는 ECC의 한계를 둘로 적었다. 완벽하게 수정할 수 없고, 검출 코드보다 더 많은 정보가 필요해 오버헤드가 크다[^4].

**프레이밍 오류.** 오류 중에는 프레임의 처음이나 끝 표시가 깨져 프레임으로 알아볼 수조차 없는 프레이밍 오류도 있다. 이때 받는 쪽은 프레임이 왔다는 것조차 모른다. 곧 프레임 분실이다[^3]. 받는 쪽이 아무 말도 할 수 없으므로, 결국 보낸 쪽이 타임아웃으로 알아채야 한다[^s1].

**재전송을 어디서 하나.** 재전송에는 타임아웃 시계와 다시 보낼 프레임을 담아 둘 버퍼가 필요하다. 어댑터 혼자 하기에는 한계가 있어, 2계층 기능이지만 노드 안의 소프트웨어가 맡는다[^5].

## 활용

- FEC: 휴대전화 음성, 위성·심우주 통신(왕복 시간이 길어 재전송이 늦음), QR 코드와 CD(리드-솔로몬 부호)[^s1].
- ARQ: 파일 전송처럼 늦어도 정확해야 하는 데이터. TCP의 재전송도 같은 생각이다.
- 흔한 실수: FEC를 쓰면 재전송이 필요 없다고 믿는 것. 고칠 수 있는 오류의 수에는 한계가 있어, 넘치면 다시 받아야 한다. 실제 시스템은 둘을 섞어 쓰기도 한다.

## 연결

- 선수: [2차원 패리티](/Hongs_Blog/studies/computer-communication/two-dimensional-parity/)(가장 단순한 ECC)
- 재전송 방식: [ARQ와 순서 번호](/Hongs_Blog/studies/computer-communication/arq-sequence-number/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 오류 복구의 두 방법을 쓰고, 각각 어떤 경우에 알맞은지 말하라.</summary>


**답:** 순방향 수정(FEC, 오류 수정 코드로 받는 쪽이 고침)은 재전송이 어렵거나 늦은 데이터가 쓸모없는 실시간 통신에. 재전송(ARQ, ACK와 타임아웃)은 시간이 걸려도 정확해야 하는 데이터에.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 프레이밍 오류가 나면 받는 쪽이 NAK도 보낼 수 없는 이유는?</summary>


**답:** 프레임의 처음과 끝을 알아보지 못해 프레임이 왔다는 사실 자체를 모른다. 모르는 프레임에 대해 응답할 수 없으므로, 보낸 쪽이 ACK가 오지 않는 것을 타임아웃으로 알아채야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 지구와 화성 사이(편도 수 분) 탐사선 통신에는 FEC와 ARQ 중 무엇을 주로 쓰나? 다른 쪽은 왜 덜 맞는가?</summary>


**답:** FEC. 재전송을 요청하고 다시 받는 데 왕복 시간(십여 분 이상)이 걸려 너무 늦다. 덧붙일 정보가 늘더라도 받는 쪽에서 바로 고치는 편이 낫다.

</details>

[^1]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 60 "오류 수정 코드" (수업 슬라이드 캡처)
[^2]: 컴퓨터 통신 6회 필기 「6주차」, 136~141행
[^3]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 59 "개요" (수업 슬라이드 캡처)
[^4]: 컴퓨터 통신 6회 필기 「6주차」, 126~128행
[^5]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 61 "재전송을 통한 오류 복구"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 전화 비유, 프레이밍 오류를 보낸 쪽이 타임아웃으로 알아채는 이유, FEC의 쓰임(위성·QR·CD), 흔한 실수, 카드는 원본에 없다.
{% endraw %}
