---
layout: "note"
title: "15_inverse-trig_plot.py"
display_title: "15_inverse-trig_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "15"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/inverse-trig/"
parent_title: "역삼각함수"
description: "대학수학 · 역삼각함수 그림 생성 코드"
permalink: "/studies/college-math/code/15_inverse-trig_plot/"
---
{% raw %}
[역삼각함수](/Hongs_Blog/studies/college-math/inverse-trig/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 역삼각함수 문서의 그림을 만든다: 15_inverse-trig_fig1.svg, 15_inverse-trig_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_inverse-trig_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_inverse-trig"
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

# 그림 1: sin θ = 1/2인 θ는 끝없이 많다. [−π/2, π/2]로 자른 부분(굵은 선)에서는 하나뿐이다
th = np.linspace(-2 * np.pi, 2.5 * np.pi, 800)
fig, axs = plt.subplots(1, 2, figsize=(6.5, 3), gridspec_kw={"width_ratios": [2, 1]})
ax = axs[0]
ax.plot(th, np.sin(th), color=C[0], lw=1.2, alpha=0.6)
cut = np.linspace(-np.pi / 2, np.pi / 2, 200)
ax.plot(cut, np.sin(cut), color=C[0], lw=3)
ax.axhline(0.5, color=C[1], lw=1, ls="--")
sols = [math.pi / 6 + 2 * math.pi * k for k in (-1, 0, 1)] + [5 * math.pi / 6 + 2 * math.pi * k for k in (-1, 0, 1)]
sols = [s for s in sols if th[0] <= s <= th[-1]]
ax.plot(sols, [0.5] * len(sols), "o", color=C[1], mfc="none")
ax.plot([math.pi / 6], [0.5], "o", color=C[1])
ax.axhline(0, color=INK, lw=0.5)
ax.set_xticks([-2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi])
ax.set_xticklabels(["$-2\\pi$", "$-\\pi$", "0", "$\\pi$", "$2\\pi$"])
ax.set_yticks([-1, 0, 0.5, 1])
ax.set_title("$y = \\sin\\theta$,  $y = 1/2$", fontsize=11)
ax = axs[1]
x = np.linspace(-1, 1, 400)
ax.plot(x, np.arcsin(x), color=C[0], lw=3)
ax.plot([0.5], [math.pi / 6], "o", color=C[1])
ax.text(0.45, math.pi / 6 + 0.25, "$\\pi/6$", fontsize=10, ha="right")
ax.axhline(0, color=INK, lw=0.5)
ax.axvline(0, color=INK, lw=0.5)
ax.set_yticks([-np.pi / 2, 0, np.pi / 2])
ax.set_yticklabels(["$-\\pi/2$", "0", "$\\pi/2$"])
ax.set_xticks([-1, 0, 1])
ax.set_title("$\\arcsin x$", fontsize=11)
fig.tight_layout()
save(fig, 1)

# 그림 2: arcsin(sin x)는 x를 되돌리지 못하고 [−π/2, π/2] 안에서 지그재그로 오간다
x = np.linspace(-2 * np.pi, 2 * np.pi, 1000)
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.plot(x, x, color=INK, lw=1, ls="--", label="$y = x$")
ax.plot(x, np.arcsin(np.sin(x)), color=C[0], lw=2, label="$\\arcsin(\\sin x)$")
x0 = 2 * math.pi / 3
ax.plot([x0], [math.asin(math.sin(x0))], "o", color=C[1])
ax.annotate("$x = 2\\pi/3$에서 $\\pi/3$", xy=(x0, math.pi / 3), xytext=(2.6, -2.6), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.axvspan(-np.pi / 2, np.pi / 2, color=INK, alpha=0.1)
ax.set_xticks([-2 * np.pi, -np.pi, -np.pi / 2, 0, np.pi / 2, np.pi, 2 * np.pi])
ax.set_xticklabels(["$-2\\pi$", "$-\\pi$", "", "0", "", "$\\pi$", "$2\\pi$"])
ax.set_yticks([-np.pi / 2, 0, np.pi / 2])
ax.set_yticklabels(["$-\\pi/2$", "0", "$\\pi/2$"])
ax.set_ylim(-3.3, 3.3)
ax.legend(loc="upper left", fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # arcsin(1/2) = π/6, [0, 2π)의 해 π/6과 5π/6, arcsin(sin 2π/3) = π/3
    assert abs(math.asin(0.5) - math.pi / 6) < 1e-15
    assert all(abs(math.sin(s) - 0.5) < 1e-12 for s in sols)
    assert abs(math.asin(math.sin(2 * math.pi / 3)) - math.pi / 3) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
