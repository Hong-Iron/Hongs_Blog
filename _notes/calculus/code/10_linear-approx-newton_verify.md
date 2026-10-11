---
layout: "note"
title: "10_linear-approx-newton_verify.py"
display_title: "10_linear-approx-newton_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/linear-approx-newton/"
parent_title: "선형 근사와 뉴턴 방법"
description: "미분적분학 · 선형 근사와 뉴턴 방법 검증 코드"
permalink: "/studies/calculus/code/10_linear-approx-newton_verify/"
---
{% raw %}
[선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 근사와 뉴턴 방법 검증.

문서: 10.선형 근사와 뉴턴 방법 (예시, 정의, 예제, 활용, 카드 C1~C3)
구현은 10_linear-approx-newton_impl.py에 있다. 여기서는 필요한 부분을 복사해 문서의 수치를 확인한다.
주장 1: √4.1 ≈ 2 + 0.1/4 = 2.025, 참값 2.02485, 오차 약 1.5e-4.
주장 2: √2의 뉴턴 반복 1 -> 1.5 -> 1.41667 -> 1.4142157 -> 1.41421356237469, 오차 약 0.086, 0.0025, 2.1e-6, 1.6e-12.
주장 3: 같은 정밀도(1e-12)까지 이분법은 약 40번, 뉴턴은 5번.
주장 4: x³ - 2x + 2를 0에서 시작하면 0, 1, 0, 1, …로 순환한다.
주장 5: 선형 근사 ln(1 + r) ≈ r, (1 + x)^n ≈ 1 + nx, sin x ≈ x (작은 값에서 상대오차).
"""
import math


def newton(f, df, x0, tol=1e-12, max_iter=50):
    xs = [x0]; x = x0
    for _ in range(max_iter):
        x_new = x - f(x) / df(x)
        xs.append(x_new)
        if abs(x_new - x) <= tol:
            return x_new, xs
        x = x_new
    return x, xs


def main():
    approx = 2 + 0.1 / 4
    true = math.sqrt(4.1)
    assert approx == 2.025 and f"{true:.5f}" == "2.02485" and f"{approx - true:.1e}" == "1.5e-04"
    print("[OK] 주장 1")

    _, xs = newton(lambda x: x * x - 2, lambda x: 2 * x, 1.0)
    errs = [abs(x - math.sqrt(2)) for x in xs[1:5]]
    assert [f"{e:.1e}" for e in errs] == ["8.6e-02", "2.5e-03", "2.1e-06", "1.6e-12"]
    assert f"{xs[2]:.5f}" == "1.41667" and f"{xs[3]:.7f}" == "1.4142157"
    print("[OK] 주장 2·카드 C1: " + ", ".join(f"{e:.1e}" for e in errs))

    a, b, steps = 1.0, 2.0, 0
    while b - a > 1e-12:
        m = (a + b) / 2
        if (m * m - 2) > 0:
            b = m
        else:
            a = m
        steps += 1
    _, xs2 = newton(lambda x: x * x - 2, lambda x: 2 * x, 1.0, tol=1e-12)
    assert steps == 40 and len(xs2) - 1 <= 6
    print(f"[OK] 주장 3: 이분법 {steps}번, 뉴턴 {len(xs2) - 1}번(마지막 확인 포함)")

    _, cyc = newton(lambda x: x ** 3 - 2 * x + 2, lambda x: 3 * x * x - 2, 0.0, max_iter=8)
    assert cyc[:6] == [0.0, 1.0, 0.0, 1.0, 0.0, 1.0]
    print("[OK] 주장 4·카드 C3: 순환")

    for r in (0.01, 0.05):
        assert abs(math.log(1 + r) - r) / r < r
    assert abs((1.001) ** 50 - (1 + 50 * 0.001)) < 0.002 and abs(math.sin(0.01) - 0.01) < 2e-7
    print("[OK] 주장 5")
    # 수치해석(2-2) 과목별 관점: e^{−x} − x 예, 상대 오차, 카드 C4
    fe = lambda x: math.exp(-x) - x; dfe = lambda x: -math.exp(-x) - 1
    xs_ = [0.0]
    for _ in range(4):
        xs_.append(xs_[-1] - fe(xs_[-1]) / dfe(xs_[-1]))
    assert [round(v, 9) for v in xs_] == [0.0, 0.5, 0.566311003, 0.567143165, 0.56714329]
    rt = 0.56714329040978387
    et_ = [abs(rt - v) / rt * 100 for v in xs_]
    assert round(et_[1], 1) == 11.8 and round(et_[2], 3) == 0.147 and abs(et_[3] - 0.000022) < 1e-6 and et_[4] < 1e-6
    x1_ = 1 - fe(1) / dfe(1); assert abs(x1_ - 0.537883) < 1e-6
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
