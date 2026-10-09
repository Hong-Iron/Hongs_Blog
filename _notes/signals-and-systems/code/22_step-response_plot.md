---
layout: "note"
title: "22_step-response_plot.py"
display_title: "22_step-response_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "22"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/step-response/"
parent_title: "단위 계단 응답"
description: "신호 및 시스템 · 단위 계단 응답 코드 코드"
permalink: "/studies/signals-and-systems/code/22_step-response_plot/"
---
{% raw %}
[단위 계단 응답](/Hongs_Blog/studies/signals-and-systems/step-response/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 단위 계단 응답 문서의 그림을 만든다: 22_step-response_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 22_step-response_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "22_step-response"
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


def h(t):
    return np.where(t >= 0, np.exp(-2 * t), 0.0)


def s(t):
    return np.where(t >= 0, 0.5 * (1 - np.exp(-2 * t)), 0.0)


# 그림 1: h(t) = e^{-2t}u(t)와 계단 응답 s(t). t까지 쌓인 h의 넓이가 s(t)이고, s의 기울기가 h다
t = np.linspace(-0.5, 3, 1000)
t0 = 0.5
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9))
axs[0].plot(t, h(t), color=C[0], lw=1.8)
m = (t >= 0) & (t <= t0)
axs[0].fill_between(t[m], 0, h(t[m]), color=C[0], alpha=0.25)
axs[0].text(0.95, 0.5, f"넓이 = $s({t0})$", fontsize=10)
axs[0].set_title("$h(t) = e^{-2t}u(t)$", fontsize=10)
axs[1].plot(t, s(t), color=C[1], lw=1.8)
axs[1].plot([t0], [s(t0)], "o", color=C[1], ms=5)
slope = h(t0)
tl = np.linspace(t0 - 0.4, t0 + 0.4, 10)
axs[1].plot(tl, s(t0) + slope * (tl - t0), color=C[0], lw=1.2, ls="--")
axs[1].text(t0 + 0.4, s(t0) - 0.07, f"기울기 = $h({t0})$", fontsize=10)
axs[1].axhline(0.5, color=INK, lw=0.6, ls=":")
axs[1].set_title(r"$s(t) = \frac{1}{2}(1 - e^{-2t})u(t)$", fontsize=10)
for ax in axs:
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xlabel("$t$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # ∫_0^{0.5} h = s(0.5) = 0.316, s'(0.5) = h(0.5) = e^{-1}
    tt = np.linspace(0, t0, 200001)
    assert abs(np.sum(h(tt)[:-1]) * (tt[1] - tt[0]) - s(t0)) < 1e-4
    assert abs((s(t0 + 1e-6) - s(t0 - 1e-6)) / 2e-6 - h(t0)) < 1e-6
    assert abs(s(t0) - 0.5 * (1 - math.exp(-1))) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
