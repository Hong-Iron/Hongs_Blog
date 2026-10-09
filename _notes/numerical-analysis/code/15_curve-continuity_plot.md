---
layout: "note"
title: "15_curve-continuity_plot.py"
display_title: "15_curve-continuity_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "15"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/curve-continuity/"
parent_title: "곡선의 연속성"
description: "수치해석 · 곡선의 연속성 코드 코드"
permalink: "/studies/numerical-analysis/code/15_curve-continuity_plot/"
---
{% raw %}
[곡선의 연속성](/Hongs_Blog/studies/numerical-analysis/curve-continuity/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 곡선의 연속성 문서의 그림을 만든다: 15_curve-continuity_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_curve-continuity_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_curve-continuity"
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


def bezier(P, u):
    P = np.array(P, dtype=float)
    u = u[:, None]
    return (1 - u) ** 3 * P[0] + 3 * u * (1 - u) ** 2 * P[1] + 3 * u ** 2 * (1 - u) * P[2] + u ** 3 * P[3]


A = [(0, 0), (1, 2), (3, 2), (4, 0)]
CASES = [
    ("$C^0$만 (꺾임)", [(4, 0), (6, 3), (7, 1), (8, 0)]),
    ("$G^1$ (방향만 같음)", [(4, 0), (6, -4), (7, 1), (8, 0)]),
    ("$C^1$", [(4, 0), (5, -2), (7, 1), (8, 0)]),
]
u = np.linspace(0, 1, 200)
fig, axes = plt.subplots(1, 3, figsize=(6.6, 2.6), sharey=True)
for ax, (title, Bp) in zip(axes, CASES):
    for P, col in ((A, C[0]), (Bp, C[1])):
        Q = np.array(P, float)
        ax.plot(Q[:, 0], Q[:, 1], color=col, lw=0.7, ls=":", marker="o", ms=3)
        Cv = bezier(P, u)
        ax.plot(Cv[:, 0], Cv[:, 1], color=col, lw=2)
    ax.plot(4, 0, "o", color=INK, ms=6, mfc="none")
    ax.set_title(title, fontsize=10)
    ax.set_aspect("equal")
    ax.set_xlim(-0.5, 8.5)
    ax.set_ylim(-4.5, 3.5)
    ax.set_xticks([0, 4, 8])
save(fig, 1)

if __name__ == "__main__":
    # 표: A의 끝 속도 (3, −6), B의 출발 속도 (6, 9), (6, −12), (3, −6)
    vA = 3 * (np.array(A[3]) - np.array(A[2]))
    vB = [3 * (np.array(Bp[1]) - np.array(Bp[0])) for _, Bp in CASES]
    assert tuple(vA) == (3, -6)
    assert [tuple(v) for v in vB] == [(6, 9), (6, -12), (3, -6)]
    assert np.allclose(vB[1], 2 * vA)                    # G1: 같은 방향, 두 배 빠르기
    print("ALL CHECKS PASSED")
```
{% endraw %}
