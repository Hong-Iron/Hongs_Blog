---
layout: "note"
title: "교차 상관"
display_title: "교차 상관 (Cross-correlation)"
kind: "concept"
kind_label: "기법"
num: "29"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Cross-correlation", "교차 상관", "자기 상관", "autocorrelation", "패턴 찾기", "template matching", "틀 맞추기", "상관 그래프"]
description: "찾고 싶은 작은 무늬(틀)를 투명 필름에 그려 큰 그림 위에서 한 칸씩 밀며, 자리마다 얼마나 잘 겹치는지 점수를 매기는 방법이다. 점수가 가장 높은 자리가 틀과 같은 무늬가 있는 곳이다. 동전 사진에서 동전을, 항공 사진에서 지붕을 찾는 데 그대로 쓴다. 다만 겹친 값을 곱해 더…"
prev_url: "/studies/human-interface-media/shape-similarity/"
prev_title: "모양의 비슷함 재기"
next_url: "/studies/human-interface-media/correlation-vs-convolution/"
next_title: "교차 상관과 합성곱 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/cross-correlation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

찾고 싶은 작은 무늬(틀)를 투명 필름에 그려 큰 그림 위에서 한 칸씩 밀며, 자리마다 얼마나 잘 겹치는지 점수를 매기는 방법이다. 점수가 가장 높은 자리가 틀과 같은 무늬가 있는 곳이다. 동전 사진에서 동전을, 항공 사진에서 지붕을 찾는 데 그대로 쓴다. 다만 겹친 값을 곱해 더하기만 하면 그냥 밝은 곳에서 점수가 높아지므로, 실제로는 자리마다 평균을 빼고 퍼진 정도로 나눈 정규화 점수를 쓴다.

</div>


## 예시로 보기

[모양의 비슷함 재기](/Hongs_Blog/studies/human-interface-media/shape-similarity/)의 상관계수는 길이가 같은 두 데이터를 한 번 비교한다. 같은 그림 찾기는 다르다. 틀은 작고 그림은 크다. 그림의 어디에 틀이 있는지 모른다. 그래서 틀을 한 칸씩 옮기며 자리마다 비교한다[^1].

1차원으로 해 보자. 신호 $$s$$에서 틀 $$t = [1, 3, 2]$$를 찾는다.

```
위치 n :  0  1  2  3  4  5  6  7  8  9 10 11
신호 s :  0  0  1  3  2  0  0  9  9  9  0  0
                ^^^^^^^           ^^^^^^^
               진짜 틀(2)       그냥 밝은 곳(7)
```

틀을 위치 $$n$$에 놓고 겹친 칸끼리 곱해 더한 값을 적는다.

| 놓은 위치 $$n$$ | 겹친 신호 | 곱의 합 | 정규화 점수 |
|---|---|---|---|
| 0 | 0, 0, 1 | 2 | 0 |
| 2 | 1, 3, 2 | $$1 + 9 + 4 = 14$$ | **1.00** |
| 3 | 3, 2, 0 | $$3 + 6 + 0 = 9$$ | −0.33 |
| 6 | 0, 9, 9 | $$0 + 27 + 18 = 45$$ | 0.87 |
| 7 | 9, 9, 9 | $$9 + 27 + 18 = $$ **54** | 0 |

그냥 곱해 더하면 가장 큰 값은 위치 7의 54다. 틀과 모양이 전혀 다른, 그냥 밝은 구간이다. 겹친 조각마다 평균을 빼고 표준편차로 나눈 정규화 점수(상관계수)는 진짜 자리 2에서 정확히 1이고, 밝기만 높은 위치 7에서는 0이다(조각이 9, 9, 9로 평평해서 모양이 없다). 오르막 모양이 틀의 앞부분과 닮은 위치 6은 0.87로 두 번째다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/29_cross-correlation_fig1.svg" alt="그림" width="612" height="487" loading="lazy">

위는 신호, 가운데는 곱의 합, 아래는 정규화 점수다. 곱의 합은 밝은 구간에서 솟고, 정규화 점수는 틀과 같은 모양이 있는 자리에서만 1에 닿는다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

두 함수 $$f$$, $$g$$의 **교차 상관**은 $$g$$를 $$x$$만큼 당겨 놓고 $$f$$와 겹친 값을 곱해 모두 더한(적분한) 것이다[^2]. $$\overline{f}$$는 $$f$$의 켤레복소수로, 실수 신호면 $$f$$ 그대로다.

연속: $$ (f \star g)(x) \overset{\text{def}}{=} \int \overline{f(t)}\, g(x + t)\, dt = \int \overline{f(t - x)}\, g(t)\, dt $$<br>
불연속: $$ (f \star g)[n] \overset{\text{def}}{=} \sum_{k \in \mathbb{Z}} \overline{f[k]}\, g[n + k] = \sum_{k \in \mathbb{Z}} \overline{f[k - n]}\, g[k] $$

$$f = g$$인 경우, 곧 자기 자신과의 교차 상관을 **자기 상관**이라 한다[^3].

</div>


$$f$$가 틀, $$g$$가 그림이다. $$n$$을 바꾸는 것은 틀을 그림 위에서 옮기는 것이고, 합 $$\sum_k f[k]g[n + k]$$는 그 자리에서 겹친 칸의 곱을 모두 더한 점수다. 위 표의 "곱의 합" 열이 $$(t \star s)[n]$$이다.

**자기 상관은 0에서 가장 크다.** 자기 자신과 어긋남 없이 겹친 $$n = 0$$에서 $$\sum f[k]^2$$가 되고, 옮기면 이보다 작거나 같다(코시-슈바르츠 부등식)[^s3]. 그래서 신호 안에 되풀이되는 무늬가 있으면 자기 상관의 0이 아닌 자리에도 봉우리가 생기고, 그 간격이 반복 주기다.

**순서를 바꾸면 좌우가 뒤집힌다.** 실수 신호에서 $$(f \star g)[n] = (g \star f)[-n]$$이다. 틀을 오른쪽으로 옮기는 것과 그림을 왼쪽으로 옮기는 것이 같기 때문이다. 이 점이 [합성곱](/Hongs_Blog/studies/human-interface-media/correlation-vs-convolution/)과 다르다.

**정규화.** 그림이 밝은 곳에서 점수가 부풀지 않게, 실제 패턴 찾기에서는 자리마다 겹친 조각의 평균을 빼고 두 표준편차로 나눈 [정규화 교차 상관 계수](/Hongs_Blog/studies/human-interface-media/shape-similarity/)를 쓴다. 값은 −1에서 1 사이다. 슬라이드의 상관 그래프 영상에서 동전·지붕 자리가 1에 가까운 빨간 점으로 빛나는 것이 이 값이다[^4].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 틀 [1, 3, 2]의 곱의 합(위치 2에서 14, 위치 7에서 54)과 정규화 점수(위치 2에서 1), 자기 상관의 최댓값이 0에서, $$(f \star g)[n] = (g \star f)[-n]$$ (실험으로 확인됨) — [29_cross-correlation_impl.py](/Hongs_Blog/studies/human-interface-media/code/29_cross-correlation_impl/)</div>

</div>


### 스스로 설명해 보기

1. 위치 7의 곱의 합이 위치 2보다 큰 이유는?
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   곱의 합은 겹친 값의 크기에 비례한다. 위치 7의 조각 9, 9, 9는 틀과 모양은 다르지만 값이 커서 $$1 \cdot 9 + 3 \cdot 9 + 2 \cdot 9 = 54$$가 된다. 모양이 아니라 밝기가 점수를 올렸다.
   </details>
2. 위치 7의 정규화 점수가 0인 이유는?
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   조각 9, 9, 9에서 평균 9를 빼면 0, 0, 0이 되어 곱의 합이 0이다. 표준편차도 0이라, 모양이 없는 평평한 조각은 어떤 틀과도 비슷하다고 할 수 없다. 코드에서는 0으로 정했다.
   </details>
3. 정의의 두 식 $$\int \overline{f(t)}g(x + t)dt$$와 $$\int \overline{f(t - x)}g(t)dt$$가 같은 이유는?
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   첫 식에서 $$u = x + t$$로 바꾸면 $$t = u - x$$, $$dt = du$$라 $$\int \overline{f(u - x)}g(u)du$$가 된다. 적분 변수 이름만 다르다.
   </details>
- 이 방법의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  모르는 위치를 찾으려고 모든 위치에서 비교 점수를 매기고 가장 높은 곳을 고른다. 점수는 "겹친 값끼리 곱해 더하기", 곧 내적이다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  소리에서 같은 소리가 늦게 다시 들리는 메아리의 지연 시간 찾기, GPS·레이더에서 보낸 신호가 돌아온 시각 찾기, 반복 주기 찾기(자기 상관).
  </details>

## 활용

- **패턴 찾기(틀 맞추기).** 슬라이드 p.43은 동전 사진에서 동전 하나를, 항공 사진에서 지붕 하나를 틀로 삼아 상관 그래프 영상을 만든다. 같은 모양이 있는 자리마다 빨간 봉우리가 선다[^4].
- **계산량.** 그림이 $$N$$칸, 틀이 $$M$$칸이면 위치마다 곱셈 $$M$$번이라 모두 약 $$NM$$번이다. 영상이면 $$N^2 M^2$$에 비례해 금방 커진다. 그래서 큰 틀은 푸리에 변환으로 계산을 바꿔 빠르게 한다[^s4].
- **한계.** 틀이 돌아가 있거나 크기가 다르면 점수가 떨어진다. 교차 상관은 옮김(평행 이동)만 찾는다.

## 연결

- 선수: [모양의 비슷함 재기](/Hongs_Blog/studies/human-interface-media/shape-similarity/), [컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/)
- 헷갈리는 짝: [교차 상관과 합성곱 비교](/Hongs_Blog/studies/human-interface-media/correlation-vs-convolution/)
- 2차원으로: [2차원 합성곱](/Hongs_Blog/studies/human-interface-media/two-dimensional-convolution/)의 상관 식 $$G[i, j] = \sum_u\sum_v H[u, v]F[i + u, j + v]$$

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"교차 상관 값이 가장 큰 곳이 틀과 가장 닮은 곳이다"</div>

정규화하지 않으면 틀렸다. 곱의 합은 겹친 값이 클수록 커지므로, 틀과 모양이 달라도 밝기만 높은 곳이 이긴다. 위 예에서 진짜 자리의 14보다 밝은 구간의 54가 크다. 확인 방법: 조각마다 평균을 빼고 표준편차로 나누면 진짜 자리만 1이 되고 밝은 구간은 0이 된다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$f \star g$$와 $$g \star f$$는 같다"</div>

틀렸다. 곱셈과 덧셈만 쓰니 순서가 상관없을 것 같지만, 옮기는 쪽이 바뀌면 방향이 뒤집힌다. $$(f \star g)[n] = (g \star f)[-n]$$이다. 확인 방법: $$f = [1, 2, 3]$$, $$g = [4, 0, -1, 2]$$로 두 순서를 계산하면 결과가 좌우로 뒤집혀 나온다(검증 코드).

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 불연속 신호의 교차 상관 $$(f \star g)[n]$$의 정의를 쓰고, $$f$$와 $$n$$이 각각 무엇을 뜻하는지 쓰라.</summary>


**답:** $$(f \star g)[n] = \sum_k \overline{f[k]}\, g[n + k]$$. $$f$$는 찾는 틀, $$g$$는 그림이고, $$n$$은 틀을 그림 위에서 옮긴 칸 수다. 값은 그 자리에서 겹친 칸의 곱을 모두 더한 점수다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 틀 $$t = [1, 3, 2]$$를 신호 $$s = [0, 0, 1, 3, 2, 0, 0, 9, 9, 9, 0, 0]$$의 위치 6에 놓으면 곱의 합은? 정규화 점수가 가장 큰 위치는?</summary>


**답:** 위치 6의 조각은 0, 9, 9라 $$1 \cdot 0 + 3 \cdot 9 + 2 \cdot 9 = 45$$. 정규화 점수는 위치 2에서 1로 가장 크다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 자기 상관 $$(f \star f)[n]$$이 $$n = 0$$에서 가장 큰 이유를 쓰라.</summary>


**답:** $$n = 0$$이면 같은 값끼리 곱해 $$\sum f[k]^2$$가 된다. 옮긴 뒤의 곱의 합 $$\sum f[k]f[k + n]$$은 코시-슈바르츠 부등식으로 $$\sqrt{\sum f[k]^2}\sqrt{\sum f[k + n]^2} = \sum f[k]^2$$를 넘지 못한다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 다음 함수가 하는 일을 한 문장으로 쓰라.

```python
def scan(t, s):
    m = len(t)
    return max(range(len(s) - m + 1),
               key=lambda n: sum(t[k] * s[n + k] for k in range(m)))
```
</summary>

**답:** 틀 `t`를 신호 `s`의 모든 위치에 놓아 보고, 겹친 값의 곱의 합(정규화하지 않은 교차 상관)이 가장 큰 위치를 돌려준다. 정규화하지 않아서 밝은 구간에 끌릴 수 있다.

</details>

[^1]: 휴먼 인터페이스 미디어 6회 강의 자료 「HIM_강의06_모양맞추기」, p.3 (같은 그림 찾기: 틀을 옮기며 만든 상관 그래프)
[^2]: 같은 자료, p.9 (교차 상관의 연속·불연속 정의). 같은 식이 p.8 "교차 상관"과 p.7 "교차 공분산"에도 있다.
[^3]: 같은 자료, p.6 (상관 가족: 상관, 교차 상관, 자기 상관)과 p.11 (비교 그림의 Autocorrelation)
[^4]: 같은 자료, p.43 (합성곱 - 패턴 찾기: 동전과 항공 사진의 틀, 상관 그래프 영상)과 p.44 (요약)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 1차원 예와 표의 수치는 원본에 없다. [29_cross-correlation_impl.py](/Hongs_Blog/studies/human-interface-media/code/29_cross-correlation_impl/)로 계산했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 1장은 원본에 없다. [29_cross-correlation_plot.py](/Hongs_Blog/studies/human-interface-media/code/29_cross-correlation_plot/)로 그렸고, 곱의 합 최대(위치 7, 54)와 정규화 점수 최대(위치 2, 1)를 같은 코드로 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 자기 상관의 최댓값 성질과 코시-슈바르츠 근거, 순서를 바꾸면 뒤집힌다는 성질은 원본에 없다. 표준 결과이고 검증 코드로 확인했다.
[^s4]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 계산량과 푸리에 변환으로 빠르게 하는 방법, 응용 예(메아리, GPS·레이더)는 신호 처리 교재의 표준 내용이다. 카드 C2~C4는 원본 범위를 넘는다.
{% endraw %}
