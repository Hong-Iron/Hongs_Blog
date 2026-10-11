---
layout: "note"
title: "14_change-of-basis_plot.py"
display_title: "14_change-of-basis_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "14"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/change-of-basis/"
parent_title: "기저 변환"
description: "선형대수학 · 기저 변환 그림 생성 코드"
permalink: "/studies/linear-algebra/code/14_change-of-basis_plot/"
---
{% raw %}
[기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 기저 변환 문서의 그림을 만든다: 14_change-of-basis_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 14_change-of-basis_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "14_change-of-basis"
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


def arrow(ax, start, vec, color, lw=1.8, ls="-"):
    """start에서 vec만큼 가는 화살표"""
    ax.annotate("", xy=(start[0] + vec[0], start[1] + vec[1]), xytext=(start[0], start[1]),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, ls=ls, shrinkA=0, shrinkB=0,
                                mutation_scale=12))


b1, b2 = np.array([1, 1]), np.array([1, -1])
P = np.column_stack([b1, b2])
x = np.array([3, 1])
c = np.linalg.solve(P, x)
y = P @ (c * [1, -1])                                    # 새 좌표에서 둘째 좌표만 뒤집기

# 그림 1: 새 기저 b1, b2의 눈금 위에서 본 반사. (3, 1)은 새 좌표 (2, 1), 반사하면 (2, -1) = (1, 3)
fig, ax = plt.subplots(figsize=(5, 4.2))
ax.set_aspect("equal")
ax.set_xlim(-1, 5)
ax.set_ylim(-2, 4.5)
for k in range(-6, 7):
    for d, o in ((b1, k * b2), (b2, k * b1)):
        seg = np.outer([-6, 6], d) + o
        ax.plot(seg[:, 0], seg[:, 1], color=C[0], lw=0.5, alpha=0.3)
ax.plot([-1, 5], [-1, 5], color=INK, lw=1.2, ls="--")
ax.text(4.3, 4.45, r"$y = x$", fontsize=10, va="top", ha="right")
arrow(ax, (0, 0), b1, C[1], lw=2)
arrow(ax, (0, 0), b2, C[2], lw=2)
ax.text(0.45, 0.85, r"$\mathbf{b}_1$", color=C[1], fontsize=11)
ax.text(0.65, -1.15, r"$\mathbf{b}_2$", color=C[2], fontsize=11)
arrow(ax, (0, 0), 2 * b1, C[1], lw=1, ls=":")
arrow(ax, 2 * b1, b2, C[2], lw=1)
arrow(ax, 2 * b1, -b2, C[2], lw=1)
ax.plot(*x, "o", color=C[3])
ax.plot(*y, "o", color=C[3])
ax.text(x[0] + 0.15, x[1] - 0.25, "(3, 1)\n새 좌표 (2, 1)", color=C[3], fontsize=9)
ax.text(y[0] - 0.15, y[1] + 0.15, "(1, 3)\n새 좌표 (2, -1)", color=C[3], fontsize=9, ha="right")
save(fig, 1)

if __name__ == "__main__":
    assert np.allclose(c, [2, 1]) and np.allclose(y, [1, 3])
    A = np.array([[0, 1], [1, 0]])
    assert np.allclose(np.linalg.inv(P) @ A @ P, np.diag([1, -1]))
    print("ALL CHECKS PASSED")
```
{% endraw %}
