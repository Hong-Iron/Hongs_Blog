---
layout: "note"
title: "62_sampling-aliasing-ladder_p4.py"
display_title: "62_sampling-aliasing-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sampling-aliasing-ladder/"
parent_title: "표본화와 에일리어싱 예제 사다리"
description: "휴먼 인터페이스 미디어 · 표본화와 에일리어싱 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p4/"
---
{% raw %}
[표본화와 에일리어싱 예제 사다리](/Hongs_Blog/studies/human-interface-media/sampling-aliasing-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본화와 에일리어싱 예제 사다리 · 문제 4 · 독립 문제 (변형 문제 1·2도 함께 확인)

문서: 4-1학기/휴먼 인터페이스 미디어/4.연습문제/62.표본화와 에일리어싱 예제 사다리.md
실행: python3 -I 62_sampling-aliasing-ladder_p4.py   (표준 라이브러리만 쓴다)

x[n] = cos(0.4πn)을 f_s = 10 kHz로 얻었다. 0~25 kHz에서 가능한 원래 주파수는
2, 8, 12, 18, 22 kHz 다섯 개다(1 Hz 간격으로 모두 대 보아 확인). 차단 5 kHz 필터가 있었다면 2 kHz뿐이다.
변형 1: 바큇살 8개(45° 간격) 바퀴가 한 장에 44° 돌면 한 장에 -1°, 초당 24장이면 초당 24° 거꾸로 도는 것처럼 보인다.
변형 2: 0.6 cycle/pixel 줄무늬는 0.4 cycle/pixel로 보인다.
"""
import math


def alias(f: float, fs: float) -> float:
    """f/fs에 가장 가까운 정수 k로 |f - k fs|를 구한다. 결과는 0 이상 fs/2 이하."""
    return abs(f - round(f / fs) * fs)


def omega(fa: float, fs: float) -> float:
    """보이는 주파수 fa(Hz)를 이산 주파수 ω(rad/표본)로 옮긴다: ω = 2π fa / fs."""
    return 2 * math.pi * fa / fs


def same_samples(f1, f2, fs, n_max=64, tol=1e-6) -> bool:
    return all(abs(math.cos(2 * math.pi * f1 * n / fs) - math.cos(2 * math.pi * f2 * n / fs)) < tol
               for n in range(n_max))


def main() -> None:
    fs, w = 10000, 0.4 * math.pi
    fa = w * fs / (2 * math.pi)
    assert abs(fa - 2000) < 1e-9
    cands = [f for f in range(0, 25001)
             if all(abs(math.cos(2 * math.pi * f * n / fs) - math.cos(w * n)) < 1e-6 for n in range(20))]
    assert cands == [2000, 8000, 12000, 18000, 22000], cands
    assert all(alias(f, fs) == 2000 for f in cands)
    assert [f for f in cands if f < 5000] == [2000]
    # 변형 1: 바큇살 8개 → 45°마다 같은 모양
    step = 44.0
    shown = step - 45.0 * round(step / 45.0)
    assert shown == -1.0 and shown * 24 == -24.0
    # 변형 2: 공간 주파수
    assert abs(alias(0.6, 1.0) - 0.4) < 1e-12
    assert same_samples(0.6, 0.4, 1.0)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
