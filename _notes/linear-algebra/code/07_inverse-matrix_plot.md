---
layout: "note"
title: "07_inverse-matrix_plot.py"
display_title: "07_inverse-matrix_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "07"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/inverse-matrix/"
parent_title: "역행렬"
description: "선형대수학 · 역행렬 그림 생성 코드"
permalink: "/studies/linear-algebra/code/07_inverse-matrix_plot/"
---
{% raw %}
[역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 역행렬 문서의 그림을 만든다: 07_inverse-matrix_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 07_inverse-matrix_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "07_inverse-matrix"
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


B = np.array([[1, 2], [2, 4]])
rng = np.random.default_rng(2)


def setup(ax, title):
    ax.set_xlim(-3, 5)
    ax.set_ylim(-3, 9)
    ax.set_aspect("equal")
    ax.axhline(0, color=INK, lw=0.6)
    ax.axvline(0, color=INK, lw=0.6)
    ax.set_title(title, fontsize=10)


# 그림 1: 특이 행렬 B는 평면 전체를 직선 y = 2x 위로 납작하게 누른다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.8))
setup(a1, "입력 평면")
pts = rng.uniform(-2.5, 2.5, size=(400, 2))
a1.plot(pts[:, 0], pts[:, 1], ".", color=C[0], ms=2.5, alpha=0.5)
t = np.linspace(-3, 5, 2)
a1.plot(t, -t / 2, color=C[1], lw=2)
a1.text(4.8, -2.9, r"$x + 2y = 0$", color=C[1], fontsize=9, ha="right")
for p, lab, dx in [((2, -1), "(2, -1)", 0.25), ((0, 0), "(0, 0)", -1.9)]:
    a1.plot(*p, "o", color=C[1], ms=6)
    a1.text(p[0] + dx, p[1] + 0.35, lab, color=C[1], fontsize=9)

setup(a2, r"$B$를 곱한 뒤")
img = pts @ B.T
a2.plot(img[:, 0], img[:, 1], ".", color=C[0], ms=2.5, alpha=0.5)
a2.plot(t, 2 * t, color=C[0], lw=0.8, alpha=0.5)
a2.plot(0, 0, "o", color=C[1], ms=6)
a2.text(0.3, -0.9, "(0, 0) 하나로", color=C[1], fontsize=9)
a2.text(4.3, 7.0, r"$y = 2x$", fontsize=9, ha="right")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert tuple(B @ [2, -1]) == (0, 0) and tuple(B @ [0, 0]) == (0, 0)
    assert np.allclose(img[:, 1], 2 * img[:, 0])        # 모든 출력이 y = 2x 위
    assert round(np.linalg.det(B)) == 0
    A = np.array([[2, 1], [5, 3]])
    assert np.allclose(np.linalg.inv(A), [[3, -1], [-5, 2]]) and tuple(A @ [1, 2]) == (4, 11)
    print("ALL CHECKS PASSED")
```
{% endraw %}
