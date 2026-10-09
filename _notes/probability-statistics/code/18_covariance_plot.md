---
layout: "note"
title: "18_covariance_plot.py"
display_title: "18_covariance_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "18"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/covariance/"
parent_title: "공분산과 상관계수"
description: "확률과 통계 · 공분산과 상관계수 코드 코드"
permalink: "/studies/probability-statistics/code/18_covariance_plot/"
---
{% raw %}
[공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 공분산과 상관계수 문서의 그림을 만든다: 18_covariance_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_covariance_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_covariance"
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


rng = np.random.default_rng(18)


def corr(x, y):
    xc, yc = x - x.mean(), y - y.mean()
    return float(xc @ yc / math.sqrt((xc @ xc) * (yc @ yc)))


# 그림 1: 상관계수가 다른 점 구름 세 개와, 완전히 정해진 관계인데 상관계수가 0인 포물선
n = 200
z1, z2 = rng.standard_normal(n), rng.standard_normal(n)
panels = []
for rho in (0.9, 0.3, -0.7):
    panels.append((z1, rho * z1 + math.sqrt(1 - rho ** 2) * z2))
xp = np.linspace(-1, 1, 41)
panels.append((xp, xp ** 2))
fig, axes = plt.subplots(1, 4, figsize=(6.5, 1.9))
for i, (ax, (x, y)) in enumerate(zip(axes, panels)):
    ax.plot(x, y, "o", ms=2.2, color=C[i], alpha=0.7)
    ax.set_title(f"$r = {corr(x, y):.2f}$" + ("\n$y = x^2$" if i == 3 else ""), fontsize=10)
    ax.set_xticks([])
    ax.set_yticks([])
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    x = np.array([1, 2, 3, 4, 5.0])
    y = np.array([2, 4, 5, 4, 5.0])
    assert abs(corr(x, y) - math.sqrt(0.6)) < 1e-12
    rs = [corr(*p) for p in panels]
    assert abs(rs[0] - 0.9) < 0.05 and abs(rs[1] - 0.3) < 0.1 and abs(rs[2] + 0.7) < 0.07 and abs(rs[3]) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
