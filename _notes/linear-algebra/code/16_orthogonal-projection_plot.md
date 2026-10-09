---
layout: "note"
title: "16_orthogonal-projection_plot.py"
display_title: "16_orthogonal-projection_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "16"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/orthogonal-projection/"
parent_title: "직교성과 직교 사영"
description: "선형대수학 · 직교성과 직교 사영 코드 코드"
permalink: "/studies/linear-algebra/code/16_orthogonal-projection_plot/"
---
{% raw %}
[직교성과 직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 직교성과 직교 사영 문서의 그림을 만든다: 16_orthogonal-projection_fig1.svg, 16_orthogonal-projection_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_orthogonal-projection_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_orthogonal-projection"
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


a = np.array([1, 2, 2])
b = np.array([1, 1, 1])
xhat = (a @ b) / (a @ a)
p = xhat * a
e = b - p

# 그림 1: b = (1, 1, 1)을 a = (1, 2, 2) 방향 직선에 사영. 오차 e가 직선과 수직
fig = plt.figure(figsize=(5, 4))
ax = fig.add_subplot(projection="3d")
for spine in (ax.xaxis, ax.yaxis, ax.zaxis):
    spine.set_pane_color((1, 1, 1, 0))
    spine.line.set_color(INK)
L = np.outer([-0.1, 1.2], a)
ax.plot(L[:, 0], L[:, 1], L[:, 2], color=C[0], lw=1, alpha=0.6)
ax.quiver(0, 0, 0, *a, color=C[0], lw=1.2, arrow_length_ratio=0.08)
ax.quiver(0, 0, 0, *b, color=INK, lw=2, arrow_length_ratio=0.12)
ax.quiver(0, 0, 0, *p, color=C[1], lw=2.6, arrow_length_ratio=0.15)
ax.quiver(*p, *e, color=C[2], lw=2, arrow_length_ratio=0.25)
u = a / np.linalg.norm(a) * 0.12                          # 직각 표시
w = e / np.linalg.norm(e) * 0.12
sq = np.array([p - u, p - u + w, p + w])
ax.plot(sq[:, 0], sq[:, 1], sq[:, 2], color=INK, lw=0.8)
ax.text(*(a * 1.03), r"$\mathbf{a}$", color=C[0], fontsize=12)
ax.text(*(b + [0.05, 0, 0.08]), r"$\mathbf{b}$", fontsize=12)
ax.text(*(p * 0.5 + [0, 0.1, 0.25]), r"$\mathbf{p}$", color=C[1], fontsize=12)
ax.text(*(p + e * 0.5 + [0.03, 0, 0.05]), r"$\mathbf{e}$", color=C[2], fontsize=12)
ax.set_xlim(0, 1.2)
ax.set_ylim(0, 2.2)
ax.set_zlim(0, 2.2)
ax.set_xticks([0, 1])
ax.set_yticks([0, 1, 2])
ax.set_zticks([0, 1, 2])
ax.tick_params(labelsize=8, colors=INK)
ax.view_init(elev=15, azim=-75)
save(fig, 1)

# 그림 2: x축으로 내리는 두 방법. 수직으로 내리면(직교 사영) 가장 가깝고, 비스듬히 내리면 더 멀다
Pobl = np.array([[1, 1], [0, 0]])
q = np.array([0, 1])
fig, ax = plt.subplots(figsize=(5, 2.6))
ax.set_aspect("equal")
ax.axhline(0, color=C[0], lw=2)
ax.plot(*q, "o", color=INK, ms=7)
ax.text(q[0] - 0.08, q[1] + 0.08, "(0, 1)", ha="right", fontsize=10)
po = Pobl @ q
arrow(ax, q, po - q, C[1], lw=1.8, ls="--")
arrow(ax, q, -q, C[2], lw=1.8)
ax.plot(*po, "o", color=C[1], ms=6)
ax.plot(0, 0, "o", color=C[2], ms=6)
ax.text(0.62, 0.62, r"비스듬히: 거리 $\sqrt{2}$", color=C[1], fontsize=10)
ax.text(-0.08, 0.45, "수직으로: 거리 1", color=C[2], fontsize=10, ha="right")
ax.text(1.05, -0.22, "(1, 0)", color=C[1], fontsize=10)
ax.text(-0.05, -0.22, "(0, 0)", color=C[2], fontsize=10, ha="right")
ax.set_xlim(-1.6, 2)
ax.set_ylim(-0.4, 1.3)
ax.set_xticks([-1, 0, 1, 2])
ax.set_yticks([0, 1])
save(fig, 2)

if __name__ == "__main__":
    assert abs(xhat - 5 / 9) < 1e-12 and np.allclose(e, [4 / 9, -1 / 9, -1 / 9]) and abs(a @ e) < 1e-12
    assert (Pobl @ Pobl == Pobl).all() and tuple(Pobl @ q) == (1, 0)
    assert abs(np.linalg.norm(q - po) - math.sqrt(2)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
