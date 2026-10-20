---
layout: "note"
title: "트리 순회와 이진 탐색 트리"
display_title: "트리 순회와 이진 탐색 트리 (Tree Traversal and BST)"
kind: "concept"
kind_label: "자료구조"
num: "29"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Tree Traversal", "Binary Search Tree", "BST", "전위 순회", "중위 순회", "후위 순회", "preorder", "inorder", "postorder", "이진 탐색 트리", "포화 이진 트리"]
description: "가계도 같은 나무의 모든 칸을 한 번씩 빠짐없이 도는 순서가 순회다. 뿌리를 먼저 보면 전위, 왼쪽을 다 본 뒤 보면 중위, 양쪽을 다 본 뒤 보면 후위다. 이진 탐색 트리는 \"왼쪽은 작고 오른쪽은 크다\"는 규칙으로 값을 넣어 두는 나무라, 찾기와 넣기가 나무의 높이만큼만 걸리고 …"
prev_url: "/studies/algorithms/mst/"
prev_title: "최소 신장 트리"
next_url: "/studies/algorithms/dynamic-programming/"
next_title: "동적 계획법"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "29_tree-traversal-bst_impl.py", "u": "/studies/algorithms/code/29_tree-traversal-bst_impl/", "r": "구현"}]
permalink: "/studies/algorithms/tree-traversal-bst/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가계도 같은 나무의 모든 칸을 한 번씩 빠짐없이 도는 순서가 순회다. 뿌리를 먼저 보면 전위, 왼쪽을 다 본 뒤 보면 중위, 양쪽을 다 본 뒤 보면 후위다. 이진 탐색 트리는 "왼쪽은 작고 오른쪽은 크다"는 규칙으로 값을 넣어 두는 나무라, 찾기와 넣기가 나무의 높이만큼만 걸리고 중위로 돌면 정렬된 순서가 나온다. 대신 정렬된 값을 차례로 넣으면 한 줄로 늘어져 느려진다.

</div>


## 예시로 보기

빈 이진 탐색 트리에 5, 3, 8, 1, 4, 7, 9를 차례로 넣는다. 넣을 값이 지금 칸보다 작으면 왼쪽, 크거나 같으면 오른쪽으로 내려가 빈자리에 둔다.

```
        5
      /   \
     3     8
    / \   / \
   1   4 7   9
```

| 순회 | 규칙 | 결과 |
|---|---|---|
| 전위(preorder) | 뿌리 → 왼쪽 → 오른쪽 | 5, 3, 1, 4, 8, 7, 9 |
| 중위(inorder) | 왼쪽 → 뿌리 → 오른쪽 | 1, 3, 4, 5, 7, 8, 9 |
| 후위(postorder) | 왼쪽 → 오른쪽 → 뿌리 | 1, 4, 3, 7, 9, 8, 5 |

중위 순회 결과가 정렬되어 있다. 7을 찾을 때는 5(크다 → 오른쪽), 8(작다 → 왼쪽), 7 순서로 세 칸만 본다.

같은 값을 1, 2, 3, 4, 5 순서로 넣으면 늘 오른쪽으로만 내려가 한 줄이 된다. 높이가 4이고, 5를 찾으려면 다섯 칸을 모두 본다.

## 코드와 규칙

```python
class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None

def preorder(n, out):              # 뿌리 → 왼쪽 → 오른쪽
    if n:
        out.append(n.key)
        preorder(n.left, out)
        preorder(n.right, out)
    return out
# inorder는 out.append를 두 재귀 호출 사이에, postorder는 맨 뒤에 둔다
```

세 순회는 `out.append`의 자리만 다르다. 재귀가 자식으로 내려갔다 돌아오는 흐름은 [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/)과 같다.

**이진 탐색 트리의 규칙(표현 불변식):** 모든 칸 v에 대해, v의 왼쪽 아래 나무의 값은 모두 v보다 작고, 오른쪽 아래 나무의 값은 모두 v 이상이다. 그래서 중위 순회는 "v보다 작은 것 전부 → v → v 이상인 것 전부"를 모든 칸에서 지키며 돌아, 정렬된 순서를 낸다[^1].

| 일 | 비용 | 비고 |
|---|---|---|
| 순회 세 가지 | $$O(n)$$ | 칸마다 한 번 |
| 찾기·넣기 | $$O(h)$$ | h는 높이 |
| 높이 h | 고르게 퍼지면 약 log₂ n, 정렬된 순서로 넣으면 n − 1 | |

**포화 이진 트리를 중위 순서로 늘어놓기:** 모든 층이 꽉 찬 이진 나무(포화 이진 트리)는 층이 h개(높이 h − 1)일 때 칸이 2ʰ − 1개다. 예를 들어 위 예시처럼 층이 3개면 칸은 7개다. 이 칸들을 중위 순서로 한 줄에 늘어놓으면 뿌리는 정확히 한가운데이고, 왼쪽 절반과 오른쪽 절반이 다시 포화 이진 트리다. [표현 가능한 이진트리](/Hongs_Blog/studies/algorithms/pg150367/)가 이 성질을 쓴다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표의 세 순회, 찾기 칸 수, 한 줄로 늘어진 나무의 높이, 확인 문제 C1·C3의 답, 포화 이진 트리의 뿌리가 중위 순서의 한가운데임(h = 1 ~ 5)을 확인했다. 무작위 나무 2,000개에서 중위 순회가 정렬 결과와 같고, 찾기가 집합과 같은 답을 냈다. 깊이 1,000인 나무에서 재귀 순회가 파이썬 기본 한도(1,000)로는 `RecursionError`가 나는 것도 확인했다 — [29_tree-traversal-bst_impl.py](/Hongs_Blog/studies/algorithms/code/29_tree-traversal-bst_impl/)</div>

</div>


## 활용

- **쓰는 곳:** 폴더 크기 계산(후위: 아래를 다 더한 뒤 자신), 수식 나무 출력(중위), 나무 복사·저장(전위), 여러 언어의 정렬된 맵(예: C++ `std::map`)은 보통 균형 이진 탐색 트리(레드-블랙 트리)로 만든다. 데이터베이스 색인의 B-트리는 한 칸에 값을 여러 개 두는 균형 탐색 트리라 이진은 아니지만, "작은 쪽은 왼쪽, 큰 쪽은 오른쪽"이라는 생각은 같다[^s1].
- **파이썬에서:** 표준 라이브러리에 이진 탐색 트리가 없다. 값이 고정되어 있으면 정렬 + [이분 탐색](/Hongs_Blog/studies/algorithms/binary-search/)으로 같은 일을 한다.
- **재귀 한도:** 파이썬의 기본 재귀 한도는 1,000이다. 깊이가 1,000에 가까우면 `sys.setrecursionlimit(10**6)`으로 늘리거나 스택으로 순회를 짠다.
- **층별 순회:** 뿌리부터 층마다 왼쪽에서 오른쪽으로 도는 순서는 [BFS](/Hongs_Blog/studies/algorithms/bfs/)로 만든다.
- **흔한 실수:** 넣을 때 같은 값의 방향을 정하지 않는다. 찾기에서 None 확인을 빠뜨린다. 정렬된 입력을 그대로 넣어 느려진다.

## 연결

- 선수: [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/), [트리](/Hongs_Blog/studies/discrete-math/trees/)
- 이진 탐색 트리는 정렬된 배열의 [이분 탐색](/Hongs_Blog/studies/algorithms/binary-search/)을 "넣고 빼기 쉬운 모양"으로 바꾼 것이다. 가운데를 보고 한쪽을 버리는 흐름이 같다.
- 이진 나무는 "빈 나무, 또는 뿌리와 왼쪽·오른쪽 나무"로 정의하는 재귀 자료형이다. 순회 코드의 `if n:`과 재귀 호출 두 번이 이 정의를 그대로 따른다. 중위 순회가 정렬된 순서를 낸다는 것도 이 정의를 따라 구조적 귀납법으로 증명한다([재귀적 정의와 구조적 귀납법](/Hongs_Blog/studies/discrete-math/recursive-definitions/)).
- 포화 이진 트리의 칸 수 2ʰ − 1은 층마다 1, 2, 4, …, 2ʰ⁻¹칸을 더한 [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)다.
- 칸이 n개인 이진 나무는 높이가 적어도 ⌈log₂(n + 1)⌉ − 1이다([트리](/Hongs_Blog/studies/discrete-math/trees/)). 그래서 높이는 약 log₂ n 아래로 내려가지 않고, 비용 표의 "고르게 퍼지면"이 가장 좋은 경우다.
- 서로 다른 값 n개를 무작위 순서로 넣으면 칸 깊이의 평균은 약 $$2\ln n - 2.8$$로 $$O(\log n)$$이다(n = 1,000이면 약 11). 크기 순 i번째와 j번째 값 중 하나가 다른 쪽의 조상일 확률이 무작위 퀵정렬에서 두 값을 비교할 확률 $$\frac{2}{j - i + 1}$$과 같아서, [해싱과 무작위 알고리즘의 확률](/Hongs_Blog/studies/probability-statistics/randomized-analysis/)의 계산을 그대로 쓴다. 이것은 평균 깊이라 높이는 이보다 크고, 정렬된 순서로 넣으면 맞지 않는다.
- 연습: [길 찾기 게임](/Hongs_Blog/studies/algorithms/pg42892/), [표현 가능한 이진트리](/Hongs_Blog/studies/algorithms/pg150367/)

## 과목별 관점

**컴파일러 (3-2학기).** 컴파일러는 프로그램을 나무([추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/))로 펼친 뒤, 그 나무를 후위 순서로 돌면서 일한다. 식 `A + A * B - 1`의 나무는 뿌리가 `-`, 그 왼쪽이 `+`, `+`의 오른쪽이 `*`다. 후위로 돌면 A, A, B, `*`, `+`, 1, `-` 순서다. 연산자가 나오는 차례 `*`, `+`, `-`가 그대로 중간 코드의 줄 순서 `t0 = A * B`, `t1 = A + t0`, `t2 = t1 - 1`이 된다. 자식 둘의 결과가 나와야 부모의 계산 한 줄을 쓸 수 있기 때문이다: [AST에서 3주소 코드 만들기](/Hongs_Blog/studies/compilers/ast-to-tac/).

타입이 맞는지 검사할 때도 같은 순서를 쓴다. 잎(변수와 상수)의 타입을 먼저 정하고, 자식의 타입으로 부모의 타입을 정한다. 순서는 [타입 검사 절차](/Hongs_Blog/studies/compilers/type-checking-procedure/)에 있다. 위 '쓰는 곳'의 폴더 크기 계산과 같은 까닭이다. 아래를 다 알아야 자신을 계산할 수 있는 일은 후위로 돈다[^cs1].

**자료구조 (1-2학기).** 같은 세 순회를 C의 포인터로 쓴다. 나무의 칸 하나(노드)는 값과 두 자식의 주소를 담은 구조체이고 `treePointer`는 그 주소의 형이다([이진 트리의 배열 표현과 연결 표현](/Hongs_Blog/studies/data-structures/binary-tree-representation/)). 빈 나무는 `NULL`이다.

```c
void inOrder(treePointer ptr)
{
    if (ptr != NULL) {
        inOrder(ptr->leftChild);
        visit(ptr);                  /* 전위는 이 줄을 맨 앞에, 후위는 맨 뒤에 둔다 */
        inOrder(ptr->rightChild);
    }
}
```

위 파이썬 코드의 `if n:`이 `if (ptr != NULL)`이고 `out.append`가 `visit`다. `visit`는 그 노드에서 할 일(출력, 복사, 계산)을 맡은 함수다.


- **아래로 눌러 중위 읽기.** 나무 그림에서 모든 노드를 좌우 자리는 그대로 둔 채 바닥으로 떨어뜨리면, 바닥에 왼쪽부터 놓인 차례가 중위 순회 결과다. 왼쪽 아래 나무의 노드를 모두 뿌리보다 왼쪽에, 오른쪽 아래 나무의 노드를 모두 오른쪽에 그렸을 때 맞는 방법이다[^ds1].
- **순회가 하나 더 있다.** 위층부터 한 층씩 도는 순서다: [레벨 순서 순회](/Hongs_Blog/studies/data-structures/level-order-traversal/). 식을 나무로 그렸을 때 세 순회가 식을 적는 세 가지 방법이 되는 것은 [수식 트리와 전위·중위·후위 표기](/Hongs_Blog/studies/data-structures/expression-tree/)에, 순회 결과에서 나무를 되살리는 것(확인 문제 C3의 뒷이야기)은 [순회 결과로 이진 트리 되살리기](/Hongs_Blog/studies/data-structures/tree-from-traversals/)에 있다.
- **이진 탐색 트리의 정의가 조금 다르다.**

| | 이 문서 | 자료구조 |
|---|---|---|
| 같은 키 | 오른쪽에 둔다(오른쪽 아래 나무는 "이상") | 두지 않는다. 왼쪽 아래는 모두 더 작고 오른쪽 아래는 모두 더 크다. 노드는 (키, 값) 쌍을 담는다 |
| 높이 | 간선 수. 1 ~ 5를 차례로 넣은 한 줄짜리는 높이 4 | 층 수. 같은 나무가 높이 5 |
| 찾기·넣기의 비용 | $$O(h)$$ | $$O(\text{height})$$. 가장 나쁠 때 $$O(n)$$, 기댓값은 $$O(\log n)$$ |

이 과목은 찾기와 넣기를 C 포인터로 쓰고, 이 문서에 없는 지우기와 순위로 찾기를 더 다룬다: [이진 탐색 트리의 탐색과 삽입](/Hongs_Blog/studies/data-structures/bst-search-insert/), [이진 탐색 트리의 삭제](/Hongs_Blog/studies/data-structures/bst-delete/), [색인 이진 탐색 트리](/Hongs_Blog/studies/data-structures/indexed-bst/). 힙과 헷갈릴 때는 [최대 힙과 이진 탐색 트리 비교](/Hongs_Blog/studies/data-structures/heap-vs-bst/)를 본다.

**데이터베이스 설계 (2-2학기).** 데이터베이스의 찾아보기(색인)는 디스크에 있다. 디스크는 한 번 읽는 데 오래 걸려서, 걸리는 시간을 비교 횟수가 아니라 디스크를 읽는 횟수로 센다. 이진 탐색 트리는 노드 하나에 키가 하나라 한 층 내려갈 때마다 디스크를 한 번 읽는다. 그래서 노드 하나에 키를 여럿 담아 갈림길을 늘리고 높이를 낮춘 B-트리를 쓴다. 키 100만 개를 담으면 가장 고른 이진 탐색 트리도 높이가 19인데, 노드마다 키를 99개에서 199개까지 담는 B-트리는 높이가 2다[^bs1].

넣는 방식은 반대다. 이진 탐색 트리는 잎 밑에 새 잎을 달아 아래로 자란다. B-트리는 가득 찬 노드를 쪼개 가운데 키를 위로 올리므로, 뿌리가 쪼개질 때만 높아진다. 두 트리를 줄마다 견준 표는 [B-트리와 이진 탐색 트리 비교](/Hongs_Blog/studies/database-design/b-tree-vs-bst/)에 있다. 지우는 방식은 닮았다. 안쪽 노드의 키는 왼쪽 아래에서 가장 큰 키로 바꿔 적은 뒤 잎에서 지운다: [B-트리 삭제](/Hongs_Blog/studies/database-design/b-tree-delete/).

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 빈 이진 탐색 트리에 6, 2, 9, 1, 4, 8, 3을 차례로 넣었다. 전위, 중위, 후위 순회 결과를 쓰라.</summary>

**답:** 전위 6, 2, 1, 4, 3, 9, 8. 중위 1, 2, 3, 4, 6, 8, 9. 후위 1, 3, 4, 2, 8, 9, 6. 3은 6 → 2 → 4를 거쳐 4의 왼쪽에 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 이진 탐색 트리를 중위 순회하면 정렬된 순서가 나오는 까닭은?</summary>

**답:** 중위 순회는 어느 칸 v에서나 "왼쪽 아래 나무 전부 → v → 오른쪽 아래 나무 전부" 순서로 낸다. 이진 탐색 트리 규칙에 따라 왼쪽은 모두 v보다 작고 오른쪽은 모두 v 이상이다. 모든 칸에서 이 순서가 지켜지니, 나무 크기에 대한 귀납법으로 전체가 정렬된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 전위 순회와 후위 순회 결과가 모두 같은데 모양이 다른 두 이진 나무를 들어라.</summary>

**답:** 뿌리 1에 자식 2가 하나 있는데, 한쪽은 왼쪽 자식, 다른 쪽은 오른쪽 자식이다. 둘 다 전위 [1, 2], 후위 [2, 1]이다. 중위는 [2, 1]과 [1, 2]로 달라 구별된다. 그래서 전위와 중위(또는 후위와 중위)가 있어야 나무가 하나로 정해진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 식 `(a - b) * (c + 1)`의 나무는 뿌리가 `*`, 왼쪽 자식이 `-`, 오른쪽 자식이 `+`다. 후위 순회 결과를 쓰고, 연산자가 나올 때마다 "임시 변수 = 왼쪽 결과 연산자 오른쪽 결과" 한 줄을 써서 코드로 옮기라.</summary>

**답:** 후위 순회: a, b, `-`, c, 1, `+`, `*`. 코드: `t0 = a - b`, `t1 = c + 1`, `t2 = t0 * t1`.<br>
**이유:** 뿌리 `*`는 순회에서 맨 나중에 나온다. 그 줄을 쓰려면 두 자식의 결과 t0, t1이 먼저 있어야 한다. 전위로 돌면 `*`가 맨 먼저 나와, 아직 계산하지 않은 값을 쓰는 줄이 된다[^cs1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 빈 이진 탐색 트리에 5, 3, 5를 차례로 넣으려 한다. 둘째 5는 이 문서의 규칙으로는 어디에 놓이는가? 자료구조의 정의로는 왜 그런 나무가 있을 수 없는가?</summary>

**답:** 이 문서의 규칙은 "작으면 왼쪽, 크거나 같으면 오른쪽"이라 둘째 5는 뿌리 5의 오른쪽 자식이 된다. 자료구조의 정의는 "왼쪽 아래의 키는 모두 더 작고 오른쪽 아래의 키는 모두 더 크다"라서, 5가 5의 오른쪽 아래에 있으면 "더 크다"를 어긴다. 그 정의에서는 한 나무의 키가 모두 다르다.<br>
**이유:** 키가 모두 다르면 두 정의는 같은 나무를 만든다. 같은 키가 들어올 때만 갈린다. 코드를 가져다 쓸 때는 같은 키를 어느 쪽으로 보내는지, 아예 받지 않는지를 확인한다[^ds1].

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 14.4 "Binary trees"(전위·중위·후위의 정의, 전위와 중위로 나무가 정해지지만 전위와 후위만으로는 정해지지 않는 예 [1, 2]), Cormen 외, *Introduction to Algorithms* 3판, 12장(이진 탐색 트리 성질, 중위 순회가 정렬된 순서를 냄, 찾기·넣기 O(h)).
[^s1]: `std::map`은 C++ 표준이 구현 방식을 정하지 않지만 주요 표준 라이브러리(libstdc++, libc++, MSVC)는 레드-블랙 트리를 쓴다. B-트리는 Bayer & McCreight(1972)가 제안한 다진(多進) 균형 탐색 트리다(Cormen 외, *Introduction to Algorithms* 18장).
[^cs1]: 그 순서가 후위 순회와 같다는 것, 폴더 크기 계산과의 비교, 카드 C4는 보탠 것이다. 무작위 식 2,000개에서 만든 코드의 연산자 순서가 후위 순회의 연산자 순서와 같음을 [39_ast-to-tac_impl.py](/Hongs_Blog/studies/compilers/code/39_ast-to-tac_impl/)로 확인했다.
[^ds1]: 5, 3, 5를 넣은 모양과 1 ~ 5를 넣은 한 줄짜리의 간선 수는 [26_tree-from-traversals_verify.py](/Hongs_Blog/studies/data-structures/code/26_tree-from-traversals_verify/)로 확인했다.
[^bs1]: 높이는 [B-트리의 높이](/Hongs_Blog/studies/database-design/b-tree-height/)의 식에 최소 차수 $$t = 100$$을 넣은 값이고 [12_b-tree-height_verify.py](/Hongs_Blog/studies/database-design/code/12_b-tree-height_verify/)로 확인했다.
{% endraw %}
