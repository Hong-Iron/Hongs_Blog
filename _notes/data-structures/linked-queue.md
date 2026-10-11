---
layout: "note"
title: "연결 리스트로 만든 큐"
display_title: "연결 리스트로 만든 큐 (Linked Queue)"
kind: "concept"
kind_label: "자료구조"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Linked Queue", "연결 큐", "연결된 큐", "QueueNode", "LinkedQueueType", "front", "rear", "count", "enqueue", "dequeue"]
description: "한 줄로 이은 노드의 맨 앞과 맨 뒤를 각각 가리키는 주소 둘을 들고 있는다. 새로 온 원소는 맨 뒤 노드 뒤에 달고, 나가는 원소는 맨 앞에서 뗀다. 양 끝을 바로 아니까 둘 다 한 번에 끝나고, 배열로 만든 큐처럼 칸 수를 정하거나 한 칸을 비워 둘 필요가 없다. 대신 빈 줄에…"
prev_url: "/studies/data-structures/linked-stack/"
prev_title: "연결 리스트로 만든 스택"
next_url: "/studies/data-structures/linear-data-structure/"
next_title: "선형 자료구조"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/linked-queue/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 줄로 이은 노드의 맨 앞과 맨 뒤를 각각 가리키는 주소 둘을 들고 있는다. 새로 온 원소는 맨 뒤 노드 뒤에 달고, 나가는 원소는 맨 앞에서 뗀다. 양 끝을 바로 아니까 둘 다 한 번에 끝나고, 배열로 만든 큐처럼 칸 수를 정하거나 한 칸을 비워 둘 필요가 없다. 대신 빈 줄에 처음 넣을 때와 마지막 하나를 뺄 때는 두 주소를 함께 고쳐야 한다.

</div>


## 예시로 보기

[원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)는 배열 칸 수에서 하나를 뺀 만큼만 담는다. 연결 리스트로 만들면 정해진 개수가 없다[^1]. 큐는 한쪽 끝에 넣고 반대쪽 끝에서 빼니, 체인의 양 끝을 모두 알아야 한다. 맨 앞 노드를 `front`가, 가장 나중에 넣은 맨 뒤 노드를 `rear`가 가리킨다[^2].

```
front                                rear
  |                                    |
  v                                    v
 [A] ---> [B] ---> [C] ---> [D] ---> NULL
```

10, 20, 30을 넣고 모두 뺀 뒤 40을 넣어 본다. `count`는 큐에 든 원소 수다.

| 한 일 | 돌려준 값 | count | 체인 | front | rear |
|---|---|---|---|---|---|
| 처음 | | 0 | (비었음) | NULL | NULL |
| enqueue 10 | | 1 | 10 | 10의 노드 | 10의 노드 |
| enqueue 20 | | 2 | 10 → 20 | 10의 노드 | 20의 노드 |
| enqueue 30 | | 3 | 10 → 20 → 30 | 10의 노드 | 30의 노드 |
| dequeue | 10 | 2 | 20 → 30 | 20의 노드 | 30의 노드 |
| dequeue | 20 | 1 | 30 | 30의 노드 | 30의 노드 |
| dequeue | 30 | 0 | (비었음) | NULL | NULL |
| enqueue 40 | | 1 | 40 | 40의 노드 | 40의 노드 |

보통은 넣을 때 `rear`만, 뺄 때 `front`만 바뀐다. 둘이 함께 바뀌는 줄이 둘 있다. 빈 큐에 처음 넣을 때(둘째, 여덟째 줄)는 새 노드가 맨 앞이자 맨 뒤다. 마지막 하나를 뺄 때(일곱째 줄)는 둘 다 NULL이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 위 그림과 추적 표, 카드 C1·C2, 연산마다 불변식, 무작위 연산 10,000번에서 원형 큐와 느린 일자 큐(뺄 때마다 한 칸씩 당기는 배열)가 같은 값을 같은 순서로 냄, malloc 횟수와 free 횟수가 같음 — [19_linked-queue_impl.c](/Hongs_Blog/studies/data-structures/code/19_linked-queue_impl/)</div>

</div>


## 정의

하는 일은 [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)와 같다. 맨 뒤에 넣기와 맨 앞을 빼서 돌려주기다. 3주차 슬라이드는 이 둘을 AddQ, DeleteQ라 부르고 5주차 슬라이드는 enqueue, dequeue라 부른다. 담는 방법은 원소마다 노드 하나, 그리고 원소 수 `count`와 두 주소 `front`, `rear`다[^3].

```c
typedef int element;

typedef struct QueueNode {
    element item;
    struct QueueNode *link;       /* 바로 뒤 원소의 노드. 맨 뒤면 NULL */
} QueueNode;

typedef struct {
    int count;                    /* 큐에 든 원소 수 */
    QueueNode *front;             /* 맨 앞 노드. 비었으면 NULL */
    QueueNode *rear;              /* 맨 뒤 노드. 비었으면 NULL */
} LinkedQueueType;

void init(LinkedQueueType *q)
{
    q->count = 0;
    q->front = q->rear = NULL;
}

int is_empty(LinkedQueueType *q)
{
    return q->count == 0;
}

void enqueue(LinkedQueueType *q, element item)
{
    QueueNode *tmp = malloc(sizeof(QueueNode));
    if (tmp == NULL) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    tmp->item = item;
    tmp->link = NULL;                 /* 새 노드는 맨 뒤라서 뒤가 없다 */
    if (!is_empty(q)) {
        q->rear->link = tmp;          /* 지금의 맨 뒤 노드 뒤에 단다 */
        q->rear = tmp;                /* 새 노드가 맨 뒤가 된다 */
    }
    else {
        q->front = q->rear = tmp;     /* 빈 큐: 새 노드가 맨 앞이자 맨 뒤다 */
    }
    q->count++;
}

element dequeue(LinkedQueueType *q)
{
    if (is_empty(q)) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    QueueNode *tmp = q->front;        /* 떼어 낼 노드를 적어 둔다 */
    element item = tmp->item;
    q->front = q->front->link;        /* 둘째 노드가 맨 앞이 된다 */
    if (q->front == NULL)             /* 마지막 하나를 뺐다 */
        q->rear = NULL;               /* rear가 돌려준 노드를 가리키지 않게 한다 */
    q->count--;
    free(tmp);
    return item;
}
```

`enqueue`에서 빈 큐를 따로 다루는 까닭은 `q->rear->link`에 있다. 빈 큐에는 맨 뒤 노드가 없어서 그 링크에 쓸 수 없다. `dequeue`는 [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)의 맨 앞 지우기와 같다[^4].

늘 지켜야 할 규칙(표현 불변식)은 이렇다. `count`는 노드 수와 같다. 비었으면 `front`와 `rear`가 모두 NULL이다. 비지 않았으면 `front`에서 링크를 `count - 1`번 따라간 노드가 `rear`이고, `rear`의 링크는 NULL이다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.34의 첫 구조체는 `typedef struct QueueNode { … } StackeNode;`로 끝나고, 아래 구조체는 `QueueNode *front;`를 쓴다. p.35 ~ p.36의 `enqueue`와 `dequeue`는 `queue`, `node`, `data`, `next`, `isempty`라는 이름을 쓴다. p.36의 `dequeue`는 첫 줄에서 `q->front->data`를 읽고, 마지막 노드를 뺀 뒤에도 `q->rear`를 그대로 둔다.<br>
문제점: typedef 이름이 `StackeNode`라 `QueueNode`라는 형 이름이 없다. 함수 쪽 이름은 p.34의 선언(`LinkedQueueType`, `QueueNode`, `item`, `link`) 어디에도 없어서 함께 컴파일되지 않는다. `dequeue`는 빈 큐에서 부르면 NULL을 따라가 죽는다. 마지막 노드를 뺀 뒤에는 `rear`가 이미 돌려준 노드의 주소를 들고 있다.<br>
수정안: typedef 이름을 `QueueNode`로 고치고 함수의 이름을 p.34에 맞춘다. `dequeue`는 먼저 비었는지 보고, `front`가 NULL이 되면 `rear`도 NULL로 바꾼다.<br>
근거: p.34의 선언은 "must use 'struct' tag to refer to type 'QueueNode'", p.35의 함수를 p.34의 선언과 함께 컴파일하면 "unknown type name 'queue'" 오류가 난다. 이름을 맞춘 슬라이드 판을 돌리면 빈 큐의 `dequeue`에서 "member access within null pointer"가 잡힌다. `rear`가 남는 것은 `isempty`가 `count`를 보는 동안에는 드러나지 않는다. `isempty`를 `rear == NULL`로 짜면 다음 `enqueue`가 돌려준 노드에 쓰다가 "heap-use-after-free"로 잡힌다. 슬라이드에는 `isempty`의 본문이 없다[^s2].

</div>


### 원형 큐와 견주기

두 구현을 견주면 이렇다[^1][^s1].

| | [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/) | 연결 큐 |
|---|---|---|
| 담는 개수 | 칸 수 − 1 | 정하지 않는다. `malloc`이 메모리를 주는 동안 |
| 넣기, 빼기 | $$O(1)$$ | $$O(1)$$ |
| 빔과 가득 참 | `front == rear`, `(rear + 1) % n == front` | `count == 0`. 가득 참은 없다 |
| 덤으로 쓰는 것 | 빈칸 하나 | 원소마다 링크 한 칸 |
| 넣고 뺄 때 하는 일 | 정수 하나를 옮긴다 | `malloc`과 `free`를 한 번씩 부른다 |

## 활용

- 구현: [19_linked-queue_impl.c](/Hongs_Blog/studies/data-structures/code/19_linked-queue_impl/). 연습: [연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/)
- 트리를 위층부터 한 층씩 훑을 때 큐에 노드의 주소를 넣는다: [레벨 순서 순회](/Hongs_Blog/studies/data-structures/level-order-traversal/)
- 다 쓴 큐는 남은 노드를 모두 `dequeue`해 비운다(구현 파일의 `destroy`).
- 흔한 실수: 빈 큐에 넣을 때 `front`를 채우지 않는 것, 마지막 하나를 뺀 뒤 `rear`를 그대로 두는 것, `count`를 한쪽 함수에서만 고치는 것.

## 연결

- 선수: [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/), [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)(같은 연산의 배열 판)
- 큐가 무엇이고 어디에 쓰나: [큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/)
- 같은 재료로 만든 스택: [연결 리스트로 만든 스택](/Hongs_Blog/studies/data-structures/linked-stack/)
- 배열과 연결 리스트 가운데 고르기: [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 빈 연결 큐에 enqueue 1, enqueue 2, dequeue, enqueue 3, dequeue, dequeue, enqueue 4를 차례로 했다. 꺼낸 값 셋과, 세 번째 dequeue 직후와 맨 마지막의 `count`, `front`, `rear`를 써라.</summary>

**답:** 꺼낸 값은 1, 2, 3이다. 세 번째 dequeue 직후에는 `count`가 0이고 `front`와 `rear`가 모두 NULL이다. 마지막에는 `count`가 1이고 `front`와 `rear`가 둘 다 4의 노드를 가리킨다.<br>
**이유:** 마지막 하나를 빼면 두 주소를 함께 NULL로 바꾸고, 빈 큐에 넣으면 두 주소가 함께 새 노드를 가리킨다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 체인의 맨 앞을 `front`, 맨 끝을 `rear`로 잡는다. 거꾸로 맨 앞에 넣고 맨 끝에서 빼도록 짜면 왜 안 좋은가?</summary>

**답:** 맨 끝 노드를 떼려면 그 앞 노드의 링크를 NULL로 고쳐야 하는데, 링크가 한 방향이라 앞 노드를 처음부터 찾아야 한다. 노드가 `count`개면 링크를 `count - 2`번 따라가서 빼기가 $$O(n)$$이 된다.<br>
**이유:** 체인에서 한 번에 끝나는 일은 맨 앞에 끼우기, 맨 앞 지우기, 그리고 맨 끝 노드의 주소를 알 때 맨 끝에 붙이기다. 맨 끝 지우기는 여기에 없다. 그래서 빼는 쪽이 맨 앞, 넣는 쪽이 맨 끝이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 원형 큐와 연결 큐 가운데 무엇이 알맞은가? (가) 한 번에 기다리는 일거리가 많아야 100개라고 정해져 있다. (나) 일거리가 한꺼번에 얼마나 몰릴지 모르고, 몰렸다고 버리면 안 된다.</summary>

**답:** (가)는 원형 큐다. 칸 101개를 잡으면 100개를 담고, 원소마다 링크를 둘 필요도 메모리를 얻고 돌려줄 필요도 없다. (나)는 연결 큐다. 가득 참이 없어서 메모리가 남아 있는 한 버리지 않는다.<br>
**이유:** 원형 큐는 칸 하나를 비워 두므로 100개를 담으려면 101칸이 필요하다.

</details>


[^1]: 자료구조 5회 강의 자료 「DS_Week5_Lecture_2024」, p.32 (배열로 만든 큐는 정해진 개수까지만 된다. 연결 리스트로 만들면 개수 제한이 없다)
[^2]: 같은 자료, p.33 (가장 나중에 넣은 노드를 rear가, 첫 노드를 front가 가리킨다. A, B, C, D의 그림)
[^3]: 같은 자료, p.34 (element, QueueNode, count·front·rear가 든 LinkedQueueType의 선언)
[^4]: 같은 자료, p.35~36 (enqueue와 dequeue의 코드)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `init`, `is_empty`의 본문, `enqueue`가 실패했을 때 끝내게 한 것, `dequeue`의 빔 검사와 `rear`를 NULL로 바꾸는 줄, 표현 불변식, 추적 표, 견주는 표의 아래 네 줄, 카드 C1~C3은 슬라이드에 없다. 구현 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드의 선언과 함수를 그대로 옮겨 Apple clang 21로 컴파일하고, 이름을 맞춘 판을 ASan·UBSan으로 돌린 결과다. 정해지지 않은 동작을 하는 코드라 볼트에는 두지 않고 따로 돌렸다.
{% endraw %}
