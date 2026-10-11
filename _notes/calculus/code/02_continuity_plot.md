---
layout: "note"
title: "02_continuity_plot.py"
display_title: "02_continuity_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "02"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/continuity/"
parent_title: "연속과 사잇값 정리"
description: "미분적분학 · 연속과 사잇값 정리 그림 생성 코드"
permalink: "/studies/calculus/code/02_continuity_plot/"
---
{% raw %}
[연속과 사잇값 정리](/Hongs_Blog/studies/calculus/continuity/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속과 사잇값 정리 문서의 그림을 만든다: 02_continuity_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 02_continuity_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "02_continuity"
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


def f(x):
    return x ** 3 - x - 2


def bisect_steps(a, b, n):
    steps = []
    for _ in range(n):
        m = (a + b) / 2
        steps.append((a, b, m))
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return steps, (a, b)


STEPS, LAST = bisect_steps(1.0, 2.0, 5)

# 그림 1: 곡선과, 이분법이 남기는 구간이 단계마다 절반으로 줄어드는 모습
fig, (a1, a2) = plt.subplots(2, 1, figsize=(6, 3.8), sharex=True, gridspec_kw={"height_ratios": [1.3, 1]})
x = np.linspace(0.95, 2.05, 300)
a1.plot(x, f(x), color=C[0], lw=2)
a1.axhline(0, color=INK, lw=0.6)
a1.plot([1, 2], [f(1), f(2)], "o", color=C[1], ms=5)
a1.text(1.03, -0.9, "$f(1)=-2$", fontsize=10)
a1.text(1.95, 4.0, "$f(2)=4$", fontsize=10, ha="right", va="center")
a1.set_ylabel("$f(x)$")
for i, (a, b, m) in enumerate(STEPS):
    y = len(STEPS) - i
    a2.plot([a, b], [y, y], color=C[2], lw=3, solid_capstyle="butt")
    a2.plot([m], [y], "|", color=C[1], ms=10, mew=2)
    a2.text(0.97, y, f"{i + 1}", va="center", ha="right", fontsize=9)
root = 1.5213797068
a2.axvline(root, color=INK, lw=0.8, ls=":")
a1.axvline(root, color=INK, lw=0.8, ls=":")
a2.set_yticks([])
a2.spines["left"].set_visible(False)
a2.set_ylim(0.3, len(STEPS) + 0.7)
a2.set_xlabel("$x$   (초록 막대: 단계마다 보는 구간, 주황 눈금: 중점)")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 중점과 남는 구간, 근 1.52138
    assert [m for _, _, m in STEPS] == [1.5, 1.75, 1.625, 1.5625, 1.53125]
    assert LAST == (1.5, 1.53125)
    assert abs(f(root)) < 1e-8 and abs(root - 1.52138) < 1e-5
    print("ALL CHECKS PASSED")
```
{% endraw %}
