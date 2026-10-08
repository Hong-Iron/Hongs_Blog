---
layout: "note"
title: "45_burst-prediction_verify.py"
display_title: "45_burst-prediction_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "45"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/burst-prediction/"
parent_title: "실행 시간 예측"
description: "운영체제 · 실행 시간 예측 검증 코드"
permalink: "/studies/operating-systems/code/45_burst-prediction_verify/"
---
{% raw %}
[실행 시간 예측](/Hongs_Blog/studies/operating-systems/burst-prediction/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""실행 시간 예측: 단순 평균과 지수 평균 (Stallings 식 9.1~9.3)."""
from fractions import Fraction as F


def simple(T, S1=0):
    S, out = F(S1), []
    for n, t in enumerate(T, 1):
        S = F(t, n) + F(n - 1, n) * S       # S_{n+1} = T_n/n + (n-1)/n * S_n
        out.append(S)
    return out


def expo(T, alpha, S1):
    S, out = F(S1), [F(S1)]
    for t in T:
        S = alpha * t + (1 - alpha) * S     # S_{n+1} = a T_n + (1-a) S_n
        out.append(S)
    return out


if __name__ == "__main__":
    T = [6, 4, 6, 4, 13, 13, 13]
    e = expo(T, F(1, 2), 10)
    print([float(x) for x in e])
    assert e == [10, 8, 6, 6, 5, 9, 11, 12]
    # 단순 평균은 지금까지의 산술 평균과 같다
    s = simple(T)
    assert all(s[k] == F(sum(T[:k + 1]), k + 1) for k in range(len(T)))
    # 가중치: alpha = 0.8이면 T_n, T_{n-1}, T_{n-2}의 가중치 0.8, 0.16, 0.032
    a = F(4, 5)
    assert [a * (1 - a) ** i for i in range(3)] == [F(4, 5), F(4, 25), F(4, 125)]
    # 카드 C2: alpha 0.5, S1 = 10, T = 2, 2, 2 -> 6, 4, 3
    assert expo([2, 2, 2], F(1, 2), 10)[1:] == [6, 4, 3]
    print("ALL CHECKS PASSED")
```
{% endraw %}
