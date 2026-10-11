---
layout: "note"
title: "9주차 수업 문제 풀이"
display_title: "9주차 수업 문제 풀이"
kind: "practice"
kind_label: "연습"
num: "30"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "9주차 수업에서 다룬 문제 세 개다. 트리 순회, 이진 탐색 트리, 힙을 하나씩 쓴다. 문제마다 먼저 직접 풀어 본 뒤 전략과 풀이를 펼친다. 슬라이드의 풀이 코드에는 컴파일되지 않거나 일부 입력에서 틀리는 곳이 있어, 여기에는 고친 코드를 싣고 무엇을 고쳤는지 따로 적었다."
prev_url: "/studies/data-structures/heap-tracing-ladder/"
prev_title: "힙 삽입·삭제 추적 예제 사다리"
next_url: "/studies/data-structures/bst-ladder/"
next_title: "이진 탐색 트리 삽입·삭제 예제 사다리"
math: true
mermaid: false
code_count: 3
permalink: "/studies/data-structures/week9-inclass/"
---
{% raw %}
9주차 수업에서 다룬 문제 세 개다. 트리 순회, 이진 탐색 트리, 힙을 하나씩 쓴다[^1]. 문제마다 먼저 직접 풀어 본 뒤 전략과 풀이를 펼친다. 슬라이드의 풀이 코드에는 컴파일되지 않거나 일부 입력에서 틀리는 곳이 있어, 여기에는 고친 코드를 싣고 무엇을 고쳤는지 따로 적었다.

세 문제가 쓰는 트리 노드는 같다[^2].

```c
typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;
```

## p1 · 좋은 노드 세기

이진 트리의 뿌리가 주어진다. 뿌리에서 노드 X까지 가는 길 위에 X보다 큰 값을 가진 노드가 하나도 없으면 X를 좋은 노드라 한다. 좋은 노드가 몇 개인지 돌려준다[^3].

- 예 1: 뿌리 3, 왼쪽 자식 1, 오른쪽 자식 4 → 2 (3과 4)
- 예 2: 뿌리 3의 자식이 1과 4, 1의 왼쪽 자식이 3, 4의 자식이 1과 5 → 4

사용 개념: 전위 순회([트리 순회와 이진 탐색 트리](/Hongs_Blog/studies/algorithms/tree-traversal-bst/))

<details class="callout callout-hint" markdown="1">
<summary class="callout-title" markdown="span">풀이 전략</summary>

노드 X가 좋은지 알려면 "뿌리에서 X의 부모까지 오는 길에서 가장 큰 값" 하나만 있으면 된다. X가 그 값 이상이면 좋은 노드다. 이 값은 내려가면서 만들 수 있다. 부모에게서 받은 최댓값과 자기 값 가운데 큰 쪽을 자식에게 넘기면 된다. 자기를 먼저 보고 자식으로 내려가니 전위 순회다. 떠올리는 실마리는 "길 위의 정보가 필요하면 재귀 함수의 인자로 들고 내려간다"다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *무엇을 들고 내려가나:* `prevMax` = 뿌리에서 부모까지의 최댓값.
2. *이 노드가 좋은가:* `root->val >= prevMax`이면 좋은 노드다.
3. *자식에게 넘길 값:* 좋은 노드면 자기 값이 새 최댓값이고, 아니면 받은 값을 그대로 넘긴다.
4. *더하기:* 자기(0 또는 1) + 왼쪽에서 센 수 + 오른쪽에서 센 수.

```c
int traversal(TreeNode *root, int prevMax)
{
    if (root == NULL) return 0;
    int good = (root->val >= prevMax) ? 1 : 0;          /* 길 위에 나보다 큰 값이 없었다 */
    int maxVal = good ? root->val : prevMax;            /* 아래로 넘길 최댓값 */
    return good + traversal(root->left, maxVal) + traversal(root->right, maxVal);
}

int goodNodes(TreeNode *root)
{
    if (root == NULL) return 0;
    return traversal(root, root->val);                  /* 뿌리는 늘 좋은 노드다 */
}
```

예 2를 따라가면: 뿌리 3(좋음, 넘기는 값 3) → 왼쪽 1(3보다 작아 아님, 넘기는 값 3) → 그 아래 3(3 이상이라 좋음) → 오른쪽 4(좋음, 넘기는 값 4) → 그 아래 1(아님), 5(좋음). 좋은 노드는 3, 3, 4, 5의 넷이다. 노드마다 한 번씩 들르니 노드가 $$n$$개면 $$O(n)$$이다.

</details>


<details class="callout callout-warning" markdown="1">
<summary class="callout-title" markdown="span">원본 오류 의심 (슬라이드 9)</summary>

원문: `goodNodes`가 먼저 나오고 그 안에서 `traversal(root, maxVal)`을 부른다. `traversal`의 정의는 그 아래에 있다. / 문제점: C는 쓰기 전에 선언된 함수만 부를 수 있다. 컴파일하면 `call to undeclared function 'traversal'` 오류가 난다. / 수정안: 위 코드처럼 `traversal`을 먼저 두거나, `goodNodes` 위에 `int traversal(TreeNode *root, int prevMax);` 한 줄을 넣는다. / 근거: 슬라이드 그대로 컴파일하면 오류, 한 줄을 넣으면 예 1과 예 2에서 2와 4가 나온다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 슬라이드의 트리 → 2, 원문의 예 → 4, 3, 1, 무작위 트리 3,000개에서 "노드마다 길을 다시 걸어 최댓값을 구하는" 느린 풀이와 같은 답 — [30_week9-inclass_p1.c](/Hongs_Blog/studies/data-structures/code/30_week9-inclass_p1/)</div>

</div>


**변형.** (가) "길 위에 X보다 **작은** 값이 없으면 좋은 노드"로 바꾸면 예 1과 예 2의 답은? (나) 예 2에서 좋은 노드의 값을 모두 더하면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) 넘기는 값을 최솟값으로, 비교를 `root->val <= prevMin`으로 바꾼다. 예 1은 3과 1의 2개, 예 2는 뿌리 3, 왼쪽 1, 4 아래의 1의 3개다. (나) $$3 + 3 + 4 + 5 = 15$$. 세는 대신 값을 더하면 된다.

</details>


## p2 · 이진 탐색 트리인지 판별하기

이진 트리가 주어진다. 이진 탐색 트리이면 1, 아니면 0을 돌려준다[^4]. 슬라이드의 그림은 20, 10, 40, 6, 15, 30, 2, 8, 25를 넣은 나무다.

사용 개념: [이진 탐색 트리의 탐색과 삽입](/Hongs_Blog/studies/data-structures/bst-search-insert/)의 정의

<details class="callout callout-hint" markdown="1">
<summary class="callout-title" markdown="span">풀이 전략</summary>

정의는 "왼쪽 **부분 트리 전체**가 더 작고 오른쪽 **부분 트리 전체**가 더 크다"다. 자식 둘하고만 견주면 손자가 조부모의 규칙을 깨는 것을 놓친다. 그래서 위에서 내려오며 "이 자리에 올 수 있는 값의 범위"를 넘긴다. 뿌리는 아무 값이나 된다. 왼쪽으로 내려가면 위쪽 끝이 지금 노드의 값으로 줄고, 오른쪽으로 내려가면 아래쪽 끝이 지금 노드의 값으로 오른다. 실마리는 p1과 같다. 길 위의 정보를 인자로 들고 내려간다.

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *무엇을 들고 내려가나:* 범위의 양 끝 `min`, `max`(끝 값 자체는 빼고). 끝이 없으면 `NULL`.
2. *이 노드가 범위 안인가:* 아래 끝 이하이거나 위 끝 이상이면 0.
3. *자식에게 넘길 범위:* 왼쪽에는 (`min`, 내 값), 오른쪽에는 (내 값, `max`).
4. *모으기:* 양쪽이 모두 1이어야 1.

```c
int isBSTNode(const TreeNode *root, const int *min, const int *max)
{
    if (root == NULL) return 1;
    if (min && root->val <= *min) return 0;
    if (max && root->val >= *max) return 0;
    return isBSTNode(root->left, min, &root->val)       /* 왼쪽은 나보다 작아야 한다 */
        && isBSTNode(root->right, &root->val, max);     /* 오른쪽은 나보다 커야 한다 */
}

int isBST(const TreeNode *root)
{
    return isBSTNode(root, NULL, NULL);
}
```

그림의 나무는 1이다. 10의 왼쪽 자식이 5이고 5의 오른쪽 자식이 15인 나무는 0이다. 15가 "10보다 작아야 하는 자리"에 있기 때문이다. 노드마다 한 번씩 들러 $$O(n)$$이다.

</details>


<details class="callout callout-warning" markdown="1">
<summary class="callout-title" markdown="span">원본 오류 의심 (슬라이드 15, 16)</summary>

원문: 슬라이드 15 `return isBSTNode(root, -32768, 32767);`, 슬라이드 16 `printf(“is BST", result);` / 문제점: ① 범위의 양 끝을 16비트 정수의 끝 값으로 넘긴다. 값이 `int`라 그 밖의 값도 들어올 수 있다. 10의 오른쪽 자식이 40000인 올바른 나무에 0을 돌려준다. ② 여는 따옴표가 둥근 따옴표(“)라 컴파일되지 않고, 형식 문자열에 `%d`가 없어 결과가 찍히지 않는다. / 수정안: ① "끝이 없다"를 `NULL` 포인터로 나타낸다(위 코드). ② `printf("is BST: %d\n", result);` / 근거: 두 판을 같은 나무에 돌리면 슬라이드 판 0, 고친 판 1. 슬라이드 16을 그대로 컴파일하면 `unexpected character <U+201C>` 오류가 난다.

</details>


**초안에서 배울 것.** 수정본 전에 올라온 초안 두 개의 풀이는 다음과 같았다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">초안 (가): 자식 둘하고만 견주기</summary>

노드마다 "왼쪽 자식 ≤ 나 ≤ 오른쪽 자식"만 확인했다. 10(5(−, 15), −)를 이진 탐색 트리라고 답한다. 조건이 부분 트리 전체에 걸려 있다는 것을 놓쳤다([이진 탐색 트리의 탐색과 삽입](/Hongs_Blog/studies/data-structures/bst-search-insert/)의 오해 항목).

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">초안 (나): <code>&#124;&#124;</code>를 `&&`로 쓰기</summary>

범위 검사를 `if (root->val <= min && root->val >= max) return 0;`으로 썼다. 범위가 멀쩡한 동안(min < max)에는 "min 이하이면서 max 이상"인 값이 없어 0을 돌려줄 수 없다. 그래서 5(9, 1) 같은 나무도 통과한다. 0이 나오는 것은 조상이 이미 규칙을 깨서 범위가 뒤집힌 자리에서뿐이다. 예를 들어 5(9(−, 7), −)에서는 7의 자리의 범위가 (9, 5)로 뒤집혀 있어 0이 나온다. 무작위로 만든 "이진 탐색 트리가 아닌 나무" 966개 가운데 929개를 통과시켰다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 슬라이드의 두 나무 → 1, 큰 키가 든 나무에서 슬라이드 판과 고친 판의 답, 초안 두 개의 반례, `INT_MIN`·`INT_MAX`가 든 나무, 무작위 나무 3,000개에서 "중위 순회가 늘 커지는가"로 본 느린 판정과 같은 답 — [30_week9-inclass_p2.c](/Hongs_Blog/studies/data-structures/code/30_week9-inclass_p2/)</div>

</div>


**변형.** (가) 범위를 넘기지 않고 중위 순회로 판별하려면 무엇을 기억해야 하는가? (나) 같은 키를 오른쪽에 둘 수 있는 정의(왼쪽 < 자기 ≤ 오른쪽)로 바꾸면 코드의 어디를 고치는가? 5(3, 5)와 5(5, 7)은 각각 어떻게 판정되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) 바로 앞에 본 노드 하나만 기억한다. 중위 순회로 돌면서 지금 값이 앞의 값보다 크지 않으면 0이다. 이진 탐색 트리의 중위 순회는 늘 커지기만 하기 때문이다. (나) 아래 끝 검사를 `root->val < *min`으로 바꾼다(같아도 된다). 위 끝 검사는 그대로 `>=`다. 5(3, 5)는 강의의 정의로 0, 바꾼 정의로 1이다. 5(5, 7)은 같은 키가 왼쪽에 있어 두 정의 모두 0이다.

</details>


## p3 · 더 맵게

매운 것을 좋아하는 Leo는 모든 음식의 스코빌 지수를 K 이상으로 만들고 싶다. 그래서 가장 맵지 않은 음식 두 개를 다음과 같이 섞어 새 음식을 만든다.

> 섞은 음식의 스코빌 지수 = 가장 맵지 않은 음식의 지수 + (둘째로 맵지 않은 음식의 지수 × 2)


모든 음식이 K 이상이 될 때까지 되풀이한다. 음식들의 지수가 담긴 배열 `scoville`과 K가 주어질 때, 섞어야 하는 최소 횟수를 돌려준다[^5].

- 예: `[1, 2, 3, 9, 10, 12]`, K = 7 → 2[^6]

사용 개념: [최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)의 최소 힙, 우선순위 큐([힙과 우선순위 큐](/Hongs_Blog/studies/algorithms/heap/))

<details class="callout callout-hint" markdown="1">
<summary class="callout-title" markdown="span">풀이 전략</summary>

매번 필요한 것은 "지금 가장 작은 둘"이다. 섞은 값을 다시 넣으면 순서가 바뀌므로, 배열을 매번 정렬하면 한 번에 $$O(n \log n)$$씩 든다. "가장 작은 것 꺼내기"와 "하나 넣기"만 빠르면 되니 최소 힙이 맞다. 둘 다 $$O(\log n)$$이다. 실마리는 "가장 작은(큰) 것을 되풀이해 꺼내고, 중간에 새 값이 들어온다"다[^6][^7].

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *힙 만들기:* 모든 음식을 최소 힙에 넣는다. $$n$$번 넣으니 $$O(n \log n)$$.
2. *끝났나:* 힙의 맨 위(가장 작은 값)가 K 이상이면 모두 K 이상이다. 센 횟수를 돌려준다. $$O(1)$$.
3. *섞을 수 있나:* 힙에 하나만 남았는데 K보다 작으면 더 섞을 짝이 없다. −1을 돌려준다.
4. *섞기:* 가장 작은 둘을 꺼내 `a + b * 2`를 넣고 횟수를 1 늘린다. 2로 돌아간다.

```c
int solution(const int scoville[], int n, int k)
{
    heapType *h = createHeap(n);
    for (int i = 0; i < n; i++) pushHeap(h, scoville[i]);
    int cnt = 0;
    while (topHeap(h) < k) {               /* 가장 안 매운 것이 아직 K보다 작다 */
        if (h->heap_size < 2) {            /* 섞을 짝이 없다: 만들 수 없다 */
            cnt = -1;
            break;
        }
        long long a = popHeap(h);          /* 가장 안 매운 것 */
        long long b = popHeap(h);          /* 둘째로 안 매운 것 */
        pushHeap(h, a + b * 2);
        cnt++;
    }
    destroyHeap(h);
    return cnt;
}
```

힙은 1번 칸부터 쓰는 최소 힙이다. 넣을 때는 맨 끝에 구멍을 만들고, 부모가 더 크면 부모를 구멍으로 내리며 올라간다. 꺼낼 때는 맨 끝 값을 들고 뿌리의 구멍을 아래로 내리며, 두 자식 가운데 작은 쪽을 올린다.

```c
void pushHeap(heapType *h, long long item)
{
    if (h->heap_size >= h->capacity) { fprintf(stderr, "Heap is full\n"); exit(1); }
    int i = ++h->heap_size;                        /* 맨 끝에 구멍을 하나 만든다 */
    while (i != 1 && item < h->heap[i / 2]) {      /* 부모가 더 크면 부모를 구멍으로 내린다 */
        h->heap[i] = h->heap[i / 2];
        i /= 2;
    }
    h->heap[i] = item;
}

long long popHeap(heapType *h)
{
    if (h->heap_size == 0) { fprintf(stderr, "Heap is empty\n"); exit(1); }
    long long item = h->heap[1];                   /* 돌려줄 가장 작은 값 */
    long long tmp = h->heap[h->heap_size--];       /* 맨 끝 값을 들고 */
    int parent = 1, child = 2;                     /* 뿌리의 구멍을 아래로 내린다 */
    while (child <= h->heap_size) {
        if (child < h->heap_size && h->heap[child] > h->heap[child + 1]) child++;   /* 더 작은 자식 */
        if (tmp <= h->heap[child]) break;
        h->heap[parent] = h->heap[child];
        parent = child;
        child *= 2;
    }
    h->heap[parent] = tmp;
    return item;
}
```

K = 7로 따라가면: 1과 2를 꺼내 $$1 + 2 \times 2 = 5$$를 넣는다(3, 5, 9, 10, 12). 3과 5를 꺼내 $$3 + 5 \times 2 = 13$$을 넣는다(9, 10, 12, 13). 맨 위 9가 7 이상이라 끝. 2번이다. 섞을 때마다 음식이 하나 줄어 섞기는 많아야 $$n - 1$$번이고, 한 번에 힙 연산 세 번이니 전체는 $$O(n \log n)$$이다.

</details>


<details class="callout callout-warning" markdown="1">
<summary class="callout-title" markdown="span">원본 오류 의심 (슬라이드 23)</summary>

원문: `while (n > 0) { if (topHeap(heap) < k && n >= 2) { … } else if (topHeap(heap) >= k) { return cnt; } else { return -1; } }` / 문제점: `n`은 처음 음식 수이고 반복 안에서 줄지 않는다. 그래서 `n >= 2`는 "힙에 둘 이상 남았나"를 뜻하지 못한다. 답이 −1이어야 하는 입력에서 힙이 하나만 남아도 계속 섞으려 하고, 빈 힙에서 꺼낸 −1이 섞여 값이 점점 작아지며 끝나지 않는다. / 수정안: 남은 개수는 `h->heap_size`로 본다(위 코드). / 근거: `[1, 2]`에 K = 100, `[1, 1, 1]`에 K = 10을 주면 슬라이드 판은 2초 안에 끝나지 않았다. 고친 판은 −1을 돌려준다. 만들 수 있는 입력(K = 7, K = 15)에서는 슬라이드 판도 2와 4로 맞다.

</details>


<details class="callout callout-warning" markdown="1">
<summary class="callout-title" markdown="span">원본 오류 의심 (슬라이드 25, 27)</summary>

원문: `printf(stderr, "Memory allocation failed\n");`, `printf(stderr, "Heap is empty\n");`, `printf(stderr, "Heap is full\n");` / 문제점: `printf`의 첫 인자는 형식 문자열이어야 하는데 파일 포인터 `stderr`를 넘겼다. 컴파일러가 형이 맞지 않는다고 경고하고, 실행되면 무슨 일이 생길지 정해져 있지 않다. 초안에는 `fprintf`였는데 수정본에서 바뀌었다. 슬라이드 26의 `popHeap`은 `fprintf`로 옳다. / 수정안: `fprintf(stderr, …)`. / 근거: 컴파일하면 `incompatible pointer types passing 'FILE *' … to parameter of type 'const char *'` 경고가 세 군데서 난다.

</details>


그 밖에 고친 곳과 어긋나는 곳이다.

- **풀어 주지 않는 메모리.** 슬라이드의 `solution`은 `createHeap`으로 잡은 힙을 풀지 않고 돌아간다. 고친 판은 돌아가기 전에 `destroyHeap`을 부른다[^s1].
- **힙의 크기.** 슬라이드는 힙을 `MAX_ELEMENT`(100) + 1칸으로 굳혀 두었다. 고친 판은 음식 수만큼 잡는다[^s1].
- **넘침.** 두 값이 모두 K보다 작아도 `a + b * 2`는 K의 세 배 가까이 될 수 있다. K가 7억을 넘으면 `int`(약 21억까지)에 안 들어가므로 `long long`으로 담았다. `[9억, 9억]`, K = 10억이면 섞은 값이 27억이다[^s1].
- **설명과 풀이가 다른 방향.** 슬라이드 18은 힙의 연산을 "우선순위가 **가장 큰** 원소 보기·꺼내기"로 적었는데, 이 문제의 풀이는 가장 **작은** 것을 꺼내는 최소 힙이다[^7]. 틀린 것은 아니고, 문제에 맞춰 방향을 고른 것이다.
- **표와 `main`의 K.** 슬라이드 20의 표는 K = 7(답 2)인데 슬라이드 24의 `main`은 `k = 15`를 넣는다. 그대로 돌리면 4가 찍힌다. 둘 다 맞는 값이고 입력이 다를 뿐이다[^6].
- **초안 (다).** 초안의 `pushHeap`은 `item > 부모`일 때 올리는 최대 힙 방향이었고, 1번 칸부터 쓰면서 배열을 `MAX_ELEMENT`칸만 잡았다. 가장 작은 둘이 필요한 문제에 큰 값이 위로 가는 힙을 쓰면 꺼내는 값이 틀리고, 칸이 하나 모자라 마지막 원소가 배열 밖에 적힌다. 방향과 칸 수는 [최대 힙과 최소 힙](/Hongs_Blog/studies/data-structures/max-heap/)에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). K = 7 → 2, K = 15 → 4, 만들 수 없는 두 입력 → −1, 경계(처음부터 모두 K 이상, 음식 하나), 27억이 나오는 큰 값, 넣고 꺼낼 때마다 "부모 ≤ 자식", 무작위 2,000개에서 "매번 배열을 훑어 가장 작은 둘을 찾는" 느린 풀이와 같은 답, malloc 횟수 = free 횟수 — [30_week9-inclass_p3.c](/Hongs_Blog/studies/data-structures/code/30_week9-inclass_p3/)</div>

</div>


**변형.** (가) 같은 배열에서 K = 15이면 몇 번 섞는가? 섞는 과정을 쓰라. (나) 음식이 $$n$$개일 때 섞는 횟수는 많아야 몇 번인가? 답이 −1이 되는 것은 어떤 때인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) 4번. 1과 2 → 5(3, 5, 9, 10, 12). 3과 5 → 13(9, 10, 12, 13). 9와 10 → 29(12, 13, 29). 12와 13 → 38(29, 38). 맨 위 29가 15 이상이라 끝.<br>
(나) 한 번 섞으면 음식이 둘 빠지고 하나 들어와 하나 준다. 그래서 많아야 $$n - 1$$번이고, 그때 음식은 하나 남는다. 그 하나가 K보다 작으면 −1이다. 예: `[1, 2]`, K = 100은 한 번 섞어 5가 되고 더 섞을 짝이 없다.

</details>


[^1]: 자료구조 9회 강의 자료 「DS_Week9_Lecture_2024 (BST, Heap 수정)」, 슬라이드 7~27 (수업 문제 세 개와 풀이)
[^2]: 같은 자료, 슬라이드 8, 14 (트리 노드 구조체)
[^3]: 같은 자료, 슬라이드 7 (문제. LeetCode "Count Good Nodes in Binary Tree"), 슬라이드 9~10 (풀이와 main)
[^4]: 같은 자료, 슬라이드 12~13 (이진 탐색 트리의 정의와 문제), 슬라이드 15~16 (풀이와 main)
[^5]: 같은 자료, 슬라이드 19 (문제. 프로그래머스 "더 맵게")
[^6]: 같은 자료, 슬라이드 20 (예와 "정렬은 O(n log n), 힙에 넣기는 O(log n)"), 슬라이드 24 (main의 k = 15)
[^7]: 같은 자료, 슬라이드 18 (힙의 연산 목록), 슬라이드 21 (최소 힙으로 푸는 순서와 최대 힙·최소 힙 그림), 슬라이드 22~27 (풀이 코드)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 풀이 전략과 하위목표로 나눈 설명, 예를 따라간 과정, 복잡도, 변형 문제와 답, 메모리 풀기·힙 크기·`long long`으로 바꾼 것은 원본에 없다. 문제 원문의 예(p1의 예 2)는 슬라이드가 링크한 LeetCode 문제의 것이다. 고친 코드와 모든 수치는 문제 코드 세 개를 돌려 확인했다.
{% endraw %}
