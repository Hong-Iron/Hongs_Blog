---
layout: "note"
title: "07_random-variables_plot.py"
display_title: "07_random-variables_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "07"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/random-variables/"
parent_title: "확률변수와 분포"
description: "확률과 통계 · 확률변수와 분포 코드 코드"
permalink: "/studies/probability-statistics/code/07_random-variables_plot/"
---
{% raw %}
[확률변수와 분포](/Hongs_Blog/studies/probability-statistics/random-variables/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 확률변수와 분포 문서의 그림을 만든다: 07_random-variables_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 07_random-variables_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "07_random-variables"
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


# 두 주사위의 합 S의 PMF와 CDF (결과 36개를 합으로 모아 센다)
pmf = {s: 0 for s in range(2, 13)}
for a in range(1, 7):
    for b in range(1, 7):
        pmf[a + b] += 1
pmf = {s: c / 36 for s, c in pmf.items()}
cdf = {}
acc = 0.0
for s in range(2, 13):
    acc += pmf[s]
    cdf[s] = acc

# 그림 1: 왼쪽 PMF 막대, 오른쪽 계단 모양 CDF. 계단의 높이 = 그 점의 막대 높이
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
xs = list(range(2, 13))
a1.bar(xs, [pmf[s] for s in xs], color=C[0], width=0.6)
a1.bar([7], [pmf[7]], color=C[1], width=0.6)
a1.text(7, pmf[7] + 0.005, "6/36", ha="center", fontsize=10, color=C[1])
a1.set_xticks(xs)
a1.set_ylim(0, 0.2)
a1.tick_params(axis="x", labelsize=8)
a1.set_xlabel("합 $s$")
a1.set_title("PMF  $P(S = s)$", fontsize=11)
grid = [1.0] + xs + [13.0]
vals = [0.0] + [cdf[s] for s in xs] + [1.0]
for i in range(len(grid) - 1):
    a2.hlines(vals[i], grid[i], grid[i + 1], color=C[0], lw=2)
for s in xs:
    a2.plot(s, cdf[s], "o", color=C[0], ms=4)
    a2.plot(s, cdf[s] - pmf[s], "o", mfc="none", mec=C[0], ms=4)
a2.vlines(7, cdf[6], cdf[7], color=C[1], lw=2)
a2.text(7.3, (cdf[6] + cdf[7]) / 2, "점프 6/36", fontsize=10, color=C[1], va="center")
a2.set_xticks(xs)
a2.tick_params(axis="x", labelsize=8)
a2.set_xlabel("$x$")
a2.set_title("CDF  $P(S \\leq x)$", fontsize=11)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs(sum(pmf.values()) - 1) < 1e-12 and abs(pmf[7] - 6 / 36) < 1e-12
    assert abs(cdf[7] - cdf[6] - pmf[7]) < 1e-12 and abs(cdf[12] - 1) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
