---
layout: "note"
title: "36_frequency-filters_verify.py"
display_title: "36_frequency-filters_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/frequency-filters/"
parent_title: "주파수 형성 필터와 주파수 선택 필터"
description: "신호 및 시스템 · 주파수 형성 필터와 주파수 선택 필터 검증 코드"
permalink: "/studies/signals-and-systems/code/36_frequency-filters_verify/"
---
{% raw %}
[주파수 형성 필터와 주파수 선택 필터](/Hongs_Blog/studies/signals-and-systems/frequency-filters/) 문서의 검증 코드다.

```python
"""주파수 형성 필터와 주파수 선택 필터 문서: 미분기, RC 저역·고역 통과, 1차 재귀 필터, 이동 평균, 단순 고역 통과 필터의 주파수 응답과 계단 응답 값을 확인한다."""
import cmath, math
close = lambda u, v, e=1e-9: abs(u - v) < e

# 미분기 H(jω) = jω: cos kω0t -> kω0 cos(kω0t + π/2)
for w in (1.0, 3.0):
    assert close(abs(1j * w), w) and close(cmath.phase(1j * w), math.pi / 2)
    assert close(-w * math.sin(w * 0.4), w * math.cos(w * 0.4 + math.pi / 2))
# RC 저역 통과 H = 1/(1 + jωRC): |H| = 1/sqrt(1+(RCω)²), ∠H = -atan(RCω)
RC = 0.5
for w in (0.0, 1 / RC, 10.0):
    Hl = 1 / (1 + 1j * w * RC)
    assert close(abs(Hl), 1 / math.sqrt(1 + (RC * w) ** 2)) and close(cmath.phase(Hl), -math.atan(RC * w))
    assert close(abs(Hl), math.sqrt(1 + (RC * w) ** 2) / (1 + (RC * w) ** 2))
    Gh = 1j * w * RC / (1 + 1j * w * RC)
    assert close(Hl + Gh, 1)                                             # v_c + v_r = v_s
    if w > 0:
        assert close(cmath.phase(Gh), math.atan(1 / (RC * w)))
assert close(abs(1 / (1 + 1j)), 1 / math.sqrt(2)) and close(20 * math.log10(1 / math.sqrt(2)), -3.0103, 1e-4)
# RC 계단 응답 s(t) = 1 - e^{-t/RC}: t = RC에서 1 - 1/e, 고역 통과 v_r = e^{-t/RC}
assert close(1 - math.exp(-1), 0.6321205588)
# 1차 재귀 y[n] - a y[n-1] = x[n]: |H(e^{j0})| = 1/(1-a), |H(e^{jπ})| = 1/(1+a)
for a in (0.6, -0.6):
    H = lambda w: 1 / (1 - a * cmath.exp(-1j * w))
    assert close(abs(H(0)), 1 / (1 - a)) and close(abs(H(math.pi)), 1 / (1 + a))
assert close(1 / (1 - 0.6), 2.5) and close(1 / 1.6, 0.625)
# 계단 응답 s[n] = (1 - a^{n+1})/(1 - a): a = 0.9 -> s_20 = 8.906, a = 0.1 -> s_5 = 1.11111
s = lambda a, n: (1 - a ** (n + 1)) / (1 - a)
assert abs(s(0.9, 20) - 8.906) < 1e-3 and abs(s(0.1, 5) - 1.11111) < 1e-5 and close(s(0.9, 0), 1)
# 2점 이동 평균 H = e^{-jω/2} cos(ω/2): H(1) = 1, H(e^{jπ}) = 0
H2 = lambda w: 0.5 * (1 + cmath.exp(-1j * w))
for w in (0.0, 1.0, 2.5, math.pi):
    assert close(H2(w), cmath.exp(-0.5j * w) * math.cos(w / 2))
assert close(H2(math.pi), 0)
# 3점 이동 평균 H = (1 + 2cosω)/3: 0이 되는 곳 ω = 2π/3
H3 = lambda w: sum(cmath.exp(-1j * w * k) for k in (-1, 0, 1)) / 3
for w in (0.0, 1.0, math.pi / 2, math.pi):
    assert close(H3(w), (1 + 2 * math.cos(w)) / 3)
assert close(H3(2 * math.pi / 3), 0) and close(H3(math.pi / 2), 1 / 3)
# 일반 이동 평균 (N+M+1점): 닫힌 꼴과 일치
for Nn, Mm in ((16, 16), (2, 5)):
    for w in (0.3, 1.1):
        direct = sum(cmath.exp(-1j * w * k) for k in range(-Nn, Mm + 1)) / (Nn + Mm + 1)
        closed = cmath.exp(1j * w * (Nn - Mm) / 2) * math.sin(w * (Mm + Nn + 1) / 2) / ((Nn + Mm + 1) * math.sin(w / 2))
        assert close(direct, closed)
# 단순 고역 통과 y = (x[n] - x[n-1])/2: H = j e^{-jω/2} sin(ω/2)
for w in (0.0, 1.0, math.pi):
    assert close(0.5 * (1 - cmath.exp(-1j * w)), 1j * cmath.exp(-0.5j * w) * math.sin(w / 2))
print("ALL CHECKS PASSED")
```
{% endraw %}
