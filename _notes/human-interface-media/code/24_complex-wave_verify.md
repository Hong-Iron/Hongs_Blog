---
layout: "note"
title: "24_complex-wave_verify.py"
display_title: "24_complex-wave_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/complex-wave/"
parent_title: "파동의 복소수 표현"
description: "휴먼 인터페이스 미디어 · 파동의 복소수 표현 검증 코드"
permalink: "/studies/human-interface-media/code/24_complex-wave_verify/"
---
{% raw %}
[파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""파동의 복소수 표현 검증.

문서: 24.파동의 복소수 표현 (예시로 보기, 정의, 카드 C2·C3)
주장:
  1. f(t) = A sin(2πt/T + φ)는 주기가 T다. 2πt만 쓰면 t = 1에서 한 바퀴가 끝난다.
  2. 오일러 공식 e^{iθ} = cos θ + i sin θ (θ 여러 값에서 수치로 확인).
  3. x(t) = A e^{i(2πt/T + φ)}의 허수부가 A sin(2πt/T + φ), 실수부가 A cos(2πt/T + φ)다.
  4. |x(t)| = A로 늘 일정하다. 실수 사인은 0과 A 사이를 오간다.
  5. A = e^α로 두면 A e^{i(2πt/T+φ)} = e^{α+iφ} e^{i 2πt/T}. 예: A = 2, φ = π/3이면 α = ln 2.
  6. 한 주기 평균 전력: 실수 사인은 A²/2, 복소 표현은 A².
  7. 같은 진폭이라도 회전 방향(φ의 증가 방향)이 다른 두 파동 e^{+i2πt}, e^{-i2πt}는 실수부(cos)가 같아
     실수 한 줄로는 구별되지 않지만 복소수로는 구별된다.
"""
import cmath
import math


def x(t, A, T, phi):
    return A * cmath.exp(1j * (2 * math.pi * t / T + phi))


def main() -> None:
    A, T, phi = 2.0, 0.5, math.pi / 3
    # 1. 주기
    for t in [0.0, 0.13, 0.27, 0.41]:
        f0 = A * math.sin(2 * math.pi * t / T + phi)
        f1 = A * math.sin(2 * math.pi * (t + T) / T + phi)
        assert abs(f0 - f1) < 1e-12
    assert abs(math.sin(2 * math.pi * 1.0)) < 1e-12 and abs(math.sin(2 * math.pi * 0.5)) < 1e-12
    # 2. 오일러 공식
    for th in [0, 0.3, math.pi / 2, math.pi, 2.5, -1.1]:
        assert abs(cmath.exp(1j * th) - complex(math.cos(th), math.sin(th))) < 1e-12
    assert abs(cmath.exp(1j * math.pi) + 1) < 1e-12
    # 3, 4. 실수부와 허수부, 크기 일정
    for k in range(50):
        t = k * 0.0137
        z = x(t, A, T, phi)
        ang = 2 * math.pi * t / T + phi
        assert abs(z.imag - A * math.sin(ang)) < 1e-12
        assert abs(z.real - A * math.cos(ang)) < 1e-12
        assert abs(abs(z) - A) < 1e-12
    # 5. e^{α+iφ} e^{i2πt/T}
    alpha = math.log(A)
    assert abs(alpha - 0.693147) < 1e-6
    for t in [0.0, 0.1, 0.33]:
        lhs = x(t, A, T, phi)
        rhs = cmath.exp(alpha + 1j * phi) * cmath.exp(1j * 2 * math.pi * t / T)
        assert abs(lhs - rhs) < 1e-12
    # 6. 한 주기 평균 전력 (중점 규칙 수치 적분)
    N = 20000
    pr = sum((A * math.sin(2 * math.pi * (k + 0.5) / N + phi)) ** 2 for k in range(N)) / N
    pc = sum(abs(x((k + 0.5) * T / N, A, T, phi)) ** 2 for k in range(N)) / N
    assert abs(pr - A ** 2 / 2) < 1e-9 and abs(pc - A ** 2) < 1e-9
    # 7. 회전 방향
    for t in [0.1, 0.2, 0.37]:
        zp, zm = cmath.exp(1j * 2 * math.pi * t), cmath.exp(-1j * 2 * math.pi * t)
        assert abs(zp.real - zm.real) < 1e-12 and abs(zp.imag + zm.imag) < 1e-12
        assert abs(zp - zm) > 1e-3
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
