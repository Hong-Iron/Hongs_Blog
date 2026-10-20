---
layout: "note"
title: "선형 탐사와 체이닝 비교"
display_title: "선형 탐사와 체이닝 비교"
kind: "concept"
kind_label: "비교"
num: "51"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Linear Probing vs Chaining", "Open Addressing vs Chaining", "개방 주소법과 체이닝"]
description: "둘 다 \"홈 버킷이 찼을 때 그 쌍을 어디에 두는가\"에 대한 답이다. 가르는 질문은 \"넘친 쌍을 표 안에 두는가, 표 밖에 매다는가\"다. 선형 탐사는 표 안의 다른 버킷에 두고, 체이닝은 버킷에 매단 목록에 둔다. 그 답이 표가 찼을 때의 빠르기, 지우기의 수고, 덤 공간을 함께 …"
prev_url: "/studies/data-structures/hash-chaining/"
prev_title: "체이닝"
next_url: "/studies/data-structures/load-factor-design/"
next_title: "적재율로 해시 테이블 크기 정하기"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "51_probing-vs-chaining_verify.py", "u": "/studies/data-structures/code/51_probing-vs-chaining_verify/", "r": "검증"}]
permalink: "/studies/data-structures/probing-vs-chaining/"
---
{% raw %}
둘 다 "홈 버킷이 찼을 때 그 쌍을 어디에 두는가"에 대한 답이다. 가르는 질문은 "**넘친 쌍을 표 안에 두는가, 표 밖에 매다는가**"다. 선형 탐사는 표 안의 다른 버킷에 두고, 체이닝은 버킷에 매단 목록에 둔다. 그 답이 표가 찼을 때의 빠르기, 지우기의 수고, 덤 공간을 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) 쌍의 수가 많아야 1,000개로 정해져 있고, 한 번 넣으면 거의 지우지 않으며, 메모리를 아껴야 한다. (나) 쌍이 계속 들어오고 나가며, 몇 개까지 늘지 미리 알 수 없다. 어느 쪽인가?</summary>

**답:** (가) 선형 탐사. (나) 체이닝.<br>
**이유:** (가)는 쌍의 수를 아니까 적재율이 낮게 버킷 수를 넉넉히 잡을 수 있고, 표 하나로 끝나 포인터 공간이 들지 않는다. 지우기가 드물어 뭉치를 당기는 수고도 거의 없다. (나)에 선형 탐사를 쓰면 표가 차면서 급하게 느려지고 지울 때마다 뭉치를 훑어야 한다. 체이닝은 쌍이 버킷 수를 넘어도 돌아가고 지우기는 노드 하나를 떼면 끝난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 버킷의 90%가 찬 표에서 없는 키를 자주 찾는다. 선형 탐사와 체이닝에서 한 번 찾을 때 들여다보는 수는 각각 얼마쯤인가(두 방법의 $$U_n$$ 식으로)? 왜 이렇게 벌어지는가?</summary>

**답:** 선형 탐사는 버킷 약 50.5개, 체이닝은 노드 약 0.9개다.<br>
**이유:** 선형 탐사는 넘친 쌍이 남의 홈 버킷을 차지해 뭉치가 서로 이어 붙는다. 없는 키는 뭉치 끝의 빈 버킷까지 가야 하는데, 빈 버킷이 열에 하나뿐이다. 체이닝은 자기 버킷의 줄만 보면 되고, 줄 하나에는 평균 0.9개가 달려 있다.

</details>


## 결정적 차이

| | 선형 탐사 | 체이닝 |
|---|---|---|
| 넘친 쌍을 두는 곳 | 표 안의 다음 빈 버킷 | 홈 버킷에 매단 목록 |
| 적재율 $$\alpha$$의 범위 | $$0 \le \alpha \le 1$$ | $$\alpha \ge 0$$ (1을 넘어도 된다) |
| 있는 키 찾기 $$S_n$$ | $$\frac12\left(1 + \frac{1}{1 - \alpha}\right)$$ | $$1 + \frac\alpha2$$ |
| 없는 키 찾기 $$U_n$$ | $$\frac12\left(1 + \frac{1}{(1 - \alpha)^2}\right)$$ | $$\alpha$$ |
| 가장 나쁠 때 | $$\Theta(n)$$. 모든 쌍이 한 뭉치에 | $$\Theta(n)$$. 모든 쌍이 한 체인에 |
| 지우기 | 뭉치를 훑어 뒤의 키를 당겨 온다 | 노드 하나를 떼어 풀어 준다 |
| 덤 공간 | 없다. 대신 빈 버킷을 넉넉히 남겨야 한다 | 노드마다 포인터 하나, 노드를 잡고 푸는 비용 |
| 다른 버킷의 키와 섞이는가 | 섞인다. 뭉치가 자란다 | 섞이지 않는다 |

체이닝의 $$U_n \approx \alpha$$는 체인을 끝까지 훑을 때의 값이다. 정렬된 체인에서 찾는 키보다 큰 노드를 만나 일찍 멈추면 그보다 적게 본다([체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/))[^s1].

선택을 가르는 줄은 "없는 키 찾기"와 "지우기"다. 같은 키를 같은 수의 버킷(20,011개)에 넣고 재면 이렇다. 선형 탐사는 들여다본 버킷 수, 체이닝은 들여다본 노드 수라서 단위가 다르지만, 늘어나는 모양은 견줄 수 있다[^s1].

| $$\alpha$$ | 선형 탐사: 있는 키 | 선형 탐사: 없는 키 | 체이닝: 있는 키 | 체이닝: 없는 키 |
|---|---|---|---|---|
| 0.50 | 1.50 | 2.49 | 1.25 | 0.50 |
| 0.75 | 2.48 | 8.52 | 1.37 | 0.75 |
| 0.90 | 5.41 | 49.36 | 1.45 | 0.90 |

적재율이 0.5에서 0.9로 오를 때 체이닝은 거의 그대로인데, 선형 탐사의 없는 키 찾기는 20배가 된다. 표가 반쯤 비어 있을 때는 둘의 차이가 작다. 그래서 선형 탐사는 적재율을 낮게 묶어 두는 조건으로 쓴다. 보통 $$\alpha \le 0.75$$로 두기를 권한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 키로 두 표를 채워 찾을 때 들여다본 수를 세었다(적재율 0.5, 0.75, 0.9, 버킷 20,011개, 10~30번 평균). 두 문서의 예시 키 12개에서는 있는 키의 합이 선형 탐사 29, 체이닝 18. 체이닝은 적재율 3에서도 돌아간다. 실험으로 확인한 값이고 증명이 아니다 — [51_probing-vs-chaining_verify.py](/Hongs_Blog/studies/data-structures/code/51_probing-vs-chaining_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 해시 테이블(선형 탐사든 체이닝이든)이 알맞지 않은 상황 두 가지와 그때의 선택지를 쓰라.</summary>

**답:** ① 키를 크기 순으로 훑거나 "어떤 값 이상 어떤 값 이하"로 찾아야 할 때 → [이진 탐색 트리](/Hongs_Blog/studies/data-structures/bst-search-insert/). ② 가장 나쁜 경우에도 찾기가 빨라야 할 때 → 균형 이진 탐색 트리.<br>
**이유:** ① 해시 함수는 키를 흩어 놓으므로 버킷의 순서가 키의 크기 순서와 상관없다. 순서로 훑으려면 모두 꺼내 정렬해야 한다. ② 해시 테이블의 찾기·넣기·지우기는 기대 시간이 $$O(1)$$이지만 가장 나쁠 때는 쌍의 수에 비례한다. 사전 연산의 가장 나쁜 경우를 견주면 해시 테이블 $$O(n)$$, 이진 탐색 트리 $$O(n)$$, 균형 이진 탐색 트리 $$O(\log n)$$이다.

</details>


[^s1]: 지우기와 덤 공간은 [49_linear-probing_impl.c](/Hongs_Blog/studies/data-structures/code/49_linear-probing_impl/)와 [50_hash-chaining_impl.c](/Hongs_Blog/studies/data-structures/code/50_hash-chaining_impl/)의 구현에서 그대로 읽은 것이다. 잰 값은 위 검증 코드의 모의실험이다.
{% endraw %}
