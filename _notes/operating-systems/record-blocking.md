---
layout: "note"
title: "레코드 블로킹"
display_title: "레코드 블로킹 (Record Blocking)"
kind: "concept"
kind_label: "기법"
num: "59"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Record Blocking", "고정 블로킹", "Fixed Blocking", "가변 길이 걸침 블로킹", "Variable-Length Spanned Blocking", "가변 길이 비걸침 블로킹", "Variable-Length Unspanned Blocking", "블로킹 인수", "Blocking Factor"]
description: "응용은 레코드 단위로 읽고 쓰지만 디스크는 블록 단위로만 주고받는다. 그래서 레코드 여러 개를 블록 하나에 어떻게 담을지 정해야 한다. 이삿짐을 상자에 담을 때 같은 크기 물건만 넣으면 계산이 쉽지만 빈틈이 생기고, 크기가 제각각인 물건을 상자 경계를 넘겨 가며 꽉 채우면 빈틈은 …"
prev_url: "/studies/operating-systems/directories-file-sharing/"
prev_title: "디렉터리와 파일 공유"
next_url: "/studies/operating-systems/file-allocation/"
next_title: "파일 할당"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/record-blocking/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

응용은 레코드 단위로 읽고 쓰지만 디스크는 블록 단위로만 주고받는다. 그래서 레코드 여러 개를 블록 하나에 어떻게 담을지 정해야 한다. 이삿짐을 상자에 담을 때 같은 크기 물건만 넣으면 계산이 쉽지만 빈틈이 생기고, 크기가 제각각인 물건을 상자 경계를 넘겨 가며 꽉 채우면 빈틈은 없지만 한 물건을 꺼내려면 상자 둘을 열어야 하는 것과 같다.

</div>


## 예시로 보기

블록 1,024바이트에 100바이트 레코드 1,000개를 담는다[^s1].

- 블록 하나에 레코드 $$\lfloor 1024 / 100 \rfloor = 10$$개가 들어간다(블로킹 인수).
- 블록 끝마다 $$1024 - 10 \times 100 = 24$$바이트가 남는다.
- 필요한 블록은 $$1000 / 10 = 100$$개, 버리는 공간은 $$100 \times 24 = 2{,}400$$바이트다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 계산과 가변 길이 두 방식의 블록 수 — [59_record-blocking_verify.py](/Hongs_Blog/studies/operating-systems/code/59_record-blocking_verify/)</div>

</div>


## 정확히 말하면

레코드는 구조화된 파일에서 접근의 논리 단위이고, 블록은 2차 기억장치와의 입출력 단위다. 흔한 방식은 셋이다[^1].

| 방식 | 내용 | 장단점 |
|---|---|---|
| 고정 블로킹 | 고정 길이 레코드를 블록마다 정수 개 담는다 | 블록 끝의 남는 공간이 내부 단편화다[^2] |
| 가변 길이 걸침(spanned) | 가변 길이 레코드를 빈 공간 없이 꽉 채운다. 어떤 레코드는 두 블록에 걸치고, 다음 블록을 가리키는 포인터로 이어 간다 | 공간 낭비가 없고 레코드 크기에 제한이 없다. 걸친 레코드는 입출력이 두 번 들고, 파일을 고치기 어렵다[^3] |
| 가변 길이 비걸침(unspanned) | 가변 길이 레코드를 쓰되 블록에 걸치지 않는다 | 다음 레코드가 남은 공간보다 크면 그 공간을 못 쓰고 버린다. 레코드 크기가 블록 크기를 넘을 수 없다[^4] |

**블로킹 인수.** 블록 크기 $$B$$, 고정 레코드 크기 $$R$$이면 블록당 레코드 수는 $$\lfloor B/R \rfloor$$이고, 블록마다 $$B \bmod R$$바이트가 남는다[^s1]. 예: $$B = 1024$$, $$R = 300$$이면 블록당 3개, 남는 공간 124바이트.

**가변 길이 예.** 블록 1,024바이트에 레코드 300, 500, 400, 200, 600, 100바이트(합 2,100)를 담으면[^s1]

| 방식 | 배치 | 블록 수 |
|---|---|---|
| 걸침 | 꽉 채움: 2,100 / 1,024를 올림 | 3 |
| 비걸침 | [300, 500] [400, 200] [600, 100] | 3 |

레코드가 600바이트 셋이면 걸침은 2블록($$\lceil 1800/1024 \rceil$$), 비걸침은 블록 하나에 하나씩 3블록이 든다.

**블록 크기를 정할 때.** 블록이 크면 한 번의 입출력으로 더 많은 레코드를 옮겨, 차례로 읽을 때 빠르다. 대신 무작위로 레코드 하나를 읽을 때 쓸데없는 레코드까지 옮기고, 버퍼도 커야 한다[^s1].

## 활용

- 데이터베이스는 보통 페이지(블록) 안에 가변 길이 레코드를 비걸침으로 담고, 너무 큰 값은 따로 떼어 저장한다[^s1].

## 연결

- 선수: [파일 조직](/Hongs_Blog/studies/operating-systems/file-organization/), [메모리 분할](/Hongs_Blog/studies/operating-systems/memory-partitioning/) (내부 단편화)
- 블록을 디스크에 놓는 방법: [파일 할당](/Hongs_Blog/studies/operating-systems/file-allocation/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 블록 1,024바이트, 고정 레코드 100바이트, 레코드 1,000개. 블로킹 인수, 필요한 블록 수, 전체 낭비는?</summary>


**답:** 블로킹 인수 10, 블록 100개, 낭비 블록당 24바이트 × 100 = 2,400바이트.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 레코드 크기가 제각각이고 가끔 블록보다 큰 레코드도 있다. 걸침과 비걸침 중 무엇을 써야 하는가?</summary>


**답:** 걸침. 비걸침은 레코드가 블록 하나 안에 들어가야 하므로 블록보다 큰 레코드를 담을 수 없다. 걸침은 포인터로 다음 블록에 이어 담는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 걸침 방식에서 레코드 하나를 읽는 데 입출력이 두 번 필요할 수 있는 이유는?</summary>


**답:** 레코드가 두 블록에 걸쳐 놓일 수 있다. 앞부분이 있는 블록을 읽고, 그 블록의 포인터를 따라 뒷부분이 있는 블록을 또 읽어야 레코드가 완성된다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/12.Chapter12-new.pptx, 슬라이드 51
[^2]: 같은 자료, 슬라이드 52~53 (그림 12.6a)
[^3]: 같은 자료, 슬라이드 54~55 (그림 12.6b)
[^4]: 같은 자료, 슬라이드 56~57 (그림 12.6c)
[^s1]: 에이전트 보충. 수치 예, 블로킹 인수 식, 걸침 방식의 단점(입출력 두 번, 갱신 어려움)과 블록 크기의 맞바꿈, 데이터베이스 연결, 확인 문제는 Stallings 6판 12.5절을 바탕으로 보탰다.
{% endraw %}
