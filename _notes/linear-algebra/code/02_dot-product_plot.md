---
layout: "note"
title: "02_dot-product_plot.py"
display_title: "02_dot-product_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "02"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/dot-product/"
parent_title: "내적과 노름"
description: "선형대수학 · 내적과 노름 그림 생성 코드"
permalink: "/studies/linear-algebra/code/02_dot-product_plot/"
---
{% raw %}
[내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 내적과 노름 문서의 그림을 만든다: 02_dot-product_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 02_dot-product_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "02_dot-product"
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


def arrow(ax, start, vec, color, lw=1.8, ls="-"):
    """start에서 vec만큼 가는 화살표"""
    ax.annotate("", xy=(start[0] + vec[0], start[1] + vec[1]), xytext=(start[0], start[1]),
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, ls=ls, shrinkA=0, shrinkB=0,
                                mutation_scale=12))


rng = np.random.default_rng(0)


def random_cosines(d, trials=20000):
    u = rng.standard_normal((trials, d))
    v = rng.standard_normal((trials, d))
    return np.sum(u * v, axis=1) / (np.linalg.norm(u, axis=1) * np.linalg.norm(v, axis=1))


# 그림 1: 무작위 두 벡터의 코사인 분포. 차원이 커질수록 0 근처로 몰린다
dims = [2, 10, 1000]
cos = {d: random_cosines(d) for d in dims}
bins = np.linspace(-1, 1, 81)
fig, ax = plt.subplots(figsize=(6, 3.4))
for i, d in enumerate(dims):
    ax.hist(cos[d], bins=bins, density=True, histtype="step", lw=1.8, color=C[i], label=f"{d}차원")
ax.set_xlabel(r"코사인 $\cos\theta$")
ax.set_ylabel("밀도")
ax.set_yticks([])
ax.set_xticks([-1, -0.5, 0, 0.5, 1])
ax.legend(loc="upper left")
save(fig, 1)

if __name__ == "__main__":
    # 1000차원의 표준편차는 약 1/sqrt(1000) = 0.0316, 2차원은 훨씬 넓다(이론값 1/sqrt(2) = 0.707)
    assert abs(np.std(cos[1000]) - 1 / math.sqrt(1000)) < 0.002
    assert abs(np.std(cos[2]) - 1 / math.sqrt(2)) < 0.01
    assert abs(np.std(cos[10]) - 1 / math.sqrt(10)) < 0.01
    # 예시의 값
    u, v = np.array([5, 1, 0]), np.array([4, 2, 0])
    assert u @ v == 22 and abs(math.degrees(math.acos(22 / math.sqrt(26 * 20))) - 15.3) < 0.1
    print("ALL CHECKS PASSED")
```
{% endraw %}
