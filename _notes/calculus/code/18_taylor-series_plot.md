---
layout: "note"
title: "18_taylor-series_plot.py"
display_title: "18_taylor-series_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/taylor-series/"
parent_title: "테일러 급수"
description: "미분적분학 · 테일러 급수 그림 생성 코드"
permalink: "/studies/calculus/code/18_taylor-series_plot/"
---
{% raw %}
[테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 테일러 급수 문서의 그림을 만든다: 18_taylor-series_fig1.svg, 18_taylor-series_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_taylor-series_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_taylor-series"
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


def taylor_exp(x, n):
    return sum(x ** k / math.factorial(k) for k in range(n + 1))


def taylor_log1p(x, n):
    return sum((-1) ** (k + 1) * x ** k / k for k in range(1, n + 1))


# 그림 1: e^x와 0에서의 테일러 다항식 T1, T2, T3, T5
x = np.linspace(-3, 3, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, np.exp(x), color=INK, lw=2.6, label="$e^x$")
for i, n in enumerate([1, 2, 3, 5]):
    ax.plot(x, taylor_exp(x, n), color=C[i], lw=1.5, label=f"$T_{n}$")
ax.set_ylim(-3, 15)
ax.axhline(0, color=INK, lw=0.6)
ax.axvline(0, color=INK, lw=0.6, ls=":")
ax.set_xlabel("$x$")
ax.legend(loc="upper left")
save(fig, 1)

# 그림 2: ln(1+x)의 테일러 다항식은 x > 1에서 항을 늘릴수록 더 멀어진다
x = np.linspace(-0.9, 1.5, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, np.log1p(x), color=INK, lw=2.6, label=r"$\ln(1+x)$")
for i, n in enumerate([5, 10, 20]):
    ax.plot(x, taylor_log1p(x, n), color=C[i], lw=1.5, label=f"$T_{{{n}}}$")
ax.axvspan(1, 1.5, color=C[1], alpha=0.08)
ax.text(1.25, 2.05, "수렴 반지름 밖", fontsize=10, ha="center", va="bottom")
ax.set_ylim(-2, 2)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$x$")
ax.legend(loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    # 그림에 쓴 값 확인: T5(1) = 2.71667, x = 1.5에서 T20이 T5보다 ln(2.5)에서 더 멀다
    assert abs(taylor_exp(1, 5) - 2.716667) < 1e-5
    assert abs(taylor_log1p(1.5, 20) - math.log(2.5)) > abs(taylor_log1p(1.5, 5) - math.log(2.5))
    print("ALL CHECKS PASSED")
```
{% endraw %}
