---
layout: "note"
title: "함수의 성질과 집합의 크기"
display_title: "함수의 성질과 집합의 크기 (Injections, Surjections, Bijections)"
kind: "concept"
kind_label: "정의"
num: "07"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Injective", "Surjective", "Bijective", "단사", "일대일 함수", "injection", "전사", "위로의 함수", "surjection", "전단사", "일대일 대응", "bijection", "기수", "cardinality", "집합의 크기"]
description: "함수를 두 질문으로 나눈다. 출력이 서로 겹치지 않는가(단사), 도착 쪽을 빠짐없이 덮는가(전사). 둘 다이면 전단사로, 두 집합의 원소를 하나씩 짝지을 수 있어 크기가 같다. 끝없이 큰 집합의 크기도 이 짝짓기로 비교한다. 해시 함수처럼 큰 집합에서 작은 집합으로 가는 함수는 단…"
prev_url: "/studies/discrete-math/sets/"
prev_title: "집합"
next_url: "/studies/discrete-math/countability/"
next_title: "가산 집합과 대각선 논법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/function-properties/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

함수를 두 질문으로 나눈다. 출력이 서로 겹치지 않는가(단사), 도착 쪽을 빠짐없이 덮는가(전사). 둘 다이면 전단사로, 두 집합의 원소를 하나씩 짝지을 수 있어 크기가 같다. 끝없이 큰 집합의 크기도 이 짝짓기로 비교한다. 해시 함수처럼 큰 집합에서 작은 집합으로 가는 함수는 단사일 수 없어서 충돌이 반드시 생긴다.

</div>


## 예시로 보기

강의실 좌석 배정은 함수 "학생 → 좌석"이다.

| 상황 | 겹침 | 빈자리 | 이름 |
|---|---|---|---|
| 학생 30명, 좌석 40개, 한 좌석에 한 명 | 없음 | 있음 | 단사, 전사 아님 |
| 학생 40명, 좌석 30개, 모든 좌석이 참 | 있음 | 없음 | 전사, 단사 아님 |
| 학생 30명, 좌석 30개, 한 좌석에 한 명씩 꽉 참 | 없음 | 없음 | 전단사 |

마지막 경우에는 학생 수를 세지 않고도 좌석 수와 같다는 것을 안다. 짝이 딱 맞기 때문이다. 이 생각이 "크기가 같다"의 정의가 된다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

함수 $$f: A \to B$$에 대해[^1]
- **단사**(injective, 일대일): $$f(a_1) = f(a_2) \Rightarrow a_1 = a_2$$. 서로 다른 입력은 서로 다른 출력으로 간다.
- **전사**(surjective, 위로의): $$\forall b \in B\ \exists a \in A\ (f(a) = b)$$. 치역이 공역 전체다.
- **전단사**(bijective): 단사이면서 전사. 이때 [역함수](/Hongs_Blog/studies/college-math/inverse-function/) $$f^{-1}: B \to A$$가 있고, 거꾸로 역함수가 있으면 전단사다.

**집합의 크기.** $$A$$에서 $$B$$로 가는 전단사가 있으면 $$\vert A\vert  = \vert B\vert $$라 한다. 단사가 있으면 $$\vert A\vert  \le \vert B\vert $$라 한다. 유한 집합에서는 원소 수와 같은 뜻이고, 무한 집합에서는 이것이 크기의 정의다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">유한 집합에서</div>

$$A$$, $$B$$가 유한할 때
1. 단사 $$A \to B$$가 있으면 $$\vert A\vert  \le \vert B\vert $$이다.
2. 전사 $$A \to B$$가 있으면 $$\vert A\vert  \ge \vert B\vert $$이다.
3. $$A$$에서 $$B$$로 가는 함수는 $$\vert B\vert ^{\vert A\vert }$$개다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. 단사이면 치역 $$f(A)$$의 원소가 $$A$$의 원소와 하나씩 짝지어지므로 $$\vert f(A)\vert  = \vert A\vert $$이고, $$f(A) \subseteq B$$라 $$\vert A\vert  \le \vert B\vert $$다.
2. 전사이면 $$B$$의 원소마다 그리로 가는 $$A$$의 원소를 하나씩 고를 수 있다. 고른 원소들은 서로 다르므로(출력이 다르니) $$\vert B\vert  \le \vert A\vert $$다.
3. $$A$$의 원소마다 출력을 $$\vert B\vert $$가지 중 하나씩 독립적으로 고른다. $$\vert A\vert $$번 고르므로 $$\vert B\vert  \cdot \vert B\vert  \cdots \vert B\vert  = \vert B\vert ^{\vert A\vert }$$가지다(이 셈법은 [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)에서 곱의 법칙으로 정식화한다). ∎

</details>


## 예제

**$$\vert \mathcal{P}(A)\vert  = 2^n$$을 전단사로 보이기.** $$A = \{0, 1, \dots, n - 1\}$$의 부분집합 $$S$$에, $$i \in S$$이면 $$i$$번째 비트가 1인 $$n$$비트 문자열을 대응시킨다.

1. *단사:* 두 부분집합이 다르면 어떤 원소 $$i$$가 한쪽에만 있어 $$i$$번째 비트가 다르다.
2. *전사:* 아무 $$n$$비트 문자열이든 1인 자리들을 모으면 그 문자열로 가는 부분집합이 된다.
3. *결론:* 전단사이므로 부분집합의 수는 $$n$$비트 문자열의 수 $$2^n$$과 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 정수 함수 네 개의 분류(유한 창에서), $$\vert A\vert , \vert B\vert  \le 4$$인 모든 함수를 늘어놓아 정리 1~3과 단사의 개수 확인, 부분집합과 비트열의 전단사($$n \le 10$$) — [07_function-properties_verify.py](/Hongs_Blog/studies/discrete-math/code/07_function-properties_verify/)</div>

</div>


## 활용

- **해시 충돌.** 문자열 전체에서 64비트 해시값으로 가는 함수는 입력이 훨씬 많아 단사일 수 없다(정리 1의 대우). 충돌은 설계 실수가 아니라 필연이다. 좋은 해시는 충돌을 없애는 것이 아니라 고르게 흩는다.
- **암호와 압축.** 복호화할 수 있으려면 암호화는 단사여야 한다. 무손실 압축은 어떤 파일은 오히려 커질 수밖에 없다. 짧은 파일의 수가 긴 파일의 수보다 적어서, 모든 파일을 줄이는 단사 함수는 없기 때문이다[^s1].
- **데이터베이스 키.** 기본 키는 행에서 키값으로 가는 단사 함수다. 같은 키를 가진 두 행을 허용하지 않는다.
- 알고리즘에서: 예제의 짝짓기를 코드로 옮긴 것이 비트마스크이고, 0부터 $$2^n - 1$$까지의 수 하나가 부분집합 하나다([비트 연산과 비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/)). 유한 집합에서는 출력 종류 수가 입력 수와 같으면 단사라서, [후보키](/Hongs_Blog/studies/algorithms/pg42890/)는 고른 열 값의 종류 수를 행 수와 비교해 유일성을 검사한다. 충돌이 나도 평균 $$O(1)$$을 지키는 방법(다른 빈칸 찾기, 칸 수 늘리기)은 [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)에 있다.

## 연결

- 선수: [집합](/Hongs_Blog/studies/discrete-math/sets/), [역함수](/Hongs_Blog/studies/college-math/inverse-function/)(일대일 함수의 뜻)
- 이어지는 개념: [가산 집합과 대각선 논법](/Hongs_Blog/studies/discrete-math/countability/)(무한 집합의 크기), [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)과 [비둘기집 원리](/Hongs_Blog/studies/discrete-math/pigeonhole/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 정수에서 정수로 가는 함수 (가) f(x) = 2x (나) g(x) = ⌊x/2⌋ (다) h(x) = x + 1 (라) k(x) = x²을 단사·전사로 분류하라.</summary>

**답:** (가) 단사, 전사 아님(홀수가 안 나옴). (나) 전사, 단사 아님($$g(0) = g(1) = 0$$). (다) 전단사(역함수 $$x - 1$$). (라) 둘 다 아님($$k(1) = k(-1)$$, 음수와 2가 안 나옴).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 유한 집합 A에서 B로 가는 단사 함수가 있으면 왜 \|A\| ≤ \|B\|인가? 이 사실에서 해시 충돌에 대해 무엇을 알 수 있나?</summary>

**답:** 단사이면 출력이 모두 달라 치역의 크기가 $$\vert A\vert $$이고, 치역은 $$B$$ 안에 있으므로 $$\vert A\vert  \le \vert B\vert $$다. 대우를 취하면, $$\vert A\vert  > \vert B\vert $$이면 어떤 함수도 단사가 아니다. 입력이 해시값보다 많으면 충돌이 반드시 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 원소 3개인 집합에서 원소 2개인 집합으로 가는 함수는 몇 개이고, 그중 전사는 몇 개인가?</summary>

**답:** $$2^3 = 8$$개. 전사가 아닌 것은 모든 원소를 한 값으로 보내는 2개이므로 전사는 6개다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 4장 "Mathematical Data Types"(함수, 이항 관계, 유한 집합의 크기). Rosen, *Discrete Mathematics and Its Applications* 7판, 2장(함수, 집합의 크기).
[^s1]: 에이전트 보충. 무손실 압축의 한계는 "길이 $$n$$ 비트 파일은 $$2^n$$개인데 길이 $$n$$ 미만 파일은 $$2^n - 1$$개"라는 셈에서 나온다. [비둘기집 원리](/Hongs_Blog/studies/discrete-math/pigeonhole/)의 대표 예다.
{% endraw %}
