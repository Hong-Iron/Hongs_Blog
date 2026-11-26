---
layout: "note"
title: "48_timbre_verify.py"
display_title: "48_timbre_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/timbre/"
parent_title: "음색"
description: "휴먼 인터페이스 미디어 · 음색 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/48_timbre_verify/"
---
{% raw %}
[음색](/Hongs_Blog/studies/human-interface-media/timbre/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""음색 검증.

문서: 48.음색 (예시로 보기, 자주 하는 오해, 확인 문제 C3)
실행: python3 -I 48_timbre_verify.py  (표준 라이브러리만 쓴다)

주장
  1. 위상만 바꾼 두 소리는 파형이 다르지만 고조파마다의 크기(진폭 스펙트럼)는 똑같다.
     예: a_k = 1/k (k = 1..10) 를 모두 사인으로 더한 소리와 모두 코사인으로 더한 소리.
     봉우리 높이는 약 1.71 과 약 2.93 으로 다르다.
  2. 그림 1의 두 소리(고조파 1/k 열 개, 그리고 1, 0.3, 0.1 세 개)를 같은 평균 전력으로 맞추는 배율은
     각각 약 0.803, 0.953 이다(단위 사인파의 평균 전력 1/2 에 맞춤).
  3. 그림 2의 튕긴 소리 모형(k 번째 고조파가 시간 상수 0.6/k 초로 줄어듦)에서
     0.3초 뒤 기본음은 약 61%(-4.3 dB), 8번째 고조파는 약 1.8%(-34.7 dB)로 줄어든다.
  4. 카드 C2: 300, 600, 900 Hz 성분을 진폭 (1, 0.5, 0.2) 와 (0.4, 1, 0.6) 으로 섞은 두 소리는
     둘 다 1/300 s(약 3.33 ms)마다 되풀이되고, 1/600 s 로는 되풀이되지 않는다.
     가장 센 성분이 600 Hz 인 두 번째 소리도 되풀이 간격은 300 Hz 의 주기다.
"""
import cmath
import math

N = 256                      # 한 주기를 나누는 표본 수
K = 10                       # 고조파 개수


def tone(amps, phases, n):
    """한 주기 위 n 번째 표본: sum a_k sin(2 pi k n / N + phi_k)."""
    return sum(a * math.sin(2 * math.pi * (k + 1) * n / N + p) for k, (a, p) in enumerate(zip(amps, phases)))


def dft_mag(x):
    """k = 1..K 번째 고조파의 진폭 (단측). 실수 신호의 DFT 크기 2|X_k|/N."""
    out = []
    for k in range(1, K + 1):
        s = sum(x[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N))
        out.append(2 * abs(s) / N)
    return out


def main() -> None:
    amps = [1 / k for k in range(1, K + 1)]

    # 1. 위상만 다른 두 소리
    x_sin = [tone(amps, [0.0] * K, n) for n in range(N)]
    x_cos = [tone(amps, [math.pi / 2] * K, n) for n in range(N)]
    m_sin, m_cos = dft_mag(x_sin), dft_mag(x_cos)
    assert all(abs(p - q) < 1e-9 for p, q in zip(m_sin, m_cos))
    assert all(abs(p - a) < 1e-9 for p, a in zip(m_sin, amps))
    fine = [i * math.pi / 20000 for i in range(20001)]      # 봉우리는 촘촘한 격자에서 찾는다
    peak_sin = max(sum(a * math.sin((k + 1) * x) for k, a in enumerate(amps)) for x in fine)
    peak_cos = max(x_cos)
    diff = max(abs(p - q) for p, q in zip(x_sin, x_cos))
    assert abs(peak_sin - 1.707) < 0.001 and abs(peak_cos - 2.929) < 0.001 and diff > 1.0, (peak_sin, peak_cos, diff)
    print(f"[OK] 진폭 스펙트럼 같음, 봉우리 {peak_sin:.2f} 대 {peak_cos:.2f}, 파형 차이 최대 {diff:.2f}")

    # 2. 그림 1 두 소리의 평균 전력 맞추기
    def scale(a):
        return math.sqrt(0.5 / (sum(v * v for v in a) / 2))
    sa, sb = scale(amps), scale([1, 0.3, 0.1])
    assert abs(sa - 0.8033) < 1e-3 and abs(sb - 0.9535) < 1e-3, (sa, sb)
    for s, a in ((sa, amps), (sb, [1, 0.3, 0.1])):
        x = [tone([s * v for v in a], [0.0] * len(a), n) for n in range(N)]
        p = sum(v * v for v in x) / N
        assert abs(p - 0.5) < 1e-9
    print(f"[OK] 같은 평균 전력 0.5 로 맞추는 배율: {sa:.3f}, {sb:.3f}")

    # 3. 튕긴 소리 모형의 고조파별 사라짐
    def level_db(k, t):
        return 20 * math.log10(math.exp(-t / (0.6 / k)))
    r1, r8 = math.exp(-0.3 / 0.6), math.exp(-0.3 / (0.6 / 8))
    assert abs(r1 - 0.607) < 0.001 and abs(r8 - 0.0183) < 0.0001
    assert abs(level_db(1, 0.3) + 4.34) < 0.01 and abs(level_db(8, 0.3) + 34.74) < 0.01
    print(f"[OK] 0.3초 뒤: 기본음 {r1:.1%} ({level_db(1, 0.3):.1f} dB), 8번째 {r8:.1%} ({level_db(8, 0.3):.1f} dB)")

    # 4. 카드 C2
    def x(amps, t):
        return sum(a * math.sin(2 * math.pi * f * t) for a, f in zip(amps, (300, 600, 900)))
    ts = [i / 300 / 997 for i in range(997)]
    for amps in ((1, 0.5, 0.2), (0.4, 1, 0.6)):
        assert all(abs(x(amps, t + 1 / 300) - x(amps, t)) < 1e-9 for t in ts)
        assert max(abs(x(amps, t + 1 / 600) - x(amps, t)) for t in ts) > 0.5
    assert math.gcd(math.gcd(300, 600), 900) == 300
    print("[OK] 두 소리 모두 3.33 ms 마다 되풀이, 1.67 ms 로는 아님 (기본 주파수 300 Hz)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
