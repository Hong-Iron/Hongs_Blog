---
layout: "note"
title: "레지스터 할당 예제 사다리"
display_title: "레지스터 할당 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "56"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 레지스터 간섭 그래프, 그래프 색칠 레지스터 할당, 스필링."
prev_url: "/studies/compilers/codegen-practice/"
prev_title: "코드 생성 연습"
math: true
mermaid: false
code_count: 2
permalink: "/studies/compilers/register-allocation-ladder/"
---
{% raw %}
사용 개념: [레지스터 간섭 그래프](/Hongs_Blog/studies/compilers/register-interference-graph/), [그래프 색칠 레지스터 할당](/Hongs_Blog/studies/compilers/graph-coloring-register-allocation/), [스필링](/Hongs_Blog/studies/compilers/register-spilling/).

"코드와 레지스터 수 $$K$$가 주어지고 변수에 레지스터를 나눠 주라"는 문제는 늘 같은 하위목표의 반복이다. ① 지점마다 살아 있는 변수의 목록 구하기 ② 같은 목록에 든 변수끼리 이어 간섭 그래프 그리기 ③ 이웃이 $$K$$보다 적은 노드를 빼서 스택에 쌓기 ④ 스택에서 꺼내며 칠한 이웃과 다른 색 주기 ⑤ 막히면 변수 하나를 내보내고 ①부터 다시 하기. 문제 1~3과 4는 같은 프로그램을 쓴다. 뺄 노드가 여럿이면 이름 순으로 고른다.

**공통 프로그램.** B0 `b = 3; c = 1; f = 0`, B1 `a = b + c; d = -a; e = d + f`, B2 `f = 2 * e`, B3 `c = d + e; e = e - 1`, B4 `b = f + c`다. B0 → B1, B1 → B2, B1 → B3, B2 → B4, B3 → B4이고, B4 다음 블록은 b만 읽는다.

## 문제 1 · 완전한 풀이

공통 프로그램에 레지스터 넷($$K = 4$$)을 나눠 주라.

1. *목록 구하기:* 끝에서 거꾸로 간다. B4: {c, f} `b = f + c` {b}. B3: {d, e, f} `c = d + e` {c, e, f} `e = e - 1` {c, f}. B2: {c, e} `f = 2 * e` {c, f}. B1의 끝 = {c, e} ∪ {d, e, f} = {c, d, e, f}. B1: {b, c, f} `a = b + c` {a, c, f} `d = -a` {c, d, f} `e = d + f` {c, d, e, f}. B0: {} `b = 3` {b} `c = 1` {b, c} `f = 0` {b, c, f}.
2. *간섭 그래프:* 목록마다 둘씩 짝짓는다. a–c, a–f, b–c, b–f, c–d, c–e, c–f, d–e, d–f, e–f. 열 개. 이웃 수는 a 2, b 2, c 5, d 3, e 3, f 5.
3. *빼서 쌓기:* a(이웃 2) → b(2) → c(a, b가 빠져 3) → d(2) → e(1) → f(0). 스택은 바닥부터 a, b, c, d, e, f.
4. *꺼내며 칠하기:* f r3 → e(f를 피해) r0 → d(e, f를 피해) r2 → c(d, e, f를 피해) r1 → b(c, f를 피해) r0 → a(c, f를 피해) r0.
5. *막힘:* 없다.

결과: a, b, e는 r0, c는 r1, d는 r2, f는 r3. 변수 여섯을 레지스터 넷에 담았다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [54_register-interference-graph_impl.py](/Hongs_Blog/studies/compilers/code/54_register-interference-graph_impl/), [55_graph-coloring-register-allocation_impl.py](/Hongs_Blog/studies/compilers/code/55_graph-coloring-register-allocation_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

한 블록짜리 코드 `a = 1` / `b = 2` / `c = a + b` / `d = c + a` / `e = d + b`에 레지스터 셋($$K = 3$$)을 나눠 주라. 끝난 뒤에는 e만 쓰인다. 색은 쓸 수 있는 것 가운데 번호가 가장 작은 것을 준다.

1. *목록 구하기:* {} `a = 1` {a} `b = 2` {a, b} `c = a + b` {a, b, c} `d = c + a` {b, d} `e = d + b` {e}.
2. *간섭 그래프:* {a, b}에서 a–b. {a, b, c}에서 a–c, b–c가 더 나온다. {b, d}에서 b–d. 간선 넷. e는 이웃이 없다.
3. *빼서 쌓기:* 이웃 수는 a 2, b 3, c 2, d 1, e 0이다. a(2)를 뺀다. b는 a가 빠져 2가 되어 뺀다. c(0), d(0), e(0)를 차례로 뺀다. 스택은 바닥부터 a, b, c, d, e.
4. *꺼내며 칠하기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

e: 칠한 이웃이 없다 → r0. d: 이웃 b는 아직 스택에 있다 → r0. c: 이웃 a, b 모두 아직 스택에 있다 → r0. b: 이웃 c(r0), d(r0)를 피해 r1. a: 이웃 b(r1), c(r0)를 피해 r2.<br>
결과: c, d, e는 r0, b는 r1, a는 r2. 레지스터로 바꾼 코드는 `r2 = 1` / `r1 = 2` / `r0 = r2 + r1` / `r0 = r0 + r2` / `r0 = r0 + r1`이고 마지막 r0(e)은 6이다. 원래 코드의 e = (1 + 2) + 1 + 2 = 6과 같다.<br>
레지스터가 둘($$K = 2$$)이면 d, e만 빠지고 a, b, c가 서로 모두 이어진 채 남아 막힌다. 목록 {a, b, c}에 셋이 함께 들어 있으므로 실제로도 둘로는 안 된다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [56_register-allocation-ladder_p2.py](/Hongs_Blog/studies/compilers/code/56_register-allocation-ladder_p2/)</div>

</div>


## 문제 3 · 하위목표 절반이 빈칸

공통 프로그램에 레지스터 셋($$K = 3$$)을 나눠 주라. 막히면 c를 메모리 자리 `ca`로 내보낸다.

1. *목록과 간섭 그래프:* 문제 1과 같다.
2. *빼서 쌓기:* a(2), b(2)를 뺀다. 남은 c, d, e, f는 모두 이웃이 3이다. 3보다 적은 노드가 없어 막힌다.
3. *내보내고 고쳐 쓰기:* ______
4. *새 목록:* B0: {} `b = 3` {b} `c0 = 1` {b, c0} `store c0 ca` {b} `f = 0` {b, f}. B1: {b, f} `load c1 ca` {b, c1, f} `a = b + c1` {a, f} `d = -a` {d, f} `e = d + f` {d, e, f}. B2: {e} `f = 2 * e` {f}. B3: {d, e, f} `c2 = d + e` {e, f, c2} `store c2 ca` {e, f} `e = e - 1` {f}. B4: {f} `load c3 ca` {f, c3} `b = f + c3` {b}.
5. *새 간섭 그래프:* ______
6. *다시 칠하기:* a, c0, b, c1, c2, c3, d, e, f 순으로 모두 빠진다(b는 처음에 이웃이 3이라 c0이 빠진 뒤에 빠진다). 색의 한 예: c0, a, c1, e에 r0, b, d, c2, c3에 r1, f에 r2.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. c를 읽는 문장 앞에 `load`, c에 쓰는 문장 뒤에 `store`를 넣고, 나올 때마다 새 이름을 붙인다. B0: `b = 3` / `c0 = 1` / `store c0 ca` / `f = 0`. B1: `load c1 ca` / `a = b + c1` / `d = -a` / `e = d + f`. B2: 그대로. B3: `c2 = d + e` / `store c2 ca` / `e = e - 1`. B4: `load c3 ca` / `b = f + c3`.
5. 간선 11개: b–c0, b–c1, b–f, a–f, c1–f, d–e, d–f, e–f, c2–e, c2–f, c3–f. 이웃 수는 c0 1, c1 2, c2 2, c3 1, a 1, b 3, d 2, e 3, f 7이다. 예전의 c는 이웃이 5였다.<br>
이웃이 3인 b와 e도 이웃 노드가 먼저 빠지면서 이웃이 줄어 빠진다. f는 이웃이 일곱이지만 맨 마지막에는 혼자 남아 빠진다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [56_register-spilling_impl.py](/Hongs_Blog/studies/compilers/code/56_register-spilling_impl/)</div>

</div>


## 문제 4 · 독립 문제

공통 프로그램에 레지스터 셋($$K = 3$$)을 나눠 주는데, 이번에는 c 대신 f를 메모리 자리 `fa`로 내보낸다. (가) 고쳐 쓴 코드 (나) 새 목록 (다) 새 간섭 그래프의 간선 (라) 이름 순으로 빼고 가장 작은 번호를 주는 색칠을 구하라. (마) f 대신 e를 `ea`로 내보내면 어떻게 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

**(가)** B0: `b = 3` / `c = 1` / `f0 = 0` / `store f0 fa`. B1: `a = b + c` / `d = -a` / `load f1 fa` / `e = d + f1`. B2: `f2 = 2 * e` / `store f2 fa`. B3: 그대로(`c = d + e` / `e = e - 1`). B4: `load f3 fa` / `b = f3 + c`.<br>
**(나)** B0: {} {b} {b, c} {b, c, f0} {b, c}. B1: {b, c} `a = b + c` {a, c} `d = -a` {c, d} `load f1 fa` {c, d, f1} `e = d + f1` {c, d, e}. B2: {c, e} `f2 = 2 * e` {c, f2} `store f2 fa` {c}. B3: {d, e} `c = d + e` {c, e} `e = e - 1` {c}. B4: {c} `load f3 fa` {c, f3} `b = f3 + c` {b}. 가장 큰 목록의 크기가 3이다.<br>
**(다)** 간선 11개: a–c, b–c, b–f0, c–d, c–e, c–f0, c–f1, c–f2, c–f3, d–e, d–f1.<br>
**(라)** 빼기: a, b, e, d, f0, f1, c, f2, f3 순으로 모두 빠진다(c는 이웃이 여덟이라 한참 뒤에 빠진다). 꺼내며 칠하면 f3 r0, f2 r0, c r1, f1 r0, f0 r0, d r2, e r0, b r2, a r0. 레지스터 셋으로 된다. `load` 둘, `store` 둘이 생겼다.<br>
**(마)** e를 내보내면 B1이 `a = b + c` / `d = -a` / `e0 = d + f` / `store e0 ea`가 된다. `e0 = d + f` 바로 뒤, `store` 앞의 목록이 {c, d, e0, f}다. 넷이 함께 살아 있으므로 서로 모두 이어지고, $$K = 3$$으로는 아직 막힌다. 하나를 더 내보내야 한다.<br>
**흔한 오답.** (라)에서 c가 이웃이 여덟이라 못 뺀다고 답한다. 이웃 수는 남은 그래프에서 센다. c의 이웃이 차례로 빠지고 나면 c도 빠진다. (마)에서 "e도 c처럼 서로 이어진 넷 가운데 하나이니 내보내면 풀린다"고 답한다. 내보낸 변수도 값을 만든 그 줄에서는 레지스터에 있어야 하고, 그 순간 다른 셋이 모두 살아 있으면 여전히 넷이 필요하다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [56_register-allocation-ladder_p4.py](/Hongs_Blog/studies/compilers/code/56_register-allocation-ladder_p4/)</div>

</div>
{% endraw %}
