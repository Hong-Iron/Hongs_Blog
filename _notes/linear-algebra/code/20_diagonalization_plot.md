---
layout: "note"
title: "20_diagonalization_plot.py"
display_title: "20_diagonalization_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "20"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/diagonalization/"
parent_title: "대각화와 행렬 거듭제곱"
description: "선형대수학 · 대각화와 행렬 거듭제곱 코드 코드"
permalink: "/studies/linear-algebra/code/20_diagonalization_plot/"
---
{% raw %}
[대각화와 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/diagonalization/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 대각화와 행렬 거듭제곱 문서의 그림을 만든다: 20_diagonalization_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_diagonalization_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_diagonalization"
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


def arrow(ax, start, vec, color, lw=1.8, ls="-"):
    """start에서 vec만큼 가는 화살표"""
    ax.annotate("", xy=(start[0] + vec[0], start[1] + vec[1]), xytext=(start[0], start[1]),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, ls=ls, shrinkA=0, shrinkB=0,
                                mutation_scale=12))


A = np.array([[0.8, 0.3], [0.2, 0.7]])
X = np.array([[0.6, 1], [0.4, -1]])
starts = [np.array([1.0, 0.0]), np.array([0.0, 1.0]), np.array([0.3, 0.7])]
names = ["출발 (1, 0)", "출발 (0, 1)", "출발 (0.3, 0.7)"]
K = 12
ks = np.arange(K + 1)


def run(u0):
    us = [u0]
    for _ in range(K):
        us.append(A @ us[-1])
    return np.array(us)


# 그림 1: 왼쪽은 도심 비율, 오른쪽은 1/2 성분의 크기 |c2|·(1/2)^k (로그 눈금)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
for i, u0 in enumerate(starts):
    us = run(u0)
    c = np.linalg.solve(X, u0)
    a1.plot(ks, us[:, 0], "o-", color=C[i + 1], ms=3, lw=1.2, label=names[i])
    a2.semilogy(ks, np.abs(c[1]) * 0.5 ** ks, "o-", color=C[i + 1], ms=3, lw=1.2)
a1.axhline(0.6, color=C[0], lw=1, ls="--")
a1.text(K, 0.62, "0.6", color=C[0], fontsize=9, ha="right", va="bottom")
a1.set_xlabel("햇수 $k$")
a1.set_ylabel("도심 비율")
a1.set_ylim(-0.05, 1.05)
a1.legend(fontsize=8, loc="lower right")
a2.set_xlabel("햇수 $k$")
a2.set_ylabel(r"$\lambda = 1/2$ 성분의 크기")
a2.text(6, 0.02, "해마다 절반", fontsize=9)
pow10 = matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(np.log10(v)))}}}$")
a2.yaxis.set_major_formatter(pow10)
a2.yaxis.set_minor_locator(matplotlib.ticker.NullLocator())
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    us = run(starts[0])
    c = np.linalg.solve(X, starts[0])
    assert np.allclose(c, [1, 0.4])                      # (1, 0) = 1·(0.6, 0.4) + 0.4·(1, -1)
    for k in range(K + 1):
        assert np.allclose(us[k], X @ (np.array([1, 0.5 ** k]) * c))
    assert np.allclose(np.linalg.matrix_power(A, 60), [[0.6, 0.6], [0.4, 0.4]])
    print("ALL CHECKS PASSED")
```
{% endraw %}
