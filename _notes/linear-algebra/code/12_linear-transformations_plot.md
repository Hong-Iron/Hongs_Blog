---
layout: "note"
title: "12_linear-transformations_plot.py"
display_title: "12_linear-transformations_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "12"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/linear-transformations/"
parent_title: "선형변환"
description: "선형대수학 · 선형변환 코드 코드"
permalink: "/studies/linear-algebra/code/12_linear-transformations_plot/"
---
{% raw %}
[선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형변환 문서의 그림을 만든다: 12_linear-transformations_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 12_linear-transformations_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "12_linear-transformations"
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


th = math.radians(30)
mats = [
    ("회전 30°", np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])),
    (r"$x$축 반사", np.array([[1, 0], [0, -1]])),
    (r"$x$축 사영", np.array([[1, 0], [0, 0]])),
    ("전단 $k = 1$", np.array([[1, 1], [0, 1]])),
]
F = [np.array([[0, 0], [0, 2], [1, 2]]).T, np.array([[0, 1], [0.7, 1]]).T]   # 글자 F의 획

# 그림 1: 네 변환이 격자와 글자 F를 바꾸는 모습. 직선은 직선으로, 평행선은 평행선으로 간다
fig, axs = plt.subplots(1, 4, figsize=(6.5, 2.3))
for ax, (title, M) in zip(axs, mats):
    for k in range(-3, 4):
        for seg in (np.array([[k, -3], [k, 3]]).T, np.array([[-3, k], [3, k]]).T):
            ax.plot(*(M @ seg), color=INK, lw=0.4, alpha=0.5)
    for s in F:
        ax.plot(*s, color=INK, lw=2.5, alpha=0.3, solid_capstyle="round")
        ax.plot(*(M @ s), color=C[0], lw=2.5, solid_capstyle="round")
    arrow(ax, (0, 0), M[:, 0], C[1], lw=1.6)
    arrow(ax, (0, 0), M[:, 1], C[2], lw=1.6)
    ax.set_xlim(-2.2, 2.6)
    ax.set_ylim(-2.4, 2.6)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    for sp in ax.spines.values():
        sp.set_visible(False)
    ax.set_title(title, fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    R = mats[0][1]
    assert np.allclose(R @ [1, 0], [math.cos(th), math.sin(th)]) and np.allclose(R @ [0, 1], [-math.sin(th), math.cos(th)])
    assert tuple(mats[1][1] @ [0, 1]) == (0, -1) and tuple(mats[2][1] @ [0, 1]) == (0, 0)
    assert tuple(mats[3][1] @ [0, 1]) == (1, 1)
    print("ALL CHECKS PASSED")
```
{% endraw %}
