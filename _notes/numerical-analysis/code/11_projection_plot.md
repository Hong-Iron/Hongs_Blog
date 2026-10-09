---
layout: "note"
title: "11_projection_plot.py"
display_title: "11_projection_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "11"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/projection/"
parent_title: "평행 투영과 원근 투영"
description: "수치해석 · 평행 투영과 원근 투영 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/11_projection_plot/"
---
{% raw %}
[평행 투영과 원근 투영](/Hongs_Blog/studies/numerical-analysis/projection/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 평행 투영과 원근 투영 문서의 그림을 만든다: 11_projection_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_projection_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_projection"
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


D = 1.0                                                  # 화면 z = d


def persp(x, z, d=D):
    return x / (z / d)


fig, axes = plt.subplots(1, 2, figsize=(6.5, 3), gridspec_kw={"width_ratios": [1.6, 1]})
# 왼쪽: 옆에서 본 모습. 눈은 원점, 화면은 z = 1, 높이 4인 막대가 거리 4와 8에
ax = axes[0]
ax.plot([D, D], [-0.3, 4.4], color=INK, lw=1.2)
ax.text(D, 4.5, "화면", ha="center", fontsize=9)
ax.plot(0, 0, "o", color=INK, ms=5)
ax.text(0, -0.5, "눈", ha="center", fontsize=9)
for i, z in enumerate([4, 8]):
    ax.plot([z, z], [0, 4], color=C[i], lw=3)
    ax.plot([0, z], [0, 4], color=C[i], lw=0.8, ls="--")
    h = persp(4, z)
    ax.plot([D, D], [0, h], color=C[i], lw=4, alpha=0.8)
    ax.text(z + 0.2, 2, f"거리 {z}", color=C[i], fontsize=9, va="center")
    ax.text(D + 0.15, h, f"{h:g}", color=C[i], fontsize=9, va="center")
ax.set_xlim(-0.4, 9.6)
ax.set_ylim(-0.7, 4.8)
ax.set_xlabel("깊이 $z$")
ax.set_ylabel("높이")
# 오른쪽: 화면에 비친 철길 x = ±1 (바닥 높이 −1). 침목을 깊이 1, 2, 3, 5, 10에 둔다
ax = axes[1]
z = np.linspace(1, 1000, 4000)
for s in (-1, 1):
    ax.plot(persp(s, z), persp(-1, z), color=C[0], lw=1.5)
for zz in [1, 2, 3, 5, 10]:
    ax.plot([persp(-1, zz), persp(1, zz)], [persp(-1, zz)] * 2, color=INK, lw=0.8)
ax.text(0, -1.08, "거리 1: 폭 2", ha="center", va="top", fontsize=9)
ax.annotate("거리 10:\n폭 0.2", (0.1, -0.1), xytext=(0.5, -0.45), fontsize=9,
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.plot(0, 0, "o", color=C[1], ms=4)
ax.text(0, 0.1, "소실점", color=C[1], ha="center", fontsize=9)
ax.set_aspect("equal")
ax.set_xlim(-1.2, 1.2)
ax.set_ylim(-1.3, 0.3)
ax.axis("off")
fig.subplots_adjust(wspace=0.15)
save(fig, 1)

if __name__ == "__main__":
    # 예시: 높이 4의 막대가 거리 4에서 1, 거리 8에서 0.5. 폭 2가 거리 10에서 0.2, 1000에서 0.002
    assert persp(4, 4) == 1 and persp(4, 8) == 0.5
    assert abs(2 * persp(1, 10) - 0.2) < 1e-12 and abs(2 * persp(1, 1000) - 0.002) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
