---
layout: "note"
title: "07_reflection_plot.py"
display_title: "07_reflection_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "07"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/reflection/"
parent_title: "반사와 반전"
description: "수치해석 · 반사와 반전 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/07_reflection_plot/"
---
{% raw %}
[반사와 반전](/Hongs_Blog/studies/numerical-analysis/reflection/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 반사와 반전 문서의 그림을 만든다: 07_reflection_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 07_reflection_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "07_reflection"
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


# 글자 F 모양. 아래 끝이 예시의 점 (2, 3)이다
F_SHAPE = np.array([[2, 3], [2, 4.5], [3, 4.5], [np.nan, np.nan], [2, 3.75], [2.7, 3.75]])


def reflect_y1(P):
    """직선 y = 1에 대한 반사: 아래로 1 → x축 반사 → 위로 1."""
    Q = P.copy()
    Q[:, 1] = -(P[:, 1] - 1) + 1
    return Q


R = reflect_y1(F_SHAPE)
fig, ax = plt.subplots(figsize=(5, 3.6))
ax.axhline(1, color=INK, lw=1.2, ls="--")
ax.text(5.9, 1.15, "y = 1", fontsize=10, ha="right")
ax.plot(F_SHAPE[:, 0], F_SHAPE[:, 1], color=C[0], lw=3, solid_capstyle="round")
ax.plot(R[:, 0], R[:, 1], color=C[1], lw=3, solid_capstyle="round")
ax.plot([2, 2], [3, -1], color=INK, lw=0.8, ls=":")
ax.plot([2, 2], [3, -1], "o", color=INK, ms=4)
ax.annotate("(2, 3)", (2, 3), textcoords="offset points", xytext=(-40, -4), fontsize=9)
ax.annotate("(2, -1)", (2, -1), textcoords="offset points", xytext=(-42, -4), fontsize=9)
ax.text(2.12, 2.0, "2", fontsize=10, ha="left", va="center")
ax.text(2.12, 0.0, "2", fontsize=10, ha="left", va="center")
ax.text(3.1, 4.5, "원래", color=C[0], fontsize=10, va="center")
ax.text(3.1, -2.5, "반사", color=C[1], fontsize=10, va="center")
ax.set_aspect("equal")
ax.set_xlim(0, 6)
ax.set_ylim(-3, 5)
ax.axis("off")
save(fig, 1)

if __name__ == "__main__":
    # 예시: (2, 3) → (2, −1), 직선에서 2씩 떨어짐. 반사 행렬의 행렬식은 −1
    assert tuple(R[0]) == (2.0, -1.0)
    assert abs(3 - 1) == abs(1 - (-1)) == 2
    assert np.linalg.det([[1, 0], [0, -1]]) == -1
    print("ALL CHECKS PASSED")
```
{% endraw %}
