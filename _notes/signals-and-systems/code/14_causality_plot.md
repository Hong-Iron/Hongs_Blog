---
layout: "note"
title: "14_causality_plot.py"
display_title: "14_causality_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "14"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/causality/"
parent_title: "인과성"
description: "신호 및 시스템 · 인과성 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/14_causality_plot/"
---
{% raw %}
[인과성](/Hongs_Blog/studies/signals-and-systems/causality/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 인과성 문서의 그림을 만든다: 14_causality_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 14_causality_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "14_causality"
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


def stem(ax, n, x, color, label=None, ms=5):
    # 이산 시간 신호는 막대 끝에 점을 찍은 줄기 그림으로 그린다
    ml, sl, bl = ax.stem(n, x, linefmt="-", markerfmt="o", basefmt=" ", label=label)
    plt.setp(sl, color=color, lw=1.4)
    plt.setp(ml, color=color, markersize=ms)
    ax.axhline(0, color=INK, lw=0.6)


M = 5
rng = np.random.default_rng(14)
N = 120
n = np.arange(N)
trend = 10 + 3 * np.sin(2 * np.pi * n / 80)
x = trend + rng.normal(0, 0.8, N)


def centered(x, M):  # y[n] = 앞뒤 M개씩 평균 (비인과)
    y = np.full(len(x), np.nan)
    for k in range(M, len(x) - M):
        y[k] = x[k - M:k + M + 1].mean()
    return y


def causal(x, M):  # y[n] = 과거 2M+1개 평균 (인과)
    y = np.full(len(x), np.nan)
    for k in range(2 * M, len(x)):
        y[k] = x[k - 2 * M:k + 1].mean()
    return y


# 그림 1: 앞뒤 평균(비인과)은 흐름과 겹치고, 과거만 쓴 평균(인과)은 M칸 늦게 따라온다
fig, ax = plt.subplots(figsize=(6.5, 3.2))
ax.plot(n, x, color=INK, lw=0.8, alpha=0.7, label="입력 $x[n]$")
ax.plot(n, centered(x, M), color=C[0], lw=1.8, label="앞뒤 평균 (비인과)")
ax.plot(n, causal(x, M), color=C[1], lw=1.8, label="과거만 평균 (인과)")
ax.set_xlabel("$n$")
ax.set_ylim(5.5, 16)
ax.legend(loc="upper right", fontsize=9, ncol=3)
save(fig, 1)

if __name__ == "__main__":
    # 과거만 쓴 평균은 앞뒤 평균을 정확히 M칸 늦춘 것이다
    yc, yk = centered(x, M), causal(x, M)
    assert np.allclose(yk[2 * M:], yc[M:N - M])
    print("ALL CHECKS PASSED")
```
{% endraw %}
