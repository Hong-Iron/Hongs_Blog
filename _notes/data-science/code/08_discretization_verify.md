---
layout: "note"
title: "08_discretization_verify.py"
display_title: "08_discretization_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/discretization/"
parent_title: "이산화"
description: "데이터 과학 · 이산화 검증 코드"
permalink: "/studies/data-science/code/08_discretization_verify/"
---
{% raw %}
[이산화](/Hongs_Blog/studies/data-science/discretization/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이산화(같은 폭 칸 나누기) 검증.

문서: 08.이산화 (예시, 카드 C2)
출처: 데이터 과학 2회 슬라이드 p.43 (같은 폭 칸 나누기), p.35의 값
주장:
  1. 값 (4, 8, 15, 21, 21, 24, 25, 28, 34)를 폭 10인 세 칸 [4,14), [14,24), [24,34]로 나누면
     칸에 든 값은 (4, 8), (15, 21, 21), (24, 25, 28, 34)로 개수가 2, 3, 4다.
     같은 개수(p.35)와 달리 칸마다 개수가 다르다.
  2. 칸 평균으로 바꾸면 (6, 6, 19, 19, 19, 27.75, ...).
"""
import statistics as st


def equal_width(xs, k):
    lo, hi = min(xs), max(xs); w = (hi - lo) / k
    idx = [min(int((x - lo) // w), k - 1) for x in xs]
    return [[x for x, i in zip(xs, idx) if i == j] for j in range(k)]


def main():
    xs = [4, 8, 15, 21, 21, 24, 25, 28, 34]
    b = equal_width(xs, 3)
    assert b == [[4, 8], [15, 21, 21], [24, 25, 28, 34]]
    means = [st.mean(c) for c in b]
    assert means == [6, 19, 27.75]
    print("[OK] 폭 10인 세 칸:", b, "칸 평균", means)

    # 카드 C2: 나이 (13, 15, 16, 19, 20, 21, 22, 25, 30, 33, 35, 36, 40, 45, 46, 52, 70) 폭 20, 13 시작
    ages = [13, 15, 16, 19, 20, 21, 22, 25, 30, 33, 35, 36, 40, 45, 46, 52, 70]
    lo = 13
    lab = [min((a - lo) // 20, 2) for a in ages]
    counts = [lab.count(i) for i in range(3)]
    assert counts == [9, 7, 1]
    print("[OK] 카드 C2: [13,33), [33,53), [53,73] 칸의 개수", counts)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
