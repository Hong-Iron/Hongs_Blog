---
layout: "note"
title: "10_positional-notation_plot.py"
display_title: "10_positional-notation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "10"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/positional-notation/"
parent_title: "진법과 자릿수"
description: "대학수학 · 진법과 자릿수 코드 코드"
permalink: "/studies/college-math/code/10_positional-notation_plot/"
---
{% raw %}
[진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 진법과 자릿수 문서의 그림을 만든다: 10_positional-notation_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 10_positional-notation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "10_positional-notation"
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

# 그림 1: n의 2진 자릿수(계단)와 lg n(곡선). 계단은 2의 거듭제곱에서 한 칸씩 오른다
n = np.arange(1, 71)
bits = np.array([int(v).bit_length() for v in n])
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.step(n, bits, where="post", color=C[0], lw=2, label="2진 자릿수 $\\lfloor \\lg n \\rfloor + 1$")
xs = np.linspace(1, 70, 400)
ax.plot(xs, np.log2(xs), color=C[1], lw=1.8, label="$\\lg n$")
for k in range(0, 7):
    ax.plot([2 ** k], [k + 1], "o", color=C[0], ms=4)
ax.annotate("$n = 8$: 4자리, $\\lg 8 = 3$", xy=(8, 3), xytext=(16, 1.2), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_xticks([4, 8, 16, 32, 64])
ax.set_ylim(0, 7.8)
ax.set_xlabel("$n$")
ax.legend(loc="upper left", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    # 자릿수 = ⌊lg n⌋ + 1 (정수 연산), 8은 4비트, lg 8 = 3
    for v in range(1, 5000):
        m = v.bit_length()
        assert 2 ** (m - 1) <= v < 2 ** m
    assert (8).bit_length() == 4 and math.log2(8) == 3
    print("ALL CHECKS PASSED")
```
{% endraw %}
