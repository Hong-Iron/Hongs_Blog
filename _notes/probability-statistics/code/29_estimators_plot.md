---
layout: "note"
title: "29_estimators_plot.py"
display_title: "29_estimators_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "29"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/estimators/"
parent_title: "표본분포와 추정량"
description: "확률과 통계 · 표본분포와 추정량 코드 코드"
permalink: "/studies/probability-statistics/code/29_estimators_plot/"
---
{% raw %}
[표본분포와 추정량](/Hongs_Blog/studies/probability-statistics/estimators/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 표본분포와 추정량 문서의 그림을 만든다: 29_estimators_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 29_estimators_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "29_estimators"
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


rng = np.random.default_rng(29)
N, SIG2 = 5, 1.0                                        # 정규분포에서 표본 5개, 참 분산 1
x = rng.standard_normal((200000, N))
ss = ((x - x.mean(axis=1, keepdims=True)) ** 2).sum(axis=1)
s_unb, s_b = ss / (N - 1), ss / N                       # 불편 S²(n−1로 나눔), 편향 S²(n으로 나눔)


def chi2_4_pdf(t):
    return t * np.exp(-t / 2) / 4                       # 자유도 4 카이제곱 밀도: ss ~ σ²·χ²₄


# 그림 1: 두 추정량의 표본분포. 파랑은 중심이 1이지만 넓고, 주황은 중심이 0.8로 비껴 있지만 좁다
v = np.linspace(0.001, 4, 500)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (div, name) in enumerate([(N - 1, "$n-1$로 나눔"), (N, "$n$으로 나눔")]):
    ax.plot(v, chi2_4_pdf(v * div) * div, color=C[i], lw=2, label=name)
    ax.axvline((N - 1) / div, color=C[i], lw=1, ls="--")
ax.axvline(SIG2, color=INK, lw=0.6)
ax.text(1.03, 0.85, "참값 $\\sigma^2 = 1$", fontsize=10)
ax.text(0.5, 0.1, "평균 0.8", color=C[1], fontsize=10, ha="right")
mse = [np.mean((s - SIG2) ** 2) for s in (s_unb, s_b)]
ax.text(2.2, 0.45, f"MSE  {mse[0]:.2f}  (n-1)\nMSE  {mse[1]:.2f}  (n)", fontsize=10)
ax.set_xlabel("추정값")
ax.set_ylabel("밀도")
ax.set_ylim(0, 0.95)
ax.legend(loc="upper right")
save(fig, 1)

if __name__ == "__main__":
    assert abs(s_unb.mean() - 1) < 0.01 and abs(s_b.mean() - 0.8) < 0.01
    assert abs(mse[0] - 0.5) < 0.01 and abs(mse[1] - 0.36) < 0.01
    assert round(mse[0], 2) == 0.50 and round(mse[1], 2) == 0.36
    print("ALL CHECKS PASSED")
```
{% endraw %}
