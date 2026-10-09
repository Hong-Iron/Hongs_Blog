---
layout: "note"
title: "25_multiple-integrals_plot.py"
display_title: "25_multiple-integrals_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "25"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/multiple-integrals/"
parent_title: "중적분과 변수변환"
description: "미분적분학 · 중적분과 변수변환 코드 코드"
permalink: "/studies/calculus/code/25_multiple-integrals_plot/"
---
{% raw %}
[중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 중적분과 변수변환 문서의 그림을 만든다: 25_multiple-integrals_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_multiple-integrals_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_multiple-integrals"
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


DR, DT = 0.25, math.pi / 8


def cell(r0, t0, n=40):
    # r0 ≤ r ≤ r0 + dr, t0 ≤ θ ≤ t0 + dθ 칸의 테두리
    t = np.linspace(t0, t0 + DT, n)
    r = np.concatenate([np.full(n, r0), np.full(n, r0 + DR)])
    tt = np.concatenate([t, t[::-1]])
    return r * np.cos(tt), r * np.sin(tt)


def cell_area(r0):
    return ((r0 + DR) ** 2 - r0 ** 2) / 2 * DT


# 그림 1: 원판을 dr = 0.25, dθ = π/8로 나눈 극좌표 칸. 같은 dr × dθ라도 바깥 칸이 더 넓다
fig, ax = plt.subplots(figsize=(4.4, 4.0))
for r in np.arange(DR, 1.0001, DR):
    th = np.linspace(0, 2 * np.pi, 300)
    ax.plot(r * np.cos(th), r * np.sin(th), color=INK, lw=0.7)
for k in range(16):
    t = k * DT
    ax.plot([0, math.cos(t)], [0, math.sin(t)], color=INK, lw=0.7)
for r0, col, ty in [(0.0, C[0], -0.45), (0.75, C[1], 0.95)]:
    x, y = cell(r0, DT)
    ax.fill(x, y, color=col, alpha=0.5)
    mid = np.array([math.cos(1.5 * DT), math.sin(1.5 * DT)]) * (r0 + DR / 2)
    ax.annotate(f"$r$: {r0:g}~{r0 + DR:g}\n넓이 {cell_area(r0):.3f}", xy=mid, xytext=(1.12, ty), color=col,
                fontsize=9, va="center", arrowprops=dict(arrowstyle="->", color=col, lw=0.8))
ax.set_aspect("equal")
ax.set_xlim(-1.1, 1.75)
ax.set_ylim(-1.1, 1.1)
ax.axis("off")
save(fig, 1)

if __name__ == "__main__":
    # 칸 넓이: 안쪽 (0.25^2/2)(π/8) ≈ 0.012, 바깥쪽 ((1 - 0.75^2)/2)(π/8) ≈ 0.086, 모든 칸의 합 = π
    a_in, a_out = cell_area(0.0), cell_area(0.75)
    assert abs(a_in - 0.0123) < 1e-4 and abs(a_out - 0.0859) < 1e-4
    assert abs(a_out / a_in - 7) < 1e-12              # 가운데 반지름 0.875 대 0.125
    total = sum(cell_area(r0) for r0 in np.arange(0, 1, DR)) * 16
    assert abs(total - math.pi) < 1e-12
    # 배율 r: r·dr·dθ (가운데 반지름에서)가 칸 넓이와 정확히 같다
    assert abs((0.75 + DR / 2) * DR * DT - a_out) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
