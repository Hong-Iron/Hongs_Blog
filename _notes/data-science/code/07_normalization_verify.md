---
layout: "note"
title: "07_normalization_verify.py"
display_title: "07_normalization_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/normalization/"
parent_title: "정규화"
description: "데이터 과학 · 정규화 검증 코드"
permalink: "/studies/data-science/code/07_normalization_verify/"
---
{% raw %}
[정규화](/Hongs_Blog/studies/data-science/normalization/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""정규화 검증.

문서: 07.정규화 (예시, 정의, 오해, 카드 C2·C3)
출처: 데이터 과학 2회 슬라이드 p.41~42
주장:
  1. 최소-최대: x' = (x - min) / (max - min) 는 [0, 1]로 옮긴다. 소득 73,600 (범위 12,000~98,000) -> 0.716.
  2. z-점수: v' = (v - 평균) / 표준편차. 평균 54,000, 표준편차 16,000이면 73,600 -> 1.225.
  3. z-점수 뒤 평균 0, 표준편차 1. 하지만 분포 모양은 그대로다 (치우친 자료는 정규화 뒤에도 치우침).
  4. 이상치 하나가 최소-최대 결과를 한쪽으로 몰아넣는다.
  5. 카드 C3: 정규화 전후로 가장 가까운 이웃이 바뀐다.
"""
import statistics as st


def minmax(xs):
    lo, hi = min(xs), max(xs)
    return [(x - lo) / (hi - lo) for x in xs]


def zscore(xs):
    m = st.mean(xs); s = st.pstdev(xs)
    return [(x - m) / s for x in xs]


def skewness(xs):
    m = st.mean(xs); s = st.pstdev(xs)
    return sum(((x - m) / s) ** 3 for x in xs) / len(xs)


def main():
    assert round((73600 - 12000) / (98000 - 12000), 3) == 0.716
    assert (73600 - 54000) / 16000 == 1.225
    print("[OK] 소득 예: 최소-최대 0.716, z-점수 1.225")

    xs = [1, 2, 2, 3, 3, 3, 4, 10, 20, 40]
    z = zscore(xs)
    assert abs(st.mean(z)) < 1e-12 and abs(st.pstdev(z) - 1) < 1e-12
    assert abs(skewness(z) - skewness(xs)) < 1e-12 and skewness(z) > 1
    print(f"[OK] z-점수 뒤 평균 0, 표준편차 1, 왜도 {skewness(z):.2f} 그대로 (정규분포가 되지 않는다)")

    assert minmax([20, 30, 50, 100]) == [0, 0.125, 0.375, 1]
    assert round(minmax([20, 30, 50, 100, 1000])[2], 3) == 0.031
    print("[OK] 카드 C1: 0, 0.125, 0.375, 1 / 1000이 들어오면 50 -> 0.031")

    base = [10, 12, 14, 16, 18]
    with_out = base + [1000]
    mm = minmax(with_out)
    assert max(mm[:5]) < 0.01
    print(f"[OK] 이상치 1000이 있으면 나머지 다섯 값이 0 ~ {max(mm[:5]):.4f}에 몰린다")

    # 카드 C3: (나이, 연봉 만원). 나이 범위 20~60, 연봉 범위 2,000~10,000으로 최소-최대
    A, B, C = (25, 3000), (26, 5000), (60, 3100)
    def d(a, b): return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5
    assert d(A, C) < d(A, B)                         # 그대로면 연봉 차이가 거리를 정한다
    def mm(p): return ((p[0] - 20) / 40, (p[1] - 2000) / 8000)
    assert (mm(A), mm(B), mm(C)) == ((0.125, 0.125), (0.15, 0.375), (1.0, 0.1375))
    assert round(d(mm(A), mm(B)), 3) == 0.251 and round(d(mm(A), mm(C)), 3) == 0.875
    print("[OK] 카드 C3: 정규화 전에는 (60, 3100)이, 최소-최대 뒤에는 (26, 5000)이 (25, 3000)에 가깝다 (0.251 < 0.875)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
