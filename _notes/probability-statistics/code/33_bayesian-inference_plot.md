---
layout: "note"
title: "33_bayesian-inference_plot.py"
display_title: "33_bayesian-inference_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "33"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/bayesian-inference/"
parent_title: "베이즈 추론과 MAP"
description: "확률과 통계 · 베이즈 추론과 MAP 그림 생성 코드"
permalink: "/studies/probability-statistics/code/33_bayesian-inference_plot/"
---
{% raw %}
[베이즈 추론과 MAP](/Hongs_Blog/studies/probability-statistics/bayesian-inference/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 베이즈 추론과 MAP 문서의 그림을 만든다: 33_bayesian-inference_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 33_bayesian-inference_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "33_bayesian-inference"
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


def beta_pdf(p, a, b):
    logc = math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b)
    return np.exp(logc + (a - 1) * np.log(p) + (b - 1) * np.log1p(-p))


K, N = 3, 3                                             # 세 번 던져 세 번 앞면
p = np.linspace(0.0005, 0.9995, 2000)

# 그림 1: 같은 자료(3번 중 3번 앞면)를 사전분포 두 가지로 갱신한 결과
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3), sharey=True)
for ax, (a, b) in zip(axes, [(1, 1), (2, 2)]):
    a2, b2 = a + K, b + N - K
    ax.plot(p, beta_pdf(p, a, b), color=INK, lw=1.6, ls="--", label=f"사전 Beta({a},{b})")
    ax.plot(p, beta_pdf(p, a2, b2), color=C[0], lw=2, label=f"사후 Beta({a2},{b2})")
    mean = a2 / (a2 + b2)
    mode = (a2 - 1) / (a2 + b2 - 2)
    ax.axvline(mean, color=C[1], lw=1.2)
    ax.text(mean - 0.02, 3.7, f"사후 평균\n{mean:.2f}", color=C[1], fontsize=9, ha="right")
    if a == 2:
        ax.plot(mode, beta_pdf(np.array([mode]), a2, b2)[0], "o", color=C[2], ms=5)
        ax.text(mode, beta_pdf(np.array([mode]), a2, b2)[0] + 0.15, f"MAP {mode:.1f}", color=C[2], fontsize=9, ha="center")
    ax.axvline(1, color=INK, lw=0.6, ls=":")
    ax.set_xlabel("앞면 확률 $p$")
    ax.set_ylim(0, 4.6)
    ax.legend(loc="upper left", fontsize=9)
axes[0].set_ylabel("밀도")
axes[0].text(0.98, 0.3, "MLE 1", fontsize=9, ha="right")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs((1 + K) / (2 + N) - 0.8) < 1e-12                          # 균등 사전의 사후 평균
    assert abs((2 + K - 1) / (4 + N - 2) - 0.8) < 1e-12                  # Beta(2,2) 사전의 MAP
    for a, b in [(1, 1), (2, 2), (4, 1), (5, 2)]:
        g = beta_pdf(p, a, b)
        assert abs(float(np.sum(g) * (p[1] - p[0])) - 1) < 2e-3
    assert round(5 / 7, 2) == 0.71 and abs(((1 + K) - 1) / ((1 + K) + 1 - 2) - 1) < 1e-12   # Beta(4,1)의 봉우리 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
