---
layout: "note"
title: "18_binomial-theorem_plot.py"
display_title: "18_binomial-theorem_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/binomial-theorem/"
parent_title: "이항정리"
description: "이산수학 · 이항정리 그림 생성 코드"
permalink: "/studies/discrete-math/code/18_binomial-theorem_plot/"
---
{% raw %}
[이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이항정리 문서의 그림을 만든다: 18_binomial-theorem_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_binomial-theorem_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_binomial-theorem"
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


# 그림 1: 이항계수 한 줄을 2^n으로 나눈 모양. 가로축은 k/n
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, n in enumerate([4, 10, 20, 50]):
    k = np.arange(n + 1)
    share = np.array([math.comb(n, j) for j in k]) / 2 ** n
    ax.plot(k / n, share * n, "o-", color=C[i], ms=3, lw=1.3, label=f"$n = {n}$")
ax.set_xlabel(r"$k/n$ (부분집합 크기의 비율)")
ax.set_ylabel(r"$n \cdot \binom{n}{k} / 2^n$")
ax.legend(loc="upper right")
save(fig, 1)

if __name__ == "__main__":
    # 한 줄의 합은 2^n, n = 50에서 크기 20~30인 부분집합이 전체의 약 88%
    for n in [4, 10, 20, 50]:
        assert sum(math.comb(n, j) for j in range(n + 1)) == 2 ** n
    mid = sum(math.comb(50, j) for j in range(20, 31)) / 2 ** 50
    assert abs(mid - 0.881) < 0.001
    assert math.comb(4, 2) / 16 == 0.375
    print("ALL CHECKS PASSED")
```
{% endraw %}
