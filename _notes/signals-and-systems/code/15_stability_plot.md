---
layout: "note"
title: "15_stability_plot.py"
display_title: "15_stability_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "15"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/stability/"
parent_title: "안정성"
description: "신호 및 시스템 · 안정성 코드 코드"
permalink: "/studies/signals-and-systems/code/15_stability_plot/"
---
{% raw %}
[안정성](/Hongs_Blog/studies/signals-and-systems/stability/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 안정성 문서의 그림을 만든다: 15_stability_fig1.svg, 15_stability_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_stability_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_stability"
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


# 그림 1: 누산기 y[n] = Σ x[k]에 유계 입력 두 개를 넣는다. u[n]이면 끝없이 커지고, (-1)^n u[n]이면 1, 0, 1, 0
n = np.arange(-2, 13)
u = (n >= 0).astype(float)
alt = np.where(n >= 0, (-1.0) ** n, 0.0)
fig, axs = plt.subplots(2, 2, figsize=(6.6, 3.8), sharex=True)
stem(axs[0, 0], n, u, C[0], ms=4)
axs[0, 0].set_title("입력 $u[n]$", fontsize=10)
stem(axs[1, 0], n, np.cumsum(u), C[0], ms=4)
axs[1, 0].set_title("출력 $(n+1)u[n]$", fontsize=10)
stem(axs[0, 1], n, alt, C[1], ms=4)
axs[0, 1].set_title("입력 $(-1)^n u[n]$", fontsize=10)
stem(axs[1, 1], n, np.cumsum(alt), C[1], ms=4)
axs[1, 1].set_title("출력: 1, 0, 1, 0, …", fontsize=10)
for ax in axs[0]:
    ax.set_ylim(-1.3, 1.3)
for ax in axs[1]:
    ax.set_ylim(-0.5, 14)
    ax.set_xlabel("$n$")
fig.tight_layout()
save(fig, 1)


# 그림 2: dy/dt + ay = x에 상수 입력 1. a > 0이면 b/a = 1/a로 수렴, a < 0이면 발산
def resp(t, a):  # y(0) = 0, x = 1
    return (1 - np.exp(-a * t)) / a


t = np.linspace(0, 4, 400)
fig, ax = plt.subplots(figsize=(6, 3))
ax.plot(t, resp(t, 1.0), color=C[0], lw=1.8, label="$a = 1$ (안정)")
ax.plot(t, resp(t, -1.0), color=C[1], lw=1.8, label="$a = -1$ (불안정)")
ax.axhline(1, color=C[0], lw=0.7, ls=":")
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-0.5, 8)
ax.set_xlabel("$t$")
ax.set_ylabel("$y(t)$")
ax.legend(loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    # 누산기: u[n] → n+1, (-1)^n u[n] → 1, 0, 1, 0. 미분방정식: a = 1이면 1로, a = -1이면 발산
    assert np.allclose(np.cumsum(u)[n >= 0], n[n >= 0] + 1)
    assert np.allclose(np.cumsum(alt)[n >= 0], (n[n >= 0] + 1) % 2)
    dt, y1, y2 = 1e-4, 0.0, 0.0
    for _ in range(int(4 / dt)):
        y1 += dt * (1 - y1); y2 += dt * (1 + y2)
    assert abs(y1 - resp(4.0, 1.0)) < 1e-3 and abs(y2 - resp(4.0, -1.0)) / resp(4.0, -1.0) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
