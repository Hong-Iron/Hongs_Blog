---
layout: "note"
title: "06_matrix-multiplication_plot.py"
display_title: "06_matrix-multiplication_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "06"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/matrix-multiplication/"
parent_title: "행렬 곱셈과 전치"
description: "선형대수학 · 행렬 곱셈과 전치 그림 생성 코드"
permalink: "/studies/linear-algebra/code/06_matrix-multiplication_plot/"
---
{% raw %}
[행렬 곱셈과 전치](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 행렬 곱셈과 전치 문서의 그림을 만든다: 06_matrix-multiplication_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 06_matrix-multiplication_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "06_matrix-multiplication"
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


R = np.array([[0, -1], [1, 0]])
S = np.array([[2, 0], [0, 1]])
F = [np.array([[0, 0], [0, 2], [1, 2]]).T, np.array([[0, 1], [0.7, 1]]).T]   # 글자 F의 획


def draw(ax, M, title, color):
    ax.set_xlim(-4.6, 2.2)
    ax.set_ylim(-0.6, 2.6)
    ax.set_aspect("equal")
    ax.axhline(0, color=INK, lw=0.6)
    ax.axvline(0, color=INK, lw=0.6)
    for s in F:
        ax.plot(*(M @ s), color=color, lw=3, solid_capstyle="round")
    p = M @ np.array([1, 0])
    ax.plot(*p, "o", color=C[1], ms=6)
    ax.text(p[0] + 0.12, p[1] + 0.12, f"({p[0]:g}, {p[1]:g})", color=C[1], fontsize=9)
    ax.set_title(title, fontsize=10)
    ax.set_xticks([-4, -2, 0, 2])
    ax.set_yticks([0, 1, 2])


# 그림 1: 글자 F와 점 (1, 0)에 두 순서로 회전과 늘이기를 한 결과
fig, axs = plt.subplots(1, 3, figsize=(6.5, 2.6))
draw(axs[0], np.eye(2), "처음", INK)
draw(axs[1], S @ R, "$SR$: 회전 뒤 늘이기", C[0])
draw(axs[2], R @ S, "$RS$: 늘이기 뒤 회전", C[2])
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert (S @ R == np.array([[0, -2], [1, 0]])).all() and (R @ S == np.array([[0, -1], [2, 0]])).all()
    assert tuple(S @ R @ [1, 0]) == (0, 1) and tuple(R @ S @ [1, 0]) == (0, 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
