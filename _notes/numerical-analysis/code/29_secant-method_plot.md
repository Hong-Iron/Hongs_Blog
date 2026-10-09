---
layout: "note"
title: "29_secant-method_plot.py"
display_title: "29_secant-method_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "29"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/secant-method/"
parent_title: "할선법"
description: "수치해석 · 할선법 코드 코드"
permalink: "/studies/numerical-analysis/code/29_secant-method_plot/"
---
{% raw %}
[할선법](/Hongs_Blog/studies/numerical-analysis/secant-method/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 할선법 문서의 그림을 만든다: 29_secant-method_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 29_secant-method_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "29_secant-method"
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


f = lambda x: np.exp(-x) - x
ROOT = 0.56714329

xs = [0.0, 1.0]
for _ in range(2):
    a, b = xs[-2], xs[-1]
    xs.append(b - f(b) * (a - b) / (f(a) - f(b)))

fig, ax = plt.subplots(figsize=(6, 3.6))
x = np.linspace(-0.1, 1.15, 300)
ax.plot(x, f(x), color=INK, lw=2.4, label="$f(x) = e^{-x} - x$")
ax.axhline(0, color=INK, lw=0.6)
for i in range(2):
    a, b, new = xs[i], xs[i + 1], xs[i + 2]
    lo, hi = min(a, b, new) - 0.05, max(a, b, new) + 0.05
    t = np.linspace(lo, hi, 2)
    slope = (f(b) - f(a)) / (b - a)
    ax.plot(t, f(b) + slope * (t - b), color=C[i], lw=1.4, label=f"반복 {i + 1}의 할선")
    ax.plot([a, b], [f(a), f(b)], "o", color=C[i], ms=5)
    ax.plot(new, 0, "x", color=C[i], ms=8, mew=2)
ax.annotate("$x_1 = 0.61270$", (xs[2], 0), textcoords="offset points", xytext=(4, 10), fontsize=9, color=C[0])
ax.annotate("$x_2 = 0.56384$", (xs[3], 0), textcoords="offset points", xytext=(-70, -18), fontsize=9, color=C[1])
ax.set_xlabel("$x$")
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 표: x_1 = 0.61270, x_2 = 0.56384, 둘째 반복의 두 점은 모두 근의 오른쪽(함수 값 음수)
    assert abs(xs[2] - 0.61270) < 5e-6 and abs(xs[3] - 0.56384) < 5e-6
    assert f(xs[1]) < 0 and f(xs[2]) < 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
