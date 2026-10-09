---
layout: "note"
title: "04_minkowski-distance_plot.py"
display_title: "04_minkowski-distance_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "04"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/minkowski-distance/"
parent_title: "민코프스키 거리"
description: "데이터 과학 · 민코프스키 거리 코드 코드"
permalink: "/studies/data-science/code/04_minkowski-distance_plot/"
---
{% raw %}
[민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 민코프스키 거리 문서의 그림을 만든다: 04_minkowski-distance_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 04_minkowski-distance_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "04_minkowski-distance"
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

def mink(a, b, h):
    if h == np.inf:
        return max(abs(x - y) for x, y in zip(a, b))
    return sum(abs(x - y) ** h for x, y in zip(a, b)) ** (1 / h)


def unit_curve(h, n=721):
    t = np.linspace(0, 2 * np.pi, n)
    c, s = np.cos(t), np.sin(t)
    if h == np.inf:
        m = np.maximum(abs(c), abs(s))
        return c / m, s / m
    return np.sign(c) * abs(c) ** (2 / h), np.sign(s) * abs(s) ** (2 / h)


# 그림 1: 원점에서 거리가 1인 점들 (h = 1/2, 1, 2, 4, 무한대)
fig, ax = plt.subplots(figsize=(4.4, 4.2))
specs = [(0.5, INK, "--", r"$h=\frac{1}{2}$"), (1, C[0], "-", "$h=1$"), (2, C[1], "-", "$h=2$"),
         (4, C[2], "-", "$h=4$"), (np.inf, C[3], "-", r"$h=\infty$")]
for h, col, ls, lab in specs:
    x, y = unit_curve(h)
    ax.plot(x, y, color=col, ls=ls, lw=1.8, label=lab)
ax.axhline(0, color=INK, lw=0.5)
ax.axvline(0, color=INK, lw=0.5)
ax.set_aspect("equal")
ax.set_xlim(-1.25, 1.25)
ax.set_ylim(-1.25, 1.25)
ax.set_xticks([-1, 0, 1])
ax.set_yticks([-1, 0, 1])
ax.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    for h, *_ in specs:
        x, y = unit_curve(h)
        assert all(abs(mink((0, 0), (a, b), h) - 1) < 1e-9 for a, b in zip(x[::40], y[::40]))
    vals = [round(mink((1, 2), (3, 5), h), 3) for h in (1, 2, 4, 10)]
    assert vals == [5, 3.606, 3.138, 3.005] and mink((1, 2), (3, 5), np.inf) == 3
    assert mink((0, 0), (1, 1), 0.5) > mink((0, 0), (1, 0), 0.5) + mink((1, 0), (1, 1), 0.5)
    print("ALL CHECKS PASSED")
```
{% endraw %}
