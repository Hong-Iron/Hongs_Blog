---
layout: "note"
title: "14_histogram-density_verify.py"
display_title: "14_histogram-density_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
parent_url: "/studies/data-and-information/histogram-density/"
parent_title: "히스토그램 밀도 추정"
description: "자료와 정보 · 히스토그램 밀도 추정 검증 코드"
permalink: "/studies/data-and-information/code/14_histogram-density_verify/"
---
{% raw %}
[히스토그램 밀도 추정](/Hongs_Blog/studies/data-and-information/histogram-density/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 히스토그램 밀도 추정 문서의 값을 확인한다. 실행: python3 14_histogram-density_verify.py (표준 라이브러리만)
# 자료: 머리카락 길이 10개(cm). 칸은 [시작, 시작 + 폭) 꼴로, 왼쪽 끝은 넣고 오른쪽 끝은 뺀다.
import math
from fractions import Fraction as F

DATA = [3, 4, 5, 5, 6, 7, 12, 13, 14, 20]
N = len(DATA)


def counts(width, origin=0, upto=24):
    """칸마다 들어간 자료 수."""
    out = []
    a = origin
    while a < upto:
        out.append(sum(1 for d in DATA if a <= d < a + width))
        a += width
    return out


def hist_density(x, width, origin=0):
    """x가 든 칸의 높이 = (칸에 든 수 / 전체 수) / 칸 폭."""
    j = math.floor((F(x) - origin) / width)
    a = origin + j * width
    k = sum(1 for d in DATA if a <= d < a + width)
    return F(k, N) / width


def main():
    assert counts(4) == [1, 5, 0, 3, 0, 1]
    assert counts(10, upto=30) == [6, 3, 1]
    c1 = counts(1)
    assert c1.count(0) == 15 and len(c1) == 24 and max(c1) == 2
    print("[OK] 칸 폭 4: 1, 5, 0, 3, 0, 1 / 폭 10: 6, 3, 1 / 폭 1: 24칸 중 15칸이 빈다")

    # 높이 = 도수 / (n × 폭). 칸 넓이의 합은 1
    heights4 = [F(c, N) / 4 for c in counts(4)]
    assert heights4 == [F(1, 40), F(1, 8), 0, F(3, 40), 0, F(1, 40)]
    for w, up in ((1, 24), (4, 24), (10, 30)):
        assert sum(F(c, N) / w * w for c in counts(w, upto=up)) == 1
    print("[OK] 폭 4의 높이 0.025, 0.125, 0, 0.075, 0, 0.025. 어느 폭에서도 넓이의 합은 1")

    # 본문의 네 물음
    assert hist_density(F(26, 5), 4) == F(1, 8)           # 5.2 → 0.125
    assert hist_density(F(79, 10), 4) == F(1, 8)          # 7.9 → 0.125
    assert hist_density(F(81, 10), 4) == 0                # 8.1 → 0
    assert hist_density(F(48, 5), 4) == 0                 # 9.6 → 0
    print("[OK] 폭 4: p(5.2) = 0.125, p(7.9) = 0.125, p(8.1) = 0, p(9.6) = 0")

    # 칸 시작점을 2만큼 밀면 같은 자료, 같은 폭인데 값이 바뀐다
    assert counts(4, origin=-2, upto=22) == [0, 4, 2, 2, 1, 1]
    assert hist_density(F(26, 5), 4, origin=-2) == F(1, 10)   # 0.1
    assert hist_density(F(79, 10), 4, origin=-2) == F(1, 20)  # 0.05
    assert hist_density(F(81, 10), 4, origin=-2) == F(1, 20)
    print("[OK] 시작점 -2: 도수 0, 4, 2, 2, 1, 1 / p(5.2) = 0.1, p(7.9) = p(8.1) = 0.05")

    # 폭에 따른 p(5.2): 1 → 0.2, 4 → 0.125, 10 → 0.06 / p(9.6): 0, 0, 0.06
    assert [hist_density(F(26, 5), w) for w in (1, 4, 10)] == [F(1, 5), F(1, 8), F(3, 50)]
    assert [hist_density(F(48, 5), w) for w in (1, 4, 10)] == [0, 0, F(3, 50)]
    print("[OK] 폭 1·4·10: p(5.2) = 0.2, 0.125, 0.06 / p(9.6) = 0, 0, 0.06")

    # 일반식 p = (k/n)/V: 확률 k/n을 폭 V로 나눈 것. 카드 C2 (자료 200개, 폭 5인 칸에 30개)
    assert F(30, 200) / 5 == F(3, 100)
    # 카드 C3: 폭 2, 시작 0에서 x = 5.2가 든 칸 [4, 6)에는 4, 5, 5 → 3개
    assert hist_density(F(26, 5), 2) == F(3, 20)
    print("[OK] 카드 C2: 0.03, 카드 C3: 0.15")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
