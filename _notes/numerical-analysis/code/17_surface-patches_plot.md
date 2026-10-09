---
layout: "note"
title: "17_surface-patches_plot.py"
display_title: "17_surface-patches_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "17"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/surface-patches/"
parent_title: "매개변수 곡면 패치"
description: "수치해석 · 매개변수 곡면 패치 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/17_surface-patches_plot/"
---
{% raw %}
[매개변수 곡면 패치](/Hongs_Blog/studies/numerical-analysis/surface-patches/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 매개변수 곡면 패치 문서의 그림을 만든다: 17_surface-patches_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 17_surface-patches_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "17_surface-patches"
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


P00, P10, P01, P11 = (np.array(p, dtype=float) for p in [(0, 0, 0), (2, 0, 1), (0, 2, 1), (2, 2, 0)])


def bilinear(u, v):
    u, v = np.asarray(u, float)[..., None], np.asarray(v, float)[..., None]
    return (1 - u) * (1 - v) * P00 + u * (1 - v) * P10 + (1 - u) * v * P01 + u * v * P11


fig = plt.figure(figsize=(5, 3.8))
ax = fig.add_subplot(projection="3d")
ax.set_facecolor("none")
for axis in (ax.xaxis, ax.yaxis, ax.zaxis):
    axis.set_pane_color((1, 1, 1, 0))
    axis.line.set_color(INK)
U, V = np.meshgrid(np.linspace(0, 1, 21), np.linspace(0, 1, 21))
S = bilinear(U, V)
ax.plot_surface(S[..., 0], S[..., 1], S[..., 2], color=C[0], alpha=0.25, lw=0)
for k in np.linspace(0, 1, 6):                          # u 고정선, v 고정선
    L = bilinear(np.full(2, k), np.array([0, 1]))
    ax.plot(L[:, 0], L[:, 1], L[:, 2], color=C[0], lw=1)
    L = bilinear(np.array([0, 1]), np.full(2, k))
    ax.plot(L[:, 0], L[:, 1], L[:, 2], color=C[1], lw=1)
for name, p in [("$P_{00}$", P00), ("$P_{10}$", P10), ("$P_{01}$", P01), ("$P_{11}$", P11)]:
    ax.scatter(*p, color=INK, s=18)
    ax.text(*(p + (0, 0, 0.12)), name, fontsize=10)
mid = bilinear(0.5, 0.5)
ax.scatter(*mid, color=C[2], s=30)
ax.text(*(mid + (0.15, -0.5, -0.3)), "(1, 1, 1/2)", fontsize=9, color=C[2])
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
ax.set_zlabel("$z$")
ax.set_xticks([0, 1, 2])
ax.set_yticks([0, 1, 2])
ax.set_zticks([0, 0.5, 1])
ax.view_init(elev=24, azim=-58)
save(fig, 1)

if __name__ == "__main__":
    # 가운데 (1, 1, 1/2), 네 꼭짓점 통과, u를 고정한 선은 곧은 선(가운데 점이 양 끝의 평균)
    assert np.allclose(mid, [1, 1, 0.5])
    assert np.allclose(bilinear(1, 0), P10) and np.allclose(bilinear(0, 1), P01)
    for k in np.linspace(0, 1, 7):
        assert np.allclose(bilinear(k, 0.5), (bilinear(k, 0) + bilinear(k, 1)) / 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
