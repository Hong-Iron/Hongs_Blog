---
layout: "note"
title: "집합 연관 캐시"
display_title: "집합 연관 캐시 (Set-Associative Cache)"
kind: "concept"
kind_label: "자료구조"
num: "37"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Set-Associative Cache", "N-way Set-Associative", "집합 연관 사상", "완전 연관 캐시", "Fully Associative Cache", "연관도", "Associativity", "집합", "Set", "웨이", "Way"]
description: "메모리의 덩어리마다 들어갈 수 있는 자리를 한 곳이 아니라 몇 곳 묶음으로 정해 주는 방식이다. 사물함을 두 칸씩 짝지어 놓고, 학번 끝자리로 짝을 정한 뒤 그 짝의 두 칸 중 아무 데나 쓰게 하는 것과 같다. 같은 묶음을 쓰는 덩어리 둘이 서로를 쫓아내지 않고 함께 머문다. 대신…"
prev_url: "/studies/computer-architecture/direct-mapped-cache/"
prev_title: "직접 사상 캐시"
next_url: "/studies/computer-architecture/direct-vs-associative-cache/"
next_title: "직접 사상과 집합 연관 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/set-associative-cache/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메모리의 덩어리마다 들어갈 수 있는 자리를 한 곳이 아니라 몇 곳 묶음으로 정해 주는 방식이다. 사물함을 두 칸씩 짝지어 놓고, 학번 끝자리로 짝을 정한 뒤 그 짝의 두 칸 중 아무 데나 쓰게 하는 것과 같다. 같은 묶음을 쓰는 덩어리 둘이 서로를 쫓아내지 않고 함께 머문다. 대신 묶음 안의 자리를 한꺼번에 다 들여다봐야 해서 회로가 늘고, 자리가 다 찼을 때 누구를 내보낼지도 정해야 한다.

</div>


## 예시로 보기

[직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)에서는 줄 하나를 두고 두 블록이 번갈아 쫓겨났다. 다른 줄이 비어 있어도 소용없었다. 자리를 고를 자유가 조금만 있어도 이 일은 사라진다.

블록 4개가 들어가는 캐시를 세 가지로 짠다. 블록은 4바이트다.

```
 직접 사상            2-way 집합 연관          완전 연관
 (줄 4개, 자리 1개씩)   (집합 2개, 자리 2개씩)    (집합 1개, 자리 4개)

 줄 0 [    ]          집합 0 [    ][    ]       [    ][    ][    ][    ]
 줄 1 [    ]          집합 1 [    ][    ]
 줄 2 [    ]
 줄 3 [    ]
```

블록 번호 1, 5, 1, 5, 9, 1, 5, 9를 차례로 읽는다.

- **직접 사상.** 줄 번호는 블록 번호를 4로 나눈 나머지다. 1, 5, 9는 모두 1번 줄이다. 읽을 때마다 앞의 블록을 쫓아내서 8번 모두 실패한다.
- **2-way.** 집합 번호는 블록 번호를 2로 나눈 나머지다. 셋 다 1번 집합이지만 자리가 둘이다. 자리가 다 차면 가장 오래 안 쓴 것을 내보낸다.

| 순서 | 블록 | 태그 | 결과 | 1번 집합 (오래 안 쓴 것 → 방금 쓴 것) |
|---|---|---|---|---|
| 1 | 1 | 0 | 실패 | 0 |
| 2 | 5 | 2 | 실패 | 0, 2 |
| 3 | 1 | 0 | 적중 | 2, 0 |
| 4 | 5 | 2 | 적중 | 0, 2 |
| 5 | 9 | 4 | 실패 | 태그 0을 내보낸다 → 2, 4 |
| 6 | 1 | 0 | 실패 | 태그 2를 내보낸다 → 4, 0 |
| 7 | 5 | 2 | 실패 | 태그 4를 내보낸다 → 0, 2 |
| 8 | 9 | 4 | 실패 | 태그 0을 내보낸다 → 2, 4 |

- **완전 연관.** 어느 블록이든 네 자리 중 아무 데나 들어간다. 1, 5, 9를 처음 읽을 때만 실패한다.

| | 직접 사상 | 2-way | 완전 연관 |
|---|---|---|---|
| 실패 (8번 중) | 8 | 6 | 3 |

세 캐시의 크기는 똑같다. 자리를 고를 자유가 클수록 실패가 준다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적과 실패 수, 비트 수 표, 직접 사상과 완전 연관이 n-way의 양 끝이라는 것(따로 짠 단순 흉내와 무작위 접근 300회 × 20번 일치), 오해 항목의 7/9·6/9·0/9, 카드 C2·C3 — [37_set-associative-cache_impl.py](/Hongs_Blog/studies/computer-architecture/code/37_set-associative-cache_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

캐시의 줄을 $$n$$개씩 묶은 것을 집합이라 부른다. 블록은 블록 번호를 집합 수로 나눈 나머지가 가리키는 집합 하나로만 가지만, 그 집합 안에서는 $$n$$개 자리 중 어디에나 들어갈 수 있다. 이것이 $$n$$-way 집합 연관 캐시다. 찾을 때는 그 집합의 태그 $$n$$개를 동시에 비교한다[^1].

</div>


집합 안의 자리 하나하나를 way라 부른다. $$n$$을 연관도라고도 한다.

**기호로 쓰면.** 주소 $$m$$비트, 블록 $$2^b$$바이트, 전체 줄 수 $$N$$, 연관도 $$n$$일 때

$$\text{집합 수 } S = \frac{N}{n}, \qquad \text{인덱스 비트 수} = \log_2 S, \qquad \text{태그 비트 수} = m - \log_2 S - b$$


$$\text{인덱스} = \text{블록 번호} \bmod S, \qquad \text{태그} = \left\lfloor \frac{\text{블록 번호}}{S} \right\rfloor$$


직접 사상과 다른 것은 "줄 수" 자리에 "집합 수"가 들어간다는 점 하나다. 오프셋은 블록 크기만으로 정해지므로 그대로다.

캐시 데이터 크기는 세 수의 곱이다[^2].

$$\text{데이터 바이트 수} = \underbrace{n}_{\text{way 수}} \times \underbrace{S}_{\text{집합 수}} \times \underbrace{2^b}_{\text{블록 바이트 수}}$$


**양 끝.**

- $$n = 1$$이면 집합마다 자리가 하나다. 이것이 직접 사상이다.
- $$n = N$$이면 집합이 하나뿐이다. 인덱스가 0비트라 주소에서 오프셋을 뺀 전부가 태그다. 이것이 **완전 연관**(fully associative) 캐시다. 찾을 때 모든 줄의 태그를 한꺼번에 비교한다[^3].

```
 n-way 집합 연관에서 주소 자르기
+----------------------------+-----------------+------------+
|  태그 (m - log2 S - b)      | 인덱스 (log2 S)  | 오프셋 (b)  |
+----------------------------+-----------------+------------+
           |                         |
           |                         v
           |             집합 하나를 고른다
           v
   그 집합의 태그 n개와 동시에 비교한다  --> 하나라도 같고 유효하면 적중
```

### way 수를 바꾸면 비트 수가 어떻게 바뀌나

캐시 크기와 블록 크기를 그대로 두고 way 수를 두 배로 하면, 집합 수가 반이 된다. 그래서 인덱스가 1비트 줄고 태그가 1비트 는다[^2].

데이터 64 KiB, 블록 32바이트, 주소 32비트(줄 2,048개)에서 계산한 표다. 줄마다 유효 1비트 + 태그 + 데이터 256비트를 센다.

| way 수 | 집합 수 | 태그 | 인덱스 | 오프셋 | 전체 비트 수 |
|---|---|---|---|---|---|
| 1 (직접 사상) | 2,048 | 16 | 11 | 5 | 559,104 |
| 2 | 1,024 | 17 | 10 | 5 | 561,152 |
| 4 | 512 | 18 | 9 | 5 | 563,200 |
| 8 | 256 | 19 | 8 | 5 | 565,248 |
| 2,048 (완전 연관) | 1 | 27 | 0 | 5 | 581,632 |

비트 수는 조금밖에 늘지 않는다. 비싼 것은 비트가 아니라 비교 회로와 시간이다.

### 연산과 비용

| | 직접 사상 | $$n$$-way | 완전 연관 |
|---|---|---|---|
| 한 번 찾을 때 비교하는 태그 | 1개 | $$n$$개를 동시에 | 모든 줄을 동시에 |
| 비교 회로 | 1개 | $$n$$개 | 줄 수만큼 |
| 데이터 고르기 | 필요 없다 | 적중한 way의 데이터를 고르는 선택 회로 | 같다 |
| 실패 때 내보낼 블록 | 고를 것이 없다 | 집합 안 $$n$$개 중에서 고른다 | 전체에서 고른다 |

$$n$$-way에서는 어느 way가 맞았는지 알아야 데이터를 고를 수 있다. 그래서 태그 비교가 끝난 뒤에야 데이터가 나온다. 직접 사상보다 적중 시간이 조금 길어진다[^4].

**늘 지켜야 하는 것(불변식).** 한 집합 안에 유효한 줄 둘이 같은 태그를 가지는 일은 없다. 유효한 줄에 태그 $$t$$가 적혀 있고 그 줄이 집합 $$s$$에 있으면, 데이터는 블록 번호 $$t \cdot S + s$$의 사본이다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 캐시 크기와 블록 크기가 같을 때 way 수를 두 배로 하면 인덱스가 1비트 줄고 태그가 1비트 는다.</summary>

전체 줄 수는 그대로인데 한 집합의 줄이 두 배가 되므로 집합 수가 반이 된다. 인덱스 비트 수는 $$\log_2$$(집합 수)라서 1 준다. 주소 비트 수와 오프셋은 그대로이므로 줄어든 1비트는 태그로 넘어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 완전 연관 캐시에는 인덱스가 없다.</summary>

집합이 하나뿐이라 고를 것이 없다. $$\log_2 1 = 0$$비트다. 블록이 어디에나 있을 수 있으니, 위치로는 아무것도 알 수 없고 블록 번호 전체를 태그로 적어 두어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 직접 사상에는 교체 규칙이 필요 없는데 집합 연관에는 필요하다.</summary>

직접 사상은 들어갈 자리가 하나라 그 자리에 있던 것이 나간다. 집합 연관은 자리가 여럿이라, 다 찼을 때 그중 누구를 내보낼지 정해야 한다. 잘못 고르면 곧 다시 쓸 블록을 내보낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 구조의 핵심 아이디어는?</summary>

"찾기 쉽게 자리를 정해 둔다"와 "아무 데나 넣게 해서 다툼을 없앤다" 사이의 중간을 고른다. 주소로 묶음까지만 정하고, 묶음 안에서는 자유롭게 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

[TLB](/Hongs_Blog/studies/operating-systems/tlb/). 칸 수가 적어서 모든 칸을 동시에 비교하는 완전 연관으로 흔히 만든다. 해시 테이블에서 한 칸에 항목을 몇 개까지 담는 버킷도 같은 생각이다.

</details>


## 활용

- 직접 사상에서 2-way로 갈 때 실패율이 가장 크게 준다. CS61C 기반 강의 슬라이드는 20% 넘게 준다고 적는다. way를 더 늘릴수록 얻는 것이 작아진다[^5].
- 완전 연관은 줄 수만큼 비교 회로가 필요해서 큰 캐시에는 못 쓴다. 칸 수가 적은 TLB 같은 작은 구조에 쓴다.
- 다 찼을 때 누구를 내보낼지: [캐시 교체 정책](/Hongs_Blog/studies/computer-architecture/cache-replacement/)
- 흔한 실수: 인덱스 비트 수를 $$\log_2$$(줄 수)로 구한다. 집합 연관에서는 $$\log_2$$(집합 수)다. 먼저 줄 수를 way 수로 나눈다.
- 추적 연습: [캐시 적중과 실패 추적 예제 사다리](/Hongs_Blog/studies/computer-architecture/cache-tracing-ladder/)

## 연결

- 선수: [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)
- 어느 쪽을 고를지: [직접 사상과 집합 연관 비교](/Hongs_Blog/studies/computer-architecture/direct-vs-associative-cache/)
- 실패를 종류별로 가르는 법: [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)
- 여러 입력 중 하나를 고르는 회로: [멀티플렉서와 디코더](/Hongs_Blog/studies/computer-architecture/mux-decoder/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"way 수를 늘리면 실패는 반드시 줄거나 그대로다"</div>

틀렸다. 자리를 고를 자유가 늘어나니 나빠질 리 없어 보인다. 하지만 누구를 내보낼지는 미래를 모르고 정한다. 8줄짜리 캐시(블록 4바이트)에 블록 0, 1, 2, …, 8의 아홉 개를 차례로 되풀이해 읽으면, 한 바퀴 9번 중 직접 사상은 7번, 2-way는 6번 적중하고, 완전 연관은 한 번도 적중하지 못한다(가장 오래 안 쓴 것을 내보낼 때). 직접 사상에서는 블록 0과 8만 서로 다투고 나머지 7개는 제자리에 남는다. 완전 연관에서는 아홉 번째 블록이 들어올 때마다 바로 다음에 쓸 블록이 나간다[^6]. 이런 접근은 드물어서 보통은 way가 많을수록 실패가 준다. "보통"이지 "반드시"가 아니다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$n$$-way 집합 연관 캐시에서 블록이 갈 집합과 태그를 구하는 식을 쓰고, $$n = 1$$일 때와 $$n$$이 전체 줄 수와 같을 때를 각각 무엇이라 부르는지 쓰라.</summary>

**답:** 집합 수 $$S$$ = 줄 수 ÷ $$n$$. 집합 번호 = 블록 번호 mod $$S$$, 태그 = 블록 번호 ÷ $$S$$의 몫. $$n = 1$$이면 직접 사상, $$n$$ = 줄 수면 완전 연관(집합 1개, 인덱스 0비트)이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 데이터 16 KiB, 4-way, 블록 16바이트, 주소 32비트인 캐시의 집합 수, 태그·인덱스·오프셋 비트 수, 전체 비트 수(유효 비트 포함)를 구하라.</summary>

**답:** 줄 수 = $$16{,}384 \div 16 = 1{,}024$$. 집합 수 = $$1{,}024 \div 4 = 256$$. 오프셋 4, 인덱스 8, 태그 20비트. 줄 하나는 $$1 + 20 + 128 = 149$$비트, 전체는 $$1{,}024 \times 149 = 152{,}576$$비트.<br>
**흔한 오답:** 인덱스를 $$\log_2 1{,}024 = 10$$비트로 잡는 것. 인덱스는 줄이 아니라 집합을 고른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 집합 4개, 2-way, 블록 4바이트, 주소 8비트인 빈 캐시에 0x10, 0x30, 0x12, 0x50, 0x10을 차례로 읽는다. 가장 오래 안 쓴 것을 내보낸다. 접근마다 적중 여부를 쓰고, 0x50이 내보내는 태그를 쓰라.</summary>

**답:** 오프셋 2, 인덱스 2, 태그 4비트다. 다섯 주소 모두 0번 집합이고 태그는 1, 3, 1, 5, 1이다. 실패, 실패, 적중, 실패, 적중. 0x50이 들어올 때 집합에는 태그 3(오래됨)과 1(방금 씀)이 있어서 태그 3을 내보낸다.<br>
**이유:** 세 번째 접근이 태그 1을 다시 써서 "방금 쓴 것"으로 만들었다. 그 덕에 마지막 0x10이 적중한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 크기가 같은 직접 사상 캐시보다 완전 연관 캐시(가장 오래 안 쓴 것을 내보냄)가 더 많이 실패하는 접근 순서를 만들라. 캐시는 블록 4개가 들어간다.</summary>

**답:** 블록 0, 1, 2, 3, 4를 차례로 되풀이한다. 직접 사상에서는 블록 0과 4만 0번 줄을 두고 다투고 1, 2, 3은 늘 적중한다(한 바퀴 5번 중 3번 적중). 완전 연관에서는 다섯 번째 블록이 들어올 때마다 다음에 쓸 블록이 나가서 한 번도 적중하지 못한다.

</details>


[^1]: MIT 6.004 Computation Structures, Fall 2023, L13 "Caches", 슬라이드 15~16 (N-way Set-Associative Cache: 주소는 한 집합으로만 가고 그 안의 어느 way에나 들어간다, 모든 way의 태그를 동시에 검사), https://shd.mit.edu/2024/lectures/readings/6191-fall2023/L13.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy"
[^2]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2022, "Caches Part II", 슬라이드 7~8 (연관도를 두 배 하면 인덱스 1비트 감소·태그 1비트 증가, C = N × S × B), https://robotics.shanghaitech.edu.cn/courses/ca/22s/lectures/2022-CA-L17_Caches_II.pdf
[^3]: MIT 6.004, Fall 2023, L13, 슬라이드 14 (Fully-Associative Cache: 인덱스가 없고 모든 항목의 태그를 동시에 비교)
[^4]: ShanghaiTech CS 110, 2022, "Caches Part II", 슬라이드 24 (Costs of Set-Associative Caches: 비교기 N개, 선택 회로 지연)
[^5]: 같은 자료, 슬라이드 26 (Benefits of Set-Associative Caches: 직접 사상에서 2-way로 갈 때 이득이 가장 크다)
[^6]: MIT 6.004, Fall 2023, L13, 슬라이드 24 (Example 2: Comparing Hit Rates, 9개 주소를 되풀이할 때 직접 사상 7/9, 2-way 6/9, 완전 연관 0%). 수치는 흉내기로 다시 확인했다.
{% endraw %}
