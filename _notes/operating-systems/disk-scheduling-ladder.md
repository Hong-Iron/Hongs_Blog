---
layout: "note"
title: "디스크 스케줄링 예제 사다리"
display_title: "디스크 스케줄링 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "53"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 디스크 스케줄링의 FIFO·SSTF·SCAN·C-SCAN 규칙. SCAN·C-SCAN은 이 강의의 정의대로 그 방향의 마지막 요청에서 돌아선다."
prev_url: "/studies/operating-systems/real-time-scheduling-ladder/"
prev_title: "실시간 스케줄링 예제 사다리"
next_url: "/studies/operating-systems/file-allocation-inode-ladder/"
next_title: "파일 할당과 아이노드 예제 사다리"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/disk-scheduling-ladder/"
---
{% raw %}
사용 개념: [디스크 스케줄링](/Hongs_Blog/studies/operating-systems/disk-scheduling/)의 FIFO·SSTF·SCAN·C-SCAN 규칙. SCAN·C-SCAN은 이 강의의 정의대로 그 방향의 마지막 요청에서 돌아선다.

이 방법을 떠올리는 신호는 "헤드 위치", "요청 트랙 목록"이 주어지고 이동 거리를 묻는 문제다. 풀이는 같은 하위목표로 나뉜다. 규칙대로 처리 순서 정하기, 한 걸음씩 이동 거리 적기, 합과 평균 구하기다. SCAN 계열은 먼저 요청을 헤드보다 큰 쪽과 작은 쪽으로 나누면 쉽다[^s1].

네 문제 모두 헤드 50, 요청 82, 170, 43, 140, 24, 16, 190(트랙 0~199)이다.

## 문제 1 · 완전한 풀이

FIFO의 이동 합은?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *순서:* 들어온 대로 82, 170, 43, 140, 24, 16, 190.
2. *이동:* 50→82 = 32, →170 = 88, →43 = 127, →140 = 97, →24 = 116, →16 = 8, →190 = 174.
3. *합:* 642. 평균 642 / 7 ≈ 91.7.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

SSTF의 이동 합은?

1. *순서:* 가장 가까운 것부터 43(7), 24(19), 16(8). 이제 남은 것 중 가장 가까운 82(66), 140(58), 170(30), 190(20).
2. *이동:* 7, 19, 8, 66, 58, 30, 20.
3. *합:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="208"}
208. FIFO의 3분의 1이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

SCAN(트랙이 커지는 방향으로 시작)의 이동 합은?

1. *나누기:* 큰 쪽 82, 140, 170, 190 / 작은 쪽 43, 24, 16.
2. *순서:* ______
3. *이동:* ______
4. *합:* 314.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. 82, 140, 170, 190, 그다음 방향을 바꿔 43, 24, 16.
3. 32, 58, 30, 20, 147, 19, 8.

</details>


## 문제 4 · 독립 문제

C-SCAN(커지는 방향으로만)의 처리 순서와 이동 합을 구하라. 디스크 끝(199)까지 갔다 0에서 다시 시작하는 버전이라면 이동 합은 얼마가 되는가? (돌아가는 이동도 센다)

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

마지막 요청에서 돌아서는 버전: 82, 140, 170, 190, 16, 24, 43. 이동 32 + 58 + 30 + 20 + 174 + 8 + 19 = 341.<br>
끝까지 가는 버전: 50→199 = 149, 199→0 = 199, 0→43 = 43. 합 391.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 첫 번째 답(FIFO 642, SSTF 208, SCAN 314, C-SCAN 341) — [53_disk-scheduling_impl.py](/Hongs_Blog/studies/operating-systems/code/53_disk-scheduling_impl/)</div>

</div>


[^s1]: 에이전트 보충. 네 문제의 요청 목록은 원본 범위 밖의 변형이다. 풀이 규칙은 슬라이드 표 11.2와 같다.
{% endraw %}
