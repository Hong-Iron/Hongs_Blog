---
layout: "note"
title: "46_loudness-pitch_verify.py"
display_title: "46_loudness-pitch_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/loudness-pitch/"
parent_title: "소리의 크기와 높이"
description: "휴먼 인터페이스 미디어 · 소리의 크기와 높이 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/46_loudness-pitch_verify/"
---
{% raw %}
[소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""소리의 크기와 높이 검증.

문서: 46.소리의 크기와 높이 (예시로 보기, 정의, 오해, 확인 문제 C2·C3)
실행: python3 -I 46_loudness-pitch_verify.py  (표준 라이브러리만 쓴다)

주장:
  1. 그래프의 직선 구간: 40 dB에서 크기 1, 50 dB에서 2. 10 dB마다 2배라면 N = 2^((L - 40)/10).
     이것은 N = (I / I_40)^b 꼴이고 b = log10 2 = 0.301, 곧 세기의 약 0.3제곱이다.
     음압으로는 2b = 0.602제곱이다. 110 dB에서 크기 128, 세기 비 1e7.
  2. 세기 2배(+3.01 dB)면 크기는 2^0.301 = 1.232배. 크기 2배에는 세기 10배(+10 dB)가 필요하다.
  3. 200 + 400 + 600 + 800 Hz와 400 + 600 + 800 Hz는 둘 다 5 ms마다 되풀이된다(그림 2).
  4. 카드 C3: 300 + 450 + 600 Hz는 150 Hz의 2, 3, 4배로, 1/150 s = 6.67 ms마다 되풀이된다.
     가장 낮은 성분 300 Hz의 주기 3.33 ms로는 되풀이되지 않는다.
  5. 한 옥타브: 주파수 2배 (220 -> 440 -> 880 Hz).
"""
import math
from functools import reduce


def loudness(level_db: float) -> float:
    return 2 ** ((level_db - 40) / 10)


def repeats(freqs, tau: float, n: int = 2000, tol: float = 1e-9) -> bool:
    x = lambda t: sum(math.sin(2 * math.pi * f * t) for f in freqs)
    T = 0.02
    return all(abs(x(t + tau) - x(t)) < tol for t in (T * j / n for j in range(n)))


def common_fundamental(freqs) -> int:
    return reduce(math.gcd, [int(f) for f in freqs])


def main() -> None:
    assert loudness(40) == 1 and loudness(50) == 2 and loudness(110) == 128
    b = math.log10(2)
    for L in (40, 47.5, 60, 85, 110):
        I_ratio = 10 ** ((L - 40) / 10)
        assert abs(loudness(L) - I_ratio ** b) < 1e-9
        P_ratio = 10 ** ((L - 40) / 20)
        assert abs(loudness(L) - P_ratio ** (2 * b)) < 1e-9
    assert abs(b - 0.301) < 0.001 and abs(10 ** ((110 - 40) / 10) - 1e7) < 1e-3
    print(f"[OK] N = 2^((L-40)/10) = (I/I_40)^{b:.3f} = (P/P_40)^{2 * b:.3f}; 110 dB에서 N = 128, 세기 비 1e7")

    assert abs(2 ** b - 1.2320) < 1e-4
    assert abs(loudness(40 + 10 * math.log10(2)) - 1.2320) < 1e-4
    assert abs(loudness(40 + 10 * math.log10(10)) - 2.0) < 1e-12
    print("[OK] 세기 2배 -> 크기 1.232배, 크기 2배 <- 세기 10배")

    assert repeats([200, 400, 600, 800], 0.005) and repeats([400, 600, 800], 0.005)
    assert not repeats([400, 600, 800], 0.0025)
    assert common_fundamental([400, 600, 800]) == 200
    print("[OK] 1+2+3+4차와 2+3+4차 모두 5 ms마다 (2.5 ms로는 안 됨)")

    assert common_fundamental([300, 450, 600]) == 150
    assert repeats([300, 450, 600], 1 / 150) and not repeats([300, 450, 600], 1 / 300)
    assert abs(1e3 / 150 - 6.67) < 0.005 and abs(1e3 / 300 - 3.33) < 0.005
    print("[OK] 카드 C3: 300+450+600 Hz -> 150 Hz, 6.67 ms마다 (3.33 ms로는 안 됨)")

    assert 220 * 2 == 440 and 440 * 2 == 880
    print("[OK] 옥타브 = 주파수 2배")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
