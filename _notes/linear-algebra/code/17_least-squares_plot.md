---
layout: "note"
title: "17_least-squares_plot.py"
display_title: "17_least-squares_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "17"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/least-squares/"
parent_title: "최소제곱법"
description: "선형대수학 · 최소제곱법 코드 코드"
permalink: "/studies/linear-algebra/code/17_least-squares_plot/"
---
{% raw %}
[최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 최소제곱법 문서의 그림을 만든다: 17_least-squares_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 17_least-squares_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "17_least-squares"
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


t = np.array([1, 2, 3, 4])
y = np.array([2, 3, 5, 6])
A = np.column_stack([np.ones(4), t])
Cc, D = np.linalg.solve(A.T @ A, A.T @ y)
res = y - (Cc + D * t)

# 그림 1: 네 점과 최소제곱 직선. 세로 막대가 잔차이고, 그 제곱의 합 0.2가 가장 작다
fig, ax = plt.subplots(figsize=(5.5, 3.6))
tt = np.linspace(0.5, 4.5, 2)
ax.plot(tt, Cc + D * tt, color=C[0], lw=2)
for ti, yi, ri in zip(t, y, res):
    ax.plot([ti, ti], [yi - ri, yi], color=C[1], lw=2)
    ax.text(ti + 0.08, yi - ri / 2, f"{ri:+.1f}", color=C[1], fontsize=9, va="center")
ax.plot(t, y, "o", color=INK, ms=7, zorder=3)
ax.text(3.5, 4.4, r"$y = 0.5 + 1.4t$", color=C[0], fontsize=10)
ax.set_xlabel("공부 시간 $t$")
ax.set_ylabel("점수 $y$")
ax.set_xlim(0.5, 4.5)
ax.set_ylim(1, 7)
save(fig, 1)

if __name__ == "__main__":
    assert abs(Cc - 0.5) < 1e-12 and abs(D - 1.4) < 1e-12
    assert np.allclose(res, [0.1, -0.3, 0.3, -0.1]) and abs((res ** 2).sum() - 0.2) < 1e-12
    assert abs(res.sum()) < 1e-12                           # 잔차 합 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
