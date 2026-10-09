---
layout: "note"
title: "03_categorical-dissimilarity_plot.py"
display_title: "03_categorical-dissimilarity_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "03"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/categorical-dissimilarity/"
parent_title: "범주형 속성의 비유사도"
description: "데이터 과학 · 범주형 속성의 비유사도 코드 코드"
permalink: "/studies/data-science/code/03_categorical-dissimilarity_plot/"
---
{% raw %}
[범주형 속성의 비유사도](/Hongs_Blog/studies/data-science/categorical-dissimilarity/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 범주형 속성의 비유사도 문서의 그림을 만든다: 03_categorical-dissimilarity_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 03_categorical-dissimilarity_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "03_categorical-dissimilarity"
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

Q, RS = 1, 2                                            # Jack과 Jim: 둘 다 1인 칸 1개, 한쪽만 1인 칸 2개


def sym(t):
    return RS / (Q + RS + t)


def asym(t):
    return RS / (Q + RS)


# 그림 1: 둘 다 0인 칸 t를 늘릴 때 두 비유사도
t = np.unique(np.round(np.logspace(0, 4, 300)).astype(int))
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.plot(t, [sym(v) for v in t], color=C[0], lw=2, label="대칭 비유사도 (둘 다 0인 칸도 셈)")
ax.plot(t, [asym(v) for v in t], color=C[1], lw=2, label="비대칭 비유사도 (둘 다 0인 칸을 뺌)")
ax.plot([3], [sym(3)], "o", color=C[0])
ax.plot([3], [asym(3)], "o", color=C[1])
ax.annotate("Jack과 Jim\n(둘 다 0인 칸 3개)", xy=(3, sym(3)), xytext=(9, 0.38), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=1))
ax.set_xscale("log")
ax.set_ylim(0, 0.8)
ax.set_xlabel("둘 다 0인 칸의 수 $t$")
ax.set_ylabel("비유사도")
ax.legend(loc="center right", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert abs(sym(3) - 1 / 3) < 1e-12 and abs(asym(3) - 2 / 3) < 1e-12
    assert sym(10000) < 0.001 and asym(10000) == asym(0)
    print("ALL CHECKS PASSED")
```
{% endraw %}
