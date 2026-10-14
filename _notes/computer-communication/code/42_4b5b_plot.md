---
layout: "note"
title: "42_4b5b_plot.py"
display_title: "42_4b5b_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "42"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/4b5b/"
parent_title: "4B/5B"
description: "컴퓨터 통신 · 4B/5B 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/42_4b5b_plot/"
---
{% raw %}
[4B/5B](/Hongs_Blog/studies/computer-communication/4b5b/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 4B/5B 문서의 그림을 만든다: 42_4b5b_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 42_4b5b_plot.py  (matplotlib, numpy 필요)
#   fig1: 0010 -> 10100, 0001 -> 01001을 이어 붙였을 때 부호 경계에 걸친 0 세 개와 NRZI의 가장 긴 평평한 구간
#   fig2: 데이터 1011 0000을 그냥 NRZI로 보낼 때와 4B/5B 부호로 바꿔 NRZI로 보낼 때 (같은 시간축)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "42_4b5b"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 11, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


# ---- 파형 공통 도구 (40~43 인코딩 그림 코드에 같은 것을 복사해 쓴다) ----
H = 0.7          # 파형 높이 (낮음 = y0, 높음 = y0 + H)
LW = 1.8         # 파형 선 굵기
HL = C[1]        # 볼 곳(평평한 구간, 바뀌는 순간)을 칠하는 색


def draw_wave(ax, halves, y0, color, x0=0.0, unit=1.0):
    """반 칸 높이 목록(0 낮음, 1 높음)을 계단 파형으로. 칸 폭 unit, 반 칸 폭 unit/2."""
    xs = [x0 + i * unit / 2 for i in range(len(halves) + 1)]
    ys = [y0 + H * v for v in list(halves) + [halves[-1]]]
    ax.step(xs, ys, where="post", color=color, lw=LW, solid_joinstyle="miter")


def draw_grid(ax, n, y_lo, y_hi, x0=0.0, unit=1.0, mid=False, mid_hi=None):
    """칸 경계는 옅은 점선, mid=True면 칸 한가운데에 더 옅은 안내선(위끝 mid_hi, 비트 글자를 피한다)."""
    for k in range(n + 1):
        ax.plot([x0 + k * unit] * 2, [y_lo, y_hi], color=INK, lw=0.6, ls=(0, (1, 2)), zorder=0)
    if mid:
        top = y_hi if mid_hi is None else mid_hi
        for k in range(n):
            ax.plot([x0 + (k + 0.5) * unit] * 2, [y_lo, top], color=INK, lw=0.5, alpha=0.35, zorder=0)


def write_bits(ax, bits, y, color=INK, x0=0.0, unit=1.0, size=10, weight="normal"):
    for k, b in enumerate(bits):
        ax.text(x0 + (k + 0.5) * unit, y, b, ha="center", va="center", fontsize=size, color=color,
                fontweight=weight)


def row_label(ax, text, y, color=INK, x=-0.3, size=10):
    ax.text(x, y, text, ha="right", va="center", fontsize=size, color=color)


def shade(ax, xa, xb, y_lo, y_hi, color=HL, alpha=0.16):
    ax.add_patch(Rectangle((xa, y_lo), xb - xa, y_hi - y_lo, facecolor=color, edgecolor="none",
                           alpha=alpha, zorder=0.5))


def change_points(halves):
    """높이가 바뀌는 반 칸 번호 i (i번째 반 칸의 시작에서 바뀐다)."""
    return [i for i in range(1, len(halves)) if halves[i] != halves[i - 1]]


def flat_runs(halves):
    """(시작 반 칸, 길이) 목록. 높이가 그대로인 덩어리."""
    runs, start = [], 0
    for i in range(1, len(halves) + 1):
        if i == len(halves) or halves[i] != halves[i - 1]:
            runs.append((start, i - start))
            start = i
    return runs
# ---- 공통 도구 끝 ----


# ---- 4B/5B 표 (슬라이드 40)와 NRZI 규칙 (슬라이드 38) ----
TABLE = {
    "0000": "11110", "0001": "01001", "0010": "10100", "0011": "10101",
    "0100": "01010", "0101": "01011", "0110": "01110", "0111": "01111",
    "1000": "10010", "1001": "10011", "1010": "10110", "1011": "10111",
    "1100": "11010", "1101": "11011", "1110": "11100", "1111": "11101",
}


def encode(bits):
    return "".join(TABLE[bits[i:i + 4]] for i in range(0, len(bits), 4))


def nrzi(bits, start=0):
    level, out = start, []
    for b in bits:
        out.append(level)
        if b == "1":
            level ^= 1
        out.append(level)
    return out


def lead0(c):
    return len(c) - len(c.lstrip("0"))


def trail0(c):
    return len(c) - len(c.rstrip("0"))


def max_zero_run(s):
    best = run = 0
    for ch in s:
        run = run + 1 if ch == "0" else 0
        best = max(best, run)
    return best


def zero_runs(s):
    """(시작, 길이) 목록. 0이 이어지는 덩어리."""
    out, i = [], 0
    while i < len(s):
        if s[i] == "0":
            j = i
            while j < len(s) and s[j] == "0":
                j += 1
            out.append((i, j - i))
            i = j
        else:
            i += 1
    return out


def longest(halves):
    best = max(n for s, n in flat_runs(halves))
    return [(s, n) for s, n in flat_runs(halves) if n == best]


# ---- 그림 1: 10100 다음 01001. 경계에 걸친 0 세 개와 NRZI의 가장 긴 평평한 구간 ----
D1 = "00100001"
CODE1 = encode(D1)
NZ1 = nrzi(CODE1)
(z0, zn), = [r for r in zero_runs(CODE1) if r[1] == max_zero_run(CODE1)]
(f0, fn), = longest(NZ1)

fig, ax = plt.subplots(figsize=(6.6, 3.5))
ax.axis("off")
YB, YW = 2.25, 0.55                         # 부호 비트 줄, NRZI 파형 바닥
draw_grid(ax, 10, YB - 0.3, YB + 0.3)
draw_grid(ax, 10, YW - 0.15, YW + H + 0.15)
shade(ax, z0, z0 + zn, YB - 0.28, YB + 0.28, alpha=0.22)
write_bits(ax, CODE1, YB, size=11)
row_label(ax, "부호 비트", YB)
for k, d in enumerate([D1[:4], D1[4:]]):
    x0 = 5 * k
    ax.annotate("", (x0 + 0.1, YB + 0.45), (x0 + 4.9, YB + 0.45),
                arrowprops=dict(arrowstyle="-", color=INK, lw=0.8))
    ax.text(x0 + 2.5, YB + 0.68, f"데이터 {d} → 부호 {CODE1[5 * k:5 * k + 5]}", ha="center", va="center",
            fontsize=9.5)
ax.plot([5, 5], [YB - 0.3, YB + 0.55], color=INK, lw=1.2)
ax.plot([5, 5], [YW - 0.15, YW + H + 0.15], color=INK, lw=1.2)
ax.text(5, YB + 0.95, "부호 경계", ha="center", va="center", fontsize=8.5)
ax.text(z0 + zn / 2, (YB - 0.3 + YW + H + 0.15) / 2, f"부호 경계에 걸친 0 {zn}개 (앞 부호 끝 2개 + 뒤 부호 앞 1개)",
        ha="center", va="center", fontsize=9, color=HL)
draw_wave(ax, NZ1, YW, C[3])
row_label(ax, "NRZI\n(처음 낮음)", YW + H / 2, color=C[3])
shade(ax, f0 / 2, (f0 + fn) / 2, YW - 0.12, YW + H + 0.12, alpha=0.16)
yd = YW - 0.4
for xa, xb, t in ((f0 / 2, z0, "반 칸"), (z0, z0 + zn, f"0 {zn}개"), (z0 + zn, (f0 + fn) / 2, "반 칸")):
    ax.annotate("", (xa, yd), (xb, yd), arrowprops=dict(arrowstyle="<->", color=HL, lw=0.9,
                                                        shrinkA=0, shrinkB=0))
    ax.text((xa + xb) / 2, yd - 0.22, t, ha="center", va="center", fontsize=8.5, color=HL)
ax.text((f0 + fn) / 4, yd - 0.55, f"신호가 바뀌지 않는 가장 긴 구간: {fn / 2:g}비트 폭", ha="center",
        va="center", fontsize=9.5, color=HL)
ax.set_xlim(-1.6, 10.1)
ax.set_ylim(yd - 0.75, YB + 1.05)
save(fig, 1)

# ---- 그림 2: 데이터 1011 0000을 그냥 NRZI로 보낼 때와 4B/5B로 바꿔 NRZI로 보낼 때 ----
D2 = "10110000"
CODE2 = encode(D2)
PLAIN = nrzi(D2)
CODED = nrzi(CODE2)
U = len(D2) / len(CODE2)                    # 부호 비트 하나의 폭 = 데이터 비트 0.8개
fig, ax = plt.subplots(figsize=(6.8, 3.7))
ax.axis("off")
YA, YC = 2.05, 0.0
draw_grid(ax, len(D2), YA - 0.15, YA + H + 0.5)
write_bits(ax, D2, YA + H + 0.32, color=C[3])
row_label(ax, "데이터", YA + H + 0.32, color=C[3], size=9)
draw_wave(ax, PLAIN, YA, C[3])
row_label(ax, "데이터를\n그냥 NRZI로", YA + H / 2, color=C[3])
draw_grid(ax, len(CODE2), YC - 0.15, YC + H + 0.5, unit=U)
write_bits(ax, CODE2, YC + H + 0.32, color=C[4], unit=U, size=9.5)
row_label(ax, "부호", YC + H + 0.32, color=C[4], size=9)
draw_wave(ax, CODED, YC, C[4], unit=U)
row_label(ax, "4B/5B 부호를\nNRZI로", YC + H / 2, color=C[4])
for lv, y0, u, col in ((PLAIN, YA, 1.0, C[3]), (CODED, YC, U, C[4])):
    for i in change_points(lv):
        ax.plot([i * u / 2], [y0 + H / 2], "o", ms=4.5, color=HL, zorder=5)
    for s, n in longest(lv):
        shade(ax, s * u / 2, (s + n) * u / 2, y0 - 0.12, y0 + H + 0.12)
(sa, na), = longest(PLAIN)
ax.text((sa + na) / 4, YA - 0.38, f"0000 동안 평평: {na / 2:g}비트 폭 (끝난 뒤에도 1이 올 때까지 이어진다)",
        ha="center", va="center", fontsize=9, color=HL)
(sc, nc), = longest(CODED)
ax.text((sc + nc / 2) * U / 2, YC - 0.38, f"가장 긴 평평: 부호 비트 {nc / 2:g}개 폭", ha="center",
        va="center", fontsize=9, color=HL)
ax.text(8.15, YA + H / 2, f"변화 {len(change_points(PLAIN))}번", ha="left", va="center", fontsize=9,
        color=C[3])
ax.text(8.15, YC + H / 2, f"변화 {len(change_points(CODED))}번", ha="left", va="center", fontsize=9,
        color=C[4])
ax.annotate("", (0, YC - 0.8), (8, YC - 0.8), arrowprops=dict(arrowstyle="<->", color=INK, lw=0.8,
                                                              shrinkA=0, shrinkB=0))
ax.text(4, YC - 1.0, "같은 시간: 데이터 8비트 = 부호 10비트 (부호 비트 하나는 데이터 비트 0.8개 폭)",
        ha="center", va="center", fontsize=9)
ax.set_xlim(-1.9, 8.1)
ax.set_ylim(YC - 1.2, YA + H + 0.55)
save(fig, 2)


if __name__ == "__main__":
    codes = list(TABLE.values())
    # 그림 1: 0010 -> 10100, 0001 -> 01001, 이어 붙이면 1010001001, 0 세 개가 경계(4~6번째 비트)에 걸친다
    assert CODE1 == "1010001001" and (z0, zn) == (3, 3) and z0 < 5 < z0 + zn
    assert trail0(TABLE["0010"]) == 2 and lead0(TABLE["0001"]) == 1
    # NRZI(처음 낮음)의 가장 긴 평평한 구간: 반 칸 8개 = 4비트 폭, 3번째 칸 뒤 절반부터 7번째 칸 앞 절반까지
    assert NZ1 == [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0]
    assert (f0, fn) == (5, 8) and f0 / 2 == 2.5 and (f0 + fn) / 2 == 6.5
    # 0이 z개 이어지면(양옆이 1) NRZI 평평한 길이는 z + 1비트 폭. 어떤 두 부호를 이어도 가장 긴 평평은 4비트 폭
    for z in range(0, 6):
        lv = nrzi("1" + "0" * z + "1")
        assert max(n for s, n in flat_runs(lv)) == max(2, 2 * z + 2)
    assert max(max(n for s, n in flat_runs(nrzi(a + b))) for a in TABLE.values() for b in TABLE.values()) == 8
    # 표의 16개 부호: 앞 0 <= 1, 뒤 0 <= 2, 안쪽 0 연속 <= 2, 모두 1을 품는다
    assert all(lead0(c) <= 1 and trail0(c) <= 2 and max_zero_run(c) <= 2 and "1" in c for c in codes)
    assert max(max_zero_run(a + b) for a in codes for b in codes) == 3
    # 21가지 세기: 앞 0 개수(0 또는 1) x 뒤 0 개수(0, 1, 2)로 나눠 센다
    def count(lead, trail):
        return sum(1 for x in range(32) for c in [format(x, "05b")] if lead0(c) == lead and trail0(c) == trail)
    table_count = {(l, t): count(l, t) for l in (0, 1) for t in (0, 1, 2)}
    assert table_count == {(0, 0): 8, (0, 1): 4, (0, 2): 2, (1, 0): 4, (1, 1): 2, (1, 2): 1}
    assert sum(table_count.values()) == 21
    ok = [format(x, "05b") for x in range(32) if lead0(format(x, "05b")) <= 1 and trail0(format(x, "05b")) <= 2]
    assert len(ok) == 21 and set(codes) <= set(ok)
    assert sorted(set(ok) - set(codes)) == ["01100", "01101", "10001", "11001", "11111"]
    # 효율: 100 Mbps 데이터는 초당 125 M 부호 비트
    assert 100 * 5 / 4 == 125 and 4 / 5 == 0.8
    # 그림 2: 1011 0000 -> 10111 11110, NRZI(처음 낮음) 그림 문자열은 실행 추적 표와 같다
    assert CODE2 == "1011111110"
    assert "".join("‾" if x else "_" for x in CODED) == "_‾‾‾‾__‾‾__‾‾__‾‾___"
    assert longest(PLAIN) == [(7, 9)]            # 1의 뒤 절반 + 0 네 개 = 반 칸 9개 = 4.5비트 폭
    assert longest(CODED) == [(1, 4)]            # 반 칸 4개 = 부호 비트 2개 폭
    assert max_zero_run(CODE2) == 1 and CODE2[2:9] == "1" * 7      # 3번째 부호 비트부터 1이 일곱 개
    assert len(change_points(PLAIN)) == 3 and len(change_points(CODED)) == 8
    # 카드 C2의 데이터(0000 0000)는 그리지 않는다
    assert "00000000" not in (D1, D2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
