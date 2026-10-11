---
layout: "note"
title: "편집 거리"
display_title: "편집 거리 (Edit Distance)"
kind: "concept"
kind_label: "알고리즘"
num: "11"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-11"
status: "verified"
aliases: ["Edit Distance", "레벤슈타인 거리", "Levenshtein Distance", "변환 거리", "Transformation Distance", "최소 편집 거리", "Minimum Edit Distance", "정규화 편집 거리", "Normalized Edit Distance", "편집 유사도", "Edit Similarity", "되짚기", "Backtrace", "편집 가중치"]
description: "한 낱말을 다른 낱말로 고치는 데 드는 가장 적은 수고를 두 낱말 사이의 거리로 삼는다. 원고를 교정하는 사람이 글자를 하나 끼워 넣고, 하나 지우고, 하나를 다른 글자로 바꾸는 세 가지 손질만 할 수 있다고 할 때 손질 횟수를 세는 것이다. 글자가 빠지거나 끼어들어 길이가 달라져…"
prev_url: "/studies/data-and-information/string-similarity/"
prev_title: "문자열 유사도"
next_url: "/studies/data-and-information/random-process/"
next_title: "확률 과정"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-and-information/edit-distance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 낱말을 다른 낱말로 고치는 데 드는 가장 적은 수고를 두 낱말 사이의 거리로 삼는다. 원고를 교정하는 사람이 글자를 하나 끼워 넣고, 하나 지우고, 하나를 다른 글자로 바꾸는 세 가지 손질만 할 수 있다고 할 때 손질 횟수를 세는 것이다. 글자가 빠지거나 끼어들어 길이가 달라져도 잴 수 있고 오타에 강하다. 대신 가능한 손질 순서가 너무 많아 앞부분끼리의 답을 표에 차곡차곡 채워야 하고, 표의 칸 수가 두 낱말 길이의 곱이라 긴 글에는 느리다.

</div>


## 예시로 보기

`flaw`와 `lawn`은 눈으로 보면 `law`가 통째로 겹친다. 그런데 같은 자리끼리 맞춰 보는 [해밍 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/)로는 네 자리가 모두 달라 4다. 한 칸 밀렸을 뿐인데 완전히 다르다고 나온다. 길이가 다른 `cat`과 `cart`는 해밍 거리로 아예 잴 수 없다.

손질 횟수로 세면 달라진다. `flaw`에서 맨 앞 `f`를 지우면 `law`, 끝에 `n`을 넣으면 `lawn`이다. 두 번이다. 그보다 적게는 안 되므로 편집 거리는 2다.

슬라이드는 이 생각을 사람에게도 적용해 보인다. 한 대상을 다른 대상으로 바꾸는 데 든 수고를 거리로 삼는다. 만화 속 패티를 셀마로 바꾸려면 옷 색, 귀걸이 모양, 가르마를 바꿔 3점이고, 마지를 셀마로 바꾸려면 다섯 가지를 바꿔 5점이다[^1].

문제는 가장 적은 횟수를 어떻게 찾느냐다. 슬라이드는 이것을 길 찾기로 본다. 출발은 고칠 낱말, 도착은 목표 낱말, 한 걸음은 손질 한 번, 줄이려는 것은 걸음 수다[^2]. `intention`에서 한 걸음에 갈 수 있는 곳만 해도 `ntention`(지우기), `eintention`(넣기), `entention`(바꾸기)을 비롯해 수백 가지다. 걸음마다 그만큼씩 갈라지니 다 가 볼 수 없다.

대신 작은 문제부터 표에 채운다. 칸 $$(i, j)$$에는 "`flaw`의 앞 $$i$$글자를 `lawn`의 앞 $$j$$글자로 고치는 가장 적은 횟수"를 적는다. `#`은 빈 문자열이다.

| | # | l | a | w | n |
|---|---|---|---|---|---|
| **#** | 0 | 1 | 2 | 3 | 4 |
| **f** | 1 | 1 | 2 | 3 | 4 |
| **l** | 2 | 1 | 2 | 3 | 4 |
| **a** | 3 | 2 | 1 | 2 | 3 |
| **w** | 4 | 3 | 2 | 1 | 2 |

맨 윗줄은 빈 문자열에 글자를 넣기만 하는 횟수, 맨 왼쪽 줄은 지우기만 하는 횟수다. 나머지 칸은 위, 왼쪽, 왼쪽 위 대각선의 세 칸만 보고 채운다. 오른쪽 아래 끝의 2가 답이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 길이 3 이하의 모든 문자열 쌍에서 표의 값 = 손질을 직접 해 보는 탐색의 값, 슬라이드의 `intention` → `execution` 5와 8, 슬라이드 표 100칸, 무작위 3,000회에서 거리의 네 조건과 범위·되짚기, `flaw` → `lawn` 표, 카드의 값 — [11_edit-distance_impl.py](/Hongs_Blog/studies/data-and-information/code/11_edit-distance_impl/)</div>

</div>


## 정의

두 문자열 사이의 편집 거리(최소 편집 거리)는 한쪽을 다른 쪽으로 바꾸는 데 필요한 손질의 가장 적은 횟수다. 손질은 세 가지다[^3].

- **넣기**(insertion): 글자 하나를 끼워 넣는다.
- **지우기**(deletion): 글자 하나를 뺀다.
- **바꾸기**(substitution): 글자 하나를 다른 글자로 바꾼다.

손질마다 비용을 달리 줄 수 있다. 슬라이드의 `intention` → `execution`은 두 낱말을 위아래로 맞춰 놓고 손질을 적는다[^3].

```
I N T E * N T I O N
| | | | | | | | | |
* E X E C U T I O N
d s s   i s
```

`*`는 빈 칸이다. `d`는 지우기, `s`는 바꾸기, `i`는 넣기다. 지우기 1번, 바꾸기 3번, 넣기 1번이다.

| 비용 정하기 | 계산 | 거리 |
|---|---|---|
| 세 손질 모두 1 | $$1 + 3 + 1$$ | 5 |
| 넣기·지우기 1, 바꾸기 2 | $$1 + 3 \cdot 2 + 1$$ | 8 |

바꾸기를 2로 두는 것은 "지우고 다시 넣는 것"과 같은 값으로 치겠다는 뜻이다. 슬라이드는 이 둘째 방식을 레벤슈타인이라 부르고, 계산 표도 이 비용으로 채운다[^3][^s1].

### 입출력

- 입력: 문자열 $$S_1$$(길이 $$n$$), $$S_2$$(길이 $$m$$), 세 손질의 비용.
- 출력: $$S_1$$을 $$S_2$$로 바꾸는 가장 싼 비용. 필요하면 그때의 손질 순서도 낸다.

### 점화식

$$D(i, j)$$를 "$$S_1$$의 앞 $$i$$글자를 $$S_2$$의 앞 $$j$$글자로 바꾸는 가장 싼 비용"이라 하자($$0 \le i \le n$$, $$0 \le j \le m$$). $$S_1(i)$$는 $$S_1$$의 $$i$$번째 글자다(1부터 센다). 가장자리는 $$D(i, 0) = i$$, $$D(0, j) = j$$다. 안쪽 칸은 세 값 중 가장 작은 것이다[^4].

$$D(i, j) = \min \begin{cases} D(i-1, j) + 1 & \text{(지우기)} \\ D(i, j-1) + 1 & \text{(넣기)} \\ D(i-1, j-1) + \begin{cases} 2 & S_1(i) \ne S_2(j) \\ 0 & S_1(i) = S_2(j) \end{cases} & \text{(바꾸기 또는 그대로)} \end{cases}$$


말로 읽으면 이렇다. 마지막 글자를 어떻게 처리했는지는 세 가지뿐이다.

- 위 칸에서 온다: $$S_1$$의 $$i$$번째 글자를 지웠다. 나머지 $$i - 1$$글자로 $$j$$글자를 만든 비용에 1을 더한다.
- 왼쪽 칸에서 온다: $$S_2$$의 $$j$$번째 글자를 넣었다. $$i$$글자로 $$j - 1$$글자를 만든 비용에 1을 더한다.
- 대각선 칸에서 온다: 두 마지막 글자를 맞췄다. 같으면 공짜, 다르면 바꾸는 값을 낸다.

식의 2를 1로 바꾸면 세 손질이 모두 1인 편집 거리가 된다. 답은 $$D(n, m)$$이다.

### 의사코드

```
편집거리(S1, S2, 넣기값, 지우기값, 바꾸기값):
    n = S1의 길이, m = S2의 길이
    D[0][0] = 0
    i = 1..n:  D[i][0] = D[i-1][0] + 지우기값
    j = 1..m:  D[0][j] = D[0][j-1] + 넣기값
    i = 1..n:
        j = 1..m:
            대각 = D[i-1][j-1] + (S1[i] == S2[j] 이면 0, 아니면 바꾸기값)
            D[i][j] = min(D[i-1][j] + 지우기값, D[i][j-1] + 넣기값, 대각)
    D[n][m]을 돌려준다
```

의사코드의 `S1[i]`는 1부터 센다. 파이썬 구현에서는 `a[i - 1]`이다.

### 실행 추적: 슬라이드의 표

`intention`(세로)을 `execution`(가로)으로 바꾼다. 넣기·지우기 1, 바꾸기 2다. 슬라이드는 아래에서 위로 그리지만 여기서는 위에서 아래로 적는다[^5].

| | # | e | x | e | c | u | t | i | o | n |
|---|---|---|---|---|---|---|---|---|---|---|
| **#** | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| **i** | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 6 | 7 | 8 |
| **n** | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 7 | 8 | 7 |
| **t** | 3 | 4 | 5 | 6 | 7 | 8 | 7 | 8 | 9 | 8 |
| **e** | 4 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 9 |
| **n** | 5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 10 |
| **t** | 6 | 5 | 6 | 7 | 8 | 9 | 8 | 9 | 10 | 11 |
| **i** | 7 | 6 | 7 | 8 | 9 | 10 | 9 | 8 | 9 | 10 |
| **o** | 8 | 7 | 8 | 9 | 10 | 11 | 10 | 9 | 8 | 9 |
| **n** | 9 | 8 | 9 | 10 | 11 | 12 | 11 | 10 | 9 | 8 |

칸 몇 개를 손으로 따라가 본다.

- $$D(1, 1)$$: `i`와 `e`는 다르다. 위 $$1 + 1 = 2$$, 왼쪽 $$1 + 1 = 2$$, 대각 $$0 + 2 = 2$$. 가장 작은 값 2.
- $$D(4, 1)$$: `e`와 `e`가 같다. 대각 $$D(3, 0) + 0 = 3$$. 위 $$4 + 1 = 5$$, 왼쪽 $$4 + 1 = 5$$. 가장 작은 값 3. `int`를 지우고 `e`는 그대로 둔 것이다.
- $$D(9, 9)$$: `n`과 `n`이 같다. 대각 $$D(8, 8) + 0 = 8$$. 답 8.

**되짚기.** 어떤 손질을 했는지 알려면, 칸마다 세 방향 가운데 어디서 왔는지를 화살표로 적어 두고 오른쪽 아래 끝에서 왼쪽 위 끝까지 거꾸로 따라간다. 대각선은 맞추기나 바꾸기, 위는 지우기, 왼쪽은 넣기다. 슬라이드의 표에서 색칠된 칸이 이 길이고, 그 길을 읽으면 위의 맞춤(INTE\*NTION / \*EXECUTION)이 나온다[^6].

### 정확성

**주장.** 위 점화식으로 채운 $$D(n, m)$$은 $$S_1$$을 $$S_2$$로 바꾸는 가장 싼 비용이다[^s1].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

강한 [귀납법](/Hongs_Blog/studies/discrete-math/induction/)을 $$i + j$$에 대해 쓴다. 불변식: 칸 $$(i, j)$$를 채울 때 그 위, 왼쪽, 대각 칸에는 이미 가장 싼 비용이 들어 있다.
1. **맞춤으로 바꿔 생각한다.** 손질의 나열은 두 문자열을 위아래로 맞춘 그림 하나로 적을 수 있다. 칸마다 (글자, 글자), (글자, 빈 칸), (빈 칸, 글자) 중 하나다. 세 손질의 값이 모두 1이거나 슬라이드처럼 바꾸기만 2일 때, 같은 자리를 두 번 손대는 나열(넣었다가 지우기, 바꾼 것을 또 바꾸기)은 한 번만 손대는 나열보다 싸지 않다. 그래서 가장 싼 나열은 맞춤 가운데 있다. 글자 쌍마다 값을 달리 줄 때는 "두 번 바꾸는 값이 한 번에 바꾸는 값보다 싸지 않다"는 조건이 있어야 같은 말을 할 수 있다. — 손질을 맞춤으로 옮겨 적기
2. **가장자리.** $$j = 0$$이면 $$S_1$$의 앞 $$i$$글자를 빈 문자열로 만들어야 하니 $$i$$번 지우는 수밖에 없다. $$i = 0$$도 같다. — 정의
3. **마지막 칸은 세 가지뿐이다.** 앞 $$i$$글자와 앞 $$j$$글자의 맞춤에서 맨 끝 칸은 ($$S_1(i)$$, 빈 칸), (빈 칸, $$S_2(j)$$), ($$S_1(i)$$, $$S_2(j)$$) 중 하나다. — 맞춤의 꼴
4. **나머지도 가장 싸야 한다.** 맨 끝 칸을 떼어 낸 나머지는 각각 $$(i-1, j)$$, $$(i, j-1)$$, $$(i-1, j-1)$$ 문제의 맞춤이다. 전체가 가장 싸려면 나머지도 그 문제에서 가장 싸야 한다. 더 싼 것이 있다면 바꿔 끼워 전체를 더 싸게 만들 수 있기 때문이다. — 바꿔 끼우기 논증
5. **그래서 점화식이다.** 귀납 가정으로 세 작은 문제의 가장 싼 비용이 $$D(i-1, j)$$, $$D(i, j-1)$$, $$D(i-1, j-1)$$이다. 여기에 맨 끝 칸의 값을 더한 셋 가운데 가장 작은 것이 $$D(i, j)$$다. — 3과 4를 합침 ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 3번에서 마지막 칸의 경우가 왜 셋뿐인가?</summary>

맞춤의 한 칸에는 위 글자와 아래 글자가 들어가는데 둘 다 빈 칸일 수는 없다. 위만 글자면 지우기, 아래만 글자면 넣기, 둘 다 글자면 맞추기(같으면 공짜, 다르면 바꾸기)다. 그리고 맨 끝 칸에 오는 글자는 각 문자열의 마지막 글자뿐이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 4번의 "더 싼 것이 있다면 바꿔 끼운다"는 무엇을 막는가?</summary>

"전체는 가장 싼데 그 앞부분은 가장 싸지 않은" 경우를 막는다. 앞부분을 더 싼 맞춤으로 갈아 끼워도 맨 끝 칸은 그대로 붙일 수 있으니 전체가 더 싸진다. 이것은 전체가 가장 싸다는 것과 어긋난다. 그래서 작은 문제의 가장 싼 값만 표에 적어 두면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 표를 채우는 순서는 왜 위에서 아래로, 왼쪽에서 오른쪽인가?</summary>

칸 $$(i, j)$$는 $$(i-1, j)$$, $$(i, j-1)$$, $$(i-1, j-1)$$만 본다. 이 셋은 모두 윗줄이거나 같은 줄의 왼쪽이다. 위에서 아래로, 왼쪽에서 오른쪽으로 채우면 필요한 칸이 늘 먼저 채워져 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

가장 싼 손질의 끝을 떼어 내면 남은 부분도 더 작은 문제의 가장 싼 답이다(최적 부분 구조). 그래서 "앞 $$i$$글자와 앞 $$j$$글자"라는 작은 문제 $$(n + 1)(m + 1)$$개만 풀면 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

두 줄을 앞에서부터 맞춰 가는 모든 문제다. 두 문자열의 가장 긴 공통 부분열, 유전자 서열 맞추기, 두 파일의 달라진 줄 찾기, 발음 길이가 다른 두 음성 맞추기가 같은 꼴의 표를 채운다. 틀은 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)이다.

</details>


### 복잡도

두 길이를 $$n$$, $$m$$이라 하면 칸이 $$(n + 1)(m + 1)$$개이고 칸 하나는 세 값을 비교할 뿐이다[^6].

| | 비용 |
|---|---|
| 시간 | $$O(nm)$$ |
| 공간 | $$O(nm)$$ |
| 되짚기 | $$O(n + m)$$ |

되짚기는 한 걸음마다 $$i$$나 $$j$$가 적어도 1 줄어 많아야 $$n + m$$걸음이다. 거리 값만 필요하면 윗줄 하나만 남겨 두면 되어 공간이 $$O(\min(n, m))$$으로 준다[^s1]. 최선, 평균, 최악이 모두 같다. 표를 다 채워야 하기 때문이다.

## 예제

**편집 유사도.** 편집 거리는 긴 낱말일수록 커지기 쉽다. 길이로 나눠 0~1로 맞춘다[^7].

$$\mathrm{NED}(r, s) = \frac{\mathrm{ED}(r, s)}{\max(\vert r\vert , \vert s\vert )}, \qquad \mathrm{EDS}(r, s) = 1 - \mathrm{NED}(r, s)$$


편집 거리를 두 길이 중 긴 쪽으로 나눈 것이 정규화 편집 거리, 그것을 1에서 뺀 것이 편집 유사도다. 세 손질이 모두 1일 때 편집 거리는 긴 쪽 길이를 넘지 않으므로(글자를 하나씩 바꾸고 남는 것을 넣거나 지우면 된다) NED는 0~1이다[^s1].

1. *`flaw`와 `lawn`:* $$\mathrm{ED} = 2$$, 긴 쪽 길이 4. $$\mathrm{NED} = 0.5$$, $$\mathrm{EDS} = 0.5$$.
2. *`intention`과 `execution`:* 비용이 모두 1일 때 $$\mathrm{ED} = 5$$, 길이 9. $$\mathrm{NED} = \frac59 \approx 0.556$$, $$\mathrm{EDS} = \frac49 \approx 0.444$$.

**해밍 거리와 갈리는 예.** `abcde`와 `bcdea`는 같은 자리끼리 모두 달라 해밍 거리가 5다. 편집 거리는 맨 앞 `a`를 지우고 끝에 `a`를 넣어 2다. 길이가 같은 두 문자열에서 편집 거리는 해밍 거리보다 클 수 없다. 다른 자리만 바꾸는 것도 한 가지 방법이기 때문이다[^s1].

## 활용

- 구현: [11_edit-distance_impl.py](/Hongs_Blog/studies/data-and-information/code/11_edit-distance_impl/). 연습: [편집 거리 예제 사다리](/Hongs_Blog/studies/data-and-information/edit-distance-ladder/)
- **기계 번역과 음성 인식의 평가.** 글자 대신 낱말을 단위로 삼는다. 슬라이드의 예는 기준 문장 "Spokesman confirms senior government adviser was shot"과 기계가 낸 "Spokesman said the senior adviser was shot dead"를 맞춰 바꾸기 1, 넣기 2, 지우기 1을 센다[^3].
- **편집 가중치 조절.** 모든 바꾸기가 같은 값일 필요는 없다. 슬라이드의 표 `sub[X, Y]`는 맞는 글자 Y 자리에 X를 잘못 친 횟수를 글자 쌍마다 센 것이다[^8]. 자주 헷갈리는 쌍의 바꾸기 값을 낮추면 맞춤법 교정이 더 그럴듯한 후보를 고른다. 예: `thr`의 교정 후보 `the`와 `tho`는 편집 거리가 둘 다 1이다. 자판에서 이웃한 `e`와 `r`의 바꾸기 값을 0.5로 낮추면 `the`가 0.5로 앞선다[^s1].
- 흔한 실수: 표의 가장자리를 0으로 채우는 것. 빈 문자열에서 $$j$$글자를 만들려면 $$j$$번 넣어야 하므로 $$D(0, j) = j$$다.
- 흔한 실수: 비용 약속을 확인하지 않는 것. 같은 두 낱말이 바꾸기 1이면 5, 바꾸기 2면 8이다.

## 연결

- 선수: [문자열 유사도](/Hongs_Blog/studies/data-and-information/string-similarity/)(문자 기반 유사도의 대표), [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)
- 손질 한 번을 간선으로 보면 편집 거리는 낱말 사이의 최단 경로다: [너비 우선 탐색(BFS)](/Hongs_Blog/studies/algorithms/bfs/). 슬라이드의 길 찾기 그림이 이 그래프다.
- 세 손질이 모두 1이면 [거리의 네 조건](/Hongs_Blog/studies/data-and-information/distance-similarity/)을 지킨다[^s1].
- 같은 자리끼리만 비교하는 거리: [해밍 거리와 부호 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"편집 거리는 두 낱말에서 다른 글자의 수를 세면 된다"</div>

틀렸다. 길이가 같은 두 낱말을 나란히 놓으면 다른 자리를 세는 것이 가장 자연스러워 보인다. 하지만 그것은 바꾸기만 쓴 한 가지 방법일 뿐이고, 넣기와 지우기를 쓰면 더 적게 고칠 수 있다. `abcde`와 `bcdea`는 다섯 자리가 모두 다르지만 편집 거리는 2다. 한 글자가 빠지거나 끼어들면 그 뒤가 모두 한 칸씩 밀리는데, 자리끼리 세는 방법은 밀린 글자를 전부 틀린 것으로 친다. 확인하는 법: 표를 채워 오른쪽 아래 값을 본다. 다른 자리 수는 편집 거리의 상한일 뿐이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 편집 거리의 세 손질과, 표의 칸 $$D(i, j)$$가 뜻하는 것, 가장자리 값을 쓰라.</summary>

**답:** 넣기, 지우기, 바꾸기. $$D(i, j)$$는 첫 문자열의 앞 $$i$$글자를 둘째 문자열의 앞 $$j$$글자로 바꾸는 가장 싼 비용이다. $$D(i, 0) = i$$(모두 지운다), $$D(0, j) = j$$(모두 넣는다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `form`을 `from`으로 바꾸는 표(세 손질 모두 1)의 마지막 줄을 채우고 편집 거리를 구하라.</summary>

**답:** 마지막 줄(`m` 줄)은 4, 3, 2, 2, 2. 편집 거리 2.<br>
**이유:** `o`를 `r`로, `r`을 `o`로 바꾼다. 이웃한 두 글자의 자리를 맞바꾸는 손질은 세 가지 안에 없어서 2번이 든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 의사코드의 `D[i][j] = min(…)` 줄이 하는 일을 한 문장으로 말하라.</summary>

**답:** 앞 $$i$$글자를 앞 $$j$$글자로 바꾸는 방법을 마지막 손질이 지우기인 경우, 넣기인 경우, 맞추거나 바꾸기인 경우로 나누고, 이미 구해 둔 세 작은 문제의 답에 마지막 손질 값을 더한 것 가운데 가장 싼 것을 적는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** `kitten`과 `sitting`의 편집 거리(모두 1)와 편집 유사도를 구하라. 바꾸기 값이 2면 거리는 얼마인가?</summary>

**답:** `k`→`s`, `e`→`i` 바꾸기 2번과 끝에 `g` 넣기 1번으로 3. $$\mathrm{NED} = \frac37$$, $$\mathrm{EDS} = \frac47 \approx 0.571$$. 바꾸기가 2면 $$2 + 2 + 1 = 5$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 점화식에서 작은 문제의 "가장 싼" 값만 적어 두어도 되는 근거는 증명의 어느 단계이고, 무엇을 말하는가?</summary>

**답:** 4번 바꿔 끼우기 논증. 전체가 가장 싼 맞춤이면 맨 끝 칸을 뗀 나머지도 그 작은 문제에서 가장 싸다. 아니라면 나머지를 더 싼 것으로 갈아 끼워 전체를 더 싸게 만들 수 있어 모순이다. 그래서 작은 문제의 덜 싼 답은 쓸 일이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C6** (가) 길이가 같은 두 이진 부호에서 전송 중 뒤집힌 비트 수를 세는 일 (나) 사용자가 친 낱말과 사전 낱말을 비교해 오타를 찾는 일. 각각 해밍 거리와 편집 거리 중 무엇을 쓰나?</summary>

**답:** (가)는 해밍 거리. 비트가 뒤집힐 뿐 빠지거나 끼어들지 않아 자리끼리 비교하면 되고, 길이에 비례하는 시간에 끝난다. (나)는 편집 거리. 글자를 빠뜨리거나 더 치면 길이가 달라지고 뒤가 밀리는데, 해밍 거리는 길이가 다르면 잴 수 없고 밀린 글자를 모두 틀렸다고 친다.

</details>


[^1]: 자료와 정보 4회 강의 자료 「D&I_강의04-2-유사도와거리」, p.6 (Edit Distance (Transformation Distance): D(Patty, Selma) = 3, D(Marge, Selma) = 5)
[^2]: 같은 자료, p.13 (편집 거리 계산하기: initial state, operators, goal state, path cost, intention에서 ntention·eintention·entention으로 가는 그림)
[^3]: 같은 자료, p.12 (편집 거리: 세 연산, INTE\*NTION / \*EXECUTION 맞춤과 d s s i s, 비용이 1이면 5, 바꾸기가 2(Levenshtein)면 8, 기계 번역·음성 인식 평가 예)
[^4]: 같은 자료, p.14 (편집 거리 계산 테이블: 점화식과 가장자리 값)
[^5]: 같은 자료, p.15 (편집 거리 계산: 채워진 표)
[^6]: 같은 자료, p.16 (편집 거리 찾기: 화살표가 달린 표, Time $$O(nm)$$, Space $$O(nm)$$, Backtrace $$O(n + m)$$)
[^7]: 같은 자료, p.17 (Edit Similarity: NED, EDS)
[^8]: 같은 자료, p.18 (편집 가중치 조절: sub[X, Y] = Substitution of X (incorrect) for Y (correct) 표)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> `flaw` → `lawn` 예시와 표, 점화식을 말로 푼 설명, 의사코드, 손으로 따라간 칸, 정확성 증명, 공간 줄이기, NED가 0~1인 까닭과 두 계산 예, 해밍 거리와의 비교, `thr` 가중치 예, 흔한 실수, 오해 항목, 카드는 슬라이드에 없다. 구현 코드의 전수 검사와 무작위 검사로 확인했다(실험 확인이며, 증명은 위에 따로 적었다). 슬라이드는 바꾸기 값이 2인 쪽을 레벤슈타인이라 부른다. 세 손질이 모두 1인 쪽을 레벤슈타인 거리라 부르는 자료가 더 많으므로(Wagner, Fischer, "The string-to-string correction problem", 1974), 문제를 풀 때는 비용 약속을 먼저 확인한다. 슬라이드의 예와 표는 Jurafsky, Martin, *Speech and Language Processing*의 최소 편집 거리 절에서 온 것이다.
{% endraw %}
