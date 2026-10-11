---
layout: "note"
title: "연결 리스트"
display_title: "연결 리스트 (Linked List)"
kind: "concept"
kind_label: "자료구조"
num: "13"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Linked List", "Doubly Linked List", "이중 연결 리스트", "연결 목록", "prev", "next"]
description: "손을 잡고 한 줄로 선 사람들처럼, 각 칸이 바로 앞과 바로 뒤 칸만 기억하는 줄이다. 가운데 한 명이 빠지면 양옆 사람이 서로 손을 잡으면 끝이라, 위치만 알면 지우기와 끼워 넣기가 한 번에 된다. 대신 \"앞에서 k번째\"를 찾으려면 맨 앞부터 k번 따라가야 한다. 파이썬 리스트는…"
prev_url: "/studies/algorithms/heap/"
prev_title: "힙과 우선순위 큐"
next_url: "/studies/algorithms/trie/"
next_title: "트라이"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/linked-list/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

손을 잡고 한 줄로 선 사람들처럼, 각 칸이 바로 앞과 바로 뒤 칸만 기억하는 줄이다. 가운데 한 명이 빠지면 양옆 사람이 서로 손을 잡으면 끝이라, 위치만 알면 지우기와 끼워 넣기가 한 번에 된다. 대신 "앞에서 k번째"를 찾으려면 맨 앞부터 k번 따라가야 한다. 파이썬 리스트는 거꾸로, k번째는 바로 찾지만 가운데를 지우면 뒤를 모두 한 칸씩 당긴다.

</div>


## 예시로 보기

0 ~ 4번 다섯 칸이 있다. 칸마다 앞 이웃 `prev`와 뒤 이웃 `next`를 적는다. 앞 이웃이 없으면 −1, 뒤 이웃이 없으면 5(칸 수)로 적는다.

| 일 | 바뀌는 곳 | 줄을 따라가면 |
|---|---|---|
| 처음 | prev = [−1, 0, 1, 2, 3], next = [1, 2, 3, 4, 5] | 0 → 1 → 2 → 3 → 4 |
| 2 지우기 | next[1] = 3, prev[3] = 1 | 0 → 1 → 3 → 4 |
| 3 지우기 | next[1] = 4, prev[4] = 1 | 0 → 1 → 4 |
| 되살리기(3) | next[1] = 3, prev[4] = 3 | 0 → 1 → 3 → 4 |
| 되살리기(2) | next[1] = 2, prev[3] = 2 | 0 → 1 → 2 → 3 → 4 |

지울 때 바꾸는 곳은 양옆 두 칸뿐이다. 지워진 칸 자신의 prev, next는 그대로 둔다. 그래서 2는 지워진 뒤에도 "내 앞은 1, 뒤는 3"을 기억한다. 되살릴 때는 이 기억대로 양옆이 다시 나를 가리키게 하면 된다.

```
처음
  [0] <-> [1] <-> [2] <-> [3] <-> [4]

2 지우기 뒤
          +---------------+
          |   next[1] = 3 v
  [0] <-> [1]            [3] <-> [4]
          ^   prev[3] = 1 |
          +---------------+
               [2]   prev[2] = 1, next[2] = 3 (그대로)
```

2를 지운 뒤 1과 3은 서로를 가리키고, 2는 줄에서 빠졌지만 1과 3을 가리키는 기억은 남아 있다[^s1].

되살리는 순서는 **지운 역순**이어야 한다. 가장 최근에 지운 것부터 되살리니, 지운 칸 번호를 [스택](/Hongs_Blog/studies/algorithms/stack/)에 쌓아 두고 꺼내 쓴다. 순서를 어기면 줄이 망가진다(확인 문제 C2).

```python
n = 5
prev = [i - 1 for i in range(n)]
nxt = [i + 1 for i in range(n)]
removed = []                          # 지운 순서를 쌓는 스택

def remove(x):
    p, q = prev[x], nxt[x]
    if p != -1: nxt[p] = q            # 앞 칸이 내 뒤를 가리킨다
    if q != n: prev[q] = p            # 뒤 칸이 내 앞을 가리킨다
    removed.append(x)                 # x의 prev, nxt는 그대로 둔다

def restore():
    x = removed.pop()                 # 가장 최근에 지운 칸
    p, q = prev[x], nxt[x]
    if p != -1: nxt[p] = x
    if q != n: prev[q] = x
    return x
```

`next`는 파이썬의 기본 함수 이름이라 리스트 이름을 `nxt`로 썼다.

## 규칙과 비용

지우기와 되살리기가 끝날 때마다 늘 지켜져야 하는 규칙(표현 불변식)이 하나 있다. **살아 있는 칸 x마다, 앞 칸의 next는 x이고 뒤 칸의 prev도 x다.** 이 규칙이 지켜지면 맨 앞에서 next만 따라가도 살아 있는 칸을 순서대로 모두 만난다[^1].

| 일 | 연결 리스트 | 파이썬 리스트 |
|---|---|---|
| 한 칸 앞·뒤로 가기 | $$O(1)$$ | $$O(1)$$ |
| k칸 앞·뒤로 가기 | $$O(k)$$ | $$O(1)$$ (번호에 k를 더한다) |
| 위치를 아는 칸 지우기·끼워 넣기 | $$O(1)$$ | $$O(n)$$ (뒤를 모두 당기거나 민다) |
| 방금 지운 칸 되살리기 | $$O(1)$$ | $$O(n)$$ |
| 앞에서 i번째 찾기 | $$O(i)$$ | $$O(1)$$ |

20만 칸에서 가운데 근처를 5만 번 지워 보니, 파이썬 리스트(`del a[len(a) // 2]`)는 1.2초, 연결 리스트는 0.005초였다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표의 prev·next 값, 순서를 어겼을 때 지워진 칸이 줄에 다시 나타나는 것, 확인 문제 C1의 답을 코드로 확인했다. 무작위 지우기·되살리기 3,000묶음에서 줄의 순서가 파이썬 리스트로 흉내 낸 결과와 같고 불변식도 매번 지켜졌다. 지우기 시간도 쟀다 — [13_linked-list_impl.py](/Hongs_Blog/studies/algorithms/code/13_linked-list_impl/)</div>

</div>


## 활용

- **알아보는 신호:** 커서가 한두 칸씩 움직이며 가운데를 자주 지우고, 지운 것을 되살리기까지 한다. n이 수십만 이상이라 리스트의 $$O(n)$$ 지우기를 여러 번 할 수 없다.
- **파이썬에서 만드는 법:** 파이썬에는 연결 리스트 자료형이 따로 없다. 칸 번호가 0 ~ n − 1로 정해져 있으면 위처럼 리스트 두 개(prev, next)로 만드는 것이 가장 간단하고 빠르다.
- **실제 쓰임:** 파이썬의 `collections.deque`도 속은 일정한 크기의 칸 묶음(블록)을 앞뒤로 이은 이중 연결 리스트다. 그래서 양 끝 넣기·빼기는 빠르지만 가운데 접근은 느리다[^2].
- **흔한 실수:** 맨 앞·맨 뒤 칸을 지울 때 −1이나 n 칸을 건드려 범위를 넘는다. 지운 칸의 prev, next까지 지워 버려 되살릴 수 없게 만든다.

## 연결

- 선수: [리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/)
- 되살리기 순서는 [스택](/Hongs_Blog/studies/algorithms/stack/)으로 관리한다. 양 끝만 쓰는 연결 리스트는 [큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/)이다.
- 연습: [표 편집](/Hongs_Blog/studies/algorithms/pg81303/)
- 지운 역순으로 되살리는 것은 [역함수](/Hongs_Blog/studies/college-math/inverse-function/)로 여러 단계를 되돌리는 방법과 같다. "1.8배 하고 32 더하기"를 "32 빼고 1.8로 나누기"로 되돌리듯, 마지막 단계부터 거꾸로 푼다. 순서가 중요한 까닭도 같다. 되살리기 하나는 그 칸을 지운 직후의 줄에서만 그 지우기를 정확히 되돌린다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 0 ~ 5번 여섯 칸에서 2를 지우고, 3을 지우고, 한 번 되살린다. 되살아난 칸, 그 뒤의 next[1], 그리고 따라간 줄의 순서는?</summary>

**답:** 3이 되살아난다(가장 최근에 지운 칸). next[1] = 3이고, 줄은 0 → 1 → 3 → 4 → 5다. 3을 지울 때 3은 "앞은 1, 뒤는 4"를 기억했다. 2를 지울 때 prev[3]이 이미 1로 바뀌었기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다섯 칸에서 2, 3을 차례로 지운 뒤, 2부터 되살리면 줄이 어떻게 망가지는가?</summary>

**답:** 2는 "앞은 1, 뒤는 3"을 기억한다. 그대로 되살리면 next[1] = 2가 되고, 2의 next는 여전히 3이다. 그래서 0 → 1 → 2 → 3 → 4로 따라가며 지워진 3이 줄에 다시 나타난다. 2가 기억하는 이웃 3이 지금은 줄에 없기 때문이다. 지운 역순으로 되살려야 되살릴 때마다 "기억한 이웃이 지금 줄에 있다"가 지켜진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 상황에 각각 파이썬 리스트와 연결 리스트 중 무엇이 알맞은가? (가) 끝에만 추가하고, "i번째 값"을 자주 읽는다. (나) 커서를 한두 칸씩 옮기며 가운데를 수십만 번 지우고 되살린다.</summary>

**답:** (가)는 파이썬 리스트다. i번째 읽기가 $$O(1)$$이고 끝에 추가도 빠르다. 연결 리스트면 i번째를 찾을 때마다 $$O(i)$$다. (나)는 연결 리스트다. 지우기·되살리기가 $$O(1)$$이다. 리스트면 지울 때마다 $$O(n)$$이라 수십만 번이면 너무 느리다.

</details>


[^1]: Cormen·Leiserson·Rivest·Stein, *Introduction to Algorithms* 3판, 10.2절 "Linked lists": 이중 연결 리스트의 삽입·삭제가 O(1)이고 탐색이 O(n)이다.
[^2]: CPython 소스 `Modules/_collectionsmodule.c`: deque의 데이터를 고정 길이 블록의 이중 연결 리스트에 담는다[확인필요: 블록 크기 등 세부는 버전마다 다를 수 있다].
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 다이어그램 1개는 원본에 없다. 예시 표의 '처음'과 '2 지우기' 줄(next[1] = 3, prev[3] = 1)과 '지워진 칸 자신의 prev, next는 그대로 둔다'는 설명을 포인터 그림으로 옮겼다.
{% endraw %}
