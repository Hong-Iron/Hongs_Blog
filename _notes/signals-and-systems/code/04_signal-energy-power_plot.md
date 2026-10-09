---
layout: "note"
title: "04_signal-energy-power_plot.py"
display_title: "04_signal-energy-power_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "04"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/signal-energy-power/"
parent_title: "신호의 에너지와 전력"
description: "신호 및 시스템 · 신호의 에너지와 전력 코드 코드"
permalink: "/studies/signals-and-systems/code/04_signal-energy-power_plot/"
---
{% raw %}
[신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 신호의 에너지와 전력 문서의 그림을 만든다: 04_signal-energy-power_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 04_signal-energy-power_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "04_signal-energy-power"
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


# 구간 [-T, T]의 에너지 E_T와 평균 전력 P_T = E_T / 2T
def E_pulse(T):  # 0 ≤ t ≤ 1에서 1인 펄스
    return np.minimum(T, 1.0)


def E_cos(T):  # cos 2πt: ∫_{-T}^{T} cos² 2πt dt = T + sin(4πT) / (4π)
    return T + np.sin(4 * np.pi * T) / (4 * np.pi)


# 그림 1: 펄스(에너지 신호)와 cos 2πt(전력 신호)의 E_T, P_T
T = np.linspace(0.05, 8, 800)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9))
axs[0].plot(T, E_pulse(T), color=C[0], lw=1.8, label="펄스")
axs[0].plot(T, E_cos(T), color=C[1], lw=1.8, label=r"$\cos 2\pi t$")
axs[0].set_title("에너지 $E_T$", fontsize=10)
axs[0].legend(loc="upper left")
axs[1].plot(T, E_pulse(T) / (2 * T), color=C[0], lw=1.8)
axs[1].plot(T, E_cos(T) / (2 * T), color=C[1], lw=1.8)
axs[1].axhline(0.5, color=INK, lw=0.6, ls=":")
axs[1].text(8, 0.53, r"$\frac{1}{2}$", ha="right", fontsize=11)
axs[1].set_title("평균 전력 $P_T = E_T / 2T$", fontsize=10)
axs[1].set_ylim(0, 1.05)
for ax in axs:
    ax.set_xlabel("구간 반쪽 길이 $T$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 펄스: E → 1, P → 0. cos 2πt: P → 1/2, E는 끝없이 커짐 (수치 적분과 닫힌 꼴 비교 포함)
    assert E_pulse(8.0) == 1.0 and E_pulse(8.0) / 16 < 0.07
    tt = np.linspace(-3, 3, 600001)
    num = np.sum(np.cos(2 * np.pi * tt) ** 2) * (tt[1] - tt[0])
    assert abs(num - E_cos(3.0)) < 1e-4
    assert abs(E_cos(1000.0) / 2000 - 0.5) < 1e-4 and E_cos(8.0) > 7.9
    print("ALL CHECKS PASSED")
```
{% endraw %}
