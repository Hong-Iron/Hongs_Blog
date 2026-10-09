---
layout: "note"
title: "17_series-convergence_plot.py"
display_title: "17_series-convergence_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "17"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/series-convergence/"
parent_title: "급수의 수렴"
description: "미분적분학 · 급수의 수렴 코드 코드"
permalink: "/studies/calculus/code/17_series-convergence_plot/"
---
{% raw %}
[급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 급수의 수렴 문서의 그림을 만든다: 17_series-convergence_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 17_series-convergence_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "17_series-convergence"
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


from matplotlib import ticker

N = 10 ** 6
k = np.arange(1, N + 1, dtype=float)
S_h = np.cumsum(1 / k)
S_b = np.cumsum(1 / k ** 2)
S_a = np.cumsum((-1) ** (k + 1) / k)

# 그림 1: 세 급수의 부분합. 조화급수는 끝없이 오르고, 나머지 둘은 한 값으로 모인다
idx = np.unique(np.logspace(0, 6, 120).astype(int))
idx = np.unique(np.concatenate([idx, idx + 1]))
idx = idx[idx <= N] - 1                          # 이웃한 두 항을 함께 찍어 교대급수의 지그재그를 보인다
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(k[idx], S_h[idx], color=C[0], lw=2, label=r"$\sum 1/k$ (발산)")
ax.plot(k[idx], S_b[idx], color=C[1], lw=2, label=r"$\sum 1/k^2 \to \pi^2/6$")
ax.plot(k[idx], S_a[idx], color=C[2], lw=1.2, label=r"$\sum (-1)^{k+1}/k \to \ln 2$")
ax.axhline(math.pi ** 2 / 6, color=C[1], lw=0.8, ls=":")
ax.axhline(math.log(2), color=C[2], lw=0.8, ls=":")
ax.set_xscale("log")
ax.set_ylim(0.3, 3.2)
ax.annotate("위로 계속 오른다\n($n=10^6$에서 14.39)", xy=(14, 3.15), xytext=(60, 2.75), fontsize=9, color=C[0],
            arrowprops=dict(arrowstyle="->", color=C[0], lw=0.8))
ax.xaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(0, 7)))
ax.xaxis.set_major_formatter(ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$"))
ax.xaxis.set_minor_formatter(ticker.NullFormatter())
ax.set_xlabel("더한 항의 수 $n$ (로그 눈금)")
ax.set_ylabel("부분합 $S_n$")
ax.legend(loc="upper right", fontsize=9, bbox_to_anchor=(1.0, 0.95))
save(fig, 1)

if __name__ == "__main__":
    # 예시 표의 부분합
    for n, h, b, a in [(10, 2.929, 1.550, 0.6456), (1000, 7.485, 1.6439, 0.6926)]:
        assert abs(S_h[n - 1] - h) < 1e-3 and abs(S_b[n - 1] - b) < 1e-3 and abs(S_a[n - 1] - a) < 1e-4
    assert abs(S_h[-1] - 14.39) < 0.01 and abs(S_b[-1] - 1.644933) < 1e-6 and abs(S_a[-1] - 0.693147) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
