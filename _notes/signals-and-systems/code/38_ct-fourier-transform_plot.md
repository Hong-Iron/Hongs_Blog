---
layout: "note"
title: "38_ct-fourier-transform_plot.py"
display_title: "38_ct-fourier-transform_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "38"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/ct-fourier-transform/"
parent_title: "연속 시간 푸리에 변환"
description: "신호 및 시스템 · 연속 시간 푸리에 변환 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/38_ct-fourier-transform_plot/"
---
{% raw %}
[연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속 시간 푸리에 변환 문서의 그림을 만든다: 38_ct-fourier-transform_fig1.svg, 38_ct-fourier-transform_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 38_ct-fourier-transform_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "38_ct-fourier-transform"
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


a = 1.0
w = np.linspace(-6, 6, 1000)
X = 1 / (a + 1j * w)

# 그림 1: 예제 4.1 (a = 1)의 크기와 위상. ω = ±a에서 크기 √2/(2a), 위상 ∓π/4
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9))
axs[0].plot(w, np.abs(X), color=C[0], lw=1.8)
axs[0].plot([-a, a], [math.sqrt(2) / (2 * a)] * 2, "o", color=C[0], ms=5)
axs[0].set_title(r"$|X(j\omega)| = 1/\sqrt{1 + \omega^2}$", fontsize=10)
axs[0].set_ylim(0, 1.1)
axs[1].plot(w, np.angle(X), color=C[1], lw=1.8)
axs[1].plot([-a, a], [np.pi / 4, -np.pi / 4], "o", color=C[1], ms=5)
axs[1].set_yticks([-np.pi / 2, -np.pi / 4, 0, np.pi / 4, np.pi / 2])
axs[1].set_yticklabels([r"$-\pi/2$", r"$-\pi/4$", "0", r"$\pi/4$", r"$\pi/2$"])
axs[1].axhline(0, color=INK, lw=0.6)
axs[1].set_title(r"$\angle X(j\omega) = -\tan^{-1}\omega$", fontsize=10)
for ax in axs:
    ax.set_xlabel(r"$\omega$")
fig.tight_layout()
save(fig, 1)


# 그림 2: 예제 4.5. 주파수에서 폭 2W인 사각형의 역변환 sin(Wt)/(πt). W가 크면 꼭대기가 높고 폭이 좁다
def sincw(t, W):
    return np.where(t == 0, W / np.pi, np.sin(W * t) / (np.pi * np.where(t == 0, 1, t)))


t = np.linspace(-6, 6, 2401)
ww = np.linspace(-5, 5, 1000)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9), gridspec_kw={"width_ratios": [1, 1.4]})
for i, W in enumerate([1, 2, 4]):
    axs[0].plot(ww, np.where(np.abs(ww) < W, 1.0, 0.0), color=C[i], lw=1.6, label=f"$W = {W}$")
    axs[0].fill_between(ww, 0, np.where(np.abs(ww) < W, 1.0, 0.0), color=C[i], alpha=0.10)
    axs[1].plot(t, sincw(t, W), color=C[i], lw=1.6)
axs[0].set_title(r"$X(j\omega)$", fontsize=10)
axs[0].set_xlabel(r"$\omega$")
axs[0].set_ylim(-0.05, 1.5)
axs[0].legend(loc="upper left", fontsize=9, ncol=3, handlelength=1, columnspacing=0.8)
axs[1].set_title(r"$x(t) = \sin(Wt) / \pi t$", fontsize=10)
axs[1].axhline(0, color=INK, lw=0.6)
axs[1].set_xlabel("$t$")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 예제 4.1의 수치 적분, ω = ±1에서 크기와 위상, 예제 4.5의 x(0) = W/π와 합성식 수치 적분
    tt = np.linspace(0, 40, 400001); d = tt[1] - tt[0]
    for wv in (0.0, 1.0, 3.0):
        num = np.sum(np.exp(-tt) * np.exp(-1j * wv * tt)) * d
        assert abs(num - 1 / (1 + 1j * wv)) < 1e-3
    assert abs(abs(1 / (1 + 1j)) - math.sqrt(2) / 2) < 1e-12 and abs(np.angle(1 / (1 + 1j)) + math.pi / 4) < 1e-12
    for W in (1, 2, 4):
        om = np.linspace(-W, W, 200001)
        for tv in (0.0, 0.7):
            num = np.sum(np.exp(1j * om * tv)).real * (om[1] - om[0]) / (2 * np.pi)
            assert abs(num - sincw(np.array(tv), W)) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
