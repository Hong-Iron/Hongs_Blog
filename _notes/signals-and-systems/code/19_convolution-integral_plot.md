---
layout: "note"
title: "19_convolution-integral_plot.py"
display_title: "19_convolution-integral_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "19"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/convolution-integral/"
parent_title: "컨벌루션 적분"
description: "신호 및 시스템 · 컨벌루션 적분 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/19_convolution-integral_plot/"
---
{% raw %}
[컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 컨벌루션 적분 문서의 그림을 만든다: 19_convolution-integral_fig1.svg, 19_convolution-integral_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_convolution-integral_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_convolution-integral"
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


T = 1.0


def xf(t):  # 0 < t < T에서 1
    t = np.asarray(t, dtype=float)
    return ((t > 0) & (t < T)).astype(float)


def hf(t):  # 0 < t < 2T에서 t
    t = np.asarray(t, dtype=float)
    return np.where((t > 0) & (t < 2 * T), t, 0.0)


def y27(t):  # 예제 2.7의 네 구간 답
    t = np.asarray(t, dtype=float)
    return np.select([(t > 0) & (t < T), (t >= T) & (t < 2 * T), (t >= 2 * T) & (t < 3 * T)],
                     [0.5 * t ** 2, T * t - 0.5 * T ** 2, -0.5 * t ** 2 + T * t + 1.5 * T ** 2], 0.0)


# 그림 1: 예제 2.7 (T = 1). h(t - τ)를 뒤집어 밀며 x(τ)와 겹친 넓이가 y(t)
tau = np.linspace(-2.5, 3.5, 3001)
fig, axs = plt.subplots(4, 1, figsize=(6.2, 6), sharex=True)
for row, tsel in enumerate([0.5, 1.5, 2.5]):
    ax = axs[row]
    xv, hv = xf(tau), hf(tsel - tau)
    ax.plot(tau, xv, color=C[0], lw=1.6)
    ax.plot(tau, hv, color=C[1], lw=1.6)
    ax.fill_between(tau, 0, xv * hv, color=C[2], alpha=0.35)
    ax.axvline(tsel, color=C[1], lw=0.6, ls=":")
    ax.set_ylim(-0.1, 2.3)
    ax.text(3.6, 1.0, f"$t = {tsel}$", fontsize=10, va="center")
axs[0].plot([], [], color=C[0], label=r"$x(\tau)$")
axs[0].plot([], [], color=C[1], label=r"$h(t-\tau)$")
axs[0].fill_between([], [], color=C[2], alpha=0.35, label="겹친 넓이")
axs[0].legend(loc="upper right", ncol=3, fontsize=9)
tt = np.linspace(-0.5, 3.5, 2001)
axs[3].plot(tt, y27(tt), color=C[3], lw=1.8)
for tsel in (0.5, 1.5, 2.5):
    axs[3].plot([tsel], [y27(tsel)], "o", color=C[2], ms=6)
for b in (1, 2, 3):
    axs[3].axvline(b, color=INK, lw=0.5, ls="--")
axs[3].text(3.6, 0.7, "$y(t)$", fontsize=10, va="center")
axs[3].set_xlabel(r"$\tau$ (위 세 줄),  $t$ (맨 아래)")
for ax in axs:
    ax.axhline(0, color=INK, lw=0.6)
fig.tight_layout()
save(fig, 1)


def trap(t, a, b):  # 높이 1, 폭 a와 b인 사각 펄스의 컨벌루션 (a ≤ b)
    t = np.asarray(t, dtype=float)
    return np.select([(t >= 0) & (t < a), (t >= a) & (t < b), (t >= b) & (t < a + b)], [t, a + 0 * t, a + b - t], 0.0)


# 그림 2: 사각 펄스 두 개의 컨벌루션. 폭이 다르면 사다리꼴, 같으면 삼각형
tt = np.linspace(-0.5, 3.5, 2001)
fig, ax = plt.subplots(figsize=(6, 2.8))
ax.plot(tt, trap(tt, 1, 2), color=C[0], lw=1.8, label="폭 1과 폭 2")
ax.plot(tt, trap(tt, 1, 1), color=C[1], lw=1.8, label="폭 1과 폭 1")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$t$")
ax.set_ylim(-0.05, 1.4)
ax.legend(loc="upper right")
save(fig, 2)

if __name__ == "__main__":
    # 그림 속 겹친 넓이를 수치 적분한 값이 닫힌 꼴과 같고, 구간 경계에서 이어진다
    d = tau[1] - tau[0]
    for tsel in (0.5, 1.5, 2.5, 0.9, 2.2):
        assert abs(np.sum(xf(tau) * hf(tsel - tau)) * d - y27(tsel)) < 5e-3
    for b in (1.0, 2.0):
        assert abs(y27(b - 1e-9) - y27(b + 1e-9)) < 1e-6
    assert abs(y27(1.5) - 1.0) < 1e-12 and abs(y27(2.5) - 0.875) < 1e-12
    for tsel in (0.5, 1.5, 2.5):
        num = np.sum(((tau > 0) & (tau < 1)) * ((tsel - tau > 0) & (tsel - tau < 2))) * d
        assert abs(num - trap(tsel, 1, 2)) < 5e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
