---
layout: "note"
title: "이분 탐색"
display_title: "이분 탐색 (Binary Search)"
kind: "concept"
kind_label: "알고리즘"
num: "20"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-02"
status: "verified"
aliases: ["Binary Search", "이진 탐색", "이분 탐색", "bisect", "bisect_left", "bisect_right", "lower bound", "upper bound", "루프 불변식"]
description: "두꺼운 사전에서 단어를 찾을 때 가운데를 펼쳐 앞쪽인지 뒤쪽인지 보고, 절반을 통째로 버리는 것과 같다. 한 번 볼 때마다 찾을 곳이 절반으로 줄어서 100만 개 중에서도 20번이면 찾는다. 대신 정렬된 곳에서만 쓸 수 있다. 그리고 끝을 넣을지 뺄지, 같을 때 어느 쪽으로 갈지를…"
prev_url: "/studies/algorithms/prefix-sum/"
prev_title: "누적 합과 차분 배열"
next_url: "/studies/algorithms/parametric-search/"
next_title: "매개변수 탐색"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/binary-search/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두꺼운 사전에서 단어를 찾을 때 가운데를 펼쳐 앞쪽인지 뒤쪽인지 보고, 절반을 통째로 버리는 것과 같다. 한 번 볼 때마다 찾을 곳이 절반으로 줄어서 100만 개 중에서도 20번이면 찾는다. 대신 **정렬된** 곳에서만 쓸 수 있다. 그리고 끝을 넣을지 뺄지, 같을 때 어느 쪽으로 갈지를 조금만 잘못 잡아도 한 칸 어긋나거나 끝나지 않는다.

</div>


## 예시로 보기

정렬된 [2, 4, 4, 7, 9, 12, 15, 20]에서 "7 이상인 첫 위치"를 찾는다. 찾는 구간을 [lo, hi)로 둔다. lo는 구간의 첫 번호, hi는 구간 바로 뒤 번호다.

| 단계 | lo | hi | mid | a[mid] | a[mid] < 7? | 다음 |
|---|---|---|---|---|---|---|
| 1 | 0 | 8 | 4 | 9 | 아니오 | hi = 4 (답은 4 이하) |
| 2 | 0 | 4 | 2 | 4 | 예 | lo = 3 (답은 3 이상) |
| 3 | 3 | 4 | 3 | 7 | 아니오 | hi = 3 |
| 끝 | 3 | 3 | | | | lo == hi → 답 3 |

a[3] = 7이다. 8칸짜리를 세 번 만에 찾았다. 7이 없고 6을 찾았다면 같은 과정으로 "6 이상인 첫 위치" 3을 돌려준다. 그러면 "6보다 작은 수가 3개 있다"는 뜻도 된다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">입력과 출력</div>

- **입력:** 오름차순으로 정렬된 리스트 $$a[0..n-1]$$ ($$n \ge 0$$)와 값 $$x$$.
- **출력:** $$a[i] \ge x$$인 가장 작은 번호 $$i$$. 그런 번호가 없으면 $$n$$. 이 값은 "x보다 작은 원소의 개수"와 같다(lower bound).

</div>


```
lower_bound(a, x):
    lo ← 0, hi ← n
    while lo < hi:
        mid ← ⌊(lo + hi) / 2⌋
        if a[mid] < x: lo ← mid + 1
        else:          hi ← mid
    return lo
```

## 증명

전략은 루프 불변식이다. 매 바퀴 시작마다 참인 성질을 하나 정하고, 처음에 참이고(초기화), 한 바퀴를 돌아도 참으로 남으며(유지), 끝날 때 답을 알려 줌(종료)을 보인다[^1].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">루프 불변식</div>

매 바퀴 시작에 다음이 참이다: $$a[0..lo-1]$$의 원소는 모두 $$x$$보다 작고, $$a[hi..n-1]$$의 원소는 모두 $$x$$ 이상이며, $$0 \le lo \le hi \le n$$이다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *초기화:* lo = 0, hi = n이면 $$a[0..-1]$$과 $$a[n..n-1]$$은 빈 구간이라 조건이 저절로 참이다.
2. *유지:* lo < hi이면 $$lo \le mid < hi$$다(정수 나눗셈이 내림이기 때문).
   - $$a[mid] < x$$이면: 정렬되어 있으니 $$a[lo..mid]$$는 모두 $$a[mid]$$ 이하, 곧 $$x$$보다 작다. lo를 mid + 1로 옮겨도 "왼쪽은 모두 $$x$$ 미만"이 지켜진다.
   - $$a[mid] \ge x$$이면: 정렬되어 있으니 $$a[mid..hi-1]$$은 모두 $$x$$ 이상이다. hi를 mid로 옮겨도 "오른쪽은 모두 $$x$$ 이상"이 지켜진다.
3. *끝난다:* 매 바퀴 hi − lo가 적어도 1 줄어든다(mid + 1 > lo, mid < hi). 그래서 언젠가 lo == hi가 된다.
4. *종료:* lo == hi이면 불변식에 따라 $$a[0..lo-1]$$은 모두 $$x$$ 미만, $$a[lo..n-1]$$은 모두 $$x$$ 이상이다. 그래서 lo가 "$$x$$ 이상인 첫 번호"다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. `hi = mid`에서 mid + 1이 아니라 mid인 까닭은?</summary>

a[mid] ≥ x이면 mid 자체가 답일 수 있다. hi는 "여기부터는 모두 x 이상"이라는 경계라서, 답 후보인 mid를 버리지 않으려면 hi = mid로 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. `lo = mid + 1`에서 mid가 아니라 mid + 1인 까닭은?</summary>

a[mid] < x이면 mid는 답이 될 수 없다. 그래서 mid까지 버린다. 만약 lo = mid로 두면 hi = lo + 1일 때 mid = lo라서 lo가 그대로여서 끝나지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 반복이 약 log₂ n번인 까닭은?</summary>

한 바퀴마다 구간 hi − lo가 절반 이하로 준다. n을 절반씩 줄여 1 아래로 가려면 [로그](/Hongs_Blog/studies/college-math/logarithm/)의 뜻 그대로 약 log₂ n번이면 된다. 정확히는 많아야 ⌈log₂(n + 1)⌉번이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

"왼쪽은 모두 작다, 오른쪽은 모두 크거나 같다"는 두 경계를 지키며 가운데를 좁힌다. 좁힐 때 버리는 쪽에 답이 없다는 것을 정렬이 보장한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방법을 쓸 수 있는 다른 상황은?</summary>

"어떤 값 이상에서는 늘 참, 그 아래에서는 늘 거짓"인 성질이면 무엇이든 경계를 찾을 수 있다. 답 자체를 이 방식으로 찾는 것이 [매개변수 탐색](/Hongs_Blog/studies/algorithms/parametric-search/)이다.

</details>


## 파이썬의 bisect

파이썬에는 이 함수가 이미 있다[^2].

| 코드 | 돌려주는 값 | 뜻 |
|---|---|---|
| `bisect_left(a, x)` | x 이상인 첫 번호 | x보다 작은 원소 수 |
| `bisect_right(a, x)` | x 초과인 첫 번호 | x 이하인 원소 수 |
| `bisect_right(a, x) - bisect_left(a, x)` | | x의 개수 |
| `bisect_right(a, R) - bisect_left(a, L)` | | L 이상 R 이하인 원소 수 |
| `len(a) - bisect_left(a, x)` | | x 이상인 원소 수 |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 직접 짠 `lower_bound`를 무작위 정렬 리스트 5,000개(길이 0~40, 겹치는 값 포함)에서 `bisect_left`와 처음부터 세는 방법과 비교해 모두 같았다. 반복 횟수가 늘 ⌈log₂(n + 1)⌉ 이하임, 예시 표의 lo·hi·mid 값, bisect 표의 공식, 정렬되지 않은 리스트에서 틀리는 반례, `lo = mid`로 쓰면 끝나지 않는 입력도 확인했다 — [20_binary-search_impl.py](/Hongs_Blog/studies/algorithms/code/20_binary-search_impl/)</div>

</div>


## 활용

- **비용:** 위의 방식은 값을 찾아도 중간에 멈추지 않고 늘 약 log₂ n번 돈다. 그래서 최선·평균·최악 모두 $$O(\log n)$$이고, 추가 공간은 $$O(1)$$이다. 정렬이 안 되어 있으면 먼저 정렬해야 하니 $$O(n \log n)$$이 한 번 든다. 질문이 많을수록 이득이다.
- **쓰는 곳:** 정렬된 목록에서 "x 이상이 몇 개", "구간 안에 몇 개", 사전순으로 가장 가까운 단어, 데이터베이스 색인(B-트리의 각 노드 안), `git bisect`(어느 커밋부터 버그가 생겼나).
- **고르는 기준:** "있나 없나"만 물으면 [집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)이 더 간단하고 빠르다. "몇 개가 x 이상인가", "가장 가까운 값"처럼 크기 순서가 필요하면 정렬 + 이분 탐색이다.
- **흔한 실수:** 정렬하지 않고 쓴다. `while lo <= hi`와 `hi = mid`처럼 서로 다른 방식을 섞어 끝나지 않는다. 답이 없을 때(n을 돌려줄 때) `a[lo]`를 바로 꺼내 범위를 넘는다.

## 연결

- 선수: [정렬과 정렬 기준](/Hongs_Blog/studies/algorithms/sorting/), [로그](/Hongs_Blog/studies/college-math/logarithm/)
- 비교: 정렬된 두 수의 합은 [투 포인터](/Hongs_Blog/studies/algorithms/two-pointers/)로도 찾는다. 한 번의 질문에는 이분 탐색, 한 번 훑으며 여러 짝을 찾을 때는 투 포인터가 알맞다.
- 연습: [순위 검색](/Hongs_Blog/studies/algorithms/pg72412/), [가사 검색](/Hongs_Blog/studies/algorithms/pg60060/)
- 예·아니오 비교로 찾는 방법은 이분 탐색보다 적게 물을 수 없다. 답이 될 수 있는 자리는 0 ~ n의 n + 1가지이고, 비교 한 번은 예·아니오 하나다. 그래서 가장 나쁜 경우 ⌈log₂(n + 1)⌉번은 물어야 하고([진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/)의 정리 2), 이분 탐색은 딱 그만큼 묻는다. 자리마다 답일 가능성이 같으면 평균으로도 log₂(n + 1)번보다 적게 물을 수 없다([엔트로피](/Hongs_Blog/studies/probability-statistics/entropy/)).
- 루프 불변식 증명은 반복 횟수에 대한 [수학적 귀납법](/Hongs_Blog/studies/discrete-math/induction/)이다. 초기화가 기저, 유지가 귀납 단계다. 끝나는지는 귀납이 알려 주지 않아 따로 보인다. hi − lo는 0 이상의 정수라서 매 바퀴 줄면 끝없이 줄 수 없다.
- 방정식의 근을 찾는 [이분법](/Hongs_Blog/studies/calculus/continuity/)도 같은 틀이다. "양 끝 값의 부호가 서로 다르다"를 지키며, 가운데 값의 부호를 보고 절반을 버린다. 다만 정렬은 "버린 쪽에 답이 없다"를 보장하고, 연속은 "남긴 쪽에 근이 있다"만 보장한다(버린 쪽에도 근이 있을 수 있다).
- 정렬한 자료 xs에서 `bisect_right(xs, x) / len(xs)`는 x 이하인 자료의 비율, 곧 [기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/)의 경험적 분포함수다. 거꾸로 쓰면 가중치대로 하나를 무작위로 뽑는다. 가중치의 누적 합에서 0과 합 사이 균등 난수보다 큰 첫 칸을 `bisect_right`로 찾으면 되고, 파이썬 `random.choices`가 이렇게 한다. 비율이 맞는 까닭은 [균등분포와 지수분포](/Hongs_Blog/studies/probability-statistics/uniform-exponential/)의 역변환이다.
- 함께 보면 좋은 수학: [분할 정복 점화식과 마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/)(한 바퀴에 절반만 남기는 비용을 점화식으로 쓰면 T(n) = T(n/2) + O(1)이다)
- 브리지: [수학적 귀납법 ↔ 루프 불변식](/Hongs_Blog/studies/algorithms/induction-loop-invariant/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"mid가 답이 아니면 `lo = mid`로 옮겨도 결국 좁혀진다"</div>

틀렸다. mid = ⌊(lo + hi) / 2⌋라서 hi = lo + 1일 때 mid = lo다. 이때 `lo = mid`는 lo를 그대로 두어 영원히 돈다. 절반씩 줄어드니 결국 끝날 것 같지만, 정수 나눗셈의 내림 때문에 마지막 두 칸에서 줄지 않는다. 확인하려면 [1, 3]에서 3을 찾아 보면 된다. lo = 0, hi = 1에서 멈추지 않는다. 규칙은 "답이 될 수 없는 쪽은 mid까지 버린다(mid + 1), 답이 될 수 있는 쪽은 mid를 남긴다(mid)"이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** [1, 3, 3, 3, 8]에서 `bisect_left(a, 3)`과 `bisect_right(a, 3)`의 값, 그리고 3의 개수는?</summary>

**답:** 1과 4, 개수는 4 − 1 = 3개다. 3 이상인 첫 번호가 1, 3 초과인 첫 번호가 4다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드가 하는 일을 한 문장으로 말하라.</summary>

```python
def f(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] <= x: lo = mid + 1
        else: hi = mid
    return lo
```
**답:** 정렬된 a에서 x보다 큰 첫 번호, 즉 x 이하인 원소의 개수를 돌려준다(`bisect_right`와 같다). `<`가 `<=`로 바뀌어 같은 값도 왼쪽으로 넘긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 이분 탐색이 정렬된 곳에서만 맞는 까닭을 불변식으로 설명하라.</summary>

**답:** a[mid] < x일 때 "mid까지 왼쪽은 모두 x보다 작다"고 보고 버린다. 이것은 a[lo..mid]가 a[mid] 이하라는 정렬 성질 덕분이다. 정렬되지 않으면 mid 왼쪽에 x 이상인 수가 있을 수 있어, 버린 쪽에 답이 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 정렬되지 않은 리스트에서 `bisect_left`가 틀린 답을 내는 예를 들어라.</summary>

**답:** a = [5, 1, 3], x = 5. 답(5 이상인 첫 번호)은 0이다. 하지만 mid = 1에서 a[1] = 1 < 5라 lo = 2로 가고, a[2] = 3 < 5라 lo = 3이 되어 3을 돌려준다.

</details>


[^1]: 루프 불변식의 세 단계(초기화·유지·종료)는 Cormen·Leiserson·Rivest·Stein, *Introduction to Algorithms* 3판, 2.1절의 방식을 따랐다. 이분 탐색 자체는 Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 3.3 "Binary search".
[^2]: Python 3 표준 라이브러리 문서, "bisect — Array bisection algorithm"의 `bisect_left`, `bisect_right`.
{% endraw %}
