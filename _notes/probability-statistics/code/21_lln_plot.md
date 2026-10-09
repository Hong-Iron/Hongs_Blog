---
layout: "note"
title: "21_lln_plot.py"
display_title: "21_lln_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "21"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/lln/"
parent_title: "큰 수의 법칙"
description: "확률과 통계 · 큰 수의 법칙 코드 코드"
permalink: "/studies/probability-statistics/code/21_lln_plot/"
---
{% raw %}
[큰 수의 법칙](/Hongs_Blog/studies/probability-statistics/lln/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 큰 수의 법칙 문서의 그림을 만든다: 21_lln_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_lln_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_lln"
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


rng = np.random.default_rng(21)
NMAX = 10000
flips = rng.integers(0, 2, size=(3, NMAX))             # 동전 10,000번을 세 번 따로 던진다
ns = np.arange(1, NMAX + 1)
props = np.cumsum(flips, axis=1) / ns

# 개수 차이 |앞면 수 - n/2|의 평균: 2,000번 되풀이한 모의실험
many = rng.integers(0, 2, size=(2000, NMAX), dtype=np.int8)
counts = np.cumsum(many, axis=1, dtype=np.int32)
checkpoints = np.array([10, 30, 100, 300, 1000, 3000, 10000])
mean_gap = np.array([np.mean(np.abs(counts[:, n - 1] - n / 2)) for n in checkpoints])
mean_prop_gap = mean_gap / checkpoints

# 그림 1: 왼쪽 비율은 0.5로 모인다. 오른쪽 개수 차이는 √n처럼 커진다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
for i in range(3):
    a1.plot(ns, props[i], color=C[i], lw=1)
band = 0.5 / np.sqrt(ns)
a1.fill_between(ns, 0.5 - band, 0.5 + band, color=INK, alpha=0.15, lw=0)
a1.axhline(0.5, color=INK, lw=0.6)
a1.set_xscale("log")
log_ticks(a1, "x")
a1.set_ylim(0, 1)
a1.set_xlabel("던진 횟수 $n$")
a1.set_title("앞면 비율", fontsize=11)
a2.plot(checkpoints, mean_gap, "o-", color=C[1], ms=4)
a2.plot(checkpoints, math.sqrt(2 / math.pi) * 0.5 * np.sqrt(checkpoints), color=INK, lw=0.8, ls="--")
a2.text(1200, 9, "$\\propto\\sqrt{n}$", fontsize=11)
a2.set_xscale("log")
a2.set_yscale("log")
log_ticks(a2, "x")
a2.set_yticks([2, 5, 10, 20, 40])
a2.set_yticklabels(["2", "5", "10", "20", "40"])
a2.yaxis.set_minor_formatter(plt.NullFormatter())
a2.set_xlabel("던진 횟수 $n$")
a2.set_title("|앞면 수 - n/2|의 평균", fontsize=11)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    g = dict(zip(checkpoints.tolist(), mean_gap.tolist()))
    assert abs(g[100] - 4) < 0.4 and abs(g[10000] - 40) < 4      # 문서: 100번에서 약 4개
    assert abs(mean_prop_gap[2] - 0.04) < 0.004 and abs(mean_prop_gap[-1] - 0.004) < 0.0004
    assert all(np.abs(props[:, -1] - 0.5) < 0.02)
    assert abs(np.polyfit(np.log(checkpoints), np.log(mean_gap), 1)[0] - 0.5) < 0.03
    print("ALL CHECKS PASSED")
```
{% endraw %}
