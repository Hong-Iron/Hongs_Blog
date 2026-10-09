---
layout: "note"
title: "06_periodic-signals_plot.py"
display_title: "06_periodic-signals_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "06"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/periodic-signals/"
parent_title: "주기 신호"
description: "신호 및 시스템 · 주기 신호 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/06_periodic-signals_plot/"
---
{% raw %}
[주기 신호](/Hongs_Blog/studies/signals-and-systems/periodic-signals/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주기 신호 문서의 그림을 만든다: 06_periodic-signals_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 06_periodic-signals_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "06_periodic-signals"
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


def x(t):  # 예제 1.4: t < 0이면 cos t, t ≥ 0이면 sin t
    t = np.asarray(t, dtype=float)
    return np.where(t < 0, np.cos(t), np.sin(t))


# 그림 1: x(t)와 2π만큼 민 x(t + 2π). 끊김의 자리가 옮겨 가 두 그래프가 어긋난다
t = np.linspace(-9, 9, 3000)
fig, ax = plt.subplots(figsize=(6.5, 3))
y1 = x(t)
y2 = x(t + 2 * np.pi)
for yy in (y1, y2):
    yy[np.abs(np.diff(np.concatenate([[yy[0]], yy]))) > 0.5] = np.nan
ax.plot(t, y1, color=C[0], lw=2, label="$x(t)$")
ax.plot(t, y2, color=C[1], lw=1.5, ls="--", label=r"$x(t+2\pi)$")
ax.axvline(0, color=C[0], lw=0.6, ls=":")
ax.axvline(-2 * np.pi, color=C[1], lw=0.6, ls=":")
ax.axvspan(-2 * np.pi, 0, color=C[1], alpha=0.07)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xticks([-2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi])
ax.set_xticklabels([r"$-2\pi$", r"$-\pi$", "0", r"$\pi$", r"$2\pi$"])
ax.set_xlabel("$t$")
ax.set_ylim(-1.3, 1.6)
ax.legend(loc="upper right", ncol=2)
save(fig, 1)

if __name__ == "__main__":
    # -2π ≤ t < 0에서 x(t) = cos t, x(t + 2π) = sin t로 다르다. 그 밖에서는 같다
    tt = -np.pi / 2
    assert abs(x(tt) - 0.0) < 1e-12 and abs(x(tt + 2 * np.pi) + 1) < 1e-12
    assert abs(x(1.0) - x(1.0 + 2 * np.pi)) < 1e-12 and abs(x(-7.0) - x(-7.0 + 2 * np.pi)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
