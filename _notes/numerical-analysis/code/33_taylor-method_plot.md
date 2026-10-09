---
layout: "note"
title: "33_taylor-method_plot.py"
display_title: "33_taylor-method_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "33"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/taylor-method/"
parent_title: "테일러 급수 방법"
description: "수치해석 · 테일러 급수 방법 코드 코드"
permalink: "/studies/numerical-analysis/code/33_taylor-method_plot/"
---
{% raw %}
[테일러 급수 방법](/Hongs_Blog/studies/numerical-analysis/taylor-method/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 테일러 급수 방법 문서의 그림을 만든다: 33_taylor-method_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 33_taylor-method_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "33_taylor-method"
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


# y' = x + y 이면 f' = f'' = … = 1 + x + y (전미분). 참값 y = 2e^x − x − 1
EXACT = 2 * math.e - 2


def taylor_solve(k, h):
    x, y = 0.0, 1.0
    n = round(1 / h)
    for _ in range(n):
        f0 = x + y
        d = 1 + x + y                                   # f', f'', … 모두 같다
        T = f0 + sum(h ** (j - 1) / math.factorial(j) * d for j in range(2, k + 1))
        y += h * T
        x += h
    return y


HS = np.array([0.2, 0.1, 0.05, 0.025, 0.0125])
err = {k: np.array([abs(taylor_solve(k, h) - EXACT) for h in HS]) for k in range(1, 5)}
fig, ax = plt.subplots(figsize=(6, 3.6))
for k in range(1, 5):
    ax.loglog(HS, err[k], "o-", color=C[k - 1], ms=4, lw=1.5)
    ax.text(HS[-1] * 0.88, err[k][-1], f"$k = {k}$ (기울기 {k})", color=C[k - 1], fontsize=9, va="center")
ax.invert_xaxis()
ax.set_xticks(HS, ["0.2", "0.1", "0.05", "0.025", "0.0125"])
ax.minorticks_off()
ax.set_yticks([1e-8, 1e-6, 1e-4, 1e-2, 1])
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{round(math.log10(v))}}}$"))
ax.set_xlim(0.24, 0.0045)
ax.set_xlabel("걸음 크기 $h$ (오른쪽으로 갈수록 작다)")
ax.set_ylabel("$x = 1$에서 오차")
save(fig, 1)

if __name__ == "__main__":
    # 표: h = 0.1에서 오차 2.5e-1, 8.4e-3, 2.1e-4, 4.2e-6, h를 반으로 하면 오차가 약 2^k분의 1
    assert [float(f"{err[k][1]:.1e}") for k in range(1, 5)] == [2.5e-1, 8.4e-3, 2.1e-4, 4.2e-6]
    for k in range(1, 5):
        ratio = err[k][-2] / err[k][-1]
        assert abs(math.log2(ratio) - k) < 0.1
    print("ALL CHECKS PASSED")
```
{% endraw %}
