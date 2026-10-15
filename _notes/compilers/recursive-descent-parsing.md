---
layout: "note"
title: "재귀 하강 파싱"
display_title: "재귀 하강 파싱 (Recursive Descent Parsing)"
kind: "concept"
kind_label: "알고리즘"
num: "17"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Recursive Descent Parsing", "Recursive Descent", "재귀 하강 파서", "재귀적 하강 파싱", "Top-down Parsing", "하향식 파싱", "LL 파싱", "Backtracking Parser"]
description: "문법의 시작 이름에서 출발해, 규칙을 적힌 순서대로 하나씩 시험하며 입력과 맞춰 보는 가장 단순한 읽기 방법이다. 미로에서 갈림길마다 첫 길부터 들어가 보고 막히면 갈림길로 돌아와 다음 길로 가는 것과 같다. 이해하기 쉽고 손으로 짜기도 쉽다. 대신 막힐 때마다 이미 읽은 곳을 다…"
prev_url: "/studies/compilers/abstract-syntax-tree/"
prev_title: "추상 구문 트리"
next_url: "/studies/compilers/first-set/"
next_title: "FIRST 집합"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/recursive-descent-parsing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

문법의 시작 이름에서 출발해, 규칙을 적힌 순서대로 하나씩 시험하며 입력과 맞춰 보는 가장 단순한 읽기 방법이다. 미로에서 갈림길마다 첫 길부터 들어가 보고 막히면 갈림길로 돌아와 다음 길로 가는 것과 같다. 이해하기 쉽고 손으로 짜기도 쉽다. 대신 막힐 때마다 이미 읽은 곳을 다시 읽으므로 느리다. 규칙이 맨 앞에서 자기 자신을 부르는 문법에서는 끝나지 않고, 한 문장이 두 가지로 읽히는 문법도 쓸 수 없다.

</div>


## 예시로 보기

구문 분석기는 "이 토큰열을 문법의 시작 기호에서 만들 수 있는가"를 프로그램으로 판정해야 한다. 길은 둘이다. 시작 기호에서 입력 쪽으로 내려가거나(하향식), 입력에서 시작 기호 쪽으로 올라간다(상향식).

하향식 파싱은 시작 기호에서 입력 문자열에 이르는 [좌측 유도](/Hongs_Blog/studies/compilers/derivation-parse-tree/)를 찾는다. 파스 트리는 뿌리에서 잎 쪽으로 자란다. 입력을 왼쪽에서 오른쪽으로 읽고(Left-to-right) 좌측 유도(Leftmost)를 만들어서 LL 파싱이라고도 부른다.

문제는 걸음마다 어느 규칙을 쓸지다. 문법 $$E \to T + E \mid T$$로 $$id * id + id$$를 읽을 때 처음에 $$E \to T + E$$를 쓸지 $$E \to T$$를 쓸지 어떻게 아는가? 재귀 하강의 답은 "모른다. 순서대로 해 본다"다.

문법 $$S \to dAc \mid cAe \mid cAd$$, $$\ A \to a$$로 입력 $$cad$$를 읽는다. 입력 포인터는 다음에 읽을 글자를 가리킨다.

| 걸음 | 시험하는 규칙 | 지금 모양 | 입력 포인터 | 일어난 일 |
|---|---|---|---|---|
| 1 | $$S \to dAc$$ | $$dAc$$ | **c** a d | 첫 단말 $$d$$와 입력 $$c$$가 다르다. 되돌아간다 |
| 2 | $$S \to cAe$$ | $$cAe$$ | **c** a d | $$c$$가 맞다. 포인터를 한 칸 옮긴다 |
| 3 | $$A \to a$$ | $$cae$$ | c **a** d | $$a$$가 맞다. 포인터를 한 칸 옮긴다 |
| 4 | | $$cae$$ | c a **d** | $$e$$와 입력 $$d$$가 다르다. 되돌아간다. 포인터는 맨 앞으로 |
| 5 | $$S \to cAd$$ | $$cAd$$ | **c** a d | $$c$$가 맞다 |
| 6 | $$A \to a$$ | $$cad$$ | c **a** d | $$a$$가 맞다 |
| 7 | | $$cad$$ | c a **d** | $$d$$가 맞다. 입력이 끝났다. 받아들인다 |

걸음 5~6에서 $$c$$와 $$a$$를 다시 읽었다. 걸음 2~3에서 이미 읽고 맞춘 글자들이다. 막혔을 때 갈림길로 돌아가며 포인터도 되돌리는 이 일을 되돌아가기(backtracking)라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적의 걸음 순서, $$id + id$$ 연습의 시험 순서, 길이 6 이하 모든 입력에서 문법의 언어와 같은 답을 내는 것, 괄호를 겹칠 때 시험 횟수가 한 겹마다 4배 넘게 느는 것, 좌재귀 문법에서 끝나지 않는 것 — [17_recursive-descent-parsing_impl.py](/Hongs_Blog/studies/compilers/code/17_recursive-descent-parsing_impl/)</div>

</div>


## 알고리즘

**입출력.** 입력은 문맥 자유 문법 $$G$$와 토큰열이다. 출력은 받아들임 또는 거부이고, 받아들일 때는 찾은 좌측 유도(파스 트리)가 함께 나온다.

**동작**.

1. 시작 기호에서 출발한다.
2. 가장 왼쪽 비단말 기호의 규칙을 적힌 순서대로 시험한다.
3. 규칙을 펼쳐 가장 왼쪽 비단말 기호 앞에 단말 기호가 새로 생기면 입력과 견준다. 맞으면 입력 포인터를 한 칸 옮긴다. 다르면 되돌아가 다음 규칙을 시험한다.
4. 입력을 모두 맞추면 받아들인다. 시험할 규칙이 다 떨어지면 거부한다.

```
parse(기호 X, 위치 pos) → 성공하면 다음 위치, 실패하면 실패
    X가 단말 기호:
        입력[pos] = X 이면 pos + 1, 아니면 실패
    X가 비단말 기호:
        X의 규칙 X → Y1 Y2 … Yk 를 적힌 순서대로:
            p ← pos
            Y1부터 Yk까지 차례로 p ← parse(Yi, p)
            모두 성공하면 p를 돌려준다. 하나라도 실패하면 다음 규칙으로(pos에서 다시)
        규칙이 다 떨어지면 실패
받아들임: parse(시작 기호, 0) = 입력의 길이
```

비단말 기호마다 함수 하나를 두고 규칙 오른쪽의 비단말 기호를 만나면 그 함수를 부르는 꼴이라 '재귀', 뿌리에서 잎으로 내려가서 '하강'이다. 위 의사코드는 한 규칙이 성공하면 그 결과를 바로 돌려준다. 뒤에 오는 기호가 실패했을 때 앞 기호의 다른 선택까지 다시 시험하려면 "성공하는 모든 위치"를 차례로 내주도록 짠다. 구현 코드는 그렇게 되어 있다.

### 쓸 수 있는 조건

조건은 셋이다.

- 문법이 모호하지 않다.
- 문법에 좌재귀가 없다.
- 좌인수분해는 필요 없다.

좌재귀가 있으면 끝나지 않는다. $$S \to Sa \mid b$$에서 `parse(S, 0)`은 첫 규칙을 시험하려고 입력을 한 글자도 읽지 않은 채 `parse(S, 0)`을 다시 부른다([좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/)). 좌인수분해가 필요 없는 까닭은 같은 기호로 시작하는 규칙이 둘 있어도 하나를 시험해 보고 틀리면 되돌아가면 되기 때문이다. 위 예의 $$cAe$$와 $$cAd$$가 그런 규칙이다.

### 복잡도

되돌아가기가 값을 치른다. 재귀 하강이 실제로 잘 쓰이지 않는 까닭이 바로 이 되돌아가기다.

문법 $$E \to T + E \mid T$$, $$\ T \to F * T \mid F$$, $$\ F \to (E) \mid id$$에서 괄호를 $$d$$겹 두른 $$id$$를 읽을 때 시험한 규칙 수는 다음과 같다[^s2].

| 괄호 겹 수 $$d$$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| 그대로 | 14 | 69 | 292 | 1,187 | 4,770 | 19,105 | 76,448 |
| 좌인수분해한 문법 | 8 | 15 | 22 | 29 | 36 | 43 | 50 |

한 겹마다 4배 넘게 는다. 괄호 안을 다 읽고 나서야 $$T \to F * T$$가 틀렸음을 알고 $$T \to F$$로 다시 읽고, 그 바깥의 $$E \to T + E$$에서도 같은 일이 벌어져 한 겹에서 안쪽을 네 번 읽기 때문이다. 입력 길이에 대해 지수적으로 는다. [좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/)한 문법에서는 한 겹마다 7번씩만 는다. 되돌아가기를 아예 없앤 것이 [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)를 쓰는 예측 파싱이다.

## 예제

**연습: $$id + id$$.** 문법은 $$E \to T + E \mid T$$, $$\ T \to F * T \mid F$$, $$\ F \to (E) \mid id$$다. 규칙을 21번 시험하고 받아들인다[^s2].

| 구간 | 시험한 규칙 | 결과 |
|---|---|---|
| 첫 $$id$$ | $$E \to T + E$$, $$T \to F * T$$, $$F \to (E)$$ | `(` ≠ $$id$$. 되돌아간다 |
| | $$F \to id$$ | $$id$$가 맞다. 그런데 다음에 $$*$$가 와야 하는데 입력은 $$+$$다. 되돌아간다 |
| | $$T \to F$$, $$F \to (E)$$, $$F \to id$$ | $$id$$를 다시 읽는다. 이어서 $$+$$가 맞다 |
| 둘째 $$id$$ | $$E \to T + E$$, $$T \to F * T$$, $$F \to (E)$$, $$F \to id$$ | $$id$$가 맞다. $$*$$ 자리에서 입력이 끝났다. 되돌아간다 |
| | $$T \to F$$, $$F \to (E)$$, $$F \to id$$ | $$id$$가 맞다. $$+$$ 자리에서 입력이 끝났다. 되돌아간다 |
| | $$E \to T$$, $$T \to F * T$$, $$F \to (E)$$, $$F \to id$$ | $$id$$가 맞다. $$*$$ 자리에서 입력이 끝났다. 되돌아간다 |
| | $$T \to F$$, $$F \to (E)$$, $$F \to id$$ | $$id$$가 맞다. 입력이 끝났다. 받아들인다 |

첫 $$id$$는 두 번, 둘째 $$id$$는 네 번 읽었다. 토큰이 셋뿐인 입력에서 같은 토큰을 여섯 번 읽는다.

**경계 사례.** $$cad$$ 문법에 $$ca$$를 넣으면 세 규칙을 모두 시험한 뒤 거부한다. $$cadd$$를 넣으면 $$S \to cAd$$가 $$cad$$까지 맞추지만 입력이 남아 거부한다. 입력을 다 읽어야 받아들인다.

## 활용

- **장점.** 이해하기 쉽고 손으로 짜기 쉽다. 문법 규칙 하나가 함수 하나로 옮겨지므로 코드가 문법과 같은 모양이 된다.
- **실제 사용.** 실제 컴파일러의 손으로 짠 파서는 대개 되돌아가기 없이, 다음 토큰을 보고 규칙을 정하는 꼴로 짠다. 그 원리가 예측 파싱이다([LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/)).
- **흔한 실수.** 되돌아갈 때 입력 포인터를 갈림길 위치로 돌려놓지 않는다. 규칙 하나를 다 맞췄다고 바로 받아들인다(입력이 남았는지 봐야 한다).
- 규칙을 적은 순서가 시험 순서다. 자주 쓰이는 규칙을 앞에 두면 되돌아가는 횟수가 준다.

## 연결

- 선수: [유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/)(좌측 유도), [좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/)
- 같은 탐색 틀: [재귀와 백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/). 고르고, 재귀로 들어가고, 막히면 고른 것을 물리고 다음 것을 고른다.
- 되돌아가기를 없앤 하향식 파싱: [LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/), [LL(1) 파서의 스택 동작](/Hongs_Blog/studies/compilers/ll1-stack-parser/)
- 반대 방향에서 읽는 방법: [이동-환원 파싱](/Hongs_Blog/studies/compilers/shift-reduce-parsing/), 두 방향 견주기는 [LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 문법 $$S \to aBc \mid aBd$$, $$\ B \to b$$로 입력 $$abd$$를 재귀 하강으로 읽는다. 규칙을 시험하는 순서와 되돌아가는 곳을 쓰라.</summary>

**답:** ① $$S \to aBc$$: $$a$$ 맞음. ② $$B \to b$$: $$b$$ 맞음. ③ $$c$$와 입력 $$d$$가 달라 되돌아간다(포인터는 맨 앞으로). ④ $$S \to aBd$$: $$a$$ 맞음. ⑤ $$B \to b$$: $$b$$ 맞음. ⑥ $$d$$ 맞음, 입력 끝, 받아들인다. 규칙은 네 번 시험했다.<br>
**이유:** $$a$$와 $$b$$를 두 번씩 읽는다. 두 규칙의 앞부분 $$aB$$가 같아서다. 좌인수분해해 $$S \to aBS'$$, $$S' \to c \mid d$$로 쓰면 다시 읽지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 의사코드에서 "하나라도 실패하면 다음 규칙으로(pos에서 다시)"가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 지금 규칙으로는 입력을 맞출 수 없으니, 이 규칙을 시험하며 읽은 것을 모두 물리고 입력 포인터를 이 비단말 기호를 펼치기 시작한 자리로 돌린 뒤 다음 규칙을 시험한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 재귀 하강 파싱에 좌인수분해는 필요 없는데 좌재귀는 왜 없애야 하는가?</summary>

**답:** 공통 접두사는 느려지게 할 뿐이다. 한 규칙을 시험하다 틀리면 되돌아가 다른 규칙을 시험하면 결국 답이 나온다. 좌재귀는 답이 나오지 않게 한다. 입력을 한 글자도 읽지 않고 같은 비단말 기호를 같은 위치에서 다시 펼치므로 실패도 성공도 하지 못한 채 끝없이 내려간다.

</details>


[^s2]: $$id + id$$의 시험 순서 21번과 괄호 겹 수에 따른 시험 횟수 표는 구현 코드를 돌려 얻었다. 횟수는 이 구현(규칙을 펼칠 때마다 한 번으로 센다)에서의 값이다.
{% endraw %}
