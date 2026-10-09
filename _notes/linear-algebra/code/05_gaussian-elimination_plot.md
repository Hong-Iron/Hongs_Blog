---
layout: "note"
title: "05_gaussian-elimination_plot.py"
display_title: "05_gaussian-elimination_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "05"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/gaussian-elimination/"
parent_title: "가우스 소거법"
description: "선형대수학 · 가우스 소거법 코드 코드"
permalink: "/studies/linear-algebra/code/05_gaussian-elimination_plot/"
---
{% raw %}
[가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 가우스 소거법 문서의 그림을 만든다: 05_gaussian-elimination_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 05_gaussian-elimination_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "05_gaussian-elimination"
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


def arrow(ax, start, vec, color, lw=1.8, ls="-"):
    """start에서 vec만큼 가는 화살표"""
    ax.annotate("", xy=(start[0] + vec[0], start[1] + vec[1]), xytext=(start[0], start[1]),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, ls=ls, shrinkA=0, shrinkB=0,
                                mutation_scale=12))



def solve_naive(eps):
    """eps·x + y = 1, x + y = 2를 위 식의 eps로 나눠 푼다(행 바꾸기 없음)"""
    l = 1.0 / eps
    y = (2.0 - l * 1.0) / (1.0 - l * 1.0)
    x = (1.0 - y) / eps
    return x


def solve_pivot(eps):
    """x 열에서 큰 1이 있는 둘째 식을 위로 올려 푼다"""
    l = eps / 1.0
    y = (1.0 - l * 2.0) / (1.0 - l * 1.0)
    x = 2.0 - y
    return x


FLOOR = 1e-19                                            # 오차가 정확히 0이면 이 높이에 찍고 눈금을 "0"으로 단다
exps = np.arange(1, 21)
eps_list = 10.0 ** (-exps)
true_x = 1 / (1 - eps_list)
err_naive = np.maximum(np.abs([solve_naive(e) for e in eps_list] - true_x), FLOOR)
err_pivot = np.maximum(np.abs([solve_pivot(e) for e in eps_list] - true_x), FLOOR)

# 그림 1: 첫 계수 eps가 작아질수록 행 바꾸기 없는 소거의 x 오차가 커진다
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.loglog(eps_list, err_naive, "o-", color=C[1], ms=4, label="그냥 위에서부터")
ax.loglog(eps_list, err_pivot, "s-", color=C[0], ms=4, label="큰 수를 골라 나누기")
ax.axhline(2.2e-16, color=INK, lw=0.8, ls=":")
ax.text(1e-6, 5e-16, "배정밀도 반올림 크기", fontsize=9, ha="center")
ax.invert_xaxis()
ax.set_xlabel(r"첫 식의 계수 $\varepsilon$ (오른쪽으로 갈수록 작다)")
ax.set_ylabel(r"$x$의 오차")
ax.set_ylim(3e-20, 5)
ax.legend(loc="upper left")
pow10 = matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(np.log10(v)))}}}$")
ax.xaxis.set_major_locator(matplotlib.ticker.LogLocator(numticks=6))
ax.yaxis.set_major_locator(matplotlib.ticker.FixedLocator([FLOOR, 1e-15, 1e-10, 1e-5, 1]))
ax.xaxis.set_major_formatter(pow10)
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: "0" if v <= FLOOR else pow10(v)))
ax.xaxis.set_minor_locator(matplotlib.ticker.NullLocator())
ax.yaxis.set_minor_locator(matplotlib.ticker.NullLocator())
save(fig, 1)

if __name__ == "__main__":
    assert solve_naive(1e-20) == 0.0                     # 문서의 예: x = 0으로 틀린다
    assert abs(solve_pivot(1e-20) - 1) < 1e-15           # 행 바꾸기를 하면 x = 1
    assert err_naive[-1] > 0.99 and err_pivot.max() < 1e-15
    assert (err_naive[exps >= 16] > 0.99).all() and err_pivot.max() <= np.finfo(float).eps   # 10^-16부터 답이 통째로 틀린다
    print("ALL CHECKS PASSED")
```
{% endraw %}
