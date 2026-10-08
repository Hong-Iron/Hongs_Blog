---
layout: "note"
title: "데이터 링크 계층"
display_title: "데이터 링크 계층 (Data Link Layer)"
kind: "concept"
kind_label: "모델"
num: "29"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Data Link Layer", "데이터 링크", "링크 계층", "link layer", "데이터 링크 네트워크", "프레이밍", "framing", "비트 교환", "오류 검출", "error detection"]
description: "데이터 링크 계층은 선 하나로 이어진 두 노드가 비트 묶음(프레임)을 주고받게 해 주는 층이다. 가장 단순한 네트워크인 점대점 연결에서 할 일이 여기서 모두 나온다. 비트를 신호로 바꿔 보내고, 비트를 묶음으로 끊어 경계를 알리고, 깨진 묶음을 찾아 복구해야 한다. 선 하나만 책임…"
prev_url: "/studies/computer-communication/bandwidth-delay-product/"
prev_title: "대역폭-지연 곱"
next_url: "/studies/computer-communication/node-hardware/"
next_title: "노드"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/data-link-layer/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

데이터 링크 계층은 선 하나로 이어진 두 노드가 비트 묶음(프레임)을 주고받게 해 주는 층이다. 가장 단순한 네트워크인 점대점 연결에서 할 일이 여기서 모두 나온다. 비트를 신호로 바꿔 보내고, 비트를 묶음으로 끊어 경계를 알리고, 깨진 묶음을 찾아 복구해야 한다. 선 하나만 책임지므로, 여러 링크를 건너는 경로는 윗층이 맡는다.

</div>


## 예시로 보기

케이블 하나로 PC 두 대를 잇는다. PC A가 "HELLO"를 보내려면 세 가지가 필요하다[^1].

1. 0과 1을 선 위의 전압이나 빛으로 바꾼다. 받는 쪽은 신호를 다시 0과 1로 읽는다.
2. 이어진 비트 흐름에서 "여기부터 여기까지가 한 묶음"이라고 표시한다. 그래야 받는 쪽이 메시지의 시작과 끝을 안다.
3. 잡음으로 비트가 뒤집혔는지 확인하고, 틀렸으면 다시 받는다.

이 장면에서 PC가 노드, 케이블이 링크, 한 묶음이 프레임이다.

## 정의

OSI 7계층의 1·2계층은 하나의 링크로 연결된 노드 사이의 비트 묶음(프레임) 교환을 담당한다[^1][^2]. 하나의 링크로 연결된 두 노드는 점대점 연결 네트워크를 이룬다. 가장 간단한 네트워크이고, 더 큰 네트워크를 쌓는 기본 벽돌이다[^1].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

점대점 연결에서 통신의 실체는 다음 세 가지다[^1].
- **비트 교환:** 신호 인코딩과 디지털 전송. 비트를 신호로 바꿔 보낸다.
- **비트 묶음 교환:** 프레이밍. 비트를 프레임으로 끊고 경계를 알린다.
- **오류 검출과 복구:** 깨진 프레임을 찾아내고 되살린다.

</div>


슬라이드는 이어서 "노드의 실체는?", "링크의 실체는?"을 묻는다[^1]. 답은 [노드](/Hongs_Blog/studies/computer-communication/node-hardware/)와 [점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)의 "링크의 실체"에 있다.

**"프레임"의 두 뜻.** [시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)에서 프레임은 모든 입력이 칸을 한 번씩 쓰는 한 바퀴다. 여기서 프레임은 링크 하나로 보내는 비트 묶음이다. 같은 단어가 두 뜻으로 쓰인다.

| | 시분할 다중화의 프레임 | 데이터 링크 계층의 프레임 |
|---|---|---|
| 무엇 | 입력 $$N$$개의 칸이 한 번씩 도는 주기 | 한 노드가 이웃 노드로 보내는 비트 묶음 |
| 주인 | 여러 입력이 나눠 가짐 | 보내는 노드 하나 |
| 경계 표시 | 동기(시간 위치) | 프레이밍 규칙(시작·끝 표시)[^s1] |

## 연결

- 선수: [OSI 참조 모델](/Hongs_Blog/studies/computer-communication/osi-reference-model/), [점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/)
- 비트를 신호로 바꾸는 일: [신호와 변조](/Hongs_Blog/studies/computer-communication/signal-and-modulation/)
- 링크 양 끝의 장치: [노드](/Hongs_Blog/studies/computer-communication/node-hardware/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 점대점 연결에서 통신의 실체 세 가지를 쓰고, 데이터 링크 계층이 누구와 누구 사이에서 무엇을 교환하는지 쓰라.</summary>


**답:** 비트 교환(신호 인코딩, 디지털 전송), 비트 묶음 교환(프레이밍), 오류 검출과 복구. 데이터 링크 계층은 하나의 링크로 연결된 노드 사이에서 비트 묶음(프레임)을 교환한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> "프레임"이 (a) 시분할 다중화 문서와 (b) 데이터 링크 계층 문서에서 각각 무엇을 뜻하는지 쓰고, 둘을 가르는 기준 하나를 들어라.</summary>


**답:** (a) 입력 $$N$$개가 칸을 한 번씩 쓰는 한 바퀴(주기). (b) 한 노드가 링크 하나로 이웃 노드에 보내는 비트 묶음. 기준: (a)는 여러 입력이 나눠 갖는 시간 구조이고, (b)는 보내는 노드 하나의 데이터 단위다.<br>
**흔한 오답:** 둘 다 "비트 묶음"이라 같은 것으로 보는 것. 시분할 프레임 안에는 여러 입력의 데이터가 섞여 있다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260926021332.png — 슬라이드 "데이터 링크 계층". 빨간 동그라미: 데이터 링크, 1,2계층, 프레임
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 86행
[^s1]: 에이전트 보충. 두 "프레임"의 비교표는 원본에 없다. 프레이밍 규칙의 구체적 방법(시작·끝 표시)은 뒤 강의에서 다룰 내용이다. Peterson & Davie, *Computer Networks: A Systems Approach*, 2.3절(Framing)의 내용이다.
{% endraw %}
