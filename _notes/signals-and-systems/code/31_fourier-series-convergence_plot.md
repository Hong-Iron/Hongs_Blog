---
layout: "note"
title: "31_fourier-series-convergence_plot.py"
display_title: "31_fourier-series-convergence_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "31"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/fourier-series-convergence/"
parent_title: "푸리에 급수의 수렴"
description: "신호 및 시스템 · 푸리에 급수의 수렴 코드 코드"
permalink: "/studies/signals-and-systems/code/31_fourier-series-convergence_plot/"
---
{% raw %}
[푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 급수의 수렴 문서의 그림을 만든다: 31_fourier-series-convergence_fig1.svg, 31_fourier-series-convergence_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 31_fourier-series-convergence_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "31_fourier-series-convergence"
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


T, T1 = 4.0, 1.0
w0 = 2 * np.pi / T


def xN(t, N):  # 사각파 (T = 4T1)의 부분합: a0 + Σ 2 a_k cos(kω0 t)
    y = np.full_like(t, 2 * T1 / T)
    for k in range(1, N + 1):
        y += 2 * np.sin(k * w0 * T1) / (k * np.pi) * np.cos(k * w0 * t)
    return y


# 그림 1: 부분합 x_N, N = 1, 3, 7, 19, 79. 끊긴 점 t = 1에서는 늘 1/2을 지난다
t = np.linspace(-2, 2, 4001)
sq = (np.abs(t) < T1).astype(float)
fig, axs = plt.subplots(5, 1, figsize=(6, 6.2), sharex=True)
for i, (ax, N) in enumerate(zip(axs, [1, 3, 7, 19, 79])):
    ax.plot(t, sq, color=INK, lw=0.8, ls="--")
    ax.plot(t, xN(t, N), color=C[i], lw=1.4)
    ax.plot([T1, -T1], [0.5, 0.5], "o", color=INK, ms=3.5)
    ax.set_ylim(-0.25, 1.3)
    ax.set_yticks([0, 0.5, 1])
    ax.text(2.1, 0.5, f"$N = {N}$", fontsize=10, va="center")
axs[4].set_xlabel("$t$")
fig.tight_layout()
save(fig, 1)

# 그림 2: 끊긴 점 t = 1 근처 확대. 넘침의 높이는 줄지 않고 폭만 좁아진다
t = np.linspace(0.6, 1.4, 8001)
fig, ax = plt.subplots(figsize=(6, 3))
ax.plot(t, (np.abs(t) < T1).astype(float), color=INK, lw=0.8, ls="--")
for i, N in enumerate([19, 79, 301]):
    ax.plot(t, xN(t, N), color=C[i], lw=1.3, label=f"$N = {N}$")
ax.axhline(1.0895, color=INK, lw=0.6, ls=":")
ax.text(1.41, 1.0895, "약 1.09", va="center", fontsize=10)
ax.set_xlim(0.6, 1.4)
ax.set_xlabel("$t$")
ax.set_ylim(-0.15, 1.2)
ax.legend(loc="lower left", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 끊긴 점에서 1/2, 넘침이 N = 19, 79, 301에서 모두 0.085~0.095, 오차 에너지가 줄어든다
    for N in (1, 3, 7, 19, 79):
        assert abs(xN(np.array([T1]), N)[0] - 0.5) < 1e-12
    tz = np.linspace(0, 1, 200001)
    for N in (19, 79, 301):
        ov = xN(tz, N).max() - 1
        assert 0.085 < ov < 0.095
    tp = np.linspace(-2, 2, 40001)[:-1]
    E = [np.mean(((np.abs(tp) < 1).astype(float) - xN(tp, N)) ** 2) * T for N in (1, 3, 7, 19, 79)]
    assert all(a >= b for a, b in zip(E, E[1:])) and E[-1] < 0.006
    print("ALL CHECKS PASSED")
```
{% endraw %}
