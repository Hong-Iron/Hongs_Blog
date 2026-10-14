---
layout: "note"
title: "41_nrzi-manchester_plot.py"
display_title: "41_nrzi-manchester_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "41"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/nrzi-manchester/"
parent_title: "NRZI와 맨체스터"
description: "컴퓨터 통신 · NRZI와 맨체스터 그림 생성 코드"
permalink: "/studies/computer-communication/code/41_nrzi-manchester_plot/"
---
{% raw %}
[NRZI와 맨체스터](/Hongs_Blog/studies/computer-communication/nrzi-manchester/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# NRZI와 맨체스터 문서의 그림을 만든다: 41_nrzi-manchester_fig1.svg ~ fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 41_nrzi-manchester_plot.py  (matplotlib, numpy 필요)
#   fig1: 슬라이드 비트열의 NRZ, 클럭, 맨체스터, NRZI 네 줄 (슬라이드 38 그림을 규칙대로 다시 계산)
#   fig2: 실행 추적 표의 10110을 NRZI(처음 낮음)와 맨체스터로. 반 칸 값과 한가운데 전이
#   fig3: 효율 50%의 이유. NRZ가 가장 자주 바뀌는 열과 맨체스터가 가장 자주 바뀌는 열
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "41_nrzi-manchester"
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


# ---- 인코딩 규칙 (슬라이드 38·39) ----
def nrz(bits):
    return [int(b) for b in bits for _ in range(2)]


def clock(n):
    return [0, 1] * n                      # 칸마다 앞 절반 낮음, 뒤 절반 높음


def nrzi(bits, start=0):
    level, out = start, []
    for b in bits:
        out.append(level)                  # 앞 절반: 지금 높이
        if b == "1":
            level ^= 1                     # 1이면 한가운데서 뒤집기
        out.append(level)                  # 뒤 절반
    return out


def manchester(bits):
    return [d ^ c for d, c in zip(nrz(bits), clock(len(bits)))]


def decode_nrzi(levels):
    return "".join("1" if levels[i] != levels[i + 1] else "0" for i in range(0, len(levels), 2))


def decode_manchester(levels):
    return "".join(str(levels[i]) for i in range(0, len(levels), 2))


def draw(levels):
    return "".join("‾" if x else "_" for x in levels)


SLIDE = "0010111101000010"
TRACE = "10110"

# ---- 그림 1: 네 줄 ----
rows = [("NRZ", nrz(SLIDE), C[0]), ("클럭", clock(len(SLIDE)), C[1]),
        ("맨체스터", manchester(SLIDE), C[2]), ("NRZI", nrzi(SLIDE), C[3])]
GAP = 1.25
fig, ax = plt.subplots(figsize=(6.8, 3.7))
ax.axis("off")
top = GAP * (len(rows) - 1) + H
draw_grid(ax, len(SLIDE), -0.15, top + 0.55, mid=True, mid_hi=top + 0.1)
write_bits(ax, SLIDE, top + 0.38)
row_label(ax, "비트", top + 0.38)
for r, (name, lv, col) in enumerate(rows):
    y0 = GAP * (len(rows) - 1 - r)
    draw_wave(ax, lv, y0, col)
    row_label(ax, name, y0 + H / 2, color=col)
nz = nrzi(SLIDE)
s, n = max(flat_runs(nz), key=lambda t: t[1])
shade(ax, s / 2, (s + n) / 2, -0.12, H + 0.12, alpha=0.18)
ax.text((s + n) / 4, -0.38, f"0이 네 개: NRZI가 {n / 2:g}칸 폭 동안 평평", ha="center", va="center",
        fontsize=9, color=HL)
ax.set_xlim(-1.9, 16.1)
ax.set_ylim(-0.55, top + 0.6)
save(fig, 1)

# ---- 그림 2: 10110의 NRZI(처음 낮음)와 맨체스터 ----
fig, ax = plt.subplots(figsize=(6.2, 3.1))
ax.axis("off")
n_cells = len(TRACE)
YN, YM = 1.75, 0.0
draw_grid(ax, n_cells, -0.55, YN + H + 0.6, mid=True, mid_hi=YN + H + 0.03)
write_bits(ax, TRACE, YN + H + 0.42, size=11)
row_label(ax, "비트", YN + H + 0.42, size=10)
for name, lv, col, y0 in (("NRZI\n(처음 낮음)", nrzi(TRACE), C[3], YN), ("맨체스터", manchester(TRACE), C[2], YM)):
    draw_wave(ax, lv, y0, col)
    row_label(ax, name, y0 + H / 2, color=col)
    for i, v in enumerate(lv):                 # 반 칸 값
        ax.text((i + 0.5) / 2, y0 - 0.22, str(v), ha="center", va="center", fontsize=8.5, color=col)
    for i in change_points(lv):
        x = i / 2
        if i % 2 == 1:                         # 칸 한가운데에서 바뀜
            ax.plot([x], [y0 + H / 2], "o", ms=7, color=HL, zorder=5)
        else:                                  # 칸 경계에서 바뀜
            ax.plot([x], [y0 + H / 2], "o", ms=7, mfc="none", mec=INK, mew=1.4, zorder=5)
mz = manchester(TRACE)
for k in range(n_cells):
    up = mz[2 * k + 1] > mz[2 * k]
    ax.text(k + 0.5 + 0.13, YM + H / 2 + 0.02, r"$\uparrow$" if up else r"$\downarrow$", ha="left",
            va="center", fontsize=10, color=HL)
nz = nrzi(TRACE)
for k in range(n_cells):
    if nz[2 * k] == nz[2 * k + 1]:
        ax.text(k + 0.5, YN + H + 0.13, "그대로", ha="center", va="center", fontsize=8, color=C[3])
for i in change_points(mz):
    if i % 2 == 0:
        ax.text(i / 2, YM - 0.75, "빈 점: 칸 경계에서 바뀜", ha="center", va="center", fontsize=8.5)
n_mid_nz = sum(1 for i in change_points(nz) if i % 2 == 1)
n_mid_mz = sum(1 for i in change_points(mz) if i % 2 == 1)
ax.text(n_cells + 0.15, YN + H / 2, f"주황 점 {n_mid_nz}개:\n1인 칸에서만\n한가운데 전이", ha="left",
        va="center", fontsize=8.5, color=C[3])
ax.text(n_cells + 0.15, YM + H / 2, f"주황 점 {n_mid_mz}개:\n모든 칸에서\n한가운데 전이", ha="left",
        va="center", fontsize=8.5, color=C[2])
ax.set_xlim(-1.5, n_cells + 0.1)
ax.set_ylim(-0.9, YN + H + 0.65)
save(fig, 2)

# ---- 그림 3: 신호가 가장 자주 바뀌는 경우. NRZ는 0101..., 맨체스터는 0000... ----
D_NRZ, D_MAN = "01010101", "00000000"
fig, ax = plt.subplots(figsize=(6.6, 2.9))
ax.axis("off")
Y1, Y2 = 1.85, 0.0
draw_grid(ax, 8, -0.2, Y1 + H + 0.55)
for name, bits, lv, col, y0 in (("NRZ", D_NRZ, nrz(D_NRZ), C[0], Y1),
                                ("맨체스터", D_MAN, manchester(D_MAN), C[2], Y2)):
    write_bits(ax, bits, y0 + H + 0.33, color=col)
    draw_wave(ax, lv, y0, col)
    row_label(ax, name, y0 + H / 2, color=col)
    cps = change_points(lv)
    for i in cps:
        ax.plot([i / 2], [y0 + H / 2], "o", ms=5, color=HL, zorder=5)
    s, n = min(flat_runs(lv)[1:-1], key=lambda t: t[1])
    ax.text(8.2, y0 + H / 2, f"8비트에 변화 {len(cps)}번\n가장 짧은 조각 {n / 2:g}비트 폭", ha="left",
            va="center", fontsize=9, color=col)
ax.set_xlim(-1.6, 8.1)
ax.set_ylim(-0.3, Y1 + H + 0.6)
save(fig, 3)


if __name__ == "__main__":
    # 그림 1: 슬라이드 38 그림과 같은 모양 (구현 코드의 값과 같다)
    assert draw(nrz(SLIDE)) == "____‾‾__‾‾‾‾‾‾‾‾__‾‾________‾‾__"
    assert draw(manchester(SLIDE)) == "_‾_‾‾__‾‾_‾_‾_‾__‾‾__‾_‾_‾_‾‾__‾"
    assert draw(nrzi(SLIDE)) == "_____‾‾‾‾__‾‾__‾‾‾‾__________‾‾‾"
    # 본문: 첫 네 칸의 규칙 적용
    assert nrzi(SLIDE)[:8] == [0, 0, 0, 0, 0, 1, 1, 1]
    assert manchester(SLIDE)[:8] == [0, 1, 0, 1, 1, 0, 0, 1]
    # NRZI의 가장 긴 평평한 구간: 10칸 반 = 5칸 폭, 10번째 칸 뒤 절반부터 15번째 칸 앞 절반까지
    assert max(flat_runs(nrzi(SLIDE)), key=lambda t: t[1]) == (19, 10)
    # 맨체스터는 모든 칸 한가운데서 바뀐다
    m = manchester(SLIDE)
    assert all(m[2 * k] != m[2 * k + 1] for k in range(len(SLIDE)))
    # 그림 2: 실행 추적 표 10110
    assert nrzi(TRACE) == [0, 1, 1, 1, 1, 0, 0, 1, 1, 1]
    assert manchester(TRACE) == [1, 0, 0, 1, 1, 0, 1, 0, 0, 1]
    assert draw(nrzi(TRACE)) == "_‾‾‾‾__‾‾‾" and draw(manchester(TRACE)) == "‾__‾‾_‾__‾"
    assert [i for i in change_points(nrzi(TRACE))] == [1, 5, 7]            # 1·3·4번째 칸 한가운데
    assert [i for i in change_points(manchester(TRACE)) if i % 2 == 0] == [6]   # 3·4번째 칸 경계
    assert decode_nrzi(nrzi(TRACE)) == TRACE and decode_manchester(manchester(TRACE)) == TRACE
    assert decode_nrzi(nrzi(TRACE, start=1)) == TRACE
    # 그림 3: 8비트에서 NRZ 0101... 은 7번, 맨체스터 0000... 은 15번 바뀐다
    assert len(change_points(nrz(D_NRZ))) == 7 and len(change_points(manchester(D_MAN))) == 15
    assert min(n for s, n in flat_runs(nrz(D_NRZ))) == 2          # 반 칸 2개 = 1비트 폭
    assert max(n for s, n in flat_runs(manchester(D_MAN))) == 1    # 반 칸 1개 = 반 비트 폭
    # 어떤 8비트 열이든 NRZ 변화는 7번 이하, 맨체스터 변화는 15번 이하
    allbits = [format(x, "08b") for x in range(256)]
    assert max(len(change_points(nrz(b))) for b in allbits) == 7
    assert max(len(change_points(manchester(b))) for b in allbits) == 15
    # 그리지 않는 카드 C3의 열(11110000)은 그림에 쓰지 않았다
    assert "11110000" not in (SLIDE, TRACE, D_NRZ, D_MAN)
    print("ALL CHECKS PASSED")
```
{% endraw %}
