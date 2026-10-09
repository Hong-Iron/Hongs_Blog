---
layout: "note"
title: "40_fourier-transform-properties_plot.py"
display_title: "40_fourier-transform-properties_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "40"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/fourier-transform-properties/"
parent_title: "푸리에 변환의 성질"
description: "신호 및 시스템 · 푸리에 변환의 성질 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/40_fourier-transform-properties_plot/"
---
{% raw %}
[푸리에 변환의 성질](/Hongs_Blog/studies/signals-and-systems/fourier-transform-properties/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 변환의 성질 문서의 그림을 만든다: 40_fourier-transform-properties_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 40_fourier-transform-properties_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "40_fourier-transform-properties"
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


def rect(t, T1):
    return (np.abs(t) < T1).astype(float)


def Xrect(w, T1):  # 2 sin(ωT1)/ω, ω = 0이면 2T1
    return np.where(w == 0, 2 * T1, 2 * np.sin(w * T1) / np.where(w == 0, 1, w))


# 그림 1: x(t) (|t| < 1)와 두 배 빨리 감은 x(2t). 시간 폭이 반이 되면 스펙트럼은 두 배 넓어지고 높이는 반이 된다
t = np.linspace(-2, 2, 2001)
w = np.linspace(-15, 15, 2000)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9), gridspec_kw={"width_ratios": [1, 1.5]})
axs[0].plot(t, rect(t, 1), color=C[0], lw=1.8, label="$x(t)$")
axs[0].plot(t, rect(2 * t, 1), color=C[1], lw=1.8, ls="--", label="$x(2t)$")
axs[0].set_xlabel("$t$")
axs[0].set_ylim(-0.05, 1.45)
axs[0].legend(loc="upper left", fontsize=9, ncol=2, handlelength=1.2)
axs[1].plot(w, Xrect(w, 1), color=C[0], lw=1.8, label=r"$X(j\omega)$")
axs[1].plot(w, 0.5 * Xrect(w / 2, 1), color=C[1], lw=1.8, ls="--", label=r"$\frac{1}{2}X(\frac{j\omega}{2})$")
axs[1].axhline(0, color=INK, lw=0.6)
axs[1].set_xlabel(r"$\omega$")
axs[1].legend(loc="upper right", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # x(2t)의 변환을 수치 적분으로 구하면 (1/2)X(jω/2)와 같다. 첫 영점이 π에서 2π로 옮겨 간다
    tt = np.linspace(-1, 1, 200001); d = tt[1] - tt[0]
    for wv in (0.5, 2.0, 5.0):
        num = np.sum(rect(2 * tt, 1)[:-1] * np.cos(wv * tt[:-1])) * d
        assert abs(num - 0.5 * Xrect(np.array(wv / 2), 1)) < 1e-3
    assert abs(Xrect(np.array(np.pi), 1)) < 1e-12 and abs(0.5 * Xrect(np.array(np.pi), 1)) < 1e-12
    assert abs(0.5 * Xrect(np.array(2 * np.pi / 2), 1)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
