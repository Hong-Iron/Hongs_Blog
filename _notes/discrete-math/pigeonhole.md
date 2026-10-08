---
layout: "note"
title: "비둘기집 원리"
display_title: "비둘기집 원리 (Pigeonhole Principle)"
kind: "concept"
kind_label: "정리"
num: "20"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Pigeonhole Principle", "비둘기집 원리", "서랍 원리", "일반화된 비둘기집 원리", "generalized pigeonhole principle", "충돌", "collision"]
description: "비둘기가 비둘기집보다 많으면 어떤 집에는 두 마리 이상 들어간다. 너무 당연해 보이지만, 아무것도 직접 찾지 않고 \"겹치는 것이 반드시 있다\"를 증명하는 강력한 도구다. 해시 충돌, 무손실 압축의 한계 같은 필연적인 충돌이 모두 이 원리에서 나온다. 다만 어느 집에서 겹치는지는 알…"
prev_url: "/studies/discrete-math/inclusion-exclusion/"
prev_title: "포함-배제 원리"
next_url: "/studies/discrete-math/linear-recurrences/"
next_title: "선형 점화식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/pigeonhole/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

비둘기가 비둘기집보다 많으면 어떤 집에는 두 마리 이상 들어간다. 너무 당연해 보이지만, 아무것도 직접 찾지 않고 "겹치는 것이 반드시 있다"를 증명하는 강력한 도구다. 해시 충돌, 무손실 압축의 한계 같은 필연적인 충돌이 모두 이 원리에서 나온다. 다만 어느 집에서 겹치는지는 알려 주지 않는다.

</div>


## 예시로 보기

양말 서랍에 검은 양말과 흰 양말이 섞여 있다. 불을 켜지 않고 몇 짝을 꺼내야 같은 색 한 켤레가 반드시 나올까? 색이 두 가지(집 2개)이므로 3짝(비둘기 3마리)을 꺼내면 어떤 색은 두 짝 이상이다. 2짝으로는 검정 하나, 흰색 하나일 수 있어 부족하다.

꺼낸 양말이 아래 정리의 물건 $$n$$개, 색이 칸 $$k$$개다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">비둘기집 원리</div>

물건 $$n$$개를 칸 $$k$$개에 넣으면[^1]
1. $$n > k$$이면 어떤 칸에는 물건이 2개 이상 들어간다.
2. (일반화) 어떤 칸에는 물건이 $$\lceil n / k \rceil$$($$\lceil\ \rceil$$는 소수점 아래를 올린 정수)개 이상 들어간다.

함수로 말하면, 유한 집합 $$A$$에서 $$B$$로 가는 함수는 $$\vert A\vert  > \vert B\vert $$이면 단사가 아니다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

2를 대우로 보인다. 모든 칸에 $$\lceil n/k \rceil - 1$$개 이하가 들어갔다고 하자. 그러면 전체는 많아야 $$k(\lceil n/k \rceil - 1)$$개다. $$\lceil n/k \rceil < n/k + 1$$이므로 이 값은 $$k \cdot n/k = n$$보다 작다. 물건이 $$n$$개라는 것과 모순이다. 1은 $$n > k$$이면 $$\lceil n/k \rceil \ge 2$$인 경우다. ∎

</details>


## 예제

**이웃한 두 수.** $$\{1, 2, \dots, 2n\}$$에서 $$n + 1$$개를 고르면 차가 1인 두 수가 반드시 있다.

1. *칸 만들기:* $$\{1, 2\}, \{3, 4\}, \dots, \{2n-1, 2n\}$$의 $$n$$칸.
2. *물건 넣기:* 고른 $$n + 1$$개를 각자 속한 칸에 넣는다.
3. *원리 적용:* 물건이 칸보다 많아 어떤 칸에 두 수가 들어가고, 한 칸의 두 수는 차가 1이다.
4. *더 줄일 수 없음:* 홀수 $$1, 3, \dots, 2n - 1$$의 $$n$$개를 고르면 이웃한 두 수가 없다.

비둘기집 원리를 쓰는 요령은 3단계보다 1단계, 즉 "무엇을 칸으로 삼을까"에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 일반화된 원리를 $$n \le 7$$, $$k \le 4$$의 모든 배치에서, 파일 100개와 폴더 7개, 이웃한 두 수를 $$n \le 6$$에서 전수, 짧은 파일의 수, 8비트 해시 충돌 — [20_pigeonhole_verify.py](/Hongs_Blog/studies/discrete-math/code/20_pigeonhole_verify/)</div>

</div>


## 활용

- **해시 충돌은 필연이다.** 가능한 키가 해시값보다 많으면 두 키가 같은 해시값을 갖는 일이 반드시 있다. 좋은 해시 함수는 충돌을 없애는 것이 아니라 드물고 고르게 만든다. 해시 테이블은 충돌을 처리하는 방법(체이닝, 열린 주소)을 꼭 갖춰야 한다.
- **무손실 압축의 한계.** 길이 $$n$$비트 파일은 $$2^n$$개인데 길이 $$n$$ 미만 파일은 $$1 + 2 + \cdots + 2^{n-1} = 2^n - 1$$개뿐이다. 모든 파일을 더 짧게 만드는 압축은 서로 다른 두 파일을 같은 결과로 보낼 수밖에 없어 풀 수 없다.
- **생일 문제.** 사람이 367명이면 생일이 같은 두 사람이 반드시 있다(윤년 포함 366일). 확률로 보면 23명만 되어도 절반 넘게 겹친다([확률의 공리와 계산](/Hongs_Blog/studies/probability-statistics/probability-axioms/)).
- 알고리즘에서: 충돌을 처리하면서 칸이 차면 칸 수를 늘려 평균 $$O(1)$$을 지키는 파이썬 딕셔너리는 [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)에 있다. [재밌는 레이싱 경기장 설계하기](/Hongs_Blog/studies/algorithms/pg214292/)는 '이웃한 두 수'와 같은 칸 나누기로, 한 줄 $$n$$자리에서 서로 이웃하지 않는 자리가 많아야 $$\lceil n/2 \rceil$$개라는 한계를 세운다. [튜브의 소개팅](/Hongs_Blog/studies/algorithms/pg1839/)은 칸이 $$N$$개인 판에서 $$N$$걸음 이상 걸으면 어떤 칸을 두 번 밟는다는 데서, 확인할 층 수를 칸 수 이하로 묶는다.

## 연결

- 선수: [셈의 기본 법칙](/Hongs_Blog/studies/discrete-math/counting-rules/)
- 같은 사실: [함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/)의 "단사이면 $$\vert A\vert  \le \vert B\vert $$"의 대우다.
- 이어지는 개념: 확률과 통계의 [해싱과 무작위 알고리즘](/Hongs_Blog/studies/probability-statistics/randomized-analysis/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 일반화된 비둘기집 원리를 쓰라.</summary>

**답:** 물건 $$n$$개를 칸 $$k$$개에 넣으면 어떤 칸에는 $$\lceil n/k \rceil$$개 이상 들어간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 파일 100개를 폴더 7개에 나누면, 파일이 가장 많은 폴더에는 적어도 몇 개가 있는가? 그 수보다 하나 적게 모든 폴더에 넣을 수 없는 이유는?</summary>

**답:** $$\lceil 100/7 \rceil = 15$$개. 폴더마다 14개씩이면 $$7 \times 14 = 98 < 100$$이라 다 담지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 모든 파일을 반드시 더 짧게 만드는 무손실 압축 프로그램이 존재할 수 없는 이유를 비둘기집 원리로 설명하라.</summary>

**답:** 길이 $$n$$비트 파일은 $$2^n$$개, 그보다 짧은 파일은 $$2^n - 1$$개다. 모든 $$n$$비트 파일을 더 짧은 파일로 보내면 물건이 칸보다 많아 두 파일이 같은 압축 결과를 가진다. 그러면 압축을 풀 때 둘 중 어느 것인지 알 수 없어 "무손실"이 깨진다.

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 15장 "Cardinality Rules"(비둘기집 원리). Rosen, *Discrete Mathematics and Its Applications* 7판, 6장 "Counting"(일반화된 비둘기집 원리).
{% endraw %}
