---
layout: "note"
title: "28_choosing-k_plot.py"
display_title: "28_choosing-k_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "28"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/choosing-k/"
parent_title: "군집 수 고르기"
description: "데이터 과학 · 군집 수 고르기 코드 코드"
permalink: "/studies/data-science/code/28_choosing-k_plot/"
---
{% raw %}
[군집 수 고르기](/Hongs_Blog/studies/data-science/choosing-k/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 군집 수 고르기 문서의 그림을 만든다: 28_choosing-k_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 28_choosing-k_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "28_choosing-k"
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

from itertools import product

X = [1, 2, 3, 10, 11, 12, 20, 21, 22]


def sil(X, lab):
    ks = sorted(set(lab)); out = []
    for i, x in enumerate(X):
        same = [abs(x - y) for j, y in enumerate(X) if lab[j] == lab[i] and j != i]
        if not same:
            out.append(0.0); continue
        a = sum(same) / len(same)
        b = min(sum(abs(x - y) for j, y in enumerate(X) if lab[j] == c) / lab.count(c) for c in ks if c != lab[i])
        out.append((b - a) / max(a, b))
    return out


def best(X, k):                                         # 검증 코드와 같은 순서로 모든 나눔을 시험한다
    bj, bl = None, None
    for lab in product(range(k), repeat=len(X)):
        if len(set(lab)) < k or lab[0] != 0:
            continue
        cents = [sum(x for x, l in zip(X, lab) if l == c) / lab.count(c) for c in range(k)]
        j = sum((x - cents[l]) ** 2 for x, l in zip(X, lab))
        if bj is None or j < bj:
            bj, bl = j, list(lab)
    return bj, bl


res = {k: best(X, k) for k in range(1, 6)}
J = [res[k][0] for k in range(1, 6)]
S = {k: sum(sil(X, res[k][1])) / len(X) for k in range(2, 6)}

# 그림 1: k에 따른 목적 함수 J(엘보)와 평균 실루엣
fig, axes = plt.subplots(1, 2, figsize=(6.5, 2.9))
ax = axes[0]
ax.plot(range(1, 6), J, "o-", color=C[0], lw=2)
ax.plot([3], [J[2]], "o", ms=13, mfc="none", mec=C[1], mew=1.6)
ax.annotate("팔꿈치", xy=(3, J[2]), xytext=(3.4, 200), fontsize=10, arrowprops=dict(arrowstyle="->", color=INK, lw=1))
ax.set_xticks(range(1, 6))
ax.set_xlabel("$k$")
ax.set_title("목적 함수 $J$", fontsize=10)
ax = axes[1]
ax.plot(list(S), list(S.values()), "o-", color=C[2], lw=2)
ax.plot([3], [S[3]], "o", ms=13, mfc="none", mec=C[1], mew=1.6)
ax.set_xticks(range(2, 6))
ax.set_ylim(0, 1)
ax.set_xlabel("$k$")
ax.set_title("평균 실루엣", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert [round(j, 1) for j in J] == [548, 127.5, 6, 4.5, 3]
    assert [round(S[k], 3) for k in range(2, 6)] == [0.665, 0.854, 0.62, 0.392]
    print("ALL CHECKS PASSED")
```
{% endraw %}
