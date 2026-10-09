---
layout: "note"
title: "21_binocular-disparity_plot.py"
display_title: "21_binocular-disparity_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "21"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/binocular-disparity/"
parent_title: "양안 시차"
description: "휴먼 인터페이스 미디어 · 양안 시차 그림 생성 코드"
permalink: "/studies/human-interface-media/code/21_binocular-disparity_plot/"
---
{% raw %}
[양안 시차](/Hongs_Blog/studies/human-interface-media/binocular-disparity/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 양안 시차 문서의 그림을 만든다: 21_binocular-disparity_fig1.svg, fig2.svg
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

# 그림 2: 위에서 내려다본 두 눈과 두 점. 가까운 점일수록 두 시선이 이루는 각이 크다 (비율은 실제와 다름)
from matplotlib.patches import Arc

SB = 1.0                     # 그림 속 두 눈 사이 거리 (설명용 단위)
D1, D2 = 2.0, 6.0            # 가까운 점, 먼 점까지의 거리


def view_angle_deg(base, dist):
    return math.degrees(2 * math.atan(base / (2 * dist)))


def angle_between_deg(p, a, b):
    v1 = np.array(a) - np.array(p)
    v2 = np.array(b) - np.array(p)
    return math.degrees(math.acos(v1 @ v2 / (np.linalg.norm(v1) * np.linalg.norm(v2))))


EL, ER = (-SB / 2, 0.0), (SB / 2, 0.0)
P1, P2 = (0.0, D1), (0.0, D2)
fig, ax = plt.subplots(figsize=(4.6, 5.6))
for p, c in [(P1, C[1]), (P2, C[0])]:
    for e in (EL, ER):
        ax.plot([e[0], p[0]], [e[1], p[1]], color=c, lw=1.4)
    ax.plot(*p, "o", color=c, ms=6)
for e, name in [(EL, "왼눈"), (ER, "오른눈")]:
    ax.plot(*e, "o", color=INK, ms=9, mfc="none", mew=1.5)
    ax.text(e[0], -0.45, name, ha="center", va="top")
ax.annotate("", xy=(ER[0], -0.18), xytext=(EL[0], -0.18), arrowprops=dict(arrowstyle="<->", color=INK, lw=0.9))
ax.text(0, -0.95, "두 눈 사이 거리 $B$", ha="center", va="top", fontsize=10)
th1, th2 = view_angle_deg(SB, D1), view_angle_deg(SB, D2)
for p, th, r, c in [(P1, th1, 0.55, C[1]), (P2, th2, 1.4, C[0])]:
    ax.add_patch(Arc(p, 2 * r, 2 * r, theta1=270 - th / 2, theta2=270 + th / 2, color=c, lw=1.2))
ax.text(0.55, D1 + 0.05, f"가까운 점\n각 {th1:.1f}°", color=C[1], fontsize=10, va="center")
ax.text(0.55, D2 + 0.05, f"먼 점\n각 {th2:.1f}°", color=C[0], fontsize=10, va="center")
ax.text(-2.6, (D1 + D2) / 2, f"시차 = 두 각의 차\n= {th1 - th2:.1f}°", fontsize=10, va="center")
ax.set_xlim(-2.7, 1.9)
ax.set_ylim(-1.3, D2 + 0.6)
ax.set_aspect("equal")
ax.axis("off")
save(fig, 2)

if __name__ == "__main__":
    # 문서의 값: 11.1°와 0.034°
    assert abs(angle_deg(0.3) - angle_deg(3) - 11.12) < 0.01
    assert abs(angle_deg(10) - angle_deg(11) - 0.034) < 0.001
    # 그림 2의 각: 두 시선 사이의 각이 2·arctan(B/2d)와 같고, 가까운 점의 각이 더 크다
    for dist, p in [(D1, P1), (D2, P2)]:
        assert abs(angle_between_deg(p, EL, ER) - view_angle_deg(SB, dist)) < 1e-9
    assert abs(view_angle_deg(SB, D1) - 28.07) < 0.01 and abs(view_angle_deg(SB, D2) - 9.53) < 0.01
    assert view_angle_deg(SB, D1) > view_angle_deg(SB, D2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
