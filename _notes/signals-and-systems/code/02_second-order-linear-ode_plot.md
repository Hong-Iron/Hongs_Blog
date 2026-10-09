---
layout: "note"
title: "02_second-order-linear-ode_plot.py"
display_title: "02_second-order-linear-ode_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "02"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/second-order-linear-ode/"
parent_title: "상수계수 2계 선형 미분방정식"
description: "신호 및 시스템 · 상수계수 2계 선형 미분방정식 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/02_second-order-linear-ode_plot/"
---
{% raw %}
[상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 상수계수 2계 선형 미분방정식 문서의 그림을 만든다: 02_second-order-linear-ode_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 02_second-order-linear-ode_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "02_second-order-linear-ode"
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


def y1(x):  # 예 1: 실근 -8, -3
    return 1.4 * np.exp(-8 * x) - 1.4 * np.exp(-3 * x)


def y_rep(x):  # 중근 1: y'' - 2y' + y = 0, y(0) = 0, y'(0) = 1
    return x * np.exp(x)


def y2(x):  # 예 2: 복소근 2 ± j√5
    return -8 * math.sqrt(5) / 5 * np.exp(2 * x) * np.sin(math.sqrt(5) * x)


def y_damp(x):  # 실수부가 음수인 복소근 -0.5 ± j3: y'' + y' + 9.25y = 0, y(0) = 1, y'(0) = -0.5
    return np.exp(-0.5 * x) * np.cos(3 * x)


# 그림 1: 특성근 종류에 따른 해의 모양 네 가지
fig, axs = plt.subplots(2, 2, figsize=(6.5, 4.6))
axs = axs.ravel()
x = np.linspace(0, 2, 400)
axs[0].plot(x, y1(x), color=C[0], lw=1.8)
axs[0].set_title("서로 다른 실근 $-8, -3$", fontsize=10)
x2 = np.linspace(0, 1.5, 400)
axs[1].plot(x2, y_rep(x2), color=C[1], lw=1.8)
axs[1].set_title("중근 $1$", fontsize=10)
x3 = np.linspace(0, 2.5, 600)
env = 8 * math.sqrt(5) / 5 * np.exp(2 * x3)
axs[2].plot(x3, y2(x3), color=C[2], lw=1.8)
axs[2].plot(x3, env, color=INK, lw=0.8, ls="--")
axs[2].plot(x3, -env, color=INK, lw=0.8, ls="--")
axs[2].set_ylim(-260, 260)
axs[2].set_title(r"복소근 $2 \pm j\sqrt{5}$", fontsize=10)
x4 = np.linspace(0, 8, 600)
axs[3].plot(x4, y_damp(x4), color=C[3], lw=1.8)
axs[3].plot(x4, np.exp(-0.5 * x4), color=INK, lw=0.8, ls="--")
axs[3].plot(x4, -np.exp(-0.5 * x4), color=INK, lw=0.8, ls="--")
axs[3].set_title(r"복소근 $-0.5 \pm j3$", fontsize=10)
for ax in axs:
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    h = 1e-4
    # 예 1: y(0) = 0, y'(0) = -7, 식 y'' + 11y' + 24y = 0
    assert abs(y1(0.0)) < 1e-12 and abs((y1(h) - y1(-h)) / (2 * h) + 7) < 1e-5
    for xv in (0.1, 0.5, 1.0):
        d1 = (y1(xv + h) - y1(xv - h)) / (2 * h); d2 = (y1(xv + h) - 2 * y1(xv) + y1(xv - h)) / h ** 2
        assert abs(d2 + 11 * d1 + 24 * y1(xv)) < 1e-4
    # 예 2: y(0) = 0, y'(0) = -8, 식 y'' - 4y' + 9y = 0
    assert abs(y2(0.0)) < 1e-12 and abs((y2(h) - y2(-h)) / (2 * h) + 8) < 1e-5
    for xv in (0.3, 1.0):
        d1 = (y2(xv + h) - y2(xv - h)) / (2 * h); d2 = (y2(xv + h) - 2 * y2(xv) + y2(xv - h)) / h ** 2
        assert abs(d2 - 4 * d1 + 9 * y2(xv)) / abs(y2(xv)) < 1e-4
    # 중근: x e^x가 y'' - 2y' + y = 0을 만족
    for xv in (0.5, 1.0):
        d1 = (y_rep(xv + h) - y_rep(xv - h)) / (2 * h); d2 = (y_rep(xv + h) - 2 * y_rep(xv) + y_rep(xv - h)) / h ** 2
        assert abs(d2 - 2 * d1 + y_rep(xv)) < 1e-4
    # 감쇠 예: y'' + y' + 9.25y = 0
    for xv in (0.4, 2.0):
        d1 = (y_damp(xv + h) - y_damp(xv - h)) / (2 * h); d2 = (y_damp(xv + h) - 2 * y_damp(xv) + y_damp(xv - h)) / h ** 2
        assert abs(d2 + d1 + 9.25 * y_damp(xv)) < 1e-4
    print("ALL CHECKS PASSED")
```
{% endraw %}
