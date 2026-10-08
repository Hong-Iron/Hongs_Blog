---
layout: "note"
title: "10_center-surround_verify.py"
display_title: "10_center-surround_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
parent_url: "/studies/human-interface-media/center-surround/"
parent_title: "중심-주변 길항"
description: "휴먼 인터페이스 미디어 · 중심-주변 길항 검증 코드"
permalink: "/studies/human-interface-media/code/10_center-surround_verify/"
---
{% raw %}
[중심-주변 길항](/Hongs_Blog/studies/human-interface-media/center-surround/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중심-주변 길항 검증.

문서: 10.중심-주변 길항 (예시로 보기, 정의, 카드 C2·C3)
모형 (설명용): 수용장의 중심은 반지름 1인 원, 주변은 반지름 1~2인 고리.
  반응 = max(0, s0 + g * (중심에 닿은 빛의 넓이 - k * 주변에 닿은 빛의 넓이))
  s0는 자발 발화, k > 0은 주변 억제의 세기.
주장:
  1. 반지름 rho인 둥근 빛을 가운데에 비추면, 반응은 rho = 1(중심을 딱 채울 때)에서 가장 크다.
     0 <= rho <= 1에서는 커지고, 1 <= rho <= 2에서는 작아진다. k가 무엇이든(k > 0) 그렇다.
  2. 중심 넓이와 주변 넓이의 억제 합이 같으면(k = 1/3), 수용장 전체를 고르게 비출 때 반응은 자발 발화 s0와 같다.
     빛의 경계가 수용장을 지나가면 반응은 s0보다 커지거나 작아진다. 균일한 빛보다 경계에 반응한다.
  3. 신호 관점: 1차원 수용장(중심 |x| <= 1은 +1, 주변 1 < |x| <= 2는 -1, 합이 0)에
     줄무늬 cos(2 pi u x)를 비추면 반응 크기는 R(u) = 2 sin(2 pi u) (1 - cos(2 pi u)) / (pi u)다.
     R(0) = 0(균일한 빛에 무반응), u 약 0.29에서 가장 크고, u >= 3에서는 최대의 20% 미만이다.
     너무 성기지도 촘촘하지도 않은 줄무늬에만 반응하는 대역 통과 필터다.
방법: 넓이는 정확한 공식(pi r^2)으로, 경계 자극은 격자 적분으로, 줄무늬는 수치 적분으로 계산해 공식과 비교한다.
"""
import math


def disk_response(rho: float, k: float, s0: float = 10.0, g: float = 10.0) -> float:
    center = math.pi * min(rho, 1.0) ** 2
    surround = math.pi * (min(rho, 2.0) ** 2 - 1.0) if rho > 1.0 else 0.0
    return max(0.0, s0 + g * (center - k * surround))


def field_response(lit, k: float, s0: float = 10.0, g: float = 10.0, n: int = 800) -> float:
    """lit(x, y) -> bool인 빛 모양에 대한 반응. 한 변 4인 정사각형을 n x n 격자로 적분."""
    h = 4.0 / n
    center = surround = 0.0
    for i in range(n):
        x = -2.0 + (i + 0.5) * h
        for j in range(n):
            y = -2.0 + (j + 0.5) * h
            r2 = x * x + y * y
            if r2 > 4.0 or not lit(x, y):
                continue
            if r2 <= 1.0:
                center += h * h
            else:
                surround += h * h
    return s0 + g * (center - k * surround)


def main() -> None:
    rhos = [i / 100 for i in range(0, 201)]
    for k in (0.2, 1 / 3, 0.5, 1.0):
        resp = [disk_response(r, k) for r in rhos]
        peak = max(range(len(rhos)), key=lambda i: resp[i])
        assert rhos[peak] == 1.0, (k, rhos[peak])
        assert all(a <= b for a, b in zip(resp[:101], resp[1:101]))
        assert all(a >= b for a, b in zip(resp[100:], resp[101:]))
        print(f"[OK] k={k:.3f}: 반응 최대는 rho=1 ({resp[peak]:.1f}), rho=0.5 {disk_response(0.5, k):.1f}, "
              f"rho=1.5 {disk_response(1.5, k):.1f}, rho=2 {disk_response(2.0, k):.1f}")

    k = 1 / 3
    s0 = 10.0
    uniform = field_response(lambda x, y: True, k)
    assert abs(uniform - s0) < 0.5, uniform
    print(f"[OK] k=1/3, 균일한 빛: 반응 {uniform:.2f} = 자발 발화 {s0} (격자 오차 안)")

    # 경계: x >= c 쪽만 밝다. 경계를 여러 위치에 둔다.
    for c, sign in ((-1.0, +1), (1.0, -1)):
        resp = field_response(lambda x, y, c=c: x >= c, k)
        assert (resp - s0) * sign > 5, (c, resp)
        print(f"[OK] 경계 x={c:+.0f}: 반응 {resp:.2f} ({'자발 발화보다 큼' if sign > 0 else '자발 발화보다 작음'})")

    # 주장 3: 1차원 대역 통과
    def r_formula(u):
        return 2 * math.sin(2 * math.pi * u) * (1 - math.cos(2 * math.pi * u)) / (math.pi * u)

    def r_numeric(u, n=20_000):
        h = 4.0 / n
        total = 0.0
        for i in range(n):
            x = -2.0 + (i + 0.5) * h
            w = 1.0 if abs(x) <= 1.0 else -1.0
            total += w * math.cos(2 * math.pi * u * x) * h
        return total

    for u in (0.1, 0.29, 0.5, 1.3, 3.2):
        assert abs(r_formula(u) - r_numeric(u)) < 1e-3, u
    us = [i / 1000 for i in range(1, 5001)]
    rs = [abs(r_formula(u)) for u in us]
    peak = max(range(len(us)), key=lambda i: rs[i])
    assert abs(r_formula(1e-6)) < 1e-4
    assert 0.2 < us[peak] < 0.4
    assert max(r for u, r in zip(us, rs) if u >= 3) < 0.2 * rs[peak]
    print(f"[OK] 1차원 줄무늬: R(0)=0, 최대 R={rs[peak]:.3f} (u={us[peak]:.3f}), u>=3에서 최대의 20% 미만")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
