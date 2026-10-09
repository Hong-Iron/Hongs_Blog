---
layout: "note"
title: "07_curve-analysis_plot.py"
display_title: "07_curve-analysis_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "07"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/curve-analysis/"
parent_title: "도함수의 활용과 최적화"
description: "미분적분학 · 도함수의 활용과 최적화 코드 코드"
permalink: "/studies/calculus/code/07_curve-analysis_plot/"
---
{% raw %}
[도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 도함수의 활용과 최적화 문서의 그림을 만든다: 07_curve-analysis_fig1.svg, 07_curve-analysis_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 07_curve-analysis_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "07_curve-analysis"
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


def V(x):
    return x * (12 - 2 * x) ** 2


def dV(x):
    return (12 - 2 * x) * (12 - 6 * x)


# 그림 1: 상자 부피 V(x)와 도함수의 부호. x = 2에서 평평해지며 가장 크다
x = np.linspace(0, 6, 300)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.axvspan(0, 2, color=C[2], alpha=0.08)
ax.axvspan(2, 6, color=C[1], alpha=0.08)
ax.plot(x, V(x), color=C[0], lw=2)
xs = np.array([1, 2, 3, 4, 5])
ax.plot(xs, V(xs), "o", ms=5, color=C[0])
ax.plot([0.8, 3.2], [128, 128], color=INK, lw=1, ls="--")
ax.annotate("$x=2$, 부피 128", xy=(2, 128), xytext=(2.6, 140), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.text(1, 15, "$V'>0$\n오름", ha="center", fontsize=10, color=C[2])
ax.text(4.2, 95, "$V'<0$\n내림", ha="center", fontsize=10, color=C[1])
ax.set_xlim(0, 6)
ax.set_ylim(0, 160)
ax.set_xlabel("잘라 낸 한 변 $x$ (cm)")
ax.set_ylabel("부피 $V(x)$ (cm³)")
save(fig, 1)


# 그림 2: 체크포인트 낭비율. 저장 비용 C/T는 줄고 잃는 계산 T/(2M)은 늘어, 합이 T* = 120에서 가장 작다
Cc, M = 5.0, 1440.0
T = np.linspace(15, 480, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(T, Cc / T, color=C[1], lw=1.5, label="저장 비용 $C/T$")
ax.plot(T, T / (2 * M), color=C[2], lw=1.5, label="고장 때 잃는 몫 $T/(2M)$")
ax.plot(T, Cc / T + T / (2 * M), color=C[0], lw=2.2, label="합 $W(T)$")
ts = math.sqrt(2 * Cc * M)
ax.plot([ts], [Cc / ts + ts / (2 * M)], "o", ms=6, color=C[0])
ax.annotate(r"$T^*=120$분", xy=(ts, Cc / ts + ts / (2 * M)), xytext=(200, 0.13), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_ylim(0, 0.25)
ax.set_xlabel("저장 간격 $T$ (분)")
ax.set_ylabel("시간당 낭비 비율")
ax.legend(loc="upper right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 표의 부피, 격자에서 최댓값 128이 x = 2, 도함수 부호, T* = 120이 격자 최소
    assert [V(v) for v in [1, 2, 3, 4, 5]] == [100, 128, 108, 64, 20]
    g = np.linspace(0.001, 5.999, 599801)
    assert abs(g[np.argmax(V(g))] - 2) < 1e-3 and abs(V(g).max() - 128) < 1e-4
    assert dV(1.5) > 0 and dV(2.5) < 0 and dV(2) == 0
    W = Cc / T + T / (2 * M)
    assert ts == 120 and abs(T[np.argmin(W)] - 120) < 1.2
    assert abs(Cc / ts - ts / (2 * M)) < 1e-12          # 최소점에서 두 비용이 같다
    print("ALL CHECKS PASSED")
```
{% endraw %}
