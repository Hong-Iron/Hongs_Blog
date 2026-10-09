---
layout: "note"
title: "25_golden-section_plot.py"
display_title: "25_golden-section_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "25"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/golden-section-search/"
parent_title: "황금분할 탐색"
description: "수치해석 · 황금분할 탐색 코드 코드"
permalink: "/studies/numerical-analysis/code/25_golden-section_plot/"
---
{% raw %}
[황금분할 탐색](/Hongs_Blog/studies/numerical-analysis/golden-section-search/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 황금분할 탐색 문서의 그림을 만든다: 25_golden-section_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_golden-section_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_golden-section"
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


f = lambda x: x ** 2 - np.sin(x)
R = (math.sqrt(5) - 1) / 2


def golden_rows(a, b, n):
    c, d = a + (1 - R) * (b - a), a + R * (b - a)
    rows = [(a, c, d, b)]
    for _ in range(n):
        if f(c) <= f(d):
            b, d = d, c
            c = a + (1 - R) * (b - a)
        else:
            a, c = c, d
            d = a + R * (b - a)
        rows.append((a, c, d, b))
    return rows


rows = golden_rows(0.0, 1.0, 22)
fig, (ax, bx) = plt.subplots(2, 1, figsize=(6, 3.8), sharex=True, gridspec_kw={"height_ratios": [1.3, 1]})
x = np.linspace(0, 1, 300)
ax.plot(x, f(x), color=INK, lw=2)
xm = 0.4501836
ax.plot(xm, f(xm), "o", color=C[1], ms=5)
ax.annotate("최솟값 0.4502", (xm, f(xm)), textcoords="offset points", xytext=(8, 6), fontsize=9, color=C[1])
ax.set_ylabel("$x^2 - \\sin x$")
for k in range(5):
    a, c, d, b = rows[k]
    y = -k
    bx.plot([a, b], [y, y], color=C[0], lw=4, solid_capstyle="butt", alpha=0.6)
    bx.plot([c, d], [y, y], "|", color=C[1], ms=10, mew=2)
    bx.text(-0.02, y, f"$k = {k}$", ha="right", va="center", fontsize=9)
bx.text(rows[0][1], 0.45, "c", ha="center", fontsize=9, color=C[1])
bx.text(rows[0][2], 0.45, "d", ha="center", fontsize=9, color=C[1])
bx.set_ylim(-4.6, 1.0)
bx.set_yticks([])
bx.spines["left"].set_visible(False)
bx.set_xlabel("$x$")
bx.set_xlim(-0.12, 1.02)
save(fig, 1)

if __name__ == "__main__":
    # 표: 0회차 c, d = 0.3819660, 0.6180340, 1회차 [0, 0.6180340], 3회차 [0.3819660, 0.6180340], 22회차 a = 0.4501730
    assert abs(rows[0][1] - 0.3819660) < 1e-7 and abs(rows[0][2] - 0.6180340) < 1e-7
    assert abs(rows[1][3] - 0.6180340) < 1e-7 and abs(rows[3][0] - 0.3819660) < 1e-7
    assert abs(rows[22][0] - 0.4501730) < 1e-7
    assert all(abs((r2[3] - r2[0]) - R * (r1[3] - r1[0])) < 1e-12 for r1, r2 in zip(rows, rows[1:]))
    assert abs(2 * xm - math.cos(xm)) < 1e-6                 # f'(x) = 2x − cos x = 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
