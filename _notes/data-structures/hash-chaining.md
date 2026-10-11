---
layout: "note"
title: "체이닝"
display_title: "체이닝 (Chaining)"
kind: "concept"
kind_label: "자료구조"
num: "50"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Chaining", "Separate Chaining", "체인법", "분리 연결법", "정렬된 체인", "Sorted Chain", "동의어 목록", "Linear List Of Synonyms"]
description: "우편함 칸이 차 있을 때 다른 칸을 찾아가는 대신, 칸마다 고리를 달아 그 칸으로 온 우편물을 모두 한 줄로 엮어 두는 방식이다. 다른 칸의 우편물과 섞이지 않아서 우편함이 가득 차도 갑자기 느려지지 않고, 칸 수보다 많은 우편물도 담을 수 있다. 꺼낼 때도 줄에서 그 하나만 떼면…"
prev_url: "/studies/data-structures/linear-probing/"
prev_title: "선형 탐사"
next_url: "/studies/data-structures/probing-vs-chaining/"
next_title: "선형 탐사와 체이닝 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/hash-chaining/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

우편함 칸이 차 있을 때 다른 칸을 찾아가는 대신, 칸마다 고리를 달아 그 칸으로 온 우편물을 모두 한 줄로 엮어 두는 방식이다. 다른 칸의 우편물과 섞이지 않아서 우편함이 가득 차도 갑자기 느려지지 않고, 칸 수보다 많은 우편물도 담을 수 있다. 꺼낼 때도 줄에서 그 하나만 떼면 된다. 대신 우편물마다 다음 것을 잇는 끈이 하나씩 더 들고, 한 칸에 몰리면 그 줄을 앞에서부터 다 따라가야 한다.

</div>


## 예시로 보기

[선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/)에서는 넘친 쌍이 남의 홈 버킷을 차지한다. 그래서 뭉치가 자라고, 지울 때 뒤의 키를 당겨 와야 했다. 넘친 쌍을 표 밖에 따로 달아 두면 이런 일이 없다.

같은 키 6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45를 버킷 17개에 넣는다. 홈 버킷은 키를 17로 나눈 나머지다. 버킷마다 그 버킷이 홈 버킷인 키를 작은 것부터 이어 단다[^1].

```
[0]  → 0 → 34
[6]  → 6 → 23
[7]  → 7
[11] → 11 → 28 → 45
[12] → 12 → 29
[13] → 30
[16] → 33
나머지 버킷 [1]~[5], [8]~[10], [14], [15]는 비어 있다
```

선형 탐사에서 45를 찾으려면 버킷 9개를 봐야 했다. 여기서는 11번 버킷의 줄에서 세 번째다. 12번 버킷의 줄에는 홈 버킷이 12인 키만 있어서, 11번에서 넘친 키가 끼어들지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 체인, 거꾸로 넣어도 같은 체인, 찾을 때 본 노드 수, 무작위 연산 60,000번을 단순한 모형과 비교, 잡은 노드를 모두 풀어 줌을 컴파일해 실행(ASan·UBSan) — [50_hash-chaining_impl.c](/Hongs_Blog/studies/data-structures/code/50_hash-chaining_impl/). 찾을 때 보는 노드 수의 모의실험(적재율 0.5, 1, 3) — [50_hash-chaining_verify.py](/Hongs_Blog/studies/data-structures/code/50_hash-chaining_verify/)</div>

</div>


## 정의

버킷마다 그 버킷이 홈 버킷인 쌍을 모두 담은 목록을 둔다. 목록은 키 순으로 정렬해 둘 수도 있고 아닐 수도 있다. 목록은 배열로 만들 수도 있고 체인([단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/))으로 만들 수도 있다[^2]. 체인으로 만든 것을 체이닝이라 부르고, 슬라이드의 예는 정렬된 체인이다[^1].

표는 포인터의 배열이다. `bucket[i]`는 $$i$$번 버킷에 달린 체인의 첫 노드를 가리키고, 체인이 비어 있으면 `NULL`이다.

**하는 일.** 찾기, 넣기, 지우기 세 가지다. 키는 서로 다르다.

**늘 지켜야 하는 것.** $$i$$번 체인에 든 키는 모두 홈 버킷이 $$i$$다. 정렬된 체인이라면 앞에서 뒤로 갈수록 키가 커진다[^s1].

```c
typedef struct node {
    int key;
    struct node *link;      /* 같은 버킷의 다음 노드. 없으면 NULL */
} Node;

typedef struct {
    int b;                  /* 버킷 수 */
    int n;                  /* 들어 있는 키 수 */
    Node **bucket;          /* bucket[i]: i번 체인의 첫 노드 */
} ChainTable;

/* 있으면 1, 없으면 0. */
int chain_find(const ChainTable *t, int key)
{
    for (const Node *p = t->bucket[key % t->b]; p != NULL; p = p->link) {
        if (p->key == key)
            return 1;
        if (p->key > key)
            return 0;       /* 정렬된 체인: 더 큰 키가 나왔으니 뒤에는 없다 */
    }
    return 0;
}

/* 넣었으면 1, 이미 있으면 0, 메모리를 못 잡았으면 -1. */
int chain_insert(ChainTable *t, int key)
{
    Node **pp = &t->bucket[key % t->b];     /* 고쳐 쓸 칸을 가리킨다 */
    while (*pp != NULL && (*pp)->key < key)
        pp = &(*pp)->link;
    if (*pp != NULL && (*pp)->key == key)
        return 0;
    Node *fresh = malloc(sizeof(Node));
    if (fresh == NULL)
        return -1;
    fresh->key = key;
    fresh->link = *pp;      /* 새 노드가 뒤 노드를 먼저 가리키고 */
    *pp = fresh;            /* 앞 칸이 새 노드를 가리킨다 */
    t->n++;
    return 1;
}

/* 지웠으면 1, 없으면 0. */
int chain_delete(ChainTable *t, int key)
{
    Node **pp = &t->bucket[key % t->b];
    while (*pp != NULL && (*pp)->key < key)
        pp = &(*pp)->link;
    if (*pp == NULL || (*pp)->key != key)
        return 0;
    Node *gone = *pp;
    *pp = gone->link;       /* 앞 칸이 지울 노드를 건너뛰게 한 뒤 */
    free(gone);             /* 풀어 준다 */
    t->n--;
    return 1;
}
```

`pp`는 "노드를 가리키는 포인터가 들어 있는 칸"을 가리킨다([이중 포인터](/Hongs_Blog/studies/data-structures/c-pointer/)). 처음에는 버킷 칸 자체를, 그 뒤로는 앞 노드의 `link` 칸을 가리킨다. 그래서 맨 앞에 넣는 경우와 가운데에 넣는 경우를 따로 쓰지 않아도 된다. 지우기가 선형 탐사와 달리 한 노드만 건드리고 끝나는 것도 눈여겨본다[^s1].

### 성능

적재율 $$\alpha$$는 쌍의 수를 버킷 수로 나눈 값이다. 체이닝에서는 버킷 하나에 여러 쌍을 달 수 있으므로 $$\alpha$$가 1을 넘어도 된다($$\alpha \ge 0$$). 체인 하나의 길이는 평균 $$\alpha$$다[^3]. 쌍 $$n$$개를 버킷 $$b$$개에 나눠 달았으니 한 줄에 평균 $$\frac nb$$개라는 말이다. 위 예는 $$\frac{12}{17}$$이다.

슬라이드의 식은 이렇다[^3]. 세는 것은 체인에서 들여다본 노드의 수다.

$$S_n \approx 1 + \frac{\alpha}{2}, \qquad U_n \approx \alpha$$


$$S_n$$은 있는 키를 찾을 때, $$U_n$$은 없는 키를 찾을 때의 기댓값이다. $$S_n$$을 말로 풀면 "찾는 노드 자신 1개에, 같은 줄에서 그 앞에 놓인 노드 수를 더한 것"이다. 같은 줄에 온 다른 키는 평균 $$\alpha$$개쯤이고, 그 가운데 절반쯤이 앞에 있다[^s1]. 위 예에서 직접 세면 열두 키의 합이 18이라 평균 1.5이고, 식의 값은 $$1 + \frac{6}{17} \approx 1.35$$다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "$$U_n \sim \alpha$$" (p.32, 바로 앞 쪽의 제목은 Sorted Chains) / 문제점: $$\alpha$$는 체인을 끝까지 훑을 때 보는 노드 수(체인 길이의 평균)다. 정렬된 체인에서 찾는 키보다 큰 노드를 만나면 멈추는 것으로 세면 그보다 적다 / 수정안: $$U_n \approx \alpha$$는 정렬하지 않은 체인, 또는 끝까지 훑는 경우의 값으로 읽는다. 정렬된 체인에서 일찍 멈추면 $$\alpha$$가 클 때 절반 남짓이다 / 근거: 모의실험에서 $$\alpha = 3$$일 때 끝까지 훑으면 3.00개, 일찍 멈추면 2.18개였다. $$\alpha = 0.5$$에서는 0.50개와 0.46개로 거의 같다. 교재의 정확한 식은 자료에 없다 [확인필요]

</div>


| $$\alpha$$ | 있는 키: 잰 값 (식 $$1 + \frac\alpha2$$) | 없는 키, 끝까지: 잰 값 (식 $$\alpha$$) | 없는 키, 정렬된 체인에서 일찍 멈춤 |
|---|---|---|---|
| 0.5 | 1.25 (1.25) | 0.50 (0.50) | 0.46 |
| 1 | 1.49 (1.50) | 1.00 (1.00) | 0.87 |
| 3 | 2.50 (2.50) | 3.00 (3.00) | 2.18 |

버킷 2,003개에 무작위 키를 넣어 잰 값이다(실험으로 확인한 값이고 증명이 아니다)[^s1].

가장 나쁠 때는 모든 키가 한 버킷에 몰려 체인 하나가 $$n$$개가 되는 경우이고, 그때 세 연산은 $$\Theta(n)$$이다[^s1].

| 연산 | 가장 나쁠 때 | 기댓값(본 노드 수) |
|---|---|---|
| 있는 키 찾기, 지우기 | $$\Theta(n)$$ | $$1 + \frac\alpha2$$쯤 |
| 없는 키 찾기, 넣기 | $$\Theta(n)$$ | $$\alpha$$ 이하 |

## 활용

- 구현: [50_hash-chaining_impl.c](/Hongs_Blog/studies/data-structures/code/50_hash-chaining_impl/). 연습: [선형 탐사 삽입·삭제 예제 사다리](/Hongs_Blog/studies/data-structures/linear-probing-ladder/)의 문제 4
- 노드마다 포인터 하나만큼의 공간이 더 들고, 노드를 `malloc`으로 잡고 `free`로 풀어야 한다. 그 값으로 "가득 차도 무너지지 않는 표"와 "간단한 지우기"를 얻는다. 어느 쪽을 고를지는 [선형 탐사와 체이닝 비교](/Hongs_Blog/studies/data-structures/probing-vs-chaining/)에 있다.
- 흔한 실수: 넣을 때 `*pp = fresh`를 먼저 하고 `fresh->link`를 나중에 채우는 것. 뒤 노드로 가는 길을 잃는다. 지울 때 `free(gone)`을 먼저 하고 `gone->link`를 읽는 것도 같은 종류의 실수다.

## 연결

- 선수: [해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/), [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)(노드 끼우기와 떼기의 순서)
- 넘침을 표 안에서 푸는 갈래: [선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/)
- 체인 길이의 평균이 $$\alpha$$인 까닭을 확률로 따지기: [해싱과 무작위 알고리즘의 확률](/Hongs_Blog/studies/probability-statistics/randomized-analysis/)
- 칸에 매다는 방식을 파이썬으로 짠 것: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 위 표에서 28을 지우고 62를 넣는다($$62 = 17 \times 3 + 11$$). 11번 버킷의 체인을 쓰라. 그 뒤 없는 키 28을 찾으면 노드를 몇 개 보는가?</summary>

**답:** 11 → 45 → 62. 28을 찾으면 11과 45, 두 개를 보고 멈춘다.<br>
**이유:** 28을 지우면 11의 `link`가 45를 가리킨다. 62는 45보다 커서 맨 뒤에 달린다. 28을 찾을 때 45가 28보다 크므로 그 뒤의 62는 보지 않는다. 정렬하지 않은 체인이라면 세 개를 다 봐야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 선형 탐사는 $$\alpha$$가 1을 넘을 수 없는데 체이닝은 넘어도 되는 까닭은? $$\alpha = 3$$이면 체인 하나의 길이는 평균 얼마인가?</summary>

**답:** 선형 탐사는 쌍을 버킷 안에 직접 두므로 버킷 수보다 많은 쌍을 담을 수 없다. 체이닝은 쌍을 버킷에 매단 노드에 두므로 노드를 얼마든지 더 달 수 있다. $$\alpha = 3$$이면 체인 길이는 평균 3이다.<br>
**이유:** $$\alpha$$는 쌍의 수를 버킷 수로 나눈 값이고, 체이닝에서는 그것이 곧 한 줄에 달린 노드 수의 평균이다. 다만 $$\alpha$$가 커지면 줄이 길어져 찾는 수고도 $$\alpha$$에 비례해 는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 쌍 500개를 버킷 250개짜리 체이닝 표에 넣었다. 적재율과, 있는 키를 찾을 때 보는 노드 수의 기댓값(슬라이드의 식)을 구하라.</summary>

**답:** $$\alpha = \frac{500}{250} = 2$$, $$S_n \approx 1 + \frac22 = 2$$.<br>
**이유:** 찾는 노드 자신 1개에, 같은 줄에서 그 앞에 놓인 노드가 평균 $$\frac\alpha2 = 1$$개다.

</details>


[^1]: 자료구조 15회 강의 자료 「DS_Week15_Lecture_2024」, p.31 (Sorted Chains: 키 열두 개, 홈 버킷 = key % 17, 버킷마다 달린 체인 그림)
[^2]: 같은 자료, p.30 (Linear List Of Synonyms)
[^3]: 같은 자료, p.32 (Expected Performance: $$\alpha \ge 0$$, "Expected chain length is $$\alpha$$", $$S_n \sim 1 + \alpha/2$$, $$U_n \sim \alpha$$)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드에는 그림과 식만 있고 코드가 없다. C 코드, 불변식, `pp`의 설명, $$S_n$$을 말로 푼 것, 이 표에서 직접 센 평균 1.5, 잰 값의 표, 가장 나쁜 경우, 연산 표, 카드 C1~C3은 그림에 맞춰 보탰다. 있는 키를 찾을 때의 기댓값은 키가 버킷에 고르게 흩어진다고 볼 때 정확히 $$1 + \frac{n - 1}{2b}$$이고(Cormen 외, *Introduction to Algorithms* 3판 정리 11.2의 계산과 같다), 모의실험 값과 2% 안에서 맞았다. 정렬된 체인에서 일찍 멈출 때의 값은 모의실험으로만 확인했다. 수치는 위 두 코드로 확인했다.
{% endraw %}
