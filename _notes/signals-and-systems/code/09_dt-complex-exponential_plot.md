---
layout: "note"
title: "09_dt-complex-exponential_plot.py"
display_title: "09_dt-complex-exponential_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "09"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/dt-complex-exponential/"
parent_title: "이산 시간 복소 지수 신호"
description: "신호 및 시스템 · 이산 시간 복소 지수 신호 코드 코드"
permalink: "/studies/signals-and-systems/code/09_dt-complex-exponential_plot/"
---
{% raw %}
[이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 시간 복소 지수 신호 문서의 그림을 만든다: 09_dt-complex-exponential_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 09_dt-complex-exponential_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "09_dt-complex-exponential"
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


# 그림 1: cos(ω0 n). ω0 = π/8, π/2, π, 15π/8. π에서 가장 빠르고 15π/8은 π/8과 같다
n = np.arange(0, 17)
ws = [(np.pi / 8, r"$\omega_0 = \pi/8$"), (np.pi / 2, r"$\omega_0 = \pi/2$"),
      (np.pi, r"$\omega_0 = \pi$"), (15 * np.pi / 8, r"$\omega_0 = 15\pi/8$")]
fig, axs = plt.subplots(4, 1, figsize=(6, 5.6), sharex=True)
tc = np.linspace(0, 16, 1200)
for i, (ax, (w, lab)) in enumerate(zip(axs, ws)):
    if i == 3:
        ax.plot(tc, np.cos(w * tc), color=INK, lw=0.7, alpha=0.6)
        ax.plot(tc, np.cos(np.pi / 8 * tc), color=C[0], lw=0.9, ls="--", alpha=0.8)
    stem(ax, n, np.cos(w * n), C[i], ms=4)
    ax.set_ylim(-1.3, 1.3)
    ax.set_yticks([-1, 0, 1])
    ax.text(16.6, 0, lab, va="center", fontsize=10)
axs[3].set_xlabel("$n$")
axs[3].set_xticks(range(0, 17, 2))
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # cos(15πn/8) = cos(πn/8), cos(7πn) = cos(πn) = (-1)^n, 주기 N: π/8 → 16, π/2 → 4, π → 2
    nn = np.arange(-50, 50)
    assert np.allclose(np.cos(15 * np.pi / 8 * nn), np.cos(np.pi / 8 * nn))
    assert np.allclose(np.cos(7 * np.pi * nn), (-1.0) ** nn)
    for w, N in [(np.pi / 8, 16), (np.pi / 2, 4), (np.pi, 2), (15 * np.pi / 8, 16)]:
        assert np.allclose(np.cos(w * (nn + N)), np.cos(w * nn))
        assert all(not np.allclose(np.cos(w * (nn + m)), np.cos(w * nn)) for m in range(1, N))
    print("ALL CHECKS PASSED")
```
{% endraw %}
