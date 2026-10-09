---
layout: "note"
title: "16_sum-integral-bounds_plot.py"
display_title: "16_sum-integral-bounds_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "16"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/sum-integral-bounds/"
parent_title: "합 ↔ 적분"
description: "미분적분학 · 합 ↔ 적분 코드 코드"
permalink: "/studies/calculus/code/16_sum-integral-bounds_plot/"
---
{% raw %}
[합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 합 ↔ 적분 문서의 그림을 만든다: 16_sum-integral-bounds_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_sum-integral-bounds_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_sum-integral-bounds"
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


N = 8


def f(x):
    return 1 / x


# 그림 1: 폭 1인 막대 f(k)를 곡선 1/x와 겹쳐 본다. 오른쪽으로 놓으면 곡선 위, 왼쪽으로 놓으면 곡선 아래
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3), sharey=True)
x = np.linspace(0.6, N + 1.2, 300)
for k in range(1, N + 1):
    a1.bar(k, f(k), width=1, align="edge", color=C[0], alpha=0.3, edgecolor=C[0], lw=1)
for k in range(2, N + 1):
    a2.bar(k - 1, f(k), width=1, align="edge", color=C[1], alpha=0.3, edgecolor=C[1], lw=1)
for ax in (a1, a2):
    ax.plot(x, f(x), color=INK, lw=2)
    ax.set_xlabel("$x$")
    ax.set_xlim(0.5, N + 1.5)
a1.set_title(r"$H_8 \geq \int_1^{9} \frac{dx}{x} = \ln 9$", fontsize=10)
a2.set_title(r"$H_8 - 1 \leq \int_1^{8} \frac{dx}{x} = \ln 8$", fontsize=10)
a1.set_ylim(0, 1.15)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # ln 9 ≤ H_8 ≤ 1 + ln 8, 그리고 n ≤ 10^4에서 같은 끼우기
    H = sum(1 / k for k in range(1, N + 1))
    assert math.log(N + 1) <= H <= 1 + math.log(N)
    h = 0.0
    for n in range(1, 10001):
        h += 1 / n
        assert math.log(n + 1) <= h <= 1 + math.log(n) + 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
