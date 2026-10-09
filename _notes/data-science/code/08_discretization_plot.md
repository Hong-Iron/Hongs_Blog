---
layout: "note"
title: "08_discretization_plot.py"
display_title: "08_discretization_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "08"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/discretization/"
parent_title: "이산화"
description: "데이터 과학 · 이산화 그림 생성 코드"
permalink: "/studies/data-science/code/08_discretization_plot/"
---
{% raw %}
[이산화](/Hongs_Blog/studies/data-science/discretization/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산화 문서의 그림을 만든다: 08_discretization_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 08_discretization_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "08_discretization"
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

PRICES = [4, 8, 15, 21, 21, 24, 25, 28, 34]


def equal_width(xs, k):
    lo, hi = min(xs), max(xs); w = (hi - lo) / k
    return [min(int((x - lo) // w), k - 1) for x in xs], [lo + w * i for i in range(k + 1)]


def equal_depth(xs, k):
    s = sorted(xs); m = len(s) // k
    return [min(i // m, k - 1) for i in range(len(s))]


# 그림 1: 같은 폭 칸 나누기와 같은 개수 칸 나누기
lab_w, edges = equal_width(PRICES, 3)
lab_d = equal_depth(PRICES, 3)
fig, axes = plt.subplots(2, 1, figsize=(6, 2.9), sharex=True)
for ax, lab, title in [(axes[0], lab_w, "같은 폭 (칸 폭 10)"), (axes[1], lab_d, "같은 개수 (칸마다 3개)")]:
    seen = {}
    for x, l in zip(sorted(PRICES), lab):
        seen[x] = seen.get(x, 0) + 1
        ax.plot(x, seen[x] - 1, "o", color=C[l], ms=8)
    groups = [[x for x, l in zip(sorted(PRICES), lab) if l == g] for g in range(3)]
    if lab is lab_w:
        cuts = edges[1:-1]
        mids = [(edges[i] + edges[i + 1]) / 2 for i in range(3)]
    else:
        cuts = [(groups[g][-1] + groups[g + 1][0]) / 2 for g in range(2)]
        mids = [(g[0] + g[-1]) / 2 for g in groups]
    for c in cuts:
        ax.axvline(c, color=INK, lw=1, ls="--")
    for g, m in enumerate(mids):
        ax.text(m, 1.55, f"{len(groups[g])}개", ha="center", fontsize=10, color=C[g])
    ax.set_ylim(-0.6, 2.3)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.set_title(title, loc="left", fontsize=10, pad=2)
axes[1].set_xlabel("가격")
axes[1].set_xticks([4, 14, 24, 34])
fig.tight_layout(h_pad=0.8)
save(fig, 1)

if __name__ == "__main__":
    assert edges == [4, 14, 24, 34] and [lab_w.count(g) for g in range(3)] == [2, 3, 4]
    g = [[x for x, l in zip(PRICES, lab_w) if l == k] for k in range(3)]
    assert [sum(v) / len(v) for v in g] == [6, 19, 27.75]
    assert [lab_d.count(k) for k in range(3)] == [3, 3, 3]
    print("ALL CHECKS PASSED")
```
{% endraw %}
