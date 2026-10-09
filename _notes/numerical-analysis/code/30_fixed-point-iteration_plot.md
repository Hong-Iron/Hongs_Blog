---
layout: "note"
title: "30_fixed-point-iteration_plot.py"
display_title: "30_fixed-point-iteration_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "30"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/fixed-point-iteration/"
parent_title: "고정점 반복"
description: "수치해석 · 고정점 반복 코드 코드"
permalink: "/studies/numerical-analysis/code/30_fixed-point-iteration_plot/"
---
{% raw %}
[고정점 반복](/Hongs_Blog/studies/numerical-analysis/fixed-point-iteration/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 고정점 반복 문서의 그림을 만든다: 30_fixed-point-iteration_fig1.svg, 30_fixed-point-iteration_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 30_fixed-point-iteration_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "30_fixed-point-iteration"
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


ROOT = 0.56714329040978387


def iterate(g, x0, n):
    xs = [x0]
    for _ in range(n):
        xs.append(g(xs[-1]))
    return xs


def cobweb(ax, g, xs, color):
    """(x_i, x_i) → (x_i, g(x_i)) → (x_{i+1}, x_{i+1})를 잇는 거미줄 그림."""
    px, py = [xs[0]], [xs[0]]
    for a, b in zip(xs, xs[1:]):
        px += [a, b]
        py += [b, b]
    ax.plot(px, py, color=color, lw=1)
    ax.plot(xs[0], xs[0], "o", color=color, ms=4)


# 그림 1: x = e^{-x}, x0 = 0에서 근의 양쪽을 오가며 다가간다
g = lambda x: math.exp(-x)
xs = iterate(g, 0.0, 10)
fig, ax = plt.subplots(figsize=(6, 3.6))
x = np.linspace(-0.05, 1.05, 200)
ax.plot(x, np.exp(-x), color=C[0], lw=2, label="$y = e^{-x}$")
ax.plot(x, x, color=INK, lw=1, label="$y = x$")
cobweb(ax, g, xs, C[1])
for i in range(4):
    ax.annotate(f"$x_{i}$", (xs[i], 0), textcoords="offset points", xytext=(3, 3), fontsize=9)
    ax.plot([xs[i], xs[i]], [0, xs[i]], color=INK, lw=0.4, ls=":")
ax.plot(ROOT, ROOT, "o", color=C[2], ms=5)
ax.set_aspect("equal")
ax.set_xlim(-0.05, 1.1)
ax.set_ylim(-0.05, 1.1)
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=9)
save(fig, 1)

# 그림 2: 같은 근 2를 갖는 두 꼴. 기울기가 4이면 멀어지고, −1/2이면 양쪽을 오가며 다가간다
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
for ax, (name, gf, x0, n, lim) in zip(axes, [
        ("$g(x) = x^2 - 2$, $g'(2) = 4$", lambda x: x * x - 2, 2.1, 3, (1.6, 3.1)),
        ("$g(x) = 1 + 2/x$, $g'(2) = -1/2$", lambda x: 1 + 2 / x, 1.0, 8, (0.8, 3.2))]):
    seq = iterate(gf, x0, n)
    x = np.linspace(*lim, 200)
    ax.plot(x, [gf(v) for v in x], color=C[0], lw=2)
    ax.plot(x, x, color=INK, lw=1)
    cobweb(ax, gf, seq, C[1])
    ax.set_xlim(*lim)
    ax.set_ylim(*lim)
    ax.set_aspect("equal")
    ax.set_title(name, fontsize=10)
    ax.text(0.97, 0.03, f"$x_0 = {x0:g}$", transform=ax.transAxes, ha="right", va="bottom", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 표: x_2 = 0.367879, x_4 = 0.500473, x_10 = 0.564879. 오차 비율이 0.567로 간다
    assert abs(xs[2] - 0.367879) < 1e-6 and abs(xs[4] - 0.500473) < 1e-6 and abs(xs[10] - 0.564879) < 1e-6
    long = iterate(g, 0.0, 20)
    assert abs((long[20] - ROOT) / (long[19] - ROOT) + 0.567) < 0.01
    up = iterate(lambda x: x * x - 2, 2.1, 3)
    down = iterate(lambda x: 1 + 2 / x, 1.0, 30)
    assert abs(up[-1] - 2) > abs(up[0] - 2) * 10 and abs(down[-1] - 2) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
