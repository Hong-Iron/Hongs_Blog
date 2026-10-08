---
layout: "note"
title: "05_independent-variable-transform_verify.py"
display_title: "05_independent-variable-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/independent-variable-transform/"
parent_title: "독립 변수의 변환"
description: "신호 및 시스템 · 독립 변수의 변환 검증 코드"
permalink: "/studies/signals-and-systems/code/05_independent-variable-transform_verify/"
---
{% raw %}
[독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/) 문서의 검증 코드다.

```python
"""독립 변수의 변환 문서의 예제 1.1~1.3(그림 1.13)을 점마다 확인한다."""
from fractions import Fraction as F

def x(t):                     # 그림 1.13(a): 0~1에서 1, 1~2에서 1→0으로 내려가는 경사, 나머지 0
    if 0 <= t <= 1: return F(1)
    if 1 < t <= 2: return 2 - t
    return F(0)

pts = [F(k, 12) for k in range(-36, 37)]
# x(t+1): 왼쪽으로 1 이동 -> -1~0에서 1, 0~1에서 경사
a = lambda t: x(t + 1)
assert a(F(-1)) == 1 and a(F(0)) == 1 and a(F(1, 2)) == F(1, 2) and a(F(1)) == 0
# x(-t+1): 반전 -> 0~1에서 1, -1~0에서 0→1로 올라가는 경사
b = lambda t: x(-t + 1)
assert b(F(0)) == 1 and b(F(1)) == 1 and b(F(-1, 2)) == F(1, 2) and b(F(-1)) == 0 and b(F(3, 2)) == 0
# x(3/2 t + 1): -2/3~0에서 1, 0~2/3에서 경사
c = lambda t: x(F(3, 2) * t + 1)
assert c(F(-2, 3)) == 1 and c(F(0)) == 1 and c(F(1, 3)) == F(1, 2) and c(F(2, 3)) == 0 and c(F(-1)) == 0
# 순서 1: 먼저 이동 v(t) = x(t+1), 그다음 척도 v(3/2 t)
v = lambda t: x(t + 1)
assert all(v(F(3, 2) * t) == c(t) for t in pts)
# 순서 2: 먼저 척도 w(t) = x(3/2 t), 그다음 2/3만큼 이동 w(t + 2/3)
w = lambda t: x(F(3, 2) * t)
assert all(w(t + F(2, 3)) == c(t) for t in pts)
# 흔한 실수: 척도 뒤에 1만큼 이동하면 다른 신호가 된다
assert any(w(t + 1) != c(t) for t in pts)
# 일반형 x(αt+β): 0이 아닌 구간 [0,2]가 [(0-β)/α, (2-β)/α]로 옮겨진다
for al, be in [(F(3, 2), F(1)), (F(-1), F(1)), (F(2), F(-3)), (F(1, 2), F(0))]:
    lo, hi = sorted([(0 - be) / al, (2 - be) / al])
    nz = [t for t in pts if x(al * t + be) != 0]
    assert all(lo <= t <= hi for t in nz)
print("ALL CHECKS PASSED")
```
{% endraw %}
