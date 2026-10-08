---
layout: "note"
title: "09_dt-period-ladder_p4.py"
display_title: "09_dt-period-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "09"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/dt-period-ladder/"
parent_title: "이산 신호 주기 예제 사다리"
description: "신호 및 시스템 · 이산 신호 주기 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/signals-and-systems/code/09_dt-period-ladder_p4/"
---
{% raw %}
[이산 신호 주기 예제 사다리](/Hongs_Blog/studies/signals-and-systems/dt-period-ladder/) 문서의 문제 4 풀이 코드다.

```python
"""이산 신호 주기 예제 사다리 문제 2~4: 공식으로 구한 주기와 직접 찾은 가장 작은 주기가 같은지 확인한다."""
import cmath, math

def smallest_period(x, limit=400, span=500):
    for N in range(1, limit):
        if all(abs(x(n + N) - x(n)) < 1e-8 for n in range(span)):
            return N
    return None

p = math.pi
assert smallest_period(lambda n: math.cos(p * n / 4) + math.sin(p * n / 6)) == 24            # 문제 2
assert smallest_period(lambda n: math.cos(30 * p * n / 8) + cmath.exp(1j * 300 * p / 8 * n)) == 8   # 문제 3
assert smallest_period(lambda n: math.cos(8 * p * n / 31) + math.cos(p * n / 2)) == 124      # 문제 4(가)
assert smallest_period(lambda n: math.cos(n / 6) + math.cos(p * n)) is None                   # 문제 4(나)
assert math.lcm(8, 12) == 24 and math.lcm(8, 4) == 8 and math.lcm(31, 4) == 124
print("ALL CHECKS PASSED")
```
{% endraw %}
