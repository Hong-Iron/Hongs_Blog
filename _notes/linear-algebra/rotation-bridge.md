---
layout: "note"
title: "덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬"
display_title: "덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬: 각을 더하면 회전이 합성된다"
kind: "concept"
kind_label: "브리지"
num: "13"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Rotation Bridge", "회전의 세 표현", "덧셈정리", "복소수 곱", "회전 행렬", "드무아브르 공식", "De Moivre's formula", "페이저", "phasor", "쿼터니언", "quaternion"]
description: "삼각함수의 덧셈정리, 복소수의 곱셈, 회전 행렬의 곱은 서로 다른 과목에서 따로 배우지만, 모두 \"30°만큼 돌고 이어서 40°만큼 돌면 70°만큼 돈 것\"이라는 한 가지 사실을 다른 언어로 적은 것이다. 이 대응을 알면 덧셈정리를 외울 필요 없이 행렬 곱 한 번으로 다시 만들 수…"
prev_url: "/studies/linear-algebra/linear-transformations/"
prev_title: "선형변환"
next_url: "/studies/linear-algebra/change-of-basis/"
next_title: "기저 변환"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/rotation-bridge/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

삼각함수의 덧셈정리, 복소수의 곱셈, 회전 행렬의 곱은 서로 다른 과목에서 따로 배우지만, 모두 "30°만큼 돌고 이어서 40°만큼 돌면 70°만큼 돈 것"이라는 한 가지 사실을 다른 언어로 적은 것이다. 이 대응을 알면 덧셈정리를 외울 필요 없이 행렬 곱 한 번으로 다시 만들 수 있고, 2D 회전을 복소수 곱셈 한 번으로 구현할 수 있다. 다만 이 대응은 평면에서만 깔끔하다. 3차원 회전은 순서를 바꾸면 결과가 달라져 복소수로는 표현할 수 없다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에 세 사례의 공통 구조와 대응 관계를 먼저 적어 본다.

| 대학수학: 덧셈정리 | 대학수학: 복소수 | 선형대수학: 회전 행렬 |
|---|---|---|
| 각 $$\alpha$$인 단위원 위의 점 $$(\cos\alpha, \sin\alpha)$$ | $$e^{i\alpha} = \cos\alpha + i\sin\alpha$$ | $$R_\alpha = \begin{pmatrix}\cos\alpha & -\sin\alpha\\ \sin\alpha & \cos\alpha\end{pmatrix}$$ |
| $$\cos(\alpha + \beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta$$ | $$e^{i\alpha}e^{i\beta} = e^{i(\alpha + \beta)}$$ | $$R_\beta R_\alpha = R_{\alpha + \beta}$$ |
| $$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$$ | 곱하기 $$i$$ = 90° 돌리기 | $$R_{90°} = \begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$$ |
| $$\cos n\alpha + i\sin n\alpha$$ | $$(e^{i\alpha})^n = e^{in\alpha}$$ (드무아브르) | $$R_\alpha^n = R_{n\alpha}$$ |

<details class="callout callout-info" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 복소수 | $$2 \times 2$$ 행렬 | 공통 구조 |
|---|---|---|
| $$a + bi$$ | $$\begin{pmatrix}a & -b\\ b & a\end{pmatrix}$$ | "늘이기 × 돌리기" 하나 |
| 곱 $$zw$$ | 행렬 곱 | 변환의 합성 |
| $$\lvert z\rvert^2 = a^2 + b^2$$ | 행렬식 $$a^2 + b^2$$ | 넓이의 배율 |
| 켤레 $$\bar z$$ | 전치 | 거꾸로 돌리기(길이 1이면 역) |
| $$i$$, $$i^2 = -1$$ | $$R_{90°}$$, $$R_{90°}^2 = -I$$ | 90° 두 번 = 180° |
| $$e^{i\theta}$$ | $$R_\theta$$ | 각 $$\theta$$의 회전 |

덧셈정리는 $$R_\beta R_\alpha$$의 첫째 열을 곱해 보면 그대로 나온다: $$R_\beta\begin{pmatrix}\cos\alpha\\ \sin\alpha\end{pmatrix} = \begin{pmatrix}\cos\beta\cos\alpha - \sin\beta\sin\alpha\\ \sin\beta\cos\alpha + \cos\beta\sin\alpha\end{pmatrix}$$. 이것이 $$R_{\alpha + \beta}$$의 첫째 열 $$(\cos(\alpha + \beta), \sin(\alpha + \beta))$$와 같다[^1].

</details>


## 어디까지 같은가

- **복소수가 되는 행렬은 일부뿐이다.** $$\begin{pmatrix}a & -b\\ b & a\end{pmatrix}$$ 꼴(돌리기와 고르게 늘이기)만 복소수에 대응한다. 반사 $$\begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix}$$(행렬식 $$-1$$)이나 전단 $$\begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$은 어떤 복소수 곱셈으로도 쓸 수 없다.
- **평면에서는 순서가 상관없다.** 복소수 곱과 2D 회전은 교환법칙이 맞는다. 일반 행렬 곱은 그렇지 않다([교환되지 않는 곱](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)).
- **3차원에서 깨진다.** $$x$$축으로 90° 돌린 뒤 $$z$$축으로 90° 돌리는 것과, 순서를 바꾼 것은 결과가 다르다. 교환되는 복소수로는 3D 회전을 담을 수 없다. 3D 회전을 "곱셈 하나"로 다루려면 교환되지 않는 수 체계인 쿼터니언이 필요하다[^s1].

## 이 연결로 얻는 것

- **공식 되살리기.** 덧셈정리나 배각 공식이 헷갈리면 $$R_\beta R_\alpha$$나 $$(\cos\alpha + i\sin\alpha)^2$$을 직접 곱한다. $$\cos 2\alpha = \cos^2\alpha - \sin^2\alpha$$, $$\sin 2\alpha = 2\sin\alpha\cos\alpha$$가 실수부·허수부에서 바로 나온다([삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/)).
- **구현.** 2D 게임에서 방향을 복소수 `d`로 들고 있으면 각 `t`만큼 돌리기는 `d * cmath.exp(1j * t)` 한 줄이다. 행렬로는 곱셈 4번과 덧셈 2번이다.
- **거듭제곱과 단위근.** $$n$$번 돌려 제자리로 오는 회전 $$e^{2\pi i/n}$$의 거듭제곱이 1의 $$n$$제곱근이다. [이산 푸리에 변환](/Hongs_Blog/studies/linear-algebra/dft/)의 기저가 이 회전들이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 덧셈정리(무작위 각 1,000개), 복소수 ↔ 행렬 대응(곱, 행렬식 = $$\vert z\vert ^2$$, 켤레 = 전치), $$R_{90°}^2 = -I$$, 드무아브르와 $$R^n$$, 반사·전단이 $$\begin{pmatrix}a & -b\\ b & a\end{pmatrix}$$ 꼴이 아님, 3D 회전의 비교환, 전이 문제의 진폭 5와 위상 53.13° — [13_rotation-bridge_verify.py](/Hongs_Blog/studies/linear-algebra/code/13_rotation-bridge_verify/)</div>

</div>


## 전이 문제

같은 주파수의 두 소리 $$3\sin(\omega t)$$와 $$4\sin(\omega t + 90°)$$를 더하면 어떤 사인파가 되는가? ([사인파](/Hongs_Blog/studies/college-math/sinusoid/)의 진폭과 위상으로 답하라.)

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

진폭 $$A$$, 위상 $$\varphi$$인 사인파를 복소수 $$Ae^{i\varphi}$$(페이저)로 나타낸다. 주파수가 같으면 더하기는 페이저의 덧셈이다. $$3e^{i0} + 4e^{i90°} = 3 + 4i$$이고, 크기 5, 각 $$\arctan\frac43 \approx 53.13°$$다. 합은 $$5\sin(\omega t + 53.13°)$$다. 위상을 옮기는 것은 $$e^{i\varphi}$$를 곱하는 회전, 같은 주파수의 합은 평면 벡터의 합이다. 회로 이론의 교류 해석이 이 방법이다.

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 복소수 $$1 + 2i$$에 대응하는 행렬을 쓰고, $$(1 + 2i)(3 - i)$$를 행렬 곱으로 계산해 복소수 곱과 비교하라.</summary>

**답:** $$1 + 2i \mapsto \begin{pmatrix}1 & -2\\ 2 & 1\end{pmatrix}$$, $$3 - i \mapsto \begin{pmatrix}3 & 1\\ -1 & 3\end{pmatrix}$$. 곱은 $$\begin{pmatrix}5 & -5\\ 5 & 5\end{pmatrix}$$로 $$5 + 5i$$에 대응한다. 복소수로도 $$3 - i + 6i - 2i^2 = 5 + 5i$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$R_\beta R_\alpha$$의 성분을 계산해 $$\cos(\alpha + \beta)$$와 $$\sin(\alpha + \beta)$$의 덧셈정리를 끌어내라.</summary>

**답:** $$(1, 1)$$ 성분은 $$\cos\beta\cos\alpha - \sin\beta\sin\alpha$$, $$(2, 1)$$ 성분은 $$\sin\beta\cos\alpha + \cos\beta\sin\alpha$$다. $$R_\beta R_\alpha = R_{\alpha + \beta}$$의 첫째 열 $$(\cos(\alpha + \beta), \sin(\alpha + \beta))$$와 같다고 놓으면 두 공식이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 3차원 회전은 순서를 바꾸면 결과가 달라지는 예를 들라.</summary>

**답:** $$\mathbf{e}_1 = (1, 0, 0)$$을 $$z$$축으로 90° 돌리면 $$(0, 1, 0)$$, 이어서 $$x$$축으로 90° 돌리면 $$(0, 0, 1)$$. 순서를 바꾸면 $$x$$축 회전에서 $$\mathbf{e}_1$$은 그대로이고 $$z$$축 회전 뒤 $$(0, 1, 0)$$이다. 결과가 다르다.

</details>


## 출처

[^1]: Strang, *Introduction to Linear Algebra* 5판, 8.2절(회전 행렬, $$R_\theta R_\phi = R_{\theta + \phi}$$), 9.1절 "Complex Numbers"(극형식, 곱은 각을 더함). OpenStax, *Precalculus 2e*, 7.2절 "Sum and Difference Identities", 8.5절 "Polar Form of Complex Numbers"(드무아브르 정리).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 쿼터니언으로 3D 회전을 나타내는 방법은 그래픽스·로봇공학에서 널리 쓰인다(짐벌 잠금이 없고 보간이 쉽다). 3D 회전의 비교환성은 13_rotation-bridge_verify.py에서 확인했다.
{% endraw %}
