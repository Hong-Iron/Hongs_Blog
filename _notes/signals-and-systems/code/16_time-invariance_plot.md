---
layout: "note"
title: "16_time-invariance_plot.py"
display_title: "16_time-invariance_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "16"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/time-invariance/"
parent_title: "시불변성"
description: "신호 및 시스템 · 시불변성 코드 코드"
permalink: "/studies/signals-and-systems/code/16_time-invariance_plot/"
---
{% raw %}
[시불변성](/Hongs_Blog/studies/signals-and-systems/time-invariance/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 시불변성 문서의 그림을 만든다: 16_time-invariance_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_time-invariance_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_time-invariance"
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


def rect(t, a, b):
    t = np.asarray(t, dtype=float)
    return ((t >= a) & (t <= b)).astype(float)


def x1(t):  # -2 ≤ t ≤ 2에서 1
    return rect(t, -2, 2)


# 그림 1: 예제 1.16 (y = x(2t)). 입력을 2 늦추면 출력은 1만 늦는다
t = np.linspace(-3, 5, 4001)
fig, axs = plt.subplots(2, 1, figsize=(6.2, 3.8), sharex=True)
axs[0].plot(t, x1(t), color=C[0], lw=1.8, label="$x_1(t)$")
axs[0].plot(t, x1(t - 2), color=C[1], lw=1.8, ls="--", label="$x_2(t) = x_1(t-2)$")
axs[0].set_title("입력", fontsize=10)
axs[1].plot(t, x1(2 * t), color=C[0], lw=1.8, label="$y_1(t)$")
axs[1].plot(t, x1(2 * t - 2), color=C[1], lw=1.8, ls="--", label="$y_2(t)$")
axs[1].plot(t, x1(2 * (t - 2)), color=C[2], lw=1.5, ls=":", label="$y_1(t-2)$")
axs[1].set_title("출력 $y(t) = x(2t)$", fontsize=10)
for ax, ys in zip(axs, [[x1(t), x1(t - 2)], [x1(2 * t), x1(2 * t - 2), x1(2 * (t - 2))]]):
    for i, yv in enumerate(ys):
        ax.fill_between(t, 0, yv, color=C[i], alpha=0.10)
for ax in axs:
    ax.set_ylim(-0.1, 1.5)
    ax.set_yticks([0, 1])
    ax.legend(loc="upper left", fontsize=9, ncol=3)
    ax.grid(axis="x", color=INK, alpha=0.2, lw=0.5)
axs[1].set_xlabel("$t$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # y1은 -1~1, y2는 0~2, y1(t-2)는 1~3. y2(t) = y1(t-1)
    tt = np.linspace(-3, 5, 8001)
    assert np.allclose(x1(2 * tt - 2), x1(2 * (tt - 1)))
    on = lambda y: (tt[y > 0].min(), tt[y > 0].max())
    assert np.allclose(on(x1(2 * tt)), (-1, 1)) and np.allclose(on(x1(2 * tt - 2)), (0, 2)) and np.allclose(on(x1(2 * (tt - 2))), (1, 3))
    print("ALL CHECKS PASSED")
```
{% endraw %}
