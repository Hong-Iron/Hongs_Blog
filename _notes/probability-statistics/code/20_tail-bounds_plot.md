---
layout: "note"
title: "20_tail-bounds_plot.py"
display_title: "20_tail-bounds_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "20"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/tail-bounds/"
parent_title: "확률 부등식"
description: "확률과 통계 · 확률 부등식 코드 코드"
permalink: "/studies/probability-statistics/code/20_tail-bounds_plot/"
---
{% raw %}
[확률 부등식](/Hongs_Blog/studies/probability-statistics/tail-bounds/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 확률 부등식 문서의 그림을 만든다: 20_tail-bounds_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_tail-bounds_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_tail-bounds"
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


def Phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def log_ticks(ax, axis="y"):
    """로그 눈금 글자를 수식 글꼴로 쓴다(한글 글꼴에 없는 마이너스 기호를 피한다)."""
    from matplotlib.ticker import FuncFormatter
    f = FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$" if v > 0 else "")
    (ax.yaxis if axis == "y" else ax.xaxis).set_major_formatter(f)


N, MU, VAR = 100, 50, 25                               # 동전 100번, 앞면 수 X의 평균과 분산


def exact_tail(a):
    return sum(math.comb(N, k) for k in range(a, N + 1)) / 2 ** N


def markov(a):
    return MU / a


def chebyshev(a):
    return VAR / (a - MU) ** 2                          # P(X − μ ≥ t) ≤ P(|X − μ| ≥ t) ≤ σ²/t²


def chernoff(a):
    d = (a - MU) / MU
    return math.exp(-d * d * MU / 3)


# 그림 1: P(X ≥ a)에 대한 세 한계와 참값 (세로축은 로그 눈금)
a_s = np.arange(56, 101)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(a_s, [min(1, markov(a)) for a in a_s], color=C[0], lw=2, label="마르코프")
ax.plot(a_s, [min(1, chebyshev(a)) for a in a_s], color=C[1], lw=2, label="체비쇼프")
ax.plot(a_s, [chernoff(a) for a in a_s], color=C[2], lw=2, label="체르노프")
ax.plot(a_s, [exact_tail(a) for a in a_s], color=INK, lw=2.4, label="참값")
ax.set_yscale("log")
log_ticks(ax)
ax.axvline(75, color=INK, lw=0.6, ls=":")
ax.text(75.5, 2e-29, "$a = 75$", fontsize=10)
ax.set_ylim(1e-30, 3)
ax.set_xlabel("$a$ (앞면 수)")
ax.set_ylabel("$P(X \\geq a)$의 한계")
ax.legend(loc="lower left")
save(fig, 1)

if __name__ == "__main__":
    assert round(markov(75), 3) == 0.667 and chebyshev(75) == 0.04 and round(chernoff(75), 4) == 0.0155
    assert abs(exact_tail(75) - 2.8e-7) < 0.05e-7
    assert all(exact_tail(a) <= chernoff(a) <= 1 for a in a_s) and all(exact_tail(a) <= chebyshev(a) for a in a_s)
    print("ALL CHECKS PASSED")
```
{% endraw %}
