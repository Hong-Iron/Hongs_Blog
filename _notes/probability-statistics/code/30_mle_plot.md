---
layout: "note"
title: "30_mle_plot.py"
display_title: "30_mle_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "30"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/mle/"
parent_title: "최대가능도 추정"
description: "확률과 통계 · 최대가능도 추정 코드 코드"
permalink: "/studies/probability-statistics/code/30_mle_plot/"
---
{% raw %}
[최대가능도 추정](/Hongs_Blog/studies/probability-statistics/mle/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 최대가능도 추정 문서의 그림을 만든다: 30_mle_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 30_mle_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "30_mle"
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


def lik(p, k, n):
    return p ** k * (1 - p) ** (n - k)


# 그림 1: 앞면 7/10과 70/100의 가능도(꼭대기를 1로 맞춤). 봉우리는 같은 0.7, 자료가 많으면 좁다
p = np.linspace(0.001, 0.999, 999)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (k, n) in enumerate([(7, 10), (70, 100)]):
    L = lik(p, k, n)
    ax.plot(p, L / L.max(), color=C[i], lw=2, label=f"앞면 {k}번 / {n}번")
for q in (0.5, 0.6, 0.7, 0.8, 0.9):
    ax.plot(q, lik(q, 7, 10) / lik(0.7, 7, 10), "o", color=C[0], ms=4)
ax.axvline(0.7, color=INK, lw=0.6, ls=":")
ax.text(0.71, 1.04, "$\\hat p = 0.7$", fontsize=10)
ax.set_xlabel("앞면 확률 후보 $p$")
ax.set_ylabel("$L(p)$ / 최댓값")
ax.set_ylim(0, 1.12)
ax.legend(loc="upper left")
save(fig, 1)

if __name__ == "__main__":
    table = {0.5: 0.98, 0.6: 1.79, 0.7: 2.22, 0.8: 1.68, 0.9: 0.48}
    assert all(round(lik(q, 7, 10) * 1000, 2) == v for q, v in table.items())
    assert abs(p[np.argmax(lik(p, 7, 10))] - 0.7) < 1e-9 and abs(p[np.argmax(lik(p, 70, 100))] - 0.7) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
