---
layout: "note"
title: "13_cubic-interpolation_plot.py"
display_title: "13_cubic-interpolation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "13"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/cubic-interpolation-curve/"
parent_title: "3차 보간 곡선"
description: "수치해석 · 3차 보간 곡선 코드 코드"
permalink: "/studies/numerical-analysis/code/13_cubic-interpolation_plot/"
---
{% raw %}
[3차 보간 곡선](/Hongs_Blog/studies/numerical-analysis/cubic-interpolation-curve/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 3차 보간 곡선 문서의 그림을 만든다: 13_cubic-interpolation_fig1.svg, 13_cubic-interpolation_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 13_cubic-interpolation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "13_cubic-interpolation"
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


MI = np.array([[1, 0, 0, 0], [-5.5, 9, -4.5, 1], [9, -22.5, 18, -4.5], [-4.5, 13.5, -13.5, 4.5]])
PTS = np.array([[0, 0], [1, 2], [2, 2], [3, 0]], dtype=float)


def curve(u, P=PTS):
    U = np.column_stack([np.ones_like(u), u, u ** 2, u ** 3])
    return U @ MI @ P


def blend(u):
    U = np.column_stack([np.ones_like(u), u, u ** 2, u ** 3])
    return U @ MI                                        # 열 i가 b_i(u)


u = np.linspace(0, 1, 300)
# 그림 1: 네 점을 지나는 3차 곡선이 점들 위로 솟는다
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.fill(PTS[:, 0], PTS[:, 1], color=INK, alpha=0.12, lw=0)
ax.plot(PTS[:, 0], PTS[:, 1], color=INK, lw=0.8, ls="--")
P = curve(u)
ax.plot(P[:, 0], P[:, 1], color=C[0], lw=2)
for i, (x, y) in enumerate(PTS):
    ax.plot(x, y, "o", color=C[0], ms=6)
    ax.annotate(f"$u = {['0', '1/3', '2/3', '1'][i]}$", (x, y), textcoords="offset points",
                xytext=(6, -14) if i in (0, 3) else (-16, -30), fontsize=9)
mid = curve(np.array([0.5]))[0]
ax.plot(*mid, "o", color=C[1], ms=6)
ax.annotate("(1.5, 2.25)", mid, textcoords="offset points", xytext=(-30, 8), fontsize=9, color=C[1])
ax.set_aspect("equal")
ax.set_ylim(-0.6, 2.8)
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

# 그림 2: 블렌딩 함수. 자기 점에서 1, 다른 점에서 0이고, 음수로 내려가는 구간이 있다
fig, ax = plt.subplots(figsize=(6, 3.4))
B = blend(u)
for i in range(4):
    ax.plot(u, B[:, i], color=C[i], lw=1.8, label=f"$b_{i}$")
ax.axhline(0, color=INK, lw=0.6)
for k in (1 / 3, 2 / 3):
    ax.axvline(k, color=INK, lw=0.5, ls=":")
ax.fill_between(u, B.min(axis=1), 0, where=B.min(axis=1) < 0, color=C[1], alpha=0.12, lw=0)
ax.plot(0.5, -1 / 16, "o", color=C[0], ms=5)
ax.annotate("$b_0(1/2) = -1/16$", (0.5, -1 / 16), textcoords="offset points", xytext=(-40, -22), fontsize=9)
ax.set_xticks([0, 1 / 3, 2 / 3, 1], ["0", "1/3", "2/3", "1"])
ax.set_xlabel("$u$")
ax.legend(loc="upper center", ncol=4, fontsize=10, bbox_to_anchor=(0.5, 1.15))
save(fig, 2)

if __name__ == "__main__":
    # 네 점 통과, p(1/2) = (1.5, 2.25), b_0(1/2) = −1/16, 블렌딩 함수의 합 1
    knots = np.array([0, 1 / 3, 2 / 3, 1])
    assert np.allclose(curve(knots), PTS)
    assert np.allclose(mid, [1.5, 2.25])
    assert abs(blend(np.array([0.5]))[0, 0] + 1 / 16) < 1e-12
    assert np.allclose(B.sum(axis=1), 1)
    assert np.allclose(MI, np.linalg.inv(np.column_stack([np.ones(4), knots, knots ** 2, knots ** 3])))
    print("ALL CHECKS PASSED")
```
{% endraw %}
