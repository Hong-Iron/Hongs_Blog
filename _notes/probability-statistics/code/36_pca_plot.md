---
layout: "note"
title: "36_pca_plot.py"
display_title: "36_pca_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "36"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/pca/"
parent_title: "주성분 분석"
description: "확률과 통계 · 주성분 분석 코드 코드"
permalink: "/studies/probability-statistics/code/36_pca_plot/"
---
{% raw %}
[주성분 분석](/Hongs_Blog/studies/probability-statistics/pca/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주성분 분석 문서의 그림을 만든다: 36_pca_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 36_pca_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "36_pca"
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


SIGMA = np.array([[4.0, 2.0], [2.0, 3.0]])
lam, V = np.linalg.eigh(SIGMA)
v1 = V[:, 1] * np.sign(V[0, 1])                         # 첫 주성분 방향 (x 성분을 양수로)
rng = np.random.default_rng(36)
pts = rng.standard_normal((300, 2)) @ np.linalg.cholesky(SIGMA).T


def var_along(theta):
    u = np.array([math.cos(theta), math.sin(theta)])
    return float(u @ SIGMA @ u)


# 그림 1: 왼쪽 점과 첫 주성분 직선, 몇 점의 투영. 오른쪽 방향(각도)마다 투영한 값의 분산
th1 = math.atan2(v1[1], v1[0])
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.1))
a1.plot(pts[:, 0], pts[:, 1], "o", ms=1.8, color=C[0], alpha=0.4)
s = np.linspace(-7, 7, 2)
a1.plot(s * v1[0], s * v1[1], color=C[1], lw=1.8)
for q in pts[:25]:
    proj = (q @ v1) * v1
    a1.plot([q[0], proj[0]], [q[1], proj[1]], color=INK, lw=0.6)
a1.set_aspect("equal")
a1.set_xlim(-7, 7)
a1.set_ylim(-6, 6)
a1.set_title("첫 주성분 방향으로 투영", fontsize=10)
deg = np.linspace(0, 180, 361)
vals = [var_along(math.radians(d)) for d in deg]
a2.plot(deg, vals, color=C[1], lw=2)
d1 = math.degrees(th1) % 180
a2.plot(d1, lam[1], "o", color=C[1], ms=5)
a2.plot((d1 + 90) % 180, lam[0], "o", color=C[3], ms=5)
a2.text(d1 + 5, lam[1] + 0.1, f"최대 {lam[1]:.2f}", fontsize=9)
a2.text((d1 + 90) % 180 + 5, lam[0] - 0.4, f"최소 {lam[0]:.2f}", fontsize=9)
a2.set_xticks([0, 45, 90, 135, 180])
a2.set_xlabel("방향 각도(°)")
a2.set_title("그 방향의 분산 $\\mathbf{v}^\\top\\Sigma\\mathbf{v}$", fontsize=10)
a2.set_ylim(0.8, 6.3)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs(lam[1] - 5.56) < 0.005 and abs(lam[0] - 1.44) < 0.005
    assert abs(max(vals) - lam[1]) < 1e-3 and abs(min(vals) - lam[0]) < 1e-3
    assert round(lam[1] / lam.sum(), 3) == 0.795
    print("ALL CHECKS PASSED")
```
{% endraw %}
