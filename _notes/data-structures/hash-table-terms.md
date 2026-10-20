---
layout: "note"
title: "해시 테이블의 홈 버킷과 충돌"
display_title: "해시 테이블의 홈 버킷과 충돌 (Home Bucket, Collision, Overflow)"
kind: "concept"
kind_label: "정의"
num: "47"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Hash Table", "Hash Map", "해시 테이블", "해시 맵", "버킷", "Bucket", "홈 버킷", "Home Bucket", "동의어", "Synonym", "충돌", "Collision", "넘침", "오버플로", "Overflow", "이상적인 해싱", "Ideal Hashing"]
description: "우편물을 이름표의 번호로 계산한 칸에 바로 꽂아 두는 우편함과 같다. 찾을 때도 같은 계산으로 그 칸만 열어 보면 되므로, 우편물이 아무리 많아도 한 번에 찾는다. 문제는 서로 다른 우편물이 같은 칸으로 계산될 때다. 칸에 한 통만 들어간다면 나중에 온 것은 갈 곳이 없으니, 그때…"
prev_url: "/studies/data-structures/k-way-merge/"
prev_title: "k-way 병합과 선택 트리"
next_url: "/studies/data-structures/hash-function-division/"
next_title: "나눗셈 해시 함수"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "47_hash-table-terms_verify.py", "u": "/studies/data-structures/code/47_hash-table-terms_verify/", "r": "검증"}]
permalink: "/studies/data-structures/hash-table-terms/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

우편물을 이름표의 번호로 계산한 칸에 바로 꽂아 두는 우편함과 같다. 찾을 때도 같은 계산으로 그 칸만 열어 보면 되므로, 우편물이 아무리 많아도 한 번에 찾는다. 문제는 서로 다른 우편물이 같은 칸으로 계산될 때다. 칸에 한 통만 들어간다면 나중에 온 것은 갈 곳이 없으니, 그때 어떻게 할지를 따로 정해 두어야 한다.

</div>


## 예시로 보기

배열에서 값을 찾으려면 앞에서부터 하나씩 견주거나, 정렬해 두고 반씩 줄여 가야 한다. 어느 쪽이든 자료가 많아지면 견주는 횟수가 는다. "이름표만 보고 칸 번호를 계산"할 수 있으면 견줄 필요가 없다.

쌍 (22, a), (33, c), (3, d), (73, e), (85, f)를 칸 8개짜리 표에 넣는다. 앞의 수가 이름표(키)이고 뒤의 글자가 함께 둘 값이다. 칸 번호는 키를 11로 나눈 몫으로 정한다.

| 키 | 22 | 33 | 3 | 73 | 85 |
|---|---|---|---|---|---|
| 11로 나눈 몫 | 2 | 3 | 0 | 6 | 7 |

```
칸:   [0]     [1]   [2]      [3]      [4]   [5]   [6]      [7]
     (3,d)         (22,a)   (33,c)               (73,e)   (85,f)
```

73을 찾으려면 $$73 \div 11$$의 몫 6을 계산해 6번 칸만 보면 된다. 찾기, 넣기, 지우기가 모두 $$O(1)$$이다.

여기에 (26, g)를 넣으려 하면 탈이 난다. $$26 \div 11$$의 몫도 2인데, 2번 칸에는 이미 (22, a)가 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 다섯 쌍의 칸 번호, 26과 22가 같은 칸, 버킷에 한 쌍만 들어가면 충돌과 넘침이 늘 함께라는 것(무작위 500번), 버킷에 두 쌍이 들어갈 때의 예, 카드의 답 — [47_hash-table-terms_verify.py](/Hongs_Blog/studies/data-structures/code/47_hash-table-terms_verify/)</div>

</div>


## 정의

해시 테이블은 (키, 값) 쌍을 모아 두는 자료구조다. 쌍마다 키가 서로 다르고, 키로 찾기(Search), 키로 지우기(Delete), 쌍 넣기(Insert)를 한다. 이 세 연산을 하는 모음을 사전이라 부르는데, "무엇을 하는가"만 정한 것이라 [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/)이고, 해시 테이블은 그것을 만드는 방법 가운데 하나다.

이상적인 해싱은 이렇게 한다.

- 1차원 배열 `table[0]`부터 `table[b-1]`까지를 쓴다. 배열의 칸 하나하나를 **버킷**(bucket)이라 부른다. 버킷 하나에는 보통 쌍이 하나만 들어간다. $$b$$는 버킷의 수다.
- **해시 함수** $$f$$가 키 $$k$$를 0부터 $$b - 1$$까지의 칸 번호로 바꾼다. $$f(k)$$번 버킷을 키 $$k$$의 **홈 버킷**(home bucket)이라 부른다. 그 키가 들어가야 할 "자기 집"이라는 뜻이다.
- 모든 쌍을 자기 홈 버킷 `table[f(key)]`에 넣는다.

위 예는 $$b = 8$$, $$f(k) = \lfloor k / 11 \rfloor$$(11로 나눈 몫)이다. 이 $$f$$가 0부터 7까지를 내는 키는 0부터 87까지다.

모든 키가 서로 다른 홈 버킷을 가지면 이상적이다. 그렇지 않을 때를 부르는 말이 셋 있다.

| 용어 | 뜻 | 위 예에서 |
|---|---|---|
| 동의어(synonym) | 홈 버킷이 같은 키들 | 22와 26 (둘 다 2번) |
| 충돌(collision) | 새 쌍의 홈 버킷에 **다른 키의 쌍이 이미 있는** 것 | (26, g)를 넣으려는데 2번에 (22, a)가 있다 |
| 넘침(overflow) | 새 쌍의 홈 버킷에 **들어갈 자리가 없는** 것 | 2번 버킷이 한 쌍으로 가득 찼다 |

동의어는 "쓰고 있는 해시 함수에 대해서" 동의어다. 함수를 바꾸면 22와 26은 다른 칸으로 갈 수 있다.

### 충돌과 넘침은 같은 말이 아니다

충돌은 "누가 먼저 와 있다"이고 넘침은 "자리가 없다"이다. 버킷에 한 쌍만 들어가면 누가 먼저 와 있는 순간 자리도 없으므로 둘이 늘 함께 일어난다. 버킷에 두 쌍이 들어간다면 갈린다.

| 버킷 크기 | (26, g)를 넣을 때 | 이어서 (24, h)를 넣을 때 ($$24 \div 11$$의 몫도 2) |
|---|---|---|
| 한 쌍 | 충돌이고 넘침 | 충돌이고 넘침 |
| 두 쌍 | 충돌이지만 넘치지 않는다. 2번 버킷의 둘째 자리에 들어간다 | 충돌이고 넘침 |

손봐야 하는 것은 넘침이다. 충돌해도 자리가 있으면 그냥 넣으면 된다. 그래서 넘침을 다루는 방법이 필요하다.

### 정해야 할 세 가지

해시 테이블을 만들려면 세 가지를 정해야 한다.

| 정할 것 | 다루는 문서 |
|---|---|
| 해시 함수를 무엇으로 할까 | [나눗셈 해시 함수](/Hongs_Blog/studies/data-structures/hash-function-division/) |
| 넘침을 어떻게 다룰까 | [선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/), [체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/) |
| 표의 크기(버킷 수)를 얼마로 할까 | [적재율로 해시 테이블 크기 정하기](/Hongs_Blog/studies/data-structures/load-factor-design/) |

## 활용

- 넘침이 생기면 찾기도 한 번에 끝나지 않는다. 그래서 찾기·넣기·지우기는 기대 시간이 $$O(1)$$이고, 가장 나쁠 때는 들어 있는 쌍의 수에 비례한다.
- 가능한 키의 종류가 버킷 수보다 많으면 동의어는 반드시 있다. 위 예에서 키는 0부터 87까지 88가지인데 버킷은 8개라, 어떤 버킷에는 키가 11가지씩 몰린다: [비둘기집 원리](/Hongs_Blog/studies/discrete-math/pigeonhole/).
- 흔한 실수: "충돌이 났다"와 "넘쳤다"를 같은 뜻으로 쓰는 것. 버킷 크기가 1일 때만 같다.

## 연결

- 선수: [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/)(사전), [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)(칸 번호로 바로 가기)
- 파이썬의 딕셔너리와 집합이 이 구조다. 쓰는 법과 평균 $$O(1)$$의 뜻: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)
- 같은 사전을 나무로 만든 것: [이진 탐색 트리의 탐색과 삽입](/Hongs_Blog/studies/data-structures/bst-search-insert/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 충돌과 넘침의 뜻을 각각 쓰고, 둘이 따로 일어나는 경우를 하나 들어라.</summary>

**답:** 충돌은 새 쌍의 홈 버킷에 다른 키의 쌍이 이미 있는 것이고, 넘침은 새 쌍의 홈 버킷에 들어갈 자리가 없는 것이다. 버킷에 두 쌍이 들어가는 표에서 (22, a)만 있는 2번 버킷에 (26, g)를 넣으면 충돌이지만 넘치지 않는다.<br>
**이유:** 버킷에 한 쌍만 들어가면 둘은 늘 함께 일어난다. 그래서 흔히 섞어 쓰지만, 따로 손봐야 하는 것은 넘침이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 위 예의 표(버킷 8개, 한 쌍씩, $$f(k)$$는 11로 나눈 몫)에 키 14, 40, 47, 58, 80을 차례로 넣는다. 홈 버킷을 각각 구하고, 충돌하는 키를 고르라.</summary>

**답:** 홈 버킷은 1, 3, 4, 5, 7이다. 40(3번에 33이 있다)과 80(7번에 85가 있다)이 충돌한다.<br>
**이유:** 14, 47, 58의 홈 버킷 1, 4, 5는 비어 있었다. 버킷 크기가 1이므로 40과 80은 넘치기도 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 키 22, 26, 33, 40, 85, 80, 3을 같은 해시 함수에 대한 동의어끼리 묶어라.</summary>

**답:** {22, 26}(2번), {33, 40}(3번), {85, 80}(7번), {3}(0번).<br>
**이유:** 동의어는 홈 버킷이 같은 키다. 키의 크기가 가까운 것과는 상관없고, 해시 함수가 같은 번호를 내는지만 본다.

</details>
{% endraw %}
