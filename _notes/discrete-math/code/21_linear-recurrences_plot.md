---
layout: "note"
title: "21_linear-recurrences_plot.py"
display_title: "21_linear-recurrences_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "21"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/linear-recurrences/"
parent_title: "선형 점화식"
description: "이산수학 · 선형 점화식 코드 코드"
permalink: "/studies/discrete-math/code/21_linear-recurrences_plot/"
---
{% raw %}
[선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 선형 점화식 문서의 그림을 만든다: 21_linear-recurrences_fig1.svg, 21_linear-recurrences_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_linear-recurrences_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_linear-recurrences"
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


PHI = (1 + math.sqrt(5)) / 2


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


# 그림 1: 하노이 T_n = 2^n - 1과 피보나치 F_n (세로축 로그). 로그 눈금에서 지수 증가는 직선이다
ns = np.arange(1, 31)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.semilogy(ns, [2 ** n - 1 for n in ns], "o", color=C[1], ms=3.5, label=r"하노이 $T_n = 2^n - 1$")
ax.semilogy(ns, [fib(n) for n in ns], "o", color=C[0], ms=3.5, label=r"피보나치 $F_n$")
xs = np.linspace(1, 30, 200)
ax.semilogy(xs, PHI ** xs / math.sqrt(5), color=C[0], lw=1, ls="--", label=r"$\varphi^n/\sqrt{5}$")
ax.semilogy(xs, 2.0 ** xs, color=C[1], lw=1, ls="--", label=r"$2^n$")
ax.set_xlabel("$n$")
ax.legend(loc="upper left")
save(fig, 1)

# 그림 2: 이웃한 두 피보나치 수의 비 F_{n+1}/F_n이 φ 위아래를 오가며 다가간다
ns = np.arange(1, 16)
ratio = [fib(n + 1) / fib(n) for n in ns]
fig, ax = plt.subplots(figsize=(6, 3.2))
ax.axhline(PHI, color=INK, lw=1, ls="--")
ax.text(15, PHI + 0.05, r"$\varphi \approx 1.618$", ha="right", va="bottom", fontsize=10)
ax.plot(ns, ratio, "o-", color=C[0], ms=5, lw=1.4)
for n, r in zip(ns[:5], ratio[:5]):
    ax.annotate(f"{fib(n + 1)}/{fib(n)}", (n, r), textcoords="offset points",
                xytext=(14, -2) if n == 1 else (0, 8 if r > PHI else -16), ha="center", va="center" if n == 1 else "baseline", fontsize=9)
ax.set_xticks(ns)
ax.set_ylim(0.9, 2.2)
ax.set_xlabel("$n$")
ax.set_ylabel(r"$F_{n+1}/F_n$")
save(fig, 2)

if __name__ == "__main__":
    # F_n = round(φ^n/√5) (n ≤ 30), T_n = 2^n - 1을 점화식으로, 비는 φ 위아래를 번갈아 오가며 F_16/F_15와 φ의 차가 1e-5 미만
    t = 0
    for n in range(1, 31):
        t = 2 * t + 1
        assert t == 2 ** n - 1
        assert fib(n) == round(PHI ** n / math.sqrt(5))
    signs = [(fib(n + 1) / fib(n) - PHI) > 0 for n in range(1, 16)]
    assert all(signs[i] != signs[i + 1] for i in range(len(signs) - 1))
    assert abs(fib(16) / fib(15) - PHI) < 1e-5
    print("ALL CHECKS PASSED")
```
{% endraw %}
