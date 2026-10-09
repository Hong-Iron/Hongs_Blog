---
layout: "note"
title: "27_convexity_plot.py"
display_title: "27_convexity_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "27"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/convexity/"
parent_title: "볼록 함수와 볼록 최적화"
description: "미분적분학 · 볼록 함수와 볼록 최적화 코드 코드"
permalink: "/studies/calculus/code/27_convexity_plot/"
---
{% raw %}
[볼록 함수와 볼록 최적화](/Hongs_Blog/studies/calculus/convexity/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 볼록 함수와 볼록 최적화 문서의 그림을 만든다: 27_convexity_fig1.svg, 27_convexity_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_convexity_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_convexity"
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


def quart(x):
    return x ** 4 - 3 * x ** 2 + x


def dquart(x):
    return 4 * x ** 3 - 6 * x + 1


def gd(x0, lr=0.01, steps=2000):
    xs = [x0]
    for _ in range(steps):
        xs.append(xs[-1] - lr * dquart(xs[-1]))
    return np.array(xs)


# 그림 1: 왼쪽 볼록 함수 x^2은 줄(현)이 그래프 위, 오른쪽 볼록 함수의 곱 x^2(x-1)^2은 줄이 그래프 아래로 들어간다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
x = np.linspace(-0.4, 2.4, 300)
a1.plot(x, x ** 2, color=INK, lw=2.2)
a1.plot([0, 2], [0, 4], color=C[0], lw=1.6)
a1.plot([0, 2], [0, 4], "o", ms=5, color=C[0])
a1.plot([1, 1], [1, 2], color=C[1], lw=1, ls=":")
a1.plot([1], [2], "o", ms=4, color=C[0])
a1.plot([1], [1], "o", ms=4, color=INK)
a1.text(0.92, 2.35, "줄의 가운데 2", fontsize=9, va="center", ha="right")
a1.text(1.08, 0.75, "그래프 $f(1)=1$", fontsize=9, va="center")
a1.set_title("$x^2$: 볼록", fontsize=10)
a1.set_xlabel("$x$")
x = np.linspace(-0.25, 1.25, 300)
a2.plot(x, x ** 2 * (x - 1) ** 2, color=INK, lw=2.2)
a2.plot([0, 1], [0, 0], color=C[0], lw=1.6)
a2.plot([0, 1], [0, 0], "o", ms=5, color=C[0])
a2.plot([0.5], [0.0625], "o", ms=4, color=INK)
a2.text(0.5, 0.072, "0.0625", fontsize=9, ha="center", va="bottom")
a2.text(0.5, -0.012, "줄 높이 0", fontsize=9, ha="center", va="top", color=C[0])
a2.set_ylim(-0.04, 0.16)
a2.set_title("$x^2(x-1)^2$: 볼록 아님", fontsize=10)
a2.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

# 그림 2: 볼록이 아닌 x^4 - 3x^2 + x. 시작점이 2면 오른쪽 골짜기(지역 최소), -2면 왼쪽 골짜기(전역 최소)
R, Lf = gd(2.0), gd(-2.0)
fig, ax = plt.subplots(figsize=(6, 3.4))
x = np.linspace(-2.1, 2.1, 400)
ax.plot(x, quart(x), color=INK, lw=2.2)
for path, col, name in [(R, C[0], "$x_0=2$"), (Lf, C[1], "$x_0=-2$")]:
    k = path[:25]
    ax.plot(k, quart(k), "o", ms=3.5, color=col, label=f"{name}에서 출발")
    ax.plot([path[-1]], [quart(path[-1])], "*", ms=12, color=col)
ax.text(R[-1], quart(R[-1]) - 0.5, f"지역 최소\n$x\\approx{R[-1]:.3f}$", ha="center", va="top", fontsize=9, color=C[0])
ax.text(Lf[-1], quart(Lf[-1]) - 0.5, f"전역 최소\n$x\\approx{Lf[-1]:.3f}$", ha="center", va="top", fontsize=9, color=C[1])
ax.set_ylim(-6, 8)
ax.set_xlabel("$x$")
ax.set_ylabel("$x^4-3x^2+x$")
ax.legend(loc="upper center", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 현의 값, 곱의 반례, 두 최솟점의 위치와 값, 두 점 모두 f' = 0, f'' > 0
    assert (0 + 4) / 2 == 2 and 1 ** 2 == 1
    assert abs(0.5 ** 2 * (0.5 - 1) ** 2 - 0.0625) < 1e-15
    assert abs(R[-1] - 1.131) < 1e-3 and abs(quart(R[-1]) + 1.070) < 1e-3
    assert abs(Lf[-1] + 1.301) < 1e-3 and abs(quart(Lf[-1]) + 3.514) < 1e-3
    for m in (R[-1], Lf[-1]):
        assert abs(dquart(m)) < 1e-9 and 12 * m * m - 6 > 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
