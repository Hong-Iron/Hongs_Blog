---
layout: "note"
title: "38_spectral-clustering_plot.py"
display_title: "38_spectral-clustering_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "38"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/spectral-clustering/"
parent_title: "스펙트럼 군집화"
description: "데이터 과학 · 스펙트럼 군집화 그림 생성 코드"
permalink: "/studies/data-science/code/38_spectral-clustering_plot/"
---
{% raw %}
[스펙트럼 군집화](/Hongs_Blog/studies/data-science/spectral-clustering/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 스펙트럼 군집화 문서의 그림을 만든다: 38_spectral-clustering_fig1.svg(두 삼각형), 38_spectral-clustering_fig2.svg(두 고리)
# 실행: ~/.venvs/vault-plots/bin/python 38_spectral-clustering_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "38_spectral-clustering"
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



def fiedler(Wm):
    """L f = λ D f의 둘째로 작은 고유벡터 (정규화 라플라시안 D^-1/2 L D^-1/2로 구한 뒤 f = D^-1/2 g)."""
    d = Wm.sum(axis=1); Dm = np.diag(d ** -0.5)
    Ln = Dm @ (np.diag(d) - Wm) @ Dm
    lam, G = np.linalg.eigh(Ln)
    return lam, Dm @ G[:, 1]


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


def acc(lab, truth):
    a = (lab == truth).mean()
    return max(a, 1 - a)


# 그림 2: 반지름 1과 3인 두 고리. k-평균과 스펙트럼 군집화(가우스 커널, σ = 0.4)
rng = np.random.default_rng(2)
t = rng.uniform(0, 2 * np.pi, 200); r = np.repeat([1.0, 3.0], 100) + rng.normal(0, 0.1, 200)
P = np.column_stack([r * np.cos(t), r * np.sin(t)]); TRUTH = np.repeat([0, 1], 100)
D2 = ((P[:, None] - P[None]) ** 2).sum(axis=2)
Wk = np.exp(-D2 / (2 * 0.4 ** 2)); np.fill_diagonal(Wk, 0)
_, f = fiedler(Wk)
SP = (f > 0).astype(int)
KM = kmeans2(P, np.random.default_rng(0))
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3.2), sharex=True, sharey=True)
for ax, lab, name in [(axes[0], KM, "k-평균 ($k$ = 2)"), (axes[1], SP, "스펙트럼 군집화")]:
    for j in range(2):
        ax.plot(*P[lab == j].T, "o", ms=3.5, color=C[j])
    ax.set_title(name, fontsize=10)
    ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
fig.tight_layout()
save(fig, 2)

# 그림 1: 두 삼각형 {0, 1, 2}, {3, 4, 5}를 선 2-3으로 이은 그래프의 둘째 고유벡터
E = [(0, 1), (0, 2), (1, 2), (3, 4), (3, 5), (4, 5), (2, 3)]
Wt = np.zeros((6, 6))
for a, b in E:
    Wt[a, b] = Wt[b, a] = 1
lam_t, ft = fiedler(Wt)
ft = ft * np.sign(ft[5])
fig, ax = plt.subplots(figsize=(6, 2.8))
ax.bar(range(6), ft, color=[C[0] if v > 0 else C[1] for v in ft], width=0.6)
ax.axhline(0, color=INK, lw=0.8)
ax.set_xticks(range(6))
ax.set_xlabel("꼭짓점")
ax.set_ylabel("고유벡터의 값")
ax.text(2, ft[2] - 0.03, "다리 끝", ha="center", va="top", fontsize=9)
ax.text(3, ft[3] + 0.03, "다리 끝", ha="center", va="bottom", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    assert acc(SP, TRUTH) == 1.0 and acc(KM, TRUTH) < 0.8
    assert set(np.flatnonzero(ft < 0)) == {0, 1, 2} and set(np.flatnonzero(ft > 0)) == {3, 4, 5}
    assert abs(lam_t[0]) < 1e-12 and abs(ft[2]) < abs(ft[0]) and abs(ft[3]) < abs(ft[5])
    Lt = np.diag(Wt.sum(axis=1)) - Wt                    # L f = λ D f 확인
    assert np.allclose(Lt @ ft, lam_t[1] * np.diag(Wt.sum(axis=1)) @ ft)
    print(f"     고리: 스펙트럼 {acc(SP, TRUTH):.2f}, k-평균 {acc(KM, TRUTH):.2f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
