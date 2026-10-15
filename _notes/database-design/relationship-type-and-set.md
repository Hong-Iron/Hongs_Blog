---
layout: "note"
title: "관계 타입과 관계 집합"
display_title: "관계 타입과 관계 집합 (Relationship Type, Relationship Set)"
kind: "concept"
kind_label: "정의"
num: "22"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-15"
status: "verified"
aliases: ["Relationship Type", "Relationship Set", "관계 인스턴스", "Relationship Instance", "관계의 차수", "Degree of a Relationship Type", "이항 관계", "Binary Relationship", "삼항 관계", "Ternary Relationship"]
description: "\"직원 김씨는 영업부에서 일한다\"는 한 줄은 직원 한 명과 부서 하나를 잇는다. 대상에 틀과 모음이 있었듯이, 이런 줄에도 \"직원과 부서는 '일한다'로 이어진다\"는 틀과, 그런 줄들의 모음이 있다. 줄 하나가 대상 둘을 이을 수도 있고 셋을 한꺼번에 이을 수도 있다. 여기서 말하는…"
prev_url: "/studies/database-design/key-attribute/"
prev_title: "키 속성"
next_url: "/studies/database-design/recursive-relationship/"
next_title: "역할 이름과 재귀 관계"
math: true
mermaid: false
code_count: 1
permalink: "/studies/database-design/relationship-type-and-set/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"직원 김씨는 영업부에서 일한다"는 한 줄은 직원 한 명과 부서 하나를 잇는다. 대상에 틀과 모음이 있었듯이, 이런 줄에도 "직원과 부서는 '일한다'로 이어진다"는 틀과, 그런 줄들의 모음이 있다. 줄 하나가 대상 둘을 이을 수도 있고 셋을 한꺼번에 이을 수도 있다. 여기서 말하는 "관계"는 표를 뜻하는 "릴레이션"과 다른 말이니 섞지 않는다.

</div>


## 예시로 보기

개체만 저장해서는 "이 직원이 어느 부서 사람인가"를 알 수 없다. 직원 목록과 부서 목록이 따로 있을 뿐이다. 둘을 잇는 정보를 따로 적어야 한다.

직원 일곱 명과 부서 셋을 잇는 WORKS_FOR를 표로 적으면 이렇다.

| 줄 | 직원 | 부서 |
|---|---|---|
| $$r_1$$ | $$e_1$$ | $$d_1$$ |
| $$r_2$$ | $$e_2$$ | $$d_2$$ |
| $$r_3$$ | $$e_3$$ | $$d_1$$ |
| $$r_4$$ | $$e_4$$ | $$d_2$$ |
| $$r_5$$ | $$e_5$$ | $$d_3$$ |
| $$r_6$$ | $$e_6$$ | $$d_1$$ |
| $$r_7$$ | $$e_7$$ | $$d_3$$ |

줄 하나하나($$r_1$$, …, $$r_7$$)를 관계 인스턴스라 부른다. $$r_4$$는 "$$e_4$$가 $$d_2$$에서 일한다"는 사실 하나다. 일곱 줄을 모은 것이 관계 집합이고, "EMPLOYEE와 DEPARTMENT를 '일한다'로 잇는다"는 틀이 관계 타입 WORKS_FOR다.

이 관계에 끼는 개체 타입은 몇 개인가? EMPLOYEE와 DEPARTMENT, 둘이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 인스턴스 7개와 $$r_4 = (e_4, d_2)$$, 가능한 짝 21개 가운데 7개가 들어 있는 것, $$d_1$$에서 일하는 직원이 $$e_1, e_3, e_6$$인 것, 차수 2와 3 — [22_relationship-type-and-set_verify.py](/Hongs_Blog/studies/database-design/code/22_relationship-type-and-set_verify/)</div>

</div>


## 정의

- **관계 타입(relationship type):** 참여하는 개체 타입들 사이의 이어짐들의 모음(관계 집합)을 정하는 틀.
- **관계 집합(relationship set):** 관계 인스턴스들의 집합.
- **관계 인스턴스(relationship instance):** 개체 $$n$$개를 하나로 묶은 것. 묶인 개체는 참여하는 개체 집합에서 하나씩 온다.

기호로 쓰면, 참여하는 개체 집합을 $$E_1, E_2, \dots, E_n$$이라 할 때 관계 인스턴스 $$r_i$$는 개체 $$n$$개의 묶음이다.

$$r_i = (e_1, e_2, \dots, e_n), \qquad e_j \in E_j \quad (j = 1, \dots, n)$$


$$e_j \in E_j$$는 "$$j$$번째 자리의 개체는 $$j$$번째 개체 집합에 들어 있다"로 읽는다. 관계 집합 $$R$$은 이런 묶음들의 집합이므로, 가능한 모든 묶음의 집합 $$E_1 \times E_2 \times \cdots \times E_n$$의 부분집합이다[^s1].

$$R \subseteq E_1 \times E_2 \times \cdots \times E_n$$


위 예에서는 직원 7명과 부서 3개로 만들 수 있는 짝이 $$7 \times 3 = 21$$개이고, WORKS_FOR에는 그 가운데 7개가 들어 있다.

**차수(degree).** 관계 타입에 참여하는 개체 타입의 수다. 인스턴스 하나가 잇는 개체의 수와 같다.

| 차수 | 이름 | 예 | 인스턴스 하나의 모양 |
|---|---|---|---|
| 2 | 이항 관계(binary) | WORKS_FOR: EMPLOYEE, DEPARTMENT | (직원, 부서) |
| 3 | 삼항 관계(ternary) | SUPPLY: SUPPLIER, PART, PROJECT | (공급자, 부품, 프로젝트) |

SUPPLY의 인스턴스 하나는 "어느 공급자가 어느 부품을 어느 프로젝트에 댄다"는 사실 하나다. 관계 타입의 차수는 몇이든 될 수 있다. 이 문서 모음에서 다루는 것은 거의 다 이항이다.

## 활용

- ER 다이어그램에서 관계 타입은 마름모로 그리고, 참여하는 개체 타입의 네모와 선으로 잇는다: [ER 다이어그램 표기법](/Hongs_Blog/studies/database-design/er-diagram-notation/)
- 개체 타입과 마찬가지로 다이어그램에는 관계 타입만 그린다. 인스턴스($$r_1$$, $$r_2$$, …)는 그리지 않는다.
- 관계 타입마다 "한 개체가 인스턴스 몇 개에 낄 수 있는가"를 정한다: [카디널리티 비율](/Hongs_Blog/studies/database-design/cardinality-ratio/), [참여 제약](/Hongs_Blog/studies/database-design/participation-constraint/)
- 요구사항에서 관계 타입을 찾아내는 법: 한 개체의 속성 값이 다른 개체를 가리키면 그 속성이 관계다: [ER 설계 절차](/Hongs_Blog/studies/database-design/er-design-steps/)

## 연결

- 관계 집합은 개체 집합 $$E_1, E_2, \dots, E_n$$ 위의 관계(relation)다. 이산수학에서 배운, 곱집합의 부분집합으로서의 관계다: [관계와 그 성질](/Hongs_Blog/studies/discrete-math/relations/)
- 같은 개체 타입이 두 번 끼는 관계 타입: [역할 이름과 재귀 관계](/Hongs_Blog/studies/database-design/recursive-relationship/)
- 관계 타입에도 속성이 붙는다: [관계 타입의 속성](/Hongs_Blog/studies/database-design/relationship-attributes/)
- 표로 옮기는 법은 비율에 따라 다르다: [일대다 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-one-to-many-relationship/), [다대다·n항 관계 타입의 사상](/Hongs_Blog/studies/database-design/mapping-many-to-many-relationship/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 관계 타입, 관계 집합, 관계 인스턴스의 뜻을 쓰고, 개체 쪽의 어떤 낱말과 짝이 되는지 쓰라.</summary>

**답:** 관계 인스턴스는 참여하는 개체 집합에서 하나씩 뽑은 개체들의 묶음 하나다(개체와 짝). 관계 집합은 그런 인스턴스들의 집합이다(개체 집합과 짝). 관계 타입은 어떤 개체 타입들이 참여하는지를 정한 틀이다(개체 타입과 짝).<br>
**이유:** 틀과 모음을 가르는 방식이 개체와 같다. 다이어그램에 그리는 것은 틀(타입)뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 데이터베이스 설계를 배우다 보면 "관계"로 옮길 수 있는 말이 셋 나온다. ER의 relationship type, 관계형 모델의 relation, 이산수학의 relation. 셋을 가르라. `WORKS_ON(Essn, Pno, Hours)`와 "EMPLOYEE와 PROJECT 사이의 마름모 WORKS_ON"은 각각 어느 것인가?</summary>

**답:** ① ER의 관계 타입(relationship type)은 개체 타입들을 잇는 틀이고 다이어그램의 마름모다. ② 관계형 모델의 릴레이션(relation)은 표다. 개체를 담는 표도 릴레이션이다. ③ 이산수학의 관계(relation)는 곱집합의 부분집합이다. `WORKS_ON(Essn, Pno, Hours)`는 ②(표), 마름모 WORKS_ON은 ①이다.<br>
**이유:** 영어로는 relationship과 relation으로 낱말이 다르다. 이 문서 모음은 ①을 "관계 타입", ②를 "릴레이션"으로 적어 가른다. ③은 ①과 ② 둘 다의 바탕이다. 관계 집합도, 릴레이션에 든 행들도 곱집합의 부분집합이다. 흔한 오답은 "릴레이션은 관계 타입을 표로 옮긴 것"이라고만 보는 것이다. EMPLOYEE 표처럼 개체 타입을 옮긴 것도 릴레이션이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위 WORKS_FOR 표를 보고 답하라. (a) $$d_1$$에서 일하는 직원을 모두 쓰라. (b) 관계 집합을 짝의 집합으로 쓰라. (c) $$(e_1, d_2)$$는 관계 집합에 들어 있는가? 곱집합 $$E \times D$$에는?</summary>

**답:** (a) $$e_1, e_3, e_6$$. (b) $$\{(e_1, d_1), (e_2, d_2), (e_3, d_1), (e_4, d_2), (e_5, d_3), (e_6, d_1), (e_7, d_3)\}$$. (c) 관계 집합에는 없다. 곱집합에는 있다.<br>
**이유:** 곱집합은 만들 수 있는 모든 짝 21개이고, 관계 집합은 그 가운데 실제로 맞는 짝 7개다. 관계 집합은 곱집합의 부분집합이다.

</details>


[^s1]: 부분집합 식 $$R \subseteq E_1 \times \cdots \times E_n$$과 짝의 수 21은 그 말을 풀어 쓴 것이고, 검증 코드로 확인했다.
{% endraw %}
