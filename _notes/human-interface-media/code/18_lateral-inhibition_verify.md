---
layout: "note"
title: "18_lateral-inhibition_verify.py"
display_title: "18_lateral-inhibition_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "신호와 미디어"
parent_url: "/studies/human-interface-media/lateral-inhibition/"
parent_title: "측면 억제"
description: "휴먼 인터페이스 미디어 · 측면 억제 검증 코드"
permalink: "/studies/human-interface-media/code/18_lateral-inhibition_verify/"
---
{% raw %}
[측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""측면 억제 검증 (측면 억제 예제 사다리의 답 포함).

문서: 18.측면 억제, 4.연습문제/18.측면 억제 예제 사다리
모형 (슬라이드, 강의 3 p.11~12): 각 세포의 최종 반응 = 자기 수용기 반응 - 이웃마다 (이웃 수용기 반응 x k).
  슬라이드는 k = 0.1 (100 -> 10, 20 -> 2). 1차원은 좌우 이웃 둘, 헤르만 격자는 상하좌우 넷.
  줄 끝 바깥은 끝 세포와 같은 밝기가 이어진다고 본다.
주장:
  1. 마하 띠: 수용기 (100, 100, 100, 20, 20, 20) -> (80, 80, 88, 8, 16, 16).
  2. 이 계산은 커널 (-0.1, 1, -0.1)과의 합성곱과 같다.
  3. 헤르만 격자: 교차점 A = 100 - 4 x 10 = 60, 두 검은 칸 사이 길 D = 100 - 10 - 2 - 10 - 2 = 76.
     실제 격자 영상(길 폭 1칸)에 상하좌우 억제를 걸어도 같은 값이 나온다.
  4. 균일한 영역의 반응은 (1 - 2k)배로 줄 뿐이라 영역 사이 비(100:20 = 80:16)가 유지된다.
  5. 사다리 문제 3: (50, 50, 50, 150, 150, 150) -> (40, 40, 30, 130, 120, 120).
     사다리 문제 4: (20, 20, 100, 20, 20) -> (16, 8, 96, 8, 16).
     사다리 변형: k = 0.2, (100, 100, 100, 20, 20, 20) -> 계산값 (60, 60, 76, -4, 12, 12),
                  발화율은 음수가 될 수 없으므로 D는 0.
  6. 신호 관점: 입력이 cos(omega n)이면 출력은 (1 - 2k cos omega) cos(omega n)이다.
     k = 0.1이면 고른 빛(omega = 0)은 0.8배, 가장 촘촘한 줄무늬(omega = pi)는 1.2배가 된다.
     낮은 주파수보다 높은 주파수를 더 살리는 고주파 강조 필터다.
  7. y_n = (1 - 2k) [x_n + (k / (1 - 2k)) (2 x_n - x_{n-1} - x_{n+1})].
     전체 밝기를 (1 - 2k)배로 낮춘 것 말고는, 원래 신호에 "이차 차분의 음수"를 더한 선명화 꼴이다.
"""
import math
import random
from fractions import Fraction as F


def inhibit_1d(r, k):
    ext = [r[0]] + list(r) + [r[-1]]
    return [ext[i] - k * ext[i - 1] - k * ext[i + 1] for i in range(1, len(ext) - 1)]


def convolve_same(r, kernel):
    ext = [r[0]] + list(r) + [r[-1]]
    return [sum(kernel[j] * ext[i - 1 + j] for j in range(3)) for i in range(1, len(ext) - 1)]


def inhibit_2d(img, k):
    h, w = len(img), len(img[0])

    def at(y, x):
        return img[min(max(y, 0), h - 1)][min(max(x, 0), w - 1)]

    return [[img[y][x] - k * (at(y - 1, x) + at(y + 1, x) + at(y, x - 1) + at(y, x + 1))
             for x in range(w)] for y in range(h)]


def main() -> None:
    k = F(1, 10)
    mach = inhibit_1d([100, 100, 100, 20, 20, 20], k)
    assert mach == [80, 80, 88, 8, 16, 16], mach
    print(f"[OK] 마하 띠: {[int(v) for v in mach]}")

    assert convolve_same([100, 100, 100, 20, 20, 20], [-k, 1, -k]) == mach
    print("[OK] 커널 (-0.1, 1, -0.1) 합성곱과 같다")

    assert 100 - 4 * 10 == 60 and 100 - 10 - 2 - 10 - 2 == 76
    # 격자 영상: 검은 칸 3x3개(각 3x3 픽셀, 밝기 20), 길 폭 1픽셀(밝기 100)
    size, street = 3, 1
    n = 3 * size + 4 * street
    img = [[100] * n for _ in range(n)]
    for by in range(3):
        for bx in range(3):
            y0 = street + by * (size + street)
            x0 = street + bx * (size + street)
            for y in range(y0, y0 + size):
                for x in range(x0, x0 + size):
                    img[y][x] = 20
    out = inhibit_2d(img, k)
    cross = street + size  # 첫 교차점 좌표 (길과 길이 만나는 곳)
    between = street + size // 2  # 두 검은 칸 사이 길
    assert img[cross][cross] == 100 and out[cross][cross] == 60
    assert img[between][cross] == 100 and out[between][cross] == 76
    print(f"[OK] 헤르만 격자 영상: 교차점 {out[cross][cross]}, 두 검은 칸 사이 길 {out[between][cross]}")

    assert mach[0] / mach[5] == F(100, 20) == 5
    print("[OK] 균일한 영역: 80:16 = 100:20 = 5")

    assert inhibit_1d([50, 50, 50, 150, 150, 150], k) == [40, 40, 30, 130, 120, 120]
    print("[OK] 사다리 문제 3: (40, 40, 30, 130, 120, 120)")
    assert inhibit_1d([20, 20, 100, 20, 20], k) == [16, 8, 96, 8, 16]
    print("[OK] 사다리 문제 4: (16, 8, 96, 8, 16)")
    raw = inhibit_1d([100, 100, 100, 20, 20, 20], F(1, 5))
    assert raw == [60, 60, 76, -4, 12, 12]
    assert [max(F(0), v) for v in raw] == [60, 60, 76, 0, 12, 12]
    print("[OK] 사다리 변형: k=0.2 -> (60, 60, 76, -4, 12, 12), 음수는 0으로")

    # 주장 6: 주파수 응답
    kf = 0.1
    for omega, gain in ((0.0, 0.8), (math.pi / 2, 1.0), (math.pi, 1.2), (math.pi / 3, 0.9)):
        xs = [math.cos(omega * n) for n in range(200)]
        ys = [xs[n] - kf * (xs[n - 1] + xs[n + 1]) for n in range(1, 199)]
        assert all(abs(y - gain * xs[n]) < 1e-12 for y, n in zip(ys, range(1, 199))), omega
    print("[OK] 주파수 응답 1 - 2k cos(omega): omega=0 -> 0.8, pi/2 -> 1.0, pi -> 1.2")

    # 주장 7: 선명화 꼴 (정확 계산)
    rnd = random.Random(0)
    for _ in range(100):
        xs = [F(rnd.randint(0, 255)) for _ in range(10)]
        for n in range(1, 9):
            lhs = xs[n] - k * (xs[n - 1] + xs[n + 1])
            rhs = (1 - 2 * k) * (xs[n] + (k / (1 - 2 * k)) * (2 * xs[n] - xs[n - 1] - xs[n + 1]))
            assert lhs == rhs
    print("[OK] 측면 억제 = (1-2k) x [원래 신호 + (k/(1-2k)) x (2x_n - x_(n-1) - x_(n+1))]")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
