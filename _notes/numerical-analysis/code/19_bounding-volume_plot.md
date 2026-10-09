---
layout: "note"
title: "19_bounding-volume_plot.py"
display_title: "19_bounding-volume_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "19"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/bounding-volume/"
parent_title: "경계 볼륨"
description: "수치해석 · 경계 볼륨 코드 코드"
permalink: "/studies/numerical-analysis/code/19_bounding-volume_plot/"
---
{% raw %}
[경계 볼륨](/Hongs_Blog/studies/numerical-analysis/bounding-volume/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 경계 볼륨 문서의 그림을 만든다: 19_bounding-volume_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_bounding-volume_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_bounding-volume"
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


import random

# 검증 코드와 같은 점 구름: 35° 기울어진 길이 10, 폭 1, 높이 1, 점 400개 (random.seed(19))
random.seed(19)
TH = math.radians(35)
cloud = []
for _ in range(400):
    a, b, c = random.uniform(-5, 5), random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5)
    cloud.append((a * math.cos(TH) - b * math.sin(TH), a * math.sin(TH) + b * math.cos(TH), c))
X = np.array(cloud)


def box(P, axes):
    S = P @ axes.T
    lo, hi = S.min(axis=0), S.max(axis=0)
    return lo, hi, float(np.prod(hi - lo))


m = X.mean(axis=0)
Cov = (X - m).T @ (X - m) / len(X)
w, V = np.linalg.eigh(Cov)
AX = V[:, ::-1].T                                       # 행이 고유벡터, 고윳값이 큰 순서
lo_o, hi_o, vol_obb = box(X, AX)
lo_a, hi_a, vol_aabb = box(X, np.eye(3))

fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(X[:, 0], X[:, 1], ".", color=INK, ms=3)
ax.add_patch(plt.Rectangle(lo_a[:2], *(hi_a - lo_a)[:2], fill=False, ec=C[1], lw=1.8))
# 방향 상자를 위에서 내려다본 모습: 첫째·둘째 주성분 축의 네 모서리
e1, e2 = AX[0], AX[1]
corners = [lo_o[0] * e1 + lo_o[1] * e2, hi_o[0] * e1 + lo_o[1] * e2, hi_o[0] * e1 + hi_o[1] * e2,
           lo_o[0] * e1 + hi_o[1] * e2, lo_o[0] * e1 + lo_o[1] * e2]
Q = np.array(corners)
ax.plot(Q[:, 0], Q[:, 1], color=C[0], lw=1.8)
ax.text(hi_a[0], hi_a[1] + 0.15, f"축에 나란한 상자: 부피 {vol_aabb:.2f}", color=C[1], ha="right", va="bottom", fontsize=9)
ax.text(0.6, -2.2, f"주성분 상자: 부피 {vol_obb:.2f}", color=C[0], fontsize=9)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

if __name__ == "__main__":
    # 문서의 값: 축에 나란한 상자 52.48, 주성분 상자 13.72, 첫 주성분이 35° 방향
    assert abs(vol_aabb - 52.48) < 0.005 and abs(vol_obb - 13.72) < 0.005
    assert abs(abs(AX[0][0]) - math.cos(TH)) < 0.02 and abs(abs(AX[0][1]) - math.sin(TH)) < 0.02
    print("ALL CHECKS PASSED")
```
{% endraw %}
