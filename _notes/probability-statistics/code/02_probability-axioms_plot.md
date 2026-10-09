---
layout: "note"
title: "02_probability-axioms_plot.py"
display_title: "02_probability-axioms_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "02"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/probability-axioms/"
parent_title: "확률의 공리와 계산"
description: "확률과 통계 · 확률의 공리와 계산 코드 코드"
permalink: "/studies/probability-statistics/code/02_probability-axioms_plot/"
---
{% raw %}
[확률의 공리와 계산](/Hongs_Blog/studies/probability-statistics/probability-axioms/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 확률의 공리와 계산 문서의 그림을 만든다: 02_probability-axioms_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 02_probability-axioms_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "02_probability-axioms"
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


def Phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def p_shared(n, days=365):
    """n명 중 생일이 같은 쌍이 적어도 하나 있을 확률."""
    q = 1.0
    for i in range(n):
        q *= (days - i) / days
    return 1 - q


def p_mine(n, days=365):
    """나머지 n - 1명 중 나와 생일이 같은 사람이 있을 확률."""
    return 1 - ((days - 1) / days) ** (n - 1)


# 그림 1: "누구든 두 사람"과 "나와 같은 생일"의 확률을 인원수에 따라 비교
ns = np.arange(1, 71)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(ns, [p_shared(n) for n in ns], color=C[0], lw=2, label="누구든 두 사람이 같음")
ax.plot(ns, [p_mine(n) for n in ns], color=C[1], lw=2, label="나와 같은 사람이 있음")
ax.axhline(0.5, color=INK, lw=0.6, ls=":")
for n in (23, 57):
    ax.plot(n, p_shared(n), "o", color=C[0], ms=5)
ax.annotate(f"23명: {p_shared(23):.3f}", (23, p_shared(23)), xytext=(28, 0.38), fontsize=10,
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.annotate(f"57명: {p_shared(57):.3f}", (57, p_shared(57)), xytext=(46, 0.78), fontsize=10,
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.annotate(f"23명: {p_mine(23):.3f}", (23, p_mine(23)), xytext=(30, 0.02), fontsize=10,
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.set_xlabel("모인 사람 수")
ax.set_ylabel("확률")
ax.set_ylim(0, 1.05)
ax.legend(loc="upper left")
save(fig, 1)

if __name__ == "__main__":
    assert round(p_shared(23), 4) == 0.5073 and p_shared(22) < 0.5 < p_shared(23)
    assert p_shared(56) < 0.99 < p_shared(57)
    assert abs(p_mine(23) - 0.0586) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
