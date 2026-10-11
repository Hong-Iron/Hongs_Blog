---
layout: "note"
title: "01_function_plot.py"
display_title: "01_function_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "01"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/function/"
parent_title: "함수"
description: "대학수학 · 함수 그림 생성 코드"
permalink: "/studies/college-math/code/01_function_plot/"
---
{% raw %}
[함수](/Hongs_Blog/studies/college-math/function/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 함수 문서의 그림을 만든다: 01_function_fig1.svg, 01_function_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 01_function_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "01_function"
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
    return math.sqrt(x - 1) / (x - 3)


# 그림 1: 세로선 판정. 원은 x = 0에서 두 점, 포물선은 어느 세로선과도 한 점
fig, axs = plt.subplots(1, 2, figsize=(6.5, 3))
t = np.linspace(0, 2 * np.pi, 400)
ax = axs[0]
ax.plot(np.cos(t), np.sin(t), color=C[0], lw=2)
ax.axvline(0, color=C[1], lw=1.2, ls="--")
ax.plot([0, 0], [1, -1], "o", color=C[1])
ax.text(0.08, 1.05, "(0, 1)", fontsize=10)
ax.text(0.08, -1.2, "(0, -1)", fontsize=10)
ax.set_title("$x^2 + y^2 = 1$: 함수가 아니다", fontsize=11)
ax.set_aspect("equal")
ax.set_xlim(-1.4, 1.4)
ax.set_ylim(-1.45, 1.45)
ax = axs[1]
x = np.linspace(-2, 2, 400)
ax.plot(x, x ** 2, color=C[0], lw=2)
for x0 in [-1.5, 0.5, 1.2]:
    ax.axvline(x0, color=C[1], lw=1.2, ls="--")
    ax.plot([x0], [x0 ** 2], "o", color=C[1])
ax.set_title("$y = x^2$: 함수다", fontsize=11)
ax.set_xlim(-2.1, 2.1)
ax.set_ylim(-0.3, 4.3)
for a in axs:
    a.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

# 그림 2: f(x) = √(x−1)/(x−3)의 그래프. x = 1에서 시작하고 x = 3에서 끊긴다
fig, ax = plt.subplots(figsize=(6, 3.6))
x1 = np.linspace(1, 2.92, 400)
x2 = np.linspace(3.08, 9, 400)
ax.plot(x1, [f(v) for v in x1], color=C[0], lw=2)
ax.plot(x2, [f(v) for v in x2], color=C[0], lw=2)
ax.plot([1], [0], "o", color=C[0])
ax.axvline(3, color=C[1], lw=1, ls="--")
ax.text(3.15, -9, "$x = 3$: 분모가 0", fontsize=10, color=C[1])
ax.text(1.05, 1.2, "$x = 1$에서 시작", fontsize=10)
ax.axvspan(-1, 1, color=INK, alpha=0.12)
ax.text(0, 5, "정의되지\n않음", fontsize=10, ha="center")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlim(-1, 9)
ax.set_ylim(-10, 10)
ax.set_xlabel("$x$")
save(fig, 2)

if __name__ == "__main__":
    # 원의 x = 0에서 y가 둘, 포물선은 세로선마다 한 점
    ys = [y for y in (1.0, -1.0) if abs(0 ** 2 + y ** 2 - 1) < 1e-12]
    assert len(ys) == 2
    # 자연 정의역 [1, 3) ∪ (3, ∞): 1에서 0, 2에서 −1, 5에서 1, 1보다 작거나 3이면 계산 불가
    assert f(1) == 0 and f(2) == -1 and f(5) == 1
    for bad in (0.5, 3):
        try:
            f(bad)
            raise AssertionError
        except (ValueError, ZeroDivisionError):
            pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
