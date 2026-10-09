---
layout: "note"
title: "05_independent-variable-transform_plot.py"
display_title: "05_independent-variable-transform_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "05"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/independent-variable-transform/"
parent_title: "독립 변수의 변환"
description: "신호 및 시스템 · 독립 변수의 변환 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/05_independent-variable-transform_plot/"
---
{% raw %}
[독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 독립 변수의 변환 문서의 그림을 만든다: 05_independent-variable-transform_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 05_independent-variable-transform_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "05_independent-variable-transform"
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


def x(t):  # 그림 1.13(a): 0~1에서 1, 1~2에서 1에서 0으로 곧게 내려감
    t = np.asarray(t, dtype=float)
    return np.where((t >= 0) & (t <= 1), 1.0, np.where((t > 1) & (t <= 2), 2 - t, 0.0))


# 그림 1: x(t), x(-t + 1), x(3t/2 + 1)
t = np.linspace(-1.6, 2.6, 2000)
fig, axs = plt.subplots(3, 1, figsize=(6, 4.8), sharex=True)
items = [(x(t), "$x(t)$"), (x(-t + 1), "$x(-t+1)$"), (x(1.5 * t + 1), r"$x(\frac{3}{2}t+1)$")]
for i, (ax, (y, lab)) in enumerate(zip(axs, items)):
    ax.plot(t, y, color=C[i], lw=1.8)
    ax.fill_between(t, 0, y, color=C[i], alpha=0.12)
    ax.set_ylabel(lab, rotation=0, ha="right", va="center")
    ax.set_ylim(-0.1, 1.25)
    ax.set_yticks([0, 1])
    ax.axvline(0, color=INK, lw=0.6, ls=":")
    ax.grid(axis="x", color=INK, alpha=0.2, lw=0.5)
axs[2].set_xticks([-1, -2 / 3, 0, 2 / 3, 1, 2])
axs[2].set_xticklabels(["-1", r"$-\frac{2}{3}$", "0", r"$\frac{2}{3}$", "1", "2"])
axs[2].set_xlabel("$t$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 예 1: x(-t+1)은 0~1에서 1, -1~0에서 0→1. 예 2: x(1.5t+1)은 -2/3~0에서 1, 0~2/3에서 1→0
    assert x(-0.5 + 1) == 1 and abs(x(-(-0.5) + 1) - 0.5) < 1e-12
    assert x(1.5 * (-0.5) + 1) == 1 and abs(x(1.5 * (1 / 3) + 1) - 0.5) < 1e-12
    assert x(1.5 * (2 / 3 + 0.01) + 1) == 0 and x(1.5 * (-2 / 3 - 0.01) + 1) == 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
