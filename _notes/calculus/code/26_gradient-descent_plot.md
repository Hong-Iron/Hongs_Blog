---
layout: "note"
title: "26_gradient-descent_plot.py"
display_title: "26_gradient-descent_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "26"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/gradient-descent/"
parent_title: "경사 하강법"
description: "미분적분학 · 경사 하강법 코드 코드"
permalink: "/studies/calculus/code/26_gradient-descent_plot/"
---
{% raw %}
[경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 경사 하강법 문서의 그림을 만든다: 26_gradient-descent_fig1.svg, 26_gradient-descent_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_gradient-descent_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_gradient-descent"
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


from matplotlib import ticker


def log_ticks(axis):
    # 로그 눈금 글자를 10^k 꼴로 직접 쓴다(한글 글꼴에 없는 빼기 기호를 피한다)
    axis.set_major_formatter(ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$"))
    axis.set_minor_formatter(ticker.NullFormatter())


def gd_path(grad, x0, lr, steps):
    x = np.array(x0, float)
    path = [x.copy()]
    for _ in range(steps):
        x = x - lr * grad(x)
        path.append(x.copy())
    return np.array(path)


# 그림 1: x^2 + 10y^2에서 η = 0.09의 지그재그. y가 매 걸음 부호를 바꾸며 골짜기 벽을 오간다
g2 = lambda v: np.array([2 * v[0], 20 * v[1]])
P = gd_path(g2, [1.0, 1.0], 0.09, 25)
fig, ax = plt.subplots(figsize=(6, 3.2))
X, Y = np.meshgrid(np.linspace(-1.2, 1.2, 300), np.linspace(-1.2, 1.2, 300))
ax.contour(X, Y, X ** 2 + 10 * Y ** 2, levels=[0.05, 0.2, 0.5, 1, 2, 4, 7, 11], colors=INK, linewidths=0.7)
ax.plot(P[:, 0], P[:, 1], "o-", ms=3, lw=1.2, color=C[1])
ax.plot([1], [1], "o", ms=6, color=C[1])
ax.text(1.03, 1.02, "출발 $(1,1)$", fontsize=9, va="bottom")
ax.plot([0], [0], "+", ms=10, color=INK)
ax.set_aspect("equal")
ax.set_xlim(-0.3, 1.35)
ax.set_ylim(-1.15, 1.25)
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

# 그림 2: 조건수 100인 ½(x^2 + 100y^2)에서 처음 거리 대비 남은 거리. 학습률 두 가지와 헤비볼(모멘텀)
L, MU = 100.0, 1.0
gq = lambda v: np.array([MU * v[0], L * v[1]])


def run(lr, beta, steps):
    x, v = np.array([1.0, 1.0]), np.zeros(2)
    r0 = np.linalg.norm(x)
    out = [1.0]
    for _ in range(steps):
        v = beta * v - lr * gq(x)
        x = x + v
        out.append(np.linalg.norm(x) / r0)
    return np.array(out)


def first_below(r, tol=1e-6):
    return int(np.argmax(r <= tol))


K = 1500
sl, sm = math.sqrt(L), math.sqrt(MU)
runs = [
    (run(1 / L, 0, K), r"경사 하강법 $\eta=1/L$", C[0]),
    (run(2 / (L + MU), 0, K), r"경사 하강법 $\eta=2/(L+\mu)$", C[2]),
    (run(4 / (sl + sm) ** 2, ((sl - sm) / (sl + sm)) ** 2, K), "헤비볼(모멘텀)", C[1]),
]
fig, ax = plt.subplots(figsize=(6, 3.4))
for r, name, col in runs:
    n = first_below(r)
    ax.semilogy(np.arange(K + 1), r, color=col, lw=1.6, label=f"{name}: {n}걸음")
    ax.plot([n], [r[n]], "o", ms=4, color=col)
ax.axhline(1e-6, color=INK, lw=0.8, ls=":")
ax.yaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(-8, 1, 2)))
log_ticks(ax.yaxis)
ax.set_ylim(1e-8, 2)
ax.set_xlabel("걸음 수")
ax.set_ylabel("남은 거리 / 처음 거리")
ax.legend(loc="upper right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # η = 0.09: x는 0.82배, y는 -0.8배씩. 문서의 반복 수 약 1,340, 690, 90
    assert np.allclose(P[1], [0.82, -0.8]) and np.allclose(P[2], [0.82 ** 2, 0.64])
    assert all(P[k + 1][1] * P[k][1] < 0 for k in range(10))
    n1, n2, n3 = (first_below(r) for r, _, _ in runs)
    assert 1330 <= n1 <= 1350 and 685 <= n2 <= 695 and 85 <= n3 <= 100, (n1, n2, n3)
    print("ALL CHECKS PASSED")
```
{% endraw %}
