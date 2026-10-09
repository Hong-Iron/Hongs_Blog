---
layout: "note"
title: "18_bezier-subdivision_plot.py"
display_title: "18_bezier-subdivision_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/bezier-subdivision/"
parent_title: "베지어 곡선의 세분화"
description: "수치해석 · 베지어 곡선의 세분화 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/18_bezier-subdivision_plot/"
---
{% raw %}
[베지어 곡선의 세분화](/Hongs_Blog/studies/numerical-analysis/bezier-subdivision/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 베지어 곡선의 세분화 문서의 그림을 만든다: 18_bezier-subdivision_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_bezier-subdivision_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_bezier-subdivision"
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


P = np.array([[0, 0], [0, 4], [4, 4], [4, 0]], dtype=float)


def bezier(Q, u):
    u = u[:, None]
    return (1 - u) ** 3 * Q[0] + 3 * u * (1 - u) ** 2 * Q[1] + 3 * u ** 2 * (1 - u) * Q[2] + u ** 3 * Q[3]


def split(Q):
    m01, m12, m23 = (Q[0] + Q[1]) / 2, (Q[1] + Q[2]) / 2, (Q[2] + Q[3]) / 2
    l2, r1 = (m01 + m12) / 2, (m12 + m23) / 2
    mid = (l2 + r1) / 2
    return np.array([Q[0], m01, l2, mid]), np.array([mid, r1, m23, Q[3]]), (m01, m12, m23, l2, r1, mid)


L, R, (m01, m12, m23, l2, r1, mid) = split(P)
u = np.linspace(0, 1, 200)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(P[:, 0], P[:, 1], color=INK, lw=0.8, ls="--", marker="o", ms=5)
ax.plot([m01[0], m12[0], m23[0]], [m01[1], m12[1], m23[1]], color=INK, lw=0.6, ls=":", marker="o", ms=3)
ax.plot([l2[0], r1[0]], [l2[1], r1[1]], color=INK, lw=0.6, ls=":")
for Q, col, name in ((L, C[0], "왼쪽 반"), (R, C[1], "오른쪽 반")):
    Cv = bezier(Q, u)
    ax.plot(Cv[:, 0], Cv[:, 1], color=col, lw=2.4, label=name)
    ax.plot(Q[:, 0], Q[:, 1], color=col, lw=1, marker="s", ms=4)
ax.plot(*mid, "o", color=C[2], ms=7)
ax.annotate("(2, 3)", mid, textcoords="offset points", xytext=(-14, 8), fontsize=9, color=C[2])
for name, p, off in [("$p_0$", P[0], (6, 0)), ("$p_1$", P[1], (6, 2)), ("$p_2$", P[2], (-18, 2)), ("$p_3$", P[3], (-18, 0))]:
    ax.annotate(name, p, textcoords="offset points", xytext=off, fontsize=10)
ax.set_aspect("equal")
ax.set_xlim(-0.6, 6.5)
ax.set_ylim(-0.4, 4.6)
ax.legend(loc="center right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 표: 1단계 (0, 2), (2, 4), (4, 2), 2단계 (1, 3), (3, 3), 3단계 (2, 3) = p(1/2). 왼쪽 반은 p(u/2)
    assert [tuple(x) for x in (m01, m12, m23, l2, r1, mid)] == [(0, 2), (2, 4), (4, 2), (1, 3), (3, 3), (2, 3)]
    assert np.allclose(bezier(P, np.array([0.5]))[0], mid)
    assert np.allclose(bezier(L, u), bezier(P, u / 2)) and np.allclose(bezier(R, u), bezier(P, (1 + u) / 2))
    print("ALL CHECKS PASSED")
```
{% endraw %}
