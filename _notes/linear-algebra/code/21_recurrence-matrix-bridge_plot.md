---
layout: "note"
title: "21_recurrence-matrix-bridge_plot.py"
display_title: "21_recurrence-matrix-bridge_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "21"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/recurrence-matrix-bridge/"
parent_title: "선형 점화식 ↔ 행렬 거듭제곱"
description: "선형대수학 · 선형 점화식 ↔ 행렬 거듭제곱 그림 생성 코드"
permalink: "/studies/linear-algebra/code/21_recurrence-matrix-bridge_plot/"
---
{% raw %}
[선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형 점화식 ↔ 행렬 거듭제곱 문서의 그림을 만든다: 21_recurrence-matrix-bridge_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_recurrence-matrix-bridge_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_recurrence-matrix-bridge"
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


phi = (1 + math.sqrt(5)) / 2
psi = (1 - math.sqrt(5)) / 2
F = [0, 1]
for _ in range(30):
    F.append(F[-1] + F[-2])
ns = np.arange(1, 16)
ratio = np.array([F[n + 1] / F[n] for n in ns])

# 그림 1: 왼쪽은 F(n+1)/F(n)이 φ의 위아래를 번갈아 가며 다가가는 모습, 오른쪽은 그 차이(로그 눈금)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
a1.plot(ns, ratio, "o-", color=C[0], ms=4, lw=1.2)
a1.axhline(phi, color=C[1], lw=1, ls="--")
a1.text(15, phi + 0.03, r"$\varphi \approx 1.618$", color=C[1], fontsize=10, ha="right", va="bottom")
a1.set_xlabel("$n$")
a1.set_ylabel(r"$F_{n+1} / F_n$")
a1.set_ylim(0.9, 2.1)
gap = np.abs(ratio - phi)
a2.semilogy(ns, gap, "o-", color=C[0], ms=4, lw=1.2)
a2.set_xlabel("$n$")
a2.set_ylabel(r"$|F_{n+1}/F_n - \varphi|$")
a2.text(6.5, 0.15, r"한 번에 약 $\varphi^2 \approx 2.6$배씩 줄어든다", fontsize=9)
pow10 = matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(np.log10(v)))}}}$")
a2.yaxis.set_major_formatter(pow10)
a2.yaxis.set_minor_locator(matplotlib.ticker.NullLocator())
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert F[10] == 55
    Q = np.array([[1, 1], [1, 0]], dtype=object)
    Qn = np.identity(2, dtype=object)
    for _ in range(10):
        Qn = Qn.dot(Q)
    assert Qn.tolist() == [[89, 55], [55, 34]]
    assert all((ratio[i] - phi) * (ratio[i + 1] - phi) < 0 for i in range(len(ratio) - 1))   # 위아래 번갈아
    shrink = gap[:-1] / gap[1:]
    assert abs(shrink[-1] - phi ** 2) < 1e-3
    assert abs(psi / phi + 1 / phi ** 2) < 1e-12          # |ψ/φ| = 1/φ²
    print("ALL CHECKS PASSED")
```
{% endraw %}
