---
layout: "note"
title: "30_fourier-series_plot.py"
display_title: "30_fourier-series_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "30"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/fourier-series/"
parent_title: "푸리에 급수"
description: "미분적분학 · 푸리에 급수 그림 생성 코드"
permalink: "/studies/calculus/code/30_fourier-series_plot/"
---
{% raw %}
[푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 급수 문서의 그림을 만든다: 30_fourier-series_fig1.svg, 30_fourier-series_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 30_fourier-series_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "30_fourier-series"
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


def partial_square(x, N):
    # 사각파 급수를 차수 N까지(홀수 k ≤ N) 더한 부분합
    x = np.asarray(x, float)
    return 4 / np.pi * sum(np.sin(k * x) / k for k in range(1, N + 1, 2))


def square(x):
    return np.sign(np.sin(x))


# 그림 1: 사각파와 부분합. 항을 늘리면 꼭대기가 평평해지고 모서리 옆에 뿔이 남는다
x = np.linspace(-np.pi, np.pi, 2000)
fig, ax = plt.subplots(figsize=(6.5, 3.2))
ax.plot(x, square(x), color=INK, lw=2.4, label="사각파")
for i, N in enumerate([1, 3, 51]):
    nterm = (N + 1) // 2
    ax.plot(x, partial_square(x, N), color=C[i], lw=1.3, label=f"홀수 항 {nterm}개 ($k \\leq {N}$)")
ax.axhline(0, color=INK, lw=0.5)
ax.set_xticks([-np.pi, -np.pi / 2, 0, np.pi / 2, np.pi])
ax.set_xticklabels([r"$-\pi$", r"$-\pi/2$", "0", r"$\pi/2$", r"$\pi$"])
ax.set_ylim(-1.5, 1.6)
ax.set_xlabel("$x$")
ax.legend(loc="lower center", bbox_to_anchor=(0.5, 1.0), fontsize=8, ncol=4)
save(fig, 1)

# 그림 2: 뛰는 점 x = 0 바로 오른쪽을 확대. 차수를 올려도 봉우리 높이는 약 1.179 그대로, 폭만 좁아진다
GIBBS = 2 / math.pi * sum(math.sin(t) / t * (math.pi / 100000) for t in [(i + 0.5) * math.pi / 100000 for i in range(100000)])
fig, ax = plt.subplots(figsize=(6, 3.2))
xz = np.linspace(1e-5, 0.25, 3000)
PEAKS = {}
for i, N in enumerate([51, 201, 801]):
    y = partial_square(xz, N)
    PEAKS[N] = y.max()
    ax.plot(xz, y, color=C[i], lw=1.3, label=f"$k \\leq {N}$")
ax.axhline(1, color=INK, lw=1.5)
ax.axhline(GIBBS, color=INK, lw=0.8, ls=":")
ax.text(0.25, GIBBS + 0.01, f"{GIBBS:.3f}", ha="right", va="bottom", fontsize=9)
ax.set_ylim(0.6, 1.25)
ax.set_xlabel("$x$ (뛰는 점 0의 오른쪽)")
ax.legend(loc="lower right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 첫 항의 높이 4/π ≈ 1.27, 깁스 상수 1.17898, 세 차수의 봉우리가 모두 그 근처, 연속점 π/2에서 1로 수렴
    assert abs(4 / math.pi - 1.273) < 1e-3
    assert abs(GIBBS - 1.17898) < 1e-4
    for N, p in PEAKS.items():
        assert abs(p - GIBBS) < 5e-3, (N, p)
    assert abs(partial_square(np.pi / 2, 2001) - 1) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
