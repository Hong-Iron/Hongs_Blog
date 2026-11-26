---
layout: "note"
title: "62_sampling-aliasing-ladder_p1.py"
display_title: "62_sampling-aliasing-ladder_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sampling-aliasing-ladder/"
parent_title: "표본화와 에일리어싱 예제 사다리"
description: "휴먼 인터페이스 미디어 · 표본화와 에일리어싱 예제 사다리 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/62_sampling-aliasing-ladder_p1/"
---
{% raw %}
[표본화와 에일리어싱 예제 사다리](/Hongs_Blog/studies/human-interface-media/sampling-aliasing-ladder/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본화와 에일리어싱 예제 사다리 · 문제 1 · 완전한 풀이

문서: 4-1학기/휴먼 인터페이스 미디어/4.연습문제/62.표본화와 에일리어싱 예제 사다리.md
실행: python3 -I 62_sampling-aliasing-ladder_p1.py   (표준 라이브러리만 쓴다)

x(t) = cos(2π·1000t) + cos(2π·6000t)를 f_s = 8000 Hz로 잰다.
  1. 최고 주파수 6000 Hz
  2. 필요한 표본화율 12000 Hz 초과. 8000 Hz는 모자라 6000 Hz 성분이 둔갑한다
  3. 보이는 주파수 1000 Hz, 2000 Hz
  4. 이산 주파수 π/4, π/2. x[n] = cos(πn/4) + cos(πn/2)
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
    fs, comps = 8000, [1000, 6000]
    fM = max(comps)
    assert fM == 6000 and 2 * fM == 12000 and not fs > 2 * fM
    seen = [alias(f, fs) for f in comps]
    assert seen == [1000, 2000]
    assert [round(f / fs) for f in comps] == [0, 1]
    w = [omega(f, fs) for f in seen]
    assert abs(w[0] - math.pi / 4) < 1e-12 and abs(w[1] - math.pi / 2) < 1e-12
    assert abs(omega(6000, fs) - 3 * math.pi / 2) < 1e-12       # 그대로 옮기면 3π/2 = 2π - π/2
    for n in range(64):
        xn = sum(math.cos(2 * math.pi * f * n / fs) for f in comps)
        assert abs(xn - (math.cos(math.pi * n / 4) + math.cos(math.pi * n / 2))) < 1e-9
    assert same_samples(6000, 2000, fs)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
