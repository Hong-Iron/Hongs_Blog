---
layout: "note"
title: "42_convolution-property_plot.py"
display_title: "42_convolution-property_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "42"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/convolution-property/"
parent_title: "컨벌루션 성질과 주파수 응답"
description: "신호 및 시스템 · 컨벌루션 성질과 주파수 응답 코드 코드"
permalink: "/studies/signals-and-systems/code/42_convolution-property_plot/"
---
{% raw %}
[컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 컨벌루션 성질과 주파수 응답 문서의 그림을 만든다: 42_convolution-property_fig1.svg, 42_convolution-property_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 42_convolution-property_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "42_convolution-property"
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


a, b = 1.0, 2.0
t = np.linspace(-0.5, 6, 1300)
u = (t >= 0).astype(float)
x = np.exp(-b * t) * u
h = np.exp(-a * t) * u
y = (np.exp(-a * t) - np.exp(-b * t)) / (b - a) * u
w = np.linspace(-8, 8, 1000)
X = 1 / (b + 1j * w)
H = 1 / (a + 1j * w)

# 그림 1: 예제 4.19 (a = 1, b = 2). 시간에서는 컨벌루션, 주파수에서는 크기끼리 곱
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9))
axs[0].plot(t, x, color=C[0], lw=1.6, label="$x(t) = e^{-2t}u(t)$")
axs[0].plot(t, h, color=C[1], lw=1.6, label="$h(t) = e^{-t}u(t)$")
axs[0].plot(t, y, color=C[2], lw=2.0, label="$y = x * h$")
axs[0].set_xlabel("$t$")
axs[0].legend(loc="upper right", fontsize=8.5)
axs[0].set_ylim(-0.05, 1.25)
axs[1].plot(w, np.abs(X), color=C[0], lw=1.6, label=r"$|X|$")
axs[1].plot(w, np.abs(H), color=C[1], lw=1.6, label=r"$|H|$")
axs[1].plot(w, np.abs(X * H), color=C[2], lw=2.0, label=r"$|Y| = |H||X|$")
axs[1].set_xlabel(r"$\omega$")
axs[1].legend(loc="upper right", fontsize=8.5)
axs[1].set_ylim(0, 1.25)
fig.tight_layout()
save(fig, 1)


# 그림 2: 이상적 저역 통과(ωc = 3)의 h(t) = sin(3t)/πt는 t < 0에서도 0이 아니다. RC 필터 e^{-t}u(t)는 인과적
def h_ideal(t, wc=3.0):
    return np.where(t == 0, wc / np.pi, np.sin(wc * t) / (np.pi * np.where(t == 0, 1, t)))


t = np.linspace(-6, 6, 2401)
fig, ax = plt.subplots(figsize=(6.5, 3))
ax.axvspan(-6, 0, color=C[1], alpha=0.06)
ax.plot(t, h_ideal(t), color=C[1], lw=1.7, label=r"이상적 저역 통과 $\frac{\sin 3t}{\pi t}$")
ax.plot(t, np.exp(-t) * (t >= 0), color=C[0], lw=1.7, label="RC 필터 $e^{-t}u(t)$")
ax.plot([-0.4], [h_ideal(np.array(-0.4))], "o", color=C[1], ms=5)
ax.text(-0.75, h_ideal(np.array(-0.4)) + 0.12, "$t = -0.4$에서 약 0.74", ha="right", fontsize=9)
ax.text(-5.8, -0.3, "$t < 0$", fontsize=10)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$t$")
ax.set_ylim(-0.35, 1.35)
ax.legend(loc="upper right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 수치 컨벌루션 = (e^{-t} - e^{-2t}) u(t), |Y| = |H||X|, 이상적 필터 h(-0.4) ≈ 0.74
    dt = 1e-4; tt = np.arange(0, 6, dt)
    yn = np.convolve(np.exp(-b * tt), np.exp(-a * tt))[:len(tt)] * dt
    for tv in (0.5, 1.0, 3.0):
        k = int(tv / dt)
        assert abs(yn[k] - (math.exp(-a * tv) - math.exp(-b * tv))) < 1e-3
    assert np.allclose(np.abs(X * H), np.abs(X) * np.abs(H))
    assert abs(h_ideal(np.array(-0.4)) - 0.74) < 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
