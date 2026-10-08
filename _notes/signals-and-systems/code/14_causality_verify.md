---
layout: "note"
title: "14_causality_verify.py"
display_title: "14_causality_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/causality/"
parent_title: "인과성"
description: "신호 및 시스템 · 인과성 검증 코드"
permalink: "/studies/signals-and-systems/code/14_causality_verify/"
---
{% raw %}
[인과성](/Hongs_Blog/studies/signals-and-systems/causality/) 문서의 검증 코드다.

```python
"""인과성 문서: 미래 입력만 다른 두 입력을 넣어 출력이 지금까지 같은지로 인과성을 판정한다 (예제 1.12와 본문 예)."""
import math, random
random.seed(3)
R = range(-30, 31)

def causal(S, trials=30):
    """n0 이전까지 같은 두 입력이 n0 이전까지 같은 출력을 내는가 (반례가 하나라도 있으면 비인과)."""
    for _ in range(trials):
        n0 = random.randint(-10, 10)
        a = {n: random.uniform(-1, 1) for n in range(-60, 61)}
        b = dict(a)
        for n in range(n0 + 1, 61): b[n] = random.uniform(-1, 1)   # n0 뒤(미래)만 바꾼다
        xa, xb = (lambda n, d=a: d.get(n, 0.0)), (lambda n, d=b: d.get(n, 0.0))
        if any(abs(S(xa, n) - S(xb, n)) > 1e-12 for n in range(-20, n0 + 1)):
            return False
    return True

acc   = lambda x, n: sum(x(k) for k in range(-60, n + 1))       # 누산기
delay = lambda x, n: x(n - 1)
sq    = lambda x, n: (2 * x(n) - x(n) ** 2) ** 2                  # 기억 없는 시스템
diff  = lambda x, n: x(n) - x(n + 1)
rev   = lambda x, n: x(-n)                                        # 예제 1.12-1
mod   = lambda x, n: x(n) * math.cos(n + 1)                        # 예제 1.12-2 (이산 버전)
M = 2
avg   = lambda x, n: sum(x(n - k) for k in range(-M, M + 1)) / (2 * M + 1)
assert causal(acc) and causal(delay) and causal(sq) and causal(mod)
assert not causal(diff) and not causal(rev) and not causal(avg)
# y[n] = x[-n]: n = -4에서 출력이 미래 입력 x[4]로 정해진다
x = lambda n: 7.0 if n == 4 else 0.0
assert rev(x, -4) == 7.0
print("ALL CHECKS PASSED")
```
{% endraw %}
