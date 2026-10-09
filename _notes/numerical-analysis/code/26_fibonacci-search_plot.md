---
layout: "note"
title: "26_fibonacci-search_plot.py"
display_title: "26_fibonacci-search_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "26"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/fibonacci-search/"
parent_title: "피보나치 탐색"
description: "수치해석 · 피보나치 탐색 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/26_fibonacci-search_plot/"
---
{% raw %}
[피보나치 탐색](/Hongs_Blog/studies/numerical-analysis/fibonacci-search/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 피보나치 탐색 문서의 그림을 만든다: 26_fibonacci-search_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_fibonacci-search_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_fibonacci-search"
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


F = [0, 1]
while len(F) < 25:
    F.append(F[-1] + F[-2])
N = 21                                                  # F_21 = 10946 > 10000
R = (math.sqrt(5) - 1) / 2
ks = np.arange(0, N - 2)                                # k = 0..18
r = np.array([F[N - 1 - k] / F[N - k] for k in ks])

fig, ax = plt.subplots(figsize=(6, 3.2))
ax.axhline(R, color=INK, lw=1, ls="--")
ax.text(0.2, R + 0.006, "황금비 0.618", fontsize=9, va="bottom")
ax.plot(ks, r, "o-", color=C[0], ms=4, lw=1.4)
for k in (15, 16, 17, 18):
    ax.annotate(f"{F[N - 1 - k]}/{F[N - k]}", (k, r[k]), textcoords="offset points", ha="center",
                xytext={15: (0, 7), 16: (0, -15), 17: (0, 7), 18: (-16, -4)}[k], fontsize=9)
ax.set_xticks([0, 5, 10, 15, 18])
ax.set_xlabel("회차 $k$")
ax.set_ylabel("남기는 비율 $r_k$")
ax.set_ylim(0.47, 0.70)
save(fig, 1)

if __name__ == "__main__":
    # F_21 = 10946, r_0 = F_20/F_21 ≈ 0.6180340, 마지막 r_18 = 1/2, 비율을 다 곱하면 1/F_21
    assert F[21] == 10946 and F[20] < 10000 < F[21]
    assert abs(r[0] - 0.6180340) < 1e-7 and r[-1] == 0.5
    assert abs(np.prod(r) - 1 / F[21]) < 1e-15
    print("ALL CHECKS PASSED")
```
{% endraw %}
