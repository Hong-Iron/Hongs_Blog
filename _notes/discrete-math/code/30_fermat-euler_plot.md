---
layout: "note"
title: "30_fermat-euler_plot.py"
display_title: "30_fermat-euler_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "30"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/fermat-euler/"
parent_title: "페르마 소정리와 오일러 정리"
description: "이산수학 · 페르마 소정리와 오일러 정리 그림 생성 코드"
permalink: "/studies/discrete-math/code/30_fermat-euler_plot/"
---
{% raw %}
[페르마 소정리와 오일러 정리](/Hongs_Blog/studies/discrete-math/fermat-euler/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 페르마 소정리와 오일러 정리 문서의 그림을 만든다: 30_fermat-euler_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 30_fermat-euler_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "30_fermat-euler"
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


P_ = 13
TABLE = np.array([[pow(a, k, P_) for k in range(1, P_)] for a in range(1, P_)])


def order(a, n):
    k, x = 1, a % n
    while x != 1:
        x = x * a % n
        k += 1
    return k


# 그림 1: a^k mod 13 표 (a = 1..12, k = 1..12). 값이 1인 칸을 칠했다
fig, ax = plt.subplots(figsize=(6, 4.2))
for i in range(P_ - 1):
    for j in range(P_ - 1):
        v = TABLE[i, j]
        if v == 1:
            ax.add_patch(plt.Rectangle((j + 0.5, i + 0.5), 1, 1, facecolor=C[0], alpha=0.35, lw=0))
        ax.text(j + 1, i + 1, str(v), ha="center", va="center", fontsize=8.5)
ax.set_xlim(0.5, P_ - 0.5)
ax.set_ylim(P_ - 0.5, 0.5)
ax.set_xticks(range(1, P_))
ax.set_yticks(range(1, P_))
ax.set_xlabel("지수 $k$")
ax.set_ylabel("밑 $a$")
ax.xaxis.set_label_position("top")
ax.xaxis.tick_top()
ax.tick_params(length=0)
for s in ax.spines.values():
    s.set_visible(False)
ax.text(P_ - 0.35, 0.15, "주기", fontsize=9, ha="left", va="bottom", color=C[1])
for a in range(1, P_):
    ax.text(P_ - 0.35, a, str(order(a, P_)), fontsize=8.5, ha="left", va="center", color=C[1])
save(fig, 1)

if __name__ == "__main__":
    # 마지막 열(k = 12)은 모두 1, 각 행의 주기는 12의 약수, 주기가 12인 밑은 2, 6, 7, 11. 예시의 3^k mod 7 주기 6
    assert all(TABLE[:, -1] == 1)
    orders = [order(a, P_) for a in range(1, P_)]
    assert all(12 % o == 0 for o in orders)
    assert [a for a in range(1, P_) if order(a, P_) == 12] == [2, 6, 7, 11]
    assert orders == [1, 12, 3, 6, 4, 12, 12, 4, 3, 6, 12, 2]
    assert order(3, 7) == 6 and pow(3, 100, 7) == 4
    print("ALL CHECKS PASSED")
```
{% endraw %}
