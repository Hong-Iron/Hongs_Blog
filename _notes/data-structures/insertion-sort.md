---
layout: "note"
title: "삽입 정렬"
display_title: "삽입 정렬 (Insertion Sort)"
kind: "concept"
kind_label: "알고리즘"
num: "40"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Insertion Sort", "끼워 넣기 정렬", "비교 횟수", "Comparison Count"]
description: "카드 놀이에서 손에 든 패를 정리할 때처럼, 앞쪽 패는 이미 차례대로 놓여 있다고 보고 새 패를 한 장씩 제자리에 끼워 넣는다. 코드가 짧고 덤 공간이 필요 없으며, 거의 정리된 자료라면 패마다 한두 번만 견주고 끝난다. 대신 거꾸로 놓인 자료에서는 새 패마다 앞의 패를 모두 밀어…"
prev_url: "/studies/data-structures/floyd-path-output/"
prev_title: "플로이드 알고리즘의 경로 출력"
next_url: "/studies/data-structures/selection-sort/"
next_title: "선택 정렬"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/insertion-sort/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

카드 놀이에서 손에 든 패를 정리할 때처럼, 앞쪽 패는 이미 차례대로 놓여 있다고 보고 새 패를 한 장씩 제자리에 끼워 넣는다. 코드가 짧고 덤 공간이 필요 없으며, 거의 정리된 자료라면 패마다 한두 번만 견주고 끝난다. 대신 거꾸로 놓인 자료에서는 새 패마다 앞의 패를 모두 밀어야 해서, 자료가 두 배로 늘면 일이 네 배로 는다.

</div>


## 예시로 보기

값이 작은 것부터 줄지어 있으면 "가장 작은 것", "세 번째로 큰 것"을 바로 꺼낼 수 있고, 반씩 줄여 가며 찾을 수도 있다. 정렬은 값 n개를 그렇게 작은 것부터 다시 늘어놓는 일이다. 7, 3, 6, 2, 1을 1, 2, 3, 6, 7로 바꾼다[^1].

삽입 정렬은 둘째 칸부터 한 칸씩 간다. 이번 칸의 값을 `t`에 꺼내 두고, 왼쪽 값들을 오른쪽 끝부터 하나씩 견준다. `t`보다 큰 값은 한 칸 뒤로 밀고, `t`보다 크지 않은 값을 만나면 멈춰 그 뒤 빈칸에 `t`를 놓는다. 아래 표에서 세로줄 <code>&#124;</code>의 왼쪽이 정렬이 끝난 부분이다[^s1].

| i | 꺼낸 값 t | 견준 값 | 비교 | 끝난 뒤 배열 |
|---|---|---|---|---|
| 1 | 3 | 7(민다) | 1번 | [3, 7 \| 6, 2, 1] |
| 2 | 6 | 7(민다), 3(멈춘다) | 2번 | [3, 6, 7 \| 2, 1] |
| 3 | 2 | 7, 6, 3(모두 민다) | 3번 | [2, 3, 6, 7 \| 1] |
| 4 | 1 | 7, 6, 3, 2(모두 민다) | 4번 | [1, 2, 3, 6, 7] |

비교는 모두 10번, 한 칸 밀기는 9번이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 배열과 비교 횟수, 반복 판과 재귀 판이 같은 결과, 표준 `qsort`와 무작위 2,000개 비교, 빈 배열·1개·모두 같은 값·정렬됨·역순을 컴파일해 실행(ASan·UBSan) — [40_insertion-sort_impl.c](/Hongs_Blog/studies/data-structures/code/40_insertion-sort_impl/). 모든 순열($$n \le 8$$, 약 4만 6천 개)에서 비교 횟수의 범위와 밀기 횟수 — [40_insertion-sort_verify.py](/Hongs_Blog/studies/data-structures/code/40_insertion-sort_verify/)</div>

</div>


## 정의

입력은 정수 $$n$$개가 든 배열 `a[0]`부터 `a[n-1]`까지다($$n \ge 0$$). 끝나면 같은 값들이 같은 배열 안에 작은 것부터 놓인다. 슬라이드는 이 구간을 `a[0:n-1]`로 적는다[^2].

```c
void insertion_sort(int a[], int n)
{
    for (int i = 1; i < n; i++) {
        int t = a[i];                 /* 이번에 끼울 값 */
        int j;
        for (j = i - 1; j >= 0 && t < a[j]; j--)
            a[j + 1] = a[j];          /* t보다 큰 값을 한 칸 뒤로 민다 */
        a[j + 1] = t;                 /* 빈 자리에 t를 놓는다 */
    }
}
```

안쪽 `for`의 조건은 두 개다. `j >= 0`은 배열의 맨 앞을 넘어가지 않게 막고, `t < a[j]`는 `t`보다 큰 값을 만나는 동안만 계속 밀게 한다. C는 `&&`의 앞쪽이 거짓이면 뒤쪽을 계산하지 않는다. 그래서 `j`가 −1이 되었을 때 `a[-1]`을 읽지 않는다[^s1].

### 재귀로 보기

같은 방법을 "작은 문제로 줄이기"로 읽을 수도 있다[^3].

- 값이 한 개 이하면 이미 정렬되어 있다.
- 두 개 이상이면 앞의 $$n - 1$$개 `a[0:n-2]`를 같은 방법으로 먼저 정렬한다.
- 마지막 값 `a[n-1]`을 정렬된 앞부분에 끼워 넣는다.

위 반복문의 `i`번째 바퀴가 바로 "앞의 `i`개가 정렬된 상태에서 `a[i]`를 끼우는" 단계다. 그래서 보통은 재귀 없이 반복문으로 짠다[^3].

### 왜 맞는가

바깥 `for`가 `i`번째 바퀴를 시작할 때마다 다음이 맞다. `a[0]`부터 `a[i-1]`까지에는 처음에 그 칸들에 있던 값이 그대로 들어 있고, 작은 것부터 놓여 있다(반복문 내내 맞는 말이라 루프 불변식이라 부른다)[^s1].

- **처음.** `i = 1`이면 앞부분은 `a[0]` 한 칸이다. 한 칸짜리는 늘 정렬되어 있다.
- **한 바퀴 뒤.** 안쪽 `for`는 `t`보다 큰 값만 한 칸씩 뒤로 옮긴다. 옮긴 값들끼리의 순서는 그대로다. 멈춘 자리의 왼쪽은 `t` 이하, 오른쪽은 `t`보다 크다. 그 사이 빈칸에 `t`를 놓으면 `a[0]`부터 `a[i]`까지가 정렬된다.
- **끝.** `i = n`이 되어 반복문을 나오면 앞부분이 배열 전체다.

귀납법으로 증명하는 틀과 같은 모양이다: [수학적 귀납법 ↔ 루프 불변식](/Hongs_Blog/studies/algorithms/induction-loop-invariant/).

### 복잡도

비용은 `t < a[j]` 비교를 몇 번 하는지로 센다[^4]. `i`번째 바퀴에서 비교는 많아야 `i`번이다. 앞부분이 [1, 2, 3, 4]이고 `t = 0`이면 네 값과 모두 견주어 4번이다. 모든 바퀴가 이렇게 끝까지 가면 합은

$$1 + 2 + 3 + \cdots + (n - 1) = \frac{(n - 1)n}{2}$$


이다. $$n = 5$$이면 $$\frac{4 \times 5}{2} = 10$$번으로, 위 표의 합과 같다.

| 경우 | 입력의 예 | 비교 횟수 | 시간 |
|---|---|---|---|
| 가장 좋을 때 | 이미 정렬됨 | $$n - 1$$ (바퀴마다 1번) | $$\Theta(n)$$ |
| 가장 나쁠 때 | 역순 | $$\frac{(n - 1)n}{2}$$ | $$\Theta(n^2)$$ |

슬라이드는 이 결과를 "삽입 정렬은 $$O(n^2)$$"으로 적고 뜻을 풀어 준다. 크기 $$n$$인 어떤 입력에서도 시간(또는 연산 횟수)이 $$c \cdot n^2$$을 넘지 않는다는 말이다. 기호로 쓰면, 어떤 상수 $$c > 0$$와 $$n_0$$가 있어서 $$n \ge n_0$$인 모든 $$n$$에서 시간이 $$c n^2$$ 이하다. 가장 나쁠 때가 $$\Theta(n^2)$$이므로 $$n$$이 두 배가 되면 시간은 네 배쯤 된다[^5]. 역순 100개와 200개의 비교 횟수는 4,950번과 19,900번으로 4.02배다. 문장마다 몇 번 실행되는지까지 세는 방법은 [연산 횟수와 단계 수 세기](/Hongs_Blog/studies/data-structures/operation-step-count/)에 있다.

세 가지를 더 알아 두면 좋다[^s1].

- **밀기 횟수는 "순서가 뒤집힌 쌍"의 수다.** 앞에 있는데 더 큰 값 하나마다 한 번씩 민다. [1, 2, 4, 3, 5, 6, 8, 7]은 뒤집힌 쌍이 (4, 3), (8, 7) 둘뿐이라 밀기 2번, 비교 9번에 끝난다. 같은 길이의 역순은 28번씩이다. 거의 정렬된 자료에 삽입 정렬이 빠른 까닭이다.
- **비교가 가장 많은 입력은 역순 하나가 아니다.** 한 바퀴의 비교 횟수는 "앞부분에서 `t`보다 큰 값의 수 + 1"이고, 맨 앞까지 가면 +1이 없다. 위 예 [7, 3, 6, 2, 1]도 역순이 아닌데 10번이다. 길이 5에서 10번이 나오는 순서는 16가지다.
- **덤 공간은 변수 `t`, `j`뿐이다.** 그리고 값이 같은 것끼리는 처음 순서가 지켜진다(안정 정렬). 조건이 `t < a[j]`라서 같은 값은 밀지 않기 때문이다. `t <= a[j]`로 쓰면 뒤집힌다.

## 활용

- 구현: [40_insertion-sort_impl.c](/Hongs_Blog/studies/data-structures/code/40_insertion-sort_impl/). 연습: [정렬 추적 연습](/Hongs_Blog/studies/data-structures/sort-tracing-practice/)
- 빠른 정렬의 마무리로 쓴다. 퀵 정렬은 조각이 15개쯤 이하로 작아지면 재귀를 멈추고 삽입 정렬로 넘긴다[^6]: [퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/).
- 병합 정렬에서 처음에 짧은 정렬된 조각을 만들 때도 쓴다[^7]: [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/).
- 흔한 실수: 안쪽 조건의 순서를 `t < a[j] && j >= 0`으로 바꿔 쓰는 것. `j`가 −1일 때 `a[-1]`을 먼저 읽는다.

## 연결

- 선수: [연산 횟수와 단계 수 세기](/Hongs_Blog/studies/data-structures/operation-step-count/), [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/)
- 같은 $$O(n^2)$$인데 일하는 방식이 다른 정렬: [선택 정렬](/Hongs_Blog/studies/data-structures/selection-sort/). 더 빠른 정렬: [퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/), [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/)
- 파이썬에서 정렬을 쓰는 법과 병합 정렬과의 비교 그림: [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `[4, 1, 3, 2]`를 삽입 정렬할 때, `i = 2`인 바퀴가 끝난 뒤의 배열과 그때까지의 비교 횟수를 쓰라. 끝까지 가면 비교는 모두 몇 번인가?</summary>

**답:** `[1, 3, 4, 2]`, 3번. 끝까지 가면 6번이다.<br>
**이유:** `i = 1`에서 1을 4와 견주어(1번) 맨 앞에 놓는다. `i = 2`에서 3을 4와 견주어 밀고, 1과 견주어 멈춘다(2번). `i = 3`에서 2를 4, 3과 견주어 밀고 1에서 멈춘다(3번). 흔한 오답은 멈출 때의 비교를 빼고 세는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 안쪽 `for (j = i - 1; j >= 0 && t < a[j]; j--) a[j + 1] = a[j];`가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 정렬된 앞부분에서 `t`보다 큰 값들을 오른쪽 끝부터 한 칸씩 뒤로 밀어 `t`가 들어갈 빈칸을 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `[1, 2, 4, 3, 5, 6, 8, 7]`과 `[8, 7, 6, 5, 4, 3, 2, 1]`은 길이가 같다. 삽입 정렬의 비교 횟수는 각각 몇 번이고, 왜 이렇게 차이가 나는가?</summary>

**답:** 9번과 28번이다.<br>
**이유:** 한 바퀴는 `t`보다 크지 않은 값을 만나는 순간 멈춘다. 앞의 배열은 바퀴 일곱 번 가운데 다섯 번이 한 번 견주고 멈추고, 3과 7을 끼울 때만 두 번 견준다($$5 + 2 \times 2 = 9$$). 뒤의 배열은 매번 맨 앞까지 가서 $$1 + 2 + \cdots + 7 = 28$$번이다. 밀기 횟수는 순서가 뒤집힌 쌍의 수와 같아서 2번과 28번이다[^s1].

</details>


[^1]: 자료구조 14회 강의 자료 「DS_Week14_Lecture_2024」, p.3 (Sorting: 오름차순으로 다시 늘어놓기, 7, 3, 6, 2, 1의 예)
[^2]: 자료구조 2회 강의 자료 「DS_Week2_2024」, p.6 (Insertion Sort 코드)
[^3]: 자료구조 14회 강의 자료 「DS_Week14_Lecture_2024」, p.4 (Insertion Sort: 재귀로 본 설명, "Usually implemented nonrecursively")
[^4]: 자료구조 2회 강의 자료 「DS_Week2_2024」, p.8~12 (Comparison Count, Worst-Case Comparison Count)
[^5]: 같은 자료, p.18 (Complexity of Insertion Sort)
[^6]: 자료구조 14회 강의 자료 「DS_Week14_Lecture_2024」, p.18 (조각 크기가 15 이하면 삽입 정렬)
[^7]: 같은 자료, p.28 (Internal Merge Sort Review: Phase 1의 Insertion sort)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 추적 표, `&&`가 뒤쪽을 계산하지 않는다는 설명, 루프 불변식 논증, 가장 좋을 때의 비교 횟수 $$n - 1$$, 밀기 횟수와 뒤집힌 쌍의 관계, 비교가 가장 많은 순서의 수, 안정 정렬, 카드 C1~C3의 수치는 슬라이드에 없다. 슬라이드는 가장 좋을 때를 $$\Theta(n)$$이라고만 적는다. 불변식 논증은 Cormen 외, *Introduction to Algorithms* 3판 2.1절의 삽입 정렬 증명과 같은 틀이다. 수치는 위 두 코드로 확인했다.
{% endraw %}
