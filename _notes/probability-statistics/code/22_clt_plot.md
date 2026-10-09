---
layout: "note"
title: "22_clt_plot.py"
display_title: "22_clt_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "22"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/clt/"
parent_title: "중심극한정리"
description: "확률과 통계 · 중심극한정리 코드 코드"
permalink: "/studies/probability-statistics/code/22_clt_plot/"
---
{% raw %}
[중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 중심극한정리 문서의 그림을 만든다: 22_clt_fig1.svg, 22_clt_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 22_clt_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "22_clt"
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


def dice_sum_pmf(n):
    """주사위 n개 합의 정확한 분포 (합성곱 n번)."""
    p = np.array([1.0])
    die = np.ones(6) / 6
    for _ in range(n):
        p = np.convolve(p, die)
    return np.arange(n, 6 * n + 1), p


def npdf(z):
    return np.exp(-z * z / 2) / math.sqrt(2 * math.pi)


def max_cdf_gap(n):
    s, p = dice_sum_pmf(n)
    mu, sd = 3.5 * n, math.sqrt(35 / 12 * n)
    F = np.cumsum(p)
    return max(abs(F[i] - Phi((s[i] + 0.5 - mu) / sd)) for i in range(len(s)))   # 연속성 보정한 점에서 비교


# 그림 1: 주사위 n개 합을 표준화한 분포(막대 넓이 = 확률)와 표준정규 밀도
fig, axes = plt.subplots(1, 3, figsize=(6.5, 2.4), sharey=True)
z = np.linspace(-3.5, 3.5, 400)
for ax, n in zip(axes, [1, 2, 10]):
    s, p = dice_sum_pmf(n)
    sd = math.sqrt(35 / 12 * n)
    ax.bar((s - 3.5 * n) / sd, p * sd, width=0.85 / sd, color=C[0], alpha=0.75)
    ax.plot(z, npdf(z), color=C[1], lw=1.6)
    ax.set_title(f"주사위 {n}개", fontsize=10)
    ax.set_xticks([-3, 0, 3])
    ax.set_xlim(-3.5, 3.5)
axes[0].set_ylabel("밀도")
axes[1].set_xlabel("표준화한 합 $Z_n$")
fig.tight_layout()
save(fig, 1)

# 그림 2: 지수분포 n개 평균(감마분포)은 치우침이 천천히 사라진다
def gamma_std_pdf(zv, n):
    """Exp(1) n개 평균을 표준화한 Z의 밀도. 평균 = Gamma(n, n)."""
    x = 1 + zv / math.sqrt(n)
    out = np.zeros_like(zv)
    ok = x > 0
    logf = n * math.log(n) + (n - 1) * np.log(x[ok]) - n * x[ok] - math.lgamma(n)
    out[ok] = np.exp(logf) / math.sqrt(n)
    return out


def gamma_upper_tail(n, z):
    """P(Z > z)를 수치 적분으로."""
    g = np.linspace(z, 40, 400001)
    d = gamma_std_pdf(g, n)
    return float(np.sum((d[:-1] + d[1:]) / 2 * np.diff(g)))


fig, ax = plt.subplots(figsize=(6, 3.6))
z = np.linspace(-3.5, 4, 600)
ax.plot(z, npdf(z), color=INK, lw=2.6, label="표준정규")
for i, n in enumerate([1, 5, 50]):
    ax.plot(z, gamma_std_pdf(z, n), color=C[i], lw=1.6, label=f"지수분포 {n}개 평균")
ax.set_ylim(0, 0.62)
ax.set_xlabel("표준화한 평균")
ax.set_ylabel("밀도")
ax.legend(loc="upper right")
save(fig, 2)

if __name__ == "__main__":
    table = {1: 0.054, 2: 0.016, 10: 0.0026, 100: 0.0003}
    for n, v in table.items():
        assert abs(max_cdf_gap(n) - v) <= 0.5 * 10 ** (-len(str(v).split(".")[1])) + 1e-12, (n, max_cdf_gap(n))
    tails = [gamma_upper_tail(n, 2) for n in (5, 50, 500)]
    assert [round(t, 3) for t in tails] == [0.041, 0.030, 0.025]
    print("ALL CHECKS PASSED")
```
{% endraw %}
