---
layout: "note"
title: "19_partial-derivatives_plot.py"
display_title: "19_partial-derivatives_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "19"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/partial-derivatives/"
parent_title: "다변수 함수와 편미분"
description: "미분적분학 · 다변수 함수와 편미분 그림 생성 코드"
permalink: "/studies/calculus/code/19_partial-derivatives_plot/"
---
{% raw %}
[다변수 함수와 편미분](/Hongs_Blog/studies/calculus/partial-derivatives/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 다변수 함수와 편미분 문서의 그림을 만든다: 19_partial-derivatives_fig1.svg, 19_partial-derivatives_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_partial-derivatives_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_partial-derivatives"
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


def f(x, y):
    return x ** 2 * y + np.sin(y)


def g(x, y):
    r2 = x ** 2 + y ** 2
    return np.where(r2 == 0, 0.0, x * y / np.where(r2 == 0, 1, r2))


# 그림 1: 왼쪽 등고선 지도에서 (1, 0)을 지나는 두 단면, 오른쪽 그 단면의 높이 변화
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.1))
X, Y = np.meshgrid(np.linspace(0, 2, 200), np.linspace(-1.5, 1.5, 200))
cs = a1.contour(X, Y, f(X, Y), levels=np.arange(-6, 6.1, 1), colors=INK, linewidths=0.7)
a1.clabel(cs, fontsize=7, fmt="%g")
a1.plot([0, 2], [0, 0], color=C[1], lw=2, label="동쪽 단면 $y=0$")
a1.plot([1, 1], [-1.5, 1.5], color=C[2], lw=2, label="북쪽 단면 $x=1$")
a1.plot([1], [0], "o", ms=6, color=INK)
a1.set_xlabel("$x$ (동쪽)")
a1.set_ylabel("$y$ (북쪽)")
a1.set_title("$f(x,y)=x^2y+\\sin y$의 등고선", fontsize=10)
s = np.linspace(-1, 1, 200)
a2.plot(s, f(1 + s, 0 * s), color=C[1], lw=2, label=r"$f(1+s,\,0)$: 기울기 0")
a2.plot(s, f(1 + 0 * s, s), color=C[2], lw=2, label=r"$f(1,\,s)$: 기울기 2")
a2.plot(s, 2 * s, color=C[2], lw=1, ls="--")
a2.plot([0], [0], "o", ms=6, color=INK)
a2.set_xlabel("$(1,0)$에서 움직인 거리 $s$")
a2.set_ylabel("높이")
a2.legend(loc="upper left", fontsize=8)
fig.tight_layout()
save(fig, 1)

# 그림 2: xy/(x^2+y^2)는 원점을 지나는 직선마다 값이 일정하다. 축 위는 0, 대각선 위는 1/2
fig, ax = plt.subplots(figsize=(4.6, 3.8))
X, Y = np.meshgrid(np.linspace(-1, 1, 401), np.linspace(-1, 1, 401))
cf = ax.contourf(X, Y, g(X, Y), levels=np.linspace(-0.5, 0.5, 11), cmap="coolwarm")
cb = fig.colorbar(cf, ax=ax, ticks=[-0.5, -0.25, 0, 0.25, 0.5])
cb.ax.tick_params(colors=INK)
cb.outline.set_edgecolor(INK)
ax.plot([-1, 1], [0, 0], color=INK, lw=1.2)
ax.plot([0, 0], [-1, 1], color=INK, lw=1.2)
ax.plot([-1, 1], [-1, 1], color=INK, lw=1.2, ls="--")
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 2)

if __name__ == "__main__":
    # (1, 0)에서 두 편미분 0과 2(중앙 차분), 축 위 값 0, 대각선 위 값 1/2(원점에 아주 가까워도)
    h = 1e-6
    fx = (f(1 + h, 0) - f(1 - h, 0)) / (2 * h)
    fy = (f(1, h) - f(1, -h)) / (2 * h)
    assert abs(fx) < 1e-8 and abs(fy - 2) < 1e-8
    for t in [1e-1, 1e-4, 1e-8]:
        assert g(t, 0.0) == 0 and g(0.0, t) == 0 and abs(g(t, t) - 0.5) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
