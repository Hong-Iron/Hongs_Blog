---
layout: "note"
title: "심벌 테이블과 스코프 검사"
display_title: "심벌 테이블과 스코프 검사 (Symbol Table and Scope Checking)"
kind: "concept"
kind_label: "자료구조"
num: "32"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Symbol Table", "심벌 테이블", "기호표", "Scope Checking", "스코프 검사", "다중 패스 스코프 검사", "Multi-pass Scope Checking", "스코프별 심벌 테이블"]
description: "컴파일러는 선언을 만날 때마다 이름과 종류를 장부에 적어 두고, 이름이 쓰이면 장부에서 찾아본다. 장부는 중괄호 구역마다 한 권씩 따로 만들고, 권마다 \"나를 감싼 구역의 장부\"를 가리키게 이어 둔다. 이름을 찾을 때는 지금 구역의 장부부터 보고 없으면 바깥 장부로 한 권씩 나간다…"
prev_url: "/studies/compilers/identifier-scope/"
prev_title: "스코프"
next_url: "/studies/compilers/type-system/"
next_title: "타입과 타입 시스템"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/symbol-table-scope-checking/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컴파일러는 선언을 만날 때마다 이름과 종류를 장부에 적어 두고, 이름이 쓰이면 장부에서 찾아본다. 장부는 중괄호 구역마다 한 권씩 따로 만들고, 권마다 "나를 감싼 구역의 장부"를 가리키게 이어 둔다. 이름을 찾을 때는 지금 구역의 장부부터 보고 없으면 바깥 장부로 한 권씩 나간다. 이렇게 하면 가장 가까이 감싼 선언이 저절로 먼저 잡히고, 이미 끝난 옆 구역의 이름과 헷갈리지 않는다. 다만 한 번 훑는 것으로는 아래쪽에 정의된 함수를 위에서 부르는 코드를 통과시키지 못해, 함수와 클래스 이름만 먼저 모으는 훑기를 한 번 더 한다.

</div>


## 예시로 보기

[스코프](/Hongs_Blog/studies/compilers/identifier-scope/) 규칙을 검사하려면, 이름이 쓰인 자리에서 "이 이름은 어디서 선언되었나"를 답해야 한다. 그때마다 코드를 거슬러 올라가 선언을 찾을 수는 없으니 선언을 적어 둘 곳이 필요하다.

가장 간단한 방법은 표 하나에 (이름, 타입, 스코프 깊이)를 적는 것이다. [AST](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)를 돌아다니며 선언을 만나면 지금 깊이와 함께 적고, 블록에 들어가면 깊이를 1 늘리고, 나오면 1 줄인다.

```c
int foo() {        // foo: 깊이 0
    int a;         // 깊이 1
    int b;         // 깊이 1
    {
        int a;     // 깊이 2
        {
            int b; // 깊이 3
        }
    }
}
```

| 이름 | 타입 | 깊이 |
|---|---|---|
| foo | int | 0 |
| a | int | 1 |
| b | int | 1 |
| a | int | 2 |
| b | int | 3 |

깊이 3에서 `b`를 쓰면 표에서 깊이 3의 `b`를 찾는다. `int b;`보다 앞에서 쓰면 그 줄이 아직 없으니 더 얕은 깊이를 차례로 봐서 깊이 1의 `b`를 잡는다. `c`를 쓰면 어디에도 없어 오류다.

여기에 블록 하나를 옆에 붙이면 표가 헷갈린다.

```c
int foo() {
    int a;  int b;
    { int a;  { int b; } }
    { int c; }             // 새로 붙인 블록: c는 깊이 2
}
```

표에 `(c, int, 2)`가 더해진다. 그런데 둘째 `a`도 깊이 2다. `a`와 `c`는 깊이가 같지만 서로 다른 블록에 있다. 깊이만 적어서는 둘이 같은 구역인지 옆 구역인지 가릴 수 없다. `{ int c; }` 안에서 `a`를 쓰면 이 표는 깊이 2의 `a`를 내놓는다. 이미 끝난 옆 블록의 `a`다. 맞는 답은 깊이 1의 `a`다.

문제는 둘이다.

- 헷갈림: 깊이가 같아도 스코프는 다를 수 있다.
- 느림: 이름을 찾을 때마다 표 전체를 훑어야 한다.

## 정의

**심벌 테이블**은 이름마다 그 이름에 대해 아는 것(타입 등)을 적어 두는 표다. 컴파일러의 모든 단계가 함께 쓴다.

**스코프마다 표 하나.** AST를 돌아다니며 다음을 한다.

1. 스코프마다 심벌 테이블을 하나씩 만들고, 겹쳐진 구조를 나타내도록 잇는다. 표마다 자기를 감싼 스코프의 표(부모 표)를 가리킨다.
2. 표에는 그 스코프에서 선언된 이름을 적는다.
3. 이름이 쓰이면 지금 표에서 찾는다. 없으면 부모 표로 가서 찾는다. 이름을 찾거나 더 갈 부모가 없을 때까지 되풀이한다.

### 연산

| 연산 | 언제 | 하는 일 | 드는 일 |
|---|---|---|---|
| 스코프 들어가기 | 블록이나 함수 몸통에 들어갈 때 | 새 표를 만들고 부모를 지금 표로 한다. 지금 표를 새 표로 바꾼다 | $$O(1)$$ |
| 선언 넣기 | 선언 노드를 만날 때 | 지금 표에 (이름, 타입)을 넣는다. 지금 표에 같은 이름이 이미 있으면 중복 선언 오류 | 평균 $$O(1)$$ |
| 이름 찾기 | 이름이 쓰일 때 | 지금 표부터 부모를 따라가며 찾는다. 끝까지 없으면 선언 안 됨 오류 | 평균 $$O(d)$$ |
| 스코프 나가기 | 블록이 끝날 때 | 지금 표를 부모 표로 바꾼다 | $$O(1)$$ |

$$d$$는 지금 자리를 감싼 스코프의 겹 수다. "평균"은 표 하나를 해시 표로 만들었을 때의 값이다[^s1]. 깊이만 적은 표 하나는 이름 찾기가 표의 줄 수 $$N$$에 비례한다.

중복 선언은 **지금 표만** 본다. 부모 표에 같은 이름이 있는 것은 오류가 아니라 가리기다([의미 분석](/Hongs_Blog/studies/compilers/semantic-analysis/)의 규칙 2).

### 표가 지키는 성질

걸음마다 이 성질이 계속 맞는다(표현 불변식)[^s1].

- 지금 표에서 부모를 따라가며 만나는 표들은, 지금 자리를 감싼 스코프들을 안쪽부터 바깥쪽 순서로 늘어놓은 것이다.
- 각 표에는 그 스코프에서 **지금 자리보다 앞서** 선언된 이름만 들어 있다.

이 두 줄에서 이름 찾기가 [가장 가까운 안쪽 스코프 규칙](/Hongs_Blog/studies/compilers/identifier-scope/)대로 답한다는 것이 나온다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. **처음.** 표는 맨 바깥(전역) 표 하나이고 비어 있다. 감싼 스코프는 전역 하나, 앞선 선언은 없다. 성질이 맞다.
2. **선언 넣기.** 지금 스코프에 선언 하나가 늘고, 그 뒤의 자리에서 보면 "앞선 선언"이다. 지금 표에만 넣으므로 다른 표는 그대로다. — 성질의 둘째 줄
3. **스코프 들어가기.** 감싼 스코프가 안쪽에 하나 는다. 새 표의 부모가 지금 표이므로 부모를 따라가면 새 스코프, 그다음 예전 스코프들 순서다. 새 표는 비어 있고 아직 그 스코프에서 선언된 것이 없다. — 성질의 첫째 줄
4. **스코프 나가기.** 감싼 스코프가 안쪽에서 하나 준다. 지금 표를 부모로 바꾸면 남은 줄이 그대로 감싼 스코프들이다. 나간 표는 어느 표의 부모 줄에도 다시 오르지 않는다. 뒤에 생길 표의 부모는 그때의 "지금 표"이기 때문이다.
5. **이름 찾기가 맞는 이유.** 규칙이 바라는 답은 "감싼 스코프 가운데 가장 안쪽에서, 쓰는 자리보다 앞서 선언된 것"이다. 성질에 따라 부모를 따라가는 차례가 안쪽부터이고 각 표에는 앞선 선언만 있으므로, 처음 만나는 것이 그 답이다. ∎

</details>


### 표가 다섯 생기는 예

위 코드에 `{ int c; }`를 붙인 프로그램을 돌면 표가 다섯 개 생긴다.

```
  [foo:int]            ← 전역 표
      ↑
  [a:int, b:int]       ← foo의 몸통
      ↑        ↖
  [a:int]       [c:int]      ← 안쪽 블록 둘 (서로 옆 구역)
      ↑
  [b:int]              ← 가장 안쪽 블록
```

화살표는 "부모 표"를 가리킨다. `[a:int]`와 `[c:int]`는 부모가 같지만 서로를 가리키지 않는다. 그래서 `{ int c; }` 안에서 `a`를 찾으면 `[c:int]` → `[a:int, b:int]` 순서로 가서 몸통의 `a`를 잡는다. 옆 블록의 `a`는 길 위에 없다.

AST를 도는 순서대로 적으면 이렇다.

| AST 노드 | 한 일 | 지금 표 |
|---|---|---|
| declaration foo int | 지금 표에 foo를 넣는다 | 전역 `[foo]` |
| block | 새 표를 만든다 (부모: 전역) | `[]` |
| declaration a int, declaration b int | 지금 표에 넣는다 | `[a, b]` |
| block | 새 표를 만든다 (부모: `[a, b]`) | `[]` |
| declaration a int | 지금 표에 넣는다 | `[a]` |
| block | 새 표를 만든다 (부모: `[a]`) | `[]` |
| declaration b int | 지금 표에 넣는다 | `[b]` |
| (block 끝) | 부모 표로 돌아간다 | `[a]` |
| (block 끝) | 부모 표로 돌아간다 | `[a, b]` |
| block | 새 표를 만든다 (부모: `[a, b]`) | `[]` |
| declaration c int | 지금 표에 넣는다 | `[c]` |
| (block 끝) | 부모 표로 돌아간다 | `[a, b]` |

**이름 찾기.** 가장 안쪽 블록을 `printf(b); int b; printf(b); printf(c);`로 바꾼다.

| 쓰임 | 지금 표 | 찾는 길 | 결과 |
|---|---|---|---|
| 첫 `printf(b)` | `[]` (아직 `b` 선언 전) | `[]` → `[a]` → `[a, b]` | 조상 표에서 찾았다 |
| 둘째 `printf(b)` | `[b]` | `[b]` | 지금 표에 있다 |
| `printf(c)` | `[b]` | `[b]` → `[a]` → `[a, b]` → `[foo]` → 끝 | 어느 조상에도 없다. 오류 |

`c`는 옆 블록 `{ int c; }`에 선언되어 있지만, 그 표는 지금 표의 조상이 아니라서 보이지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 깊이를 적은 표의 다섯 줄과 세 가지 찾기 결과, 옆 블록을 붙였을 때 깊이 표가 틀린 `a`를 내놓고 이은 표는 맞는 `a`를 내놓음, 표 다섯 개의 연결 모양, 위 세 번의 이름 찾기, 규칙 1~3의 예, 한 번 훑기와 두 번 훑기의 차이, 무작위 프로그램 3,000개(쓰임 10,735번)에서 이은 표의 답이 뻔한 방법과 모두 같고 깊이 표는 1,309번 틀림 — [32_symbol-table-scope-checking_impl.py](/Hongs_Blog/studies/compilers/code/32_symbol-table-scope-checking_impl/)</div>

</div>


### 선언보다 먼저 쓰는 이름: 여러 번 훑기

위 방법은 "쓰기 전에 선언"을 그대로 지킨다. 그런데 함수와 클래스 이름은 선언보다 앞에서 써도 되는 언어가 많다.

```cpp
class Test {
public:
    void bar() { foo(); return; }     // foo는 아래에 있다
    void foo() { printf("foo"); return; }
};
```

한 번만 훑으면 `bar` 안의 `foo()`에서 표에 `foo`가 아직 없어 오류가 난다. 해결은 두 번 훑는 것이다.

| 훑기 | 하는 일 |
|---|---|
| 1차 | 함수 이름과 클래스 이름을 모두 모아 표에 넣는다. 위 코드면 전역 표에 `test: class`, 클래스의 표에 `bar: void`, `foo: void` |
| 2차 | 스코프 검사를 한다. `bar` 안의 `foo()`를 찾으면 클래스의 표에 이미 `foo`가 있다 |

변수는 1차에서 모으지 않는다. 그래서 변수는 두 번 훑어도 선언보다 앞에서 쓰면 오류다. 의미 분석은 보통 여러 번(두 번보다 많을 수도 있다) 훑는다.

**물려받은 이름.** 부모 클래스에서 물려받은 변수와 함수는 어떻게 검사할까? 한 가지 답은 클래스의 표에 "부모 클래스의 표"를 가리키는 연결을 하나 더 두는 것이다. 클래스의 표에서 이름을 못 찾으면 바깥 스코프로 나가기 전에 부모 클래스의 표를 먼저 본다[^s2].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 4에서 "나간 표는 다시 부모 줄에 오르지 않는다"의 근거</summary>

새 표의 부모는 만들 때의 "지금 표"로 정해진다. 스코프를 나가면 그 표는 더는 지금 표가 아니고, 다시 지금 표가 될 길도 없다. 그러니 뒤에 생기는 어떤 표도 그 표를 부모로 삼지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 5에서 "처음 만나는 것이 답"인 이유</summary>

부모를 따라가는 차례가 안쪽 스코프부터이므로 처음 만난 표가 그 이름을 가진 가장 안쪽 스코프다. 표에는 지금 자리보다 앞선 선언만 있으므로 "쓰기 전에 선언"도 함께 지켜진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 중복 선언을 지금 표에서만 확인하는 이유</summary>

규칙은 "같은 지역 안에서 한 번만"이다. 바깥 스코프에 같은 이름이 있는 것은 허용되고, 안쪽 선언이 바깥 것을 가린다. 부모 표까지 확인하면 맞는 프로그램을 오류로 잡는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 구조의 핵심 아이디어는?</summary>

스코프가 겹쳐진 모양을 표들의 연결로 그대로 옮긴다. "감싼다"는 관계가 "부모를 가리킨다"가 되어, 규칙의 "가까운 것부터"가 "부모를 따라가는 차례"로 저절로 지켜진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

실행 중에 함수 호출마다 지역 변수 칸을 따로 만들고 끝나면 치우는 것과 닮았다([활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)). 파일 경로에서 현재 폴더에 없으면 상위 폴더 설정을 따르는 방식도 같은 꼴이다.

</details>


### 대안과 견주기

| | 깊이를 적은 표 하나 | 스코프마다 표를 만들어 잇기 |
|---|---|---|
| 옆 블록의 이름 | 깊이가 같으면 못 가린다 | 길 위에 없어 보이지 않는다 |
| 이름 찾기 | 표 전체를 훑는다 | 감싼 표만 본다 |
| 만들기 | 쉽다. 정수 하나만 올리고 내린다 | 표를 만들고 부모를 이어야 한다 |
| 다 돈 뒤에도 남는 정보 | 깊이뿐 | 스코프의 겹친 모양 전체(뒤 단계가 다시 쓸 수 있다) |

## 활용

- 구현: [32_symbol-table-scope-checking_impl.py](/Hongs_Blog/studies/compilers/code/32_symbol-table-scope-checking_impl/)
- 표들은 부모를 가리키는 연결로 [트리](/Hongs_Blog/studies/discrete-math/trees/)를 이룬다. 뿌리는 전역 표이고, 이름 찾기는 지금 표에서 뿌리로 올라가는 길을 따라간다.
- AST를 도는 동안 "지금 표"는 들어갈 때 안쪽으로, 나올 때 바깥쪽으로 움직인다. 가장 나중에 들어간 스코프를 가장 먼저 나오므로 [스택](/Hongs_Blog/studies/algorithms/stack/)처럼 움직인다[^s1].
- 표에 적어 둔 타입은 다음 단계인 [타입 검사](/Hongs_Blog/studies/compilers/type-checking-procedure/)가 쓴다.
- 흔한 실수: 블록을 나올 때 표를 지워 버리는 것. 지금 표만 부모로 옮기고 표는 남겨 둔다. 두 번 훑기에서는 1차에 만든 표를 2차가 쓴다.

## 연결

- 선수: [스코프](/Hongs_Blog/studies/compilers/identifier-scope/), [추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/)
- 검사하는 규칙: [의미 분석](/Hongs_Blog/studies/compilers/semantic-analysis/)의 규칙 1~3
- 물려받은 이름: [상속](/Hongs_Blog/studies/java/java-inheritance/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"스코프 깊이가 같으면 같은 스코프다"</div>

틀렸다. `{ int a; }`와 `{ int c; }`가 나란히 있으면 둘 다 깊이 2지만 서로 다른 스코프다. 한쪽에서 선언한 이름은 다른 쪽에서 보이지 않는다. 그럴듯해 보이는 이유는 블록이 한 줄로만 겹쳐진 예(안으로만 들어가는 예)에서는 깊이와 스코프가 하나씩 짝이 맞기 때문이다. 실제로는 옆으로 나란한 블록이 있으면 같은 깊이에 스코프가 여럿이다. 확인하는 법: `{ int a; } { int c; a = 0; }`에서 `a`를 찾아 본다. 깊이만 적은 표는 깊이 2의 `a`를 내놓고, 표를 이은 방법은 바깥에서 `a`를 찾는다. 무작위 프로그램 3,000개에서 깊이 표는 1,309번 틀렸다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 스코프마다 표를 만드는 방법에서 AST를 돌며 하는 일 세 가지를 쓰라.</summary>

**답:** ① 스코프마다 심벌 테이블을 만들고 부모 표로 이어 겹친 구조를 나타낸다. ② 그 스코프에서 선언된 이름을 표에 넣는다. ③ 이름이 쓰이면 지금 표에서 찾고, 없으면 부모 표로 가며 찾을 때까지 또는 부모가 없을 때까지 되풀이한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `int g; void f() { int x; { int y; { int x; } } { int z; } }`를 한 번 훑었다. 표가 몇 개 생기고 각 표의 내용과 부모는 무엇인가?</summary>

**답:** 다섯 개. 전역 `[g, f]`(부모 없음), f의 몸통 `[x]`(부모: 전역), 첫 블록 `[y]`(부모: `[x]`), 그 안의 블록 `[x]`(부모: `[y]`), 둘째 블록 `[z]`(부모: f의 몸통 `[x]`).<br>
**이유:** 틀리기 쉬운 곳은 `[z]`의 부모다. `[y]`가 아니라 f의 몸통이다. 스코프를 나갈 때마다 지금 표가 부모로 돌아가 있기 때문이다[^s3].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 깊이를 적은 표 하나로는 왜 틀린 답이 나오는가? 표를 이으면 왜 고쳐지는가?</summary>

**답:** 깊이가 같은 옆 블록의 이름을 가릴 수 없다. 이미 끝난 블록의 줄이 표에 남아 깊이만으로 걸러지지 않는다. 표를 스코프마다 따로 두고 부모로 이으면, 이름 찾기가 지금 표에서 뿌리로 가는 길만 따라간다. 옆 블록의 표는 그 길 위에 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 깊이만 적은 표가 선언 안 된 이름을 선언된 것으로 잘못 통과시키는 프로그램을 만들라.</summary>

**답:** `void f() { { int a; } { a = 0; } }`. 둘째 블록의 `a`는 선언된 적이 없다(첫 블록의 `a`는 그 블록에서만 통한다). 깊이 표에는 `(a, int, 2)`가 남아 있고 둘째 블록도 깊이 2라 찾아 버린다.<br>
**이유:** 표를 이은 방법은 둘째 블록의 표 → f의 몸통 → 전역을 봐서 `a`가 없으니 오류를 낸다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** `class T { void bar() { foo(); x = 1; } void foo() {} int x; };`를 위의 두 번 훑기로 검사하면 어떤 오류가 나는가?</summary>

**답:** `x`만 "선언 안 됨" 오류가 난다. `foo`는 1차 훑기가 함수 이름을 미리 모았으므로 통과한다. `x`는 변수라서 1차에서 모으지 않고, 2차에서 `bar`를 볼 때 아직 표에 없다.<br>
**이유:** 위의 1차 훑기는 함수와 클래스 이름만 모은다. 실제 C++은 클래스 멤버 변수도 멤버 함수 몸통 안에서는 선언 위치와 상관없이 쓸 수 있으니, 실제 언어의 규칙과 이 단순한 규칙을 구별한다[^s3].

</details>


[^s1]: 구현 코드와 무작위 비교로 확인했다. 근거: Aho·Lam·Sethi·Ullman, *Compilers* 2판, 2.7 "Symbol Tables"(스코프마다 표를 두고 잇는 방식).
[^s2]: 클래스의 표를 부모 클래스의 표에 이었을 때만 물려받은 `foo()`를 찾는다는 것을 구현 코드로 확인했다.
[^s3]: 세 카드의 답은 구현 코드에 넣어 확인했다.
{% endraw %}
