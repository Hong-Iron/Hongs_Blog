---
layout: "note"
title: "05_data-cleaning_verify.py"
display_title: "05_data-cleaning_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/data-cleaning/"
parent_title: "데이터 정제"
description: "데이터 과학 · 데이터 정제 검증 코드"
permalink: "/studies/data-science/code/05_data-cleaning_verify/"
---
{% raw %}
[데이터 정제](/Hongs_Blog/studies/data-science/data-cleaning/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""비닝 평활화와 결측값 채우기 검증.

문서: 05.데이터 정제 (예시, 정의, 카드 C2·C3)
출처: 데이터 과학 2회 슬라이드 p.33~35
주장:
  1. 정렬된 값 (4, 8, 15, 21, 21, 24, 25, 28, 34)을 3개씩 세 칸(같은 개수)으로 나누면
     칸 평균 -> (9,9,9,22,22,22,29,29,29), 칸 중앙값 -> (8,8,8,21,21,21,28,28,28),
     칸 경계 -> (4,4,15,21,21,24,25,25,34). (경계 방식: 더 가까운 경계로, 같으면 아래 경계)
  2. 결측값을 평균으로 채우면 평균은 그대로지만 분산은 줄어든다. 카드 C3.
  3. 카드 C2: (3, 7, 8, 12, 15, 20) 2칸, 칸 경계 방식 -> (3, 8, 8, 12, 12, 20).
"""
import statistics as st


def bins(xs, k):
    n = len(xs) // k
    return [xs[i * n:(i + 1) * n] for i in range(k)]


def by_mean(xs, k):
    return [round(st.mean(b)) for b in bins(xs, k) for _ in b]


def by_median(xs, k):
    return [st.median(b) for b in bins(xs, k) for _ in b]


def by_boundary(xs, k):
    out = []
    for b in bins(xs, k):
        lo, hi = b[0], b[-1]
        out += [lo if v - lo <= hi - v else hi for v in b]
    return out


def main():
    xs = [4, 8, 15, 21, 21, 24, 25, 28, 34]
    assert [st.mean(b) for b in bins(xs, 3)] == [9, 22, 29]
    assert by_mean(xs, 3) == [9, 9, 9, 22, 22, 22, 29, 29, 29]
    assert by_median(xs, 3) == [8, 8, 8, 21, 21, 21, 28, 28, 28]
    assert by_boundary(xs, 3) == [4, 4, 15, 21, 21, 24, 25, 25, 34]
    print("[OK] p.35: 칸 평균, 칸 중앙값, 칸 경계 세 결과가 슬라이드와 같다")

    assert by_boundary([3, 7, 8, 12, 15, 20], 2) == [3, 8, 8, 12, 12, 20]
    print("[OK] 카드 C2")

    known = [10, 20, 30, 40]
    m = st.mean(known)
    filled = known + [m, m]
    assert st.mean(filled) == m and st.pvariance(filled) < st.pvariance(known)
    print(f"[OK] 카드 C3: 평균으로 채우면 평균 {m} 그대로, 분산 {st.pvariance(known)} -> {st.pvariance(filled):.2f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
