---
layout: "note"
title: "ECLAT"
display_title: "ECLAT"
kind: "concept"
kind_label: "알고리즘"
num: "14"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["ECLAT", "Equivalence Class Transformation", "수직 데이터 형식", "Vertical Data Format", "수평 데이터 형식", "Horizontal Data Format", "TID 목록", "TID-list", "거래 번호 목록"]
description: "영수증마다 산 물건을 적는 대신, 물건마다 그 물건이 든 영수증 번호를 적어 둔다. 그러면 \"A와 B를 함께 산 영수증\"은 A의 번호 목록과 B의 번호 목록의 공통 부분이라, 데이터를 다시 훑지 않고 목록끼리 겹쳐 보기만 하면 지지도가 나온다. 데이터를 한 번만 읽으면 되지만, 물…"
prev_url: "/studies/data-science/apriori/"
prev_title: "Apriori 알고리즘"
next_url: "/studies/data-science/fp-growth/"
next_title: "FP-Growth"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/eclat/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

영수증마다 산 물건을 적는 대신, 물건마다 그 물건이 든 영수증 번호를 적어 둔다. 그러면 "A와 B를 함께 산 영수증"은 A의 번호 목록과 B의 번호 목록의 공통 부분이라, 데이터를 다시 훑지 않고 목록끼리 겹쳐 보기만 하면 지지도가 나온다. 데이터를 한 번만 읽으면 되지만, 물건이 흔하면 번호 목록이 길어져 메모리를 많이 쓰고, 후보를 만드는 일은 여전히 남는다.

</div>


## 예시로 보기

[Apriori](/Hongs_Blog/studies/data-science/apriori/)는 후보 묶음 하나의 지지도를 알려고 DB 전체를 훑는다. 같은 일을 표를 뒤집어서 해 보자[^1].

| 수평 형식 (거래 → 항목) | | 수직 형식 (항목 → 거래 번호) | |
|---|---|---|---|
| 10 | A, B, E | A | 10, 20, 50, 70, 80, 90 |
| 20 | A, B, D | B | 10, 20, 30, 40, 60, 80, 90 |
| 30 | B, C | C | 30, 50, 60, 70, 80, 90 |
| 40 | B, D | D | 20, 40 |
| 50 | A, C | E | 10, 80 |
| 60 | B, C | | |
| 70 | A, C | | |
| 80 | A, B, C, E | | |
| 90 | A, B, C | | |

수직 형식에서 각 항목 옆의 번호 묶음을 TID 목록이라 부른다(TID는 거래 번호). 이제 {A, B}가 든 거래는 A와 B의 TID 목록의 교집합이다[^2].

$$\{10, 20, 50, 70, 80, 90\} \cap \{10, 20, 30, 40, 60, 80, 90\} = \{10, 20, 80, 90\}$$


지지 개수는 4다. {A, B, C}는 {A, B}의 목록과 C의 목록을 겹쳐 {80, 90}, 지지 개수 2다. 최소 지지 개수 2에서 결과는 2항목 AB 4, AC 4, AE 2, BC 4, BD 2, BE 2와 3항목 ABC 2, ABE 2다[^2]. [Apriori](/Hongs_Blog/studies/data-science/apriori/)의 연습 1과 같은 답이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 수직 표, 교집합 결과, 무작위 자료 300개에서 모든 부분집합을 세는 방법과 일치, 카드 C3 — [14_eclat_impl.py](/Hongs_Blog/studies/data-science/code/14_eclat_impl/)</div>

</div>


## 정의

**ECLAT**(Equivalence Class Transformation)은 수직 데이터 형식 {항목: TID 집합}을 쓰고, 집합의 교집합으로 지지도를 구하는 깊이 우선 탐색 알고리즘이다[^1]. DB는 TID 목록을 만들 때 한 번만 훑는다[^3].

```
ECLAT(같은 앞부분을 가진 빈발 집합들 P = [(X1, T1), (X2, T2), ...]):
    for i: 
        Xi를 빈발로 기록 (지지 개수 = |Ti|)
        Q ← []
        for j > i:
            T ← Ti ∩ Tj
            |T| ≥ min_sup이면 Q에 (Xi ∪ Xj, T)를 넣는다
        Q가 비지 않으면 ECLAT(Q)          # 깊이 우선
처음 호출: 빈발 1-항목과 그 TID 목록
```

$$X \cup Y$$의 TID 목록이 $$T(X) \cap T(Y)$$인 이유: 거래가 $$X \cup Y$$의 모든 항목을 담는 것은, $$X$$의 항목을 모두 담고 $$Y$$의 항목도 모두 담는 것과 같기 때문이다[^s1].

### 실행 추적

A로 시작하는 가지를 깊이 우선으로 따라간다(최소 지지 개수 2)[^s1].

| 단계 | 교집합 | TID | 개수 | 결과 |
|---|---|---|---|---|
| A와 B | $$T(A) \cap T(B)$$ | 10, 20, 80, 90 | 4 | AB 빈발 |
| A와 C | | 50, 70, 80, 90 | 4 | AC 빈발 |
| A와 D | | 20 | 1 | 버림 |
| A와 E | | 10, 80 | 2 | AE 빈발 |
| AB 가지: AB와 AC | $$T(AB) \cap T(AC)$$ | 80, 90 | 2 | ABC 빈발 |
| AB와 AE | | 10, 80 | 2 | ABE 빈발 |
| ABC와 ABE | | 80 | 1 | 버림 |
| AC 가지: AC와 AE | | 80 | 1 | 버림 |

A 가지가 끝나면 B로 시작하는 가지로 넘어간다.

### 복잡도

교집합 한 번은 두 목록의 길이에 비례한다(정렬된 목록이면 한 번에 훑어 겹친다). TID 목록의 길이 합은 거래 속 항목 등장 수와 같아서, 흔한 항목이 많은 큰 DB에서는 목록이 길어진다[^s1].

## 활용

- 구현: [14_eclat_impl.py](/Hongs_Blog/studies/data-science/code/14_eclat_impl/)
- 한계: 흔한 항목의 TID 목록은 거래 수만큼 길어 메모리를 많이 쓰고, 교집합 계산도 오래 걸린다. 후보(교집합할 짝)를 만드는 일도 남는다[^3].
- TID 목록을 0과 1의 비트열로 저장하면 교집합이 비트 AND 한 번이 된다(알고리즘의 [비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/))[^s1].

## 연결

- 선수: [Apriori 알고리즘](/Hongs_Blog/studies/data-science/apriori/)(같은 빈발 집합을 수평 형식에서 찾는다)
- 가지를 끝까지 내려간 뒤 돌아오는 탐색: [깊이 우선 탐색](/Hongs_Blog/studies/algorithms/dfs/)
- 세 방법 비교: [빈발 패턴 마이닝 방법 비교](/Hongs_Blog/studies/data-science/contrast--fp-mining-methods/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 수평 데이터 형식과 수직 데이터 형식을 설명하고, ECLAT이 수직 형식에서 지지도를 구하는 방법을 쓰라.</summary>

**답:** 수평은 거래마다 든 항목을, 수직은 항목마다 그 항목이 든 거래 번호(TID 목록)를 적는다. ECLAT은 항목 집합의 TID 목록을 구성 항목 목록들의 교집합으로 구하고, 그 크기를 지지 개수로 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 예시의 수직 표에서 $$T(B) \cap T(C)$$, $$T(B) \cap T(D)$$, $$T(C) \cap T(E)$$를 구하고, 최소 지지 개수 2에서 빈발인지 쓰라.</summary>

**답:** $$T(B) \cap T(C) = \{30, 60, 80, 90\}$$ → 4, 빈발. $$T(B) \cap T(D) = \{20, 40\}$$ → 2, 빈발. $$T(C) \cap T(E) = \{80\}$$ → 1, 빈발 아님.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** ECLAT은 Apriori보다 DB를 적게 훑지만 메모리를 많이 쓸 수 있다. 이유를 대라.</summary>

**답:** DB는 TID 목록을 만들 때 한 번만 훑고, 이후 지지도는 목록의 교집합으로 구한다. 하지만 목록 길이의 합이 거래 속 항목 등장 수(예시는 23)와 같아서, 흔한 항목이 많은 큰 DB에서는 목록 자체가 커지고 교집합 중간 결과도 들고 있어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 의사코드의 `T ← Ti ∩ Tj` 줄이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 두 항목 집합을 모두 담은 거래 번호만 남겨, DB를 다시 보지 않고 합친 집합의 지지 개수를 구한다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/03.3-1_FP.pdf, p.27
[^2]: 같은 자료, p.28
[^3]: 같은 자료, p.39 (요약 표: DB 1번 훑기, 수직 형식, 후보 생성 있음, TID 집합 교집합, DFS, 메모리 많음)
[^s1]: 에이전트 보충. 의사코드, 교집합이 지지도가 되는 이유, 실행 추적 표, 복잡도, 비트열 저장, 카드 C2~C4는 원본에 없다. 구현 코드로 확인했다(Zaki, "Scalable Algorithms for Association Mining", IEEE TKDE 2000).
{% endraw %}
