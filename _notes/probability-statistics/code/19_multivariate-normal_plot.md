---
layout: "note"
title: "19_multivariate-normal_plot.py"
display_title: "19_multivariate-normal_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "19"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/multivariate-normal/"
parent_title: "공분산 행렬과 다변량 정규분포"
description: "확률과 통계 · 공분산 행렬과 다변량 정규분포 그림 생성 코드"
permalink: "/studies/probability-statistics/code/19_multivariate-normal_plot/"
---
{% raw %}
[공분산 행렬과 다변량 정규분포](/Hongs_Blog/studies/probability-statistics/multivariate-normal/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 공분산 행렬과 다변량 정규분포 문서의 그림을 만든다: 19_multivariate-normal_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_multivariate-normal_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_multivariate-normal"
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


MU = np.array([1.0, -2.0])
SIGMA = np.array([[4.0, 2.0], [2.0, 3.0]])
L = np.linalg.cholesky(SIGMA)                           # Σ = L Lᵀ
lam, V = np.linalg.eigh(SIGMA)                          # 고윳값 오름차순
rng = np.random.default_rng(19)
pts = MU + rng.standard_normal((800, 2)) @ L.T         # X = μ + L Z

# 그림 1: 표본 800개, 95% 타원(마할라노비스 거리² = 5.991), 고유벡터 방향의 두 축(타원의 반지름 √(cλ))
c = 5.991
th = np.linspace(0, 2 * math.pi, 400)
circle = np.stack([np.cos(th), np.sin(th)])
ell = MU[:, None] + V @ (np.sqrt(c * lam)[:, None] * circle)
fig, ax = plt.subplots(figsize=(6, 4.2))
ax.plot(pts[:, 0], pts[:, 1], "o", ms=1.6, color=C[0], alpha=0.3)
ax.plot(ell[0], ell[1], color=C[1], lw=1.8)
for k, col, name, off in [(1, C[2], "긴 축: 고윳값 5.56", (0.2, 0.2)), (0, C[3], "짧은 축: 고윳값 1.44", (-3.2, 0.5))]:
    v = V[:, k] * (1 if V[0, k] > 0 else -1) * math.sqrt(c * lam[k])
    ax.plot([MU[0] - v[0], MU[0] + v[0]], [MU[1] - v[1], MU[1] + v[1]], color=col, lw=2)
    end = MU + v if k == 1 else MU - v
    ax.text(end[0] + off[0], end[1] + off[1], name, color=col, fontsize=10)
ax.text(-4.6, -6.6, "95% 타원", color=C[1], fontsize=10)
ax.plot(*MU, "o", color=INK, ms=4)
ax.set_aspect("equal")
ax.set_xlabel("$x_1$")
ax.set_ylabel("$x_2$")
save(fig, 1)

if __name__ == "__main__":
    assert abs(lam[1] - (7 + math.sqrt(17)) / 2) < 1e-12 and abs(lam[0] - (7 - math.sqrt(17)) / 2) < 1e-12
    assert np.allclose(L, [[2, 0], [1, math.sqrt(2)]])
    d = pts - MU
    m2 = np.einsum("ij,jk,ik->i", d, np.linalg.inv(SIGMA), d)
    assert abs(np.mean(m2 <= c) - 0.95) < 0.015 and abs(1 - math.exp(-c / 2) - 0.95) < 1e-4
    print("ALL CHECKS PASSED")
```
{% endraw %}
