---
layout: "note"
title: "지역 최적화 예제 사다리"
display_title: "지역 최적화 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "43"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 지역 최적화 기법 다섯 가지, 사용 가능한 식 분석, 생존 변수 분석."
prev_url: "/studies/compilers/tac-translation-practice/"
prev_title: "3주소 코드 변환 연습"
next_url: "/studies/compilers/global-dataflow-ladder/"
next_title: "전역 분석 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/compilers/local-optimization-ladder/"
---
{% raw %}
사용 개념: [지역 최적화 기법](/Hongs_Blog/studies/compilers/local-optimizations/) 다섯 가지, [사용 가능한 식 분석](/Hongs_Blog/studies/compilers/available-expressions/), [생존 변수 분석](/Hongs_Blog/studies/compilers/live-variable-analysis/).

"기본 블록 하나를 최적화하라"는 문제는 같은 하위목표의 되풀이다[^s1].

- ① *상수 접기:* 피연산자가 모두 상수인 줄을 미리 계산한다(있을 때만).
- ② *위에서 아래로:* 줄마다 직전 집합을 보고 복사 전파 → 공통 부분식 제거를 하고, 집합을 고친다(왼쪽 변수가 든 식을 빼고 새 식을 넣는다).
- ③ *아래에서 위로:* 블록 뒤에서 쓰이는 변수 집합에서 출발해, 왼쪽 변수가 집합에 없는 줄을 지우고, 남긴 줄은 집합에서 왼쪽을 빼고 오른쪽을 넣는다.
- ④ *확인:* 값을 하나 넣어 처음 코드와 고친 코드의 결과를 견준다.

## 문제 1 · 완전한 풀이

블록 뒤에서는 f만 쓰인다.

```
t0 = b + c
t1 = b + c
d = t0 * t1
e = d
f = e + t0
```

1. *상수 접기:* 그런 줄이 없다.
2. *위에서 아래로:*

| 원래 줄 | 고친 줄 | 한 일 | 직후의 집합 |
|---|---|---|---|
| `t0 = b + c` | 그대로 | | {`t0 = b + c`} |
| `t1 = b + c` | `t1 = t0` | 공통 부분식 제거 | {`t0 = b + c`, `t1 = t0`} |
| `d = t0 * t1` | `d = t0 * t0` | 복사 전파(t1 → t0) | 앞의 둘과 `d = t0 * t0` |
| `e = d` | 그대로 | | 앞의 셋과 `e = d` |
| `f = e + t0` | `f = d + t0` | 복사 전파(e → d) | 앞의 넷과 `f = d + t0` |

{: start="3"}
3. *아래에서 위로:* 처음 집합 {f}.

| 줄 | 바로 아래의 집합 | 판정 | 바로 위의 집합 |
|---|---|---|---|
| `f = d + t0` | {f} | 남긴다 | {d, t0} |
| `e = d` | {d, t0} | e가 없다 → 지운다 | 그대로 |
| `d = t0 * t0` | {d, t0} | 남긴다 | {t0} |
| `t1 = t0` | {t0} | t1이 없다 → 지운다 | 그대로 |
| `t0 = b + c` | {t0} | 남긴다 | {b, c} |

{: start="4"}
4. *확인:* 남은 코드는 `t0 = b + c`, `d = t0 * t0`, `f = d + t0`. b = 1, c = 2면 처음 코드도 고친 코드도 f = 12다.

## 문제 2 · 마지막 하위목표만 빈칸

블록 뒤에서는 x만 쓰인다.

```
t0 = a * b
t1 = t0
t2 = a * b
t3 = t1 + t2
x = t3
```

1. *상수 접기:* 없다.
2. *위에서 아래로:* 셋째 줄이 공통 부분식 제거로 `t2 = t0`가 된다. 넷째 줄은 집합에 `t1 = t0`와 `t2 = t0`가 있어 복사 전파로 `t3 = t0 + t0`가 된다. 다섯째 줄 `x = t3`는 그대로다(집합에 `t3 = …` 꼴의 복사가 없다).

```
t0 = a * b
t1 = t0
t2 = t0
t3 = t0 + t0
x = t3
```

{: start="3"}
3. *아래에서 위로:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

처음 {x}. `x = t3` 남긴다 → {t3}. `t3 = t0 + t0` 남긴다 → {t0}. `t2 = t0`는 t2가 없어 지운다. `t1 = t0`는 t1이 없어 지운다. `t0 = a * b` 남긴다 → {a, b}.<br>
남은 코드: `t0 = a * b`, `t3 = t0 + t0`, `x = t3`. 곱셈이 둘에서 하나로 줄었다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

블록 뒤에서는 s와 a가 쓰인다.

```
p = a + b
q = p
a = q * 2
r = a + b
s = q + r
```

1. *상수 접기:* 없다.
2. *위에서 아래로:* ______
3. *아래에서 위로:* 처음 {s, a}. `s = p + r` 남긴다 → {a, p, r}. `r = a + b` 남긴다 → {a, b, p}. `a = p * 2` 남긴다 → {b, p}. `q = p`는 q가 없어 지운다. `p = a + b` 남긴다 → {a, b}.
4. *확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. `p = a + b` 그대로, 집합 {`p = a + b`}. `q = p` 그대로, {`p = a + b`, `q = p`}. `a = q * 2`는 복사 전파로 `a = p * 2`. 이 줄이 a를 바꾸므로 `p = a + b`가 집합에서 빠져 {`q = p`, `a = p * 2`}. `r = a + b`는 그대로다. 첫 줄과 글자는 같지만 `p = a + b`가 집합에 없다. `s = q + r`은 복사 전파로 `s = p + r`.
4. 남은 코드: `p = a + b`, `a = p * 2`, `r = a + b`, `s = p + r`. a = 1, b = 2면 p = 3, a = 6, r = 8, s = 11이고 처음 코드와 같다. `r = a + b`를 `r = p`로 잘못 바꾸면 r = 3, s = 6이 되어 틀린다.

</details>


## 문제 4 · 독립 문제

블록 뒤에서는 z와 x가 쓰인다. (a) 최적화한 코드를 쓰라. (b) 산술 단순화를 더 할 수 있는 줄이 있는가? (c) 뒤에서 z만 쓰인다면 `x = …` 줄을 지울 수 있는가?

```
t0 = 3 * 4
t1 = x + t0
t2 = x + 12
y = t1
x = y + t2
t3 = x + 12
z = t3
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 상수 접기로 `t0 = 12`. 위에서 아래로: `t1 = x + 12`(복사 전파 t0 → 12), `t2 = t1`(공통 부분식 제거), `y = t1`, `x = t1 + t1`(복사 전파 y → t1, t2 → t1). 이 줄이 x를 바꾸므로 `t1 = x + 12`가 집합에서 빠진다. 그래서 `t3 = x + 12`는 그대로 남고, `z = t3`도 그대로다. 아래에서 위로({z, x}에서 출발): `t0 = 12`, `t2 = t1`, `y = t1`이 지워진다.
```
t1 = x + 12
x = t1 + t1
t3 = x + 12
z = t3
```
처음 x = 1이면 처음 코드도 고친 코드도 x = 26, z = 38로 끝난다.<br>
(b) `x = t1 + t1`은 `t1 * 2`와 같으므로 정수라면 `x = t1 << 1`로 바꿀 수 있다.<br>
(c) 지울 수 없다. 블록 뒤에서 x를 안 써도, 바로 아래의 `t3 = x + 12`가 x를 읽는다. `t3 = x + 12` 위의 집합이 {x}라서 `x = t1 + t1`은 남는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 중간 집합과 최종 코드, 고치기 전후 실행값(무작위 입력 300개씩) — [43_local-optimization-ladder_p4.py](/Hongs_Blog/studies/compilers/code/43_local-optimization-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드 p.20의 연습과 p.28~32, p.38~41의 추적을 연습하도록 만들었다. 하위목표 ②에서 복사 전파를 공통 부분식 제거보다 먼저 하는 순서는 슬라이드의 예가 그 순서로 풀리는 것에 맞췄다. 새 식의 오른쪽에 왼쪽 변수가 나오면 집합에 넣지 않는다(사용 가능한 식 분석 문서의 원본 오류 의심 참고). 답은 문제 코드로 확인했다.
{% endraw %}
