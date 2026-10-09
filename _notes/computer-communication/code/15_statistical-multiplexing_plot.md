---
layout: "note"
title: "15_statistical-multiplexing_plot.py"
display_title: "15_statistical-multiplexing_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "15"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/statistical-multiplexing/"
parent_title: "통계적 다중화"
description: "컴퓨터 통신 · 통계적 다중화 코드 코드"
permalink: "/studies/computer-communication/code/15_statistical-multiplexing_plot/"
---
{% raw %}
[통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 통계적 다중화 문서의 그림을 만든다: 15_statistical-multiplexing_fig1.svg, 15_statistical-multiplexing_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_statistical-multiplexing_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_statistical-multiplexing"
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

P = 0.1      # 활동 확률
N_MAX = 10   # 1 Mbps ÷ 100 kbps


def pmf(n, k, p=P):
    return math.comb(n, k) * p ** k * (1 - p) ** (n - k)


def overflow(n, p=P, n_max=N_MAX):
    """Pr[X > n_max], X ~ Bin(n, p)"""
    return sum(pmf(n, k, p) for k in range(n_max + 1, n + 1))


# 그림 1: 35명 중 동시에 활동하는 사람 수의 분포. 11명 이상(링크가 넘침)을 따로 칠한다
ks = np.arange(0, 17)
probs = np.array([pmf(35, k) for k in ks])
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.bar(ks[ks <= N_MAX], probs[ks <= N_MAX], color=C[0], width=0.75)
ax.bar(ks[ks > N_MAX], probs[ks > N_MAX], color=C[1], width=0.75)
ax.axvline(N_MAX + 0.5, color=INK, lw=0.8, ls="--")
ax.text(N_MAX + 0.8, 0.17, "11명 이상이면 넘침\n확률 0.000424", color=C[1], fontsize=10, va="top")
ax.text(N_MAX + 0.2, 0.17, "링크가 감당\n(10명까지)", color=C[0], fontsize=10, va="top", ha="right")
ax.set_xlabel("동시에 활동하는 사용자 수 $X$ (35명 중)")
ax.set_ylabel("확률")
ax.set_xticks(range(0, 17, 2))
save(fig, 1)

# 그림 2: 받는 사용자 수에 따른 넘칠 확률 (세로 로그 눈금)
ns = np.arange(11, 61)
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.semilogy(ns, [overflow(n) for n in ns], color=C[0], lw=1.6)
for n, lab in [(30, "0.000089"), (35, "0.000424"), (40, "0.00147"), (50, "0.00935")]:
    ax.plot([n], [overflow(n)], "o", color=C[0], ms=4)
    ax.annotate(f"{n}명: {lab}", (n, overflow(n)), textcoords="offset points",
                xytext=(6, -12), fontsize=9)
ax.axvline(10, color=C[1], lw=1.2)
ax.text(11, 0.3, "고정 할당의 한계 10명", color=C[1], fontsize=10)
ax.set_xlim(8, 60)
ax.set_ylim(1e-9, 1)
ax.set_yticks([1e-8, 1e-6, 1e-4, 1e-2, 1], ["$10^{-8}$", "$10^{-6}$", "$10^{-4}$", "0.01", "1"])
ax.minorticks_off()
ax.set_xlabel("통계적 다중화로 받은 사용자 수 $n$")
ax.set_ylabel("링크가 넘칠 확률")
save(fig, 2)

if __name__ == "__main__":
    # 문서의 값: 35명 0.000424, 30명 0.000089, 40명 0.00147, 50명 0.00935
    assert round(overflow(35), 6) == 0.000424
    assert round(overflow(30), 6) == 0.000089
    assert round(overflow(40), 5) == 0.00147
    assert round(overflow(50), 5) == 0.00935
    assert abs(sum(pmf(35, k) for k in range(36)) - 1) < 1e-12
    assert all(overflow(n) < overflow(n + 1) for n in range(11, 60))
    print("ALL CHECKS PASSED")
```
{% endraw %}
