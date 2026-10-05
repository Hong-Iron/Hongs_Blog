---
layout: "note"
title: "투 포인터와 슬라이딩 윈도"
display_title: "투 포인터와 슬라이딩 윈도 (Two Pointers and Sliding Window)"
kind: "concept"
kind_label: "기법"
num: "18"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-02"
status: "verified"
aliases: ["Two Pointers", "Sliding Window", "투 포인터", "두 포인터", "슬라이딩 윈도", "슬라이딩 윈도우", "구간 합"]
description: "두 손가락으로 줄을 짚고 한 방향으로만 옮겨 가며 답을 찾는 방법이다. 두 손가락이 뒤로 돌아가지 않으니, 모든 쌍을 다 보는 이중 반복(n²번)을 n번 남짓으로 줄인다. 다만 \"손가락을 옮기면 조건이 한쪽으로만 변한다\"는 성질이 있어야 쓸 수 있다. 음수가 섞인 구간 합처럼 이 …"
prev_url: "/studies/algorithms/recursion-backtracking/"
prev_title: "재귀와 백트래킹"
next_url: "/studies/algorithms/prefix-sum/"
next_title: "누적 합과 차분 배열"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/two-pointers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 손가락으로 줄을 짚고 한 방향으로만 옮겨 가며 답을 찾는 방법이다. 두 손가락이 뒤로 돌아가지 않으니, 모든 쌍을 다 보는 이중 반복(n²번)을 n번 남짓으로 줄인다. 다만 "손가락을 옮기면 조건이 한쪽으로만 변한다"는 성질이 있어야 쓸 수 있다. 음수가 섞인 구간 합처럼 이 성질이 깨지면 답을 놓친다.

</div>


## 예시로 보기

### 양 끝에서 좁혀 오기: 합이 target인 두 수

정렬된 [1, 3, 4, 6, 8, 11]에서 합이 10인 두 수를 찾는다. 왼쪽 손가락 L은 맨 앞, 오른쪽 손가락 R은 맨 끝에서 시작한다.

| L | R | 합 | 다음 |
|---|---|---|---|
| 1 | 11 | 12 | 크다 → R을 왼쪽으로 |
| 1 | 8 | 9 | 작다 → L을 오른쪽으로 |
| 3 | 8 | 11 | 크다 → R을 왼쪽으로 |
| 3 | 6 | 9 | 작다 → L을 오른쪽으로 |
| 4 | 6 | 10 | 찾았다 |

합이 크면 큰 쪽(R)을 줄이고, 작으면 작은 쪽(L)을 키운다. 정렬되어 있어서 이렇게 옮기면 합이 원하는 방향으로만 바뀐다.

### 창 밀기: 합이 S인 연속 구간

양수 [2, 1, 3, 2, 4]에서 합이 6인 연속 구간의 수를 센다. 오른쪽 끝을 하나씩 늘리고, 합이 넘치면 왼쪽 끝을 줄인다. 두 끝 사이가 "창"이다.

| 오른쪽 끝에 넣은 수 | 넘쳐서 왼쪽에서 뺀 수 | 창 | 합 | 6인가 |
|---|---|---|---|---|
| 2 | | [2] | 2 | |
| 1 | | [2, 1] | 3 | |
| 3 | | [2, 1, 3] | 6 | 예 (1개) |
| 2 | 2 | [1, 3, 2] | 6 | 예 (2개) |
| 4 | 1, 3 | [2, 4] | 6 | 예 (3개) |

답은 3이다. 창의 왼쪽 끝도 오른쪽 끝도 앞으로만 간다.

## 왜 빠르고, 언제 맞는가

- **빠른 이유:** 두 손가락이 각각 많아야 n번 움직인다. 그래서 전체가 $$O(n)$$이다. 모든 쌍을 보는 방법은 $$O(n^2)$$이다.
- **맞는 이유(창 밀기):** 모든 수가 양수면, 창을 오른쪽으로 늘리면 합이 커지고 왼쪽을 줄이면 합이 작아진다. 그래서 어떤 왼쪽 끝에서 합이 이미 넘쳤다면, 그 왼쪽 끝으로는 오른쪽을 더 늘려도 소용없다. 그 왼쪽 끝을 버려도(앞으로 옮겨도) 답을 놓치지 않는다[^1].
- **맞는 이유(양 끝 좁히기):** L + R이 너무 크면 R은 지금 L은 물론 L보다 큰 어떤 수와도 target을 만들 수 없다. 그래서 R을 버려도 된다. 작을 때 L을 버리는 것도 같은 이유다.

두 경우 모두 "옮기면 한쪽으로만 변한다"(단조성)가 핵심이다. 이 성질이 없으면 버린 쪽에 답이 남아 있을 수 있다.

```python
def count_windows(a, S):          # a는 모두 양수
    left, s, cnt = 0, 0, 0
    for right in range(len(a)):
        s += a[right]             # 오른쪽 끝을 늘린다
        while s > S:              # 넘치면 왼쪽 끝을 줄인다
            s -= a[left]
            left += 1
        if s == S:
            cnt += 1
    return cnt
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 예시와, 양 끝 좁히기·창 밀기를 모든 쌍·모든 구간을 보는 느린 방법과 무작위 3,000번 비교해 결과가 같았다. 음수가 섞이면 창 밀기가 틀리는 입력([4, −2, 1], S = 3)도 확인했다 — [18_two-pointers_verify.py](/Hongs_Blog/studies/algorithms/code/18_two-pointers_verify/)</div>

</div>


## 활용

- 알아보는 신호: "연속된 구간", "두 수의 합", "모든 종류를 포함하는 가장 짧은 구간", 그리고 n이 10만 이상이라 이중 반복이 안 될 때.
- 두 줄을 동시에 훑는 것(정렬된 두 리스트 합치기, 두 명단의 공통 찾기)도 같은 생각이다.
- 흔한 실수: 음수가 있는데 창 밀기를 쓴다(그때는 누적 합과 딕셔너리를 쓴다). 정렬되지 않은 배열에서 양 끝 좁히기를 쓴다.

## 연결

- 선수: [리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/), [시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/)
- 양 끝 좁히기는 [정렬](/Hongs_Blog/studies/algorithms/sorting/)이 먼저 필요하다. 모든 쌍을 보는 [완전탐색](/Hongs_Blog/studies/algorithms/brute-force/)을 줄인 것이다.
- 왼쪽 손가락의 이동을 모두 합쳐도 n을 넘지 않는 것은 [망원합](/Hongs_Blog/studies/college-math/sequences-sigma/)으로 셀 수 있다. 바퀴마다 옮긴 칸 수를 더하면 가운데 위치들이 서로 지워진다. "마지막 위치 − 처음 위치"만 남고, 이 값은 n 이하다.
- 연습: [두 큐 합 같게 만들기](/Hongs_Blog/studies/algorithms/pg118667/), [보석 쇼핑](/Hongs_Blog/studies/algorithms/pg67258/), [쿠키 구입](/Hongs_Blog/studies/algorithms/pg49995/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 양수 [1, 2, 3, 4, 5]에서 합이 9인 연속 구간을 창 밀기로 찾는다. 찾는 순간의 창은 무엇인가?</summary>

**답:** [2, 3, 4]. 오른쪽을 1, 2, 3, 4까지 늘리면 합이 10으로 넘쳐 왼쪽의 1을 빼 [2, 3, 4] = 9가 된다. 이어서 5를 넣으면 14라 2, 3을 빼 [4, 5] = 9도 찾는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 두 손가락을 쓰는데도 이중 반복이 아니라 $$O(n)$$인 까닭은? (안쪽 `while`이 있는데도)</summary>

**답:** 왼쪽 손가락은 전체를 통틀어 많아야 n번 움직인다. 안쪽 `while`이 한 번에 여러 칸 움직여도, 모든 바퀴를 합친 이동은 n을 넘지 않는다. 오른쪽 손가락도 n번이라 합쳐서 2n번 정도다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 음수가 있으면 창 밀기가 틀리는 예를 만들어라.</summary>

**답:** [4, −2, 1], S = 3. 합이 3인 구간은 [4, −2, 1] 하나다. 창 밀기는 4를 넣자마자 합이 3을 넘어 4를 버린다. 그 뒤로는 합이 −2, −1이라 3이 되지 않아 0을 돌려준다. 음수가 있으면 넘친 합이 나중에 다시 줄어들 수 있는데, 넘치는 순간 왼쪽을 버렸기 때문에 답을 놓친다.

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 8.1 "Two pointers method": 부분 배열 합 문제(양수 배열)와 2SUM 문제(정렬 후 양 끝에서 좁혀 오기)로 설명하고, 두 포인터가 각각 O(n)번만 움직여 전체가 O(n)임을 보인다.
{% endraw %}
