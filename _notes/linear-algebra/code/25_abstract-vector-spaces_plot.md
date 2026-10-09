---
layout: "note"
title: "25_abstract-vector-spaces_plot.py"
display_title: "25_abstract-vector-spaces_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "25"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/abstract-vector-spaces/"
parent_title: "추상 벡터공간과 베지어 곡선"
description: "선형대수학 · 추상 벡터공간과 베지어 곡선 코드 코드"
permalink: "/studies/linear-algebra/code/25_abstract-vector-spaces_plot/"
---
{% raw %}
[추상 벡터공간과 베지어 곡선](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 추상 벡터공간과 베지어 곡선 문서의 그림을 만든다: 25_abstract-vector-spaces_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_abstract-vector-spaces_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_abstract-vector-spaces"
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


P = np.array([[0, 0], [1, 2], [2, 0]], dtype=float)
t = np.linspace(0, 1, 200)
B = np.vstack([(1 - t) ** 2, 2 * t * (1 - t), t ** 2])  # 2차 베른슈타인 기저
curve = B.T @ P

# 그림 1: 왼쪽은 세 기저 함수(합이 늘 1), 오른쪽은 그 함수들로 조절점을 섞은 곡선과 t = 1/2의 드 카스텔조 작도
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
labels = [r"$(1-t)^2$", r"$2t(1-t)$", r"$t^2$"]
for i in range(3):
    a1.plot(t, B[i], color=C[i], lw=1.8)
a1.text(0.1, 0.84, labels[0], color=C[0], fontsize=10, va="bottom")
a1.text(0.5, 0.53, labels[1], color=C[1], fontsize=10, ha="center")
a1.text(0.97, 0.55, labels[2], color=C[2], fontsize=10, ha="right")
a1.axvline(0.5, color=INK, lw=0.6, ls=":")
a1.set_xlabel("$t$")
a1.set_ylim(0, 1.05)
a1.set_xticks([0, 0.5, 1])
a1.set_title("베른슈타인 기저", fontsize=10)

a2.plot(P[:, 0], P[:, 1], "o--", color=INK, lw=1, ms=5)
for i, (dx, dy) in enumerate([(-0.15, 0.08), (0, 0.1), (0.15, 0.08)]):
    a2.text(P[i, 0] + dx, P[i, 1] + dy, f"$P_{i}$", fontsize=10, ha="center")
m01, m12 = (P[0] + P[1]) / 2, (P[1] + P[2]) / 2
mid = (m01 + m12) / 2
a2.plot([m01[0], m12[0]], [m01[1], m12[1]], "o-", color=C[1], lw=1, ms=4)
a2.plot(curve[:, 0], curve[:, 1], color=C[0], lw=2)
a2.plot(*mid, "o", color=C[3], ms=7)
a2.text(mid[0], mid[1] - 0.25, r"$\mathbf{P}(\frac{1}{2}) = (1, 1)$", color=C[3], fontsize=10, ha="center", va="top")
a2.set_aspect("equal")
a2.set_xlim(-0.3, 2.3)
a2.set_ylim(-0.2, 2.4)
a2.set_title("2차 베지어 곡선", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert np.allclose(B.sum(axis=0), 1) and (B >= 0).all()
    assert np.allclose(mid, [1, 1]) and np.allclose(m01, [0.5, 1]) and np.allclose(m12, [1.5, 1])
    assert np.allclose(curve[np.argmin(np.abs(t - 0.5))], [1, 1], atol=1e-2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
