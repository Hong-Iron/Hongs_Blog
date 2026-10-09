---
layout: "note"
title: "11_geometric-distribution_plot.py"
display_title: "11_geometric-distribution_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "11"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/geometric-distribution/"
parent_title: "기하분포"
description: "확률과 통계 · 기하분포 코드 코드"
permalink: "/studies/probability-statistics/code/11_geometric-distribution_plot/"
---
{% raw %}
[기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 기하분포 문서의 그림을 만든다: 11_geometric-distribution_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_geometric-distribution_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_geometric-distribution"
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


P = 1 / 6                                               # 주사위로 6이 나올 확률


def geom_pmf(k, p=P):
    return (1 - p) ** (k - 1) * p


# 그림 1: 6이 나올 때까지 던지는 횟수의 분포. 평균 6, 6번 넘게 걸리는 쪽(주황)도 많다
ks = np.arange(1, 31)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.bar(ks, [geom_pmf(k) for k in ks], color=[C[0] if k <= 6 else C[1] for k in ks], width=0.7)
ax.axvline(6, color=INK, lw=0.8, ls="--")
ax.text(6.3, 0.165, "평균 6번", fontsize=10, va="top")
tail = (1 - P) ** 6
ax.text(12, 0.08, f"6번 넘게 걸릴 확률\n$(5/6)^6 \\approx {tail:.3f}$", fontsize=10, color=C[1])
ax.set_xlabel("처음 6이 나올 때까지 던진 횟수 $k$")
ax.set_ylabel("$P(X = k)$")
save(fig, 1)

if __name__ == "__main__":
    assert round(tail, 3) == 0.335
    assert abs(sum(k * geom_pmf(k) for k in range(1, 2000)) - 6) < 1e-9
    assert abs(1 - sum(geom_pmf(k) for k in range(1, 7)) - tail) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
