---
layout: "note"
title: "36_contrast--pca-nmf_plot.py"
display_title: "36_contrast--pca-nmf_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "36"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/contrast--pca-nmf/"
parent_title: "PCA와 NMF 비교"
description: "데이터 과학 · PCA와 NMF 비교 코드 코드"
permalink: "/studies/data-science/code/36_contrast--pca-nmf_plot/"
---
{% raw %}
[PCA와 NMF 비교](/Hongs_Blog/studies/data-science/contrast--pca-nmf/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# PCA와 NMF 비교 문서의 그림을 만든다: 36_contrast--pca-nmf_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 36_contrast--pca-nmf_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "36_contrast--pca-nmf"
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

X = [[5, 3, 4, 0, 1, 0], [4, 4, 3, 0, 0, 1], [3, 5, 4, 1, 0, 0],
     [0, 1, 0, 4, 5, 3], [1, 0, 0, 5, 3, 4], [0, 0, 1, 3, 4, 5]]
WORDS = ["공", "골", "경기", "맛", "불", "냄비"]


def matmul(A, B):
    return [[sum(a * b for a, b in zip(r, c)) for c in zip(*B)] for r in A]


def T(A):
    return [list(r) for r in zip(*A)]


def nmf(X, k, iters=800, seed=0):                      # 35_nmf-clustering_impl.py와 같은 곱셈 갱신과 시작값
    rnd = random.Random(seed); n, d = len(X), len(X[0]); eps = 1e-12
    W = [[rnd.random() + 0.1 for _ in range(k)] for _ in range(n)]
    H = [[rnd.random() + 0.1 for _ in range(d)] for _ in range(k)]
    for _ in range(iters):
        WtX = matmul(T(W), X); WtWH = matmul(matmul(T(W), W), H)
        H = [[H[a][j] * WtX[a][j] / (WtWH[a][j] + eps) for j in range(d)] for a in range(k)]
        XHt = matmul(X, T(H)); WHHt = matmul(W, matmul(H, T(H)))
        W = [[W[i][a] * XHt[i][a] / (WHHt[i][a] + eps) for a in range(k)] for i in range(n)]
    return np.array(W), np.array(H)


W, H = nmf(X, 2)
Xa = np.array(X, float); Xc = Xa - Xa.mean(axis=0)
w, V = np.linalg.eigh(Xc.T @ Xc)
pc1 = V[:, -1] * np.sign(V[3:, -1].sum())               # 요리 단어 쪽을 +로

# 그림 1: PCA 첫 성분의 가중치(왼쪽)와 NMF 두 성분의 가중치(오른쪽)
x = np.arange(6)
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
ax = axes[0]
ax.bar(x, pc1, color=[C[1] if v < 0 else C[0] for v in pc1], width=0.65)
ax.axhline(0, color=INK, lw=0.8)
ax.set_title("PCA 첫 성분", fontsize=10)
ax = axes[1]
order = np.argsort([-H[a, :3].sum() for a in range(2)])  # 스포츠 성분을 먼저
for i, a in enumerate(order):
    ax.bar(x + (i - 0.5) * 0.36, H[a], width=0.36, color=C[2 + i], label=["성분: 스포츠", "성분: 요리"][i])
ax.axhline(0, color=INK, lw=0.8)
ax.set_title("NMF 두 성분 ($H$의 행)", fontsize=10)
ax.set_ylim(0, 4.6)
ax.legend(loc="upper right", fontsize=9)
for ax in axes:
    ax.set_xticks(x); ax.set_xticklabels(WORDS)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert [round(v, 2) for v in pc1] == [-0.41, -0.41, -0.38, 0.41, 0.41, 0.42]
    assert (W >= 0).all() and (H >= 0).all()
    lab = W.argmax(axis=1)
    assert len(set(lab[:3])) == 1 and len(set(lab[3:])) == 1 and lab[0] != lab[3]
    print("ALL CHECKS PASSED")
```
{% endraw %}
