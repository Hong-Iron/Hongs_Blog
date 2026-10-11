---
layout: "note"
title: "캐시 적중과 실패 추적 예제 사다리"
display_title: "캐시 적중과 실패 추적 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "37"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 직접 사상 캐시의 주소 자르기, 집합 연관 캐시의 집합과 way, 캐시 교체 정책의 LRU, 캐시 성능과 평균 접근 시간의 세 가지 실패."
prev_url: "/studies/computer-architecture/pipeline-hazard-ladder/"
prev_title: "파이프라인 해저드 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/cache-tracing-ladder/"
---
{% raw %}
사용 개념: [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)의 주소 자르기, [집합 연관 캐시](/Hongs_Blog/studies/computer-architecture/set-associative-cache/)의 집합과 way, [캐시 교체 정책](/Hongs_Blog/studies/computer-architecture/cache-replacement/)의 LRU, [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)의 세 가지 실패.

"캐시 구성과 주소 열이 주어지고 적중과 실패를 가리라"는 문제는 늘 같은 하위목표의 반복이다. ① 오프셋·인덱스·태그의 비트 수를 정한다. ② 주소를 2진수로 써서 세 토막으로 자른다. ③ 인덱스가 가리키는 줄(집합)을 보고, 유효하고 태그가 같으면 적중으로 적는다. ④ 실패면 블록을 넣고, 자리가 없으면 누구를 내보내는지 적는다. ⑤ 적중과 실패를 세고 마지막 캐시 내용을 적는다.

이 방법을 떠올리는 실마리는 주소가 16진수나 10진수로 주어졌다는 것이다. 그대로는 줄 번호가 안 보이므로 먼저 2진수로 편다. 주소는 모두 바이트 주소이고 캐시는 비어 있는 채로 시작한다. 자리가 다 찼을 때는 가장 오래 안 쓴 것(LRU)을 내보낸다[^1].

## 문제 1 · 완전한 풀이

주소 8비트, 직접 사상, 줄 4개, 블록 8바이트. 주소 0x08, 0x0C, 0x28, 0x10, 0x0A, 0x48, 0x2C, 0x14를 차례로 읽는다. 접근마다 적중 여부를 가리고, 실패율과 캐시 전체 비트 수를 구하라.

1. *비트 수:* 오프셋 $$\log_2 8 = 3$$, 인덱스 $$\log_2 4 = 2$$, 태그 $$8 - 2 - 3 = 3$$비트.
2. *주소 자르기와* 3. *줄 보기,* 4. *내보내기:*

| 순서 | 주소 | 태그 · 줄 · 위치 | 태그 | 줄 | 결과 | 줄에 일어난 일 |
|---|---|---|---|---|---|---|
| 1 | 0x08 | 000 · 01 · 000 | 0 | 1 | 실패 | 비어 있었다 |
| 2 | 0x0C | 000 · 01 · 100 | 0 | 1 | 적중 | 같은 블록의 다른 바이트 |
| 3 | 0x28 | 001 · 01 · 000 | 1 | 1 | 실패 | 태그 0을 내보낸다 |
| 4 | 0x10 | 000 · 10 · 000 | 0 | 2 | 실패 | 비어 있었다 |
| 5 | 0x0A | 000 · 01 · 010 | 0 | 1 | 실패 | 태그 1을 내보낸다 |
| 6 | 0x48 | 010 · 01 · 000 | 2 | 1 | 실패 | 태그 0을 내보낸다 |
| 7 | 0x2C | 001 · 01 · 100 | 1 | 1 | 실패 | 태그 2를 내보낸다 |
| 8 | 0x14 | 000 · 10 · 100 | 0 | 2 | 적중 | 4번에서 가져온 블록 |

{: start="5"}
5. *세기:* 적중 2, 실패 6. 실패율 $$6 \div 8 = 75\%$$. 끝났을 때 줄 1에 태그 1, 줄 2에 태그 0이 있고 줄 0과 3은 비어 있다.
6. *전체 비트 수:* 줄 하나가 유효 1 + 태그 3 + 데이터 64 = 68비트. $$4 \times 68 = 272$$비트.

5번 접근(0x0A)은 1번(0x08)과 같은 블록인데도 실패다. 그 사이 3번이 그 블록을 내보냈다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [37_cache-tracing-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/37_cache-tracing-ladder_p4/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

주소 10비트, 직접 사상, 줄 8개, 블록 4바이트. 주소 0x0A4, 0x0A6, 0x1C4, 0x0B0, 0x2A4, 0x1C5, 0x0A5, 0x0B3, 0x3B0, 0x1C4를 차례로 읽는다.

1. *비트 수:* 오프셋 2, 인덱스 3, 태그 $$10 - 3 - 2 = 5$$비트.
2. *주소 자르기와* 3. *줄 보기,* 4. *내보내기:*

| 순서 | 주소 | 태그 · 줄 · 위치 | 태그 | 줄 | 결과 | 줄에 일어난 일 |
|---|---|---|---|---|---|---|
| 1 | 0x0A4 | 00101 · 001 · 00 | 5 | 1 | 실패 | 비어 있었다 |
| 2 | 0x0A6 | 00101 · 001 · 10 | 5 | 1 | 적중 | |
| 3 | 0x1C4 | 01110 · 001 · 00 | 14 | 1 | 실패 | 태그 5를 내보낸다 |
| 4 | 0x0B0 | 00101 · 100 · 00 | 5 | 4 | 실패 | 비어 있었다 |
| 5 | 0x2A4 | 10101 · 001 · 00 | 21 | 1 | 실패 | 태그 14를 내보낸다 |
| 6 | 0x1C5 | 01110 · 001 · 01 | 14 | 1 | 실패 | 태그 21을 내보낸다 |
| 7 | 0x0A5 | 00101 · 001 · 01 | 5 | 1 | 실패 | 태그 14를 내보낸다 |
| 8 | 0x0B3 | 00101 · 100 · 11 | 5 | 4 | 적중 | |
| 9 | 0x3B0 | 11101 · 100 · 00 | 29 | 4 | 실패 | 태그 5를 내보낸다 |
| 10 | 0x1C4 | 01110 · 001 · 00 | 14 | 1 | 실패 | 태그 5를 내보낸다 |

{: start="5"}
5. *세기와 마지막 캐시 내용:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

적중 2, 실패 8, 실패율 80%. 끝났을 때 줄 1에 태그 14, 줄 4에 태그 29가 있고 나머지 여섯 줄은 비어 있다. 줄 1과 줄 4에는 같은 태그 5가 들어간 적이 있지만 서로 다른 블록이다. 태그가 같아도 줄이 다르면 다른 블록이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [37_cache-tracing-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/37_cache-tracing-ladder_p4/)</div>

</div>


## 문제 3 · 하위목표 절반이 빈칸

주소 8비트, 2-way 집합 연관, 집합 4개, 블록 4바이트, LRU. 주소 0x10, 0x30, 0x12, 0x50, 0x10, 0x14, 0x30, 0x52, 0x34, 0x16을 차례로 읽는다.

1. *비트 수:* ______
2. *주소 자르기:* 태그 · 집합 · 위치로 자른 결과는 다음과 같다.

| 순서 | 주소 | 태그 | 집합 |
|---|---|---|---|
| 1 | 0x10 | 1 | 0 |
| 2 | 0x30 | 3 | 0 |
| 3 | 0x12 | 1 | 0 |
| 4 | 0x50 | 5 | 0 |
| 5 | 0x10 | 1 | 0 |
| 6 | 0x14 | 1 | 1 |
| 7 | 0x30 | 3 | 0 |
| 8 | 0x52 | 5 | 0 |
| 9 | 0x34 | 3 | 1 |
| 10 | 0x16 | 1 | 1 |

{: start="3"}
3. *집합 보기와* 4. *내보내기:* ______
5. *세기:* 적중 3, 실패 7. 끝났을 때 집합 0에는 태그 3과 5, 집합 1에는 태그 3과 1이 있다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 블록 4바이트라 오프셋 2비트, 집합 4개라 인덱스 2비트, 태그는 $$8 - 2 - 2 = 4$$비트.<br>
3·4. 집합 안의 순서는 "오래 안 쓴 것, 방금 쓴 것"으로 적는다.

| 순서 | 태그 | 집합 | 결과 | 그 집합의 내용 |
|---|---|---|---|---|
| 1 | 1 | 0 | 실패 | 1 |
| 2 | 3 | 0 | 실패 | 1, 3 |
| 3 | 1 | 0 | 적중 | 3, 1 |
| 4 | 5 | 0 | 실패 | 3을 내보낸다 → 1, 5 |
| 5 | 1 | 0 | 적중 | 5, 1 |
| 6 | 1 | 1 | 실패 | 1 |
| 7 | 3 | 0 | 실패 | 5를 내보낸다 → 1, 3 |
| 8 | 5 | 0 | 실패 | 1을 내보낸다 → 3, 5 |
| 9 | 3 | 1 | 실패 | 1, 3 |
| 10 | 1 | 1 | 적중 | 3, 1 |

6번의 태그 1은 집합 1의 블록이고, 1번의 태그 1은 집합 0의 블록이다. 서로 다른 블록이라 6번은 실패다. 같은 접근을 같은 크기의 직접 사상(8줄)에 넣으면 10번 모두 실패한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [37_cache-tracing-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/37_cache-tracing-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

주소 8비트, 2-way 집합 연관, 집합 2개, 블록 8바이트, LRU. 주소 0x24, 0x38, 0x44, 0x20, 0x64, 0x3C, 0x48, 0x84, 0x26, 0x68을 차례로 읽는다.

(가) 접근마다 적중 여부와 내보낸 태그를 쓰라. (나) 끝났을 때 두 집합의 내용을 쓰라. (다) 캐시 전체 비트 수를 구하라. (라) 실패를 강제·용량·충돌로 가르라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

오프셋 3, 인덱스 1, 태그 4비트다.

| 순서 | 주소 | 태그 · 집합 · 위치 | 태그 | 집합 | 결과 | 그 집합의 내용 (오래 안 쓴 것, 방금 쓴 것) |
|---|---|---|---|---|---|---|
| 1 | 0x24 | 0010 · 0 · 100 | 2 | 0 | 실패 | 2 |
| 2 | 0x38 | 0011 · 1 · 000 | 3 | 1 | 실패 | 3 |
| 3 | 0x44 | 0100 · 0 · 100 | 4 | 0 | 실패 | 2, 4 |
| 4 | 0x20 | 0010 · 0 · 000 | 2 | 0 | 적중 | 4, 2 |
| 5 | 0x64 | 0110 · 0 · 100 | 6 | 0 | 실패 | 4를 내보낸다 → 2, 6 |
| 6 | 0x3C | 0011 · 1 · 100 | 3 | 1 | 적중 | 3 |
| 7 | 0x48 | 0100 · 1 · 000 | 4 | 1 | 실패 | 3, 4 |
| 8 | 0x84 | 1000 · 0 · 100 | 8 | 0 | 실패 | 2를 내보낸다 → 6, 8 |
| 9 | 0x26 | 0010 · 0 · 110 | 2 | 0 | 실패 | 6을 내보낸다 → 8, 2 |
| 10 | 0x68 | 0110 · 1 · 000 | 6 | 1 | 실패 | 3을 내보낸다 → 4, 6 |

(가) 적중은 4번과 6번, 나머지 8번은 실패다. (나) 집합 0에 태그 8과 2, 집합 1에 태그 4와 6. (다) 줄 하나가 1 + 4 + 64 = 69비트, 줄이 4개라 276비트. (라) 강제 7, 용량 1, 충돌 0.

(라)의 풀이: 처음 건드린 블록은 1, 2, 3, 5, 7, 8, 10번의 7개다(강제 실패). 남은 실패는 9번 하나다. 같은 크기(블록 4개)의 완전 연관 캐시에 넣어도 9번은 실패한다. 4번 뒤로 블록 넷(5, 6, 7, 8번의 것)을 거치는 동안 0x20의 블록이 가장 오래된 것이 되어 나가기 때문이다. 완전 연관에서도 나는 실패이므로 용량 실패다.

3번의 태그 4(집합 0)와 7번의 태그 4(집합 1)는 서로 다른 블록이다. 10번의 태그 6도 5번의 태그 6과 집합이 다르다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [37_cache-tracing-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/37_cache-tracing-ladder_p4/)</div>

</div>


[^1]: 문제의 틀(주소 열을 주고 적중과 실패를 가리는 추적)은 Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy"의 연습 문제 꼴을 따랐다. 캐시 구성과 주소는 모두 새로 만들었고 답은 문제 코드로 확인했다.
{% endraw %}
