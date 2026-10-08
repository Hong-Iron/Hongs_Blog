---
layout: "note"
title: "19_opponent-process_verify.py"
display_title: "19_opponent-process_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/opponent-process/"
parent_title: "반대색 과정"
description: "휴먼 인터페이스 미디어 · 반대색 과정 검증 코드"
permalink: "/studies/human-interface-media/code/19_opponent-process_verify/"
---
{% raw %}
[반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""반대색 과정 검증.

문서: 19.반대색 과정 (예시로 보기, 카드 C2)
추상체 모형은 16_trichromatic-theory_verify.py와 같다 (봉우리 S 445, M 535, L 575 nm, 폭 30/45/45 nm 가정).
주장:
  1. 슬라이드 p.13 오른쪽 (a)~(c): 빛 1(M 봉우리 535 nm)은 M > L이라 L - M < 0(초록 쪽),
     빛 2(L 봉우리 575 nm)는 L > M이라 L - M > 0(빨강 쪽)이다.
  2. 회로 1(S는 +, M+L은 -)을 S - (M + L)/2로 두면, 450 nm 파랑에는 양수(B+), 580 nm 노랑에는 음수(Y-)다.
  3. 회로 2(M은 +, L은 -)의 출력 M - L은 (c)의 L - M과 부호만 반대다. 두 극성의 세포가 모두 있다.
"""
import math

PEAK = {"S": 445.0, "M": 535.0, "L": 575.0}
WIDTH = {"S": 30.0, "M": 45.0, "L": 45.0}


def sens(cone: str, lam: float) -> float:
    return math.exp(-((lam - PEAK[cone]) ** 2) / (2 * WIDTH[cone] ** 2))


def main() -> None:
    l_minus_m = {lam: sens("L", lam) - sens("M", lam) for lam in (535, 575)}
    assert l_minus_m[535] < 0 < l_minus_m[575]
    print(f"[OK] L-M: 빛 1(535 nm) {l_minus_m[535]:+.3f}, 빛 2(575 nm) {l_minus_m[575]:+.3f}")

    by = {lam: sens("S", lam) - (sens("M", lam) + sens("L", lam)) / 2 for lam in (450, 580)}
    assert by[450] > 0 > by[580]
    print(f"[OK] 회로 1 S-(M+L)/2: 450 nm {by[450]:+.3f}, 580 nm {by[580]:+.3f}")

    for lam in range(400, 701, 10):
        assert abs((sens("M", lam) - sens("L", lam)) + (sens("L", lam) - sens("M", lam))) < 1e-15
    print("[OK] 회로 2의 M-L = -(L-M)")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
