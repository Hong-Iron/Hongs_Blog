---
layout: "note"
title: "28_bisection_plot.py"
display_title: "28_bisection_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "28"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/bisection-method/"
parent_title: "이분법"
description: "수치해석 · 이분법 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/28_bisection_plot/"
---
{% raw %}
[이분법](/Hongs_Blog/studies/numerical-analysis/bisection-method/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이분법 문서의 그림을 만든다: 28_bisection_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 28_bisection_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "28_bisection"
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


G, M, V, T = 9.8, 68.1, 40.0, 10.0
f = lambda c: G * M / c * (1 - np.exp(-(c / M) * T)) - V
ROOT = 14.7802

rows = []
xl, xu = 12.0, 16.0
for _ in range(6):
    xr = (xl + xu) / 2
    rows.append((xl, xu, xr))
    if f(xl) * f(xr) < 0:
        xu = xr
    else:
        xl = xr

fig, (ax, bx) = plt.subplots(2, 1, figsize=(6, 3.8), sharex=True, gridspec_kw={"height_ratios": [1.2, 1]})
c = np.linspace(11.8, 16.2, 300)
ax.plot(c, f(c), color=INK, lw=2)
ax.axhline(0, color=INK, lw=0.6)
ax.plot(ROOT, 0, "o", color=C[1], ms=5)
ax.annotate("근 14.7802", (ROOT, 0), textcoords="offset points", xytext=(6, 6), fontsize=9, color=C[1])
ax.set_ylabel("$f(c)$")
for i, (l, u, r) in enumerate(rows):
    y = -i
    bx.plot([l, u], [y, y], color=C[0], lw=4, solid_capstyle="butt", alpha=0.6)
    bx.plot(r, y, "|", color=C[1], ms=10, mew=2)
    bx.text(11.75, y, f"{i + 1}", ha="right", va="center", fontsize=9)
bx.text(11.75, 0.9, "반복", ha="right", va="center", fontsize=9)
bx.axvline(ROOT, color=C[1], lw=0.6, ls=":")
bx.set_ylim(-5.6, 1.3)
bx.set_yticks([])
bx.spines["left"].set_visible(False)
bx.set_xlabel("항력 계수 $c$")
save(fig, 1)

if __name__ == "__main__":
    # 표: x_r = 14, 15, 14.5, 14.75, 14.875, 14.8125, f(12) > 0 > f(16), 참값 14.7802
    assert [r for _, _, r in rows] == [14, 15, 14.5, 14.75, 14.875, 14.8125]
    assert f(12) > 0 > f(16)
    assert abs(f(ROOT)) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
