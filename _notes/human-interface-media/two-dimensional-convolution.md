---
layout: "note"
title: "2차원 합성곱"
display_title: "2차원 합성곱 (2-D Convolution)"
kind: "concept"
kind_label: "알고리즘"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["2-D Convolution", "2차원 합성곱", "2차원 컨벌루션", "이동 창", "moving window", "커널", "kernel", "마스크", "필터", "평균 필터", "average filter", "가중 평균 필터", "미분 필터", "임펄스 합성곱"]
description: "사진 위에 작은 숫자 판(커널)을 올려놓고, 겹친 칸끼리 곱해 더한 값을 판의 가운데 칸에 새로 적는다. 판을 한 칸씩 밀며 모든 픽셀에서 되풀이하면 새 사진이 나온다. 판의 숫자만 바꾸면 흐리게 하기, 윤곽 찾기, 옮기기를 모두 같은 방법으로 할 수 있다. 단, 엄밀한 합성곱은 …"
prev_url: "/studies/human-interface-media/correlation-vs-convolution/"
prev_title: "교차 상관과 합성곱 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/two-dimensional-convolution/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

사진 위에 작은 숫자 판(커널)을 올려놓고, 겹친 칸끼리 곱해 더한 값을 판의 가운데 칸에 새로 적는다. 판을 한 칸씩 밀며 모든 픽셀에서 되풀이하면 새 사진이 나온다. 판의 숫자만 바꾸면 흐리게 하기, 윤곽 찾기, 옮기기를 모두 같은 방법으로 할 수 있다. 단, 엄밀한 합성곱은 판을 180° 돌린 뒤 올려놓으므로, 좌우·위아래가 다른 판에서는 돌리지 않는 교차 상관과 결과가 달라진다.

</div>


## 예시로 보기

사진의 잡음을 줄이고 싶다. 픽셀 하나만 보면 잡음인지 진짜 무늬인지 모른다. 그래서 그 픽셀과 이웃 8칸, 모두 9칸을 평균 낸다. 이 일을 모든 픽셀에서 하는 것이 3×3 평균 필터다[^1].

$$ \frac{1}{9}\begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix} $$


3×5 영상의 한 칸에서 직접 계산해 본다.

```
영상 F                        3×3 창을 (1, 1)에 놓으면
3 4 5 6 0                     3 4 5
6 0 4 2 0      →  (1,1)의 새 값 = (3+4+5+6+0+4+1+2+3)/9 = 28/9 ≈ 3.11
1 2 3 4 5                     6 0 4
                              1 2 3
```

가운데 픽셀 0이 이웃의 평균 3.11로 바뀐다. 혼자 튀던 값이 주변에 묻힌다. 창을 오른쪽으로 한 칸 밀어 (1, 2)에서 다시 계산하고, 이렇게 영상 전체를 훑는다. 이 "움직이는 창"이 2차원 합성곱의 계산 방법이다[^2].

창을 키우면 더 넓게 평균 내므로 더 흐려진다. 슬라이드는 같은 영상을 3×3, 5×5, 9×9, 17×17 창으로 흐린다. 창이 클수록 촘촘한 줄무늬가 먼저 지워지고, 17×17에서는 굵은 체크무늬만 남는다[^3].

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/31_two-dimensional-convolution_fig1.svg" alt="그림" loading="lazy">

맨 위는 주기가 다른 세 줄무늬다(주기 4, 8, 16픽셀). 창 폭이 커질수록 짧은 주기부터 납작해진다. 폭 5 창은 주기 4 줄무늬를 납작하게 만들 뿐 아니라 밝고 어두운 줄을 뒤집는다(진폭 1/5, 부호 반대)[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

연속 2차원 합성곱은 $$h$$를 180° 돌리고(뒤집기), $$(x, y)$$로 옮기고, $$f$$와 곱해, 겹친 부피를 잰 것이다[^4].

$$ g(x, y) = f(x, y) ** h(x, y) = \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} f(\alpha, \beta)\,h(x - \alpha, y - \beta)\,d\alpha\,d\beta $$

디지털 영상 $$F$$와 커널 $$H$$의 합성곱은 커널 칸마다 영상의 반대편 칸을 곱해 더한다[^2].

$$ G[i, j] = F * H = H * F = \sum_{u}\sum_{v} H[u, v]\,F[i - u, j - v] $$

같은 자리에서 뒤집지 않고 곱하면 상관이다.

$$ G[i, j] = F \otimes H = \sum_{u}\sum_{v} H[u, v]\,F[i + u, j + v] $$

</div>


말로 읽으면, 결과 $$G$$의 $$(i, j)$$ 칸은 커널 칸 $$(u, v)$$마다 영상에서 $$(i - u, j - v)$$ 칸 값을 곱해 모두 더한 것이다. $$u$$, $$v$$는 커널 가운데를 $$(0, 0)$$으로 센다. 1차원 합성곱 $$f(x) * h(x) = \int f(x - \alpha)h(\alpha)\,d\alpha$$를 $$x$$와 $$y$$ 두 방향으로 늘린 것이다[^5].

슬라이드 p.20은 연속 합성곱을 네 동작으로 나눈다[^4].

| 단계 | 하는 일 | 식 |
|---|---|---|
| 뒤집기 | $$h$$를 180° 돌린다 | $$h(-\alpha, -\beta)$$ |
| 옮기기 | 돌린 $$h$$를 $$(x, y)$$로 옮긴다 | $$h(x - \alpha, y - \beta)$$ |
| 곱하기 | $$f$$와 겹친 부분을 곱한다 | $$f(\alpha, \beta)h(x - \alpha, y - \beta)$$ |
| 적분하기 | 곱한 결과의 부피를 잰다 | $$g(x, y)$$ |

### 실행 추적: 슬라이드 22쪽

$$f$$는 $$m, n \in \{-1, 0, 1\}$$인 3×3 칸에서 1이다. $$h$$는 $$(m, n) = (1, 0), (0, -1), (0, 0)$$ 세 칸에서 1이다[^6]. $$g(m, n) = \sum_k\sum_l f(k, l)h(m - k, n - l)$$이다.

임펄스와의 합성곱은 그 자리로 옮기는 일이므로, $$h$$의 세 점은 각각 "$$f$$를 그만큼 옮긴 복사본"을 만든다. $$g$$는 세 복사본의 합이다.

| 복사본 | 옮긴 양 $$(m, n)$$ | 차지하는 칸 |
|---|---|---|
| ① | $$(0, 0)$$ | $$m \in [-1, 1]$$, $$n \in [-1, 1]$$ |
| ② | $$(1, 0)$$ | $$m \in [0, 2]$$, $$n \in [-1, 1]$$ |
| ③ | $$(0, -1)$$ | $$m \in [-1, 1]$$, $$n \in [-2, 0]$$ |

칸마다 몇 장이 겹치는지 세면 $$g$$다. 위가 $$m = 2$$, 아래가 $$m = -1$$, 왼쪽이 $$n = -2$$다.

```
        n = -2  -1   0   1
m =  2     0     1   1   1
m =  1     1     3   3   2
m =  0     1     3   3   2
m = -1     1     2   2   1
```

슬라이드의 두 예 $$g(-1, -2) = 1$$, $$g(2, 1) = 1$$과 맞는다. 값 3이 4칸, 2가 4칸, 1이 7칸이다[^6].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 평균·가중 평균 커널의 합 1과 분리 가능성, 미분 커널이 경계에서만 값, 임펄스로 옮기기, 다섯 임펄스 = 다섯 장 평균, 교환법칙, 22쪽 표, 21쪽 네 구역 식(수치 적분), 창 폭에 따른 줄무늬 진폭 1/3·−1/5·0 (실험으로 확인됨) — [31_two-dimensional-convolution_impl.py](/Hongs_Blog/studies/human-interface-media/code/31_two-dimensional-convolution_impl/)</div>

</div>


### 스스로 설명해 보기

1. 22쪽 표에서 $$g(1, -1) = 3$$인 이유는?
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   $$(1, -1)$$은 복사본 ①($$m \in [-1, 1]$$, $$n \in [-1, 1]$$), ②($$m \in [0, 2]$$, $$n \in [-1, 1]$$), ③($$m \in [-1, 1]$$, $$n \in [-2, 0]$$) 세 칸에 모두 들어간다. 세 장이 겹쳐 1 + 1 + 1 = 3이다.
   </details>
2. 가중 평균 커널 $$\frac{1}{16}\begin{bmatrix}1&2&1\\2&4&2\\1&2&1\end{bmatrix}$$을 가로 한 번, 세로 한 번으로 나눠 계산해도 되는 이유는?
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   이 커널은 $$\frac{1}{4}[1, 2, 1]$$을 세로와 가로로 바깥곱한 것, 곧 분리 가능한 2차원 함수다([2차원 함수](/Hongs_Blog/studies/human-interface-media/two-dimensional-functions/)). 분리 가능한 커널과의 합성곱은 가로 1차원 합성곱 뒤 세로 1차원 합성곱과 같다.
   </details>
3. 커널의 합이 1이면 고른 밝기의 영상이 그대로인 이유는?
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   모든 칸이 같은 값 $$c$$이면 $$G[i, j] = \sum H[u, v] \cdot c = c\sum H[u, v] = c$$다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  커널은 "이웃을 어떤 무게로 섞을지"를 적은 표다. 숫자만 바꾸면 흐리기·윤곽 찾기·옮기기가 모두 같은 계산(곱해서 더하기)이 된다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  합성곱 신경망(CNN)은 커널의 숫자를 데이터로부터 배운다. 망막의 [측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/)도 이웃을 음의 무게로 섞는 커널로 볼 수 있다.
  </details>

## 예제

**연속 예(슬라이드 21쪽).** $$f$$와 $$h$$가 모두 0~1 × 0~1의 단위 정사각형이면, 돌린 $$h$$를 옮겨 $$f$$와 겹친 넓이가 $$g(x, y)$$다[^7]. 겹친 사각형의 가로는 $$x$$ 쪽 겹침, 세로는 $$y$$ 쪽 겹침이라 네 구역으로 나뉜다.

| 구역 | 범위 | $$g(x, y)$$ |
|---|---|---|
| (1) | $$0 < x \le 1$$, $$0 < y \le 1$$ | $$xy$$ |
| (2) | $$0 < x \le 1$$, $$1 < y \le 2$$ | $$x(2 - y)$$ |
| (3) | $$1 < x \le 2$$, $$0 < y \le 1$$ | $$(2 - x)y$$ |
| (4) | $$1 < x \le 2$$, $$1 < y \le 2$$ | $$(2 - x)(2 - y)$$ |

네 식은 하나로 묶인다. 1차원 사각 펄스끼리의 합성곱이 삼각형 $$\mathrm{tri}(x)$$(0~1에서 $$x$$, 1~2에서 $$2 - x$$)이고, 정사각형이 분리 가능하므로 $$g(x, y) = \mathrm{tri}(x)\,\mathrm{tri}(y)$$다. 꼭대기는 $$(1, 1)$$에서 1이다[^s2].

**커널 예(슬라이드 24~25, 36~42쪽).**

| 커널 | 하는 일 |
|---|---|
| $$\frac{1}{9}$$(3×3 모두 1) | 평균 필터: 흐리게 한다[^8] |
| $$\frac{1}{16}\begin{bmatrix}1&2&1\\2&4&2\\1&2&1\end{bmatrix}$$ | 가중 평균: 가운데에 무게를 더 주어 덜 뭉개며 흐린다[^8] |
| $$[-1\ \ 1]$$ | 가로 미분: 왼쪽과 오른쪽의 차이. 세로로 놓인 경계에서만 값이 나온다[^9] |
| $$\begin{bmatrix}-1\\1\end{bmatrix}$$ | 세로 미분: 가로로 놓인 경계를 찾는다[^9] |
| $$\delta(r - 16, c - 16)$$ | 영상을 아래로 16, 오른쪽으로 16픽셀 옮긴다[^10] |
| 다섯 점에 $$\frac{1}{5}$$씩 | 다섯 장을 옮겨 평균 낸다. 점들이 멀면 겹쳐 보이고, 붙어 있으면 흐리게 하는 필터가 된다[^10] |

경계 예: 왼쪽 세 칸이 10, 오른쪽 세 칸이 50인 줄에 $$[-1\ \ 1]$$을 쓰면 경계 자리에서만 $$10 - 50 = -40$$이 나오고 고른 곳은 0이다.

## 활용

- **복잡도.** 영상이 $$N \times N$$, 커널이 $$k \times k$$면 픽셀마다 곱셈 $$k^2$$번, 모두 $$N^2k^2$$번이다. 분리 가능한 커널이면 $$2N^2k$$번으로 줄어든다. 커널이 아주 크면 푸리에 변환으로 바꿔 곱하는 쪽이 빠르다[^s3].
- **영상 가장자리.** 창이 영상 밖으로 나가는 칸을 어떻게 볼지 정해야 한다. 밖을 0으로 보면 가장자리가 어두워진다. 슬라이드 39~41쪽에서 다섯 임펄스 합성곱 결과의 테두리가 검은 것이 그 때문이다[^10].
- **실제 사용처.** 사진 앱의 흐림·선명하게 하기, 경계 검출(소벨 필터), 합성곱 신경망의 층이 모두 이 연산이다. 신호 및 시스템 쪽 설명은 [영상의 경계 검출과 평활화](/Hongs_Blog/studies/signals-and-systems/edge-detection-smoothing/)에 있다.
- 흔한 실수: 비대칭 커널(미분 커널 등)에서 뒤집기를 빼먹는 것. 결과의 부호나 방향이 반대로 나온다.

## 연결

- 선수: [2차원 함수](/Hongs_Blog/studies/human-interface-media/two-dimensional-functions/) (분리 가능, 2차원 임펄스), [교차 상관과 합성곱 비교](/Hongs_Blog/studies/human-interface-media/correlation-vs-convolution/)
- 1차원 합성곱: [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/), [컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/)
- 흐리기가 지우는 것: [해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/)
- 연습: [합성곱 연습](/Hongs_Blog/studies/human-interface-media/convolution-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"창을 키우면 흐려지기만 할 뿐, 무늬가 뒤집히지는 않는다"</div>

틀렸다. 평균 창은 창 폭과 줄무늬 주기의 관계에 따라 줄무늬를 줄이기만 하는 것이 아니라 뒤집기도 한다. 주기 4픽셀 줄무늬에 폭 3 창을 쓰면 진폭이 1/3로 줄고, 폭 5 창을 쓰면 1/5로 줄면서 밝은 줄과 어두운 줄이 바뀐다. 폭 4(주기의 배수)면 완전히 회색이 된다. 확인 방법: 폭 $$w$$ 평균의 진폭 배율은 $$\sin(\pi u w) / (w\sin(\pi u))$$이고($$u$$는 픽셀당 주기), $$u = 1/4$$, $$w = 5$$를 넣으면 $$-1/5$$다[^s1].

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"합성곱은 커널을 그대로 올려놓고 곱해 더하는 것이다"</div>

그것은 상관이다. 합성곱은 커널을 180° 돌린 뒤 올려놓는다. 대칭 커널(평균 필터)에서는 차이가 없어서 헷갈리기 쉽다. 확인 방법: $$[-1\ \ 1]$$을 돌리지 않고 쓰면 경계 값이 $$+40$$, 돌려서 쓰면 $$-40$$이다. 부호가 반대다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 디지털 영상의 2차원 합성곱 $$G[i, j]$$와 상관의 식을 쓰고, 차이를 한 문장으로 쓰라.</summary>


**답:** 합성곱 $$G[i, j] = \sum_u\sum_v H[u, v]F[i - u, j - v]$$, 상관 $$G[i, j] = \sum_u\sum_v H[u, v]F[i + u, j + v]$$. 합성곱은 커널을 180° 돌려 올리고, 상관은 그대로 올린다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 슬라이드 22쪽 예($$f$$는 3×3 칸 모두 1, $$h$$는 $$(1, 0), (0, -1), (0, 0)$$에서 1)에서 $$g(0, 1)$$, $$g(-1, -1)$$, $$g(2, -1)$$을 구하라.</summary>


**답:** $$g(0, 1) = 2$$(복사본 ①, ②), $$g(-1, -1) = 2$$(①, ③), $$g(2, -1) = 1$$(②만).

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 코드가 하는 일을 한 문장으로 쓰라.

```python
G = [[sum(F[i+u][j+v] for u in (-1, 0, 1) for v in (-1, 0, 1)) / 9
      for j in range(1, len(F[0]) - 1)] for i in range(1, len(F) - 1)]
```
</summary>

**답:** 가장자리를 뺀 모든 픽셀을 자기와 이웃 8칸의 평균으로 바꾼다(3×3 평균 필터). 커널이 대칭이라 상관으로 계산해도 합성곱과 같다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 단위 정사각형끼리의 합성곱(21쪽)에서 $$g(0.5, 1.5)$$와 $$g(1.2, 1.8)$$을 구하라.</summary>


**답:** $$(0.5, 1.5)$$는 구역 (2)라 $$0.5 \times (2 - 1.5) = 0.25$$. $$(1.2, 1.8)$$은 구역 (4)라 $$(2 - 1.2)(2 - 1.8) = 0.16$$.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 다섯 점에 1/5씩 둔 커널이 점 사이가 멀면 "다섯 장이 겹쳐 보이는" 영상을, 점들이 붙어 있으면 "흐린" 영상을 만드는 이유를 쓰라.</summary>


**답:** 임펄스 하나와의 합성곱은 영상을 그 점만큼 옮긴 복사본이다. 다섯 점이면 복사본 다섯 장을 1/5씩 더한다. 멀리 옮긴 복사본은 서로 다른 자리에 보여 겹쳐 보이고, 한 픽셀씩만 옮긴 복사본은 이웃끼리 섞이므로 흐려진다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/06.HIM_강의06_모양맞추기.pdf, p.27~30 (평균 윈도우 1/9)
[^2]: 같은 자료, p.23 (2D Convolution by Moving Window: 합성곱과 상관의 식)과 p.26 (Convolution by Moving Window 그림)
[^3]: 같은 자료, p.31~35 (윈도우 크기: 원본, 3×3, 5×5, 9×9, 17×17)
[^4]: 같은 자료, p.20 (2차원 합성곱: flip(rotate −180°), shift, multiply, integrate)
[^5]: 같은 자료, p.19 (1-D와 2-D 합성곱)
[^6]: 같은 자료, p.22 (예2: $$f(m,n)$$, $$h(m,n)$$, $$h(-k,-l)$$, $$g(-1,-2)=1$$, $$g(2,1)=1$$, $$g(m,n)$$의 값 1·2·3)
[^7]: 같은 자료, p.21 (예: 단위 정사각형의 합성곱, 네 구역의 식)
[^8]: 같은 자료, p.24 (평균 필터와 가중 평균 필터)
[^9]: 같은 자료, p.25 (미분 필터 $$[-1\ 1]$$, $$[-1\ 1]^\top$$)
[^10]: 같은 자료, p.36~42 (임펄스 합성곱: 1 임펄스 16픽셀 이동, 5 임펄스, 5 임펄스 + 이동은 흐리는 필터, 1/5 다섯 개와 0 네 개인 행렬)
[^s1]: 에이전트 보충. 그림 1장과 진폭 배율 식, 1/3·−1/5·0은 원본에 없다. 슬라이드 31~35쪽의 창 크기 실험을 1차원 줄무늬로 다시 한 것이다. [31_two-dimensional-convolution_plot.py](/Hongs_Blog/studies/human-interface-media/code/31_two-dimensional-convolution_plot/)로 그렸고, 배율을 같은 코드와 구현 코드로 확인했다.
[^s2]: 에이전트 보충. 5×4 영상의 계산 예, 22쪽 예를 복사본 세 장으로 푸는 방법, 21쪽 네 식을 $$\mathrm{tri}(x)\mathrm{tri}(y)$$로 묶는 설명, 경계 예는 원본에 없다. 구현 코드로 확인했다.
[^s3]: 에이전트 보충. 계산량, 가장자리 처리, 실제 사용처(소벨, CNN)는 영상 처리 교재의 표준 내용이다. 카드 C2~C5는 원본 범위를 넘는다.
{% endraw %}
