---
layout: "note"
title: "26_conditioning_plot.py"
display_title: "26_conditioning_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "26"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/conditioning/"
parent_title: "노름과 조건수"
description: "선형대수학 · 노름과 조건수 코드 코드"
permalink: "/studies/linear-algebra/code/26_conditioning_plot/"
---
{% raw %}
[노름과 조건수](/Hongs_Blog/studies/linear-algebra/conditioning/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 노름과 조건수 문서의 그림을 만든다: 26_conditioning_fig1.svg, 26_conditioning_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_conditioning_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_conditioning"
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


def arrow(ax, start, vec, color, lw=1.8, ls="-"):
    """start에서 vec만큼 가는 화살표"""
    ax.annotate("", xy=(start[0] + vec[0], start[1] + vec[1]), xytext=(start[0], start[1]),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, ls=ls, shrinkA=0, shrinkB=0,
                                mutation_scale=12))


A = np.array([[1, 1], [1, 1.0001]])
x = np.linspace(-0.5, 2.5, 50)


def lift(b2, x=x):
    """둘째 직선 x + 1.0001y = b2가 첫째 직선 x + y = 2보다 얼마나 위에 있는지(세로 거리)"""
    return (b2 - x) / 1.0001 - (2 - x)


# 그림 1: 두 직선은 거의 겹친다. 첫째 직선을 기준(0)으로 둔 세로 거리를 1만 배 확대해 그렸다
fig, ax = plt.subplots(figsize=(6, 3.2))
ax.axhline(0, color=C[0], lw=2, label="$x + y = 2$")
ax.plot(x, lift(2.0001) * 1e4, color=C[1], lw=1.8, label="$x + 1.0001y = 2.0001$")
ax.plot(x, lift(2.0002) * 1e4, color=C[2], lw=1.8, ls="--", label="$x + 1.0001y = 2.0002$")
ax.plot(1, 0, "o", color=C[1], ms=7)
ax.plot(0, 0, "o", color=C[2], ms=7)
ax.text(1, -0.12, "교점 (1, 1)", color=C[1], fontsize=10, ha="center", va="top")
ax.text(-0.08, 0.1, "교점 (0, 2)", color=C[2], fontsize=10, ha="right", va="bottom")
ax.set_xlabel("$x$")
ax.set_ylabel(r"세로 거리 ($\times 10^{-4}$)")
ax.set_ylim(-1, 1.3)
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

# 그림 2: 힐베르트 행렬의 조건수와 실제 풀이 오차
ns = np.arange(2, 13)
kappa, err = [], []
for n in ns:
    H = 1.0 / (np.arange(1, n + 1)[:, None] + np.arange(1, n + 1)[None, :] - 1)
    kappa.append(np.linalg.cond(H))
    xs = np.linalg.solve(H, H @ np.ones(n))
    err.append(np.max(np.abs(xs - 1)))
kappa, err = np.array(kappa), np.array(err)
eps = np.finfo(float).eps
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.semilogy(ns, kappa, "o-", color=C[0], ms=4, label=r"조건수 $\kappa_2(H)$")
ax.semilogy(ns, kappa * eps, "--", color=C[0], lw=1, label=r"$\kappa\varepsilon$ (예상 오차 크기)")
ax.semilogy(ns, err, "s-", color=C[1], ms=4, label="실제 최대 오차")
ax.set_xlabel("크기 $n$")
pow10 = matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(np.log10(v)))}}}$")
ax.yaxis.set_major_locator(matplotlib.ticker.LogLocator(numticks=8))
ax.yaxis.set_major_formatter(pow10)
ax.yaxis.set_minor_locator(matplotlib.ticker.NullLocator())
ax.legend(fontsize=9, loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    assert np.allclose(np.linalg.solve(A, [2, 2.0001]), [1, 1]) and np.allclose(np.linalg.solve(A, [2, 2.0002]), [0, 2])
    assert abs(lift(2.0001, 1.0)) < 1e-12 and abs(lift(2.0002, 0.0)) < 1e-12   # 교점이 x = 1에서 x = 0으로 옮겨 간다
    assert 3.9e4 < np.linalg.cond(A) < 4.1e4
    k10 = kappa[ns == 10][0]
    assert 1.5e13 < k10 < 1.7e13
    assert 1e-4 < err[ns == 10][0] < 1e-3 and err[ns == 4][0] < 1e-12
    ratios = kappa[1:] / kappa[:-1]
    assert ((ratios > 25) & (ratios < 35)).all()            # n이 하나 늘 때 조건수 약 30배
    assert (err <= kappa * eps).all()                       # 실제 오차가 κε를 넘지 않음
    print("ALL CHECKS PASSED")
```
{% endraw %}
