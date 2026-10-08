---
layout: "note"
title: "05_rate-coding_verify.py"
display_title: "05_rate-coding_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
parent_url: "/studies/human-interface-media/rate-coding/"
parent_title: "발화율 부호화"
description: "휴먼 인터페이스 미디어 · 발화율 부호화 검증 코드"
permalink: "/studies/human-interface-media/code/05_rate-coding_verify/"
---
{% raw %}
[발화율 부호화](/Hongs_Blog/studies/human-interface-media/rate-coding/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""발화율 부호화 검증.

문서: 05.발화율 부호화 (예시로 보기, 정의, 카드 C2·C3)
주장:
  1. 불응기가 t_ref이면 스파이크 사이 간격은 t_ref 이상이므로 발화율은 1/t_ref 이하다.
     t_ref = 1 ms이면 1,000회/초 이하다.
  2. 슬라이드의 최대 발화율 500~800회/초는 이 상한 안에 있다. 스파이크 간격으로는 2 ms, 1.25 ms다.
  3. 불응기가 있는 적분-발화 모형에서 발화율은 r(I) = 1 / (t_ref + theta/I)다.
     세기 I가 커질수록 r이 커지지만 1/t_ref를 넘지 못하고 포화한다.
방법: (1) 산술 확인 (2) 0.001 ms 단위로 모형을 직접 시뮬레이션해 공식과 비교한다.
단위: 시간은 ms, 발화율은 회/초.
"""
from fractions import Fraction as F


def rate_formula(t_ref_ms: F, theta: F, current: F) -> F:
    """불응기 t_ref, 문턱 theta, 입력 세기 current(단위/ms)일 때의 발화율(회/초)."""
    interval_ms = t_ref_ms + theta / current
    return 1000 / interval_ms


def simulate_rate(t_ref_ms: F, theta: F, current: F, total_ms: int = 200) -> F:
    """막전위를 0에서 쌓아 theta에 닿으면 발화, 0으로 되돌리고 t_ref 동안 멈춘다."""
    dt = F(1, 1000)  # 0.001 ms
    v = F(0)
    t = F(0)
    refractory_until = F(-1)
    spikes = []
    end = F(total_ms)
    while t < end:
        if t >= refractory_until:
            v += current * dt
            if v >= theta:
                spikes.append(t)
                v = F(0)
                refractory_until = t + t_ref_ms
        t += dt
    intervals = [b - a for a, b in zip(spikes, spikes[1:])]
    mean_interval = sum(intervals) / len(intervals)
    return 1000 / mean_interval


def main() -> None:
    t_ref = F(1)  # 1 ms
    upper = 1000 / t_ref
    assert upper == 1000
    print(f"[OK] 불응기 1 ms -> 발화율 상한 {upper}회/초")

    for r in (500, 800):
        interval = F(1000, r)
        assert interval >= t_ref and r <= upper
        print(f"[OK] {r}회/초 -> 간격 {float(interval)} ms (>= 1 ms)")

    # 모형: 문턱 1, 세기를 바꿔 가며 시뮬레이션과 공식 비교
    theta = F(1)
    rates = []
    for current in (F(1, 4), F(1, 2), F(1), F(2), F(4)):
        sim = simulate_rate(t_ref, theta, current)
        formula = rate_formula(t_ref, theta, current)
        # 시뮬레이션은 0.001 ms 격자에 맞춰지므로 1% 안에서 일치하면 된다
        assert abs(sim - formula) / formula < F(1, 100), (current, sim, formula)
        assert formula < upper
        rates.append(formula)
        print(f"[OK] 세기 {float(current):>5}: 공식 {float(formula):7.2f}회/초, 시뮬레이션 {float(sim):7.2f}회/초")
    assert all(a < b for a, b in zip(rates, rates[1:])), "세기가 커지면 발화율도 커져야 한다"
    print("[OK] 세기가 커질수록 발화율 증가, 모두 1,000회/초 미만")

    # 포화: 세기를 아무리 키워도 상한에 다가갈 뿐
    for current in (F(10), F(100), F(1000)):
        r = rate_formula(t_ref, theta, current)
        assert r < upper
    near = rate_formula(t_ref, theta, F(1000))
    assert upper - near < 1
    print(f"[OK] 세기 1000 -> {float(near):.2f}회/초 (상한 1,000에 붙음)")

    # 카드 C3: 문턱까지 쌓는 시간 theta/I = 1 ms이면 간격 2 ms -> 500회/초
    assert rate_formula(t_ref, theta, F(1)) == 500
    print("[OK] 카드 C3: theta/I = 1 ms -> 500회/초")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
