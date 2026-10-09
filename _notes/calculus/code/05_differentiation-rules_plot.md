---
layout: "note"
title: "05_differentiation-rules_plot.py"
display_title: "05_differentiation-rules_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "05"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/differentiation-rules/"
parent_title: "미분 법칙"
description: "미분적분학 · 미분 법칙 그림 생성 코드"
permalink: "/studies/calculus/code/05_differentiation-rules_plot/"
---
{% raw %}
[미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 미분 법칙 문서의 그림을 만든다: 05_differentiation-rules_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 05_differentiation-rules_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "05_differentiation-rules"
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


from matplotlib.patches import Rectangle

# 그림 1: 가로 f, 세로 g인 직사각형이 조금 커질 때 늘어난 넓이 = 두 띠 + 모서리 조각
F, G, DF, DG = 3.0, 2.0, 0.6, 0.45            # 늘어난 양은 잘 보이게 크게 잡았다
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.add_patch(Rectangle((0, 0), F, G, facecolor=C[0], alpha=0.25, edgecolor=C[0], lw=1.5))
ax.add_patch(Rectangle((F, 0), DF, G, facecolor=C[1], alpha=0.45, edgecolor=C[1], lw=1.2))
ax.add_patch(Rectangle((0, G), F, DG, facecolor=C[2], alpha=0.45, edgecolor=C[2], lw=1.2))
ax.add_patch(Rectangle((F, G), DF, DG, facecolor=C[3], alpha=0.45, edgecolor=C[3], lw=1.2))
ax.text(F / 2, G / 2, "$fg$", ha="center", va="center", fontsize=14)
ax.text(F + DF / 2, G / 2, r"$\Delta f\cdot g$", ha="center", va="center", fontsize=10, rotation=90)
ax.text(F / 2, G + DG / 2, r"$f\cdot\Delta g$", ha="center", va="center", fontsize=10)
ax.annotate(r"$\Delta f\,\Delta g$" + "\n" + r"($h^2$ 크기)", xy=(F + DF / 2, G + DG / 2), xytext=(F + DF + 0.35, G + DG + 0.2),
            fontsize=9, va="center", arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.text(F / 2, -0.2, "$f$", ha="center", va="top", fontsize=12)
ax.text(F + DF / 2, -0.2, r"$\Delta f$", ha="center", va="top", fontsize=10)
ax.text(-0.15, G / 2, "$g$", ha="right", va="center", fontsize=12)
ax.text(-0.15, G + DG / 2, r"$\Delta g$", ha="right", va="center", fontsize=10)
ax.set_xlim(-0.6, F + DF + 1.4)
ax.set_ylim(-0.6, G + DG + 0.5)
ax.set_aspect("equal")
ax.axis("off")
save(fig, 1)

if __name__ == "__main__":
    # 늘어난 넓이는 두 띠와 모서리의 합이고, h로 나누면 모서리 몫만 0으로 간다(f = x^2, g = e^x, x = 1)
    assert abs((F + DF) * (G + DG) - F * G - (DF * G + F * DG + DF * DG)) < 1e-12
    x = 1.0
    for h in [1e-2, 1e-3, 1e-4]:
        df, dg = (x + h) ** 2 - x ** 2, math.exp(x + h) - math.exp(x)
        assert abs(df * dg / h) < 20 * h
    exact = (2 * x + x ** 2) * math.exp(x)
    h = 1e-6
    num = ((x + h) ** 2 * math.exp(x + h) - (x - h) ** 2 * math.exp(x - h)) / (2 * h)
    assert abs(num - exact) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
