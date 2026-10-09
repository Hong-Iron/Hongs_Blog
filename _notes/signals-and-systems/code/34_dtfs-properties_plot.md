---
layout: "note"
title: "34_dtfs-properties_plot.py"
display_title: "34_dtfs-properties_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "34"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/dtfs-properties/"
parent_title: "이산 시간 푸리에 급수의 성질"
description: "신호 및 시스템 · 이산 시간 푸리에 급수의 성질 코드 코드"
permalink: "/studies/signals-and-systems/code/34_dtfs-properties_plot/"
---
{% raw %}
[이산 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/dtfs-properties/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 시간 푸리에 급수의 성질 문서의 그림을 만든다: 34_dtfs-properties_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 34_dtfs-properties_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "34_dtfs-properties"
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


# 그림 1: 예제 3.15. 구형파 (N1 = 1, N = 7)와 자기 자신의 주기 컨벌루션 w[n]은 7마다 반복되는 삼각형
N = 7
n = np.arange(-10, 11)
x = (np.minimum(n % N, N - n % N) <= 1).astype(float)


def pconv(x1, x2):  # 한 주기 배열의 주기 컨벌루션
    L = len(x1)
    return np.array([sum(x1[r] * x2[(m - r) % L] for r in range(L)) for m in range(L)])


xp = x[(n >= 0) & (n < N)]
w = pconv(xp, xp)[n % N]
fig, axs = plt.subplots(2, 1, figsize=(6, 3.6), sharex=True)
stem(axs[0], n, x, C[0], ms=4)
axs[0].set_ylabel("$x[n]$", rotation=0, ha="right")
axs[0].set_ylim(-0.2, 1.4)
stem(axs[1], n, w, C[1], ms=4)
axs[1].set_ylabel("$w[n]$", rotation=0, ha="right")
axs[1].set_ylim(-0.3, 3.6)
axs[1].set_xlabel("$n$")
axs[1].set_xticks(range(-10, 11, 2))
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # w[0] = 3, w[±1] = 2, w[±2] = 1, w[±3] = 0. 계수 c_k = 7 d_k²
    vals = dict(zip(n, w))
    assert [vals[0], vals[1], vals[-1], vals[2], vals[-2], vals[3], vals[-3]] == [3, 2, 2, 1, 1, 0, 0]
    kk = np.arange(N); nn = np.arange(N)
    d = np.array([np.sum(xp * np.exp(-2j * np.pi * k * nn / N)) / N for k in kk])
    c = np.array([np.sum(pconv(xp, xp) * np.exp(-2j * np.pi * k * nn / N)) / N for k in kk])
    assert np.allclose(c, N * d ** 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
