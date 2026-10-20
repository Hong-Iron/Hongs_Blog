---
layout: "note"
title: "생존 변수 분석"
display_title: "생존 변수 분석 (Live Variable Analysis)"
kind: "concept"
kind_label: "알고리즘"
num: "43"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Live Variable Analysis", "Liveness Analysis", "Live Variable", "생존 변수", "살아 있는 변수", "활성 변수", "죽은 코드 제거", "Dead Code Elimination", "후방 분석", "Backward Analysis"]
description: "이삿짐을 쌀 때 \"새집에서 쓸 물건\"만 챙기려면, 새집에서 할 일부터 거꾸로 떠올려 보면 된다. 코드에서도 맨 아랫줄부터 거꾸로 올라가며 \"여기서부터 뒤에서 값이 읽힐 변수\"의 목록을 들고 다닌다. 어떤 줄이 값을 넣는 변수가 그 목록에 없으면, 그 줄은 아무도 안 쓸 값을 만든 …"
prev_url: "/studies/compilers/available-expressions/"
prev_title: "사용 가능한 식 분석"
next_url: "/studies/compilers/global-live-variable-analysis/"
next_title: "전역 생존 변수 분석"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "43_live-variable-analysis_impl.py", "u": "/studies/compilers/code/43_live-variable-analysis_impl/", "r": "구현"}]
permalink: "/studies/compilers/live-variable-analysis/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이삿짐을 쌀 때 "새집에서 쓸 물건"만 챙기려면, 새집에서 할 일부터 거꾸로 떠올려 보면 된다. 코드에서도 맨 아랫줄부터 거꾸로 올라가며 "여기서부터 뒤에서 값이 읽힐 변수"의 목록을 들고 다닌다. 어떤 줄이 값을 넣는 변수가 그 목록에 없으면, 그 줄은 아무도 안 쓸 값을 만든 것이라 지운다. 한 번만 훑으면 쓸모없는 줄이 연달아 사라진다. 다만 출발할 때 "이 구간이 끝난 뒤에도 쓰이는 변수"를 알고 있어야 하고, 그것을 잘못 알면 필요한 줄을 지우게 된다.

</div>


## 예시로 보기

[죽은 코드 제거](/Hongs_Blog/studies/compilers/local-optimizations/)는 "넣은 값이 뒤에서 한 번도 안 읽히는 대입"을 지운다. 뒤에서 읽히는지는 그 줄보다 아래를 봐야 안다. 위에서 아래로 가면 아직 안 본 줄에 달린 질문이라 답할 수 없다. 아래에서 위로 가면 이미 본 줄에 달린 질문이 된다.

세 줄짜리 블록이 있고, 이 블록 뒤에서 b와 d의 값이 쓰인다. 줄과 줄 사이마다 "여기서부터 뒤에서 읽힐 변수"를 적는다. 아래에서 위로 채운다.

| 3주소 코드 | 그 지점의 생존 변수 |
|---|---|
| | {b} |
| `a = b` | |
| | {a, b} |
| `c = a + b` | |
| | {a, b} |
| `d = a` | |
| (뒤에서 b와 d가 쓰인다) | {b, d} |

맨 아래 {b, d}에서 출발한다. `d = a`를 거꾸로 지나면, d는 이 줄이 새로 넣으므로 그 위에서는 필요 없고, a는 이 줄이 읽으므로 필요하다. {a, b}가 된다. `c = a + b`를 지나면 c를 빼고(원래 없다) a, b를 넣어 {a, b} 그대로다.

`c = a + b`의 바로 아래 집합 {a, b}에 c가 없다. c에 넣은 값은 뒤에서 아무도 읽지 않는다. 이 줄은 죽은 코드다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 아래 `d = a + c`와 `a = a + c`의 한 줄 예 둘, 아래 다섯 줄 추적, 무작위 블록 3,000개에서 지우기 전후에 블록 뒤에서 쓰이는 변수의 값이 같음, 카드 C2·C5의 답 — [43_live-variable-analysis_impl.py](/Hongs_Blog/studies/compilers/code/43_live-variable-analysis_impl/)</div>

</div>


## 정의

어떤 지점에서 변수가 살아 있다(live)는 것은, 그 변수가 지금 가진 값이 앞으로 필요하다는 뜻이다. 풀어 말하면, 그 지점부터 실행해 나갈 때 그 변수에 새 값을 넣기 전에 먼저 읽는 줄이 있다[^s1].

생존 변수 분석은 지점마다 살아 있는 변수의 집합을 구한다. 변수가 앞으로 쓰일지 알아야 하므로, 기본 블록의 문장을 거꾸로 본다.

**집합을 만드는 규칙.** 블록의 아래에서 위로 간다.

- 처음에는 살아 있다고 알려진 변수 몇 개로 시작한다. 예를 들면 다음 블록에서 쓰일 변수다.
- 문장 `a = … b …`를 실행하기 직전에는
    - a는 살아 있지 않다. 이 줄이 a에 새 값을 덮어쓰므로 그 전의 값은 필요 없다.
    - b는 살아 있다. 이 줄이 b를 읽기 때문이다.

문장 바로 아래의 집합을 $$\text{뒤}$$, 바로 위의 집합을 $$\text{앞}$$이라 하면 한 식으로 쓸 수 있다. 뒤에서 왼쪽 변수를 빼고, 오른쪽에서 읽는 변수들을 더한다[^s1].

$$\text{앞} = (\text{뒤} \setminus \{a\}) \cup \{\text{오른쪽에서 읽는 변수들}\}$$


$$\setminus$$는 "빼기"(차집합), $$\cup$$는 "합치기"(합집합)다. 빼는 것을 먼저 한다. `d = a + c`에서 뒤가 {b, d}면 앞은 $$(\{b, d\} \setminus \{d\}) \cup \{a, c\} = \{a, b, c\}$$다.

같은 변수가 양쪽에 다 나오는 `a = a + c`에서 순서가 드러난다. 뒤가 {b, d}면 a를 빼고(원래 없다) a, c를 넣어 앞은 {a, b, c, d}다. a는 이 줄이 덮어쓰지만, 덮어쓰기 전에 먼저 읽으므로 위에서는 살아 있다. 넣고 나서 빼면 a가 빠져 {b, c, d}가 되어 틀린다.

**집합으로 죽은 코드 지우기.** 지금 줄이 `b = 연산1`이고 이 줄 바로 아래에서 b가 살아 있지 않으면, 이 줄을 지운다.

| 지금 줄 | 바로 아래의 집합 | 판정 |
|---|---|---|
| `t1 = a * a` | {a} | t1이 집합에 없다 → 지운다 |

지운 줄은 없던 줄이 되므로 집합을 고치지 않는다. 지운 줄이 읽던 변수를 집합에 넣지 않는다는 점이 중요하다.

### 의사코드

```
입력: 기본 블록의 대입문 s_1 .. s_n, 블록 뒤에서 쓰이는 변수 집합      출력: 고친 블록
집합 = 블록 뒤에서 쓰이는 변수 집합
아래에서 위로 각 문장 (x = 오른쪽)에 대해:
    x가 집합에 없으면:
        이 문장을 지운다                         # 집합은 그대로
    있으면:
        집합에서 x를 뺀다
        오른쪽에서 읽는 변수를 모두 집합에 넣는다
```

### 정확성

**주장.** 블록의 어느 지점에서든, 집합에 없는 변수의 값은 그 지점 뒤의 실행 결과에 영향을 주지 않는다. 그래서 집합에 없는 변수에 값을 넣는 줄을 지워도, 블록 뒤에서 쓰이는 변수들의 값은 달라지지 않는다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

아래에서 위로 올라가며 주장이 계속 맞는지 본다.
1. **맨 아래.** 집합은 블록 뒤에서 쓰이는 변수 전부다. 집합에 없는 변수는 블록 뒤에서 읽히지 않으므로 그 값은 결과에 영향이 없다. — 처음 집합의 뜻
2. **지우는 경우.** 문장 `x = 오른쪽` 아래에서 x가 집합에 없다. 이 문장은 x의 값만 바꾸고, 가정에 따라 그 지점의 x 값은 뒤의 결과에 영향이 없다. 그러니 이 문장을 실행하든 안 하든 뒤의 결과가 같다. 문장을 지우면 위아래 지점이 같은 지점이 되므로 집합도 같다. — 아래 지점에서 주장이 맞다는 가정
3. **남기는 경우.** 문장 위 지점에서 어떤 변수 v가 새 집합에 없다고 하자. v는 오른쪽에서 읽는 변수가 아니다. v가 x가 아니면 이 문장은 v를 건드리지 않고, v는 아래 집합에도 없었으므로 영향이 없다. v가 x이면(오른쪽에 x가 없는 경우) 이 문장이 x를 덮어쓰므로 위 지점의 x 값은 사라져 영향이 없다. — 대입은 오른쪽만 읽고 왼쪽만 바꾼다
4. 결론: 모든 지점에서 주장이 맞다. 지운 줄은 모두 2의 경우이므로 고친 블록은 블록 뒤에서 쓰이는 변수에 같은 값을 남긴다. ∎

</details>


무작위로 만든 블록 3,000개에서, 지우기 전후 코드가 블록 뒤에서 쓰이는 변수에 같은 값을 남기는 것을 실험으로도 확인했다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2단계에서 "실행하든 안 하든 뒤의 결과가 같다"는 무엇에서 나오는가?</summary>

두 가지다. 대입문은 왼쪽 변수 x 하나만 바꾼다. 그리고 x가 아래 집합에 없으므로, 귀납 가정에 따라 그 지점의 x 값은 뒤의 결과에 영향을 주지 않는다. 바뀌는 것이 영향 없는 값 하나뿐이니 결과가 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 지운 줄이 읽던 변수를 집합에 넣지 않는 이유는?</summary>

지운 줄은 실행되지 않는다. 실행되지 않는 줄은 아무 변수도 읽지 않는다. 넣어 버리면 그 변수에 값을 넣는 윗줄이 "쓰이는 줄"로 보여 지워지지 않는다. `x = a + 1`, `y = x * 2`, `z = y + 3`에서 뒤에 a만 쓰인다면, 지우면서 올라가면 세 줄이 모두 사라진다. 분석만 먼저 하고 나중에 지우면 `z = y + 3` 하나만 사라지고 다시 분석해야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 식에서 빼기를 합치기보다 먼저 하는 이유는?</summary>

`a = a + c`처럼 같은 변수를 읽고 쓰는 줄 때문이다. 이 줄은 a의 옛 값을 읽은 다음 새 값을 넣는다. 거꾸로 올라갈 때는 "새 값을 넣는다"(빼기)를 먼저 되돌리고 "옛 값을 읽는다"(넣기)를 나중에 되돌려야 한다. 그래야 위에서 a가 살아 있다고 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 분석의 핵심 아이디어는?</summary>

"앞으로 쓰이는가"는 미래에 대한 질문이라, 미래 쪽에서 출발해 거꾸로 오면 이미 아는 것만으로 답할 수 있다. 한 줄을 지날 때 집합을 "덮어쓰는 것은 빼고 읽는 것은 넣는다"로 고친다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

블록을 넘어 그래프 전체에서 같은 집합을 구하는 [전역 생존 변수 분석](/Hongs_Blog/studies/compilers/global-live-variable-analysis/). 같은 때에 살아 있는 변수끼리는 같은 레지스터를 쓸 수 없다는 데서 출발하는 [레지스터 간섭 그래프](/Hongs_Blog/studies/compilers/register-interference-graph/).

</details>


### 복잡도

블록이 $$n$$줄이면 한 번 훑는다. 줄마다 집합에서 변수 몇 개를 빼고 넣으므로 시간은 $$O(n)$$이다(집합에 넣고 빼는 일을 상수 시간으로 볼 때).

## 예제

[사용 가능한 식 분석](/Hongs_Blog/studies/compilers/available-expressions/)으로 고친 다섯 줄 블록을 이어서 다듬는다. 블록 뒤에서는 t3만 쓰인다.

| 순서 | 지금 줄 | 바로 아래의 집합 | 판정 | 바로 위의 집합 |
|---|---|---|---|---|
| 1 | `t3 = t2 + 1` | {t3} | t3이 있다 → 남긴다 | {t2} |
| 2 | `t0 = t2` | {t2} | t0가 없다 → 지운다 | {t2} 그대로 |
| 3 | `t2 = t0 + t0` | {t2} | t2가 있다 → 남긴다 | {t0} |
| 4 | `t1 = t0` | {t0} | t1이 없다 → 지운다 | {t0} 그대로 |
| 5 | `t0 = a * a` | {t0} | t0가 있다 → 남긴다 | {a} |

1. *아래에서 위로.* 표의 순서는 코드의 마지막 줄부터다.
2. *같은 이름, 다른 판정.* `t0 = t2`(순서 2)는 지워지고 `t0 = a * a`(순서 5)는 남는다. 둘 다 t0에 넣지만, 앞의 것은 그 뒤에서 t0를 읽는 줄이 없고 뒤의 것은 `t2 = t0 + t0`가 읽는다.
3. *고친 블록.* `t0 = a * a`, `t2 = t0 + t0`, `t3 = t2 + 1` 세 줄.

처음 생성기가 만든 블록은 `t0 = a * a`, `t1 = a * a`, `t2 = t0 + t1`, `t0 = t0 + t0`, `t3 = t0 + 1`이었다. 곱셈 둘과 덧셈 셋이 두 분석을 거쳐 곱셈 하나와 덧셈 둘이 됐다. a = 3이면 처음 블록도 마지막 블록도 t3 = 19다.

**처음 집합이 답을 바꾼다.** 같은 블록에서 뒤에 t1도 쓰인다면(처음 집합 {t1, t3}) `t1 = t0`는 남는다. 뒤에 t0만 쓰인다면(처음 집합 {t0}) `t0 = t2`가 남고 `t3 = t2 + 1`이 지워진다[^s3].

## 활용

- 구현: [43_live-variable-analysis_impl.py](/Hongs_Blog/studies/compilers/code/43_live-variable-analysis_impl/). 연습: [지역 최적화 예제 사다리](/Hongs_Blog/studies/compilers/local-optimization-ladder/)
- 처음 집합("블록 뒤에서 쓰이는 변수")은 블록 하나만 봐서는 알 수 없다. 이 문서의 예는 그것을 문제에서 준다. 컴파일러가 스스로 구하려면 다음 블록들을 봐야 한다: [전역 생존 변수 분석](/Hongs_Blog/studies/compilers/global-live-variable-analysis/)
- 지워도 되는 것은 값을 넣기만 하는 대입이다. 오른쪽이 함수 호출이면 그 함수가 화면에 찍거나 다른 값을 바꿀 수 있어서, 결과를 안 쓴다고 호출까지 지우면 프로그램의 동작이 달라진다[^s3].
- 흔한 실수: 위에서 아래로 훑는다. 넣기를 빼기보다 먼저 한다. 지운 줄이 읽던 변수를 집합에 넣는다. 처음 집합을 { }로 둔다(그러면 모든 줄이 지워진다).

## 연결

- 선수: [지역 최적화 기법](/Hongs_Blog/studies/compilers/local-optimizations/), [기본 블록과 제어 흐름 그래프](/Hongs_Blog/studies/compilers/basic-block-cfg/)
- 짝이 되는 분석: [사용 가능한 식 분석](/Hongs_Blog/studies/compilers/available-expressions/)은 위에서 아래로 가며 식을 모으고, 이 분석은 아래에서 위로 가며 변수를 모은다: [사용 가능한 식과 생존 변수 비교](/Hongs_Blog/studies/compilers/available-vs-live/)
- 집합의 빼기와 합치기: [집합](/Hongs_Blog/studies/discrete-math/sets/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"뒤쪽 코드에 그 변수의 이름이 한 번이라도 나오면 살아 있다"</div>

틀렸다. 뒤에서 읽기 전에 먼저 덮어쓰면 지금 값은 죽은 것이다. `x = a + b`, `y = x * 2`, `x = 5`, `z = x + y`에서 둘째 줄 바로 아래를 보자. 뒤에 `z = x + y`가 있어 x라는 이름이 나오지만, 그 사이의 `x = 5`가 먼저 x를 덮어쓴다. `z`가 읽는 것은 5이고, 첫 줄이 넣은 값이 아니다. 그 지점의 집합은 {y}이고 x는 없다. 그럴듯해 보이는 이유는 "쓰인다"를 "이름이 보인다"로 읽기 때문이다. 살아 있는 것은 이름이 아니라 그 지점에서 변수가 가진 값이다. 확인하는 법: 그 지점에서 아래로 내려가며 그 변수가 처음 나오는 줄을 찾는다. 오른쪽에 먼저 나오면 살아 있고, 왼쪽에만 먼저 나오면 죽었다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 살아 있는 변수의 뜻을 쓰고, 문장 `a = … b …`를 거꾸로 지날 때 집합을 고치는 식을 쓰라. 블록을 어느 방향으로 훑는가?</summary>

**답:** 지금 가진 값이 앞으로 필요한 변수가 살아 있는 변수다. 아래에서 위로 훑는다. 문장 위의 집합 = (문장 아래의 집합 $$\setminus$$ {a}) $$\cup$$ {오른쪽에서 읽는 변수들}. 왼쪽 변수를 먼저 빼고, 읽는 변수를 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 블록 `x = a + b` / `y = x * 2` / `x = 5` / `z = x + y`가 있고 뒤에서 z만 쓰인다. 아래에서 위로 각 줄 바로 위의 집합을 구하라. 지워지는 줄이 있는가?</summary>

**답:** 처음 {z}. `z = x + y` 위: {x, y}. `x = 5` 위: {y}. `y = x * 2` 위: {x}. `x = a + b` 위: {a, b}. 네 줄 모두 왼쪽 변수가 바로 아래 집합에 들어 있으므로 지워지는 줄이 없다.<br>
**이유:** `x = 5` 위의 집합에 x가 없다. 흔한 오답은 뒤에 `z = x + y`가 있다고 x를 넣는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드에서 "x가 집합에 없으면 이 문장을 지운다"가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 이 줄이 넣는 값을 뒤에서 아무도 읽지 않으므로, 결과를 바꾸지 않는 쓸모없는 계산으로 보고 블록에서 뺀다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `a = a + c` 아래의 집합이 {b, d}일 때 위의 집합이 {b, c, d}가 아니라 {a, b, c, d}인 근거를 대라.</summary>

**답:** 이 줄은 a를 덮어쓰기 전에 오른쪽에서 a의 옛 값을 읽는다. 그래서 이 줄 위에서는 a의 값이 필요하다. 식으로는 빼기를 먼저 해서 $$(\{b, d\} \setminus \{a\}) \cup \{a, c\} = \{a, b, c, d\}$$다. 넣기를 먼저 하면 방금 넣은 a를 빼 버려 {b, c, d}가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** C2의 블록에서 뒤에 쓰이는 변수가 z가 아니라 y 하나뿐이라면 어느 줄이 지워지는가? 남는 코드를 쓰라.</summary>

**답:** `z = x + y`(z가 {y}에 없다)와 `x = 5`(x가 {y}에 없다)가 지워진다. 남는 코드는 `x = a + b`, `y = x * 2` 두 줄이다.<br>
**이유:** `z = x + y`를 지웠으므로 그 줄이 읽던 x를 집합에 넣지 않는다. 그래서 바로 위의 `x = 5`도 지워진다. 한 번 훑는 동안 쓸모없는 줄이 이어서 사라진다.

</details>


[^s1]: 증명은 직접 썼고 무작위 블록 실험은 증명과 별개의 확인이다. Aho 외, *Compilers* 2판 9.2.5절(생존 변수 분석). 실제로는 물건이 아니라 "그 시점의 값"을 따진다.
[^s3]: 처음 집합을 바꾼 결과와 카드의 답은 구현으로 확인했다.
{% endraw %}
