---
layout: "note"
title: "03_inverse-function_plot.py"
display_title: "03_inverse-function_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "03"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/inverse-function/"
parent_title: "역함수"
description: "대학수학 · 역함수 코드 코드"
permalink: "/studies/college-math/code/03_inverse-function_plot/"
---
{% raw %}
[역함수](/Hongs_Blog/studies/college-math/inverse-function/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 역함수 문서의 그림을 만든다: 03_inverse-function_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 03_inverse-function_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "03_inverse-function"
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

# 그림 1: x ≥ 0으로 자른 x²와 그 역함수 √x는 y = x에 대해 대칭이다
fig, ax = plt.subplots(figsize=(6, 3.6))
xl = np.linspace(-2.2, 0, 200)
xr = np.linspace(0, 2.2, 200)
ax.plot(xl, xl ** 2, color=C[0], lw=1.4, ls=":", label="$x^2$ ($x < 0$, 잘라 냄)")
ax.plot(xr, xr ** 2, color=C[0], lw=2.2, label="$x^2$ ($x \\geq 0$)")
xs = np.linspace(0, 4.84, 300)
ax.plot(xs, np.sqrt(xs), color=C[1], lw=2.2, label="$\\sqrt{x}$")
d = np.linspace(-2.2, 5, 10)
ax.plot(d, d, color=INK, lw=0.9, ls="--")
ax.text(3.2, 4.55, "$y = x$", fontsize=10)
ax.plot([2], [4], "o", color=C[0])
ax.plot([4], [2], "o", color=C[1])
ax.plot([-2], [4], "o", color=C[0], mfc="none")
ax.plot([2, 4], [4, 2], color=INK, lw=0.8, ls=":")
ax.text(2.25, 3.8, "(2, 4)", fontsize=10)
ax.text(4.05, 1.55, "(4, 2)", fontsize=10)
ax.text(-1.8, 3.85, "(-2, 4)", fontsize=10)
ax.set_aspect("equal")
ax.set_xlim(-2.4, 5)
ax.set_ylim(-0.6, 5)
ax.axhline(0, color=INK, lw=0.6)
ax.axvline(0, color=INK, lw=0.6)
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5))
save(fig, 1)

if __name__ == "__main__":
    # (2, 4)는 x² 위, (4, 2)는 √x 위. x² 전체에서는 2와 −2가 같은 4로 간다
    assert 2 ** 2 == 4 and math.sqrt(4) == 2 and (-2) ** 2 == 4
    xs_chk = np.linspace(0, 3, 50)
    assert np.allclose(np.sqrt(xs_chk ** 2), xs_chk)
    print("ALL CHECKS PASSED")
```
{% endraw %}
