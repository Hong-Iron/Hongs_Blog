---
layout: "note"
title: "35_nmf-clustering_plot.py"
display_title: "35_nmf-clustering_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "35"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/nmf-clustering/"
parent_title: "행렬 분해 군집화"
description: "데이터 과학 · 행렬 분해 군집화 코드 코드"
permalink: "/studies/data-science/code/35_nmf-clustering_plot/"
---
{% raw %}
[행렬 분해 군집화](/Hongs_Blog/studies/data-science/nmf-clustering/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 행렬 분해 군집화 문서의 그림을 만든다: 35_nmf-clustering_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 35_nmf-clustering_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "35_nmf-clustering"
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

CEN = np.array([0.6, 1.4])                              # 오차가 가장 작은 곳 (벌점 없이)
A = np.diag([1.0, 3.0])                                 # 오차 등고선이 타원이 되게 하는 무게


def loss(w):
    d = w - CEN
    return float(d @ A @ d)


t = np.linspace(0, 2 * np.pi, 20001)
L1B = np.column_stack([np.cos(t), np.sin(t)]); L1B = L1B / np.abs(L1B).sum(axis=1, keepdims=True)
L2B = np.column_stack([np.cos(t), np.sin(t)])
opt1 = L1B[np.argmin([loss(w) for w in L1B])]
opt2 = L2B[np.argmin([loss(w) for w in L2B])]

# 그림 1: 오차 등고선이 L1 마름모(왼쪽)와 L2 원(오른쪽)에 처음 닿는 곳
g = np.linspace(-1.6, 2.2, 300)
GX, GY = np.meshgrid(g, g)
Z = A[0, 0] * (GX - CEN[0]) ** 2 + A[1, 1] * (GY - CEN[1]) ** 2
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3.3), sharey=True)
for ax, B, opt, name in [(axes[0], L1B, opt1, "L1: $|w_1| + |w_2| \\leq 1$"), (axes[1], L2B, opt2, "L2: $w_1^2 + w_2^2 \\leq 1$")]:
    ax.fill(*B.T, color=C[0], alpha=0.15)
    ax.plot(*B.T, color=C[0], lw=1.5)
    lv = loss(opt)
    ax.contour(GX, GY, Z, levels=[lv * 0.25, lv, lv * 2.2], colors=[INK], linewidths=[0.8, 1.6, 0.8])
    ax.plot(*CEN, "+", color=INK, ms=9)
    ax.plot(*opt, "o", color=C[1], ms=7)
    ax.annotate(f"({opt[0]:.2f}, {opt[1]:.2f})", xy=opt, xytext=(opt[0] + 0.35, opt[1] - 0.55), fontsize=10, color=C[1])
    ax.axhline(0, color=INK, lw=0.5); ax.axvline(0, color=INK, lw=0.5)
    ax.set_aspect("equal")
    ax.set_xlim(-1.5, 2.1); ax.set_ylim(-1.5, 2.1)
    ax.set_xlabel("$w_1$")
    ax.set_title(name, fontsize=10)
axes[0].set_ylabel("$w_2$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs(opt1[0]) < 1e-3 and abs(opt1[1] - 1) < 1e-3
    assert opt2[0] > 0.05 and opt2[1] > 0.05 and abs(np.hypot(*opt2) - 1) < 1e-9
    print(f"     L1 답 {opt1.round(3)}, L2 답 {opt2.round(3)}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
