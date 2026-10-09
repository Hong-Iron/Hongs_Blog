---
layout: "note"
title: "27_dft_plot.py"
display_title: "27_dft_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "27"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/dft/"
parent_title: "이산 푸리에 변환과 FFT"
description: "선형대수학 · 이산 푸리에 변환과 FFT 그림 생성 코드"
permalink: "/studies/linear-algebra/code/27_dft_plot/"
---
{% raw %}
[이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 푸리에 변환과 FFT 문서의 그림을 만든다: 27_dft_fig1.svg, 27_dft_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_dft_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_dft"
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


def arrow(ax, start, vec, color, lw=1.8, ls="-"):
    """start에서 vec만큼 가는 화살표"""
    ax.annotate("", xy=(start[0] + vec[0], start[1] + vec[1]), xytext=(start[0], start[1]),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, ls=ls, shrinkA=0, shrinkB=0,
                                mutation_scale=12))


n = 64
j = np.arange(n)
rng = np.random.default_rng(4)
signal = np.sin(2 * np.pi * 5 * j / n) + 0.5 * np.sin(2 * np.pi * 12 * j / n)
x = signal + 0.3 * rng.standard_normal(n)
X = np.array([sum(x[m] * np.exp(-2j * np.pi * m * k / n) for m in range(n)) for k in range(n)])

# 그림 1: 위는 잡음 섞인 신호, 아래는 |X_k|. 섞여 있던 두 파동이 k = 5, 12(와 대칭인 59, 52)에서 솟는다
fig, (a1, a2) = plt.subplots(2, 1, figsize=(6.2, 3.8))
a1.plot(j, x, "o-", color=C[0], ms=2.5, lw=0.9)
a1.set_xlabel("표본 번호 $j$", fontsize=9)
a1.set_ylabel("$x_j$")
a1.set_xlim(-1, n)
a2.vlines(np.arange(n), 0, np.abs(X), color=C[1], lw=1.4)
a2.set_xlabel("주파수 번호 $k$", fontsize=9)
a2.set_ylabel(r"$|X_k|$")
a2.set_xlim(-1, n)
for k in (5, 12):
    a2.text(k, np.abs(X[k]) + 1, f"$k = {k}$", fontsize=9, ha="center", va="bottom", color=C[1])
a2.set_ylim(0, 40)
fig.tight_layout()
save(fig, 1)

# 그림 2: 곱셈 수. 정의대로 n^2, FFT는 (n/2)log2 n
ns = 2.0 ** np.arange(1, 21)
naive = ns ** 2
fft = ns / 2 * np.log2(ns)
fig, ax = plt.subplots(figsize=(6, 3.3))
ax.loglog(ns, naive, "o-", color=C[1], ms=3, label=r"정의대로 $n^2$")
ax.loglog(ns, fft, "s-", color=C[0], ms=3, label=r"FFT $(n/2)\log_2 n$")
ax.annotate("", xy=(2 ** 20, fft[-1]), xytext=(2 ** 20, naive[-1]),
            arrowprops=dict(arrowstyle="<->", color=INK, lw=1))
ax.text(2 ** 19.6, 3e7, "약 10만 배", fontsize=10, ha="right", va="center")
ax.set_xlabel("길이 $n$")
ax.set_ylabel("곱셈 수")
pow10 = matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(np.log10(v)))}}}$")
for axis in (ax.xaxis, ax.yaxis):
    axis.set_major_locator(matplotlib.ticker.LogLocator(numticks=7))
    axis.set_major_formatter(pow10)
    axis.set_minor_locator(matplotlib.ticker.NullLocator())
ax.legend(loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    assert np.allclose(X, np.fft.fft(x))
    top = sorted(np.argsort(np.abs(X))[-4:].tolist())
    assert top == [5, 12, 52, 59]
    assert np.allclose(np.fft.fft([1, 2, 3, 4]), [10, -2 + 2j, -2, -2 - 2j])
    assert 1.0e5 < naive[-1] / fft[-1] < 1.1e5             # 2^20에서 약 10만 배(104,857.6)
    print("ALL CHECKS PASSED")
```
{% endraw %}
