---
layout: "note"
title: "26_k-medoids_plot.py"
display_title: "26_k-medoids_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "26"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/k-medoids/"
parent_title: "k-메도이드"
description: "데이터 과학 · k-메도이드 그림 생성 코드"
permalink: "/studies/data-science/code/26_k-medoids_plot/"
---
{% raw %}
[k-메도이드](/Hongs_Blog/studies/data-science/k-medoids/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# k-메도이드 문서의 그림을 만든다: 26_k-medoids_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_k-medoids_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_k-medoids"
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

PTS = [1, 2, 3, 8, 9, 10, 25]


def kmeans_1d(xs, cents):
    while True:
        lab = [min(range(len(cents)), key=lambda j: abs(x - cents[j])) for x in xs]
        new = [sum(x for x, l in zip(xs, lab) if l == j) / lab.count(j) for j in range(len(cents))]
        if new == cents:
            return cents, lab
        cents = new


def kmedoids_1d(xs, meds):
    while True:
        lab = [min(range(len(meds)), key=lambda j: abs(x - meds[j])) for x in xs]
        new = []
        for j in range(len(meds)):
            grp = [x for x, l in zip(xs, lab) if l == j]
            new.append(min(grp, key=lambda m: sum(abs(m - y) for y in grp)))
        if new == meds:
            return meds, lab
        meds = new


def medoid(grp):
    return min(grp, key=lambda m: sum(abs(m - y) for y in grp))


cm, _ = kmeans_1d(PTS, [1.0, 2.0])
md, _ = kmedoids_1d(PTS, [1, 2])

# 그림 1: (왼쪽) 두 방법의 대표, (오른쪽) 튀는 점을 멀리 보낼 때 {8, 9, 10, 튀는 점}의 대표
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3), gridspec_kw={"width_ratios": [1.25, 1]})
ax = axes[0]
ax.plot(PTS, [0] * len(PTS), "o", color=INK, ms=7)
ax.plot(cm, [0.55, 0.55], "v", color=C[1], ms=10, label="k-평균의 중심")
ax.plot(md, [-0.55, -0.55], "^", color=C[0], ms=10, label="k-메도이드의 대표")
for c in cm:
    ax.text(c, 0.85, f"{c:g}", ha="center", fontsize=10, color=C[1])
for m in md:
    ax.text(m, -1.15, f"{m:g}", ha="center", fontsize=10, color=C[0])
ax.set_ylim(-1.6, 1.9)
ax.set_yticks([])
ax.spines["left"].set_visible(False)
ax.set_xticks([1, 8, 13, 25])
ax.legend(loc="upper left", fontsize=9, ncol=1)
ax = axes[1]
o = np.arange(10, 61)
ax.plot(o, (27 + o) / 4, color=C[1], lw=2, label="평균")
ax.plot(o, [medoid([8, 9, 10, v]) for v in o], color=C[0], lw=2, label="메도이드")
ax.set_xlabel("튀는 점의 위치")
ax.set_ylabel("둘째 무리의 대표")
ax.legend(loc="upper left", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert cm == [2.0, 13.0] and md == [2, 9]
    assert medoid([8, 9, 10, 25]) == 9 and sum(abs(9 - y) for y in [8, 10, 25]) == 18
    assert all(medoid([8, 9, 10, v]) == 9 for v in o)
    print("ALL CHECKS PASSED")
```
{% endraw %}
