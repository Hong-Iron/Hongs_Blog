---
layout: "note"
title: "11_sampling-quantization_plot.py"
display_title: "11_sampling-quantization_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "11"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/sampling-quantization/"
parent_title: "표본화와 양자화"
description: "신호 및 시스템 · 표본화와 양자화 코드 코드"
permalink: "/studies/signals-and-systems/code/11_sampling-quantization_plot/"
---
{% raw %}
[표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 표본화와 양자화 문서의 그림을 만든다: 11_sampling-quantization_fig1.svg, 11_sampling-quantization_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_sampling-quantization_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_sampling-quantization"
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


f0, Ts, bits = 2.0, 0.05, 3


def x(t):
    return np.cos(2 * np.pi * f0 * t)


def quantize(v, b):  # 범위 -1~1을 2^b칸으로 나누고 칸의 가운데 값으로 반올림
    dq = 2 / 2 ** b
    idx = np.clip(np.floor((v + 1) / dq), 0, 2 ** b - 1)
    return -1 + (idx + 0.5) * dq


# 그림 1: 2Hz 코사인을 T_s = 0.05초로 표본화하고 3비트(8단계)로 양자화
t = np.linspace(0, 0.5, 1000)
n = np.arange(0, 11)
fig, axs = plt.subplots(2, 1, figsize=(6, 4.2), sharex=True, gridspec_kw={"height_ratios": [2.2, 1]})
dq = 2 / 2 ** bits
for k in range(2 ** bits):
    axs[0].axhline(-1 + (k + 0.5) * dq, color=INK, lw=0.4, ls=":")
axs[0].plot(t, x(t), color=C[0], lw=1.6, label="연속 신호")
axs[0].plot(n * Ts, x(n * Ts), "o", color=C[0], ms=5, mfc="none", label="표본")
axs[0].plot(n * Ts, quantize(x(n * Ts), bits), "s", color=C[1], ms=5, label="양자화 값")
axs[0].legend(loc="lower right", fontsize=9, ncol=3)
axs[0].set_ylim(-1.45, 1.1)
axs[0].set_yticks([-1, 0, 1])
err = x(n * Ts) - quantize(x(n * Ts), bits)
stem(axs[1], n * Ts, err, C[1], ms=4)
axs[1].axhline(dq / 2, color=INK, lw=0.7, ls="--")
axs[1].axhline(-dq / 2, color=INK, lw=0.7, ls="--")
axs[1].set_ylabel("오차", rotation=0, ha="right")
axs[1].set_ylim(-0.15, 0.15)
axs[1].set_xlabel("$t$ (초)")
fig.tight_layout()
save(fig, 1)

# 그림 2: 너무 드문 표본화. 2Hz 코사인을 초당 2.5번 뽑으면 0.5Hz 코사인과 같은 표본이 된다
fs = 2.5
t = np.linspace(0, 4, 2000)
m = np.arange(0, 11)
fig, ax = plt.subplots(figsize=(6.5, 2.8))
ax.plot(t, x(t), color=C[0], lw=1.0, alpha=0.8, label="2Hz 코사인")
ax.plot(t, np.cos(2 * np.pi * 0.5 * t), color=C[1], lw=1.6, ls="--", label="0.5Hz 코사인")
ax.plot(m / fs, x(m / fs), "o", color=C[2], ms=6, label="초당 2.5번 뽑은 표본")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$t$ (초)")
ax.set_ylim(-1.2, 1.7)
ax.legend(loc="upper center", ncol=3, fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 10개마다 되풀이, 3비트면 8단계·칸 폭 0.25·최대 오차 0.125, 2Hz와 0.5Hz가 2.5Hz 표본에서 같다
    nn = np.arange(0, 100)
    assert np.allclose(x((nn + 10) * Ts), x(nn * Ts))
    assert len(np.unique(quantize(np.linspace(-1, 1, 10001), bits))) == 8
    assert np.max(np.abs(np.linspace(-1, 1, 10001) - quantize(np.linspace(-1, 1, 10001), bits))) <= 0.125 + 1e-12
    assert np.allclose(x(nn / fs), np.cos(2 * np.pi * 0.5 * nn / fs))
    print("ALL CHECKS PASSED")
```
{% endraw %}
