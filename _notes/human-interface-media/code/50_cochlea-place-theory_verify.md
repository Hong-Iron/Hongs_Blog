---
layout: "note"
title: "50_cochlea-place-theory_verify.py"
display_title: "50_cochlea-place-theory_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "50"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cochlea-place-theory/"
parent_title: "달팽이관과 장소설"
description: "휴먼 인터페이스 미디어 · 달팽이관과 장소설 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/50_cochlea-place-theory_verify/"
---
{% raw %}
[달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""달팽이관과 장소설 검증.

문서: 50.달팽이관과 장소설 (예시로 보기, 예제, 확인 문제 C3·C4)
실행: python3 -I 50_cochlea-place-theory_verify.py  (표준 라이브러리만 쓴다)

주장
  1. 사람의 Greenwood 함수 f(x) = 165.4 (10^(2.1 x) - 0.88) Hz 의 양 끝은
     x = 0(꼭대기)에서 약 20 Hz, x = 1(바닥)에서 약 20.7 kHz 로 가청 대역과 맞는다.
  2. 역함수 x(f) = log10(f / 165.4 + 0.88) / 2.1 은 f 를 되돌려 준다. f(x) 는 x 에 대해 늘기만 한다.
  3. 기저막 길이를 35 mm 로 두면 바닥에서 잰 거리 d = 35 (1 - x) mm 이다.
     440, 880, 1320 Hz 는 바닥에서 약 25.8, 21.8, 19.2 mm 자리를 가장 크게 흔든다(높을수록 바닥 쪽).
  4. 베케시의 측정 그림에서 눈으로 읽은 봉우리 자리(25~1600 Hz)는 이 식과 2.5 mm 안에서 맞는다.
  5. 높은 주파수에서는 한 옥타브(2배)마다 약 5.0 mm 씩 옮겨 간다.
     낮은 쪽은 몰린다: 25~100 Hz(두 옥타브)는 3 mm 안, 1~2 kHz(한 옥타브)는 약 4.5 mm.
  6. 카드 C3: 4 kHz 는 x 약 0.666, 바닥에서 약 11.7 mm.
  7. 카드 C4: 500, 1000, 2000 Hz 복합음은 바닥에서 약 25.1, 21.0, 16.4 mm 세 곳에 봉우리가 생긴다.
  8. 한가운데(x = 0.5)는 약 1.71 kHz 를 맡는다.
"""
import math

A, a, k = 165.4, 2.1, 0.88   # Greenwood (1990), 사람
L_MM = 35.0                  # 기저막 길이로 흔히 쓰는 값


def freq(x: float) -> float:
    """꼭대기에서 잰 길이 비율 x (0~1) 자리가 가장 크게 반응하는 주파수 (Hz)."""
    return A * (10 ** (a * x) - k)


def place(f: float) -> float:
    """주파수 f (Hz) 를 맡는 자리의 길이 비율 x (꼭대기 0, 바닥 1)."""
    return math.log10(f / A + k) / a


def from_base_mm(f: float) -> float:
    return L_MM * (1 - place(f))


def main() -> None:
    # 1. 양 끝
    lo, hi = freq(0.0), freq(1.0)
    assert abs(lo - 19.85) < 0.01 and abs(hi - 20677) < 1, (lo, hi)
    print(f"[OK] f(0) = {lo:.2f} Hz, f(1) = {hi:,.0f} Hz")

    # 2. 역함수와 단조성
    for f in [20, 50, 100, 440, 1000, 4000, 12000, 20000]:
        assert abs(freq(place(f)) - f) < 1e-6 * f
    xs = [i / 1000 for i in range(1001)]
    assert all(freq(xs[i]) < freq(xs[i + 1]) for i in range(1000))
    print("[OK] 역함수 되돌리기, x 에 대해 늘기만 함")

    # 3. 세 성분 복합음
    d = {f: from_base_mm(f) for f in (440, 880, 1320)}
    assert abs(d[440] - 25.85) < 0.05 and abs(d[880] - 21.80) < 0.05 and abs(d[1320] - 19.21) < 0.05, d
    assert d[1320] < d[880] < d[440]
    print("[OK] 바닥에서 거리: " + ", ".join(f"{f} Hz {v:.1f} mm" for f, v in d.items()))

    # 4. 베케시 측정 그림에서 읽은 봉우리 (바닥에서 mm, 눈금 읽기라 1 mm 안팎의 오차)
    read = {1600: 17.2, 800: 20.4, 400: 24.4, 200: 29.2, 100: 31.5, 50: 32.6}
    for f, mm in read.items():
        g = from_base_mm(f)
        assert abs(g - mm) < 2.5, (f, g, mm)
        print(f"     {f:>5} Hz: 그림 {mm:.1f} mm, 식 {g:.1f} mm, 차이 {g - mm:+.1f}")
    print("[OK] 측정 봉우리와 식이 2.5 mm 안에서 맞음")

    # 5. 옥타브 간격과 낮은 쪽 몰림
    hi_oct = L_MM * math.log10(2) / a
    assert abs(hi_oct - 5.017) < 0.001
    assert abs((from_base_mm(8000) - from_base_mm(16000)) - hi_oct) < 0.1
    low = from_base_mm(25) - from_base_mm(100)
    mid = from_base_mm(1000) - from_base_mm(2000)
    assert low < 3.0 and abs(mid - 4.55) < 0.05, (low, mid)
    print(f"[OK] 높은 쪽 옥타브당 {hi_oct:.2f} mm, 25~100 Hz {low:.2f} mm, 1~2 kHz {mid:.2f} mm")

    # 6. 카드 C3
    x4 = place(4000)
    assert abs(x4 - 0.666) < 0.001 and abs(from_base_mm(4000) - 11.68) < 0.05
    print(f"[OK] 4 kHz: x = {x4:.3f}, 바닥에서 {from_base_mm(4000):.1f} mm")

    # 7. 카드 C4
    c4 = [from_base_mm(f) for f in (500, 1000, 2000)]
    assert [round(v, 1) for v in c4] == [25.1, 21.0, 16.4], c4
    print("[OK] 500/1000/2000 Hz: " + ", ".join(f"{v:.1f} mm" for v in c4))

    # 8. 한가운데
    assert abs(freq(0.5) - 1710) < 1, freq(0.5)
    print(f"[OK] x = 0.5: {freq(0.5):,.0f} Hz")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
