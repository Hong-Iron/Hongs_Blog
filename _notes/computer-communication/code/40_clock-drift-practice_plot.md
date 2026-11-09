---
layout: "note"
title: "40_clock-drift-practice_plot.py"
display_title: "40_clock-drift-practice_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "40"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/clock-drift-practice/"
parent_title: "클럭 어긋남 계산 연습"
description: "컴퓨터 통신 · 클럭 어긋남 계산 연습 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/40_clock-drift-practice_plot/"
---
{% raw %}
[클럭 어긋남 계산 연습](/Hongs_Blog/studies/computer-communication/clock-drift-practice/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 클럭 어긋남 계산 연습 문서의 그림을 만들고 답을 확인한다: 40_clock-drift-practice_fig1.svg ~ fig4.svg
# 실행: ~/.venvs/vault-plots/bin/python 40_clock-drift-practice_plot.py  (matplotlib, numpy 필요)
#   fig1: 문제 1  받는 쪽 10% 빠름(w = 0.9), 다시 맞추지 않음
#   fig2: 문제 2  같은 시계, 신호가 바뀔 때마다 칸 경계를 다시 맞춤
#   fig3: 문제 4  받는 쪽 5% 느림(w = 1.05), 다시 맞추지 않음
#   fig4: 시계 오차에 따른 첫 오류 위치
# 약속: 보낸 쪽 비트 폭 = 1, 칸 번호와 읽기 번호 k는 0부터. 받는 쪽은 (k + 1/2)w에 읽는다.
import math
import os
from fractions import Fraction as Fr

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "40_clock-drift-practice"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
BLUE, ORANGE, GREEN, PURPLE, GOLD = C
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 10, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    if os.environ.get("PREVIEW_DIR"):
        fig.savefig(os.path.join(os.environ["PREVIEW_DIR"], f"cd_fig{k}.png"), bbox_inches="tight", dpi=100,
                    facecolor="white")
    plt.close(fig)


# =====================================================================
# 받는 쪽 모형 (분수로 계산해 경계에서 반올림 오차가 없게 한다)
# =====================================================================

def reads_free(n, w):
    """다시 맞추지 않음: (k + 1/2)w에 읽는다. 끝(시각 n) 전에 읽는 것만. [(시각, 칸)]"""
    out, k = [], 0
    while (k + Fr(1, 2)) * w < n:
        t = (k + Fr(1, 2)) * w
        out.append((t, math.floor(t)))
        k += 1
    return out


def reads_resync(bits, w):
    """NRZ: 신호가 바뀌는 순간(칸 경계)마다 그 순간을 칸 경계로 다시 잡는다. [(시각, 칸)]과 다시 맞춘 시각들"""
    n = len(bits)
    trans = [Fr(i) for i in range(1, n) if bits[i] != bits[i - 1]]
    out, anchor, j, syncs = [], Fr(0), 0, []
    while True:
        t = anchor + (j + Fr(1, 2)) * w
        nxt = [x for x in trans if anchor < x <= t]       # 다음 읽기 전에 신호가 바뀌면 거기서 다시 맞춘다
        if nxt:
            anchor, j = nxt[0], 0
            syncs.append(anchor)
            continue
        if t >= n:
            break
        out.append((t, math.floor(t)))
        j += 1
    return out, syncs


def received(bits, rd):
    return "".join(bits[c] for _, c in rd)


def first_dup_k(eps):
    """빠른 시계(w = 1 - eps): (k + 1/2)eps > 1/2 를 처음 만족하는 k"""
    k = 0
    while (k + Fr(1, 2)) * eps <= Fr(1, 2):
        k += 1
    return k


def first_skip_k(delta):
    """느린 시계(w = 1 + delta): (k + 1/2)delta >= 1/2 를 처음 만족하는 k"""
    k = 0
    while (k + Fr(1, 2)) * delta < Fr(1, 2):
        k += 1
    return k


# ---- 문제 데이터 ----
B1 = "110000000011"
W1 = Fr(9, 10)
R1 = reads_free(len(B1), W1)
R2, SYNC2 = reads_resync(B1, W1)
B4 = "1111111111110000"
W4 = Fr(105, 100)
R4 = reads_free(len(B4), W4)
EPS3 = 1 - Fr(100, 103)                                  # 1 Mbps를 1.03 Mbps로 믿음: w = 1/1.03
K3 = first_dup_k(EPS3)
EPS3B = Fr(1, 10000)                                     # 100 ppm
K3B = first_dup_k(EPS3B)


# =====================================================================
# 그림 도구
# =====================================================================
H = 0.7


def nrz_wave(ax, bits, y0, color=BLUE):
    xs = list(range(len(bits) + 1))
    ys = [y0 + H * int(b) for b in bits] + [y0 + H * int(bits[-1])]
    ax.step(xs, ys, where="post", color=color, lw=2.0, solid_joinstyle="miter")


def grid(ax, n, lo, hi):
    for k in range(n + 1):
        ax.plot([k, k], [lo, hi], color=INK, lw=0.6, ls=(0, (1, 2)), zorder=0)


def drift_figure(bits, rd, w, title_note, syncs=(), slow=False):
    n = len(bits)
    fig, (ax, bx) = plt.subplots(2, 1, figsize=(10.4, 5.2), gridspec_kw={"height_ratios": [1.5, 1]}, sharex=True)
    ax.set_axis_off()
    grid(ax, n, -0.35, 2.15)
    for k, b in enumerate(bits):
        ax.text(k + 0.5, 1.75, b, ha="center", va="center", fontsize=11)
        ax.text(k + 0.5, 2.05, str(k), ha="center", va="center", fontsize=8, alpha=0.8)
    ax.text(-0.25, 1.75, "보낸 비트", ha="right", va="center", fontsize=10)
    ax.text(-0.25, 2.05, "칸 번호", ha="right", va="center", fontsize=8.5)
    nrz_wave(ax, bits, 0.45)
    ax.text(-0.25, 0.8, "NRZ 신호", ha="right", va="center", fontsize=10, color=BLUE)
    cells = [c for _, c in rd]
    bad = set()
    for i in range(1, len(cells)):
        if cells[i] == cells[i - 1]:
            bad.add(i - 1)
            bad.add(i)
    skipped = sorted(set(range(n)) - set(cells))
    for c in sorted({cells[i] for i in bad}):
        ax.add_patch(Rectangle((c, -0.3), 1, 2.4, fc=ORANGE, alpha=0.13, ec="none"))
    for c in skipped:
        ax.add_patch(Rectangle((c, -0.3), 1, 2.4, fc=PURPLE, alpha=0.13, ec="none"))
        ax.text(c + 0.5, -0.2, "안 읽힘", ha="center", va="center", fontsize=8.5, color=PURPLE)
    for i, (t, c) in enumerate(rd):
        col = ORANGE if i in bad else GREEN
        ax.plot([float(t)] * 2, [0.25, 1.35], color=col, lw=1.6 if i in bad else 1.0)
        ax.text(float(t), 0.12, bits[c], ha="center", va="center", fontsize=9.5, color=col, weight="bold")
    ax.text(-0.25, 0.12, "읽은 비트", ha="right", va="center", fontsize=10, color=GREEN)
    for s in syncs:
        ax.plot([float(s)], [1.4], marker="v", ms=8, color=PURPLE)
    if syncs:
        ax.text(float(syncs[0]) + 0.1, 1.48, "다시 맞춤", ha="left", va="bottom", fontsize=8.5, color=PURPLE)
    ax.set_xlim(-2.4, n + 0.3)
    ax.set_ylim(-0.4, 2.25)
    # 아래: 읽기마다 칸 한가운데에서 벗어난 양 (빠르면 앞당김, 느리면 늦어짐)
    drift = []
    for idx, (t, c) in enumerate(rd):
        # 받는 쪽이 의도한 칸(읽기 번호 기준)의 한가운데와의 거리
        drift.append(abs(float((idx + Fr(1, 2)) - t)) if not syncs else None)
    if syncs:
        anchor, j, si, drift = Fr(0), 0, 0, []
        for t, c in rd:
            while si < len(syncs) and syncs[si] < t:
                anchor, j = syncs[si], 0
                si += 1
            drift.append(abs(float((anchor + j + Fr(1, 2)) - t)))
            j += 1
    xs = [float(t) for t, _ in rd]
    cols = [ORANGE if d > 0.5 or (slow and d >= 0.5) else BLUE for d in drift]
    bx.bar(xs, drift, width=0.32, color=cols, alpha=0.8)
    bx.axhline(0.5, color=INK, lw=1.0, ls=(0, (4, 3)))
    bx.text(n + 0.25, 0.5, "반 칸", ha="left", va="center", fontsize=9)
    bx.set_ylim(0, max(0.75, max(drift) + 0.1))
    bx.set_ylabel(title_note, fontsize=9.5)
    bx.set_xticks(range(n + 1))
    bx.tick_params(labelsize=8.5)
    bx.set_xlabel("시각 (보낸 쪽 비트 폭 단위)", fontsize=9.5)
    fig.subplots_adjust(hspace=0.08)
    return fig


fig = drift_figure(B1, R1, W1, "칸 한가운데보다\n일찍 읽은 양(칸)")
save(fig, 1)
fig = drift_figure(B1, R2, W1, "마지막으로 맞춘 뒤\n일찍 읽은 양(칸)", syncs=SYNC2)
save(fig, 2)
fig = drift_figure(B4, R4, W4, "칸 한가운데보다\n늦게 읽은 양(칸)", slow=True)
save(fig, 3)

# ---- 그림 4: 시계 오차 eps에 따른 첫 오류 위치 (빠른 시계, 다시 맞추지 않음)
fig, ax = plt.subplots(figsize=(7.2, 3.8))
eps = np.logspace(-4, -0.7, 300)
first = [first_dup_k(Fr(e).limit_denominator(10 ** 7)) + 1 for e in eps]
ax.loglog(eps * 100, first, color=BLUE, lw=2)
ax.loglog(eps * 100, 1 / (2 * eps), color=INK, lw=1, ls=(0, (4, 3)))
for e, lab, off in ((0.1, "문제 1: 10%", (-10, -30)), (float(EPS3), "문제 3(가): 약 2.9%", (8, 6)),
                    (1 / 16, "개념 문서: 1/16", (-95, -26)), (1e-4, "문제 3(나): 100 ppm", (8, 6))):
    k = first_dup_k(Fr(e).limit_denominator(10 ** 7)) + 1
    ax.plot([e * 100], [k], "o", color=ORANGE, ms=6)
    ax.annotate(f"{lab}\n{k}번째 읽기", (e * 100, k), xytext=off, textcoords="offset points", fontsize=8.8, color=ORANGE)
ax.set_xlabel("받는 쪽 시계가 빠른 비율 ε (%)", fontsize=10)
ax.set_ylabel("처음 같은 칸을 두 번 읽는\n읽기 번호 (1부터)", fontsize=10)
ax.text(0.012, 3, "점선: 어림값 1 / (2ε)", fontsize=9, color=INK)
ax.grid(True, which="major", color=INK, alpha=0.2)
from matplotlib.ticker import FuncFormatter
ax.xaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:g}"))
ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v:,.0f}"))
save(fig, 4)

if __name__ == "__main__":
    # 문제 1: 10% 빠름, 다시 맞추지 않음
    assert [str(t) for t, _ in R1][:6] == ["9/20", "27/20", "9/4", "63/20", "81/20", "99/20"]
    assert [c for _, c in R1] == [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11], R1
    assert received(B1, R1) == "1100000000011" and first_dup_k(1 - W1) == 5
    # 문제 2: 같은 시계, 다시 맞춤
    assert SYNC2 == [2, 10], SYNC2
    assert [c for _, c in R2] == [0, 1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11], R2
    assert received(B1, R2) == "1100000000011"
    assert math.floor(1 / (2 * (1 - W1)) - Fr(1, 2)) == 4            # 다시 맞춰도 버티는 같은 높이는 4칸까지
    for L in range(1, 12):                                           # 그 말이 실제 읽기와 맞는지
        bits = "1" + "0" * L + "1"
        rd, _ = reads_resync(bits, W1)
        assert (received(bits, rd) == bits) == (L <= 4), (L, received(bits, rd))
    # 문제 3: 1 Mbps를 1.03 Mbps로 믿음, 그리고 100 ppm
    assert EPS3 == Fr(3, 103) and K3 == 17
    t3 = (K3 + Fr(1, 2)) * Fr(100, 103)                               # μs (비트 폭 1 μs)
    assert abs(float(t3) - 16.99) < 0.005
    assert K3B == 5000 and abs(float((K3B + Fr(1, 2)) * (1 - EPS3B)) * 10e-9 - 50.0e-6) < 1e-8
    # 문제 4: 5% 느림
    assert [c for _, c in R4] == list(range(10)) + [11, 12, 13, 14, 15], R4
    assert received(B4, R4) == "111111111110000" and first_skip_k(W4 - 1) == 10
    # 개념 문서의 결과와 같은지 (w = 15/16이면 9번째 읽기에서 중복)
    assert first_dup_k(Fr(1, 16)) == 8 and first_dup_k(Fr(1, 100)) == 50
    # 변형: 2% 빠르면 같은 높이 24칸까지, 5% 느리면 10칸까지 버팀(다시 맞추기 있음)
    for L in (24, 25):
        bits = "1" + "0" * L + "1"
        assert (received(bits, reads_resync(bits, Fr(98, 100))[0]) == bits) == (L <= 24)
    for L in (10, 11, 12):
        bits = "0" + "1" * L + "0"
        assert (received(bits, reads_resync(bits, W4)[0]) == bits) == (L <= 10)
    print("ALL CHECKS PASSED")
```
{% endraw %}
