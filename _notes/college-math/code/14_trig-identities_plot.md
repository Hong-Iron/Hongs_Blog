---
layout: "note"
title: "14_trig-identities_plot.py"
display_title: "14_trig-identities_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "14"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/trig-identities/"
parent_title: "삼각함수 항등식"
description: "대학수학 · 삼각함수 항등식 그림 생성 코드"
permalink: "/studies/college-math/code/14_trig-identities_plot/"
---
{% raw %}
[삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 삼각함수 항등식 문서의 그림을 만든다: 14_trig-identities_fig1.svg, 14_trig-identities_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 14_trig-identities_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "14_trig-identities"
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

# 그림 1: sin²ωt는 0과 1 사이를 두 배 빠르게 오가고, 한 주기 평균이 1/2이다
u = np.linspace(0, 2, 800)          # 가로축: sin ωt의 주기 단위
s = np.sin(2 * np.pi * u)
fig, ax = plt.subplots(figsize=(6, 3.2))
ax.plot(u, s, color=INK, lw=1.2, label="$\\sin\\omega t$")
ax.plot(u, s ** 2, color=C[0], lw=2, label="$\\sin^2\\omega t$")
ax.fill_between(u, s ** 2, 0.5, color=C[0], alpha=0.12)
ax.axhline(0.5, color=C[1], lw=1.4, ls="--", label="평균 1/2")
ax.axhline(0, color=INK, lw=0.5)
ax.set_xlabel("시간 (주기 단위)")
ax.set_xticks([0, 0.5, 1, 1.5, 2])
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=10)
save(fig, 1)

# 그림 2: 20 Hz와 22 Hz 사인파의 합(맥놀이). 겉모양 2cos(2π·1·t)이 1초에 두 번 부푼다
t = np.linspace(0, 2, 4000)
y = np.sin(2 * np.pi * 20 * t) + np.sin(2 * np.pi * 22 * t)
env = 2 * np.cos(2 * np.pi * 1 * t)
fig, ax = plt.subplots(figsize=(6.5, 3))
ax.plot(t, y, color=C[0], lw=1)
ax.plot(t, np.abs(env), color=C[1], lw=1.6, ls="--", label="$\\pm 2\\cos(2\\pi \\cdot 1 \\cdot t)$")
ax.plot(t, -np.abs(env), color=C[1], lw=1.6, ls="--")
ax.set_xlabel("시간 (초)")
ax.set_ylim(-2.3, 2.9)
ax.legend(loc="upper right", fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # sin² 평균 0.5, 합 → 곱 공식으로 맥놀이의 겉모양
    uu = np.linspace(0, 1, 100001)[:-1]
    assert abs(np.mean(np.sin(2 * np.pi * uu) ** 2) - 0.5) < 1e-12
    assert np.allclose(y, 2 * np.sin(2 * np.pi * 21 * t) * np.cos(2 * np.pi * 1 * t))
    print("ALL CHECKS PASSED")
```
{% endraw %}
