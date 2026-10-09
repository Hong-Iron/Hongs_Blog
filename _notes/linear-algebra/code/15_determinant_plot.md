---
layout: "note"
title: "15_determinant_plot.py"
display_title: "15_determinant_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "15"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/determinant/"
parent_title: "행렬식"
description: "선형대수학 · 행렬식 코드 코드"
permalink: "/studies/linear-algebra/code/15_determinant_plot/"
---
{% raw %}
[행렬식](/Hongs_Blog/studies/linear-algebra/determinant/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 행렬식 문서의 그림을 만든다: 15_determinant_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_determinant_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_determinant"
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


cases = [
    (np.array([[3, 1], [1, 2]]), r"$\det = 5$"),
    (np.array([[1, 3], [2, 1]]), r"$\det = -5$"),
    (np.array([[1, 2], [2, 4]]), r"$\det = 0$"),
]

# 그림 1: 단위 정사각형(점선)이 가는 곳. 첫 열(주황)에서 둘째 열(초록)로 도는 방향이 뒤집히면 음수
fig, axs = plt.subplots(1, 3, figsize=(6.5, 2.7))
for ax, (M, title) in zip(axs, cases):
    a, b = M[:, 0], M[:, 1]
    sq = np.array([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]])
    ax.plot(sq[:, 0], sq[:, 1], color=INK, lw=1, ls="--")
    poly = np.array([[0, 0], a, a + b, b, [0, 0]])
    ax.fill(poly[:, 0], poly[:, 1], color=C[0], alpha=0.2)
    ax.plot(poly[:, 0], poly[:, 1], color=C[0], lw=1)
    arrow(ax, (0, 0), a, C[1], lw=2)
    arrow(ax, (0, 0), b, C[2], lw=2)
    ax.set_xlim(-0.5, 4.5)
    ax.set_ylim(-0.5, 6.5)
    ax.set_aspect("equal")
    ax.set_xticks([0, 2, 4])
    ax.set_yticks([0, 2, 4, 6])
    ax.set_title(title, fontsize=11)
axs[0].text(3.1, 0.6, "열1", color=C[1], fontsize=9)
axs[0].text(0.2, 2.1, "열2", color=C[2], fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    for M, title in cases:
        a, b = M[:, 0], M[:, 1]
        cross = a[0] * b[1] - a[1] * b[0]                 # 첫 열에서 둘째 열로 반시계면 양수
        assert round(np.linalg.det(M)) == cross
    assert [round(np.linalg.det(M)) for M, _ in cases] == [5, -5, 0]
    print("ALL CHECKS PASSED")
```
{% endraw %}
