---
layout: "note"
title: "11_radian_plot.py"
display_title: "11_radian_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "11"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/radian/"
parent_title: "각과 라디안"
description: "대학수학 · 각과 라디안 코드 코드"
permalink: "/studies/college-math/code/11_radian_plot/"
---
{% raw %}
[각과 라디안](/Hongs_Blog/studies/college-math/radian/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 각과 라디안 문서의 그림을 만든다: 11_radian_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_radian_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_radian"
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

# 그림 1: 반지름 2인 원에서 길이 2인 호가 만드는 각이 1라디안(약 57.3°)
R = 2.0
TH = 1.0
fig, ax = plt.subplots(figsize=(6, 3.6))
t = np.linspace(0, 2 * np.pi, 400)
ax.plot(R * np.cos(t), R * np.sin(t), color=INK, lw=1)
ta = np.linspace(0, TH, 100)
ax.plot(R * np.cos(ta), R * np.sin(ta), color=C[1], lw=4)
ax.plot([0, R], [0, 0], color=C[0], lw=2)
ax.plot([0, R * math.cos(TH)], [0, R * math.sin(TH)], color=C[0], lw=2)
tw = np.linspace(0, TH, 50)
ax.plot(0.45 * np.cos(tw), 0.45 * np.sin(tw), color=INK, lw=1)
ax.text(0.55, 0.28, "1 rad ≈ 57.3°", fontsize=10)
ax.text(1.0, -0.3, "반지름 2", fontsize=10, color=C[0], ha="center")
ax.text(2.15, 1.05, "호의 길이 2", fontsize=10, color=C[1])
ax.plot([0], [0], "o", color=INK, ms=4)
ax.set_aspect("equal")
ax.set_xlim(-2.3, 3.6)
ax.set_ylim(-2.3, 2.3)
ax.axis("off")
save(fig, 1)

if __name__ == "__main__":
    # 호 길이 = 반지름 × 각, 1 rad = 57.2958°, 한 바퀴 2π
    n = 100000
    pts = [(R * math.cos(TH * k / n), R * math.sin(TH * k / n)) for k in range(n + 1)]
    arc = sum(math.dist(pts[k], pts[k + 1]) for k in range(n))
    assert abs(arc - R * TH) < 1e-6
    assert round(math.degrees(1), 4) == 57.2958
    print("ALL CHECKS PASSED")
```
{% endraw %}
