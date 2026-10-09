---
layout: "note"
title: "08_log-scale_plot.py"
display_title: "08_log-scale_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "08"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/log-scale/"
parent_title: "로그함수와 로그 스케일"
description: "대학수학 · 로그함수와 로그 스케일 코드 코드"
permalink: "/studies/college-math/code/08_log-scale_plot/"
---
{% raw %}
[로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 로그함수와 로그 스케일 문서의 그림을 만든다: 08_log-scale_fig1.svg, 08_log-scale_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 08_log-scale_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "08_log-scale"
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

N = [1000, 2000, 4000, 8000]
INS = [499500, 1999000, 7998000, 31996000]
MER = [8690, 19412, 42761, 93643]

# 그림 1: 같은 측정값을 보통 눈금과 로그-로그 눈금으로
fig, axs = plt.subplots(1, 2, figsize=(6.5, 3))
for ax in axs:
    k = 1e6 if ax is axs[0] else 1
    ax.plot(N, np.array(INS) / k, "o-", color=C[1], lw=1.6, label="삽입 정렬")
    ax.plot(N, np.array(MER) / k, "s-", color=C[0], lw=1.6, label="병합 정렬")
    ax.set_xlabel("$n$")
axs[0].set_title("보통 눈금", fontsize=11)
axs[0].set_ylabel("비교 횟수 (백만)")
axs[1].set_ylabel("비교 횟수")
axs[1].set_xscale("log")
axs[1].set_yscale("log")
axs[1].set_title("로그-로그 눈금", fontsize=11)
axs[1].text(1100, 1.2e7, "기울기 2.00", fontsize=10, color=C[1])
axs[1].text(2600, 1.6e4, "기울기 1.14", fontsize=10, color=C[0], va="top")
axs[1].set_ylim(5e3, 1e8)
axs[1].set_xticks(N)
axs[1].set_xticklabels([str(v) for v in N])
axs[1].minorticks_off()
axs[0].legend(loc="upper left", fontsize=10)
fig.tight_layout()
save(fig, 1)

# 그림 2: 밑이 다른 로그함수. 모두 (1, 0)을 지나고 y축에 한없이 다가간다
x = np.linspace(0.02, 8, 500)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (b, lab) in enumerate([(2, "$\\log_2 x$"), (math.e, "$\\ln x$"), (10, "$\\log_{10} x$"), (0.5, "$\\log_{1/2} x$")]):
    ax.plot(x, np.log(x) / math.log(b), color=C[i], lw=2, label=lab)
ax.plot([1], [0], "o", color=INK)
ax.annotate("(1, 0)", xy=(1, 0), xytext=(0.5, 2.6), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.axhline(0, color=INK, lw=0.6)
ax.axvline(0, color=INK, lw=0.6)
ax.set_ylim(-4, 4)
ax.set_xlim(-0.3, 8)
ax.set_xlabel("$x$")
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # 삽입 정렬은 정확히 n(n-1)/2, 두 기울기 2.00과 1.14, 모든 로그가 (1, 0)을 지남
    assert INS == [n * (n - 1) // 2 for n in N]
    s_ins = math.log(INS[-1] / INS[0]) / math.log(8)
    s_mer = math.log(MER[-1] / MER[0]) / math.log(8)
    assert round(s_ins, 2) == 2.00 and round(s_mer, 2) == 1.14
    assert all(abs(math.log(1, b)) < 1e-15 for b in (2, math.e, 10, 0.5))
    print("ALL CHECKS PASSED")
```
{% endraw %}
