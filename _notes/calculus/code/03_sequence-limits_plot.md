---
layout: "note"
title: "03_sequence-limits_plot.py"
display_title: "03_sequence-limits_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "03"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/sequence-limits/"
parent_title: "수열의 극한과 e"
description: "미분적분학 · 수열의 극한과 e 그림 생성 코드"
permalink: "/studies/calculus/code/03_sequence-limits_plot/"
---
{% raw %}
[수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 수열의 극한과 e 문서의 그림을 만든다: 03_sequence-limits_fig1.svg, 03_sequence-limits_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 03_sequence-limits_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "03_sequence-limits"
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


from fractions import Fraction

# 그림 1: (1 + 1/n)^n은 커지기만 하지만 3을 넘지 못하고 e에 다가간다
n = np.arange(1, 41)
a = (1 + 1 / n) ** n
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.plot(n, a, "o", ms=4, color=C[0])
ax.axhline(math.e, color=C[2], lw=1.2, ls="--")
ax.axhline(3, color=C[1], lw=1.2)
ax.text(1, math.e + 0.03, r"$e \approx 2.71828$", ha="left", va="bottom", fontsize=10, color=C[2])
ax.text(40, 3 - 0.04, "넘지 못하는 벽 3", ha="right", va="top", fontsize=10, color=C[1])
ax.set_ylim(1.9, 3.15)
ax.set_xlabel("$n$")
ax.set_ylabel(r"$(1+1/n)^n$")
save(fig, 1)

# 그림 2: 조화수 H_n. 걸음 1/n은 0으로 가지만 합은 로그처럼 끝없이 자란다
N = 65536
H = np.cumsum(1 / np.arange(1, N + 1))
fig, ax = plt.subplots(figsize=(6, 3.4))
k = np.unique(np.logspace(0, np.log10(N), 400).astype(int))
ax.plot(k, H[k - 1], color=C[0], lw=2, label="$H_n$")
pk = 2 ** np.arange(0, 17)
ax.plot(pk, 1 + np.arange(0, 17) / 2, "o", ms=3.5, color=C[1], label=r"$1 + k/2$  ($n = 2^k$)")
ax.set_xscale("log")
ax.set_xlabel("$n$ (로그 눈금)")
ax.legend(loc="upper left")
save(fig, 2)

if __name__ == "__main__":
    # 증가하고 3 미만(유리수로 정확히), 처음 값 2, 2.25, H_{2^k} >= 1 + k/2, H_65536 >= 9
    prev = Fraction(0)
    for m in range(1, 41):
        v = (1 + Fraction(1, m)) ** m
        assert prev < v < 3
        prev = v
    assert a[0] == 2 and a[1] == 2.25
    for kk in range(17):
        assert H[2 ** kk - 1] >= 1 + kk / 2 - 1e-12
    assert H[N - 1] >= 9
    print("ALL CHECKS PASSED")
```
{% endraw %}
