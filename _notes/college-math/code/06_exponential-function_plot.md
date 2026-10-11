---
layout: "note"
title: "06_exponential-function_plot.py"
display_title: "06_exponential-function_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "06"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/exponential-function/"
parent_title: "지수함수"
description: "대학수학 · 지수함수 그림 생성 코드"
permalink: "/studies/college-math/code/06_exponential-function_plot/"
---
{% raw %}
[지수함수](/Hongs_Blog/studies/college-math/exponential-function/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 지수함수 문서의 그림을 만든다: 06_exponential-function_fig1.svg, 06_exponential-function_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 06_exponential-function_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "06_exponential-function"
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

# 그림 1: 밑이 다른 지수함수는 모두 (0, 1)을 지난다. e^x만 그 점에서 기울기가 정확히 1이다
x = np.linspace(-2.5, 2.2, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (b, lab) in enumerate([(2, "$2^x$"), (math.e, "$e^x$"), (3, "$3^x$"), (0.5, "$(1/2)^x$")]):
    ax.plot(x, b ** x, color=C[i], lw=2, label=lab)
ax.plot(x, 1 + x, color=INK, lw=1, ls="--", label="$y = 1 + x$ (기울기 1)")
ax.plot([0], [1], "o", color=INK)
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-1, 6)
ax.set_xlabel("$x$")
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=10)
save(fig, 1)

# 그림 2: 1.01^x와 10x. x = 100에서는 지수 쪽이 훨씬 작지만 x = 917에서 역전한다
def cross():
    x = 1
    while 1.01 ** x <= 10 * x:
        x += 1
    return x


X = cross()
x = np.linspace(0, 1100, 600)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, 1.01 ** x, color=C[1], lw=2, label="$1.01^x$")
ax.plot(x, 10 * x, color=C[0], lw=2, label="$10x$")
ax.axvline(X, color=INK, lw=0.8, ls=":")
ax.text(X - 15, 45000, f"$x = {X}$에서 역전", fontsize=10, ha="right")
ax.plot([100, 100], [1.01 ** 100, 1000], "o", color=INK)
ax.annotate("$x = 100$: 2.70 대 1000", xy=(100, 1000), xytext=(40, 16000), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_ylim(0, 60000)
ax.set_xlabel("$x$")
ax.legend(loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    # 기울기 ln 2, 1, ln 3, x = 100의 값, 역전점 917
    h = 1e-7
    slopes = [(b ** h - b ** (-h)) / (2 * h) for b in (2, math.e, 3)]
    assert [round(s, 4) for s in slopes] == [0.6931, 1.0, 1.0986]
    assert round(1.01 ** 100, 2) == 2.70
    assert X == 917 and 1.01 ** 916 <= 9160 and 1.01 ** 917 > 9170
    print("ALL CHECKS PASSED")
```
{% endraw %}
