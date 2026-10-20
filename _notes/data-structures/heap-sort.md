---
layout: "note"
title: "우선순위 큐 정렬과 힙 정렬"
display_title: "우선순위 큐 정렬과 힙 정렬 (Priority Queue Sort and Heap Sort)"
kind: "concept"
kind_label: "알고리즘"
num: "28"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Heap Sort", "Heapsort", "힙 정렬", "우선순위 큐 정렬", "Priority Queue Sort", "힙 만들기", "Heap Initialization", "heapify", "siftDown"]
description: "정렬할 값들을 \"가장 큰 것부터 꺼내 주는 통\"에 모두 넣었다가 하나씩 꺼내 뒤에서부터 채우면 정렬이 된다. 그 통을 힙으로 만들면 넣기와 꺼내기가 층수만큼만 걸려서, 값이 많아져도 걸리는 시간이 값 수의 제곱으로 불어나지 않는다. 힙 정렬은 여기서 한 걸음 더 나가, 통을 따로 …"
prev_url: "/studies/data-structures/max-heap/"
prev_title: "최대 힙과 최소 힙"
next_url: "/studies/data-structures/lpt-scheduling/"
next_title: "LPT 스케줄링"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "28_heap-sort_impl.c", "u": "/studies/data-structures/code/28_heap-sort_impl/", "r": "구현"}, {"t": "28_heap-sort_verify.py", "u": "/studies/data-structures/code/28_heap-sort_verify/", "r": "검증"}]
permalink: "/studies/data-structures/heap-sort/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

정렬할 값들을 "가장 큰 것부터 꺼내 주는 통"에 모두 넣었다가 하나씩 꺼내 뒤에서부터 채우면 정렬이 된다. 그 통을 힙으로 만들면 넣기와 꺼내기가 층수만큼만 걸려서, 값이 많아져도 걸리는 시간이 값 수의 제곱으로 불어나지 않는다. 힙 정렬은 여기서 한 걸음 더 나가, 통을 따로 두지 않고 정렬할 배열 자체를 힙으로 써서 덤 메모리가 들지 않는다. 대신 값이 같은 것끼리의 처음 차례는 지켜 주지 않는다.

</div>


## 예시로 보기

값을 하나씩 제자리에 끼워 넣는 [삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/)은 가장 나쁠 때 비교를 $$n(n-1)/2$$번 한다. 값이 1,000개면 499,500번이다. 가장 큰 값을 빨리 꺼내 주는 [힙](/Hongs_Blog/studies/data-structures/max-heap/)이 있으면 훨씬 적게 일하고 정렬할 수 있다.

키가 6, 8, 2, 4, 1인 다섯 값을 정렬한다. 최대 우선순위 큐에 모두 넣은 뒤, 다섯 번 꺼내면서 꺼낸 값을 배열의 오른쪽 끝부터 채운다.

| 단계 | 우선순위 큐에 남은 값 | 정렬된 배열 |
|---|---|---|
| 다 넣은 뒤 | 6, 8, 2, 4, 1 | _ _ _ _ _ |
| 1번째 꺼내기 | 6, 2, 4, 1 | _ _ _ _ 8 |
| 2번째 꺼내기 | 2, 4, 1 | _ _ _ 6 8 |
| 3번째 꺼내기 | 2, 1 | _ _ 4 6 8 |
| 4번째 꺼내기 | 1 | _ 2 4 6 8 |
| 5번째 꺼내기 | (비었다) | 1 2 4 6 8 |

큰 값부터 나오므로 오른쪽부터 채워야 오름차순이 된다. 최소 우선순위 큐를 쓰면 작은 값부터 나오니 왼쪽부터 채운다.

## 우선순위 큐 정렬

**입력:** 정수 배열 `a[0..n-1]`. **결과:** 같은 값들이 오름차순으로 놓인 `a`.

1. 값 $$n$$개를 최대 힙에 하나씩 넣는다.
2. $$n$$번 꺼내면서 `a[n-1]`, `a[n-2]`, …, `a[0]` 순서로 채운다.

```c
void pqSort(int a[], int n)
{
    int *heap = malloc(sizeof(int) * (size_t)(n + 1));       /* 1번 칸부터 쓰므로 n + 1칸 */
    int size = 0;
    if (heap == NULL) {
        fprintf(stderr, "메모리가 모자란다\n");
        exit(1);
    }
    for (int i = 0; i < n; i++) pushMax(heap, &size, a[i]);      /* n번 넣기 */
    for (int i = n - 1; i >= 0; i--) a[i] = popMax(heap, &size); /* 큰 것부터 나오니 오른쪽 끝부터 */
    free(heap);
}
```

`pushMax`와 `popMax`는 [최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)의 넣기, 꺼내기와 같다. 6, 8, 2, 4, 1을 차례로 넣으면 힙 배열은 8 6 2 4 1이 된다.

**비용.** 넣기 한 번과 꺼내기 한 번이 각각 $$O(\log n)$$이다. $$n$$번 넣는 데 $$O(n \log n)$$, $$n$$번 꺼내는 데 $$O(n \log n)$$이라 모두 $$O(n \log n)$$이다. 삽입 정렬의 $$O(n^2)$$보다 빠르다. 대신 힙으로 쓸 배열 $$n + 1$$칸이 따로 든다.

## 힙 정렬

힙 정렬은 힙으로 만든 최대 우선순위 큐를 쓰되, 처음에 하나씩 넣는 일을 $$O(n)$$ 시간에 끝나는 "힙 만들기" 한 번으로 바꾼 것이다. 흔히 정렬할 배열 안에서 모든 일을 해서 덤 배열도 없앤다[^s1].

배열 `a[0..n-1]`을 그대로 힙으로 쓰려면 0번 칸이 뿌리여야 한다. 그래서 $$i$$번 칸의 자식은 $$2i + 1$$번과 $$2i + 2$$번 칸이다([최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)의 칸 번호 표).

1. *힙 만들기.* 자식이 있는 마지막 칸($$n/2 - 1$$번)부터 0번 칸까지 거꾸로 가며, 칸마다 그 값을 제자리까지 내려 보낸다.
2. *가장 큰 값을 맨 뒤로.* 뿌리(`a[0]`)와 힙의 마지막 칸을 맞바꾼다. 가장 큰 값이 제자리에 놓였다.
3. *힙을 한 칸 줄이고 고치기.* 방금 채운 칸을 힙에서 빼고, 새 뿌리를 제자리까지 내려 보낸다.
4. 힙에 값이 하나 남을 때까지 2 ~ 3을 되풀이한다.

```c
/* a[0..n-1] 가운데 root 아래만 힙이 아닐 수 있을 때, a[root]를 제자리까지 내려 보낸다 */
static void siftDown(int a[], int n, int root)
{
    int tmp = a[root];                      /* 손에 든 값 */
    int parent = root, child = 2 * root + 1;
    while (child < n) {
        if (child + 1 < n && a[child] < a[child + 1]) child++;   /* 더 큰 자식 */
        if (tmp >= a[child]) break;
        a[parent] = a[child];
        parent = child;
        child = 2 * parent + 1;
    }
    a[parent] = tmp;
}

void heapSort(int a[], int n)
{
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, n, i);    /* 힙 만들기 */
    for (int last = n - 1; last > 0; last--) {
        int tmp = a[0];                                         /* 가장 큰 값을 맨 뒤와 맞바꾼다 */
        a[0] = a[last];
        a[last] = tmp;
        siftDown(a, last, 0);                                   /* 힙은 a[0..last-1]로 줄었다 */
    }
}
```

같은 입력 6, 8, 2, 4, 1의 추적이다[^s1].

| 단계 | 힙으로 쓰는 앞부분 | 자리 잡은 뒷부분 |
|---|---|---|
| 처음 | 6 8 2 4 1 (아직 힙이 아니다) | |
| 힙 만들기 | 8 6 2 4 1 | |
| 8을 맨 뒤로 보내고 고치기 | 6 4 2 1 | 8 |
| 6을 보내고 고치기 | 4 1 2 | 6 8 |
| 4를 보내고 고치기 | 2 1 | 4 6 8 |
| 2를 보내고 끝 | 1 | 2 4 6 8 |

힙 만들기에서는 1번 칸의 8이 자식 4, 1보다 커서 그대로이고, 0번 칸의 6이 자식 8보다 작아 한 칸 내려간다.

**왜 맞는가.** 둘째 고리가 돌 때마다 두 가지가 계속 맞는다. 앞부분 `a[0..last]`는 최대 힙이다. 뒷부분에는 전체에서 가장 큰 값들이 오름차순으로 놓여 있다. 힙의 뿌리는 앞부분에서 가장 큰 값이면서 뒷부분의 어느 값보다도 크지 않으니, 뒷부분 바로 앞에 놓으면 두 가지가 다시 맞는다[^s1].

**힙 만들기가 $$O(n)$$인 까닭.** 한 개씩 넣으면 새 값이 맨 아래에서 뿌리까지 올라갈 수 있고, 맨 아래층에 노드의 절반이 몰려 있어 긴 길을 가는 값이 많다. 힙 만들기는 거꾸로 값을 아래로 내려 보낸다. 맨 아래층의 절반은 내려갈 곳이 없고, 그 위층의 4분의 1은 많아야 한 칸만 내려간다. 내려가는 칸 수를 다 더해도 $$n$$을 넘지 않는다. 이 합의 계산은 [합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)에 있다[^s2].

실험으로 센 값이다. 오름차순으로 놓인 값 1,000개를 최대 힙으로 만들 때, 한 개씩 넣으면 값을 7,987번 옮겨 적고 힙 만들기는 992번 옮겨 적는다. 10,000개면 113,631번과 9,992번이다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 예시의 6, 8, 2, 4, 1에서 힙 배열과 꺼내는 차례, 힙 정렬의 추적 표, 카드의 값을 확인했다. 빈 배열, 값 하나, 모두 같은 값, 이미 정렬된 배열, 거꾸로 정렬된 배열과 무작위 배열 2,000개(길이 0 ~ 200)에서 두 정렬이 `qsort`와 같은 결과를 냈다. 잡은 메모리는 모두 풀었다(`leaks` 도구로 확인) — [28_heap-sort_impl.c](/Hongs_Blog/studies/data-structures/code/28_heap-sort_impl/)</div>

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 알고리즘에 횟수 세는 칸을 달아 세었다. 힙 만들기의 옮겨 적기는 $$n$$ = 1 ~ 3,000에서 늘 $$n$$보다 적었고, 한 개씩 넣기는 오름차순 입력에서 $$\sum_{i=1}^{n} \lfloor \lg i \rfloor$$번이었다. 힙 정렬의 비교는 무작위 배열 2,000개에서 $$2n \lg n + 2n$$번을 넘지 않았다. 같은 키의 차례가 바뀌는 예도 확인했다 — [28_heap-sort_verify.py](/Hongs_Blog/studies/data-structures/code/28_heap-sort_verify/)</div>

</div>


## 활용

| | 시간 | 덤 메모리 |
|---|---|---|
| 우선순위 큐 정렬 | 넣기 $$O(n \log n)$$ + 꺼내기 $$O(n \log n)$$ | 힙 배열 $$n + 1$$칸 |
| 힙 정렬 | 힙 만들기 $$O(n)$$ + 꺼내기 $$O(n \log n)$$ | 변수 몇 개 |

- **가장 나쁜 입력에서도 $$O(n \log n)$$이다.** 힙의 높이는 값이 어떻게 놓였든 $$\lfloor \lg n \rfloor$$이라, 입력에 따라 느려지는 일이 없다. 거꾸로 정렬된 1,000개를 정렬할 때 힙 정렬은 비교를 15,965번 했다[^s2]. 입력에 따라 $$O(n^2)$$까지 느려지는 정렬과의 차이는 [퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/)에서 다룬다.
- **같은 값의 차례를 지키지 않는다.** (2, a), (2, b), (1, c)를 키(앞의 수)로 힙 정렬하면 (1, c), (2, b), (2, a)가 된다. 처음에 앞에 있던 (2, a)가 (2, b) 뒤로 갔다. 뿌리와 마지막 칸을 맞바꾸는 일이 멀리 떨어진 값의 앞뒤를 뒤집기 때문이다[^s2].
- **흔한 실수.** 0번 칸부터 쓰는 배열에서 자식을 `2 * i`, `2 * i + 1`로 계산한다. 오름차순으로 정렬하려고 최소 힙을 쓴다(제자리에서 하려면 최대 힙이어야 한다. 카드 C3). 둘째 고리에서 힙 크기를 줄이지 않고 `siftDown(a, n, 0)`을 불러 이미 자리 잡은 값을 다시 끌어올린다.

## 연결

- 선수: [최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)
- 다른 정렬: [삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/), [퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/), [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/). 정렬을 골라 쓰는 법은 [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/)
- 힙 만들기 비용의 합: [합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)
- 파이썬에서 같은 일을 하는 `heapq.heapify`: [힙과 우선순위 큐](/Hongs_Blog/studies/algorithms/heap/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 배열 5, 3, 9, 1, 7, 2를 `heapSort`로 정렬한다. 힙 만들기가 끝난 뒤의 배열과, 둘째 고리를 한 바퀴, 두 바퀴 돈 뒤의 배열을 쓰라.</summary>

**답:** 힙 만들기 뒤 9 7 5 1 3 2. 한 바퀴 뒤 7 3 5 1 2 9(앞의 다섯이 힙, 9가 자리 잡았다). 두 바퀴 뒤 5 3 2 1 7 9.<br>
**이유:** 힙 만들기는 2번 칸(9), 1번 칸(3), 0번 칸(5) 순서로 본다. 3은 자식 1, 7 가운데 큰 7과 자리를 바꾸고, 5는 자식 7, 9 가운데 큰 9와 자리를 바꾼다. 흔한 실수는 0번 칸부터 앞에서 뒤로 가며 내려 보내는 것이다. 아래쪽이 아직 힙이 아닐 때 뿌리를 먼저 내려 보내면, 나중에 아래에서 올라온 큰 값이 뿌리까지 가지 못한다. 1, 2, 3, 4, 5, 6, 7에 그렇게 하면 3 5 7 4 2 6 1이 되어 뿌리 3이 자식 7보다 작다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `heapSort`의 둘째 `for` 고리가 한 바퀴 돌 때 하는 일을 한 문장으로 쓰라.</summary>

**답:** 힙에 남은 값 가운데 가장 큰 값(뿌리)을 힙의 마지막 칸과 맞바꿔 제자리에 놓고, 한 칸 줄어든 힙의 새 뿌리를 내려 보내 다시 힙으로 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 오름차순으로 정렬하는데 왜 최소 힙이 아니라 최대 힙을 쓰는가?</summary>

**답:** 값을 하나 꺼내면 힙이 한 칸 줄고, 비는 칸은 힙의 맨 뒤다. 그 빈칸에 꺼낸 값을 놓으려면 그 값이 남은 값들보다 뒤에 와야 한다. 오름차순에서 뒤에 오는 것은 큰 값이므로 가장 큰 값을 꺼내는 최대 힙이 맞다.<br>
**이유:** 최소 힙으로 같은 일을 하면 작은 값이 뒤부터 쌓여 내림차순이 된다. 배열을 따로 하나 더 쓰는 우선순위 큐 정렬이라면 최소 힙으로 꺼내 왼쪽부터 채워도 된다.

</details>


[^s1]: 배열 안에서 정렬하는 방법은 Cormen 외, *Introduction to Algorithms* 3판 6.3 ~ 6.4절의 것이고(그 책은 1번 칸부터 쓴다), 구현 코드로 확인했다.
[^s2]: 횟수는 검증 코드로 센 값이라 실험으로 확인한 것이고, $$O(n)$$의 증명은 링크한 문서에 있다.
{% endraw %}
