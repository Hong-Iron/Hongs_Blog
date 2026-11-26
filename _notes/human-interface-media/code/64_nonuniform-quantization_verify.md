---
layout: "note"
title: "64_nonuniform-quantization_verify.py"
display_title: "64_nonuniform-quantization_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "64"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/nonuniform-quantization/"
parent_title: "비균일 양자화"
description: "휴먼 인터페이스 미디어 · 비균일 양자화 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/64_nonuniform-quantization_verify/"
---
{% raw %}
[비균일 양자화](/Hongs_Blog/studies/human-interface-media/nonuniform-quantization/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 비균일 양자화 문서의 계산과 주장을 확인한다.
# 실행: python3 -I 64_nonuniform-quantization_verify.py  (표준 라이브러리만 쓴다)
import math

MU = 255.0
A = 87.6


def mu_compress(x):
    """μ 법칙 압축기. 입력 x는 -1 ~ 1."""
    return math.copysign(math.log1p(MU * abs(x)) / math.log1p(MU), x)


def mu_expand(y):
    """μ 법칙 신장기. 압축기의 역함수."""
    return math.copysign(((1 + MU) ** abs(y) - 1) / MU, y)


def a_compress(x):
    """A 법칙 압축기. 작은 입력(|x| < 1/A)은 직선, 나머지는 로그."""
    a = abs(x)
    c = 1 + math.log(A)
    y = A * a / c if a < 1 / A else (1 + math.log(A * a)) / c
    return math.copysign(y, x)


def a_expand(y):
    b = abs(y)
    c = 1 + math.log(A)
    x = b * c / A if b < 1 / c else math.exp(b * c - 1) / A
    return math.copysign(x, y)


def uniform_q(x, n_bits):
    """-1 ~ 1 범위의 균일 양자화. 구역 가운데 값으로 바꾸고, 범위 밖은 잘라 넣는다."""
    L = 2 ** n_bits
    d = 2 / L
    k = min(max(math.floor((x + 1) / d), 0), L - 1)
    return -1 + (k + 0.5) * d


def mu_q(x, n_bits):
    return mu_expand(uniform_q(mu_compress(x), n_bits))


def a_q(x, n_bits):
    return a_expand(uniform_q(a_compress(x), n_bits))


BASE = [math.sin(2 * math.pi * 0.1234567891 * i + 0.3) for i in range(100_000)]


def sqnr(level_db, qfun, n_bits=8):
    amp = 10 ** (level_db / 20)
    xs = [amp * v for v in BASE]
    ps = sum(v * v for v in xs) / len(xs)
    pe = sum((qfun(v, n_bits) - v) ** 2 for v in xs) / len(xs)
    return 10 * math.log10(ps / pe)


# 1. 압축기와 신장기는 서로 역함수다
for i in range(-1000, 1001):
    x = i / 1000
    assert abs(mu_expand(mu_compress(x)) - x) < 1e-12
    assert abs(a_expand(a_compress(x)) - x) < 1e-12
# 끝점: 0 -> 0, 1 -> 1
assert mu_compress(0) == 0 and abs(mu_compress(1) - 1) < 1e-15
assert abs(a_compress(1) - 1) < 1e-15
# A 법칙은 |x| = 1/A에서 두 식이 이어진다
c = 1 + math.log(A)
assert abs(A * (1 / A) / c - (1 + math.log(1)) / c) < 1e-15
assert abs(1 / c - 0.1827) < 1e-4

# 2. μ 법칙의 기울기: 0 근처 μ/ln(1+μ) ≈ 46.0, 1 근처 μ/((1+μ)ln(1+μ)) ≈ 0.180, 비는 1+μ = 256
s0 = MU / math.log1p(MU)
s1 = MU / ((1 + MU) * math.log1p(MU))
assert abs(s0 - 45.99) < 0.01 and abs(s1 - 0.1796) < 1e-4
assert abs(s0 / s1 - 256) < 1e-9

# 3. 8비트에서 계단 폭: 균일 2/256 = 0.0078. μ 법칙의 가장 작은 계단과 가장 큰 계단(실제 경계로 계산)
L = 256
edges = [mu_expand(-1 + k * 2 / L) for k in range(L + 1)]   # 압축된 축의 균일 경계를 원래 축으로
widths = [edges[k + 1] - edges[k] for k in range(L)]
w_min, w_max = min(widths), max(widths)
assert abs(2 / L - 0.0078125) < 1e-12
assert abs(w_min - 0.000174) < 0.000001, w_min       # 0 바로 옆 계단 (균일 계단의 약 1/45)
assert abs(w_max - 0.04255) < 0.00002, w_max          # 끝 계단 (균일 계단의 약 5.4배)
assert abs(w_max / w_min - 245) < 1                   # 실제 계단끼리의 비. 기울기 비 256보다 조금 작다
assert abs((2 / L) / w_min - 45) < 0.1 and abs(w_max / (2 / L) - 5.45) < 0.01
# 가장 작은 μ 법칙 칸은 균일 13비트(0.000244)와 14비트(0.000122) 칸 사이
assert 2 / 2 ** 14 < w_min < 2 / 2 ** 13

# 4. 작은 입력 0.01(-40 dB)
y = mu_compress(0.01)
assert abs(y - 0.2285) < 1e-4
# 양수 쪽 128칸 중 몇 번째 칸인가: 균일은 0.01 / (1/128) = 1.28 -> 2번째 칸, μ 법칙은 0.2285 * 128 = 29.2 -> 30번째 칸
assert math.floor(0.01 * 128) + 1 == 2
assert math.floor(y * 128) + 1 == 30

# 5. SQNR 비교 (8비트, 정현파, 크기는 꽉 찬 진폭 기준 dB)
table = {}
for lv in (0, -10, -20, -30, -40, -50):
    table[lv] = (sqnr(lv, uniform_q), sqnr(lv, mu_q), sqnr(lv, a_q))
u0, m0, a0 = table[0]
assert abs(u0 - 49.9) < 0.3                  # 균일: 6.02*8 + 1.76
assert 37 < m0 < 38.5 and 37 < a0 < 38.5     # μ, A 법칙: 꽉 찬 신호에서는 균일보다 12 dB쯤 낮다
# 균일은 신호가 10 dB 작아질 때마다 약 10 dB씩 떨어진다
for lv in (-10, -20, -30, -40):
    assert abs((table[0][0] - table[lv][0]) - (-lv)) < 1.5
# μ 법칙은 0 ~ -30 dB에서 36.5 ~ 39 dB로 거의 그대로
for lv in (0, -10, -20, -30):
    assert 36.5 < table[lv][1] < 39, (lv, table[lv][1])
# -40 dB에서 균일 약 9 dB, μ 법칙 약 34 dB
assert abs(table[-40][0] - 9.3) < 1.0 and abs(table[-40][1] - 34.1) < 1.0
# 교차점: -12 dB 근처
cross = None
for lv10 in range(0, -400, -5):
    lv = lv10 / 10
    if sqnr(lv, mu_q) > sqnr(lv, uniform_q):
        cross = lv
        break
assert -13.5 <= cross <= -10.5, cross

# 6. 근사식 6.02N + 4.77 - 20 log10(ln(1+μ)) ≈ 38.1 dB (N = 8)
approx = 6.0206 * 8 + 4.771 - 20 * math.log10(math.log1p(MU))
assert abs(approx - 38.06) < 0.02
assert abs(approx - m0) < 1.0

if __name__ == "__main__":
    for lv, (u, m, a) in table.items():
        print(f"{lv:4d} dB  균일 {u:6.2f}  μ 법칙 {m:6.2f}  A 법칙 {a:6.2f}")
    print(f"교차점 약 {cross} dB, 계단 폭 최소 {w_min:.6f} 최대 {w_max:.4f} 비 {w_max / w_min:.0f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
