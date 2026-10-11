---
layout: "note"
title: "15_permutations-combinations_plot.py"
display_title: "15_permutations-combinations_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "15"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/permutations-combinations/"
parent_title: "순열과 조합"
description: "이산수학 · 순열과 조합 그림 생성 코드"
permalink: "/studies/discrete-math/code/15_permutations-combinations_plot/"
---
{% raw %}
[순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 순열과 조합 문서의 그림을 만든다: 15_permutations-combinations_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_permutations-combinations_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_permutations-combinations"
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


# 그림 1: k를 고정한 C(n,2), C(n,3)과 k = n/2인 C(n, n/2)의 증가 (세로축 로그)
ns = np.arange(4, 42, 2)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.semilogy(ns, [math.comb(n, 2) for n in ns], "o-", color=C[0], ms=3.5, lw=1.5, label=r"$\binom{n}{2}$")
ax.semilogy(ns, [math.comb(n, 3) for n in ns], "o-", color=C[2], ms=3.5, lw=1.5, label=r"$\binom{n}{3}$")
ax.semilogy(ns, [math.comb(n, n // 2) for n in ns], "o-", color=C[1], ms=3.5, lw=1.5, label=r"$\binom{n}{n/2}$")
xs = np.linspace(4, 40, 200)
ax.semilogy(xs, 2.0 ** xs / np.sqrt(np.pi * xs / 2), color=INK, lw=1.4, ls="--", zorder=5, label=r"$2^n/\sqrt{\pi n/2}$")
ax.set_xlabel("$n$")
ax.set_ylabel("고르는 방법의 수")
ax.legend(loc="upper left")
save(fig, 1)

if __name__ == "__main__":
    # C(40,20) = 137,846,528,820, 어림과의 차이 1% 미만, n = 40에서 C(n,3) = 9,880
    assert math.comb(40, 20) == 137846528820
    approx = 2 ** 40 / math.sqrt(math.pi * 20)
    assert abs(approx - math.comb(40, 20)) / math.comb(40, 20) < 0.01
    assert math.comb(40, 3) == 9880 and math.comb(40, 2) == 780
    print("ALL CHECKS PASSED")
```
{% endraw %}
