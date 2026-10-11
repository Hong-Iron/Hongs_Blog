---
layout: "note"
title: "선형 탐사"
display_title: "선형 탐사 (Linear Probing)"
kind: "concept"
kind_label: "자료구조"
num: "49"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Linear Probing", "Linear Open Addressing", "선형 조사", "선형 조사법", "개방 주소법", "Open Addressing", "뭉치", "군집", "Cluster", "적재율", "Loading Density", "Load Factor", "넘침 처리", "Overflow Handling"]
description: "영화관에서 내 표의 자리에 누가 앉아 있으면 바로 옆자리로, 거기도 차 있으면 그 옆으로 가서 처음 나오는 빈자리에 앉는 방식이다. 찾을 때도 표의 자리부터 옆으로 가며 보다가 빈자리가 나오면 \"없다\"고 안다. 표 하나만으로 끝나서 덤 공간이 들지 않는다. 하지만 자리가 찰수록 사…"
prev_url: "/studies/data-structures/hash-function-division/"
prev_title: "나눗셈 해시 함수"
next_url: "/studies/data-structures/hash-chaining/"
next_title: "체이닝"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/linear-probing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

영화관에서 내 표의 자리에 누가 앉아 있으면 바로 옆자리로, 거기도 차 있으면 그 옆으로 가서 처음 나오는 빈자리에 앉는 방식이다. 찾을 때도 표의 자리부터 옆으로 가며 보다가 빈자리가 나오면 "없다"고 안다. 표 하나만으로 끝나서 덤 공간이 들지 않는다. 하지만 자리가 찰수록 사람들이 길게 붙어 앉아 찾는 길이 급하게 길어지고, 누가 나갈 때 그 자리만 비워 두면 뒤에 밀려 앉은 사람을 찾지 못하게 되므로 뒷사람을 당겨 앉혀야 한다.

</div>


## 예시로 보기

[해시 테이블](/Hongs_Blog/studies/data-structures/hash-table-terms/)에서 새 쌍의 홈 버킷이 이미 차 있으면(넘침) 그 쌍을 둘 곳을 정해야 한다. 가장 단순한 답이 "바로 다음 버킷"이다.

버킷이 17개이고 홈 버킷은 키를 17로 나눈 나머지다. 키 6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45를 차례로 넣는다[^1]. 홈 버킷이 차 있으면 오른쪽으로 한 칸씩 가고, 16번 다음은 0번으로 돌아온다[^s1].

| 넣는 키 | 홈 버킷 | 차 있어서 지나친 버킷 | 들어간 버킷 |
|---|---|---|---|
| 6 | 6 | | 6 |
| 12 | 12 | | 12 |
| 34 | 0 | | 0 |
| 29 | 12 | 12 | 13 |
| 28 | 11 | | 11 |
| 11 | 11 | 11, 12, 13 | 14 |
| 23 | 6 | 6 | 7 |
| 7 | 7 | 7 | 8 |
| 0 | 0 | 0 | 1 |
| 33 | 16 | | 16 |
| 30 | 13 | 13, 14 | 15 |
| 45 | 11 | 11, 12, 13, 14, 15, 16, 0, 1 | 2 |

```
버킷:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16
키:   34   0  45   .   .   .   6  23   7   .   .  28  12  29  11  30  33
```

점은 빈 버킷이다. 빈 버킷 없이 이어진 덩어리를 뭉치(cluster)라 부른다. 여기에는 6~8번 뭉치와, 11번에서 시작해 16번을 넘어 2번까지 이어지는 뭉치가 있다. 45는 홈 버킷이 11인데 뭉치 끝인 2번까지 밀려났다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 지우기 세 개(옮겨지는 키의 차례와 끝 상태), 그 칸만 비우는 틀린 지우기의 반례, 무작위 연산 60,000번을 단순한 모형과 비교하며 연산마다 불변식 검사, 가득 찬 표를 컴파일해 실행(ASan·UBSan) — [49_linear-probing_impl.c](/Hongs_Blog/studies/data-structures/code/49_linear-probing_impl/). 이 표에서 찾을 때 보는 버킷 수와 큰 표의 모의실험 — [49_linear-probing_verify.py](/Hongs_Blog/studies/data-structures/code/49_linear-probing_verify/)</div>

</div>


## 정의

넘침을 다루는 길은 두 갈래다[^2].

- 표 안에서 정해진 차례로 다른 버킷을 살펴 자리가 있는 버킷을 찾는다. 선형 탐사(linear probing, linear open addressing), 2차 탐사(quadratic probing), 무작위 탐사(random probing)가 있다.
- 버킷마다 그 버킷이 홈 버킷인 쌍을 모두 목록으로 달아 두어 넘침을 없앤다: [체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/).

선형 탐사는 첫째 갈래에서 살피는 차례가 "한 칸씩 오른쪽"인 것이다. 버킷 수를 $$b$$, 키 $$k$$의 홈 버킷을 $$f(k)$$라 하면 살피는 버킷은

$$f(k),\ (f(k) + 1) \bmod b,\ (f(k) + 2) \bmod b,\ \dots$$


이다. $$\bmod b$$는 $$b$$로 나눈 나머지로, 끝에 닿으면 0번으로 돌아오게 한다([원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)에서 색인을 돌리는 것과 같다).

**하는 일.** 찾기 `lp_find(key)`, 넣기 `lp_insert(key)`, 지우기 `lp_delete(key)` 세 가지다. 키는 서로 다르다.

**늘 지켜야 하는 것(표현 불변식).** 표에 든 모든 키에 대해, 그 키의 홈 버킷에서 그 키가 놓인 버킷까지 오른쪽으로 가는 길에 빈 버킷이 없다. 세 연산이 맞게 돌아가는 것이 모두 이 한 문장에 달려 있다[^s1].

### 찾기와 넣기

```c
typedef struct {
    int b;          /* 버킷 수 */
    int n;          /* 들어 있는 키 수 */
    int *key;       /* key[i]: i번 버킷의 키 */
    char *used;     /* used[i]: i번 버킷이 차 있으면 1 */
} Table;

/* 키가 든 버킷 번호를 돌려준다. 없으면 -1. */
int lp_find(const Table *t, int key)
{
    int home = key % t->b;
    int i = home;
    do {
        if (!t->used[i])
            return -1;                /* 빈 버킷: 이 키는 없다 */
        if (t->key[i] == key)
            return i;
        i = (i + 1) % t->b;
    } while (i != home);              /* 한 바퀴를 다 돌았으면 없다 */
    return -1;
}

/* 넣었으면 1, 이미 있으면 0, 표가 가득 찼으면 -1. */
int lp_insert(Table *t, int key)
{
    int home = key % t->b;
    int i = home;
    do {
        if (!t->used[i]) {            /* 처음 만난 빈 버킷에 넣는다 */
            t->key[i] = key;
            t->used[i] = 1;
            t->n++;
            return 1;
        }
        if (t->key[i] == key)
            return 0;
        i = (i + 1) % t->b;
    } while (i != home);
    return -1;
}
```

찾기가 빈 버킷에서 멈춰도 되는 까닭이 불변식이다. 찾는 키가 표에 있다면 홈 버킷에서 그 키까지 빈 버킷이 없으므로, 빈 버킷을 먼저 만났다면 그 키는 없다.

### 지우기

키를 지우고 그 버킷만 비우면 불변식이 깨진다. 뒤에 밀려나 있던 키의 길 한가운데에 빈 버킷이 생기기 때문이다. 슬라이드는 "뭉치를 훑어, 비워진 버킷을 채울 쌍이 있으면 옮긴다"고 적는다[^3]. 규칙을 풀어 쓰면 이렇다[^s1].

1. 지울 키의 버킷을 비운다. 이 자리를 빈 자리라 하자.
2. 빈 자리의 오른쪽 버킷부터 차례로 본다. 빈 버킷을 만나면 끝낸다.
3. 보고 있는 키의 홈 버킷이 "빈 자리의 다음 칸부터 지금 칸까지" 사이에 있으면 그대로 둔다.
4. 그 사이에 없으면 그 키를 빈 자리로 옮긴다. 이제 그 키가 있던 칸이 새 빈 자리다. 2로 돌아간다.

세 가지 지우기를 모두 처음 표에서 해 본다[^3].

**0을 지운다.** 빈 자리는 1번이다.

| 보는 버킷 | 키 (홈 버킷) | 홈 버킷이 사이에 있는가 | 한 일 |
|---|---|---|---|
| 2 | 45 (11) | 2번 한 칸 사이에 11은 없다 | 1번으로 옮긴다. 빈 자리는 2번 |
| 3 | 빈 버킷 | | 끝 |

```
버킷:  0   1   2   3  ...  11  12  13  14  15  16
키:   34  45   .   .  ...  28  12  29  11  30  33
```

**34를 지운다.** 빈 자리는 0번이다. 1번의 0(홈 0)은 1번 한 칸 사이에 홈이 없으니 0번으로 옮긴다. 2번의 45(홈 11)도 1번으로 옮긴다. 3번이 비어 있어 끝난다. 앞머리가 `0 45 .`이 된다.

**29를 지운다.** 빈 자리는 13번이다.

| 보는 버킷 | 키 (홈 버킷) | 홈 버킷이 사이에 있는가 | 한 일 |
|---|---|---|---|
| 14 | 11 (11) | 14번 사이에 11은 없다 | 13번으로 옮긴다. 빈 자리는 14번 |
| 15 | 30 (13) | 15번 사이에 13은 없다 | 14번으로 옮긴다. 빈 자리는 15번 |
| 16 | 33 (16) | 16번 사이에 16이 있다 | 그대로 둔다 |
| 0 | 34 (0) | 16, 0번 사이에 0이 있다 | 그대로 둔다 |
| 1 | 0 (0) | 16, 0, 1번 사이에 0이 있다 | 그대로 둔다 |
| 2 | 45 (11) | 16, 0, 1, 2번 사이에 11은 없다 | 15번으로 옮긴다. 빈 자리는 2번 |
| 3 | 빈 버킷 | | 끝 |

```
버킷:  0   1   2   3  ...  11  12  13  14  15  16
키:   34   0   .   .  ...  28  12  11  30  45  33
```

33, 34, 0을 옮기지 않는 까닭을 33으로 보자. 33의 홈 버킷은 16번이다. 33을 15번으로 옮기면 자기 홈 버킷보다 앞에 놓인다. 찾기는 16번에서 시작해 오른쪽으로만 가므로 15번을 영영 보지 못한다.

```c
/* 지웠으면 1, 없으면 0. */
int lp_delete(Table *t, int key)
{
    int hole = lp_find(t, key);
    if (hole < 0)
        return 0;
    t->used[hole] = 0;
    t->n--;
    int j = hole;
    for (;;) {
        j = (j + 1) % t->b;
        if (!t->used[j])
            break;                    /* 뭉치가 끝났다 */
        int home = t->key[j] % t->b;
        /* 홈 버킷이 (hole, j] 사이(원형)에 있는가 */
        int between = (hole < j) ? (hole < home && home <= j)
                                 : (home > hole || home <= j);
        if (!between) {
            t->key[hole] = t->key[j];     /* 빈 자리로 당겨 온다 */
            t->used[hole] = 1;
            t->used[j] = 0;
            hole = j;
        }
    }
    return 1;
}
```

`between`의 둘째 줄은 구간이 16번을 넘어 0번으로 이어질 때다. 그때 "사이"는 `hole`보다 큰 번호들과 `j` 이하의 번호들을 합친 것이다.

### 정확성

**주장.** 넣기와 지우기는 표현 불변식을 깨지 않는다. 그래서 찾기는 표에 있는 키를 반드시 찾고, 없는 키에는 반드시 "없다"고 답한다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

불변식: 표에 든 모든 키에 대해, 홈 버킷에서 그 키의 버킷까지 오른쪽으로 가는 길에 빈 버킷이 없다. 이 길을 그 키의 "길"이라 부르자.
1. **찾기.** 키가 표에 있으면 찾기는 그 키의 길을 그대로 따라간다. 길에 빈 버킷이 없으므로 멈추지 않고 그 키에 닿는다. 키가 없으면 빈 버킷을 만나거나 한 바퀴를 돌아 −1을 돌려준다. — 불변식
2. **넣기.** 새 키는 홈 버킷에서 출발해 처음 만난 빈 버킷에 들어간다. 지나온 버킷은 모두 차 있었으므로 새 키의 길에 빈 버킷이 없다. 다른 키들의 길은 바뀌지 않았고, 빈 버킷은 하나 줄었을 뿐이다. — 코드의 `do` 고리
3. **지우기에서 빈 자리가 생긴 직후.** 불변식을 어길 수 있는 키는 길이 빈 자리를 지나는 키뿐이다. 그런 키는 빈 자리의 오른쪽으로 이어진 뭉치 안에 있다. 뭉치 밖의 키는 길이 빈 버킷을 건너야 빈 자리에 닿는데, 길에는 빈 버킷이 없었다. — 불변식
4. **그대로 두는 경우.** `j`번 버킷의 키의 홈 버킷이 빈 자리의 다음 칸부터 `j`번까지 사이에 있으면, 그 키의 길은 빈 자리보다 뒤에서 시작한다. 길이 빈 자리를 지나지 않으니 불변식이 그대로 맞다. — 길의 정의
5. **옮기는 경우.** 홈 버킷이 그 사이에 없으면 길이 빈 자리를 지난다. 그 키를 빈 자리로 옮기면 새 길은 원래 길의 앞부분(홈 버킷에서 빈 자리까지)이다. 그 구간은 원래 모두 차 있었다. 훑는 동안 비어 있는 칸은 지금의 빈 자리 하나뿐이다(앞서 생긴 빈 자리는 옮겨 온 키가 채웠다). 그래서 홈 버킷에서 빈 자리 바로 앞까지는 여전히 모두 차 있다. 새 빈 자리는 `j`번이 된다. 이미 본 키들의 길은 `j`번에 닿기 전에 끝나므로 새 빈 자리와 상관없다. — 3, 4
6. **끝.** 빈 버킷을 만나면 3에 따라 더 볼 키가 없다. 표에는 빈 자리가 적어도 하나 있으므로 `j`는 언젠가 빈 버킷에 닿는다. 표가 가득 차 있었다면 한 바퀴를 돌아 빈 자리 자신에서 멈춘다. ∎ — 빈 버킷의 존재

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 찾기가 빈 버킷을 만나면 바로 "없다"고 해도 되는 근거는 증명의 어느 줄인가?</summary>

1번 줄, 곧 불변식이다. 표에 있는 키라면 홈 버킷에서 그 키까지 빈 버킷이 없다. 빈 버킷을 먼저 만났다면 그 키는 표에 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 지우기 4단계에서 "길이 빈 자리보다 뒤에서 시작한다"는 말은 무엇에서 나오는가?</summary>

길은 홈 버킷에서 시작한다. 홈 버킷이 빈 자리의 다음 칸부터 지금 칸까지 사이에 있다는 것이 바로 "빈 자리보다 뒤에서 시작해 지금 칸에서 끝난다"는 뜻이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 29를 지울 때 2번 버킷의 45는 왜 16번, 0번, 1번의 키들을 건너뛰어 15번으로 가도 되는가?</summary>

45의 홈 버킷은 11번이고 길은 11번에서 2번까지다. 15번은 그 길 위에 있다. 15번으로 옮겨도 홈 버킷 11번에서 15번까지는 모두 차 있으므로 찾기가 닿는다. 건너뛴 33, 34, 0은 길이 15번을 지나지 않아 상관없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. 지우기가 뭉치 끝의 빈 버킷에서 멈춰도 되는 까닭은?</summary>

빈 버킷 너머에 있는 키의 길이 지워서 생긴 빈 자리를 지나려면 그 빈 버킷도 지나야 한다. 길에는 빈 버킷이 없으므로 그런 키는 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

"홈 버킷에서 자기 자리까지 빈 버킷이 없다"는 한 문장을 세 연산이 모두 지키게 하는 것이다. 지우기는 그 문장을 어기게 된 키만 골라 한 칸씩 당겨서 다시 맞춘다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

자료를 지운 뒤에도 "찾는 길"이 끊기지 않아야 하는 구조 어디에나 같은 생각을 쓴다. 지운 자리에 "지워짐" 표시만 남겨 길을 이어 두는 방법도 있다. 그 방법은 지우기가 간단한 대신 표시가 쌓이면 찾는 길이 줄지 않는다[^s1].

</details>


### 성능

가장 나쁠 때 찾기, 넣기, 지우기는 $$\Theta(n)$$이다. $$n$$은 표에 든 쌍의 수이고, 모든 쌍이 한 뭉치에 들어 있을 때 그렇게 된다[^4].

평균은 표가 얼마나 찼느냐로 정해진다. 쌍의 수를 버킷 수로 나눈 값을 **적재율**(loading density) $$\alpha$$라 한다. 위 표는 $$\alpha = \frac{12}{17}$$이다. 열일곱 칸 가운데 열두 칸이 찼다는 뜻이다. 선형 탐사에서는 $$0 \le \alpha \le 1$$이다[^5].

- $$S_n$$: 표에 **있는** 키를 찾을 때 보는 버킷 수의 기댓값($$n$$이 클 때)
- $$U_n$$: 표에 **없는** 키를 찾을 때 보는 버킷 수의 기댓값($$n$$이 클 때)

넣기와 지우기의 시간은 $$U_n$$ 쪽을 따른다[^5]. 넣기도 지우기도 뭉치의 끝까지 가야 하기 때문이다.

$$S_n \approx \frac12\left(1 + \frac{1}{1 - \alpha}\right), \qquad U_n \approx \frac12\left(1 + \frac{1}{(1 - \alpha)^2}\right)$$


$$1 - \alpha$$는 비어 있는 버킷의 비율이다. 빈 버킷이 드물수록 분모가 작아져 값이 커지고, $$U_n$$은 그 제곱으로 커진다. [증명 생략: 슬라이드 p.27은 식만 싣는다][^6].

| $$\alpha$$ | $$S_n$$ | $$U_n$$ |
|---|---|---|
| 0.50 | 1.5 | 2.5 |
| 0.75 | 2.5 | 8.5 |
| 0.90 | 5.5 | 50.5 |

그래서 $$\alpha \le 0.75$$로 두라고 권한다[^6]. 0.75에서 0.9로 가면 표는 15%p 더 찰 뿐인데 없는 키를 찾는 수고는 여섯 배가 된다.

위 표(키 12개)에서 직접 세면, 있는 키를 찾을 때 보는 버킷 수의 합이 29라 평균 2.42이고, 없는 키는 홈 버킷 열일곱 곳에 대한 평균이 4다. 식에 $$\alpha = \frac{12}{17}$$을 넣은 값은 2.2와 6.28이다. 식은 $$n$$이 클 때의 어림이라 작은 표에서는 어긋난다. 버킷 20,011개짜리 표로 실험하면 $$\alpha = 0.5$$에서 1.51과 2.51, 0.75에서 2.47과 8.33, 0.9에서 5.40과 47.8이 나와 식과 가깝다(실험으로 확인한 값이다)[^s1].

## 활용

- 구현: [49_linear-probing_impl.c](/Hongs_Blog/studies/data-structures/code/49_linear-probing_impl/). 연습: [선형 탐사 삽입·삭제 예제 사다리](/Hongs_Blog/studies/data-structures/linear-probing-ladder/)

| 연산 | 가장 나쁠 때 | 기댓값 |
|---|---|---|
| 있는 키 찾기 | $$\Theta(n)$$ | 버킷 $$S_n$$개 |
| 없는 키 찾기, 넣기, 지우기 | $$\Theta(n)$$ | 버킷 $$U_n$$개쯤 |

- 표 하나로 끝나므로 노드와 포인터를 위한 덤 공간이 없다. 대신 표가 찰수록 급하게 느려지고, 버킷 수보다 많은 쌍은 담지 못한다. 체이닝과의 맞바꿈은 [선형 탐사와 체이닝 비교](/Hongs_Blog/studies/data-structures/probing-vs-chaining/)에 있다.
- 적재율이 정한 선을 넘으면 표를 두 배쯤으로 늘려 모두 다시 넣는다: [적재율로 해시 테이블 크기 정하기](/Hongs_Blog/studies/data-structures/load-factor-design/).
- 흔한 실수: 찾기를 "홈 버킷부터 표 끝까지"만 하고 0번으로 돌아오지 않는 것. 45처럼 끝을 넘어간 키를 못 찾는다.

## 연결

- 선수: [해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/), [나눗셈 해시 함수](/Hongs_Blog/studies/data-structures/hash-function-division/), [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)(나머지로 색인을 돌리기)
- 넘침을 없애는 다른 갈래: [체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/)
- "빈칸을 만날 때까지 보는 칸 수"를 확률로 따지기: [해싱과 무작위 알고리즘의 확률](/Hongs_Blog/studies/probability-statistics/randomized-analysis/)
- 파이썬의 `dict`도 표 안에서 빈칸을 찾아 넣는 쪽이다: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"지울 때는 그 버킷만 비우면 된다"</div>

틀렸다. 배열에서 값을 지울 때처럼 그 칸만 손대면 될 것 같고, 지운 직후에는 표도 멀쩡해 보인다. 하지만 선형 탐사에서 빈 버킷은 "여기서부터는 없다"는 신호다. 처음 표에서 34의 0번 버킷만 비우면, 0을 찾을 때 홈 버킷 0번이 비어 있어 바로 "없다"고 답한다. 0은 1번 버킷에 그대로 있는데도 그렇다. 45도 같은 이유로 못 찾는다. 확인하려면 지운 뒤 남은 키를 하나씩 찾아본다. 올바른 지우기는 0을 0번으로, 45를 1번으로 당겨 온다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 처음 표(키 12개)에서 12를 지운다. 옮겨지는 키를 차례로 쓰고, 끝난 뒤 11번부터 16번까지와 0번부터 2번까지의 버킷을 쓰라.</summary>

**답:** 29, 11, 30, 45의 차례로 옮긴다. 11~16번은 28, 29, 11, 30, 45, 33이고 0~2번은 34, 0, 빈 버킷이다.<br>
**이유:** 빈 자리 12번에 29(홈 12)가 오고, 13번에 11(홈 11), 14번에 30(홈 13)이 온다. 빈 자리가 15번일 때 33(홈 16), 34(홈 0), 0(홈 0)은 홈 버킷이 빈 자리 뒤에 있어 그대로 두고, 45(홈 11)를 15번으로 옮긴다. 흔한 오답은 33을 15번으로 당기는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `lp_delete`의 `for` 고리가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 빈 자리의 오른쪽 뭉치를 끝까지 훑으면서, 빈 자리 때문에 찾는 길이 끊긴 키를 빈 자리로 당겨 오고 그 키가 있던 칸을 새 빈 자리로 삼는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "지울 때 그 버킷만 비운다"가 틀렸다는 것을 보이는 예를 처음 표에서 하나 들어라.</summary>

**답:** 34의 버킷(0번)만 비운 뒤 0을 찾는다. 0의 홈 버킷 0번이 비어 있어 "없다"가 나오지만 0은 1번에 있다.<br>
**이유:** 0은 넣을 때 0번이 차 있어서 1번으로 밀려난 키다. 그 길의 첫 칸이 비면 찾기가 거기서 멈춘다. 29의 버킷(13번)만 비우고 11이나 30을 찾아도 같은 일이 생긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 처음 표에서 45를 찾을 때 보는 버킷을 차례로 쓰고 개수를 세라. 이 표에 없는 키 62(홈 버킷 11)를 찾으면 몇 개를 보는가?</summary>

**답:** 45는 11, 12, 13, 14, 15, 16, 0, 1, 2의 9개. 62는 같은 길을 가서 3번의 빈 버킷까지 10개를 본다.<br>
**이유:** 찾기는 홈 버킷에서 시작해 키를 찾거나 빈 버킷을 만날 때까지 간다. 없는 키는 뭉치의 끝까지 가야 "없다"를 안다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** $$\alpha = 0.8$$일 때 $$S_n$$과 $$U_n$$을 구하라. 넣기와 지우기의 시간이 $$S_n$$이 아니라 $$U_n$$을 따르는 까닭은?</summary>

**답:** $$S_n = \frac12(1 + 5) = 3$$, $$U_n = \frac12(1 + 25) = 13$$.<br>
**이유:** $$1 - \alpha = 0.2$$라 $$\frac{1}{1 - \alpha} = 5$$다. 넣기는 빈 버킷이 나올 때까지 가야 하고, 지우기는 뭉치의 끝까지 훑어야 한다. 둘 다 "없는 키를 찾을 때"처럼 뭉치 끝의 빈 버킷까지 가는 일이다.

</details>


[^1]: 자료구조 15회 강의 자료 「DS_Week15_Lecture_2024」, p.21 (Linear Probing – Get And Insert: $$b = 17$$, 키 열두 개가 들어간 표)
[^2]: 같은 자료, p.20 (Overflow Handling)
[^3]: 같은 자료, p.22~24 (Linear Probing – Delete: Delete(0), Delete(34), Delete(29)의 그림. "Search cluster for pair (if any) to fill vacated bucket.")
[^4]: 같은 자료, p.25 (Performance Of Linear Probing)
[^5]: 같은 자료, p.26 (Expected Performance: $$\alpha$$, $$S_n$$, $$U_n$$의 뜻, "Time to put and remove governed by $$U_n$$")
[^6]: 같은 자료, p.27 (두 식, 표, "$$\alpha \le 0.75$$ is recommended")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드에는 그림과 한 줄 설명만 있고 코드가 없다. 넣기 추적 표, 뭉치의 범위, 표현 불변식, 세 연산의 C 코드, 지우기 규칙을 네 걸음으로 푼 것, "사이에 있는가" 표, 증명, 스스로 설명해 보기, 이 표에서 직접 센 평균과 큰 표의 실험 값, 지워짐 표시를 남기는 방법, 연산 표, 오해 항목, 카드 C1~C5는 그림에 맞춰 보탰다. 두 식은 Knuth, *The Art of Computer Programming* 3권 6.4절에 유도가 있다. 지우기 규칙은 같은 절의 알고리즘 R과 같은 생각이다. 수치는 위 두 코드로 확인했다.
{% endraw %}
