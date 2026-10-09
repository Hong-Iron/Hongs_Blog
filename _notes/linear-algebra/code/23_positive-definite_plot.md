---
layout: "note"
title: "23_positive-definite_plot.py"
display_title: "23_positive-definite_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "23"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/positive-definite/"
parent_title: "양의 정부호 행렬과 이차형식"
description: "선형대수학 · 양의 정부호 행렬과 이차형식 코드 코드"
permalink: "/studies/linear-algebra/code/23_positive-definite_plot/"
---
{% raw %}
[양의 정부호 행렬과 이차형식](/Hongs_Blog/studies/linear-algebra/positive-definite/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 양의 정부호 행렬과 이차형식 문서의 그림을 만든다: 23_positive-definite_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_positive-definite_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_positive-definite"
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


x = np.linspace(-1.6, 1.6, 300)
X, Y = np.meshgrid(x, x)
E1 = 2 * X ** 2 - 2 * X * Y + 2 * Y ** 2                # [[2, -1], [-1, 2]]
E2 = X ** 2 + 4 * X * Y + Y ** 2                         # [[1, 2], [2, 1]]
levels = [0.25, 1, 2, 3, 4]

# 그림 1: 이차형식의 등고선. 왼쪽은 모든 방향으로 올라가는 그릇, 오른쪽은 음수 영역이 있는 말안장
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.3))
cs = a1.contour(X, Y, E1, levels=levels, colors=C[0], linewidths=1)
a1.clabel(cs, fontsize=8, fmt="%g")
a1.plot(0, 0, "o", color=C[0], ms=5)
a1.set_title(r"$2x^2 - 2xy + 2y^2$: 그릇", fontsize=10)
a2.contourf(X, Y, E2, levels=[-20, 0], colors=[C[1]], alpha=0.15)
cs = a2.contour(X, Y, E2, levels=[-2, -1, 1, 2, 4], colors=[C[1], C[1], C[0], C[0], C[0]], linewidths=1)
a2.clabel(cs, fontsize=8, fmt="%g")
a2.contour(X, Y, E2, levels=[0], colors=INK, linewidths=0.8, linestyles="--")
a2.plot(1, -1, "o", color=C[1], ms=5)
a2.set_title(r"$x^2 + 4xy + y^2$: 말안장", fontsize=10)
for ax in (a1, a2):
    ax.set_aspect("equal")
    ax.set_xticks([-1, 0, 1])
    ax.set_yticks([-1, 0, 1])
    ax.set_xlabel("$x$")
a1.set_ylabel("$y$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    S1 = np.array([[2, -1], [-1, 2]])
    S2 = np.array([[1, 2], [2, 1]])
    assert (np.linalg.eigvalsh(S1) > 0).all() and np.allclose(np.linalg.eigvalsh(S2), [-1, 3])
    v = np.array([1, -1])
    assert v @ S2 @ v == -2 and v @ S1 @ v == 6
    assert np.allclose(E1, X ** 2 + Y ** 2 + (X - Y) ** 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
