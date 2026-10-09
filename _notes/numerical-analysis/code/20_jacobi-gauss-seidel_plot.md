---
layout: "note"
title: "20_jacobi-gauss-seidel_plot.py"
display_title: "20_jacobi-gauss-seidel_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "20"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/jacobi-gauss-seidel/"
parent_title: "야코비 방법과 가우스-자이델 방법"
description: "수치해석 · 야코비 방법과 가우스-자이델 방법 코드 코드"
permalink: "/studies/numerical-analysis/code/20_jacobi-gauss-seidel_plot/"
---
{% raw %}
[야코비 방법과 가우스-자이델 방법](/Hongs_Blog/studies/numerical-analysis/jacobi-gauss-seidel/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 야코비 방법과 가우스-자이델 방법 문서의 그림을 만든다: 20_jacobi-gauss-seidel_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_jacobi-gauss-seidel_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_jacobi-gauss-seidel"
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


A = np.array([[4, -1, 1], [4, -8, 1], [-2, 1, 5]], dtype=float)
b = np.array([7, -21, 15], dtype=float)
TRUE = np.array([2, 4, 3], dtype=float)
X0 = np.array([1, 2, 2], dtype=float)


def jacobi_step(A, b, x):
    D = np.diag(A)
    return (b - (A @ x - D * x)) / D


def gs_step(A, b, x):
    x = x.copy()
    for i in range(len(b)):
        x[i] = (b[i] - A[i] @ x + A[i, i] * x[i]) / A[i, i]
    return x


def errors(step, A, b, n):
    x, out = X0.copy(), [np.max(np.abs(X0 - TRUE))]
    xs = [x]
    for _ in range(n):
        x = step(A, b, x)
        xs.append(x)
        out.append(np.max(np.abs(x - TRUE)))
    return np.array(out), xs


N = 25
eJ, xJ = errors(jacobi_step, A, b, N)
eG, xG = errors(gs_step, A, b, N)
As, bs = A[[1, 0, 2]], b[[1, 0, 2]]                     # 첫 두 식을 바꾼 순서: 대각 우세가 깨진다
eS, xS = errors(jacobi_step, As, bs, N)

fig, ax = plt.subplots(figsize=(6, 3.6))
k = np.arange(N + 1)
ax.semilogy(k, eJ, "o-", color=C[0], ms=3, lw=1.5, label="야코비")
ax.semilogy(k, eG, "s-", color=C[1], ms=3, lw=1.5, label="가우스-자이델")
ax.semilogy(k, eS, "^-", color=C[3], ms=3, lw=1.5, label="야코비, 식 순서를 바꿈")
ax.set_ylim(1e-12, 1e5)
ax.yaxis.set_major_locator(matplotlib.ticker.LogLocator(base=10, numticks=20))
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{round(math.log10(v))}}}$"))
ax.set_yticks([1e-12, 1e-8, 1e-4, 1, 1e4])
ax.set_xlabel("반복 횟수 $k$")
ax.set_ylabel("참값과의 가장 큰 차이")
ax.legend(loc="lower left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 표의 3회차 값, 같은 반복에서 가우스-자이델 오차가 더 작음, 순서를 바꾸면 30번 안에 1000을 넘음
    assert np.allclose(xJ[3], [1.9625, 3.925, 2.9625]) and np.allclose(xG[3], [1.995625, 3.99609375, 2.99903125])
    assert all(eG[i] < eJ[i] for i in range(1, 15))
    _, xS30 = errors(jacobi_step, As, bs, 30)
    assert np.max(np.abs(xS30[30])) > 1000
    print("ALL CHECKS PASSED")
```
{% endraw %}
