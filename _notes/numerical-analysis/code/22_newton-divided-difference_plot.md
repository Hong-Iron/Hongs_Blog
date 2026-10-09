---
layout: "note"
title: "22_newton-divided-difference_plot.py"
display_title: "22_newton-divided-difference_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "22"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/newton-divided-difference/"
parent_title: "뉴턴 다항식과 분할 차분"
description: "수치해석 · 뉴턴 다항식과 분할 차분 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/22_newton-divided-difference_plot/"
---
{% raw %}
[뉴턴 다항식과 분할 차분](/Hongs_Blog/studies/numerical-analysis/newton-divided-difference/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 뉴턴 다항식과 분할 차분 문서의 그림을 만든다: 22_newton-divided-difference_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 22_newton-divided-difference_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "22_newton-divided-difference"
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


XS = np.arange(1, 7, dtype=float)
f = lambda x: x ** 3 - 4 * x


def divided_differences(xs, ys):
    table = [list(ys)]
    for j in range(1, len(xs)):
        prev = table[-1]
        table.append([(prev[k + 1] - prev[k]) / (xs[k + j] - xs[k]) for k in range(len(prev) - 1)])
    return [col[0] for col in table]


def newton(coef, xs, x):
    total, prod = np.zeros_like(x), np.ones_like(x)
    for k, a in enumerate(coef):
        total = total + a * prod
        prod = prod * (x - xs[k])
    return total


coef = divided_differences(XS, f(XS))
x = np.linspace(0.6, 6.4, 300)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, f(x), color=INK, lw=3, label="$f(x) = x^3 - 4x$")
for n in range(4):
    ax.plot(x, newton(coef[:n + 1], XS, x), color=C[n], lw=1.5, ls="--" if n == 3 else "-",
            label=f"$P_{n}$: 점 {n + 1}개")
ax.plot(XS, f(XS), "o", color=INK, ms=5)
ax.set_ylim(-30, 200)
ax.set_xlabel("$x$")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 굵은 대각선 계수 −3, 3, 6, 1, 0, 0 그리고 P3 = f
    assert np.allclose(coef, [-3, 3, 6, 1, 0, 0])
    assert np.allclose(newton(coef[:4], XS, x), f(x))
    print("ALL CHECKS PASSED")
```
{% endraw %}
