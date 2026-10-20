---
layout: "note"
title: "원형 큐"
display_title: "원형 큐 (Circular Queue)"
kind: "concept"
kind_label: "자료구조"
num: "14"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Circular Queue", "환형 큐", "Circular Array", "원형 배열", "Ring Buffer", "링 버퍼", "front", "rear", "AddQ", "DeleteQ", "IsFullQ", "IsEmptyQ", "QueueFull", "QueueEmpty", "MAX_QUEUE_SIZE", "배열로 만든 큐"]
description: "배열로 줄을 만들면, 앞사람이 빠질 때마다 줄 전체를 한 칸씩 당기거나, 줄이 배열 오른쪽 끝으로 밀려가 앞쪽에 빈칸만 남는다. 배열의 끝과 처음을 이어 고리처럼 쓰면 끝 칸 다음이 0번 칸이라, 당기지 않고도 넣기와 빼기가 한 번에 끝난다. 대신 텅 빈 줄과 꽉 찬 줄이 똑같아 …"
prev_url: "/studies/data-structures/array-stack/"
prev_title: "배열로 만든 스택"
next_url: "/studies/data-structures/singly-linked-list/"
next_title: "단순 연결 리스트"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "14_circular-queue_impl.c", "u": "/studies/data-structures/code/14_circular-queue_impl/", "r": "구현"}]
permalink: "/studies/data-structures/circular-queue/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

배열로 줄을 만들면, 앞사람이 빠질 때마다 줄 전체를 한 칸씩 당기거나, 줄이 배열 오른쪽 끝으로 밀려가 앞쪽에 빈칸만 남는다. 배열의 끝과 처음을 이어 고리처럼 쓰면 끝 칸 다음이 0번 칸이라, 당기지 않고도 넣기와 빼기가 한 번에 끝난다. 대신 텅 빈 줄과 꽉 찬 줄이 똑같아 보이지 않도록 한 칸은 늘 비워 둔다. 그래서 칸이 여섯이면 다섯 개까지만 담는다.

</div>


## 예시로 보기

큐는 먼저 넣은 것이 먼저 나가는 줄이다([큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/)). 한쪽 끝(rear)으로만 넣고 반대쪽 끝(front)에서만 뺀다. 배열로 만드는 가장 쉬운 방법은 맨 앞 원소를 늘 0번 칸에 두는 것이다. 넣기는 오른쪽 끝에 붙이면 되니 한 번에 끝난다. 그런데 뺄 때마다 남은 원소를 모두 한 칸씩 왼쪽으로 당겨야 해서, 원소가 많을수록 오래 걸린다.

당기지 않으려면 맨 앞이 어디인지 따로 기억하면 된다. 정수 `front`와 `rear`를 두고, 넣을 때는 `rear`를, 뺄 때는 `front`를 오른쪽으로 한 칸 옮긴다. 운영체제가 일거리 J1 ~ J5를 줄 세우는 예다.

| 한 일 | 0번 칸 | 1번 칸 | 2번 칸 | 3번 칸 | 4번 칸 |
|---|---|---|---|---|---|
| J1 넣기 | J1 | | | | |
| J2, J3 넣기 | J1 | J2 | J3 | | |
| 빼기 | | J2 | J3 | | |
| J4, J5 넣기 | | J2 | J3 | J4 | J5 |
| 빼기 | | | J3 | J4 | J5 |
| 빼기 | | | | J4 | J5 |

넣기도 빼기도 한 번에 끝나지만 줄이 오른쪽으로 밀려 간다. 칸이 다섯이면 마지막 줄에서 `rear`가 끝 칸에 닿는다. 앞의 세 칸이 비었는데도 더 넣을 수 없어, 줄 전체를 왼쪽으로 옮겨야 한다. 그 일이 다시 오래 걸린다.

배열의 끝과 처음을 이어 고리로 보면 풀린다. 끝 칸의 다음 칸이 0번 칸이다. 칸이 여섯인 고리에서 A, B, C가 2, 3, 4번 칸에 있다고 하자. `front`는 첫 원소의 한 칸 앞을, `rear`는 마지막 원소의 칸을 가리킨다.

```
칸 번호   [0] [1] [2] [3] [4] [5]
        +---+---+---+---+---+---+
queue   |   |   | A | B | C |   |     [5]의 다음 칸은 [0]이다
        +---+---+---+---+---+---+
              ^           ^
          front = 1    rear = 4
```

넣기(AddQ)는 `rear`를 한 칸 옮기고 그 칸에 쓴다. 빼기(DeleteQ)는 `front`를 한 칸 옮기고 그 칸의 값을 돌려준다.

| 한 일 | 돌려준 값 | front | rear | [0] ~ [5] | 원소 수 |
|---|---|---|---|---|---|
| 처음 | | 1 | 4 | −, −, A, B, C, − | 3 |
| AddQ(D) | | 1 | 5 | −, −, A, B, C, D | 4 |
| DeleteQ() | A | 2 | 5 | −, −, A, B, C, D | 3 |
| AddQ(E) | | 2 | 0 | E, −, A, B, C, D | 4 |
| AddQ(F) | | 2 | 1 | E, F, A, B, C, D | 5 |
| AddQ(G) | 가득 참 | 2 | 1 | E, F, A, B, C, D | 5 |
| DeleteQ() | B | 3 | 1 | E, F, A, B, C, D | 4 |
| AddQ(G) | | 3 | 2 | E, F, G, B, C, D | 5 |

넷째 줄에서 `rear`가 5 다음에 0으로 넘어가 앞쪽 빈칸을 다시 썼다. 빼낸 A와 B는 칸에 그대로 적혀 있지만 `front`가 지나갔으니 큐의 원소가 아니다. 여섯째 줄에서는 칸이 여섯인데 다섯 개가 들자 가득 찼다고 한다. `front`가 가리키는 2번 칸은 쓰지 못하는 칸이다. 왜 한 칸을 버려야 하는지는 아래 "왜 맞는가"에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 일거리 J1 ~ J5의 표와 "세 칸이 비었는데 가득 참", 위 추적 표, 가능한 (front, rear) 36쌍 모두에서 원소 수 식과 빔·가득 참 판정, 카드 C1·C3·C4, 무작위 연산 10,000번에서 느린 모형(뺄 때마다 한 칸씩 당기는 배열)과 꺼낸 값·원소 수·판정이 같고 6칸에 5개까지만 듦 — [14_circular-queue_impl.c](/Hongs_Blog/studies/data-structures/code/14_circular-queue_impl/)</div>

</div>


## 정의

큐가 하는 일은 네 가지 연산으로 정한다. 가득 찼는가(IsFullQ), 비었는가(IsEmptyQ), 맨 뒤에 넣기(AddQ), 맨 앞을 빼서 돌려주기(DeleteQ)다. 넣기와 빼기는 다른 이름으로도 부른다. 같은 연산이다.

| 하는 일 | 이 문서의 이름 | 다른 이름 |
|---|---|---|
| 맨 뒤에 넣기 | AddQ | enqueue |
| 맨 앞을 빼서 돌려주기 | DeleteQ | dequeue |

원형 큐는 이 네 연산을 배열 하나와 정수 둘로 만든 것이다. 배열 `queue`의 칸 수를 $$n$$(코드의 `MAX_QUEUE_SIZE`)이라 하자. `front`와 `rear`는 0 이상 $$n - 1$$ 이하의 정수다. 늘 지켜야 할 규칙(표현 불변식)은 둘이다[^s1].

1. 큐의 원소는 $$(\texttt{front} + 1) \bmod n$$번 칸에서 시작해 한 칸씩 돌아 `rear`번 칸까지, 넣은 순서대로 있다.
2. 원소 수는 $$(\texttt{rear} - \texttt{front} + n) \bmod n$$이고, 이 값은 $$n - 1$$ 이하다.

$$a \bmod n$$은 $$a$$를 $$n$$으로 나눈 나머지이고 C에서는 `a % n`으로 쓴다([나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)). 여섯 칸이면 $$(5 + 1) \bmod 6 = 0$$이라 5번 칸의 다음이 0번 칸이 된다. 둘째 식에서 $$n$$을 더하는 것은 `rear`가 `front`보다 작을 때 음수의 나머지를 구하지 않기 위해서다. 위 표의 다섯째 줄이라면 $$(1 - 2 + 6) \bmod 6 = 5$$다.

| 연산 | 조건과 동작 | 시간 |
|---|---|---|
| IsEmptyQ | `front == rear`이면 비었다 | $$O(1)$$ |
| IsFullQ | `(rear + 1) % n == front`이면 가득 찼다 | $$O(1)$$ |
| AddQ | 가득 차지 않았으면 `rear`를 한 칸 옮기고 그 칸에 쓴다 | $$O(1)$$ |
| DeleteQ | 비지 않았으면 `front`를 한 칸 옮기고 그 칸의 값을 돌려준다 | $$O(1)$$ |

```c
#define MAX_QUEUE_SIZE 6

typedef int element;

static element queue[MAX_QUEUE_SIZE];

int IsEmptyQ(int front, int rear) { return front == rear; }
int IsFullQ(int front, int rear)  { return (rear + 1) % MAX_QUEUE_SIZE == front; }

void AddQ(int front, int *rear, element item)
{
    int next = (*rear + 1) % MAX_QUEUE_SIZE;     /* rear가 갈 칸. 끝 칸 다음은 0번 칸 */
    if (next == front) {                         /* 그 칸이 front면 가득 찼다 */
        QueueFull();
        return;                                  /* rear는 그대로 둔다 */
    }
    *rear = next;
    queue[*rear] = item;
}

element DeleteQ(int *front, int rear)
{
    if (*front == rear)
        return QueueEmpty();
    *front = (*front + 1) % MAX_QUEUE_SIZE;      /* front를 한 칸 옮기면 첫 원소의 칸이다 */
    return queue[*front];
}

/* 큐에 든 원소 수 */
int SizeQ(int front, int rear)
{
    return (rear - front + MAX_QUEUE_SIZE) % MAX_QUEUE_SIZE;
}
```

`front`와 `rear`는 함수 밖의 변수다. 함수가 값을 바꿔야 하는 쪽은 주소(`int *rear`)로 받고, 읽기만 하는 쪽은 값(`int front`)으로 받는다([포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)). `QueueFull()`은 가득 찼다고 알리고 돌아오는 함수이고, `QueueEmpty()`는 빈 큐에서 빼려 할 때 부르는 함수다[^s1].


### 왜 맞는가

원소 수를 $$s = (\texttt{rear} - \texttt{front} + n) \bmod n$$이라 하자. 증명할 것은 세 가지다. 두 연산 뒤에도 불변식이 맞다. 빔과 가득 참의 판정이 맞다. 그리고 $$n$$칸을 다 쓰는 방법은 없다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. **처음.** `front == rear`에서 시작하면 $$s = 0$$이고 원소도 없다. — 정의
2. **AddQ 뒤.** 가득 차지 않았다면 $$s \le n - 2$$다. `rear`가 한 칸 돌아 $$s$$가 1 늘고, 여전히 $$n - 1$$ 이하다. 새 원소가 들어간 칸은 `front`에서 $$s + 1$$칸 더 간 칸이다. 이미 있던 원소는 `front`에서 1칸, 2칸, …, $$s$$칸 더 간 칸에 있으므로 겹치지 않는다. $$s + 1 \le n - 1 < n$$이라 한 바퀴를 돌아 `front` 칸에 닿지도 않는다. — 불변식 1, 2
3. **DeleteQ 뒤.** 비지 않았다면 $$s \ge 1$$이다. `front`가 한 칸 돌아 $$s$$가 1 준다. 돌려준 값은 옛 `front`의 다음 칸에 있던 것, 곧 가장 먼저 넣은 원소다. 남은 원소는 새 `front`의 다음 칸부터 순서대로 있다. — 불변식 1
4. **판정.** `front`와 `rear`가 둘 다 0 이상 $$n - 1$$ 이하이므로 $$s = 0$$인 것은 `front == rear`일 때뿐이다. $$s = n - 1$$인 것은 `rear`에서 한 칸 더 가면 `front`일 때, 곧 `(rear + 1) % n == front`일 때뿐이다. — 나머지의 뜻
5. **$$n$$개는 담을 수 없다.** `front`와 `rear`만 보고 알 수 있는 것은 $$s$$ 하나이고, $$s$$가 될 수 있는 값은 $$0, 1, \dots, n - 1$$의 $$n$$가지다. 원소 수가 0개부터 $$n$$개까지 $$n + 1$$가지일 수 있다면, 어떤 두 개수는 같은 $$s$$로 보인다. — 비둘기집 원리
6. 실제로 겹치는 것은 0개와 $$n$$개다. 빈 큐에서 $$n$$번 넣으면 `rear`가 $$n$$칸을 돌아 제자리로 와서 `front == rear`가 된다. 그래서 $$n - 1$$개에서 멈춘다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2단계에서 "새 원소의 칸이 이미 있던 원소의 칸과 겹치지 않는다"는 어디서 나오는가?</summary>

불변식 1에서 나온다. 원소는 `front`의 다음 칸부터 연달아 $$s$$칸을 차지한다. 새 원소는 그 바로 다음, `front`에서 $$s + 1$$칸 더 간 칸에 들어간다. 가득 차지 않았다는 조건($$s + 1 \le n - 1$$) 덕분에 한 바퀴를 넘지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3단계에서 DeleteQ가 "가장 먼저 넣은" 원소를 돌려준다는 것은 어디서 나오는가?</summary>

불변식 1의 "넣은 순서대로 있다"에서 나온다. `front`의 다음 칸이 가장 오래된 원소의 칸이고, AddQ는 늘 반대쪽 끝(`rear`)에만 붙인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 4단계에서 가득 참 조건에 왜 나머지가 들어가야 하는가?</summary>

`rear`가 끝 칸 $$n - 1$$이면 `rear + 1`은 $$n$$이고, 이 값은 어떤 `front`와도 같지 않다. "한 칸 더 간 칸"은 0번 칸이므로 $$(n - 1 + 1) \bmod n = 0$$으로 계산해야 `front == 0`인 가득 찬 큐를 알아본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

정수 둘이 기억하는 것은 "두 자리의 차이를 $$n$$으로 나눈 나머지" 하나뿐이라는 점이다. 구별할 수 있는 상태가 $$n$$가지이니 원소 수도 $$n$$가지($$0$$ ~ $$n - 1$$)까지만 허락한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

끝과 처음을 나머지로 잇는 생각은 버킷 번호가 끝에 닿으면 0번으로 넘어가는 [선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/)에도 나온다. 한 칸을 버리는 대신 원소 수를 세는 변수를 따로 두면 $$n$$칸을 모두 쓸 수 있다. [연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/)가 `count`를 두는 것과 같은 길이다.

</details>


### 다른 방법과 견주기

칸이 $$n$$개일 때다[^s1].

| | 뺄 때마다 당기는 배열 | 오른쪽으로만 가는 배열 | 원형 큐 | [연결 큐](/Hongs_Blog/studies/data-structures/linked-queue/) |
|---|---|---|---|---|
| 넣기 | $$O(1)$$ | $$O(1)$$. 끝에 닿으면 줄 전체를 옮긴다 | $$O(1)$$ | $$O(1)$$ |
| 빼기 | $$O(\text{원소 수})$$ | $$O(1)$$ | $$O(1)$$ | $$O(1)$$ |
| 담는 개수 | $$n$$ | $$n$$. 줄이 밀려 가면 그보다 적다 | $$n - 1$$ | 메모리가 되는 만큼 |
| 덤으로 쓰는 것 | 없음 | 없음 | 빈칸 하나 | 원소마다 링크 한 칸 |

## 활용

- 구현: [14_circular-queue_impl.c](/Hongs_Blog/studies/data-structures/code/14_circular-queue_impl/). 연습: [원형 큐 추적 예제 사다리](/Hongs_Blog/studies/data-structures/circular-queue-ladder/)
- 운영체제는 차례를 기다리는 일거리를 큐에 세운다([스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/)).
- 가까운 곳부터 퍼져 나가는 탐색이 큐를 쓴다: [너비 우선 탐색(BFS)](/Hongs_Blog/studies/algorithms/bfs/), [레벨 순서 순회](/Hongs_Blog/studies/data-structures/level-order-traversal/)
- 파이썬의 `deque`가 해 주던 일을 C에서는 이 원형 배열이나 연결 리스트로 직접 만든다.
- 흔한 실수 셋. `% MAX_QUEUE_SIZE`를 빠뜨려 `rear`가 배열 밖으로 나간다. `front`를 "첫 원소의 칸"으로 알고 옮기기 전에 `queue[front]`를 읽는다. AddQ에서 가득 찼는지 보기 전에 `rear`부터 옮긴다.

## 연결

- 선수: [큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/)(큐가 무엇인가), [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/), [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/), [나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/)(나머지 계산)
- 같은 추상 자료형의 다른 구현: [연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/)
- 배열로 만든 스택: [배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/). 스택은 한쪽 끝만 움직여 정수 하나(`top`)면 되고, 줄이 밀려 가는 문제도 없다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"칸이 $$n$$개인 배열이니 원형 큐에 $$n$$개까지 담을 수 있다"</div>

틀렸다. `front`와 `rear` 둘만으로 만든 원형 큐는 $$n - 1$$개까지만 담는다. 배열에 빈칸이 하나 남아 있으니 하나 더 넣어도 될 것처럼 보여서 그럴듯하다. 하지만 그 칸까지 채우면 `rear`가 `front`와 같아지고, 이것은 빈 큐의 표시와 똑같다. 여섯 칸에서 front = rear = 0으로 시작해 여섯 번 넣으면 rear가 0으로 돌아온다. 그 순간 DeleteQ는 "비었다"고 답하고 여섯 개를 모두 잃는다. $$n$$칸을 다 쓰고 싶으면 원소 수를 세는 변수를 하나 더 둬야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 여섯 칸 원형 큐가 front = rear = 0으로 비어 있다. AddQ(10), AddQ(20), AddQ(30), AddQ(40), DeleteQ() 세 번, AddQ(50), AddQ(60), AddQ(70), AddQ(80)을 차례로 했다. 마지막 front, rear와 [0] ~ [5]에 적힌 값을 쓰고, 이어서 AddQ(90)을 하면 어떻게 되는지 써라.</summary>

**답:** DeleteQ는 10, 20, 30을 돌려준다. 마지막에 front = 3, rear = 2이고 칸에는 60, 70, 80, 30, 40, 50이 적혀 있다. 큐에 든 것은 40, 50, 60, 70, 80 다섯 개다. AddQ(90)은 가득 차서 들어가지 않는다.<br>
**이유:** 40은 [4], 50은 [5]에 들어가고 60부터는 [0], [1], [2]로 넘어간다. [3]의 30은 이미 빼낸 값이다. $$(2 + 1) \bmod 6 = 3 = \texttt{front}$$라 가득 찼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 원형 큐가 칸 하나를 비워 두는 까닭을 설명하라.</summary>

**답:** `front`와 `rear`만으로는 "두 자리가 몇 칸 떨어져 있나"밖에 알 수 없고, 그 값은 $$0$$부터 $$n - 1$$까지 $$n$$가지다. $$n$$칸을 다 채우게 하면 원소 수가 $$0$$부터 $$n$$까지 $$n + 1$$가지가 되어, 0개인 큐와 $$n$$개인 큐가 둘 다 `front == rear`로 보인다. 그래서 $$n - 1$$개에서 가득 찼다고 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** AddQ가 "rear를 먼저 옮기고, 그다음 `front == *rear`이면 QueueFull을 부르고 돌아온다"로 짜여 있다. 이 코드가 원소를 잃는 연산 차례를 여섯 칸 큐에서 하나 들어라.</summary>

**답:** front = rear = 0에서 10, 20, 30, 40, 50을 넣는다(rear = 5). 이어서 60을 넣으려 하면 rear가 먼저 0이 되고, `front == rear`라 QueueFull이 불린 뒤 그대로 돌아온다. 이제 front = rear = 0이라 DeleteQ는 빈 큐라고 답한다. 다섯 개가 칸에는 남아 있지만 꺼낼 길이 없다.<br>
**이유:** 가득 찼을 때 rear를 되돌리지 않아 불변식 2(원소 수 = 두 자리의 차이)가 깨진다. 옮길 칸을 먼저 계산해 견주고, 자리가 있을 때만 옮겨야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 여섯 칸 원형 큐에서 front = 4, rear = 1이다. 원소는 몇 개이고 어느 칸에 어떤 순서로 있는가?</summary>

**답:** $$(1 - 4 + 6) \bmod 6 = 3$$개다. 첫 원소는 front의 다음 칸 [5]에 있고, 이어서 [0], [1] 순서다.

</details>


[^s1]: 구현 코드로 확인했다. 구현 파일의 `QueueFull`은 불린 횟수만 세고 돌아오고, `QueueEmpty`는 오류를 찍고 끝낸다.
{% endraw %}
