---
layout: "note"
title: "은행원 알고리즘 예제 사다리"
display_title: "은행원 알고리즘 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "30"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
description: "사용 개념: 교착상태 회피의 안전 검사 \"Ci - Ai \\le 가용이면 끝내고 Ai를 돌려받는다\"."
prev_url: "/studies/operating-systems/multiprogramming-ladder/"
prev_title: "다중 프로그래밍 예제 사다리"
next_url: "/studies/operating-systems/paging-ladder/"
next_title: "페이징 주소 변환 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/bankers-ladder/"
---
{% raw %}
사용 개념: [교착상태 회피](/Hongs_Blog/studies/operating-systems/deadlock-avoidance/)의 안전 검사 "$$C_i - A_i \le$$ 가용이면 끝내고 $$A_i$$를 돌려받는다".

이 방법을 떠올리는 신호는 최대 요구(Claim)·할당(Allocation)·가용(Available) 표가 함께 주어지고 "안전한가", "이 요청을 들어주는가"를 묻는 문제다. 풀이는 늘 같은 하위목표로 나뉜다. 가용 벡터 구하기, 더 필요한 양 $$C - A$$ 구하기, 끝낼 수 있는 프로세스를 하나씩 찾아 자원 돌려받기, 모두 끝났는지 판단하기다. 요청 문제는 그 앞에 "요청을 임시로 반영하기"가 붙는다[^s1].

## 문제 1 · 완전한 풀이

그림 6.7a 상태가 안전한가? 최대 요구는 P1 (3,2,2), P2 (6,1,3), P3 (3,1,4), P4 (4,2,2), 할당은 P1 (1,0,0), P2 (6,1,2), P3 (2,1,1), P4 (0,0,2), 자원 총량은 (9,3,6)이다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *가용 구하기:* 할당을 열마다 더하면 R1 = 1 + 6 + 2 + 0 = 9, R2 = 0 + 1 + 1 + 0 = 2, R3 = 0 + 2 + 1 + 2 = 5. 가용 = (9,3,6) − (9,2,5) = (0,1,1).
2. *더 필요한 양:* P1 (2,2,2), P2 (0,0,1), P3 (1,0,3), P4 (4,2,0).
3. *하나씩 끝내기:* P2 (0,0,1) ≤ (0,1,1) → 가용 (6,2,3). P1 (2,2,2) ≤ (6,2,3) → (7,2,3). P3 (1,0,3) ≤ (7,2,3) → (9,3,4). P4 (4,2,0) ≤ (9,3,4) → (9,3,6).
4. *판단:* 모두 끝났으므로 안전. 순서 P2 → P1 → P3 → P4.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

자원 A, B, C의 총량은 (10, 5, 7)이다. 프로세스 다섯의 상태가 다음과 같다. 안전한가?

| | 최대 요구 | 할당 |
|---|---|---|
| P1 | 7 5 3 | 0 1 0 |
| P2 | 3 2 2 | 2 0 0 |
| P3 | 9 0 2 | 3 0 2 |
| P4 | 2 2 2 | 2 1 1 |
| P5 | 4 3 3 | 0 0 2 |

1. *가용 구하기:* 할당 합 (7, 2, 5). 가용 = (3, 3, 2).
2. *더 필요한 양:* P1 (7,4,3), P2 (1,2,2), P3 (6,0,0), P4 (0,1,1), P5 (4,3,1).
3. *하나씩 끝내기:* P2 → (5,3,2). P4 → (7,4,3). P5 → (7,4,5). P1 → (7,5,5). P3 → (10,5,7).
4. *판단:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

모두 끝났으므로 안전하다. 안전 순서 P2 → P4 → P5 → P1 → P3. 다른 순서도 있을 수 있다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

문제 2의 상태에서 P2가 (1, 0, 2)를 더 요청한다. 들어주는가?

1. *요청이 최대를 넘지 않는지:* 할당 (2,0,0) + (1,0,2) = (3,0,2) ≤ 최대 (3,2,2). 넘지 않는다.
2. *요청이 가용 안인지:* ______
3. *임시로 반영:* ______
4. *안전 검사:* 더 필요한 양 P1 (7,4,3), P2 (0,2,0), P3 (6,0,0), P4 (0,1,1), P5 (4,3,1)로 하나씩 끝낸다.
5. *판단:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. (1,0,2) ≤ 가용 (3,3,2). 안이다.
3. P2 할당 (3,0,2), 가용 (2,3,0).
5. P2 → (5,3,2), P4 → (7,4,3), P5 → (7,4,5), P1 → (7,5,5), P3 → (10,5,7). 모두 끝나므로 안전. 들어준다.

</details>


## 문제 4 · 독립 문제

문제 3의 요청을 들어준 뒤의 상태에서 (1) P1이 (0, 2, 0)을 요청한다. (2) 대신 P5가 (3, 3, 0)을 요청한다. 각각 들어주는가? 거절한다면 이유가 같은가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(1) 가용 (2,3,0)에서 줄 수는 있다. 주면 가용 (2,1,0), P1 할당 (0,3,0). 더 필요한 양 P1 (7,2,3), P2 (0,2,0), P3 (6,0,0), P4 (0,1,1), P5 (4,3,1) 중 가용 이하인 것이 없다. 불안전이라 거절한다.<br>
(2) 요청 (3,3,0)의 A가 가용 2보다 크다. 안전 검사 전에, 지금 자원이 없어 기다린다.<br>
이유가 다르다. (1)은 "주면 위험해서", (2)는 "줄 것이 없어서" 기다린다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 판정과 안전 순서 — [30_bankers-algorithm_impl.py](/Hongs_Blog/studies/operating-systems/code/30_bankers-algorithm_impl/)</div>

</div>


[^s1]: 에이전트 보충. 문제 1은 원본 그림 6.7의 수치다. 문제 2~4의 상태는 Silberschatz, Galvin & Gagne, *Operating System Concepts*의 은행원 알고리즘 예제와 같은 수치를 쓰고, 요청은 바꿨다.
{% endraw %}
