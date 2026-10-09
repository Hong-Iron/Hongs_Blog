---
layout: "note"
title: "34_curse-of-dimensionality_plot.py"
display_title: "34_curse-of-dimensionality_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "34"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/curse-of-dimensionality/"
parent_title: "차원의 저주"
description: "데이터 과학 · 차원의 저주 코드 코드"
permalink: "/studies/data-science/code/34_curse-of-dimensionality_plot/"
---
{% raw %}
[차원의 저주](/Hongs_Blog/studies/data-science/curse-of-dimensionality/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 차원의 저주 문서의 그림을 만든다: 34_curse-of-dimensionality_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 34_curse-of-dimensionality_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "34_curse-of-dimensionality"
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

import random

DIMS = (2, 10, 100, 1000)
rnd = random.Random(0)                                  # 34_curse-of-dimensionality_verify.py와 같은 난수 흐름
DIST = {}
for d in DIMS:
    Pt = [[rnd.random() for _ in range(d)] for _ in range(60)]
    DIST[d] = np.array([math.dist(Pt[i], Pt[j]) for i in range(60) for j in range(i + 1, 60)])
RATIO = {d: (v.max() - v.min()) / v.min() for d, v in DIST.items()}

# 그림 1: 점 60개의 모든 쌍 거리 1,770개를 평균 거리로 나눈 값의 분포
fig, ax = plt.subplots(figsize=(6, 3.4))
bins = np.linspace(0, 2.4, 97)
for i, d in enumerate(DIMS):
    v = DIST[d] / DIST[d].mean()
    ax.hist(v, bins=bins, density=True, histtype="step", lw=1.8, color=C[i], label=f"{d}차원")
ax.set_xlim(0, 2.4)
ax.set_xlabel("쌍 거리 ÷ 평균 거리")
ax.set_ylabel("밀도")
ax.legend(loc="upper right", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert round(RATIO[2], 1) == 94.6 and round(RATIO[1000], 2) == 0.14
    v = DIST[1000] / DIST[1000].mean(); w = DIST[2] / DIST[2].mean()
    assert v.min() > 0.92 and v.max() < 1.07 and w.min() < 0.05 and w.max() > 2.2
    assert all(RATIO[a] > RATIO[b] for a, b in zip(DIMS, DIMS[1:]))
    print("ALL CHECKS PASSED")
```
{% endraw %}
