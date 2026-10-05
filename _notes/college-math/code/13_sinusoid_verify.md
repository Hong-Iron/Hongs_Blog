---
layout: "note"
title: "13_sinusoid_verify.py"
display_title: "13_sinusoid_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/sinusoid/"
parent_title: "사인파"
description: "대학수학 · 사인파 검증 코드"
permalink: "/studies/college-math/code/13_sinusoid_verify/"
---
{% raw %}
[사인파](/Hongs_Blog/studies/college-math/sinusoid/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""사인파 검증.

문서: 13.사인파 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: A4 440 Hz의 주기는 1/440 s ≈ 2.27 ms.
주장 2: A sin(ωt + φ) + C는 함수 변환 a·f(b(x - h)) + k에서 a = A, b = ω, h = -φ/ω, k = C인 경우다.
주장 3: s(t) = 3 sin(100πt - π/2)는 진폭 3, 50 Hz, 주기 20 ms이고 t = 0에서 최저 -3이다.
주장 4: 8 kHz로 샘플링하면 7 kHz 사인파의 표본이 1 kHz 사인파의 표본에 -1을 곱한 것과 같다(에일리어싱).
주장 5: 같은 주파수의 사인파 두 개의 합은 같은 주파수의 사인파다 (3 sin ωt + 4 cos ωt = 5 sin(ωt + φ)).
"""
import math


def main():
    assert f"{1000 / 440:.2f}" == "2.27"
    print("[OK] 주장 1: 440 Hz 주기 2.27 ms")

    A, w, phi, C = 2.5, 3.0, 0.7, -1.0
    f = math.sin
    s = lambda t: A * math.sin(w * t + phi) + C
    g = lambda x: A * f(w * (x - (-phi / w))) + C
    assert all(math.isclose(s(t / 7), g(t / 7), abs_tol=1e-12) for t in range(-100, 100))
    print("[OK] 주장 2: 변환 계수 대응")

    s3 = lambda t: 3 * math.sin(100 * math.pi * t - math.pi / 2)
    assert math.isclose(s3(0), -3) and math.isclose(100 * math.pi / (2 * math.pi), 50)
    assert all(math.isclose(s3(t / 1000), s3(t / 1000 + 0.02), abs_tol=1e-9) for t in range(100))
    assert max(s3(k / 100000) for k in range(2000)) <= 3 + 1e-12
    print("[OK] 카드 C2: 진폭 3, 50 Hz, 주기 20 ms, s(0) = -3")

    fs = 8000
    for n in range(2000):
        a = math.sin(2 * math.pi * 7000 * n / fs)
        b = math.sin(2 * math.pi * 1000 * n / fs)
        assert math.isclose(a, -b, abs_tol=1e-9)
    print("[OK] 주장 4·카드 C3: 7 kHz @ 8 kHz 표본 = -(1 kHz 표본) (2,000개)")

    R, ph = math.hypot(3, 4), math.atan2(4, 3)
    assert R == 5
    for k in range(1000):
        t = k / 97
        assert math.isclose(3 * math.sin(2 * t) + 4 * math.cos(2 * t), 5 * math.sin(2 * t + ph), abs_tol=1e-12)
    print(f"[OK] 주장 5: 3 sin 2t + 4 cos 2t = 5 sin(2t + {ph:.4f})")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
