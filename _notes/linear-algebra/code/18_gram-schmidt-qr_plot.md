---
layout: "note"
title: "18_gram-schmidt-qr_plot.py"
display_title: "18_gram-schmidt-qr_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "18"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/gram-schmidt-qr/"
parent_title: "그람-슈미트와 QR 분해"
description: "선형대수학 · 그람-슈미트와 QR 분해 코드 코드"
permalink: "/studies/linear-algebra/code/18_gram-schmidt-qr_plot/"
---
{% raw %}
[그람-슈미트와 QR 분해](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 그람-슈미트와 QR 분해 문서의 그림을 만든다: 18_gram-schmidt-qr_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_gram-schmidt-qr_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_gram-schmidt-qr"
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


a1 = np.array([1, 1, 0])
a2 = np.array([1, 0, 1])
q1 = a1 / np.linalg.norm(a1)
shadow = (q1 @ a2) * q1
v = a2 - shadow
q2 = v / np.linalg.norm(v)

# 그림 1: a2에서 q1 방향의 그림자를 빼면 q1과 수직인 v가 남는다
fig = plt.figure(figsize=(5, 4))
ax = fig.add_subplot(projection="3d")
for spine in (ax.xaxis, ax.yaxis, ax.zaxis):
    spine.set_pane_color((1, 1, 1, 0))
    spine.line.set_color(INK)
s, tt = np.meshgrid(np.linspace(-0.2, 1.2, 2), np.linspace(-0.2, 1.2, 2))
P = s[..., None] * a1 + tt[..., None] * a2
ax.plot_surface(P[..., 0], P[..., 1], P[..., 2], color=C[0], alpha=0.1, linewidth=0)
ax.quiver(0, 0, 0, *a1, color=INK, lw=1.5, arrow_length_ratio=0.1)
ax.quiver(0, 0, 0, *a2, color=INK, lw=1.5, arrow_length_ratio=0.1)
ax.quiver(0, 0, 0, *q1, color=C[0], lw=2.6, arrow_length_ratio=0.15)
ax.quiver(*shadow, *v, color=C[1], lw=1.5, arrow_length_ratio=0.15)
ax.quiver(0, 0, 0, *q2, color=C[2], lw=2.6, arrow_length_ratio=0.15)
ax.plot(*shadow, "o", color=C[1], ms=4)
ax.text(*(a1 * 1.05), r"$\mathbf{a}_1$", fontsize=11)
ax.text(*(a2 * 1.05), r"$\mathbf{a}_2$", fontsize=11)
ax.text(*(q1 * 0.55 + [0.05, -0.1, -0.08]), r"$\mathbf{q}_1$", color=C[0], fontsize=11)
ax.text(*(shadow + [0.05, 0.02, -0.12]), "그림자", color=C[1], fontsize=9)
ax.text(*(shadow + v * 0.5 + [0.05, 0.05, 0]), r"$\mathbf{v}$", color=C[1], fontsize=11)
ax.text(*(q2 + [-0.12, -0.15, 0.04]), r"$\mathbf{q}_2$", color=C[2], fontsize=11)
ax.set_xlim(0, 1.1)
ax.set_ylim(-0.5, 1.1)
ax.set_zlim(0, 1.1)
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_zticks([0, 1])
ax.tick_params(labelsize=8, colors=INK)
ax.view_init(elev=20, azim=-70)
save(fig, 1)

if __name__ == "__main__":
    assert np.allclose(v, [0.5, -0.5, 1]) and np.allclose(q2, np.array([1, -1, 2]) / math.sqrt(6))
    assert abs(q1 @ q2) < 1e-12 and abs(np.linalg.norm(q2) - 1) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
