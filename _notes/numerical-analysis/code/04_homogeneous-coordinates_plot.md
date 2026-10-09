---
layout: "note"
title: "04_homogeneous-coordinates_plot.py"
display_title: "04_homogeneous-coordinates_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "04"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/homogeneous-coordinates/"
parent_title: "동차 좌표"
description: "수치해석 · 동차 좌표 코드 코드"
permalink: "/studies/numerical-analysis/code/04_homogeneous-coordinates_plot/"
---
{% raw %}
[동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 동차 좌표 문서의 그림을 만든다: 04_homogeneous-coordinates_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 04_homogeneous-coordinates_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "04_homogeneous-coordinates"
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


def T(a, b):
    return np.array([[1, 0, a], [0, 1, b], [0, 0, 1]], dtype=float)


R90 = np.array([[0, -1, 0], [1, 0, 0], [0, 0, 1]], dtype=float)
P = (1, 1)
X = np.array([2, 1, 1], dtype=float)
# 점 X를 꼭짓점으로 하는 작은 깃발 모양. 돌아간 방향이 보이게 한다
FLAG = np.array([[2, 1, 1], [2.6, 1, 1], [2.6, 1.3, 1], [2.3, 1.3, 1], [2.3, 1.15, 1], [2, 1.15, 1], [2, 1, 1]]).T
H = T(*P) @ R90 @ T(-P[0], -P[1])
stages = [
    ("처음", np.eye(3)),
    ("1. P를 원점으로", T(-P[0], -P[1])),
    ("2. 원점 중심 90°", R90 @ T(-P[0], -P[1])),
    ("3. 원점을 다시 P로", H),
]

fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (label, M) in enumerate(stages):
    S = M @ FLAG
    x = M @ X
    ax.fill(S[0], S[1], color=C[i], alpha=0.25, lw=0)
    ax.plot(S[0], S[1], color=C[i], lw=1.5, label=label)
    ax.plot(x[0], x[1], "o", color=C[i], ms=5)
    ax.annotate(f"({x[0]:.0f}, {x[1]:.0f})", (x[0], x[1]), textcoords="offset points",
                xytext=(-8, -12) if i != 3 else (-34, 2), fontsize=9, color=C[i])
ax.plot(*P, "s", color=INK, ms=5)
ax.annotate("P", P, textcoords="offset points", xytext=(-12, 4), fontsize=10)
ax.plot(0, 0, "+", color=INK, ms=10)
ax.annotate("원점", (0, 0), textcoords="offset points", xytext=(-24, -12), fontsize=9)
ax.axhline(0, color=INK, lw=0.5)
ax.axvline(0, color=INK, lw=0.5)
ax.set_aspect("equal")
ax.set_xlim(-1.6, 3.2)
ax.set_ylim(-0.6, 2.9)
ax.legend(loc="upper left", fontsize=9, bbox_to_anchor=(1.0, 1.0))
save(fig, 1)

if __name__ == "__main__":
    # 표의 값: (2, 1) → (1, 0) → (0, 1) → (1, 2), 그리고 H 하나가 세 단계와 같다
    got = [tuple((M @ X)[:2]) for _, M in stages]
    assert got == [(2, 1), (1, 0), (0, 1), (1, 2)]
    assert np.allclose(H, [[0, -1, 2], [1, 0, 0], [0, 0, 1]])
    print("ALL CHECKS PASSED")
```
{% endraw %}
