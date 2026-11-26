---
layout: "note"
title: "62_aliasing_verify.py"
display_title: "62_aliasing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/aliasing/"
parent_title: "에일리어싱"
description: "휴먼 인터페이스 미디어 · 에일리어싱 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/62_aliasing_verify/"
---
{% raw %}
[에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""에일리어싱 검증.

문서: 62.에일리어싱 (예시로 보기, 정의, 예제, 확인 문제)
실행: python3 -I 62_aliasing_verify.py   (표준 라이브러리만 쓴다)

주장:
  1. 접힘 공식: 주파수 f인 코사인을 f_s로 재면 f_a = |f − k f_s| (k는 f/f_s에 가장 가까운 정수)인
     코사인과 표본이 모두 같다. f_a는 늘 0 이상 f_s/2 이하다(무작위 2,000쌍).
  2. 예: 5 kHz를 8 kHz로 재면 3 kHz. 표본 값 표(n = 0~7)가 두 신호에서 같다.
  3. 시간 그림: ω0 = 4ωs/6이면 ωs/3으로 보여 3표본마다, ω0 = 5ωs/6이면 ωs/6으로 보여 6표본마다 되풀이된다.
  4. 주파수 그림: 삼각형 스펙트럼(최고 1 Hz)을 f_s = 1.5 Hz로 재면 복사본이 겹친다.
     0.5 ≤ f ≤ 1에서 겹친 두 삼각형의 합은 평평한 0.75(= (1/T) × 0.5)다. 표본 합 Σ x(nT)e^{-j2πfnT}로도 확인.
  5. 이산 주파수: cos(15πn/8) = cos(πn/8), cos(7πn/4) = cos(πn/4), cos(3πn/2) = cos(πn/2), cos(2πn) = 1.
     f_s = 16 kHz로 옮기면 15πn/8은 15 kHz, πn/8은 1 kHz이고, 15 kHz는 |15 − 16| = 1 kHz로 보인다.
  6. 회전(복소 지수)은 방향이 남는다: e^{j2π·7000n/8000} = e^{−j2π·1000n/8000}.
     바큇살 12개(30° 간격) 바퀴가 한 장에 28° 돌면 한 장에 −2°(거꾸로)로 보이고, 초당 24장이면 초당 −48°.
  7. 공간 주파수: 0.6 cycle/pixel은 0.4 cycle/pixel로 보인다.
  8. 카드 답: 7 kHz → 10 kHz 표본화에서 3 kHz, 12 kHz → 2 kHz.
     표본화 뒤에는 진짜 3 kHz와 둔갑한 3 kHz의 표본이 같아 필터로 가를 수 없다.
     ω0 = 5ωs/6의 복사본 중 −5ωs/6 + ωs = ωs/6이 통과 대역(|ω| < ωs/2)에 든다.
"""
import cmath
import math
import random


def alias(f: float, fs: float) -> float:
    k = round(f / fs)
    return abs(f - k * fs)


def sinc(u: float) -> float:
    return 1.0 if u == 0 else math.sin(math.pi * u) / (math.pi * u)


def tri(f: float) -> float:
    return max(0.0, 1.0 - abs(f))


def main() -> None:
    # 1. 접힘 공식
    rng = random.Random(62)
    for _ in range(2000):
        fs = rng.uniform(100, 50000)
        f = rng.uniform(0, 5 * fs)
        fa = alias(f, fs)
        assert -1e-9 <= fa <= fs / 2 + 1e-9
        for n in range(12):
            assert abs(math.cos(2 * math.pi * f * n / fs) - math.cos(2 * math.pi * fa * n / fs)) < 1e-7

    # 2. 5 kHz @ 8 kHz
    assert alias(5000, 8000) == 3000
    a = [math.cos(2 * math.pi * 5000 * n / 8000) for n in range(8)]
    b = [math.cos(2 * math.pi * 3000 * n / 8000) for n in range(8)]
    assert all(abs(p - q) < 1e-12 for p, q in zip(a, b))
    table = [round(v, 3) + 0.0 for v in a]
    assert table == [1.0, -0.707, 0.0, 0.707, -1.0, 0.707, 0.0, -0.707], table

    # 3. 시간 그림의 두 예
    for num, shown, period in ((4, 2, 3), (5, 1, 6)):
        fs = 6.0                       # ωs를 6으로 두면 ω0 = num
        assert alias(num, fs) == shown
        s = [math.cos(2 * math.pi * num * n / fs) for n in range(24)]
        assert all(abs(s[n + period] - s[n]) < 1e-9 for n in range(24 - period))
        assert any(abs(s[n + p] - s[n]) > 1e-6 for p in range(1, period) for n in range(6))

    # 4. 겹친 복사본의 합이 평평하다
    fs, T = 1.5, 1 / 1.5
    for f in (0.5, 0.6, 0.75, 0.9, 1.0):
        total = fs * sum(tri(f - k * fs) for k in range(-5, 6))
        assert abs(total - 0.75) < 1e-12
        val = sum(sinc(n * T) ** 2 * cmath.exp(-2j * math.pi * f * n * T) for n in range(-30000, 30001))
        assert abs(val.real - 0.75) < 1e-3 and abs(val.imag) < 1e-6
    # 겹치지 않을 때(f_s = 3)는 f = 0.75에서 원래 높이 3 × 0.25
    assert abs(3.0 * sum(tri(0.75 - k * 3.0) for k in range(-5, 6)) - 0.75) < 1e-12

    # 5. 이산 주파수
    for w, w_eq in ((15 * math.pi / 8, math.pi / 8), (7 * math.pi / 4, math.pi / 4),
                    (3 * math.pi / 2, math.pi / 2), (2 * math.pi, 0.0)):
        for n in range(40):
            assert abs(math.cos(w * n) - math.cos(w_eq * n)) < 1e-9

    fs = 16000
    assert abs((15 * math.pi / 8) * fs / (2 * math.pi) - 15000) < 1e-9
    assert abs((math.pi / 8) * fs / (2 * math.pi) - 1000) < 1e-9
    assert alias(15000, fs) == 1000

    # 6. 회전 방향
    for n in range(40):
        assert abs(cmath.exp(2j * math.pi * 7000 * n / 8000) - cmath.exp(-2j * math.pi * 1000 * n / 8000)) < 1e-9
    step = 28.0
    shown = step - 30.0 * round(step / 30.0)
    assert shown == -2.0 and shown * 24 == -48.0
    assert abs(step * 24 / 360 - 1.8667) < 1e-3          # 실제로는 초당 약 1.87바퀴

    # 7. 공간 주파수
    assert abs(alias(0.6, 1.0) - 0.4) < 1e-12

    # 8. 카드 답
    assert alias(7000, 10000) == 3000 and alias(12000, 10000) == 2000
    for n in range(30):
        assert abs(math.cos(2 * math.pi * 7000 * n / 10000) - math.cos(2 * math.pi * 3000 * n / 10000)) < 1e-9
    assert abs((-5 / 6 + 1) - 1 / 6) < 1e-12 and 1 / 6 < 1 / 2

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
