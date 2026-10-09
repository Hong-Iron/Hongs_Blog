---
layout: "note"
title: "뉴런의 연산 모형"
display_title: "뉴런의 연산 모형 (Computational Model of a Neuron)"
kind: "concept"
kind_label: "모델"
num: "07"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["연산 모형", "뉴런 모델링", "인공 뉴런", "artificial neuron", "활성 함수", "activation function", "바이어스", "bias", "변환 행렬", "transform matrix", "선형-비선형 모형", "LN model"]
description: "뉴런을 계산기로 보면, 여러 입력에 각각 무게를 곱해 더하고 그 결과를 정해진 범위 안으로 눌러 담는 장치다. 무게가 양수면 흥분, 음수면 억제다. 이 단순한 식 하나로 수렴·억제 같은 신경 회로를 계산할 수 있고, 인공 신경망의 기본 단위가 된다. 대신 시간에 따른 스파이크 하나…"
prev_url: "/studies/human-interface-media/excitatory-inhibitory/"
prev_title: "흥분성과 억제성 시냅스"
next_url: "/studies/human-interface-media/perceptron/"
next_title: "퍼셉트론"
math: true
mermaid: false
code_count: 2
permalink: "/studies/human-interface-media/neuron-computational-model/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

뉴런을 계산기로 보면, 여러 입력에 각각 무게를 곱해 더하고 그 결과를 정해진 범위 안으로 눌러 담는 장치다. 무게가 양수면 흥분, 음수면 억제다. 이 단순한 식 하나로 수렴·억제 같은 신경 회로를 계산할 수 있고, 인공 신경망의 기본 단위가 된다. 대신 시간에 따른 스파이크 하나하나와 화학적 변화는 버린다.

</div>


## 예시로 보기

입력 셋을 받는 뉴런이 있다. 첫째·둘째 입력은 흥분성 시냅스(무게 +1), 셋째는 억제성 시냅스(무게 −1)로 들어온다[^s1].

| 입력 발화율 $$\mathbf{x}$$ | 무게를 곱해 더함 $$o$$ | 실제 발화율 $$a(o)$$ |
|---|---|---|
| $$(3, 2, 4)$$ | $$3 + 2 - 4 = 1$$ | $$1$$ |
| $$(1, 0, 4)$$ | $$1 + 0 - 4 = -3$$ | $$0$$ |

두 번째 줄에서 합은 −3이다. 발화율은 음수가 될 수 없으므로 실제 출력은 0이다. 반대로 합이 아무리 커도 발화율은 초당 수백 회를 넘지 못한다([발화율 부호화](/Hongs_Blog/studies/human-interface-media/rate-coding/)). 합을 현실의 범위로 눌러 담는 함수가 활성 함수 $$a$$다.

생물의 부품과 식의 기호는 이렇게 대응한다[^s1].

| 생물 뉴런 | 식 |
|---|---|
| 들어오는 입력들의 발화율 | 입력 벡터 $$\mathbf{x}$$ |
| 시냅스의 종류와 세기 (흥분 +, 억제 −) | 행렬 $$A$$의 성분 |
| 입력이 없을 때의 기본 활동 | 바이어스 $$\mathbf{b}$$ |
| 발화율의 하한 0과 상한 | 활성 함수 $$a(\cdot)$$ |

## 정의

슬라이드는 뉴런을 연산 가능한 식으로 만드는 과정을 단계로 보여 준다[^1].

1. 입력과 출력이 있다 → 함수로 본다.
2. 입력은 여럿이다: $$\mathbf{x} = [x_1, \dots, x_D]^\top$$($$^\top$$는 행과 열을 바꾸는 전치). 출력도 여럿일 수 있다: $$\mathbf{o} = [o_1, \dots, o_R]^\top$$.
3. 전달 함수 $$\mathbf{o} = f(\mathbf{x})$$.
4. 뉴런의 기능이 선형이라면 $$f$$는 선형 함수다.
5. 출력값에 최대·최소가 있다면(출력이 한정되면) 활성 함수 $$a$$를 씌운다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$
\mathbf{o}' = a\bigl(f(\mathbf{x})\bigr) = a(A\mathbf{x} + \mathbf{b}), \qquad A \in \mathbb{R}^{R \times D},\ \mathbf{x} \in \mathbb{R}^{D},\ \mathbf{b} \in \mathbb{R}^{R}
$$

입력 $$\mathbf{x}$$는 수 $$D$$개짜리 목록, $$A$$는 $$R$$행 $$D$$열의 변환 행렬, $$\mathbf{b}$$는 수 $$R$$개짜리 바이어스, $$a$$는 활성 함수로 성분마다 따로 적용한다. 즉 출력 $$R$$개 하나하나가 "입력에 무게를 곱해 더하고, 바이어스를 더하고, 범위 안으로 눌러 담은 값"이다. 성분으로 쓰면 $$o'_r = a\bigl(\sum_{d=1}^{D} A_{rd}\, x_d + b_r\bigr)$$($$\sum$$은 차례로 모두 더한다는 기호), $$r = 1, \dots, R$$이다.

</div>


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "b: Dx1 행렬 (바이어스: bias)" (강의 2 p.11) / 문제점: $$A$$가 $$R \times D$$, $$\mathbf{x}$$가 $$D \times 1$$이면 $$A\mathbf{x}$$는 $$R \times 1$$이다. 여기에 더할 $$\mathbf{b}$$도 $$R \times 1$$이어야 한다. $$D \times 1$$이면 $$R \ne D$$일 때 덧셈이 정의되지 않는다. / 수정안: "b: Rx1 행렬" / 근거: 행렬 곱의 차원 규칙. $$R = 2$$, $$D = 3$$에서 $$3 \times 1$$ 바이어스는 더할 수 없고 $$2 \times 1$$은 된다 — [07_neuron-computational-model_verify.py](/Hongs_Blog/studies/human-interface-media/code/07_neuron-computational-model_verify/)

</div>


활성 함수의 예는 다음과 같다[^s2].

| 이름 | 식 | 출력 범위 | 생물과의 대응 |
|---|---|---|---|
| 계단 함수 | $$1\ (o > 0)$$, $$0$$ (그 밖) | $$\{0, 1\}$$ | 발화하느냐 마느냐 |
| 자르기 | $$\min(\max(o, 0), r_{\max})$$ | $$[0, r_{\max}]$$ | 발화율의 하한 0과 상한 |
| ReLU | $$\max(0, o)$$ | $$[0, \infty)$$ | 하한 0만 반영 |
| 시그모이드 | $$1 / (1 + e^{-o})$$ | $$(0, 1)$$ | 부드럽게 포화하는 발화율 곡선 |

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/07_neuron-computational-model_fig1.svg" alt="그림" loading="lazy">

네 함수 모두 합이 0보다 작으면 출력을 낮게 누른다. 위쪽은 서로 다르다. 계단·자르기·시그모이드는 1에서 멈추고, ReLU만 끝없이 올라간다[^s5].

## 증명

활성 함수가 없으면 층을 아무리 쌓아도 층 하나와 같다. 행렬 곱의 분배법칙과 결합법칙만으로 보인다.

<details markdown="1"><summary markdown="span">증명 펼치기</summary>


두 층 $$\mathbf{h} = A_1\mathbf{x} + \mathbf{b}_1$$, $$\mathbf{o} = A_2\mathbf{h} + \mathbf{b}_2$$가 있다고 하자.

1. $$\mathbf{o} = A_2(A_1\mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2$$ — 대입
2. $$= A_2A_1\mathbf{x} + A_2\mathbf{b}_1 + \mathbf{b}_2$$ — 행렬 곱의 분배법칙
3. $$= (A_2A_1)\mathbf{x} + (A_2\mathbf{b}_1 + \mathbf{b}_2)$$ — 결합법칙
4. $$A' = A_2A_1$$, $$\mathbf{b}' = A_2\mathbf{b}_1 + \mathbf{b}_2$$로 두면 $$\mathbf{o} = A'\mathbf{x} + \mathbf{b}'$$, 곧 층 하나다.

$$k$$층이면 같은 논리를 $$k - 1$$번 되풀이한다(수학적 귀납법).

</details>

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 차원 규칙(3×1 바이어스 거부), 두 층 = 한 층(무작위 정수 행렬 200회, 분수로 정확 계산), 예시 표의 출력, 자르기 함수의 범위(1,000회) — [07_neuron-computational-model_verify.py](/Hongs_Blog/studies/human-interface-media/code/07_neuron-computational-model_verify/)</div>

</div>


## 신호·머신러닝·인공지능 관점

교수님은 이 모형을 퍼셉트론 같은 모델과 함께 설명했다[^2]. 같은 식을 세 분야가 다르게 읽는다.

**신호.** $$A\mathbf{x} + \mathbf{b}$$는 선형(엄밀히는 아핀) 시스템이다. 입력 둘을 더해 넣으면 출력도 더해진다(중첩의 원리). $$A$$의 한 행 $$\mathbf{w}$$와 입력의 곱 $$\mathbf{w} \cdot \mathbf{x} = \lVert\mathbf{w}\rVert\,\lVert\mathbf{x}\rVert \cos\theta$$($$\lVert\cdot\rVert$$는 벡터의 길이)는 입력이 $$\mathbf{w}$$와 같은 방향일 때 가장 크다(코시-슈바르츠 부등식). 그래서 $$\mathbf{w}$$는 "찾고 싶은 무늬(템플릿)"이고, 곱은 입력이 그 무늬와 얼마나 닮았는지 재는 상관(correlation)이다. 같은 $$\mathbf{w}$$를 이미지 위치마다 옮겨 가며 곱하면 합성곱이 된다. 강의 계획표 7주차 "Convolution & Pattern Detection"의 계산이 이것이다[^3]. 선형 단계 뒤에 비선형 함수 하나를 붙인 구조는 계산 신경과학에서 선형-비선형(LN) 모형이라 부르는 표준 모형과 같다[^s3].

**머신러닝.** $$a(W\mathbf{x} + \mathbf{b})$$는 인공 신경망의 완전 연결층(fully connected layer) 하나다. 머신러닝 교재는 보통 변환 행렬을 $$W$$(weight)로 쓴다. 차이는 $$W$$와 $$\mathbf{b}$$를 사람이 정하지 않고 데이터로 학습한다는 점이다. 층을 쌓아 깊은 신경망을 만들 때 활성 함수가 꼭 있어야 하는 이유가 위의 증명이다. 비선형 함수가 없으면 100층을 쌓아도 1층짜리 선형 모델과 표현력이 같다[^s2]. 출력이 하나이고 활성 함수가 계단 함수인 경우가 [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/)이다.

**인공지능.** 이 식은 지식을 규칙이 아니라 숫자(가중치)에 담는다. 규칙과 기호로 지능을 만들려는 기호주의(symbolic AI)와 달리, 단순한 단위를 많이 연결해 지능을 만들려는 연결주의(connectionism)의 출발점이다. 뇌의 구조에서 영감을 얻었다는 점에서 [지능 시스템](/Hongs_Blog/studies/human-interface-media/intelligent-system/)의 "사람처럼 생각" 쪽에 뿌리가 있다[^s4].

## 활용

- 강의 2 p.12~14의 수렴 회로를 이 식으로 모델링한다: [뉴런 수렴 모델링 연습](/Hongs_Blog/studies/human-interface-media/neuron-convergence-modeling/)
- 측면 억제, 중심-주변 수용장도 $$A$$의 부호 배치(가운데 +, 둘레 −)만 다른 같은 식이다.

## 연결

- 선수: [발화율 부호화](/Hongs_Blog/studies/human-interface-media/rate-coding/) (출력의 범위), [흥분성과 억제성 시냅스](/Hongs_Blog/studies/human-interface-media/excitatory-inhibitory/) (가중치의 부호)
- 특수한 경우: [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/) (출력 하나, 계단 함수, 학습 규칙)
- 이 식으로 푸는 회로: [뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"활성 함수는 출력 범위를 맞추려고 붙이는 장식일 뿐이다"</div>

틀렸다. 슬라이드가 활성 함수를 "출력값이 한정될 때" 붙인다고 소개해서 범위 조정용으로만 보이기 쉽다. 범위 조정도 맞는 역할이지만, 더 중요한 역할은 비선형성이다. 활성 함수가 없으면 층을 몇 개 쌓든 $$A'\mathbf{x} + \mathbf{b}'$$ 하나로 줄어든다. 그러면 XOR처럼 직선 하나로 가를 수 없는 문제를 영원히 풀지 못한다. 확인 방법: 위 증명의 네 줄, 그리고 [퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/)의 XOR 예.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 입력 $$D$$개, 출력 $$R$$개인 뉴런 층의 연산 모형을 식으로 쓰고, $$A$$, $$\mathbf{x}$$, $$\mathbf{b}$$, $$\mathbf{o}'$$의 크기를 쓰라. 흥분성·억제성 시냅스는 식의 어디에 나타나는가?</summary>


**답:** $$\mathbf{o}' = a(A\mathbf{x} + \mathbf{b})$$. $$A$$는 $$R \times D$$, $$\mathbf{x}$$는 $$D \times 1$$, $$\mathbf{b}$$와 $$\mathbf{o}'$$는 $$R \times 1$$. 흥분성은 $$A$$의 양수 성분, 억제성은 음수 성분이다.<br>
**흔한 오답:** 슬라이드를 따라 $$\mathbf{b}$$를 $$D \times 1$$로 쓴다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 슬라이드처럼 바이어스 $$\mathbf{b}$$를 $$D \times 1$$로 두면 계산이 되지 않는 구체적인 경우를 하나 들라. 언제는 우연히 계산이 되는가?</summary>


**답:** $$R = 2$$, $$D = 3$$이면 $$A\mathbf{x}$$는 $$2 \times 1$$인데 $$\mathbf{b}$$는 $$3 \times 1$$이라 더할 수 없다. $$R = D$$일 때만 크기가 우연히 맞는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 활성 함수 없이 선형 층 두 개 $$A_1\mathbf{x} + \mathbf{b}_1$$, $$A_2\mathbf{h} + \mathbf{b}_2$$를 쌓으면 무엇과 같아지는가? 그래서 활성 함수가 해야 하는 일은 무엇인가?</summary>


**답:** $$(A_2A_1)\mathbf{x} + (A_2\mathbf{b}_1 + \mathbf{b}_2)$$, 곧 선형 층 하나와 같다. 활성 함수는 출력을 현실 범위로 한정하는 일과 함께, 비선형성을 넣어 층을 쌓는 의미가 생기게 한다.

</details>

[^1]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/02.HIM_강의02_사람의지각.pdf, p.11 (연산 모형)
[^2]: 사용자 전달(2026-09-25): 교수님이 강의에서 퍼셉트론 등의 모델을 함께 설명하며 이 내용을 이야기했다. 슬라이드에는 "퍼셉트론"이라는 말이 없다.
[^3]: 4-1학기/휴먼 인터페이스 미디어/1.수업자료/00. HIM_2026_Syllabus.pdf, Lecture Calendar 7주차
[^s1]: 에이전트 보충. 예시의 가중치와 입력값은 설명용 가상 수치다. 생물과 식의 대응표는 원본에 없는 해석이며, 실제 뉴런은 시간에 따라 변하는 스파이크 열과 비선형 수상돌기를 가지므로 이 대응은 발화율 수준의 근사다.
[^s2]: 에이전트 보충. 활성 함수 표와 "층 쌓기" 논의는 원본 밖이다. 증명은 선형대수의 분배·결합법칙만 쓴다.
[^s3]: 에이전트 보충. 템플릿·상관·합성곱 해석은 코시-슈바르츠 부등식에서 나온다. 선형-비선형(LN) 모형은 망막 신경절 세포 같은 뉴런의 반응을 설명하는 계산 신경과학의 표준 모형이다.
[^s4]: 에이전트 보충. 기호주의와 연결주의의 구분은 인공지능 교과서(예: Russell & Norvig, *Artificial Intelligence: A Modern Approach*)의 표준 구분이다.
[^s5]: 에이전트 보충. 그림 1장은 원본에 없다. [07_neuron-computational-model_plot.py](/Hongs_Blog/studies/human-interface-media/code/07_neuron-computational-model_plot/)로 그렸고, 그림에 쓴 값(계단 출력 $$\{0, 1\}$$, 자르기 $$[0, 1]$$, ReLU 하한 0, 시그모이드$$(0) = 0.5$$)을 같은 코드로 확인했다.
{% endraw %}
