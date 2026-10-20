---
layout: "note"
title: "연결 리스트 연습"
display_title: "연결 리스트 연습"
kind: "practice"
kind_label: "연습"
num: "19"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "연결 리스트의 기본 코드를 손으로 따라가고, 같은 줄들로 조금 다른 일을 해 보는 네 문제다. 노드 번호는 0부터 센다. 그림을 먼저 그리고, 링크를 고치는 줄마다 화살표 하나를 지우고 새로 그리면 틀리지 않는다."
prev_url: "/studies/data-structures/circular-queue-ladder/"
prev_title: "원형 큐 추적 예제 사다리"
next_url: "/studies/data-structures/tree-traversal-ladder/"
next_title: "이진 트리 순회 예제 사다리"
math: false
mermaid: false
code_count: 4
code_files: [{"t": "19_linked-list-practice_p1.c", "u": "/studies/data-structures/code/19_linked-list-practice_p1/", "r": "문제 1 풀이"}, {"t": "19_linked-list-practice_p2.c", "u": "/studies/data-structures/code/19_linked-list-practice_p2/", "r": "문제 2 풀이"}, {"t": "19_linked-list-practice_p3.c", "u": "/studies/data-structures/code/19_linked-list-practice_p3/", "r": "문제 3 풀이"}, {"t": "19_linked-list-practice_p4.c", "u": "/studies/data-structures/code/19_linked-list-practice_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/data-structures/linked-list-practice/"
---
{% raw %}
연결 리스트의 기본 코드를 손으로 따라가고, 같은 줄들로 조금 다른 일을 해 보는 네 문제다. 노드 번호는 0부터 센다. 그림을 먼저 그리고, 링크를 고치는 줄마다 화살표 하나를 지우고 새로 그리면 틀리지 않는다.

## p1 · 체인 따라가기

**문제.** 체인 (a, b, c, d, e)의 첫 노드를 `first`가 가리킨다. (가) `first->link->link->data`의 값은? (나) `first->link->link->link->link->data`의 값은? (다) `first->link->link->link->link->link`의 값은? (라) 모든 원소를 차례로 적는 함수 `printList`와 노드 수를 세는 함수 `length`를 써라.

**사용 개념.** [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)의 "k번 노드 찾기"

**풀이 전략.** `->link` 하나가 "다음 노드로 한 걸음"이다. `->link`의 개수를 세면 몇 번 노드인지 나온다. 모든 노드를 다 보려면 걸음 수를 정해 두지 않고, 포인터가 NULL이 될 때까지 걷는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

(가) *걸음 수 세기:* `->link`가 둘이니 2번 노드, c다.<br>
(나) `->link`가 넷이니 4번 노드, e다.<br>
(다) *끝을 넘는가 보기:* `->link`가 다섯이다. 4번 노드 e의 링크를 읽은 것이라 NULL이다. 여기에 `->data`를 붙이면 없는 노드를 읽어 프로그램이 죽는다.<br>
(라) *NULL까지 걷기:* 포인터 `p`를 `first`에서 시작해, NULL이 아닌 동안 할 일을 하고 `p = p->link`로 한 걸음 간다.

```c
/* 원소를 맨 앞부터 차례로 out에 적는다 */
void printList(listPointer first, char *out)
{
    int n = 0;
    for (listPointer p = first; p != NULL; p = p->link)   /* NULL에 닿을 때까지 링크를 따라간다 */
        out[n++] = p->data;
    out[n] = '\0';
}

/* 노드 수 */
int length(listPointer first)
{
    int n = 0;
    for (listPointer p = first; p != NULL; p = p->link) n++;
    return n;
}
```

빈 목록(`first`가 NULL)이면 고리를 한 번도 돌지 않아 빈 글과 0이 나온다. 따로 다룰 필요가 없다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). (가) ~ (다)의 값, `printList`가 abcde·`length`가 5, 빈 목록과 노드 하나짜리 목록, 변형의 `indexOf` — [19_linked-list-practice_p1.c](/Hongs_Blog/studies/data-structures/code/19_linked-list-practice_p1/)</div>

</div>


**변형 문제.** 글자 `x`가 든 첫 노드의 번호를 돌려주는 `indexOf`를 써라. 없으면 −1을 돌려준다. d를 찾으면 링크를 몇 번 따라가는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`length`의 고리에서 걸음 수 `k`를 세다가 `p->data == x`인 순간 `k`를 돌려주고, NULL까지 가면 −1을 돌려준다. d는 3번 노드라 링크를 3번 따라간다. 맨 뒤에 있거나 없는 글자를 찾으면 노드를 모두 보므로, 찾기는 노드 수에 비례하는 시간이 든다.

</details>


## p2 · 지우고 끼우기

**문제.** 체인 (a, b, c, d, e)에 다음을 차례로 한다. ① 0번 노드 지우기. ② 그 뒤의 1번 노드 바로 뒤에 f 끼우기. ③ 그 뒤의 3번 노드 지우기. 단계마다 쓰는 C 줄과 그 뒤의 목록을 써라.

**사용 개념.** [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)의 지우기와 끼우기

**풀이 전략.** 고칠 링크는 늘 "앞 노드" 안에 있다. 그래서 먼저 앞 노드를 찾는다. 0번 노드에는 앞 노드가 없으니 `first`를 고친다. 그리고 덮어쓸 주소는 먼저 다른 곳에 옮겨 적는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

① *맨 앞이라 `first`를 고친다.*

```c
deleteNode = first;
first = first->link;
free(deleteNode);
```

목록은 (b, c, d, e)다.

② *앞 노드 찾기:* 지금의 1번 노드는 c다. `beforeNode = first->link;`<br>
*끼우기:* 새 노드가 뒤를 먼저 가리키고, 그다음 앞 노드가 새 노드를 가리킨다.

```c
beforeNode = first->link;
MALLOC(newNode, sizeof(*newNode));
newNode->data = 'f';
newNode->link = beforeNode->link;
beforeNode->link = newNode;
```

목록은 (b, c, f, d, e)다.

③ *앞 노드 찾기:* 3번 노드는 d이고 그 앞 2번 노드는 f다. `beforeNode = first->link->link;`<br>
*지우기:* 지울 노드의 주소를 적어 두고 링크를 건너뛰게 한다.

```c
beforeNode = first->link->link;
deleteNode = beforeNode->link;
beforeNode->link = beforeNode->link->link;
free(deleteNode);
```

목록은 (b, c, f, e)다. 노드는 다섯에서 하나 줄고, 하나 늘고, 하나 줄어 넷이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 세 단계의 목록 bcde, bcfde, bcfe와 단계마다 고쳐진 링크, 변형의 뒤집기(efcb, 두 번 뒤집으면 원래대로, 빈 목록과 길이 1 ~ 10) — [19_linked-list-practice_p2.c](/Hongs_Blog/studies/data-structures/code/19_linked-list-practice_p2/)</div>

</div>


**변형 문제.** 노드를 새로 만들지 않고 체인의 방향을 뒤집는 함수 `reverse`를 써라. (b, c, f, e)가 (e, f, c, b)가 된다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

노드마다 링크를 "뒤 노드" 대신 "앞 노드"를 가리키게 고치면 된다. 링크를 고치면 뒤 노드의 주소가 사라지므로, 고치기 전에 `next`에 옮겨 적는다.

```c
/* 체인의 방향을 뒤집는다. 노드를 새로 만들지 않고 링크만 고친다 */
void reverse(listPointer *first)
{
    listPointer before = NULL;            /* 이미 뒤집은 부분의 맨 앞 */
    listPointer current = *first;         /* 지금 고칠 노드 */
    while (current != NULL) {
        listPointer next = current->link; /* 덮어쓰기 전에 다음 노드를 적어 둔다 */
        current->link = before;           /* 링크를 거꾸로 돌린다 */
        before = current;
        current = next;
    }
    *first = before;                      /* 옛 마지막 노드가 첫 노드다 */
}
```

노드마다 한 번씩 들르므로 노드 수에 비례하는 시간이 든다. 옛 첫 노드 b의 링크는 첫 바퀴에서 NULL이 되어 새 마지막 노드가 된다.

</details>


## p3 · 연결 스택으로 글자 뒤집기

**문제.** 빈 연결 스택에 D, A, T, A를 차례로 push한다. (가) push할 때마다 체인을 `top`부터 써라. (나) 모두 pop하면 어떤 순서로 나오는가? (다) 이것으로 글자 순서를 뒤집는 함수 `reverseWord`를 써라.

**사용 개념.** [연결 리스트로 만든 스택](/Hongs_Blog/studies/data-structures/linked-stack/)

**풀이 전략.** push는 체인의 맨 앞에 끼우기라서, 나중에 넣은 것일수록 `top`에 가깝다. pop은 맨 앞부터 떼니 넣은 순서의 거꾸로 나온다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

(가) *맨 앞에 끼우기:* D → A D → T A D → A T A D. 왼쪽이 `top`이다. 마지막 A가 `top`이고 D의 링크가 NULL이다.<br>
(나) *맨 앞부터 떼기:* A, T, A, D.<br>
(다) *모두 쌓고 모두 꺼내기:*

```c
/* word의 글자를 거꾸로 out에 적는다 */
void reverseWord(const char *word, char *out)
{
    LinkedStackType s;
    init(&s);
    for (int i = 0; word[i] != '\0'; i++)
        push(&s, word[i]);            /* 앞 글자부터 차례로 쌓는다 */
    int n = 0;
    while (!is_empty(&s))
        out[n++] = (char)pop(&s);     /* 맨 위, 곧 마지막 글자부터 나온다 */
    out[n] = '\0';
}
```

글자 수만큼 노드를 얻었다가 모두 돌려준다. "DATA"면 노드가 많을 때 4개다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 체인 D, AD, TAD, ATAD와 꺼내는 순서 ATAD, `reverseWord`("DATA" → "ATAD", "stack" → "kcats", 빈 글, 한 글자), 노드가 남지 않음 — [19_linked-list-practice_p3.c](/Hongs_Blog/studies/data-structures/code/19_linked-list-practice_p3/)</div>

</div>


**변형 문제.** 스택 대신 큐에 D, A, T, A를 넣었다가 모두 빼면 무엇이 나오는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

D, A, T, A 그대로다. 큐는 먼저 넣은 것을 먼저 내놓으니 순서가 바뀌지 않는다. 순서를 뒤집는 일은 스택만 한다.

</details>


## p4 · 연결 큐 따라가기

**문제.** 빈 연결 큐에 enqueue 5, enqueue 8, dequeue, enqueue 2, dequeue, dequeue를 차례로 한다. (가) 단계마다 돌려준 값, `count`, `front`와 `rear`가 가리키는 원소를 써라. (나) `front`와 `rear`가 함께 바뀌는 단계는 어디인가?

**사용 개념.** [연결 리스트로 만든 큐](/Hongs_Blog/studies/data-structures/linked-queue/)

**풀이 전략.** 넣기는 `rear` 쪽, 빼기는 `front` 쪽만 건드린다. 예외는 큐가 비는 순간과 빈 큐가 차는 순간이다. 노드가 하나뿐이면 그 노드가 맨 앞이자 맨 뒤라서 두 포인터가 같은 노드를 가리킨다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 한 일 | 돌려준 값 | count | front | rear |
|---|---|---|---|---|
| enqueue 5 | | 1 | 5 | 5 |
| enqueue 8 | | 2 | 5 | 8 |
| dequeue | 5 | 1 | 8 | 8 |
| enqueue 2 | | 2 | 8 | 2 |
| dequeue | 8 | 1 | 2 | 2 |
| dequeue | 2 | 0 | NULL | NULL |

(나) 첫 줄(빈 큐에 처음 넣기)과 마지막 줄(마지막 하나 빼기)이다. 셋째와 다섯째 줄에서 `front`와 `rear`가 같은 원소를 가리키는 것은 노드가 하나 남았기 때문이고, 그 줄에서 바뀐 것은 `front`뿐이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 위 표의 모든 칸, 7번 넣고 3번 빼면 40 ~ 70 네 개가 남음, 변형의 나누기(짝수 8 6 4 2, 홀수 3 1 9), 노드가 남지 않음 — [19_linked-list-practice_p4.c](/Hongs_Blog/studies/data-structures/code/19_linked-list-practice_p4/)</div>

</div>


**변형 문제.** 큐에 3, 8, 6, 1, 4, 9, 2가 이 순서로 들어 있다. 들어온 차례를 지키면서 짝수는 큐 `even`으로, 홀수는 큐 `odd`로 옮기는 함수 `split`을 써라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

하나씩 dequeue해서 알맞은 큐에 enqueue한다. 큐는 넣은 순서대로 내놓으므로 차례가 저절로 지켜진다.

```c
/* q의 원소를 모두 꺼내, 짝수는 even에 홀수는 odd에 넣는다. 들어온 차례는 그대로다 */
void split(LinkedQueueType *q, LinkedQueueType *even, LinkedQueueType *odd)
{
    while (!is_empty(q)) {
        element x = dequeue(q);
        if (x % 2 == 0) enqueue(even, x);
        else enqueue(odd, x);
    }
}
```

`even`은 8, 6, 4, 2이고 `odd`는 3, 1, 9다. 원래 큐는 빈다.

</details>
{% endraw %}
