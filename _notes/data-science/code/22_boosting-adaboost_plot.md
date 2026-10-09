---
layout: "note"
title: "22_boosting-adaboost_plot.py"
display_title: "22_boosting-adaboost_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "22"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/boosting-adaboost/"
parent_title: "부스팅과 AdaBoost"
description: "데이터 과학 · 부스팅과 AdaBoost 그림 생성 코드"
permalink: "/studies/data-science/code/22_boosting-adaboost_plot/"
---
{% raw %}
[부스팅과 AdaBoost](/Hongs_Blog/studies/data-science/boosting-adaboost/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 부스팅과 AdaBoost 문서의 그림을 만든다: 22_boosting-adaboost_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 22_boosting-adaboost_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "22_boosting-adaboost"
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

X = list(range(1, 11))
Y = [1, 1, 1, -1, -1, -1, 1, 1, 1, -1]


def stump(t, s):
    return lambda x: s if x <= t else -s


def best_stump(w):
    best = None
    for t in [k + 0.5 for k in range(0, 11)]:
        for s in (1, -1):
            h = stump(t, s)
            err = sum(wi for wi, x, y in zip(w, X, Y) if h(x) != y) / sum(w)
            if best is None or err < best[0] - 1e-12:
                best = (err, t, s, h)
    return best


def adaboost(M):
    w = [1 / len(X)] * len(X); hist = []
    for _ in range(M):
        err, t, s, h = best_stump(w)
        a = 0.5 * math.log((1 - err) / err)
        hist.append((w[:], err, t, s, a, h))
        w = [wi * math.exp(-a * y * h(x)) for wi, x, y in zip(w, X, Y)]
        z = sum(w); w = [wi / z for wi in w]
    return hist, w


hist, w_end = adaboost(3)


def score(x):
    return sum(a * h(x) for _, _, _, _, a, h in hist)


# 그림 1: 라운드마다 점의 무게와 고른 규칙, 그리고 세 모델의 가중 투표
fig, axes = plt.subplots(2, 2, figsize=(6.5, 4.4))
cols = [C[0] if y > 0 else C[1] for y in Y]
for m, ax in enumerate(axes.flat[:3]):
    w, err, t, s, a, h = hist[m]
    ax.bar(X, w, color=cols, width=0.7)
    for x, y in zip(X, Y):
        if h(x) != y:
            ax.text(x, w[x - 1] + 0.008, "×", ha="center", fontsize=11, color=INK)
    ax.axvline(t, color=INK, ls="--", lw=1)
    rule = f"$x \\leq {t}$면 " + ("+" if s > 0 else "-")
    ax.set_title(f"{m + 1}라운드: {rule}, ε = {err:.3f}", fontsize=10)
    ax.set_ylim(0, 0.24)
    ax.set_xticks(X)
axes[0, 0].set_ylabel("점의 무게")
axes[1, 0].set_ylabel("점의 무게")
ax = axes[1, 1]
sc = [score(x) for x in X]
ax.bar(X, sc, color=cols, width=0.7)
ax.axhline(0, color=INK, lw=0.8)
ax.set_title("가중 투표 $\\sum \\alpha_m h_m(x)$", fontsize=10)
ax.set_xticks(X)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    w1 = hist[1][0]
    assert [round(h[1], 3) for h in hist] == [0.3, 0.214, 0.182]
    assert [round(h[4], 3) for h in hist] == [0.424, 0.65, 0.752]
    assert all(abs(w1[i] - 1 / 6) < 1e-12 for i in (6, 7, 8))
    assert all(abs(w1[i] - 1 / 14) < 1e-12 for i in range(10) if i not in (6, 7, 8))
    assert all((score(x) > 0) == (y > 0) for x, y in zip(X, Y))
    print("ALL CHECKS PASSED")
```
{% endraw %}
