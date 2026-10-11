---
layout: "note"
title: "선형 부호와 패리티 검사 행렬"
display_title: "선형 부호와 패리티 검사 행렬 (Linear Code, Parity Check Matrix)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
updated: "2026-10-11"
status: "verified"
aliases: ["Linear Code", "선형 부호", "선형 블록 부호", "Linear Block Code", "생성 행렬", "Generator Matrix", "패리티 검사 행렬", "Parity Check Matrix", "패리티 비트", "Parity Bit", "패리티 검사", "짝수 패리티", "홀수 패리티", "신드롬", "Syndrome", "체계형", "Systematic Form"]
description: "쓸 낱말을 일일이 표로 적어 두는 대신, 낱말 몇 개만 정해 두고 그것들을 더해서 나머지를 만드는 부호다. 영수증 끝에 합계를 적어 두면 품목 하나가 틀렸을 때 합이 안 맞아 들통나는 것처럼, 내용 뒤에 \"몇몇 칸을 더한 값\"을 덧붙여 보낸다. 만드는 쪽도 받는 쪽도 정해진 덧셈 …"
prev_url: "/studies/data-and-information/hamming-distance/"
prev_title: "해밍 거리와 부호 거리"
next_url: "/studies/data-and-information/hamming-code/"
next_title: "해밍 부호"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-and-information/linear-code/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

쓸 낱말을 일일이 표로 적어 두는 대신, 낱말 몇 개만 정해 두고 그것들을 더해서 나머지를 만드는 부호다. 영수증 끝에 합계를 적어 두면 품목 하나가 틀렸을 때 합이 안 맞아 들통나는 것처럼, 내용 뒤에 "몇몇 칸을 더한 값"을 덧붙여 보낸다. 만드는 쪽도 받는 쪽도 정해진 덧셈 몇 번이면 되고, 받는 쪽은 검사한 값이 모두 0인지만 본다. 다만 검사를 하나만 붙이면 틀렸다는 것만 알고 어디가 틀렸는지는 모르며, 얼마나 잡고 고치는지는 검사들이 어느 칸을 겹쳐 보느냐에 달렸다.

</div>


## 예시로 보기

부호어가 16개면 표로 적을 수 있다. $$2^{100}$$개면 표를 저장할 수도, 받은 열이 표에 있는지 찾아볼 수도 없다. 규칙으로 만들고 규칙으로 검사해야 한다.

가장 간단한 규칙은 검사 비트 하나를 붙이는 것이다. 슬라이드의 8비트 `10010101`에는 1이 4개 있다[^1].

- **짝수 패리티:** 1의 개수가 짝수가 되게 한 칸을 붙인다. 이미 4개라 `0`을 붙인다.
- **홀수 패리티:** 1의 개수가 홀수가 되게 붙인다. `1`을 붙여 5개로 만든다.

패리티(parity)는 짝수인지 홀수인지를 뜻한다. 짝수 패리티에서 받은 9비트의 1을 세어 홀수면 어딘가 한 칸이 바뀐 것이다. 다만 어느 칸인지는 모르고, 두 칸이 바뀌면 다시 짝수라 놓친다.

검사를 여러 개 겹치면 더 많이 알 수 있다. 슬라이드의 부호는 내용 3비트 $$(d_1, d_2, d_3)$$ 뒤에 검사 비트 3개를 붙인다[^2]. 덧셈은 모두 "1 + 1 = 0"인 2진 덧셈이다.

$$p_1 = d_1 + d_3, \qquad p_2 = d_1 + d_2, \qquad p_3 = d_2 + d_3$$


내용이 `101`이면 $$p_1 = 1 + 1 = 0$$, $$p_2 = 1 + 0 = 1$$, $$p_3 = 0 + 1 = 1$$이라 부호어는 `101011`이다. 이제 넷째 칸이 바뀌어 `101111`이 왔다고 하자. 받은 쪽은 세 검사를 다시 한다.

| 검사 | 계산 | 결과 |
|---|---|---|
| $$d_1 + d_3 + p_1$$ | $$1 + 1 + 1$$ | 1 (안 맞음) |
| $$d_1 + d_2 + p_2$$ | $$1 + 0 + 1$$ | 0 |
| $$d_2 + d_3 + p_3$$ | $$0 + 1 + 1$$ | 0 |

첫째 검사만 깨졌다. 첫째 검사에만 들어 있고 다른 검사에는 없는 칸은 $$p_1$$(넷째 칸)뿐이다. 그래서 넷째 칸이 바뀌었다고 짚는다. 이 계산을 행렬 두 개로 적은 것이 아래 정의다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 (6,3) 부호어 8개와 무게, 거리 3, $$GH^\top = 0$$, 길이 6의 열 64개에서 "부호어 ⇔ $$H\mathbf c = \mathbf 0$$", 한 자리 오류의 검사 결과 = $$H$$의 그 열, $$H$$의 열로 구한 거리, 2차원 패리티 표, 예시와 카드의 값 — [06_linear-code_verify.py](/Hongs_Blog/studies/data-and-information/code/06_linear-code_verify/)</div>

</div>


## 정의

**선형 부호.** 알파벳 $$\Sigma$$가 체(덧셈·뺄셈·곱셈·나눗셈이 되는 수 체계)이고, 부호 $$C \subseteq \Sigma^n$$이 $$\Sigma^n$$의 [부분공간](/Hongs_Blog/studies/linear-algebra/basis-dimension/)이면 $$C$$를 선형 부호라 한다[^3]. 부분공간이라는 말은 두 부호어를 더해도, 부호어에 수를 곱해도 다시 부호어라는 뜻이다. 2진에서는 $$\Sigma = \{0, 1\}$$에 "1 + 1 = 0"인 덧셈을 쓴다. 이 체를 $$\mathbb{F}_2$$라 적는다.

**생성 행렬.** $$C$$의 차원이 $$k$$이면 부호어 $$k$$개 $$c_1, \dots, c_k$$를 골라, 모든 부호어를 이들의 선형결합으로 쓸 수 있다. 이 $$k$$개를 행으로 쌓은 $$k \times n$$ 행렬 $$G$$가 생성 행렬이다[^3].

$$\mathbf c = \mathbf x G, \qquad \mathbf x = (x_1, \dots, x_k) \in \Sigma^k$$


$$\mathbf x$$는 보낼 내용(메시지) $$k$$칸이고, $$\mathbf x \mapsto \mathbf x G$$가 부호화다. 여기서 $$\mathbf x$$와 $$\mathbf c$$는 가로로 적은 행벡터다. 블록 길이 $$n$$, 차원 $$k$$, 부호 거리 $$d$$인 $$q$$진 선형 부호를 $$[n, k, d]_q$$로 적는다[^3]. 부호어는 $$q^k$$개이고 [부호 비율](/Hongs_Blog/studies/data-and-information/code-encoding/)은 $$\frac{k}{n}$$이다.

예시의 부호는 $$G = [\,I_3 \mid P\,]$$ 꼴이다. 왼쪽이 단위행렬 $$I_3$$이라 부호어 앞 3칸이 내용 그대로이고, 오른쪽 $$P$$가 검사 비트를 만든다. 이런 꼴을 체계형이라 한다[^4].

$$G = \begin{bmatrix} 1 & 0 & 0 & 1 & 1 & 0 \\ 0 & 1 & 0 & 0 & 1 & 1 \\ 0 & 0 & 1 & 1 & 0 & 1 \end{bmatrix}$$


**패리티 검사 행렬.** $$C$$가 $$[n, k]_q$$ 부호라는 것은, 행이 $$n - k$$개이고 그 행들이 선형독립인 행렬 $$H$$가 있어서 다음과 같다는 것과 같은 말이다[^5].

$$C = \{\, \mathbf c \in \mathbb{F}_q^n : H\mathbf c = \mathbf 0 \,\}$$


$$H$$의 행 하나가 검사 하나다. "이 칸들을 더하면 0이어야 한다"를 $$n - k$$개 적은 것이다. 받은 열 $$\mathbf r$$에 $$H$$를 곱한 값 $$H\mathbf r$$을 신드롬이라 한다. 신드롬이 $$\mathbf 0$$이면 부호어다[^s1].

**$$G$$에서 $$H$$ 만들기.** $$G = [\,I_k \mid P\,]$$이면 $$H = [\,-P^\top \mid I_{n-k}\,]$$다. 2진에서는 $$-1 = 1$$이라 $$H = [\,P^\top \mid I_{n-k}\,]$$다[^5]. 위 $$G$$에서는 이렇게 된다.

$$H = \begin{bmatrix} 1 & 0 & 1 & 1 & 0 & 0 \\ 1 & 1 & 0 & 0 & 1 & 0 \\ 0 & 1 & 1 & 0 & 0 & 1 \end{bmatrix}$$


세 행이 예시의 세 검사 $$d_1 + d_3 + p_1$$, $$d_1 + d_2 + p_2$$, $$d_2 + d_3 + p_3$$ 그대로다.

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">$$GH^\top = 0$$인 이유</summary>

$$GH^\top = [\,I_k \mid P\,]\begin{bmatrix} -P \\ I_{n-k} \end{bmatrix} = -P + P = 0$$이다[^5]. $$G$$의 모든 행이 검사를 통과하니, 그 선형결합인 모든 부호어도 통과한다.

</details>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">부호 거리를 구하는 두 방법</div>

1. 선형 부호의 부호 거리는 $$\mathbf 0$$이 아닌 부호어의 무게 가운데 가장 작은 값이다[^s1].
2. 부호 거리는 $$H$$의 열 가운데 선형종속인 것을 고를 때 필요한 가장 적은 개수와 같다[^5]. 2진에서는 "더해서 영벡터가 되는 열의 가장 적은 개수"다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. 두 부호어의 차 $$c_1 - c_2$$도 부호어다(부분공간). 그리고 $$\Delta(c_1, c_2) = \mathrm{wt}(c_1 - c_2)$$다. 그래서 "서로 다른 두 부호어의 거리"의 모음과 "$$\mathbf 0$$이 아닌 부호어의 무게"의 모음이 같고, 가장 작은 값도 같다. — [해밍 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/)의 성질
2. $$H\mathbf c$$는 $$H$$의 열들을 $$\mathbf c$$의 성분만큼 곱해 더한 것이다. 무게 $$w$$인 부호어가 있다는 것은 $$H$$의 열 $$w$$개를 0이 아닌 계수로 더해 $$\mathbf 0$$을 만들 수 있다는 것, 곧 그 $$w$$개 열이 선형종속이라는 것이다. 거꾸로도 같다. 그래서 가장 작은 무게 = 선형종속인 열의 가장 적은 개수다. 1번과 합치면 부호 거리다. — [행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)은 열의 선형결합 ∎

</details>


위 $$H$$에서는 어느 열도 영벡터가 아니고(1개로는 안 됨), 어느 두 열도 같지 않다(2개로는 안 됨). 첫째·넷째·다섯째 열은 $$(1,1,0) + (1,0,0) + (0,1,0) = (0,0,0)$$이다. 그래서 거리는 3이다.

## 예제

**슬라이드의 (6,3) 부호 전체**[^4].

| 내용 $$\mathbf x$$ | 부호어 $$\mathbf xG$$ | 무게 |
|---|---|---|
| 000 | 000000 | 0 |
| 001 | 001101 | 3 |
| 010 | 010011 | 3 |
| 011 | 011110 | 4 |
| 100 | 100110 | 3 |
| 101 | 101011 | 4 |
| 110 | 110101 | 4 |
| 111 | 111000 | 3 |

1. *부호 거리:* 0이 아닌 무게 중 가장 작은 값 3. 그래서 $$[6, 3, 3]_2$$ 부호다.
2. *능력:* 2개까지 알아채고 1개를 고친다.
3. *상한 확인:* 슬라이드는 $$d_{\min} \le n - k + 1 = 4$$도 적는다. 3은 이 안에 든다.
4. *효율:* $$\frac{k}{n} = \frac36 = 50\%$$.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 3-2 p.7 "$$d_{\min} \le t + 1$$ where $$t$$ = number of error which can be detected, ∴ $$t \ge 2$$, ∴ The LBC can detect upto 2 errors" / 문제점: 부등호 방향이 반대다. $$d_{\min} \le t + 1$$이면 $$t \ge 2$$가 나오는데, 이는 "2개 이상 알아챈다"가 되어 "많아야 2개"라는 결론과 맞지 않는다 / 수정안: $$t$$개를 알아채려면 $$d_{\min} \ge t + 1$$, 그래서 $$t \le d_{\min} - 1 = 2$$ / 근거: 이 부호에서 2개까지의 오류는 모두 알아채고 3개는 놓치는 경우가 있음을 전수 검사로 확인했다(05_hamming-distance_verify.py의 (6,3) 부호).

</div>


**신드롬으로 자리 찾기.** 한 칸 $$e$$가 바뀐 열은 $$\mathbf r = \mathbf c + \mathbf e$$로 쓸 수 있다($$\mathbf e$$는 $$e$$째 칸만 1). 그러면 $$H\mathbf r = H\mathbf c + H\mathbf e = \mathbf 0 + (H\text{의 } e\text{째 열})$$이다. 신드롬이 $$H$$의 몇째 열과 같은지 보면 바뀐 자리를 안다[^s1].

1. *받은 열:* `101111`.
2. *신드롬:* $$H\mathbf r = (1, 0, 0)$$. 예시의 표와 같다.
3. *열 찾기:* $$(1, 0, 0)$$은 $$H$$의 넷째 열이다.
4. *고친다:* 넷째 칸을 뒤집어 `101011`.

이 방법이 통하려면 $$H$$의 열이 모두 달라야 한다. 이 생각을 끝까지 밀어 "열을 자리 번호의 2진수로" 잡은 것이 [해밍 부호](/Hongs_Blog/studies/data-and-information/hamming-code/)다.

## 활용

- **검사 비트 하나.** 짝수 패리티 부호는 $$G = [\,I_k \mid \mathbf 1\,]$$(마지막 열이 모두 1), $$H = [\,1\ 1\ \cdots\ 1\,]$$인 $$[k + 1, k, 2]_2$$ 부호다. 거리가 2라 1개를 알아채고 하나도 못 고친다[^s1].
- **2차원 패리티.** 슬라이드는 8비트 8줄에 줄마다 패리티 한 칸, 열마다 패리티 한 칸을 붙인 표를 보여 준다. 한 칸이 바뀌면 행 하나와 열 하나의 패리티가 함께 깨져, 둘이 만나는 칸이 바뀐 칸이다[^1]. 자세한 것은 [2차원 패리티](/Hongs_Blog/studies/computer-communication/two-dimensional-parity/).
- 부호화는 행렬 곱 한 번, 검사도 행렬 곱 한 번이라 회로로는 XOR 게이트 몇 개면 된다[^s1].
- 흔한 실수: $$\mathbf xG$$의 덧셈을 보통 덧셈으로 하는 것. 2진 부호에서는 모든 덧셈 뒤에 2로 나눈 나머지를 쓴다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 3-2 p.4의 그림은 내용 $$[1\ 0\ 1]$$에 $$G = \begin{bmatrix} 1&0&0&0 \\ 0&1&0&1 \\ 0&0&1&0 \end{bmatrix}$$을 곱해 $$[1\ 0\ 1 \mid 0]$$을 얻고 마지막 칸을 check bit라 부른다 / 문제점: 마지막 열이 $$(0, 1, 0)$$이면 검사 비트가 둘째 내용 비트를 그대로 베낄 뿐이라, 첫째나 셋째 칸이 바뀌어도 알아채지 못한다(부호 거리 1) / 수정안: 짝수 패리티 부호라면 마지막 열은 $$(1, 1, 1)$$이어야 한다. 이 내용에서는 $$1 + 0 + 1 = 0$$이라 결과 $$[1\ 0\ 1 \mid 0]$$은 같다 / 근거: 두 행렬의 부호 거리를 계산하면 각각 1과 2다(06_linear-code_verify.py).

</div>


## 연결

- 선수: [해밍 거리와 부호 거리](/Hongs_Blog/studies/data-and-information/hamming-distance/), [부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/)
- $$C$$는 $$G$$의 행공간이자 $$H$$의 영공간이다: [랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/). 차원이 $$k$$와 $$n - k$$로 나뉘는 것도 거기서 나온다[^s1].
- 열이 종속이라는 말: [선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/)
- 이어지는 개념: [해밍 부호](/Hongs_Blog/studies/data-and-information/hamming-code/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 위 $$G$$로 내용 `110`을 부호화하라.</summary>

**답:** 첫째 행과 둘째 행을 더한다. `100110` + `010011` = `110101`.<br>
**흔한 오답:** 다섯째 칸을 $$1 + 1 = 2$$로 두는 것. 2진 덧셈이라 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 위 $$H$$를 쓰는 부호에서 `110111`을 받았다. 신드롬을 구하고, 한 칸만 바뀌었다고 보고 고쳐라.</summary>

**답:** 첫째 검사 $$1 + 0 + 1 = 0$$, 둘째 $$1 + 1 + 1 = 1$$, 셋째 $$1 + 0 + 1 = 0$$. 신드롬 $$(0, 1, 0)$$은 $$H$$의 다섯째 열이다. 다섯째 칸을 뒤집어 `110101`.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 선형 부호에서는 부호 거리를 구할 때 모든 쌍을 비교하지 않고 0이 아닌 부호어의 무게만 보면 되는 이유는?</summary>

**답:** 두 부호어의 차도 부호어이고, 두 열의 거리는 차의 무게와 같기 때문이다. 어떤 쌍의 거리든 어떤 부호어 하나의 무게로 나타나고, 거꾸로 부호어 $$c$$의 무게는 $$c$$와 $$\mathbf 0$$ 사이의 거리다. 부호어가 $$M$$개면 쌍은 약 $$M^2/2$$개인데 무게는 $$M - 1$$개만 보면 된다.

</details>


[^1]: 자료와 정보 3회 강의 자료 「D&I_강의03-2-부호2」, p.5 (패리티 검사: 8비트 10010101의 짝수·홀수 패리티, 원래 데이터 블록과 전송된 데이터 블록의 2차원 패리티 표)
[^2]: 같은 자료, p.7 (예: (6,3) 선형 블록 부호의 $$G$$, 부호어와 무게 표, $$d_{\min} = 3$$, 효율 50%)
[^3]: 자료와 정보 3회 강의 자료 「D&I_강의03-부호」, p.17과 자료와 정보 3회 강의 자료 「D&I_강의03-2-부호2」, p.4 (Definition: Linear Code, generator matrix, encoding map, $$[n, k, d]_q$$)
[^4]: 자료와 정보 3회 강의 자료 「D&I_강의03-2-부호2」, p.7
[^5]: 같은 자료, p.6 (Lemma 셋: 패리티 검사 행렬, 부호 거리 = 선형종속인 $$H$$의 열의 최소 개수, 체계형 $$G = [I \mid G']$$이면 $$H = [G'^\top \mid I]$$. 옆에 $$G = [I_k \mid P]$$, $$H = [-P^\top \mid I_{n-k}]$$, $$GH^\top = P - P = 0$$)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 영수증 비유, 세 검사식으로 푼 예시, 신드롬이라는 이름과 "신드롬 = $$H$$의 그 열"의 유도, 거리 정리의 증명과 1번 명제, 짝수 패리티 부호의 $$G$$와 $$H$$, 행공간·영공간 연결, 카드는 슬라이드에 없다. 슬라이드에는 정의와 보조정리의 진술, (6,3) 예의 표만 있다. 증명은 Guruswami, Rudra, Sudan, *Essential Coding Theory*, 2.3절을 따랐고 (6,3) 부호에서 전수 검사로 확인했다. 슬라이드는 부호어를 행벡터로 쓰면서 $$Hc = 0$$이라 적는다. 이 문서에서 $$H\mathbf c$$의 $$\mathbf c$$는 같은 성분을 세로로 세운 것이다.
{% endraw %}
