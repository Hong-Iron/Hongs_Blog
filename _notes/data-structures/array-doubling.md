---
layout: "note"
title: "배열 두 배 늘리기"
display_title: "배열 두 배 늘리기 (Array Doubling)"
kind: "concept"
kind_label: "기법"
num: "08"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Array Doubling", "배열 더블링", "동적 배열", "Dynamic Array", "용량", "Capacity", "분할상환 분석", "Amortized Analysis", "재할당", "StackFull", "REALLOC"]
description: "방이 꽉 차면 두 배 넓은 방으로 이사하는 방식이다. 이사는 짐이 많을수록 오래 걸리지만, 방이 커질수록 다음 이사까지 넣을 수 있는 짐도 많아져서 이사가 점점 드물어진다. 그래서 처음부터 끝까지의 수고를 합쳐 짐의 수로 나누면, 짐 하나에 드는 수고는 짐이 아무리 많아져도 일정하…"
prev_url: "/studies/data-structures/abstract-data-type/"
prev_title: "추상 자료형"
next_url: "/studies/data-structures/row-major-mapping/"
next_title: "행 우선 배치와 열 우선 배치"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-structures/array-doubling/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

방이 꽉 차면 두 배 넓은 방으로 이사하는 방식이다. 이사는 짐이 많을수록 오래 걸리지만, 방이 커질수록 다음 이사까지 넣을 수 있는 짐도 많아져서 이사가 점점 드물어진다. 그래서 처음부터 끝까지의 수고를 합쳐 짐의 수로 나누면, 짐 하나에 드는 수고는 짐이 아무리 많아져도 일정하다. 단, 두 배처럼 비율로 늘릴 때만 그렇고 한 칸씩 늘리면 넣을 때마다 이사해야 하며, 가끔 한 번이 아주 오래 걸리는 것은 두 배로 늘려도 그대로다.

</div>


## 예시로 보기

배열은 만들 때 칸 수를 정해야 한다. 그런데 원소가 몇 개 들어올지 미리 모를 때가 많다. 칸 수를 코드에 못 박아 두면, 꽉 찼을 때 할 수 있는 일은 오류를 내고 끝내는 것뿐이다.

다른 길이 있다. 칸 수를 변수 `capacity`에 넣어 두고 1로 시작한다. 꽉 차면 [realloc](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)으로 용량을 두 배로 늘린다. 이것이 배열 두 배 늘리기다[^1].

늘릴 때는 이미 든 원소를 새 자리로 옮겨 담아야 한다. 용량 1에서 시작해 아홉 번 넣는 동안 옮겨 담은 수를 센다[^s1].

| 넣는 순서 | 넣기 전 용량 | 꽉 찼는가 | 옮겨 담은 수 | 넣은 뒤 용량 |
|---|---|---|---|---|
| 1 | 1 | 아니다 | 0 | 1 |
| 2 | 1 | 꽉 찼다 | 1 | 2 |
| 3 | 2 | 꽉 찼다 | 2 | 4 |
| 4 | 4 | 아니다 | 0 | 4 |
| 5 | 4 | 꽉 찼다 | 4 | 8 |
| 6, 7, 8 | 8 | 아니다 | 0 | 8 |
| 9 | 8 | 꽉 찼다 | 8 | 16 |

아홉 번째 넣기는 여덟 개를 옮겨야 해서 비싸다. 그래도 아홉 번을 통틀어 옮긴 수는 $$1 + 2 + 4 + 8 = 15$$로, 넣은 횟수의 두 배인 18보다 작다. 비싼 넣기 다음에는 싼 넣기가 그만큼 길게 이어지기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표와 아래 코드를 실제 `realloc`으로 돌려 10만 번 넣는 내내 "옮긴 수 < 2 × 넣은 횟수"인 것, 한 칸씩·열 칸씩 늘릴 때의 옮긴 수, 카드 C1을 C로 컴파일해 실행(ASan·UBSan)해 확인했다 — [08_array-doubling_impl.c](/Hongs_Blog/studies/data-structures/code/08_array-doubling_impl/). 넣은 횟수 1~100,000 모두에서 아래 식들이 맞는 것은 횟수만 세는 파이썬 코드로 확인했다 — [08_array-doubling_verify.py](/Hongs_Blog/studies/data-structures/code/08_array-doubling_verify/)</div>

</div>


## 코드

스택에 쓴 모습이다. 배열의 주소, 지금 용량, 맨 위 원소의 칸 번호를 한 구조체에 묶는다[^2].

```c
typedef struct {
    int *data;       /* 원소가 든 배열 */
    int capacity;    /* 지금 배열의 칸 수 */
    int top;         /* 맨 위 원소의 칸 번호. 비었으면 -1 */
} Stack;

/* 가득 찼을 때 부른다: 용량을 두 배로 늘린다 */
void stack_full(Stack *s)
{
    int *bigger = realloc(s->data, (size_t)(2 * s->capacity) * sizeof *s->data);

    if (bigger == NULL) {            /* 실패하면 옛 배열은 그대로 남아 있다 */
        fprintf(stderr, "메모리가 모자란다\n");
        free(s->data);
        exit(EXIT_FAILURE);
    }
    s->data = bigger;                /* 주소가 바뀌었을 수 있으니 돌려받은 주소를 쓴다 */
    s->capacity *= 2;
}

void push(Stack *s, int item)
{
    if (s->top >= s->capacity - 1)   /* 가득 찼는가 */
        stack_full(s);
    s->data[++s->top] = item;
}
```

`realloc`은 새 자리를 잡고 옛 내용을 옮긴 뒤 옛 자리를 돌려준다. 그래서 늘린 뒤에는 배열의 주소가 달라질 수 있다. 늘리기 전에 배열의 어느 칸을 가리키던 포인터가 있었다면 더는 쓸 수 없다[^s2].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.53 "`StackFull() { REALLOC(stack, 2*capacity*sizeof(*stack)); capacity *= 2; }`" / 문제점: 함수가 돌려주는 값의 타입이 적혀 있지 않고, 대문자 `REALLOC`은 표준 C에 없는 이름이다. 그대로는 컴파일되지 않는다. / 수정안: `void`를 붙이고, `realloc`의 결과를 다른 변수에 받아 `NULL`이 아닌지 본 뒤 배열 변수에 넣는다(위 코드). / 근거: 원문대로 컴파일하면 "type specifier missing"과 "call to undeclared function 'REALLOC'" 오류가 난다. `REALLOC`은 `realloc`을 부르고 실패하면 프로그램을 끝내는 교재의 매크로로 보인다 [확인필요].

</div>


## 얼마나 드는가

넣기 한 번은 용량만큼 오래 걸릴 수 있다. 꽉 찬 순간에 걸리면 든 원소를 모두 옮겨야 하기 때문이다. 그런데도 $$n$$번을 모두 합치면 $$n$$에 비례하는 시간밖에 들지 않는다[^3].

마지막 용량을 $$2^k$$이라 하자. $$k$$는 용량을 늘린 횟수다. 슬라이드의 논증은 세 걸음이다[^3].

1. **넣은 횟수는 $$2^{k-1} + 1$$ 이상이다.** 용량이 $$2^k$$이 되려면 용량 $$2^{k-1}$$이 꽉 찬 뒤에 하나를 더 넣어야 한다.
2. **늘리는 데 쓴 시간은 $$\sum_{i=1}^{k} 2^i$$이다.** 늘릴 때마다 새 용량만큼 일한다고 넉넉히 잡은 값이다. $$\sum$$는 $$i$$를 1부터 $$k$$까지 바꿔 가며 더하라는 기호다.
3. **이 합은 $$O(2^k)$$이다.** 2, 4, 8, …처럼 두 배씩 커지는 수를 더하면 합이 마지막 수의 두 배를 넘지 않는다. 정확히는 $$2^{k+1} - 2$$다([등비급수](/Hongs_Blog/studies/college-math/geometric-series/)).

1과 3을 이으면, 늘리는 데 쓴 시간은 $$2^{k+1} - 2 < 4 \times 2^{k-1} < 4n$$이다. 넣는 일 자체는 한 번에 한 칸이니 $$n$$이다. 둘을 더해도 $$n$$의 몇 배를 넘지 않는다. 그래서 $$n$$번 넣기 전체가 $$O(n)$$이다[^s1].

표의 아홉 번으로 확인하면 $$k = 4$$이고 $$2^3 + 1 = 9$$번을 넣었다. $$2 + 4 + 8 + 16 = 30$$은 $$4 \times 9 = 36$$보다 작다.

옮겨 담은 원소의 수만 정확히 세면 더 작다. 용량이 1, 2, 4, …, $$2^{k-1}$$일 때 한 번씩 꽉 차므로 다음과 같다[^s1].

$$1 + 2 + 4 + \dots + 2^{k-1} = 2^k - 1 < 2n$$


이렇게 여러 번의 비용을 합쳐서 한 번의 비용을 말하는 방법을 분할상환 분석(amortized analysis)이라 부른다[^s1].

### 한 칸씩 늘리면

꽉 찰 때마다 한 칸만 늘리면 넣을 때마다 꽉 차 있다. 원소가 0개, 1개, 2개, … 든 순간마다 모두 옮겨야 하니 옮긴 수는 $$0 + 1 + 2 + \dots + (n - 1) = \frac{n(n-1)}{2}$$이다. $$n$$이 두 배가 되면 네 배가 된다. 한 번에 열 칸씩 늘려도 열 번에 한 번꼴로 모두 옮기므로 여전히 $$n^2$$에 비례한다[^s1].

| 늘리는 법 | 2,000번 넣을 때 옮긴 수 | 100,000번 넣을 때 옮긴 수 |
|---|---|---|
| 두 배씩 | 2,047 | 131,071 |
| 열 칸씩 | 199,000 | 499,950,000 |
| 한 칸씩 | 1,999,000 | 4,999,950,000 |

갈리는 곳은 "몇 칸을 더하느냐"가 아니라 "지금 용량의 몇 배로 늘리느냐"다. 비율로 늘려야 다음에 꽉 찰 때까지의 간격이 함께 늘어난다.

## 활용

원소 수를 미리 모르는 배열이면 어디에나 쓴다.

- 스택이 가득 찼을 때 끝내지 않고 늘린다[^1]. 스택의 나머지 코드는 [배열로 만든 스택](/Hongs_Blog/studies/data-structures/array-stack/)에 있다.
- 희소 행렬의 0 아닌 원소 목록은 처음에 크기를 알 수 없다. 기본 용량(예: 10)으로 시작해 필요할 때 늘린다[^4]. 그 목록은 [희소 행렬의 3원소 표현](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/)에서 다룬다. 용량 10에서 시작해 100개를 넣으면 용량은 160이 되고 옮긴 수는 $$10 + 20 + 40 + 80 = 150$$이다[^s1].
- 해시 테이블도 찬 정도가 문턱을 넘으면 두 배쯤 큰 표로 옮긴다[^5]. 문턱을 정하는 법은 [적재율로 해시 테이블 크기 정하기](/Hongs_Blog/studies/data-structures/load-factor-design/)에 있다.
- 파이썬 리스트의 `append`가 "평균 $$O(1)$$"인 것도 같은 까닭이다: [시간 복잡도로 방법 고르기](/Hongs_Blog/studies/algorithms/complexity-budget/)

**주의.** 평균이 일정하다는 것이지 매번 빠르다는 것이 아니다. 65,537번째 넣기는 65,536개를 옮긴다[^s1]. 한 번이라도 오래 멈추면 안 되는 프로그램에서는 이 한 번이 문제가 된다.

## 연결

- 선수: [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/), [연산 횟수와 단계 수 세기](/Hongs_Blog/studies/data-structures/operation-step-count/), [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)
- 늘릴 일이 아예 없는 구조: [배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 용량 1인 빈 배열에 원소를 여섯 번 넣는다. 꽉 찰 때마다 용량을 두 배로 늘린다. 마지막 용량, 늘린 횟수, 옮겨 담은 원소 수의 합은?</summary>

**답:** 용량 8, 늘린 횟수 3, 옮긴 수 $$1 + 2 + 4 = 7$$.<br>
**이유:** 2번째, 3번째, 5번째 넣기에서 꽉 차 있어 각각 1개, 2개, 4개를 옮긴다. 여섯 번째는 용량 8에 다섯 개가 든 상태라 그냥 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 꽉 찰 때마다 한 칸씩만 늘리면 1,000번 넣는 동안 원소를 몇 번 옮겨 담는가? 두 배씩 늘릴 때와 왜 이렇게 차이가 나는가?</summary>

**답:** 한 칸씩이면 $$0 + 1 + \dots + 999 = 499{,}500$$번, 두 배씩이면 1,023번이다.<br>
**이유:** 한 칸씩 늘리면 넣을 때마다 꽉 차 있어서 매번 전부 옮긴다. 두 배씩 늘리면 한 번 늘린 뒤 지금 든 만큼을 더 넣을 때까지 옮길 일이 없다. 늘리는 간격이 용량과 함께 커진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "마지막 용량이 $$2^k$$이면 넣은 횟수는 $$2^{k-1} + 1$$ 이상이다"는 어디서 나오는가? 이 한 줄이 "전체가 $$O(n)$$"이라는 결론에서 맡는 일은 무엇인가?</summary>

**답:** 용량은 꽉 찼을 때만 늘어난다. 용량이 $$2^k$$이 되었다면 용량 $$2^{k-1}$$이 꽉 찬 상태에서 하나를 더 넣은 적이 있다. 그래서 적어도 $$2^{k-1} + 1$$번 넣었다. 이 줄이 있어야 "늘리는 데 쓴 시간은 $$2^k$$에 비례한다"를 "$$n$$에 비례한다"로 바꿀 수 있다. $$2^k < 2n$$이기 때문이다.

</details>


[^1]: 자료구조 3회 강의 자료 「DS_Week3_Lecture_2024」, p.52 (StackFull()/Dynamic Array: capacity 변수, 1로 시작, 가득 차면 REALLOC으로 두 배, array doubling)
[^2]: 같은 자료, p.53 (StackFull()의 코드)
[^3]: 같은 자료, p.54 (Complexity Of Array Doubling: 마지막 용량 2^k, 넣은 횟수는 2^(k−1) + 1 이상, 합은 O(2^k), n번 전체는 O(n))
[^4]: 같은 자료, p.14 (Single Linear List: 크기를 미리 알 수 없다, 기본 용량 10, 필요할 때 늘린다, REALLOC)
[^5]: 자료구조 15회 강의 자료 「DS_Week15_Lecture_2024」, p.29 (Hash Table Design: 문턱을 넘으면 약 두 배 크기의 표로 다시 넣는다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이사 비유, 아홉 번 넣는 표, 세 걸음의 풀이와 $$4n$$·$$2n$$이라는 구체적인 한계, 분할상환 분석이라는 이름, 한 칸씩·열 칸씩 늘릴 때의 식과 표, 용량 10에서 시작한 수치, 65,537번째 넣기, 카드 C1~C3은 원본에 없다. 슬라이드 p.54의 합 기호 아래 "1<=i=k"는 $$1 \le i \le k$$로 읽었다. 수치는 구현 코드와 검증 코드로 확인했다. 열 칸씩은 용량 10에서 시작한 값이다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 전역 변수 대신 구조체에 묶은 것, `realloc` 결과를 다른 변수에 받는 것, 주소가 바뀐다는 주의는 원본에 없다. 슬라이드는 전역 변수 `stack`, `capacity`와 `REALLOC`을 쓴다. 구현 코드는 이 코드에 세는 변수를 더한 것이다.
{% endraw %}
