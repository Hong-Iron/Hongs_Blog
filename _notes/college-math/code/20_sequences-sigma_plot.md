---
layout: "note"
title: "20_sequences-sigma_plot.py"
display_title: "20_sequences-sigma_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "20"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/sequences-sigma/"
parent_title: "수열과 합의 기호"
description: "대학수학 · 수열과 합의 기호 그림 생성 코드"
permalink: "/studies/college-math/code/20_sequences-sigma_plot/"
---
{% raw %}
[수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 수열과 합의 기호 문서의 그림을 만든다: 20_sequences-sigma_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_sequences-sigma_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_sequences-sigma"
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

N = 6

# 그림 1: 1 + 2 + … + 6(파랑)과 거꾸로 쌓은 6 + 5 + … + 1(주황)이 6 × 7 직사각형을 채운다
fig, ax = plt.subplots(figsize=(6, 3.6))
k = np.arange(1, N + 1)
ax.bar(k, k, width=0.92, color=C[0], label="$1 + 2 + \\cdots + 6$")
ax.bar(k, N + 1 - k, width=0.92, bottom=k, color=C[1], alpha=0.75, label="$6 + 5 + \\cdots + 1$")
ax.axhline(N + 1, color=INK, lw=0.8, ls=":")
ax.text(N + 0.55, N + 1.15, "높이 7", fontsize=10, va="bottom")
ax.set_xticks(k)
ax.set_xlabel("$k$")
ax.set_ylim(0, 9.5)
ax.set_xlim(0.4, 7.6)
ax.legend(loc="upper left", fontsize=10, ncol=2)
save(fig, 1)

if __name__ == "__main__":
    # 2S = 6 × 7, S = 21, 공식 n(n+1)/2와 일치
    assert sum(range(1, N + 1)) == 21 and 2 * 21 == N * (N + 1)
    assert all(sum(range(1, n + 1)) == n * (n + 1) // 2 for n in range(0, 2001))
    print("ALL CHECKS PASSED")
```
{% endraw %}
