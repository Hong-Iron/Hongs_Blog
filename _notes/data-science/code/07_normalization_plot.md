---
layout: "note"
title: "07_normalization_plot.py"
display_title: "07_normalization_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "07"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/normalization/"
parent_title: "정규화"
description: "데이터 과학 · 정규화 그림 생성 코드"
permalink: "/studies/data-science/code/07_normalization_plot/"
---
{% raw %}
[정규화](/Hongs_Blog/studies/data-science/normalization/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 정규화 문서의 그림을 만든다: 07_normalization_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 07_normalization_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "07_normalization"
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

XS = [1, 2, 2, 3, 3, 3, 4, 10, 20, 40]                  # 오른쪽으로 꼬리가 긴 자료 (검증 코드와 같다)


def minmax(xs):
    lo, hi = min(xs), max(xs)
    return [(x - lo) / (hi - lo) for x in xs]


def zscore(xs):
    m = sum(xs) / len(xs); s = (sum((x - m) ** 2 for x in xs) / len(xs)) ** 0.5
    return [(x - m) / s for x in xs]


def skew(xs):
    z = zscore(xs)
    return sum(v ** 3 for v in z) / len(z)


def dots(ax, vals, col):
    seen = {}
    for v in vals:
        k = round(v, 9); seen[k] = seen.get(k, 0) + 1
        ax.plot(v, seen[k] - 1, "o", color=col, ms=6)


# 그림 1: 같은 자료를 그대로, 최소-최대로, z-점수로 (점 사이 간격의 비율이 그대로다)
rows = [("원래 값", XS, C[0]), ("최소-최대 정규화", minmax(XS), C[1]), ("z-점수 정규화", zscore(XS), C[2])]
fig, axes = plt.subplots(3, 1, figsize=(6, 3.6))
for ax, (name, vals, col) in zip(axes, rows):
    dots(ax, vals, col)
    span = max(vals) - min(vals)
    ax.set_xlim(min(vals) - 0.04 * span, max(vals) + 0.04 * span)
    ax.set_ylim(-0.8, 3)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.set_title(name, loc="left", fontsize=10, pad=2)
fig.tight_layout(h_pad=0.6)
save(fig, 1)

if __name__ == "__main__":
    z = zscore(XS)
    assert abs(sum(z) / len(z)) < 1e-12 and abs((sum(v * v for v in z) / len(z)) - 1) < 1e-12
    assert round(skew(XS), 2) == 1.85 and abs(skew(minmax(XS)) - skew(XS)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
