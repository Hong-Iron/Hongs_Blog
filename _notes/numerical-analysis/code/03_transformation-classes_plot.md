---
layout: "note"
title: "03_transformation-classes_plot.py"
display_title: "03_transformation-classes_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "03"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/transformation-classes/"
parent_title: "기하 변환의 종류"
description: "수치해석 · 기하 변환의 종류 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/03_transformation-classes_plot/"
---
{% raw %}
[기하 변환의 종류](/Hongs_Blog/studies/numerical-analysis/transformation-classes/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 기하 변환의 종류 문서의 그림을 만든다: 03_transformation-classes_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 03_transformation-classes_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "03_transformation-classes"
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


SQ = np.array([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]], dtype=float)   # 한 변 1인 정사각형


def affine(M, t, P):
    return P @ np.array(M, dtype=float).T + np.array(t, dtype=float)


th = math.radians(30)
ROT = [[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]]
K = 1.5
cases = [
    ("회전·평행이동", affine(ROT, (0.6, 0.1), SQ), "길이·각 그대로"),
    ("고르게 2배", affine([[2, 0], [0, 2]], (0, 0), SQ), "각만 그대로"),
    (f"전단 (k = {K})", affine([[1, K], [0, 1]], (0, 0), SQ), "평행·넓이 그대로"),
]


def angle_at_origin(P):
    a, b = P[1] - P[0], P[3] - P[0]
    return math.degrees(math.acos(a @ b / np.linalg.norm(a) / np.linalg.norm(b)))


# 원근: 바닥에 놓인 x = ±1, 깊이 z = 1..3의 사각형을 눈(원점, 높이 1)에서 화면 z = 1로 옮긴다
FLOOR = np.array([[-1, 1], [1, 1], [1, 3], [-1, 3], [-1, 1]], dtype=float)   # (x, z)
PERS = np.column_stack([FLOOR[:, 0] / FLOOR[:, 1], -1 / FLOOR[:, 1]])

fig, axes = plt.subplots(1, 4, figsize=(6.6, 2.2))
for ax, (title, P, keep) in zip(axes, cases):
    ax.plot(SQ[:, 0], SQ[:, 1], color=INK, lw=1, ls="--")
    ax.plot(P[:, 0], P[:, 1], color=C[0], lw=2)
    ax.set_title(title, fontsize=10)
    ax.text(0.5, -0.08, keep, transform=ax.transAxes, ha="center", va="top", fontsize=9)
ax = axes[2]
P = cases[2][1]
ax.text(0.62, 0.1, f"{angle_at_origin(P):.0f}°", fontsize=9, color=C[1])
ax = axes[3]
ax.plot(PERS[:, 0], PERS[:, 1], color=C[0], lw=2)
ax.set_title("원근", fontsize=10)
ax.text(0, -1.08, "폭 2", ha="center", va="top", fontsize=9, color=C[1])
ax.text(0, -0.30, "폭 2/3", ha="center", va="bottom", fontsize=9, color=C[1])
ax.text(0.5, -0.08, "곧은 선만 그대로", transform=ax.transAxes, ha="center", va="top", fontsize=9)
for ax in axes:
    ax.set_aspect("equal")
    ax.axis("off")
for ax in axes[:3]:
    ax.set_xlim(-0.4, 2.6)
    ax.set_ylim(-0.2, 2.2)
axes[3].set_xlim(-1.5, 1.5)
axes[3].set_ylim(-1.6, 0.8)
fig.subplots_adjust(wspace=0.25)
save(fig, 1)

if __name__ == "__main__":
    # 강체 변환은 변 길이 1을, 닮음은 직각을 지킨다. 전단 k = 1.5에서 직각이 약 34°가 된다. 원근 폭 2와 2/3
    R = cases[0][1]
    assert all(abs(np.linalg.norm(R[i + 1] - R[i]) - 1) < 1e-12 for i in range(4))
    assert abs(angle_at_origin(cases[1][1]) - 90) < 1e-9
    assert abs(angle_at_origin(cases[2][1]) - 33.69) < 0.01
    assert abs(np.linalg.det([[1, K], [0, 1]]) - 1) < 1e-12
    assert abs((PERS[1, 0] - PERS[0, 0]) - 2) < 1e-12 and abs((PERS[2, 0] - PERS[3, 0]) - 2 / 3) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
