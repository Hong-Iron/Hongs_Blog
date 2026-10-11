---
layout: "note"
title: "01_limits_plot.py"
display_title: "01_limits_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "01"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/limits/"
parent_title: "극한"
description: "미분적분학 · 극한 그림 생성 코드"
permalink: "/studies/calculus/code/01_limits_plot/"
---
{% raw %}
[극한](/Hongs_Blog/studies/calculus/limits/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 극한 문서의 그림을 만든다: 01_limits_fig1.svg, 01_limits_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 01_limits_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "01_limits"
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


def f(x):
    return (x ** 2 - 1) / (x - 1)


# 그림 1: (x^2 - 1)/(x - 1)은 직선 y = x + 1에서 (1, 2) 한 점만 뚫린 모양
x = np.linspace(-0.5, 2.5, 400)
x = x[np.abs(x - 1) > 1e-9]
y = f(x)
y[np.abs(x - 1) < 0.04] = np.nan               # 뚫린 점 둘레를 비운다
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, y, color=C[0], lw=2)
ax.plot([1], [2], "o", ms=8, mfc="none", mec=C[0], mew=2, zorder=3)
ax.plot([1, 1], [0, 2], color=INK, lw=0.8, ls=":")
ax.plot([-0.5, 1], [2, 2], color=INK, lw=0.8, ls=":")
for xv in [0.9, 1.1]:
    ax.plot([xv], [f(xv)], "o", ms=4, color=C[1])
ax.annotate("x = 1에서 값 없음\n다가가는 높이는 2", xy=(1, 2), xytext=(1.35, 1.2),
            fontsize=10, arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_xlim(-0.5, 2.5)
ax.set_ylim(0, 3.6)
ax.set_xlabel("$x$")
ax.set_ylabel("$f(x)$")
save(fig, 1)


# 그림 2: 극한이 없는 두 경우. 부호 함수(양쪽 값이 다름)와 sin(1/x)(끝없이 흔들림)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
a1.plot([-1, 0], [-1, -1], color=C[0], lw=2)
a1.plot([0, 1], [1, 1], color=C[0], lw=2)
a1.plot([0], [-1], "o", ms=6, mfc="none", mec=C[0], mew=1.5)
a1.plot([0], [1], "o", ms=6, mfc="none", mec=C[0], mew=1.5)
a1.plot([0], [0], "o", ms=5, color=C[0])
a1.set_title("부호 함수: 왼쪽 $-1$, 오른쪽 $1$", fontsize=10)
a1.set_ylim(-1.5, 1.5)
a1.axhline(0, color=INK, lw=0.5)
a1.set_xlabel("$x$")
xs = np.concatenate([-np.logspace(-3, 0, 4000)[::-1], np.logspace(-3, 0, 4000)])
a2.plot(xs, np.sin(1 / xs), color=C[1], lw=0.7)
a2.set_title(r"$\sin(1/x)$: 0 근처에서 끝없이 흔들림", fontsize=10)
a2.set_ylim(-1.5, 1.5)
a2.set_xlim(-0.5, 0.5)
a2.axhline(0, color=INK, lw=0.5)
a2.set_xlabel("$x$")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 예시 표의 값과, sin(1/x)가 0에 아무리 가까워도 1과 -1을 모두 지나는 것
    for xv, want in [(0.9, 1.9), (0.99, 1.99), (1.01, 2.01), (1.1, 2.1)]:
        assert abs(f(xv) - want) < 1e-9
    for k in [10, 1000, 100000]:
        assert abs(math.sin(1 / (1 / (2 * math.pi * k + math.pi / 2))) - 1) < 1e-6
        assert abs(math.sin(1 / (1 / (2 * math.pi * k - math.pi / 2))) + 1) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
