---
layout: "note"
title: "34_linear-regression_plot.py"
display_title: "34_linear-regression_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "34"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/linear-regression/"
parent_title: "선형회귀"
description: "확률과 통계 · 선형회귀 코드 코드"
permalink: "/studies/probability-statistics/code/34_linear-regression_plot/"
---
{% raw %}
[선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형회귀 문서의 그림을 만든다: 34_linear-regression_fig1.svg, 34_linear-regression_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 34_linear-regression_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "34_linear-regression"
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


def Phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def ols(x, y):
    x, y = np.asarray(x, float), np.asarray(y, float)
    b1 = ((x - x.mean()) * (y - y.mean())).sum() / ((x - x.mean()) ** 2).sum()
    return y.mean() - b1 * x.mean(), b1


xs = np.array([1, 2, 3, 4, 5.0])
ys = np.array([2.1, 3.9, 6.2, 7.8, 10.1])
b0, b1 = ols(xs, ys)
res = ys - (b0 + b1 * xs)

# 그림 1: 다섯 달의 점, 최소제곱 직선, 잔차(세로 선분). 잔차 제곱의 합이 가장 작은 직선이다
fig, ax = plt.subplots(figsize=(6, 3.6))
t = np.linspace(0.5, 5.5, 50)
ax.plot(t, b0 + b1 * t, color=C[0], lw=2)
for x, y, r in zip(xs, ys, res):
    ax.plot([x, x], [y - r, y], color=C[1], lw=1.6)
    ax.text(x + 0.07, y - r / 2, f"{r:+.2f}", color=C[1], fontsize=9, va="center")
ax.plot(xs, ys, "o", color=INK, ms=6)
ax.text(1.0, 8.5, f"$\\hat y = {b0:.2f} + {b1:.2f}x$", color=C[0], fontsize=11)
ax.set_xlabel("광고비 $x$ (백만 원)")
ax.set_ylabel("매출 $y$ (억 원)")
save(fig, 1)

# 그림 2: 실패 시나리오. 왼쪽 곡선에 직선을 맞추면 잔차가 U자, 오른쪽 극단값 하나가 기울기를 뒤집는다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
qx = np.array([i / 4 for i in range(-8, 9)])
qy = qx ** 2
c0, c1 = ols(qx, qy)
a1.plot(qx, qy - (c0 + c1 * qx), "o", color=C[0], ms=4)
a1.axhline(0, color=INK, lw=0.6)
a1.set_title("$y = x^2$에 직선: 잔차", fontsize=10)
a1.set_xlabel("$x$")
ox = np.arange(10.0)
oy = 2 * ox + 1
oy_bad = oy.copy()
oy_bad[9] = -50
_, s_clean = ols(ox, oy)
d0, s_bad = ols(ox, oy_bad)
a2.plot(ox[:9], oy[:9], "o", color=INK, ms=4)
a2.plot(9, -50, "o", color=C[1], ms=6)
a2.plot(ox, 2 * ox + 1, color=C[0], lw=1.6, label=f"극단값 없음: 기울기 {s_clean:.0f}")
a2.plot(ox, d0 + s_bad * ox, color=C[1], lw=1.6, label=f"극단값 하나: 기울기 {s_bad:.2f}")
a2.set_title("점 하나를 −50으로".replace("−", "-"), fontsize=10)
a2.set_xlabel("$x$")
a2.legend(loc="lower left", fontsize=8)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    rss = float((res ** 2).sum())
    r2 = 1 - rss / float(((ys - ys.mean()) ** 2).sum())
    assert round(b0, 2) == 0.05 and round(b1, 2) == 1.99 and round(rss, 3) == 0.107 and round(r2, 3) == 0.997
    q = qy - (c0 + c1 * qx)
    assert q[0] > 0 and q[len(q) // 2] < 0 and q[-1] > 0
    assert s_clean == 2 and s_bad < 0
    assert round(s_bad, 2) == -1.76
    print("ALL CHECKS PASSED")
```
{% endraw %}
