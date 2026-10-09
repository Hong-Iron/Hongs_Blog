---
layout: "note"
title: "23_hessian_plot.py"
display_title: "23_hessian_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "23"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/hessian/"
parent_title: "헤세 행렬과 극값 판정"
description: "미분적분학 · 헤세 행렬과 극값 판정 코드 코드"
permalink: "/studies/calculus/code/23_hessian_plot/"
---
{% raw %}
[헤세 행렬과 극값 판정](/Hongs_Blog/studies/calculus/hessian/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 헤세 행렬과 극값 판정 문서의 그림을 만든다: 23_hessian_fig1.svg, 23_hessian_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_hessian_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_hessian"
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


FUNCS = [
    (lambda x, y: x ** 2 + y ** 2, "$x^2+y^2$: 극소"),
    (lambda x, y: -x ** 2 - y ** 2, "$-x^2-y^2$: 극대"),
    (lambda x, y: x ** 2 - y ** 2, "$x^2-y^2$: 안장점"),
]


def ex(x, y):
    return x ** 3 - 3 * x + y ** 2


# 그림 1: 원점에서 기울기가 0인 세 함수의 등고선. 실선은 0보다 큰 높이, 점선은 0보다 낮은 높이
fig, axes = plt.subplots(1, 3, figsize=(6.5, 2.4))
X, Y = np.meshgrid(np.linspace(-1.2, 1.2, 200), np.linspace(-1.2, 1.2, 200))
for ax, (fn, title) in zip(axes, FUNCS):
    lv = [-1.5, -1, -0.5, -0.2, 0.2, 0.5, 1, 1.5]
    ax.contour(X, Y, fn(X, Y), levels=[v for v in lv if v > 0], colors=C[1], linewidths=1)
    ax.contour(X, Y, fn(X, Y), levels=[v for v in lv if v < 0], colors=C[0], linewidths=1, linestyles="--")
    ax.plot([0], [0], "o", ms=4, color=INK)
    ax.set_title(title, fontsize=10)
    ax.set_aspect("equal")
    ax.set_xticks([-1, 0, 1])
    ax.set_yticks([-1, 0, 1])
    ax.set_xlabel("$x$")
axes[0].set_ylabel("$y$")
fig.tight_layout()
save(fig, 1)

# 그림 2: 예제 x^3 - 3x + y^2의 등고선. (1, 0)은 골짜기 바닥, (-1, 0)은 말안장
fig, ax = plt.subplots(figsize=(6, 3.4))
X, Y = np.meshgrid(np.linspace(-2.2, 2.2, 300), np.linspace(-1.6, 1.6, 300))
cs = ax.contour(X, Y, ex(X, Y), levels=[-1.8, -1.5, -1, 0, 1, 2, 2.5, 3, 4], colors=INK, linewidths=0.8)
ax.clabel(cs, fontsize=7, fmt="%g")
ax.plot([1], [0], "o", ms=7, color=C[2], label="극소 $(1,0)$, 값 $-2$")
ax.plot([-1], [0], "s", ms=7, color=C[1], label="안장점 $(-1,0)$, 값 2")
ax.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=9)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 2)

if __name__ == "__main__":
    # 예제의 임계점과 값, 극소점은 주변보다 낮고 안장점은 x 방향으로 낮아지고 y 방향으로 높아진다
    assert ex(1, 0) == -2 and ex(-1, 0) == 2
    rng = np.random.default_rng(0)
    d = rng.normal(size=(1000, 2)) * 0.05
    assert np.all(ex(1 + d[:, 0], d[:, 1]) > -2)
    assert ex(-1 + 0.05, 0) < 2 and ex(-1 - 0.05, 0) < 2 and ex(-1, 0.05) > 2
    # 세 함수: 원점 주변 무작위 점에서 극소·극대·부호가 섞임
    v = [np.array([fn(a, b) for a, b in d]) for fn, _ in FUNCS]
    assert np.all(v[0] > 0) and np.all(v[1] < 0) and (v[2] > 0).any() and (v[2] < 0).any()
    print("ALL CHECKS PASSED")
```
{% endraw %}
