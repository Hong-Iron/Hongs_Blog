---
layout: "note"
title: "34_color-space_plot.py"
display_title: "34_color-space_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "34"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/color-space/"
parent_title: "색 공간"
description: "휴먼 인터페이스 미디어 · 색 공간 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/34_color-space_plot/"
---
{% raw %}
[색 공간](/Hongs_Blog/studies/human-interface-media/color-space/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 색 공간 문서의 그림을 만든다: 34_color-space_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 34_color-space_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Arc

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "34_color-space"
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


S, M, L = 1.0, 5.0, 8.0                 # 문서 예시의 노랑 (17.조건등색의 수치)
RG, BY = L - M, S - (M + L) / 2         # 3.0, -5.5
R = math.hypot(RG, BY)
H = math.degrees(math.atan2(BY, RG))    # -61.4도

# 그림 1: 반대색 평면 위의 한 색. 직교 좌표 (RG, BY)와 극좌표 (거리, 각도)는 같은 점을 가리킨다
fig, ax = plt.subplots(figsize=(5.4, 5.0))
for sp in ("left", "bottom"):
    ax.spines[sp].set_position("zero")
ax.set_xlim(-7, 7)
ax.set_ylim(-7, 7)
ax.set_aspect("equal")
ax.set_xticks([-6, -3, 6])
ax.set_yticks([-3, 3, 6])
ax.text(6.9, 0.4, "RG +\n빨강 쪽", ha="right", fontsize=10)
ax.text(-6.9, 0.4, "초록 쪽\nRG -", ha="left", fontsize=10)
ax.text(0.3, 6.6, "BY + 파랑 쪽", ha="left", fontsize=10)
ax.text(0.3, -6.9, "BY - 노랑 쪽", ha="left", fontsize=10)
# 직교 좌표로 가는 길: 오른쪽 3, 아래로 5.5
ax.plot([0, RG], [BY, BY], color=C[0], lw=1, ls="--")
ax.plot([RG, RG], [0, BY], color=C[0], lw=1, ls="--")
ax.text(RG, 0.3, "RG = 3", color=C[0], ha="center", fontsize=10)
ax.text(-0.25, BY, "BY = -5.5", color=C[0], ha="right", va="center", fontsize=10)
# 극좌표로 가는 길: 각도와 거리
ax.plot([0, RG], [0, BY], color=C[1], lw=2)
ax.add_patch(Arc((0, 0), 3.0, 3.0, theta1=H, theta2=0, color=C[1], lw=1.4))
ax.text(1.6, -0.85, f"{H:.1f}°", color=C[1], fontsize=10)
ax.text(0.6, -3.7, f"거리 {R:.2f}", color=C[1], fontsize=10, rotation=H, rotation_mode="anchor")
ax.plot([RG], [BY], "o", color=C[4], ms=9)
ax.text(RG + 0.3, BY - 0.9, "노랑\n(S 1, M 5, L 8)", color=C[4], fontsize=10)
ax.plot([0], [0], "o", color=INK, ms=6)
ax.text(-0.3, 0.45, "회색 축\n거리 0", ha="right", fontsize=10)
ax.text(-6.8, -2.6, "직교 좌표: (RG, BY)\n극좌표: (거리, 각도)", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert (RG, BY) == (3.0, -5.5)
    assert abs(R - 6.265) < 0.001 and abs(H + 61.39) < 0.01
    # 극좌표에서 직교 좌표로 되돌리면 같은 점
    assert abs(R * math.cos(math.radians(H)) - RG) < 1e-12 and abs(R * math.sin(math.radians(H)) - BY) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
