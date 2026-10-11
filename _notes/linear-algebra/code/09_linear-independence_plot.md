---
layout: "note"
title: "09_linear-independence_plot.py"
display_title: "09_linear-independence_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "09"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/linear-independence/"
parent_title: "선형독립"
description: "선형대수학 · 선형독립 그림 생성 코드"
permalink: "/studies/linear-algebra/code/09_linear-independence_plot/"
---
{% raw %}
[선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형독립 문서의 그림을 만든다: 09_linear-independence_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 09_linear-independence_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "09_linear-independence"
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



def panel(ax, vecs, title, plane):
    for spine in (ax.xaxis, ax.yaxis, ax.zaxis):
        spine.set_pane_color((1, 1, 1, 0))
        spine.line.set_color(INK)
    if plane:                                            # 앞의 두 벡터가 만드는 평면
        s, t = np.meshgrid(np.linspace(-0.3, 1.4, 2), np.linspace(-0.3, 1.4, 2))
        P = s[..., None] * vecs[0] + t[..., None] * vecs[1]
        ax.plot_surface(P[..., 0], P[..., 1], P[..., 2], color=C[0], alpha=0.15, linewidth=0)
    for i, v in enumerate(vecs):
        ax.quiver(0, 0, 0, *v, color=C[i], lw=2, arrow_length_ratio=0.12)
        ax.text(*(v * 1.08), f"({v[0]}, {v[1]}, {v[2]})", color=C[i], fontsize=8)
    ax.set_xlim(0, 1.5)
    ax.set_ylim(0, 2)
    ax.set_zlim(0, 1.5)
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1, 2])
    ax.set_zticks([0, 1])
    ax.tick_params(labelsize=8, colors=INK)
    ax.view_init(elev=22, azim=-60)
    ax.set_title(title, fontsize=10)


u, w = np.array([1, 1, 0]), np.array([0, 1, 1])
indep = [u, w, np.array([1, 0, 1])]
dep = [u, w, np.array([1, 2, 1])]

# 그림 1: 셋째 벡터가 앞 두 벡터의 평면 밖으로 나가면 독립, 평면 안에 있으면 종속
fig = plt.figure(figsize=(6.5, 3.2))
panel(fig.add_subplot(1, 2, 1, projection="3d"), indep, "독립: 평면 밖으로 나간다", True)
panel(fig.add_subplot(1, 2, 2, projection="3d"), dep, "종속: 평면 안에 있다", True)
fig.subplots_adjust(wspace=0.05)
save(fig, 1)

if __name__ == "__main__":
    assert np.linalg.matrix_rank(np.array(indep)) == 3
    assert np.linalg.matrix_rank(np.array(dep)) == 2 and (dep[2] == u + w).all()
    print("ALL CHECKS PASSED")
```
{% endraw %}
