---
layout: "note"
title: "19_eigenvalues_plot.py"
display_title: "19_eigenvalues_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "19"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/eigenvalues/"
parent_title: "고윳값과 고유벡터"
description: "선형대수학 · 고윳값과 고유벡터 그림 생성 코드"
permalink: "/studies/linear-algebra/code/19_eigenvalues_plot/"
---
{% raw %}
[고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 고윳값과 고유벡터 문서의 그림을 만든다: 19_eigenvalues_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_eigenvalues_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_eigenvalues"
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


A = np.array([[0.8, 0.3], [0.2, 0.7]])
steady = np.array([0.6, 0.4])
starts = [np.array([1.0, 0.0]), np.array([0.0, 1.0])]
K = 8


def orbit(u0):
    us = [u0]
    for _ in range(K):
        us.append(A @ us[-1])
    return np.array(us)


# 그림 1: (도심, 교외) 비율이 해마다 A를 곱해 움직이는 길. 고유벡터 (1, -1) 방향을 따라 (0.6, 0.4)로 간다
fig, ax = plt.subplots(figsize=(4.6, 4.2))
ax.set_aspect("equal")
t = np.array([-0.2, 1.2])
ax.plot(t * 1.5, t, color=C[0], lw=1)
ax.text(1.1, 0.68, r"$\lambda = 1$ 방향", color=C[0], fontsize=9, ha="right")
for i, u0 in enumerate(starts):
    us = orbit(u0)
    ax.plot(us[:, 0], us[:, 1], "o-", color=C[i + 1], ms=4, lw=1)
ax.plot(*steady, "*", color=C[0], ms=14, zorder=3)
ax.text(0.62, 0.42, "(0.6, 0.4)", color=C[0], fontsize=10)
ax.text(1.0, -0.06, "출발 (1, 0)", color=C[1], fontsize=9, ha="center", va="top")
ax.text(0.03, 1.0, "출발 (0, 1)", color=C[2], fontsize=9)
ax.set_xlim(-0.1, 1.15)
ax.set_ylim(-0.15, 1.1)
ax.set_xlabel("도심 비율")
ax.set_ylabel("교외 비율")
save(fig, 1)

if __name__ == "__main__":
    us = orbit(starts[0])
    assert np.allclose(us[1:4], [[0.8, 0.2], [0.7, 0.3], [0.65, 0.35]])
    assert np.allclose(A @ steady, steady) and np.allclose(A @ [1, -1], [0.5, -0.5])
    # 출발점에서 (0.6, 0.4)를 뺀 차이는 늘 (1, -1) 방향이고 해마다 절반이 된다
    d = us - steady
    assert np.allclose(d[:, 0], -d[:, 1]) and np.allclose(d[1:, 0] / d[:-1, 0], 0.5)
    print("ALL CHECKS PASSED")
```
{% endraw %}
