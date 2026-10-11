---
layout: "note"
title: "04_amdahls-law_verify.py"
display_title: "04_amdahls-law_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/amdahls-law/"
parent_title: "암달의 법칙"
description: "컴퓨터 구조 · 암달의 법칙 검증 코드"
permalink: "/studies/computer-architecture/code/04_amdahls-law_verify/"
---
{% raw %}
[암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 04.암달의 법칙: 문서의 수치와 카드 답을 확인한다.
# 실행: python3 04_amdahls-law_verify.py  (표준 라이브러리만 쓴다)
from fractions import Fraction as F
import random


def new_time(total, affected, s):
    """빨라진 뒤 시간 = 영향받는 시간 / s + 영향받지 않는 시간"""
    return F(affected) / F(s) + (F(total) - F(affected))


def speedup(p, s):
    """암달의 법칙: 전체가 빨라지는 배수 = 1 / ((1 - p) + p / s)"""
    p, s = F(p), F(s)
    return 1 / ((1 - p) + p / s)


if __name__ == "__main__":
    # 예시: 전체 120초 가운데 압축이 90초
    assert new_time(120, 90, 3) == 60 and F(120, 60) == 2
    assert speedup(F(3, 4), 3) == 2
    assert new_time(120, 90, 9) == 40 and speedup(F(3, 4), 9) == 3
    assert new_time(120, 90, 90) == 31 and abs(float(F(120, 31)) - 3.871) < 0.001
    assert 1 / (1 - F(3, 4)) == 4                       # 한계 4배
    # 3배가 되려면 s = 9, 4배는 불가능
    # 120/3 = 40 = 90/s + 30 -> s = 9.  120/4 = 30 = 90/s + 30 -> 90/s = 0
    assert F(90) / (40 - 30) == 9
    for s in (10, 100, 10**6, 10**12):
        assert speedup(F(3, 4), s) < 4
    # 식 두 가지가 같은 값이다: 시간으로 센 것과 비율로 센 것
    rnd = random.Random(7)
    for _ in range(2000):
        total = rnd.randint(1, 1000)
        aff = rnd.randint(0, total)
        s = F(rnd.randint(1, 500), rnd.randint(1, 20))
        if s < 1:
            continue
        p = F(aff, total)
        assert F(total) / new_time(total, aff, s) == speedup(p, s)
        if p < 1:
            assert speedup(p, s) <= 1 / (1 - p)         # 한계를 넘지 못한다
        assert speedup(p, s) <= s                       # 부분의 배수도 넘지 못한다
    # 작은 부분을 많이 vs 큰 부분을 조금
    assert speedup(F(1, 10), 100) == F(1000, 901)       # 1.11배
    assert speedup(F(8, 10), F(3, 2)) == F(15, 11)      # 1.36배
    assert speedup(F(8, 10), F(3, 2)) > speedup(F(1, 10), 100)
    # 코어 수: 95%를 나눠 할 수 있을 때
    assert abs(float(speedup(F(95, 100), 8)) - 5.926) < 0.001
    assert abs(float(speedup(F(95, 100), 64)) - 15.421) < 0.001
    assert 1 / (1 - F(95, 100)) == 20
    # 카드 C2: p = 0.6, s = 3
    assert speedup(F(6, 10), 3) == F(5, 3)
    # 카드 C3: 한계 1/(1-0.6) = 2.5배
    assert 1 / (1 - F(6, 10)) == F(5, 2)
    # 카드 C4: 두 군데를 한꺼번에: 50%를 2배, 30%를 3배, 나머지 20%는 그대로
    t = F(50, 100) / 2 + F(30, 100) / 3 + F(20, 100)
    assert t == F(55, 100) and 1 / t == F(20, 11)
    print("ALL CHECKS PASSED")
```
{% endraw %}
