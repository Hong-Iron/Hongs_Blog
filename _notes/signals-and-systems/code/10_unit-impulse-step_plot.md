---
layout: "note"
title: "10_unit-impulse-step_plot.py"
display_title: "10_unit-impulse-step_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "10"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/unit-impulse-step/"
parent_title: "단위 임펄스와 단위 계단"
description: "신호 및 시스템 · 단위 임펄스와 단위 계단 코드 코드"
permalink: "/studies/signals-and-systems/code/10_unit-impulse-step_plot/"
---
{% raw %}
[단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 단위 임펄스와 단위 계단 문서의 그림을 만든다: 10_unit-impulse-step_fig1.svg, 10_unit-impulse-step_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 10_unit-impulse-step_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "10_unit-impulse-step"
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


def u_d(t, D):  # Δ 동안 0에서 1로 곧게 오르는 계단
    return np.clip(t / D, 0, 1)


def d_d(t, D):  # 그 도함수: 폭 Δ, 높이 1/Δ인 펄스
    return np.where((t >= 0) & (t < D), 1 / D, 0.0)


# 그림 1: u_Δ(t)와 δ_Δ(t) = du_Δ/dt. Δ = 1, 0.5, 0.25. 펄스 넓이는 늘 1
t = np.linspace(-0.5, 1.5, 4001)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9))
for i, D in enumerate([1, 0.5, 0.25]):
    axs[0].plot(t, u_d(t, D), color=C[i], lw=1.7, label=f"$\\Delta = {D}$")
    axs[1].plot(t, d_d(t, D), color=C[i], lw=1.7)
    axs[1].fill_between(t, 0, d_d(t, D), color=C[i], alpha=0.10)
axs[0].set_title(r"$u_\Delta(t)$", fontsize=10)
axs[1].set_title(r"$\delta_\Delta(t)$ (넓이 1)", fontsize=10)
axs[0].legend(loc="lower right")
for ax in axs:
    ax.set_xlabel("$t$")
    ax.axhline(0, color=INK, lw=0.6)
fig.tight_layout()
save(fig, 1)


def x17(t):  # 예제 1.7
    t = np.asarray(t, dtype=float)
    return 2 * (t > 1) - 3 * (t > 2) + 2 * (t > 4)


# 그림 2: 예제 1.7의 x(t)와 그 도함수(화살표 옆 숫자는 임펄스의 넓이)
t = np.linspace(0, 5.5, 2001)
fig, axs = plt.subplots(2, 1, figsize=(6, 3.8), sharex=True)
y = x17(t).astype(float)
jumps = np.where(np.abs(np.diff(y)) > 0)[0]
y[jumps + 1] = np.nan
axs[0].plot(t, y, color=C[0], lw=2)
axs[0].set_ylabel("$x(t)$", rotation=0, ha="right")
axs[0].set_yticks([-1, 0, 1, 2])
for tk, a in [(1, 2), (2, -3), (4, 2)]:
    axs[1].annotate("", xy=(tk, a), xytext=(tk, 0), arrowprops=dict(arrowstyle="-|>", color=C[1], lw=1.8))
    axs[1].text(tk + 0.12, a * 0.8, f"({a})", color=C[1], fontsize=10, va="center")
axs[1].set_ylim(-3.5, 2.6)
axs[1].set_ylabel(r"$\dot{x}(t)$", rotation=0, ha="right")
axs[1].set_yticks([-3, 0, 2])
axs[1].set_xlabel("$t$")
for ax in axs:
    ax.axhline(0, color=INK, lw=0.6)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 펄스 넓이 1, 예제 1.7의 값 2, -1, 1과 임펄스 넓이의 누적 합이 같다
    tt = np.linspace(-1, 2, 300001)
    for D in (1, 0.5, 0.25):
        assert abs(np.sum(d_d(tt, D)) * (tt[1] - tt[0]) - 1) < 1e-3
    assert x17(1.5) == 2 and x17(3) == -1 and x17(5) == 1
    assert 2 == x17(1.5) and 2 - 3 == x17(3) and 2 - 3 + 2 == x17(5)
    print("ALL CHECKS PASSED")
```
{% endraw %}
