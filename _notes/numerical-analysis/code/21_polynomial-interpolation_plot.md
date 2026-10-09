---
layout: "note"
title: "21_polynomial-interpolation_plot.py"
display_title: "21_polynomial-interpolation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "21"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/polynomial-interpolation/"
parent_title: "다항식 보간"
description: "수치해석 · 다항식 보간 코드 코드"
permalink: "/studies/numerical-analysis/code/21_polynomial-interpolation_plot/"
---
{% raw %}
[다항식 보간](/Hongs_Blog/studies/numerical-analysis/polynomial-interpolation/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 다항식 보간 문서의 그림을 만든다: 21_polynomial-interpolation_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_polynomial-interpolation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_polynomial-interpolation"
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


XS = np.array([1, 1.1, 1.2, 1.3])
YS = np.array([1.5574, 1.9648, 2.5722, 3.6021])           # 슬라이드의 tan 표 (넷째 자리)


def lagrange(xs, ys, x):
    x = np.asarray(x, float)
    total = np.zeros_like(x)
    for i in range(len(xs)):
        L = np.ones_like(x)
        for j in range(len(xs)):
            if j != i:
                L *= (x - xs[j]) / (xs[i] - xs[j])
        total += ys[i] * L
    return total


CHOICES = [("1차 (1.1, 1.2)", [1, 2]), ("2차 (1, 1.1, 1.2)", [0, 1, 2]), ("3차 (넷 다)", [0, 1, 2, 3])]
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
# 왼쪽: 1.15 근처를 확대. 점을 늘릴수록 참값에 붙는다
ax = axes[0]
x = np.linspace(1.12, 1.18, 200)
ax.plot(x, np.tan(x), color=INK, lw=2.6, label=r"$\tan x$")
for i, (name, idx) in enumerate(CHOICES):
    ax.plot(x, lagrange(XS[idx], YS[idx], x), color=C[i], lw=1.4, label=name)
ax.axvline(1.15, color=INK, lw=0.5, ls=":")
ax.set_title("1.15 근처 확대", fontsize=10)
ax.set_xlabel("$x$")
ax.legend(loc="upper left", fontsize=8)
# 오른쪽: 범위 밖 1.5까지. 3차식이 참값에서 크게 벗어난다
ax = axes[1]
x = np.linspace(0.95, 1.52, 300)
ax.plot(x, np.tan(x), color=INK, lw=2.6)
ax.plot(x, lagrange(XS, YS, x), color=C[2], lw=1.4)
ax.plot(XS, YS, "o", color=C[2], ms=5)
ax.axvspan(1.3, 1.52, color=C[1], alpha=0.08)
ax.text(1.41, 1.0, "자료 범위 밖", ha="center", fontsize=9)
p15 = lagrange(XS, YS, np.array([1.5]))[0]
ax.plot([1.5, 1.5], [p15, math.tan(1.5)], "o", color=C[1], ms=4)
ax.annotate(f"참값 {math.tan(1.5):.1f}", (1.5, math.tan(1.5)), textcoords="offset points", xytext=(-58, -4), fontsize=9)
ax.annotate(f"3차식 {p15:.1f}", (1.5, p15), textcoords="offset points", xytext=(-58, 2), fontsize=9, color=C[2])
ax.set_ylim(0, 16)
ax.set_title("범위 밖으로 짐작하면", fontsize=10)
ax.set_xlabel("$x$")
save(fig, 1)

if __name__ == "__main__":
    # 표: P1(1.15) = 2.2685, P2 = 2.2435, P3 = 2.2296, 참값 2.2345, x = 1.5에서 3차식이 5 넘게 틀림
    vals = [lagrange(XS[idx], YS[idx], np.array([1.15]))[0] for _, idx in CHOICES]
    assert [round(v, 4) for v in vals] == [2.2685, 2.2435, 2.2296]
    assert abs(math.tan(1.15) - 2.2345) < 1e-4
    assert abs(math.tan(1.5) - p15) > 5 and round(p15, 1) == 7.8 and round(math.tan(1.5), 1) == 14.1
    print("ALL CHECKS PASSED")
```
{% endraw %}
