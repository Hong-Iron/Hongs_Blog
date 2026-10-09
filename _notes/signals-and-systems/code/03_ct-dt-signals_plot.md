---
layout: "note"
title: "03_ct-dt-signals_plot.py"
display_title: "03_ct-dt-signals_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "03"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/ct-dt-signals/"
parent_title: "연속 시간 신호와 이산 시간 신호"
description: "신호 및 시스템 · 연속 시간 신호와 이산 시간 신호 코드 코드"
permalink: "/studies/signals-and-systems/code/03_ct-dt-signals_plot/"
---
{% raw %}
[연속 시간 신호와 이산 시간 신호](/Hongs_Blog/studies/signals-and-systems/ct-dt-signals/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속 시간 신호와 이산 시간 신호 문서의 그림을 만든다: 03_ct-dt-signals_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 03_ct-dt-signals_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "03_ct-dt-signals"
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


# 그림 1: 연속 신호 x(t)와 T_s 간격으로 뽑은 이산 신호 x[n] = x(nT_s)
Ts = 0.5


def x(t):
    return np.sin(0.6 * t) + 0.5 * np.cos(1.7 * t)


fig, axs = plt.subplots(2, 1, figsize=(6, 4), sharex=False)
t = np.linspace(0, 10, 500)
axs[0].plot(t, x(t), color=C[0], lw=1.8)
axs[0].set_xlabel("$t$ (실수)")
axs[0].set_ylabel("$x(t)$")
axs[0].axhline(0, color=INK, lw=0.6)
axs[0].plot(np.arange(0, 21) * Ts, x(np.arange(0, 21) * Ts), "o", color=C[1], ms=4)
n = np.arange(0, 21)
stem(axs[1], n, x(n * Ts), C[1])
axs[1].set_xlabel("$n$ (정수)")
axs[1].set_ylabel("$x[n]$")
axs[1].set_xticks(range(0, 21, 2))
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # x[n] = x(n T_s): n = 4이면 t = 2의 값
    assert abs(x(4 * Ts) - x(2.0)) < 1e-12 and len(n) == 21
    print("ALL CHECKS PASSED")
```
{% endraw %}
