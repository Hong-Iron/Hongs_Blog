---
layout: "note"
title: "30_ct-fourier-series_plot.py"
display_title: "30_ct-fourier-series_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "30"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/ct-fourier-series/"
parent_title: "연속 시간 푸리에 급수"
description: "신호 및 시스템 · 연속 시간 푸리에 급수 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/30_ct-fourier-series_plot/"
---
{% raw %}
[연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속 시간 푸리에 급수 문서의 그림을 만든다: 30_ct-fourier-series_fig1.svg, 30_ct-fourier-series_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 30_ct-fourier-series_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "30_ct-fourier-series"
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


# 그림 1: 예제 3.2. 상수 1에 ½cos2πt, cos4πt, ⅔cos6πt를 차례로 더해 간다
t = np.linspace(-1.5, 1.5, 1500)
terms = [np.ones_like(t), 0.5 * np.cos(2 * np.pi * t), np.cos(4 * np.pi * t), 2 / 3 * np.cos(6 * np.pi * t)]
labels = ["$1$", r"$+\frac{1}{2}\cos 2\pi t$", r"$+\cos 4\pi t$", r"$+\frac{2}{3}\cos 6\pi t$"]
fig, axs = plt.subplots(4, 1, figsize=(6, 5.2), sharex=True)
acc = np.zeros_like(t)
for i, (ax, term, lab) in enumerate(zip(axs, terms, labels)):
    prev = acc.copy()
    acc = acc + term
    if i > 0:
        ax.plot(t, prev, color=INK, lw=0.9, ls="--")
    ax.plot(t, acc, color=C[i], lw=1.8)
    ax.axhline(0, color=INK, lw=0.5)
    ax.set_ylim(-1.2, 3.4)
    ax.set_yticks([0, 1, 2, 3])
    ax.text(1.58, 1.0, lab, fontsize=11, va="center")
axs[3].set_xlabel("$t$")
fig.tight_layout()
save(fig, 1)


def ak(k, T1, T):  # 예제 3.5 사각파의 계수
    w0 = 2 * np.pi / T
    k = np.asarray(k, dtype=float)
    return np.where(k == 0, 2 * T1 / T, np.sin(k * w0 * T1) / (np.pi * np.where(k == 0, 1, k)))


# 그림 2: 사각파의 T·a_k는 같은 포락선 2sin(ωT1)/ω를 ω = kω0에서 찍은 값이다. T가 길수록 촘촘하다
T1 = 1.0
w = np.linspace(-3 * np.pi, 3 * np.pi, 2000)
env = np.where(w == 0, 2 * T1, 2 * np.sin(w * T1) / np.where(w == 0, 1, w))
fig, axs = plt.subplots(3, 1, figsize=(6, 4.8), sharex=True)
for i, (ax, T) in enumerate(zip(axs, [4, 8, 16])):
    w0 = 2 * np.pi / T
    k = np.arange(-int(3 * np.pi / w0), int(3 * np.pi / w0) + 1)
    ax.plot(w, env, color=INK, lw=0.9, ls="--")
    stem(ax, k * w0, T * ak(k, T1, T), C[i], ms=3.5)
    ax.text(3 * np.pi + 0.4, 1.0, f"$T = {T}T_1$", fontsize=10, va="center")
    ax.set_ylim(-0.6, 2.3)
axs[2].set_xticks([-3 * np.pi, -2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi, 3 * np.pi])
axs[2].set_xticklabels([r"$-3\pi$", r"$-2\pi$", r"$-\pi$", "0", r"$\pi$", r"$2\pi$", r"$3\pi$"])
axs[2].set_xlabel(r"$\omega$ ($T_1 = 1$)")
axs[1].set_ylabel("$Ta_k$")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 예제 3.2: x(0) = 1 + 1/2 + 1 + 2/3. 예제 3.5 (T = 4T1): a0 = 1/2, a1 = 1/π, a3 = -1/(3π). 분석식 수치 적분과 비교
    assert abs(acc[np.argmin(np.abs(t))] - (1 + 0.5 + 1 + 2 / 3)) < 1e-3
    tt = np.linspace(-2, 2, 400001)[:-1]
    sq = (np.abs(tt) < 1).astype(float)
    for k, ref in [(0, 0.5), (1, 1 / np.pi), (3, -1 / (3 * np.pi))]:
        num = np.mean(sq * np.exp(-1j * k * (np.pi / 2) * tt))
        assert abs(num - ref) < 1e-4 and abs(ak(k, 1.0, 4) - ref) < 1e-12
    assert abs(ak(1, 1.0, 8) - np.sqrt(2) / (2 * np.pi)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
