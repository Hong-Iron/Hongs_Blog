---
layout: "note"
title: "색도도 혼합 예제 사다리"
display_title: "색도도 혼합 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
description: "사용 개념: 색도도의 무게중심 법칙. 빛을 섞은 색도는 각 빛의 색도를 몫 \\lambdai로 평균 낸 점이다. 몫은 그 빛의 X + Y + Z가 전체에서 차지하는 비율이고, 모두 더하면 1이다. 빛의 휘도는 Yi = yi \\times (Xi + Yi + Zi)이므로 휘도의 비는 \\…"
prev_url: "/studies/human-interface-media/convolution-practice/"
prev_title: "합성곱 연습"
next_url: "/studies/human-interface-media/decibel-ladder/"
next_title: "데시벨 예제 사다리"
math: true
mermaid: false
code_count: 5
code_files: [{"t": "38_chromaticity-mixing-ladder_p1.py", "u": "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p1/", "r": "문제 1 풀이"}, {"t": "38_chromaticity-mixing-ladder_p2.py", "u": "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p2/", "r": "문제 2 풀이"}, {"t": "38_chromaticity-mixing-ladder_p3.py", "u": "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p3/", "r": "문제 3 풀이"}, {"t": "38_chromaticity-mixing-ladder_p4.py", "u": "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p4/", "r": "문제 4 풀이"}, {"t": "38_chromaticity-mixing-ladder_plot.py", "u": "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_plot/", "r": "그림 생성"}]
permalink: "/studies/human-interface-media/chromaticity-mixing-ladder/"
---
{% raw %}
사용 개념: [색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/)의 무게중심 법칙. 빛을 섞은 색도는 각 빛의 색도를 몫 $$\lambda_i$$로 평균 낸 점이다. 몫은 그 빛의 $$X + Y + Z$$가 전체에서 차지하는 비율이고, 모두 더하면 1이다. 빛의 휘도는 $$Y_i = y_i \times (X_i + Y_i + Z_i)$$이므로 휘도의 비는 $$\lambda_i\,y_i$$의 비다.

이 기법을 떠올리는 신호는 "광원 몇 개로 목표 색을 만들 수 있나", "어떤 비율로 섞어야 하나"를 색도 좌표로 묻는 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다. 식을 세우고, 몫을 구하고, 몫이 모두 0 이상인지 판정하고, 몫을 휘도 비로 바꾼다[^s1].

## 문제 1 · 완전한 풀이

색도가 P(0.6, 0.3), Q(0.2, 0.7)인 두 빛으로 색도 T(0.5, 0.4)를 만들려 한다. 만들 수 있는가? 있다면 두 빛을 어떤 비율로 켜야 하는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *식 세우기:* 빛이 둘이면 섞은 색은 선분 PQ 위에만 온다. 그래서 먼저 T가 직선 PQ 위에 있는지 본다. P에서 Q로 가면 $$x$$가 0.4 줄 때 $$y$$가 0.4 늘어 직선은 $$x + y = 0.9$$다. T는 $$0.5 + 0.4 = 0.9$$로 직선 위에 있다. P의 몫을 $$\lambda$$라 하면 Q의 몫은 $$1 - \lambda$$이고, $$x$$ 좌표의 식은 $$0.6\lambda + 0.2(1 - \lambda) = 0.5$$다.
2. *몫 구하기:* 정리하면 $$0.4\lambda = 0.3$$, $$\lambda = 0.75$$다. P의 몫 0.75, Q의 몫 0.25로 무게 비는 $$3 : 1$$이다. $$y$$로도 확인한다: $$0.3 \times 0.75 + 0.7 \times 0.25 = 0.225 + 0.175 = 0.4$$.
3. *판정:* 두 몫이 모두 0 이상이므로 T는 P와 Q 사이에 있고, 만들 수 있다.
4. *휘도 비로 바꾸기:* 휘도 비는 몫 × $$y$$의 비다. $$0.75 \times 0.3 : 0.25 \times 0.7 = 0.225 : 0.175 = 9 : 7$$이다. 손잡이로 맞출 때는 P를 휘도 9, Q를 휘도 7로 켠다.
5. *확인:* 휘도 9와 7로 켜면 무게는 $$9 / 0.3 = 30$$과 $$7 / 0.7 = 10$$으로 $$3 : 1$$이다. 섞은 색도는 $$x = (30 \times 0.6 + 10 \times 0.2) / 40 = 0.5$$, $$y = (9 + 7) / 40 = 0.4$$로 T와 같다.<br>
    <img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/38_chromaticity-mixing-ladder_fig1.svg" alt="그림" width="433" height="401" loading="lazy"><br>
    T는 선분 PQ를 P 쪽에서 1 : 3으로 나눈다. 무게가 3 : 1인 P 쪽에 가까이 붙는다. 시소에서 무거운 쪽 가까이에 받침점이 오는 것과 같다[^s2].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 직선 $$x + y = 0.9$$, 몫 3/4, 휘도 비 9 : 7, 휘도 9와 7로 다시 섞으면 (0.5, 0.4) (분수로 정확히). 코드: [38_chromaticity-mixing-ladder_p1.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p1/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

색도가 A(0.6, 0.3), B(0.3, 0.6), C(0.15, 0.06)인 세 빛으로 색도 T(0.42, 0.342)를 만들려 한다. 세 빛의 휘도 비는?

1. *식 세우기:* 세 몫을 $$\alpha, \beta, \gamma$$라 하면 $$\alpha + \beta + \gamma = 1$$, $$0.6\alpha + 0.3\beta + 0.15\gamma = 0.42$$, $$0.3\alpha + 0.6\beta + 0.06\gamma = 0.342$$다.
2. *몫 구하기:* $$\gamma = 1 - \alpha - \beta$$를 넣으면 $$0.45\alpha + 0.15\beta = 0.27$$, $$0.24\alpha + 0.54\beta = 0.282$$다. 첫 식에서 $$\alpha = 0.6 - \beta/3$$. 둘째 식에 넣으면 $$0.144 + 0.46\beta = 0.282$$, $$\beta = 0.3$$이다. 그러면 $$\alpha = 0.5$$, $$\gamma = 0.2$$다.
3. *판정:* 세 몫이 모두 양수라 T는 삼각형 ABC 안에 있고, 만들 수 있다.
4. *휘도 비로 바꾸기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

몫 × $$y$$의 비다. $$0.5 \times 0.3 : 0.3 \times 0.6 : 0.2 \times 0.06 = 0.15 : 0.18 : 0.012 = 25 : 30 : 2$$. 무게 비 $$5 : 3 : 2$$와 많이 다르다. $$y$$가 작은 C(파랑 쪽)는 휘도를 조금만 켜도 무게가 크다. 세 휘도의 합 $$0.342$$가 T의 $$y$$와 같은 것으로 확인한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 몫 $$(1/2, 3/10, 1/5)$$, 휘도 비 $$25 : 30 : 2$$, 휘도 25·30·2로 다시 섞으면 (0.42, 0.342) (분수로 정확히). 코드: [38_chromaticity-mixing-ladder_p2.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p2/)</div>

</div>


## 문제 3 · 하위목표 절반이 빈칸

sRGB 화면의 세 원색은 색도 R(0.64, 0.33), G(0.30, 0.60), B(0.15, 0.06)이고, 화면의 흰색은 D65 (0.3127, 0.3290)이다. 세 원색을 어떤 휘도 비로 켜야 흰색이 되는가?

1. *식 세우기:* 세 몫을 $$a, b, c$$라 하면 $$a + b + c = 1$$이다. $$c = 1 - a - b$$를 넣으면 $$x$$의 식은 $$0.49a + 0.15b = 0.1627$$, $$y$$의 식은 $$0.27a + 0.54b = 0.2690$$이다.
2. *몫 구하기:* ______
3. *판정:* 2에서 구한 세 몫이 모두 0 이상인지 본다.
4. *휘도 비로 바꾸기:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. 첫 식에서 $$a = (0.1627 - 0.15b)/0.49$$. 둘째 식에 넣으면 $$0.0897 - 0.0827b + 0.54b = 0.2690$$, $$0.4573b = 0.1793$$, $$b \approx 0.3922$$다. 그러면 $$a \approx 0.2120$$, $$c \approx 0.3959$$다.
3. 세 몫이 모두 양수라 D65는 sRGB 삼각형 안에 있다.
4. 몫 × $$y$$: $$0.2120 \times 0.33 : 0.3922 \times 0.60 : 0.3959 \times 0.06 = 0.0700 : 0.2353 : 0.0238$$. 합 $$0.3290$$으로 나누면 $$0.2126 : 0.7152 : 0.0722$$다. 이 세 수가 sRGB 화면에서 밝기를 계산하는 가중치 그대로다([YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/)). 흰색을 만들 때 각 원색이 보태는 휘도가 곧 그 원색의 밝기 몫이기 때문이다[^s3].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 몫 (0.2120, 0.3922, 0.3959), 손 풀이의 중간 식, 휘도 비 (0.2126, 0.7152, 0.0722) (실험으로 확인됨). 코드: [38_chromaticity-mixing-ladder_p3.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p3/)</div>

</div>


## 문제 4 · 독립 문제

광원 A(0.2, 0.2), B(0.6, 0.3), C(0.1, 0.4)가 있다. 이 세 광원을 섞어 선명한 초록 T(0.3, 0.6)를 만들 수 있는가? 만들 수 없다면 어느 광원이 걸림돌이고, 그것이 색도도에서 무엇을 뜻하는가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

세 몫을 $$\alpha, \beta, \gamma$$로 두고 $$\gamma = 1 - \alpha - \beta$$를 넣으면 $$x$$의 식 $$0.1\alpha + 0.5\beta = 0.2$$, $$y$$의 식 $$0.2\alpha + 0.1\beta = -0.2$$가 된다. 첫 식에서 $$\alpha = 2 - 5\beta$$. 둘째 식에 넣으면 $$0.4 - 0.9\beta = -0.2$$, $$\beta = 2/3$$이다. 그러면 $$\alpha = 2 - 10/3 = -4/3$$, $$\gamma = 1 + 4/3 - 2/3 = 5/3$$이다.<br>
대입하면 $$x = 0.2(-4/3) + 0.6(2/3) + 0.1(5/3) = 0.3$$, $$y = 0.2(-4/3) + 0.3(2/3) + 0.4(5/3) = 0.6$$으로 계산은 맞는다. 그러나 A의 몫이 음수다. 빛을 음수만큼 켤 수는 없으므로 이 세 광원으로는 T를 만들 수 없다. 걸림돌은 A다. 굳이 맞추려면 A의 빛을 목표 T 쪽에 더해야 한다는 뜻이다([삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/)의 음수 원색과 같다).<br>
색도도에서 보면 T는 삼각형 ABC 밖에 있다. 정확히는 변 BC를 사이에 두고 A의 반대편이다. 직선 BC는 $$x + 5y = 2.1$$이고, A를 넣으면 $$1.2$$, T를 넣으면 $$3.3$$으로 부등호 방향이 다르다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/38_chromaticity-mixing-ladder_fig2.svg" alt="그림" width="499" height="388" loading="lazy"><br>
파란 삼각형이 세 광원으로 만들 수 있는 색이다. T는 점선(직선 BC) 위쪽, A는 아래쪽에 있다. A에서 T로 가려면 변 BC를 넘어야 하므로 A의 몫이 음수가 된다[^s2].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 몫 $$(-4/3, 2/3, 5/3)$$, 대입하면 T, 직선 BC $$x + 5y = 2.1$$에 대해 A와 T가 반대편 (분수로 정확히). 코드: [38_chromaticity-mixing-ladder_p4.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p4/)</div>

</div>


## 변형 문제

1. 문제 1의 두 빛 P(0.6, 0.3), Q(0.2, 0.7)로 색도 (0.4, 0.4)를 만들 수 있는가?
2. 문제 2의 세 빛을 휘도 15, 30, 3으로 켜면 섞은 색도는 무엇인가?
3. 문제 1에서 무게 비 $$3 : 1$$을 휘도 비로 착각해 P를 휘도 3, Q를 휘도 1로 켜면 섞은 색도는 무엇인가?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. 만들 수 없다. $$0.4 + 0.4 = 0.8$$이라 직선 $$x + y = 0.9$$ 밖이다. 빛이 둘이면 섞은 색은 두 점을 잇는 선분 위에만 온다. 셋째 빛이 있어야 한다.
2. 무게가 $$15 / 0.3 = 50$$, $$30 / 0.6 = 50$$, $$3 / 0.06 = 50$$으로 모두 같다. 그래서 세 점의 단순 평균 $$\big((0.6 + 0.3 + 0.15)/3,\ (0.3 + 0.6 + 0.06)/3\big) = (0.35, 0.32)$$이다. 휘도는 10배까지 차이 나지만 무게는 같다.
3. 무게가 $$3 / 0.3 = 10$$, $$1 / 0.7 \approx 1.43$$이라 P의 몫이 $$10 / 11.43 = 0.875$$다. 색도는 $$(0.875 \times 0.6 + 0.125 \times 0.2,\ 0.875 \times 0.3 + 0.125 \times 0.7) = (0.55, 0.35)$$로, 목표 (0.5, 0.4)보다 P 쪽으로 치우친다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 변형 1은 [38_chromaticity-mixing-ladder_p1.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p1/), 변형 2는 [38_chromaticity-mixing-ladder_p2.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_p2/), 변형 3은 p1에서 분수로 확인.</div>

</div>


[^s1]: 문제와 수치는 연습용으로 만들었다.
[^s2]: [38_chromaticity-mixing-ladder_plot.py](/Hongs_Blog/studies/human-interface-media/code/38_chromaticity-mixing-ladder_plot/)로 그렸고, 그림의 값(몫 0.75, 거리 비 1 : 3, 문제 4의 몫, 직선 BC)을 같은 코드에서 확인했다.
[^s3]: sRGB 흰색을 만드는 휘도 비가 BT.709 밝기 가중치 (0.2126, 0.7152, 0.0722)와 같다는 것은 색 공간 행렬의 정의에서 나오는 표준 내용이다(RGB → XYZ 행렬의 $$Y$$ 행은 흰색에서 각 원색이 내는 휘도). 문제 코드에서 계산으로 확인했다.
{% endraw %}
