---
layout: "note"
title: "14_hermite-curve_plot.py"
display_title: "14_hermite-curve_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "14"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/hermite-curve/"
parent_title: "에르미트 곡선"
description: "수치해석 · 에르미트 곡선 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/14_hermite-curve_plot/"
---
{% raw %}
[에르미트 곡선](/Hongs_Blog/studies/numerical-analysis/hermite-curve/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 에르미트 곡선 문서의 그림을 만든다: 14_hermite-curve_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 14_hermite-curve_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "14_hermite-curve"
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


MH = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [-3, 3, -2, -1], [2, -2, 1, 1]], dtype=float)


def hermite(p0, p1, t0, t1, u):
    U = np.column_stack([np.ones_like(u), u, u ** 2, u ** 3])
    return U @ MH @ np.array([p0, p1, t0, t1], dtype=float)


def tangent_arrow(ax, p, t, color):
    """접선 벡터를 1/3 길이로 줄여 그린다(베지어 조절점 자리)."""
    p, t = np.array(p, float), np.array(t, float) / 3
    ax.annotate("", p + t, p, arrowprops=dict(arrowstyle="-|>", color=color, lw=1.4))


u = np.linspace(0, 1, 200)
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
# 왼쪽: 두 조각이 이음점 (4, 0)에서 같은 접선 (0, −6)을 써서 매끄럽게 이어진다
ax = axes[0]
A = hermite((0, 0), (4, 0), (0, 6), (0, -6), u)
B = hermite((4, 0), (8, 0), (0, -6), (0, 6), u)
ax.plot(A[:, 0], A[:, 1], color=C[0], lw=2, label="조각 1")
ax.plot(B[:, 0], B[:, 1], color=C[1], lw=2, label="조각 2")
tangent_arrow(ax, (0, 0), (0, 6), C[0])
tangent_arrow(ax, (4, 0), (0, -6), INK)
tangent_arrow(ax, (8, 0), (0, 6), C[1])
ax.plot([0, 4, 8], [0, 0, 0], "o", color=INK, ms=4)
ax.text(4.2, -2.3, "이음점의 접선\n(0, -6)", fontsize=9)
ax.set_ylim(-3.2, 3.2)
ax.set_title("같은 접선으로 이으면 매끄럽다", fontsize=10)
ax.legend(loc="upper right", fontsize=9)
# 오른쪽: 방향은 같고 길이만 두 배인 접선
ax = axes[1]
for i, s in enumerate([6, 12]):
    P = hermite((0, 0), (4, 0), (0, s), (0, -s), u)
    top = hermite((0, 0), (4, 0), (0, s), (0, -s), np.array([0.5]))[0]
    ax.plot(P[:, 0], P[:, 1], color=C[i], lw=2)
    ax.plot(*top, "o", color=C[i], ms=5)
    ax.annotate(f"길이 {s}: ({top[0]:g}, {top[1]:g})", top, textcoords="offset points", xytext=(-36, -16), fontsize=9, color=C[i])
ax.plot([0, 4], [0, 0], "o", color=INK, ms=4)
ax.set_ylim(-0.4, 3.8)
ax.set_title("접선이 길수록 크게 부푼다", fontsize=10)
for ax in axes:
    ax.axhline(0, color=INK, lw=0.5)
    ax.set_xlabel("$x$")
save(fig, 1)

if __name__ == "__main__":
    # 예시: 가운데 (2, 1.5), 접선 두 배면 높이 3. 이음점에서 두 조각의 도함수가 같다
    mid = lambda s: hermite((0, 0), (4, 0), (0, s), (0, -s), np.array([0.5]))[0]
    assert np.allclose(mid(6), [2, 1.5]) and np.allclose(mid(12), [2, 3])
    h = 1e-6
    dA = (hermite((0, 0), (4, 0), (0, 6), (0, -6), np.array([1.0]))[0]
          - hermite((0, 0), (4, 0), (0, 6), (0, -6), np.array([1 - h]))[0]) / h
    dB = (hermite((4, 0), (8, 0), (0, -6), (0, 6), np.array([h]))[0]
          - hermite((4, 0), (8, 0), (0, -6), (0, 6), np.array([0.0]))[0]) / h
    assert np.allclose(dA, [0, -6], atol=1e-4) and np.allclose(dB, [0, -6], atol=1e-4)
    print("ALL CHECKS PASSED")
```
{% endraw %}
