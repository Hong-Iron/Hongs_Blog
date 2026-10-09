---
layout: "note"
title: "31_dbscan_plot.py"
display_title: "31_dbscan_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "31"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/dbscan/"
parent_title: "DBSCAN"
description: "데이터 과학 · DBSCAN 그림 생성 코드"
permalink: "/studies/data-science/code/31_dbscan_plot/"
---
{% raw %}
[DBSCAN](/Hongs_Blog/studies/data-science/dbscan/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# DBSCAN 문서의 그림을 만든다: 31_dbscan_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 31_dbscan_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "31_dbscan"
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

EPS, MINPTS = 1.0, 3


def dbscan(P, eps, minpts):
    n = len(P); D = np.sqrt(((P[:, None] - P[None]) ** 2).sum(axis=2))
    nb = [np.flatnonzero(D[i] <= eps) for i in range(n)]
    core = np.array([len(v) >= minpts for v in nb])
    lab = np.full(n, -1); c = 0
    for i in range(n):
        if not core[i] or lab[i] != -1:
            continue
        lab[i] = c; st = [i]
        while st:
            j = st.pop()
            for q in nb[j]:
                if lab[q] == -1:
                    lab[q] = c
                    if core[q]:
                        st.append(q)
        c += 1
    return lab, core


def kmeans2(P, rng, tries=10):
    best = None
    for _ in range(tries):
        M = P[rng.choice(len(P), 2, replace=False)].astype(float)
        for _ in range(100):
            L = ((P[:, None] - M[None]) ** 2).sum(axis=2).argmin(axis=1)
            M = np.array([P[L == j].mean(axis=0) if (L == j).any() else M[j] for j in range(2)])
        J = ((P - M[L]) ** 2).sum()
        if best is None or J < best[0]:
            best = (J, L)
    return best[1]


rng = np.random.default_rng(4)
t = np.arange(40) / 40 * 2 * np.pi
RING = np.column_stack([5 * np.cos(t), 5 * np.sin(t)])
BLOB = rng.uniform(-0.5, 0.5, (15, 2))
BORDER = np.array([[0, 5.8], [-5.8, 0]])                # 고리 점 하나에만 닿는 점 두 개
NOISE = np.array([[8, 7], [-8, -6.5], [7.5, -7.5]])     # 어디에도 닿지 않는 점 세 개
P = np.vstack([RING, BLOB, BORDER, NOISE])
lab, core = dbscan(P, EPS, MINPTS)
km = kmeans2(P, np.random.default_rng(0))

# 그림 1: 고리 + 가운데 덩어리를 k-평균(k = 2)과 DBSCAN(Eps 1, MinPts 3)으로 묶은 결과
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3.3), sharex=True, sharey=True)
ax = axes[0]
for j in range(2):
    ax.plot(*P[km == j].T, "o", ms=4, color=C[j])
ax.set_title("k-평균 ($k$ = 2)", fontsize=10)
ax = axes[1]
for j in range(lab.max() + 1):
    m = lab == j
    ax.plot(*P[m & core].T, "o", ms=4, color=C[j])
    ax.plot(*P[m & ~core].T, "o", ms=6, mfc="none", mec=C[j], mew=1.4)
ax.plot(*P[lab == -1].T, "x", ms=7, color=INK, mew=1.5)
ax.set_title("DBSCAN", fontsize=10)
ax.text(0.5, -0.04, "속 찬 점: 핵심점 · 빈 원: 경계점 · ×: 잡음", fontsize=9, ha="center", va="top", transform=ax.transAxes)
for ax in axes:
    ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    r, b = lab[:40], lab[40:55]
    assert len(set(r)) == 1 and len(set(b)) == 1 and r[0] != b[0] and r[0] >= 0 and b[0] >= 0
    assert all(lab[55:57] == r[0]) and not core[55:57].any() and all(lab[57:] == -1)
    assert core[:55].all() and lab.max() == 1
    kr, kb = km[:40], km[40:55]
    assert not (len(set(kr)) == 1 and len(set(kb)) == 1 and kr[0] != kb[0])
    print("ALL CHECKS PASSED")
```
{% endraw %}
