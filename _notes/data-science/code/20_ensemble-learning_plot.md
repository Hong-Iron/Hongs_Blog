---
layout: "note"
title: "20_ensemble-learning_plot.py"
display_title: "20_ensemble-learning_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "20"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/ensemble-learning/"
parent_title: "앙상블 학습"
description: "데이터 과학 · 앙상블 학습 그림 생성 코드"
permalink: "/studies/data-science/code/20_ensemble-learning_plot/"
---
{% raw %}
[앙상블 학습](/Hongs_Blog/studies/data-science/ensemble-learning/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 앙상블 학습 문서의 그림을 만든다: 20_ensemble-learning_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_ensemble-learning_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_ensemble-learning"
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

S2 = 0.16                                               # 모델 하나의 분산 (표준편차 0.4)


def ens_var(k, rho):
    return S2 / k + (k - 1) / k * rho * S2


# 그림 1: 모델 수 k에 따른 평균의 분산, 상관계수 ρ마다
k = np.arange(1, 51)
fig, ax = plt.subplots(figsize=(6, 3.5))
for i, rho in enumerate([0, 0.25, 0.5, 0.9]):
    ax.plot(k, ens_var(k, rho), color=C[i], lw=2, label=rf"$\rho = {rho}$")
    ax.axhline(rho * S2, color=C[i], lw=0.8, ls=":")
ax.plot([10, 10], [ens_var(10, 0), ens_var(10, 0.5)], "o", color=INK, ms=5)
ax.text(11.5, 0.02, "0.016", fontsize=10)
ax.text(11, ens_var(10, 0.5) + 0.004, "0.088", fontsize=10)
ax.set_xlim(0, 50)
ax.set_ylim(0, 0.17)
ax.set_xlabel("모델 수 $k$")
ax.set_ylabel("평균의 분산")
ax.legend(loc="upper left", bbox_to_anchor=(1.01, 1), fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert abs(ens_var(10, 0) - 0.016) < 1e-12 and abs(ens_var(10, 0.5) - 0.088) < 1e-12
    assert abs(ens_var(1, 0.7) - S2) < 1e-12 and abs(ens_var(10 ** 6, 0.5) - 0.08) < 1e-6
    rng = np.random.default_rng(0)                      # 몬테카를로: ρ = 0.5, k = 10
    cov = S2 * (0.5 * np.ones((10, 10)) + 0.5 * np.eye(10))
    m = rng.multivariate_normal(np.zeros(10), cov, size=200000).mean(axis=1)
    assert abs(m.var() - 0.088) < 0.002
    print("ALL CHECKS PASSED")
```
{% endraw %}
