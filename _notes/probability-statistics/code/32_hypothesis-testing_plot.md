---
layout: "note"
title: "32_hypothesis-testing_plot.py"
display_title: "32_hypothesis-testing_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "32"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/hypothesis-testing/"
parent_title: "가설검정과 p값"
description: "확률과 통계 · 가설검정과 p값 코드 코드"
permalink: "/studies/probability-statistics/code/32_hypothesis-testing_plot/"
---
{% raw %}
[가설검정과 p값](/Hongs_Blog/studies/probability-statistics/hypothesis-testing/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 가설검정과 p값 문서의 그림을 만든다: 32_hypothesis-testing_fig1.svg, 32_hypothesis-testing_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 32_hypothesis-testing_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "32_hypothesis-testing"
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


N = 1000
A, B = 100, 130                                         # 가입자 수 (A 10%, B 13%)
P_POOL = (A + B) / (2 * N)
SE0 = math.sqrt(P_POOL * (1 - P_POOL) * 2 / N)          # 차이가 없다고 볼 때의 표준오차
DIFF = (B - A) / N
Z = DIFF / SE0
PVAL = 2 * (1 - Phi(abs(Z)))


def npdf(x, mu, sd):
    return np.exp(-(x - mu) ** 2 / (2 * sd * sd)) / (sd * math.sqrt(2 * math.pi))


def power(n, p1=0.10, p2=0.13):
    """참 전환율이 p1, p2일 때 5% 양측 z검정이 기각할 확률(정규 근사)."""
    pbar = (p1 + p2) / 2
    se0 = math.sqrt(pbar * (1 - pbar) * 2 / n)
    se1 = math.sqrt(p1 * (1 - p1) / n + p2 * (1 - p2) / n)
    d = p2 - p1
    return (1 - Phi((1.96 * se0 - d) / se1)) + Phi((-1.96 * se0 - d) / se1)


# 그림 1: 차이가 없을 때 비율 차이가 흔들리는 분포. 관측값 0.03보다 바깥쪽(양쪽) 넓이가 p값
x = np.linspace(-0.055, 0.055, 600)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, npdf(x, 0, SE0), color=INK, lw=2)
crit = 1.96 * SE0
for side in (-1, 1):
    xs = np.linspace(DIFF, 0.055, 200) * side
    ax.fill_between(xs, npdf(xs, 0, SE0), color=C[1], alpha=0.5, lw=0)
    ax.axvline(side * crit, color=C[0], lw=1, ls="--")
ax.axvline(DIFF, color=C[1], lw=1.6)
ax.text(DIFF + 0.001, 24, f"관측한 차이 0.03\n($z \\approx {Z:.2f}$)", color=C[1], fontsize=10)
ax.text(-0.056, 28, f"주황 넓이 = p값 ≈ {PVAL:.3f}", color=C[1], fontsize=10)
ax.text(-0.056, 22, "파란 점선: 기각 경계\n±1.96 × 표준오차", color=C[0], fontsize=9)
ax.set_xlabel("두 가입률의 차이 (B − A)".replace("−", "-"))
ax.set_ylabel("밀도")
ax.set_ylim(0, 31)
save(fig, 1)

# 그림 2: 참 차이가 0.03일 때 관측 차이의 분포. 기각 경계 오른쪽 넓이가 검정력
se1 = math.sqrt(0.10 * 0.90 / N + 0.13 * 0.87 / N)
x = np.linspace(-0.05, 0.08, 600)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, npdf(x, 0, SE0), color=INK, lw=1.6, label="차이가 없을 때")
ax.plot(x, npdf(x, 0.03, se1), color=C[2], lw=2, label="참 차이 0.03일 때")
xs = np.linspace(crit, 0.08, 200)
ax.fill_between(xs, npdf(xs, 0.03, se1), color=C[2], alpha=0.35, lw=0)
xs = np.linspace(-0.05, crit, 200)
ax.fill_between(xs, npdf(xs, 0.03, se1), color=C[3], alpha=0.25, lw=0)
ax.axvline(crit, color=C[0], lw=1, ls="--")
ax.text(0.047, 18, f"검정력 ≈ {power(N):.2f}", color=C[2], fontsize=10)
ax.annotate("놓침(제2종 오류)", (0.015, 4), xytext=(-0.05, 14), color=C[3], fontsize=10,
            arrowprops=dict(arrowstyle="-", color=C[3], lw=0.6))
ax.set_xlabel("관측한 가입률 차이 (1,000명씩)")
ax.set_ylabel("밀도")
ax.set_ylim(0, 31)
ax.legend(loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    assert abs(SE0 - 0.01427) < 1e-5 and round(Z, 2) == 2.10 and round(PVAL, 3) == 0.035
    assert abs(power(1000) - 0.56) < 0.01 and power(2000) > 0.8
    print("ALL CHECKS PASSED")
```
{% endraw %}
