---
layout: "note"
title: "10_linear-approx-newton_plot.py"
display_title: "10_linear-approx-newton_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "10"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/linear-approx-newton/"
parent_title: "선형 근사와 뉴턴 방법"
description: "미분적분학 · 선형 근사와 뉴턴 방법 코드 코드"
permalink: "/studies/calculus/code/10_linear-approx-newton_plot/"
---
{% raw %}
[선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형 근사와 뉴턴 방법 문서의 그림을 만든다: 10_linear-approx-newton_fig1.svg, 10_linear-approx-newton_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 10_linear-approx-newton_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "10_linear-approx-newton"
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


def f(x):
    return x * x - 2


def newton(x0, n):
    xs = [x0]
    for _ in range(n):
        x = xs[-1]
        xs.append(x - f(x) / (2 * x))
    return xs


XS = newton(1.0, 5)
R2 = math.sqrt(2)

# 그림 1: x^2 - 2의 뉴턴 방법 두 걸음. 접선이 0이 되는 곳이 다음 추측
x = np.linspace(0.9, 1.65, 300)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(x, f(x), color=INK, lw=2.4, label="$f(x)=x^2-2$")
ax.axhline(0, color=INK, lw=0.6)
for i in range(2):
    xi, xn = XS[i], XS[i + 1]
    ax.plot([xi, xi], [0, f(xi)], color=INK, lw=0.7, ls=":")
    ax.plot([xi, xn], [f(xi), 0], color=C[i], lw=1.6, label=f"$x_{i}$에서의 접선")
    ax.plot([xi], [f(xi)], "o", ms=5, color=C[i])
for i, xv in enumerate(XS[:3]):
    ax.plot([xv], [0], "|", ms=12, mew=2, color=INK)
    ax.text(xv, -0.12, f"$x_{i}$", ha="center", va="top", fontsize=10)
ax.plot([R2], [0], "o", ms=5, mfc="none", mec=C[2], mew=1.5)
ax.text(R2, 0.1, r"$\sqrt{2}$", ha="right", va="bottom", fontsize=10, color=C[2])
ax.set_xlim(0.9, 1.65)
ax.set_ylim(-1.25, 0.8)
ax.set_xlabel("$x$")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

# 그림 2: 같은 정밀도까지 걸리는 횟수. 이분법은 한 번에 절반, 뉴턴은 맞는 자릿수가 두 배
fig, ax = plt.subplots(figsize=(6, 3.4))
bis = [2.0 ** -k for k in range(0, 41)]
ax.semilogy(range(0, 41), bis, "o-", ms=3, lw=1.2, color=C[0], label="이분법 구간 길이 ($[1,2]$에서 시작)")
err = [abs(v - R2) for v in XS[:5]]
ax.semilogy(range(0, 5), err, "s-", ms=5, lw=1.6, color=C[1], label="뉴턴 방법 오차 ($x_0=1$)")
ax.axhline(1e-12, color=INK, lw=0.8, ls=":")
ax.yaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(-12, 1, 3)))
log_ticks(ax.yaxis)
ax.set_ylim(1e-13, 3)
ax.set_xlabel("반복 횟수")
ax.legend(loc="upper right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 표의 x_n과 오차, 이분법 40번이면 길이 1e-12 이하, 뉴턴은 5번째 값이 1e-12 안
    assert XS[1] == 1.5 and abs(XS[2] - 1.41667) < 1e-5 and abs(XS[3] - 1.4142157) < 1e-7
    assert abs(err[1] - 8.6e-2) < 0.1e-2 and abs(err[2] - 2.5e-3) < 0.1e-3
    assert abs(err[3] - 2.1e-6) < 0.1e-6 and abs(err[4] - 1.6e-12) < 0.1e-12
    assert 2.0 ** -40 <= 1e-12 < 2.0 ** -39
    assert abs(XS[5] - R2) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
