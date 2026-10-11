---
layout: "note"
title: "사용 가능한 식 분석"
display_title: "사용 가능한 식 분석 (Available Expression Analysis)"
kind: "concept"
kind_label: "알고리즘"
num: "42"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
aliases: ["Available Expression Analysis", "Available Expressions", "사용 가능한 식", "가용 식", "가용 식 분석", "전방 분석", "Forward Analysis"]
description: "계산을 하면서 옆에 \"지금 믿어도 되는 등식\" 메모를 들고 다니는 것이다. 한 줄을 지날 때마다 그 줄이 값을 바꾼 변수가 들어간 메모는 지우고, 그 줄이 새로 만든 등식을 적는다. 다음 줄에서 메모에 이미 있는 계산을 또 하려 하면 메모의 결과를 가져다 쓰게 고친다. 위에서 아래…"
prev_url: "/studies/compilers/local-optimizations/"
prev_title: "지역 최적화 기법"
next_url: "/studies/compilers/live-variable-analysis/"
next_title: "생존 변수 분석"
math: true
mermaid: false
code_count: 1
permalink: "/studies/compilers/available-expressions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

계산을 하면서 옆에 "지금 믿어도 되는 등식" 메모를 들고 다니는 것이다. 한 줄을 지날 때마다 그 줄이 값을 바꾼 변수가 들어간 메모는 지우고, 그 줄이 새로 만든 등식을 적는다. 다음 줄에서 메모에 이미 있는 계산을 또 하려 하면 메모의 결과를 가져다 쓰게 고친다. 위에서 아래로 한 번만 훑으면 되어 빠르다. 다만 메모는 점프 없이 이어지는 구간 하나 안에서만 믿을 수 있고, 값이 바뀐 변수의 메모를 하나라도 안 지우면 틀린 코드가 나온다.

</div>


## 예시로 보기

[공통 부분식 제거와 복사 전파](/Hongs_Blog/studies/compilers/local-optimizations/)에는 "그 사이에 값이 바뀌지 않았다"는 조건이 붙는다. 사람은 눈으로 훑어 확인하지만 컴파일러는 그럴 수 없다. 줄마다 "여기서는 어떤 등식이 아직 맞는가"를 집합으로 들고 다니면, 조건 확인이 "집합에 있는가"를 묻는 일로 바뀐다.

세 줄짜리 블록에서 줄과 줄 사이마다 집합을 적는다[^1].

| 3주소 코드 | 그 지점의 사용 가능한 식 |
|---|---|
| | { } |
| `t0 = a * a` | |
| | {`t0 = a * a`} |
| `t1 = a * a` | |
| | {`t0 = a * a`, `t1 = a * a`} |
| `t0 = a + t1` | |
| | {`t1 = a * a`, `t0 = a + t1`} |

셋째 줄이 t0에 새 값을 넣었다. 그러자 `t0 = a * a`는 더는 맞는 말이 아니라서 집합에서 빠졌다. t0는 이제 `a * a`가 아니라 `a + t1`이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 아래 다섯 줄 추적의 집합과 고친 코드(슬라이드 p.28~32와 같음), 무작위 블록 3,000개에서 고치기 전후의 모든 변수 값이 같음, `x = x + 1` 반례, 카드 C2·C4의 답 — [42_available-expressions_impl.py](/Hongs_Blog/studies/compilers/code/42_available-expressions_impl/)</div>

</div>


## 정의

어떤 지점에서 식 `v = e`가 사용 가능하다(available)는 것은, 그 식에 나오는 변수들이 그 지점에서 최신 값을 갖고 있다는 뜻이다[^2]. 풀어 말하면, 그 줄이 실행된 뒤로 v도, e에 나오는 변수도 다시 대입되지 않았다. 그래서 그 지점에서 "v의 값 = e를 지금 계산한 값"이 맞는다[^s1].

사용 가능한 식 분석은 프로그램의 지점마다 사용 가능한 식의 집합을 구한다[^3]. 지점은 줄과 줄 사이의 자리다.

**집합을 만드는 규칙.** 블록의 위에서 아래로 간다[^3].

- 처음에는 사용 가능한 식이 없다. 집합은 { }다.
- 문장 `a = 연산`(예: `a = b + c`)을 지날 때마다
    - a가 들어 있는 식은 모두 무효가 된다. 집합에서 뺀다. 왼쪽에 a가 있는 식도, 오른쪽에 a가 있는 식도 뺀다.
    - 새 식 `a = 연산`이 사용 가능해진다. 집합에 넣는다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: p.23 "Whenever we check a statement a = operation … Any expression holding a is invalidated!! The new expression a = operation becomes available". / 문제점: 오른쪽에 자기 자신이 나오는 대입 `x = x + 1`에서는 새 식 `x = x + 1`을 넣으면 안 된다. 이 줄을 지난 뒤 "x의 값 = x + 1"은 맞는 말이 아니다. 넣어 두면 다음 줄 `y = x + 1`을 `y = x`로 잘못 고친다. / 수정안: 새 식의 오른쪽에 왼쪽 변수가 나오면 집합에 넣지 않는다(빼기만 한다). / 근거: `x = x + 1`, `y = x + 1`을 x = 1로 실행하면 y = 3이다. 규칙을 글자 그대로 따라 고친 `y = x`는 y = 2를 낸다(42_available-expressions_impl.py). 슬라이드의 예에 나오는 `t0 = t0 + t0`는 집합에 넣기 전에 `t0 = t2`로 고쳐져서 이 문제가 드러나지 않는다. 13회 강의 p.22는 `b = a + b`를 `b = 1 + b`로 고친 뒤의 집합을 {`a = 1`} 그대로 두어, 실제로는 이 수정안대로 한다.

</div>


**집합으로 코드 고치기.** 한 줄을 지나기 직전에, 그 지점의 집합을 보고 그 줄을 고친다.

- *공통 부분식 제거.* 지금 줄이 `b = 연산1`이고 집합에 오른쪽이 같은 `a = 연산1`이 있으면, 지금 줄의 오른쪽을 a로 바꾼다. `b = a`가 된다[^4].
- *복사 전파.* 지금 줄의 오른쪽에 b가 나오고 집합에 `b = a`(또는 `b = 상수`)가 있으면, 지금 줄의 b를 a(또는 그 상수)로 바꾼다[^5].

| 집합 | 지금 줄 | 고친 줄 | 기법 |
|---|---|---|---|
| {`t0 = a * a`} | `t1 = a * a` | `t1 = t0` | 공통 부분식 제거 |
| {`b = a`} | `t1 = a * b` | `t1 = a * a` | 복사 전파 |

고친 다음에 위의 규칙으로 집합을 고친다. 집합에 넣는 것은 고친 뒤의 줄이다.

### 의사코드

```
입력: 기본 블록의 대입문 s_1 .. s_n      출력: 고친 블록
집합 = { }
위에서 아래로 각 문장 (x = 오른쪽)에 대해:
    (1) 복사 전파: 오른쪽의 변수 b마다, 집합에 (b = c)가 있으면 b를 c로 바꾼다
    (2) 공통 부분식 제거: 오른쪽이 연산이고 집합에 (v = 같은 오른쪽)이 있으면 오른쪽을 v로 바꾼다
    (3) 집합에서 x가 들어 있는 식을 모두 뺀다
    (4) 오른쪽에 x가 없으면 (x = 오른쪽)을 집합에 넣는다
```

### 정확성

**주장.** 블록의 어느 지점에서든, 집합에 든 식 `v = e`는 그 지점에서 등식으로 참이다. 곧 v의 값이 e를 그 지점의 변수 값으로 계산한 값과 같다. 그래서 (1), (2)로 고친 줄은 고치기 전과 같은 값을 계산한다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

문장을 하나씩 지나며 주장이 계속 맞는지 본다(반복문의 불변식).
1. **처음.** 집합이 비어 있으므로 주장은 맞다. — 빈 집합
2. **고치기 (1), (2).** 집합의 `b = c`가 참이므로 b를 c로 바꿔 읽어도 값이 같다. 집합의 `v = e`가 참이므로 e를 계산하는 대신 v를 읽어도 값이 같다. — 직전 지점에서 주장이 맞다는 가정
3. **빼기 (3).** 문장 `x = 오른쪽`은 x의 값만 바꾼다. x가 나오지 않는 식은 양쪽의 값이 하나도 바뀌지 않아 여전히 참이다. x가 나오는 식은 참인지 알 수 없게 됐으므로 뺀다. — 대입은 변수 하나만 바꾼다
4. **넣기 (4).** 오른쪽에 x가 없으면, 이 문장을 실행해도 오른쪽에 나오는 변수의 값은 그대로다. 실행 직후 x에는 오른쪽을 계산한 값이 들어 있으므로 `x = 오른쪽`이 참이다. 오른쪽에 x가 있으면 x가 바뀌면서 오른쪽의 값도 바뀌어 참이라고 할 수 없다. 그래서 넣지 않는다. — 4의 조건이 왜 필요한가
5. 결론: 모든 지점에서 주장이 맞고, 고친 블록은 원래 블록과 모든 변수에 같은 값을 남긴다. ∎

</details>


무작위로 만든 블록 3,000개를 고치기 전후로 실행해 모든 변수의 값이 같은 것을 실험으로도 확인했다. 같은 방식으로 만든 블록에 (4)의 조건을 빼고 돌리면 값이 어긋나는 블록이 나온다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3단계에서 "x가 나오지 않는 식은 여전히 참"이라고 할 수 있는 근거는?</summary>

대입문 하나는 왼쪽 변수 x 하나의 값만 바꾼다. 식 `v = e`에 x가 없으면 v의 값도, e에 나오는 변수들의 값도 그대로다. 양쪽 값이 그대로이니 등식도 그대로 참이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 4단계에서 "오른쪽에 x가 없으면"이 왜 필요한가?</summary>

`x = x + 1`을 실행하기 전 x가 1이면 실행 뒤 x는 2다. 이때 "x = x + 1"을 등식으로 읽으면 2 = 3이라 거짓이다. 오른쪽을 계산할 때 쓴 x(1)와 실행 뒤의 x(2)가 다르기 때문이다. 오른쪽에 x가 없으면 오른쪽 값이 실행 전후로 같아서 이런 일이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 의사코드에서 (1), (2)를 (3), (4)보다 먼저 하는 이유는?</summary>

(1), (2)는 이 줄을 실행하기 직전의 집합을 써야 한다. `t0 = t0 + t0`를 고칠 때 집합의 `t2 = t0 + t0`가 필요한데, (3)을 먼저 하면 t0가 든 이 식이 빠져 버려 고칠 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 분석의 핵심 아이디어는?</summary>

"고쳐도 되는가"라는 질문을 줄마다 다시 따지지 않고, "지금 참인 등식의 집합"을 한 줄 지날 때마다 조금씩 고쳐 가며 들고 다닌다. 고쳐도 되는지는 집합에 있는지로 답한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

블록을 넘어 제어 흐름 그래프 전체에서 같은 집합을 구하는 [전역 사용 가능한 식 분석](/Hongs_Blog/studies/compilers/global-available-expressions/). 방향만 거꾸로인 [생존 변수 분석](/Hongs_Blog/studies/compilers/live-variable-analysis/). 반복문이 돌 때마다 맞는 성질을 붙잡고 정확성을 보이는 [루프 불변식](/Hongs_Blog/studies/algorithms/induction-loop-invariant/).

</details>


### 복잡도

블록이 $$n$$줄이면 집합에는 많아야 $$n$$개의 식이 있다. 한 줄마다 집합을 한 번 훑으므로 전체는 $$O(n^2)$$이다. 블록을 한 번만 지난다[^s2].

## 예제

다섯 줄 블록을 추적한다[^6].

| 지금 줄 (원래) | 직전의 집합 | 고친 줄 | 한 일 | 직후의 집합 |
|---|---|---|---|---|
| `t0 = a * a` | { } | `t0 = a * a` | | {`t0 = a * a`} |
| `t1 = a * a` | {`t0 = a * a`} | `t1 = t0` | 공통 부분식 제거 | {`t0 = a * a`, `t1 = t0`} |
| `t2 = t0 + t1` | 위와 같다 | `t2 = t0 + t0` | 복사 전파(t1 → t0) | {`t0 = a * a`, `t1 = t0`, `t2 = t0 + t0`} |
| `t0 = t0 + t0` | 위와 같다 | `t0 = t2` | 공통 부분식 제거 | {`t0 = t2`} |
| `t3 = t0 + 1` | {`t0 = t2`} | `t3 = t2 + 1` | 복사 전파(t0 → t2) | {`t0 = t2`, `t3 = t2 + 1`} |

1. *넷째 줄에서 집합이 확 줄어든다.* 이 줄이 t0에 새 값을 넣는다. t0가 들어 있는 `t0 = a * a`, `t1 = t0`, `t2 = t0 + t0`가 모두 빠지고 새 식 `t0 = t2`만 남는다.
2. *고친 블록.* `t0 = a * a`, `t1 = t0`, `t2 = t0 + t0`, `t0 = t2`, `t3 = t2 + 1`. 곱셈이 둘에서 하나로, 덧셈이 셋에서 둘로 줄었다. 줄 수는 그대로 다섯이다.
3. *남은 일.* `t1 = t0`와 `t0 = t2`는 뒤에서 읽히지 않으면 쓸모없다. 이것을 지우는 일은 [생존 변수 분석](/Hongs_Blog/studies/compilers/live-variable-analysis/)이 한다.

a = 3이면 원래 블록도 고친 블록도 t3 = 19다.

## 활용

- 구현: [42_available-expressions_impl.py](/Hongs_Blog/studies/compilers/code/42_available-expressions_impl/). 연습: [지역 최적화 예제 사다리](/Hongs_Blog/studies/compilers/local-optimization-ladder/)
- 이 분석은 블록 하나 안에서만 쓴다. 블록에 들어올 때의 집합을 { }로 두는 것은 "앞 블록에서 무엇이 계산됐는지 모른다"는 뜻이다. 앞 블록의 정보를 넘겨받으려면 [전역 사용 가능한 식 분석](/Hongs_Blog/studies/compilers/global-available-expressions/)이 필요하다.
- 흔한 실수: 왼쪽에 그 변수가 있는 식만 빼고 오른쪽에 있는 식을 남긴다. 고치기 전의 줄을 집합에 넣는다. 복사 전파를 할 때 `b = a`의 방향을 뒤집어 a를 b로 바꾼다.

## 연결

- 선수: [지역 최적화 기법](/Hongs_Blog/studies/compilers/local-optimizations/), [기본 블록과 제어 흐름 그래프](/Hongs_Blog/studies/compilers/basic-block-cfg/)
- 짝이 되는 분석: [생존 변수 분석](/Hongs_Blog/studies/compilers/live-variable-analysis/). 둘의 차이: [사용 가능한 식과 생존 변수 비교](/Hongs_Blog/studies/compilers/available-vs-live/)
- 집합에 넣고 빼고 찾는 일: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"블록 안에서 한 번 계산한 식은 블록 끝까지 사용 가능하다"</div>

틀렸다. 그 식에 나오는 변수 가운데 하나라도 다시 대입되면 그 자리에서 무효가 된다. `t0 = a * b`, `a = a + 1`, `t1 = a * b`에서 둘째 줄이 a를 바꾸므로 그 뒤에는 `t0 = a * b`가 집합에 없다. a = 2, b = 3이면 t0 = 6, t1 = 9다. `t1 = t0`로 고치면 틀린다. 그럴듯해 보이는 이유는 블록 안에는 점프가 없어서 "윗줄은 반드시 실행됐다"고 믿을 수 있기 때문이다. 실행된 것은 맞다. 다만 실행된 뒤에 값이 바뀌었을 수 있다. 확인하는 법: 두 줄 사이에 그 식의 변수(왼쪽 변수 포함)를 왼쪽에 둔 대입이 있는지 찾는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 사용 가능한 식의 뜻과, 문장 `a = 연산`을 지날 때 집합을 고치는 두 가지 일을 쓰라. 처음 집합은 무엇인가?</summary>

**답:** 식에 나오는 변수들이 그 지점에서 최신 값을 갖고 있으면 그 식은 사용 가능하다. 처음 집합은 { }다. 문장 `a = 연산`을 지나면 ① a가 들어 있는 식을 모두 집합에서 빼고 ② 새 식 `a = 연산`을 집합에 넣는다(오른쪽에 a가 나오면 넣지 않는다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 블록 `b = a` / `c = b + 1` / `a = 7` / `d = b + 1`을 위에서 아래로 분석하며 고쳐라. 줄마다 고친 줄과 직후의 집합을 쓰라.</summary>

**답:** ① `b = a` 그대로, {`b = a`}. ② 복사 전파로 `c = a + 1`, {`b = a`, `c = a + 1`}. ③ `a = 7` 그대로. a가 든 두 식이 모두 빠져 {`a = 7`}. ④ `d = b + 1` 그대로, {`a = 7`, `d = b + 1`}.<br>
**이유:** 넷째 줄은 둘째 줄과 원래 글자가 같지만 `d = c`로 고치지 못한다. 셋째 줄에서 a가 바뀌면서 `c = a + 1`이 집합에서 빠졌다. 값으로 보면 d와 c는 사실 같지만(b는 안 바뀌었다), 이 분석은 둘째 줄을 `c = a + 1`로 고쳐 적어 두었기 때문에 그것을 알아보지 못한다. 안전한 쪽으로 틀리는 것이라 코드는 여전히 맞다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 (3) "집합에서 x가 들어 있는 식을 모두 뺀다"가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 이 줄이 x의 값을 바꿨으므로, x의 옛 값을 전제로 적어 둔 등식을 모두 버려서 집합에 지금도 참인 등식만 남긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "새 식은 늘 집합에 넣는다"는 규칙을 글자 그대로 따르면 틀린 코드가 나오는 두 줄짜리 블록을 만들고, 값으로 확인하라.</summary>

**답:** `x = x + 1` / `y = x + 1`. 첫 줄 뒤 집합에 `x = x + 1`을 넣으면 둘째 줄의 오른쪽 `x + 1`이 집합에 있어 `y = x`로 고쳐진다. x = 1로 시작하면 원래 코드는 x = 2, y = 3인데 고친 코드는 y = 2다.<br>
**이유:** 대입 `x = x + 1`은 등식 "x = x + 1"을 참으로 만들지 않는다. 오른쪽의 x는 옛 값, 왼쪽의 x는 새 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 넷째 줄 `t0 = t0 + t0`를 지나자 집합이 식 셋에서 하나로 줄었다. 왜 그렇게 많이 빠지는가? 이 뒤에 `t5 = a * a`가 오면 공통 부분식 제거를 할 수 있는가?</summary>

**답:** t0에 새 값이 들어가므로 t0가 들어 있는 식이 모두 무효다. `t0 = a * a`는 왼쪽에, `t1 = t0`와 `t2 = t0 + t0`는 오른쪽에 t0가 있다. 그 뒤의 `t5 = a * a`는 고칠 수 없다. `a * a`를 담고 있던 t0가 덮어써졌고, 그 값을 복사해 둔 `t1 = t0`도 집합에서 빠졌다.

</details>


[^1]: 컴파일러 12회 강의 자료 「Lecture12 Code optimization part 1」, p.23 (세 줄 예의 집합 표)
[^2]: 같은 자료, p.22 (사용 가능한 식의 뜻, 공통 부분식 제거와 복사 전파에 쓴다)
[^3]: 같은 자료, p.23 (지점마다 집합을 구한다, 처음은 빈 집합, 문장을 지날 때의 두 규칙)
[^4]: 같은 자료, p.24~25 (집합으로 공통 부분식 제거)
[^5]: 같은 자료, p.26~27 (집합으로 복사 전파, b = a 또는 b = 상수)
[^6]: 같은 자료, p.28~32 (다섯 줄 예의 추적)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> "등식으로 참"이라는 풀이, 정확성 주장과 증명, 스스로 설명해 보기, 오해 항목의 예는 원본에 없다. 슬라이드는 규칙과 예만 준다. 증명은 직접 썼고, 무작위 블록 3,000개 실험은 증명과 별개의 확인이다. Aho 외, *Compilers* 2판 9.2.6절(사용 가능한 식)이 같은 개념을 블록 사이로 넓혀 다룬다. 메모 비유도 원본에 없다. 실제 집합에는 등식만 들어가고, 지우는 기준은 "값이 바뀐 변수가 나오는가" 하나다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 의사코드와 복잡도는 원본에 없다. 의사코드의 (1)~(3)은 슬라이드 p.23~27의 규칙을 차례로 적은 것이고, (4)의 조건은 위 원본 오류 의심의 수정안이다. 식을 해시 표에 담으면 더 빨라지지만 이 문서의 구현은 집합을 차례로 훑는다.
{% endraw %}
