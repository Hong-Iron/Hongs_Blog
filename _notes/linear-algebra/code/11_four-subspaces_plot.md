---
layout: "note"
title: "11_four-subspaces_plot.py"
display_title: "11_four-subspaces_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "11"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/four-subspaces/"
parent_title: "랭크와 네 부분공간"
description: "선형대수학 · 랭크와 네 부분공간 그림 생성 코드"
permalink: "/studies/linear-algebra/code/11_four-subspaces_plot/"
---
{% raw %}
[랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 랭크와 네 부분공간 문서의 그림을 만든다: 11_four-subspaces_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_four-subspaces_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_four-subspaces"
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


A = np.array([[1, 2, 3], [2, 4, 6]])
row = np.array([1, 2, 3]) / math.sqrt(14)
n1 = np.array([-2, 1, 0]) / math.sqrt(5)                 # 영공간의 두 방향
n2 = np.cross(row, n1)
rng = np.random.default_rng(3)

# 그림 1: 왼쪽은 입력 공간(행공간 ⟂ 영공간), 오른쪽은 출력 공간(열공간 ⟂ 왼쪽 영공간)
fig = plt.figure(figsize=(6.5, 3.4))
ax = fig.add_subplot(1, 2, 1, projection="3d")
for spine in (ax.xaxis, ax.yaxis, ax.zaxis):
    spine.set_pane_color((1, 1, 1, 0))
    spine.line.set_color(INK)
s, t = np.meshgrid(np.linspace(-1.5, 1.5, 2), np.linspace(-1.5, 1.5, 2))
P = s[..., None] * n1 + t[..., None] * n2
ax.plot_surface(P[..., 0], P[..., 1], P[..., 2], color=C[1], alpha=0.25, linewidth=0)
L = np.outer([-1.6, 1.6], row)
ax.plot(L[:, 0], L[:, 1], L[:, 2], color=C[0], lw=2.5)
ax.text(*(1.7 * row), "행공간", color=C[0], fontsize=9)
ax.text(*(1.5 * n1 - 1.5 * n2), "영공간", color=C[1], fontsize=9)
ax.set_xticks([])
ax.set_yticks([])
ax.set_zticks([])
ax.view_init(elev=15, azim=5)
ax.set_title(r"입력 $\mathbb{R}^3$", fontsize=10)

ax2 = fig.add_subplot(1, 2, 2)
ax2.set_aspect("equal")
ax2.set_xlim(-2.5, 2.5)
ax2.set_ylim(-2.5, 2.5)
ax2.axhline(0, color=INK, lw=0.5)
ax2.axvline(0, color=INK, lw=0.5)
t = np.array([-2.5, 2.5])
ax2.plot(t, 2 * t, color=C[0], lw=2.5)
ax2.plot(t, -t / 2, color=C[2], lw=2.5)
out = (rng.uniform(-0.25, 0.25, size=(60, 3)) @ A.T)     # 여러 입력 x에 대한 출력 Ax
ax2.plot(out[:, 0], out[:, 1], ".", color=C[0], ms=4)
ax2.plot(1, 0, "x", color=C[1], ms=8, mew=2)
ax2.text(1.15, 0.15, r"$\mathbf{b} = (1, 0)$", color=C[1], fontsize=9)
ax2.text(1.35, 1.9, "열공간", color=C[0], fontsize=9)
ax2.text(-2.4, 1.5, "왼쪽 영공간", color=C[2], fontsize=9)
ax2.set_title(r"출력 $\mathbb{R}^2$", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert np.linalg.matrix_rank(A) == 1
    assert np.allclose(A @ n1, 0) and np.allclose(A @ n2, 0)        # 영공간 평면
    assert abs(row @ n1) < 1e-12 and abs(np.array([1, 2]) @ np.array([2, -1])) == 0
    assert np.allclose(out[:, 1], 2 * out[:, 0])                    # 출력은 모두 열공간 위
    print("ALL CHECKS PASSED")
```
{% endraw %}
