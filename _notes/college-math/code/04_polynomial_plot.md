---
layout: "note"
title: "04_polynomial_plot.py"
display_title: "04_polynomial_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "04"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/polynomial/"
parent_title: "다항식과 방정식"
description: "대학수학 · 다항식과 방정식 그림 생성 코드"
permalink: "/studies/college-math/code/04_polynomial_plot/"
---
{% raw %}
[다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 다항식과 방정식 문서의 그림을 만든다: 04_polynomial_fig1.svg, 04_polynomial_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 04_polynomial_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "04_polynomial"
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

def p(x):
    return x ** 3 - 6 * x ** 2 + 11 * x - 6


# 그림 1: p(x) = (x−1)(x−2)(x−3)은 가로축을 1, 2, 3에서 세 번 지난다
x = np.linspace(0.4, 3.6, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, p(x), color=C[0], lw=2, label="$p(x) = x^3 - 6x^2 + 11x - 6$")
ax.plot([1, 2, 3], [0, 0, 0], "o", color=C[1])
for r in (1, 2, 3):
    ax.text(r, -0.32, f"{r}", ha="center", va="top", fontsize=10, color=C[1])
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-2, 2)
ax.set_xlabel("$x$")
ax.legend(loc="upper left")
save(fig, 1)

# 그림 2: 판별식의 세 경우. 같은 포물선을 위로 올리면 가로축과 만나는 점이 2 → 1 → 0개
x = np.linspace(-1.8, 3.8, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
cases = [(-3, "$x^2 - 2x - 3$,  $D = 16 > 0$"), (1, "$x^2 - 2x + 1$,  $D = 0$"), (3, "$x^2 - 2x + 3$,  $D = -8 < 0$")]
for i, (c, lab) in enumerate(cases):
    ax.plot(x, x ** 2 - 2 * x + c, color=C[i], lw=2, label=lab)
ax.plot([-1, 3], [0, 0], "o", color=C[0])
ax.plot([1], [0], "o", color=C[1])
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-4.5, 10.5)
ax.set_xlabel("$x$")
ax.legend(loc="upper center", fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # 근 1, 2, 3과 인수분해, 판별식 16, 0, −8과 근
    assert [p(r) for r in (1, 2, 3)] == [0, 0, 0]
    assert all(p(v) == (v - 1) * (v - 2) * (v - 3) for v in range(-5, 6))
    assert [(-2) ** 2 - 4 * c for c in (-3, 1, 3)] == [16, 0, -8]
    assert all(v ** 2 - 2 * v - 3 == 0 for v in (-1, 3))
    print("ALL CHECKS PASSED")
```
{% endraw %}
