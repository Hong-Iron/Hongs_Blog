---
layout: "note"
title: "39_periodic-fourier-transform_plot.py"
display_title: "39_periodic-fourier-transform_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "39"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/periodic-fourier-transform/"
parent_title: "주기 신호의 푸리에 변환"
description: "신호 및 시스템 · 주기 신호의 푸리에 변환 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/39_periodic-fourier-transform_plot/"
---
{% raw %}
[주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주기 신호의 푸리에 변환 문서의 그림을 만든다: 39_periodic-fourier-transform_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 39_periodic-fourier-transform_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "39_periodic-fourier-transform"
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


T1, T = 1.0, 4.0
w0 = 2 * np.pi / T


def area(k):  # 예제 4.6: k번째 임펄스의 넓이 2 sin(kω0T1)/k, k = 0이면 2ω0T1 = π
    k = np.asarray(k, dtype=float)
    return np.where(k == 0, 2 * w0 * T1, 2 * np.sin(k * w0 * T1) / np.where(k == 0, 1, k))


# 그림 1: 주기 사각파 (T = 4T1)의 푸리에 변환. 고조파 자리에 임펄스가 서고,
# 넓이는 펄스 하나의 변환 2sin(ωT1)/ω에 ω0를 곱한 곡선 위에 있다
k = np.arange(-8, 9)
w = np.linspace(-8.5 * w0, 8.5 * w0, 2000)
env = w0 * np.where(w == 0, 2 * T1, 2 * np.sin(w * T1) / np.where(w == 0, 1, w))
fig, ax = plt.subplots(figsize=(6.5, 3.2))
ax.plot(w, env, color=INK, lw=0.9, ls="--", label=r"$\omega_0 \cdot \frac{2\sin\omega T_1}{\omega}$")
for kk, ar in zip(k, area(k)):
    if abs(ar) > 1e-12:
        ax.annotate("", xy=(kk * w0, ar), xytext=(kk * w0, 0), arrowprops=dict(arrowstyle="-|>", color=C[0], lw=1.6))
for kk in (0, 1, 3):
    ax.text(kk * w0 + 0.2, area(kk) + (0.12 if area(kk) > 0 else -0.05), {0: r"$\pi$", 1: "2", 3: r"$-\frac{2}{3}$"}[kk], color=C[0], fontsize=10, va="bottom" if area(kk) > 0 else "top")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xticks([-4 * w0, -2 * w0, 0, 2 * w0, 4 * w0])
ax.set_xticklabels([r"$-4\omega_0$", r"$-2\omega_0$", "0", r"$2\omega_0$", r"$4\omega_0$"])
ax.set_xlabel(r"$\omega$  ($\omega_0 = \pi/2$)")
ax.set_ylim(-1.35, 3.7)
ax.legend(loc="upper right", fontsize=11)
save(fig, 1)

if __name__ == "__main__":
    # 넓이 π, 2, 0, -2/3 = 2π a_k, 그리고 합성식으로 사각파가 되돌아온다 (t = 0에서 1, t = 1.5에서 0)
    assert np.allclose(area([0, 1, 2, 3]), [np.pi, 2, 0, -2 / 3])
    ak = lambda kk: np.where(kk == 0, 0.5, np.sin(kk * np.pi / 2) / (np.pi * np.where(kk == 0, 1, kk)))
    assert np.allclose(area(k), 2 * np.pi * ak(k))
    kk = np.arange(-4000, 4001)
    for tv, ref in [(0.0, 1.0), (1.5, 0.0)]:
        assert abs(np.sum(ak(kk) * np.cos(kk * w0 * tv)) - ref) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
