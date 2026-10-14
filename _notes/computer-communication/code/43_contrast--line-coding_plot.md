---
layout: "note"
title: "43_contrast--line-coding_plot.py"
display_title: "43_contrast--line-coding_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/contrast--line-coding/"
parent_title: "인코딩 방식 비교"
description: "컴퓨터 통신 · 인코딩 방식 비교 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/43_contrast--line-coding_plot/"
---
{% raw %}
[인코딩 방식 비교](/Hongs_Blog/studies/computer-communication/contrast--line-coding/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 인코딩 방식 비교 문서의 그림을 만든다: 43_contrast--line-coding_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 43_contrast--line-coding_plot.py  (matplotlib, numpy 필요)
#   fig1: 데이터 1000 0011 1110을 NRZ, NRZI, 맨체스터, 4B/5B + NRZI로 같은 시간축에 그리고
#         줄마다 신호가 바뀌지 않는 가장 긴 구간을 칠한다. 4B/5B 부호 비트 하나는 데이터 비트 0.8개 폭이다
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "43_contrast--line-coding"
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


# ---- 인코딩 규칙 (슬라이드 35·38·40) ----
TABLE = {
    "0000": "11110", "0001": "01001", "0010": "10100", "0011": "10101",
    "0100": "01010", "0101": "01011", "0110": "01110", "0111": "01111",
    "1000": "10010", "1001": "10011", "1010": "10110", "1011": "10111",
    "1100": "11010", "1101": "11011", "1110": "11100", "1111": "11101",
}


def nrz(bits):
    return [int(b) for b in bits for _ in range(2)]


def nrzi(bits, start=0):
    level, out = start, []
    for b in bits:
        out.append(level)
        if b == "1":
            level ^= 1
        out.append(level)
    return out


def manchester(bits):
    return [int(b) ^ c for b in bits for c in (0, 1)]


def encode(bits):
    return "".join(TABLE[bits[i:i + 4]] for i in range(0, len(bits), 4))


def longest(halves):
    best = max(n for s, n in flat_runs(halves))
    return [(s, n) for s, n in flat_runs(halves) if n == best]


DATA = "100000111110"
CODE = encode(DATA)
U = len(DATA) / len(CODE)                   # 부호 비트 하나의 폭 = 데이터 비트 0.8개
ROWS = [("NRZ", nrz(DATA), 1.0, C[0]), ("NRZI", nrzi(DATA), 1.0, C[3]),
        ("맨체스터", manchester(DATA), 1.0, C[2]), ("4B/5B\n+ NRZI", nrzi(CODE), U, C[4])]


def length_text(name, n_half, u):
    if u == 1.0:
        return f"{n_half / 2:g}비트 폭"
    return f"부호 비트 {n_half / 2:g}개 폭\n= 데이터 {n_half / 2 * u:.1f}비트 시간"


# ---- 그림 1: 같은 데이터를 네 방식으로. 줄마다 가장 긴 평평한 구간 ----
G = 1.45
fig, ax = plt.subplots(figsize=(7.0, 5.0))
ax.axis("off")
n = len(DATA)
top = 3 * G + H
draw_grid(ax, n, G - 0.15, top + 0.5)
write_bits(ax, DATA, top + 0.33)
row_label(ax, "데이터", top + 0.33)
draw_grid(ax, len(CODE), -0.15, H + 0.45, unit=U)
write_bits(ax, CODE, H + 0.3, color=C[4], unit=U, size=8.5)
row_label(ax, "부호", H + 0.3, color=C[4], size=9)
for k in range(1, 3):
    ax.plot([5 * k * U] * 2, [-0.15, H + 0.45], color=C[4], lw=0.9, alpha=0.7)
for r, (name, lv, u, col) in enumerate(ROWS):
    y0 = G * (3 - r)
    draw_wave(ax, lv, y0, col, unit=u)
    row_label(ax, name, y0 + H / 2, color=col)
    runs = longest(lv)
    for s, m in runs:
        shade(ax, s * u / 2 + 0.05, (s + m) * u / 2 - 0.05, y0 - 0.12, y0 + H + 0.12)   # 붙은 두 구간이 갈라 보이게
    extra = f" ({len(runs)}곳)" if len(runs) > 1 else ""
    ax.text(n + 0.25, y0 + H / 2, "가장 긴 평평:\n" + length_text(name, runs[0][1], u) + extra,
            ha="left", va="center", fontsize=8.5, color=col)
ax.set_xlim(-1.6, n + 0.1)
ax.set_ylim(-0.3, top + 0.55)
save(fig, 1)


if __name__ == "__main__":
    # 데이터 1000 0011 1110 -> 부호 10010 10101 11100
    assert CODE == "100101010111100" and len(CODE) == 15 and abs(U - 0.8) < 1e-12
    got = {name.split("\n")[0]: (longest(lv), u) for name, lv, u, col in ROWS}
    assert got["NRZ"][0] == [(2, 10), (12, 10)]            # 0 다섯 개, 1 다섯 개: 각각 5비트 폭
    assert got["NRZI"][0] == [(1, 12)]                     # 첫 1의 뒤 절반 + 0 다섯 개 + 다음 1의 앞 절반 = 6비트 폭
    assert [m for s, m in got["맨체스터"][0]] == [2, 2, 2]   # 1비트 폭이 세 곳
    assert got["4B/5B"][0] == [(1, 6)]                     # 부호 비트 3개 폭 = 데이터 2.4비트 시간
    assert abs(6 / 2 * U - 2.4) < 1e-12
    # 표의 '신호가 바뀌지 않는 최대 길이': 맨체스터 1비트 폭, 4B/5B + NRZI 4비트 폭(부호 비트)
    allbits = [format(x, "08b") for x in range(256)]
    assert max(max(m for s, m in flat_runs(manchester(b))) for b in allbits) == 2
    codes = list(TABLE.values())
    assert max(max(m for s, m in flat_runs(nrzi(a + b))) for a in codes for b in codes) == 8
    # 효율: 12비트를 보내는 데 맨체스터는 반 칸 24개, 4B/5B는 부호 비트 15개
    assert len(manchester(DATA)) == 24 and len(CODE) / len(DATA) == 1.25
    # 카드 C3의 신호(맨체스터 1001)와 41 문서 카드 C3의 열(11110000)을 담지 않는다
    assert "1001" not in DATA and "11110000" not in DATA
    print("ALL CHECKS PASSED")
```
{% endraw %}
