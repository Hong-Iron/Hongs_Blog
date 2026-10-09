---
layout: "note"
title: "16_b-spline_plot.py"
display_title: "16_b-spline_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "16"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/b-spline/"
parent_title: "B-스플라인"
description: "수치해석 · B-스플라인 코드 코드"
permalink: "/studies/numerical-analysis/code/16_b-spline_plot/"
---
{% raw %}
[B-스플라인](/Hongs_Blog/studies/numerical-analysis/b-spline/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# B-스플라인 문서의 그림을 만든다: 16_b-spline_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_b-spline_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_b-spline"
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


MS = np.array([[1, 4, 1, 0], [-3, 0, 3, 0], [3, -6, 3, 0], [-1, 3, -3, 1]], dtype=float) / 6
CP = np.array([[0, 0], [1, 3], [3, 3], [4, 0], [6, 1], [7, 4]], dtype=float)


def segment(P4, u):
    U = np.column_stack([np.ones_like(u), u, u ** 2, u ** 3])
    return U @ MS @ P4


u = np.linspace(0, 1, 150)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(CP[:, 0], CP[:, 1], color=INK, lw=0.8, ls="--", marker="o", ms=5)
for i, (x, y) in enumerate(CP):
    ax.annotate(f"$p_{i}$", (x, y), textcoords="offset points", xytext=(6, 2), fontsize=10)
for s in range(3):
    S = segment(CP[s:s + 4], u)
    ax.plot(S[:, 0], S[:, 1], color=C[s], lw=2.4, label=f"조각 {s + 1} ($p_{s}$..$p_{s + 3}$)")
    ax.plot(*S[0], "o", color=C[s], ms=5)
start = segment(CP[0:4], np.array([0.0]))[0]
ax.annotate("(7/6, 5/2)", start, textcoords="offset points", xytext=(-48, -14), fontsize=9, color=C[0])
ax.set_aspect("equal")
ax.set_xlim(-0.5, 7.6)
ax.set_ylim(-0.5, 4.6)
ax.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 첫 조각의 출발점 (7/6, 5/2), 이웃 조각이 이음점에서 0·1·2계 도함수가 같다
    assert np.allclose(start, [7 / 6, 5 / 2])
    D1 = np.array([[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3], [0, 0, 0, 0]], dtype=float)   # 계수 → 도함수 계수
    for s in range(2):
        a, b = MS @ CP[s:s + 4], MS @ CP[s + 1:s + 5]
        for _ in range(3):
            end = np.array([1, 1, 1, 1]) @ a
            beg = np.array([1, 0, 0, 0]) @ b
            assert np.allclose(end, beg)
            a, b = D1 @ a, D1 @ b
    print("ALL CHECKS PASSED")
```
{% endraw %}
