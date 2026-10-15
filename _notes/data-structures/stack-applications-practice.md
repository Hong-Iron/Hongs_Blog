---
layout: "note"
title: "스택 응용 연습"
display_title: "스택 응용 연습"
kind: "practice"
kind_label: "연습"
num: "13"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "스택을 쓰는 두 문제다. 둘 다 \"가장 최근 것부터 처리한다\"가 답의 뼈대라서 큐로는 바꿀 수 없다."
prev_url: "/studies/data-structures/sparse-transpose-ladder/"
prev_title: "희소 행렬 전치 예제 사다리"
next_url: "/studies/data-structures/circular-queue-ladder/"
next_title: "원형 큐 추적 예제 사다리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/stack-applications-practice/"
---
{% raw %}
스택을 쓰는 두 문제다. 둘 다 "가장 최근 것부터 처리한다"가 답의 뼈대라서 큐로는 바꿀 수 없다.

## p1 · 괄호 짝의 위치 쌍

**문제.** 식 `(((a+b)*c+d-e)/(f+g)-(h+j)*(k-l))/(m-n)`에서, 위치 $$u$$의 여는 괄호가 위치 $$v$$의 닫는 괄호와 짝일 때마다 $$(u, v)$$를 찍어라. 위치는 0부터 센다. 짝이 없는 괄호는 따로 알려라. 식 `(a+b))*((c+d)`로도 해 보라.

**사용 개념.** [배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/), [스택](/Hongs_Blog/studies/algorithms/stack/)(짝이 맞는지만 보는 판)

**풀이 전략.** 닫는 괄호는 아직 짝을 못 찾은 여는 괄호 가운데 가장 최근 것과 짝이다. "가장 최근 것"을 한 번에 꺼내 주는 것이 스택이다. 짝이 맞는지만 보려면 여는 괄호 자체를 쌓아도 되지만, 여기서는 위치를 찍어야 하니 **위치**를 쌓는다. 풀이는 이 생각을 그대로 옮긴 것이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *왼쪽부터 한 글자씩 읽는다.*
2. *여는 괄호면 그 위치를 스택에 넣는다.*
3. *닫는 괄호면 스택에서 위치를 하나 꺼내 (꺼낸 위치, 지금 위치)를 찍는다.* 스택이 비어 꺼낼 것이 없으면 이 닫는 괄호는 짝이 없다.
4. *끝까지 읽고도 스택에 남은 위치*는 짝 없는 여는 괄호다.

```c
void match(const char *expr)
{
    int n = 0;
    out[0] = '\0';
    top = -1;
    for (int i = 0; expr[i] != '\0'; i++) {
        if (expr[i] == '(') {
            push(i);                                  /* 여는 괄호: 위치를 쌓는다 */
        } else if (expr[i] == ')') {
            if (top == -1)                            /* 꺼낼 것이 없다: 짝 없는 닫는 괄호 */
                n += snprintf(out + n, sizeof(out) - (size_t)n, "R%d ", i);
            else                                      /* 맨 위가 가장 최근에 열린 괄호다 */
                n += snprintf(out + n, sizeof(out) - (size_t)n, "(%d,%d) ", pop(), i);
        }
    }
    while (top != -1)                                 /* 끝까지 남은 것: 짝 없는 여는 괄호 */
        n += snprintf(out + n, sizeof(out) - (size_t)n, "L%d ", pop());
}
```

`out`은 찍을 글을 모아 두는 글자 배열이다. `R5`는 "5번 닫는 괄호에 짝이 없다", `L7`은 "7번 여는 괄호에 짝이 없다"는 표시다.

**첫 식.** 찍히는 순서는 (2, 6) (1, 13) (15, 19) (21, 25) (27, 31) (0, 32) (34, 38)이다. 닫는 괄호를 만나는 순서대로 찍히므로, 가장 바깥의 (0, 32)가 안쪽 짝들보다 늦게 나온다. 스택은 2번 글자까지 읽었을 때 0, 1, 2로 가장 높고, 그 뒤로는 0 위에 15, 21, 27이 차례로 올라갔다 내려간다.

**둘째 식.** `(a+b))*((c+d)`

| 위치 | 글자 | 한 일 | 스택 (오른쪽이 맨 위) |
|---|---|---|---|
| 0 | ( | 0을 넣는다 | 0 |
| 4 | ) | 0을 꺼내 (0, 4) | (비었음) |
| 5 | ) | 꺼낼 것이 없다: 5번 닫는 괄호는 짝이 없다 | (비었음) |
| 7 | ( | 7을 넣는다 | 7 |
| 8 | ( | 8을 넣는다 | 7, 8 |
| 12 | ) | 8을 꺼내 (8, 12) | 7 |
| 끝 | | 7이 남았다: 7번 여는 괄호는 짝이 없다 | |

답은 (0, 4), 짝이 없는 5번 닫는 괄호, (8, 12), 짝이 없는 7번 여는 괄호다.

</details>


**검증.** 길이 $$n$$인 식을 한 번 훑고, 글자마다 넣기나 꺼내기를 많아야 한 번 하므로 $$O(n)$$이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 두 식의 답, 첫 식을 훑는 동안의 스택(2번 글자 뒤 0 1 2, 15번 뒤 0 15, 21번 뒤 0 21, 27번 뒤 0 27), 위 추적 표, 변형 문제의 답, 길이 12 이하의 모든 괄호 문자열 8,191개에서 "닫는 괄호마다 왼쪽으로 훑어 가장 가까운 짝 없는 여는 괄호를 찾는" 느린 방법과 같은 결과 — [13_stack-applications-practice_p1.c](/Hongs_Blog/studies/data-structures/code/13_stack-applications-practice_p1/)</div>

</div>


**변형 문제.** (가) `((a+b)*(c-d)`와 `)(`의 답을 써라. (나) 스택 대신 큐에 위치를 넣었다가 꺼내면 `(a(b)c)`에서 무엇이 찍히는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) `((a+b)*(c-d)`는 (1, 5) (7, 11)을 찍고 0번 여는 괄호가 남는다. `)(`는 0번 닫는 괄호도, 1번 여는 괄호도 짝이 없다. 여는 괄호와 닫는 괄호의 수가 같아도 순서가 틀리면 짝이 안 된다.<br>
(나) 스택이면 (2, 4) (0, 6)이다. 큐는 가장 먼저 넣은 0을 먼저 꺼내서 (0, 4) (2, 6)을 찍는다. 안쪽 괄호와 바깥 괄호가 엇갈린 틀린 짝이다. 닫는 괄호의 짝은 "가장 먼저 열린 것"이 아니라 "가장 나중에 열린 것"이기 때문이다[^s1].

</details>


## p2 · 하노이 탑

**문제.** 탑 A에 크기가 다른 원판 $$n$$개가 큰 것이 아래로 가게 쌓여 있다. 모두 탑 C로 옮겨라. 한 번에 맨 위 원판 하나만 옮기고, 큰 원판을 작은 원판 위에 놓을 수 없다. 탑 B는 거쳐 가는 데 써도 된다. 원판이 3개일 때의 이동을 모두 쓰고, $$n$$개일 때 몇 번 옮기는지 구하라. 64개면 얼마나 걸리는가.

**사용 개념.** [배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/)(탑 하나가 스택 하나다), [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/), [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)(이동 횟수의 식)

**풀이 전략.** 맨 위에서만 넣고 빼니 탑은 스택이다. 가장 큰 원판을 보면 길이 보인다. 가장 큰 원판을 C로 옮기려면 그 위의 $$n - 1$$개가 모두 B에 가 있어야 한다. "$$n - 1$$개를 B로 옮기기"는 원판 수만 하나 준 같은 문제다. 그래서 자기 자신을 다시 부르는 풀이(재귀)가 된다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *위의 $$n - 1$$개를 A에서 B로 옮긴다(C를 거쳐서).*
2. *맨 아래 원판 하나를 A에서 C로 옮긴다.*
3. *B에 둔 $$n - 1$$개를 C로 옮긴다(A를 거쳐서).*
4. *$$n = 0$$이면 할 일이 없다.*

재귀 풀이는 이 네 줄이 전부다.

```c
/* from 탑의 맨 위 원판을 to 탑의 맨 위로 옮긴다 */
void move(int from, int to)
{
    int disk = tower[from][top[from]--];                    /* pop */
    if (top[to] >= 0 && tower[to][top[to]] > disk)          /* 아래 원판의 번호가 더 크다 = 더 작은 원판이다 */
        rule_broken = 1;
    tower[to][++top[to]] = disk;                            /* push */
    moves++;
}

/* from 탑의 위쪽 원판 n개를 via 탑을 거쳐 to 탑으로 옮긴다 */
void hanoi(int n, int from, int to, int via)
{
    if (n == 0) return;
    hanoi(n - 1, from, via, to);      /* 위의 n - 1개를 남는 탑으로 치운다 */
    move(from, to);                   /* 맨 아래 원판을 옮긴다 */
    hanoi(n - 1, via, to, from);      /* 치워 둔 n - 1개를 그 위에 올린다 */
}
```

원판 번호는 가장 큰 것이 1이다. 구현 파일의 `move`에는 처음 몇 번의 이동을 적어 두는 줄이 더 있다.

**원판 3개.** 일곱 번 옮긴다.

| 차례 | 옮긴 원판 | 어디서 어디로 | A | B | C |
|---|---|---|---|---|---|
| 처음 | | | 1, 2, 3 | | |
| 1 | 3 | A → C | 1, 2 | | 3 |
| 2 | 2 | A → B | 1 | 2 | 3 |
| 3 | 3 | C → B | 1 | 2, 3 | |
| 4 | 1 | A → C | | 2, 3 | 1 |
| 5 | 3 | B → A | 3 | 2 | 1 |
| 6 | 2 | B → C | 3 | | 1, 2 |
| 7 | 3 | A → C | | | 1, 2, 3 |

탑마다 왼쪽이 바닥이다. 1 ~ 3차례가 "위의 둘을 B로", 4차례가 "가장 큰 것을 C로", 5 ~ 7차례가 "B의 둘을 C로"다.

**이동 횟수.** $$n$$개를 옮기는 횟수를 $$\text{moves}(n)$$이라 하면, 1단계와 3단계가 $$\text{moves}(n - 1)$$번씩이고 2단계가 한 번이다.

$$\text{moves}(0) = 0, \qquad \text{moves}(n) = 2\,\text{moves}(n - 1) + 1 = 2^n - 1 \quad (n > 0)$$


닫힌 꼴 $$2^n - 1$$이 이 점화식에서 나오는 과정은 [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)에 있다. $$n = 3$$이면 $$2^3 - 1 = 7$$로 위 표와 맞다.

**64개.** $$\text{moves}(64) = 2^{64} - 1 \approx 1.8 \times 10^{19}$$번이다. 1초에 $$10^9$$번 옮기는 컴퓨터로 약 570년, 1분에 하나씩 옮기면 약 $$3.4 \times 10^{13}$$년이 걸린다. 우주의 나이가 약 $$1.4 \times 10^{10}$$년이니 그 2천 배가 넘는다[^s2].

</details>


**검증.** 재귀가 가장 깊을 때 $$n$$겹이다. 원판이 20개면 이동은 1,048,575번이지만 함수가 겹쳐 불린 깊이는 20이다. 함수를 부를 때마다 돌아갈 자리를 쌓는 시스템 스택이 그만큼만 쓰인다는 뜻이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 원판 3개의 일곱 이동이 위 표와 같음, 원판 0 ~ 20개에서 이동 횟수 $$2^n - 1$$·끝나면 모두 C에 큰 것부터·큰 원판을 작은 원판 위에 놓은 적 없음·재귀 깊이 $$n$$, $$2^{64} - 1 = 18{,}446{,}744{,}073{,}709{,}551{,}615$$, 570년과 $$3.4 \times 10^{13}$$년 — [13_stack-applications-practice_p2.c](/Hongs_Blog/studies/data-structures/code/13_stack-applications-practice_p2/)</div>

</div>


**변형 문제.** 원판이 4개면 몇 번 옮기는가? 그 가운데 가장 큰 원판은 몇 번째 차례에 옮기는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$2^4 - 1 = 15$$번이다. 가장 큰 원판은 위의 셋을 치운 뒤, 곧 $$2^3 - 1 = 7$$번 다음인 8번째 차례에 딱 한 번 옮긴다. 일반적으로 가장 큰 원판은 $$2^{n-1}$$번째 차례에 움직인다[^s1].

</details>


[^s1]: 문제 코드로 확인했다.
[^s2]: 정확한 수 $$2^{64} - 1$$로 셈하면 약 585년과 약 $$3.5 \times 10^{13}$$년이다(문제 코드에서 계산). 우주의 나이 약 138억 년과 견준 말은 보탠 것이다.
{% endraw %}
