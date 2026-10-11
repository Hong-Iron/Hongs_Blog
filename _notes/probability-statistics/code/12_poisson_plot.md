---
layout: "note"
title: "12_poisson_plot.py"
display_title: "12_poisson_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "12"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/poisson/"
parent_title: "포아송 분포"
description: "확률과 통계 · 포아송 분포 그림 생성 코드"
permalink: "/studies/probability-statistics/code/12_poisson_plot/"
---
{% raw %}
[포아송 분포](/Hongs_Blog/studies/probability-statistics/poisson/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 포아송 분포 문서의 그림을 만든다: 12_poisson_fig1.svg, 12_poisson_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 12_poisson_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "12_poisson"
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


def pois_pmf(lam, k):
    return math.exp(-lam) * lam ** k / math.factorial(k)


def binom_pmf(n, p, k):
    return math.comb(n, k) * p ** k * (1 - p) ** (n - k)


# 그림 1: 평균 λ가 커지면 봉우리가 오른쪽으로 가고 넓어진다(분산 = λ)
ks = np.arange(0, 21)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, lam in enumerate([1, 3, 10]):
    ax.plot(ks, [pois_pmf(lam, k) for k in ks], "o-", color=C[i], ms=4, lw=1.2)
    kmax = max(ks, key=lambda k: pois_pmf(lam, k))
    ax.text(kmax + 0.4, pois_pmf(lam, kmax) + 0.01, f"$\\lambda = {lam}$", color=C[i], fontsize=11)
ax.set_xticks(range(0, 21, 2))
ax.set_xlabel("1초 동안의 요청 수 $k$")
ax.set_ylabel("$P(X = k)$")
ax.set_ylim(0, 0.42)
save(fig, 1)

# 그림 2: Bin(n, 3/n)이 n을 키우면 Pois(3)에 붙는다
ks = np.arange(0, 11)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.bar(ks, [pois_pmf(3, k) for k in ks], color=INK, alpha=0.35, width=0.8, label="Pois(3)")
for i, n in enumerate([5, 10, 1000]):
    ax.plot(ks, [binom_pmf(n, 3 / n, k) for k in ks], "o-", color=C[i], ms=4, lw=1.2,
            label=f"Bin({n}, 3/{n})")
ax.set_xticks(ks)
ax.set_xlabel("$k$")
ax.set_ylabel("확률")
ax.legend(loc="upper right")
save(fig, 2)

if __name__ == "__main__":
    table = {0: 0.050, 1: 0.149, 2: 0.224, 3: 0.224, 4: 0.168}
    assert all(round(pois_pmf(3, k), 3) == v for k, v in table.items())
    gap = max(abs(binom_pmf(1000, 0.003, k) - pois_pmf(3, k)) for k in range(0, 60))
    assert gap < 3.5e-4
    gaps = [max(abs(binom_pmf(n, 3 / n, k) - pois_pmf(3, k)) for k in range(0, min(n, 60) + 1)) for n in (5, 10, 1000)]
    assert gaps[0] > gaps[1] > gaps[2]
    print("ALL CHECKS PASSED")
```
{% endraw %}
