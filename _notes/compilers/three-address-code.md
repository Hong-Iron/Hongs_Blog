---
layout: "note"
title: "3주소 코드"
display_title: "3주소 코드 (Three Address Code)"
kind: "concept"
kind_label: "정의"
num: "37"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Three Address Code", "TAC", "Three-address Code", "3-주소 코드", "중간 코드", "Intermediate Code", "중간 표현", "Intermediate Representation", "IR", "임시 변수", "Temporary Variable", "중간 코드 생성기", "Intermediate Code Generator"]
description: "긴 계산을 암산하지 않고 \"먼저 이것을 곱해 메모지 1번에 적고, 그 값에 이것을 더해 2번에 적고…\" 하는 식으로 한 번에 계산 하나씩만 하도록 풀어 쓴 코드다. 한 줄에는 이름이나 숫자가 많아야 세 개만 나온다. 조건문과 반복문은 \"이 줄로 건너뛰어라\"로 풀어 쓴다. 이렇게 풀…"
prev_url: "/studies/compilers/type-checking-procedure/"
prev_title: "타입 검사 절차"
next_url: "/studies/compilers/quadruples/"
next_title: "쿼드러플"
math: true
mermaid: true
code_count: 1
code_files: [{"t": "37_three-address-code_verify.py", "u": "/studies/compilers/code/37_three-address-code_verify/", "r": "검증"}]
permalink: "/studies/compilers/three-address-code/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

긴 계산을 암산하지 않고 "먼저 이것을 곱해 메모지 1번에 적고, 그 값에 이것을 더해 2번에 적고…" 하는 식으로 한 번에 계산 하나씩만 하도록 풀어 쓴 코드다. 한 줄에는 이름이나 숫자가 많아야 세 개만 나온다. 조건문과 반복문은 "이 줄로 건너뛰어라"로 풀어 쓴다. 이렇게 풀어 두면 쓸데없는 계산을 찾아 없애기 쉽고 기계어로 옮기기도 쉽다. 대신 줄 수가 늘고, 메모지 노릇을 하는 변수가 잔뜩 생긴다.

</div>


## 예시로 보기

컴파일러 앞쪽 단계가 만든 추상 구문 트리는 나무 모양이라 사람이 보기에는 좋지만, 기계는 명령을 한 줄씩 차례로 실행한다. 나무를 줄로 펴 놓은 것이 필요하다. `A + A * B - 1`의 트리와 그것을 편 코드는 이렇다.

```
        -   → t2
       / \
 t1 ← +   num 1
     / \
  id A   *  → t0
        / \
     id A   id B
```

```
t0 = A * B
t1 = A + t0
t2 = t1 - 1
```

트리의 연산자 노드 하나가 코드 한 줄이 된다. `*` 노드의 결과를 담을 곳이 필요해서 `t0`라는 이름을 새로 만들었다. `+` 노드는 그 `t0`를 받아 쓰고 결과를 `t1`에 둔다. 가장 깊은 곳의 계산이 맨 먼저 나온다.

A = 2, B = 3이면 t0 = 6, t1 = 8, t2 = 7이다. 식을 그대로 계산한 $$2 + 2 \times 3 - 1 = 7$$과 같다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 세 줄을 A, B가 −5~5인 모든 경우에 실행, 아래 if-else 예와 while 예를 원래 코드와 견줌(x, y가 −6~6), for 연습의 답 실행(b[0..9] = 1..10), 모든 줄의 주소가 셋 이하, 카드 C3의 값 — [37_three-address-code_verify.py](/Hongs_Blog/studies/compilers/code/37_three-address-code_verify/)</div>

</div>


## 정의

3주소 코드(TAC)는 연산 하나가 피연산자를 많아야 세 개 갖는, 높은 수준의 어셈블리다. 추상 구문 트리를 한 줄로 편(linearized) 표현이기도 하다. `t2 = t1 - 1`에서 세 개는 `t2`, `t1`, `1`이다. 계산에 쓰는 둘과 결과를 받는 하나다.

**구성 요소.** 한 줄은 피연산자와 연산자로 이루어진다.

- 피연산자(= 주소, address). 세 종류다.
    - 프로그램에 원래 있던 변수(explicit variable): `A`, `B`, `C`
    - 상수: `1`
    - 임시 변수(temporary variable): `t0`, `t1`, `t2`. 중간 계산 결과를 잠깐 담으려고 컴파일러가 만든 이름이다.
- 연산자(= 명령, instruction): `*`, `+`, `-`, `=`

"주소"는 메모리 번지가 아니라 한 줄에 나오는 이름이나 값의 자리를 가리키는 말이다.

**변수에 값을 넣는 줄.** 왼쪽에는 원래 변수나 임시 변수가 오고, 오른쪽의 피연산자 자리에는 세 종류 중 아무것이나 온다.

| 종류 | 꼴 | 예 |
|---|---|---|
| 복사 | 변수 = 피연산자 | `A = 1`, `t0 = 2`, `t0 = A`, `A = t0` |
| 이항 연산 | 변수 = 피연산자 연산자 피연산자 | `A = B + C`, `A = 1 * 2`, `t0 = A \|\| 1`, `A = t0 <= 0` |
| 단항 연산 | 변수 = 연산자 피연산자 | `t0 = -2`, `t0 = !true` |

이항 연산자는 산술(`+`, `-`, `*`, `/`, `%`), 불(`&&`, <code>&#124;&#124;</code>), 비교(`==`, `!=`, `<`, `>`, `<=`, `>=`)다. 단항 연산자는 `-`와 `!`다.

**흐름을 바꾸는 줄.** 레이블은 코드의 한 자리에 붙인 이름이다. `L0:`처럼 적는다.

| 종류 | 꼴 | 뜻 |
|---|---|---|
| 무조건 점프 | `goto Ln` | 레이블 `Ln:`이 붙은 줄로 간다 |
| 조건 분기 | `if x goto Ln` | x가 참이면 `Ln`으로 가고, 아니면 다음 줄로 간다 |
| 조건 분기 | `ifnot x goto Ln` | x가 거짓이면 `Ln`으로 가고, 아니면 다음 줄로 간다 |

여기서 x는 참이나 거짓 값을 가진 변수다. 조건식을 바로 쓰지 않는다. `x < y`를 먼저 임시 변수에 계산해 두고 그 변수로 분기한다.

**그 밖의 줄**.

| 종류 | 꼴 | 원래 코드 |
|---|---|---|
| 함수 호출 | `param x1` … `param xn` 뒤에 `call foo, n` | `foo(x1, …, xn)` |
| 값을 받는 호출 | `param x1` … `param xn` 뒤에 `y = call foo, n` | `y = foo(x1, …, xn)` |
| 배열에 넣기 | `A[i] = B` | |
| 배열에서 꺼내기 | `A = B[i]` | |
| 돌려주기 | `return x` | |

`param`은 인자를 하나씩 넘기는 줄이고, `call foo, n`의 n은 넘긴 인자의 개수다. 인자가 몇 개든 한 줄의 주소는 셋을 넘지 않는다.

### 설계 이유

소스 코드에서 기계어로 바로 가지 않고 중간 표현을 거치는 까닭은 둘이다.

- **이해하고 고치기 쉽다.** 최적화는 기계어보다 중간 표현에서 하는 편이 훨씬 쉽고 분명하다. 기계어에는 최적화를 막는 제약이 많다.
- **옮기기 쉽다.** 고급 언어 코드보다 기계어에 훨씬 가까운 모양이라 싼 비용으로 기계어로 옮긴다.

컴파일러 하나가 중간 표현을 여러 개 쓰는 일도 흔하다. 표현마다 담고 있는 정보와 성질이 달라서 서로 다른 최적화에 쓸모가 있다. GCC는 소스 코드에서 기계어까지 가는 동안 여섯 가지를 거친다.

```mermaid
flowchart LR
    SRC["소스 코드"] --> AST["AST"] --> GEN["GENERIC"] --> HG["High GIMPLE"] --> SSA["SSA"] --> LG["Low GIMPLE"] --> RTL["RTL"] --> MC["기계어"]
```

이 문서 모음은 그중 대표 둘만 다룬다. 높은 수준의 중간 표현인 [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)와 낮은 수준의 중간 표현인 3주소 코드다. 추상 구문 트리를 받아 3주소 코드를 내는 단계가 중간 코드 생성기다.

## 예제

**if-else.** 조건을 임시 변수에 계산하고, 참이면 `L0`로, 아니면 `L1`로 간다.

```c
if (x == y) {
    x = x + 1;
} else {
    x = x + 2;
}
x = x + 3;
return x;
```

```
t0 = x == y
if t0 goto L0
goto L1
L0:
t0 = x + 1
x = t0
goto L2
L1:
t1 = x + 2
x = t1
L2:
t2 = x + 3
x = t2
return x
```

1. *조건 계산:* `t0 = x == y`.
2. *갈라지기:* 참이면 `L0`, 아니면 바로 다음 줄의 `goto L1`로 간다.
3. *참 쪽 몸통:* `L0:` 아래 두 줄. 끝에 `goto L2`가 있다.
4. *거짓 쪽 몸통:* `L1:` 아래 두 줄. 끝나면 그대로 아래로 흘러 `L2:`에 닿는다.
5. *합류:* `L2:`부터는 어느 쪽에서 왔든 같은 코드다.

`x = x + 1` 한 문장이 `t0 = x + 1`과 `x = t0` 두 줄이 된다. 덧셈 결과를 임시 변수에 받고, 그것을 x에 복사한다. 위 코드는 `L0:` 아래에서 `t0`를 다시 쓴다. 조건을 담았던 `t0`는 분기한 뒤에는 쓰이지 않으므로 덮어써도 결과는 같다.

**while.** 반복문 머리에 레이블을 두고, 조건이 거짓이면 반복문 밖으로 나간다.

```c
while (x < y) {
    x = x + 1;
}
foo(x - 1);
```

```
L0:
t0 = x < y
ifnot t0 goto L1
t1 = x + 1
x = t1
goto L0
L1:
t2 = x - 1
param t2
call foo, 1
```

`foo(x - 1)`은 인자 `x - 1`을 먼저 `t2`에 계산하고, `param t2`로 넘긴 뒤, 인자 한 개로 `foo`를 부른다.

**for 연습.** `for (i = 0; i < 10; i++) { b[i] = i + 1; }`을 옮긴다. for는 "처음 한 번 하는 일 → 조건 → 몸통 → 한 바퀴 끝에 하는 일 → 조건으로 되돌아가기"다. while 꼴에 앞뒤로 한 줄씩 붙인 모양이 된다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```
i = 0
L0:
t0 = i < 10
ifnot t0 goto L1
t1 = i + 1
b[i] = t1
t2 = i + 1
i = t2
goto L0
L1:
```
`i = 0`은 레이블 `L0:`보다 위에 있어 한 번만 실행된다. `i++`는 `t2 = i + 1`과 `i = t2`다. 실행하면 `b[0]`부터 `b[9]`에 1부터 10이 들어가고 i는 10으로 끝난다.

</details>


**3주소 코드인 줄 셋.** `t0 = A * B`, `ifnot t0 goto L1`, `b[i] = t1`.

**아닌 줄 둘.** `t0 = A + B * C`는 오른쪽에 연산이 둘이고 주소가 넷이다. `if x < y goto L0`는 분기 조건 자리에 식이 왔다. 여기서 쓰는 꼴에서는 그 자리에 불 값 변수 하나만 온다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. if-else 예에서 `goto L2`가 참 쪽 몸통 끝에만 있고 거짓 쪽 끝에는 없는 이유는?</summary>

코드는 위에서 아래로 흐른다. 참 쪽 몸통(`L0:` 아래) 바로 다음에는 거짓 쪽 몸통(`L1:`)이 놓여 있다. `goto L2`가 없으면 참 쪽을 끝내고 거짓 쪽까지 실행해 버린다. 거짓 쪽 몸통 바로 다음은 `L2:`라서 그냥 흘러가면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. while 예에서 `L0:`가 `t0 = x < y`보다 위에 있어야 하는 이유는?</summary>

한 바퀴 돌 때마다 조건을 새로 계산해야 한다. 몸통에서 x가 바뀌기 때문이다. `goto L0`가 조건 계산 줄 아래로 돌아가면 `t0`는 첫 바퀴의 값 그대로라, 처음에 참이었으면 끝나지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. while 예에서 `if`가 아니라 `ifnot`을 쓴 이유는?</summary>

조건이 참이면 바로 아래의 몸통으로 흘러가면 되고, 거짓일 때만 멀리(반복문 밖 `L1`) 뛰면 된다. `if`를 쓰면 if-else 예처럼 "참이면 몸통으로 `goto`, 아니면 밖으로 `goto`" 두 줄이 필요하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 표현의 핵심 아이디어는?</summary>

한 줄에 일을 하나만 시킨다. 중첩된 식은 임시 변수로 끊고, 중첩된 제어 구조는 레이블과 점프로 편다. 그러면 모든 줄이 몇 가지 정해진 꼴 중 하나가 되어, 줄 단위로 분석하고 고치기 쉽다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

어셈블리어에서 if와 while을 비교 명령과 점프로 옮기는 것([조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)). Java 컴파일러가 소스를 바로 기계어로 바꾸지 않고 바이트코드로 먼저 바꾸는 것([JVM과 바이트코드](/Hongs_Blog/studies/java/jvm-bytecode/)).

</details>


## 활용

- 3주소 코드를 컴퓨터 안에 담는 자료 구조: [쿼드러플](/Hongs_Blog/studies/compilers/quadruples/)
- 트리에서 자동으로 만드는 법: [AST에서 3주소 코드 만들기](/Hongs_Blog/studies/compilers/ast-to-tac/). 연습: [3주소 코드 변환 연습](/Hongs_Blog/studies/compilers/tac-translation-practice/)
- 만든 코드는 [기본 블록](/Hongs_Blog/studies/compilers/basic-block-cfg/)으로 잘라 [최적화](/Hongs_Blog/studies/compilers/local-optimizations/)한다. 생성기는 최적화를 생각하지 않고 만들기 때문에 같은 계산이나 쓸모없는 임시 변수가 많이 나온다.
- 흔한 실수: `x = x + 1`을 한 줄로 두고 끝낸다(틀리지는 않지만 트리에서 코드를 만드는 규칙은 임시 변수를 거친다). 반복문 끝의 `goto`를 빠뜨린다. 조건 분기 자리에 식을 그대로 쓴다. 레이블 번호나 임시 변수 번호를 겹치게 쓴다.

## 연결

- 선수: [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/), [컴파일러의 구조](/Hongs_Blog/studies/compilers/compiler-structure/)
- 어셈블리어의 `JMP`가 `goto`, 조건 점프가 `if … goto`다: [JMP와 LOOP](/Hongs_Blog/studies/assembly-language/jmp-loop/), [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/). 3주소 코드에는 레지스터가 없고 변수를 얼마든지 쓴다는 점이 다르다.
- `param`과 `call`이 실제 기계에서 어떻게 되는가: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"3주소 코드는 모든 줄에 주소가 꼭 세 개 있어야 한다"</div>

틀렸다. 세 개는 위쪽 한계다. `x = t0`는 둘, `param t2`는 하나, `goto L0`는 변수나 상수가 하나도 없다. 그럴듯해 보이는 이유는 이름에 "3"이 들어 있고 대표 예가 `t0 = A * B`이기 때문이다. 정의는 "많아야 세 개(at most three)"다. 확인하는 법: 위 세 예의 모든 줄에서 변수·상수·임시 변수를 세면 0~3개가 나온다. 반대로 넷 이상인 줄(`t0 = A + B * C`)은 3주소 코드가 아니다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 3주소 코드의 뜻을 쓰고, 피연산자(주소) 세 종류와 흐름을 바꾸는 줄 세 가지를 쓰라.</summary>

**답:** 연산 하나가 피연산자를 많아야 세 개 갖는 높은 수준의 어셈블리이고, 추상 구문 트리를 한 줄로 편 표현이다. 피연산자는 원래 변수, 상수, 임시 변수다. 흐름을 바꾸는 줄은 `goto Ln`, `if x goto Ln`, `ifnot x goto Ln`이다(x는 불 값 변수).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 소스 코드를 기계어로 바로 옮기지 않고 3주소 코드 같은 중간 표현을 거치는 이유 두 가지는?</summary>

**답:** ① 최적화하기 쉽다. 기계어에는 최적화를 막는 제약이 많아서, 중간 표현에서 하는 편이 훨씬 쉽고 분명하다. ② 기계어로 옮기기 쉽다. 고급 언어보다 기계어에 가까운 모양이라 옮기는 비용이 작다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예제의 if-else 3주소 코드를 x = 5, y = 5로 실행하면 무엇을 돌려주는가? x = 5, y = 7이면? 각각 지나가는 레이블을 쓰라.</summary>

**답:** x = 5, y = 5: `t0`가 참 → `L0` → x = 6 → `goto L2` → x = 9 → 9를 돌려준다. x = 5, y = 7: `t0`가 거짓 → `goto L1` → x = 7 → `L2` → x = 10 → 10을 돌려준다.<br>
**이유:** 흔한 오답은 첫 경우에 `L1`의 `x = x + 2`까지 실행해 11을 내는 것이다. `goto L2`가 그것을 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 이 문서의 3주소 코드 꼴로 맞는 줄을 모두 고르라. (가) `t1 = a + b + c` (나) `x = -y` (다) `if a < b goto L0` (라) `y = call foo, 2` (마) `a[i] = t0`</summary>

**답:** (나), (라), (마). (가)는 연산이 둘이라 `t0 = a + b`, `t1 = t0 + c`로 나눠야 한다. (다)는 조건 자리에 식이 왔다. `t0 = a < b`, `if t0 goto L0`로 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** `y = foo(a + 1, b);`를 3주소 코드로 옮기라.</summary>

**답:**
```
t0 = a + 1
param t0
param b
y = call foo, 2
```
**이유:** 인자로 넘길 식을 먼저 임시 변수에 계산한다. `param`은 인자 순서대로 쓰고, `call`의 끝 숫자는 인자 개수다.

</details>


[^s1]: 비유와 달리 임시 변수는 한 번만 쓰이는 것이 아니라 뒤에서 여러 번 읽힐 수 있다. 값은 검증 코드로 확인했다.
{% endraw %}
