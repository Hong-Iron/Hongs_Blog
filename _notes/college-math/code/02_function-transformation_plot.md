---
layout: "note"
title: "02_function-transformation_plot.py"
display_title: "02_function-transformation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "02"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/function-transformation/"
parent_title: "함수의 변환과 합성"
description: "대학수학 · 함수의 변환과 합성 코드 코드"
permalink: "/studies/college-math/code/02_function-transformation_plot/"
---
{% raw %}
[함수의 변환과 합성](/Hongs_Blog/studies/college-math/function-transformation/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 함수의 변환과 합성 문서의 그림을 만든다: 02_function-transformation_fig1.svg, 02_function-transformation_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 02_function-transformation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "02_function-transformation"
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

def g(x):
    return -2 * (x - 1) ** 2 + 3


# 그림 1: f(x) = x²와 f(x − 3) = (x − 3)². 같은 일이 3만큼 오른쪽에서 일어난다
x = np.linspace(-2.5, 5.5, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, x ** 2, color=INK, lw=2.2, label="$f(x) = x^2$")
ax.plot(x, (x - 3) ** 2, color=C[0], lw=2, label="$f(x-3) = (x-3)^2$")
for (a, b) in [((0, 0), (3, 0)), ((1, 1), (4, 1))]:
    ax.annotate("", xy=b, xytext=a, arrowprops=dict(arrowstyle="->", color=C[1], lw=1.4))
    ax.plot(*a, "o", color=INK)
    ax.plot(*b, "o", color=C[0])
ax.text(1.5, -0.6, "+3", color=C[1], ha="center", fontsize=10)
ax.text(2.5, 1.25, "+3", color=C[1], ha="center", fontsize=10)
ax.set_ylim(-1, 6)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$x$")
ax.legend(loc="upper left")
save(fig, 1)

# 그림 2: y = x²에서 y = −2(x − 1)² + 3으로. 꼭짓점 (0, 0) → (1, 3), 아래로 열리고 2배 가파르다
x = np.linspace(-1.5, 3, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, x ** 2, color=INK, lw=2.2, label="$y = x^2$")
ax.plot(x, g(x), color=C[0], lw=2, label="$y = -2(x-1)^2 + 3$")
ax.annotate("", xy=(1, 3), xytext=(0, 0), arrowprops=dict(arrowstyle="->", color=C[1], lw=1.4))
ax.plot([0], [0], "o", color=INK)
ax.plot([1], [3], "o", color=C[0])
ax.plot([0, 2], [1, 1], "o", color=C[0], mfc="none")
ax.text(1.08, 3.15, "(1, 3)", fontsize=10)
ax.text(2.08, 0.6, "(2, 1)", fontsize=10)
ax.text(-0.55, 0.6, "(0, 1)", fontsize=10)
ax.set_ylim(-3, 4.5)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$x$")
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5))
save(fig, 2)

if __name__ == "__main__":
    # 점 대응 (1, 1) → (4, 1), 예제의 꼭짓점과 x = 0, 2에서의 값
    assert (4 - 3) ** 2 == 1
    assert g(1) == 3 and g(0) == 1 and g(2) == 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
