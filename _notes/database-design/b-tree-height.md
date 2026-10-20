---
layout: "note"
title: "B-트리의 높이"
display_title: "B-트리의 높이 (Height of a B-Tree)"
kind: "concept"
kind_label: "정리"
num: "12"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Height of a B-Tree", "B-트리 높이", "최악 높이", "Worst-case Height", "높이의 상한", "최대 키 수", "정리 18.1"]
description: "한 칸에서 길이 여러 갈래로 갈리면 나무는 금방 넓어지고, 그만큼 낮다. 값이 몇 개 들어 있는지만 알면 나무가 아무리 홀쭉해도 넘을 수 없는 높이가 정해지고, 갈래가 많을수록 그 높이는 낮아진다. 디스크를 읽는 횟수가 높이를 따라가므로 이 한계가 곧 \"아무리 나빠도 디스크를 몇 …"
prev_url: "/studies/database-design/b-tree/"
prev_title: "B-트리"
next_url: "/studies/database-design/b-tree-search/"
next_title: "B-트리 검색"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "12_b-tree-height_verify.py", "u": "/studies/database-design/code/12_b-tree-height_verify/", "r": "검증"}]
permalink: "/studies/database-design/b-tree-height/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 칸에서 길이 여러 갈래로 갈리면 나무는 금방 넓어지고, 그만큼 낮다. 값이 몇 개 들어 있는지만 알면 나무가 아무리 홀쭉해도 넘을 수 없는 높이가 정해지고, 갈래가 많을수록 그 높이는 낮아진다. 디스크를 읽는 횟수가 높이를 따라가므로 이 한계가 곧 "아무리 나빠도 디스크를 몇 번 읽는가"다. 다만 이 한계는 맨 아래 칸들의 깊이가 모두 같고 칸마다 값이 정해진 수 이상 들어 있을 때만 맞다.

</div>


## 예시로 보기

B-트리에서 연산 하나가 디스크를 읽고 쓰는 횟수는 트리의 높이에 비례한다. 그러니 "키가 $$n$$개일 때 높이가 얼마까지 커질 수 있나"를 알면 가장 나쁠 때의 비용을 안다.

최소 차수 $$t = 2$$로 높이마다 키를 몇 개까지 담는지 센다. 가장 적게 담으려면 뿌리에 키 1개, 다른 노드에도 아래 한계인 1개씩만 둔다. 가장 많이 담으려면 모든 노드를 3개로 가득 채운다.

| 높이 $$h$$ | 가장 적게 담을 때 | 가장 많이 담을 때 |
|---|---|---|
| 0 | 1 | 3 |
| 1 | 3 | 15 |
| 2 | 7 | 63 |
| 3 | 15 | 255 |

높이 2에서 가장 적게 담은 트리(키 7개)와 높이 1에서 가장 많이 담은 트리(키 15개)는 이렇게 생겼다[^s1].

```
       [4]
   +---------+
  [2]       [6]
 +---+     +---+
[1] [3]   [5] [7]
```

```
             [4 8 12]
   +-------+--------+----------+
[1 2 3] [5 6 7] [9 10 11] [13 14 15]
```

표를 거꾸로 읽는다. 높이가 2가 되려면 키가 적어도 7개는 있어야 한다. 키가 5개면 높이 0에는 다 못 담고(3개까지) 높이 2에는 모자라니(7개부터), 높이는 반드시 1이다. 키가 3개면 높이 0인 `[1 2 3]`도, 높이 1인 `[2] / [1] [3]`도 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 가장 홀쭉한 트리와 가득 찬 트리를 직접 만들어 센 노드 수와 키 수($$t$$ = 2~5), 두 등비급수의 합, 키 1~40개인 B-트리의 모든 모양에서 가장 큰 높이와 가장 작은 높이, 무작위로 만든 트리 200개, 표와 카드의 수 — [12_b-tree-height_verify.py](/Hongs_Blog/studies/database-design/code/12_b-tree-height_verify/)</div>

</div>


## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">높이의 위쪽 한계</div>

키가 $$n$$개($$n \ge 1$$)이고 최소 차수가 $$t$$($$t \ge 2$$)인 B-트리의 높이 $$h$$는 다음 값을 넘지 못한다.

$$h \le \log_t \frac{n + 1}{2}$$

</div>


$$\log_t$$는 "밑이 $$t$$인 로그"라고 읽는다. $$\log_t \frac{n+1}{2}$$은 $$t$$를 몇 번 곱해야 $$\frac{n+1}{2}$$이 되는지를 말한다. 높이는 정수이므로 이 값의 소수점 아래를 버린 수까지 될 수 있다. $$t = 2$$, $$n = 7$$이면 $$\log_2 4 = 2$$라 높이는 2 이하다. 위 표의 "높이 2에 적어도 7개"와 같은 말이다.

높이가 이 한계에 닿는 것은 뿌리를 뺀 모든 노드가 아래 한계인 $$t - 1$$개만 가질 때다.

## 증명

높이가 $$h$$인 B-트리가 담는 키 수의 가장 작은 값을 세고, $$n$$이 그 값 이상이라는 식을 $$h$$에 대해 푼다[^s2].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. 뿌리는 키가 1개 이상이고, 다른 노드는 $$t - 1$$개 이상이다. — B-트리의 성질 3
2. 깊이 1에는 노드가 2개 이상 있다. 뿌리의 키가 1개 이상이라 자식이 2개 이상이기 때문이다. — 자식 수 = 키 수 + 1
3. 깊이 $$i$$($$1 \le i \le h$$)에는 노드가 $$2t^{i-1}$$개 이상 있다. 깊이 $$i - 1$$의 노드는 잎이 아니고(잎은 모두 깊이 $$h$$에 있다), 뿌리가 아닌 내부 노드는 자식이 $$t$$개 이상이라 한 층 내려갈 때마다 노드 수가 $$t$$배 이상이 된다. 깊이 1의 2개에서 시작하면 깊이 2에 $$2t$$개, 깊이 3에 $$2t^2$$개다. — 성질 2와 3, 깊이에 대한 귀납
4. 키를 모두 더한다. 뿌리에서 1개, 깊이 $$i$$의 노드마다 $$t - 1$$개 이상이다.

   $$n \ge 1 + (t - 1)\sum_{i=1}^{h} 2t^{i-1}$$


5. 합은 첫 항이 1이고 $$t$$배씩 커지는 수 $$h$$개를 더한 것이라 $$\sum_{i=1}^{h} t^{i-1} = \frac{t^h - 1}{t - 1}$$이다. — 등비급수의 합

   $$n \ge 1 + 2(t - 1)\cdot\frac{t^h - 1}{t - 1} = 2t^h - 1$$


6. 1을 넘기고 2로 나누면 $$t^h \le \frac{n + 1}{2}$$이다. $$t \ge 2$$라 밑이 $$t$$인 로그는 큰 수에 큰 값을 주므로, 양쪽에 로그를 씌워도 부등호의 방향이 그대로다. — 로그의 성질

   $$h \le \log_t \frac{n + 1}{2} \qquad\blacksquare$$

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 3단계에서 "깊이 $$i - 1$$의 노드는 잎이 아니다"는 왜 필요한가?</summary>

잎은 자식이 없다. 중간 깊이에 잎이 끼어 있으면 그 밑으로는 노드가 늘지 않아 "한 층 내려갈 때마다 $$t$$배"가 깨진다. 모든 잎이 깊이 $$h$$에 있다는 성질 2가 이것을 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 식 맨 앞의 2는 어디서 왔는가?</summary>

뿌리 때문이다. 뿌리는 키가 1개만 있어도 되므로 자식이 2개뿐일 수 있다. 그래서 깊이 1의 노드 수가 $$t$$가 아니라 2에서 시작하고, 그 2가 아래 층의 노드 수에 계속 곱해진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 5단계에서 $$(t - 1)$$이 사라지는 까닭은?</summary>

노드마다 키가 $$t - 1$$개이고, 노드 수의 합이 $$\frac{2(t^h - 1)}{t - 1}$$이다. 곱하면 $$t - 1$$이 약분되어 $$2(t^h - 1)$$이 남는다. 여기에 뿌리의 키 1개를 더해 $$2t^h - 1$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 6단계에서 로그를 씌울 때 부등호가 뒤집히지 않는 까닭은?</summary>

밑 $$t$$가 1보다 크면 로그는 입력이 커질수록 값도 커진다. $$a \le b$$이면 $$\log_t a \le \log_t b$$다. 밑이 1보다 작으면 뒤집히지만 $$t \ge 2$$라 그럴 일이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

높이를 직접 재지 않고, "높이가 $$h$$이려면 키가 적어도 몇 개 있어야 하나"를 센다. 가장 홀쭉한 트리의 키 수가 $$2t^h - 1$$이므로, 키가 $$n$$개뿐이면 $$2t^h - 1 \le n$$을 지키는 높이까지만 될 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

높이 $$h$$인 이진 트리는 노드가 많아야 $$2^{h+1} - 1$$개라는 데서 "노드 $$n$$개면 높이가 적어도 얼마"를 얻는 것과 같은 틀이다([트리](/Hongs_Blog/studies/discrete-math/trees/)). 층마다 개수를 세어 등비급수로 더한 뒤 높이에 대해 푼다.

</details>


## 가장 많이 담을 때

높이 $$h$$인 B-트리가 담을 수 있는 키는 가장 많을 때 $$(2t)^{h+1} - 1$$개다.

모든 노드가 가득 찼다고 하자. 노드마다 키가 $$2t - 1$$개, 자식이 $$2t$$개다. 깊이 0에 노드 1개, 깊이 1에 $$2t$$개, 깊이 $$i$$에 $$(2t)^i$$개가 있다. 노드 수를 모두 더해 노드 하나의 키 수를 곱한다.

$$n = \underbrace{\left(1 + 2t + (2t)^2 + \cdots + (2t)^h\right)}_{\text{노드 수}} \cdot \underbrace{(2t - 1)}_{\text{노드 하나의 키 수}} = \frac{(2t)^{h+1} - 1}{2t - 1}\cdot(2t - 1) = (2t)^{h+1} - 1$$


$$t = 2$$, $$h = 1$$이면 $$4^2 - 1 = 15$$개다. 위의 둘째 그림이 그 트리다.


두 결과를 한 줄에 놓으면 높이 $$h$$인 B-트리의 키 수는 $$2t^h - 1 \le n \le (2t)^{h+1} - 1$$이다. 높이에 대해 풀면 아래쪽 한계도 나온다[^s3].

$$\log_{2t}(n + 1) - 1 \le h \le \log_t \frac{n + 1}{2}$$


## 가정이 하나라도 빠지면

| 가정 | 빠지면 |
|---|---|
| 모든 잎의 깊이가 같다 | 아래 그림처럼 한쪽으로만 내려가는 나무가 된다. $$t = 2$$, 키 7개인데 깊이 3인 잎이 있다. 정리의 한계는 2다 |
| 뿌리가 아닌 노드의 키가 $$t - 1$$개 이상 | $$t = 3$$인데 노드마다 키를 1개씩만 두면 갈래가 2개뿐이다. 키 7개로 높이 2가 되는데, 정리의 한계는 $$\log_3 4 \approx 1.26$$이라 1이다 |
| $$t \ge 2$$ | $$t = 1$$이면 아래 한계가 0개라 빈 노드를 끼워 높이를 마음대로 키울 수 있고, 밑이 1인 로그는 정해지지 않는다 |
| $$n \ge 1$$ | 키가 없는 트리는 빈 잎 하나라 높이가 0인데, 식의 오른쪽은 $$\log_t \frac12$$로 음수다 |

```
     [2]
 +---------+
[1]       [4]
       +-------+
      [3]     [6]
             +---+
            [5] [7]
```

거꾸로, 한계 안의 높이는 실제로 다 나온다. 키가 $$n$$개일 때 $$\log_{2t}(n+1) - 1$$ 이상 $$\log_t\frac{n+1}{2}$$ 이하인 정수마다 그 높이의 B-트리가 있다. $$t = 2, 3, 4$$와 $$n = 1 \sim 40$$에서 모든 모양을 따져 확인한 것이고, 모든 $$t$$와 $$n$$에 대한 증명은 싣지 않았다[^s3].

증명의 5단계를 뒤집어 읽으면 쓸모 있는 문장이 하나 더 나온다. 키가 $$2t^h - 1$$개보다 적은 B-트리는 높이가 $$h$$가 될 수 없다. $$t = 2$$에서 키가 6개뿐이면 높이 2는 안 된다는 식이다.

## 활용

- **디스크 읽기 횟수.** 뿌리가 주기억장치에 있으면 검색 한 번에 디스크를 많아야 $$h$$번 읽는다. 노드마다 키가 1,000개인 트리는 높이 2로 10억 개가 넘는 키를 담으니 2번이면 된다([B-트리](/Hongs_Blog/studies/database-design/b-tree/)의 표).
- **연산 시간의 $$\log_t n$$.** 검색과 삽입의 시간 $$O(t \log_t n)$$에서 $$\log_t n$$이 이 정리에서 온 높이다.
- **이진 탐색 트리와 견주기.** $$\log_t n = \frac{\lg n}{\lg t}$$다. 잘 균형 잡힌 이진 탐색 트리의 높이가 $$\lg n$$쯤이니, B-트리는 그보다 $$\lg t$$배쯤 낮다. $$t = 1024$$면 10배다[^s3]. 숫자로 견준 것은 [B-트리와 이진 탐색 트리 비교](/Hongs_Blog/studies/database-design/b-tree-vs-bst/)에 있다.
- **흔한 실수.** 높이를 층의 수로 센다. 이 정리의 높이는 뿌리에서 잎까지의 간선 수라서 노드 하나짜리 트리가 0이다. 층의 수로 세면 식이 1씩 어긋난다.
- 연습: [B-트리 연습](/Hongs_Blog/studies/database-design/b-tree-practice/)의 p2

## 연결

- 선수: [B-트리](/Hongs_Blog/studies/database-design/b-tree/), [로그](/Hongs_Blog/studies/college-math/logarithm/), [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)
- 높이가 비용을 정하는 연산: [B-트리 검색](/Hongs_Blog/studies/database-design/b-tree-search/), [B-트리 삽입](/Hongs_Blog/studies/database-design/b-tree-insert/)
- 이진 트리의 높이 한계: [트리](/Hongs_Blog/studies/discrete-math/trees/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"키가 $$n$$개면 B-트리의 높이는 $$\log_t \frac{n+1}{2}$$이다"</div>

틀렸다. 이 식은 높이가 넘을 수 없는 한계이지 높이 자체가 아니다. 등호가 아니라 $$\le$$다. 정리가 한 줄로 적혀 있고 흔히 "높이는 $$O(\log_t n)$$"이라고 줄여 말해서 등호로 읽기 쉽다. $$t = 2$$, 키 3개를 보면 식의 값은 $$\log_2 2 = 1$$인데, 높이 0인 `[1 2 3]`도 높이 1인 `[2] / [1] [3]`도 올바른 B-트리다. 또 식의 값은 대개 정수가 아니다. $$t = 3$$, $$n = 1000$$이면 $$\log_3 500.5 \approx 5.66$$이고, 높이는 5 이하라는 뜻이다. 확인하는 법: $$2t^h - 1 \le n$$에 $$h$$를 하나씩 넣어 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** B-트리 높이의 위쪽 한계를 조건과 함께 쓰라. 그 한계에 닿는 트리는 어떤 트리인가?</summary>

**답:** 키가 $$n \ge 1$$개, 최소 차수가 $$t \ge 2$$이면 $$h \le \log_t\frac{n+1}{2}$$. 뿌리는 키 1개, 나머지 노드는 모두 $$t - 1$$개만 가진 트리가 한계에 닿는다. 이때 $$n = 2t^h - 1$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 증명에서 "깊이 $$i$$에는 노드가 $$2t^{i-1}$$개 이상 있다"고 했다. 2와 $$t$$는 각각 B-트리의 어느 성질에서 나오는가? 이 줄에는 "모든 잎의 깊이가 같다"도 쓰인다. 어디에 쓰이는가?</summary>

**답:** 2는 "뿌리는 키가 1개 이상"에서 나온다(자식 2개 이상). $$t$$는 "뿌리가 아닌 노드는 키가 $$t - 1$$개 이상"에서 나온다(내부 노드의 자식 $$t$$개 이상). 잎의 깊이가 같다는 성질은 깊이 $$h$$보다 얕은 곳의 노드가 모두 내부 노드라는 것, 곧 자식이 있다는 것을 보장한다.<br>
**이유:** 잎이 중간 깊이에 있어도 되면 그 밑으로 노드가 늘지 않아 곱하기가 끊긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$t = 3$$이고 키가 1,000개인 B-트리의 높이는 가장 클 때와 가장 작을 때 각각 얼마인가?</summary>

**답:** 가장 클 때 5, 가장 작을 때 3. 위쪽: $$2 \cdot 3^h - 1 \le 1000$$에서 $$3^h \le 500.5$$. $$3^5 = 243$$, $$3^6 = 729$$라 $$h \le 5$$다. 아래쪽: $$6^{h+1} - 1 \ge 1000$$에서 $$6^3 - 1 = 215$$는 모자라고 $$6^4 - 1 = 1295$$는 넉넉하니 $$h \ge 3$$이다.<br>
**이유:** 로그를 계산기 없이 구할 때는 거듭제곱을 차례로 적어 끼워 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "모든 잎의 깊이가 같다"는 성질만 빼고 나머지는 지키는, 정리의 한계보다 깊은 나무를 $$t = 2$$로 하나 만들어라.</summary>

**답:** 뿌리 [2]의 왼쪽 자식이 잎 [1], 오른쪽 자식이 [4]. [4]의 왼쪽 자식이 잎 [3], 오른쪽 자식이 [6]. [6]의 자식이 잎 [5]와 [7]. 키는 7개이고 노드마다 키가 1개라 키 수의 한계는 지킨다. 가장 깊은 잎이 깊이 3인데 정리의 한계는 $$\log_2 4 = 2$$다.<br>
**이유:** 이진 탐색 트리에 1, 2, 3, …을 차례로 넣으면 한 줄로 늘어지는 것과 같은 모양이다. B-트리는 잎의 깊이를 맞추라는 성질로 이것을 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** $$t = 2$$이고 높이가 2인 B-트리에 들어갈 수 있는 키는 몇 개부터 몇 개까지인가?</summary>

**답:** 7개부터 63개까지. 가장 적을 때 $$2t^h - 1 = 2 \cdot 4 - 1 = 7$$, 가장 많을 때 $$(2t)^{h+1} - 1 = 4^3 - 1 = 63$$.

</details>


[^s1]: 두 식 $$2t^h - 1$$과 $$(2t)^{h+1} - 1$$에 $$t = 2$$를 넣은 값이고, 검증 코드가 트리를 직접 만들어 세었다.
[^s2]: 출처는 Cormen 외, *Introduction to Algorithms* 3판, 정리 18.1의 증명이다.
[^s3]: 아래쪽 한계는 가장 많이 담을 때의 식을 $$h$$에 대해 푼 것이다. 수와 반례는 검증 코드로 확인했다.
{% endraw %}
