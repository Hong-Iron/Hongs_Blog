---
layout: "note"
title: "연결 리스트로 만든 스택"
display_title: "연결 리스트로 만든 스택 (Linked Stack)"
kind: "concept"
kind_label: "자료구조"
num: "18"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Linked Stack", "연결 스택", "연결된 스택", "StackNode", "LinkedStackType", "top", "push", "pop", "is_empty"]
description: "하나를 쌓을 때마다 노드를 새로 만들어 줄의 맨 앞에 끼우고, 꺼낼 때는 맨 앞 노드를 떼어 낸다. 맨 앞에서만 넣고 빼니 둘 다 한 번에 끝나고, 칸 수를 미리 정하지 않아도 메모리가 남아 있는 한 계속 쌓인다. 대신 원소마다 다음 노드의 주소를 적을 칸이 하나씩 더 들고, 넣고…"
prev_url: "/studies/data-structures/linked-list-variants/"
prev_title: "연결 리스트의 변형"
next_url: "/studies/data-structures/linked-queue/"
next_title: "연결 리스트로 만든 큐"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/linked-stack/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

하나를 쌓을 때마다 노드를 새로 만들어 줄의 맨 앞에 끼우고, 꺼낼 때는 맨 앞 노드를 떼어 낸다. 맨 앞에서만 넣고 빼니 둘 다 한 번에 끝나고, 칸 수를 미리 정하지 않아도 메모리가 남아 있는 한 계속 쌓인다. 대신 원소마다 다음 노드의 주소를 적을 칸이 하나씩 더 들고, 넣고 뺄 때마다 메모리를 얻고 돌려주는 일을 한다.

</div>


## 예시로 보기

[배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/)은 정해 둔 칸 수까지만 담는다. 얼마나 쌓일지 모르면 칸 수를 넉넉히 잡거나 가득 찰 때마다 배열을 옮겨야 한다. 연결 리스트로 만들면 처음에 크기를 정할 필요가 없다[^1].

3, 7, 9를 차례로 쌓은 스택을 두 방법으로 그리면 이렇다[^2].

```
배열 스택                    연결 스택

칸 4 |   |                  top
칸 3 |   |                   |
칸 2 | 9 | <- top            v
칸 1 | 7 |                  [9] -> [7] -> [3] -> NULL
칸 0 | 3 |
```

연결 스택에서는 `top`이 맨 위 원소의 노드를 가리키고, 노드마다 링크가 바로 아래 원소의 노드를 가리킨다. 맨 아래 노드의 링크는 NULL이다. 새 원소는 늘 `top`이 가리키는 자리에 끼우고, 꺼낼 때는 `top`이 가리키는 노드를 뗀 뒤 `top`을 그 아래 노드로 옮긴다[^2].

| 한 일 | 돌려준 값 | 체인 (맨 왼쪽이 top) |
|---|---|---|
| push 3, push 7, push 9 | | 9 → 7 → 3 |
| pop | 9 | 7 → 3 |
| push 5 | | 5 → 7 → 3 |
| pop, pop | 5, 7 | 3 |
| pop | 3 | (비었음. top은 NULL) |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 위 그림과 추적 표, 카드 C1·C2, 무작위 연산 5,000번에서 배열 스택(두 배 늘리기 판)과 꺼낸 값·맨 위·빔 판정이 같고 살아 있는 노드 수가 늘 원소 수와 같음, malloc 횟수와 free 횟수가 같음 — [18_linked-stack_impl.c](/Hongs_Blog/studies/data-structures/code/18_linked-stack_impl/)</div>

</div>


## 정의

하는 일은 [배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/)과 같다. 넣기(push), 꺼내기(pop), 비었는지 보기다. 달라진 것은 담는 방법이다. 원소마다 노드 하나를 두고, 맨 위 노드의 주소를 `top`에 적는다[^3].

```c
typedef int element;

typedef struct StackNode {
    element item;
    struct StackNode *link;       /* 바로 아래 원소의 노드. 맨 아래면 NULL */
} StackNode;

typedef struct {
    StackNode *top;               /* 맨 위 원소의 노드. 비었으면 NULL */
} LinkedStackType;

void init(LinkedStackType *s)
{
    s->top = NULL;
}

int is_empty(LinkedStackType *s)
{
    return s->top == NULL;
}

void push(LinkedStackType *s, element item)
{
    StackNode *temp = (StackNode *)malloc(sizeof(StackNode));
    if (temp == NULL) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    temp->item = item;
    temp->link = s->top;          /* 새 노드가 지금의 맨 위를 가리킨다 */
    s->top = temp;                /* 새 노드가 맨 위가 된다 */
}

element pop(LinkedStackType *s)
{
    if (is_empty(s)) {
        fprintf(stderr, "error\n");
        exit(1);
    }
    StackNode *temp = s->top;     /* 떼어 낼 노드를 적어 둔다 */
    element item = temp->item;
    s->top = s->top->link;        /* 바로 아래 노드가 맨 위가 된다 */
    free(temp);
    return item;
}
```

`push`는 [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)의 맨 앞에 끼우기이고, `pop`은 맨 앞 지우기다. 두 줄의 차례도 그대로다. `push`에서는 새 노드의 링크를 먼저 채우고 나서 `top`을 바꾼다. `pop`에서는 떼어 낼 노드의 주소와 값을 먼저 적어 두고 나서 `top`을 옮기고 `free`한다[^4].

늘 지켜야 할 규칙(표현 불변식)은 이렇다. `top`에서 링크를 따라가면 맨 위 원소부터 맨 아래 원소까지 차례로 만나고 NULL에서 끝난다. 노드 수는 스택에 든 원소 수와 같다[^s1].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 p.29의 첫 구조체는 `typedef struct StackNode { … } StackeNode;`로 끝나고, 바로 아래 구조체는 `StackNode *top;`을 쓴다. p.30과 p.31의 함수도 `StackNode`를 쓴다.<br>
문제점: typedef로 만든 이름은 `StackeNode`(e가 하나 더 있다)라서 `StackNode`라는 형 이름이 없다. `struct StackNode`라고 써야 하는 자리에 `StackNode`만 써서 컴파일되지 않는다.<br>
수정안: typedef 이름을 `StackNode`로 고친다.<br>
근거: p.29의 두 구조체를 그대로 컴파일하면 "must use 'struct' tag to refer to type 'StackNode'" 오류가 난다[^s2].

</div>


### 배열 스택과 견주기

두 구현을 견주면 이렇다[^1][^s1].

| | 배열 스택 | 연결 스택 |
|---|---|---|
| 담는 개수 | 정해 둔 칸 수까지. 넘으면 끝내거나 배열을 늘린다 | 정하지 않는다. `malloc`이 메모리를 주는 동안 |
| push, pop | $$O(1)$$. 배열을 늘리는 순간만 $$O(\text{칸 수})$$ | 늘 $$O(1)$$ |
| 원소마다 덤으로 쓰는 것 | 없음. 대신 안 쓴 빈칸이 있다 | 링크 한 칸 |
| 넣고 뺄 때 하는 일 | 정수 하나를 올리고 내린다 | `malloc`과 `free`를 한 번씩 부른다 |

## 활용

- 구현: [18_linked-stack_impl.c](/Hongs_Blog/studies/data-structures/code/18_linked-stack_impl/). 맨 위를 보기만 하는 `peek`과 남은 노드를 모두 돌려주는 `destroy`도 이 파일에 있다. 연습: [연결 리스트 연습](/Hongs_Blog/studies/data-structures/linked-list-practice/)
- 다 쓴 스택은 `destroy`로 비운다. 노드가 남은 채 `LinkedStackType` 변수만 버리면 그 노드들을 돌려줄 길이 없어진다([동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)의 누수).
- `push`가 `malloc`에 실패했을 때 "error"만 찍고 돌아오면, 부른 쪽은 원소가 들어간 줄 알고 계속 간다. 그래서 `pop`처럼 프로그램을 끝낸다[^s1].
- 흔한 실수: `pop`에서 `free(temp)`를 먼저 부르고 `temp->item`을 읽는 것, 빈 스택인지 보지 않고 `s->top->link`를 읽는 것.

## 연결

- 선수: [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)(맨 앞에 끼우기와 맨 앞 지우기), [배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/)(같은 연산의 배열 판)
- 스택이 무엇이고 어디에 쓰나: [스택](/Hongs_Blog/studies/algorithms/stack/)
- 같은 재료로 만든 큐: [연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/)
- 배열과 연결 리스트 가운데 고르기: [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 빈 연결 스택에 push 1, push 2, pop, push 3, push 4, pop을 차례로 했다. 꺼낸 값 둘과, 남은 체인을 `top`부터 써라. 살아 있는 노드는 몇 개인가?</summary>

**답:** 꺼낸 값은 2와 4다. 남은 체인은 top → 3 → 1 → NULL이고 노드는 2개다.<br>
**이유:** push마다 노드 하나를 얻고 pop마다 하나를 돌려준다. 네 번 얻고 두 번 돌려줬다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 스택의 맨 위를 체인의 맨 앞 노드로 잡는다. 거꾸로 체인의 맨 끝 노드를 맨 위로 잡으면 pop이 왜 느려지는가?</summary>

**답:** 맨 끝 노드를 떼려면 그 앞 노드의 링크를 NULL로 고쳐야 한다. 링크가 한 방향뿐이라 앞 노드는 처음부터 따라가야 찾는다. 노드가 $$n$$개면 링크를 $$n - 2$$번 따라가므로 pop이 $$O(n)$$이 된다.<br>
**이유:** 체인에서 한 번에 끝나는 일은 맨 앞에 끼우기와 맨 앞 지우기다. 스택은 넣는 곳과 빼는 곳이 같으니, 둘 다 맨 앞에서 하면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 배열 스택과 연결 스택 가운데 무엇이 알맞은가? (가) 작은 기기에서 메모리를 처음에 한 번만 잡고, 도는 동안에는 `malloc`을 부르지 않으려 한다. 깊이는 많아야 64다. (나) 깊이가 수십일 때도 있고 수십만일 때도 있는데, 넣는 일 한 번이 오래 걸리는 순간이 있으면 안 된다.</summary>

**답:** (가)는 배열 스택이다. 칸 64개를 처음에 잡으면 그 뒤로 메모리를 얻을 일이 없다. (나)는 연결 스택이다. 배열을 두 배로 늘리는 판은 가득 차는 순간의 push가 원소를 모두 옮기느라 오래 걸리지만, 연결 스택의 push는 늘 노드 하나를 얻는 일뿐이다.

</details>


[^1]: 자료구조 5회 강의 자료 「DS_Week5_Lecture_2024」, p.27 (배열로 만든 스택은 정해진 개수까지만 된다. 연결 리스트로 만들면 개수 제한이 없고 처음에 크기를 정할 필요가 없다)
[^2]: 같은 자료, p.28 (새 원소는 늘 top에 끼우고, top이 가리키는 원소를 빼며 top을 그 앞 노드로 옮긴다. 3, 7, 9를 쌓은 배열 스택과 연결 스택의 그림)
[^3]: 같은 자료, p.29 (element, StackNode, LinkedStackType의 선언)
[^4]: 같은 자료, p.30~31 (push와 pop의 코드)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `init`, `is_empty`의 본문(슬라이드는 `is_empty(s)`를 부르기만 한다), `push`가 실패했을 때 끝내게 한 것(슬라이드의 `push`는 "error"를 찍고 돌아온다), `pop`의 `int item`을 `element item`으로 맞춘 것, 표현 불변식, 추적 표, 견주는 표의 아래 두 줄, 카드 C1~C3은 슬라이드에 없다. 구현 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.29의 선언을 그대로 옮겨 Apple clang 21로 컴파일한 결과다.
{% endraw %}
