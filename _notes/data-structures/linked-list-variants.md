---
layout: "note"
title: "연결 리스트의 변형"
display_title: "연결 리스트의 변형 (Variants of Linked Lists)"
kind: "concept"
kind_label: "자료구조"
num: "17"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Header Node", "헤더 노드", "머리 노드", "Circular List", "원형 리스트", "원형 연결 리스트", "Doubly Linked List", "이중 연결 리스트", "Doubly Linked Circular List", "이중 원형 연결 리스트", "headerNode", "firstNode", "lastNode", "llink", "rlink"]
description: "한 줄로 이은 목록을 세 군데서 조금씩 고친 것이다. 맨 앞에 값 없는 노드를 하나 세우면 \"맨 앞에 끼우기\"가 다른 자리와 똑같은 일이 되고, 마지막 노드를 첫 노드에 이으면 어느 노드에서 출발해도 한 바퀴를 돈다. 노드마다 앞쪽을 가리키는 주소를 하나 더 적으면 뒤로도 갈 수 …"
prev_url: "/studies/data-structures/array-vs-linked-list/"
prev_title: "배열과 연결 리스트 비교"
next_url: "/studies/data-structures/linked-stack/"
next_title: "연결 리스트로 만든 스택"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/linked-list-variants/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 줄로 이은 목록을 세 군데서 조금씩 고친 것이다. 맨 앞에 값 없는 노드를 하나 세우면 "맨 앞에 끼우기"가 다른 자리와 똑같은 일이 되고, 마지막 노드를 첫 노드에 이으면 어느 노드에서 출발해도 한 바퀴를 돈다. 노드마다 앞쪽을 가리키는 주소를 하나 더 적으면 뒤로도 갈 수 있고, 그 노드만 알아도 바로 뺄 수 있다. 고칠수록 편해지지만 노드가 커지고, 끼우고 뺄 때 고쳐 쓸 주소도 는다.

</div>


## 예시로 보기

[단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)에는 번거로운 곳이 셋 있었다. 맨 앞에 끼우고 지울 때만 `first`를 바꾸는 코드가 따로 필요하다. 끝까지 가면 NULL이라 처음으로 돌아가지 못한다. 노드를 지우려면 그 앞 노드를 처음부터 찾아야 한다. 하나씩 풀면 아래 네 모양이 나온다[^1].

```
1. 헤더 노드가 있는 체인
   headerNode -> [  ] -> [a] -> [b] -> [c] -> [d] -> [e] -> NULL
                 값 없음

2. 원형 리스트
   firstNode -> [a] -> [b] -> [c] -> [d] -> [e] --+
                 ^                                |
                 +--------------------------------+

3. 이중 연결 리스트
   firstNode                               lastNode
       |                                       |
       v                                       v
   NULL <- [a] <-> [b] <-> [c] <-> [d] <-> [e] -> NULL

4. 헤더 노드가 있는 이중 원형 리스트
   headerNode -> [  ] <-> [a] <-> [b] <-> [c] <-> [d] <-> [e]
                  ^                                        ^
                  +----------------------------------------+
                  헤더 노드의 왼쪽이 e, e의 오른쪽이 헤더 노드
```

2와 3만 합쳐, 헤더 노드 없이 a와 e를 양쪽으로 이은 이중 원형 리스트도 있다[^3]. 4는 세 가지 고침을 모두 한 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 빈 목록의 모양 둘(헤더 체인은 링크가 NULL, 이중 원형은 두 링크가 헤더 자신), 0번 자리에 끼우고 지워도 `headerNode`가 그대로인 것, 원형 리스트에서 어느 노드로 출발해도 다섯 노드를 한 번씩 만나는 것, 오른쪽으로 abcde·왼쪽으로 edcba, 카드 C1, 헤더 체인과 이중 원형에서 무작위 끼우기·지우기 3,000번씩이 배열 모형과 같고 모든 노드에서 `p->rlink->llink == p == p->llink->rlink`, malloc 횟수와 free 횟수가 같음 — [17_linked-list-variants_impl.c](/Hongs_Blog/studies/data-structures/code/17_linked-list-variants_impl/)</div>

</div>


## 네 가지 변형

### 헤더 노드

헤더 노드(header node)는 목록 맨 앞에 세워 두는, 원소를 담지 않는 노드다. 빈 목록에도 헤더 노드 하나는 있고, 그 링크가 NULL이다[^1]. 0번 원소의 "앞 노드"가 늘 있으므로, 끼우기와 지우기가 자리에 상관없이 같은 코드가 된다.

```c
/* k번 자리에 끼운다. k가 0이어도 다른 자리와 같은 코드다 */
int insertAt(listPointer headerNode, int k, char data)
{
    listPointer beforeNode = headerNode;              /* 0번 원소의 앞 노드는 헤더 노드다 */
    for (int i = 0; i < k && beforeNode != NULL; i++) beforeNode = beforeNode->link;
    if (k < 0 || beforeNode == NULL) return 0;
    listPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->link = beforeNode->link;
    beforeNode->link = newNode;
    return 1;
}
```

단순 연결 리스트의 `insertFront`는 `first`를 바꿔야 해서 `first`의 주소를 받았다. 여기서는 `headerNode`의 값이 끝까지 바뀌지 않아 그럴 필요가 없다[^s1].

### 원형 리스트

원형 리스트(circular list)는 마지막 노드의 링크가 NULL 대신 첫 노드를 가리킨다[^2]. 어느 노드에서 출발해도 링크만 따라 모든 노드를 만난다. 대신 "NULL이 나오면 끝"이라는 멈춤 조건을 쓸 수 없다. 출발한 노드로 돌아왔는지를 본다.

```c
/* start에서 출발해 한 바퀴 돌며 노드를 센다. NULL이 없으니 "출발한 곳에 돌아왔나"로 멈춘다 */
int countCircular(listPointer start)
{
    if (start == NULL) return 0;
    int n = 0;
    listPointer p = start;
    do {
        n++;
        p = p->link;
    } while (p != start);
    return n;
}
```

`while (p != NULL)`로 돌면 영영 끝나지 않는다. 먼저 한 노드를 세고 나서 조건을 봐야 하므로 `do … while`을 쓴다.

### 이중 연결 리스트

이중 연결 리스트(doubly linked list)는 노드마다 링크가 둘이다. 하나는 오른쪽(뒤) 노드를, 하나는 왼쪽(앞) 노드를 가리킨다. 첫 노드의 왼쪽 링크와 마지막 노드의 오른쪽 링크는 NULL이고, 양 끝을 `firstNode`와 `lastNode`가 가리킨다[^3]. 뒤에서 앞으로도 따라갈 수 있다.

### 헤더 노드가 있는 이중 원형 리스트

이중 연결 리스트의 양 끝을 헤더 노드로 이어 고리로 만든다. 헤더 노드의 오른쪽이 첫 원소, 왼쪽이 마지막 원소다. 빈 목록은 헤더 노드의 두 링크가 모두 헤더 노드 자신을 가리킨다[^4].

```c
typedef struct dnode *dPointer;
typedef struct dnode {
    dPointer llink;           /* 왼쪽(앞) 노드 */
    char data;
    dPointer rlink;           /* 오른쪽(뒤) 노드 */
} dnode;

/* node 바로 오른쪽에 끼운다. 링크 네 개를 쓴다 */
void dinsert(dPointer node, char data)
{
    dPointer newNode;
    MALLOC(newNode, sizeof(*newNode));
    newNode->data = data;
    newNode->llink = node;             /* 새 노드의 왼쪽은 node */
    newNode->rlink = node->rlink;      /* 새 노드의 오른쪽은 node의 옛 오른쪽 */
    node->rlink->llink = newNode;      /* 옛 오른쪽 노드의 왼쪽은 새 노드 */
    node->rlink = newNode;             /* node의 오른쪽은 새 노드 */
}

/* deleted를 뺀다. 앞 노드를 찾을 필요가 없다. 헤더 노드는 지우지 않는다 */
int ddelete(dPointer headerNode, dPointer deleted)
{
    if (deleted == headerNode) return 0;
    deleted->llink->rlink = deleted->rlink;   /* 왼쪽 노드가 오른쪽 노드를 가리킨다 */
    deleted->rlink->llink = deleted->llink;   /* 오른쪽 노드가 왼쪽 노드를 가리킨다 */
    free(deleted);
    return 1;
}
```

모든 노드에 왼쪽 노드와 오른쪽 노드가 있으니 맨 앞·맨 뒤·빈 목록을 따로 다룰 `if`가 없다. 늘 지켜야 할 규칙(표현 불변식)은 하나다. 헤더 노드를 포함한 모든 노드 `p`에서 `p->rlink->llink == p`이고 `p->llink->rlink == p`다. "내 오른쪽 노드의 왼쪽은 나, 내 왼쪽 노드의 오른쪽도 나"라는 뜻이다[^s1].

`dinsert`의 넷째 줄(`node->rlink = newNode`)은 `node->rlink`를 읽는 둘째·셋째 줄보다 뒤에 와야 한다. 먼저 쓰면 그 두 줄이 읽는 `node->rlink`가 이미 새 노드라서, 옛 오른쪽 노드가 아니라 새 노드 자신의 링크를 고친다. [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)의 "덮어쓰기 전에 옮겨 적는다"와 같은 까닭이다.

### 무엇을 얻고 무엇을 치르나

| 변형 | 고친 것 | 얻는 것 | 치르는 것 |
|---|---|---|---|
| 헤더 노드 | 맨 앞에 값 없는 노드 | 맨 앞에 끼우기·지우기가 다른 자리와 같은 코드 | 노드 하나 |
| 원형 | 마지막 링크가 첫 노드로 | 어디서 출발해도 한 바퀴 | NULL로 끝을 알 수 없다. 멈춤 조건을 틀리면 끝없이 돈다 |
| 이중 | 노드마다 왼쪽 링크 추가 | 뒤로도 간다. 노드만 알면 $$O(1)$$에 뺀다 | 노드마다 링크 한 칸 더. 끼우기에 링크 4개, 지우기에 2개 |
| 이중 원형 + 헤더 | 셋 모두 | 위의 것 모두. 마지막 원소도 `headerNode->llink`로 한 번에 간다 | 위의 것 모두 |

64비트 컴퓨터에서 재면 `char` 원소 하나짜리 노드가 링크 하나일 때 16바이트, 링크 둘일 때 24바이트다[^s1].

## 활용

- 구현: [17_linked-list-variants_impl.c](/Hongs_Blog/studies/data-structures/code/17_linked-list-variants_impl/). 연습: [연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/)
- [연결 리스트](/Hongs_Blog/studies/algorithms/linked-list/) 문서의 `prev`, `next` 두 배열이 이중 연결 리스트다. 그 코드의 `if p != -1`, `if q != n`이 맨 앞과 맨 뒤를 따로 다루는 줄이고, 헤더 노드로 고리를 만들면 이런 줄이 없어진다[^s1].
- 흔한 실수: 원형 리스트를 `while (p != NULL)`로 도는 것, 이중 연결 리스트에서 링크 넷 가운데 하나를 빠뜨려 한쪽 방향으로만 이어지게 두는 것, 헤더 노드를 원소로 세거나 지우는 것.

## 연결

- 선수: [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)
- 같은 생각을 칸 번호 배열로 만든 것: [연결 리스트](/Hongs_Blog/studies/algorithms/linked-list/)
- 배열과 견주기: [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 헤더 노드가 있는 이중 원형 리스트에 (a, b, c)가 들어 있다. b를 지운 다음, 헤더 노드 바로 오른쪽에 d를 끼운다. 단계마다 바뀌는 링크를 모두 쓰고 마지막 목록을 써라.</summary>

**답:** b를 지울 때 두 개가 바뀐다. a의 오른쪽 링크가 c로, c의 왼쪽 링크가 a로 간다. d를 끼울 때 네 개를 쓴다. d의 왼쪽은 헤더 노드, d의 오른쪽은 a, a의 왼쪽은 d, 헤더 노드의 오른쪽은 d다. 마지막 목록은 (d, a, c)다.<br>
**이유:** 지우기는 양옆 노드가 서로를 가리키게 하면 끝난다. 끼우기는 새 노드의 두 링크와, 양옆 노드가 새 노드를 가리키는 두 링크를 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 헤더 노드가 있으면 "맨 앞에 끼우기"를 위한 코드가 따로 없어도 되는 까닭은?</summary>

**답:** 끼우기는 "앞 노드의 링크"를 고치는 일이다. 헤더 노드가 없으면 0번 원소에는 앞 노드가 없어서, 노드의 링크 대신 변수 `first`를 고쳐야 한다. 헤더 노드가 있으면 0번 원소의 앞 노드가 헤더 노드라, 모든 자리가 "앞 노드의 링크를 고친다"로 같아진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 일에 어느 변형이 알맞은가? (가) 둥글게 앉은 사람들에게 차례를 계속 돌려 가며 준다. (나) 어떤 노드의 주소만 받아 그 노드를 바로 목록에서 뺀다. (다) 단순 연결 리스트의 코드에서 "k가 0이면"으로 갈리는 부분을 없애고 싶다.</summary>

**답:** (가)는 원형 리스트다. 마지막 사람 다음이 첫 사람이라 링크만 따라가면 된다. (나)는 이중 연결 리스트다. 왼쪽 링크로 앞 노드를 바로 안다. 링크가 하나뿐이면 앞 노드를 처음부터 찾아야 한다. (다)는 헤더 노드다.

</details>


[^1]: 자료구조 5회 강의 자료 「DS_Week5_Lecture_2024」, p.19~20 (Chain With Header Node, Empty Chain With Header Node: 헤더 노드의 링크가 NULL)
[^2]: 같은 자료, p.21 (Circular List: e의 링크가 firstNode가 가리키는 a로 돌아온다)
[^3]: 같은 자료, p.22~23 (Doubly Linked List: firstNode, lastNode, 양 끝의 NULL. Doubly Linked Circular List: a와 e가 양방향으로 이어진다)
[^4]: 같은 자료, p.24~25 (Doubly Linked Circular List With Header Node, 빈 목록은 두 링크가 헤더 노드 자신)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.19~25에는 그림과 제목만 있다. 네 그림을 한데 모은 ASCII 그림, 모든 코드(`llink`, `rlink`라는 이름 포함), 표현 불변식, `dinsert`의 줄 차례 설명, 얻는 것과 치르는 것의 표, 노드 크기, 알고리즘 과목 문서와 이은 말, 카드 C1~C3은 보탠 것이다. 구현 코드로 확인했다.
{% endraw %}
