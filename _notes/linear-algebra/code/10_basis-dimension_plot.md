---
layout: "note"
title: "10_basis-dimension_plot.py"
display_title: "10_basis-dimension_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "10"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/basis-dimension/"
parent_title: "부분공간, 기저와 차원"
description: "선형대수학 · 부분공간, 기저와 차원 그림 생성 코드"
permalink: "/studies/linear-algebra/code/10_basis-dimension_plot/"
---
{% raw %}
[부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 부분공간, 기저와 차원 문서의 그림을 만든다: 10_basis-dimension_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 10_basis-dimension_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "10_basis-dimension"
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


b1, b2 = np.array([1, 0, -1]), np.array([0, 1, -1])
target = 2 * b1 + 3 * b2

# 그림 1: 평면 x + y + z = 0과 기저 두 개, (2, 3, -5) = 2·b1 + 3·b2
fig = plt.figure(figsize=(5.4, 4.2))
ax = fig.add_subplot(projection="3d")
for spine in (ax.xaxis, ax.yaxis, ax.zaxis):
    spine.set_pane_color((1, 1, 1, 0))
    spine.line.set_color(INK)
X, Y = np.meshgrid(np.linspace(-1, 2.5, 8), np.linspace(-1, 3.5, 10))
ax.plot_surface(X, Y, -X - Y, color=C[0], alpha=0.12, linewidth=0)
ax.plot_wireframe(X, Y, -X - Y, color=C[0], lw=0.5, alpha=0.5)
ax.quiver(0, 0, 0, *b1, color=C[1], lw=2.2, arrow_length_ratio=0.25)
ax.quiver(0, 0, 0, *b2, color=C[2], lw=2.2, arrow_length_ratio=0.25)
ax.quiver(0, 0, 0, *(2 * b1), color=C[1], lw=1, ls="--", arrow_length_ratio=0)
ax.quiver(*(2 * b1), *(3 * b2), color=C[2], lw=1, ls="--", arrow_length_ratio=0)
ax.quiver(0, 0, 0, *target, color=C[3], lw=2, arrow_length_ratio=0.08)
ax.text(*(b1 + [0.25, -0.5, -0.3]), r"$\mathbf{b}_1$", color=C[1], fontsize=12)
ax.text(*(b2 + [-0.3, 0.3, 0.4]), r"$\mathbf{b}_2$", color=C[2], fontsize=12)
ax.text(*(target + [0.2, 0.2, 0]), "(2, 3, -5)", color=C[3], fontsize=10)
ax.set_xlabel("x", labelpad=-8)
ax.set_ylabel("y", labelpad=-8)
ax.set_zlabel("z", labelpad=-8)
ax.tick_params(labelsize=8, colors=INK, pad=-2)
ax.view_init(elev=30, azim=30)
save(fig, 1)

if __name__ == "__main__":
    assert tuple(target) == (2, 3, -5) and target.sum() == 0
    assert np.linalg.matrix_rank(np.array([b1, b2])) == 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
