---
layout: "note"
title: "타입 검사 절차"
display_title: "타입 검사 절차 (Type Checking Procedure)"
kind: "concept"
kind_label: "알고리즘"
num: "36"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
aliases: ["Type Checking Procedure", "Implementation of Type Checking", "Well-formedness Rules", "WF 규칙", "의미에 맞게 짜인 문장", "Semantically Well-formed Statement", "타입 검사기", "Type Checker"]
description: "조립 설명서를 검수할 때 작은 부품부터 확인하고, 그 부품들로 만든 덩어리를 확인하고, 마지막에 전체를 확인하는 것과 같다. 컴파일러는 프로그램을 나무 모양으로 펼쳐 놓고 잎에서 뿌리로 올라가며 식에는 \"정수\", \"참·거짓\" 같은 값의 종류(타입)를, 문장에는 \"의미에 맞게 짜였다…"
prev_url: "/studies/compilers/type-inference-rules/"
prev_title: "타입 추론 규칙"
next_url: "/studies/compilers/three-address-code/"
next_title: "3주소 코드"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/type-checking-procedure/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

조립 설명서를 검수할 때 작은 부품부터 확인하고, 그 부품들로 만든 덩어리를 확인하고, 마지막에 전체를 확인하는 것과 같다. 컴파일러는 프로그램을 나무 모양으로 펼쳐 놓고 잎에서 뿌리로 올라가며 식에는 "정수", "참·거짓" 같은 값의 종류(타입)를, 문장에는 "의미에 맞게 짜였다"는 도장을 붙인다. 한 군데라도 붙일 수 없으면 오류로 알린다. 다만 변수의 타입을 찾아볼 표가 먼저 있어야 하므로, 이름이 제대로 선언됐는지 보는 검사를 반드시 먼저 끝낸다.

</div>


## 예시로 보기

[타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/)은 `a + 1` 같은 식의 타입만 정한다. 그런데 프로그램은 식이 아니라 문장으로 되어 있다. `a = a + 1;`이나 `while (…) { … }`에는 타입이 없다. 문장에 대해서는 "의미에 맞게 짜였는가"를 묻는다[^1].

다음 코드를 검사한다. 스코프 검사가 끝난 뒤 심벌 테이블에는 `a : int`, `b : int`가 있다[^2].

```c
while (a != b) {
    a = a + 1;
}
```

추상 구문 트리의 노드에 붙는 것과 붙는 순서(동그라미 번호)는 이렇다[^3].

```
while                : WF   ⑪
├─ cond              : bool ④
│   └─ !=            : bool ③
│       ├─ id a      : int  ①  ← 심벌 테이블에서
│       └─ id b      : int  ②  ← 심벌 테이블에서
└─ block             : WF   ⑩
    └─ =             : WF   ⑨
        ├─ id a      : int  ⑤  ← 심벌 테이블에서
        └─ +         : int  ⑧
            ├─ id a  : int  ⑥  ← 심벌 테이블에서
            └─ num 1 : int  ⑦
```

| 순서 | 노드 | 쓰는 규칙 | 붙는 것 |
|---|---|---|---|
| ①② | `a`, `b` | 변수 규칙(심벌 테이블에서 찾는다) | int, int |
| ③④ | `a != b` | 비교 규칙: 양쪽이 같은 타입 | bool |
| ⑤⑥ | `a`, `a` | 변수 규칙 | int, int |
| ⑦ | `1` | 상수 규칙 | int |
| ⑧ | `a + 1` | 덧셈 규칙: 양쪽이 int | int |
| ⑨ | `a = a + 1` | 대입의 WF 규칙: 왼쪽이 변수, 양쪽이 같은 타입 | WF |
| ⑩ | 블록 | 문장 묶음의 WF 규칙: 안의 문장이 모두 WF | WF |
| ⑪ | `while` | while의 WF 규칙: 조건이 bool, 안쪽 문장들이 WF | WF |

자식이 모두 끝나야 부모를 볼 수 있다. ③은 ①②의 결과를, ⑧은 ⑥⑦의 결과를, ⑪은 ④와 ⑩의 결과를 가정으로 쓴다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 열한 단계의 순서와 붙는 값, `if (A && B) { var = 3; }`의 순서, `compare` 함수의 return 검사, 틀린 식과 문장 스무 가지를 걸러냄, 카드의 답 — [36_type-checking-procedure_impl.py](/Hongs_Blog/studies/compilers/code/36_type-checking-procedure_impl/)</div>

</div>


## 정의

### 문장의 규칙: WF

식의 규칙을 문장으로 넓힌다. 다음을 새로 적는다[^4].

$$S \vdash WF(stmt)$$


"스코프 $$S$$ 안에서 문장 $$stmt$$가 의미에 맞게 짜였다(semantically well-formed)고 추론할 수 있다"로 읽는다. $$WF$$는 well-formed의 머리글자다. 의미에 맞게 짜인 문장의 예는 `int a = 3;`, `bool well_formed = true;`, `string s = "this is well-formed";`, 그리고 안의 문장이 모두 의미에 맞게 짜인 `while (1 > 0) { … }`와 `if (10 == 10) { … } else { … }`다[^1].

**대입문.** 왼쪽 $$e_1$$이 변수이고, 양쪽의 타입이 같은 $$T$$이면 대입문은 WF다[^4].

$$\frac{S \vdash e_1\text{은 변수} \qquad S \vdash e_2\text{는 변수 또는 상수} \qquad S \vdash e_1 : T \qquad S \vdash e_2 : T}{S \vdash WF(e_1 = e_2;)}$$


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.24의 대입 규칙에는 가정 "$$S \vdash e_2$$ is a variable or constant"가 있다. p.35에서 `a = a + 1`에 쓰는 대입 규칙에는 그 가정이 없고 "$$e_1$$ is a variable, $$e_1 : T$$, $$e_2 : T$$" 셋뿐이다. / 문제점: p.24의 규칙을 그대로 쓰면 오른쪽이 식 `a + 1`(변수도 상수도 아니다)인 `a = a + 1;`이 WF가 아니게 되어, 같은 강의의 p.35~37 결론(WF)과 어긋난다. / 수정안: 대입 규칙은 p.35의 꼴 $$\dfrac{S \vdash e_1\text{은 변수} \quad S \vdash e_1 : T \quad S \vdash e_2 : T}{S \vdash WF(e_1 = e_2)}$$로 쓴다. 오른쪽은 타입이 $$T$$인 아무 식이면 된다. / 근거: 두 규칙을 각각 구현해 `a = 3;`과 `a = a + 1;`에 대 보면 p.24 꼴은 뒤의 것을 떨어뜨린다(36_type-checking-procedure_impl.py).

</div>


**return 문.** 지금 스코프가 타입 $$T$$를 돌려주는 함수 안이고 $$e$$의 타입이 $$T$$이면 `return e;`는 WF다. 아무것도 돌려주지 않는 함수(void) 안이면 `return;`이 WF다[^4].

$$\frac{S\text{는 타입 }T\text{를 돌려주는 함수 안에 있다} \qquad S \vdash e : T}{S \vdash WF(return\ e;)} \qquad \frac{S\text{는 void를 돌려주는 함수 안에 있다}}{S \vdash WF(return;)}$$


**문장 묶음.** 문장 하나하나가 WF이면 묶음도 WF다[^5].

$$\frac{S \vdash WF(stmt_1) \qquad S \vdash WF(stmt_2) \quad \cdots \quad S \vdash WF(stmt_n)}{S \vdash WF(stmt_1\ stmt_2\ \cdots\ stmt_n)}$$


**while 문.** 조건 $$e$$가 bool이고, 반복문 안쪽 스코프 $$S'$$에서 안의 문장들이 WF이면 while 문은 WF다. $$S'$$은 "에스 프라임"으로 읽고, 중괄호 안에서 새로 열리는 스코프다[^5].

$$\frac{S \vdash e : bool \qquad S'\text{은 while 안쪽의 스코프} \qquad S' \vdash WF(stmt_1\ stmt_2\ \cdots\ stmt_n)}{S \vdash WF(while(e)\{stmt_1\ stmt_2\ \cdots\ stmt_n\})}$$


**if-else 문.** 슬라이드는 이 규칙을 질문으로 남겼다[^5]. while 규칙과 같은 꼴로 쓰면 이렇다[^s1]. 조건이 bool이고, 두 블록이 각자 자기 안쪽 스코프 $$S'$$, $$S''$$에서 WF이면 전체가 WF다.

$$\frac{S \vdash e : bool \qquad S'\text{은 if 블록 안쪽의 스코프} \qquad S' \vdash WF(stmts_1) \qquad S''\text{은 else 블록 안쪽의 스코프} \qquad S'' \vdash WF(stmts_2)}{S \vdash WF(if(e)\{stmts_1\}\ else\ \{stmts_2\})}$$


두 블록의 스코프를 따로 두는 까닭은, if 블록에서 선언한 변수가 else 블록에서 보이지 않기 때문이다.

### 절차

입력은 추상 구문 트리이고, 출력은 "모든 문장이 WF다" 또는 타입 오류다. 먼저 스코프 검사를 한다. 그다음 문장마다 세 가지를 이 순서로 한다[^6].

1. 그 문장에 든 부분식의 타입을 검사한다.
2. 그 문장의 자식 문장을 검사한다.
3. 문장 전체가 WF인지 확인한다.

```
검사(문장 s, 스코프 S):
    s에 든 식 e마다:  타입(e, S)                     # 1. 부분식
    s에 든 자식 문장 c마다:  검사(c, c가 놓인 스코프)   # 2. 자식 문장
    s의 종류에 맞는 WF 규칙의 가정이 모두 채워졌으면 WF, 아니면 타입 오류   # 3. 전체

타입(식 e, 스코프 S):
    e가 상수면:  모양에 맞는 타입을 돌려준다
    e가 변수면:  S의 심벌 테이블에서 찾은 타입을 돌려준다
    그 밖이면:   자식 식마다 타입(자식, S)을 먼저 구한다
                 가정이 채워지는 추론 규칙이 있으면 그 결론의 타입을 돌려준다. 없으면 타입 오류
```

`if (A && B) { var = 3; }`에 대면 순서는 이렇다[^6].

1. 부분식 `A && B`의 타입을 검사한다.
2. 자식 문장 `var = 3;`을 검사한다. 그 안에서 부분식 `var`와 `3`의 타입을 검사하고, `var = 3;`이 WF인지 본다.
3. `if (A && B) { var = 3; }` 전체가 WF인지 본다.

트리의 노드를 한 번씩만 지나므로 걸리는 시간은 노드 수에 비례한다. 변수 노드에서는 심벌 테이블을 한 번 찾는다[^s2].

## 예제

**return 문.** 슬라이드가 문제로 남긴 함수다[^7].

```c
bool compare (int a, int b) {
    return a >= b;
}
```

심벌 테이블에는 전역에 `compare : bool`(반환 타입), 함수 안쪽에 `a : int`, `b : int`가 있다. 검사는 이렇게 간다[^s3].

1. *부분식의 잎.* `a`와 `b`를 심벌 테이블에서 찾는다. 둘 다 int.
2. *부분식.* `a >= b`는 양쪽이 같은 원시 타입 int라 비교 규칙으로 bool.
3. *문장 전체.* 지금 스코프는 bool을 돌려주는 함수 `compare` 안이다. $$e$$의 타입 bool이 그 $$T$$와 같다. return 규칙의 두 가정이 채워져 $$S \vdash WF(return\ a >= b;)$$.

반환 타입만 `int compare(…)`로 바꾸면 3단계에서 $$T$$는 int인데 $$e$$는 bool이라 가정 $$S \vdash e : T$$가 깨진다. 타입 오류다.

**조건이 bool이 아니면.** `while (a) { a = a + 1; }`에서 a가 int면 while 규칙의 첫 가정 $$S \vdash e : bool$$이 깨진다. 안쪽 문장이 모두 WF여도 전체는 WF가 아니다[^s3].

## 활용

- 구현: [36_type-checking-procedure_impl.py](/Hongs_Blog/studies/compilers/code/36_type-checking-procedure_impl/). 연습: [타입 검사 연습](/Hongs_Blog/studies/compilers/type-checking-practice/)
- 검사를 통과한 트리는 다음 단계에서 [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)로 바뀐다. 타입 검사와 코드 만들기는 둘 다 트리를 자식 먼저 도는 같은 순서를 쓴다([AST에서 3주소 코드 만들기](/Hongs_Blog/studies/compilers/ast-to-tac/)).
- 이 절차는 타입을 알아서 바꿔 주지 않는다. `s = d + n;`(d는 double, n은 int)은 덧셈에서 걸린다. 1회 강의 그림의 `inttofloat` 끼워 넣기는 이 강의의 규칙 밖이다([타입과 타입 시스템](/Hongs_Blog/studies/compilers/type-system/)).
- 흔한 실수: 스코프 검사 없이 시작한다(변수의 타입을 찾을 표가 없다). 부모를 자식보다 먼저 본다. while 안쪽 문장을 바깥 스코프 $$S$$에서 검사한다. 안쪽에서 선언한 변수는 $$S'$$에만 있다.

## 연결

- 선수: [타입 추론 규칙](/Hongs_Blog/studies/compilers/type-inference-rules/), [심벌 테이블과 스코프 검사](/Hongs_Blog/studies/compilers/symbol-table-scope-checking/), [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)
- 자식을 다 본 뒤 부모를 보는 순서는 후위 순회다: [트리 순회와 이진 탐색 트리](/Hongs_Blog/studies/algorithms/tree-traversal-bst/)
- 다음 단계: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 심벌 테이블에 `i : int`, `n : int`가 있다. `while (i <= n) { i = i + 1; }`의 트리에서 타입이나 WF가 붙는 순서를 노드 이름으로 쓰라.</summary>

**답:** `i`(int) → `n`(int) → `<=`(bool) → 조건(bool) → 대입 왼쪽 `i`(int) → 덧셈 왼쪽 `i`(int) → `1`(int) → `+`(int) → `=`(WF) → 블록(WF) → `while`(WF). 모두 11번이다.<br>
**이유:** 자식이 끝나야 부모에 붙일 수 있다. 흔한 오답은 `while`부터 붙이는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 의사코드의 `검사`가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 문장 하나를 받아, 그 안의 식들에 타입을 붙이고 자식 문장들을 먼저 검사한 뒤, 그 결과가 문장 종류에 맞는 WF 규칙의 가정을 모두 채우는지 보고 WF 또는 타입 오류를 낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** if-else 문의 WF 규칙을 가로선 꼴로 쓰라. 스코프를 몇 개 쓰는가?</summary>

**답:** $$\dfrac{S \vdash e : bool \quad S' \vdash WF(stmts_1) \quad S'' \vdash WF(stmts_2)}{S \vdash WF(if(e)\{stmts_1\}\ else\ \{stmts_2\})}$$. 여기서 $$S'$$은 if 블록 안쪽, $$S''$$은 else 블록 안쪽의 스코프다. 스코프는 셋이다. 조건은 바깥 $$S$$에서, 두 블록은 각자 자기 스코프에서 본다.<br>
**이유:** 두 블록에 같은 스코프를 쓰면 if 블록에서 선언한 변수를 else 블록에서 쓸 수 있다는 뜻이 되어 스코프 규칙과 어긋난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 타입 검사 전에 스코프 검사를 먼저 끝내야 하는 이유는?</summary>

**답:** 변수 규칙의 가정 "x는 스코프 $$S$$에서 타입 $$T$$로 선언되어 있다"는 심벌 테이블을 찾아서 확인한다. 그 표를 만드는 것이 스코프 검사다. 표가 없으면 변수가 든 식은 하나도 타입을 정할 수 없다.

</details>


[^1]: 컴파일러 10회 강의 자료 「Lecture10 Semantic analysis part 2」, p.23 (Problem #2: statements, 의미에 맞게 짜인 문장의 예)
[^2]: 같은 자료, p.28 (코드, AST, 스코프 검사 뒤의 심벌 테이블)
[^3]: 같은 자료, p.29~37 (a != b, a = a + 1, 전체 순서로 타입과 WF를 붙여 가는 그림)
[^4]: 같은 자료, p.24 (S ⊢ WF(stmt), 대입문과 return 문의 규칙)
[^5]: 같은 자료, p.25 (문장 묶음과 while의 규칙, "Q. for if-else statements")
[^6]: 같은 자료, p.27, p.40 (스코프 검사 먼저, 문장마다 세 가지, if (A && B) { var = 3; }의 순서)
[^7]: 같은 자료, p.38 (compare 함수의 AST와 심벌 테이블)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> if-else의 WF 규칙은 원본에 없다. 슬라이드가 질문으로 남긴 것을 p.25의 while 규칙에 맞춰 적었다. 두 블록의 스코프가 따로라는 점은 9회 강의의 블록 스코프 규칙을 따랐고, 구현으로 확인했다(두 블록에서 같은 이름을 따로 선언해도 통과, 한쪽 블록만 틀려도 전체가 오류).
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 의사코드와 시간에 대한 설명은 원본에 없다. p.27의 세 단계와 p.28의 "Recursively walk abstract syntax trees"를 코드 꼴로 옮겼다. 조립 설명서 비유도 원본에 없다. 실제 검사는 부품이 아니라 "부품에 붙은 꼬리표"만 본다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> compare 예의 풀이, 반환 타입을 바꾼 경우, `while (a)` 예, 카드 C1·C3은 원본에 없다. 슬라이드는 p.38에서 AST와 심벌 테이블만 주고 풀이를 남겼다. p.18의 비교 규칙과 p.24의 return 규칙을 대었고 구현으로 확인했다.
{% endraw %}
