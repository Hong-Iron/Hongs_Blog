---
layout: "note"
title: "파일 할당과 아이노드 예제 사다리"
display_title: "파일 할당과 아이노드 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "61"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: UNIX 아이노드의 최대 크기 (d + n + n^2 + n^3) \\times B와 파일 할당의 비트 표."
prev_url: "/studies/operating-systems/disk-scheduling-ladder/"
prev_title: "디스크 스케줄링 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/file-allocation-inode-ladder/"
---
{% raw %}
사용 개념: [UNIX 아이노드](/Hongs_Blog/studies/operating-systems/unix-inode/)의 최대 크기 $$(d + n + n^2 + n^3) \times B$$와 [파일 할당](/Hongs_Blog/studies/operating-systems/file-allocation/)의 비트 표.

이 방법을 떠올리는 신호는 "블록 크기", "포인터 크기", "직접 포인터 몇 개"가 주어지는 문제다. 풀이는 같은 하위목표로 나뉜다. 포인터 블록 하나에 든 포인터 수 $$n = B/p$$ 구하기, 단계별 블록 수 $$d$$, $$n$$, $$n^2$$, $$n^3$$ 구하기, 블록 크기를 곱하기, 더하기다[^s1].

## 문제 1 · 완전한 풀이

블록 4 KB, 포인터 8바이트, 직접 12개. 최대 파일 크기는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *포인터 수:* $$n = 4096 / 8 = 512$$.
2. *단계별 블록 수:* 직접 12, 단일 512, 이중 $$512^2 = 262{,}144$$, 삼중 $$512^3 = 134{,}217{,}728$$.
3. *크기:* 48 KB, 2 MB, 1 GB, 512 GB.
4. *합:* 약 513 GB.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

블록 1 KB, 포인터 4바이트, 직접 10개.

1. *포인터 수:* $$n = 1024 / 4 = 256$$.
2. *단계별 블록 수:* 10, 256, 65,536, 16,777,216.
3. *크기:* 10 KB, 256 KB, 64 MB, 16 GB.
4. *합:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

약 16 GB (정확히는 16 GB + 64 MB + 266 KB).

</details>


## 문제 3 · 하위목표 절반이 빈칸

블록 2 KB, 포인터 4바이트, 직접 12개. 파일 크기가 10 MB일 때, 이 파일은 어느 단계까지 포인터를 쓰는가?

1. *포인터 수:* ______
2. *파일의 블록 수:* 10 MB / 2 KB = 5,120블록.
3. *단계별 누적:* ______
4. *판단:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. $$n = 2048 / 4 = 512$$.
3. 직접까지 12, 단일까지 12 + 512 = 524, 이중까지 524 + 262,144.
4. 5,120은 524보다 크고 262,668보다 작으므로 이중 간접까지 쓴다.

</details>


## 문제 4 · 독립 문제

디스크 512 GB, 블록 4 KB. (1) 비트 표의 크기는? (2) 블록 16개짜리 디스크에서 2, 3, 7, 11, 12번이 쓰일 때 비트 표를 0번부터 쓰고, 최초 적합 연속 할당으로 3블록 파일 두 개를 넣은 뒤의 비트 표를 쓰라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(1) 블록 $$2^{39}/2^{12} = 2^{27}$$개, 비트 표 $$2^{27}/8 = 2^{24}$$바이트 = 16 MB.<br>
(2) 처음: 0011000100011000. 4~6과 8~10을 채우면 0011111111111000.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1·2의 크기, 문제 3의 범위, 문제 4의 비트 표 — [61_inode_verify.py](/Hongs_Blog/studies/operating-systems/code/61_inode_verify/), [60_file-allocation_impl.py](/Hongs_Blog/studies/operating-systems/code/60_file-allocation_impl/)</div>

</div>


[^s1]: 에이전트 보충. 문제 1은 Stallings 6판 12.7절의 FreeBSD 예다. 문제 2~4는 원본 범위 밖의 변형 문제다.
{% endraw %}
