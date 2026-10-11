---
layout: "note"
title: "전역 분석 예제 사다리"
display_title: "전역 분석 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "45"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 전역 생존 변수 분석과 죽은 코드 제거, 전역 사용 가능한 식 분석과 복사 전파."
prev_url: "/studies/compilers/local-optimization-ladder/"
prev_title: "지역 최적화 예제 사다리"
next_url: "/studies/compilers/codegen-practice/"
next_title: "코드 생성 연습"
math: false
mermaid: false
code_count: 1
permalink: "/studies/compilers/global-dataflow-ladder/"
---
{% raw %}
사용 개념: [전역 생존 변수 분석](/Hongs_Blog/studies/compilers/global-live-variable-analysis/)과 죽은 코드 제거, [전역 사용 가능한 식 분석](/Hongs_Blog/studies/compilers/global-available-expressions/)과 복사 전파.

"제어 흐름 그래프가 주어지고 전역 최적화를 하라"는 문제는 늘 같은 하위목표의 반복이다. ① 방향과 출발 집합 정하기(생존 변수는 끝에서 거꾸로, 사용 가능한 식은 처음에서 앞으로) ② 블록 안을 한 줄씩 훑기 ③ 블록 사이에서 합치기(생존 변수는 합집합, 사용 가능한 식은 교집합) ④ 고리가 있으면 집합이 바뀌지 않을 때까지 되풀이하기 ⑤ 다 구한 집합으로 코드 고치기. 어느 분석인지는 고칠 것이 정한다. 줄을 지우려면 생존 변수, 변수를 값으로 바꾸거나 같은 계산을 없애려면 사용 가능한 식이다.

## 문제 1 · 완전한 풀이

B1 `a = c + d`, B2 `b = b + c; d = a + c`, B3 `c = a + b`, B4 `a = a + b; d = b + b`다. B1 → B2, B1 → B3, B2 → B4, B3 → B4이고 B4에서 B1로 되돌아가는 간선이 있다. 고리를 나간 뒤의 블록은 시작 목록이 {d}다. 죽은 코드를 지우라[^1].

1. *방향과 출발:* 줄을 지우는 문제이므로 생존 변수 분석이다. 끝에서 거꾸로 간다. B4의 끝 목록은 고리 다음 블록의 {d}에서 출발한다. 되돌아가는 간선의 몫(B1의 시작 목록)은 아직 모르므로 비워 둔다.
2. *블록 안 훑기(첫 바퀴):* B4: `d = b + b` 앞 {b}, `a = a + b` 앞 {a, b}. B2: 끝 {a, b}, `d = a + c` 앞 {a, b, c}, `b = b + c` 앞 {a, b, c}. B3: 끝 {a, b}, `c = a + b` 앞 {a, b}.
3. *합치기:* B1의 끝 = B2 시작 ∪ B3 시작 = {a, b, c}. `a = c + d` 앞 {b, c, d}.
4. *되풀이:* B4의 끝 = {d} ∪ {b, c, d} = {b, c, d}로 고치고 한 바퀴 더 돈다. B4: {b, c} / {a, b, c}. B2: 끝 {a, b, c}, 시작 {a, b, c}. B3: 끝 {a, b, c}, 시작 {a, b}. B1: 끝 {a, b, c}, 시작 {b, c, d}. B1의 시작이 그대로이므로 셋째 바퀴에서 바뀌는 것이 없다. 멈춘다.
5. *고치기:* B4에서 `a = a + b`는 그 뒤 목록 {b, c}에 a가 없어 지운다. 그러면 B4의 시작이 {b, c}가 되고, B2에서 `d = a + c`는 그 뒤 목록 {b, c}에 d가 없어 지운다. B3의 `c = a + b`와 B1의 `a = c + d`는 남는다.

결과: B1 `a = c + d`, B2 `b = b + c`, B3 `c = a + b`, B4 `d = b + b`.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [44_global-live-variable-analysis_impl.py](/Hongs_Blog/studies/compilers/code/44_global-live-variable-analysis_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

B1 `a = 1; b = a + b`, B2 `b = a + c`, B3 `c = a + b`, B4 `d = b + c`다. B1 → B2, B1 → B3, B2 → B4, B3 → B4이고 고리는 없다. 복사 전파와 공통 부분식 제거를 하라[^2].

1. *방향과 출발:* 변수를 값으로 바꾸는 문제이므로 사용 가능한 식 분석이다. 처음에서 앞으로 간다. B1의 시작 집합은 {}.
2. *블록 안 훑기:* B1: `a = 1` 뒤 {a = 1}. `b = a + b`를 지난 뒤에도 {a = 1}(자기를 읽어 자기에 넣는 줄은 집합에 넣지 않는다).
3. *합치기:* B2와 B3의 시작은 B1의 끝 {a = 1}. B2의 끝 {a = 1, b = a + c}, B3의 끝 {a = 1, c = a + b}. B4의 시작 = 두 끝의 교집합 = {a = 1}. B4의 끝 {a = 1, d = b + c}.
4. *되풀이:* 고리가 없어 한 번으로 끝난다.
5. *고치기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

시작 집합에 `a = 1`이 있는 블록에서 오른쪽의 a를 1로 바꾼다. B1 `b = a + b` → `b = 1 + b`(바로 윗줄의 `a = 1` 덕분), B2 `b = a + c` → `b = 1 + c`, B3 `c = a + b` → `c = 1 + b`. B4의 `d = b + c`에는 a가 없고, 오른쪽이 `b + c`인 식도 집합에 없어 그대로다.<br>
결과: B1 `a = 1; b = 1 + b`, B2 `b = 1 + c`, B3 `c = 1 + b`, B4 `d = b + c`. 고친 뒤 다시 분석하면 B2의 끝이 {a = 1, b = 1 + c}, B3의 끝이 {a = 1, c = 1 + b}이고 교집합은 여전히 {a = 1}이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [45_global-available-expressions_impl.py](/Hongs_Blog/studies/compilers/code/45_global-available-expressions_impl/)</div>

</div>


## 문제 3 · 하위목표 절반이 빈칸

고리 앞 블록이 `a = 1`로 끝난다. 고리 안은 B1 `b = a + b`, B2 `b = a + c`, B3 `c = a + b`, B4 `a = b + c`다. B1 → B2, B1 → B3, B2 → B4, B3 → B4이고 B4에서 B1로 되돌아간다. 복사 전파와 공통 부분식 제거를 하라[^3].

1. *방향과 출발:* 사용 가능한 식 분석. 고리 앞 블록의 끝 집합 {a = 1}이 B1의 첫 시작 집합이다.
2. *블록 안 훑기(첫 바퀴):* ______
3. *합치기:* B4의 시작 = B2 끝 ∩ B3 끝 = {a = 1}. B4의 끝 = {a = b + c}.
4. *되풀이:* ______
5. *고치기:* 다 구한 시작 집합으로 블록마다 고칠 줄을 찾는다. ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. B1: 시작 {a = 1}, 끝 {a = 1}. B2: 끝 {a = 1, b = a + c}. B3: 끝 {a = 1, c = a + b}.
4. B1의 시작 = {a = 1} ∩ (B4의 끝 {a = b + c}) = {}. 한 바퀴 더 돌면 B1 끝 {}, B2 끝 {b = a + c}, B3 끝 {c = a + b}, B4 시작 {}, B4 끝 {a = b + c}. 셋째 바퀴에서 바뀌는 것이 없어 멈춘다.
5. B1, B2, B3, B4의 시작 집합이 모두 {}다. 바꿀 수 있는 줄이 없다. 프로그램은 그대로다.<br>
첫 바퀴의 집합만 보고 B1을 `b = 1 + b`로 고쳤다면 틀린다. 고리를 한 바퀴 돌면 a는 `b + c`의 값이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [45_global-available-expressions_impl.py](/Hongs_Blog/studies/compilers/code/45_global-available-expressions_impl/)</div>

</div>


## 문제 4 · 독립 문제

B1 `s = 0; i = 0; k = 9`, B2 `t = i + 1; k = s + t`, B3 `s = s + t; u = k + 1`, B4 `s = s - t`, B5 `i = t; k = i + s`다. B1 → B2, B2 → B3, B2 → B4, B3 → B5, B4 → B5이고 B5에서 B2로 되돌아간다. 고리를 나간 뒤에는 s만 쓰인다[^s1].

(가) 블록마다 시작 목록과 끝 목록을 구하라(생존 변수). (나) 죽은 코드를 모두 지운 결과를 쓰라. (다) 사용 가능한 식 분석에서 B2의 시작 집합을 구하고, `t = i + 1`의 i를 0으로 바꿔도 되는지 답하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

**(가)** 첫 바퀴는 B5의 끝을 {s}로 둔다. B5: `k = i + s` 앞 {i, s}, `i = t` 앞 {s, t}. B3: 끝 {s, t}, `u = k + 1` 앞 {k, s, t}, 시작 {k, s, t}. B4: 끝 {s, t}, 시작 {s, t}. B2: 끝 {k, s, t} ∪ {s, t} = {k, s, t}, `k = s + t` 앞 {s, t}, 시작 {i, s}. 이제 B5의 끝을 {s} ∪ {i, s} = {i, s}로 고친다. 한 바퀴 더 돌아도 달라지는 곳은 B5의 끝 목록 하나뿐이고 B2의 시작은 그대로 {i, s}라서 멈춘다. B1: 끝 {i, s}, `k = 9` 앞 {i, s}, `i = 0` 앞 {s}, 시작 {}.<br>
**(나)** 다 구한 목록에서 바로 보이는 죽은 줄은 셋이다. B3의 `u = k + 1`(u는 어디서도 안 읽힌다), B5의 `k = i + s`(뒤 목록 {i, s}에 k가 없다), B1의 `k = 9`(뒤 목록 {i, s}에 k가 없다). `u = k + 1`을 지우면 k를 읽는 줄이 하나도 없다. 다시 분석하면 B2의 `k = s + t`도 죽은 줄이다. 결과: B1 `s = 0; i = 0`, B2 `t = i + 1`, B3 `s = s + t`, B4 `s = s - t`, B5 `i = t`. 열 줄 가운데 넷이 지워진다.<br>
**(다)** 첫 바퀴에는 B2의 시작이 B1의 끝 {s = 0, i = 0, k = 9}다. B5의 끝은 {i = t, k = i + s}다. B2의 시작 = {s = 0, i = 0, k = 9} ∩ {i = t, k = i + s} = {}. 바꾸면 안 된다. 둘째 바퀴에 B2로 돌아올 때 i는 0이 아니라 1이다. 두 바퀴 모두 B3으로 가면 원래 코드는 s = 1 + 2 = 3인데, i를 0으로 바꾼 코드는 s = 1 + 1 = 2다.<br>
**흔한 오답.** (나)에서 `k = s + t`를 남긴다. 처음 목록에서는 `u = k + 1`이 k를 읽으므로 살아 보인다. 줄을 지운 뒤에는 목록을 다시 구해야 한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [45_global-dataflow-ladder_p4.py](/Hongs_Blog/studies/compilers/code/45_global-dataflow-ladder_p4/)</div>

</div>


[^1]: 컴파일러 13회 강의 자료 「Lecture13 Code optimization part 2」, p.12~19 (고리가 있는 생존 변수 분석 예)
[^2]: 같은 자료, p.21~27 (전역 복사 전파의 단순한 예)
[^3]: 같은 자료, p.28~35 (고리가 있는 사용 가능한 식 분석 예)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 문제 4의 그래프와 물음, 하위목표 다섯 가지로 나눈 것, 문제 1~3의 풀이를 하위목표별로 적은 글은 원본에 없다. 문제 1~3의 집합과 결과는 슬라이드와 같고, 문제 4의 답은 문제 코드로 확인했다.
{% endraw %}
