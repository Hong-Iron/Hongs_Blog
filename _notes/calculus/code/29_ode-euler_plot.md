---
layout: "note"
title: "29_ode-euler_plot.py"
display_title: "29_ode-euler_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "29"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/ode-euler/"
parent_title: "미분방정식과 오일러 방법"
description: "미분적분학 · 미분방정식과 오일러 방법 그림 생성 코드"
permalink: "/studies/calculus/code/29_ode-euler_plot/"
---
{% raw %}
[미분방정식과 오일러 방법](/Hongs_Blog/studies/calculus/ode-euler/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 미분방정식과 오일러 방법 문서의 그림을 만든다: 29_ode-euler_fig1.svg, 29_ode-euler_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 29_ode-euler_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "29_ode-euler"
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


def euler(f, y0, h, n):
    ts, ys = [0.0], [y0]
    for k in range(n):
        ys.append(ys[-1] + h * f(ts[-1], ys[-1]))
        ts.append((k + 1) * h)
    return np.array(ts), np.array(ys)


# 그림 1: y' = y, y(0) = 1. 오일러 방법은 지금의 기울기로 꺾은선을 이어 가서 참값 e^t보다 늘 아래에 있다
fig, ax = plt.subplots(figsize=(6, 3.6))
t = np.linspace(0, 1, 200)
ax.plot(t, np.exp(t), color=INK, lw=2.4, label="참값 $e^t$")
RES = {}
for i, h in enumerate([0.5, 0.1]):
    ts, ys = euler(lambda _t, y: y, 1.0, h, round(1 / h))
    RES[h] = ys[-1]
    ax.plot(ts, ys, "o-", ms=4, lw=1.4, color=C[i], label=f"오일러 $h={h}$: $y(1)\\approx{ys[-1]:.4g}$")
ax.set_xlabel("$t$")
ax.set_ylabel("$y$")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

# 그림 2: y' = -10y. 걸음 h에 따라 매 걸음 (1 - 10h)배가 된다. h = 0.25면 부호를 바꾸며 커진다
fig, ax = plt.subplots(figsize=(6, 3.4))
t = np.linspace(0, 1.5, 200)
ax.plot(t, np.exp(-10 * t), color=INK, lw=2.4, label="참값 $e^{-10t}$")
for i, h in enumerate([0.05, 0.15, 0.25]):
    ts, ys = euler(lambda _t, y: -10 * y, 1.0, h, int(round(1.5 / h)))
    ax.plot(ts, ys, "o-", ms=3.5, lw=1.3, color=C[i], label=f"$h={h}$: 한 걸음에 ${1 - 10 * h:g}$배")
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-6, 6)
ax.set_xlabel("$t$")
ax.set_ylabel("$y$")
ax.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 표의 값 1.5^2 = 2.25, 1.1^10 ≈ 2.5937, 그리고 세 걸음 크기의 인수와 h = 0.25가 40걸음에 10^6을 넘는 것
    assert abs(RES[0.5] - 2.25) < 1e-12 and abs(RES[0.1] - 2.5937) < 1e-4
    assert abs(euler(lambda _t, y: y, 1.0, 0.01, 100)[1][-1] - 2.7048) < 1e-4
    for h, fac in [(0.05, 0.5), (0.15, -0.5), (0.25, -1.5)]:
        ys = euler(lambda _t, y: -10 * y, 1.0, h, 3)[1]
        assert np.allclose(ys[1:] / ys[:-1], fac)
    assert abs(euler(lambda _t, y: -10 * y, 1.0, 0.25, 40)[1][-1]) > 1e6
    print("ALL CHECKS PASSED")
```
{% endraw %}
