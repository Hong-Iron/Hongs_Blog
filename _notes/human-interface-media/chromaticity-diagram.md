---
layout: "note"
title: "색도도"
display_title: "색도도 (Chromaticity Diagram)"
kind: "concept"
kind_label: "정리"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Chromaticity Diagram", "CIE 색도도", "CIE chromaticity diagram", "색도", "chromaticity", "색도 좌표", "chromaticity coordinates", "스펙트럼 궤적", "spectral locus", "보라선", "purple line", "흰색점", "white point", "색역", "gamut", "흑체 궤적", "Planckian locus", "색온도", "color temperature", "상관 색온도", "correlated color temperature", "D65", "무게중심 법칙", "center of gravity law"]
description: "색도도는 빛의 밝기를 떼어 내고 \"어떤 색인가\"만 남겨 평면 위의 점 하나로 찍은 색 지도다. 빛 두 개를 섞으면 두 점을 잇는 선분 위의 색이 되고, 세 개를 섞으면 세 점이 만드는 삼각형 안의 색이 된다. 그래서 화면의 세 원색이 낼 수 있는 색의 범위와, 목표 색을 만들 때 …"
prev_url: "/studies/human-interface-media/cie-xyz/"
prev_title: "CIE XYZ"
next_url: "/studies/human-interface-media/macadam-ellipses/"
next_title: "맥애덤 타원"
math: true
mermaid: false
code_count: 2
code_files: [{"t": "38_chromaticity-diagram_plot.py", "u": "/studies/human-interface-media/code/38_chromaticity-diagram_plot/", "r": "그림 생성"}, {"t": "38_chromaticity-diagram_verify.py", "u": "/studies/human-interface-media/code/38_chromaticity-diagram_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/chromaticity-diagram/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

색도도는 빛의 밝기를 떼어 내고 "어떤 색인가"만 남겨 평면 위의 점 하나로 찍은 색 지도다. 빛 두 개를 섞으면 두 점을 잇는 선분 위의 색이 되고, 세 개를 섞으면 세 점이 만드는 삼각형 안의 색이 된다. 그래서 화면의 세 원색이 낼 수 있는 색의 범위와, 목표 색을 만들 때 섞는 비율을 그림에서 바로 읽는다. 단, 빛을 더해서 섞을 때만 맞고, 섞은 점이 선분의 어디에 오는지는 두 빛의 밝기 비율로 정해지지 않는다.

</div>


## 예시로 보기

[CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)는 빛 하나를 세 수 $$X, Y, Z$$로 적는다. 정확하지만 불편한 점이 두 가지 있다. 3차원 점은 종이에 그려 비교하기 어렵다. 또 같은 빛을 두 배로 밝히면 세 수가 모두 두 배가 되어, 색은 같은데 숫자가 달라진다.

빛 P가 $$(X, Y, Z) = (30, 20, 50)$$이라 하자. 두 배로 밝히면 $$(60, 40, 100)$$이다. 두 빛은 밝기만 다르고 색은 같다. 세 수를 각자의 합으로 나누면 둘 다 $$(0.3, 0.2, 0.5)$$가 된다. 나눈 세 수는 더하면 늘 1이므로 앞의 두 수만 적어도 된다. 이 두 수 $$(x, y) = (0.3, 0.2)$$를 색도 좌표라 부르고, 모든 색을 이 좌표로 찍은 평면 그림을 색도도라 부른다.

그림으로 보면 이렇다. 원점에서 점 $$(X, Y, Z)$$로 반직선을 긋는다. 이 반직선이 평면 $$X + Y + Z = 1$$과 만나는 점이 $$(x, y, z)$$다. 같은 반직선 위의 빛은 밝기만 다르므로 모두 같은 점에 찍힌다. 그 평면을 위에서 내려다본 그림이 색도도다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/38_chromaticity-diagram_fig1.svg" alt="그림" width="549" height="572" loading="lazy">

굽은 회색 테두리는 파장 하나짜리 빛(단색광)이 찍히는 자리다. 숫자는 파장(nm)이고, 왼쪽 아래 460에서 왼쪽 위 520을 지나 오른쪽 아래 620까지 무지개 순서로 돈다. 이 테두리를 스펙트럼 궤적(spectral locus)이라 부른다. 아래쪽 보라색 점선은 테두리의 두 끝을 곧게 잇는다. 이 선 위의 자주·보라는 파장 하나로는 나오지 않고, 보라 끝 빛과 빨강 끝 빛을 섞어야 나온다. 이 선을 보라선(purple line)이라 부른다. 실제 빛이 낼 수 있는 색은 모두 이 테두리 안에 있다[^s1].

가운데의 초록 네모(D65)와 노란 세모(E)는 흰색으로 정해 둔 점이다. 이런 점을 흰색점(white point)이라 부른다. 주황 곡선은 달군 물체가 온도에 따라 내는 빛의 색을 이은 것이다. 파란 삼각형은 흔한 컴퓨터 화면의 표준인 sRGB의 세 원색을 꼭짓점으로 한 삼각형이다[^s1].

**색온도.** 쇠를 달구면 처음에는 검붉다가 주황, 노랑을 거쳐 하얗게 빛나고, 더 뜨거우면 푸르스름해진다. 빛을 모두 흡수했다가 온도만으로 빛을 내는 이상적인 물체(흑체)가 내는 빛의 색을 그 온도(K, 켈빈)로 부르는 것이 색온도다. 흑체의 색을 온도 순서로 이은 주황 곡선을 흑체 궤적(Planckian locus)이라 부른다. 곡선 위에 꼭 있지 않은 흰빛도 가장 가까운 흑체의 온도로 부른다(상관 색온도). 낮빛을 대표하는 표준 흰색 D65는 색도 $$(0.3127, 0.3290)$$이고, 색온도가 약 6,500K다. 그래서 "색온도 6500K의 색"이라 하면 보통 이 점을 쓴다[^s2].

**섞기.** 빛을 섞으면 $$X, Y, Z$$가 각각 그대로 더해진다([CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/)). 색도 $$(0.3, 0.2)$$인 P $$(30, 20, 50)$$과 색도 $$(0.1, 0.6)$$인 Q $$(10, 60, 30)$$을 섞으면 $$(40, 80, 80)$$이다. 합은 200이므로 색도는 $$(0.2, 0.4)$$, 두 점의 한가운데다. Q를 두 배로 밝힌 $$(20, 120, 60)$$과 섞으면 $$(50, 140, 110)$$, 합 300, 색도 $$(0.167, 0.467)$$이다. 이번에는 P에서 Q 쪽으로 거리의 3분의 2만큼 간 자리다[^s3].

두 경우 모두 섞은 점은 P와 Q를 잇는 선분 위에 있다. 어디에 오는지는 각 빛의 세 수의 합 $$X + Y + Z$$가 정한다. 처음에는 100 대 100이라 한가운데, 다음에는 100 대 200이라 Q 쪽으로 끌렸다. 합이 큰 쪽이 섞은 점을 더 세게 당긴다.

소금물 섞기와 같은 계산이다. 색도 $$x = X/(X + Y + Z)$$는 "전체 중 X의 몫"이라서 "전체 중 소금의 몫"인 농도와 모양이 같다. 농도가 다른 소금물을 섞으면 새 농도는 두 농도를 각 소금물의 전체 무게로 평균 낸 값이다. 색도도 각 빛의 $$X + Y + Z$$를 무게로 평균 낸다. 비유가 틀어지는 곳은 하나다. 소금물은 농도 하나만 평균 내지만, 색도는 $$x$$와 $$y$$ 두 값을 같은 무게로 동시에 평균 낸다. 그래서 섞은 점이 두 점을 잇는 선분 위를 움직인다[^s3].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">색도 좌표</div>

빛의 세 자극값을 그 합으로 나눈 몫이 색도 좌표다. 밝기만 다른 빛은 색도 좌표가 같다. 세 몫의 합은 1이라 둘만 적는다.

**기호로 쓰면.** $$X, Y, Z \ge 0$$은 빛의 세 자극값(삼자극값)이고 $$X + Y + Z > 0$$이다.

$$x = \frac{X}{X + Y + Z}, \qquad y = \frac{Y}{X + Y + Z}, \qquad z = \frac{Z}{X + Y + Z} = 1 - x - y$$

색도도는 $$(x, y)$$ 평면이다. 휘도 $$Y$$와 색도 $$(x, y)$$를 함께 알면 빛을 되살릴 수 있다: $$X = \dfrac{x}{y}\,Y$$, $$Z = \dfrac{1 - x - y}{y}\,Y$$.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">섞은 빛의 색도 (무게중심 법칙)</div>

빛 여러 개를 더해 섞으면, 섞은 빛의 색도는 각 빛의 색도를 그 빛의 $$X + Y + Z$$를 무게로 평균 낸 점이다. 무게는 모두 0 이상이고, 빛이 둘이면 그 점은 두 점을 잇는 선분 위에, 셋이면 세 점이 만드는 삼각형 안(변 포함)에 있다. 거꾸로 그 삼각형 안의 점은 모두 세 빛을 알맞은 양으로 섞어 만들 수 있다. 삼각형 밖의 점은 만들 수 없다[^s4].

**기호로 쓰면.** 빛 $$i = 1, \dots, n$$의 세 자극값이 $$(X_i, Y_i, Z_i)$$, 무게가 $$S_i = X_i + Y_i + Z_i > 0$$, 색도가 $$(x_i, y_i)$$다. 섞은 빛의 색도 $$(x, y)$$는

$$x = \frac{\sum_i S_i\,x_i}{\sum_i S_i}, \qquad y = \frac{\sum_i S_i\,y_i}{\sum_i S_i}$$

다($$\sum_i$$는 $$i = 1$$부터 $$n$$까지 모두 더한다는 기호). 각 빛의 몫 $$\lambda_i = S_i / \sum_j S_j$$는 $$\lambda_i \ge 0$$, $$\sum_i \lambda_i = 1$$이다. 무게와 휘도 사이에는 $$S_i = Y_i / y_i$$가 맞는다.<br>
한 직선 위에 있지 않은 세 빛 $$A, B, C$$와 목표 점 $$W$$에 대해: $$W$$를 만들 수 있다 $$\Leftrightarrow$$ $$W = \lambda_A A + \lambda_B B + \lambda_C C$$, $$\lambda_A + \lambda_B + \lambda_C = 1$$을 만족하는 $$\lambda$$가 모두 0 이상이다. 이런 $$\lambda$$(무게중심 좌표)는 하나뿐이다.

</div>


무게를 휘도로 바꾸는 식 $$S_i = Y_i / y_i$$는 색도 정의 $$y_i = Y_i / S_i$$를 $$S_i$$에 대해 푼 것이다. 숫자로 한 번 더 보면, 휘도 30이고 $$y = 0.3$$인 빛의 무게는 $$30 / 0.3 = 100$$이다. 휘도가 같아도 $$y$$가 작은 빛은 무게가 크다.

결론이 맞으려면 아래 가정이 모두 필요하다. 하나라도 빼면 반례가 생긴다.

| 가정 | 빼면 생기는 일 | 반례 |
|---|---|---|
| 빛을 더해서 섞는다(가법 혼색) | 물감·필터처럼 빛을 덜어 내는 섞기는 이 계산을 따르지 않는다 | 파란 빛과 노란 빛을 알맞게 섞으면 흰빛이 된다. sRGB 화면에서 파랑과 노랑(빨강 + 초록)을 함께 켜면 흰색 D65다. 파란 물감과 노란 물감을 섞으면 초록이 된다([가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/)) |
| 무게는 $$X + Y + Z$$다 | 휘도 $$Y$$로 무게를 주면 점이 엉뚱한 자리에 간다 | 아래 오해 상자와 카드 C3 |
| 각 빛의 양은 0 이상이다 | 양을 음수로 허락하면 직선 전체로 퍼져 "안쪽"이라는 제약이 사라진다 | sRGB 세 원색으로 500 nm 청록을 맞추려면 빨강 몫이 음수다. 빛은 음수로 켤 수 없으니 화면은 이 색을 못 낸다([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 음수 원색) |

역도 맞는다. 삼각형 안의 점이면 몫 $$\lambda$$가 모두 0 이상이므로, 아무 양수 $$k$$를 골라 빛 $$i$$를 무게 $$S_i = k\lambda_i$$, 곧 휘도 $$Y_i = y_i\,k\lambda_i$$로 켜면 된다. 대우는 "어떤 몫이 음수면 그 세 빛으로는 만들 수 없다"이다.

색도도가 알려 주지 않는 것도 있다. 밝기가 빠져 있어서, 색도가 같아도 휘도가 다르면 다르게 보인다(주황과 갈색이 그 예다). 또 이 평면 위의 거리는 눈이 느끼는 색 차이와 비례하지 않는다([맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/))[^s5].

## 증명

두 단계다. 색도의 정의로 각 빛의 $$X_i$$를 "몫 × 무게"로 바꾸고, 빛이 더해진다는 성질로 합친다.

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


1. 각 빛에서 $$X_i = x_i S_i$$, $$Y_i = y_i S_i$$다. — 색도 정의 $$x_i = X_i / S_i$$의 양변에 $$S_i$$를 곱했다
2. 섞은 빛의 세 자극값은 $$X = \sum_i X_i$$, $$Y = \sum_i Y_i$$, $$Z = \sum_i Z_i$$다. — 빛을 더해 섞으면 세 자극값도 더해진다(그라스만 법칙)
3. 섞은 빛의 무게는 $$S = X + Y + Z = \sum_i (X_i + Y_i + Z_i) = \sum_i S_i$$다. — 2단계를 더하는 순서만 바꿨다
4. $$x = \dfrac{X}{S} = \dfrac{\sum_i x_i S_i}{\sum_i S_i}$$, 같은 방법으로 $$y = \dfrac{\sum_i y_i S_i}{\sum_i S_i}$$다. — 색도 정의에 1단계와 3단계를 넣었다
5. $$\lambda_i = S_i / \sum_j S_j$$로 두면 $$(x, y) = \sum_i \lambda_i (x_i, y_i)$$, $$\lambda_i \ge 0$$, $$\sum_i \lambda_i = 1$$이다. — 세 자극값이 0 이상이라 $$S_i > 0$$
6. 몫이 0 이상이고 합이 1인 평균은 두 점이면 선분 위, 세 점이면 삼각형 안에 놓인다(볼록 결합). — 점 $$P + \lambda (Q - P)$$에서 $$0 \le \lambda \le 1$$이 선분이다. 세 점은 한 점과 맞은편 변 위의 점을 다시 섞는 것으로 같은 논리를 두 번 쓴다
7. 역: 삼각형 안의 $$W$$에 대해 몫 $$\lambda_A, \lambda_B, \lambda_C \ge 0$$이 있다. 빛 $$i$$를 무게 $$k\lambda_i$$($$k > 0$$)로 켜면 4단계 식이 그대로 $$W$$를 준다. — 4단계를 거꾸로 읽었다

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 빛 2개·3개 묶음 각 1,000쌍에서 "세 자극값을 더한 뒤의 색도"와 "$$X+Y+Z$$ 무게 평균"이 $$10^{-12}$$ 안에서 일치하고, 휘도 $$Y$$ 무게 평균은 최대 0.495 어긋남. 무작위 점 20,000개에서 "삼각형 안"과 "몫이 모두 0 이상"이 일치 (증명은 위, 수치는 실험으로 확인됨). 코드: [38_chromaticity-diagram_verify.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-diagram_verify/)</div>

</div>


### 스스로 설명해 보기

1. "$$X_i = x_i S_i$$"
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   색도 정의 $$x_i = X_i / (X_i + Y_i + Z_i) = X_i / S_i$$의 양변에 $$S_i$$를 곱한 것이다. 색도는 몫, $$S_i$$는 전체라서 몫 × 전체 = 부분이다.
   </details>
2. "섞은 빛의 $$X$$는 $$\sum_i X_i$$다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   세 자극값은 빛의 스펙트럼에 등색 함수를 곱해 적분한 값이다. 빛을 섞으면 스펙트럼이 더해지고, 적분은 더한 것을 따로따로 적분해 더한 것과 같다(선형성).
   </details>
3. "섞은 빛의 무게는 $$\sum_i S_i$$다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   $$X$$, $$Y$$, $$Z$$가 각각 더해지므로 그 합도 더해진다. 세 수가 모두 더해진다는 점 때문에 무게가 $$X + Y + Z$$가 된다.
   </details>
4. "몫이 모두 0 이상이면 삼각형 안이다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   세 빛의 평균은 "A와 B를 먼저 섞은 점(변 AB 위)"과 "C"를 다시 섞은 것이다. 두 번 모두 선분 위에 오므로 결과는 삼각형 안이다. 몫이 음수면 선분을 벗어나 연장선으로 나간다.
   </details>
- 이 증명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  색도는 "합으로 나눈 몫"이므로, 더해지는 양(세 자극값)과 나누는 양(그 합)을 따로 더한 뒤 나누면 된다. 그 결과가 합을 무게로 한 가중 평균이다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  "부분 ÷ 전체"로 정한 비율을 섞는 모든 곳. 소금물 농도, 학점을 가중치로 한 평균 평점, 여러 반을 합친 평균 점수(반마다 학생 수가 무게), 물체 여러 개의 무게중심. 모두 "전체"를 무게로 평균 낸다.
  </details>

## 예제

### 세 광원으로 6500K 흰색 만들기

CIE XYZ 색도도에 광원 A(0.2, 0.2), B(0.6, 0.3), C(0.1, 0.4)가 있다. 색온도 6500K의 색을 내려면 A, B, C를 어떤 비율로 섞어야 하는가?

1. *목표 점 정하기:* 6500K의 색은 표준 낮빛 흰색 D65로 둔다. $$W = (0.3127, 0.3290)$$이다[^s6].
2. *식 세우기:* 세 광원의 몫을 $$\alpha, \beta, \gamma$$라 하면 세 식이 나온다. 몫의 합이 1이라는 식과, $$x$$와 $$y$$ 각각의 평균 식이다.

$$\alpha + \beta + \gamma = 1, \qquad 0.2\alpha + 0.6\beta + 0.1\gamma = 0.3127, \qquad 0.2\alpha + 0.3\beta + 0.4\gamma = 0.3290$$

{: start="3"}
3. *미지수 줄이기:* 첫 식에서 $$\gamma = 1 - \alpha - \beta$$를 두 식에 넣는다. $$x$$ 식은 $$0.1\alpha + 0.5\beta + 0.1 = 0.3127$$, 곧 $$0.1\alpha + 0.5\beta = 0.2127$$이다. $$y$$ 식은 $$-0.2\alpha - 0.1\beta + 0.4 = 0.3290$$, 곧 $$0.2\alpha + 0.1\beta = 0.0710$$이다.
4. *연립 풀기:* 첫 식에서 $$\alpha = 2.127 - 5\beta$$. 둘째 식에 넣으면 $$0.4254 - \beta + 0.1\beta = 0.0710$$, 곧 $$0.9\beta = 0.3544$$, $$\beta \approx 0.3938$$이다. 그러면 $$\alpha = 2.127 - 1.9689 \approx 0.1581$$, $$\gamma = 1 - 0.1581 - 0.3938 = 0.4481$$이다.
5. *판정:* 세 몫이 모두 양수이므로 $$W$$는 삼각형 ABC 안에 있고, 이 세 광원으로 만들 수 있다.
6. *무게의 비:* 색도도 위의 몫, 곧 각 광원의 $$X + Y + Z$$의 비는 $$0.158 : 0.394 : 0.448 \approx 1 : 2.49 : 2.83$$이다. 분수로는 정확히 $$1423 : 3544 : 4033$$이다.
7. *휘도의 비로 바꾸기:* 광원의 휘도는 $$Y_i = y_i S_i$$이므로 몫에 각 광원의 $$y$$를 곱한다. $$0.2 \times 0.1581 : 0.3 \times 0.3938 : 0.4 \times 0.4481 = 0.0316 : 0.1181 : 0.1792$$이다. 합이 1이 되게 나누면 $$0.096 : 0.359 : 0.545 \approx 1 : 3.74 : 5.67$$이다. 밝기 조절 손잡이를 돌려 맞출 때 쓰는 비율이 이것이다.
8. *대입해 확인:* $$x = 0.1581 \times 0.2 + 0.3938 \times 0.6 + 0.4481 \times 0.1 = 0.0316 + 0.2363 + 0.0448 = 0.3127$$. $$y = 0.0316 + 0.1181 + 0.1792 = 0.3290$$. 목표와 같다. 휘도 몫의 합 $$0.3290$$이 $$W$$의 $$y$$와 같은 것도 확인이 된다(휘도 합 ÷ 무게 합 $$= y$$).

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/38_chromaticity-diagram_fig2.svg" alt="그림" width="538" height="295" loading="lazy">

$$W$$에서 세 꼭짓점으로 점선을 그으면 삼각형이 셋으로 나뉜다. 각 작은 삼각형의 넓이를 전체 넓이 0.045로 나눈 값이 맞은편 광원의 몫이다. A의 몫이 0.158로 가장 작은 것은 $$W$$가 A에서 멀고 변 BC에 바짝 붙어 있기 때문이다[^s1].

**목표 점을 달리 잡으면.** 6500K의 흑체 색 $$(0.3135, 0.3237)$$을 쓰면 무게 비는 $$0.187 : 0.390 : 0.424$$, 휘도 비는 $$0.115 : 0.361 : 0.524$$다. D65와 셋째 자리에서 달라진다. $$(1/3, 1/3)$$을 쓰면 무게 비가 $$1 : 4 : 4$$, 휘도 비가 $$1 : 6 : 8$$로 깔끔하게 나오지만, 이 점은 에너지가 모든 파장에 고르게 퍼진 흰색 E이고 색온도는 약 5,460K다[^s2].

**경계 사례.** $$W$$가 변 AB 위에 있으면 $$\gamma = 0$$이라 A와 B만으로 된다. $$W$$가 꼭짓점 A면 $$(\alpha, \beta, \gamma) = (1, 0, 0)$$이다. $$W$$가 삼각형 밖이면 몫 하나가 음수가 되어 만들 수 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: D65 목표의 몫 $$1423/9000$$, $$3544/9000$$, $$4033/9000$$ (분수로 정확히), 휘도 비 0.0961 : 0.3591 : 0.5448, 넓이 비 = 몫, 흑체 6500K와 $$(1/3, 1/3)$$의 비, 색온도(McCamy 근사식으로 D65 6,505K, E 5,459K) (실험으로 확인됨). 코드: [38_chromaticity-diagram_verify.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-diagram_verify/)</div>


단계를 줄여 가며 손으로 풀어 보는 연습: [색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/)

</div>


## 활용

- **화면이 낼 수 있는 색의 범위(색역).** 화면의 세 원색을 색도도에 찍으면 그 삼각형이 화면이 낼 수 있는 모든 색이다. 말굽은 바깥으로 둥글게 휘어 있어서 꼭짓점 셋짜리 삼각형으로는 다 덮을 수 없다. 원색이 실제 빛인 한, 어떤 화면도 사람이 볼 수 있는 모든 색을 내지 못한다. 화면마다 삼각형이 다른 것은 [YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)에서 다룬다.
- **조명과 사진의 흰색 맞추기.** 전구 포장의 "2700K", "6500K"는 색온도다. 카메라의 화이트 밸런스는 장면을 비춘 조명의 흰색점을 찾아, 그 점이 기준 흰색으로 가도록 색을 옮긴다[^s2].
- **색의 종류와 맑기 읽기.** 흰색점에서 어떤 색의 점을 지나 말굽까지 반직선을 그으면 닿는 파장이 그 색의 대표 파장(주파장)이다. 흰색점에서 말굽까지 거리 가운데 그 색이 얼마나 나가 있는지가 색의 맑기(순도)다. 색상(hue)과 채도(saturation)를 색도도 위의 방향과 거리로 읽는 셈이다([HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/))[^s5].
- **흔한 실수.** ① 몫(무게 비)을 그대로 밝기 비로 쓰기. ② "6500K"에 $$(1/3, 1/3)$$을 쓰기. ③ 색도도에서 밝기까지 읽으려 하기. ④ 물감 섞기에 이 계산을 쓰기.

## 연결

- 선수: [CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/) (세 자극값과 색도 좌표의 정의, 빛을 섞으면 세 자극값이 더해진다), [가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/) (이 법칙이 맞는 섞기)
- 삼각형 밖의 색과 음수 원색: [삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)
- 색도도 위의 거리가 눈의 느낌과 다른 문제: [맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/) → [CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/)
- 몫이 0 이상이고 합이 1인 선형결합(볼록 결합): [선형결합과 생성](/Hongs_Blog/studies/linear-algebra/span/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"섞은 점의 자리는 각 빛의 휘도(밝기) 비율로 정해진다"</div>

틀렸다. 밝은 빛이 색을 더 많이 좌우할 것 같아서, 그리고 $$Y$$가 휘도라서 그럴듯해 보인다. 실제로 섞을 때 더해지는 것은 $$X, Y, Z$$ 세 수 모두이므로, 섞은 점은 각 빛의 $$X + Y + Z = Y/y$$로 평균 낸 자리다. 휘도가 같아도 $$y$$가 작은 빛(파랑 쪽)은 무게가 훨씬 크다. 확인: 예제의 몫 $$0.158 : 0.394 : 0.448$$을 휘도 비로 착각해 그대로 켜면, 섞은 색은 $$(0.328, 0.310)$$이 되어 D65 $$(0.3127, 0.3290)$$에서 분홍 쪽으로 벗어난다. 휘도 비는 $$0.096 : 0.359 : 0.545$$로 맞춰야 한다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"흰색은 $$(1/3, 1/3)$$이니 6500K의 색도 $$(1/3, 1/3)$$이다"</div>

틀렸다. $$(1/3, 1/3)$$은 XYZ를 정할 때 "에너지가 모든 파장에 고른 빛"이 오도록 맞춘 흰색 E다. 흰색점은 조명마다 다르다. 6500K 낮빛 흰색 D65는 $$(0.3127, 0.3290)$$으로 E보다 조금 왼쪽 아래(파랑 쪽)에 있고, E의 색온도는 약 5,460K다. 확인: 위 예제를 $$(1/3, 1/3)$$으로 풀면 무게 비 $$1 : 4 : 4$$, D65로 풀면 $$1 : 2.49 : 2.83$$으로 답이 달라진다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 색도 좌표 $$x$$, $$y$$의 정의를 쓰라. 색도 좌표가 같은 두 빛이 다르게 보일 수 있는 이유는?</summary>


**답:** $$x = X/(X + Y + Z)$$, $$y = Y/(X + Y + Z)$$ ($$z = 1 - x - y$$). 세 자극값을 그 합으로 나누어 밝기를 떼어 냈기 때문에, 색도가 같아도 휘도 $$Y$$가 다르면 밝기가 다르게 보인다. 예: 주황과 갈색.<br>
**흔한 오답:** 분모를 $$Y$$로 쓴다. 분모는 세 수의 합이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 섞은 빛의 색도가 $$x = \sum_i S_i x_i / \sum_i S_i$$ ($$S_i = X_i + Y_i + Z_i$$)인 근거 두 가지를 쓰라.</summary>


**답:** (1) 색도 정의를 뒤집으면 $$X_i = x_i S_i$$다. (2) 빛을 더해 섞으면 세 자극값이 각각 더해지므로 $$X = \sum X_i$$, 전체 $$S = \sum S_i$$다. 둘을 색도 정의 $$x = X/S$$에 넣으면 된다.<br>
**이유:** (2)에서 세 수가 모두 더해지기 때문에 무게가 세 수의 합이 된다. 휘도 $$Y$$ 하나로 무게를 주면 틀린다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 빛 P는 색도 $$(0.15, 0.06)$$, 휘도 3이고, 빛 Q는 색도 $$(0.3, 0.6)$$, 휘도 30이다. 둘을 섞은 빛의 색도는?</summary>


**답:** 무게 $$S_P = 3/0.06 = 50$$, $$S_Q = 30/0.6 = 50$$으로 같다. 그래서 한가운데 $$\big((0.15 + 0.3)/2,\ (0.06 + 0.6)/2\big) = (0.225, 0.33)$$이다.<br>
**흔한 오답:** 휘도 3 : 30으로 평균 내 $$(0.286, 0.551)$$이라 쓴다. 휘도는 10배 차이지만 파란 P는 $$y$$가 작아 무게가 Q와 같다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 보라선 위의 색(자주)은 파장 하나짜리 빛으로 만들 수 없다. 이유를 쓰고, 실제 원색 세 개로는 말굽 전체를 덮을 수 없는 이유도 쓰라.</summary>


**답:** 단색광은 말굽의 굽은 테두리에만 찍힌다. 보라선은 테두리의 양 끝(보라 끝과 빨강 끝)을 잇는 직선이라, 그 위의 점은 두 끝 빛을 섞어야만 나온다. 세 원색이 낼 수 있는 색은 세 점의 삼각형 안뿐인데, 원색이 실제 빛이면 세 점이 말굽 안에 있고 말굽은 바깥으로 둥글게 휘어 있다. 그래서 삼각형과 말굽 사이에 늘 빈 곳이 남는다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 흑체 궤적을 따라 온도를 2000K에서 10000K로 올리면 점은 색도도에서 어느 쪽으로 움직이는가? D65와 흑체 6500K의 색도가 조금 다른데도 D65를 "6500K"라 부르는 이유는?</summary>


**답:** 오른쪽 위의 주황·노랑 쪽($$x$$가 큰 쪽)에서 왼쪽 아래의 푸르스름한 흰색 쪽으로 움직인다. 온도가 오를수록 $$x$$가 줄어든다. D65는 실제 낮빛을 흉내 낸 스펙트럼이라 흑체 궤적 위에 딱 놓이지 않고 조금 위($$y$$ 0.329 대 0.324)에 있다. 궤적 밖의 흰빛은 가장 가까운 흑체의 온도로 부르는데(상관 색온도), D65는 그 온도가 약 6,500K다.<br>
**흔한 오답:** "온도가 높을수록 붉다." 달군 쇠는 온도가 낮을 때 붉고, 높을수록 희다가 푸르스름해진다.

</details>

[^s1]: [38_chromaticity-diagram_plot.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-diagram_plot/)로 그렸다. 말굽은 CIE 1931 등색 함수의 해석적 근사(Wyman, Sloan, Shirley 2013, *JCGT* 2(2))로 그린 근사다. 이 근사는 420~645 nm에서 CIE 1931 2° 표준표의 단색광 색도와 0.015 안으로 맞고 양 끝에서는 어긋나서, 그 구간만 그리고 보라선으로 닫았다. 실제 말굽의 빨강 끝은 약 (0.735, 0.265)로 그림보다 조금 더 나간다. 흑체 궤적은 Kim 등(2002)의 근사식이다. 그림의 넓이 0.045와 몫은 같은 코드에서 확인했다.
[^s2]: 흑체·색온도·상관 색온도의 설명은 색채학 표준 내용이다(예: Wyszecki & Stiles, *Color Science* 2판). 흑체 6500K의 색도 (0.3135, 0.3237)은 Kim 등(2002) 근사식으로 계산했고, 해석적 등색 함수로 플랑크 스펙트럼을 적분한 값 (0.3135, 0.3238)과 맞는다. D65와 E의 색온도는 McCamy(1992) 근사식 계산값이다(6,505K, 5,459K). 화이트 밸런스 설명은 영상 공학의 표준 내용이다.
[^s3]: 빛 P, Q의 수치와 소금물 비유는 설명용으로 보탰다.
[^s4]: 색채학의 표준 내용이다(Wyszecki & Stiles, *Color Science* 2판).
[^s5]: 밝기·거리의 한계, 주파장과 순도는 색채학의 표준 내용이다. 주황과 갈색의 예는 색도가 비슷하고 밝기만 다른 색의 흔한 예로 보탰다.
[^s6]: 그래서 D65를 썼다. "비율"이 무엇의 비율인지 문제에 없어서 색도도 위의 몫($$X + Y + Z$$의 비)과 휘도($$Y$$)의 비를 모두 구했다.
{% endraw %}
