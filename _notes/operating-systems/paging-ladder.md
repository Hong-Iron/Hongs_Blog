---
layout: "note"
title: "페이징 주소 변환 예제 사다리"
display_title: "페이징 주소 변환 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "36"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
description: "사용 개념: 페이징의 주소 변환 \"물리 주소 = 프레임 번호 × 페이지 크기 + 오프셋\"."
prev_url: "/studies/operating-systems/bankers-ladder/"
prev_title: "은행원 알고리즘 예제 사다리"
next_url: "/studies/operating-systems/page-replacement-ladder/"
next_title: "페이지 교체 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/paging-ladder/"
---
{% raw %}
사용 개념: [페이징](/Hongs_Blog/studies/operating-systems/paging/)의 주소 변환 "물리 주소 = 프레임 번호 × 페이지 크기 + 오프셋".

이 방법을 떠올리는 신호는 "페이지 크기", "논리 주소", "페이지 표"가 함께 주어지는 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다. 오프셋 비트 수 정하기, 논리 주소를 페이지 번호와 오프셋으로 자르기, 페이지 표에서 프레임 찾기, 프레임 번호 뒤에 오프셋 붙이기다. 16진수로 주면 4비트가 16진수 한 자리라서 자르기가 쉽다[^s1].

## 문제 1 · 완전한 풀이

16비트 주소, 페이지 크기 1 K. 논리 주소 1502의 1번 페이지는 프레임 6에 있다. 물리 주소는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *오프셋 비트 수:* 1 K = $$2^{10}$$이므로 오프셋 10비트, 페이지 번호 6비트.
2. *자르기:* 1502 = 1 × 1024 + 478. 페이지 1, 오프셋 478.
3. *프레임 찾기:* 페이지 1 → 프레임 6.
4. *붙이기:* 6 × 1024 + 478 = 6622. 2진수로 000110 0111011110.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

32비트 주소, 페이지 크기 4 KB. 논리 주소 0x00003A7C, 페이지 표에서 페이지 3은 프레임 0x2F에 있다.

1. *오프셋 비트 수:* 4 KB = $$2^{12}$$이므로 오프셋 12비트 = 16진수 3자리.
2. *자르기:* 페이지 0x00003, 오프셋 0xA7C.
3. *프레임 찾기:* 페이지 3 → 프레임 0x2F.
4. *붙이기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

프레임 0x2F 뒤에 오프셋 0xA7C를 붙여 0x2FA7C.

</details>


## 문제 3 · 하위목표 절반이 빈칸

32비트 주소, 페이지 크기 4 KB. 논리 주소 0x00005123, 페이지 5는 프레임 0x10에 있다.

1. *오프셋 비트 수:* ______
2. *자르기:* ______
3. *프레임 찾기:* 페이지 5 → 프레임 0x10.
4. *붙이기:* 0x10 뒤에 오프셋을 붙인다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 12비트(16진수 3자리). 2. 페이지 0x5, 오프셋 0x123. 4. 0x10123.

</details>


## 문제 4 · 독립 문제

32비트 주소, 페이지 크기 4 KB인 시스템이다. (1) 프로세스 하나가 가질 수 있는 페이지는 최대 몇 개인가? (2) 논리 주소 0x0000BEEF의 페이지 0xB가 프레임 0x7에 있다면 물리 주소는? (3) 크기가 10,000바이트인 프로세스는 몇 페이지를 쓰고, 내부 단편화는 몇 바이트인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(1) 페이지 번호가 32 − 12 = 20비트이므로 $$2^{20}$$ = 1,048,576개.<br>
(2) 오프셋 0xEEF, 프레임 0x7 → 0x7EEF.<br>
(3) 10,000 / 4,096 = 2.44…이므로 3페이지(12,288바이트). 내부 단편화 12,288 − 10,000 = 2,288바이트.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4 (2)의 변환과 (1)의 개수 — [36_paging_impl.py](/Hongs_Blog/studies/operating-systems/code/36_paging_impl/)</div>

</div>


[^s1]: 에이전트 보충. 문제 1은 Stallings 6판 그림 7.11의 예다. 문제 2~4는 원본 범위 밖의 변형 문제다.
{% endraw %}
