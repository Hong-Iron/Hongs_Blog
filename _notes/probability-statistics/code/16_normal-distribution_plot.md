---
layout: "note"
title: "16_normal-distribution_plot.py"
display_title: "16_normal-distribution_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "16"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/normal-distribution/"
parent_title: "정규분포"
description: "확률과 통계 · 정규분포 그림 생성 코드"
permalink: "/studies/probability-statistics/code/16_normal-distribution_plot/"
---
{% raw %}
[정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 정규분포 문서의 그림을 만든다: 16_normal-distribution_fig1.svg, 16_normal-distribution_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_normal-distribution_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_normal-distribution"
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


MU, SIG = 200, 20                                       # 응답 시간 N(200, 20²) ms


def pdf(x, mu=MU, sig=SIG):
    return np.exp(-(x - mu) ** 2 / (2 * sig ** 2)) / (sig * math.sqrt(2 * math.pi))


# 그림 1: 평균에서 표준편차 1·2·3개 안의 넓이
x = np.linspace(MU - 4 * SIG, MU + 4 * SIG, 800)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, pdf(x), color=INK, lw=1.8)
for k, a in [(3, 0.12), (2, 0.2), (1, 0.32)]:
    xs = np.linspace(MU - k * SIG, MU + k * SIG, 300)
    ax.fill_between(xs, pdf(xs), color=C[0], alpha=a, lw=0)
ymax = pdf(np.array(MU))
for k, h in [(1, 1.08), (2, 1.2), (3, 1.32)]:
    p = Phi(k) - Phi(-k)
    y = ymax * h
    ax.annotate("", (MU - k * SIG, y), (MU + k * SIG, y), arrowprops=dict(arrowstyle="<->", color=INK, lw=0.8))
    ax.text(MU, y, f"±{k}σ: {100 * p:.1f}%", ha="center", va="bottom", fontsize=10)
ax.set_xticks([MU + k * SIG for k in range(-3, 4)])
ax.set_xlabel("응답 시간(ms)")
ax.set_yticks([])
ax.spines["left"].set_visible(False)
ax.set_ylim(0, ymax * 1.45)
save(fig, 1)

# 그림 2: μ는 종을 옮기고, σ는 종을 낮고 넓게 만든다(넓이는 늘 1)
x = np.linspace(-7, 9, 800)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, ((mu, sig), (tx, ty)) in enumerate(zip([(0, 1), (3, 1), (0, 2)], [(-3.3, 0.36), (4.1, 0.36), (-6.5, 0.1)])):
    ax.plot(x, pdf(x, mu, sig), color=C[i], lw=2)
    ax.text(tx, ty, f"$\\mathcal{{N}}({mu}, {sig ** 2})$", color=C[i], fontsize=11)
ax.set_xlabel("$x$")
ax.set_ylabel("밀도")
save(fig, 2)

if __name__ == "__main__":
    assert [round(100 * (Phi(k) - Phi(-k)), 1) for k in (1, 2, 3)] == [68.3, 95.4, 99.7]
    assert round(Phi((160 - MU) / SIG), 3) == 0.023
    for mu, sig in [(0, 1), (3, 1), (0, 2)]:
        g = np.linspace(mu - 12 * sig, mu + 12 * sig, 200001)
        assert abs(float(np.sum(pdf(g, mu, sig)) * (g[1] - g[0])) - 1) < 1e-6
    assert abs(float(pdf(np.array(0.0), 0, 2)) / float(pdf(np.array(0.0), 0, 1)) - 0.5) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
