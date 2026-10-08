---
layout: "note"
title: "페이징"
display_title: "페이징 (Paging)"
kind: "concept"
kind_label: "기법"
num: "36"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Paging", "페이지", "Page", "프레임", "Frame", "페이지 표", "Page Table", "빈 프레임 목록", "Free Frame List", "페이지 번호", "오프셋", "Offset"]
description: "페이징은 메모리와 프로세스를 모두 같은 크기의 작은 조각으로 잘라, 프로세스의 조각을 메모리의 빈 조각 아무 곳에나 넣는 방법이다. 책을 낱장으로 뜯어 빈 서랍 아무 데나 넣고, 몇 쪽이 몇 번 서랍에 있는지 적은 목차를 들고 다니는 것과 같다. 연속된 덩어리가 필요 없으니 외부 …"
prev_url: "/studies/operating-systems/buddy-system/"
prev_title: "버디 시스템"
next_url: "/studies/operating-systems/segmentation/"
next_title: "세그먼테이션"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/paging/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

페이징은 메모리와 프로세스를 모두 같은 크기의 작은 조각으로 잘라, 프로세스의 조각을 메모리의 빈 조각 아무 곳에나 넣는 방법이다. 책을 낱장으로 뜯어 빈 서랍 아무 데나 넣고, 몇 쪽이 몇 번 서랍에 있는지 적은 목차를 들고 다니는 것과 같다. 연속된 덩어리가 필요 없으니 외부 단편화가 없고, 낭비는 프로세스 마지막 조각의 빈 부분뿐이다. 대신 프로세스마다 목차(페이지 표)가 필요하고, 메모리에 접근할 때마다 목차를 거쳐 주소를 바꿔야 한다.

</div>


## 예시로 보기

메모리를 프레임 15개(0~14)로 나눴다. 프로세스 A(4페이지), B(3페이지), C(4페이지)를 차례로 싣고, B를 내보낸 뒤 D(5페이지)를 싣는다[^1].

| 프레임 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A, B, C 실은 뒤 | A.0 | A.1 | A.2 | A.3 | B.0 | B.1 | B.2 | C.0 | C.1 | C.2 | C.3 | | | | |
| B 내보낸 뒤 D 실음 | A.0 | A.1 | A.2 | A.3 | **D.0** | **D.1** | **D.2** | C.0 | C.1 | C.2 | C.3 | **D.3** | **D.4** | | |

D는 연속된 빈칸이 5개 없는데도 들어간다. 4, 5, 6과 11, 12로 나뉘어 들어갈 뿐이다[^2]. 이때 페이지 표는 다음과 같다[^3].

| 프로세스 | 페이지 → 프레임 |
|---|---|
| A | 0→0, 1→1, 2→2, 3→3 |
| B | 메모리에 없음 |
| C | 0→7, 1→8, 2→9, 3→10 |
| D | 0→4, 1→5, 2→6, 3→11, 4→12 |
| 빈 프레임 목록 | 13, 14 |

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

주기억장치를 같은 크기의 작은 조각으로 나누고, 각 프로세스도 같은 크기의 조각으로 나눈다. 프로세스의 조각을 **페이지**, 메모리의 조각을 **프레임**이라고 부른다. 운영체제는 프로세스마다 **페이지 표**를 두고, 각 페이지가 들어 있는 프레임 번호를 적는다. 프로그램 안의 주소는 페이지 번호와 페이지 안 위치(오프셋)로 이루어진다[^4].

</div>


**주소 변환.** 페이지 크기를 2의 거듭제곱 $$2^d$$로 정하면 변환이 간단하다[^s1].

1. 논리 주소의 오른쪽 $$d$$비트가 오프셋, 나머지 왼쪽 비트가 페이지 번호다.
2. 페이지 표에서 그 페이지의 프레임 번호를 찾는다.
3. 프레임 번호 뒤에 오프셋을 그대로 붙이면 물리 주소다.

**기호로 쓰면.** 논리 주소 $$\ell$$(엘), 페이지 크기 $$2^d$$, 페이지 표 $$PT$$에 대해 페이지 번호 $$p = \lfloor \ell / 2^d \rfloor$$, 오프셋 $$o = \ell \bmod 2^d$$, 물리 주소 $$= PT[p] \cdot 2^d + o$$이다.

16비트 주소, 페이지 1 K($$2^{10}$$)의 예(Stallings 그림 7.11)[^s1]:

```
논리 주소 1502 = 000001 | 0111011110
                 페이지 1   오프셋 478
페이지 표: 1 → 6
물리 주소     = 000110 | 0111011110 = 6 × 1024 + 478 = 6622
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 그림 7.11의 1502 → 6622, 프로세스 D의 페이지 표, 카드와 예제 사다리의 모든 변환 — [36_paging_impl.py](/Hongs_Blog/studies/operating-systems/code/36_paging_impl/)</div>

</div>


<details markdown="1"><summary markdown="span">왜 페이지 크기를 2의 거듭제곱으로 하나</summary>


페이지 크기가 1,000처럼 2의 거듭제곱이 아니면, 페이지 번호와 오프셋을 구하려고 나눗셈과 나머지를 해야 한다. 하드웨어에서 나눗셈은 느리다. 2의 거듭제곱이면 주소의 비트를 잘라 앞부분과 뒷부분으로 나누기만 하면 되고, 물리 주소도 프레임 번호 비트 뒤에 오프셋 비트를 이어 붙이면 된다. 덧셈조차 필요 없다.

</details>

### 단순 분할과 비교

| | 고정 분할 | 동적 분할 | 페이징 |
|---|---|---|---|
| 조각 크기 | 고정, 큼 | 프로세스마다 다름 | 고정, 작음 |
| 연속 배치 | 필요 | 필요 | 필요 없음 |
| 내부 단편화 | 큼 | 없음 | 프로세스의 마지막 페이지에서만 조금 |
| 외부 단편화 | 있을 수 있음 | 큼 | 없음 |

페이징은 겉보기에 고정 분할과 비슷하다. 다른 점은 조각이 작고, 한 프로세스가 여러 조각을 차지하며, 그 조각들이 붙어 있지 않아도 된다는 것이다[^s1].

## 스스로 설명해 보기

1. 페이징에는 외부 단편화가 없다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   모든 빈 프레임은 같은 크기이고, 어떤 페이지든 어떤 빈 프레임에나 들어간다. 빈 프레임이 몇 개만 있으면 그만큼의 페이지를 넣을 수 있다. "합은 충분한데 연속이 아니라 못 넣는" 일이 없다.
   </details>
2. 내부 단편화는 프로세스마다 많아야 한 페이지 미만이다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   프로세스 크기를 페이지 크기로 나눈 나머지만큼이 마지막 페이지에서 남는다. 앞쪽 페이지들은 꽉 차 있다.
   </details>
3. 프로세스 전환 때 페이지 표 위치도 바꿔야 한다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   같은 논리 주소라도 프로세스마다 다른 프레임을 가리킨다. 새 프로세스의 페이지 표를 써야 그 프로세스의 메모리에 접근한다(프로세스 전환 6단계).
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  "연속으로 둬야 한다"는 제약을 버리고, 연속처럼 보이게 하는 일은 페이지 표와 주소 변환 하드웨어에 맡긴다.
  </details>
- 같은 생각을 쓰는 다른 곳은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  파일 시스템의 블록 할당. 파일을 같은 크기 블록으로 나눠 디스크 아무 곳에 두고, 어느 블록에 있는지 표(인덱스)로 적는다. 12장 파일 관리에서 다시 나온다.
  </details>

## 활용

- 지금의 거의 모든 운영체제(Windows, Linux, macOS)는 페이징을 쓴다. x86-64의 기본 페이지 크기는 4 KB다[^s1].
- 페이지 표가 메모리에 있으면 메모리 접근 한 번에 페이지 표 접근까지 두 번이 든다. 이를 줄이는 장치(TLB)는 8장에서 다룬다.
- 계산 연습: [페이징 주소 변환 예제 사다리](/Hongs_Blog/studies/operating-systems/paging-ladder/)

## 연결

- 선수: [메모리 분할](/Hongs_Blog/studies/operating-systems/memory-partitioning/), [메모리 관리의 요구 사항](/Hongs_Blog/studies/operating-systems/memory-management-requirements/)
- 길이가 다른 조각으로 나누는 쪽: [세그먼테이션](/Hongs_Blog/studies/operating-systems/segmentation/)
- 페이지를 디스크에도 둘 수 있게 넓힌 것: [가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"페이징에는 단편화가 전혀 없다"</div>

틀렸다. 외부 단편화가 없다는 말이 단편화 전체가 없다는 말로 들린다. 프로세스 크기가 페이지 크기의 배수가 아니면 마지막 페이지가 덜 차서 내부 단편화가 생긴다. 예: 페이지 4 KB에 프로세스 10 KB면 3페이지(12 KB)를 쓰고 2 KB가 남는다. 다만 프로세스당 한 페이지 미만이라 작다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 페이지, 프레임, 페이지 표를 각각 한 문장으로 정의하라.</summary>


**답:** 페이지: 프로세스를 같은 크기로 나눈 조각. 프레임: 주기억장치를 같은 크기로 나눈 조각. 페이지 표: 프로세스마다 하나, 각 페이지가 들어 있는 프레임 번호를 적은 표.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 16비트 논리 주소 0000 1001 0110 1100, 페이지 크기 1 K(오프셋 10비트)다. 페이지 표에서 2번 페이지는 프레임 5에 있다. 페이지 번호와 오프셋을 10진수로 쓰고, 물리 주소를 2진수와 10진수로 쓰라.</summary>


**답:** 앞 6비트 000010 = 페이지 2, 뒤 10비트 0101101100 = 364. 물리 주소 = 000101 0101101100 = 5 × 1024 + 364 = 5484.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 프로세스 D의 페이지 표(0→4, 1→5, 2→6, 3→11, 4→12)에서 페이지 크기를 100바이트로 단순화하자. 논리 주소 340의 물리 주소는?</summary>


**답:** 340 = 3 × 100 + 40이므로 3번 페이지, 오프셋 40. 3번 페이지는 프레임 11이므로 물리 주소 11 × 100 + 40 = 1140.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 같은 크기 고정 분할과 페이징은 둘 다 메모리를 같은 크기로 자른다. 결정적인 차이 두 가지는?</summary>


**답:** ① 고정 분할은 프로세스 하나가 구역 하나에 통째로 들어가지만, 페이징은 프로세스가 여러 프레임에 흩어져 들어간다. ② 그래서 고정 분할은 구역이 커야 하고 내부 단편화가 크지만, 페이징은 조각이 작아 낭비가 마지막 페이지뿐이다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/07.chap7 (Stony Brook).pdf, p.30~31 (그림 7.9)
[^2]: 같은 자료, p.31 "Not Contiguous!!"
[^3]: 같은 자료, p.32 (그림 7.10)
[^4]: 같은 자료, p.29
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 Stony Brook 대학 CSE306의 공개 슬라이드(Stallings 교재 기반)를 원본으로 썼다. 주소 변환 단계와 식, 1502 → 6622 예(Stallings 6판 그림 7.11), 2의 거듭제곱 이유, 분할과의 비교표, x86-64 페이지 크기, 확인 문제 C2~C4는 교재 7.3절을 바탕으로 보탰다.
{% endraw %}
