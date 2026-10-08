---
layout: "note"
title: "03_categorical-dissimilarity_verify.py"
display_title: "03_categorical-dissimilarity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/categorical-dissimilarity/"
parent_title: "범주형 속성의 비유사도"
description: "데이터 과학 · 범주형 속성의 비유사도 검증 코드"
permalink: "/studies/data-science/code/03_categorical-dissimilarity_verify/"
---
{% raw %}
[범주형 속성의 비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""명목·이진 속성의 비유사도 검증.

문서: 03.범주형 속성의 비유사도 (예시, 정의, 카드 C2·C3)
출처: 데이터 과학 2회 슬라이드 p.23 (명목), p.24 (이진, 자카드 계수)
주장:
  1. 명목: d = (p - m) / p. 슬라이드 객체 2, 3은 7개 중 5개 일치 -> d = 2/7, sim = 5/7.
  2. 대칭 이진: d = (r + s) / (q + r + s + t). 비대칭 이진: d = (r + s) / (q + r + s), sim = q / (q + r + s) (자카드).
  3. 0-0 일치(t)가 많을수록 대칭 비유사도는 0으로 가지만 비대칭은 영향을 받지 않는다.
  4. Han·Kamber·Pei 3판 2.4.3절 환자 예: d(Jack, Mary) = 0.33, d(Jack, Jim) = 0.67, d(Jim, Mary) = 0.75.
"""
from fractions import Fraction as F


def nominal(a, b):
    p = len(a); m = sum(x == y for x, y in zip(a, b))
    return F(p - m, p)


def counts(a, b):
    q = sum(x == 1 and y == 1 for x, y in zip(a, b))
    r = sum(x == 1 and y == 0 for x, y in zip(a, b))
    s = sum(x == 0 and y == 1 for x, y in zip(a, b))
    t = sum(x == 0 and y == 0 for x, y in zip(a, b))
    return q, r, s, t


def sym(a, b):
    q, r, s, t = counts(a, b); return F(r + s, q + r + s + t)


def asym(a, b):
    q, r, s, t = counts(a, b); return F(r + s, q + r + s)


def main():
    o2 = ["Black", "Student", "A", "B", "C", "D", "E"]
    o3 = ["Black", "Student", "A", "V", "C", "D", "F"]
    assert nominal(o3, o2) == F(2, 7) and 1 - nominal(o3, o2) == F(5, 7)
    print("[OK] p.23: d(3,2) = 2/7, sim = 5/7")

    # Y/P -> 1, N -> 0 (fever, cough, test-1..4)
    jack = [1, 0, 1, 0, 0, 0]; mary = [1, 0, 1, 0, 1, 0]; jim = [1, 1, 0, 0, 0, 0]
    assert round(float(asym(jack, mary)), 2) == 0.33
    assert round(float(asym(jack, jim)), 2) == 0.67
    assert round(float(asym(jim, mary)), 2) == 0.75
    print("[OK] 환자 예(비대칭): 0.33, 0.67, 0.75 -> Jack과 Mary가 가장 비슷하다")

    a = [1, 0, 1]; b = [1, 1, 0]
    for extra in (0, 10, 100):
        aa = a + [0] * extra; bb = b + [0] * extra
        assert asym(aa, bb) == F(2, 3)
    assert sym(a, b) == F(2, 3) and sym(a + [0] * 100, b + [0] * 100) == F(2, 103)
    print("[OK] 0-0 일치 100개를 더하면 대칭 d는 2/3 -> 2/103, 비대칭 d는 2/3 그대로")

    # 카드 C2: 상품 구매 기록 6개 중 둘 다 산 것 1, 한쪽만 산 것 2, 둘 다 안 산 것 3
    u = [1, 1, 0, 0, 0, 0]; v = [1, 0, 1, 0, 0, 0]
    assert counts(u, v) == (1, 1, 1, 3)
    assert sym(u, v) == F(1, 3) and asym(u, v) == F(2, 3) and 1 - asym(u, v) == F(1, 3)
    print("[OK] 카드 C2: 대칭 d = 1/3, 비대칭 d = 2/3, 자카드 = 1/3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
