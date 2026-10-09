---
layout: "note"
title: "19_euler-formula_plot.py"
display_title: "19_euler-formula_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "19"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/euler-formula/"
parent_title: "복소수의 극형식과 오일러 공식"
description: "대학수학 · 복소수의 극형식과 오일러 공식 코드 코드"
permalink: "/studies/college-math/code/19_euler-formula_plot/"
---
{% raw %}
[복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 복소수의 극형식과 오일러 공식 문서의 그림을 만든다: 19_euler-formula_fig1.svg, 19_euler-formula_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_euler-formula_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_euler-formula"
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

# 그림 1: 1 + i를 거듭 곱하면 거리는 √2배씩, 각은 π/4씩 늘어 (1 + i)⁸ = 16에 닿는다
pw = [(1 + 1j) ** k for k in range(9)]
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot([z.real for z in pw], [z.imag for z in pw], color=INK, lw=0.8, ls=":")
for k, z in enumerate(pw):
    ax.plot([0, z.real], [0, z.imag], color=C[0], lw=0.8, alpha=0.5)
    ax.plot([z.real], [z.imag], "o", color=C[1] if k == 8 else C[0], ms=5)
    off = {0: (0.3, -1.1), 1: (0.4, 0.1), 2: (0.4, 0.2), 3: (-1.6, 0.4), 4: (-1.2, 0.6), 5: (-2.2, -0.9), 6: (0.4, -0.3), 7: (0.4, -0.6), 8: (-0.4, 0.8)}[k]
    ax.text(z.real + off[0], z.imag + off[1], f"$k={k}$", fontsize=9)
ax.axhline(0, color=INK, lw=0.6)
ax.axvline(0, color=INK, lw=0.6)
ax.set_aspect("equal")
ax.set_xlim(-6, 18)
ax.set_ylim(-10, 4)
ax.set_title("$(1 + i)^k$, $k = 0, 1, \\ldots, 8$", fontsize=11)
save(fig, 1)

# 그림 2: 1의 세제곱근과 다섯제곱근. 단위원을 똑같이 나눈 점이고 합이 0이다
fig, axs = plt.subplots(1, 2, figsize=(6.5, 3))
t = np.linspace(0, 2 * np.pi, 400)
for ax, n, col in zip(axs, (3, 5), (C[0], C[2])):
    w = [np.exp(2j * np.pi * k / n) for k in range(n)]
    ax.plot(np.cos(t), np.sin(t), color=INK, lw=0.8)
    ax.fill([z.real for z in w], [z.imag for z in w], color=col, alpha=0.12)
    ax.plot([z.real for z in w], [z.imag for z in w], "o", color=col)
    for z in w:
        ax.plot([0, z.real], [0, z.imag], color=col, lw=1)
    ax.plot([0], [0], "o", color=INK, ms=4)
    ax.set_title(f"$z^{n} = 1$", fontsize=11)
    ax.set_aspect("equal")
    ax.set_xlim(-1.3, 1.3)
    ax.set_ylim(-1.3, 1.3)
    ax.axis("off")
save(fig, 2)

if __name__ == "__main__":
    # (1 + i)^8 = 16, 거리 √2배와 각 π/4씩, 세제곱근·다섯제곱근의 합 0
    assert pw[8] == 16
    for k in range(1, 9):
        assert abs(abs(pw[k]) / abs(pw[k - 1]) - math.sqrt(2)) < 1e-12
    for n in (3, 5):
        assert abs(sum(np.exp(2j * np.pi * k / n) for k in range(n))) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
