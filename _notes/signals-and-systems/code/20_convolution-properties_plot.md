---
layout: "note"
title: "20_convolution-properties_plot.py"
display_title: "20_convolution-properties_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "20"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/convolution-properties/"
parent_title: "컨벌루션의 성질"
description: "신호 및 시스템 · 컨벌루션의 성질 코드 코드"
permalink: "/studies/signals-and-systems/code/20_convolution-properties_plot/"
---
{% raw %}
[컨벌루션의 성질](/Hongs_Blog/studies/signals-and-systems/convolution-properties/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 컨벌루션의 성질 문서의 그림을 만든다: 20_convolution-properties_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_convolution-properties_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_convolution-properties"
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


def stem(ax, n, x, color, label=None, ms=5):
    # 이산 시간 신호는 막대 끝에 점을 찍은 줄기 그림으로 그린다
    ml, sl, bl = ax.stem(n, x, linefmt="-", markerfmt="o", basefmt=" ", label=label)
    plt.setp(sl, color=color, lw=1.4)
    plt.setp(ml, color=color, markersize=ms)
    ax.axhline(0, color=INK, lw=0.6)


# 그림 1: 예제 2.10. x = x1 + x2를 나눠 각각 u[n]과 컨벌루션하고 더한다
n = np.arange(-6, 9)
y1 = np.where(n >= 0, 2 - 0.5 ** n, 0.0)
y2 = np.where(n >= 0, 2.0, 2.0 ** (n + 1))
y = y1 + y2
fig, axs = plt.subplots(3, 1, figsize=(6, 4.6), sharex=True)
labs = [r"$y_1 = (\frac{1}{2})^n u[n] * u[n]$", r"$y_2 = 2^n u[-n] * u[n]$", "$y = y_1 + y_2$"]
for i, (ax, v, lab) in enumerate(zip(axs, [y1, y2, y], labs)):
    stem(ax, n, v, C[i], ms=4)
    ax.set_ylim(-0.2, 4.4)
    ax.set_yticks([0, 2, 4])
    ax.text(-6.3, 3.6, lab, fontsize=10)
axs[2].axhline(4, color=INK, lw=0.6, ls=":")
axs[2].set_xlabel("$n$")
axs[2].set_xticks(n[::2])
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 정의대로 컨벌루션한 값과 비교: y[-3] = 1/4, y[-1] = 1, y[0] = 3, y[1] = 3.5, y[2] = 3.75
    k = np.arange(-60, 61)
    xk = np.where(k >= 0, 0.5 ** k, 0.0) + np.where(k <= 0, 2.0 ** np.minimum(k, 0), 0.0)
    direct = np.array([np.sum(xk[k <= m]) for m in n])
    assert np.allclose(direct, y)
    vals = dict(zip(n, y))
    assert np.allclose([vals[-3], vals[-1], vals[0], vals[1], vals[2]], [0.25, 1, 3, 3.5, 3.75])
    print("ALL CHECKS PASSED")
```
{% endraw %}
