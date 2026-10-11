---
layout: "note"
title: "15_uniform-exponential_plot.py"
display_title: "15_uniform-exponential_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "15"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/uniform-exponential/"
parent_title: "균등분포와 지수분포"
description: "확률과 통계 · 균등분포와 지수분포 그림 생성 코드"
permalink: "/studies/probability-statistics/code/15_uniform-exponential_plot/"
---
{% raw %}
[균등분포와 지수분포](/Hongs_Blog/studies/probability-statistics/uniform-exponential/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 균등분포와 지수분포 문서의 그림을 만든다: 15_uniform-exponential_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_uniform-exponential_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_uniform-exponential"
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


# 그림 1: 왼쪽 Unif(0, 10)의 버스 대기, 오른쪽 Exp(3)의 요청 간격. 색칠한 넓이가 문서 예시의 확률
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
a1.plot([-1, 0, 0, 10, 10, 11], [0, 0, 0.1, 0.1, 0, 0], color=C[0], lw=2)
a1.fill_between([7, 10], [0.1, 0.1], color=C[1], alpha=0.35)
a1.text(8.5, 0.05, "0.3", ha="center", fontsize=10)
a1.axvline(5, color=INK, lw=0.8, ls="--")
a1.text(5, 0.125, "평균 5분", ha="center", fontsize=10)
a1.set_ylim(0, 0.14)
a1.set_title("Unif(0, 10)", fontsize=11)
a1.set_xlabel("대기 시간(분)")
lam = 3
t = np.linspace(0, 2, 400)
a2.plot(t, lam * np.exp(-lam * t), color=C[0], lw=2)
tt = np.linspace(1, 2, 100)
a2.fill_between(tt, lam * np.exp(-lam * tt), color=C[1], alpha=0.35)
a2.annotate(f"$P(X > 1) = e^{{-3}} \\approx {math.exp(-3):.3f}$", (1.1, 0.1), xytext=(0.9, 0.9),
            fontsize=10, arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
a2.axvline(1 / lam, color=INK, lw=0.8, ls="--")
a2.text(1 / lam + 0.04, 2.6, "평균 1/3초", fontsize=10)
a2.set_title("Exp(3)", fontsize=11)
a2.set_xlabel("다음 요청까지(초)")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs((10 - 7) / 10 - 0.3) < 1e-12
    grid = np.linspace(1, 40, 400001)
    tail = float(np.sum(lam * np.exp(-lam * (grid[:-1] + grid[1:]) / 2) * np.diff(grid)))
    assert abs(tail - math.exp(-3)) < 1e-6 and round(math.exp(-3), 3) == 0.05
    print("ALL CHECKS PASSED")
```
{% endraw %}
