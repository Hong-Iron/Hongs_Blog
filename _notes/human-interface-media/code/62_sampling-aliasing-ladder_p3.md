---
layout: "note"
title: "62_sampling-aliasing-ladder_p3.py"
display_title: "62_sampling-aliasing-ladder_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sampling-aliasing-ladder/"
parent_title: "표본화와 에일리어싱 예제 사다리"
description: "휴먼 인터페이스 미디어 · 표본화와 에일리어싱 예제 사다리 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p3/"
---
{% raw %}
[표본화와 에일리어싱 예제 사다리](/Hongs_Blog/studies/human-interface-media/sampling-aliasing-ladder/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본화와 에일리어싱 예제 사다리 · 문제 3 · 하위목표 절반이 빈칸

문서: 4-1학기/휴먼 인터페이스 미디어/4.연습문제/62.표본화와 에일리어싱 예제 사다리.md
실행: python3 -I 62_sampling-aliasing-ladder_p3.py   (표준 라이브러리만 쓴다)

x(t) = cos(2π·1000t) + 0.2cos(2π·30000t)를 안티에일리어싱 필터 없이 f_s = 48000 Hz로 잰다.
  1. 최고 주파수 30000 Hz  2. 60000 Hz 초과가 필요, 48000 Hz는 모자람
  3. 보이는 주파수 1000 Hz, 18000 Hz (18 kHz는 가청 대역 20 Hz~20 kHz 안)
  4. 이산 주파수 π/24, 3π/4
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
    fs = 48000
    assert 2 * 30000 == 60000 and not fs > 60000
    assert alias(1000, fs) == 1000 and alias(30000, fs) == 18000
    assert round(30000 / fs) == 1
    assert 20 <= 18000 <= 20000                                   # 사람 귀에 들리는 범위
    assert abs(omega(1000, fs) - math.pi / 24) < 1e-12
    assert abs(omega(18000, fs) - 3 * math.pi / 4) < 1e-12
    for n in range(96):
        xn = math.cos(2 * math.pi * 1000 * n / fs) + 0.2 * math.cos(2 * math.pi * 30000 * n / fs)
        assert abs(xn - (math.cos(math.pi * n / 24) + 0.2 * math.cos(3 * math.pi * n / 4))) < 1e-9
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
