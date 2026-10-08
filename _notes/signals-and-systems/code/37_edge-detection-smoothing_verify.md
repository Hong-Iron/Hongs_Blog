---
layout: "note"
title: "37_edge-detection-smoothing_verify.py"
display_title: "37_edge-detection-smoothing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/edge-detection-smoothing/"
parent_title: "영상의 경계 검출과 평활화"
description: "신호 및 시스템 · 영상의 경계 검출과 평활화 검증 코드"
permalink: "/studies/signals-and-systems/code/37_edge-detection-smoothing_verify/"
---
{% raw %}
[영상의 경계 검출과 평활화](/Hongs_Blog/studies/signals-and-systems/edge-detection-smoothing/) 문서의 검증 코드다.

```python
"""영상의 경계 검출과 평활화 문서: 차분 커널, 잡음에 대한 미분의 약점, '먼저 평활화', 미분 정리(d/dx(f*g) = f*dg/dx), 평균 필터, PSNR을 1차원 신호로 확인한다."""
import math, random
random.seed(7)

def conv(x, h):
    y = [0.0] * (len(x) + len(h) - 1)
    for i, a in enumerate(x):
        for j, b in enumerate(h):
            y[i + j] += a * b
    return y

# 차분 커널: [1, -1] 컨벌루션 = f(x) - f(x-1), [1, -2, 1] = f(x+1) - 2f(x) + f(x-1)
f = [k * k for k in range(10)]
d1 = conv(f, [1, -1]); d2 = conv(f, [1, -2, 1])
assert all(d1[i] == f[i] - f[i - 1] for i in range(1, 10))
assert all(d2[i + 1] == f[i + 1] - 2 * f[i] + f[i - 1] for i in range(1, 9)) and all(d2[i + 1] == 2 for i in range(1, 9))
# 잡음 있는 계단: 미분만 하면 경계를 못 찾고, 가우시안으로 평활화한 뒤 미분하면 경계(1000)에서 최대
n = 2000
sig = [(1.0 if i >= 1000 else 0.0) + random.gauss(0, 0.1) for i in range(n)]
raw = [sig[i] - sig[i - 1] for i in range(1, n)]
peak_raw = max(range(len(raw)), key=lambda i: abs(raw[i]))
sigma = 50
g = [math.exp(-(k * k) / (2 * sigma * sigma)) for k in range(-200, 201)]; s = sum(g); g = [v / s for v in g]
sm = conv(sig, g)[200:200 + n]
dsm = [sm[i] - sm[i - 1] for i in range(1, n)]
peak_sm = max(range(250, n - 250), key=lambda i: dsm[i]) + 1
assert abs(peak_sm - 1000) <= 15
noise_ratio_raw = max(abs(v) for v in raw) / abs(raw[999])
assert noise_ratio_raw > 0.4                                   # 경계의 점프가 잡음 봉우리와 크기가 비슷하다
# 미분 정리: d/dx(f*g) = f * (dg/dx)  (이산: 차분과 컨벌루션의 결합법칙)
dg = conv(g, [1, -1])
lhs = conv(conv(sig, g), [1, -1]); rhs = conv(sig, dg)
assert all(abs(u - v) < 1e-9 for u, v in zip(lhs, rhs))
# 3x3 평균 필터: 합 1, 상수 영상은 그대로
A = [[1 / 9] * 3 for _ in range(3)]
assert abs(sum(map(sum, A)) - 1) < 1e-12
img = [[5.0] * 5 for _ in range(5)]
out = sum(A[i][j] * img[1 + i][1 + j] for i in range(3) for j in range(3))
assert abs(out - 5.0) < 1e-12
# 너비 2W 상자 함수의 푸리에 변환 2 sin(ωW)/ω (ω → 0 에서 2W)
W = 1.5
box_ft = lambda w: sum(math.cos(w * (-W + (k + 0.5) * 2 * W / 20000)) for k in range(20000)) * 2 * W / 20000
for w in (0.4, 2.0):
    assert abs(box_ft(w) - 2 * math.sin(w * W) / w) < 1e-6
# PSNR = 10 log10(MAX²/MSE) = 20 log10 MAX - 10 log10 MSE
x = [random.randint(0, 255) for _ in range(1000)]; xh = [min(255, max(0, v + random.choice((-2, -1, 0, 1, 2)))) for v in x]
mse = sum((a - b) ** 2 for a, b in zip(x, xh)) / len(x)
psnr = 10 * math.log10(255 ** 2 / mse)
assert abs(psnr - (20 * math.log10(255) - 10 * math.log10(mse))) < 1e-9 and psnr > 40
print("ALL CHECKS PASSED")
```
{% endraw %}
