---
layout: "note"
title: "33_dt-fourier-series_plot.py"
display_title: "33_dt-fourier-series_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "33"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/dt-fourier-series/"
parent_title: "이산 시간 푸리에 급수"
description: "신호 및 시스템 · 이산 시간 푸리에 급수 코드 코드"
permalink: "/studies/signals-and-systems/code/33_dt-fourier-series_plot/"
---
{% raw %}
[이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 시간 푸리에 급수 문서의 그림을 만든다: 33_dt-fourier-series_fig1.svg, 33_dt-fourier-series_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 33_dt-fourier-series_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "33_dt-fourier-series"
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


def dtfs(x):  # 한 주기 x[0..N-1]의 계수 a_k (k = 0..N-1)
    N = len(x)
    n = np.arange(N)
    return np.array([np.sum(x * np.exp(-1j * k * 2 * np.pi / N * n)) / N for k in range(N)])


def square(N, N1):  # 한 주기 n = 0..N-1에서 -N1 ≤ n ≤ N1 (주기적으로)이면 1
    n = np.arange(N)
    return ((n <= N1) | (n >= N - N1)).astype(float)


# 그림 2: 이산 구형파 (N = 10, 2N1+1 = 5)와 그 계수. 계수도 N마다 똑같이 되풀이된다
N, N1 = 10, 2
n = np.arange(-15, 16)
xs = square(N, N1)[n % N]
a = dtfs(square(N, N1)).real
k = np.arange(-15, 16)
fig, axs = plt.subplots(2, 1, figsize=(6.2, 3.8))
stem(axs[0], n, xs, C[0], ms=4)
axs[0].set_ylabel("$x[n]$", rotation=0, ha="right")
axs[0].set_xlabel("$n$")
axs[0].set_ylim(-0.2, 1.3)
stem(axs[1], k, a[k % N], C[1], ms=4)
axs[1].axvspan(-0.5, 9.5, color=C[2], alpha=0.10)
axs[1].text(4.5, 0.62, "한 주기 ($N = 10$개)", ha="center", fontsize=9)
axs[1].set_ylabel("$a_k$", rotation=0, ha="right")
axs[1].set_xlabel("$k$")
axs[1].set_ylim(-0.25, 0.75)
fig.tight_layout()
save(fig, 2)

# 그림 1: N = 9 구형파 (N1 = 1)의 부분합. 항이 9개가 되는 M = 4에서 원래 수열과 똑같다
N, N1 = 9, 1
x9 = square(N, N1)
a9 = dtfs(x9)
n = np.arange(-9, 10)


def partial(M):
    return np.array([sum(a9[kk % N] * np.exp(1j * kk * 2 * np.pi / N * nn) for kk in range(-M, M + 1)) for nn in n]).real


fig, axs = plt.subplots(4, 1, figsize=(6, 5), sharex=True)
for i, (ax, M) in enumerate(zip(axs, [1, 2, 3, 4])):
    ax.plot(n, x9[n % N], "_", color=INK, ms=12, mew=1.5)
    stem(ax, n, partial(M), C[i], ms=4)
    ax.set_ylim(-0.4, 1.3)
    ax.set_yticks([0, 1])
    ax.text(10, 0.5, f"$M = {M}$", fontsize=10, va="center")
axs[3].set_xlabel("$n$")
axs[3].set_xticks(range(-9, 10, 3))
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # N = 10: a0 = 1/2, a1 = 0.3236, a2 = 0, a3 = -0.1236, a_{k+N} = a_k
    a10 = dtfs(square(10, 2))
    assert np.allclose(a10[[0, 1, 2, 3, 4]], [0.5, 0.32361, 0, -0.12361, 0], atol=1e-5)
    # 닫힌 꼴 (1/N) sin(2πk(N1 + 1/2)/N) / sin(πk/N)
    for kk in range(1, 10):
        assert abs(a10[kk] - np.sin(2 * np.pi * kk * 2.5 / 10) / np.sin(np.pi * kk / 10) / 10) < 1e-12
    # N = 9: a_3 = 0이라 M = 3은 M = 2와 같다. M = 4이면 정확히 같고, M = 3이면 다르다
    assert abs(a9[3]) < 1e-12 and np.allclose(partial(3), partial(2))
    assert np.allclose(partial(4), x9[n % 9]) and not np.allclose(partial(3), x9[n % 9])
    print("ALL CHECKS PASSED")
```
{% endraw %}
