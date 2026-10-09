---
layout: "note"
title: "16_triangle-laws_plot.py"
display_title: "16_triangle-laws_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "16"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/triangle-laws/"
parent_title: "사인 법칙과 코사인 법칙"
description: "대학수학 · 사인 법칙과 코사인 법칙 그림 생성 코드"
permalink: "/studies/college-math/code/16_triangle-laws_plot/"
---
{% raw %}
[사인 법칙과 코사인 법칙](/Hongs_Blog/studies/college-math/triangle-laws/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 사인 법칙과 코사인 법칙 문서의 그림을 만든다: 16_triangle-laws_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_triangle-laws_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_triangle-laws"
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

A_DEG, a, b = 30, 6, 8
A = math.radians(A_DEG)
Cx, Cy = b * math.cos(A), b * math.sin(A)
d = math.sqrt(a ** 2 - Cy ** 2)
B1, B2 = Cx - d, Cx + d


def angle_at(P, Q, R):
    v1 = (Q[0] - P[0], Q[1] - P[1])
    v2 = (R[0] - P[0], R[1] - P[1])
    return math.degrees(math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (math.hypot(*v1) * math.hypot(*v2))))


# 그림 1: a = 6, b = 8, A = 30°. C에서 반지름 6인 원이 밑변과 두 번 만나 삼각형이 둘 생긴다
fig, ax = plt.subplots(figsize=(6.5, 3))
t = np.linspace(0, 2 * np.pi, 400)
cx_, cy_ = Cx + a * np.cos(t), Cy + a * np.sin(t)
cy_ = np.where((cy_ > -0.7) & (cy_ < 4.6), cy_, np.nan)
ax.plot(cx_, cy_, color=INK, lw=0.8, ls=":")
ax.plot([0, 13], [0, 0], color=INK, lw=1)
ax.plot([0, Cx], [0, Cy], color=INK, lw=2)
ax.plot([Cx, B1], [Cy, 0], color=C[0], lw=2)
ax.plot([Cx, B2], [Cy, 0], color=C[1], lw=2)
for (x, y, s) in [(0, 0, "A"), (Cx, Cy, "C"), (B1, 0, "$B_1$"), (B2, 0, "$B_2$")]:
    ax.plot([x], [y], "o", color=INK, ms=4)
ax.text(-0.5, -0.6, "A", fontsize=10)
ax.text(Cx, Cy + 0.35, "C", fontsize=10, ha="center")
ax.text(B1, -0.75, f"$B_1$  (B = {angle_at((B1, 0), (0, 0), (Cx, Cy)):.2f}°)", fontsize=10, ha="left", color=C[0])
ax.text(B2, -0.75, f"$B_2$  (B = {angle_at((B2, 0), (0, 0), (Cx, Cy)):.2f}°)", fontsize=10, ha="center", color=C[1])
ax.text(1.0, 0.12, "30°", fontsize=10)
ax.text(Cx / 2 - 1.9, Cy / 2 + 0.3, "$b = 8$", fontsize=10)
ax.text(4.2, 0.6, "$a = 6$", fontsize=10, color=C[0])
ax.text((Cx + B2) / 2 + 0.3, Cy / 2, "$a = 6$", fontsize=10, color=C[1])
ax.set_aspect("equal")
ax.set_xlim(-1, 13.5)
ax.set_ylim(-1.1, 4.8)
ax.axis("off")
save(fig, 1)

if __name__ == "__main__":
    # B에서의 각 138.19°와 41.81°, 두 삼각형 모두 BC = 6
    assert round(angle_at((B1, 0), (0, 0), (Cx, Cy)), 2) == 138.19
    assert round(angle_at((B2, 0), (0, 0), (Cx, Cy)), 2) == 41.81
    assert all(abs(math.hypot(Cx - Bx, Cy) - a) < 1e-12 for Bx in (B1, B2))
    assert B1 > 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
