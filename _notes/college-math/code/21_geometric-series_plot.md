---
layout: "note"
title: "21_geometric-series_plot.py"
display_title: "21_geometric-series_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "21"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/geometric-series/"
parent_title: "등비급수"
description: "대학수학 · 등비급수 그림 생성 코드"
permalink: "/studies/college-math/code/21_geometric-series_plot/"
---
{% raw %}
[등비급수](/Hongs_Blog/studies/college-math/geometric-series/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 등비급수 문서의 그림을 만든다: 21_geometric-series_fig1.svg, 21_geometric-series_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_geometric-series_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_geometric-series"
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

def simulate(n_items):
    cap, size, copies, hist = 1, 0, 0, []
    for _ in range(n_items):
        if size == cap:
            copies += size
            cap *= 2
        size += 1
        hist.append(copies)
    return copies, cap, hist


COPIES, CAP, HIST = simulate(1000)

# 그림 1: 두 배로 늘리는 배열에 원소를 넣을 때 누적 복사 횟수(계단)는 늘 2n 아래다
n = np.arange(1, 1001)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.step(n, HIST, where="post", color=C[0], lw=2, label="누적 복사 횟수")
ax.plot(n, 2 * n, color=INK, lw=1, ls="--", label="$2n$")
ax.plot(n, n, color=INK, lw=0.8, ls=":", label="$n$")
ax.annotate("마지막 확장: 512번 복사", xy=(513, 1023), xytext=(560, 1500), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_xlabel("넣은 원소 수 $n$")
ax.legend(loc="upper left", fontsize=10)
save(fig, 1)

# 그림 2: 부분합 1 + r + … + r^(n−1). r = 1/2은 2로, r = 0.9는 10으로 다가가고, r = 1.1은 끝없이 커진다
K = np.arange(1, 41)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (r, lab) in enumerate([(0.5, "$r = 1/2$"), (0.9, "$r = 0.9$"), (1.1, "$r = 1.1$")]):
    ps = np.cumsum(r ** (K - 1))
    ax.plot(K, ps, "o-", color=C[i], ms=3, lw=1.4, label=lab)
for lim, i in [(2, 0), (10, 1)]:
    ax.axhline(lim, color=C[i], lw=0.8, ls="--")
ax.set_ylim(0, 25)
ax.set_xlabel("더한 항의 수 $n$")
ax.legend(loc="upper left", fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # 복사 1,023번, 최종 용량 1,024, 누적 복사 < 2n, 부분합의 극한 2와 10
    assert COPIES == 1023 and CAP == 1024
    assert all(h < 2 * (i + 1) for i, h in enumerate(HIST))
    assert abs(sum(0.5 ** k for k in range(200)) - 2) < 1e-12
    assert abs(sum(0.9 ** k for k in range(2000)) - 10) < 1e-9
    assert sum(1.1 ** k for k in range(40)) > 400
    print("ALL CHECKS PASSED")
```
{% endraw %}
