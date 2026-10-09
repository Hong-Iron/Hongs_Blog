---
layout: "note"
title: "18_convolution-sum_plot.py"
display_title: "18_convolution-sum_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/convolution-sum/"
parent_title: "컨벌루션 합"
description: "신호 및 시스템 · 컨벌루션 합 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/18_convolution-sum_plot/"
---
{% raw %}
[컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 컨벌루션 합 문서의 그림을 만든다: 18_convolution-sum_fig1.svg, 18_convolution-sum_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_convolution-sum_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_convolution-sum"
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


def conv(x, h):  # 0에서 시작하는 두 유한 수열의 컨벌루션 합
    y = [0.0] * (len(x) + len(h) - 1)
    for i, a in enumerate(x):
        for j, b in enumerate(h):
            y[i + j] += a * b
    return np.array(y)


# 그림 1: 예제 2.1. 입력 조각마다 옮기고 키운 임펄스 응답, 그리고 그 합
n = np.arange(-1, 6)
h = np.array([1.0, 1.0, 1.0])
x = np.array([0.5, 2.0])
part0 = np.array([0, 0.5, 0.5, 0.5, 0, 0, 0])
part1 = np.array([0, 0, 2, 2, 2, 0, 0])
y = part0 + part1
fig, axs = plt.subplots(3, 1, figsize=(5.6, 4.4), sharex=True)
for i, (ax, v, lab) in enumerate(zip(axs, [part0, part1, y], ["$0.5\\,h[n]$", "$2\\,h[n-1]$", "$y[n]$"])):
    stem(ax, n, v, C[i])
    ax.set_ylabel(lab, rotation=0, ha="right", va="center")
    ax.set_ylim(-0.2, 3)
    for nn, vv in zip(n, v):
        if vv:
            ax.text(nn + 0.12, vv + 0.15, f"{vv:g}", fontsize=9, color=C[i])
axs[2].set_xlabel("$n$")
axs[2].set_xticks(n)
fig.tight_layout()
save(fig, 1)

# 그림 2: 예제 2.4 (α = 1.2). h[n-k]를 뒤집어 밀면서 x[k]와 겹치는 부분을 더한다
alpha = 1.2
xk = np.ones(5)                    # 0 ≤ k ≤ 4
hk = alpha ** np.arange(7)          # 0 ≤ k ≤ 6
y24 = conv(xk, hk)                  # n = 0 … 10
k = np.arange(-7, 13)
fig, axs = plt.subplots(4, 1, figsize=(6.2, 6), sharex=True)
for row, nsel in enumerate([2, 5, 8]):
    ax = axs[row]
    xv = np.where((k >= 0) & (k <= 4), 1.0, 0.0)
    hv = np.where((nsel - k >= 0) & (nsel - k <= 6), alpha ** (nsel - k), 0.0)
    stem(ax, k[xv != 0], xv[xv != 0], C[0], ms=4)
    stem(ax, k[hv != 0] + 0.18, hv[hv != 0], C[1], ms=4)
    ax.axvspan(max(0, nsel - 6) - 0.4, min(4, nsel) + 0.5, color=C[2], alpha=0.10)
    ax.set_ylim(-0.2, 3.3)
    ax.text(12.6, 1.5, f"$n = {nsel}$", fontsize=10, va="center")
axs[0].plot([], [], "o", color=C[0], label="$x[k]$")
axs[0].plot([], [], "o", color=C[1], label="$h[n-k]$")
axs[0].legend(loc="upper right", ncol=2, fontsize=9)
stem(axs[3], np.arange(11), y24, C[3], ms=4)
for nsel in (2, 5, 8):
    axs[3].plot([nsel], [y24[nsel]], "o", ms=9, mfc="none", color=C[2])
axs[3].text(12.6, y24.max() / 2, "$y[n]$", fontsize=10, va="center")
axs[3].set_xlabel("$k$ (위 세 줄),  $n$ (맨 아래)")
axs[3].set_xticks(range(-6, 13, 2))
fig.tight_layout()
save(fig, 2)


def closed(nv):  # 예제 2.4의 다섯 구간 닫힌 꼴
    a = alpha
    if nv < 0 or nv > 10:
        return 0.0
    if nv <= 4:
        return (1 - a ** (nv + 1)) / (1 - a)
    if nv <= 6:
        return (a ** (nv - 4) - a ** (nv + 1)) / (1 - a)
    return (a ** (nv - 4) - a ** 7) / (1 - a)


if __name__ == "__main__":
    # 예제 2.1: 0.5, 2.5, 2.5, 2. 예제 2.4: 겹친 곱의 합 = 닫힌 꼴
    assert np.allclose(conv(x, h), [0.5, 2.5, 2.5, 2.0]) and np.allclose(y[1:5], [0.5, 2.5, 2.5, 2.0])
    assert all(abs(y24[m] - closed(m)) < 1e-9 for m in range(11))
    for nsel in (2, 5, 8):
        hv = np.where((nsel - k >= 0) & (nsel - k <= 6), alpha ** (nsel - k), 0.0)
        xv = np.where((k >= 0) & (k <= 4), 1.0, 0.0)
        assert abs(np.sum(xv * hv) - y24[nsel]) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
