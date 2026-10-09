---
layout: "note"
title: "27_direct-search_plot.py"
display_title: "27_direct-search_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "27"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/direct-search/"
parent_title: "직접 탐색법"
description: "수치해석 · 직접 탐색법 코드 코드"
permalink: "/studies/numerical-analysis/code/27_direct-search_plot/"
---
{% raw %}
[직접 탐색법](/Hongs_Blog/studies/numerical-analysis/direct-search/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 직접 탐색법 문서의 그림을 만든다: 27_direct-search_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_direct-search_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_direct-search"
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


f = lambda x, y: y - x - 2 * x * x - 2 * x * y - y * y


def golden_max(g, a, b, tol=1e-10):
    Rg = (math.sqrt(5) - 1) / 2
    c, d = b - Rg * (b - a), a + Rg * (b - a)
    while b - a > tol:
        if g(c) >= g(d):
            b, d = d, c
            c = b - Rg * (b - a)
        else:
            a, c = c, d
            d = a + Rg * (b - a)
    return (a + b) / 2


def univariate(x, y, rounds):
    path = [(x, y)]
    for _ in range(rounds):
        x = golden_max(lambda t: f(t, y), -5, 5)
        path.append((x, y))
        y = golden_max(lambda t: f(x, t), -5, 5)
        path.append((x, y))
    return path


def pattern(x, y, rounds):
    """단변수 두 번 뒤 처음 점과 지금 점을 잇는 방향으로 한 번 더 찾는다. 중간 점도 모두 남긴다."""
    path = [(x, y)]
    for _ in range(rounds):
        x0, y0 = x, y
        x = golden_max(lambda t: f(t, y), -5, 5)
        path.append((x, y))
        y = golden_max(lambda t: f(x, t), -5, 5)
        path.append((x, y))
        dx, dy = x - x0, y - y0
        s = golden_max(lambda t: f(x + t * dx, y + t * dy), -5, 5)
        x, y = x + s * dx, y + s * dy
        path.append((x, y))
    return path


def rounds_needed(method, step):
    for r in range(1, 200):
        q = method(0.0, 0.0, r)[-1]
        if abs(q[0] + 1) < 1e-6 and abs(q[1] - 1.5) < 1e-6:
            return r


fig, ax = plt.subplots(figsize=(6, 3.8))
gx, gy = np.meshgrid(np.linspace(-1.6, 0.4, 200), np.linspace(-0.2, 2.0, 200))
cs = ax.contour(gx, gy, f(gx, gy), levels=[-1, -0.5, 0, 0.5, 0.9, 1.1, 1.2], colors=INK, linewidths=0.6)
ax.clabel(cs, fontsize=7, fmt="%g")
U = np.array(univariate(0.0, 0.0, 6))
Pp = np.array(pattern(0.0, 0.0, 2))
ax.plot(U[:, 0], U[:, 1], "o-", color=C[0], ms=3, lw=1.4, label="단변수 탐색 (6회차)")
ax.plot(Pp[:, 0], Pp[:, 1], "s--", color=C[1], ms=3, lw=1.4, label="패턴 탐색 (2회차)")
ax.plot(-1, 1.5, "*", color=C[2], ms=12)
ax.annotate("최댓값 (-1, 1.5)", (-1, 1.5), textcoords="offset points", xytext=(-40, 10), fontsize=9, color=C[2])
ax.annotate("시작 (0, 0)", (0, 0), textcoords="offset points", xytext=(-20, -14), fontsize=9)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
ax.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 첫 걸음 x = −0.25, 최댓값 1.25 at (−1, 1.5), 오차 1e-6까지 단변수 21회차, 패턴 10회차
    assert abs(U[1][0] + 0.25) < 1e-8 and f(-1, 1.5) == 1.25
    assert rounds_needed(univariate, 2) == 21 and rounds_needed(pattern, 3) == 10
    print("ALL CHECKS PASSED")
```
{% endraw %}
