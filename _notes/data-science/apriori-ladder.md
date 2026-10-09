---
layout: "note"
title: "Apriori 예제 사다리"
display_title: "Apriori 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "13"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: Apriori 알고리즘의 결합·가지치기, 연관 규칙의 신뢰도."
next_url: "/studies/data-science/fp-growth-ladder/"
next_title: "FP-Growth 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/apriori-ladder/"
---
{% raw %}
사용 개념: [Apriori 알고리즘](/Hongs_Blog/studies/data-science/apriori/)의 결합·가지치기, [연관 규칙](/Hongs_Blog/studies/data-science/association-rules/)의 신뢰도.

"거래 목록과 최소 지지도가 주어지고 빈발 항목 집합을 모두 찾으라"는 문제는 늘 같은 하위목표의 반복이다. ① 후보 $$C_k$$ 세기 ② min_sup 미만 버려 $$L_k$$ 만들기 ③ $$L_k$$끼리 결합하고 가지치기해 $$C_{k+1}$$ 만들기. $$C_{k+1}$$이 비면 멈춘다. 규칙까지 물으면 ④ 가장 긴 빈발 집합의 부분집합마다 신뢰도를 계산한다.

## 문제 1 · 완전한 풀이

거래 10: A, C, D / 20: B, C, E / 30: A, B, C, E / 40: B, E. 최소 지지 개수 2. 빈발 항목 집합을 모두 찾으라[^1].

1. *$$C_1$$ 세기:* A 2, B 3, C 3, D 1, E 3.
2. *$$L_1$$:* D를 버려 {A, B, C, E}.
3. *$$C_2$$ 만들기:* 크기 1은 앞 0개가 같으면 모두 이으므로 AB, AC, AE, BC, BE, CE.
4. *$$C_2$$ 세기와 $$L_2$$:* AB 1, AC 2, AE 1, BC 2, BE 3, CE 2 → $$L_2$$ = {AC, BC, BE, CE}.
5. *$$C_3$$ 만들기:* 앞 1개가 같은 짝은 BC + BE → BCE뿐. 부분집합 BC, BE, CE가 모두 $$L_2$$에 있어 남는다.
6. *$$C_3$$ 세기와 $$L_3$$:* BCE는 거래 20, 30에 들어 2 → $$L_3$$ = {BCE}. 이을 짝이 없어 멈춘다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [13_apriori_impl.py](/Hongs_Blog/studies/data-science/code/13_apriori_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

거래 ABC, AB, AC, BC, ABCD. 최소 지지 개수 3[^s1].

1. *$$C_1$$ 세기:* A 4, B 4, C 4, D 1.
2. *$$L_1$$:* {A, B, C}.
3. *$$C_2$$ 만들기:* AB, AC, BC.
4. *$$C_2$$ 세기와 $$L_2$$:* AB 3, AC 3, BC 3 → 모두 빈발.
5. *$$C_3$$ 만들기:* AB + AC → ABC. 부분집합 AB, AC, BC가 모두 $$L_2$$에 있어 남는다.
6. *$$C_3$$ 세기와 $$L_3$$:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

ABC는 거래 ABC와 ABCD에만 들어 지지 개수 2다. 3에 못 미쳐 $$L_3$$은 비고, 여기서 멈춘다. 빈발 항목 집합은 A, B, C, AB, AC, BC의 6개다. 부분집합이 모두 빈발이어도 자신은 빈발이 아닐 수 있다는 예다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

3-1 슬라이드 p.24 연습 1. 거래 10: A, B, E / 20: A, B, D / 30: B, C / 40: B, D / 50: A, C / 60: B, C / 70: A, C / 80: A, B, C, E / 90: A, B, C. 최소 지지 개수 2, 최소 신뢰도 50%. 빈발 항목 집합을 찾고, 가장 긴 빈발 집합에서 규칙을 만들라[^2].

1. *$$C_1$$ 세기와 $$L_1$$:* A 6, B 7, C 6, D 2, E 2. 모두 빈발.
2. *$$C_2$$ 세기와 $$L_2$$:* ______
3. *$$C_3$$ 만들기:* ______
4. *$$C_3$$ 세기와 $$L_3$$:* ABC 2, ABE 2. $$C_4$$의 후보 ABCE는 부분집합 ACE, BCE가 $$L_3$$에 없어 버려지고 멈춘다.
5. *규칙:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$C_2$$ 10개를 세면 AB 4, AC 4, AD 1, AE 2, BC 4, BD 2, BE 2, CD 0, CE 1, DE 0. $$L_2$$ = {AB, AC, AE, BC, BD, BE}.
3. 앞 1개가 같은 짝: AB + AC → ABC, AB + AE → ABE, AC + AE → ACE, BC + BD → BCD, BC + BE → BCE, BD + BE → BDE. 가지치기: ACE(CE 없음), BCD(CD 없음), BCE(CE 없음), BDE(DE 없음)를 버린다. $$C_3$$ = {ABC, ABE}.
5. ABC에서: A → BC 33%, B → AC 28.6%, C → AB 33%, AB → C 50%, AC → B 50%, BC → A 50%. ABE에서: A → BE 33%, B → AE 28.6%, E → AB 100%, AB → E 50%, AE → B 100%, BE → A 100%. 50% 이상인 9개가 강한 규칙이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [13_apriori-ladder_p4.py](/Hongs_Blog/studies/data-science/code/13_apriori-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

영수증 5장: ① 맥주, 견과, 기저귀 ② 맥주, 커피, 기저귀 ③ 맥주, 기저귀, 달걀 ④ 견과, 달걀, 우유 ⑤ 견과, 커피, 기저귀, 달걀, 우유. 최소 지지 개수 2로 빈발 항목 집합을 모두 찾고, 가장 긴 빈발 집합에서 신뢰도 60% 이상인 규칙을 쓰라[^3].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$L_1$$: 맥주 3, 견과 3, 기저귀 4, 달걀 3, 커피 2, 우유 2 (모두 빈발).<br>
$$L_2$$: 맥주·기저귀 3, 커피·기저귀 2, 기저귀·달걀 2, 기저귀·견과 2, 달걀·우유 2, 달걀·견과 2, 우유·견과 2.<br>
$$C_3$$: 기저귀·달걀·견과(지지 1, 탈락), 달걀·우유·견과(지지 2). 맥주·기저귀처럼 이을 짝이 없는 것은 후보를 만들지 않는다.<br>
$$L_3$$ = {달걀, 우유, 견과}:2. 더 이을 짝이 없어 멈춘다.<br>
규칙: 우유 → 달걀·견과 100%, 달걀·우유 → 견과 100%, 달걀·견과 → 우유 100%, 우유·견과 → 달걀 100%, 달걀 → 우유·견과 66.7%, 견과 → 달걀·우유 66.7%. 여섯 개 모두 60% 이상이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [13_apriori-ladder_p4.py](/Hongs_Blog/studies/data-science/code/13_apriori-ladder_p4/)</div>

</div>


[^1]: 데이터 과학 3회 강의 자료 「3-1_FP」, p.20
[^2]: 같은 자료, p.24. 풀이는 데이터 과학 3회 강의 자료 「3-4-solutions」, p.1~2
[^3]: 거래는 데이터 과학 3회 강의 자료 「3-1_FP」, p.7의 자료다
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 문제 2와 문제 4의 물음(최소 지지 개수 2, 신뢰도 60%)은 원본에 없다. 답은 문제 코드로 확인했다.
{% endraw %}
