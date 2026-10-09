---
layout: "note"
title: "그리디"
display_title: "그리디 (Greedy)"
kind: "concept"
kind_label: "기법"
num: "22"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Greedy", "Greedy Algorithm", "탐욕법", "탐욕 알고리즘", "욕심쟁이 방법", "교환 논증", "회의실 배정"]
description: "갈림길마다 지금 가장 좋아 보이는 길을 고르고, 한 번 고른 것은 되돌리지 않는 방법이다. 정렬 한 번과 반복 한 번으로 끝나서 빠르고 코드도 짧다. 문제는 지금 좋아 보이는 선택이 나중에 손해가 되는 경우가 많다는 것이다. 그래서 \"이렇게 골라도 손해가 없다\"는 이유를 댈 수 있…"
prev_url: "/studies/algorithms/parametric-search/"
prev_title: "매개변수 탐색"
next_url: "/studies/algorithms/graph-representation/"
next_title: "그래프 표현"
math: true
mermaid: false
code_count: 2
permalink: "/studies/algorithms/greedy/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

갈림길마다 지금 가장 좋아 보이는 길을 고르고, 한 번 고른 것은 되돌리지 않는 방법이다. 정렬 한 번과 반복 한 번으로 끝나서 빠르고 코드도 짧다. 문제는 지금 좋아 보이는 선택이 나중에 손해가 되는 경우가 많다는 것이다. 그래서 "이렇게 골라도 손해가 없다"는 이유를 댈 수 있을 때만 믿는다.

</div>


## 예시로 보기

### 맞는 경우: 회의실 배정

회의실 하나에 회의 8개가 신청되었다. 겹치지 않게 가장 많은 회의를 넣는다. 한 회의가 끝나는 시각에 다음 회의를 바로 시작해도 된다.

| 회의 | A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| 시작 ~ 끝 | 1 ~ 4 | 3 ~ 5 | 0 ~ 6 | 5 ~ 7 | 3 ~ 8 | 5 ~ 9 | 6 ~ 10 | 8 ~ 11 |

**가장 먼저 끝나는 회의부터** 본다. 앞서 넣은 회의와 겹치지 않으면 넣는다.

1. A(4에 끝남)를 넣는다. 이제 4 이후에 시작하는 회의만 된다.
2. B(3 시작), C(0 시작)는 겹친다. D(5 ~ 7)를 넣는다.
3. E, F, G는 7 전에 시작해서 겹친다. H(8 ~ 11)를 넣는다.

A, D, H로 3개다. 모든 조합을 다 봐도 3개가 최대다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/algorithms/22_greedy_fig1.svg" alt="그림" width="466" height="320" loading="lazy">

그림의 회의는 위에서부터 끝나는 시각 순이고, 파란 막대가 고른 A, D, H다. 점선은 앞서 고른 회의가 끝나는 시각이다. 그 점선보다 먼저 시작하는 회색 막대는 모두 건너뛴다[^s1].

```python
def max_meetings(meetings):
    count, end = 0, float("-inf")
    for s, e in sorted(meetings, key=lambda m: m[1]):   # 끝나는 시각 순
        if s >= end:            # 앞 회의가 끝난 뒤에 시작하면 넣는다
            count += 1
            end = e
    return count
```

### 틀리는 경우: 기준을 잘못 고르면

"가장 먼저 **시작하는** 회의부터"는 그럴듯하지만 틀린다. 회의가 (0 ~ 10), (1 ~ 2), (3 ~ 4)면 0 ~ 10을 먼저 넣어 1개로 끝난다. 실제로는 (1 ~ 2), (3 ~ 4) 두 개를 넣을 수 있다.

동전도 마찬가지다. 1원, 3원, 4원 동전으로 6원을 가장 적은 개수로 내려고 큰 동전부터 쓰면 4 + 1 + 1로 3개다. 3 + 3이면 2개다[^1].

## 맞는 이유를 보이는 법: 바꿔치기

그리디가 맞다는 것은 흔히 **바꿔치기(교환 논증)**로 보인다. "가장 좋은 답이 무엇이든, 그 답의 첫 선택을 그리디의 선택으로 바꿔도 손해가 없다"를 보이는 것이다.

회의실 배정에 써 본다. 가장 먼저 끝나는 회의를 g라 하자. 가장 많은 회의를 넣은 어떤 답 O가 있고, O에서 가장 먼저 끝나는 회의를 o라 하자.

- g는 모든 회의 중 가장 먼저 끝나니, o보다 늦게 끝나지 않는다.
- O에서 o 다음 회의들은 모두 o가 끝난 뒤에 시작한다. 그러니 g가 끝난 뒤에도 시작한다.
- 그래서 O에서 o를 g로 바꿔도 겹치지 않고, 회의 수는 그대로다.

즉 g를 넣는 가장 좋은 답이 반드시 있다. g를 넣은 뒤 남는 문제("g가 끝난 뒤 시작하는 회의들에서 가장 많이 넣기")도 같은 모양이라, 같은 논리를 되풀이하면(수학적 귀납법) 그리디 전체가 가장 좋은 답을 낸다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 회의 8개에서 그리디가 A, D, H를 고르고 최대가 3임, 무작위 회의 묶음 1,500개에서 끝나는 시각 순 그리디가 모든 조합을 보는 방법과 같은 개수를 내는 것, "먼저 시작", "짧은 것", "겹침이 적은 것" 기준이 틀리는 예, 1·3·4원 동전의 반례, 10·50·100·500원 동전은 1만 원까지 그리디가 늘 최소 개수를 내는 것을 확인했다 — [22_greedy_verify.py](/Hongs_Blog/studies/algorithms/code/22_greedy_verify/)</div>

</div>


## 활용

- **비용:** 대개 정렬 $$O(n \log n)$$ + 한 번 훑기 $$O(n)$$이다.
- **알아보는 신호:** 정렬하면 "가장 ~한 것부터 처리"라는 자연스러운 순서가 보인다. 작은 예를 손으로 풀었을 때 되돌아갈 일이 없다.
- **쓰기 전 점검:** 기준을 정했으면 반례를 찾아본다. 작은 입력에서 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)과 무작위로 비교하는 것이 가장 확실하다. 다만 무작위 비교도 반례를 놓칠 수 있다. 무작위로 만든 입력 가운데 반례의 비율이 $$p$$이고 입력을 서로 독립으로 만들면, $$N$$번 안에 반례를 하나도 못 만날 확률은 $$(1 - p)^N$$이다. $$p = 0.001$$이면 1,500번 비교해도 반례를 못 만날 확률이 약 22%다([기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/)의 꼬리 확률). 반례가 나오면 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)을 생각한다.
- **판정 함수로 쓰기:** [매개변수 탐색](/Hongs_Blog/studies/algorithms/parametric-search/)의 "x면 되나?"는 흔히 "앞에서부터 욕심껏 채우기"로 판정한다.
- **사전 순으로 가장 앞선 답:** 앞자리부터 가장 작은 글자를 고르되, 그 글자를 골라도 끝까지 답을 만들 수 있는지 확인한다. 사전 순은 앞 글자부터 정해지니 앞에서 고른 것을 되돌릴 필요가 없다. [미로 탈출 명령어](/Hongs_Blog/studies/algorithms/pg150365/)가 이 모양이다.
- **실제 쓰임:** 거스름돈 계산, 허프만 부호화[^2], 최소 신장 트리(크루스칼·프림), 다익스트라 최단 경로가 모두 그리디다. 뒤의 셋은 [최소 신장 트리](/Hongs_Blog/studies/algorithms/mst/)와 [다익스트라](/Hongs_Blog/studies/algorithms/dijkstra/)에서 다룬다. 허프만 부호화는 확률이 가장 작은 두 묶음을 하나로 합치는 일을 하나가 남을 때까지 되풀이한다. 이렇게 만든 부호는 접두어 부호(어떤 부호도 다른 부호의 앞부분이 아닌 부호) 가운데 평균 길이가 가장 짧다[^2]. 그 평균 길이는 엔트로피 이상, 엔트로피 + 1비트 미만이다([엔트로피](/Hongs_Blog/studies/probability-statistics/entropy/)).

## 연결

- 선수: [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)
- 맞는지 확인할 때는 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)과 비교한다. 그리디가 틀리는 문제는 흔히 동적 계획법으로 푼다.
- 맞다는 근거: [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)
- 그리디 기준이 틀렸다는 것은 반례 하나로 보이지만, 맞다는 것은 맞는 예를 아무리 모아도 보이지 않는다. [추론 규칙과 증명 방법](/Hongs_Blog/studies/discrete-math/proof-methods/)은 이 차이를 $$n = 0$$부터 39까지 모두 소수인데 $$n = 40$$에서 깨지는 $$n^2 + n + 41$$로 보여 준다.
- 연습: [미로 탈출 명령어](/Hongs_Blog/studies/algorithms/pg150365/), [1,2,3 떨어트리기](/Hongs_Blog/studies/algorithms/pg150364/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"예시 몇 개에서 맞으면 그리디가 맞다"</div>

틀렸다. 그리디는 기준이 조금만 달라도 맞다가 틀린다. 회의실 배정에서 "먼저 시작하는 것", "짧은 것", "다른 회의와 덜 겹치는 것"은 모두 그럴듯하고 작은 예에서는 맞기도 하지만, 셋 다 틀리는 입력이 있다. "먼저 끝나는 것"만 늘 맞는다. 예시에서 맞는 것은 틀리는 입력을 아직 못 만난 것일 뿐이다. 확인하려면 바꿔치기로 증명하거나, 작은 입력 수천 개에서 완전탐색과 비교해 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 동전이 1원, 3원, 4원일 때 "큰 동전부터 최대한 쓰기"가 가장 적은 개수를 내지 못하는 금액과, 그때 그리디와 실제 최소 개수는?</summary>

**답:** 6원. 그리디는 4 + 1 + 1로 3개, 실제 최소는 3 + 3으로 2개다. 4원을 쓰는 순간 남은 2원을 1원 두 개로 내야 해서 손해가 난다. 우리나라 동전(10, 50, 100, 500원)은 큰 동전이 작은 동전의 배수라 이런 일이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 회의실 배정에서 "가장 먼저 끝나는 회의를 넣어도 손해가 없는" 까닭을 설명하라.</summary>

**답:** 가장 좋은 답의 첫 회의 o를 가장 먼저 끝나는 회의 g로 바꿔 보면 된다. g는 o보다 늦게 끝나지 않으니, o 뒤의 회의들은 g와도 겹치지 않는다. 바꿔도 회의 수는 그대로라, g를 넣는 가장 좋은 답이 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "가장 짧은 회의부터 넣기"가 틀리는 회의 세 개를 만들어라.</summary>

**답:** (0 ~ 5), (4 ~ 6), (5 ~ 10). 가장 짧은 4 ~ 6을 먼저 넣으면 나머지 둘과 모두 겹쳐 1개다. 실제로는 (0 ~ 5), (5 ~ 10) 두 개를 넣을 수 있다. 짧은 회의가 긴 회의 두 개의 경계에 걸쳐 있으면 둘 다 막는다.

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 6.1 "Coin problem": 동전 {1, 3, 4}로 6을 만들 때 그리디는 4 + 1 + 1, 최적은 3 + 3이다.
[^2]: 같은 책 6.2 "Scheduling"(가장 먼저 끝나는 일부터 고르면 최적), Cormen 외, *Introduction to Algorithms* 3판, 16.1절 "An activity-selection problem"(같은 문제의 증명), 16.3절 "Huffman codes"(허프만 부호화도 그리디이고, 만든 부호는 최적 접두어 부호다).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [22_greedy_plot.py](/Hongs_Blog/studies/algorithms/code/22_greedy_plot/)로 그렸고, 그리디가 A, D, H를 고른다는 것과 모든 조합을 봐도 최대가 3이라는 것을 같은 코드로 확인했다.
{% endraw %}
