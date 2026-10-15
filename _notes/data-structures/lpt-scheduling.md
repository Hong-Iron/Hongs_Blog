---
layout: "note"
title: "LPT 스케줄링"
display_title: "LPT 스케줄링 (Longest Processing Time First)"
kind: "concept"
kind_label: "알고리즘"
num: "29"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["LPT", "Longest Processing Time first", "LPT Schedule", "Machine Scheduling", "기계 스케줄링", "최소 종료 시각 스케줄링", "Minimum Finish Time Scheduling", "휴리스틱", "Heuristic", "NP-hard"]
description: "똑같은 기계 여러 대에 작업들을 나눠 맡겨 마지막 작업이 끝나는 시각을 앞당기려 할 때, 오래 걸리는 작업부터 골라 그때 가장 먼저 비는 기계에 맡기는 방법이다. 작업을 한 번 정렬하고 \"가장 먼저 비는 기계 찾기\"만 되풀이하면 되어 빠르다. 가장 좋은 일정을 늘 주지는 않지만, …"
prev_url: "/studies/data-structures/heap-sort/"
prev_title: "우선순위 큐 정렬과 힙 정렬"
next_url: "/studies/data-structures/bst-search-insert/"
next_title: "이진 탐색 트리의 탐색과 삽입"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/lpt-scheduling/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

똑같은 기계 여러 대에 작업들을 나눠 맡겨 마지막 작업이 끝나는 시각을 앞당기려 할 때, 오래 걸리는 작업부터 골라 그때 가장 먼저 비는 기계에 맡기는 방법이다. 작업을 한 번 정렬하고 "가장 먼저 비는 기계 찾기"만 되풀이하면 되어 빠르다. 가장 좋은 일정을 늘 주지는 않지만, 가장 좋은 일정보다 3분의 1 넘게 늦어지는 일은 없다. 가장 좋은 일정을 정확히 찾는 빠른 방법은 알려져 있지 않다.

</div>


## 예시로 보기

똑같은 기계 $$m$$대가 있고 작업 $$n$$개가 있다. 작업마다 걸리는 시간이 정해져 있고, 한 기계는 한 번에 한 작업만 한다. 작업을 기계에 나눠 맡겨서 마지막 작업이 끝나는 시각을 가장 이르게 하고 싶다.

기계 3대, 작업 7개, 걸리는 시간이 6, 2, 3, 5, 10, 7, 14라고 하자. 아무렇게나 맡긴 일정 하나를 보면 A가 6과 7, B가 2와 5와 14, C가 3과 10을 맡아 A는 13, B는 21, C는 13에 끝난다. 전체가 끝나는 시각은 21이다.

맡기는 방법은 $$3^7 = 2{,}187$$가지다. 작업이 20개면 $$3^{20}$$, 약 35억 가지라 다 해 볼 수 없다. LPT는 규칙 하나로 한 번에 맡긴다.

- 걸리는 시간이 긴 작업부터 차례로 본다: 14, 10, 7, 6, 5, 3, 2.
- 작업마다 그때 가장 먼저 비는 기계에 맡긴다.

| 작업 | 맡은 기계 | A가 끝나는 시각 | B | C |
|---|---|---|---|---|
| 14 | A | 14 | 0 | 0 |
| 10 | B | 14 | 10 | 0 |
| 7 | C | 14 | 10 | 7 |
| 6 | C | 14 | 10 | 13 |
| 5 | B | 14 | 15 | 13 |
| 3 | C | 14 | 15 | 16 |
| 2 | A | 16 | 15 | 16 |

전체가 16에 끝난다. 작업 시간을 다 더하면 47이고 기계가 3대라, 아무리 잘 나눠도 $$47 / 3 \approx 15.7$$보다 이를 수 없다. 시각이 정수이니 16이 가장 좋은 값이고, 이 예에서는 LPT가 가장 좋은 일정을 찾았다[^s1].

## 알고리즘

**입력:** 작업 시간 $$t_1, \dots, t_n$$(양수)과 기계 수 $$m \ge 1$$.
**결과:** 작업마다 맡을 기계. 그리고 전체가 끝나는 시각.

1. 작업을 걸리는 시간이 긴 것부터 정렬한다.
2. 기계마다 "지금까지 맡은 일이 끝나는 시각"을 0으로 둔다.
3. 작업을 차례로 꺼내, 끝나는 시각이 가장 이른 기계에 맡기고 그 기계의 끝나는 시각에 작업 시간을 더한다.

3단계의 "끝나는 시각이 가장 이른 기계"를 찾는 데 [최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)으로 만든 최소 우선순위 큐를 쓴다. 큐에는 기계마다 (끝나는 시각, 기계 번호)를 넣는다.

```python
import heapq

def lpt(times, m):
    heap = [(0, k) for k in range(m)]            # 처음에는 모든 기계가 시각 0에 빈다
    heapq.heapify(heap)
    jobs = [[] for _ in range(m)]
    for t in sorted(times, reverse=True):         # 긴 작업부터
        finish, k = heapq.heappop(heap)           # 가장 먼저 비는 기계
        jobs[k].append(t)
        heapq.heappush(heap, (finish + t, k))     # 끝나는 시각을 고쳐 다시 넣는다
    return max(f for f, _ in heap), jobs
```

파이썬의 `heapq`는 최소 힙이다([힙과 우선순위 큐](/Hongs_Blog/studies/algorithms/heap/)). 끝나는 시각이 같으면 번호가 작은 기계가 먼저 나온다.

**비용.**

| 하는 일 | 큐 없이 | 최소 우선순위 큐로 |
|---|---|---|
| 작업 정렬 | $$O(n \log n)$$ | $$O(n \log n)$$ |
| 작업 하나를 맡길 기계 찾기 | 기계 $$m$$대를 다 훑는다: $$O(m)$$ | 꺼내기 한 번과 넣기 한 번: $$O(\log m)$$ |
| 작업 $$n$$개 맡기기 | $$O(mn)$$ | $$O(n \log m)$$ |
| 모두 합쳐 | $$O(n \log n + mn)$$ | $$O(n \log n + n \log m) = O(n \log(mn))$$ |

마지막 등식은 $$\log n + \log m = \log(mn)$$에서 나온다. 기계가 3대면 차이가 없지만, 기계가 1,000대면 작업마다 1,000번 훑는 것과 10번쯤 일하는 것의 차이다.

## 얼마나 믿을 수 있는가

**LPT는 가장 좋은 일정을 보장하지 않는다**. 기계 2대에 작업 3, 3, 2, 2, 2를 맡겨 본다.

- LPT: 3은 A, 3은 B, 2는 A(5), 2는 B(5), 2는 A(7). 전체가 7에 끝난다.
- 가장 좋은 일정: A가 3과 3, B가 2와 2와 2. 둘 다 6에 끝난다.

LPT는 긴 작업 둘을 서로 다른 기계에 갈라놓는데, 여기서는 둘을 한 기계에 몰아야 딱 맞는다[^s1].

**그래도 크게 틀리지는 않는다.** 기계가 $$m$$대일 때, LPT 일정이 끝나는 시각을 가장 좋은 일정이 끝나는 시각으로 나눈 값은 $$\frac{4}{3} - \frac{1}{3m}$$을 넘지 않는다.

$$\frac{\text{LPT 일정이 끝나는 시각}}{\text{가장 좋은 일정이 끝나는 시각}} \le \frac{4}{3} - \frac{1}{3m}$$


[증명 생략: Graham 1969][^s3]. 기계가 2대면 이 한계는 $$\frac43 - \frac16 = \frac76 \approx 1.17$$이다. 위의 예가 $$7/6$$으로 한계에 딱 닿는다. 기계가 아무리 많아도 한계는 $$\frac43$$보다 작다. 보통은 한계보다 훨씬 가깝다. 작은 무작위 입력 3,000개로 실험했을 때 LPT가 가장 좋은 일정을 놓친 것은 210개였고, 가장 나빴던 비율이 약 1.13이었다[^s1].

**왜 정확한 방법을 쓰지 않는가.** 끝나는 시각이 가장 이른 일정을 찾는 문제는 NP-hard다. NP-hard는 입력 크기 $$n$$의 거듭제곱($$n^2$$, $$n^3$$ 같은 $$n^k$$) 안에 정답을 내는 방법을 아무도 찾지 못한 문제들의 모임이고, 그런 방법이 있을 것 같지 않다고들 본다. 이것은 쉽게 줄인 설명이고, 정확한 정의는 계산 이론에서 따로 정한다. 실제 문제 수천 가지가 여기에 든다. 그래서 정답 대신 정답에 가까운 답을 빨리 내는 방법(휴리스틱)을 만들어 쓴다. LPT는 이 문제의 좋은 휴리스틱이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시에서 위 표와 끝나는 시각 16, 모든 맡기는 방법 2,187가지 가운데 가장 이른 시각도 16임을 확인했다. 작은 무작위 입력 3,000개(기계 1 ~ 4대, 작업 8개 이하)에서 큐를 쓴 판과 다 훑는 판이 같은 답을 내고, LPT의 답이 전수로 구한 최적 이상이며 최적의 $$\frac43 - \frac1{3m}$$배 이하였다. 3, 3, 2, 2, 2와 같은 꼴의 입력이 기계 2, 3, 4대에서 한계에 정확히 닿는 것, 카드의 값도 확인했다 — [29_lpt-scheduling_verify.py](/Hongs_Blog/studies/data-structures/code/29_lpt-scheduling_verify/)</div>

</div>


## 활용

- **우선순위 큐가 꼭 맞는 자리.** "여럿 가운데 가장 작은 것을 꺼내고, 값을 고쳐 다시 넣기"를 되풀이하는 일이다. 값 하나만 바뀌는데 매번 전부 다시 정렬하면 낭비다.
- **그리디의 한 예.** 그때그때 가장 좋아 보이는 선택(가장 먼저 비는 기계)을 하고 되돌리지 않는다. 가장 좋은 답을 보장하지 못하는 그리디도 "얼마나 나쁠 수 있는지"를 알면 쓸 수 있다: [그리디](/Hongs_Blog/studies/algorithms/greedy/).
- **운영체제의 스케줄링과는 다른 문제다.** 여기서는 작업이 모두 처음부터 주어지고 중간에 끊지 않으며, 줄이려는 것이 마지막 작업이 끝나는 시각 하나다. 프로세스가 계속 들어오고 기다린 시간을 따지는 스케줄링은 [스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/)에 있다.
- **흔한 실수.** 작업을 정렬하지 않고 받은 차례대로 맡긴다(카드 C3). 최소 우선순위 큐가 필요한데 최대 힙을 쓴다. 한계 $$\frac43 - \frac1{3m}$$을 "LPT는 늘 이만큼 늦다"로 읽는다. 한계는 가장 나쁠 때의 값이다.

## 연결

- 선수: [최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)(최소 우선순위 큐)
- 작업 정렬: [우선순위 큐 정렬과 힙 정렬](/Hongs_Blog/studies/data-structures/heap-sort/)
- 모든 경우를 다 해 보는 방법과 그 한계: [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 기계 2대(A, B)에 작업 4, 3, 7, 5, 3, 4를 LPT로 맡겨라. 작업마다 맡는 기계와 전체가 끝나는 시각을 쓰라. 끝나는 시각이 같으면 A에 맡긴다. 가장 좋은 일정과 같은가?</summary>

**답:** 긴 것부터 7, 5, 4, 4, 3, 3이다. 7은 A(7), 5는 B(5), 4는 B(9), 4는 A(11), 3은 B(12), 3은 A(14). 전체가 14에 끝난다. 가장 좋은 일정은 A가 7, 3, 3이고 B가 5, 4, 4로 둘 다 13에 끝난다. LPT가 1만큼 늦다.<br>
**이유:** 작업 시간의 합이 26이라 13보다 이를 수는 없다. $$14/13 \approx 1.08$$은 기계 2대의 한계 $$7/6 \approx 1.17$$ 안이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `lpt` 함수의 `for` 고리가 한 바퀴 돌 때 우선순위 큐에 하는 일을 한 문장으로 쓰라.</summary>

**답:** 끝나는 시각이 가장 이른 기계를 큐에서 꺼내 이번 작업을 맡기고, 그 기계의 끝나는 시각에 작업 시간을 더한 값을 다시 큐에 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 작업을 긴 것부터 맡기는 까닭을, 기계 2대와 작업 1, 1, 2로 설명하라.</summary>

**답:** 받은 차례(1, 1, 2)대로 맡기면 1은 A, 1은 B, 2는 A로 가서 3에 끝난다. 긴 것부터(2, 1, 1) 맡기면 2는 A, 1은 B, 1은 B로 가서 2에 끝난다. 긴 작업을 나중에 맡기면 이미 고르게 찬 기계 위에 통째로 얹혀 한쪽만 높아진다. 긴 것을 먼저 놓고 짧은 것으로 틈을 메우는 쪽이 고르게 찬다.<br>
**이유:** 그래도 늘 가장 좋은 답은 아니다. 3, 3, 2, 2, 2에서는 LPT가 7, 가장 좋은 일정이 6이다.

</details>


[^s1]: 검증 코드에서 전수 탐색과 비교해 확인했다.
[^s3]: 이 한계는 R. L. Graham, "Bounds on multiprocessing timing anomalies", *SIAM Journal on Applied Mathematics* 17(2), 1969의 결과다. 이 문서에서는 증명하지 않고 작은 입력에서 실험으로만 확인했다.
{% endraw %}
