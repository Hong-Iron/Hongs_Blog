---
layout: "note"
title: "06_chain-rule_plot.py"
display_title: "06_chain-rule_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "06"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/chain-rule/"
parent_title: "연쇄 법칙"
description: "미분적분학 · 연쇄 법칙 그림 생성 코드"
permalink: "/studies/calculus/code/06_chain-rule_plot/"
---
{% raw %}
[연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연쇄 법칙 문서의 그림을 만든다: 06_chain-rule_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 06_chain-rule_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "06_chain-rule"
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


def softplus(x):
    return np.log1p(np.exp(x))


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


# 그림 1: 소프트플러스 → (미분) → 시그모이드 → (미분) → σ(1 − σ). 마지막은 최대 1/4
x = np.linspace(-6, 6, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, softplus(x), color=C[0], lw=2, label=r"소프트플러스 $\ln(1+e^x)$")
ax.plot(x, sigmoid(x), color=C[1], lw=2, label=r"그 도함수 $\sigma(x)$")
ax.plot(x, sigmoid(x) * (1 - sigmoid(x)), color=C[2], lw=2, label=r"그 도함수 $\sigma(1-\sigma)$")
ax.axhline(0.25, color=C[2], lw=0.8, ls=":")
ax.text(6, 0.27, "최대 1/4", ha="right", va="bottom", fontsize=9, color=C[2])
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-0.1, 3)
ax.set_xlabel("$x$")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 그림의 세 곡선이 차례로 도함수 관계인지(중앙 차분), σ(1-σ)의 최댓값 1/4이 x = 0에서 나오는지
    xs = np.linspace(-5, 5, 41)
    h = 1e-5
    assert np.allclose((softplus(xs + h) - softplus(xs - h)) / (2 * h), sigmoid(xs), atol=1e-8)
    d = (sigmoid(xs + h) - sigmoid(xs - h)) / (2 * h)
    assert np.allclose(d, sigmoid(xs) * (1 - sigmoid(xs)), atol=1e-8)
    g = sigmoid(x) * (1 - sigmoid(x))
    assert g.max() <= 0.25 + 1e-12 and abs(sigmoid(0) * (1 - sigmoid(0)) - 0.25) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
