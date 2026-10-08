---
layout: "note"
title: "32_root-finding-compared_verify.py"
display_title: "32_root-finding-compared_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/root-finding-compared/"
parent_title: "근 찾기 방법 비교"
description: "수치해석 · 근 찾기 방법 비교 검증 코드"
permalink: "/studies/numerical-analysis/code/32_root-finding-compared_verify/"
---
{% raw %}
[근 찾기 방법 비교](/Hongs_Blog/studies/numerical-analysis/root-finding-compared/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""근 찾기 방법 비교 문서의 주장 검증: 같은 문제에서 반복 횟수, 실패하는 경우."""
import math

f = lambda x: math.exp(-x) - x
df = lambda x: -math.exp(-x) - 1
ROOT = 0.56714329040978387


def count(step, state, tol=1e-10, limit=1000):
    for k in range(1, limit + 1):
        state = step(state)
        if abs(state[0] - ROOT) < tol:
            return k
    return None


def main():
    bis = lambda s: (lambda m: ((m, s[1], m) if f(s[1]) * f(m) < 0 else (m, m, s[2])))((s[1] + s[2]) / 2)
    n_bis = count(bis, (0.5, 0.0, 1.0))
    n_new = count(lambda s: (s[0] - f(s[0]) / df(s[0]),), (0.0,))
    n_sec = count(lambda s: (s[0] - f(s[0]) * (s[0] - s[1]) / (f(s[0]) - f(s[1])), s[0]), (1.0, 0.0))
    n_fix = count(lambda s: (math.exp(-s[0]),), (0.0,))
    print("반복 횟수 (오차 1e-10): 이분법", n_bis, "뉴턴", n_new, "할선", n_sec, "고정점", n_fix)
    assert n_new < n_sec < n_bis < n_fix
    assert (n_bis, n_new, n_sec, n_fix) == (33, 4, 5, 40)
    # 뉴턴 실패: f'(x) = 0에서 나눌 수 없다 (x² − 1, x0 = 0)
    try:
        0.0 - (0.0 ** 2 - 1) / (2 * 0.0); raise RuntimeError
    except ZeroDivisionError:
        pass
    # 뉴턴 실패: 맴돌기 (x³ − 2x + 2, x0 = 0 → 1 → 0 → ...)
    g = lambda x: x ** 3 - 2 * x + 2; dg = lambda x: 3 * x * x - 2
    x = 0.0; seq = [x]
    for _ in range(4):
        x = x - g(x) / dg(x); seq.append(x)
    assert seq == [0.0, 1.0, 0.0, 1.0, 0.0]
    # 이분법은 같은 문제에서 근을 찾는다
    a, b = -3.0, 0.0
    for _ in range(60):
        m = (a + b) / 2
        a, b = (a, m) if g(a) * g(m) < 0 else (m, b)
    assert abs(g((a + b) / 2)) < 1e-9
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
