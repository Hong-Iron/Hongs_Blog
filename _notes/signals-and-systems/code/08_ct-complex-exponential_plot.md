---
layout: "note"
title: "08_ct-complex-exponential_plot.py"
display_title: "08_ct-complex-exponential_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "08"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/ct-complex-exponential/"
parent_title: "연속 시간 복소 지수 신호"
description: "신호 및 시스템 · 연속 시간 복소 지수 신호 코드 코드"
permalink: "/studies/signals-and-systems/code/08_ct-complex-exponential_plot/"
---
{% raw %}
[연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속 시간 복소 지수 신호 문서의 그림을 만든다: 08_ct-complex-exponential_fig1.svg, 08_ct-complex-exponential_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 08_ct-complex-exponential_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "08_ct-complex-exponential"
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


def gen(t, r, w0=3.0, theta=0.0):  # C e^{at}, |C| = 1, a = r + jω0
    return np.exp((r + 1j * w0) * t + 1j * theta)


# 그림 1: Ce^{at}의 실수부. r > 0이면 커지고, r < 0이면 줄어드는 정현파. 점선은 포락선 ±e^{rt}
t = np.linspace(0, 10, 1500)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.8))
for ax, r, col in zip(axs, [0.2, -0.3], [C[1], C[0]]):
    ax.plot(t, gen(t, r).real, color=col, lw=1.6)
    ax.plot(t, np.exp(r * t), color=INK, lw=0.9, ls="--")
    ax.plot(t, -np.exp(r * t), color=INK, lw=0.9, ls="--")
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xlabel("$t$")
    ax.set_title(f"$r = {r}$", fontsize=10)
axs[0].set_ylabel(r"$\mathrm{Re}\{e^{(r + j3)t}\}$")
fig.tight_layout()
save(fig, 1)


def x15(t):  # 예제 1.5
    return np.exp(2j * t) + np.exp(3j * t)


# 그림 2: 예제 1.5의 x(t) = e^{j2t} + e^{j3t}. 실수부와 크기 |x(t)| = 2|cos 0.5t|
t = np.linspace(0, 4 * np.pi, 2000)
fig, ax = plt.subplots(figsize=(6.5, 3))
ax.plot(t, x15(t).real, color=C[0], lw=1.3, label=r"$\mathrm{Re}\{x(t)\}$")
ax.plot(t, np.abs(x15(t)), color=C[1], lw=2, label=r"$|x(t)|$")
ax.plot(t, 2 * np.cos(0.5 * t), color=INK, lw=0.9, ls="--", label=r"$2\cos 0.5t$")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xticks([0, np.pi, 2 * np.pi, 3 * np.pi, 4 * np.pi])
ax.set_xticklabels(["0", r"$\pi$", r"$2\pi$", r"$3\pi$", r"$4\pi$"])
ax.set_xlabel("$t$")
ax.set_ylim(-2.3, 3.2)
ax.legend(loc="upper center", ncol=3)
save(fig, 2)

if __name__ == "__main__":
    # 예제 1.5: x = 2 e^{j2.5t} cos(0.5t), |x|의 주기 2π, 2cos(0.5t)의 주기 4π
    tt = np.linspace(0, 20, 1001)
    assert np.allclose(x15(tt), 2 * np.exp(2.5j * tt) * np.cos(0.5 * tt))
    assert np.allclose(np.abs(x15(tt + 2 * np.pi)), np.abs(x15(tt)))
    assert np.allclose(2 * np.cos(0.5 * (tt + 4 * np.pi)), 2 * np.cos(0.5 * tt))
    assert not np.allclose(2 * np.cos(0.5 * (tt + 2 * np.pi)), 2 * np.cos(0.5 * tt))
    # 실수부가 포락선 안에 있다
    assert np.all(np.abs(gen(tt, -0.3).real) <= np.exp(-0.3 * tt) + 1e-12)
    print("ALL CHECKS PASSED")
```
{% endraw %}
