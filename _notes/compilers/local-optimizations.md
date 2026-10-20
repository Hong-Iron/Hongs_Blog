---
layout: "note"
title: "지역 최적화 기법"
display_title: "지역 최적화 기법 (Local Optimizations)"
kind: "concept"
kind_label: "기법"
num: "41"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Local Optimizations", "Code Optimization", "코드 최적화", "중간 코드 최적화기", "Intermediate Code Optimizer", "공통 부분식 제거", "Common Subexpression Elimination", "CSE", "복사 전파", "Copy Propagation", "죽은 코드 제거", "Dead Code Elimination", "산술 단순화", "Arithmetic Simplification", "상수 접기", "Constant Folding"]
description: "초고를 퇴고할 때 같은 말을 두 번 한 곳은 한 번으로 줄이고, 읽는 사람이 쓰지 않을 문장은 지우고, 돌려 말한 곳은 짧은 말로 바꾼다. 뜻은 그대로 두고 글만 짧게 만드는 것이다. 컴파일러도 자기가 만든 코드를 이렇게 다듬어서, 결과는 똑같은데 더 빠르고 작은 코드로 만든다. …"
prev_url: "/studies/compilers/basic-block-cfg/"
prev_title: "기본 블록과 제어 흐름 그래프"
next_url: "/studies/compilers/available-expressions/"
next_title: "사용 가능한 식 분석"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "41_local-optimizations_verify.py", "u": "/studies/compilers/code/41_local-optimizations_verify/", "r": "검증"}]
permalink: "/studies/compilers/local-optimizations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

초고를 퇴고할 때 같은 말을 두 번 한 곳은 한 번으로 줄이고, 읽는 사람이 쓰지 않을 문장은 지우고, 돌려 말한 곳은 짧은 말로 바꾼다. 뜻은 그대로 두고 글만 짧게 만드는 것이다. 컴파일러도 자기가 만든 코드를 이렇게 다듬어서, 결과는 똑같은데 더 빠르고 작은 코드로 만든다. 여기서 다루는 다섯 가지는 점프 없이 한 줄로 이어지는 구간 하나 안에서만 고친다. 고치기 전에 "그 사이에 값이 바뀌지 않았는가", "뒤에서 정말 안 쓰는가"를 확인하지 않으면 뜻이 달라진다.

</div>


## 예시로 보기

중간 코드 생성기는 트리의 노드 하나만 보고 코드를 만든다. 그래서 같은 계산을 또 하거나 쓸모없는 변수를 잔뜩 만든다. 프로그래머가 처음부터 비효율적으로 짠 코드도 많다. 누군가 뒤에서 다듬어야 한다.

```c
int x, y;
bool b1, b2, b3;
b1 = x + x < y;
b2 = x + x == y;
b3 = x + x > y;
```

| 생성기가 만든 코드 (9줄) | 최적화한 코드 (4줄) |
|---|---|
| `t0 = x + x` | `t0 = x + x` |
| `t1 = t0 < y` | `b1 = t0 < y` |
| `b1 = t1` | |
| `t2 = x + x` | |
| `t3 = t2 == y` | `b2 = t0 == y` |
| `b2 = t3` | |
| `t4 = x + x` | |
| `t5 = t4 > y` | `b3 = t0 > y` |
| `b3 = t5` | |

`x + x`를 세 번 계산하던 것이 한 번이 되고, 임시 변수 `t1`~`t5`가 사라졌다. 어떤 x, y를 넣어도 `b1`, `b2`, `b3`에 들어가는 값은 두 코드에서 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 9줄과 4줄이 무작위 입력 300개에서 같은 `b1`, `b2`, `b3`를 냄, 아래 다섯 기법의 예와 조건을 어긴 반례, 정수 −1000~1000에서 `a * 2 = a << 1`, 아래 연습의 답, 카드 C3의 답 — [41_local-optimizations_verify.py](/Hongs_Blog/studies/compilers/code/41_local-optimizations_verify/)</div>

</div>


## 정의

**중간 코드 최적화기**는 중간 코드 생성기가 만든 코드를 고쳐서 실행 속도, 메모리 사용량, 전력 소모를 줄인다. 원래 프로그램의 뜻은 그대로 지킨다. 뜻을 지킨다는 것은 같은 입력에 같은 결과를 낸다는 말이다.

최적화는 기계어 단계에서도 한다. 그쪽은 특정 기계의 성질을 써서 성능을 올린다. 중간 코드 최적화는 기계와 상관없이 두루 통하는 개선을 한다.

[기본 블록](/Hongs_Blog/studies/compilers/basic-block-cfg/) 하나 안에서 하는 대표 기법은 다섯이다.

| 기법 | 알아보는 신호 | 바꾸는 법 | 지켜야 할 조건 |
|---|---|---|---|
| 공통 부분식 제거 | 오른쪽이 똑같은 대입 `v0 = a op b`, `v1 = a op b`가 둘 | 뒤의 것을 `v1 = v0`로 | 두 줄 사이에 v0, a, b의 값이 바뀌지 않았다 |
| 복사 전파 | `v0 = v1` 뒤에 v0를 읽는 줄 | 그 줄의 v0를 v1으로 | 그 사이에 v0와 v1에 다시 넣는 줄이 없다 |
| 죽은 코드 제거 | 넣은 값을 뒤에서 한 번도 안 읽는 대입 | 그 줄을 지운다 | 정말로 뒤에서 그 값을 읽지 않는다 |
| 산술 단순화 | 느린 연산 `x = a * 2` | 더 빠른 연산 `x = a << 1`로 | 두 연산의 결과가 같다 |
| 상수 접기 | 피연산자가 모두 상수 `x = 10 * 2` | 컴파일할 때 계산해 `x = 20`으로 | |

`op`는 `+`, `*` 같은 아무 연산자다. `<<`는 비트를 왼쪽으로 한 칸 미는 연산이고, 정수에서는 2를 곱한 것과 같다[^s1].

**공통 부분식 제거(common subexpression elimination).** 같은 식을 두 번 계산하지 않는다.

```
v0 = a op b              v0 = a op b
...             →        ...
v1 = a op b              v1 = v0
```

조건이 깨지는 예: `v0 = a + b`, `a = a + 1`, `v1 = a + b`. 가운데 줄에서 a가 바뀌어 두 `a + b`의 값이 다르다. `v1 = v0`로 바꾸면 틀린다[^s1].

**복사 전파(copy propagation).** `v0 = v1`은 v0가 v1의 복사본이라는 뜻이다. 복사본 대신 원본을 읽게 한다.

```
v0 = v1                  v0 = v1
a = … v0 …      →        a = … v1 …
```

이것만으로는 줄 수가 줄지 않는다. 대신 v0를 읽는 곳이 없어져서, 다음 차례에 `v0 = v1`을 죽은 코드로 지울 수 있게 된다.

**죽은 코드 제거(dead code elimination).** 넣은 값이 한 번도 쓰이지 않는 대입을 죽었다(dead)고 한다. 죽은 대입은 지운다.

**산술 단순화(arithmetic simplification)와 상수 접기(constant folding).** 앞의 것은 연산을 더 싼 연산으로 바꾸고, 뒤의 것은 값이 정해진 식을 미리 계산한다.

## 예제

세 기법을 차례로 쓰면 서로 다음 기법의 일감을 만들어 준다.

| 처음 | ① 공통 부분식 제거 | ② 복사 전파 | ③ 죽은 코드 제거 |
|---|---|---|---|
| `t0 = x + x` | `t0 = x + x` | `t0 = x + x` | `t0 = x + x` |
| `y = t0 * x` | `y = t0 * x` | `y = t0 * x` | `y = t0 * x` |
| `t2 = x + x` | `t2 = t0` | `t2 = t0` | |
| `t3 = t2 == y` | `t3 = t2 == y` | `t3 = t0 == y` | `t3 = t0 == y` |
| `if t3 goto L2` | `if t3 goto L2` | `if t3 goto L2` | `if t3 goto L2` |

1. *공통 부분식 제거:* 첫 줄과 셋째 줄이 둘 다 `x + x`다. 그 사이에 x와 t0가 바뀌지 않았다. 셋째 줄을 `t2 = t0`로 바꾼다.
2. *복사 전파:* `t2 = t0`가 생겼다. 넷째 줄의 t2를 t0로 바꾼다.
3. *죽은 코드 제거:* 이제 t2를 읽는 줄이 없다(이 블록 뒤에서도 t2를 안 쓴다고 할 때). `t2 = t0`를 지운다.

**연습.** 다음 코드를 최적화한다. 뒤에서는 t4만 쓰인다.

```
t0 = a * a
t1 = a * a
t2 = t0 + t1
t3 = t0 + t0
t4 = t3 + 1
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. *공통 부분식 제거:* 둘째 줄 `t1 = a * a` → `t1 = t0`.
2. *복사 전파:* 셋째 줄 `t2 = t0 + t1` → `t2 = t0 + t0`.
3. *공통 부분식 제거:* 넷째 줄 `t3 = t0 + t0`가 이제 셋째 줄과 같다 → `t3 = t2`.
4. *복사 전파:* 다섯째 줄 `t4 = t3 + 1` → `t4 = t2 + 1`.
5. *죽은 코드 제거:* t1과 t3을 읽는 줄이 없다. `t1 = t0`와 `t3 = t2`를 지운다.

```
t0 = a * a
t2 = t0 + t0
t4 = t2 + 1
```
다섯 줄이 세 줄이 됐다. a = 3이면 두 코드 모두 t4 = 19다. `t2 = t0 + t0`는 산술 단순화로 `t2 = t0 << 1`로 더 바꿀 수 있다[^s2].

</details>


**이 다섯 기법만으로 안 되는 것 둘.**

- 맨 위 예의 4줄짜리 결과에는 `t1 = t0 < y`, `b1 = t1`을 `b1 = t0 < y` 한 줄로 합치는 일이 들어 있다. 다섯 기법 가운데 이것을 하는 것은 없다. 공통 부분식 제거, 복사 전파, 죽은 코드 제거만 쓰면 7줄(`t0 = x + x`, `t1 = t0 < y`, `b1 = t1`, `t3 = t0 == y`, `b2 = t3`, `t5 = t0 > y`, `b3 = t5`)까지 줄어든다.
- `while (x < y + z) { x = x + 1; }`를 3주소 코드로 옮기면 한 바퀴 돌 때마다 `t0 = y + z`를 다시 계산한다. 그런데 y와 z는 반복문 안에서 바뀌지 않는다. 이 계산을 반복문 밖으로 한 번만 꺼내려면 블록 하나가 아니라 반복문 전체를 봐야 한다. 지역 최적화로는 할 수 없다: [전역 사용 가능한 식 분석](/Hongs_Blog/studies/compilers/global-available-expressions/)

## 활용

- 조건을 사람이 눈으로 확인하는 대신 컴파일러가 자동으로 확인하는 방법이 두 가지 분석이다. 공통 부분식 제거와 복사 전파는 [사용 가능한 식 분석](/Hongs_Blog/studies/compilers/available-expressions/)으로, 죽은 코드 제거는 [생존 변수 분석](/Hongs_Blog/studies/compilers/live-variable-analysis/)으로 한다.
- 연습: [지역 최적화 예제 사다리](/Hongs_Blog/studies/compilers/local-optimization-ladder/)
- `a * 2`를 `a << 1`로 바꾸는 것은 a가 정수일 때 통한다. 실수에는 비트를 미는 연산을 쓸 수 없다[^s1].
- 흔한 실수: 두 식의 글자가 같다는 것만 보고 사이에 변수가 바뀌었는지 확인하지 않는다. 죽은 코드인지 판단할 때 블록 뒤에서 그 변수를 쓰는지 보지 않는다. 복사 전파를 하고 나서 복사 줄을 바로 지운다(다른 곳에서 아직 읽을 수 있다. 지우는 것은 죽은 코드 제거의 몫이다).

## 연결

- 선수: [3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/), [기본 블록과 제어 흐름 그래프](/Hongs_Blog/studies/compilers/basic-block-cfg/)
- 왼쪽으로 한 칸 밀기가 2배인 까닭: [시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/), [비트 연산과 비트마스크](/Hongs_Blog/studies/algorithms/bit-operations/)
- 블록을 넘어서 하는 최적화: [전역 생존 변수 분석](/Hongs_Blog/studies/compilers/global-live-variable-analysis/), [전역 사용 가능한 식 분석](/Hongs_Blog/studies/compilers/global-available-expressions/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 지역 최적화 기법 다섯 가지의 이름과 각각 한 줄짜리 예를 쓰라.</summary>

**답:** 공통 부분식 제거(`v0 = a + b` … `v1 = a + b` → `v1 = v0`), 복사 전파(`v0 = v1` 뒤의 `a = v0 * 2` → `a = v1 * 2`), 죽은 코드 제거(뒤에서 안 읽는 `t2 = t0` 지우기), 산술 단순화(`x = a * 2` → `x = a << 1`), 상수 접기(`x = 10 * 2` → `x = 20`).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 공통 부분식 제거의 조건 "두 대입 사이에 v0, a, b가 바뀌지 않았다"에서 (가) a가 바뀌는 경우와 (나) v0가 바뀌는 경우 각각, 조건을 무시하고 고치면 틀리는 세 줄짜리 코드를 만들라.</summary>

**답:** (가) `v0 = a + b`, `a = a + 1`, `v1 = a + b`. a = 1, b = 1이면 v1은 3이어야 하는데 `v1 = v0`로 바꾸면 2다. (나) `v0 = a + b`, `v0 = 0`, `v1 = a + b`. v1은 a + b여야 하는데 `v1 = v0`로 바꾸면 0이다.<br>
**이유:** (가)는 뒤의 식이 다른 값을 계산하게 됐고, (나)는 앞의 결과를 담아 둔 변수가 더는 그 값을 갖고 있지 않다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 블록을 최적화하라. 블록 뒤에서는 e만 쓰인다. `t0 = 4 * 2` / `t1 = b + c` / `t2 = b + c` / `t3 = t1 * t0` / `d = t2` / `e = d + t3`</summary>

**답:** `t1 = b + c`, `t3 = t1 * 8`, `e = t1 + t3` 세 줄.<br>
**이유:** 상수 접기로 `t0 = 8`. 공통 부분식 제거로 `t2 = t1`. 복사 전파로 `t3 = t1 * 8`(t0 → 8), `d = t1`(t2 → t1), `e = t1 + t3`(d → t1). 죽은 코드 제거로 이제 아무도 읽지 않는 `t0 = 8`, `t2 = t1`, `d = t1`을 지운다[^s2].

</details>


[^s1]: 글의 퇴고와 달리 여기서는 결과가 한 치도 달라지면 안 된다.
[^s2]: 답은 사용 가능한 식 분석과 생존 변수 분석의 구현을 차례로 돌려 얻었고, 고치기 전후 코드를 실행해 같은 값을 확인했다.
{% endraw %}
