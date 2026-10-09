---
layout: "note"
title: "16_trichromatic-theory_plot.py"
display_title: "16_trichromatic-theory_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "16"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/trichromatic-theory/"
parent_title: "삼색 이론"
description: "휴먼 인터페이스 미디어 · 삼색 이론 코드 코드"
permalink: "/studies/human-interface-media/code/16_trichromatic-theory_plot/"
---
{% raw %}
[삼색 이론](/Hongs_Blog/studies/human-interface-media/trichromatic-theory/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 삼색 이론 문서의 그림을 만든다: 16_trichromatic-theory_fig1.svg, 16_trichromatic-theory_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_trichromatic-theory_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_trichromatic-theory"
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

PEAK = {"S": 445.0, "M": 535.0, "L": 575.0}   # 슬라이드의 봉우리
WIDTH = {"S": 30.0, "M": 45.0, "L": 45.0}     # 가정한 폭 (검증 코드와 같음)
PRIMS = [450.0, 530.0, 620.0]


def sens(cone, lam):
    return np.exp(-((np.asarray(lam, dtype=float) - PEAK[cone]) ** 2) / (2 * WIDTH[cone] ** 2))


P = np.array([[sens(k, p) for p in PRIMS] for k in "SML"])   # 열 = 원색, 행 = 추상체


def match(lam):
    """단색광 lam(세기 1)과 같은 반응을 내는 세 원색의 세기."""
    r = np.array([sens(k, lam) for k in "SML"])
    return np.linalg.solve(P, r)


# 그림 1: 가우스 모형의 세 민감도 곡선. M과 L은 크게 겹치고 S는 떨어져 있다
lam = np.linspace(400, 700, 601)
fig, ax = plt.subplots(figsize=(6, 3.4))
for i, k in enumerate("SML"):
    c = [C[0], C[2], C[1]][i]
    ax.plot(lam, sens(k, lam), color=c, lw=2)
    ax.text(PEAK[k], 1.04, f"{k} ({PEAK[k]:.0f})", color=c, ha="center", fontsize=10)
ax.set_xlim(400, 700)
ax.set_ylim(0, 1.15)
ax.set_xlabel("파장 $\\lambda$ (nm)")
ax.set_ylabel("민감도 $\\sigma_k(\\lambda)$")
save(fig, 1)

# 그림 2: 단색광을 원색 450, 530, 620 nm로 맞출 때 필요한 세기. 0 아래는 섞어서는 못 만든다
lam2 = np.linspace(400, 700, 301)
W = np.array([match(l) for l in lam2])
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.axhspan(-1.2, 0, color=INK, alpha=0.08)
ax.axvspan(480, 510, color=C[1], alpha=0.10)
ax.text(495, 1.55, "청록\n480~510", ha="center", fontsize=9, color=C[1])
names = ["450 nm (파랑)", "530 nm (초록)", "620 nm (빨강)"]
for j, c in enumerate([C[0], C[2], C[1]]):
    ax.plot(lam2, W[:, j], color=c, lw=1.8, label=names[j])
ax.axhline(0, color=INK, lw=0.8)
ax.text(405, -0.9, "음수: 원색만 섞어서는 못 만든다", fontsize=9)
ax.set_xlim(400, 700)
ax.set_ylim(-1.2, 2.0)
ax.set_xlabel("맞출 단색광의 파장 (nm)")
ax.set_ylabel("필요한 원색 세기")
ax.legend(loc="upper right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 단일 변수: 500 nm x 1.353 = 535 nm x 1 (M 반응)
    assert abs(sens("M", 535) / sens("M", 500) - 1.353) < 0.001
    # 480~510 nm의 빨강 세기 -0.37 ~ -0.28
    reds = [match(l)[2] for l in (480, 490, 500, 510)]
    assert all(-0.38 < r < -0.27 for r in reds), reds
    # 400~700 nm, 5 nm 간격 61개 중 58개가 음수 원색을 요구 (원색 파장 자체의 0은 반올림 오차라 뺀다)
    neg = sum(1 for l in range(400, 701, 5) if match(l).min() < -1e-9)
    assert neg == 58, neg
    print("ALL CHECKS PASSED")
```
{% endraw %}
