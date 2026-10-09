---
layout: "note"
title: "08_mean-value-theorem_plot.py"
display_title: "08_mean-value-theorem_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "08"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/mean-value-theorem/"
parent_title: "평균값 정리"
description: "미분적분학 · 평균값 정리 코드 코드"
permalink: "/studies/calculus/code/08_mean-value-theorem_plot/"
---
{% raw %}
[평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 평균값 정리 문서의 그림을 만든다: 08_mean-value-theorem_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 08_mean-value-theorem_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "08_mean-value-theorem"
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


# 그림 1: 왼쪽 x^2의 [0, 2]에서 할선과 평행한 접선(c = 1). 오른쪽 |x|는 평행한 접선이 없다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
x = np.linspace(-0.2, 2.2, 200)
a1.plot(x, x ** 2, color=INK, lw=2.2)
slope = (2 ** 2 - 0) / (2 - 0)
a1.plot([0, 2], [0, 4], color=C[0], lw=1.5, label="할선(기울기 2)")
a1.plot(x, 1 + slope * (x - 1), color=C[1], lw=1.5, ls="--", label="$c=1$의 접선")
a1.plot([0, 2], [0, 4], "o", ms=5, color=C[0])
a1.plot([1], [1], "o", ms=5, color=C[1])
a1.set_ylim(-1, 4.8)
a1.set_title("$f(x)=x^2$, 구간 $[0,2]$", fontsize=10)
a1.legend(loc="upper left", fontsize=8)
a1.set_xlabel("$x$")
x = np.linspace(-1.2, 1.2, 200)
a2.plot(x, np.abs(x), color=INK, lw=2.2)
a2.plot([-1, 1], [1, 1], color=C[0], lw=1.5, label="할선(기울기 0)")
a2.plot([-1, 1], [1, 1], "o", ms=5, color=C[0])
a2.text(0, -0.06, "꺾인 점", ha="center", va="top", fontsize=9)
a2.set_ylim(-0.3, 1.5)
a2.set_title("$|x|$, 구간 $[-1,1]$: 기울기는 $\\pm1$뿐", fontsize=10)
a2.legend(loc="upper center", fontsize=8)
a2.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 평균 변화율 2와 c = 1, |x|의 평균 변화율 0과 도함수 ±1
    assert slope == 2 and 2 * 1 == slope
    assert (abs(1) - abs(-1)) / 2 == 0
    h = 1e-6
    for x0 in [-0.9, -0.3, 0.2, 0.8]:
        d = (abs(x0 + h) - abs(x0 - h)) / (2 * h)
        assert abs(abs(d) - 1) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
