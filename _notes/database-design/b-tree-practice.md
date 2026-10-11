---
layout: "note"
title: "B-트리 연습"
display_title: "B-트리 연습"
kind: "practice"
kind_label: "연습"
num: "17"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: B-트리의 성질, B-트리의 높이, B-트리 검색, B-트리 삽입, B-트리 삭제."
prev_url: "/studies/database-design/b-tree-delete-ladder/"
prev_title: "B-트리 삭제 예제 사다리"
next_url: "/studies/database-design/er-diagram-design-practice/"
next_title: "ER 다이어그램 설계 연습"
math: true
mermaid: false
code_count: 2
permalink: "/studies/database-design/b-tree-practice/"
---
{% raw %}
사용 개념: [B-트리](/Hongs_Blog/studies/database-design/b-tree/)의 성질, [B-트리의 높이](/Hongs_Blog/studies/database-design/b-tree-height/), [B-트리 검색](/Hongs_Blog/studies/database-design/b-tree-search/), [B-트리 삽입](/Hongs_Blog/studies/database-design/b-tree-insert/), [B-트리 삭제](/Hongs_Blog/studies/database-design/b-tree-delete/).

슬라이드의 연습 여섯 개다. 슬라이드는 3주차와 4주차에서 번호를 따로 매겨 "연습 1"과 "연습 2"가 두 번씩 나온다. 여기서는 p1~p6으로 다시 매겼다[^1].

| 이 문서 | 슬라이드 | 풀이가 있는 곳 |
|---|---|---|
| p1 | 3주차 첫 덱 연습 1 | 03.3_B-tree-solutions.pdf p.1 |
| p2 | 3주차 첫 덱 연습 2 | 03.3_B-tree-solutions.pdf p.2 |
| p3 | 3주차 둘째 덱 연습 1 | 04.4_B-tree-solutions.pdf p.1 |
| p4 | 3주차 둘째 덱 연습 2 | 04.4_B-tree-solutions.pdf p.2 |
| p5 | 3주차 둘째 덱 연습 3 | 04.4_B-tree-solutions.pdf p.3 |
| p6 | 4주차 연습 4 | 04.4_B-tree-solutions.pdf p.4 |

트리를 한 줄로 적을 때는 층을 `/`로, 부모가 다른 묶음을 <code>&#124;</code>로 가른다.

## 문제 p1 · 올바른 B-트리 모두 그리기

최소 차수 $$t = 2$$이고 키 $$\{1, 2, 3, 4, 5\}$$를 담는 올바른 B-트리를 모두 그려라.

풀이 전략: 먼저 높이를 좁히고, 그다음 뿌리에 키를 몇 개 둘지로 경우를 나눈다. 높이가 정해지면 따질 것이 "뿌리의 키 수"와 "잎마다 키 수"뿐이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *한계 적기:* $$t = 2$$면 뿌리가 아닌 노드는 키 1~3개, 뿌리는 1~3개다. 잎은 모두 같은 깊이에 있어야 한다.
2. *높이 좁히기:* 높이 0이면 노드 하나에 5개를 다 담아야 하는데 3개까지만 된다. 높이 2면 키가 적어도 $$2t^2 - 1 = 7$$개 있어야 한다. 그래서 높이는 1이다. 뿌리 하나와 잎들뿐이다.
3. *뿌리의 키 수로 나누기:*
   - 뿌리 1개: 남은 4개를 잎 2개가 나눠 갖는다. 잎마다 1~3개이니 (1, 3), (2, 2), (3, 1) 세 가지다.
   - 뿌리 2개: 남은 3개를 잎 3개가 나눠 갖는다. (1, 1, 1) 한 가지다.
   - 뿌리 3개: 남은 2개를 잎 4개가 나눠 가져야 한다. 잎마다 1개 이상이어야 하니 안 된다.
4. *그리기:* 키를 작은 것부터 채우면 모양마다 트리가 하나로 정해진다. 모두 4개다.

```
   [2]
 +-----+
[1] [3 4 5]
```

```
    [3]
  +-----+
[1 2] [4 5]
```

```
     [4]
   +-----+
[1 2 3] [5]
```

```
   [2 4]
 +---+---+
[1] [3] [5]
```

슬라이드의 답과 같다[^2].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 모양을 빠짐없이 만들어 세면 4개 — [11_b-tree_verify.py](/Hongs_Blog/studies/database-design/code/11_b-tree_verify/)</div>

</div>


변형: 같은 키를 $$t = 3$$으로 담으면 몇 개인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

2개다. $$t = 3$$이면 노드 하나에 키가 5개까지 들어가므로 `[1 2 3 4 5]` 하나짜리 트리가 된다. 높이 1이면 뿌리가 아닌 잎마다 키가 2개 이상이어야 하므로 `[3] / [1 2] [4 5]`뿐이다[^s1].

</details>


## 문제 p2 · 높이 $$h$$에 담는 키의 최대 개수

최소 차수 $$t$$의 함수로, 높이가 $$h$$인 B-트리에 담을 수 있는 키는 가장 많을 때 몇 개인가?

풀이 전략: "가장 많이"는 모든 노드가 가득 찼을 때다. 깊이마다 노드 수를 세고, 노드 하나의 키 수를 곱한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *노드 하나:* 가득 찬 노드는 키가 $$2t - 1$$개, 자식이 $$2t$$개다.
2. *깊이별 노드 수:* 깊이 0에 1개, 깊이 1에 $$2t$$개, 깊이 $$i$$에 $$(2t)^i$$개다.
3. *더하기:* 노드 수의 합에 노드 하나의 키 수를 곱한다.

   $$n = \left(1 + 2t + (2t)^2 + \cdots + (2t)^h\right)(2t - 1) = \frac{(2t)^{h+1} - 1}{2t - 1}\,(2t - 1) = (2t)^{h+1} - 1$$


4. *넣어 보기:* $$t = 2$$, $$h = 1$$이면 $$4^2 - 1 = 15$$개다. 뿌리 [4 8 12] 밑에 키 3개짜리 잎 4개다[^3].

슬라이드의 풀이는 식에서 $$(2t - 1)$$ 밑에 "자식 수"라는 라벨을 붙였는데 "키 수"가 맞다([B-트리의 높이](/Hongs_Blog/studies/database-design/b-tree-height/)의 원본 오류 의심).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 가득 찬 트리를 만들어 센 값($$t$$ = 2~4, $$h$$ = 0~3) — [12_b-tree-height_verify.py](/Hongs_Blog/studies/database-design/code/12_b-tree-height_verify/)</div>

</div>


변형: 높이 $$h$$인 B-트리에 담을 수 있는 키는 가장 적을 때 몇 개인가? (답: $$2t^h - 1$$개. 뿌리에 1개, 나머지 노드에 $$t - 1$$개씩 둔다.)

## 문제 p3 · 노드 안에서 이분 탐색을 쓰면

B-Tree-Search가 노드 안에서 앞에서부터 하나씩 견주는 대신 이분 탐색을 쓰게 고쳤다. 이 판의 시간 복잡도는 얼마인가?

풀이 전략: 검색 시간은 "지나는 노드 수 × 노드 하나에서 견주는 횟수"다. 바뀌는 것은 뒤쪽뿐이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *지나는 노드 수:* 높이를 따라가서 $$O(\log_t n)$$이다. 그대로다.
2. *노드 하나:* 키가 많아야 $$2t - 1$$개이고 정렬되어 있으니 이분 탐색으로 $$O(\lg t)$$번 견준다. 고치기 전에는 $$O(t)$$였다.
3. *곱하기:* $$O(\lg t \cdot \log_t n)$$.
4. *밑 바꾸기:* $$\log_t n = \frac{\lg n}{\lg t}$$이므로 $$\lg t$$가 약분되어 $$O(\lg n)$$이다.

$$t$$를 $$n$$에 따라 어떻게 잡든 $$O(\lg n)$$이다[^4]. 디스크를 읽는 횟수는 줄지 않는다. 지나는 노드가 그대로이기 때문이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 키 20,000개에서 $$t$$ = 2~512로 센 비교 횟수 — [13_b-tree-search_impl.py](/Hongs_Blog/studies/database-design/code/13_b-tree-search_impl/)</div>

</div>


## 문제 p4 · L과 F 넣기

최소 차수 $$t = 3$$인 아래 트리에 L을 넣은 결과를 그리고, 이어서 F를 넣은 결과를 그려라[^5].

```
                 [G M P T X]
     +--------+-----+------+------+-----+
[A B C D E] [J K] [N O] [Q R S] [U V] [Y Z]
```

풀이 전략: 뿌리부터 "가득 찼는가"를 묻는다. 가득 찬 노드는 키 5개짜리다. 지금은 뿌리가 가득 찼다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

**L 넣기**
1. *뿌리 확인:* 뿌리 [G M P T X]가 가득 찼다. 먼저 쪼갠다. 가운데 키 P가 새 뿌리가 되고 [G M]과 [T X]로 갈린다. 높이가 1 늘어난다.
2. *자식 고르기:* L은 P보다 작으니 [G M]으로, G와 M 사이라 잎 [J K]로 간다. 둘 다 가득 차지 않았다.
3. *잎에 넣기:* [J K L]이 된다.

```
                        [P]
             +-----------------------+
           [G M]                   [T X]
     +---------+------+        +------+-----+
[A B C D E] [J K L] [N O]   [Q R S] [U V] [Y Z]
```

**F 넣기**
1. *뿌리 확인:* 뿌리 [P]는 키가 1개다. 그대로 둔다.
2. *자식 고르기:* F는 P보다 작으니 [G M]으로, G보다 작으니 잎 [A B C D E]로 간다.
3. *가득 찼나 확인:* 그 잎은 키가 5개라 가득 찼다. 쪼갠다. 가운데 키 C가 [G M]으로 올라가 [C G M]이 되고 [A B]와 [D E]로 갈린다. F는 C보다 크니 [D E]를 고른다.
4. *잎에 넣기:* [D E F]가 된다.

```
                         [P]
             +-------------------------+
          [C G M]                    [T X]
  +------+-------+------+        +------+-----+
[A B] [D E F] [J K L] [N O]   [Q R S] [U V] [Y Z]
```

슬라이드의 답과 같다[^6].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [15_b-tree-insert_impl.py](/Hongs_Blog/studies/database-design/code/15_b-tree-insert_impl/)</div>

</div>


## 문제 p5 · 키 21개 넣기

최소 차수 $$t = 2$$인 빈 B-트리에 F, S, Q, K, C, L, H, T, V, W, M, R, N, P, A, B, X, Y, D, Z, E를 이 순서로 넣은 결과를 그려라[^7].

풀이 전략: 가득 찬 노드는 키 3개짜리다. 넣을 때마다 뿌리부터 내려가며 가득 찬 노드를 만나는지만 본다. 쪼개기가 없는 삽입은 잎에 키만 하나 는다. 그러니 쪼개기가 일어나는 삽입만 꼼꼼히 그리면 된다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

쪼개기는 여덟 번의 삽입에서 모두 9번 일어난다. 줄마다 넣는 키, 일어난 쪼개기, 넣은 뒤의 트리를 적었다.

```
F: [F]
S: [F S]
Q: [F Q S]
K: 뿌리 쪼갬(Q 올라감) → [Q] / [F K] [S]
C: [Q] / [C F K] [S]
L: 자식 쪼갬(F 올라감) → [F Q] / [C] [K L] [S]
H: [F Q] / [C] [H K L] [S]
T: [F Q] / [C] [H K L] [S T]
V: [F Q] / [C] [H K L] [S T V]
W: 자식 쪼갬(T 올라감) → [F Q T] / [C] [H K L] [S] [V W]
M: 뿌리 쪼갬(Q 올라감), 자식 쪼갬(K 올라감) → [Q] / [F K] [T] / [C] [H] [L M] | [S] [V W]
R: [Q] / [F K] [T] / [C] [H] [L M] | [R S] [V W]
N: [Q] / [F K] [T] / [C] [H] [L M N] | [R S] [V W]
P: 자식 쪼갬(M 올라감) → [Q] / [F K M] [T] / [C] [H] [L] [N P] | [R S] [V W]
A: 자식 쪼갬(K 올라감) → [K Q] / [F] [M] [T] / [A C] [H] | [L] [N P] | [R S] [V W]
B: [K Q] / [F] [M] [T] / [A B C] [H] | [L] [N P] | [R S] [V W]
X: [K Q] / [F] [M] [T] / [A B C] [H] | [L] [N P] | [R S] [V W X]
Y: 자식 쪼갬(W 올라감) → [K Q] / [F] [M] [T W] / [A B C] [H] | [L] [N P] | [R S] [V] [X Y]
D: 자식 쪼갬(B 올라감) → [K Q] / [B F] [M] [T W] / [A] [C D] [H] | [L] [N P] | [R S] [V] [X Y]
Z: [K Q] / [B F] [M] [T W] / [A] [C D] [H] | [L] [N P] | [R S] [V] [X Y Z]
E: [K Q] / [B F] [M] [T W] / [A] [C D E] [H] | [L] [N P] | [R S] [V] [X Y Z]
```

눈여겨볼 곳 셋.
- **M.** 뿌리 [F Q T]가 가득 차 있어 먼저 쪼갠다(높이 2가 된다). 내려가는 길의 잎 [H K L]도 가득 차 있어 또 쪼갠다. 삽입 한 번에 쪼개기가 두 번이다.
- **A.** A가 갈 잎 [C]는 키가 1개뿐인데도, 지나가는 노드 [F K M]이 가득 차 있어 쪼갠다. K가 뿌리로 올라간다.
- **높이.** 높이가 는 것은 뿌리를 쪼갠 K와 M 두 번뿐이다.

끝난 트리는 이렇고, 슬라이드의 답과 같다[^8].

```
                    [K Q]
       +-------------+---------------+
     [B F]          [M]            [T W]
 +-----+-----+     +----+       +----+-----+
[A] [C D E] [H]   [L] [N P]   [R S] [V] [X Y Z]
```

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 21번의 삽입 뒤 트리와 쪼개기 9번 — [17_b-tree-practice_p5.py](/Hongs_Blog/studies/database-design/code/17_b-tree-practice_p5/)</div>

</div>


## 문제 p6 · C, P, V 지우기

최소 차수 $$t = 3$$인 아래 트리에서 C, P, V를 차례로 지운 결과를 그려라. 뿌리가 아닌 노드는 키가 적어도 2개 있어야 한다[^9].

```
             [E L P T X]
  +-----+-----+------+------+-----+
[A C] [J K] [N O] [Q R S] [U V] [Y Z]
```

풀이 전략: 지울 키가 잎에 있는지 뿌리에 있는지부터 본다. 잎에서 키가 하나 빠져 1개만 남으면 형제를 본다. 형제가 키를 빌려주려면 3개 이상 가지고 있어야 한다. 빌릴 형제는 왼쪽부터 본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답 (슬라이드 본문의 규칙: 왼쪽 형제 먼저)</summary>

**C 지우기: 경우 1-2b**
1. *자리 찾기:* C는 잎 [A C]에 있다.
2. *잎 확인:* 지우면 [A]로 1개가 남는다. 모자라다.
3. *빌리기:* 맨 왼쪽 잎이라 왼쪽 형제가 없다. 오른쪽 형제 [J K]는 2개뿐이라 빌릴 수 없다.
4. *합치기:* 뿌리의 E를 내려 [J K]와 합친다. [A E J K]가 된다.
5. *부모 확인:* 뿌리는 [L P T X]로 4개가 남았다. 끝이다.

```
              [L P T X]
    +-------+------+------+-----+
[A E J K] [N O] [Q R S] [U V] [Y Z]
```

**P 지우기: 경우 2 → 1-2a(왼쪽)**
1. *자리 찾기:* P는 뿌리에 있다. P의 왼쪽 자식 [N O]에서 가장 큰 키 O가 선행 키다. O를 P 자리에 올려 뿌리가 [L O T X]가 되고, 잎에서 O를 지운다.
2. *잎 확인:* 그 잎은 [N]으로 1개가 남는다. 모자라다.
3. *빌리기:* 왼쪽 형제 [A E J K]는 4개라 빌릴 수 있다. 형제의 가장 큰 키 K가 뿌리로 올라가 L 자리에 들어가고, L이 내려와 [L N]이 된다.

```
            [K O T X]
   +------+------+------+-----+
[A E J] [L N] [Q R S] [U V] [Y Z]
```

**V 지우기: 경우 1-2a(왼쪽)**
1. *자리 찾기:* V는 잎 [U V]에 있다.
2. *잎 확인:* 지우면 [U]로 1개가 남는다. 모자라다.
3. *빌리기:* 왼쪽 형제 [Q R S]는 3개라 빌릴 수 있다. S가 뿌리로 올라가 T 자리에 들어가고, T가 내려와 [T U]가 된다.

```
           [K O S X]
   +------+-----+-----+-----+
[A E J] [L N] [Q R] [T U] [Y Z]
```

</details>


<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">슬라이드 풀이의 답 (오른쪽 형제 먼저)</summary>

C를 지운 결과는 위와 같다. 왼쪽 형제가 없어서 어느 쪽을 먼저 보든 오른쪽 형제와 합친다.

**P 지우기: 경우 2 → 1-2a(오른쪽)**

선행 키 O를 올려 뿌리가 [L O T X], 잎이 [N]이 되는 데까지는 같다. 여기서 오른쪽 형제 [Q R S]를 먼저 본다. 3개라 빌릴 수 있다. 형제의 가장 작은 키 Q가 뿌리로 올라가 O 자리에 들어가고, O가 내려와 [N O]가 된다.

```
             [L Q T X]
    +-------+-----+-----+-----+
[A E J K] [N O] [R S] [U V] [Y Z]
```

**V 지우기: 경우 1-2b**

잎 [U V]가 [U]가 된다. 오른쪽 형제 [Y Z]도 왼쪽 형제 [R S]도 2개뿐이라 빌릴 수 없다. 오른쪽 형제와 합친다. 뿌리의 X가 내려와 [U X Y Z]가 된다.

```
            [L Q T]
    +-------+-----+-------+
[A E J K] [N O] [R S] [U X Y Z]
```

슬라이드의 풀이 그림과 경우 이름(C: 1-2b, P: 2 → 1-2a, V: 1-2b)이 이 결과와 같다[^10].

</details>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 04.4_B-tree-solutions.pdf p.4의 풀이는 P와 V를 지울 때 오른쪽 형제를 썼다. / 문제점: 04.4-1_B-tree-deletion.pdf p.16의 규칙은 "(1) 왼쪽 형제를 먼저 보고, 안 되면 (2) 오른쪽 형제를 본다"다. P를 지울 때 왼쪽 형제 [A E J K]는 키가 4개라 빌려줄 수 있었다. 규칙대로면 왼쪽에서 빌린다. / 수정안: 본문의 규칙을 따른 답을 먼저 싣고 풀이의 답을 함께 실었다. 두 결과 모두 올바른 B-트리이고 담긴 키가 같다. 모양만 다르다. 수업이나 채점이 어느 쪽을 기준으로 했는지는 자료만으로 알 수 없다. / 근거: 두 순서로 지운 결과와 성질 검사([17_b-tree-practice_p6.py](/Hongs_Blog/studies/database-design/code/17_b-tree-practice_p6/)). 같은 쪽의 "minimum degree t=3 (i.e., the minimum nuber of keys t=2)"도 $$t - 1 = 2$$가 맞다.

</div>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 순서의 세 단계 결과와 경우 이름, 두 결과가 모두 B-트리이고 담긴 키가 같음 — [17_b-tree-practice_p6.py](/Hongs_Blog/studies/database-design/code/17_b-tree-practice_p6/)</div>

</div>


변형: 슬라이드 풀이의 "P를 지운 뒤" 트리 `[L Q T X] / [A E J K] [N O] [R S] [U V] [Y Z]`에서 V를 왼쪽 형제 먼저 규칙으로 지우면 어떻게 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

두 형제 모두 2개뿐이라 빌릴 수 없는 것은 같다. 합칠 때 왼쪽 형제 [R S]와 합친다. 뿌리의 T가 내려와 [R S T U]가 되고 결과는 `[L Q X] / [A E J K] [N O] [R S T U] [Y Z]`이다. 풀이의 답과 합친 쪽만 다르다.

</details>


[^1]: 데이터베이스 설계 3회 강의 자료 「3_B-tree」, p.19 (연습 1, 2). 03.3-2_B-tree-insertion.pdf, p.16, 29, 31 (연습 1, 2, 3). 04.4-1_B-tree-deletion.pdf, p.21 (연습 4)
[^2]: 데이터베이스 설계 3회 강의 자료 「3_B-tree-solutions」, p.1
[^3]: 같은 자료, p.2. 03.3-2_B-tree-insertion.pdf, p.9
[^4]: 데이터베이스 설계 4회 강의 자료 「4_B-tree-solutions」, p.1 ("independently of how t might be chosen as a function of n")
[^5]: 데이터베이스 설계 3회 강의 자료 「3-2_B-tree-insertion」, p.29 (Exercise 2: Q를 넣은 뒤의 트리에 L, 이어서 F)
[^6]: 데이터베이스 설계 4회 강의 자료 「4_B-tree-solutions」, p.2. 04.4-1_B-tree-deletion.pdf, p.10
[^7]: 데이터베이스 설계 3회 강의 자료 「3-2_B-tree-insertion」, p.31 (Exercise 3). 04.4-1_B-tree-deletion.pdf, p.11
[^8]: 데이터베이스 설계 4회 강의 자료 「4_B-tree-solutions」, p.3
[^9]: 데이터베이스 설계 4회 강의 자료 「4-1_B-tree-deletion」, p.21 (Exercise 4)
[^10]: 데이터베이스 설계 4회 강의 자료 「4_B-tree-solutions」, p.4
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 풀이 전략, 하위목표로 나눈 풀이, 변형 문제, p5의 단계별 표는 슬라이드에 없다. 슬라이드는 답 그림과 식만 준다. 변형의 답과 단계별 결과는 검증 코드로 확인했다.
{% endraw %}
