---
layout: "note"
title: "3주소 코드 변환 연습"
display_title: "3주소 코드 변환 연습"
kind: "practice"
kind_label: "연습"
num: "39"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 3주소 코드의 줄 종류, 쿼드러플의 칸 채우기, AST에서 3주소 코드 만들기의 규칙."
prev_url: "/studies/compilers/type-checking-practice/"
prev_title: "타입 검사 연습"
next_url: "/studies/compilers/local-optimization-ladder/"
next_title: "지역 최적화 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/compilers/tac-translation-practice/"
---
{% raw %}
사용 개념: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/)의 줄 종류, [쿼드러플](/Hongs_Blog/studies/compilers/quadruples/)의 칸 채우기, [AST에서 3주소 코드 만들기](/Hongs_Blog/studies/compilers/ast-to-tac/)의 규칙.

임시 변수는 `t0`부터, 레이블은 `L0`부터 쓰는 순서대로 번호를 매긴다. 대입 `x = 식`은 식을 임시 변수에 받은 뒤 `x = t`로 복사한다. 오른쪽이 변수 하나뿐이면 바로 복사한다[^s1].

## 문제 1 · 식

`d = (a + b) * (a - c);`를 3주소 코드와 쿼드러플로 옮기라.

**풀이 전략.** 트리를 그리면 뿌리가 `=`, 그 오른쪽이 `*`, `*`의 자식이 `+`와 `-`다. 가장 깊은 연산자부터, 왼쪽 먼저 한 줄씩 쓴다. 연산자 노드 하나가 한 줄이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *왼쪽 가지:* `t0 = a + b`
2. *오른쪽 가지:* `t1 = a - c`
3. *뿌리 쪽 연산:* `t2 = t0 * t1`
4. *대입:* `d = t2`

| op | arg1 | arg2 | result |
|---|---|---|---|
| `+` | a | b | t0 |
| `-` | a | c | t1 |
| `*` | t0 | t1 | t2 |
| `=` | t2 | | d |

a = 5, b = 1, c = 2면 t0 = 6, t1 = 3, t2 = 18, d = 18이다.

</details>


**변형.** `d = a + b * a - c;`는 무엇이 달라지는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

괄호가 없으면 곱셈이 먼저라 트리가 `(a + (b * a)) - c`다. `t0 = b * a`, `t1 = a + t0`, `t2 = t1 - c`, `d = t2`. 줄 수는 같고 연산의 순서와 피연산자가 다르다.

</details>


## 문제 2 · if-else

다음을 3주소 코드로 옮기라.

```c
if (a < b) { m = a; } else { m = b; }
r = m * 2;
```

**풀이 전략.** 틀은 "조건 계산 → 참이면 `L0`로 → 아니면 `L1`로 → 참 쪽 몸통과 `goto L2` → 거짓 쪽 몸통 → `L2`에서 합류"다. 조건 분기 자리에는 식이 아니라 불 값을 담은 임시 변수를 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

```
t0 = a < b
if t0 goto L0
goto L1
L0:
m = a
goto L2
L1:
m = b
L2:
t1 = m * 2
r = t1
```
1. *조건:* `t0 = a < b`.
2. *갈라지기:* `if t0 goto L0`, `goto L1`.
3. *참 쪽:* `L0:` 아래 `m = a`, 그리고 `goto L2`.
4. *거짓 쪽:* `L1:` 아래 `m = b`. 그대로 `L2:`로 흘러간다.
5. *합류 뒤:* `t1 = m * 2`, `r = t1`.

실행하면 r은 a와 b 중 작은 쪽의 두 배다.

</details>


**변형.** 3번의 `goto L2`를 빠뜨리면 a = 1, b = 9에서 r은 얼마가 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="18"}
18. 참 쪽에서 m = 1을 넣은 뒤 그대로 흘러 `L1:` 아래의 `m = b`까지 실행해 m = 9가 된다. 맞는 답은 2다.

</details>


## 문제 3 · while과 쿼드러플

다음을 3주소 코드로 옮기고, 쿼드러플이 몇 개인지 쓰라. n = 4로 실행하면 `ifnot` 줄은 몇 번 실행되는가?

```c
s = 0;
i = 1;
while (i <= n) {
    s = s + i;
    i = i + 1;
}
```

**풀이 전략.** while의 규칙 여덟 단계를 그대로 따른다. 레이블 `L0` → 조건 계산 → `ifnot … goto L1` → 몸통 → `goto L0` → 레이블 `L1`. 반복문 앞의 두 대입은 `L0:`보다 위에 둔다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

```
s = 0
i = 1
L0:
t0 = i <= n
ifnot t0 goto L1
t1 = s + i
s = t1
t2 = i + 1
i = t2
goto L0
L1:
```
쿼드러플은 11개다(레이블도 하나씩 센다). 눈여겨볼 넷:

| 3주소 코드 | op | arg1 | arg2 | result |
|---|---|---|---|---|
| `L0:` | `label` | L0 | | |
| `t0 = i <= n` | `<=` | i | n | t0 |
| `ifnot t0 goto L1` | `ifnot` | t0 | L1 | |
| `s = t1` | `=` | t1 | | s |

n = 4면 s = 1 + 2 + 3 + 4 = 10, i = 5로 끝난다. `ifnot` 줄은 5번 실행된다. i가 1, 2, 3, 4일 때 조건이 참이라 그냥 지나가고, i = 5일 때 거짓이라 `L1`로 뛴다.

</details>


**변형.** `L0:`를 `t0 = i <= n` 아래로 옮기면 n = 4에서 어떻게 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

끝나지 않는다. `goto L0`가 조건 계산을 건너뛰어 돌아오므로 `t0`는 첫 바퀴의 값(참) 그대로다.

</details>


## 문제 4 · 반복문 안의 조건문과 배열

다음을 3주소 코드로 옮기라. else가 없는 if는 어떻게 옮기는지도 설명하라.

```c
while (i < n) {
    if (a[i] == k) { c = c + 1; }
    i = i + 1;
}
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

```
L0:
t0 = i < n
ifnot t0 goto L1
t1 = a[i]
t2 = t1 == k
ifnot t2 goto L2
t3 = c + 1
c = t3
L2:
t4 = i + 1
i = t4
goto L0
L1:
```
else가 없으면 거짓일 때 갈 곳이 "몸통 바로 뒤" 하나뿐이다. while처럼 `ifnot`으로 몸통을 건너뛰게 하면 레이블 하나(`L2`)로 충분하다. `a[i]`는 한 줄에 비교까지 넣을 수 없으므로 먼저 `t1 = a[i]`로 꺼낸다. 쿼드러플로는 (`=[]`, a, i, t1)이다.

`i = i + 1`의 두 줄은 `L2:` 아래에 있어야 한다. 그 위(if 몸통 안)에 두면 `a[i]`가 k와 다른 칸에서 i가 늘지 않아 끝나지 않는다. a = [3, 7, 3, 1, 3, 9], k = 3, i = 0, c = 0으로 실행하면 c = 3이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 코드를 실행해 원래 코드와 견줌, 쿼드러플 표, 변형의 값과 끝나지 않는 경우 — [39_tac-translation-practice_p4.py](/Hongs_Blog/studies/compilers/code/39_tac-translation-practice_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 답은 원본에 없다. 슬라이드 p.14~18의 줄 종류, p.21의 쿼드러플 표, p.32의 while 규칙만 써서 만들었다. else 없는 if의 꼴과 "오른쪽이 변수 하나면 바로 복사한다"는 약속은 슬라이드에 없어 이 문서에서 정했다. 답은 문제 코드로 실행해 확인했다.
{% endraw %}
