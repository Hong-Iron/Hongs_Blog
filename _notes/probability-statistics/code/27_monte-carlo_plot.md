---
layout: "note"
title: "27_monte-carlo_plot.py"
display_title: "27_monte-carlo_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "27"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/monte-carlo/"
parent_title: "몬테카를로 방법"
description: "확률과 통계 · 몬테카를로 방법 코드 코드"
permalink: "/studies/probability-statistics/code/27_monte-carlo_plot/"
---
{% raw %}
[몬테카를로 방법](/Hongs_Blog/studies/probability-statistics/monte-carlo/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 몬테카를로 방법 문서의 그림을 만든다: 27_monte-carlo_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_monte-carlo_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_monte-carlo"
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


rng = np.random.default_rng(27)
TRUE_RMS = lambda n: math.sqrt(math.pi * (4 - math.pi) / n)   # Y ∈ {0, 4}, Var[Y] = π(4 − π)


def estimate_pi(n):
    pts = rng.random((n, 2))
    return 4 * np.mean((pts ** 2).sum(axis=1) <= 1)


# 오차의 제곱평균: 표본 수마다 400번 되풀이
ns = np.array([250, 1000, 4000, 16000, 64000])
rms = np.array([math.sqrt(np.mean([(estimate_pi(n) - math.pi) ** 2 for _ in range(400)])) for n in ns])

# 그림 1: 왼쪽 점 2,000개 중 사분원 안(파랑)의 비율 × 4, 오른쪽 오차는 표본 4배마다 절반
pts = rng.random((2000, 2))
inside = (pts ** 2).sum(axis=1) <= 1
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.1))
a1.plot(pts[inside, 0], pts[inside, 1], "o", ms=1.5, color=C[0])
a1.plot(pts[~inside, 0], pts[~inside, 1], "o", ms=1.5, color=C[1])
th = np.linspace(0, math.pi / 2, 200)
a1.plot(np.cos(th), np.sin(th), color=INK, lw=1)
a1.set_aspect("equal")
a1.set_title(f"점 2,000개: 4 × {inside.mean():.3f} = {4 * inside.mean():.3f}", fontsize=10)
a1.set_xticks([0, 1])
a1.set_yticks([0, 1])
a2.plot(ns, rms, "o", color=C[0], ms=5, label="모의실험")
a2.plot(ns, [TRUE_RMS(n) for n in ns], color=INK, lw=1, ls="--", label="$1.64/\\sqrt{n}$")
a2.set_xscale("log")
a2.set_yscale("log")
a2.set_xticks(ns)
a2.set_xticklabels([f"{n:,}" for n in ns], fontsize=8)
a2.xaxis.set_minor_formatter(plt.NullFormatter())
a2.set_yticks([0.1, 0.05, 0.02, 0.01])
a2.set_yticklabels(["0.1", "0.05", "0.02", "0.01"])
a2.yaxis.set_minor_formatter(plt.NullFormatter())
a2.set_xlabel("표본 수 $n$")
a2.set_title("오차의 제곱평균", fontsize=10)
a2.legend(loc="upper right")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert [round(TRUE_RMS(n), 3) for n in (1000, 4000, 16000)] == [0.052, 0.026, 0.013]
    assert all(abs(r / TRUE_RMS(n) - 1) < 0.12 for r, n in zip(rms, ns))
    print("ALL CHECKS PASSED")
```
{% endraw %}
