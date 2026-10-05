---
layout: "note"
title: "추상 벡터공간과 베지어 곡선"
display_title: "추상 벡터공간과 베지어 곡선 (Abstract Vector Spaces and Bézier Curves)"
kind: "concept"
kind_label: "정의"
num: "25"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Abstract Vector Space", "추상 벡터공간", "벡터공간의 공리", "vector space axioms", "함수 공간", "function space", "다항식 공간", "polynomial space", "베른슈타인 다항식", "Bernstein polynomial", "베지어 곡선", "Bézier curve", "드 카스텔조 알고리즘", "de Casteljau's algorithm"]
description: "더하고 수를 곱하는 규칙만 맞으면 다항식, 함수, 행렬도 \"벡터\"로 다룰 수 있다. 그러면 기저·차원·선형변환 같은 도구를 화살표가 아닌 대상에도 그대로 쓴다. 미분은 다항식 공간의 선형변환이고, 글꼴과 벡터 그래픽의 곡선(베지어 곡선)은 조절점을 특별한 다항식 기저(베른슈타인 기…"
prev_url: "/studies/linear-algebra/svd/"
prev_title: "특잇값 분해"
next_url: "/studies/linear-algebra/conditioning/"
next_title: "노름과 조건수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/abstract-vector-spaces/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

더하고 수를 곱하는 규칙만 맞으면 다항식, 함수, 행렬도 "벡터"로 다룰 수 있다. 그러면 기저·차원·선형변환 같은 도구를 화살표가 아닌 대상에도 그대로 쓴다. 미분은 다항식 공간의 선형변환이고, 글꼴과 벡터 그래픽의 곡선(베지어 곡선)은 조절점을 특별한 다항식 기저(베른슈타인 기저)로 섞은 것이다. 다만 모든 함수 모임이 벡터공간은 아니다. "차수가 정확히 2인 다항식"처럼 더하면 밖으로 나가는 모임도 있다.

</div>


## 예시로 보기

폰트의 글자 윤곽은 점 몇 개로 곡선을 정한다. 조절점 $$P_0 = (0, 0)$$, $$P_1 = (1, 2)$$, $$P_2 = (2, 0)$$으로 만드는 2차 베지어 곡선은

$$\mathbf{P}(t) = (1 - t)^2P_0 + 2t(1 - t)P_1 + t^2P_2, \qquad 0 \le t \le 1.$$

$$t = \frac12$$이면 계수가 $$\frac14, \frac12, \frac14$$라 $$\mathbf{P}(\frac12) = \frac14(0, 0) + \frac12(1, 2) + \frac14(2, 0) = (1, 1)$$이다. 같은 점을 선분의 중점을 되풀이해 얻을 수도 있다. $$P_0P_1$$의 중점 $$(\frac12, 1)$$과 $$P_1P_2$$의 중점 $$(\frac32, 1)$$을 잇고, 다시 중점을 잡으면 $$(1, 1)$$이다(드 카스텔조 알고리즘).

계수 $$(1 - t)^2$$, $$2t(1 - t)$$, $$t^2$$은 2차 이하 다항식들의 공간에서 하나의 기저를 이룬다. 곡선은 조절점을 이 기저 함수들로 섞은 선형결합이다. 다항식이 아래 정의의 벡터, 세 계수 함수가 베른슈타인 기저다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

집합 $$V$$에 덧셈과 실수배가 정의되어 있고, 모든 $$\mathbf{u}, \mathbf{v}, \mathbf{w} \in V$$와 $$c, d \in \mathbb{R}$$에 대해 다음 여덟 법칙을 만족하면 $$V$$를 **벡터공간**이라 한다.<br>
교환 $$\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$$, 결합 $$(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$$, 영벡터 $$\mathbf{v} + \mathbf{0} = \mathbf{v}$$, 역 $$\mathbf{v} + (-\mathbf{v}) = \mathbf{0}$$, $$c(\mathbf{u} + \mathbf{v}) = c\mathbf{u} + c\mathbf{v}$$, $$(c + d)\mathbf{v} = c\mathbf{v} + d\mathbf{v}$$, $$c(d\mathbf{v}) = (cd)\mathbf{v}$$, $$1\mathbf{v} = \mathbf{v}$$[^1].

</div>


$$\mathbb{R}^n$$의 [벡터](/Hongs_Blog/studies/linear-algebra/vectors/)에서 성립하던 바로 그 법칙들이다. 이것만 쓰는 정리(선형독립, 기저, 차원, 선형변환의 행렬)는 모두 새 공간에서도 성립한다.

| 공간 | 벡터 | 기저 | 차원 |
|---|---|---|---|
| $$\mathcal{P}_n$$: $$n$$차 이하 다항식 | $$a_0 + a_1t + \cdots + a_nt^n$$ | $$1, t, \dots, t^n$$ | $$n + 1$$ |
| $$m \times n$$ 행렬 | 행렬 | 한 칸만 1인 행렬들 | $$mn$$ |
| $$y'' + y = 0$$의 해 | 함수 | $$\cos t$$, $$\sin t$$ | 2 |
| 실수 전체에서 연속인 함수 | 함수 | 유한한 기저 없음 | 무한 |

**해당하지 않는 예.** 차수가 **정확히** 2인 다항식 모임은 $$t^2 + (-t^2 + t) = t$$처럼 더하면 차수가 떨어져 밖으로 나간다(덧셈에 닫혀 있지 않고 영다항식도 없다). 양수 값만 갖는 함수 모임은 $$-1$$배하면 밖으로 나간다.

**베른슈타인 기저.** $$n$$차 **베른슈타인 다항식** $$B_{i,n}(t) = \binom{n}{i}t^i(1 - t)^{n-i}$$($$i = 0, \dots, n$$)은 $$\mathcal{P}_n$$의 기저다. [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)로 $$\sum_i B_{i,n}(t) = (t + (1 - t))^n = 1$$이고, $$0 \le t \le 1$$에서 모두 0 이상이다. **베지어 곡선**은 $$\mathbf{P}(t) = \sum_{i=0}^{n} B_{i,n}(t)P_i$$다.

## 예제

**미분은 선형변환이다.** $$D(p) = p'$$을 $$\mathcal{P}_3 \to \mathcal{P}_2$$로 본다.

1. *선형성:* $$(ap + bq)' = ap' + bq'$$([미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)).
2. *기저의 상:* $$1 \mapsto 0$$, $$t \mapsto 1$$, $$t^2 \mapsto 2t$$, $$t^3 \mapsto 3t^2$$.
3. *행렬:* 기저 $$1, t, t^2$$의 좌표로 적어 열로 세우면 $$\begin{pmatrix}0 & 1 & 0 & 0\\ 0 & 0 & 2 & 0\\ 0 & 0 & 0 & 3\end{pmatrix}$$.
4. *네 부분공간:* 영공간은 상수 다항식(1차원), 랭크 3이라 $$\mathcal{P}_2$$ 전체가 상이다. [차원 정리](/Hongs_Blog/studies/linear-algebra/four-subspaces/) $$3 + 1 = 4$$와 맞는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$(1, 1)$$과 드 카스텔조, 베른슈타인 다항식의 합 1·음이 아님·기저(계수 행렬의 랭크), 무작위 조절점에서 곡선 공식 = 드 카스텔조, 조절점을 옮기면 곡선도 같이 옮겨짐, 미분 행렬과 랭크, 해당하지 않는 예, $$\cos$$, $$\sin$$이 $$y'' + y = 0$$을 만족 — [25_abstract-vector-spaces_verify.py](/Hongs_Blog/studies/linear-algebra/code/25_abstract-vector-spaces_verify/)</div>

</div>


## 활용

- **글꼴과 벡터 그래픽.** 트루타입 글꼴은 2차, 포스트스크립트·CFF 글꼴과 SVG의 `C` 명령은 3차 베지어 곡선으로 윤곽을 그린다. CSS의 `cubic-bezier()`는 애니메이션의 속도 곡선이다[^s1].
- **좌표와 무관한 곡선.** 베른슈타인 계수의 합이 1이라 곡선의 점은 조절점의 [아핀 결합](/Hongs_Blog/studies/linear-algebra/vectors/)이다. 그래서 조절점을 모두 이동·회전하면 곡선도 똑같이 이동·회전한다. 그래픽 프로그램이 곡선을 변환할 때 조절점만 변환하면 되는 이유다.
- **함수를 벡터로.** 신호를 함수 공간의 벡터로 보고 사인파 기저로 나누는 것이 푸리에 분석이다([이산 푸리에 변환](/Hongs_Blog/studies/linear-algebra/dft/)).

## 연결

- 선수: [부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/)
- 쓰는 도구: [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)(베른슈타인 합 = 1), [선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/)(미분)
- 이어지는 개념: [이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 미분 $$D: \mathcal{P}_2 \to \mathcal{P}_1$$의 행렬을 기저 $$1, t, t^2$$와 $$1, t$$로 쓰고, 영공간을 구하라.</summary>

**답:** $$1 \mapsto 0$$, $$t \mapsto 1$$, $$t^2 \mapsto 2t$$라 $$\begin{pmatrix}0 & 1 & 0\\ 0 & 0 & 2\end{pmatrix}$$. 영공간은 상수 다항식(1차원)이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "차수가 정확히 2인 실수 계수 다항식의 모임"이 벡터공간이 아님을 보여라.</summary>

**답:** $$t^2$$과 $$-t^2 + t$$는 모두 차수 2인데 합 $$t$$는 차수 1이라 모임 밖이다. 덧셈에 닫혀 있지 않다. 영다항식도 들어 있지 않다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 베지어 곡선의 조절점을 모두 같은 벡터 $$\mathbf{a}$$만큼 옮기면 곡선 전체가 $$\mathbf{a}$$만큼 옮겨지는 이유는?</summary>

**답:** $$\sum_i B_{i,n}(t)(P_i + \mathbf{a}) = \sum_i B_{i,n}(t)P_i + \left(\sum_i B_{i,n}(t)\right)\mathbf{a} = \mathbf{P}(t) + \mathbf{a}$$. 베른슈타인 다항식의 합이 1이기 때문이다(이항정리).

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 3.1절 "Spaces of Vectors"(벡터공간의 여덟 법칙, 함수·행렬 공간), 8.1절(미분이 선형변환), 8.2절(미분의 행렬).
[^s1]: 에이전트 보충. 트루타입의 2차 곡선과 CFF·SVG의 3차 곡선은 각 규격(OpenType 명세, SVG 1.1 경로 명령)에 정의되어 있다. CSS `cubic-bezier()`는 CSS Easing Functions 명세의 함수다.
{% endraw %}
