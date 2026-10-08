---
layout: "note"
title: "20_ensemble-learning_verify.py"
display_title: "20_ensemble-learning_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/ensemble-learning/"
parent_title: "앙상블 학습"
description: "데이터 과학 · 앙상블 학습 검증 코드"
permalink: "/studies/data-science/code/20_ensemble-learning_verify/"
---
{% raw %}
[앙상블 학습](/Hongs_Blog/studies/data-science/ensemble-learning/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""앙상블의 분산 감소 검증.

문서: 20.앙상블 학습 (예시, 정의, 증명, 카드)
출처: 데이터 과학 6회 슬라이드 6-2 p.10, p.13~14
주장:
  1. 분산이 σ²이고 서로 상관계수가 ρ인 모델 k개의 평균의 분산은 σ²/k + (k-1)/k · ρσ². (몬테카를로로 확인)
  2. ρ = 0이면 σ²/k, ρ = 1이면 σ²로 줄지 않는다. k → ∞이면 ρσ²로 다가간다.
  3. MSE = 편향² + 분산 + 잡음 (몬테카를로로 확인).
  4. 카드 C3: σ² = 4, ρ = 0.25, k = 10 -> 0.4 + 0.9 × 1 = 1.3. k → ∞이면 1.
"""
import random


def ens_var(s2, rho, k):
    return s2 / k + (k - 1) / k * rho * s2


def simulate(s2, rho, k, trials, rnd):
    vals = []
    for _ in range(trials):
        common = rnd.gauss(0, (rho * s2) ** 0.5)          # 모든 모델이 공유하는 부분
        own = [rnd.gauss(0, ((1 - rho) * s2) ** 0.5) for _ in range(k)]
        vals.append(sum(common + e for e in own) / k)
    m = sum(vals) / trials
    return sum((v - m) ** 2 for v in vals) / trials


def main():
    rnd = random.Random(0)
    for s2, rho, k in ((1, 0, 10), (1, 0.5, 10), (4, 0.25, 10), (1, 0.9, 5)):
        th = ens_var(s2, rho, k); sim = simulate(s2, rho, k, 40000, rnd)
        assert abs(sim - th) / th < 0.05, (s2, rho, k, sim, th)
        print(f"[OK] σ²={s2}, ρ={rho}, k={k}: 이론 {th:.3f}, 모의 {sim:.3f}")
    assert ens_var(1, 0, 10) == 0.1 and ens_var(1, 1, 10) == 1
    assert abs(ens_var(1, 0.3, 10 ** 6) - 0.3) < 1e-5
    assert abs(ens_var(4, 0.25, 10) - 1.3) < 1e-12
    print("[OK] ρ=0 -> σ²/k, ρ=1 -> σ², k->∞ -> ρσ². 카드 C3: 1.3")

    # MSE 분해: y = f(x) + e, f(x) = 2, e ~ N(0, 0.5^2), 예측 f^ = 2.3 + N(0, 0.4^2) (훈련 자료에 따라 흔들림)
    n = 200000; mse = 0.0
    for _ in range(n):
        y = 2 + rnd.gauss(0, 0.5); fh = 2.3 + rnd.gauss(0, 0.4)
        mse += (y - fh) ** 2
    mse /= n
    assert abs(mse - (0.3 ** 2 + 0.4 ** 2 + 0.5 ** 2)) < 0.01
    print(f"[OK] MSE 모의 {mse:.3f} ≈ 편향² 0.09 + 분산 0.16 + 잡음 0.25 = 0.50")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
