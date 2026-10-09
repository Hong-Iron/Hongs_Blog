---
layout: "note"
title: "22_spectral-theorem_plot.py"
display_title: "22_spectral-theorem_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "22"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/spectral-theorem/"
parent_title: "대칭행렬과 스펙트럼 정리"
description: "선형대수학 · 대칭행렬과 스펙트럼 정리 그림 생성 코드"
permalink: "/studies/linear-algebra/code/22_spectral-theorem_plot/"
---
{% raw %}
[대칭행렬과 스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 대칭행렬과 스펙트럼 정리 문서의 그림을 만든다: 22_spectral-theorem_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 22_spectral-theorem_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "22_spectral-theorem"
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


S = np.array([[2, 1], [1, 2]])
N = np.array([[1, 1], [0, 2]])
th = np.linspace(0, 2 * np.pi, 400)
circle = np.vstack([np.cos(th), np.sin(th)])


def panel(ax, M, eigvecs, title):
    img = M @ circle
    ax.plot(*circle, color=INK, lw=1, ls="--")
    ax.plot(*img, color=C[0], lw=1.8)
    for (v, lam), col in zip(eigvecs, (C[1], C[2])):
        v = np.array(v, float) / np.linalg.norm(v)
        ax.plot(*np.outer([-3.4, 3.4], v).T, color=col, lw=0.8, alpha=0.6)
        arrow(ax, (0, 0), lam * v, col, lw=2)
    ax.set_aspect("equal")
    ax.set_xlim(-3.4, 3.4)
    ax.set_ylim(-3.4, 3.4)
    ax.set_xticks([-2, 0, 2])
    ax.set_yticks([-2, 0, 2])
    ax.set_title(title, fontsize=10)


# 그림 1: 단위원(점선)이 가는 곳. 대칭이면 고유벡터가 수직이고 타원의 축과 겹친다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.4))
panel(a1, S, [((1, 1), 3), ((1, -1), 1)], "대칭: [[2, 1], [1, 2]]")
a1.text(2.25, 1.6, r"$\lambda = 3$", color=C[1], fontsize=10)
a1.text(0.85, -1.1, r"$\lambda = 1$", color=C[2], fontsize=10)
panel(a2, N, [((1, 0), 1), ((1, 1), 2)], "대칭 아님: [[1, 1], [0, 2]]")
a2.text(1.0, -0.45, r"$\lambda = 1$", color=C[1], fontsize=10)
a2.text(1.55, 1.05, r"$\lambda = 2$", color=C[2], fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    w, Q = np.linalg.eigh(S)
    assert np.allclose(w, [1, 3]) and abs(Q[:, 0] @ Q[:, 1]) < 1e-12
    # 타원의 가장 긴 반지름은 (1, 1) 방향으로 3
    img = S @ circle
    k = np.argmax(np.linalg.norm(img, axis=0))
    assert abs(np.linalg.norm(img[:, k]) - 3) < 1e-3 and abs(abs(img[0, k]) - abs(img[1, k])) < 0.05
    assert np.allclose(N @ [1, 0], [1, 0]) and np.allclose(N @ [1, 1], [2, 2])
    u_major = np.linalg.svd(N)[0][:, 0]                    # 대칭 아닌 쪽: 타원의 긴 축이 고유벡터와 겹치지 않음
    for e in ([1, 0], [1, 1]):
        e = np.array(e) / np.linalg.norm(e)
        assert abs(abs(u_major @ e) - 1) > 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
