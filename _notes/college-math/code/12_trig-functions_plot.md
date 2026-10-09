---
layout: "note"
title: "12_trig-functions_plot.py"
display_title: "12_trig-functions_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "12"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/trig-functions/"
parent_title: "삼각함수"
description: "대학수학 · 삼각함수 코드 코드"
permalink: "/studies/college-math/code/12_trig-functions_plot/"
---
{% raw %}
[삼각함수](/Hongs_Blog/studies/college-math/trig-functions/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 삼각함수 문서의 그림을 만든다: 12_trig-functions_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 12_trig-functions_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "12_trig-functions"
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

TH = math.pi / 6

# 그림 1: 단위원 위의 점 P(π/6)의 가로·세로 좌표(왼쪽)가 코사인·사인 그래프(오른쪽)의 값이다
fig, axs = plt.subplots(1, 2, figsize=(6.5, 3), gridspec_kw={"width_ratios": [1, 1.9]})
ax = axs[0]
t = np.linspace(0, 2 * np.pi, 400)
ax.plot(np.cos(t), np.sin(t), color=INK, lw=1)
px, py = math.cos(TH), math.sin(TH)
ax.plot([0, px], [0, py], color=INK, lw=1)
ax.plot([0, px], [0, 0], color=C[0], lw=3)
ax.plot([px, px], [0, py], color=C[1], lw=3)
ax.plot([px], [py], "o", color=INK)
ax.text(0.92, 0.78, "$P(\\pi/6)$", fontsize=10)
ax.text(px / 2, -0.22, "$\\cos$", color=C[0], ha="center", fontsize=10)
ax.text(px + 0.06, py / 2, "$\\sin$", color=C[1], va="center", fontsize=10)
ax.axhline(0, color=INK, lw=0.5)
ax.axvline(0, color=INK, lw=0.5)
ax.set_aspect("equal")
ax.set_xlim(-1.2, 1.5)
ax.set_ylim(-1.2, 1.2)
ax.set_xticks([-1, 0, 1])
ax.set_yticks([-1, 0, 1])
ax = axs[1]
th = np.linspace(0, 2 * np.pi, 400)
ax.plot(th, np.sin(th), color=C[1], lw=2, label="$\\sin\\theta$")
ax.plot(th, np.cos(th), color=C[0], lw=2, label="$\\cos\\theta$")
ax.axvline(TH, color=INK, lw=0.8, ls=":")
ax.plot([TH, TH], [py, px], "o", color=INK, ms=5)
ax.axhline(0, color=INK, lw=0.5)
ax.set_xticks([0, np.pi / 2, np.pi, 3 * np.pi / 2, 2 * np.pi])
ax.set_xticklabels(["0", "$\\pi/2$", "$\\pi$", "$3\\pi/2$", "$2\\pi$"])
ax.set_yticks([-1, 0, 1])
ax.set_xlabel("$\\theta$")
ax.legend(loc="lower left", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # P(π/6) = (√3/2, 1/2), 사인과 코사인은 π/2만큼 어긋남
    assert abs(px - math.sqrt(3) / 2) < 1e-15 and abs(py - 0.5) < 1e-15
    assert np.allclose(np.sin(th + np.pi / 2), np.cos(th))
    print("ALL CHECKS PASSED")
```
{% endraw %}
