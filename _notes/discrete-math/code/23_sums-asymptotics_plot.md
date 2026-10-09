---
layout: "note"
title: "23_sums-asymptotics_plot.py"
display_title: "23_sums-asymptotics_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "23"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/sums-asymptotics/"
parent_title: "합의 계산과 어림"
description: "이산수학 · 합의 계산과 어림 코드 코드"
permalink: "/studies/discrete-math/code/23_sums-asymptotics_plot/"
---
{% raw %}
[합의 계산과 어림](/Hongs_Blog/studies/discrete-math/sums-asymptotics/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 합의 계산과 어림 문서의 그림을 만든다: 23_sums-asymptotics_fig1.svg, 23_sums-asymptotics_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_sums-asymptotics_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_sums-asymptotics"
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


def harmonic(n):
    return sum(1 / k for k in range(1, n + 1))


# 그림 1: 조화수 H_n과 두 끼우기 1 + floor(lg n)/2, 1 + lg n, 그리고 ln n + 0.5772
ns = np.arange(1, 129)
H = np.cumsum(1 / ns)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(ns, 1 + np.log2(ns), color=C[1], lw=1.4, label=r"위: $1 + \lg n$")
ax.plot(ns, H, color=INK, lw=2.4, label=r"$H_n$")
ax.plot(ns, np.log(ns) + 0.5772, color=C[2], lw=1.2, ls="--", label=r"$\ln n + 0.5772$")
ax.step(ns, 1 + np.floor(np.log2(ns)) / 2, where="post", color=C[0], lw=1.4, label=r"아래: $1 + \lfloor \lg n \rfloor / 2$")
ax.set_xlabel("$n$")
ax.set_xticks([1, 16, 32, 64, 96, 128])
ax.legend(loc="upper left", fontsize=10)
save(fig, 1)

# 그림 2: lg n!을 n lg n으로 나눈 비. Θ(n lg n)이지만 1에 아주 천천히 다가간다
ns = np.unique(np.logspace(1, 6, 200).astype(int))
lgfact = np.array([math.lgamma(n + 1) / math.log(2) for n in ns])
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.semilogx(ns, lgfact / (ns * np.log2(ns)), color=C[0], lw=2, label=r"$\lg n! \,/\, (n \lg n)$")
ax.semilogx(ns, (ns / 2) * np.log2(ns / 2) / (ns * np.log2(ns)), color=C[1], lw=1.4, ls="--",
            label=r"아래 끼우기 $\frac{n}{2}\lg\frac{n}{2} \,/\, (n \lg n)$")
ax.axhline(1, color=INK, lw=0.8, ls=":")
ax.set_ylim(0, 1.1)
ax.set_xlabel("$n$")
ax.legend(loc="lower right", fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # 끼우기 (n ≤ 10^4), H_128 ≈ ln 128 + 0.5772, n = 10^6에서 lg n!/(n lg n) ≈ 0.93, 아래 끼우기 비는 1/2 미만
    h = 0.0
    for n in range(1, 10001):
        h += 1 / n
        assert 1 + math.floor(math.log2(n)) / 2 <= h + 1e-12 and h <= 1 + math.log2(n) + 1e-12
    assert abs(harmonic(128) - (math.log(128) + 0.5772)) < 0.005
    r = math.lgamma(10 ** 6 + 1) / math.log(2) / (10 ** 6 * math.log2(10 ** 6))
    assert 0.92 < r < 0.94
    assert (5e5 * math.log2(5e5)) / (1e6 * math.log2(1e6)) < 0.5
    print("ALL CHECKS PASSED")
```
{% endraw %}
