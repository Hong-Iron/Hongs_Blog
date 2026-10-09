---
layout: "note"
title: "세그먼테이션"
display_title: "세그먼테이션 (Segmentation)"
kind: "concept"
kind_label: "기법"
num: "37"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Segmentation", "세그먼트", "Segment", "세그먼트 표", "Segment Table", "세그먼트 번호"]
description: "세그먼테이션은 프로그램을 코드, 데이터, 스택처럼 뜻이 있는 덩어리(세그먼트)로 나누고, 덩어리마다 길이를 다르게 둔다. 책을 낱장이 아니라 장(chapter) 단위로 나누는 것과 같다. 프로그래머가 보는 구조와 맞아서, 세그먼트마다 읽기 전용·실행 전용 같은 보호를 주고 통째로 …"
prev_url: "/studies/operating-systems/paging/"
prev_title: "페이징"
next_url: "/studies/operating-systems/virtual-memory/"
next_title: "가상 메모리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/segmentation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

세그먼테이션은 프로그램을 코드, 데이터, 스택처럼 뜻이 있는 덩어리(세그먼트)로 나누고, 덩어리마다 길이를 다르게 둔다. 책을 낱장이 아니라 장(chapter) 단위로 나누는 것과 같다. 프로그래머가 보는 구조와 맞아서, 세그먼트마다 읽기 전용·실행 전용 같은 보호를 주고 통째로 공유하기 쉽다. 대신 크기가 제각각이라 동적 분할처럼 외부 단편화가 생긴다.

</div>


## 예시로 보기

슬라이드의 세그먼트 표다[^1].

| 세그먼트 번호 | 시작 주소 (base) | 길이 |
|---|---|---|
| 1 | 12 | 12 |
| 2 | 0 | 10 |
| 3 | 26 | 4 |

메모리에서는 세그먼트 2가 0~9, 세그먼트 1이 12~23, 세그먼트 3이 26~29에 있다. 프로그램이 "세그먼트 1의 5번째"를 찾으면 12 + 5 = 17번지다. "세그먼트 3의 6번째"는 길이 4를 넘으므로 접근을 막는다[^s1].

```
 번지      0~9       10~11      12~23      24~25      26~29
      +------------+--------+------------+--------+------------+
      | 세그먼트 2 | 안 씀  | 세그먼트 1 | 안 씀  | 세그먼트 3 |
      +------------+--------+------------+--------+------------+
```

세그먼트는 번호 순서와 상관없이 메모리 아무 곳에나, 서로 떨어져 놓인다. 세그먼트 사이에 남은 틈은 크기가 제각각이다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 변환과 길이 초과 검사, 그림 7.12b의 8976 — [36_paging_impl.py](/Hongs_Blog/studies/operating-systems/code/36_paging_impl/)</div>

</div>


## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

프로그램과 데이터를 여러 세그먼트로 나눈다. 세그먼트끼리 길이가 같을 필요는 없지만 최대 길이는 있다. 주소는 세그먼트 번호와 오프셋 두 부분이다[^2]. 운영체제는 프로세스마다 **세그먼트 표**를 두고, 세그먼트마다 시작 주소와 길이를 적는다[^3].

</div>


**주소 변환**[^s1]

1. 논리 주소에서 세그먼트 번호 $$s$$와 오프셋 $$o$$를 꺼낸다.
2. 세그먼트 표에서 $$s$$의 시작 주소 base와 길이 length를 찾는다.
3. $$o \ge$$ length이면 잘못된 주소다. 운영체제로 넘긴다.
4. 아니면 물리 주소 = base + $$o$$.

페이징과 달리 마지막에 **더하기**가 필요하다. 세그먼트 시작 주소가 2의 거듭제곱 경계에 맞춰져 있지 않기 때문이다.

16비트 주소를 세그먼트 번호 4비트, 오프셋 12비트로 나눈 예(Stallings 그림 7.12b): 세그먼트 1, 오프셋 752, 세그먼트 1의 시작 주소가 8224이면 물리 주소는 8224 + 752 = 8976이다[^s1].

세그먼트는 크기가 다르므로 메모리에 놓는 방식이 [동적 분할](/Hongs_Blog/studies/operating-systems/memory-partitioning/)과 비슷하다. 다른 점은 한 프로그램이 여러 세그먼트를 차지하고, 그 세그먼트들이 서로 붙어 있지 않아도 된다는 것이다[^2]. 세그먼트 하나가 커서 연속으로 두기 어려우면 그 세그먼트를 다시 페이징해서, 세그먼트마다 페이지 표를 둘 수도 있다[^4].

### 페이징과 비교

| | 페이징 | 세그먼테이션 |
|---|---|---|
| 조각 크기 | 모두 같음 | 세그먼트마다 다름 |
| 누가 나누나 | 운영체제와 하드웨어. 프로그래머에게 보이지 않음 | 프로그래머·컴파일러가 의미 단위로 |
| 단편화 | 내부 (마지막 페이지) | 외부 |
| 주소 변환 | 프레임 번호 뒤에 오프셋을 붙임 | 시작 주소에 오프셋을 더함, 길이 검사 |
| 보호·공유 단위 | 페이지 (의미와 무관) | 세그먼트 (코드, 데이터처럼 의미 단위) |

## 활용

- 실행 파일은 코드 영역(.text), 데이터 영역(.data), 스택처럼 세그먼트로 나뉘고, 코드는 읽기·실행만, 데이터는 읽기·쓰기만 허락한다. 오늘날 운영체제는 이 구분을 대부분 페이지 단위 보호로 흉내 낸다[^s1].
- C에서 잘못된 주소에 접근하면 나는 "segmentation fault"라는 오류 이름이 세그먼트 길이 검사에서 왔다[^s1].

## 연결

- 선수: [페이징](/Hongs_Blog/studies/operating-systems/paging/)
- 둘을 함께 쓰는 가상 메모리: [가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 슬라이드 세그먼트 표(1: base 12, 길이 12 / 2: base 0, 길이 10 / 3: base 26, 길이 4)에서 (세그먼트 2, 오프셋 9)와 (세그먼트 1, 오프셋 12)는 각각 어떻게 되는가?</summary>


**답:** (2, 9) → 0 + 9 = 9번지. 길이 10 안이다. (1, 12) → 오프셋 12가 길이 12 이상이라 잘못된 주소다(오프셋은 0~11만 쓸 수 있다).<br>
**흔한 오답:** (1, 12)를 24번지로 계산하는 것. 길이 검사를 먼저 해야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 페이징에는 없고 세그먼테이션에만 있는 단편화는? 그 이유는?</summary>


**답:** 외부 단편화. 세그먼트 크기가 제각각이라, 들고 나면서 크기가 다른 빈 틈이 생긴다. 페이징은 모든 빈칸이 같은 크기라 이런 틈이 없다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 세그먼트 단위로 보호(읽기 전용 등)를 주는 것이 페이지 단위보다 자연스러운 이유는?</summary>


**답:** 세그먼트는 코드, 데이터처럼 프로그램의 의미 단위와 맞는다. 코드 세그먼트 전체를 읽기·실행 전용으로 하면 된다. 페이지는 의미와 무관하게 잘리므로, 한 페이지에 코드와 데이터가 섞일 수 있어 보호 속성을 하나로 정하기 어렵다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/07.chap7 (Stony Brook).pdf, p.35
[^2]: 같은 자료, p.33
[^3]: 같은 자료, p.34
[^4]: 같은 자료, p.34
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 Stony Brook 대학 CSE306의 공개 슬라이드(Stallings 교재 기반)를 원본으로 썼다. 표로 계산한 예, 변환 단계, 그림 7.12b 예, 페이징과의 비교표, 실행 파일·segmentation fault 연결, 확인 문제는 Stallings 6판 7.4절을 바탕으로 보탰다.
[^s2]: 에이전트 보충. 다이어그램 1개는 원본에 없다. "예시로 보기"의 세그먼트 표(p.35)에서 시작 주소와 길이로 계산한 메모리 배치를 그렸다. 칸 너비는 크기에 비례하지 않는다.
{% endraw %}
