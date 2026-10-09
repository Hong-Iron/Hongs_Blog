---
layout: "note"
title: "25_k-means_plot.py"
display_title: "25_k-means_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "25"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/k-means/"
parent_title: "k-평균"
description: "데이터 과학 · k-평균 그림 생성 코드"
permalink: "/studies/data-science/code/25_k-means_plot/"
---
{% raw %}
[k-평균](/Hongs_Blog/studies/data-science/k-means/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# k-평균 문서의 그림을 만든다: 25_k-means_fig1.svg, 25_k-means_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_k-means_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_k-means"
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



def assign(P, M):
    return ((P[:, None, :] - M[None, :, :]) ** 2).sum(axis=2).argmin(axis=1)


def cost(P, M, lab):
    return float(((P - M[lab]) ** 2).sum())


def lloyd(P, M, iters=100):
    hist = []
    for _ in range(iters):
        lab = assign(P, M)
        hist.append((M.copy(), lab, cost(P, M, lab)))
        newM = np.array([P[lab == j].mean(axis=0) if (lab == j).any() else M[j] for j in range(len(M))])
        if np.allclose(newM, M):
            break
        M = newM
    return hist


def best_of(P, k, tries, rng):
    best = None
    for _ in range(tries):
        h = lloyd(P, P[rng.choice(len(P), k, replace=False)].astype(float))
        if best is None or h[-1][2] < best[-1][2]:
            best = h
    return best


def stripes():                                          # 길쭉한 두 무리 (29.가우스 혼합 모델 그림과 같은 자료)
    rng = np.random.default_rng(5)
    a = np.column_stack([rng.normal(0, 3, 150), rng.normal(0, 0.35, 150)])
    b = np.column_stack([rng.normal(0, 3, 150), rng.normal(2.2, 0.35, 150)])
    th = math.radians(25); R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
    return np.vstack([a, b]) @ R.T, np.repeat([0, 1], 150)


def accuracy(lab, truth):
    a = (lab == truth).mean()
    return max(a, 1 - a)


# 그림 1: 둥근 세 무리에서 k-평균의 반복
rng = np.random.default_rng(3)
CENT = np.array([[0, 0], [4, 0], [2, 3.5]])
P = np.vstack([rng.normal(c, 0.6, (30, 2)) for c in CENT])
TRUTH = np.repeat([0, 1, 2], 30)
M0 = np.array([[-0.5, -0.6], [0.4, 0.6], [0.8, -0.4]])
H = lloyd(P, M0)
fig, axes = plt.subplots(1, 3, figsize=(6.5, 2.6), sharex=True, sharey=True)
for ax, step, title in [(axes[0], 0, "처음 배정"), (axes[1], 1, "1회 갱신 뒤"), (axes[2], len(H) - 1, "멈춤")]:
    M, lab, J = H[step]
    for j in range(3):
        ax.plot(*P[lab == j].T, "o", ms=3.5, color=C[j], alpha=0.8)
    if step == len(H) - 1:
        trail = np.array([h[0] for h in H])
        for j in range(3):
            ax.plot(trail[:, j, 0], trail[:, j, 1], "-", color=INK, lw=1)
    ax.plot(*M.T, "X", ms=10, color=INK, mec="white", mew=0.8)
    ax.set_title(f"{title}\n$J$ = {J:.0f}", fontsize=10)
    ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
fig.tight_layout()
save(fig, 1)

# 그림 2: 길쭉한 두 무리에서 k-평균 (여러 번 다시 시작한 가장 좋은 답)
S, ST = stripes()
HB = best_of(S, 2, 10, np.random.default_rng(0))
MB, LB, JB = HB[-1]
fig, axes = plt.subplots(1, 2, figsize=(6.5, 2.9), sharex=True, sharey=True)
for ax, lab, title in [(axes[0], ST, "실제 무리"), (axes[1], LB, f"k-평균 결과 ($J$ = {JB:.0f})")]:
    for j in range(2):
        ax.plot(*S[lab == j].T, "o", ms=3, color=C[j], alpha=0.75)
    ax.set_title(title, fontsize=10)
    ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
axes[1].plot(*MB.T, "X", ms=10, color=INK, mec="white", mew=0.8)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    Js = [h[2] for h in H]
    assert all(a >= b - 1e-9 for a, b in zip(Js, Js[1:])) and len(H) >= 3
    fin = H[-1][1]
    assert all(len(set(fin[TRUTH == j])) == 1 for j in range(3)) and len({fin[TRUTH == j][0] for j in range(3)}) == 3
    Jtruth = cost(S, np.array([S[ST == j].mean(axis=0) for j in range(2)]), ST)
    assert JB < Jtruth and accuracy(LB, ST) < 0.75
    print(f"     세 무리: J {[round(j) for j in Js]} / 길쭉한 무리: k-평균 J {JB:.0f} < 실제 나눔 J {Jtruth:.0f}, 맞힌 비율 {accuracy(LB, ST):.2f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
