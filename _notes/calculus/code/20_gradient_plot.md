---
layout: "note"
title: "20_gradient_plot.py"
display_title: "20_gradient_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "20"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/gradient/"
parent_title: "그래디언트와 방향도함수"
description: "미분적분학 · 그래디언트와 방향도함수 코드 코드"
permalink: "/studies/calculus/code/20_gradient_plot/"
---
{% raw %}
[그래디언트와 방향도함수](/Hongs_Blog/studies/calculus/gradient/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 그래디언트와 방향도함수 문서의 그림을 만든다: 20_gradient_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_gradient_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_gradient"
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


def f(x, y):
    return 10 - x ** 2 - 2 * y ** 2


P = np.array([1.0, 1.0])
GRAD = np.array([-2 * P[0], -4 * P[1]])
TANG = np.array([2.0, -1.0]) / math.sqrt(5)


def arrow(ax, start, vec, color, text, offset):
    ax.annotate("", xy=start + vec, xytext=start, arrowprops=dict(arrowstyle="-|>", color=color, lw=2))
    ax.text(*(start + vec + offset), text, color=color, fontsize=10, ha="center", va="center")


# 그림 1: 언덕 10 - x^2 - 2y^2의 등고선과 (1, 1)의 그래디언트. 그래디언트는 등고선에 수직이고 정상 쪽을 향한다
fig, ax = plt.subplots(figsize=(5.4, 3.9))
X, Y = np.meshgrid(np.linspace(-2.3, 2.3, 300), np.linspace(-1.6, 1.6, 300))
cs = ax.contour(X, Y, f(X, Y), levels=[2, 4, 6, 7, 8, 9.5], colors=INK, linewidths=0.8)
ax.clabel(cs, fontsize=8, fmt="%g")
ax.contour(X, Y, f(X, Y), levels=[7], colors=C[2], linewidths=2)
ax.plot([0], [0], "+", ms=10, color=INK)
ax.text(0.08, -0.15, "정상", fontsize=9)
ax.plot(*P, "o", ms=6, color=INK)
arrow(ax, P, GRAD / np.linalg.norm(GRAD) * 0.9, C[1], r"$\nabla f$ 방향", np.array([0.45, -0.05]))
arrow(ax, P, TANG * 0.9, C[2], "등고선 방향", np.array([0.55, 0.0]))
arrow(ax, P, -TANG * 0.9, C[2], "", np.array([0, 0]))
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

if __name__ == "__main__":
    # 표의 네 방향도함수(극한을 수치로), 그래디언트와 등고선 방향이 수직, (1, 1)이 높이 7 등고선 위
    h = 1e-6

    def D(u):
        u = np.asarray(u, float)
        return (f(*(P + h * u)) - f(*(P - h * u))) / (2 * h)

    assert abs(D([1, 0]) + 2) < 1e-6 and abs(D([0, 1]) + 4) < 1e-6
    assert abs(D(np.array([-1, -2]) / math.sqrt(5)) - math.sqrt(20)) < 1e-6
    assert abs(D(TANG)) < 1e-6 and abs(GRAD @ TANG) < 1e-12
    assert f(*P) == 7
    print("ALL CHECKS PASSED")
```
{% endraw %}
