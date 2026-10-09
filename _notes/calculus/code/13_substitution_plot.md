---
layout: "note"
title: "13_substitution_plot.py"
display_title: "13_substitution_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "13"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/substitution/"
parent_title: "치환적분"
description: "미분적분학 · 치환적분 코드 코드"
permalink: "/studies/calculus/code/13_substitution_plot/"
---
{% raw %}
[치환적분](/Hongs_Blog/studies/calculus/substitution/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 치환적분 문서의 그림을 만든다: 13_substitution_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 13_substitution_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "13_substitution"
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


def mid_sum(g, a, b, n=100000):
    dx = (b - a) / n
    return sum(g(a + (i + 0.5) * dx) for i in range(n)) * dx


AREA = (math.e - 1) / 2

# 그림 1: 치환 전 x e^{x^2}와 치환 후 (1/2) e^u. 모양은 달라도 [0, 1] 위의 넓이가 같다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3), sharey=True)
x = np.linspace(0, 1, 200)
a1.plot(x, x * np.exp(x ** 2), color=C[0], lw=2)
a1.fill_between(x, x * np.exp(x ** 2), color=C[0], alpha=0.2)
a1.set_title(r"$x\,e^{x^2}$,  $x$: 0 → 1", fontsize=10)
a1.set_xlabel("$x$")
a1.text(0.55, 0.2, f"넓이 {AREA:.3f}", fontsize=10)
a2.plot(x, 0.5 * np.exp(x), color=C[1], lw=2)
a2.fill_between(x, 0.5 * np.exp(x), color=C[1], alpha=0.2)
a2.set_title(r"$\frac{1}{2}e^{u}$,  $u=x^2$: 0 → 1", fontsize=10)
a2.set_xlabel("$u$")
a2.text(0.3, 0.3, f"넓이 {AREA:.3f}", fontsize=10)
a1.set_ylim(0, 2.9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 두 넓이가 모두 (e - 1)/2 ≈ 0.859
    assert abs(mid_sum(lambda t: t * math.exp(t * t), 0, 1) - AREA) < 1e-9
    assert abs(mid_sum(lambda u: 0.5 * math.exp(u), 0, 1) - AREA) < 1e-9
    assert abs(AREA - 0.859) < 5e-4
    print("ALL CHECKS PASSED")
```
{% endraw %}
