---
layout: "note"
title: "05_normal-transform_plot.py"
display_title: "05_normal-transform_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "05"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/normal-transform/"
parent_title: "법선 벡터의 변환"
description: "수치해석 · 법선 벡터의 변환 코드 코드"
permalink: "/studies/numerical-analysis/code/05_normal-transform_plot/"
---
{% raw %}
[법선 벡터의 변환](/Hongs_Blog/studies/numerical-analysis/normal-transform/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 법선 벡터의 변환 문서의 그림을 만든다: 05_normal-transform_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 05_normal-transform_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "05_normal-transform"
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


M = np.array([[2, 0], [0, 1]], dtype=float)
G = np.linalg.inv(M).T
n = np.array([1, 1], dtype=float)
t = np.array([1, -1], dtype=float)
A, B = np.array([0, 1.0]), np.array([1, 0.0])          # 직선 x + y = 1 위의 두 점


def arrow(ax, base, v, color, label, dx=0.0, dy=0.0):
    v = 0.8 * v / np.linalg.norm(v)                     # 방향만 보이게 길이 0.8로 맞춘다
    ax.annotate("", base + v, base, arrowprops=dict(arrowstyle="-|>", color=color, lw=1.8))
    ax.text(*(base + v + (dx, dy)), label, color=color, fontsize=10)


fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
ax = axes[0]
mid = (A + B) / 2
ax.plot([A[0], B[0]], [A[1], B[1]], color=INK, lw=2)
arrow(ax, mid, n, C[0], r"$\mathbf{n} = (1, 1)$", -0.2, 0.08)
ax.set_title("변환 전: 직선 x + y = 1", fontsize=10)
ax = axes[1]
A2, B2 = M @ A, M @ B
mid2 = (A2 + B2) / 2
ax.plot([A2[0], B2[0]], [A2[1], B2[1]], color=INK, lw=2)
arrow(ax, mid2, M @ n, C[1], r"$M\mathbf{n}$: 수직 아님", 0.02, -0.05)
arrow(ax, mid2, G @ n, C[2], r"$(M^{-1})^\top\mathbf{n}$: 수직", -0.6, 0.08)
ax.set_title("x 방향으로 2배 늘린 뒤", fontsize=10)
for ax in axes:
    ax.set_aspect("equal")
    ax.set_xlim(-0.2, 2.6)
    ax.set_ylim(-0.2, 1.8)
    ax.axhline(0, color=INK, lw=0.5)
    ax.axvline(0, color=INK, lw=0.5)
save(fig, 1)

if __name__ == "__main__":
    # 예시 표: Mn·Mt = 3 (수직 아님), Gn = (1/2, 1)이고 Gn·Mt = 0
    assert (M @ n) @ (M @ t) == 3
    assert np.allclose(G @ n, [0.5, 1]) and abs((G @ n) @ (M @ t)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
