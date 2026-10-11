---
layout: "note"
title: "17_polar-parametric_plot.py"
display_title: "17_polar-parametric_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "17"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/polar-parametric/"
parent_title: "극좌표와 매개변수 곡선"
description: "대학수학 · 극좌표와 매개변수 곡선 그림 생성 코드"
permalink: "/studies/college-math/code/17_polar-parametric_plot/"
---
{% raw %}
[극좌표와 매개변수 곡선](/Hongs_Blog/studies/college-math/polar-parametric/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 극좌표와 매개변수 곡선 문서의 그림을 만든다: 17_polar-parametric_fig1.svg, 17_polar-parametric_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 17_polar-parametric_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "17_polar-parametric"
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

# 그림 1: 극좌표로 간단한 두 곡선. r = 2(원)와 r = θ(나선), 점은 θ가 π/2씩 늘 때의 위치
fig, ax = plt.subplots(figsize=(6, 3.6))
t = np.linspace(0, 2 * np.pi, 400)
ax.plot(2 * np.cos(t), 2 * np.sin(t), color=C[0], lw=2, label="$r = 2$")
s = np.linspace(0, 4 * np.pi, 800)
ax.plot(s * np.cos(s), s * np.sin(s), color=C[1], lw=2, label="$r = \\theta$")
k = np.arange(0, 9) * np.pi / 2
ax.plot(k * np.cos(k), k * np.sin(k), "o", color=C[1], ms=4)
ax.text(np.pi * np.cos(np.pi) - 0.2, 0.4, "$\\theta = \\pi$", fontsize=10, ha="right")
ax.text(2 * np.pi + 0.3, 0.4, "$\\theta = 2\\pi$", fontsize=10)
ax.axhline(0, color=INK, lw=0.5)
ax.axvline(0, color=INK, lw=0.5)
ax.set_aspect("equal")
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5))
save(fig, 1)

# 그림 2: v = 20 m/s, 45°로 던진 공의 궤적. 점은 0.25초 간격의 위치
V, ALPHA, G = 20.0, math.radians(45), 9.8
T = 2 * V * math.sin(ALPHA) / G
tt = np.linspace(0, T, 300)
fig, ax = plt.subplots(figsize=(6.5, 3))
ax.plot(V * tt * math.cos(ALPHA), V * tt * math.sin(ALPHA) - 0.5 * G * tt ** 2, color=C[0], lw=2)
td = np.arange(0, T, 0.25)
ax.plot(V * td * math.cos(ALPHA), V * td * math.sin(ALPHA) - 0.5 * G * td ** 2, "o", color=C[1], ms=4)
R = V ** 2 * math.sin(2 * ALPHA) / G
ax.plot([R], [0], "o", color=INK)
ax.text(R + 0.8, 0.4, f"{R:.1f} m", fontsize=10)
ax.set_xlim(-1, 47)
ax.text(1.5, 9.5, "점 사이 0.25초", fontsize=10, color=C[1])
ax.set_xlabel("$x$ (m)")
ax.set_ylabel("$y$ (m)")
ax.set_aspect("equal")
ax.set_ylim(0, 12)
save(fig, 2)

if __name__ == "__main__":
    # 나선의 θ = π 점은 (−π, 0), 사거리 40.82 m, 비행 시간 2.886초
    assert abs(math.pi * math.cos(math.pi) + math.pi) < 1e-12
    assert round(R, 2) == 40.82 and round(T, 3) == 2.886
    print("ALL CHECKS PASSED")
```
{% endraw %}
