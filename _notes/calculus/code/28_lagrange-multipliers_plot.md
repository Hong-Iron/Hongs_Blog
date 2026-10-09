---
layout: "note"
title: "28_lagrange-multipliers_plot.py"
display_title: "28_lagrange-multipliers_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "28"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/lagrange-multipliers/"
parent_title: "라그랑주 승수법"
description: "미분적분학 · 라그랑주 승수법 코드 코드"
permalink: "/studies/calculus/code/28_lagrange-multipliers_plot/"
---
{% raw %}
[라그랑주 승수법](/Hongs_Blog/studies/calculus/lagrange-multipliers/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 라그랑주 승수법 문서의 그림을 만든다: 28_lagrange-multipliers_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 28_lagrange-multipliers_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "28_lagrange-multipliers"
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


# 그림 1: 넓이 xy의 등고선과 둘레 제약 x + y = 10. 최댓점 (5, 5)에서 등고선 xy = 25가 직선에 접하고, 두 그래디언트가 같은 방향이다
fig, ax = plt.subplots(figsize=(4.8, 4.0))
X, Y = np.meshgrid(np.linspace(0.2, 10, 300), np.linspace(0.2, 10, 300))
cs = ax.contour(X, Y, X * Y, levels=[9, 16, 25, 36], colors=INK, linewidths=0.8)
ax.clabel(cs, fontsize=8, fmt="xy=%g")
ax.contour(X, Y, X * Y, levels=[25], colors=C[2], linewidths=2)
ax.plot([0, 10], [10, 0], color=C[0], lw=2, label="제약 $x+y=10$")
ax.plot([5], [5], "o", ms=6, color=INK)
S = 0.35
ax.annotate("", xy=(5 + 5 * S, 5 + 5 * S), xytext=(5, 5), arrowprops=dict(arrowstyle="-|>", color=C[1], lw=2))
ax.annotate("", xy=(5 + 1 * S * 2, 5 + 1 * S * 2), xytext=(5, 5), arrowprops=dict(arrowstyle="-|>", color=C[0], lw=2))
ax.text(5 + 5 * S + 0.1, 5 + 5 * S + 0.1, r"$\nabla f=(5,5)$", color=C[1], fontsize=9)
ax.text(5 + 2 * S + 0.25, 5 + 2 * S - 0.35, r"$\nabla g=(1,1)$", color=C[0], fontsize=9)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.set_aspect("equal")
ax.set_xlabel("가로 $x$")
ax.set_ylabel("세로 $y$")
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 직선 위 최댓값 25가 x = 5, ∇f = 5∇g, 등고선 xy = 25의 (5, 5) 접선 기울기 -1 = 직선 기울기
    xs = np.linspace(0, 10, 100001)
    area = xs * (10 - xs)
    assert abs(xs[np.argmax(area)] - 5) < 1e-4 and abs(area.max() - 25) < 1e-8
    assert np.allclose(np.array([5, 5]), 5 * np.array([1, 1]))
    h = 1e-6
    slope = ((25 / (5 + h)) - (25 / (5 - h))) / (2 * h)
    assert abs(slope + 1) < 1e-8
    print("ALL CHECKS PASSED")
```
{% endraw %}
