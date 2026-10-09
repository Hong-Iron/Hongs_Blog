---
layout: "note"
title: "01_first-order-linear-ode_plot.py"
display_title: "01_first-order-linear-ode_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "01"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/first-order-linear-ode/"
parent_title: "1계 선형 미분방정식"
description: "신호 및 시스템 · 1계 선형 미분방정식 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/01_first-order-linear-ode_plot/"
---
{% raw %}
[1계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/first-order-linear-ode/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 1계 선형 미분방정식 문서의 그림을 만든다: 01_first-order-linear-ode_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 01_first-order-linear-ode_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "01_first-order-linear-ode"
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


def stem(ax, n, x, color, label=None, ms=5):
    # 이산 시간 신호는 막대 끝에 점을 찍은 줄기 그림으로 그린다
    ml, sl, bl = ax.stem(n, x, linefmt="-", markerfmt="o", basefmt=" ", label=label)
    plt.setp(sl, color=color, lw=1.4)
    plt.setp(ml, color=color, markersize=ms)
    ax.axhline(0, color=INK, lw=0.6)


def vc(t, RC):
    return 1 - np.exp(-t / RC)


# 그림 1: RC 회로 계단 응답 v_c(t) = 1 - e^{-t/RC}, RC = 0.5, 1, 2. t = RC에서 63%
t = np.linspace(0, 6, 400)
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.axhline(1, color=INK, lw=0.8, ls="--")
ax.axhline(1 - math.exp(-1), color=INK, lw=0.6, ls=":")
ax.text(6.05, 1 - math.exp(-1), "63%", va="center", fontsize=10)
for i, RC in enumerate([0.5, 1, 2]):
    ax.plot(t, vc(t, RC), color=C[i], lw=1.8, label=f"$RC = {RC}$")
    ax.plot([RC], [vc(RC, RC)], "o", color=C[i], ms=5)
ax.set_xlabel("$t$ (초)")
ax.set_ylabel("$v_c(t)$")
ax.set_xlim(0, 6)
ax.set_ylim(0, 1.1)
ax.legend(loc="lower right")
save(fig, 1)

if __name__ == "__main__":
    # t = RC에서 1 - e^{-1} = 0.632, 오일러 방법으로 푼 값과 닫힌 꼴이 같다
    for RC in (0.5, 1, 2):
        assert abs(vc(RC, RC) - 0.6321) < 1e-4
        dt, v = 1e-4, 0.0
        for _ in range(int(RC / dt)):
            v += dt * (1 - v) / RC
        assert abs(v - vc(RC, RC)) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
