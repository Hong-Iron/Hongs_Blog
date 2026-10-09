---
layout: "note"
title: "32_clique_plot.py"
display_title: "32_clique_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "32"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/clique/"
parent_title: "CLIQUE"
description: "데이터 과학 · CLIQUE 그림 생성 코드"
permalink: "/studies/data-science/code/32_clique_plot/"
---
{% raw %}
[CLIQUE](/Hongs_Blog/studies/data-science/clique/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# CLIQUE 문서의 그림을 만든다: 32_clique_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 32_clique_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "32_clique"
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

import random

rnd = random.Random(8)                                  # 32_clique_impl.py와 같은 난수 흐름을 그대로 다시 밟는다
for _ in range(200):
    _P = [tuple(rnd.uniform(0, 10) for _ in range(3)) for _ in range(rnd.randint(20, 80))]
    _xi = rnd.randint(2, 5)
A = [(rnd.uniform(2, 4), rnd.uniform(6, 8), rnd.uniform(0, 10)) for _ in range(120)]
NOISE = [tuple(rnd.uniform(0, 10) for _ in range(3)) for _ in range(180)]
P = np.array(A + NOISE)
XI, TAU = 5, 0.15


def cell(v):
    return np.minimum((v // (10 / XI)).astype(int), XI - 1)


def counts2(d1, d2):
    H = np.zeros((XI, XI), int)
    for a, b in zip(cell(P[:, d1]), cell(P[:, d2])):
        H[a, b] += 1
    return H


# 그림 1: 두 부분공간 (x1, x2)와 (x1, x3)에서 본 같은 점 300개와 격자
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3.3))
for ax, d2 in zip(axes, [1, 2]):
    H = counts2(0, d2)
    for a in range(XI):
        for b in range(XI):
            if H[a, b] >= TAU * len(P):
                ax.add_patch(plt.Rectangle((a * 2, b * 2), 2, 2, fc="none", ec=C[1], lw=2, zorder=4))
                ax.text(a * 2 + 1, b * 2 + 2.1, f"{H[a, b]}개", ha="center", va="bottom", fontsize=9, color=C[1], zorder=5,
                        bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none", alpha=0.8))
    ax.plot(P[120:, 0], P[120:, d2], "o", ms=2.5, color=INK, alpha=0.6)
    ax.plot(P[:120, 0], P[:120, d2], "o", ms=2.5, color=C[0], alpha=0.8)
    for g in range(0, 11, 2):
        ax.axvline(g, color=INK, lw=0.5); ax.axhline(g, color=INK, lw=0.5)
    ax.set_xlim(0, 10); ax.set_ylim(0, 10)
    ax.set_aspect("equal")
    ax.set_xticks(range(0, 11, 2)); ax.set_yticks(range(0, 11, 2))
    ax.set_xlabel("$x_1$"); ax.set_ylabel(f"$x_{d2 + 1}$")
    mx = H.max()
    ax.set_title(f"($x_1$, $x_{d2 + 1}$): 가장 많은 칸 {mx}개", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    n = len(P)
    c1 = np.bincount(cell(P[:, 0]), minlength=XI); c2 = np.bincount(cell(P[:, 1]), minlength=XI)
    c3 = np.bincount(cell(P[:, 2]), minlength=XI)
    assert c1[1] == 149 and c1[3] == 49 and c2[3] == 161 and all(c3 >= TAU * n)
    assert counts2(0, 1)[1, 3] == 129 and (counts2(0, 1) >= TAU * n).sum() == 1
    assert (counts2(0, 2) >= TAU * n).sum() == 0 and (counts2(1, 2) >= TAU * n).sum() == 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
