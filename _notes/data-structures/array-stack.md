---
layout: "note"
title: "배열로 만든 스택"
display_title: "배열로 만든 스택 (Array Stack)"
kind: "concept"
kind_label: "자료구조"
num: "13"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Array Stack", "배열 스택", "top", "push", "pop", "IsEmpty", "IsFull", "StackFull", "StackEmpty", "MAX_STACK_SIZE", "스택 넘침", "Stack Overflow"]
description: "포개 쌓은 컵 더미를 배열 한 줄에 옮겨 놓고, 맨 위 컵이 몇 번 칸에 있는지만 숫자 하나로 기억한다. 넣기와 꺼내기는 그 숫자를 1 올리거나 내리는 일이라 한 번에 끝난다. 다만 배열의 칸 수가 정해져 있어서, 가득 찼을 때 프로그램을 멈출지 더 큰 배열로 옮길지 미리 정해야 …"
prev_url: "/studies/data-structures/sparse-matrix-transpose/"
prev_title: "희소 행렬의 전치"
next_url: "/studies/data-structures/circular-queue/"
next_title: "원형 큐"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/array-stack/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

포개 쌓은 컵 더미를 배열 한 줄에 옮겨 놓고, 맨 위 컵이 몇 번 칸에 있는지만 숫자 하나로 기억한다. 넣기와 꺼내기는 그 숫자를 1 올리거나 내리는 일이라 한 번에 끝난다. 다만 배열의 칸 수가 정해져 있어서, 가득 찼을 때 프로그램을 멈출지 더 큰 배열로 옮길지 미리 정해야 한다. 빈 더미에서 꺼내려는 일도 따로 막아야 한다.

</div>


## 예시로 보기

[스택](/Hongs_Blog/studies/algorithms/stack/)은 마지막에 넣은 것을 먼저 꺼내는 줄이다. 파이썬에서는 리스트의 `append`와 `pop`이 그 일을 해 주지만, C에는 그런 리스트가 없다. 배열 하나와 정수 하나로 직접 만든다.

컵 A, B, C, D, E를 차례로 쌓으면 A가 바닥, E가 맨 위다. 여기에 F를 올리면 F가 맨 위가 되고, 하나를 내리면 F가 내려온다. 이 더미를 배열에 눕힌다. 바닥을 0번 칸에 두고 위로 갈수록 칸 번호가 커진다. 맨 위 원소의 칸 번호를 `top`에 적는다.

```
칸 번호   0   1   2   3   4   5   6
        +---+---+---+---+---+---+---+
stack   | a | b | c | d | e |   |   |
        +---+---+---+---+---+---+---+
                          ^
                        top = 4
```

칸이 넷인 배열로 넣고 꺼내 본다. 넣기(push)는 `top`을 1 올리고 그 칸에 쓴다. 꺼내기(pop)는 `top` 칸의 값을 돌려주고 `top`을 1 내린다.

| 한 일 | 돌려준 값 | top | 배열 (0번 ~ 3번 칸) |
|---|---|---|---|
| 처음 | | −1 | 0, 0, 0, 0 |
| push(11) | | 0 | **11**, 0, 0, 0 |
| push(22) | | 1 | 11, **22**, 0, 0 |
| push(33) | | 2 | 11, 22, **33**, 0 |
| pop() | 33 | 1 | 11, 22, 33, 0 |
| pop() | 22 | 0 | 11, 22, 33, 0 |
| push(44) | | 1 | 11, **44**, 33, 0 |
| push(55) | | 2 | 11, 44, **55**, 0 |
| push(66) | | 3 | 11, 44, 55, **66** |

두 가지가 눈에 띈다. 꺼낸 뒤에도 22와 33은 배열에 그대로 남아 있다. 지우지 않고 `top`만 내렸기 때문이다. 스택에 든 것은 0번 칸부터 `top` 칸까지뿐이고, 그 위 칸의 값은 다음 push가 덮어쓴다. 그리고 마지막 줄에서 `top`이 3, 곧 마지막 칸이다. 여기서 한 번 더 넣으면 배열 밖에 쓰게 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 위 추적 표, 카드 C1·C2, 용량 1에서 두 배씩 늘려 100번 넣으면 용량 128, 무작위 연산 5,000번씩 두 묶음(용량 고정 판, 두 배 늘리기 판)에서 느린 모형(넣고 뺄 때마다 모든 원소를 한 칸씩 미는 배열)과 꺼낸 값·맨 위·개수가 같음 — [13_array-stack_impl.c](/Hongs_Blog/studies/data-structures/code/13_array-stack_impl/)</div>

</div>


## 정의

스택이 무엇을 하는지는 다섯 가지 연산으로 정한다. 이렇게 "하는 일"만 정한 것이 [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/)이고, 아래 표의 오른쪽 두 칸이 그것을 배열로 만든 방법이다.

| 연산 | 하는 일 | 배열로는 | 시간 |
|---|---|---|---|
| IsEmpty | 비었으면 참 | `top == -1` | $$O(1)$$ |
| IsFull | 더 넣을 칸이 없으면 참 | `top == capacity - 1` | $$O(1)$$ |
| Top | 맨 위 원소를 돌려준다 | `stack[top]` | $$O(1)$$ |
| Push | 맨 위에 하나 넣는다 | `stack[++top] = item` | $$O(1)$$. 가득 차서 배열을 늘릴 때만 $$O(\text{capacity})$$ |
| Pop | 맨 위 원소를 빼서 돌려준다 | `return stack[top--]` | $$O(1)$$ |

`capacity`는 배열의 칸 수다. 늘 지켜야 할 규칙(표현 불변식)은 이렇다. $$-1 \le \texttt{top} \le \texttt{capacity} - 1$$이고, 스택의 원소는 `stack[0]`(바닥)부터 `stack[top]`(맨 위)까지이며, 원소 수는 `top + 1`이다[^s1].

```c
typedef int element;

static element *stack;        /* 원소를 담는 배열. stack[0]이 바닥, stack[top]이 맨 위 */
static int capacity;          /* 배열의 칸 수 (고정 판의 MAX_STACK_SIZE) */
static int top = -1;          /* 맨 위 원소의 칸 번호. 비었으면 -1 */

int IsEmpty(void) { return top == -1; }
int IsFull(void)  { return top == capacity - 1; }

void push(element item)
{
    if (top >= capacity - 1)
        StackFull();
    stack[++top] = item;          /* top을 먼저 1 올리고, 그 칸에 넣는다 */
}

element pop(void)
{
    if (top == -1)
        return StackEmpty();
    return stack[top--];          /* 맨 위 값을 돌려주고, top을 1 내린다 */
}
```

`++top`은 "먼저 올리고 그 값을 쓴다", `top--`는 "지금 값을 쓰고 나서 내린다"는 뜻이다. 빈 스택은 `top`이 −1이라, 첫 push가 `top`을 0으로 올리고 0번 칸에 쓴다.


### 가득 찼을 때 할 일 두 가지

가득 찼을 때 부르는 `StackFull()`을 어떻게 짜느냐에 따라 스택의 성격이 달라진다. `push`는 그대로다.

**알리고 끝낸다.** 칸 수 `MAX_STACK_SIZE`가 고정이다. 가득 찬 스택에 넣으려 하면 오류를 찍고 프로그램을 멈춘다.

```c
void StackFullExit(void)
{
    fprintf(stderr, "Stack is full, cannot add element.\n");
    exit(EXIT_FAILURE);
}
```

**배열을 두 배로 늘린다.** 고정된 수 대신 변수 `capacity`를 두고 1쯤에서 시작한다. 가득 차면 `realloc`으로 칸 수를 두 배로 늘린 뒤 넣는다.

```c
void StackFullDouble(void)
{
    element *bigger = realloc(stack, 2 * capacity * sizeof(*stack));
    if (bigger == NULL) {
        fprintf(stderr, "Insufficient memory\n");
        exit(EXIT_FAILURE);
    }
    stack = bigger;
    capacity *= 2;
}
```

늘리는 순간의 push 한 번은 원소를 모두 옮기느라 $$O(\text{capacity})$$가 든다. 그래도 $$n$$번 넣는 일 전체는 $$O(n)$$이다. 그 계산은 [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)에 있다. 용량 1에서 시작해 100번 넣으면 일곱 번 늘어 용량이 128이 된다.

빈 스택에서 꺼내려 할 때 부르는 `StackEmpty()`는 오류를 찍고 프로그램을 끝낸다. −1 같은 값을 돌려주면 스택에 들어 있던 진짜 −1과 구별할 수 없기 때문이다[^s1].

## 활용

- 구현: [13_array-stack_impl.c](/Hongs_Blog/studies/data-structures/code/13_array-stack_impl/). 한 파일에 두 `StackFull`을 함께 두려고 이름을 `StackFullExit`, `StackFullDouble`로 나눴다.
- 연습: [스택 응용 연습](/Hongs_Blog/studies/data-structures/stack-applications-practice/)(괄호 짝 찾기, 하노이 탑)
- 프로그램이 함수를 부를 때 쓰는 시스템 스택도 스택이다. 함수를 부를 때마다 "돌아갈 자리"와 "부른 함수의 틀이 있는 곳"을 담은 틀(스택 프레임)을 맨 위에 쌓고, 함수가 끝나면 그 틀을 걷어 낸다. 자세한 것은 [스택 프레임](/Hongs_Blog/studies/assembly-language/stack-frame/), [런타임 스택과 PUSH·POP](/Hongs_Blog/studies/assembly-language/runtime-stack/), [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)에 있다.
- 배열 대신 노드를 이어서 만들면 칸 수를 정하지 않아도 된다: [연결 리스트로 만든 스택](/Hongs_Blog/studies/data-structures/linked-stack/). 배열 쪽은 원소마다 덤으로 쓰는 메모리가 없고, 넣고 뺄 때 메모리를 얻고 돌려주는 일을 하지 않는다[^s1].
- 흔한 실수: `stack[top++] = item`처럼 올리는 차례를 바꾸는 것(카드 C2), 가득 찼는지 보지 않고 넣는 것, pop에서 `return`을 빠뜨리는 것. `return` 없이 `stack[top--];`만 쓰면 `top`은 내려가지만 꺼낸 값은 버려지고, 함수는 정해지지 않은 값을 돌려준다. 11, 22, 33을 넣고 두 번 꺼내면 33, 22가 아니라 33, 33이나 −1, −1이 나오기도 한다[^s2]. IsEmpty를 `top >= 0`으로 쓰는 실수도 있다. 이것은 "비어 있지 않다"는 조건이라 뜻이 거꾸로다.

## 연결

- 선수: [스택](/Hongs_Blog/studies/algorithms/stack/)(스택이 무엇이고 어디에 쓰나), [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/), [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)
- 가득 찼을 때: [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)
- 같은 추상 자료형의 다른 구현: [연결 리스트로 만든 스택](/Hongs_Blog/studies/data-structures/linked-stack/)
- 배열로 만든 큐: [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 칸이 넷인 빈 스택에 push(5), push(8), pop(), push(3), push(7), push(1), pop()을 차례로 했다. 꺼낸 값 둘과 마지막 `top`, 배열 네 칸에 적혀 있는 값을 써라.</summary>

**답:** 꺼낸 값은 8과 1이다. `top`은 2이고 배열에는 5, 3, 7, 1이 적혀 있다. 스택에 든 것은 5, 3, 7이다.<br>
**이유:** push(1) 뒤에 `top`이 3이라 가득 찼다. 마지막 pop은 `top`만 2로 내리므로 1은 3번 칸에 남아 있지만 스택의 원소가 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** push를 `stack[top++] = item;`으로 쓰면 빈 스택에 처음 넣을 때 무슨 일이 생기는가? 왜 `++top`이어야 하는가?</summary>

**답:** `top++`는 올리기 전의 값 −1을 칸 번호로 쓴다. 그래서 `stack[-1]`, 곧 배열 앞의 남의 메모리에 쓴다. `++top`은 먼저 0으로 올린 뒤 그 값을 써서 0번 칸에 넣는다.<br>
**이유:** `top`은 "맨 위 원소가 있는 칸"이다. 새 원소가 갈 칸은 그 다음 칸이라 올린 뒤의 값이 필요하다. 거꾸로 pop은 지금의 `top` 칸을 읽고 나서 내려야 하므로 `top--`다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 가득 찼을 때 "알리고 끝내기"와 "두 배로 늘리기" 중 무엇이 알맞은가? (가) 식의 괄호 깊이가 100을 넘으면 잘못된 입력으로 보는 검사기 (나) 몇 줄이 들어올지 모르는 파일의 줄을 모두 쌓아 두었다가 거꾸로 찍는 프로그램</summary>

**답:** (가)는 알리고 끝내기다. 칸 100개를 잡아 두고, 넘치면 그것이 곧 잘못된 입력이다. (나)는 두 배로 늘리기다. 얼마나 쌓일지 모르는데 고정 칸 수로는 멈출 수밖에 없다.<br>
**이유:** 고정 판은 단순하고 넣는 시간이 늘 같다. 늘리는 판은 가끔 한 번씩 모든 원소를 옮기지만, 넣는 일 전체로 보면 원소 수에 비례하는 시간만 든다.

</details>


[^s1]: 구현 코드로 확인했다.
[^s2]: `return`이 빠진 pop을 Apple clang 21로 컴파일하면 `-O0`에서 33, 33이, `-O1`과 `-O2`에서 −1, −1이 나왔다. 정해지지 않은 동작이라 다른 컴파일러에서는 다른 값이 나올 수 있다.
{% endraw %}
