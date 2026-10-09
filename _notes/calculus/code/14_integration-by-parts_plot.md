---
layout: "note"
title: "14_integration-by-parts_plot.py"
display_title: "14_integration-by-parts_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "14"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/integration-by-parts/"
parent_title: "부분적분"
description: "미분적분학 · 부분적분 그림 생성 코드"
permalink: "/studies/calculus/code/14_integration-by-parts_plot/"
---
{% raw %}
[부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 부분적분 문서의 그림을 만든다: 14_integration-by-parts_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 14_integration-by-parts_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "14_integration-by-parts"
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


def mid_sum(g, a, b, n=100000):
    dx = (b - a) / n
    return sum(g(a + (i + 0.5) * dx) for i in range(n)) * dx


E = math.e

# 그림 1: 곡선 y = ln x (1 ≤ x ≤ e). 아래 넓이 ∫ln x dx + 왼쪽 넓이 ∫x dy = 직사각형 e × 1
fig, ax = plt.subplots(figsize=(6, 3.4))
x = np.linspace(1, E, 200)
ax.fill_between(x, 0, np.log(x), color=C[0], alpha=0.3)
ax.fill_betweenx(np.log(x), 0, x, color=C[1], alpha=0.3)
ax.plot(x, np.log(x), color=INK, lw=2.2)
ax.plot([0, E, E, 0, 0], [0, 0, 1, 1, 0], color=INK, lw=0.8, ls="--")
ax.text(2.25, 0.25, r"$\int_1^e \ln x\,dx = 1$", fontsize=10, ha="center", color=C[0])
ax.text(0.9, 0.55, r"$\int_0^1 x\,dy = e - 1$", fontsize=10, ha="center", color=C[1])
ax.text(E, 1.05, r"$(e,\,1)$", fontsize=10, ha="center", va="bottom")
ax.text(E / 2, -0.12, r"$uv$ 직사각형: $e \times 1$", fontsize=10, ha="center", va="top")
ax.set_xlim(-0.1, 3.1)
ax.set_ylim(-0.3, 1.25)
ax.set_xlabel("$x$")
ax.set_ylabel(r"$y=\ln x$")
ax.set_aspect("equal")
save(fig, 1)

if __name__ == "__main__":
    # 두 넓이 1과 e - 1, 합이 직사각형 넓이 e, 원시함수 x ln x - x로 계산한 값과 일치
    A = mid_sum(math.log, 1, E)
    B = mid_sum(math.exp, 0, 1)
    assert abs(A - 1) < 1e-9 and abs(B - (E - 1)) < 1e-9 and abs(A + B - E) < 1e-9
    G = lambda t: t * math.log(t) - t
    assert abs((G(E) - G(1)) - 1) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
