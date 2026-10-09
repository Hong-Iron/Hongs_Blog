---
layout: "note"
title: "12_ftc_plot.py"
display_title: "12_ftc_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "12"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/ftc/"
parent_title: "미적분의 기본정리"
description: "미분적분학 · 미적분의 기본정리 코드 코드"
permalink: "/studies/calculus/code/12_ftc_plot/"
---
{% raw %}
[미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 미적분의 기본정리 문서의 그림을 만든다: 12_ftc_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 12_ftc_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "12_ftc"
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


def f(t):
    return t * t


def F(x):
    return x ** 3 / 3


X0 = 2.0

# 그림 1: 위는 f(t) = t^2 아래 넓이를 0부터 x까지 쌓은 것, 아래는 그 넓이 F(x). F의 기울기 = f의 높이
fig, (a1, a2) = plt.subplots(2, 1, figsize=(6, 4.2), sharex=True)
t = np.linspace(0, 3, 300)
a1.plot(t, f(t), color=C[0], lw=2)
tt = np.linspace(0, X0, 100)
a1.fill_between(tt, f(tt), color=C[0], alpha=0.2)
a1.plot([X0, X0], [0, f(X0)], color=C[1], lw=2)
a1.text(1.38, 0.35, f"넓이 $F({X0:g})=8/3$", fontsize=10)
a1.text(X0 + 0.05, f(X0) / 2, f"높이 $f({X0:g})={f(X0):g}$", fontsize=10, color=C[1], va="center")
a1.set_ylabel("$f(t)=t^2$")
a1.set_ylim(0, 9.5)
a2.plot(t, F(t), color=C[2], lw=2)
a2.plot(t, F(X0) + f(X0) * (t - X0), color=C[1], lw=1.4, ls="--")
a2.plot([X0], [F(X0)], "o", ms=5, color=C[2])
a2.text(X0 - 0.1, F(X0) + 1.2, f"기울기 $F'({X0:g})={f(X0):g}$", fontsize=10, color=C[1], ha="right")
a2.set_ylim(-1.5, 9.5)
a2.set_ylabel(r"$F(x)=\int_0^x t^2\,dt$")
a2.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 넓이 F(2) = 8/3을 리만 합으로, F'(2) = 4 = f(2)를 수치 미분으로, ∫_0^3 t^2 = 9
    n = 200000
    dx = X0 / n
    mid = sum(f((i + 0.5) * dx) for i in range(n)) * dx
    assert abs(mid - 8 / 3) < 1e-9
    h = 1e-5
    assert abs((F(X0 + h) - F(X0 - h)) / (2 * h) - f(X0)) < 1e-8
    assert F(3) == 9
    print("ALL CHECKS PASSED")
```
{% endraw %}
