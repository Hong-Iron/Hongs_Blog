---
layout: "note"
title: "37_entropy_plot.py"
display_title: "37_entropy_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "37"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/entropy/"
parent_title: "엔트로피"
description: "확률과 통계 · 엔트로피 그림 생성 코드"
permalink: "/studies/probability-statistics/code/37_entropy_plot/"
---
{% raw %}
[엔트로피](/Hongs_Blog/studies/probability-statistics/entropy/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 엔트로피 문서의 그림을 만든다: 37_entropy_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 37_entropy_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "37_entropy"
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


def h(p):
    p = np.asarray(p, float)
    out = np.zeros_like(p)
    m = (p > 0) & (p < 1)
    out[m] = -p[m] * np.log2(p[m]) - (1 - p[m]) * np.log2(1 - p[m])
    return out


# 그림 1: 이진 엔트로피. 반반일 때 1비트로 가장 크고, 한쪽으로 몰릴수록 0으로
p = np.linspace(0, 1, 501)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(p, h(p), color=C[0], lw=2)
for q in (0.5, 0.9):
    v = float(h(np.array([q]))[0])
    ax.plot(q, v, "o", color=C[1], ms=5)
    ax.text(q + 0.02, v + 0.03, f"$h({q}) = {v:.3f}$", fontsize=10)
ax.set_xlabel("한쪽 결과의 확률 $p$")
ax.set_ylabel("$h(p)$ (비트)")
ax.set_ylim(0, 1.12)
save(fig, 1)

if __name__ == "__main__":
    assert float(h(np.array([0.5]))[0]) == 1.0 and round(float(h(np.array([0.9]))[0]), 3) == 0.469
    assert float(h(np.array([0.0]))[0]) == 0 and float(h(np.array([1.0]))[0]) == 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
