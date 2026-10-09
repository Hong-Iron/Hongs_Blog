---
layout: "note"
title: "21_binocular-disparity_plot.py"
display_title: "21_binocular-disparity_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "21"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/binocular-disparity/"
parent_title: "양안 시차"
description: "휴먼 인터페이스 미디어 · 양안 시차 코드 코드"
permalink: "/studies/human-interface-media/code/21_binocular-disparity_plot/"
---
{% raw %}
[양안 시차](/Hongs_Blog/studies/human-interface-media/binocular-disparity/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 양안 시차 문서의 그림을 만든다: 21_binocular-disparity_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_binocular-disparity_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_binocular-disparity"
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

B = 0.065   # 두 눈 사이 6.5 cm


def angle_deg(d):
    return np.degrees(2 * np.arctan(B / (2 * np.asarray(d, dtype=float))))


# 그림 1: 두 눈이 한 점을 볼 때 방향의 각도 차. 가까이서는 가파르고 멀리서는 거의 평평하다
d = np.linspace(0.2, 12, 600)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(d, angle_deg(d), color=C[0], lw=2)
for p, c in [(0.3, C[1]), (3, C[1]), (10, C[2]), (11, C[2])]:
    ax.plot(p, angle_deg(p), "o", color=c, ms=5)
ax.plot([0.3, 3], [angle_deg(0.3)] * 2, color=C[1], lw=0.8, ls=":")
ax.annotate("", xy=(3, angle_deg(3)), xytext=(3, angle_deg(0.3)),
            arrowprops=dict(arrowstyle="<->", color=C[1], lw=1))
ax.text(3.3, 6.5, "30 cm 대 3 m\n시차 약 11.1°", color=C[1], fontsize=10)
ax.text(10.5, 2.0, "10 m 대 11 m\n시차 약 0.034°", color=C[2], fontsize=10, ha="center")
ax.set_xlim(0, 12)
ax.set_ylim(0, 14.5)
ax.set_xlabel("거리 $d$ (m)")
ax.set_ylabel("두 눈 방향의 각도 차 (°)")
save(fig, 1)

if __name__ == "__main__":
    # 문서의 값: 11.1°와 0.034°
    assert abs(angle_deg(0.3) - angle_deg(3) - 11.12) < 0.01
    assert abs(angle_deg(10) - angle_deg(11) - 0.034) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
