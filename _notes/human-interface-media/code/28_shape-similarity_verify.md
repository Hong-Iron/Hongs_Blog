---
layout: "note"
title: "28_shape-similarity_verify.py"
display_title: "28_shape-similarity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/shape-similarity/"
parent_title: "모양의 비슷함 재기"
description: "휴먼 인터페이스 미디어 · 모양의 비슷함 재기 검증 코드"
permalink: "/studies/human-interface-media/code/28_shape-similarity_verify/"
---
{% raw %}
[모양의 비슷함 재기](/Hongs_Blog/studies/human-interface-media/shape-similarity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""모양의 비슷함 재기 검증.

문서: 28.모양의 비슷함 재기 (예시로 보기, 정의, 원본 오류 의심, 카드 C2·C3)
주장 (X = [1, 2, 3, 4]):
  1. 차이의 합은 데이터 개수에 따라 커진다. 같은 차이 1이 3개면 3, 4개면 4. 개수로 나누면 둘 다 1.
  2. 평균 차이는 모양이 달라도 0일 수 있다: X와 [4, 3, 2, 1]의 평균 차이 0. 평균 제곱 차이는 5.
  3. 평균 제곱 차이가 같아도 차이의 모양이 다를 수 있다:
     차이 (2, 0, 0, 0)과 (1, -1, 1, -1)은 둘 다 평균 제곱 차이 1.
  4. 모양은 같은데 높이나 크기만 다르면 평균 제곱 차이는 커지지만 상관계수는 1이다:
     X + 10 → 평균 제곱 차이 100, 상관계수 1. 2X → 평균 제곱 차이 7.5, 상관계수 1.
     뒤집은 [4, 3, 2, 1] → 상관계수 -1.
  5. 슬라이드의 NCC 두 식:
     평균을 빼지 않는 식 (1/n) Σ f g / (σ_f σ_g)는 X와 X + 10에서 1이 아니다(평균이 끼어든다).
     평균을 뺀 식은 1이다.
  6. 슬라이드의 "zero-normalized Corr" (1/n) Σ (x - x̄)(y - ȳ)는 표준편차로 나누지 않아 공분산이다.
     X와 2X에서 2.5(= 2 Var X), X와 10X에서 12.5. 크기에 따라 바뀌므로 모양만 재지 못한다.
"""
import math


def mean(v):
    return sum(v) / len(v)


def sd(v):
    m = mean(v)
    return math.sqrt(sum((a - m) ** 2 for a in v) / len(v))


def mse(x, y):
    return mean([(a - b) ** 2 for a, b in zip(x, y)])


def cov(x, y):
    mx, my = mean(x), mean(y)
    return mean([(a - mx) * (b - my) for a, b in zip(x, y)])


def corr(x, y):
    return cov(x, y) / (sd(x) * sd(y))


def ncc_raw(x, y):
    return mean([a * b for a, b in zip(x, y)]) / (sd(x) * sd(y))


def main() -> None:
    X = [1, 2, 3, 4]
    # 1
    assert sum([1, 1, 1]) == 3 and sum([1, 1, 1, 1]) == 4
    assert mean([1, 1, 1]) == mean([1, 1, 1, 1]) == 1
    # 2
    R = [4, 3, 2, 1]
    assert mean([a - b for a, b in zip(X, R)]) == 0
    assert mse(X, R) == 5
    # 3
    d1, d2 = [2, 0, 0, 0], [1, -1, 1, -1]
    assert mean([d * d for d in d1]) == mean([d * d for d in d2]) == 1
    # 4
    S, D = [a + 10 for a in X], [2 * a for a in X]
    assert mse(X, S) == 100 and abs(corr(X, S) - 1) < 1e-12
    assert mse(X, D) == 7.5 and abs(corr(X, D) - 1) < 1e-12
    assert abs(corr(X, R) + 1) < 1e-12
    # 5
    assert abs(ncc_raw(X, S) - 1) > 0.5
    assert abs(corr(X, S) - 1) < 1e-12
    # 6
    assert abs(cov(X, D) - 2.5) < 1e-12 and abs(cov(X, [10 * a for a in X]) - 12.5) < 1e-12
    assert abs(sd(X) ** 2 - 1.25) < 1e-12
    Y = [3, 5, 7, 9]                                                   # 카드 C2
    assert mse(X, Y) == 13.5 and abs(corr(X, Y) - 1) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
