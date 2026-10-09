---
layout: "note"
title: "메모리 분할"
display_title: "메모리 분할 (Memory Partitioning)"
kind: "concept"
kind_label: "기법"
num: "34"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Memory Partitioning", "고정 분할", "Fixed Partitioning", "동적 분할", "Dynamic Partitioning", "내부 단편화", "Internal Fragmentation", "외부 단편화", "External Fragmentation", "압축", "Compaction", "최적 적합", "Best-fit", "최초 적합", "First-fit", "다음 적합", "Next-fit", "배치 알고리즘", "Placement Algorithm"]
description: "메모리를 프로세스들에게 나눠 주는 가장 단순한 방법은 덩어리로 자르는 것이다. 미리 정해진 크기로 잘라 두면(고정 분할) 단순하지만, 작은 프로그램도 큰 칸 하나를 다 차지해 칸 안에 빈 공간이 생긴다(내부 단편화). 필요한 만큼 딱 잘라 주면(동적 분할) 칸 안 낭비는 없지만, …"
prev_url: "/studies/operating-systems/memory-management-requirements/"
prev_title: "메모리 관리의 요구 사항"
next_url: "/studies/operating-systems/buddy-system/"
next_title: "버디 시스템"
math: false
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/memory-partitioning/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메모리를 프로세스들에게 나눠 주는 가장 단순한 방법은 덩어리로 자르는 것이다. 미리 정해진 크기로 잘라 두면(고정 분할) 단순하지만, 작은 프로그램도 큰 칸 하나를 다 차지해 칸 안에 빈 공간이 생긴다(내부 단편화). 필요한 만큼 딱 잘라 주면(동적 분할) 칸 안 낭비는 없지만, 프로세스가 들고 나며 칸 사이에 자잘한 빈 틈이 생긴다(외부 단편화). 틈을 모으려면 프로세스를 옮겨 붙이는(압축) 비싼 일을 해야 한다.

</div>


## 예시로 보기

메모리 1 MB 중 운영체제가 128 K를 쓰고 896 K가 남았다. 동적 분할로 프로세스를 넣고 빼 보자[^1].

| 단계 | 일 | 메모리 모습 (운영체제 다음부터) |
|---|---|---|
| a | 처음 | 빈칸 896K |
| b~d | P1(320K), P2(224K), P3(288K)를 차례로 넣음 | P1 320 · P2 224 · P3 288 · 빈칸 64 |
| e | P2를 디스크로 내보냄 | P1 320 · 빈칸 224 · P3 288 · 빈칸 64 |
| f | P4(128K)를 P2 자리에 넣음 | P1 320 · P4 128 · 빈칸 96 · P3 288 · 빈칸 64 |
| g | P1을 내보냄 | 빈칸 320 · P4 128 · 빈칸 96 · P3 288 · 빈칸 64 |
| h | P2(224K)를 P1 자리에 다시 넣음 | P2 224 · 빈칸 96 · P4 128 · 빈칸 96 · P3 288 · 빈칸 64 |

```
 한 글자 = 16K, 점(.)으로 채운 칸 = 빈칸, 숫자 = 크기(K)
(d) |OS 128 |P1 320             |P2 224       |P3 288           |64.|
(e) |OS 128 |P1 320             |224..........|P3 288           |64.|
(f) |OS 128 |P1 320             |P4 128 |96...|P3 288           |64.|
(g) |OS 128 |320................|P4 128 |96...|P3 288           |64.|
(h) |OS 128 |P2 224       |96...|P4 128 |96...|P3 288           |64.|
```

칸 길이는 크기에 비례한다. 프로세스가 빠진 자리에 더 작은 프로세스가 들어갈 때마다 남는 조각이 생기고, (h)에서는 빈칸 세 개가 서로 떨어져 있다[^s2].

마지막에 빈칸은 96 + 96 + 64 = 256 K나 되지만, 가장 큰 덩어리가 96 K라서 128 K짜리 프로세스도 못 들어간다. 이것이 외부 단편화다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 구멍 크기와 합 256K, 배치 알고리즘 예와 카드 C3 — [34_partitioning_verify.py](/Hongs_Blog/studies/operating-systems/code/34_partitioning_verify/)</div>

</div>


## 정확히 말하면

### 고정 분할

메모리를 경계가 고정된 구역으로 나눈다[^2].

| 방식 | 내용 | 문제 |
|---|---|---|
| 같은 크기 | 구역 크기 이하인 프로세스는 아무 빈 구역에나 들어간다. 다 차면 운영체제가 하나를 디스크로 내보낸다 | 구역보다 큰 프로그램은 프로그래머가 오버레이로 짜야 한다. 아무리 작은 프로그램도 구역 하나를 통째로 쓴다 → **내부 단편화**[^3] |
| 다른 크기 | 예: 2, 4, 6, 8, 8, 8, 12 MB로 나눈다 | 같은 크기보다 낭비가 줄지만 여전히 있다[^4] |

**배치.** 같은 크기면 어느 구역이든 상관없다. 다른 크기면 들어갈 수 있는 가장 작은 구역에 넣는다[^5].

- 구역마다 큐를 두면 구역 안 낭비는 가장 적다. 하지만 작은 구역의 큐는 길게 밀려 있는데 큰 구역은 비어 놀 수 있다.
- 큐를 하나만 두고, 프로세스를 실을 때 지금 비어 있는 구역 중 가장 작은 맞는 것을 고르면 놀리는 구역이 줄어든다[^6].

고정 분할의 문제를 정리하면, 구역 수가 미리 정해져 동시에 돌릴 프로세스 수가 묶이고, 내부 단편화가 생기고, 프로세스가 커지거나 줄어드는 것을 다루기 어렵다[^7].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 표현 차이</div>

원문: 슬라이드 p.11 "External fragmentation: some partitions might be too small for some jobs, even though the sum of the partition sizes might be large enough" / 문제점: Stallings 6판(7.2절)은 고정 분할의 낭비를 **내부** 단편화로, 동적 분할에서 생기는 구멍을 **외부** 단편화로 구별한다. 슬라이드는 "빈 구역들의 합은 충분한데 각 구역이 작아 못 들어감"을 고정 분할에서도 외부 단편화라고 불렀다 / 이 문서의 기준: 교재의 구별을 따르되, 고정 분할에서도 그런 상황이 생길 수 있다는 슬라이드의 지적은 맞다 / 근거: 같은 자료 p.12는 고정 분할의 문제로 외부·내부 단편화를 모두 적었다

</div>


### 동적 분할

구역의 길이와 개수를 정해 두지 않는다. 프로세스에게 필요한 만큼만 정확히 준다. 시간이 지나면 메모리에 구멍이 생긴다. 이것이 **외부 단편화**다. 운영체제는 **압축**으로 프로세스들을 한쪽으로 몰아 빈 공간을 한 덩어리로 만든다[^8]. 압축에는 프로세서 시간이 들고, 프로세스를 옮길 수 있어야 하므로 실행 중 재배치가 필요하다[^s1].

### 배치 알고리즘

운영체제는 어느 빈 블록을 줄지 정해야 한다[^9].

| 알고리즘 | 고르는 블록 | 특징 |
|---|---|---|
| 최적 적합 (best-fit) | 요청 크기에 가장 가까운 블록 | 빈 블록 목록 전체를 봐야 하고, 아주 작은 조각을 남겨 압축을 더 자주 해야 한다. 전체 성능은 가장 나쁘다 |
| 최초 적합 (first-fit) | 메모리 앞에서부터 처음 맞는 블록 | 가장 빠르다. 다만 메모리 앞쪽에 프로세스가 몰려, 빈 블록을 찾을 때마다 그 부분을 지나야 한다 |
| 다음 적합 (next-fit) | 마지막으로 놓은 곳 다음부터 처음 맞는 블록 | 메모리 끝의 가장 큰 블록에 자주 놓아 큰 블록이 잘게 쪼개진다. 큰 블록을 다시 얻으려면 압축이 필요하다 |

슬라이드의 예: 16 K를 넣는다. 빈 블록이 앞에서부터 8, 12, 22, 18, 8, 6, 36 K이고, 마지막으로 놓은 곳은 36 K 블록 바로 앞이다[^10].

| 알고리즘 | 고른 블록 | 남는 조각 |
|---|---|---|
| 최초 적합 | 22 K | 6 K |
| 최적 적합 | 18 K | 2 K |
| 다음 적합 | 36 K | 20 K |

## 스스로 설명해 보기

1. 같은 크기 고정 분할에서 1 MB 프로그램이 8 MB 구역에 들어가면 7 MB가 낭비된다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   구역 경계가 고정되어 있어서 남은 7 MB를 다른 프로세스에게 쪼개 줄 수 없다. 낭비가 구역 **안**에 있으므로 내부 단편화다.
   </details>
2. 동적 분할 예에서 256 K가 비었는데 128 K를 못 넣는다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   프로세스는 연속된 한 덩어리를 받아야 한다. 빈 공간이 96, 96, 64로 흩어져 있고 어느 하나도 128 이상이 아니다. 낭비가 할당된 구역 **밖**에 있으므로 외부 단편화다.
   </details>
3. 최적 적합이 오히려 성능이 나쁘다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   요청에 가장 가까운 블록을 고르면 남는 조각이 가장 작다. 그런 조각은 너무 작아 거의 아무것도 못 넣는 쓰레기 구멍이 되고, 이것이 쌓여 압축을 자주 하게 된다. 게다가 매번 목록 전체를 봐야 한다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  연속된 덩어리로 나눠 주는 한, 고정 크기면 칸 안에, 가변 크기면 칸 사이에 낭비가 생긴다. 이 둘을 맞바꾸는 것이 분할 방식의 선택이다.
  </details>
- 이 문제를 근본적으로 피하는 방법은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  프로세스를 연속된 한 덩어리로 두지 않는 것. 작은 같은 크기 조각으로 나눠 아무 곳에나 두는 [페이징](/Hongs_Blog/studies/operating-systems/paging/)이다.
  </details>

## 활용

- C의 `malloc` 같은 메모리 할당기도 빈 블록 목록에서 최초 적합이나 최적 적합 비슷한 방법으로 고른다[^s1].
- 압축은 자바 같은 언어의 가비지 컬렉터가 객체를 한쪽으로 모으는 것과 같은 일이다[^s1].

## 연결

- 선수: [메모리 관리의 요구 사항](/Hongs_Blog/studies/operating-systems/memory-management-requirements/)
- 두 방식의 절충: [버디 시스템](/Hongs_Blog/studies/operating-systems/buddy-system/)
- 연속 할당을 버린 방법: [페이징](/Hongs_Blog/studies/operating-systems/paging/), [세그먼테이션](/Hongs_Blog/studies/operating-systems/segmentation/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"최적 적합이 낭비가 가장 적으니 가장 좋다"</div>

틀렸다. 이름의 "최적"과 "남는 조각이 가장 작다"는 점이 그렇게 보이게 한다. 하지만 그 작은 조각들이 쓸모없는 구멍으로 쌓여 압축이 잦아지고, 매번 목록 전체를 훑어야 한다. 슬라이드는 최적 적합을 전체 성능이 가장 나쁜 방법으로, 최초 적합을 가장 빠른 방법으로 적었다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 다음 낭비는 내부 단편화인가 외부 단편화인가? ① 10 MB 고정 구역에 3 MB 프로세스 ② 동적 분할에서 빈 구멍 5 MB, 3 MB, 4 MB가 흩어져 있어 8 MB 프로세스를 못 넣음</summary>


**답:** ① 내부 단편화(할당된 구역 안의 낭비) ② 외부 단편화(할당된 구역 사이의 흩어진 빈 공간).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 압축을 하려면 실행 중 재배치가 가능해야 하는 이유는?</summary>


**답:** 압축은 이미 실행 중인 프로세스를 다른 주소로 옮긴다. 프로세스 코드 속 주소가 실을 때 고정된 절대 주소라면, 옮긴 뒤 모든 참조가 엉뚱한 곳을 가리킨다. 기준 레지스터처럼 실행할 때 주소를 바꾸는 장치가 있어야 기준값만 고쳐 옮길 수 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 빈 블록이 앞에서부터 10, 4, 20, 18, 7, 9, 12, 15 K다. 12K, 10K, 9K 요청이 차례로 온다. 최초 적합과 최적 적합은 각각 어느 블록을 고르는가?</summary>


**답:** 최초 적합: 20K(남는 8K), 10K, 18K. 최적 적합: 12K, 10K, 9K.<br>
**이유:** 최초 적합의 세 번째 요청 9K 때 블록은 0, 4, 8, 18, …이라 처음 맞는 것이 18K다.

</details>

[^1]: 운영체제 7회 강의 자료 「chap7 (Stony Brook)」, p.17~19 (그림 7.4)
[^2]: 같은 자료, p.9
[^3]: 같은 자료, p.9~10
[^4]: 같은 자료, p.11
[^5]: 같은 자료, p.13
[^6]: 같은 자료, p.14~15 (그림 7.3)
[^7]: 같은 자료, p.12
[^8]: 같은 자료, p.16
[^9]: 같은 자료, p.20~22
[^10]: 같은 자료, p.23 (그림 7.5)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 장은 교수 자료가 없어 Stony Brook 대학 CSE306의 공개 슬라이드(Stallings 교재 기반)를 원본으로 썼다. 압축에 재배치가 필요하다는 설명, malloc·가비지 컬렉터 연결, 확인 문제는 Stallings 6판 7.2절을 바탕으로 보탰다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 다이어그램 1개는 원본에 없다. "예시로 보기" 표의 (d)~(h) 단계(p.17~19, 그림 7.4)를 크기에 비례한 메모리 막대로 옮겼다.
{% endraw %}
