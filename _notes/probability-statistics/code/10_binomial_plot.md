---
layout: "note"
title: "10_binomial_plot.py"
display_title: "10_binomial_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "10"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/binomial/"
parent_title: "베르누이 시행과 이항분포"
description: "확률과 통계 · 베르누이 시행과 이항분포 코드 코드"
permalink: "/studies/probability-statistics/code/10_binomial_plot/"
---
{% raw %}
[베르누이 시행과 이항분포](/Hongs_Blog/studies/probability-statistics/binomial/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 베르누이 시행과 이항분포 문서의 그림을 만든다: 10_binomial_fig1.svg, 10_binomial_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 10_binomial_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "10_binomial"
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


def Phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def binom_pmf(n, p, k):
    return math.comb(n, k) * p ** k * (1 - p) ** (n - k)


# 그림 1: 같은 n = 10에서 p가 바뀌면 모양이 어떻게 바뀌는가 (p = 0.1은 패킷 손실 예시)
fig, ax = plt.subplots(figsize=(6, 3.6))
ks = np.arange(0, 11)
w = 0.27
for i, p in enumerate([0.1, 0.5, 0.8]):
    ax.bar(ks + (i - 1) * w, [binom_pmf(10, p, k) for k in ks], width=w, color=C[i],
           label=f"$p = {p}$, 평균 {10 * p:g}")
ax.set_xticks(ks)
ax.set_xlabel("성공 횟수 $k$ ($n = 10$)")
ax.set_ylabel("$P(X = k)$")
ax.set_ylim(0, 0.5)
ax.legend(loc="upper center")
save(fig, 1)

# 그림 2: 통계적 다중화. Bin(35, 0.1)의 거의 모든 확률이 링크 한계 10명보다 훨씬 아래에 있다
n, p = 35, 0.1
ks = np.arange(0, 16)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.bar(ks, [binom_pmf(n, p, k) for k in ks], color=[C[0] if k <= 10 else C[1] for k in ks], width=0.7)
ax.axvline(10.5, color=INK, lw=0.8, ls="--")
tail = sum(binom_pmf(n, p, k) for k in range(11, n + 1))
ax.text(10.8, 0.17, f"링크 한계 10명\n넘칠 확률 $P(X \\geq 11) \\approx {tail:.5f}$", fontsize=10, va="top")
ax.set_xticks(range(0, 16))
ax.set_xlabel("동시에 활동하는 사용자 수 ($n = 35$, $p = 0.1$)")
ax.set_ylabel("확률")
save(fig, 2)

if __name__ == "__main__":
    assert round(binom_pmf(10, 0.1, 0), 3) == 0.349 and round(binom_pmf(10, 0.1, 1), 3) == 0.387
    assert abs(tail - 0.000424) < 5e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
