---
layout: "note"
title: "선택 정렬"
display_title: "선택 정렬 (Selection Sort)"
kind: "concept"
kind_label: "알고리즘"
num: "41"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Selection Sort", "골라 놓기 정렬"]
description: "키 순서로 줄을 세울 때, 줄에서 가장 큰 사람을 찾아 맨 뒤 자리와 바꾸고, 남은 사람들에게 같은 일을 되풀이하는 방법이다. 자리를 바꾸는 횟수가 아주 적어서 옮기기가 번거로운 자료에 알맞다. 대신 가장 큰 사람을 찾으려면 매번 남은 사람을 모두 봐야 해서, 줄이 이미 맞게 서 …"
prev_url: "/studies/data-structures/insertion-sort/"
prev_title: "삽입 정렬"
next_url: "/studies/data-structures/quick-sort/"
next_title: "퀵 정렬"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/selection-sort/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

키 순서로 줄을 세울 때, 줄에서 가장 큰 사람을 찾아 맨 뒤 자리와 바꾸고, 남은 사람들에게 같은 일을 되풀이하는 방법이다. 자리를 바꾸는 횟수가 아주 적어서 옮기기가 번거로운 자료에 알맞다. 대신 가장 큰 사람을 찾으려면 매번 남은 사람을 모두 봐야 해서, 줄이 이미 맞게 서 있어도 일이 하나도 줄지 않는다.

</div>


## 예시로 보기

[삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/)은 값을 한 칸씩 밀어 자리를 만든다. 값 하나가 크면(이름, 주소가 다 붙은 긴 기록이면) 미는 일 자체가 비싸다. 선택 정렬은 바퀴마다 많아야 한 번만 맞바꾼다.

7, 3, 6, 2, 1을 정렬한다. 세로줄 <code>&#124;</code>의 오른쪽이 자리가 정해진 부분이다[^s1].

| 바퀴 | 찾는 범위 | 가장 큰 값 | 맞바꾸는 칸 | 끝난 뒤 배열 |
|---|---|---|---|---|
| 1 | 7, 3, 6, 2, 1 | 7 (0번 칸) | 0번 ↔ 4번 | [1, 3, 6, 2 \| 7] |
| 2 | 1, 3, 6, 2 | 6 (2번 칸) | 2번 ↔ 3번 | [1, 3, 2 \| 6, 7] |
| 3 | 1, 3, 2 | 3 (1번 칸) | 1번 ↔ 2번 | [1, 2 \| 3, 6, 7] |
| 4 | 1, 2 | 2 (1번 칸) | 이미 제자리 | [1 \| 2, 3, 6, 7] |

비교는 $$4 + 3 + 2 + 1 = 10$$번, 맞바꾸기는 3번이다. 삽입 정렬은 같은 입력에서 값을 9번 밀었다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 배열, 비교 10번과 맞바꾸기 3번, 반복 판과 재귀 판이 같은 결과, 표준 `qsort`와 무작위 2,000개 비교, 빈 배열·1개·모두 같은 값·정렬됨·역순을 컴파일해 실행(ASan·UBSan) — [41_selection-sort_impl.c](/Hongs_Blog/studies/data-structures/code/41_selection-sort_impl/). 모든 순열($$n \le 7$$)에서 비교 횟수가 늘 $$\frac{n(n-1)}{2}$$, 맞바꾸기가 $$n - 1$$번 이하 — [41_selection-sort_verify.py](/Hongs_Blog/studies/data-structures/code/41_selection-sort_verify/)</div>

</div>


## 정의

입력은 정수 $$n$$개가 든 배열 `a[0]`부터 `a[n-1]`까지다($$n \ge 0$$). 끝나면 같은 값들이 작은 것부터 놓인다. 방법을 재귀로 적으면 이렇다.

- 값이 한 개 이하면 이미 정렬되어 있다.
- 두 개 이상이면 가장 큰 값을 줄의 오른쪽 끝으로 보낸다.
- 남은 $$n - 1$$개 `a[0:n-2]`를 같은 방법으로 정렬한다.

보통은 재귀 없이 짠다. "정렬할 범위의 크기" `size`를 $$n$$에서 2까지 하나씩 줄이는 반복문이 재귀 호출을 대신한다[^s1].

```c
void selection_sort(int a[], int n)
{
    for (int size = n; size > 1; size--) {
        int big = 0;                      /* a[0..size-1]에서 가장 큰 값의 자리 */
        for (int i = 1; i < size; i++)
            if (a[i] > a[big])
                big = i;
        if (big != size - 1) {            /* 이미 맨 끝에 있으면 그대로 둔다 */
            int t = a[big];               /* 가장 큰 값을 범위의 맨 끝 칸과 맞바꾼다 */
            a[big] = a[size - 1];
            a[size - 1] = t;
        }
    }
}
```

### 왜 맞는가

바깥 `for`가 한 바퀴를 시작할 때마다 다음이 맞다. `a[size]`부터 `a[n-1]`까지에는 전체에서 가장 큰 $$n -$$ `size`개가 작은 것부터 놓여 있고, 그 왼쪽의 값은 모두 이들보다 크지 않다[^s1].

- **처음.** `size = n`이면 오른쪽 부분이 비어 있어 따질 것이 없다.
- **한 바퀴 뒤.** 왼쪽 부분에서 가장 큰 값을 `a[size-1]`에 놓는다. 이 값은 왼쪽의 어느 값보다 크거나 같고, 오른쪽 부분의 어느 값보다 작거나 같다. 그래서 오른쪽 부분이 한 칸 늘어도 순서가 맞다.
- **끝.** `size = 1`이 되면 남은 한 칸은 가장 작은 값이다. 배열 전체가 정렬되었다.

### 복잡도

`size`개 가운데 가장 큰 값을 찾으려면 `size` − 1번 견준다. 바퀴마다 범위가 하나씩 줄므로 비교 횟수는

$$(n - 1) + (n - 2) + \cdots + 1 = \frac{n(n - 1)}{2}$$


이다. 선택 정렬이 $$O(n^2)$$인 까닭이 여기에 있다. 삽입 정렬과 달리 이 수는 입력이 어떻게 놓여 있든 같다. 가장 큰 값이 어디 있는지는 끝까지 봐야 알기 때문이다[^s1].

| | 삽입 정렬 | 선택 정렬 |
|---|---|---|
| 비교, 이미 정렬된 8개 | 7번 | 28번 |
| 비교, 역순 8개 | 28번 | 28번 |
| 값 옮기기, 역순 8개 | 한 칸 밀기 28번 | 맞바꾸기 4번 |
| 값 옮기기, 가장 많을 때 | $$\frac{n(n-1)}{2}$$번 | $$n - 1$$번 |
| 같은 값의 처음 순서 | 지켜진다 | 뒤집힐 수 있다 |

마지막 줄의 예는 [2a, 2b, 1]이다(a, b는 같은 값 2를 구별하려고 붙인 표시). 첫 바퀴에서 가장 큰 값으로 2a를 골라 맨 끝의 1과 맞바꾸면 [1, 2b, 2a]가 되어 2a와 2b의 순서가 뒤집힌다. 맞바꾸기가 값을 멀리 건너뛰게 하기 때문이다[^s1].

덤 공간은 변수 몇 개뿐이다.

## 활용

- 구현: [41_selection-sort_impl.c](/Hongs_Blog/studies/data-structures/code/41_selection-sort_impl/). 연습: [정렬 추적 연습](/Hongs_Blog/studies/data-structures/sort-tracing-practice/)
- "가장 큰 값을 꺼내 뒤에 놓기를 되풀이한다"는 뼈대는 힙 정렬과 같다. 힙 정렬은 가장 큰 값을 찾는 일을 `size` − 1번 견주기 대신 힙에서 $$O(\log n)$$에 해서 전체를 $$O(n \log n)$$으로 줄인다[^s1]: [우선순위 큐 정렬과 힙 정렬](/Hongs_Blog/studies/data-structures/heap-sort/).
- 흔한 실수: 안쪽 반복의 범위를 늘 `n`까지로 두는 것. 이미 자리가 정해진 오른쪽 값을 다시 골라 순서를 망친다.

## 연결

- 선수: [삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/)(위 표의 비교 대상), [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)
- 더 빠른 정렬: [퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/), [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/)
- 파이썬의 정렬과 안정 정렬의 쓰임: [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `[5, 2, 9, 4]`를 선택 정렬(가장 큰 값을 오른쪽 끝으로)할 때, 두 바퀴가 끝난 뒤의 배열을 쓰라.</summary>

**답:** 첫 바퀴 뒤 `[5, 2, 4, 9]`, 둘째 바퀴 뒤 `[4, 2, 5, 9]`.<br>
**이유:** 첫 바퀴는 9(2번 칸)를 3번 칸의 4와 맞바꾼다. 둘째 바퀴는 앞의 세 칸 5, 2, 4에서 5(0번 칸)를 2번 칸의 4와 맞바꾼다. 흔한 오답은 둘째 바퀴에서도 네 칸을 모두 보는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 위 코드의 바깥 `for` 한 바퀴가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 아직 자리가 정해지지 않은 앞쪽 `size`칸에서 가장 큰 값을 찾아 그 범위의 맨 끝 칸에 놓는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 이미 정렬된 8개를 넣었을 때 삽입 정렬과 선택 정렬의 비교 횟수는 각각 몇 번인가? 어느 쪽이 "거의 정렬된 자료"에 알맞고, 다른 쪽은 왜 아닌가?</summary>

**답:** 삽입 정렬 7번, 선택 정렬 28번. 거의 정렬된 자료에는 삽입 정렬이 알맞다.<br>
**이유:** 삽입 정렬은 자기보다 크지 않은 값을 만나면 바로 멈춘다. 선택 정렬은 가장 큰 값이 어디 있는지 모르므로 남은 값을 끝까지 다 견준다. 그래서 입력이 무엇이든 $$\frac{8 \times 7}{2} = 28$$번이다. 반대로 값을 옮기는 횟수는 선택 정렬이 많아야 7번이라, 옮기기가 비쌀 때는 선택 정렬 쪽이 낫다[^s1].

</details>


[^s1]: C 코드, 추적 표, 불변식 논증, 비교 횟수의 합, 삽입 정렬과 견준 표, 같은 값의 순서가 뒤집히는 예, 힙 정렬과의 관계, 카드 C1~C3은 그 설명에 맞춰 보탰다. 수치는 위 두 코드로 확인했다.
{% endraw %}
