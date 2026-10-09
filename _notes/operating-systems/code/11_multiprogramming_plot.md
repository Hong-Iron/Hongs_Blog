---
layout: "note"
title: "11_multiprogramming_plot.py"
display_title: "11_multiprogramming_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "11"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/multiprogramming/"
parent_title: "다중 프로그래밍"
description: "운영체제 · 다중 프로그래밍 코드 코드"
permalink: "/studies/operating-systems/code/11_multiprogramming_plot/"
---
{% raw %}
[다중 프로그래밍](/Hongs_Blog/studies/operating-systems/multiprogramming/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 다중 프로그래밍 문서의 그림을 만든다: 11_multiprogramming_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_multiprogramming_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_multiprogramming"
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


def util(p, n):
    return 1 - p ** n          # n개가 모두 동시에 기다릴 때만 프로세서가 쉰다


N = np.arange(1, 11)

# 그림 1: 메모리에 올린 프로그램 수에 따른 프로세서 사용률
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, p in enumerate([0.5, 0.8, 0.9]):
    ax.plot(N, 100 * util(p, N), "-o", color=C[i], ms=4, lw=1.6, label=f"$p$ = {p} (시간의 {int(p * 100)}%를 기다림)")
for n in (1, 3, 5):
    u = 100 * util(0.8, n)
    ax.text(n - 0.08, u + 1.5, f"{u:.1f}%", ha="right", va="bottom", fontsize=9, color=C[1])
ax.set_xlabel("메모리에 올린 프로그램 수 $n$")
ax.set_ylabel("프로세서 사용률 (%)")
ax.set_xticks(N)
ax.set_xlim(0.3, 10.3)
ax.set_ylim(0, 105)
ax.legend(loc="lower right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    assert abs(util(0.8, 1) - 0.2) < 1e-12           # 문서: 20%
    assert abs(util(0.8, 3) - 0.488) < 1e-12         # 48.8%
    assert round(util(0.8, 5), 2) == 0.67            # 약 67%
    print("ALL CHECKS PASSED")
```
{% endraw %}
