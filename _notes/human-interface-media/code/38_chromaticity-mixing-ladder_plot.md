---
layout: "note"
title: "38_chromaticity-mixing-ladder_plot.py"
display_title: "38_chromaticity-mixing-ladder_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-mixing-ladder/"
parent_title: "색도도 혼합 예제 사다리"
description: "휴먼 인터페이스 미디어 · 색도도 혼합 예제 사다리 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-mixing-ladder_plot/"
---
{% raw %}
[색도도 혼합 예제 사다리](/Hongs_Blog/studies/human-interface-media/chromaticity-mixing-ladder/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 색도도 혼합 예제 사다리의 그림을 만든다: 38_chromaticity-mixing-ladder_fig1.svg, _fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 38_chromaticity-mixing-ladder_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "38_chromaticity-mixing-ladder"
INK = "#888888"
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


def bary(P, W):
    (x1, y1), (x2, y2), (x3, y3) = P
    x, y = W
    det = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    a = ((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3)) / det
    b = ((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3)) / det
    return a, b, 1 - a - b


# 그림 1: 문제 1. 선분 PQ 위의 T가 PQ를 1 : 3으로 나눈다(무게 3 : 1의 거꾸로)
P, Q, T = np.array([0.6, 0.3]), np.array([0.2, 0.7]), np.array([0.5, 0.4])
fig, ax = plt.subplots(figsize=(5.6, 4.4))
xs = np.linspace(0.1, 0.75, 2)
ax.plot(xs, 0.9 - xs, color=INK, lw=0.9, ls=":")
ax.text(0.66, 0.17, "$x + y = 0.9$", fontsize=10)
ax.plot([P[0], Q[0]], [P[1], Q[1]], color=C[0], lw=2.2)
for pt, name, off in [(P, "P (0.6, 0.3)\n무게 3", (8, -6)), (Q, "Q (0.2, 0.7)\n무게 1", (8, 0))]:
    ax.plot(*pt, "o", color=C[0], ms=7)
    ax.annotate(name, pt, xytext=off, textcoords="offset points", fontsize=10.5, color=C[0], va="center")
ax.plot(*T, "s", color=C[1], ms=7)
ax.annotate("T (0.5, 0.4)", T, xytext=(10, 6), textcoords="offset points", fontsize=10.5, color=C[1])
mid1, mid2 = (P + T) / 2, (T + Q) / 2
ax.annotate("거리 1", mid1, xytext=(-40, -20), textcoords="offset points", fontsize=10)
ax.annotate("거리 3", mid2, xytext=(-40, -20), textcoords="offset points", fontsize=10)
ax.set_xlim(0.1, 0.8)
ax.set_ylim(0.15, 0.8)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

# 그림 2: 문제 4. 목표 T가 삼각형 ABC 밖, 직선 BC 너머에 있다
A, B, Cc, T4 = (0.2, 0.2), (0.6, 0.3), (0.1, 0.4), (0.3, 0.6)
lam4 = bary([A, B, Cc], T4)
fig, ax = plt.subplots(figsize=(5.6, 4.6))
tri = np.array([A, B, Cc, A])
ax.fill(tri[:-1, 0], tri[:-1, 1], color=C[0], alpha=0.10)
ax.plot(tri[:, 0], tri[:, 1], color=C[0], lw=1.6)
xs = np.linspace(0.02, 0.72, 2)
ax.plot(xs, (2.1 - xs) / 5, color=INK, lw=0.9, ls="--")
ax.text(0.53, 0.345, "직선 BC: $x + 5y = 2.1$", fontsize=10)
for pt, name, off in [(A, "A (0.2, 0.2)", (6, -14)), (B, "B (0.6, 0.3)", (2, -20)), (Cc, "C (0.1, 0.4)", (-8, 8))]:
    ax.plot(*pt, "o", color=C[0], ms=7)
    ax.annotate(name, pt, xytext=off, textcoords="offset points", fontsize=10.5, color=C[0],
                ha="right" if off[0] < 0 else "left")
ax.plot(*T4, "s", color=C[1], ms=7)
ax.annotate("T (0.3, 0.6)", T4, xytext=(8, 4), textcoords="offset points", fontsize=10.5, color=C[1])
ax.text(0.40, 0.283, "만들 수 있는 색", fontsize=9.5, color=C[0], ha="center")
ax.annotate("", xy=T4, xytext=A, arrowprops=dict(arrowstyle="->", color=INK, lw=0.8, ls=":"))
ax.set_xlim(0.0, 0.8)
ax.set_ylim(0.1, 0.7)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 2)

if __name__ == "__main__":
    lam = (Q[0] - T[0]) / (Q[0] - P[0])
    assert abs(lam - 0.75) < 1e-12
    assert abs(np.linalg.norm(T - P) / np.linalg.norm(Q - T) - 1 / 3) < 1e-12
    assert all(abs(u - v) < 1e-12 for u, v in zip(lam4, (-4 / 3, 2 / 3, 5 / 3)))
    assert abs(B[0] + 5 * B[1] - 2.1) < 1e-12 and abs(Cc[0] + 5 * Cc[1] - 2.1) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
