---
layout: "note"
title: "06_bayes-theorem_plot.py"
display_title: "06_bayes-theorem_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "06"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/bayes-theorem/"
parent_title: "베이즈 정리"
description: "확률과 통계 · 베이즈 정리 그림 생성 코드"
permalink: "/studies/probability-statistics/code/06_bayes-theorem_plot/"
---
{% raw %}
[베이즈 정리](/Hongs_Blog/studies/probability-statistics/bayes-theorem/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 베이즈 정리 문서의 그림을 만든다: 06_bayes-theorem_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 06_bayes-theorem_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "06_bayes-theorem"
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


SENS, FPR = 0.95, 0.05                                  # 민감도, 위양성률 (문서 예시)


def posterior(prior, positives=1):
    """양성이 positives번 연달아 나왔을 때 병이 있을 확률 (검사 오류는 병 유무가 주어지면 독립)."""
    a = prior * SENS ** positives
    b = (1 - prior) * FPR ** positives
    return a / (a + b)


# 그림 1: 유병률(기저율)에 따라 양성일 때 병이 있을 확률이 어떻게 바뀌는가
prev = np.logspace(-4, -0.3, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(prev, [posterior(p) for p in prev], color=C[0], lw=2, label="양성 한 번")
ax.plot(prev, [posterior(p, 2) for p in prev], color=C[1], lw=2, label="양성 두 번")
ax.set_xscale("log")
ax.axvline(0.01, color=INK, lw=0.6, ls=":")
ax.plot(0.01, posterior(0.01), "o", color=C[0], ms=5)
ax.plot(0.01, posterior(0.01, 2), "o", color=C[1], ms=5)
ax.text(0.0115, posterior(0.01) - 0.02, f"{posterior(0.01):.3f}", fontsize=10, va="top")
ax.text(0.0115, posterior(0.01, 2) - 0.02, f"{posterior(0.01, 2):.3f}", fontsize=10, va="top")
ax.text(0.0105, 1.0, "유병률 1%", fontsize=10, va="top")
ax.set_xticks([1e-4, 1e-3, 1e-2, 1e-1, 0.5])
ax.set_xticklabels(["0.01%", "0.1%", "1%", "10%", "50%"])
ax.set_xlabel("유병률 (사전확률)")
ax.set_ylabel("병이 있을 확률 (사후확률)")
ax.set_ylim(0, 1.03)
ax.legend(loc="upper left")
save(fig, 1)

if __name__ == "__main__":
    assert abs(posterior(0.01) - 95 / 590) < 1e-12 and round(posterior(0.01), 3) == 0.161
    assert round(posterior(0.01, 2), 3) == 0.785
    assert round(posterior(0.1), 3) == 0.679
    print("ALL CHECKS PASSED")
```
{% endraw %}
