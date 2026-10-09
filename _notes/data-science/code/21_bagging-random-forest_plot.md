---
layout: "note"
title: "21_bagging-random-forest_plot.py"
display_title: "21_bagging-random-forest_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "21"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/bagging-random-forest/"
parent_title: "배깅과 랜덤 포레스트"
description: "데이터 과학 · 배깅과 랜덤 포레스트 코드 코드"
permalink: "/studies/data-science/code/21_bagging-random-forest_plot/"
---
{% raw %}
[배깅과 랜덤 포레스트](/Hongs_Blog/studies/data-science/bagging-random-forest/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 배깅과 랜덤 포레스트 문서의 그림을 만든다: 21_bagging-random-forest_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_bagging-random-forest_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_bagging-random-forest"
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

N, B, NOISE = 40, 50, 0.3
GRID = np.linspace(0, 1, 300)


def f(x):
    return np.sin(2 * np.pi * x)


def nn1(xt, yt, xq):
    return yt[np.abs(xq[:, None] - xt[None, :]).argmin(axis=1)]


def bagged(xt, yt, xq, rng):
    out = np.zeros_like(xq)
    for _ in range(B):
        idx = rng.integers(0, len(xt), len(xt))
        out += nn1(xt[idx], yt[idx], xq)
    return out / B


rng = np.random.default_rng(1)
sets = []
for _ in range(5):
    xt = rng.random(N); yt = f(xt) + rng.normal(0, NOISE, N)
    sets.append((xt, yt))

# 그림 1: 훈련 자료 다섯 벌에서 만든 1-NN 예측(왼쪽)과 배깅 예측(오른쪽)
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3), sharey=True)
for ax, name in zip(axes, ["모델 하나 (1-NN)", "배깅 (50개 평균)"]):
    for i, (xt, yt) in enumerate(sets):
        y = nn1(xt, yt, GRID) if ax is axes[0] else bagged(xt, yt, GRID, rng)
        ax.plot(GRID, y, color=C[i], lw=1, alpha=0.85)
    ax.plot(GRID, f(GRID), color=INK, lw=2.4)
    ax.set_title(name, fontsize=10)
    ax.set_xlabel("$x$")
    ax.set_ylim(-2, 2)
axes[0].text(0.62, 1.55, "굵은 회색: 참 함수", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    chk = np.random.default_rng(7); xs = np.array([0.1, 0.35, 0.6, 0.85])
    S, Bg = [], []
    for _ in range(150):
        xt = chk.random(N); yt = f(xt) + chk.normal(0, NOISE, N)
        S.append(nn1(xt, yt, xs)); Bg.append(bagged(xt, yt, xs, chk))
    S, Bg = np.array(S), np.array(Bg)
    vs, vb = S.var(axis=0).mean(), Bg.var(axis=0).mean()
    bs, bb = ((S.mean(axis=0) - f(xs)) ** 2).mean(), ((Bg.mean(axis=0) - f(xs)) ** 2).mean()
    assert vb < 0.7 * vs and bs < 0.02 and bb < 0.02
    print(f"     분산 {vs:.3f} -> {vb:.3f}, 편향² {bs:.4f} -> {bb:.4f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
