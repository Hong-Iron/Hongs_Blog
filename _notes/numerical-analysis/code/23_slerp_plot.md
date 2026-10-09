---
layout: "note"
title: "23_slerp_plot.py"
display_title: "23_slerp_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "23"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/slerp/"
parent_title: "구면 선형 보간"
description: "수치해석 · 구면 선형 보간 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/23_slerp_plot/"
---
{% raw %}
[구면 선형 보간](/Hongs_Blog/studies/numerical-analysis/slerp/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 구면 선형 보간 문서의 그림을 만든다: 23_slerp_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_slerp_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_slerp"
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


q1, q2 = np.array([1.0, 0.0]), np.array([0.0, 1.0])
TH = math.acos(q1 @ q2)


def lerp(t):
    return (1 - t)[:, None] * q1 + t[:, None] * q2


def nlerp(t):
    p = lerp(t)
    return p / np.linalg.norm(p, axis=1)[:, None]


def slerp(t):
    return (np.sin(TH * (1 - t))[:, None] * q1 + np.sin(TH * t)[:, None] * q2) / math.sin(TH)


def deg(P):
    return np.degrees(np.arctan2(P[:, 1], P[:, 0]))


fig, axes = plt.subplots(1, 2, figsize=(6.5, 3), gridspec_kw={"width_ratios": [1, 1.25]})
ax = axes[0]
a = np.linspace(0, math.pi / 2, 100)
ax.plot(np.cos(a), np.sin(a), color=INK, lw=0.8)
t = np.linspace(0, 1, 9)
for P, col, name, mk in ((lerp(t), C[2], "선형 보간", "^"), (nlerp(t), C[1], "정규화한 선형", "s"), (slerp(t), C[0], "구면 선형", "o")):
    ax.plot(P[:, 0], P[:, 1], mk, color=col, ms=4, label=name)
ax.set_aspect("equal")
ax.set_xlim(-0.05, 1.15)
ax.set_ylim(-0.05, 1.15)
ax.set_title("$t$ = 0, 1/8, …, 1의 점", fontsize=10)
ax.legend(loc="lower left", fontsize=8)
ax = axes[1]
tt = np.linspace(0, 1, 200)
ax.plot(tt, deg(slerp(tt)), color=C[0], lw=2, label="구면 선형: 90° × t")
ax.plot(tt, deg(nlerp(tt)), color=C[1], lw=2, ls="--", label="정규화한 선형")
ax.set_xlabel("$t$")
ax.set_ylabel("돈 각도 (°)")
ax.set_yticks([0, 30, 45, 60, 90])
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 선형 보간의 가운데 길이 0.71, 구면 선형 보간의 t = 1/3이 30° 방향 (√3/2, 1/2), 정규화한 선형은 각이 고르지 않음
    assert abs(np.linalg.norm(lerp(np.array([0.5]))[0]) - 1 / math.sqrt(2)) < 1e-12
    assert np.allclose(slerp(np.array([1 / 3]))[0], [math.sqrt(3) / 2, 0.5])
    assert np.allclose(deg(slerp(tt)), 90 * tt)
    assert abs(deg(nlerp(np.array([0.25])))[0] - 22.5) > 3
    print("ALL CHECKS PASSED")
```
{% endraw %}
