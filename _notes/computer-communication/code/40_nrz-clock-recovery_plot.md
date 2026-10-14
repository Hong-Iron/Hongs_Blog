---
layout: "note"
title: "40_nrz-clock-recovery_plot.py"
display_title: "40_nrz-clock-recovery_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "40"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/nrz-clock-recovery/"
parent_title: "NRZ와 클럭 복구"
description: "컴퓨터 통신 · NRZ와 클럭 복구 그림 생성 코드"
permalink: "/studies/computer-communication/code/40_nrz-clock-recovery_plot/"
---
{% raw %}
[NRZ와 클럭 복구](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# NRZ와 클럭 복구 문서의 그림을 만든다: 40_nrz-clock-recovery_fig1.svg ~ fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 40_nrz-clock-recovery_plot.py  (matplotlib, numpy 필요)
#   fig1: 슬라이드 비트열의 NRZ 파형, 평평한 구간과 신호가 바뀌는 순간
#   fig2: 받는 쪽 비트 폭이 15/16일 때 읽는 시각과 쌓이는 앞당김 (다시 맞추지 않음)
#   fig3: 같은 시계로 신호가 바뀔 때마다 다시 맞추는 받는 쪽
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "40_nrz-clock-recovery"
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


SENT = "0010111101000010"
W = 15 / 16                    # 받는 쪽이 믿는 비트 폭 (보낸 쪽 = 1)
NRZ = [int(b) for b in SENT for _ in range(2)]


def read_times(n, w=W):
    return [(k + 0.5) * w for k in range(n)]


def read_bits(bits, w=W):
    return "".join(bits[int(math.floor(t))] for t in read_times(len(bits), w))


def resync_times(bits, w=W):
    """신호가 바뀔 때마다 그 순간을 칸 경계로 다시 잡는 받는 쪽의 읽는 시각."""
    edges = [i for i in range(1, len(bits)) if bits[i] != bits[i - 1]]
    times, start = [], 0.0
    for stop in edges + [len(bits)]:
        k = 0
        while start + (k + 0.5) * w < stop:
            times.append(start + (k + 0.5) * w)
            k += 1
        start = float(stop)
    return times


TIMES = read_times(len(SENT))
GOT = read_bits(SENT)
LEAD = [(k + 0.5) - t for k, t in enumerate(TIMES)]          # 칸 한가운데보다 얼마나 일찍 읽나
RTIMES = resync_times(SENT)
RGOT = "".join(SENT[int(math.floor(t))] for t in RTIMES)
EDGES = [i / 2 for i in change_points(NRZ)]                    # 신호가 바뀌는 시각 (칸 단위)
RUNS = [(s / 2, n / 2) for s, n in flat_runs(NRZ)]             # (시작 시각, 길이) 칸 단위

# ---- 그림 1: NRZ 파형, 4칸짜리 평평한 구간 두 곳, 신호가 바뀌는 순간 ----
fig, ax = plt.subplots(figsize=(6.8, 2.5))
ax.axis("off")
draw_grid(ax, 16, -0.15, 1.3)
write_bits(ax, SENT, 1.15, color=C[0])
row_label(ax, "비트", 1.15, color=C[0])
row_label(ax, "NRZ", 0.35, color=C[0])
ax.text(-0.08, 0.0, "낮음", ha="right", va="center", fontsize=8)
ax.text(-0.08, H, "높음", ha="right", va="center", fontsize=8)
long_runs = [(s, n) for s, n in RUNS if n >= 4]
for s, n in long_runs:
    shade(ax, s, s + n, -0.15, 0.95)
    val = SENT[int(s)]
    ax.text(s + n / 2, -0.38, f"{val}이 {int(n)}개: {int(n)}칸 동안 평평", ha="center", va="center",
            fontsize=9, color=HL)
draw_wave(ax, NRZ, 0.0, C[0])
for e in EDGES:
    ax.plot([e], [H / 2], "o", ms=6, color=HL, zorder=5)
ax.plot([0.35], [-0.8], "o", ms=6, color=HL)
ax.text(0.6, -0.8, "신호가 바뀌는 순간 (8곳). 받는 쪽은 이때만 박자를 다시 맞출 수 있다",
        ha="left", va="center", fontsize=9, color=HL)
ax.set_xlim(-1.4, 16.2)
ax.set_ylim(-1.0, 1.35)
save(fig, 1)


# ---- 그림 2·3 공통: 위는 파형과 읽는 시각, 아래는 칸 한가운데보다 얼마나 일찍 읽나 ----
def drift_figure(times, got, lead, mark_dup=None, edge_dots=False):
    fig, (ax, bx) = plt.subplots(2, 1, figsize=(6.8, 4.2), sharex=True,
                                 gridspec_kw={"height_ratios": [1.5, 1], "hspace": 0.18})
    ax.axis("off")
    draw_grid(ax, 16, -0.3, 1.3)
    write_bits(ax, SENT, 1.15, color=C[0])
    row_label(ax, "보낸 비트", 1.15, color=C[0], size=9)
    row_label(ax, "읽은 비트", -0.58, color=C[1], size=9)
    draw_wave(ax, NRZ, 0.0, C[0])
    if mark_dup is not None:
        shade(ax, mark_dup, mark_dup + 1, -0.3, 1.3, alpha=0.13)
    if edge_dots:
        for e in EDGES:
            ax.plot([e], [H / 2], "o", ms=5, color=C[2], zorder=5)
    for k, t in enumerate(times):
        bold = mark_dup is not None and math.floor(t) == mark_dup
        ax.plot([t, t], [-0.25, 0.95], color=C[1], lw=1.7 if bold else 0.9, alpha=1 if bold else 0.75)
        ax.text(t, -0.58, got[k], ha="center", va="center", fontsize=10, color=C[1],
                fontweight="bold" if bold else "normal")
    ax.set_ylim(-0.8, 1.55)

    bx.axhline(0.5, color=INK, lw=0.9, ls="--")
    bx.text(16.15, 0.5, "반 칸", ha="left", va="center", fontsize=9)
    for t, d in zip(times, lead):
        bx.bar(t, d, width=0.42, color=C[1] if d > 0.5 else C[0], alpha=0.85)
    bx.set_ylim(0, 1.12)
    bx.set_yticks([0, 0.5, 1.0], ["0", "0.5", "1"])
    bx.text(0.1, 1.1, "앞당김 (칸): 칸 한가운데보다 얼마나 일찍 읽나", ha="left", va="center", fontsize=9)
    bx.set_xticks(range(0, 17, 2))
    bx.set_xlim(-0.2, 16.1)
    bx.set_xlabel("시간 (보낸 쪽 비트 칸 단위)", fontsize=9)
    return fig, ax, bx


fig, ax, bx = drift_figure(TIMES, GOT, LEAD, mark_dup=7)
ax.text(7.5, 1.45, "8번째 칸을 두 번 읽는다", ha="center", va="center", fontsize=9, color=C[1])
ax.text(16.25, 0.35, "16번째 칸은\n읽지 못한다", ha="left", va="center", fontsize=9, color=C[1])
for k in (0, 7, 8, 15):
    bx.text(TIMES[k], LEAD[k] + 0.03, f"{LEAD[k]:.2f}", ha="center", va="bottom", fontsize=8,
            color=C[1] if LEAD[k] > 0.5 else C[0])
bx.text(0.2, 0.78, "주황 막대: 반 칸을 넘어 한 칸 앞을 읽는다", ha="left", va="center", fontsize=9, color=C[1])
save(fig, 2)

RLEAD = [(math.floor(t) + 0.5) - t for t in RTIMES]
fig, ax, bx = drift_figure(RTIMES, RGOT, RLEAD, edge_dots=True)
ax.text(8.0, 1.45, "초록 점(신호가 바뀌는 순간)마다 칸 경계를 다시 잡는다", ha="center", va="center",
        fontsize=9, color=C[2])
for e in EDGES:
    bx.plot([e, e], [0, 0.62], color=C[2], lw=0.7, alpha=0.5)
for k, t in enumerate(RTIMES):
    if abs(RLEAD[k] - max(RLEAD)) < 1e-12:
        bx.text(t, RLEAD[k] + 0.03, f"{RLEAD[k]:.2f}", ha="center", va="bottom", fontsize=8, color=C[0])
bx.text(0.2, 0.78, "초록 선에서 앞당김이 0으로 돌아간다", ha="left", va="center", fontsize=9, color=C[2])
save(fig, 3)


if __name__ == "__main__":
    # 그림 1: 바뀌는 순간 8곳, 4칸짜리 평평한 구간 두 곳(1 네 개: 칸 5~8, 0 네 개: 칸 11~14)
    assert EDGES == [2, 3, 4, 8, 9, 10, 14, 15]
    assert [(s, n) for s, n in RUNS if n >= 4] == [(4.0, 4.0), (10.0, 4.0)]
    assert max(n for s, n in RUNS) == 4
    # 문서 표의 값: 읽는 시각 (k+1/2)*15/16
    want = [0.47, 1.41, 2.34, 3.28, 4.22, 5.16, 6.09, 7.03, 7.97, 8.91, 9.84]
    assert all(abs(round(t, 2) - v) < 1e-9 for t, v in zip(TIMES, want))
    assert [round(t, 1) for t in TIMES[11:]] == [10.8, 11.7, 12.7, 13.6, 14.5]
    assert abs(TIMES[2] - 2.34375) < 1e-12 and abs(TIMES[7] - 7.03125) < 1e-12
    # 9번째 읽기 시각 7.97은 8번째 칸(번호 7) 안이고, 8번째 읽기도 같은 칸이다
    assert abs(TIMES[8] - 7.96875) < 1e-12 and math.floor(TIMES[8]) == 7 and math.floor(TIMES[7]) == 7
    assert GOT == "0010111110100001"
    first_dup = next(k for k in range(1, 16) if math.floor(TIMES[k]) == math.floor(TIMES[k - 1]))
    assert first_dup == 8
    # 앞당김 = (k+1/2)/16: 1번째 0.03, 8번째 0.47, 9번째 0.53
    assert abs(LEAD[0] - 1 / 32) < 1e-12 and abs(LEAD[7] - 15 / 32) < 1e-12 and abs(LEAD[8] - 17 / 32) < 1e-12
    assert all(d <= 0.5 for d in LEAD[:8]) and all(d > 0.5 for d in LEAD[8:])
    # 식 k > 1/(2ε) - 1/2, ε = 1/16 → k > 7.5 → k = 8
    eps = 1 - W
    assert min(k for k in range(100) if (k + 0.5) * eps > 0.5) == 8
    # ε = 1/10 → k > 4.5 → k = 5 (6번째 읽기), ε = 1/100 → k = 50
    assert min(k for k in range(100) if (k + 0.5) * 0.1 > 0.5) == 5
    assert min(k for k in range(1000) if (k + 0.5) * 0.01 > 0.5) == 50
    # 그림 3: 다시 맞추면 16번 모두 맞게 읽고, 쌓이는 앞당김은 많아야 3.5/16 ≈ 0.22칸
    assert RGOT == SENT and len(RTIMES) == 16
    assert abs(max(RLEAD) - 3.5 / 16) < 1e-12
    run4 = [t for t in RTIMES if 4 <= t < 8]
    assert [round(t, 2) for t in run4] == [4.47, 5.41, 6.34, 7.28]
    assert abs(RTIMES[8] - 8.46875) < 1e-12        # 8에서 신호가 바뀐 뒤 첫 읽기
    # 다시 맞추는 받는 쪽(비트 폭 15/16)은 같은 높이가 7칸까지는 맞게 읽고, 8칸부터 틀린다
    for L in range(1, 12):
        s = "0" + "1" * L + "0"
        ok = "".join(s[int(math.floor(t))] for t in resync_times(s)) == s
        assert ok == (L <= 7)
    # 다시 맞추지 않을 때 앞당김: 8번째 읽기 7.5/16 = 0.47, 9번째 8.5/16 = 0.53
    assert abs(7.5 / 16 - LEAD[7]) < 1e-12 and abs(8.5 / 16 - LEAD[8]) < 1e-12
    # UART 예: 1% 빠른 시계로 10비트를 읽으면 마지막 앞당김은 9.5 x 0.01 = 0.095칸
    assert abs((9 + 0.5) * 0.01 - 0.095) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
