---
layout: "note"
title: "20_jacobi-gauss-seidel_impl.py"
display_title: "20_jacobi-gauss-seidel_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "20"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/jacobi-gauss-seidel/"
parent_title: "야코비 방법과 가우스-자이델 방법"
description: "수치해석 · 야코비 방법과 가우스-자이델 방법 구현 코드"
permalink: "/studies/numerical-analysis/code/20_jacobi-gauss-seidel_impl/"
---
{% raw %}
[야코비 방법과 가우스-자이델 방법](/Hongs_Blog/studies/numerical-analysis/jacobi-gauss-seidel/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""야코비 방법과 가우스-자이델 방법 구현과 검증. 인덱스는 0-based."""
import random


def jacobi_step(A, b, x):
    n = len(b)
    return [(b[i] - sum(A[i][j] * x[j] for j in range(n) if j != i)) / A[i][i] for i in range(n)]


def gauss_seidel_step(A, b, x, lam=1.0):
    """lam은 이완 계수. 1이면 보통의 가우스-자이델."""
    n = len(b); x = list(x)
    for i in range(n):
        new = (b[i] - sum(A[i][j] * x[j] for j in range(n) if j != i)) / A[i][i]
        x[i] = lam * new + (1 - lam) * x[i]
    return x


def solve(step, A, b, x0, eps=1e-8, max_iter=10000, **kw):
    """상대 변화 |x_i^k − x_i^{k−1}| / |x_i^k| < eps가 모든 i에서 맞으면 멈춘다."""
    x = list(x0)
    for k in range(1, max_iter + 1):
        nx = step(A, b, x, **kw)
        if all(abs(nx[i] - x[i]) <= eps * abs(nx[i]) for i in range(len(x))):
            return nx, k
        x = nx
    return x, max_iter


def diag_dominant(A):
    return all(abs(A[i][i]) > sum(abs(A[i][j]) for j in range(len(A)) if j != i) for i in range(len(A)))


def main():
    A = [[4, -1, 1], [4, -8, 1], [-2, 1, 5]]; b = [7, -21, 15]
    assert diag_dominant(A)
    # 슬라이드 p.6 야코비 표
    xs = [[1.0, 2.0, 2.0]]
    for _ in range(19):
        xs.append(jacobi_step(A, b, xs[-1]))
    assert xs[1] == [1.75, 3.375, 3.0] and xs[2] == [1.84375, 3.875, 3.025] and xs[3] == [1.9625, 3.925, 2.9625]
    assert all(abs(v - s) < 6e-9 for v, s in zip(xs[4], [1.990625, 3.9765625, 3.0]))
    assert all(abs(v - s) < 6e-9 for v, s in zip(xs[5], [1.99414063, 3.9953125, 3.0009375]))
    assert all(abs(v - s) < 6e-9 for v, s in zip(xs[15], [1.99999993, 3.99999985, 2.99999993]))
    assert all(abs(v - s) < 6e-9 for v, s in zip(xs[19], [2.0, 4.0, 3.0]))
    # 슬라이드 p.10 가우스-자이델 표
    gs = [[1.0, 2.0, 2.0]]
    for _ in range(10):
        gs.append(gauss_seidel_step(A, b, gs[-1]))
    assert gs[1] == [1.75, 3.75, 2.95] and gs[2] == [1.95, 3.96875, 2.98625]
    assert all(abs(v - s) < 6e-9 for v, s in zip(gs[3], [1.995625, 3.99609375, 2.99903125]))
    assert all(abs(v - s) < 6e-9 for v, s in zip(gs[8], [1.99999983, 3.99999988, 2.99999996]))
    assert all(abs(v - s) < 6e-9 for v, s in zip(gs[10], [2.0, 4.0, 3.0]))
    # 같은 기준이면 가우스-자이델이 반복을 덜 한다
    _, kj = solve(jacobi_step, A, b, [1, 2, 2]); _, kg = solve(gauss_seidel_step, A, b, [1, 2, 2])
    assert kg < kj
    print("반복 횟수 (eps 1e-8): 야코비", kj, "가우스-자이델", kg)
    # 행 순서를 바꾸면 대각 우세가 깨지고 발산한다
    A2 = [A[1], A[0], A[2]]; b2 = [b[1], b[0], b[2]]
    assert not diag_dominant(A2)
    x = [1.0, 2.0, 2.0]
    for _ in range(30):
        x = jacobi_step(A2, b2, x)
    assert max(abs(v) for v in x) > 1e3
    # 대각 우세 무작위 행렬에서 둘 다 수렴
    random.seed(20)
    for _ in range(100):
        n = random.randint(2, 6)
        M = [[random.uniform(-3, 3) for _ in range(n)] for _ in range(n)]
        for i in range(n):
            M[i][i] = (sum(abs(M[i][j]) for j in range(n) if j != i) + random.uniform(0.5, 3)) * random.choice([-1, 1])
        xt = [random.uniform(-5, 5) for _ in range(n)]
        rhs = [sum(M[i][j] * xt[j] for j in range(n)) for i in range(n)]
        for step in (jacobi_step, gauss_seidel_step):
            x, k = solve(step, M, rhs, [0.0] * n, eps=1e-12)
            assert k < 10000 and all(abs(a - c) < 1e-6 for a, c in zip(x, xt))
    # 대각 우세는 충분조건일 뿐: 대각 우세가 아니어도 수렴하는 예
    assert not diag_dominant([[1, 1.2], [0.1, 1]])
    x, k = solve(gauss_seidel_step, [[1, 1.2], [0.1, 1]], [2.2, 1.1], [0.0, 0.0], eps=1e-12)
    assert k < 10000 and abs(x[0] - 1) < 1e-9 and abs(x[1] - 1) < 1e-9
    # 이완: 과이완(λ = 1.1)이 늘 빠르지는 않다, 저이완(λ = 0.5)은 느리다
    _, k_over = solve(gauss_seidel_step, A, b, [1, 2, 2], lam=1.1)
    assert k_over > kg
    _, k_under = solve(gauss_seidel_step, A, b, [1, 2, 2], lam=0.5)
    assert k_under > kg
    print("이완 λ=1.1:", k_over, "λ=0.5:", k_under)
    # 대칭 양의 정부호 행렬에서 SOR이 가우스-자이델보다 빠른 예
    n = 10
    T = [[2 if i == j else (-1 if abs(i - j) == 1 else 0) for j in range(n)] for i in range(n)]
    rhs = [1.0] * n
    _, k1 = solve(gauss_seidel_step, T, rhs, [0.0] * n, eps=1e-10)
    _, k2 = solve(gauss_seidel_step, T, rhs, [0.0] * n, eps=1e-10, lam=1.5)
    assert k2 < k1
    print("2차 차분 행렬 n=10: 가우스-자이델", k1, "SOR(1.5)", k2)
    # 카드 C2: 2x + y = 5, x + 3y = 10, 시작 (0, 0)
    assert jacobi_step([[2, 1], [1, 3]], [5, 10], [0, 0]) == [2.5, 10 / 3]
    assert gauss_seidel_step([[2, 1], [1, 3]], [5, 10], [0, 0]) == [2.5, 2.5]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
