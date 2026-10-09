---
layout: "note"
title: "31_confidence-intervals_plot.py"
display_title: "31_confidence-intervals_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "31"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/confidence-intervals/"
parent_title: "신뢰구간"
description: "확률과 통계 · 신뢰구간 그림 생성 코드"
permalink: "/studies/probability-statistics/code/31_confidence-intervals_plot/"
---
{% raw %}
[신뢰구간](/Hongs_Blog/studies/probability-statistics/confidence-intervals/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 신뢰구간 문서의 그림을 만든다: 31_confidence-intervals_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 31_confidence-intervals_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "31_confidence-intervals"
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


rng = np.random.default_rng(37)
MU, SIG, N = 50, 8, 30
half = 1.96 * SIG / math.sqrt(N)                        # 오차 한계
means = rng.normal(MU, SIG, size=(1000, N)).mean(axis=1)
hit = np.abs(means - MU) <= half

# 그림 1: 구간 1,000개 중 앞의 60개. 주황은 참값 50을 놓친 구간
K = 60
fig, ax = plt.subplots(figsize=(6, 4))
for i in range(K):
    col = C[0] if hit[i] else C[1]
    ax.plot([means[i] - half, means[i] + half], [i, i], color=col, lw=1.6)
    ax.plot(means[i], i, "o", color=col, ms=2.5)
ax.axvline(MU, color=INK, lw=1)
ax.set_xlabel("구간")
ax.set_ylabel("몇 번째 표본")
ax.set_ylim(-1, K + 1)
ax.set_title(f"참값 50 (세로선). 구간 1,000개 중 {hit.sum()}개가 50을 담음", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert abs(half - 2.863) < 0.001
    assert 930 <= hit.sum() <= 970 and (~hit[:K]).sum() >= 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
