---
layout: "note"
title: "01_vectors_plot.py"
display_title: "01_vectors_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "01"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/vectors/"
parent_title: "벡터"
description: "선형대수학 · 벡터 코드 코드"
permalink: "/studies/linear-algebra/code/01_vectors_plot/"
---
{% raw %}
[벡터](/Hongs_Blog/studies/linear-algebra/vectors/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 벡터 문서의 그림을 만든다: 01_vectors_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 01_vectors_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "01_vectors"
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



def setup(ax, xlim, ylim):
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.set_aspect("equal")
    ax.grid(color=INK, alpha=0.15, lw=0.6)
    ax.set_xticks(range(xlim[0], xlim[1] + 1, 2))
    ax.set_yticks(range(ylim[0], ylim[1] + 1, 2))


P = np.array([1, 2])
v = np.array([3, 4])
w = np.array([-1, 0])

# 그림 1: 왼쪽은 위치에 이동을 이어 붙이기, 오른쪽은 스칼라배와 덧셈
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.4))
setup(a1, (0, 6), (0, 8))
a1.plot(*P, "o", color=INK)
a1.text(P[0] + 0.2, P[1] - 0.5, "출발 (1, 2)", fontsize=10)
arrow(a1, P, v, C[0])
a1.text(2.9, 3.6, r"$\mathbf{v} = (3, 4)$", color=C[0], fontsize=10, ha="left")
a1.plot(*(P + v), "o", color=C[1])
a1.text(P[0] + v[0] + 0.15, P[1] + v[1] + 0.3, "1초 뒤 (4, 6)", color=C[1], fontsize=10, ha="center")
a1.set_title("위치 + 이동", fontsize=11)

setup(a2, (-2, 7), (0, 9))
a2.plot([0, 6], [0, 8], color=C[2], lw=7, alpha=0.3, solid_capstyle="butt")
a2.plot(6, 8, "o", color=C[2], ms=6)
arrow(a2, (0, 0), v, C[0])
arrow(a2, v, w, C[1])
arrow(a2, (0, 0), v + w, C[3])
a2.text(6.1, 7.6, r"$2\mathbf{v}$", color=C[2], fontsize=10)
a2.text(3.3, 3.2, r"$\mathbf{v}$", color=C[0], fontsize=10)
a2.text(2.6, 4.35, r"$\mathbf{w}$", color=C[1], fontsize=10)
a2.text(0.9, 2.9, r"$\mathbf{v} + \mathbf{w}$", color=C[3], fontsize=10, ha="right")
a2.set_title("스칼라배와 덧셈", fontsize=11)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert tuple(P + v) == (4, 6)
    assert tuple(2 * v) == (6, 8)
    assert tuple(v + w) == (2, 4)
    assert abs(math.hypot(*v) - 5) < 1e-12 and abs(math.degrees(math.atan2(4, 3)) - 53.13) < 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
