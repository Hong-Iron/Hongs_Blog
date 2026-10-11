---
layout: "note"
title: "18_complex-numbers_plot.py"
display_title: "18_complex-numbers_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/complex-numbers/"
parent_title: "복소수"
description: "대학수학 · 복소수 그림 생성 코드"
permalink: "/studies/college-math/code/18_complex-numbers_plot/"
---
{% raw %}
[복소수](/Hongs_Blog/studies/college-math/complex-numbers/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 복소수 문서의 그림을 만든다: 18_complex-numbers_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_complex-numbers_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_complex-numbers"
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

Z = complex(-1, 2)

# 그림 1: x² + 2x + 5 = 0의 두 근 −1 ± 2i는 가로축(실수축)에 대해 대칭인 두 점이다
fig, ax = plt.subplots(figsize=(6, 3.6))
for z, col, lab in [(Z, C[0], "$-1 + 2i$"), (Z.conjugate(), C[1], "$-1 - 2i$")]:
    ax.plot([z.real], [z.imag], "o", color=col)
    ax.text(z.real + 0.15, z.imag + 0.15, lab, fontsize=10, color=col)
ax.plot([Z.real, Z.real], [Z.imag, -Z.imag], color=INK, lw=0.8, ls=":")
ax.plot([0, Z.real], [0, Z.imag], color=C[0], lw=1.4)
ax.text(-0.95, 0.75, "$|z| = \\sqrt{5}$", fontsize=10, color=C[0], ha="right")
ax.axhline(0, color=INK, lw=0.8)
ax.axvline(0, color=INK, lw=0.8)
ax.text(2.7, 0.12, "실수부", fontsize=10, ha="right")
ax.text(0.1, 2.75, "허수부", fontsize=10)
ax.set_aspect("equal")
ax.set_xlim(-3, 3)
ax.set_ylim(-3, 3)
save(fig, 1)

if __name__ == "__main__":
    # 두 근이 방정식을 만족하고 서로 켤레, 크기 √5
    for z in (Z, Z.conjugate()):
        assert abs(z * z + 2 * z + 5) < 1e-12
    assert abs(abs(Z) - math.sqrt(5)) < 1e-15
    print("ALL CHECKS PASSED")
```
{% endraw %}
