---
layout: "note"
title: "003_statistical-deviation--normal-distribution_verify.py"
display_title: "003_statistical-deviation--normal-distribution_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "003"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "4-1학기"
parent_url: "/studies/abnormal-psychology/statistical-deviation--normal-distribution/"
parent_title: "통계적 일탈 기준 ↔ 정규분포"
description: "이상 심리학 · 통계적 일탈 기준 ↔ 정규분포 검증 코드"
permalink: "/studies/abnormal-psychology/code/003_statistical-deviation--normal-distribution_verify/"
---
{% raw %}
[통계적 일탈 기준 ↔ 정규분포](/Hongs_Blog/studies/abnormal-psychology/statistical-deviation--normal-distribution/) 문서의 검증 코드다.

```python
"""통계적 일탈 기준 ↔ 정규분포: 문서와 카드의 수치를 확인한다. 표준 라이브러리만 쓴다."""
import math
import random


def Phi(z):
    """표준정규분포의 누적분포함수."""
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def close(a, b, tol):
    return abs(a - b) <= tol


checks = 0


def check(cond, msg):
    global checks
    assert cond, msg
    checks += 1


# 1. 지능지수: 평균 100, 표준편차 15. 70 미만은 z = -2
mu, sigma = 100, 15
z70 = (70 - mu) / sigma
check(z70 == -2, "IQ 70의 z점수")
below70 = Phi(z70)
check(close(below70, 0.02275, 5e-5), f"IQ 70 미만 비율 {below70}")
print(f"IQ 70 미만: {below70:.4%}")

# 2. 절단점을 옮기면 '이상'의 비율이 바뀐다
table = {-1.5: 0.0668, -2.0: 0.0228, -2.5: 0.0062, -3.0: 0.00135}
for z, p in table.items():
    check(close(Phi(z), p, 5e-4 if p > 0.01 else 5e-5), f"Phi({z})")
    print(f"z = {z:+.1f} (IQ {mu + z * sigma:.1f}) 아래: {Phi(z):.2%}")

# 3. 양쪽 꼬리: 평균에서 2 표준편차 밖
both = 2 * Phi(-2)
check(close(both, 0.0455, 5e-4), "양쪽 2σ 밖")
print(f"양쪽 2σ 밖: {both:.2%}")

# 4. 145와 55는 모두 3 표준편차
check((145 - mu) / sigma == 3 and (55 - mu) / sigma == -3, "145와 55의 z점수")

# 5. 정규분포가 아니면: 지수분포(평균 = 표준편차)에서 평균 + 2σ 위의 비율 = e^-3
exp_tail = math.exp(-3)
normal_tail = 1 - Phi(2)
check(close(exp_tail, 0.0498, 5e-4) and close(normal_tail, 0.0228, 5e-4), "지수분포 꼬리")
print(f"평균 + 2σ 위: 정규 {normal_tail:.2%}, 지수 {exp_tail:.2%}")
random.seed(1)
n = 200_000
xs = [random.expovariate(1.0) for _ in range(n)]
sim = sum(x > 3.0 for x in xs) / n
check(close(sim, exp_tail, 0.003), f"지수분포 모의실험 {sim}")

# 6. 측정 오차: 참 점수 72(장애 아님)인 사람이 관측 점수 70 미만으로 나올 확률 (측정 표준오차 3 가정)
sem = 3
p_mis = Phi((70 - 72) / sem)
check(close(p_mis, 0.2525, 5e-4), f"오분류 확률 {p_mis}")
print(f"참 점수 72, 측정 표준오차 3: 70 미만으로 측정될 확률 {p_mis:.1%}")

# 7. 전이 문제: CPU 사용률 평균 40, 표준편차 8, 문턱 64(= 평균 + 3σ), 한 시간에 한 번 측정
thr = 40 + 3 * 8
check(thr == 64, "문턱")
p_alarm = 1 - Phi(3)
per_year = 24 * 365 * p_alarm
check(close(p_alarm, 0.00135, 5e-5), "3σ 위 비율")
check(close(per_year, 11.8, 0.1), f"1년 잘못된 경보 {per_year}")
print(f"3σ 위 비율 {p_alarm:.3%}, 1년(8760회) 잘못된 경보 약 {per_year:.1f}번")
# 꼬리가 두꺼운 경우: 지수분포 모양이면 평균 + 3σ 위 = e^-4
heavy = math.exp(-4) * 24 * 365
check(close(heavy, 160.4, 0.5), f"지수 모양일 때 경보 {heavy}")
print(f"지수분포 모양이면 1년 약 {heavy:.0f}번")

print(f"{checks} checks")
print("ALL CHECKS PASSED")
```
{% endraw %}
