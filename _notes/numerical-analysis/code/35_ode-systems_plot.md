---
layout: "note"
title: "35_ode-systems_plot.py"
display_title: "35_ode-systems_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "35"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/ode-systems/"
parent_title: "연립 상미분방정식"
description: "수치해석 · 연립 상미분방정식 코드 코드"
permalink: "/studies/numerical-analysis/code/35_ode-systems_plot/"
---
{% raw %}
[연립 상미분방정식](/Hongs_Blog/studies/numerical-analysis/ode-systems/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연립 상미분방정식 문서의 그림을 만든다: 35_ode-systems_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 35_ode-systems_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "35_ode-systems"
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


def F(x, y):
    return np.array([-0.5 * y[0], 4 - 0.3 * y[1] - 0.1 * y[0]])


def exact(x):
    # y1 = 4e^{-x/2}, y2 = 40/3 + 2e^{-x/2} − (28/3)e^{-0.3x} (선형이라 손으로 푼 식)
    return np.array([4 * np.exp(-x / 2), 40 / 3 + 2 * np.exp(-x / 2) - 28 / 3 * np.exp(-0.3 * x)])


def run(step, h, n):
    x, y = 0.0, np.array([4.0, 6.0])
    out = [y]
    for _ in range(n):
        y = step(x, y, h)
        x += h
        out.append(y)
    return np.array(out)


euler = lambda x, y, h: y + h * F(x, y)


def rk4(x, y, h):
    k1 = F(x, y)
    k2 = F(x + h / 2, y + h / 2 * k1)
    k3 = F(x + h / 2, y + h / 2 * k2)
    k4 = F(x + h, y + h * k3)
    return y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)


XS = np.arange(5) * 0.5
E = run(euler, 0.5, 4)
R = run(rk4, 0.5, 4)
xx = np.linspace(0, 2, 200)
Y = exact(xx)
fig, ax = plt.subplots(figsize=(6, 3.6))
for j, name in enumerate(["$y_1$", "$y_2$"]):
    ax.plot(xx, Y[j], color=C[j], lw=2, label=f"{name} 참값")
    ax.plot(XS, E[:, j], "o--", color=C[j], ms=5, lw=0.8, mfc="none", label=f"{name} 오일러")
    ax.plot(XS, R[:, j], "x", color=INK, ms=7, mew=1.5)
ax.plot([], [], "x", color=INK, ms=7, mew=1.5, label="RK4")
ax.set_xlabel("$x$")
ax.legend(loc="center right", fontsize=9, ncol=1)
ax.set_ylim(0, 10.5)
save(fig, 1)

if __name__ == "__main__":
    # 표: 오일러 y1 = 3, 2.25, 1.6875, 1.265625, y2 = 6.9, 7.715, 8.44525, 9.094087. RK4 오차 1e-4 아래
    assert np.allclose(E[:, 0], [4, 3, 2.25, 1.6875, 1.265625])
    assert np.allclose(E[:, 1], [6, 6.9, 7.715, 8.44525, 9.094087], atol=1e-6)
    assert abs(exact(np.array(2.0))[0] - 1.47) < 0.005
    assert np.max(np.abs(R - exact(XS).T)) < 1e-4
    h = 1e-6                                           # 참값 식이 방정식을 만족하는지
    for x0 in (0.3, 1.7):
        d = (exact(np.array(x0 + h)) - exact(np.array(x0 - h))) / (2 * h)
        assert np.allclose(d, F(x0, exact(np.array(x0))), atol=1e-6)
    print("ALL CHECKS PASSED")
```
{% endraw %}
