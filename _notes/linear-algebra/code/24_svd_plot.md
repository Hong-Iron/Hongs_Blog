---
layout: "note"
title: "24_svd_plot.py"
display_title: "24_svd_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "24"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/svd/"
parent_title: "특잇값 분해"
description: "선형대수학 · 특잇값 분해 코드 코드"
permalink: "/studies/linear-algebra/code/24_svd_plot/"
---
{% raw %}
[특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 특잇값 분해 문서의 그림을 만든다: 24_svd_fig1.svg, 24_svd_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 24_svd_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "24_svd"
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


A = np.array([[3.0, 0.0], [4.0, 5.0]])
v1 = np.array([1, 1]) / math.sqrt(2)
v2 = np.array([-1, 1]) / math.sqrt(2)
s1, s2 = 3 * math.sqrt(5), math.sqrt(5)
u1 = np.array([1, 3]) / math.sqrt(10)
u2 = np.array([-3, 1]) / math.sqrt(10)
th = np.linspace(0, 2 * np.pi, 400)
circle = np.vstack([np.cos(th), np.sin(th)])

# 그림 1: 수직인 입력 축 v1, v2(왼쪽)가 수직인 출력 축 σ1·u1, σ2·u2(오른쪽)로 간다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.4), gridspec_kw={"width_ratios": [1, 2]})
a1.plot(*circle, color=C[0], lw=1.6)
arrow(a1, (0, 0), v1, C[1], lw=2)
arrow(a1, (0, 0), v2, C[2], lw=2)
a1.text(0.75, 0.6, r"$\mathbf{v}_1$", color=C[1], fontsize=11)
a1.text(-1.0, 0.6, r"$\mathbf{v}_2$", color=C[2], fontsize=11)
a1.set_xlim(-1.4, 1.4)
a1.set_ylim(-1.4, 1.4)
a1.set_title("입력: 단위원", fontsize=10)
a2.plot(*(A @ circle), color=C[0], lw=1.6)
arrow(a2, (0, 0), s1 * u1, C[1], lw=2)
arrow(a2, (0, 0), s2 * u2, C[2], lw=2)
a2.text(2.4, 5.3, r"$\sigma_1\mathbf{u}_1$, $\sigma_1 = 3\sqrt{5} \approx 6.71$", color=C[1], fontsize=10)
a2.text(-3.3, 1.0, r"$\sigma_2\mathbf{u}_2$" + "\n" + r"$\sigma_2 = \sqrt{5} \approx 2.24$", color=C[2], fontsize=10, ha="right", va="bottom")
a2.set_xlim(-9, 9)
a2.set_ylim(-7, 7)
a2.set_title(r"출력: $A$를 곱한 타원", fontsize=10)
for ax in (a1, a2):
    ax.set_aspect("equal")
    ax.axhline(0, color=INK, lw=0.5)
    ax.axvline(0, color=INK, lw=0.5)
fig.tight_layout()
save(fig, 1)

# 그림 2: 100×100 합성 이미지를 랭크 k로 줄인 결과
n = 100
yy, xx = np.mgrid[0:n, 0:n] / n
img = 0.5 * xx + 0.3 * np.sin(6 * yy)
img[(xx - 0.35) ** 2 + (yy - 0.4) ** 2 < 0.04] = 1.0           # 원
img[60:85, 55:90] = 0.0                                          # 직사각형
U, sv, Vt = np.linalg.svd(img)
ranks = [1, 5, 20]
fig, axs = plt.subplots(1, 4, figsize=(6.5, 1.9))
rel = {}
for ax, k in zip(axs, ranks + [None]):
    Ak = img if k is None else (U[:, :k] * sv[:k]) @ Vt[:k]
    ax.imshow(Ak, cmap="gray", vmin=0, vmax=1)
    ax.set_xticks([])
    ax.set_yticks([])
    if k is None:
        ax.set_title(f"원본, 수 {n * n:,}개", fontsize=9)
    else:
        rel[k] = np.linalg.norm(img - Ak) / np.linalg.norm(img)
        ax.set_title(f"랭크 {k}, 수 {k * (2 * n + 1):,}개", fontsize=9)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    assert np.allclose(A @ v1, s1 * u1) and np.allclose(A @ v2, s2 * u2)
    assert np.allclose(np.linalg.svd(A, compute_uv=False), [s1, s2])
    # 랭크 k 근사의 상대 오차(성분 제곱합 기준)는 버린 특잇값으로 정해진다
    for k, e in rel.items():
        assert abs(e - math.sqrt((sv[k:] ** 2).sum() / (sv ** 2).sum())) < 1e-12
    assert rel[1] > rel[5] > rel[20] and rel[20] < 0.1
    print("상대 오차:", {k: round(float(v), 3) for k, v in rel.items()})
    assert abs(20 * (2 * n + 1) / (n * n) - 0.402) < 1e-9 and rel[20] < 0.003
    print("ALL CHECKS PASSED")
```
{% endraw %}
