---
layout: "note"
title: "이산 푸리에 변환과 FFT"
display_title: "이산 푸리에 변환과 FFT (DFT and FFT)"
kind: "concept"
kind_label: "알고리즘"
num: "27"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Discrete Fourier Transform", "DFT", "이산 푸리에 변환", "Fast Fourier Transform", "FFT", "고속 푸리에 변환", "쿨리-튜키", "Cooley–Tukey", "푸리에 행렬", "Fourier matrix", "단위근", "roots of unity", "합성곱 정리", "convolution theorem", "회전 인자", "twiddle factor"]
description: "소리 한 조각을 \"어떤 높이의 음이 얼마나 섞였는가\"로 바꾸는 것이 이산 푸리에 변환이다. 선형대수로 보면 신호 벡터를 서로 수직인 회전 파동(단위근) 기저로 바꾸는 기저 변환이라, 되돌리기도 쉽다. 정의대로 하면 곱셈 횟수가 신호 길이의 제곱으로 늘지만, 짝수 번째와 홀수 번째로…"
prev_url: "/studies/linear-algebra/conditioning/"
prev_title: "노름과 조건수"
next_url: "/studies/linear-algebra/decompositions-compared/"
next_title: "LU·QR·고윳값·SVD 비교"
math: true
mermaid: false
code_count: 2
permalink: "/studies/linear-algebra/dft/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소리 한 조각을 "어떤 높이의 음이 얼마나 섞였는가"로 바꾸는 것이 이산 푸리에 변환이다. 선형대수로 보면 신호 벡터를 서로 수직인 회전 파동(단위근) 기저로 바꾸는 기저 변환이라, 되돌리기도 쉽다. 정의대로 하면 곱셈 횟수가 신호 길이의 제곱으로 늘지만, 짝수 번째와 홀수 번째로 나눠 되풀이하는 FFT는 길이에 로그를 곱한 정도로 줄인다. 이 속도 덕분에 오디오·이미지 처리, 다항식과 큰 정수의 곱셈이 실용적이 되었다. 다만 기본 FFT는 길이가 2의 거듭제곱일 때 가장 간단하고, 유한한 조각을 주기적으로 반복된다고 보기 때문에 경계에서 왜곡이 생길 수 있다.

</div>


## 예시로 보기

신호 $$\mathbf{x} = (1, 2, 3, 4)$$를 $$n = 4$$개의 기저 파동으로 나눈다. $$\omega = e^{2\pi i/4} = i$$이고, $$k$$번째 파동은 $$(1, \omega^k, \omega^{2k}, \omega^{3k})$$이다. 계수는 $$X_k = \sum_j x_j\omega^{-jk}$$다.

| $$k$$ | 파동 $$\omega^{jk}$$ ($$j = 0..3$$) | $$X_k$$ |
|---|---|---|
| 0 | $$1, 1, 1, 1$$ | $$1 + 2 + 3 + 4 = 10$$ |
| 1 | $$1, i, -1, -i$$ | $$1 - 2i - 3 + 4i = -2 + 2i$$ |
| 2 | $$1, -1, 1, -1$$ | $$1 - 2 + 3 - 4 = -2$$ |
| 3 | $$1, -i, -1, i$$ | $$1 + 2i - 3 - 4i = -2 - 2i$$ |

$$X_0 = 10$$은 평균(합) 성분, $$X_2 = -2$$는 가장 빠르게 뒤집히는 성분이다. 역변환 $$x_j = \frac14\sum_k X_k\omega^{jk}$$으로 $$(1, 2, 3, 4)$$가 정확히 돌아온다. 이 파동들이 아래 정의의 푸리에 행렬의 열이다.

## 정의

**입력:** 길이 $$n$$인 복소수 벡터 $$\mathbf{x}$$($$n = 2^m$$). **출력:** $$X_k = \sum_{j=0}^{n-1}x_j\omega^{-jk}$$($$k = 0, \dots, n - 1$$), $$\omega = e^{2\pi i/n}$$.

행렬로는 $$F_{jk} = \omega^{jk}$$인 **푸리에 행렬**로 $$\mathbf{X} = \bar{F}\mathbf{x}$$, $$\mathbf{x} = \frac1n F\mathbf{X}$$다. $$F$$의 열들은 서로 수직이고($$\bar{F}^\top F = nI$$) 각각 길이가 $$\sqrt n$$이다. 그래서 역변환이 역행렬 계산 없이 켤레와 $$\frac1n$$뿐이다[^1].

```
FFT(x)                              # n = 2^m, 인덱스 0부터
  if n = 1: return x
  E ← FFT(x[0], x[2], …, x[n−2])      # 짝수 번째
  O ← FFT(x[1], x[3], …, x[n−1])      # 홀수 번째
  for k = 0 to n/2 − 1
      t ← e^{−2πik/n} · O[k]           # 회전 인자
      X[k] ← E[k] + t
      X[k + n/2] ← E[k] − t
  return X
```

**정확성.** $$X_k = \sum_{\text{짝수 } j}x_j\omega^{-jk} + \sum_{\text{홀수 } j}x_j\omega^{-jk}$$. 짝수 $$j = 2l$$ 쪽은 $$\omega^{-2lk} = (\omega^2)^{-lk}$$이고 $$\omega^2$$은 길이 $$n/2$$의 단위근이라 $$E_k$$다. 홀수 쪽은 $$\omega^{-k}$$를 묶어 내면 $$\omega^{-k}O_k$$다. $$E$$, $$O$$는 주기 $$n/2$$이고 $$\omega^{-(k + n/2)} = -\omega^{-k}$$라 뒤쪽 절반은 부호만 바뀐다.

**복잡도.** $$T(n) = 2T(n/2) + O(n)$$이라 [마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/)의 경우 2로 $$O(n\log n)$$이다. 정의대로 하면 곱셈이 $$n^2$$번, FFT는 회전 인자 곱셈이 $$\frac n2\log_2 n$$번이라 $$n = 2^{20}$$(약 백만)에서 곱셈이 약 10만 배 적다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">합성곱 정리</div>

길이 $$n$$인 두 벡터의 순환 합성곱 $$(\mathbf{a} * \mathbf{b})_k = \sum_j a_jb_{(k - j) \bmod n}$$의 DFT는 DFT의 성분별 곱이다: $$\widehat{\mathbf{a} * \mathbf{b}} = \hat{\mathbf{a}} \odot \hat{\mathbf{b}}$$.

</div>


다항식 곱의 계수는 [합성곱](/Hongs_Blog/studies/discrete-math/generating-functions/)이므로, 0을 채워 길이를 늘린 뒤 FFT → 성분별 곱 → 역 FFT로 $$O(n\log n)$$에 곱한다.

## 예제

**다항식 곱셈.** $$(1 + 2x)(3 + 4x) = 3 + 10x + 8x^2$$을 FFT로 한다.

1. *길이 맞추기:* 결과 차수가 2라 길이 4로 0을 채운다. $$\mathbf{a} = (1, 2, 0, 0)$$, $$\mathbf{b} = (3, 4, 0, 0)$$.
2. *변환:* $$\hat{\mathbf{a}} = (3, 1 - 2i, -1, 1 + 2i)$$, $$\hat{\mathbf{b}} = (7, 3 - 4i, -1, 3 + 4i)$$.
3. *성분별 곱:* $$(21, -5 - 10i, 1, -5 + 10i)$$.
4. *역변환:* $$(3, 10, 8, 0)$$. 계수 $$3, 10, 8$$이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표와 역변환, 무작위 벡터에서 FFT = 정의대로 한 DFT, 역변환 왕복, $$\bar{F}^\top F = nI$$, 단위근의 합이 0, 합성곱 정리, 예제의 중간값과 무작위 다항식 곱(단순 곱과 일치), 곱셈 횟수 $$\frac n2\log_2 n$$ — [27_dft_impl.py](/Hongs_Blog/studies/linear-algebra/code/27_dft_impl/), [27_dft_verify.py](/Hongs_Blog/studies/linear-algebra/code/27_dft_verify/)</div>

</div>


## 활용

- **신호와 이미지.** 오디오 스펙트럼 분석, 잡음 제거(특정 주파수 성분 지우기), 이미지의 흐림·선명화 필터가 주파수 영역에서 성분별 곱이 된다. JPEG는 푸리에 변환의 친척인 이산 코사인 변환(DCT)을 쓴다[^s1].
- **큰 수와 다항식의 곱.** 수십만 자리 정수의 곱, 다항식 곱은 FFT로 $$O(n\log n)$$에 한다. 합성곱 신경망의 큰 필터도 FFT로 계산하기도 한다.
- **통신.** 여러 주파수에 데이터를 나눠 싣는 방식(OFDM)은 송신에 역 FFT, 수신에 FFT를 쓴다[^s1]. 주파수를 나눠 쓰는 생각은 [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)와 이어진다.

## 연결

- 선수: [정규직교 기저](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)(직교 기저의 좌표), [오일러 공식과 단위근](/Hongs_Blog/studies/college-math/euler-formula/)
- 기저 변환으로 보기: [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/)
- 알고리즘: [분할 정복](/Hongs_Blog/studies/discrete-math/master-theorem/), 합성곱: [생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/)
- 연속판: 미분적분학의 푸리에 급수와 [푸리에 변환](/Hongs_Blog/studies/calculus/fourier-transform/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\mathbf{x} = (1, 0, -1, 0)$$의 DFT를 구하라($$n = 4$$, $$\omega = i$$).</summary>

**답:** $$X_k = 1 - \omega^{-2k} = 1 - (-1)^k$$. $$X = (0, 2, 0, 2)$$. 신호가 $$\cos\frac{2\pi j}{4}$$라 $$k = 1$$과 $$k = 3$$(= $$-1$$) 성분만 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아래 코드의 반복문이 하는 일을 쉬운 말로 설명하라.</summary>

```python
for k in range(n // 2):
    t = cmath.exp(-2j * cmath.pi * k / n) * odd[k]
    out[k] = even[k] + t
    out[k + n // 2] = even[k] - t
```
**답:** 짝수 번째 원소들의 DFT(`even`)와 홀수 번째 원소들의 DFT(`odd`)를 합쳐 전체 DFT를 만든다. 홀수 쪽에는 위치에 따른 회전 인자 $$\omega^{-k}$$를 곱하고, 앞쪽 절반은 더해서, 뒤쪽 절반은 빼서 얻는다. 한 번에 두 개의 출력을 만들어 절반 크기의 문제 두 개로 전체를 푼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 푸리에 행렬의 서로 다른 두 열이 수직인 이유는?</summary>

**답:** $$j$$열과 $$l$$열의 (켤레) 내적은 $$\sum_{k=0}^{n-1}\omega^{k(l - j)}$$이다. $$l \ne j$$면 공비 $$r = \omega^{l - j} \ne 1$$인 등비급수라 $$\frac{r^n - 1}{r - 1}$$이고, $$r^n = 1$$이므로 0이다. 단위원 위에 고르게 놓인 점들의 합이 0이라는 뜻이다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 9.3절 "The Fast Fourier Transform"(푸리에 행렬, $$\bar{F}^\top F = nI$$, FFT의 분해). Cormen et al., *Introduction to Algorithms* 3판, 30장 "Polynomials and the FFT"(합성곱 정리와 다항식 곱셈, 재귀 FFT).
[^s1]: 에이전트 보충. JPEG의 DCT와 OFDM의 IFFT/FFT는 각각 JPEG(ITU-T T.81)과 Wi-Fi·LTE 표준의 내용이다. 속도 비교(백만 점에서 약 10만 배)는 $$n^2$$ 대 $$\frac n2\log_2 n$$ 곱셈 수로 센 값이고, 실제 실행 시간의 비는 덧셈·메모리 접근 때문에 이와 다르다.
{% endraw %}
