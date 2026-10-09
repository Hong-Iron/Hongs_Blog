---
layout: "note"
title: "04_matrix-vector_plot.py"
display_title: "04_matrix-vector_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "04"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/matrix-vector/"
parent_title: "행렬과 행렬-벡터 곱"
description: "선형대수학 · 행렬과 행렬-벡터 곱 코드 코드"
permalink: "/studies/linear-algebra/code/04_matrix-vector_plot/"
---
{% raw %}
[행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 행렬과 행렬-벡터 곱 문서의 그림을 만든다: 04_matrix-vector_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 04_matrix-vector_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "04_matrix-vector"
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


A = np.array([[2, 1], [1, 3]])
x = np.array([4, 5])
b = A @ x

# 그림 1: 같은 계산의 열 관점(왼쪽)과 행 관점(오른쪽)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.6))
a1.set_aspect("equal")
a1.set_xlim(-1, 16)
a1.set_ylim(-1, 21)
arrow(a1, (0, 0), 4 * A[:, 0], C[0])
arrow(a1, 4 * A[:, 0], 5 * A[:, 1], C[1])
arrow(a1, (0, 0), b, C[2], lw=1.2, ls="--")
a1.text(4.2, 0.4, r"$4 \times$ 열1", color=C[0], fontsize=10)
a1.text(11.2, 9, r"$5 \times$ 열2", color=C[1], fontsize=10)
a1.plot(*b, "o", color=C[2])
a1.text(b[0] - 0.6, b[1] + 0.2, "(13, 19)", color=C[2], fontsize=10, ha="right")
a1.set_title("열 관점: 열을 섞는다", fontsize=10)
a1.set_xlabel("재료 1")
a1.set_ylabel("재료 2")

x1 = np.linspace(0, 8, 50)
a2.plot(x1, 13 - 2 * x1, color=C[0])
a2.plot(x1, (19 - x1) / 3, color=C[1])
a2.text(1.0, 11.5, r"$2x_1 + x_2 = 13$", color=C[0], fontsize=10)
a2.text(5.2, 5.2, r"$x_1 + 3x_2 = 19$", color=C[1], fontsize=10)
a2.plot(*x, "o", color=C[2])
a2.text(x[0] - 0.3, x[1] - 1.3, "(4, 5)", color=C[2], fontsize=10, ha="right")
a2.set_xlim(0, 8)
a2.set_ylim(0, 14)
a2.set_title("행 관점: 직선의 교점", fontsize=10)
a2.set_xlabel(r"$x_1$")
a2.set_ylabel(r"$x_2$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert tuple(b) == (13, 19)
    assert tuple(4 * A[:, 0] + 5 * A[:, 1]) == (13, 19)
    assert np.allclose(np.linalg.solve(A, [13, 19]), [4, 5])
    print("ALL CHECKS PASSED")
```
{% endraw %}
