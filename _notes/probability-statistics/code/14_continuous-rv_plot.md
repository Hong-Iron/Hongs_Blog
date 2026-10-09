---
layout: "note"
title: "14_continuous-rv_plot.py"
display_title: "14_continuous-rv_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "14"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/continuous-rv/"
parent_title: "연속 확률변수와 확률밀도"
description: "확률과 통계 · 연속 확률변수와 확률밀도 그림 생성 코드"
permalink: "/studies/probability-statistics/code/14_continuous-rv_plot/"
---
{% raw %}
[연속 확률변수와 확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속 확률변수와 확률밀도 문서의 그림을 만든다: 14_continuous-rv_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 14_continuous-rv_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "14_continuous-rv"
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


def f(x):
    return np.where((x >= 0) & (x <= 1), 2 * x, 0.0)    # 예시의 밀도 f(x) = 2x (0 ≤ x ≤ 1)


def F(x):
    return np.clip(x, 0, 1) ** 2                         # CDF F(x) = x²


# 그림 1: 왼쪽은 밀도와 넓이 P(X ≤ 1/2) = 1/4, 오른쪽은 CDF. 오른쪽 높이 = 왼쪽 넓이
x = np.linspace(-0.2, 1.2, 600)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
a1.plot(x, f(x), color=C[0], lw=2)
xs = np.linspace(0, 0.5, 100)
a1.fill_between(xs, f(xs), color=C[0], alpha=0.25)
a1.text(0.3, 0.12, "넓이 1/4", fontsize=10, ha="center")
a1.text(1.0, 2.0, "  $f(1) = 2$", fontsize=10, va="center")
a1.set_title("밀도 $f(x) = 2x$", fontsize=11)
a1.set_xlabel("$x$")
a1.set_ylim(0, 2.3)
a2.plot(x, F(x), color=C[1], lw=2)
a2.plot([0.5, 0.5], [0, 0.25], color=INK, lw=0.8, ls=":")
a2.plot([-0.2, 0.5], [0.25, 0.25], color=INK, lw=0.8, ls=":")
a2.plot(0.5, 0.25, "o", color=C[1], ms=5)
a2.text(0.55, 0.2, "$F(1/2) = 1/4$", fontsize=10, va="top")
a2.set_title("CDF $F(x) = x^2$", fontsize=11)
a2.set_xlabel("$x$")
a2.set_ylim(0, 1.1)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    grid = np.linspace(0, 0.5, 200001)
    area = float(np.sum((f(grid[:-1]) + f(grid[1:])) / 2 * np.diff(grid)))
    assert abs(area - 0.25) < 1e-9 and abs(float(F(np.array(0.5))) - 0.25) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
