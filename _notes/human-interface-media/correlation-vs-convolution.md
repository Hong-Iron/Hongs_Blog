---
layout: "note"
title: "교차 상관과 합성곱 비교"
display_title: "교차 상관과 합성곱 비교"
kind: "concept"
kind_label: "비교"
num: "30"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Cross-correlation vs Convolution", "교차 상관과 합성곱", "상관과 컨벌루션 차이"]
description: "둘 다 한 함수를 옮겨 가며 다른 함수와 겹친 값을 곱해 더한다. 차이는 옮기기 전에 뒤집느냐 하나뿐이다. 합성곱은 뒤집고 옮기고, 교차 상관은 그대로 옮긴다. 이 한 가지 차이 때문에 합성곱은 \"이 장치에 넣으면 무엇이 나오나\"에, 교차 상관은 \"이 무늬가 어디 있나\"에 쓰인다."
prev_url: "/studies/human-interface-media/cross-correlation/"
prev_title: "교차 상관"
next_url: "/studies/human-interface-media/two-dimensional-convolution/"
next_title: "2차원 합성곱"
math: true
mermaid: false
code_count: 1
permalink: "/studies/human-interface-media/correlation-vs-convolution/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

둘 다 한 함수를 옮겨 가며 다른 함수와 겹친 값을 곱해 더한다. 차이는 옮기기 전에 뒤집느냐 하나뿐이다. 합성곱은 뒤집고 옮기고, 교차 상관은 그대로 옮긴다. 이 한 가지 차이 때문에 합성곱은 "이 장치에 넣으면 무엇이 나오나"에, 교차 상관은 "이 무늬가 어디 있나"에 쓰인다.

</div>


두 연산의 식을 나란히 놓는다[^1][^2].

| | 연속 | 불연속 |
|---|---|---|
| 합성곱 | $$(f * g)(t) = \int_{-\infty}^{\infty} f(\tau)g(t - \tau)\,d\tau$$ | $$(f * g)[n] = \sum_{m} f[m]g[n - m]$$ |
| 교차 상관 | $$(f \star g)(x) = \int \overline{f(t)}g(x + t)\,dt$$ | $$(f \star g)[n] = \sum_{k} \overline{f[k]}g[n + k]$$ |

합성곱 식의 $$g(t - \tau)$$에서 $$\tau$$ 앞의 빼기가 뒤집기다. 교차 상관 식의 $$g(x + t)$$에는 뒤집기가 없다.

## 어느 쪽일까

<details markdown="1"><summary markdown="span"><b>1.</b> 사진 전체를 3×3 평균으로 흐리게 하려 한다. 합성곱과 교차 상관 중 무엇을 써도 결과가 같은가?</summary>


**같다.** 3×3 평균 커널은 위아래·좌우로 뒤집어도 그대로(대칭)라서, 뒤집든 안 뒤집든 같은 커널로 계산한다. 영상 처리 라이브러리 상당수가 실제로는 교차 상관을 계산하면서 "convolution"이라 부르는 것도 대칭 커널이 많기 때문이다[^s1].

</details>

<details markdown="1"><summary markdown="span"><b>2.</b> 항공 사진에서 지붕 모양 틀이 있는 자리를 찾는다. 틀은 좌우가 다르다(한쪽만 그늘). 어느 쪽을 쓰는가?</summary>


**교차 상관.** 틀을 뒤집지 않고 그대로 옮기며 겹쳐야 "같은 모양"인 자리에서 점수가 높다. 합성곱을 쓰면 뒤집힌 틀(그늘이 반대쪽인 지붕)을 찾게 된다[^3].

</details>

<details markdown="1"><summary markdown="span"><b>3.</b> 스피커에 짧은 딸깍 소리(임펄스)를 넣었을 때의 응답 $$h$$를 안다. 노래 $$x$$를 넣으면 무엇이 나오는가?</summary>


**합성곱 $$x * h$$.** 노래를 임펄스들로 쪼개면, 각 임펄스가 $$h$$ 모양의 응답을 늦게 내놓고 그것들이 더해진다. 먼저 들어온 소리가 먼저 나오는 시간 순서가 뒤집기로 들어간다([컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/)).

</details>

<details markdown="1"><summary markdown="span"><b>4.</b> $$f = [1, 2, 3]$$, $$g = [4, 0, -1, 2]$$에서 $$f * g$$와 $$g * f$$, $$f \star g$$와 $$g \star f$$ 중 같은 짝은?</summary>


**$$f * g = g * f$$.** 합성곱은 순서를 바꿔도 같다. 교차 상관은 순서를 바꾸면 좌우가 뒤집힌다: $$(f \star g)[n] = (g \star f)[-n]$$[^s1].

</details>

## 결정적 차이

| | 합성곱 | 교차 상관 |
|---|---|---|
| 옮기기 전에 | 뒤집는다(2차원이면 180° 돌린다) | 그대로 둔다 |
| 순서 바꾸기 | 같다 ($$f * g = g * f$$) | 좌우가 뒤집힌다 |
| 두 연산의 관계 | $$f \star g$$는 $$f$$를 뒤집어(켤레를 취해) 합성곱한 것과 같다 | |
| 묻는 질문 | 이 시스템에 넣으면 무엇이 나오나 | 이 무늬가 어디에 있나, 얼마나 닮았나 |
| 임펄스와 계산하면 | 신호가 그 자리로 옮겨 간다 | 신호가 반대 방향으로 옮겨 간다 |
| 대칭 커널이면 | 둘이 같다 | 둘이 같다 |

슬라이드 p.11의 비교 그림은 같은 $$f$$(사각)와 $$g$$(오른쪽으로 줄어드는 삼각)로 세 가지를 그린다[^4]. $$f * g$$와 $$g * f$$는 같은 모양이다. $$f \star g$$와 $$g \star f$$는 서로 좌우가 뒤집힌 모양이다. 자기 상관 $$f \star f$$, $$g \star g$$는 늘 가운데(옮김 0)에서 가장 높고 좌우 대칭이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 합성곱의 교환법칙, 교차 상관의 좌우 뒤집힘, $$f \star g$$ = 뒤집은 $$f$$와의 합성곱, 대칭 커널에서 두 결과가 같음, 비대칭 커널에서 다름, 임펄스와의 합성곱 (실험으로 확인됨) — [30_correlation-vs-convolution_verify.py](/Hongs_Blog/studies/human-interface-media/code/30_correlation-vs-convolution_verify/)</div>

</div>


## 둘 다 아닐 때

- **밝기·대비가 다른 곳에서 모양을 찾을 때:** 그냥 교차 상관은 밝은 곳에 끌린다. 자리마다 평균을 빼고 표준편차로 나눈 정규화 교차 상관을 쓴다: [모양의 비슷함 재기](/Hongs_Blog/studies/human-interface-media/shape-similarity/).
- **두 데이터를 옮기지 않고 한 번만 비교할 때:** 공분산이나 상관계수로 충분하다. 강의 요약도 확률 변수 두 개의 관계는 공분산, 같은 공간의 두 데이터 집단의 관계는 교차 공분산으로 나눠 적는다[^5].
- **돌아가거나 크기가 다른 무늬를 찾을 때:** 둘 다 옮김만 다룬다. 틀을 여러 각도·크기로 바꿔 가며 반복하거나 다른 특징을 써야 한다[^s1].

[^1]: 휴먼 인터페이스 미디어 6회 강의 자료 「HIM_강의06_모양맞추기」, p.10 (합성곱의 연속·불연속 정의)
[^2]: 같은 자료, p.9 (교차 상관의 연속·불연속 정의)
[^3]: 같은 자료, p.23 (2D Convolution by Moving Window: 합성곱은 $$F[i - u, j - v]$$, 상관은 $$F[i + u, j + v]$$)과 p.43 (패턴 찾기)
[^4]: 같은 자료, p.11 (비교: Convolution, Cross-correlation, Autocorrelation)
[^5]: 같은 자료, p.44 (요약: 비슷함을 측정하는 방법)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 1·4번 문항, 라이브러리 이야기, "둘 다 아닐 때"의 셋째 항목은 원본에 없다. 1·4번의 수치와 성질은 검증 코드로 확인했다.
{% endraw %}
