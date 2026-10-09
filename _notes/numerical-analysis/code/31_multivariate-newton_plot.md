---
layout: "note"
title: "31_multivariate-newton_plot.py"
display_title: "31_multivariate-newton_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "31"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/multivariate-newton/"
parent_title: "다변수 뉴턴 방법"
description: "수치해석 · 다변수 뉴턴 방법 코드 코드"
permalink: "/studies/numerical-analysis/code/31_multivariate-newton_plot/"
---
{% raw %}
[다변수 뉴턴 방법](/Hongs_Blog/studies/numerical-analysis/multivariate-newton/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 다변수 뉴턴 방법 문서의 그림을 만든다: 31_multivariate-newton_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 31_multivariate-newton_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "31_multivariate-newton"
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


u = lambda x, y: x * x + x * y - 10
v = lambda x, y: y + 3 * x * y * y - 57


def newton_path(x, y, n):
    path = [(x, y)]
    for _ in range(n):
        J = np.array([[2 * x + y, x], [3 * y * y, 1 + 6 * x * y]])
        dx, dy = np.linalg.solve(J, [-u(x, y), -v(x, y)])
        x, y = x + dx, y + dy
        path.append((x, y))
    return np.array(path)


def fixed_point_path(x, y, n):
    """방법 ii: x = √(10 − xy), y = √((57 − y)/(3x)), y는 새 x로."""
    path = [(x, y)]
    for _ in range(n):
        x = math.sqrt(10 - x * y)
        y = math.sqrt((57 - y) / (3 * x))
        path.append((x, y))
    return np.array(path)


NP = newton_path(1.5, 3.5, 4)
FP = fixed_point_path(1.5, 3.5, 40)
dN = np.hypot(NP[:, 0] - 2, NP[:, 1] - 3)
dF = np.hypot(FP[:, 0] - 2, FP[:, 1] - 3)

fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
ax = axes[0]
gx, gy = np.meshgrid(np.linspace(1.3, 2.4, 200), np.linspace(2.4, 3.7, 200))
ax.contour(gx, gy, u(gx, gy), levels=[0], colors=[C[0]], linewidths=1.4)
ax.contour(gx, gy, v(gx, gy), levels=[0], colors=[C[2]], linewidths=1.4)
ax.text(1.35, 3.62, "$u = 0$", color=C[0], fontsize=9)
ax.text(1.62, 3.62, "$v = 0$", color=C[2], fontsize=9)
ax.plot(NP[:, 0], NP[:, 1], "o-", color=C[1], ms=4, lw=1.2, label="뉴턴")
ax.plot(FP[:8, 0], FP[:8, 1], "s--", color=C[3], ms=3, lw=1, label="고정점 (방법 ii)")
ax.plot(1.5, 3.5, "o", color=INK, ms=5)
ax.annotate("시작", (1.5, 3.5), textcoords="offset points", xytext=(6, -2), fontsize=9)
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
ax.legend(loc="lower left", fontsize=8)
ax = axes[1]
ax.semilogy(range(len(dN)), dN, "o-", color=C[1], ms=4, label="뉴턴")
ax.semilogy(range(len(dF)), dF, "s-", color=C[3], ms=3, label="고정점 (방법 ii)")
ax.set_yticks([1e-12, 1e-8, 1e-4, 1])
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v_, _: f"$10^{{{round(math.log10(v_))}}}$"))
ax.set_ylim(1e-14, 3)
ax.set_xlabel("반복")
ax.set_ylabel("(2, 3)까지 거리")
ax.legend(loc="lower left", fontsize=8)
fig.subplots_adjust(wspace=0.5)
save(fig, 1)

if __name__ == "__main__":
    # 첫 반복 (2.03603, 2.84388), 거리 표 7.1e-1, 1.6e-1, 2.6e-3, 5.9e-7, 고정점 방법 ii의 첫 값 (2.17945, 2.86051)
    assert np.allclose(NP[1], [2.03603, 2.84388], atol=5e-6)
    assert [float(f"{d:.1e}") for d in dN[:4]] == [7.1e-1, 1.6e-1, 2.6e-3, 5.9e-7] and dN[4] < 1e-12
    assert np.allclose(FP[1], [2.17945, 2.86051], atol=5e-6)
    assert dF[4] > 1e-3                                  # 같은 4번이면 고정점은 아직 멀다
    print("ALL CHECKS PASSED")
```
{% endraw %}
