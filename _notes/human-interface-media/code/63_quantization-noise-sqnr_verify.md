---
layout: "note"
title: "63_quantization-noise-sqnr_verify.py"
display_title: "63_quantization-noise-sqnr_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "63"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/quantization-noise-sqnr/"
parent_title: "양자화 잡음과 SQNR"
description: "휴먼 인터페이스 미디어 · 양자화 잡음과 SQNR 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/63_quantization-noise-sqnr_verify/"
---
{% raw %}
[양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 양자화 잡음과 SQNR 문서의 계산과 주장을 확인한다.
# 실행: python3 -I 63_quantization-noise-sqnr_verify.py  (표준 라이브러리만 쓴다)
import math
import random


def quantize(x, n_bits, x_min=-1.0, x_max=1.0):
    """균일 양자화. 범위를 L = 2^n 구역으로 나누고 구역의 가운데 값으로 바꾼다.
    돌려주는 값: (구역 번호 k, 양자화 값 y). 범위 밖 값은 맨 끝 구역에 넣는다(잘림)."""
    L = 2 ** n_bits
    delta = (x_max - x_min) / L
    k = math.floor((x - x_min) / delta)
    k = min(max(k, 0), L - 1)
    return k, x_min + (k + 0.5) * delta


def sine(n_samples, amp, f_ratio=0.1234567891, phase=0.3):
    return [amp * math.sin(2 * math.pi * f_ratio * i + phase) for i in range(n_samples)]


def power(xs):
    return sum(v * v for v in xs) / len(xs)


def sqnr_db(xs, n_bits, x_min=-1.0, x_max=1.0):
    err = [quantize(v, n_bits, x_min, x_max)[1] - v for v in xs]
    return 10 * math.log10(power(xs) / power(err)), err


def db(r):
    return 10 * math.log10(r)


# 1. 예제: 표본 9개, 범위 -20 ~ 20, L = 8, nb = 3
#    C2 카드: 12.3 V -> 칸 6, 부호 110, 양자화 값 12.5 V, 오차 +0.2 V
samples = [-6.1, 7.5, 16.2, 19.7, 11.0, -5.5, -11.3, -9.4, -6.0]
x_min, x_max, L = -20.0, 20.0, 8
delta = (x_max - x_min) / L
assert delta == 5.0
assert math.log2(L) == 3
norm = [round(v / delta, 2) for v in samples]
assert norm == [-1.22, 1.50, 3.24, 3.94, 2.20, -1.10, -2.26, -1.88, -1.20]
codes, qnorm, errs, words = [], [], [], []
for v in samples:
    k, y = quantize(v, 3, x_min, x_max)
    codes.append(k)
    qnorm.append(y / delta)
    errs.append(round(y / delta - v / delta, 2))      # 오차 = 양자화 값 - 원래 값 (정규화)
    words.append(format(k, "03b"))
assert codes == [2, 5, 7, 7, 6, 2, 1, 2, 2]
assert qnorm == [-1.5, 1.5, 3.5, 3.5, 2.5, -1.5, -2.5, -1.5, -1.5]
assert words == ["010", "101", "111", "111", "110", "010", "001", "010", "010"]
printed_errs = [-0.38, 0, 0.26, -0.44, 0.30, -0.40, -0.24, 0.38, -0.30]
assert errs == [-0.28, 0.0, 0.26, -0.44, 0.30, -0.40, -0.24, 0.38, -0.30]
diff = [i for i in range(9) if abs(errs[i] - printed_errs[i]) > 1e-9]
assert diff == [0]                                       # 첫 표본만 다르다: 계산하면 -0.28 (-0.38로 적힌 표는 틀렸다)
assert max(abs(e) for e in errs) <= 0.5                 # 오차는 반 칸(0.5Δ)을 넘지 않는다
k, y = quantize(12.3, 3, x_min, x_max)
assert k == 6 and format(k, "03b") == "110" and abs(y - 12.5) < 1e-12 and abs((y - 12.3) - 0.2) < 1e-12
assert [format(k, "03b") for k in range(8)] == ["000", "001", "010", "011", "100", "101", "110", "111"]
# 실제 단위 오차: -1.5*5 - (-6.1) = -1.4 V
assert abs((-1.5 * 5 - (-6.1)) - (-1.4)) < 1e-12

# 2. 비트 수와 레벨 수 표
assert [2 ** b for b in (3, 4, 5, 8, 16)] == [8, 16, 32, 256, 65536]

# 3. 20 log10 2 = 6.02, 10 log10 1.5 = 1.76
assert abs(20 * math.log10(2) - 6.0206) < 1e-4
assert abs(10 * math.log10(1.5) - 1.7609) < 1e-4
# 최대 진폭 비: (2^(N-1) 칸) / (1/2 칸) = 2^N
for N in range(1, 25):
    assert abs(20 * math.log10(2 ** (N - 1) / 0.5) - 6.0206 * N) < 1e-3 * N
# 전력 비(꽉 찬 정현파): (A^2/2)/(Δ^2/12), A = 2^(N-1) Δ  →  1.5 * 4^N
for N in range(1, 25):
    A = 2 ** (N - 1)
    r = (A * A / 2) / (1 / 12)
    assert abs(r - 1.5 * 4 ** N) < 1e-6 * r
# 표의 값: N = 8, 16
assert round(6.0206 * 8, 1) == 48.2 and round(6.0206 * 8 + 1.7609, 1) == 49.9
assert round(6.0206 * 16, 1) == 96.3 and round(6.0206 * 16 + 1.7609, 1) == 98.1

# 4. 오차가 고르게 퍼진다는 가정: 범위 안 무작위 신호의 잡음 전력 ≈ Δ^2/12
rng = random.Random(14)
xs = [rng.uniform(-1, 1) for _ in range(200_000)]
for N in (3, 8, 12, 16):
    d = 2 / 2 ** N
    s, err = sqnr_db(xs, N)
    assert max(abs(e) for e in err) <= d / 2 + 1e-15
    assert abs(power(err) / (d * d / 12) - 1) < 0.02, (N, power(err) / (d * d / 12))
    # 범위를 고르게 채운 신호는 전력 비로 재도 6.02N dB
    assert abs(s - 6.0206 * N) < 0.1, (N, s)

# 5. 꽉 찬 정현파: 측정 SQNR ≈ 6.02N + 1.76 dB
xs = sine(200_000, 1.0)
measured = {}
for N in range(2, 17):
    s, err = sqnr_db(xs, N)
    measured[N] = s
    tol = 0.5 if N >= 5 else 1.0                  # 비트가 적으면 오차가 덜 고르게 퍼져 식과 더 벌어진다
    assert abs(s - (6.0206 * N + 1.7609)) < tol, (N, s)
# 비트 하나 더: 잡음 전력이 1/4, SQNR이 약 6 dB 오른다 (6~16비트 평균 기울기)
assert abs((measured[16] - measured[6]) / 10 - 6.02) < 0.1

# 6. 작은 신호: 진폭이 1/10이면(-20 dB) SQNR도 약 20 dB 떨어진다 (8비트)
s_full = measured[8]
s_small, _ = sqnr_db(sine(200_000, 0.1), 8)
assert abs((s_full - s_small) - 20) < 0.6, (s_full, s_small)

# 7. 가정이 깨지는 반례 (a): 한 칸 안에서만 움직이는 신호
#    가운데 값 Δ/2 근처에서 진폭 0.4Δ로 흔들리면 출력은 늘 Δ/2 하나 -> 흔들림이 모두 잡음
N = 8
d = 2 / 2 ** N
xs = [d / 2 + 0.4 * d * math.sin(2 * math.pi * 0.0123457 * i) for i in range(50_000)]
ys = [quantize(v, N)[1] for v in xs]
assert len(set(ys)) == 1
ac = [v - d / 2 for v in xs]                   # 흔들리는 부분
err = [y - v for y, v in zip(ys, xs)]
assert abs(power(err) / power(ac) - 1) < 1e-9  # 잡음 = 흔들림 전체, 흔들림 기준 SQNR 0 dB

# 7. 반례 (b): 늘 같은 값인 신호는 오차도 늘 같다. 0.3Δ 위에 있으면 오차 전력 0.09Δ^2 ≠ Δ^2/12
x0 = d / 2 + 0.3 * d
e0 = quantize(x0, N)[1] - x0
assert abs(e0 + 0.3 * d) < 1e-15 and abs(e0 * e0 / (d * d) - 0.09) < 1e-9
assert abs(1 / 12 - 0.0833) < 1e-4

# 8. 범위를 넘는 신호(과부하): 진폭 1.5배 정현파는 잘려서 오차가 반 칸을 크게 넘는다
xs = sine(50_000, 1.5)
s_over, err = sqnr_db(xs, 8)
assert max(abs(e) for e in err) > 0.49            # 반 칸(0.0039)의 100배 이상
assert s_over < 15, s_over                        # 49.9 dB에서 크게 떨어진다

# 9. 표본 값의 실제 단위 Δ와 최대 오차: 예제 Δ = 5 V이면 최대 오차 2.5 V
assert delta / 2 == 2.5

# 10. 16비트, 범위 -1 ~ 1 V: 칸 폭 30.5 μV, 최대 오차 15.3 μV, 오차의 제곱평균제곱근 Δ/√12 = 8.8 μV
d16 = 2 / 2 ** 16
assert abs(d16 * 1e6 - 30.52) < 0.01 and abs(d16 / 2 * 1e6 - 15.26) < 0.01
assert abs(d16 / math.sqrt(12) * 1e6 - 8.81) < 0.01
# 16비트에서 1/100 크기(-40 dB) 정현파는 약 58 dB
s16_quiet, _ = sqnr_db(sine(200_000, 0.01), 16)
assert abs(s16_quiet - 58.1) < 1.0, s16_quiet
# 80 dB가 필요하면: 최대 진폭 정의 14비트, 정현파 전력 정의 13비트
assert math.ceil(80 / 6.0206) == 14 and 6.0206 * 13 + 1.7609 >= 80 > 6.0206 * 12 + 1.7609
# Δ = 5일 때 잡음 전력 25/12 ≈ 2.08, 평균 크기 Δ/√12 ≈ 1.44
assert abs(25 / 12 - 2.083) < 1e-3 and abs(5 / math.sqrt(12) - 1.443) < 1e-3
# 두 정의의 차이 1.5배 = 신호 쪽 1/2 x 잡음 쪽 3
assert abs((1 / 2) * ((1 / 4) / (1 / 12)) - 1.5) < 1e-12

# 11. 대표값을 칸의 아래 끝으로 두면 오차가 -Δ ~ 0 (평균 -Δ/2), 가운데로 두면 -Δ/2 ~ Δ/2 (평균 0)
rng2 = random.Random(7)
vals = [rng2.uniform(-1, 1) for _ in range(100_000)]
d3 = 2 / 8
low = [(-1 + math.floor((v + 1) / d3) * d3) - v for v in vals]
mid = [quantize(v, 3)[1] - v for v in vals]
assert min(low) >= -d3 - 1e-12 and max(low) <= 1e-12 and abs(sum(low) / len(low) + d3 / 2) < 0.002
assert max(abs(e) for e in mid) <= d3 / 2 + 1e-12 and abs(sum(mid) / len(mid)) < 0.002
# 200칸이면 8비트
assert math.ceil(math.log2(200)) == 8


if __name__ == "__main__":
    for N in (4, 8, 12, 16):
        print(f"N={N:2d}  측정 {measured[N]:6.2f} dB  6.02N+1.76 = {6.0206 * N + 1.7609:6.2f}  6.02N = {6.0206 * N:6.2f}")
    print(f"8비트 -20 dB 정현파: {s_small:.2f} dB, 1.5배 과부하: {s_over:.2f} dB")
    print("ALL CHECKS PASSED")
```
{% endraw %}
