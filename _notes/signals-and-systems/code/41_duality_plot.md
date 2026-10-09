---
layout: "note"
title: "41_duality_plot.py"
display_title: "41_duality_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "41"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/fourier-duality/"
parent_title: "푸리에 변환의 쌍대성"
description: "신호 및 시스템 · 푸리에 변환의 쌍대성 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/41_duality_plot/"
---
{% raw %}
[푸리에 변환의 쌍대성](/Hongs_Blog/studies/signals-and-systems/fourier-duality/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 변환의 쌍대성 문서의 그림을 만든다: 41_duality_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 41_duality_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "41_duality"
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


# 그림 1: 예제 4.13. e^{-|t|} ↔ 2/(1+ω²)이면, 모양을 맞바꾼 2/(1+t²) ↔ 2πe^{-|ω|}
t = np.linspace(-5, 5, 1000)
fig, axs = plt.subplots(2, 2, figsize=(6.6, 4.2))
axs[0, 0].plot(t, np.exp(-np.abs(t)), color=C[0], lw=1.8)
axs[0, 0].set_title(r"$x(t) = e^{-|t|}$", fontsize=10)
axs[0, 1].plot(t, 2 / (1 + t ** 2), color=C[1], lw=1.8)
axs[0, 1].set_title(r"$X(j\omega) = \frac{2}{1 + \omega^2}$", fontsize=10)
axs[1, 0].plot(t, 2 / (1 + t ** 2), color=C[1], lw=1.8)
axs[1, 0].set_title(r"$g(t) = \frac{2}{1 + t^2}$", fontsize=10)
axs[1, 1].plot(t, 2 * np.pi * np.exp(-np.abs(t)), color=C[0], lw=1.8)
axs[1, 1].set_title(r"$G(j\omega) = 2\pi e^{-|\omega|}$", fontsize=10)
for ax in axs[:, 0]:
    ax.set_xlabel("$t$")
for ax in axs[:, 1]:
    ax.set_xlabel(r"$\omega$")
fig.text(0.5, 0.74, r"$\longleftrightarrow$", ha="center", fontsize=16)
fig.text(0.5, 0.27, r"$\longleftrightarrow$", ha="center", fontsize=16)
fig.tight_layout(w_pad=3)
save(fig, 1)

if __name__ == "__main__":
    # 2/(1+t²)의 변환을 수치 적분해 2πe^{-|ω|}와 비교, e^{-|t|}의 변환 2/(1+ω²)
    tt = np.linspace(-2000, 2000, 4000001); d = tt[1] - tt[0]
    for wv in (0.0, 0.5, 1.5):
        num = np.sum(2 / (1 + tt ** 2) * np.cos(wv * tt)) * d
        assert abs(num - 2 * np.pi * np.exp(-abs(wv))) < 5e-3
    ts = np.linspace(-40, 40, 800001); d2 = ts[1] - ts[0]
    for wv in (0.0, 2.0):
        assert abs(np.sum(np.exp(-np.abs(ts)) * np.cos(wv * ts)) * d2 - 2 / (1 + wv ** 2)) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
