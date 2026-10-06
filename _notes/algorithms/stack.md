---
layout: "note"
title: "스택"
display_title: "스택 (Stack)"
kind: "concept"
kind_label: "자료구조"
num: "10"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-06"
status: "verified"
aliases: ["Stack", "스택", "LIFO", "후입선출", "push", "pop", "괄호 검사"]
description: "접시를 쌓으면 맨 위에 놓은 접시를 가장 먼저 꺼낸다. 스택은 이렇게 마지막에 넣은 것을 먼저 꺼내는 자료구조다. 이 규칙을 후입선출(LIFO)이라 부른다. \"가장 최근 것과 짝 맞추기\"나 \"방금 한 일 되돌리기\"에 딱 맞고, 넣기와 꺼내기가 한 번에 끝난다. 대신 맨 위만 볼 수…"
prev_url: "/studies/algorithms/bit-operations/"
prev_title: "비트 연산과 비트마스크"
next_url: "/studies/algorithms/queue-deque/"
next_title: "큐와 덱"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/stack/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

접시를 쌓으면 맨 위에 놓은 접시를 가장 먼저 꺼낸다. 스택은 이렇게 **마지막에 넣은 것을 먼저 꺼내는** 자료구조다. 이 규칙을 후입선출(LIFO)이라 부른다. "가장 최근 것과 짝 맞추기"나 "방금 한 일 되돌리기"에 딱 맞고, 넣기와 꺼내기가 한 번에 끝난다. 대신 맨 위만 볼 수 있어서, 중간에 있는 것을 찾으려면 느리다.

</div>


## 예시로 보기

괄호 문자열 `"(()())"`의 짝이 맞는지 본다. 여는 괄호를 만나면 쌓고, 닫는 괄호를 만나면 맨 위의 여는 괄호 하나를 꺼내 짝을 지운다.

| 읽은 글자 | 한 일 | 스택 (오른쪽이 맨 위) |
|---|---|---|
| ( | 넣기 | ( |
| ( | 넣기 | ( ( |
| ) | 꺼내기 | ( |
| ( | 넣기 | ( ( |
| ) | 꺼내기 | ( |
| ) | 꺼내기 | (비었음) |

끝났을 때 스택이 비었고, 중간에 빈 스택에서 꺼내려 한 적이 없으니 짝이 맞다. `"())"`라면 세 번째 글자에서 빈 스택을 꺼내려 해서 틀렸음을 안다.

닫는 괄호는 늘 **가장 최근에 열린** 괄호와 짝을 이룬다. "가장 최근 것"이 곧 스택의 맨 위라서 스택이 딱 맞는다.

## 쓰는 법

파이썬에서는 리스트의 끝을 스택의 맨 위로 쓴다[^1].

| 스택의 일 | 파이썬 코드 | 비용 |
|---|---|---|
| 넣기 (push) | `st.append(x)` | $$O(1)$$ (평균) |
| 꺼내기 (pop) | `st.pop()` | $$O(1)$$ |
| 맨 위 보기 (top) | `st[-1]` | $$O(1)$$ |
| 비었나 | `not st` | $$O(1)$$ |
| 개수 | `len(st)` | $$O(1)$$ |

지켜야 할 약속은 하나다. 넣고 빼는 일은 늘 리스트의 **끝**에서만 한다. `st.pop(0)`처럼 앞에서 빼면 스택이 아니라 큐가 되고, 속도도 $$O(n)$$으로 느려진다.

```python
def balanced(s):
    st = []
    for ch in s:
        if ch == "(":
            st.append(ch)
        else:                  # ")"
            if not st:         # 짝지을 여는 괄호가 없다
                return False
            st.pop()
    return not st              # 남은 여는 괄호가 없어야 한다
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 괄호 검사를 "`()`를 더는 없앨 수 없을 때까지 지우는" 느린 방법과 길이 0~12의 모든 괄호 문자열(8,191개)에서 비교해 결과가 같았다. 예시 표와 확인 문제의 스택 상태도 실행해 확인했다 — [10_stack_impl.py](/Hongs_Blog/studies/algorithms/code/10_stack_impl/)</div>

</div>


## 활용

- 괄호·태그 짝 맞추기, 되돌리기(Ctrl+Z), 웹 브라우저의 뒤로 가기, 연달아 같은 것 지우기, 쌓아 올리기 게임.
- 함수 호출도 스택이다. 함수가 다른 함수를 부르면 돌아올 자리를 쌓아 두고, 끝나면 맨 위부터 돌아온다. 그래서 재귀가 너무 깊으면 "스택이 넘쳤다"는 오류가 난다([재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/)).
- 다른 구조와 고르는 기준: 먼저 온 것을 먼저 처리해야 하면 큐를 쓴다([큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/) 문서). 스택은 가장 최근 것을 먼저 처리할 때 쓴다.
- 자주 하는 실수: 빈 스택에서 `pop()`이나 `st[-1]`을 하면 `IndexError`가 난다. 먼저 `if st:`로 확인한다.

## 연결

- 선수: [리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/)
- 대조: [큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/)은 먼저 넣은 것을 먼저 꺼낸다.
- 연습: [같은 숫자는 싫어](/Hongs_Blog/studies/algorithms/pg12906/), [크레인 인형뽑기 게임](/Hongs_Blog/studies/algorithms/pg64061/)
- `balanced`가 무엇을 확인하는지는 반복마다 늘 지켜지는 성질(루프 불변식)로 보인다. "i글자를 읽은 뒤 스택 크기는 앞 i글자의 여는 괄호 수 − 닫는 괄호 수다"가 매 바퀴 지켜진다는 것을 [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)으로 증명한다. 그래서 이 함수는 "어느 앞부분에서도 닫는 괄호가 더 많지 않고, 끝에서 두 수가 같은가"를 검사한다.
- `(`와 `)`만으로 된 문자열 가운데 `balanced`를 통과하는 것은 [재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/)에서 세 규칙(빈 문자열, (s), st)으로 만든 균형 괄호와 정확히 같다. 규칙으로 만든 문자열이 통과한다는 것은 구조적 귀납법으로 보인다. 거꾸로 통과한 문자열은 맨 앞 `(`와 그 짝으로 (A)B로 쪼갠 뒤, 길이에 대한 강한 귀납법으로 규칙에서 나온다는 것을 보인다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 빈 스택에 넣기 1, 넣기 2, 꺼내기, 넣기 3, 넣기 4, 꺼내기를 차례로 했다. 꺼낸 값들과 남은 스택은?</summary>

**답:** 꺼낸 값은 2, 4이고, 남은 스택은 [1, 3](3이 맨 위)이다. 꺼낼 때마다 그때 맨 위의 것이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 괄호 짝 검사에 스택이 알맞은 까닭은?</summary>

**답:** 닫는 괄호는 아직 닫히지 않은 여는 괄호 중 **가장 최근 것**과 짝을 이뤄야 한다. 스택은 가장 최근에 넣은 것을 맨 위에 두므로, 닫는 괄호가 올 때마다 맨 위를 꺼내면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** (가) 은행 창구에서 번호표 순서대로 부르기, (나) 문서 편집기의 되돌리기. 각각 스택과 큐 중 무엇인가?</summary>

**답:** (가)는 큐다. 먼저 온 손님을 먼저 부른다. (나)는 스택이다. 가장 최근에 한 일을 먼저 되돌린다.

</details>


[^1]: Python 3 공식 튜토리얼 5.1.1 "Using Lists as Stacks"(append와 인자 없는 pop으로 스택을 쓴다). 스택의 정의와 연산은 Cormen·Leiserson·Rivest·Stein, *Introduction to Algorithms* 3판, 10.1 "Stacks and queues".
{% endraw %}
