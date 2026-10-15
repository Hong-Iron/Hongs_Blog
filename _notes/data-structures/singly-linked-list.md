---
layout: "note"
title: "단순 연결 리스트"
display_title: "단순 연결 리스트 (Singly Linked List)"
kind: "concept"
kind_label: "자료구조"
num: "15"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Singly Linked List", "Linked List", "연결 리스트", "체인", "Chain", "노드", "Node", "링크", "link", "listNode", "listPointer", "first", "beforeNode", "연결 표현", "Linked Representation"]
description: "보물찾기 쪽지처럼, 원소마다 \"다음 원소가 어디 있는지\"를 함께 적어 둔 줄이다. 원소들이 메모리 여기저기에 흩어져 있어도 쪽지만 따라가면 순서대로 만난다. 가운데에 끼우거나 빼는 일은 쪽지 한두 장만 고치면 끝난다. 대신 몇 번째 원소를 보려면 처음부터 그만큼 따라가야 하고, 쪽…"
prev_url: "/studies/data-structures/circular-queue/"
prev_title: "원형 큐"
next_url: "/studies/data-structures/array-vs-linked-list/"
next_title: "배열과 연결 리스트 비교"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/singly-linked-list/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

보물찾기 쪽지처럼, 원소마다 "다음 원소가 어디 있는지"를 함께 적어 둔 줄이다. 원소들이 메모리 여기저기에 흩어져 있어도 쪽지만 따라가면 순서대로 만난다. 가운데에 끼우거나 빼는 일은 쪽지 한두 장만 고치면 끝난다. 대신 몇 번째 원소를 보려면 처음부터 그만큼 따라가야 하고, 쪽지를 고치는 차례가 틀리면 뒤쪽 줄을 통째로 잃어버린다.

</div>


## 예시로 보기

배열은 원소를 붙어 있는 칸에 차례로 둔다. 그래서 가운데에 하나를 끼우려면 뒤의 원소를 모두 한 칸씩 밀어야 한다. 연결 리스트는 원소를 아무 칸에나 두고, 원소마다 "다음 원소가 있는 곳"을 함께 적는다. 목록 $$L = (a, b, c, d, e)$$를 칸 15개짜리 메모리에 두는 두 방법이다.

```
칸 번호        0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
배열         [ a  b  c  d  e  .  .  .  .  .  .  .  .  .  . ]
연결 리스트   [ c  .  .  .  a  .  .  .  e  .  .  d  .  .  b ]
```

연결 리스트 쪽은 칸의 순서가 목록의 순서가 아니다. 순서는 원소마다 따로 적은 "다음 칸"이 정한다.

| 원소 | a | b | c | d | e |
|---|---|---|---|---|---|
| 있는 칸 | 4 | 14 | 0 | 11 | 8 |
| 다음 원소가 있는 칸 | 14 | 0 | 11 | 8 | 없음 |

첫 원소가 있는 칸 4는 변수 `first`에 적어 둔다. `first`에서 출발해 4 → 14 → 0 → 11 → 8로 따라가면 a, b, c, d, e를 차례로 만난다. e에는 "다음이 없다"는 표시 NULL을 적는다. C 프로그램에서 칸 번호는 메모리 주소이고, 주소를 담는 변수가 [포인터](/Hongs_Blog/studies/data-structures/c-pointer/)다.

보통은 메모리의 어느 칸인지를 그리지 않고 상자와 화살표로 그린다.

```
first
  |
  v
+---+---+    +---+---+    +---+---+    +---+---+    +---+------+
| a | *-+--->| b | *-+--->| c | *-+--->| d | *-+--->| e | NULL |
+---+---+    +---+---+    +---+---+    +---+---+    +---+------+
data link
```

상자 하나를 노드라 부른다. 왼쪽 칸에는 원소(data)가, 오른쪽 칸에는 다음 노드의 주소(link)가 들어 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 아래 찾기·지우기·끼우기의 결과(bcde, abde, fabcde, abcfde), 맨 앞 끼우기에서 새 노드의 링크에 NULL을 넣으면 길이 5가 1이 되는 것, 두 줄을 바꿔 쓰면 새 노드가 자기 자신을 가리키는 것, 카드 C1, 무작위 끼우기·지우기 3,000번 뒤 순회 결과가 배열 모형과 같고 해제 뒤 접근이 없으며 malloc 횟수와 free 횟수가 같음 — [15_singly-linked-list_impl.c](/Hongs_Blog/studies/data-structures/code/15_singly-linked-list_impl/)</div>

</div>


## 정의

**연결 리스트**는 원소의 순서를 메모리에서의 자리로 정하지 않고, 원소마다 다음 원소를 가리키게 해서 정하는 목록이다. **노드**는 원소 하나와 다음 노드의 주소를 묶은 것이다. **체인**(chain)은 노드 하나가 원소 하나를 담고, 노드마다 다음 노드로 가는 링크가 하나 있고, 마지막 노드의 링크가 NULL인 연결 리스트다. 링크가 한 방향으로 하나뿐이라 단순 연결 리스트라고도 부른다.

이 목록에 하는 일은 원소 끼우기와 원소 지우기다.

```c
typedef struct listNode *listPointer;
typedef struct listNode {
    char data;                /* 원소 */
    listPointer link;         /* 다음 노드의 주소. 마지막 노드면 NULL */
} listNode;
```

첫 줄은 "`listPointer`는 `listNode`의 주소를 담는 형이다"라고 미리 알리는 줄이다. 노드 안에 같은 종류의 노드를 가리키는 칸이 있어야 해서 이 줄이 먼저 온다. 변수 `listPointer first;`가 첫 노드의 주소를 담고, 빈 목록이면 `first`가 NULL이다.


늘 지켜야 할 규칙(표현 불변식)은 셋이다[^s1].

1. `first`에서 링크를 따라가면 유한 번 만에 NULL에 닿는다. 도중에 같은 노드를 두 번 만나지 않는다.
2. 그 길에서 만나는 노드가 목록의 원소 전부이고, 만나는 순서가 목록의 순서다.
3. `malloc`으로 얻은 노드는 모두 그 길 위에 있다. 길에서 뺀 노드는 `free`로 돌려준다.

### k번 노드 찾기

`first`는 첫 노드, `first->link`는 둘째 노드, `first->link->link`는 셋째 노드다. 노드가 다섯인 목록에서 링크를 다섯 번 따라가면 NULL이고, 거기서 `->data`를 읽으면 없는 노드를 읽는 것이라 프로그램이 죽는다. 그래서 따라가기 전에 NULL인지 본다.

```c
/* k번 노드(맨 앞이 0번)의 주소. 그런 노드가 없으면 NULL */
listPointer nodeAt(listPointer first, int k)
{
    listPointer p = first;
    while (p != NULL && k > 0) {
        p = p->link;          /* 링크를 한 번 따라간다 */
        k--;
    }
    return p;
}
```

k번 노드에 닿으려면 링크를 정확히 k번 따라간다. 배열의 `a[k]`처럼 주소를 계산해 한 번에 가는 길은 없다.

### 지우기

맨 앞 노드 a를 지운다. `first`가 둘째 노드를 가리키게 하고 a를 돌려주면 된다. 그런데 `first`를 먼저 바꾸면 a의 주소를 아는 변수가 없어져 `free`를 부를 수 없다. 그래서 주소를 먼저 적어 둔다.

```c
/* 맨 앞 노드를 지운다. 목록이 비어 있으면 안 된다 */
void deleteFront(listPointer *first)
{
    listPointer deleteNode = *first;  /* 지울 노드의 주소를 적어 둔다 */
    *first = (*first)->link;          /* first가 둘째 노드를 가리킨다 */
    free(deleteNode);
}
```

가운데 노드 c를 지우려면 c의 **앞 노드** b가 필요하다. 고쳐야 하는 링크가 b 안에 있기 때문이다.

```
지우기 전   first -> [a] -> [b] -> [c] -> [d] -> [e] -> NULL
                            ^
                        beforeNode

지운 뒤     first -> [a] -> [b] ---------> [d] -> [e] -> NULL
                                  [c]는 free로 돌려줬다
```

```c
/* beforeNode 바로 뒤 노드를 지운다. 뒤 노드가 있어야 한다 */
void deleteAfter(listPointer beforeNode)
{
    listPointer deleteNode = beforeNode->link;   /* 지울 노드의 주소를 적어 둔다 */
    beforeNode->link = deleteNode->link;         /* 앞 노드가 지울 노드의 다음을 가리킨다 */
    free(deleteNode);
}
```

### 끼우기

맨 앞에 f를 끼운다. 새 노드를 얻어 원소를 적고, 새 노드가 지금의 첫 노드를 가리키게 한 다음, `first`가 새 노드를 가리키게 한다.

```c
/* 맨 앞에 끼운다. first 자체가 바뀌므로 first의 주소를 받는다 */
void insertFront(listPointer *first, char data)
{
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = *first;           /* 새 노드가 지금의 첫 노드를 가리킨다 */
    *first = newNode;                 /* first가 새 노드를 가리킨다 */
}
```

`MALLOC(p, s)`는 `malloc(s)`로 메모리를 얻어 `p`에 넣고, 얻지 못했으면 오류를 찍고 끝내는 매크로다([동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)). 함수가 `first`의 값을 바꿔야 하므로 `first`의 주소(`listPointer *`)를 받는다([포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)).

새 노드의 링크에 지금의 첫 노드 대신 NULL을 넣고 `first`를 바꾸면 안 된다. 그러면 f가 아무것도 가리키지 않은 채 첫 노드가 되어 a부터 e로 가는 길이 끊긴다. 길이 5인 목록이 f 하나짜리가 되고, 다섯 노드는 주소를 아는 변수가 없어 돌려줄 수도 없다[^s1].


가운데, c 뒤에 f를 끼운다. 고칠 링크는 둘이고 **차례가 정해져 있다**.

```
끼우기 전     first -> [a] -> [b] -> [c] -> [d] -> [e] -> NULL
                                    ^
                                beforeNode

1: newNode->link = beforeNode->link;        2: beforeNode->link = newNode;

      [c] -----> [d]                             [c]        [d]
                  ^                               |          ^
      [f] --------+                               +--> [f] --+
```

```c
/* beforeNode 바로 뒤에 끼운다 */
void insertAfter(listPointer beforeNode, char data)
{
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = beforeNode->link; /* 1: 새 노드가 뒤 노드를 가리킨다 */
    beforeNode->link = newNode;       /* 2: 앞 노드가 새 노드를 가리킨다 */
}
```

두 줄을 바꿔 쓰면 이렇게 된다. 2를 먼저 하면 c의 링크가 f로 바뀌면서 d의 주소가 사라진다. 이어서 1을 하면 `beforeNode->link`는 이미 f라서 f가 자기 자신을 가리킨다. d와 e는 길에서 떨어져 나가고, 목록을 따라가는 고리는 f에서 끝없이 돈다[^s1].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `insertAfter`에서 `newNode->link = beforeNode->link;`가 먼저 와야 하는 근거는?</summary>

d의 주소를 적어 둔 곳이 `beforeNode->link` 한 군데뿐이기 때문이다. 그 칸을 덮어쓰기 전에 d의 주소를 새 노드의 링크로 옮겨 적어야 d로 가는 길이 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. `deleteAfter`와 `deleteFront`가 지울 노드의 주소를 `deleteNode`에 먼저 적어 두는 근거는?</summary>

링크(또는 `first`)를 고치고 나면 지울 노드를 가리키는 곳이 하나도 남지 않는다. 주소를 모르면 `free`를 부를 수 없어 그 메모리를 영영 못 돌려준다(누수). 거꾸로 `free`를 먼저 부르고 `deleteNode->link`를 읽으면 이미 돌려준 메모리를 읽게 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `insertFront`와 `deleteFront`는 `listPointer *first`를 받는데 `insertAfter`와 `deleteAfter`는 `listPointer beforeNode`를 받는 근거는?</summary>

앞의 둘은 변수 `first`에 든 값을 바꾼다. C는 인자를 값으로 복사해 넘기므로, 부른 쪽의 `first`를 바꾸려면 그 변수의 주소를 받아야 한다. 뒤의 둘이 바꾸는 것은 `beforeNode`가 가리키는 노드 안의 링크라서, 노드의 주소만 알면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 차례들의 핵심 아이디어는?</summary>

어떤 노드로 가는 하나뿐인 길을 덮어쓰기 전에, 그 주소를 다른 곳에 먼저 적어 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

두 변수의 값을 바꿀 때 한쪽을 임시 변수에 먼저 옮겨 두는 것이 같은 생각이다. [연결 스택](/Hongs_Blog/studies/data-structures/linked-stack/)의 pop, [연결 큐](/Hongs_Blog/studies/data-structures/linked-queue/)의 dequeue도 떼어 낼 노드를 `temp`에 먼저 적는다.

</details>


### 일마다 드는 비용

노드가 $$n$$개일 때다[^s1].

| 일 | 시간 | 까닭 |
|---|---|---|
| k번 노드 찾기 | $$O(k)$$ | 링크를 k번 따라간다 |
| 맨 앞에 끼우기, 맨 앞 지우기 | $$O(1)$$ | 링크 둘, 하나만 고친다 |
| 앞 노드의 주소를 쥐고 있을 때 끼우기, 지우기 | $$O(1)$$ | 같다 |
| k번 자리에 끼우기, k번 노드 지우기 | $$O(k)$$ | 앞 노드를 찾는 데 링크 $$k - 1$$번 |
| 메모리 | 원소마다 링크 한 칸이 더 든다 | |

배열과 어느 쪽을 고를지는 [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)에서 다룬다.

## 활용

- 구현: [15_singly-linked-list_impl.c](/Hongs_Blog/studies/data-structures/code/15_singly-linked-list_impl/). 아무 자리 k에서 되는 `insertAt`, `deleteAt`과 목록을 통째로 돌려주는 `freeList`도 이 파일에 있다. 연습: [연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/)
- 맨 앞에서만 넣고 빼면 스택이고([연결 리스트로 만든 스택](/Hongs_Blog/studies/data-structures/linked-stack/)), 맨 뒤에 넣고 맨 앞에서 빼면 큐다([연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/)).
- "맨 앞"만 코드가 다른 것이 번거로우면 맨 앞에 값 없는 노드를 하나 세운다: [연결 리스트의 변형](/Hongs_Blog/studies/data-structures/linked-list-variants/)
- 체인은 다른 구조의 부품으로도 쓴다: [연결 인접 리스트](/Hongs_Blog/studies/data-structures/linked-adjacency-list/), [체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/)
- 흔한 실수: NULL인지 보지 않고 `p->link->link`를 읽는 것, `free`한 노드를 다시 쓰는 것, 다 쓴 목록의 노드를 돌려주지 않는 것.

## 연결

- 선수: [포인터](/Hongs_Blog/studies/data-structures/c-pointer/)(주소를 담는 변수와 `->`), [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)(`malloc`, `free`), [연결 리스트](/Hongs_Blog/studies/algorithms/linked-list/)(같은 생각을 칸 번호 배열로 만든 것)
- 변형: [연결 리스트의 변형](/Hongs_Blog/studies/data-structures/linked-list-variants/)
- 대조: [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"연결 리스트는 끼우기가 한 번에 끝나니, k번 자리에 끼우는 일도 한 번에 끝난다"</div>

틀렸다. 한 번에 끝나는 것은 **앞 노드의 주소를 이미 쥐고 있을 때** 링크 둘을 고치는 일이다. 링크만 고치면 된다는 말이 맞아서 그럴듯해 보이지만, k번 자리의 앞 노드를 찾으려면 `first`부터 링크를 $$k - 1$$번 따라가야 한다. 무작위 자리에 끼우고 지우기를 3,000번 한 실험에서 끼울 자리를 찾느라 링크를 264,009번 따라갔다. 끼우기 한 번에 고쳐 쓴 링크는 2개뿐이다. 맨 앞, 또는 방금 다녀간 자리처럼 주소를 이미 아는 곳에서만 $$O(1)$$이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 목록 (a, b, c, d, e)에 다음을 차례로 했다. 2번 노드 지우기, 맨 앞에 f 끼우기, 그 뒤의 2번 노드 바로 뒤에 g 끼우기. 단계마다 목록을 써라.</summary>

**답:** (a, b, d, e) → (f, a, b, d, e) → (f, a, b, g, d, e).<br>
**이유:** 번호는 0부터 센다. 처음의 2번 노드는 c다. f를 끼운 뒤의 2번 노드는 b라서 g는 b와 d 사이에 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `insertAfter`의 두 줄을 `beforeNode->link = newNode; newNode->link = beforeNode->link;` 차례로 쓰면 목록이 어떻게 되는가? 어느 값이 사라져서 그런가?</summary>

**답:** 새 노드의 링크가 새 노드 자신을 가리킨다. 뒤에 있던 노드들은 `first`에서 갈 수 없게 되고, 목록을 따라가는 고리는 새 노드에서 끝없이 돈다.<br>
**이유:** 뒤 노드의 주소는 `beforeNode->link`에만 적혀 있었다. 첫 줄이 그 칸을 새 노드의 주소로 덮어썼으므로, 둘째 줄이 읽는 `beforeNode->link`는 이미 새 노드다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 맨 앞 끼우기를 `newNode->link = NULL; first = newNode;`로 짰다. 목록 (a, b, c, d, e)에 f를 끼우면 `first`에서 따라갈 수 있는 노드는 몇 개인가? 나머지 노드는 어떻게 되는가?</summary>

**답:** f 하나뿐이다. a부터 e까지 다섯 노드는 메모리에 남아 있지만 주소를 아는 변수가 없어 쓸 수도, `free`로 돌려줄 수도 없다.<br>
**이유:** `first`를 덮어쓰기 전에 a의 주소를 `newNode->link`에 옮겨 적었어야 한다. 옳은 줄은 `newNode->link = first;`다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 노드가 다섯인 목록에서 `first->link->link->link->link->link`의 값은 무엇인가? 이어서 `->data`를 읽으면 어떻게 되는가? 넷째 노드의 원소를 읽는 식을 써라.</summary>

**답:** NULL이다. 링크를 다섯 번 따라가면 마지막 노드의 링크에 닿는다. NULL에서 `->data`를 읽으면 없는 노드를 읽는 것이라 프로그램이 죽는다. 넷째 노드의 원소는 `first->link->link->link->data`다.

</details>


[^s1]: 구현 코드로 확인했다.
{% endraw %}
