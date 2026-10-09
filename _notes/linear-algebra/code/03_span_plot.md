---
layout: "note"
title: "03_span_plot.py"
display_title: "03_span_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "03"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/span/"
parent_title: "선형결합과 생성"
description: "선형대수학 · 선형결합과 생성 코드 코드"
permalink: "/studies/linear-algebra/code/03_span_plot/"
---
{% raw %}
[선형결합과 생성](/Hongs_Blog/studies/linear-algebra/span/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형결합과 생성 문서의 그림을 만든다: 03_span_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 03_span_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "03_span"
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


rng = np.random.default_rng(1)


def setup(ax):
    ax.set_xlim(-2, 5)
    ax.set_ylim(-2, 7)
    ax.set_aspect("equal")
    ax.axhline(0, color=INK, lw=0.6)
    ax.axvline(0, color=INK, lw=0.6)


a, b = np.array([1, 1]), np.array([1, 2])
target = np.array([3, 5])

# 그림 1: 왼쪽은 방향이 다른 두 벡터, 오른쪽은 평행한 두 벡터
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.8))
setup(a1)
t = np.array([-10, 10])
for k in range(-8, 9):                                   # c·a + d·b에서 c 또는 d가 정수인 선들
    a1.plot(*(np.outer(t, a) + k * b).T, color=C[0], lw=0.5, alpha=0.35)
    a1.plot(*(np.outer(t, b) + k * a).T, color=C[0], lw=0.5, alpha=0.35)
arrow(a1, (0, 0), a, C[1])
arrow(a1, a, 2 * b, C[2])
a1.plot(*target, "o", color=INK)
a1.text(target[0] + 0.2, target[1] - 0.1, "(3, 5)", fontsize=10)
a1.text(0.65, 0.05, r"$\mathbf{a}$", color=C[1], fontsize=11)
a1.text(1.9, 3.2, r"$2\mathbf{b}$", color=C[2], fontsize=11, ha="right")
a1.set_title(r"$\mathbf{a}=(1,1)$, $\mathbf{b}=(1,2)$", fontsize=10)

setup(a2)
a_, b_ = np.array([1, 2]), np.array([2, 4])
cd = rng.uniform(-3, 3, size=(300, 2))
pts = cd[:, :1] * a_ + cd[:, 1:] * b_
a2.plot(pts[:, 0], pts[:, 1], ".", color=C[0], ms=3, alpha=0.6)
a2.plot([-2, 5], [-4, 10], color=C[0], lw=0.8, alpha=0.5)
arrow(a2, (0, 0), a_, C[1], lw=2.4)
a2.plot(*target, "x", color=C[1], ms=8, mew=2)
a2.text(target[0] + 0.2, target[1] - 0.1, "(3, 5)", fontsize=10)
a2.text(2.1, 4.6, r"$y = 2x$", fontsize=10, ha="right")
a2.set_title(r"$\mathbf{a}=(1,2)$, $\mathbf{b}=(2,4)$", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert tuple(1 * a + 2 * b) == (3, 5)
    assert np.allclose(pts[:, 1], 2 * pts[:, 0])          # 평행한 두 벡터의 결합은 모두 y = 2x 위
    assert target[1] != 2 * target[0]                     # (3, 5)는 그 직선 밖
    print("ALL CHECKS PASSED")
```
{% endraw %}
