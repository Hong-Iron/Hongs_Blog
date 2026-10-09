---
layout: "note"
title: "24_data-linearization_plot.py"
display_title: "24_data-linearization_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "24"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/data-linearization/"
parent_title: "자료 선형화"
description: "수치해석 · 자료 선형화 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/24_data-linearization_plot/"
---
{% raw %}
[자료 선형화](/Hongs_Blog/studies/numerical-analysis/data-linearization/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 자료 선형화 문서의 그림을 만든다: 24_data-linearization_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 24_data-linearization_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "24_data-linearization"
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


X = np.array([0, 1, 2, 3, 4], dtype=float)
Y = np.array([1.5, 2.5, 3.5, 5.0, 7.5])

# 선형화: (x, ln y)에 최소제곱 직선
A_lin, B_lin = np.polyfit(X, np.log(Y), 1)
C_lin = math.exp(B_lin)
# 비선형 최소제곱: 가우스-뉴턴, 선형화한 답에서 시작
A_nl, C_nl = A_lin, C_lin
for _ in range(50):
    r = C_nl * np.exp(A_nl * X) - Y
    J = np.column_stack([C_nl * X * np.exp(A_nl * X), np.exp(A_nl * X)])
    dA, dC = np.linalg.solve(J.T @ J, -J.T @ r)
    A_nl, C_nl = A_nl + dA, C_nl + dC
sse = lambda A, C_: float(np.sum((C_ * np.exp(A * X) - Y) ** 2))

fig, axes = plt.subplots(1, 2, figsize=(6.5, 3))
ax = axes[0]
ax.plot(X, np.log(Y), "o", color=INK, ms=5)
xx = np.linspace(-0.2, 4.2, 50)
ax.plot(xx, A_lin * xx + B_lin, color=C[0], lw=1.8)
ax.set_title("축을 바꾸면: $(x, \\ln y)$", fontsize=10)
ax.set_xlabel("$x$")
ax.set_ylabel("$\\ln y$")
ax = axes[1]
xx = np.linspace(0, 6, 200)
ax.plot(X, Y, "o", color=INK, ms=5)
ax.plot(xx, C_lin * np.exp(A_lin * xx), color=C[0], lw=1.8, label=f"선형화 ({sse(A_lin, C_lin):.4f})")
ax.plot(xx, C_nl * np.exp(A_nl * xx), color=C[1], lw=1.8, ls="--", label=f"비선형 최소제곱 ({sse(A_nl, C_nl):.4f})")
ax.axvspan(4, 6, color=INK, alpha=0.07)
ax.text(5, 1.5, "외삽", ha="center", fontsize=9)
ax.set_title("원래 축", fontsize=10)
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
ax.legend(loc="upper left", fontsize=8, title="(오차 제곱합)", title_fontsize=8)
save(fig, 1)

if __name__ == "__main__":
    # 문서 표: 선형화 1.579910 e^{0.3912023x}, 비선형 1.6109 e^{0.38357x}, 오차 제곱합 0.0501과 0.0409, x = 10 예측
    assert abs(A_lin - 0.3912023) < 1e-6 and abs(C_lin - 1.579910) < 1e-5
    assert abs(A_nl - 0.38357) < 1e-5 and abs(C_nl - 1.6109) < 1e-4
    assert round(sse(A_lin, C_lin), 4) == 0.0501 and round(sse(A_nl, C_nl), 4) == 0.0409
    assert abs(C_lin * math.exp(10 * A_lin) - 78.9955) < 1e-3 and abs(C_nl * math.exp(10 * A_nl) - 74.6287) < 1e-2
    print("ALL CHECKS PASSED")
```
{% endraw %}
