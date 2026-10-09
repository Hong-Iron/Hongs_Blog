---
layout: "note"
title: "37_finite-difference-bvp_plot.py"
display_title: "37_finite-difference-bvp_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "37"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/finite-difference-bvp/"
parent_title: "유한 차분법"
description: "수치해석 · 유한 차분법 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/37_finite-difference-bvp_plot/"
---
{% raw %}
[유한 차분법](/Hongs_Blog/studies/numerical-analysis/finite-difference-bvp/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 유한 차분법 문서의 그림을 만든다: 37_finite-difference-bvp_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 37_finite-difference-bvp_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "37_finite-difference-bvp"
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


HP, TA, T0, TL, L = 0.01, 20.0, 40.0, 200.0, 10.0
LAM = math.sqrt(HP)


def exact(x):
    # T = TA + A e^{λx} + B e^{−λx}, 양 끝 조건으로 A, B를 정한다
    M = np.array([[1, 1], [math.exp(LAM * L), math.exp(-LAM * L)]])
    A, B = np.linalg.solve(M, [T0 - TA, TL - TA])
    return TA + A * np.exp(LAM * x) + B * np.exp(-LAM * x)


def fd(dx):
    n = round(L / dx)
    K = np.diag([2 + HP * dx * dx] * (n - 1)) - np.eye(n - 1, k=1) - np.eye(n - 1, k=-1)
    rhs = np.full(n - 1, HP * dx * dx * TA)
    rhs[0] += T0
    rhs[-1] += TL
    x = np.linspace(0, L, n + 1)
    return x, np.concatenate([[T0], np.linalg.solve(K, rhs), [TL]])


DXS = [2.0, 1.0, 0.5, 0.25]
maxerr = [np.max(np.abs(fd(d)[1] - exact(fd(d)[0]))) for d in DXS]
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
ax = axes[0]
xx = np.linspace(0, L, 200)
ax.plot(xx, exact(xx), color=INK, lw=2, label="참값")
x2, T2 = fd(2.0)
ax.plot(x2, T2, "o", color=C[1], ms=6, mfc="none", mew=1.5, label="유한 차분 $\\Delta x = 2$")
ax.set_xlabel("$x$ (m)")
ax.set_ylabel("$T$ (°C)")
ax.legend(loc="upper left", fontsize=9)
ax = axes[1]
ax.loglog(DXS, maxerr, "o-", color=C[0], ms=5, lw=1.5)
for d, e in zip(DXS, maxerr):
    ax.annotate(f"{e:.2g}", (d, e), textcoords="offset points", xytext=(6, -2), fontsize=9)
ax.set_xticks(DXS, ["2", "1", "0.5", "0.25"])
ax.minorticks_off()
ax.set_yticks([1e-3, 1e-2, 1e-1])
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{round(math.log10(v))}}}$"))
ax.set_xlabel("간격 $\\Delta x$")
ax.set_ylabel("가장 큰 오차")
ax.set_title("반으로 줄이면 오차 1/4", fontsize=10)
fig.subplots_adjust(wspace=0.5)
save(fig, 1)

if __name__ == "__main__":
    # 표: 유한 차분 65.9698, 93.7785, 124.5382, 159.4795, 참값 65.9518, …, 가장 큰 오차 0.035 → 0.0087
    assert np.allclose(T2[1:-1], [65.9698, 93.7785, 124.5382, 159.4795], atol=1e-4)
    assert np.allclose(exact(np.array([2, 4, 6, 8.0])), [65.9518, 93.7478, 124.5035, 159.4534], atol=1e-4)
    assert round(maxerr[0], 3) == 0.035 and round(maxerr[1], 4) == 0.0087
    assert all(abs(a / b - 4) < 0.1 for a, b in zip(maxerr, maxerr[1:]))
    print("ALL CHECKS PASSED")
```
{% endraw %}
