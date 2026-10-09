---
layout: "note"
title: "34_runge-kutta_plot.py"
display_title: "34_runge-kutta_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "34"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/runge-kutta/"
parent_title: "룽게-쿠타 방법"
description: "수치해석 · 룽게-쿠타 방법 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/34_runge-kutta_plot/"
---
{% raw %}
[룽게-쿠타 방법](/Hongs_Blog/studies/numerical-analysis/runge-kutta/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 룽게-쿠타 방법 문서의 그림을 만든다: 34_runge-kutta_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 34_runge-kutta_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "34_runge-kutta"
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


f = lambda x, y: x + y
EXACT = 2 * math.e - 2


def euler(x, y, h):
    return y + h * f(x, y)


def heun(x, y, h):
    k1 = f(x, y)
    k2 = f(x + h, y + h * k1)
    return y + h / 2 * (k1 + k2)


def rk4(x, y, h):
    k1 = f(x, y)
    k2 = f(x + h / 2, y + h / 2 * k1)
    k3 = f(x + h / 2, y + h / 2 * k2)
    k4 = f(x + h, y + h * k3)
    return y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)


def solve(step, h):
    x, y = 0.0, 1.0
    for _ in range(round(1 / h)):
        y = step(x, y, h)
        x += h
    return y


METHODS = [("오일러", euler, 1), ("호인 (2차)", heun, 2), ("RK4", rk4, 4)]
HS = [0.2, 0.1, 0.05, 0.025, 0.0125, 0.00625]
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (name, step, evals) in enumerate(METHODS):
    work = [evals * round(1 / h) for h in HS]
    err = [abs(solve(step, h) - EXACT) for h in HS]
    ax.loglog(work, err, "o-", color=C[i], ms=4, lw=1.5, label=f"{name}: 걸음마다 {evals}번")
ax.axvline(40, color=INK, lw=0.6, ls=":")
ax.text(42, 3e-1, "기울기 계산 40번", fontsize=9, va="center")
ax.set_yticks([1e-10, 1e-8, 1e-6, 1e-4, 1e-2, 1])
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{round(math.log10(v))}}}$"))
ax.set_xlabel("$x = 1$까지 기울기 $f$를 계산한 횟수")
ax.set_ylabel("$x = 1$에서 오차")
ax.legend(loc="lower left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 표: h = 0.1에서 오일러 2.5e-1, 호인 8.4e-3, RK4 4.2e-6. 호인 첫 걸음 y_1 = 1.11.
    # 같은 계산 40번이면 RK4(h = 0.1)가 오일러(h = 0.025)보다 만 배 넘게 정확하다
    assert [float(f"{abs(solve(s, 0.1) - EXACT):.1e}") for _, s, _ in METHODS] == [2.5e-1, 8.4e-3, 4.2e-6]
    assert abs(heun(0, 1, 0.1) - 1.11) < 1e-12
    assert abs(solve(euler, 0.025) - EXACT) / abs(solve(rk4, 0.1) - EXACT) > 10000
    print("ALL CHECKS PASSED")
```
{% endraw %}
