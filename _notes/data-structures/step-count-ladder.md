---
layout: "note"
title: "단계 수 세기 예제 사다리"
display_title: "단계 수 세기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "02"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 연산 횟수와 단계 수 세기의 s/e 표와 합 구하기."
next_url: "/studies/data-structures/pointer-address-practice/"
next_title: "포인터와 주소 계산 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/step-count-ladder/"
---
{% raw %}
사용 개념: [연산 횟수와 단계 수 세기](/Hongs_Blog/studies/data-structures/operation-step-count/)의 s/e 표와 합 구하기.

"이 코드의 단계 수를 $$n$$의 식으로 구하라"는 문제는 같은 하위목표의 되풀이다. ① 줄마다 한 번 실행할 때의 단계 수(s/e)를 적는다. ② 줄마다 실행 횟수를 센다. ③ 줄별로 곱해서 더한다. ④ 작은 $$n$$을 넣어 확인한다[^s1].

세는 규칙은 네 문제 모두 같다. 줄을 한 번 실행하면 1단계다. `for`의 머리줄은 조건을 검사할 때마다 한 번 실행한 것으로 센다. 중괄호와 값을 넣지 않는 선언(`int i;`)은 0단계다.

## 문제 1 · 완전한 풀이

삽입 정렬에 거꾸로 놓인 배열(예: `5 4 3 2 1`)이 들어왔다. 길이가 $$n$$일 때 단계 수를 구하라.

```c
for (i = 1; i < n; i++) {
    int t = a[i];
    int j;
    for (j = i - 1; j >= 0 && t < a[j]; j--)
        a[j + 1] = a[j];
    a[j + 1] = t;
}
```

1. *s/e 적기:* 바깥 `for` 1, `int t = a[i];` 1, `int j;` 0, 안쪽 `for` 1, `a[j + 1] = a[j];` 1, `a[j + 1] = t;` 1.
2. *실행 횟수 세기:* 거꾸로 놓였으니 `t`는 앞의 `i`개보다 모두 작다. `i`번째 바퀴에서 옮기는 줄은 `i`번, 안쪽 머리줄은 끝을 알아채는 한 번을 더해 `i + 1`번이다. `t`를 꺼내는 줄과 끼우는 줄은 한 번씩이다. 바깥 머리줄은 `i`가 1부터 $$n$$까지일 때 검사하니 $$n$$번이다.
3. *곱해서 더하기:* 바퀴 하나는 $$1 + (i + 1) + i + 1 = 2i + 3$$단계다. $$i = 1$$부터 $$n - 1$$까지 더하면 $$2(1 + 2 + \dots + (n - 1)) + 3(n - 1) = (n - 1)n + 3(n - 1) = (n - 1)(n + 3)$$이다. 바깥 머리줄 $$n$$을 더해 $$n + (n - 1)(n + 3)$$이다.
4. *작은 수로 확인:* $$n = 5$$이면 $$5 + 4 \times 8 = 37$$이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [02_step-count-ladder_p4.py](/Hongs_Blog/studies/data-structures/code/02_step-count-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

같은 삽입 정렬에 이미 정렬된 배열(예: `1 2 3 4 5`)이 들어왔다. 길이가 $$n$$일 때 단계 수를 구하라.

1. *s/e 적기:* 문제 1과 같다.
2. *실행 횟수 세기:* `t`가 바로 앞의 값보다 작지 않다. `i`번째 바퀴에서 안쪽 머리줄은 한 번 검사하고 끝나니 1번, 옮기는 줄은 0번이다. `t`를 꺼내는 줄과 끼우는 줄은 한 번씩이다. 바깥 머리줄은 $$n$$번이다.
3. *곱해서 더하기:* 바퀴 하나는 ______단계다. 바퀴는 $$n - 1$$번이다. 바깥 머리줄을 더한 전체는 ______이다.
4. *작은 수로 확인:* $$n = 5$$이면 ______이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

바퀴 하나는 $$1 + 1 + 0 + 1 = 3$$단계다. 전체는 $$n + 3(n - 1) = 4n - 3$$이다. $$n = 5$$이면 17이다. 문제 1의 37과 견주면 같은 코드, 같은 길이인데 놓인 순서만으로 두 배 넘게 차이 난다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

배열의 값을 모두 더하는 함수의 단계 수를 구하라. $$n$$은 배열의 길이다.

```c
int sum(int a[], int n)
{
    int s = 0;
    int i;
    for (i = 0; i < n; i++)
        s += a[i];
    return s;
}
```

1. *s/e 적기:* `int s = 0;` 1, `int i;` 0, `for` 1, `s += a[i];` 1, `return s;` 1.
2. *실행 횟수 세기:* `int s = 0;` 1번, `for`의 머리줄 ______번, `s += a[i];` ______번, `return s;` 1번.
3. *곱해서 더하기:* ______
4. *작은 수로 확인:* $$n = 10$$이면 23이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 머리줄은 `i`가 0부터 $$n$$까지일 때 검사하니 $$n + 1$$번이다. 더하는 줄은 $$n$$번이다.
3. $$1 + (n + 1) + n + 1 = 2n + 3$$.

이 함수를 부르는 `x = sum(a, n);`은 한 줄이지만 한 단계가 아니다. 이 줄의 s/e를 $$n$$으로 적기도 한다. 덧셈 $$n$$번만 센 값이다. 함수 안의 줄을 모두 세면 $$2n + 3$$이다. 어느 쪽으로 세든 $$n$$에 비례한다는 점이 같다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [02_step-count-ladder_p4.py](/Hongs_Blog/studies/data-structures/code/02_step-count-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

길이 $$n$$인 배열에서 값이 같은 쌍이 몇 개인지 세는 코드다.

```c
int count = 0;
for (i = 0; i < n; i++)
    for (j = i + 1; j < n; j++)
        if (a[i] == a[j])
            count++;
```

(a) 비교 `a[i] == a[j]`는 몇 번 하는가? (b) 단계 수가 가장 작을 때와 가장 클 때를 각각 $$n$$의 식으로 구하고, 어떤 입력에서 그렇게 되는지 쓰라. (c) 삽입 정렬은 입력에 따라 비교 횟수가 달라졌는데 이 코드는 왜 달라지지 않는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) $$\frac{n(n-1)}{2}$$번. 바깥 `i`마다 안쪽 `j`가 $$i + 1$$부터 $$n - 1$$까지 $$n - 1 - i$$번 돈다. $$i = 0$$부터 $$n - 1$$까지 더하면 $$(n - 1) + (n - 2) + \dots + 0$$이다.

(b) 줄별 횟수는 `int count = 0;` 1번, 바깥 머리줄 $$n + 1$$번, 안쪽 머리줄 $$\frac{n(n+1)}{2}$$번, `if` $$\frac{n(n-1)}{2}$$번, `count++`는 값이 같은 쌍의 수만큼이다. 안쪽 머리줄은 `i`마다 $$n - 1 - i$$번 돌고 끝을 알아채는 한 번을 더해 $$n - i$$번이다. 이것을 더하면 $$n + (n - 1) + \dots + 1$$이다.
- 가장 작을 때: 값이 모두 다르면 `count++`가 0번이다. $$1 + (n + 1) + \frac{n(n+1)}{2} + \frac{n(n-1)}{2} = n^2 + n + 2$$.
- 가장 클 때: 값이 모두 같으면 `count++`가 $$\frac{n(n-1)}{2}$$번이다. $$n^2 + n + 2 + \frac{n(n-1)}{2} = \frac{3n^2 + n + 4}{2}$$.
- $$n = 4$$이면 22와 28이다.

(c) 삽입 정렬의 안쪽 반복은 조건에 `t < a[j]`가 들어 있어서 값에 따라 일찍 멈춘다. 이 코드의 반복 조건 `j < n`에는 배열의 값이 없다. 값은 `count++`를 할지 말지만 정한다. 그래서 비교 횟수는 늘 같고, 단계 수도 가장 작을 때와 클 때가 둘 다 $$n^2$$에 비례한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [02_step-count-ladder_p4.py](/Hongs_Blog/studies/data-structures/code/02_step-count-ladder_p4/)</div>

</div>


[^s1]: 답은 코드를 실제로 돌리며 줄마다 세는 문제 코드로 확인했다.
{% endraw %}
